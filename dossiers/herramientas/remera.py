"""Remera Handyx v2: archivos de impresión (SVG vectorial) para frente y espalda, sobre tela azul de marca.
Frente: logo chico en el pecho con el lema. Espalda: solo edificios — la línea de Mar del Plata (torres, Casino con
techo de mansarda, Torreón del Monje y el faro) sobre la Rambla, el logo y «Hecho en Mar del Plata». Tintas: blanco, amarillo #F5F59A y cielo #E9EFF9 (lo azul es la tela, no se imprime).
Uso: python3 -I dossiers/herramientas/remera.py  → dossiers/piezas/07-remera/"""
import pathlib, re

R = pathlib.Path(__file__).resolve().parents[1]
OUT = R / 'piezas/07-remera'
OUT.mkdir(parents=True, exist_ok=True)
BLANCO, AMA, CIELO, TELA = '#FFFFFF', '#F5F59A', '#E9EFF9', '#1F57A8'


def interior(svg_txt):
    """Devuelve el contenido de un SVG y su viewBox para incrustarlo con <g transform>."""
    vb = re.search(r'viewBox="([^"]+)"', svg_txt).group(1)
    cuerpo = re.sub(r'^.*?<svg[^>]*>', '', svg_txt, flags=re.S).rsplit('</svg>', 1)[0]
    cuerpo = re.sub(r'<title>.*?</title>', '', cuerpo, flags=re.S)
    return vb, cuerpo


def incrustar(archivo, x, y, w):
    vb, c = interior((R / archivo).read_text())
    _, _, vw, vh = map(float, vb.split())
    s = w / vw
    return f'<g transform="translate({x} {y}) scale({s:.4f})">{c}</g>', vh * s


def skyline(x0, base, ancho):
    p = []
    # torres de la costa (izquierda), con ventanas como franjas que dejan ver la tela
    torres = [(0, 26, 92), (30, 22, 128), (56, 30, 106), (90, 20, 150), (114, 28, 118), (146, 24, 96)]
    for dx, w, h in torres:
        x = x0 + dx
        p.append(f'<rect x="{x}" y="{base - h}" width="{w}" height="{h}" fill="{BLANCO}"/>')
        for fy in range(int(base - h + 8), int(base - 10), 11):
            p.append(f'<rect x="{x + 4}" y="{fy}" width="{w - 8}" height="4" fill="{TELA}"/>')
    # Casino / Hotel Provincial: cuerpo largo, techo de mansarda con buhardillas, pabellones en las puntas
    cx = x0 + 182
    p.append(f'<rect x="{cx}" y="{base - 52}" width="150" height="52" fill="{CIELO}"/>')
    p.append(f'<path d="M{cx - 4} {base - 52} L{cx + 10} {base - 72} H{cx + 140} L{cx + 154} {base - 52} Z" fill="{BLANCO}"/>')
    for bx in range(cx + 16, cx + 136, 16):
        p.append(f'<rect x="{bx}" y="{base - 67}" width="6" height="8" rx="1" fill="{TELA}"/>')
    for fila in (0, 1):
        for wx in range(cx + 8, cx + 146, 11):
            y = base - 46 + fila * 22
            p.append(f'<path d="M{wx} {y + 14} V{y + 4} A3 3 0 0 1 {wx + 6} {y + 4} V{y + 14} Z" fill="{TELA}"/>')
    for px in (cx - 8, cx + 134):
        p.append(f'<rect x="{px}" y="{base - 64}" width="24" height="64" fill="{CIELO}"/>')
        p.append(f'<path d="M{px - 3} {base - 64} L{px + 4} {base - 84} H{px + 20} L{px + 27} {base - 64} Z" fill="{BLANCO}"/>')
    # Torreón del Monje con almenas y su puente
    tx = x0 + 352
    p.append(f'<rect x="{tx}" y="{base - 40}" width="44" height="40" fill="{BLANCO}"/>')
    p.append(f'<rect x="{tx + 8}" y="{base - 84}" width="20" height="46" fill="{BLANCO}"/>')
    for k in range(4):
        p.append(f'<rect x="{tx + 8 + k * 5.5}" y="{base - 90}" width="3.6" height="7" fill="{BLANCO}"/>')
    for k in range(6):
        p.append(f'<rect x="{tx + k * 7.8}" y="{base - 46}" width="5" height="7" fill="{BLANCO}"/>')
    p.append(f'<path d="M{tx + 14} {base - 60} V{base - 68} A4 4 0 0 1 {tx + 22} {base - 68} V{base - 60} Z" fill="{TELA}"/>')
    p.append(f'<path d="M{tx + 44} {base - 18} Q{tx + 60} {base - 34} {tx + 76} {base - 18}" fill="none" stroke="{BLANCO}" stroke-width="4"/>')
    # faro
    fx = x0 + 440
    for i in range(6):
        y0, y1 = base - i * 22, base - (i + 1) * 22
        w0, w1 = 13 - i * 1.2, 13 - (i + 1) * 1.2
        p.append(f'<path d="M{fx - w0} {y0} L{fx + w0} {y0} L{fx + w1} {y1} L{fx - w1} {y1} Z" fill="{BLANCO if i % 2 == 0 else CIELO}"/>')
    p.append(f'<rect x="{fx - 8}" y="{base - 150}" width="16" height="16" rx="2" fill="{AMA}"/>')
    p.append(f'<path d="M{fx - 10} {base - 150} L{fx} {base - 162} L{fx + 10} {base - 150} Z" fill="{BLANCO}"/>')
    p.append(f'<path d="M{fx + 10} {base - 144} L{fx + 70} {base - 162} L{fx + 70} {base - 128} Z" fill="{AMA}" opacity="0.55"/>')
    # Rambla y mar
    p.append(f'<rect x="{x0 - 10}" y="{base}" width="{ancho + 20}" height="5" rx="2.5" fill="{BLANCO}"/>')
    for k, dy in enumerate((14, 24)):
        p.append(f'<path d="M{x0 + 10 + k * 20} {base + dy} ' + ''.join(f'q 10 -6 20 0 t 20 0 ' for _ in range(int((ancho - 60) / 40))) + f'" fill="none" stroke="{CIELO}" stroke-width="3" stroke-linecap="round"/>')
    return ''.join(p)


# ---------- espalda: 300 × 380 mm (unidades = mm × 2)
W, H = 600, 760
handys = ''
for i, (n, x) in enumerate((('foco', 150), ('engranaje', 250), ('llave', 350), ('brocha', 450))):
    g, h = incrustar(f'marca/personajes-v2/{n}.svg', x - 46, 0, 92)
    handys += g.replace('translate(', f'translate(0 {664 - h}) translate(', 1)
logo, lh = incrustar('marca/logo-handyx-blanco.svg', 150, 120, 300)
espalda = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="300mm" height="380mm">
<title>Remera Handyx · espalda (impresión, tela azul #1F57A8)</title>
{logo}
<text x="300" y="{120 + lh + 44}" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="22" letter-spacing="7" fill="{AMA}">SOLUCIONES, NO PROBLEMAS.</text>
<g transform="translate(-83 -110) scale(1.25)">{skyline(70, 560, 460)}</g>
<text x="300" y="720" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="800" font-size="17" letter-spacing="8" fill="{CIELO}">HECHO EN MAR DEL PLATA</text>
</svg>'''
(OUT / 'remera-espalda.svg').write_text(espalda)

# ---------- frente: pecho izquierdo, 100 × 40 mm
logo_f, lhf = incrustar('marca/logo-handyx-blanco.svg', 0, 0, 200)
frente = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 {lhf + 34:.0f}" width="130mm" height="{(lhf + 34) / 2:.0f}mm">
<title>Remera Handyx · frente (pecho)</title>{logo_f}
<text x="2" y="{lhf + 26:.0f}" font-family="DM Sans, sans-serif" font-weight="700" font-size="15" letter-spacing="1.5" fill="{AMA}">Soluciones, no problemas.</text></svg>'''
(OUT / 'remera-frente.svg').write_text(frente)
print('remera → ', OUT)
