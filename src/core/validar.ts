// Validación cruzada de un paquete de presentación: deck + tema + afirmaciones + QR.
// Errores = impiden mostrar/publicar. Avisos = se muestran al autor (p. ej. arte temporal).
import { z } from 'zod';
import { Afirmacion, Deck, QrPublico, Tema, type Elemento, type Escena } from './esquema.ts';
import { referencias } from './afirmaciones.ts';

export interface Paquete {
  deck: Deck;
  tema: Tema;
  afirmaciones: Afirmacion[];
  qrs: QrPublico[];
}

export interface Resultado {
  ok: boolean;
  errores: string[];
  avisos: string[];
  paquete?: Paquete;
}

function textos(el: Elemento): string[] {
  switch (el.tipo) {
    case 'titulo':
    case 'texto':
    case 'etiqueta':
      return [el.texto];
    case 'cifra':
      return [el.leyenda, el.detalle ?? '', `{{${el.afirmacion}}}`];
    case 'lista':
      return el.items.map((i) => i.texto);
    case 'flujo':
      return el.nodos.flatMap((n) => [n.texto, n.detalle ?? '']);
    case 'grafico':
      return [el.titulo, el.rotulo, ...el.series.flatMap((s) => [s.etiqueta, s.afirmacion ? `{{${s.afirmacion}}}` : ''])];
    case 'tabla':
      return [...el.columnas, ...el.filas.flat()];
    default:
      return [];
  }
}

const formatear = (e: z.ZodError) => e.issues.map((i) => `${i.path.join('.') || '(raíz)'}: ${i.message}`);

export function validarPaquete(entrada: { deck: unknown; tema: unknown; afirmaciones: unknown; qrs: unknown }): Resultado {
  const errores: string[] = [];
  const avisos: string[] = [];
  const d = Deck.safeParse(entrada.deck);
  const t = Tema.safeParse(entrada.tema);
  const a = z.array(Afirmacion).safeParse(entrada.afirmaciones);
  const q = z.array(QrPublico).safeParse(entrada.qrs);
  if (!d.success) errores.push(...formatear(d.error).map((m) => `deck · ${m}`));
  if (!t.success) errores.push(...formatear(t.error).map((m) => `tema · ${m}`));
  if (!a.success) errores.push(...formatear(a.error).map((m) => `afirmaciones · ${m}`));
  if (!q.success) errores.push(...formatear(q.error).map((m) => `qr · ${m}`));
  if (!d.success || !t.success || !a.success || !q.success) return { ok: false, errores, avisos };

  const deck = d.data;
  const tema = t.data;
  const mapa = new Map(a.data.map((x) => [x.id, x]));
  const qrs = new Map(q.data.map((x) => [x.id, x]));
  if (mapa.size !== a.data.length) errores.push('afirmaciones · id repetido');
  if (qrs.size !== q.data.length) errores.push('qr · id repetido');
  if (deck.tema !== tema.id) errores.push(`deck usa tema "${deck.tema}" pero se cargó "${tema.id}"`);

  for (const af of a.data) {
    for (const dep of af.dependencias) if (!mapa.has(dep)) errores.push(`afirmación ${af.id}: dependencia inexistente ${dep}`);
    if (af.tipo === 'observado' && af.valor === 0 && af.verificacion !== 'verificado')
      errores.push(`afirmación ${af.id}: un cero observado necesita verificación (usar null si es desconocido)`);
  }

  const escenas = new Map<string, Escena>();
  for (const e of deck.escenas) {
    if (escenas.has(e.id)) errores.push(`escena repetida: ${e.id}`);
    escenas.set(e.id, e);
    if (!(e.paleta in tema.paletas)) errores.push(`escena ${e.id}: paleta "${e.paleta}" no existe en el tema`);
    const areas = new Map<string, string>();
    for (const el of e.elementos) {
      if (el.area === 'libre' || el.area === 'fondo' || e.disposicion === 'grilla' && !['arriba', 'abajo'].includes(el.area)) continue;
      const otro = areas.get(el.area);
      if (otro) errores.push(`escena ${e.id}: ${el.id} y ${otro} ocupan la misma área "${el.area}" (se superponen)`);
      areas.set(el.area, el.id);
    }
    for (const el of e.elementos) {
      for (const t of textos(el)) {
        for (const ref of referencias(t)) {
          const af = mapa.get(ref);
          if (!af) {
            errores.push(`escena ${e.id}/${el.id}: afirmación inexistente ${ref}`);
            continue;
          }
          if (af.uso === 'notas') errores.push(`escena ${e.id}/${el.id}: ${ref} es solo para notas y aparece en pantalla`);
          if (af.valor === null) errores.push(`escena ${e.id}/${el.id}: ${ref} no tiene valor (null) y aparece en pantalla`);
        }
      }
      if (el.tipo === 'qr') {
        const qr = qrs.get(el.qr);
        if (!qr) errores.push(`escena ${e.id}/${el.id}: QR inexistente ${el.qr}`);
        else if (!qr.definitivo) {
          const m = `escena ${e.id}/${el.id}: QR "${qr.id}" con destino provisorio`;
          if (deck.estado === 'final') errores.push(m);
          else avisos.push(m);
        }
      }
      if (el.tipo === 'personaje' && !(el.personaje in tema.personajes)) errores.push(`escena ${e.id}/${el.id}: personaje "${el.personaje}" no está en el tema`);
      if (el.tipo === 'grafico')
        for (const s of el.series) {
          if (s.afirmacion === undefined && (s.valor === undefined || s.valor === null)) errores.push(`escena ${e.id}/${el.id}: serie "${s.etiqueta}" sin dato`);
          const af = s.afirmacion ? mapa.get(s.afirmacion) : undefined;
          if (af && typeof af.valor !== 'number') errores.push(`escena ${e.id}/${el.id}: ${af.id} no es numérica`);
        }
      if ((el.tipo === 'imagen' || el.tipo === 'video') && !deck.recursos.some((r) => r.id === el.recurso))
        errores.push(`escena ${e.id}/${el.id}: recurso inexistente ${el.recurso}`);
    }
    for (const ref of e.referencias) if (!mapa.has(ref) && !/^(https?:|pdf:|doc:|notion:)/.test(ref)) errores.push(`escena ${e.id}: referencia desconocida ${ref}`);
  }

  for (const v of deck.versiones) {
    let total = 0;
    for (const id of [...v.escenas, ...v.anexos]) if (!escenas.has(id)) errores.push(`versión ${v.id}: escena inexistente ${id}`);
    for (const id of v.escenas) total += v.duraciones[id] ?? escenas.get(id)?.duracion ?? 0;
    for (const id of Object.keys(v.duraciones)) if (![...v.escenas, ...v.anexos].includes(id)) errores.push(`versión ${v.id}: duración para escena ajena ${id}`);
    if (total > v.duracionObjetivo + v.tolerancia) errores.push(`versión ${v.id}: dura ${total}s y el objetivo es ${v.duracionObjetivo}s (+${v.tolerancia}s)`);
    if (new Set(v.escenas).size !== v.escenas.length) errores.push(`versión ${v.id}: escena repetida en el recorrido`);
  }
  for (const r of deck.recursos) if (r.estado !== 'final') avisos.push(`recurso ${r.id}: ${r.estado}${r.respaldo ? ` (respaldo: ${r.respaldo})` : ''}`);

  const ok = errores.length === 0;
  return ok ? { ok, errores, avisos, paquete: { deck, tema, afirmaciones: a.data, qrs: q.data } } : { ok, errores, avisos };
}

/** Escenas de una versión en orden (recorrido principal + anexos al final). */
export function escenasDeVersion(deck: Deck, versionId: string, conAnexos = true): Escena[] {
  const v = deck.versiones.find((x) => x.id === versionId) ?? deck.versiones[0];
  if (!v) return [];
  const ids = conAnexos ? [...v.escenas, ...v.anexos] : v.escenas;
  return ids
    .map((id) => deck.escenas.find((e) => e.id === id))
    .filter((e): e is Escena => Boolean(e))
    .map((e) => (v.duraciones[e.id] ? { ...e, duracion: v.duraciones[e.id] as number } : e));
}
