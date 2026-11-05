// Plantilla de los anexos «Plan · mes N» (x-mes-1, x-mes-2, x-mes-3): el detalle de cada mes del plan del primer
// trimestre, coherente con x-plan-3m (mismas etiquetas de mes y mismos detalles visuales de cada mes). Tres golpes:
// 0 lo nuevo para el protagonista del mes, con su celular (demo o diseño propuesto, siempre rotulado) · 1 lo nuevo para el
// otro lado (vecino o profesional) · 2 cómo se mide, con su objetivo. Foco = vecino, Llave = profesional, Engranaje =
// Handyx (la plataforma). Los textos admiten **negrita** y {{ID}} (cifra de la afirmación, nunca números a mano).
// La franja y 880–950 queda libre (leyenda del kit, centrada bajo la columna izquierda) y nada importante baja de y 960.
import { ARGENTINA } from './argentina.ts';
import { COLOR, entraTitulo, escena, pose, type Kit, type Personaje, type Pose } from './kit.ts';

export interface Item { ic: string; txt: string }
export interface Fila { quien: 'vecino' | 'profesional'; etiqueta: string; items: [Item, Item] }
export interface DefMes {
  n: 1 | 2 | 3;
  fondo: string;
  /** Dos líneas; admiten <mark> y {{ID}}. */
  titulo: [string, string];
  /** Texto del primer paso del riel (por defecto «Lanzamiento»). */
  lanzamiento?: string;
  cel: { img: string; rotulo: string; tipo: 'demo' | 'prop' };
  /** Detalle visual de la primera fila (el mismo que tiene el mes en x-plan-3m). */
  deco: 'handia' | 'herramientas' | 'mapa';
  /** En orden de aparición: la primera es la protagonista del mes. */
  filas: [Fila, Fila];
  medida: { metrica: string; valor: string; meta?: { id: string; unidad: string } };
  leyendas: [string, string, string];
}

const MARCAS = [0, 3.6, 6.8, 10.2];
const FIESTA = 8.45;
const QUIEN: Record<Fila['quien'], Personaje> = { vecino: 'bombilla', profesional: 'llave' };
const MESES = ['Mes 1 · nov', 'Mes 2 · dic', 'Mes 3 · ene'];
const TEL = { x: 1430, y: 168, w: 320, h: 688 };
const FILA_Y = [304, 496];
const MEDIDA_Y = 688;

const md = (t: string) => t.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
export const rellenar = (t: string, c: Kit) => md(t.replace(/\{\{([A-Z][A-Z0-9-]{1,40})\}\}/g, (_, id: string) => c.cifra(id)));

/** Detalles visuales de cada mes (los mismos de las tarjetas de x-plan-3m). */
export function decoHtml(tipo: DefMes['deco'], c: Kit, id: string): string {
  if (tipo === 'handia')
    return `<div class="globo-ia">
      <span class="gc">${c.icono('camara')}</span>
      <span class="gc ondas">${[0.45, 0.8, 1, 0.7, 0.5].map((h) => `<i style="height:${Math.round(h * 30)}px"></i>`).join('')}</span>
      <span class="gc">${c.icono('dolar')}</span>
    </div>`;
  if (tipo === 'herramientas') return `<div class="cajas">${['calculadora', 'martillo', 'reloj'].map((ic) => `<span class="caja">${c.icono(ic)}</span>`).join('')}</div>`;
  // Mapa: Buenos Aires (silueta aproximada recortada con la costa) con Mar del Plata y las ciudades del primer trimestre
  const A = ARGENTINA;
  const pines = ['Mar del Plata', 'Ciudad de Buenos Aires', 'La Plata', 'Bahía Blanca']
    .map((n, i) => {
      const [x, y] = A.ciudades[n] ?? [0, 0];
      return `<circle class="pin${i ? '' : ' casa'}" cx="${x}" cy="${y}" r="${i ? 8 : 11}"/>`;
    })
    .join('');
  return `<svg class="mini-mapa" viewBox="244 344 164 234">
    <defs><clipPath id="${id}-pais"><path d="${A.contorno}"/></clipPath><clipPath id="${id}-prov"><path d="${A.buenosAires}"/></clipPath></defs>
    <path class="prov" d="${A.buenosAires}" clip-path="url(#${id}-pais)"/>
    <path class="costa" d="${A.contorno}" clip-path="url(#${id}-prov)"/>
    ${pines}
  </svg>`;
}

export const CSS_DECO = `
  .globo-ia { position: absolute; display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-radius: 26px 26px 26px 8px; background: ${COLOR.celeste}; box-shadow: inset 0 0 0 2px rgba(31,87,168,.12); }
  .globo-ia .gc { width: 54px; height: 54px; border-radius: 50%; background: #fff; display: grid; place-items: center; box-shadow: 0 4px 10px rgba(14,29,54,.08); }
  .globo-ia .icono { width: 28px; height: 28px; }
  .globo-ia .ondas { display: flex; align-items: center; justify-content: center; gap: 3px; }
  .globo-ia .ondas i { display: block; width: 4px; border-radius: 2px; background: ${COLOR.azul}; transform-origin: 50% 50%; }
  .cajas { position: absolute; display: flex; gap: 14px; }
  .caja { width: 64px; height: 64px; border-radius: 18px; background: #fff; display: grid; place-items: center; box-shadow: 0 5px 0 #D5DCE7, 0 10px 18px rgba(14,29,54,.08); }
  .caja .icono { width: 34px; height: 34px; }
  .mini-mapa { position: absolute; overflow: visible; filter: drop-shadow(0 6px 10px rgba(14,29,54,.16)); }
  .mini-mapa .prov { fill: ${COLOR.amarillo}; }
  .mini-mapa .costa { fill: none; stroke: ${COLOR.azul}; stroke-width: 5; stroke-linejoin: round; }
  .mini-mapa .pin { fill: ${COLOR.noche}; stroke: #fff; stroke-width: 3.5; }
  .mini-mapa .pin.casa { fill: ${COLOR.azul}; stroke-width: 4; }
`;

export function planMes(d: DefMes) {
  const [f1, f2] = d.filas;
  const marca = (k: number) => MARCAS[k] ?? 0;
  return escena({
    marcas: MARCAS,
    leyendas: d.leyendas,
    lugarLeyenda: { x: 671, y: 915 },
    css: `
      .fondo { position: absolute; inset: 0; background: ${d.fondo}; }
      .halo { position: absolute; left: ${TEL.x + TEL.w / 2 - 620}px; top: ${TEL.y + TEL.h / 2 - 620}px; width: 1240px; height: 1240px; border-radius: 50%; background: radial-gradient(closest-side, rgba(255,255,255,.95), rgba(255,255,255,0)); }
      .aro { position: absolute; left: ${TEL.x + TEL.w / 2 - 430}px; top: ${TEL.y + TEL.h / 2 - 430}px; width: 860px; height: 860px; border-radius: 50%; border: 56px solid rgba(31,87,168,.045); }
      .orbita { position: absolute; left: ${TEL.x + TEL.w / 2 - 330}px; top: ${TEL.y + TEL.h / 2 - 330}px; width: 660px; height: 660px; border-radius: 50%; border: 2px dashed rgba(31,87,168,.2); }
      .encabezado { position: absolute; left: 96px; top: 52px; }
      .krow { display: flex; align-items: center; gap: 18px; }
      .rotulo { display: inline-flex; align-items: center; padding: 5px 14px; border-radius: 999px; border: 2px dashed rgba(31,87,168,.5); background: #fff; font-weight: 700; font-size: 20px; color: ${COLOR.azulOscuro}; white-space: nowrap; }
      .encabezado .titulo { margin-top: 12px; font-size: 56px; }

      /* Riel de los meses (el mismo orden de x-plan-3m) */
      .riel { position: absolute; left: 96px; top: 234px; display: flex; align-items: center; }
      .paso { display: inline-flex; align-items: center; gap: 8px; height: 44px; padding: 0 18px; border-radius: 999px; font-weight: 800; font-size: 20px; white-space: nowrap; }
      .paso .icono { width: 22px; height: 22px; }
      .paso.hecho { background: ${COLOR.azul}; color: #fff; }
      .paso.actual { background: ${COLOR.amarillo}; color: ${COLOR.noche}; box-shadow: 0 4px 0 #C9971E; }
      .paso.futuro { background: #fff; color: ${COLOR.suave}; border: 2px dashed #C3CCDA; }
      .union { width: 26px; height: 4px; border-radius: 2px; background: #C9D3E3; }
      .union.hecha { background: ${COLOR.azul}; }

      /* Filas: vecino / profesional */
      .fila { position: absolute; left: 96px; width: 1150px; height: 172px; border-radius: 26px; background: #fff; box-shadow: 0 16px 34px rgba(14,29,54,.10), 0 4px 0 #DCE2EC; }
      .ava { position: absolute; left: 20px; top: 20px; width: 132px; height: 132px; border-radius: 24px; background: #E9EDF3; overflow: hidden; }
      .ava .mov { position: absolute; left: 6px; bottom: 2px; width: 120px; height: 120px; }
      .pj { transform-origin: 50% 100%; }
      .txt { position: absolute; left: 178px; top: 22px; right: 28px; }
      .f1 .txt { right: 290px; }
      .et { font-weight: 800; font-size: 20px; letter-spacing: .08em; text-transform: uppercase; color: ${COLOR.azul}; }
      .its { margin-top: 12px; display: flex; flex-direction: column; gap: 12px; }
      .it { display: flex; align-items: center; gap: 14px; font-size: 25px; line-height: 1.22; font-weight: 600; color: ${COLOR.texto}; }
      .it b { font-weight: 800; color: ${COLOR.noche}; }
      .it .ic { flex: none; width: 42px; height: 42px; border-radius: 12px; background: ${COLOR.celeste}; display: grid; place-items: center; }
      .it .ic .icono { width: 26px; height: 26px; }
      .deco { position: absolute; right: 26px; top: 20px; width: 250px; height: 132px; }
      .deco .globo-ia { left: 18px; top: 30px; }
      .deco .cajas { left: 15px; top: 34px; }
      .deco .mini-mapa { left: 73px; top: -9px; width: 105px; height: 150px; }
      ${CSS_DECO}

      /* Cómo se mide */
      .medida { position: absolute; left: 96px; top: ${MEDIDA_Y}px; width: 1150px; height: 152px; border-radius: 26px; background: ${COLOR.amarillo}; box-shadow: 0 16px 34px rgba(14,29,54,.12), 0 6px 0 #C9971E; }
      .medida .ava { width: 112px; height: 112px; background: rgba(255,255,255,.72); }
      .medida .ava .mov { left: 6px; width: 100px; height: 100px; }
      .medida .txt { left: 156px; top: 24px; right: ${d.medida.meta ? 300 : 28}px; }
      .mlbl { font-weight: 800; font-size: 20px; letter-spacing: .08em; text-transform: uppercase; color: ${COLOR.noche}; }
      .mmet { margin-top: 6px; font-size: 28px; line-height: 1.15; font-weight: 800; color: ${COLOR.noche}; }
      .mval { margin-top: 8px; font-size: 22px; line-height: 1.25; font-weight: 600; color: ${COLOR.texto}; }
      .meta { position: absolute; right: 22px; top: 20px; width: 256px; height: 112px; padding: 12px 20px; border-radius: 20px; background: #fff; box-shadow: 0 6px 16px rgba(14,29,54,.10); }
      .meta .obj { display: inline-block; padding: 2px 12px; border-radius: 999px; background: ${COLOR.noche}; color: #fff; font-weight: 800; font-size: 20px; white-space: nowrap; }
      .meta .linea { display: flex; align-items: center; gap: 12px; margin-top: 6px; }
      .meta .n { font-size: 58px; line-height: 1; color: ${COLOR.azul}; white-space: nowrap; }
      .meta .u { font-size: 22px; line-height: 1.05; font-weight: 800; color: ${COLOR.noche}; }

      /* Celular (demo o diseño propuesto, rotulado) */
      .tel { position: absolute; left: ${TEL.x}px; top: ${TEL.y}px; width: ${TEL.w}px; height: ${TEL.h}px; }
      .tel .cel { left: 0; top: 0; width: ${TEL.w}px; height: ${TEL.h}px; border-radius: 48px; padding: 11px; }
      .tel .cel .pantalla { border-radius: 37px; }
      .rotw { position: absolute; left: ${TEL.x - 140}px; top: ${TEL.y - 58}px; width: ${TEL.w + 280}px; text-align: center; }
      .rot { display: inline-flex; align-items: center; gap: 10px; padding: 7px 18px 7px 12px; border-radius: 999px; font-weight: 800; font-size: 20px; white-space: nowrap; }
      .rot .icono { width: 24px; height: 24px; }
      .rot.demo { background: ${COLOR.celeste}; color: ${COLOR.azul}; box-shadow: inset 0 0 0 2px rgba(31,87,168,.16); }
      .rot.prop { background: ${COLOR.amarillo}; color: ${COLOR.noche}; box-shadow: 0 4px 0 #C9971E; }
    `,
    html: (c) => {
      const fila = (f: Fila, k: number) => `
        <div class="fila f${k + 1}" style="top:${FILA_Y[k] ?? 0}px">
          <div class="ava"><div class="mov">${c.pj(QUIEN[f.quien], '', 120)}</div></div>
          <div class="txt"><div class="et">${f.etiqueta}</div>
            <div class="its">${f.items.map((it) => `<div class="it"><span class="ic">${c.icono(it.ic)}</span><span>${rellenar(it.txt, c)}</span></div>`).join('')}</div></div>
          ${k === 0 ? `<div class="deco">${decoHtml(d.deco, c, `mes${d.n}-costa`)}</div>` : ''}
        </div>`;
      const pasos = [d.lanzamiento ? rellenar(d.lanzamiento, c) : 'Lanzamiento', ...MESES];
      const riel = pasos
        .map((p, i) => {
          const estado = i < d.n ? 'hecho' : i === d.n ? 'actual' : 'futuro';
          const ic = i === 0 ? c.icono('cohete', 'blanco') : i < d.n ? c.icono('tilde-circulo', 'blanco') : c.icono('calendario');
          return `${i ? `<i class="union${i <= d.n ? ' hecha' : ''}"></i>` : ''}<span class="paso ${estado}">${ic}${p}</span>`;
        })
        .join('');
      const meta = d.medida.meta;
      return `
      <div class="fondo"></div><div class="halo"></div><div class="aro"></div><div class="orbita"></div>
      <div class="tel">${c.celular(c.img(d.cel.img, 'captura', d.cel.rotulo))}</div>
      <div class="rotw"><span class="rot ${d.cel.tipo}">${c.icono(d.cel.tipo === 'demo' ? 'celular' : 'idea')}${d.cel.rotulo}</span></div>
      <div class="encabezado">
        <div class="krow"><span class="kicker">Respaldo · plan de ${c.cifra('META-BA-MESES')} meses · ${d.n} de ${MESES.length}</span><span class="rotulo">Plan propuesto · a validar</span></div>
        <div class="titulo t">${d.titulo.map((l) => `<span class="l"><span>${rellenar(l, c)}</span></span>`).join('')}</div>
      </div>
      <div class="riel">${riel}</div>
      ${fila(f1, 0)}${fila(f2, 1)}
      <div class="medida">
        <div class="ava"><div class="mov">${c.pj('engranaje', '', 100)}</div></div>
        <div class="txt"><div class="mlbl">Cómo lo medimos</div><div class="mmet">${rellenar(d.medida.metrica, c)}</div><div class="mval">${rellenar(d.medida.valor, c)}</div></div>
        ${meta ? `<div class="meta"><span class="obj">Objetivo · diciembre</span><div class="linea"><span class="n t">${c.cifra(meta.id)}</span><span class="u">${meta.unidad}</span></div></div>` : ''}
      </div>
    `;
    },
    armar(tl, $, c) {
      // 0 · título, riel, celular y la fila protagonista
      tl.fromTo([$('.halo'), $('.aro'), $('.orbita')], { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 1.0, ease: 'power2.out', stagger: 0.08 }, 0);
      tl.fromTo($('.krow'), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.05);
      entraTitulo(tl, $.all('.encabezado .l > span'), 0.12);
      tl.fromTo($.all('.riel > *'), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'back.out(2)', stagger: 0.06 }, 0.45);
      tl.to($('.paso.actual'), { scale: 1.1, duration: 0.18, ease: 'power2.out', yoyo: true, repeat: 1 }, 1.05);
      tl.fromTo($('.tel'), { autoAlpha: 0, x: 130, y: 40, rotation: 5 }, { autoAlpha: 1, x: 0, y: 0, rotation: 0, duration: 0.85, ease: 'power3.out' }, 0.35);
      tl.fromTo($('.rot'), { autoAlpha: 0, y: 14, scale: 0.8 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(2.2)' }, 0.95);
      const entraFila = (sel: string, t: number) => {
        tl.fromTo($(sel), { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out' }, t);
        tl.fromTo($(`${sel} .ava .mov`), { y: 130 }, { y: 0, duration: 0.55, ease: 'back.out(1.5)' }, t + 0.2);
        tl.fromTo([$(`${sel} .et`), ...$.all(`${sel} .it`)], { autoAlpha: 0, x: -18 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: 'power2.out', stagger: 0.14 }, t + 0.3);
      };
      entraFila('.f1', 0.8);
      const deco = $.all('.f1 .deco .gc, .f1 .deco .caja');
      if (deco.length) {
        const globo = $.all('.globo-ia');
        if (globo.length) tl.fromTo(globo, { autoAlpha: 0, scale: 0.6, transformOrigin: '0% 100%' }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(2)' }, 1.35);
        tl.fromTo(deco, { autoAlpha: 0, scale: 0.4, rotation: -10 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.4, ease: 'back.out(2.4)', stagger: 0.13 }, 1.5);
      }
      const mapa = $.all('.mini-mapa');
      if (mapa.length) {
        tl.fromTo(mapa, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 1.35);
        tl.fromTo($.all('.mini-mapa .prov'), { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power1.out' }, 1.6);
        tl.fromTo($.all('.mini-mapa .pin'), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.4, ease: 'back.out(3)', stagger: 0.15 }, 1.75);
      }

      // 1 · el otro lado
      entraFila('.f2', marca(1) + 0.05);

      // 2 · cómo se mide: el objetivo cuenta y todos festejan
      const t2 = marca(2);
      tl.fromTo($('.medida'), { autoAlpha: 0, y: 34, scale: 0.97 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.5)' }, t2 + 0.05);
      tl.fromTo($('.medida .ava .mov'), { y: 120 }, { y: 0, duration: 0.55, ease: 'back.out(1.5)' }, t2 + 0.25);
      tl.fromTo($.all('.medida .txt > *'), { autoAlpha: 0, x: -18 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: 'power2.out', stagger: 0.12 }, t2 + 0.35);
      if (d.medida.meta) {
        tl.fromTo($('.meta'), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(2.2)' }, t2 + 0.6);
        c.contador($('.meta .n'), { t0: t2 + 0.7, dur: 0.9, hasta: c.valor(d.medida.meta.id) ?? 0 });
      }

      // Poses: aparecen festejando, saludan y descansan; el de la primera fila saluda al que llega; al final, todos festejan
      const [p1, p2, pe] = [$('.f1 .pj'), $('.f2 .pj'), $('.medida .pj')];
      const a1 = 1.0;
      const a2 = marca(1) + 0.25;
      const ae = t2 + 0.25;
      c.pintor((t) => {
        let q1: Pose = 'a';
        if (t >= FIESTA || (t >= a1 && t < a1 + 0.5)) q1 = 'c';
        else if ((t >= a1 && t < marca(1) - 0.2) || (t >= a2 + 0.3 && t < a2 + 1.1)) q1 = 'b';
        let q2: Pose = 'a';
        if (t >= FIESTA || (t >= a2 && t < a2 + 0.5)) q2 = 'c';
        else if (t >= a2 && t < marca(2)) q2 = 'b';
        const qe: Pose = t >= FIESTA ? 'c' : 'd';
        pose(p1, q1);
        pose(p2, q2);
        pose(pe, t >= ae ? qe : 'a');
      });
    },
    ambiente(t, $) {
      // Respiración (dueño: el ambiente; la línea de tiempo mueve los .mov) y la órbita que gira despacio
      $.all('.pj').forEach((p, i) => (p.style.transform = `scaleY(${(1 + Math.sin(t * 2.4 + i * 1.1) * 0.02).toFixed(4)})`));
      $('.orbita').style.rotate = `${(t * 4) % 360}deg`;
      // La voz de HandIA (ondas) y el latido de Mar del Plata en el mapa
      $.all('.ondas i').forEach((b, i) => (b.style.transform = `scaleY(${(0.55 + 0.45 * Math.abs(Math.sin(t * 3.2 + i * 0.9))).toFixed(3)})`));
      const casa = $.all('.mini-mapa .pin.casa');
      for (const p of casa) p.style.strokeWidth = String(4 + 2 * Math.abs(Math.sin(t * 2.2)));
    },
  });
}
