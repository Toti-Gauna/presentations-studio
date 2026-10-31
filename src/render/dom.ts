import { escapar } from '../core/qr.ts';

export function h<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Record<string, string | undefined> = {}, ...hijos: Array<Node | string>): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) if (v !== undefined) el.setAttribute(k, v);
  for (const c of hijos) el.append(c);
  return el;
}

/** Texto seguro con marcado mínimo: ==resaltado== y **fuerte**. */
export function marcado(texto: string): string {
  return escapar(texto)
    .replace(/==(.+?)==/g, '<mark>$1</mark>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

/** Envuelve cada palabra en un span (tipografía cinética) conservando el marcado. */
export function palabras(nodo: HTMLElement): HTMLElement[] {
  const piezas: HTMLElement[] = [];
  const recorrer = (n: Node) => {
    for (const hijo of [...n.childNodes]) {
      if (hijo.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        for (const parte of (hijo.textContent ?? '').split(/(\s+)/)) {
          if (!parte) continue;
          if (/^\s+$/.test(parte)) frag.append(parte);
          else {
            const s = h('span', { class: 'palabra' }, parte);
            piezas.push(s);
            frag.append(s);
          }
        }
        hijo.replaceWith(frag);
      } else recorrer(hijo);
    }
  };
  recorrer(nodo);
  return piezas;
}
