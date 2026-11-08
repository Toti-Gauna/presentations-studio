// Genera los QR públicos de cada deck en SVG y PNG (sin servicios externos) y un informe de destinos.
// Uso: npm run qr [-- --deck=handyx] [-- --comprobar]   (comprobar hace una petición HEAD a cada destino)
import { mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { z } from 'zod';
import { QrPublico } from '../src/core/esquema.ts';
import { destinoActivo, matriz, svg, urlCodificada } from '../src/core/qr.ts';
import { args } from './util.ts';

const a = args();
const crc = (buf: Buffer) => {
  let c = ~0;
  for (const b of buf) {
    c ^= b;
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
};
function png(texto: string, escala = 16): Buffer {
  const { tamano, modulos } = matriz(texto);
  const lado = tamano * escala;
  const filas = Buffer.alloc((lado + 1) * lado);
  for (let y = 0; y < lado; y++) {
    filas[y * (lado + 1)] = 0;
    for (let x = 0; x < lado; x++) filas[y * (lado + 1) + 1 + x] = modulos[Math.floor(y / escala)]?.[Math.floor(x / escala)] ? 0 : 255;
  }
  const trozo = (tipo: string, datos: Buffer) => {
    const t = Buffer.concat([Buffer.from(tipo), datos]);
    const l = Buffer.alloc(4);
    l.writeUInt32BE(datos.length);
    const c = Buffer.alloc(4);
    c.writeUInt32BE(crc(t));
    return Buffer.concat([l, t, c]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(lado, 0);
  ihdr.writeUInt32BE(lado, 4);
  ihdr[8] = 8; // profundidad
  ihdr[9] = 0; // escala de grises
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), trozo('IHDR', ihdr), trozo('IDAT', deflateSync(filas)), trozo('IEND', Buffer.alloc(0))]);
}

const decks = a['deck'] ? [a['deck']] : readdirSync('decks').filter((d) => existsSync(`decks/${d}/qr.json`));
for (const deck of decks) {
  const lista = z.array(QrPublico).parse(JSON.parse(readFileSync(`decks/${deck}/qr.json`, 'utf8')));
  const dir = `salida/qr/${deck}`;
  mkdirSync(dir, { recursive: true });
  let informe = `# QR públicos · ${deck}\n\nGenerado el ${new Date().toISOString().slice(0, 10)}. ECC M, margen 4 módulos, negro sobre blanco (contraste 21:1).\n\n| id | etiqueta | modo | URL impresa | destino activo | estado | comprobación |\n|---|---|---|---|---|---|---|\n`;
  for (const q of lista) {
    const url = urlCodificada(q);
    writeFileSync(`${dir}/${q.id}.svg`, svg(url, { titulo: q.etiqueta }));
    writeFileSync(`${dir}/${q.id}.png`, png(url));
    let comprobacion = 'sin comprobar';
    if (a['comprobar']) {
      try {
        const r = await fetch(url, { method: 'HEAD', redirect: 'manual', signal: AbortSignal.timeout(8000) });
        comprobacion = `${r.status}${r.headers.get('location') ? ` → ${r.headers.get('location')}` : ''}`;
      } catch (e) {
        comprobacion = `sin respuesta (${e instanceof Error ? e.message.slice(0, 40) : 'error'})`;
      }
    }
    informe += `| ${q.id} | ${q.etiqueta} | ${q.modo} | ${url} | ${destinoActivo(q)} (${q.activo}) | ${q.definitivo ? 'definitivo' : '**provisorio**'} | ${comprobacion} |\n`;
  }
  informe += `\nAntes del evento: escanear cada PNG impreso y en el proyector desde la última fila con al menos dos teléfonos (iOS y Android).\n`;
  writeFileSync(`${dir}/destinos.md`, informe);
  console.log(`${deck}: ${lista.length} QR → ${dir}`);
}
