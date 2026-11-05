// Diapositiva 6 · Competencia y modelo. Un golpe por frase del guion:
// 0 «Y hablemos de competencia. La conocemos. Algunas plataformas cobran comisión al profesional.» → océano rojo: un bote
//   por plataforma (anónimas, por modelo de cobro) y las monedas de Llave que se van a las que le cobran ·
// 1 «Nosotros creemos que ese no es el camino.» → al lado de cada plataforma, cómo lo resuelve Handyx ·
// 2 «El dinero que gana trabajando tiene que llegar completo a su casa.» → el presupuesto viaja entero hasta su casa ·
// 3 «Nuestro modelo es simple: …» → el recibo del ejemplo se arma línea por línea y Foco (el usuario) lo mira ·
// 4 (cierre) → océano azul: el mar pasa de rojo a azul, la balsa de Llave se vuelve el barco de Handyx, entran las
//   cuatro acciones y los Handys de cada oficio se suben a medida que se suman las herramientas.
// Sin nombres ni logos de terceros. La franja y 880–950 queda libre para la leyenda del kit (ahí solo hay mar).
import { COLOR, entraTitulo, escena, pose, tramo, type Kit, type Personaje, type Pose } from './comun/kit.ts';

const T1 = 3.6;
const T2 = 6.2;
const T3 = 9.4;
const T4 = 13.0;
const FIN = 17.8;

// Mar en capas (como el océano del motor, reimplementado para intercalar los botes entre las olas).
const OLAS = [
  { nivel: 330, amp: 10, largo: 320, v: 8, rojo: '#D0585C', azul: '#A6CAF4' },
  { nivel: 460, amp: 14, largo: 480, v: 12, rojo: '#BC4049', azul: '#78A9EC' },
  { nivel: 580, amp: 16, largo: 480, v: 16, rojo: '#A4303D', azul: '#4E89DB' },
  { nivel: 700, amp: 20, largo: 640, v: 21, rojo: '#8B2333', azul: '#3070C8' },
  { nivel: 820, amp: 22, largo: 640, v: 27, rojo: '#711829', azul: '#1F57A8' },
  { nivel: 868, amp: 26, largo: 960, v: 34, rojo: '#56101E', azul: '#13305E' },
] as const;
function ola(nivel: number, amp: number, largo: number): string {
  let d = `M0 ${nivel}`;
  for (let x = 0; x < 3840; x += largo) d += ` Q ${x + largo / 4} ${nivel - amp} ${x + largo / 2} ${nivel} T ${x + largo} ${nivel}`;
  return `${d} L3840 1080 L0 1080 Z`;
}

// Una fila por plataforma: el bote (con su letra) navega en su ola; a la derecha, cómo lo resuelve Handyx.
const FILAS = [
  { letra: 'A', ic: 'porcentaje', monedas: 3 },
  { letra: 'B', ic: 'cliente-nuevo', monedas: 2 },
  { letra: 'C', ic: 'calendario', monedas: 2 },
  { letra: 'D', ic: 'reloj', monedas: 0 },
] as const;
const filaY = (i: number) => 400 + i * 120;
const BOTE_X = 452;
const DX = 260; // en el paso 0 las filas van centradas; en el paso 1 se corren para dejar lugar a Handyx
const queHace = (c: Kit) => [
  `cobra comisión al profesional (hasta ${c.cifra('COMP-CLICKIE-PRO')})`,
  'cobra por contacto u oportunidad',
  'cobra una suscripción mensual',
  'comisión cero, pero por tiempo limitado',
];
const comoHandyx = (c: Kit) => [
  `${c.cifra('FEE-ESPECIALISTA')} al profesional, cobra su presupuesto completo`,
  'el profesional no paga por contactos; paga el usuario una tarifa visible',
  'la tarifa la paga el usuario, visible antes de contratar',
  `${c.cifra('FEE-ESPECIALISTA')} al profesional es nuestro modelo, no una promoción`,
];

// Llave en su balsa (pies sobre la cubierta) y las monedas que se le van a los botes que cobran.
const X0 = 150;
const CUB0 = 856;
const MANO = { x: X0 + 46, y: CUB0 - 92 };
const MONEDAS = FILAS.flatMap((f, r) => Array.from({ length: f.monedas }, (_, j) => ({ r, j }))).map((m, i) => ({
  ...m,
  t0: 1.9 + i * 0.18,
  x1: BOTE_X + DX - 50 + m.j * 3,
  y1: filaY(m.r) + 50 - 33 - m.j * 8,
}));
const VUELO = 0.55;

// Camino del presupuesto: de las manos de Llave a la puerta de su casa (Bézier cúbica recorrida a velocidad pareja).
type Pt = { x: number; y: number };
function camino(a: Pt, b: Pt, c: Pt, d: Pt): (s: number) => Pt & { ang: number } {
  const en = (u: number): Pt => {
    const v = 1 - u;
    return {
      x: v * v * v * a.x + 3 * v * v * u * b.x + 3 * v * u * u * c.x + u * u * u * d.x,
      y: v * v * v * a.y + 3 * v * v * u * b.y + 3 * v * u * u * c.y + u * u * u * d.y,
    };
  };
  const N = 240;
  const pts: Pt[] = [];
  const largo: number[] = [];
  let acum = 0;
  for (let i = 0; i <= N; i++) {
    const p = en(i / N);
    const q = pts[i - 1];
    if (q) acum += Math.hypot(p.x - q.x, p.y - q.y);
    pts.push(p);
    largo.push(acum);
  }
  return (s) => {
    const meta = Math.min(1, Math.max(0, s)) * acum;
    let i = 1;
    while (i < N && (largo[i] ?? acum) < meta) i++;
    const p0 = pts[i - 1] ?? a;
    const p1 = pts[i] ?? d;
    const l0 = largo[i - 1] ?? 0;
    const l1 = largo[i] ?? acum;
    const f = l1 > l0 ? (meta - l0) / (l1 - l0) : 0;
    return { x: p0.x + (p1.x - p0.x) * f, y: p0.y + (p1.y - p0.y) * f, ang: (Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180) / Math.PI };
  };
}
const PUERTA = { x: 1738, y: 775 };
const CAMINO = camino({ x: 215, y: 655 }, { x: 500, y: 180 }, { x: 1480, y: 820 }, PUERTA);
const PUNTOS = 34;

// Cierre: las cuatro acciones del océano azul y la tripulación de Handys que sube al barco.
const ACCIONES = [
  { verbo: 'Eliminamos', clase: 'el', txt: 'la comisión al profesional.' },
  { verbo: 'Reducimos', clase: 're', txt: 'las idas y vueltas para conseguir y coordinar.' },
  { verbo: 'Aumentamos', clase: 'au', txt: 'la transparencia del precio.' },
  { verbo: 'Creamos', clase: 'cr', txt: 'HandIA, herramientas por oficio, ferreterías conectadas y Handyx for Business.' },
] as const;
const TRIPULACION: Array<{ pj: Personaje; x: number; alto: number; pie: number; fin: Pose }> = [
  { pj: 'grifo', x: 118, alto: 100, pie: -8, fin: 'c' },
  { pj: 'medidor_gas', x: 222, alto: 96, pie: -12, fin: 'b' },
  { pj: 'aire', x: 334, alto: 62, pie: -16, fin: 'c' },
  { pj: 'brocha', x: 440, alto: 104, pie: -20, fin: 'b' },
];
const SUBE = (i: number) => T4 + 2.8 + i * 0.3;

const vaiven = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2);

export default escena({
  marcas: [0, T1, T2, T3, T4, FIN],
  cara: [
    { desde: 0, x: 1700, y: 180, d: 250 },
    { desde: 1, x: 1700, y: 180, d: 250 },
    { desde: 2, x: 1700, y: 180, d: 250 },
    { desde: 3, x: 1700, y: 180, d: 250 },
    { desde: 4, x: 1700, y: 180, d: 250 },
  ],
  css: `
    .cielo { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; z-index: 1; }
    .cielo.r { background: linear-gradient(180deg, #F8F4F0 0, #F6E4DD 200px, #F0C8BF 340px); }
    .cielo.a { background: linear-gradient(180deg, #F7F6F1 0, #E4EEFB 200px, #C2D9F7 340px); clip-path: inset(0 100% 0 0); }
    .nube { position: absolute; z-index: 2; width: 190px; height: 54px; border-radius: 40px; background: #fff; opacity: .9; }
    .nube::before { content: ''; position: absolute; left: 34px; top: -34px; width: 86px; height: 86px; border-radius: 50%; background: #fff; }
    .nube::after { content: ''; position: absolute; left: 96px; top: -20px; width: 64px; height: 64px; border-radius: 50%; background: #fff; }
    .capa-w { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
    .capa { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; overflow: hidden; display: block; }
    .capa path { stroke: rgba(255,255,255,.16); stroke-width: 3; }
    .capa.a { clip-path: inset(0 100% 0 0); }
    .espuma { position: absolute; left: 0; top: 330px; width: 120px; height: 750px; z-index: 14; opacity: 0; background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.6) 62%, rgba(255,255,255,0)); }
    .encabezado { position: absolute; left: 96px; top: 46px; z-index: 20; }
    .encabezado .titulo { margin-top: 10px; font-size: 68px; }
    .fuente { position: absolute; left: 96px; top: 244px; z-index: 20; font-size: 20px; font-weight: 600; color: ${COLOR.suave}; }
    /* botes de la competencia (anónimos) */
    .bote { position: absolute; width: 0; height: 0; }
    .bote .flota { position: absolute; left: 0; top: 0; transform-origin: 0 0; }
    .b-casco { position: absolute; left: -72px; top: -26px; width: 144px; height: 42px; background: #3A1620; clip-path: polygon(0 0, 100% 0, 84% 100%, 16% 100%); }
    .b-casco::before { content: ''; position: absolute; left: 0; right: 0; top: 7px; height: 6px; background: rgba(255,255,255,.22); }
    .b-mastil { position: absolute; left: -13px; top: -100px; width: 7px; height: 76px; border-radius: 4px; background: #4C2A30; }
    .b-vela { position: absolute; left: -5px; top: -95px; width: 66px; height: 64px; background: #FFF4F0; clip-path: polygon(0 0, 100% 100%, 0 100%); }
    .b-vela b { position: absolute; left: 6px; bottom: 4px; font-size: 24px; line-height: 1; color: ${COLOR.rojo}; }
    .b-ban { position: absolute; left: -7px; top: -100px; width: 30px; height: 16px; background: ${COLOR.rojo}; clip-path: polygon(0 0, 100% 50%, 0 100%); transform-origin: 0 50%; }
    .pm { position: absolute; width: 28px; height: 14px; border-radius: 50%; background: ${COLOR.amarillo}; box-shadow: inset 0 -3px 0 #C98F0E, 0 2px 0 #9E700A; opacity: 0; }
    .etq { position: absolute; left: 556px; width: 548px; height: 82px; z-index: 15; display: flex; align-items: center; gap: 14px; padding: 0 20px 0 16px; border-radius: 20px; background: #FFF7F5; box-shadow: 0 12px 26px rgba(40,6,12,.32); }
    .etq .ic { flex: none; width: 50px; height: 50px; border-radius: 14px; background: #FBE1DE; display: grid; place-items: center; }
    .etq .ic i { width: 30px; height: 30px; background: ${COLOR.rojo}; -webkit-mask: var(--u) center / contain no-repeat; mask: var(--u) center / contain no-repeat; }
    .etq b { display: block; font-weight: 800; font-size: 24px; line-height: 28px; }
    .etq span { display: block; font-weight: 600; font-size: 21px; line-height: 26px; color: #7A3440; white-space: nowrap; }
    .flecha { position: absolute; left: 1112px; width: 52px; height: 36px; z-index: 15; }
    .resp { position: absolute; left: 1174px; width: 690px; height: 82px; z-index: 15; display: flex; align-items: center; gap: 14px; padding: 0 22px 0 18px; border-radius: 20px; background: ${COLOR.azul}; color: #fff; font-size: 21px; font-weight: 600; line-height: 27px; box-shadow: 0 7px 0 ${COLOR.azulOscuro}, 0 18px 34px rgba(14,29,54,.3); }
    .resp b { color: ${COLOR.amarillo}; font-weight: 800; }
    .resp .icono { flex: none; width: 32px; height: 32px; }
    .moneda { position: absolute; left: 0; top: 0; z-index: 19; width: 36px; height: 36px; margin: -18px 0 0 -18px; border-radius: 50%; opacity: 0; background: radial-gradient(circle at 35% 30%, #FFE59A, ${COLOR.amarillo} 58%, #E0A51A); box-shadow: inset 0 0 0 3px #C98F0E, 0 5px 12px rgba(0,0,0,.28); font-weight: 900; font-size: 20px; line-height: 36px; text-align: center; color: #8A5A00; }
    /* Llave: balsa y barco de Handyx */
    .nave { position: absolute; left: ${X0}px; top: ${CUB0}px; width: 0; height: 0; z-index: 12; }
    .flota-n { position: absolute; left: 0; top: 0; transform-origin: 200px 0; }
    .balsa { position: absolute; left: -112px; top: -4px; width: 224px; height: 40px; }
    .balsa i { position: absolute; left: 0; right: 0; height: 18px; border-radius: 9px; background: #A8743F; box-shadow: inset 0 -4px 0 rgba(0,0,0,.2); }
    .balsa i:nth-child(1) { top: 0; } .balsa i:nth-child(2) { top: 16px; left: 12px; right: 12px; background: #8E5F31; }
    .balsa::before, .balsa::after { content: ''; position: absolute; top: -2px; width: 10px; height: 38px; border-radius: 3px; background: #E8D2A0; z-index: 1; }
    .balsa::before { left: 44px; } .balsa::after { right: 44px; }
    .mov-llave { position: absolute; left: -70px; top: -132px; width: 140px; height: 140px; }
    .mov-llave .pj, .trip .pj, .mov-foco .pj { transform-origin: 50% 100%; }
    .trip { position: absolute; }
    .casco-h { position: absolute; left: -130px; top: -34px; width: 650px; height: 132px; overflow: visible; }
    .mastil-h { position: absolute; left: 226px; top: -520px; width: 10px; height: 520px; border-radius: 5px; background: ${COLOR.azulOscuro}; transform-origin: 50% 100%; }
    .verga { position: absolute; left: 50px; width: 364px; height: 12px; border-radius: 6px; background: ${COLOR.azulOscuro}; }
    .verga.v1 { top: -506px; } .verga.v2 { top: -136px; }
    .vela-h { position: absolute; left: 62px; top: -498px; width: 340px; height: 366px; transform-origin: 50% 0; }
    .vela-h svg { position: absolute; inset: 0; }
    .vela-h .logo-vela { position: absolute; left: 50px; top: 152px; width: 240px; }
    .ban-h { position: absolute; left: 236px; top: -520px; width: 76px; height: 34px; background: ${COLOR.amarillo}; clip-path: polygon(0 0, 100% 50%, 0 100%); transform-origin: 0 50%; }
    /* costa y casa de Llave */
    .costa { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; z-index: 12; }
    .costa svg { position: absolute; left: 0; top: 0; }
    .casa { position: absolute; left: 1620px; top: 596px; width: 240px; height: 210px; }
    .chimenea { position: absolute; left: 176px; top: 18px; width: 30px; height: 56px; background: #7A869C; border-radius: 4px 4px 0 0; }
    .techo2 { position: absolute; left: -14px; top: 0; width: 268px; height: 100px; background: ${COLOR.azulOscuro}; clip-path: polygon(50% 0, 100% 100%, 0 100%); }
    .pared2 { position: absolute; left: 10px; top: 100px; width: 220px; height: 110px; background-color: #F2F0EA; background-image: linear-gradient(90deg, rgba(14,29,54,.06) 2px, transparent 2px), linear-gradient(rgba(14,29,54,.06) 2px, transparent 2px); background-size: 36px 36px; border-radius: 0 0 10px 10px; transform-origin: 50% 100%; }
    .ven { position: absolute; top: 22px; width: 54px; height: 44px; border-radius: 8px; background: ${COLOR.celeste}; border: 6px solid #fff; box-shadow: 0 0 0 3px #D6D9E0; }
    .ven.v1 { left: 18px; } .ven.v2 { left: 148px; }
    .luz { position: absolute; inset: -2px; border-radius: 4px; background: ${COLOR.amarillo}; box-shadow: 0 0 26px 8px rgba(255,201,60,.75); opacity: 0; }
    .puerta { position: absolute; left: 87px; top: 44px; width: 46px; height: 66px; border-radius: 8px 8px 0 0; background: ${COLOR.azul}; }
    .anillo { position: absolute; left: ${PUERTA.x - 40}px; top: ${PUERTA.y - 40}px; width: 80px; height: 80px; border-radius: 50%; border: 6px solid ${COLOR.amarillo}; z-index: 16; opacity: 0; }
    .rastro { position: absolute; left: 0; top: 0; z-index: 16; }
    .punto { position: absolute; width: 12px; height: 12px; margin: -6px 0 0 -6px; border-radius: 50%; background: ${COLOR.amarillo}; box-shadow: 0 0 0 3px rgba(86,16,30,.35); opacity: 0; }
    .billete { position: absolute; left: 0; top: 0; z-index: 17; opacity: 0; }
    .billete .cuerpo { display: flex; align-items: center; gap: 14px; padding: 12px 24px 12px 12px; border-radius: 16px; background: #E5F5EA; border: 4px solid ${COLOR.verde}; box-shadow: 0 14px 30px rgba(0,0,0,.28); white-space: nowrap; }
    .billete .medalla { width: 58px; height: 58px; border-radius: 50%; background: ${COLOR.verde}; display: grid; place-items: center; }
    .billete b { display: block; font-size: 40px; color: #0F5C33; }
    .billete span { display: block; margin-top: 2px; font-size: 20px; font-weight: 700; color: #2C6E47; }
    .llega { position: absolute; right: 36px; top: 506px; z-index: 17; font-size: 26px; background: ${COLOR.verde}; box-shadow: 0 8px 0 #157A42, 0 18px 36px rgba(14,29,54,.25); }
    .llega .monto { padding: 4px 14px 6px; border-radius: 12px; background: #fff; color: #0F5C33; }
    /* recibo del ejemplo */
    .recibo { position: absolute; left: 560px; top: 360px; width: 800px; z-index: 18; padding: 22px 34px 24px; }
    .rc-cab { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 20px; letter-spacing: .08em; text-transform: uppercase; color: ${COLOR.suave}; }
    .rc-cab .icono { width: 26px; height: 26px; }
    .rc-l { display: flex; align-items: center; justify-content: space-between; margin-top: 14px; }
    .rc-l > span { display: flex; align-items: center; gap: 12px; font-size: 25px; font-weight: 700; }
    .op { flex: none; width: 38px; height: 38px; border-radius: 50%; background: ${COLOR.celeste}; color: ${COLOR.azul}; display: grid; place-items: center; font-size: 26px; }
    .op .icono { width: 22px; height: 22px; }
    .rc-l b { font-size: 36px; white-space: nowrap; }
    .rc-div { margin: 16px 0 2px; border-top: 3px dashed ${COLOR.borde}; transform-origin: 0 50%; }
    .rc-l.total > span { font-size: 26px; font-weight: 800; }
    .rc-l.total b { font-size: 48px; color: ${COLOR.azul}; }
    .rc-sellos { position: absolute; left: 560px; top: 652px; width: 800px; z-index: 18; display: flex; justify-content: center; gap: 16px; }
    .rc-sellos .chip .icono { width: 28px; height: 28px; }
    .mov-foco { position: absolute; left: 1222px; top: 246px; width: 118px; height: 118px; z-index: 17; }
    /* océano azul: las cuatro acciones */
    .errc-k { position: absolute; left: 920px; top: 286px; z-index: 18; display: flex; align-items: center; gap: 10px; }
    .errc-k .icono { width: 28px; height: 28px; }
    .accion { position: absolute; left: 920px; width: 900px; z-index: 18; display: flex; align-items: center; gap: 20px; padding: 16px 22px 16px 18px; border-radius: 22px; background: #fff; box-shadow: 0 14px 30px rgba(14,29,54,.24), 0 3px 0 ${COLOR.borde}; }
    .verbo { flex: none; width: 240px; padding: 10px 0 12px; border-radius: 14px; text-align: center; font-size: 25px; color: #fff; }
    .verbo.el { background: ${COLOR.rojo}; box-shadow: 0 5px 0 #A3231B; }
    .verbo.re { background: ${COLOR.naranja}; color: ${COLOR.noche}; box-shadow: 0 5px 0 #C98314; }
    .verbo.au { background: ${COLOR.verde}; box-shadow: 0 5px 0 #157A42; }
    .verbo.cr { background: ${COLOR.azul}; box-shadow: 0 5px 0 ${COLOR.azulOscuro}; }
    .accion p { flex: 1; font-size: 24px; font-weight: 700; line-height: 1.25; }
    .accion .txt { flex: 1; } .accion .txt p { font-size: 23px; }
    .accion .txt small { display: block; margin-top: 6px; font-size: 20px; font-weight: 700; color: ${COLOR.suave}; }
    .cuenta { flex: none; width: 190px; display: flex; flex-direction: column; align-items: center; padding-left: 18px; border-left: 3px dashed ${COLOR.borde}; }
    .cuenta b { font-size: 66px; line-height: 1; color: ${COLOR.azul}; }
    .cuenta span { margin-top: 4px; font-size: 20px; font-weight: 800; line-height: 1.15; text-align: center; }
    .brillo { position: absolute; z-index: 13; width: 44px; height: 44px; }
    .brillo .icono { width: 44px; height: 44px; }
  `,
  html: (c) => {
    const capas = (i: number) => {
      const o = OLAS[i];
      if (!o) return '';
      const d = ola(o.nivel, o.amp, o.largo);
      const svg = (cl: string, fill: string) => `<svg class="capa ${cl}" viewBox="0 0 1920 1080" preserveAspectRatio="none"><path d="${d}" fill="${fill}"/></svg>`;
      return `<div class="capa-w w${i}" style="z-index:${3 + i * 2}">${svg('r', o.rojo)}${svg('a', o.azul)}</div>`;
    };
    const que = queHace(c);
    const como = comoHandyx(c);
    const bote = (i: number) => {
      const f = FILAS[i];
      if (!f) return '';
      const pila = MONEDAS.filter((m) => m.r === i).map((m) => `<i class="pm" style="left:${-64 + m.j * 3}px;top:${-40 - m.j * 8}px"></i>`).join('');
      return `<div class="bote" style="left:${BOTE_X}px;top:${filaY(i) + 50}px;z-index:${4 + i * 2}"><div class="flota">
        <i class="b-mastil"></i><div class="b-vela"><b class="t">${f.letra}</b></div><i class="b-ban ondea"></i><div class="b-casco"></div>${pila}</div></div>`;
    };
    const puntos = Array.from({ length: PUNTOS }, (_, i) => {
      const p = CAMINO(0.08 + (0.86 * i) / (PUNTOS - 1));
      return `<i class="punto" style="left:${p.x.toFixed(1)}px;top:${p.y.toFixed(1)}px"></i>`;
    }).join('');
    const vela = `<svg viewBox="0 0 340 366" width="340" height="366"><path d="M12 0 L328 0 Q 356 183 328 366 L 12 366 Q 36 183 12 0 Z" fill="#fff" stroke="#D3DCEA" stroke-width="4"/>
      <path d="M22 122 Q 46 122 330 122 M22 244 Q 46 244 330 244" stroke="#E6ECF5" stroke-width="3" fill="none"/></svg>`;
    const casco = `<svg class="casco-h" viewBox="0 0 650 132"><path d="M0 24 L650 0 C 622 62 596 108 548 122 L 84 126 C 40 122 12 84 0 24 Z" fill="#fff"/>
      <path d="M10 82 L626 60 C 606 94 584 116 548 122 L 84 126 C 48 123 24 106 10 82 Z" fill="${COLOR.azul}"/>
      <path d="M6 64 L634 42" stroke="${COLOR.amarillo}" stroke-width="7"/><path d="M0 24 L650 0" stroke="${COLOR.azulOscuro}" stroke-width="9" stroke-linecap="round"/></svg>`;
    return `
    <div class="cielo r"></div><div class="cielo a"></div>
    <div class="nube" style="left:1390px;top:120px"></div><div class="nube" style="left:1640px;top:220px;transform:scale(.8)"></div><div class="nube" style="left:1720px;top:80px;transform:scale(.6)"></div>
    ${OLAS.map((_, i) => capas(i)).join('')}
    ${FILAS.map((_, i) => bote(i)).join('')}
    <div class="espuma"></div>
    <div class="costa"><svg viewBox="0 0 1920 1080" width="1920" height="1080">
      <path d="M1470 1080 C1490 980 1530 890 1600 840 C1660 800 1760 792 1920 788 L1920 1080 Z" fill="#62B46E"/>
      <path d="M1470 1080 C1482 1010 1500 950 1528 900 C1600 892 1700 900 1780 930 L1780 1080 Z" fill="#EBD39C"/></svg>
      <div class="casa"><div class="chimenea"></div><div class="techo2"></div>
        <div class="pared2"><div class="ven v1"><i class="luz"></i></div><div class="ven v2"><i class="luz"></i></div><div class="puerta"></div></div></div>
    </div>
    <div class="nave"><div class="flota-n">
      <div class="balsa"><i></i><i></i></div>
      <div class="mastil-h"></div><i class="ban-h ondea"></i>
      <div class="vela-h">${vela}${c.logo('logo-vela')}</div><i class="verga v1"></i><i class="verga v2"></i>
      ${TRIPULACION.map((h, i) => `<div class="trip h${i}" style="left:${h.x - h.alto / 2}px;top:${h.pie - h.alto}px;width:${h.alto}px;height:${h.alto}px">${c.pj(h.pj, '', h.alto)}</div>`).join('')}
      <div class="mov-llave">${c.pj('llave', '', 140)}</div>
      ${casco}
    </div></div>
    <div class="brillo b0" style="left:300px;top:330px">${c.icono('sparkles', 'oro')}</div>
    <div class="brillo b1" style="left:800px;top:400px">${c.icono('sparkles', 'oro')}</div>
    <div class="brillo b2" style="left:175px;top:560px">${c.icono('sparkles', 'oro')}</div>
    ${FILAS.map((f, i) => `<div class="etq" style="top:${filaY(i) - 41}px"><span class="ic"><i style="--u:url('${c.url(`iconos/${f.ic}.svg`)}')"></i></span><div><b>Plataforma ${f.letra}</b><span>${que[i] ?? ''}</span></div></div>
      <svg class="flecha" style="top:${filaY(i) - 18}px" viewBox="0 0 52 36"><path d="M4 18 H42 M28 5 L45 18 L28 31" fill="none" stroke="${COLOR.amarillo}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <div class="resp" style="top:${filaY(i) - 41}px">${c.icono('tilde-circulo', 'blanco')}<div><b>Handyx:</b> ${como[i] ?? ''}</div></div>`).join('')}
    ${MONEDAS.map(() => '<i class="moneda">$</i>').join('')}
    <div class="rastro">${puntos}</div><div class="anillo"></div>
    <div class="billete"><div class="cuerpo"><span class="medalla">${c.icono('billete', 'blanco')}</span><div><b class="t">${c.cifra('EJ-P')}</b><span>presupuesto del profesional</span></div></div></div>
    <div class="llega sello"><span class="monto">${c.cifra('EJ-P')}</span>Llega completo a su casa</div>
    <div class="mov-foco">${c.pj('bombilla', '', 118)}</div>
    <div class="recibo tarjeta">
      <div class="rc-cab">${c.icono('recibo')}Ejemplo ilustrativo</div>
      <div class="rc-l l1"><span><i class="op">${c.icono('llave-inglesa')}</i>Presupuesto del profesional</span><b class="t">${c.cifra('EJ-P')}</b></div>
      <div class="rc-l l2"><span><i class="op t">+</i>Tarifa Handyx (${c.cifra('TARIFA-USUARIO')})</span><b class="t">${c.cifra('EJ-F')}</b></div>
      <div class="rc-div"></div>
      <div class="rc-l total"><span><i class="op t">=</i>Total que paga el usuario</span><b class="t num-total"></b></div>
    </div>
    <div class="rc-sellos"><span class="chip azul s1">${c.icono('tilde-circulo', 'blanco')}Visible antes de contratar</span><span class="chip verde s2">${c.icono('llave-inglesa', 'blanco')}${c.cifra('FEE-ESPECIALISTA')} al profesional</span></div>
    <div class="errc-k kicker">${c.icono('sparkles')}Nuestro océano azul</div>
    ${ACCIONES.map((a, i) => `<div class="accion a${i}" style="top:${330 + i * 106}px"><span class="verbo t ${a.clase}">${a.verbo}</span>${i === 3 ? `<div class="txt"><p>${a.txt}</p><small>Plan propuesto · a validar</small></div><div class="cuenta"><b class="t num-plan"></b><span>desarrollos en el plan</span></div>` : `<p>${a.txt}</p>`}</div>`).join('')}
    <div class="fuente">Modelos de cobro según fuentes públicas consultadas el 04/11/2026</div>
    <div class="encabezado"><div class="kicker">Competencia y modelo</div><div class="titulo t"><span class="l"><span>Conocemos la competencia.</span></span><span class="l"><span><mark>Elegimos otro camino.</mark></span></span></div></div>
  `;
  },
  armar(tl, $, c) {
    const nave = $('.nave');
    const etqs = $.all('.etq');
    const flechas = $.all('.flecha');
    const resps = $.all('.resp');
    const botes = $.all('.bote');
    // ── 0 · océano rojo: un bote por plataforma; las monedas de Llave se van a las que le cobran
    tl.fromTo($.all('.capa-w'), { y: 260 }, { y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.05 }, 0);
    tl.fromTo($('.encabezado .kicker'), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.1);
    entraTitulo(tl, $.all('.encabezado .l > span'), 0.22);
    botes.forEach((b, i) => tl.fromTo(b, { autoAlpha: 0, x: DX, y: 70 }, { autoAlpha: 1, x: DX, y: 0, duration: 0.55, ease: 'back.out(1.8)' }, 0.55 + i * 0.14));
    etqs.forEach((e, i) => tl.fromTo(e, { autoAlpha: 0, x: DX - 40 }, { autoAlpha: 1, x: DX, duration: 0.45, ease: 'power3.out' }, 0.7 + i * 0.14));
    tl.fromTo(nave, { x: -380 }, { x: 0, duration: 0.8, ease: 'power3.out' }, 1.0);
    tl.fromTo($('.fuente'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 1.6);
    tl.set([...flechas, ...resps, $('.billete .cuerpo'), $('.llega'), $('.costa'), $('.recibo'), $('.rc-sellos'), $('.mov-foco'), $('.errc-k')], { autoAlpha: 0 }, 0);
    tl.set([...$.all('.accion'), ...$.all('.trip'), ...$.all('.brillo'), $('.mastil-h'), $('.vela-h'), $('.ban-h'), ...$.all('.verga'), $('.casco-h')], { autoAlpha: 0 }, 0);
    // ── 1 · al lado de cada plataforma, cómo lo resuelve Handyx
    tl.to([...botes, ...etqs], { x: 0, duration: 0.55, ease: 'power3.inOut', stagger: 0.02 }, T1 + 0.05);
    flechas.forEach((f, i) => tl.fromTo(f, { autoAlpha: 0, x: -18 }, { autoAlpha: 1, x: 0, duration: 0.3, ease: 'power2.out' }, T1 + 0.45 + i * 0.32));
    resps.forEach((r, i) => tl.fromTo(r, { autoAlpha: 0, x: 60, scale: 0.92 }, { autoAlpha: 1, x: 0, scale: 1, duration: 0.45, ease: 'back.out(1.6)', immediateRender: false }, T1 + 0.5 + i * 0.32));
    // ── 2 · el presupuesto llega completo a su casa
    tl.to([...etqs, ...flechas, ...resps], { autoAlpha: 0, y: -24, duration: 0.35, ease: 'power2.in', stagger: 0.015 }, T2);
    botes.forEach((b, i) => tl.to(b, { autoAlpha: 0, x: 180, y: -30, scale: 0.8, duration: 0.55, ease: 'power2.in' }, T2 + i * 0.05));
    tl.to($('.fuente'), { autoAlpha: 0, duration: 0.3 }, T2);
    tl.fromTo($('.costa'), { autoAlpha: 1, y: 380 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out', immediateRender: false }, T2 + 0.2);
    tl.fromTo($('.techo2'), { autoAlpha: 0, y: -70 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'back.out(1.6)' }, T2 + 0.6);
    tl.fromTo($('.pared2'), { scaleY: 0.2 }, { scaleY: 1, duration: 0.45, ease: 'back.out(1.5)' }, T2 + 0.55);
    tl.fromTo($('.chimenea'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, T2 + 0.8);
    tl.fromTo($('.billete .cuerpo'), { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2.2)', immediateRender: false }, T2 + 0.5);
    tl.to($.all('.luz'), { opacity: 1, duration: 0.3 }, T2 + 2.1);
    tl.fromTo($('.anillo'), { autoAlpha: 1, scale: 0.3 }, { autoAlpha: 0, scale: 2.6, duration: 0.7, ease: 'power2.out', immediateRender: false }, T2 + 2.1);
    tl.fromTo($('.llega'), { autoAlpha: 0, y: 30, scale: 0.6 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(2)', immediateRender: false }, T2 + 2.25);
    // ── 3 · el recibo del ejemplo, línea por línea
    tl.to([$('.llega'), $('.rastro')], { autoAlpha: 0, duration: 0.3 }, T3);
    tl.fromTo($('.recibo'), { autoAlpha: 0, y: 50, scale: 0.95 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.5)', immediateRender: false }, T3 + 0.05);
    tl.fromTo($.all('.rc-cab, .rc-l'), { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: 'power3.out', stagger: 0.42 }, T3 + 0.3);
    tl.fromTo($('.rc-div'), { scaleX: 0 }, { scaleX: 1, duration: 0.35, ease: 'power2.out' }, T3 + 1.45);
    tl.fromTo($('.mov-foco'), { autoAlpha: 0, y: 70 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'back.out(2)', immediateRender: false }, T3 + 0.7);
    tl.fromTo($('.rc-sellos'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01, immediateRender: false }, T3 + 2.2);
    tl.fromTo($('.rc-sellos .s1'), { autoAlpha: 0, scale: 0.4, rotation: -6 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.4, ease: 'back.out(2.4)' }, T3 + 2.2);
    tl.fromTo($('.rc-sellos .s2'), { autoAlpha: 0, scale: 0.4, rotation: 6 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.4, ease: 'back.out(2.4)' }, T3 + 2.65);
    c.contador($('.num-total'), { t0: T3 + 1.6, dur: 0.8, desde: c.valor('EJ-P') ?? 0, hasta: c.valor('EJ-T') ?? 0, antes: '$ ' });
    // ── 4 · océano azul: la balsa se vuelve el barco de Handyx, las cuatro acciones y los Handys que se suben
    tl.to([$('.recibo'), $('.rc-sellos'), $('.mov-foco')], { autoAlpha: 0, y: -40, duration: 0.4, ease: 'power2.in' }, T4);
    tl.to($('.costa'), { autoAlpha: 0, y: 160, duration: 0.6, ease: 'power2.in' }, T4 + 0.1);
    tl.to($('.balsa'), { autoAlpha: 0, y: 30, duration: 0.3, ease: 'power2.in' }, T4 + 0.05);
    tl.fromTo($('.casco-h'), { autoAlpha: 1, y: 120 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out', immediateRender: false }, T4 + 0.1);
    tl.to(nave, { y: -56, duration: 0.5, ease: 'power3.out' }, T4 + 0.1);
    tl.fromTo($('.mastil-h'), { autoAlpha: 1, scaleY: 0 }, { autoAlpha: 1, scaleY: 1, duration: 0.4, ease: 'power2.out', immediateRender: false }, T4 + 0.35);
    tl.fromTo($.all('.verga'), { autoAlpha: 0, scaleX: 0.2 }, { autoAlpha: 1, scaleX: 1, duration: 0.3, ease: 'back.out(2)', immediateRender: false }, T4 + 0.6);
    tl.fromTo($('.vela-h'), { autoAlpha: 1, scaleY: 0 }, { autoAlpha: 1, scaleY: 1, duration: 0.45, ease: 'back.out(1.4)', immediateRender: false }, T4 + 0.65);
    tl.fromTo($('.verga.v2'), { y: -366 }, { y: 0, duration: 0.45, ease: 'back.out(1.4)', immediateRender: false }, T4 + 0.65);
    tl.fromTo($('.ban-h'), { autoAlpha: 0, scaleX: 0 }, { autoAlpha: 1, scaleX: 1, duration: 0.35, ease: 'back.out(2)', immediateRender: false }, T4 + 0.95);
    tl.to(nave, { x: 180, duration: 1.2, ease: 'power2.inOut' }, T4 + 0.4);
    tl.fromTo($('.errc-k'), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.4, immediateRender: false }, T4 + 0.9);
    $.all('.accion').forEach((a, i) =>
      tl.fromTo(a, { autoAlpha: 0, scale: 1.4, rotation: i % 2 ? 4 : -4 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.38, ease: 'back.out(2.2)', immediateRender: false }, T4 + 1.1 + i * 0.45),
    );
    c.contador($('.num-plan'), { t0: T4 + 2.6, dur: 1.5, hasta: c.valor('DESARROLLOS-PLAN') ?? 0 });
    $.all('.trip').forEach((h, i) => {
      tl.fromTo(h, { autoAlpha: 1, y: 120 }, { autoAlpha: 1, y: -70, duration: 0.3, ease: 'power2.out', immediateRender: false }, SUBE(i));
      tl.to(h, { y: 0, duration: 0.25, ease: 'power2.in' }, SUBE(i) + 0.3);
    });
    $.all('.brillo').forEach((b, i) => tl.fromTo(b, { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(3)', immediateRender: false }, T4 + 4.1 + i * 0.12));
    // Pintores: monedas, presupuesto, camino, barrido azul y poses (valen también en los saltos)
    const monedas = $.all('.moneda');
    const pilas = $.all('.pm');
    c.pintor((t) => {
      MONEDAS.forEach((m, i) => {
        const el = monedas[i];
        const pila = pilas[i];
        if (!el || !pila) return;
        const k = tramo(t, m.t0, m.t0 + VUELO);
        pila.style.opacity = t >= m.t0 + VUELO ? '1' : '0';
        if (k <= 0 || k >= 1) {
          el.style.opacity = '0';
          return;
        }
        const x = MANO.x + (m.x1 - MANO.x) * k;
        const y = MANO.y + (m.y1 - MANO.y) * k - 150 * 4 * k * (1 - k);
        el.style.opacity = '1';
        el.style.transform = `translate(${x}px, ${y}px) rotate(${k * 540}deg) scale(${1 - 0.3 * k})`;
      });
    });
    const billete = $('.billete');
    const puntos = $.all('.punto');
    c.pintor((t) => {
      const k = tramo(t, T2 + 0.95, T2 + 2.1);
      const p = CAMINO(vaiven(k));
      const s = 1 - 0.8 * tramo(k, 0.82, 1);
      billete.style.opacity = t >= T2 + 0.5 && k < 1 ? '1' : '0';
      billete.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) rotate(${Math.max(-12, Math.min(12, p.ang * 0.25))}deg) scale(${s})`;
      puntos.forEach((d, i) => (d.style.opacity = t >= T2 + 0.75 + (0.5 * i) / PUNTOS ? '1' : '0'));
    });
    const azules = $.all('.capa.a, .cielo.a');
    const espuma = $('.espuma');
    c.pintor((t) => {
      const k = tramo(t, T4 + 0.1, T4 + 1.5);
      const fx = -160 + vaiven(k) * 2260;
      const borde: string[] = [];
      for (let y = 0; y <= 1080; y += 60) borde.push(`${(fx + Math.sin(y / 80 + k * 5) * 30).toFixed(1)}px ${y}px`);
      const poly = k <= 0 ? 'inset(0 100% 0 0)' : k >= 1 ? 'none' : `polygon(0px 0px, ${borde.join(', ')}, 0px 1080px)`;
      for (const el of azules) el.style.clipPath = poly;
      espuma.style.opacity = k > 0 && k < 1 ? '1' : '0';
      espuma.style.transform = `translateX(${fx - 70}px)`;
    });
    const llave = $('.mov-llave .pj');
    const foco = $('.mov-foco .pj');
    const trip = $.all('.trip .pj');
    c.pintor((t) => {
      pose(
        llave,
        t >= T4 + 4.0 ? 'c' : t >= T4 + 0.15 ? 'b' : t >= T3 + 2.65 ? 'c' : t >= T3 + 0.15 ? 'a' : t >= T2 + 2.1 ? 'c' : t >= T2 + 0.15 ? 'a' : t >= T1 + 0.3 ? 'b' : t >= 1.85 ? 'd' : 'a',
      );
      pose(foco, t >= T3 + 2.2 ? 'c' : 'b');
      trip.forEach((h, i) => {
        const s = SUBE(i);
        const fin = TRIPULACION[i]?.fin ?? 'c';
        pose(h, t < s + 0.55 ? 'd' : t < s + 1.1 ? 'c' : fin);
      });
    });
  },
  ambiente(t, $) {
    OLAS.forEach((o, i) => {
      const dx = -((t * o.v) % o.largo);
      const dy = Math.sin(t * 0.8 + i * 1.7) * 2.5;
      for (const p of $.all(`.w${i} path`)) p.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    $.all('.bote .flota').forEach((f, i) => (f.style.transform = `translateY(${Math.sin(t * 1.6 + i * 1.4) * 4}px) rotate(${Math.sin(t * 1.2 + i * 2) * 3}deg)`));
    $('.flota-n').style.transform = `translateY(${Math.sin(t * 1.3) * 3.5}px) rotate(${Math.sin(t * 1.0 + 0.6) * 1.3}deg)`;
    $.all('.mov-llave .pj, .trip .pj, .mov-foco .pj').forEach((p, i) => (p.style.transform = `scaleY(${1 + Math.sin(t * 2.4 + i) * 0.02})`));
    $.all('.ondea').forEach((b, i) => (b.style.transform = `scaleX(${0.86 + Math.sin(t * 6 + i) * 0.14}) skewY(${Math.sin(t * 5 + i) * 6}deg)`));
    $.all('.nube').forEach((n, i) => (n.style.translate = `${Math.sin(t * 0.12 + i * 2) * 26}px 0`));
    $.all('.brillo .icono').forEach((b, i) => (b.style.transform = `scale(${0.8 + Math.sin(t * 3 + i * 2) * 0.2}) rotate(${Math.sin(t + i) * 12}deg)`));
  },
});
