# Plan de fases · ejecución de corrido (revisión 31/10/2026)

Reorganiza las 10 fases y 32 lotes del prompt maestro (rev. 3) para que se ejecuten **una detrás de otra sin
esperas humanas dentro de la cadena** y con **el deploy al final**, como pidió Ignacio.

## Qué cambia respecto del prompt original y por qué

| Cambio | Motivo |
|---|---|
| **Kit de entrada único** en la Fase 0 (todo lo que solo puede dar una persona) | Las esperas por insumos (PDF, corte del CRM, bases ATICMA, destinos QR, montos) frenaban lotes en el medio. Ahora cada insumo tiene un **valor por defecto rotulado** (`null`, supuesto o "provisorio") y la cadena sigue; el insumo real reemplaza el valor cuando llega. |
| **Puertas automáticas** (`npm run verify` + `npm run e2e`) al cierre de cada lote | "No abrir más de un lote a la vez" se cumple sin pedir revisión manual para avanzar: el lote cierra cuando la puerta pasa. |
| **El servidor de sesiones se construye y prueba en localhost** (Fase 4) y el **deploy** (Hostinger + Render/VPS, HTTPS/WSS, prueba entre redes) pasa a la **Fase 9, la última** | Pedido explícito. El motor es usable localmente desde la Fase 2 y con celular en red local desde la Fase 4. |
| Respaldo (PDF/MP4/paquete local) y ensayo automatizado se juntan en la Fase 7, antes de Eclipse | El respaldo no depende del deploy. |
| Lo que exige personas o hardware (teléfonos reales, proyector, jurado de prueba, clientes piloto) se acumula en el **checklist humano** de la Fase 9 | No bloquea lotes de código; se ejecuta cuando hay acceso. |
| Revisiones "Opus" como puertas cortas al final de cada fase, no como lotes que esperan a una persona | Mismo control de calidad, sin cortar la ejecución. |

**Atajo ATICMA:** si se quiere control por internet el 05/11, la Fase 9 (deploy) se corre **antes** de la 8 (Eclipse); no cambia
nada más. El pitch ya funciona local con teclado/clicker y con el celular en la misma red.

## Fases, lotes, modelo y esfuerzo

Modelo: **Opus** = Claude Opus 5.5 (arquitectura, dirección, análisis difíciles); **Sonnet** = Claude Sonnet 5.5
(implementación repetible). Esfuerzo: Medio / Alto / Extra alto (xhigh). El modelo lo elige Ignacio en la interfaz: el
texto solo lo recomienda. Estado al 31/10: ver columna "Estado" (✅ hecho y verificado en esta sesión · 🟡 parcial · ⏳ pendiente).

| Fase | Lote | Modelo / esfuerzo | Trabajo | Salida comprobable | Estado |
|---|---|---|---|---|---|
| **0 · Auditoría y kit de entrada** | 0.1 | Opus / Alto | Repos, Notion, marca, assets; inventario, contradicciones, dependencias | `docs/auditoria.md` | ✅ |
| | 0.2 | Opus / Extra alto | ADR, P0/P1/P2, kit de entrada con valores por defecto rotulados | `docs/adr/ADR-0001-arquitectura.md`, `docs/handoff.md` § datos | ✅ |
| **1 · Núcleo determinista** | 1.1 | Sonnet / Alto | Esquema Deck/Scene/Step/Theme/Asset/PublicQr/Claim/PublishedVersion + validación cruzada + deck técnico neutro | `npm run validar` | ✅ |
| | 1.2 | Sonnet / Alto | Máquina de estados pura, teclado, pruebas (avanzar/retroceder/saltar/reiniciar) | `tests/estado.test.ts` | ✅ |
| | 1.3 | Opus / Alto | Puerta: núcleo sin marca, sin acoplamientos | `src/core` sin "Handyx" (`grep`) | ✅ |
| **2 · Vistas y transporte local** | 2.1 | Sonnet / Alto | Pantalla pública, presentador, control móvil, estados de carga/error/desconexión | build + capturas | ✅ |
| | 2.2 | Sonnet / Alto | QR públicos A/B, índice, notas, reloj, pantalla negra, ensayo, ruta manual de ventanas | E2E 1–2 | ✅ |
| | 2.3 | Opus / Alto | Puerta: legibilidad a distancia y separación público/privado | correcciones de la revisión visual | ✅ |
| **3 · Sistema visual, motion y personajes** | 3.1 | Opus / Extra alto | Biblia visual/motion, tokens Handyx, recorte de los 8 Handys, storyboard | `docs/handyx/biblia-visual.md` | ✅ |
| | 3.2 | Sonnet / Alto | Línea de tiempo reconstruible por paso, transiciones, continuidad (FLIP), cambio de paleta, actuación por poses | apertura → encuentro | ✅ |
| | 3.3 | Sonnet / Alto | Movimiento reducido, modo ligero, precarga, fallback de medios y arte faltante | `?movimiento=reducido|ligero` | ✅ |
| **4 · Servidor de sesiones (local)** | 4.1 | Sonnet / Alto | Sesiones, tokens por rol, QR privado con aprobación, confirmaciones, reconexión | `tests/servidor.test.ts` | ✅ |
| | 4.2 | Sonnet / Alto | Versiones congeladas, redirección QR estable A/B, exportación | `npm run publicar`, `/r/<id>` | ✅ |
| | 4.3 | Opus / Extra alto | Puerta: autoridad del estado, duplicados, permisos, fallas de red | E2E 3–7 | ✅ |
| **5 · Argumento Handyx** | 5.1 | Opus / Alto | Fuentes, registro de afirmaciones, matriz PDF/página | `docs/handyx/matriz-pdf.md` | 🟡 PDF no adjuntos |
| | 5.2 | Opus / Extra alto | Modelo económico, escenarios, capacidad, marketing y growth | `npm run escenarios`, `tests/modelo.test.ts` | ✅ |
| | 5.3 | Opus / Extra alto | Tesis, guion maestro, versiones ATICMA/60 s/ángel/VC, 20+ preguntas | `docs/handyx/tesis-y-guion.md`, `preguntas.md` | ✅ |
| **6 · Producción del pitch** | 6.1 | Sonnet / Alto | Configuración del pitch con Claude, gráficos, demo rotulada, QR | `decks/handyx/deck.json` | ✅ |
| | 6.2 | Opus / Extra alto | Dirección de personajes, composición, ritmo; especificaciones de medios externos | `biblia-visual.md` § tomas | ✅ |
| | 6.3 | Sonnet / Alto | Integración, duración, accesibilidad, performance | `npm run validar` (duraciones) | ✅ |
| **7 · Respaldo y ensayo automatizado** | 7.1 | Sonnet / Alto | Paquete local, PDF diapositivas + PDF de lectura, MP4 | `salida/` | ✅ |
| | 7.2 | Sonnet / Alto | Ensayo E2E local: doble toque, corte, caída del servidor, sin recursos externos | `npm run e2e` | ✅ |
| | 7.3 | Opus / Extra alto | Tres revisiones (creativa, negocio, escéptica), rúbrica, cinco correcciones | `docs/handyx/revision-excelencia.md` | ✅ (interna) |
| **8 · Eclipse (producto)** | 8.1 | Opus / Extra alto | Comprador, problema y formato comercial | `docs/eclipse/roadmap.md` | ✅ (recomendación) |
| | 8.2 | Sonnet / Alto | Segunda marca y deck sin tocar el núcleo | `decks/eclipse-demo` | ✅ |
| | 8.3 | Sonnet / Alto | Flujo Claude crear/modificar: prompts, validación, vista previa, publicación | `docs/claude/` | ✅ |
| | 8.4 | Opus / Extra alto | Evaluar (sin implementar) editor vs. seguir con Claude vs. SaaS | `roadmap.md` § decisión | ✅ (abierta) |
| | 8.5 | Sonnet / Alto | Empaquetar oferta inicial (servicio productizado) | `docs/eclipse/oferta.md` | ✅ (borrador) |
| **9 · Deploy y verificación en producción (al final)** | 9.1 | Sonnet / Alto | Hostinger (estático) + Render o VPS (sesiones WSS), orígenes, salud, redirecciones | `docs/deploy.md`, `deploy/` | 🟡 preparado, no ejecutado |
| | 9.2 | Sonnet / Alto | Prueba entre redes (datos móviles ↔ Wi-Fi), QR A/B reales, proyector y teléfonos | checklist humano | ⏳ |
| | 9.3 | Sonnet / Medio | Corte de datos 04/11, `publicar`, PDF/MP4 finales, guía de función, tag | `npm run publicar` | ⏳ |
| | 9.4 | Opus / Alto | Pilotos Eclipse con 1–3 clientes: tiempo, intervención, fallas, margen | registro de pilotos | ⏳ (depende de terceros) |

Total: 10 fases, 34 lotes (se agregaron 9.3 y 9.4 al separar el corte final y los pilotos, que dependen de personas).

## Puerta de cada lote (sin espera humana)

```sh
npm run verify     # typecheck + pruebas + validar decks + build
npm run e2e        # recorrido real en Chromium (presentador, pública, celular, cortes)
```

Si falla, el lote no cierra. Se anota en `docs/progreso.md` qué se hizo, qué se comprobó y qué sigue.

## Checklist humano (Fase 9, no bloquea código)

1. Corte agregado del CRM al 04/11: especialistas registrados/contactados/verificados/disponibles y usuarios en lista de espera.
2. Bases y duración oficial de la semifinal ATICMA; pantalla, audio, red del lugar.
3. Destinos definitivos de los QR (¿la landing ya recibe registros?) → `definitivo: true` y `estado: "final"`.
4. Monto/instrumento del pedido (FUND-03) y alcance del 5 % fundador (BUS-22/LEG-41).
5. Los tres PDF originales (para citar páginas reales en `matriz-pdf.md`).
6. Accesos: Hostinger (FTP/SSH), Render o VPS, DNS de handyc.com.
7. Ensayo con proyector, dos teléfonos (iOS/Android) en redes distintas y una persona ajena que explique qué entendió.
