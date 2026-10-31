// Motor de movimiento: una línea de tiempo GSAP por escena con una etiqueta por paso.
// El estado visual se reconstruye siempre desde (escena, paso): avanzar un paso reproduce el
// tramo; saltar, retroceder o reconectar hace seek al final del paso, sin acumular nada.
import { gsap } from 'gsap';
import type { Accion } from '../core/esquema.ts';
import { palabras } from './dom.ts';
import { sonar, type Efecto } from './sonido.ts';

export type Modo = 'completo' | 'ligero' | 'reducido';

const DUR = { completo: 0.7, ligero: 0.35, reducido: 0 } as const;

interface AccionPaso {
  paso: number;
  accion: Accion;
  hacia?: 'izq' | 'der';
  distancia?: number;
}

/** Programa un efecto en la línea de tiempo: suena solo al reproducir hacia adelante (los seek suprimen eventos). */
function sfx(tl: gsap.core.Timeline, e: Efecto, en: number | string) {
  tl.call(sonar, [e], en);
}

/** PRNG determinista (mulberry32) para que el confeti sea idéntico en cada pantalla y en cada repetición. */
function azar(semilla: number) {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const COLORES_CONFETI = ['#F5F59A', '#2F6BFF', '#1F57A8', '#F6A623', '#FFFFFF', '#1E9E57'];
function confeti(pj: HTMLElement, tl: gsap.core.Timeline, en: string, d: number) {
  let capa = pj.querySelector<HTMLElement>('.confeti');
  if (!capa) {
    capa = document.createElement('div');
    capa.className = 'confeti';
    const r = azar([...(pj.dataset['personaje'] ?? 'x')].reduce((s, c) => s * 31 + c.charCodeAt(0), 7));
    for (let i = 0; i < 26; i++) {
      const p = document.createElement('i');
      p.style.background = COLORES_CONFETI[i % COLORES_CONFETI.length] as string;
      p.dataset['dx'] = String((r() - 0.5) * 520);
      p.dataset['dy'] = String(-120 - r() * 260);
      p.dataset['rot'] = String((r() - 0.5) * 720);
      capa.append(p);
    }
    pj.append(capa);
  }
  const piezas = [...capa.children] as HTMLElement[];
  piezas.forEach((p, i) => {
    const dx = Number(p.dataset['dx']);
    const dy = Number(p.dataset['dy']);
    tl.fromTo(p, { x: 0, y: 0, rotation: 0, autoAlpha: 1, scale: 1 }, { keyframes: [{ x: dx * 0.6, y: dy, rotation: Number(p.dataset['rot']) / 2, duration: d * 0.7, ease: 'power2.out' }, { x: dx, y: dy + 360, rotation: Number(p.dataset['rot']), autoAlpha: 0, duration: d * 1.4, ease: 'power1.in' }] }, `${en}+=${(i % 5) * 0.02}`);
  });
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
      sfx(tl, 'whoosh', en);
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
      sfx(tl, 'pop', en);
      if (!ligero) tl.to(mov, { keyframes: [{ rotation: -5 }, { rotation: 5 }, { rotation: -3 }, { rotation: 0 }], duration: d * 1.4, ease: 'sine.inOut' }, en);
      break;
    case 'festejar':
    case 'satisfaccion':
      pose(pj, 'festejo', tl, en);
      sfx(tl, 'festejo', en);
      if (!ligero) confeti(pj, tl, en, d);
      if (!ligero) {
        tl.to(mov, { keyframes: [{ y: -46, scaleY: 1.04, duration: d * 0.45, ease: 'power2.out' }, { y: 0, scaleY: 0.96, duration: d * 0.35, ease: 'power2.in' }, { scaleY: 1, duration: d * 0.25 }] }, en);
        if (sombra) tl.to(sombra, { keyframes: [{ scaleX: 0.7, opacity: 0.25, duration: d * 0.45 }, { scaleX: 1, opacity: 0.45, duration: d * 0.35 }] }, en);
      }
      break;
    case 'caminar':
      pose(pj, 'accion', tl, en);
      sfx(tl, 'whoosh', en);
      tl.to(mov, { x: `+=${(a.distancia ?? 140) * dir}`, duration: d * (a.distancia ? 1.4 + a.distancia / 900 : 1.4), ease: 'power1.inOut' }, en);
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

const contadores = new WeakMap<gsap.core.Timeline, Array<() => void>>();
function contar(nodo: HTMLElement, tl: gsap.core.Timeline, en: string, d: number) {
  const fin = Number(nodo.dataset['contar']);
  const formato = nodo.dataset['formato'];
  const proxy = { v: 0 };
  const decimales = Number.isInteger(fin) ? 0 : 1;
  const pintar = () => {
    const v = formato === 'millones' ? proxy.v / 1e6 : proxy.v;
    const n = (Math.round(v * 10 ** decimales) / 10 ** decimales).toLocaleString('es-AR').replace(/\s/g, ' ');
    nodo.textContent = formato === 'ars' ? `$ ${n}` : formato === 'millones' ? `$ ${n} M` : formato === 'porcentaje' ? `${n} %` : n;
  };
  // Los saltos (seek) suprimen eventos: el número se repinta a mano después de cada seek.
  contadores.set(tl, [...(contadores.get(tl) ?? []), pintar]);
  tl.fromTo(proxy, { v: 0 }, { v: fin, duration: d * 1.6, ease: 'power2.out', onUpdate: pintar, onComplete: pintar }, en);
  sfx(tl, 'conteo', en);
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
      sfx(tl, 'pop', en);
      break;
    case 'golpe': {
      // Tipografía que pega: entra grande y girada, se asienta con un rebote corto (como los golpes de kinetic-studio).
      tl.fromTo(nodo, { autoAlpha: 0, scale: 2.6, rotation: -6 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: d * 0.55, ease: 'back.out(2.2)' }, en);
      sfx(tl, 'golpe', en);
      break;
    }
    case 'mascara':
      tl.fromTo(nodo, { autoAlpha: 1, clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: d * 1.2, ease: 'power3.inOut' }, en);
      break;
    case 'palabras': {
      const ps = palabras(nodo);
      tl.set(nodo, { autoAlpha: 1 }, en);
      ps.forEach((_, i) => sfx(tl, 'tic', `${en}+=${i * 0.09}`));
      tl.fromTo(ps, { autoAlpha: 0, y: 42, rotation: 2 }, { autoAlpha: 1, y: 0, rotation: 0, duration: d, stagger: 0.09, ease: 'power3.out' }, en);
      break;
    }
    case 'deslizarPantalla':
      tl.fromTo(nodo, { autoAlpha: 1, xPercent: 100 }, { xPercent: 0, duration: d * 0.9, ease: 'power3.inOut' }, en);
      break;
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

/** Escala del escenario (para pasar medidas de pantalla a coordenadas del escenario de 1920). */
function escala(raiz: HTMLElement): number {
  const esc = raiz.closest<HTMLElement>('.escenario');
  return Number(esc?.style.getPropertyValue('--k') || 1) || 1;
}

/**
 * Un personaje trae una pieza: si el personaje entra en este mismo paso, caminan juntos desde el costado;
 * si ya estaba en escena, la pieza sale de él, vuela a su lugar y "cae" con un rebote. Determinista y reconstruible.
 */
function traerPieza(raiz: HTMLElement, nodo: HTMLElement, paso: number, tl: gsap.core.Timeline, en: string, d: number, modo: Modo) {
  const el = raiz.querySelector<HTMLElement>(`.el[data-id="${nodo.dataset['traidoPor']}"]`);
  const pj = el?.querySelector<HTMLElement>('.pj');
  const mov = pj?.querySelector<HTMLElement>('.pj-mov');
  if (!pj || !mov) return entrada(nodo, 'subir', tl, en, d, modo);
  const lado = nodo.dataset['desde'] === 'der' ? 1 : -1;
  const juntos = Number(pj.dataset['paso']) === paso;
  const k = escala(raiz);
  const a = pj.getBoundingClientRect();
  const b = nodo.getBoundingClientRect();
  const dur = d * (modo === 'ligero' ? 1 : 1.7);
  if (juntos) {
    const dx = lado * 1100;
    pose(pj, 'accion', tl, en);
    tl.fromTo(mov, { x: dx }, { x: 0, duration: dur, ease: 'power2.out' }, en);
    tl.fromTo(nodo, { autoAlpha: 1, x: dx, y: -40, rotation: lado * -5 }, { x: 0, duration: dur, ease: 'power2.out' }, en);
    sfx(tl, 'whoosh', en);
  } else {
    const dx = (a.left + a.width / 2 - (b.left + b.width / 2)) / k;
    const dy = (a.top + a.height * 0.35 - (b.top + b.height / 2)) / k;
    pose(pj, 'saludo', tl, en);
    tl.fromTo(nodo, { autoAlpha: 0, x: dx, y: dy, scale: 0.3, rotation: lado * -8 }, { autoAlpha: 1, x: 0, y: -40, scale: 1, duration: dur * 0.8, ease: 'power2.out' }, en);
  }
  tl.to(nodo, { y: 0, rotation: 0, duration: d * 0.6, ease: 'bounce.out' }, `${en}+=${juntos ? dur : dur * 0.8}`);
  sfx(tl, 'caida', `${en}+=${juntos ? dur : dur * 0.8}`);
  pose(pj, 'festejo', tl, `${en}+=${juntos ? dur : dur * 0.8}`);
  pose(pj, 'reposo', tl, `${en}+=${(juntos ? dur : dur * 0.8) + d * 1.2}`);
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
        if (n.dataset['entrada'] === 'traer' && modo !== 'reducido') {
          traerPieza(raiz, n, k, this.tl, etiqueta, d, modo);
          continue;
        }
        entrada(n, n.dataset['entrada'] === 'traer' ? 'fundido' : (n.dataset['entrada'] ?? 'fundido'), this.tl, etiqueta, d, modo);
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
    this.tl.seek(0, true);
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
      this.tl.seek(destino, true);
      this.repintar();
      return;
    }
    const desde = paso === 0 ? 0 : this.fin(paso - 1);
    this.tl.seek(desde, true);
    this.repintar();
    this.tramo = this.tl.tweenFromTo(desde, destino, { ease: 'none' });
  }

  private repintar(): void {
    for (const f of contadores.get(this.tl) ?? []) f();
  }

  matar(): void {
    this.tramo?.kill();
    this.tl.kill();
  }
}
