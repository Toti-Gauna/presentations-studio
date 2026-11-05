// Anexo de respaldo · La competencia en Argentina, por modelo (el detalle de la diapositiva 6). Un golpe por clic:
// 0 los modelos: una columna por plataforma (anónimas, por cómo cobran) y la de Handyx en alto, con Llave arriba ·
// 1 qué paga el profesional en cada modelo: Llave se preocupa; en la columna de Handyx, 0 %, y festeja ·
// 2 cómo le gana Handyx a cada modelo: la respuesta sale de la columna de Handyx hacia cada plataforma; Foco se suma ·
// 3 océano azul: las plataformas quedan en el mar rojo (competir por comisiones) y la columna de Handyx se abre en el
//   océano azul (0 % al profesional, herramientas por oficio, HandIA y clientes que vuelven); suben los Handys de cada oficio.
// Sin nombres ni logos de terceros. Una banda amarilla marca la fila de cada paso. La franja y 880–950 queda libre (leyenda).
import { COLOR, entraTitulo, escena, pose, type Kit, type Personaje, type Pose } from './comun/kit.ts';

const T1 = 3.2;
const T2 = 6.6;
const T3 = 10.0;
const FIN = 13.8;

// Matriz: columna de rótulos, cuatro plataformas y Handyx (en alto, como un podio)
const COL = { x0: 370, w: 264, gap: 16 };
const colX = (i: number) => COL.x0 + i * (COL.w + COL.gap);
const HX = { x: 1506, w: 318, y: 236, h: 500 };
const AZUL_PANEL = { x: 760, w: 1064 };
const FILAS = [
  { y: 262, h: 130 }, // modelo
  { y: 412, h: 140 }, // qué paga el profesional
  { y: 572, h: 140 }, // cómo le gana Handyx
] as const;
const PIE = HX.y; // los Handys se paran sobre la columna (y después sobre el océano azul)

const PLATAFORMAS = [
  { letra: 'A', ic: 'porcentaje', modelo: 'Comisión' },
  { letra: 'B', ic: 'cliente-nuevo', modelo: 'Por contacto' },
  { letra: 'C', ic: 'calendario', modelo: 'Suscripción' },
  { letra: 'D', ic: 'reloj', modelo: 'Comisión cero' },
] as const;
const paga = (c: Kit) => [
  `Hasta <b>${c.cifra('COMP-CLICKIE-PRO')}</b> de cada trabajo`,
  '<b>Cada contacto</b>, se concrete o no',
  '<b>Una cuota</b> todos los meses',
  '<b>Nada</b>, por tiempo limitado',
];
const gana = (c: Kit) => [
  'Cobra <b>todo</b> su presupuesto',
  '<b>No paga</b> por contactos',
  '<b>Sin cuota</b>: si no trabaja, no paga',
  `<b>${c.cifra('FEE-ESPECIALISTA')}</b> es el modelo, no una promo`,
];
const PILARES = [
  { ic: 'herramienta', t: 'Herramientas por oficio', s: 'para trabajar mejor' },
  { ic: 'ia', t: 'HandIA', s: 'asistente con IA' },
  { ic: 'repetir', t: 'Clientes que vuelven', s: 'historial y valoraciones' },
] as const;

// Tripulación del océano azul (centro x; pie sobre el panel)
const LLAVE_X = 1640;
const FOCO_X = 1765;
const CREW: Array<{ pj: Personaje; x: number; alto: number; fin: Pose }> = [
  { pj: 'gota', x: 1222, alto: 100, fin: 'c' },
  { pj: 'medidor_gas', x: 1330, alto: 96, fin: 'b' },
  { pj: 'brocha', x: 1436, alto: 104, fin: 'c' },
  { pj: 'aire', x: 1536, alto: 46, fin: 'b' },
];
const SUBE = (i: number) => T3 + 1.7 + i * 0.22;

function ola(nivel: number, amp: number, largo: number, ancho: number, alto: number): string {
  let d = `M0 ${nivel}`;
  for (let x = 0; x < ancho * 2; x += largo) d += ` Q ${x + largo / 4} ${nivel - amp} ${x + largo / 2} ${nivel} T ${x + largo} ${nivel}`;
  return `${d} L${ancho * 2} ${alto} L0 ${alto} Z`;
}

export default escena({
  marcas: [0, T1, T2, T3, FIN],
  leyendas: ['Cada plataforma, **por su modelo de cobro**', 'Qué **paga el profesional** en cada modelo', 'Cómo **Handyx le gana** a cada modelo', 'Del mar rojo a **nuestro océano azul**'],
  css: `
    .fondo { position: absolute; inset: 0; background: #EEF0F6; }
    .halo { position: absolute; left: 1100px; top: 520px; width: 1500px; height: 1500px; margin: -750px 0 0 -750px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,.9), rgba(255,255,255,0) 62%); }
    .encabezado { position: absolute; left: 96px; top: 52px; z-index: 9; }
    .encabezado .titulo { margin-top: 10px; font-size: 58px; color: ${COLOR.azulOscuro}; }
    .mi { display: block; background: currentColor; -webkit-mask: var(--u) center / contain no-repeat; mask: var(--u) center / contain no-repeat; }
    .banda { position: absolute; left: 78px; width: 1414px; border-radius: 30px; border: 5px solid ${COLOR.amarillo}; box-shadow: 0 0 0 7px rgba(255,201,60,.22), 0 0 30px rgba(255,201,60,.35); z-index: 5; pointer-events: none; }
    .hueco { position: absolute; width: ${COL.w}px; z-index: 2; border-radius: 22px; border: 3px dashed #C6CFDD; }
    .hueco.hx-h { left: ${HX.x + 16}px; width: ${HX.w - 32}px; border-color: rgba(255,255,255,.28); z-index: 3; }
    .rot { position: absolute; left: 96px; width: 250px; z-index: 3; display: flex; flex-direction: column; justify-content: center; gap: 10px; }
    .rot .mi { width: 34px; height: 34px; color: ${COLOR.azul}; }
    .rot b { font-size: 26px; font-weight: 800; line-height: 1.15; color: ${COLOR.noche}; }
    .rot.r0 b { font-size: 21px; letter-spacing: .08em; text-transform: uppercase; color: ${COLOR.suave}; }
    .rot.r2 b { color: ${COLOR.azul}; }
    .celda { position: absolute; width: ${COL.w}px; z-index: 3; border-radius: 22px; padding: 16px 18px; display: flex; flex-direction: column; justify-content: center; gap: 10px; }
    .cab { background: #fff; box-shadow: 0 6px 0 #D5DCE7, 0 14px 26px rgba(14,29,54,.08); }
    .cab .fila { display: flex; align-items: center; gap: 12px; }
    .insignia { flex: none; width: 52px; height: 52px; border-radius: 15px; display: grid; place-items: center; background: #FBE6E4; color: ${COLOR.rojo}; }
    .insignia .mi { width: 30px; height: 30px; }
    .cab b { font-size: 25px; font-weight: 800; color: ${COLOR.noche}; white-space: nowrap; }
    .cab span { font-size: 22px; font-weight: 700; color: ${COLOR.suave}; }
    .paga { background: #fff; box-shadow: 0 4px 0 #DCE2EC, 0 12px 22px rgba(14,29,54,.06); }
    .paga .mi, .gana .mi { flex: none; width: 34px; height: 34px; }
    .paga .mi { color: ${COLOR.rojo}; }
    .paga.temporal .mi { color: ${COLOR.naranja}; }
    .paga p, .gana p { font-size: 23px; font-weight: 600; line-height: 1.25; color: ${COLOR.noche}; }
    .paga b { font-weight: 800; color: ${COLOR.rojo}; }
    .paga.temporal b { color: #A86A00; }
    .gana { background: ${COLOR.celeste}; box-shadow: 0 4px 0 #C9D7EE; }
    .gana .mi { color: ${COLOR.azul}; }
    .gana p { color: ${COLOR.azulOscuro}; }
    .gana b { font-weight: 800; color: ${COLOR.azul}; }
    /* Columna de Handyx: el fondo se abre en el océano azul del cierre */
    .hx-fondo { position: absolute; left: ${HX.x}px; top: ${HX.y}px; width: ${HX.w}px; height: ${HX.h}px; z-index: 2; border-radius: 30px; background: ${COLOR.azul}; box-shadow: 0 8px 0 ${COLOR.azulOscuro}, 0 26px 50px rgba(14,29,54,.24); overflow: hidden; }
    .hx-olas { position: absolute; left: 0; top: 0; width: ${AZUL_PANEL.w}px; height: ${HX.h}px; opacity: 0; }
    .hx-olas svg { position: absolute; left: 0; top: 0; width: ${AZUL_PANEL.w * 2}px; height: ${HX.h}px; }
    .hx { position: absolute; left: ${HX.x + 22}px; width: ${HX.w - 44}px; z-index: 4; color: #fff; }
    .hx-cab { top: ${FILAS[0].y}px; height: ${FILAS[0].h}px; display: flex; flex-direction: column; justify-content: center; gap: 12px; }
    .pastilla { display: inline-flex; align-self: flex-start; align-items: center; padding: 10px 18px; border-radius: 16px; background: #fff; box-shadow: 0 5px 0 ${COLOR.azulOscuro}; }
    .pastilla img { height: 36px; display: block; }
    .hx-cab span { font-size: 22px; font-weight: 700; color: #DCE7F8; }
    .hx-paga { top: ${FILAS[1].y}px; height: ${FILAS[1].h}px; display: flex; flex-direction: column; justify-content: center; gap: 6px; }
    .hx-paga .linea { display: flex; align-items: center; gap: 16px; }
    .hx-paga .cero { font-size: 76px; line-height: .9; color: ${COLOR.amarillo}; white-space: nowrap; }
    .hx-paga p { font-size: 23px; font-weight: 700; line-height: 1.2; }
    .ok { flex: none; width: 46px; height: 46px; border-radius: 50%; background: ${COLOR.verde}; display: grid; place-items: center; box-shadow: 0 0 0 5px rgba(255,255,255,.22); }
    .ok .mi { width: 28px; height: 28px; color: #fff; }
    .hx-gana { top: ${FILAS[2].y}px; height: ${FILAS[2].h}px; display: flex; flex-direction: column; justify-content: center; gap: 10px; }
    .hx-gana .mi { flex: none; width: 34px; height: 34px; color: ${COLOR.amarillo}; }
    .hx-gana p { font-size: 23px; font-weight: 600; line-height: 1.25; }
    .hx-gana b { color: ${COLOR.amarillo}; font-weight: 800; }
    .fuente { position: absolute; left: ${COL.x0}px; top: 764px; z-index: 3; font-size: 20px; font-weight: 600; color: ${COLOR.suave}; }
    /* Cierre: mar rojo y océano azul */
    .rojo { position: absolute; left: 96px; top: ${FILAS[0].y}px; width: 608px; height: ${HX.y + HX.h - FILAS[0].y}px; z-index: 2; border-radius: 30px; background: #F8E9E7; box-shadow: 0 16px 34px rgba(80,14,20,.10), 0 4px 0 #EBCFCB; overflow: hidden; }
    .rojo svg { position: absolute; left: 0; bottom: 0; width: 1216px; height: 120px; }
    .r-k { position: absolute; left: 132px; top: 292px; z-index: 4; display: flex; align-items: center; gap: 10px; font-size: 22px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: ${COLOR.rojo}; }
    .r-k .mi { width: 26px; height: 26px; }
    .r-t { position: absolute; left: 132px; top: 328px; z-index: 4; font-size: 34px; color: ${COLOR.noche}; }
    .r-fila { position: absolute; left: 132px; width: 536px; height: 62px; z-index: 4; display: flex; align-items: center; gap: 14px; padding: 0 18px 0 8px; border-radius: 18px; background: #fff; box-shadow: 0 4px 0 #EBCFCB; }
    .r-fila .insignia { width: 46px; height: 46px; border-radius: 13px; }
    .r-fila .insignia .mi { width: 26px; height: 26px; }
    .r-fila b { font-size: 23px; font-weight: 800; color: ${COLOR.noche}; }
    .r-fila span { font-size: 22px; font-weight: 600; color: ${COLOR.suave}; }
    .flecha { position: absolute; left: 708px; top: 466px; width: 48px; height: 40px; z-index: 4; }
    .a-k { position: absolute; left: 804px; top: 268px; z-index: 4; display: flex; align-items: center; gap: 10px; font-size: 22px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: ${COLOR.amarillo}; }
    .a-k .icono { width: 26px; height: 26px; }
    .a-t { position: absolute; left: 804px; top: 304px; z-index: 4; font-size: 42px; color: #fff; }
    .pilar { position: absolute; top: 386px; width: 232px; height: 214px; z-index: 4; padding: 20px 20px; border-radius: 24px; background: #fff; box-shadow: 0 6px 0 ${COLOR.azulOscuro}, 0 18px 30px rgba(14,29,54,.22); display: flex; flex-direction: column; gap: 8px; }
    .pilar .cuad { width: 58px; height: 58px; border-radius: 16px; background: ${COLOR.celeste}; display: grid; place-items: center; }
    .pilar .cuad .icono { width: 34px; height: 34px; }
    .pilar b { margin-top: 6px; font-size: 26px; font-weight: 800; line-height: 1.12; color: ${COLOR.noche}; }
    .pilar span { font-size: 20px; font-weight: 600; line-height: 1.2; color: ${COLOR.suave}; }
    .pilar.cero b.t { margin-top: 0; font-size: 72px; line-height: .95; font-weight: 900; color: ${COLOR.azul}; }
    .pilar.cero .sub { font-size: 24px; font-weight: 800; color: ${COLOR.noche}; }
    .plan { position: absolute; left: 804px; top: 622px; z-index: 4; display: inline-flex; align-items: center; gap: 10px; padding: 6px 16px; border-radius: 999px; border: 2px solid rgba(255,255,255,.55); color: #fff; font-size: 20px; font-weight: 700; white-space: nowrap; }
    /* Handys: el contenedor .mov lo mueve la línea de tiempo; el .pj de adentro respira (ambiente) */
    .mov { position: absolute; z-index: 7; transform-origin: 50% 100%; }
    .pj { transform-origin: 50% 100%; }
  `,
  html: (c) => {
    const mi = (ic: string) => `<i class="mi" style="--u:url('${c.url(`iconos/${ic}.svg`)}')"></i>`;
    const handy = (cls: string, nombre: Personaje, cx: number, alto: number) =>
      `<div class="mov ${cls}" style="left:${cx - alto / 2}px;top:${PIE - alto}px;width:${alto}px;height:${alto}px">${c.pj(nombre, '', alto)}</div>`;
    const p = paga(c);
    const g = gana(c);
    const olasAzul = [
      { n: 424, a: 10, l: 260, f: 'rgba(255,255,255,.08)' },
      { n: 448, a: 12, l: 340, f: 'rgba(255,255,255,.10)' },
      { n: 472, a: 9, l: 420, f: 'rgba(19,48,94,.30)' },
    ];
    const olasRojo = [
      { n: 50, a: 9, l: 220, f: 'rgba(217,48,37,.10)' },
      { n: 74, a: 10, l: 300, f: 'rgba(217,48,37,.14)' },
      { n: 96, a: 8, l: 380, f: 'rgba(160,30,40,.16)' },
    ];
    return `
    <div class="fondo"></div><div class="halo"></div>
    <div class="banda"></div>
    ${['Modelo de cobro', 'Qué paga el profesional', 'Cómo le gana Handyx'].map((t, i) => `<div class="rot r${i}" style="top:${FILAS[i]!.y}px;height:${FILAS[i]!.h}px">${i ? mi(i === 1 ? 'monedas' : 'escudo-ok') : ''}<b>${t}</b></div>`).join('')}
    ${PLATAFORMAS.map((pl, i) => `
      <div class="celda cab k${i}" style="left:${colX(i)}px;top:${FILAS[0].y}px;height:${FILAS[0].h}px"><div class="fila"><span class="insignia">${mi(pl.ic)}</span><b>Plataforma ${pl.letra}</b></div><span>${pl.modelo}</span></div>
      <div class="celda paga ${i === 3 ? 'temporal' : ''}" style="left:${colX(i)}px;top:${FILAS[1].y}px;height:${FILAS[1].h}px">${mi(i === 3 ? 'reloj' : 'monedas')}<p>${p[i] ?? ''}</p></div>
      <div class="celda gana" style="left:${colX(i)}px;top:${FILAS[2].y}px;height:${FILAS[2].h}px">${mi('tilde-circulo')}<p>${g[i] ?? ''}</p></div>`).join('')}
    ${[1, 2].map((f) => [0, 1, 2, 3].map((i) => `<i class="hueco f${f}" style="left:${colX(i)}px;top:${FILAS[f]!.y}px;height:${FILAS[f]!.h}px"></i>`).join('') + `<i class="hueco hx-h f${f}" style="top:${FILAS[f]!.y + 4}px;height:${FILAS[f]!.h - 8}px"></i>`).join('')}
    <div class="hx-fondo"><div class="hx-olas"><svg viewBox="0 0 ${AZUL_PANEL.w * 2} ${HX.h}" preserveAspectRatio="none">${olasAzul.map((o, i) => `<path class="oa${i}" d="${ola(o.n, o.a, o.l, AZUL_PANEL.w, HX.h)}" fill="${o.f}"/>`).join('')}</svg></div></div>
    <div class="hx hx-cab"><span class="pastilla">${c.logo()}</span><span>Tarifa visible al usuario</span></div>
    <div class="hx hx-paga"><div class="linea"><span class="cero t">${c.cifra('FEE-ESPECIALISTA')}</span><span class="ok">${mi('tilde-circulo')}</span></div><p>por su trabajo</p></div>
    <div class="hx hx-gana">${mi('recibo')}<p>El usuario paga <b>${c.cifra('TARIFA-USUARIO')}</b>, visible antes de contratar</p></div>
    <div class="fuente">Modelos de cobro según fuentes públicas e información del equipo · noviembre de 2026</div>

    <div class="rojo"><svg viewBox="0 0 1216 120" preserveAspectRatio="none">${olasRojo.map((o, i) => `<path class="or${i}" d="${ola(o.n, o.a, o.l, 608, 120)}" fill="${o.f}"/>`).join('')}</svg></div>
    <div class="r-k">${mi('porcentaje')}Mar rojo</div>
    <div class="r-t t">Competir por comisiones</div>
    ${PLATAFORMAS.map((pl, i) => `<div class="r-fila" style="top:${388 + i * 72}px"><span class="insignia">${mi(pl.ic)}</span><b>Plataforma ${pl.letra}</b><span>· ${pl.modelo.toLowerCase()}</span></div>`).join('')}
    <svg class="flecha" viewBox="0 0 48 40"><path d="M4 20 H38 M24 6 L41 20 L24 34" fill="none" stroke="${COLOR.amarillo}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <div class="a-k">${c.icono('sparkles', 'oro')}Nuestro océano azul</div>
    <div class="a-t t">Crear valor para el profesional</div>
    <div class="pilar cero" style="left:804px"><b class="t">${c.cifra('FEE-ESPECIALISTA')}</b><span class="sub">al profesional</span><span>es el modelo, no una promoción</span></div>
    ${PILARES.map((pl, i) => `<div class="pilar" style="left:${804 + (i + 1) * 248}px"><span class="cuad">${c.icono(pl.ic)}</span><b>${pl.t}</b><span>${pl.s}</span></div>`).join('')}
    <div class="plan">HandIA y herramientas: plan propuesto · a validar</div>

    ${CREW.map((h, i) => handy(`crew c${i}`, h.pj, h.x, h.alto)).join('')}
    ${handy('h-llave', 'llave', LLAVE_X, 130)}
    ${handy('h-foco', 'bombilla', FOCO_X, 112)}
    <div class="encabezado"><div class="kicker">Respaldo · competencia</div><div class="titulo t"><span class="l"><span>La competencia en Argentina,</span></span><span class="l"><span><mark>por modelo</mark></span></span></div></div>
  `;
  },
  armar(tl, $, c) {
    const cabs = $.all('.cab');
    const pagas = $.all('.paga');
    const ganas = $.all('.gana');
    const rots = $.all('.rot');
    const banda = $('.banda');
    const enBanda = (i: number) => ({ y: FILAS[i]!.y - 8, height: FILAS[i]!.h + 16 });
    const salta = (el: HTMLElement, t: number) =>
      tl.fromTo(el, { autoAlpha: 0, y: 46, scale: 0.6 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(2.2)' }, t);

    // 0 · los modelos: columnas de las plataformas y la de Handyx en alto
    tl.fromTo($('.halo'), { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 1.2, ease: 'power2.out' }, 0);
    tl.fromTo($('.encabezado .kicker'), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0);
    entraTitulo(tl, $.all('.encabezado .l > span'), 0.1);
    tl.fromTo(banda, { autoAlpha: 0, ...enBanda(0) }, { autoAlpha: 1, ...enBanda(0), duration: 0.4 }, 0.45);
    tl.fromTo(rots[0]!, { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: 'power3.out' }, 0.5);
    tl.fromTo(cabs, { autoAlpha: 0, y: 40, scale: 0.9 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.9)', stagger: 0.14 }, 0.6);
    tl.fromTo($.all('.hueco:not(.hx-h)'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, stagger: 0.02 }, 1.0);
    tl.fromTo($.all('.hueco.hx-h'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35 }, 1.8);
    tl.fromTo($('.hx-fondo'), { autoAlpha: 0, y: 70 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'back.out(1.4)' }, 1.3);
    tl.fromTo($('.hx-cab'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' }, 1.6);
    salta($('.h-llave'), 1.85);
    tl.fromTo($('.fuente'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 2.2);
    tl.set([...pagas, ...ganas, ...rots.slice(1), $('.hx-paga'), $('.hx-gana'), $('.h-foco')], { autoAlpha: 0 }, 0);

    // 1 · qué paga el profesional (Llave se preocupa; en Handyx, 0 %)
    tl.to(banda, { ...enBanda(1), duration: 0.5, ease: 'power3.inOut' }, T1 + 0.05);
    tl.fromTo(rots[1]!, { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: 'power3.out', immediateRender: false }, T1 + 0.2);
    pagas.forEach((el, i) => tl.fromTo(el, { autoAlpha: 0, y: 30, scale: 0.92 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.42, ease: 'back.out(1.8)', immediateRender: false }, T1 + 0.4 + i * 0.26));
    tl.fromTo($('.hx-paga'), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(2.2)', immediateRender: false }, T1 + 1.65);
    tl.to($('.hueco.hx-h.f1'), { autoAlpha: 0, duration: 0.3 }, T1 + 1.6);
    tl.fromTo($('.hx-paga .ok'), { scale: 0, rotation: -30 }, { scale: 1, rotation: 0, duration: 0.4, ease: 'back.out(3)' }, T1 + 1.95);

    // 2 · cómo le gana Handyx: la respuesta sale de su columna hacia cada plataforma (de derecha a izquierda)
    tl.to(banda, { ...enBanda(2), duration: 0.5, ease: 'power3.inOut' }, T2 + 0.05);
    tl.fromTo(rots[2]!, { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: 'power3.out', immediateRender: false }, T2 + 0.2);
    tl.fromTo($('.hx-gana'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out', immediateRender: false }, T2 + 0.3);
    [...ganas].reverse().forEach((el, i) => tl.fromTo(el, { autoAlpha: 0, x: 70 }, { autoAlpha: 1, x: 0, duration: 0.45, ease: 'power3.out', immediateRender: false }, T2 + 0.6 + i * 0.24));
    tl.to($('.hueco.hx-h.f2'), { autoAlpha: 0, duration: 0.3 }, T2 + 0.25);
    salta($('.h-foco'), T2 + 1.75);

    // 3 · océano azul: la matriz se va al mar rojo y la columna de Handyx se abre
    tl.to([banda, ...$.all('.hueco')], { autoAlpha: 0, duration: 0.3 }, T3);
    tl.to([...rots, ...cabs, ...pagas, ...ganas, $('.hx-cab'), $('.hx-paga'), $('.hx-gana')], { autoAlpha: 0, y: 18, duration: 0.32, ease: 'power2.in', stagger: 0.008 }, T3);
    tl.fromTo($('.rojo'), { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: 0.55, ease: 'power3.out' }, T3 + 0.35);
    tl.fromTo([$('.r-k'), $('.r-t')], { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out', stagger: 0.1 }, T3 + 0.55);
    tl.fromTo($.all('.r-fila'), { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.38, ease: 'power3.out', stagger: 0.1 }, T3 + 0.75);
    tl.to($('.hx-fondo'), { left: AZUL_PANEL.x, width: AZUL_PANEL.w, duration: 0.8, ease: 'power3.inOut' }, T3 + 0.4);
    tl.fromTo($('.hx-olas'), { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out' }, T3 + 0.9);
    tl.fromTo($('.flecha'), { autoAlpha: 0, x: -16 }, { autoAlpha: 1, x: 0, duration: 0.35, ease: 'back.out(2)' }, T3 + 1.15);
    tl.fromTo([$('.a-k'), $('.a-t')], { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out', stagger: 0.1 }, T3 + 1.0);
    tl.fromTo($.all('.pilar'), { autoAlpha: 0, y: 40, scale: 0.9 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.8)', stagger: 0.16 }, T3 + 1.3);
    tl.fromTo($('.plan'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, T3 + 2.3);
    tl.set([$('.rojo'), $('.r-k'), $('.r-t'), ...$.all('.r-fila'), $('.flecha'), $('.a-k'), $('.a-t'), ...$.all('.pilar'), $('.plan'), ...$.all('.crew')], { autoAlpha: 0 }, 0);
    $.all('.crew').forEach((h, i) => {
      tl.fromTo(h, { autoAlpha: 1, y: 140 }, { autoAlpha: 1, y: -60, duration: 0.3, ease: 'power2.out', immediateRender: false }, SUBE(i));
      tl.to(h, { y: 0, duration: 0.24, ease: 'power2.in' }, SUBE(i) + 0.3);
    });

    // Poses (valen también en los saltos)
    const llave = $('.h-llave .pj');
    const foco = $('.h-foco .pj');
    const crew = $.all('.crew .pj');
    c.pintor((t) => {
      pose(llave, t >= T3 + 2.6 ? 'c' : t >= T3 ? 'b' : t >= T2 + 1.9 ? 'c' : t >= T2 ? 'b' : t >= T1 + 1.9 ? 'c' : t >= T1 + 0.4 ? 'd' : t >= 2.1 ? 'b' : 'a');
      pose(foco, t >= T3 + 2.6 ? 'c' : t >= T2 + 2.3 ? 'c' : 'b');
      crew.forEach((h, i) => {
        const s = SUBE(i);
        pose(h, t < s + 0.54 ? 'd' : t < s + 1.0 ? 'c' : CREW[i]?.fin ?? 'c');
      });
    });
  },
  ambiente(t, $) {
    $.all('.mov .pj').forEach((p, i) => (p.style.transform = `scaleY(${(1 + Math.sin(t * 2.4 + i) * 0.02).toFixed(4)})`));
    $.all('.hx-olas path').forEach((p, i) => (p.style.transform = `translateX(${(-((t * (14 + i * 6)) % (260 + i * 80))).toFixed(1)}px)`));
    $.all('.rojo path').forEach((p, i) => (p.style.transform = `translateX(${(-((t * (10 + i * 5)) % (220 + i * 80))).toFixed(1)}px)`));
  },
});
