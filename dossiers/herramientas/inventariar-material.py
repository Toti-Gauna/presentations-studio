"""Inventario del material ya hecho para Handyx que pueden usar el tríptico y los dossiers.
Uso: python3 -I dossiers/herramientas/inventariar-material.py  →  dossiers/inventario/material.md y material.json"""
import json, pathlib, subprocess
from collections import Counter

R = pathlib.Path(__file__).resolve().parents[2]
A = R / 'brands/handyx/assets'
deck = json.loads((R / 'decks/handyx-aticma/deck.json').read_text())
af = json.loads((R / 'decks/handyx-aticma/afirmaciones.json').read_text())
v = deck['versiones'][0]
PERSONAJES = ('bombilla', 'engranaje', 'llave', 'brocha')   # los únicos permitidos en el material impreso (Foco, Engranaje, Llave, Brocha)

def seccion(i):
    if i in v['escenas']: return 'pitch'
    if i in ('s-preguntas', 's-extra'): return 'portada'
    return 'preguntas' if i.startswith('q-') else 'material extra'

escenas = []
for e in deck['escenas']:
    if e['id'] not in v['escenas'] + v['anexos']: continue
    mods = [x['modulo'] for x in e['elementos'] if x.get('tipo') == 'animacion']
    vids = [x['recurso'] for x in e['elementos'] if x.get('tipo') == 'video']
    escenas.append({'id': e['id'], 'titulo': e['titulo'], 'seccion': seccion(e['id']), 'pasos': e['pasos'], 'modulo': mods[0] if mods else None, 'videos': vids})

man = R / 'salida/pptx/handyx-aticma-evento/manifiesto.json'
diapos = json.loads(man.read_text())['diapositivas'] if man.exists() else []
caps = json.loads((A / 'capturas/capturas.json').read_text())
lista = lambda d, ext=('.webp', '.png', '.jpg', '.svg'): sorted(p.name for p in (A / d).iterdir() if p.suffix in ext)
personajes = [n for n in lista('personajes') if n.startswith(PERSONAJES)]
tipos = Counter(a['tipo'] for a in af)
CLAVE = ('PRUEBA', 'TRABAJOS', 'ESP-', 'MDP', 'MERCADO', 'META', 'TARIFA', 'FEE', 'INV-', 'COSTO', 'CAC', 'LTV', 'EQUILIBRIO', 'Q1-', 'PROF-', 'LANZAMIENTO', 'COMP-')
cifras = [{'id': a['id'], 'valor': a['valor'], 'formato': a.get('formato'), 'tipo': a['tipo'], 'descripcion': a['descripcion']} for a in af if a['id'].startswith(CLAVE)]

def repo(nombre):
    d = R.parent / nombre
    if not d.exists(): return None
    r = subprocess.run(['git', '-C', str(d), 'log', '-1', '--format=%h %cd %s', '--date=short'], capture_output=True, text=True)
    return r.stdout.strip()

datos = {
    'escenas': escenas, 'diapositivas_pptx': len(diapos),
    'capturas_reales_pwa': caps, 'demo_landing': lista('demo-landing'), 'conceptos': lista('conceptos'),
    'publicidades': lista('publicidades'), 'video': sorted(p.name for p in (A / 'video').iterdir() if p.is_file()),
    'personajes_permitidos': personajes, 'logo_vectorial': ['dossiers/marca/logo-handyx.svg', 'dossiers/marca/logo-handyx-blanco.svg'],
    'afirmaciones_por_tipo': dict(tipos), 'cifras_de_negocio': cifras,
    'repos': {n: repo(n) for n in ['Handy-landing-page-fe', 'Handy-landing-page-be', 'handyx-client-fe', 'handyx-specialist-fe', 'handy-internal-portal', 'handyx-client-be', 'handyx-specialist-be']},
}
(R / 'dossiers/inventario/material.json').write_text(json.dumps(datos, ensure_ascii=False, indent=1))

md = ['# Inventario del material de Handyx para el tríptico y los dossiers', '',
      'Generado con `python3 -I dossiers/herramientas/inventariar-material.py`. Rutas relativas a `brands/handyx/assets/` salvo aclaración.', '',
      '## Escenas del pitch (re-renderizables en alta con `scripts/video-pitch/vista-animacion.cjs`)', '',
      '| Sección | Escena | Título | Pasos | Módulo o video |', '|---|---|---|---|---|']
md += [f"| {e['seccion']} | `{e['id']}` | {e['titulo']} | {e['pasos']} | {e['modulo'] or ', '.join(e['videos'])} |" for e in escenas]
md += ['', f'Exportación actual: {len(diapos)} imágenes 1920 × 1080 en `salida/pptx/handyx-aticma-evento/` (una por paso).', '',
       '## Capturas reales de las PWA (`capturas/`, modo de prueba con datos ficticios)', '']
md += [f"- `{c['archivo']}` · {c['app']} · {c['descripcion']}" for c in caps]
md += ['', '## Demo de la landing (`demo-landing/`)', '', *[f'- `{n}`' for n in datos['demo_landing']],
       '', '## Diseños propuestos y gráficos (`conceptos/`)', '', *[f'- `{n}`' for n in datos['conceptos']],
       '', '## Publicidades (`publicidades/`, cuadros de los trailers)', '', *[f'- `{n}`' for n in datos['publicidades']],
       '', '## Video (`video/`)', '', *[f'- `{n}`' for n in datos['video']],
       '', '## Personajes permitidos (Foco = bombilla, Engranaje, Llave, Brocha; poses a reposo, b saludo, c festejo, d acción)', '',
       ', '.join(f'`{n}`' for n in personajes), '',
       '## Logo', '', '- Vectorial: `dossiers/marca/logo-handyx.svg` (azul #1F57A8) y `logo-handyx-blanco.svg`, trazados del original de la landing.', '',
       '## Cifras (de `decks/handyx-aticma/afirmaciones.json`, siempre con su rótulo)', '',
       'Por tipo: ' + ', '.join(f'{k} {n}' for k, n in tipos.items()), '',
       '| Id | Valor | Tipo | Qué es |', '|---|---|---|---|']
md += [f"| `{c['id']}` | {c['valor']} | {c['tipo']} | {c['descripcion']} |" for c in cifras]
md += ['', '## Repos del producto (última versión local)', '', *[f'- {n}: {r or "no está en la sesión"}' for n, r in datos['repos'].items()], '']
(R / 'dossiers/inventario/material.md').write_text('\n'.join(md))
print(f"{len(escenas)} escenas · {len(diapos)} imágenes PPT · {len(caps)} capturas reales · {len(personajes)} personajes · {len(cifras)} cifras de negocio")
