// Anexo de respaldo · Hacia USD 5 millones a fines de 2027 (aspiración, antes de costos, supuestos a validar). Un paso por clic:
// 0 la aspiración: USD 5 M de ingresos anuales, con dos motores (Handyx for People y Handyx for Business), y la barra vacía
//   con la bandera de la meta ·
// 1 People: trabajos por año en todo el país × ticket de la prueba × tarifa = ingresos; la barra hacia la meta se llena ·
// 2 Business: turnos por año (comercios × turnos por semana) × valor del turno × tarifa = ingresos; se suma a la barra ·
// 3 juntos: el total llega a la meta, antes de costos y sin contar las suscripciones de apps a medida.
// Cifras solo de afirmaciones (las de texto «≈ …» cuentan desde su valor y terminan en su texto exacto).
// La franja y 880–950 queda libre (leyenda del kit) y la de abajo (y > 960), para subtítulos.
import { COLOR, entraTitulo, escena, pose, tramo, type Kit, type Pose } from './comun/kit.ts';

const MARCAS = [0, 3.0, 6.6, 10.0, 13.4];
const M1 = 3.0;
const M2 = 6.6;
const M3 = 10.0;

/** Conteo de una cifra de texto de una afirmación («≈ USD 3,5 M», «260.000»): termina en su texto exacto. */
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

// Filas (People arriba, Business abajo) y la barra hacia la meta
const FILA = [222, 440];
const ALTO = 190;
const RAMA = { x: 96, w: 380 };
const VOL = { x: 500, w: 420 };
const OPS = { x: 930, w: 330 };
const RES = { x: 1284, w: 540 };
const BARRA = { x: 96, y: 752, w: 1728, h: 64 };

export default escena({
  marcas: MARCAS,
  leyendas: ['La aspiración: **ingresos anuales de Handyx**', 'Handyx for People: **trabajos en todo el país**', 'Handyx for Business: **turnos para comercios**', 'Juntos: **hacia la meta, antes de costos**'],
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
    .blanca { background: #fff; border-radius: 26px; box-shadow: 0 18px 36px rgba(8,20,45,.22), 0 6px 0 ${COLOR.azulOscuro}; }

    /* ramas (motores) */
    .rama { position: absolute; left: ${RAMA.x}px; width: ${RAMA.w}px; height: ${ALTO}px; border-radius: 26px; overflow: hidden; }
    .rama .rt { position: absolute; left: 24px; top: 22px; display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 21px; letter-spacing: .06em; text-transform: uppercase; white-space: nowrap; }
    .rama .rt .icono { width: 28px; height: 28px; }
    .rama .rs { position: absolute; left: 24px; top: 66px; width: 200px; font-size: 23px; font-weight: 700; line-height: 1.25; }
    .people { background: ${COLOR.celeste}; box-shadow: 0 6px 0 rgba(8,20,45,.3); }
    .people .rt { color: ${COLOR.azul}; } .people .rs { color: ${COLOR.noche}; }
    .business { background: ${COLOR.azulOscuro}; box-shadow: 0 6px 0 rgba(8,20,45,.4); }
    .business .rt { color: ${COLOR.amarillo}; } .business .rs { color: #fff; }
    .rama .mov { bottom: 14px; }
    .local { position: absolute; left: 260px; bottom: 14px; width: 96px; height: 70px; }
    .local .toldo { position: absolute; left: -4px; right: -4px; top: 0; height: 18px; border-radius: 6px 6px 8px 8px; background: repeating-linear-gradient(90deg, ${COLOR.amarillo} 0 16px, #fff 16px 32px); }
    .local .frente { position: absolute; left: 4px; right: 4px; top: 18px; bottom: 0; background: ${COLOR.hueso}; border-radius: 0 0 4px 4px; }
    .local .vid { position: absolute; left: 9px; top: 10px; width: 38px; height: 26px; border-radius: 5px; background: ${COLOR.celeste}; }
    .local .pu { position: absolute; right: 9px; bottom: 0; width: 24px; height: 36px; border-radius: 6px 6px 0 0; background: ${COLOR.azul}; }

    /* 0 · la aspiración */
    .meta { position: absolute; left: 600px; top: 340px; }
    .meta .n { font-size: 220px; line-height: .92; color: #fff; white-space: nowrap; }
    .meta .l1 { margin-top: 26px; font-size: 40px; font-weight: 800; color: #fff; white-space: nowrap; }
    .meta .l2 { margin-top: 12px; font-size: 25px; font-weight: 700; color: #DCE6F6; white-space: nowrap; }
    .llaves { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; overflow: visible; }
    .llaves path { fill: none; stroke: ${COLOR.amarillo}; stroke-width: 6; stroke-linecap: round; stroke-dasharray: 1000 1000; }
    .llaves .punta { fill: ${COLOR.amarillo}; stroke: none; }

    /* 1-2 · las cuentas */
    .bloque { position: absolute; height: ${ALTO}px; display: flex; flex-direction: column; justify-content: center; padding: 0 28px; }
    .b-cab { display: flex; align-items: center; gap: 10px; font-size: 22px; font-weight: 800; color: ${COLOR.azul}; white-space: nowrap; }
    .b-cab .icono { width: 30px; height: 30px; }
    .b-num { margin-top: 6px; font-size: 64px; color: ${COLOR.noche}; white-space: nowrap; }
    .b-pie { margin-top: 4px; font-size: 22px; font-weight: 700; color: ${COLOR.suave}; white-space: nowrap; }
    .bloque.res { background: ${COLOR.amarillo}; box-shadow: 0 18px 36px rgba(8,20,45,.22), 0 6px 0 #C9971E; }
    .bloque.res .b-cab { color: ${COLOR.noche}; }
    .bloque.res .b-num { font-size: 60px; }
    .ops { position: absolute; width: ${OPS.w}px; height: ${ALTO}px; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 12px; padding-left: 46px; }
    .opx { display: grid; grid-template-columns: 30px auto; align-items: center; column-gap: 12px; row-gap: 2px; }
    .opx i { font-style: normal; font-family: var(--fuente-titulos, 'Archivo Variable', sans-serif); font-weight: 900; font-size: 34px; color: ${COLOR.amarillo}; text-align: center; }
    .opx b { justify-self: start; padding: 6px 16px; border-radius: 16px; background: ${COLOR.azulOscuro}; color: #fff; font-size: 28px; white-space: nowrap; box-shadow: 0 0 0 4px rgba(255,255,255,.12); }
    .opx span { grid-column: 2; font-size: 20px; font-weight: 700; color: #DCE6F6; white-space: nowrap; }
    .igual { position: absolute; width: 0; }
    .igual i { position: absolute; left: -24px; top: -24px; width: 48px; height: 48px; border-radius: 50%; background: #fff; color: ${COLOR.azul}; display: grid; place-items: center; font-style: normal; font-family: var(--fuente-titulos, 'Archivo Variable', sans-serif); font-weight: 900; font-size: 32px; }

    /* barra hacia la meta */
    .riel { position: absolute; left: ${BARRA.x}px; top: ${BARRA.y}px; width: ${BARRA.w}px; height: ${BARRA.h}px; border-radius: 20px; background: rgba(255,255,255,.14); }
    .tramo { position: absolute; top: 6px; height: ${BARRA.h - 12}px; border-radius: 15px; transform-origin: 0 50%; display: flex; align-items: center; padding: 0 20px; gap: 10px; font-size: 22px; font-weight: 800; color: ${COLOR.noche}; white-space: nowrap; overflow: hidden; }
    .tramo b { font-family: var(--fuente-titulos, 'Archivo Variable', sans-serif); font-weight: 900; font-stretch: 112%; font-size: 26px; }
    .tP { background: ${COLOR.amarillo}; } .tB { background: #fff; }
    .bandera { position: absolute; left: ${BARRA.x + BARRA.w - 4}px; top: 666px; width: 0; height: 0; }
    .bandera .palo { position: absolute; left: -3px; top: 0; width: 6px; height: ${BARRA.y - 666 + 8}px; border-radius: 3px; background: #fff; transform-origin: 50% 100%; }
    .bandera .tela { position: absolute; right: 10px; top: 0; display: flex; align-items: center; gap: 10px; padding: 8px 18px 8px 12px; border-radius: 14px 4px 4px 14px; background: ${COLOR.amarillo}; color: ${COLOR.noche}; font-weight: 800; font-size: 22px; white-space: nowrap; transform-origin: 100% 50%; }
    .bandera .tela .icono { width: 28px; height: 28px; }
    .bandera .tela b { font-family: var(--fuente-titulos, 'Archivo Variable', sans-serif); font-weight: 900; font-stretch: 112%; font-size: 26px; }
    .total { position: absolute; right: ${1920 - (BARRA.x + BARRA.w) + 300}px; top: 666px; display: flex; align-items: baseline; gap: 14px; white-space: nowrap; }
    .total .n { font-size: 52px; color: #fff; }
    .total span { font-size: 24px; font-weight: 800; color: #DCE6F6; }
    .nota { position: absolute; left: 96px; top: 830px; font-size: 22px; font-weight: 700; color: #DCE6F6; white-space: nowrap; }
  `,
  html: (c) => {
    const handy = (cls: string, nombre: Parameters<Kit['pj']>[0], left: number, alto: number) =>
      `<div class="mov ${cls}" style="left:${left}px;width:${alto}px;height:${alto}px">${c.pj(nombre, '', alto)}</div>`;
    const total = c.valor('TOTAL-5M-N') ?? 1;
    const wP = (BARRA.w - 12) * ((c.valor('P-INGRESOS-N') ?? 0) / total);
    const wB = (BARRA.w - 12) * ((c.valor('B-INGRESOS-N') ?? 0) / total);
    const fila = (k: number, vol: string, ops: string, res: string) => `
      <div class="bloque blanca vol v${k}" style="left:${VOL.x}px;top:${FILA[k]}px;width:${VOL.w}px">${vol}</div>
      <div class="ops o${k}" style="left:${OPS.x}px;top:${FILA[k]}px">${ops}</div>
      <div class="igual i${k}" style="left:${RES.x - 36}px;top:${(FILA[k] ?? 0) + ALTO / 2}px"><i>=</i></div>
      <div class="bloque blanca res r${k}" style="left:${RES.x}px;top:${FILA[k]}px;width:${RES.w}px">${res}</div>`;
    const opx = (val: string, lbl: string) => `<div class="opx"><i>×</i><b class="t">${val}</b><span>${lbl}</span></div>`;
    const yP = (FILA[0] ?? 0) + ALTO / 2;
    const yB = (FILA[1] ?? 0) + ALTO / 2;
    const xL = RAMA.x + RAMA.w + 14;
    return `
    <div class="fondo"></div>
    <div class="aro" style="left:1300px;top:-320px;width:900px;height:900px"></div>
    <div class="aro" style="left:-340px;top:660px;width:760px;height:760px"></div>

    <div class="rama people" style="top:${FILA[0]}px"><div class="rt">${c.icono('usuarios')}Handyx for People</div><div class="rs">${c.cifra('META-PROFESIONES')} profesiones, en todo el país</div>
      ${handy('pP pF', 'bombilla', 262 - 48, 96)}${handy('pP pL', 'llave', 330 - 43, 86)}</div>
    <div class="rama business" style="top:${FILA[1]}px"><div class="rt">${c.icono('tienda', 'oro')}Handyx for Business</div><div class="rs">Turnos de personal para comercios</div>
      <div class="local"><div class="toldo"></div><div class="frente"><i class="vid"></i><i class="pu"></i></div></div><div class="mov pA" style="left:${308 - 18}px;bottom:84px;width:36px;height:36px">${c.pj('aire', '', 36)}</div></div>

    <div class="meta"><div class="n t">${c.cifra('META-5M')}</div><div class="l1">de ingresos anuales de Handyx</div><div class="l2">A fines de 2027 · aspiración, antes de costos</div></div>
    <svg class="llaves" viewBox="0 0 1920 1080"><path class="ll" d="M ${xL} ${yP} C ${xL + 40} ${yP}, ${xL + 30} ${(yP + yB) / 2}, ${xL + 66} ${(yP + yB) / 2}" pathLength="1000"/><path class="ll" d="M ${xL} ${yB} C ${xL + 40} ${yB}, ${xL + 30} ${(yP + yB) / 2}, ${xL + 66} ${(yP + yB) / 2}" pathLength="1000"/><path class="punta" d="M ${xL + 62} ${(yP + yB) / 2 - 14} L ${xL + 84} ${(yP + yB) / 2} L ${xL + 62} ${(yP + yB) / 2 + 14} Z"/></svg>

    ${fila(
      0,
      `<div class="b-cab">${c.icono('herramienta')}<span>Trabajos por año</span></div><div class="b-num t">&nbsp;</div><div class="b-pie">${c.cifra('P-DIA')} por día</div>`,
      `${opx(c.cifra('PRUEBA-TICKET-USD'), 'ticket de la prueba')}${opx(c.cifra('TARIFA-USUARIO'), 'tarifa')}`,
      `<div class="b-cab">${c.icono('crecimiento')}<span>Ingresos por año · People</span></div><div class="b-num t">&nbsp;</div>`,
    )}
    ${fila(
      1,
      `<div class="b-cab">${c.icono('calendario')}<span>Turnos por año</span></div><div class="b-num t">&nbsp;</div><div class="b-pie">${c.cifra('B-COMERCIOS')} comercios × ${c.cifra('B-TURNOS-SEM')} por semana</div>`,
      `${opx(c.cifra('B-TURNO-USD'), 'por turno')}${opx(c.cifra('TARIFA-USUARIO'), 'tarifa')}`,
      `<div class="b-cab">${c.icono('crecimiento')}<span>Ingresos por año · Business</span></div><div class="b-num t">&nbsp;</div>`,
    )}

    <div class="riel"><div class="tramo tP" style="left:6px;width:${wP}px"><span>People</span><b>${c.cifra('P-INGRESOS')}</b></div><div class="tramo tB" style="left:${6 + wP}px;width:${wB}px"><span>Business</span><b>${c.cifra('B-INGRESOS')}</b></div></div>
    <div class="total"><span>en total, por año</span><b class="n t">&nbsp;</b></div>
    <div class="bandera"><i class="palo"></i><div class="tela">${c.icono('bandera')}<span>Meta</span><b>${c.cifra('META-5M')}</b></div></div>
    <div class="nota">Sin contar suscripciones de apps a medida · antes de costos · supuestos a validar con los primeros datos</div>

    <div class="encabezado"><div class="krow"><span class="kicker">Respaldo · proyección 2027</span><span class="rotulo">Aspiración · antes de costos · supuestos a validar</span></div>
      <div class="titulo t"><span class="l"><span>Hacia <mark>${c.cifra('META-5M')}</mark> a fines de 2027</span></span></div></div>
  `;
  },
  armar(tl, $, c) {
    const entra = (els: HTMLElement | HTMLElement[], t: number, stagger = 0) =>
      tl.fromTo(els, { autoAlpha: 0, y: 40, scale: 0.92 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.7)', stagger }, t);
    const sale = (els: HTMLElement | HTMLElement[], t: number) => tl.to(els, { autoAlpha: 0, y: 20, duration: 0.26, ease: 'power2.in' }, t);

    // 0 · la aspiración y sus dos motores
    tl.fromTo($.all('.aro'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2, ease: 'power2.out' }, 0); // la rotación es del ambiente
    tl.fromTo($('.krow'), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.05);
    entraTitulo(tl, $.all('.encabezado .l > span'), 0.1);
    tl.fromTo($('.people'), { autoAlpha: 0, x: -60 }, { autoAlpha: 1, x: 0, duration: 0.55, ease: 'power3.out' }, 0.35);
    tl.fromTo($('.business'), { autoAlpha: 0, x: -60 }, { autoAlpha: 1, x: 0, duration: 0.55, ease: 'power3.out' }, 0.5);
    tl.fromTo($.all('.pP'), { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'back.out(2)', stagger: 0.1 }, 0.75);
    tl.fromTo($('.business .local'), { autoAlpha: 0, scaleY: 0.2, transformOrigin: '50% 100%' }, { autoAlpha: 1, scaleY: 1, duration: 0.45, ease: 'back.out(1.6)' }, 0.85);
    tl.fromTo($('.pA'), { autoAlpha: 0, y: -40 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'bounce.out' }, 1.1);
    tl.fromTo($.all('.llaves .ll'), { strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out' }, 1.25);
    tl.fromTo($('.llaves .punta'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 1.7);
    tl.fromTo($('.meta .n'), { autoAlpha: 0, scale: 0.6, transformOrigin: '0 0' }, { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'back.out(1.6)' }, 1.45);
    tl.fromTo([$('.meta .l1'), $('.meta .l2')], { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out', stagger: 0.15 }, 1.85);
    // La barra vacía y la bandera de la meta: adonde tiene que llegar la suma
    tl.fromTo($('.riel'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' }, 1.95);
    tl.fromTo($('.bandera .palo'), { scaleY: 0 }, { scaleY: 1, duration: 0.35, ease: 'power2.out' }, 2.15);
    tl.fromTo($('.bandera .tela'), { autoAlpha: 0, scaleX: 0.2 }, { autoAlpha: 1, scaleX: 1, duration: 0.4, ease: 'back.out(1.8)' }, 2.35);

    // 1 · People: trabajos × ticket × tarifa = ingresos; la barra hacia la meta
    sale([$('.meta'), $('.llaves')], M1);
    tl.to($('.business'), { opacity: 0.45, duration: 0.4 }, M1 + 0.1);
    entra($('.v0'), M1 + 0.35);
    c.contador($('.v0 .b-num'), { t0: M1 + 0.45, dur: 1.1, hasta: c.valor('P-TRABAJOS') ?? 0 });
    tl.fromTo($.all('.o0 .opx'), { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2.2)', stagger: 0.18 }, M1 + 0.9);
    tl.fromTo($('.i0 i'), { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(2.4)' }, M1 + 1.3);
    entra($('.r0'), M1 + 1.45);
    contarTexto(c, $('.r0 .b-num'), 'P-INGRESOS', M1 + 1.55, 1.0);
    tl.fromTo($('.tP'), { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'power2.out' }, M1 + 2.1);

    // 2 · Business: turnos × valor del turno × tarifa = ingresos; se suma a la barra
    tl.to($('.business'), { opacity: 1, duration: 0.35 }, M2 + 0.05);
    entra($('.v1'), M2 + 0.35);
    contarTexto(c, $('.v1 .b-num'), 'B-TURNOS', M2 + 0.45, 1.1);
    tl.fromTo($.all('.o1 .opx'), { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2.2)', stagger: 0.18 }, M2 + 0.9);
    tl.fromTo($('.i1 i'), { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(2.4)' }, M2 + 1.3);
    entra($('.r1'), M2 + 1.45);
    contarTexto(c, $('.r1 .b-num'), 'B-INGRESOS', M2 + 1.55, 1.0);
    tl.fromTo($('.tB'), { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'power2.out' }, M2 + 2.1);

    // 3 · juntos: el total llega a la meta
    tl.fromTo($('.total'), { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, duration: 0.45, ease: 'power3.out' }, M3 + 0.3);
    contarTexto(c, $('.total .n'), 'TOTAL-5M', M3 + 0.4, 1.2);
    tl.fromTo($('.riel'), { scale: 1 }, { scale: 1.02, duration: 0.2, ease: 'power2.out', yoyo: true, repeat: 1, immediateRender: false, transformOrigin: '100% 50%' }, M3 + 1.6);
    tl.fromTo($('.bandera .tela'), { rotation: 0 }, { rotation: -6, duration: 0.18, ease: 'power2.out', yoyo: true, repeat: 3, immediateRender: false }, M3 + 1.6);
    tl.fromTo($('.nota'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' }, M3 + 1.9);

    // Poses: saludan al presentarse, trabajan mientras se arma su cuenta y festejan cuando llega la meta
    const poser = (el: HTMLElement) => {
      let ultima = '';
      return (p: Pose) => {
        if (p !== ultima) {
          ultima = p;
          pose(el, p);
        }
      };
    };
    const [foco, llave, aire] = ['.pF', '.pL', '.pA'].map((s) => poser($(`${s} .pj`))) as Array<(p: Pose) => void>;
    const FIESTA = M3 + 1.6;
    c.pintor((t) => {
      const people: Pose = t >= FIESTA ? 'c' : t >= M1 + 2.5 && t < M2 ? 'c' : t >= M1 && t < M1 + 2.5 ? 'd' : t >= M2 ? 'a' : 'b';
      foco!(people);
      llave!(people);
      aire!(t >= FIESTA ? 'c' : t >= M2 + 2.5 ? 'c' : t >= M2 ? 'd' : 'b');
    });
  },
  ambiente(t, $) {
    // Respiración de los Handys (dueño: el ambiente; la línea de tiempo mueve los contenedores)
    $.all('.mov .pj').forEach((p, i) => (p.style.transform = `scaleY(${(1 + Math.sin(t * 2.4 + i) * 0.02).toFixed(4)})`));
    $.all('.aro').forEach((a, i) => (a.style.transform = `rotate(${(t * (i ? -5 : 6)).toFixed(2)}deg)`));
  },
});
