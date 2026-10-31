// Afirmaciones: única fuente de datos y su rotulado. Un texto público referencia una cifra con
// {{ID}} y el motor inserta el valor formateado; el rótulo (Proyección, Objetivo, Supuesto...) lo
// agrega el render según el tipo, no el autor, para que no se pierda en las notas.
import type { Afirmacion } from './esquema.ts';

const REF = /\{\{([A-Z][A-Z0-9-]{1,40})\}\}/g;

export function referencias(texto: string): string[] {
  return [...texto.matchAll(REF)].map((m) => m[1] as string);
}

const miles = (n: number) => Math.round(n).toLocaleString('es-AR').replace(/ /g, ' ');

export function formatear(a: Afirmacion): string {
  if (a.valor === null) return 's/d';
  if (typeof a.valor === 'string') return a.valor;
  switch (a.formato) {
    case 'ars':
      return `$ ${miles(a.valor)}`;
    case 'millones':
      return `$ ${miles(a.valor / 1e6)} M`;
    case 'porcentaje':
      return `${a.valor.toLocaleString('es-AR')} %`;
    case 'entero':
      return miles(a.valor);
    default:
      return String(a.valor);
  }
}

export const ROTULOS: Record<Afirmacion['tipo'], string> = {
  observado: 'Dato observado',
  informado: 'Dato informado por el fundador',
  supuesto: 'Supuesto',
  proyeccion: 'Proyección',
  meta: 'Objetivo',
  ejemplo: 'Ejemplo ilustrativo',
};

/** Rótulo visible obligatorio: los datos observados no lo necesitan; el resto sí. */
export function rotulo(a: Afirmacion): string | null {
  if (a.tipo === 'observado') return null;
  const corte = a.corte.split('-').reverse().join('/');
  return `${ROTULOS[a.tipo]} · corte ${corte}`;
}

export function interpolar(texto: string, mapa: ReadonlyMap<string, Afirmacion>): string {
  return texto.replace(REF, (_, id: string) => {
    const a = mapa.get(id);
    return a ? formatear(a) : `{{${id}}}`;
  });
}

/** 53 bits de FNV/murmur combinados → huella hex de contenido (no es criptográfica). */
export function huella(texto: string): string {
  let h1 = 0xdeadbeef ^ texto.length;
  let h2 = 0x41c6ce57 ^ texto.length;
  for (let i = 0; i < texto.length; i++) {
    const c = texto.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h2 >>> 0).toString(16).padStart(8, '0') + (h1 >>> 0).toString(16).padStart(8, '0');
}
