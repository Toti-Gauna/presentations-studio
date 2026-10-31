# Lote 0.1 · Auditoría (31/10/2026)

Fuentes efectivamente leídas en esta sesión: los 8 repositorios de la sesión, el zip de láminas adjunto, Notion
(Contexto Handy, TECH-37, Bloque 6, "Fase paralela · ATICMA 05/11", decisión CO-PITCH-20261031), **los tres PDF de ATICMA**
(recibidos después; leídos completos, ver `docs/handyx/matriz-pdf.md`) y kinetic-studio (lectura). No se consultaron Roadmap ni Decisiones completos.

## Inventario

| Pieza | Estado real al 31/10 | Evidencia |
|---|---|---|
| `presentations-studio` | Vacío al empezar (sin commits). Ahora: motor, servidor, pitch, docs. | git |
| Landing (`Handy-landing-page-fe`) | Construida; publicación automática a Hostinger condicionada a variable del repo; formulario "habilitado en breve" hasta aviso definitivo. | `CLAUDE.md`, `docs/modulos/trailers.md` |
| Backend de captación + CRM (`Handy-landing-page-be`) | Implementado y probado **en local**; nada desplegado (handoff 27/10). | `handoff.md` |
| Portal interno (`handy-internal-portal`) | Mock completo + conexión local; no desplegado (29/10). | `docs/handoff.md` |
| PWA usuario / especialista (`handyx-client-fe`, `handyx-specialist-fe`) | Mockups navegables con datos de prueba; nada conectado ni desplegado (29/10). | `docs/handoff.md` |
| Backends transaccionales (`handyx-client-be`, `handyx-specialist-be`) | Commit inicial (solo README). | git |
| Personajes | 8 láminas 1536×1024, 2×2 poses sobre verde (29/10). Recortadas a 32 WebP con alfa. Foco = bombilla (usuario), llave = especialista. Sin rig articulado. | `brands/handyx/assets/personajes` |
| Marca | Tokens, logo, Archivo 900 + DM Sans, copy aprobado (MKT-11): "Soluciones, no problemas", "¿Se rompió algo en casa?", "Tus herramientas. Tu precio." | landing `src/brand/tokens.ts`, `src/content/*.json` |
| Video | Trailers de 70 s (usuario/especialista), H.264 con póster; mencionan "Primer mes sin tarifa" y 10 % + 10 %. | landing `assets/video` |
| Comercial "Verano" | No encontrado en los repos. | — |
| Publicidades kinetic-studio | `exports/handy-anuncio-16x9.mp4` y `handy-vertical-9x16.mp4` (30 s) **desactualizadas**: "Handy", "Llegamos el 28/10", tarifa cliente 5 %. Re-renderizadas con Handyx, 10/11, "Primer mes sin tarifa" y 10 % (patch en `docs/handyx/anuncios/`). | kinetic-studio `exports/` |
| Capturas de las PWA | 20 capturas reales del prototipo en modo de prueba (banner visible, datos sintéticos). Las apps muestran "Comisión de Handy $ 0 (0 %)" durante la demo y todavía dicen "Handy" en algunos textos. | `brands/handyx/assets/capturas/` |
| Infraestructura | Declarada por Ignacio: Hostinger, Render, VPS. Desde este contenedor `landing.handyc.com` y `api.handyc.com` no son alcanzables (el proxy de la sesión los bloquea): **no se pudo verificar** qué está publicado. | `curl` 403 del proxy |

## Contradicciones detectadas

1. **Tarifas.** Notion (23/10): 10 % + 10 %, primeros 50 especialistas al 5 % (duración pendiente), primer trabajo del usuario bonificado.
   Landing (27/10): primer mes sin tarifa desde el 10/11 y camada fundadora 5 % por 12 meses **después** de ese mes.
   PWA: fee 0 % del 10/11 al 10/12. Prompt (31/10): "0 % el primer mes/demo y 5 % a especialistas durante el primer año".
   → Se modela por **vigencia y cohorte** (`decks/handyx/escenarios.json`): mes 1 = 0/0; luego 10/10; fundadores 5 % con
   duración = supuesto 12 meses; variante "5 % para todos el primer año". Con ≤ 50 especialistas activos ambas lecturas coinciden.
   **Decisión pendiente:** alcance del 5 % (¿50 primeros o todos?), cuándo empieza el año, bonificación del primer trabajo después del piloto.
2. **MET-01 vs. mes sin tarifa.** MET-01 cuenta un trabajo cuando Handy cobró su tarifa → los trabajos del piloto (10/11–10/12) **no cuentan**.
   En el escenario base, al 31/12 habría ≈ 15 trabajos con tarifa (≈ 33 pagados): la meta de 50 queda muy exigida con la definición
   vigente. Propuesta a Metrics/Business: medir por separado **trabajo pagado por el usuario** y **trabajo con tarifa cobrada**; no
   cambiar la meta ni sumar registros. El modelo ya separa `trabajos` y `trabajosConTarifa`.
3. **Fecha de ensayo.** El ensayo integral del 30/10 ya pasó; no hay registro de que haya ocurrido. Próximo ensayo propuesto: ver `handoff.md`.
4. **TECH-37** pedía una presentación fija; la dirección del 31/10 pide núcleo reutilizable. Se registra la evolución; TECH-37 no se cierra.
5. **"Especialistas verificados"** es copy de la landing (proceso previsto). Los 56 son **registrados**: el pitch nunca los llama verificados.

## Dependencias externas

PDF originales · corte del CRM · bases ATICMA · accesos de deploy y DNS · destinos QR definitivos · monto del pedido ·
arte articulado de personajes (opcional) · teléfonos y proyector para el ensayo.
