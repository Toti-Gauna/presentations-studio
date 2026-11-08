// Elementos con coreografía propia (océano, reparto, círculos). Construyen su DOM y, en cada paso de la
// escena, agregan sus tweens a la línea de tiempo. Todo reconstruible por seek; sin azar no determinista.
import { gsap } from 'gsap';
import type { Afirmacion, Elemento } from '../core/esquema.ts';
import { formatear, interpolar } from '../core/afirmaciones.ts';
import { h, marcado } from './dom.ts';
import { sonar } from './sonido.ts';

type Ctx = { afirmaciones: ReadonlyMap<string, Afirmacion> };
export interface Motor {
  alPaso(k: number, tl: gsap.core.Timeline, en: string, d: number, reducido: boolean): void;
}
export const MOTORES = new WeakMap<HTMLElement, Motor>();

const html = (t: string, ctx: Ctx) => marcado(interpolar(t, ctx.afirmaciones));
const sfx = (tl: gsap.core.Timeline, e: Parameters<typeof sonar>[0], en: string) => tl.call(sonar, [e], en);

// ── Océano: mar rojo con competidores → la marca toma lo mejor de cada uno → océano azul ──
const ROJO = { cielo: '#2B0A10', olas: ['#7A1620', '#A3222C', '#CF3A43'] };
const AZUL = { cielo: '#0B1F3F', olas: ['#123F86', '#1F57A8', '#3F7FD8'] };

function ola(nivel: number, amplitud: number, largo: number): string {
  let d = `M0 ${nivel}`;
  for (let x = 0; x <= 3840; x += largo) {
    d += ` Q ${x + largo / 4} ${nivel - amplitud} ${x + largo / 2} ${nivel} T ${x + largo} ${nivel}`;
  }
  return `${d} L3840 1080 L0 1080 Z`;
}

/** Posiciones fijas (en % del escenario) para hasta 8 competidores, repartidas sobre el mar. */
const PUESTOS = [
  [12, 34], [40, 26], [70, 32], [22, 58], [56, 56], [82, 60], [34, 78], [70, 80],
] as const;

export function oceano(el: Extract<Elemento, { tipo: 'oceano' }>, ctx: Ctx): HTMLElement {
  const raiz = h('div', { class: 'oceano' });
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 1920 1080');
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.classList.add('mar');
  const cielo = document.createElementNS(svg.namespaceURI, 'rect');
  cielo.setAttribute('width', '1920');
  cielo.setAttribute('height', '1080');
  cielo.setAttribute('fill', ROJO.cielo);
  svg.append(cielo);
  const olas = [ola(380, 26, 480), ola(560, 34, 640), ola(760, 42, 960)].map((d, i) => {
    const p = document.createElementNS(svg.namespaceURI, 'path');
    p.setAttribute('d', d);
    p.setAttribute('fill', ROJO.olas[i] as string);
    p.classList.add('ola', `ola-${i}`);
    svg.append(p);
    return p;
  });
  raiz.append(svg);
  const chips = el.competidores.map((c, i) => {
    const [x, y] = PUESTOS[i] ?? [50, 50];
    const chip = h('div', { class: 'comp', style: `left:${x}%;top:${y}%` }, h('div', { class: 'comp-flota' }));
    const flota = chip.firstElementChild as HTMLElement;
    flota.style.animationDelay = `${-i * 0.7}s`;
    const n = h('strong');
    n.innerHTML = html(c.nombre, ctx);
    const nota = h('small');
    nota.innerHTML = html(c.nota, ctx);
    flota.append(n, nota);
    raiz.append(chip);
    return chip;
  });
  const centro = h('div', { class: 'oc-centro' });
  centro.innerHTML = `<span>${html(el.marca, ctx)}</span>`;
  raiz.append(centro);
  const orbita = el.competidores.map((c, i) => {
    const ang = (i / el.competidores.length) * Math.PI * 2 - Math.PI / 2;
    const p = h('div', { class: 'oc-mejor', style: `left:${50 + Math.cos(ang) * 28}%;top:${57 + Math.sin(ang) * 26}%` });
    p.innerHTML = html(c.mejor, ctx);
    raiz.append(p);
    return p;
  });
  gsap.set([centro, ...orbita], { autoAlpha: 0 });

  MOTORES.set(raiz, {
    alPaso(k, tl, en, d, reducido) {
      const dur = reducido ? 0.001 : d;
      if (k === el.paso) {
        tl.fromTo(raiz, { autoAlpha: 0 }, { autoAlpha: 1, duration: reducido ? 0.001 : d * 0.6 }, en);
        chips.forEach((c, i) => {
          tl.fromTo(c, { autoAlpha: 0, y: 60, scale: 0.8 }, { autoAlpha: 1, y: 0, scale: 1, duration: dur, ease: 'back.out(1.8)' }, `${en}+=${reducido ? 0 : i * 0.18}`);
          if (!reducido) sfx(tl, 'pop', `${en}+=${i * 0.18}`);
        });
      }
      if (k === el.pasoToma) {
        // Cada competidor deja "lo mejor" en órbita alrededor de la marca y se hunde.
        tl.fromTo(centro, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: dur, ease: 'back.out(2)' }, en);
        if (!reducido) sfx(tl, 'golpe', en);
        chips.forEach((c, i) => {
          const o = orbita[i] as HTMLElement;
          const at = `${en}+=${reducido ? 0 : 0.3 + i * 0.22}`;
          const dx = (parseFloat(o.style.left) - parseFloat(c.style.left)) * 19.2;
          const dy = (parseFloat(o.style.top) - parseFloat(c.style.top)) * 10.8;
          tl.to(c, { x: dx * 0.6, y: dy * 0.6, scale: 0.6, autoAlpha: 0, duration: dur, ease: 'power2.in' }, at);
          tl.fromTo(o, { autoAlpha: 0, x: -dx * 0.4, y: -dy * 0.4, scale: 0.5 }, { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: dur, ease: 'back.out(1.6)' }, at);
          if (!reducido) sfx(tl, 'caida', at);
        });
      }
      if (k === el.pasoAzul) {
        tl.to(cielo, { attr: { fill: AZUL.cielo }, duration: dur * 2, ease: 'power1.inOut' }, en);
        olas.forEach((p, i) => tl.to(p, { attr: { fill: AZUL.olas[i] as string }, duration: dur * 2, ease: 'power1.inOut' }, `${en}+=${reducido ? 0 : i * 0.12}`));
        tl.to(orbita, { autoAlpha: 0, scale: 0.7, duration: dur * 0.6, stagger: reducido ? 0 : 0.04 }, `${en}+=${reducido ? 0 : 0.4}`);
        tl.to(centro, { y: -380, scale: 0.72, duration: dur * 1.2, ease: 'power3.inOut' }, `${en}+=${reducido ? 0 : 0.5}`);
        if (!reducido) sfx(tl, 'whoosh', en);
      }
    },
  });
  return raiz;
}

// ── Reparto: el total y cómo se divide (ej. lo que paga el vecino → especialista / Handy) ──
export function reparto(el: Extract<Elemento, { tipo: 'reparto' }>, ctx: Ctx): HTMLElement {
  const valor = (id: string) => {
    const a = ctx.afirmaciones.get(id);
    return { a, n: typeof a?.valor === 'number' ? a.valor : 0, txt: a ? formatear(a) : 's/d' };
  };
  const total = valor(el.total);
  const raiz = h('div', { class: 'reparto' });
  const cab = h('div', { class: 'rep-total' }, h('span', { class: 'rep-leyenda' }), h('strong', {}, total.txt));
  (cab.firstElementChild as HTMLElement).innerHTML = html(el.leyendaTotal, ctx);
  const barra = h('div', { class: 'rep-barra' });
  const lleno = h('div', { class: 'rep-lleno' });
  barra.append(lleno);
  const partes = el.partes.map((p) => {
    const v = valor(p.afirmacion);
    const seg = h('div', { class: `rep-parte rep-${p.tono}`, style: `--w:${total.n ? (v.n / total.n) * 100 : 0}%` }, h('strong', {}, v.txt), h('span', {}));
    (seg.lastElementChild as HTMLElement).innerHTML = html(p.etiqueta, ctx);
    barra.append(seg);
    return seg;
  });
  raiz.append(cab, barra);
  gsap.set(partes, { autoAlpha: 0 });
  MOTORES.set(raiz, {
    alPaso(k, tl, en, d, reducido) {
      const dur = reducido ? 0.001 : d;
      if (k === el.paso) {
        tl.fromTo(raiz, { autoAlpha: 0, y: reducido ? 0 : 30 }, { autoAlpha: 1, y: 0, duration: dur * 0.6 }, en);
        tl.fromTo(lleno, { scaleX: 0 }, { scaleX: 1, duration: dur * 1.4, ease: 'power3.out' }, en);
        if (!reducido) sfx(tl, 'conteo', en);
      }
      if (k === el.pasoPartes) {
        tl.to(lleno, { autoAlpha: 0, duration: dur * 0.4 }, en);
        partes.forEach((s, i) => {
          tl.fromTo(s, { autoAlpha: 0, scaleX: 0.2 }, { autoAlpha: 1, scaleX: 1, duration: dur, ease: 'back.out(1.4)' }, `${en}+=${reducido ? 0 : 0.2 + i * 0.35}`);
          if (!reducido) sfx(tl, 'caida', `${en}+=${0.2 + i * 0.35}`);
        });
      }
    },
  });
  return raiz;
}

// ── Círculos concéntricos (TAM / SAM / SOM) que crecen por paso ──
export function circulos(el: Extract<Elemento, { tipo: 'circulos' }>, ctx: Ctx): HTMLElement {
  const raiz = h('div', { class: 'circulos' });
  el.capas.forEach((c, i) => {
    const capa = h('div', { class: `circ circ-${i}` });
    capa.innerHTML = `<span>${html(c.etiqueta, ctx)}</span>`;
    capa.dataset['paso'] = String(c.paso);
    capa.dataset['entrada'] = 'escala';
    raiz.append(capa);
  });
  return raiz;
}
