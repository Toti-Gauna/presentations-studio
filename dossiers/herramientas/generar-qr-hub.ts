// QR único de la colección: lleva a la página con botones (landing, los 4 dossiers y el portafolio).
// Decisión de Ignacio (07/11): https://landing.handyc.com/handyx/ — si cambia el dominio, se pasa la URL nueva y se
// regeneran las piezas. SVG nítido a cualquier tamaño, navy sobre blanco (contraste 16,9:1), sin servicios externos.
// Uso: node dossiers/herramientas/generar-qr-hub.ts [url]
import { writeFileSync } from 'node:fs';
import { svg, contraste } from '../../src/core/qr.ts';

const url = process.argv[2] ?? 'https://landing.handyc.com/handyx/';
const oscuro = '#0E1D36';
const claro = '#FFFFFF';
if (contraste(oscuro, claro) < 7) throw new Error('contraste insuficiente para un QR impreso');
writeFileSync(new URL('../marca/qr-hub.svg', import.meta.url), svg(url, { oscuro, claro, titulo: `Código QR: ${url}` }));
writeFileSync(new URL('../marca/qr-hub.txt', import.meta.url), url + '\n');
console.log('QR →', url);
