# Genera las respuestas animadas al jurado (brands/handyx/animaciones/pregunta-NN.ts) desde decks/handyx-aticma/preguntas.json.
# Uso: python3 -I scripts/generar-respuestas.py [--comprobar]
import json, re, sys, os
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = json.load(open(f'{R}/decks/handyx-aticma/preguntas.json'))
dif = []
for q in P:
    q = dict(q)
    q['total'] = len(P)
    if q.get('respaldo'): q['puntos'] = q['puntos'] or []
    cuerpo = json.dumps({k: q[k] for k in ['n', 'total', 'pregunta', 'respuesta', 'puntos', 'quien', 'viz']}, ensure_ascii=False, indent=2)
    ts = f"// Generado por scripts/generar-respuestas.py desde decks/handyx-aticma/preguntas.json (no editar a mano).\nimport {{ respuesta }} from './comun/respuesta.ts';\n\nexport default respuesta({cuerpo} as Parameters<typeof respuesta>[0]);\n"
    ruta = f"{R}/brands/handyx/animaciones/pregunta-{q['n']:02d}.ts"
    if '--comprobar' in sys.argv:
        if not os.path.exists(ruta) or open(ruta).read() != ts: dif.append(ruta)
    else:
        open(ruta, 'w').write(ts)
if dif:
    print('Respuestas desactualizadas:', *dif, sep='\n  '); sys.exit(1)
print(f'{len(P)} respuestas', 'al día' if '--comprobar' in sys.argv else 'generadas')
