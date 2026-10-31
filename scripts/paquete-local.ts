// Paquete local de respaldo: build + servidor estático sin dependencias + PDF + guía, en un .zip.
// Después de prepararlo, funciona sin internet (solo necesita Node 22). Uso: npm run paquete:local
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const dir = 'salida/paquete-local';
rmSync(dir, { recursive: true, force: true });
mkdirSync(dir, { recursive: true });
execFileSync('npx', ['vite', 'build'], { stdio: 'inherit', env: { ...process.env, VITE_BASE: './' } });
const externos = execFileSync('grep', ['-rhoE', 'https?://[a-zA-Z0-9.-]+', 'dist', '--include=*.js', '--include=*.html', '--include=*.css']).toString().split('\n').filter(Boolean);
const permitidos = /landing\.handyc\.com|api\.handyc\.com|example\.(com|test)|localhost|www\.w3\.org|greensock|gsap|reactjs|github\.com|mozilla/;
const raros = [...new Set(externos)].filter((u) => !permitidos.test(u));
if (raros.length) console.warn(`Aviso: URLs externas en el build (revisar que no se carguen en vivo): ${raros.join(', ')}`);
cpSync('dist', `${dir}/dist`, { recursive: true });
cpSync('scripts/servir-local.ts', `${dir}/servir-local.ts`);
if (existsSync('salida/pdf')) cpSync('salida/pdf', `${dir}/pdf`, { recursive: true });
if (existsSync('salida/video')) cpSync('salida/video', `${dir}/video`, { recursive: true });
if (existsSync('salida/qr')) cpSync('salida/qr', `${dir}/qr`, { recursive: true });
writeFileSync(`${dir}/LEEME.txt`, `PAQUETE LOCAL DE RESPALDO
Generado: ${new Date().toISOString()}

1. Abrí una terminal en esta carpeta y corré:   node servir-local.ts dist 4173
2. Pantalla pública:  http://localhost:4173/presentar/?deck=handyx&version=aticma   (F = pantalla completa)
   Presentador:       http://localhost:4173/presentador/?deck=handyx&version=aticma
3. Teclado/clicker: → / Espacio / PageDown avanza · ← / PageUp retrocede · ↓ ↑ saltan escena · B pantalla negra · Inicio reinicia.
4. Sin internet no hay control desde el celular (necesita red y servidor). El teclado siempre funciona.
5. Si falla el navegador: pdf/handyx-aticma.pdf (sin animaciones) o video/*.mp4 si se generó.
`);
execFileSync('zip', ['-qr', '../paquete-local.zip', '.'], { cwd: dir });
console.log(`Paquete → salida/paquete-local.zip (${Math.round(readFileSync('salida/paquete-local.zip').length / 1024 / 1024)} MB)`);
