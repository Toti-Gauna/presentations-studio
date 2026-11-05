// Reproductor: muestra un Estado sobre un escenario 16:9. Reconcilia la escena visible con el
// estado (transición entre escenas, tramo animado de un paso o seek), la pantalla negra y los medios.
import { gsap } from 'gsap';
import type { Escena, Tema } from '../core/esquema.ts';
import type { Estado } from '../core/estado.ts';
import { posicionMedio } from '../core/estado.ts';
import { construir, type Contexto } from './elementos.ts';
import { LineaEscena, type Modo } from './movimiento.ts';
import { h } from './dom.ts';
import { sonar } from './sonido.ts';

export function variablesTema(tema: Tema): string {
  const v: string[] = [`--fuente-titulos:${tema.fuentes.titulos}`, `--fuente-texto:${tema.fuentes.texto}`];
  if (tema.titulos) v.push(`--titulo-peso:${tema.titulos.peso}`, `--titulo-ancho:${tema.titulos.ancho}`);
  for (const [k, c] of Object.entries(tema.colores)) v.push(`--c-${k}:${c}`);
  for (const [k, r] of Object.entries(tema.radios)) v.push(`--radio-${k}:${r}`);
  return v.join(';');
}

export function paleta(tema: Tema, nombre: string): string {
  const p = tema.paletas[nombre] ?? tema.paletas['neutro'];
  if (!p) return '';
  return `--fondo:${p.fondo};--tinta:${p.tinta};--acento:${p.acento};--suave:${p.suave};--superficie:${p.superficie};--marcador:${p.marcador ?? p.acento};--marcador-tinta:${p.marcadorTinta ?? 'inherit'};--tinta-superficie:${p.tintaSuperficie ?? p.tinta}`;
}

export function modoMovimiento(defecto?: Modo): Modo {
  const q = new URLSearchParams(location.search).get('movimiento');
  if (q === 'reducido' || q === 'ligero' || q === 'completo') return q;
  if (defecto) return defecto;
  return matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reducido' : 'completo';
}

interface Visible {
  indice: number;
  escena: Escena;
  nodo: HTMLElement;
  linea: LineaEscena;
}

export interface OpcionesReproductor {
  modo?: Modo;
  /** Escalar el escenario al contenedor (true) o dejarlo en 1920×1080 (exportación). */
  escalar?: boolean;
  /** Pie con marca y número de escena. */
  pie?: boolean;
}

/** Junta los rótulos de las cifras de una escena en una sola línea al pie (tipos de dato y corte), sin repetirlos. */
function agruparRotulos(nodo: HTMLElement): void {
  const chips = [...nodo.querySelectorAll<HTMLElement>('.rotulo')].filter((c) => !c.closest('figcaption'));
  if (!chips.length) return;
  const tipos: string[] = [];
  const cortes: string[] = [];
  // El pie entra con la primera pieza rotulada y, si todas esas piezas salen, sale con la última (no queda encima de un cierre).
  let paso = Number.POSITIVE_INFINITY;
  let sale = -1;
  let todasSalen = true;
  for (const c of chips) {
    const [tipo, corte] = (c.textContent ?? '').split(' · corte ');
    if (tipo && !tipos.includes(tipo)) tipos.push(tipo);
    if (corte && !cortes.includes(corte)) cortes.push(corte);
    const pieza = c.closest<HTMLElement>('[data-paso]');
    paso = Math.min(paso, pieza ? Number(pieza.dataset['paso']) : 0);
    const raiz = c.closest<HTMLElement>('[data-sale]');
    if (raiz) sale = Math.max(sale, Number(raiz.dataset['sale']));
    else todasSalen = false;
    c.remove();
  }
  for (const g of nodo.querySelectorAll('.rotulos-grilla')) if (!g.querySelector('.rotulo')) g.remove();
  const pie = h('div', { class: 'rotulos-pie', 'data-paso': String(Number.isFinite(paso) ? paso : 0), 'data-entrada': 'fundido' }, `${tipos.join(' · ')}${cortes.length ? ` · corte ${cortes.join(', ')}` : ''}`);
  if (todasSalen && sale >= 0) pie.dataset['sale'] = String(sale);
  nodo.append(pie);
}

export class Reproductor {
  readonly escenario: HTMLElement;
  private lienzo: HTMLElement;
  private negro: HTMLElement;
  private visible: Visible | null = null;
  private saliente: HTMLElement | null = null;
  private modo: Modo;
  private ultimo: Estado | null = null;
  private observador: ResizeObserver | null = null;
  audioDesbloqueado = false;
  private contenedor: HTMLElement;
  private escenas: Escena[];
  private tema: Tema;
  private ctx: Contexto;

  constructor(contenedor: HTMLElement, escenas: Escena[], tema: Tema, ctx: Contexto, opciones: OpcionesReproductor = {}) {
    this.contenedor = contenedor;
    this.escenas = escenas;
    this.tema = tema;
    this.modo = opciones.modo ?? modoMovimiento();
    this.ctx = { ...ctx, reducido: this.modo === 'reducido' };
    this.lienzo = h('div', { class: 'lienzo' });
    this.negro = h('div', { class: 'negro', 'aria-hidden': 'true' });
    this.escenario = h('div', { class: `escenario modo-${this.modo}`, style: variablesTema(tema), role: 'region', 'aria-roledescription': 'presentación', 'aria-live': 'polite' }, this.lienzo, this.negro);
    if (opciones.pie !== false && tema.pie !== '') this.escenario.append(h('div', { class: 'pie' }, h('span', { class: 'pie-marca' }, tema.pie), h('span', { class: 'pie-num' })));
    contenedor.append(this.escenario);
    if (opciones.escalar !== false) {
      this.observador = new ResizeObserver(() => this.escalar());
      this.observador.observe(contenedor);
      this.escalar();
    }
  }

  private escalar() {
    const { width, height } = this.contenedor.getBoundingClientRect();
    const k = Math.min(width / 1920, height / 1080) || 1;
    this.escenario.style.setProperty('--k', String(k));
  }

  private crearEscena(indice: number): Visible {
    const escena = this.escenas[indice] as Escena;
    const nodo = h('section', { class: `escena disp-${escena.disposicion}`, 'data-escena': escena.id, 'aria-label': escena.titulo });
    for (const el of escena.elementos) nodo.append(construir(el, this.ctx));
    if (this.ctx.rotulos === 'pie') agruparRotulos(nodo);
    this.lienzo.append(nodo);
    const linea = new LineaEscena(nodo, escena.pasos, this.modo);
    return { indice, escena, nodo, linea };
  }

  /** Reconcilia la vista con el estado. Idempotente: mostrar dos veces el mismo estado no hace nada. */
  mostrar(estado: Estado): void {
    const previo = this.ultimo;
    this.ultimo = estado;
    this.negro.classList.toggle('activo', estado.negro);
    const num = this.escenario.querySelector('.pie-num');
    if (num) num.textContent = `${estado.escena + 1} / ${this.escenas.length}`;

    if (!this.visible || this.visible.indice !== estado.escena) {
      const anterior = this.visible;
      const entra = this.crearEscena(estado.escena);
      this.escenario.setAttribute('style', `${variablesTema(this.tema)};${paleta(this.tema, entra.escena.paleta)};--k:${this.escenario.style.getPropertyValue('--k') || 1}`);
      const haciaAdelante = !anterior || estado.escena > anterior.indice;
      const contiguo = anterior && Math.abs(estado.escena - anterior.indice) === 1;
      // Entrando hacia adelante a la escena siguiente se anima el paso 0; en cualquier otro caso, seek.
      entra.linea.ir(estado.paso, Boolean(haciaAdelante && contiguo && estado.paso === 0 && this.modo !== 'reducido'));
      this.transicion(anterior, entra, haciaAdelante);
      this.visible = entra;
    } else if (previo && previo.escena === estado.escena && estado.paso !== previo.paso) {
      this.visible.linea.ir(estado.paso, estado.paso === previo.paso + 1 && this.modo !== 'reducido');
    } else if (!previo) {
      this.visible.linea.ir(estado.paso, false);
    }
    this.medios(estado);
  }

  private transicion(sale: Visible | null, entra: Visible, adelante: boolean) {
    if (this.saliente) {
      this.saliente.remove();
      this.saliente = null;
    }
    if (!sale) return;
    const tipo = this.modo === 'reducido' ? 'corte' : entra.escena.transicion;
    const fuera = sale.nodo;
    this.saliente = fuera;
    const limpiar = () => {
      sale.linea.matar();
      for (const v of fuera.querySelectorAll('video')) v.pause();
      fuera.remove();
      if (this.saliente === fuera) this.saliente = null;
    };
    if (tipo === 'corte') return limpiar();
    const d = this.modo === 'ligero' ? 0.3 : 0.6;
    if (adelante) sonar('whoosh');
    if (tipo === 'continuidad') this.continuidad(fuera, entra.nodo, d);
    const dx = tipo === 'deslizar' ? (adelante ? 1 : -1) * 120 : 0;
    // Sin doble exposición: la escena que sale se va rápido y la que entra aparece apenas después
    // (dos láminas densas superpuestas a media opacidad se leen como un borrón).
    gsap.fromTo(entra.nodo, { autoAlpha: 0, x: dx }, { autoAlpha: 1, x: 0, duration: d * 0.8, delay: d * 0.2, ease: 'power2.out' });
    gsap.to(fuera, { autoAlpha: 0, x: -dx, duration: d * 0.45, ease: 'power1.out', onComplete: limpiar });
  }

  /** Objetos compartidos: un personaje con continuidad viaja de su posición anterior a la nueva (FLIP). */
  private continuidad(fuera: HTMLElement, dentro: HTMLElement, d: number) {
    const k = Number(this.escenario.style.getPropertyValue('--k') || 1);
    for (const nuevo of dentro.querySelectorAll<HTMLElement>('[data-continuidad]')) {
      const viejo = fuera.querySelector<HTMLElement>(`[data-continuidad="${nuevo.dataset['continuidad']}"]`);
      if (!viejo) continue;
      const a = viejo.getBoundingClientRect();
      const b = nuevo.getBoundingClientRect();
      if (!b.width) continue;
      viejo.style.visibility = 'hidden';
      gsap.fromTo(nuevo, { x: (a.left - b.left) / k, y: (a.top - b.top) / k, scale: a.width / b.width }, { x: 0, y: 0, scale: 1, duration: d * 1.4, ease: 'power3.inOut' });
    }
  }

  private medios(estado: Estado) {
    if (!this.visible) return;
    const r = estado.reproduccion;
    for (const v of this.visible.nodo.querySelectorAll<HTMLVideoElement>('video[data-medio]')) {
      if (r.medio === v.dataset['medio'] && r.reproduciendo) {
        const objetivo = posicionMedio(r, Date.now());
        if (Math.abs(v.currentTime - objetivo) > 0.4 && Number.isFinite(objetivo)) v.currentTime = objetivo;
        if (!this.audioDesbloqueado) v.muted = true;
        void v.play().catch(() => {
          v.muted = true;
          void v.play().catch(() => undefined);
        });
      } else {
        v.pause();
        if (r.medio === v.dataset['medio']) v.currentTime = r.posicion;
      }
    }
  }

  /** Debe llamarse desde un gesto del usuario en ESTA computadora (política de autoplay). */
  desbloquearAudio(): void {
    this.audioDesbloqueado = true;
    const ctx = new AudioContext();
    void ctx.resume().then(() => ctx.close());
    for (const v of this.escenario.querySelectorAll<HTMLVideoElement>('video')) if (v.dataset['sonido'] !== 'no') v.muted = false;
  }

  destruir(): void {
    this.observador?.disconnect();
    this.visible?.linea.matar();
    this.escenario.remove();
  }
}
