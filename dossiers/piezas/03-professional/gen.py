# Generador del Dossier 03 · Professional App (ola 6). Escribe dossiers/piezas/03-professional/index.html.
import sys
OUT = '/home/user/presentations-studio/dossiers/piezas/03-professional/index.html'
PIEZA = 'Handyx · Professional App'

E = {'c': ('construido', 'Construido'), 'p': ('en-pruebas', 'En pruebas'), 'd': ('disenado', 'Diseñado'), 'k': ('concepto', 'Concepto')}
def est(k, txt=None):
    c, t = E[k]
    return f'<span class="estado {c}">{txt or t}</span>'

ROT_D = '<span class="rotulo diseno">Diseño propuesto · datos ficticios</span>'

def movil(img, w, toques=(), alt=''):
    t = ''.join(f'<span class="toque" style="left:{x};top:{y}">{n}</span>' for n, x, y in toques)
    return f'<div class="movil" style="--w:{w}mm"><div class="pant"><img src="img/{img}.webp" alt="{alt}"></div>{t}</div>'

def rec(pasos, w=40, flechas=True, inicio=1):
    """pasos: (img, toques[(x,y)], titulo, texto, estado-html, gesto)"""
    n = len(pasos)
    cols = []
    for i, p in enumerate(pasos):
        img, tq, tit, txt = p[:4]
        extra = p[4] if len(p) > 4 else ''
        num = inicio + i
        tqs = [(num, x, y) for (x, y) in tq]
        cols.append(f'<div class="rp">{movil(img, w, tqs, tit)}<div class="pie-paso"><div class="n">{num:02d}</div><p class="p-h">{tit}</p><p class="p-texto">{txt}</p>{extra}</div></div>')
    cls = 'rec' + ('' if flechas else ' sin-flechas')
    return f'<div class="{cls}" style="--n:{n};--w:{w}mm">' + ''.join(cols) + '</div>'

def origen(*cosas):
    return '<p class="p-origen empuja">' + ' '.join(cosas) + '</p>'

paginas = []
def pagina(cab, cuerpo, clase='', estilo='', antes='', cab_clara=False, id_=''):
    cabst = ' style="color:rgba(255,255,255,0.72)"' if cab_clara else ''
    idat = f' id="{id_}"' if id_ else ''
    paginas.append(f'''<section class="pagina {clase}"{idat}{(' style="' + estilo + '"') if estilo else ''}>
  <div class="lamina">
    {antes}
    <div class="cab-p"{cabst}><span>{cab}</span><span>{PIEZA}</span></div>
    <div class="caja">
{cuerpo}
    </div>
    <div class="pie-p"><span>{PIEZA}</span><b class="folio-n">00</b></div>
  </div>
</section>''')

def foto_banda(foto, alto, ancho=216, pos='center top', op=0.92):
    return f'<img class="foto-banda" src="../../marca/fotos/{foto}" alt="" style="width:{ancho}mm;height:{alto}mm;object-position:{pos};opacity:{op}">'

def personaje(nombre, estilo):
    return ''  # sin personajes (pedido de Ignacio, 08/11)
    return f'<img class="personaje-v2" src="../../marca/personajes-v2/{nombre}.svg" alt="{nombre.capitalize()}, uno de los Handys" style="{estilo}" onerror="this.remove()">'

import json as _j
_CAP = _j.load(open('/tmp/claude-0/-home-user/10ab011c-6752-54be-831e-b3c4da2461d0/scratchpad/ola6/p03tools/capn.json'))['g']
def capn(n):
    d, w, a = _CAP[n]
    k = 32.46 / 1000
    return f'<svg class="cap-n-svg" role="img" aria-label="{n}" viewBox="-10 120 {w + 20} {a - 110}" style="width:{(w + 20) * k:.2f}mm;height:{(a - 110) * k:.2f}mm"><path d="{d}" fill="none" stroke="#F5F59A" stroke-width="14"/></svg>'

def apertura(n, ceja, titulo, lead, cifras, foto, iso, alto=150, extra='', id_='', personaje_html='', foto_ancho=216, foto_pos='center top'):
    banda = f'''<div class="banda azul" style="height:calc({alto}mm + var(--sangrado))">{foto_banda(foto, alto, foto_ancho, foto_pos)}<div class="velo"></div>{iso}</div>{personaje_html}'''
    cif = ''
    if cifras:
        cif = '<div class="grilla cifras-ap">' + ''.join(f'<div class="c-{12 // len(cifras)} p-raya"><div class="p-num">{a}</div><p class="p-texto">{b}</p>{c}</div>' for a, b, c in cifras) + '</div>'
    cuerpo = f'''      <div class="p-azul" style="background:none">{capn(n)}<span class="p-ceja" style="margin-top:6mm">{ceja}</span></div>
      <div class="bajo-banda" style="margin-top:calc({alto}mm - 52mm)">
        <h1 class="p-titulo">{titulo}</h1>
        <p class="p-lead" style="margin-top:4.5mm;max-width:156mm">{lead}</p>
        {cif}
      </div>
      {extra}'''
    pagina(f'Capítulo {n}', cuerpo, antes=banda, cab_clara=True, id_=id_)

# ============================================================ 1 · TAPA
paginas.append('''<section class="pagina tapa-g">
  <div class="lamina">
    <div class="a-sangre-arriba" style="height:calc(150mm + var(--sangrado));background:var(--azul);overflow:hidden">
      <img class="foto-banda" src="../../marca/fotos/casino-plaza-azul.webp" alt="" style="width:216mm;height:153mm;object-position:center 30%;opacity:0.92">
      <div class="velo"></div>
      <div data-iso="maqueta" data-paleta="dia" data-pines="1" data-rotulos="1" data-tam="12" style="position:absolute;left:-6mm;width:150mm;bottom:-14mm"></div>
    </div>
    <div class="a-sangre-abajo" style="height:calc(64mm + var(--sangrado));background:var(--hueso)"></div>
    <img class="abs permite-salir" src="img/m-dia-plata.webp" alt="" style="right:52mm;top:96mm;width:62mm">
    <img class="abs permite-salir" src="img/m-pedido-plata.webp" alt="" style="right:-6mm;top:70mm;width:92mm">
    <div class="caja" style="top:15mm;left:16mm;right:16mm;bottom:14mm">
      <div class="fila entre" style="align-items:flex-start"><img src="../../marca/logo-handyx-blanco.svg" alt="Handyx" style="height:8.5mm"><div class="serie" style="color:#FFFFFF"><b>Colección Handyx · Hecho en Mar del Plata</b>Edición 1 · Noviembre de 2026</div></div>
      <div style="margin-top:140mm;max-width:100mm">
        <span class="p-ceja">Dossier 03 · Professional App</span>
        <h1 class="p-display" style="margin-top:5mm;font-size:30pt">Tu trabajo, tus <span class="p-marca">precios</span>.</h1>
        <p class="p-lead" style="margin-top:5mm;font-size:10.4pt">El manual del especialista: cómo te validamos, cómo te llegan los pedidos, cómo llevás una obra entera y cómo crecés adentro de Handyx.</p>
      </div>
      <div class="empuja p-meta" style="color:var(--navy);max-width:96mm;grid-template-columns:1fr 1fr">
        <div><b>Ciudad</b>Mar del Plata</div><div><b>Producto</b>En pruebas · demo cerrada con invitación</div><div style="margin-top:2mm"><b>Corte</b>Estado al 07/11/2026</div><div style="margin-top:2mm"><b>Imágenes</b>Pantallas: diseño propuesto, datos ficticios · Foto: Mar del Plata</div>
      </div>
    </div>
  </div>
</section>''')

# ============================================================ 2 · ÍNDICE + CÓMO LEER
cap = [('01', 'Cómo validamos', 'El alta en diez pasos, los documentos y quién te habilita', 'cap1'),
       ('02', 'Los pedidos, sin obligación', 'Disponibilidad, un pedido de punta a punta y tu propuesta', 'cap2'),
       ('03', 'Un día de trabajo', 'Ruta, en camino, Modo trabajo, cobro directo e informe', 'cap3'),
       ('04', 'Una obra de punta a punta', 'Propuesta, equipo, días, repuestos, reparto y cobro por etapa', 'cap4'),
       ('05', 'Tus herramientas', 'Presupuestos, lista de precios, equipamiento, ferretería y Taller', 'cap5'),
       ('06', 'Cómo se sube de categoría', 'Camino Handyx: estaciones, mini caminos, insignias y premios', 'cap6'),
       ('07', 'Por qué conviene quedarse adentro', 'Sin comisión, historial, reseñas, garantía y camino', 'cap7'),
       ('08', 'Preguntas difíciles', 'Ocho respuestas sin vueltas, con lo que hay hoy', 'cap8')]
idx = ''.join(f'<a class="ix" data-ir="{i}"><span class="n">{n}</span><span class="t"><b>{t}</b><small>{s}</small></span><span class="p">00</span></a>' for n, t, s, i in cap)
pagina('Contenido', f'''      <span class="p-ceja">Contenido</span>
      <h1 class="p-titulo" style="margin-top:5mm">El manual del <span class="p-marca">especialista</span></h1>
      <p class="p-lead" style="margin-top:4.5mm;max-width:150mm">Todo lo que hace la app de Handyx para quien trabaja, contado con sus pantallas, en el orden en que lo vas a usar. Lo que existe, lo que está en pruebas y lo que todavía es diseño, dicho con su nombre.</p>
      <div class="grilla" style="margin-top:9mm;column-gap:9mm">
        <nav class="c-7 indice-v2">{idx}</nav>
        <div class="c-5 leer">
          <p class="p-h">Cómo leer este manual</p>
          <p class="p-texto" style="margin-top:1mm">Cada función dice en qué estado está al 07/11/2026; cada pantalla, de dónde sale.</p>
          <div class="def">
            {est('c')}<span>En la rama principal, probado contra el servidor real (en local, si todavía no está desplegado).</span>
            {est('p')}<span>Hay código, pero corre con datos de prueba o en una rama.</span>
            {est('d')}<span>Dibujado en el lienzo de diseño, todavía sin código.</span>
            {est('k')}<span>Idea a futuro, sin diseño completo.</span>
          </div>
          <div class="def" style="margin-top:4mm">
            <span class="rotulo diseno">Diseño propuesto</span><span>Pantalla del lienzo de diseño, con nombres y montos ficticios.</span>
            <span class="tipo-dato">Decisión del fundador</span><span>Una regla ya decidida, con su fecha.</span>
            <span class="tipo-dato">Dato informado</span><span>Lo informa el fundador; sin auditar.</span>
          </div>
          <p class="p-texto" style="margin-top:4mm">Los puntos amarillos numerados marcan qué se toca en cada pantalla, en el orden del recorrido.</p>
        </div>
      </div>
      <div class="hoy-barra empuja">
        <p class="p-h" style="color:#fff">Dónde está la app hoy</p>
        <p>Nada de la app del especialista está publicado todavía: el núcleo (alta, pedidos, propuesta, agenda, cobro informado) corre con datos de prueba o en una rama; el resto está dibujado. Noviembre de 2026: demo cerrada con invitación; lanzamiento abierto después, fecha a confirmar.</p>
        <div class="barra-est"><span style="flex:2" class="b-c"></span><span style="flex:40" class="b-p"></span><span style="flex:49" class="b-d"></span><span style="flex:11" class="b-k"></span></div>
        <p class="ley">102 funciones auditadas el 07/11/2026: <b>2</b> construidas (la demo de la landing) · <b>40</b> en pruebas · <b>49</b> diseñadas · <b>11</b> concepto.</p>
      </div>''')

# ============================================================ CAP 01 · CÓMO VALIDAMOS
apertura('01', 'Cómo validamos', 'Cargar un documento no es estar <span class="p-marca">verificado</span>',
         'Te anotás en diez pasos y podés cortar y seguir después. Después, el equipo de verificación revisa cada documento y te habilita rubro por rubro. Hasta entonces no recibís pedidos, y ningún sello aparece sin que lo ponga el servidor.',
         [('10', 'pasos de alta, con barra de avance', est('d')),
          ('2 de 6', 'rubros piden matrícula: Gas y Aire acondicionado', est('p')),
          ('1', 'solo el equipo de verificación habilita', est('p'))],
         'aerea-centro-playa-azul.webp',
         '<div data-iso="barrio" data-paleta="dia" data-pines="1" style="position:absolute;right:-8mm;bottom:-10mm;width:132mm"></div>',
         alto=168, id_='cap1', foto_ancho=196, foto_pos='center 40%',
         extra='<p class="p-origen empuja"><span class="tipo-dato">Dato informado · sin auditar</span> 56 especialistas registrados al 31/10/2026: anotados por el fundador fuera de la landing, en una planilla propia, con su consentimiento. No son activos ni verificados. <span class="tipo-dato">Dato verificado</span> 6 rubros.</p>')

pagina('01 · Cómo validamos', f'''      <span class="p-ceja">El alta · pasos 1 a 4</span>
      <h1 class="p-titulo" style="margin-top:5mm">Quién sos, qué hacés y <span class="p-marca">dónde trabajás</span></h1>
      <p class="p-lead" style="margin-top:4.5mm;max-width:150mm">Los primeros cuatro pasos arman tu perfil y tu zona. Todo se guarda cifrado; el cliente ve tu nombre, tu foto y tus rubros, nunca tu domicilio.</p>
      <div style="margin-top:9mm">{rec([
        ('rg-1', [('50%', '92.3%')], 'Tus datos', 'Nombre, teléfono, email y contraseña. Los clientes ven solo tu nombre y tu foto.'),
        ('rg-2', [('33.7%', '38.6%')], 'Tu domicilio', 'Para calcular distancias y verificar tu identidad. Cifrado: nunca se muestra.'),
        ('rg-3', [('71.6%', '26.7%')], 'Tus rubros', 'Uno o más de los seis. Gas y Aire acondicionado piden matrícula.'),
        ('rg-4', [('45.1%', '52.2%')], 'Tus zonas', 'Solo te llegan pedidos de estos barrios. Lo cambiás cuando quieras.')])}</div>
      <div class="grilla tres-claves" style="margin-top:7mm">
        <div class="c-4 clave"><p class="p-h">Se corta y se retoma</p><p class="p-texto">Los diez pasos tienen barra de avance; podés dejar a la mitad y seguir otro día.</p>{est('d')}</div>
        <div class="c-4 clave"><p class="p-h">Rubros con matrícula</p><p class="p-texto">En Gas y Aire acondicionado el rubro se habilita recién cuando el equipo verifica la matrícula.</p>{est('p')}</div>
        <div class="c-4 clave"><p class="p-h">Tus datos, cifrados</p><p class="p-texto">Domicilio, DNI y CUIT se guardan cifrados; en la app se ven solo los últimos números.</p>{est('d')}</div>
      </div>
      <p class="p-h" style="margin-top:6mm">Los seis rubros con los que arranca Handyx</p>
      <div class="rubros6" style="margin-top:7mm"><div class="rb"><img src="img/r-electricidad.svg" alt=""><b>Electricidad</b></div><div class="rb"><img src="img/r-plomeria.svg" alt=""><b>Plomería</b></div><div class="rb mat"><img src="img/r-gas.svg" alt=""><b>Gas</b><span>Pide matrícula</span></div><div class="rb"><img src="img/r-cerrajeria.svg" alt=""><b>Cerrajería</b></div><div class="rb"><img src="img/r-albanileria.svg" alt=""><b>Albañilería</b></div><div class="rb mat"><img src="img/r-aire.svg" alt=""><b>Aire acondicionado</b><span>Pide matrícula</span></div></div>
      {origen(ROT_D, 'Alta en 10 pasos (RG-1 a RG-4)', est('d'), 'Alta guiada con identidad, rubros y zonas en código', est('p'))}''')

pagina('01 · Cómo validamos', f'''      <span class="p-ceja">El alta · pasos 5 a 10</span>
      <h1 class="p-titulo" style="margin-top:5mm">Tu cara, tus documentos y <span class="p-marca">tus matrículas</span></h1>
      <p class="p-lead" style="margin-top:4.5mm;max-width:150mm">Cada documento que cargás queda «en revisión». Lo obligatorio y lo opcional están separados: lo opcional suma a tu perfil solo cuando lo verifican.</p>
      <div style="margin-top:9mm">{rec([
        ('rg-5', [('50%', '92.3%')], 'Una selfie', 'Para que el cliente sepa quién llega y para compararla con tu DNI.'),
        ('rg-6', [('50%', '92.3%')], 'Tu DNI', 'Frente y dorso. «Cargarlo no es estar verificado.»'),
        ('rg-7', [('23.7%', '37.8%')], 'CUIT o CUIL', 'Y cómo facturás: monotributo, responsable inscripto o todavía no.'),
        ('rg-8', [('50.5%', '37.7%')], 'Certificados', 'Matrícula obligatoria por rubro; cursos y seguro, opcionales.')], inicio=5)}</div>
      <div class="grilla" style="margin-top:9mm;column-gap:6mm;align-items:start">
        <div class="c-4 paso-txt"><div class="n">09</div><p class="p-h">Antecedentes, en persona</p><p class="p-texto">Reservás un turno y mostrás el certificado de antecedentes al equipo. <b>Nunca se sube como archivo.</b> Sin antecedentes revisados no recibís pedidos.</p>{est('p', 'En pruebas · turno presencial')}<p class="p-texto nota-chica">El lienzo dibuja otra versión (foto o PDF, cifrado y borrado al verificar), en revisión legal: no se aplica ni se muestra acá.</p></div>
        <div class="c-4 paso-txt"><div class="n">10</div><p class="p-h">Revisás y enviás</p><p class="p-texto">Ves todo lo cargado con su estado, aceptás los términos y el aviso de privacidad para especialistas y lo mandás a revisar.</p>{est('d')}</div>
        <div class="c-4"><div class="marco" style="height:58mm"><img src="img/d6-alta-detalle.webp" alt="Estado del alta"></div><p class="p-texto" style="margin-top:2mm"><b class="det">Detalle</b> El estado del alta: «Estamos evaluando tu perfil».</p></div>
      </div>
      {origen(ROT_D, 'RG-5 a RG-8 y estado del alta', est('d'), 'Identidad, selfie y certificados en código', est('p'))}''')

pagina('01 · Cómo validamos', f'''      <span class="p-ceja">Quién te habilita</span>
      <h1 class="p-titulo" style="margin-top:5mm">Solo el equipo de verificación <span class="p-marca">te habilita</span></h1>
      <div class="heroe" style="margin-top:8mm">
        {movil('ob-aprobado', 60, [(1, '50%', '38.4%'), (2, '61.6%', '65.8%'), (3, '42.2%', '73.3%'), (4, '50%', '92.3%')], 'Estás habilitado')}
        <div class="notas">
          <div class="nota"><span class="num">1</span><div><p class="p-h">Lo decide una persona del equipo</p><p class="p-texto">Revisa cada documento. Ni la app ni vos pueden marcarse como verificados: el sello sale del estado del servidor.</p>{est('p')}</div></div>
          <div class="nota"><span class="num">2</span><div><p class="p-h">Se habilita rubro por rubro</p><p class="p-texto">Gas queda habilitado con la matrícula verificada; un rubro sin su matrícula no recibe pedidos.</p>{est('p')}</div></div>
          <div class="nota"><span class="num">3</span><div><p class="p-h">Kit de bienvenida</p><p class="p-texto">Al quedar verificado elegís el talle de la remera y cómo querés el manual. Es la estación 0 del Camino.</p>{est('d')}</div></div>
          <div class="nota"><span class="num">4</span><div><p class="p-h">Tres pasos cortos para arrancar</p><p class="p-texto">Permisos explicados (avisos; ubicación solo en viaje) y primeros pasos. Ninguno es obligatorio para recibir pedidos.</p>{est('d')}</div></div>
        </div>
      </div>
      <p class="p-h" style="margin-top:9mm">Los estados del alta</p>
      <div class="etapas" style="margin-top:4mm">
        <div class="etapa"><span class="pto">1</span><p class="p-h">Enviado</p><p class="p-texto">Mandaste el alta.</p></div>
        <div class="etapa"><span class="pto">2</span><p class="p-h">En evaluación</p><p class="p-texto">Cada documento: listo, en revisión o falta.</p></div>
        <div class="etapa"><span class="pto">3</span><p class="p-h">A corregir</p><p class="p-texto">Te dicen qué y lo volvés a cargar.</p></div>
        <div class="etapa"><span class="pto">4</span><p class="p-h">Habilitado o rechazado</p><p class="p-texto">Lo resuelve el equipo, con su motivo.</p>{est('p')}</div>
      </div>
      <p class="p-texto" style="margin-top:5mm;max-width:150mm"><b>Plazo de la verificación:</b> a definir. Los estados del alta existen en código (revisión, corrección, rechazo y habilitación) con datos de prueba.</p>
      {origen(ROT_D, 'Habilitado (OB-Aprobado)', est('d'), 'Estados del alta y habilitación por el equipo', est('p'))}''')

# ============================================================ CAP 02 · PEDIDOS
apertura('02', 'Los pedidos, sin obligación', 'Te llegan pedidos de tu zona. <span class="p-marca">Vos decidís</span>',
         'Nadie te asigna trabajos ni te mide por cuántos aceptás. Ves el pedido sin datos del cliente, ponés tu precio con la sugerencia de Handyx y proponés cuándo vas. La dirección exacta llega solo si el cliente te elige.',
         [('0 %', 'de comisión al especialista: recibís el 100 % de tu precio', '<span class="tipo-dato esp-1">Decisión del fundador · 07/11/2026</span>'),
          ('6', 'rubros del hogar', '<span class="tipo-dato esp-1">Dato verificado</span>'),
          ('«Ahora no»', 'no tiene ninguna consecuencia', est('p'))],
         'aerea-cabo-puerto-azul.webp',
         '<div data-iso="costa" data-paleta="dia" data-pines="1" data-rotulos="1" data-solo="faro,puerto,casino,torreon" style="position:absolute;right:0mm;bottom:-12mm;width:134mm"></div>',
         alto=168, id_='cap2', foto_ancho=196, foto_pos='center 35%')

pagina('02 · Los pedidos', f'''      <span class="p-ceja">Disponibilidad</span>
      <h1 class="p-titulo" style="margin-top:5mm">Urgentes, solo si <span class="p-marca">vos querés</span></h1>
      <div class="heroe" style="margin-top:7mm">
        {movil('cu-disponibilidad', 56, [(1, '88.3%', '13.1%'), (2, '88.3%', '20.5%'), (3, '16.7%', '33.9%'), (4, '52.6%', '69.4%')], 'Disponibilidad y zonas')}
        <div class="notas">
          <div class="nota"><span class="num">1</span><div><p class="p-h">Urgentes ahora: un permiso que revocás</p><p class="p-texto">Te llegan urgentes solo con «Disponible» prendido. Lo apagás cuando quieras, sin explicar nada.</p>{est('p')}</div></div>
          <div class="nota"><span class="num">2</span><div><p class="p-h">Programados, aparte</p><p class="p-texto">Pedidos para otro día, dentro de tus horarios. Los prendés o apagás por separado.</p>{est('p')}</div></div>
          <div class="nota"><span class="num">3</span><div><p class="p-h">Tus días y horarios</p><p class="p-texto">Fuera de tu horario no te llega nada.</p>{est('p')}</div></div>
          <div class="nota"><span class="num">4</span><div><p class="p-h">Tus zonas y rubros</p><p class="p-texto">Solo pedidos de tus barrios y de los rubros que el equipo te habilitó.</p>{est('p')}</div></div>
        </div>
      </div>
      <div class="grilla" style="margin-top:8mm;column-gap:8mm;align-items:center">
        <div class="c-4">{movil('d6-avisos', 40, [(5, '54.4%', '24.3%')], 'Avisos')}</div>
        <div class="c-8">
          <div class="nota"><span class="num">5</span><div><p class="p-h">Un aviso abre el detalle, nunca acepta</p><p class="p-texto">Pedidos nuevos, respuestas y pagos: tocás el aviso y vas al detalle. Nada se acepta desde un aviso.</p>{est('p')}</div></div>
          <div class="regla-lista" style="margin-top:6mm">
            <p><b>Sin asignaciones.</b> Ningún pedido se te asigna solo.</p>
            <p><b>Sin métricas que presionen.</b> Tu inicio no muestra tasas de aceptación, tiempos de respuesta ni puntualidad.</p>
            <p><b>Sin castigo.</b> Rechazar o dejar pasar un pedido no tiene consecuencias.</p>
          </div>
        </div>
      </div>
      {origen(ROT_D, 'CU-Disponibilidad y D6-Avisos', est('p', 'En pruebas · disponibilidad y avisos en código'), 'Avisos por notificación: sin proveedor todavía')}''')

pagina('02 · Los pedidos', f'''      <span class="p-ceja">Un pedido de punta a punta · 1 de 2</span>
      <h1 class="p-titulo" style="margin-top:5mm">Del aviso a <span class="p-marca">tu precio</span></h1>
      <p class="p-lead" style="margin-top:4.5mm;max-width:156mm">Antes de aceptar ves qué necesita el cliente, la zona aproximada y la franja que pidió. Su nombre, su teléfono y su dirección exacta, todavía no.</p>
      <div style="margin-top:8mm">{rec([
        ('f-inicio', [('74.4%', '81.8%')], 'Te llega el pedido', 'En el Inicio, sobre el mapa de tus zonas: rubro, zona aproximada y vigencia.'),
        ('f-pedido', [('71.6%', '86.1%')], 'Lo mirás sin compromiso', 'Zona aproximada, franja y lo que cuenta el cliente. «Ahora no» no tiene ninguna consecuencia.'),
        ('f-precio', [('18.7%', '49.2%')], 'Ponés tu precio', 'Deslizás la cinta o escribís el monto. Handyx sugiere; vos decidís.')], w=50)}</div>
      <div class="grilla" style="margin-top:8mm;column-gap:8mm">
        <div class="c-6 clave"><p class="p-h">Lo que ves antes de aceptar</p><p class="p-texto">Rubro y problema, barrio y distancia aproximada, la franja que pidió y un precio sugerido. Si el pedido es urgente, cuánto le queda de vigencia.</p>{est('p')}</div>
        <div class="c-6 clave"><p class="p-h">Lo que llega cuando te elige</p><p class="p-texto">La dirección exacta y el chat del trabajo. Hasta que el cliente acepta tu propuesta, no es un trabajo agendado.</p>{est('p')}</div>
      </div>
      {origen(ROT_D, 'F-Inicio, F-Pedido y F-Precio', est('p', 'En pruebas · pedido, detalle y tu precio'), 'Cinta y teclado de precio', est('d'), 'Ilustración del rubro: ícono de línea en lugar del personaje.')}''')

pagina('02 · Los pedidos', f'''      <span class="p-ceja">Un pedido de punta a punta · 2 de 2</span>
      <h1 class="p-titulo" style="margin-top:5mm">Tu propuesta, y la dirección <span class="p-marca">cuando te eligen</span></h1>
      <div style="margin-top:9mm">{rec([
        ('f-fecha', [('28.5%', '19.5%')], 'Proponés cuándo', 'Vas en el horario que pidió o proponés otro. Es una propuesta: el cliente acepta o elige otra.'),
        ('f-revisar', [('50%', '86.1%')], 'Revisás y enviás', 'Precio, fecha y lo que incluye, todo junto, antes de mandarlo.'),
        ('f-enviada', [('52.6%', '65.3%')], 'Le llegó', 'Te avisamos cuando responde. El chat queda abierto con el pedido.'),
        ('f-trabajo', [('56.1%', '51.5%')], 'Te eligió', 'Recién ahí ves la dirección exacta, el acuerdo y «Salir para allá».')], inicio=4)}</div>
      <p class="p-h" style="margin-top:9mm">Qué puede pasar con tu propuesta</p>
      <div class="salidas" style="margin-top:3.5mm">
        <div><b>Acepta</b><span>El trabajo queda agendado con la dirección exacta.</span></div>
        <div><b>Pide otro precio</b><span>Contraoferta: aceptás, rechazás o ajustás, siempre con confirmación.</span></div>
        <div><b>Elige otro día</b><span>Lo agendado cambia solo cuando los dos están de acuerdo.</span></div>
        <div><b>Vence o elige a otro</b><span>Si dos aceptan a la vez, gana una sola. Retirás tu propuesta cuando quieras.</span></div>
      </div>
      {origen(ROT_D, 'F-Fecha, F-Revisar, F-Enviada y F-Trabajo', est('p', 'En pruebas · fecha, contraoferta, aceptación y vencimiento'), 'Horario a medida', est('d'))}''')

# ============================================================ CAP 03 · UN DÍA
apertura('03', 'Un día de trabajo', 'Del primer paso al <span class="p-marca">informe</span>',
         'La app ordena tu día: la próxima parada, el viaje, una pantalla grande para trabajar con guantes, el antes y el después, el cobro directo y un informe que se arma solo, con la garantía adentro.',
         [('Ruta', 'tus paradas del día, en orden', est('d')),
          ('En camino', 'el cliente te ve llegar solo durante el viaje', est('p')),
          ('Cobro', 'directo a vos: Handyx no toca la plata', est('p'))],
         'rambla-fuego-azul.webp',
         '<div data-iso="maqueta" data-paleta="dia" data-pines="1" style="position:absolute;right:-12mm;bottom:-16mm;width:150mm"></div>',
         alto=168, id_='cap3', foto_pos='center 12%')

pagina('03 · Un día de trabajo', f'''      <span class="p-ceja">Un día · 1 de 2</span>
      <h1 class="p-titulo" style="margin-top:5mm">Llegar y <span class="p-marca">trabajar cómodo</span></h1>
      <div style="margin-top:9mm">{rec([
        ('f-inicioruta', [('50%', '91.4%')], 'Tu recorrido', 'Paradas en orden, kilómetros y la próxima salida. Avisás una demora con un toque.'),
        ('tr-encamino', [('50%', '79.5%')], 'En camino', 'El cliente ve que vas en camino. Tu ubicación se comparte solo hasta que llegás.'),
        ('h0-modo', [('58.7%', '86%')], 'Modo trabajo', 'Cronómetro y tareas que arrancan por la seguridad, con botones grandes para usar con guantes.'),
        ('h0-antesdespues', [('50%', '92.3%')], 'Antes y después', 'Deslizás para comparar y contás (o dictás) qué cambiaste.')])}</div>
      <div class="grilla" style="margin-top:9mm;column-gap:6mm">
        <div class="c-4 clave"><p class="p-h">Ubicación, solo en viaje</p><p class="p-texto">Nunca en segundo plano ni con «No disponible». La llegada se marca sola en la puerta o con «Ya llegué».</p>{est('p')}</div>
        <div class="c-4 clave"><p class="p-h">Sin salir del trabajo</p><p class="p-texto">Foto, repuestos, pedir ayuda a un contacto y herramientas del teléfono (nivel, linterna, medir).</p>{est('d')}</div>
        <div class="c-4 clave"><p class="p-h">Adicionales con acuerdo</p><p class="p-texto">Si aparece un repuesto, lo cargás con tu precio; el cliente lo acepta y mientras tanto rige el precio vigente.</p>{est('p')}</div>
      </div>
      {origen(ROT_D, 'F-InicioRuta, TR-EnCamino, H0-Modo y H0-AntesDespues', 'Ruta, Modo trabajo y antes/después', est('d'), 'Viaje y llegada', est('p'))}''')

pagina('03 · Un día de trabajo', f'''      <span class="p-ceja">Un día · 2 de 2</span>
      <h1 class="p-titulo" style="margin-top:5mm">Cobrar directo y dejar <span class="p-marca">todo registrado</span></h1>
      <div style="margin-top:9mm">{rec([
        ('tr-cobro', [('28.4%', '37.2%')], 'Informás el cobro', 'Efectivo, Mercado Pago o transferencia. Queda «informado por vos» hasta que se verifica.'),
        ('h0-informe', [('50%', '92.3%')], 'El informe se arma solo', 'Qué encontraste, antes y después, pruebas, materiales y garantía.'),
        ('h0-informeenviado', [('56.1%', '46%')], 'Conformidad y garantía', 'El cliente da su conformidad con un toque y arranca la garantía. Queda el PDF.'),
        ('f-ingresos', [('18.5%', '55.3%')], 'Lo que te queda', 'Bruto, gastos y neto, con lo verificado separado de lo informado.')], inicio=5)}</div>
      <div class="banda-dato" style="margin-top:9mm">
        <div><p class="p-h">La plata no pasa por Handyx</p><p class="p-texto">El cliente te paga directo a vos. No hay saldo «de Handyx» ni retenciones: Handyx no le cobra comisión al especialista. Lo informado y lo verificado se muestran por separado.</p></div>
        <div class="chips">{est('p', 'Informar el cobro · En pruebas')}{est('p', 'Caja · En pruebas')}{est('d', 'Informe y garantía · Diseñado')}{est('d', 'Ingresos y gastos · Diseñado')}</div>
      </div>
      {origen(ROT_D, 'TR-Cobro, H0-Informe, H0-InformeEnviado y F-Ingresos', 'Mercado Pago: sin credenciales todavía.')}''')

# ============================================================ CAP 04 · OBRA
obra_etapas = f'''<div class="etapas obra-et" style="margin-top:8mm">
        <div class="etapa"><span class="pto">1</span><p class="p-h">Proponés la obra</p><p class="p-texto">Para quién, oficios, etapas, jornadas y montos.</p>{est('d')}</div>
        <div class="etapa"><span class="pto">2</span><p class="p-h">El cliente acepta</p><p class="p-texto">Le llega como tarjeta en el chat.</p>{est('d')}</div>
        <div class="etapa"><span class="pto">3</span><p class="p-h">Armás el equipo</p><p class="p-texto">Invitás o publicás una búsqueda; acuerdan el reparto.</p>{est('d')}</div>
        <div class="etapa"><span class="pto">4</span><p class="p-h">Día por día</p><p class="p-texto">Jornadas, tareas y avance que ve el cliente.</p>{est('p')}</div>
        <div class="etapa"><span class="pto">5</span><p class="p-h">Repuestos y fechas</p><p class="p-texto">El cliente aprueba; Handyx avisa si falta comprar.</p>{est('d')}</div>
        <div class="etapa"><span class="pto">6</span><p class="p-h">Cobro por etapa</p><p class="p-texto">Cada etapa se cobra al terminarla, directo.</p>{est('p')}</div>
      </div>'''
apertura('04', 'Una obra de punta a punta', 'Una obra de varios días, <span class="p-marca">en equipo</span>',
         'Un baño completo no se resuelve en una visita. La app lleva la obra entera: la propuesta por etapas, el equipo, cada jornada, los repuestos que aprueba el cliente, las fechas que se mueven solo con su acuerdo y el cobro de cada etapa.',
         [], 'aerea-quintas-azul.webp',
         '<div data-iso="barrio" data-paleta="dia" data-pines="1" style="position:absolute;right:-6mm;bottom:-12mm;width:128mm"></div>',
         alto=128, id_='cap4', foto_ancho=196, foto_pos='center 45%',
         extra=obra_etapas + '<p class="p-texto" style="margin-top:6mm;max-width:160mm">Las etapas siguen el flujo «Una obra de varios días» y su recorrido con pantallas (doce pasos) del lienzo. Las páginas que siguen las muestran en orden.</p>' + origen(ROT_D, 'Plan, jornadas, diario y cobro por etapa', est('p'), 'Propuesta de obra, equipo, repuestos y reparto', est('d')))

pagina('04 · Una obra', f'''      <span class="p-ceja">Obra · etapas 1 y 2</span>
      <h1 class="p-titulo" style="margin-top:5mm">Proponer la obra, <span class="p-marca">por etapas</span></h1>
      <p class="p-lead" style="margin-top:4.5mm;max-width:156mm">A un cliente tuyo o a uno nuevo, por un enlace. Armás las etapas con sus jornadas y montos, decidís si cobrás por etapa y si los materiales van aparte.</p>
      <div style="margin-top:8mm">{rec([
        ('f-obranueva', [('56.1%', '37.4%')], '¿Para quién?', 'Un cliente con el que ya trabajaste o uno nuevo. Elegís los oficios que hacen falta.'),
        ('f-propuestaobra', [('30.9%', '68.6%')], 'Etapas y montos', 'Demolición, cañerías, revestimiento: cada etapa con jornadas y monto. Cobro por etapa.'),
        ('f-obras', [('50%', '41.4%')], 'Tus obras', 'Cuando el cliente acepta, la obra aparece con su avance, lo gastado y lo que falta.')], w=50)}</div>
      <div class="grilla" style="margin-top:8mm;column-gap:8mm">
        <div class="c-6 clave"><p class="p-h">La propuesta viaja como tarjeta</p><p class="p-texto">El cliente la acepta o pide cambios en el chat. Nada se manda solo.</p>{est('d')}</div>
        <div class="c-6 clave"><p class="p-h">Materiales a la vista</p><p class="p-texto">Si van aparte, se aprueban en el chat a medida que hacen falta: sin discusiones al final.</p>{est('d')}</div>
      </div>
      {origen(ROT_D, 'F-ObraNueva, F-PropuestaObra y F-Obras', est('d'))}''')

pagina('04 · Una obra', f'''      <span class="p-ceja">Obra · etapa 3</span>
      <h1 class="p-titulo" style="margin-top:5mm">Sumar a otro especialista <span class="p-marca">verificado</span></h1>
      <p class="p-lead" style="margin-top:4.5mm;max-width:156mm">Si la obra pide otro oficio, invitás a un contacto o publicás una búsqueda. Solo la ven especialistas verificados de la zona, sin la dirección; elegís vos.</p>
      <div style="margin-top:8mm">{rec([
        ('f-obraequipo', [('50%', '91.4%')], 'El equipo', 'Quién está, su parte y la invitación pendiente. El cliente ve los días y el chat del grupo.'),
        ('f-obrabuscar', [('50%', '92.3%')], 'Publicás la búsqueda', 'Oficio, jornadas y su parte del pago. «Verificado por Handyx»: siempre, no se apaga.'),
        ('f-obrapostulantes', [('50%', '40.2%')], 'Elegís', 'Ves perfil, verificaciones y trabajos de cada postulante. Nadie entra solo.'),
        ('f-reparto', [('28.5%', '88.2%')], 'Acuerdan el reparto', 'Cuánto le toca a cada uno y cómo cobra. Handyx registra lo acordado.')])}</div>
      <div class="banda-dato" style="margin-top:9mm">
        <div><p class="p-h">Handyx no recibe ni reparte la plata</p><p class="p-texto">Registra lo que acuerdan entre ustedes: cada uno le cobra su parte al cliente, o la cobrás vos y la repartís por fuera. La invitación vale 48 horas y solo para esa obra.</p></div>
        <div class="chips">{est('d', 'Equipo, búsqueda y reparto · Diseñado')}{est('p', 'Contactos · En pruebas')}</div>
      </div>
      {origen(ROT_D, 'F-ObraEquipo, F-ObraBuscar, F-ObraPostulantes y F-Reparto')}''')

pagina('04 · Una obra', f'''      <span class="p-ceja">Obra · etapa 4</span>
      <h1 class="p-titulo" style="margin-top:5mm">La obra entera, <span class="p-marca">en una pantalla</span></h1>
      <div class="heroe" style="margin-top:9mm">
        {movil('f-obra', 66, [(1, '50%', '28.3%'), (2, '76.1%', '28.3%'), (3, '50.2%', '39.9%'), (4, '46.7%', '72.4%')], 'Obra')}
        <div class="notas">
          <div class="nota"><span class="num">1</span><div><p class="p-h">En obra y gastado</p><p class="p-texto">Qué día de la obra es y cuánto se gastó en materiales, siempre a la vista.</p>{est('p')}</div></div>
          <div class="nota"><span class="num">2</span><div><p class="p-h">Lo que falta cobrar</p><p class="p-texto">Cobro por etapa: lo cobrado y lo pendiente sobre el total acordado.</p>{est('p')}</div></div>
          <div class="nota"><span class="num">3</span><div><p class="p-h">Un aviso antes de que falte algo</p><p class="p-texto">El día anterior te avisa si falta comprar un repuesto, y si el cliente todavía no lo aprobó.</p>{est('d')}</div></div>
          <div class="nota"><span class="num">4</span><div><p class="p-h">Días en línea de tiempo</p><p class="p-texto">Cada jornada con su etapa, quién va y su estado: hecha, hoy, falta comprar, cambio pedido.</p>{est('p')}</div></div>
        </div>
      </div>
      <p class="p-texto" style="margin-top:8mm;max-width:156mm">El plan por etapas, las jornadas, el diario con fotos que ve el cliente y el cobro por etapa tienen código (en una rama, con datos de prueba). El plan de obra lo crea la API de la app del cliente.</p>
      {origen(ROT_D, 'F-Obra', 'Plan, jornadas y cobro por etapa', est('p'), 'Aviso de repuestos', est('d'))}''')

pagina('04 · Una obra', f'''      <span class="p-ceja">Obra · etapas 4, 5 y 6</span>
      <h1 class="p-titulo" style="margin-top:5mm">Cada jornada, cada repuesto, <span class="p-marca">cada fecha</span></h1>
      <div style="margin-top:9mm">{rec([
        ('f-obradia', [('80.6%', '75.6%')], 'Una jornada', 'Quién viene, tareas asignadas y el avance del día que ve el cliente.'),
        ('f-obradiaavance', [('50%', '82.3%')], 'Cargás el avance', 'Fotos y una nota. Se mandan al chat de la obra; las fotos se achican y pierden la ubicación.'),
        ('f-obrarepuestos', [('36.6%', '41.1%')], 'Repuestos a aprobar', 'Los cargás por jornada; el cliente los aprueba en el chat. Los conseguís vos o en una ferretería adherida.'),
        ('f-obrafecha', [('50%', '45.5%')], 'Mover jornadas', 'Esta sola o esta y las que siguen. Hasta que el cliente acepta, siguen las fechas de ahora.')])}</div>
      <div class="grilla" style="margin-top:9mm;column-gap:6mm">
        <div class="c-4 clave"><p class="p-h">El cliente aprueba</p><p class="p-texto">Repuestos, cambios de fecha y propuestas viajan como tarjetas que responde en el chat de la obra.</p>{est('d')}</div>
        <div class="c-4 clave"><p class="p-h">Pedir otro día</p><p class="p-texto">Es una solicitud: no mueve las demás jornadas hasta que el cliente acepta. Se avisa al equipo.</p>{est('p')}</div>
        <div class="c-4 clave"><p class="p-h">Cierre de cada etapa</p><p class="p-texto">Al terminar una etapa se cobra, directo a vos; el informe final deja la garantía registrada.</p>{est('p', 'Cobro por etapa · En pruebas')}</div>
      </div>
      {origen(ROT_D, 'F-ObraDia, F-ObraDiaAvance, F-ObraRepuestos y F-ObraFecha', 'Jornadas y diario', est('p'), 'Tareas, repuestos y correr fechas', est('d'))}''')

# ============================================================ CAP 05 · HERRAMIENTAS
herr = [('Presupuestador', 'Mano de obra y materiales de tu lista; si un precio cambia antes de que acepte, sale una versión nueva.', est('d')),
        ('Lista de precios', 'Tus materiales y tarifas; la foto de la lista del corralón se lee en el teléfono y no sale de ahí.', est('d')),
        ('Tarifas de mano de obra', 'Hora, visita, urgencia y precio por tarea. Son tus precios: Handyx solo sugiere.', est('d')),
        ('Ingresos y gastos', 'Bruto, gastos con la foto del ticket y neto por trabajo.', est('d')),
        ('Tu equipamiento', 'Herramientas, dónde está cada una, mantenimiento, préstamos y reposición.', est('d')),
        ('Ferretería', 'Pedido único y retiro con QR. Hoy es una simulación con ferreterías ficticias.', est('d')),
        ('Herramientas del teléfono', 'Medir, escanear en 3D, plomada; el nivel ya tiene código.', est('d') + ' ' + est('p', 'Nivel · En pruebas')),
        ('Electricidad (H1)', 'Cables, tablero 3D en la pared e informe con semáforo, en revisión técnica.', est('p')),
        ('Otros oficios (H2 a H6)', 'Aire, plomería, gas, albañilería y cerrajería: después del lanzamiento.', est('k'))]
herr_html = '<div class="grilla herr" style="margin-top:7mm">' + ''.join(f'<div class="c-4 herr-i"><p class="p-h">{a}</p><p class="p-texto">{b}</p><div>{c}</div></div>' for a, b, c in herr) + '</div>'
apertura('05', 'Tus herramientas', 'Tu taller, <span class="p-marca">en el bolsillo</span>',
         'Handyx no quiere ser solo un canal de clientes: quiere ser tu herramienta de trabajo. Esto es lo que hay en la pestaña Taller y en qué estado está cada cosa.',
         [], 'aerea-puerto-sur-azul.webp',
         '<div data-iso="costa" data-paleta="dia" data-pines="1" data-solo="puerto,faro" style="position:absolute;right:-8mm;bottom:-12mm;width:120mm"></div>',
         alto=104, id_='cap5', foto_ancho=150, foto_pos='center 60%',
         personaje_html=personaje('engranaje', 'position:absolute;left:150mm;top:110mm;width:22mm'),
         extra=herr_html + origen('Estados según la auditoría del 07/11/2026.', '<span class="rotulo concepto">Concepto</span>', 'H2 a H6: un tablero por oficio, sin fecha.'))

pagina('05 · Tus herramientas', f'''      <span class="p-ceja">Presupuestos y lista de precios</span>
      <h1 class="p-titulo" style="margin-top:5mm">Presupuestar rápido <span class="p-marca">sin perder plata</span></h1>
      <div style="margin-top:9mm">{rec([
        ('h0-presupuesto', [('50%', '92.3%')], 'El presupuesto', 'Mano de obra con tus tarifas y materiales de tu lista. Lo mandás como tarjeta por el chat.'),
        ('h0-precios', [('43.4%', '72.2%')], 'Tu lista de precios', 'Materiales y tarifas por categoría, con lo que subió y los precios viejos marcados.'),
        ('h0-preciosfoto', [('58.7%', '91.6%')], 'Foto del corralón', 'Se lee en tu teléfono: la foto no sale de ahí. Revisás cada precio antes de guardarlo.'),
        ('h0-manoobra', [('50%', '92.3%')], 'Tus tarifas', 'Hora, visita, recargo de urgencia y precio por tarea. Son tus precios.')])}</div>
      <div class="grilla" style="margin-top:9mm;column-gap:6mm">
        <div class="c-4 clave"><p class="p-h">Precio fijo o que se actualiza</p><p class="p-texto">Si un material sube antes de que el cliente acepte, te avisa y sale una versión nueva.</p>{est('d')}</div>
        <div class="c-4 clave"><p class="p-h">Tu precio es tuyo</p><p class="p-texto">Si cargás un material nuevo, su nombre suma al catálogo; tu precio queda solo para vos.</p>{est('d')}</div>
        <div class="c-4 clave"><p class="p-h">Hoy, en código</p><p class="p-texto">Tu precio con la sugerencia de Handyx y un presupuesto simple dentro del chat.</p>{est('p')}</div>
      </div>
      {origen(ROT_D, 'H0-Presupuesto, H0-Precios, H0-PreciosFoto y H0-ManoObra', est('d'), 'Corralón y montos: ficticios. Catálogo con precios de ferreterías de Mar del Plata', est('k'))}''')

pagina('05 · Tus herramientas', f'''      <span class="p-ceja">Equipamiento, ferretería y Taller</span>
      <h1 class="p-titulo" style="margin-top:5mm">Lo que llevás, lo que comprás y <span class="p-marca">lo que medís</span></h1>
      <div style="margin-top:9mm">{rec([
        ('h0-equipo', [('28.4%', '31.3%')], 'Tu equipamiento', 'Por categoría y por lugar: camioneta, taller o prestada. Avisa lo que vence o queda poco.', est('d')),
        ('r-retiro', [('50%', '85.2%')], 'Retiro con QR', 'Pedido único a una ferretería adherida. La venta la cobra la ferretería.', est('d', 'Diseñado · simulación')),
        ('t-taller', [('27.2%', '38%')], 'Herramientas del teléfono', 'Medir con la cámara, escanear en 3D, nivel y plomada, para todos los oficios.', est('d')),
        ('t-tablero', [('71.6%', '92.3%')], 'Tablero 3D (Electricidad)', 'Armás el tablero, sale el cómputo y lo mostrás en la pared del cliente.', est('p'))], flechas=False)}</div>
      <div class="aviso-seg" style="margin-top:9mm">
        <p class="p-h">Avisos que no se sacan</p>
        <div class="grilla" style="column-gap:6mm;margin-top:2.5mm">
          <p class="c-4 p-texto">El teléfono no detecta tensión, gas ni monóxido: las mediciones son tuyas, con tus instrumentos.</p>
          <p class="c-4 p-texto">Las tablas de Electricidad están en revisión técnica: son orientativas y no reemplazan la norma ni tu criterio.</p>
          <p class="c-4 p-texto">No hay ferreterías aliadas firmadas: las del diseño son ficticias y las condiciones, a definir.</p>
        </div>
      </div>
      {origen(ROT_D, 'H0-Equipo, R-Retiro, T-Taller y T-Tablero', 'Tablero 3D: código en una rama, sin probar en teléfonos reales.')}''')

# ============================================================ CAP 06 · CAMINO
esc = f'''<div class="escalera" style="margin-top:8mm">
        <div class="peldano" style="--h:24mm"><div class="p-num">0</div><p class="p-h">Bienvenida</p><p class="p-texto">Remera y manual, al quedar verificado.</p></div>
        <div class="peldano" style="--h:30mm"><div class="p-num">1</div><p class="p-h">Kit chico</p><p class="p-texto">1 trabajo verificado.</p></div>
        <div class="peldano" style="--h:36mm"><div class="p-num">2</div><p class="p-h">Consumibles</p><p class="p-texto">5 trabajos verificados.</p></div>
        <div class="peldano" style="--h:42mm"><div class="p-num">3</div><p class="p-h">Gorra Handyx</p><p class="p-texto">10 trabajos verificados.</p></div>
        <div class="peldano alto" style="--h:48mm"><div class="p-num">4</div><p class="p-h">Herramienta</p><p class="p-texto">De tu oficio. 25 trabajos.</p></div>
      </div>'''
apertura('06', 'Cómo se sube de categoría', 'Crecer en Handyx: el <span class="p-marca">Camino</span>',
         'Avanzás por estaciones con trabajos y cobros verificados. Los premios se ven de antemano, nada se resta y no hay rankings, sorteos ni puntos por aceptar pedidos. Las cantidades y los premios son un borrador que Handyx define con Legal.',
         [], 'aerea-faro-mogotes-azul.webp',
         '<div data-iso="costa" data-paleta="dia" data-pines="1" data-solo="faro" style="position:absolute;right:-6mm;bottom:-14mm;width:120mm"></div>',
         alto=110, id_='cap6', foto_ancho=196, foto_pos='center 55%',
         personaje_html=personaje('llave', 'position:absolute;right:18mm;top:182mm;width:22mm'),
         extra=esc + '<p class="p-texto" style="margin-top:3mm"><span class="tipo-dato">Borrador del lienzo</span> Estaciones del Camino de los trabajos (G-Camino). La pantalla del regalo dice 15 trabajos para la herramienta; G-Camino, 25: a definir.</p>' + origen(est('d', 'Camino Handyx · Diseñado'), 'Premios del oficio Electricidad en borrador en código', est('k', 'Áreas del camino · Concepto')))

pagina('06 · Cómo se sube de categoría', f'''      <span class="p-ceja">El Camino · de la bienvenida a la primera estación</span>
      <h1 class="p-titulo" style="margin-top:5mm">Solo cuenta lo <span class="p-marca">verificado</span></h1>
      <div style="margin-top:9mm">{rec([
        ('g-bienvenida', [('59.8%', '53.4%')], 'Kit de bienvenida', 'Al quedar verificado: remera y el manual en la app, impreso o los dos.'),
        ('g-manual', [('46.8%', '50.3%')], 'El manual', 'Seis capítulos cortos. Leerlo da una insignia; no cambia los pedidos que recibís.'),
        ('g-inicio', [('41.8%', '47.7%')], 'Tus mini caminos', 'Trabajos verificados, cobros verificados y tu oficio, cada uno con su próxima recompensa.'),
        ('g-camino', [('38%', '40.3%')], 'El camino de los trabajos', 'Estaciones visibles de antemano. Solo cuentan trabajos verificados; nada se resta.')])}</div>
      <div class="grilla reglas4" style="margin-top:9mm">
        <div class="c-3"><p class="p-h">Solo lo verificado</p><p class="p-texto">Trabajos y cobros verificados. Lo informado sin verificar todavía no cuenta.</p></div>
        <div class="c-3"><p class="p-h">Nada se resta</p><p class="p-texto">Rechazar un pedido o tomarte una semana no te baja de estación.</p></div>
        <div class="c-3"><p class="p-h">Sin rankings ni azar</p><p class="p-texto">No competís con otros especialistas y no hay sorteos.</p></div>
        <div class="c-3"><p class="p-h">Los pedidos no cambian</p><p class="p-texto">Insignias y estaciones no cambian qué pedidos te llegan.</p></div>
      </div>
      {origen(ROT_D, 'G-Bienvenida, G-Manual, G-Inicio y G-Camino', est('d'), '«Retiro en un punto Handyx»: punto sin confirmar.')}''')

pagina('06 · Cómo se sube de categoría', f'''      <span class="p-ceja">Mini caminos, insignias y premios</span>
      <h1 class="p-titulo" style="margin-top:5mm">Premios que se ven <span class="p-marca">antes de ganarlos</span></h1>
      <div style="margin-top:9mm">{rec([
        ('g-minicamino', [('62.2%', '47.7%')], 'Cobros verificados', 'Un mini camino por lo cobrado y verificado. Montos y premios en borrador, con Legal.', est('d')),
        ('g-insignias', [('21.4%', '34.3%')], 'Insignias', 'Reconocen cómo usás la app. No dan premios ni cambian los pedidos.', est('d')),
        ('g-canje', [('50%', '92.3%')], 'Canje', 'Elegís color y cómo lo recibís. Cada premio se revisa antes de entregarlo.', est('d')),
        ('g-areas', [('45%', '12.7%')], 'Áreas del camino', 'El taller, la obra, la ciudad: una idea para más adelante.', est('k'))], flechas=False)}</div>
      <div class="banda-dato" style="margin-top:9mm">
        <div><p class="p-h">Lo que todavía no está definido</p><p class="p-texto">Las cantidades de cada estación, los montos de los mini caminos, los premios, quién los paga y cómo se entregan (incluido el punto de retiro) están en borrador: los define Handyx con Legal antes de prometer nada.</p></div>
        <div class="chips">{est('d', 'Camino y canje · Diseñado')}{est('k', 'Áreas · Concepto')}</div>
      </div>
      {origen(ROT_D, 'G-MiniCamino, G-Insignias, G-Canje y G-Areas', 'Montos y premios del lienzo: borrador.')}''')

# ============================================================ CAP 07 · ADENTRO
mec = [('Recibís el 100 %', 'Handyx no le cobra comisión al especialista. No hay porcentaje que ahorrarse por fuera.', '<span class="tipo-dato">Decisión del fundador · 07/11/2026</span>'),
       ('Pedidos sin buscarlos', 'Clientes de tu zona y tus rubros que ya contaron qué necesitan.', est('p')),
       ('Chat sin dar tu teléfono', 'Hablás con el cliente sin mostrar números; las llamadas por número puente esperan un proveedor.', est('p')),
       ('Historial que es tuyo', 'Trabajos, informes en PDF, antes y después: tu portfolio de trabajos verificados.', est('d')),
       ('Reseñas', 'La reseña opcional del cliente corre solo en una vista de prueba; el perfil con opiniones está en el diseño.', est('p', 'En pruebas · vista de prueba') + ' ' + est('d', 'Perfil · Diseñado')),
       ('Garantía registrada', 'La conformidad del cliente y la garantía quedan en el informe: si hay un problema, hay registro.', est('d')),
       ('Reclamos con seguimiento', 'El equipo los ordena por gravedad y plazo. Hoy entran por teléfono o mail; desde la app, todavía no.', est('c', 'Portal · Construido')),
       ('El Camino', 'Solo cuentan los trabajos y cobros verificados adentro de Handyx.', est('d'))]
mec_html = '<div class="grilla mec" style="margin-top:7mm">' + ''.join(f'<div class="c-6 mec-i"><span class="mi">{i+1:02d}</span><div><p class="p-h">{a}</p><p class="p-texto">{b}</p><div class="ch">{c}</div></div></div>' for i, (a, b, c) in enumerate(mec)) + '</div>'
apertura('07', 'Por qué conviene quedarse adentro', 'Recibís el 100 %. Y lo que construís, <span class="p-marca">queda</span>',
         'Nada te impide arreglar por fuera con un cliente, y no lo vamos a disimular. Lo que hacemos es que adentro valga más: sin comisión, con historial, garantía, reseñas y un camino que solo suma con trabajos verificados.',
         [], 'casino-plaza-azul.webp',
         '<div data-iso="costa" data-paleta="dia" data-pines="1" data-solo="casino,torreon" style="position:absolute;right:-6mm;bottom:-12mm;width:110mm"></div>',
         alto=96, id_='cap7', foto_pos='center 40%',
         extra=mec_html + origen('Lo medimos como repetición dentro de Handyx: el mismo cliente que vuelve a pedir por la app.', ROT_D))

# ============================================================ PREGUNTAS DIFÍCILES
def duda(q, corta, larga, hoy):
    return f'<div class="c-6 duda"><p class="q">{q}</p><p class="corta">{corta}</p><p class="larga">{larga}</p><p class="hoy"><b>Hoy</b>{hoy}</p></div>'
d1 = [duda('¿Cuánto me cobra Handyx?', 'Nada: Handyx no le cobra comisión al especialista.',
           'Recibís el 100 % de tu precio y el cliente te paga directo. Al cliente, 0 % hasta el 10/12/2026; después, 15 % sobre tu presupuesto, en evaluación. Si la demo de la landing muestra otra tarifa, está desactualizada.',
           '<span class="tipo-dato">Decisión del fundador · 07/11/2026</span> <span class="tipo-dato">15 %: en evaluación</span> Cómo se cobra al cliente: a definir'),
      duda('¿Me castigan si rechazo o cancelo?', 'No. «Ahora no» no tiene ninguna consecuencia.',
           'No hay asignaciones ni tasas de aceptación, y el Camino no cuenta pedidos aceptados. Si cancelás un trabajo agendado, lo hacés con un motivo y sin penalización automática.',
           est('p') + ' Sin pedidos asignados ni métricas de aceptación'),
      duda('¿Por qué no me arreglo por fuera con el cliente?', 'Podés, y nadie te lo impide. Adentro gana más el que trabaja bien.',
           'No hay comisión que ahorrarse. Adentro quedan tu historial, la garantía registrada, las reseñas, el Camino y los reclamos con seguimiento; por fuera, si algo sale mal, no hay registro.',
           est('p', 'Chat · En pruebas') + est('d', 'Garantía · Diseñado') + est('d', 'Camino · Diseñado')),
      duda('¿Cuándo me verifican y qué pasa con mis antecedentes?', 'Cuando el equipo revisa cada documento. Los antecedentes, en persona.',
           'Reservás un turno y mostrás el certificado; nunca se sube como archivo. Hasta estar habilitado no recibís pedidos. El lienzo propone otra versión (archivo cifrado), en revisión legal y sin aplicar.',
           est('p', 'Turno presencial · En pruebas') + ' Plazo: a definir')]
d2 = [duda('¿Quién me asegura el cobro?', 'Nadie en el medio: el cliente te paga directo a vos.',
           'Handyx no toca la plata, no tiene saldo tuyo y no garantiza el pago. Informás cómo te pagaron y queda «informado» hasta que se verifica. Si el cliente no paga, el reclamo lo sigue el equipo.',
           est('p', 'Informar el cobro · En pruebas') + ' Mercado Pago: sin credenciales'),
      duda('¿Me obligan a tomar urgencias?', 'No. Urgentes, solo si prendés «Disponible».',
           'Es un permiso que activás y revocás cuando quieras; los programados van aparte. Un aviso abre el detalle del pedido y nunca acepta nada por vos.',
           est('p')),
      duda('¿Quién ve mis datos y los del cliente?', 'Cada uno ve lo justo para el trabajo.',
           'Tu domicilio, DNI y CUIT van cifrados y se ven solo los últimos números. El cliente ve tu zona, nunca tu domicilio. Vos ves su dirección exacta recién cuando acepta, y tu ubicación se comparte solo en viaje.',
           est('d', 'Alta cifrada · Diseñado') + est('p', 'Dirección al aceptar · En pruebas')),
      duda('¿Y si el trabajo sale mal o hay un reclamo?', 'Respondés por tu trabajo, con registro de lo que hiciste.',
           'El informe deja el antes y después, la conformidad del cliente y la garantía. Los reclamos los ordena el equipo por gravedad y plazo; desde la app todavía no se pueden abrir.',
           est('d', 'Informe y garantía · Diseñado') + est('c', 'Reclamos en el portal'))]
pagina('08 · Preguntas difíciles', f'''      <span class="p-ceja">Lo que nos preguntan sin vueltas · 1 de 2</span>
      <h1 class="p-titulo" style="margin-top:5mm">Las preguntas <span class="p-marca">incómodas</span></h1>
      <div class="grilla dudas" style="margin-top:8mm">{''.join(d1)}</div>
      <p class="p-origen" style="margin-top:6mm">Respuestas según la auditoría del 07/11/2026 y las decisiones del fundador. Lo que dice «a definir» está pendiente.</p>''', estilo='--fondo:var(--hueso)', id_='cap8', antes='<img class="zocalo-foto" src="../../marca/fotos/casino-plaza-azul.webp" alt="" style="object-position:center 62%">')
pagina('08 · Preguntas difíciles', f'''      <span class="p-ceja">Lo que nos preguntan sin vueltas · 2 de 2</span>
      <h1 class="p-titulo" style="margin-top:5mm">La plata, la presión y <span class="p-marca">los datos</span></h1>
      <div class="grilla dudas" style="margin-top:8mm">{''.join(d2)}</div>
      <p class="p-origen" style="margin-top:6mm">Fotos: Mar del Plata, del fundador.</p>''', estilo='--fondo:var(--hueso)', antes='<img class="zocalo-foto" src="../../marca/fotos/rambla-fuego-azul.webp" alt="" style="object-position:center 28%">')

# ============================================================ CONTRATAPA
paginas.append(f'''<section class="pagina contra-g">
  <div class="lamina">
    <div class="a-sangre-arriba" style="height:calc(162mm + var(--sangrado));background:var(--azul);overflow:hidden">
      <img class="foto-banda" src="../../marca/fotos/rambla-fuego-azul.webp" alt="" style="width:216mm;height:165mm;object-position:center 10%;opacity:0.92">
      <div class="velo"></div>
      <div data-iso="costa" data-paleta="dia" data-pines="1" data-rotulos="1" data-solo="faro,puerto,casino,torreon" style="position:absolute;right:2mm;bottom:-14mm;width:120mm"></div>
    </div>
    {personaje('brocha', 'position:absolute;right:20mm;top:150mm;width:22mm')}
    <div class="caja" style="top:15mm;left:16mm;right:16mm;bottom:14mm">
      <img src="../../marca/logo-handyx-blanco.svg" alt="Handyx" style="height:8.5mm;align-self:flex-start">
      <p class="lema-v2">Un problema viejo con una nueva solución <span>que elegís.</span></p>
      <div style="margin-top:94mm">
        <span class="p-ceja">Conocé el proyecto completo</span>
        <div class="qr-v2">
          <img src="../../marca/qr-hub.svg" alt="Código QR a landing.handyc.com/handyx">
          <div>
            <p class="p-lead" style="font-size:10.6pt">La landing con la demo interactiva, los cuatro dossiers y el portafolio del fundador, en un solo lugar.</p>
            <p class="p-h" style="margin-top:2mm"><a href="https://landing.handyc.com/handyx/">landing.handyc.com/handyx</a></p>
          </div>
        </div>
        <div class="contacto-v2">
          <div><b>Contacto</b>Ignacio Gauna, fundador</div>
          <div><b>Email</b><a href="mailto:ignaciogauna.developer@gmail.com">ignaciogauna.developer@gmail.com</a></div>
          <div><b>Teléfono</b><a href="tel:+5492236674044">223 667-4044</a></div>
          <div><b>Web</b><a href="https://landing.handyc.com/">landing.handyc.com</a></div>
        </div>
      </div>
      <div class="empuja">
        <div class="coleccion" style="color:var(--navy)"><span>Tríptico</span><span>01 Business &amp; Investment</span><span>02 Customer App</span><span class="actual">03 Professional App</span><span>04 Operations Portal</span></div>
        <p class="p-texto" style="margin-top:4mm;max-width:160mm;font-size:6.6pt">Colección Handyx · Edición 1 · Mar del Plata, noviembre de 2026. Estado al 07/11/2026. Las pantallas son diseño propuesto con nombres y montos ficticios; ninguna cifra es un resultado si no lo dice. Fotos de Mar del Plata del fundador.</p>
      </div>
    </div>
  </div>
</section>''')

CSS = open('/tmp/claude-0/-home-user/10ab011c-6752-54be-831e-b3c4da2461d0/scratchpad/ola6/p03tools/estilo.css').read()
html = f'''<!doctype html>
<html lang="es-AR" data-pieza="especialista">
<head>
<meta charset="utf-8">
<title>Handyx · Dossier 03 · Professional App</title>
<link rel="stylesheet" href="../../plantilla/base.css">
<link rel="stylesheet" href="../../plantilla/premium.css">
<style>
{CSS}
</style>
</head>
<body>
{chr(10).join(paginas)}
<script src="../../plantilla/iso.js"></script>
<script src="../../plantilla/pieza.js"></script>
</body>
</html>
'''
open(OUT, 'w').write(html)
print(len(paginas), 'páginas')
