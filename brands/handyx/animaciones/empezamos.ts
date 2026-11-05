// Diapositiva 4 · Ya empezamos. Un golpe por frase del guion, con los Handys como protagonistas:
// 0 «Ya contamos con ambas aplicaciones desarrolladas y las estamos probando» → las dos apps llegan con su sello; Foco (vecino)
//   y Llave (especialista) saludan y festejan ·
// 1 «Con ayuda de porteros de distintos edificios, concretamos nuestros primeros trabajos…» → los edificios se encienden y de cada
//   puerta (con su portero) sale un Handy de otro oficio que salta hasta Llave: el contador suma uno por llegada ·
// 2 «…y cobramos nuestras primeras comisiones» → Foco sale de un edificio: monedas del usuario (Foco) y del profesional (Llave)
//   llegan a la alcancía de Handyx; especialistas registrados · 3 «Ahora queremos llevar esa experiencia más allá de los
//   edificios» → la ciudad se expande: Foco va a su casa, aparece un comercio con su aire, pines; el equipo festeja.
// La franja centrada entre y = 880 y 950 queda libre (solo la calle) para la leyenda por paso que agrega el kit.
import { COLOR, entraTitulo, escena, pose, tramo } from './comun/kit.ts';
import type { Kit, Personaje, Pose } from './comun/kit.ts';

const SUELO = 860; // línea de la vereda: todo lo importante queda arriba
const ABAJO = 1080 - SUELO;

interface Edif { x: number; w: number; h: number; cols: number; filas: number; tanque?: boolean }
const EDIF: Edif[] = [
  { x: 676, w: 190, h: 380, cols: 3, filas: 4 },
  { x: 890, w: 220, h: 400, cols: 3, filas: 4, tanque: true },
  { x: 1134, w: 170, h: 290, cols: 3, filas: 3 },
];
const VENT = { w: 28, h: 34, arriba: 36, abajo: 120 };
const puerta = (e: Edif) => e.x + e.w / 2;

function ventanas(e: Edif): Array<{ x: number; y: number }> {
  const out: Array<{ x: number; y: number }> = [];
  const gx = (e.w - e.cols * VENT.w) / (e.cols + 1);
  const paso = e.filas > 1 ? (e.h - VENT.abajo - VENT.arriba - VENT.h) / (e.filas - 1) : 0;
  for (let r = 0; r < e.filas; r++) for (let k = 0; k < e.cols; k++) out.push({ x: gx + k * (VENT.w + gx), y: VENT.arriba + r * paso });
  return out;
}

// Los primeros trabajos: un Handy de otro oficio por trabajo, que sale de un edificio y queda junto a Llave
const OFICIOS: Personaje[] = ['gota', 'medidor_gas', 'brocha', 'engranaje', 'grifo'];
const PUESTOS = [134, 216, 472, 550, 626]; // centro de cada lugar en la vereda (Llave ocupa 256–426)
const DE_PUERTA = [1, 0, 2, 1, 0]; // edificio del que sale cada trabajo
const A_PUESTO = [2, 1, 3, 0, 4]; // lugar donde aterriza
const ALTO_OFICIO = 90;
// El contador de trabajos (ease cúbico del kit) y las llegadas, sincronizadas con él
const T0 = 4.6;
const DUR = 2.4;
const LISTO1 = 5.95; // terminaron de llegar los trabajos
const LISTO2 = 9.4; // la cuenta de Handyx llegó a su cifra

// Lo nuevo del paso 3: un comercio (con su aire en el techo) y casas, una más allá del borde
interface Nuevo { tipo: 'casa' | 'local'; x: number; w: number; h: number }
const NUEVOS: Nuevo[] = [
  { tipo: 'local', x: 1334, w: 186, h: 150 },
  { tipo: 'casa', x: 1544, w: 166, h: 168 },
  { tipo: 'casa', x: 1812, w: 176, h: 150 },
];
const PINES = [
  { x: 1427, punta: 644 }, // sobre el aire del comercio
  { x: 1627, punta: SUELO - 168 - 6 },
  { x: 1866, punta: SUELO - 150 - 6 },
];

const LLAVE = { x: 341, y: 742 }; // de dónde salen las monedas del profesional
const FOCO = { x: 1385, y: 742 }; // de dónde salen las monedas del usuario
const CAJA = { x: 1560, y: 400 }; // alcancía en la esquina de la tarjeta de Handyx

export default escena({
  marcas: [0, 3.0, 6.4, 10.2, 13.4],
  cara: [
    { desde: 0, x: 1730, y: 170, d: 250 },
    { desde: 1, x: 1730, y: 170, d: 250 },
    { desde: 2, x: 1730, y: 170, d: 250 },
    { desde: 3, x: 1730, y: 170, d: 250 },
  ],
  leyendas: ['Las dos apps: **desarrolladas y en pruebas**', 'Con porteros: **los primeros trabajos**', 'Las **primeras comisiones** cobradas', 'Ahora: **más allá de los edificios**'],
  css: `
    .fondo { position: absolute; inset: 0; background: ${COLOR.azul}; }
    .sol { position: absolute; left: 1730px; top: 170px; width: 0; height: 0; }
    .sol .disco { position: absolute; left: -64px; top: -64px; width: 128px; height: 128px; border-radius: 50%; background: ${COLOR.amarillo}; box-shadow: 0 0 0 18px rgba(255,201,60,.16), 0 0 0 38px rgba(255,201,60,.07); }
    .sol .rayos { position: absolute; left: 0; top: 0; width: 0; height: 0; }
    .sol .rayos i { position: absolute; left: -5px; top: -118px; width: 10px; height: 28px; border-radius: 6px; background: rgba(255,201,60,.5); transform-origin: 5px 118px; }
    .lej { position: absolute; bottom: ${ABAJO}px; background: #1B4B90; border-radius: 6px 6px 0 0; transform-origin: 50% 100%; }
    .lej i { position: absolute; width: 12px; height: 15px; border-radius: 3px; background: rgba(255,255,255,.07); }
    .lej i.on { background: rgba(255,233,168,.72); }
    .vereda { position: absolute; left: 0; top: ${SUELO}px; width: 1920px; height: 24px; background-color: #2B63B4; background-image: linear-gradient(90deg, rgba(255,255,255,.10) 2px, transparent 2px); background-size: 42px 24px; border-top: 4px solid #3B76C8; }
    .cordon { position: absolute; left: 0; top: ${SUELO + 24}px; width: 1920px; height: 8px; background: #0E2347; }
    .calle { position: absolute; left: 0; top: ${SUELO + 32}px; width: 1920px; height: ${ABAJO - 32}px; background: #13305E; }
    .calle .lineas { position: absolute; left: 0; top: 104px; width: 1920px; height: 6px; background: repeating-linear-gradient(90deg, rgba(255,201,60,.75) 0 60px, transparent 60px 130px); }
    .onda { position: absolute; left: 995px; top: ${SUELO - 8}px; width: 560px; height: 130px; margin: -65px 0 0 -280px; border-radius: 50%; border: 7px solid ${COLOR.amarillo}; background: rgba(255,201,60,.07); }
    .ed { position: absolute; bottom: ${ABAJO}px; transform-origin: 50% 100%; }
    .ed .cornisa { position: absolute; left: -8px; right: -8px; top: 0; height: 18px; background: #0E2347; border-radius: 8px 8px 3px 3px; }
    .ed .frente { position: absolute; left: 0; right: 0; top: 18px; bottom: 0; background: #13305E; }
    .ed .tanque { position: absolute; right: 30px; top: -42px; width: 58px; height: 42px; background: #0E2347; border-radius: 8px 8px 0 0; }
    .ed .w { position: absolute; width: ${VENT.w}px; height: ${VENT.h}px; border-radius: 6px; background: #22467C; }
    .ed .w.on { background: #FFE9A8; box-shadow: 0 0 16px rgba(255,201,60,.5); }
    .ed .marq { position: absolute; left: 50%; bottom: 86px; width: 100px; height: 14px; margin-left: -50px; border-radius: 6px; background: ${COLOR.amarillo}; }
    .ed .puerta { position: absolute; left: 50%; bottom: 0; width: 66px; height: 84px; margin-left: -33px; border-radius: 12px 12px 0 0; background: #CFE0FA; border: 6px solid #E6EEFB; border-bottom: 0; }
    .nuevo { position: absolute; bottom: ${ABAJO}px; transform-origin: 50% 100%; }
    .casa .techo { position: absolute; left: -12px; right: -12px; top: 0; height: 44%; background: #0E2347; clip-path: polygon(50% 0, 100% 100%, 0 100%); }
    .casa .muro { position: absolute; left: 6px; right: 6px; top: 44%; bottom: 0; background: ${COLOR.hueso}; }
    .casa .vent { position: absolute; left: 16px; top: 16px; width: 46px; height: 36px; border-radius: 6px; background: #FFE9A8; box-shadow: inset 0 0 0 4px #fff, 0 0 0 2px #D6D9E0; }
    .casa .puer { position: absolute; right: 18px; bottom: 0; width: 40px; height: 56px; border-radius: 8px 8px 0 0; background: ${COLOR.azul}; }
    .local .cartel { position: absolute; left: 14px; right: 14px; top: 0; height: 42px; border-radius: 10px; background: #0E2347; display: grid; place-items: center; }
    .local .cartel .icono { width: 28px; height: 28px; }
    .local .toldo { position: absolute; left: -6px; right: -6px; top: 46px; height: 26px; border-radius: 6px 6px 0 0; background: repeating-linear-gradient(90deg, ${COLOR.amarillo} 0 26px, #fff 26px 52px); }
    .local .frente-l { position: absolute; left: 4px; right: 4px; top: 72px; bottom: 0; background: ${COLOR.hueso}; }
    .local .vidriera { position: absolute; left: 12px; top: 12px; width: 90px; height: 50px; border-radius: 6px; background: ${COLOR.celeste}; box-shadow: inset 0 0 0 4px #fff, 0 0 0 2px #D6D9E0; }
    .local .puer { position: absolute; right: 14px; bottom: 0; width: 44px; height: 62px; border-radius: 8px 8px 0 0; background: ${COLOR.azul}; }
    .mov { position: absolute; transform-origin: 50% 100%; }
    .foco0 { left: 90px; top: ${SUELO - 170}px; width: 170px; height: 170px; }
    .llave { left: 256px; top: ${SUELO - 170}px; width: 170px; height: 170px; }
    .focoU { left: 1310px; top: ${SUELO - 150}px; width: 150px; height: 150px; }
    .aireS { left: 1397px; top: 650px; width: 60px; height: 60px; }
    .oficio { left: 0; top: 0; width: ${ALTO_OFICIO}px; height: ${ALTO_OFICIO}px; opacity: 0; }
    .oficio.vuela .sombra-pj { opacity: 0; }
    .aterriza { position: absolute; left: -46px; top: -46px; width: 92px; height: 92px; border-radius: 50%; border: 6px solid ${COLOR.amarillo}; opacity: 0; }
    .centrar { position: absolute; width: 0; display: flex; justify-content: center; }
    .portero { font-size: 22px; padding: 8px 16px 8px 10px; color: ${COLOR.noche}; }
    .portero img { width: 26px; height: 26px; }
    .pin { position: absolute; width: 60px; height: 76px; }
    .pin .cabeza { position: absolute; left: 0; top: 0; width: 60px; height: 60px; border-radius: 50%; background: #fff; display: grid; place-items: center; box-shadow: 0 8px 18px rgba(14,29,54,.3); }
    .pin .cabeza::after { content: ''; position: absolute; left: 50%; bottom: -13px; margin-left: -11px; border: 11px solid transparent; border-top: 15px solid #fff; border-bottom: 0; }
    .pin .icono { width: 32px; height: 32px; }
    .tel { width: 290px; height: 628px; border-radius: 44px; padding: 11px; }
    .tel .pantalla { border-radius: 36px; }
    .tel .isla { width: 84px; height: 24px; margin-left: -42px; top: 10px; }
    .telU, .telE { top: 178px; width: 290px; height: 628px; transform-origin: 50% 50%; }
    .telU { left: 920px; } .telE { left: 1290px; }
    .toque { position: absolute; width: 90px; height: 90px; margin: -45px 0 0 -45px; border-radius: 50%; border: 5px solid rgba(31,87,168,.8); background: rgba(31,87,168,.16); opacity: 0; z-index: 7; }
    .telU .toque { left: 50%; top: 31%; } .telE .toque { left: 28%; top: 80%; }
    .rot-app { color: #fff; font-weight: 800; font-size: 26px; white-space: nowrap; }
    .ok { font-size: 22px; padding: 10px 20px 10px 12px; box-shadow: 0 10px 24px rgba(14,29,54,.3); }
    .demo { padding: 6px 18px; border-radius: 999px; border: 2px solid rgba(255,255,255,.55); color: #fff; font-weight: 700; font-size: 21px; white-space: nowrap; }
    .encabezado { position: absolute; left: 96px; top: 54px; }
    .encabezado .kicker { color: ${COLOR.amarillo}; }
    .encabezado .titulo { margin-top: 10px; color: #fff; }
    .k { font-weight: 800; font-size: 20px; letter-spacing: .08em; text-transform: uppercase; color: ${COLOR.azul}; }
    .cA { position: absolute; left: 96px; top: 282px; width: 530px; padding: 18px 28px 20px; }
    .cA .fila { display: flex; align-items: flex-end; gap: 40px; margin-top: 4px; }
    .st b { display: block; color: ${COLOR.azul}; line-height: 1; }
    .st span { display: block; margin-top: 4px; font-weight: 800; font-size: 24px; }
    .nTrab { font-size: 84px; }
    .monto b { font-size: 50px; }
    .cB { position: absolute; left: 930px; top: 64px; width: 640px; padding: 22px 32px; }
    .cB .cab { display: flex; align-items: center; gap: 16px; font-weight: 800; font-size: 22px; color: ${COLOR.suave}; }
    .cB .cab img { height: 40px; }
    .plan { display: flex; align-items: center; gap: 12px; margin-top: 10px; font-weight: 900; font-size: 26px; color: ${COLOR.suave}; }
    .pp { padding: 7px 16px; border-radius: 999px; background: ${COLOR.celeste}; color: ${COLOR.azulOscuro}; font-weight: 800; font-size: 24px; }
    .nIng { margin-top: 10px; font-size: 100px; color: ${COLOR.azul}; line-height: 1; }
    .cap { margin-top: 4px; font-weight: 800; font-size: 28px; }
    .nota { margin-top: 6px; font-weight: 600; font-size: 20px; color: ${COLOR.suave}; }
    .cC { position: absolute; left: 96px; top: 490px; width: 530px; padding: 16px 28px 18px; }
    .cC .fila { display: flex; align-items: baseline; gap: 14px; }
    .cC .fila b { font-size: 64px; color: ${COLOR.azul}; line-height: 1; }
    .cC .fila span { font-weight: 800; font-size: 26px; }
    .alcancia { position: absolute; left: ${CAJA.x - 40}px; top: ${CAJA.y - 40}px; width: 80px; height: 80px; }
    .alcancia .in { width: 80px; height: 80px; border-radius: 50%; background: ${COLOR.amarillo}; display: grid; place-items: center; box-shadow: 0 0 0 6px #fff, 0 12px 24px rgba(14,29,54,.3); }
    .alcancia .icono { width: 42px; height: 42px; }
    .mas { font-size: 24px; padding: 12px 22px 12px 14px; box-shadow: 0 12px 26px rgba(14,29,54,.3); }
    .mas img { width: 30px; height: 30px; }
    .moneda { position: absolute; left: 0; top: 0; width: 46px; height: 46px; margin: -23px 0 0 -23px; border-radius: 50%; background: ${COLOR.amarillo}; box-shadow: inset 0 -5px 0 #D9A21E, 0 6px 14px rgba(14,29,54,.3); display: grid; place-items: center; font-family: var(--fuente-titulos, 'Archivo Variable', sans-serif); font-weight: 900; font-size: 24px; color: #8A5B00; opacity: 0; }
  `,
  html: (c: Kit) => {
    // Horizonte lejano (decorado): edificios bajos con ventanas que se encienden en el paso 1
    let lejos = '';
    for (let x = -30; x < 1950; ) {
      const w = 70 + Math.round(c.azar() * 80);
      const h = 90 + Math.round(c.azar() * 110);
      let v = '';
      for (let r = 0; r < Math.floor((h - 24) / 30); r++)
        for (let k = 0; k < Math.floor((w - 14) / 22); k++) {
          if (c.azar() < 0.45) continue;
          const t = c.azar() < 0.4 ? (3.1 + c.azar() * 1.4).toFixed(2) : '99';
          v += `<i style="left:${10 + k * 22}px;top:${14 + r * 30}px" data-t="${t}"></i>`;
        }
      lejos += `<div class="lej" style="left:${x}px;width:${w}px;height:${h}px">${v}</div>`;
      x += w + 6 + Math.round(c.azar() * 16);
    }
    const edificios = EDIF.map(
      (e, i) => `<div class="ed e${i}" style="left:${e.x}px;width:${e.w}px;height:${e.h}px">${e.tanque ? '<div class="tanque"></div>' : ''}<div class="cornisa"></div><div class="frente"></div>
        ${ventanas(e).map((v) => `<i class="w" style="left:${v.x}px;top:${v.y + 18}px" data-t="${c.azar() < 0.2 ? '99' : (3.7 + c.azar() * 0.9).toFixed(2)}"></i>`).join('')}
        <div class="marq"></div><div class="puerta"></div></div>`,
    ).join('');
    const nuevos = NUEVOS.map((n) =>
      n.tipo === 'casa'
        ? `<div class="nuevo casa" style="left:${n.x}px;width:${n.w}px;height:${n.h}px"><div class="techo"></div><div class="muro"><i class="vent"></i><i class="puer"></i></div></div>`
        : `<div class="nuevo local" style="left:${n.x}px;width:${n.w}px;height:${n.h}px"><div class="cartel">${c.icono('tienda', 'oro')}</div><div class="toldo"></div><div class="frente-l"><i class="vidriera"></i><i class="puer"></i></div></div>`,
    ).join('');
    const trabajos = Math.max(0, Math.round(c.valor('TRABAJOS-INFORMADOS') ?? 0));
    const oficios = Array.from({ length: Math.min(trabajos, PUESTOS.length) }, (_, i) => `<div class="mov oficio">${c.pj(OFICIOS[i % OFICIOS.length]!, '', ALTO_OFICIO)}<div class="sombra-pj"></div></div>`).join('');
    const monedas = Array.from({ length: 10 }, () => '<div class="moneda">$</div>').join('');
    return `
    <div class="fondo"></div>
    <div class="sol"><div class="rayos">${Array.from({ length: 12 }, (_, i) => `<i style="rotate:${i * 30}deg"></i>`).join('')}</div><div class="disco"></div></div>
    <div class="lejos">${lejos}</div>
    <div class="vereda"></div><div class="cordon"></div><div class="calle"><div class="lineas"></div></div>
    <div class="onda"></div><div class="onda"></div>
    ${edificios}
    ${nuevos}
    <div class="mov aireS">${c.pj('aire', '', 60)}</div>
    <div class="mov foco0">${c.pj('bombilla', '', 170)}<div class="sombra-pj"></div></div>
    <div class="mov llave">${c.pj('llave', '', 170)}<div class="sombra-pj"></div></div>
    <div class="mov focoU">${c.pj('bombilla', '', 150)}<div class="sombra-pj"></div></div>
    ${oficios}
    <div class="aterriza"></div>
    ${EDIF.map((e) => `<div class="centrar" style="left:${puerta(e)}px;top:${SUELO - 48}px"><span class="chip portero">${c.icono('cliente-nuevo')}Portero</span></div>`).join('')}
    ${PINES.map((p) => `<div class="pin" style="left:${p.x - 30}px;top:${p.punta - 76}px"><div class="cabeza">${c.icono('ubicacion')}</div></div>`).join('')}
    <div class="mov telU">${c.celular(`${c.img('demo-landing/usuario-inicio.webp', 'captura', 'Demo: inicio de la app de usuario')}<i class="toque"></i>`, 'tel')}</div>
    <div class="mov telE">${c.celular(`${c.img('demo-landing/especialista-pedido.webp', 'captura', 'Demo: pedido nuevo en la app del profesional')}<i class="toque"></i>`, 'tel')}</div>
    <div class="centrar rU" style="left:1065px;top:124px"><span class="rot-app">App de usuario</span></div>
    <div class="centrar rE" style="left:1435px;top:124px"><span class="rot-app">App del profesional</span></div>
    <div class="centrar okU" style="left:1065px;top:770px"><span class="chip verde ok">${c.icono('tilde-circulo', 'blanco')}Desarrollada · en pruebas</span></div>
    <div class="centrar okE" style="left:1435px;top:770px"><span class="chip verde ok">${c.icono('tilde-circulo', 'blanco')}Desarrollada · en pruebas</span></div>
    <div class="centrar dem" style="left:1250px;top:826px"><span class="demo">Demo · datos ficticios</span></div>
    ${monedas}
    <div class="encabezado"><div class="kicker">Ya empezamos</div><div class="titulo t"><span class="l"><span>No nos quedamos</span></span><span class="l"><span>en <mark>una idea.</mark></span></span></div></div>
    <div class="tarjeta cA"><div class="k">Prueba con porteros</div>
      <div class="fila"><div class="st"><b class="t nTrab">&nbsp;</b><span class="lTrab">trabajos</span></div><div class="st monto"><b class="t">${c.cifra('PRUEBA-MONTO')}</b><span>en trabajos</span></div></div></div>
    <div class="tarjeta cB"><div class="cab">${c.logo()}<span>Plan original de la prueba:</span></div>
      <div class="plan"><span class="pp ppU">${c.cifra('PRUEBA-COM-USUARIO')} usuario</span>+<span class="pp ppP">${c.cifra('PRUEBA-COM-PROFESIONAL')} profesional</span></div>
      <div class="t nIng">&nbsp;</div><div class="cap">ingresos brutos de Handyx</div>
      <div class="nota">Dato informado por el fundador</div></div>
    <div class="alcancia"><div class="in">${c.icono('alcancia')}</div></div>
    <div class="tarjeta cC"><div class="fila"><b class="t">${c.cifra('ESP-REGISTRADOS')}</b><span>especialistas registrados</span></div>
      <div class="nota">preregistro: no son activos ni verificados</div></div>
    <div class="centrar masW" style="left:1550px;top:466px"><span class="chip amarillo mas">${c.icono('casa')}Más allá de los edificios: casas y comercios</span></div>
  `;
  },
  armar(tl, $, c) {
    // 0 · las dos apps desarrolladas, en pruebas
    tl.fromTo($('.sol'), { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.9, ease: 'back.out(1.6)' }, 0);
    tl.fromTo($.all('.lej'), { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: 'back.out(1.3)', stagger: { each: 0.02, from: 'center' } }, 0);
    tl.fromTo([$('.vereda'), $('.cordon'), $('.calle')], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 0);
    tl.fromTo($('.encabezado .kicker'), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.05);
    entraTitulo(tl, $.all('.encabezado .l > span'), 0.15);
    tl.fromTo($('.telU'), { autoAlpha: 0, y: 640, rotation: -12 }, { autoAlpha: 1, y: 0, rotation: -3, duration: 0.85, ease: 'back.out(1.1)' }, 0.4);
    tl.fromTo($('.telE'), { autoAlpha: 0, y: 640, rotation: 12 }, { autoAlpha: 1, y: 0, rotation: 3, duration: 0.85, ease: 'back.out(1.1)' }, 0.58);
    tl.fromTo([$('.foco0'), $('.llave')], { autoAlpha: 0, y: 90 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'back.out(1.8)', stagger: 0.1 }, 0.6);
    tl.fromTo([$('.rU'), $('.rE')], { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out', stagger: 0.12 }, 1.25);
    tl.fromTo([$('.okU .chip'), $('.okE .chip')], { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(2.4)', stagger: 0.18 }, 1.6);
    tl.fromTo($('.dem'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 2.1);
    // 1 · los porteros conectan: de cada puerta sale un Handy de otro oficio hacia Llave
    tl.to([$('.rU'), $('.rE'), $('.okU'), $('.okE'), $('.dem')], { autoAlpha: 0, duration: 0.25 }, 3.0);
    tl.to([$('.telU'), $('.telE')], { y: 1000, rotation: 0, autoAlpha: 0, duration: 0.55, ease: 'power3.in', stagger: 0.07 }, 3.0);
    tl.to($('.foco0'), { x: -340, duration: 0.8, ease: 'power1.in' }, 3.0);
    $.all('.ed').forEach((e, i) => tl.fromTo(e, { scaleY: 0 }, { scaleY: 1, duration: 0.65, ease: 'back.out(1.25)' }, 3.35 + i * 0.12));
    tl.fromTo($.all('.portero'), { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2.4)', stagger: 0.12 }, 3.95);
    tl.fromTo($('.cA'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'back.out(1.6)' }, 4.05);
    c.contador($('.nTrab'), { t0: T0, dur: DUR, hasta: c.valor('TRABAJOS-INFORMADOS') ?? 0 });
    tl.fromTo($('.cA .monto'), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(2.2)' }, LISTO1);
    // 2 · comisiones: Foco (usuario) sale de un edificio; monedas de Foco y de Llave a la alcancía de Handyx
    tl.fromTo($('.cB'), { autoAlpha: 0, y: 40, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.5)' }, 6.45);
    tl.fromTo($.all('.cB .pp'), { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2.4)', stagger: 0.18 }, 6.8);
    tl.fromTo($('.alcancia'), { autoAlpha: 0, scale: 0.2 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(2.6)' }, 6.85);
    tl.fromTo($('.focoU'), { autoAlpha: 0, x: puerta(EDIF[2]!) - 75 - 1310, scale: 0.7 }, { autoAlpha: 1, x: 0, scale: 1, duration: 0.6, ease: 'power2.out' }, 6.5);
    c.contador($('.nIng'), { t0: 7.95, dur: 1.45, hasta: c.valor('PRUEBA-INGRESO-HANDYX') ?? 0, antes: '$ ' });
    tl.fromTo($('.cB .nota'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 9.3);
    tl.fromTo($('.cC'), { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: 'back.out(1.6)' }, 9.45);
    // 3 · más allá de los edificios: Foco va a su casa, el comercio con su aire, pines
    $.all('.onda').forEach((o, i) => {
      tl.fromTo(o, { autoAlpha: 0, scale: 0.2 }, { autoAlpha: 0.9, scale: 0.5, duration: 0.2, ease: 'none' }, 10.25 + i * 0.4);
      tl.to(o, { autoAlpha: 0, scale: 3.4, duration: 1.3, ease: 'power2.out' }, 10.45 + i * 0.4);
    });
    tl.fromTo($.all('.nuevo'), { autoAlpha: 0, scaleY: 0 }, { autoAlpha: 1, scaleY: 1, duration: 0.5, ease: 'back.out(1.7)', stagger: 0.12 }, 10.4);
    tl.to($('.focoU'), { x: 1672 - 1310, duration: 0.75, ease: 'power1.inOut' }, 10.3);
    tl.fromTo($('.masW'), { autoAlpha: 0, y: 20, scale: 0.85 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(2)' }, 10.6);
    tl.fromTo($('.aireS'), { autoAlpha: 0, y: 30, scale: 0.4 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(2.2)' }, 10.85);
    tl.fromTo($.all('.pin'), { autoAlpha: 0, y: -110 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'bounce.out', stagger: 0.12 }, 11.1);

    // Trabajos: cada Handy de oficio aparece en su puerta, salta y aterriza junto a Llave cuando el contador suma uno
    const oficios = $.all('.oficio');
    const llegadas = oficios.map((_, i) => T0 + DUR * (1 - (1 - (i + 0.5) / oficios.length) ** (1 / 3)));
    const saltos = oficios.map((el, i) => {
      const x0 = puerta(EDIF[DE_PUERTA[i % DE_PUERTA.length]!]!);
      const x1 = PUESTOS[A_PUESTO[i] ?? i]!;
      return { el, pj: el.querySelector('.pj') as HTMLElement, x0, x1, alto: SUELO - Math.abs(x1 - x0) * 0.55, llega: llegadas[i]! };
    });
    // Monedas: pares del usuario (Foco), impares del profesional (Llave)
    interface Vuelo { el: HTMLElement; t0: number; t1: number; a: [number, number]; m: [number, number]; usuario: boolean }
    const monedas: Vuelo[] = $.all('.moneda').map((el, i) => {
      const usuario = i % 2 === 0;
      const t0 = 7.15 + i * 0.15;
      return usuario ? { el, t0, t1: t0 + 0.8, a: [FOCO.x, FOCO.y], m: [1440, 560], usuario } : { el, t0, t1: t0 + 0.8, a: [LLAVE.x, LLAVE.y], m: [1150, 820], usuario };
    });
    const bez = (a: number, m: number, b: number, k: number) => (1 - k) * (1 - k) * a + 2 * (1 - k) * k * m + k * k * b;
    const suave = (k: number) => (k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2);
    const aterriza = $('.aterriza');
    const alcancia = $('.alcancia .in');
    const [ppU, ppP] = [$('.ppU'), $('.ppP')];
    const ventEd = $.all('.ed .w');
    const ventLej = $.all('.lej i');
    const [pjLlave, pjFoco0, pjFocoU, pjAire] = [$('.llave .pj'), $('.foco0 .pj'), $('.focoU .pj'), $('.aireS .pj')];
    const [nTrab, lTrab] = [$('.nTrab'), $('.lTrab')];
    // Reacciones del equipo (Llave y los Handys de oficio ya aterrizados)
    const equipo = (t: number): Pose => (t >= 12.0 ? 'c' : t >= 10.4 ? 'b' : t >= LISTO2 ? 'c' : t >= 6.4 ? 'a' : t >= LISTO1 ? 'c' : 'a');
    c.pintor((t) => {
      for (const s of saltos) {
        const sale = s.llega - 0.65;
        const salta = sale + 0.15;
        if (t < sale) {
          s.el.style.opacity = '0';
          continue;
        }
        let x = s.x0;
        let y = SUELO;
        let esc = 1;
        if (t < salta) esc = 0.3 + 0.7 * tramo(t, sale, salta);
        else if (t < s.llega) {
          const k = suave(tramo(t, salta, s.llega));
          x = bez(s.x0, (s.x0 + s.x1) / 2, s.x1, k);
          y = bez(SUELO, s.alto, SUELO, k);
        } else x = s.x1;
        s.el.style.opacity = '1';
        s.el.style.transform = `translate(${x - ALTO_OFICIO / 2}px, ${y - ALTO_OFICIO}px) scale(${esc})`;
        s.el.classList.toggle('vuela', t >= salta && t < s.llega);
        pose(s.pj, t < salta ? 'b' : t < s.llega ? 'c' : equipo(t));
      }
      // destello donde aterriza cada trabajo
      const ult = saltos.filter((s) => s.llega <= t).pop();
      const d = ult ? (t - ult.llega) / 0.4 : 1;
      aterriza.style.opacity = String(d < 1 ? 1 - d : 0);
      aterriza.style.transform = `translate(${ult?.x1 ?? 0}px, ${SUELO - 40}px) scale(${0.6 + Math.min(1, d) * 0.7})`;
      // monedas hacia la alcancía; cada llegada hace saltar la alcancía y enciende la parte que paga
      for (const v of monedas) {
        if (t < v.t0 || t >= v.t1) {
          v.el.style.opacity = '0';
          continue;
        }
        const k = tramo(t, v.t0, v.t1);
        const e = suave(k);
        const s = k < 0.15 ? k / 0.15 : k > 0.85 ? 1 - ((k - 0.85) / 0.15) * 0.55 : 1;
        v.el.style.opacity = '1';
        v.el.style.transform = `translate(${bez(v.a[0], v.m[0], CAJA.x, e)}px, ${bez(v.a[1], v.m[1], CAJA.y, e)}px) scale(${s})`;
      }
      const golpe = (ts: number[]) => {
        const u = ts.filter((x) => x <= t).pop();
        const dm = u === undefined ? 1 : (t - u) / 0.25;
        return dm < 1 ? Math.sin(dm * Math.PI) : 0;
      };
      alcancia.style.transform = `scale(${1 + golpe(monedas.map((v) => v.t1)) * 0.14})`;
      ppU.style.background = golpe(monedas.filter((v) => v.usuario).map((v) => v.t1)) > 0.3 ? COLOR.amarillo : COLOR.celeste;
      ppP.style.background = golpe(monedas.filter((v) => !v.usuario).map((v) => v.t1)) > 0.3 ? COLOR.amarillo : COLOR.celeste;
      // singular mientras cuenta (el pintor del contador corre antes)
      lTrab.textContent = nTrab.textContent === '1' ? 'trabajo' : 'trabajos';
      // ventanas que se encienden (edificios y horizonte)
      for (const w of ventEd) w.classList.toggle('on', t >= Number(w.dataset['t']));
      for (const w of ventLej) w.classList.toggle('on', t >= Number(w.dataset['t']));
      // poses: saludan al llegar las apps y festejan con el sello; Llave recibe los trabajos saludando y paga su parte tranquilo
      pose(pjLlave, t >= LISTO1 ? equipo(t) : t >= T0 ? 'b' : t >= 3.0 ? 'a' : t >= 1.75 ? 'c' : t >= 0.9 ? 'b' : 'a');
      pose(pjFoco0, t >= 3.0 ? 'd' : t >= 1.75 ? 'c' : t >= 0.9 ? 'b' : 'a');
      pose(pjFocoU, t >= 12.2 ? 'c' : t >= 11.05 ? 'b' : t >= 10.3 ? 'd' : t >= LISTO2 ? 'c' : t >= 7.1 ? 'b' : 'd');
      pose(pjAire, t >= 12.2 ? 'c' : 'b');
    });
  },
  ambiente(t, $, tl) {
    $('.sol .rayos').style.transform = `rotate(${t * 8}deg)`;
    // Respiración (dueño: el ambiente; la línea de tiempo y los saltos mueven los contenedores .mov). Al caminar, rebote.
    const camina: Record<string, Array<[number, number]>> = { foco0: [[3.0, 3.8]], focoU: [[6.5, 7.1], [10.3, 11.05]] };
    $.all('.mov .pj').forEach((p, i) => {
      const quien = (p.parentElement as HTMLElement).classList[1] ?? '';
      const tramoCamina = camina[quien]?.find(([a, b]) => tl >= a && tl <= b);
      if (tramoCamina) {
        const f = Math.sin((tl - tramoCamina[0]) * 14);
        p.style.transform = `translateY(${-Math.abs(f) * 12}px) rotate(${f * 5}deg)`;
      } else p.style.transform = `scaleY(${1 + Math.sin(t * 2.4 + i) * 0.018})`;
    });
    // Toques en las pantallas: «las estamos probando»
    $.all('.toque').forEach((el, i) => {
      const k = ((t + i * 0.8) % 1.6) / 1.6;
      el.style.opacity = tl > 1.3 && tl < 3.0 ? String((1 - k) * 0.9) : '0';
      el.style.transform = `scale(${0.3 + k * 1.1})`;
    });
    // Pines que flotan apenas (dueño: el ambiente mueve la cabeza; la línea de tiempo, el contenedor)
    $.all('.pin .cabeza').forEach((el, i) => (el.style.transform = `translateY(${Math.sin(t * 2 + i * 1.3) * 4}px)`));
  },
});
