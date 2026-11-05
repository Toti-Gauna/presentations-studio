// Anexo de respaldo · Herramientas para cada oficio (1/2): Electricidad, Plomería y Gas. Un golpe por oficio:
// el celular con el diseño propuesto sube y queda marcado, el rubro se selecciona como en la grilla de la app, llega el
// Handy del oficio haciendo su acción (pose d) mientras se toca la herramienta principal, y se lee qué resuelve.
// Cuando llega un oficio nuevo, los Handys que ya estaban lo reciben festejando y vuelven a lo suyo. Los tres rubros
// (apagados) y el lugar punteado de cada celular se ven desde el paso 0, así cada página del PDF se entiende sola.
// anexo-herramientas-2 reutiliza esta escena (herramientasPorOficio) con Cerrajería, Albañilería y Aire acondicionado.
// Sin cifras: los valores que se ven dentro de las pantallas son datos de ejemplo de un diseño propuesto (rótulo visible).
// La franja y 880–950 queda libre (leyenda del kit) y la de y > 960 también.
import { COLOR, entraTitulo, escena, pose, type Personaje, type Pose } from './comun/kit.ts';

export interface OficioPropuesto {
  /** Diseño conceptos/herramientas-<id>.webp e ícono del rubro. */
  id: string;
  nombre: string;
  /** Qué resuelve, en una línea (voseo, sin cifras); «|» marca dónde corta el renglón. */
  resuelve: string;
  leyenda: string;
  pj: Personaje;
  /** Alto del Handy y ancho visible de su imagen (para la sombra). */
  alto: number;
  ancho: number;
  /** Lo da vuelta para que mire hacia su celular. */
  espejo?: boolean;
  /** Herramienta principal que se toca: fracción del ancho y del alto del diseño. */
  toque: readonly [number, number];
  /** Foco encendido (Electricidad). */
  luz?: boolean;
}

// Celular del kit (340 × 730) escalado; la línea de tiempo mueve el contenedor .tel y el ambiente su .flota.
const W = 340;
const H = 730;
const S = 0.78;
const TOP = 218;
const PISO = TOP + H * S; // base común: celulares y Handys
const COL_X = [96, 684, 1272]; // el texto de la última columna termina en x 1824
const TXT_DX = 290; // del borde de la columna al texto
const TXT_W = 262;
const MARCAS = [0, 3.6, 7.2, 10.8];
const LLEGA = [0.45, 3.75, 7.35]; // el celular de cada oficio empieza a subir
const ATERRIZA = 0.78; // el Handy llega (desde LLEGA)
const ACCION = 1.32; // pose d y toque en la herramienta (desde LLEGA)

/** Punto del diseño (fracción) dentro del celular escalado: pantalla de 316 × 706 con la imagen en cover. */
function enPantalla([fx, fy]: readonly [number, number]): [number, number] {
  const k = 706 / 1792;
  const recorte = (828 * k - 316) / 2;
  return [(12 + fx * 828 * k - recorte) * S, (12 + fy * 706) * S];
}

export function herramientasPorOficio(pagina: 1 | 2, oficios: readonly [OficioPropuesto, OficioPropuesto, OficioPropuesto]) {
  return escena({
    marcas: MARCAS,
    leyendas: oficios.map((o) => o.leyenda),
    css: `
      .fondo { position: absolute; inset: 0; background: ${COLOR.hueso}; }
      .encabezado { position: absolute; left: 96px; top: 52px; }
      .encabezado .kicker { display: flex; align-items: center; gap: 16px; }
      .pagina { display: inline-flex; gap: 8px; }
      .pagina i { width: 12px; height: 12px; border-radius: 50%; background: #C3CCDB; }
      .pagina i.on { background: ${COLOR.azul}; }
      .encabezado .titulo { margin-top: 10px; font-size: 60px; color: ${COLOR.noche}; }
      .rot { position: absolute; right: 96px; top: 102px; display: inline-flex; align-items: center; gap: 10px; padding: 9px 20px 9px 12px; border-radius: 999px; background: ${COLOR.amarillo}; color: ${COLOR.noche}; font-weight: 800; font-size: 21px; white-space: nowrap; box-shadow: 0 4px 0 #C9971E, 0 10px 22px rgba(14,29,54,.12); }
      .rot .icono { width: 26px; height: 26px; }

      .hueco { position: absolute; top: ${TOP}px; width: ${W * S}px; height: ${H * S}px; border-radius: ${Math.round(50 * S)}px; border: 3px dashed #C3CCDB; background: rgba(255,255,255,.4); }
      .tel { position: absolute; top: ${TOP}px; width: ${W * S}px; height: ${H * S}px; }
      .tel .flota { position: absolute; inset: 0; }
      .tel .cel { left: 0; top: 0; transform: scale(${S}); transform-origin: 0 0; }
      .aro { position: absolute; inset: -11px; border-radius: ${Math.round(50 * S + 11)}px; box-shadow: 0 0 0 6px ${COLOR.amarillo}, 0 0 44px 12px rgba(255,201,60,.42); }
      .toque { position: absolute; width: 70px; height: 70px; margin: -35px 0 0 -35px; border-radius: 50%; border: 4px solid rgba(31,87,168,.6); background: rgba(31,87,168,.16); z-index: 3; }

      .txt { position: absolute; top: 252px; width: ${TXT_W}px; }
      .rubro { position: relative; width: 68px; height: 68px; }
      .rubro > span { position: absolute; inset: 0; display: grid; place-items: center; border-radius: 20px; }
      .rubro .mos { background: #ECECEC; box-shadow: 0 5px 0 #D2D2D2; }
      .rubro .mos .icono { opacity: .6; }
      .rubro .sel { background: ${COLOR.azul}; box-shadow: 0 5px 0 ${COLOR.azulOscuro}; }
      .rubro .icono { width: 36px; height: 36px; }
      .nombre { margin-top: 20px; font-size: 32px; font-stretch: 105%; line-height: 1.06; color: ${COLOR.noche}; }
      .resuelve { margin-top: 12px; font-size: 24px; font-weight: 600; line-height: 1.3; color: ${COLOR.texto}; }
      .resuelve .w { display: inline-block; }

      .mov { position: absolute; }
      .pj { transform-origin: 50% 100%; }
      .espejo { position: absolute; inset: 0; }
      .sombra { position: absolute; left: 50%; bottom: -8px; height: 14px; border-radius: 50%; background: rgba(14,29,54,.14); transform: translateX(-50%); }
      .luz { position: absolute; left: 50%; top: 34%; width: 250px; height: 250px; margin: -125px 0 0 -125px; }
      .luz i { position: absolute; inset: 0; border-radius: 50%; background: radial-gradient(circle, rgba(255,201,60,.50) 0 30%, rgba(255,201,60,.18) 31% 58%, transparent 59%); }
    `,
    html: (c) => `
      <div class="fondo"></div>
      <div class="encabezado">
        <div class="kicker">Respaldo · producto<span class="pagina"><i class="${pagina === 1 ? 'on' : ''}"></i><i class="${pagina === 2 ? 'on' : ''}"></i></span></div>
        <div class="titulo t"><span class="l"><span>Herramientas para <mark>cada oficio</mark></span></span></div>
      </div>
      <span class="rot">${c.icono('herramienta')}Diseño propuesto · datos de ejemplo</span>
      ${oficios
        .map((o, i) => {
          const x0 = COL_X[i] ?? 0;
          const [tx, ty] = enPantalla(o.toque);
          const hx = x0 + TXT_DX + TXT_W / 2 - o.alto / 2;
          return `
        <div class="hueco u${i}" style="left:${x0}px"></div>
        <div class="tel t${i}" style="left:${x0}px"><div class="flota"><div class="aro"></div>${c.celular(c.img(`conceptos/herramientas-${o.id}.webp`, 'captura', `Diseño propuesto: herramientas de ${o.nombre}`))}<i class="toque" style="left:${tx.toFixed(1)}px;top:${ty.toFixed(1)}px"></i></div></div>
        <div class="txt x${i}" style="left:${x0 + TXT_DX}px">
          <div class="rubro"><span class="mos">${c.icono(o.id)}</span><span class="sel">${c.icono(o.id, 'blanco')}</span></div>
          <div class="nombre t">${o.nombre}</div>
          <p class="resuelve">${o.resuelve
            .split('|')
            .map((r) => r.trim().split(' ').map((w) => `<span class="w">${w}</span>`).join(' '))
            .join('<br>')}</p>
        </div>
        <div class="mov h${i}" style="left:${hx}px;top:${PISO - o.alto}px;width:${o.alto}px;height:${o.alto}px">
          ${o.luz ? '<div class="luz"><i></i></div>' : ''}
          <div class="espejo"${o.espejo ? ' style="transform:scaleX(-1)"' : ''}>${c.pj(o.pj, '', o.alto)}</div>
          <i class="sombra" style="width:${Math.round(o.ancho * 0.72)}px"></i>
        </div>`;
        })
        .join('')}
    `,
    armar(tl, $, c) {
      tl.fromTo($('.encabezado .kicker'), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0);
      entraTitulo(tl, $.all('.encabezado .l > span'), 0.08);
      tl.fromTo($('.rot'), { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, duration: 0.45, ease: 'power3.out' }, 0.35);

      // Paso 0: los tres rubros (apagados) y el lugar de cada celular, para ver de entrada qué oficios vienen.
      tl.fromTo($.all('.hueco'), { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'power2.out', stagger: 0.08 }, 0.2);
      tl.fromTo($.all('.rubro'), { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2.4)', stagger: 0.08 }, 0.3);
      const nombres = $.all('.nombre');
      tl.fromTo(nombres, { autoAlpha: 0, y: 20 }, { autoAlpha: (i) => (i === 0 ? 1 : 0.4), y: 0, duration: 0.45, ease: 'power3.out', stagger: 0.08 }, 0.4);

      // Cada paso: un oficio. El celular sube a su lugar y queda marcado; el rubro se selecciona; llega el Handy y toca la herramienta.
      oficios.forEach((o, i) => {
        const b = LLEGA[i] ?? 0;
        const tel = $(`.t${i}`);
        tl.fromTo(tel, { y: 900, rotation: 6 }, { y: 0, rotation: 0, duration: 0.75, ease: 'power3.out' }, b);
        tl.fromTo(tel.querySelector('.aro'), { autoAlpha: 0, scale: 1.06 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'power2.out' }, b + 0.5);
        if (i > 0) tl.to($(`.t${i - 1} .aro`), { autoAlpha: 0, duration: 0.3, ease: 'power1.in' }, MARCAS[i] ?? 0);
        tl.to($(`.u${i}`), { autoAlpha: 0, duration: 0.2 }, b + 0.75);
        const txt = $(`.x${i}`);
        const rubro = txt.querySelector('.rubro');
        tl.fromTo(txt.querySelector('.sel'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 }, b + 0.6);
        tl.fromTo(rubro, { y: 0 }, { y: 5, duration: 0.08, ease: 'power1.out', immediateRender: false }, b + 0.58);
        tl.to(rubro, { y: 0, duration: 0.16, ease: 'power2.out' }, b + 0.66);
        if (i > 0) tl.to(nombres[i]!, { opacity: 1, duration: 0.3, ease: 'power1.out' }, b + 0.45);
        tl.fromTo(txt.querySelectorAll('.w'), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out', stagger: 0.035 }, b + 0.65);
        tl.fromTo($(`.h${i}`), { autoAlpha: 0, y: 90, scale: 0.6 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(2)' }, b + ATERRIZA);
        const luz = $.all(`.h${i} .luz`);
        if (luz.length) tl.fromTo(luz, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(1.8)' }, b + ACCION - 0.1);
        const toque = tel.querySelector('.toque');
        tl.fromTo(toque, { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1, duration: 0.14, ease: 'power2.out' }, b + ACCION);
        tl.to(toque, { autoAlpha: 0, scale: 1.8, duration: 0.5, ease: 'power2.out' }, b + ACCION + 0.14);
      });

      // Poses (pintor: valen también en los saltos). Cada Handy llega saludando y se pone a trabajar (pose d); cuando
      // aterriza el siguiente, los que ya estaban lo reciben festejando y vuelven a la acción.
      const pjs = oficios.map((_, i) => $(`.h${i} .pj`));
      const ultima: Array<Pose | ''> = oficios.map(() => '');
      c.pintor((t) => {
        pjs.forEach((el, i) => {
          const b = LLEGA[i] ?? 0;
          const recibe = LLEGA.some((s, j) => j > i && t >= s + ATERRIZA && t < s + ATERRIZA + 0.55);
          const p: Pose = t < b + ACCION ? 'b' : recibe ? 'c' : 'd';
          if (p !== ultima[i]) pose(el, (ultima[i] = p));
        });
      });
    },
    ambiente(t, $) {
      // Celulares que se mecen, Handys que respiran y la luz de Foco que late
      $.all('.tel .flota').forEach((f, i) => (f.style.transform = `translateY(${Math.sin(t * 1.15 + i * 0.9) * 6}px)`));
      $.all('.mov .pj').forEach((p, i) => (p.style.transform = `scaleY(${1 + Math.sin(t * 2.4 + i * 1.4) * 0.02})`));
      $.all('.luz i').forEach((l) => (l.style.transform = `scale(${1 + Math.sin(t * 2.2) * 0.07})`));
    },
  });
}

export default herramientasPorOficio(1, [
  {
    id: 'electricidad',
    nombre: 'Electricidad',
    resuelve: 'Calculá el cable | y entendé cada | esquema con IA',
    leyenda: '**Electricidad**: herramientas para electricistas',
    pj: 'bombilla',
    alto: 196,
    ancho: 128,
    espejo: true,
    toque: [0.62, 0.68],
    luz: true,
  },
  {
    id: 'plomeria',
    nombre: 'Plomería',
    resuelve: 'Ubicá la pérdida | y presupuestá | los materiales',
    leyenda: '**Plomería**: encontrá la pérdida paso a paso',
    pj: 'gota',
    alto: 168,
    ancho: 170,
    espejo: true,
    toque: [0.5, 0.655],
  },
  {
    id: 'gas',
    nombre: 'Gas',
    resuelve: 'Revisá con checklist | y dejale un informe | al cliente',
    leyenda: '**Gas**: seguridad primero',
    pj: 'medidor_gas',
    alto: 168,
    ancho: 171,
    espejo: true,
    toque: [0.5, 0.566],
  },
]);
