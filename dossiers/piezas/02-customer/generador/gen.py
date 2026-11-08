# Generador del Dossier 02 · Customer App (ola 6). Escribe dossiers/piezas/02-customer/index.html.
# Los .toque se calculan desde coordenadas de pantalla (390 × 844): left = (18 + x) / 426, top = (18 + y) / 880.
OUT = '/home/user/presentations-studio/dossiers/piezas/02-customer/index.html'
PIE = 'Handyx · Customer App'
FOTOS = '../../marca/fotos/'
PJ = '../../marca/personajes-v2/'

ALTO = 880 / 426  # alto del .movil sobre su ancho


def t(x, y, n):
    return f'<span class="toque" style="left:{(18 + x) / 426 * 100:.1f}%;top:{(18 + y) / 880 * 100:.1f}%">{n}</span>'


def movil(img, w, toques=(), alt='', clase='', estilo=''):
    tq = ''.join(t(x, y, n) for x, y, n in toques)
    return f'<div class="movil {clase}" style="--w:{w}mm;{estilo}"><div class="pant"><img src="img/{img}" alt="{alt}"></div>{tq}</div>'


def chips(*e):
    m = {'C': ('construido', 'Construido'), 'P': ('en-pruebas', 'En pruebas'), 'D': ('disenado', 'Diseñado'), 'K': ('concepto', 'Concepto')}
    out = []
    for x in e:
        k, txt = (x.split(':', 1) + [None])[:2]
        cl, base = m[k]
        out.append(f'<span class="estado {cl}">{txt or base}</span>')
    return ' '.join(out)


def zigzag(pasos, alto_pie=92, marca='f', ancho=40, sep=44.67, alto=None):
    """pasos: (img, toques, titulo, texto, estados, alt, desde) — desde = n del toque del que sale el enlace al siguiente."""
    h = ancho * ALTO
    total = alto or (alto_pie + 36)
    cel, pies, rutas = [], [], []
    for i, p in enumerate(pasos):
        img, tq, tit, txt, est, alt, desde = p
        x0 = i * sep
        cel.append(movil(img, ancho, tq, alt, estilo=f'position:absolute;left:{x0:.2f}mm;top:0'))
        pies.append(f'<div class="pie p-raya" style="left:{x0:.2f}mm;top:{alto_pie}mm;width:{ancho}mm;padding-top:3.2mm"><div class="n" style="font-size:15pt">{i + 1:02d}</div>'
                    f'<p class="p-h">{tit}</p><p class="p-texto">{txt}</p>{("<div class=\"chips\">" + est + "</div>") if est else ""}</div>')
        if desde is not None and i + 1 < len(pasos):
            tx, ty = next((ancho * (18 + a) / 426, h * (18 + b) / 880) for a, b, n in tq if n == desde)
            x_ini = x0 + tx + 3.4
            x_fin = (i + 1) * sep - 0.8
            rutas.append(f'<path d="M{x_ini:.1f} {ty:.1f} H{x_fin:.1f}"/>')
    svg = (f'<svg class="enlaces" viewBox="0 0 174 {total}" preserveAspectRatio="none"><defs><marker id="{marca}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="3.2" markerHeight="3.2" orient="auto">'
           f'<path d="M0 0 L10 5 L0 10 Z" fill="#1F57A8"/></marker></defs><g fill="none" stroke="#1F57A8" stroke-width="0.5" stroke-linecap="round" marker-end="url(#{marca})">{"".join(rutas)}</g></svg>')
    return f'<div class="zigzag" style="height:{total}mm">{"".join(cel)}{svg}{"".join(pies)}</div>'


def pagina(cab, cuerpo, clase='', estilo='', extra='', id_=''):
    idt = f' id="{id_}"' if id_ else ''
    return f'''<section class="pagina {clase}"{idt} style="{estilo}">
  <div class="lamina">{extra}
    <div class="cab-p"><span>{cab}</span><span>{PIE}</span></div>
    <div class="caja">{cuerpo}
    </div>
    <div class="pie-p"><span>{PIE}</span><b class="folio-n">00</b></div>
  </div>
</section>
'''


def origen(*partes):
    return f'<p class="p-origen empuja">{" ".join(partes)}</p>'


DIS = '<span class="rotulo diseno">Diseño propuesto · datos ficticios</span>'
PRU = '<span class="rotulo prueba">Pantalla de la PWA · datos de prueba</span>'
CORTE = 'Estado al 07/11/2026.'


def nota(n, tit, txt, est=''):
    return f'<div class="nota"><span class="num">{n}</span><div><p class="p-h">{tit}</p><p class="p-texto">{txt}</p>{("<div class=\"chips\">" + est + "</div>") if est else ""}</div></div>'


def ojo(tit, txt):
    return f'<div class="ojo"><b>{tit}</b><p>{txt}</p></div>'


def apertura(n, nombre, foto, foto_pos, iso, titulo, lead, abajo, id_, cab, alto=176):
    banda = f'''<div class="banda azul" style="height:{alto}mm">
      <img class="foto-banda" src="{foto if foto.startswith('f-') and False else ('img/' + foto if foto.startswith('f-') else FOTOS + foto)}" alt="" style="object-position:{foto_pos}">
      <div class="velo-banda"></div>
      {iso}
    </div>'''
    cuerpo = f'''
      <div class="p-azul" style="background:none"><img class="cap-img" src="img/cap-{n}.webp" alt="{n}"><span class="p-ceja" style="margin-top:6mm">{nombre}</span></div>
      <div style="margin-top:auto">
        <h1 class="p-titulo">{titulo}</h1>
        <p class="p-lead" style="margin-top:4.5mm;max-width:156mm">{lead}</p>
        {abajo}
      </div>'''
    return pagina(cab, cuerpo, extra=banda, id_=id_).replace('<div class="cab-p">', '<div class="cab-p sobre-azul">')


def en_capitulo(items):
    cols = ''.join(f'<div class="c-4 p-raya" style="padding-top:3mm"><a class="ir" data-ir="{a}"><span class="p">00</span></a><p class="p-h">{h}</p><p class="p-texto">{x}</p></div>' for a, h, x in items)
    return f'<div class="grilla" style="margin-top:8mm;column-gap:7mm">{cols}</div>'


P = []

# ---------------------------------------------------------------- 1 · TAPA
P.append(f'''<section class="pagina p-azul tapa-02">
  <div class="lamina">
    <div class="a-sangre" style="background:var(--azul);overflow:hidden">
      <img class="abs" src="{FOTOS}rambla-fuego-azul.webp" alt="" style="left:0;top:0;width:216mm;height:150mm;object-fit:cover;object-position:top;opacity:0.85">
      <div class="abs" style="left:0;top:0;width:216mm;height:152mm;background:linear-gradient(180deg,rgba(31,87,168,0.35) 0%,rgba(31,87,168,0.45) 55%,var(--azul) 100%)"></div>
      <div data-iso="maqueta" data-paleta="dia" data-pines="1" data-rotulos="1" data-solo="catedral,casino,lobos,torreon" data-tam="14" class="abs" style="left:-6mm;width:186mm;bottom:18mm"></div>
    </div>
    <img class="abs permite-salir" src="img/m-inicio-plata.webp" alt="Inicio de la app" style="right:46mm;top:118mm;width:52mm">
    <img class="abs permite-salir" src="img/m-propuestas-plata.webp" alt="Propuestas" style="right:-6mm;top:96mm;width:84mm">
    <div class="caja" style="top:15mm;left:16mm;right:16mm;bottom:14mm">
      <div class="fila entre" style="align-items:flex-start"><img src="../../marca/logo-handyx-blanco.svg" alt="Handyx" style="height:8.5mm"><div class="serie" style="color:#FFFFFF"><b>Colección Handyx · Hecho en Mar del Plata</b>Edición 1 · Noviembre de 2026</div></div>
      <div style="margin-top:22mm;max-width:150mm">
        <span class="p-ceja">Dossier 02 · Customer App</span>
        <h1 class="p-display" style="margin-top:6mm;font-size:36pt">Un problema viejo con una nueva solución que <span class="p-marca">elegís</span>.</h1>
        <p class="p-lead" style="margin-top:6mm;max-width:92mm;font-size:10.6pt">El manual de la app para quien necesita un arreglo en casa: cómo pedís, cómo comparás y elegís, qué pasa el día del trabajo y qué está hecho hoy.</p>
      </div>
      <div class="empuja p-meta" style="color:#FFFFFF;border-color:rgba(255,255,255,0.45)">
        <div><b>Ciudad</b>Mar del Plata</div><div><b>Producto</b>En pruebas · demo cerrada con invitación</div><div><b>Corte</b>Estado al 07/11/2026</div><div><b>Imágenes</b>Pantallas: diseño propuesto, datos ficticios · Foto: Rambla de Mar del Plata</div>
      </div>
    </div>
  </div>
</section>
''')

# ---------------------------------------------------------------- 2 · ÍNDICE Y CÓMO LEER
ind = [('experiencia', 'La app en una página', ''), ('cap1', 'Empezar y pedir', '01'), ('alta', 'Tu cuenta, con lo justo', ''), ('pedir', 'Pedir un arreglo', ''), ('handia', 'HandIA, tal como está hoy', ''),
       ('cap2', 'Elegir', '02'), ('propuestas', 'Las propuestas', ''), ('comparar', 'Comparar por calidad y precio', ''), ('aceptar', 'Aceptar o negociar', ''),
       ('cap3', 'El día del trabajo', '03'), ('dia', 'Del turno a la puerta', ''), ('adicional', 'Adicional, informe y conformidad', ''), ('pago', 'Pagar directo', ''), ('mensajes', 'Mensajes y avisos', ''), ('hogar', 'Mi hogar', ''),
       ('cap4', 'Una obra completa', '04'), ('obra1', 'La obra, de la propuesta a la jornada', ''), ('obra2', 'Cambios, equipo y pagos de la obra', ''),
       ('cap5', 'Confianza', '05'), ('fuga', 'Por qué conviene quedarse adentro', ''), ('dudas', 'Las preguntas difíciles', '')]
filas = ''
for a, txt, cap in ind:
    if cap:
        filas += f'<a class="ind-cap" data-ir="{a}"><span class="n">{cap}</span><span class="t">{txt}</span><span class="p">00</span></a>'
    else:
        filas += f'<a class="ind-sub" data-ir="{a}"><span class="n"></span><span class="t">{txt}</span><span class="p">00</span></a>'
P.append(pagina('Contenido', f'''
      <span class="p-ceja">Contenido</span>
      <h1 class="p-titulo" style="margin-top:5mm">El manual de la app del <span class="p-marca">vecino</span></h1>
      <div class="grilla" style="margin-top:9mm;column-gap:9mm">
        <nav class="c-7 ind">{filas}</nav>
        <div class="c-5 leer">
          <p class="p-h">Cómo leer este dossier</p>
          <p class="p-texto" style="margin-top:1.4mm">Cada función dice en qué estado está al 07/11/2026, cada pantalla de dónde sale y cada cifra qué tipo de dato es.</p>
          <p class="leer-t">Estado de cada función</p>
          <div class="def"><span class="estado construido">Construido</span><span>En la rama principal y funcionando.</span><span class="estado en-pruebas">En pruebas</span><span>Hay código, con datos de prueba o en una rama.</span><span class="estado disenado">Diseñado</span><span>Dibujado en el lienzo, todavía sin código.</span><span class="estado concepto">Concepto</span><span>Idea a futuro, sin diseño completo.</span></div>
          <p class="leer-t">Rótulo de cada pantalla</p>
          <div class="def"><span class="rotulo diseno">Diseño propuesto</span><span>Lienzo de diseño, datos ficticios.</span><span class="rotulo prueba">PWA · prueba</span><span>La app en código, datos de prueba.</span></div>
          <p class="leer-t">Puntos amarillos</p>
          <div class="def"><span class="toque-ej">1</span><span>Lo que se toca en esa pantalla; el número coincide con el paso o la nota.</span></div>
          <p class="leer-t">Tipo de cada cifra</p>
          <div class="def"><span class="tipo-dato">Decisión del fundador</span><span>Una regla decidida, con fecha.</span><span class="tipo-dato">Dato informado</span><span>Lo informa el fundador; sin auditar.</span><span class="tipo-dato">Objetivo</span><span>Una meta, no un resultado.</span></div>
        </div>
      </div>
      <div class="linea-navy empuja"><b>Handyx en una línea.</b> Un marketplace de servicios del hogar que nace en Mar del Plata: conecta a quien necesita un arreglo con especialistas de su zona, con propuestas claras para elegir por calidad y por precio. <b>Noviembre de 2026:</b> demo cerrada con invitación; lanzamiento abierto después, fecha a confirmar.</div>''', id_='indice'))

# ---------------------------------------------------------------- 3 · LA APP EN UNA PÁGINA
mom = [('i-inicio.webp', [(194, 219, 1)], 'Pedís', 'Elegís el rubro y contás qué pasa, o se lo contás a HandIA.', chips('P', 'D')),
       ('c-propuestas.webp', [(283, 529, 2)], 'Elegís', 'Llegan propuestas con precio; las comparás y aceptás una.', chips('P', 'D')),
       ('s-encamino.webp', [(192, 556, 3)], 'Seguís', 'Turno, viaje, adicionales y conformidad; pagás directo.', chips('P', 'D')),
       ('h-hogar.webp', [(285, 434, 4)], 'Cuidás tu casa', 'Historial, informes y garantías para la próxima vez.', chips('D'))]
cols = ''.join(f'<div class="col">{movil(i, 38, tq)}<div class="p-raya" style="margin-top:4mm;padding-top:2.6mm;width:38mm"><div class="p-num" style="font-size:14pt">{k + 1:02d}</div><p class="p-h" style="margin-top:1.4mm">{h}</p><p class="p-texto" style="margin-top:0.8mm">{x}</p><div class="chips">{e}</div></div></div>' for k, (i, tq, h, x, e) in enumerate(mom))
P.append(pagina('La app en una página', f'''
      <span class="p-ceja">La Customer App en una página</span>
      <h1 class="p-titulo" style="margin-top:5mm">Del problema al arreglo, en cuatro <span class="p-marca">momentos</span></h1>
      <p class="p-lead" style="margin-top:4.5mm;max-width:158mm;font-size:10.4pt">Contás qué pasa, recibís propuestas con precio y elegís vos. Pagás directo al especialista. Así resume la app su promesa; cada capítulo de este manual cuenta un tramo con sus pantallas.</p>
      <div class="fila-pant" style="margin-top:6mm">{cols}</div>
      <div class="grilla" style="margin-top:5mm;column-gap:6mm">
        <div class="c-6 hace"><p class="leer-t" style="margin-top:0">Lo que hace Handyx</p><ul><li>Arma el pedido con lo justo y lo muestra a especialistas del rubro cerca de tu zona.</li><li>Pone las propuestas en el mismo formato, en el orden en que llegan.</li><li>Registra cada paso: turno, cambios, adicionales y pagos.</li></ul></div>
        <div class="c-6 hace no"><p class="leer-t" style="margin-top:0">Lo que no hace</p><ul><li>No elige por vos ni promete tiempos de respuesta.</li><li>No comparte tu dirección exacta antes de que aceptes.</li><li>No recibe ni reparte la plata del trabajo.</li></ul></div>
      </div>
      <div class="grilla" style="margin-top:5mm;column-gap:6mm">
        <div class="c-4 p-raya" style="padding-top:3mm"><div class="p-cifra" style="font-size:22pt">6</div><p class="p-texto">rubros del hogar, con cobertura en Mar del Plata</p><div class="chips">{chips('P')}</div></div>
        <div class="c-4 p-raya" style="padding-top:3mm"><div class="p-cifra" style="font-size:22pt">0 %</div><p class="p-texto">tarifa de servicio al usuario hasta el 10/12/2026; después, 15 % en evaluación</p><div class="chips"><span class="tipo-dato">Decisión del fundador · 07/11</span></div></div>
        <div class="c-4 p-raya" style="padding-top:3mm"><div class="p-cifra" style="font-size:22pt">0 %</div><p class="p-texto">de comisión al especialista: cobra su precio entero, directo</p><div class="chips"><span class="tipo-dato">Decisión del fundador · 07/11</span></div></div>
      </div>
      {origen(DIS, CORTE, 'Pantallas del lienzo «App del usuario»; estados de la auditoría de la app (85 funciones). Precios y nombres de las pantallas son de muestra.')}''', id_='experiencia'))

# ---------------------------------------------------------------- 4 · APERTURA 01
P.append(apertura('01', 'Empezar y pedir', 'f-centro-playa.webp', 'center',
                  '<div data-iso="barrio" data-paleta="dia" data-pines="1" style="position:absolute;left:-8mm;bottom:-10mm;width:132mm"></div>',
                  'Tu cuenta con lo justo y un pedido contado con tus <span class="p-marca">palabras</span>',
                  'Para pedir alcanza con tu nombre, un celular y tu zona. Elegís el rubro, contás qué pasa y publicás: el pedido llega a especialistas de tu zona, sin tu dirección exacta.',
                  en_capitulo([('alta', 'Tu cuenta', 'Datos mínimos, zona aproximada y la tarifa antes del primer pedido.'),
                               ('pedir', 'Pedir un arreglo', 'Rubro, qué pasa, fotos si querés y revisar antes de publicar.'),
                               ('handia', 'HandIA', 'Qué es hoy el asistente y qué todavía no.')]),
                  'cap1', 'Capítulo 01'))

# ---------------------------------------------------------------- 5 · ALTA
P.append(pagina('01 · Tu cuenta', f'''
      <span class="p-ceja">Recorrido · crear la cuenta</span>
      <h1 class="p-titulo" style="margin-top:5mm">Tu cuenta, en pocos pasos y con lo <span class="p-marca">justo</span></h1>
      <p class="p-lead" style="margin-top:4.5mm;max-width:156mm;font-size:10.2pt">Sin DNI ni CUIT. Tu teléfono lo ve solo el especialista que elijas, para ese turno; los demás ven tu barrio, no tu calle.</p>
      <div style="margin-top:9mm">{zigzag([
          ('a-datos.webp', [(96, 230, 1)], 'Solo lo justo', 'Nombre, apellido y celular.', chips('P'), 'Tus datos', 1),
          ('a-zona.webp', [(190, 516, 2)], 'Tu zona, no tu calle', 'La dirección exacta se comparte recién al aceptar.', chips('P'), 'Tu zona', 2),
          ('a-casa.webp', [(191, 726, 3)], 'Tu casa, si querés', 'Ambientes y equipos, para que el próximo pedido salga armado. Se salta.', chips('D'), 'Armá tu casa', 3),
          ('a-listo.webp', [(150, 448, 4)], 'La tarifa, antes de pedir', '0 % hasta el 10/12/2026, avisado al terminar el alta.', chips('P'), 'Listo', None)], marca='fA')}</div>
      <div class="grilla" style="margin-top:6mm;column-gap:6mm">
        <div class="c-6">{ojo('Dos versiones del alta', 'En código (vista de prueba) la cuenta se crea con invitación y contraseña: es la demo cerrada. El lienzo dibuja un registro directo con un código por email o SMS. Cuál se usa al abrir el lanzamiento: a definir.')}</div>
        <div class="c-6 p-texto" style="align-self:center">También elegís qué avisos te llegan —propuestas, turno y llegada, recordatorios— y ninguno es publicidad. {chips('P')}</div>
      </div>
      {origen(DIS, CORTE, 'Lienzo «App del usuario», tableros A. Alta con invitación y avisos: código de la app sobre servidor simulado.')}''', id_='alta'))

# ---------------------------------------------------------------- 6 · PEDIR
P.append(pagina('01 · Pedir un arreglo', f'''
      <span class="p-ceja">Recorrido · pedir un arreglo</span>
      <h1 class="p-titulo" style="margin-top:5mm">Pedir un arreglo, sin <span class="p-marca">vueltas</span></h1>
      <p class="p-lead" style="margin-top:4.5mm;max-width:156mm;font-size:10.2pt">Elegís el rubro, contás qué pasa y revisás el pedido antes de publicarlo. Fotos, medidas y día son opcionales.</p>
      <div style="margin-top:9mm">{zigzag([
          ('i-inicio.webp', [(194, 219, 1)], 'Tocás un rubro', 'Seis rubros del hogar y tu próximo turno, a la vista.', chips('P'), 'Inicio', 1),
          ('p-que.webp', [(192, 167, 2)], 'Contás qué pasa', 'Una opción o tus palabras.', chips('D'), '¿Qué pasa?', 2),
          ('p-fotos.webp', [(101, 306, 3)], 'Sumás fotos', 'Marcás dónde está el problema; salen sin ubicación.', chips('D'), 'Fotos y medidas', 3),
          ('p-revisar.webp', [(191, 793, 4)], 'Revisás y publicás', 'Cuándo, dónde y fotos en una tarjeta.', chips('D'), 'Revisar y publicar', None)], marca='fP')}</div>
      <div class="etapas" style="margin-top:6mm">
        <div class="etapa"><span class="pto">1</span><p class="p-h">Publicado</p><p class="p-texto">Lo ven especialistas del rubro cerca de tu zona.</p>{chips('P')}</div>
        <div class="etapa"><span class="pto">2</span><p class="p-h">Sin tiempos prometidos</p><p class="p-texto">Te avisamos cuando llega cada propuesta.</p>{chips('P')}</div>
        <div class="etapa"><span class="pto">3</span><p class="p-h">Si nadie responde</p><p class="p-texto">Relanzás el pedido o pedís ayuda al equipo.</p>{chips('P')}</div>
        <div class="etapa"><span class="pto">4</span><p class="p-h">Precio orientativo</p><p class="p-texto">Un rango de referencia: hoy es solo diseño, sin datos para calcularlo.</p>{chips('D')}</div>
      </div>
      {origen(DIS, CORTE, 'El camino en tres toques es diseño. En código existe el pedido en pasos: urgente, programado u obra, fotos privadas, fecha y un precio propuesto opcional.')}''', id_='pedir'))

# ---------------------------------------------------------------- 7 · HANDIA
P.append(pagina('01 · HandIA', f'''
      <span class="p-ceja">HandIA y voz · estado real</span>
      <h1 class="p-titulo" style="margin-top:5mm;max-width:160mm">HandIA, tal como está <span class="p-marca">hoy</span></h1>
      <p class="p-lead" style="margin-top:4.5mm;max-width:138mm;font-size:10.2pt">Para cuando no sabés cómo se llama lo que pasa: le contás, te hace dos o tres preguntas, te avisa primero si hay un riesgo y arma la ficha del pedido para que la revises.</p>
      <div class="fila-pant" style="margin-top:8mm">
        <div class="col">{movil('i-handiachat.webp', 50, [(105, 677, 1)], 'HandIA, chat')}<p class="p-h"><span class="nn">1</span>Te pregunta lo justo</p><p class="p-texto" style="max-width:50mm">Respuestas con un toque, para que el especialista sepa qué llevar.</p></div>
        <div class="col">{movil('i-handiaficha.webp', 50, [(277, 656, 2)], 'HandIA, ficha')}<p class="p-h"><span class="nn">2</span>Arma la ficha, vos decidís</p><p class="p-texto" style="max-width:50mm">«Corregir» o «Pedir así»: nada se publica sin tu OK.</p></div>
        <div class="col">{movil('i-voz.webp', 50, [(276, 787, 3)], 'HandIA, voz')}<p class="p-h"><span class="nn">3</span>O se lo decís</p><p class="p-texto" style="max-width:50mm">Escucha en el celular; si el navegador mandaría la voz afuera, no escucha.</p></div>
      </div>
      <table class="tabla-est" style="margin-top:7mm">
        <tr><td>En la app publicada hoy (vista de prueba)</td><td>HandIA está desactivada.</td><td><span class="estado apagado">Desactivada</span></td></tr>
        <tr><td>Chat que arma el pedido</td><td>Motor de reglas que corre en tu celular, sin IA externa; está en una rama de desarrollo.</td><td>{chips('P')}</td></tr>
        <tr><td>Voz</td><td>Reconocimiento en el dispositivo. En iPhone, hoy solo lee en voz alta: no escucha.</td><td>{chips('P')}</td></tr>
        <tr><td>Pantallas nuevas (esfera de voz, ajustes)</td><td>Las de esta página.</td><td>{chips('D')}</td></tr>
        <tr><td>IA externa, cámara y búsqueda de presupuestos</td><td>Plan a futuro, solo con autorización, consentimiento en la app y revisión legal.</td><td>{chips('K')}</td></tr>
      </table>
      {origen(DIS, CORTE, 'HandIA no ve tus fotos: van al pedido, para los especialistas. Si está en la app del lanzamiento: a definir.')}''', id_='handia'))

# ---------------------------------------------------------------- 8 · APERTURA 02
P.append(apertura('02', 'Elegir', 'casino-plaza-azul.webp', 'center 60%',
                  '<div data-iso="costa" data-paleta="dia" data-pines="1" data-rotulos="1" data-solo="casino,torreon" data-tam="13" style="position:absolute;left:-10mm;bottom:-14mm;width:140mm"></div>',
                  'Propuestas con precio, una al lado de la otra, y la decisión es <span class="p-marca">tuya</span>',
                  'Cada propuesta trae el precio del especialista, la tarifa de servicio aparte, el horario y qué incluye. Las comparás, preguntás o pedís un cambio, y aceptás una sola: la versión que viste.',
                  en_capitulo([('propuestas', 'Las propuestas', 'En el orden en que llegan, con lo que el equipo verificó.'),
                               ('comparar', 'Comparar', 'Precio, fecha, materiales, garantía y perfil, lado a lado.'),
                               ('aceptar', 'Aceptar o negociar', 'Confirmar, pedir otro día o precio, o una visita antes.')]),
                  'cap2', 'Capítulo 02'))

# ---------------------------------------------------------------- 9 · PROPUESTAS
P.append(pagina('02 · Las propuestas', f'''
      <span class="p-ceja">Pantalla por pantalla</span>
      <h1 class="p-titulo" style="margin-top:5mm">Cuatro propuestas, <span class="p-marca">una decisión</span></h1>
      <div class="heroe" style="margin-top:8mm">
        {movil('c-propuestas.webp', 56, [(192, 114, 1), (299, 185, 2), (82, 478, 3), (283, 529, 4)], 'Propuestas')}
        <div class="notas">
          {nota(1, 'Un precio orientativo de referencia', 'Handyx sugiere; cada especialista pone su precio. Todavía no hay trabajos para calcularlo: es diseño.', chips('D'))}
          {nota(2, 'En el orden en que llegan', 'Sin ranking: ninguna sube por pagar. El chip «Mejor promedio» del diseño está en discusión (página siguiente).', chips('P'))}
          {nota(3, 'Identidad y antecedentes, a la vista', 'Los sellos salen del servidor: solo aparece lo que el equipo verificó.', chips('P'))}
          {nota(4, 'Aceptar pide confirmación', 'Ves el resumen antes; aceptar una cierra las demás.', chips('P'))}
        </div>
      </div>
      <div class="banda-codigo" style="margin-top:6mm">
        {movil('pwa-propuestas.webp', 38, [(117, 92, 'A'), (171, 568, 'B')], 'Propuestas en la PWA')}
        <div>
          <span class="rotulo prueba">Pantalla de la PWA · datos de prueba</span>
          <p class="p-h" style="margin-top:3mm">Lo que ya corre en código</p>
          <p class="p-texto" style="margin-top:1.2mm"><b class="pt">A</b> «Ordenadas por llegada. No es una recomendación ni un ranking.» Cada propuesta con el precio, la tarifa aparte, el horario y hasta cuándo vale.</p>
          <p class="p-texto" style="margin-top:1.2mm"><b class="pt">B</b> Si el equipo no verificó nada, la propuesta lo dice: «Todavía sin verificaciones registradas».</p>
          <p class="p-texto" style="margin-top:1.2mm">La captura es de la vista de prueba del 31/10/2026 y conserva el nombre anterior de la marca («Handy»).</p>
        </div>
      </div>
      {origen(DIS, CORTE, 'Arriba: lienzo «App del usuario» (C-Propuestas). Abajo: PWA con servidor simulado.')}''', id_='propuestas'))

# ---------------------------------------------------------------- 10 · COMPARAR
P.append(pagina('02 · Comparar', f'''
      <span class="p-ceja">Calidad y precio</span>
      <h1 class="p-titulo" style="margin-top:5mm">Comparar lo que hace a un buen <span class="p-marca">trabajo</span></h1>
      <p class="p-lead" style="margin-top:4.5mm;max-width:156mm;font-size:10.2pt">Un precio solo no alcanza. La app pone en la misma tabla el precio, la fecha, los materiales, la garantía y las verificaciones, y abre el detalle de cómo lo hace cada uno.</p>
      <div class="dos-hero" style="margin-top:8mm">
        <div>{movil('c-comparar.webp', 52, [(192, 153, 1), (142, 559, 2), (146, 653, 3)], 'Comparar')}
          <div class="notas chicas" style="margin-top:5mm">{nota(1, 'Una nota de perfil y precio', 'Mismas reglas para todas; elegís vos.', chips('D'))}{nota(2, 'Verificaciones y reseñas en fila', 'Lo verificado sale del servidor; las reseñas no tienen contrato todavía.', chips('P:Tabla en pruebas'))}{nota(3, '«Ver» abre el detalle', '')}</div></div>
        <div>{movil('c-detalle.webp', 52, [(113, 320, 4), (192, 490, 5), (115, 755, 6)], 'Detalle de la propuesta')}
          <div class="notas chicas" style="margin-top:5mm">{nota(4, 'Dentro del orientativo', 'Depende del rango de referencia: diseño.', chips('D'))}{nota(5, 'Cómo lo hace', 'Materiales, equipo, duración y si hace falta visita.', chips('D'))}{nota(6, 'La garantía, antes de aceptar', 'Quién la da y con qué texto: a definir con Legal.', chips('D'))}</div></div>
      </div>
      <div style="margin-top:6mm">{ojo('Dos reglas que chocan', 'El diseño destaca «La mejor en perfil y precio» con una nota de 0 a 10 (pesos que la pantalla no muestra); el código y el contrato dicen «sin rankings ni superlativos». Si se destaca una propuesta y si se muestran los pesos: a definir.')}</div>
      {origen(DIS, CORTE, 'Lienzo «App del usuario» (C-Comparar, C-Detalle). En código hay una tabla que no destaca ninguna (en pruebas).')}''', id_='comparar'))

# ---------------------------------------------------------------- 11 · ACEPTAR
P.append(pagina('02 · Aceptar o negociar', f'''
      <span class="p-ceja">Recorrido · contratar</span>
      <h1 class="p-titulo" style="margin-top:5mm">Aceptar, negociar o decir que no, sin <span class="p-marca">presión</span></h1>
      <p class="p-lead" style="margin-top:4.5mm;max-width:156mm;font-size:10.2pt">Antes de aceptar ves qué va a pasar: quién recibe tu dirección, qué se cierra y cómo se paga. Si algo no te cierra, pedís un cambio: vale lo anterior hasta que aceptes lo nuevo.</p>
      <div style="margin-top:9mm">{zigzag([
          ('c-aceptar.webp', [(135, 474, 1), (190, 656, 2)], 'Aceptás la que viste', 'Si la propuesta cambió, no se acepta sin que la veas.', chips('P'), 'Aceptar', 2),
          ('c-aceptada.webp', [(195, 726, 3)], 'Turno confirmado', 'Las demás se cierran sin dar motivos.', chips('P:Aceptar en pruebas', 'D:Pantalla'), 'Turno confirmado', None),
          ('c-cambios.webp', [(192, 288, 4)], 'O pedís un cambio', 'Otro día, otro precio o que incluya materiales.', chips('P'), 'Pedir un cambio', None),
          ('c-visita.webp', [(192, 260, 5)], 'O una visita antes', 'Si hay que ver el problema: qué cuesta y qué se define.', chips('D'), 'Visita para presupuestar', None)], marca='fC')}</div>
      <div class="grilla" style="margin-top:6mm;column-gap:6mm">
        <div class="c-6 p-texto"><b class="pt">1</b> Al aceptar, el especialista elegido ve tu dirección exacta y tu teléfono, solo para ese turno. También podés rechazar: en el diseño, con un motivo opcional que el especialista no ve. {chips('P')}</div>
        <div class="c-6 p-texto">Las propuestas urgentes vencen a los 5 minutos y el servidor aplica los vencimientos: así nadie acepta un precio viejo. {chips('P')}</div>
      </div>
      {origen(DIS, CORTE, 'Lienzo «App del usuario», tableros C. Aceptar, rechazar y pedir cambios: código y contrato en una rama.')}''', id_='aceptar'))

# ---------------------------------------------------------------- 12 · APERTURA 03
P.append(apertura('03', 'El día del trabajo', 'f-rambla.webp', 'center',
                  '<div data-iso="barrio" data-paleta="dia" data-pines="1" data-semilla="5" style="position:absolute;left:-8mm;bottom:-10mm;width:128mm"></div>',
                  'Sabés quién viene, aprobás cada cambio y pagás <span class="p-marca">directo</span>',
                  'El trabajo pasa por estados que ves en la app. Nada se suma sin tu OK, el informe guarda qué se hizo y la plata va directo al especialista: Handyx no la recibe.',
                  en_capitulo([('dia', 'Del turno a la puerta', 'Agendado, en camino, llegó y trabajando.'),
                               ('adicional', 'Adicional y conformidad', 'Lo extra se aprueba; al final das el OK o avisás un problema.'),
                               ('pago', 'Pagar directo', 'Informado no es verificado.')]),
                  'cap3', 'Capítulo 03'))

# ---------------------------------------------------------------- 13 · DÍA
P.append(pagina('03 · Del turno a la puerta', f'''
      <span class="p-ceja">Recorrido · el día del turno</span>
      <h1 class="p-titulo" style="margin-top:5mm">Del turno a la puerta, <span class="p-marca">paso a paso</span></h1>
      <p class="p-lead" style="margin-top:4.5mm;max-width:156mm;font-size:10.2pt">Agendado, en camino, llegó, trabajando, terminado: cada cambio de estado queda en el historial del trabajo.</p>
      <div style="margin-top:9mm">{zigzag([
          ('s-agendado.webp', [(110, 352, 1)], 'Tu turno', 'Quién viene, cuándo y por cuánto; podés cambiarlo o cancelarlo.', chips('P'), 'Tu turno', 1),
          ('s-encamino.webp', [(192, 556, 2)], 'En camino', 'Lo ves venir solo mientras comparte el viaje; la llegada la calcula el servidor.', chips('P'), 'En camino', 2),
          ('s-llego.webp', [(192, 365, 3)], 'Llegó', 'El diseño suma un código para abrir la puerta.', chips('D'), 'Llegó', 3),
          ('s-trabajando.webp', [(191, 452, 4)], 'Trabajando', 'Avances del especialista y, si hace falta, un adicional.', chips('P'), 'Trabajando', None)], marca='fS')}</div>
      <p class="leer-t" style="margin-top:4mm">Los estados del trabajo, en el servidor</p>
      <div class="etapas">
        <div class="etapa"><span class="pto">1</span><p class="p-h">Agendado</p><p class="p-texto">Turno aceptado.</p></div>
        <div class="etapa"><span class="pto">2</span><p class="p-h">En camino</p><p class="p-texto">Sale para tu casa.</p></div>
        <div class="etapa"><span class="pto">3</span><p class="p-h">En sitio</p><p class="p-texto">«Llegué», lo marca el especialista.</p></div>
        <div class="etapa"><span class="pto">4</span><p class="p-h">En curso</p><p class="p-texto">Trabajando.</p></div>
        <div class="etapa"><span class="pto">5</span><p class="p-h">Terminado</p><p class="p-texto">Lo marca el especialista.</p></div>
        <div class="etapa"><span class="pto">6</span><p class="p-h">Finalizado</p><p class="p-texto">Con tu conformidad.</p>{chips('P')}</div>
      </div>
      <div class="grilla" style="margin-top:4mm;column-gap:6mm">
        <div class="c-6">{ojo('Cómo se marca la llegada', 'Tres versiones: en el servidor la marca el especialista («Llegué»); el lienzo suma un código de 4 números; la demo de la landing usa una geocerca simulada. Cuál queda: a definir.')}</div>
        <div class="c-6 p-texto" style="align-self:center">El viaje en vivo existe en una rama de desarrollo, con mapa propio y sin terceros; la vista de prueba publicada todavía no lo tiene. El mapa se apaga cuando el especialista llega. {chips('P')}</div>
      </div>
      {origen(DIS, CORTE, 'Lienzo «App del usuario», tableros S. Estados del trabajo: máquina de estados del servidor (rama).')}''', id_='dia'))

# ---------------------------------------------------------------- 14 · ADICIONAL / INFORME / CONFORMIDAD
tri = [('s-adicional.webp', [(191, 596, 1), (191, 790, 2)], 'Adicional', [(1, 'Ves el total si lo aprobás', 'Repuesto o tarea extra con precio y motivo.', chips('P')), (2, 'Aprobar, preguntar o no', 'Vale lo acordado hasta que lo aprobás. Foto y «Preguntar»: diseño.', '')]),
       ('s-informe.webp', [(207, 113, 3)], 'Informe', [(3, 'Informe con garantía', 'Qué encontró, pruebas, materiales y hasta cuándo cubre. Queda en Mi hogar.', chips('D'))]),
       ('s-conformidad.webp', [(191, 726, 4), (191, 793, 5)], 'Conformidad', [(4, 'Conformidad en un toque', 'Confirmás que terminó.', chips('P')), (5, 'O avisás un problema', 'El trabajo vuelve a «en curso»; podés abrir un reclamo.', chips('P'))])]
cols = ''.join(f'<div class="col">{movil(i, 52, tq, alt)}<div class="notas chicas" style="margin-top:5mm;width:52mm">{"".join(nota(*n) for n in ns)}</div></div>' for i, tq, alt, ns in tri)
P.append(pagina('03 · Adicional y conformidad', f'''
      <span class="p-ceja">Antes de pagar</span>
      <h1 class="p-titulo" style="margin-top:5mm">Nada se suma sin tu <span class="p-marca">OK</span></h1>
      <p class="p-lead" style="margin-top:4.5mm;max-width:156mm;font-size:10.2pt">Si aparece un repuesto o una tarea extra, llega con su precio y su motivo. Al terminar, el informe guarda qué se hizo y vos das la conformidad o avisás que hay un problema.</p>
      <div class="fila-pant" style="margin-top:8mm">{cols}</div>
      {origen(DIS, CORTE, 'Lienzo «App del usuario» (S-Adicional, S-Informe, S-Conformidad). Quién da la garantía y su texto: a definir con Legal.')}''', id_='adicional'))

# ---------------------------------------------------------------- 15 · PAGO
P.append(pagina('03 · Pagar directo', f'''
      <span class="p-ceja">Recorrido · el pago</span>
      <h1 class="p-titulo" style="margin-top:5mm">Pagás directo. Informado no es <span class="p-marca">verificado</span></h1>
      <p class="p-lead" style="margin-top:4.5mm;max-width:156mm;font-size:10.2pt">La plata va del vecino al especialista. Handyx no la recibe ni la reparte: registra el pago y no lo da por hecho hasta verificarlo.</p>
      <div style="margin-top:9mm">{zigzag([
          ('pwa-pago-metodo.webp', [(192, 412, 1)], 'Elegís cómo pagás', 'Hoy, efectivo; Mercado Pago, cuando se valide la integración.', chips('P'), 'Pago al especialista', 1),
          ('s-pagoinformado.webp', [(152, 315, 2)], 'Queda informado', 'Avisás que pagaste; todavía no está verificado.', chips('P'), 'Pago informado', 2),
          ('x-pagos.webp', [(129, 226, 3)], 'Tus pagos', 'Informados y verificados, separados. No se guardan tarjetas.', chips('P'), 'Pagos registrados', 3),
          ('s-resena.webp', [(191, 440, 4)], 'Una reseña, si querés', 'Estrellas y un comentario sin datos personales.', chips('P:En pruebas · sin backend'), 'Reseña', None)], marca='fG')}</div>
      <p class="leer-t" style="margin-top:4mm">El camino de un pago</p>
      <div class="etapas">
        <div class="etapa"><span class="pto">1</span><p class="p-h">Pagás directo</p><p class="p-texto">En mano o en el cobro del especialista; Handyx no recibe la plata.</p></div>
        <div class="etapa"><span class="pto">2</span><p class="p-h">Informado</p><p class="p-texto">Queda registrado, sin darlo por hecho.</p></div>
        <div class="etapa"><span class="pto">3</span><p class="p-h">Verificado</p><p class="p-texto">Recién ahí cuenta como pagado. Quién verifica el efectivo: a definir.</p>{chips('P')}</div>
      </div>
      <div class="grilla" style="margin-top:4mm;column-gap:6mm">
        <div class="c-6">{ojo('¿Quién verifica un pago en efectivo?', 'El lienzo dice que queda verificado cuando el especialista lo confirma. El servidor dice que verifica el proveedor de pago u Operations. Y el lienzo muestra Mercado Pago «Se verifica solo», con la integración hoy cerrada. A definir.')}</div>
        <div class="c-6 p-texto" style="align-self:center">Volver a la app desde el cobro de Mercado Pago no confirma nada: la app consulta el estado real del pago. Tarifa de servicio: 0 % hasta el 10/12/2026. {chips('P')}</div>
      </div>
      {origen(PRU, DIS, CORTE, 'Paso 1: PWA con servidor simulado (captura del 31/10/2026, nombre anterior de la marca). Pasos 2 a 4: lienzo.')}''', id_='pago'))

# ---------------------------------------------------------------- 16 · MENSAJES
tri = [('m-mensajes.webp', [(191, 273, 1)], 'Mensajes', [(1, 'Un chat por pedido u obra', 'Nadie te puede escribir por fuera de un pedido.', chips('P'))]),
       ('m-chat.webp', [(243, 447, 2), (243, 695, 3)], 'Chat con tarjetas', [(2, 'La propuesta, dentro del hilo', 'Se acepta ahí mismo y queda en el pedido.', chips('P')), (3, 'Otro horario, como tarjeta', 'Presupuestos por ítem, repuestos y fechas, igual.', chips('D'))]),
       ('i-avisos.webp', [(191, 129, 4)], 'Avisos', [(4, 'Avisos que llevan al detalle', 'Nunca aceptan ni pagan por vos.', chips('P'))])]
cols = ''.join(f'<div class="col">{movil(i, 52, tq, alt)}<div class="notas chicas" style="margin-top:5mm;width:52mm">{"".join(nota(*n) for n in ns)}</div></div>' for i, tq, alt, ns in tri)
P.append(pagina('03 · Mensajes y avisos', f'''
      <span class="p-ceja">Comunicación</span>
      <h1 class="p-titulo" style="margin-top:5mm">Todo lo acordado, por <span class="p-marca">escrito</span></h1>
      <p class="p-lead" style="margin-top:4.5mm;max-width:156mm;font-size:10.2pt">Cada pedido tiene su chat y cada pendiente su aviso. Si algo se complica, Soporte de Handyx te responde con una persona del equipo.</p>
      <div class="fila-pant" style="margin-top:8mm">{cols}</div>
      <p class="p-texto" style="margin-top:5mm;max-width:170mm">Soporte por chat: pantalla en una rama, sobre servidor simulado; cómo llega cada consulta al equipo, a definir. {chips('P')} Seleccionar mensajes y sumar al chat una foto anotada o una medida (sin ubicación ni datos del teléfono): diseño. {chips('D')}</p>
      {origen(DIS, CORTE, 'Lienzo «App del usuario», tableros M e I. Chats por pedido y avisos: código de la app sobre servidor simulado.')}''', id_='mensajes'))

# ---------------------------------------------------------------- 17 · MI HOGAR
tri = [('h-hogar.webp', [(285, 279, 1), (285, 434, 2)], 'Mi hogar', [(1, 'Algo se rompió', 'Elegís dónde y qué falla; el pedido sale con los datos de tu casa.', ''), (2, 'Historial y garantías', 'Todo lo que se hizo, con sus informes.', '')]),
       ('h-historial.webp', [(191, 200, 3)], 'Historial', [(3, 'El historial es tuyo', 'Trabajos, informes y pagos; lo descargás o lo borrás desde Privacidad.', '')]),
       ('h-garantias.webp', [(190, 301, 4)], 'Garantías', [(4, 'Hasta cuándo cubre', 'Si algo falla dentro de la garantía, escribís al especialista desde el informe o a Soporte.', '')])]
cols = ''.join(f'<div class="col">{movil(i, 52, tq, alt)}<div class="notas chicas" style="margin-top:5mm;width:52mm">{"".join(nota(*n) for n in ns)}</div></div>' for i, tq, alt, ns in tri)
P.append(pagina('03 · Mi hogar', f'''
      <span class="p-ceja">Después del arreglo</span>
      <h1 class="p-titulo" style="margin-top:5mm;max-width:140mm">Lo que se hizo queda para la <span class="p-marca">próxima vez</span></h1>
      <p class="p-lead" style="margin-top:4.5mm;max-width:140mm;font-size:10.2pt">Mi hogar es la ficha privada de tu casa: ambientes, equipos, informes y garantías. Compartís solo lo que elegís, solo para un pedido, y se deja de compartir al terminar.</p>
      <div class="fila-pant" style="margin-top:8mm">{cols}</div>
      <p class="p-texto" style="margin-top:5mm">Todo Mi hogar es diseño y pide un contrato de datos nuevo. {chips('D')} Hoy, en código, hay historial de pedidos y trabajos, no de la casa. {chips('P')} Modelo 3D del ambiente y beneficios del Camino del hogar: {chips('K')}</p>
      {origen(DIS, CORTE, 'Lienzo «App del usuario», tableros H.')}''', id_='hogar'))

# ---------------------------------------------------------------- 18 · APERTURA 04 · OBRA
et = [('1', 'Te proponen la obra', 'Días, etapas y a quién le pagás cada una.', chips('D')), ('2', 'La aprobás', 'O pedís cambios.', chips('D')),
      ('3', 'Seguís cada jornada', 'Quién viene, avance y materiales.', chips('D')), ('4', 'Aprobás repuestos', 'Con el precio y la foto del ticket.', chips('D')),
      ('5', 'Confirmás cada etapa', 'Terminada, con sus fotos.', chips('P')), ('6', 'Pagás cada etapa', 'Directo a quien la hizo.', chips('P')), ('7', 'Ves lo gastado', 'Informado y verificado, aparte.', chips('D'))]
etapas = ''.join(f'<div class="etapa"><span class="pto">{a}</span><p class="p-h">{b}</p><p class="p-texto">{c}</p>{d}</div>' for a, b, c, d in et)
P.append(apertura('04', 'Una obra completa', 'f-faro-mogotes.webp', 'center',
                  '<div data-iso="barrio" data-paleta="dia" data-pines="1" data-semilla="8" style="position:absolute;left:-8mm;bottom:-10mm;width:128mm"></div>',
                  'Un baño completo, etapa por etapa y sin perder el control del <span class="p-marca">gasto</span>',
                  'Una obra de varios días se divide en etapas con días, responsables y montos. Repuestos y cambios de fecha llegan para aprobar, y cada etapa se paga directo a quien la hizo.',
                  f'<div class="etapas etapas-7" style="margin-top:8mm">{etapas}</div>', 'cap4', 'Capítulo 04', alto=164))

# ---------------------------------------------------------------- 19 · OBRA 1
P.append(pagina('04 · La obra, de punta a punta', f'''
      <span class="p-ceja">Recorrido · una obra · 1 de 2</span>
      <h1 class="p-titulo" style="margin-top:5mm;max-width:145mm">De la propuesta a la <span class="p-marca">jornada</span></h1>
      <div style="margin-top:7mm">{zigzag([
          ('o-propuesta.webp', [(195, 309, 1), (195, 726, 2)], 'La propuesta de obra', 'Total, días, etapas y quién hace cada una.', chips('D'), 'Propuesta de obra', 2),
          ('o-obra.webp', [(192, 177, 3), (192, 566, 4)], 'Tu obra', 'Día a día, lo pagado y lo que falta.', chips('D'), 'Tu obra', 4),
          ('o-dia.webp', [(192, 502, 5)], 'Una jornada', 'Quién vino, el avance con fotos y los materiales de hoy.', chips('D'), 'Una jornada', 5),
          ('o-repuesto.webp', [(191, 354, 6), (191, 735, 7)], 'Un repuesto', 'Precio y foto del ticket; nada se suma sin tu OK.', chips('D'), 'Repuesto', None)], marca='fO', alto=121)}</div>
      <div class="banda-codigo" style="margin-top:3mm;padding:3.5mm 6mm">
        {movil('pwa-seguimiento.webp', 38, [(106, 733, 'A')], 'Obra por etapas en la PWA')}
        <div>
          <span class="rotulo prueba">Pantalla de la PWA · datos de prueba</span>
          <p class="p-h" style="margin-top:3mm">La obra por etapas ya corre en código</p>
          <p class="p-texto" style="margin-top:1.2mm">Lo acordado, las etapas con su monto y <b class="pt">A</b> la etapa que falta confirmar. Confirmás cada etapa terminada y la pagás directo. {chips('P')}</p>
          <p class="p-texto" style="margin-top:1.2mm">La propuesta con equipo, las jornadas, los repuestos y el chat grupal son diseño y piden obras en equipo en el contrato de datos. {chips('D')}</p>
          </div>
      </div>
      {origen(DIS, CORTE, 'Lienzo «App del usuario», tableros O; montos y nombres de muestra. PWA: captura del 31/10/2026, con el nombre anterior de la marca.')}''', id_='obra1'))

# ---------------------------------------------------------------- 20 · OBRA 2
P.append(pagina('04 · La obra, de punta a punta', f'''
      <span class="p-ceja">Recorrido · una obra · 2 de 2</span>
      <h1 class="p-titulo" style="margin-top:5mm">Cambios, equipo y pagos de la <span class="p-marca">obra</span></h1>
      <div style="margin-top:9mm">{zigzag([
          ('o-fecha.webp', [(191, 291, 1), (191, 726, 2)], 'Mover una jornada', 'Solo esa o todas las que siguen; vale la fecha anterior hasta acordar.', chips('D'), 'Cambio de fecha', 2),
          ('o-grupo.webp', [(289, 431, 3)], 'El chat de la obra', 'Todo el equipo en un grupo; nadie ve tu celular.', chips('D'), 'Chat de la obra', 3),
          ('o-pagos.webp', [(165, 242, 4), (191, 793, 5)], 'Pagos por etapa', 'A cada uno, directo; el reparto lo acordó el equipo.', chips('P', 'D:Equipo'), 'Pagos de la obra', 5),
          ('o-gastado.webp', [(192, 190, 6)], 'Lo gastado', 'Etapas y repuestos; el resumen queda en Mi hogar.', chips('D'), 'Lo gastado', None)], marca='fO2')}</div>
      <div class="flujo-img" style="margin-top:5mm"><img src="img/fl-obra.webp" alt="Flujo de una obra de varios días"></div>
      {origen(DIS, CORTE, 'Lienzo «App del usuario»: tableros O y flujo FL-Obra (recorrido RC-Obra). Cada profesional ve tu dirección exacta solo los días que trabaja.')}''', id_='obra2'))

# ---------------------------------------------------------------- 21 · CONFIANZA · VERIFICADO
banda21 = f'''<div class="banda azul" style="height:66mm"><img class="foto-banda" src="img/f-puerto-sur.webp" alt="" style="width:120mm;object-position:center"><div class="velo-banda"></div></div>'''
P.append(pagina('Capítulo 05 · Confianza', f'''
      <div class="p-azul" style="background:none;display:flex;align-items:flex-end;gap:6mm;margin-top:-6mm"><img class="cap-img" src="img/cap-05.webp" alt="05" style="height:16mm"><div><span class="p-ceja">Confianza</span><h1 class="p-titulo" style="margin-top:3mm;font-size:22pt;color:#fff">Cómo ves que está verificado</h1></div></div>
      <div class="heroe" style="margin-top:20mm">
        {movil('c-certificados.webp', 58, [(197, 231, 1), (306, 408, 2), (306, 491, 3), (309, 582, 4)], 'Perfil del especialista')}
        <div class="notas">
          {nota(1, 'El sello lo pone el equipo', 'Solo Operations verifica. El especialista no puede marcarse verificado.', chips('P'))}
          {nota(2, 'Identidad, con fecha', 'Cada verificación dice cuándo se hizo.', chips('P'))}
          {nota(3, 'Antecedentes, revisados por el equipo', 'Nunca se muestran como archivo. Cómo se revisan (en persona o por documento): a definir.', chips('P'))}
          {nota(4, '«Cargado» no es «verificado»', 'Lo que el especialista subió sin revisión queda marcado como cargado.', chips('D'))}
        </div>
      </div>
      <div class="etapas" style="margin-top:9mm">
        <div class="etapa"><span class="pto">1</span><p class="p-h">El especialista se anota</p><p class="p-texto">Datos, rubros y zonas.</p></div>
        <div class="etapa"><span class="pto">2</span><p class="p-h">Carga documentos</p><p class="p-texto">Cargar no es estar verificado.</p></div>
        <div class="etapa"><span class="pto">3</span><p class="p-h">El equipo revisa</p><p class="p-texto">Identidad y antecedentes.</p></div>
        <div class="etapa"><span class="pto">4</span><p class="p-h">Vos ves el sello</p><p class="p-texto">Sale del servidor, en la propuesta y el perfil.</p>{chips('P')}</div>
      </div>
      <p class="p-texto" style="margin-top:5mm">Todavía no hay especialistas verificados ni reseñas reales: los 56 especialistas del preregistro están <b>registrados</b>, anotados por el fundador fuera de la landing, en una planilla propia y con su consentimiento <span class="tipo-dato">Dato informado por el fundador · sin auditar</span>. El alta y la verificación del especialista, en el Dossier 03.</p>
      {origen(DIS, CORTE, 'Lienzo «App del usuario» (C-Certificados). Sellos: contrato de datos en una rama («solo lo que Operations verificó»).')}''', id_='cap5', extra=banda21).replace('<div class="cab-p">', '<div class="cab-p sobre-azul">'))

# ---------------------------------------------------------------- 22 · ANTI-FUGA
mec = [('Propuestas comparables en un solo lugar', 'Precio, tarifa aparte, fecha y qué incluye, en el mismo formato.', 'P'),
       ('Chats atados al pedido', 'Coordinás sin dar tu número antes de elegir; nadie te escribe por fuera.', 'P'),
       ('Dirección exacta solo al aceptar', 'Antes, los especialistas ven tu zona aproximada.', 'P'),
       ('Lo acordado, por escrito', 'Cambios y adicionales quedan pendientes hasta tu OK.', 'P'),
       ('Pagos registrados', 'Informado y verificado, separados, en tu historial.', 'P'),
       ('Reclamos con seguimiento', 'Abrís un reclamo de un pedido o trabajo y ves su estado.', 'P'),
       ('Reseñas de trabajos terminados', 'En la vista de prueba de una rama, sin servidor todavía.', 'P'),
       ('Informe con garantía registrada', 'Qué se hizo y hasta cuándo cubre; queda en Mi hogar.', 'D'),
       ('Historial de tu casa', 'Pedir otra vez sin explicar todo de nuevo.', 'D'),
       ('Obra en equipo sin tu celular', 'Varios oficios en un grupo; nadie ve tu número.', 'D')]
filas = ''.join(f'<tr><td><b>{a}</b></td><td>{b}</td><td>{chips(c)}</td></tr>' for a, b, c in mec)
filas += f'<tr><td><b>Sin comisión al especialista</b></td><td>Cobra su precio entero; al vecino, 0 % hasta el 10/12/2026.</td><td><span class="tipo-dato">Decisión del fundador</span></td></tr>'
P.append(pagina('05 · Quedarse adentro', f'''
      <span class="p-ceja">Cómo evitamos que se fuguen · desde el vecino</span>
      <h1 class="p-titulo" style="margin-top:5mm">Por qué conviene quedarse adentro de <span class="p-marca">Handyx</span></h1>
      <div class="grilla" style="margin-top:7mm;column-gap:8mm">
        <div class="c-5">
          <p class="respuesta">Nada lo impide del todo: arreglarse por fuera es un riesgo y lo medimos.</p>
          <p class="p-texto" style="margin-top:3mm;font-size:8.6pt">La respuesta no es prohibir: es que adentro valga más. Fuera de Handyx, el vecino pierde las propuestas comparables, lo acordado por escrito, el registro del pago, la garantía, el reclamo con seguimiento y el historial de su casa.</p>
          <div style="margin-top:6mm">{movil('h-compartir.webp', 46, [(344, 396, 1)], 'Qué compartís')}</div>
          <p class="p-texto" style="margin-top:3mm;max-width:58mm"><b class="pt">1</b> Vos decidís qué datos de tu casa ve cada especialista, y solo para ese pedido. {chips('D')}</p>
        </div>
        <div class="c-7">
          <table class="tabla-est fuga"><tr><th>Lo que hay adentro</th><th>Para qué te sirve</th><th>Estado</th></tr>{filas}</table>
          <div class="mide"><p class="leer-t" style="margin-top:0">Cómo lo medimos</p><p class="p-texto">Como repetición dentro de Handyx: vecinos que vuelven a pedir por la app. Meta del piloto: <b>5 clientes que vuelven a contratar</b> en diciembre de 2026 <span class="tipo-dato">Objetivo</span>. Todavía no hay datos.</p></div>
        </div>
      </div>
      {origen(DIS, CORTE, 'Estados: auditoría de la app del usuario. Respuesta: preguntas difíciles del proyecto.')}''', id_='fuga'))

# ---------------------------------------------------------------- 23 · DUDAS
D = [('¿Y si el trabajo sale mal?', 'Lo avisás desde la app y queda registrado.', 'En la conformidad tocás «Hay un problema» y el trabajo vuelve a «en curso»; podés abrir un reclamo y seguirlo. El especialista responde por su trabajo. Quién da la garantía y con qué texto: a definir con Legal.', chips('P:Conformidad y reclamos', 'D:Garantía')),
     ('¿Y si no viene?', 'Se paga al terminar: no adelantás nada.', 'Ves el estado del turno y, en la rama de desarrollo, el viaje en vivo. Podés cambiar el turno, cancelarlo, escribir a Soporte o abrir un reclamo. Qué pasa con un especialista que falta: a definir.', chips('P')),
     ('¿Pago más por usar Handyx?', 'Hasta el 10/12/2026, no: la tarifa es 0 %.', 'Después, 15 %, en evaluación. La tarifa va aparte del precio del especialista y la ves antes de aceptar; la app avisa antes de cualquier cambio. Al especialista no se le cobra comisión.', '<span class="tipo-dato">Decisión del fundador · 07/11/2026</span> ' + chips('P:Aviso en la app')),
     ('¿Quién ve mi dirección y mis datos?', 'Tu dirección exacta, solo quien aceptás.', 'Antes, los especialistas ven tu zona aproximada. Sin DNI ni CUIT. Tu teléfono, solo el elegido y para ese turno. Desde Privacidad borrás la cuenta y se te informa qué queda por ley.', chips('P')),
     ('¿Cómo sé que está verificado?', 'El sello sale del servidor, no del especialista.', 'Solo aparece lo que verificó el equipo, con fecha; lo cargado sin revisar se marca así. Hoy no hay especialistas verificados: los anotados están registrados.', chips('P:Sellos', 'D:Perfil')),
     ('¿Qué pasa con mi plata?', 'Va directo al especialista; Handyx no la toca.', 'Hoy, efectivo, que informás en la app; Mercado Pago, cuando se valide la integración. Un pago informado no se da por verificado y no se guardan tarjetas.', chips('P:Efectivo', 'P:Mercado Pago, cerrado')),
     ('¿Y si al final me cobra otra cosa?', 'Nada se suma sin tu OK.', 'Un adicional llega con precio y motivo, y ves el total si lo aprobás. Podés aprobar, preguntar o no aceptar; vale lo acordado hasta tu OK.', chips('P')),
     ('¿HandIA es una inteligencia artificial?', 'Hoy no: es un asistente de reglas en tu celular.', 'Arma el pedido sin IA externa, está en una rama y en la app publicada está desactivada. Sumar IA externa es un plan que pide autorización, consentimiento y revisión legal.', chips('P', 'K:IA externa'))]
cards = ''.join(f'<div class="c-6 duda"><p class="q">{q}</p><p class="corta">{c}</p><p class="larga">{l}</p><p class="hoy"><b>Hoy</b>{h}</p></div>' for q, c, l, h in D)
P.append(pagina('05 · Preguntas difíciles', f'''
      <span class="p-ceja">Lo que nos preguntan sin vueltas</span>
      <h1 class="p-titulo" style="margin-top:5mm">Las preguntas <span class="p-marca">incómodas</span></h1>
      <div class="grilla dudas-02" style="margin-top:7mm">{cards}</div>
      {origen(CORTE, 'Respuestas con lo que existe hoy; lo que no está decidido dice «a definir».')}''', estilo='--fondo:var(--hueso)', id_='dudas'))

# ---------------------------------------------------------------- 24 · CONTRATAPA
P.append(f'''<section class="pagina p-azul contra-02" id="contratapa">
  <div class="lamina">
    <div class="a-sangre" style="background:var(--azul);overflow:hidden">
      <img class="abs" src="{FOTOS}casino-plaza-azul.webp" alt="" style="left:0;top:0;width:216mm;height:132mm;object-fit:cover;object-position:center 35%;opacity:0.8">
      <div class="abs" style="left:0;top:0;width:216mm;height:134mm;background:linear-gradient(180deg,rgba(31,87,168,0.2) 0%,rgba(31,87,168,0.6) 60%,var(--azul) 100%)"></div>
    </div>
    <div class="caja" style="top:16mm;left:18mm;right:18mm;bottom:14mm">
      <img src="../../marca/logo-handyx-blanco.svg" alt="Handyx" style="height:9mm;align-self:flex-start">
      <p class="p-display" style="margin-top:22mm;font-size:30pt;max-width:140mm">Un problema viejo con una nueva solución que <span class="p-marca">elegís</span>.</p>
      <div class="cq" style="margin-top:auto">
        <span class="p-ceja">Conocé el proyecto completo</span>
        <div class="fila" style="margin-top:6mm;gap:7mm;align-items:center">
          <div class="qr" style="--w:34mm"><img src="../../marca/qr-hub.svg" alt="Código QR a landing.handyc.com/handyx"></div>
          <div><p class="p-lead" style="color:#fff;font-size:10.6pt;max-width:96mm">La landing con la demo interactiva, los cuatro dossiers y el portafolio del fundador, en un solo lugar.</p>
          <p style="margin-top:2mm;font:800 10pt/1 var(--f-texto);color:#fff"><a href="https://landing.handyc.com/handyx/">landing.handyc.com/handyx</a></p></div>
        </div>
        <div class="contacto-02" style="margin-top:10mm">
          <div><span>Contacto</span>Ignacio Gauna, fundador</div>
          <div><span>Email</span><a href="mailto:ignaciogauna.developer@gmail.com">ignaciogauna.developer@gmail.com</a></div>
          <div><span>Teléfono</span><a href="tel:+5492236674044">223 667-4044</a></div>
          <div><span>Web</span><a href="https://landing.handyc.com/">landing.handyc.com</a></div>
        </div>
        <div class="coleccion" style="margin-top:9mm;color:#fff"><span>Tríptico</span><span>01 Business &amp; Investment</span><span class="actual">02 Customer App</span><span>03 Professional App</span><span>04 Operations Portal</span></div>
        <p class="p-texto" style="margin-top:5mm;color:rgba(255,255,255,0.75);font-size:6.8pt">Colección Handyx · Edición 1 · Mar del Plata, noviembre de 2026. Estado al 07/11/2026. Las pantallas usan datos de prueba o de muestra; las cifras llevan su tipo y su fuente. Fotos: Mar del Plata, archivo del fundador.</p>
      </div>
    </div>
  </div>
</section>
''')

CSS = open('/tmp/claude-0/-home-user/10ab011c-6752-54be-831e-b3c4da2461d0/scratchpad/ola6/c02/estilo.css').read()
html = f'''<!doctype html>
<html lang="es-AR" data-pieza="usuario">
<head>
<meta charset="utf-8">
<title>Handyx · Dossier 02 · Customer App</title>
<link rel="stylesheet" href="../../plantilla/base.css">
<link rel="stylesheet" href="../../plantilla/premium.css">
<style>
{CSS}
</style>
</head>
<body>
{"".join(P)}
<script src="../../plantilla/iso.js"></script>
<script src="../../plantilla/pieza.js"></script>
</body>
</html>
'''
open(OUT, 'w').write(html)
print(len(P), 'páginas')
