// Renderiza una página animada cuadro a cuadro: node render.cjs <pagina.html> <carpeta> <desde> <hasta> [paso]
const { chromium } = require('playwright');
const [, , pagina, out, desde, hasta, paso] = process.argv;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto(`file://${pagina}`);
  await p.evaluate(() => window.listo); await p.waitForTimeout(300);
  const f0 = Math.round(Number(desde) * 30), f1 = Math.round(Number(hasta) * 30), st = paso ? Math.round(Number(paso) * 30) : 1;
  for (let f = f0; f < f1; f += st) {
    await p.evaluate((t) => window.ir(t), f / 30);
    await p.screenshot({ path: `${out}/f${String(f).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 92 });
  }
  console.log('listo', desde, hasta, errs.slice(0, 3).join(' | '));
  await b.close();
})();
