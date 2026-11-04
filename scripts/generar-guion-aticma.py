"""Genera docs/handyx/aticma-guion.md desde decks/handyx-aticma/deck.json (fuente de verdad).
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
    "# Handyx · pitch ATICMA 2026 (guion sincronizado)", "",
    "> Generado por `python3 -I scripts/generar-guion-aticma.py` desde `decks/handyx-aticma/deck.json`. No editar a mano:",
    "> el guion literal vive en el campo `guion` de cada escena (lo ve el presentador en sus notas).", "",
    f"Guion oficial de Ignacio (prompt maestro del 04/11/2026), literal. Versión `{v['id']}`: "
    f"{len(v['escenas'])} diapositivas principales y {len(v['anexos'])} láminas de respaldo.", "",
    "## Ritmo", "",
    f"- Palabras del guion: **{total}**.",
    f"- Duración objetivo: {v['duracionObjetivo']} s. **No medida**: se mide con el modo de ensayo del presentador (▶ Reloj → ■ Finalizar).",
    f"- **Riesgo de tiempo:** {total} palabras en 180 s exigen {round(total / 3)} palabras por minuto. A ritmo de pitch (≈ 140 ppm) son {mmss(round(total / 140 * 60))}; a 125 ppm, {mmss(round(total / 125 * 60))}. ⚠ = tramo por encima de 140 ppm.",
    "- Ajustes posibles para entrar holgado: [`aticma-ajustes-sugeridos.md`](aticma-ajustes-sugeridos.md) (no aplicados: el guion de las notas es literal).",
    "- Avance en la diapositiva 7: → al decir «Hoy empezamos en Mar del Plata».", "",
    "| # | Diapositiva | Tramo | s | Palabras | Ritmo implícito | La voz cuenta | La pantalla amplía |", "|---|---|---|---|---|---|---|---|",
]
t = 0
VOZ = {
    'a-odisea': ('Presentación, la odisea, la doble necesidad', 'Logo, casa con algo roto y profesional; encontrar, coordinar, organizar'),
    'a-handia': ('«Imaginen algo»: HandIA y el camino directo por oficio', 'Concepto de HandIA rotulado + capturas reales del pedido por oficio'),
    'a-profesional': ('Trabajos, ingresos, gastos, herramientas; IA a futuro', 'Agenda y caja reales; gastos y herramientas como propuesta; visión IA'),
    'a-empezamos': ('Apps desarrolladas, porteros, primeros trabajos y comisiones', 'Checklist de evidencia (sin cantidades sin conciliar) + inicio de las dos apps'),
    'a-mercado': ('6 profesiones, 260 mil hogares, 20 %, USD 100.000, 72 y 4 de cada 10', 'Cuenta: hogares × 1 arreglo × USD 40 ≈ USD 10,4 M/año; 20 % del trimestre ≈ 13.000 trabajos ≈ USD 78.000 (USD 100.000 pide ticket ≈ USD 51)'),
    'a-competencia': ('«La conocemos»: comisión al profesional vs. 15 % al usuario', 'Mapa por modelo de cobro (comisión, contacto, suscripción, cero temporal) con Argentina, región y EE. UU./Europa; reparto de $ 115.000'),
    'a-equipo': ('Equipo, agentes de IA, USD 100.000, Silicon Valley, cierre', 'Equipo e inversión → (paso 2) «Hoy empezamos… arreglar el mundo» con los Handys'),
}
for i, sid in enumerate(v['escenas'], 1):
    e = S[sid]; s = v.get('duraciones', {}).get(sid, e['duracion'])
    voz, pant = VOZ.get(sid, ('', ''))
    ppm = round(palabras(e['guion']) / s * 60)
    md.append(f"| {i} | {e['titulo']} | {mmss(t)}–{mmss(t + s)} | {s} | {palabras(e['guion'])} | {ppm} ppm{' ⚠' if ppm > 140 else ''} | {voz} | {pant} |")
    t += s
md += ["", "## Guion literal", ""]
for i, sid in enumerate(v['escenas'], 1):
    e = S[sid]
    md += [f"### Diapositiva {i} · {e['titulo']}", "", *[f"> {l}" if l else ">" for l in e['guion'].split('\n')], ""]
md += ["## Anexos (fuera de los 180 segundos; se abren con Mayús + letra o desde el índice)", "", "| Atajo | Anexo | Para qué |", "|---|---|---|"]
for k, sid in enumerate(v['anexos']):
    e = S[sid]
    md.append(f"| Mayús + {'ABCDEFGHIJKLMOPQSTUVWXYZ'[k]} | {e['titulo']} | {e['objetivo']} |")
md += ["", "Volver a la última diapositiva principal: tecla **0**. Avanzar (→, espacio, clicker, celular) nunca entra a los anexos.", ""]
salida = '\n'.join(md)
ruta = 'docs/handyx/aticma-guion.md'
if '--comprobar' in sys.argv:
    actual = open(ruta).read() if __import__('os').path.exists(ruta) else ''
    if actual != salida:
        print(f'{ruta} no está al día: corré python3 -I scripts/generar-guion-aticma.py'); sys.exit(1)
    print(f'{ruta} al día ({total} palabras)'); sys.exit(0)
open(ruta, 'w').write(salida)
print(f'{ruta} · {total} palabras')
