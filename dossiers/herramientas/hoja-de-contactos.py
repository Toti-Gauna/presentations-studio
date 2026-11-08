"""Hojas de contacto de las capturas de un lienzo: grillas JPEG con miniaturas rotuladas (archivo y título), para revisar
muchos tableros de un vistazo. Lee el indice.json que deja capturar-lienzo.cjs.
Uso: python3 -I dossiers/herramientas/hoja-de-contactos.py <carpeta-capturas> [salida] [columnas=4] [filas=3]
  → <salida>/hoja-01.jpg, hoja-02.jpg… (por defecto <carpeta-capturas>/hojas)"""
import json, os, sys
from PIL import Image, ImageDraw, ImageFont

carpeta = sys.argv[1]
salida = sys.argv[2] if len(sys.argv) > 2 else os.path.join(carpeta, 'hojas')
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 4
filas = int(sys.argv[4]) if len(sys.argv) > 4 else 3
indice = json.load(open(os.path.join(carpeta, 'indice.json')))
caps = [c for c in indice['capturas'] if c.get('png')]
# celdas verticales para pantallas de celular y tableros altos; apaisadas si la mayoría son horizontales (láminas 16:9)
aspectos = sorted(c['w'] / c['h'] for c in caps if c.get('w') and c.get('h')) or [0.5]
CW, CH = (640, 380) if aspectos[len(aspectos) // 2] > 1.2 else (420, 560)
ROT, PAD = 46, 14
f1 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 15)
f2 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 13)
os.makedirs(salida, exist_ok=True)

def corto(t, fuente, ancho):
    while t and fuente.getlength(t) > ancho:
        t = t[:-2] + '…' if len(t) > 2 else ''
    return t

por_hoja = cols * filas
for h in range(0, len(caps), por_hoja):
    lote = caps[h:h + por_hoja]
    hoja = Image.new('RGB', (cols * CW + PAD, filas * (CH + ROT) + PAD), (236, 239, 245))
    d = ImageDraw.Draw(hoja)
    for k, c in enumerate(lote):
        x, y = PAD + (k % cols) * CW, PAD + (k // cols) * (CH + ROT)
        im = Image.open(os.path.join(carpeta, c['png'])).convert('RGB')
        im.thumbnail((CW - PAD, CH - PAD), Image.LANCZOS)
        hoja.paste(im, (x + (CW - PAD - im.width) // 2, y + (CH - PAD - im.height) // 2))
        d.text((x, y + CH - 6), corto(f"{h + k + 1}. {c['archivo'].replace('.dc.html', '')}", f1, CW - PAD), fill=(19, 48, 94), font=f1)
        d.text((x, y + CH + 14), corto(c['titulo'], f2, CW - PAD), fill=(60, 70, 90), font=f2)
    destino = os.path.join(salida, f'hoja-{h // por_hoja + 1:02d}.jpg')
    hoja.save(destino, quality=82)
print(f'{(len(caps) + por_hoja - 1) // por_hoja} hojas · {len(caps)} capturas → {salida}')
