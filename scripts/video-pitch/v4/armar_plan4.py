# Planes del video v4 (grabación del 05/11): golpes anclados a las frases de Ignacio (tiempo de la fuente → salida sin pausas).
#   plan-voz.json   → cara en el lugar libre de cada escena, subtítulos, mundo con el cierre hablado y QR
#   plan-fondo.json → la misma línea de tiempo sin voz, sin cara y sin subtítulos
import io, json, sys, contextlib
V4 = '/tmp/claude-0/-home-user/10ab011c-6752-54be-831e-b3c4da2461d0/scratchpad/v4'
sys.path.insert(0, V4); sys.path.insert(0, V4.replace('/v4', '/v3'))
with contextlib.redirect_stdout(io.StringIO()):
    import editar                                   # palabras corregidas (voz), edl y mapa a la salida
from armar_plan import escena, tiempos, BASE      # mismas escenas y servidor que la v3

ed = json.load(open(f'{V4}/edicion.json'))
W0 = ed['cierre_desde']            # arranca el clip del mundo con «Porque hoy empezamos en Mar del Plata»
MUNDO = 18.6
CIERRE = round(W0 + MUNDO, 3)      # amanece el cierre con los QR
DUR = round(CIERRE + 7.0, 3)
ws = editar.voz

def t(frase, desde=0.0):
    """Tiempo de SALIDA de la primera palabra de la frase (buscada en la grabación a partir de «desde», en tiempo de fuente)."""
    f = [x.strip(',.').lower() for x in frase.split()]
    for i, w in enumerate(ws):
        if w['i'] < desde: continue
        if [x['w'].strip(',.').lower() for x in ws[i:i + len(f)]] == f:
            return editar.sal(w['i'])
    raise SystemExit(f'no encuentro «{frase}»')

ESCENAS = [   # (módulo, [(frase o tiempo de salida o None, paso)], frase que abre la escena)
    ('odisea', [(0.0, 0), ('se nos rompió', 1), ('conocemos todos', 2), ('Del otro lado', 3), ('Y ante esa doble', 4)]),
    ('handia', [('Quiero que imaginemos', 0), ('vas a poder darle', 1), ('proveerte de un', 2), ('para que puedas compararlo', 3), ('En caso que', 4)]),
    ('profesional', [('De nuevo', 0), ('herramientas para que pueda', 1), ('nos gustaría a futuro', 2)]),
    ('empezamos', [('Y no solamente', 0), ('Ya empezamos', 1), ('consiguiendo los primeros', 2), ('Y además mejorando', 3)]),
    ('mercado', [('Y hoy en día', 0), ('y buscamos en el primer', 1), ('conseguir unos ingresos', 2)]),
    ('competencia', [('Y ahora mismo', 0), ('La conocemos', 1), ('Nosotros consideramos', 2), ('con el trabajo que él', 3), ('Por otro lado, queremos también', 4)]),
    ('equipo', [(None, 1), ('Actualmente estamos', 2), ('Además de eso, queremos viajar', 3), (round(W0 - 0.4, 3), 4), (round(CIERRE + 0.1, 3), 5)]),
]

tomas, aviso = [], []
for modulo, golpes in ESCENAS:
    ts = tiempos(modulo); pasos = []
    for g, k in golpes:
        if g is None: pasos.append((None, k)); continue
        tk = g if isinstance(g, (int, float)) else t(g)
        ant = next((p for p in reversed(pasos) if p[0] is not None), None)
        if ant and tk < ant[0] + ts[ant[1]] * 0.85:   # que el golpe anterior llegue a lucirse
            nuevo = round(ant[0] + ts[ant[1]] * 0.85, 3); aviso.append(f'{modulo} paso {k}: {tk} → {nuevo}'); tk = nuevo
        pasos.append((round(tk, 3), k))
    tomas.append([modulo, pasos])
# Límites de cada escena: entra 0,3 s antes de su primer golpe con frase
for i, (modulo, pasos) in enumerate(tomas):
    primero = next(p[0] for p in pasos if p[0] is not None)
    tomas[i].append(0.0 if i == 0 else round(primero - 0.3, 3))
escenas = []
for i, (modulo, pasos, desde) in enumerate(tomas):
    hasta = tomas[i + 1][2] if i + 1 < len(tomas) else DUR
    escenas.append(escena(modulo, desde, hasta, pasos))

def plan(con_voz):
    return {'dur': DUR, 'cruce': 0.5, 'escenas': escenas,
            'camara': {'url': f'{BASE}/__camara/f{{n}}.jpg', 'fps': 30, 'edl': ed['edl'], 'hasta': W0 if con_voz else 0},
            'subtitulos': ed['subs'] if con_voz else [],
            'final': {'desde': W0, 'hasta': CIERRE, 'url': f'{BASE}/__final/f{{n}}.jpg', 'fps': 30, 'desdeCuadro': round(183.4 * 30) + 9},
            'qrs': {'desde': round(CIERRE + 0.5, 3), 'items': [{'id': 'landing', 'x': 660, 'y': 324}, {'id': 'portafolio', 'x': 1260, 'y': 324}]}}

json.dump(plan(True), open(f'{V4}/plan-voz.json', 'w'), ensure_ascii=False)
json.dump(plan(False), open(f'{V4}/plan-fondo.json', 'w'), ensure_ascii=False)
print('duración', DUR, '· mundo', W0, '→', CIERRE)
for e in escenas: print(f"{e['modulo']:12s} {e['desde']:7.2f} {e['hasta']:7.2f}", [p['t'] for p in e['pasos']])
for a in aviso: print('ajuste', a)
