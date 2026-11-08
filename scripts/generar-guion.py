"""Genera docs/handyx/tesis-y-guion.md desde decks/handyx/deck.json. Uso: python3 -I scripts/generar-guion.py"""
import json
d = json.load(open('decks/handyx/deck.json'))
S = {e['id']: e for e in d['escenas']}
md = ["# Tesis y guion maestro · Handyx", "", "> Generado por `python3 -I scripts/generar-guion.py` desde `decks/handyx/deck.json` (fuente de verdad). No editar a mano.", "",
 "## Tesis en una frase", "", "**En Mar del Plata, conseguir a alguien confiable para un arreglo depende del boca en boca; Handyx convierte esa búsqueda en un pedido donde el especialista pone su precio y el vecino elige, y el piloto de noviembre mide si eso genera trabajos que se repiten.**", "",
 "## Tres razones para creerla (y su respaldo)", "", "| Razón | Respaldo | Tipo | Qué falta probar |", "|---|---|---|---|",
 "| La oferta responde: 56 especialistas se registraron antes del lanzamiento | Dato informado por Ignacio (31/10), sin auditar contra el CRM | Informado | Cuántos están contactados, verificados y disponibles |",
 "| El producto existe para probarlo: landing con captación cifrada, CRM interno y prototipos de las dos apps | Repositorios auditados (31/10): probado en local, no desplegado | Observado | Que la PWA salga el 10/11 y funcione con usuarios reales |",
 "| El negocio se puede medir antes de escalar: piloto con umbrales previos y modelo con capacidad | Modelo económico con fórmulas probadas; escenarios rotulados | Proyección / plan | Demanda real por zona, repetición, contribución con tarifa |", "",
 "Lo que **no** decimos: que el mercado está validado, que no hay competencia, que los 56 están verificados o activos, que el éxito está asegurado.", "",
 "## Arco", "", "Tensión (apertura, alternativas) → descubrimiento (encuentro) → demostración rotulada (recorrido) → evidencia acotada (56) → piloto que convierte dudas en preguntas medibles → cómo se consiguen pedidos → cómo gana → quién lo ejecuta → pedido → cierre con QR.", "",
 "Paletas: problema (noche) → encuentro (azul) → solución (amarillo) → evidencia (blanco) → neutro (hueso) → pedido (azul) → cierre (tinta). El foco viaja con continuidad de la apertura al encuentro.", ""]
for v in d['versiones']:
    md += [f"## Versión {v['titulo']} · objetivo {v['duracionObjetivo']} s", f"Audiencia: {v['audiencia']}.", "", "| # | Escena | s | Clasificación | Objetivo |", "|---|---|---|---|---|"]
    tot = 0
    for i, sid in enumerate(v['escenas'], 1):
        e = S[sid]; s = v.get('duraciones', {}).get(sid, e['duracion']); tot += s
        md.append(f"| {i} | {e['titulo']} | {s} | {e['clasificacion']} | {e['objetivo']} |")
    md += ["", f"Total: **{tot} s**. Anexos: {', '.join(S[a]['titulo'] for a in v['anexos'])}.", ""]
def textos(el):
    t = el['tipo']
    if t in ('titulo', 'texto', 'etiqueta'): return el['texto']
    if t == 'cifra': return f"[cifra {{{{{el['afirmacion']}}}}}] {el['leyenda']}"
    if t == 'lista': return ' / '.join(i['texto'] for i in el['items'])
    if t == 'flujo': return ' → '.join(n['texto'] for n in el['nodos'])
    if t == 'tabla': return '[tabla] ' + ' | '.join(el['columnas'])
    if t == 'grafico': return f"[gráfico] {el['titulo']} ({el['rotulo']})"
    if t == 'qr': return f"[QR público {el['qr']}]"
    if t == 'personaje': return f"[{el['personaje']}: " + ', '.join(f"paso {a['paso']+1} {a['accion']}" for a in el['acciones']) + "]"
    if t == 'video': return f"[video {el['recurso']}]"
    return ''
md.append("## Ficha por escena\n")
for e in d['escenas']:
    md.append(f"### {e['titulo']} (`{e['id']}`) · {e['duracion']} s · {e['pasos']} pasos · paleta {e.get('paleta','neutro')} · transición {e.get('transicion','fundido')}")
    md.append(f"- **Objetivo:** {e['objetivo']}")
    md.append("- **Pantalla:** " + ' · '.join(f"(p{el.get('paso',0)+1}) {textos(el)}" for el in e['elementos']))
    md.append(f"- **Guion:** {e['guion']}")
    for k, t in (('notas', 'Notas privadas'), ('referencias', 'Datos y fuentes'), ('respaldo', 'Respaldo'), ('preguntas', 'Si preguntan')):
        v = e.get(k)
        if v: md.append(f"- **{t}:** {', '.join(v) if isinstance(v, list) else v}")
    md.append("")
open('docs/handyx/tesis-y-guion.md', 'w').write('\n'.join(md))
print('ok', len(md))
