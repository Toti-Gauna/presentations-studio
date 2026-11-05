// Respaldo · Cómo crece Handyx. Un golpe por paso:
// 0 el núcleo (verificación, valoraciones, pagos y HandIA) con los Handys alrededor ·
// 1 Handyx for People: la rama se dibuja hacia la izquierda, cada Handy de oficio corre a su nodo y Foco saluda al final ·
// 2 Handyx for Business: la rama hacia la derecha, sus nodos y el local, que atiende Llave ·
// 3 todo se potencia: pulsos que van y vuelven por las dos ramas a través del núcleo, la expansión y la nota sobre las apps.
import { COLOR, entraTitulo, escena, pose, tramo, type Personaje, type Pose } from './comun/kit.ts';

const CX = 960; // centro del núcleo
const CY = 500;
const R_DISCO = 100;
const R_ORB = 195; // órbita de las fichas
const Y_ARCO = 240; // tramo horizontal de las dos ramas
const XP = 86; // columna de nodos de People
const XB = 1815; // columna de nodos de Business
const FIN_P = 745; // fin de la rama de People (Foco)
const FIN_B = 708; // fin de la rama de Business (el local)
const rama = (s: 1 | -1, x: number, fin: number) =>
  `M ${CX} ${CY} C ${CX} ${CY - 170}, ${CX + s * 60} ${Y_ARCO}, ${CX + s * 160} ${Y_ARCO} L ${x - s * 80} ${Y_ARCO} Q ${x} ${Y_ARCO} ${x} ${Y_ARCO + 80} L ${x} ${fin}`;

const FICHAS = [
  { ic: 'verificado', txt: 'Verificación' },
  { ic: 'estrella', txt: 'Valoraciones' },
  { ic: 'billetera', txt: 'Pagos' },
  { ic: 'ia', txt: 'HandIA' },
];
// La primera tarjeta de People se arma con cifras (mosaico + contador); las demás, ícono + texto.
const PEOPLE: Array<{ pj: Personaje; ic: string; h: string; s: string }> = [
  { pj: 'brocha', ic: '', h: '', s: '' },
  { pj: 'grifo', ic: 'camara', h: 'HandIA', s: 'de la foto al profesional indicado' },
  { pj: 'engranaje', ic: 'herramienta', h: 'Herramientas por oficio', s: 'y feedback con IA' },
  { pj: 'gota', ic: 'repetir', h: 'Clientes que vuelven', s: 'historial y valoraciones' },
  { pj: 'medidor_gas', ic: 'martillo', h: 'Ferreterías conectadas', s: 'materiales · a explorar' },
];
const P_TOP = 292;
const P_ALTO = 80;
const P_PASO = 90;
const yP = (i: number) => P_TOP + i * P_PASO + P_ALTO / 2;
const BUSINESS = [
  { ic: 'calendario', h: 'Personal por turnos', s: 'mozos, bartenders, cocina, por días o semanas', top: 292, alto: 110 },
  { ic: 'llave-inglesa', h: 'Mantenimiento del local', s: 'con técnicos verificados', top: 418, alto: 80 },
  { ic: 'celular', h: 'Apps a medida', s: 'para cada comercio, integradas a Handyx', top: 514, alto: 80 },
  { ic: 'balanza', h: 'Meritocracia', s: 'los mejor valorados, primero', top: 610, alto: 80 },
];
const yB = (j: number) => (BUSINESS[j]?.top ?? 0) + (BUSINESS[j]?.alto ?? 0) / 2;
// Momentos en que la punta de cada rama llega a cada nodo
const T_P = [3.95, 4.35, 4.75, 5.15, 5.55];
const T_B = [7.45, 7.85, 8.25, 8.65];
const T_LOCAL = 8.85; // se arma el local
const T_ATIENDE = 9.05; // Llave sale de la fila hacia el mostrador
const VUELO = 0.64;
// Fila de Handys del paso 0: los cinco de People y Llave, que después atiende el local
const FILA: Personaje[] = [...PEOPLE.map((p) => p.pj), 'llave'];
const H = 110;
const filaX = (i: number) => CX + (i - 2.5) * 125;
const FILA_PIE = 868;
const salida = (i: number) => (i < 5 ? (T_P[i] ?? 0) - VUELO + 0.02 : T_ATIENDE);

interface Clave {
  t: number;
  l: number;
}
const suave = (k: number) => (k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2);
function largo(claves: Clave[], t: number): number {
  const p = claves[0];
  if (!p || t <= p.t) return 0;
  for (let i = 0; i < claves.length - 1; i++) {
    const a = claves[i]!;
    const b = claves[i + 1]!;
    if (t <= b.t) return a.l + (b.l - a.l) * suave((t - a.t) / (b.t - a.t));
  }
  return claves[claves.length - 1]?.l ?? 0;
}
const camino = (el: HTMLElement) => el as unknown as SVGPathElement;

export default escena({
  marcas: [0, 2.8, 6.4, 10.0, 13.2],
  cara: [
    { desde: 0, x: 1720, y: 160, d: 250 },
    { desde: 1, x: 1720, y: 160, d: 250 },
    { desde: 2, x: 1720, y: 160, d: 250 },
    { desde: 3, x: 1720, y: 160, d: 250 },
  ],
  leyendas: [
    'Un mismo **núcleo**: verificación, valoraciones, pagos y HandIA',
    'Primera rama: **Handyx for People**, para los vecinos',
    'Segunda rama: **Handyx for Business**, para comercios',
    'Todo **se potencia** a través del núcleo',
  ],
  css: `
    .fondo { position: absolute; inset: 0; background-color: ${COLOR.hueso}; background-image: radial-gradient(rgba(31,87,168,.10) 1.6px, transparent 2.2px); background-size: 36px 36px; }
    .aros { position: absolute; inset: 0; }
    .aro { position: absolute; border-radius: 50%; border: 2px dashed rgba(31,87,168,.13); }
    .ramas { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; overflow: visible; z-index: 10; }
    .ramas path { fill: none; stroke-linecap: round; stroke-linejoin: round; }
    .borde-p { stroke: #E2A514; stroke-width: 17; }
    .linea-p { stroke: ${COLOR.amarillo}; stroke-width: 11; }
    .linea-b { stroke: ${COLOR.azul}; stroke-width: 12; }
    .chispa, .pulso { position: absolute; left: 0; top: 0; border-radius: 50%; background: #fff; opacity: 0; }
    .chispa { width: 28px; height: 28px; z-index: 13; }
    .chispa.cp, .pulso.ida { box-shadow: 0 0 0 6px rgba(255,201,60,.65), 0 0 26px 10px rgba(255,201,60,.8); }
    .chispa.cb, .pulso.vuelta { box-shadow: 0 0 0 6px rgba(31,87,168,.4), 0 0 24px 9px rgba(31,87,168,.5); }
    .pulso { width: 22px; height: 22px; z-index: 12; }
    .halo { position: absolute; left: ${CX - 260}px; top: ${CY - 260}px; width: 520px; height: 520px; z-index: 14; }
    .halo i { position: absolute; inset: 0; border-radius: 50%; background: radial-gradient(circle, rgba(255,201,60,.55) 0, rgba(255,201,60,.2) 40%, rgba(255,201,60,0) 68%); }
    .destello { position: absolute; left: ${CX - R_DISCO}px; top: ${CY - R_DISCO}px; width: ${2 * R_DISCO}px; height: ${2 * R_DISCO}px; border-radius: 50%; border: 8px solid ${COLOR.amarillo}; z-index: 15; }
    .orbita { position: absolute; left: ${CX - R_ORB}px; top: ${CY - R_ORB}px; width: ${2 * R_ORB}px; height: ${2 * R_ORB}px; z-index: 15; }
    .orbita i { position: absolute; inset: 0; border-radius: 50%; border: 3px dashed rgba(31,87,168,.28); }
    .disco { position: absolute; left: ${CX - R_DISCO}px; top: ${CY - R_DISCO}px; width: ${2 * R_DISCO}px; height: ${2 * R_DISCO}px; border-radius: 50%; background: #fff; z-index: 16; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 0 0 10px rgba(255,201,60,.55), 0 26px 50px rgba(14,29,54,.22); }
    .disco img { width: 158px; }
    .disco span { font-weight: 800; font-size: 20px; letter-spacing: .14em; text-transform: uppercase; color: ${COLOR.azul}; }
    .sat { position: absolute; left: 0; top: 0; width: 150px; height: 84px; z-index: 18; }
    .ficha { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; background: #fff; border-radius: 20px; box-shadow: 0 12px 26px rgba(14,29,54,.16), 0 3px 0 ${COLOR.borde}; font-weight: 800; font-size: 20px; color: ${COLOR.azulOscuro}; }
    .ficha .icono { width: 32px; height: 32px; }
    .pill { position: absolute; top: ${Y_ARCO - 30}px; height: 60px; display: flex; align-items: center; justify-content: center; gap: 12px; border-radius: 18px; z-index: 26; font-size: 28px; font-stretch: 112%; white-space: nowrap; }
    .pill.pp { left: 365px; width: 450px; background: ${COLOR.amarillo}; color: ${COLOR.noche}; box-shadow: 0 7px 0 #C9971E, 0 16px 30px rgba(14,29,54,.2); }
    .pill.pb { left: 1085px; width: 490px; background: ${COLOR.azul}; color: #fff; box-shadow: 0 7px 0 ${COLOR.azulOscuro}, 0 16px 30px rgba(14,29,54,.2); }
    .pill .tag { font-family: var(--fuente-texto, 'DM Sans Variable', 'DM Sans', sans-serif); font-stretch: 100%; font-size: 20px; font-weight: 800; letter-spacing: .06em; padding: 4px 10px; border-radius: 10px; background: #fff; color: ${COLOR.azulOscuro}; }
    .ins { position: absolute; width: 66px; height: 66px; margin: -33px 0 0 -33px; border-radius: 50%; background: #fff; box-shadow: 0 0 0 5px ${COLOR.amarillo}, 0 10px 20px rgba(14,29,54,.18); z-index: 22; }
    .punto { position: absolute; width: 30px; height: 30px; margin: -15px 0 0 -15px; border-radius: 50%; background: ${COLOR.azul}; box-shadow: 0 0 0 5px #fff, 0 6px 14px rgba(14,29,54,.25); z-index: 22; }
    .ins i, .punto i { position: absolute; inset: -10px; border-radius: 50%; opacity: 0; }
    .ins i { box-shadow: 0 0 24px 10px rgba(255,201,60,.95); }
    .punto i { box-shadow: 0 0 22px 9px rgba(31,87,168,.6); }
    .nodo { position: absolute; display: flex; align-items: center; gap: 12px; padding: 0 16px 0 14px; z-index: 24; border-radius: 20px; }
    .nodo .ic { flex: none; width: 48px; height: 48px; border-radius: 14px; display: grid; place-items: center; background: #FFF2CC; }
    .nodo.b .ic { background: ${COLOR.celeste}; }
    .nodo .ic .icono { width: 28px; height: 28px; }
    .nodo b { display: block; font-size: 24px; font-weight: 800; line-height: 1.15; color: ${COLOR.noche}; white-space: nowrap; }
    .nodo small { display: block; margin-top: 3px; font-size: 20px; font-weight: 500; line-height: 1.25; color: ${COLOR.suave}; }
    .mosaico { flex: none; display: grid; grid-auto-flow: column; grid-auto-columns: 8px; gap: 3px; padding: 6px; border-radius: 12px; background: #F1F1EC; }
    .mosaico i { display: block; width: 8px; height: 8px; border-radius: 2px; background: #D9DCE3; }
    .mosaico i.base { background: ${COLOR.azul}; }
    .mosaico i.on { background: ${COLOR.amarillo}; }
    .cuenta { color: ${COLOR.azul}; }
    .h, .foco { position: absolute; z-index: 30; transform-origin: 50% 100%; }
    .foco { left: ${XP - 65}px; top: ${FIN_P}px; width: 130px; height: 130px; }
    .l-cartel { position: absolute; left: ${XB - 45}px; top: ${FIN_B - 2}px; width: 90px; height: 34px; border-radius: 10px; background: ${COLOR.noche}; display: grid; place-items: center; z-index: 26; }
    .l-cartel .icono { width: 24px; height: 24px; }
    .l-toldo { position: absolute; left: ${XB - 93}px; top: ${FIN_B + 28}px; width: 186px; height: 44px; border-radius: 10px 10px 4px 4px; background: repeating-linear-gradient(90deg, ${COLOR.azul} 0 23px, #fff 23px 46px); box-shadow: 0 8px 0 rgba(14,29,54,.10), inset 0 0 0 3px rgba(14,29,54,.08); z-index: 25; transform-origin: 50% 0; }
    .l-frente { position: absolute; left: ${XB - 83}px; top: ${FIN_B + 60}px; width: 166px; height: 105px; border-radius: 0 0 12px 12px; background: #fff; box-shadow: inset 0 0 0 3px ${COLOR.borde}, 0 12px 26px rgba(14,29,54,.14); z-index: 23; transform-origin: 50% 100%; }
    .l-ventana { position: absolute; left: ${XB - 70}px; top: ${FIN_B + 78}px; width: 104px; height: 62px; border-radius: 10px; background: ${COLOR.celeste}; z-index: 24; }
    .l-puerta { position: absolute; left: ${XB + 43}px; top: ${FIN_B + 84}px; width: 32px; height: 81px; border-radius: 8px 8px 0 0; background: ${COLOR.azulOscuro}; z-index: 24; }
    .l-mostrador { position: absolute; left: ${XB - 75}px; top: ${FIN_B + 132}px; width: 114px; height: 33px; border-radius: 8px 8px 0 0; background: #D9DEE8; box-shadow: inset 0 6px 0 ${COLOR.amarillo}; z-index: 31; }
    .encabezado { position: absolute; left: 96px; top: 52px; z-index: 50; }
    .fila-k { display: flex; align-items: center; gap: 16px; }
    .rotulo { font-weight: 800; font-size: 20px; letter-spacing: .06em; text-transform: uppercase; color: ${COLOR.azulOscuro}; border: 3px solid ${COLOR.azulOscuro}; border-radius: 999px; padding: 3px 14px; }
    .encabezado .titulo { margin-top: 12px; }
    .lema { position: absolute; left: 1010px; top: 66px; width: 570px; z-index: 50; font-size: 28px; font-weight: 600; line-height: 1.28; color: ${COLOR.texto}; }
    .lema .l { display: block; overflow: hidden; padding-bottom: 4px; margin-bottom: -4px; }
    .lema .l > span { display: inline-block; }
    .lema b { color: ${COLOR.azul}; font-weight: 800; }
    .expansion { position: absolute; left: 196px; top: 796px; height: 68px; display: flex; align-items: center; gap: 14px; padding: 0 26px; z-index: 40; border-radius: 22px; font-size: 22px; font-weight: 600; white-space: nowrap; }
    .expansion b { font-weight: 800; color: ${COLOR.azulOscuro}; }
    .parada { display: flex; align-items: center; gap: 10px; }
    .parada .icono { width: 30px; height: 30px; }
    .flecha { display: block; position: relative; width: 40px; height: 6px; border-radius: 3px; background: ${COLOR.amarillo}; transform-origin: 0 50%; }
    .flecha::after { content: ''; position: absolute; right: -10px; top: -7px; border: 10px solid transparent; border-left: 13px solid ${COLOR.amarillo}; border-right: 0; }
    .nota { position: absolute; left: 1218px; top: 794px; width: 480px; display: flex; align-items: center; gap: 14px; padding: 12px 20px; border-radius: 20px; background: ${COLOR.noche}; color: #fff; font-size: 20px; font-weight: 600; line-height: 1.3; z-index: 40; box-shadow: 0 14px 30px rgba(14,29,54,.25); }
    .nota .icono { width: 32px; height: 32px; flex: none; }
  `,
  html: (c) => {
    const ini = c.valor('PROFESIONES-INICIALES') ?? 0;
    const meta = c.valor('META-PROFESIONES') ?? 0;
    const porMes = Math.max(1, c.valor('PROF-POR-MES') ?? 1);
    const celdas = Array.from({ length: meta }, (_, i) => `<i class="${i < ini ? 'base' : ''}"></i>`).join('');
    const tarjetaP = (p: (typeof PEOPLE)[number], i: number) =>
      i === 0
        ? `<div class="tarjeta nodo p p0" style="left:140px;top:${P_TOP}px;width:490px;height:${P_ALTO}px"><div class="mosaico" style="grid-template-rows:repeat(${porMes}, 8px)">${celdas}</div><div><b>De ${c.cifra('PROFESIONES-INICIALES')} a <span class="cuenta">${c.cifra('META-PROFESIONES')}</span> profesiones</b><small>${c.cifra('PROF-POR-MES')} nuevas por mes</small></div></div>`
        : `<div class="tarjeta nodo p p${i}" style="left:140px;top:${P_TOP + i * P_PASO}px;width:490px;height:${P_ALTO}px"><span class="ic">${c.icono(p.ic)}</span><div><b>${p.h}</b><small>${p.s}</small></div></div>`;
    return `
      <div class="fondo"></div>
      <div class="aros"><div class="aro" style="left:${CX - 300}px;top:${CY - 300}px;width:600px;height:600px"></div><div class="aro" style="left:${CX - 410}px;top:${CY - 410}px;width:820px;height:820px"></div></div>
      <svg class="ramas" viewBox="0 0 1920 1080">
        <path class="borde-p rp" d="${rama(-1, XP, FIN_P)}"/><path class="linea-p rp" d="${rama(-1, XP, FIN_P)}"/>
        <path class="linea-b rb" d="${rama(1, XB, FIN_B)}"/>
      </svg>
      ${[0, 1, 2].map(() => '<div class="pulso ida"></div>').join('')}${[0, 1, 2].map(() => '<div class="pulso vuelta"></div>').join('')}
      <div class="chispa cp"></div><div class="chispa cb"></div>
      <div class="halo"><i></i></div>
      <div class="orbita"><i></i></div>
      <div class="destello d1"></div><div class="destello d2"></div>
      <div class="disco">${c.logo()}<span>Núcleo</span></div>
      ${FICHAS.map((f) => `<div class="sat"><div class="ficha">${c.icono(f.ic)}${f.txt}</div></div>`).join('')}
      <div class="pill pp t">Handyx for People<span class="tag">B2C</span></div>
      ${PEOPLE.map((_, i) => `<div class="ins in${i}" style="left:${XP}px;top:${yP(i)}px"><i></i></div>`).join('')}
      ${PEOPLE.map(tarjetaP).join('')}
      <div class="mov foco">${c.pj('bombilla', '', 130)}</div>
      <div class="pill pb t">Handyx for Business<span class="tag">B2B</span></div>
      ${BUSINESS.map((_, j) => `<div class="punto pu${j}" style="left:${XB}px;top:${yB(j)}px"><i></i></div>`).join('')}
      ${BUSINESS.map((b, j) => `<div class="tarjeta nodo b b${j}" style="left:1280px;top:${b.top}px;width:490px;height:${b.alto}px"><span class="ic">${c.icono(b.ic)}</span><div><b>${b.h}</b><small>${b.s}</small></div></div>`).join('')}
      <div class="l-frente"></div><div class="l-ventana"></div><div class="l-puerta"></div>
      <div class="l-toldo"></div><div class="l-cartel">${c.icono('tienda', 'blanco')}</div>
      ${FILA.map((n, i) => `<div class="mov h h${i}" style="left:${filaX(i) - H / 2}px;top:${FILA_PIE - H}px;width:${H}px;height:${H}px">${c.pj(n, '', H)}</div>`).join('')}
      <div class="l-mostrador"></div>
      <div class="lema"><span class="l"><span><b>Un mismo núcleo:</b> más trabajos,</span></span><span class="l"><span>más profesionales y más comercios</span></span><span class="l"><span>se potencian entre sí</span></span></div>
      <div class="expansion tarjeta">
        <span class="parada">${c.icono('ubicacion')}<span>Hoy: <b>Mar del Plata</b></span></span><i class="flecha"></i>
        <span class="parada">${c.icono('ruta')}<span>toda <b>Buenos Aires</b> en ${c.cifra('META-BA-MESES')} meses</span></span><i class="flecha"></i>
        <span class="parada">${c.icono('bandera')}<span><b>Argentina</b> en 2027</span></span>
      </div>
      <div class="nota">${c.icono('ia', 'oro')}<span>Con IA, crear y mantener apps para cada comercio es más barato que nunca</span></div>
      <div class="encabezado"><div class="fila-k"><span class="kicker">Respaldo · visión</span><span class="rotulo">Visión · a validar</span></div>
        <div class="titulo t"><span class="l"><span>Cómo crece <mark>Handyx</mark></span></span></div></div>
    `;
  },
  armar(tl, $, c) {
    const pathP = camino($('.linea-p'));
    const pathB = camino($('.linea-b'));
    const LP = pathP.getTotalLength();
    const LB = pathB.getTotalLength();
    const buscar = (p: SVGPathElement, L: number, ok: (x: number, y: number) => boolean) => {
      for (let l = 0; l <= L; l += 2) {
        const q = p.getPointAtLength(l);
        if (ok(q.x, q.y)) return l;
      }
      return L;
    };
    // Claves de crecimiento: la punta frena en cada nodo (ahí entra su tarjeta)
    const clavesP: Clave[] = [
      { t: 3.0, l: 0 },
      { t: 3.32, l: buscar(pathP, LP, (x, y) => y <= Y_ARCO + 1 && x <= 815) },
      ...T_P.map((t, i) => ({ t, l: LP - (FIN_P - yP(i)) })),
      { t: 5.85, l: LP },
    ];
    const clavesB: Clave[] = [
      { t: 6.6, l: 0 },
      { t: 6.92, l: buscar(pathB, LB, (x, y) => y <= Y_ARCO + 1 && x >= 1085) },
      ...T_B.map((t, j) => ({ t, l: LB - (FIN_B - yB(j)) })),
      { t: T_LOCAL, l: LB },
    ];
    const rp = $.all('.rp');
    const rb = $.all('.rb');
    const dibujar = (ps: HTMLElement[], ref: SVGPathElement, L: number, claves: Clave[], chispa: HTMLElement, t: number) => {
      const l = largo(claves, t);
      for (const p of ps) {
        p.style.strokeDasharray = `${L} ${L}`;
        p.style.strokeDashoffset = String(L - l);
        p.style.opacity = l > 0.5 ? '1' : '0';
      }
      const crece = l > 0.5 && l < L - 0.5;
      if (crece) {
        const q = ref.getPointAtLength(l);
        chispa.style.transform = `translate(${q.x - 14}px, ${q.y - 14}px)`;
      }
      chispa.style.opacity = crece ? '1' : '0';
    };
    const chP = $('.chispa.cp');
    const chB = $('.chispa.cb');
    c.pintor((t) => {
      dibujar(rp, pathP, LP, clavesP, chP, t);
      dibujar(rb, pathB, LB, clavesB, chB, t);
    });

    // 0 · el núcleo y los Handys
    tl.fromTo($('.encabezado .kicker'), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.05);
    entraTitulo(tl, $.all('.encabezado .l > span'), 0.15);
    tl.fromTo($('.rotulo'), { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, 0.45);
    tl.fromTo($('.aros'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 0.3);
    tl.fromTo($('.halo'), { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.9, ease: 'power2.out' }, 0.3);
    tl.fromTo($('.disco'), { autoAlpha: 0, scale: 0.2 }, { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'back.out(1.8)' }, 0.35);
    tl.fromTo([$('.disco img'), $('.disco span')], { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.1 }, 0.7);
    tl.fromTo($('.orbita'), { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'power3.out' }, 0.8);
    $.all('.sat .ficha').forEach((f, i) => tl.fromTo(f, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(2.2)' }, 0.9 + i * 0.15));
    tl.fromTo($.all('.h'), { autoAlpha: 0, y: 70 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'back.out(1.8)', stagger: 0.08 }, 1.3);
    for (const [k, t0] of [
      [1, 2.95],
      [2, 6.55],
    ] as const) {
      const d = $(`.destello.d${k}`);
      tl.fromTo(d, { autoAlpha: 0, scale: 1 }, { autoAlpha: 0.9, duration: 0.01 }, t0);
      tl.to(d, { autoAlpha: 0, scale: 1.9, duration: 0.7, ease: 'power2.out' }, t0 + 0.01);
    }

    // 1 · Handyx for People: cada Handy corre a su nodo cuando llega la punta
    tl.fromTo($('.pill.pp'), { autoAlpha: 0, scale: 0.6, rotation: -4 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(2.2)' }, 3.27);
    PEOPLE.forEach((_, i) => {
      const t = T_P[i] ?? 0;
      const h = $(`.h${i}`);
      tl.to(h, { x: XP - filaX(i), duration: VUELO, ease: 'power2.out' }, salida(i));
      tl.to(h, { y: yP(i) + 26 - FILA_PIE, scale: 68 / H, duration: VUELO, ease: 'power2.in' }, salida(i));
      tl.fromTo($(`.in${i}`), { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(3)' }, t - 0.06);
      tl.fromTo($(`.p${i}`), { autoAlpha: 0, x: -26 }, { autoAlpha: 1, x: 0, duration: 0.45, ease: 'back.out(1.6)' }, t + 0.04);
    });
    c.contador($('.cuenta'), { t0: (T_P[0] ?? 0) + 0.15, dur: 1.6, desde: c.valor('PROFESIONES-INICIALES') ?? 0, hasta: c.valor('META-PROFESIONES') ?? 0 });
    const ini = c.valor('PROFESIONES-INICIALES') ?? 0;
    const meta = c.valor('META-PROFESIONES') ?? 0;
    const celdas = $.all('.mosaico i');
    c.pintor((t) => {
      const k = tramo(t, (T_P[0] ?? 0) + 0.15, (T_P[0] ?? 0) + 1.75);
      const n = Math.round(ini + (meta - ini) * (1 - (1 - k) ** 3));
      celdas.forEach((el, i) => el.classList.toggle('on', i >= ini && i < n));
    });
    tl.fromTo($('.foco'), { autoAlpha: 0, y: 40, scale: 0.5 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(2)' }, 5.85);

    // 2 · Handyx for Business: nodos, el local y Llave que lo atiende
    tl.fromTo($('.pill.pb'), { autoAlpha: 0, scale: 0.6, rotation: 4 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(2.2)' }, 6.87);
    BUSINESS.forEach((_, j) => {
      const t = T_B[j] ?? 0;
      tl.fromTo($(`.pu${j}`), { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(3)' }, t - 0.06);
      tl.fromTo($(`.b${j}`), { autoAlpha: 0, x: 26 }, { autoAlpha: 1, x: 0, duration: 0.45, ease: 'back.out(1.6)' }, t + 0.04);
    });
    tl.fromTo($('.l-frente'), { autoAlpha: 0, scaleY: 0 }, { autoAlpha: 1, scaleY: 1, duration: 0.4, ease: 'back.out(1.6)' }, T_LOCAL - 0.1);
    tl.fromTo([$('.l-ventana'), $('.l-puerta')], { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'back.out(2)', stagger: 0.06 }, T_LOCAL + 0.05);
    tl.fromTo($('.l-toldo'), { autoAlpha: 0, scaleY: 0 }, { autoAlpha: 1, scaleY: 1, duration: 0.45, ease: 'bounce.out' }, T_LOCAL + 0.1);
    tl.fromTo($('.l-cartel'), { autoAlpha: 0, y: -30 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'back.out(2.4)' }, T_LOCAL);
    tl.fromTo($('.l-mostrador'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' }, T_LOCAL + 0.2);
    const llave = $('.h5');
    tl.to(llave, { x: XB - filaX(5), duration: VUELO, ease: 'power1.inOut' }, T_ATIENDE);
    tl.to(llave, { y: 5, scale: 90 / H, duration: VUELO, ease: 'power1.inOut' }, T_ATIENDE);

    // 3 · todo se potencia
    entraTitulo(tl, $.all('.lema .l > span'), 10.15, 0.1);
    tl.fromTo($('.expansion'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'back.out(1.6)' }, 10.6);
    tl.fromTo($.all('.expansion .parada'), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(2.4)', stagger: 0.3 }, 10.75);
    tl.fromTo($.all('.expansion .flecha'), { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: 'power2.out', stagger: 0.3 }, 10.95);
    tl.fromTo($('.nota'), { autoAlpha: 0, y: 30, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.8)' }, 11.7);

    // Poses (pintor: valen también en los saltos)
    const pjs = $.all('.h .pj');
    const foco = $('.foco .pj');
    c.pintor((t) => {
      pjs.forEach((p, i) => {
        const sal = salida(i);
        const llega = sal + VUELO;
        let q: Pose = 'a';
        if (t >= 10.05) q = 'c';
        else if (t >= sal && t < llega) q = 'd';
        else if (t >= llega && t < llega + (i === 5 ? 2 : 0.7)) q = 'b';
        else if (t >= 0.9 && t < 2.8) q = 'b';
        pose(p, q);
      });
      pose(foco, t >= 10.05 ? 'c' : 'b');
    });
  },
  ambiente(t, $, tl) {
    // Fichas en órbita (salen del disco en el paso 0)
    $.all('.sat').forEach((s, i) => {
      const k = tramo(tl, 0.9 + i * 0.15, 1.5 + i * 0.15);
      const r = 60 + (R_ORB - 60) * (1 - (1 - k) ** 3);
      const a = Math.PI / 4 + (i * Math.PI) / 2 + t * 0.14;
      s.style.transform = `translate(${CX + Math.cos(a) * r - 75}px, ${CY + Math.sin(a) * r - 42}px)`;
    });
    $('.orbita i').style.transform = `rotate(${t * 6}deg)`;
    $.all('.aro').forEach((a, i) => (a.style.transform = `rotate(${t * (i ? -3 : 4)}deg)`));
    // Pulsos (paso 3): van y vuelven de punta a punta pasando por el núcleo
    const pathP = camino($('.linea-p'));
    const pathB = camino($('.linea-b'));
    const LP = pathP.getTotalLength();
    const LB = pathB.getTotalLength();
    const U = LP + LB;
    const vis = tramo(tl, 10.0, 10.5);
    const us: number[] = [];
    $.all('.pulso').forEach((p, i) => {
      const ida = i < 3;
      const avance = (t * 520 + ((i % 3) / 3 + (ida ? 0 : 1 / 6)) * U) % U;
      const u = ida ? avance : U - avance;
      us.push(u);
      const q = u <= LP ? pathP.getPointAtLength(LP - u) : pathB.getPointAtLength(u - LP);
      p.style.transform = `translate(${q.x - 11}px, ${q.y - 11}px)`;
      p.style.opacity = String(vis * Math.min(1, u / 60, (U - u) / 60));
    });
    const cerca = (u0: number, ancho: number) => vis * Math.max(0, ...us.map((u) => 1 - Math.abs(u - u0) / ancho));
    // Nodos que brillan y Handys que saltan cuando pasa un pulso
    const uP = PEOPLE.map((_, i) => FIN_P - yP(i));
    const uB = BUSINESS.map((_, j) => U - (FIN_B - yB(j)));
    $.all('.ins i').forEach((g, i) => (g.style.opacity = String(cerca(uP[i] ?? 0, 70))));
    $.all('.punto i').forEach((g, j) => (g.style.opacity = String(cerca(uB[j] ?? 0, 70))));
    $('.halo i').style.transform = `scale(${1 + Math.sin(t * 1.6) * 0.03 + cerca(LP, 160) * 0.12})`;
    const saltos = [...uP, U, 0]; // Handys en sus nodos, Llave en el local, Foco al principio de la rama
    [...$.all('.h .pj'), $('.foco .pj')].forEach((p, i) => {
      const salto = cerca(saltos[i] ?? -999, 90) * 14;
      p.style.transform = `translateY(${-salto}px) scaleY(${1 + Math.sin(t * 2.4 + i) * 0.018})`;
    });
  },
});
