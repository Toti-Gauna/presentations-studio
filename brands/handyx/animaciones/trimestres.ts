// Anexo de respaldo · Cómo crece Handyx, trimestre a trimestre. El presentador avanza un paso por clic:
// 0 lanzamiento en Mar del Plata · 1 primer trimestre: toda Buenos Aires · 2 Centro · 3 Cuyo y Litoral · 4 Norte ·
// 5 nov–dic 2027: Patagonia, toda Argentina y la visión. Mapa de mosaicos (cada zona se enciende desde la anterior, con
// arcos y pines), tarjeta del trimestre (zona · profesiones · People · Business), riel de avance con Foco y contador de
// profesiones con las afirmaciones PROF-Q1…Q4. La franja y 880–950 de la columna izquierda queda libre (leyenda del kit).
import { ARGENTINA } from './comun/argentina.ts';
import { COLOR, entraTitulo, escena, pose, tramo, type Kit } from './comun/kit.ts';

type Pt = readonly [number, number];
type Lado = 'der' | 'izq' | 'aba';

const MARCAS = [0, 2.8, 6.0, 9.0, 12.0, 15.0, 18.0];
const N = MARCAS.length - 1;
const m = (k: number) => MARCAS[Math.min(Math.max(k, 0), N)] ?? 0;
/** El mapa (viewBox 560 × 1000 de ARGENTINA) va a la derecha, escalado. */
const MAPA = { x: 1250, y: 8, s: 0.95 };
const geo = (n: string): Pt => ARGENTINA.ciudades[n] ?? [0, 0];
const enPantalla = (p: Pt): Pt => [MAPA.x + p[0] * MAPA.s, MAPA.y + p[1] * MAPA.s];
const DUR_ARCO = 0.6;

/** Ciudades por paso: llega = segundos desde el inicio del paso; desde = de dónde sale su arco. */
interface Ciudad { n: string; paso: number; llega: number; lado: Lado; desde?: string; curva?: number; dy?: number }
const CIUDADES: Ciudad[] = [
  { n: 'Mar del Plata', paso: 0, llega: 0.9, lado: 'der' },
  { n: 'Ciudad de Buenos Aires', paso: 1, llega: 0.75, lado: 'der', desde: 'Mar del Plata', curva: 0.22, dy: -18 },
  { n: 'Bahía Blanca', paso: 1, llega: 1.0, lado: 'aba', desde: 'Mar del Plata', curva: 0.25 },
  { n: 'La Plata', paso: 1, llega: 1.35, lado: 'der', desde: 'Ciudad de Buenos Aires', curva: 0.5, dy: 20 },
  { n: 'Rosario', paso: 2, llega: 0.75, lado: 'der', desde: 'Ciudad de Buenos Aires', curva: -0.25 },
  { n: 'Córdoba', paso: 2, llega: 1.35, lado: 'izq', desde: 'Rosario', curva: 0.25 },
  { n: 'Santa Fe', paso: 2, llega: 1.5, lado: 'der', desde: 'Rosario', curva: -0.35, dy: -14 },
  { n: 'Mendoza', paso: 3, llega: 0.75, lado: 'izq', desde: 'Córdoba', curva: 0.25 },
  { n: 'Paraná', paso: 3, llega: 0.95, lado: 'der', desde: 'Rosario', curva: 0.45, dy: 8 },
  { n: 'San Juan', paso: 3, llega: 1.4, lado: 'izq', desde: 'Mendoza', curva: 0.4, dy: -10 },
  { n: 'Corrientes', paso: 3, llega: 1.55, lado: 'der', desde: 'Paraná', curva: 0.2 },
  { n: 'Tucumán', paso: 4, llega: 0.75, lado: 'izq', desde: 'Córdoba', curva: 0.2 },
  { n: 'Posadas', paso: 4, llega: 1.0, lado: 'der', desde: 'Corrientes', curva: 0.3 },
  { n: 'Salta', paso: 4, llega: 1.4, lado: 'izq', desde: 'Tucumán', curva: 0.35 },
  { n: 'Neuquén', paso: 5, llega: 0.75, lado: 'izq', desde: 'Bahía Blanca', curva: 0.2 },
  { n: 'Comodoro Rivadavia', paso: 5, llega: 1.0, lado: 'der', desde: 'Bahía Blanca', curva: -0.2 },
  { n: 'Bariloche', paso: 5, llega: 1.35, lado: 'izq', desde: 'Neuquén', curva: -0.25 },
  { n: 'Ushuaia', paso: 5, llega: 1.6, lado: 'der', desde: 'Comodoro Rivadavia', curva: -0.18 },
];

/** Arco cuadrático de a hacia b, combado k veces su largo hacia la normal izquierda. */
function curva(a: Pt, b: Pt, k: number): string {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const cx = (a[0] + b[0]) / 2 - dy * k;
  const cy = (a[1] + b[1]) / 2 + dx * k;
  return `M${a[0]} ${a[1]} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b[0]} ${b[1]}`;
}
const ARCOS = CIUDADES.flatMap((c) => (c.desde ? [{ d: curva(geo(c.desde), geo(c.n), c.curva ?? 0.25), paso: c.paso, t0: m(c.paso) + c.llega - DUR_ARCO }] : []));

// Mosaicos del mapa: grilla dentro del contorno; cada uno pertenece a la zona (paso) que lo enciende.
const anillos = (d: string): Pt[][] =>
  d
    .split(/M/i)
    .filter((s) => s.trim())
    .map((s) => {
      const n = (s.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
      const r: Pt[] = [];
      for (let i = 0; i + 1 < n.length; i += 2) r.push([n[i] ?? 0, n[i + 1] ?? 0]);
      return r;
    });
function dentro(p: Pt, rs: Pt[][]): boolean {
  let si = false;
  for (const r of rs)
    for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
      const a = r[i] ?? p;
      const b = r[j] ?? p;
      if (a[1] > p[1] !== b[1] > p[1] && p[0] < ((b[0] - a[0]) * (p[1] - a[1])) / (b[1] - a[1]) + a[0]) si = !si;
    }
  return si;
}
const dist = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);
/** Ola de cada paso: desde qué ciudad se encienden los mosaicos y cuándo (segundos desde el inicio del paso). */
const OLAS = [
  { desde: 'Mar del Plata', t: 0.95 },
  { desde: 'Mar del Plata', t: 0.3 },
  { desde: 'Rosario', t: 0.6 },
  { desde: 'Córdoba', t: 0.55 },
  { desde: 'Córdoba', t: 0.55 },
  { desde: 'Bahía Blanca', t: 0.55 },
];
const OLA_DUR = 1.1;
const PASO_M = 16;
const LADO_M = 12.4;
interface Mosaico { x: number; y: number; z: number; r: number }
const MOSAICOS: Mosaico[] = (() => {
  const tierra = [...anillos(ARGENTINA.contorno), ...anillos(ARGENTINA.malvinas)];
  const ba = anillos(ARGENTINA.buenosAires);
  const mdp = geo('Mar del Plata');
  const resto = CIUDADES.filter((c) => c.paso >= 2).map((c) => ({ p: geo(c.n), z: c.paso }));
  const lista: Mosaico[] = [];
  for (let y = PASO_M / 2; y < ARGENTINA.alto; y += PASO_M)
    for (let x = PASO_M / 2; x < ARGENTINA.ancho; x += PASO_M) {
      const p: Pt = [x, y];
      if (!dentro(p, tierra)) continue;
      let z = N - 1;
      if (dentro(p, ba)) z = dist(p, mdp) < 30 ? 0 : 1;
      else {
        let mejor = Infinity;
        for (const c of resto) {
          const d = dist(p, c.p);
          if (d < mejor) [mejor, z] = [d, c.z];
        }
      }
      lista.push({ x, y, z, r: 0 });
    }
  for (let z = 0; z < N; z++) {
    const o = geo(OLAS[z]?.desde ?? 'Mar del Plata');
    const zona = lista.filter((q) => q.z === z);
    const ds = zona.map((q) => dist([q.x, q.y], o));
    const min = Math.min(...ds);
    const max = Math.max(...ds);
    zona.forEach((q, i) => (q.r = (((ds[i] ?? min) - min) / Math.max(1, max - min)) * OLA_DUR));
  }
  return lista;
})();
const rect = (q: Mosaico) => `<rect x="${(q.x - LADO_M / 2).toFixed(1)}" y="${(q.y - LADO_M / 2).toFixed(1)}" width="${LADO_M}" height="${LADO_M}" rx="3"/>`;

// Riel de avance, tarjeta y contador (coordenadas fijas: el vuelo de los oficios al contador sale de acá).
const PARADAS = ['Lanzamiento', 'Nov–ene', 'Feb–abr', 'May–jul', 'Ago–oct', 'Nov–dic 2027'];
const RX = (k: number) => 66 + k * 157;
const CARTA = { x: 96, y: 374, w: 914, h: 492 };
const CUENTA = { x: 650, y: 206, w: 234, h: 96 };
const ABAJO = { x: 30, y: 332 };
const OF = { w: 274, h: 62, gx: 16, gy: 14 };
const OFICIOS = [
  ['electricidad', 'Electricidad'],
  ['plomeria', 'Plomería'],
  ['gas', 'Gas'],
  ['cerrajeria', 'Cerrajería'],
  ['albanileria', 'Albañilería'],
  ['aire', 'Aire acondicionado'],
] as const;
const ofPos = (i: number) => ({ x: (i % 3) * (OF.w + OF.gx), y: Math.floor(i / 3) * (OF.h + OF.gy) });

function textos(c: Kit) {
  const mes = c.cifra('PROF-POR-MES');
  return {
    periodos: [
      ['cohete', `Lanzamiento · ${c.cifra('LANZAMIENTO')}`],
      ['calendario', 'Primer trimestre · nov–ene'],
      ['calendario', 'Segundo trimestre · feb–abr'],
      ['calendario', 'Tercer trimestre · may–jul'],
      ['calendario', 'Cuarto trimestre · ago–oct'],
      ['bandera', 'Noviembre y diciembre de 2027'],
    ],
    zonas: [
      ['<mark>Mar del Plata</mark>', 'Donde arranca Handyx'],
      [`Toda <mark>Buenos Aires</mark> en ${c.cifra('META-BA-MESES')} meses`, 'Ciudad de Buenos Aires, La Plata y Bahía Blanca'],
      ['<mark>Centro</mark>', 'Córdoba, Rosario y Santa Fe'],
      ['<mark>Cuyo y Litoral</mark>', 'Mendoza, San Juan, Paraná y Corrientes'],
      ['<mark>Norte</mark>', 'Tucumán, Salta y Posadas'],
      ['Toda <mark>Argentina</mark>', 'Patagonia: Neuquén, Bariloche, Comodoro Rivadavia y Ushuaia'],
    ],
    profesiones: [
      'Para arrancar, cada una con sus herramientas',
      `${mes} nuevas por mes, cada una con sus herramientas, y HandIA para profesionales`,
      `${mes} nuevas por mes, cada una con sus herramientas`,
      `Seguimos con ${mes} nuevas por mes, cada una con sus herramientas`,
      'Llegamos a la meta de profesiones',
      'Todas, en todo el país',
    ],
    people: ['', 'HandIA premium para usuarios, con foto y voz', 'Ferreterías conectadas: stock para los profesionales', 'Herramientas con IA en cada oficio', 'Clientes que vuelven: historial y valoraciones'],
    business: ['', 'Primer piloto con locales de Mar del Plata', 'Turnos fijos de personal para locales', 'Apps a medida para comercios', 'Mantenimiento de locales con técnicos verificados'],
  };
}

export default escena({
  marcas: MARCAS,
  cara: [{ desde: 0, x: 1790, y: 820, d: 250 }],
  css: `
    .fondo { position: absolute; inset: 0; background: ${COLOR.hueso}; }
    .mar { position: absolute; left: 1110px; top: 0; width: 810px; height: 1080px; background-color: ${COLOR.celeste}; background-image: radial-gradient(rgba(31,87,168,.12) 1.6px, transparent 2px); background-size: 28px 28px; }
    .encabezado { position: absolute; left: 96px; top: 40px; width: 980px; }
    .krow { display: flex; align-items: center; gap: 18px; }
    .rotulo { display: inline-flex; align-items: center; padding: 5px 14px; border-radius: 999px; border: 2px dashed rgba(31,87,168,.5); background: #fff; font-weight: 700; font-size: 20px; color: ${COLOR.azulOscuro}; white-space: nowrap; }
    .encabezado .titulo { margin-top: 12px; font-size: 54px; }
    .riel { position: absolute; left: 96px; top: 214px; width: 914px; height: 150px; }
    .via { position: absolute; left: ${RX(0)}px; width: ${RX(N - 1) - RX(0)}px; top: 92px; height: 8px; border-radius: 4px; background: #D9E0EA; }
    .via.llena { background: ${COLOR.azul}; transform-origin: 0 50%; }
    .parada { position: absolute; top: 84px; width: 0; height: 0; }
    .parada i { position: absolute; left: -12px; top: 0; width: 24px; height: 24px; border-radius: 50%; background: #fff; border: 4px solid #C3CCDA; }
    .parada span { position: absolute; left: 0; top: 34px; transform: translateX(-50%); white-space: nowrap; font-size: 20px; font-weight: 700; color: ${COLOR.suave}; }
    .parada[data-estado='pasado'] i { background: ${COLOR.azul}; border-color: ${COLOR.azul}; }
    .parada[data-estado='pasado'] span { color: ${COLOR.azul}; }
    .parada[data-estado='actual'] i { background: ${COLOR.amarillo}; border-color: ${COLOR.noche}; }
    .parada[data-estado='actual'] span { color: ${COLOR.noche}; font-weight: 800; }
    .caminante { position: absolute; left: ${RX(0) - 42}px; top: 0; width: 84px; height: 84px; }
    .salto { position: absolute; inset: 0; }
    .carta { position: absolute; left: ${CARTA.x}px; top: ${CARTA.y}px; width: ${CARTA.w}px; height: ${CARTA.h}px; }
    .carta .vis { position: absolute; }
    .carta .v { position: absolute; left: 0; top: 0; }
    .per { left: 30px; top: 22px; width: 620px; height: 48px; }
    .mos { position: absolute; left: 30px; width: 56px; height: 56px; border-radius: 16px; background: #ECECEC; display: grid; place-items: center; }
    .mos .icono { width: 30px; height: 30px; }
    .et { position: absolute; left: 104px; font-weight: 800; font-size: 20px; letter-spacing: .08em; text-transform: uppercase; color: ${COLOR.azul}; }
    .zm { top: 84px; } .ze { top: 78px; }
    .zv { left: 104px; top: 104px; width: 790px; height: 86px; }
    .zv .h { font-size: 40px; white-space: nowrap; }
    .zv .sub { margin-top: 6px; font-size: 22px; font-weight: 600; color: ${COLOR.suave}; white-space: nowrap; }
    .raya { position: absolute; left: 30px; right: 30px; height: 2px; background: ${COLOR.borde}; }
    .r1 { top: 196px; } .r2 { top: 318px; }
    .pm { top: 214px; } .pe { top: 208px; }
    .pv { left: 104px; top: 236px; width: 520px; height: 64px; }
    .pv .v { width: 520px; font-size: 24px; font-weight: 700; line-height: 1.25; }
    .cuenta { position: absolute; left: ${CUENTA.x}px; top: ${CUENTA.y}px; width: ${CUENTA.w}px; height: ${CUENTA.h}px; border-radius: 20px; background: ${COLOR.azul}; color: #fff; box-shadow: 0 6px 0 ${COLOR.azulOscuro}; }
    .cuenta .arriba { position: absolute; left: 20px; top: 4px; display: flex; align-items: baseline; gap: 10px; }
    .cuenta .n { font-size: 58px; line-height: 1.05; }
    .cuenta .pal { font-size: 21px; font-weight: 700; }
    .barra { position: absolute; left: 20px; right: 20px; bottom: 14px; height: 9px; border-radius: 5px; background: rgba(255,255,255,.22); overflow: hidden; }
    .barra i { position: absolute; inset: 0; border-radius: 5px; background: ${COLOR.amarillo}; transform-origin: 0 50%; }
    .abajo { position: absolute; left: ${ABAJO.x}px; top: ${ABAJO.y}px; width: 854px; height: 138px; }
    .oficio { position: absolute; width: ${OF.w}px; height: ${OF.h}px; border-radius: 16px; background: #ECECEC; display: flex; align-items: center; gap: 12px; padding: 0 14px; font-weight: 800; font-size: 21px; line-height: 1.08; color: ${COLOR.azulOscuro}; }
    .oficio b { flex: none; width: 42px; height: 42px; border-radius: 12px; background: #fff; display: grid; place-items: center; }
    .oficio .icono { width: 26px; height: 26px; }
    .rama { position: absolute; top: 0; width: 419px; height: 138px; border-radius: 22px; }
    .people { left: 0; background: ${COLOR.celeste}; }
    .business { left: 435px; background: ${COLOR.azul}; color: #fff; box-shadow: 0 6px 0 ${COLOR.azulOscuro}; }
    .rt { position: absolute; left: 22px; top: 16px; display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 20px; letter-spacing: .06em; text-transform: uppercase; color: ${COLOR.azul}; white-space: nowrap; }
    .rt .icono { width: 28px; height: 28px; }
    .business .rt { color: ${COLOR.amarillo}; }
    .rama .vis { left: 22px; top: 58px; width: 375px; height: 66px; }
    .rama .v { width: 375px; font-size: 24px; font-weight: 700; line-height: 1.25; }
    .vision { position: absolute; left: 0; top: 0; width: 854px; height: 138px; border-radius: 22px; background: ${COLOR.amarillo}; box-shadow: 0 6px 0 #C9971E; }
    .vision .rt { color: ${COLOR.noche}; }
    .vision .vt { position: absolute; left: 22px; top: 54px; width: 800px; font-size: 30px; line-height: 1.12; }
    .vision b { background: #fff; padding: 0 .14em; border-radius: .12em; white-space: nowrap; }
    .mapa { position: absolute; overflow: visible; }
    .sombra { fill: rgba(14,29,54,.10); }
    .suelo { fill: #fff; }
    .relleno path { fill: #A9C0E6; }
    .brillo { fill: ${COLOR.amarillo}; }
    .base { fill: #E3E8F0; }
    .zona { fill: ${COLOR.amarillo}; }
    .borde { fill: none; stroke: ${COLOR.azul}; stroke-width: 2.4; stroke-linejoin: round; }
    .arco path { fill: none; stroke-linecap: round; }
    .arco .halo { stroke: #fff; stroke-width: 7.5; }
    .arco .linea { stroke: ${COLOR.noche}; stroke-width: 3.2; }
    .arco .cabeza { fill: ${COLOR.amarillo}; stroke: ${COLOR.noche}; stroke-width: 2.6; }
    .pin { position: absolute; width: 0; height: 0; }
    .pin b { position: absolute; left: -10px; top: -10px; width: 20px; height: 20px; border-radius: 50%; background: ${COLOR.noche}; border: 4px solid #fff; box-shadow: 0 3px 8px rgba(14,29,54,.35); }
    .pin.casa b { left: -14px; top: -14px; width: 28px; height: 28px; background: ${COLOR.amarillo}; border: 5px solid ${COLOR.noche}; }
    .pin i { position: absolute; left: -22px; top: -22px; width: 44px; height: 44px; border-radius: 50%; border: 3px solid ${COLOR.noche}; opacity: 0; }
    .pin .latido { border-color: ${COLOR.azul}; }
    .etq { position: absolute; width: 0; height: 0; }
    .caja { position: absolute; white-space: nowrap; }
    .caja.der { left: 20px; top: -18px; } .caja.izq { right: 20px; top: -18px; } .caja.aba { left: 0; top: 18px; transform: translateX(-50%); }
    .caja span { display: inline-block; padding: 4px 13px; border-radius: 999px; background: #fff; font-weight: 800; font-size: 20px; color: ${COLOR.noche}; box-shadow: 0 6px 16px rgba(14,29,54,.18); }
    .der span { transform-origin: 0 50%; } .izq span { transform-origin: 100% 50%; } .aba span { transform-origin: 50% 0; }
    .etq.casa span { background: ${COLOR.noche}; color: #fff; }
    .placa { position: absolute; left: 1528px; top: 528px; width: 252px; padding: 16px 0 14px; border-radius: 26px; background: #fff; text-align: center; box-shadow: 0 0 0 8px rgba(255,201,60,.6), 0 22px 44px rgba(14,29,54,.28); }
    .placa img { display: block; height: 42px; margin: 0 auto; }
    .placa div { margin-top: 6px; font-weight: 800; font-size: 22px; color: ${COLOR.azulOscuro}; }
  `,
  html: (c) => {
    const tx = textos(c);
    const A = ARGENTINA;
    const ciudad = (ci: Ciudad, i: number) => {
      const [x, y] = enPantalla(geo(ci.n));
      return `left:${x.toFixed(1)}px;top:${y.toFixed(1)}px" data-i="${i}`;
    };
    const valores = (lista: string[], clase = '') => lista.map((t, k) => (t ? `<div class="v ${clase}" data-k="${k}">${t}</div>` : '')).join('');
    return `
    <div class="fondo"></div><div class="mar"></div>
    <svg class="mapa" viewBox="0 0 ${A.ancho} ${A.alto}" style="left:${MAPA.x}px;top:${MAPA.y}px;width:${A.ancho * MAPA.s}px;height:${A.alto * MAPA.s}px">
      <defs><clipPath id="trimestres-tierra"><path d="${A.contorno}"/><path d="${A.malvinas}"/></clipPath></defs>
      <path class="sombra" d="${A.contorno}" transform="translate(4 7)"/>
      <path class="suelo" d="${A.contorno}"/><path class="suelo" d="${A.malvinas}"/>
      <g clip-path="url(#trimestres-tierra)">
        <g class="relleno"><path d="${A.contorno}"/><path d="${A.malvinas}"/></g>
        <path class="brillo" d="${A.buenosAires}"/>
        <g class="base">${MOSAICOS.map(rect).join('')}</g>
        ${Array.from({ length: N }, (_, z) => `<g class="zona">${MOSAICOS.filter((q) => q.z === z).map(rect).join('')}</g>`).join('')}
      </g>
      <path class="borde" d="${A.contorno}"/><path class="borde" d="${A.malvinas}"/>
      ${ARCOS.map((a) => `<g class="arco"><path class="halo" d="${a.d}"/><path class="linea" d="${a.d}"/><circle class="cabeza" r="6.5" cx="0" cy="0"/></g>`).join('')}
    </svg>
    ${CIUDADES.map((ci, i) => `<div class="pin${i === 0 ? ' casa' : ''}" style="${ciudad(ci, i)}"><i class="latido"></i><i class="onda"></i><b></b></div>`).join('')}
    ${CIUDADES.map((ci, i) => `<div class="etq${i === 0 ? ' casa' : ''}" style="${ciudad(ci, i)}"><div class="caja ${ci.lado}"${ci.dy ? ` style="margin-top:${ci.dy}px"` : ''}><span>${ci.n}</span></div></div>`).join('')}
    <div class="placa">${c.logo()}<div>en toda Argentina</div></div>
    <div class="encabezado">
      <div class="krow"><span class="kicker">Plan de crecimiento</span><span class="rotulo">Plan propuesto · a validar con los primeros datos</span></div>
      <div class="titulo t"><span class="l"><span>Cómo crece Handyx,</span></span><span class="l"><span><mark>trimestre a trimestre</mark></span></span></div>
    </div>
    <div class="riel">
      <div class="via"></div><div class="via llena"></div>
      ${PARADAS.map((p, k) => `<div class="parada" style="left:${RX(k)}px"><i></i><span>${p}</span></div>`).join('')}
      <div class="caminante"><div class="salto">${c.pj('bombilla', '', 84)}</div></div>
    </div>
    <div class="carta tarjeta">
      <div class="vis per">${tx.periodos.map(([ic, t], k) => { const am = k === 0 || k === N - 1; return `<span class="v chip ${am ? 'amarillo' : 'azul'}" data-k="${k}">${c.icono(ic ?? '', am ? '' : 'blanco')}${t}</span>`; }).join('')}</div>
      <span class="mos zm">${c.icono('ubicacion')}</span><div class="et ze">Zona</div>
      <div class="vis zv">${tx.zonas.map(([h, s], k) => `<div class="v" data-k="${k}"><div class="h t">${h}</div><div class="sub">${s}</div></div>`).join('')}</div>
      <div class="raya r1"></div>
      <span class="mos pm">${c.icono('herramienta')}</span><div class="et pe">Profesiones</div>
      <div class="vis pv">${valores(tx.profesiones)}</div>
      <div class="cuenta"><div class="arriba"><span class="num t"><span class="n">${c.cifra('PROFESIONES-INICIALES')}</span>${'<span class="n"></span>'.repeat(4)}</span><span class="pal">profesiones</span></div><div class="barra"><i></i></div></div>
      <div class="raya r2"></div>
      <div class="abajo">
        ${OFICIOS.map(([ic, n], i) => `<div class="oficio" style="left:${ofPos(i).x}px;top:${ofPos(i).y}px"><b>${c.icono(ic)}</b>${n}</div>`).join('')}
        <div class="rama people"><div class="rt">${c.icono('usuarios')}Handyx for People</div><div class="vis">${valores(tx.people)}</div></div>
        <div class="rama business"><div class="rt">${c.icono('tienda', 'oro')}Handyx for Business</div><div class="vis">${valores(tx.business)}</div></div>
        <div class="vision"><div class="rt">${c.icono('objetivo')}Visión · fines de 2027</div><div class="vt t">Que el <b>${c.cifra('META-CUOTA-NACIONAL')}</b> de los servicios contratados por particulares pasen por Handyx</div></div>
      </div>
    </div>
  `;
  },
  armar(tl, $, c) {
    const v = (sel: string) => $.all(`${sel} .v`);
    const porPaso = (els: HTMLElement[]) => {
      const r: Array<HTMLElement | undefined> = [];
      for (const el of els) r[Number(el.dataset['k'])] = el;
      return r;
    };
    const per = porPaso(v('.per'));
    const zon = porPaso(v('.zv'));
    const pro = porPaso(v('.pv'));
    const peo = porPaso(v('.people'));
    const bus = porPaso(v('.business'));
    // Cambio de valor en una fila de la tarjeta: el viejo sube y se va, el nuevo entra desde abajo.
    const rotar = (vals: Array<HTMLElement | undefined>, k: number, t: number) => {
      const sale = vals[k - 1];
      const entra = vals[k];
      if (sale) tl.to(sale, { autoAlpha: 0, y: -26, duration: 0.3, ease: 'power2.in' }, t);
      if (entra) tl.fromTo(entra, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, t + 0.2);
    };

    // 0 · título, mapa, riel y tarjeta de lanzamiento
    tl.fromTo($('.mar'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, ease: 'power1.out' }, 0);
    tl.fromTo($('.krow'), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.05);
    entraTitulo(tl, $.all('.encabezado .l > span'), 0.12);
    tl.fromTo($('.mapa'), { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.15);
    tl.fromTo($('.via'), { scaleX: 0, transformOrigin: '0 50%' }, { scaleX: 1, duration: 0.6, ease: 'power2.out' }, 0.3);
    tl.fromTo($.all('.parada'), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'back.out(2)', stagger: 0.05 }, 0.38);
    tl.fromTo($('.caminante'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 0.5);
    tl.fromTo($('.salto'), { y: -90 }, { y: 0, duration: 0.6, ease: 'bounce.out' }, 0.5);
    tl.fromTo($('.carta'), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.3);
    const fijos = [...$.all('.carta .mos'), ...$.all('.carta .et'), ...$.all('.raya')];
    tl.fromTo(fijos, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, stagger: 0.04 }, 0.5);
    tl.fromTo([per[0], zon[0], pro[0], $('.cuenta')], { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.08 }, 0.55);
    const oficios = $.all('.oficio');
    tl.fromTo(oficios, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)', stagger: 0.07 }, 1.05);

    // Mapa: mosaicos por zona (ola desde la zona anterior), brillo de Buenos Aires, pines, rótulos y arcos
    $.all('.zona').forEach((g, z) => {
      const rects = [...g.querySelectorAll('rect')];
      const r = MOSAICOS.filter((q) => q.z === z).map((q) => q.r);
      tl.fromTo(rects, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.42, ease: 'back.out(2.4)', stagger: (i: number) => r[i] ?? 0 }, m(z) + (OLAS[z]?.t ?? 0));
      if (z < N - 1) tl.to(g, { fill: COLOR.azul, duration: 0.6, ease: 'power1.inOut' }, m(Math.max(z, 1) + 1) + 0.25);
    });
    tl.fromTo($('.brillo'), { opacity: 0 }, { opacity: 0.55, duration: 0.8, ease: 'power1.out' }, m(1) + 0.3);
    tl.to($('.brillo'), { opacity: 0, duration: 0.6 }, m(2) + 0.25);
    const pines = $.all('.pin');
    const etiquetas = $.all('.etq span');
    CIUDADES.forEach((ci, i) => {
      const ta = m(ci.paso) + ci.llega;
      const pin = pines[i];
      const etq = etiquetas[i];
      if (!pin || !etq) return;
      tl.fromTo(pin.querySelector('b'), { scale: 0 }, { scale: 1, duration: 0.45, ease: 'back.out(3)' }, ta);
      tl.fromTo(pin.querySelector('.onda'), { scale: 0.3, autoAlpha: 1 }, { scale: 2.8, autoAlpha: 0, duration: 0.9, ease: 'power2.out' }, ta);
      tl.fromTo(etq, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(2.2)' }, ta + 0.08);
      if (ci.paso > 0 && ci.paso < N - 1) tl.to(etq, { autoAlpha: 0, scale: 0.85, duration: 0.3, ease: 'power2.in' }, m(ci.paso + 1) + 0.05);
    });

    // Pasos 1 a 5 · Foco corre por el riel, la tarjeta cambia de trimestre
    for (let k = 1; k < N; k++) {
      const t = m(k) + 0.05;
      tl.to($('.caminante'), { x: RX(k) - RX(0), duration: 0.8, ease: 'power2.inOut' }, t);
      tl.to($('.salto'), { y: -34, duration: 0.38, ease: 'power2.out' }, t);
      tl.to($('.salto'), { y: 0, duration: 0.42, ease: 'bounce.out' }, t + 0.38);
      const lleno = { scaleX: k / (N - 1), duration: 0.8, ease: 'power2.inOut' };
      if (k === 1) tl.fromTo($('.via.llena'), { scaleX: 0 }, lleno, t);
      else tl.to($('.via.llena'), lleno, t);
      rotar(per, k, m(k) + 0.1);
      rotar(zon, k, m(k) + 0.16);
      rotar(pro, k, m(k) + 0.22);
      if (k >= 2 && k <= 4) {
        rotar(peo, k, m(k) + 0.28);
        rotar(bus, k, m(k) + 0.34);
      }
    }
    // 1 · los seis oficios vuelan al contador; entran People y Business
    oficios.forEach((o, i) => {
      const p = ofPos(i);
      const dx = CUENTA.x + CUENTA.w / 2 - (ABAJO.x + p.x + OF.w / 2);
      const dy = CUENTA.y + CUENTA.h / 2 - (ABAJO.y + p.y + OF.h / 2);
      tl.to(o, { x: dx, y: dy, scale: 0.15, autoAlpha: 0, duration: 0.55, ease: 'power2.in' }, m(1) + 0.1 + i * 0.05);
    });
    const ramas = $.all('.rama');
    tl.fromTo(ramas, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'back.out(1.6)', stagger: 0.12 }, m(1) + 0.6);
    // 5 · la visión reemplaza a las ramas; el mapa se completa y aparece la placa
    tl.to(ramas, { autoAlpha: 0, y: -18, duration: 0.3, ease: 'power2.in', stagger: 0.06 }, m(5) + 0.2);
    tl.fromTo($('.vision'), { autoAlpha: 0, y: 34, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.6)' }, m(5) + 0.55);
    tl.fromTo($('.relleno'), { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power1.out' }, m(5) + 1.7);
    tl.to($.all('.borde'), { attr: { 'stroke-width': 4 }, stroke: COLOR.azulOscuro, duration: 0.5 }, m(5) + 1.7);
    tl.fromTo($('.placa'), { autoAlpha: 0, scale: 0.5, y: 30 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(2)' }, m(5) + 1.85);

    // Contador de profesiones: un número por trimestre (c.contador), visible solo en su tramo; la barra va a la meta
    const valores = ['PROFESIONES-INICIALES', 'PROF-Q1', 'PROF-Q2', 'PROF-Q3', 'PROF-Q4'].map((id) => c.valor(id) ?? 0);
    const meta = valores[valores.length - 1] || 1;
    const inicio = [0, m(1) + 0.75, m(2) + 0.9, m(3) + 0.9, m(4) + 0.9];
    const nums = $.all('.cuenta .n');
    for (let k = 1; k < nums.length; k++) {
      const el = nums[k];
      const t0 = inicio[k] ?? 0;
      if (!el) continue;
      c.contador(el, { t0, dur: 1.3, desde: valores[k - 1] ?? 0, hasta: valores[k] ?? 0 });
      const barra = { scaleX: (valores[k] ?? 0) / meta, duration: 1.3, ease: 'power2.out' };
      if (k === 1) tl.fromTo($('.barra i'), { scaleX: (valores[0] ?? 0) / meta }, barra, t0);
      else tl.to($('.barra i'), barra, t0);
      tl.to($('.cuenta'), { scale: 1.06, duration: 0.16, ease: 'power2.out', yoyo: true, repeat: 1 }, t0);
    }
    c.pintor((t) => {
      let a = 0;
      inicio.forEach((t0, k) => {
        if (k && t >= t0) a = k;
      });
      nums.forEach((n, k) => (n.style.display = k === a ? '' : 'none'));
    });

    // Arcos (pintor: trazo, cabeza que viaja y atenuado de los pasos anteriores)
    const arcos = $.all('.arco').map((g, i) => {
      const linea = g.querySelector<SVGPathElement>('.linea');
      const halo = g.querySelector<SVGPathElement>('.halo');
      const cabeza = g.querySelector<SVGCircleElement>('.cabeza');
      const L = linea?.getTotalLength() ?? 0;
      for (const p of [linea, halo]) if (p) p.style.strokeDasharray = `${L} ${L}`;
      const a = ARCOS[i];
      return { g, linea, halo, cabeza, L, t0: a?.t0 ?? 0, paso: a?.paso ?? 0 };
    });
    c.pintor((t) => {
      for (const a of arcos) {
        const k = tramo(t, a.t0, a.t0 + DUR_ARCO);
        const e = k < 0.5 ? 4 * k ** 3 : 1 - (-2 * k + 2) ** 3 / 2;
        const off = String(a.L * (1 - e));
        if (a.linea) a.linea.style.strokeDashoffset = off;
        if (a.halo) a.halo.style.strokeDashoffset = off;
        const viaja = k > 0 && k < 1;
        if (a.cabeza) {
          a.cabeza.style.opacity = viaja ? '1' : '0';
          if (viaja && a.linea) {
            const q = a.linea.getPointAtLength(a.L * e);
            a.cabeza.setAttribute('cx', q.x.toFixed(1));
            a.cabeza.setAttribute('cy', q.y.toFixed(1));
          }
        }
        a.g.style.opacity = k <= 0 ? '0' : String(1 - 0.65 * tramo(t, m(a.paso + 1) + 0.2, m(a.paso + 1) + 0.7));
      }
    });

    // Riel (estado de cada parada) y poses de Foco: saluda, corre entre paradas y festeja al final
    const paradas = $.all('.parada');
    const foco = $('.caminante .pj');
    c.pintor((t) => {
      let actual = 0;
      for (let k = 1; k < N; k++) if (t >= m(k) + 0.8) actual = k;
      paradas.forEach((p, k) => (p.dataset['estado'] = k < actual ? 'pasado' : k === actual ? 'actual' : 'futuro'));
      const corre = MARCAS.slice(1, N).some((mk) => t >= mk + 0.05 && t < mk + 0.85);
      pose(foco, corre ? 'd' : t >= m(N - 1) + 0.85 ? 'c' : t >= 0.75 && t < m(1) ? 'b' : 'a');
    });
  },
  ambiente(t, $, tl) {
    // Respiración de Foco (dueño: el ambiente; la línea mueve .caminante y .salto)
    $('.caminante .pj').style.transform = `scaleY(${1 + Math.sin(t * 2.4) * 0.02})`;
    // Latido de Mar del Plata y de los pines del paso actual, una vez que llegaron
    let actual = 0;
    for (let k = 1; k < N; k++) if (tl >= m(k)) actual = k;
    $.all('.pin .latido').forEach((anillo, i) => {
      const ci = CIUDADES[i];
      if (!ci) return;
      const on = tl >= m(ci.paso) + ci.llega + 0.9 && (i === 0 || ci.paso === actual);
      const f = (((t * 0.6 + i * 0.37) % 1) + 1) % 1;
      anillo.style.opacity = on ? String((1 - f) * 0.75) : '0';
      anillo.style.transform = `scale(${0.6 + f * 1.9})`;
    });
  },
});
