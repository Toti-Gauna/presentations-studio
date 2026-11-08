"""Remera Handyx v5 · archivos de impresión en UNA tinta (serigrafía), sin fondos ni círculos.
Espalda: la costa de Mar del Plata dibujada con una sola línea fina (Torreón del Monje, la Rambla, el Casino con su
techo de mansarda, las torres, la Catedral y el faro con su haz), y abajo el texto en versalitas.
Frente: el logo chico en el pecho. Nuca: «MDP · 2026».
Cada archivo sale en dos colores de tinta: blanco (para tela azul o navy) y navy (para tela blanca o hueso).
Uso: python3 -I dossiers/herramientas/remera.py  → dossiers/piezas/07-remera/*.svg"""
import pathlib, re
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

R = pathlib.Path(__file__).resolve().parents[1]
OUT = R / 'piezas/07-remera'
OUT.mkdir(parents=True, exist_ok=True)


FUENTES = R / 'plantilla/fuentes'
_cache = {}


def trazos(texto, archivo, tam, x, y, espacio=0.0, ancla='middle', tinta='#FFFFFF'):
    """Texto convertido a curvas (la imprenta no necesita las fuentes). espacio = interletrado en unidades del dibujo."""
    if archivo not in _cache:
        f = TTFont(FUENTES / archivo)
        _cache[archivo] = (f, f.getGlyphSet(), f.getBestCmap(), f['head'].unitsPerEm)
    f, gs, cmap, upm = _cache[archivo]
    esc = tam / upm
    nombres = [cmap.get(ord(c), cmap.get(ord(' '))) for c in texto]
    ancho = sum(gs[n].width * esc + espacio for n in nombres) - espacio
    cx = x - (ancho / 2 if ancla == 'middle' else 0)
    d = []
    for n in nombres:
        pen = SVGPathPen(gs)
        gs[n].draw(TransformPen(pen, (esc, 0, 0, -esc, cx, y)))
        d.append(pen.getCommands())
        cx += gs[n].width * esc + espacio
    return f'<path d="{" ".join(d)}" fill="{tinta}"/>'


def skyline():
    """Costa de Mar del Plata en trazo único; unidades: 600 × 170 (se imprime a 280 mm de ancho)."""
    b = 140  # línea de la Rambla
    d = []
    # Torreón del Monje sobre las rocas, con su puente
    d.append(f'M0 {b} H14 L18 {b - 8} H34 V{b - 34} h4 v-4 h4 v4 h4 v-4 h4 v4 h4 v-4 h4 v4 h4 V{b - 72} h3 v-5 h4 v5 h4 v-5 h4 v5 h3 V{b - 34} h4 v-4 h4 v4 h4 v-4 h4 v4 h4 V{b - 8} L90 {b}')
    d.append(f'M50 {b - 54} v-8 a3 3 0 0 1 6 0 v8 M40 {b - 22} v-6 a3 3 0 0 1 6 0 v6 M70 {b - 22} v-6 a3 3 0 0 1 6 0 v6')
    d.append(f'M90 {b - 20} H132 M94 {b} V{b - 10} A17 12 0 0 1 128 {b - 10} V{b}')
    # la Rambla: arcada
    d.append(f'M132 {b} V{b - 26} H196 V{b}')
    for x in range(136, 194, 10):
        d.append(f'M{x} {b} V{b - 12} a4 4 0 0 1 8 0 V{b}')
    # el Casino: cuerpo largo, techo de mansarda con buhardillas y pabellones en las puntas
    d.append(f'M196 {b} V{b - 44} H204 V{b - 56} L210 {b - 66} H222 L228 {b - 56} V{b - 44} H300 V{b - 56} L306 {b - 66} H318 L324 {b - 56} V{b - 44} H332 V{b}')
    d.append(f'M228 {b - 44} L234 {b - 54} H294 L300 {b - 44}')
    for x in range(240, 292, 10):
        d.append(f'M{x} {b - 46} v-5 h4 v5')
    for fila in (b - 34, b - 20):
        for x in range(202, 330, 8):
            d.append(f'M{x} {fila + 8} v-7')
    # torres frente al mar, con sus pisos
    torres = [(338, 26, 92), (368, 22, 118), (394, 30, 84), (428, 20, 104), (452, 24, 70)]
    for x, w, h in torres:
        d.append(f'M{x} {b} V{b - h} H{x + w} V{b}')
        for y in range(b - h + 8, b - 4, 7):
            d.append(f'M{x + 4} {y} H{x + w - 4}')
    # la Catedral: nave y aguja
    d.append(f'M480 {b} V{b - 34} L494 {b - 46} L508 {b - 34} V{b} M508 {b - 34} V{b - 70} L514 {b - 104} L520 {b - 70} V{b}')
    d.append(f'M512 {b - 56} v-6 a2 2 0 0 1 4 0 v6')
    # el faro y su haz
    d.append(f'M548 {b} L554 {b - 92} H566 L572 {b}')
    for k in range(1, 5):
        y = b - k * 18
        w0 = 12 - k * 1.2
        d.append(f'M{560 - w0 / 2 - 3} {y} H{560 + w0 / 2 + 3}')
    d.append(f'M552 {b - 92} H568 M554 {b - 92} V{b - 104} H566 V{b - 92} M552 {b - 104} L560 {b - 112} L568 {b - 104}')
    d.append(f'M570 {b - 98} L600 {b - 110} M570 {b - 98} L600 {b - 86}')
    # la línea de la Rambla y el mar
    d.append(f'M-6 {b} H606')
    olas = []
    for fila, y in enumerate((b + 12, b + 22)):
        x0 = 20 + fila * 26
        olas.append(f'M{x0} {y} ' + ' '.join(f'q 8 -5 16 0 t 16 0' for _ in range(int((560 - x0) / 32))))
    return d, olas


def svg_espalda(tinta):
    d, olas = skyline()
    trazo = f'fill="none" stroke="{tinta}" stroke-linecap="round" stroke-linejoin="round"'
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 -20 640 300" width="300mm" height="140.6mm">
<title>Remera Handyx · espalda · una tinta</title>
<path d="{' '.join(d)}" {trazo} stroke-width="1.6"/>
<path d="{' '.join(olas)}" {trazo} stroke-width="1.1"/>
{trazos('MAR DEL PLATA', 'archivo-125-900-latin.woff2', 26, 300, 214, 12, tinta=tinta)}
{trazos("38°00' S · 57°33' O · SOLUCIONES, NO PROBLEMAS.", 'dm-sans-100-700-latin.woff2', 10, 300, 240, 4.2, tinta=tinta)}
<path d="M240 254 H360" stroke="{tinta}" stroke-width="1"/>
{trazos('HANDYX · EDICIÓN 01', 'dm-sans-100-800-latin.woff2', 9, 300, 270, 5, tinta=tinta)}
</svg>'''


def logo(tinta):
    t = (R / 'marca/logo-handyx-blanco.svg').read_text()
    vb = re.search(r'viewBox="([^"]+)"', t).group(1)
    cuerpo = re.sub(r'^.*?<svg[^>]*>', '', t, flags=re.S).rsplit('</svg>', 1)[0]
    cuerpo = re.sub(r'fill="#(?:fff|FFF|ffffff|FFFFFF)"', f'fill="{tinta}"', cuerpo)
    return vb, cuerpo


def svg_frente(tinta):
    vb, c = logo(tinta)
    _, _, w, h = map(float, vb.split())
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h * 1.55:.1f}" width="80mm" height="{80 * h * 1.55 / w:.1f}mm">
<title>Remera Handyx · pecho · una tinta</title><g fill="{tinta}">{c}</g>
{trazos('SOLUCIONES, NO PROBLEMAS.', 'dm-sans-100-700-latin.woff2', h * .2, 30, h * 1.48, h * .045, ancla='start', tinta=tinta)}</svg>'''


def svg_nuca(tinta):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 40" width="60mm" height="12mm"><title>Remera Handyx · nuca</title>
{trazos('MDP · 2026', 'dm-sans-100-800-latin.woff2', 15, 100, 26, 6, tinta=tinta)}</svg>'''


for nombre, tinta in (('blanca', '#FFFFFF'), ('navy', '#0E1D36')):
    (OUT / f'remera-espalda-tinta-{nombre}.svg').write_text(svg_espalda(tinta))
    (OUT / f'remera-frente-tinta-{nombre}.svg').write_text(svg_frente(tinta))
    (OUT / f'remera-nuca-tinta-{nombre}.svg').write_text(svg_nuca(tinta))
for viejo in ('remera-escena.svg', 'remera-espalda-impresion.png', 'remera-insignia-sola-impresion.png', 'remera-frente.svg'):
    (OUT / viejo).unlink(missing_ok=True)
print('remera v5 →', OUT)
