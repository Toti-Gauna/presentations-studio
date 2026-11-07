"""Copia a la carpeta de cada pieza las capturas que usa, como WebP sin pérdida (misma calidad de impresión que el PNG,
un 30 % más liviano), con recorte opcional. Lee un manifiesto JSON:
  [{"de": "usuario/I-Inicio.png", "a": "i-inicio.webp", "recorte": [x, y, ancho, alto] | null}, …]
Las rutas «de» son relativas a la carpeta de capturas (S/capturas) o absolutas.
Uso: python3 -I dossiers/herramientas/preparar-imagenes.py <manifiesto.json> <carpeta-capturas> <carpeta-img-de-la-pieza>"""
import json, os, sys
from PIL import Image

manifiesto, capturas, destino = sys.argv[1], sys.argv[2], sys.argv[3]
os.makedirs(destino, exist_ok=True)
for item in json.load(open(manifiesto)):
    origen = item['de'] if os.path.isabs(item['de']) else os.path.join(capturas, item['de'])
    im = Image.open(origen)
    im = im.convert('RGBA') if im.mode in ('RGBA', 'LA', 'P') else im.convert('RGB')
    if item.get('recorte'):
        x, y, w, h = item['recorte']
        im = im.crop((x, y, x + w, y + h))
    salida = os.path.join(destino, item['a'])
    im.save(salida, 'WEBP', lossless=True, quality=100, method=6)
    print(f"{item['a']:34} {im.size[0]}×{im.size[1]}  {os.path.getsize(salida) // 1024} KB")
