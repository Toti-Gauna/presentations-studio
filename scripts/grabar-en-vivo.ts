// Grabación «en vivo» en alta calidad: la pantalla pública cuadro a cuadro con el reloj controlado (Playwright clock), así las
// transiciones, cascadas y conteos salen exactos y nítidos, sin cuadros perdidos. Se maneja como en vivo: el presentador avanza
// y la pantalla pública sigue. Los pasos que son un video a pantalla completa se empalman desde su archivo, con su sonido; el resto
// queda sin audio (los efectos suenan en vivo). Requiere `npm run build` y ffmpeg.
// Uso: npm run grabar:vivo -- --deck=handyx-aticma --version=evento [--anexos=no] [--por-anexo=6.5] [--fps=30] [--partes=3]
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { args, playwright, servirDist } from './util.ts';
import { escenasDeVersion } from '../src/core/validar.ts';
import { Deck } from '../src/core/esquema.ts';

const a = args();
const deckId = a['deck'] ?? 'handyx-aticma';
const version = a['version'] ?? 'evento';
const conAnexos = a['anexos'] !== 'no';
const porAnexo = Number(a['por-anexo'] ?? 6.5);
const fps = Number(a['fps'] ?? 30);
const nPartes = Math.max(1, Number(a['partes'] ?? 3));
const deck = Deck.parse(JSON.parse(readFileSync(`decks/${deckId}/deck.json`, 'utf8')));
const tema = JSON.parse(readFileSync(`brands/${deck.tema}/tema.json`, 'utf8')) as { assetsDe?: string };
const v = deck.versiones.find((x) => x.id === version);
if (!v) throw new Error(`versión desconocida: ${version}`);
const principales = v.escenas.length;
const escenas = escenasDeVersion(deck, version, conAnexos);
const archivoDe = (id: string) => `brands/${tema.assetsDe ?? deck.tema}/assets/${deck.recursos.find((r) => r.id === id)?.archivo}`;
const duracionDe = (f: string) => Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim());
const ff = (...x: string[]) => execFileSync('ffmpeg', ['-y', '-v', 'error', ...x]);

type Tramo = { escena: number; paso: number; seg: number; clip?: string };
// Cada paso es un tramo. Principales: la duración del guion (los clips descuentan su largo); anexos: un tiempo fijo por paso.
const plan: Tramo[][] = escenas.map((e, i) => {
  const clipDe = (k: number) => (e.elementos.find((x) => x.tipo === 'video' && x.cubrir && x.auto && x.paso === k) as { recurso: string } | undefined)?.recurso;
  const clips = Array.from({ length: e.pasos }, (_, k) => clipDe(k));
  const durClips = clips.reduce((s, c) => s + (c ? duracionDe(archivoDe(c)) : 0), 0);
  const libres = clips.filter((c) => !c).length;
  const porPaso = i < principales ? Math.max(6, (e.duracion - durClips) / Math.max(1, libres)) : porAnexo;
  return clips.map((c, k) => (c ? { escena: i, paso: k, seg: duracionDe(archivoDe(c)), clip: archivoDe(c) } : { escena: i, paso: k, seg: porPaso }));
});
// Partes en paralelo: escenas contiguas con tiempo de captura parecido.
const capt = plan.map((ts) => ts.filter((t) => !t.clip).reduce((s, t) => s + t.seg, 0));
const objetivo = capt.reduce((s, x) => s + x, 0) / nPartes;
const partes: number[][] = [[]];
let acum = 0;
plan.forEach((_, i) => {
  if (acum >= objetivo && partes.length < nPartes) { partes.push([]); acum = 0; }
  (partes[partes.length - 1] as number[]).push(i);
  acum += capt[i] as number;
});

const tmp = `salida/vivo-tmp`;
rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp, { recursive: true });
const srv = await servirDist();
type Seg = { cuadros?: [string, number, number]; clip?: string };
async function grabar(p: number, indices: number[]): Promise<Seg[]> {
  const dir = `${tmp}/parte-${p}`;
  mkdirSync(dir, { recursive: true });
  const nav = await playwright().chromium.launch();
  try {
    const ctx = await nav.newContext({ viewport: { width: 1920, height: 1080 } });
    const pres = await ctx.newPage();
    const pub = await ctx.newPage();
    await pub.clock.install();
    const q = `deck=${deckId}&version=${version}`;
    await pres.goto(`${srv.url}/presentador/?${q}`);
    await pub.goto(`${srv.url}/presentar/?${q}&sonido=no`);
    await pres.waitForTimeout(1500);
    await pub.clock.runFor(2000);
    const items = pres.locator('.indice li:not(.separador-anexos) .item');
    const visible = () => pub.evaluate(() => (([...document.querySelectorAll('section.escena')].pop() as HTMLElement | undefined)?.dataset['escena'] ?? ''));
    const ir = async (i: number) => {
      await items.nth(i).click();
      for (let k = 0; k < 150 && (await visible()) !== escenas[i]?.id; k++) await pres.waitForTimeout(20);
    };
    const primera = indices[0] as number;
    if (primera > 0) { await ir(primera - 1); await pub.clock.runFor(3000); } // así la primera entra «hacia adelante», con su animación
    const segs: Seg[] = [];
    let n = 0;
    for (const i of indices) {
      for (const t of plan[i] as Tramo[]) {
        if (t.paso === 0) { if (i !== primera || primera > 0) await ir(i); }
        else { await pres.keyboard.press('ArrowRight'); await pres.waitForTimeout(150); }
        if (t.clip) { segs.push({ clip: t.clip }); await pub.clock.runFor(t.seg * 1000); continue; }
        const total = Math.round(t.seg * fps);
        for (let f = 0; f < total; f++) {
          await pub.screenshot({ path: `${dir}/f${String(n + f).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 92 });
          await pub.clock.runFor(1000 / fps);
        }
        const ultimo = segs[segs.length - 1];
        if (ultimo?.cuadros && ultimo.cuadros[1] + ultimo.cuadros[2] === n) ultimo.cuadros[2] += total;
        else segs.push({ cuadros: [dir, n, total] });
        n += total;
      }
    }
    console.log(`parte ${p + 1}: escenas ${primera + 1}–${(indices[indices.length - 1] as number) + 1}, ${n} cuadros`);
    return segs;
  } finally {
    await nav.close();
  }
}
try {
  const porParte = await Promise.all(partes.map((ix, p) => grabar(p, ix)));
  const comun = ['-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', String(fps), '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-ac', '2'];
  const archivos: string[] = [];
  porParte.flat().forEach((s, k) => {
    const out = `${tmp}/seg-${String(k).padStart(3, '0')}.mp4`;
    if (s.cuadros) {
      const [dir, desde, cuantos] = s.cuadros;
      const fade = k === 0 ? ['-vf', 'fade=t=in:st=0:d=0.8'] : [];
      ff('-framerate', String(fps), '-start_number', String(desde), '-i', `${dir}/f%05d.jpg`, '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo',
        '-frames:v', String(cuantos), '-map', '0:v', '-map', '1:a', '-shortest', ...fade, ...comun, out);
    } else if (s.clip && existsSync(s.clip)) {
      ff('-i', s.clip, '-vf', `scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=${fps}`, '-af', 'aresample=48000', ...comun, out);
    } else return;
    archivos.push(out);
  });
  writeFileSync(`${tmp}/lista.txt`, archivos.map((x) => `file '${x.split('/').pop()}'`).join('\n'));
  mkdirSync('salida/video', { recursive: true });
  const destino = `salida/video/${deckId}-${version}-en-vivo${conAnexos ? '' : '-sin-anexos'}.mp4`;
  ff('-f', 'concat', '-safe', '0', '-i', `${tmp}/lista.txt`, '-c', 'copy', '-movflags', '+faststart', destino);
  console.log(`MP4 → ${destino}`);
} finally {
  await srv.cerrar();
  if (a['conservar'] !== 'si') rmSync(tmp, { recursive: true, force: true });
}
