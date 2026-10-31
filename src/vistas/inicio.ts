// Hub de presentaciones: elegir presentación y versión, con miniatura viva de la portada,
// duración, audiencia y estado de validación. Abre presentador, pantalla pública o exportaciones.
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource-variable/dm-sans/wght.css';
import '../estilos/base.css';
import '../estilos/escenario.css';
import '../estilos/hub.css';
import { cargar, idsDeDecks, urlRecurso, type Cargado } from '../decks.ts';
import { estadoInicial } from '../core/estado.ts';
import { escenasDeVersion } from '../core/validar.ts';
import { Reproductor } from '../render/reproductor.ts';
import type { Contexto } from '../render/elementos.ts';
import { h } from '../render/dom.ts';

const raiz = document.getElementById('app') as HTMLElement;
const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

const cargados = idsDeDecks().map(cargar);
const grupos = new Map<string, Cargado[]>();
for (const c of cargados) {
  const g = c.paquete?.deck.hub?.visible === false ? null : (c.paquete?.deck.hub?.grupo ?? 'Pruebas del motor');
  if (!g) continue;
  grupos.set(g, [...(grupos.get(g) ?? []), c]);
}

raiz.append(
  h('header', { class: 'hub-cabecera' },
    h('p', { class: 'hub-kicker' }, 'Presentations Studio'),
    h('h1', {}, 'Elegí la presentación'),
    h('p', { class: 'hub-bajada' }, 'La pantalla pública va al proyector. El presentador queda en tu computadora: desde ahí abrís la pública y emparejás el celular.'),
  ),
);

const orden = (c: Cargado) => c.paquete?.deck.hub?.orden ?? 99;
for (const [grupo, lista] of [...grupos].sort((a, b) => Math.min(...a[1].map(orden)) - Math.min(...b[1].map(orden)))) {
  const seccion = h('section', { class: 'hub-grupo' }, h('h2', {}, grupo));
  for (const c of lista.sort((a, b) => orden(a) - orden(b))) seccion.append(tarjeta(c));
  raiz.append(seccion);
}

function tarjeta(c: Cargado): HTMLElement {
  const p = c.paquete;
  const art = h('article', { class: `hub-tarjeta${c.ok ? '' : ' con-error'}`, 'data-estilo': p?.deck.hub?.estilo ?? '' });
  if (!p) {
    art.append(h('h3', {}, c.id), h('p', { class: 'hub-error' }, 'No pasa la validación:'), h('ul', {}, ...c.errores.slice(0, 8).map((e) => h('li', {}, e))));
    return art;
  }
  const mini = h('div', { class: 'hub-mini', 'aria-hidden': 'true' });
  const cuerpo = h('div', { class: 'hub-cuerpo' },
    h('h3', {}, p.deck.titulo),
    h('p', { class: 'hub-desc' }, p.deck.hub?.descripcion ?? ''),
    h('p', { class: 'hub-meta' }, `Corte ${p.deck.corte.split('-').reverse().join('/')} · ${c.publicada ? `versión congelada ${c.publicada}` : 'archivos de trabajo'} · ${c.huella.slice(0, 8)}`),
  );
  const versiones = h('ul', { class: 'hub-versiones' });
  for (const v of p.deck.versiones) {
    const total = escenasDeVersion(p.deck, v.id, false).reduce((t, e) => t + e.duracion, 0);
    const q = `?deck=${c.id}&version=${v.id}`;
    versiones.append(
      h('li', {},
        h('div', { class: 'hub-v-info' }, h('strong', {}, v.titulo), h('span', {}, `${v.escenas.length} escenas · ${mmss(total)} · ${v.audiencia}`)),
        h('div', { class: 'hub-v-acciones' },
          h('a', { class: 'btn primario', href: `presentador/${q}` }, 'Presentar'),
          h('a', { class: 'btn secundario', href: `presentar/${q}` }, 'Solo pantalla'),
          h('a', { class: 'btn secundario', href: `imprimir/${q}&modo=lectura` }, 'Lectura'),
        ),
      ),
    );
  }
  cuerpo.append(versiones);
  if (c.avisos.length) cuerpo.append(h('details', { class: 'hub-avisos' }, h('summary', {}, `${c.avisos.length} avisos`), h('ul', {}, ...c.avisos.map((a) => h('li', {}, a)))));
  art.append(mini, cuerpo);
  // Miniatura viva: primera escena de la primera versión, en su último paso, sin movimiento.
  const v0 = p.deck.versiones[0];
  if (v0) {
    const escenas = escenasDeVersion(p.deck, v0.id, false);
    const ctx: Contexto = {
      tema: p.tema,
      afirmaciones: new Map(p.afirmaciones.map((a) => [a.id, a])),
      qrs: new Map(p.qrs.map((q) => [q.id, q])),
      url: (archivo) => urlRecurso(p.tema.id, archivo),
      recursos: new Map(p.deck.recursos.map((r) => [r.id, r])),
    };
    requestAnimationFrame(() => {
      const rep = new Reproductor(mini, escenas, p.tema, ctx, { modo: 'reducido', pie: false });
      rep.mostrar({ ...estadoInicial(), escena: 0, paso: (escenas[0]?.pasos ?? 1) - 1 });
    });
  }
  return art;
}
