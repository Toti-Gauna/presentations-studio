# Planes de la sección «Material extra»: A (portada + anexos hasta ferreterías), el clip «HandIA te habla» y B (IPO + cierre con QR).
import json, os, sys
sys.path.insert(0, '/tmp/claude-0/-home-user/10ab011c-6752-54be-831e-b3c4da2461d0/scratchpad/v3')
from armar_plan import secuencia, S, R
deck = json.load(open(f'{R}/decks/handyx-aticma/deck.json'))
anexos = [x for x in deck['versiones'][0]['anexos'] if x.startswith('x-')]
ESC = {e['id']: e for e in deck['escenas']}
def modulo(id):
    els = [el for el in ESC[id]['elementos'] if el.get('tipo') == 'animacion']
    return els[0]['modulo'] if els else None
corte = anexos.index('x-handia-voz')
A = [modulo(x) for x in anexos[:corte]]
B = [modulo(x) for x in anexos[corte + 1:]]
faltan = [x for x in anexos if x != 'x-handia-voz' and not modulo(x)]
print('sin animación todavía:', faltan)
pa = secuencia([m for m in A if m], sostener=1.6, portada='seccion-extra')
pb = secuencia([m for m in B if m], sostener=1.6, cierre_qr=True)
json.dump(pa, open(f'{S}/v3/plan-extra-a.json', 'w'), ensure_ascii=False)
json.dump(pb, open(f'{S}/v3/plan-extra-b.json', 'w'), ensure_ascii=False)
print('extra A', pa['dur'], len(pa['escenas']), '· extra B', pb['dur'], len(pb['escenas']))
