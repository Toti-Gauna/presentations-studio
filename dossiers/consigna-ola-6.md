# Ola 6 · Rehacer los cuatro dossiers en la dirección premium v2 (08/11/2026)

Ignacio aprobó la dirección premium («Me parece increíble así») y pidió:

> «Quiero que hagas todos los dossier y que muestres mejor las pantallas … con las capturas de los artifacts y flujos,
> resolviendo dudas desde cómo validamos y cómo pueden subir de categoría desde Handy, cómo hacer que no se fuguen,
> mostrando cómo hacer una obra por completo. Todo en el manual de cada uno, respondiendo las dudas difíciles y
> dolorosas de las apps.»

Cada dossier es el **manual** de su superficie: se entiende solo, muestra las pantallas grandes y en flujo, y responde
sin vueltas las preguntas difíciles. El tríptico lo hace el coordinador.

## Dirección visual (aprobada)

- Referencia aprobada: `dossiers/estilos2/estilos.html` (las 9 páginas de muestra) y `dossiers/plantilla/componentes.html`.
- **01 Business & Investment → «Nocturno»**: páginas `p-oscuro` (navy), maqueta de noche, teléfonos titanio, amarillo
  como único acento. Se permiten páginas claras (hueso) para tablas densas, sin romper la serie.
- **02 Customer · 03 Professional · 04 Operations → «Galería» con aperturas «Maqueta»**: páginas blancas/hueso, teléfonos
  plata grandes, tipografía editorial con mucho aire; cada capítulo abre con una banda azul a sangre (`.banda.azul`) con la
  maqueta de día (`data-iso`), el número de capítulo calado (`.cap-n`) y una frase.
- CSS común: `plantilla/base.css` + `plantilla/premium.css` (tokens, `.p-*`, `.movil`, `.notebook`, `.toque`, `.heroe`,
  `.notas`, `.zigzag`, `.fila-pant`, `.duda`, `.etapas`, `.escalera`, `.p-cifra`, `.banda`, `.superficie`). **No edites
  los archivos de `plantilla/`**: lo propio de tu pieza va en un `<style>` dentro de tu `index.html`. Si necesitás un
  componente común nuevo, escribilo en tu `<style>` y avisalo en tu informe.
- Maqueta isométrica: `plantilla/iso.js` (`<div data-iso="maqueta|costa|barrio" data-paleta="dia|noche" data-pines="1"
  data-rotulos="1" data-solo="faro,casino,…" data-tam="13">`). Tiene la Rambla con el Casino y los lobos marinos, el Torreón
  del Monje, el puerto con lanchitas amarillas, balnearios, la Catedral, el faro y chalets de piedra. Usala en tapas y
  aperturas, no en todas las páginas.
- Plano real de la ciudad para fondos tenues: `marca/mapa-mdp-blanco.svg` / `mapa-mdp-navy.svg` (si lo usás, crédito
  «© colaboradores de OpenStreetMap» en la página).
- Teléfonos/notebook en perspectiva (tapas, aperturas): `node dossiers/herramientas/dispositivo.cjs trabajos.json`
  (ver el encabezado del archivo; `tipo: telefono|laptop`, `acabado: titanio|plata|noche`). Las salidas van a tu `img/`.
- En recorridos y pantallas protagonistas usá los marcos planos `.movil` / `.notebook` (HTML), así los puntos `.toque`
  caen exactamente sobre el elemento que se toca. Coordenadas del `.toque` en % del `.movil`:
  `left = (18 + x) / 426`, `top = (18 + y) / 880`, con (x, y) en píxeles de pantalla de 390 × 844 (la captura es 1170 × 2532: dividí por 3).

## «Mostrá mejor las pantallas» (regla dura)

- Una pantalla cuyo contenido importa **nunca** va a menos de 38 mm de ancho de teléfono; la protagonista de una página va
  a 62–75 mm (`.heroe` con 3–5 notas numeradas que coinciden con los `.toque`).
- Cada flujo se cuenta con pantallas reales en orden, conectadas (`.zigzag` con enlaces de prototipo, o `.fila-pant`), con
  lo que se toca marcado y una idea corta por paso. Nada de miniaturas decorativas.
- Portal: notebook plana de 150–174 mm de ancho para la pantalla protagonista; recortes ampliados (rótulo «Detalle») para
  mostrar una parte legible.
- Revisá cada página renderizada (`node dossiers/herramientas/vista-rapida.cjs tu/index.html carpeta`) y mirá las PNG: los
  `.toque` tienen que caer sobre el botón/opción correctos, nada se pisa, ningún texto queda cortado.

## Fuentes (leé antes de escribir)

- Pedido y reglas: `docs/handyx/pedido-dossiers.md`; decisiones de Ignacio: `docs/handyx/plan-dossiers.md` (1–8 + respuestas
  posteriores); arquitectura previa: `dossiers/arquitectura.md`; hallazgos de revisión ya aplicados: `dossiers/revision/`.
- Qué existe y en qué estado: `dossiers/auditoria/<usuario|especialista|portal|negocio>.md` y `.json` (284 funciones con
  estado, evidencia y captura). **El estado de cada función sale de ahí**: Construido · En pruebas · Diseñado · Concepto.
- Pantallas de los lienzos: `S/capturas/<usuario|especialista|portal>/<Tablero>.png` (+ `.txt` con su texto, `textos.md`,
  `indice.json`). `S = /tmp/claude-0/-home-user/10ab011c-6752-54be-831e-b3c4da2461d0/scratchpad`. Las de celular son
  1170 × 2532; las del portal 2880 de ancho (recortá a 16:10 para la notebook). Convertilas a WebP en tu `img/`
  (Pillow: `lossless=True` o `quality=94`).
- Texto ya revisado de la versión anterior: `dossiers/piezas/<tu pieza>/index.html` y `NOTAS.md` — reutilizá hechos,
  rótulos y matices (están revisados); rehacé la forma.
- Cifras: **solo** de `decks/handyx-aticma/afirmaciones.json`, con su tipo y fuente. Preguntas difíciles ya respondidas:
  `docs/handyx/preguntas.md` y `docs/handyx/aticma-preguntas.md`.

## Contenido que tiene que estar (según la pieza)

Respondé con lo que existe; si algo es diseño o concepto, decilo con su chip. Si una respuesta no existe en las fuentes,
escribí «a definir» y anotalo en `NOTAS.md` como pregunta para Ignacio. **Nunca inventes** funciones, plazos, montos,
porcentajes, usuarios ni resultados.

- **Cómo validamos** (02 desde lo que ve el usuario: sellos de identidad y antecedentes que salen del servidor; 03 desde el
  alta: 10 pasos, documentos, rubros con matrícula, antecedentes en persona y nunca como archivo, «cargar no es estar
  verificado», solo el equipo habilita; 04 desde el equipo: preregistro → contacto → alta → verificación).
- **Cómo se sube de categoría** (03, y una mención en 01/04): Camino Handyx — kit de bienvenida y manual, estaciones por
  trabajos y cobros verificados, mini caminos por oficio, insignias que no cambian los pedidos, «nada se resta», sin
  rankings ni azar, premios en borrador con Legal; áreas = Concepto. Estados de la auditoría.
- **Cómo evitamos que se fuguen** (01, 02, 03, 04, cada uno desde su lado): respuesta honesta de `preguntas.md` (nada lo
  impide del todo; valor adentro: propuestas comparables, chat sin compartir el teléfono, dirección exacta solo cuando el
  cliente acepta, historial, reseñas, garantía registrada, reclamos con seguimiento, sin comisión al especialista; se mide
  como repetición dentro de Handyx). Cada mecanismo con su estado.
- **Una obra de punta a punta** (02 desde el cliente: `O-*`, `FL-Obra`, `RC-Obra`; 03 desde el especialista: `F-ObraNueva`,
  `F-ObraPostulantes`, `F-ObraEquipo`, `F-ObraDia*`, `F-ObraRepuesto*`, `F-Reparto`, `F-PropuestaObra`, `FL-Obra`, `RC-Obra`;
  01 un resumen de una doble página). Mostrala completa, en etapas (`.etapas`) y con pantallas grandes.
- **Preguntas difíciles y dolorosas de la app** (una o dos páginas `.duda` por dossier, 6–8 preguntas, ver ejemplos abajo),
  con respuesta corta, explicación, y «Hoy: …» con chips de estado.
  - 02: ¿y si el trabajo sale mal? ¿y si no viene? ¿pago más por usar Handyx? ¿quién ve mi dirección y mis datos? ¿cómo sé
    que está verificado? ¿qué pasa con mi plata? ¿y si me cobra otra cosa al final (adicional)?
  - 03: ¿cuánto me cobran? ¿me castigan si rechazo o cancelo? ¿por qué no me arreglo por fuera con el cliente? ¿cuándo me
    verifican y qué pasa con mis antecedentes? ¿quién me asegura el cobro? ¿me obligan a urgencias?
  - 04: ¿cómo validan a un especialista? ¿qué pasa con un reclamo? ¿cómo evitan que se fuguen? ¿quién ve los datos
    personales? ¿qué está conectado hoy y qué no?
  - 01 (inversor): ¿qué impide la desintermediación? ¿por qué ahora y por qué Mar del Plata? ¿qué pasa si lo copia alguien
    grande? ¿cuánto gana Handyx por trabajo? ¿cuál es el CAC? ¿qué está construido de verdad?

## Reglas que no se negocian

- Español rioplatense con voseo. «Especialistas»; «verificado» solo como estado real del servidor; nunca «matriculados»,
  «despachamos», «inmediato», «al instante», «en minutos». Montos `$ 45.000`; USD solo en el Business y rotulado.
- **Tarifa (decisión del 07/11):** al especialista, sin comisión; al usuario, 0 % hasta el 10/12/2026 y después 15 % «en
  evaluación». Ninguna otra versión impresa (si una pantalla del lienzo muestra otra tarifa, no la uses o señalala).
- Tracción: 5 trabajos, $ 350.000, 56 especialistas registrados — siempre «dato informado por el fundador · sin auditar»;
  los 56 son «anotados por el fundador fuera de la landing, en una planilla propia, con su consentimiento»; nunca
  «verificados» ni «activos». Ingresos siempre «bruto, antes de costos». Objetivos (USD 1 M, 5 M, 40 %) solo en Visión de 01.
- Lanzamiento: «Noviembre de 2026: demo cerrada con invitación; lanzamiento abierto después, fecha a confirmar».
- Cada pantalla con rótulo de origen (`.rotulo diseno` «Diseño propuesto · datos ficticios», `.rotulo prueba` «Pantalla de
  la PWA · datos de prueba», «Pantalla del portal · datos de muestra»). Cada función con chip de estado. Línea de corte
  «Estado al 07/11/2026».
- Personajes: solo Foco, Engranaje, Llave, Brocha (`marca/personajes/*.svg`), con mesura; ninguno en 01 salvo la contratapa.
  **Ninguna captura que muestre a Canilla, Gota o la imagen grupal**; nada de pantallas de acceso/seguridad (Login,
  RC-Acceso, D6-TOTP, D6-Login2FA, D6-Seguridad), ni incidentes que asusten («Pérdida de gas sin resolver»).
- Sin datos personales reales ni configuraciones o detalles de seguridad interna.
- Contacto idéntico: Ignacio Gauna · ignaciogauna.developer@gmail.com · 223 667-4044 · landing.handyc.com · QR a
  `https://landing.handyc.com/handyx/` (`marca/qr-hub.svg`).

## Forma del archivo

- `dossiers/piezas/<tu pieza>/index.html` (reemplaza al anterior; Git guarda la versión vieja), `img/` con lo que uses,
  `NOTAS.md` actualizado (estructura página por página, fuentes, decisiones, preguntas abiertas para Ignacio).
- A4 vertical, cantidad de páginas **múltiplo de 4** (sugerido: 01 → 24, 02 → 24, 03 → 28, 04 → 20). p. 1 tapa, p. 2 índice
  + «Cómo leer» (rediseñá el de `plantilla/paginas-comunes.html` en el estilo v2), última = contratapa con QR y contacto.
- Estructura de cada página: `section.pagina > .lamina > (.banda|.a-sangre…) + .cab-p + .caja + .pie-p` como en
  `estilos2/estilos.html` (copiá sus estilos `.cab-p`, `.pie-p`, `.serie`). El exportador mide el desborde dentro de
  `.caja`; lo que sale a propósito lleva `.permite-salir` o va dentro de `.a-sangre`/`.banda`.
- Cargá al final: `<script src="../../plantilla/iso.js"></script>` (si usás maqueta) y `<script src="../../plantilla/pieza.js"></script>`.
- Exportación final obligatoria con **0 errores**: `node dossiers/herramientas/exportar-pieza.cjs dossiers/piezas/<pieza>/index.html S/ola6/<pieza> <Nombre>`.
- **No hagas commit ni push** (lo hace el coordinador). No toques otras piezas ni `plantilla/`.
- Informe final (corto): páginas, qué responde cada pregunta difícil, pantallas usadas, preguntas abiertas y cualquier
  contradicción entre fuentes que encontraste (señalala, no elijas).
