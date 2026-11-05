# Handoff · presentations-studio

Fecha: 31/10/2026 · Rama: `claude/modest-gauss-jin0gy` · Sesión con modelo configurado Claude Opus 5.5.
Estado: **fases 0–8 implementadas y verificadas en local; Fase 9 (deploy) preparada, no ejecutada.** Nada desplegado,
ningún gasto, ningún dato personal, Notion no modificado.

## Qué funciona (comprobado en esta sesión)
- Motor: pantalla pública 16:9, presentador (actual/siguiente, notas, guion, reloj, ensayo por escena, índice, negro, audio,
  recuperar, ruta manual), control móvil, exportación e índice. Teclado/clicker siempre local.
- Servidor de sesiones: emparejamiento por QR privado de un solo uso con aprobación, tokens por rol, deduplicación, revisión base,
  revocación, orígenes exactos, redirecciones QR estables. Probado en localhost (unitarias + integración WS + E2E).
- Pitch Handyx: 23 escenas, versiones ATICMA 180 s / 60 s / ángel 353 s / VC 495 s, 7 anexos, 34 afirmaciones rotuladas, 3 QR públicos.
- Modelo económico con escenarios y sensibilidad; afirmaciones del pitch atadas al modelo por prueba.
- Respaldo: `salida/pdf/handyx-aticma.pdf` (18 págs.), `handyx-angel-lectura.pdf` (A4), `salida/video/handyx-aticma.mp4`
  (184 s, H.264 1080p), `salida/paquete-local.zip`, `salida/qr/` (SVG/PNG). `salida/` no se versiona: regenerar con los scripts.
- Segunda marca (`decks/eclipse-demo`) sin cambios en el núcleo.

## Comandos verificados
`npm run verify` (55 pruebas, 3 decks válidos, build) · `npm run e2e` (17/17) · `npm run escenarios` · `npm run qr` ·
`npm run exportar:pdf` · `npm run exportar:video` · `npm run paquete:local`.

## Datos: qué falta, qué se proyecta, qué bloquea
| Dato | Estado | Efecto |
|---|---|---|
| Corte agregado del CRM (04/11): especialistas contactados/verificados/disponibles, usuarios en lista de espera | **falta** | Bloquea cualquier afirmación pública sobre esos estados (hoy `null`, solo notas) |
| 56 especialistas registrados | informado, sin auditar | Se muestra rotulado "Dato informado por el fundador" |
| Tres PDF originales de ATICMA | **no adjuntos** | Bloquea citar páginas como verificadas (`matriz-pdf.md` advierte) |
| Duración oficial y formato de la semifinal | falta | Se usa 180 s como hipótesis |
| Destinos QR definitivos (¿formulario de la landing abierto?) | falta | QR rotulados "Destino provisorio"; deck en `borrador` |
| Monto, instrumento y condiciones del pedido (FUND-03) | falta | Se muestra rango propuesto rotulado; sin valuación |
| Alcance del 5 % fundador, inicio del "primer año", tarifa del usuario post piloto | pendiente BUS-22/LEG-41 | Se proyecta por vigencia y cohorte, rotulado |
| Caja propia disponible | falta | Runway "no calculable" |
| Ticket, cobertura, aceptación, repetición, CAC | supuestos | Se proyectan; el piloto los mide |
| Viviendas MDP (Censo 2022) | prensa local, pendiente INDEC | Se muestra como dato observado sin verificar |

## Decisiones necesarias de Ignacio
1. Monto/instrumento del pedido. 2. Alcance del 5 % y definición MET-01 para el mes sin tarifa (con Metrics/Business).
3. Destinos de los QR y si se usa ruta estable. 4. Dónde corre el servidor (Render o VPS) y subdominios. 5. Si la versión ATICMA
mantiene el pedido de financiamiento o solo contactos/mentoría.

## Próximo ensayo propuesto
El ensayo integral del 30/10 ya pasó (sin registro de ejecución). Propuesta: **domingo 01/11** ensayo cronometrado en voz alta con la
versión `aticma` y recorte de guion; **martes 03/11** ensayo con proyector, dos teléfonos en redes distintas y una persona ajena que
explique qué entendió; **miércoles 04/11** corte de datos → `npm run publicar` → PDF/MP4/paquete finales.

## Siguiente lote
**9.1 Deploy** (`docs/deploy.md`) cuando haya accesos, o **9.3** (corte del 04/11) si no hay deploy antes de la semifinal.
Modelo recomendado: Sonnet 5.5 / Alto. Pase: "Retomá presentations-studio desde docs/handoff.md; ejecutá el lote 9.1 con los accesos X".

## Pase a Notion (preparado, no publicado)
TECH-37 sigue ⚪ Pendiente (no se cierra por esta sesión): motor implementado y probado en local, ensayo real pendiente.
Registrar en Bloque 6: dirección "núcleo reutilizable" (CO-PITCH-20261031) aplicada; hallazgo MET-01 vs. mes sin tarifa para Metrics/Business.

## Actualización 31/10 (tarde) · PDF, hub, v2 comercial, capturas y publicidades
- **PDF de ATICMA** leídos completos; las páginas del prompt coinciden con los originales. Matriz reescrita con títulos y autores
  reales. Cambios de contenido en el v1 (contenido, no estética): "o no hacer nada" (B p.17), propuesta como resultado (B p.16),
  "¿lo usan, vuelven, pagan?" (A p.10), escenas nuevas **etapa** (A p.9, C pp.15–16) y **anexo escalera** (A p.16), notas con
  señales rojas de unit economics (C p.47) y MRR no aplicable (C p.30).
- **Hub** (`/`): elige presentación y versión con miniatura viva. Grupos Handyx, Eclipse y Pruebas del motor.
- **Handyx v2 comercial** (`decks/handyx-v2`, `datosDe: handyx` → mismas cifras): los Handys traen cada idea (entrada `traer`),
  app real en teléfono (elemento `telefono`), marca vs. marketing vs. gamificación + tabla, escalera de validación, proyecciones,
  publicidad 30 s (arranca sola), pedido y QR. Versiones: comercial (≈ 5 min), marca-marketing (2 min), reel de anuncios.
- **Publicidades** re-renderizadas: `brands/handyx/assets/video/anuncio-16x9.mp4` y `anuncio-9x16.mp4` (30 s, H.264+AAC).
  No se escucharon con audio ni se probaron en Safari/teléfono.
- **Capturas reales**: 20 en `brands/handyx/assets/capturas/` (`capturas.json`). Faltantes: desglose mano de obra/materiales
  (la app no lo tiene), mapa en vivo (no existe).
- Verificado: `npm run verify` (55 pruebas, 4 decks) y `npm run e2e` 19/19 (incluye hub y recorrido del v2).
- Roadmap completo por lote: `docs/plan-fases.md` (34 lotes con entrada, entregables, dependencia, horas y salida).

## Revisión 31/10 (noche) · el pitch tiene que vender
Pedido de Ignacio: "muy pobre, la landing vende más; a ATICMA no puedo pedirles nada; faltan datos de los PDF; más animaciones,
sonidos y animaciones dentro de la app; reusar kinetic-studio". Cambios:
- **ATICMA sin pedido.** Nuevo recorrido (177 s): espera de marca → gancho de la campaña (clip) → problema en golpes → los Handys
  arman el logo (clip) → vecino y especialista en movimiento (clips) → "Pensado para que estés tranquilo" (6 reglas con íconos,
  copy de la landing) → 56 registrados con conteo y confeti → un arreglo de $ 45.000 desarmado (paga $ 49.500 / recibe $ 40.500 /
  Handyx $ 9.000) → mercado de abajo hacia arriba + MiPyME (PDF C p.8) → lo que viene (el foco camina por los hitos) → equipo →
  placa de campaña (clip) → QR.
- **Datos de los PDF en pantalla** con fuente: MiPyME 99,5 % / 60 % empleo (C p.8), Argentina 2025 US$ 270 M en 73 rondas, 52 %
  pre-seed (C p.8), 70 % no devuelve el capital (C p.35) — escena `h-contexto` en la versión VC; escalera (A p.16), etapa (A p.9).
- **Ángel y VC** usan los clips largos de la app (pedido, presupuestos, cobro) y conservan etapa, piloto, escenarios y pedido propio.
- **v2 comercial**: suma "El vecino, en movimiento" y "El especialista, en movimiento" (3 clips cada uno) antes de las capturas reales.
- **Sonido** sintetizado y **clips con música**; MP4 de respaldo ahora empalma los clips originales (con audio) y las escenas grabadas.
- Verificado: verify (56 pruebas, 4 decks), e2e 19/19. **No verificado:** cómo suena (no se escuchó), clips en Safari/iPad, proyector.

## 02/11 · Pitch premium (estilo de las láminas de Ignacio) — cierre del motor
Decisiones aprobadas por Ignacio: nombre **Handyx**; **ATICMA sin pedido** (inversores: USD 30.000 + mentor); modelo con
**$ 80.000 → $ 16.000** rotulado "estimación a validar"; "pagás al terminar" sin "con tarjeta"; entrevistas 100/150 y
**43 de 100** como "interés medido". Deploy: **un servicio web en Render** (`render.yaml`).
- Nuevo deck `decks/handyx-pitch` (tema `handyx-premium`, comparte cifras con `handyx`): portada con Handys rotos, marca,
  259.623 hogares + 3 preguntas + 43/100, une a los dos (+ verificación), tres pantallas reales, la app en movimiento (clips),
  **modelo de negocio** (reparto $ 88.000 → $ 72.000 / $ 16.000 + tabla vs. Clickie), **mar rojo → Handyx toma lo mejor de cada
  uno → océano azul** (beneficios para vecino y especialista), por qué Handyx y no otro, TAM/SAM/SOM en círculos (+ proyección
  prudente por capacidad), **ya lo hicimos sin app** (5 trabajos el 30/10, 2 pidieron más, 56 preregistrados) + equipo, hitos,
  qué logramos / USD 30.000 y un mentor, QR. Versiones: ATICMA ≈ 4 min, ATICMA corta 3 min, Inversores ≈ 6 min.
- Motor: control móvil con **vista actual, deslizar ← → y menú ☰ Diapositivas con miniaturas**; hub agrupado; elementos
  `oceano`, `reparto`, `circulos`; cajas estilo lámina, etiqueta superior, tabla con fila destacada, elementos que salen,
  tema con títulos sin ensanchar; modo **mismo origen** para Render.
- Verificado: verify (57 pruebas, 5 decks) · E2E 21/21 (incluye menú del celular y deslizar) · revisión visual de todas las escenas.
- **No verificado:** deploy real en Render (cuenta de Ignacio), teléfonos reales entre redes, sonido en sala, Safari.
- Conflictos de datos registrados: 100/150 entrevistas reemplazan a "70 charlas"; ticket $ 80.000 (pitch) vs $ 45.000
  (landing/app); "SOM" de la lámina = mercado local total, acompañado de la proyección por capacidad ($ 30 M en 13 meses).

## 02/11 (tarde) · Docker + configurador para Hostinger
- `Dockerfile` (un contenedor: presentación + control del celular, usuario `node`, healthcheck), `.dockerignore`.
- `./configurar.sh` / `npm run configurar`: pregunta los datos y genera en `salida/deploy/` variables y secretos para GitHub,
  `cargar-en-github.sh` (gh), y para VPS `preparar-vps.sh` + `docker-compose.yml` + `Caddyfile` + `.env` (o `.htaccess` en compartido).
- `.github/workflows/deploy-hostinger.yml`: solo corre con `DEPLOY_HOSTINGER=true`; VPS por `docker save | ssh docker load`, compartido por rsync.
- El presentador detecta si no hay servidor de control (publicación estática) y lo avisa.
- Respuesta a "¿hace falta backend?": no para teclado/clicker; sí un servidor chico para el celular, que va en el mismo contenedor.
- Verificado: build y contenedor, control del celular contra el contenedor, configurador en los dos modos, clave SSH con OpenSSH,
  compose y Caddyfile validados. No verificado: Actions con secretos reales, VPS, DNS, certificado.

## 02/11 · Arquitectura final: Hostinger (estático) + Render (control)
Pedido de Ignacio: usar su Render pago como servidor aparte. `render.yaml` ahora crea solo `handyx-control` (sin web,
`ALLOWED_ORIGINS` = dominio de la presentación). Configurador: opción 1 = Hostinger + Render (genera `render-control.md`);
el workflow compila con `SERVIDOR_CONTROL` y verifica que Render responda. Todo-en-uno en Render quedó en
`deploy/render-todo-en-uno.yaml`; VPS con Docker sigue como opción 2. Probado en local con dos orígenes (403 a orígenes ajenos).

## 02/11 (noche) · Deploy con el mismo método que la landing
- `scripts/hostinger-publish.sh` y `scripts/hostinger-smoke.sh` copiados de la landing (perfil `presentaciones`, solo
  `presentaciones.handyc.com` o `handyc.com/presentaciones`); smoke también prueba Render (`/salud` y CORS del origen).
- `.github/workflows/deploy-hostinger.yml` con los nombres de la landing (`HOSTINGER_DEPLOY_ENABLED`, `HOSTINGER_HOST/PORT/USER/PATH`,
  `HOSTINGER_SSH_KEY`, `HOSTINGER_KNOWN_HOSTS`) + `DOMINIO`, `VITE_DECK`, `SERVIDOR_CONTROL`; entorno `hostinger-presentaciones`.
  VPS pasó a `.github/workflows/deploy-vps.yml`.
- Configurador (opción 1/3): pide los datos de la landing, permite reusar su clave y arma `known_hosts` con `ssh-keyscan`.
- Sin BE ni repo nuevo: el control es `server/` de este repo, servicio aparte en la misma cuenta de Render.
- Pendiente de Ignacio: subdominio `pitch`, servicio en Render, variables/secretos, merge a `main`.

## 02/11 (noche) · Render gratis + dominio presentaciones.handyc.com
- `render.yaml`: plan **free**. El presentador despierta el servidor (espera hasta 90 s con aviso) y lo consulta cada 4 min
  mientras está abierto; smoke con tiempos para arranque en frío. Abrir el presentador 5 min antes del pitch.
- Dominio: `presentaciones.handyc.com` (perfil `presentaciones` en `hostinger-publish.sh`, solo esa carpeta o `handyc.com/presentaciones`).
- Verificado en local: guard (carpeta ajena → salida 2), publicación del perfil, despertar del servidor en el navegador.

## 03/11 · Pitch ATICMA de tres minutos (versión abreviada del 03/11)
- Deck nuevo `decks/handyx-aticma` (versión `evento`, 180 s, `movimiento: reducido`): 4 pantallas principales + 6 anexos (A Evidencia,
  B Modelo y cobros, C Mercado y alternativas, D Producto y visión, E Crecimiento y metas, F Inversión). Afirmaciones propias con corte 03/11
  (modelo 0 % / 15 %, metas USD 100.000 y 72 como objetivos, USD 300.000 buscados, puente económico como proyección).
- Guion literal de 326 palabras en el campo `guion` de cada escena → `docs/handyx/aticma-3min-guion.md` (generado; verify lo comprueba).
  Fuentes, límites y pendientes: `docs/handyx/aticma-3min-fuentes-y-pendientes.md`; alternativas: `docs/handyx/aticma-3min-alternativas.md`.
- Motor: `forma.principales` (avanzar no entra a anexos; el servidor lo conserva), `movimiento` por versión, atajos Mayús + A…F y 0 en el
  presentador, posición recordada al refrescar el presentador, cifras largas que se achican a su columna, rótulos legibles en paletas oscuras,
  títulos de las miniaturas del presentador a tamaño real (la regla `.tablero h2` los achicaba).
- Ilustración `brands/handyx/assets/conceptos/circuito-conceptual.svg` (símbolos genéricos, rotulada "Ejemplo conceptual · visión").
- Capturas del prototipo fuera de la pantalla 2: muestran "comisión $ 0" del mes de lanzamiento y datos sintéticos ("12 trabajos realizados").
- Verificado: verify, e2e 27/27 (incluye 6 comprobaciones del deck nuevo), capturas 1920×1080 y 1366×768 de las 10 escenas, PDF (10 páginas)
  y lectura. Control remoto y reconexión: probados por el e2e con el deck `handyx` (mismo motor), no con un celular real.
- Pendiente: ensayo cronometrado, alinear el 0 % / 15 % con apps y landing, fuentes bloqueadas en esta red (Clickie, Muovi, Taskrabbit,
  censo municipal), conciliación de los cinco cobros, fechas del trimestre comercial.

## 04/11 · Pitch ATICMA 2026 de siete diapositivas (prompt maestro del 04/11; reemplaza el corte de 4 pantallas)
- `decks/handyx-aticma`: 7 diapositivas (25/30/22/21/26/26/30 s) + 7 láminas de respaldo (A unit economics, B validación, C roadmap,
  D competidores, E inversión, F preguntas 1/2 y 2/2). Versiones `evento` (ligero) y `estatica` (reducido). Guion oficial literal (400 palabras).
- Afirmaciones al 04/11: 0 % / 15 %, metas 20 % / USD 100.000 / 72 / 40 % como objetivos, inversión USD 100.000 (≠ ingresos), hogares
  259.623 (unidad a confirmar). Trabajos y registrados informados quedan solo en notas hasta conciliar.
- Nuevo: concepto `brands/handyx/assets/conceptos/handia-concepto.svg` (rotulado), modo de ensayo en el presentador (Finalizar, registro de
  intentos en la pestaña, barra de progreso, tiempo por diapositiva medido con el reloj, Nuevo ensayo, N oculta notas, próxima transición,
  tramo), F en el presentador, PDF con una página por paso cuando algo sale de escena, `npm run exportar:pptx`.
- Docs: `docs/handyx/aticma-{guion,validacion,preguntas,ajustes-sugeridos}.md`, capturas en `docs/handyx/capturas-aticma/`.
- Verificado: verify, e2e 32/32, capturas 1920 y 1366, PDF 15 p., lectura 17 p., PPTX 15. Pendientes en `aticma-validacion.md`.
- 04/11 (tarde): pedido de Ignacio — las pantallas de celular salen de la **demo de la landing** (la app todavía se está puliendo):
  `brands/handyx/assets/demo-landing/` (HandIA en uso, inicio, describir, agendas, mensajes, pedido nuevo) + `scripts/landing/`. Se descartan
  las pantallas con la tarifa anterior. Se quitó el concepto dibujado de HandIA.
- 04/11 (noche): pedido de Luigi (mentor ATICMA): diapositiva 5 con la cuenta de mercado (supuestos rotulados), diapositiva 6 como mapa
  por modelo de cobro con competidores de Argentina, región y EE. UU./Europa; anexos A proyección, B unit economics (CAC, LTV, IA + servidor),
  E y F competidores. 9 anexos (A–I). ⚠ Con sus supuestos el 20 % del trimestre da ≈ USD 78.000, no 100.000: ver ajustes sugeridos §4.
- 04/11 (noche, 2): 25 % en el guion; costos mensuales (USD 400), equilibrio, CAC/LTV con supuestos rotulados; inversión 40/35/25 (propuesta);
  respaldo visual (cifras, barras, íconos Lucide nuevos, mosaicos con columnas y rótulos agrupados) y 10 diapositivas de preguntas del jurado.
  Motor: formato `usd`, `columnas` en mosaicos, rótulos agrupados en grillas, texto legible en nodos y cajas sobre fondo azul.
- 04/11 (noche, 3): tickets reales de la prueba (4 × $ 50.000 + 1 × $ 150.000, de memoria de Ignacio: $ 350.000, promedio $ 70.000 ≈ USD 45);
  con ese ticket el 25 % del trimestre da ≈ USD 109.000. Respaldo «De 6 a 72 profesiones» con ejemplos (no confirmados). Preguntas: Mayús + J…U.
- 05/11: intro animada con los Handys; respaldo de UX + IA, marca, publicidades, marketing, herramientas por oficio (diseños propuestos en
  `brands/handyx/assets/conceptos/herramientas-*.webp`), negocios, plan de 3 meses, cada dólar (45/30/15/10) y USD 1 millón; 14 preguntas.
  Video re-renderizado: intro + pitch + preguntas con respaldo (`scripts/video-pitch/`).
- 05/11 (2): mapa de crecimiento People/Business, USD 5 M a fines de 2027 con supuestos, Handyx for Business (turnos fijos y app del local),
  profesiones B2B; pregunta 14 «¿Hasta dónde puede crecer Handyx?».
- 05/11 (3): láminas «Plan · mes 1/2/3»; video re-montado con cámara sincronizada a la transcripción, frases clave, final del mundo roto
  arreglado por los Handys y preguntas animadas (`scripts/video-pitch/montaje/`).
