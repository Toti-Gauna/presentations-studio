// Motor de movimiento: una línea de tiempo GSAP por escena con una etiqueta por paso.
// El estado visual se reconstruye siempre desde (escena, paso): avanzar un paso reproduce el
// tramo; saltar, retroceder o reconectar hace seek al final del paso, sin acumular nada.
import { gsap } from 'gsap';
import type { Accion } from '../core/esquema.ts';
import { palabras } from './dom.ts';

export type Modo = 'completo' | 'ligero' | 'reducido';

const DUR = { completo: 0.7, ligero: 0.35, reducido: 0 } as const;

interface AccionPaso {
  paso: number;
  accion: Accion;
  hacia?: 'izq' | 'der';
}

function pose(pj: HTMLElement, nombre: string, tl: gsap.core.Timeline, en: number | string) {
  for (const img of pj.querySelectorAll<HTMLElement>('.pose')) tl.set(img, { opacity: img.classList.contains(`pose-${nombre}`) ? 1 : 0 }, en);
}

function actuar(pj: HTMLElement, a: AccionPaso, tl: gsap.core.Timeline, en: string, d: number) {
  const mov = pj.querySelector<HTMLElement>('.pj-mov');
  const sombra = pj.querySelector<HTMLElement>('.pj-sombra');
  if (!mov) return;
  const dir = a.hacia === 'izq' ? -1 : 1;
  const ligero = d < 0.5;
  switch (a.accion) {
    case 'reposo':
      pose(pj, 'reposo', tl, en);
      tl.to(mov, { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1, duration: d * 0.6, ease: 'power2.out' }, en);
      break;
    case 'entrar':
      pose(pj, 'accion', tl, en);
      tl.fromTo(mov, { x: -520 * dir, opacity: 0 }, { x: 0, opacity: 1, duration: d * 1.6, ease: 'power2.out' }, en);
      if (!ligero) tl.fromTo(mov, { y: 0 }, { y: -14, duration: d * 0.2, yoyo: true, repeat: 7, ease: 'sine.inOut' }, en);
      pose(pj, 'reposo', tl, `${en}+=${d * 1.6}`);
      break;
    case 'salir':
      pose(pj, 'accion', tl, en);
      tl.to(mov, { x: 520 * dir, opacity: 0, duration: d * 1.4, ease: 'power2.in' }, en);
      break;
    case 'saludar':
      pose(pj, 'saludo', tl, en);
      if (!ligero) tl.to(mov, { keyframes: [{ rotation: -5 }, { rotation: 5 }, { rotation: -3 }, { rotation: 0 }], duration: d * 1.4, ease: 'sine.inOut' }, en);
      break;
    case 'festejar':
    case 'satisfaccion':
      pose(pj, 'festejo', tl, en);
      if (!ligero) {
        tl.to(mov, { keyframes: [{ y: -46, scaleY: 1.04, duration: d * 0.45, ease: 'power2.out' }, { y: 0, scaleY: 0.96, duration: d * 0.35, ease: 'power2.in' }, { scaleY: 1, duration: d * 0.25 }] }, en);
        if (sombra) tl.to(sombra, { keyframes: [{ scaleX: 0.7, opacity: 0.25, duration: d * 0.45 }, { scaleX: 1, opacity: 0.45, duration: d * 0.35 }] }, en);
      }
      break;
    case 'caminar':
      pose(pj, 'accion', tl, en);
      tl.to(mov, { x: `+=${140 * dir}`, duration: d * 1.4, ease: 'power1.inOut' }, en);
      if (!ligero) tl.fromTo(mov, { y: 0 }, { y: -10, duration: d * 0.175, yoyo: true, repeat: 7, ease: 'sine.inOut' }, en);
      pose(pj, 'reposo', tl, `${en}+=${d * 1.4}`);
      break;
    case 'mirar':
      tl.to(mov, { scaleX: dir, duration: d * 0.3 }, en);
      break;
    case 'senalar':
      pose(pj, 'saludo', tl, en);
      tl.to(mov, { rotation: 7 * dir, x: 24 * dir, duration: d * 0.6, ease: 'back.out(2)' }, en);
      break;
    case 'reaccionar':
      pose(pj, 'accion', tl, en);
      if (!ligero) tl.to(mov, { keyframes: [{ scaleY: 0.9, scaleX: 1.08, duration: d * 0.2 }, { scaleY: 1.04, scaleX: 0.97, duration: d * 0.25 }, { scaleY: 1, scaleX: 1, duration: d * 0.3 }] }, en);
      break;
  }
}

function contar(nodo: HTMLElement, tl: gsap.core.Timeline, en: string, d: number) {
  const fin = Number(nodo.dataset['contar']);
  const formato = nodo.dataset['formato'];
  const proxy = { v: 0 };
  const pintar = () => {
    const n = Math.round(proxy.v).toLocaleString('es-AR').replace(/ /g, ' ');
    nodo.textContent = formato === 'ars' ? `$ ${n}` : formato === 'porcentaje' ? `${n} %` : n;
  };
  tl.fromTo(proxy, { v: 0 }, { v: fin, duration: d * 1.6, ease: 'power2.out', onUpdate: pintar, onComplete: pintar }, en);
}

function entrada(nodo: HTMLElement, tipo: string, tl: gsap.core.Timeline, en: string, d: number, modo: Modo) {
  if (modo === 'reducido' || tipo === 'ninguna') {
    tl.fromTo(nodo, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.001 }, en);
    return;
  }
  const ligero = modo === 'ligero';
  switch (ligero && tipo !== 'barra' ? 'fundido' : tipo) {
    case 'subir':
      tl.fromTo(nodo, { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: d, ease: 'power3.out' }, en);
      break;
    case 'escala':
      tl.fromTo(nodo, { autoAlpha: 0, scale: 0.86 }, { autoAlpha: 1, scale: 1, duration: d, ease: 'back.out(1.6)' }, en);
      break;
    case 'mascara':
      tl.fromTo(nodo, { autoAlpha: 1, clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: d * 1.2, ease: 'power3.inOut' }, en);
      break;
    case 'palabras': {
      const ps = palabras(nodo);
      tl.set(nodo, { autoAlpha: 1 }, en);
      tl.fromTo(ps, { autoAlpha: 0, y: 42, rotation: 2 }, { autoAlpha: 1, y: 0, rotation: 0, duration: d, stagger: 0.09, ease: 'power3.out' }, en);
      break;
    }
    case 'barra': {
      const cuerpo = nodo.querySelector('.barra-cuerpo');
      const i = Number(nodo.style.getPropertyValue('--i') || 0);
      tl.fromTo(nodo, { autoAlpha: 0 }, { autoAlpha: 1, duration: d * 0.3 }, `${en}+=${i * 0.12}`);
      if (cuerpo) tl.fromTo(cuerpo, { scaleY: 0 }, { scaleY: 1, duration: d * (ligero ? 0.6 : 1.2), ease: 'power3.out' }, `${en}+=${i * 0.12}`);
      break;
    }
    default:
      tl.fromTo(nodo, { autoAlpha: 0 }, { autoAlpha: 1, duration: d, ease: 'power1.out' }, en);
  }
}

/**
 * Línea de tiempo de una escena. Las piezas con data-paso=k entran en la etiqueta "pk".
 * Cada paso termina cuando terminan sus tweens (más una pausa mínima de lectura).
 */
export class LineaEscena {
  readonly tl: gsap.core.Timeline;
  readonly pasos: number;
  private fines: number[] = [];
  private tramo: gsap.core.Tween | null = null;

  constructor(raiz: HTMLElement, pasos: number, modo: Modo) {
    this.pasos = pasos;
    const d = DUR[modo] || 0.001;
    this.tl = gsap.timeline({ paused: true });
    const nodos = [...raiz.querySelectorAll<HTMLElement>('[data-paso]')];
    const pjs = [...raiz.querySelectorAll<HTMLElement>('.pj')];
    let cursor = 0;
    for (let k = 0; k < pasos; k++) {
      const etiqueta = `p${k}`;
      this.tl.addLabel(etiqueta, cursor);
      for (const n of nodos) if (Number(n.dataset['paso']) === k && !n.classList.contains('pj')) {
        entrada(n, n.dataset['entrada'] ?? 'fundido', this.tl, etiqueta, d, modo);
        const c = n.matches('[data-contar]') ? n : n.querySelector<HTMLElement>('[data-contar]');
        if (c && modo !== 'reducido') contar(c, this.tl, etiqueta, d);
      }
      for (const pj of pjs) {
        if (Number(pj.dataset['paso']) === k) {
          pose(pj, 'reposo', this.tl, etiqueta);
          this.tl.fromTo(pj, { autoAlpha: 0 }, { autoAlpha: 1, duration: modo === 'reducido' ? 0.001 : d * 0.5 }, etiqueta);
        }
        const acciones = JSON.parse(pj.dataset['acciones'] ?? '[]') as AccionPaso[];
        for (const a of acciones) if (a.paso === k && modo !== 'reducido') actuar(pj, a, this.tl, etiqueta, d);
        else if (a.paso === k) pose(pj, a.accion === 'festejar' || a.accion === 'satisfaccion' ? 'festejo' : a.accion === 'saludar' || a.accion === 'senalar' ? 'saludo' : a.accion === 'reaccionar' ? 'accion' : 'reposo', this.tl, etiqueta);
      }
      // piezas que todavía no entraron arrancan ocultas (estado inicial explícito)
      cursor = Math.max(this.tl.duration(), cursor) + (modo === 'reducido' ? 0.001 : 0.05);
      this.fines.push(cursor);
    }
    // Ocultar todo lo de pasos futuros en t=0 (inmediateRender de fromTo ya lo hace; esto cubre sets)
    for (const n of nodos) if (Number(n.dataset['paso']) > 0) gsap.set(n, { autoAlpha: 0 });
    this.tl.seek(0, false);
  }

  fin(paso: number): number {
    return this.fines[Math.min(Math.max(paso, 0), this.pasos - 1)] ?? 0;
  }

  /** Lleva la escena al final del paso indicado. animar=true solo para "paso siguiente". */
  ir(paso: number, animar: boolean): void {
    this.tramo?.kill();
    this.tramo = null;
    const destino = this.fin(paso);
    if (!animar) {
      this.tl.seek(destino, false);
      return;
    }
    const desde = paso === 0 ? 0 : this.fin(paso - 1);
    this.tl.seek(desde, false);
    this.tramo = this.tl.tweenFromTo(desde, destino, { ease: 'none' });
  }

  matar(): void {
    this.tramo?.kill();
    this.tl.kill();
  }
}
