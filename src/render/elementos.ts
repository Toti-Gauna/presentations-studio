// Construye el DOM de cada elemento. Cada pieza que aparece en un paso lleva data-paso y
// data-entrada; el motor de movimiento las anima. El render no conoce la marca.
import type { Afirmacion, Elemento, QrPublico, Tema } from '../core/esquema.ts';
import { formatear, interpolar, rotulo } from '../core/afirmaciones.ts';
import { svg, urlCodificada } from '../core/qr.ts';
import { h, marcado } from './dom.ts';
import { construirPersonaje } from './personajes.ts';

export interface Contexto {
  tema: Tema;
  afirmaciones: ReadonlyMap<string, Afirmacion>;
  qrs: ReadonlyMap<string, QrPublico>;
  url: (archivo: string) => string;
  recursos: ReadonlyMap<string, { archivo: string; tipo: string }>;
}

let traer: { por: string; desde: string } | null = null;
const animable = (el: HTMLElement, paso: number, entrada: string) => {
  el.dataset['paso'] = String(paso);
  el.dataset['entrada'] = entrada;
  if (entrada === 'traer' && traer) {
    el.dataset['traidoPor'] = traer.por;
    el.dataset['desde'] = traer.desde;
  }
  return el;
};

function chipRotulo(a: Afirmacion | undefined): HTMLElement | null {
  const r = a ? rotulo(a) : null;
  return r ? h('span', { class: `rotulo rotulo-${a?.tipo}` }, r) : null;
}

/** Rótulos de todas las afirmaciones citadas en un texto (proyección, objetivo, supuesto...). */
function rotulosDe(texto: string, ctx: Contexto): HTMLElement[] {
  const vistos = new Set<string>();
  const out: HTMLElement[] = [];
  for (const m of texto.matchAll(/\{\{([A-Z][A-Z0-9-]{1,40})\}\}/g)) {
    const a = ctx.afirmaciones.get(m[1] as string);
    if (!a || vistos.has(a.tipo)) continue;
    vistos.add(a.tipo);
    const c = chipRotulo(a);
    if (c) out.push(c);
  }
  return out;
}

const html = (texto: string, ctx: Contexto) => marcado(interpolar(texto, ctx.afirmaciones));

export function construir(el: Elemento, ctx: Contexto): HTMLElement {
  traer = el.entrada === 'traer' && el.traidoPor ? { por: el.traidoPor, desde: el.desde } : null;
  const raiz = h('div', { class: `el el-${el.tipo} area-${el.area}${el.enfasis ? ' enfasis' : ''}`, 'data-id': el.id });
  if (el.area === 'libre' && el.pos) {
    raiz.style.setProperty('--x', `${el.pos.x}%`);
    raiz.style.setProperty('--y', `${el.pos.y}%`);
    if (el.pos.w) raiz.style.setProperty('--w', `${el.pos.w}%`);
  }
  switch (el.tipo) {
    case 'titulo': {
      const t = h(`h${el.nivel}` as 'h1');
      t.innerHTML = html(el.texto, ctx);
      raiz.append(animable(t, el.paso, el.entrada), ...rotulosDe(el.texto, ctx).map((r) => animable(r, el.paso, 'fundido')));
      break;
    }
    case 'texto': {
      const p = h('p', { class: `t-${el.tamano}` });
      p.innerHTML = html(el.texto, ctx);
      raiz.append(animable(p, el.paso, el.entrada), ...rotulosDe(el.texto, ctx).map((r) => animable(r, el.paso, 'fundido')));
      break;
    }
    case 'etiqueta': {
      const s = h('span', { class: `chip chip-${el.tono}` });
      s.innerHTML = html(el.texto, ctx);
      raiz.append(animable(s, el.paso, el.entrada));
      break;
    }
    case 'cifra': {
      const a = ctx.afirmaciones.get(el.afirmacion);
      const valor = h('div', { class: 'cifra-valor' }, a ? formatear(a) : 's/d');
      if (a && typeof a.valor === 'number' && el.entrada === 'contar') {
        valor.dataset['contar'] = String(a.valor);
        valor.dataset['formato'] = a.formato;
      }
      const ley = h('div', { class: 'cifra-leyenda' });
      ley.innerHTML = html(el.leyenda, ctx);
      const caja = h('div', { class: 'cifra' }, valor, ley);
      if (el.detalle) {
        const d = h('div', { class: 'cifra-detalle' });
        d.innerHTML = html(el.detalle, ctx);
        caja.append(d);
      }
      const r = chipRotulo(a);
      if (r) caja.append(r);
      raiz.append(animable(caja, el.paso, el.entrada === 'contar' ? 'subir' : el.entrada));
      break;
    }
    case 'lista': {
      const lista = h(el.estilo === 'numerada' || el.estilo === 'escalera' ? 'ol' : 'ul', { class: `lista lista-${el.estilo}`, style: `--n:${el.items.length}` });
      for (const [i, it] of el.items.entries()) {
        const li = h('li', el.estilo === 'escalera' ? { style: `--h:${Math.round(((i + 1) / el.items.length) * 100)}%` } : {});
        li.innerHTML = html(it.texto, ctx);
        lista.append(animable(li, it.paso ?? el.paso, el.entrada === 'ninguna' ? 'ninguna' : 'subir'));
        const r = rotulosDe(it.texto, ctx);
        if (r.length) li.append(' ', ...r);
      }
      raiz.append(lista);
      break;
    }
    case 'flujo': {
      const fila = h('ol', { class: 'flujo', style: `--n:${el.nodos.length}` });
      el.nodos.forEach((n, i) => {
        const nodo = h('li', { class: 'flujo-nodo' }, h('span', { class: 'flujo-num' }, String(i + 1)));
        const t = h('strong');
        t.innerHTML = html(n.texto, ctx);
        nodo.append(t, ...rotulosDe(n.texto, ctx));
        if (n.detalle) {
          const d = h('small');
          d.innerHTML = html(n.detalle, ctx);
          nodo.append(d);
        }
        fila.append(animable(nodo, n.paso ?? el.paso, 'escala'));
      });
      raiz.append(fila);
      break;
    }
    case 'grafico': {
      const datos = el.series.map((s) => {
        const a = s.afirmacion ? ctx.afirmaciones.get(s.afirmacion) : undefined;
        return { etiqueta: s.etiqueta, valor: typeof a?.valor === 'number' ? a.valor : (s.valor ?? 0), afirmacion: a };
      });
      const max = Math.max(...datos.map((d) => d.valor), 1);
      const figura = h('figure', { class: `grafico grafico-${el.forma}` });
      const cab = h('figcaption', {}, h('strong', {}, el.titulo), h('span', { class: 'rotulo rotulo-proyeccion' }, el.rotulo));
      const barras = h('div', { class: 'barras', role: 'img', 'aria-label': `${el.titulo}. ${datos.map((d) => `${d.etiqueta}: ${d.valor} ${el.unidad}`).join('; ')}` });
      datos.forEach((d, i) => {
        const valor = d.afirmacion ? formatear(d.afirmacion) : `${d.valor.toLocaleString('es-AR')}`;
        const barra = h('div', { class: 'barra' }, h('span', { class: 'barra-valor' }, `${valor}${el.unidad ? ' ' + el.unidad : ''}`), h('div', { class: 'barra-cuerpo', style: `--alto:${(d.valor / max) * 100}%` }), h('span', { class: 'barra-etiqueta' }, d.etiqueta));
        barras.append(animable(barra, el.paso, 'barra'));
        barra.style.setProperty('--i', String(i));
      });
      figura.append(cab, barras);
      raiz.append(animable(figura, el.paso, 'fundido'));
      break;
    }
    case 'tabla': {
      const t = h('table', { class: 'tabla' });
      const cab = h('tr');
      for (const c of el.columnas) {
        const th = h('th');
        th.innerHTML = html(c, ctx);
        cab.append(th);
      }
      t.append(h('thead', {}, cab));
      const cuerpo = h('tbody');
      for (const f of el.filas) {
        const tr = h('tr');
        for (const c of f) {
          const td = h('td');
          td.innerHTML = html(c, ctx);
          tr.append(td);
        }
        cuerpo.append(tr);
      }
      t.append(cuerpo);
      raiz.append(animable(t, el.paso, el.entrada), ...rotulosDe([...el.columnas, ...el.filas.flat()].join(' '), ctx).map((r) => animable(r, el.paso, 'fundido')));
      break;
    }
    case 'qr': {
      const q = ctx.qrs.get(el.qr);
      if (!q) break;
      const url = urlCodificada(q);
      const cuadro = h('div', { class: 'qr-cuadro' });
      cuadro.innerHTML = svg(url, { titulo: `Código QR: ${q.etiqueta}` });
      const enlace = h('a', { class: 'qr-url', href: url, target: '_blank', rel: 'noopener' }, q.textoCorto);
      const tarjeta = h('div', { class: `qr${q.definitivo ? '' : ' qr-provisorio'}` }, h('div', { class: 'qr-etiqueta' }, q.etiqueta), cuadro, enlace);
      if (!q.definitivo) tarjeta.append(h('span', { class: 'chip chip-aviso' }, 'Destino provisorio'));
      raiz.append(animable(tarjeta, el.paso, el.entrada));
      break;
    }
    case 'personaje': {
      const p = construirPersonaje(el, ctx);
      raiz.append(p);
      break;
    }
    case 'imagen': {
      const r = ctx.recursos.get(el.recurso);
      const src = r ? ctx.url(r.archivo) : '';
      const img = src ? h('img', { src, alt: el.alt, decoding: 'async' }) : h('div', { class: 'faltante' }, `Falta: ${el.alt}`);
      raiz.append(animable(img, el.paso, el.entrada));
      break;
    }
    case 'telefono': {
      const marco = h('div', { class: 'tel', style: `--alto:${el.alto}` }, h('div', { class: 'tel-isla' }));
      const pantalla = h('div', { class: 'tel-pantalla' });
      el.pantallas.forEach((p, i) => {
        const r = ctx.recursos.get(p.recurso);
        const src = r ? ctx.url(r.archivo) : '';
        const img = src ? h('img', { src, alt: p.alt, decoding: 'async', draggable: 'false' }) : h('div', { class: 'faltante' }, `Falta captura: ${p.alt}`);
        // La primera pantalla entra con el teléfono; las siguientes se deslizan encima en su paso.
        pantalla.append(i === 0 ? img : animable(img, p.paso, 'deslizarPantalla'));
      });
      marco.append(pantalla);
      const caja = h('figure', { class: 'tel-caja' }, marco);
      if (el.leyenda) {
        const c = h('figcaption', { class: 'tel-leyenda' });
        c.innerHTML = html(el.leyenda, ctx);
        caja.append(c);
      }
      raiz.append(animable(caja, el.paso, el.entrada));
      break;
    }
    case 'video': {
      const r = ctx.recursos.get(el.recurso);
      const p = ctx.recursos.get(el.poster);
      const src = r ? ctx.url(r.archivo) : '';
      const poster = p ? ctx.url(p.archivo) : '';
      const v = h('video', { playsinline: '', preload: 'auto', poster: poster || undefined, 'aria-label': el.alt, 'data-medio': el.recurso });
      v.muted = !el.sonido;
      v.dataset['sonido'] = el.sonido ? 'si' : 'no';
      if (el.auto) v.dataset['auto'] = 'si';
      if (src) v.src = src;
      raiz.append(animable(src ? v : h('div', { class: 'faltante' }, `Video pendiente: ${el.alt}`), el.paso, el.entrada));
      break;
    }
  }
  return raiz;
}
