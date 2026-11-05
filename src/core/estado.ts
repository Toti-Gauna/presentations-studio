// Máquina de estados de la presentación: escena / paso / reproducción / pantalla negra / reloj.
// Pura y determinista: la usan el navegador (modo local) y el servidor de sesiones (modo remoto).
// Sin dependencias del DOM ni de la marca.

export interface Forma {
  /** Cantidad de pasos por escena, en el orden de la versión que se presenta. */
  pasos: number[];
  /**
   * Cantidad de escenas del recorrido principal (las siguientes son anexos). Si se indica, avanzar
   * nunca entra a los anexos: solo se abren con "ir" (acción explícita). Retroceder sí puede salir de ellos.
   */
  principales?: number;
}

export interface Reproduccion {
  medio: string | null;
  reproduciendo: boolean;
  /** Segundos de medio acumulados hasta `desde`. */
  posicion: number;
  /** Epoch ms en que empezó a correr (null si está en pausa). */
  desde: number | null;
}

export interface Reloj {
  corriendo: boolean;
  acumulado: number; // ms
  desde: number | null; // epoch ms
}

export interface Estado {
  escena: number;
  paso: number;
  negro: boolean;
  revision: number;
  reproduccion: Reproduccion;
  reloj: Reloj;
}

export type Comando =
  | { tipo: 'siguiente' }
  | { tipo: 'anterior' }
  | { tipo: 'escenaSiguiente' }
  | { tipo: 'escenaAnterior' }
  | { tipo: 'ir'; escena: number; paso?: number }
  | { tipo: 'reiniciar' }
  | { tipo: 'negro'; valor: boolean }
  | { tipo: 'reproducir'; medio: string }
  | { tipo: 'pausar' }
  | { tipo: 'reloj'; accion: 'iniciar' | 'pausar' | 'reiniciar' };

export const TIPOS_COMANDO = ['siguiente', 'anterior', 'escenaSiguiente', 'escenaAnterior', 'ir', 'reiniciar', 'negro', 'reproducir', 'pausar', 'reloj'] as const;

export function estadoInicial(): Estado {
  return {
    escena: 0,
    paso: 0,
    negro: false,
    revision: 0,
    reproduccion: { medio: null, reproduciendo: false, posicion: 0, desde: null },
    reloj: { corriendo: false, acumulado: 0, desde: null },
  };
}

function pasosDe(forma: Forma, escena: number): number {
  return forma.pasos[escena] ?? 1;
}

function sinMedio(r: Reproduccion): Reproduccion {
  return r.medio === null ? r : { medio: null, reproduciendo: false, posicion: 0, desde: null };
}

/** Coloca escena/paso dentro de rango. */
export function acotar(forma: Forma, escena: number, paso: number): { escena: number; paso: number } {
  const n = forma.pasos.length;
  if (n === 0) return { escena: 0, paso: 0 };
  const e = Math.min(Math.max(0, Math.trunc(escena)), n - 1);
  const p = Math.min(Math.max(0, Math.trunc(paso)), pasosDe(forma, e) - 1);
  return { escena: e, paso: p };
}

/**
 * Aplica un comando. Devuelve el mismo objeto si no hubo cambio (la revisión no avanza),
 * así un comando sin efecto (p. ej. "siguiente" en el último paso) no genera ruido.
 */
export function aplicar(estado: Estado, comando: Comando, forma: Forma, ahora: number): Estado {
  const siguiente = transicion(estado, comando, forma, ahora);
  if (siguiente === estado) return estado;
  return { ...siguiente, revision: estado.revision + 1 };
}

function mover(estado: Estado, escena: number, paso: number, forma: Forma): Estado {
  const pos = acotar(forma, escena, paso);
  if (pos.escena === estado.escena && pos.paso === estado.paso) return estado;
  const cambiaEscena = pos.escena !== estado.escena;
  return { ...estado, ...pos, reproduccion: cambiaEscena ? sinMedio(estado.reproduccion) : estado.reproduccion };
}

/** Última escena a la que se puede llegar avanzando desde `escena` (no se cruza de principales a anexos). */
function tope(forma: Forma, escena: number): number {
  const n = forma.pasos.length;
  const p = forma.principales;
  if (p === undefined || p <= 0 || p >= n) return n - 1;
  return escena < p ? p - 1 : n - 1;
}

function transicion(estado: Estado, c: Comando, forma: Forma, ahora: number): Estado {
  const ultimaEscena = tope(forma, estado.escena);
  switch (c.tipo) {
    case 'siguiente': {
      if (estado.paso < pasosDe(forma, estado.escena) - 1) return mover(estado, estado.escena, estado.paso + 1, forma);
      if (estado.escena < ultimaEscena) return mover(estado, estado.escena + 1, 0, forma);
      return estado;
    }
    case 'anterior': {
      if (estado.paso > 0) return mover(estado, estado.escena, estado.paso - 1, forma);
      if (estado.escena > 0) return mover(estado, estado.escena - 1, pasosDe(forma, estado.escena - 1) - 1, forma);
      return estado;
    }
    case 'escenaSiguiente':
      return estado.escena < ultimaEscena ? mover(estado, estado.escena + 1, 0, forma) : estado;
    case 'escenaAnterior':
      return estado.escena > 0 ? mover(estado, estado.escena - 1, 0, forma) : mover(estado, 0, 0, forma);
    case 'ir':
      return mover(estado, c.escena, c.paso ?? 0, forma);
    case 'reiniciar': {
      const r = mover(estado, 0, 0, forma);
      return r === estado && !estado.negro ? estado : { ...r, negro: false };
    }
    case 'negro':
      return estado.negro === c.valor ? estado : { ...estado, negro: c.valor };
    case 'reproducir': {
      const r = estado.reproduccion;
      if (r.medio === c.medio && r.reproduciendo) return estado;
      const posicion = r.medio === c.medio ? r.posicion : 0;
      return { ...estado, reproduccion: { medio: c.medio, reproduciendo: true, posicion, desde: ahora } };
    }
    case 'pausar': {
      const r = estado.reproduccion;
      if (!r.reproduciendo) return estado;
      const corrido = r.desde === null ? 0 : Math.max(0, ahora - r.desde) / 1000;
      return { ...estado, reproduccion: { ...r, reproduciendo: false, posicion: r.posicion + corrido, desde: null } };
    }
    case 'reloj': {
      const k = estado.reloj;
      if (c.accion === 'iniciar') return k.corriendo ? estado : { ...estado, reloj: { ...k, corriendo: true, desde: ahora } };
      if (c.accion === 'pausar') {
        if (!k.corriendo) return estado;
        return { ...estado, reloj: { corriendo: false, acumulado: k.acumulado + Math.max(0, ahora - (k.desde ?? ahora)), desde: null } };
      }
      return k.acumulado === 0 && !k.corriendo ? estado : { ...estado, reloj: { corriendo: false, acumulado: 0, desde: null } };
    }
  }
}

/** Posición actual de un medio en segundos, reconstruida desde el estado (no acumula eventos). */
export function posicionMedio(r: Reproduccion, ahora: number): number {
  if (!r.reproduciendo || r.desde === null) return r.posicion;
  return r.posicion + Math.max(0, ahora - r.desde) / 1000;
}

export function tiempoReloj(k: Reloj, ahora: number): number {
  return k.acumulado + (k.corriendo && k.desde !== null ? Math.max(0, ahora - k.desde) : 0);
}

/** Valida un comando de origen no confiable (red). Devuelve null si no es válido. */
export function comandoValido(x: unknown, forma: Forma): Comando | null {
  if (!x || typeof x !== 'object') return null;
  const c = x as Record<string, unknown>;
  switch (c['tipo']) {
    case 'siguiente':
    case 'anterior':
    case 'escenaSiguiente':
    case 'escenaAnterior':
    case 'reiniciar':
    case 'pausar':
      return { tipo: c['tipo'] };
    case 'ir': {
      const e = c['escena'];
      const p = c['paso'];
      if (!Number.isInteger(e) || (e as number) < 0 || (e as number) >= forma.pasos.length) return null;
      if (p !== undefined && (!Number.isInteger(p) || (p as number) < 0)) return null;
      return p === undefined ? { tipo: 'ir', escena: e as number } : { tipo: 'ir', escena: e as number, paso: p as number };
    }
    case 'negro':
      return typeof c['valor'] === 'boolean' ? { tipo: 'negro', valor: c['valor'] } : null;
    case 'reproducir':
      return typeof c['medio'] === 'string' && /^[a-z0-9-]{1,63}$/.test(c['medio']) ? { tipo: 'reproducir', medio: c['medio'] } : null;
    case 'reloj':
      return c['accion'] === 'iniciar' || c['accion'] === 'pausar' || c['accion'] === 'reiniciar' ? { tipo: 'reloj', accion: c['accion'] } : null;
    default:
      return null;
  }
}

/** Valida un estado completo de origen no confiable (sincronización del anfitrión). */
export function estadoValido(x: unknown, forma: Forma): Estado | null {
  if (!x || typeof x !== 'object') return null;
  const s = x as Estado;
  const ent = (n: unknown) => Number.isInteger(n) && (n as number) >= 0;
  if (!ent(s.escena) || !ent(s.paso) || !ent(s.revision) || typeof s.negro !== 'boolean') return null;
  const pos = acotar(forma, s.escena, s.paso);
  if (pos.escena !== s.escena || pos.paso !== s.paso) return null;
  const r = s.reproduccion;
  const k = s.reloj;
  if (!r || typeof r.reproduciendo !== 'boolean' || typeof r.posicion !== 'number' || !(r.medio === null || typeof r.medio === 'string')) return null;
  if (!k || typeof k.corriendo !== 'boolean' || typeof k.acumulado !== 'number') return null;
  return {
    escena: s.escena,
    paso: s.paso,
    negro: s.negro,
    revision: s.revision,
    reproduccion: { medio: r.medio, reproduciendo: r.reproduciendo, posicion: Math.max(0, r.posicion), desde: typeof r.desde === 'number' ? r.desde : null },
    reloj: { corriendo: k.corriendo, acumulado: Math.max(0, k.acumulado), desde: typeof k.desde === 'number' ? k.desde : null },
  };
}
