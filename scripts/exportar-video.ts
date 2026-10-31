// Video MP4 (H.264) del recorrido principal: graba la pantalla pública avanzando cada paso según la
// duración prevista de su escena. Sin audio (los medios con sonido quedan en póster). Requiere build y ffmpeg.
// Uso: npm run exportar:video -- --deck=handyx --version=aticma [--acelerar=4]
import { mkdirSync, readdirSync, renameSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { args, playwright, servirDist } from './util.ts';
import { escenasDeVersion } from '../src/core/validar.ts';
import { Deck } from '../src/core/esquema.ts';

const a = args();
const deckId = a['deck'] ?? 'handyx';
const version = a['version'] ?? 'aticma';
const acelerar = Number(a['acelerar'] ?? 1);
const deck = Deck.parse(JSON.parse(readFileSync(`decks/${deckId}/deck.json`, 'utf8')));
const escenas = escenasDeVersion(deck, version, false);
const srv = await servirDist();
const navegador = await playwright().chromium.launch();
const tmp = 'salida/video/tmp';
mkdirSync(tmp, { recursive: true });
try {
  const ctx = await navegador.newContext({ viewport: { width: 1920, height: 1080 }, recordVideo: { dir: tmp, size: { width: 1920, height: 1080 } } });
  const p = await ctx.newPage();
  await p.goto(`${srv.url}/presentar/?deck=${deckId}&version=${version}`);
  await p.waitForTimeout(1500);
  for (const [i, e] of escenas.entries()) {
    const porPaso = (e.duracion * 1000) / e.pasos / acelerar;
    for (let k = 0; k < e.pasos; k++) {
      await p.waitForTimeout(porPaso);
      if (!(i === escenas.length - 1 && k === e.pasos - 1)) await p.keyboard.press('ArrowRight');
    }
  }
  await p.waitForTimeout(1000);
  await ctx.close();
  const webm = readdirSync(tmp).find((f) => f.endsWith('.webm'));
  if (!webm) throw new Error('no se generó el video');
  const salida = `salida/video/${deckId}-${version}.mp4`;
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', `${tmp}/${webm}`, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'medium', '-crf', '20', '-movflags', '+faststart', `${tmp}/out.mp4`]);
  renameSync(`${tmp}/out.mp4`, salida);
  console.log(`MP4 → ${salida}`);
} finally {
  await navegador.close();
  await srv.cerrar();
  rmSync(tmp, { recursive: true, force: true });
}
