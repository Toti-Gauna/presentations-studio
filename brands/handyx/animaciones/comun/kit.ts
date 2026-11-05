// Kit de animaciones de Handyx: la base visual (tipografías, colores, celular, chats, tarjetas, personajes) y la
// mecánica común de todas las escenas (un tramo de animación por paso, movimiento ambiente, congelar, cara).
// Cada escena define su HTML, su CSS y su coreografía con GSAP sobre una línea de tiempo pausada.
// Reglas: ningún número escrito a mano (c.cifra / c.valor de afirmaciones declaradas), nada de azar no
// determinista (usar c.azar), y cada propiedad animada con un solo dueño (línea de tiempo o ambiente, no los dos).
import type { gsap } from 'gsap';
import type { Animacion, ContextoAnimacion, CrearAnimacion } from '../../../../src/render/animacion.ts';

export type Tl = gsap.core.Timeline;
export interface Sel {
  (s: string): HTMLElement;
  all(s: string): HTMLElement[];
}
export type Pose = 'a' | 'b' | 'c' | 'd';
export const PERSONAJES = ['aire', 'bombilla', 'brocha', 'engranaje', 'gota', 'grifo', 'llave', 'medidor_gas'] as const;
export type Personaje = (typeof PERSONAJES)[number];

export interface Kit extends ContextoAnimacion {
  /** Personaje de la marca con sus 4 poses superpuestas (se elige con pose()). */
  pj(nombre: Personaje, clase?: string, alto?: number): string;
  icono(nombre: string, clase?: string): string;
  logo(clase?: string): string;
  img(archivo: string, clase?: string, alt?: string): string;
  /** Celular 9:19,5 con isla; el contenido va adentro de .pantalla. */
  celular(contenido: string, clase?: string): string;
  /** Pintores: se llaman en cada render con el tiempo de la línea (textos que cambian, conteos). */
  pintor(f: (t: number) => void): void;
  /** Número que cuenta entre t0 y t0+dur (formato con separador de miles es-AR). */
  contador(el: HTMLElement, o: { t0: number; dur: number; desde?: number; hasta: number; antes?: string; despues?: string; decimales?: number }): void;
  /** Texto que se escribe letra por letra entre t0 y t0+dur. */
  escribir(el: HTMLElement, texto: string, t0: number, dur: number): void;
  /** Azar determinista (misma semilla, misma escena). */
  azar(): number;
}

export interface DefEscena {
  /** n + 1 marcas en segundos: el paso k anima de marcas[k] a marcas[k+1]. */
  marcas: number[];
  css: string;
  html: (c: Kit) => string;
  armar: (tl: Tl, $: Sel, c: Kit) => void;
  /** Movimiento continuo que no depende del paso (t = segundos desde que se montó; en exportación, t de la línea). */
  ambiente?: (t: number, $: Sel, tLinea: number) => void;
  /** Lugar libre para la cara del presentador en el video: vale desde el punto p indicado. */
  cara?: Array<{ desde: number; x: number; y: number; d: number }>;
  /** Explicación de cada paso (una por tramo; '' = sin leyenda): pastilla numerada que dice qué está pasando. Admite **negrita**. */
  leyendas?: Array<string | { t: string; x?: number; y?: number }>;
  /** Centro de las leyendas (por defecto abajo al centro, encima de la franja de subtítulos: x 960, y 915). */
  lugarLeyenda?: { x: number; y: number };
}

export const COLOR = {
  azul: '#1F57A8', azulOscuro: '#13305E', noche: '#0E1D36', amarillo: '#FFC93C', verde: '#1E9E57', naranja: '#F6A623',
  rojo: '#D93025', hueso: '#F7F6F1', celeste: '#E6EEFB', texto: '#26324A', suave: '#5F6B84', borde: '#E3E8F2',
} as const;

const BASE = `
:host { position: absolute; inset: 0; display: block; overflow: hidden; }
* { box-sizing: border-box; margin: 0; }
.lienzo { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; overflow: hidden; font-family: var(--fuente-texto, 'DM Sans Variable', 'DM Sans', sans-serif); color: ${COLOR.noche}; -webkit-font-smoothing: antialiased; }
.abs { position: absolute; }
.t { font-family: var(--fuente-titulos, 'Archivo Variable', 'Archivo', sans-serif); font-weight: 900; font-stretch: 118%; letter-spacing: -0.012em; line-height: 1.02; }
.kicker { font-weight: 800; font-size: 24px; letter-spacing: .08em; text-transform: uppercase; color: ${COLOR.azul}; }
.titulo { font-size: 74px; }
.titulo .l { display: block; overflow: hidden; padding-bottom: 8px; margin-bottom: -8px; }
.titulo .l > span { display: inline-block; }
mark { background: ${COLOR.amarillo}; color: ${COLOR.noche}; padding: 0 .14em; border-radius: .12em; box-decoration-break: clone; -webkit-box-decoration-break: clone; }
.tarjeta { background: #fff; border-radius: 26px; box-shadow: 0 16px 34px rgba(14,29,54,.14), 0 3px 0 ${COLOR.borde}; }
.chip { display: inline-flex; align-items: center; gap: 10px; padding: 10px 18px; border-radius: 999px; font-weight: 800; font-size: 22px; background: #fff; box-shadow: 0 8px 20px rgba(14,29,54,.14); white-space: nowrap; }
.chip.azul { background: ${COLOR.azul}; color: #fff; } .chip.amarillo { background: ${COLOR.amarillo}; } .chip.verde { background: ${COLOR.verde}; color: #fff; }
.chip img { width: 28px; height: 28px; }
.sello { display: inline-flex; align-items: center; gap: 12px; padding: 14px 24px; border-radius: 18px; font-family: var(--fuente-titulos, 'Archivo Variable', sans-serif); font-weight: 900; font-stretch: 112%; font-size: 34px; color: #fff; background: ${COLOR.azul}; box-shadow: 0 10px 0 ${COLOR.azulOscuro}, 0 20px 40px rgba(14,29,54,.25); }
.icono { width: 34px; height: 34px; display: block; }
.icono.blanco { filter: brightness(0) invert(1); }
.icono.oro { filter: brightness(0) saturate(100%) invert(80%) sepia(60%) saturate(800%) hue-rotate(350deg); }
.pj { position: absolute; display: block; }
.pj img { position: absolute; left: 50%; bottom: 0; height: 100%; transform: translateX(-50%); display: none; }
.pj img[data-p="a"] { display: block; }
.sombra-pj { position: absolute; left: 18%; right: 18%; bottom: -8px; height: 14px; border-radius: 50%; background: rgba(14,29,54,.16); }
.cel { position: absolute; width: 340px; height: 730px; border-radius: 50px; background: #0A1528; padding: 12px; box-shadow: 0 40px 80px rgba(14,29,54,.30), 0 0 0 2px rgba(255,255,255,.06); }
.cel .pantalla { position: relative; width: 100%; height: 100%; border-radius: 39px; background: ${COLOR.hueso}; overflow: hidden; }
.cel .isla { position: absolute; left: 50%; top: 12px; width: 96px; height: 28px; margin-left: -48px; border-radius: 16px; background: #0A1528; z-index: 9; }
.cel .barra { position: absolute; left: 0; right: 0; top: 0; height: 52px; display: flex; align-items: center; justify-content: space-between; padding: 14px 26px 0; font-size: 15px; font-weight: 700; z-index: 8; }
.cel img.captura { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: top; }
.burbuja { position: relative; display: inline-block; max-width: 520px; padding: 16px 22px; border-radius: 24px 24px 24px 8px; background: #fff; font-size: 26px; line-height: 1.3; font-weight: 600; box-shadow: 0 12px 26px rgba(14,29,54,.16); }
.burbuja.mia { border-radius: 24px 24px 8px 24px; background: #DCF3D8; }
.burbuja .hora { display: block; margin-top: 4px; font-size: 14px; font-weight: 600; color: ${COLOR.suave}; text-align: right; }
.cielo { position: absolute; inset: 0; }
.leyenda-paso { position: absolute; left: 0; top: 0; z-index: 60; display: flex; align-items: center; gap: 14px; padding: 9px 26px 9px 10px; border-radius: 999px; background: #fff; box-shadow: 0 10px 26px rgba(14,29,54,.22), 0 2px 0 ${COLOR.borde}; white-space: nowrap; font-size: 27px; font-weight: 700; color: ${COLOR.noche}; visibility: hidden; }
.leyenda-paso .n { flex: none; width: 42px; height: 42px; border-radius: 50%; background: ${COLOR.azul}; color: #fff; display: grid; place-items: center; font-family: var(--fuente-titulos, 'Archivo Variable', sans-serif); font-weight: 900; font-size: 22px; }
.leyenda-paso b { font-weight: 800; color: ${COLOR.azul}; }
`;

function hacerSel(raiz: ShadowRoot): Sel {
  const f = ((s: string) => {
    const el = raiz.querySelector<HTMLElement>(s);
    if (!el) throw new Error(`animación: no existe ${s}`);
    return el;
  }) as Sel;
  f.all = (s: string) => [...raiz.querySelectorAll<HTMLElement>(s)];
  return f;
}

const miles = (n: number, dec = 0) => n.toLocaleString('es-AR', { minimumFractionDigits: dec, maximumFractionDigits: dec }).replace(/\s/g, ' ');

/** Cambia la pose visible de un personaje (a, b, c o d). */
export function pose(el: HTMLElement, p: Pose): void {
  for (const im of el.querySelectorAll<HTMLImageElement>('img[data-p]')) im.style.display = im.dataset['p'] === p ? 'block' : 'none';
}

/** Entrada de un título por líneas (cada .l > span sube desde abajo de su máscara). */
export function entraTitulo(tl: Tl, lineas: HTMLElement[], t: number, escalonado = 0.14): void {
  tl.fromTo(lineas, { yPercent: 140 }, { yPercent: 0, duration: 0.7, ease: 'power4.out', stagger: escalonado }, t);
}

/** Interpolación lineal acotada: 0 antes de a, 1 después de b. */
export const tramo = (t: number, a: number, b: number) => Math.min(1, Math.max(0, (t - a) / (b - a)));

export function escena(def: DefEscena): CrearAnimacion {
  return async (raiz, ctx): Promise<Animacion> => {
    let semilla = 7;
    const pintores: Array<(t: number) => void> = [];
    const c: Kit = {
      ...ctx,
      pj: (nombre, clase = '', alto = 160) =>
        `<div class="pj ${clase}" style="height:${alto}px;width:${alto}px">${(['a', 'b', 'c', 'd'] as const).map((p) => `<img data-p="${p}" src="${ctx.url(`personajes/${nombre}-${p}.webp`)}" alt="">`).join('')}</div>`,
      icono: (nombre, clase = '') => `<img class="icono ${clase}" src="${ctx.url(`iconos/${nombre}.svg`)}" alt="">`,
      logo: (clase = '') => `<img class="${clase}" src="${ctx.url('logo-handyx.webp')}" alt="Handyx">`,
      img: (archivo, clase = '', alt = '') => `<img class="${clase}" src="${ctx.url(archivo)}" alt="${alt}">`,
      celular: (contenido, clase = '') => `<div class="cel ${clase}"><div class="pantalla"><div class="isla"></div>${contenido}</div></div>`,
      pintor: (f) => pintores.push(f),
      contador: (el, o) =>
        pintores.push((t) => {
          const k = tramo(t, o.t0, o.t0 + o.dur);
          const e = 1 - (1 - k) ** 3;
          el.textContent = `${o.antes ?? ''}${miles((o.desde ?? 0) + (o.hasta - (o.desde ?? 0)) * e, o.decimales ?? 0)}${o.despues ?? ''}`;
        }),
      escribir: (el, texto, t0, dur) =>
        pintores.push((t) => {
          el.textContent = texto.slice(0, Math.round(texto.length * tramo(t, t0, t0 + dur)));
        }),
      azar: () => {
        semilla = (semilla * 16807) % 2147483647;
        return (semilla - 1) / 2147483646;
      },
    };
    const lugar = def.lugarLeyenda ?? { x: 960, y: 915 };
    let numero = 0; // se numeran solo las leyendas visibles (1, 2, 3…), aunque algún paso no tenga
    const leyendas = (def.leyendas ?? [])
      .map((l, k) => {
        const d = typeof l === 'string' ? { t: l } : l;
        if (!d.t) return '';
        const txt = d.t.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
        return `<div class="leyenda-paso" data-k="${k}" data-x="${d.x ?? lugar.x}" data-y="${d.y ?? lugar.y}"><span class="n">${++numero}</span><span>${txt}</span></div>`;
      })
      .join('');
    raiz.innerHTML = `<style>${BASE}${def.css}</style><div class="lienzo">${def.html(c)}${leyendas}</div>`;
    const $ = hacerSel(raiz);
    await Promise.all([...raiz.querySelectorAll('img')].map((i) => i.decode().catch(() => null)));
    const tl = ctx.gsap.timeline({ paused: true });
    def.armar(tl, $, c);
    const n = def.marcas.length - 1;
    // Leyendas: cada una entra apenas empieza su paso y sale cuando empieza el siguiente que tenga leyenda.
    const pastillas = $.all('.leyenda-paso');
    pastillas.forEach((el, i) => {
      const k = Number(el.dataset['k']);
      const x = Number(el.dataset['x']);
      const y = Number(el.dataset['y']);
      ctx.gsap.set(el, { x, y, xPercent: -50, yPercent: -50 });
      tl.fromTo(el, { autoAlpha: 0, y: y + 22, scale: 0.9 }, { autoAlpha: 1, y, scale: 1, duration: 0.45, ease: 'back.out(1.8)' }, (def.marcas[k] ?? 0) + 0.15);
      const sig = pastillas[i + 1];
      if (sig) tl.to(el, { autoAlpha: 0, y: y - 16, duration: 0.25, ease: 'power1.in' }, def.marcas[Number(sig.dataset['k'])] ?? 0);
    });
    const fin = def.marcas[n] ?? tl.duration();
    tl.set({}, {}, fin);
    const tiempo = (p: number) => {
      if (p >= n) return fin;
      const k = Math.max(0, Math.floor(p));
      const a = def.marcas[k] ?? 0;
      const b = def.marcas[k + 1] ?? fin;
      return a + (p - k) * (b - a);
    };
    let tLinea = 0;
    let congelado = ctx.reducido;
    let relojFijo: number | null = null;
    const inicio = performance.now();
    const reloj = () => (performance.now() - inicio) / 1000;
    const pintar = () => {
      for (const f of pintores) f(tLinea);
      def.ambiente?.(relojFijo ?? (congelado ? tLinea : reloj()), $, tLinea);
    };
    let raf = 0;
    let estuvo = false;
    const host = raiz.host;
    const bucle = () => {
      if (host.isConnected) estuvo = true;
      else if (estuvo) return; // la escena salió del escenario: se apaga sola
      if (!congelado && def.ambiente) def.ambiente(reloj(), $, tLinea);
      raf = requestAnimationFrame(bucle);
    };
    if (def.ambiente) raf = requestAnimationFrame(bucle);
    return {
      ir(p) {
        tLinea = tiempo(p);
        tl.seek(tLinea, true);
        pintar();
      },
      congelar(si) {
        congelado = si;
        pintar();
      },
      reloj(t) {
        relojFijo = t;
        pintar();
      },
      destruir() {
        cancelAnimationFrame(raf);
        tl.kill();
      },
      cara(p) {
        const lugares = (def.cara ?? []).filter((l) => p >= l.desde);
        const l = lugares[lugares.length - 1];
        return l ? { x: l.x, y: l.y, d: l.d } : null;
      },
    };
  };
}
