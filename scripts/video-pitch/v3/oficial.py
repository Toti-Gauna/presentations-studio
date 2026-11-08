# Plan del pitch de fondo con el GUION OFICIAL (orden del deck, las 7 diapositivas, competencia incluida), al ritmo de
# habla medido en la grabación de Ignacio. Cada golpe cae cuando el guion llega a su frase; nunca antes de que termine
# la animación del golpe anterior.
import json, re, sys
sys.path.insert(0, '/tmp/claude-0/-home-user/10ab011c-6752-54be-831e-b3c4da2461d0/scratchpad/v3')
from armar_plan import escena, tiempos, ed, S, R, BASE, MUNDO, SIN_CAMARA
palabras_voz = sum(len(s['palabras']) for s in ed['subs'])
RITMO = palabras_voz / 175.5            # palabras por segundo de Ignacio en la grabación
guion = open(f'{R}/docs/handyx/aticma-guion.md').read()
def texto(n):
    bloque = guion.split(f'### Diapositiva {n} ')[1].split('###')[0].split('## ')[0]
    return ' '.join(l[1:].strip() for l in bloque.splitlines() if l.startswith('>')).split()
GOLPES = {
    'odisea': (1, ['', 'A todos alguna vez', 'Y conocemos la odisea', 'Del otro lado', 'Por esa doble necesidad']),
    'handia': (2, ['', 'van a poder mandar una foto', 'y recibir orientación', 'El presupuesto final', 'Si ya saben']),
    'profesional': (3, ['', 'y herramientas por oficio', 'A futuro queremos']),
    'empezamos': (4, ['', 'Con ayuda de porteros', 'y cobramos nuestras', 'Ahora queremos llevar']),
    'mercado': (5, ['', 'Para el primer trimestre', 'y generar cien mil', 'Para fines de 2027', 'y que cuatro de cada diez']),
    'competencia': (6, ['', 'Nosotros creemos que', 'El dinero que gana', 'Nuestro modelo es simple', 'El profesional fija']),
    'equipo': (7, ['', 'Desarrollé agentes', 'Buscamos cien mil', 'Queremos llegar a Silicon', 'Hoy empezamos en Mar']),
}
def indice(ws, frase):
    f = frase.split()
    for i in range(len(ws)):
        if [w.strip('.,:;¡!¿?«»') for w in ws[i:i + len(f)]] == [w.strip('.,:;¡!¿?«»') for w in f]: return i
    raise SystemExit(f'no encuentro «{frase}»')
# Ventanas del guion oficial (docs/handyx/aticma-guion.md → «Ritmo»): 0:25, 0:55, 1:17, 1:38, 2:04, 2:30, 3:00
VENTANAS = {'odisea': (0, 25), 'handia': (25, 55), 'profesional': (55, 77), 'empezamos': (77, 98), 'mercado': (98, 124), 'competencia': (124, 150), 'equipo': (150, 180)}
escenas, t, fin_voz = [], 0.0, None
for modulo, (n, frases) in GOLPES.items():
    ws = texto(n); a0, a1 = VENTANAS[modulo]; t = max(t, a0); RITMO = len(ws) / (a1 - a0); dur = a1 - t
    ts = tiempos(modulo); pasos, ultimo = [], None
    for k, fr in enumerate(frases):
        tk = t + (indice(ws, fr) / RITMO if fr else 0) + (0.15 if k == 0 else 0)
        if ultimo is not None: tk = max(tk, ultimo[0] + ts[ultimo[1]] + 0.1)
        pasos.append((round(tk, 2), k)); ultimo = (tk, k)
    if modulo == 'equipo':
        fin_voz = pasos[-1][0] + 0.4                       # el clip del mundo arranca con «Hoy empezamos en Mar del Plata»
        cierre = fin_voz + MUNDO
        pasos.append((round(cierre + 0.1, 2), 5))
        hasta = cierre + 7.0
    else:
        hasta = max(a1, pasos[-1][0] + ts[-1] + 0.8)
    escenas.append(escena(modulo, t, hasta, pasos)); t = hasta
plan = {'dur': round(t, 3), 'cruce': 0.5, 'escenas': escenas, 'camara': SIN_CAMARA, 'subtitulos': [],
        'final': {'desde': round(fin_voz, 3), 'hasta': round(fin_voz + MUNDO, 3), 'url': f'{BASE}/__final/f{{n}}.jpg', 'fps': 30, 'desdeCuadro': round(183.4 * 30) + 9},
        'qrs': {'desde': round(fin_voz + MUNDO + 0.5, 3), 'items': [{'id': 'landing', 'x': 660, 'y': 324}, {'id': 'portafolio', 'x': 1260, 'y': 324}]}}
json.dump(plan, open(f'{S}/v3/plan-oficial.json', 'w'), ensure_ascii=False)
print(f'duración {plan["dur"]:.1f} s · mundo desde {fin_voz:.1f}')
for e in escenas: print(e['modulo'], e['desde'], e['hasta'], [p['t'] for p in e['pasos']])
