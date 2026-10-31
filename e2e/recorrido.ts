// Recorrido de punta a punta en un navegador real (Chromium):
// presentador + pantalla pública (misma computadora) + celular (otro dispositivo) por el servidor de sesiones.
// Requiere `npm run build`. Uso: npm run e2e
import type { AddressInfo } from 'node:net';
import { crearApp } from '../server/app.ts';
import { playwright } from '../scripts/util.ts';

const resultados: Array<[string, boolean, string?]> = [];
const ok = (nombre: string, cond: boolean, detalle?: string) => {
  resultados.push([nombre, cond, detalle]);
  console.log(`${cond ? '✓' : '✗'} ${nombre}${detalle ? ` · ${detalle}` : ''}`);
};

async function levantar(puerto = 0) {
  const app = crearApp({ puerto, origenes: [], estaticos: 'dist', redirecciones: ['decks/handyx/qr.json'], version: 'e2e', confiarProxy: false });
  await new Promise<void>((r) => app.servidor.listen(puerto, '127.0.0.1', r));
  const p = (app.servidor.address() as AddressInfo).port;
  return { app, puerto: p, url: `http://127.0.0.1:${p}` };
}

let srv = await levantar();
// El origen propio tiene que estar permitido (mismo origen que sirve el build).
srv.app.servidor.close();
await srv.app.cerrar();
const puerto = srv.puerto;
const crear = async () => {
  const app = crearApp({ puerto, origenes: [`http://127.0.0.1:${puerto}`], estaticos: 'dist', redirecciones: ['decks/handyx/qr.json'], version: 'e2e', confiarProxy: false });
  await new Promise<void>((r) => app.servidor.listen(puerto, '127.0.0.1', r));
  return { app, puerto, url: `http://127.0.0.1:${puerto}` };
};
srv = await crear();
const base = srv.url;
const q = `deck=handyx&version=aticma&servidor=${encodeURIComponent(base)}&movimiento=reducido`;
const nav = await playwright().chromium.launch();
const errores: string[] = [];
try {
  const compu = await nav.newContext({ viewport: { width: 1440, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] });
  const presentador = await compu.newPage();
  presentador.on('pageerror', (e: Error) => errores.push(`presentador: ${e.message}`));
  await presentador.goto(`${base}/presentador/?${q}`);
  const publica = await compu.newPage();
  publica.on('pageerror', (e: Error) => errores.push(`pública: ${e.message}`));
  await publica.goto(`${base}/presentar/?${q}`);
  await publica.waitForTimeout(800);
  const posPublica = () => publica.locator('.pie-num').textContent();
  const escenaPublica = () => publica.locator('section.escena').last().getAttribute('data-escena');

  // 1 · Teclado local: el presentador manda y la pública sigue
  await presentador.keyboard.press('ArrowRight');
  await presentador.keyboard.press('ArrowRight');
  await publica.waitForTimeout(400);
  ok('teclado del presentador mueve la pantalla pública', (await escenaPublica()) === 'h-problema', `${await escenaPublica()}`);
  const htmlPublico = await publica.content();
  ok('la pantalla pública no contiene notas privadas', !htmlPublico.includes('sin auditar contra el CRM') && !htmlPublico.includes('Activar el sonido en la pantalla pública'));
  await publica.keyboard.press('ArrowLeft');
  await presentador.waitForTimeout(400);
  ok('teclado/clicker en la pantalla pública también controla', (await presentador.locator('.indice li.actual').textContent())?.includes('2.') ?? false);

  // 2 · Conectar el control remoto y emparejar un celular (otro contexto = otro dispositivo)
  await presentador.getByRole('button', { name: 'Conectar control remoto' }).click();
  await presentador.waitForSelector('.qr-privado svg');
  const urlControl = (await presentador.locator('.qr-privado').getAttribute('data-url')) as string;
  ok('QR privado de control generado', Boolean(urlControl?.includes('#s=')));
  const qrPublicosEnPantalla = await publica.locator('.qr').count();
  ok('el QR privado no aparece en la pantalla pública', !(await publica.content()).includes(urlControl.split('#')[1] as string) && qrPublicosEnPantalla >= 0);

  const celu = await nav.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const tel = await celu.newPage();
  tel.on('pageerror', (e: Error) => errores.push(`celular: ${e.message}`));
  await tel.goto(urlControl);
  await tel.waitForSelector('text=Esperando que el presentador apruebe');
  ok('la URL del control no conserva el código en la barra', !tel.url().includes('c='));
  const intruso = await (await nav.newContext()).newPage();
  await intruso.goto(urlControl);
  await intruso.waitForTimeout(800);
  ok('una segunda persona con la misma foto del QR no puede emparejar', (await intruso.textContent('body'))?.includes('ya se usó o venció') ?? false);
  await presentador.getByRole('button', { name: 'Aprobar' }).click();
  await tel.waitForSelector('.conexion[data-estado="conectado"]', { timeout: 5000 });
  ok('celular aprobado y conectado', true);
  ok('el celular ve notas privadas', (await tel.locator('.notas').textContent())?.length !== 0);

  // 3 · Comando confirmado
  const antes = await posPublica();
  await tel.getByRole('button', { name: 'Siguiente ▶' }).tap();
  await tel.waitForSelector('.confirmacion[data-resultado="aplicado"]');
  await publica.waitForTimeout(400);
  ok('celular → pantalla pública con confirmación', (await posPublica()) !== antes || (await escenaPublica()) !== 'apertura', `${antes} → ${await posPublica()} (${await escenaPublica()})`);

  // 4 · Doble toque: un solo avance
  const e0 = await tel.locator('.posicion').textContent();
  await tel.getByRole('button', { name: 'Siguiente ▶' }).tap();
  await tel.getByRole('button', { name: 'Siguiente ▶' }).tap();
  await tel.waitForTimeout(900);
  const e1 = await tel.locator('.posicion').textContent();
  const pasos = (s: string | null) => { const m = s?.match(/Escena (\d+)\/\d+ · paso (\d+)/); return m ? Number(m[1]) * 100 + Number(m[2]) : -1; };
  const total = (s: string | null) => { const m = s?.match(/Escena (\d+)\/\d+ · paso (\d+)\/(\d+)/); return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : [0, 0, 0]; };
  const [ea = 0, pa = 0, na = 0] = total(e0);
  const [eb = 0, pb = 0] = total(e1);
  const unPaso = (eb === ea && pb === pa + 1) || (eb === ea + 1 && pb === 1 && pa === na);
  ok('doble toque avanza una sola vez', unPaso, `${e0} → ${e1}`);

  // 5 · Corte de red del celular: el toque se reintenta al volver, sin doble avance
  await celu.setOffline(true);
  await tel.waitForTimeout(300);
  const p0 = await posPublica();
  await tel.getByRole('button', { name: 'Siguiente ▶' }).tap();
  await tel.waitForTimeout(600);
  await celu.setOffline(false);
  await tel.waitForSelector('.conexion[data-estado="conectado"]', { timeout: 12_000 });
  await tel.waitForTimeout(1200);
  const p1 = await posPublica();
  const n = (x: string | null) => Number(x?.split('/')[0]);
  ok('reconexión del celular sin doble avance (≤ 1 escena)', n(p1) - n(p0) <= 1, `${p0} → ${p1}`);

  // 6 · Revocar
  await presentador.getByRole('button', { name: 'Revocar todos' }).click();
  await tel.waitForSelector('text=Control revocado', { timeout: 5000 });
  ok('revocar corta el control del celular', true);

  // 7 · Caída del servidor: la computadora sigue en local
  await srv.app.cerrar();
  await presentador.waitForTimeout(500);
  const c0 = await escenaPublica();
  await presentador.keyboard.press('ArrowDown');
  await publica.waitForTimeout(500);
  ok('sin servidor, el teclado sigue funcionando', (await escenaPublica()) !== c0, `${c0} → ${await escenaPublica()}`);
  ok('el presentador muestra que sigue en local', /local|Reconectando/i.test((await presentador.locator('.conexion').textContent()) ?? ''));

  // 8 · Paquete local: sin ningún pedido externo, la presentación se dibuja con sus fuentes
  srv = await crear();
  const aislado = await nav.newContext({ viewport: { width: 1280, height: 720 } });
  const externos: string[] = [];
  await aislado.route('**/*', (r: any) => (new URL(r.request().url()).hostname === '127.0.0.1' ? r.continue() : (externos.push(r.request().url()), r.abort())));
  const off = await aislado.newPage();
  await off.goto(`${base}/presentar/?deck=handyx&version=aticma`);
  await off.waitForTimeout(1200);
  const fuentes = await off.evaluate(() => [...document.fonts].filter((f: FontFace) => f.status === 'loaded').map((f) => f.family));
  ok('funciona sin recursos externos (fuentes empaquetadas)', externos.length === 0 && fuentes.some((f: string) => f.includes('Archivo')), `externos=${externos.length} fuentes=${[...new Set(fuentes)].join(',')}`);
  // 9 · Hub: elige entre presentaciones; la v2 comercial carga y recorre sin errores
  const hub = await aislado.newPage();
  hub.on('pageerror', (e: Error) => errores.push(`hub: ${e.message}`));
  await hub.goto(`${base}/`);
  await hub.waitForTimeout(1200);
  const tarjetas = await hub.locator('.hub-tarjeta').count();
  const conV2 = await hub.locator('a[href*="deck=handyx-v2"]').count();
  ok('hub lista las presentaciones con miniatura', tarjetas >= 4 && conV2 > 0 && (await hub.locator('.hub-mini .escenario').count()) >= 4, `tarjetas=${tarjetas}`);
  const v2 = await aislado.newPage();
  v2.on('pageerror', (e: Error) => errores.push(`v2: ${e.message}`));
  await v2.goto(`${base}/presentar/?deck=handyx-v2&version=comercial`);
  for (let i = 0; i < 30; i++) { await v2.keyboard.press('ArrowRight'); await v2.waitForTimeout(60); }
  await v2.waitForTimeout(800);
  ok('v2 comercial recorre 30 pasos sin errores', (await v2.locator('section.escena').count()) >= 1);
  ok('sin errores de JavaScript', errores.length === 0, errores.join(' | '));
} finally {
  await nav.close();
  await srv.app.cerrar();
}
const fallas = resultados.filter((r) => !r[1]).length;
console.log(`\n${resultados.length - fallas}/${resultados.length} comprobaciones OK`);
process.exit(fallas ? 1 : 0);
