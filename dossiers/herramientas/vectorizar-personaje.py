"""Vectoriza un personaje (ilustración plana con contorno oscuro) en capas de color con potrace, para imprimirlo nítido
a cualquier tamaño. Capas apiladas de claro a oscuro: cada capa incluye todos los píxeles de colores más oscuros, así no
quedan rendijas entre colores y el contorno queda arriba.
Uso: python3 -I dossiers/herramientas/vectorizar-personaje.py <entrada.webp|png> <salida.svg> [colores=6] [escala=6]"""
import subprocess, sys, tempfile, os, re
from PIL import Image, ImageFilter

entrada, salida = sys.argv[1], sys.argv[2]
n = int(sys.argv[3]) if len(sys.argv) > 3 else 6
escala = int(sys.argv[4]) if len(sys.argv) > 4 else 6
im = Image.open(entrada).convert('RGBA')
W, H = im.size
im = im.resize((W * escala, H * escala), Image.LANCZOS)
alfa = im.getchannel('A')
fondo = Image.new('RGBA', im.size, (255, 255, 255, 255))
plano = Image.alpha_composite(fondo, im).convert('RGB').filter(ImageFilter.MedianFilter(2 * (escala // 2) + 1))  # limpia el ruido del original
# paleta: muchos colores con octree (no pierde los oscuros chicos, como ojos y contornos) y después se juntan los parecidos
q = plano.quantize(colors=24, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE)
pal = q.getpalette()[: 24 * 3]
crudos = [tuple(pal[i * 3: i * 3 + 3]) for i in range(24)]
qi = q.load(); a = alfa.load()
Wq, Hq = q.size
cuenta = [0] * 24
for y in range(Hq):
    for x in range(Wq):
        if a[x, y] > 127:
            cuenta[qi[x, y]] += 1
dist = lambda c, d: sum((c[k] - d[k]) ** 2 for k in range(3)) ** 0.5
grupos = []  # [color medio, peso, [índices]]
for i in sorted(range(24), key=lambda i: -cuenta[i]):
    if not cuenta[i]:
        continue
    g = next((g for g in grupos if dist(g[0], crudos[i]) < 34), None)
    if g:
        t = g[1] + cuenta[i]
        g[0] = tuple((g[0][k] * g[1] + crudos[i][k] * cuenta[i]) / t for k in range(3)); g[1] = t; g[2].append(i)
    else:
        grupos.append([crudos[i], cuenta[i], [i]])
grupos = sorted(grupos, key=lambda g: -g[1])[:n]
mapa = {}
for gi, g in enumerate(grupos):
    for i in g[2]:
        mapa[i] = gi
for i in range(24):  # colores sueltos que quedaron fuera: al grupo más cercano
    if i not in mapa:
        mapa[i] = min(range(len(grupos)), key=lambda gi: dist(grupos[gi][0], crudos[i]))
cols = [tuple(int(round(v)) for v in g[0]) for g in grupos]
idx = {}
conteo = [0] * len(cols)
plano_idx = Image.new('L', (Wq, Hq)); pi = plano_idx.load()
for y in range(Hq):
    for x in range(Wq):
        gi = mapa[qi[x, y]]; pi[x, y] = gi
        if a[x, y] > 127:
            conteo[gi] += 1
idx = pi
lum = lambda c: 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
usados = [i for i in range(len(cols)) if conteo[i] > Wq * Hq * 0.0004]
orden = sorted(usados, key=lambda i: -lum(cols[i]))  # claro → oscuro
capas = []
with tempfile.TemporaryDirectory() as tmp:
    for k, ci in enumerate(orden):
        mas_oscuros = set(orden[k:])
        m = Image.new('1', (Wq, Hq), 1)
        mp = m.load()
        for y in range(Hq):
            for x in range(Wq):
                if a[x, y] > 127 and idx[x, y] in mas_oscuros:
                    mp[x, y] = 0
        pbm = os.path.join(tmp, f'{k}.pbm'); svg = os.path.join(tmp, f'{k}.svg')
        m.save(pbm)
        subprocess.run(['potrace', pbm, '-s', '-o', svg, '--turdsize', '8', '--alphamax', '1.0', '--opttolerance', '0.3', '-C', '#%02X%02X%02X' % cols[ci]], check=True)
        cuerpo = open(svg).read()
        g = re.search(r'<g transform=.*?</g>', cuerpo, re.S).group(0)
        capas.append(g)
vb = re.search(r'viewBox="([^"]+)"', cuerpo).group(1)
ancho, alto = W, H
svg_final = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" width="{ancho}" height="{alto}">' + ''.join(capas) + '</svg>'
open(salida, 'w').write(svg_final)
print(os.path.basename(salida), len(orden), 'capas', [('#%02X%02X%02X' % cols[i]) for i in orden], f'{len(svg_final) // 1024} KB')
