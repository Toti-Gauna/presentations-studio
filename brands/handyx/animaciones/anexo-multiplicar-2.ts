// Anexo · Maneras de multiplicar ingresos (2/2): qué hacemos con las ganancias. Un golpe por paso:
// 0 primero, reinvertir para crecer (marketing e IA mientras el CAC sea menor que el LTV, herramientas, formación) ·
// 1 antes de invertir, la caja: se llena con los meses de costos de la política (Grifo, la válvula, cerrado) ·
// 2 recién el excedente pasa a una tesorería diversificada, con tope para cripto y aprobada por el directorio ·
// 3 la plata de los inversores va al plan de crecimiento: nunca a cripto ni a la tesorería.
// Mismo lenguaje que la 1/2 (corrientes de monedas, marco amarillo en el foco). Las cifras salen de afirmaciones.
// La franja y 880–950 queda libre para la leyenda del kit.
import { COLOR, entraTitulo, escena, pose, tramo, type Pose } from './comun/kit.ts';

type P = readonly [number, number];
const MARCAS = [0, 3.2, 6.4, 9.6, 12.8];
const A = { x: 520, y: 236, w: 1304, h: 284 }; // reinvertir
const B = { x: 520, y: 560, w: 1304, h: 300 }; // tesorería
const GAN = { x: 238, y: 556, r: 84 }; // alcancía de ganancias
const JARRO = { x: 556, y: 672, w: 280, h: 154 };
const DONA = { x: 1262, y: 750, r: 70 };
const INV = { x: 96, y: 244, w: 290, h: 60 };

interface Via { d: string; largo: number; en: (s: number) => P }
function via(p0: P, p1: P, p2: P, p3: P): Via {
  const pts: P[] = [];
  for (let k = 0; k <= 60; k++) {
    const u = k / 60;
    const a = (1 - u) ** 3;
    const b = 3 * (1 - u) ** 2 * u;
    const c = 3 * (1 - u) * u * u;
    const e = u ** 3;
    pts.push([a * p0[0] + b * p1[0] + c * p2[0] + e * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + e * p3[1]]);
  }
  const acum = [0];
  for (let i = 1; i < pts.length; i++) acum.push(acum[i - 1]! + Math.hypot(pts[i]![0] - pts[i - 1]![0], pts[i]![1] - pts[i - 1]![1]));
  const largo = acum[acum.length - 1]!;
  const en = (s: number): P => {
    let i = 1;
    while (i < pts.length - 1 && acum[i]! < s) i++;
    const a = pts[i - 1]!;
    const b = pts[i]!;
    const u = Math.min(1, Math.max(0, (s - acum[i - 1]!) / (acum[i]! - acum[i - 1]! || 1)));
    return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
  };
  return { d: `M${p0[0]} ${p0[1]} C${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]} ${p3[0]} ${p3[1]}`, largo, en };
}
// 0 ganancias → reinvertir · 1 ganancias → caja · 2 caja → tesorería (excedentes) · 3 inversión → plan
const VIAS: Via[] = [
  via([GAN.x + GAN.r + 12, GAN.y - 26], [430, GAN.y - 26], [440, 452], [A.x, 452]),
  via([GAN.x + GAN.r + 12, GAN.y + 26], [430, GAN.y + 26], [450, JARRO.y + 76], [JARRO.x, JARRO.y + 76]),
  via([1008, DONA.y], [1056, DONA.y], [1096, DONA.y], [DONA.x - DONA.r - 24, DONA.y]),
  via([INV.x + INV.w, INV.y + INV.h / 2], [452, INV.y + INV.h / 2], [470, 292], [A.x, 292]),
];
const T_VIA = [1.35, 3.75, 6.75, 9.95];
const D_VIA = [0.6, 0.6, 0.4, 0.5];
const MONEDAS = [3, 3, 2, 2];
const VEL = 150;
// Marco amarillo: dónde está el foco en cada paso (izquierda, arriba, ancho, alto)
const FOCOS: Array<[number, number, number, number]> = [
  [A.x - 10, A.y - 10, A.w + 20, A.h + 20],
  [JARRO.x - 16, JARRO.y - 16, JARRO.w + 32, JARRO.h + 32],
  [980, 652, 834, 196],
  [INV.x - 10, INV.y - 10, INV.w + 20, 176],
];
const T_LLENA = [4.2, 5.6]; // la caja se llena con los meses de costos
const T_SALE = 6.8; // Grifo abre: pasa el excedente
const T_PLAN = T_VIA[3]! + D_VIA[3]! + 0.35; // la inversión llega al plan

const prohibido = `<svg class="no" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/></svg>`;

export default escena({
  marcas: MARCAS,
  leyendas: ['Primero: **reinvertir** para crecer', 'Antes de invertir: **meses de costos** guardados', 'La tesorería **protege**; el negocio multiplica', 'La plata de los inversores va **al plan**'],
  css: `
    .fondo { position: absolute; inset: 0; background-color: ${COLOR.hueso}; background-image: radial-gradient(rgba(31,87,168,.10) 1.6px, transparent 2.2px); background-size: 36px 36px; }
    .encabezado { position: absolute; left: 96px; top: 52px; z-index: 50; }
    .fila-k { display: flex; align-items: center; gap: 16px; }
    .rotulo { font-weight: 800; font-size: 20px; letter-spacing: .06em; text-transform: uppercase; color: ${COLOR.azulOscuro}; border: 3px solid ${COLOR.azulOscuro}; border-radius: 999px; padding: 3px 14px; }
    .encabezado .titulo { margin-top: 12px; font-size: 62px; color: ${COLOR.noche}; }
    .carta { position: absolute; border-radius: 30px; background: #fff; box-shadow: 0 16px 34px rgba(14,29,54,.10), 0 4px 0 #DCE2EC; }
    .cab { position: absolute; display: flex; align-items: center; gap: 16px; font-size: 40px; color: ${COLOR.noche}; white-space: nowrap; }
    .cab .ic { display: grid; place-items: center; width: 58px; height: 58px; border-radius: 18px; background: ${COLOR.celeste}; }
    .cab .ic .icono { width: 34px; height: 34px; }
    .mov { position: absolute; transform-origin: 50% 100%; }
    .pj { transform-origin: 50% 100%; }

    /* Reinvertir */
    .cond { position: absolute; left: 36px; top: 98px; display: flex; align-items: center; gap: 12px; font-size: 25px; font-weight: 600; color: ${COLOR.texto}; white-space: nowrap; }
    .cond b { color: ${COLOR.azul}; font-weight: 800; }
    .cond .icono { width: 30px; height: 30px; }
    .usos { position: absolute; left: 36px; top: 160px; display: flex; gap: 14px; }
    .uso { display: flex; align-items: center; gap: 12px; height: 86px; padding: 0 22px 0 12px; border-radius: 22px; background: #F1F3F7; font-size: 23px; font-weight: 700; line-height: 1.2; color: ${COLOR.noche}; }
    .uso .ic { flex: none; display: grid; place-items: center; width: 56px; height: 56px; border-radius: 16px; background: #fff; box-shadow: 0 3px 0 #DCE2EC; }
    .uso .icono { width: 30px; height: 30px; }
    .baldosa { position: absolute; left: ${A.w - 326}px; top: 22px; width: 300px; height: ${A.h - 44}px; border-radius: 22px; background: #E6EAF1; overflow: hidden; }

    /* Tesorería */
    .jarro { position: absolute; left: ${JARRO.x - B.x}px; top: ${JARRO.y - B.y}px; width: ${JARRO.w}px; height: ${JARRO.h}px; border-radius: 24px; background: #EEF1F6; box-shadow: inset 0 0 0 4px #C9D3E6; overflow: hidden; }
    .liquido { position: absolute; left: 0; right: 0; bottom: 0; height: 100%; background: ${COLOR.azul}; transform-origin: 50% 100%; }
    .liquido::before { content: ''; position: absolute; left: 0; right: 0; top: 0; height: 14px; background: rgba(255,255,255,.18); }
    .j-txt { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #fff; text-align: center; }
    .j-txt b { display: flex; align-items: center; gap: 10px; font-size: 40px; line-height: 1; }
    .j-txt b .icono { width: 34px; height: 34px; }
    .j-txt span { margin-top: 6px; font-size: 24px; font-weight: 700; }
    .exc { position: absolute; left: ${1088 - B.x - 100}px; top: ${DONA.y - B.y + 18}px; width: 200px; text-align: center; font-size: 22px; font-weight: 800; color: ${COLOR.azul}; white-space: nowrap; }
    .dona { position: absolute; left: ${DONA.x - B.x - 100}px; top: ${DONA.y - B.y - 100}px; width: 200px; height: 200px; }
    .dona svg { position: absolute; inset: 0; width: 100%; height: 100%; transform: rotate(-90deg); }
    .dona circle { fill: none; stroke-width: 26; }
    .dona .pista { stroke: #E3E8F2; }
    .dona .base { stroke: ${COLOR.azul}; stroke-dasharray: 100 100; }
    .dona .cripto { stroke: ${COLOR.amarillo}; }
    .dona .centro { position: absolute; left: 70px; top: 70px; width: 60px; height: 60px; display: grid; place-items: center; }
    .dona .centro .icono { width: 40px; height: 40px; }
    .partes { position: absolute; left: ${1384 - B.x}px; top: ${JARRO.y - B.y - 8}px; display: flex; flex-direction: column; gap: 12px; }
    .parte { display: flex; align-items: center; gap: 12px; font-size: 25px; font-weight: 700; color: ${COLOR.noche}; white-space: nowrap; }
    .parte i { flex: none; width: 20px; height: 20px; border-radius: 6px; }
    .parte b { color: ${COLOR.azul}; font-weight: 800; }
    .gob { display: flex; flex-direction: column; gap: 2px; margin-top: 4px; font-size: 22px; font-weight: 600; color: ${COLOR.suave}; }

    /* Ganancias e inversión */
    .gan { position: absolute; left: ${GAN.x}px; top: ${GAN.y}px; width: 0; height: 0; }
    .gan .disco { position: absolute; left: -${GAN.r}px; top: -${GAN.r}px; width: ${2 * GAN.r}px; height: ${2 * GAN.r}px; border-radius: 50%; background: ${COLOR.amarillo}; display: grid; place-items: center; box-shadow: 0 0 0 10px #fff, 0 22px 44px rgba(14,29,54,.2); }
    .gan .disco .icono { width: 88px; height: 88px; filter: brightness(.62); }
    .gan-l { position: absolute; left: ${GAN.x - 150}px; top: ${GAN.y + GAN.r + 26}px; width: 300px; text-align: center; }
    .gan-l b { display: block; font-size: 36px; color: ${COLOR.noche}; }
    .gan-l span { display: block; margin-top: 4px; font-size: 22px; font-weight: 600; color: ${COLOR.suave}; }
    .inv { position: absolute; left: ${INV.x}px; top: ${INV.y}px; width: ${INV.w}px; height: ${INV.h}px; display: flex; align-items: center; gap: 12px; padding: 0 22px 0 10px; border-radius: 999px; background: ${COLOR.noche}; color: #fff; font-size: 28px; box-shadow: 0 10px 22px rgba(14,29,54,.22); }
    .inv .ic { display: grid; place-items: center; width: 42px; height: 42px; border-radius: 50%; background: ${COLOR.amarillo}; }
    .inv .ic .icono { width: 26px; height: 26px; filter: brightness(.62); }
    .alplan { position: absolute; left: 404px; top: ${INV.y - 26}px; font-size: 22px; font-weight: 800; color: ${COLOR.azul}; white-space: nowrap; }
    .nunca { position: absolute; left: ${INV.x}px; top: ${INV.y + INV.h + 14}px; width: ${INV.w}px; display: flex; align-items: center; gap: 12px; padding: 10px 16px 10px 10px; border-radius: 22px; background: #fff; box-shadow: 0 8px 18px rgba(14,29,54,.12), 0 0 0 2px ${COLOR.noche}; font-size: 22px; font-weight: 800; line-height: 1.2; color: ${COLOR.noche}; }
    .nunca small { display: block; font-size: 20px; font-weight: 600; color: ${COLOR.suave}; }
    .nunca .ic { flex: none; display: grid; place-items: center; width: 40px; height: 40px; border-radius: 50%; background: ${COLOR.noche}; }
    .nunca .no { width: 28px; height: 28px; display: block; }

    /* Corrientes, monedas y foco */
    .flujo { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; overflow: visible; z-index: 5; pointer-events: none; }
    .cauce { fill: none; stroke: rgba(31,87,168,.08); stroke-width: 16; stroke-linecap: round; stroke-dasharray: 1000 1000; stroke-dashoffset: 1000; }
    .via { fill: none; stroke: #9FB2D2; stroke-width: 4; stroke-linecap: round; stroke-dasharray: 1000 1000; stroke-dashoffset: 1000; }
    .moneda { position: absolute; left: 0; top: 0; width: 34px; height: 34px; margin: -17px 0 0 -17px; border-radius: 50%; background: ${COLOR.amarillo}; box-shadow: inset 0 -4px 0 #D9A21E, 0 5px 12px rgba(14,29,54,.25); display: grid; place-items: center; font-weight: 900; font-size: 20px; color: ${COLOR.noche}; opacity: 0; z-index: 8; }
    .marco { position: absolute; border-radius: 36px; border: 5px solid ${COLOR.amarillo}; box-shadow: 0 0 0 6px rgba(255,201,60,.22), 0 0 30px rgba(255,201,60,.45); z-index: 6; }
  `,
  html: (c) => {
    const tope = Math.max(0, Math.min(100, c.valor('POL-CRIPTO-MAX') ?? 0));
    const monedas = VIAS.map((_, i) => Array.from({ length: MONEDAS[i]! }, () => `<div class="moneda m${i}">$</div>`).join('')).join('');
    return `
      <div class="fondo"></div>
      <div class="carta ca" style="left:${A.x}px;top:${A.y}px;width:${A.w}px;height:${A.h}px">
        <div class="cab t" style="left:36px;top:26px"><span class="ic">${c.icono('cohete')}</span>Reinvertir para crecer</div>
        <div class="cond">${c.icono('balanza')}<span>mientras el <b>CAC</b> sea menor que el <b>LTV</b></span></div>
        <div class="usos">
          <div class="uso"><span class="ic">${c.icono('megafono')}</span>Marketing e IA</div>
          <div class="uso"><span class="ic">${c.icono('herramienta')}</span>Herramientas<br>por oficio</div>
          <div class="uso"><span class="ic">${c.icono('escuela')}</span>Formación y<br>nuevas ciudades</div>
        </div>
        <div class="baldosa">
          <div class="mov h-llave" style="left:6px;bottom:4px;width:146px;height:146px">${c.pj('llave', '', 146)}</div>
          <div class="mov h-eng" style="left:154px;bottom:8px;width:134px;height:134px">${c.pj('engranaje', '', 134)}</div>
        </div>
      </div>
      <div class="carta cb" style="left:${B.x}px;top:${B.y}px;width:${B.w}px;height:${B.h}px">
        <div class="cab t" style="left:36px;top:24px"><span class="ic">${c.icono('escudo')}</span>Una tesorería que protege</div>
        <div class="jarro"><div class="liquido"></div><div class="j-txt"><b class="t">${c.icono('candado', 'blanco')}${c.cifra('POL-CAJA-MESES')} meses</b><span>de costos guardados</span></div></div>
        <div class="mov h-grifo" style="left:${864 - B.x}px;top:${JARRO.y + JARRO.h - B.y - 124}px;width:124px;height:124px">${c.pj('grifo', '', 124)}</div>
        <div class="exc">solo excedentes</div>
        <div class="dona"><svg viewBox="0 0 200 200"><circle class="pista" cx="100" cy="100" r="${DONA.r}" pathLength="100"/><circle class="base" cx="100" cy="100" r="${DONA.r}" pathLength="100" style="stroke-dasharray:${100 - tope} 100"/><circle class="cripto" cx="100" cy="100" r="${DONA.r}" pathLength="100" style="stroke-dasharray:${tope} 100;stroke-dashoffset:${-(100 - tope)}"/></svg><div class="centro">${c.icono('banco')}</div></div>
        <div class="partes">
          <div class="parte p1"><i style="background:${COLOR.azul}"></i>Bonos, ETFs y acciones</div>
          <div class="parte p2"><i style="background:${COLOR.amarillo}"></i><span>Cripto: tope del <b>${c.cifra('POL-CRIPTO-MAX')}</b></span></div>
          <div class="gob"><span>Aprobada por el directorio</span><span>Sin rendimientos prometidos</span></div>
        </div>
      </div>
      <div class="gan"><div class="disco">${c.icono('alcancia')}</div></div>
      <div class="gan-l"><b class="t">Ganancias</b><span>después de costos</span></div>
      <div class="inv t"><span class="ic">${c.icono('dolar')}</span>Inversión</div>
      <div class="alplan">al plan</div>
      <div class="nunca"><span class="ic">${prohibido}</span><span>Nunca a cripto<small>ni a la tesorería</small></span></div>
      <svg class="flujo" viewBox="0 0 1920 1080">${VIAS.map((v, i) => `<path class="cauce c${i}" d="${v.d}" pathLength="1000"/><path class="via v${i}" d="${v.d}" pathLength="1000"/>`).join('')}</svg>
      ${monedas}
      <div class="marco" style="left:${FOCOS[0]![0]}px;top:${FOCOS[0]![1]}px;width:${FOCOS[0]![2]}px;height:${FOCOS[0]![3]}px"></div>
      <div class="encabezado"><div class="fila-k"><span class="kicker">Material extra · finanzas</span><span class="rotulo">Plan propuesto · a validar</span></div>
        <div class="titulo t"><span class="l"><span>Las ganancias <mark>trabajan dos veces</mark></span></span></div></div>
    `;
  },
  armar(tl, $, c) {
    const tope = Math.max(0, Math.min(100, c.valor('POL-CRIPTO-MAX') ?? 0));
    // 0 · encabezado, ganancias y reinvertir
    tl.fromTo($('.encabezado .kicker'), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.05);
    tl.fromTo($('.rotulo'), { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, 0.45);
    entraTitulo(tl, $.all('.encabezado .l > span'), 0.1);
    tl.fromTo($('.gan .disco'), { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'back.out(1.9)' }, 0.35);
    tl.fromTo($('.gan-l'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' }, 0.55);
    tl.fromTo($('.ca'), { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: 'power3.out' }, 0.7);
    tl.fromTo($('.ca .cond'), { autoAlpha: 0, x: -16 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: 'power3.out' }, 1.0);
    tl.fromTo($.all('.uso'), { autoAlpha: 0, y: 26, scale: 0.9 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(2)', stagger: 0.1 }, 1.15);
    tl.fromTo([$('.h-llave'), $('.h-eng')], { autoAlpha: 0, y: 40, scale: 0.6 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(2.2)', stagger: 0.1 }, 0.95);
    // Marco: señala el foco de cada paso
    const marco = $('.marco');
    tl.fromTo(marco, { autoAlpha: 0, scale: 1.03 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'power3.out' }, 1.0);
    [3.45, 6.5, 9.65].forEach((t, k) => {
      const [left, top, width, height] = FOCOS[k + 1]!;
      tl.to(marco, { left, top, width, height, duration: 0.5, ease: 'power3.inOut' }, t);
    });
    // Corrientes: se dibujan y empiezan a llevar monedas
    VIAS.forEach((_, i) => tl.fromTo([$(`.c${i}`), $(`.v${i}`)], { strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: D_VIA[i]!, ease: 'power1.inOut' }, T_VIA[i]!));

    // 1 · la tesorería: primero se llena la caja con los meses de costos
    tl.fromTo($('.cb'), { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: 'power3.out' }, 3.3);
    tl.fromTo($('.h-grifo'), { autoAlpha: 0, y: 40, scale: 0.6 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(2.2)' }, 3.55);
    tl.fromTo($('.liquido'), { scaleY: 0 }, { scaleY: 1, duration: T_LLENA[1]! - T_LLENA[0]!, ease: 'power1.inOut' }, T_LLENA[0]!);
    tl.fromTo($('.j-txt'), { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2.2)' }, T_LLENA[1]! - 0.15);
    tl.fromTo($('.jarro'), { scale: 1 }, { scale: 1.05, duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out', immediateRender: false }, T_LLENA[1]!);

    // 2 · el excedente pasa a una tesorería diversificada (con tope para cripto)
    tl.fromTo($('.exc'), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power3.out' }, 6.6);
    tl.fromTo($('.dona'), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(1.8)' }, 6.95);
    tl.fromTo($('.dona .base'), { strokeDashoffset: 100 - tope }, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' }, 7.1);
    tl.fromTo($('.dona .cripto'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 7.85);
    tl.fromTo($('.dona .centro'), { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(2.4)' }, 7.3);
    tl.fromTo($('.p1'), { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: 'power3.out' }, 7.35);
    tl.fromTo($('.p2'), { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: 'power3.out' }, 7.95);
    tl.fromTo($('.gob'), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' }, 8.45);

    // 3 · la inversión va al plan, nunca a cripto
    tl.fromTo($('.inv'), { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.45, ease: 'back.out(1.6)' }, 9.7);
    tl.fromTo($('.alplan'), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power3.out' }, 10.2);
    tl.fromTo($('.nunca'), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(2.2)' }, 10.55);

    // Poses: Llave y Engranaje trabajan y festejan cuando llega la plata; Grifo (la válvula) cerrado hasta que la caja está llena
    const [llave, eng, grifo] = [$('.h-llave .pj'), $('.h-eng .pj'), $('.h-grifo .pj')];
    const ultima = new Map<HTMLElement, Pose>();
    const poner = (el: HTMLElement, p: Pose) => {
      if (ultima.get(el) !== p) {
        ultima.set(el, p);
        pose(el, p);
      }
    };
    const llega0 = T_VIA[0]! + D_VIA[0]! + 0.45;
    c.pintor((t) => {
      const equipo: Pose = t >= T_PLAN ? 'c' : t >= MARCAS[1]! ? 'a' : t >= llega0 ? 'c' : t >= T_VIA[0]! ? 'd' : 'b';
      poner(llave, equipo);
      poner(eng, equipo);
      poner(grifo, t >= MARCAS[3]! ? 'a' : t >= 7.9 ? 'c' : t >= T_SALE ? 'd' : t >= 3.9 ? 'a' : 'b');
    });
  },
  ambiente(t, $, tl) {
    // Monedas por cada corriente ya dibujada (dueño: el ambiente)
    VIAS.forEach((v, i) => {
      const f = tramo(tl, T_VIA[i]!, T_VIA[i]! + D_VIA[i]!);
      const n = MONEDAS[i]!;
      $.all(`.m${i}`).forEach((m, k) => {
        const s = (t * VEL + (k * v.largo) / n) % v.largo;
        const visible = f > 0 && s <= f * v.largo;
        const cierre = tramo(s, v.largo - 26, v.largo);
        const entra = 1 - tramo(s, 0, 18);
        const [x, y] = v.en(s);
        m.style.opacity = visible ? String((1 - cierre) * (1 - entra * 0.6)) : '0';
        m.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${(1 - cierre * 0.5).toFixed(3)})`;
      });
    });
    // Respiración de los Handys
    $.all('.mov .pj').forEach((p, i) => (p.style.transform = `scaleY(${(1 + Math.sin(t * 2.4 + i) * 0.02).toFixed(4)})`));
  },
});
