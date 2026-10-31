// Conexión WebSocket con reconexión exponencial y latido. Usada por presentador, control y
// pantalla pública remota. No guarda nada: quien la usa decide qué reenviar al reconectar.
import type { MensajeCliente, MensajeServidor } from '../core/protocolo.ts';

export type EstadoConexion = 'conectando' | 'conectado' | 'reconectando' | 'cerrado';

export function wsDesde(servidor: string): string {
  const u = new URL(servidor);
  u.protocol = u.protocol === 'https:' ? 'wss:' : 'ws:';
  u.pathname = '/ws';
  u.search = '';
  u.hash = '';
  return u.toString();
}

/** Servidor permitido: el configurado en el build o el mismo origen de la página (ensayo en red local). */
export function servidorPermitido(candidato: string | null): string | null {
  const configurado = (import.meta.env['VITE_SERVIDOR'] as string | undefined) ?? '';
  if (!candidato) return configurado || null;
  try {
    const u = new URL(candidato);
    if (!/^https?:$/.test(u.protocol) || u.username || u.password) return null;
    const limpio = u.origin;
    if (limpio === location.origin) return limpio;
    if (configurado && limpio === new URL(configurado).origin) return limpio;
    if (['localhost', '127.0.0.1'].includes(u.hostname) && ['localhost', '127.0.0.1'].includes(location.hostname)) return limpio;
  } catch {
    return null;
  }
  return null;
}

export class ConexionRemota {
  private ws: WebSocket | null = null;
  private intento = 0;
  private cerrada = false;
  private latido: number | undefined;
  private reintento: number | undefined;
  private n = 0;
  latencia: number | null = null;
  estado: EstadoConexion = 'conectando';

  private url: string;
  private hola: () => MensajeCliente;
  private alMensaje: (m: MensajeServidor) => void;
  private alEstado: (e: EstadoConexion) => void;

  constructor(url: string, hola: () => MensajeCliente, alMensaje: (m: MensajeServidor) => void, alEstado: (e: EstadoConexion) => void) {
    this.url = url;
    this.hola = hola;
    this.alMensaje = alMensaje;
    this.alEstado = alEstado;
    this.abrir();
  }

  private poner(e: EstadoConexion) {
    this.estado = e;
    this.alEstado(e);
  }

  private abrir() {
    if (this.cerrada) return;
    const ws = new WebSocket(this.url);
    this.ws = ws;
    let pings: Record<number, number> = {};
    ws.onopen = () => {
      this.intento = 0;
      ws.send(JSON.stringify(this.hola()));
      this.poner('conectado');
      window.clearInterval(this.latido);
      let sinRespuesta = 0;
      this.latido = window.setInterval(() => {
        if (++sinRespuesta > 3) return ws.close();
        const n = ++this.n;
        pings[n] = performance.now();
        ws.send(JSON.stringify({ t: 'ping', n } satisfies MensajeCliente));
      }, 4000);
      ws.addEventListener('message', (e) => {
        const m = JSON.parse(String(e.data)) as MensajeServidor;
        if (m.t === 'pong' && pings[m.n]) {
          sinRespuesta = 0;
          this.latencia = Math.round(performance.now() - (pings[m.n] as number));
          pings = {};
        }
      });
    };
    ws.onmessage = (e) => {
      try {
        this.alMensaje(JSON.parse(String(e.data)) as MensajeServidor);
      } catch {
        /* mensaje ilegible: se ignora */
      }
    };
    ws.onclose = (e) => {
      window.clearInterval(this.latido);
      if (this.cerrada || e.code === 4003 || e.code === 4100 || e.code === 4000) {
        this.poner('cerrado');
        return;
      }
      this.poner('reconectando');
      const espera = Math.min(8000, 500 * 2 ** this.intento++);
      this.reintento = window.setTimeout(() => this.abrir(), espera);
    };
  }

  enviar(m: MensajeCliente): boolean {
    if (this.ws?.readyState !== WebSocket.OPEN) return false;
    this.ws.send(JSON.stringify(m));
    return true;
  }

  reconectarYa(): void {
    window.clearTimeout(this.reintento);
    this.intento = 0;
    if (this.ws?.readyState === WebSocket.OPEN) return;
    this.ws?.close();
    this.abrir();
  }

  cerrar(): void {
    this.cerrada = true;
    window.clearInterval(this.latido);
    window.clearTimeout(this.reintento);
    this.ws?.close();
  }
}

export function idComando(): string {
  const b = new Uint8Array(12);
  crypto.getRandomValues(b);
  return [...b].map((x) => x.toString(36).padStart(2, '0')).join('').slice(0, 20);
}
