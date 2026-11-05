// Animaciones de la marca: escenas armadas en código (HTML + CSS + GSAP) que viven en brands/<carpeta>/animaciones.
// Avanzan por tramos: el paso k de la diapositiva reproduce el tramo k de la animación. Se montan en un Shadow DOM
// (los estilos del escenario no las tocan) y se manejan con un único número p, medido en pasos (1,5 = mitad del
// tramo del paso 1). Todo es reconstruible desde (escena, paso): el seek lleva p al final del paso, como cualquier pieza.
import { gsap } from 'gsap';
import type { Afirmacion, Elemento } from '../core/esquema.ts';
import { formatear, rotulo, ROTULOS } from '../core/afirmaciones.ts';
import { h } from './dom.ts';
import { MOTORES } from './motores.ts';

export interface Animacion {
  /** Lleva la escena al punto p (en pasos). Determinista: el mismo p da la misma imagen. */
  ir(p: number): void;
  /** Detiene (true) o reanuda el movimiento ambiente (nubes, autos, respiración de los personajes). */
  congelar(si: boolean): void;
  destruir(): void;
  /** Lugar que la escena deja libre para la cara del presentador en el video (px de 1920 × 1080), si reserva uno. */
  cara?(p: number): { x: number; y: number; d: number } | null;
  /** Video cuadro a cuadro: fija el reloj del movimiento ambiente (sin esto, congelada usa el tiempo de la línea). */
  reloj?(t: number | null): void;
}

export interface ContextoAnimacion {
  gsap: typeof gsap;
  /** URL de un archivo de la carpeta de la marca (personajes/gota-a.webp, iconos/casa.svg…). */
  url: (archivo: string) => string;
  /** Cifra formateada de una afirmación declarada en el elemento (nunca números escritos a mano). */
  cifra: (id: string) => string;
  /** Valor numérico de una afirmación (para conteos animados); null si no es numérica. */
  valor: (id: string) => number | null;
  /** Rótulo del tipo de dato (Proyección, Supuesto…) de una afirmación. */
  rotulo: (id: string) => string;
  /** true en exportación y en la versión sin animaciones: sin movimiento ambiente. */
  reducido: boolean;
}

export type CrearAnimacion = (raiz: ShadowRoot, ctx: ContextoAnimacion) => Animacion | Promise<Animacion>;
export type CargarAnimacion = (modulo: string) => Promise<CrearAnimacion | null>;

const pendientes = new Set<Promise<unknown>>();
/** Espera a que todas las animaciones montadas terminen de cargar (exportación, precarga). */
export async function animacionesListas(): Promise<void> {
  while (pendientes.size) await Promise.all([...pendientes]);
}

type ElAnimacion = Extract<Elemento, { tipo: 'animacion' }>;
interface Ctx {
  url: (archivo: string) => string;
  afirmaciones: ReadonlyMap<string, Afirmacion>;
  cargarAnimacion?: CargarAnimacion | undefined;
  reducido?: boolean | undefined;
}

/** Contexto que recibe el módulo: cifras solo de las afirmaciones declaradas en el elemento. */
export function contextoAnimacion(el: ElAnimacion, ctx: Ctx): ContextoAnimacion {
  const declaradas = new Set(el.afirmaciones);
  const af = (id: string) => {
    if (!declaradas.has(id)) console.error(`animación ${el.modulo}: la afirmación ${id} no está declarada en el elemento`);
    return ctx.afirmaciones.get(id);
  };
  return {
    gsap,
    url: ctx.url,
    cifra: (id) => {
      const a = af(id);
      return a ? formatear(a) : '—';
    },
    valor: (id) => {
      const v = af(id)?.valor;
      return typeof v === 'number' ? v : null;
    },
    rotulo: (id) => {
      const a = af(id);
      return a ? ROTULOS[a.tipo] : '';
    },
    reducido: Boolean(ctx.reducido),
  };
}

export function construirAnimacion(el: ElAnimacion, ctx: Ctx): HTMLElement {
  const host = h('div', { class: 'animacion', role: 'img', 'aria-label': el.alt });
  const sombra = host.attachShadow({ mode: 'open' });
  const reducido = Boolean(ctx.reducido);
  const actx = contextoAnimacion(el, ctx);
  let anim: Animacion | null = null;
  let p = 0;
  // Un solo dueño de p: la línea de tiempo de la escena. El setter lo aplica en cada render (también en los seek).
  const estado = {
    get p() {
      return p;
    },
    set p(v: number) {
      p = v;
      anim?.ir(v);
    },
  };
  const carga = (ctx.cargarAnimacion ? ctx.cargarAnimacion(el.modulo) : Promise.resolve(null))
    .then(async (crear) => {
      if (!crear) {
        sombra.append(h('div', { style: 'position:absolute;inset:0;display:grid;place-items:center;font:600 28px system-ui;color:#5F6B84' }, `Animación pendiente: ${el.alt}`));
        return;
      }
      anim = await crear(sombra, actx);
      if (reducido) anim.congelar(true);
      anim.ir(p);
    })
    .catch((e: unknown) => console.error(`animación ${el.modulo}`, e));
  pendientes.add(carga);
  void carga.finally(() => pendientes.delete(carga));
  host.dataset['motor'] = '1';
  MOTORES.set(host, {
    alPaso(k, tl, en, _d, red) {
      const seg = el.tiempos[k];
      if (seg === undefined) return;
      tl.fromTo(estado, { p: k }, { p: k + 1, duration: red ? 0.001 : seg, ease: 'none', immediateRender: k === 0 }, en);
    },
  });
  // Rótulos de las cifras que muestra la animación: chips que el pie de la escena agrupa (fuera del Shadow DOM).
  const vistos = new Set<string>();
  for (const id of el.afirmaciones) {
    const a = ctx.afirmaciones.get(id);
    const r = a ? rotulo(a) : null;
    if (!a || !r || vistos.has(r)) continue;
    vistos.add(r);
    host.append(h('span', { class: `rotulo rotulo-${a.tipo}`, hidden: '' }, r));
  }
  return host;
}
