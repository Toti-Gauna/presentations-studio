# Roadmap completo (fases, lotes, modelo y esfuerzo) · actualizado 31/10/2026

Ejecución de corrido: cada lote cierra con `npm run verify` + `npm run e2e`; lo que solo puede hacer una persona va al checklist humano (Fase 9) y no frena la cadena. Deploy al final. Modelo y esfuerzo son recomendaciones (los elige Ignacio en la interfaz).

Horas = tiempo humano estimado de Ignacio (revisión, decisiones, pruebas físicas), no garantía. Estados: ✅ hecho y verificado · 🟡 parcial · ⏳ pendiente.

| Fase | Lote | Modelo / esfuerzo | Entrada | Trabajo | Entregables | Depende de | Horas humanas | Criterio de salida | Estado |
|---|---|---|---|---|---|---|---|---|---|
| 0 · Auditoría y kit de entrada | 0.1 | Opus / Alto | Repos, Notion, zip de personajes | Inventario de lo implementado/faltante, contradicciones (tarifas, MET-01, fechas), dependencias | docs/auditoria.md | — | 0,5 h (leer y corregir) | Inventario con evidencia por pieza; contradicciones con propuesta | ✅ |
|  | 0.2 | Opus / Extra alto | 0.1 | ADR de arquitectura, P0/P1/P2, kit de entrada con valores por defecto rotulados | docs/adr/ADR-0001-arquitectura.md, handoff § datos | 0.1 | 0,5 h | ADR aceptado; cada insumo humano tiene valor por defecto | ✅ |
| 1 · Núcleo determinista | 1.1 | Sonnet / Alto | ADR | Esquema Deck/Scene/Step/Theme/Asset/PublicQr/Claim/PublishedVersion, validación cruzada, deck técnico neutro | src/core/esquema.ts, validar.ts, decks/tecnico | 0.2 | 0,25 h | npm run validar en verde con el deck técnico | ✅ |
|  | 1.2 | Sonnet / Alto | 1.1 | Máquina de estados pura (escena/paso/medio/negro/reloj), teclado | src/core/estado.ts, tests/estado.test.ts | 1.1 | 0,25 h | Pruebas de avanzar/retroceder/saltar/reiniciar sin desincronizar | ✅ |
|  | 1.3 | Opus / Alto | 1.1–1.2 | Puerta: núcleo sin marca, sin acoplamientos | grep sin menciones de marca en src/core, render, server | 1.2 | — | 0 menciones de marca en el núcleo | ✅ |
| 2 · Vistas y transporte local | 2.1 | Sonnet / Alto | Núcleo | Pantalla pública 16:9, presentador, control móvil, exportación; estados de carga/error/desconexión | src/vistas/*, src/transporte/local.ts | 1.3 | 0,5 h (probar en tu compu) | Build + capturas sin errores de consola | ✅ |
|  | 2.2 | Sonnet / Alto | 2.1 | QR públicos A/B, índice, notas, reloj, ensayo, pantalla negra, ruta manual de ventanas | src/core/qr.ts, presentador | 2.1 | 0,25 h | E2E: teclado, negro, QR en pantalla | ✅ |
|  | 2.3 | Opus / Alto | 2.2 | Puerta: legibilidad a distancia y separación público/privado | correcciones de la revisión visual | 2.2 | 0,5 h (mirar en proyector cuando haya) | Sin notas en la pública; textos ≥ 24 px a 1920 | ✅ |
| 3 · Visual, motion y personajes | 3.1 | Opus / Extra alto | Marca de la landing, zip | Biblia visual/motion, paletas por acto, recorte de los 8 Handys (32 poses), tomas externas especificadas | docs/handyx/biblia-visual.md, brands/handyx | 2.3 | 1 h (diseñadora valida) | Personajes sin bordes verdes; reglas de dueño por propiedad | ✅ |
|  | 3.2 | Sonnet / Alto | 3.1 | Línea de tiempo reconstruible por paso, transiciones, continuidad (FLIP), tipografía cinética, actuación por poses, personajes que traen piezas | src/render/movimiento.ts | 3.1 | 0,25 h | Ida y vuelta sin acumular transformaciones | ✅ |
|  | 3.3 | Sonnet / Alto | 3.2 | Movimiento reducido, modo ligero, precarga, fallback de medios y de arte faltante | ?movimiento=reducido|ligero | 3.2 | — | Carga sin recursos externos (E2E) | ✅ |
| 4 · Servidor de sesiones (local) | 4.1 | Sonnet / Alto | 2.x | Sesiones, tokens por rol, QR privado de un uso con aprobación, confirmaciones, reconexión | server/ | 3.3 | 0,25 h | Pruebas de integración WS en verde | ✅ |
|  | 4.2 | Sonnet / Alto | 4.1 | Versiones congeladas, redirección QR estable A/B, datos compartidos entre decks | npm run publicar, /r/<id>, datosDe | 4.1 | — | Redirección ignora parámetros del visitante | ✅ |
|  | 4.3 | Opus / Extra alto | 4.2 | Puerta: autoridad del estado, duplicados, permisos, fallas de red | E2E 17/17 | 4.2 | — | Foto del QR no empareja; sin doble avance; caída del servidor → local | ✅ |
| 5 · Argumento Handyx | 5.1 | Opus / Alto | 3 PDF, Notion, repos | Lectura completa de los PDF, matriz por página, registro de afirmaciones | docs/handyx/matriz-pdf.md, afirmaciones.json | 4.3 (no bloquea) | 0,5 h (revisar matriz) | Páginas verificadas; cifras de terceros fuera | ✅ |
|  | 5.2 | Opus / Extra alto | 5.1 | Modelo económico, escenarios, sensibilidad, marketing físico/digital, 6 experimentos | src/econ, escenarios.md, growth.md | 5.1 | 1 h (validar supuestos) | Fórmulas probadas; cifras del pitch = modelo (prueba) | ✅ |
|  | 5.3 | Opus / Extra alto | 5.2 | Tesis, guion maestro, versiones ATICMA/60 s/ángel/VC, 24 preguntas | tesis-y-guion.md, preguntas.md | 5.2 | 1 h (leer en voz alta) | Duraciones dentro del objetivo | ✅ |
| 6 · Producción del pitch | 6.1 | Sonnet / Alto | 5.3 | Configuración del pitch institucional (v1) con Claude, gráficos, demo rotulada, QR | decks/handyx | 5.3 | 0,5 h | npm run validar | ✅ |
|  | 6.2 | Opus / Extra alto | 6.1 | Dirección de personajes, composición y ritmo; specs de medios externos | biblia-visual.md § tomas | 6.1 | 0,5 h | Revisión visual sin superposiciones | ✅ |
|  | 6.3 | Sonnet / Alto | 6.2 | Integración, duración, accesibilidad, performance | — | 6.2 | — | ATICMA 180 s exactos | ✅ |
|  | 6.4 | Sonnet / Alto | 6.3, PDF | Pitch v2 comercial: personajes que traen cada idea, marca vs. marketing vs. gamificación, escalera de validación, proyecciones; hub de selección | decks/handyx-v2, hub (index) | 6.3 | 0,5 h | Misma base de datos que v1 (datosDe); validar en verde | ✅ |
|  | 6.5 | Sonnet / Alto | 6.4 | Capturas reales del prototipo en teléfono; publicidades kinetic-studio re-renderizadas con Handyx/10-11/tarifa vigente | brands/handyx/assets/capturas, video/anuncio-*.mp4 | 6.4 | 0,5 h (mirar videos con audio) | Sin datos personales; sin 'Handy', '28/10' ni '5 %' al cliente | 🟡 ver handoff |
| 7 · Respaldo y ensayo automatizado | 7.1 | Sonnet / Alto | 6.x | Paquete local, PDF diapositivas + PDF de lectura, MP4 | salida/ | 6.5 | — | Paquete extraído anda sin red | ✅ |
|  | 7.2 | Sonnet / Alto | 7.1 | Ensayo E2E local: doble toque, corte, caída del servidor, sin recursos externos | e2e/recorrido.ts | 7.1 | — | npm run e2e en verde | ✅ |
|  | 7.3 | Opus / Extra alto | 7.2 | Tres revisiones (creativa, negocio, escéptica), rúbrica interna, cinco correcciones | revision-excelencia.md | 7.2 | 1 h (persona ajena) | ≥ 90/100 sin fallas críticas (hoy 84) | 🟡 84/100 |
| 8 · Eclipse (producto) | 8.1 | Opus / Extra alto | Motor probado | Comprador, problema y formato comercial | docs/eclipse/roadmap.md | 7.3 (no bloquea ATICMA) | 0,5 h | Recomendación: servicio productizado | ✅ |
|  | 8.2 | Sonnet / Alto | 8.1 | Segunda marca y deck sin tocar el núcleo | decks/eclipse-demo | 8.1 | — | 0 cambios en src/ y server/ | ✅ |
|  | 8.3 | Sonnet / Alto | 8.2 | Flujo Claude crear/modificar: brief, prompts, validación, vista previa, publicación | docs/claude/ | 8.2 | 0,25 h | Prompts probados sobre eclipse-demo | ✅ |
|  | 8.4 | Opus / Extra alto | 8.3 | Evaluar (sin implementar) editor vs. Claude vs. SaaS | roadmap.md § 8.4 | 8.3 | 0,25 h | Criterios de entrada definidos; decisión abierta | ✅ |
|  | 8.5 | Sonnet / Alto | 8.4 | Oferta inicial empaquetada (borrador, sin publicar) | docs/eclipse/oferta.md | 8.4 | 0,5 h | Precio a definir con pilotos | ✅ borrador |
| 9 · Deploy y verificación (al final) | 9.1 | Sonnet / Alto | Accesos Hostinger + Render/VPS + DNS | Publicar build estático y servidor WSS; orígenes, salud, redirecciones | docs/deploy.md, deploy/ | 8.5 (o antes si se quiere remoto el 05/11) | 1–2 h (accesos, DNS) | /salud por HTTPS; WSS solo desde el origen permitido | 🟡 preparado |
|  | 9.2 | Sonnet / Alto | 9.1, teléfonos, proyector | Prueba entre redes (datos ↔ Wi-Fi), QR A/B reales desde la última fila, iOS/Android | checklist humano | 9.1 | 1,5 h | Control por internet confirmado; QR leídos | ⏳ |
|  | 9.3 | Sonnet / Medio | Corte CRM 04/11 | Corte de datos, publicar versión congelada, PDF/MP4 finales, guía de función, tag | decks/handyx/publicadas/… | 9.2 (o 7.x si no hay deploy) | 1 h | Huella publicada visible en el presentador | ⏳ |
|  | 9.4 | Opus / Alto | 1–3 clientes | Pilotos Eclipse: horas, intervención, fallas, margen | registro de pilotos | 9.3 | según clientes | Decisión de siguiente alcance | ⏳ depende de terceros |

Total: 10 fases, 34 lotes.

**Atajo ATICMA:** si se quiere control por internet el 05/11, correr 9.1–9.2 antes de la Fase 8; nada más cambia.

## Checklist humano (no bloquea código)
1. Corte agregado del CRM al 04/11. 2. Bases y duración oficial ATICMA. 3. Destinos QR definitivos. 4. Monto/instrumento del pedido; alcance del 5 %; definición MET-01. 5. Accesos de deploy y DNS. 6. Ensayo con proyector, dos teléfonos en redes distintas y una persona ajena. 7. Escuchar las publicidades con audio y verlas en iPhone/Android (Safari).
