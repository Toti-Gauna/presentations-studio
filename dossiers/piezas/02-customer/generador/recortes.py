# Recortes ampliados para los despieces del Dossier 02 (ola 7). Lee las capturas del lienzo (1170 px de ancho) y de la
# PWA (780 px) y escribe img/dz-*.webp (q 94). Suma cada recorte a imagenes.json con su origen y su caja.
# Uso: python3 -I recortes.py <carpeta S/capturas> <carpeta de la pieza>
import json, os, sys
from PIL import Image

CAP, PIEZA = sys.argv[1], sys.argv[2]
PWA = os.path.join(PIEZA, '../../../brands/handyx/assets/capturas')
R = {
    # 01 · pedir (I-Inicio + P-*)
    'dz-rubros': ('usuario/I-Inicio.png', (10, 548, 1160, 1140)),
    'dz-quepasa': ('usuario/P-Que.png', (30, 170, 1150, 1000)),
    'dz-fotos': ('usuario/P-Fotos.png', (30, 470, 1150, 1010)),
    'dz-pedido': ('usuario/P-Revisar.png', (30, 195, 1150, 605)),
    'dz-orientativo2': ('usuario/P-Revisar.png', (30, 1465, 1150, 1930)),
    # 02 · propuestas y comparar
    'dz-orientativo': ('usuario/C-Propuestas.png', (30, 200, 1140, 478)),
    'dz-precio': ('usuario/C-Propuestas.png', (70, 845, 1100, 1140)),
    'dz-sellos': ('usuario/C-Propuestas.png', (60, 1352, 800, 1468)),
    'dz-botones': ('usuario/C-Propuestas.png', (60, 1478, 1110, 1655)),
    'dz-mejor': ('usuario/C-Comparar.png', (30, 200, 1140, 728)),
    'dz-tabla': ('usuario/C-Comparar.png', (20, 745, 1150, 2045)),
    'dz-precio-julian': ('usuario/C-Detalle.png', (40, 640, 1130, 1258)),
    'dz-comolohace': ('usuario/C-Detalle.png', (40, 1268, 1130, 2440)),
    # 03 · el día del trabajo
    'dz-turno': ('usuario/S-Agendado.png', (35, 195, 1135, 805)),
    'dz-llegada': ('usuario/S-EnCamino.png', (40, 1375, 1130, 1800)),
    'dz-codigo': ('usuario/S-Llego.png', (40, 815, 1130, 1250)),
    'dz-estados': ('usuario/S-Trabajando.png', (40, 495, 1150, 1205)),
    'dz-pago-informado': ('usuario/S-PagoInformado.png', (40, 690, 1130, 1250)),
    'dz-pagos-reg': ('usuario/X-Pagos.png', (40, 180, 1150, 1090)),
    # 04 · obra
    'dz-obra-etapas': ('usuario/O-Propuesta.png', (30, 190, 1140, 1405)),
    'dz-obra-dia': ('usuario/O-Dia.png', (40, 370, 1130, 1255)),
    'dz-obra-repuesto': ('usuario/O-Repuesto.png', (40, 555, 1150, 1125)),
    'dz-obra-gastado': ('usuario/O-Gastado.png', (30, 185, 1150, 645)),
    # 05 · confianza
    'dz-verif-lista': ('usuario/C-Certificados.png', (40, 1000, 1130, 2110)),
    'dz-compartir': ('usuario/H-Compartir.png', (25, 795, 1165, 1975)),
    # 03 · mensajes y avisos
    'dz-mensajes': ('usuario/M-Mensajes.png', (30, 700, 1140, 1452)),
    'dz-chat-prop': ('usuario/M-Chat.png', (30, 962, 965, 1420)),
    'dz-chat-horario': ('usuario/M-Chat.png', (30, 1712, 965, 2170)),
    'dz-avisos': ('usuario/I-Avisos.png', (25, 280, 1150, 1005)),
    # PWA (captura de la vista de prueba, 780 px)
    'dz-pwa-orden': ('pwa:usuario-propuestas.webp', (0, 118, 690, 232)),
    'dz-pwa-sinverif': ('pwa:usuario-propuestas.webp', (20, 1030, 650, 1160)),
    'dz-pwa-etapas': ('pwa:usuario-seguimiento.webp', (20, 1268, 660, 1541)),
    'dz-pago-metodo': ('pwa:usuario-pago-metodo.webp', (15, 522, 780, 1370)),
}
man_p = os.path.join(PIEZA, 'imagenes.json')
man = [e for e in json.load(open(man_p)) if not e.get('a', '').startswith('dz-')]
for nom, (src, caja) in R.items():
    ruta = os.path.join(PWA, src[4:]) if src.startswith('pwa:') else os.path.join(CAP, src)
    im = Image.open(ruta).convert('RGB').crop(caja)
    im.save(os.path.join(PIEZA, 'img', nom + '.webp'), quality=94, method=6)
    man.append({'de': ('brands/handyx/assets/capturas/' + src[4:]) if src.startswith('pwa:') else src, 'a': nom + '.webp', 'recorte': list(caja), 'uso': 'despiece (ola 7)'})
    print(nom, im.size)
json.dump(man, open(man_p, 'w'), ensure_ascii=False, indent=0)
