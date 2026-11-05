// Anexo de respaldo · Tracción en los dos lados (marketing, plan propuesto). Un golpe por clic:
// 0 Digital: publicidades hechas con IA (Seedance 2.5) en todas las redes → un celular con un anuncio de ejemplo hecho con
//   los Handys y reacciones genéricas (sin logos de redes ni de terceros) ·
// 1 En la calle → un cartel pegado en un poste, un volante en la vidriera de un local y la remera con el Handy de cada oficio ·
// 2 En los edificios → porteros y administradores (el canal que ya probamos: de ahí salieron los primeros trabajos) ·
// 3 El boca a boca → los Handys pasan de casa en casa; entre profesionales, referidos de un oficio a otro.
// Columnas fijas: Vecinos (Foco) a la izquierda y Profesionales (Llave) a la derecha, con el texto de cada paso; en el centro,
// el canal. Abajo, los dos lados fluyen hacia Handyx. La franja y 880–950 queda libre para la leyenda del kit.
import { COLOR, entraTitulo, escena, pose, tramo, type Kit, type Personaje, type Pose } from './comun/kit.ts';

const M = [0, 3.4, 6.8, 10.2, 13.6];
const SUELO = 752; // base de las ilustraciones del centro
const EJE = 812; // eje de los flujos y de la pastilla de Handyx
const COL = { izq: 96, der: 1384, w: 440, top: 252 };
const FLUJOS = [
  { de: 412, a: 846 }, // vecinos → Handyx
  { de: 1482, a: 1074 }, // profesionales → Handyx
];
const T_FLUJO = 1.0; // los flujos se dibujan y empiezan a correr

// Textos de cada paso (los dos lados). Sin cifras escritas a mano: la comisión sale de la afirmación.
const VECINOS = [
  'Anuncios <b>por barrio y por urgencia</b>',
  '<b>Carteles</b> en postes y <b>volantes</b> en locales',
  '<b>Porteros y administradores:</b> el canal que ya probamos',
  'Los Handys, pensados para que <b>los chicos los cuenten en casa</b>',
];
const PROFESIONALES = (c: Kit) => [
  `<b>${c.cifra('FEE-ESPECIALISTA')} de comisión:</b> el mensaje que los trae`,
  '<b>Remeras</b> con el Handy de su oficio',
  'De ahí salieron los <b>primeros trabajos</b>',
  '<b>Referidos:</b> un oficio trae a otro',
];

// Remera: el Handy estampado cambia de oficio y termina en Plomería
const REMERAS: Array<{ pj: Personaje; txt: string; ic: string; alto: number }> = [
  { pj: 'brocha', txt: 'Albañilería', ic: 'albanileria', alto: 92 },
  { pj: 'medidor_gas', txt: 'Gas', ic: 'gas', alto: 88 },
  { pj: 'aire', txt: 'Aire acond.', ic: 'aire', alto: 44 },
  { pj: 'gota', txt: 'Plomería', ic: 'plomeria', alto: 92 },
];
const T_REM = 4.8; // entra la remera
const remeraEn = (t: number) => Math.min(REMERAS.length - 1, Math.max(0, Math.floor((t - (T_REM + 0.5)) / 0.42)));

// Edificios del paso 2 (apoyados en el suelo del escenario)
const EDIF = [
  { x: 640, w: 170, h: 290, cols: 3, filas: 3 },
  { x: 838, w: 228, h: 420, cols: 4, filas: 5 },
  { x: 1094, w: 190, h: 330, cols: 3, filas: 4 },
];
// Casas del paso 3 y las burbujas del boca a boca (una por casa, con un Handy adentro)
const CASAS = [
  { x: 626, w: 178, h: 166 },
  { x: 868, w: 204, h: 196 },
  { x: 1138, w: 178, h: 166 },
];
const BURBUJAS: Array<{ pj: Personaje; t: number }> = [
  { pj: 'gota', t: 10.95 },
  { pj: 'medidor_gas', t: 11.55 },
  { pj: 'brocha', t: 12.15 },
];
const centroCasa = (i: number) => (CASAS[i]?.x ?? 0) + (CASAS[i]?.w ?? 0) / 2;
const altoCasa = (i: number) => SUELO - (CASAS[i]?.h ?? 0);
const BUR = { w: 150, h: 128, sobre: 64 }; // la burbuja flota 64 px sobre el techo
const burY = (i: number) => altoCasa(i) - BUR.sobre - BUR.h;

// Glifos genéricos (trazo propio, sin logos de redes)
const GL = {
  corazon: 'M12 20s-7.2-4.4-7.2-9.7A4.1 4.1 0 0 1 12 8.1a4.1 4.1 0 0 1 7.2 2.2C19.2 15.6 12 20 12 20z',
  chat: 'M4.5 6.6A2.6 2.6 0 0 1 7.1 4h9.8a2.6 2.6 0 0 1 2.6 2.6v6.6a2.6 2.6 0 0 1-2.6 2.6H11l-4.4 3.7v-3.7A2.6 2.6 0 0 1 4.5 13.2z',
  enviar: 'M20.5 3.5 3.5 10.6l6.8 2.6 2.6 6.8zM10.3 13.2l4.6-4.6',
  play: 'M8.5 5.6v12.8l10-6.4z',
};
const glifo = (d: string, cls = '') => `<svg class="gl ${cls}" viewBox="0 0 24 24"><path d="${d}"/></svg>`;
const REACCIONES = ['corazon', 'chat', 'enviar', 'corazon', 'play', 'corazon'] as const;

// Remera: silueta propia (viewBox 220 × 210)
const REMERA = 'M80 12 L40 24 L6 62 L32 94 L56 80 L56 196 Q56 204 64 204 L156 204 Q164 204 164 196 L164 80 L188 94 L214 62 L180 24 L140 12 Q110 42 80 12 Z';

export default escena({
  marcas: M,
  leyendas: [
    'Digital: **publicidades con IA** en todas las redes',
    'En la calle: **postes, volantes y remeras**',
    'En los edificios: **porteros y administradores**',
    'Y el **boca a boca**, en los dos lados',
  ],
  css: `
    .fondo { position: absolute; inset: 0; background: #EEF0F6; }
    .halo { position: absolute; left: 960px; top: 520px; width: 1400px; height: 1000px; margin: -500px 0 0 -700px; border-radius: 50%; background: radial-gradient(closest-side, rgba(255,255,255,.95), rgba(255,255,255,0)); }
    .encabezado { position: absolute; left: 96px; top: 52px; }
    .krow { display: flex; align-items: center; gap: 16px; }
    .rot { padding: 4px 14px; border-radius: 999px; border: 3px solid ${COLOR.azulOscuro}; color: ${COLOR.azulOscuro}; font-weight: 800; font-size: 20px; letter-spacing: .06em; text-transform: uppercase; white-space: nowrap; }
    .encabezado .titulo { margin-top: 10px; font-size: 64px; color: ${COLOR.azulOscuro}; }

    /* Columnas de los dos lados */
    .col { position: absolute; top: ${COL.top}px; width: ${COL.w}px; }
    .col.izq { left: ${COL.izq}px; } .col.der { left: ${COL.der}px; }
    .lado { display: flex; align-items: center; gap: 12px; font-weight: 800; font-size: 24px; letter-spacing: .08em; text-transform: uppercase; color: ${COLOR.azulOscuro}; }
    .lado i { width: 14px; height: 14px; border-radius: 50%; background: ${COLOR.amarillo}; box-shadow: 0 0 0 5px rgba(255,201,60,.28); }
    .cap { position: relative; margin-top: 18px; height: 176px; border-radius: 26px; background: #fff; box-shadow: 0 16px 34px rgba(14,29,54,.10), 0 4px 0 #DCE2EC; overflow: hidden; }
    .cap .txt { position: absolute; inset: 0; display: flex; align-items: center; padding: 0 30px; font-size: 30px; line-height: 1.24; font-weight: 600; color: ${COLOR.noche}; }
    .cap .txt span { text-wrap: balance; }
    .cap .txt b { color: ${COLOR.azul}; font-weight: 800; }

    /* Handys: el contenedor .mov lo mueve la línea de tiempo; el .pj de adentro respira (ambiente) */
    .mov { position: absolute; transform-origin: 50% 100%; }
    .pj { transform-origin: 50% 100%; }
    .foco { left: 198px; top: 600px; width: 236px; height: 236px; }
    .llave { left: 1501px; top: 630px; width: 206px; height: 206px; }

    /* Flujos hacia Handyx */
    .flujos { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; overflow: visible; }
    .via { fill: none; stroke: #C3CEE1; stroke-width: 4; stroke-linecap: round; stroke-dasharray: 1000 1000; stroke-dashoffset: 1000; }
    .gotas circle { fill: ${COLOR.azul}; opacity: 0; }
    .hub { position: absolute; left: 960px; top: ${EJE}px; width: 0; height: 0; }
    .hub .in { position: absolute; left: -106px; top: -32px; width: 212px; height: 64px; border-radius: 999px; background: #fff; display: grid; place-items: center; box-shadow: 0 12px 26px rgba(14,29,54,.14), 0 4px 0 #DCE2EC; }
    .hub .in img { height: 30px; display: block; }
    .hub .onda { position: absolute; left: -106px; top: -32px; width: 212px; height: 64px; border-radius: 999px; border: 4px solid ${COLOR.amarillo}; opacity: 0; }
    .esc { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
    .suelo { position: absolute; left: 604px; top: ${SUELO}px; width: 712px; height: 10px; border-radius: 5px; background: #D9DFEA; }

    /* 0 · digital */
    .tel { width: 230px; height: 490px; border-radius: 40px; padding: 10px; box-shadow: 0 30px 60px rgba(14,29,54,.24), 0 0 0 2px rgba(255,255,255,.06); }
    .tel .pantalla { border-radius: 31px; background: #fff; }
    .tel .isla { width: 74px; height: 22px; margin-left: -37px; top: 9px; }
    .telD { left: 845px; top: 262px; width: 230px; height: 490px; }
    .feed { position: absolute; left: 0; top: 40px; width: 210px; }
    .post-cab { display: flex; align-items: center; gap: 8px; padding: 6px 10px; }
    .avatar { position: relative; flex: none; width: 38px; height: 38px; border-radius: 50%; background: ${COLOR.celeste}; overflow: hidden; }
    .avatar .pj { left: 3px; top: 3px; }
    .post-cab b { display: block; font-size: 20px; line-height: 1.05; font-weight: 800; color: ${COLOR.noche}; }
    .post-cab span { display: block; font-size: 20px; line-height: 1.05; font-weight: 600; color: ${COLOR.suave}; }
    .media { position: relative; width: 210px; height: 158px; overflow: hidden; }
    .media.a { background: ${COLOR.azul}; }
    .media.b { background: ${COLOR.amarillo}; }
    .media .sol { position: absolute; right: -30px; top: -30px; width: 120px; height: 120px; border-radius: 50%; background: rgba(255,255,255,.14); }
    .media .marco { position: absolute; left: 18px; top: 40px; width: 66px; height: 66px; border-radius: 18px; background: #fff; display: grid; place-items: center; box-shadow: 0 8px 16px rgba(14,29,54,.25); }
    .media .marco .icono { width: 36px; height: 36px; }
    .media .pj { left: 86px; top: 26px; }
    .acciones { display: flex; gap: 14px; padding: 8px 12px 4px; }
    .gl { width: 28px; height: 28px; display: block; fill: none; stroke: ${COLOR.noche}; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .acciones .gl.lleno { fill: ${COLOR.azul}; stroke: ${COLOR.azul}; }
    .esq { height: 12px; border-radius: 6px; background: #E6EAF1; margin: 8px 12px 0; }
    .esq.corta { width: 110px; }
    .ia { position: absolute; left: 562px; top: 392px; width: 262px; padding: 22px 24px 20px; }
    .ia .fila { display: flex; flex-direction: column; align-items: flex-start; gap: 14px; }
    .ia .ic { flex: none; width: 56px; height: 56px; border-radius: 16px; background: ${COLOR.amarillo}; display: grid; place-items: center; box-shadow: 0 4px 0 #C9971E; }
    .ia .ic .icono { width: 32px; height: 32px; }
    .ia b { display: block; font-size: 27px; line-height: 1.15; font-weight: 800; color: ${COLOR.noche}; white-space: nowrap; }
    .ia span { display: block; margin-top: 2px; font-size: 24px; line-height: 1.2; font-weight: 700; color: ${COLOR.azul}; white-space: nowrap; }
    .ia em { display: block; margin-top: 14px; padding-top: 12px; border-top: 2px solid ${COLOR.borde}; font-style: normal; font-size: 20px; font-weight: 600; color: ${COLOR.suave}; white-space: nowrap; }
    .reac { position: absolute; left: 0; top: 0; width: 52px; height: 52px; margin: -26px 0 0 -26px; border-radius: 50%; background: #fff; display: grid; place-items: center; box-shadow: 0 8px 18px rgba(14,29,54,.16); opacity: 0; }
    .reac .gl { width: 28px; height: 28px; stroke: ${COLOR.azul}; }
    .reac .gl.lleno { fill: ${COLOR.azul}; }

    /* 1 · la calle */
    .poste { position: absolute; left: 650px; top: 290px; width: 20px; height: ${SUELO - 290}px; border-radius: 10px 10px 0 0; background: #8E9AB0; }
    .poste::before { content: ''; position: absolute; left: -8px; top: 0; width: 36px; height: 14px; border-radius: 7px; background: #7A879F; }
    .cartel { position: absolute; left: 574px; top: 344px; width: 172px; height: 230px; padding: 16px 14px; border-radius: 14px; background: #fff; box-shadow: 0 14px 28px rgba(14,29,54,.18), 0 3px 0 #DCE2EC; display: flex; flex-direction: column; align-items: center; justify-content: space-between; transform-origin: 50% 10%; }
    .cartel img.logo { height: 22px; display: block; }
    .cartel .fig { position: relative; width: 112px; height: 112px; border-radius: 22px; background: ${COLOR.celeste}; }
    .cartel .fig .pj { left: 8px; top: 6px; }
    .cartel .qr { width: 38px; height: 38px; }
    .cinta { position: absolute; top: -10px; width: 56px; height: 20px; border-radius: 4px; background: rgba(255,201,60,.9); }
    .cinta.i { left: -14px; transform: rotate(-24deg); } .cinta.d { right: -14px; transform: rotate(24deg); }
    .local { position: absolute; left: 790px; top: ${SUELO - 284}px; width: 252px; height: 284px; transform-origin: 50% 100%; }
    .local .cartelL { position: absolute; left: 16px; right: 16px; top: 0; height: 46px; border-radius: 12px; background: ${COLOR.azulOscuro}; display: grid; place-items: center; }
    .local .cartelL .icono { width: 30px; height: 30px; }
    .local .toldo { position: absolute; left: -8px; right: -8px; top: 52px; height: 30px; border-radius: 8px 8px 2px 2px; background: repeating-linear-gradient(90deg, ${COLOR.amarillo} 0 28px, #fff 28px 56px); box-shadow: 0 4px 10px rgba(14,29,54,.12); }
    .local .frente { position: absolute; left: 6px; right: 6px; top: 82px; bottom: 0; background: #fff; box-shadow: inset 0 0 0 3px #E1E6EF; }
    .local .vidriera { position: absolute; left: 22px; top: 106px; width: 124px; height: 110px; border-radius: 8px; background: ${COLOR.celeste}; box-shadow: inset 0 0 0 5px #fff, 0 0 0 2px #D6DCE6; overflow: hidden; }
    .local .puerta { position: absolute; right: 22px; bottom: 0; width: 60px; height: 132px; border-radius: 10px 10px 0 0; background: ${COLOR.azul}; }
    .local .puerta::after { content: ''; position: absolute; left: 10px; top: 54px; width: 8px; height: 8px; border-radius: 50%; background: ${COLOR.amarillo}; }
    .volante { position: absolute; left: 30px; top: 14px; width: 64px; height: 84px; border-radius: 6px; background: #fff; box-shadow: 0 6px 12px rgba(14,29,54,.2); display: flex; flex-direction: column; align-items: center; padding-top: 6px; transform-origin: 50% 0; }
    .volante img.logo { width: 50px; display: block; }
    .volante .pj { position: relative; margin-top: 4px; }
    .remera { position: absolute; left: 1090px; top: 392px; width: 220px; height: 210px; }
    .remera .flota { position: absolute; inset: 0; }
    .remera svg { position: absolute; inset: 0; width: 220px; height: 210px; overflow: visible; filter: drop-shadow(0 14px 18px rgba(14,29,54,.16)); }
    .remera .tela { fill: #fff; stroke: #CDD5E2; stroke-width: 3; stroke-linejoin: round; }
    .remera .cuello { fill: none; stroke: ${COLOR.azul}; stroke-width: 9; stroke-linecap: round; }
    .remera .puno { fill: none; stroke: ${COLOR.azul}; stroke-width: 7; stroke-linecap: round; }
    .remera .estampa { position: absolute; left: 64px; top: 58px; width: 92px; height: 92px; }
    .remera .estampa > div { position: absolute; display: none; }
    .remera img.logo { position: absolute; left: 76px; top: 158px; width: 68px; display: block; }
    .oficio { position: absolute; left: 1200px; top: 640px; width: 0; display: flex; justify-content: center; }
    .oficio .chip { font-size: 24px; }
    .oficio .chip .icono { width: 28px; height: 28px; }

    /* 2 · edificios */
    .ed { position: absolute; bottom: ${1080 - SUELO}px; transform-origin: 50% 100%; }
    .ed .cornisa { position: absolute; left: -8px; right: -8px; top: 0; height: 18px; background: ${COLOR.noche}; border-radius: 8px 8px 3px 3px; }
    .ed .frenteE { position: absolute; left: 0; right: 0; top: 18px; bottom: 0; background: ${COLOR.azulOscuro}; }
    .ed .w { position: absolute; width: 28px; height: 34px; border-radius: 6px; background: #284A82; }
    .ed .w.on { background: #FFE9A8; box-shadow: 0 0 16px rgba(255,201,60,.55); }
    .ed .puertaE { position: absolute; left: 50%; bottom: 0; width: 64px; height: 82px; margin-left: -32px; border-radius: 12px 12px 0 0; background: #CFE0FA; border: 6px solid ${COLOR.celeste}; border-bottom: 0; }
    .centrar { position: absolute; width: 0; display: flex; justify-content: center; }
    .rolE { font-size: 22px; padding: 9px 18px 9px 12px; color: ${COLOR.noche}; }
    .rolE .icono { width: 28px; height: 28px; }

    /* 3 · boca a boca */
    .casa { position: absolute; bottom: ${1080 - SUELO}px; transform-origin: 50% 100%; }
    .casa .techo { position: absolute; left: -12px; right: -12px; top: 0; height: 46%; background: ${COLOR.azulOscuro}; clip-path: polygon(50% 0, 100% 100%, 0 100%); }
    .casa .muro { position: absolute; left: 8px; right: 8px; top: 46%; bottom: 0; background: #fff; box-shadow: inset 0 0 0 3px #E1E6EF; }
    .casa .vent { position: absolute; left: 18px; top: 18px; width: 50px; height: 40px; border-radius: 7px; background: #DCE3EE; box-shadow: inset 0 0 0 4px #fff, 0 0 0 2px #D6DCE6; }
    .casa .vent.on { background: #FFE9A8; box-shadow: inset 0 0 0 4px #fff, 0 0 0 2px #E9C766, 0 0 18px rgba(255,201,60,.6); }
    .casa .puertaC { position: absolute; right: 20px; bottom: 0; width: 40px; height: 58px; border-radius: 8px 8px 0 0; background: ${COLOR.azul}; }
    .bur { position: absolute; width: ${BUR.w}px; height: ${BUR.h}px; border-radius: 30px; background: #fff; box-shadow: 0 14px 28px rgba(14,29,54,.14), 0 3px 0 #DCE2EC; transform-origin: 50% 120%; }
    .bur::after { content: ''; position: absolute; left: 50%; bottom: -18px; margin-left: -14px; border: 14px solid transparent; border-top: 20px solid #fff; border-bottom: 0; }
    .bur .pj { left: 25px; top: 14px; }
    .hilos { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; overflow: visible; }
    .hilos circle { fill: ${COLOR.azul}; }
  `,
  html: (c) => {
    const handy = (cls: string, nombre: Personaje, alto: number) => `<div class="mov ${cls}">${c.pj(nombre, '', alto)}<div class="sombra-pj"></div></div>`;
    const vecinos = VECINOS.map((t, i) => `<div class="txt" data-k="${i}"><span>${t}</span></div>`).join('');
    const profesionales = PROFESIONALES(c).map((t, i) => `<div class="txt" data-k="${i}"><span>${t}</span></div>`).join('');
    const ventanas = (e: (typeof EDIF)[number]) => {
      let v = '';
      const gx = (e.w - e.cols * 28) / (e.cols + 1);
      const paso = (e.h - 36 - 120 - 34) / Math.max(1, e.filas - 1);
      for (let r = 0; r < e.filas; r++)
        for (let k = 0; k < e.cols; k++) {
          const on = c.azar() < 0.18 ? '99' : (7.6 + c.azar() * 1.4).toFixed(2);
          v += `<i class="w" style="left:${(gx + k * (28 + gx)).toFixed(1)}px;top:${(36 + 18 + r * paso).toFixed(1)}px" data-t="${on}"></i>`;
        }
      return v;
    };
    // Hilos punteados entre burbujas (curva cuadrática muestreada en puntos que aparecen de a uno)
    const hilos = BURBUJAS.slice(1)
      .map((_, i) => {
        const a = [centroCasa(i) + BUR.w / 2 + 6, burY(i) + 46];
        const b = [centroCasa(i + 1) - BUR.w / 2 - 6, burY(i + 1) + 46];
        const m = [(a[0]! + b[0]!) / 2, Math.min(a[1]!, b[1]!) - 64];
        const pts = Array.from({ length: 7 }, (_, k) => {
          const u = (k + 1) / 8;
          const x = (1 - u) ** 2 * a[0]! + 2 * (1 - u) * u * m[0]! + u * u * b[0]!;
          const y = (1 - u) ** 2 * a[1]! + 2 * (1 - u) * u * m[1]! + u * u * b[1]!;
          return `<circle class="h${i}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.5"/>`;
        });
        return pts.join('');
      })
      .join('');
    return `
    <div class="fondo"></div><div class="halo"></div>

    <svg class="flujos" viewBox="0 0 1920 1080">${FLUJOS.map((f, i) => `<path class="via v${i}" pathLength="1000" d="M${f.de} ${EJE} L${f.a} ${EJE}"/><g class="gotas g${i}">${'<circle r="6"/>'.repeat(6)}</g>`).join('')}</svg>
    <div class="suelo"></div>
    <div class="hub"><i class="onda"></i><div class="in">${c.logo()}</div></div>

    <div class="esc e0">
      <div class="tarjeta ia"><div class="fila"><span class="ic">${c.icono('sparkles')}</span><div><b>Hechas con IA</b><span>Seedance 2.5</span></div></div><em>Ejemplo ilustrativo</em></div>
      <div class="mov telD">${c.celular(`<div class="feed">
        <div class="post-cab"><span class="avatar">${c.pj('bombilla', '', 32)}</span><div><b>Handyx</b><span>Publicidad</span></div></div>
        <div class="media a"><i class="sol"></i><span class="marco">${c.icono('plomeria')}</span>${c.pj('gota', '', 124)}</div>
        <div class="acciones">${glifo(GL.corazon, 'like')}${glifo(GL.chat)}${glifo(GL.enviar)}</div>
        <div class="esq"></div><div class="esq corta"></div>
        <div class="post-cab" style="margin-top:14px"><span class="avatar">${c.pj('bombilla', '', 32)}</span><div><b>Handyx</b><span>Publicidad</span></div></div>
        <div class="media b"><i class="sol"></i><span class="marco">${c.icono('calendario')}</span>${c.pj('llave', '', 118)}</div>
      </div>`, 'tel')}</div>
      ${REACCIONES.map((r) => `<div class="reac">${glifo(GL[r], r === 'corazon' ? 'lleno' : '')}</div>`).join('')}
    </div>

    <div class="esc e1">
      <div class="poste"></div>
      <div class="cartel"><i class="cinta i"></i><i class="cinta d"></i>${c.logo('logo')}<div class="fig">${c.pj('gota', '', 98)}</div>${c.icono('qr', 'qr')}</div>
      <div class="local"><div class="cartelL">${c.icono('tienda', 'oro')}</div><div class="toldo"></div><div class="frente"></div>
        <div class="vidriera"><div class="volante">${c.logo('logo')}${c.pj('bombilla', '', 52)}</div></div><div class="puerta"></div></div>
      <div class="remera"><div class="flota"><svg viewBox="0 0 220 210"><path class="tela" d="${REMERA}"/><path class="cuello" d="M84 14 Q110 40 136 14"/><path class="puno" d="M14 70 L36 92"/><path class="puno" d="M206 70 L184 92"/></svg>
        <div class="estampa">${REMERAS.map((r) => `<div class="r-${r.pj}" style="left:${(92 - r.alto) / 2}px;top:${(92 - r.alto) / 2}px;width:${r.alto}px;height:${r.alto}px">${c.pj(r.pj, '', r.alto)}</div>`).join('')}</div>${c.logo('logo')}</div></div>
      <div class="oficio">${REMERAS.map((r, i) => `<span class="chip of" data-i="${i}">${c.icono(r.ic)}${r.txt}</span>`).join('')}</div>
    </div>

    <div class="esc e2">
      ${EDIF.map((e, i) => `<div class="ed ed${i}" style="left:${e.x}px;width:${e.w}px;height:${e.h}px"><div class="cornisa"></div><div class="frenteE"></div>${ventanas(e)}<div class="puertaE"></div></div>`).join('')}
      <div class="centrar r-portero" style="left:${(EDIF[1]?.x ?? 0) + (EDIF[1]?.w ?? 0) / 2}px;top:${SUELO - 62}px"><span class="chip rolE">${c.icono('cliente-nuevo')}Portero</span></div>
      <div class="centrar r-admin" style="left:${(EDIF[2]?.x ?? 0) + (EDIF[2]?.w ?? 0) / 2}px;top:${SUELO - 62}px"><span class="chip rolE">${c.icono('edificio')}Administrador</span></div>
    </div>

    <div class="esc e3">
      <svg class="hilos" viewBox="0 0 1920 1080">${hilos}</svg>
      ${CASAS.map((h, i) => `<div class="casa c${i}" style="left:${h.x}px;width:${h.w}px;height:${h.h}px"><div class="techo"></div><div class="muro"><i class="vent"></i><i class="puertaC"></i></div></div>`).join('')}
      ${BURBUJAS.map((b, i) => `<div class="bur b${i}" style="left:${centroCasa(i) - BUR.w / 2}px;top:${burY(i)}px">${c.pj(b.pj, '', 100)}</div>`).join('')}
    </div>

    <div class="col izq"><div class="lado"><i></i>Vecinos</div><div class="cap">${vecinos}</div></div>
    <div class="col der"><div class="lado"><i></i>Profesionales</div><div class="cap">${profesionales}</div></div>
    ${handy('foco', 'bombilla', 236)}
    ${handy('llave', 'llave', 206)}

    <div class="encabezado"><div class="krow"><span class="kicker">Respaldo · marketing</span><span class="rot">Plan propuesto · a validar</span></div>
      <div class="titulo t"><span class="l"><span>Tracción en <mark>los dos lados</mark></span></span></div></div>
  `;
  },
  armar(tl, $, c) {
    // Encabezado, columnas, Handys y flujos
    tl.fromTo($('.halo'), { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 1.2, ease: 'power2.out' }, 0);
    tl.fromTo($('.krow'), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0);
    entraTitulo(tl, $.all('.encabezado .l > span'), 0.1);
    tl.fromTo($.all('.lado'), { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: 'power3.out', stagger: 0.1 }, 0.35);
    tl.fromTo($.all('.cap'), { autoAlpha: 0, y: 30, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.6)', stagger: 0.1 }, 0.45);
    tl.fromTo([$('.foco'), $('.llave')], { autoAlpha: 0, y: 80, scale: 0.7 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.8)', stagger: 0.12 }, 0.55);
    tl.fromTo($('.suelo'), { autoAlpha: 0, scaleX: 0.3 }, { autoAlpha: 1, scaleX: 1, duration: 0.5, ease: 'power3.out' }, 0.6);
    tl.fromTo($('.hub .in'), { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(2.2)' }, 1.15);
    FLUJOS.forEach((_, i) => tl.fromTo($(`.v${i}`), { strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.out' }, T_FLUJO));

    // Textos de cada lado: cada uno entra con su paso y sale cuando empieza el siguiente
    for (const lado of ['.izq', '.der']) {
      const txts = $.all(`${lado} .txt`);
      txts.forEach((el, k) => {
        const t0 = (M[k] ?? 0) + (k === 0 ? 1.55 : 0.55) + (lado === '.der' ? 0.2 : 0);
        tl.fromTo(el, { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' }, t0);
        if (k < txts.length - 1) tl.to(el, { autoAlpha: 0, y: -26, duration: 0.3, ease: 'power2.in' }, (M[k + 1] ?? 0) + 0.02);
      });
    }

    // Cada canal sale cuando empieza el paso siguiente (el centro queda libre antes de que entre el otro)
    const sale = (sel: string, k: number) => tl.to($(sel), { autoAlpha: 0, y: 30, duration: 0.35, ease: 'power2.in' }, M[k] ?? 0);

    // 0 · digital: el celular con el anuncio de ejemplo y la tarjeta de IA
    tl.fromTo($('.telD'), { autoAlpha: 0, y: 70, rotation: 5 }, { autoAlpha: 1, y: 0, rotation: 0, duration: 0.6, ease: 'power3.out' }, 0.7);
    tl.fromTo($('.ia'), { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: 'back.out(1.6)' }, 1.35);
    tl.fromTo($('.like'), { scale: 1 }, { scale: 1.35, duration: 0.16, yoyo: true, repeat: 1, ease: 'power2.out', transformOrigin: '50% 50%' }, 2.2);
    sale('.e0', 1);

    // 1 · la calle: poste con cartel, volante en la vidriera y la remera de cada oficio
    tl.fromTo($('.poste'), { autoAlpha: 0, scaleY: 0, transformOrigin: '50% 100%' }, { autoAlpha: 1, scaleY: 1, duration: 0.45, ease: 'power3.out' }, 3.8);
    tl.fromTo($('.cartel'), { autoAlpha: 0, scale: 1.3, rotation: -10 }, { autoAlpha: 1, scale: 1, rotation: -2, duration: 0.42, ease: 'back.out(2)' }, 4.1);
    tl.fromTo($.all('.cinta'), { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1, duration: 0.25, ease: 'back.out(3)', stagger: 0.08 }, 4.4);
    tl.fromTo($('.local'), { autoAlpha: 0, scaleY: 0.2 }, { autoAlpha: 1, scaleY: 1, duration: 0.5, ease: 'back.out(1.6)' }, 3.95);
    tl.fromTo($('.volante'), { autoAlpha: 0, y: -60, rotation: -14 }, { autoAlpha: 1, y: 0, rotation: 3, duration: 0.5, ease: 'back.out(1.8)' }, 4.5);
    tl.fromTo($('.remera'), { autoAlpha: 0, y: -50, rotation: -8, transformOrigin: '50% 0' }, { autoAlpha: 1, y: 0, rotation: 0, duration: 0.6, ease: 'back.out(1.7)' }, T_REM);
    tl.fromTo($('.oficio'), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power3.out' }, T_REM + 0.3);
    sale('.e1', 2);

    // 2 · edificios: se levantan, se encienden las ventanas y aparecen el portero y el administrador
    $.all('.ed').forEach((e, i) => tl.fromTo(e, { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: 'back.out(1.3)' }, 7.2 + i * 0.12));
    tl.fromTo($.all('.rolE'), { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2.4)', stagger: 0.18 }, 7.9);
    sale('.e2', 3);

    // 3 · boca a boca: las casas y las burbujas con los Handys, de casa en casa
    $.all('.casa').forEach((e, i) => tl.fromTo(e, { autoAlpha: 0, scaleY: 0.2 }, { autoAlpha: 1, scaleY: 1, duration: 0.5, ease: 'back.out(1.6)' }, 10.6 + i * 0.1));
    BURBUJAS.forEach((b, i) => {
      tl.fromTo($(`.b${i}`), { autoAlpha: 0, scale: 0.2, y: 30 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.45, ease: 'back.out(2.2)' }, b.t);
      if (i > 0) tl.fromTo($.all(`.hilos .h${i - 1}`), { autoAlpha: 0, scale: 0 }, { autoAlpha: 0.7, scale: 1, transformOrigin: '50% 50%', duration: 0.18, ease: 'back.out(3)', stagger: 0.045 }, b.t - 0.4);
    });

    // Remera: el Handy estampado y el oficio cambian juntos
    const estampas = REMERAS.map((r) => $(`.r-${r.pj}`));
    const chips = $.all('.oficio .of');
    // Ventanas que se encienden (edificios) y casas que se iluminan cuando les llega la burbuja
    const ventanas = $.all('.ed .w').map((el) => ({ el, t: Number(el.dataset['t']) }));
    const vents = $.all('.casa .vent');
    // Handys
    const poser = (el: HTMLElement) => {
      let ultima = '';
      return (p: Pose) => {
        if (p !== ultima) {
          ultima = p;
          pose(el, p);
        }
      };
    };
    const foco = poser($('.foco .pj'));
    const llave = poser($('.llave .pj'));
    const media = [poser($('.media.a .pj')), poser($('.media.b .pj'))];
    const cartel = poser($('.cartel .pj'));
    const volante = poser($('.volante .pj'));
    const enBurbuja = $.all('.bur .pj').map(poser);
    const like = $('.like');
    const remeras = $.all('.estampa .pj').map(poser);
    // Reacción de cada lado: saluda cuando aparece su texto y festeja cuando el canal llega; con los edificios, Llave
    // trabaja (de ahí salieron los primeros trabajos). Tablas [desde, pose].
    // (los cambios de paso van 0,05 s después de cada marca: la página exportada de un paso termina justo en la marca siguiente)
    const FOCO: Array<[number, Pose]> = [[0, 'a'], [1.55, 'b'], [2.3, 'c'], [3.45, 'a'], [3.95, 'b'], [6.85, 'a'], [7.35, 'd'], [9.1, 'c'], [10.25, 'a'], [10.75, 'b'], [12.5, 'c']];
    const LLAVE: Array<[number, Pose]> = [[0, 'a'], [1.75, 'b'], [2.5, 'c'], [3.45, 'a'], [4.15, 'b'], [5.7, 'c'], [6.85, 'a'], [7.55, 'b'], [9.1, 'd'], [10.25, 'a'], [10.95, 'b'], [12.7, 'c']];
    const en = (tabla: Array<[number, Pose]>, t: number): Pose => tabla.filter(([d]) => t >= d).pop()?.[1] ?? 'a';
    c.pintor((t) => {
      const i = remeraEn(t);
      estampas.forEach((el, j) => (el.style.display = j === i ? 'block' : 'none'));
      chips.forEach((el, j) => (el.style.display = j === i ? 'inline-flex' : 'none'));
      like.classList.toggle('lleno', t >= 2.25);
      for (const w of ventanas) w.el.classList.toggle('on', t >= w.t);
      vents.forEach((v, j) => v.classList.toggle('on', t >= (BURBUJAS[j]?.t ?? 99) + 0.25));
      foco(en(FOCO, t));
      llave(en(LLAVE, t));
      media[0]!(t >= 1.6 ? 'd' : 'b');
      media[1]!('c');
      cartel(t >= 4.4 ? 'b' : 'a');
      volante('b');
      enBurbuja.forEach((f, j) => f(t >= (BURBUJAS[j]?.t ?? 0) + 0.3 ? 'c' : 'b'));
      remeras.forEach((f) => f('b'));
    });
  },
  ambiente(t, $, tl) {
    // Respiración de los Handys (dueño: el ambiente; la línea de tiempo mueve los contenedores)
    $.all('.pj').forEach((p, i) => (p.style.transform = `scaleY(${(1 + Math.sin(t * 2.4 + i) * 0.02).toFixed(4)})`));
    // Los dos lados fluyen hacia Handyx
    const on = tramo(tl, T_FLUJO + 0.3, T_FLUJO + 0.8);
    FLUJOS.forEach((f, i) => {
      const largo = Math.abs(f.a - f.de);
      const dir = Math.sign(f.a - f.de);
      $.all(`.g${i} circle`).forEach((g, k, todos) => {
        const s = (t * 90 + (k * largo) / todos.length) % largo;
        const borde = Math.min(1, s / 40, (largo - s) / 40);
        g.setAttribute('cx', (f.de + dir * s).toFixed(1));
        g.setAttribute('cy', String(EJE));
        g.style.opacity = (on * borde).toFixed(2);
      });
    });
    const k = (t % 1.8) / 1.8;
    const onda = $('.hub .onda');
    onda.style.transform = `scale(${(1 + k * 0.35).toFixed(3)}, ${(1 + k * 0.8).toFixed(3)})`;
    onda.style.opacity = (on * (1 - k) * 0.8).toFixed(2);
    // Reacciones que suben del celular mientras está el anuncio (dueño: el ambiente)
    const vis = tl >= 1.6 && tl <= M[1]! ? 1 : 0;
    $.all('.reac').forEach((r, i) => {
      const u = ((t + i * 0.42) % 2.5) / 2.5;
      const x = 1092 + Math.sin(i * 1.7 + u * 3) * 26 + u * 70;
      const y = 600 - u * 300;
      r.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${(0.6 + Math.min(1, u * 4) * 0.4).toFixed(3)})`;
      r.style.opacity = (vis * Math.min(1, u * 5) * Math.min(1, (1 - u) * 2.2)).toFixed(2);
    });
    // La remera flota apenas
    $('.remera .flota').style.transform = `translateY(${(Math.sin(t * 1.8) * 5).toFixed(2)}px) rotate(${(Math.sin(t * 1.3) * 1.2).toFixed(2)}deg)`;
  },
});
