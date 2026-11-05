// PDF de respaldo (diapositivas 16:9, último paso de cada escena) y PDF autónomo de lectura (A4).
// No conserva animaciones ni video: es un respaldo legible. Requiere `npm run build` antes.
// Uso: npm run exportar:pdf -- --deck=handyx --version=aticma [--modo=lectura] [--sin-anexos]
import { mkdirSync } from 'node:fs';
import { args, playwright, servirDist } from './util.ts';

const a = args();
const deck = a['deck'] ?? 'handyx';
const version = a['version'] ?? 'aticma';
const lectura = a['modo'] === 'lectura';
const srv = await servirDist();
const navegador = await playwright().chromium.launch();
try {
  const pagina = await navegador.newPage({ viewport: { width: 1920, height: 1080 } });
  const errores: string[] = [];
  pagina.on('pageerror', (e: Error) => errores.push(e.message));
  const q = new URLSearchParams({ deck, version, ...(lectura ? { modo: 'lectura' } : {}), ...(a['sin-anexos'] ? { anexos: 'no' } : {}), movimiento: 'reducido' });
  await pagina.goto(`${srv.url}/imprimir/?${q}`, { timeout: 300_000 }); // decks con cientos de pasos animados tardan en cargar
  await pagina.waitForSelector('body[data-listo="1"]', { timeout: 300_000 });
  await pagina.waitForTimeout(500);
  if (errores.length) throw new Error(`errores en la página: ${errores.join(' | ')}`);
  mkdirSync('salida/pdf', { recursive: true });
  const archivo = `salida/pdf/${deck}-${version}${lectura ? '-lectura' : ''}.pdf`;
  await pagina.pdf(lectura ? { path: archivo, format: 'A4', printBackground: true } : { path: archivo, width: '1920px', height: '1080px', printBackground: true, pageRanges: '' });
  console.log(`PDF → ${archivo}`);
} finally {
  await navegador.close();
  await srv.cerrar();
}
