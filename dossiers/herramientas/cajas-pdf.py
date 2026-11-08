"""Post-proceso de los PDF de la colección: cajas de imprenta y metadatos.
Uso: python3 -I dossiers/herramientas/cajas-pdf.py <entrada.pdf> <salida.pdf> <sangrado-mm> [título]
Con sangrado > 0: MediaBox = BleedBox = papel con sangrado y TrimBox = formato final (lo que corta la imprenta).
Con sangrado 0: TrimBox = BleedBox = MediaBox (versión digital)."""
import sys
from pypdf import PdfReader, PdfWriter
from pypdf.generic import RectangleObject

entrada, salida, sangrado = sys.argv[1], sys.argv[2], float(sys.argv[3])
titulo = sys.argv[4] if len(sys.argv) > 4 and sys.argv[4] else 'Handyx'
s = sangrado * 72 / 25.4
w = PdfWriter(clone_from=PdfReader(entrada))
for p in w.pages:
    x0, y0, x1, y1 = (float(v) for v in (p.mediabox.left, p.mediabox.bottom, p.mediabox.right, p.mediabox.top))
    p.cropbox = RectangleObject([x0, y0, x1, y1])
    p.bleedbox = RectangleObject([x0, y0, x1, y1])
    p.trimbox = RectangleObject([x0 + s, y0 + s, x1 - s, y1 - s])
w.add_metadata({'/Title': titulo, '/Author': 'Handyx', '/Subject': titulo,
                '/Creator': 'Colección editorial Handyx', '/Producer': 'Colección editorial Handyx'})
w.write(salida)
