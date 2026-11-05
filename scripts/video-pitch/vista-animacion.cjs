// Hoja de contacto de una animación en varios puntos p (necesita el servidor de desarrollo: npx vite --port 5190).
// Uso: node scripts/video-pitch/vista-animacion.cjs <modulo> <p1,p2,...> <salida.png> [afirmaciones ID,ID] [paleta] [ancho]
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
(async () => {
  const [, , modulo, ps, out, afirmaciones = '', paleta = 'neutro', ancho = '760'] = process.argv;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  const q = new URLSearchParams({ deck: 'handyx-aticma', modulo, afirmaciones, paleta, congelar: '1' });
  await p.goto(`http://localhost:5190/animacion/?${q}`);
  await p.waitForFunction(() => window.listo !== undefined, null, { timeout: 30000 });
  await p.evaluate(() => window.listo);
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);
  const tiles = [];
  for (const [i, v] of ps.split(',').entries()) {
    await p.evaluate((x) => window.irA(Number(x)), v);
    await p.waitForTimeout(100);
    const f = `${out}.${i}.png`;
    await p.screenshot({ path: f });
    tiles.push(f);
  }
  await b.close();
  if (tiles.length === 1) fs.renameSync(tiles[0], out);
  else {
    execFileSync('montage', [...tiles, '-tile', `${tiles.length <= 4 ? 2 : 3}x`, '-geometry', `${ancho}x+4+4`, '-background', '#333', out]);
    for (const f of tiles) fs.unlinkSync(f);
  }
  console.log(errs.length ? `errores: ${errs.slice(0, 5).join(' | ')}` : 'sin errores');
})();
