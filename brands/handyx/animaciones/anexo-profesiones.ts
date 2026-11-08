// Anexo de respaldo · De 6 a 72 profesiones (ejemplos, no confirmados). Un golpe por clic:
// 0 hoy: las seis profesiones del lanzamiento, cada una con su Handy ·
// 1 ejemplos para el hogar y sus equipos (rótulo «Ejemplos, no confirmados»; Engranaje, la plataforma, se suma) ·
// 2 movilidad y negocios ·
// 3 cuidados: el cuidado de adultos mayores entra con verificación reforzada; la regla (cada profesión entra con demanda
//   y verificación) y el contador llega a la meta de profesiones (objetivo 2027).
// Las profesiones nuevas no están confirmadas ni ordenadas por prioridad: son ejemplos (ver notas).
// La franja y 880–950 queda libre para la leyenda del kit.
import { COLOR, entraTitulo, escena, pose, type Personaje, type Pose } from './comun/kit.ts';

const T1 = 3.0;
const T2 = 6.4;
const T3 = 9.8;
const FIN = 13.4;

// Columna de hoy (3 × 2) y tarjeta de la meta
const HOY: Array<{ pj: Personaje; txt: string; alto: number }> = [
  { pj: 'bombilla', txt: 'Electricidad', alto: 76 },
  { pj: 'gota', txt: 'Plomería', alto: 74 },
  { pj: 'medidor_gas', txt: 'Gas', alto: 74 },
  { pj: 'llave', txt: 'Cerrajería', alto: 72 },
  { pj: 'brocha', txt: 'Albañilería', alto: 76 },
  { pj: 'aire', txt: 'Aire acondicionado', alto: 38 },
];
const TILE = { x0: 96, y0: 300, w: 148, h: 150, gap: 10 };
const tileX = (i: number) => TILE.x0 + (i % 3) * (TILE.w + TILE.gap);
const tileY = (i: number) => TILE.y0 + Math.floor(i / 3) * (TILE.h + TILE.gap);
const META = { x: 96, y: 632, w: 464, h: 150 };

// Ejemplos por categoría (grilla de 2 columnas; negocios ocupa la fila de abajo)
const GRID = { x0: 600, y0: 300, w: 604, h: 150, gap: 16 };
interface Cat { ic: string; t: string; ej: string; paso: number; ancho?: boolean }
const CATS: Cat[] = [
  { ic: 'casa', t: 'Hogar', ej: 'Pintura, limpieza, jardinería, carpintería, herrería, techos y pisos', paso: 1 },
  { ic: 'camara', t: 'Equipos y tecnología', ej: 'Electrodomésticos, cámaras y alarmas, redes y wifi, paneles solares', paso: 1 },
  { ic: 'auto', t: 'Movilidad', ej: 'Mecánica, electricidad del auto, gomería y lavado de autos', paso: 2 },
  { ic: 'tienda', t: 'Para negocios', ej: 'Mozos, bartenders, cocina, limpieza de locales y seguridad', paso: 2 },
  { ic: 'usuarios', t: 'Cuidados y servicios', ej: 'Cuidado de mascotas, fletes y mudanzas, armado de muebles y tapicería', paso: 3, ancho: true },
];
const catX = (i: number) => GRID.x0 + (CATS[i]?.ancho ? 0 : (i % 2) * (GRID.w + GRID.gap));
const catY = (i: number) => GRID.y0 + Math.floor(i / 2) * (GRID.h + GRID.gap);
const catW = (i: number) => (CATS[i]?.ancho ? GRID.w * 2 + GRID.gap : GRID.w);
const MARCA_PASO = [0, T1, T2, T3];
const CUENTA = { t0: T3 + 0.95, dur: 1.5 };

export default escena({
  marcas: [0, T1, T2, T3, FIN],
  leyendas: ['Hoy: **las profesiones del lanzamiento**', 'Ejemplos para **el hogar y sus equipos**', 'Más ejemplos: **movilidad y negocios**', 'Cuidados, **con verificación reforzada**'],
  css: `
    .fondo { position: absolute; inset: 0; background: #EEF0F6; }
    .halo { position: absolute; left: 1100px; top: 560px; width: 1600px; height: 1600px; margin: -800px 0 0 -800px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,.9), rgba(255,255,255,0) 62%); }
    .encabezado { position: absolute; left: 96px; top: 52px; z-index: 9; }
    .encabezado .titulo { margin-top: 10px; font-size: 64px; color: ${COLOR.azulOscuro}; }
    .cab { position: absolute; top: 250px; display: flex; align-items: center; gap: 14px; }
    .cab .k { font-size: 22px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: ${COLOR.azul}; }
    .cab .chip { font-size: 21px; padding: 7px 16px 7px 10px; box-shadow: none; }
    .cab .chip.azul .icono { width: 24px; height: 24px; }
    .cab .chip.ej { background: ${COLOR.amarillo}; color: ${COLOR.noche}; box-shadow: 0 4px 0 #C9971E; }
    .cab .chip.ej .icono { width: 24px; height: 24px; }
    /* hoy: mosaicos con su Handy */
    .tile { position: absolute; width: ${TILE.w}px; height: ${TILE.h}px; padding: 8px 8px 0; border-radius: 24px; background: #fff; box-shadow: 0 6px 0 #D5DCE7, 0 14px 26px rgba(14,29,54,.08); text-align: center; }
    .mosaico { position: relative; height: 88px; border-radius: 18px; background: #E6EAF1; }
    .mosaico .mov { left: 50%; bottom: 4px; }
    .tile b { display: flex; align-items: center; justify-content: center; height: 54px; margin: 0 -8px; font-size: 21px; font-weight: 800; line-height: 1.12; color: ${COLOR.noche}; }
    .visto { position: absolute; right: -6px; top: -6px; width: 32px; height: 32px; border-radius: 50%; background: ${COLOR.azul}; display: grid; place-items: center; box-shadow: 0 0 0 4px #EEF0F6; }
    .visto .icono { width: 20px; height: 20px; }
    .meta { position: absolute; left: ${META.x}px; top: ${META.y}px; width: ${META.w}px; height: ${META.h}px; display: flex; align-items: center; gap: 22px; padding: 0 26px; border-radius: 28px; background: ${COLOR.azul}; box-shadow: 0 8px 0 ${COLOR.azulOscuro}, 0 22px 44px rgba(14,29,54,.22); }
    .meta .n { font-size: 112px; line-height: .9; color: ${COLOR.amarillo}; min-width: 168px; }
    .meta p { font-size: 30px; font-weight: 800; line-height: 1.2; color: #fff; }
    .meta small { display: block; margin-top: 2px; font-size: 22px; font-weight: 700; color: #DCE7F8; }
    .meta .chip { margin-top: 8px; font-size: 20px; padding: 6px 14px; background: ${COLOR.amarillo}; color: ${COLOR.noche}; box-shadow: 0 4px 0 #C9971E; }
    .hueco { position: absolute; border-radius: 26px; border: 3px dashed #C6CFDD; }
    /* ejemplos por categoría */
    .cat { position: absolute; height: ${GRID.h}px; padding: 16px 22px; border-radius: 26px; background: #fff; box-shadow: 0 14px 30px rgba(14,29,54,.08), 0 4px 0 #DCE2EC; }
    .cat .fila { display: flex; align-items: center; gap: 14px; }
    .cat .cuad { flex: none; width: 50px; height: 50px; border-radius: 15px; background: ${COLOR.celeste}; display: grid; place-items: center; }
    .cat .cuad .icono { width: 30px; height: 30px; }
    .cat h3 { font-size: 28px; color: ${COLOR.azulOscuro}; }
    .cat p { margin-top: 10px; font-size: 22px; font-weight: 600; line-height: 1.25; color: ${COLOR.texto}; }
    .cat p.ad { display: flex; align-items: center; flex-wrap: wrap; gap: 4px 12px; margin-top: 8px; }
    .cat p.ad + p { margin-top: 4px; }
    .cat p b { font-weight: 800; color: ${COLOR.noche}; }
    .refuerzo { display: inline-flex; align-items: center; gap: 8px; padding: 4px 12px 4px 6px; border-radius: 999px; background: #E2F4EA; color: #136B3A; font-size: 20px; font-weight: 800; white-space: nowrap; }
    .refuerzo .icono { width: 24px; height: 24px; }
    .cat.ancho { display: flex; align-items: center; gap: 28px; }
    .cat.ancho .fila { flex: none; width: 430px; }
    .cat.ancho .cuerpo { flex: 1; }
    .cat.ancho p.ad { margin-top: 0; }
    .cat.ancho p.ad b { font-size: 27px; color: ${COLOR.azulOscuro}; }
    .cat.ancho p.ad + p { margin-top: 6px; }
    .regla { position: absolute; left: ${GRID.x0}px; top: 796px; width: ${GRID.w * 2 + GRID.gap}px; display: flex; align-items: center; gap: 12px; font-size: 22px; font-weight: 600; color: ${COLOR.suave}; }
    .regla .icono { width: 28px; height: 28px; }
    .regla b { color: ${COLOR.azulOscuro}; font-weight: 800; }
    /* Handys: el contenedor .mov lo mueve la línea de tiempo; el .pj de adentro respira (ambiente) */
    .mov { position: absolute; transform-origin: 50% 100%; }
    .pj { transform-origin: 50% 100%; }
    .h-eng { left: ${GRID.x0 + GRID.w * 2 + GRID.gap - 150}px; top: ${GRID.y0 - 108}px; width: 112px; height: 112px; z-index: 6; }
  `,
  html: (c) => {
    const tiles = HOY.map(
      (h, i) => `<div class="tile t${i}" style="left:${tileX(i)}px;top:${tileY(i)}px"><div class="mosaico"><div class="mov" style="width:${h.alto}px;height:${h.alto}px;margin-left:-${h.alto / 2}px">${c.pj(h.pj, '', h.alto)}</div></div><b>${h.txt}</b><span class="visto">${c.icono('tilde-circulo', 'blanco')}</span></div>`,
    ).join('');
    const cats = CATS.map((k, i) => {
      const cuerpo =
        k.ancho
          ? `<div class="cuerpo"><p class="ad"><b>Cuidado de adultos mayores</b><span class="refuerzo">${c.icono('escudo-ok')}Verificación reforzada</span></p><p>${k.ej}</p></div>`
          : `<p>${k.ej}</p>`;
      return `<div class="cat k${i} ${k.ancho ? 'ancho' : ''}" style="left:${catX(i)}px;top:${catY(i)}px;width:${catW(i)}px"><div class="fila"><span class="cuad">${c.icono(k.ic)}</span><h3 class="t">${k.t}</h3></div>${cuerpo}</div>`;
    }).join('');
    const huecos = CATS.map((_, i) => `<i class="hueco hc${i}" style="left:${catX(i)}px;top:${catY(i)}px;width:${catW(i)}px;height:${GRID.h}px"></i>`).join('');
    return `
    <div class="fondo"></div><div class="halo"></div>
    <div class="cab cab-hoy" style="left:96px"><span class="chip azul">${c.icono('tilde-circulo', 'blanco')}Hoy</span><span class="k">Lanzamiento</span></div>
    ${tiles}
    <i class="hueco hm" style="left:${META.x}px;top:${META.y}px;width:${META.w}px;height:${META.h}px"></i>
    <div class="meta"><span class="n t">${c.cifra('PROFESIONES-INICIALES')}</span><div><p>profesiones</p><div class="fin"><small>a fines de 2027</small><span class="chip">Objetivo</span></div></div></div>
    ${huecos}
    <div class="cab cab-ej" style="left:${GRID.x0}px"><span class="k">Próximas posibles</span><span class="chip ej">${c.icono('pregunta')}Ejemplos, no confirmados</span></div>
    ${cats}
    <div class="regla">${c.icono('escudo-ok')}<span>Cada profesión entra cuando hay <b>demanda</b> y podemos <b>verificar</b> a sus profesionales.</span></div>
    <div class="mov h-eng">${c.pj('engranaje', '', 112)}</div>
    <div class="encabezado"><div class="kicker">Respaldo · crecimiento</div><div class="titulo t"><span class="l"><span>De ${c.cifra('PROFESIONES-INICIALES')} a ${c.cifra('META-PROFESIONES')} <mark>profesiones</mark></span></span></div></div>
  `;
  },
  armar(tl, $, c) {
    const tiles = $.all('.tile');
    const cats = $.all('.cat');
    tl.set([...cats, $('.cab-ej'), $('.meta'), $('.regla'), $('.h-eng')], { autoAlpha: 0 }, 0);

    // 0 · hoy: las seis profesiones, cada una con su Handy
    tl.fromTo($('.halo'), { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 1.2, ease: 'power2.out' }, 0);
    tl.fromTo($('.encabezado .kicker'), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0);
    entraTitulo(tl, $.all('.encabezado .l > span'), 0.1);
    tl.fromTo($('.cab-hoy'), { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: 'power3.out' }, 0.35);
    tl.fromTo(tiles, { autoAlpha: 0, y: 40, scale: 0.8 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(2)', stagger: 0.1 }, 0.5);
    tl.fromTo($.all('.visto'), { scale: 0 }, { scale: 1, duration: 0.3, ease: 'back.out(3)', stagger: 0.1 }, 0.85);
    tl.fromTo($.all('.hueco'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, stagger: 0.06 }, 1.5);

    // 1 · ejemplos: hogar y equipos (con el rótulo); Engranaje se suma
    tl.fromTo($('.cab-ej'), { autoAlpha: 0, y: -12 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out', immediateRender: false }, T1 + 0.1);
    tl.fromTo($('.cab-ej .chip'), { scale: 0.5, rotation: -6 }, { scale: 1, rotation: 0, duration: 0.45, ease: 'back.out(2.6)' }, T1 + 0.3);
    cats.forEach((k, i) => {
      const paso = CATS[i]?.paso ?? 1;
      const orden = CATS.slice(0, i).filter((x) => x.paso === paso).length;
      const t = (MARCA_PASO[paso] ?? 0) + 0.45 + orden * 0.3;
      tl.to($(`.hc${i}`), { autoAlpha: 0, duration: 0.25 }, t);
      tl.fromTo(k, { autoAlpha: 0, y: 36, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.7)', immediateRender: false }, t);
      tl.fromTo(k.querySelectorAll('p'), { autoAlpha: 0, x: -16 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: 'power3.out', stagger: 0.12 }, t + 0.25);
    });
    tl.fromTo($('.h-eng'), { autoAlpha: 0, y: -70 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'bounce.out', immediateRender: false }, T1 + 1.0);

    // 3 · cuidados (adultos mayores con verificación reforzada), la regla y la meta
    tl.fromTo($('.refuerzo'), { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(2.6)' }, T3 + 1.0);
    tl.fromTo($('.cat.k4'), { boxShadow: '0 14px 30px rgba(14,29,54,.08), 0 4px 0 #DCE2EC, 0 0 0 0px rgba(30,158,87,0)' }, { boxShadow: '0 14px 30px rgba(14,29,54,.08), 0 4px 0 #DCE2EC, 0 0 0 5px rgba(30,158,87,.5)', duration: 0.35, yoyo: true, repeat: 1, ease: 'power2.out' }, T3 + 1.15);
    tl.fromTo($('.regla'), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out', immediateRender: false }, T3 + 1.6);
    tl.to($('.hm'), { autoAlpha: 0, duration: 0.25 }, T3 + 0.8);
    tl.fromTo($('.meta'), { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(1.8)', immediateRender: false }, T3 + 0.8);
    c.contador($('.meta .n'), { t0: CUENTA.t0, dur: CUENTA.dur, desde: c.valor('PROFESIONES-INICIALES') ?? 0, hasta: c.valor('META-PROFESIONES') ?? 0 });
    tl.fromTo($('.meta small'), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power3.out' }, CUENTA.t0 + CUENTA.dur - 0.15);
    tl.fromTo($('.meta .chip'), { autoAlpha: 0, scale: 0.4, rotation: -8 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.4, ease: 'back.out(2.6)' }, CUENTA.t0 + CUENTA.dur);

    // Poses (valen también en los saltos)
    const hoy = $.all('.tile .pj');
    const eng = $('.h-eng .pj');
    const fiesta = CUENTA.t0 + CUENTA.dur;
    c.pintor((t) => {
      hoy.forEach((p, i) => pose(p, t >= fiesta ? 'c' : t >= T1 ? 'a' : t >= 0.95 + i * 0.1 ? 'b' : 'a'));
      const e: Pose = t >= fiesta ? 'c' : t >= T1 + 1.5 ? 'd' : 'b';
      pose(eng, e);
    });
  },
  ambiente(t, $) {
    $.all('.mov .pj').forEach((p, i) => (p.style.transform = `scaleY(${(1 + Math.sin(t * 2.4 + i) * 0.02).toFixed(4)})`));
  },
});
