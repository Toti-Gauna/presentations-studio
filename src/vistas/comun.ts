// Arranque común de las vistas: carga/valida el deck, arma el contexto de render y la forma.
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource-variable/dm-sans/wght.css';
import '../estilos/base.css';
import '../estilos/escenario.css';
import { cargadorAnimaciones, cargar, carpetaDe, parametros, urlRecurso, type Cargado } from '../decks.ts';
import { animacionesListas } from '../render/animacion.ts';
import type { Escena, VersionDeck } from '../core/esquema.ts';
import { escenasDeVersion } from '../core/validar.ts';
import type { Forma } from '../core/estado.ts';
import type { NotaEscena } from '../core/protocolo.ts';
import type { Contexto } from '../render/elementos.ts';
import type { Paquete } from '../core/validar.ts';
import { h } from '../render/dom.ts';

export interface Sesion {
  cargado: Cargado;
  paquete: Paquete;
  version: VersionDeck;
  escenas: Escena[];
  /** Cantidad de escenas del recorrido principal (las siguientes son anexos). */
  principales: number;
  forma: Forma;
  notas: NotaEscena[];
  ctx: Contexto;
}

export function iniciar(): Sesion | { error: string[] } {
  const p = parametros();
  const cargado = cargar(p.deck);
  if (!cargado.ok || !cargado.paquete) return { error: cargado.errores };
  const paquete = cargado.paquete;
  const version = paquete.deck.versiones.find((v) => v.id === p.version) ?? (paquete.deck.versiones[0] as VersionDeck);
  const escenas = escenasDeVersion(paquete.deck, version.id, true);
  const tema = paquete.tema;
  const ctx: Contexto = {
    tema,
    afirmaciones: new Map(paquete.afirmaciones.map((a) => [a.id, a])),
    qrs: new Map(paquete.qrs.map((q) => [q.id, q])),
    url: (archivo) => urlRecurso(carpetaDe(tema), archivo),
    recursos: new Map(paquete.deck.recursos.map((r) => [r.id, r])),
    rotulos: paquete.deck.rotulos,
    cargarAnimacion: cargadorAnimaciones(carpetaDe(tema)),
  };
  // Las animaciones del recorrido se descargan de entrada: al llegar a la diapositiva ya están listas.
  for (const e of escenas) for (const el of e.elementos) if (el.tipo === 'animacion') void ctx.cargarAnimacion?.(el.modulo);
  return {
    cargado,
    paquete,
    version,
    escenas,
    principales: version.escenas.length,
    forma: { pasos: escenas.map((e) => e.pasos), principales: version.escenas.length },
    notas: escenas.map((e) => ({ titulo: e.titulo, notas: e.notas, guion: e.guion, duracion: e.duracion, medios: e.elementos.flatMap((x) => (x.tipo === 'video' ? [x.recurso] : [])) })),
    ctx,
  };
}

export function pantallaError(raiz: HTMLElement, errores: string[], publico: boolean): void {
  raiz.replaceChildren(
    h('div', { class: 'error-carga', role: 'alert' }, h('h1', {}, 'La presentación no pasó la validación'), publico ? h('p', {}, 'Revisá la vista del presentador.') : h('ul', {}, ...errores.slice(0, 30).map((e) => h('li', {}, e)))),
  );
}

/** Precarga imágenes y pósteres de toda la versión (y fuentes). Devuelve [listos, total]. */
export async function precargar(raiz: HTMLElement, alAvanzar?: (listos: number, total: number) => void): Promise<[number, number]> {
  const urls = new Set<string>();
  for (const img of raiz.querySelectorAll<HTMLImageElement>('img')) if (img.src) urls.add(img.src);
  for (const v of raiz.querySelectorAll<HTMLVideoElement>('video')) if (v.poster) urls.add(v.poster);
  let listos = 0;
  const total = urls.size + 1;
  const marcar = () => alAvanzar?.(++listos, total);
  await Promise.all([
    animacionesListas(),
    document.fonts.ready.then(marcar),
    ...[...urls].map((u) => {
      const i = new Image();
      i.src = u;
      return i.decode().then(marcar, marcar);
    }),
  ]);
  return [listos, total];
}

export function teclas(ejecutar: (c: import('../core/estado.ts').Comando) => void, extra: Record<string, () => void> = {}): void {
  window.addEventListener('keydown', (e) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.altKey || e.ctrlKey || e.metaKey) return;
    const f = extra[e.key];
    if (f) {
      e.preventDefault();
      return f();
    }
    const mapa: Record<string, () => void> = {
      ArrowRight: () => ejecutar({ tipo: 'siguiente' }),
      PageDown: () => ejecutar({ tipo: 'siguiente' }),
      ' ': () => ejecutar({ tipo: 'siguiente' }),
      Enter: () => ejecutar({ tipo: 'siguiente' }),
      ArrowLeft: () => ejecutar({ tipo: 'anterior' }),
      PageUp: () => ejecutar({ tipo: 'anterior' }),
      ArrowDown: () => ejecutar({ tipo: 'escenaSiguiente' }),
      ArrowUp: () => ejecutar({ tipo: 'escenaAnterior' }),
      Home: () => ejecutar({ tipo: 'reiniciar' }),
    };
    const accion = mapa[e.key];
    if (accion) {
      e.preventDefault();
      accion();
    }
  });
}

export const mmss = (ms: number) => {
  const s = Math.max(0, Math.round(Math.abs(ms) / 1000));
  return `${ms < 0 ? '−' : ''}${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};
