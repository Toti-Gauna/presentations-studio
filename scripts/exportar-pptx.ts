// PPTX de contingencia: una imagen 1920×1080 por diapositiva (la misma que el PDF) con el guion y las notas
// en las notas del orador. No es editable como diapositiva: es un respaldo para abrir en PowerPoint o Keynote.
// Requiere `npm run build` y python3 con python-pptx (pip install python-pptx).
// Uso: npm run exportar:pptx -- --deck=handyx-aticma --version=evento [--sin-anexos]
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { args, playwright, servirDist } from './util.ts';

const a = args();
const deck = a['deck'] ?? 'handyx-aticma';
const version = a['version'] ?? 'evento';
const dir = `salida/pptx/${deck}-${version}`;
rmSync(dir, { recursive: true, force: true });
mkdirSync(dir, { recursive: true });
interface EscenaJson { id: string; duracion: number; guion: string; notas?: string }
const d = JSON.parse(readFileSync(`decks/${deck}/deck.json`, 'utf8')) as { escenas: EscenaJson[]; versiones: Array<{ id: string; escenas: string[]; anexos?: string[]; duraciones?: Record<string, number> }> };
const v = d.versiones.find((x) => x.id === version);
if (!v) throw new Error(`versión desconocida: ${version}`);
const porId = new Map(d.escenas.map((e) => [e.id, e]));
const escenas = [...v.escenas, ...(v.anexos ?? [])].map((id) => ({ ...(porId.get(id) as EscenaJson), duracion: v.duraciones?.[id] ?? porId.get(id)?.duracion ?? 0 }));
const principales = v.escenas.length;
const srv = await servirDist();
const navegador = await playwright().chromium.launch();
try {
  const pagina = await navegador.newPage({ viewport: { width: 1920, height: 1080 } });
  const q = new URLSearchParams({ deck, version, movimiento: 'reducido', ...(a['sin-anexos'] ? { anexos: 'no' } : {}) });
  await pagina.goto(`${srv.url}/imprimir/?${q}`);
  await pagina.waitForSelector('body[data-listo="1"]', { timeout: 30_000 });
  await pagina.waitForTimeout(500);
  const hojas = pagina.locator('section.hoja[data-escena]');
  const n = await hojas.count();
  const diapositivas: Array<{ imagen: string; notas: string; escena: string; paso: number }> = [];
  for (let k = 0; k < n; k++) {
    const hoja = hojas.nth(k);
    const id = (await hoja.getAttribute('data-escena')) ?? '';
    const paso = Number(await hoja.getAttribute('data-paso'));
    const i = escenas.findIndex((e) => e.id === id);
    const e = escenas[i];
    const imagen = `${dir}/${String(k + 1).padStart(2, '0')}.png`;
    await hoja.locator('.marco').screenshot({ path: imagen });
    const encabezado = i < principales ? `Diapositiva ${i + 1} de ${principales} · ${e?.duracion ?? ''} s` : 'Anexo · fuera del cronómetro';
    diapositivas.push({ imagen, escena: id, paso, notas: paso > 0 ? '(Continúa la misma diapositiva.)' : `${encabezado}\n\nGUION\n${e?.guion ?? ''}\n\nNOTAS\n${e?.notas ?? ''}` });
  }
  const manifiesto = `${dir}/manifiesto.json`;
  writeFileSync(manifiesto, JSON.stringify({ titulo: `${deck} · ${version}`, diapositivas }, null, 1));
  const archivo = `salida/pptx/${deck}-${version}.pptx`;
  execFileSync('python3', ['-I', 'scripts/armar-pptx.py', manifiesto, archivo], { stdio: 'inherit' });
  console.log(`PPTX → ${archivo} (${diapositivas.length} diapositivas)`);
} finally {
  await navegador.close();
  await srv.cerrar();
}
