# Planes del video v3 (tiempos de SALIDA, ya sin silencios):
#   pitch-voz   → escenas sincronizadas con la voz, cara en el lugar libre de cada escena, subtítulos, mundo y cierre con QR
#   pitch-fondo → la misma línea de tiempo sin voz, sin cara y sin subtítulos (para hablar en vivo encima)
#   preguntas   → portada + las 20 respuestas animadas
#   extra       → portada + los anexos animados + cierre con QR
import json, re, sys
S = '/tmp/claude-0/-home-user/10ab011c-6752-54be-831e-b3c4da2461d0/scratchpad'
R = '/home/user/presentations-studio'
BASE = 'http://127.0.0.1:5191'
ed = json.load(open(f'{S}/v2/edicion.json'))
deck = json.load(open(f'{R}/decks/handyx-aticma/deck.json'))
ESC = {e['id']: e for e in deck['escenas']}

def marcas_de(modulo):
    src = open(f'{R}/brands/handyx/animaciones/{modulo}.ts').read()
    m = re.search(r'marcas:\s*\[([^\]]+)\]', src)
    if not m and 'marcas:' not in src:
        for imp in re.findall(r"from '\./([a-z0-9/-]+)\.ts'", src):
            otro = open(f'{R}/brands/handyx/animaciones/{imp}.ts').read()
            if re.search(r'marcas:\s*(\[|[A-Z_][A-Z0-9_]*\s*,)', otro):
                src = otro; m = re.search(r'marcas:\s*\[([^\]]+)\]', src); break
    if not m:
        n = re.search(r'marcas:\s*([A-Z_][A-Z0-9_]*)', src).group(1)
        m = re.search(rf'const {n}\s*=\s*\[([^\]]+)\]', src)
    def num(x):
        x = x.strip()
        try: return float(x)
        except ValueError: return float(re.search(rf'const {x}\s*=\s*([0-9.]+)', src).group(1))
    return [num(x) for x in m.group(1).split(',')]

def tiempos(modulo):
    xs = marcas_de(modulo)
    return [round(b - a, 3) for a, b in zip(xs, xs[1:])]

def info(modulo):
    for e in deck['escenas']:
        for el in e['elementos']:
            if el.get('tipo') == 'animacion' and el['modulo'] == modulo:
                return el['afirmaciones'], e['paleta']
    return [], 'azul'

def escena(modulo, desde, hasta, pasos):
    af, pal = info(modulo)
    return {'modulo': modulo, 'afirmaciones': af, 'paleta': pal, 'desde': round(desde, 3), 'hasta': round(hasta, 3), 'tiempos': tiempos(modulo),
            'pasos': [{'t': round(desde - 100 if t is None else t, 3), 'k': k} for t, k in pasos]}

# ---------- Pitch: tomas en tiempo de salida (frases de la voz, ver edicion.json → subs) ----------
FIN_VOZ = 175.53          # «Hoy estamos empezando a Mar del Plata» → arranca el clip del mundo
MUNDO = 18.6              # duración del clip del mundo (cuadros ya renderizados en frames-p)
CIERRE = FIN_VOZ + MUNDO  # 194.13: termina el mundo y amanece el cierre con los QR
DUR_PITCH = round(CIERRE + 7.0, 3)
TOMAS = [
    ('odisea', 0.0, 41.5, [(0.0, 0), (2.6, 1), (5.5, 2), (12.1, 3), (25.1, 4)]),
    ('handia', 41.5, 78.1, [(41.62, 0), (50.8, 1), (55.6, 2), (64.4, 3), (68.6, 4)]),
    ('profesional', 78.1, 88.4, [(78.3, 0), (80.9, 1), (85.0, 2)]),
    ('profesional', 88.4, 101.55, [(None, 0)]),                       # «…trabajos, gastos e ingresos»: vuelve a la app
    ('empezamos', 101.55, 112.9, [(101.7, 0), (104.6, 1), (108.4, 2)]),
    ('mercado', 112.9, 130.2, [(113.0, 0), (117.3, 1), (124.4, 2)]),
    ('equipo', 130.2, 154.3, [(130.3, 0), (136.0, 1), (145.8, 2)]),
    ('mercado', 154.3, 166.7, [(None, 2), (155.6, 3)]),               # «…terminar con 72 profesiones»
    ('equipo', 166.7, DUR_PITCH, [(None, 2), (166.9, 3), (FIN_VOZ - 0.4, 4), (CIERRE + 0.1, 5)]),
]

def corregir(subs):
    out = []
    for s in subs:
        ws = [dict(w) for w in s['palabras']]
        for i, w in enumerate(ws):
            t = w['w']; sig = ws[i + 1]['w'] if i + 1 < len(ws) else ''
            if t == '20' and sig.startswith('%'): w['w'] = '25'            # la cifra oficial es 25 % (en la grabación dice 20 %)
            if t.startswith('.000'): w['w'] = ''; ws[i - 1]['w'] += t      # «260 .000» → «260.000»
            if t == 'handy.': w['w'] = 'Handyx.'
            if t == 'Mar' and sig == 'de': ws[i + 1]['w'] = 'del'
            if t == 'plata.': w['w'] = 'Plata.'
            if t == 'general' and sig == 'por': w['w'] = 'General'; ws[i + 1]['w'] = ''
            if t == 'Los' and sig == 'otros': w['w'] = 'Lo'; ws[i + 1]['w'] = 'que'
            if t == 'unas' and sig == 'mejor': w['w'] = 'una'
            if t == 'más' and sig == 'de' and i + 2 < len(ws) and ws[i + 2]['w'].startswith('260'): w['w'] = 'casi'; ws[i + 1]['w'] = ''   # el dato es 259.623
            if t == 'las' and sig.startswith('profesionales'): w['w'] = 'los'
        ws = [w for w in ws if w['w']]
        out.append({**s, 'palabras': ws})
    return out

def plan_pitch(con_voz):
    return {
        'dur': DUR_PITCH, 'cruce': 0.5,
        'escenas': [escena(*t) for t in TOMAS],
        'camara': {'url': f'{BASE}/__camara/f{{n}}.jpg', 'fps': 30, 'edl': ed['edl'], 'hasta': FIN_VOZ if con_voz else 0},
        'subtitulos': corregir(ed['subs']) if con_voz else [],
        'final': {'desde': FIN_VOZ, 'hasta': CIERRE, 'url': f'{BASE}/__final/f{{n}}.jpg', 'fps': 30, 'desdeCuadro': round(183.4 * 30) + 9},
        'qrs': {'desde': CIERRE + 0.5, 'items': [{'id': 'landing', 'x': 660, 'y': 324}, {'id': 'portafolio', 'x': 1260, 'y': 324}]},
    }

SIN_FINAL = {'desde': 1e9, 'url': '', 'fps': 30, 'desdeCuadro': 0}
SIN_CAMARA = {'url': '', 'fps': 30, 'edl': [], 'hasta': 0}

def secuencia(modulos, sostener=1.4, portada=None, cierre_qr=False):
    """Escenas una detrás de otra: cada paso arranca cuando termina el anterior; al final de cada escena, una pausa."""
    escenas, t = [], 0.0
    lista = ([portada] if portada else []) + modulos
    for m in lista:
        ts = tiempos(m)
        pasos, k0 = [], t + 0.25
        for k, d in enumerate(ts):
            pasos.append((k0, k)); k0 += d + (0.35 if k < len(ts) - 1 else 0)
        fin = k0 + (sostener if m != portada else 0.6)
        escenas.append(escena(m, t, fin, pasos)); t = fin
    plan = {'dur': round(t, 3), 'cruce': 0.5, 'escenas': escenas, 'camara': SIN_CAMARA, 'subtitulos': [], 'final': SIN_FINAL}
    if cierre_qr:
        ts = tiempos('equipo')
        e = escena('equipo', t, t + 7.5, [(None, 4), (t + 0.1, 5)])
        plan['escenas'].append(e); plan['qrs'] = {'desde': t + 0.5, 'items': [{'id': 'landing', 'x': 660, 'y': 324}, {'id': 'portafolio', 'x': 1260, 'y': 324}]}
        plan['dur'] = round(t + 7.5, 3)
    return plan

if __name__ == '__main__':
    que = sys.argv[1]
    if que == 'pitch':
        json.dump(plan_pitch(True), open(f'{S}/v3/plan-pitch-voz.json', 'w'), ensure_ascii=False)
        json.dump(plan_pitch(False), open(f'{S}/v3/plan-pitch-fondo.json', 'w'), ensure_ascii=False)
        print('pitch', DUR_PITCH)
    elif que == 'preguntas':
        p = secuencia([f'pregunta-{k:02d}' for k in range(1, 21)], sostener=1.6, portada='seccion-preguntas')
        json.dump(p, open(f'{S}/v3/plan-preguntas.json', 'w'), ensure_ascii=False); print('preguntas', p['dur'])
    elif que == 'extra':
        mods = sys.argv[2].split(',')
        p = secuencia(mods, sostener=1.6, portada='seccion-extra', cierre_qr=True)
        json.dump(p, open(f'{S}/v3/plan-extra.json', 'w'), ensure_ascii=False); print('extra', p['dur'])
