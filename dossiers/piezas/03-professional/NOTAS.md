# Dossier 03 · Professional App · notas de producción (ola 7, 08/11/2026)

28 páginas A4. Ola 7 = pasada de dirección de arte premium sobre la ola 6 (`consigna-ola-7.md`): mismos textos, estados,
rótulos y reglas de la ola 6; cambia la forma. Objetivo: «wow, mirá las herramientas que tiene el especialista».
Control del exportador: **0 errores** (30 avisos: bandas y zócalos que salen a sangre a propósito).
`node dossiers/herramientas/exportar-pieza.cjs dossiers/piezas/03-professional/index.html S/ola7/03-professional Handyx-03-Professional-App`

El HTML se generó con un script de la sesión (`S/ola7/w03/gen.py`, toma tapa, índice, preguntas y contratapa de la ola 6);
el `index.html` es autocontenido y se puede editar a mano. Los recortes ampliados (`img/x-*.webp`, lossless, ×3) salen
de las pantallas de `img/` con la tabla `recortes.json` (px CSS de la pantalla de 390; cajas medidas en el DOM del lienzo).

## Qué cambió en la ola 7

- **Despieces** (teléfono grande + recortes reales ampliados flotando + `.guia`): p. 9 pedido y precio (azul), p. 12 Modo
  trabajo (navy), p. 17 la obra entera (cielo), p. 20 presupuestador (hueso), p. 23 el Camino (azul); despieces chicos en
  p. 5 (documentos: matrícula «Cargado · en revisión» + estado del alta) y p. 16 (equipo: postulante, «Verificado por
  Handyx · siempre», reparto). Página de herramientas sin teléfonos (p. 21): cuatro recortes grandes en tarjetas de color.
- **Escenas**: aperturas con la escena en una tarjeta blanca que monta sobre la banda azul (p. 3 `verificar`, p. 7
  `conectar`, p. 11 `ruta`*, p. 14 `obra`, p. 19 `taller`*, p. 22 `camino`, p. 25 `valor`*) y en conceptos: p. 8
  `agenda` (disponibilidad), p. 10 `propuestas` (qué pasa con tu propuesta), p. 13 `pago` con guías (cobro directo).
  *Escenas propias de esta pieza, dibujadas en el `<script>` del `index.html` con el lenguaje de `escenas.js`
  (`data-escena-p="ruta|taller|valor"`): un día ordenado en un plano con la camioneta; el teléfono como herramienta (nivel,
  cinta, presupuesto, QR); historial que sube con garantía y reseñas. `escenas.js` no se tocó.
- **Menos miniaturas**: de 11 filas de 4 teléfonos de 40 mm quedan 6 vitrinas de 3 teléfonos (42–48 mm) sobre un panel de
  color con grano (p. 4, 10, 13, 15, 18, 24). Pantallas que salen: F-Inicio, F-Enviada, F-InicioRuta, TR-EnCamino,
  H0-InformeEnviado, F-ObraEquipo, F-ObraDiaAvance, G-Bienvenida, G-Manual, G-Areas, D6-Avisos y RG-2/5/6/7 (su contenido
  queda en el texto).
- **Estados**: un solo bloque de chips por página (la línea de origen o un bloque de cifras); en el cuerpo, estado en
  texto chico con el mismo ícono (`.et`). Las dudas (p. 26–27) también.
- **Color**: misma paleta; fondos llenos con `.grano` en una capa aparte (no tapa las capturas). Tapa: se suma el recorte
  «Recibís el 100 % · $ 47.000». «Cómo leer» al día (los puntos ya no son amarillos; etiquetas con línea).

## Páginas

| p. | Capítulo | Título | Imagen principal |
|---|---|---|---|
| 1 | Tapa | Tu trabajo, tus precios. | Maqueta + F-Pedido y F-InicioDia en perspectiva + recorte «Recibís el 100 %» |
| 2 | Contenido | El manual del especialista | Índice, cómo leer, «Dónde está la app hoy» |
| 3 | 01 apertura | Cargar un documento no es estar verificado | Escena `verificar` |
| 4 | 01 | Quién sos, qué hacés y dónde trabajás | Vitrina RG-1 · RG-3 · RG-4 + seis rubros |
| 5 | 01 | Tu cara, tus documentos y tus matrículas | Despiece RG-8 + estado del alta; pasos 5–10 en texto |
| 6 | 01 | Solo el equipo de verificación te habilita | Protagonista OB-Aprobado + estados del alta |
| 7 | 02 apertura | Te llegan pedidos de tu zona. Vos decidís | Escena `conectar` |
| 8 | 02 | Urgentes, solo si vos querés | Protagonista CU-Disponibilidad + escena `agenda` |
| 9 | 02 | Del aviso a tu precio | **Despiece** F-Pedido + F-Precio |
| 10 | 02 | Tu propuesta, y la dirección cuando te eligen | Vitrina F-Fecha · F-Revisar · F-Trabajo + escena `propuestas` |
| 11 | 03 apertura | Del primer paso al informe | Escena `ruta` (propia) |
| 12 | 03 | Llegar y trabajar cómodo | **Despiece** H0-Modo + antes/después |
| 13 | 03 | Cobrar directo y dejar todo registrado | Escena `pago` con guías + vitrina TR-Cobro · H0-Informe · F-Ingresos |
| 14 | 04 apertura | Una obra de varios días, en equipo | Escena `obra` + 6 etapas |
| 15 | 04 | Proponer la obra, por etapas | Vitrina F-ObraNueva · F-PropuestaObra · F-Obras |
| 16 | 04 | Sumar a otro especialista verificado | Despiece F-ObraBuscar + postulante + reparto |
| 17 | 04 | La obra entera, en una pantalla | **Despiece** F-Obra |
| 18 | 04 | Cada jornada, cada repuesto, cada fecha | Vitrina F-ObraDia · F-ObraRepuestos · F-ObraFecha |
| 19 | 05 apertura | Tu taller, en el bolsillo | Escena `taller` (propia) + 9 herramientas |
| 20 | 05 | Presupuestar rápido sin perder plata | **Despiece** H0-Presupuesto + tarifas + foto del corralón |
| 21 | 05 | Lo que llevás, lo que comprás y lo que medís | 4 recortes en tarjeta (equipamiento, QR, Taller, tablero 3D) + avisos |
| 22 | 06 apertura | Crecer en Handyx: el Camino | Escena `camino` + escalera |
| 23 | 06 | Solo cuenta lo verificado | **Despiece** G-Inicio + camino de G-Camino |
| 24 | 06 | Premios que se ven antes de ganarlos | Vitrina G-MiniCamino · G-Insignias · G-Canje |
| 25 | 07 apertura | Recibís el 100 %. Y lo que construís, queda | Escena `valor` (propia) + 8 mecanismos |
| 26–27 | 08 | Preguntas difíciles | 8 `.duda` + zócalo ilustrado |
| 28 | Contratapa | Un problema viejo con una nueva solución que elegís. | Maqueta, QR, contacto |

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

Ola 6: `.rec`, `.foto-banda` + `.velo`, `.zocalo-foto`, `.cap-n-svg`, `.clave`, `.paso-txt`, `.banda-dato`, `.salidas`,
`.aviso-seg`, `.reglas4`, `.herr-i`, `.mec-i`, `.rubros6`, `.marco`, `.indice-v2`, `.leer`, `.hoy-barra`, `.lema-v2`,
`.qr-v2`, `.contacto-v2`. Ola 7: `.capa` (+ `.grano`), `.et` (estado en texto chico con ícono), `.e-l`, `.vit`/`.vpaso`
(vitrina con flechas), `.esc-card` (escena en tarjeta sobre la banda), `.panel-esc`, `.tres-txt`/`.dos-txt`/`.pasos4`,
`.destacado`, `.h-cards`/`.h-card` (recorte en tarjeta de color), `.guia.v`/`.guia.vd` (guía vertical: punto arriba, texto
abajo) y `.marca-r` (sin usar). **Aviso para las otras piezas**: `.paso` ya existe en `base.css` (flex): no reutilizar el
nombre para otra cosa.

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
