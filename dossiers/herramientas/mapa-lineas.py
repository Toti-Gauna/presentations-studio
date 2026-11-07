"""Mapa de líneas de Mar del Plata (límites de barrios y contorno del Partido) en SVG vectorial, para portadas y fondos.
Datos: OpenStreetMap (licencia ODbL), tal como los guarda el portal interno en datos/osm/ (descargar-barrios.sh).
Toda pieza que lo use imprime la atribución «© colaboradores de OpenStreetMap».
Uso: python3 -I dossiers/herramientas/mapa-lineas.py <carpeta datos/osm> <salida-sin-extensión>
  → <salida>-blanco.svg y <salida>-navy.svg"""
import json, math, sys

osm, salida = sys.argv[1], sys.argv[2]
LON0, LAT0, LON1, LAT1 = -57.665, -38.085, -57.465, -37.925   # zona urbana, costa y un poco de mar
k = math.cos(math.radians((LAT0 + LAT1) / 2))
W = 1000.0
esc = W / ((LON1 - LON0) * k)
H = (LAT1 - LAT0) * esc


def anillos(g):
    if g['type'] == 'Polygon':
        return g['coordinates']
    if g['type'] == 'MultiPolygon':
        return [r for p in g['coordinates'] for r in p]
    if g['type'] == 'LineString':
        return [g['coordinates']]
    if g['type'] == 'MultiLineString':
        return g['coordinates']
    return []


def camino(r):
    pts, ult = [], None
    for lon, lat in r:
        x, y = round((lon - LON0) * k * esc, 1), round((LAT1 - lat) * esc, 1)
        if (x, y) != ult:
            pts.append(f'{x} {y}')
            ult = (x, y)
    if len(pts) < 2:
        return ''
    xs = [float(p.split()[0]) for p in pts]
    ys = [float(p.split()[1]) for p in pts]
    if max(xs) < -50 or min(xs) > W + 50 or max(ys) < -50 or min(ys) > H + 50:
        return ''
    return 'M' + 'L'.join(pts)


def capa(archivo):
    d = json.load(open(f'{osm}/{archivo}'))
    return ''.join(camino(r) for f in d['features'] for r in anillos(f['geometry']))


barrios = capa('barrios.geojson')
# contorno: solo el anillo más largo (el Partido con la costa); los enclaves chicos quedan como barrios finos
d = json.load(open(f'{osm}/contorno.geojson'))
todos = [r for f in d['features'] for r in anillos(f['geometry'])]
mayor = max(todos, key=len)
contorno = camino(mayor)
barrios += ''.join(camino(r) for r in todos if r is not mayor)
for nombre, color in (('blanco', '#FFFFFF'), ('navy', '#0E1D36')):
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.0f} {H:.0f}" width="{W:.0f}" height="{H:.0f}" fill="none" '
           f'stroke="{color}" stroke-linejoin="round" stroke-linecap="round">'
           f'<title>Mar del Plata · límites de barrios · © colaboradores de OpenStreetMap (ODbL)</title>'
           f'<path d="{barrios}" stroke-width="0.8" stroke-opacity="0.5"/>'
           f'<path d="{contorno}" stroke-width="2.8"/></svg>')
    open(f'{salida}-{nombre}.svg', 'w').write(svg)
    print(f'{salida}-{nombre}.svg', f'{len(svg) // 1024} KB', f'{W:.0f}×{H:.0f}')
