// Cuadros del video v3: node render.cjs <plan.json> <carpeta> <desde> <hasta>  (servidor sin HMR en 127.0.0.1:5191)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const S = '/tmp/claude-0/-home-user/10ab011c-6752-54be-831e-b3c4da2461d0/scratchpad';
(async () => {
  const [, , planPath, out, desde, hasta] = process.argv;
  const plan = JSON.parse(fs.readFileSync(planPath, 'utf8'));
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await p.route('**/__camara/**', (r) => r.fulfill({ path: `${S}/v4/camara/${path.basename(new URL(r.request().url()).pathname)}` }));
  const ultimo = fs.readdirSync(`${S}/frames-p`).filter((f) => f.endsWith('.jpg')).sort().pop();
  await p.route('**/__final/**', (r) => {
    const f = `${S}/frames-p/${path.basename(new URL(r.request().url()).pathname)}`;
    return r.fulfill({ path: fs.existsSync(f) ? f : `${S}/frames-p/${ultimo}` });
  });
  await p.goto('http://127.0.0.1:5191/montaje/?deck=handyx-aticma');
  await p.waitForFunction(() => typeof window.cargar === 'function', null, { timeout: 60000 });
  await p.evaluate((pl) => window.cargar(pl), plan);
  await p.waitForTimeout(800);
  const f0 = Math.round(Number(desde) * 30);
  const f1 = Math.min(Math.round(Number(hasta) * 30), Math.round(plan.dur * 30));
  for (let f = f0; f < f1; f++) {
    const archivo = `${out}/f${String(f).padStart(5, '0')}.jpg`;
    if (fs.existsSync(archivo)) continue;
    await p.evaluate((t) => window.ir(t), f / 30);
    await p.screenshot({ path: archivo, type: 'jpeg', quality: 92 });
  }
  console.log('listo', desde, hasta, errs.slice(0, 3).join(' | ') || 'sin errores');
  await b.close();
})();
