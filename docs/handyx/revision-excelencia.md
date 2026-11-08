# Revisión de excelencia (lote 7.3) · interna, 31/10/2026

Tres pasadas separadas (dirección creativa, coherencia de negocio, evaluador escéptico) sobre la versión ATICMA.
Rúbrica **interna** de 100 puntos: no es la del concurso, no estima probabilidad de pasar ni es certificación externa.

## Primera pasada · cinco debilidades con más efecto

1. **Composición rota**: elementos de posición libre (título de apertura, personajes) caían en la grilla y se superponían. → corregido (CSS de especificidad) y validador que **impide** dos elementos en la misma área.
2. **Legibilidad a distancia**: tablas, listas y flujo en 28–38 px; listas centradas. → subidos a 36–46 px, alineación izquierda, cifra en pesos sin cortar línea.
3. **Logo invisible** (azul sobre azul) y personajes tapando el título en el encuentro y el cierre. → logo retirado de esa escena; reubicación de personajes.
4. **MET-01**: la meta "50 trabajos cobrados" no es alcanzable con la definición vigente si el piloto es sin tarifa; decirlo en el pitch sería una cuenta que no cierra. → la meta se muestra como **Objetivo** y la contradicción va a notas, anexo de estados y pregunta 20; pedido a Metrics/Business.
5. **Pedido sin cifra**: un "pedido de apoyo" sin rango es débil. → rango propuesto $ 3–6 M derivado del consumo del escenario base, rotulado y marcado como decisión pendiente.

## Segunda pasada · correcciones aplicadas
Guion, composición y anexos afectados corregidos (ver commits del 31/10). Capturas de verificación a 1920×1080 tomadas con Chromium.

## Tercera pasada · comprobación y límites abiertos
- Todas las cifras en pantalla vienen del registro de afirmaciones y llevan rótulo automático; pruebas verifican que coinciden con el modelo.
- Duraciones: ATICMA 180 s exactos (sin margen: ensayar en voz alta y recortar guion si se pasa).
- **No comprobado:** lectura en proyector real, QR desde la última fila, audio del lugar, persona ajena que explique lo que entendió.

## Rúbrica interna

| Dimensión | Peso | Puntaje | Justificación |
|---|---|---|---|
| Problema, cliente y propuesta de valor | 15 | 13 | Situación concreta y dos lados; el problema se apoya en charlas exploratorias, sin medición. |
| Evidencia, fuentes y hechos vs. proyecciones | 20 | 18 | Rótulos automáticos, `null` para lo no medido, fuentes y cortes; falta corte del CRM y PDF originales. |
| Modelo económico, caja y crecimiento | 15 | 12 | Fórmulas probadas y escenarios; casi todo son supuestos; runway no calculable sin caja. |
| Equipo, capacidad, hitos y pedido | 10 | 8 | Hitos claros y pedido con rango; monto e instrumento pendientes. |
| Narrativa, síntesis y recordación | 10 | 8 | Arco claro y copy aprobado; falta ensayo en voz alta con tiempo real. |
| Diseño, personajes y motion con propósito | 15 | 11 | Paletas por acto, continuidad, tipografía cinética; personajes por poses (sin rig articulado). |
| Duración, legibilidad, control remoto y recuperación | 10 | 9 | Respaldo local/PDF/MP4, E2E de cortes; falta proyector y redes distintas reales. |
| Objeciones y anexos | 5 | 5 | 24 preguntas y 7 anexos. |
| **Total** | **100** | **84** | Por debajo del objetivo editorial de 90: no se declara "listo". |

**Bloqueantes para declarar listo** (aunque la suma subiera): corte del CRM al 04/11, destinos QR definitivos, duración oficial
confirmada, ensayo con proyector y teléfonos reales. Mejoras de mayor efecto para llegar a 90: corte real del CRM (+2 evidencia),
ensayo cronometrado y recorte de guion (+2 narrativa), rig de personajes o tomas producidas para apertura/encuentro (+2 diseño).
