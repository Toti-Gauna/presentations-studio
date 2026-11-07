// Captura en PNG los tableros de un lienzo de diseño bajado a disco (Artifact de tipo «Design»).
// Uso: node dossiers/herramientas/capturar-lienzo.cjs <lienzo> <salida> [filtro] [escala] [paralelo]
//   <lienzo>: carpeta con project/canvas.json, project/*.dc.html, artifact-type/dc-runtime.js y blobs/indice.json
//   [filtro]: expresión regular sobre el archivo o el título (por defecto, todos) · [escala]: 2 · [paralelo]: 3
// El motor del propio lienzo (dc-runtime.js) se sirve como ./support.js; las imágenes subidas (/_blob/<id>) salen de blobs/.
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const [, , lienzo, salida, filtro = '', escalaTxt = '2', paraleloTxt = '3'] = process.argv;
if (!lienzo || !salida) { console.error('uso: capturar-lienzo.cjs <lienzo> <salida> [filtro] [escala] [paralelo]'); process.exit(1); }
const escala = Number(escalaTxt), paralelo = Number(paraleloTxt);
const canvas = JSON.parse(fs.readFileSync(path.join(lienzo, 'project/canvas.json'), 'utf8'));
const blobs = fs.existsSync(path.join(lienzo, 'blobs/indice.json')) ? JSON.parse(fs.readFileSync(path.join(lienzo, 'blobs/indice.json'), 'utf8')) : {};
const runtime = path.join(lienzo, 'artifact-type/dc-runtime.js');
const TIPOS = { '.js': 'text/javascript', '.html': 'text/html', '.json': 'application/json', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const faltantes = new Set();

function servir(q, r) {
  const url = decodeURIComponent(q.url.split('?')[0]);
  let f = null;
  if (url.endsWith('/support.js')) f = runtime;
  else if (url.startsWith('/_blob/')) {
    const id = url.slice(7).split('/')[0];
    const nombre = blobs[id] ?? fs.readdirSync(path.join(lienzo, 'blobs')).find((x) => x.startsWith(id));
    if (nombre) f = path.join(lienzo, 'blobs', nombre); else faltantes.add(id);
  } else f = path.join(lienzo, url);
  if (f && fs.existsSync(f) && fs.statSync(f).isFile()) {
    r.writeHead(200, { 'content-type': TIPOS[path.extname(f).toLowerCase()] ?? 'application/octet-stream' });
    r.end(fs.readFileSync(f));
  } else { r.writeHead(404); r.end(); }
}

(async () => {
  fs.mkdirSync(salida, { recursive: true });
  const srv = http.createServer(servir);
  await new Promise((ok) => srv.listen(0, '127.0.0.1', ok));
  const base = `http://127.0.0.1:${srv.address().port}`;
  const nav = await chromium.launch();
  const re = filtro ? new RegExp(filtro, 'i') : null;
  const pagNombre = Object.fromEntries((canvas.pages ?? []).map((p) => [p.id, p.name]));
  const tableros = canvas.order.filter((f) => canvas.boards[f]).map((f) => ({ archivo: f, ...canvas.boards[f] }))
    .filter((b) => !re || re.test(b.archivo) || re.test(b.title ?? ''));
  const indice = [];
  let i = 0;
  async function trabajador() {
    while (i < tableros.length) {
      const b = tableros[i++];
      const p = await nav.newPage({ viewport: { width: b.w, height: b.h }, deviceScaleFactor: escala });
      const errores = [];
      p.on('pageerror', (e) => errores.push(e.message));
      try {
        await p.goto(`${base}/project/${b.archivo}`, { waitUntil: 'networkidle', timeout: 60000 });
        await p.evaluate(async () => {
          await document.fonts.ready;
          await Promise.all([...document.images].map((im) => (im.complete ? null : new Promise((ok) => { im.onload = im.onerror = ok; }))));
        });
        await p.waitForTimeout(500);
        const png = path.join(salida, b.archivo.replace(/\.dc\.html$/, '.png'));
        await p.screenshot({ path: png, fullPage: true });
        indice.push({ archivo: b.archivo, titulo: b.title ?? b.archivo, pagina: pagNombre[b.page] ?? null, w: b.w, h: b.h, png: path.basename(png), errores: errores.filter((e) => !/\{\{/.test(e)).slice(0, 3) });
        process.stdout.write('.');
      } catch (e) {
        indice.push({ archivo: b.archivo, titulo: b.title ?? b.archivo, error: String(e.message).slice(0, 200) });
        process.stdout.write('x');
      }
      await p.close();
    }
  }
  await Promise.all(Array.from({ length: paralelo }, trabajador));
  indice.sort((a, b) => canvas.order.indexOf(a.archivo) - canvas.order.indexOf(b.archivo));
  fs.writeFileSync(path.join(salida, 'indice.json'), JSON.stringify({ lienzo: canvas.title, capturas: indice, imagenesFaltantes: [...faltantes] }, null, 1));
  await nav.close(); srv.close();
  const mal = indice.filter((x) => x.error).length;
  console.log(`\n${indice.length - mal}/${tableros.length} tableros capturados · ${faltantes.size} imágenes faltantes → ${salida}`);
})();
