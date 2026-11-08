// Exporta cada <section class="post" id="…"> de una pieza de redes a PNG en su tamaño real (1080 px de ancho).
// Uso: node dossiers/herramientas/exportar-redes.cjs dossiers/piezas/06-instagram/index.html carpeta-salida
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => {
  const [html, out] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1200, height: 2000 }, deviceScaleFactor: 1 });
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto('file://' + path.resolve(html)); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
  for (const el of await p.$$('section.post')) {
    const id = await el.getAttribute('id');
    await el.screenshot({ path: `${out}/Handyx-${id}.png` });
  }
  if (errs.length) { console.error(errs); process.exit(1); }
  console.log('listo', fs.readdirSync(out).length, 'imágenes');
  await b.close();
})();
