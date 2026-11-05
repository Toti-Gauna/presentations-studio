// Diapositiva 5 · Mercado y visión. Un golpe por frase del guion:
// 0 «Arrancamos con seis profesiones en General Pueyrredon, un partido de casi 260 mil hogares» → los seis oficios y un
//   campo de casas que se enciende mientras cuenta los hogares ·
// 1 «Para el primer trimestre comercial aspiramos a captar el 25 % de los trabajos contratados allí…» → la cuenta se arma
//   en bloques conectados: hogares × arreglos ÷ 4 → arreglos por trimestre × 25 % → trabajos ·
// 2 «…y generar cien mil dólares de ingresos brutos» → × ticket real × tarifa → ingresos brutos, contra el objetivo ·
// 3 «Para fines de 2027 queremos llegar a 72 profesiones…» → la cuenta se va; la grilla de profesiones se llena mes a mes ·
// 4 «…y que cuatro de cada diez servicios… en Argentina pasen por Handyx» → el mapa, Buenos Aires, Mar del Plata y 4 de cada 10 casas.
// La franja y 880–950 queda libre en todos los pasos (leyenda del kit) y la de abajo (y > 960), para subtítulos.
import { ARGENTINA } from './comun/argentina.ts';
import { COLOR, entraTitulo, escena, tramo, type Kit } from './comun/kit.ts';

const OFICIOS = [
  { ic: 'electricidad', txt: 'Electricidad' },
  { ic: 'plomeria', txt: 'Plomería' },
  { ic: 'gas', txt: 'Gas' },
  { ic: 'cerrajeria', txt: 'Cerrajería' },
  { ic: 'albanileria', txt: 'Albañilería' },
  { ic: 'aire', txt: 'Aire acondicionado' },
];
// Herramientas de las profesiones que se suman (decorado: no nombra profesiones, que todavía no están confirmadas).
const HERRAMIENTAS = ['martillo', 'llave-inglesa', 'sparkles', 'herramienta', 'camara', 'auto', 'martillo2', 'celular', 'usuarios', 'servidor', 'escudo', 'edificio'];
// Columna 0: las profesiones de hoy; después, una columna por mes (nov 2026 → sep 2027).
const MESES = ['hoy', 'nov', 'dic', 'ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep'];
const FILAS = 6;
const GRILLA = { x: 96, y: 278, lado: 66, paso: 77 };
const colX = (j: number) => GRILLA.x + GRILLA.lado / 2 + j * GRILLA.paso;

// Tiempos de la línea (s)
const T_HOG = 1.0; // los hogares se encienden y se cuentan
const D_HOG = 2.0;
const mesLleno = (j: number) => (j === 0 ? 10.45 : 10.75 + (j - 1) * 0.19);
const ARRIBA = 6.8; // la primera fila de la cuenta sube para dejar lugar a la segunda
const BAJA = 150; // en el paso 1 la fila va centrada en la pantalla

// ——— Vías de la cuenta: líneas con esquinas redondeadas por donde fluyen los puntos ———
type P = [number, number];
interface Via {
  d: string;
  largo: number;
  en: (s: number) => P;
  t0: number;
  dur: number;
  /** Momento en que la línea llega al punto más cercano a (x, y). */
  llega: (p: P) => number;
}
function via(pts: P[], t0: number, dur: number, radio = 34): Via {
  const m: P[] = [pts[0]!];
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[i - 1]!;
    const b = pts[i]!;
    const c = pts[i + 1]!;
    const la = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const lc = Math.hypot(c[0] - b[0], c[1] - b[1]);
    const r = Math.min(radio, la / 2, lc / 2);
    const p0: P = [b[0] - ((b[0] - a[0]) / la) * r, b[1] - ((b[1] - a[1]) / la) * r];
    const p2: P = [b[0] + ((c[0] - b[0]) / lc) * r, b[1] + ((c[1] - b[1]) / lc) * r];
    m.push(p0);
    for (let k = 1; k <= 10; k++) {
      const u = k / 10;
      m.push([(1 - u) ** 2 * p0[0] + 2 * (1 - u) * u * b[0] + u * u * p2[0], (1 - u) ** 2 * p0[1] + 2 * (1 - u) * u * b[1] + u * u * p2[1]]);
    }
  }
  m.push(pts[pts.length - 1]!);
  const acum = [0];
  for (let i = 1; i < m.length; i++) acum.push(acum[i - 1]! + Math.hypot(m[i]![0] - m[i - 1]![0], m[i]![1] - m[i - 1]![1]));
  const largo = acum[acum.length - 1]!;
  const en = (s: number): P => {
    let i = 1;
    while (i < m.length - 1 && acum[i]! < s) i++;
    const a = m[i - 1]!;
    const b = m[i]!;
    const u = Math.min(1, Math.max(0, (s - acum[i - 1]!) / (acum[i]! - acum[i - 1]! || 1)));
    return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
  };
  const llega = ([x, y]: P) => {
    let mejor = 0;
    let dist = Infinity;
    m.forEach((p, i) => {
      const dd = Math.hypot(p[0] - x, p[1] - y);
      if (dd < dist) {
        dist = dd;
        mejor = acum[i]!;
      }
    });
    return t0 + (dur * mejor) / largo;
  };
  return { d: `M${m.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' L')}`, largo, en, t0, dur, llega };
}

// Geometría de la cuenta (px del lienzo, fila 1 ya arriba)
const F1 = 400; // eje de la primera fila (tarjetas de 310 a 490)
const F2 = 720; // eje de la segunda fila (tarjeta de ingresos de 600 a 840)
const OP = {
  o1: [536, F1] as P,
  o2: [744, F1] as P,
  o3: [1332, F1] as P,
  o4: [336, F2] as P,
  o5: [650, F2] as P,
};
const VIAS = [
  via([[426, F1], [840, F1]], 3.85, 0.6),
  via([[1190, F1], [1474, F1]], 5.22, 0.34),
  via([[1649, 490], [1649, 556], [152, 556], [152, F2], [860, F2]], 7.2, 1.0),
];

// Mapa: caja de 560 × 1000 escalada (termina antes de y 860)
const MAPA = { x: 150, y: 238, s: 0.62 };
const MDP = ARGENTINA.ciudades['Mar del Plata'] ?? [378.6, 492.9];
const PIN: P = [MAPA.x + MDP[0] * MAPA.s, MAPA.y + MDP[1] * MAPA.s];
// Casas de «4 de cada 10»: 86 × 82 con un hueco de 16
const CASA = { x: 760, y: 312, w: 86, h: 82, gap: 16 };

/** Campo de casitas (General Pueyrredon): se encienden en ola desde la costa, al ritmo del contador. */
function campo(c: Kit): string {
  const W = 900;
  const H = 590;
  const casas: Array<{ x: number; y: number; k: number }> = [];
  for (let fy = 0; 16 + fy * 22 < H - 8; fy++) {
    for (let fx = 0; 16 + fx * 23 < W - 8; fx++) {
      const az = c.azar();
      const jx = c.azar();
      const jy = c.azar();
      if (fx % 5 === 4 || fy % 4 === 3) continue; // calles
      const x = 16 + fx * 23 + (jx - 0.5) * 3;
      const y = 16 + fy * 22 + (jy - 0.5) * 3;
      const nx = (x - W / 2) / (W / 2 - 8);
      const ny = (y - H / 2) / (H / 2 - 8);
      const a = Math.atan2(ny, nx);
      const borde = 0.9 + 0.06 * Math.sin(a * 3 + 0.6) + 0.04 * Math.cos(a * 5 + 1.3);
      if ((Math.abs(nx) ** 2.5 + Math.abs(ny) ** 2.5) ** (1 / 2.5) > borde) continue;
      const d = Math.hypot(x - W * 0.78, y - H * 0.42) / Math.hypot(W, H);
      casas.push({ x, y, k: d * 1.5 + az * 0.55 });
    }
  }
  const casita = (x: number, y: number) =>
    `M${(x - 7).toFixed(1)} ${(y + 6).toFixed(1)}V${(y - 1).toFixed(1)}L${x.toFixed(1)} ${(y - 7.5).toFixed(1)}L${(x + 7).toFixed(1)} ${(y - 1).toFixed(1)}V${(y + 6).toFixed(1)}Z`;
  const orden = [...casas].sort((p, q) => p.k - q.k);
  // La casa i se enciende cuando el contador (ease cúbico) pasa la fracción i/n: luces y número van juntos.
  const luces = orden.map((h, i) => {
    const q = (i + 1) / orden.length;
    const t = T_HOG + D_HOG * (1 - (1 - q) ** (1 / 3));
    return `<path class="lz" data-t="${t.toFixed(3)}" d="${casita(h.x, h.y)}"/>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}"><path class="apagadas" d="${casas.map((h) => casita(h.x, h.y)).join('')}"/>${luces.join('')}</svg>`;
}

const tilde = `<svg class="tilde" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="${COLOR.verde}"/><path d="M6.8 12.4l3.3 3.3 7-7" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export default escena({
  marcas: [0, 3.2, 6.8, 10.0, 13.4, 16.8],
  cara: [
    { desde: 0, x: 1700, y: 140, d: 250 },
    { desde: 1, x: 1700, y: 140, d: 250 },
    { desde: 2, x: 1700, y: 140, d: 250 },
    { desde: 3, x: 1700, y: 140, d: 250 },
    { desde: 4, x: 1700, y: 140, d: 250 },
  ],
  css: `
    .fondo { position: absolute; inset: 0; background: #EEF0F6; }
    .halo { position: absolute; left: 560px; top: 560px; width: 1500px; height: 1500px; margin: -750px 0 0 -750px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,.9), rgba(255,255,255,0) 62%); }
    .encabezado { position: absolute; left: 96px; top: 52px; }
    .encabezado .titulo { margin-top: 10px; font-size: 60px; color: ${COLOR.azulOscuro}; }

    /* 0 · hogares y oficios */
    .campo { position: absolute; left: 96px; top: 268px; width: 900px; height: 590px; }
    .campo svg { position: absolute; inset: 0; width: 100%; height: 100%; }
    .apagadas { fill: #CDD5E2; }
    .lz { fill: ${COLOR.azul}; opacity: 0; }
    .cuenta0 { position: absolute; left: 1090px; top: 290px; width: 734px; }
    .c0-n { font-size: 146px; color: ${COLOR.azulOscuro}; line-height: 1; white-space: nowrap; }
    .c0-l { margin-top: 10px; font-size: 34px; font-weight: 800; color: ${COLOR.noche}; }
    .c0-f { display: inline-flex; align-items: center; gap: 10px; margin-top: 12px; padding: 8px 18px 8px 12px; border-radius: 999px; background: #fff; font-size: 22px; font-weight: 700; color: ${COLOR.suave}; box-shadow: 0 6px 16px rgba(14,29,54,.08); }
    .c0-f .icono { width: 28px; height: 28px; }
    .oficios { position: absolute; left: 1090px; top: 586px; width: 734px; }
    .ofi-t { display: flex; align-items: center; gap: 14px; font-size: 30px; font-weight: 800; color: ${COLOR.noche}; }
    .ofi-t .n { display: inline-grid; place-items: center; width: 56px; height: 56px; border-radius: 16px; background: ${COLOR.amarillo}; font-size: 34px; box-shadow: 0 5px 0 #C9971E; }
    .ofi-g { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px 14px; margin-top: 18px; }
    .ofi { display: flex; align-items: center; gap: 12px; height: 80px; padding: 0 12px; border-radius: 20px; background: #fff; box-shadow: 0 6px 0 #D5DCE7, 0 14px 26px rgba(14,29,54,.08); font-weight: 700; font-size: 20px; line-height: 1.1; color: ${COLOR.noche}; }
    .ofi i { flex: none; width: 52px; height: 52px; border-radius: 14px; background: #E6EAF1; display: grid; place-items: center; }
    .ofi .icono { width: 30px; height: 30px; }

    /* 1-2 · la cuenta */
    .calc, .fila { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
    .flujo { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; overflow: visible; }
    .via { fill: none; stroke: #C3CEE1; stroke-width: 4; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1 1; stroke-dashoffset: 1; }
    .gotas circle { fill: ${COLOR.azul}; opacity: 0; }
    .bloque { position: absolute; display: flex; flex-direction: column; justify-content: center; height: 180px; padding: 0 26px; border-radius: 26px; background: #fff; box-shadow: 0 16px 34px rgba(14,29,54,.12), 0 4px 0 #DCE2EC; }
    .b-cab { display: flex; align-items: center; gap: 10px; font-size: 22px; font-weight: 800; color: ${COLOR.azul}; }
    .b-cab .icono { width: 30px; height: 30px; }
    .b-num { margin-top: 8px; font-size: 54px; color: ${COLOR.noche}; white-space: nowrap; }
    .b-pie { margin-top: 6px; font-size: 22px; font-weight: 600; color: ${COLOR.suave}; white-space: nowrap; }
    .bA { left: 96px; top: 310px; width: 330px; }
    .bB { left: 840px; top: 310px; width: 350px; }
    .bC { left: 1474px; top: 310px; width: 350px; }
    .bD { left: 860px; top: 600px; width: 964px; height: 240px; padding: 0 44px; box-shadow: 0 22px 44px rgba(14,29,54,.16), 0 5px 0 #DCE2EC; }
    .bD .b-num { margin-top: 0; font-size: 96px; color: ${COLOR.azulOscuro}; }
    .bD .b-pie { margin-top: 2px; font-size: 28px; font-weight: 700; color: ${COLOR.noche}; }
    .foco { position: absolute; border-radius: 34px; border: 6px solid ${COLOR.amarillo}; box-shadow: 0 0 0 6px rgba(255,201,60,.28), 0 0 34px rgba(255,201,60,.55); }
    .foco.fC { left: 1462px; top: 298px; width: 374px; height: 204px; }
    .foco.fD { left: 848px; top: 588px; width: 988px; height: 264px; border-radius: 36px; }
    .ok { display: inline-flex; align-self: flex-start; align-items: center; gap: 12px; margin-top: 14px; padding: 8px 20px 8px 10px; border-radius: 999px; background: #E2F4EA; color: #136B3A; font-weight: 800; font-size: 26px; }
    .tilde { width: 36px; height: 36px; display: block; }
    .op { position: absolute; width: 0; height: 0; }
    .op-in { position: absolute; left: 0; top: -32px; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; }
    .pil { display: flex; align-items: center; gap: 10px; height: 64px; padding: 0 22px 0 10px; border-radius: 999px; background: #fff; box-shadow: 0 10px 22px rgba(14,29,54,.14), 0 4px 0 #DCE2EC; white-space: nowrap; }
    .pil b { width: 44px; height: 44px; border-radius: 50%; display: grid; place-items: center; background: ${COLOR.azul}; color: #fff; font-size: 30px; font-weight: 800; line-height: 1; }
    .pil span { font-size: 36px; color: ${COLOR.noche}; }
    .op.meta .pil { background: ${COLOR.amarillo}; box-shadow: 0 10px 22px rgba(14,29,54,.14), 0 4px 0 #C9971E; }
    .op.meta .pil b { background: ${COLOR.noche}; }
    .op-l { margin-top: 10px; font-size: 20px; font-weight: 700; color: ${COLOR.suave}; text-align: center; line-height: 1.2; white-space: nowrap; }
    .tag { display: block; width: max-content; margin: 6px auto 0; padding: 3px 12px; border-radius: 999px; font-style: normal; font-size: 20px; font-weight: 800; }
    .tag.sup { background: #FCE6C4; color: #8A5200; }
    .tag.obj { background: #FFEFC2; color: #6E4D00; }

    /* 3 · profesiones */
    .crece { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
    .grilla { position: absolute; left: ${GRILLA.x}px; top: ${GRILLA.y}px; }
    .slot, .ficha { position: absolute; width: ${GRILLA.lado}px; height: ${GRILLA.lado}px; border-radius: 18px; }
    .slot { border: 3px dashed #C3CCDB; }
    .ficha { background: #fff; display: grid; place-items: center; box-shadow: 0 5px 0 #D5DCE7, 0 10px 18px rgba(14,29,54,.08); }
    .ficha .icono { width: 32px; height: 32px; }
    .ficha.ini { background: ${COLOR.azul}; box-shadow: 0 5px 0 ${COLOR.azulOscuro}, 0 10px 18px rgba(14,29,54,.12); }
    .regla { position: absolute; left: ${colX(0)}px; top: 746px; width: ${colX(11) - colX(0)}px; height: 8px; border-radius: 4px; background: #D5DCE7; }
    .regla .lleno { position: absolute; left: 0; top: 0; width: 100%; height: 8px; border-radius: 4px; background: ${COLOR.amarillo}; transform-origin: 0 50%; }
    .regla .marca { position: absolute; left: -13px; top: -9px; width: 26px; height: 26px; border-radius: 50%; background: ${COLOR.amarillo}; border: 5px solid #fff; box-shadow: 0 4px 10px rgba(14,29,54,.25); }
    .mes { position: absolute; top: 764px; width: 80px; margin-left: -40px; text-align: center; font-size: 20px; font-weight: 700; color: ${COLOR.suave}; }
    .mes.on { color: ${COLOR.azulOscuro}; font-weight: 800; }
    .anio { position: absolute; top: 798px; padding-top: 4px; border-top: 3px solid #C3CCDB; text-align: center; font-size: 20px; font-weight: 800; color: ${COLOR.noche}; }
    .meta72 { position: absolute; left: 1110px; top: 292px; width: 714px; }
    .n72 { font-size: 230px; line-height: .86; color: ${COLOR.azul}; }
    .l72 { margin-top: 12px; font-size: 52px; color: ${COLOR.noche}; }
    .chip.obj { margin-top: 18px; background: ${COLOR.amarillo}; color: ${COLOR.noche}; }
    .ritmo { display: flex; align-items: center; gap: 18px; margin-top: 30px; padding: 18px 24px; border-radius: 24px; background: #fff; font-size: 26px; font-weight: 600; line-height: 1.25; color: ${COLOR.noche}; box-shadow: 0 14px 30px rgba(14,29,54,.1), 0 4px 0 #DCE2EC; }
    .ritmo .n { flex: none; display: grid; place-items: center; width: 74px; height: 74px; border-radius: 20px; background: ${COLOR.celeste}; font-size: 40px; color: ${COLOR.azul}; }

    /* 4 · Argentina */
    .vision { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
    .disco { position: absolute; left: ${MAPA.x + 280 * MAPA.s - 330}px; top: ${MAPA.y + 470 * MAPA.s - 330}px; width: 660px; height: 660px; border-radius: 50%; background: radial-gradient(circle, rgba(31,87,168,.10), rgba(31,87,168,0) 68%); }
    .mapa { position: absolute; left: ${MAPA.x}px; top: ${MAPA.y}px; width: ${560 * MAPA.s}px; height: ${1000 * MAPA.s}px; }
    .mapa svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
    .pais { fill: #D9E4F6; fill-opacity: 0; stroke: ${COLOR.azul}; stroke-width: 5.5; stroke-linejoin: round; stroke-dasharray: 1 1; stroke-dashoffset: 1; }
    .ba { position: absolute; inset: 0; }
    .ba path { fill: ${COLOR.amarillo}; }
    .pin { position: absolute; left: ${PIN[0]}px; top: ${PIN[1]}px; width: 0; height: 0; }
    .pin .onda { position: absolute; left: -30px; top: -30px; width: 60px; height: 60px; border-radius: 50%; border: 5px solid ${COLOR.azul}; opacity: 0; }
    .pin .cabeza { position: absolute; left: -20px; top: -48px; width: 40px; height: 40px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); background: ${COLOR.azul}; box-shadow: 0 6px 14px rgba(14,29,54,.35); }
    .pin .cabeza::after { content: ''; position: absolute; left: 12px; top: 12px; width: 16px; height: 16px; border-radius: 50%; background: #fff; }
    .pin-l { position: absolute; left: ${PIN[0] + 36}px; top: ${PIN[1] - 54}px; }
    .casas { position: absolute; left: ${CASA.x}px; top: ${CASA.y}px; display: flex; gap: ${CASA.gap}px; }
    .casa { width: ${CASA.w}px; height: ${CASA.h}px; }
    .casa svg { display: block; width: 100%; height: 100%; overflow: visible; }
    .casa .cu { fill: #C9D2E1; }
    .casa .pu { fill: #A9B5C9; }
    .llave4 { position: absolute; left: ${CASA.x}px; top: ${CASA.y + CASA.h + 16}px; height: 20px; border: 5px solid ${COLOR.amarillo}; border-top: 0; border-radius: 0 0 14px 14px; }
    .cap4 { position: absolute; left: ${CASA.x}px; top: ${CASA.y + CASA.h + 48}px; display: flex; align-items: center; gap: 12px; font-size: 28px; font-weight: 800; color: ${COLOR.noche}; white-space: nowrap; }
    .cap4 img { height: 34px; display: block; }
    .cuota { position: absolute; left: ${CASA.x}px; top: 566px; display: flex; align-items: center; gap: 36px; }
    .n40 { font-size: 176px; line-height: .9; color: ${COLOR.azul}; white-space: nowrap; }
    .l40 { width: 520px; font-size: 34px; font-weight: 800; line-height: 1.22; color: ${COLOR.noche}; }
    .l40 .chip { margin-top: 16px; }
  `,
  html: (c) => {
    const n4 = Math.round((c.valor('META-CUOTA-NACIONAL') ?? 0) / 10);
    const op = (cls: string, [x, y]: P, sim: string, val: string, lbl: string, tag = '') =>
      `<div class="op ${cls}" style="left:${x}px;top:${y}px"><div class="op-in"><div class="pil"><b>${sim}</b><span class="t">${val}</span></div><div class="op-l">${lbl}${tag}</div></div></div>`;
    const bloque = (cls: string, ic: string, cab: string, num: string, pie: string) =>
      `<div class="bloque ${cls}"><div class="b-cab">${c.icono(ic)}<span>${cab}</span></div><div class="b-num t">${num}</div><div class="b-pie">${pie}</div></div>`;
    const gotas = (v: Via, i: number) =>
      `<path class="via v${i}" d="${v.d}" pathLength="1"/><g class="gotas g${i}">${'<circle r="6"/>'.repeat(Math.max(3, Math.round(v.largo / 64)))}</g>`;
    let fichas = '';
    MESES.forEach((_, j) => {
      for (let i = 0; i < FILAS; i++) {
        const pos = `left:${j * GRILLA.paso}px;top:${i * GRILLA.paso}px`;
        fichas += `<i class="slot" style="${pos}"></i>`;
        const ic = j === 0 ? OFICIOS[i]!.ic : HERRAMIENTAS[(j * 5 + i * 7) % HERRAMIENTAS.length]!;
        fichas += `<div class="ficha ${j === 0 ? 'ini' : ''} f${j}" style="${pos}">${c.icono(ic, j === 0 ? 'blanco' : '')}</div>`;
      }
    });
    return `
    <div class="fondo"></div><div class="halo"></div>
    <div class="campo">${campo(c)}</div>
    <div class="cuenta0"><div class="c0-n t">0</div><div class="c0-l">hogares en General Pueyrredon</div><div class="c0-f">${c.icono('casa')}Censo 2022</div></div>
    <div class="oficios"><div class="ofi-t"><span class="n t">${c.cifra('PROFESIONES-INICIALES')}</span>profesiones para arrancar</div>
      <div class="ofi-g">${OFICIOS.map((o) => `<div class="ofi"><i>${c.icono(o.ic)}</i><span>${o.txt}</span></div>`).join('')}</div></div>

    <div class="calc">
      <div class="fila fila1">
        <svg class="flujo" viewBox="0 0 1920 1080">${gotas(VIAS[0]!, 0)}${gotas(VIAS[1]!, 1)}</svg>
        <div class="foco fC"></div>
        ${bloque('bA', 'casa', 'Hogares', c.cifra('MDP-HOGARES'), 'General Pueyrredon')}
        ${op('o1', OP.o1, '×', c.cifra('SUP-ARREGLOS-HOGAR'), 'arreglo por año', '<em class="tag sup">supuesto</em>')}
        ${op('o2', OP.o2, '÷', '4', 'trimestres')}
        ${bloque('bB', 'herramienta', 'Arreglos', '', 'por trimestre')}
        ${op('o3 meta', OP.o3, '×', c.cifra('META-CUOTA-LOCAL'), 'de los trabajos', '<em class="tag obj">objetivo</em>')}
        ${bloque('bC', 'acuerdo', 'Trabajos', '', 'en el primer trimestre')}
      </div>
      <div class="fila fila2">
        <svg class="flujo" viewBox="0 0 1920 1080">${gotas(VIAS[2]!, 2)}</svg>
        ${op('o4', OP.o4, '×', c.cifra('PRUEBA-TICKET-USD'), 'ticket real de<br>nuestras pruebas')}
        ${op('o5', OP.o5, '×', c.cifra('TARIFA-USUARIO'), 'tarifa Handyx')}
        <div class="foco fD"></div>
        <div class="bloque bD"><div class="b-num t"></div><div class="b-pie">de ingresos brutos en el primer trimestre</div><div class="ok">${tilde}Objetivo: ${c.cifra('META-INGRESOS-TRIM')}</div></div>
      </div>
    </div>

    <div class="crece">
      <div class="grilla">${fichas}</div>
      <div class="regla"><i class="lleno"></i><i class="marca"></i></div>
      ${MESES.map((m, j) => `<div class="mes" style="left:${colX(j)}px">${m}</div>`).join('')}
      <div class="anio" style="left:${colX(1) - 32}px;width:${colX(2) - colX(1) + 64}px">2026</div>
      <div class="anio" style="left:${colX(3) - 32}px;width:${colX(11) - colX(3) + 64}px">2027</div>
      <div class="meta72"><div class="n72 t">0</div><div class="l72 t">profesiones</div><span class="chip obj">Objetivo · fines de 2027</span>
        <div class="ritmo"><span class="n t">${c.cifra('PROF-POR-MES')}</span><span>profesiones nuevas por mes, cada una con sus herramientas</span></div></div>
    </div>

    <div class="vision">
      <div class="disco"></div>
      <div class="mapa">
        <svg viewBox="0 0 560 1000"><path class="pais" d="${ARGENTINA.contorno}" pathLength="1"/><path class="pais malv" d="${ARGENTINA.malvinas}" pathLength="1"/></svg>
        <div class="ba"><svg viewBox="0 0 560 1000"><defs><clipPath id="mercado-arg"><path d="${ARGENTINA.contorno}"/></clipPath></defs><path d="${ARGENTINA.buenosAires}" clip-path="url(#mercado-arg)"/></svg></div>
      </div>
      <div class="pin"><i class="onda"></i><i class="cabeza"></i></div>
      <span class="chip pin-l">Mar del Plata</span>
      <div class="casas">${Array.from({ length: 10 }, () => `<div class="casa"><svg viewBox="0 0 86 82"><path class="cu" d="M8 38 L43 8 L78 38 V78 H8 Z"/><rect class="pu" x="34" y="52" width="18" height="26" rx="4"/></svg></div>`).join('')}</div>
      <div class="llave4" style="width:${n4 * CASA.w + (n4 - 1) * CASA.gap}px"></div>
      <div class="cap4">${n4} de cada 10 con ${c.logo()}</div>
      <div class="cuota"><div class="n40 t">${c.cifra('META-CUOTA-NACIONAL')}</div><div class="l40">de los servicios contratados por particulares en Argentina<br><span class="chip obj">Objetivo 2027</span></div></div>
    </div>

    <div class="encabezado"><div class="kicker">Mercado y visión</div><div class="titulo t"><span class="l"><span>Empezamos en Mar del Plata.</span></span><span class="l"><span><mark>Pensamos en grande.</mark></span></span></div></div>
  `;
  },
  armar(tl, $, c) {
    const hogares = c.valor('MDP-HOGARES') ?? 0;
    const trim = c.valor('MERCADO-TRIM-N') ?? 0;
    const trabajos = c.valor('Q1-TRABAJOS-N') ?? 0;
    const n4 = Math.round((c.valor('META-CUOTA-NACIONAL') ?? 0) / 10);
    const entra = (el: HTMLElement, t: number) => tl.fromTo(el, { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.42, ease: 'back.out(2.2)' }, t);

    // 0 · título, oficios y hogares
    tl.fromTo($('.halo'), { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 1.2, ease: 'power2.out' }, 0);
    tl.fromTo($('.encabezado .kicker'), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0);
    entraTitulo(tl, $.all('.encabezado .l > span'), 0.1);
    tl.fromTo($('.ofi-t'), { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: 'power3.out' }, 0.3);
    tl.fromTo($.all('.ofi'), { autoAlpha: 0, y: 40, scale: 0.8 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(2)', stagger: 0.08 }, 0.4);
    tl.fromTo($('.campo'), { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, 0.6);
    tl.fromTo([$('.c0-n'), $('.c0-l')], { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out', stagger: 0.1 }, 0.85);
    tl.fromTo($('.c0-f'), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, 2.6);
    c.contador($('.c0-n'), { t0: T_HOG, dur: D_HOG, hasta: hogares });
    const luces = $.all('.lz').map((el) => ({ el, t: Number(el.dataset['t']), v: -1 }));
    c.pintor((t) => {
      for (const l of luces) {
        const v = Math.round(tramo(t, l.t, l.t + 0.16) * 10) / 10;
        if (v !== l.v) {
          l.v = v;
          l.el.style.opacity = String(v);
        }
      }
    });

    // 1 · la cuenta: el campo y el número se condensan en el primer bloque (fila centrada en la pantalla)
    tl.fromTo($('.fila1'), { y: BAJA }, { y: 0, duration: 0.55, ease: 'power3.inOut' }, ARRIBA);
    tl.to($('.oficios'), { autoAlpha: 0, y: 40, duration: 0.35, ease: 'power2.in' }, 3.2);
    tl.to($('.campo'), { x: 261 - 546, y: F1 + BAJA - 563, scale: 0.1, autoAlpha: 0, duration: 0.6, ease: 'power3.in' }, 3.2);
    tl.to($('.cuenta0'), { x: 261 - 1457, y: F1 + BAJA - 420, scale: 0.25, autoAlpha: 0, duration: 0.55, ease: 'power3.in' }, 3.25);
    tl.to($('.halo'), { x: 400, y: 0, duration: 1, ease: 'power2.inOut' }, 3.2);
    entra($('.bA'), 3.62);
    VIAS.forEach((v, i) => tl.fromTo($(`.v${i}`), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: v.dur, ease: 'none' }, v.t0));
    const [v0, v1, v2] = VIAS as [Via, Via, Via];
    entra($('.o1'), v0.llega(OP.o1) - 0.08);
    entra($('.o2'), v0.llega(OP.o2) - 0.08);
    const tB = v0.t0 + v0.dur;
    entra($('.bB'), tB);
    c.contador($('.bB .b-num'), { t0: tB + 0.05, dur: 0.75, desde: hogares, hasta: trim, antes: '≈ ' });
    entra($('.o3'), v1.llega(OP.o3) - 0.08);
    const tC = v1.t0 + v1.dur;
    entra($('.bC'), tC);
    c.contador($('.bC .b-num'), { t0: tC + 0.05, dur: 0.75, desde: trim, hasta: trabajos, antes: '≈ ' });
    tl.fromTo($('.fC'), { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'power3.out' }, tC + 0.85);
    tl.to($('.fC'), { autoAlpha: 0, duration: 0.3 }, ARRIBA);

    // 2 · × ticket × tarifa → ingresos brutos, contra el objetivo
    tl.to($('.halo'), { x: 560, y: 120, duration: 0.9, ease: 'power2.inOut' }, ARRIBA);
    entra($('.o4'), v2.llega(OP.o4) - 0.08);
    entra($('.o5'), v2.llega(OP.o5) - 0.08);
    const tD = v2.t0 + v2.dur;
    tl.fromTo($('.bD'), { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(1.8)' }, tD - 0.05);
    c.contador($('.bD .b-num'), { t0: tD + 0.05, dur: 1.0, hasta: c.valor('Q1-TARIFAS-REAL-N') ?? 0, antes: '≈ USD ' });
    tl.fromTo($('.ok'), { autoAlpha: 0, scale: 0.4, rotation: -8 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.45, ease: 'back.out(2.6)' }, tD + 1.1);
    tl.fromTo($('.fD'), { autoAlpha: 0, scale: 1.04 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'power3.out' }, tD + 1.15);

    // 3 · la cuenta se achica y se va; las profesiones crecen mes a mes
    tl.to($('.calc'), { autoAlpha: 0, scale: 0.82, transformOrigin: '50% 55%', duration: 0.45, ease: 'power2.in' }, 10.0);
    tl.to($('.halo'), { x: 0, y: -40, duration: 0.8, ease: 'power2.inOut' }, 10.0);
    tl.fromTo($.all('.slot'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, stagger: 0.003 }, 10.2);
    tl.fromTo([$('.regla'), ...$.all('.mes'), ...$.all('.anio')], { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.015 }, 10.3);
    MESES.forEach((_, j) =>
      tl.fromTo($.all(`.f${j}`), { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1, duration: 0.32, ease: 'back.out(2.4)', stagger: 0.025 }, mesLleno(j)),
    );
    tl.fromTo($('.meta72'), { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: 'power3.out' }, 10.4);
    // El número sube de a una columna (las profesiones del mes): siempre coincide con la grilla y termina en la meta.
    const inicial = c.valor('PROFESIONES-INICIALES') ?? 0;
    const porMes = c.valor('PROF-POR-MES') ?? 0;
    const meta = c.valor('META-PROFESIONES') ?? 0;
    const n72 = $('.n72');
    const meses = $.all('.mes');
    const lleno = $('.regla .lleno');
    const marca = $('.regla .marca');
    const largoRegla = colX(11) - colX(0);
    c.pintor((t) => {
      let llenos = 0;
      for (let j = 1; j < MESES.length; j++) if (t >= mesLleno(j) + 0.1) llenos = j;
      n72.textContent = String(llenos === MESES.length - 1 ? meta : Math.min(meta, inicial + porMes * llenos));
      meses.forEach((m, j) => m.classList.toggle('on', t >= mesLleno(j) + 0.1));
      const k = tramo(t, mesLleno(0) + 0.1, mesLleno(MESES.length - 1) + 0.1);
      lleno.style.transform = `scaleX(${k})`;
      marca.style.transform = `translateX(${k * largoRegla}px)`;
    });

    // 4 · Argentina: 4 de cada 10 casas, el mapa, Buenos Aires y Mar del Plata
    tl.to($('.crece'), { autoAlpha: 0, scale: 0.85, transformOrigin: '40% 50%', duration: 0.45, ease: 'power2.in' }, 13.4);
    tl.to($('.halo'), { x: -260, y: 0, duration: 0.8, ease: 'power2.inOut' }, 13.4);
    tl.fromTo($.all('.casa'), { autoAlpha: 0, y: 40, scale: 0.6 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(2.2)', stagger: 0.05 }, 13.75);
    $.all('.casa')
      .slice(0, n4)
      .forEach((casa, i) => {
        const t = 14.35 + i * 0.17;
        tl.to(casa.querySelector('.cu'), { fill: COLOR.amarillo, duration: 0.2 }, t);
        tl.to(casa.querySelector('.pu'), { fill: COLOR.azulOscuro, duration: 0.2 }, t);
        tl.fromTo(casa, { scale: 1 }, { scale: 1.16, duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out', immediateRender: false }, t);
      });
    tl.fromTo($('.llave4'), { autoAlpha: 0, scaleX: 0, transformOrigin: '0 50%' }, { autoAlpha: 1, scaleX: 1, duration: 0.4, ease: 'power3.out' }, 15.0);
    tl.fromTo($('.cap4'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' }, 15.1);
    tl.fromTo($('.disco'), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.9, ease: 'power2.out' }, 13.7);
    tl.fromTo($('.mapa .pais'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.3, ease: 'power1.inOut' }, 13.8);
    tl.fromTo($('.mapa .malv'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.4, ease: 'power1.inOut' }, 14.9);
    tl.fromTo($.all('.mapa .pais'), { fillOpacity: 0 }, { fillOpacity: 1, duration: 0.5 }, 14.8);
    tl.fromTo($('.ba svg'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: 'power2.out' }, 15.35);
    tl.fromTo($('.pin'), { autoAlpha: 0, y: -90 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'bounce.out' }, 15.55);
    tl.fromTo($('.pin-l'), { autoAlpha: 0, x: -16 }, { autoAlpha: 1, x: 0, duration: 0.35, ease: 'power3.out' }, 15.95);
    tl.fromTo($('.n40'), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(1.8)' }, 15.2);
    tl.fromTo($('.l40'), { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, duration: 0.45, ease: 'power3.out' }, 15.4);
  },
  ambiente(t, $, tl) {
    // Puntos que fluyen por las vías ya dibujadas (dueño: el ambiente; la línea de tiempo dibuja la vía)
    VIAS.forEach((v, i) => {
      const f = tramo(tl, v.t0, v.t0 + v.dur);
      const gotas = $.all(`.g${i} circle`);
      gotas.forEach((g, k) => {
        const s = (t * 140 + (k * v.largo) / gotas.length) % v.largo;
        const [x, y] = v.en(s);
        g.setAttribute('cx', x.toFixed(1));
        g.setAttribute('cy', y.toFixed(1));
        g.style.opacity = f > 0 && s <= f * v.largo ? '1' : '0';
      });
    });
    // Mar del Plata late
    const k = (t % 1.6) / 1.6;
    const onda = $('.pin .onda');
    onda.style.transform = `scale(${0.5 + k * 1.6})`;
    onda.style.opacity = String((1 - k) * 0.7);
    // Buenos Aires brilla
    $('.ba').style.filter = `drop-shadow(0 0 ${(10 + Math.sin(t * 2.6) * 6).toFixed(1)}px rgba(255,201,60,.95))`;
  },
});
