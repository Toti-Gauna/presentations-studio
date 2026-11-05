// Anexo de respaldo · Roadmap: del lanzamiento a fines de 2027 en una línea de tiempo liviana. Un golpe por paso:
// 0 el lanzamiento (la app, las profesiones de arranque y la tarifa visible antes de contratar) · 1 el primer trimestre:
// HandIA premium y para profesionales, toda Buenos Aires · 2 una región por trimestre hasta la meta de profesiones ·
// 3 la visión: toda Argentina. Hitos equiespaciados (el eje no es proporcional al tiempo: cada hito lleva su período abajo).
// Los Handys se suman al equipo sobre la línea en cada hito y festejan al final. Sin mapa ni detalle por región (eso es
// x-trimestres). La franja y 880–950 queda libre para la leyenda del kit.
import { COLOR, entraTitulo, escena, pose, type Kit, type Personaje, type Pose } from './comun/kit.ts';

const MARCAS = [0, 3.0, 6.3, 9.6, 12.9];
const CARTA = { w: 420, gap: 16, top: 240, h: 344 };
const NX = [0, 1, 2, 3].map((k) => 96 + CARTA.w / 2 + k * (CARTA.w + CARTA.gap)); // nodos: centro de cada tarjeta
const HOY = 124;
const EJE = { x0: 96, x1: 1824, y: 740 };
/** Momento en que la línea llega a cada hito (su nodo se enciende). */
const LLEGA = [1.5, 3.85, 7.15, 10.5];
const FIESTA = 11.4;
const nx = (k: number) => NX[k] ?? 0;
const llega = (k: number) => LLEGA[k] ?? 0;
const marca = (k: number) => MARCAS[k] ?? 0;

/** Equipo que se suma en cada hito: dx = borde izquierdo de la caja desde el nodo; los pies apoyan en la línea. */
const EQUIPOS: Array<Array<{ n: Personaje; alto: number; dx: number }>> = [
  [{ n: 'bombilla', alto: 104, dx: 36 }, { n: 'llave', alto: 102, dx: 140 }],
  [{ n: 'engranaje', alto: 90, dx: 36 }, { n: 'gota', alto: 92, dx: 146 }],
  [{ n: 'medidor_gas', alto: 96, dx: 34 }, { n: 'grifo', alto: 98, dx: 140 }],
  [{ n: 'brocha', alto: 92, dx: 28 }, { n: 'aire', alto: 40, dx: 156 }],
];
const ARRIBA = (k: number) => llega(k) + 0.3; // el equipo k cae sobre la línea

type Tag = 'prox' | 'plan' | 'vision';
interface Hito { ic: string; tag: Tag; titulo: string; lineas: string[]; periodo: string }
const TAGS: Record<Tag, string> = { prox: 'Próximo', plan: 'Plan propuesto', vision: 'Visión' };

function hitos(c: Kit): Hito[] {
  return [
    {
      ic: 'cohete',
      tag: 'prox',
      titulo: 'Lanzamiento de la app',
      lineas: [`<b>${c.cifra('PROFESIONES-INICIALES')}</b> profesiones para arrancar`, `Tarifa del <b>${c.cifra('TARIFA-USUARIO')}</b> visible antes de contratar`],
      periodo: c.cifra('LANZAMIENTO'),
    },
    {
      ic: 'chispas',
      tag: 'plan',
      titulo: 'HandIA y toda Buenos Aires',
      lineas: ['HandIA premium y para profesionales', `<b class="cuenta-2">${c.cifra('PROF-Q1')}</b> profesiones con sus herramientas`],
      periodo: 'nov 2026 – ene 2027',
    },
    {
      ic: 'ruta',
      tag: 'plan',
      titulo: 'Una región por trimestre',
      lineas: ['Centro, Cuyo y Litoral, Norte', `<b class="cuenta-3">${c.cifra('PROF-Q4')}</b> profesiones en septiembre`],
      periodo: 'feb – oct 2027',
    },
    {
      ic: 'bandera',
      tag: 'vision',
      titulo: 'Toda Argentina',
      lineas: [`Que el <b>${c.cifra('META-CUOTA-NACIONAL')}</b> de los servicios contratados por particulares pase por Handyx`],
      periodo: 'nov – dic 2027',
    },
  ];
}

export default escena({
  marcas: MARCAS,
  leyendas: ['Primer hito: **el lanzamiento**', 'Primer trimestre: **HandIA y toda Buenos Aires**', 'Después: **una región por trimestre**', 'Visión: **Handyx en toda Argentina**'],
  css: `
    .fondo { position: absolute; inset: 0; background: ${COLOR.hueso}; }
    .halo { position: absolute; left: 960px; top: 560px; width: 1900px; height: 1300px; margin: -650px 0 0 -950px; border-radius: 50%; background: radial-gradient(closest-side, rgba(255,255,255,.95), rgba(255,255,255,0)); }
    .encabezado { position: absolute; left: 96px; top: 52px; }
    .krow { display: flex; align-items: center; gap: 18px; }
    .rotulo { display: inline-flex; align-items: center; padding: 5px 14px; border-radius: 999px; border: 2px dashed rgba(31,87,168,.5); background: #fff; font-weight: 700; font-size: 20px; color: ${COLOR.azulOscuro}; white-space: nowrap; }
    .encabezado .titulo { margin-top: 12px; font-size: 58px; }

    /* Eje */
    .eje { position: absolute; left: ${EJE.x0}px; top: ${EJE.y - 4}px; width: ${EJE.x1 - EJE.x0}px; height: 8px; border-radius: 4px; background: #D9E0EA; transform-origin: 0 50%; }
    .lleno { position: absolute; top: ${EJE.y - 4}px; height: 8px; border-radius: 4px; transform-origin: 0 50%; }
    .lleno.azul { left: ${HOY}px; width: ${nx(2) - HOY}px; background: ${COLOR.azul}; }
    .lleno.oro { left: ${nx(2)}px; width: ${nx(3) - nx(2)}px; background: ${COLOR.amarillo}; }
    .flecha { position: absolute; left: ${EJE.x1 - 2}px; top: ${EJE.y - 13}px; width: 0; height: 0; border-top: 13px solid transparent; border-bottom: 13px solid transparent; border-left: 20px solid #C3CCDA; }
    .hoy { position: absolute; left: ${HOY - 9}px; top: ${EJE.y - 9}px; width: 18px; height: 18px; border-radius: 50%; background: ${COLOR.azul}; box-shadow: 0 0 0 4px #fff; }
    .nodo { position: absolute; top: ${EJE.y}px; width: 0; height: 0; }
    .nodo b { position: absolute; left: -16px; top: -16px; width: 32px; height: 32px; border-radius: 50%; background: #fff; border: 4px solid #C3CCDA; box-shadow: 0 3px 8px rgba(14,29,54,.12); }
    .nodo[data-estado='pasado'] b { background: ${COLOR.azul}; border-color: ${COLOR.azul}; }
    .nodo[data-estado='actual'] b { background: ${COLOR.amarillo}; border-color: ${COLOR.noche}; }
    .nodo i { position: absolute; left: -26px; top: -26px; width: 52px; height: 52px; border-radius: 50%; border: 3px solid ${COLOR.azul}; opacity: 0; }
    .periodo { position: absolute; top: ${EJE.y + 30}px; width: 0; }
    .periodo span { position: absolute; left: 0; top: 0; transform: translateX(-50%); white-space: nowrap; font-size: 22px; font-weight: 800; color: ${COLOR.suave}; }
    .periodo[data-estado='actual'] span, .periodo[data-estado='pasado'] span { color: ${COLOR.noche}; }
    .periodo.p-hoy span { font-size: 20px; font-weight: 700; color: ${COLOR.azul}; }

    /* Tarjetas */
    .tallo { position: absolute; top: ${CARTA.top + CARTA.h}px; width: 4px; height: ${EJE.y - 16 - CARTA.top - CARTA.h}px; margin-left: -2px; border-radius: 2px; background: #C9D3E3; transform-origin: 50% 100%; }
    .carta { position: absolute; top: ${CARTA.top}px; width: ${CARTA.w}px; height: ${CARTA.h}px; padding: 24px 26px; border-radius: 26px; background: #fff; box-shadow: 0 16px 34px rgba(14,29,54,.12), 0 4px 0 #DCE2EC; display: flex; flex-direction: column; }
    .cab { display: flex; align-items: center; justify-content: space-between; }
    .mos { width: 56px; height: 56px; border-radius: 16px; background: #ECECEC; display: grid; place-items: center; }
    .mos .icono { width: 30px; height: 30px; }
    .tag { padding: 6px 14px; border-radius: 999px; font-weight: 800; font-size: 20px; white-space: nowrap; }
    .tag.prox { background: ${COLOR.celeste}; color: ${COLOR.azul}; }
    .tag.plan { background: #fff; color: ${COLOR.azulOscuro}; border: 2px dashed rgba(31,87,168,.5); padding: 4px 12px; }
    .tag.vision { background: ${COLOR.noche}; color: #fff; }
    .ct { margin-top: 16px; font-size: 34px; line-height: 1.04; color: ${COLOR.noche}; text-wrap: balance; }
    .cl { margin-top: 12px; display: flex; flex-direction: column; gap: 8px; }
    .cl p { position: relative; padding-left: 20px; font-size: 24px; line-height: 1.28; font-weight: 600; color: ${COLOR.texto}; text-wrap: balance; }
    .cl p::before { content: ''; position: absolute; left: 0; top: 12px; width: 8px; height: 8px; border-radius: 50%; background: ${COLOR.azul}; }
    .cl b { font-weight: 800; color: ${COLOR.azul}; }
    .carta.c3 { background: ${COLOR.amarillo}; box-shadow: 0 16px 34px rgba(14,29,54,.14), 0 6px 0 #C9971E; }
    .c3 .mos { background: rgba(255,255,255,.7); }
    .c3 .cl p { font-size: 25px; color: ${COLOR.noche}; }
    .c3 .cl p::before { background: ${COLOR.noche}; }
    .c3 .cl b { color: ${COLOR.noche}; background: #fff; padding: 0 .14em; border-radius: .12em; white-space: nowrap; }
    .aro-c { position: absolute; top: ${CARTA.top - 9}px; width: ${CARTA.w + 18}px; height: ${CARTA.h + 18}px; border-radius: 34px; border: 5px solid ${COLOR.amarillo}; box-shadow: 0 0 0 6px rgba(255,201,60,.22); }
    .aro-c.a3 { border-color: ${COLOR.azul}; box-shadow: 0 0 0 6px rgba(31,87,168,.14); }

    /* Handys sobre la línea: .mov lo ubica, .cae lo mueve la línea de tiempo y el .pj de adentro respira (ambiente) */
    .mov { position: absolute; }
    .cae { position: absolute; inset: 0; }
    .mov .sombra-pj { bottom: -5px; height: 11px; }
    .pj { transform-origin: 50% 100%; }
  `,
  html: (c) => {
    const hs = hitos(c);
    const equipo = (k: number) =>
      (EQUIPOS[k] ?? [])
        .map((h) => `<div class="mov e${k}" style="left:${nx(k) + h.dx}px;top:${EJE.y - 4 - h.alto}px;width:${h.alto}px;height:${h.alto}px"><i class="sombra-pj"></i><div class="cae">${c.pj(h.n, '', h.alto)}</div></div>`)
        .join('');
    return `
    <div class="fondo"></div><div class="halo"></div>
    <div class="eje"></div><div class="lleno azul"></div><div class="lleno oro"></div><div class="flecha"></div>
    <div class="hoy"></div><div class="periodo p-hoy" style="left:${HOY}px"><span>Hoy</span></div>
    ${hs.map((_, k) => `<div class="tallo" style="left:${nx(k)}px"></div>`).join('')}
    ${hs.map((_, k) => `<div class="nodo" style="left:${nx(k)}px"><i></i><b></b></div>`).join('')}
    ${hs.map((h, k) => `<div class="periodo pk" style="left:${nx(k)}px"><span>${h.periodo}</span></div>`).join('')}
    ${hs.map((_, k) => `<div class="aro-c a${k}" style="left:${nx(k) - CARTA.w / 2 - 9}px"></div>`).join('')}
    ${hs
      .map(
        (h, k) => `<div class="carta c${k}" style="left:${nx(k) - CARTA.w / 2}px">
        <div class="cab"><span class="mos">${c.icono(h.ic)}</span><span class="tag ${h.tag}">${TAGS[h.tag]}</span></div>
        <div class="ct t">${h.titulo}</div>
        <div class="cl">${h.lineas.map((l) => `<p>${l}</p>`).join('')}</div>
      </div>`,
      )
      .join('')}
    ${hs.map((_, k) => equipo(k)).join('')}
    <div class="encabezado">
      <div class="krow"><span class="kicker">Respaldo · producto</span><span class="rotulo">Plan propuesto · a validar</span></div>
      <div class="titulo t"><span class="l"><span>Roadmap: del lanzamiento a <mark>fines de 2027</mark></span></span></div>
    </div>
  `;
  },
  armar(tl, $, c) {
    // 0 · título, eje con sus hitos (apagados) y el lanzamiento
    tl.fromTo($('.halo'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, ease: 'power1.out' }, 0);
    tl.fromTo($('.krow'), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.05);
    entraTitulo(tl, $.all('.encabezado .l > span'), 0.12);
    tl.fromTo($('.eje'), { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'power2.out' }, 0.3);
    tl.fromTo($('.hoy'), { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(2.4)' }, 0.42);
    tl.fromTo($.all('.nodo b'), { scale: 0 }, { scale: 1, duration: 0.4, ease: 'back.out(2.6)', stagger: 0.09 }, 0.5);
    tl.fromTo($.all('.periodo span'), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out', stagger: 0.07 }, 0.6);

    // La línea avanza hito por hito (azul hasta el plan; amarillo hacia la visión)
    const total = nx(2) - HOY;
    tl.fromTo($('.lleno.azul'), { scaleX: 0 }, { scaleX: (nx(0) - HOY) / total, duration: 0.55, ease: 'power2.inOut' }, llega(0) - 0.55);
    tl.to($('.lleno.azul'), { scaleX: (nx(1) - HOY) / total, duration: 0.8, ease: 'power2.inOut' }, llega(1) - 0.8);
    tl.to($('.lleno.azul'), { scaleX: 1, duration: 0.8, ease: 'power2.inOut' }, llega(2) - 0.8);
    tl.fromTo($('.lleno.oro'), { scaleX: 0 }, { scaleX: 1, duration: 0.85, ease: 'power2.inOut' }, llega(3) - 0.85);
    tl.fromTo($('.flecha'), { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: 'power2.out' }, llega(3) + 0.6);

    // Cada hito: tallo, tarjeta, aro de foco y equipo
    const cartas = $.all('.carta');
    const tallos = $.all('.tallo');
    const aros = $.all('.aro-c');
    cartas.forEach((carta, k) => {
      const t = llega(k);
      const tallo = tallos[k];
      const aro = aros[k];
      if (tallo) tl.fromTo(tallo, { scaleY: 0 }, { scaleY: 1, duration: 0.3, ease: 'power2.out' }, t - 0.05);
      tl.fromTo(carta, { autoAlpha: 0, y: 46, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.6)' }, t + 0.1);
      tl.fromTo(carta.querySelectorAll('.cl p'), { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: 0.35, ease: 'power2.out', stagger: 0.12 }, t + 0.45);
      if (aro) {
        tl.fromTo(aro, { autoAlpha: 0, scale: 1.04 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'power3.out' }, t + 0.5);
        if (k < cartas.length - 1) tl.to(aro, { autoAlpha: 0, duration: 0.3, ease: 'power1.in' }, marca(k + 1));
      }
      const equipo = $.all(`.e${k}`);
      tl.fromTo(equipo.map((e) => e.querySelector('.cae')), { autoAlpha: 0, y: -70 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'bounce.out', stagger: 0.12 }, ARRIBA(k));
      tl.fromTo(equipo.map((e) => e.querySelector('.sombra-pj')), { autoAlpha: 0, scaleX: 0.3 }, { autoAlpha: 1, scaleX: 1, duration: 0.5, ease: 'power2.out', stagger: 0.12 }, ARRIBA(k) + 0.1);
    });

    // Las profesiones crecen con cada hito (cifras de las afirmaciones)
    const inicial = c.valor('PROFESIONES-INICIALES') ?? 0;
    const q1 = c.valor('PROF-Q1') ?? 0;
    c.contador($('.cuenta-2'), { t0: llega(1) + 0.55, dur: 1.0, desde: inicial, hasta: q1 });
    c.contador($('.cuenta-3'), { t0: llega(2) + 0.55, dur: 1.1, desde: q1, hasta: c.valor('PROF-Q4') ?? 0 });

    // Estado de nodos y períodos (pintor: vale también en los saltos)
    const nodos = $.all('.nodo');
    const periodos = $.all('.periodo.pk');
    c.pintor((t) => {
      NX.forEach((_, k) => {
        const estado = t < llega(k) ? 'futuro' : k < NX.length - 1 && t >= llega(k + 1) ? 'pasado' : 'actual';
        const n = nodos[k];
        const p = periodos[k];
        if (n) n.dataset['estado'] = estado;
        if (p) p.dataset['estado'] = estado;
      });
    });

    // Poses: cada equipo cae festejando, saluda en su hito y descansa; al final festejan todos
    const equipos = EQUIPOS.map((_, k) => $.all(`.e${k} .pj`));
    c.pintor((t) => {
      equipos.forEach((pjs, k) => {
        const a = ARRIBA(k);
        let p: Pose = 'a';
        if (t >= FIESTA || (t >= a && t < a + 0.45)) p = 'c';
        else if (t >= a && t < marca(k + 1) + 0.4) p = 'b';
        for (const pj of pjs) pose(pj, p);
      });
    });
  },
  ambiente(t, $, tl) {
    // Respiración (dueño: el ambiente; la línea de tiempo mueve .cae)
    $.all('.pj').forEach((p, i) => (p.style.transform = `scaleY(${(1 + Math.sin(t * 2.4 + i * 0.9) * 0.02).toFixed(4)})`));
    // Latido del hito actual
    let actual = -1;
    LLEGA.forEach((l, k) => {
      if (tl >= l + 0.3) actual = k;
    });
    $.all('.nodo i').forEach((anillo, k) => {
      const f = (((t * 0.7 + k * 0.3) % 1) + 1) % 1;
      anillo.style.opacity = k === actual ? String((1 - f) * 0.8) : '0';
      anillo.style.transform = `scale(${0.6 + f * 1.1})`;
    });
  },
});
