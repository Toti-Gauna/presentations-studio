// Anexo de respaldo · Competidores en la región y el mundo, por regiones y modelos (sin nombres ni logos). Un golpe por clic:
// 0 Latinoamérica: apps de oficios y de servicio doméstico (en Colombia, con pagos protegidos) ·
// 1 Estados Unidos: el profesional paga por contacto (y hay plataformas de tareas con comisión) ·
// 2 Reino Unido y Europa: suscripción mensual o comisión por trabajo ·
// 3 nuestro camino, desde Argentina: el profesional no paga por su trabajo; el usuario paga una tarifa visible.
// Un globo de puntos (países de world-atlas / Natural Earth, codificados por filas de latitud) gira hacia cada región y Llave
// camina arriba; a la izquierda, una tarjeta por región con «qué aprendemos» que después queda resumida en una fila.
// La leyenda va debajo del globo (franja y 880–950 libre).
import { COLOR, entraTitulo, escena, pose, tramo, type Kit } from './comun/kit.ts';

const T1 = 3.4;
const T2 = 6.8;
const T3 = 10.2;
const FIN = 13.8;

// Máscara del mundo: una fila cada 1,6° de latitud (norte → sur), puntos repartidos según cos(lat), en corridas
// «grupo + cantidad». Grupos: . mar · # tierra · u EE. UU. · m México · c Colombia · l Chile · y Uruguay · a Argentina ·
// g Reino Unido · e Europa occidental. Generado con world-atlas (countries-50m); la Antártida no se dibuja.
const MASCARA = `
  .3 .9 .16 .22 .8#2.1#2.15 .9#7.18 .10#3.1#5.4#1.17 .10#1.1#9.4#2.9#1.10 .9#1.2#3.2#7.18#2.9 .14#2.4#6.18#4.11
  .10#2.1#1.9#6.19#5.2#1.9 .11#4.3#3.4#6.18#1.1#10.2#2.6 .4u4.6#3.1#1.2#4.2#7.10#1.8#20.2#1.1 .1#2u6#39.2#3.5#1.24
  .3#2u5#42.3#1.33 #1.1#2u6#45.1#1.37 .6u5#14.7#1.3#3.6#1.7#3.1#43 .4u7#15.3#3.1#1.5#2.14#3.1#46.1
  .5u5.1u2#14.5#2.8#1.15#4.1#1.1#39.2#3.2 .7u2.5u1#13.5#3.1#1.22#4.2#39.5#1.6 .9u1.5u2#13.6#5.18g2.5#1.3#39.6#2.5
  .16u2#15.3#6.19g2.3e2#1.2#41.6#3.6 .19#17.2#8.17e1.1g1.5e1#46.6#1.7 .18#1.1#17.2#8.18e1.1g2.1e4#49.5#1.8
  .22#26.22g2e5#50.15 .22#25.3#2.21e6#52.16 .24u16#9.1#4.21e9#51.1#1.15 .24u18#6u1#1.1#1.26e6#7.4#4.2#37.18
  .26u18#3u3.1#1.28e7.1#6.4#4.1#39.2#1.1#1.14 .25u20#1u4.28e6.3e2.2#4.6#3.3#37.3#1.17
  .27u24.30e5.5e2.1#5.1#2.2#4.3#35.23 .27u24.31e4.8e1.1#2.1#11.2#32.1#1.1#1.6#1.18
  .29u22.34e4.6e2.2#2.1#11.2#32.4#1.5#1.19 .29u23.35e1.3#5.9#1.1#1.1#42.3#2.3#2.20 .31u23.36#9.12#43.7#3.21
  .33u20.37#10.12#45.5#2.24 .34m1.1m1u2m1u13.38#14.2#3.5#46.5#1.25 .36m5u8.2u2.39#31.2#38.32
  .38m6u2.8u1.35e1.2#25.1#7.2#38.32 .37m1.1m6u1.9u1.37#26.2#7.2#1.1#36.33 .39m1.1m6.47#28.2#8.5#1.2#30.34
  .42m5.47#29.2#12.5#28.2#1.33 .44m4.10#2.35#31.2#12.5#11.2#13.38 .44m5.3m2.6#2.34#31.2#10.9#8.4#8.43
  .46m4.3m2.9#2.31#32.2#10.9#7.6#7.1#1.41 .47m6#2.43#33.2#7.11#6.7#7.8#2.34 .53m1#4.41#34.2#5.13#4.11#6.7#1.35
  .54#4.41#35.1#3.16#4.10#7.7#2.34 .57#2.41#37.6#1.12#3.12#1.1#4.7#1.1#1.33
  .58#1.5c2#3.32#36.2#3.15#3.11#1.2#3.8#1.35 .60#1.1#1.2c1#1.1#6.29#40.16#1.12#1.3#1.10#1.34
  .61#1.1c4#8.29#38.19#1.11#1.14#2.33 .64c7#6.29#7.3#27.19#1.12#1.9#1.4#1.33 .64c6#8e2.36#1.1#24.30#1.2#1.7#3.38
  .64c7#8e1#1.38#23.32#4.5#4.38 .63c6#12.37#22.33#4.4#6.3#1.34 .63#3c3#14.36#21.34#4.3#5.6#1.32
  .62#5c2#16.33#20.38#3.2#4.2#1.7#1.2#1.5#1.20 .63#26.31#18.39#2.13#1.1#1.2#6.22
  .62#28.30#16.41#1.8#1.1#1.9#5.3#1.17 .62#28.30#16.41#2.19#5.5#1.14 .63#27.30#16.47#1.3#1.9#3.2#1.20
  .63#26.31#16.49#1.17#1.18 .63#24.31#17.1#1.83 .64#22.32#17.54#4.3#1.22 .63#22.31#18.4#1.46#2.1#3.4#2.21
  .65#20.31#16.3#3.45#8.2#3.20 .65#19.30#15.4#3.44#14.18#1.1 .65l1#17.31#13.6#2.43#15.19
  .64l1#16.32#12.6#2.4e1.35#19.9#1.8 .64l1a3#12.32#12.5#3.37#22.16 .62l2a5#7.35#12.4#2.38#22.16
  .62l1a6#5.36#10.46#21.15 .60l1a8#4.35#10.45#21.15 .60a8#3.37#8.45#21.14 .58l1a7#3.37#7.45#21.14
  .58a7y2#1.37#6.46#5.4#10.14 .56l1a6y3.37#3.47#3.9#7.15 .55l1a7.100#5.12#1.2 .53l1a7.98#5.12#1.2 .52l1a6.114#2
  .50l1a5.115 .50l1a3.97#2.11#1.2 .48l1a3.106#2.3 .48a3.103#2.3 .45l1a2.106 .44l1a2.102 .43a2.100 .42a1.97
  .41l1.93 .40l1a1.10#1.77 .125 .119 .114 .108 .103 .97 .92 .86 .80 .74 .68 .62 .56 .50 .44 .38 .31 .25 .19 .13 .6
  .1
`;
const PASO_LAT = 1.6;
const RAD = Math.PI / 180;
interface Punto { lat: number; lon: number; g: string; cl: number; sl: number }
const PUNTOS: Punto[] = (() => {
  const out: Punto[] = [];
  MASCARA.trim()
    .split(/\s+/)
    .forEach((fila, k) => {
      const corridas = [...fila.matchAll(/([^0-9])(\d+)/g)].map((m) => [m[1] ?? '.', Number(m[2])] as const);
      const n = corridas.reduce((s, [, c]) => s + c, 0);
      const lat = 90 - PASO_LAT / 2 - k * PASO_LAT;
      let i = 0;
      for (const [g, c] of corridas)
        for (let j = 0; j < c; j++, i++) {
          if (g === '.') continue;
          const lon = -180 + ((i + (k % 2) * 0.5) * 360) / n;
          out.push({ lat: lat * RAD, lon: lon * RAD, g, cl: Math.cos(lat * RAD), sl: Math.sin(lat * RAD) });
        }
    });
  return out;
})();

// Globo y vistas (lon, lat del centro) de cada paso; la de t = 0 muestra Europa y África antes de girar.
const G = { x: 1372, y: 540, r: 318 };
const LIENZO = 720; // canvas cuadrado centrado en el globo
const VISTAS: Array<{ lon: number; lat: number; t0: number }> = [
  { lon: 22, lat: 18, t0: -1 },
  { lon: -70, lat: -12, t0: 0.5 },
  { lon: -97, lat: 34, t0: T1 + 0.1 },
  { lon: -2, lat: 44, t0: T2 + 0.1 },
  { lon: -60, lat: -30, t0: T3 + 0.1 },
];
const GIRO = 1.5;
const suave = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2);
function vista(t: number): { lon: number; lat: number; gira: boolean } {
  let v = VISTAS[0]!;
  let gira = false;
  for (let i = 1; i < VISTAS.length; i++) {
    const b = VISTAS[i]!;
    if (t < b.t0) break;
    const k = suave(tramo(t, b.t0, b.t0 + GIRO));
    gira = k > 0 && k < 1;
    v = { lon: v.lon + (b.lon - v.lon) * k, lat: v.lat + (b.lat - v.lat) * k, t0: b.t0 };
  }
  return { lon: v.lon, lat: v.lat, gira };
}

// Cuándo se enciende cada grupo (s de la línea) y con qué color
const ENCIENDE: Record<string, { t: number; paso: number; color: string }> = {
  m: { t: 1.55, paso: 0, color: COLOR.azul },
  c: { t: 1.7, paso: 0, color: COLOR.azul },
  l: { t: 1.85, paso: 0, color: COLOR.azul },
  y: { t: 1.95, paso: 0, color: COLOR.azul },
  u: { t: T1 + 1.2, paso: 1, color: COLOR.azul },
  g: { t: T2 + 1.2, paso: 2, color: COLOR.azul },
  e: { t: T2 + 1.35, paso: 2, color: COLOR.azul },
  a: { t: T3 + 1.3, paso: 3, color: COLOR.amarillo },
};
const MARCAS = [0, T1, T2, T3, FIN];
const BASE = '#AEBBD0';
const VISITADO = '#7EA2DC';
const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
const mezcla = (a: string, b: string, k: number) => {
  const [x, y] = [rgb(a), rgb(b)];
  return `rgb(${x.map((v, i) => Math.round(v + ((y[i] ?? v) - v) * k)).join(',')})`;
};
function colorDe(g: string, t: number): { c: string; activo: boolean } {
  const e = ENCIENDE[g];
  if (!e) return { c: BASE, activo: false };
  const prende = tramo(t, e.t, e.t + 0.45);
  const fin = MARCAS[e.paso + 1] ?? FIN;
  if (e.paso < 3 && t >= fin) return { c: mezcla(e.color, VISITADO, tramo(t, fin, fin + 0.5)), activo: false };
  return { c: mezcla(BASE, e.color, prende), activo: prende > 0 };
}

// Lugares que se marcan sobre el globo (anillo del paso; pin de Mar del Plata al final)
const ANILLOS = [
  { lon: -98, lat: 39, desde: T1 + 1.2, hasta: T2 },
  { lon: 2, lat: 50, desde: T2 + 1.3, hasta: T3 },
];
const MDP = { lon: -57.55, lat: -38.0 };

/** Proyección ortográfica: x, y relativos al centro del globo (px) y z > 0 si se ve. */
function proyectar(lat: number, lon: number, v: { lon: number; lat: number }) {
  const [l0, f0] = [v.lon * RAD, v.lat * RAD];
  const [cl, sl] = [Math.cos(lat), Math.sin(lat)];
  const d = lon - l0;
  const cd = Math.cos(d);
  return { x: G.r * cl * Math.sin(d), y: -G.r * (Math.cos(f0) * sl - Math.sin(f0) * cl * cd), z: Math.sin(f0) * sl + Math.cos(f0) * cl * cd };
}

// Tarjetas: una por región (abierta en su paso, después resumida en una fila)
const FILA_H = 64;
const FILA_GAP = 10;
const Y0 = 262;
interface Region { k: string; titulo: string; detalle: string; aprendemos?: string; resumen: string; ic: string }
const regiones = (c: Kit): Region[] => [
  { k: 'Latinoamérica', titulo: 'Apps de oficios y de servicio doméstico', detalle: 'México, Colombia, Chile y Uruguay', aprendemos: 'La confianza importa: en Colombia ofrecen <b>pagos protegidos</b>.', resumen: 'oficios y servicio doméstico', ic: 'ubicacion' },
  { k: 'Estados Unidos', titulo: 'El profesional paga por contacto', detalle: 'Y plataformas de tareas con comisión por trabajo', aprendemos: 'Pagar por contacto es pagar también <b>los que no se concretan</b>.', resumen: 'pago por contacto', ic: 'ubicacion' },
  { k: 'Reino Unido y Europa', titulo: 'Suscripción mensual o comisión por trabajo', detalle: 'Reino Unido: cuota · Europa: comisión', aprendemos: 'Comisión o cuota: <b>el costo lo carga el profesional</b>.', resumen: 'cuota o comisión', ic: 'ubicacion' },
  { k: 'Nuestro camino · Argentina', titulo: 'El profesional no paga por su trabajo', detalle: `El usuario paga <b>${c.cifra('TARIFA-USUARIO')}</b>, visible antes de contratar`, resumen: '', ic: 'bandera' },
];

export default escena({
  marcas: MARCAS,
  leyendas: ['Latinoamérica: **apps de oficios y servicio doméstico**', 'Estados Unidos: **pagar por cada contacto**', 'Europa: **cuota mensual o comisión**', 'Nuestro camino: **el profesional no paga**'],
  lugarLeyenda: { x: G.x, y: 918 },
  css: `
    .fondo { position: absolute; inset: 0; background: ${COLOR.hueso}; }
    .halo { position: absolute; left: ${G.x}px; top: ${G.y}px; width: 1400px; height: 1400px; margin: -700px 0 0 -700px; border-radius: 50%; background: radial-gradient(circle, rgba(31,87,168,.07), rgba(31,87,168,0) 60%); }
    .encabezado { position: absolute; left: 96px; top: 52px; z-index: 9; }
    .encabezado .titulo { margin-top: 10px; font-size: 58px; color: ${COLOR.azulOscuro}; }
    .orbita { position: absolute; left: ${G.x - G.r - 20}px; top: ${G.y - G.r - 20}px; width: ${2 * G.r + 40}px; height: ${2 * G.r + 40}px; border-radius: 50%; border: 2px dashed #D3DAE6; }
    .mundo { position: absolute; left: ${G.x - LIENZO / 2}px; top: ${G.y - LIENZO / 2}px; width: ${LIENZO}px; height: ${LIENZO}px; }
    .esfera { position: absolute; left: ${LIENZO / 2 - G.r}px; top: ${LIENZO / 2 - G.r}px; width: ${2 * G.r}px; height: ${2 * G.r}px; border-radius: 50%; background: radial-gradient(circle at 36% 30%, #FFFFFF 0%, #F2F5FA 42%, #DCE4F1 100%); box-shadow: 0 34px 70px rgba(14,29,54,.16), inset 0 0 0 2px rgba(31,87,168,.06); }
    .mundo canvas { position: absolute; left: 0; top: 0; width: ${LIENZO}px; height: ${LIENZO}px; }
    .anillo { position: absolute; left: 0; top: 0; width: 0; height: 0; opacity: 0; }
    .anillo i { position: absolute; left: -64px; top: -64px; width: 128px; height: 128px; border-radius: 50%; border: 5px solid ${COLOR.azul}; }
    .anillo i + i { border-color: rgba(31,87,168,.35); }
    .pin { position: absolute; left: 0; top: 0; width: 0; height: 0; opacity: 0; }
    .pin .cabeza { position: absolute; left: -19px; top: -46px; width: 38px; height: 38px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); background: ${COLOR.amarillo}; box-shadow: 0 6px 14px rgba(14,29,54,.35), inset 0 0 0 3px #D9A21E; }
    .pin .cabeza::after { content: ''; position: absolute; left: 12px; top: 12px; width: 14px; height: 14px; border-radius: 50%; background: ${COLOR.azulOscuro}; }
    .pin .chip { position: absolute; left: 28px; top: -62px; font-size: 21px; padding: 7px 14px; }
    .mov { position: absolute; z-index: 7; transform-origin: 50% 100%; }
    .pj { transform-origin: 50% 100%; }
    /* tarjetas por región */
    .exp { position: absolute; left: 96px; width: 764px; z-index: 4; padding: 24px 30px 24px; border-radius: 28px; background: #fff; box-shadow: 0 18px 40px rgba(14,29,54,.12), 0 4px 0 ${COLOR.borde}; }
    .exp .k { display: flex; align-items: center; gap: 10px; font-size: 22px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: ${COLOR.azul}; }
    .exp .k .icono { width: 26px; height: 26px; }
    .exp h3 { margin-top: 10px; font-size: 40px; line-height: 1.05; color: ${COLOR.azulOscuro}; }
    .exp .det { margin-top: 10px; font-size: 24px; font-weight: 600; color: ${COLOR.texto}; }
    .exp .det b { color: ${COLOR.azul}; }
    .apr { display: flex; gap: 16px; align-items: flex-start; margin-top: 16px; padding: 14px 20px 16px 16px; border-radius: 20px; background: #FFF4D2; }
    .apr .cuad { flex: none; width: 50px; height: 50px; border-radius: 14px; background: ${COLOR.amarillo}; display: grid; place-items: center; box-shadow: 0 4px 0 #D9A21E; }
    .apr .cuad .icono { width: 30px; height: 30px; }
    .apr small { display: block; font-size: 20px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: #8A6400; }
    .apr p { margin-top: 2px; font-size: 25px; font-weight: 700; line-height: 1.25; color: ${COLOR.noche}; }
    .apr b { color: ${COLOR.azul}; }
    .exp.hx { background: ${COLOR.azul}; box-shadow: 0 8px 0 ${COLOR.azulOscuro}, 0 24px 48px rgba(14,29,54,.25); }
    .exp.hx .k { color: ${COLOR.amarillo}; }
    .exp.hx h3 { color: #fff; max-width: 560px; }
    .exp.hx .det { color: #E3ECFA; }
    .exp.hx .det b { color: ${COLOR.amarillo}; }
    .exp.hx .pastilla { position: absolute; right: 26px; top: 22px; padding: 8px 14px; border-radius: 14px; background: #fff; box-shadow: 0 4px 0 ${COLOR.azulOscuro}; }
    .exp.hx .pastilla img { height: 30px; display: block; }
    .chips { display: flex; gap: 12px; margin-top: 18px; }
    .chips .chip { font-size: 21px; padding: 9px 16px; color: ${COLOR.azulOscuro}; box-shadow: 0 4px 0 ${COLOR.azulOscuro}; }
    .chips .chip img { width: 26px; height: 26px; }
    .col { position: absolute; left: 96px; width: 764px; height: ${FILA_H}px; z-index: 4; display: flex; align-items: center; gap: 14px; padding: 0 22px 0 12px; border-radius: 18px; background: #fff; box-shadow: 0 4px 0 ${COLOR.borde}, 0 10px 20px rgba(14,29,54,.06); font-size: 23px; }
    .col .bola { flex: none; width: 42px; height: 42px; border-radius: 50%; background: ${COLOR.celeste}; display: grid; place-items: center; }
    .col .bola .icono { width: 24px; height: 24px; }
    .col b { font-weight: 800; color: ${COLOR.noche}; white-space: nowrap; }
    .col span { font-weight: 600; color: ${COLOR.suave}; white-space: nowrap; }
    .col .ok { margin-left: auto; width: 30px; height: 30px; }
  `,
  html: (c) => {
    const rs = regiones(c);
    const exp = (r: Region, i: number) => `
      <div class="exp e${i} ${i === 3 ? 'hx' : ''}">
        <div class="k">${c.icono(r.ic, i === 3 ? 'oro' : '')}${r.k}</div>${i === 3 ? `<span class="pastilla">${c.logo()}</span>` : ''}
        <h3 class="t">${r.titulo}</h3>
        <div class="det">${r.detalle}</div>
        ${r.aprendemos ? `<div class="apr"><span class="cuad">${c.icono('idea')}</span><div><small>Qué aprendemos</small><p>${r.aprendemos}</p></div></div>` : ''}
        ${i === 3 ? `<div class="chips">${[['herramienta', 'Herramientas'], ['libro', 'Historial'], ['repetir', 'Clientes que vuelven']].map(([ic, t]) => `<span class="chip">${c.icono(ic ?? '')}${t}</span>`).join('')}</div>` : ''}
      </div>`;
    return `
    <div class="fondo"></div><div class="halo"></div>
    <div class="orbita"></div>
    <div class="mundo"><div class="esfera"></div><canvas width="${LIENZO * 2}" height="${LIENZO * 2}"></canvas></div>
    ${ANILLOS.map((_, i) => `<div class="anillo a${i}"><i></i><i></i></div>`).join('')}
    <div class="pin"><i class="cabeza"></i><span class="chip">Mar del Plata</span></div>
    <div class="mov h-llave" style="left:${1306 - 60}px;top:${G.y - Math.sqrt(G.r ** 2 - 66 ** 2) + 6 - 120}px;width:120px;height:120px">${c.pj('llave', '', 120)}</div>
    <div class="mov h-foco" style="left:${1446 - 50}px;top:${G.y - Math.sqrt(G.r ** 2 - 74 ** 2) + 6 - 100}px;width:100px;height:100px">${c.pj('bombilla', '', 100)}</div>
    ${rs.slice(0, 3).map((r, i) => `<div class="col c${i}" style="top:${Y0 + i * (FILA_H + FILA_GAP)}px"><span class="bola">${c.icono('ubicacion')}</span><b>${r.k}</b><span>· ${r.resumen}</span>${c.icono('tilde-circulo', 'ok')}</div>`).join('')}
    ${rs.map((r, i) => exp(r, i)).join('')}
    <div class="encabezado"><div class="kicker">Respaldo · competencia</div><div class="titulo t"><span class="l"><span>Competidores en la región</span></span><span class="l"><span><mark>y el mundo</mark></span></span></div></div>
  `;
  },
  armar(tl, $, c) {
    const exps = $.all('.exp');
    const cols = $.all('.col');
    exps.forEach((e, i) => (e.style.top = `${Y0 + i * (FILA_H + FILA_GAP)}px`));
    // 0 · título, globo y Latinoamérica
    tl.fromTo($('.halo'), { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 1.2, ease: 'power2.out' }, 0);
    tl.fromTo($('.encabezado .kicker'), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0);
    entraTitulo(tl, $.all('.encabezado .l > span'), 0.1);
    tl.fromTo($('.mundo'), { autoAlpha: 0, scale: 0.86 }, { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'power3.out' }, 0.2);
    tl.fromTo($('.orbita'), { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'power3.out' }, 0.35);
    tl.fromTo($('.h-llave'), { autoAlpha: 0, y: -80 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'bounce.out' }, 0.7);
    tl.set([...exps, ...cols, $('.h-foco')], { autoAlpha: 0 }, 0);
    const abre = (i: number, t: number) => {
      const e = exps[i]!;
      tl.fromTo(e, { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'back.out(1.5)', immediateRender: false }, t);
      tl.fromTo(e.querySelectorAll(':scope > *:not(.pastilla)'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.38, ease: 'power3.out', stagger: 0.12, immediateRender: false }, t + 0.15);
    };
    const cierra = (i: number, t: number) => {
      tl.to(exps[i]!, { autoAlpha: 0, y: -10, duration: 0.25, ease: 'power2.in' }, t);
      tl.fromTo(cols[i]!, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power3.out', immediateRender: false }, t + 0.22);
    };
    abre(0, 1.2);
    // 1 · Estados Unidos
    cierra(0, T1);
    abre(1, T1 + 0.5);
    // 2 · Reino Unido y Europa
    cierra(1, T2);
    abre(2, T2 + 0.5);
    // 3 · nuestro camino
    cierra(2, T3);
    abre(3, T3 + 0.5);
    tl.fromTo($('.h-foco'), { autoAlpha: 0, y: -90 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'bounce.out', immediateRender: false }, T3 + 1.5);

    // Poses: Llave camina mientras gira el mundo, saluda al llegar y festeja en casa
    const llave = $('.h-llave .pj');
    const foco = $('.h-foco .pj');
    c.pintor((t) => {
      const g = vista(t).gira;
      const llega = VISTAS.slice(1).some((v) => t >= v.t0 + GIRO && t < v.t0 + GIRO + 0.9);
      pose(llave, t >= T3 + GIRO + 0.1 ? 'c' : g ? 'd' : llega ? 'b' : 'a');
      pose(foco, t >= T3 + 2.2 ? 'c' : 'b');
    });
  },
  ambiente(t, $, tl) {
    // El globo (dueño: el ambiente): vista según la línea de tiempo más un vaivén leve que no saca de cuadro a la región
    const v0 = vista(tl);
    const v = { lon: v0.lon + Math.sin(t * 0.35) * 2.5, lat: v0.lat };
    const cv = $('.mundo canvas') as unknown as HTMLCanvasElement;
    const ctx = cv.getContext('2d');
    if (ctx) {
      ctx.setTransform(2, 0, 0, 2, 0, 0);
      ctx.clearRect(0, 0, LIENZO, LIENZO);
      // Un trazo por color y por franja de profundidad (8): pocos fill por cuadro aunque haya miles de puntos
      const colores = new Map<string, { c: string; activo: boolean }>();
      for (const g of ['#', ...Object.keys(ENCIENDE)]) colores.set(g, colorDe(g, tl));
      const [l0, f0] = [v.lon * RAD, v.lat * RAD];
      const [cf, sf] = [Math.cos(f0), Math.sin(f0)];
      const capas = new Map<string, Path2D[]>();
      for (const p of PUNTOS) {
        const col = colores.get(p.g) ?? { c: BASE, activo: false };
        const d = p.lon - l0;
        const cd = Math.cos(d);
        const z = sf * p.sl + cf * p.cl * cd;
        if (z <= 0.02) continue;
        const x = LIENZO / 2 + G.r * p.cl * Math.sin(d);
        const y = LIENZO / 2 - G.r * (cf * p.sl - sf * p.cl * cd);
        const r = (col.activo ? 3.8 : 3.1) * (0.55 + 0.45 * z);
        const clave = `${col.activo ? 1 : 0}|${col.c}`;
        let franjas = capas.get(clave);
        if (!franjas) {
          franjas = Array.from({ length: 8 }, () => new Path2D());
          capas.set(clave, franjas);
        }
        const tr = franjas[Math.min(7, Math.floor(z * 8))]!;
        tr.moveTo(x + r, y);
        tr.arc(x, y, r, 0, Math.PI * 2);
      }
      for (const [clave, franjas] of [...capas].sort((a, b) => a[0].localeCompare(b[0]))) {
        ctx.fillStyle = clave.slice(2);
        franjas.forEach((tr, b) => {
          ctx.globalAlpha = 0.35 + 0.65 * ((b + 0.5) / 8);
          ctx.fill(tr);
        });
      }
      ctx.globalAlpha = 1;
    }
    // Anillos del paso y pin de Mar del Plata (siguen al globo)
    ANILLOS.forEach((a, i) => {
      const el = $(`.anillo.a${i}`);
      const q = proyectar(a.lat * RAD, a.lon * RAD, v);
      const on = tramo(tl, a.desde, a.desde + 0.3) * (1 - tramo(tl, a.hasta, a.hasta + 0.3));
      el.style.opacity = q.z > 0.2 ? String(on) : '0';
      el.style.transform = `translate(${G.x + q.x}px, ${G.y + q.y}px)`;
      const k = (t % 1.8) / 1.8;
      const [i1, i2] = [...el.querySelectorAll<HTMLElement>('i')];
      if (i1) i1.style.transform = `scale(${0.75 + 0.1 * Math.sin(t * 3)})`;
      if (i2) {
        i2.style.transform = `scale(${0.7 + k * 0.9})`;
        i2.style.opacity = String(1 - k);
      }
    });
    const pin = $('.pin');
    const q = proyectar(MDP.lat * RAD, MDP.lon * RAD, v);
    pin.style.opacity = q.z > 0.2 ? String(tramo(tl, T3 + 1.4, T3 + 1.8)) : '0';
    pin.style.transform = `translate(${G.x + q.x}px, ${G.y + q.y}px)`;
    $('.orbita').style.rotate = `${t * 4}deg`;
    // Respiración de los Handys; Llave rebota al caminar
    $.all('.mov .pj').forEach((p, i) => {
      if (i === 0 && v0.gira) {
        const f = Math.sin(t * 14);
        p.style.transform = `translateY(${(-Math.abs(f) * 10).toFixed(1)}px) rotate(${(f * 4).toFixed(1)}deg)`;
      } else p.style.transform = `scaleY(${(1 + Math.sin(t * 2.4 + i) * 0.02).toFixed(4)})`;
    });
  },
});
