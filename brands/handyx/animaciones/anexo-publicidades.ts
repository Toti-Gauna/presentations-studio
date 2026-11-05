// Anexo de respaldo · Publicidades. Un golpe por clic:
// 0 Las piezas que ya tenemos: cuatro cuadros de los trailers (dos para vecinos, dos para profesionales), como videos ·
// 1 Entran en el celular y en cualquier pantalla: un cuadro vuela al anuncio del celular y otro al monitor; segmentadas por
//   barrio y por urgencia, en redes sociales y buscadores (sin logos de terceros) ·
// 2 La próxima tanda, hecha con IA (Seedance 2.5), como plan: se escribe la idea y se arman tres tomas de ejemplo con los Handys.
// Los cuadros de los trailers no muestran la tarifa anterior; antes de pautarlos se renderizan con el modelo vigente (notas).
// La franja y 880–950 queda libre para la leyenda del kit.
import { COLOR, entraTitulo, escena, pose, type Personaje, type Pose } from './comun/kit.ts';

const M = [0, 3.6, 7.2, 11.0];
const GRIS = '#CFCFCF'; // fondo de los cuadros: el monitor lo usa para que el recuadro no se note

// Paso 0 · las cuatro piezas (4:3), dos por público
const PIEZAS = [
  { img: 'publicidades/usuario-urgencia-programado-obra.webp', alt: 'Publicidad: urgencia, programado u obra' },
  { img: 'publicidades/usuario-tu-telefono.webp', alt: 'Publicidad: tu teléfono no se comparte' },
  { img: 'publicidades/especialista-presupuestas-esperas.webp', alt: 'Publicidad: presupuestás y esperás' },
  { img: 'publicidades/especialista-tu-agenda.webp', alt: 'Publicidad: tu agenda en orden' },
];
const CARTA = { w: 392, h: 299, y: 318, borde: 10 }; // imagen interior 372 × 279 (4:3)
const CARTA_X = [120, 536, 992, 1408];

// Paso 1 · dispositivos. Los cuadros 0 y 3 vuelan hasta el lugar exacto de su imagen en cada pantalla.
const TEL = { x: 470, y: 282, w: 250, h: 530, pad: 10, feed: 44, cab: 54 };
const MEDIA = { x: TEL.x + TEL.pad, y: TEL.y + TEL.pad + TEL.feed + TEL.cab, w: TEL.w - TEL.pad * 2 };
const MON = { x: 776, y: 296, w: 744, bisel: 12 };
const PANT = { x: MON.x + MON.bisel, y: MON.y + MON.bisel, w: MON.w - MON.bisel * 2, h: ((MON.w - MON.bisel * 2) * 9) / 16 };
const VUELOS = [
  { i: 0, x: MEDIA.x, y: MEDIA.y, s: MEDIA.w / (CARTA.w - CARTA.borde * 2) },
  { i: 3, x: PANT.x + (PANT.w - (PANT.h * 4) / 3) / 2, y: PANT.y, s: (PANT.h * 4) / 3 / (CARTA.w - CARTA.borde * 2) },
];
const T_VUELO = 3.7;
// En el paso 0, Foco y Llave quedan debajo de su grupo; en el 1 caminan a los costados (x relativa a su lugar final)
const CENTRO = { foco: 524 - 255, llave: 1400 - 1687 };
const CAMINA = [M[1]!, M[1]! + 0.5];

// Paso 2 · la próxima tanda (tomas de ejemplo armadas con los Handys)
const TOMAS: Array<{ fondo: string; pjs: Array<{ n: Personaje; p: Pose; alto: number; x: number }> }> = [
  { fondo: COLOR.azulOscuro, pjs: [{ n: 'grifo', p: 'd', alto: 150, x: 92 }] },
  { fondo: COLOR.azul, pjs: [{ n: 'gota', p: 'd', alto: 138, x: 100 }] },
  { fondo: COLOR.amarillo, pjs: [{ n: 'gota', p: 'c', alto: 118, x: 52 }, { n: 'bombilla', p: 'c', alto: 150, x: 176 }] },
];
const T_TOMA = [9.05, 9.45, 9.85];
const IDEA = 'Gota ayuda a un vecino con una pérdida en la cocina';

const GL = {
  corazon: 'M12 20s-7.2-4.4-7.2-9.7A4.1 4.1 0 0 1 12 8.1a4.1 4.1 0 0 1 7.2 2.2C19.2 15.6 12 20 12 20z',
  chat: 'M4.5 6.6A2.6 2.6 0 0 1 7.1 4h9.8a2.6 2.6 0 0 1 2.6 2.6v6.6a2.6 2.6 0 0 1-2.6 2.6H11l-4.4 3.7v-3.7A2.6 2.6 0 0 1 4.5 13.2z',
  enviar: 'M20.5 3.5 3.5 10.6l6.8 2.6 2.6 6.8zM10.3 13.2l4.6-4.6',
  play: 'M8.5 5.6v12.8l10-6.4z',
  lupa: 'M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.3 15.3 20 20',
};
const glifo = (d: string, cls = '') => `<svg class="gl ${cls}" viewBox="0 0 24 24"><path d="${d}"/></svg>`;
// Claqueta (dibujo propio): la tapa gira sobre su bisagra
const CLAQUETA = `<svg class="claqueta" viewBox="0 0 48 48"><rect x="6" y="18" width="36" height="24" rx="4" fill="${COLOR.azulOscuro}"/><path d="M12 24h24M12 30h16" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".55"/><g class="tapa"><rect x="6" y="9" width="36" height="8" rx="2.5" fill="${COLOR.azulOscuro}"/><path d="M13 9l-4 8M22 9l-4 8M31 9l-4 8M40 9l-4 8" stroke="${COLOR.amarillo}" stroke-width="3"/></g></svg>`;

export default escena({
  marcas: M,
  leyendas: ['Ya tenemos piezas para **vecinos y profesionales**', 'En **el celular y en cualquier pantalla**', 'Lo que viene: **publicidades hechas con IA**'],
  css: `
    .fondo { position: absolute; inset: 0; background: ${COLOR.hueso}; }
    .halo { position: absolute; left: 960px; top: 540px; width: 1500px; height: 1000px; margin: -500px 0 0 -750px; border-radius: 50%; background: radial-gradient(closest-side, rgba(255,255,255,.95), rgba(255,255,255,0)); }
    .encabezado { position: absolute; left: 96px; top: 52px; }
    .encabezado .titulo { margin-top: 10px; font-size: 64px; color: ${COLOR.azulOscuro}; }
    .esc { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
    .mov { position: absolute; transform-origin: 50% 100%; }
    .pj { transform-origin: 50% 100%; }
    .foco { left: 150px; top: 640px; width: 210px; height: 210px; }
    .llave { left: 1592px; top: 660px; width: 190px; height: 190px; }

    /* 0 · las piezas */
    .grupo { position: absolute; top: 266px; display: flex; align-items: center; gap: 12px; font-weight: 800; font-size: 24px; letter-spacing: .08em; text-transform: uppercase; color: ${COLOR.azulOscuro}; }
    .grupo i { width: 14px; height: 14px; border-radius: 50%; background: ${COLOR.amarillo}; box-shadow: 0 0 0 5px rgba(255,201,60,.28); }
    .carta { position: absolute; top: ${CARTA.y}px; width: ${CARTA.w}px; height: ${CARTA.h}px; padding: ${CARTA.borde}px; border-radius: 22px; background: #fff; box-shadow: 0 18px 36px rgba(14,29,54,.13), 0 4px 0 #DCE2EC; transform-origin: 0 0; }
    .carta .img { position: relative; width: 100%; height: 100%; border-radius: 14px; overflow: hidden; background: ${GRIS}; }
    .carta img { display: block; width: 100%; height: 100%; }
    .reprod { position: absolute; left: 14px; bottom: 16px; width: 48px; height: 48px; border-radius: 50%; background: #fff; display: grid; place-items: center; box-shadow: 0 6px 14px rgba(14,29,54,.2); }
    .reprod .gl { width: 24px; height: 24px; fill: ${COLOR.azul}; stroke: ${COLOR.azul}; }
    .barra-v { position: absolute; left: 74px; right: 16px; bottom: 37px; height: 6px; border-radius: 3px; background: rgba(14,29,54,.14); overflow: hidden; }
    .barra-v i { position: absolute; left: 0; top: 0; bottom: 0; width: 100%; border-radius: 3px; background: ${COLOR.azul}; transform-origin: 0 50%; }
    .nota { position: absolute; left: 960px; top: 650px; width: 0; display: flex; justify-content: center; }
    .nota span { white-space: nowrap; padding: 8px 18px; border-radius: 999px; background: #fff; font-size: 21px; font-weight: 700; color: ${COLOR.suave}; box-shadow: 0 6px 16px rgba(14,29,54,.08); }

    /* 1 · pantallas */
    .tel { width: ${TEL.w}px; height: ${TEL.h}px; border-radius: 42px; padding: ${TEL.pad}px; box-shadow: 0 30px 60px rgba(14,29,54,.24), 0 0 0 2px rgba(255,255,255,.06); }
    .tel .pantalla { border-radius: 33px; background: #fff; }
    .tel .isla { width: 78px; height: 22px; margin-left: -39px; top: 10px; }
    .telP { left: ${TEL.x}px; top: ${TEL.y}px; width: ${TEL.w}px; height: ${TEL.h}px; }
    .feed { position: absolute; left: 0; top: ${TEL.feed}px; width: ${MEDIA.w}px; }
    .post-cab { display: flex; align-items: center; gap: 8px; height: ${TEL.cab}px; padding: 0 10px; }
    .avatar { position: relative; flex: none; width: 38px; height: 38px; border-radius: 50%; background: ${COLOR.celeste}; overflow: hidden; }
    .avatar .pj { left: 3px; top: 3px; }
    .post-cab b { display: block; font-size: 20px; line-height: 1.05; font-weight: 800; color: ${COLOR.noche}; }
    .post-cab span { display: block; font-size: 20px; line-height: 1.05; font-weight: 600; color: ${COLOR.suave}; }
    .media { display: block; width: ${MEDIA.w}px; height: ${(MEDIA.w * 3) / 4}px; background: ${GRIS}; }
    .acciones { display: flex; gap: 14px; padding: 10px 12px 4px; }
    .gl { width: 28px; height: 28px; display: block; fill: none; stroke: ${COLOR.noche}; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .acciones .gl.lleno { fill: ${COLOR.azul}; stroke: ${COLOR.azul}; }
    .esq { height: 12px; border-radius: 6px; background: #E6EAF1; margin: 9px 12px 0; }
    .esq.corta { width: 120px; }
    .monitor { position: absolute; left: ${MON.x}px; top: ${MON.y}px; width: ${MON.w}px; padding: ${MON.bisel}px; border-radius: 22px; background: #0A1528; box-shadow: 0 30px 60px rgba(14,29,54,.24); transform-origin: 50% 100%; }
    .monitor .pant { position: relative; width: ${PANT.w}px; height: ${PANT.h}px; border-radius: 12px; background: ${GRIS}; overflow: hidden; }
    .monitor .pant img { position: absolute; left: ${(PANT.w - (PANT.h * 4) / 3) / 2}px; top: 0; width: ${(PANT.h * 4) / 3}px; height: ${PANT.h}px; }
    .monitor .barra-v { left: 70px; right: 20px; bottom: 26px; }
    .monitor .reprod { left: 16px; bottom: 6px; }
    .pie { position: absolute; left: ${MON.x + MON.w / 2 - 34}px; top: ${MON.y + PANT.h + MON.bisel * 2}px; width: 68px; height: 48px; background: #1B2740; }
    .base { position: absolute; left: ${MON.x + MON.w / 2 - 120}px; top: ${MON.y + PANT.h + MON.bisel * 2 + 48}px; width: 240px; height: 14px; border-radius: 7px; background: #1B2740; }
    .segm { position: absolute; left: 96px; top: 330px; display: flex; flex-direction: column; align-items: flex-start; gap: 18px; }
    .segm .k { font-weight: 800; font-size: 22px; letter-spacing: .08em; text-transform: uppercase; color: ${COLOR.azul}; }
    .segm .chip { font-size: 24px; padding: 12px 22px 12px 16px; color: ${COLOR.noche}; }
    .segm .chip .icono, .segm .chip .gl { width: 30px; height: 30px; }
    .segm .chip .gl { stroke: ${COLOR.azul}; }

    /* 2 · la próxima tanda */
    .panel { position: absolute; left: 392px; top: 262px; width: 1136px; height: 490px; padding: 30px 40px; }
    .panel .cab { display: flex; align-items: center; gap: 16px; }
    .claqueta { width: 56px; height: 56px; display: block; overflow: visible; }
    .claqueta .tapa { transform-origin: 7px 17px; transform-box: view-box; }
    .panel .cab h3 { font-family: var(--fuente-titulos, sans-serif); font-weight: 900; font-stretch: 112%; font-size: 38px; color: ${COLOR.azulOscuro}; }
    .panel .cab .chips { margin-left: auto; display: flex; gap: 12px; }
    .panel .chip { font-size: 21px; padding: 8px 18px 8px 12px; box-shadow: none; }
    .chip.ia { background: ${COLOR.amarillo}; color: ${COLOR.noche}; }
    .chip.ia .icono { width: 26px; height: 26px; }
    .chip.plan { background: #fff; border: 3px solid ${COLOR.azulOscuro}; color: ${COLOR.azulOscuro}; padding: 5px 16px; letter-spacing: .04em; text-transform: uppercase; font-size: 20px; }
    .idea { display: flex; align-items: center; gap: 14px; height: 70px; margin-top: 24px; padding: 0 26px; border-radius: 999px; background: #F2F4F8; box-shadow: inset 0 0 0 2px #E3E8F2; font-size: 27px; font-weight: 600; color: ${COLOR.noche}; }
    .idea .icono { width: 32px; height: 32px; flex: none; }
    .idea .cursor { width: 3px; height: 32px; border-radius: 2px; background: ${COLOR.azul}; margin-left: -8px; }
    .idea .tipo { flex: none; font-size: 20px; font-weight: 700; color: ${COLOR.suave}; margin-right: 4px; }
    .tomas { display: flex; gap: 28px; margin-top: 28px; }
    .toma { position: relative; width: 332px; height: 187px; border-radius: 18px; overflow: hidden; background: #E6EAF1; }
    .toma .brillo { position: absolute; top: 0; bottom: 0; left: 0; width: 120px; background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.75), rgba(255,255,255,0)); }
    .toma .lista { position: absolute; inset: 0; }
    .toma .sol { position: absolute; right: -40px; top: -40px; width: 150px; height: 150px; border-radius: 50%; background: rgba(255,255,255,.14); }
    .toma .piso { position: absolute; left: 0; right: 0; bottom: 0; height: 26px; background: rgba(14,29,54,.16); }
    .panel .pie-p { display: flex; align-items: center; justify-content: center; gap: 16px; margin-top: 22px; font-size: 21px; font-weight: 600; color: ${COLOR.suave}; }
  `,
  html: (c) => {
    const handy = (cls: string, nombre: Personaje, alto: number) => `<div class="mov ${cls}">${c.pj(nombre, '', alto)}<div class="sombra-pj"></div></div>`;
    const video = (img: string, alt: string) => `<div class="img">${c.img(img, '', alt)}<span class="reprod">${glifo(GL.play)}</span><span class="barra-v"><i></i></span></div>`;
    const cartas = PIEZAS.map((p, i) => `<div class="carta c${i}" style="left:${CARTA_X[i]}px">${video(p.img, p.alt)}</div>`).join('');
    const tomas = TOMAS.map(
      (tm, i) =>
        `<div class="toma t${i}"><i class="brillo"></i><div class="lista" style="background:${tm.fondo}"><i class="sol"></i><i class="piso"></i>${tm.pjs
          .map((p) => `<div class="pj-t" style="position:absolute;left:${p.x}px;top:${187 - 14 - p.alto}px;width:${p.alto}px;height:${p.alto}px">${c.pj(p.n, `p-${p.p}`, p.alto)}</div>`)
          .join('')}</div></div>`,
    ).join('');
    return `
    <div class="fondo"></div><div class="halo"></div>

    <div class="esc e0">
      <div class="grupo" style="left:${CARTA_X[0]}px"><i></i>Para vecinos</div>
      <div class="grupo" style="left:${CARTA_X[2]}px"><i></i>Para profesionales</div>
      <div class="nota"><span>Cuadros de nuestros trailers · datos ficticios</span></div>
    </div>

    <div class="esc e1">
      <div class="segm"><span class="k">Segmentadas</span>
        <span class="chip">${glifo(GL.lupa)}Redes y buscadores</span>
        <span class="chip">${c.icono('ubicacion')}Por barrio</span>
        <span class="chip">${c.icono('reloj')}Por urgencia</span></div>
      <div class="pie"></div><div class="base"></div>
      <div class="monitor"><div class="pant">${c.img(PIEZAS[3]!.img, '', PIEZAS[3]!.alt)}<span class="reprod">${glifo(GL.play)}</span><span class="barra-v"><i></i></span></div></div>
      <div class="mov telP">${c.celular(`<div class="feed">
        <div class="post-cab"><span class="avatar">${c.pj('bombilla', '', 32)}</span><div><b>Handyx</b><span>Publicidad</span></div></div>
        ${c.img(PIEZAS[0]!.img, 'media', PIEZAS[0]!.alt)}
        <div class="acciones">${glifo(GL.corazon, 'like')}${glifo(GL.chat)}${glifo(GL.enviar)}</div>
        <div class="esq"></div><div class="esq corta"></div><div class="esq"></div>
        <div class="post-cab" style="margin-top:12px"><span class="avatar">${c.pj('bombilla', '', 32)}</span><div><b>Handyx</b><span>Publicidad</span></div></div>
        ${c.img(PIEZAS[2]!.img, 'media', PIEZAS[2]!.alt)}
      </div>`, 'tel')}</div>
    </div>

    ${cartas}

    <div class="esc e2">
      <div class="tarjeta panel">
        <div class="cab">${CLAQUETA}<h3>La próxima tanda</h3><div class="chips"><span class="chip ia">${c.icono('sparkles')}Hecha con IA · Seedance 2.5</span></div></div>
        <div class="idea">${c.icono('ia')}<span class="tipo">Idea:</span><span class="txt"></span><i class="cursor"></i></div>
        <div class="tomas">${tomas}</div>
        <div class="pie-p"><span class="chip plan">Plan propuesto · a validar</span><span>Tomas de ejemplo, armadas con los Handys</span></div>
      </div>
    </div>

    ${handy('foco', 'bombilla', 210)}
    ${handy('llave', 'llave', 190)}

    <div class="encabezado"><div class="kicker">Respaldo · marketing</div>
      <div class="titulo t"><span class="l"><span>Publicidades <mark>para cada pantalla</mark></span></span></div></div>
  `;
  },
  armar(tl, $, c) {
    // 0 · encabezado y las cuatro piezas, agrupadas por público
    tl.fromTo($('.halo'), { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 1.2, ease: 'power2.out' }, 0);
    tl.fromTo($('.encabezado .kicker'), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0);
    entraTitulo(tl, $.all('.encabezado .l > span'), 0.1);
    tl.fromTo($.all('.grupo'), { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: 'power3.out', stagger: 0.5 }, 0.45);
    $.all('.carta').forEach((el, i) =>
      tl.fromTo(el, { autoAlpha: 0, y: 50, rotation: i % 2 ? 3 : -3 }, { autoAlpha: 1, y: 0, rotation: 0, duration: 0.6, ease: 'back.out(1.5)' }, 0.55 + i * 0.16 + (i >= 2 ? 0.2 : 0)),
    );
    tl.fromTo($('.nota'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' }, 1.9);
    tl.fromTo($('.foco'), { autoAlpha: 0, x: CENTRO.foco, y: 70, scale: 0.7 }, { autoAlpha: 1, x: CENTRO.foco, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.8)' }, 0.75);
    tl.fromTo($('.llave'), { autoAlpha: 0, x: CENTRO.llave, y: 70, scale: 0.7 }, { autoAlpha: 1, x: CENTRO.llave, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.8)' }, 1.25);

    // 1 · las piezas entran en las pantallas: dos vuelan hasta su lugar exacto, las otras se van
    tl.to([...$.all('.grupo'), $('.nota')], { autoAlpha: 0, y: -14, duration: 0.3, ease: 'power2.in' }, M[1]);
    // Foco y Llave dejan el centro libre para las pantallas (caminan hacia los costados)
    tl.to($('.foco'), { x: 0, duration: 0.5, ease: 'power2.inOut' }, M[1]);
    tl.to($('.llave'), { x: 0, duration: 0.5, ease: 'power2.inOut' }, M[1]);
    tl.to([$('.c1'), $('.c2')], { autoAlpha: 0, scale: 0.9, y: 30, transformOrigin: '50% 50%', duration: 0.25, ease: 'power2.in' }, M[1]);
    for (const v of VUELOS) {
      const el = $(`.c${v.i}`);
      // la carta escala desde su esquina: la imagen cae justo sobre la de la pantalla; el borde blanco se desvanece al llegar
      tl.to(el, { x: v.x - CARTA_X[v.i]! - CARTA.borde * v.s, y: v.y - CARTA.y - CARTA.borde * v.s, scale: v.s, duration: 0.65, ease: 'power3.inOut' }, T_VUELO);
      tl.to(el, { autoAlpha: 0, duration: 0.2, ease: 'power1.in' }, T_VUELO + 0.66);
    }
    // Las pantallas aparecen vacías mientras vuelan los cuadros; su imagen se enciende justo cuando el cuadro aterriza encima
    tl.fromTo($('.telP'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' }, T_VUELO + 0.2);
    tl.fromTo([$('.monitor'), $('.pie'), $('.base')], { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' }, T_VUELO + 0.22);
    tl.fromTo([$('.telP .media'), $('.monitor .pant img')], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, T_VUELO + 0.65);
    tl.fromTo($('.segm .k'), { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.35 }, 4.55);
    tl.fromTo($.all('.segm .chip'), { autoAlpha: 0, x: -30, scale: 0.9 }, { autoAlpha: 1, x: 0, scale: 1, duration: 0.4, ease: 'back.out(2)', stagger: 0.15 }, 4.65);
    tl.fromTo($('.like'), { scale: 1 }, { scale: 1.35, duration: 0.16, yoyo: true, repeat: 1, ease: 'power2.out', transformOrigin: '50% 50%' }, 5.6);
    tl.to($('.e1'), { autoAlpha: 0, y: 40, duration: 0.35, ease: 'power2.in' }, M[2]);

    // 2 · la próxima tanda, hecha con IA: la idea se escribe y las tomas se arman de a una
    tl.fromTo($('.panel'), { autoAlpha: 0, y: 40, scale: 0.97 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.4)' }, 7.62);
    tl.fromTo($('.claqueta .tapa'), { rotation: -28 }, { rotation: 0, duration: 0.22, ease: 'power4.in' }, 8.1);
    tl.fromTo($('.panel .chips .chip'), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2.2)' }, 7.9);
    tl.fromTo($.all('.toma'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out', stagger: 0.1 }, 8.1);
    c.escribir($('.idea .txt'), IDEA, 8.15, 0.85);
    T_TOMA.forEach((t, i) => tl.fromTo($(`.t${i} .lista`), { autoAlpha: 0, scale: 1.06 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'power2.out' }, t));
    tl.fromTo($('.pie-p'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 10.1);

    // Handys: saludan a su público, siguen las pantallas y festejan las tomas
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
    const like = $('.like');
    // (los cambios de paso van 0,05 s después de cada marca: la página exportada de un paso termina justo en la marca siguiente)
    const TF: Array<[number, Pose]> = [[0, 'a'], [1.0, 'b'], [2.4, 'c'], [M[1]! + 0.05, 'd'], [CAMINA[1]!, 'a'], [4.7, 'b'], [5.7, 'c'], [M[2]! + 0.05, 'a'], [8.15, 'd'], [9.9, 'c']];
    const TL: Array<[number, Pose]> = [[0, 'a'], [1.5, 'b'], [2.6, 'c'], [M[1]! + 0.05, 'd'], [CAMINA[1]!, 'a'], [4.5, 'b'], [5.9, 'c'], [M[2]! + 0.05, 'a'], [8.4, 'b'], [10.0, 'c']];
    const en = (tabla: Array<[number, Pose]>, t: number): Pose => tabla.filter(([d]) => t >= d).pop()?.[1] ?? 'a';
    const tomasPj = $.all('.toma .pj').map((el) => ({ f: poser(el), p: (/p-([abcd])/.exec(el.className)?.[1] ?? 'a') as Pose }));
    c.pintor((t) => {
      foco(en(TF, t));
      llave(en(TL, t));
      like.classList.toggle('lleno', t >= 5.65);
      for (const x of tomasPj) x.f(x.p);
    });
  },
  ambiente(t, $, tl) {
    // Respiración; mientras caminan, Foco y Llave rebotan (dueño: el ambiente; la línea de tiempo mueve el contenedor)
    $.all('.pj').forEach((p, i) => {
      const camina = (p.parentElement?.classList.contains('foco') || p.parentElement?.classList.contains('llave')) && tl > CAMINA[0]! && tl < CAMINA[1]!;
      if (camina) {
        const f = Math.sin((tl - CAMINA[0]!) * 18);
        p.style.transform = `translateY(${(-Math.abs(f) * 12).toFixed(1)}px) rotate(${(f * 5).toFixed(1)}deg)`;
      } else p.style.transform = `scaleY(${(1 + Math.sin(t * 2.4 + i) * 0.02).toFixed(4)})`;
    });
    // Videos que avanzan (dueño: el ambiente)
    $.all('.barra-v i').forEach((b, i) => (b.style.transform = `scaleX(${(((t * 0.11 + i * 0.27) % 1) * 0.92 + 0.08).toFixed(3)})`));
    // Brillo de las tomas mientras se arman; el cursor parpadea mientras se escribe la idea
    $.all('.toma .brillo').forEach((b, i) => (b.style.transform = `translateX(${(((t * 0.9 + i * 0.3) % 1.4) * 420 - 120).toFixed(1)}px)`));
    $('.idea .cursor').style.opacity = tl > 7.9 && tl < 9.2 && Math.floor(t * 2.6) % 2 === 0 ? '1' : '0';
  },
});
