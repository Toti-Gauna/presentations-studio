// Anfitrión: la computadora que presenta. Tiene siempre una copia local del estado y la aplica
// al instante (teclado/clicker sin red). Si hay servidor, le envía cada comando con su revisión
// base; los comandos del teléfono llegan como estado del servidor. Si el servidor no confirma a
// tiempo, sigue en local y, al volver, impone su estado (sincronizar): nunca doble avance.
import { aplicar, estadoInicial, type Comando, type Estado, type Forma } from '../core/estado.ts';
import type { Dispositivo, MensajeServidor, NotaEscena } from '../core/protocolo.ts';
import { CanalLocal } from './local.ts';
import { ConexionRemota, idComando, wsDesde, type EstadoConexion } from './remoto.ts';

export type EstadoRemoto = 'apagado' | EstadoConexion | 'sin-confirmar';

export interface Credenciales {
  sesion: string;
  tokenAnfitrion: string;
  tokenPublico: string;
}

export interface EventosAnfitrion {
  estado: (e: Estado) => void;
  remoto: (e: EstadoRemoto) => void;
  solicitud: (s: { solicitud: string; dispositivo: string; expira: number }) => void;
  dispositivos: (lista: Dispositivo[]) => void;
}

const ESPERA_ACK_MS = 1500;

export class Anfitrion {
  estado: Estado = estadoInicial();
  remotoEstado: EstadoRemoto = 'apagado';
  credenciales: Credenciales | null = null;
  servidor: string | null = null;
  private conexion: ConexionRemota | null = null;
  private pendientes = new Map<string, number>();
  private desincronizado = false;
  private canal: CanalLocal;
  private forma: Forma;
  private ev: Partial<EventosAnfitrion> = {};

  constructor(forma: Forma, deck: string, version: string) {
    this.forma = forma;
    this.canal = new CanalLocal(deck, version);
    this.canal.escuchar((m) => {
      if (m.t === 'comando') this.ejecutar(m.comando);
      if (m.t === 'pedir') this.canal.enviar({ t: 'estado', estado: this.estado, de: this.canal.yo });
    });
    window.setInterval(() => this.canal.enviar({ t: 'latido', de: this.canal.yo }), 1000);
  }

  on<K extends keyof EventosAnfitrion>(k: K, fn: EventosAnfitrion[K]): void {
    this.ev[k] = fn;
  }

  private publicar() {
    this.canal.enviar({ t: 'estado', estado: this.estado, de: this.canal.yo });
    this.ev.estado?.(this.estado);
  }

  private remoto(e: EstadoRemoto) {
    this.remotoEstado = e;
    this.ev.remoto?.(e);
  }

  ejecutar(c: Comando): void {
    const base = this.estado.revision;
    const nuevo = aplicar(this.estado, c, this.forma, Date.now());
    if (nuevo === this.estado) return;
    this.estado = nuevo;
    this.publicar();
    if (!this.conexion) return;
    const id = idComando();
    if (this.desincronizado || !this.conexion.enviar({ t: 'comando', id, base, comando: c })) {
      this.desincronizado = true;
      this.remoto('sin-confirmar');
      return;
    }
    this.pendientes.set(
      id,
      window.setTimeout(() => {
        this.pendientes.delete(id);
        this.desincronizado = true;
        this.remoto('sin-confirmar');
        this.conexion?.reconectarYa();
      }, ESPERA_ACK_MS),
    );
  }

  /** Adopta el estado del servidor solo si es más nuevo y no hay cambios locales sin sincronizar. */
  private adoptar(e: Estado, forzar = false) {
    if (this.desincronizado) return;
    if (!forzar && e.revision < this.estado.revision) return;
    const mismaPos = e.escena === this.estado.escena && e.paso === this.estado.paso && e.negro === this.estado.negro;
    this.estado = e;
    if (!mismaPos || forzar) this.publicar();
    else this.ev.estado?.(this.estado);
  }

  private mensaje(m: MensajeServidor) {
    switch (m.t) {
      case 'bienvenida':
        if (this.desincronizado || this.estado.revision > 0) {
          // Volvemos de un corte (o de un reinicio del servidor): manda la computadora.
          this.conexion?.enviar({ t: 'sincronizar', estado: this.estado });
          this.desincronizado = false;
        } else this.adoptar(m.estado, true);
        if (m.dispositivos) this.ev.dispositivos?.(m.dispositivos);
        this.remoto('conectado');
        break;
      case 'ack': {
        const t = this.pendientes.get(m.id);
        if (t !== undefined) {
          window.clearTimeout(t);
          this.pendientes.delete(m.id);
        }
        if (m.resultado === 'obsoleto' || m.resultado === 'invalido') this.adoptar(m.estado, true);
        else this.adoptar(m.estado);
        if (!this.desincronizado && this.pendientes.size === 0) this.remoto('conectado');
        break;
      }
      case 'estado':
        this.adoptar(m.estado);
        break;
      case 'solicitud':
        this.ev.solicitud?.(m);
        break;
      case 'dispositivos':
        this.ev.dispositivos?.(m.lista);
        break;
      case 'error':
        if (m.codigo === 'no-existe' || m.codigo === 'no-autorizado') this.remoto('cerrado');
        break;
    }
  }

  async conectar(servidor: string, datos: { deck: string; version: string; huella: string; notas: NotaEscena[] }): Promise<void> {
    this.desconectar();
    this.servidor = servidor;
    this.remoto('conectando');
    const r = await fetch(`${servidor}/api/sesiones`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...datos, forma: this.forma }),
      credentials: 'omit',
    });
    if (!r.ok) {
      this.remoto('cerrado');
      throw new Error(`servidor ${r.status}`);
    }
    this.credenciales = (await r.json()) as Credenciales;
    const cred = this.credenciales;
    this.conexion = new ConexionRemota(
      wsDesde(servidor),
      () => ({ t: 'hola', sesion: cred.sesion, token: cred.tokenAnfitrion, rol: 'anfitrion' }),
      (m) => this.mensaje(m),
      (e) => {
        if (e === 'reconectando') {
          this.desincronizado = this.desincronizado || this.pendientes.size > 0;
          this.remoto('reconectando');
        } else if (e === 'cerrado') this.remoto('cerrado');
      },
    );
  }

  async codigoControl(): Promise<{ url: string; expira: number }> {
    if (!this.credenciales || !this.servidor) throw new Error('sin sesión remota');
    const r = await fetch(`${this.servidor}/api/sesiones/${this.credenciales.sesion}/codigo`, {
      method: 'POST',
      headers: { authorization: `Bearer ${this.credenciales.tokenAnfitrion}`, 'content-type': 'application/json' },
      body: '{}',
      credentials: 'omit',
    });
    if (!r.ok) throw new Error(`código ${r.status}`);
    const { codigo, expira } = (await r.json()) as { codigo: string; expira: number };
    const control = new URL('../control/', location.href);
    control.hash = new URLSearchParams({ s: this.credenciales.sesion, c: codigo, srv: this.servidor }).toString();
    return { url: control.toString(), expira };
  }

  urlPublicaRemota(base: string): string | null {
    if (!this.credenciales || !this.servidor) return null;
    const u = new URL(base);
    u.hash = new URLSearchParams({ s: this.credenciales.sesion, v: this.credenciales.tokenPublico, srv: this.servidor }).toString();
    return u.toString();
  }

  aprobar(solicitud: string, aceptar: boolean): void {
    this.conexion?.enviar({ t: 'aprobar', solicitud, aceptar });
  }

  revocar(dispositivo?: string): void {
    this.conexion?.enviar(dispositivo ? { t: 'revocar', dispositivo } : { t: 'revocar' });
  }

  /** Recuperación manual: reenvía el estado local como verdad (botón "Recuperar"). */
  recuperar(): void {
    this.canal.enviar({ t: 'estado', estado: this.estado, de: this.canal.yo });
    if (this.conexion) {
      this.desincronizado = true;
      this.conexion.reconectarYa();
      if (this.conexion.enviar({ t: 'sincronizar', estado: this.estado })) this.desincronizado = false;
    }
    this.ev.estado?.(this.estado);
  }

  latencia(): number | null {
    return this.conexion?.latencia ?? null;
  }

  async terminar(): Promise<void> {
    if (this.credenciales && this.servidor)
      await fetch(`${this.servidor}/api/sesiones/${this.credenciales.sesion}`, { method: 'DELETE', headers: { authorization: `Bearer ${this.credenciales.tokenAnfitrion}` }, credentials: 'omit' }).catch(() => undefined);
    this.desconectar();
  }

  desconectar(): void {
    this.conexion?.cerrar();
    this.conexion = null;
    this.credenciales = null;
    for (const t of this.pendientes.values()) window.clearTimeout(t);
    this.pendientes.clear();
    this.desincronizado = false;
    this.remoto('apagado');
  }
}
