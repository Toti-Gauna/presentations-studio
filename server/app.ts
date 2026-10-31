// Servidor de sesiones: HTTP (crear sesión, código de emparejamiento, emparejar, terminar,
// redirecciones QR, salud) + WebSocket (estado y comandos). Opcionalmente sirve el build estático.
import { createServer, type IncomingMessage, type ServerResponse, type Server } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { WebSocketServer, WebSocket } from 'ws';
import { ErrorSesion, Sesiones, validarNuevaSesion, type Sesion } from './sesiones.ts';
import { Redirecciones } from './redirecciones.ts';
import type { MensajeCliente, MensajeServidor, Rol } from '../src/core/protocolo.ts';
import { LIMITE_MENSAJE } from '../src/core/protocolo.ts';

export interface Config {
  puerto: number;
  origenes: string[]; // orígenes exactos permitidos (CORS + WS)
  estaticos?: string; // carpeta dist/ a servir (opcional)
  redirecciones: string[]; // archivos qr.json con destinos estables
  version: string;
  confiarProxy: boolean; // usar X-Forwarded-For (detrás de Render/Caddy)
}

interface Conexion {
  ws: WebSocket;
  rol: Rol;
  sesion: string;
  dispositivo?: string;
  solicitud?: string;
}

const TIPOS: Record<string, string> = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.mp4': 'video/mp4',
  '.webm': 'video/webm', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.webmanifest': 'application/manifest+json', '.pdf': 'application/pdf',
};

function log(evento: string, campos: Record<string, string | number | boolean> = {}) {
  // Lista blanca: nunca tokens, códigos, cuerpos ni notas.
  console.log(JSON.stringify({ t: new Date().toISOString(), evento, ...campos }));
}

export function crearApp(config: Config, sesiones = new Sesiones()): { servidor: Server; cerrar: () => Promise<void>; redirecciones: Redirecciones } {
  const redirecciones = new Redirecciones(config.redirecciones);
  const conexiones = new Map<string, Set<Conexion>>();
  const creacionesPorIp = new Map<string, number[]>();

  const ip = (req: IncomingMessage) =>
    (config.confiarProxy ? String(req.headers['x-forwarded-for'] ?? '').split(',')[0]?.trim() : '') || req.socket.remoteAddress || '?';

  function cabeceras(res: ServerResponse, origen?: string) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Cache-Control', 'no-store');
    if (origen && config.origenes.includes(origen)) {
      res.setHeader('Access-Control-Allow-Origin', origen);
      res.setHeader('Vary', 'Origin');
      res.setHeader('Access-Control-Allow-Headers', 'content-type, authorization');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    }
  }
  function json(res: ServerResponse, codigo: number, cuerpo: unknown) {
    res.statusCode = codigo;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(cuerpo));
  }
  async function leer(req: IncomingMessage): Promise<unknown> {
    let total = 0;
    const partes: Buffer[] = [];
    for await (const parte of req) {
      total += (parte as Buffer).length;
      if (total > LIMITE_MENSAJE) throw new ErrorSesion('datos-invalidos');
      partes.push(parte as Buffer);
    }
    try {
      return JSON.parse(Buffer.concat(partes).toString('utf8') || '{}');
    } catch {
      throw new ErrorSesion('datos-invalidos');
    }
  }
  const bearer = (req: IncomingMessage) => String(req.headers.authorization ?? '').replace(/^Bearer /, '');
  const HTTP: Record<string, number> = { 'no-existe': 404, 'no-autorizado': 401, 'codigo-invalido': 403, 'demasiados-intentos': 429, lleno: 409, 'datos-invalidos': 400, limite: 503 };

  function enviar(c: Conexion, m: MensajeServidor) {
    if (c.ws.readyState === WebSocket.OPEN) c.ws.send(JSON.stringify(m));
  }
  function de(sesion: string) {
    let set = conexiones.get(sesion);
    if (!set) conexiones.set(sesion, (set = new Set()));
    return set;
  }
  function difundir(s: Sesion, por: string | null) {
    for (const c of de(s.id)) if (c.rol !== 'espera') enviar(c, { t: 'estado', estado: s.estado, por });
  }
  function avisarDispositivos(s: Sesion) {
    const conectados = new Set([...de(s.id)].filter((c) => c.rol === 'control' && c.dispositivo).map((c) => c.dispositivo as string));
    const lista = sesiones.dispositivos(s, conectados);
    for (const c of de(s.id)) if (c.rol === 'anfitrion') enviar(c, { t: 'dispositivos', lista });
  }

  function estatico(req: IncomingMessage, res: ServerResponse, ruta: string): boolean {
    if (!config.estaticos) return false;
    const raiz = resolve(config.estaticos);
    let archivo = normalize(join(raiz, decodeURIComponent(ruta)));
    if (!archivo.startsWith(raiz)) return false;
    if (existsSync(archivo) && statSync(archivo).isDirectory()) archivo = join(archivo, 'index.html');
    if (!existsSync(archivo)) return false;
    res.setHeader('Content-Type', TIPOS[extname(archivo)] ?? 'application/octet-stream');
    res.setHeader('Cache-Control', ruta.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'no-cache');
    if (req.method === 'HEAD') res.end();
    else createReadStream(archivo).pipe(res);
    return true;
  }

  const servidor = createServer(async (req, res) => {
    const url = new URL(req.url ?? '/', 'http://local');
    const origen = req.headers.origin;
    cabeceras(res, origen);
    try {
      if (req.method === 'OPTIONS') return void res.writeHead(204).end();
      if (url.pathname === '/salud') return json(res, 200, { ok: true, version: config.version, sesiones: sesiones.cantidad });

      const r = url.pathname.match(/^\/r\/([a-z0-9-]{1,63})\/?$/);
      if (r && (req.method === 'GET' || req.method === 'HEAD')) {
        const destino = redirecciones.destino(r[1] as string);
        if (!destino) return json(res, 404, { error: 'no-existe' });
        res.statusCode = 302;
        res.setHeader('Location', destino);
        return void res.end();
      }

      if (url.pathname.startsWith('/api/')) {
        // Las mutaciones solo desde orígenes permitidos (o sin Origin: herramientas locales/curl).
        if (req.method !== 'GET' && origen && !config.origenes.includes(origen)) return json(res, 403, { error: 'origen' });
        if (url.pathname === '/api/sesiones' && req.method === 'POST') {
          const quien = ip(req);
          const ahora = Date.now();
          const lista = (creacionesPorIp.get(quien) ?? []).filter((t) => t > ahora - 10 * 60_000);
          if (lista.length >= 30) return json(res, 429, { error: 'demasiadas-sesiones' });
          lista.push(ahora);
          creacionesPorIp.set(quien, lista);
          const datos = validarNuevaSesion(await leer(req));
          if (!datos) return json(res, 400, { error: 'datos-invalidos' });
          const cred = sesiones.crear(datos);
          log('sesion-creada', { deck: datos.deck, version: datos.version, escenas: datos.forma.pasos.length });
          return json(res, 201, cred);
        }
        const m = url.pathname.match(/^\/api\/sesiones\/([A-Za-z0-9_-]{8,40})(\/codigo|\/emparejar)?$/);
        if (m) {
          const id = m[1] as string;
          if (m[2] === '/codigo' && req.method === 'POST') return json(res, 201, sesiones.nuevoCodigo(id, bearer(req)));
          if (m[2] === '/emparejar' && req.method === 'POST') {
            const cuerpo = (await leer(req)) as Record<string, unknown>;
            const sol = sesiones.solicitar(id, cuerpo['codigo'], cuerpo['nombre']);
            const s = sesiones.obtener(id);
            const sesionSol = s.solicitudes.get(sol.solicitud);
            for (const c of de(id)) if (c.rol === 'anfitrion') enviar(c, { t: 'solicitud', solicitud: sol.solicitud, dispositivo: sesionSol?.nombre ?? 'Teléfono', expira: sol.expira });
            log('emparejamiento-solicitado');
            return json(res, 201, sol);
          }
          if (!m[2] && req.method === 'DELETE') {
            sesiones.terminar(id, bearer(req));
            for (const c of de(id)) c.ws.close(4000, 'fin');
            conexiones.delete(id);
            log('sesion-terminada');
            return void res.writeHead(204).end();
          }
        }
        return json(res, 404, { error: 'no-existe' });
      }
      if ((req.method === 'GET' || req.method === 'HEAD') && estatico(req, res, url.pathname)) return;
      return json(res, 404, { error: 'no-existe' });
    } catch (e) {
      if (e instanceof ErrorSesion) return json(res, HTTP[e.codigo] ?? 400, { error: e.codigo });
      log('error-http', { ruta: url.pathname.slice(0, 40) });
      return json(res, 500, { error: 'interno' });
    }
  });

  const wss = new WebSocketServer({ noServer: true, maxPayload: LIMITE_MENSAJE });
  servidor.on('upgrade', (req, socket, head) => {
    const url = new URL(req.url ?? '/', 'http://local');
    const origen = req.headers.origin;
    if (url.pathname !== '/ws' || (origen && !config.origenes.includes(origen))) {
      socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
      return void socket.destroy();
    }
    wss.handleUpgrade(req, socket, head, (ws) => atender(ws));
  });

  function atender(ws: WebSocket) {
    let conexion: Conexion | null = null;
    let mensajes = 0;
    const ventana = setInterval(() => (mensajes = 0), 1000);
    const espera = setTimeout(() => !conexion && ws.close(4001, 'sin-hola'), 5000);
    let vivo = true;
    ws.on('pong', () => (vivo = true));
    const latido = setInterval(() => {
      if (!vivo) return ws.terminate();
      vivo = false;
      ws.ping();
    }, 15000);

    ws.on('message', (dato) => {
      if (++mensajes > 30) return ws.close(4029, 'rafaga');
      let m: MensajeCliente;
      try {
        m = JSON.parse(String(dato));
      } catch {
        return ws.close(4002, 'formato');
      }
      try {
        if (!conexion) {
          if (m.t !== 'hola') return ws.close(4001, 'sin-hola');
          const auth = sesiones.autenticar(m.sesion, m.token, m.rol);
          conexion = { ws, rol: m.rol, sesion: auth.sesion.id, dispositivo: auth.dispositivo, solicitud: auth.solicitud };
          de(auth.sesion.id).add(conexion);
          clearTimeout(espera);
          if (m.rol === 'espera') return;
          const s = auth.sesion;
          const privado = m.rol === 'anfitrion' || m.rol === 'control';
          enviar(conexion, {
            t: 'bienvenida', rol: m.rol, estado: s.estado, forma: s.forma, deck: s.deck, version: s.version, huella: s.huella,
            ...(privado ? { notas: s.notas } : {}),
            ...(m.rol === 'anfitrion' ? { dispositivos: sesiones.dispositivos(s, new Set()) } : {}),
          });
          avisarDispositivos(s);
          log('conexion', { rol: m.rol });
          return;
        }
        const s = sesiones.obtener(conexion.sesion);
        if (m.t === 'ping') return enviar(conexion, { t: 'pong', n: m.n, ahora: Date.now() });
        if (m.t === 'comando' && (conexion.rol === 'anfitrion' || conexion.rol === 'control')) {
          if (conexion.rol === 'control') sesiones.autenticarDispositivo(s, conexion.dispositivo);
          const r = sesiones.comando(s, m.id, m.base, m.comando);
          enviar(conexion, { t: 'ack', id: String(m.id).slice(0, 64), resultado: r.resultado, estado: s.estado });
          if (r.cambio) difundir(s, conexion.dispositivo ?? 'anfitrion');
          return;
        }
        if (m.t === 'sincronizar' && conexion.rol === 'anfitrion') {
          if (sesiones.sincronizar(s, m.estado)) difundir(s, 'anfitrion');
          return;
        }
        if (m.t === 'aprobar' && conexion.rol === 'anfitrion') {
          const r = sesiones.resolver(s, String(m.solicitud), m.aceptar === true);
          for (const c of de(s.id))
            if (c.rol === 'espera' && c.solicitud === m.solicitud) {
              enviar(c, r ? { t: 'aprobado', tokenControl: r.tokenControl, dispositivo: r.dispositivo } : { t: 'rechazado' });
              c.ws.close(4100, 'resuelto');
            }
          log(r ? 'control-aprobado' : 'control-rechazado');
          return avisarDispositivos(s);
        }
        if (m.t === 'revocar' && conexion.rol === 'anfitrion') {
          const ids = sesiones.revocar(s, typeof m.dispositivo === 'string' ? m.dispositivo : undefined);
          for (const c of de(s.id))
            if (c.rol === 'control' && c.dispositivo && ids.includes(c.dispositivo)) {
              enviar(c, { t: 'revocado' });
              c.ws.close(4003, 'revocado');
            }
          log('control-revocado', { cantidad: ids.length });
          return avisarDispositivos(s);
        }
        enviar(conexion, { t: 'error', codigo: 'prohibido' });
      } catch (e) {
        const codigo = e instanceof ErrorSesion ? e.codigo : 'interno';
        if (conexion?.ws === ws && codigo === 'no-autorizado') {
          enviar(conexion, { t: 'revocado' });
          return ws.close(4003, 'revocado');
        }
        ws.send(JSON.stringify({ t: 'error', codigo } satisfies MensajeServidor));
        if (!conexion) ws.close(4003, codigo);
      }
    });
    ws.on('close', () => {
      clearInterval(ventana);
      clearInterval(latido);
      clearTimeout(espera);
      if (conexion) {
        de(conexion.sesion).delete(conexion);
        try {
          avisarDispositivos(sesiones.obtener(conexion.sesion));
        } catch {
          /* sesión terminada */
        }
      }
    });
  }

  const limpieza = setInterval(() => sesiones.limpiar(), 60_000);
  return {
    servidor,
    redirecciones,
    cerrar: () =>
      new Promise((ok) => {
        clearInterval(limpieza);
        for (const c of wss.clients) c.terminate();
        wss.close();
        servidor.close(() => ok());
      }),
  };
}
