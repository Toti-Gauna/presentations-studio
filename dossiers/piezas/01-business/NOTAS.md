# Dossier 01 · Business & Investment · notas de producción (ola 3)

Estado al 07/11/2026. 20 páginas A4 en el orden de `dossiers/arquitectura.md`. Exportado con
`exportar-pieza.cjs` sin errores ni avisos. Sin `data-folio`: la numeración sale del orden.

## Páginas

| p. | Ceja (sección del pedido §5) | Título | Evidencia |
|---|---|---|---|
| 1 | Tapa | Business & Investment | Navy con el mapa de líneas de Mar del Plata (sin cambios sobre la muestra aprobada) |
| 2 | Contenido | En este dossier | Índice con `data-ir`, «Cómo leer» y «Handyx en una línea» |
| 3 | 02 Resumen ejecutivo | Un producto en pruebas y un pedido concreto | 4 cifras rotuladas (6 rubros, 284 funciones, nov. 2026, USD 100.000), estado honesto, tarifa decidida |
| 4 | 03 El problema | Arreglar algo en casa todavía es una odisea | Odisea en dos carriles, 6 dolores como hipótesis con la señal a medir, 3 preguntas del piloto |
| 5 | 04 Nuestra solución | Más claro para quien pide y para quien trabaja | 3 columnas (P-Revisar, H0-Presupuesto, esquema del portal) con estado por función, 3 principios |
| 6 | 05 El ecosistema Handyx | Tres superficies para un mismo arreglo | Diagrama propio adaptado de Operations p. 4: estado, dominio y dossier en cada caja |
| 7 | 05 El ecosistema, de punta a punta | Así se resuelve un arreglo de punta a punta | Tira de 5 pantallas con chips, banda del portal, `.flujo` |
| 8 | 06 Mercado y oportunidad | (muestra aprobada) | Cuenta abajo-arriba y niveles de mercado |
| 9 | 07 Modelo de negocio | (muestra aprobada) | Confirmada · en evaluación · futuras, flujo del dinero, ejemplo ilustrativo |
| 10 | 08 Competencia y diferenciación | Cada alternativa cobra de una forma distinta | Tabla por modelo de cobro (nombres del pitch), diferenciación como hipótesis, riesgos |
| 11 | 09 Adquisición y marketing | Dos ejes de captación, medidos por barrio | Digital y físico con avance (previsto · en ejecución · medido), dos bucles, medición en el portal |
| 12 | 09 Cómo lo medimos | El costo se mide contra trabajos completados | Embudo de etapas, tabla de métricas, techo de CAC, 6 experimentos |
| 13 | 10 Crecimiento por etapas | Consolidar Mar del Plata antes de replicar | Escalera de 4 etapas con objetivo, acciones, recursos, indicadores, hito y condición |
| 14 | 11 Roadmap | Separamos lo construido de lo planificado | Matriz 6 frentes × construido / en pruebas / planificado, orden de lo que sigue |
| 15 | 12 Proyecciones financieras | Proyectamos con variables, no con promesas | Equilibrio (400 ÷ 6 ≈ 67), tabla de 10 variables, escenarios pendientes |
| 16 | 13 Inversión y uso del capital | Una inversión atada a hitos medibles | USD 100.000, barra segmentada 45/30/15/10, partidas con detalle, categorías del pedido |
| 17 | 14 Avance y validación | Avances reales, cada uno con su respaldo | Publicaciones con fecha, 5 trabajos / $ 350.000 y 56 registrados (sin auditar), hito, capacidad |
| 18 | 15 Visión a futuro | La forma más simple de resolver los arreglos de una casa | Página navy: 3 objetivos META-*, 3 conceptos, línea ATICMA e invitación |
| 19 | 16 Equipo y contacto | Lo que pedimos hoy es una reunión | Por qué ahora, equipo, pedido de reunión, la colección |
| 20 | Contratapa | — | Copia de `paginas-comunes.html` en navy, Engranaje (engranaje-b) y `.actual` en 01 |

## Fuentes

- `dossiers/auditoria/negocio.json` y `.md` (ecosistema, repos, pruebas, publicaciones, competencia, ATICMA, tarifas).
- `decks/handyx-aticma/afirmaciones.json`: PROFESIONES-INICIALES, LANZAMIENTO, INVERSION-BUSCADA, INV-TOTAL, INV-* (detalle),
  MDP-HOGARES, SUP-ARREGLOS-HOGAR, SUP-TICKET-USD, MERCADO-USD, COSTOS-MES (+ COSTO-*), INGRESO-POR-TRABAJO,
  EQUILIBRIO-TRABAJOS, CAC-MAXIMO, CAC-ESTIMADO, SUP-CLIENTES-MES, TRABAJOS-INFORMADOS, PRUEBA-MONTO, ESP-REGISTRADOS,
  META-TRABAJOS, META-REPETIDORES, META-1M, META-5M, META-CUOTA-NACIONAL, COMP-CLICKIE-PRO, EJ-P / EJ-F / EJ-T.
- `dossiers/diagnostico.md` (conteo 45 · 94 · 116 · 29 = 284, estado de cada superficie, contradicciones).
- `dossiers/auditoria/usuario.json`, `especialista.json`, `portal.json` (estados de cada función; arquitectura del portal).
- `docs/handyx/growth.md` y `preguntas.md` solo para contenido cualitativo (experimentos sin umbrales numéricos,
  bucles de crecimiento, condición de expansión #16, riesgos #4, #17 y #18). Ninguna cifra sale de ahí.

## Imágenes (`imagenes.json` → `img/`)

Siete pantallas del lienzo, todas «Diseño propuesto» (con «muestra» o «datos ficticios» porque llevan nombres y montos):
p-revisar y h0-presupuesto (p. 5); p-que, f-revisar, c-aceptar, h0-modo y s-pago-informado (p. 7, una sola figura con un
rótulo). Ninguna con personajes; ninguna captura de la PWA (dicen «Handy»); ninguna pantalla de acceso. El portal se
muestra como esquema de módulos (no captura), rotulado «Esquema · módulos del portal v2».

## Pendientes «[a definir]»

Instrumento, plazo y valuación (p. 3 y 16) · margen y flujo de caja (p. 15) · escenarios conservador, base y ambicioso
(p. 15, «pendiente de datos medidos») · hitos, recursos e indicadores de las etapas 2 a 4 (p. 13) · remarketing,
posicionamiento orgánico y TikTok (p. 11) · tamaño del mercado total y accesible (p. 8, «[a investigar]»).

## Desvíos y decisiones

- **p. 7** lleva la ceja «05 · El ecosistema, de punta a punta» y **p. 12** «09 · Cómo lo medimos»: son continuación de las
  secciones 5 y 9 del pedido; en el índice figuran como subentradas. **p. 19** usa la sección 16 («Equipo y contacto»).
- **Pulidos sobre la muestra aprobada:** p. 8, el tipo «Dato observado» pasa a «Dato informado · unidad a confirmar» (lista
  cerrada de tipos); p. 9, «Cómo se cobra» ya no nombra mecanismos (rendición o cobro dividido) y dice «en evaluación»,
  como pide el diagnóstico; las dos suman «Estado al 07/11/2026» a la fuente. La dirección no cambia.
- **Títulos:** `text-wrap: balance` en los `h1` para que ninguno termine con una palabra sola (p. 9 conserva su corte
  original con `text-wrap: wrap`; p. 13 usa espacios duros en «Mar del Plata»).
- **Dominios:** se nombran los públicos (landing.handyc.com, handyx.pro, workers.handyx.pro); el portal figura como «solo
  para el equipo», sin su dirección, por prudencia.
- **Clickie «hasta 15 %»** (COMP-CLICKIE-PRO) es la única cifra de competidores; el cargo al usuario, que está en
  contradicción, no se imprime. La tabla lleva «Datos públicos consultados el 02–04/11 · a revalidar».
- **Tracción:** 5 trabajos y $ 350.000 en total, y 56 especialistas registrados, con «Dato informado por el fundador ·
  sin auditar». No se imprimen los $ 70.000 (ni como ingreso ni como ticket) ni el 10 % + 10 % de la prueba.
- **CAC:** techo USD 6 «a medir» (proyección, sobre el primer trabajo completado) y USD 2 como supuesto.
- **Equipo:** se imprime «Abigail» por indicación de la consigna; la auditoría de negocio recuerda que conviene su OK.
- **Inversión:** «remeras y contenido con los Handys» se escribe «con los personajes» para quien no conoce la marca.
- **Visión:** los tres objetivos META-* van solo en p. 18, rotulados «Objetivo» (el 40 % además «sin metodología»).

## Componentes nuevos (en el `<style>` de la pieza)

`.cifras-clave` y `.barra-estados` (p. 3) · `.pasos-carril`, `.dolor`, `.preguntas` (p. 4) · `.valor`, `.esquema-portal`,
`.etiqueta-esquema`, `.lista-estados`, `.principios` (p. 5) · `.eco` (cajas en mm + SVG) (p. 6) · `.tira`, `.acompana`
(p. 7) · `.comp`, `.dif`, `.riesgo` (p. 10) · `.ejes`, `.accion`, `.avance`, `.bucles` (p. 11) · `.embudo`,
`.bajo-embudo`, `.tarjeta-cac`, `.experimentos` (p. 12) · `.etapas`, `.escalon`, `.regla-avance` (p. 13) · `.matriz`,
`.col-planificado`, `.orden` (p. 14) · `.cuenta.tres`, `.variables`, `.escenarios`, `.bruto` (p. 15) · `.monto`,
`.barra-seg` (paleta validada con el validador de dataviz: #1F57A8, #C2820E, #5B8FE0, #0E8C7E), `.reparto`,
`.categorias`, `.condiciones` (p. 16) · `.val`, `.tiempo`, `.capacidad`, `.barras` (p. 17) · `.ambicion`,
`.conceptos`, `.aticma` (p. 18) · `.por-que`, `.equipo`, `.pedido`, `.seguir` (p. 19) · `.oscuro .tipo-dato` y
`.sobre-navy` para chips sobre navy.
