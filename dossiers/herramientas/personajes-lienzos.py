"""Qué personajes (imágenes subidas /_blob/) usa cada tablero de los tres lienzos, para no imprimir personajes fuera de la
lista permitida (Foco, Engranaje, Llave y Brocha, con sus variantes «rotas» de error).
Uso: python3 -I dossiers/herramientas/personajes-lienzos.py <carpeta-de-lienzos> → dossiers/inventario/personajes-lienzos.json
El mapa id → personaje se armó mirando cada imagen (los ids cambian entre lienzos aunque la imagen sea la misma)."""
import json, os, re, sys
from collections import defaultdict

BASE = sys.argv[1]
SALIDA = os.path.join(os.path.dirname(__file__), '..', 'inventario', 'personajes-lienzos.json')
PERMITIDOS = {'foco', 'foco-roto', 'engranaje', 'engranaje-roto', 'llave', 'llave-rota', 'brocha'}
MAPA = {
    'usuario': {'416c33': 'canilla-rota', '4f4990': 'foco-roto', '60d2c0': 'engranaje', '656e48': 'engranaje-roto', '7d4363': 'gota',
                '840c8b': 'canilla', '8f9b40': 'grupo (canilla, gota, engranaje, foco, llave)', '92e1f1': 'llave-rota', 'ab000e': 'foco', 'd96920': 'llave'},
    'portal': {'4a0d46': 'logo', '4d0602': 'gota', '649dcd': 'canilla', '64b0ce': 'llave', '7a735d': 'engranaje',
               'b57660': 'grupo (canilla, gota, engranaje, foco, llave)', 'be286f': 'foco', 'd21e3b': 'llave-rota'},
    'especialista': {'80fd8b': 'llave', 'c9c14a': 'canilla', 'e1e0f7': 'engranaje', 'ed01ff': 'foco'},
}
res = {'permitidos': sorted(PERMITIDOS), 'nota': 'Solo detecta imágenes subidas; un personaje dibujado en SVG o CSS dentro del tablero no aparece acá: mirá la captura.', 'lienzos': {}}
for lienzo, mapa in MAPA.items():
    proj = os.path.join(BASE, lienzo, 'project')
    tableros = {}
    for f in sorted(os.listdir(proj)):
        if not f.endswith('.dc.html'):
            continue
        ids = sorted(set(re.findall(r'/_blob/([0-9a-f]{32})', open(os.path.join(proj, f), encoding='utf-8').read())))
        if not ids:
            continue
        pers = sorted({mapa.get(i[:6], f'desconocido {i[:6]}') for i in ids})
        no = [p for p in pers if p.split(' ')[0] not in PERMITIDOS and p != 'logo']
        tableros[f] = {'personajes': pers, 'fuera_de_lista': no}
    res['lienzos'][lienzo] = {
        'tableros_con_personajes': len(tableros),
        'tableros_con_personajes_no_permitidos': sorted(k for k, v in tableros.items() if v['fuera_de_lista']),
        'tableros': tableros,
    }
os.makedirs(os.path.dirname(SALIDA), exist_ok=True)
json.dump(res, open(SALIDA, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for l, v in res['lienzos'].items():
    print(l, v['tableros_con_personajes'], 'con personajes ·', len(v['tableros_con_personajes_no_permitidos']), 'con personajes fuera de la lista:', ', '.join(x.replace('.dc.html', '') for x in v['tableros_con_personajes_no_permitidos']))
