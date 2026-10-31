// Integración real por HTTP + WebSocket en localhost: emparejar un teléfono, avanzar, reconectar.
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { AddressInfo } from 'node:net';
import { WebSocket } from 'ws';
import { crearApp } from '../server/app.ts';
import type { MensajeServidor } from '../src/core/protocolo.ts';

let base = '';
let wsUrl = '';
let app: ReturnType<typeof crearApp>;
const ORIGEN = 'https://presentar.example.test';

beforeAll(async () => {
  const dir = mkdtempSync(join(tmpdir(), 'ps-'));
  const qr = join(dir, 'qr.json');
  writeFileSync(qr, JSON.stringify([
    { id: 'registro', etiqueta: 'Registro', modo: 'estable', urlEstable: 'https://go.example.test/r/registro', destinos: { A: 'https://a.example.test/usuarios/', B: 'https://a.example.test/especialistas/' }, activo: 'B', textoCorto: 'go.example.test/r/registro', definitivo: false },
  ]));
  app = crearApp({ puerto: 0, origenes: [ORIGEN], redirecciones: [qr], version: 'test', confiarProxy: false });
  await new Promise<void>((ok) => app.servidor.listen(0, '127.0.0.1', ok));
  const { port } = app.servidor.address() as AddressInfo;
  base = `http://127.0.0.1:${port}`;
  wsUrl = `ws://127.0.0.1:${port}/ws`;
});
afterAll(() => app.cerrar());

const post = (ruta: string, cuerpo: unknown, token?: string, origen = ORIGEN) =>
  fetch(base + ruta, { method: 'POST', headers: { 'content-type': 'application/json', origin: origen, ...(token ? { authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(cuerpo) });

function cliente(origen = ORIGEN) {
  const ws = new WebSocket(wsUrl, { headers: { origin: origen } });
  const recibidos: MensajeServidor[] = [];
  const esperas: Array<(m: MensajeServidor) => boolean> = [];
  ws.on('message', (d) => {
    const m = JSON.parse(String(d)) as MensajeServidor;
    recibidos.push(m);
    for (let i = esperas.length - 1; i >= 0; i--) if (esperas[i]!(m)) esperas.splice(i, 1);
  });
  const abierto = new Promise<void>((ok, mal) => (ws.on('open', () => ok()), ws.on('error', mal)));
  const esperar = <T extends MensajeServidor['t']>(t: T, filtro: (m: Extract<MensajeServidor, { t: T }>) => boolean = () => true) =>
    new Promise<Extract<MensajeServidor, { t: T }>>((ok, mal) => {
      const previo = recibidos.find((m) => m.t === t && filtro(m as never));
      if (previo) return ok(previo as never);
      const to = setTimeout(() => mal(new Error(`timeout esperando ${t}`)), 3000);
      esperas.push((m) => (m.t === t && filtro(m as never) ? (clearTimeout(to), ok(m as never), true) : false));
    });
  return { ws, abierto, esperar, recibidos, enviar: (m: unknown) => ws.send(JSON.stringify(m)) };
}

const nueva = { deck: 'demo', version: 'corta', huella: 'b'.repeat(16), forma: { pasos: [2, 2] }, notas: [{ titulo: 'Uno', notas: 'NOTA PRIVADA', guion: 'g', duracion: 10, medios: [] }, { titulo: 'Dos', notas: '', guion: '', duracion: 10, medios: [] }] };

describe('servidor de sesiones', () => {
  it('salud responde', async () => {
    expect((await (await fetch(base + '/salud')).json()).ok).toBe(true);
  });

  it('redirige al destino activo definido por el autor e ignora la consulta', async () => {
    const r = await fetch(base + '/r/registro?destino=https://malo.example.test', { redirect: 'manual' });
    expect(r.status).toBe(302);
    expect(r.headers.get('location')).toBe('https://a.example.test/especialistas/');
    expect((await fetch(base + '/r/otro', { redirect: 'manual' })).status).toBe(404);
  });

  it('rechaza orígenes no permitidos', async () => {
    expect((await post('/api/sesiones', nueva, undefined, 'https://malo.example.test')).status).toBe(403);
    const c = cliente('https://malo.example.test');
    await expect(c.abierto).rejects.toThrow();
  });

  it('recorrido completo: emparejar, aprobar, controlar, notas privadas, revocar', async () => {
    const cred = await (await post('/api/sesiones', nueva)).json();
    const anfitrion = cliente();
    await anfitrion.abierto;
    anfitrion.enviar({ t: 'hola', sesion: cred.sesion, token: cred.tokenAnfitrion, rol: 'anfitrion' });
    await anfitrion.esperar('bienvenida');

    const publico = cliente();
    await publico.abierto;
    publico.enviar({ t: 'hola', sesion: cred.sesion, token: cred.tokenPublico, rol: 'publico' });
    const bPublico = await publico.esperar('bienvenida');
    expect(bPublico.notas).toBeUndefined(); // la pantalla pública nunca recibe notas

    // Sin token del anfitrión no hay código
    expect((await post(`/api/sesiones/${cred.sesion}/codigo`, {}, cred.tokenPublico)).status).toBe(401);
    const { codigo } = await (await post(`/api/sesiones/${cred.sesion}/codigo`, {}, cred.tokenAnfitrion)).json();
    const sol = await (await post(`/api/sesiones/${cred.sesion}/emparejar`, { codigo, nombre: 'Teléfono <script>' })).json();
    const aviso = await anfitrion.esperar('solicitud');
    expect(aviso.dispositivo).toBe('Teléfono script');

    const telefono = cliente();
    await telefono.abierto;
    telefono.enviar({ t: 'hola', sesion: cred.sesion, token: sol.tokenEspera, rol: 'espera' });
    await new Promise((r) => setTimeout(r, 50));
    anfitrion.enviar({ t: 'aprobar', solicitud: sol.solicitud, aceptar: true });
    const { tokenControl } = await telefono.esperar('aprobado');

    const control = cliente();
    await control.abierto;
    control.enviar({ t: 'hola', sesion: cred.sesion, token: tokenControl, rol: 'control' });
    const b = await control.esperar('bienvenida');
    expect(b.notas?.[0]?.notas).toBe('NOTA PRIVADA');

    control.enviar({ t: 'comando', id: 'tel-00000001', base: 0, comando: { tipo: 'siguiente' } });
    expect((await control.esperar('ack')).resultado).toBe('aplicado');
    const e = await publico.esperar('estado');
    expect([e.estado.escena, e.estado.paso]).toEqual([0, 1]);

    // reintento tras "desconexión": mismo id → duplicado, no avanza
    control.enviar({ t: 'comando', id: 'tel-00000001', base: 0, comando: { tipo: 'siguiente' } });
    expect((await control.esperar('ack', (m) => m.resultado === 'duplicado')).estado.paso).toBe(1);

    // un controlador no puede sincronizar ni aprobar
    control.enviar({ t: 'sincronizar', estado: { ...e.estado, escena: 1 } });
    await control.esperar('error');

    anfitrion.enviar({ t: 'revocar' });
    await control.esperar('revocado');
  });
});
