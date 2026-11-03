"""Genera docs/handyx/aticma-3min-guion.md desde decks/handyx-aticma/deck.json (fuente de verdad).
Uso: python3 -I scripts/generar-guion-aticma.py   ·   --comprobar: falla si el archivo no está al día."""
import json, re, sys

d = json.load(open('decks/handyx-aticma/deck.json'))
S = {e['id']: e for e in d['escenas']}
v = d['versiones'][0]
PALABRA = re.compile(r"[\wÁÉÍÓÚáéíóúÑñÜü]+")

def palabras(t):
    return len(PALABRA.findall(t))

def mmss(s):
    return f"{s // 60}:{s % 60:02d}"

total = sum(palabras(S[i]['guion']) for i in v['escenas'])
md = [
    "# Handyx · pitch ATICMA de tres minutos (guion sincronizado)", "",
    "> Generado por `python3 -I scripts/generar-guion-aticma.py` desde `decks/handyx-aticma/deck.json`. No editar a mano:",
    "> el guion literal vive en el campo `guion` de cada escena (lo ve el presentador en sus notas).", "",
    f"Versión abreviada del 03/11/2026 (pedido de Ignacio). Sustituye el corte de 375 palabras. Versión `{v['id']}`: "
    f"{len(v['escenas'])} pantallas principales, {len(v['anexos'])} anexos, modo evento estático (`movimiento: {v.get('movimiento', 'completo')}`).", "",
    "## Ritmo", "",
    f"- Palabras del guion: **{total}**. A 120–125 palabras por minuto: "
    f"{mmss(round(total / 125 * 60))}–{mmss(round(total / 120 * 60))} de voz; quedan "
    f"{v['duracionObjetivo'] - round(total / 120 * 60)}–{v['duracionObjetivo'] - round(total / 125 * 60)} s para pausas.",
    f"- Duración objetivo: {v['duracionObjetivo']} s. **No medida**: falta la lectura cronometrada de Ignacio (objetivo de ensayo: cerrar entre 2:50 y 3:00).",
    "- No acelerar para compensar exceso de pantalla: si algo no entra, va al anexo.", "",
    "| # | Pantalla | Tramo | s | Palabras | La voz cuenta | La pantalla amplía |", "|---|---|---|---|---|---|---|",
]
t = 0
VOZ = {
    'a-oportunidad': ('Pregunta real, dos apps, cinco trabajos', '56 registros, fecha objetivo 10/11, dos apps'),
    'a-herramientas': ('0 % profesional; herramientas por oficio y feedback IA; claridad para el cliente; 15 %', 'Esquema conceptual; valoraciones → IA → sugerencias; agenda, presupuestos, materiales, ingresos/costos; comparar y seguir'),
    'a-escala': ('Objetivos USD 100.000 trimestrales y 72 a 2027; Business; Argentina/Latinoamérica', 'Restaurante → software → Handyx → red local; alternativas reales; objetivos ≠ resultados'),
    'a-etapa': ('Fundador y pareja, USD 300.000, mentores y propósito', 'Roles, agentes IA supervisados, destinos generales, frase de cierre'),
}
for i, sid in enumerate(v['escenas'], 1):
    e = S[sid]; s = v.get('duraciones', {}).get(sid, e['duracion'])
    voz, pant = VOZ.get(sid, ('', ''))
    md.append(f"| {i} | {e['titulo']} | {mmss(t)}–{mmss(t + s)} | {s} | {palabras(e['guion'])} | {voz} | {pant} |")
    t += s
md += ["", "## Guion literal", ""]
for i, sid in enumerate(v['escenas'], 1):
    e = S[sid]
    md += [f"### Diapositiva {i} · {e['titulo']}", "", *[f"> {l}" if l else ">" for l in e['guion'].split('\n')], ""]
md += ["## Anexos (fuera de los 180 segundos; se abren con Mayús + letra o desde el índice)", "", "| Atajo | Anexo | Para qué |", "|---|---|---|"]
for k, sid in enumerate(v['anexos']):
    e = S[sid]
    md.append(f"| Mayús + {'ABCDEFGHIJ'[k]} | {e['titulo']} | {e['objetivo']} |")
md += ["", "Volver a la última pantalla principal: tecla **0**. Avanzar (→, espacio, clicker, celular) nunca entra a los anexos.", ""]
salida = '\n'.join(md)
ruta = 'docs/handyx/aticma-3min-guion.md'
if '--comprobar' in sys.argv:
    actual = open(ruta).read() if __import__('os').path.exists(ruta) else ''
    if actual != salida:
        print(f'{ruta} no está al día: corré python3 -I scripts/generar-guion-aticma.py'); sys.exit(1)
    print(f'{ruta} al día ({total} palabras)'); sys.exit(0)
open(ruta, 'w').write(salida)
print(f'{ruta} · {total} palabras')
