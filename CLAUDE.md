# Presentations Studio · instrucciones para Claude

Retomar siempre desde `docs/handoff.md`. Plan: `docs/plan-fases.md` (10 fases, deploy al final). Español rioplatense con voseo.

## Reglas que no se negocian
- **Núcleo sin marca:** `src/core`, `src/render`, `src/transporte`, `server/` no mencionan Handyx ni tarifas. Lo de cada marca vive en `brands/<marca>` y `decks/<deck>`.
- **Cifras solo por afirmaciones:** todo número en pantalla es `{{ID}}` de `decks/<deck>/afirmaciones.json` con tipo, fuente, corte y verificación.
  Desconocido = `null` (solo notas). Proyección con fórmula. Nunca inventar usuarios, ventas, testimonios, alianzas ni crecimiento.
- **Handyx:** 56 especialistas = *registrados* (informado por Ignacio 31/10, sin auditar); nunca "verificados" ni "activos". Demo siempre rotulada.
  Tarifas por vigencia/cohorte; lo pendiente se rotula. MET-01 separado de trabajos pagados. Sin valuación ni términos de inversión inventados.
- **Seguridad del control:** el QR privado nunca se proyecta ni se define en un deck; los QR públicos no llevan tokens; notas solo a roles privados.
- **Movimiento:** cada propiedad animada tiene un solo dueño (ver `docs/handyx/biblia-visual.md`); el estado visual se reconstruye desde (escena, paso).
- **Sin editor visual** (decisión: crear y modificar con Claude, `docs/claude/`). No comprar infraestructura ni desplegar sin autorización.
- Datos de prueba sintéticos. Nada de datos personales del CRM en el escenario.

## Antes de cerrar un lote
`npm run verify` y `npm run e2e` en verde; anotar en `docs/progreso.md`; actualizar `docs/handoff.md`.
Si cambia el deck Handyx: `python3 -I scripts/generar-guion.py` y `npm run escenarios`. Si cambia `decks/handyx-aticma`: `python3 -I scripts/generar-guion-aticma.py` (verify lo comprueba).
