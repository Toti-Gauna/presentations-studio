"""Instancias estáticas de Archivo y DM Sans para la colección impresa.
Chromium mete las fuentes variables en el PDF como Type 3 (vectoriales, pero muchas imprentas las rechazan en el preflight);
con instancias estáticas las embebe como TrueType. Genera dossiers/plantilla/fuentes/*.woff2 + fuentes.css.
Uso: python3 -I dossiers/herramientas/instanciar-fuentes.py   (requiere: pip install fonttools brotli)
Origen: @fontsource-variable/archivo y @fontsource-variable/dm-sans (licencia OFL 1.1, embebibles: fsType 0)."""
import pathlib
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

R = pathlib.Path(__file__).resolve().parents[2]
ORIGEN = R / 'node_modules/@fontsource-variable'
DESTINO = R / 'dossiers/plantilla/fuentes'
LATIN = 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD'
LATIN_EXT = 'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+1E00-1E9F, U+20A0-20AB, U+20AD-20C0, U+2113, U+A720-A7FF'
PESOS = {400: 'Regular', 500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold', 900: 'Black'}
ANCHOS = {100: '', 112.5: 'SemiExpanded', 125: 'Expanded'}

# (familia CSS, archivo base, estilo, coordenadas, descriptores CSS)
INSTANCIAS = []
for ancho, peso in [(125, 900), (125, 800), (112.5, 800), (112.5, 700), (100, 800)]:
    INSTANCIAS.append(('Archivo', 'archivo/files/archivo-{sub}-wdth-normal.woff2', 'normal', {'wdth': ancho, 'wght': peso}, ancho, peso))
for peso in (400, 500, 600, 700, 800):
    INSTANCIAS.append(('DM Sans', 'dm-sans/files/dm-sans-{sub}-opsz-normal.woff2', 'normal', {'opsz': 12, 'wght': peso}, 100, peso))
INSTANCIAS.append(('DM Sans', 'dm-sans/files/dm-sans-{sub}-opsz-italic.woff2', 'italic', {'opsz': 12, 'wght': 400}, 100, 400))


def nombres(f: TTFont, familia: str, estilo: str):
    ps = f'{familia.replace(" ", "")}-{estilo.replace(" ", "")}'
    for rec in list(f['name'].names):
        if rec.nameID in (1, 2, 3, 4, 6, 16, 17, 25):
            f['name'].removeNames(nameID=rec.nameID)
    for nid, valor in ((1, f'{familia} {estilo}'), (2, 'Regular'), (3, f'Handyx;{ps}'), (4, f'{familia} {estilo}'), (6, ps), (16, familia), (17, estilo)):
        f['name'].setName(valor, nid, 3, 1, 0x409)


reglas = ['/* Generado por dossiers/herramientas/instanciar-fuentes.py: instancias estáticas (TrueType en el PDF). OFL 1.1. */']
for familia, base, estilo_css, coords, ancho, peso in INSTANCIAS:
    estilo = ' '.join(x for x in (ANCHOS[ancho], PESOS[peso], 'Italic' if estilo_css == 'italic' else '') if x)
    for sub, rango in (('latin', LATIN), ('latin-ext', LATIN_EXT)):
        src = ORIGEN / base.format(sub=sub)
        if not src.exists():
            continue
        f = TTFont(src)
        inst = instancer.instantiateVariableFont(f, coords, inplace=False)
        nombres(inst, familia, estilo)
        archivo = f'{familia.lower().replace(" ", "-")}-{str(ancho).replace(".", "")}-{peso}{"-italic" if estilo_css == "italic" else ""}-{sub}.woff2'
        inst.flavor = 'woff2'
        inst.save(DESTINO / archivo)
        reglas.append(
            f"@font-face {{ font-family: '{familia}'; font-style: {estilo_css}; font-weight: {peso}; font-stretch: {ancho}%; "
            f"font-display: block; src: url('{archivo}') format('woff2'); unicode-range: {rango}; }}")
(DESTINO / 'fuentes.css').write_text('\n'.join(reglas) + '\n', encoding='utf-8')
print(len(reglas) - 1, 'caras →', DESTINO.relative_to(R))
