// Renderiza un trailer de kinetic-studio a frames JPEG (varios workers) + audio WAV (OfflineAudioContext).
// Uso: node scripts/trailers/render.cjs <id> <outDir> [desde] [hasta] [workers] [base]
//   sin desde/hasta: la película entera + el audio. Con rango: solo esos frames (pruebas).
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const [, , id, out, from = '0', to = '', workersArg = '4', base = 'http://127.0.0.1:4180'] = process.argv;
const FPS = 30;
const W = +(process.env.W || 1440);
const H = +(process.env.H || 1080);
const url = `${base}/trailers/${id}/index.html?t=0.01`;
const CSS_INTER = `
@font-face { font-family: 'Inter'; font-style: normal; font-weight: 100 900; font-display: block; src: url('${base}/fonts/inter-latin-ext.woff2') format('woff2'); unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF; }
@font-face { font-family: 'Inter'; font-style: normal; font-weight: 100 900; font-display: block; src: url('${base}/fonts/inter-latin.woff2') format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }`;
const ARGS = ['--enable-unsafe-swiftshader', '--mute-audio', '--autoplay-policy=no-user-gesture-required'];

async function abrir(browser) {
  const p = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  // Google Fonts no responde desde este entorno: se atiende la hoja de Inter con los archivos locales (ks/public/fonts).
  await p.route('https://fonts.googleapis.com/**', (r) => r.fulfill({ contentType: 'text/css', body: CSS_INTER }));
  await p.route('https://fonts.gstatic.com/**', (r) => r.abort());
  p.on('pageerror', (e) => console.log('[pageerror]', String(e).slice(0, 200)));
  await p.goto(url, { waitUntil: 'load' });
  await p.waitForFunction(
    () => document.documentElement.dataset.trailer === 'ready' || String(document.documentElement.dataset.trailer).startsWith('error'),
    null,
    { timeout: 90000 },
  );
  const estado = await p.evaluate(() => document.documentElement.dataset.trailer);
  if (estado !== 'ready') throw new Error('trailer: ' + estado);
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => gsap.ticker.sleep());
  return p;
}

const ir = (t) => {
  const { tl } = trailer;
  tl.pause();
  tl.time(t);
  gsap.ticker.tick();
  document.getAnimations().forEach((a) => {
    a.pause();
    a.currentTime = tl.time() * 1000;
  });
};

async function audio(salida) {
  const browser = await chromium.launch({ args: ARGS });
  try {
    const p = await abrir(browser);
    const t0 = Date.now();
    const b64 = await p.evaluate(async () => {
      const buf = await trailer.renderAudio({ sampleRate: 48000, seed: 1 });
      const n = buf.length;
      const L = buf.getChannelData(0);
      const R = buf.getChannelData(Math.min(1, buf.numberOfChannels - 1));
      const bytes = new Uint8Array(44 + n * 4);
      const dv = new DataView(bytes.buffer);
      const w = (o, s) => [...s].forEach((c, i) => dv.setUint8(o + i, c.charCodeAt(0)));
      w(0, 'RIFF'); dv.setUint32(4, 36 + n * 4, true); w(8, 'WAVE'); w(12, 'fmt ');
      dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 2, true);
      dv.setUint32(24, 48000, true); dv.setUint32(28, 48000 * 4, true); dv.setUint16(32, 4, true); dv.setUint16(34, 16, true);
      w(36, 'data'); dv.setUint32(40, n * 4, true);
      let pico = 0;
      for (let i = 0; i < n; i++) {
        const l = Math.max(-1, Math.min(1, L[i]));
        const r = Math.max(-1, Math.min(1, R[i]));
        pico = Math.max(pico, Math.abs(l), Math.abs(r));
        dv.setInt16(44 + i * 4, l * 32767, true);
        dv.setInt16(46 + i * 4, r * 32767, true);
      }
      let s = '';
      for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
      return { b64: btoa(s), pico, dur: n / 48000 };
    });
    fs.writeFileSync(salida, Buffer.from(b64.b64, 'base64'));
    console.log(`audio: ${b64.dur.toFixed(2)} s, pico ${b64.pico.toFixed(3)}, ${((Date.now() - t0) / 1000).toFixed(1)} s de render`);
  } finally {
    await browser.close();
  }
}

async function trabajador(k, desde, hasta, carpeta) {
  const browser = await chromium.launch({ args: ARGS });
  try {
    const p = await abrir(browser);
    const t0 = Date.now();
    for (let i = desde; i < hasta; i++) {
      const t = Math.min(i / FPS, (await p.evaluate(() => trailer.tl.duration())) - 0.001);
      await p.evaluate(ir, t);
      await p.screenshot({ path: path.join(carpeta, `${String(i).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 95, clip: { x: 0, y: 0, width: W, height: H } });
      if ((i - desde) % 150 === 149) console.log(`worker ${k}: ${i - desde + 1}/${hasta - desde} (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
    }
  } finally {
    await browser.close();
  }
}

(async () => {
  const frames = path.join(out, 'frames');
  fs.mkdirSync(frames, { recursive: true });
  const probe = await chromium.launch({ args: ARGS });
  const p0 = await abrir(probe);
  const dur = await p0.evaluate(() => trailer.tl.duration());
  await probe.close();
  const total = Math.round(dur * FPS);
  const a = +from;
  const b = to ? +to : total;
  const completo = a === 0 && b === total;
  console.log(`${id}: ${dur} s, ${total} frames; render ${a}..${b}${completo ? ' + audio' : ''}`);
  const NW = +workersArg;
  const por = Math.ceil((b - a) / NW);
  const jobs = [];
  for (let k = 0; k < NW; k++) {
    const d = a + k * por;
    const h = Math.min(b, d + por);
    if (d < h) jobs.push(trabajador(k, d, h, frames));
  }
  if (completo) jobs.push(audio(path.join(out, 'audio.wav')));
  await Promise.all(jobs);
  console.log('listo');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
