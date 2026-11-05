"""Arma un PPTX 16:9 con una imagen por diapositiva y las notas del orador.
Uso: python3 -I scripts/armar-pptx.py manifiesto.json salida.pptx [--liviano]
--liviano: las imágenes van en JPEG de 1600 × 900 (archivo mucho más chico: se abre bien en el celular y en visores livianos)."""
import io, json, sys
from pptx import Presentation
from pptx.util import Emu

m = json.load(open(sys.argv[1]))
liviano = '--liviano' in sys.argv

def imagen(ruta):
    if not liviano: return ruta
    from PIL import Image
    im = Image.open(ruta).convert('RGB').resize((1600, 900), Image.LANCZOS)
    b = io.BytesIO(); im.save(b, 'JPEG', quality=86, optimize=True, progressive=False); b.seek(0)
    return b
prs = Presentation()
prs.slide_width, prs.slide_height = Emu(12192000), Emu(6858000)
vacio = prs.slide_layouts[6]
for d in m['diapositivas']:
    s = prs.slides.add_slide(vacio)
    s.shapes.add_picture(imagen(d['imagen']), 0, 0, width=prs.slide_width, height=prs.slide_height)
    s.notes_slide.notes_text_frame.text = d['notas']
prs.core_properties.title = m['titulo']
prs.save(sys.argv[2])
