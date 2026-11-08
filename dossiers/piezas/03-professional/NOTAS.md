# Dossier 03 · Professional App · notas de producción (ola 6, 08/11/2026)

28 páginas A4 en la dirección premium v2 «Galería» con aperturas «Maqueta» (banda azul a sangre + foto real de Mar del
Plata en duotono + maqueta `iso.js` de día). Es el **manual del especialista**: voz en voseo, dirigida al especialista,
en todos los títulos (resuelve R-038). Control del exportador: **0 errores** (126 avisos: maquetas que salen a sangre a
propósito y fotos entre 152 y 183 ppp).
`node dossiers/herramientas/exportar-pieza.cjs dossiers/piezas/03-professional/index.html S/ola6/03-professional Handyx-03-Professional-App`

El HTML se generó con un script de la sesión (`S/ola6/p03tools/gen.py` + `estilo.css`); el `index.html` es autocontenido
y se puede editar a mano.

## Páginas

| p. | Capítulo | Título | Pantallas (toques) |
|---|---|---|---|
| 1 | Tapa | Tu trabajo, tus precios. | Foto casino-plaza + maqueta; F-Pedido y F-InicioDia en perspectiva plata |
| 2 | Contenido | El manual del especialista | Índice por capítulos (sin números del pedido interno, R-012), cómo leer, «Dónde está la app hoy» (2/40/49/11) |
| 3 | 01 apertura | Cargar un documento no es estar verificado | Foto aerea-centro-playa + barrio; 10 pasos · 2 de 6 rubros con matrícula · 1 equipo habilita; 56 registrados rotulados |
| 4 | 01 | Quién sos, qué hacés y dónde trabajás | RG-1 → RG-4 · 3 claves · los seis rubros (Gas y Aire «Pide matrícula») |
| 5 | 01 | Tu cara, tus documentos y tus matrículas | RG-5 → RG-8 · paso 9 antecedentes en persona (texto, sin RG-9) · paso 10 · Detalle D6-Alta (recorte arriba de la fila de antecedentes) |
| 6 | 01 | Solo el equipo de verificación te habilita | Protagonista OB-Aprobado (60 mm, 4 notas) + etapas del alta |
| 7 | 02 apertura | Te llegan pedidos de tu zona. Vos decidís | Foto aerea-cabo-puerto + costa; 0 % · 6 rubros · «Ahora no» |
| 8 | 02 | Urgentes, solo si vos querés | Protagonista CU-Disponibilidad (56 mm) + D6-Avisos (40 mm) |
| 9 | 02 | Del aviso a tu precio | F-Inicio → F-Pedido → F-Precio (50 mm) |
| 10 | 02 | Tu propuesta, y la dirección cuando te eligen | F-Fecha → F-Revisar → F-Enviada → F-Trabajo + 4 salidas de una propuesta |
| 11 | 03 apertura | Del primer paso al informe | Foto rambla-fuego (mitad superior) + maqueta |
| 12 | 03 | Llegar y trabajar cómodo | F-InicioRuta → TR-EnCamino → H0-Modo → H0-AntesDespues |
| 13 | 03 | Cobrar directo y dejar todo registrado | TR-Cobro → H0-Informe → H0-InformeEnviado → F-Ingresos |
| 14 | 04 apertura | Una obra de varios días, en equipo | Foto aerea-quintas + barrio; 6 etapas según FL-Obra / RC-Obra |
| 15 | 04 | Proponer la obra, por etapas | F-ObraNueva → F-PropuestaObra → F-Obras (50 mm) |
| 16 | 04 | Sumar a otro especialista verificado | F-ObraEquipo → F-ObraBuscar → F-ObraPostulantes → F-Reparto |
| 17 | 04 | La obra entera, en una pantalla | Protagonista F-Obra (66 mm, 4 notas) |
| 18 | 04 | Cada jornada, cada repuesto, cada fecha | F-ObraDia → F-ObraDiaAvance → F-ObraRepuestos → F-ObraFecha |
| 19 | 05 apertura | Tu taller, en el bolsillo | Foto aerea-puerto-sur + costa; 9 herramientas con su estado |
| 20 | 05 | Presupuestar rápido sin perder plata | H0-Presupuesto → H0-Precios → H0-PreciosFoto → H0-ManoObra |
| 21 | 05 | Lo que llevás, lo que comprás y lo que medís | H0-Equipo · R-Retiro · T-Taller · T-Tablero (sin flechas: no es un flujo) + avisos de seguridad |
| 22 | 06 apertura | Crecer en Handyx: el Camino | Foto aerea-faro-mogotes + costa; escalera de 5 estaciones (borrador de G-Camino) |
| 23 | 06 | Solo cuenta lo verificado | G-Bienvenida → G-Manual → G-Inicio → G-Camino + 4 reglas |
| 24 | 06 | Premios que se ven antes de ganarlos | G-MiniCamino · G-Insignias · G-Canje · G-Areas (Concepto) |
| 25 | 07 apertura | Recibís el 100 %. Y lo que construís, queda | Foto casino-plaza; 8 mecanismos con estado |
| 26 | 08 Preguntas difíciles 1/2 | Las preguntas incómodas | 4 `.duda` + zócalo de foto |
| 27 | 08 Preguntas difíciles 2/2 | La plata, la presión y los datos | 4 `.duda` + zócalo de foto |
| 28 | Contratapa | Un problema viejo con una nueva solución que elegís. | Foto rambla-fuego + maqueta costa, QR, contacto, colección con 03 marcado |

## Fuentes

- Estados: `dossiers/auditoria/especialista.md` (102 funciones, recorridos E-R-01 a E-R-12). Reclamos del portal:
  `auditoria/portal.md` (Construido). Reseña opcional: `auditoria/usuario.md` U-S-11 (En pruebas, vista de prueba).
- Pantallas: `S/capturas/especialista/*.png` (lienzo), recortadas a 1170 × 2532 y pasadas a WebP (`imagenes.json`).
- Toques: coordenadas medidas en el DOM de cada tablero del lienzo (centro del elemento tocado), con la fórmula de la consigna.
- Decisiones: `docs/handyx/plan-dossiers.md` (5 tarifa, 7 tracción), agregados de la consigna ola 6 (fotos, lema, sin personajes).
- Cifras: `decks/handyx-aticma/afirmaciones.json` (PROFESIONES-INICIALES 6, verificado; ESP-REGISTRADOS 56, informado;
  FEE-ESPECIALISTA 0; TARIFA-USUARIO 15, en evaluación). 102 / 2 / 40 / 49 / 11: conteo de la auditoría del 07/11.
- Revisión ola 5 aplicada: R-002 (reseñas: En pruebas en una vista de prueba + Diseñado), R-011 (aviso de la landing
  desactualizada en la duda de la tarifa), R-012 (índice por capítulos), R-031 («lista de control», sin «PWA» en rótulos),
  R-032 (un solo rótulo «Diseño propuesto · datos ficticios»), R-033 («Decisión del fundador · 07/11/2026»), R-037 (sin
  conteo de recorridos), R-038 (una sola voz), R-039 (ninguna pantalla a menos de 40 mm).

## Decisiones

- **Sin personajes** (pedido de Ignacio del 08/11): ni `personajes/` ni `personajes-v2/`. Tres pantallas del lienzo
  se re-renderizaron sin la Llave/Foco: G-Camino y T-Taller (imagen ocultada) y G-Canje (la gorra-personaje se cambió
  por un ícono de regalo). Cinco pantallas con la Canilla se re-renderizaron con el ícono de línea de Plomería en su lugar
  (F-Inicio, F-Pedido, F-Precio, F-Trabajo) o con un ícono de envío (F-Enviada); se dice en el pie de la p. 9.
  Herramienta: `herramientas/rerender-tablero.cjs` con un `js` que reemplaza la imagen del personaje.
- **Antecedentes**: se imprime la versión de la consigna y del código (turno presencial, nunca como archivo, En pruebas).
  No se usan RG-9, RG-10 completo, CU-Datos ni D6-Alta completo (muestran el archivo); D6-Alta va recortada arriba de
  esa fila. La versión del lienzo (archivo cifrado) se menciona como «en revisión legal, no se aplica».
- **Tarifa**: solo la decidida. Las pantallas usadas dicen «Recibís el 100 % · Handyx no te cobra comisión» (coherente).
  No se usa la demo de la landing (10 %) ni las capturas reales con «Tarifa de Handy durante la demo».
- **Camino**: la escalera usa las estaciones de G-Camino (1, 5, 10 y 25 trabajos) rotuladas «Borrador del lienzo».
- **Fotos**: duotono azul; en bandas de ancho completo solo `casino-plaza` y `rambla-fuego` (1512 px); las aéreas
  (1200 px) a 196 mm o menos para no bajar de 150 ppp. `rambla-fuego` siempre en su mitad superior (sin la persona).
  Las fotos de 1200 px salen a 152–156 ppp (aviso, no error).
- **Número de capítulo calado**: `-webkit-text-stroke` genera fuentes Type 3 en el PDF y el exportador lo rechaza. Se
  dibuja como SVG con los contornos de Archivo 125/900 (fontTools). **Aviso para las otras piezas**: `.cap-n` de
  `premium.css` rompe la exportación.
- Sin dominio de la app del especialista, sin pantallas de acceso o seguridad, sin ferreterías como aliadas.

## Componentes propios (en el `<style>` de la pieza)

`.rec` (fila de N teléfonos con flecha de prototipo y pie numerado; `.sin-flechas` para tableros sueltos), `.foto-banda`
+ `.velo` (foto en duotono fundida en la banda), `.zocalo-foto` (foto a sangre abajo, con los pies en blanco),
`.cap-n-svg`, `.clave`, `.paso-txt`, `.banda-dato`, `.salidas`, `.aviso-seg`, `.reglas4`, `.herr-i`, `.mec-i`,
`.rubros6`, `.marco` con «Detalle», `.indice-v2`, `.leer`, `.hoy-barra` + `.barra-est`, `.lema-v2`, `.qr-v2`, `.contacto-v2`.

## Pendientes impresos como «a definir»

- Plazo de la verificación (p. 6 y 26).
- Cómo se cobra la tarifa del cliente (15 %, en evaluación) (p. 26).
- Cantidad de trabajos de la estación «Herramienta»: 25 en G-Camino, 15 en F-Regalo (p. 22).

## Preguntas abiertas para Ignacio

1. Antecedentes: ¿turno presencial (código, consigna) o archivo cifrado (lienzo y docs de la rama)? ¿Hay revisión legal?
2. Plazo de verificación y si se comunica.
3. ¿Cómo se cobra el 15 % al cliente y desde cuándo exactamente?
4. Camino: cantidades por estación, montos de los mini caminos, premios, quién los paga y el «punto Handyx del Centro».
5. ¿Se puede abrir un reclamo desde la app? Hoy solo el portal los carga (por teléfono o mail).
6. ¿Se corrige la landing (demo con 10 % + 10 %) antes de repartir el material?
7. ¿Qué ve un especialista el 10/11: la demo de la landing, la vista previa con datos de prueba o nada?
