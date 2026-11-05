// Contorno de Argentina (Natural Earth, world-atlas 50m) proyectado en una caja, con ciudades y una silueta
// aproximada de la provincia de Buenos Aires. Salida: módulo TS con los trazos (sin dependencias en tiempo de ejecución).
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const req = createRequire('/tmp/claude-0/-home-user/10ab011c-6752-54be-831e-b3c4da2461d0/scratchpad/globo/package.json');
const d3 = req('d3-geo'); const topo = req('topojson-client');
const mundo = JSON.parse(readFileSync('/tmp/claude-0/-home-user/10ab011c-6752-54be-831e-b3c4da2461d0/scratchpad/globo/node_modules/world-atlas/countries-50m.json', 'utf8'));
const paises = topo.feature(mundo, mundo.objects.countries).features;
const arg = paises.find((f) => f.properties.name === 'Argentina');
const malv = paises.find((f) => /Falkland/.test(f.properties.name));
const W = 560, H = 1000;
const proy = d3.geoConicEqualArea().parallels([-50, -25]).rotate([64, 0]).fitExtent([[20, 20], [W - 20, H - 20]], { type: 'FeatureCollection', features: [arg, malv] });
const camino = d3.geoPath(proy);
const redondear = (s) => s.replace(/(\d+\.\d{1})\d+/g, '$1');
const ciudades = {
  'Mar del Plata': [-57.55, -38.0], 'Ciudad de Buenos Aires': [-58.38, -34.6], 'La Plata': [-57.95, -34.92], 'Bahía Blanca': [-62.27, -38.72],
  'Córdoba': [-64.18, -31.42], 'Rosario': [-60.64, -32.95], 'Santa Fe': [-60.7, -31.63], 'Paraná': [-60.52, -31.73],
  'Mendoza': [-68.84, -32.89], 'San Juan': [-68.53, -31.54], 'Corrientes': [-58.83, -27.47], 'Posadas': [-55.9, -27.37],
  'Tucumán': [-65.22, -26.81], 'Salta': [-65.41, -24.78], 'Neuquén': [-68.06, -38.95], 'Bariloche': [-71.31, -41.13],
  'Comodoro Rivadavia': [-67.48, -45.86], 'Ushuaia': [-68.3, -54.8],
};
const pos = Object.fromEntries(Object.entries(ciudades).map(([n, ll]) => [n, proy(ll).map((v) => Math.round(v * 10) / 10)]));
const baires = [[-60.2,-33.25],[-58.6,-33.75],[-58.35,-34.55],[-57.3,-35.3],[-56.65,-36.35],[-57.55,-38.05],[-58.8,-38.6],[-61.2,-39.0],[-62.3,-38.85],[-62.1,-39.6],[-62.8,-40.85],[-63.4,-39.4],[-63.39,-35.0],[-63.39,-34.0],[-61.6,-33.95],[-60.9,-33.6],[-60.2,-33.25]];
const bairesD = 'M' + baires.map((ll) => proy(ll).map((v) => v.toFixed(1)).join(' ')).join(' L') + ' Z';
const ts = `// Generado por scripts/video-pitch/mapa-argentina.mjs (Natural Earth vía world-atlas 50m, dominio público).
// Proyección cónica equivalente ajustada a ${W} × ${H}. Buenos Aires: silueta aproximada de la provincia (recortar con el contorno).
export const ARGENTINA = {
  ancho: ${W},
  alto: ${H},
  contorno: '${redondear(camino(arg))}',
  malvinas: '${redondear(camino(malv))}',
  buenosAires: '${bairesD}',
  ciudades: ${JSON.stringify(pos)} as Record<string, [number, number]>,
};
`;
writeFileSync(process.argv[2], ts);
console.log('bytes', ts.length, 'MdP', pos['Mar del Plata']);
