# Entregable 3: dos zips con la presentación completa.
#   Handyx-ATICMA-presentacion.zip → PPTX (una diapositiva por paso, con guion y notas) + PDF + LEEME.txt
#   Handyx-ATICMA-imagenes.zip     → una imagen 1920×1080 por paso, en carpetas por sección y con nombres legibles
import json, os, re, shutil, unicodedata, zipfile
R = '/home/user/presentations-studio'
OUT = f'{R}/salida/entregables'
os.makedirs(OUT, exist_ok=True)
deck = json.load(open(f'{R}/decks/handyx-aticma/deck.json'))
ESC = {e['id']: e for e in deck['escenas']}
v = deck['versiones'][0]
man = json.load(open(f'{R}/salida/pptx/handyx-aticma-evento/manifiesto.json'))

def slug(t):
    t = unicodedata.normalize('NFKD', t).encode('ascii', 'ignore').decode()
    return re.sub(r'[^a-z0-9]+', '-', t.lower()).strip('-')[:60]

def seccion(id):
    if id in v['escenas']: return '1-pitch', v['escenas'].index(id) + 1
    if id.startswith('q-'): return '3-preguntas-del-jurado', int(id[2:])
    return '2-material-extra', [x for x in v['anexos'] if x.startswith('x-')].index(id) + 1

LEEME = """Handyx · ATICMA 2026 · presentación completa (corte 05/11/2026)

- Handyx-ATICMA.pptx: una diapositiva por paso (cada clic del pitch en vivo), con el guion y las notas en las notas del orador.
  Son imágenes 1920 × 1080: es el respaldo para abrir en PowerPoint o Keynote si no se puede usar la presentación animada.
- Handyx-ATICMA.pdf: lo mismo en PDF.
- Orden: 1) pitch (7 diapositivas), 2) material extra, 3) posibles preguntas del jurado.
- La presentación animada (con los Handys en movimiento y el clip del mundo) es la del estudio de presentaciones:
  versión «ATICMA (180 s)» del deck handyx-aticma.
- Cifras: todas salen de decks/handyx-aticma/afirmaciones.json con su rótulo (dato informado, supuesto, proyección, objetivo).
"""

with zipfile.ZipFile(f'{OUT}/Handyx-ATICMA-presentacion.zip', 'w', zipfile.ZIP_DEFLATED) as z:
    z.write(f'{R}/salida/pptx/handyx-aticma-evento.pptx', 'Handyx-ATICMA.pptx')
    z.write(f'{R}/salida/pdf/handyx-aticma-evento.pdf', 'Handyx-ATICMA.pdf')
    z.writestr('LEEME.txt', LEEME)

with zipfile.ZipFile(f'{OUT}/Handyx-ATICMA-imagenes.zip', 'w', zipfile.ZIP_STORED) as z:
    for k, d in enumerate(man['diapositivas'], 1):
        sec, n = seccion(d['escena'])
        titulo = ESC[d['escena']]['titulo']
        # numeración corrida (001…212) en el orden de la presentación: cualquier visor las muestra en orden
        nombre = f"{k:03d}-{sec[2:]}-{n:02d}-{slug(titulo)}-paso-{d['paso'] + 1}.png"
        z.write(f"{R}/{d['imagen']}" if not d['imagen'].startswith('/') else d['imagen'], nombre)
print('zips listos', len(man['diapositivas']), 'imágenes')
for f in sorted(os.listdir(OUT)): print(f, round(os.path.getsize(f'{OUT}/{f}') / 1e6, 1), 'MB')
