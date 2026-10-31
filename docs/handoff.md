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
