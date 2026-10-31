// Servidor estático mínimo SIN dependencias para el paquete local (funciona sin internet).
// Uso: node scripts/servir-local.ts [carpeta=dist] [puerto=4173]  → http://localhost:4173/
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';

const raiz = resolve(process.argv[2] ?? 'dist');
const puerto = Number(process.argv[3] ?? 4173);
const tipos: Record<string, string> = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.mp4': 'video/mp4' };
createServer((req, res) => {
  const ruta = decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname);
  let archivo = normalize(join(raiz, ruta));
  if (!archivo.startsWith(raiz)) return void res.writeHead(403).end();
  if (existsSync(archivo) && statSync(archivo).isDirectory()) archivo = join(archivo, 'index.html');
  if (!existsSync(archivo)) return void res.writeHead(404).end('no existe');
  const tam = statSync(archivo).size;
  const rango = req.headers.range?.match(/bytes=(\d*)-(\d*)/);
  res.setHeader('Content-Type', tipos[extname(archivo)] ?? 'application/octet-stream');
  res.setHeader('Accept-Ranges', 'bytes');
  if (rango) {
    const ini = rango[1] ? Number(rango[1]) : 0;
    const fin = rango[2] ? Number(rango[2]) : tam - 1;
    res.writeHead(206, { 'Content-Range': `bytes ${ini}-${fin}/${tam}`, 'Content-Length': fin - ini + 1 });
    return void createReadStream(archivo, { start: ini, end: fin }).pipe(res);
  }
  res.setHeader('Content-Length', tam);
  createReadStream(archivo).pipe(res);
}).listen(puerto, '127.0.0.1', () => console.log(`Presentación local: http://localhost:${puerto}/  (Ctrl+C para cerrar)`));
