// Lanzador / vista previa: decks disponibles, versiones, duración y validación.
import '../estilos/base.css';
import { cargar, idsDeDecks } from '../decks.ts';
import { h } from '../render/dom.ts';

const raiz = document.getElementById('app') as HTMLElement;
raiz.style.cssText = 'font-family:system-ui,sans-serif;max-width:980px;margin:0 auto;padding:24px;color:#0E1D36';
raiz.append(h('h1', {}, 'Presentations Studio'), h('p', {}, 'Elegí presentación y versión. La pantalla pública va al proyector; la del presentador queda en tu computadora.'));
for (const id of idsDeDecks()) {
  const c = cargar(id);
  const sec = h('section', { style: 'border:1px solid #DADFE8;border-radius:12px;padding:16px;margin:16px 0' });
  sec.append(h('h2', {}, c.paquete?.deck.titulo ?? id), h('p', { style: 'font:12px ui-monospace,monospace' }, `deck ${id} · huella ${c.huella.slice(0, 8)}${c.publicada ? ` · versión congelada ${c.publicada}` : ' · archivos de trabajo'}`));
  if (!c.ok) sec.append(h('p', { style: 'color:#D93025;font-weight:700' }, 'No pasa la validación:'), h('ul', {}, ...c.errores.map((e) => h('li', {}, e))));
  for (const v of c.paquete?.deck.versiones ?? []) {
    const total = v.escenas.reduce((t, e) => t + (c.paquete?.deck.escenas.find((x) => x.id === e)?.duracion ?? 0), 0);
    const q = `?deck=${id}&version=${v.id}`;
    sec.append(
      h('div', { style: 'display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin:8px 0' },
        h('strong', {}, v.titulo),
        h('span', {}, `${v.escenas.length} escenas · ${total}s de ${v.duracionObjetivo}s · ${v.audiencia}`),
        h('a', { href: `presentador/${q}` }, 'Presentador'),
        h('a', { href: `presentar/${q}` }, 'Pantalla pública'),
        h('a', { href: `imprimir/${q}` }, 'Exportación'),
        h('a', { href: `imprimir/${q}&modo=lectura` }, 'Documento de lectura'),
      ),
    );
  }
  if (c.avisos.length) sec.append(h('details', {}, h('summary', {}, `${c.avisos.length} avisos (arte temporal, QR provisorios…)`), h('ul', {}, ...c.avisos.map((a) => h('li', {}, a)))));
  raiz.append(sec);
}
