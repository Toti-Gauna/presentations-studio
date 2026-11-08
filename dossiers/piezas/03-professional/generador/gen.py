# Genera dossiers/piezas/03-professional/index.html (ola 7: dirección de arte premium).
# Toma de la versión ola 6 (index-ola6.html) la tapa, el índice, las preguntas, la contratapa y los números calados;
# el resto de las páginas se arma acá con despieces, escenas y vitrinas.
import re, json, sys
W = '/tmp/claude-0/-home-user/10ab011c-6752-54be-831e-b3c4da2461d0/scratchpad/ola7/w03'
PZ = '/home/user/presentations-studio/dossiers/piezas/03-professional'
sys.path.insert(0, W)
from recortes import R

old = open(W + '/index-ola6.html', encoding='utf8').read()
secs = re.findall(r'<section class="pagina.*?</section>', old, re.S)
assert len(secs) == 28, len(secs)
estilo_old = re.search(r'<style>(.*?)</style>', old, re.S).group(1)
CAPN = {}
for k, i in zip([1, 2, 3, 4, 5, 6, 7], [2, 6, 10, 13, 18, 21, 24]):
    CAPN[k] = re.search(r'<svg class="cap-n-svg".*?</svg>', secs[i], re.S).group(0)
ESC_JS = open(W + '/escenas-p03.js', encoding='utf8').read()

def f(x):
    return ('%.2f' % x).rstrip('0').rstrip('.')

# ---------------------------------------------------------------- piezas chicas
ET = {'construido': 'Construido', 'en-pruebas': 'En pruebas', 'disenado': 'Diseñado', 'concepto': 'Concepto'}
def et(e, txt=None):
    return f'<span class="et {e}">{txt or ET[e]}</span>'
def est(e, txt=None):
    return f'<span class="estado {e}">{txt or ET[e]}</span>'
ROT = '<span class="rotulo diseno">Diseño propuesto · datos ficticios</span>'
def origen(html):
    return f'<p class="p-origen empuja">{html}</p>'
def cab(izq, color=None):
    st = ' style="color:rgba(255,255,255,0.72)"' if color == 'blanco' else ''
    return f'<div class="cab-p"{st}><span>{izq}</span><span>Handyx · Professional App</span></div>'
PIE = '<div class="pie-p"><span>Handyx · Professional App</span><b class="folio-n">00</b></div>'
def pagina(cuerpo, id_='', cls='', estilo=''):
    i = f' id="{id_}"' if id_ else ''
    s = f' style="{estilo}"' if estilo else ''
    return f'<section class="pagina {cls}"{i}{s}>\n  <div class="lamina">\n{cuerpo}\n    {PIE}\n  </div>\n</section>'
def titulo(ceja, t, lead=None, lead_w=150):
    h = f'<span class="p-ceja">{ceja}</span>\n      <h1 class="p-titulo" style="margin-top:5mm">{t}</h1>'
    if lead:
        h += f'\n      <p class="p-lead" style="margin-top:4.5mm;max-width:{lead_w}mm">{lead}</p>'
    return h

def movil(img, w, toques=(), extra=''):
    tq = ''.join(f'<span class="toque" style="left:{l}%;top:{t}%">{n}</span>' for (l, t, n) in toques)
    return f'<div class="movil" style="--w:{f(w)}mm{extra}"><div class="pant"><img src="img/{img}.webp" alt=""></div>{tq}</div>'

# ---------------------------------------------------------------- despiece
class Despiece:
    """Panel de color con un teléfono grande y recortes reales ampliados flotando alrededor."""
    def __init__(self, w, h, fondo='cielo', clara=False, cls=''):
        self.w, self.h, self.fondo, self.clara, self.cls = w, h, fondo, clara, cls
        self.capas = []
        self.tel = None
    def movil(self, img, x, y, w, toques=()):
        self.tel = (x, y, w)
        self.capas.append(movil(img, w, toques, f';position:absolute;left:{f(x)}mm;top:{f(y)}mm'))
        return self
    def pt(self, cx, cy):
        x, y, w = self.tel
        h = w * 880 / 426
        s = 0.9155 * w / 390
        return x + 0.04225 * w + cx * s, y + 0.02045 * h + cy * s
    def flota(self, k, x, y, w, r=18, alt='', z=''):
        cw, ch = R[k][1][2], R[k][1][3]
        rad = r * w / cw + 0.15 if r else 2.4
        zz = f';z-index:{z}' if z else ''
        self.capas.append(f'<div class="flota" style="left:{f(x)}mm;top:{f(y)}mm;width:{f(w)}mm;border-radius:{f(rad)}mm{zz}"><img src="img/x-{k}.webp" alt="{alt}"></div>')
        return y + w * ch / cw  # devuelve el borde de abajo
    def marca(self, cx, cy, cw, ch, r=12):
        """contorno punteado sobre la zona del teléfono de donde sale un recorte"""
        x0, y0 = self.pt(cx, cy)
        x1, y1 = self.pt(cx + cw, cy + ch)
        s = 0.9155 * self.tel[2] / 390
        self.capas.append(f'<div class="marca-r{" clara" if self.clara else ""}" style="left:{f(x0)}mm;top:{f(y0)}mm;width:{f(x1 - x0)}mm;height:{f(y1 - y0)}mm;border-radius:{f(r * s + 0.3)}mm"></div>')
        return self
    def guia(self, txt, x, y, lado='izq', largo=10):
        """(x, y): el punto. lado izq = punto a la izquierda y texto a la derecha; der = al revés."""
        lineas = txt.count('<br>') + 1
        top = y - lineas * 2.96 / 2
        cl = ' clara' if self.clara else ''
        if lado in ('abajo', 'abajo-der'):
            pos = f'left:{f(x - 0.9)}mm' if lado == 'abajo' else f'right:{f(self.w - x - 0.9)}mm'
            c = ('guia v' if lado == 'abajo' else 'guia vd') + cl
            self.capas.append(f'<span class="{c}" style="{pos};top:{f(y - 0.9)}mm;--largo:{f(largo)}mm"><span>{txt}</span></span>')
            return self
        if lado == 'izq':
            pos = f'left:{f(x - 0.9)}mm'
            c = 'guia' + cl
        else:
            pos = f'right:{f(self.w - x - 0.9)}mm'
            c = 'guia der' + cl
        self.capas.append(f'<span class="{c}" style="{pos};top:{f(top)}mm;--largo:{f(largo)}mm"><span>{txt}</span></span>')
        return self
    def libre(self, html):
        self.capas.append(html)
        return self
    def html(self, mt=7):
        return (f'<div class="despiece {self.cls}" style="margin-top:{mt}mm;height:{f(self.h)}mm;background:none">'
                f'<div class="capa grano" style="background:{self.fondo}"></div>' + ''.join(self.capas) + '</div>')

# ---------------------------------------------------------------- vitrina (recorrido en una fila sobre un panel)
def vitrina(pasos, w, g, fondo='var(--cielo)', flechas=True, mt=8):
    n = len(pasos)
    cols = ''
    for p in pasos:
        e = p.get('e', '')
        cols += (f'<div class="vpaso">{movil(p["img"], w, p.get("toques", ()))}'
                 f'<div class="pie-paso"><div class="n">{p["n"]}</div><p class="p-h">{p["h"]}</p><p class="p-texto">{p["t"]}</p>{("<p class=\"e-l\">" + e + "</p>") if e else ""}</div></div>')
    fl = ' flechas' if flechas else ''
    return (f'<div class="vit{fl}" style="--n:{n};--w:{f(w)}mm;--g:{f(g)}mm;margin-top:{mt}mm">'
            f'<div class="fondo-v grano" style="background:{fondo}"></div>{cols}</div>')

# ---------------------------------------------------------------- apertura de capítulo
def apertura(n, id_, ceja, foto, foto_pos, banda_h, escena, card, titulo_h, lead, resto, origen_html='', foto_w=196, oscuro_card=False):
    """card = (left, top, width) en mm del papel; escena = 'verificar' (común) o 'p:ruta' (propia)."""
    if escena.startswith('p:'):
        esc = f'<div data-escena-p="{escena[2:]}"></div>'
    else:
        esc = f'<div data-escena="{escena}"></div>'
    l, t, w = card
    top_titulo = t + (w - 10) * 0.6 + 7 + 9  # borde de abajo de la tarjeta + aire
    mt = top_titulo - 22 - 33.1
    cuerpo = f'''    <div class="banda azul" style="height:calc({f(banda_h)}mm + var(--sangrado))"><img class="foto-banda" src="../../marca/fotos/{foto}-azul.webp" alt="" style="width:{f(foto_w)}mm;height:{f(banda_h)}mm;object-position:{foto_pos};opacity:0.92"><div class="velo"></div><div class="capa grano" style="opacity:.9"></div></div>
    <div class="esc-card" style="left:{f(l)}mm;top:{f(t)}mm;width:{f(w)}mm">{esc}</div>
    {cab('Capítulo 0' + str(n), 'blanco')}
    <div class="caja">
      <div class="p-azul" style="background:none">{CAPN[n]}<span class="p-ceja" style="margin-top:6mm">{ceja}</span></div>
      <div style="margin-top:{f(mt)}mm">
        <h1 class="p-titulo">{titulo_h}</h1>
        <p class="p-lead" style="margin-top:4.5mm;max-width:156mm">{lead}</p>
      </div>
      {resto}
      {origen_html}
    </div>'''
    return pagina(cuerpo, id_)

P = []  # páginas

# ================================================================ 1 tapa (ola 6, con grano en la banda)
tapa = secs[0].replace('<div class="velo"></div>', '<div class="velo"></div><div class="capa grano"></div>', 1)
tapa = tapa.replace('<img class="abs permite-salir" src="img/m-pedido-plata.webp" alt="" style="right:-6mm;top:70mm;width:92mm">',
    '<img class="abs permite-salir" src="img/m-pedido-plata.webp" alt="" style="right:-6mm;top:70mm;width:92mm">\n'
    '    <div class="flota permite-salir" style="left:84mm;top:229mm;width:62mm;border-radius:3.3mm;z-index:3"><img src="img/x-recibis.webp" alt="Recibís el 100 %"></div>')
P.append(tapa)

# ================================================================ 2 contenido (ola 6, «cómo leer» al día)
cont = secs[1].replace('Los puntos amarillos numerados marcan qué se toca en cada pantalla, en el orden del recorrido.',
    'Los puntos numerados marcan qué se toca en cada pantalla, en el orden del recorrido. En las pantallas ampliadas, las etiquetas con línea señalan cada parte.')
P.append(cont)

# ================================================================ 3 · cap 01 apertura
P.append(apertura(1, 'cap1', 'Cómo validamos', 'aerea-centro-playa', 'center 40%', 122, 'verificar', (84, 60, 112),
    'Cargar un documento no es estar <span class="p-marca">verificado</span>',
    'Te anotás en diez pasos y podés cortar y seguir después. Después, el equipo de verificación revisa cada documento y te habilita rubro por rubro. Hasta entonces no recibís pedidos, y ningún sello aparece sin que lo ponga el servidor.',
    '<div class="grilla cifras-ap"><div class="c-4 p-raya"><div class="p-num">10</div><p class="p-texto">pasos de alta, con barra de avance</p><span class="estado disenado">Diseñado</span></div><div class="c-4 p-raya"><div class="p-num">2 de 6</div><p class="p-texto">rubros piden matrícula: Gas y Aire acondicionado</p><span class="estado en-pruebas">En pruebas</span></div><div class="c-4 p-raya"><div class="p-num">1</div><p class="p-texto">solo el equipo de verificación habilita</p><span class="estado en-pruebas">En pruebas</span></div></div>',
    origen('<span class="tipo-dato">Dato informado · sin auditar</span> 56 especialistas registrados al 31/10/2026: anotados por el fundador fuera de la landing, en una planilla propia, con su consentimiento. No son activos ni verificados. <span class="tipo-dato">Dato verificado</span> 6 rubros.')))

# ================================================================ 4 · alta pasos 1–4 (vitrina de 3)
RUBROS = re.search(r'<div class="rubros6".*?</div></div>', secs[3], re.S).group(0)
P.append(pagina(f'''    {cab('01 · Cómo validamos')}
    <div class="caja">
      {titulo('El alta · pasos 1 a 4', 'Quién sos, qué hacés y <span class="p-marca">dónde trabajás</span>',
              'Diez pasos con barra de avance: podés dejar a la mitad y seguir otro día. Los primeros cuatro arman tu perfil y tu zona; el cliente ve tu nombre, tu foto y tus rubros, nunca tu domicilio.')}
      {vitrina([
        dict(img='rg-1', n='01 · 02', h='Tus datos y tu domicilio', t='Nombre, teléfono, email y contraseña. El domicilio, cifrado, sirve para calcular distancias: nunca se muestra.', toques=[(50, 92.3, 1)], e=et('disenado', 'Alta cifrada · Diseñado')),
        dict(img='rg-3', n='03', h='Tus rubros', t='Uno o más de los seis. Gas y Aire acondicionado se habilitan recién con la matrícula verificada.', toques=[(71.6, 26.7, 3)], e=et('en-pruebas', 'Rubros con matrícula · En pruebas')),
        dict(img='rg-4', n='04', h='Tus zonas', t='Solo te llegan pedidos de estos barrios. Lo cambiás cuando quieras.', toques=[(45.1, 52.2, 4)], e=et('en-pruebas')),
      ], 44, 16, mt=9)}
      <p class="p-h" style="margin-top:8mm">Los seis rubros con los que arranca Handyx</p>
      {RUBROS.replace('class="rubros6" style="margin-top:7mm"', 'class="rubros6 altos" style="margin-top:3.5mm"')}
      {origen(ROT + ' Alta en 10 pasos (RG-1, RG-3 y RG-4) ' + est('disenado') + ' Alta guiada con identidad, rubros y zonas en código ' + est('en-pruebas'))}
    </div>'''))

# ================================================================ 5 · documentos (despiece chico)
d = Despiece(174, 103, 'var(--hueso)')
d.movil('rg-8', 12, 5, 44)
d.flota('rg8-matricula', 34, 27, 66, r=24, alt='Matrícula de gasista: cargado, en revisión')
d.flota('alta-cab', 108, 7, 60, r=0, alt='Estamos evaluando tu perfil')
d.flota('alta-filas', 108, 30, 60, r=0, alt='Cada documento con su estado')
d.guia('«Cargado» no es<br>estar verificado', 62, 48.6, 'abajo', 5)
d.guia('Selfie, DNI y matrícula: «en revisión»<br>hasta que el equipo los revisa', 160, 86.8, 'abajo-der', 3)
P.append(pagina(f'''    {cab('01 · Cómo validamos')}
    <div class="caja">
      {titulo('El alta · pasos 5 a 10', 'Tu cara, tus documentos y <span class="p-marca">tus matrículas</span>',
              'Cada documento que cargás queda «en revisión». Lo obligatorio y lo opcional están separados: lo opcional suma a tu perfil solo cuando lo verifican.')}
      {d.html(7)}
      <div class="pasos4">
        <div><span class="n">05</span><p class="p-h">Una selfie</p><p class="p-texto">Para que el cliente sepa quién llega y para compararla con tu DNI.</p></div>
        <div><span class="n">06</span><p class="p-h">Tu DNI</p><p class="p-texto">Frente y dorso. «Cargarlo no es estar verificado.»</p></div>
        <div><span class="n">07</span><p class="p-h">CUIT o CUIL</p><p class="p-texto">Y cómo facturás: monotributo, responsable inscripto o todavía no.</p></div>
        <div><span class="n">08</span><p class="p-h">Certificados</p><p class="p-texto">Matrícula obligatoria por rubro; cursos y seguro, opcionales.</p></div>
      </div>
      <div class="grilla" style="margin-top:6mm;column-gap:6mm;align-items:stretch">
        <div class="c-7 destacado"><div class="paso-txt"><div class="n">09</div><p class="p-h">Antecedentes, en persona {et('en-pruebas', 'Turno presencial · En pruebas')}</p><p class="p-texto">Reservás un turno y mostrás el certificado de antecedentes al equipo. <b>Nunca se sube como archivo.</b> Sin antecedentes revisados no recibís pedidos.</p><p class="p-texto nota-chica">El lienzo dibuja otra versión (foto o PDF, cifrado y borrado al verificar), en revisión legal: no se aplica ni se muestra acá.</p></div></div>
        <div class="c-5 paso-txt" style="padding-top:4mm"><div class="n">10</div><p class="p-h">Revisás y enviás {et('disenado')}</p><p class="p-texto">Ves todo lo cargado con su estado, aceptás los términos y el aviso de privacidad para especialistas y lo mandás a revisar.</p></div>
      </div>
      {origen(ROT + ' RG-8 y el estado del alta (recortes ampliados) ' + est('disenado') + ' Identidad, selfie y certificados en código ' + est('en-pruebas'))}
    </div>'''))

# ================================================================ 6 · habilitación (héroe)
p6 = secs[5]
p6 = re.sub(r'<span class="estado (en-pruebas|disenado)">(En pruebas|Diseñado)</span></div></div>', lambda m: f'<p class="e-l">{et(m.group(1))}</p></div></div>', p6)
p6 = p6.replace('<div class="heroe" style="margin-top:8mm">', '<div class="heroe heroe-panel" style="margin-top:9mm">')
p6 = p6.replace('<p class="p-h" style="margin-top:9mm">Los estados del alta</p>', '<p class="p-h" style="margin-top:11mm">Los estados del alta</p>')
p6 = p6.replace('<p class="p-texto">Lo resuelve el equipo, con su motivo.</p><span class="estado en-pruebas">En pruebas</span>', '<p class="p-texto">Lo resuelve el equipo, con su motivo.</p>')
p6 = p6.replace('<p class="p-texto" style="margin-top:5mm;max-width:150mm"><b>Plazo de la verificación:</b>', '<p class="p-texto" style="margin-top:6mm;max-width:150mm"><b>Plazo de la verificación:</b>')
P.append(p6)

# ================================================================ 7 · cap 02 apertura
P.append(apertura(2, 'cap2', 'Los pedidos, sin obligación', 'aerea-cabo-puerto', 'center 35%', 122, 'conectar', (14, 60, 112),
    'Te llegan pedidos de tu zona. <span class="p-marca">Vos decidís</span>',
    'Nadie te asigna trabajos ni te mide por cuántos aceptás. Ves el pedido sin datos del cliente, ponés tu precio con la sugerencia de Handyx y proponés cuándo vas. La dirección exacta llega solo si el cliente te elige.',
    '<div class="grilla cifras-ap"><div class="c-4 p-raya"><div class="p-num">0 %</div><p class="p-texto">de comisión al especialista: recibís el 100 % de tu precio</p><span class="tipo-dato esp-1">Decisión del fundador · 07/11/2026</span></div><div class="c-4 p-raya"><div class="p-num">6</div><p class="p-texto">rubros del hogar</p><span class="tipo-dato esp-1">Dato verificado</span></div><div class="c-4 p-raya"><div class="p-num">«Ahora no»</div><p class="p-texto">no tiene ninguna consecuencia</p><span class="estado en-pruebas">En pruebas</span></div></div>'))

# ================================================================ 8 · disponibilidad (héroe + escena agenda)
P.append(pagina(f'''    {cab('02 · Los pedidos')}
    <div class="caja">
      {titulo('Disponibilidad', 'Urgentes, solo si <span class="p-marca">vos querés</span>')}
      <div class="heroe" style="margin-top:8mm">
        {movil('cu-disponibilidad', 58, [(88.3, 13.1, 1), (88.3, 20.5, 2), (16.7, 33.9, 3), (52.6, 69.4, 4)])}
        <div class="notas">
          <div class="nota"><span class="num">1</span><div><p class="p-h">Urgentes ahora: un permiso que revocás</p><p class="p-texto">Te llegan urgentes solo con «Disponible» prendido. Lo apagás cuando quieras, sin explicar nada.</p></div></div>
          <div class="nota"><span class="num">2</span><div><p class="p-h">Programados, aparte</p><p class="p-texto">Pedidos para otro día, dentro de tus horarios. Los prendés o apagás por separado.</p></div></div>
          <div class="nota"><span class="num">3</span><div><p class="p-h">Tus días y horarios</p><p class="p-texto">Fuera de tu horario no te llega nada.</p></div></div>
          <div class="nota"><span class="num">4</span><div><p class="p-h">Tus zonas y rubros</p><p class="p-texto">Solo pedidos de tus barrios y de los rubros que el equipo te habilitó.</p></div></div>
          <p class="e-l" style="margin-left:10mm">{et('en-pruebas', 'Las cuatro, en pruebas')}</p>
        </div>
      </div>
      <div class="grilla" style="margin-top:9mm;column-gap:8mm;align-items:center">
        <div class="c-5"><div class="panel-esc grano-in"><div class="capa grano" style="background:var(--cielo)"></div><div data-escena="agenda" data-fondo="no" style="position:relative"></div></div></div>
        <div class="c-7">
          <p class="p-h">Un aviso abre el detalle, nunca acepta {et('en-pruebas')}</p>
          <p class="p-texto" style="margin-top:1mm">Pedidos nuevos, respuestas y pagos: tocás el aviso y vas al detalle. Nada se acepta desde un aviso.</p>
          <div class="regla-lista" style="margin-top:4mm">
            <p><b>Sin asignaciones.</b> Ningún pedido se te asigna solo.</p>
            <p><b>Sin métricas que presionen.</b> Tu inicio no muestra tasas de aceptación, tiempos de respuesta ni puntualidad.</p>
            <p><b>Sin castigo.</b> Rechazar o dejar pasar un pedido no tiene consecuencias.</p>
          </div>
        </div>
      </div>
      {origen(ROT + ' CU-Disponibilidad ' + est('en-pruebas', 'En pruebas · disponibilidad y avisos en código') + ' Avisos por notificación: sin proveedor todavía')}
    </div>'''))

# ================================================================ 9 · DESPIECE pedido y precio
d = Despiece(174, 152, 'var(--azul)', clara=True)
d.movil('f-pedido', 14, 14, 58)
d.flota('pedido-cab', 52, 8, 70, r=0, alt='Plomería · urgente', z=2)
d.flota('precio', 92, 33, 76, r=0, alt='Tu precio')
d.flota('recibis', 98, 85, 66, r=18, alt='Recibís el 100 %')
d.flota('pedido-info', 52, 98, 72, r=0, alt='Zona aproximada, horario y lo que cuenta el cliente')
d.flota('ahora-no', 6, 140, 58, r=0, alt='Ahora no')
d.guia('Vigencia y +1 al camino', 123, 12.6, 'izq', 4)
d.guia('Deslizás la cinta: el precio es tuyo', 160, 75.5, 'abajo-der', 2.5)
d.guia('Sin comisión', 156, 95.7, 'abajo-der', 2.5)
d.guia('Zona aproximada: la dirección<br>llega cuando el cliente acepta', 126, 110, 'izq', 6)
d.guia('Sin consecuencias', 66, 144.2, 'izq', 4)
P.append(pagina(f'''    {cab('02 · Los pedidos')}
    <div class="caja">
      {titulo('Un pedido de punta a punta · 1 de 2', 'Del aviso a <span class="p-marca">tu precio</span>',
              'Antes de aceptar ves qué necesita el cliente, la zona aproximada y la franja que pidió. Su nombre, su teléfono y su dirección exacta, todavía no.', 156)}
      {d.html(7)}
      <div class="grilla tres-txt" style="margin-top:7mm">
        <div class="c-4"><span class="n">01</span><p class="p-h">Te llega el pedido</p><p class="p-texto">En el Inicio, sobre el mapa de tus zonas: rubro, zona aproximada y vigencia.</p></div>
        <div class="c-4"><span class="n">02</span><p class="p-h">Lo mirás sin compromiso</p><p class="p-texto">Zona aproximada, franja y lo que cuenta el cliente. «Ahora no» no tiene ninguna consecuencia.</p></div>
        <div class="c-4"><span class="n">03</span><p class="p-h">Ponés tu precio</p><p class="p-texto">Deslizás la cinta o escribís el monto. Handyx sugiere; vos decidís.</p></div>
      </div>
      {origen(ROT + ' F-Pedido y F-Precio, con recortes ampliados ' + est('en-pruebas', 'En pruebas · pedido, detalle y tu precio') + ' Cinta y teclado de precio ' + est('disenado') + ' Ilustración del rubro: ícono de línea en lugar del personaje.')}
    </div>'''))

# ================================================================ 10 · propuesta (vitrina de 3 + escena propuestas)
P.append(pagina(f'''    {cab('02 · Los pedidos')}
    <div class="caja">
      {titulo('Un pedido de punta a punta · 2 de 2', 'Tu propuesta, y la dirección <span class="p-marca">cuando te eligen</span>')}
      {vitrina([
        dict(img='f-fecha', n='04', h='Proponés cuándo', t='Vas en el horario que pidió o proponés otro. Es una propuesta: el cliente acepta o elige otra.', toques=[(28.5, 19.5, 4)]),
        dict(img='f-revisar', n='05', h='Revisás y enviás', t='Precio, fecha y lo que incluye, todo junto. Te avisamos cuando responde; el chat queda abierto.', toques=[(50, 86.1, 5)]),
        dict(img='f-trabajo', n='06', h='Te eligió', t='Recién ahí ves la dirección exacta, el acuerdo y «Salir para allá».', toques=[(56.1, 51.5, 6)]),
      ], 46, 14, mt=9)}
      <div class="grilla" style="margin-top:9mm;column-gap:7mm;align-items:center">
        <div class="c-4"><div data-escena="propuestas"></div></div>
        <div class="c-8">
          <p class="p-h">Qué puede pasar con tu propuesta</p>
          <div class="salidas s2" style="margin-top:3mm">
            <div><b>Acepta</b><span>El trabajo queda agendado con la dirección exacta.</span></div>
            <div><b>Pide otro precio</b><span>Contraoferta: aceptás, rechazás o ajustás, siempre con confirmación.</span></div>
            <div><b>Elige otro día</b><span>Lo agendado cambia solo cuando los dos están de acuerdo.</span></div>
            <div><b>Vence o elige a otro</b><span>Si dos aceptan a la vez, gana una sola. Retirás tu propuesta cuando quieras.</span></div>
          </div>
        </div>
      </div>
      {origen(ROT + ' F-Fecha, F-Revisar y F-Trabajo ' + est('en-pruebas', 'En pruebas · fecha, contraoferta, aceptación y vencimiento') + ' Horario a medida ' + est('disenado'))}
    </div>'''))

# ================================================================ 11 · cap 03 apertura
P.append(apertura(3, 'cap3', 'Un día de trabajo', 'rambla-fuego', 'center 12%', 122, 'p:ruta', (84, 60, 112),
    'Del primer paso al <span class="p-marca">informe</span>',
    'La app ordena tu día: la próxima parada, el viaje, una pantalla grande para trabajar con guantes, el antes y el después, el cobro directo y un informe que se arma solo, con la garantía adentro.',
    '<div class="grilla cifras-ap"><div class="c-4 p-raya"><div class="p-num">Ruta</div><p class="p-texto">tus paradas del día, en orden</p><span class="estado disenado">Diseñado</span></div><div class="c-4 p-raya"><div class="p-num">En camino</div><p class="p-texto">el cliente te ve llegar solo durante el viaje</p><span class="estado en-pruebas">En pruebas</span></div><div class="c-4 p-raya"><div class="p-num">Cobro</div><p class="p-texto">directo a vos: Handyx no toca la plata</p><span class="estado en-pruebas">En pruebas</span></div></div>',
    foto_w=216))

# ================================================================ 12 · DESPIECE Modo trabajo
d = Despiece(174, 150, 'var(--navy)', clara=True)
d.movil('h0-modo', 56, 14, 62)
d.flota('modo-cab', 44, 5, 86, r=0, alt='Modo trabajo: cronómetro')
d.flota('antes-despues', 136, 7, 32, r=26, alt='Antes y después')
d.flota('modo-tarea', 100, 57, 68, r=16, alt='La tarea en curso')
d.flota('modo-acc', 4, 82, 74, r=0, alt='Foto, repuestos, pedir ayuda y agenda')
d.flota('modo-herr', 96, 99, 72, r=20, alt='Herramientas del teléfono')
d.guia('Cronómetro<br>por tarea', 44.5, 22, 'der', 5)
d.guia('Antes y después,<br>deslizando', 140, 33, 'abajo', 4)
d.guia('Primero,<br>la seguridad', 128, 69.6, 'abajo', 4)
d.guia('Botones grandes,<br>para usar con guantes', 14, 97.3, 'abajo', 5)
d.guia('Nivel, linterna y lupa<br>sin salir del trabajo', 160, 112.7, 'abajo-der', 4)
P.append(pagina(f'''    {cab('03 · Un día de trabajo')}
    <div class="caja">
      {titulo('Un día · 1 de 2', 'Llegar y <span class="p-marca">trabajar cómodo</span>',
              'Cuando llegás, el teléfono se vuelve una herramienta: una pantalla grande con el cronómetro, las tareas en orden y todo lo que necesitás sin salir del trabajo.', 156)}
      {d.html(7)}
      <div class="grilla tres-txt" style="margin-top:7mm">
        <div class="c-4"><p class="p-h">Tu recorrido {et('disenado')}</p><p class="p-texto">Paradas en orden, kilómetros y la próxima salida. Avisás una demora con un toque.</p></div>
        <div class="c-4"><p class="p-h">Ubicación, solo en viaje {et('en-pruebas')}</p><p class="p-texto">El cliente ve que vas en camino. Nunca en segundo plano ni con «No disponible»; la llegada se marca sola o con «Ya llegué».</p></div>
        <div class="c-4"><p class="p-h">Adicionales con acuerdo {et('en-pruebas')}</p><p class="p-texto">Si aparece un repuesto, lo cargás con tu precio; el cliente lo acepta y mientras tanto rige el precio vigente.</p></div>
      </div>
      {origen(ROT + ' H0-Modo y H0-AntesDespues, con recortes ampliados ' + est('disenado', 'Ruta, Modo trabajo y antes/después · Diseñado') + est('en-pruebas', 'Viaje y llegada · En pruebas'))}
    </div>'''))

# ================================================================ 13 · cobro directo (escena pago + vitrina)
# escena «pago» (viewBox 400 × 240) a 112 mm de ancho dentro de un panel de 174 × 70
ex, ey, ew = 0, -7, 126
k = ew / 400
pago_html = (f'<div class="panel-esc grano-in" style="height:63mm"><div class="capa grano" style="background:var(--cielo)"></div>'
             f'<div data-escena="pago" data-fondo="no" style="position:absolute;left:{f(ex)}mm;top:{f(ey)}mm;width:{f(ew)}mm"></div>'
             f'<span class="guia" style="left:{f(ex + 218 * k - 0.9)}mm;top:{f(ey + 92 * k - 1.48)}mm;--largo:{f(124 - 218 * k)}mm"><span>Te paga directo a vos: efectivo,<br>Mercado Pago o transferencia</span></span>'
             f'<span class="guia" style="left:{f(ex + 236 * k - 0.9)}mm;top:{f(ey + 176 * k - 1.48)}mm;--largo:{f(124 - 236 * k)}mm"><span>Handyx no toca la plata:<br>sin saldo ni retenciones</span></span>'
             '</div>')
P.append(pagina(f'''    {cab('03 · Un día de trabajo')}
    <div class="caja">
      {titulo('Un día · 2 de 2', 'Cobrar directo y dejar <span class="p-marca">todo registrado</span>')}
      <div style="margin-top:7mm">{pago_html}</div>
      {vitrina([
        dict(img='tr-cobro', n='05', h='Informás el cobro', t='Efectivo, Mercado Pago o transferencia. Queda «informado por vos» hasta que se verifica.', toques=[(28.4, 37.2, 5)], e=et('en-pruebas')),
        dict(img='h0-informe', n='06', h='El informe se arma solo', t='Qué encontraste, antes y después, pruebas, materiales y garantía. El cliente da su conformidad y queda el PDF.', toques=[(50, 92.3, 6)], e=et('disenado')),
        dict(img='f-ingresos', n='07', h='Lo que te queda', t='Bruto, gastos y neto, con lo verificado separado de lo informado.', toques=[(18.5, 55.3, 7)], e=et('disenado')),
      ], 42, 16, fondo='var(--hueso)', mt=7)}
      {origen(ROT + ' TR-Cobro, H0-Informe y F-Ingresos ' + est('en-pruebas', 'Informar el cobro y caja · En pruebas') + ' Mercado Pago: sin credenciales todavía.')}
    </div>'''))

# ================================================================ 14 · cap 04 apertura (escena obra + etapas)
ETAPAS = '''<div class="etapas obra-et" style="margin-top:8mm">
        <div class="etapa"><span class="pto">1</span><p class="p-h">Proponés la obra</p><p class="p-texto">Para quién, oficios, etapas, jornadas y montos.</p><p class="e-l">{d}</p></div>
        <div class="etapa"><span class="pto">2</span><p class="p-h">El cliente acepta</p><p class="p-texto">Le llega como tarjeta en el chat.</p><p class="e-l">{d}</p></div>
        <div class="etapa"><span class="pto">3</span><p class="p-h">Armás el equipo</p><p class="p-texto">Invitás o publicás una búsqueda; acuerdan el reparto.</p><p class="e-l">{d}</p></div>
        <div class="etapa"><span class="pto">4</span><p class="p-h">Día por día</p><p class="p-texto">Jornadas, tareas y avance que ve el cliente.</p><p class="e-l">{p}</p></div>
        <div class="etapa"><span class="pto">5</span><p class="p-h">Repuestos y fechas</p><p class="p-texto">El cliente aprueba; Handyx avisa si falta comprar.</p><p class="e-l">{d}</p></div>
        <div class="etapa"><span class="pto">6</span><p class="p-h">Cobro por etapa</p><p class="p-texto">Cada etapa se cobra al terminarla, directo.</p><p class="e-l">{p}</p></div>
      </div>'''.format(d=et('disenado'), p=et('en-pruebas'))
P.append(apertura(4, 'cap4', 'Una obra de punta a punta', 'aerea-quintas', 'center 45%', 112, 'obra', (14, 52, 104),
    'Una obra de varios días, <span class="p-marca">en equipo</span>',
    'Un baño completo no se resuelve en una visita. La app lleva la obra entera: la propuesta por etapas, el equipo, cada jornada, los repuestos que aprueba el cliente, las fechas que se mueven solo con su acuerdo y el cobro de cada etapa.',
    ETAPAS + '<p class="p-texto" style="margin-top:5mm;max-width:160mm">Las etapas siguen el flujo «Una obra de varios días» y su recorrido con pantallas (doce pasos) del lienzo. Las páginas que siguen las muestran en orden.</p>',
    origen(ROT + ' Plan, jornadas, diario y cobro por etapa ' + est('en-pruebas') + ' Propuesta de obra, equipo, repuestos y reparto ' + est('disenado'))))

# ================================================================ 15 · proponer la obra (vitrina de 3)
P.append(pagina(f'''    {cab('04 · Una obra')}
    <div class="caja">
      {titulo('Obra · etapas 1 y 2', 'Proponer la obra, <span class="p-marca">por etapas</span>',
              'A un cliente tuyo o a uno nuevo, por un enlace. Armás las etapas con sus jornadas y montos, decidís si cobrás por etapa y si los materiales van aparte.', 156)}
      {vitrina([
        dict(img='f-obranueva', n='01', h='¿Para quién?', t='Un cliente con el que ya trabajaste o uno nuevo. Elegís los oficios que hacen falta.', toques=[(56.1, 37.4, 1)]),
        dict(img='f-propuestaobra', n='02', h='Etapas y montos', t='Demolición, cañerías, revestimiento: cada etapa con jornadas y monto. Cobro por etapa.', toques=[(30.9, 68.6, 2)]),
        dict(img='f-obras', n='03', h='Tus obras', t='Cuando el cliente acepta, la obra aparece con su avance, lo gastado y lo que falta.', toques=[(50, 41.4, 3)]),
      ], 48, 12, fondo='var(--arena)', mt=9)}
      <div class="grilla dos-txt" style="margin-top:8mm">
        <div class="c-6"><p class="p-h">La propuesta viaja como tarjeta</p><p class="p-texto">El cliente la acepta o pide cambios en el chat. Nada se manda solo.</p></div>
        <div class="c-6"><p class="p-h">Materiales a la vista</p><p class="p-texto">Si van aparte, se aprueban en el chat a medida que hacen falta: sin discusiones al final.</p></div>
      </div>
      {origen(ROT + ' F-ObraNueva, F-PropuestaObra y F-Obras ' + est('disenado'))}
    </div>'''))

# ================================================================ 16 · equipo (despiece chico)
d = Despiece(174, 118, 'var(--cielo)')
d.movil('f-obrabuscar', 12, 5, 52, toques=[(50, 92.3, 2)])
d.flota('verif-siempre', 38, 55, 60, r=0, alt='Verificado por Handyx: siempre', z=2)
d.flota('postulante', 106, 7, 60, r=22, alt='Un postulante')
d.flota('reparto-diego', 102, 70, 64, r=0, alt='Su parte del pago')
d.guia('Siempre verificado:<br>no se puede apagar', 70, 69.2, 'abajo', 4)
d.guia('Elegís vos:<br>nadie entra solo', 106.2, 32, 'der', 4)
d.guia('Cada uno cobra su parte', 120, 97.9, 'abajo', 4)
P.append(pagina(f'''    {cab('04 · Una obra')}
    <div class="caja">
      {titulo('Obra · etapa 3', 'Sumar a otro especialista <span class="p-marca">verificado</span>',
              'Si la obra pide otro oficio, invitás a un contacto o publicás una búsqueda. Solo la ven especialistas verificados de la zona, sin la dirección; elegís vos.', 156)}
      {d.html(7)}
      <div class="pasos4" style="margin-top:7mm">
        <div><span class="n">01</span><p class="p-h">El equipo</p><p class="p-texto">Quién está, su parte y la invitación pendiente. El cliente ve los días y el chat del grupo.</p></div>
        <div><span class="n">02</span><p class="p-h">Publicás la búsqueda</p><p class="p-texto">Oficio, jornadas y su parte del pago.</p></div>
        <div><span class="n">03</span><p class="p-h">Elegís</p><p class="p-texto">Ves perfil, verificaciones y trabajos de cada postulante.</p></div>
        <div><span class="n">04</span><p class="p-h">Acuerdan el reparto</p><p class="p-texto">Cuánto le toca a cada uno y cómo cobra. Handyx registra lo acordado.</p></div>
      </div>
      <div class="banda-dato" style="margin-top:7mm">
        <div><p class="p-h">Handyx no recibe ni reparte la plata</p><p class="p-texto">Registra lo que acuerdan entre ustedes: cada uno le cobra su parte al cliente, o la cobrás vos y la repartís por fuera. La invitación vale 48 horas y solo para esa obra.</p></div>
        <div class="chips"><span class="estado disenado">Equipo, búsqueda y reparto · Diseñado</span><span class="estado en-pruebas">Contactos · En pruebas</span></div>
      </div>
      {origen(ROT + ' F-ObraBuscar, con recortes de F-ObraPostulantes y F-Reparto')}
    </div>'''))

# ================================================================ 17 · DESPIECE la obra entera
d = Despiece(174, 152, 'var(--cielo)')
d.movil('f-obra', 55, 12, 64)
d.flota('obra-cab', 43, 6, 88, r=28, alt='Baño completo: etapas, días, gastado y lo que falta cobrar')
d.flota('obra-alerta', 48, 63, 86, r=16, alt='Aviso de repuestos')
d.flota('obra-j3', 52, 100, 76, r=0, alt='La jornada de hoy')
d.flota('obra-j4', 46, 120, 82, r=0, alt='Una jornada con algo para comprar')
d.guia('Día de obra, gastado<br>y lo que falta cobrar', 43.5, 50, 'der', 4)
d.guia('Te avisa el día anterior', 134.5, 68.8, 'izq', 4)
d.guia('Cada jornada: quién va<br>y su estado', 128.5, 108, 'izq', 4)
d.guia('Lo que falta comprar,<br>en rojo', 45.5, 131, 'der', 4)
P.append(pagina(f'''    {cab('04 · Una obra')}
    <div class="caja">
      {titulo('Obra · etapa 4', 'La obra entera, <span class="p-marca">en una pantalla</span>',
              'Qué día de la obra es, cuánto se gastó, cuánto falta cobrar y qué pasa mañana: todo en la pantalla de la obra, con cada jornada en línea de tiempo.', 156)}
      {d.html(7)}
      <div class="grilla dos-txt" style="margin-top:7mm">
        <div class="c-6"><p class="p-h">Lo que falta cobrar {et('en-pruebas')}</p><p class="p-texto">Cobro por etapa: lo cobrado y lo pendiente sobre el total acordado.</p></div>
        <div class="c-6"><p class="p-h">Un aviso antes de que falte algo {et('disenado')}</p><p class="p-texto">El día anterior te avisa si falta comprar un repuesto, y si el cliente todavía no lo aprobó.</p></div>
      </div>
      {origen(ROT + ' F-Obra, con recortes ampliados. Plan, jornadas, diario y cobro por etapa: código en una rama, con datos de prueba ' + est('en-pruebas') + ' Aviso de repuestos ' + est('disenado'))}
    </div>'''))

# ================================================================ 18 · jornadas (vitrina de 3)
P.append(pagina(f'''    {cab('04 · Una obra')}
    <div class="caja">
      {titulo('Obra · etapas 4, 5 y 6', 'Cada jornada, cada repuesto, <span class="p-marca">cada fecha</span>')}
      {vitrina([
        dict(img='f-obradia', n='01', h='Una jornada', t='Quién viene, las tareas y el avance del día. Cargás fotos y una nota: van al chat de la obra, achicadas y sin la ubicación.', toques=[(80.6, 75.6, 1)]),
        dict(img='f-obrarepuestos', n='02', h='Repuestos a aprobar', t='Los cargás por jornada; el cliente los aprueba en el chat. Los conseguís vos o en una ferretería adherida.', toques=[(36.6, 41.1, 2)]),
        dict(img='f-obrafecha', n='03', h='Mover jornadas', t='Esta sola o esta y las que siguen. Hasta que el cliente acepta, siguen las fechas de ahora.', toques=[(50, 45.5, 3)]),
      ], 46, 14, mt=9)}
      <div class="grilla tres-txt" style="margin-top:8mm">
        <div class="c-4"><p class="p-h">El cliente aprueba {et('disenado')}</p><p class="p-texto">Repuestos, cambios de fecha y propuestas viajan como tarjetas que responde en el chat de la obra.</p></div>
        <div class="c-4"><p class="p-h">Pedir otro día {et('en-pruebas')}</p><p class="p-texto">Es una solicitud: no mueve las demás jornadas hasta que el cliente acepta. Se avisa al equipo.</p></div>
        <div class="c-4"><p class="p-h">Cierre de cada etapa {et('en-pruebas')}</p><p class="p-texto">Al terminar una etapa se cobra, directo a vos; el informe final deja la garantía registrada.</p></div>
      </div>
      {origen(ROT + ' F-ObraDia, F-ObraRepuestos y F-ObraFecha · Jornadas y diario ' + est('en-pruebas') + ' Tareas, repuestos y correr fechas ' + est('disenado'))}
    </div>'''))

# ================================================================ 19 · cap 05 apertura (escena taller + 9 herramientas)
H = [('Presupuestador', 'Mano de obra y materiales de tu lista; si un precio cambia antes de que acepte, sale una versión nueva.', et('disenado')),
     ('Lista de precios', 'Tus materiales y tarifas; la foto de la lista del corralón se lee en el teléfono y no sale de ahí.', et('disenado')),
     ('Tarifas de mano de obra', 'Hora, visita, urgencia y precio por tarea. Son tus precios: Handyx solo sugiere.', et('disenado')),
     ('Ingresos y gastos', 'Bruto, gastos con la foto del ticket y neto por trabajo.', et('disenado')),
     ('Tu equipamiento', 'Herramientas, dónde está cada una, mantenimiento, préstamos y reposición.', et('disenado')),
     ('Ferretería', 'Pedido único y retiro con QR. Hoy es una simulación con ferreterías ficticias.', et('disenado')),
     ('Herramientas del teléfono', 'Medir, escanear en 3D, plomada; el nivel ya tiene código.', et('disenado') + ' ' + et('en-pruebas', 'Nivel · En pruebas')),
     ('Electricidad (H1)', 'Cables, tablero 3D en la pared e informe con semáforo, en revisión técnica.', et('en-pruebas')),
     ('Otros oficios (H2 a H6)', 'Aire, plomería, gas, albañilería y cerrajería: después del lanzamiento.', et('concepto'))]
herr = '<div class="grilla herr" style="margin-top:7mm">' + ''.join(f'<div class="c-4 herr-i"><p class="p-h">{a}</p><p class="p-texto">{b}</p><p class="e-l">{c}</p></div>' for a, b, c in H) + '</div>'
P.append(apertura(5, 'cap5', 'Tus herramientas', 'aerea-puerto-sur', 'center 60%', 100, 'p:taller', (84, 44, 112),
    'Tu taller, <span class="p-marca">en el bolsillo</span>',
    'Handyx no quiere ser solo un canal de clientes: quiere ser tu herramienta de trabajo. Esto es lo que hay en la pestaña Taller y en qué estado está cada cosa.',
    herr, origen('Estados según la auditoría del 07/11/2026. <span class="rotulo concepto">Concepto</span> H2 a H6: un tablero por oficio, sin fecha.'), foto_w=150))

# ================================================================ 20 · DESPIECE presupuestador
d = Despiece(174, 148, 'var(--hueso)')
d.movil('h0-presupuesto', 57, 12, 60)
d.flota('tarifas', 6, 8, 74, r=18, alt='Tus tarifas: hora, visita y urgencia')
d.flota('mo-lineas', 4, 34, 72, r=0, alt='Mano de obra por tarea')
d.flota('mat-actualiza', 100, 46, 68, r=0, alt='Un material que se actualiza')
d.flota('foto-lista', 96, 92, 72, r=18, alt='Foto de la lista del corralón')
d.flota('presu-total', 6, 116, 76, r=24, alt='Total para el cliente')
d.guia('Tus tarifas: Handyx solo sugiere', 106, 30.3, 'izq', 11.5)
d.guia('Si sube antes de que acepte,<br>sale una versión nueva', 160, 65.7, 'abajo-der', 3)
d.guia('La foto se lee en tu teléfono<br>y no sale de ahí', 160, 107.9, 'abajo-der', 3)
d.guia('Lo mandás como tarjeta por el chat', 112, 126.5, 'izq', 4)
P.append(pagina(f'''    {cab('05 · Tus herramientas')}
    <div class="caja">
      {titulo('Presupuestos y lista de precios', 'Presupuestar rápido <span class="p-marca">sin perder plata</span>',
              'Mano de obra con tus tarifas y materiales de tu lista, sumados en un presupuesto que el cliente recibe en el chat.', 156)}
      {d.html(7)}
      <div class="grilla tres-txt" style="margin-top:7mm">
        <div class="c-4"><p class="p-h">Precio fijo o que se actualiza</p><p class="p-texto">Si un material sube antes de que el cliente acepte, te avisa y sale una versión nueva.</p></div>
        <div class="c-4"><p class="p-h">Tu precio es tuyo</p><p class="p-texto">Si cargás un material nuevo, su nombre suma al catálogo; tu precio queda solo para vos.</p></div>
        <div class="c-4"><p class="p-h">Hoy, en código {et('en-pruebas')}</p><p class="p-texto">Tu precio con la sugerencia de Handyx y un presupuesto simple dentro del chat.</p></div>
      </div>
      {origen(ROT + ' H0-Presupuesto, con recortes de H0-ManoObra y H0-Precios ' + est('disenado') + ' Corralón y montos: ficticios. Catálogo con precios de ferreterías de Mar del Plata ' + est('concepto'))}
    </div>'''))

# ================================================================ 21 · herramientas en tarjetas (recortes, sin teléfonos)
def herr_card(k, fondo, w, h, t, e, alto=58, r=22, pad=0):
    cw, ch = R[k][1][2], R[k][1][3]
    hh = w * ch / cw
    return (f'<div class="c-6 h-card"><div class="h-vis grano-in" style="height:{f(alto)}mm"><div class="capa grano" style="background:{fondo}"></div>'
            f'<div class="flota" style="left:50%;top:50%;width:{f(w)}mm;margin:{f(-hh / 2)}mm 0 0 {f(-w / 2)}mm;border-radius:{f(r * w / cw + 0.15)}mm"><img src="img/x-{k}.webp" alt=""></div></div>'
            f'<p class="p-h">{h} {e}</p><p class="p-texto">{t}</p></div>')
P.append(pagina(f'''    {cab('05 · Tus herramientas')}
    <div class="caja">
      {titulo('Equipamiento, ferretería y Taller', 'Lo que llevás, lo que comprás y <span class="p-marca">lo que medís</span>')}
      <div class="grilla h-cards" style="margin-top:8mm">
        {herr_card('equipo-tiles', 'var(--cielo)', 50, 'Tu equipamiento', 'Por categoría y por lugar: camioneta, taller o prestada. Avisa lo que vence o queda poco.', et('disenado'))}
        {herr_card('retiro-qr', 'var(--azul)', 36, 'Retiro con QR', 'Pedido único a una ferretería adherida. La venta la cobra la ferretería; hoy es una simulación.', et('disenado', 'Diseñado · simulación'), r=32)}
        {herr_card('taller-grid', 'var(--hueso)', 58, 'Herramientas del teléfono', 'Medir con la cámara, escanear en 3D, nivel y plomada, para todos los oficios.', et('disenado') + ' ' + et('en-pruebas', 'Nivel · En pruebas'), r=0)}
        {herr_card('tablero-3d', 'var(--navy)', 52, 'Tablero 3D (Electricidad)', 'Armás el tablero, sale el cómputo y lo mostrás en la pared del cliente.', et('en-pruebas'), r=28)}
      </div>
      <div class="aviso-seg" style="margin-top:7mm">
        <p class="p-h">Avisos que no se sacan</p>
        <div class="grilla" style="column-gap:6mm;margin-top:2.5mm">
          <p class="c-4 p-texto">El teléfono no detecta tensión, gas ni monóxido: las mediciones son tuyas, con tus instrumentos.</p>
          <p class="c-4 p-texto">Las tablas de Electricidad están en revisión técnica: son orientativas y no reemplazan la norma ni tu criterio.</p>
          <p class="c-4 p-texto">No hay ferreterías aliadas firmadas: las del diseño son ficticias y las condiciones, a definir.</p>
        </div>
      </div>
      {origen(ROT + ' Recortes ampliados de H0-Equipo, R-Retiro, T-Taller y T-Tablero. Tablero 3D: código en una rama, sin probar en teléfonos reales.')}
    </div>'''))

# ================================================================ 22 · cap 06 apertura (escena camino + escalera)
ESC = re.search(r'<div class="escalera".*?</div>\s*</div>', secs[21], re.S).group(0)
P.append(apertura(6, 'cap6', 'Cómo se sube de categoría', 'aerea-faro-mogotes', 'center 55%', 104, 'camino', (14, 46, 104),
    'Crecer en Handyx: el <span class="p-marca">Camino</span>',
    'Avanzás por estaciones con trabajos y cobros verificados. Los premios se ven de antemano, nada se resta y no hay rankings, sorteos ni puntos por aceptar pedidos. Las cantidades y los premios son un borrador que Handyx define con Legal.',
    ESC.replace('style="margin-top:8mm"', 'style="margin-top:7mm"') + '<p class="p-texto" style="margin-top:3mm"><span class="tipo-dato">Borrador del lienzo</span> Estaciones del Camino de los trabajos (G-Camino). La pantalla del regalo dice 15 trabajos para la herramienta; G-Camino, 25: a definir.</p>',
    origen('<span class="estado disenado">Camino Handyx · Diseñado</span> Premios del oficio Electricidad en borrador en código <span class="estado concepto">Áreas del camino · Concepto</span>')))

# ================================================================ 23 · DESPIECE el camino
d = Despiece(174, 152, 'var(--azul)', clara=True)
d.movil('g-inicio', 14, 12, 60)
d.flota('camino-cab', 6, 5, 84, r=0, alt='Te faltan 2 para la Gorra Handyx', z=2)
d.flota('camino-ruta', 128, 8, 40, r=0, alt='El camino de los trabajos')
d.flota('camino-trab', 54, 66, 70, r=22, alt='Mini camino: trabajos verificados')
d.flota('camino-cobros', 58, 88, 66, r=22, alt='Mini camino: cobros verificados')
d.flota('camino-kit', 4, 128, 64, r=20, alt='Kit de bienvenida')
d.guia('Estaciones visibles<br>de antemano', 136, 85.4, 'abajo', 3)
d.guia('Cada mini camino,<br>con su próxima recompensa', 124.5, 104, 'izq', 4)
d.guia('Solo cuentan trabajos y cobros<br>verificados. Nada se resta', 92, 109.6, 'abajo', 3)
d.guia('Estación 0: remera y manual', 68.5, 134.4, 'izq', 5)
P.append(pagina(f'''    {cab('06 · Cómo se sube de categoría')}
    <div class="caja">
      {titulo('El Camino · de la bienvenida a la primera estación', 'Solo cuenta lo <span class="p-marca">verificado</span>',
              'Tu Camino en una pantalla: cuánto te falta para la próxima estación y tres mini caminos —trabajos, cobros y tu oficio—, cada uno con su próxima recompensa.', 156)}
      {d.html(7)}
      <div class="grilla reglas4" style="margin-top:7mm">
        <div class="c-3"><p class="p-h">Solo lo verificado</p><p class="p-texto">Trabajos y cobros verificados. Lo informado sin verificar todavía no cuenta.</p></div>
        <div class="c-3"><p class="p-h">Nada se resta</p><p class="p-texto">Rechazar un pedido o tomarte una semana no te baja de estación.</p></div>
        <div class="c-3"><p class="p-h">Sin rankings ni azar</p><p class="p-texto">No competís con otros especialistas y no hay sorteos.</p></div>
        <div class="c-3"><p class="p-h">Los pedidos no cambian</p><p class="p-texto">Insignias y estaciones no cambian qué pedidos te llegan.</p></div>
      </div>
      {origen(ROT + ' G-Inicio, con recortes de G-Camino ' + est('disenado') + ' «Retiro en un punto Handyx»: punto sin confirmar.')}
    </div>'''))

# ================================================================ 24 · premios (vitrina de 3, sin flechas)
P.append(pagina(f'''    {cab('06 · Cómo se sube de categoría')}
    <div class="caja">
      {titulo('Mini caminos, insignias y premios', 'Premios que se ven <span class="p-marca">antes de ganarlos</span>')}
      {vitrina([
        dict(img='g-minicamino', n='01', h='Cobros verificados', t='Un mini camino por lo cobrado y verificado. Montos y premios en borrador, con Legal.', toques=[(62.2, 47.7, 1)], e=et('disenado')),
        dict(img='g-insignias', n='02', h='Insignias', t='Reconocen cómo usás la app, como leer el manual. No dan premios ni cambian los pedidos.', toques=[(21.4, 34.3, 2)], e=et('disenado')),
        dict(img='g-canje', n='03', h='Canje', t='Elegís color y cómo lo recibís. Cada premio se revisa antes de entregarlo.', toques=[(50, 92.3, 3)], e=et('disenado')),
      ], 46, 14, fondo='var(--arena)', flechas=False, mt=9)}
      <p class="p-texto" style="margin-top:7mm;max-width:160mm"><b class="fuerte">Áreas del camino</b> {et('concepto')} — el taller, la obra, la ciudad: una idea para más adelante.</p>
      <div class="banda-dato" style="margin-top:6mm">
        <div><p class="p-h">Lo que todavía no está definido</p><p class="p-texto">Las cantidades de cada estación, los montos de los mini caminos, los premios, quién los paga y cómo se entregan (incluido el punto de retiro) están en borrador: los define Handyx con Legal antes de prometer nada.</p></div>
        <div class="chips"><span class="estado disenado">Camino y canje · Diseñado</span><span class="estado concepto">Áreas · Concepto</span></div>
      </div>
      {origen(ROT + ' G-MiniCamino, G-Insignias y G-Canje. Montos y premios del lienzo: borrador.')}
    </div>'''))

# ================================================================ 25 · cap 07 apertura (escena valor + 8 mecanismos)
M = [('Recibís el 100 %', 'Handyx no le cobra comisión al especialista. No hay porcentaje que ahorrarse por fuera.', '<span class="tipo-dato">Decisión del fundador · 07/11/2026</span>'),
     ('Pedidos sin buscarlos', 'Clientes de tu zona y tus rubros que ya contaron qué necesitan.', et('en-pruebas')),
     ('Chat sin dar tu teléfono', 'Hablás con el cliente sin mostrar números; las llamadas por número puente esperan un proveedor.', et('en-pruebas')),
     ('Historial que es tuyo', 'Trabajos, informes en PDF, antes y después: tu portfolio de trabajos verificados.', et('disenado')),
     ('Reseñas', 'La reseña opcional del cliente corre solo en una vista de prueba; el perfil con opiniones está en el diseño.', et('en-pruebas', 'En pruebas · vista de prueba') + ' ' + et('disenado', 'Perfil · Diseñado')),
     ('Garantía registrada', 'La conformidad del cliente y la garantía quedan en el informe: si hay un problema, hay registro.', et('disenado')),
     ('Reclamos con seguimiento', 'El equipo los ordena por gravedad y plazo. Hoy entran por teléfono o mail; desde la app, todavía no.', et('construido', 'Portal · Construido')),
     ('El Camino', 'Solo cuentan los trabajos y cobros verificados adentro de Handyx.', et('disenado'))]
mec = '<div class="grilla mec" style="margin-top:6mm">' + ''.join(f'<div class="c-6 mec-i"><span class="mi">{i + 1:02d}</span><div><p class="p-h">{a}</p><p class="p-texto">{b}</p><div class="ch">{c}</div></div></div>' for i, (a, b, c) in enumerate(M)) + '</div>'
P.append(apertura(7, 'cap7', 'Por qué conviene quedarse adentro', 'casino-plaza', 'center 40%', 96, 'p:valor', (98, 54, 100),
    'Recibís el 100 %. Y lo que construís, <span class="p-marca">queda</span>',
    'Nada te impide arreglar por fuera con un cliente, y no lo vamos a disimular. Lo que hacemos es que adentro valga más: sin comisión, con historial, garantía, reseñas y un camino que solo suma con trabajos verificados.',
    mec, origen('Lo medimos como repetición dentro de Handyx: el mismo cliente que vuelve a pedir por la app.'), foto_w=216))

# ================================================================ 26–27 preguntas (ola 6, estados en texto chico)
def dudas(s):
    def hoy(m):
        h = m.group(0)
        h = re.sub(r'<span class="estado (\w[\w-]*)">([^<]*)</span>', lambda x: et(x.group(1), x.group(2)), h)
        return h
    return re.sub(r'<p class="hoy">.*?</p>', hoy, s, flags=re.S)
P.append(dudas(secs[25]))
P.append(dudas(secs[26]).replace('<p class="p-origen" style="margin-top:6mm">Fotos: Mar del Plata, del fundador.</p>', '<p class="p-origen" style="margin-top:6mm">Ilustraciones de Mar del Plata a partir de fotos del fundador.</p>'))

# ================================================================ 28 contratapa
P.append(secs[27].replace('<div class="velo"></div>', '<div class="velo"></div><div class="capa grano"></div>', 1))

assert len(P) == 28, len(P)

# ---------------------------------------------------------------- estilo propio (ola 7)
ICON = {
 'construido': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='11' fill='black'/%3E%3Cpath d='M7 12.5l3.2 3.2L17 9' fill='none' stroke='white' stroke-width='2.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
 'en-pruebas': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='9.6' fill='none' stroke='black' stroke-width='2.8'/%3E%3Cpath d='M12 2.4a9.6 9.6 0 0 1 0 19.2z' fill='black'/%3E%3C/svg%3E\")",
 'disenado': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M4 20l1-4.6L15.6 4.8a2 2 0 0 1 2.8 0l.8.8a2 2 0 0 1 0 2.8L8.6 19 4 20z' fill='black'/%3E%3C/svg%3E\")",
 'concepto': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='9.5' fill='none' stroke='black' stroke-width='2.6' stroke-dasharray='3.2 3'/%3E%3C/svg%3E\")",
}
ESTILO7 = '''
/* ===================== ola 7 · dirección de arte (componentes propios del 03) ===================== */
.capa { position: absolute; inset: 0; }
/* estado en texto chico (con el mismo ícono que el chip): para no repetir bloques de chips */
.et { display: inline-flex; align-items: center; gap: 0.9mm; font: 800 5.9pt/1 var(--f-texto); letter-spacing: 0.1em; text-transform: uppercase; white-space: nowrap; vertical-align: 0.12em; margin-left: 0.6mm; }
.et::before { content: ''; width: 2.3mm; height: 2.3mm; background: currentColor; -webkit-mask: var(--icono) center / contain no-repeat; mask: var(--icono) center / contain no-repeat; }
.et.construido { color: #0D5A31; --icono: @@construido@@; }
.et.en-pruebas { color: var(--azul-profundo); --icono: @@en-pruebas@@; }
.et.disenado { color: #6E5B00; --icono: @@disenado@@; }
.et.concepto { color: var(--gris); --icono: @@concepto@@; }
.banda-dato .et.en-pruebas { color: #A9C3EE; } .banda-dato .et.disenado { color: var(--amarillo); }
.e-l { margin-top: 2mm; display: flex; flex-wrap: wrap; gap: 1.2mm 2.6mm; }
.e-l .et { margin-left: 0; }
/* despiece: panel con grano, teléfono grande y recortes flotando */
.despiece .capa.grano { border-radius: inherit; }
.despiece .movil { z-index: 1; }
.despiece .flota { z-index: 3; }
.despiece .guia { z-index: 5; }
.guia > span { white-space: nowrap; }
.guia.clara > span { text-shadow: 0 0 2mm rgba(14, 29, 54, 0.25); }
.guia.v, .guia.vd { flex-direction: column; gap: 1.2mm; }
.guia.v { align-items: flex-start; } .guia.vd { align-items: flex-end; }
.guia.v::before, .guia.vd::before { width: 0; height: var(--largo, 4mm); border-top: 0; border-left: 0.3mm solid var(--navy); }
.guia.v::before { margin-left: 0.75mm; } .guia.vd::before { margin-right: 0.75mm; }
.guia.v.clara::before, .guia.vd.clara::before { border-left-color: #FFFFFF; }
.guia.vd > span { text-align: right; }
.marca-r { position: absolute; z-index: 2; border: 0.35mm dashed var(--navy); }
.marca-r.clara { border-color: var(--amarillo); }
/* vitrina: recorrido en una fila con los teléfonos saliendo de un panel de color */
.vit { position: relative; display: grid; grid-template-columns: repeat(var(--n), var(--w)); column-gap: var(--g); justify-content: center; padding-top: 9mm; }
.vit > .fondo-v { position: absolute; left: 0; right: 0; top: 0; height: calc(9mm + var(--w) * 2.0657 * 0.7); border-radius: 6mm; }
.vit .vpaso { position: relative; z-index: 1; }
.vit.flechas .vpaso + .vpaso::before { content: ''; position: absolute; top: calc(var(--w) * 1.033 - 2.2mm); left: calc(var(--g) / -2 - 2.6mm); width: 5.2mm; height: 4.4mm; z-index: 4;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 26 22'%3E%3Cpath d='M1 11h20M14 3l8 8-8 8' fill='none' stroke='%231F57A8' stroke-width='2.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center / contain no-repeat; }
.vit .pie-paso { margin-top: 6mm; }
/* tarjeta blanca con una escena (aperturas) */
.esc-card { position: absolute; z-index: 3; padding: 4mm 5mm 3mm; border-radius: 6mm; background: #FFFFFF;
  box-shadow: 0 0.6mm 1.4mm rgba(14, 29, 54, 0.12), 0 8mm 22mm rgba(14, 29, 54, 0.28); }
/* panel de color con una escena adentro */
.panel-esc { position: relative; border-radius: 6mm; overflow: hidden; }
.panel-esc .capa.grano, .h-vis .capa.grano { border-radius: inherit; }
/* textos de apoyo bajo un despiece */
.tres-txt, .dos-txt { column-gap: 7mm; }
.tres-txt > div, .dos-txt > div { padding-top: 3mm; border-top: 0.45mm solid var(--azul); }
.tres-txt .n, .pasos4 .n { font-family: var(--f-titulos); font-weight: 900; font-stretch: 125%; font-size: 12pt; line-height: 1; color: var(--azul); }
.tres-txt .n + .p-h, .pasos4 .n + .p-h { margin-top: 1.6mm; }
.tres-txt .p-texto, .dos-txt .p-texto { margin-top: 1mm; }
.pasos4 { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); column-gap: 6mm; margin-top: 7mm; }
.pasos4 > div { padding-top: 3mm; border-top: 0.25mm solid var(--borde-frio); }
.pasos4 .p-h { font-size: 9.2pt; } .pasos4 .p-texto { margin-top: 0.8mm; font-size: 7.6pt; }
.destacado { padding: 4.4mm 5mm; border-radius: 3mm; background: var(--cielo); }
.salidas.s2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.heroe-panel { position: relative; }
.rubros6.altos .rb { aspect-ratio: 1 / 0.97; }
.rubros6.altos .rb b { font-size: 7.8pt; }
/* herramientas en tarjeta: un recorte grande sobre un fondo de color */
.h-cards { column-gap: 6mm; row-gap: 7mm; }
.h-card .h-vis { position: relative; border-radius: 5mm; overflow: hidden; }
.h-card .p-h { margin-top: 3.4mm; font-size: 9.6pt; }
.h-card .p-texto { margin-top: 1mm; }
'''
for _k, _v in ICON.items():
    ESTILO7 = ESTILO7.replace('@@' + _k + '@@', _v)

head = old.split('<body>')[0]
head = head.replace(estilo_old, estilo_old + ESTILO7)
html = head + '<body>\n' + '\n'.join(P) + '\n<script>\n' + ESC_JS + '\n</script>\n<script src="../../plantilla/escenas.js"></script>\n<script src="../../plantilla/iso.js"></script>\n<script src="../../plantilla/pieza.js"></script>\n</body>\n</html>\n'
open(PZ + '/index.html', 'w', encoding='utf8').write(html)
print('ok', len(html))
