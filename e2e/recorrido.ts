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

  // 2b · Menú de diapositivas en el celular: abrir, elegir la escena 4 y volver
  await tel.getByRole('button', { name: '☰ Diapositivas' }).tap();
  await tel.waitForTimeout(600);
  const capturas = process.env['CAPTURAS'];
  if (capturas) await tel.screenshot({ path: `${capturas}/celular-menu.png` });
  const minis = await tel.locator('.menu-diapos .mini .escenario').count();
  await tel.locator('.menu-diapos li').nth(4).locator('button').tap();
  await tel.waitForSelector('.confirmacion[data-resultado="aplicado"]');
  await publica.waitForTimeout(400);
  ok('menú del celular con miniaturas salta a la diapositiva elegida', minis > 5 && (await posPublica())?.startsWith('5 /') === true, `miniaturas=${minis} pública=${await posPublica()}`);
  // 2c · Deslizar en el celular: izquierda avanza, derecha retrocede
  const zona = tel.locator('.zona-gesto');
  const caja = await zona.boundingBox();
  const deslizar = async (dx: number) => {
    if (!caja) return;
    await tel.mouse.move(caja.x + caja.width / 2, caja.y + caja.height / 2);
    await tel.mouse.down();
    await tel.mouse.move(caja.x + caja.width / 2 + dx, caja.y + caja.height / 2, { steps: 5 });
    await tel.mouse.up();
  };
  await tel.waitForTimeout(600);
  const g0 = await tel.locator('.posicion').textContent();
  await deslizar(-140);
  await tel.waitForTimeout(700);
  const g1 = await tel.locator('.posicion').textContent();
  await deslizar(140);
  await tel.waitForTimeout(700);
  const g2 = await tel.locator('.posicion').textContent();
  if (capturas) await tel.screenshot({ path: `${capturas}/celular-control.png` });
  ok('deslizar avanza y retrocede', g1 !== g0 && g2 === g0, `${g0} → ${g1} → ${g2}`);
  await presentador.keyboard.press('Home');
  await tel.waitForTimeout(500);
  await presentador.keyboard.press('ArrowRight');
  await tel.waitForTimeout(500);

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
  // Pitch ATICMA: anexos solo por acción explícita, refresco sin volver al inicio y modo de ensayo.
  const evento = await nav.newContext({ viewport: { width: 1440, height: 900 } });
  const presA = await evento.newPage();
  const pubA = await evento.newPage();
  for (const [n, pg] of [['aticma-presentador', presA], ['aticma-publica', pubA]] as const) pg.on('pageerror', (e: Error) => errores.push(`${n}: ${e.message}`));
  const qa = 'deck=handyx-aticma&version=evento';
  await presA.goto(`${base}/presentador/?${qa}`);
  await pubA.goto(`${base}/presentar/?${qa}`);
  await presA.waitForTimeout(1200);
  const animada = await pubA.waitForFunction(() => Boolean(document.querySelector('section.escena .animacion')?.shadowRoot?.querySelector('.lienzo')), null, { timeout: 8000 }).then(() => true, () => false);
  ok('ATICMA: la diapositiva 1 es una escena animada (montada en la pantalla pública)', animada);
  const actualA = async () => ((await presA.locator('.indice li.actual .item').textContent()) ?? '').trim();
  await presA.keyboard.press('r');
  // Las diapositivas animadas tienen un paso por frase: se avanza hasta que el recorrido se detiene en la 7.ª.
  for (let i = 0; i < 48; i++) { await presA.keyboard.press('ArrowRight'); await presA.waitForTimeout(220); }
  await presA.waitForTimeout(600);
  ok('ATICMA: avanzar se detiene en la 7.ª diapositiva (no entra a anexos)', (await actualA()).startsWith('7.'), await actualA());
  ok('ATICMA: la pantalla pública usa el movimiento completo', ((await pubA.locator('.escenario').getAttribute('class')) ?? '').includes('modo-completo'));
  ok('ATICMA: la 7.ª tiene el clip del mundo con su póster', (await pubA.locator('section.escena[data-escena="a-equipo"] video[data-medio="video-mundo"][poster]').count()) === 1);
  ok('ATICMA: el último golpe es el cierre con los QR de la landing y del portafolio', (await pubA.locator('section.escena[data-escena="a-equipo"] .qr').count()) === 2);
  ok('ATICMA: los rótulos de las cifras van en un pie discreto', (await pubA.locator('.rotulos-pie').count()) >= 1 && (await pubA.locator('section.escena .rotulo:not(figcaption .rotulo)').count()) === 0);
  await presA.getByRole('button', { name: '■ Finalizar' }).click(); await presA.waitForTimeout(400);
  const intento = (await presA.locator('.intentos li').first().textContent()) ?? '';
  ok('ATICMA: Finalizar registra el tiempo del ensayo', /^Ensayo 1: \d+:\d\d · dentro de 3:00/.test(intento), intento);
  const porDiapo = await presA.locator('.tiempos tbody tr td:last-child').allTextContents();
  ok('ATICMA: tiempo real por diapositiva', porDiapo.filter((t: string) => /\d+s/.test(t)).length >= 5, porDiapo.join(','));
  await presA.keyboard.press('n'); await presA.waitForTimeout(200);
  ok('ATICMA: N oculta notas y guion para ensayar sin ayuda', !(await presA.locator('.col-notas .guion').isVisible()));
  await presA.keyboard.press('n');
  await presA.keyboard.press('Shift+F'); await presA.waitForTimeout(500);
  ok('ATICMA: Mayús + F abre el respaldo F (la competencia en Argentina, por modelo)', (await actualA()).includes('La competencia en Argentina'), await actualA());
  const item35 = ((await presA.locator('.indice li:not(.separador-anexos) .item').nth(34).textContent()) ?? '').replace(/^35\. /, '').trim();
  await presA.keyboard.press('3'); await presA.keyboard.press('5'); await presA.waitForTimeout(200);
  ok('ATICMA: al escribir un número se ve a qué lámina va', ((await presA.locator('.ir-numero.activo').textContent()) ?? '').includes(item35), item35);
  await presA.keyboard.press('Enter'); await presA.waitForTimeout(500);
  ok('ATICMA: número + Enter abre esa lámina (35)', (await actualA()).startsWith('35.'), await actualA());
  const nFerr = (await presA.locator('.indice li:not(.separador-anexos) .item').allTextContents()).findIndex((t: string) => t.includes('Ferreterías conectadas')) + 1;
  for (const d of String(nFerr)) await presA.keyboard.press(d);
  await presA.keyboard.press('Enter'); await pubA.waitForTimeout(2000);
  const animFerr = await pubA.waitForFunction(() => Boolean(document.querySelector('section.escena[data-escena="x-ferreterias"] .animacion')?.shadowRoot?.querySelector('.lienzo')), null, { timeout: 8000 }).then(() => true, () => false);
  ok('ATICMA: «Ferreterías conectadas» es una escena animada en la pantalla pública', nFerr > 0 && animFerr, JSON.stringify({ nFerr, animFerr }));
  const nVoz = (await presA.locator('.indice li:not(.separador-anexos) .item').allTextContents()).findIndex((t: string) => t.includes('HandIA te habla')) + 1;
  for (const d of String(nVoz)) await presA.keyboard.press(d);
  await presA.keyboard.press('Enter'); await pubA.waitForTimeout(2000);
  const animVoz = await pubA.locator('video[data-medio="video-handia-voz"]').evaluate((v: HTMLVideoElement) => ({ t: v.currentTime, pausado: v.paused })).catch(() => null);
  ok('ATICMA: la animación «HandIA te habla» arranca sola en la pantalla pública', nVoz > 0 && !!animVoz && animVoz.t > 0.3 && !animVoz.pausado, JSON.stringify({ nVoz, animVoz }));
  await presA.keyboard.press('0'); await presA.waitForTimeout(500);
  ok('ATICMA: 0 vuelve a la última diapositiva principal', (await actualA()).startsWith('7.'), await actualA());
  // La 7.ª tiene varios golpes (equipo, agentes, inversión, Silicon Valley, mundo, QR): se retrocede hasta entrar en la 6.ª.
  for (let i = 0; i < 12 && !(await actualA()).startsWith('6.'); i++) { await presA.keyboard.press('ArrowLeft'); await presA.waitForTimeout(350); }
  await presA.keyboard.press('ArrowLeft'); await presA.waitForTimeout(500);
  await presA.reload(); await presA.waitForTimeout(1500);
  ok('ATICMA: un refresco del presentador no vuelve a la primera diapositiva', (await actualA()).startsWith('6.'), await actualA());
  ok('ATICMA: el registro de ensayos sobrevive al refresco', (await presA.locator('.intentos li').count()) === 1);
  await presA.getByRole('button', { name: 'Nuevo ensayo' }).click(); await presA.waitForTimeout(600);
  ok('ATICMA: Nuevo ensayo vuelve a la primera y pone el reloj en cero sin recargar', (await actualA()).startsWith('1.') && ((await presA.locator('span.reloj').textContent()) ?? '') === '0:00', `${await actualA()} · ${await presA.locator('span.reloj').textContent()}`);
  ok('ATICMA: la pantalla pública no muestra notas ni guion', !/Si preguntan|Fuente del guion|Próxima transición/.test(await pubA.locator('body').innerText()));
  await evento.close();
  ok('sin errores de JavaScript', errores.length === 0, errores.join(' | '));
} finally {
  await nav.close();
  await srv.app.cerrar();
}
const fallas = resultados.filter((r) => !r[1]).length;
console.log(`\n${resultados.length - fallas}/${resultados.length} comprobaciones OK`);
process.exit(fallas ? 1 : 0);
