// Anexo de respaldo · Marca y UX/UI. Un golpe por clic:
// 0 Los Handys: el vecino (Foco), el profesional (Llave) y un personaje por oficio; entran como siluetas y se revelan ·
// 1 Pensados para que los chicos los recuerden: un memotest arma dos pares y, en casa, se cuenta de los Handys
//   (estrategia de recordación, no un dato medido) ·
// 2 La paleta y la tipografía de la app: Brocha pinta los colores; Archivo para títulos y DM Sans con voseo para textos ·
// 3 La app: tres pantallas de la demo (usuario, HandIA y profesional), con su rótulo «Demo · datos ficticios».
// La franja y 880–950 queda libre para la leyenda del kit.
import { COLOR, entraTitulo, escena, pose, tramo, type Personaje, type Pose } from './comun/kit.ts';

const M = [0, 3.4, 6.8, 10.2, 13.6];

// Paso 0 · el elenco (mosaicos como la grilla de rubros de la app)
const ELENCO: Array<{ pj: Personaje; nombre: string; rol: string; ic: string; alto: number }> = [
  { pj: 'bombilla', nombre: 'Foco', rol: 'El vecino', ic: 'casa', alto: 198 },
  { pj: 'llave', nombre: 'Llave', rol: 'El profesional', ic: 'herramienta', alto: 176 },
  { pj: 'gota', nombre: 'Gota', rol: 'Plomería', ic: 'plomeria', alto: 176 },
  { pj: 'medidor_gas', nombre: 'Medidor', rol: 'Gas', ic: 'gas', alto: 176 },
  { pj: 'brocha', nombre: 'Brocha', rol: 'Albañilería', ic: 'albanileria', alto: 190 },
  { pj: 'aire', nombre: 'Aire', rol: 'Aire acond.', ic: 'aire', alto: 86 },
];
const FICHA = { w: 262, h: 352, gap: 22, y: 318, mosaico: 222 };
const fichaX = (i: number) => 960 - (ELENCO.length * FICHA.w + (ELENCO.length - 1) * FICHA.gap) / 2 + i * (FICHA.w + FICHA.gap);
const T_REV = (i: number) => 0.75 + i * 0.26; // cada silueta se revela

// Paso 1 · memotest de 4 × 2: dos pares se dan vuelta (Gota y Foco); el resto queda boca abajo
const MEMO = { w: 176, h: 212, gap: 20, x: 0, y: 290 };
MEMO.x = 782 - (4 * MEMO.w + 3 * MEMO.gap) / 2;
const CARTAS: Personaje[] = ['gota', 'medidor_gas', 'aire', 'bombilla', 'llave', 'bombilla', 'gota', 'brocha'];
const GIROS = [
  { i: 0, t: 4.25 },
  { i: 6, t: 4.7 },
  { i: 3, t: 5.35 },
  { i: 5, t: 5.8 },
];
const PARES = [
  { cartas: [0, 6], t: 5.05 },
  { cartas: [3, 5], t: 6.15 },
];
const CASA = { x: 1340, y: 560, w: 236, h: 196 };

// Paso 2 · paleta (solo colores del kit) y tipografía
const PALETA = [
  { c: COLOR.azul, n: 'Azul', claro: false },
  { c: COLOR.azulOscuro, n: 'Azul oscuro', claro: false },
  { c: COLOR.amarillo, n: 'Amarillo', claro: true },
  { c: COLOR.hueso, n: 'Hueso', claro: true },
  { c: COLOR.verde, n: 'Verde', claro: false },
];
const MUESTRA = { w: 176, gap: 18, x: 516, y: 288 };
const muestraX = (i: number) => MUESTRA.x + i * (MUESTRA.w + MUESTRA.gap);
const PINCEL = { x: 346, y: 694 }; // punta del pincel de Brocha
const T_PINTA = (i: number) => 7.45 + i * 0.36;

// Paso 3 · la app (capturas de la demo de la landing)
const APP = [
  { img: 'demo-landing/usuario-inicio.webp', alt: 'Demo: inicio de la app de usuario', rot: 'Usuario', x: 520, y: 282, r: -3 },
  { img: 'demo-landing/usuario-handia.webp', alt: 'Demo: HandIA arma el pedido', rot: 'HandIA · en desarrollo', x: 829, y: 262, r: 0 },
  { img: 'demo-landing/especialista-pedido.webp', alt: 'Demo: pedido nuevo en la app del profesional', rot: 'Profesional', x: 1138, y: 282, r: 3 },
];

export default escena({
  marcas: M,
  leyendas: ['Los Handys: **el vecino, el profesional y cada oficio**', 'Pensados para que **los chicos los recuerden**', 'La paleta y la tipografía **de la app**', 'La app: **pedir en pocos pasos**'],
  css: `
    .fondo { position: absolute; inset: 0; background: #EEF0F6; }
    .halo { position: absolute; left: 960px; top: 540px; width: 1500px; height: 1000px; margin: -500px 0 0 -750px; border-radius: 50%; background: radial-gradient(closest-side, rgba(255,255,255,.95), rgba(255,255,255,0)); }
    .encabezado { position: absolute; left: 96px; top: 52px; }
    .krow { display: flex; align-items: center; gap: 16px; }
    .rot { padding: 4px 14px; border-radius: 999px; border: 3px solid ${COLOR.azulOscuro}; color: ${COLOR.azulOscuro}; font-weight: 800; font-size: 20px; letter-spacing: .06em; text-transform: uppercase; white-space: nowrap; }
    .encabezado .titulo { margin-top: 10px; font-size: 64px; color: ${COLOR.azulOscuro}; }
    .esc { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
    .mov { position: absolute; transform-origin: 50% 100%; }
    .pj { transform-origin: 50% 100%; }

    /* 0 · el elenco */
    .ficha { position: absolute; top: ${FICHA.y}px; width: ${FICHA.w}px; height: ${FICHA.h}px; padding: 18px; border-radius: 28px; background: #fff; box-shadow: 0 16px 34px rgba(14,29,54,.10), 0 5px 0 #DCE2EC; }
    .ficha .mosaico { position: relative; height: ${FICHA.mosaico}px; border-radius: 20px; background: #E8ECF3; }
    .ficha .mosaico .lugar { position: absolute; left: 50%; bottom: 10px; }
    .ficha .mosaico .pj { left: 0; top: 0; }
    .ficha .nombre { margin-top: 16px; font-family: var(--fuente-titulos, sans-serif); font-weight: 900; font-stretch: 112%; font-size: 32px; line-height: 1; color: ${COLOR.azulOscuro}; }
    .ficha .rol { display: flex; align-items: center; gap: 8px; margin-top: 10px; font-size: 23px; font-weight: 700; color: ${COLOR.suave}; white-space: nowrap; }
    .ficha .rol .icono { width: 26px; height: 26px; }

    /* 1 · memotest y la casa */
    .memo { position: absolute; width: ${MEMO.w}px; height: ${MEMO.h}px; perspective: 900px; }
    .gira { position: absolute; inset: 0; transform-style: preserve-3d; }
    .cara { position: absolute; inset: 0; border-radius: 24px; backface-visibility: hidden; -webkit-backface-visibility: hidden; overflow: hidden; }
    .cara.frente { background: #fff; box-shadow: 0 14px 28px rgba(14,29,54,.12), 0 4px 0 #DCE2EC; }
    .cara.frente .mosaico { position: absolute; left: 14px; right: 14px; top: 14px; bottom: 14px; border-radius: 16px; background: #E8ECF3; }
    .cara.frente .lugarM { position: absolute; left: 50%; bottom: 24px; }
    .cara.dorso { transform: rotateY(180deg); background: ${COLOR.azul}; box-shadow: 0 14px 28px rgba(14,29,54,.16), 0 4px 0 ${COLOR.azulOscuro}; display: grid; place-items: center; }
    .cara.dorso::before { content: ''; position: absolute; inset: 12px; border-radius: 16px; border: 3px solid rgba(255,255,255,.22); }
    .cara.dorso img { width: 120px; filter: brightness(0) invert(1); opacity: .95; }
    .par { position: absolute; inset: -9px; border-radius: 31px; border: 6px solid ${COLOR.amarillo}; box-shadow: 0 0 22px rgba(255,201,60,.55); opacity: 0; }
    .rec { position: absolute; left: ${MEMO.x}px; top: ${MEMO.y + 2 * MEMO.h + MEMO.gap + 34}px; width: ${4 * MEMO.w + 3 * MEMO.gap}px; display: flex; justify-content: center; }
    .rec span { padding: 7px 18px; border-radius: 999px; background: #fff; font-size: 21px; font-weight: 700; color: ${COLOR.suave}; box-shadow: 0 6px 16px rgba(14,29,54,.08); white-space: nowrap; }
    .casa { position: absolute; left: ${CASA.x}px; top: ${CASA.y}px; width: ${CASA.w}px; height: ${CASA.h}px; transform-origin: 50% 100%; }
    .casa .techo { position: absolute; left: -14px; right: -14px; top: 0; height: 44%; background: ${COLOR.azulOscuro}; clip-path: polygon(50% 0, 100% 100%, 0 100%); }
    .casa .muro { position: absolute; left: 8px; right: 8px; top: 44%; bottom: 0; background: #fff; box-shadow: inset 0 0 0 3px #E1E6EF; }
    .casa .vent { position: absolute; left: 22px; top: 18px; width: 70px; height: 54px; border-radius: 8px; background: #FFE9A8; box-shadow: inset 0 0 0 5px #fff, 0 0 0 2px #E9C766, 0 0 22px rgba(255,201,60,.6); }
    .casa .puertaC { position: absolute; right: 24px; bottom: 0; width: 46px; height: 70px; border-radius: 9px 9px 0 0; background: ${COLOR.azul}; }
    .globo { position: absolute; left: ${CASA.x - 20}px; top: 300px; width: 276px; height: 170px; border-radius: 34px; background: #fff; box-shadow: 0 16px 32px rgba(14,29,54,.14), 0 3px 0 #DCE2EC; transform-origin: 30% 120%; }
    .globo::after { content: ''; position: absolute; left: 74px; bottom: -22px; border: 16px solid transparent; border-top: 24px solid #fff; border-bottom: 0; }
    .en-casa { position: absolute; left: ${CASA.x + CASA.w / 2}px; top: ${CASA.y + CASA.h + 22}px; width: 0; display: flex; justify-content: center; }
    .en-casa .chip { font-size: 22px; padding: 9px 18px 9px 12px; }
    .en-casa .chip .icono { width: 26px; height: 26px; }

    /* 2 · paleta y tipografía */
    .muestra { position: absolute; top: ${MUESTRA.y}px; width: ${MUESTRA.w}px; height: ${MUESTRA.w}px; border-radius: 26px; background: #E3E8F2; overflow: hidden; box-shadow: 0 12px 26px rgba(14,29,54,.10); }
    .muestra .pintura { position: absolute; inset: 0; transform-origin: 0 50%; }
    .muestra .pintura.borde { box-shadow: inset 0 0 0 2px #DCE2EC; }
    .muestra span { position: absolute; left: 18px; bottom: 16px; font-size: 22px; font-weight: 800; }
    .gotaP { position: absolute; left: 0; top: 0; width: 24px; height: 24px; margin: -12px 0 0 -12px; border-radius: 50%; opacity: 0; }
    .tipo { position: absolute; top: 508px; height: 236px; padding: 26px 30px; display: flex; align-items: center; gap: 28px; }
    .tipo.a { left: ${MUESTRA.x}px; width: 436px; }
    .tipo.b { left: ${MUESTRA.x + 454}px; width: 498px; flex-direction: column; align-items: flex-start; justify-content: center; gap: 14px; }
    .aa { font-family: var(--fuente-titulos, sans-serif); font-weight: 900; font-stretch: 118%; font-size: 124px; line-height: .9; color: ${COLOR.azulOscuro}; }
    .tipo .nom { font-size: 30px; font-weight: 800; color: ${COLOR.noche}; }
    .tipo .uso { margin-top: 4px; font-size: 22px; font-weight: 600; color: ${COLOR.suave}; }
    .frase { font-family: var(--fuente-texto, 'DM Sans Variable', sans-serif); font-weight: 800; font-size: 40px; line-height: 1.1; color: ${COLOR.noche}; white-space: nowrap; }
    .brocha { left: 144px; top: 600px; width: 236px; height: 236px; }
    .gotaH { left: 1570px; top: 640px; width: 190px; height: 190px; }

    /* 3 · la app */
    .tel { width: 262px; height: 566px; border-radius: 44px; padding: 11px; }
    .tel .pantalla { border-radius: 34px; }
    .tel .isla { width: 80px; height: 23px; margin-left: -40px; top: 10px; }
    .fono { position: absolute; width: 262px; height: 566px; transform-origin: 50% 100%; }
    .rotapp { position: absolute; width: 0; display: flex; justify-content: center; }
    .rotapp .chip { font-size: 22px; padding: 8px 18px; color: ${COLOR.azulOscuro}; }
    .focoA { left: 170px; top: 620px; width: 230px; height: 230px; }
    .llaveA { left: 1528px; top: 644px; width: 206px; height: 206px; }
  `,
  html: (c) => {
    const fichas = ELENCO.map(
      (e, i) =>
        `<div class="ficha f${i}" style="left:${fichaX(i)}px"><div class="mosaico"><div class="lugar" style="margin-left:${-e.alto / 2}px;top:${FICHA.mosaico - 12 - e.alto}px;width:${e.alto}px;height:${e.alto}px">${c.pj(e.pj, 'sil', e.alto)}</div></div>
          <div class="nombre">${e.nombre}</div><div class="rol">${c.icono(e.ic)}${e.rol}</div></div>`,
    ).join('');
    const memo = CARTAS.map((p, i) => {
      const x = MEMO.x + (i % 4) * (MEMO.w + MEMO.gap);
      const y = MEMO.y + Math.floor(i / 4) * (MEMO.h + MEMO.gap);
      const alto = p === 'aire' ? 64 : 132;
      return `<div class="memo m${i}" style="left:${x}px;top:${y}px"><i class="par"></i><div class="gira"><div class="cara frente"><i class="mosaico"></i><div class="lugarM" style="margin-left:${-alto / 2}px;width:${alto}px;height:${alto}px">${c.pj(p, '', alto)}</div></div><div class="cara dorso">${c.logo()}</div></div></div>`;
    }).join('');
    const pintura = PALETA.map(
      (p, i) =>
        `<div class="muestra s${i}" style="left:${muestraX(i)}px"><i class="pintura ${p.c === COLOR.hueso ? 'borde' : ''}" style="background:${p.c}"></i><span style="color:${p.claro ? COLOR.noche : '#fff'}">${p.n}</span></div>`,
    ).join('');
    const telefonos = APP.map(
      (a, i) =>
        `<div class="fono a${i}" style="left:${a.x}px;top:${a.y}px">${c.celular(c.img(a.img, 'captura', a.alt), 'tel')}</div><div class="rotapp r${i}" style="left:${a.x + 131}px;top:${a.y - 58}px"><span class="chip">${a.rot}</span></div>`,
    ).join('');
    return `
    <div class="fondo"></div><div class="halo"></div>

    <div class="esc e0">${fichas}</div>

    <div class="esc e1">
      ${memo}
      <div class="rec"><span>Estrategia de recordación</span></div>
      <div class="globo"><div class="mov" style="left:30px;top:22px;width:120px;height:120px">${c.pj('gota', 'g1', 120)}</div><div class="mov" style="left:142px;top:12px;width:132px;height:132px">${c.pj('bombilla', 'g2', 132)}</div></div>
      <div class="casa"><div class="techo"></div><div class="muro"><i class="vent"></i><i class="puertaC"></i></div></div>
      <div class="en-casa"><span class="chip">${c.icono('chat')}Y lo cuentan en casa</span></div>
    </div>

    <div class="esc e2">
      ${pintura}
      <div class="tarjeta tipo a"><div class="aa">Aa</div><div><div class="nom">Archivo</div><div class="uso">Títulos</div></div></div>
      <div class="tarjeta tipo b"><div class="frase">¿Qué necesitás <mark>hoy</mark>?</div><div><div class="nom">DM Sans</div><div class="uso">Textos, en español rioplatense</div></div></div>
      ${PALETA.map((p) => `<i class="gotaP" style="background:${p.c}${p.c === COLOR.hueso ? ';box-shadow:0 0 0 2px #DCE2EC' : ''}"></i>`).join('')}
      <div class="mov brocha">${c.pj('brocha', '', 236)}<div class="sombra-pj"></div></div>
      <div class="mov gotaH">${c.pj('gota', '', 190)}<div class="sombra-pj"></div></div>
    </div>

    <div class="esc e3">
      ${telefonos}
      <div class="mov focoA">${c.pj('bombilla', '', 230)}<div class="sombra-pj"></div></div>
      <div class="mov llaveA">${c.pj('llave', '', 206)}<div class="sombra-pj"></div></div>
    </div>

    <div class="encabezado"><div class="krow"><span class="kicker">Respaldo · marca</span><span class="rot demo">Demo · datos ficticios</span></div>
      <div class="titulo t"><span class="l"><span>Una marca que <mark>se recuerda</mark></span></span></div></div>
  `;
  },
  armar(tl, $, c) {
    tl.fromTo($('.halo'), { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 1.2, ease: 'power2.out' }, 0);
    tl.fromTo($('.kicker'), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0);
    entraTitulo(tl, $.all('.encabezado .l > span'), 0.1);
    const sale = (sel: string, k: number) => tl.to($(sel), { autoAlpha: 0, y: 30, duration: 0.35, ease: 'power2.in' }, M[k] ?? 0);

    // 0 · el elenco: las fichas entran y cada silueta se revela con su nombre
    $.all('.ficha').forEach((f, i) => {
      tl.fromTo(f, { autoAlpha: 0, y: 46, scale: 0.92 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }, 0.35 + i * 0.07);
      tl.fromTo(f.querySelector('.sil'), { filter: 'brightness(0) opacity(0.78)' }, { filter: 'brightness(1) opacity(1)', duration: 0.35, ease: 'power2.out' }, T_REV(i));
      tl.fromTo([f.querySelector('.nombre'), f.querySelector('.rol')], { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power3.out', stagger: 0.06 }, T_REV(i) + 0.05);
    });
    sale('.e0', 1);

    // 1 · memotest: las cartas llegan boca abajo, dos pares se dan vuelta; en casa, se cuenta de los Handys
    $.all('.memo').forEach((m, i) => tl.fromTo(m, { autoAlpha: 0, y: 40, scale: 0.8 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.8)' }, 3.75 + i * 0.045));
    $.all('.memo .gira').forEach((g) => tl.set(g, { rotationY: 180 }, 0));
    for (const g of GIROS) tl.fromTo($(`.m${g.i} .gira`), { rotationY: 180 }, { rotationY: 0, duration: 0.42, ease: 'power2.inOut', immediateRender: false }, g.t);
    for (const p of PARES)
      for (const i of p.cartas) {
        tl.fromTo($(`.m${i} .par`), { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' }, p.t);
        tl.fromTo($(`.m${i}`), { y: 0 }, { y: -14, duration: 0.16, yoyo: true, repeat: 1, ease: 'power2.out', immediateRender: false }, p.t);
      }
    tl.fromTo($('.casa'), { autoAlpha: 0, scaleY: 0.3 }, { autoAlpha: 1, scaleY: 1, duration: 0.5, ease: 'back.out(1.6)' }, 4.0);
    tl.fromTo($('.globo'), { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, 6.25);
    tl.fromTo($('.en-casa'), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power3.out' }, 6.35);
    tl.fromTo($('.rec'), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power3.out' }, 4.3);
    sale('.e1', 2);

    // 2 · Brocha pinta la paleta (cada gota vuela del pincel a su muestra) y entra la tipografía
    tl.fromTo($('.brocha'), { autoAlpha: 0, x: -120 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: 'power3.out' }, 7.0);
    tl.fromTo($.all('.muestra'), { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(2)', stagger: 0.05 }, 7.2);
    PALETA.forEach((_, i) => {
      tl.fromTo($(`.s${i} .pintura`), { scaleX: 0 }, { scaleX: 1, duration: 0.32, ease: 'power3.out' }, T_PINTA(i) + 0.3);
      tl.fromTo($(`.s${i} span`), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, T_PINTA(i) + 0.45);
    });
    tl.fromTo($.all('.tipo'), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'back.out(1.5)', stagger: 0.18 }, 8.6);
    tl.fromTo($('.gotaH'), { autoAlpha: 0, y: 60, scale: 0.7 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.8)' }, 8.9);
    sale('.e2', 3);

    // 3 · la app: tres pantallas de la demo, con Foco y Llave al lado de la suya
    APP.forEach((a, i) => {
      tl.fromTo($(`.a${i}`), { autoAlpha: 0, y: 34, scale: 0.94, rotation: 0 }, { autoAlpha: 1, y: 0, scale: 1, rotation: a.r, duration: 0.6, ease: 'power3.out' }, 10.55 + i * 0.16);
      tl.fromTo($(`.r${i} .chip`), { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2.4)' }, 11.2 + i * 0.16);
    });
    tl.fromTo([$('.focoA'), $('.llaveA')], { autoAlpha: 0, y: 70, scale: 0.7 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.8)', stagger: 0.15 }, 11.0);
    tl.fromTo($('.rot.demo'), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2.2)' }, 11.6);

    // Gotas de pintura: del pincel de Brocha a cada muestra, en arco (pintor: posición y opacidad)
    const gotas = $.all('.gotaP').map((el, i) => ({ el, i, x1: muestraX(i) + MUESTRA.w / 2, y1: MUESTRA.y + MUESTRA.w / 2 }));
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
    const elenco = $.all('.ficha .pj').map(poser);
    const memo = $.all('.memo .pj').map(poser);
    const [g1, g2, brocha, gotaH, focoA, llaveA] = ['.g1', '.g2', '.brocha .pj', '.gotaH .pj', '.focoA .pj', '.llaveA .pj'].map((s) => poser($(s))) as Array<(p: Pose) => void>;
    c.pintor((t) => {
      elenco.forEach((f, i) => f(t >= 2.75 ? 'c' : t >= T_REV(i) + 0.1 ? 'b' : 'a'));
      memo.forEach((f, i) => {
        const par = PARES.find((p) => p.cartas.includes(i));
        f(par && t >= par.t ? 'c' : 'a');
      });
      g1!(t >= 6.5 ? 'c' : 'b');
      g2!(t >= 6.5 ? 'b' : 'a');
      brocha!(t >= 9.3 ? 'c' : t >= 7.2 ? 'd' : 'a');
      gotaH!(t >= 9.4 ? 'c' : 'b');
      focoA!(t >= 12.4 ? 'c' : 'b');
      llaveA!(t >= 12.6 ? 'c' : 'b');
      for (const g of gotas) {
        const t0 = T_PINTA(g.i);
        const k = tramo(t, t0, t0 + 0.32);
        if (k <= 0 || k >= 1) {
          g.el.style.opacity = '0';
          continue;
        }
        const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
        const x = PINCEL.x + (g.x1 - PINCEL.x) * e;
        const y = PINCEL.y + (g.y1 - PINCEL.y) * e - Math.sin(e * Math.PI) * 140;
        g.el.style.opacity = '1';
        g.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${(1 - e * 0.4).toFixed(3)})`;
      }
    });
  },
  ambiente(t, $) {
    $.all('.pj').forEach((p, i) => {
      if (p.closest('.cara')) return; // los de las cartas no respiran (la carta gira)
      p.style.transform = `scaleY(${(1 + Math.sin(t * 2.4 + i) * 0.02).toFixed(4)})`;
    });
  },
});
