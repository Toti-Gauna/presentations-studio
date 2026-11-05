// Anexo de respaldo · Cada dólar de la inversión (propuesta de uso, a aprobar). Un paso por clic:
// 0 la inversión buscada (no recibida) y su reparto: misma barra, colores e íconos que la diapositiva 7 ·
// 1 marketing y captación: publicidad hecha con IA (Seedance 2.5) en las redes, carteles en postes y volantes en los
//   locales, remeras con el Handy de cada oficio y porteros y administradores ·
// 2 operaciones: el camino del profesional (formación, verificación, cobros) con soporte en todo el recorrido ·
// 3 tecnología: HandIA premium y para profesionales, herramientas por oficio y servidores; y legal, contable y reserva.
// Desde el paso 1 la barra queda chica arriba a la derecha y marca la parte del paso. Cada viñeta lleva una sola cifra.
// La franja y 880–950 queda libre (leyenda del kit) y la de abajo (y > 960), para subtítulos.
import type { gsap } from 'gsap';
import { COLOR, entraTitulo, escena, pose, tramo, type Kit, type Personaje, type Pose } from './comun/kit.ts';

const MARCAS = [0, 3.0, 7.0, 10.4, 14.0];
const M1 = 3.0;
const M2 = 7.0;
const M3 = 10.4;

interface Parte { id: string; ic: string; blanco: boolean; color: string; tinta: string; nombre: string; que: string; para: string }
const PARTES: Parte[] = [
  { id: 'INV-MARKETING', ic: 'megafono', blanco: true, color: COLOR.azul, tinta: '#fff', nombre: 'Marketing y captación', que: 'Publicidad con IA, redes y calle', para: 'Que más vecinos conozcan Handyx y lo pidan' },
  { id: 'INV-OPERACIONES', ic: 'escuela', blanco: true, color: COLOR.verde, tinta: '#fff', nombre: 'Operaciones', que: 'Formar y acompañar a los profesionales', para: 'Formar y acompañar a los profesionales' },
  { id: 'INV-TECNOLOGIA', ic: 'cerebro', blanco: false, color: COLOR.amarillo, tinta: COLOR.noche, nombre: 'Tecnología', que: 'HandIA y herramientas por oficio', para: 'Una app que mejora y se diferencia' },
  { id: 'INV-LEGAL', ic: 'balanza', blanco: false, color: '#CBD5E6', tinta: COLOR.noche, nombre: 'Legal, contable y reserva', que: 'Papeles en regla y un colchón', para: '' },
];

// Barra del reparto: grande en el paso 0; desde el paso 1, chica arriba a la derecha (escala uniforme, sin deformar).
const BAR = { x: 96, y: 414, w: 1728, h: 96, pad: 6, gap: 6 };
const MINI = { x: 1040, y: 106, w: 784 };
const ESC = MINI.w / BAR.w;
function segmentos(c: Kit): Array<{ x: number; w: number }> {
  const v = PARTES.map((p) => Math.max(0, c.valor(p.id) ?? 0));
  const suma = v.reduce((a, b) => a + b, 0) || 1;
  const util = BAR.w - 2 * BAR.pad - (PARTES.length - 1) * BAR.gap;
  let x = BAR.pad;
  return v.map((val) => {
    const s = { x, w: (util * val) / suma };
    x += s.w + BAR.gap;
    return s;
  });
}
/** Centro (x de pantalla) de la parte i en la barra chica, para la marca que la señala. */
const centroMini = (s: { x: number; w: number }) => MINI.x + (s.x + s.w / 2) * ESC;

// Paso 1 · viñetas de marketing (centros x) sobre la vereda (y 756); epígrafes en y 784.
const PISO = 756;
const V1 = 296; // celular con la publicidad
const V2 = 766; // poste con cartel y local con volantes
const V3 = 1210; // remera
const V4 = 1640; // edificio con portero
const CEL = 0.62; // escala del celular de la publicidad (texto de adentro ≥ 20 px en pantalla)

// Paso 2 · el camino del profesional
const RUTA = { x: 220, y: 556, w: 1480 };
const PARADAS = [
  { x: 400, ic: 'escuela', id: 'INV-O-FORMACION', txt: 'Formación y comunicación' },
  { x: 960, ic: 'escudo-ok', id: 'INV-O-VERIF', txt: 'Verificación de profesionales' },
  { x: 1520, ic: 'billetera', id: 'INV-O-COBROS', txt: 'Cobros y pasarela' },
];
const R_PARADA = 58;
// Los profesionales recorren el camino: Llave adelante; Gota y Medidor detrás. Cada uno cae en la primera parada y salta
// a la siguiente cuando el de adelante la dejó libre (saltos = instantes en que sale hacia la parada siguiente).
interface Viajero { pj: Personaje; alto: number; cae: number; saltos: number[] }
const VIAJEROS: Viajero[] = [
  { pj: 'llave', alto: 136, cae: 7.7, saltos: [8.45, 9.05] },
  { pj: 'gota', alto: 116, cae: 8.6, saltos: [9.2] },
  { pj: 'medidor_gas', alto: 116, cae: 9.35, saltos: [] },
];
const D_SALTO = 0.5;
const D_CAE = 0.6;
const FIESTA2 = 9.95;
/** Rebote al caer (como bounce.out): 0 → 1. */
function rebote(k: number): number {
  const n = 7.5625;
  const d = 2.75;
  if (k < 1 / d) return n * k * k;
  if (k < 2 / d) return n * (k - 1.5 / d) ** 2 + 0.75;
  if (k < 2.5 / d) return n * (k - 2.25 / d) ** 2 + 0.9375;
  return n * (k - 2.625 / d) ** 2 + 0.984375;
}

// Paso 3 · celulares (escala) y centros
const TEL = 0.56;
const T1 = 320; // HandIA premium (demo)
const T2 = 748; // herramientas por oficio (diseño propuesto)
const T3 = 1150; // servidores
const T4 = 1640; // legal, contable y reserva

const tilde = `<svg class="tilde" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="${COLOR.verde}"/><path d="M6.8 12.4l3.3 3.3 7-7" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const REMERA = 'M96 14 L58 26 L10 66 L40 114 L72 98 L72 252 L228 252 L228 98 L260 114 L290 66 L242 26 L204 14 Q150 54 96 14 Z';

export default escena({
  marcas: MARCAS,
  leyendas: ['La inversión buscada: **cómo se reparte**', 'Marketing: **publicidad con IA, redes y calle**', 'Operaciones: **formar y acompañar a los profesionales**', 'Tecnología: **una app que se diferencia**'],
  css: `
    .fondo { position: absolute; inset: 0; background: ${COLOR.hueso}; }
    .halo { position: absolute; left: 960px; top: 600px; width: 1700px; height: 1700px; margin: -850px 0 0 -850px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,.95), rgba(255,255,255,0) 62%); }
    .encabezado { position: absolute; left: 96px; top: 50px; }
    .krow { display: flex; align-items: center; gap: 18px; }
    .rotulo { display: inline-flex; align-items: center; padding: 5px 14px; border-radius: 999px; border: 2px dashed rgba(31,87,168,.5); background: #fff; font-weight: 700; font-size: 20px; color: ${COLOR.azulOscuro}; white-space: nowrap; }
    .encabezado .titulo { margin-top: 12px; font-size: 60px; color: ${COLOR.azulOscuro}; }
    .mov { position: absolute; transform-origin: 50% 100%; }
    .pj { transform-origin: 50% 100%; }

    /* 0 · total, barra y partes */
    .total { position: absolute; left: 96px; top: 210px; }
    .total .n { font-size: 112px; line-height: 1; color: ${COLOR.azulOscuro}; white-space: nowrap; }
    .total .lbl { margin-top: 12px; font-size: 30px; font-weight: 800; color: ${COLOR.noche}; white-space: nowrap; }
    .total .lbl span { color: ${COLOR.suave}; font-weight: 700; }
    .barra { position: absolute; left: ${BAR.x}px; top: ${BAR.y}px; width: ${BAR.w}px; height: ${BAR.h}px; border-radius: 24px; background: #E2E7F0; transform-origin: 0 0; }
    .seg { position: absolute; top: ${BAR.pad}px; height: ${BAR.h - 2 * BAR.pad}px; }
    .seg .relleno { position: absolute; inset: 0; border-radius: 18px; transform-origin: 0 50%; }
    .seg .icono { position: absolute; left: 50%; top: 50%; width: 42px; height: 42px; margin: -21px 0 0 -21px; }
    .mini-cap { position: absolute; right: 96px; top: 58px; font-size: 22px; font-weight: 700; color: ${COLOR.suave}; white-space: nowrap; }
    .mini-cap b { color: ${COLOR.azulOscuro}; font-weight: 800; }
    .marca { position: absolute; left: 0; top: ${MINI.y + BAR.h * ESC + 8}px; width: 0; height: 0; border: 10px solid transparent; border-bottom: 13px solid ${COLOR.azulOscuro}; border-top: 0; margin-left: -10px; }
    .cartas { position: absolute; left: 96px; top: 560px; width: 1728px; display: flex; gap: 24px; }
    .carta { flex: 1 1 0; height: 222px; padding: 22px 26px; }
    .carta .cab { display: flex; align-items: center; gap: 16px; }
    .cuadro { flex: none; display: grid; place-items: center; border-radius: 18px; }
    .carta .cuadro { width: 64px; height: 64px; }
    .carta .cuadro .icono { width: 34px; height: 34px; }
    .carta .cifra { font-size: 40px; white-space: nowrap; color: ${COLOR.noche}; }
    .carta .nombre { margin-top: 16px; font-size: 26px; font-weight: 800; color: ${COLOR.noche}; }
    .carta .que { margin-top: 4px; font-size: 22px; font-weight: 600; line-height: 1.25; color: ${COLOR.texto}; }

    /* encabezado de cada parte (pasos 1 a 3) */
    .partes { position: absolute; left: 96px; top: 186px; width: 1100px; height: 104px; }
    .cp { position: absolute; left: 0; top: 0; display: flex; align-items: center; gap: 22px; }
    .cp .cuadro { width: 96px; height: 96px; border-radius: 26px; }
    .cp .cuadro .icono { width: 50px; height: 50px; }
    .cp .fila { display: flex; align-items: center; gap: 18px; }
    .cp .nom { font-size: 46px; color: ${COLOR.noche}; white-space: nowrap; }
    .cp .monto { padding: 6px 18px 8px; border-radius: 16px; font-size: 36px; white-space: nowrap; }
    .cp .para { margin-top: 6px; font-size: 25px; font-weight: 700; color: ${COLOR.suave}; white-space: nowrap; }

    /* epígrafes: una cifra y qué compra */
    .pie { position: absolute; top: 782px; width: 0; }
    .pie .in { position: absolute; left: 0; top: 0; transform: translateX(-50%); text-align: center; white-space: nowrap; }
    .pie b { display: block; font-size: 32px; line-height: 1.05; }
    .pie span { display: block; margin-top: 4px; font-size: 24px; font-weight: 800; color: ${COLOR.noche}; }
    .s1 .pie b { color: ${COLOR.azul}; } .s2 .pie b, .s2 b.verde { color: ${COLOR.verde}; } .s3 .pie b { color: ${COLOR.azulOscuro}; }

    /* 1 · marketing */
    .s1, .s2, .s3 { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
    .vereda { position: absolute; left: 540px; top: ${PISO}px; width: 1284px; height: 8px; border-radius: 4px; background: #DCE2EC; }
    .telAd { left: ${V1 - (340 * CEL) / 2}px; top: 306px; width: ${340 * CEL}px; height: ${730 * CEL}px; }
    .esc { position: absolute; left: 0; top: 0; width: 340px; height: 730px; transform-origin: 0 0; }
    .telAd .esc { transform: scale(${CEL}); }
    .ad { position: absolute; inset: 0; background: ${COLOR.azul}; overflow: hidden; }
    .ad-luz { position: absolute; left: 158px; top: 268px; width: 380px; height: 380px; margin: -190px 0 0 -190px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,.2), rgba(255,255,255,0) 66%); }
    .ad-ia { position: absolute; left: 50%; top: 60px; transform: translateX(-50%); display: flex; align-items: center; gap: 8px; padding: 6px 16px 6px 12px; border-radius: 999px; background: rgba(255,255,255,.18); color: #fff; font-weight: 800; font-size: 33px; white-space: nowrap; }
    .ad-ia .icono { width: 32px; height: 32px; }
    .ad-roto, .ad-grifo { position: absolute; left: 22px; top: 158px; width: 168px; height: 196px; display: flex; align-items: flex-end; justify-content: center; }
    .ad-roto img, .ad-grifo img { max-width: 100%; max-height: 100%; }
    .ad-gota { left: 170px; top: 206px; width: 140px; height: 140px; }
    .ad-tit { position: absolute; left: 0; right: 0; top: 386px; text-align: center; font-size: 46px; font-stretch: 100%; color: #fff; line-height: 1.04; }
    .ad-logo { position: absolute; left: 50%; top: 512px; width: 226px; height: 72px; margin-left: -113px; border-radius: 22px; background: #fff; display: grid; place-items: center; box-shadow: 0 6px 0 ${COLOR.azulOscuro}; }
    .ad-logo img { height: 46px; display: block; }
    .ad-prog { position: absolute; left: 26px; right: 26px; bottom: 34px; height: 8px; border-radius: 4px; background: rgba(255,255,255,.28); overflow: hidden; }
    .ad-prog i { position: absolute; inset: 0; background: #fff; transform-origin: 0 50%; }
    .red { position: absolute; width: 74px; height: 74px; }
    .red .bola { position: absolute; inset: 0; border-radius: 50%; background: #fff; display: grid; place-items: center; box-shadow: 0 10px 22px rgba(14,29,54,.16), 0 3px 0 ${COLOR.borde}; }
    .red .icono { width: 36px; height: 36px; }
    .poste { position: absolute; left: 586px; top: 380px; width: 16px; height: ${PISO - 380}px; border-radius: 8px 8px 0 0; background: #AEB9CB; transform-origin: 50% 100%; }
    .poste::before { content: ''; position: absolute; left: 6px; top: 6px; width: 78px; height: 10px; border-radius: 5px; background: #AEB9CB; }
    .poste::after { content: ''; position: absolute; left: 62px; top: 14px; width: 40px; height: 20px; border-radius: 4px 4px 20px 20px; background: ${COLOR.amarillo}; box-shadow: 0 6px 18px rgba(255,201,60,.55); }
    .cartel { position: absolute; left: 526px; top: 448px; width: 136px; height: 176px; border-radius: 10px; background: #fff; box-shadow: 0 10px 22px rgba(14,29,54,.16); transform: rotate(-3deg); }
    .cartel .cara { position: absolute; left: 10px; right: 10px; top: 10px; height: 112px; border-radius: 8px; background: ${COLOR.celeste}; display: flex; align-items: flex-end; justify-content: center; overflow: hidden; }
    .cartel .cara img { height: 100px; display: block; }
    .cartel .lg { position: absolute; left: 0; right: 0; bottom: 14px; text-align: center; }
    .cartel .lg img { height: 30px; display: inline-block; }
    .cinta { position: absolute; top: -8px; width: 44px; height: 16px; background: rgba(255,201,60,.75); }
    .cinta.i { left: -10px; transform: rotate(-24deg); } .cinta.d { right: -10px; transform: rotate(24deg); }
    .local { position: absolute; left: 744px; top: 470px; width: 252px; height: ${PISO - 470}px; transform-origin: 50% 100%; }
    .local .techo { position: absolute; left: -8px; right: -8px; top: 0; height: 20px; border-radius: 6px; background: ${COLOR.azulOscuro}; }
    .local .toldo { position: absolute; left: -4px; right: -4px; top: 20px; height: 34px; border-radius: 0 0 10px 10px; background: repeating-linear-gradient(90deg, ${COLOR.amarillo} 0 28px, #fff 28px 56px); box-shadow: 0 4px 0 rgba(14,29,54,.08); }
    .local .frente { position: absolute; left: 0; right: 0; top: 54px; bottom: 0; background: #fff; box-shadow: 0 14px 30px rgba(14,29,54,.12); }
    .local .ventana { position: absolute; left: 22px; top: 22px; width: 208px; height: 112px; border-radius: 10px; background: ${COLOR.azulOscuro}; }
    .local .mostrador { position: absolute; left: 10px; top: 128px; width: 232px; height: 16px; border-radius: 5px; background: #C9D2E1; }
    .local .zocalo { position: absolute; left: 22px; right: 22px; bottom: 18px; height: 40px; border-radius: 8px; background: ${COLOR.celeste}; display: grid; place-items: center; }
    .local .zocalo .icono { width: 26px; height: 26px; }
    .volante { position: absolute; width: 62px; height: 80px; border-radius: 5px; background: #fff; box-shadow: 0 4px 10px rgba(14,29,54,.28); overflow: hidden; }
    .volante .ban { position: absolute; left: 0; right: 0; top: 0; height: 26px; background: ${COLOR.azul}; }
    .volante img { position: absolute; left: 50%; bottom: 6px; height: 40px; transform: translateX(-50%); }
    .vol1 { left: 878px; top: ${470 + 54 + 128 - 80}px; } .vol2 { left: 854px; top: ${470 + 54 + 128 - 76}px; transform: rotate(-6deg); }
    .percha { position: absolute; left: ${V3 - 150}px; top: 432px; width: 300px; height: 290px; transform-origin: 50% 0; }
    .percha svg { position: absolute; left: 0; top: 30px; width: 300px; height: 260px; overflow: visible; filter: drop-shadow(0 12px 18px rgba(14,29,54,.16)); }
    .percha .gancho { position: absolute; left: 138px; top: 0; width: 24px; height: 40px; border: 5px solid #AEB9CB; border-bottom: 0; border-radius: 14px 14px 0 0; }
    .tela { fill: #fff; stroke: #D5DCE7; stroke-width: 3; stroke-linejoin: round; }
    .cuello { fill: none; stroke: ${COLOR.azul}; stroke-width: 6; stroke-linecap: round; }
    .estampa { position: absolute; left: 50%; top: 116px; height: 112px; transform: translateX(-50%); }
    .oficio { position: absolute; left: 50%; top: 248px; transform: translateX(-50%); padding: 4px 14px; border-radius: 999px; background: ${COLOR.celeste}; color: ${COLOR.azulOscuro}; font-weight: 800; font-size: 20px; white-space: nowrap; }
    .edif { position: absolute; left: ${V4 - 100}px; top: 400px; width: 200px; height: ${PISO - 400}px; transform-origin: 50% 100%; }
    .edif .cornisa { position: absolute; left: -8px; right: -8px; top: 0; height: 18px; border-radius: 8px 8px 3px 3px; background: ${COLOR.noche}; }
    .edif .cuerpo { position: absolute; left: 0; right: 0; top: 18px; bottom: 0; background: ${COLOR.azulOscuro}; box-shadow: 0 14px 30px rgba(14,29,54,.16); }
    .edif .w { position: absolute; width: 30px; height: 36px; border-radius: 6px; background: #22467C; }
    .edif .w.on { background: #FFE9A8; box-shadow: 0 0 14px rgba(255,201,60,.45); }
    .edif .puerta { position: absolute; left: 50%; bottom: 0; width: 64px; height: 82px; margin-left: -32px; border-radius: 12px 12px 0 0; background: #CFE0FA; border: 6px solid #E6EEFB; border-bottom: 0; }
    .portero { position: absolute; left: ${V4}px; top: 694px; width: 0; height: 0; }
    .portero .chip { position: absolute; left: 0; top: 0; transform: translateX(-50%); font-size: 22px; padding: 8px 16px 8px 10px; }
    .foco-calle { left: 0; top: ${PISO - 118}px; width: 118px; height: 118px; }

    /* 2 · operaciones */
    .ruta { position: absolute; left: ${RUTA.x}px; top: ${RUTA.y - 5}px; width: ${RUTA.w}px; height: 10px; border-radius: 5px; background: #DCE2EC; transform-origin: 0 50%; }
    .ruta .lleno { position: absolute; inset: 0; border-radius: 5px; background: ${COLOR.verde}; transform-origin: 0 50%; }
    .parada { position: absolute; top: ${RUTA.y - R_PARADA}px; width: ${2 * R_PARADA}px; height: ${2 * R_PARADA}px; margin-left: -${R_PARADA}px; }
    .parada .disco { position: absolute; inset: 0; border-radius: 50%; background: #fff; display: grid; place-items: center; box-shadow: 0 12px 26px rgba(14,29,54,.14), 0 4px 0 ${COLOR.borde}; }
    .parada .icono { width: 54px; height: 54px; }
    .parada.ok .disco { background: ${COLOR.verde}; box-shadow: 0 12px 26px rgba(14,29,54,.14), 0 4px 0 #157A42; }
    .parada.ok .icono { filter: brightness(0) invert(1); }
    .s2 .pie { top: 640px; }
    .viajeros { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
    .soporte { position: absolute; left: ${RUTA.x}px; top: 756px; width: ${RUTA.w}px; height: 88px; display: flex; align-items: center; gap: 18px; padding: 0 30px 0 16px; }
    .soporte .cuadro { width: 60px; height: 60px; background: ${COLOR.celeste}; border-radius: 16px; }
    .soporte .icono { width: 32px; height: 32px; }
    .soporte .txt { font-size: 26px; font-weight: 800; color: ${COLOR.noche}; white-space: nowrap; }
    .soporte .txt span { color: ${COLOR.suave}; font-weight: 700; }
    .soporte b { margin-left: auto; font-size: 36px; white-space: nowrap; }

    /* 3 · tecnología, legal y reserva */
    .tel { width: ${340 * TEL}px; height: ${730 * TEL}px; top: 344px; }
    .tel .esc { transform: scale(${TEL}); }
    .rot3 { position: absolute; top: 298px; width: 0; height: 0; }
    .rot3 span { position: absolute; left: 0; top: 0; transform: translateX(-50%); padding: 4px 14px; border-radius: 999px; border: 2px dashed rgba(31,87,168,.5); background: #fff; font-weight: 700; font-size: 20px; color: ${COLOR.azulOscuro}; white-space: nowrap; }
    .rack { position: absolute; left: ${T3 - 120}px; top: 486px; width: 170px; }
    .unidad { position: relative; height: 80px; margin-top: 10px; border-radius: 16px; background: ${COLOR.azulOscuro}; box-shadow: 0 10px 22px rgba(14,29,54,.16); }
    .unidad .ranura { position: absolute; left: 22px; top: 24px; width: 70px; height: 8px; border-radius: 4px; background: rgba(255,255,255,.22); }
    .unidad .ranura + .ranura { top: 44px; width: 52px; }
    .unidad .led { position: absolute; top: 30px; width: 16px; height: 16px; border-radius: 50%; background: ${COLOR.verde}; }
    .divisor { position: absolute; left: 1404px; top: 330px; width: 0; height: 520px; border-left: 3px dashed #C3CCDB; transform-origin: 50% 0; }
    .baldosa { position: absolute; top: 520px; width: 140px; }
    .baldosa .caja { width: 140px; height: 140px; border-radius: 30px; background: #fff; display: grid; place-items: center; box-shadow: 0 14px 30px rgba(14,29,54,.12), 0 5px 0 #D5DCE7; }
    .baldosa .icono { width: 68px; height: 68px; }
    .baldosa span { display: block; margin-top: 14px; text-align: center; font-size: 22px; font-weight: 800; color: ${COLOR.noche}; white-space: nowrap; }
    .s3 .pie.gris b { color: ${COLOR.noche}; }
    .tilde { width: 34px; height: 34px; display: block; }
  `,
  html: (c) => {
    const segs = segmentos(c);
    const ic = (p: Parte, cls = '') => c.icono(p.ic, `${p.blanco ? 'blanco' : ''} ${cls}`);
    const handy = (cls: string, nombre: Parameters<Kit['pj']>[0], x: number, piso: number, alto: number) =>
      `<div class="mov vivo ${cls}" style="left:${x - alto / 2}px;top:${piso - alto}px;width:${alto}px;height:${alto}px">${c.pj(nombre, '', alto)}</div>`;
    const pie = (x: number, id: string, txt: string, cls = '') => `<div class="pie ${cls}" style="left:${x}px"><div class="in"><b class="t">${c.cifra(id)}</b><span>${txt}</span></div></div>`;
    // Ventanas del edificio (encendidas al azar, determinista)
    let ventanas = '';
    for (let f = 0; f < 4; f++) for (let k = 0; k < 3; k++) ventanas += `<i class="w${c.azar() < 0.62 ? ' on' : ''}" style="left:${24 + k * 58}px;top:${40 + f * 52}px"></i>`;
    const ad = `<div class="ad"><div class="ad-luz"></div><div class="ad-ia">${c.icono('sparkles', 'blanco')}<span>Seedance 2.5</span></div>
      <div class="ad-roto">${c.img('rotos/cano.webp')}</div><div class="ad-grifo">${c.img('personajes/grifo-c.webp')}</div>
      <div class="mov ad-gota">${c.pj('gota', '', 140)}</div>
      <div class="ad-tit t">¿Se rompió<br>algo?</div><div class="ad-logo">${c.logo()}</div><div class="ad-prog"><i></i></div></div>`;
    return `
    <div class="fondo"></div><div class="halo"></div>

    <div class="total"><div class="n t">&nbsp;</div><div class="lbl">inversión inicial buscada · <span>todavía no recibida</span></div></div>
    <div class="mini-cap">Inversión buscada · <b>${c.cifra('INV-TOTAL')}</b></div>
    <div class="barra">${segs.map((s, i) => { const p = PARTES[i]!; return `<div class="seg" style="left:${s.x}px;width:${s.w}px"><i class="relleno" style="background:${p.color}"></i>${ic(p)}</div>`; }).join('')}</div>
    <i class="marca"></i>
    ${handy('h0 h-foco0', 'bombilla', 1452, BAR.y, 128)}${handy('h0 h-llave0', 'llave', 1592, BAR.y, 128)}${handy('h0 h-eng0', 'engranaje', 1740, BAR.y, 124)}
    <div class="cartas">${PARTES.map((p) => `<div class="carta tarjeta"><div class="cab"><span class="cuadro" style="background:${p.color}">${ic(p)}</span><span class="cifra t">${c.cifra(p.id)}</span></div><div class="nombre">${p.nombre}</div><div class="que">${p.que}</div></div>`).join('')}</div>

    <div class="partes">${PARTES.slice(0, 3).map((p, k) => `<div class="cp" data-k="${k}"><span class="cuadro" style="background:${p.color};box-shadow:0 6px 0 rgba(14,29,54,.14)">${ic(p)}</span><div><div class="fila"><span class="nom t">${p.nombre}</span><span class="monto t" style="background:${p.color};color:${p.tinta}">${c.cifra(p.id)}</span></div><div class="para">${p.para}</div></div></div>`).join('')}</div>

    <div class="s1">
      <div class="vereda"></div>
      <div class="mov telAd"><div class="esc">${c.celular(ad)}</div></div>
      ${['megafono', 'ubicacion', 'chat'].map((n, i) => `<div class="red r${i}" style="left:${V1 + 128}px;top:${352 + i * 110}px"><div class="bola">${c.icono(n)}</div></div>`).join('')}
      <div class="poste"></div>
      <div class="cartel"><i class="cinta i"></i><i class="cinta d"></i><div class="cara">${c.img('personajes/llave-b.webp')}</div><div class="lg">${c.logo()}</div></div>
      <div class="local"><div class="techo"></div><div class="toldo"></div><div class="frente"><div class="ventana"></div><div class="mostrador"></div><div class="zocalo">${c.icono('tienda')}</div></div></div>
      <div class="volante vol2"><i class="ban"></i>${c.img('personajes/llave-b.webp')}</div>
      <div class="volante vol1"><i class="ban"></i>${c.img('personajes/bombilla-c.webp')}</div>
      <div class="percha"><i class="gancho"></i><svg viewBox="0 0 300 260"><path class="tela" d="${REMERA}"/><path class="cuello" d="M104 18 Q150 52 196 18"/></svg>${c.img('personajes/gota-c.webp', 'estampa')}<span class="oficio">Plomería</span></div>
      <div class="edif"><div class="cornisa"></div><div class="cuerpo">${ventanas}<div class="puerta"></div></div></div>
      <div class="portero"><span class="chip">${c.icono('cliente-nuevo')}Portero</span></div>
      <div class="mov vivo foco-calle">${c.pj('bombilla', '', 118)}</div>
      ${pie(V1, 'INV-M-ADS', 'Publicidad con IA en las redes')}
      ${pie(V2, 'INV-M-LOCAL', 'Carteles en postes y volantes')}
      ${pie(V3, 'INV-M-HANDYS', 'Remeras con el Handy de su oficio')}
      ${pie(V4, 'INV-M-PORTEROS', 'Porteros y administradores')}
    </div>

    <div class="s2">
      <div class="ruta"><i class="lleno"></i></div>
      ${PARADAS.map((p) => `<div class="parada" style="left:${p.x}px"><div class="disco">${c.icono(p.ic)}</div></div>`).join('')}
      ${PARADAS.map((p) => pie(p.x, p.id, p.txt)).join('')}
      <div class="viajeros">${VIAJEROS.map((v, i) => `<div class="mov vivo viajero v${i}" style="left:${PARADAS[0]!.x - v.alto / 2}px;top:${RUTA.y - R_PARADA - v.alto}px;width:${v.alto}px;height:${v.alto}px">${c.pj(v.pj, '', v.alto)}</div>`).join('')}</div>
      <div class="soporte tarjeta"><span class="cuadro">${c.icono('chat')}</span><span class="txt">Soporte para vecinos y profesionales <span>· en todo el camino</span></span><b class="t verde">${c.cifra('INV-O-SOPORTE')}</b></div>
    </div>

    <div class="s3">
      <div class="mov tel telA" style="left:${T1 - (340 * TEL) / 2}px"><div class="esc">${c.celular(c.img('demo-landing/usuario-handia.webp', 'captura', 'Demo: HandIA arma el pedido'))}</div></div>
      <div class="mov tel telB" style="left:${T2 - (340 * TEL) / 2}px"><div class="esc">${c.celular(c.img('conceptos/herramientas-electricidad.webp', 'captura', 'Diseño propuesto: herramientas para electricistas con IA'))}</div></div>
      <div class="rot3 rA" style="left:${T1}px"><span>Demo · datos ficticios</span></div><div class="rot3 rB" style="left:${T2}px"><span>Diseño propuesto</span></div>
      <div class="rack">${[0, 1, 2].map(() => `<div class="unidad"><i class="ranura"></i><i class="ranura"></i><i class="led" style="right:26px"></i><i class="led" style="right:52px;background:${COLOR.amarillo}"></i></div>`).join('')}</div>
      ${handy('engr', 'engranaje', T3 + 120, PISO, 124)}
      <div class="divisor"></div>
      <div class="baldosa bL" style="left:${T4 - 160}px"><div class="caja">${c.icono('balanza')}</div><span>Legal y contable</span></div>
      <div class="baldosa bR" style="left:${T4 + 20}px"><div class="caja">${c.icono('alcancia')}</div><span>Reserva</span></div>
      ${pie(T1, 'INV-T-IA', 'HandIA premium y para profesionales')}
      ${pie(T2, 'INV-T-HERR', 'Herramientas por oficio')}
      ${pie(T3, 'INV-T-SERV', 'Servidores')}
      ${pie(T4, 'INV-LEGAL', 'Legal, contable y reserva', 'gris')}
    </div>

    <div class="encabezado"><div class="krow"><span class="kicker">Respaldo · inversión</span><span class="rotulo">Propuesta de uso · a aprobar</span></div>
      <div class="titulo t"><span class="l"><span>Para qué es <mark>cada dólar</mark></span></span></div></div>
  `;
  },
  armar(tl, $, c) {
    const segs = segmentos(c);
    const entra = (els: HTMLElement | HTMLElement[], t: number, o: gsap.TweenVars = {}) =>
      tl.fromTo(els, { autoAlpha: 0, y: 34, scale: 0.9 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.8)', ...o }, t);
    // Salida de un paso: todo junto y rápido, para que nada quede debajo de lo que entra
    const sale = (els: HTMLElement | HTMLElement[], t: number) => tl.to(els, { autoAlpha: 0, y: 20, duration: 0.26, ease: 'power2.in' }, t);

    // 0 · encabezado, total, barra que se llena por partes y las cuatro tarjetas
    tl.fromTo($('.halo'), { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 1.2, ease: 'power2.out' }, 0);
    tl.fromTo($('.krow'), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.05);
    entraTitulo(tl, $.all('.encabezado .l > span'), 0.1);
    tl.fromTo($('.total'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0.25);
    c.contador($('.total .n'), { t0: 0.35, dur: 1.5, hasta: c.valor('INV-TOTAL') ?? 0, antes: 'USD ' });
    tl.fromTo($('.barra'), { autoAlpha: 0, scaleX: 0.96 }, { autoAlpha: 1, scaleX: 1, duration: 0.4, ease: 'power2.out' }, 0.45);
    const rellenos = $.all('.seg .relleno');
    const iconos = $.all('.seg .icono');
    const T_SEG = [0.75, 1.15, 1.5, 1.8];
    rellenos.forEach((r, i) => {
      tl.fromTo(r, { scaleX: 0 }, { scaleX: 1, duration: 0.42, ease: 'power3.out' }, T_SEG[i] ?? 1);
      tl.fromTo(iconos[i]!, { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(2.6)' }, (T_SEG[i] ?? 1) + 0.18);
    });
    entra($.all('.carta'), 0.95, { stagger: 0.2 });
    tl.fromTo($.all('.h0'), { autoAlpha: 0, y: -70 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'bounce.out', stagger: 0.12 }, 1.6);

    // 1 · la barra se achica arriba a la derecha; la parte de marketing y lo que compra
    sale([...$.all('.carta'), $('.total')], M1);
    tl.to($.all('.h0'), { autoAlpha: 0, y: 40, scale: 0.7, duration: 0.22, ease: 'power2.in' }, M1);
    tl.to($('.barra'), { x: MINI.x - BAR.x, y: MINI.y - BAR.y, scale: ESC, duration: 0.55, ease: 'power3.inOut' }, M1 + 0.18);
    tl.fromTo($('.mini-cap'), { autoAlpha: 0, x: 20 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: 'power2.out' }, M1 + 0.6);
    const marca = $('.marca');
    const xs = segs.map(centroMini);
    tl.fromTo(marca, { autoAlpha: 0, x: xs[0] ?? 0, y: -8 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'back.out(2)' }, M1 + 0.8);
    // Resalta la parte activa: las demás quedan tenues (dueño de la opacidad de los rellenos: la línea de tiempo)
    const activa = (ks: number[], t: number) => rellenos.forEach((r, i) => tl.to(r, { opacity: ks.includes(i) ? 1 : 0.28, duration: 0.35 }, t));
    activa([0], M1 + 0.45);
    const cps = $.all('.cp');
    tl.fromTo(cps[0]!, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' }, M1 + 0.72);
    // viñetas de marketing, de izquierda a derecha
    tl.fromTo($('.telAd'), { autoAlpha: 0, y: 120, rotation: -8 }, { autoAlpha: 1, y: 0, rotation: -2, duration: 0.7, ease: 'back.out(1.3)' }, M1 + 0.5);
    tl.fromTo($.all('.red'), { autoAlpha: 0, scale: 0.2, x: -60 }, { autoAlpha: 1, scale: 1, x: 0, duration: 0.45, ease: 'back.out(2.2)', stagger: 0.12 }, M1 + 1.0);
    tl.fromTo($('.ad-gota'), { x: 220 }, { x: 0, duration: 0.55, ease: 'power2.out' }, M1 + 0.95);
    tl.fromTo($('.ad-roto'), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.3 }, M1 + 1.55);
    tl.fromTo($('.ad-grifo'), { autoAlpha: 0, scale: 0.7, transformOrigin: '50% 100%' }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2.4)' }, M1 + 1.6);
    tl.fromTo($('.ad-tit'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' }, M1 + 0.75);
    tl.fromTo($('.ad-logo'), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2.2)' }, M1 + 1.85);
    tl.fromTo($('.vereda'), { scaleX: 0, transformOrigin: '0 50%' }, { scaleX: 1, duration: 0.6, ease: 'power2.out' }, M1 + 0.7);
    tl.fromTo($('.poste'), { scaleY: 0 }, { scaleY: 1, duration: 0.5, ease: 'back.out(1.4)' }, M1 + 0.95);
    tl.fromTo($('.cartel'), { autoAlpha: 0, y: -40, rotation: -14 }, { autoAlpha: 1, y: 0, rotation: -3, duration: 0.5, ease: 'back.out(2)' }, M1 + 1.3);
    tl.fromTo($('.local'), { autoAlpha: 0, scaleY: 0.2 }, { autoAlpha: 1, scaleY: 1, duration: 0.5, ease: 'back.out(1.5)' }, M1 + 1.15);
    tl.fromTo($('.vol2'), { autoAlpha: 0, y: -70 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'bounce.out' }, M1 + 1.7);
    tl.fromTo($('.vol1'), { autoAlpha: 0, y: -70 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'bounce.out' }, M1 + 1.85);
    tl.fromTo($('.percha'), { autoAlpha: 0, y: -60, rotation: 10 }, { autoAlpha: 1, y: 0, rotation: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)' }, M1 + 1.6);
    tl.fromTo($('.edif'), { autoAlpha: 0, scaleY: 0 }, { autoAlpha: 1, scaleY: 1, duration: 0.55, ease: 'back.out(1.3)' }, M1 + 1.95);
    tl.fromTo($('.portero'), { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2.4)' }, M1 + 2.4);
    tl.fromTo($('.foco-calle'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, M1 + 1.45);
    tl.fromTo($('.foco-calle'), { x: 470 }, { x: 640, duration: 0.8, ease: 'power1.inOut' }, M1 + 1.5);
    const pies1 = $.all('.s1 .pie');
    [0.9, 1.55, 1.95, 2.45].forEach((d, i) => entra(pies1[i]!, M1 + d));

    // 2 · operaciones: el camino del profesional
    sale([...$.all('.s1 > *')], M2);
    tl.to(cps[0]!, { autoAlpha: 0, y: -26, duration: 0.26, ease: 'power2.in' }, M2);
    tl.fromTo(cps[1]!, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' }, M2 + 0.3);
    activa([1], M2 + 0.2);
    tl.to(marca, { x: xs[1] ?? 0, duration: 0.5, ease: 'power3.inOut' }, M2 + 0.2);
    tl.fromTo($('.ruta'), { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power2.out' }, M2 + 0.4);
    tl.fromTo($.all('.parada'), { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1, duration: 0.42, ease: 'back.out(2.4)', stagger: 0.16 }, M2 + 0.55);
    entra($.all('.s2 .pie'), M2 + 0.85, { stagger: 0.16 });
    // Los viajeros: la línea de tiempo los muestra; su lugar (caída y saltos) lo pinta un pintor
    const viajeros = $.all('.viajero');
    viajeros.forEach((el, i) => tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 }, VIAJEROS[i]!.cae));
    entra($('.soporte'), M2 + 1.2);
    const lleno = $('.ruta .lleno');
    const fr = (x: number) => (x - RUTA.x) / RUTA.w;
    const lider = VIAJEROS[0]!;
    tl.fromTo(lleno, { scaleX: 0 }, { scaleX: fr(PARADAS[0]!.x), duration: 0.4, ease: 'power2.out' }, lider.cae + 0.2);
    lider.saltos.forEach((t, k) => tl.to(lleno, { scaleX: fr(PARADAS[k + 1]!.x), duration: D_SALTO, ease: 'power1.inOut' }, t));

    // 3 · tecnología; al final, legal, contable y reserva, y toda la barra encendida
    sale([...$.all('.s2 > *')], M3);
    tl.to(cps[1]!, { autoAlpha: 0, y: -26, duration: 0.26, ease: 'power2.in' }, M3);
    tl.fromTo(cps[2]!, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' }, M3 + 0.3);
    activa([2], M3 + 0.2);
    tl.to(marca, { x: xs[2] ?? 0, duration: 0.5, ease: 'power3.inOut' }, M3 + 0.2);
    tl.fromTo($('.telA'), { autoAlpha: 0, y: 120, rotation: -8 }, { autoAlpha: 1, y: 0, rotation: -2, duration: 0.7, ease: 'back.out(1.3)' }, M3 + 0.35);
    tl.fromTo($('.telB'), { autoAlpha: 0, y: 120, rotation: 8 }, { autoAlpha: 1, y: 0, rotation: 2, duration: 0.7, ease: 'back.out(1.3)' }, M3 + 0.55);
    tl.fromTo([$('.rA'), $('.rB')], { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.12 }, M3 + 0.95);
    tl.fromTo($.all('.unidad'), { autoAlpha: 0, x: 60 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: 'back.out(1.6)', stagger: 0.1 }, M3 + 0.9);
    tl.fromTo($('.engr'), { autoAlpha: 0, y: -80 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'bounce.out' }, M3 + 1.15);
    const pies3 = $.all('.s3 .pie');
    [0.75, 0.95, 1.25].forEach((d, i) => entra(pies3[i]!, M3 + d));
    tl.fromTo($('.divisor'), { scaleY: 0 }, { scaleY: 1, duration: 0.5, ease: 'power2.out' }, M3 + 1.75);
    activa([2, 3], M3 + 1.85);
    tl.to(marca, { x: xs[3] ?? 0, duration: 0.45, ease: 'power3.inOut' }, M3 + 1.85);
    entra($.all('.baldosa'), M3 + 1.95, { stagger: 0.14 });
    entra(pies3[3]!, M3 + 2.25);
    activa([0, 1, 2, 3], M3 + 2.75);
    tl.to(marca, { autoAlpha: 0, duration: 0.3 }, M3 + 2.75);
    tl.fromTo($('.barra'), { scale: ESC }, { scale: ESC * 1.04, duration: 0.18, ease: 'power2.out', yoyo: true, repeat: 1, immediateRender: false }, M3 + 2.8);

    // Pintores: progreso de la publicidad, paradas alcanzadas y poses
    const prog = $('.ad-prog i');
    const paradas = $.all('.parada');
    const llegaA = [lider.cae + 0.3, ...lider.saltos.map((s) => s + D_SALTO)];
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
    const [foco0, llave0, eng0, gota, foco, engr] = ['.h-foco0', '.h-llave0', '.h-eng0', '.ad-gota', '.foco-calle', '.engr'].map(pj) as Array<(p: Pose) => void>;
    const posesV = viajeros.map((el) => poser(el.querySelector('.pj') as HTMLElement));
    const FIN0 = 2.3; // el reparto quedó completo
    const FIN3 = M3 + 2.75; // toda la barra encendida
    c.pintor((t) => {
      prog.style.transform = `scaleX(${Math.min(1, Math.max(0, (t - (M1 + 0.6)) / 3.2)).toFixed(3)})`;
      paradas.forEach((p, k) => p.classList.toggle('ok', t >= (llegaA[k] ?? 99)));
      foco0!(t >= FIN0 ? 'c' : 'b');
      llave0!(t >= FIN0 ? 'c' : 'b');
      eng0!(t >= FIN0 ? 'c' : 'b');
      gota!(t >= M1 + 1.55 ? 'c' : 'd');
      foco!(t >= M1 + 2.9 ? 'c' : t >= M1 + 2.3 ? 'b' : 'd');
      // Viajeros: caen con rebote en la primera parada y saltan en arco a la siguiente
      VIAJEROS.forEach((v, i) => {
        const el = viajeros[i]!;
        let parada = 0;
        let dx = 0;
        let dy = t < v.cae + D_CAE ? -120 * (1 - rebote(tramo(t, v.cae, v.cae + D_CAE))) : 0;
        let salta = false;
        v.saltos.forEach((s, j) => {
          if (t >= s + D_SALTO) parada = j + 1;
          else if (t >= s) {
            const k = (t - s) / D_SALTO;
            const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
            dx = (PARADAS[j + 1]!.x - PARADAS[j]!.x) * e;
            dy = -64 * Math.sin(Math.PI * k);
            salta = true;
          }
        });
        el.style.transform = `translate(${(PARADAS[parada]!.x - PARADAS[0]!.x + dx).toFixed(1)}px, ${dy.toFixed(1)}px)`;
        posesV[i]!(t >= FIESTA2 ? 'c' : salta ? 'd' : t < v.cae + D_CAE ? 'c' : 'b');
      });
      engr!(t >= FIN3 ? 'c' : t >= M3 + 1.7 ? 'd' : 'b');
    });
  },
  ambiente(t, $, tl) {
    // Respiración de los Handys vivos; Foco camina con un rebote (dueño: el ambiente; la línea mueve los contenedores)
    const camina = tl >= M1 + 1.5 && tl < M1 + 2.3;
    $.all('.vivo .pj').forEach((p, i) => {
      if (camina && p.parentElement?.classList.contains('foco-calle')) {
        const f = Math.sin((tl - M1 - 1.5) * 16);
        p.style.transform = `translateY(${(-Math.abs(f) * 10).toFixed(1)}px) rotate(${(f * 4).toFixed(1)}deg)`;
      } else p.style.transform = `scaleY(${(1 + Math.sin(t * 2.4 + i) * 0.02).toFixed(4)})`;
    });
    // Las redes flotan apenas; los leds titilan
    $.all('.red .bola').forEach((b, i) => (b.style.transform = `translateY(${(Math.sin(t * 1.8 + i * 1.4) * 5).toFixed(1)}px)`));
    $.all('.unidad .led').forEach((l, i) => (l.style.opacity = String(Math.sin(t * 3 + i * 1.7) > -0.2 ? 1 : 0.3)));
  },
});
