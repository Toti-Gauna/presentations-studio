# Edición de la grabación del 05/11 (v4): cortes de pausas largas, subtítulos corregidos y mapa fuente → salida.
# Entradas: trans-voz.json (pitch, 155 s) y trans-final.json (cierre, 15 s). Salida: edicion.json
import json, re
S = '/tmp/claude-0/-home-user/10ab011c-6752-54be-831e-b3c4da2461d0/scratchpad/v4'
DUR_VOZ = 155.285
FRONTERAS = [32.42, 56.92, 76.78, 94.22, 112.52, 133.92]   # fin de cada diapositiva: un respiro un poco más largo
ANTES, DESPUES, MIN_PAUSA = 0.10, 0.18, 0.34

def palabras(archivo):
    T = json.load(open(f'{S}/{archivo}'))
    ws = [{'w': w['p'].strip(), 'i': w['i'], 'f': w['f']} for s in T for w in s['palabras'] if w['p'].strip()]
    out = []
    for w in ws:   # «260» «.000» → «260.000»
        if out and re.match(r'^\.\d{3}', w['w']): out[-1] = {**out[-1], 'w': out[-1]['w'] + w['w'], 'f': w['f']}
        else: out.append(w)
    return out

REEMPLAZOS = [
    (['oisea'], ['odisea']), (['esa', 'hora.'], ['ese', 'arreglo.']), (['se', 'matan'], ['se', 'encuentran']),
    (['Handy,'], ['Handyx,']), (['nuestra', 'asistente'], ['nuestro', 'asistente']), (['foto', 'en', 'la'], ['foto', 'y', 'la']),
    (['profesional', 'el', 'arreglo'], ['profesional,', 'el', 'arreglo']), (['que', 'van', 'a', 'haber'], ['que', 'va', 'a', 'haber']),
    (['dentro', 'del', 'arqueo.'], ['dentro', 'de', 'la', 'app.']), (['nuevo,', 'el', 'profesional'], ['nuevo,', 'al', 'profesional']),
    (['gustaría', 'futuro'], ['gustaría', 'a', 'futuro']), (['que', 'la', 'anterior.'], ['que', 'el', 'anterior.']),
    (['convicción'], ['comisión']), (['para', 'Handia.'], ['para', 'Handyx.']), (['mejoró', 'en', 'la'], ['mejorando', 'la']),
    (['hoy', 'en', 'mi', 'día'], ['hoy', 'en', 'día']), (['arrancando', 'el', 'Mar'], ['arrancando', 'en', 'Mar']),
    (['con', 'más', 'de', '260.000'], ['con', 'casi', '260.000']), (['para', 'Handia', 'de'], ['para', 'Handyx', 'de']),
    (['25%'], ['25 %']), (['el', 'ar', 'de', 'Handia.'], ['el', 'uso', 'de', 'Handyx.']), (['que', 'haremos'], ['que', 'hablemos']),
    (['en', 'Handia', 'no'], ['en', 'Handyx', 'no']), (['100%'], ['100 %']), (['y', 'presupuesto.'], ['y', 'presupuestó.']),
    (['con', 'Handia', 'a'], ['con', 'Handyx', 'a']), (['Handy', 'no'], ['Handyx', 'no']), (['meas'], ['menos']),
]

def corregir(ws):
    out, i = [], 0
    while i < len(ws):
        for src, dst in REEMPLAZOS:
            if [w['w'] for w in ws[i:i + len(src)]] == src:
                t0, t1 = ws[i]['i'], ws[i + len(src) - 1]['f']
                paso = (t1 - t0) / len(dst)
                out += [{'w': d, 'i': round(t0 + k * paso, 3), 'f': round(t0 + (k + 1) * paso, 3)} for k, d in enumerate(dst)]
                i += len(src)
                break
        else:
            out.append(ws[i]); i += 1
    return out

voz = corregir(palabras('trans-voz.json'))
fin = corregir(palabras('trans-final.json'))

# Tramos que se conservan de la grabación del pitch (fuente): se cortan las pausas largas
tramos, ini = [], 0.0
for a, b in zip(voz, voz[1:]):
    hueco = b['i'] - a['f']
    if hueco > MIN_PAUSA:
        frontera = any(abs(a['f'] - x) < 0.3 for x in FRONTERAS)
        extra = 0.12 if frontera else 0.0
        tramos.append((ini, a['f'] + DESPUES + extra))
        ini = b['i'] - ANTES - extra
tramos.append((ini, min(DUR_VOZ, voz[-1]['f'] + 0.35)))
edl, t = [], 0.0
for s0, s1 in tramos:
    edl.append([round(t, 3), round(s0, 3), round(s1 - s0, 3)]); t += s1 - s0
FIN_VOZ_SALIDA = round(t, 3)
PAUSA_CIERRE = 0.45
CIERRE_DESDE = 149.11   # arranca el clip del cierre (y el mundo): 3,03 s antes del compás 71 de la música, donde se rompe el mundo
assert CIERRE_DESDE > FIN_VOZ_SALIDA + 0.4
CIERRE_DUR = round(fin[-1]['f'] + 0.5, 3)

def sal(src):
    for desde, s0, dur in edl:
        if s0 - 1e-6 <= src <= s0 + dur + 1e-6: return round(desde + (src - s0), 3)
    for desde, s0, dur in edl:
        if src < s0: return desde
    return FIN_VOZ_SALIDA

def frases(ws, mapear):
    subs, act = [], []
    def cerrar():
        if act: subs.append({'t0': act[0]['t0'], 't1': act[-1]['t1'], 'palabras': act[:]}); act.clear()
    for k, w in enumerate(ws):
        t0, t1 = mapear(w['i']), mapear(w['f'])
        largo = len(' '.join(x['w'] for x in act + [w]))
        cierra_frase = w['w'][-1] in '.?!,;'
        if act and (t0 - act[-1]['t1'] > 0.35 or (largo > 56 and not (cierra_frase and largo <= 74))): cerrar()
        act.append({'t0': t0, 't1': t1, 'w': w['w']})
        if w['w'][-1] in '.?!' or (w['w'][-1] in ',;' and len(' '.join(x['w'] for x in act)) > 30): cerrar()
    cerrar()
    return subs

subs = frases(voz, sal) + frases(fin, lambda x: round(CIERRE_DESDE + x, 3))
json.dump({'edl': edl, 'subs': subs, 'fin_voz': FIN_VOZ_SALIDA, 'cierre_desde': CIERRE_DESDE, 'cierre_dur': CIERRE_DUR,
           'mapa': {str(x): sal(x) for x in [0, 32.42, 33.06, 56.92, 57.56, 76.78, 77.7, 94.22, 95.14, 112.52, 113.34, 133.92, 135.5, 155.08]}},
          open(f'{S}/edicion.json', 'w'), ensure_ascii=False)
print('cortes', len(edl), '· pitch', FIN_VOZ_SALIDA, 's (antes', DUR_VOZ, ') · cierre desde', CIERRE_DESDE, 'dura', CIERRE_DUR)
for s in subs: print(f"{s['t0']:7.2f} " + ' '.join(w['w'] for w in s['palabras']))
