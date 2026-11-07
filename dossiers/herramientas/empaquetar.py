"""Arma los cinco zips de la colección Handyx (uno por pieza) desde dossiers/piezas/.
Cada zip: PDF de imprenta (sangrado 3 mm, TrimBox/BleedBox), PDF digital liviano, PNG por página, fuente editable
(HTML + plantilla + fuentes + solo los recursos de marca que usa) y LEEME.txt con las especificaciones de impresión.
Además deja los PDF digitales con los nombres fijos de la página /handyx/ de la landing.
Uso: python3 -I dossiers/herramientas/empaquetar.py [pieza …]   (sin argumentos, las cinco)
     → salida/dossiers/ (exportaciones) y salida/entregables/dossiers/*.zip + pdf-para-landing/
Requiere: node + playwright, pypdf, ghostscript, poppler-utils (pdftoppm, pdfinfo)."""
import pathlib, re, shutil, subprocess, sys, zipfile

R = pathlib.Path(__file__).resolve().parents[2]
D = R / 'dossiers'
SALIDA = R / 'salida/dossiers'
ENTREGA = R / 'salida/entregables/dossiers'
CORTE = '07/11/2026'
CONTACTO = 'Ignacio Gauna, fundador · ignaciogauna.developer@gmail.com · 223 667-4044 · landing.handyc.com'
PIEZAS = {
    '00-triptico': ('Handyx-Triptico', 'Tríptico institucional', 2),
    '01-business': ('Handyx-01-Business-Investment', 'Dossier 01 · Business & Investment', 20),
    '02-customer': ('Handyx-02-Customer-App', 'Dossier 02 · Customer App', 20),
    '03-professional': ('Handyx-03-Professional-App', 'Dossier 03 · Professional App', 20),
    '04-operations': ('Handyx-04-Operations-Portal', 'Dossier 04 · Operations Portal', 16),
}

IMPRESION_DOSSIER = """- Formato final: A4 vertical (210 × 297 mm), {paginas} páginas, impresión doble faz.
- Archivo de imprenta: {nombre}-imprenta.pdf, 216 × 303 mm por página (3 mm de sangrado por lado), con TrimBox y
  BleedBox. Fuentes embebidas (TrueType). Color RGB: pedir prueba de color antes de una tirada grande.
- Encuadernación sugerida: grapa a caballete (las {paginas} páginas son múltiplo de 4). Página 1 = tapa, {paginas} = contratapa.
- Papel sugerido: interior ilustración mate 150 g; tapas 250–300 g (si se imprimen aparte, son las páginas 1, 2,
  {anteultima} y {paginas})."""
IMPRESION_TRIPTICO = """- Formato final: A4 apaisado (297 × 210 mm), doble faz, plegado envolvente a 100 × 210 mm.
- Archivo de imprenta: {nombre}-imprenta.pdf, 2 páginas (exterior, interior) de 303 × 216 mm con 3 mm de sangrado,
  TrimBox y BleedBox. Paneles de 97 / 100 / 100 mm (exterior) y 100 / 100 / 97 mm (interior): el de 97 mm es la solapa
  que se pliega hacia adentro. Ver guia-de-plegado.pdf.
- Papel sugerido: ilustración mate 170 g, con hendido en los pliegues; volteo por el lado corto (al girar la hoja de izquierda a derecha, las dos caras
  quedan derechas): pedir una prueba impresa y plegada antes de la tirada. Color RGB: pedir
  prueba de color antes de una tirada grande."""

LEEME = """Handyx · {titulo}
Colección Handyx · Edición 1 · Mar del Plata, noviembre de 2026 · Estado al {corte}

Contenido
- {nombre}-imprenta.pdf: para la imprenta (ver especificaciones).
- {nombre}-digital.pdf: para mandar por mail o leer en pantalla (liviano, con enlaces).
- paginas/: una imagen PNG por página (150 ppp), para compartir o revisar.
- fuente-editable/: el documento editable (HTML + CSS), con la plantilla de la colección, las fuentes y las imágenes.{extra}

Impresión
{impresion}

Cómo editar y volver a exportar
- Abrí fuente-editable/piezas/{pieza}/index.html en Chrome para verlo. El texto está en ese archivo; los estilos comunes,
  en fuente-editable/plantilla/base.css.
- Para regenerar los PDF y las PNG: node fuente-editable/herramientas/exportar-pieza.cjs
  fuente-editable/piezas/{pieza}/index.html salida {nombre}
  (requiere Node con Playwright y Chromium, Python con pypdf, Ghostscript y poppler-utils). El exportador no deja salir
  un PDF con contenido desbordado, texto de menos de 5,5 pt, imágenes de menos de 150 ppp o fuentes ajenas.

Cómo leer el material
- Cada función indica su estado al {corte}: Construido, En pruebas, Diseñado o Concepto.
- Cada imagen dice de dónde sale: «Diseño propuesto» (lienzos de diseño), «Pantalla de la PWA · datos de prueba»,
  «Muestra · datos ficticios». Ningún nombre ni cifra de las pantallas es real.
- Cada cifra lleva su tipo (dato verificado, dato informado, supuesto, proyección, objetivo) y su fuente.

Licencias: fuentes Archivo y DM Sans (SIL Open Font License 1.1); símbolos de DejaVu Sans (licencia libre de
Bitstream Vera y DejaVu); mapas con datos de © colaboradores de OpenStreetMap (ODbL).

Contacto: {contacto}
Todo el material en un solo lugar: https://landing.handyc.com/handyx/
"""


def correr(cmd):
    subprocess.run(cmd, check=True, cwd=R)


def recursos_de_marca(html: str):
    """Rutas ../../marca/… que usa la pieza (y las del manifiesto de imágenes no hacen falta: ya están en img/)."""
    return sorted(set(re.findall(r'\.\./\.\./marca/([\w./-]+)', html)))


def empaquetar(pieza: str):
    nombre, titulo, esperadas = PIEZAS[pieza]
    carpeta = D / 'piezas' / pieza
    html = (carpeta / 'index.html').read_text(encoding='utf-8')
    out = SALIDA / pieza
    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)
    correr(['node', 'dossiers/herramientas/exportar-pieza.cjs', str(carpeta / 'index.html'), str(out), nombre])
    paginas = int(re.search(r'Pages:\s+(\d+)', subprocess.run(['pdfinfo', str(out / f'{nombre}-digital.pdf')], capture_output=True, text=True).stdout).group(1))
    if paginas != esperadas:
        print(f'  ATENCIÓN: {pieza} tiene {paginas} páginas y la arquitectura dice {esperadas}')
    extra = ''
    if pieza == '00-triptico':
        correr(['node', 'dossiers/herramientas/exportar-pieza.cjs', str(carpeta / 'guia-de-plegado.html'), str(out), 'guia-de-plegado', '--sin-png'])
        extra = '\n- guia-de-plegado.pdf: paneles, medidas, pliegues y orden de plegado para la imprenta.'
    ENTREGA.mkdir(parents=True, exist_ok=True)
    zipp = ENTREGA / f'{nombre}.zip'
    impresion = (IMPRESION_TRIPTICO if pieza == '00-triptico' else IMPRESION_DOSSIER).format(nombre=nombre, paginas=paginas, anteultima=paginas - 1)
    leeme = LEEME.format(titulo=titulo, corte=CORTE, nombre=nombre, extra=extra, impresion=impresion, pieza=pieza, contacto=CONTACTO)
    raiz = nombre
    with zipfile.ZipFile(zipp, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as z:
        z.writestr(f'{raiz}/LEEME.txt', leeme)
        z.write(out / f'{nombre}-imprenta.pdf', f'{raiz}/{nombre}-imprenta.pdf')
        z.write(out / f'{nombre}-digital.pdf', f'{raiz}/{nombre}-digital.pdf')
        if pieza == '00-triptico':
            z.write(out / 'guia-de-plegado-digital.pdf', f'{raiz}/guia-de-plegado.pdf')
        pngs = sorted((out / f'{nombre}-paginas').glob('pagina-*.png'), key=lambda p: int(re.search(r'(\d+)', p.stem).group(1)))
        for k, png in enumerate(pngs, 1):
            z.write(png, f'{raiz}/paginas/{nombre}-p{k:02d}.png', compress_type=zipfile.ZIP_STORED)
        fe = f'{raiz}/fuente-editable'
        usadas = set(re.findall(r'(img/[\w.-]+)', html + ((carpeta / 'guia-de-plegado.html').read_text() if pieza == '00-triptico' else '')))
        for f in sorted(carpeta.rglob('*')):
            rel = str(f.relative_to(carpeta))
            if f.is_file() and (not rel.startswith('img/') or rel in usadas):
                z.write(f, f'{fe}/piezas/{pieza}/{rel}')
        for f in sorted((D / 'plantilla').rglob('*')):
            if f.is_file() and f.name not in ('prueba-tecnica.html',):
                z.write(f, f'{fe}/plantilla/{f.relative_to(D / "plantilla")}')
        for rel in recursos_de_marca(html + ((carpeta / 'guia-de-plegado.html').read_text() if pieza == '00-triptico' else '')):
            z.write(D / 'marca' / rel, f'{fe}/marca/{rel}')
        for h in ('exportar-pieza.cjs', 'cajas-pdf.py'):
            z.write(D / 'herramientas' / h, f'{fe}/herramientas/{h}')
    if pieza != '00-triptico':
        hub = ENTREGA / 'pdf-para-landing'
        hub.mkdir(exist_ok=True)
        shutil.copy(out / f'{nombre}-digital.pdf', hub / f'{nombre}.pdf')
    print(f'{pieza}: {paginas} páginas → {zipp.relative_to(R)} ({zipp.stat().st_size / 1e6:.1f} MB)')


if __name__ == '__main__':
    for p in (sys.argv[1:] or list(PIEZAS)):
        empaquetar(p)
