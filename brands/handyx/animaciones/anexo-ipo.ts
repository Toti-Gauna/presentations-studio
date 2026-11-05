// Anexo · Camino a la IPO (visión de largo plazo, sin fechas ni valuación). Los Handys suben la escalera:
// 0 hoy, pre-seed en Mar del Plata (el resto del camino se ve punteado) ·
// 1 rondas seed (Argentina y Handyx for Business) y serie A (Latinoamérica e IA en cada oficio) ·
// 2 escala: rentabilidad, auditoría y directorio independiente ·
// 3 IPO: Handyx cotiza en bolsa, como lo hicieron MercadoLibre y Globant (precedentes por afirmación, sin logos).
// Engranaje, Foco y Llave suben de a saltos; arriba festejan. La franja y 880–950 queda libre (la escalera termina en 860).
import { COLOR, entraTitulo, escena, pose, tramo, type Personaje, type Pose } from './comun/kit.ts';

const MARCAS = [0, 3.0, 6.4, 9.6, 12.8];
const BASE = 860;
const W = 328;
const GAP = 22;
const ALTOS = [250, 350, 450, 550, 650];
const bx = (k: number) => 96 + k * (W + GAP);
const tope = (k: number) => BASE - ALTOS[k]!;
const centro = (k: number) => bx(k) + W / 2;
// Cada escalón: entra (se llena) y sus textos
const T_BLOQUE = [0.6, 3.1, 4.55, 6.5, 9.7];
// Saltos del grupo: de qué escalón a cuál y cuándo empieza (el primero en saltar es Llave, el de adelante)
const SALTOS = [
  { t: 3.65, a: 1 },
  { t: 5.05, a: 2 },
  { t: 7.2, a: 3 },
  { t: 10.35, a: 4 },
];
const D_SALTO = 0.55;
const ENTRA = 1.15; // el grupo cae sobre el primer escalón
const EQUIPO: Array<{ n: Personaje; alto: number; dx: number; orden: number }> = [
  { n: 'engranaje', alto: 92, dx: -100, orden: 2 },
  { n: 'bombilla', alto: 100, dx: -4, orden: 1 },
  { n: 'llave', alto: 94, dx: 96, orden: 0 },
];
const LLEGA_ARRIBA = SALTOS[3]!.t + 2 * 0.12 + D_SALTO;
/** Huella del salto al escalón a (la del Handy del medio): sale y llega por encima de las cabezas. */
function arco(a: number): string {
  const xa = centro(a - 1) + 50;
  const xb = centro(a) - 50;
  const ya = tope(a - 1) - 116;
  const yb = tope(a) - 116;
  return `M${xa} ${ya} Q${(xa + xb) / 2} ${Math.min(ya, yb) - 46} ${xb} ${yb}`;
}

const ESCALONES = [
  { ic: 'casa', k: 'Hoy · estamos acá', n: 'Pre-seed', d: 'Mar del Plata y apps en pruebas' },
  { ic: 'bandera', k: 'Próximo', n: 'Seed', d: 'Argentina y Handyx for Business' },
  { ic: 'mundo', k: 'Después', n: 'Serie A', d: 'Latinoamérica e IA en cada oficio' },
  { ic: 'balanza', k: 'Escala', n: 'Rentabilidad', d: 'auditoría y directorio independiente' },
  { ic: 'banco', k: 'Visión', n: 'IPO', d: 'Handyx cotiza en bolsa' },
];

export default escena({
  marcas: MARCAS,
  leyendas: ['Hoy: **pre-seed** en Mar del Plata', 'Después: rondas **seed** y **serie A**', 'Escala con **rentabilidad** y buen gobierno', 'Visión: **cotizar en bolsa**'],
  css: `
    .fondo { position: absolute; inset: 0; background-color: ${COLOR.hueso}; background-image: radial-gradient(rgba(31,87,168,.10) 1.6px, transparent 2.2px); background-size: 36px 36px; }
    .encabezado { position: absolute; left: 96px; top: 52px; z-index: 50; }
    .fila-k { display: flex; align-items: center; gap: 16px; }
    .rotulo { font-weight: 800; font-size: 20px; letter-spacing: .06em; text-transform: uppercase; color: ${COLOR.azulOscuro}; border: 3px solid ${COLOR.azulOscuro}; border-radius: 999px; padding: 3px 14px; }
    .encabezado .titulo { margin-top: 12px; font-size: 62px; color: ${COLOR.noche}; }
    .piso { position: absolute; left: 72px; top: ${BASE}px; width: 1776px; height: 10px; border-radius: 5px; background: #DCE2EC; }
    .fantasma { position: absolute; border-radius: 28px; border: 3px dashed rgba(31,87,168,.28); }
    .bloque { position: absolute; border-radius: 28px 28px 10px 10px; padding: 24px 22px; transform-origin: 50% 100%; overflow: hidden; }
    .bloque.b0 { background: #fff; color: ${COLOR.noche}; box-shadow: 0 16px 34px rgba(14,29,54,.10), 0 6px 0 #DCE2EC; }
    .bloque.b1 { background: ${COLOR.celeste}; color: ${COLOR.noche}; box-shadow: 0 16px 34px rgba(14,29,54,.10), 0 6px 0 #C9D6EE; }
    .bloque.b2 { background: ${COLOR.azul}; color: #fff; box-shadow: 0 18px 36px rgba(14,29,54,.16), 0 6px 0 #17468A; }
    .bloque.b3 { background: ${COLOR.azulOscuro}; color: #fff; box-shadow: 0 18px 36px rgba(14,29,54,.18), 0 6px 0 #0C2346; }
    .bloque.b4 { background: ${COLOR.noche}; color: #fff; box-shadow: 0 0 0 5px ${COLOR.amarillo}, 0 0 44px rgba(255,201,60,.45), 0 22px 44px rgba(14,29,54,.25); }
    .contenido { position: relative; }
    .cab { display: flex; align-items: center; gap: 12px; }
    .ic { flex: none; display: grid; place-items: center; width: 46px; height: 46px; border-radius: 14px; background: ${COLOR.celeste}; }
    .b1 .ic { background: #fff; }
    .b2 .ic, .b3 .ic { background: rgba(255,255,255,.14); }
    .b4 .ic { background: rgba(255,201,60,.16); }
    .ic .icono { width: 28px; height: 28px; }
    .k { font-size: 20px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: ${COLOR.azul}; white-space: nowrap; }
    .b2 .k { color: #CFDCF2; } .b3 .k { color: ${COLOR.amarillo}; } .b4 .k { color: ${COLOR.amarillo}; }
    .b0 .k { color: #fff; background: ${COLOR.azul}; border-radius: 999px; padding: 6px 14px; letter-spacing: .04em; }
    .n { margin-top: 12px; font-size: 37px; white-space: nowrap; }
    .b4 .n { font-size: 100px; color: ${COLOR.amarillo}; margin-top: 10px; }
    .d { margin-top: 8px; font-size: 23px; font-weight: 600; line-height: 1.3; opacity: .86; }
    .b0 .d, .b1 .d { color: ${COLOR.texto}; opacity: 1; }
    .b4 .d { font-size: 26px; font-weight: 700; opacity: 1; }
    .prec { margin-top: 26px; padding: 18px 20px; border-radius: 20px; background: rgba(255,255,255,.07); box-shadow: inset 0 0 0 2px rgba(255,255,255,.10); }
    .prec .pk { font-size: 20px; font-weight: 700; color: #CFDCF2; }
    .prec .em { margin-top: 12px; }
    .prec .em b { display: block; font-size: 24px; font-weight: 800; color: #fff; }
    .prec .em span { display: block; margin-top: 2px; font-size: 22px; font-weight: 600; color: ${COLOR.amarillo}; }
    .mov { position: absolute; left: 0; top: 0; transform-origin: 50% 100%; z-index: 20; opacity: 0; }
    .pj { transform-origin: 50% 100%; }
    .huella { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; overflow: visible; z-index: 18; }
    .huella path { fill: none; stroke: ${COLOR.amarillo}; stroke-width: 7; stroke-linecap: round; stroke-dasharray: 0.1 17; opacity: 0; }
    .chispa { position: absolute; left: 0; top: 0; width: 14px; height: 14px; margin: -7px 0 0 -7px; border-radius: 50%; background: ${COLOR.amarillo}; opacity: 0; z-index: 19; }
    .chispa.s { width: 10px; height: 10px; margin: -5px 0 0 -5px; background: #fff; box-shadow: 0 0 0 3px ${COLOR.amarillo}; }
  `,
  html: (c) => {
    const bloques = ESCALONES.map((e, k) => {
      const ic = c.icono(e.ic, k === 2 || k === 3 ? 'blanco' : k === 4 ? 'oro' : '');
      const prec =
        k === 4
          ? `<div class="prec"><div class="pk">Como lo hicieron</div><div class="em e1"><b>MercadoLibre</b><span>${c.cifra('PREC-MELI')}</span></div><div class="em e2"><b>Globant</b><span>${c.cifra('PREC-GLOBANT')}</span></div></div>`
          : '';
      return `<div class="fantasma f${k}" style="left:${bx(k)}px;top:${tope(k)}px;width:${W}px;height:${ALTOS[k]}px"></div>
        <div class="bloque b${k}" style="left:${bx(k)}px;top:${tope(k)}px;width:${W}px;height:${ALTOS[k]}px"><div class="contenido">
          <div class="cab"><span class="ic">${ic}</span><span class="k">${e.k}</span></div>
          <div class="n t">${e.n}</div><div class="d">${e.d}</div>${prec}</div></div>`;
    }).join('');
    const chispas = Array.from({ length: 14 }, (_, i) => `<i class="chispa ${i % 3 === 0 ? 's' : ''}"></i>`).join('');
    return `
      <div class="fondo"></div>
      <div class="piso"></div>
      ${bloques}
      <svg class="huella" viewBox="0 0 1920 1080">${SALTOS.map((s, i) => `<path class="hu${i}" d="${arco(s.a)}"/>`).join('')}</svg>
      ${chispas}
      ${EQUIPO.map((h, i) => `<div class="mov h${i}" style="width:${h.alto}px;height:${h.alto}px">${c.pj(h.n, '', h.alto)}</div>`).join('')}
      <div class="encabezado"><div class="fila-k"><span class="kicker">Material extra · visión</span><span class="rotulo">Visión · sin fechas ni valuación</span></div>
        <div class="titulo t"><span class="l"><span>Camino a la <mark>IPO</mark></span></span></div></div>
    `;
  },
  armar(tl, $, c) {
    tl.fromTo($('.encabezado .kicker'), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.05);
    tl.fromTo($('.rotulo'), { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, 0.45);
    entraTitulo(tl, $.all('.encabezado .l > span'), 0.1);
    tl.fromTo($('.piso'), { autoAlpha: 0, scaleX: 0.6 }, { autoAlpha: 1, scaleX: 1, duration: 0.6, ease: 'power3.out' }, 0.2);
    // El camino completo se ve punteado desde el principio; cada escalón se llena en su paso
    tl.fromTo($.all('.fantasma'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out', stagger: 0.07 }, 0.3);
    T_BLOQUE.forEach((t, k) => {
      tl.fromTo($(`.b${k}`), { autoAlpha: 0, scaleY: 0 }, { autoAlpha: 1, scaleY: 1, duration: 0.55, ease: 'back.out(1.4)' }, t);
      tl.fromTo($(`.b${k} .contenido`), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' }, t + 0.35);
      tl.to($(`.f${k}`), { autoAlpha: 0, duration: 0.3 }, t + 0.2);
    });
    // Huellas punteadas: aparecen cuando el grupo salta (el camino recorrido)
    SALTOS.forEach((s, i) => tl.fromTo($(`.hu${i}`), { autoAlpha: 0 }, { autoAlpha: 0.9, duration: 0.4, ease: 'power1.out' }, s.t + 0.25));
    tl.fromTo($('.prec'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' }, LLEGA_ARRIBA + 0.15);
    tl.fromTo($.all('.prec .em'), { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: 0.35, ease: 'power3.out', stagger: 0.15 }, LLEGA_ARRIBA + 0.4);
    // Chispas de festejo arriba de la IPO (posiciones con azar determinista)
    const cx = centro(4);
    const cy = tope(4) - 70;
    $.all('.chispa').forEach((ch, i) => {
      const ang = (i / 14) * Math.PI * 2 + c.azar() * 0.4;
      const d = 100 + c.azar() * 60;
      const t0 = LLEGA_ARRIBA + 0.02 + (i % 4) * 0.04;
      tl.fromTo(ch, { x: cx, y: cy, autoAlpha: 0, scale: 0.4 }, { x: cx + Math.cos(ang) * d, y: cy + Math.sin(ang) * d * 0.55, autoAlpha: 1, scale: 1, duration: 0.5, ease: 'power3.out', immediateRender: false }, t0);
      tl.to(ch, { autoAlpha: 0, scale: 0.3, duration: 0.45, ease: 'power1.in' }, t0 + 0.65);
    });

    // El grupo: cae en el primer escalón y sube de a saltos (posiciones y poses por pintor: valen en los saltos de paso)
    const equipo = $.all('.mov').map((el, i) => ({ el, pj: el.querySelector('.pj') as HTMLElement, h: EQUIPO[i]! }));
    const ultima = new Map<HTMLElement, Pose>();
    const poner = (el: HTMLElement, p: Pose) => {
      if (ultima.get(el) !== p) {
        ultima.set(el, p);
        pose(el, p);
      }
    };
    c.pintor((t) => {
      for (const { el, pj, h } of equipo) {
        let k = 0;
        let x = centro(0) + h.dx;
        let y = tope(0);
        let vuela = false;
        for (const s of SALTOS) {
          const t0 = s.t + h.orden * 0.12;
          if (t < t0) break;
          const u = tramo(t, t0, t0 + D_SALTO);
          const xa = centro(s.a - 1) + h.dx;
          const xb = centro(s.a) + h.dx;
          const ya = tope(s.a - 1);
          const yb = tope(s.a);
          const pico = Math.min(ya, yb) - 80;
          x = xa + (xb - xa) * u;
          y = (1 - u) * (1 - u) * ya + 2 * (1 - u) * u * pico + u * u * yb;
          k = s.a;
          vuela = u < 1;
        }
        // Entrada: caen desde arriba sobre el primer escalón
        const e = tramo(t, ENTRA + h.orden * 0.08, ENTRA + h.orden * 0.08 + 0.45);
        const caida = k === 0 ? -150 * (1 - e) * (1 - e) : 0;
        el.style.opacity = String(Math.min(1, e * 3));
        el.style.transform = `translate(${(x - h.alto / 2).toFixed(1)}px, ${(y - h.alto + 4 + caida).toFixed(1)}px)`;
        const aterrizo = k > 0 ? SALTOS[k - 1]!.t + h.orden * 0.12 + D_SALTO : 99;
        poner(pj, t >= LLEGA_ARRIBA ? 'c' : vuela ? 'c' : e < 1 ? 'a' : k === 0 || t < aterrizo + 0.8 ? 'b' : 'a');
      }
    });
  },
  ambiente(t, $) {
    $.all('.mov .pj').forEach((p, i) => (p.style.transform = `scaleY(${(1 + Math.sin(t * 2.4 + i) * 0.02).toFixed(4)})`));
  },
});
