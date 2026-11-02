// Video MP4 (H.264 + AAC) del recorrido principal para respaldo.
// Las escenas propias se graban desde la pantalla pública (sin audio: los efectos son en vivo) avanzando cada paso
// según la duración de la escena; las escenas que son clips de video se empalman con el archivo original (con su
// música), porque el Chromium de grabación no decodifica H.264. Requiere build y ffmpeg.
// Uso: npm run exportar:video -- --deck=handyx --version=aticma [--acelerar=4]
import { mkdirSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { args, playwright, servirDist } from './util.ts';
import { escenasDeVersion } from '../src/core/validar.ts';
import { Deck, type Escena } from '../src/core/esquema.ts';

const a = args();
const deckId = a['deck'] ?? 'handyx';
const version = a['version'] ?? 'aticma';
const acelerar = Number(a['acelerar'] ?? 1);
const deck = Deck.parse(JSON.parse(readFileSync(`decks/${deckId}/deck.json`, 'utf8')));
const tema = JSON.parse(readFileSync(`brands/${deck.tema}/tema.json`, 'utf8')) as { paletas: Record<string, { fondo: string }>; assetsDe?: string };
const escenas = escenasDeVersion(deck, version, false);
const ff = (...x: string[]) => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...x]);
const clipsDe = (e: Escena) => e.elementos.filter((x) => x.tipo === 'video' && x.cubrir && x.auto).map((x) => (x as { recurso: string }).recurso);
const esClip = (e: Escena) => clipsDe(e).length > 0 && clipsDe(e).length === e.pasos && e.elementos.every((x) => x.tipo === 'video');
const archivoDe = (id: string) => `brands/${tema.assetsDe ?? deck.tema}/assets/${deck.recursos.find((r) => r.id === id)?.archivo}`;

const tmp = 'salida/video/tmp';
rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp, { recursive: true });
const srv = await servirDist();
const nav = await playwright().chromium.launch();
const tramos: Array<{ escena: number; desde: number; hasta: number }> = [];
try {
  const ctx = await nav.newContext({ viewport: { width: 1920, height: 1080 }, recordVideo: { dir: tmp, size: { width: 1920, height: 1080 } } });
  const t0 = Date.now();
  const p = await ctx.newPage();
  await p.goto(`${srv.url}/presentar/?deck=${deckId}&version=${version}&sonido=no`);
  await p.waitForTimeout(1500);
  for (const [i, e] of escenas.entries()) {
    if (esClip(e)) {
      for (let k = 0; k < e.pasos; k++) await p.keyboard.press('ArrowRight');
      await p.waitForTimeout(400);
      continue;
    }
    const desde = (Date.now() - t0) / 1000 + 0.15;
    const porPaso = (e.duracion * 1000) / e.pasos / acelerar;
    for (let k = 0; k < e.pasos; k++) {
      await p.waitForTimeout(porPaso);
      if (k < e.pasos - 1) await p.keyboard.press('ArrowRight');
    }
    tramos.push({ escena: i, desde, hasta: (Date.now() - t0) / 1000 });
    if (i < escenas.length - 1) await p.keyboard.press('ArrowRight');
    await p.waitForTimeout(250);
  }
  await ctx.close();
  const webm = readdirSync(tmp).find((f) => f.endsWith('.webm'));
  if (!webm) throw new Error('no se generó la grabación');
  const partes: string[] = [];
  for (const [i, e] of escenas.entries()) {
    const salida = `${tmp}/parte-${String(i).padStart(2, '0')}.mp4`;
    const comun = ['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', '30', '-c:a', 'aac', '-ar', '48000', '-ac', '2'];
    if (esClip(e)) {
      const fondo = (tema.paletas[e.paleta] ?? tema.paletas['neutro'])?.fondo ?? '#000000';
      const entradas = clipsDe(e).flatMap((c) => ['-i', archivoDe(c)]);
      const n = clipsDe(e).length;
      const filtro = clipsDe(e).map((_, k) => `[${k}:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=${fondo.replace('#', '0x')},setsar=1,fps=30[v${k}];[${k}:a]aresample=48000[a${k}]`).join(';') + ';' + clipsDe(e).map((_, k) => `[v${k}][a${k}]`).join('') + `concat=n=${n}:v=1:a=1[v][a]`;
      ff(...entradas, '-filter_complex', filtro, '-map', '[v]', '-map', '[a]', ...comun, salida);
    } else {
      const t = tramos.find((x) => x.escena === i);
      if (!t) continue;
      ff('-ss', String(t.desde), '-to', String(t.hasta), '-i', `${tmp}/${webm}`, '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo', '-shortest', '-map', '0:v', '-map', '1:a', ...comun, salida);
    }
    partes.push(salida);
  }
  writeFileSync(`${tmp}/lista.txt`, partes.map((x) => `file '${x.split('/').pop()}'`).join('\n'));
  ff('-f', 'concat', '-safe', '0', '-i', `${tmp}/lista.txt`, '-c:v', 'libx264', '-preset', 'medium', '-crf', '21', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', `${tmp}/final.mp4`);
  const destino = `salida/video/${deckId}-${version}.mp4`;
  renameSync(`${tmp}/final.mp4`, destino);
  console.log(`MP4 → ${destino}`);
} finally {
  await nav.close();
  await srv.cerrar();
  rmSync(tmp, { recursive: true, force: true });
}
