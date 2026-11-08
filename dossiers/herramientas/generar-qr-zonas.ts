// QR de los afiches por barrio: cada uno lleva al registro de la app de usuario con su zona (para medir qué afiche trae
// gente, sin datos personales). Supuesto: la app de usuario vive en https://handyc.com y registra en /registro/.
// Uso: node dossiers/herramientas/generar-qr-zonas.ts [base]
import { writeFileSync } from 'node:fs';
import { svg } from '../../src/core/qr.ts';

const base = process.argv[2] ?? 'https://handyc.com/registro/';
const zonas = ['centro', 'guemes', 'playa-grande', 'los-troncos', 'stella-maris', 'plaza-mitre', 'la-perla', 'varese', 'chauvin', 'punta-mogotes'];
for (const z of zonas) {
  const url = `${base}?zona=${z}&origen=afiche`;
  writeFileSync(new URL(`../piezas/05-afiches/qr/${z}.svg`, import.meta.url), svg(url, { oscuro: '#0E1D36', claro: '#FFFFFF', titulo: `Código QR: ${url}` }));
  console.log(z, '→', url);
}
