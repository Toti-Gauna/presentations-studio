// Material extra · Ferreterías conectadas (visión a explorar, sin alianzas firmadas). Un golpe por clic:
// 0 la ciudad se arma con el título; Engranaje, el ferretero, saluda desde la puerta ·
// 1 «El vecino pide el arreglo» → en el balcón, Grifo y Gota con la pérdida; Foco, el vecino, avisa ·
// 2 «El profesional agrega los materiales al trabajo» → llega Llave y suma los materiales en su celular ·
// 3 «Handyx le muestra stock en ferreterías cercanas y lo reserva» → stock cerca, la ferretería se ilumina, reserva y ruta ·
// 4 «El vecino lo ve en su app» → el celular de Foco con el seguimiento y los materiales a la vista ·
// 5 «Llega con todo: el arreglo, listo» → retira la caja, llega al edificio, arreglo listo y beneficios.
// Los celulares son un diseño propuesto con datos ficticios (sin precios ni números). La franja y 880–950 queda libre
// (leyenda del kit) y la de y > 960 también (subtítulos del video): ahí solo pasa la calle.
import { COLOR, entraTitulo, escena, pose, type Kit, type Personaje, type Sel, type Tl } from './comun/kit.ts';

// Momentos que comparten la coreografía, los pintores y el ambiente
const FUGA = 2.95; // aparece la pérdida
const STOCK = 9.65; // la ferretería tiene el stock
const RESERVA = 10.55; // reservado
const RETIRA = 15.55; // Llave recibe la caja
const ARREGLO = 17.05; // arreglo listo
/** Llave camina: [desde, hasta, dirección]. */
const CAMINA: ReadonlyArray<readonly [number, number, number]> = [
  [5.45, 6.7, 1],
  [14.95, 15.4, -1],
  [15.7, 17.0, 1],
];
const X_LLAVE = { fuera: -260, cel: 596, ferr: 548, edif: 1606 };

const svg = (cuerpo: string) => `<svg class="mat-ic" viewBox="0 0 40 40" aria-hidden="true">${cuerpo}</svg>`;
const MATERIALES = [
  {
    nom: 'Caño de termofusión',
    ic: svg(`<rect x="2" y="15" width="36" height="10" rx="3" fill="#DCE7F7" stroke="${COLOR.azul}" stroke-width="2.6"/><rect x="7" y="11" width="6" height="18" rx="2" fill="#fff" stroke="${COLOR.azul}" stroke-width="2.6"/><rect x="27" y="11" width="6" height="18" rx="2" fill="#fff" stroke="${COLOR.azul}" stroke-width="2.6"/>`),
  },
  {
    nom: 'Codos y uniones',
    ic: svg(`<path d="M10 36 V20 a11 11 0 0 1 11 -11 H36" fill="none" stroke="${COLOR.azul}" stroke-width="12"/><path d="M10 36 V20 a11 11 0 0 1 11 -11 H36" fill="none" stroke="#DCE7F7" stroke-width="6.5"/>`),
  },
  {
    nom: 'Cinta de teflón',
    ic: svg(`<path d="M18 33 H37" stroke="${COLOR.azul}" stroke-width="2.6" stroke-linecap="round"/><circle cx="18" cy="20" r="13" fill="#fff" stroke="${COLOR.azul}" stroke-width="2.6"/><circle cx="18" cy="20" r="6" fill="#DCE7F7" stroke="${COLOR.azul}" stroke-width="2.6"/>`),
  },
];
const NUBES = [
  { x: 1260, y: 150, s: 0.9, v: 14 },
  { x: 1640, y: 230, s: 0.7, v: 10 },
  { x: 700, y: 360, s: 0.6, v: 8 },
  { x: 1900, y: 110, s: 0.8, v: 12 },
];
const AUTOS = [
  { color: COLOR.amarillo, o: 0, y: 893, v: 150, dir: 1 },
  { color: '#FFFFFF', o: 1050, y: 893, v: 150, dir: 1 },
  { color: '#4A72B0', o: 520, y: 941, v: 120, dir: -1 },
];
const PRODUCTOS = ['martillo2', 'llave-inglesa', 'herramienta', 'capas', 'martillo', 'plomeria', 'herramienta', 'martillo2'];
const BENEFICIOS: Array<{ pj?: Personaje; ic?: string; titulo: string; txt: string }> = [
  { pj: 'llave', titulo: 'Profesional', txt: 'llega con todo lo que necesita' },
  { pj: 'engranaje', titulo: 'Ferretería', txt: 'más ventas en su barrio' },
  { pj: 'bombilla', titulo: 'Vecino', txt: 'menos idas y vueltas, todo a la vista' },
  { ic: 'crecimiento', titulo: 'Handyx', txt: 'otra fuente de ingresos · a explorar' },
];

/** Skyline del fondo (azar determinista del kit). */
function skyline(c: Kit): string {
  const tonos = ['#C9D8F0', '#BACBE8', '#D6E2F5', '#AFC3E4'];
  let x = -30;
  let i = 0;
  let out = '';
  while (x < 1960) {
    const w = 90 + Math.round(c.azar() * 90);
    const h = 150 + Math.round(c.azar() * 190);
    let v = '';
    for (let r = 0; r < Math.floor((h - 30) / 34); r++)
      for (let k = 0; k < Math.floor((w - 18) / 26); k++) v += `<i class="${c.azar() < 0.3 ? 'on' : ''}" style="left:${14 + k * 26}px;top:${18 + r * 34}px"></i>`;
    out += `<div class="sk" style="left:${x}px;width:${w}px;height:${h}px;background:${tonos[i % 4]}">${v}</div>`;
    x += w + 8 + Math.round(c.azar() * 24);
    i++;
  }
  return out;
}

/** Ventanas del edificio: el balcón ocupa las columnas 0–2 de las filas 2 y 3; la entrada, las columnas 1–2 de la fila 5. */
function ventanas(c: Kit): string {
  let out = '';
  for (let r = 0; r < 6; r++)
    for (let k = 0; k < 4; k++) {
      if ((r === 2 || r === 3) && k < 3) continue;
      if (r === 5 && (k === 1 || k === 2)) continue;
      const on = c.azar() < 0.45;
      out += `<i class="w${on ? ' on' : ''}" data-on="${on ? 1 : 0}" data-k="${c.azar().toFixed(3)}" style="left:${30 + k * 82}px;top:${24 + r * 62}px"></i>`;
    }
  return out;
}

/** Personaje en su contenedor: .mov lo mueve la línea de tiempo; .cuerpo, el ambiente; las poses, el pintor. */
const personaje = (c: Kit, nombre: Personaje, clase: string, alto: number, extra = '') =>
  `<div class="mov ${clase}" style="width:${alto}px;height:${alto}px"><i class="sombra-pj"></i><div class="cuerpo">${c.pj(nombre, '', alto)}${extra}</div></div>`;

const BARRA = '<div class="sb"><i></i><i></i><i></i><i></i><b></b></div>';

function celEspecialista(c: Kit): string {
  const filas = MATERIALES.map(
    (m) => `<div class="te-mat">${m.ic}<span class="nom">${m.nom}</span><span class="btn-ag"><span>+ Agregar</span><span class="hecho">✓ Agregado</span><i class="toque"></i></span></div>`,
  ).join('');
  return c.celular(
    `${BARRA}
    <div class="scr te-a">
      <div class="app-cab">${c.logo('app-logo')}<span class="ava">${c.img('personajes/llave-a.webp')}</span></div>
      <div class="te-trab"><small><i></i>Trabajo aceptado</small><b>Cambiar el caño de la cocina</b></div>
      <div class="te-h">Materiales del trabajo</div>
      ${filas}
      <div class="te-cta">${c.icono('ubicacion', 'blanco')}Buscar stock cerca<i class="toque"></i></div>
    </div>
    <div class="scr te-b">
      <div class="app-cab"><span class="volver">‹</span><b class="cab-t">Stock cerca</b><span class="ava">${c.img('personajes/llave-a.webp')}</span></div>
      <div class="te-mapa">
        <i class="mc h" style="top:34px"></i><i class="mc h" style="top:112px"></i><i class="mc v" style="left:64px"></i><i class="mc v" style="left:198px"></i>
        <svg class="m-ruta" viewBox="0 0 288 170"><path d="M71 119 V41 H222" fill="none" stroke="${COLOR.azul}" stroke-width="5" stroke-linecap="round" stroke-dasharray="1 11"/></svg>
        <span class="m-yo"><i class="pulso"></i></span>
        <span class="m-pin">${c.icono('tienda')}</span>
      </div>
      <div class="te-tienda">
        <div class="fila"><span class="ava">${c.img('personajes/engranaje-a.webp')}</span><b>Ferretería del barrio</b></div>
        <span class="te-stock">✓ En stock</span>
        <ul class="te-lista">${MATERIALES.map((m) => `<li>${m.nom}</li>`).join('')}</ul>
      </div>
      <div class="te-res">Reservar y retirar<span class="ok">Reservado ✓</span><i class="toque"></i></div>
    </div>`,
    'cel-e',
  );
}

function celVecino(c: Kit): string {
  return c.celular(
    `${BARRA}
    <div class="scr tu">
      <div class="app-cab">${c.logo('app-logo')}<span class="ava">${c.img('personajes/bombilla-a.webp')}</span></div>
      <div class="tu-tit"><b class="t">Tu arreglo</b><span>Cambiar el caño de la cocina</span></div>
      <div class="tu-pasos">
        <i class="tu-linea"></i>
        <div class="tu-paso p0"><i class="pt">✓</i><div><b>Pedido enviado</b></div></div>
        <div class="tu-paso p1"><i class="realce"></i><i class="pt">✓</i><div><b>Materiales reservados</b><span>Ferretería del barrio</span></div></div>
        <div class="tu-paso p2 ahora"><i class="pt"><i class="pulso"></i></i><div><b>El especialista retira y va en camino</b></div></div>
      </div>
      <div class="tu-trans"><div class="cab2">${c.icono('lista')}<b>Transparencia:</b></div><p>ves qué materiales se usan</p><ul>${MATERIALES.map((m) => `<li>${m.nom}</li>`).join('')}</ul></div>
    </div>`,
    'cel-u',
  );
}

/** Toque del dedo sobre un botón (aparece y se apaga; antes de su momento queda oculto, también al volver atrás). */
function toque(tl: Tl, el: HTMLElement | null, t: number): void {
  if (!el) return;
  tl.fromTo(el, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 0.95, scale: 0.85, duration: 0.1, ease: 'power2.out' }, t);
  tl.to(el, { autoAlpha: 0, scale: 1.5, duration: 0.4, ease: 'power2.out' }, t + 0.1);
}

interface Refs {
  rayos: HTMLElement;
  nubes: Array<{ el: HTMLElement; x: number; v: number; s: number }>;
  lineas: HTMLElement;
  autos: Array<{ el: HTMLElement; o: number; v: number; dir: number }>;
  ventanas: Array<{ el: HTMLElement; k: number; on: boolean }>;
  llave: HTMLElement;
  ferretero: HTMLElement;
  grifo: HTMLElement;
  gota: HTMLElement;
  foco: HTMLElement;
  halo: HTMLElement;
  gotitas: HTMLElement[];
  pings: HTMLElement[];
  rutaA: HTMLElement;
  rutaB: HTMLElement;
  pulsos: HTMLElement[];
}
const CACHE = new WeakMap<HTMLElement, Refs>();
function refs($: Sel): Refs {
  const raiz = $('.lienzo');
  let r = CACHE.get(raiz);
  if (!r) {
    const num = (el: HTMLElement, k: string) => Number(el.dataset[k] ?? 0);
    r = {
      rayos: $('.sol .rayos'),
      nubes: $.all('.nube').map((el) => ({ el, x: num(el, 'x'), v: num(el, 'v'), s: num(el, 's') })),
      lineas: $('.lineas'),
      autos: $.all('.auto').map((el) => ({ el, o: num(el, 'o'), v: num(el, 'v'), dir: num(el, 'dir') })),
      ventanas: $.all('.ed-frente .w').map((el) => ({ el, k: num(el, 'k'), on: el.dataset['on'] === '1' })),
      llave: $('.llave .cuerpo'),
      ferretero: $('.ferretero .cuerpo'),
      grifo: $('.grifo .cuerpo'),
      gota: $('.gota .cuerpo'),
      foco: $('.foco .cuerpo'),
      halo: $('.halo'),
      gotitas: $.all('.gotita'),
      pings: $.all('.ping'),
      rutaA: $('.ra .puntos'),
      rutaB: $('.rb .puntos'),
      pulsos: $.all('.pulso'),
    };
    CACHE.set(raiz, r);
  }
  return r;
}

export default escena({
  marcas: [0, 2.8, 5.4, 8.6, 11.8, 14.8, 18.2],
  // Cielo arriba a la derecha, sobre el edificio: solo nubes por debajo en todos los pasos.
  cara: [0, 1, 2, 3, 4, 5].map((desde) => ({ desde, x: 1690, y: 170, d: 250 })),
  css: `
    .cielo-f { position: absolute; left: 0; top: 0; width: 1920px; height: 850px; background: linear-gradient(#C9DCF8 0%, #E3EDFB 55%, ${COLOR.hueso} 100%); z-index: 0; }
    .sol { position: absolute; left: 1405px; top: 255px; width: 110px; height: 110px; z-index: 1; }
    .sol .disco { position: absolute; inset: 0; border-radius: 50%; background: ${COLOR.amarillo}; box-shadow: 0 0 0 14px rgba(255,201,60,.22), 0 0 70px rgba(255,201,60,.55); }
    .sol .rayos { position: absolute; left: -45px; top: -45px; width: 200px; height: 200px; }
    .sol .rayos i { position: absolute; left: 96px; top: 0; width: 8px; height: 26px; border-radius: 6px; background: ${COLOR.amarillo}; transform-origin: 4px 100px; }
    .nubes { position: absolute; inset: 0; z-index: 1; }
    .nube { position: absolute; left: 0; width: 190px; height: 52px; border-radius: 52px; background: #fff; opacity: .95; transform-origin: 0 50%; }
    .nube::before { content: ''; position: absolute; left: 30px; top: -30px; width: 74px; height: 74px; border-radius: 50%; background: #fff; }
    .nube::after { content: ''; position: absolute; left: 86px; top: -44px; width: 92px; height: 92px; border-radius: 50%; background: #fff; }
    .skyline { position: absolute; inset: 0; z-index: 2; }
    .sk { position: absolute; bottom: 240px; transform-origin: 50% 100%; border-radius: 8px 8px 0 0; }
    .sk i { position: absolute; width: 14px; height: 18px; border-radius: 3px; background: rgba(255,255,255,.6); }
    .sk i.on { background: #FFE9A8; }
    .suelo { position: absolute; inset: 0; z-index: 3; }
    .vereda, .vereda2 { position: absolute; left: 0; width: 1920px; background-color: #ECECEC; background-image: linear-gradient(90deg, rgba(14,29,54,.07) 2px, transparent 2px), linear-gradient(rgba(14,29,54,.07) 2px, transparent 2px); background-size: 42px 42px; }
    .vereda { top: 840px; height: 42px; border-top: 4px solid #D6D9E0; }
    .vereda2 { top: 990px; height: 90px; border-top: 6px solid #C9CFDA; }
    .cordon { position: absolute; left: 0; top: 882px; width: 1920px; height: 9px; background: #B9C1D0; }
    .calle { position: absolute; left: 0; top: 891px; width: 1920px; height: 99px; background: ${COLOR.texto}; overflow: hidden; }
    .lineas { position: absolute; left: 0; top: 46px; width: 2200px; height: 6px; background: repeating-linear-gradient(90deg, ${COLOR.amarillo} 0 60px, transparent 60px 130px); }
    .autos { position: absolute; inset: 0; z-index: 4; }
    .auto { position: absolute; left: 0; width: 156px; height: 70px; transform-origin: 50% 0; }
    .auto .cab { position: absolute; left: 32px; top: 0; width: 86px; height: 32px; border-radius: 14px 18px 4px 4px; }
    .auto .cab::after { content: ''; position: absolute; left: 10px; top: 6px; width: 64px; height: 18px; border-radius: 8px 10px 3px 3px; background: #CFE0FA; }
    .auto .car { position: absolute; left: 0; top: 26px; width: 156px; height: 32px; border-radius: 14px; box-shadow: inset 0 -8px 0 rgba(0,0,0,.12); }
    .auto .r { position: absolute; top: 44px; width: 28px; height: 28px; border-radius: 50%; background: ${COLOR.noche}; border: 6px solid #3B4A68; }
    .auto .luz { position: absolute; right: -2px; top: 34px; width: 10px; height: 8px; border-radius: 3px; background: #FFE9A8; }

    /* ferretería (Engranaje atiende en la puerta) */
    .ferr { position: absolute; left: 80px; top: 470px; width: 500px; height: 370px; z-index: 6; }
    .f-cornisa { position: absolute; left: -10px; top: 0; width: 520px; height: 22px; background: ${COLOR.azulOscuro}; border-radius: 8px 8px 2px 2px; }
    .f-alto { position: absolute; left: 0; top: 22px; width: 500px; height: 128px; background: #FFF3D9; border-left: 6px solid #E9D6AE; border-right: 6px solid #E9D6AE; }
    .f-ven { position: absolute; top: 26px; width: 96px; height: 74px; border-radius: 8px; background: #CFE0FA; border: 6px solid #fff; box-shadow: 0 0 0 3px #E2CC9E; }
    .f-brillo { position: absolute; left: 24px; top: 140px; width: 452px; height: 74px; border-radius: 16px; box-shadow: 0 0 36px 10px rgba(255,201,60,.85); }
    .f-cartel { position: absolute; left: 30px; top: 146px; width: 440px; height: 62px; border-radius: 12px; background: ${COLOR.azulOscuro}; display: flex; align-items: center; justify-content: center; gap: 14px; box-shadow: 0 8px 0 rgba(14,29,54,.18); }
    .f-cartel span { color: ${COLOR.amarillo}; font-size: 38px; }
    .f-cartel .icono { width: 36px; height: 36px; }
    .f-bajo { position: absolute; left: 0; top: 254px; width: 500px; height: 116px; background: #FFF3D9; border-left: 6px solid #E9D6AE; border-right: 6px solid #E9D6AE; }
    .f-vitrina { position: absolute; left: 22px; top: 18px; width: 318px; height: 94px; border-radius: 10px; background: #E7F0FD; border: 5px solid #fff; box-shadow: 0 0 0 3px #E2CC9E; overflow: hidden; }
    .f-estante { position: absolute; left: 0; width: 100%; height: 5px; background: #C9A86A; }
    .f-prod { position: absolute; width: 34px; height: 34px; }
    .f-prod .icono { width: 34px; height: 34px; }
    .f-puerta { position: absolute; left: 364px; top: 10px; width: 104px; height: 106px; border-radius: 10px 10px 0 0; background: linear-gradient(#22375C, #13305E); border: 5px solid #fff; border-bottom: 0; }
    .f-toldo { position: absolute; left: -14px; top: 214px; width: 528px; height: 40px; transform-origin: 50% 0; background: repeating-linear-gradient(90deg, ${COLOR.azul} 0 44px, ${COLOR.amarillo} 44px 88px); border-radius: 6px 6px 0 0; }
    .f-toldo::after { content: ''; position: absolute; left: 0; top: 40px; width: 528px; height: 20px; background: radial-gradient(circle at 22px 0, ${COLOR.azul} 21px, transparent 22px) 0 0 / 44px 20px repeat-x; }
    .ferretero { left: 452px; top: 750px; z-index: 7; }
    .caja-f { position: absolute; left: 520px; top: 790px; width: 60px; height: 46px; z-index: 8; }
    .caja { position: absolute; width: 60px; height: 46px; border-radius: 7px; background: #D9A35B; box-shadow: inset 0 -7px 0 rgba(0,0,0,.08), 0 6px 14px rgba(14,29,54,.25); }
    .caja::before { content: ''; position: absolute; left: 24px; top: 0; width: 12px; height: 46px; background: ${COLOR.azul}; }
    .caja b { position: absolute; right: -10px; top: -10px; width: 26px; height: 26px; border-radius: 50%; background: ${COLOR.verde}; color: #fff; font-size: 16px; font-weight: 900; display: grid; place-items: center; }
    .f-badge { position: absolute; left: 330px; top: 402px; transform: translateX(-50%); z-index: 11; }
    .f-badge .chip { font-size: 26px; padding: 10px 22px; }
    .ping { position: absolute; left: 270px; top: 587px; width: 120px; height: 120px; border-radius: 50%; border: 5px solid ${COLOR.verde}; opacity: 0; z-index: 7; }

    /* edificio con el balcón de la pérdida */
    .edif { position: absolute; left: 1520px; top: 330px; width: 360px; height: 510px; transform-origin: 50% 100%; z-index: 6; }
    .ed-tanque { position: absolute; left: 250px; top: -30px; width: 62px; height: 30px; border-radius: 8px 8px 0 0; background: #3B4A68; }
    .ed-cornisa { position: absolute; left: -10px; top: 0; width: 380px; height: 20px; border-radius: 8px 8px 2px 2px; background: ${COLOR.azulOscuro}; }
    .ed-frente { position: absolute; left: 0; top: 20px; width: 360px; height: 490px; background: #1D2C4A; }
    .ed-frente .w { position: absolute; width: 58px; height: 46px; border-radius: 6px; background: #2E4470; }
    .ed-frente .w.on { background: #FFE9A8; }
    .ed-ventanal { position: absolute; left: 28px; top: 144px; width: 228px; height: 98px; border-radius: 10px; background: #2E4470; box-shadow: inset 0 0 0 5px #3B5384; }
    .ed-ventanal.fuga { background: linear-gradient(#FFD98C, #F6A623); }
    .ed-ventanal.ok { background: linear-gradient(#D2F5DF, #8EDDB0); }
    .ed-balcon { position: absolute; left: 14px; top: 262px; width: 256px; height: 12px; border-radius: 3px; background: ${COLOR.azulOscuro}; }
    .ed-marq { position: absolute; left: 120px; top: 404px; width: 140px; height: 14px; border-radius: 6px; background: ${COLOR.amarillo}; }
    .ed-ent { position: absolute; left: 130px; top: 418px; width: 100px; height: 92px; border-radius: 12px 12px 0 0; background: #CFE0FA; border: 6px solid #E6EEFB; border-bottom: 0; }
    .halo { position: absolute; left: 1548px; top: 494px; width: 228px; height: 98px; border-radius: 10px; box-shadow: 0 0 0 5px rgba(246,166,35,.95), 0 0 36px 14px rgba(255,201,60,.7); opacity: 0; z-index: 7; }
    .halo.ok { box-shadow: 0 0 0 5px rgba(30,158,87,.95), 0 0 30px 10px rgba(30,158,87,.45); }
    .baranda { position: absolute; left: 1540px; top: 556px; width: 244px; height: 36px; border-top: 5px solid #C9D3E6; background: repeating-linear-gradient(90deg, rgba(201,211,230,.95) 0 3px, transparent 3px 18px); z-index: 11; }
    .charco { position: absolute; left: 1560px; top: 583px; width: 92px; height: 12px; border-radius: 50%; background: radial-gradient(#9CC3F5, #6FA3EA); transform-origin: 50% 50%; z-index: 9; }
    .gotita { position: absolute; left: 1580px; top: 534px; width: 14px; height: 19px; border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%; background: #6FA3EA; opacity: 0; z-index: 9; }
    .grifo { left: 1554px; top: 482px; z-index: 10; }
    .gota { left: 1676px; top: 514px; z-index: 10; }
    .foco { left: 1782px; top: 732px; z-index: 10; }
    .b-fuga, .b-listo { position: absolute; z-index: 12; display: flex; gap: 12px; align-items: center; padding: 14px 22px; border-radius: 22px; font-weight: 800; font-size: 26px; white-space: nowrap; }
    .b-fuga { right: 30px; top: 650px; background: #fff; box-shadow: 0 14px 34px rgba(14,29,54,.2); transform-origin: 85% 100%; }
    .b-fuga::after { content: ''; position: absolute; right: 52px; bottom: -16px; border: 10px solid transparent; border-top: 16px solid #fff; border-bottom: 0; }
    .b-fuga b { width: 34px; height: 34px; border-radius: 50%; background: ${COLOR.naranja}; color: #fff; display: grid; place-items: center; font-size: 24px; font-weight: 900; }
    .b-listo { left: 1534px; top: 398px; background: ${COLOR.verde}; color: #fff; box-shadow: 0 14px 34px rgba(30,158,87,.35); transform-origin: 25% 100%; }
    .b-listo::after { content: ''; position: absolute; left: 70px; bottom: -16px; border: 10px solid transparent; border-top: 16px solid ${COLOR.verde}; border-bottom: 0; }
    .chispa { position: absolute; left: 1650px; top: 530px; width: 22px; height: 22px; background: ${COLOR.amarillo}; clip-path: polygon(50% 0, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0 50%, 38% 38%); opacity: 0; z-index: 12; }

    /* personajes */
    .mov { position: absolute; }
    .mov .cuerpo { position: absolute; inset: 0; transform-origin: 50% 100%; }
    .llave { left: 0; top: 684px; z-index: 10; }
    .llave .caja { left: 98px; top: 70px; }

    /* ruta punteada sobre la vereda */
    .ruta { position: absolute; top: 858px; height: 12px; z-index: 8; }
    .ruta .puntos { position: absolute; inset: 0; background: radial-gradient(circle, ${COLOR.azul} 4px, transparent 4.6px) 0 50% / 20px 12px repeat-x; }
    .ra { left: 496px; width: 184px; } .rb { left: 560px; width: 1130px; }
    .marca { position: absolute; top: 852px; width: 24px; height: 24px; margin-left: -12px; border-radius: 50%; background: #fff; box-shadow: 0 0 0 5px ${COLOR.azul}, 0 4px 10px rgba(14,29,54,.3); z-index: 9; }
    .marca::after { content: ''; position: absolute; left: 7px; top: 7px; width: 10px; height: 10px; border-radius: 50%; background: ${COLOR.azul}; }
    .mf { left: 496px; } .me { left: 1690px; }

    /* celulares: diseño propuesto */
    .tel { position: absolute; top: 78px; width: 340px; height: 772px; z-index: 20; }
    .tel-e { left: 770px; } .tel-u { left: 1160px; }
    .tel .cel { left: 0; top: 42px; }
    .rot-cel { position: absolute; left: -30px; right: -30px; top: 0; text-align: center; }
    .rot-cel span { display: inline-block; padding: 3px 14px; border-radius: 999px; background: rgba(255,255,255,.9); box-shadow: 0 0 0 2px #C9D3E6; font-size: 20px; font-weight: 700; color: ${COLOR.suave}; white-space: nowrap; }
    .sb { position: absolute; top: 20px; right: 30px; display: flex; gap: 4px; align-items: flex-end; z-index: 8; }
    .sb i { width: 4px; border-radius: 2px; background: ${COLOR.noche}; }
    .sb i:nth-child(1) { height: 5px; } .sb i:nth-child(2) { height: 8px; } .sb i:nth-child(3) { height: 11px; } .sb i:nth-child(4) { height: 14px; }
    .sb b { position: relative; width: 26px; height: 13px; margin-left: 6px; border-radius: 4px; border: 2px solid ${COLOR.noche}; }
    .sb b::after { content: ''; position: absolute; left: 1px; top: 1px; bottom: 1px; right: 6px; border-radius: 2px; background: ${COLOR.noche}; }
    .scr { position: absolute; inset: 0; padding: 56px 14px 18px; display: flex; flex-direction: column; gap: 12px; color: ${COLOR.noche}; }
    .app-cab { flex: none; display: flex; align-items: center; justify-content: space-between; height: 44px; }
    .app-logo { height: 30px; }
    .ava { flex: none; width: 46px; height: 46px; border-radius: 50%; background: ${COLOR.celeste}; display: grid; place-items: center; overflow: hidden; box-shadow: inset 0 0 0 2px #fff, 0 2px 0 ${COLOR.borde}; }
    .ava img { width: 40px; height: 40px; object-fit: contain; }
    .toque { position: absolute; left: 50%; top: 50%; width: 52px; height: 52px; margin: -26px 0 0 -26px; border-radius: 50%; background: rgba(14,29,54,.22); box-shadow: 0 0 0 3px rgba(255,255,255,.95); opacity: 0; visibility: hidden; pointer-events: none; }
    .te-trab { flex: none; padding: 12px 14px; border-radius: 18px; background: #fff; box-shadow: 0 2px 0 ${COLOR.borde}; }
    .te-trab small { display: flex; align-items: center; gap: 8px; font-size: 20px; font-weight: 800; color: ${COLOR.verde}; }
    .te-trab small i { width: 12px; height: 12px; border-radius: 50%; background: ${COLOR.verde}; }
    .te-trab b { display: block; margin-top: 4px; font-size: 24px; line-height: 1.18; font-weight: 800; }
    .te-h { flex: none; font-size: 20px; font-weight: 800; color: ${COLOR.suave}; padding-left: 2px; }
    .te-mat { flex: none; position: relative; display: grid; grid-template-columns: 40px 1fr; column-gap: 10px; row-gap: 6px; align-items: center; padding: 10px 12px; border-radius: 16px; background: #fff; box-shadow: 0 2px 0 ${COLOR.borde}; }
    .mat-ic { grid-row: span 2; width: 40px; height: 40px; }
    .te-mat .nom { font-size: 20px; font-weight: 700; white-space: nowrap; }
    .btn-ag { position: relative; justify-self: start; width: 156px; height: 38px; border-radius: 12px; display: grid; place-items: center; font-size: 20px; font-weight: 800; color: ${COLOR.azul}; background: #fff; box-shadow: inset 0 0 0 2.5px ${COLOR.azul}; }
    .btn-ag .hecho { position: absolute; inset: 0; border-radius: 12px; display: grid; place-items: center; color: #fff; background: ${COLOR.verde}; opacity: 0; }
    .te-cta, .te-res { flex: none; position: relative; margin-top: auto; height: 58px; border-radius: 16px; background: ${COLOR.azul}; color: #fff; font-weight: 800; font-size: 21px; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 5px 0 ${COLOR.azulOscuro}; }
    .te-cta .icono { width: 26px; height: 26px; }
    .te-res .ok { position: absolute; inset: 0; border-radius: 16px; background: ${COLOR.verde}; display: grid; place-items: center; box-shadow: 0 5px 0 #157443; opacity: 0; }
    .volver { font-size: 40px; font-weight: 700; line-height: 1; color: ${COLOR.azul}; width: 30px; }
    .cab-t { font-size: 24px; font-weight: 800; }
    .te-mapa { flex: none; position: relative; height: 170px; border-radius: 18px; overflow: hidden; background: #E2EAF6; box-shadow: inset 0 0 0 2px #fff; }
    .mc { position: absolute; background: #fff; }
    .mc.h { left: 0; right: 0; height: 14px; } .mc.v { top: 0; bottom: 0; width: 14px; }
    .m-ruta { position: absolute; left: 0; top: 0; width: 288px; height: 170px; }
    .m-yo { position: absolute; left: 61px; top: 109px; width: 20px; height: 20px; border-radius: 50%; background: ${COLOR.azul}; box-shadow: 0 0 0 4px #fff; }
    .m-yo .pulso { position: absolute; inset: -4px; border-radius: 50%; border: 3px solid ${COLOR.azul}; }
    .m-pin { position: absolute; left: 200px; top: 19px; width: 46px; height: 46px; border-radius: 50%; background: #fff; display: grid; place-items: center; box-shadow: 0 0 0 4px ${COLOR.verde}, 0 6px 12px rgba(14,29,54,.25); }
    .m-pin .icono { width: 26px; height: 26px; }
    .te-tienda { flex: none; padding: 12px 14px; border-radius: 18px; background: #fff; box-shadow: 0 0 0 3px ${COLOR.verde}, 0 2px 0 ${COLOR.borde}; }
    .te-tienda .fila { display: flex; align-items: center; gap: 10px; }
    .te-tienda .fila b { font-size: 22px; line-height: 1.15; }
    .te-stock { display: inline-block; margin-top: 8px; padding: 3px 12px; border-radius: 999px; background: #E3F5EA; color: ${COLOR.verde}; font-size: 20px; font-weight: 800; }
    .te-lista, .tu-trans ul { list-style: none; padding: 0; margin-top: 6px; }
    .te-lista li { font-size: 20px; line-height: 1.3; font-weight: 600; color: ${COLOR.texto}; }
    .te-lista li::before { content: '✓ '; color: ${COLOR.verde}; font-weight: 900; }
    .tu-tit { flex: none; }
    .tu-tit b { display: block; font-size: 32px; }
    .tu-tit span { display: block; margin-top: 4px; font-size: 20px; font-weight: 600; color: ${COLOR.suave}; line-height: 1.25; }
    .tu-pasos { flex: none; position: relative; display: grid; gap: 14px; padding: 14px 12px; border-radius: 18px; background: #fff; box-shadow: 0 2px 0 ${COLOR.borde}; }
    .tu-linea { position: absolute; left: 27px; top: 30px; bottom: 40px; width: 4px; border-radius: 2px; background: linear-gradient(${COLOR.verde} 70%, ${COLOR.borde} 70%); transform-origin: 50% 0; }
    .tu-paso { position: relative; display: grid; grid-template-columns: 34px 1fr; column-gap: 12px; align-items: start; }
    .tu-paso .pt { position: relative; z-index: 1; width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; font-style: normal; font-weight: 900; font-size: 20px; color: #fff; background: ${COLOR.verde}; }
    .tu-paso.ahora .pt { background: #fff; box-shadow: inset 0 0 0 4px ${COLOR.azul}; }
    .tu-paso.ahora .pt::after { content: ''; width: 12px; height: 12px; border-radius: 50%; background: ${COLOR.azul}; }
    .tu-paso .pulso { position: absolute; inset: 0; border-radius: 50%; border: 3px solid ${COLOR.azul}; }
    .tu-paso > div { position: relative; z-index: 1; }
    .tu-paso b { display: block; padding-top: 4px; font-size: 21px; line-height: 1.2; font-weight: 800; }
    .tu-paso span { display: block; font-size: 20px; font-weight: 600; color: ${COLOR.suave}; }
    .tu-paso .realce { position: absolute; left: -6px; right: -4px; top: -6px; bottom: -6px; border-radius: 12px; background: rgba(255,201,60,.32); }
    .tu-trans { flex: none; padding: 12px 14px; border-radius: 18px; background: #FFF6DA; box-shadow: inset 0 0 0 2px #F3DB8F; }
    .tu-trans .cab2 { display: flex; align-items: center; gap: 10px; }
    .tu-trans .icono { width: 30px; height: 30px; }
    .tu-trans b { font-size: 21px; }
    .tu-trans p { margin-top: 2px; font-size: 20px; font-weight: 700; line-height: 1.25; }
    .tu-trans li { font-size: 20px; line-height: 1.3; font-weight: 600; color: ${COLOR.texto}; }
    .tu-trans li::before { content: '• '; color: ${COLOR.naranja}; font-weight: 900; }

    /* título y rótulo de visión */
    .cab { position: absolute; left: 96px; top: 50px; z-index: 25; }
    .cab .tit { margin-top: 12px; transform-origin: 0 0; white-space: nowrap; }
    .vision { position: absolute; left: 96px; top: 268px; z-index: 25; background: rgba(255,255,255,.88); color: ${COLOR.azulOscuro}; box-shadow: 0 0 0 2.5px ${COLOR.azulOscuro}; }

    /* beneficios */
    .ben { position: absolute; left: 640px; top: 262px; width: 820px; display: grid; grid-template-columns: 1fr 1fr; gap: 18px; z-index: 22; }
    .bn { display: flex; gap: 16px; align-items: center; padding: 16px 20px; border-radius: 22px; background: #fff; box-shadow: 0 14px 30px rgba(14,29,54,.16), 0 3px 0 ${COLOR.borde}; }
    .bn .ic { flex: none; width: 64px; height: 64px; border-radius: 18px; background: ${COLOR.celeste}; display: grid; place-items: center; overflow: hidden; }
    .bn .ic img { width: 56px; height: 56px; object-fit: contain; }
    .bn .ic .icono { width: 36px; height: 36px; }
    .bn.hx .ic { background: ${COLOR.amarillo}; }
    .bn b { display: block; font-size: 24px; color: ${COLOR.azulOscuro}; }
    .bn span { display: block; font-size: 20px; color: #3C4A66; line-height: 1.25; }
  `,
  html: (c) => `
    <div class="cielo-f"></div>
    <div class="sol"><div class="rayos">${Array.from({ length: 12 }, (_, i) => `<i style="transform:rotate(${i * 30}deg)"></i>`).join('')}</div><div class="disco"></div></div>
    <div class="nubes">${NUBES.map((n) => `<div class="nube" data-x="${n.x}" data-v="${n.v}" data-s="${n.s}" style="top:${n.y}px"></div>`).join('')}</div>
    <div class="skyline">${skyline(c)}</div>
    <div class="suelo"><div class="vereda"></div><div class="cordon"></div><div class="calle"><div class="lineas"></div></div><div class="vereda2"></div></div>
    <div class="autos">${AUTOS.map((a) => `<div class="auto" data-o="${a.o}" data-v="${a.v}" data-dir="${a.dir}" style="top:${a.y}px"><div class="cab" style="background:${a.color}"></div><div class="car" style="background:${a.color}"></div><div class="r" style="left:18px"></div><div class="r" style="right:18px"></div><div class="luz"></div></div>`).join('')}</div>
    <div class="ferr">
      <div class="f-cornisa"></div>
      <div class="f-alto"><div class="f-ven" style="left:40px"></div><div class="f-ven" style="left:202px"></div><div class="f-ven" style="left:364px"></div></div>
      <div class="f-brillo"></div>
      <div class="f-cartel">${c.icono('martillo2', 'oro')}<span class="t">FERRETERÍA</span></div>
      <div class="f-bajo"><div class="f-vitrina"><i class="f-estante" style="top:42px"></i><i class="f-estante" style="top:82px"></i>${PRODUCTOS.map((p, i) => `<span class="f-prod" style="left:${16 + (i % 4) * 76}px;top:${i < 4 ? 6 : 46}px">${c.icono(p)}</span>`).join('')}</div><div class="f-puerta"></div></div>
      <div class="f-toldo"></div>
    </div>
    ${personaje(c, 'engranaje', 'ferretero', 88)}
    <div class="caja-f"><div class="caja"><b>✓</b></div></div>
    <div class="ping"></div><div class="ping"></div>
    <div class="f-badge"><span class="chip verde">✓ <span class="txt">En stock</span></span></div>
    <div class="edif">
      <div class="ed-tanque"></div><div class="ed-cornisa"></div>
      <div class="ed-frente">${ventanas(c)}<div class="ed-ventanal"></div></div>
      <div class="ed-balcon"></div><div class="ed-marq"></div><div class="ed-ent"></div>
    </div>
    <div class="halo"></div>
    <div class="charco"></div>
    ${'<i class="gotita"></i>'.repeat(3)}
    ${personaje(c, 'grifo', 'grifo', 110)}
    ${personaje(c, 'gota', 'gota', 78)}
    <div class="baranda"></div>
    ${personaje(c, 'bombilla', 'foco', 120)}
    <div class="b-fuga"><b>!</b>¡Se rompió un caño!</div>
    <div class="b-listo">✓ ¡Arreglo listo!</div>
    ${'<i class="chispa"></i>'.repeat(12)}
    <div class="ruta ra"><div class="puntos"></div></div><div class="ruta rb"><div class="puntos"></div></div>
    <i class="marca mf"></i><i class="marca me"></i>
    ${personaje(c, 'llave', 'llave', 168, '<div class="caja"><b>✓</b></div>')}
    <div class="mov tel tel-e"><div class="rot-cel"><span>Diseño propuesto · datos ficticios</span></div>${celEspecialista(c)}</div>
    <div class="mov tel tel-u"><div class="rot-cel"><span>Diseño propuesto · datos ficticios</span></div>${celVecino(c)}</div>
    <div class="cab"><div class="kicker">Material extra · visión</div>
      <div class="titulo t tit"><span class="l"><span>Ferreterías conectadas:</span></span><span class="l"><span><mark>stock para los profesionales</mark></span></span></div></div>
    <div class="chip vision">${c.icono('idea')}Visión · a explorar · sin alianzas firmadas</div>
    <div class="ben">${BENEFICIOS.map((b) => `<div class="bn${b.ic ? ' hx' : ''}"><div class="ic">${b.pj ? c.img(`personajes/${b.pj}-c.webp`) : c.icono(b.ic ?? 'crecimiento')}</div><div><b>${b.titulo}</b><span>${b.txt}</span></div></div>`).join('')}</div>
  `,
  armar(tl, $, c) {
    // 0 · la ciudad se arma con el título
    tl.fromTo($('.cielo-f'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, 0);
    tl.fromTo($('.suelo'), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.1);
    tl.fromTo($.all('.sk'), { scaleY: 0 }, { scaleY: 1, duration: 0.7, ease: 'back.out(1.4)', stagger: { each: 0.05, from: 'center' } }, 0.25);
    tl.fromTo($('.sol'), { autoAlpha: 0, y: 90 }, { autoAlpha: 1, y: 0, duration: 1.1, ease: 'power3.out' }, 0.3);
    tl.fromTo($('.nubes'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 0.4);
    tl.fromTo($('.ferr'), { autoAlpha: 0, y: 160 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'back.out(1.3)' }, 0.85);
    tl.fromTo($('.f-toldo'), { scaleY: 0 }, { scaleY: 1, duration: 0.5, ease: 'back.out(2.2)' }, 1.55);
    tl.fromTo($('.f-cartel'), { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(2.4)' }, 1.75);
    tl.fromTo($.all('.f-prod'), { scale: 0 }, { scale: 1, duration: 0.35, ease: 'back.out(3)', stagger: 0.05 }, 1.9);
    tl.fromTo($('.ferretero'), { autoAlpha: 0, scale: 0.3, transformOrigin: '50% 100%' }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(2.2)' }, 2.1);
    tl.fromTo($('.edif'), { scaleY: 0 }, { scaleY: 1, duration: 1.0, ease: 'power3.out' }, 1.0);
    const ws = $.all('.ed-frente .w');
    const retrasos = ws.map(() => c.azar() * 0.7);
    tl.fromTo(ws, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, stagger: (i: number) => retrasos[i] ?? 0 }, 1.6);
    tl.fromTo($('.baranda'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 1.85);
    tl.fromTo($('.autos'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, 1.4);
    tl.fromTo($('.cab .kicker'), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' }, 0);
    entraTitulo(tl, $.all('.tit .l > span'), 0.12);
    tl.fromTo($('.vision'), { autoAlpha: 0, scale: 0.85, transformOrigin: '0 50%' }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(2)' }, 0.7);

    // 1 · el vecino pide el arreglo: la pérdida en el balcón y Foco avisa
    tl.fromTo($('.grifo'), { autoAlpha: 0, scale: 0, transformOrigin: '50% 100%' }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(2.2)' }, 3.0);
    tl.fromTo($('.gota'), { autoAlpha: 0, scale: 0, transformOrigin: '50% 100%' }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(2.4)' }, 3.2);
    tl.fromTo($('.charco'), { autoAlpha: 0, scaleX: 0.05 }, { autoAlpha: 1, scaleX: 1, duration: 1.6, ease: 'power1.out' }, 3.4);
    tl.fromTo($('.foco'), { autoAlpha: 0, x: -80, scale: 0.8, transformOrigin: '50% 100%' }, { autoAlpha: 1, x: 0, scale: 1, duration: 0.55, ease: 'back.out(1.8)' }, 3.4);
    tl.fromTo($('.b-fuga'), { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(2)' }, 3.8);

    // 2 · el título se achica; Llave llega y suma los materiales en su celular
    tl.to($('.tit'), { scale: 0.5, transformOrigin: '0 0', duration: 0.6, ease: 'power3.inOut' }, 5.4);
    tl.to($('.vision'), { y: -82, duration: 0.6, ease: 'power3.inOut' }, 5.4);
    tl.fromTo($('.llave'), { x: X_LLAVE.fuera }, { x: X_LLAVE.cel, duration: 1.25, ease: 'power2.inOut' }, 5.45);
    tl.fromTo($('.tel-e'), { autoAlpha: 0, scale: 0.12, transformOrigin: '-26% 100%' }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'back.out(1.3)' }, 6.55);
    $.all('.te-mat').forEach((fila, i) => {
      const t0 = 6.95 + i * 0.42;
      tl.fromTo(fila, { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: 0.3, ease: 'power2.out' }, t0);
      toque(tl, fila.querySelector<HTMLElement>('.toque'), t0 + 0.28);
      const hecho = fila.querySelector<HTMLElement>('.hecho');
      if (hecho) tl.fromTo(hecho, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.25, ease: 'back.out(3)' }, t0 + 0.34);
    });
    tl.fromTo($('.te-cta'), { autoAlpha: 0.4, scale: 0.96 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' }, 8.2);

    // 3 · Handyx le muestra stock cerca y lo reserva: la ferretería se ilumina y se dibuja la ruta
    toque(tl, $('.te-cta .toque'), 8.65);
    tl.fromTo($('.te-a'), { xPercent: 0 }, { xPercent: -100, duration: 0.5, ease: 'power3.inOut' }, 8.85);
    tl.fromTo($('.te-b'), { xPercent: 100 }, { xPercent: 0, duration: 0.5, ease: 'power3.inOut' }, 8.85);
    tl.fromTo([$('.m-yo'), $('.m-pin')], { scale: 0 }, { scale: 1, duration: 0.35, ease: 'back.out(3)', stagger: 0.12 }, 9.3);
    tl.fromTo($('.m-ruta'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 9.5);
    tl.fromTo($('.te-tienda'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'back.out(1.6)' }, 9.4);
    tl.fromTo($('.te-stock'), { scale: 0 }, { scale: 1, duration: 0.35, ease: 'back.out(3)' }, STOCK);
    tl.fromTo($('.f-brillo'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35 }, STOCK);
    tl.fromTo($('.f-badge .chip'), { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(2.4)' }, STOCK + 0.05);
    toque(tl, $('.te-res .toque'), RESERVA - 0.2);
    tl.fromTo($('.te-res'), { scale: 1 }, { scale: 0.94, duration: 0.12, yoyo: true, repeat: 1, ease: 'power1.inOut' }, RESERVA - 0.15);
    tl.fromTo($('.te-res .ok'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, RESERVA);
    tl.fromTo($('.caja-f'), { autoAlpha: 0, scale: 0, transformOrigin: '50% 100%' }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2.6)' }, RESERVA + 0.25);
    tl.fromTo($('.ra'), { clipPath: 'inset(0px 0px 0px 100%)' }, { clipPath: 'inset(0px 0px 0px 0%)', duration: 0.6, ease: 'power2.inOut' }, RESERVA + 0.15);
    tl.fromTo($('.mf'), { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(3)' }, RESERVA + 0.7);

    // 4 · el vecino lo ve en su app
    tl.to($('.b-fuga'), { autoAlpha: 0, scale: 0.6, duration: 0.3, ease: 'power2.in' }, 11.85);
    tl.fromTo($('.tel-u'), { autoAlpha: 0, scale: 0.12, transformOrigin: '200% 100%' }, { autoAlpha: 1, scale: 1, duration: 0.65, ease: 'back.out(1.3)' }, 11.95);
    tl.fromTo($('.tu-tit'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' }, 12.45);
    tl.fromTo($('.tu-linea'), { scaleY: 0 }, { scaleY: 1, duration: 0.8, ease: 'power2.inOut' }, 12.6);
    tl.fromTo($.all('.tu-paso'), { autoAlpha: 0, x: 26 }, { autoAlpha: 1, x: 0, duration: 0.3, ease: 'back.out(1.8)', stagger: 0.25 }, 12.6);
    tl.fromTo($('.tu-paso .realce'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 13.0);
    tl.fromTo($('.tu-trans'), { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'back.out(1.6)' }, 13.55);

    // 5 · llega con todo: retira la caja, va al edificio y el arreglo queda listo
    tl.to($('.tel-e'), { autoAlpha: 0, scale: 0.12, duration: 0.45, ease: 'power2.in' }, 14.8);
    tl.to($('.tel-u'), { autoAlpha: 0, scale: 0.12, duration: 0.45, ease: 'power2.in' }, 14.8);
    tl.to($('.llave'), { x: X_LLAVE.ferr, duration: 0.45, ease: 'power2.inOut' }, 14.95);
    tl.to($('.caja-f'), { x: 60, y: -20, autoAlpha: 0, scale: 0.7, duration: 0.25, ease: 'power2.in' }, RETIRA - 0.1);
    tl.fromTo($('.llave .caja'), { autoAlpha: 0, scale: 0, transformOrigin: '50% 100%' }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(2.6)' }, RETIRA);
    tl.to($('.f-brillo'), { autoAlpha: 0, duration: 0.4 }, RETIRA);
    tl.to($('.llave'), { x: X_LLAVE.edif, duration: 1.3, ease: 'power2.inOut' }, 15.7);
    tl.fromTo($('.rb'), { clipPath: 'inset(0px 100% 0px 0px)' }, { clipPath: 'inset(0px 0% 0px 0px)', duration: 1.15, ease: 'power2.inOut' }, 15.75);
    tl.fromTo($('.me'), { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(3)' }, 16.85);
    tl.to($('.llave .caja'), { autoAlpha: 0, scale: 0, duration: 0.3, ease: 'back.in(2)' }, ARREGLO - 0.05);
    tl.to($('.charco'), { autoAlpha: 0, scaleX: 0, duration: 0.5, ease: 'power2.in' }, ARREGLO);
    tl.fromTo($('.b-listo'), { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(2.2)' }, ARREGLO);
    $.all('.chispa').forEach((ch, i) => {
      const a = (i / 12) * Math.PI * 2;
      const r = 80 + (i % 3) * 26;
      const t0 = ARREGLO + (i % 2) * 0.08;
      tl.fromTo(ch, { autoAlpha: 0, x: 0, y: 0, scale: 0.3, rotation: 0 }, { autoAlpha: 1, x: 0, y: 0, scale: 0.3, rotation: 0, duration: 0.05 }, t0);
      tl.to(ch, { x: Math.cos(a) * r, y: Math.sin(a) * r, scale: 1.2, rotation: 180, autoAlpha: 0, duration: 0.9, ease: 'power2.out' }, t0 + 0.05);
    });
    tl.to($('.sol'), { autoAlpha: 0, duration: 0.4 }, ARREGLO + 0.05);
    tl.fromTo($.all('.bn'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'back.out(1.6)', stagger: 0.12 }, ARREGLO + 0.2);

    // Poses, ventanal y estado de la ferretería: dependen del momento (valen también en los saltos)
    const pj = (s: string) => $(`${s} .pj`);
    const pLlave = pj('.llave');
    const pFerr = pj('.ferretero');
    const pGrifo = pj('.grifo');
    const pGota = pj('.gota');
    const pFoco = pj('.foco');
    const ventanal = $('.ed-ventanal');
    const halo = $('.halo');
    const estado = $('.f-badge .txt');
    c.pintor((t) => {
      const camina = CAMINA.some(([a, b]) => t >= a && t < b);
      pose(pLlave, camina ? 'd' : t >= ARREGLO ? 'c' : t >= RESERVA && t < 11.8 ? 'b' : 'a');
      pose(pFerr, t >= RETIRA + 0.2 ? 'c' : (t >= RETIRA - 0.15 && t < RETIRA + 0.2) || (t >= RESERVA && t < 11.8) ? 'd' : (t >= STOCK && t < RESERVA) || (t >= 2.2 && t < 2.8) ? 'b' : 'a');
      pose(pGrifo, t >= ARREGLO ? 'c' : 'd');
      pose(pGota, t >= ARREGLO ? 'c' : 'a');
      pose(pFoco, t >= ARREGLO ? 'c' : (t >= 3.5 && t < 5.4) || (t >= 12.6 && t < 14.8) ? 'b' : 'a');
      ventanal.classList.toggle('fuga', t >= FUGA && t < ARREGLO);
      ventanal.classList.toggle('ok', t >= ARREGLO);
      halo.classList.toggle('ok', t >= ARREGLO);
      estado.textContent = t >= RETIRA ? 'Retirado' : 'En stock';
    });
  },
  ambiente(t, $, tl) {
    const r = refs($);
    r.rayos.style.transform = `rotate(${t * 14}deg)`;
    for (const n of r.nubes) n.el.style.transform = `translateX(${((((n.x - t * n.v) % 2300) + 2300) % 2300) - 250}px) scale(${n.s})`;
    r.lineas.style.transform = `translateX(${-((t * 140) % 130)}px)`;
    for (const a of r.autos) {
      let x = ((((a.o + t * a.v) % 2300) + 2300) % 2300) - 200;
      if (a.dir < 0) x = 1920 - x;
      a.el.style.transform = `translateX(${x}px) scale(${a.dir * 0.72}, 0.72)`;
    }
    for (const w of r.ventanas) w.el.classList.toggle('on', w.on !== (Math.floor(t * 0.6 + w.k * 9) % 7 === 0));
    // Personajes (dueño: el ambiente mueve .cuerpo; la línea de tiempo, el .mov): respiran, Llave camina, festejan saltando
    const salto = (fase: number) => `translateY(${-Math.abs(Math.sin(t * 6 + fase)) * 10}px)`;
    const respira = (fase: number) => `scaleY(${1 + Math.sin(t * 2.4 + fase) * 0.02})`;
    const paso = CAMINA.find(([a, b]) => tl >= a && tl < b);
    if (paso) {
      const f = Math.sin((tl - paso[0]) * 13);
      r.llave.style.transform = `translateY(${-Math.abs(f) * 12}px) rotate(${f * 5}deg) scaleX(${paso[2]})`;
    } else if (tl >= ARREGLO) r.llave.style.transform = salto(0);
    else r.llave.style.transform = `translateY(${Math.sin(t * 3) * 3}px) scaleX(${tl >= 15.4 && tl < 15.7 ? -1 : 1})`;
    r.ferretero.style.transform = tl >= RETIRA + 0.2 ? salto(1.2) : respira(1);
    r.grifo.style.transform = tl >= ARREGLO ? salto(2.1) : tl >= FUGA ? `translateX(${Math.sin(t * 34) * 1.4}px)` : 'none';
    r.gota.style.transform = tl >= ARREGLO ? salto(0.6) : respira(2);
    r.foco.style.transform = tl >= ARREGLO ? salto(1.7) : respira(3);
    // La pérdida: el ventanal late, caen gotas sobre el balcón; con el arreglo, luz verde fija
    const fuga = tl >= FUGA && tl < ARREGLO;
    r.halo.style.opacity = fuga ? String(0.55 + 0.45 * (0.5 + 0.5 * Math.sin(t * 6))) : tl >= ARREGLO ? '1' : '0';
    r.gotitas.forEach((g, i) => {
      const k = (((t + i * 0.37) % 1.1) + 1.1) % 1.1 / 1.1;
      g.style.opacity = fuga && tl >= FUGA + 0.3 && k < 0.85 ? '1' : '0';
      g.style.transform = `translateY(${k * 46}px) scale(${1 - k * 0.3})`;
    });
    // Radar de la ferretería mientras tiene el stock reservado
    r.pings.forEach((p, i) => {
      const k = ((((t - STOCK + i * 0.8) % 1.6) + 1.6) % 1.6) / 1.6;
      p.style.opacity = tl >= STOCK && tl < RETIRA ? String(1 - k) : '0';
      p.style.transform = `scale(${0.4 + k * 2})`;
    });
    // Rutas: los puntos avanzan (A hacia la ferretería, B hacia el edificio)
    r.rutaA.style.backgroundPosition = `${-((t * 30) % 20)}px 50%`;
    r.rutaB.style.backgroundPosition = `${(t * 30) % 20}px 50%`;
    r.pulsos.forEach((p, i) => {
      const k = (t * 0.8 + i * 0.5) % 1;
      p.style.opacity = String(1 - k);
      p.style.transform = `scale(${1 + k * 1.4})`;
    });
  },
});
