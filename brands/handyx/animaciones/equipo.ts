// Diapositiva 7 · Equipo, inversión y visión. Un golpe por frase del guion:
// 0 «Somos un equipo chico, pero nuestros sueños no lo son.» → las dos personas del equipo y los Handys festejando ·
// 1 «Desarrollé agentes de IA que superviso…» → constelación de agentes alrededor de Ignacio ·
// 2 «Buscamos cien mil dólares de inversión inicial…» → el monto, la barra del reparto y qué mejora cada parte ·
// 3 «Queremos llegar a Silicon Valley…» → el vuelo de Mar del Plata a Silicon Valley ·
// 4 «Hoy empezamos en Mar del Plata…» → fundido a noche (lo toma el video del mundo) ·
// 5 cierre: amanece, «¡Muchas gracias!» y los dos QR del deck (landing y portafolio) entre Foco y Llave, que saludan.
import { COLOR, entraTitulo, escena, pose, tramo } from './comun/kit.ts';

// Constelación (paso 1): la tarjeta de Ignacio en el centro y los agentes sobre una elipse. Ángulos simétricos con un
// hueco arriba para el rótulo del anillo; ninguno pisa la tarjeta (ni con el vaivén de ±4°).
const C = { x: 700, y: 570 };
const RX = 520;
const RY = 230;
const AGENTES = [
  { ic: 'megafono', txt: 'Marketing', a: -40 },
  { ic: 'crecimiento', txt: 'Ventas', a: 12 },
  { ic: 'ia', txt: 'Datos', a: 64 },
  { ic: 'herramienta', txt: 'Operaciones', a: 116 },
  { ic: 'chat', txt: 'Soporte', a: 168 },
  { ic: 'codigo', txt: 'Desarrollo', a: 220 },
];
const T_AG = 3.65; // los agentes salen de la tarjeta de Ignacio
// Tarjetas del equipo: lugar en el paso 0 (fila centrada) y en el paso 1 (Ignacio al centro, su pareja a la derecha).
const TARJ = { w: 480, h: 190, top: 475, ig: 440, pa: 1000, pa1: 1344 };

// Reparto de la inversión (paso 2): qué mejora cada parte de la app.
const PARTES = [
  { id: 'INV-MARKETING', ic: 'megafono', txt: 'Marketing', que: 'Publicidades con IA (Seedance 2.5), redes y marketing en la calle', color: COLOR.azul, clase: 'blanco' },
  { id: 'INV-OPERACIONES', ic: 'escuela', txt: 'Operaciones', que: 'Formar y acompañar a los profesionales', color: COLOR.verde, clase: 'blanco' },
  { id: 'INV-TECNOLOGIA', ic: 'cerebro', txt: 'Tecnología', que: 'HandIA premium, HandIA para profesionales y herramientas', color: COLOR.amarillo, clase: '' },
  { id: 'INV-LEGAL', ic: 'balanza', txt: 'Legal y reserva', que: 'Incluye lo contable', color: '#CBD5E6', clase: '' },
];
const T_SEG = [7.55, 8.05, 8.5, 8.85];

// Vuelo (paso 3): de Mar del Plata a Silicon Valley sobre un planeta de puntos.
const MDP = { x: 1380, y: 770 };
const SV = { x: 520, y: 580 };
const RUTA = `M ${MDP.x} ${MDP.y} Q 1000 120 ${SV.x} ${SV.y}`;
const VUELO = [11.4, 12.95] as const;
const GLOBO = { x: 960, y: 1720, r: 1200 };
// Avión de Lucide (ISC), con la nariz hacia arriba a la derecha (-45°).
const AVION =
  'M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z';

const CHISPAS: Array<[number, number, number]> = [
  [400, 430, 40], [930, 400, 30], [1530, 425, 44], [560, 745, 30], [1380, 755, 36], [960, 800, 26], [300, 350, 26], [1690, 355, 28],
];

const salida = (k: number) => 1 - (1 - k) ** 3;
const vaiven = (k: number) => (k < 0.5 ? 2 * k ** 2 : 1 - (-2 * k + 2) ** 2 / 2);

export default escena({
  marcas: [0, 3.0, 6.6, 10.6, 13.8, 14.6, 17.6],
  leyendas: ['Un equipo chico, con **sueños grandes**', 'Agentes de IA **supervisados por Ignacio**', 'La inversión: **qué mejora cada dólar**', 'Próximo destino: **Silicon Valley**', '', ''],
  cara: [
    { desde: 0, x: 1740, y: 170, d: 250 },
    { desde: 1, x: 1740, y: 170, d: 250 },
    { desde: 2, x: 1740, y: 170, d: 250 },
    { desde: 3, x: 1740, y: 170, d: 250 },
    { desde: 4, x: 1740, y: 170, d: 250 },
  ],
  css: `
    .fondo { position: absolute; inset: 0; background: ${COLOR.hueso}; }
    .sol { position: absolute; left: 960px; top: ${C.y}px; width: 1500px; height: 1500px; margin: -750px 0 0 -750px; }
    .rayos { position: absolute; inset: 0; border-radius: 50%; background: repeating-conic-gradient(rgba(255,201,60,.24) 0 8deg, transparent 8deg 20deg); -webkit-mask-image: radial-gradient(circle, #000 16%, transparent 56%); mask-image: radial-gradient(circle, #000 16%, transparent 56%); }
    .cab { position: absolute; left: 96px; top: 60px; }
    .cab .titulo { margin-top: 12px; font-size: 72px; }
    .chispas { position: absolute; inset: 0; }
    .chispa { position: absolute; }
    .chispa .icono { width: 100%; height: 100%; }
    .persona { position: absolute; top: ${TARJ.top}px; width: ${TARJ.w}px; height: ${TARJ.h}px; display: flex; align-items: center; gap: 24px; padding: 0 28px; }
    .persona.ig { left: ${TARJ.ig}px; } .persona.pa { left: ${TARJ.pa}px; }
    .av { flex: none; width: 108px; height: 108px; border-radius: 50%; display: grid; place-items: center; font-size: 42px; color: #fff; background: ${COLOR.azul}; box-shadow: 0 6px 0 ${COLOR.azulOscuro}; }
    .av.oro { background: ${COLOR.amarillo}; box-shadow: 0 6px 0 #C9971E; }
    .av .icono { width: 54px; height: 54px; }
    .nom { font-size: 38px; }
    .tag { margin-top: 6px; font-weight: 800; font-size: 20px; letter-spacing: .06em; text-transform: uppercase; color: ${COLOR.azul}; }
    .rol { margin-top: 4px; font-size: 24px; font-weight: 600; line-height: 1.22; color: ${COLOR.texto}; }
    .asoma { position: absolute; top: ${TARJ.top - 120}px; }
    .asoma.a1 { left: 476px; } .asoma.a2 { left: 1296px; }
    .lado { position: absolute; top: ${TARJ.top + 50}px; }
    .lado.l1 { left: 196px; } .lado.l2 { left: 1534px; }
    .anillo, .red { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; overflow: visible; }
    .anillo { transform-origin: ${C.x}px ${C.y}px; }
    .orb { position: absolute; left: 0; top: 0; width: 170px; height: 120px; }
    .ag { position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; background: #fff; border-radius: 24px; box-shadow: 0 14px 30px rgba(14,29,54,.18), 0 3px 0 ${COLOR.borde}; font-weight: 800; font-size: 22px; color: ${COLOR.azulOscuro}; }
    .ag .icono { width: 44px; height: 44px; }
    .ag .ia { position: absolute; right: -12px; top: -14px; padding: 1px 10px; border-radius: 999px; background: ${COLOR.amarillo}; color: ${COLOR.noche}; font-size: 20px; font-weight: 900; box-shadow: 0 4px 0 #C9971E; }
    .sup { position: absolute; left: ${C.x - 300}px; top: ${C.y - RY - 26}px; width: 600px; display: flex; justify-content: center; }
    .sup .chip { color: ${COLOR.azulOscuro}; box-shadow: 0 0 0 3px ${COLOR.azul}, 0 10px 22px rgba(14,29,54,.16); }
    .monto { position: absolute; left: 90px; top: 98px; font-size: 160px; color: ${COLOR.azul}; white-space: nowrap; }
    .monto-lbl { position: absolute; left: 98px; top: 272px; font-size: 34px; font-weight: 800; }
    .propuesta { position: absolute; right: 96px; top: 312px; font-size: 20px; color: ${COLOR.suave}; background: transparent; box-shadow: inset 0 0 0 2px ${COLOR.borde}; }
    .barra { position: absolute; left: 96px; top: 372px; width: 1728px; height: 84px; display: flex; gap: 6px; padding: 6px; border-radius: 24px; background: #E4E9F2; transform-origin: 0 50%; }
    .seg { position: relative; height: 100%; min-width: 0; }
    .seg .relleno { position: absolute; inset: 0; border-radius: 18px; transform-origin: 0 50%; }
    .seg .icono { position: absolute; left: 50%; top: 50%; width: 40px; height: 40px; margin: -20px 0 0 -20px; }
    .partes { position: absolute; left: 96px; top: 492px; width: 1728px; display: flex; gap: 24px; }
    .parte { flex: 1 1 0; padding: 22px 26px 24px; }
    .parte .cabeza { display: flex; align-items: center; gap: 16px; }
    .parte .cuadro { flex: none; width: 58px; height: 58px; border-radius: 16px; display: grid; place-items: center; }
    .parte .cuadro .icono { width: 32px; height: 32px; }
    .parte .cifra { font-size: 40px; white-space: nowrap; }
    .parte .nombre { margin-top: 12px; font-size: 26px; font-weight: 800; }
    .parte .que { margin-top: 4px; font-size: 24px; font-weight: 600; line-height: 1.25; color: ${COLOR.texto}; }
    .franja { position: absolute; left: 96px; top: 752px; width: 1728px; height: 96px; display: flex; align-items: center; gap: 24px; padding: 0 30px; border-radius: 28px; background: ${COLOR.azulOscuro}; color: #fff; font-size: 26px; font-weight: 600; white-space: nowrap; box-shadow: 0 16px 34px rgba(14,29,54,.2); }
    .franja .chip { font-size: 20px; padding: 8px 16px; color: ${COLOR.noche}; box-shadow: none; }
    .franja .it { display: flex; align-items: center; gap: 12px; }
    .franja .it .icono { width: 36px; height: 36px; }
    .franja b { font-family: var(--fuente-titulos, 'Archivo Variable', 'Archivo', sans-serif); font-weight: 900; font-stretch: 118%; font-size: 36px; color: ${COLOR.amarillo}; }
    .franja .sep { flex: none; width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,.35); }
    .noche { position: absolute; inset: 0; background: ${COLOR.azulOscuro}; overflow: hidden; }
    .noche .kicker { position: absolute; left: 96px; top: 62px; color: ${COLOR.amarillo}; }
    .estrella { position: absolute; border-radius: 50%; background: #fff; }
    .globo { position: absolute; left: ${GLOBO.x - GLOBO.r}px; top: ${GLOBO.y - GLOBO.r}px; width: ${GLOBO.r * 2}px; height: ${GLOBO.r * 2}px; border-radius: 50%; background-color: #1A4382; background-image: radial-gradient(circle, rgba(255,255,255,.17) 2.4px, transparent 3px); background-size: 26px 26px; box-shadow: 0 0 0 12px rgba(111,163,234,.10), 0 0 140px rgba(111,163,234,.40); }
    .vuelo { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; overflow: visible; }
    .estela circle { fill: ${COLOR.amarillo}; }
    .pin { position: absolute; width: 0; height: 0; }
    .pin .cuerpo { position: absolute; left: -30px; top: -74px; width: 60px; height: 60px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); background: #fff; box-shadow: 0 10px 24px rgba(0,0,0,.35); }
    .pin .cuerpo::after { content: ''; position: absolute; left: 18px; top: 18px; width: 24px; height: 24px; border-radius: 50%; background: ${COLOR.azul}; }
    .pin.sv .cuerpo { background: ${COLOR.amarillo}; }
    .pin.sv .cuerpo::after { background: ${COLOR.noche}; }
    .pin .base { position: absolute; left: -20px; top: -8px; width: 40px; height: 16px; border-radius: 50%; background: rgba(0,0,0,.35); }
    .pin .lbl { position: absolute; left: 0; top: 22px; transform: translateX(-50%); font-size: 26px; color: ${COLOR.noche}; }
    .pulso { position: absolute; left: -64px; top: -22px; width: 128px; height: 44px; border-radius: 50%; border: 4px solid ${COLOR.amarillo}; }
    .despide { position: absolute; top: ${MDP.y - 100}px; }
    .despide.d1 { left: 1480px; } .despide.d2 { left: 1610px; }
    .destino { position: absolute; left: 140px; top: 640px; gap: 14px; padding: 14px 28px 14px 16px; font-size: 30px; font-weight: 600; color: ${COLOR.noche}; }
    .destino b { font-weight: 900; }
    .destino .redondo { width: 52px; height: 52px; border-radius: 50%; display: grid; place-items: center; background: ${COLOR.amarillo}; }
    .destino .redondo .icono { width: 30px; height: 30px; }
    .avion { position: absolute; left: 0; top: 0; width: 68px; height: 68px; overflow: visible; filter: drop-shadow(0 6px 10px rgba(0,0,0,.35)); }
    .telon { position: absolute; inset: 0; background: ${COLOR.noche}; }
    /* 5 · cierre: los QR son elementos del deck (tarjetas del motor) centrados en x 660 y 1260, de y 324 a ≈ 830 */
    .cierre { position: absolute; inset: 0; background: ${COLOR.hueso}; overflow: hidden; }
    .cierre .sol2 { position: absolute; left: 960px; top: 590px; width: 1800px; height: 1800px; margin: -900px 0 0 -900px; border-radius: 50%; background: repeating-conic-gradient(rgba(255,201,60,.2) 0 8deg, transparent 8deg 20deg); -webkit-mask-image: radial-gradient(circle, #000 14%, transparent 58%); mask-image: radial-gradient(circle, #000 14%, transparent 58%); }
    .cierre .cab2 { position: absolute; left: 0; right: 0; top: 64px; text-align: center; }
    .cierre .cab2 .titulo { margin-top: 12px; font-size: 84px; }
    .cierre .marco { position: absolute; top: 314px; height: 530px; border-radius: 40px; background: rgba(31,87,168,.06); box-shadow: inset 0 0 0 3px rgba(31,87,168,.12); }
    .cierre .marco.m1 { left: 420px; width: 480px; } .cierre .marco.m2 { left: 966px; width: 588px; }
    .cierre .firma { position: absolute; left: 0; right: 0; top: 872px; text-align: center; font-size: 30px; font-weight: 600; color: ${COLOR.azulOscuro}; }
    .cierre .firma b { font-weight: 900; }
    .cierre .hola { position: absolute; top: 520px; }
    .cierre .hola.h1 { left: 150px; } .cierre .hola.h2 { left: 1610px; }
    .cierre .chica { position: absolute; top: 742px; }
    .cierre .chica.c1 { left: 300px; } .cierre .chica.c2 { left: 1530px; }
  `,
  html: (c) => {
    const superficie = (x: number) => GLOBO.y - Math.sqrt(Math.max(0, GLOBO.r ** 2 - (x - GLOBO.x) ** 2));
    const estrellas = Array.from({ length: 70 }, () => ({ x: 30 + c.azar() * 1860, y: 20 + c.azar() * 560, r: 1.6 + c.azar() * 2.6 }))
      .filter((e) => e.y < superficie(e.x) - 24)
      .map((e) => `<i class="estrella" style="left:${e.x.toFixed(0)}px;top:${e.y.toFixed(0)}px;width:${(e.r * 2).toFixed(1)}px;height:${(e.r * 2).toFixed(1)}px"></i>`)
      .join('');
    return `
    <div class="fondo"></div>
    <div class="sol"><div class="rayos"></div></div>
    <svg class="anillo" viewBox="0 0 1920 1080">
      <ellipse cx="${C.x}" cy="${C.y}" rx="${RX}" ry="${RY}" fill="rgba(31,87,168,.05)" stroke="${COLOR.azul}" stroke-opacity=".4" stroke-width="3" stroke-dasharray="2 14" stroke-linecap="round"/>
      ${[0, 1, 2].map(() => `<circle class="sat" r="8" fill="${COLOR.amarillo}" stroke="#fff" stroke-width="3"/>`).join('')}
    </svg>
    <svg class="red" viewBox="0 0 1920 1080">${AGENTES.map(() => `<line class="hilo" x1="${C.x}" y1="${C.y}" x2="${C.x}" y2="${C.y}" stroke="${COLOR.azul}" stroke-opacity=".55" stroke-width="3" stroke-dasharray="7 9" stroke-linecap="round"/>`).join('')}</svg>
    <div class="chispas">${CHISPAS.map(([x, y, s]) => `<div class="chispa" style="left:${x - s / 2}px;top:${y - s / 2}px;width:${s}px;height:${s}px">${c.icono('sparkles', 'oro')}</div>`).join('')}</div>
    <div class="mov asoma a1">${c.pj('bombilla', '', 160)}</div>
    <div class="mov asoma a2">${c.pj('llave', '', 160)}</div>
    ${AGENTES.map((a) => `<div class="orb"><div class="ag">${c.icono(a.ic)}${a.txt}<span class="ia">IA</span></div></div>`).join('')}
    <div class="persona tarjeta ig"><div class="av t">IG</div><div><div class="nom t">Ignacio</div><div class="tag">Fundador</div><div class="rol">Desarrollo, producto y coordinación</div></div></div>
    <div class="persona tarjeta pa"><div class="av oro">${c.icono('sparkles')}</div><div><div class="nom t">Su pareja</div><div class="tag">Diseño y marketing</div><div class="rol">Dedicación parcial</div></div></div>
    <div class="sup"><span class="chip">${c.icono('escudo-ok')}Supervisados por Ignacio</span></div>
    <div class="mov lado l1">${c.pj('gota', '', 190)}</div>
    <div class="mov lado l2">${c.pj('engranaje', '', 190)}</div>
    <div class="cab"><div class="kicker">Equipo e inversión</div><div class="titulo t"><span class="l"><span>Somos un equipo chico,</span></span><span class="l"><span>pero <mark>nuestros sueños no lo son.</mark></span></span></div></div>
    <div class="monto t"><span class="n"></span></div>
    <div class="monto-lbl">inversión inicial buscada</div>
    <div class="propuesta chip">Propuesta de asignación · a aprobar</div>
    <div class="barra">${PARTES.map((p) => `<div class="seg" style="flex:${c.valor(p.id) ?? 0} 1 0"><i class="relleno" style="background:${p.color}"></i>${c.icono(p.ic, p.clase)}</div>`).join('')}</div>
    <div class="partes">${PARTES.map((p) => `<div class="parte tarjeta"><div class="cabeza"><span class="cuadro" style="background:${p.color}">${c.icono(p.ic, p.clase)}</span><span class="cifra t">${c.cifra(p.id)}</span></div><div class="nombre">${p.txt}</div><div class="que">${p.que}</div></div>`).join('')}</div>
    <div class="franja"><span class="chip amarillo">Visión · con la inversión</span>
      <span class="it">${c.icono('crecimiento', 'blanco')}<span><b>${c.cifra('PROF-POR-MES')}</b> profesiones nuevas por mes, cada una con sus herramientas</span></span><i class="sep"></i>
      <span class="it">${c.icono('ubicacion', 'blanco')}<span>Toda Buenos Aires en <b>${c.cifra('META-BA-MESES')}</b> meses</span></span></div>
    <div class="noche">
      ${estrellas}
      <div class="globo"></div>
      <svg class="vuelo" viewBox="0 0 1920 1080"><path class="ruta" d="${RUTA}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="4" stroke-dasharray="3 16" stroke-linecap="round"/><g class="estela"></g></svg>
      <div class="pin mdp" style="left:${MDP.x}px;top:${MDP.y}px"><i class="base"></i><i class="cuerpo"></i><span class="lbl chip">Mar del Plata</span></div>
      <div class="pin sv" style="left:${SV.x}px;top:${SV.y}px"><i class="pulso"></i><i class="pulso"></i><i class="base"></i><i class="cuerpo"></i></div>
      <div class="mov despide d1">${c.pj('bombilla', '', 150)}</div>
      <div class="mov despide d2">${c.pj('llave', '', 150)}</div>
      <div class="destino chip"><span class="redondo">${c.icono('cohete')}</span><span><b>Silicon Valley:</b> aprender y conectar con mentores e inversores</span></div>
      <svg class="avion" viewBox="0 0 24 24"><path d="${AVION}" fill="#fff" stroke="${COLOR.noche}" stroke-width=".9" stroke-linejoin="round"/></svg>
      <div class="kicker">Visión</div>
    </div>
    <div class="telon"></div>
    <div class="cierre">
      <div class="sol2"></div>
      <i class="marco m1"></i><i class="marco m2"></i>
      <div class="cab2"><div class="kicker">Handyx · ATICMA 2026</div><div class="titulo t"><span class="l"><span>¡Muchas <mark>gracias!</mark></span></span></div></div>
      <div class="mov hola h1">${c.pj('bombilla', '', 230)}</div>
      <div class="mov hola h2">${c.pj('llave', '', 230)}</div>
      <div class="mov chica c1">${c.pj('gota', '', 120)}</div>
      <div class="mov chica c2">${c.pj('engranaje', '', 120)}</div>
      <div class="firma"><b>Ignacio Gauna</b> · fundador y CEO de Handyx</div>
    </div>
  `;
  },
  armar(tl, $, c) {
    const titulo = $.all('.cab .l > span');
    const tarjetas = [$('.persona.ig'), $('.persona.pa')];
    const asoman = $.all('.asoma');
    const lados = $.all('.lado');
    const agentes = $.all('.ag');
    const hilos = $.all('.hilo');
    // 0 · el equipo: chico, con sueños grandes
    tl.fromTo($('.sol'), { autoAlpha: 0, scale: 0.45 }, { autoAlpha: 1, scale: 1, duration: 1.5, ease: 'power2.out' }, 0);
    tl.fromTo($('.cab .kicker'), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.05);
    entraTitulo(tl, titulo, 0.15);
    tl.fromTo(tarjetas, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'back.out(1.6)', stagger: 0.15 }, 0.75);
    tl.fromTo(asoman, { autoAlpha: 0, y: 130 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'back.out(1.8)', stagger: 0.15 }, 1.45);
    tl.fromTo(lados, { autoAlpha: 0, y: 90 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'back.out(1.8)', stagger: 0.12 }, 1.6);
    tl.fromTo($('.chispas'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 1.75);
    // 1 · agentes de IA que Ignacio desarrolló y supervisa
    tl.to(asoman, { autoAlpha: 0, y: 130, duration: 0.3, ease: 'power2.in' }, 3.0);
    tl.to(lados, { autoAlpha: 0, y: 70, duration: 0.3, ease: 'power2.in' }, 3.0);
    tl.to($('.chispas'), { autoAlpha: 0, duration: 0.3 }, 3.0);
    tl.to($('.sol'), { autoAlpha: 0, scale: 0.7, duration: 0.5, ease: 'power2.in' }, 3.0);
    const y1 = C.y - TARJ.h / 2 - TARJ.top;
    tl.to(tarjetas[0]!, { x: C.x - TARJ.w / 2 - TARJ.ig, y: y1, duration: 0.6, ease: 'power3.inOut' }, 3.1);
    tl.to(tarjetas[1]!, { x: TARJ.pa1 - TARJ.pa, y: y1, duration: 0.6, ease: 'power3.inOut' }, 3.1);
    tl.fromTo($('.anillo'), { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'power3.out' }, 3.45);
    agentes.forEach((a, i) => tl.fromTo(a, { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, T_AG + i * 0.12));
    tl.fromTo(hilos, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, stagger: 0.12 }, T_AG);
    tl.fromTo($('.sup .chip'), { autoAlpha: 0, y: 16, scale: 0.8 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(2)' }, 4.6);
    // 2 · la inversión y qué mejora cada parte
    tl.to(titulo, { yPercent: -140, duration: 0.45, ease: 'power3.in', stagger: 0.06 }, 6.6);
    tl.to([...agentes, $('.sup .chip')], { autoAlpha: 0, scale: 0.6, duration: 0.35, ease: 'power2.in', stagger: 0.03 }, 6.6);
    tl.to(hilos, { autoAlpha: 0, duration: 0.3 }, 6.6);
    tl.to($('.anillo'), { autoAlpha: 0, scale: 0.6, duration: 0.4, ease: 'power2.in' }, 6.6);
    tl.to(tarjetas, { autoAlpha: 0, scale: 0.9, duration: 0.35, ease: 'power2.in', stagger: 0.05 }, 6.65);
    tl.fromTo($('.monto'), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 6.9);
    c.contador($('.monto .n'), { t0: 6.95, dur: 1.4, hasta: c.valor('INV-TOTAL') ?? 0, antes: 'USD ' });
    tl.fromTo($('.monto-lbl'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 7.15);
    tl.fromTo($('.barra'), { autoAlpha: 0, scaleX: 0.96 }, { autoAlpha: 1, scaleX: 1, duration: 0.4, ease: 'power2.out' }, 7.3);
    tl.fromTo($('.propuesta'), { autoAlpha: 0, x: 24 }, { autoAlpha: 1, x: 0, duration: 0.4 }, 7.4);
    const rellenos = $.all('.seg .relleno');
    const iconosSeg = $.all('.seg .icono');
    $.all('.parte').forEach((p, i) => {
      const t0 = T_SEG[i] ?? 9;
      tl.fromTo(rellenos[i]!, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power2.out' }, t0);
      tl.fromTo(iconosSeg[i]!, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' }, t0 + 0.3);
      tl.fromTo(p, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'back.out(1.6)' }, t0 + 0.1);
    });
    tl.fromTo($('.franja'), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out' }, 9.3);
    // 3 · Silicon Valley: la noche se abre desde Mar del Plata y sale el vuelo
    tl.fromTo($('.noche'), { clipPath: `circle(0px at ${MDP.x}px ${MDP.y}px)` }, { clipPath: `circle(1700px at ${MDP.x}px ${MDP.y}px)`, duration: 0.85, ease: 'power2.inOut' }, 10.6);
    tl.fromTo($('.globo'), { y: 160 }, { y: 0, duration: 0.9, ease: 'power3.out' }, 10.65);
    tl.fromTo($('.noche .kicker'), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 10.85);
    tl.fromTo($('.pin.mdp'), { autoAlpha: 0, y: -60 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'bounce.out' }, 10.95);
    tl.fromTo($.all('.despide'), { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'back.out(1.8)', stagger: 0.1 }, 11.05);
    tl.fromTo($('.ruta'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 11.1);
    tl.fromTo($('.pin.sv'), { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(2.2)' }, 11.2);
    tl.fromTo($('.destino'), { autoAlpha: 0, y: 24, scale: 0.92 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.8)' }, 11.35);
    tl.fromTo($('.avion'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, VUELO[0]);
    // 4 · fundido a noche: lo toma el video del mundo
    tl.fromTo($('.telon'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, ease: 'power1.inOut' }, 13.8);
    // 5 · cierre: amanece y quedan los QR (los dibuja el motor encima, en los marcos)
    tl.fromTo($('.cierre'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7, ease: 'power1.inOut' }, 14.6);
    tl.fromTo($('.cierre .sol2'), { scale: 0.5 }, { scale: 1, duration: 1.6, ease: 'power2.out' }, 14.6);
    tl.fromTo($('.cierre .kicker'), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 14.8);
    entraTitulo(tl, $.all('.cierre .cab2 .l > span'), 14.9);
    tl.fromTo($.all('.cierre .marco'), { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'power3.out', stagger: 0.1 }, 15.0);
    tl.fromTo($.all('.cierre .hola'), { autoAlpha: 0, y: 140 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)', stagger: 0.12 }, 15.3);
    tl.fromTo($.all('.cierre .chica'), { autoAlpha: 0, y: 80 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'back.out(1.9)', stagger: 0.1 }, 15.6);
    tl.fromTo($('.cierre .firma'), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.45 }, 15.9);

    // Vuelo: el avión sigue la ruta y deja una estela de puntos (pintor: vale también en los saltos)
    const ruta = $('.ruta') as unknown as SVGPathElement;
    const largo = ruta.getTotalLength();
    const estela = $('.estela');
    const puntos: SVGCircleElement[] = [];
    for (let i = 1; i <= 34; i++) {
      const p = ruta.getPointAtLength((largo * i) / 34);
      const punto = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      punto.setAttribute('cx', p.x.toFixed(1));
      punto.setAttribute('cy', p.y.toFixed(1));
      punto.setAttribute('r', '5');
      estela.append(punto);
      puntos.push(punto);
    }
    const avion = $('.avion');
    c.pintor((t) => {
      const d = largo * 0.9 * vaiven(tramo(t, VUELO[0], VUELO[1]));
      const p = ruta.getPointAtLength(d);
      const a = ruta.getPointAtLength(Math.max(0, d - 2));
      const b = ruta.getPointAtLength(Math.min(largo, d + 2));
      const giro = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI + 45;
      avion.style.transform = `translate(${(p.x - 34).toFixed(1)}px, ${(p.y - 34).toFixed(1)}px) rotate(${giro.toFixed(1)}deg)`;
      puntos.forEach((pt, i) => (pt.style.opacity = (largo * (i + 1)) / 34 <= d - 46 ? '1' : '0'));
      // Poses: saludo al asomar, festejo cuando suenan los sueños; en Mar del Plata despiden el vuelo y festejan al llegar
      pose($('.asoma.a1 .pj'), t >= 2.0 ? 'c' : 'b');
      pose($('.asoma.a2 .pj'), t >= 2.1 ? 'c' : 'b');
      pose($('.lado.l1 .pj'), t >= 1.6 ? 'c' : 'a');
      pose($('.lado.l2 .pj'), t >= 1.7 ? 'c' : 'a');
      for (const el of $.all('.despide .pj')) pose(el, t >= 12.7 ? 'c' : 'b');
      // Cierre: Foco y Llave saludan y festejan; los chicos festejan
      pose($('.hola.h1 .pj'), t >= 16.6 ? 'c' : 'b');
      pose($('.hola.h2 .pj'), t >= 16.75 ? 'c' : 'b');
      for (const el of $.all('.chica .pj')) pose(el, t >= 16.2 ? 'c' : 'a');
    });
  },
  ambiente(t, $, tl) {
    // Respiración de los personajes (dueño: el ambiente; las entradas mueven el contenedor .mov)
    $.all('.mov .pj').forEach((p, i) => (p.style.transform = `scaleY(${1 + Math.sin(t * 2.4 + i) * 0.018})`));
    $('.rayos').style.transform = `rotate(${(t * 3).toFixed(2)}deg)`;
    $.all('.chispa').forEach((s, i) => {
      const k = 0.5 + 0.5 * Math.sin(t * 2.1 + i * 1.9);
      s.style.transform = `scale(${(0.7 + 0.35 * k).toFixed(3)}) rotate(${(Math.sin(t * 0.8 + i) * 12).toFixed(1)}deg)`;
      s.style.opacity = (0.55 + 0.45 * k).toFixed(3);
    });
    // Agentes: salen de la tarjeta de Ignacio a su lugar en el anillo y quedan en órbita suave; los hilos los siguen
    const hilos = $.all('.hilo');
    $.all('.orb').forEach((o, i) => {
      const ag = AGENTES[i];
      if (!ag) return;
      const r = salida(tramo(tl, T_AG + i * 0.12, T_AG + i * 0.12 + 0.75));
      const ang = ((ag.a + Math.sin(t * 0.45 + i * 1.3) * 4) * Math.PI) / 180;
      const x = C.x + Math.cos(ang) * RX * r;
      const y = C.y + (Math.sin(ang) * RY + Math.sin(t * 1.2 + i * 1.7) * 6) * r;
      o.style.transform = `translate(${(x - 85).toFixed(1)}px, ${(y - 60).toFixed(1)}px)`;
      const h = hilos[i];
      if (h) {
        h.setAttribute('x2', x.toFixed(1));
        h.setAttribute('y2', y.toFixed(1));
        h.style.strokeDashoffset = (-t * 28).toFixed(1);
      }
    });
    $.all('.sat').forEach((s, i) => {
      const a = t * 0.32 + (i * Math.PI * 2) / 3;
      s.setAttribute('cx', (C.x + Math.cos(a) * RX).toFixed(1));
      s.setAttribute('cy', (C.y + Math.sin(a) * RY).toFixed(1));
    });
    $('.anillo ellipse').style.strokeDashoffset = (-t * 12).toFixed(1);
    // Noche: estrellas que titilan y pulso en Silicon Valley cuando llega el avión
    $.all('.estrella').forEach((e, i) => (e.style.opacity = (0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * 1.6 + i * 2.3))).toFixed(3)));
    const llega = tramo(tl, 12.6, 12.95);
    $.all('.pulso').forEach((p, i) => {
      const f = (t * 0.6 + i * 0.5) % 1;
      p.style.transform = `scale(${(0.3 + f * 1.1).toFixed(3)})`;
      p.style.opacity = ((1 - f) * llega).toFixed(3);
    });
  },
});
