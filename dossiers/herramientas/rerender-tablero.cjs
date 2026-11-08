// Re-renderiza tableros del lienzo del portal con reemplazos de texto (ejemplos de muestra neutros) y recorte.
// Uso: node rerender.cjs <lienzo> <trabajos.json> <salida>
// trabajo: { "tablero": "Reclamos.dc.html", "a": "reclamos.png", "escala": 2,
//            "reemplazos": [["texto exacto", "texto nuevo"], ...], "js": "código opcional",
//            "recorte": [x, y, w, h] (px CSS, opcional) }
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const [, , lienzo, trabajosTxt, salida] = process.argv;
const canvas = JSON.parse(fs.readFileSync(path.join(lienzo, 'project/canvas.json'), 'utf8'));
const blobs = fs.existsSync(path.join(lienzo, 'blobs/indice.json')) ? JSON.parse(fs.readFileSync(path.join(lienzo, 'blobs/indice.json'), 'utf8')) : {};
const runtime = path.join(lienzo, 'artifact-type/dc-runtime.js');
const TIPOS = { '.js': 'text/javascript', '.html': 'text/html', '.json': 'application/json', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
function servir(q, r) {
  const url = decodeURIComponent(q.url.split('?')[0]);
  let f = null;
  if (url.endsWith('/support.js')) f = runtime;
  else if (url.startsWith('/_blob/')) {
    const id = url.slice(7).split('/')[0];
    const dir = path.join(lienzo, 'blobs');
    const nombre = blobs[id] ?? (fs.existsSync(dir) ? fs.readdirSync(dir).find((x) => x.startsWith(id)) : undefined);
    if (nombre) f = path.join(lienzo, 'blobs', nombre);
  } else f = path.join(lienzo, url);
  if (f && fs.existsSync(f) && fs.statSync(f).isFile()) {
    r.writeHead(200, { 'content-type': TIPOS[path.extname(f).toLowerCase()] ?? 'application/octet-stream' });
    r.end(fs.readFileSync(f));
  } else { r.writeHead(404); r.end(); }
}
(async () => {
  fs.mkdirSync(salida, { recursive: true });
  const trabajos = JSON.parse(fs.readFileSync(trabajosTxt, 'utf8'));
  const srv = http.createServer(servir);
  await new Promise((ok) => srv.listen(0, '127.0.0.1', ok));
  const base = `http://127.0.0.1:${srv.address().port}`;
  const nav = await chromium.launch();
  for (const t of trabajos) {
    const b = canvas.boards[t.tablero];
    const p = await nav.newPage({ viewport: { width: b.w, height: b.h }, deviceScaleFactor: t.escala ?? 2 });
    await p.goto(`${base}/project/${t.tablero}`, { waitUntil: 'networkidle', timeout: 60000 });
    await p.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map((im) => (im.complete ? null : new Promise((ok) => { im.onload = im.onerror = ok; }))));
    });
    await p.waitForTimeout(400);
    const faltan = await p.evaluate((reemplazos) => {
      const faltan = [];
      // el runtime puede usar shadow DOM: recorrer también las raíces de sombra
      const raices = [document];
      const todas = (r) => { r.querySelectorAll('*').forEach((e) => { if (e.shadowRoot) { raices.push(e.shadowRoot); todas(e.shadowRoot); } }); };
      todas(document);
      for (const [de, a] of reemplazos) {
        let n = 0;
        for (const raiz of raices) {
          const w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT);
          while (w.nextNode()) {
            const t = w.currentNode;
            if (de.startsWith('=')) { if (t.textContent.trim() === de.slice(1)) { t.textContent = t.textContent.replace(de.slice(1), a); n++; } }
            else if (t.textContent.includes(de)) { t.textContent = t.textContent.split(de).join(a); n++; }
          }
        }
        if (!n) faltan.push(de);
      }
      return faltan;
    }, t.reemplazos ?? []);
    if (t.js) await p.evaluate(t.js);
    await p.waitForTimeout(300);
    const destino = path.join(salida, t.a);
    if (t.recorte) { const [x, y, w, h] = t.recorte; await p.screenshot({ path: destino, clip: { x, y, width: w, height: h } }); }
    else await p.screenshot({ path: destino, fullPage: true });
    console.log(`${t.a}: ${faltan.length ? 'NO ENCONTRADOS: ' + JSON.stringify(faltan) : 'ok'}`);
    await p.close();
  }
  await nav.close(); srv.close();
})();
