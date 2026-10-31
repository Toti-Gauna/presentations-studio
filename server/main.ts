// Arranque del servidor de sesiones. Configuración solo por entorno (ver .env.example).
import { crearApp } from './app.ts';

const lista = (v: string | undefined) => (v ?? '').split(',').map((s) => s.trim()).filter(Boolean);
const puerto = Number(process.env['PORT'] ?? 8787);
const origenes = lista(process.env['ALLOWED_ORIGINS'] ?? `http://localhost:5173,http://localhost:${puerto},http://127.0.0.1:${puerto}`);
const app = crearApp({
  puerto,
  origenes,
  estaticos: process.env['SERVIR_ESTATICOS'] || undefined,
  redirecciones: lista(process.env['QR_REDIRECCIONES']),
  version: process.env['RENDER_GIT_COMMIT']?.slice(0, 7) ?? process.env['VERSION'] ?? 'local',
  confiarProxy: process.env['CONFIAR_PROXY'] === 'true',
});
app.servidor.listen(puerto, process.env['HOST'] ?? '0.0.0.0', () => {
  console.log(JSON.stringify({ evento: 'escuchando', puerto, origenes: origenes.length }));
});
process.on('SIGHUP', () => console.log(JSON.stringify({ evento: 'redirecciones-recargadas', ...app.redirecciones.recargar() })));
for (const s of ['SIGINT', 'SIGTERM'] as const) process.on(s, () => void app.cerrar().then(() => process.exit(0)));
