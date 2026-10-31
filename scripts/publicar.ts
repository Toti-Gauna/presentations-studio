// Congela una versión publicable: copia deck, afirmaciones y QR a decks/<deck>/publicadas/<etiqueta>/
// con su huella. El build con VITE_PUBLICADA=<etiqueta> usa esa copia: editar los archivos de
// trabajo (o el CRM) no cambia cifras a mitad de un pitch. Uso: npm run publicar -- --deck=handyx --etiqueta=aticma-2026-11-04
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { validarPaquete } from '../src/core/validar.ts';
import { huella } from '../src/core/afirmaciones.ts';
import { args } from './util.ts';

const a = args();
const deck = a['deck'] ?? 'handyx';
const etiqueta = a['etiqueta'];
if (!etiqueta || !/^[a-z0-9][a-z0-9-]{2,60}$/.test(etiqueta)) throw new Error('--etiqueta=<minúsculas-y-guiones> obligatoria');
const destino = `decks/${deck}/publicadas/${etiqueta}`;
if (existsSync(destino)) throw new Error(`${destino} ya existe: una versión publicada no se sobrescribe`);
const leer = (f: string) => JSON.parse(readFileSync(f, 'utf8'));
const d = leer(`decks/${deck}/deck.json`);
const fuente: string = d.datosDe ?? deck;
const entrada = { deck: d, tema: leer(`brands/${d.tema}/tema.json`), afirmaciones: leer(`decks/${fuente}/afirmaciones.json`), qrs: leer(`decks/${fuente}/qr.json`) };
const r = validarPaquete(entrada);
if (!r.ok) throw new Error(`no valida:\n${r.errores.join('\n')}`);
mkdirSync(destino, { recursive: true });
cpSync(`decks/${deck}/deck.json`, `${destino}/deck.json`);
for (const f of ['afirmaciones.json', 'qr.json']) cpSync(`decks/${fuente}/${f}`, `${destino}/${f}`);
writeFileSync(`${destino}/manifiesto.json`, JSON.stringify({ deck, etiqueta, huella: huella(JSON.stringify(entrada)), publicada: new Date().toISOString(), corte: d.corte, avisos: r.avisos }, null, 2));
console.log(`Publicada ${deck}@${etiqueta} → ${destino}. Build congelado: VITE_PUBLICADA=${etiqueta} npm run build`);
