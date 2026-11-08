# Plan por olas · Tríptico + 4 dossiers de Handyx (07/11/2026)

Pedido de Ignacio: un tríptico institucional (carta de invitación) y cuatro dossiers —Business & Investment, Customer App,
Professional App y Operations Portal—, impresos y digitales, con un QR único a una página con botones. Cinco zips, uno por pieza.

## Fuentes auditadas (lectura inicial)

| Fuente | Qué tiene |
|---|---|
| Lienzo «App del usuario» (A4T5bqyE8WEiQkwD4ogDaZ) | 128 tableros: 101 pantallas (A acceso, I inicio y HandIA, P pedir, C propuestas, S seguimiento y pago, O obras, M mensajes, H Mi hogar, T herramientas y AR, G Camino del hogar, X cuenta y errores), 13 recorridos, 13 flujos y una revisión UX/UI. |
| Lienzo «App del especialista / bloque Taller» (JzUxRPjWxq2Aykk8aukDG8) | 196 tableros: alta en 10 pasos con verificación, pedido y cotización, tu día, Taller, presupuestador y lista de precios, obras y equipo, chat, equipamiento, ferretería (app y panel web del ferretero), Camino Handyx, herramientas por oficio (H0 base; H2–H6 «después del deploy»), 16 recorridos y 17 flujos. |
| Lienzo «Portal interno v3» (QQ2JZ6dbyjG3mdWwfWACLG) | 36 tableros en 6 páginas: sistema visual, login, bienvenida y tour, Inicio, pre-registros y ficha, reclamos, tareas tipo Jira, mapa por barrio, campañas, cohortes, docs, legal y compliance, 11 recorridos. Todo «muestra · datos ficticios». |
| Pitch ATICMA (presentations-studio) | 60 escenas animadas, 217 imágenes, 115 afirmaciones con fuente, capturas de la demo, diseños propuestos, publicidades, clip del mundo. |
| Repos | Landing (preregistro real), BE de captación y CRM, PWA del usuario y del especialista, portal interno: dicen qué está **construido** y qué es solo diseño. |

Prueba hecha: los tableros se renderizan localmente con el motor publicado del lienzo (`dc-runtime.js`) y se capturan en
alta con Playwright. Faltan solo las imágenes subidas (`/_blob/…`), que se bajan con el listado de assets.

## Reglas de toda la producción

- Nada inventado: cada función lleva estado — **Construido · En pruebas · Diseñado · Concepto** — y cada cifra sale de
  `decks/handyx-aticma/afirmaciones.json` con su rótulo. Lo que falta se marca «[a definir]», nunca se rellena.
- Personajes: solo Foco, Engranaje, Llave y Brocha. Business: sobrio y formal, casi sin personajes.
- Capturas reales de los lienzos y de la demo; lo propuesto se rotula «Diseño propuesto». Sin datos personales reales.
- Una sola familia visual (Archivo + DM Sans, azul y amarillo de marca, grilla A4 común), con un acento propio por dossier.

## Olas

Cada ola agrupa lo que se puede hacer al mismo tiempo. Entre olas, un punto de control: te muestro el resultado y sigo.
Como máximo 4–5 agentes a la vez (con 7 en paralelo llegamos al límite de uso de 5 horas).

| Ola | Qué | En paralelo | Modelo · esfuerzo |
|---|---|---|---|
| 0 · Preparación | Bajar los 3 lienzos completos con sus imágenes; renderizador local; inventario del material del pitch | Yo (secuencial) | Opus 5.5 · max |
| 1 · Auditoría y capturas | Captura de cada pantalla, recorrido y flujo + inventario de funciones con estado | 4 agentes: usuario · especialista · portal · negocio y repos | Opus 5.5 · high |
| 2 · Diagnóstico + arquitectura + arte | Informe de diagnóstico; índice página por página de las 5 piezas; sistema editorial y plantilla HTML→PDF; muestra visual (portadas y una doble página por pieza) | Yo (secuencial: todo depende de esto) | Opus 5.5 · max |
| 3 · Producción | Las 5 piezas sobre la plantilla común | 5 agentes, uno por pieza (el tríptico arranca último, resume a los otros) | Opus 5.5 · max |
| 4 · QR y empaquetado | Página con botones + QR único; PDF de imprenta (sangrado 3 mm) y digital liviano; PNG por página; fuente editable; 5 zips | 2 agentes: hub · paquetes | Opus 5.5 · high |
| 5 · Revisión integral | Lectura como inversor; ortografía, cifras, coherencia, contraste, márgenes, pliegues; correcciones | 1 revisor independiente + yo | Opus 5.5 · max |

## Piezas

- **Tríptico** (A4 horizontal, doble faz, 6 paneles). Exterior: solapa interior (cierre/visión) · contratapa (contacto + QR) ·
  portada. Interior: problema · solución · ecosistema e invitación. Pliegue en ventana con el panel de la solapa 2 mm más angosto.
- **01 Business & Investment** (~16–20 p.): resumen ejecutivo, problema, solución, ecosistema, mercado (total, accesible,
  inicial), modelo (confirmado · en evaluación · futuro), competencia, adquisición digital y física con métricas, etapas,
  roadmap construido vs. planificado, proyecciones solo con variables verificables, uso del capital, validación real, visión,
  la historia post-ATICMA en una línea y la invitación a los finalistas, contacto.
- **02 Customer App** (~16 p.): flujos de punta a punta (necesidad → acción → qué hace Handyx → resultado) con las pantallas reales.
- **03 Professional App** (~18 p.): el profesional como centro; herramientas por oficio solo las diseñadas, el resto como evolución.
- **04 Operations Portal** (~14 p.): arquitectura, operación, métricas, mapa, cohortes; sin credenciales ni datos sensibles.

## Decisiones de Ignacio (07/11)

1. QR único fijo: `landing.handyc.com/handyx/`, publicado con el método de la landing; el deploy lo autoriza Ignacio.
2. Página del QR con 6 botones: landing, los 4 dossiers y el portafolio (sin el tríptico, que ya lo tienen en la mano).
3. Contacto impreso: ignaciogauna.developer@gmail.com · 223 667-4044 · landing.handyc.com.
4. Business usa las cifras del pitch con su rótulo y el CAC como techo de USD 6 «a medir». Se ajusta después: lo
   importante es que exista toda la estructura.

Después de la auditoría (ola 1, 07/11 a la noche):

5. **Tarifa impresa:** al especialista 0 % (sin comisión); al usuario 0 % hasta el 10/12/2026 y después 15 %, rotulado
   «en evaluación». Las otras versiones (10 % + 10 %, primer mes sin tarifa, camada fundadora al 5 %) no se imprimen; la
   landing queda desactualizada en ese punto y se recomienda corregirla.
6. **QR:** se mantiene `landing.handyc.com/handyx/` (se publica desde el repo de la landing, con el OK de Ignacio).
7. **Tracción:** las tres cifras del pitch (5 trabajos, $ 350.000, 56 especialistas registrados) van rotuladas «dato
   informado por el fundador · sin auditar»; los 56 nunca como «verificados» ni «activos».
8. **Tono del Business:** las cifras de ambición (USD 1 M, USD 5 M, 40 % de Argentina, Buenos Aires en 3 meses) van solo
   en Visión, rotuladas «objetivo». IPO, tesorería con cripto, Silicon Valley y «arreglar el mundo» quedan fuera del
   Business.
