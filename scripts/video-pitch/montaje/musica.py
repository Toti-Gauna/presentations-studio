# Música original para el video del pitch (corporativa y alegre, siempre por debajo de la voz).
# 112 BPM, do mayor. Uso: python musica.py pitch|preguntas <salida.wav> [duración]
import numpy as np, wave, sys
SR = 48000
rng = np.random.default_rng(23)
BPM = 112; NEGRA = 60 / BPM; CORCHEA = NEGRA / 2; COMPAS = 4 * NEGRA
hz = lambda m: 440 * 2 ** ((m - 69) / 12)

def env_ar(n, a, r):
    e = np.ones(n); na = max(1, min(int(a * SR), n // 3)); nr = max(1, min(int(r * SR), n - na))
    e[:na] = np.linspace(0, 1, na); e[n - nr:] *= np.linspace(1, 0, nr) ** 2; return e
def parciales(f, d, amps, decs, ratios=None, ataque=.003):
    n = int(d * SR); t = np.arange(n) / SR; y = np.zeros(n)
    ratios = ratios or list(range(1, len(amps) + 1))
    for a, dc, r in zip(amps, decs, ratios):
        if f * r > 9000: continue
        y += a * np.sin(2 * np.pi * f * r * t + rng.uniform(0, 6.28)) * np.exp(-t * dc)
    return y * np.minimum(1, t / ataque) * env_ar(n, .001, .03)
def pulsada(m, d=.55): return parciales(hz(m), d, [1, .5, .28, .16, .09, .05], [6, 9, 13, 17, 22, 27])
def piano(m, d=2.2):
    f = hz(m); r = [k * (1 + .0004 * k * k) for k in range(1, 8)]
    return parciales(f, d, [1, .55, .32, .2, .12, .08, .05], [1.4, 2, 2.8, 3.6, 4.6, 5.6, 6.6], r, .004)
def campana(m, d=1.8): return parciales(hz(m), d, [1, .42, .2, .08], [2.4, 4.2, 7, 10], [1, 2.76, 5.4, 8.93], .002)
def bajo(m, d):
    n = int(d * SR); t = np.arange(n) / SR; f = hz(m)
    y = np.sin(2 * np.pi * f * t) + .33 * np.sin(4 * np.pi * f * t) + .1 * np.sin(6 * np.pi * f * t) + .15 * np.sin(np.pi * f * t)
    y *= np.exp(-t * 2.5) * env_ar(n, .006, .04); return np.tanh(1.3 * y) / np.tanh(1.3)
def colchon(notas, d):
    n = int(d * SR); t = np.arange(n) / SR; y = np.zeros(n)
    for m in notas:
        f = hz(m)
        for k in range(1, 6):
            for det in (1, 1.0045):
                y += (1 / k ** 1.3) * np.sin(2 * np.pi * f * det * k * t + rng.uniform(0, 6.28)) * .5
    return y * env_ar(n, min(.9, d / 3), min(.9, d / 3)) / len(notas)
def suave(x, k):  # pasabajos simple (media móvil)
    return np.convolve(x, np.ones(k) / k, 'same')
def ruido(n): return rng.standard_normal(n)
def bombo():
    n = int(.4 * SR); t = np.arange(n) / SR; f = 45 + 85 * np.exp(-t * 30)
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 8) + .25 * ruido(n) * np.exp(-t * 400)) * env_ar(n, .0015, .05)
def palmas():
    n = int(.35 * SR); t = np.arange(n) / SR; x = ruido(n); x = suave(x - suave(x, 6), 2)
    e = np.zeros(n)
    for o in (0, .011, .023): e += np.where(t >= o, np.exp(-(t - o) * 70), 0)
    return x * (e * .6 + np.exp(-t * 15) * .45) * env_ar(n, .001, .05)
def hat(abierto=False):
    n = int((.25 if abierto else .07) * SR); t = np.arange(n) / SR; x = ruido(n); x = x - suave(x, 3)
    return x * np.exp(-t * (12 if abierto else 85)) * env_ar(n, .0008, .02) * .55
def shaker():
    n = int(.09 * SR); t = np.arange(n) / SR; x = ruido(n); x = suave(x - suave(x, 5), 2)
    return x * np.minimum(1, t / .012) * np.exp(-t * 40) * .4
def platillo(d=2.6):
    n = int(d * SR); t = np.arange(n) / SR; x = ruido(n); x = x - suave(x, 4)
    return x * np.exp(-t * 1.8) * env_ar(n, .002, .4) * .5
def subida(d):
    n = int(d * SR); t = np.arange(n) / SR; x = ruido(n); y = np.zeros(n); paso = max(1, n // 24)
    for i in range(0, n, paso):  # se abre el filtro de a tramos
        k = max(1, int(30 - 28 * i / n)); y[i:i + paso] = suave(x[max(0, i - 64):i + paso + 64], k)[64 if i >= 64 else i:][:len(y[i:i + paso])]
    return y * (t / d) ** 2.2 * .5

ACORDES = {'C': ([60, 64, 67], 48, [72, 76, 79]), 'G': ([59, 62, 67], 43, [71, 74, 79]),
           'Am': ([57, 60, 64], 45, [69, 72, 76]), 'F': ([57, 60, 65], 41, [69, 72, 77])}
MOTIVO = {'C': [(0, 76), (1.5, 79), (3, 84)], 'G': [(0, 83), (1.5, 79), (3, 74)], 'Am': [(0, 76), (1.5, 81), (3, 84)], 'F': [(0, 81), (1.5, 77), (3, 72)]}
ARPEGIO = [0, 1, 2, 1, 0, 1, 2, 1]

def componer(T, plan, progresiones, golpe_final=None):
    """plan(c) -> dict de capas activas para el compás c; progresiones(c) -> acorde."""
    L = np.zeros(int((T + 3) * SR)); R = np.zeros_like(L)
    def add(x, t, g=1, pan=0):
        i = int(round(t * SR)); n = min(len(x), len(L) - i)
        if n <= 0 or i < 0: return
        L[i:i + n] += x[:n] * g * (1 - max(0, pan)); R[i:i + n] += x[:n] * g * (1 + min(0, pan))
    B = [bombo() for _ in range(2)]; P = [palmas() for _ in range(3)]; H = [hat() for _ in range(4)]; HO = hat(True); SH = [shaker() for _ in range(4)]
    ncomp = int(np.ceil(T / COMPAS))
    for c in range(ncomp):
        t0 = c * COMPAS; ac = progresiones(c); notas, raiz, arr = ACORDES[ac]; capa = plan(c)
        if not capa or t0 >= T: continue
        if 'colchon' in capa: add(colchon(notas + [raiz + 12], COMPAS + .9), t0 - .2, .16 * capa['colchon'])
        if 'piano' in capa:
            for b in (0, 1.5) if capa.get('piano') != 'largo' else (0,):
                for m in notas: add(piano(m), t0 + b * NEGRA, .09, pan=-.15)
        if 'pulsada' in capa:
            for k, idx in enumerate(ARPEGIO):
                m = arr[idx] + (12 if capa.get('octava') and k % 4 == 3 else 0)
                add(pulsada(m), t0 + k * CORCHEA, .11 * (1 if k % 2 == 0 else .8) * capa['pulsada'], pan=(-.35 if k % 2 == 0 else .35))
        if 'bajo' in capa:
            for b, m in ((0, raiz), (1.5, raiz), (2, raiz), (3.5, raiz + 7)):
                add(bajo(m, CORCHEA * 1.6), t0 + b * NEGRA, .22 * capa['bajo'])
        if 'campana' in capa and (c % 2 == 0 or capa.get('campana') == 'siempre'):
            for b, m in MOTIVO[ac]: add(campana(m), t0 + b * NEGRA, .08, pan=.25)
        if 'bombo' in capa:
            golpes = (0, 2) if capa['bombo'] == 'medio' else (0, 1, 2, 3) if capa['bombo'] == 'cuatro' else (0, 1.5, 2)
            for b in golpes: add(B[int(b) % 2], t0 + b * NEGRA, .42)
        if 'palmas' in capa:
            for b in (1, 3): add(P[(c + int(b)) % 3], t0 + b * NEGRA, .3 * capa['palmas'], pan=.05)
        if 'hats' in capa:
            for k in range(8): add(H[k % 4], t0 + k * CORCHEA, (.16 if k % 2 else .1) * capa['hats'], pan=.3)
            if capa.get('abierto'): add(HO, t0 + 3.5 * NEGRA, .12, pan=.3)
        if 'shaker' in capa:
            for k in range(16): add(SH[k % 4], t0 + k * CORCHEA / 2, (.12 if k % 2 else .07) * capa['shaker'], pan=-.35)
        if capa.get('platillo'): add(platillo(), t0, .22)
        if capa.get('subida'): add(subida(COMPAS), t0, .35)
    if golpe_final:
        tf, ac = golpe_final; notas, raiz, arr = ACORDES[ac]
        L[int(tf * SR):] *= np.exp(-np.arange(len(L) - int(tf * SR)) / SR * 6); R[int(tf * SR):] *= np.exp(-np.arange(len(R) - int(tf * SR)) / SR * 6)
        for m in notas + [raiz + 12, raiz + 24]: add(piano(m, 4), tf, .12)
        for m in arr: add(campana(m, 3), tf, .1, pan=.25)
        add(bajo(raiz, 2.5), tf, .35); add(B[0], tf, .6); add(platillo(3.5), tf, .3)
    n = int((T + (2.5 if golpe_final else 0)) * SR); L, R = L[:n], R[:n]
    fin = int(1.2 * SR); L[-fin:] *= np.linspace(1, 0, fin) ** 2; R[-fin:] *= np.linspace(1, 0, fin) ** 2
    ini = int(.8 * SR); L[:ini] *= np.linspace(0, 1, ini); R[:ini] *= np.linspace(0, 1, ini)
    m = np.stack([L, R], 1); m = np.tanh(1.1 * m / np.abs(m).max()) / np.tanh(1.1) * .89
    return m

def guardar(m, f):
    w = wave.open(f, 'w'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((m * 32767).astype(np.int16).tobytes()); w.close()

modo, salida = sys.argv[1], sys.argv[2]
if modo == 'pitch':
    T = 202.0
    PROG = ['C', 'G', 'Am', 'F']; PROB = ['Am', 'F', 'C', 'G']; FINAL = {87: 'Am', 88: 'F', 89: 'G', 90: 'Am', 91: 'F', 92: 'G'}
    def prog(c): return FINAL.get(c, PROB[c % 4] if c < 12 else PROG[c % 4])
    def plan(c):
        if c < 2: return {'colchon': 1.6, 'pulsada': 1.1}                                                  # presentación
        if c < 11: return {'colchon': 1.6, 'pulsada': 1.3, 'shaker': 1, 'piano': 'largo'}                  # el problema
        if c == 11: return {'colchon': 1.6, 'pulsada': 1.3, 'shaker': 1, 'subida': 1}
        if c < 43: return {'colchon': .6, 'pulsada': 1, 'bajo': 1, 'bombo': 'medio', 'palmas': 1, 'hats': 1, 'campana': 1, 'platillo': c == 12}   # la solución
        if c < 70: return {'colchon': .6, 'pulsada': 1, 'piano': 1, 'bajo': 1, 'bombo': 'sincopa', 'palmas': 1, 'hats': 1, 'abierto': c % 4 == 3, 'platillo': c == 43}
        if c < 84: return {'colchon': 1, 'pulsada': 1, 'octava': 1, 'piano': 1, 'bajo': 1, 'bombo': 'sincopa', 'palmas': 1, 'hats': 1, 'campana': 'siempre', 'platillo': c == 70}
        if c == 84: return {'colchon': 1, 'pulsada': 1, 'piano': 1, 'bajo': 1, 'bombo': 'medio', 'hats': 1, 'subida': 1}
        if c < 87: return {'colchon': 1, 'pulsada': 1, 'octava': 1, 'piano': 1, 'bajo': 1, 'bombo': 'cuatro', 'palmas': 1, 'hats': 1, 'campana': 'siempre', 'platillo': c == 85}
        if c == 87: return {'colchon': 1.4}                                                                # se rompe el mundo
        if c < 90: return {'colchon': 1, 'pulsada': 1, 'campana': 'siempre', 'bombo': 'cuatro' if c == 89 else 'medio', 'shaker': 1}   # los Handys lo arreglan
        if c == 90: return {'colchon': 1, 'pulsada': 1, 'campana': 'siempre', 'bombo': 'cuatro', 'hats': 1, 'subida': 1}
        if c < 93: return {'colchon': 1.2, 'pulsada': 1, 'octava': 1, 'piano': 1, 'bajo': 1, 'bombo': 'cuatro', 'palmas': 1, 'hats': 1, 'campana': 'siempre', 'platillo': c == 91}
        return {}
    guardar(componer(T, plan, prog, golpe_final=(198.55, 'C')), salida)
else:
    T = float(sys.argv[3]); PROG = ['C', 'G', 'Am', 'F']
    def plan(c):
        if c < 2: return {'colchon': 1, 'pulsada': .7}
        return {'colchon': .7, 'pulsada': .9, 'bajo': .8, 'bombo': 'medio', 'hats': .8, 'shaker': .6, 'campana': 1 if c % 8 < 4 else None, 'platillo': c % 16 == 2}
    def plan2(c):
        p = plan(c); return {k: v for k, v in p.items() if v is not None}
    guardar(componer(T, plan2, lambda c: PROG[c % 4], golpe_final=(T - 2.4, 'C')), salida)
print('música', modo, '→', salida)
