// Diapositiva 3 · Herramientas para el profesional. Un golpe por frase del guion:
// 0 «Del lado del profesional, reunimos trabajos, ingresos, gastos…» → la app (demo, datos ficticios) en tres celulares
//   que se abren en abanico; al ritmo de la frase, Llave presenta Trabajos · Ingresos · Gastos ·
// 1 «…y herramientas por oficio.» → la página se desliza como un carrusel y entran las seis herramientas propuestas
//   (en desarrollo); Electricidad pasa al frente ·
// 2 «A futuro queremos potenciarlas con inteligencia artificial…» → HandIA para profesionales: Llave con Foco-HandIA,
//   sugerencias que aparecen de a una y la escalera de estrellas «Cada trabajo, mejor que el anterior» (visión).
// Sin cifras en pantalla: las capturas son de la demo (datos ficticios) o diseños propuestos, rotulados como tales.
import { COLOR, entraTitulo, escena, pose } from './comun/kit.ts';

// Celular del kit: 340 × 730; cada grupo lo escala con CSS y la línea de tiempo mueve el contenedor.
const W = 340;
const H = 730;
const S0 = 0.7; // paso 0
const SF = 0.7; // Electricidad, al frente
const SO = 0.54; // resto de los oficios
const PISO = 790; // base común de los celulares del carrusel
// La franja y 880–950 queda libre (leyenda numerada del paso, centrada, que agrega el kit).

const TEL0 = [
  { img: 'demo-landing/especialista-agenda.webp', cap: 'Trabajos y agenda', cx: 250, top: 306, r: -4.5, dx: 310, z: 1 },
  { img: 'demo-landing/especialista-mensajes.webp', cap: 'Clientes y chats', cx: 560, top: 296, r: 0, dx: 0, z: 2 },
  { img: 'conceptos/herramientas-numeros.webp', cap: 'Ingresos y gastos', cx: 870, top: 306, r: 4.5, dx: -310, z: 1 },
];
const CHIPS0 = [
  { ic: 'calendario', txt: 'Trabajos', t: 1.85 },
  { ic: 'billetera', txt: 'Ingresos', t: 2.3 },
  { ic: 'recibo', txt: 'Gastos', t: 2.75 },
];
const OFICIOS = [
  { id: 'electricidad', nombre: 'Electricidad', pista: 'Calculadora de cable y esquemas con IA', cx: 250, r: 0 },
  { id: 'plomeria', nombre: 'Plomería', pista: 'Detector de pérdidas guiado', cx: 589, r: -2 },
  { id: 'gas', nombre: 'Gas', pista: 'Checklist de seguridad', cx: 867, r: 1.5 },
  { id: 'cerrajeria', nombre: 'Cerrajería', pista: 'Registro de aperturas', cx: 1145, r: -1.5 },
  { id: 'albanileria', nombre: 'Albañilería', pista: 'Calculadora de materiales', cx: 1423, r: 2 },
  { id: 'aire', nombre: 'Aire acond.', pista: 'Frigorías y service', cx: 1701, r: -1 },
];
const SUGERENCIAS = [
  { ic: 'calculadora', b: 'Armé tu presupuesto:', txt: 'materiales + mano de obra' },
  { ic: 'tienda', b: 'Materiales:', txt: 'reservalos en una ferretería cercana' },
  { ic: 'repetir', b: 'Recordatorio:', txt: 'service anual del aire de tu cliente' },
  { ic: 'camara', b: 'Sumá fotos', txt: 'del antes y después a tu perfil' },
];
// Herramientas decorativas en el margen (debajo queda libre para la cara del presentador)
const DECO = [
  { x: 1606, y: 104, s: 100, ic: 'llave-inglesa' },
  { x: 1742, y: 200, s: 78, ic: 'calculadora' },
  { x: 1598, y: 246, s: 62, ic: 'lista' },
];
// Escalera: cada trabajo, un escalón más alto y una estrella más grande
const ESC = [0, 1, 2, 3, 4].map((i) => ({ x: 1392 + i * 88, h: 70 + i * 65, s: 40 + i * 6 }));
const CHISPAS = [
  { x: 470, y: 368, s: 34 },
  { x: 250, y: 430, s: 24 },
  { x: 486, y: 540, s: 22 },
  { x: 1300, y: 340, s: 30 },
  { x: 1846, y: 392, s: 28 },
];

export default escena({
  marcas: [0, 3.4, 7.2, 11.0],
  cara: [
    { desde: 0, x: 1690, y: 200, d: 250 },
    { desde: 1, x: 1690, y: 200, d: 250 },
    { desde: 2, x: 1690, y: 200, d: 250 },
  ],
  css: `
    .fondo { position: absolute; inset: 0; background: ${COLOR.hueso}; }
    .encabezado { position: absolute; left: 96px; top: 52px; }
    .encabezado .titulo { margin-top: 10px; font-size: 62px; }
    .dz { position: absolute; }
    .dz-in { width: 100%; height: 100%; display: grid; place-items: center; border-radius: 24px; background: #ECECEC; box-shadow: inset 0 -6px 0 rgba(14,29,54,.06); }
    .dz .icono { width: 46%; height: 46%; opacity: .6; }
    .pag { position: absolute; inset: 0; }
    .pj { transform-origin: 50% 100%; }
    .mov { position: absolute; }
    .tel { position: absolute; }
    .tel .flota { position: absolute; inset: 0; }
    .tel .cel { left: 0; top: 0; transform-origin: 0 0; }
    .tel0 { width: ${W * S0}px; height: ${H * S0}px; }
    .tel0 .cel { transform: scale(${S0}); }
    .cap { position: absolute; top: 840px; width: 320px; text-align: center; font-weight: 800; font-size: 24px; color: ${COLOR.noche}; }
    .rot { position: absolute; display: inline-flex; align-items: center; gap: 10px; padding: 8px 18px 8px 12px; border-radius: 999px; font-weight: 800; font-size: 20px; letter-spacing: .02em; white-space: nowrap; }
    .rot .icono { width: 24px; height: 24px; }
    .rot.demo { background: ${COLOR.celeste}; color: ${COLOR.azul}; box-shadow: inset 0 0 0 2px rgba(31,87,168,.16); }
    .rot.prop { background: ${COLOR.amarillo}; color: ${COLOR.noche}; box-shadow: 0 4px 0 #C9971E; }
    .rot.vision { background: ${COLOR.azulOscuro}; color: #fff; box-shadow: 0 4px 0 ${COLOR.noche}; }
    .r0 { left: 96px; top: 240px; }
    .aro0 { position: absolute; inset: -10px; opacity: 0; visibility: hidden; border-radius: 45px; box-shadow: 0 0 0 6px ${COLOR.amarillo}, 0 0 40px 12px rgba(255,201,60,.5); }
    .sticker { position: absolute; left: 862px; top: 284px; padding: 8px 16px; border-radius: 12px; background: ${COLOR.amarillo}; color: ${COLOR.noche}; font-weight: 800; font-size: 20px; letter-spacing: .06em; text-transform: uppercase; white-space: nowrap; box-shadow: 0 4px 0 #C9971E, 0 12px 24px rgba(14,29,54,.22); z-index: 3; }
    .chip0 { position: absolute; left: 1110px; display: flex; align-items: center; gap: 16px; padding: 10px 30px 10px 10px; border-radius: 22px; background: #fff; box-shadow: 0 14px 30px rgba(14,29,54,.16), 0 3px 0 ${COLOR.borde}; font-weight: 800; font-size: 32px; color: ${COLOR.noche}; white-space: nowrap; }
    .chip0 .ic { width: 58px; height: 58px; display: grid; place-items: center; border-radius: 16px; background: ${COLOR.celeste}; }
    .chip0 .ic .icono { width: 32px; height: 32px; }
    .ll0 { left: 1450px; top: 470px; width: 340px; height: 340px; }
    .sombra-pj { z-index: -1; }
    .col { position: absolute; top: 0; height: 1080px; }
    .tel1 { width: ${W * SO}px; height: ${H * SO}px; top: ${PISO - H * SO}px; }
    .tel1 .cel { transform: scale(${SO}); }
    .col.top .tel1 { width: ${W * SF}px; height: ${H * SF}px; top: ${PISO - H * SF}px; }
    .col.top .tel1 .cel { transform: scale(${SF}); }
    .aro { position: absolute; inset: -12px; border-radius: 49px; box-shadow: 0 0 0 7px ${COLOR.amarillo}, 0 0 50px 16px rgba(255,201,60,.55); }
    .rayos { position: absolute; left: -210px; top: ${PISO - (H * SF) / 2 - 380}px; width: 760px; height: 760px; }
    .giro { position: absolute; inset: 0; border-radius: 50%; background: repeating-conic-gradient(rgba(255,201,60,.30) 0 8deg, transparent 8deg 20deg); -webkit-mask-image: radial-gradient(circle, #000 22%, transparent 66%); mask-image: radial-gradient(circle, #000 22%, transparent 66%); }
    .fc { position: absolute; left: 0; right: 0; top: ${PISO - 25}px; text-align: center; }
    .fc .chip { font-size: 22px; }
    .col.top .fc .chip { font-size: 24px; }
    .pista { position: absolute; left: 8px; right: 8px; top: ${PISO + 36}px; text-align: center; font-size: 20px; font-weight: 600; line-height: 1.2; color: ${COLOR.texto}; }
    .col.top .pista { font-weight: 800; color: ${COLOR.noche}; }
    .sub { display: flex; align-items: center; gap: 14px; font-size: 42px; color: ${COLOR.azulOscuro}; white-space: nowrap; }
    .sub .icono { width: 44px; height: 44px; }
    .fila { position: absolute; display: flex; align-items: center; gap: 26px; }
    .fila .rot { position: relative; }
    .fila1 { left: 450px; top: 280px; }
    .fila2 { left: 96px; top: 276px; }
    .ll2 { left: 96px; top: 530px; width: 330px; height: 330px; }
    .foco2 { left: 300px; top: 376px; width: 150px; height: 150px; }
    .foco2 .flota { position: absolute; inset: 0; }
    .halo { position: absolute; left: -45px; top: -45px; width: 240px; height: 240px; border-radius: 50%; background: radial-gradient(circle, rgba(255,201,60,.50) 0 38%, rgba(255,201,60,.20) 39% 62%, transparent 63%); }
    .asist { position: absolute; left: 520px; top: 372px; width: 800px; padding: 20px 24px 22px; border-radius: 34px; }
    .asist::before { content: ''; position: absolute; left: -15px; top: 68px; width: 34px; height: 34px; background: #fff; border-radius: 6px; transform: rotate(45deg); }
    .cab { display: flex; align-items: center; gap: 16px; padding-bottom: 14px; margin-bottom: 14px; border-bottom: 2px solid ${COLOR.borde}; }
    .cab .av { width: 56px; height: 56px; display: grid; place-items: center; border-radius: 50%; background: #FFF1C4; box-shadow: inset 0 0 0 3px ${COLOR.amarillo}; }
    .cab .av .icono { width: 34px; height: 34px; }
    .cab b { display: block; font-size: 32px; color: ${COLOR.noche}; }
    .cab small { display: block; margin-top: 2px; font-size: 20px; font-weight: 600; color: ${COLOR.suave}; }
    .sug { display: flex; align-items: center; gap: 18px; padding: 10px 18px 10px 10px; border-radius: 20px; background: #F3F6FC; }
    .sug + .sug { margin-top: 10px; }
    .sug .ic { flex: none; width: 58px; height: 58px; display: grid; place-items: center; border-radius: 16px; background: ${COLOR.azul}; box-shadow: 0 5px 0 ${COLOR.azulOscuro}; }
    .sug .ic .icono { width: 30px; height: 30px; }
    .sug p { font-size: 24px; font-weight: 600; line-height: 1.25; color: ${COLOR.texto}; }
    .sug p b { color: ${COLOR.azul}; font-weight: 800; }
    .esc { position: absolute; width: 80px; border-radius: 14px 14px 6px 6px; background: ${COLOR.azul}; box-shadow: 0 10px 0 ${COLOR.azulOscuro}; }
    .esc .icono { width: 34px; height: 34px; margin: 16px auto 0; }
    .est { position: absolute; filter: drop-shadow(0 4px 0 #C9971E); }
    .est i, .chispa i { display: block; width: 100%; height: 100%; background: ${COLOR.amarillo}; }
    .est i { clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%); }
    .chispa { position: absolute; }
    .chispa i { clip-path: polygon(50% 0, 61% 39%, 100% 50%, 61% 61%, 50% 100%, 39% 61%, 0 50%, 39% 39%); }
    .lema { position: absolute; left: 1392px; top: 452px; font-size: 32px; line-height: 1.08; color: ${COLOR.azulOscuro}; }
  `,
  html: (c) => `
    <div class="fondo"></div>
    ${DECO.map((d) => `<div class="dz" style="left:${d.x}px;top:${d.y}px;width:${d.s}px;height:${d.s}px"><div class="dz-in">${c.icono(d.ic)}</div></div>`).join('')}
    <div class="encabezado"><div class="kicker">Para el profesional</div><div class="titulo t"><span class="l"><span>Más que clientes: herramientas</span></span><span class="l"><span>para <mark>trabajar mejor.</mark></span></span></div></div>

    <div class="pag pag0">
      <span class="rot demo r0">${c.icono('celular')}Demo de la app · datos ficticios</span>
      ${TEL0.map((p) => `<div class="tel tel0" style="left:${p.cx - (W * S0) / 2}px;top:${p.top}px;z-index:${p.z}"><div class="flota"><div class="aro0"></div>${c.celular(c.img(p.img, 'captura'))}</div></div>`).join('')}
      ${TEL0.map((p) => `<div class="cap" style="left:${p.cx - 160}px">${p.cap}</div>`).join('')}
      <span class="sticker">Diseño propuesto</span>
      ${CHIPS0.map((ch, i) => `<div class="chip0" style="top:${440 + i * 92}px"><span class="ic">${c.icono(ch.ic)}</span>${ch.txt}</div>`).join('')}
      <div class="mov ll0">${c.pj('llave', '', 340)}<div class="sombra-pj"></div></div>
    </div>

    <div class="pag pag1">
      ${OFICIOS.map((o, i) => {
        const ancho = i === 0 ? 340 : 278;
        const s = i === 0 ? SF : SO;
        return `<div class="col ${i === 0 ? 'top' : ''}" style="left:${o.cx - ancho / 2}px;width:${ancho}px">
          ${i === 0 ? '<div class="rayos"><div class="giro"></div></div>' : ''}
          <div class="tel tel1" style="left:${(ancho - W * s) / 2}px;rotate:${o.r}deg"><div class="flota">${i === 0 ? '<div class="aro"></div>' : ''}${c.celular(c.img(`conceptos/herramientas-${o.id}.webp`, 'captura'))}</div></div>
          <div class="fc"><span class="chip">${c.icono(o.id)}${o.nombre}</span></div>
          <div class="pista">${o.pista}</div>
        </div>`;
      }).join('')}
      <div class="fila fila1"><div class="sub t s1">Herramientas por oficio</div><span class="rot prop r1">${c.icono('herramienta')}En desarrollo · diseño propuesto</span></div>
    </div>

    <div class="pag pag2">
      <div class="fila fila2"><div class="sub t s2">${c.icono('sparkles')}HandIA para profesionales</div><span class="rot vision r2">${c.icono('sparkles', 'oro')}Visión · con la inversión</span></div>
      <div class="mov ll2">${c.pj('llave', '', 330)}<div class="sombra-pj"></div></div>
      <div class="mov foco2"><div class="halo"></div><div class="flota">${c.pj('bombilla', '', 150)}</div></div>
      <div class="asist tarjeta">
        <div class="cab"><span class="av">${c.icono('sparkles')}</span><div><b class="t">HandIA</b><small>Sugerencias para tu trabajo</small></div></div>
        ${SUGERENCIAS.map((s) => `<div class="sug"><span class="ic">${c.icono(s.ic, 'blanco')}</span><p><b>${s.b}</b> ${s.txt}</p></div>`).join('')}
      </div>
      ${ESC.map((e) => `<div class="esc" style="left:${e.x}px;top:850px;height:${e.h}px;margin-top:-${e.h}px">${c.icono('tilde-circulo', 'blanco')}</div>`).join('')}
      ${ESC.map((e) => `<div class="est" style="left:${e.x + 40 - e.s / 2}px;top:${850 - e.h - 12 - e.s}px;width:${e.s}px;height:${e.s}px"><i></i></div>`).join('')}
      <div class="lema t">Cada trabajo,<br><mark>mejor</mark> que<br>el anterior</div>
      ${CHISPAS.map((s) => `<div class="chispa" style="left:${s.x}px;top:${s.y}px;width:${s.s}px;height:${s.s}px"><i></i></div>`).join('')}
    </div>
  `,
  armar(tl, $, c) {
    // Decorado y encabezado
    tl.fromTo($.all('.dz'), { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(2)', stagger: 0.1 }, 0.1);
    tl.fromTo($('.encabezado .kicker'), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0);
    entraTitulo(tl, $.all('.encabezado .l > span'), 0.12);

    // 0 · la app: tres celulares que suben juntos y se abren en abanico
    const tels = $.all('.tel0');
    tl.fromTo(tels[1]!, { y: 820 }, { y: 0, duration: 0.6, ease: 'power3.out' }, 0.3);
    tl.fromTo([tels[0]!, tels[2]!], { y: 820 }, { y: 0, duration: 0.6, ease: 'power3.out' }, 0.36);
    TEL0.forEach((p, i) => tl.fromTo(tels[i]!, { x: p.dx, rotation: 0 }, { x: 0, rotation: p.r, duration: 0.65, ease: 'back.out(1.4)' }, 0.74));
    tl.fromTo($.all('.cap'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out', stagger: 0.08 }, 1.1);
    tl.fromTo($('.r0'), { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: 'power3.out' }, 1.15);
    tl.fromTo($('.sticker'), { autoAlpha: 0, scale: 1.8, rotation: 18 }, { autoAlpha: 1, scale: 1, rotation: 6, duration: 0.42, ease: 'back.out(2.2)' }, 1.4);
    tl.fromTo($('.ll0'), { autoAlpha: 0, y: 140 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'back.out(1.8)' }, 0.95);
    $.all('.chip0').forEach((ch, i) =>
      tl.fromTo(ch, { autoAlpha: 0, x: -50, scale: 0.6 }, { autoAlpha: 1, x: 0, scale: 1, duration: 0.45, ease: 'back.out(2.2)' }, CHIPS0[i]!.t),
    );
    const aros = $.all('.aro0');
    tl.to(aros[0]!, { autoAlpha: 1, duration: 0.2 }, 1.85);
    tl.to(aros[0]!, { autoAlpha: 0, duration: 0.35 }, 2.35);
    tl.to(aros[2]!, { autoAlpha: 1, duration: 0.2 }, 2.3);
    tl.to(aros[2]!, { autoAlpha: 0, duration: 0.35 }, 3.0);

    // 1 · carrusel: la página del paso 0 se va y entran las seis herramientas por oficio
    tl.to($('.pag0'), { x: -1920, duration: 0.85, ease: 'power3.inOut' }, 3.4);
    const cols = $.all('.col');
    tl.fromTo(cols, { x: 1920 }, { x: 0, duration: 0.85, ease: 'power3.inOut', stagger: 0.05 }, 3.4);
    tl.fromTo($('.s1'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' }, 3.95);
    tl.fromTo($('.r1'), { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: 'power3.out' }, 4.2);
    cols.forEach((col, i) => {
      tl.fromTo(col.querySelector('.chip'), { autoAlpha: 0, y: 18, scale: 0.7 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.38, ease: 'back.out(2.2)' }, 4.45 + i * 0.08);
      tl.fromTo(col.querySelector('.pista'), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' }, 4.6 + i * 0.08);
    });
    // Electricidad pasa al frente
    tl.fromTo($('.col.top .tel1'), { scale: SO / SF, transformOrigin: '50% 100%' }, { scale: 1, duration: 0.6, ease: 'back.out(1.6)' }, 5.3);
    tl.fromTo($('.rayos'), { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'power2.out' }, 5.3);
    tl.fromTo($('.aro'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35 }, 5.5);
    tl.fromTo($('.col.top .chip'), { backgroundColor: '#ffffff' }, { backgroundColor: COLOR.amarillo, duration: 0.3 }, 5.5);

    // 2 · HandIA para profesionales: los oficios caen, llegan Llave y Foco-HandIA con sus sugerencias
    cols.forEach((col, i) => tl.to(col, { y: 900, rotation: i % 2 ? 6 : -6, autoAlpha: 0, duration: 0.48, ease: 'power2.in' }, 7.2 + i * 0.03));
    tl.to($('.fila1'), { autoAlpha: 0, y: -24, duration: 0.3, ease: 'power2.in' }, 7.2);
    tl.fromTo($('.s2'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' }, 7.55);
    tl.fromTo($('.r2'), { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: 'power3.out' }, 7.9);
    tl.fromTo($('.ll2'), { autoAlpha: 0, x: -340 }, { autoAlpha: 1, x: 0, duration: 0.6, ease: 'power3.out' }, 7.68);
    tl.fromTo($('.foco2'), { autoAlpha: 0, scale: 0.2, y: 160, rotation: -40 }, { autoAlpha: 1, scale: 1, y: 0, rotation: 0, duration: 0.7, ease: 'back.out(1.7)' }, 7.78);
    tl.fromTo($('.asist'), { autoAlpha: 0, x: -60, scale: 0.92, transformOrigin: '0% 20%' }, { autoAlpha: 1, x: 0, scale: 1, duration: 0.55, ease: 'back.out(1.5)' }, 7.85);
    tl.fromTo($.all('.chispa'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, stagger: 0.08 }, 7.95);
    $.all('.sug').forEach((s, i) => {
      tl.fromTo(s, { autoAlpha: 0, y: 26, scale: 0.92 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.42, ease: 'back.out(1.9)' }, 8.25 + i * 0.42);
      tl.fromTo(s.querySelector('.ic'), { scale: 0, rotation: -60 }, { scale: 1, rotation: 0, duration: 0.4, ease: 'back.out(2.6)' }, 8.35 + i * 0.42);
    });
    // Cada trabajo, mejor que el anterior: escalones que suben y estrellas que crecen
    tl.fromTo($.all('.esc'), { scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: 1, duration: 0.42, ease: 'back.out(1.5)', stagger: 0.1 }, 9.7);
    tl.fromTo($.all('.est'), { autoAlpha: 0, scale: 0, rotation: -90 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.4, ease: 'back.out(2.6)', stagger: 0.1 }, 9.9);
    tl.fromTo($('.lema'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' }, 10.15);

    // Poses (pintor: valen también en los saltos)
    const ll0 = $('.ll0 .pj');
    const ll2 = $('.ll2 .pj');
    const foco = $('.foco2 .pj');
    c.pintor((t) => {
      pose(ll0, t >= 3.4 ? 'b' : t >= 2.95 ? 'c' : t >= 1.85 ? 'a' : t >= 1.0 ? 'b' : 'a');
      pose(ll2, t >= 10.3 ? 'c' : t >= 8.35 ? 'a' : 'b');
      pose(foco, t >= 10.3 ? 'c' : t >= 8.3 ? 'a' : t >= 8.05 ? 'c' : 'd');
    });
  },
  ambiente(t, $) {
    // Herramientas del margen que flotan
    $.all('.dz-in').forEach((d, i) => (d.style.transform = `translateY(${Math.sin(t * 0.9 + i * 1.7) * 9}px) rotate(${Math.sin(t * 0.55 + i * 2.1) * 7}deg)`));
    // Celulares que se mecen (la línea de tiempo mueve el contenedor .tel)
    $.all('.tel .flota').forEach((f, i) => (f.style.transform = `translateY(${Math.sin(t * 1.15 + i * 0.85) * 6}px)`));
    // Respiración de los personajes
    $.all('.mov .pj').forEach((p, i) => (p.style.transform = `scaleY(${1 + Math.sin(t * 2.4 + i) * 0.02})`));
    // Rayos detrás de Electricidad, Foco-HandIA flotando con su aura, chispas y estrellas que titilan
    $('.giro').style.transform = `rotate(${t * 7}deg)`;
    $('.foco2 .flota').style.transform = `translateY(${Math.sin(t * 1.6) * 10}px)`;
    $('.halo').style.transform = `scale(${1 + Math.sin(t * 2.2) * 0.07})`;
    $.all('.chispa i').forEach((s, i) => {
      const k = (Math.sin(t * 2.7 + i * 1.9) + 1) / 2;
      s.style.transform = `scale(${0.45 + k * 0.65}) rotate(${t * 30 + i * 40}deg)`;
      s.style.opacity = String(0.3 + k * 0.7);
    });
    $.all('.est i').forEach((s, i) => (s.style.transform = `scale(${1 + Math.sin(t * 3 + i * 0.8) * 0.06})`));
  },
});
