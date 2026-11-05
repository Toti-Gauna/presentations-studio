// Anexo de respaldo · Más profesiones, herramientas y negocios (visión, diseños propuestos). Un golpe por clic:
// 0 Cada profesión nueva llega con sus herramientas: limpieza, mecánica y jardinería (ejemplos), hacia el objetivo de profesiones ·
// 1 Cada profesional ordena sus números, con feedback de IA (diseño propuesto, datos de ejemplo) ·
// 2 Handyx for Business: un local elige personal por valoraciones y turnos cumplidos; el mismo celular cambia de pantalla ·
// 3 Ferreterías conectadas: Llave retira el stock en una ferretería cercana camino al trabajo (a explorar, sin alianzas).
// Engranaje (la plataforma) acompaña desde la derecha. La franja y 880–950 queda libre para la leyenda del kit.
import { COLOR, entraTitulo, escena, pose, tramo, type Pose } from './comun/kit.ts';

const M = [0, 3.4, 6.8, 10.2, 13.6];
const SUELO = 800;

// Paso 0 · profesiones de ejemplo y su herramienta
const HOJA = '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>';
const PROF = [
  { ic: 'sparkles', nombre: 'Limpieza', herr: 'Checklist por ambiente', hic: 'lista' },
  { ic: 'auto', nombre: 'Mecánica', herr: 'Diagnóstico y repuestos', hic: 'llave-inglesa' },
  { ic: 'hoja', nombre: 'Jardinería', herr: 'Calendario de poda', hic: 'calendario' },
];
const CARTA = { w: 400, h: 318, gap: 32, y: 262 };
const cartaX = (i: number) => 960 - (3 * CARTA.w + 2 * CARTA.gap) / 2 + i * (CARTA.w + CARTA.gap);
const T_HERR = (i: number) => 1.45 + i * 0.3; // la herramienta encastra en su profesión

// Pasos 1-2 · el mismo celular cambia de pantalla
const TEL = { x: 749, y: 236 };
// Llave: en el paso 0 a la izquierda; desde el 1, junto al celular. En el 3 camina de la ferretería a la casa.
const LLAVE = { x: 470, y: SUELO - 190, d: 190, ini: 110 - 470 };
const CAMINO = { t0: 11.05, t1: 12.45, hasta: 1172 - 565 }; // termina al lado de la casa (sin taparla)
// Paso 3 · ferretería, casa y ruta
const FERR = { x: 150, w: 330, h: 320 };
const CASA = { x: 1272, w: 236, h: 220 };
const PIN_F = { x: FERR.x + FERR.w / 2, y: SUELO - FERR.h - 64 };
const PIN_C = { x: CASA.x + CASA.w / 2, y: SUELO - CASA.h - 64 };
const RUTA = `M${PIN_F.x} ${PIN_F.y + 8} Q ${(PIN_F.x + PIN_C.x) / 2} ${Math.min(PIN_F.y, PIN_C.y) - 110} ${PIN_C.x} ${PIN_C.y + 8}`;

export default escena({
  marcas: M,
  leyendas: [
    'Cada profesión nueva llega **con sus herramientas**',
    'Cada profesional ordena **sus números, con IA**',
    'Handyx for Business: **el local elige por mérito**',
    'Ferreterías conectadas: **stock para profesionales**',
  ],
  css: `
    .fondo { position: absolute; inset: 0; background: ${COLOR.azul}; }
    .halo { position: absolute; left: 960px; top: 520px; width: 1600px; height: 1100px; margin: -550px 0 0 -800px; border-radius: 50%; background: radial-gradient(closest-side, rgba(255,255,255,.10), rgba(255,255,255,0)); }
    .encabezado { position: absolute; left: 96px; top: 52px; }
    .krow { display: flex; align-items: center; gap: 16px; }
    .encabezado .kicker { color: ${COLOR.amarillo}; }
    .rot { padding: 4px 14px; border-radius: 999px; border: 3px solid rgba(255,255,255,.85); color: #fff; font-weight: 800; font-size: 20px; letter-spacing: .06em; text-transform: uppercase; white-space: nowrap; }
    .encabezado .titulo { margin-top: 10px; font-size: 64px; color: #fff; }
    .esc { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
    .suelo { position: absolute; left: 96px; top: ${SUELO}px; width: 1728px; height: 6px; border-radius: 3px; background: rgba(255,255,255,.16); }
    .mov { position: absolute; transform-origin: 50% 100%; }
    .pj { transform-origin: 50% 100%; }
    .sombra-pj { background: rgba(8,20,45,.28); }
    .llave { left: ${LLAVE.x}px; top: ${LLAVE.y}px; width: ${LLAVE.d}px; height: ${LLAVE.d}px; }
    .llave .camino { position: absolute; inset: 0; }
    .eng { left: 1648px; top: ${SUELO - 176}px; width: 176px; height: 176px; }
    .caja { position: absolute; left: 132px; top: 96px; width: 62px; height: 50px; border-radius: 8px; background: ${COLOR.amarillo}; box-shadow: inset 0 -6px 0 #D9A21E, 0 8px 14px rgba(8,20,45,.3); opacity: 0; }
    .caja::before { content: ''; position: absolute; left: 18px; top: -12px; width: 26px; height: 14px; border: 4px solid ${COLOR.azulOscuro}; border-bottom: 0; border-radius: 10px 10px 0 0; }
    .tarj { background: #fff; border-radius: 28px; box-shadow: 0 22px 44px rgba(8,20,45,.30), 0 5px 0 rgba(8,20,45,.18); }
    .chip { color: ${COLOR.noche}; }

    /* 0 · profesiones y herramientas */
    .prof { position: absolute; top: ${CARTA.y}px; width: ${CARTA.w}px; height: ${CARTA.h}px; padding: 26px; }
    .prof .cabp { display: flex; align-items: center; gap: 18px; }
    .icp { flex: none; width: 84px; height: 84px; border-radius: 24px; background: ${COLOR.azul}; display: grid; place-items: center; box-shadow: 0 6px 0 ${COLOR.azulOscuro}; }
    .icp .icono, .icp svg { width: 44px; height: 44px; }
    .icp svg { fill: none; stroke: #fff; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .prof .cabp b { display: block; font-family: var(--fuente-titulos, sans-serif); font-weight: 900; font-stretch: 112%; font-size: 38px; line-height: 1; color: ${COLOR.azulOscuro}; }
    .herr { position: absolute; left: 26px; right: 26px; bottom: 26px; height: 132px; padding: 20px 22px; border-radius: 22px; background: #EDF1F7; display: flex; align-items: center; gap: 18px; }
    .herr .ich { flex: none; width: 64px; height: 64px; border-radius: 18px; background: #fff; display: grid; place-items: center; box-shadow: 0 6px 14px rgba(14,29,54,.12); }
    .herr .ich .icono { width: 36px; height: 36px; }
    .herr em { display: block; font-style: normal; font-size: 20px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: ${COLOR.azul}; }
    .herr b { display: block; margin-top: 4px; font-size: 27px; line-height: 1.15; font-weight: 800; color: ${COLOR.noche}; }
    .fila0 { position: absolute; left: 960px; top: ${CARTA.y + CARTA.h + 34}px; width: 0; display: flex; justify-content: center; }
    .fila0 .in { display: flex; align-items: center; gap: 16px; white-space: nowrap; }
    .chip.obj { background: ${COLOR.amarillo}; font-size: 25px; padding: 12px 24px 12px 16px; box-shadow: 0 8px 0 #C9971E, 0 16px 30px rgba(8,20,45,.3); }
    .chip.obj b { font-family: var(--fuente-titulos, sans-serif); font-weight: 900; font-size: 30px; }
    .chip.obj .icono { width: 30px; height: 30px; }
    .rot.ej { font-size: 20px; }

    /* 1-2 · el celular y sus textos */
    .tel { width: 262px; height: 566px; border-radius: 44px; padding: 11px; box-shadow: 0 34px 70px rgba(8,20,45,.45), 0 0 0 2px rgba(255,255,255,.08); }
    .tel .pantalla { border-radius: 34px; }
    .tel .isla { width: 80px; height: 23px; margin-left: -40px; top: 10px; }
    .fonoN { left: ${TEL.x}px; top: ${TEL.y}px; width: 262px; height: 566px; }
    .fonoN img.captura.b { z-index: 2; }
    .lado { position: absolute; left: ${TEL.x + 262 + 56}px; top: 300px; width: 560px; display: flex; flex-direction: column; align-items: flex-start; gap: 20px; }
    .lado .k { font-weight: 800; font-size: 24px; letter-spacing: .08em; text-transform: uppercase; color: ${COLOR.amarillo}; }
    .lado .chip { font-size: 26px; line-height: 1.2; padding: 14px 24px 14px 16px; border-radius: 22px; box-shadow: 0 14px 30px rgba(8,20,45,.3); white-space: normal; max-width: 560px; }
    .lado .chip .icono { width: 34px; height: 34px; flex: none; }
    .lado .chip b { color: ${COLOR.azul}; }
    .local { position: absolute; left: 110px; top: ${SUELO - 360}px; width: 330px; height: 360px; transform-origin: 50% 100%; }
    .tienda .cartelT { position: absolute; left: 18px; right: 18px; top: 0; height: 56px; border-radius: 14px; background: ${COLOR.azulOscuro}; display: grid; place-items: center; }
    .tienda .cartelT .icono { width: 34px; height: 34px; }
    .tienda .toldo { position: absolute; left: -10px; right: -10px; top: 64px; height: 38px; border-radius: 10px 10px 3px 3px; background: repeating-linear-gradient(90deg, ${COLOR.amarillo} 0 32px, #fff 32px 64px); box-shadow: 0 6px 14px rgba(8,20,45,.25); }
    .tienda .frente { position: absolute; left: 8px; right: 8px; top: 102px; bottom: 0; background: ${COLOR.hueso}; }
    .tienda .vidriera { position: absolute; left: 30px; top: 132px; width: 158px; height: 128px; border-radius: 10px; background: ${COLOR.celeste}; box-shadow: inset 0 0 0 6px #fff, 0 0 0 2px #D6DCE6; }
    .tienda .puerta { position: absolute; right: 30px; bottom: 0; width: 76px; height: 168px; border-radius: 12px 12px 0 0; background: ${COLOR.azulOscuro}; }
    .tienda .puerta::after { content: ''; position: absolute; left: 12px; top: 74px; width: 10px; height: 10px; border-radius: 50%; background: ${COLOR.amarillo}; }
    .mesa { position: absolute; left: 24px; top: 78px; width: 110px; height: 10px; border-radius: 5px; background: ${COLOR.azulOscuro}; }
    .mesa::before, .mesa::after { content: ''; position: absolute; top: 10px; width: 8px; height: 30px; background: ${COLOR.azulOscuro}; }
    .mesa::before { left: 12px; } .mesa::after { right: 12px; }
    .estante { position: absolute; left: 10px; width: 138px; height: 6px; border-radius: 3px; background: #9DB1D3; }
    .stock { position: absolute; display: grid; place-items: center; width: 40px; height: 40px; border-radius: 10px; background: #fff; box-shadow: 0 3px 6px rgba(14,29,54,.15); }
    .stock .icono { width: 26px; height: 26px; }
    .sello { position: absolute; left: ${LLAVE.x + LLAVE.d / 2 - 36}px; top: ${LLAVE.y - 60}px; width: 72px; height: 72px; padding: 0; border-radius: 50%; display: grid; place-items: center; background: ${COLOR.amarillo}; box-shadow: 0 0 0 6px rgba(255,255,255,.9), 0 12px 24px rgba(8,20,45,.35); }
    .sello .icono { width: 38px; height: 38px; }

    /* 3 · ferreterías */
    .ferr { position: absolute; left: ${FERR.x}px; top: ${SUELO - FERR.h}px; width: ${FERR.w}px; height: ${FERR.h}px; transform-origin: 50% 100%; }
    .casa { position: absolute; left: ${CASA.x}px; top: ${SUELO - CASA.h}px; width: ${CASA.w}px; height: ${CASA.h}px; transform-origin: 50% 100%; }
    .casa .techo { position: absolute; left: -14px; right: -14px; top: 0; height: 44%; background: ${COLOR.azulOscuro}; clip-path: polygon(50% 0, 100% 100%, 0 100%); }
    .casa .muro { position: absolute; left: 8px; right: 8px; top: 44%; bottom: 0; background: ${COLOR.hueso}; }
    .casa .vent { position: absolute; left: 22px; top: 22px; width: 68px; height: 52px; border-radius: 8px; background: #FFE9A8; box-shadow: inset 0 0 0 5px #fff; }
    .casa .puertaC { position: absolute; right: 26px; bottom: 0; width: 48px; height: 76px; border-radius: 9px 9px 0 0; background: ${COLOR.azul}; }
    .rutas { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; overflow: visible; }
    .ruta { fill: none; stroke: #fff; stroke-width: 5; stroke-linecap: round; stroke-dasharray: 3 16; opacity: .8; }
    .pin { position: absolute; width: 64px; height: 80px; margin-left: -32px; }
    .pin .cabeza { position: absolute; left: 0; top: 0; width: 64px; height: 64px; border-radius: 50%; background: #fff; display: grid; place-items: center; box-shadow: 0 10px 20px rgba(8,20,45,.35); }
    .pin .cabeza::after { content: ''; position: absolute; left: 50%; bottom: -14px; margin-left: -12px; border: 12px solid transparent; border-top: 16px solid #fff; border-bottom: 0; }
    .pin .icono { width: 34px; height: 34px; }
    .nota3 { position: absolute; left: ${(PIN_F.x + PIN_C.x) / 2}px; top: 232px; width: 0; display: flex; flex-direction: column; align-items: center; gap: 12px; }
    .nota3 .chip { font-size: 26px; padding: 14px 26px 14px 18px; box-shadow: 0 14px 30px rgba(8,20,45,.3); }
    .nota3 .chip .icono { width: 32px; height: 32px; }
    .nota3 .chip b { color: ${COLOR.azul}; }
  `,
  html: (c) => {
    const icono = (n: string) => (n === 'hoja' ? `<svg viewBox="0 0 24 24">${HOJA}</svg>` : c.icono(n, 'blanco'));
    const cartas = PROF.map(
      (p, i) =>
        `<div class="tarj prof p${i}" style="left:${cartaX(i)}px"><div class="cabp"><span class="icp">${icono(p.ic)}</span><b>${p.nombre}</b></div>
          <div class="herr"><span class="ich">${c.icono(p.hic)}</span><div><em>Su herramienta</em><b>${p.herr}</b></div></div></div>`,
    ).join('');
    const estantes = [58, 112].map((y) => `<i class="estante" style="top:${y}px"></i>`).join('');
    const stock = ['llave-inglesa', 'martillo', 'herramienta', 'martillo2', 'plomeria', 'electricidad']
      .map((ic, i) => `<span class="stock" style="left:${11 + (i % 3) * 48}px;top:${i < 3 ? 16 : 70}px">${c.icono(ic)}</span>`)
      .join('');
    return `
    <div class="fondo"></div><div class="halo"></div>
    <div class="suelo"></div>

    <div class="esc e0">
      ${cartas}
      <div class="fila0"><div class="in"><span class="chip obj">${c.icono('objetivo')}Objetivo: <b>${c.cifra('META-PROFESIONES')}</b> profesiones a fines de 2027</span><span class="rot ej">Ejemplos · a validar</span></div></div>
    </div>

    <div class="esc e1">
      <div class="lado l1"><span class="k">Para cada profesional</span>
        <span class="chip">${c.icono('crecimiento')}<span>Ingresos y gastos, <b>claros</b></span></span>
        <span class="chip">${c.icono('sparkles')}<span>Feedback con IA: <b>vos decidís</b></span></span></div>
    </div>

    <div class="esc e2">
      <div class="local tienda"><div class="cartelT">${c.icono('tienda', 'oro')}</div><div class="toldo"></div><div class="frente"></div><div class="vidriera"><i class="mesa"></i></div><div class="puerta"></div></div>
      <div class="lado l2"><span class="k">Handyx for Business</span>
        <span class="chip">${c.icono('estrella')}<span>Elige por <b>valoraciones y turnos cumplidos</b></span></span>
        <span class="chip">${c.icono('capas')}<span><b>Integrado</b> al sistema del local</span></span></div>
      <div class="sello">${c.icono('estrella')}</div>
    </div>

    <div class="mov fonoN">${c.celular(`${c.img('conceptos/herramientas-numeros.webp', 'captura a', 'Diseño propuesto: ingresos, gastos y feedback con IA')}${c.img('conceptos/herramientas-negocios.webp', 'captura b', 'Diseño propuesto: un restaurante elige mozos por mérito')}`, 'tel')}</div>

    <div class="esc e3">
      <svg class="rutas" viewBox="0 0 1920 1080"><path class="ruta" d="${RUTA}" pathLength="1000"/></svg>
      <div class="ferr tienda"><div class="cartelT">${c.icono('martillo', 'oro')}</div><div class="toldo"></div><div class="frente"></div><div class="vidriera">${estantes}${stock}</div><div class="puerta"></div></div>
      <div class="casa"><div class="techo"></div><div class="muro"><i class="vent"></i><i class="puertaC"></i></div></div>
      <div class="pin pinF" style="left:${PIN_F.x}px;top:${PIN_F.y - 72}px"><div class="cabeza">${c.icono('herramienta')}</div></div>
      <div class="pin pinC" style="left:${PIN_C.x}px;top:${PIN_C.y - 72}px"><div class="cabeza">${c.icono('casa')}</div></div>
      <div class="nota3"><span class="chip">${c.icono('ruta')}<span>Reserva el stock y <b>lo retira camino al trabajo</b></span></span><span class="rot">A explorar · sin alianzas firmadas</span></div>
    </div>

    <div class="mov eng">${c.pj('engranaje', '', 176)}<div class="sombra-pj"></div></div>
    <div class="mov llave"><div class="camino">${c.pj('llave', '', LLAVE.d)}<i class="caja"></i><div class="sombra-pj"></div></div></div>

    <div class="encabezado"><div class="krow"><span class="kicker">Respaldo · visión</span><span class="rot">Diseños propuestos · datos ficticios</span></div>
      <div class="titulo t"><span class="l"><span>Más profesiones, <mark>más negocios</mark></span></span></div></div>
  `;
  },
  armar(tl, $, c) {
    tl.fromTo($('.halo'), { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 1.2, ease: 'power2.out' }, 0);
    tl.fromTo($('.krow'), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0);
    entraTitulo(tl, $.all('.encabezado .l > span'), 0.1);
    tl.fromTo($('.suelo'), { autoAlpha: 0, scaleX: 0.4 }, { autoAlpha: 1, scaleX: 1, duration: 0.6, ease: 'power3.out' }, 0.3);
    tl.fromTo($('.llave'), { autoAlpha: 0, x: LLAVE.ini, y: 70, scale: 0.7 }, { autoAlpha: 1, x: LLAVE.ini, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.8)' }, 0.6);
    tl.fromTo($('.eng'), { autoAlpha: 0, y: 70, scale: 0.7 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.8)' }, 0.75);
    const sale = (sel: string, k: number) => tl.to($(sel), { autoAlpha: 0, y: 30, duration: 0.35, ease: 'power2.in' }, M[k] ?? 0);

    // 0 · las profesiones de ejemplo y su herramienta, que encastra con un golpe
    $.all('.prof').forEach((p, i) => {
      tl.fromTo(p, { autoAlpha: 0, y: 50, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.6)' }, 0.5 + i * 0.12);
      tl.fromTo(p.querySelector('.herr'), { autoAlpha: 0, y: -70, scale: 0.8 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.42, ease: 'back.out(2.2)' }, T_HERR(i));
    });
    tl.fromTo($('.fila0 .in'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'back.out(1.8)' }, 2.5);
    sale('.e0', 1);

    // 1 · Llave camina hasta el celular: sus números, con IA
    tl.to($('.llave'), { x: 0, duration: 0.65, ease: 'power2.inOut' }, M[1]);
    tl.fromTo($('.fonoN'), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out' }, 3.75);
    tl.fromTo($('.l1 .k'), { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.35 }, 4.3);
    tl.fromTo($.all('.l1 .chip'), { autoAlpha: 0, x: -40, scale: 0.92 }, { autoAlpha: 1, x: 0, scale: 1, duration: 0.45, ease: 'back.out(1.8)', stagger: 0.3 }, 4.45);
    sale('.e1', 2);

    // 2 · el mismo celular cambia a Handyx for Business; el local y su elegido
    tl.fromTo($('.captura.b'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, ease: 'power2.inOut' }, 7.05);
    tl.fromTo($('.local'), { autoAlpha: 0, scaleY: 0.3 }, { autoAlpha: 1, scaleY: 1, duration: 0.5, ease: 'back.out(1.5)' }, 7.15);
    tl.fromTo($('.l2 .k'), { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.35 }, 7.3);
    tl.fromTo($.all('.l2 .chip'), { autoAlpha: 0, x: -40, scale: 0.92 }, { autoAlpha: 1, x: 0, scale: 1, duration: 0.45, ease: 'back.out(1.8)', stagger: 0.3 }, 7.45);
    tl.fromTo($('.sello'), { autoAlpha: 0, scale: 0.2, rotation: -30 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.45, ease: 'back.out(2.6)' }, 8.6);
    sale('.e2', 3);
    tl.to($('.fonoN'), { autoAlpha: 0, y: 40, duration: 0.35, ease: 'power2.in' }, M[3]);

    // 3 · ferretería cercana → ruta → casa; Llave retira el stock y camina hasta el trabajo
    tl.fromTo($('.ferr'), { autoAlpha: 0, scaleY: 0.3 }, { autoAlpha: 1, scaleY: 1, duration: 0.5, ease: 'back.out(1.5)' }, 10.55);
    tl.fromTo($('.casa'), { autoAlpha: 0, scaleY: 0.3 }, { autoAlpha: 1, scaleY: 1, duration: 0.5, ease: 'back.out(1.5)' }, 10.7);
    tl.fromTo($.all('.pin'), { autoAlpha: 0, y: -60 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'bounce.out', stagger: 0.2 }, 10.85);
    tl.fromTo($('.ruta'), { autoAlpha: 0 }, { autoAlpha: 0.8, duration: 0.3 }, 11.0);
    tl.fromTo($('.nota3'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'back.out(1.8)' }, 11.35);

    // Llave por la vereda (pintor sobre .camino; la línea de tiempo mueve el contenedor .llave)
    const camino = $('.llave .camino');
    const caja = $('.caja');
    const poser = (el: HTMLElement) => {
      let ultima = '';
      return (p: Pose) => {
        if (p !== ultima) {
          ultima = p;
          pose(el, p);
        }
      };
    };
    const llave = poser($('.llave .pj'));
    const eng = poser($('.eng .pj'));
    // (los cambios de paso van 0,05 s después de cada marca: la página exportada de un paso termina justo en la marca siguiente)
    const TL: Array<[number, Pose]> = [[0, 'a'], [1.0, 'b'], [2.6, 'c'], [M[1]! + 0.05, 'd'], [4.05, 'a'], [4.5, 'b'], [5.4, 'c'], [M[2]! + 0.05, 'a'], [8.6, 'c'], [M[3]! + 0.05, 'a'], [10.9, 'b'], [CAMINO.t0, 'd'], [CAMINO.t1, 'c']];
    const TE: Array<[number, Pose]> = [[0, 'a'], [1.4, 'd'], [2.6, 'c'], [M[1]! + 0.05, 'a'], [5.0, 'b'], [M[2]! + 0.05, 'a'], [7.5, 'd'], [9.0, 'c'], [M[3]! + 0.05, 'a'], [11.4, 'b'], [12.6, 'c']];
    const en = (tabla: Array<[number, Pose]>, t: number): Pose => tabla.filter(([d]) => t >= d).pop()?.[1] ?? 'a';
    c.pintor((t) => {
      const k = tramo(t, CAMINO.t0, CAMINO.t1);
      const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
      camino.style.transform = `translateX(${(e * CAMINO.hasta).toFixed(1)}px)`;
      caja.style.opacity = t >= 10.95 ? '1' : '0';
      llave(en(TL, t));
      eng(en(TE, t));
    });
  },
  ambiente(t, $, tl) {
    // Respiración; mientras camina, Llave rebota (dueño: el ambiente sobre el .pj; los contenedores los mueven línea y pintor)
    const camina = (tl > M[1]! && tl < M[1]! + 0.65) || (tl > CAMINO.t0 && tl < CAMINO.t1);
    $.all('.pj').forEach((p, i) => {
      if (camina && p.closest('.llave')) {
        const f = Math.sin(tl * 17);
        p.style.transform = `translateY(${(-Math.abs(f) * 12).toFixed(1)}px) rotate(${(f * 5).toFixed(1)}deg)`;
      } else p.style.transform = `scaleY(${(1 + Math.sin(t * 2.4 + i) * 0.02).toFixed(4)})`;
    });
    // La ruta corre (dueño: el ambiente) y los pines flotan apenas
    $('.ruta').style.strokeDashoffset = String((-t * 40).toFixed(1));
    $.all('.pin .cabeza').forEach((el, i) => (el.style.transform = `translateY(${(Math.sin(t * 2 + i * 1.3) * 4).toFixed(1)}px)`));
  },
});
