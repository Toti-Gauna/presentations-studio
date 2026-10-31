// QR: definición (esquema) → URL codificada → matriz → SVG/PNG. El render no conoce la marca.
// El QR privado de control usa la misma generación de matriz pero nunca se define en el deck.
import { encode } from 'uqr';
import type { QrPublico } from './esquema.ts';

/** Destino final al que debe llegar el visitante (con parámetros de campaña si los hay). */
export function destinoActivo(q: QrPublico): string {
  const base = q.destinos[q.activo] ?? q.destinos.A;
  const url = new URL(base);
  if (q.campania) {
    url.searchParams.set('utm_source', q.campania.source);
    url.searchParams.set('utm_medium', q.campania.medium);
    url.searchParams.set('utm_campaign', q.campania.campaign);
    if (q.campania.content) url.searchParams.set('utm_content', q.campania.content);
  }
  return url.toString();
}

/** Lo que queda impreso en el QR: la URL estable (si se usa) o el destino directo. */
export function urlCodificada(q: QrPublico): string {
  return q.modo === 'estable' && q.urlEstable ? q.urlEstable : destinoActivo(q);
}

export interface Matriz {
  tamano: number;
  modulos: boolean[][];
}

/** ECC "M" + 4 módulos de margen (zona silenciosa mínima del estándar). */
export function matriz(texto: string, margen = 4): Matriz {
  const r = encode(texto, { ecc: 'M', border: margen });
  return { tamano: r.size, modulos: r.data };
}

/** SVG con un único path (nítido a cualquier escala, liviano). */
export function svg(texto: string, opciones: { oscuro?: string; claro?: string; titulo?: string } = {}): string {
  const { tamano, modulos } = matriz(texto);
  const oscuro = opciones.oscuro ?? '#000000';
  const claro = opciones.claro ?? '#FFFFFF';
  let d = '';
  for (let y = 0; y < tamano; y++) {
    let x = 0;
    while (x < tamano) {
      if (modulos[y]?.[x]) {
        const inicio = x;
        while (x < tamano && modulos[y]?.[x]) x++;
        d += `M${inicio} ${y}h${x - inicio}v1h${inicio - x}z`;
      } else x++;
    }
  }
  const titulo = opciones.titulo ? `<title>${escapar(opciones.titulo)}</title>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${tamano} ${tamano}" shape-rendering="crispEdges" role="img">${titulo}<rect width="${tamano}" height="${tamano}" fill="${claro}"/><path d="${d}" fill="${oscuro}"/></svg>`;
}

export function escapar(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);
}

/** Contraste WCAG entre dos colores hex (#rrggbb). Para QR pedimos ≥ 7:1. */
export function contraste(a: string, b: string): number {
  const lum = (hex: string) => {
    const n = parseInt(hex.slice(1), 16);
    const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    }) as [number, number, number];
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x) as [number, number];
  return (l1 + 0.05) / (l2 + 0.05);
}
