// Sesiones de presentación: estado autoritativo del control remoto, credenciales por rol,
// emparejamiento con aprobación y deduplicación de comandos. Sin red: se prueba en memoria.
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { aplicar, comandoValido, estadoInicial, estadoValido, type Estado, type Forma } from '../src/core/estado.ts';
import type { Dispositivo, NotaEscena, ResultadoComando, Rol } from '../src/core/protocolo.ts';

export const TTL_SESION_MS = 8 * 60 * 60 * 1000;
export const TTL_CODIGO_MS = 3 * 60 * 1000;
export const TTL_SOLICITUD_MS = 2 * 60 * 1000;
export const MAX_INTENTOS_EMPAREJAR = 8; // por sesión y ventana
export const VENTANA_INTENTOS_MS = 60 * 1000;
export const MAX_DISPOSITIVOS = 3;
const MAX_IDS_RECORDADOS = 512;

export const secreto = (bytes = 32) => randomBytes(bytes).toString('base64url');
export const hash = (s: string) => createHash('sha256').update(s).digest('hex');
function igual(hashGuardado: string, valor: string): boolean {
  const a = Buffer.from(hashGuardado, 'hex');
  const b = Buffer.from(hash(valor), 'hex');
  return a.length === b.length && timingSafeEqual(a, b);
}

interface Controlador {
  id: string;
  nombre: string;
  tokenHash: string;
  desde: number;
  revocado: boolean;
}
interface Solicitud {
  id: string;
  nombre: string;
  esperaHash: string;
  expira: number;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  controlador?: string;
}

export interface Sesion {
  id: string;
  creada: number;
  expira: number;
  deck: string;
  version: string;
  huella: string;
  forma: Forma;
  notas: NotaEscena[];
  estado: Estado;
  anfitrionHash: string;
  publicoHash: string;
  codigo: { hash: string; expira: number } | null;
  solicitudes: Map<string, Solicitud>;
  controladores: Map<string, Controlador>;
  intentos: number[];
  /** id de comando → resultado (deduplicación de reintentos). */
  vistos: Map<string, ResultadoComando>;
}

export interface Credenciales {
  sesion: string;
  tokenAnfitrion: string;
  tokenPublico: string;
}

export type CodigoError = 'no-existe' | 'no-autorizado' | 'codigo-invalido' | 'demasiados-intentos' | 'lleno' | 'datos-invalidos' | 'limite';
export class ErrorSesion extends Error {
  codigo: CodigoError;
  constructor(codigo: CodigoError) {
    super(codigo);
    this.codigo = codigo;
  }
}

export interface DatosNuevaSesion {
  deck: string;
  version: string;
  huella: string;
  forma: Forma;
  notas: NotaEscena[];
}

const ID = /^[a-z0-9][a-z0-9-]{0,62}$/;

export function validarNuevaSesion(x: unknown): DatosNuevaSesion | null {
  if (!x || typeof x !== 'object') return null;
  const d = x as Record<string, unknown>;
  const forma = d['forma'] as Forma | undefined;
  if (typeof d['deck'] !== 'string' || !ID.test(d['deck'])) return null;
  if (typeof d['version'] !== 'string' || !ID.test(d['version'])) return null;
  if (typeof d['huella'] !== 'string' || !/^[a-f0-9]{16,64}$/.test(d['huella'])) return null;
  if (!forma || !Array.isArray(forma.pasos) || forma.pasos.length < 1 || forma.pasos.length > 200) return null;
  if (!forma.pasos.every((p) => Number.isInteger(p) && p >= 1 && p <= 50)) return null;
  const notas = d['notas'];
  if (!Array.isArray(notas) || notas.length !== forma.pasos.length) return null;
  const limpia: NotaEscena[] = [];
  for (const n of notas) {
    if (!n || typeof n !== 'object') return null;
    const o = n as Record<string, unknown>;
    if (typeof o['titulo'] !== 'string' || typeof o['notas'] !== 'string' || typeof o['guion'] !== 'string' || typeof o['duracion'] !== 'number') return null;
    if (o['titulo'].length > 200 || o['notas'].length > 4000 || o['guion'].length > 6000) return null;
    const medios = o['medios'] ?? [];
    if (!Array.isArray(medios) || medios.length > 6 || !medios.every((m) => typeof m === 'string' && ID.test(m))) return null;
    limpia.push({ titulo: o['titulo'], notas: o['notas'], guion: o['guion'], duracion: o['duracion'], medios: medios as string[] });
  }
  return { deck: d['deck'], version: d['version'], huella: d['huella'], forma: { pasos: [...forma.pasos] }, notas: limpia };
}

export class Sesiones {
  private sesiones = new Map<string, Sesion>();
  private reloj: () => number;
  private maxSesiones: number;
  constructor(reloj: () => number = Date.now, maxSesiones = 200) {
    this.reloj = reloj;
    this.maxSesiones = maxSesiones;
  }

  get cantidad() {
    return this.sesiones.size;
  }

  crear(datos: DatosNuevaSesion): Credenciales {
    this.limpiar();
    if (this.sesiones.size >= this.maxSesiones) throw new ErrorSesion('limite');
    const ahora = this.reloj();
    const id = secreto(12);
    const tokenAnfitrion = secreto();
    const tokenPublico = secreto();
    this.sesiones.set(id, {
      id,
      creada: ahora,
      expira: ahora + TTL_SESION_MS,
      ...datos,
      estado: estadoInicial(),
      anfitrionHash: hash(tokenAnfitrion),
      publicoHash: hash(tokenPublico),
      codigo: null,
      solicitudes: new Map(),
      controladores: new Map(),
      intentos: [],
      vistos: new Map(),
    });
    return { sesion: id, tokenAnfitrion, tokenPublico };
  }

  obtener(id: string): Sesion {
    const s = this.sesiones.get(id);
    if (!s || s.expira <= this.reloj()) {
      if (s) this.sesiones.delete(id);
      throw new ErrorSesion('no-existe');
    }
    return s;
  }

  /** Identifica el rol de un token. Un ID de sesión por sí solo nunca autoriza nada. */
  autenticar(id: string, token: string, rol: Rol): { sesion: Sesion; dispositivo?: string; solicitud?: string } {
    const s = this.obtener(id);
    if (typeof token !== 'string' || token.length < 16 || token.length > 128) throw new ErrorSesion('no-autorizado');
    if (rol === 'anfitrion' && igual(s.anfitrionHash, token)) return { sesion: s };
    if (rol === 'publico' && igual(s.publicoHash, token)) return { sesion: s };
    if (rol === 'control') {
      for (const c of s.controladores.values()) if (!c.revocado && igual(c.tokenHash, token)) return { sesion: s, dispositivo: c.id };
    }
    if (rol === 'espera') {
      for (const sol of s.solicitudes.values())
        if (sol.estado === 'pendiente' && sol.expira > this.reloj() && igual(sol.esperaHash, token)) return { sesion: s, solicitud: sol.id };
    }
    throw new ErrorSesion('no-autorizado');
  }

  /** El anfitrión genera un código de emparejamiento de un solo uso (va en el QR privado). */
  nuevoCodigo(id: string, tokenAnfitrion: string): { codigo: string; expira: number } {
    const { sesion } = this.autenticar(id, tokenAnfitrion, 'anfitrion');
    const codigo = secreto(18);
    const expira = this.reloj() + TTL_CODIGO_MS;
    sesion.codigo = { hash: hash(codigo), expira };
    return { codigo, expira };
  }

  /** El teléfono presenta el código: queda pendiente hasta que el anfitrión apruebe. */
  solicitar(id: string, codigo: unknown, nombre: unknown): { solicitud: string; tokenEspera: string; expira: number } {
    const s = this.obtener(id);
    const ahora = this.reloj();
    s.intentos = s.intentos.filter((t) => t > ahora - VENTANA_INTENTOS_MS);
    if (s.intentos.length >= MAX_INTENTOS_EMPAREJAR) throw new ErrorSesion('demasiados-intentos');
    s.intentos.push(ahora);
    if (typeof codigo !== 'string' || !s.codigo || s.codigo.expira <= ahora || !igual(s.codigo.hash, codigo)) throw new ErrorSesion('codigo-invalido');
    if ([...s.controladores.values()].filter((c) => !c.revocado).length >= MAX_DISPOSITIVOS) throw new ErrorSesion('lleno');
    s.codigo = null; // un solo uso: una foto del QR no sirve después
    const solicitud = secreto(9);
    const tokenEspera = secreto();
    const limpio = typeof nombre === 'string' ? nombre.replace(/[^\p{L}\p{N} ._-]/gu, '').slice(0, 40) : '';
    const expira = ahora + TTL_SOLICITUD_MS;
    s.solicitudes.set(solicitud, { id: solicitud, nombre: limpio || 'Teléfono', esperaHash: hash(tokenEspera), expira, estado: 'pendiente' });
    return { solicitud, tokenEspera, expira };
  }

  resolver(s: Sesion, solicitudId: string, aceptar: boolean): { tokenControl: string; dispositivo: string } | null {
    const sol = s.solicitudes.get(solicitudId);
    if (!sol || sol.estado !== 'pendiente' || sol.expira <= this.reloj()) return null;
    if (!aceptar) {
      sol.estado = 'rechazada';
      return null;
    }
    const tokenControl = secreto();
    const dispositivo = secreto(6);
    s.controladores.set(dispositivo, { id: dispositivo, nombre: sol.nombre, tokenHash: hash(tokenControl), desde: this.reloj(), revocado: false });
    sol.estado = 'aprobada';
    sol.controlador = dispositivo;
    return { tokenControl, dispositivo };
  }

  /** Cada comando de un teléfono revalida que su dispositivo no haya sido revocado. */
  autenticarDispositivo(s: Sesion, dispositivo: string | undefined): void {
    const c = dispositivo ? s.controladores.get(dispositivo) : undefined;
    if (!c || c.revocado) throw new ErrorSesion('no-autorizado');
  }

  revocar(s: Sesion, dispositivo?: string): string[] {
    const afectados: string[] = [];
    for (const c of s.controladores.values())
      if (!c.revocado && (dispositivo === undefined || c.id === dispositivo)) {
        c.revocado = true;
        afectados.push(c.id);
      }
    return afectados;
  }

  dispositivos(s: Sesion, conectados: ReadonlySet<string>): Dispositivo[] {
    return [...s.controladores.values()].filter((c) => !c.revocado).map((c) => ({ id: c.id, nombre: c.nombre, conectado: conectados.has(c.id), desde: c.desde }));
  }

  /**
   * Aplica un comando de control. `base` es la revisión que veía quien lo envió: si el estado ya
   * cambió, el comando relativo se descarta como obsoleto (evita el doble avance por doble toque o
   * por un reintento tardío). Los reintentos con el mismo id devuelven "duplicado" sin reaplicar.
   */
  comando(s: Sesion, id: unknown, base: unknown, crudo: unknown): { resultado: ResultadoComando; cambio: boolean } {
    if (typeof id !== 'string' || !/^[A-Za-z0-9_-]{8,64}$/.test(id)) return { resultado: 'invalido', cambio: false };
    const previo = s.vistos.get(id);
    if (previo) return { resultado: 'duplicado', cambio: false };
    const c = comandoValido(crudo, s.forma);
    let resultado: ResultadoComando;
    let cambio = false;
    if (!c || !Number.isInteger(base)) resultado = 'invalido';
    else {
      const absoluto = c.tipo === 'ir' || c.tipo === 'negro' || c.tipo === 'reproducir' || c.tipo === 'pausar' || c.tipo === 'reloj' || c.tipo === 'reiniciar';
      if (!absoluto && base !== s.estado.revision) resultado = 'obsoleto';
      else {
        const nuevo = aplicar(s.estado, c, s.forma, this.reloj());
        cambio = nuevo !== s.estado;
        s.estado = nuevo;
        resultado = cambio ? 'aplicado' : 'sin-cambio';
      }
    }
    s.vistos.set(id, resultado);
    if (s.vistos.size > MAX_IDS_RECORDADOS) s.vistos.delete(s.vistos.keys().next().value as string);
    return { resultado, cambio };
  }

  /** El anfitrión continuó en modo local durante un corte: su estado manda al reconectar. */
  sincronizar(s: Sesion, crudo: unknown): boolean {
    const e = estadoValido(crudo, s.forma);
    if (!e) return false;
    s.estado = { ...e, revision: Math.max(e.revision, s.estado.revision) + 1 };
    return true;
  }

  terminar(id: string, tokenAnfitrion: string): void {
    this.autenticar(id, tokenAnfitrion, 'anfitrion');
    this.sesiones.delete(id);
  }

  limpiar(): void {
    const ahora = this.reloj();
    for (const [id, s] of this.sesiones) {
      if (s.expira <= ahora) this.sesiones.delete(id);
      else for (const [sid, sol] of s.solicitudes) if (sol.expira <= ahora && sol.estado === 'pendiente') s.solicitudes.delete(sid);
    }
  }
}
