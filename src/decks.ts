// Registro de presentaciones: carga y valida cada deck con su tema, afirmaciones y QR.
// Con VITE_PUBLICADA=<etiqueta> el build usa la versión congelada (decks/<id>/publicadas/<etiqueta>/).
import { validarPaquete, type Paquete, type Resultado } from './core/validar.ts';
import { huella } from './core/afirmaciones.ts';

const json = (patron: Record<string, unknown>) => patron;
const decks = json(import.meta.glob('/decks/*/deck.json', { eager: true, import: 'default' }));
const afirmaciones = json(import.meta.glob('/decks/*/afirmaciones.json', { eager: true, import: 'default' }));
const qrs = json(import.meta.glob('/decks/*/qr.json', { eager: true, import: 'default' }));
const publicadas = json(import.meta.glob('/decks/*/publicadas/*/*.json', { eager: true, import: 'default' }));
const temas = json(import.meta.glob('/brands/*/tema.json', { eager: true, import: 'default' }));
const recursos = import.meta.glob('/brands/*/assets/**/*.{webp,png,jpg,svg,mp4,webm,mp3}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

const PUBLICADA = import.meta.env['VITE_PUBLICADA'] as string | undefined;

export interface Cargado extends Resultado {
  id: string;
  huella: string;
  publicada: string | null;
}

export function idsDeDecks(): string[] {
  return Object.keys(decks).map((k) => k.split('/')[2] as string).sort();
}

export function cargar(id: string): Cargado {
  const congelada = PUBLICADA ? `/decks/${id}/publicadas/${PUBLICADA}/` : null;
  const leer = (nombre: string, fuente: Record<string, unknown>) => (congelada && publicadas[congelada + nombre]) ?? fuente[`/decks/${id}/${nombre}`];
  const deck = leer('deck.json', decks);
  if (!deck) return { ok: false, errores: [`no existe el deck "${id}"`], avisos: [], id, huella: '', publicada: null };
  const temaId = (deck as { tema?: string }).tema ?? '';
  const datosDe = (deck as { datosDe?: string }).datosDe;
  const datos = (nombre: string, fuente: Record<string, unknown>) =>
    (congelada && publicadas[congelada + nombre]) ?? fuente[`/decks/${datosDe ?? id}/${nombre}`] ?? [];
  const entrada = { deck, tema: temas[`/brands/${temaId}/tema.json`], afirmaciones: datos('afirmaciones.json', afirmaciones), qrs: datos('qr.json', qrs) };
  const r = validarPaquete(entrada);
  return { ...r, id, huella: huella(JSON.stringify(entrada)), publicada: congelada && publicadas[congelada + 'deck.json'] ? (PUBLICADA as string) : null };
}

/** URL servible de un recurso de marca (o '' si falta: el render muestra el faltante). */
export function urlRecurso(tema: string, archivo: string): string {
  return recursos[`/brands/${tema}/assets/${archivo}`] ?? '';
}

export function parametros(): { deck: string; version: string | null } {
  const p = new URLSearchParams(location.search);
  const porDefecto = (import.meta.env['VITE_DECK'] as string | undefined) ?? 'handyx';
  const ids = idsDeDecks();
  const deck = p.get('deck') ?? (ids.includes(porDefecto) ? porDefecto : (ids[0] ?? ''));
  return { deck, version: p.get('version') };
}

export type { Paquete };
