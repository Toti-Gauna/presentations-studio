// Anexo de respaldo · Hacia USD 1 millón en trabajos (objetivo, supuestos a validar). Un paso por clic:
// 0 la meta: USD 1 M en trabajos movidos por Handyx (lo que los vecinos pagan directo a los profesionales) ·
// 1 la cuenta: USD 1 M ÷ ticket de la prueba = trabajos en un año → por mes y por día ·
// 2 qué significa: la parte de los arreglos anuales de General Pueyrredon (casas que se encienden) y las tarifas Handyx ·
// 3 el motor: marketing + IA → más personas → más trabajos → más profesionales, y el círculo vuelve a empezar.
// Cifras de texto (≈ …) solo de afirmaciones: el conteo parte del valor de la afirmación y termina en su texto exacto.
// La franja y 880–950 queda libre (leyenda del kit) y la de abajo (y > 960), para subtítulos.
import { COLOR, entraTitulo, escena, pose, tramo, type Kit, type Personaje, type Pose } from './comun/kit.ts';

const MARCAS = [0, 3.0, 6.6, 10.2, 13.8];
const M1 = 3.0;
const M2 = 6.6;
const M3 = 10.2;

/** Conteo de una cifra de texto de una afirmación («≈ 22.300», «≈ USD 150.000», «≈ 8,6 %»): termina en su texto exacto. */
function contarTexto(c: Kit, el: HTMLElement, id: string, t0: number, dur: number): void {
  const txt = c.cifra(id);
  const m = /^(.*?)(\d[\d.]*(?:,\d+)?)(.*)$/.exec(txt);
  if (!m) {
    el.textContent = txt;
    return;
  }
  const [, antes = '', num = '0', despues = ''] = m;
  const decimales = (num.split(',')[1] ?? '').length;
  const hasta = Number(num.replace(/\./g, '').replace(',', '.'));
  c.pintor((t) => {
    const k = tramo(t, t0, t0 + dur);
    if (k >= 1) {
      el.textContent = txt;
      return;
    }
    const v = hasta * (1 - (1 - k) ** 3);
    el.textContent = `${antes}${v.toLocaleString('es-AR', { minimumFractionDigits: decimales, maximumFractionDigits: decimales })}${despues}`;
  });
}

// Paso 0 · Foco paga y la plata va directo a Llave (arco con monedas)
const PAGA: [number, number] = [1300, 600];
const COBRA: [number, number] = [1640, 600];
const CIMA: [number, number] = [1470, 300];
const enArco = (k: number): [number, number] => [
  (1 - k) ** 2 * PAGA[0] + 2 * (1 - k) * k * CIMA[0] + k * k * COBRA[0],
  (1 - k) ** 2 * PAGA[1] + 2 * (1 - k) * k * CIMA[1] + k * k * COBRA[1],
];

// Paso 1 · la cuenta (bloques conectados)
const F1 = { top: 330, h: 196 };
const BA = { x: 96, w: 452 };
const BB = { x: 652, w: 452 };
const BC = { x: 1208, w: 616 };
const F2 = { top: 612, h: 128 };
const P1 = { x: 1208, w: 296 };
const P2 = { x: 1528, w: 296 };

// Paso 2 · campo de casas del partido
const CAMPO = { x: 96, y: 552, cols: 20, filas: 7, paso: 40, lado: 26 };

// Paso 3 · el motor
const NODOS = [
  { ic: 'megafono', tit: 'Marketing + IA', pj: 'engranaje' as Personaje },
  { ic: 'usuarios', tit: 'Más personas', pj: 'bombilla' as Personaje },
  { ic: 'herramienta', tit: 'Más trabajos', pj: 'gota' as Personaje },
  { ic: 'escuela', tit: 'Más profesionales', pj: 'llave' as Personaje },
];
const NODO = { top: 436, h: 204, w: 390, gap: 56 };
const nodoX = (i: number) => 96 + i * (NODO.w + NODO.gap);
const VUELTA = (() => {
  const a = nodoX(3) + NODO.w / 2;
  const b = nodoX(1) + NODO.w / 2;
  const y0 = NODO.top + NODO.h + 4;
  return `M ${a} ${y0} C ${a} ${y0 + 110}, ${b} ${y0 + 110}, ${b} ${y0 + 12}`;
})();

export default escena({
  marcas: MARCAS,
  leyendas: ['El objetivo: **trabajos movidos por Handyx**', 'La cuenta: **cuántos trabajos hacen falta**', 'Qué significa: **el partido y las tarifas**', 'El motor: **marketing e IA que suman gente**'],
  css: `
    .fondo { position: absolute; inset: 0; background: ${COLOR.azul}; }
    .aro { position: absolute; border-radius: 50%; border: 70px solid rgba(255,255,255,.045); }
    .encabezado { position: absolute; left: 96px; top: 50px; }
    .krow { display: flex; align-items: center; gap: 18px; }
    .encabezado .kicker { color: ${COLOR.amarillo}; }
    .rotulo { display: inline-flex; align-items: center; padding: 5px 14px; border-radius: 999px; border: 2px dashed rgba(255,255,255,.6); background: rgba(255,255,255,.08); font-weight: 700; font-size: 20px; color: #fff; white-space: nowrap; }
    .encabezado .titulo { margin-top: 12px; font-size: 60px; color: #fff; }
    .mov { position: absolute; transform-origin: 50% 100%; }
    .pj { transform-origin: 50% 100%; }
    .sombra-pj { background: rgba(8,20,45,.28); }
    .blanca { background: #fff; border-radius: 26px; box-shadow: 0 18px 36px rgba(8,20,45,.22), 0 6px 0 ${COLOR.azulOscuro}; }

    /* 0 · la meta */
    .meta { position: absolute; left: 96px; top: 286px; }
    .meta .n { font-size: 210px; line-height: .92; color: #fff; white-space: nowrap; }
    .meta .l1 { margin-top: 26px; font-size: 44px; font-weight: 800; color: #fff; white-space: nowrap; }
    .meta .l2 { margin-top: 14px; font-size: 25px; font-weight: 700; color: #DCE6F6; white-space: nowrap; }
    .arco { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; overflow: visible; }
    .arco path { fill: none; stroke: rgba(255,255,255,.55); stroke-width: 5; stroke-linecap: round; stroke-dasharray: 2 16; }
    .moneda { position: absolute; left: 0; top: 0; width: 50px; height: 50px; margin: -25px 0 0 -25px; border-radius: 50%; background: ${COLOR.amarillo}; box-shadow: inset 0 -5px 0 #D9A21E, 0 6px 14px rgba(8,20,45,.3); display: grid; place-items: center; font-family: var(--fuente-titulos, 'Archivo Variable', sans-serif); font-weight: 900; font-size: 26px; color: #8A5B00; opacity: 0; }
    .directo { position: absolute; left: ${CIMA[0]}px; top: 386px; width: 0; }
    .directo span { position: absolute; left: 0; top: 0; transform: translateX(-50%); white-space: nowrap; font-size: 25px; font-weight: 800; color: #fff; }
    .base0 { position: absolute; left: ${CIMA[0]}px; top: 760px; width: 0; }
    .base0 .in { position: absolute; left: 0; top: 0; transform: translateX(-50%); display: flex; align-items: center; gap: 14px; padding: 10px 22px 10px 16px; border-radius: 20px; background: #fff; box-shadow: 0 6px 0 ${COLOR.azulOscuro}; white-space: nowrap; font-size: 24px; font-weight: 800; color: ${COLOR.noche}; }
    .base0 img { height: 34px; display: block; }

    /* 1 · la cuenta */
    .bloque { position: absolute; display: flex; flex-direction: column; justify-content: center; padding: 0 30px; }
    .b-cab { display: flex; align-items: center; gap: 10px; font-size: 23px; font-weight: 800; color: ${COLOR.azul}; white-space: nowrap; }
    .b-cab .icono { width: 30px; height: 30px; }
    .b-num { margin-top: 8px; font-size: 72px; color: ${COLOR.noche}; white-space: nowrap; }
    .b-pie { margin-top: 6px; font-size: 23px; font-weight: 700; color: ${COLOR.suave}; white-space: nowrap; }
    .bloque.clave { background: ${COLOR.amarillo}; box-shadow: 0 18px 36px rgba(8,20,45,.22), 0 6px 0 #C9971E; }
    .bloque.clave .b-cab { color: ${COLOR.noche}; }
    .bloque.clave .b-num { font-size: 104px; }
    .op { position: absolute; top: ${F1.top + F1.h / 2 - 34}px; width: 68px; height: 68px; margin-left: -34px; border-radius: 50%; background: ${COLOR.azulOscuro}; color: #fff; display: grid; place-items: center; font-family: var(--fuente-titulos, 'Archivo Variable', sans-serif); font-weight: 900; font-size: 40px; box-shadow: 0 0 0 6px rgba(255,255,255,.14); }
    .rama { position: absolute; top: ${F1.top + F1.h}px; width: 6px; height: ${F2.top - F1.top - F1.h}px; margin-left: -3px; border-radius: 3px; background: rgba(255,255,255,.6); transform-origin: 50% 0; }
    .pildora { position: absolute; top: ${F2.top}px; height: ${F2.h}px; display: flex; flex-direction: column; justify-content: center; align-items: center; }
    .pildora .b-num { margin-top: 0; font-size: 56px; }
    .pildora .b-pie { margin-top: 2px; font-size: 25px; color: ${COLOR.noche}; font-weight: 800; }

    /* 2 · el partido y las tarifas */
    .cuota { position: absolute; left: 96px; top: 296px; }
    .cuota .n { font-size: 132px; line-height: .95; color: ${COLOR.amarillo}; white-space: nowrap; }
    .cuota .l { margin-top: 12px; font-size: 32px; font-weight: 800; color: #fff; white-space: nowrap; }
    .cuota .chip { margin-top: 14px; color: ${COLOR.azulOscuro}; }
    .campo { position: absolute; left: ${CAMPO.x}px; top: ${CAMPO.y}px; width: ${CAMPO.cols * CAMPO.paso}px; height: ${CAMPO.filas * CAMPO.paso}px; }
    .campo svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
    .casa0 { fill: rgba(255,255,255,.2); }
    .casa1 { fill: ${COLOR.amarillo}; }
    .tarifa { position: absolute; left: 1060px; top: 330px; width: 764px; height: 430px; padding: 34px 40px; }
    .tarifa .k { display: flex; align-items: center; gap: 12px; font-size: 24px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: ${COLOR.azul}; }
    .tarifa .k .icono { width: 32px; height: 32px; }
    .cuenta { display: flex; align-items: center; gap: 16px; margin-top: 26px; }
    .ficha { display: inline-flex; flex-direction: column; padding: 12px 20px; border-radius: 18px; background: ${COLOR.celeste}; }
    .ficha b { font-size: 40px; color: ${COLOR.azulOscuro}; white-space: nowrap; }
    .ficha span { font-size: 21px; font-weight: 700; color: ${COLOR.suave}; white-space: nowrap; }
    .por { font-family: var(--fuente-titulos, 'Archivo Variable', sans-serif); font-weight: 900; font-size: 40px; color: ${COLOR.azul}; }
    .resultado { margin-top: 30px; font-size: 80px; line-height: 1; color: ${COLOR.noche}; white-space: nowrap; }
    .tarifa .cap { margin-top: 10px; font-size: 28px; font-weight: 800; color: ${COLOR.noche}; }
    .antes { display: inline-block; margin-top: 14px; padding: 5px 14px; border-radius: 999px; border: 2px dashed rgba(31,87,168,.5); font-size: 20px; font-weight: 700; color: ${COLOR.azulOscuro}; }

    /* 3 · el motor */
    .nodo { position: absolute; top: ${NODO.top}px; width: ${NODO.w}px; height: ${NODO.h}px; padding: 22px 26px; }
    .nodo .cab { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; }
    .nodo .cuadro { flex: none; width: 52px; height: 52px; border-radius: 15px; background: ${COLOR.celeste}; display: grid; place-items: center; }
    .nodo .cuadro .icono { width: 30px; height: 30px; }
    .nodo .tit { font-size: 31px; color: ${COLOR.noche}; white-space: nowrap; }
    .nodo .det { margin-top: 8px; font-size: 24px; font-weight: 700; line-height: 1.25; color: ${COLOR.texto}; }
    .nodo .det b { font-weight: 800; color: ${COLOR.azul}; white-space: nowrap; }
    .nodo.clave { background: ${COLOR.amarillo}; box-shadow: 0 18px 36px rgba(8,20,45,.22), 0 6px 0 #C9971E; }
    .nodo.clave .cuadro { background: #fff; }
    .nodo.clave .det b { color: ${COLOR.noche}; }
    .flecha { position: absolute; top: ${NODO.top + NODO.h / 2 - 5}px; width: ${NODO.gap - 18}px; height: 10px; margin-left: 9px; border-radius: 5px; background: ${COLOR.amarillo}; transform-origin: 0 50%; }
    .flecha::after { content: ''; position: absolute; right: -8px; top: -9px; border: 14px solid transparent; border-left: 18px solid ${COLOR.amarillo}; border-right: 0; }
    .vuelta { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; overflow: visible; }
    .vuelta path { fill: none; stroke: ${COLOR.amarillo}; stroke-width: 7; stroke-linecap: round; stroke-dasharray: 1000 1000; }
    .vuelta .punta { fill: ${COLOR.amarillo}; }
    .vuelta-l { position: absolute; left: ${(nodoX(1) + nodoX(3) + NODO.w) / 2}px; top: ${NODO.top + NODO.h + 96}px; width: 0; }
    .vuelta-l span { position: absolute; left: 0; top: 0; transform: translateX(-50%); padding: 8px 20px; border-radius: 999px; background: ${COLOR.azulOscuro}; color: #fff; font-size: 24px; font-weight: 800; white-space: nowrap; }
  `,
  html: (c) => {
    const handy = (cls: string, nombre: Personaje, x: number, piso: number, alto: number) =>
      `<div class="mov ${cls}" style="left:${x - alto / 2}px;top:${piso - alto}px;width:${alto}px;height:${alto}px">${c.pj(nombre, '', alto)}<i class="sombra-pj"></i></div>`;
    // Casas del partido: algunas se encienden (la parte que dice la afirmación M1-CUOTA, sobre el total de casas)
    const pct = Number((/[\d.]+(?:,\d+)?/.exec(c.cifra('M1-CUOTA'))?.[0] ?? '0').replace(/\./g, '').replace(',', '.'));
    const total = CAMPO.cols * CAMPO.filas;
    const encendidas = Math.round((total * pct) / 100);
    const orden = Array.from({ length: total }, (_, i) => ({ i, r: c.azar() })).sort((a, b) => a.r - b.r);
    const prendida = new Set(orden.slice(0, encendidas).map((o) => o.i));
    const casita = (x: number, y: number, l: number) => `M${x} ${y + l}V${y + l * 0.42}L${x + l / 2} ${y}L${x + l} ${y + l * 0.42}V${y + l}Z`;
    let casas = '';
    let luces = '';
    for (let i = 0; i < total; i++) {
      const x = (i % CAMPO.cols) * CAMPO.paso + (CAMPO.paso - CAMPO.lado) / 2;
      const y = Math.floor(i / CAMPO.cols) * CAMPO.paso + (CAMPO.paso - CAMPO.lado) / 2;
      if (prendida.has(i)) luces += `<path class="casa1" d="${casita(x, y, CAMPO.lado)}"/>`;
      casas += `<path class="casa0" d="${casita(x, y, CAMPO.lado)}"/>`;
    }
    const nodos = [
      `<b>${c.cifra('INV-MARKETING')}</b> de marketing · CAC ≈ <b>${c.cifra('CAC-ESTIMADO')}</b>`,
      `<b>${c.cifra('M1-CLIENTES-CAC')}</b> clientes alcanzables`,
      `<b>${c.cifra('M1-TRABAJOS')}</b> en un año`,
      'Se suman y se forman: mejor servicio',
    ];
    return `
    <div class="fondo"></div>
    <div class="aro" style="left:1320px;top:-300px;width:900px;height:900px"></div>
    <div class="aro" style="left:-320px;top:640px;width:760px;height:760px"></div>

    <div class="meta"><div class="n t">${c.cifra('META-1M')}</div><div class="l1">en trabajos movidos por Handyx</div><div class="l2">Aspiración en un año (supuesto) · no es un retorno prometido</div></div>
    <svg class="arco" viewBox="0 0 1920 1080"><path d="M ${PAGA[0]} ${PAGA[1]} Q ${CIMA[0]} ${CIMA[1]} ${COBRA[0]} ${COBRA[1]}"/></svg>
    ${'<div class="moneda">$</div>'.repeat(4)}
    <div class="directo"><span>Lo pagan los vecinos, directo al profesional</span></div>
    ${handy('h0 h-foco0', 'bombilla', 1238, 740, 176)}${handy('h0 h-llave0', 'llave', 1704, 740, 170)}
    <div class="base0"><div class="in">${c.logo()}<span>los conecta</span></div></div>

    <div class="cuenta1">
      <div class="bloque blanca bA" style="left:${BA.x}px;top:${F1.top}px;width:${BA.w}px;height:${F1.h}px"><div class="b-cab">${c.icono('acuerdo')}<span>En trabajos</span></div><div class="b-num t">${c.cifra('META-1M')}</div><div class="b-pie">aspiración, en un año</div></div>
      <div class="op o1" style="left:${(BA.x + BA.w + BB.x) / 2}px">÷</div>
      <div class="bloque blanca bB" style="left:${BB.x}px;top:${F1.top}px;width:${BB.w}px;height:${F1.h}px"><div class="b-cab">${c.icono('recibo')}<span>Ticket de nuestra prueba</span></div><div class="b-num t">${c.cifra('PRUEBA-TICKET-USD')}</div><div class="b-pie">${c.cifra('PRUEBA-TICKET')} por trabajo</div></div>
      <div class="op o2" style="left:${(BB.x + BB.w + BC.x) / 2}px">=</div>
      <div class="bloque blanca clave bC" style="left:${BC.x}px;top:${F1.top}px;width:${BC.w}px;height:${F1.h}px"><div class="b-cab">${c.icono('herramienta')}<span>Trabajos en un año</span></div><div class="b-num t">&nbsp;</div></div>
      <i class="rama" style="left:${P1.x + P1.w / 2}px"></i><i class="rama" style="left:${P2.x + P2.w / 2}px"></i>
      <div class="pildora blanca pm" style="left:${P1.x}px;width:${P1.w}px"><div class="b-num t">&nbsp;</div><div class="b-pie">por mes</div></div>
      <div class="pildora blanca pd" style="left:${P2.x}px;width:${P2.w}px"><div class="b-num t">&nbsp;</div><div class="b-pie">por día</div></div>
      ${handy('h1 h-foco1', 'bombilla', 420, 790, 168)}${handy('h1 h-llave1', 'llave', 640, 790, 162)}${handy('h1 h-gota1', 'gota', 850, 790, 138)}
    </div>

    <div class="partido">
      <div class="cuota"><div class="n t">&nbsp;</div><div class="l">de los arreglos del partido en un año</div><span class="chip">${c.icono('ubicacion')}General Pueyrredon</span></div>
      <div class="campo"><svg viewBox="0 0 ${CAMPO.cols * CAMPO.paso} ${CAMPO.filas * CAMPO.paso}">${casas}<g class="luces">${luces}</g></svg></div>
      <div class="tarifa blanca"><div class="k">${c.icono('porcentaje')}Tarifas Handyx</div>
        <div class="cuenta"><span class="ficha"><b class="t">${c.cifra('META-1M')}</b><span>en trabajos</span></span><span class="por">×</span><span class="ficha"><b class="t">${c.cifra('TARIFA-USUARIO')}</b><span>tarifa del vecino</span></span></div>
        <div class="resultado t">&nbsp;</div><div class="cap">de tarifas Handyx en un año</div><span class="antes">Antes de costos</span></div>
      ${handy('h2 h-eng2', 'engranaje', 1720, 330, 130)}
    </div>

    <div class="motor">
      ${NODOS.map((n, i) => `<div class="nodo blanca${i === 0 ? ' clave' : ''}" style="left:${nodoX(i)}px"><div class="cab"><span class="cuadro">${c.icono(n.ic)}</span><span class="tit t">${n.tit}</span></div><div class="det">${nodos[i]}</div></div>`).join('')}
      ${[0, 1, 2].map((i) => `<i class="flecha" style="left:${nodoX(i) + NODO.w}px"></i>`).join('')}
      <svg class="vuelta" viewBox="0 0 1920 1080"><path d="${VUELTA}" pathLength="1000"/><path class="punta" d="M ${nodoX(1) + NODO.w / 2 - 15} ${NODO.top + NODO.h + 26} L ${nodoX(1) + NODO.w / 2} ${NODO.top + NODO.h + 4} L ${nodoX(1) + NODO.w / 2 + 15} ${NODO.top + NODO.h + 26} Z"/></svg>
      <div class="vuelta-l"><span>Y el círculo vuelve a empezar</span></div>
      ${NODOS.map((n, i) => handy(`h3 h3-${i}`, n.pj, nodoX(i) + NODO.w - 92, NODO.top, n.pj === 'bombilla' ? 132 : 120)).join('')}
    </div>

    <div class="encabezado"><div class="krow"><span class="kicker">Respaldo · inversión</span><span class="rotulo">Objetivo · supuestos a validar</span></div>
      <div class="titulo t"><span class="l"><span>De ${c.cifra('INV-TOTAL')} a <mark>${c.cifra('META-1M')}</mark> en trabajos</span></span></div></div>
  `;
  },
  armar(tl, $, c) {
    const entra = (els: HTMLElement | HTMLElement[], t: number, stagger = 0) =>
      tl.fromTo(els, { autoAlpha: 0, y: 40, scale: 0.92 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.7)', stagger }, t);
    const salta = (els: HTMLElement | HTMLElement[], t: number, stagger = 0.1) =>
      tl.fromTo(els, { autoAlpha: 0, y: -80 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'bounce.out', stagger }, t);
    const sale = (els: HTMLElement | HTMLElement[], t: number) => tl.to(els, { autoAlpha: 0, y: 20, duration: 0.26, ease: 'power2.in' }, t);

    // 0 · la meta
    tl.fromTo($.all('.aro'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2, ease: 'power2.out' }, 0); // la rotación es del ambiente
    tl.fromTo($('.krow'), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.05);
    entraTitulo(tl, $.all('.encabezado .l > span'), 0.1);
    tl.fromTo($('.meta .n'), { autoAlpha: 0, scale: 0.6, transformOrigin: '0 0' }, { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'back.out(1.6)' }, 0.35);
    tl.fromTo([$('.meta .l1'), $('.meta .l2')], { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out', stagger: 0.15 }, 0.8);
    salta($.all('.h0'), 0.6, 0.15);
    tl.fromTo($('.arco path'), { strokeDashoffset: 0, autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 1.2);
    tl.fromTo($('.directo span'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' }, 1.5);
    tl.fromTo($('.base0 .in'), { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(2.2)' }, 1.3);

    // 1 · la cuenta: el número grande se va al primer bloque; ÷ ticket = trabajos → por mes y por día
    sale([$('.meta .l1'), $('.meta .l2'), $('.arco'), $('.directo'), $('.base0'), ...$.all('.h0')], M1);
    tl.to($('.meta .n'), { x: BA.x + 30 - 96, y: F1.top + 66 - 286, scale: 72 / 210, autoAlpha: 0, duration: 0.5, ease: 'power3.in', transformOrigin: '0 0' }, M1);
    entra($('.bA'), M1 + 0.4);
    entra($('.o1'), M1 + 0.75);
    entra($('.bB'), M1 + 0.9);
    entra($('.o2'), M1 + 1.25);
    entra($('.bC'), M1 + 1.4);
    contarTexto(c, $('.bC .b-num'), 'M1-TRABAJOS', M1 + 1.55, 1.0);
    tl.fromTo($.all('.rama'), { scaleY: 0 }, { scaleY: 1, duration: 0.3, ease: 'power2.out', stagger: 0.12 }, M1 + 2.35);
    entra([$('.pm'), $('.pd')], M1 + 2.55, 0.15);
    contarTexto(c, $('.pm .b-num'), 'M1-MES', M1 + 2.55, 0.7);
    contarTexto(c, $('.pd .b-num'), 'M1-DIA', M1 + 2.7, 0.6);
    salta($.all('.h1'), M1 + 0.7, 0.14);

    // 2 · el partido (las casas que se encienden) y las tarifas
    sale([$('.cuenta1')], M2);
    tl.fromTo($('.cuota'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, M2 + 0.35);
    contarTexto(c, $('.cuota .n'), 'M1-CUOTA', M2 + 0.5, 1.1);
    tl.fromTo($('.campo'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, M2 + 0.45);
    tl.fromTo($.all('.casa1'), { opacity: 0, scale: 0.4, transformOrigin: '50% 100%' }, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(2.6)', stagger: 0.06 }, M2 + 0.75);
    entra($('.tarifa'), M2 + 1.25);
    tl.fromTo($.all('.tarifa .ficha, .tarifa .por'), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2.2)', stagger: 0.12 }, M2 + 1.55);
    tl.fromTo($('.resultado'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power3.out' }, M2 + 1.9);
    contarTexto(c, $('.resultado'), 'M1-TARIFAS', M2 + 1.95, 1.0);
    tl.fromTo([$('.tarifa .cap'), $('.antes')], { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.12 }, M2 + 2.4);
    salta($('.h-eng2'), M2 + 1.5);

    // 3 · el motor: marketing + IA → más personas → más trabajos → más profesionales ↺
    sale([$('.partido')], M3);
    const nodos = $.all('.nodo');
    const flechas = $.all('.flecha');
    nodos.forEach((n, i) => {
      entra(n, M3 + 0.35 + i * 0.42);
      if (flechas[i]) tl.fromTo(flechas[i]!, { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: 'power2.out' }, M3 + 0.62 + i * 0.42);
    });
    salta($.all('.h3'), M3 + 0.55, 0.42);
    tl.fromTo($('.vuelta path'), { strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut' }, M3 + 2.2);
    tl.fromTo($('.vuelta .punta'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, M3 + 2.8);
    tl.fromTo($('.vuelta-l span'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' }, M3 + 2.6);

    // Poses
    const poser = (el: HTMLElement) => {
      let ultima = '';
      return (p: Pose) => {
        if (p !== ultima) {
          ultima = p;
          pose(el, p);
        }
      };
    };
    const pj = (sel: string) => poser($(`${sel} .pj`));
    const [foco0, llave0, foco1, llave1, gota1, eng2] = ['.h-foco0', '.h-llave0', '.h-foco1', '.h-llave1', '.h-gota1', '.h-eng2'].map(pj) as Array<(p: Pose) => void>;
    const motor = $.all('.h3 .pj').map(poser);
    c.pintor((t) => {
      foco0!(t >= 1.9 ? 'c' : t >= 1.2 ? 'd' : 'b');
      llave0!(t >= 1.9 ? 'c' : 'b');
      const listo1 = M1 + 2.6;
      foco1!(t >= listo1 ? 'c' : 'b');
      llave1!(t >= listo1 ? 'c' : 'd');
      gota1!(t >= listo1 ? 'c' : 'd');
      eng2!(t >= M2 + 2.95 ? 'c' : 'd');
      motor.forEach((f, i) => f(t >= M3 + 2.8 ? 'c' : t >= M3 + 0.75 + i * 0.42 ? 'b' : 'a'));
    });
  },
  ambiente(t, $, tl) {
    // Respiración de los Handys (dueño: el ambiente; la línea de tiempo mueve los contenedores)
    $.all('.mov .pj').forEach((p, i) => (p.style.transform = `scaleY(${(1 + Math.sin(t * 2.4 + i) * 0.02).toFixed(4)})`));
    $.all('.aro').forEach((a, i) => (a.style.transform = `rotate(${(t * (i ? -5 : 6)).toFixed(2)}deg)`));
    // Monedas de Foco a Llave por el arco (solo mientras se ve el paso 0)
    const on = tl >= 1.3 && tl < M1;
    $.all('.moneda').forEach((m, i) => {
      const k = (t * 0.45 + i / 4) % 1;
      const [x, y] = enArco(k);
      m.style.opacity = on ? String(Math.min(1, k * 6, (1 - k) * 6)) : '0';
      m.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    });
  },
});
