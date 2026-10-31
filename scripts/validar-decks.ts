// Valida todos los decks (esquema + referencias cruzadas + duración por versión). Sale con 1 si hay errores.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { validarPaquete } from '../src/core/validar.ts';

const leer = (p: string, porDefecto: unknown = []) => (existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : porDefecto);
let fallas = 0;
for (const id of readdirSync('decks')) {
  const deck = leer(`decks/${id}/deck.json`, null) as { tema?: string; versiones?: Array<{ id: string; escenas: string[]; duraciones?: Record<string, number> }>; escenas?: Array<{ id: string; duracion: number }> } | null;
  if (!deck) continue;
  const fuente = (deck as { datosDe?: string }).datosDe ?? id;
  const r = validarPaquete({ deck, tema: leer(`brands/${deck.tema}/tema.json`, null), afirmaciones: leer(`decks/${fuente}/afirmaciones.json`), qrs: leer(`decks/${fuente}/qr.json`) });
  const durs = (deck.versiones ?? []).map((v) => `${v.id} ${v.escenas.reduce((t, e) => t + (v.duraciones?.[e] ?? deck.escenas?.find((x) => x.id === e)?.duracion ?? 0), 0)}s`).join(' · ');
  console.log(`${r.ok ? '✓' : '✗'} ${id} · ${durs}`);
  for (const e of r.errores) console.log(`   error: ${e}`);
  for (const a of r.avisos) console.log(`   aviso: ${a}`);
  if (!r.ok) fallas++;
}
process.exit(fallas ? 1 : 0);
