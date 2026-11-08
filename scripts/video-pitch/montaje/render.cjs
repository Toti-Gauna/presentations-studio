const { chromium } = require('playwright');
const [, , dir, out, desde, hasta, paso] = process.argv;   // segundos; paso opcional para pruebas
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(`file://${dir}/montaje.html`);
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(800);
  const f0 = Math.round(Number(desde) * 30), f1 = Math.round(Number(hasta) * 30), st = paso ? Math.round(Number(paso) * 30) : 1;
  for (let f = f0; f < f1; f += st) {
    await p.evaluate((t) => window.ir(t), f / 30);
    await p.screenshot({ path: `${out}/f${String(f).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 90 });
  }
  console.log('listo', desde, hasta, errs.slice(0, 3).join(' | '));
  await b.close();
})();
