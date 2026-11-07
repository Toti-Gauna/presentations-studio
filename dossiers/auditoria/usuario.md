# Auditoría ola 1 · App del usuario (Dossier 02 · Customer App)

Corte: 07/11/2026 · Superficie: usuario · Datos: `usuario.json` (misma información, forma de la consigna).


## Resumen

- **Lo que hay es mucho diseño y poco producto en manos de gente.** El lienzo dibuja la app completa: 102 pantallas
  (no 101), 13 recorridos y 12 flujos, todos con datos de muestra. El propio repo dice que la Fase 7 está «esperando el
  OK» de Ignacio: «No se desarrolla nada hasta el OK».
- **Ninguna función cumple «Construido» en la PWA.** `origin/main` de `handyx-client-fe` (ca04340) tiene las Fases 1 y 2.
  Son 33 pantallas y un modal sobre un servidor simulado. El backend del usuario no está en `main`: `main` solo tiene
  «Initial commit» y después CI/CD a Render, que dice «no hay nada que deployar». El API real vive en la rama
  `fase-4-backend-conciliado` y se probó contra una base local aislada. Solo la demo de la landing (rol usuario) es una
  pieza pública construida, con datos ficticios.
- **Publicado:** `https://handyx.pro` sirve, desde el 07/11 a las 17:43 UTC, la **vista de prueba** de `main`. Tiene el
  banner «Vista de prueba», datos ficticios, navegación vieja y registro con invitación. No tiene HandIA, el rediseño ni
  el viaje en vivo. `handyc.com` (app por rol de la landing) no se publicó: el job se omitió. Para el lanzamiento del
  10/11 no hay evidencia de una app conectada a un backend real.
- **Ramas sin mergear:**
  - `fase-3-diseno`: rediseño 3.1–3.9, viaje en vivo con la llegada del servidor y conexión con la API preparada.
  - `handia-premium`: HandIA por chat y voz en el celular, sin IA externa, como motor de reglas local, y la fuente del lienzo.
- **Prioridad del pedido (calidad y precio):** en código hay una lista y una tabla **sin ranking a propósito**. El
  destacado «La mejor en perfil y precio» y el precio orientativo de Handyx son **solo diseño** y chocan con la regla
  vigente «sin rankings ni superlativos» del contrato. Ver la sección propia más abajo.
- **Contradicciones que bloquean texto impreso:**
  - Tarifa al usuario: cuatro versiones (0 % en la demo, 10 %, 15 %, «primer mes sin tarifa»).
  - Comisión al especialista: 10 % o 0 %.
  - Registro: con o sin invitación y contraseña.
  - Dominio: `handyc.com` o `handyx.pro`.
  - HandIA: desactivada, local o con OpenAI.
  - Quién verifica un pago.
- **Personajes:** diez tableros muestran Canilla, Gota o el grupo. Hay recortes listos para M-Soporte y G-Hito, y
  alternativas para el resto.


## Funciones por estado

| Estado | Cantidad |
|---|---|
| Construido | 2 |
| En pruebas | 39 |
| Diseñado | 41 |
| Concepto | 3 |
| **Total** | **85** |


## Mapa de módulos

| Módulo | Qué es | Tableros | Construido | En pruebas | Diseñado | Concepto |
|---|---|---|---|---|---|---|
| **A · Acceso y alta** | Registro sin contraseña en 5 pasos con «Armá tu casa» opcional (diseño); en código existe el alta con invitación y contraseña sobre el servidor simulado. | 15 | 0 | 5 | 4 | 0 |
| **I · Inicio y HandIA** | Inicio con seis rubros y HandIA, el asistente que arma el pedido en el celular sin IA externa, por chat o por voz; el motor está en una rama, el diseño nuevo no. | 12 | 0 | 4 | 2 | 1 |
| **P · Pedir** | Pedido en 3 toques con precio orientativo de Handyx (diseño); en código, pedido en pasos con urgente, programado u obra. | 12 | 0 | 3 | 4 | 0 |
| **C · Propuestas y comparar** | Propuestas con precio, condiciones y verificaciones; comparar lado a lado y «La mejor en perfil y precio» (solo diseño); aceptar exactamente la versión vista (código). | 12 | 0 | 7 | 5 | 0 |
| **S · Seguimiento y pago** | Del turno al pago: viaje en vivo del servidor, adicionales, informe con garantía, conformidad, pago directo (informado ≠ verificado) y reseña. | 14 | 0 | 10 | 3 | 0 |
| **O · Obras** | Obras de varios días por etapas, con equipo de varios profesionales, repuestos y pagos por etapa; en código hay etapas con confirmación y pago por etapa. | 11 | 0 | 1 | 6 | 0 |
| **M · Mensajes** | Chats atados a un pedido u obra con tarjetas que se aceptan ahí mismo y Soporte atendido por personas. | 8 | 0 | 2 | 3 | 0 |
| **H · Mi hogar** | Ficha privada de la casa con cuatro puertas (Mi casa, Algo se rompió, Mantenimiento, Historial y garantías); todo es diseño y pide contrato nuevo. | 15 | 0 | 0 | 7 | 1 |
| **T · Herramientas, 3D y AR** | Las herramientas del especialista en el teléfono (medir, nivel, linterna, foto anotada, 3D, AR); todo termina en el chat o el pedido. Solo diseño. | 8 | 0 | 0 | 3 | 0 |
| **G · Camino del hogar** | Gamificación por cuidar la casa, sin azar ni rankings; montos y premios en borrador para Legal. | 7 | 0 | 0 | 2 | 1 |
| **X · Actividad, cuenta, ayuda y errores** | Actividad, cuenta desde el avatar, pagos registrados sin tarjetas, privacidad y baja, ayuda y errores que no dan nada por hecho; buena parte existe en código con mock. | 14 | 0 | 6 | 2 | 0 |
| **L · Superficies públicas hoy** | Lo que un tercero puede abrir hoy: la vista de prueba de la PWA en handyx.pro y la demo de la landing (datos ficticios en las dos). | 0 | 2 | 1 | 0 | 0 |

## Inventario de funciones

Evidencia abreviada; la cita completa y los tableros de cada función están en el JSON. `main` = `origin/main` de `handyx-client-fe` (ca04340). Rama = sin mergear.


### A · Acceso y alta

| Id | Función | Estado | Horizonte | Publicado | Evidencia principal | Notas |
|---|---|---|---|---|---|---|
| U-A-01 | **Bienvenida ilustrada**: Primera pantalla con Mar del Plata dibujada, qué es Handyx y «Crear cuenta» o «Ya tengo cuenta». | Diseñado | sin dato | no | lienzo `A-Bienvenida.dc.html`: «Arreglos de casa con especialistas verificados · Contás qué pasa, recibís propuestas con precio y elegís vos.» | La versión de código (Fase 2) es otra pantalla. El titular «especialistas verificados» es un riesgo de publicación. |
| U-A-02 | **Alta con invitación y contraseña, ingreso y recuperación**: Crear la cuenta con un código de invitación, entrar con email y contraseña y recuperar la contraseña. | En pruebas | sin dato | sí (handyx.pro, vista de prueba) | repo `client-fe@ca04340:src/mapa/pantallas.ts`: «registro, ingresar, recuperar, recuperar-nueva (lote 2.1)» | El API probado solo contra base local aislada; main del BE no tiene código. El lienzo reemplaza esto por U-A-03. |
| U-A-03 | **Registro directo y entrar sin contraseña**: Registrarse sin invitación y entrar con un código de 6 números por email o SMS, o con Google o Apple. | Diseñado | sin dato | no | lienzo `FL-Acceso.dc.html`: «La gente se registra directo, sin invitación ni contraseñas.» | Contradice el contrato y AGENTS.md («demo cerrada con invitación»). Pide contrato draft.4, proveedores de SMS y OAuth (decisión 0.3 abierta). |
| U-A-04 | **Datos mínimos sin DNI ni CUIT**: Pide solo nombre, apellido y celular; el teléfono lo ve solo el especialista elegido. | En pruebas | sin dato | sí (handyx.pro, vista de prueba) | repo `client-fe@ca04340:src/mapa/pantallas.ts`: «perfil · «Completá tu perfil» por pasos» | La pantalla A-Datos es rediseño (solo diseño); el perfil por pasos existe sobre mock. |
| U-A-05 | **Zona aproximada y dirección exacta solo al aceptar**: Los especialistas ven el barrio; la dirección exacta se comparte con quien aceptaste. | En pruebas | sin dato | sin verificar | lienzo `A-Zona.dc.html`: «Los especialistas ven solo la zona aproximada. La dirección exacta se comparte cuando aceptás una propuesta.» | Regla implementada en la rama del BE (lote 5.4) y probada con las dos APIs en local. |
| U-A-06 | **Elegir avisos**: Elegís qué avisos te llegan (propuestas, turno, recordatorios), sin publicidad. | En pruebas | sin dato | sí (handyx.pro, vista de prueba) | lienzo `A-Avisos.dc.html`: «Solo lo que te sirve. Nada de publicidad.» | Las notificaciones push reales no están activas. |
| U-A-07 | **«Armá tu casa» en el alta**: Paso opcional para cargar ambientes, equipos y una foto por ambiente; se puede saltar. | Diseñado | sin dato | no | lienzo `A-Casa.dc.html`: «OPCIONAL · 2 MINUTOS · Armá tu casa» |  |
| U-A-08 | **Segunda verificación y sesiones abiertas**: Un paso más de seguridad opcional y la lista de sesiones abiertas para cerrarlas. | Diseñado | sin dato | no | lienzo `A-Segunda.dc.html`: «Si la activás, al entrar te pedimos un segundo código.» | Se describe la función, no el mecanismo. |
| U-A-09 | **Aviso de tarifa 0 % (después del alta, primer ingreso y contador en Cuenta)**: Avisa que durante la demo no hay tarifa de servicio hasta el 10/12/2026 y que el trabajo se paga directo al especialista. | En pruebas | lanzamiento 10/11 | sí (handyx.pro, vista de prueba) | repo `client-fe@ca04340:docs/handoff.md`: «Fee 0 % en los tres lugares pedidos … Siempre «hasta el 10/12», sin presentarlo como descuento» | Fin exacto (¿incluye el 10/12?) es supuesto a confirmar. Ver contradicción de tarifas. |

### I · Inicio y HandIA

| Id | Función | Estado | Horizonte | Publicado | Evidencia principal | Notas |
|---|---|---|---|---|---|---|
| U-I-01 | **Inicio con seis rubros, próximo turno y «Quiero…»**: Elegís el rubro o una tarea frecuente, ves tu próximo turno y la tarjeta de HandIA. | En pruebas | sin dato | sí (handyx.pro, vista de prueba) | repo `client-fe@ca04340:src/mapa/pantallas.ts`: «inicio (lote 2.x)» | El diseño del lienzo (cabecera, ticket del turno, barra con HandIA) es el lote 2B, sin desarrollar. |
| U-I-02 | **Barra de cinco pestañas con HandIA en el medio**: Inicio · Actividad · HandIA · Mensajes · Mi hogar; la cuenta se abre desde el avatar. | Diseñado | sin dato | no | lienzo `FL-Mapa.dc.html`: «Cinco pestañas en una barra de vidrio azul; HandIA encastrada en el medio.» | El tablero UX-Revision habla de «pestañas de vidrio»; el pedido de la marca prohíbe vidrio esmerilado en la landing: revisar si aplica. |
| U-I-03 | **HandIA por chat: arma el pedido en el celular**: Le contás qué pasa; sugiere el rubro, hace 2 a 4 preguntas, avisa riesgos primero y arma una ficha que revisás. | En pruebas | sin dato | no | repo `client-fe@589487b (handia-premium):AGENTS.md`: «HandIA incluida … conversa en el celular … sin IA externa … con API real, inactiva hasta el endpoint del BE» | Solo en la rama handia-premium (no dispara el deploy) y solo en la vista de prueba. Es un motor de reglas local, no un modelo de IA. |
| U-I-04 | **HandIA modo voz con reconocimiento en el dispositivo**: Hablás y HandIA responde en voz alta con subtítulos; la voz no sale del teléfono. | En pruebas | sin dato | no | repo `client-fe@589487b (handia-premium):docs/handoff.md`: «solo con reconocimiento en el dispositivo … si el navegador mandaría la voz a un servidor, no escucha y lo explica (Safari/iOS hoy: solo lee en voz alta)» | En iPhone hoy no escucha. Prueba con 5 personas (R7) pendiente. |
| U-I-05 | **Rediseño visual de HandIA (chat con mensajes abajo, voz con esfera sin personaje, ajustes)**: La presentación nueva del chat y de la voz que dibuja el lienzo. | Diseñado | sin dato | no | lienzo `UX-Revision.dc.html`: «HandIA voz sin personaje: esfera de luz, textos livianos y hoja de ajustes.» | Los SVG definitivos los manda Ignacio. |
| U-I-06 | **HandIA con IA externa, cámara y agente que busca presupuestos**: Razonamiento con OpenAI, voz con ElevenLabs, foto del problema y búsqueda de presupuestos recorriendo la app. | Concepto | sin fecha | no | repo `client-fe@589487b (handia-premium):docs/handia-premium-plan.md`: «Al final, ChatGPT (OpenAI) con saldo … ElevenLabs para la voz … H6–H7 cambian eso solo con autorización explícita de Ignacio, consentimiento dentro de la app y revisión legal (Ley 25.326)» | Contradice el rótulo «sin IA externa» del lienzo si se presenta sin aclarar que es plan. |
| U-I-07 | **Avisos que llevan al detalle**: La campana lista propuestas, mensajes, turnos y recordatorios; cada aviso abre su detalle y nunca acepta ni paga por vos. | En pruebas | sin dato | sí (handyx.pro, vista de prueba) | repo `client-fe@ca04340:src/mapa/pantallas.ts`: «notificaciones · Avisos» | Recordatorios del hogar y pasos del camino en los avisos: solo diseño. |

### P · Pedir

| Id | Función | Estado | Horizonte | Publicado | Evidencia principal | Notas |
|---|---|---|---|---|---|---|
| U-P-01 | **Pedido en pasos: urgente, programado u obra**: Elegís rubro y tipo, contás qué pasa, sumás fotos privadas, ubicación, fecha y hora; podés proponer un precio y activar la autoaceptación. | En pruebas | sin dato | sí (handyx.pro, vista de prueba) | repo `client-fe@ca04340:src/mapa/pantallas.ts`: «Tipo: urgente / programado / obra … Precio propuesto opcional … Autoaceptación solo si la elijo (apagada por defecto)» | El precio propuesto por el usuario y la autoaceptación no aparecen en el lienzo. |
| U-P-02 | **Pedir en 3 toques**: Rubro › qué pasa › revisar y publicar; fotos, medidas, día y dirección son opcionales y se cambian desde Revisar. | Diseñado | sin dato | no | lienzo `FL-Pedir.dc.html`: «Camino corto en 3 toques: rubro › qué pasa › revisar y publicar.» | Lote 2C de la Fase 7. |
| U-P-03 | **Anotar la foto**: Marcás sobre la foto con flechas, círculos o texto dónde está el problema. | Diseñado | sin dato | no | lienzo `P-Anotar.dc.html`: «Gotea acá · Flecha · Círculo · Texto» |  |
| U-P-04 | **Medir con la cámara y sumar la medida al pedido**: Medición aproximada con la cámara que viaja con el pedido. | Diseñado | sin dato | no | lienzo `P-Medir.dc.html`: «Medida aproximada · sirve para orientar, no para cortar» |  |
| U-P-05 | **Precio orientativo de Handyx**: En Revisar, un rango sugerido de Handyx para el trabajo; cada especialista pone su precio. | Diseñado | sin dato | no | lienzo `P-Revisar.dc.html`: «PRECIO ORIENTATIVO DE HANDYX $ 38.000 a $ 52.000 · Sale de trabajos parecidos en tu zona. Handyx sugiere, nunca impone» | No existe en código ni en contrato; tampoco hay datos de «trabajos parecidos en tu zona». Los montos son de muestra. |
| U-P-06 | **Pedido publicado y búsqueda sin prometer tiempos**: El pedido se muestra a especialistas del rubro y la zona; si nadie responde se puede relanzar o pedir búsqueda manual a Operations. | En pruebas | sin dato | sí (handyx.pro, vista de prueba) | repo `client-be@179bd86 (fase-4-backend-conciliado):docs/state-machines.md`: «buscando --> sin_respuesta: vence ventana (urgente 20 min / programado 12 h) … Sin ETA en ningún estado» | Intentos de relanzar: 3, supuesto a confirmar. |
| U-P-07 | **Seis rubros y cobertura en Mar del Plata**: Electricidad, Plomería, Gas, Cerrajería, Albañilería y Aire acondicionado; el servidor dice si la ciudad tiene cobertura. | En pruebas | lanzamiento 10/11 | sí (handyx.pro, vista de prueba) | repo `client-be@179bd86 (fase-4-backend-conciliado):src/contracts/v1/endpoints.ts`: «Rubros aprobados · Si una ciudad tiene cobertura (inicio: Mar del Plata)» |  |

### C · Propuestas y comparar

| Id | Función | Estado | Horizonte | Publicado | Evidencia principal | Notas |
|---|---|---|---|---|---|---|
| U-C-01 | **Lista de propuestas por orden de llegada**: Cada propuesta con el precio del especialista, la tarifa de Handyx, horario, vigencia y verificaciones; sin ranking. | En pruebas | sin dato | sí (handyx.pro, vista de prueba) | repo `client-fe@ca04340:src/app/(app)/pedidos/propuestas/page.tsx`: «Ordenadas por llegada. No es una recomendación ni un ranking.» | Vigencia de la propuesta urgente: 5 min (servidor). |
| U-C-02 | **Tarjeta de propuesta extendida**: Especialista y reseñas › precio › duración, garantía y equipo › verificaciones › Rechazar · Ver perfil · Aceptar. | Diseñado | sin dato | no | lienzo `C-Propuestas.dc.html`: «En el orden en que llegaron … Aceptar una cierra las demás.» | Pide la «propuesta extendida» del contrato draft.4. |
| U-C-03 | **Comparar propuestas en tabla**: Las propuestas lado a lado: total, precio del especialista, tarifa de Handyx, horario, vigencia, verificaciones y qué incluye, sin destacar ninguna. | En pruebas | sin dato | sí (handyx.pro, vista de prueba) | repo `client-fe@3fc03b6 (fase-3-diseno):src/app/(app)/pedidos/propuestas/page.tsx`: ««Comparar» muestra todas en una tabla, sin destacar ninguna.» | Es lo que hay en código; la versión del lienzo es U-C-04. |
| U-C-04 | **«La mejor en perfil y precio» por promedio**: Una nota de 0 a 10 por propuesta con pesos fijos iguales para todas y una frase que explica por qué; elige la persona. | Diseñado | sin dato | no | lienzo `C-Comparar.dc.html`: «LA MEJOR EN PERFIL Y PRECIO · Julián Ortiz 8,7 de 10 · Sale de un promedio con las mismas reglas para todas. Elegís vos.» | No hay cálculo en código (lote 2C lo pide «con pesos fijos y prueba»). Los pesos no se ven en la pantalla final. Choca con la regla «sin ranking» del contrato y del código. |
| U-C-05 | **Detalle de una propuesta (básico)**: Precio del especialista, tarifa de Handyx, horario, vigencia, qué incluye, quién la propuso; elegir abre la confirmación. | En pruebas | sin dato | sí (handyx.pro, vista de prueba) | repo `client-fe@ca04340:src/mapa/pantallas.ts`: «propuesta · /propuestas/detalle/» |  |
| U-C-06 | **Detalle de propuesta extendido**: Cómo lo hace: materiales, equipo, duración, garantía, visita previa, qué incluye y qué no, y el mensaje del especialista. | Diseñado | sin dato | no | lienzo `C-Detalle.dc.html`: «PRECIO DE JULIÁN $ 45.000 · Dentro del orientativo · QUÉ INCLUYE … NO INCLUYE» | «Dentro del orientativo» depende de U-P-05. |
| U-C-07 | **Verificaciones y trabajos realizados en la propuesta**: Chips de identidad y antecedentes solo si Operations los verificó, y la cantidad de trabajos hechos en Handyx. | En pruebas | sin dato | sí (handyx.pro, vista de prueba) | repo `client-be@179bd86 (fase-4-backend-conciliado):src/contracts/v1/pedidos.ts`: «verificaciones solo lista lo que Operations verificó de verdad … trabajosRealizados» | Con datos de prueba. |
| U-C-08 | **Perfil del especialista con reseñas y «cargado ≠ verificado»**: Antes de elegir: cifras, verificaciones de Operations con fecha, certificados cargados sin revisar, trabajos recientes y reseñas. | Diseñado | sin dato | no | lienzo `C-Certificados.dc.html`: ««Cargado» no es «verificado»: solo mostramos como verificado lo que revisó Operations.» | Reseñas y promedio de estrellas no existen en el contrato. |
| U-C-09 | **Visita para presupuestar**: Si el especialista necesita ver antes: precio de la visita, qué se sabe y qué se define en ella. | Diseñado | sin dato | no | lienzo `C-Visita.dc.html`: «$ 8.000 la visita · se descuenta si después lo contratás» | El contrato no tiene el tipo visita (draft.4). |
| U-C-10 | **Pedir cambios / contrapropuesta**: Pedís otro día, otro precio o que incluya materiales; nada cambia hasta que aceptás la nueva. | En pruebas | sin dato | sí (handyx.pro, vista de prueba) | repo `client-be@179bd86 (fase-4-backend-conciliado):src/contracts/v1/endpoints.ts`: «Contrapropuesta del usuario (reemplaza la anterior)» | El código hace contrapropuesta directa; el lienzo la plantea como pedido de cambio al especialista. |
| U-C-11 | **Rechazar una propuesta**: Rechazás; en el diseño, con un motivo opcional que el especialista no ve. | En pruebas | sin dato | sí (handyx.pro, vista de prueba) | repo `client-be@179bd86 (fase-4-backend-conciliado):src/contracts/v1/endpoints.ts`: «Rechaza una propuesta pendiente» | El motivo opcional es solo diseño. |
| U-C-12 | **Aceptar exactamente la propuesta vista**: Confirmás en una hoja; se comparte la dirección con quien elegiste, las otras se cierran y se crea el turno. | En pruebas | sin dato | sí (handyx.pro, vista de prueba) | repo `client-be@179bd86 (fase-4-backend-conciliado):docs/state-machines.md`: «Aceptar exige la misma version que vio quien acepta: si cambió, 409» | La pantalla «¡Turno confirmado!» con «qué sigue» es diseño. |

### S · Seguimiento y pago

| Id | Función | Estado | Horizonte | Publicado | Evidencia principal | Notas |
|---|---|---|---|---|---|---|
| U-S-01 | **Trabajo con sus estados**: Agendado › en camino › llegó › trabajando › terminado › finalizado, con historial de cambios. | En pruebas | sin dato | sí (handyx.pro, vista de prueba) | repo `client-be@179bd86 (fase-4-backend-conciliado):docs/state-machines.md`: «agendado → en_camino → en_sitio («Llegué», lo marca el especialista) → en_curso → terminado_por_especialista → finalizado» |  |
| U-S-02 | **Viaje en vivo con la llegada que calcula el servidor**: Ves venir al especialista en el mapa solo mientras comparte el viaje; al llegar el mapa se apaga. | En pruebas | sin dato | no | repo `client-fe@3fc03b6 (fase-3-diseno):docs/handoff.md`: «Lote 4.7 · el seguimiento muestra la posición … y la llegada estimada que manda el servidor, solo mientras comparte» | Solo en fase-3-diseno (no en main ni en handyx.pro). Mapa propio sin terceros. |
| U-S-03 | **Código para abrir la puerta**: Cuando llega, le pedís que te diga un código de 4 números antes de abrir; si no coincide, avisás a Soporte. | Diseñado | sin dato | no | lienzo `S-Llego.dc.html`: «Pedile que te diga este código antes de abrir … Si el código no coincide, no abras y escribile a Soporte de Handyx.» | No existe en el contrato ni en la máquina de estados. |
| U-S-04 | **Aprobar un adicional**: El especialista pide un repuesto o trabajo extra con foto y motivo; ves cómo cambia el total y lo aprobás, preguntás o rechazás. | En pruebas | sin dato | sí (handyx.pro, vista de prueba) | repo `client-be@179bd86 (fase-4-backend-conciliado):src/contracts/v1/propuestas.ts`: «TIPOS_PROPUESTA = cotizacion, cambio_acuerdo, adicional» | Existe como tipo y en el servidor simulado; el flujo con la API del especialista no está probado. Foto y «Preguntar» son diseño. |
| U-S-05 | **Antes y después**: Fotos del antes y el después con deslizador o lado a lado. | Diseñado | sin dato | no | lienzo `S-AntesDespues.dc.html`: «Antes y después · Deslizar · Lado a lado» | Contrato draft.4. |
| U-S-06 | **Informe del trabajo con garantía**: Qué encontró, pruebas, materiales, garantía con fecha y qué conviene hacer después; queda en Mi hogar. | Diseñado | sin dato | no | lienzo `S-Informe.dc.html`: «Garantía activa hasta el 17/02/2027 … El informe queda guardado en Mi hogar.» | Texto de garantía pendiente de Legal (UX-Revision). |
| U-S-07 | **Conformidad en un toque**: Confirmás que terminó o avisás que hay un problema (vuelve a en curso). | En pruebas | sin dato | sí (handyx.pro, vista de prueba) | repo `client-be@179bd86 (fase-4-backend-conciliado):src/contracts/v1/endpoints.ts`: «El usuario confirma que terminó» |  |
| U-S-08 | **Pago directo en efectivo, informado ≠ verificado**: Le pagás en mano al especialista y lo informás; Handyx no recibe ni reparte la plata y el pago queda «informado» hasta que se verifica. | En pruebas | sin dato | sí (handyx.pro, vista de prueba) | repo `client-be@179bd86 (fase-4-backend-conciliado):docs/handoff.md`: «Handy no recibe ni distribuye el dinero … reportado ≠ verificado: verifica el proveedor u Operations» | Quién verifica difiere entre lienzo y BE (ver contradicciones). |
| U-S-09 | **Pagar con Mercado Pago al especialista**: Te lleva al cobro de Mercado Pago del especialista; volver a la app no confirma nada: se espera el aviso de Mercado Pago. | En pruebas | sin fecha | no | repo `client-be@179bd86 (fase-4-backend-conciliado):docs/handoff.md`: «reportar por MP y pedir el checkout responden funcion_inactiva hasta validar la integración en sandbox … La app ofrece efectivo» | Código con la compuerta cerrada: hoy no se puede pagar por Mercado Pago. Requiere autorización de Ignacio. |
| U-S-10 | **Vuelta del checkout que no confirma nada**: Al volver de pagar, la app consulta el estado real (pendiente, falló, cancelado, confirmado). | En pruebas | sin dato | sí (handyx.pro, vista de prueba) | repo `client-fe@ca04340:src/mapa/pantallas.ts`: «pago-retorno · volver de la URL de checkout no confirma el pago» | No tiene pantalla propia en el lienzo. |
| U-S-11 | **Reseña opcional**: Estrellas, qué estuvo bien y un comentario opcional sin datos personales. | En pruebas | sin dato | no | repo `client-fe@589487b (handia-premium):src/data/resena.ts`: «El contrato v1 todavía no tiene resenaCrear … resenaDisponible = esVistaDePrueba» | Solo en la vista de prueba de la rama; sin backend. La hoja tipo Uber del lienzo es diseño. |
| U-S-12 | **Cambiar el turno o cancelar**: Proponés otra fecha, hora, alcance o monto (vale el acuerdo actual hasta que se acepte) o cancelás un turno agendado. | En pruebas | sin dato | sí (handyx.pro, vista de prueba) | repo `client-be@179bd86 (fase-4-backend-conciliado):src/contracts/v1/endpoints.ts`: «Propone cambiar el acuerdo (turno, alcance o monto): queda pendiente · Cancela un trabajo agendado» |  |
| U-S-13 | **Reclamos**: Abrir un reclamo de un pedido o trabajo, seguir su estado y sumar información. | En pruebas | sin dato | sí (handyx.pro, vista de prueba) | repo `client-be@179bd86 (fase-4-backend-conciliado):src/contracts/v1/endpoints.ts`: «Abre un reclamo de un pedido/trabajo propio · Mis reclamos · Detalle e historial» | El lienzo no dibuja reclamos: solo «Hay un problema» en la conformidad y Soporte. |

### O · Obras

| Id | Función | Estado | Horizonte | Publicado | Evidencia principal | Notas |
|---|---|---|---|---|---|---|
| U-O-01 | **Obra por etapas con confirmación y pago por etapa**: Un trabajo grande dividido en etapas con su monto; confirmás cada etapa terminada y la pagás directo. | En pruebas | sin dato | sí (handyx.pro, vista de prueba) | repo `client-be@179bd86 (fase-4-backend-conciliado):src/contracts/v1/endpoints.ts`: «Confirma una etapa de obra» | Escenario «obra-por-etapas» del servidor simulado. |
| U-O-02 | **Propuesta de obra con días, etapas y a quién le pagás cada una**: Total, fechas, etapas, quién hace cada una y cuánto; la aprobás o pedís cambios. | Diseñado | sin dato | no | lienzo `O-Propuesta.dc.html`: «TOTAL DE LA OBRA $ 850.000 · 6 días · 3 profesionales · Pagás cada etapa … directo a quien la hizo» | Contrato draft.4 (obras en equipo). |
| U-O-03 | **Tu obra día a día**: Etapas, jornadas con quién viene, avance con fotos, materiales del día, pagado y lo que falta. | Diseñado | sin dato | no | lienzo `O-Obra.dc.html`: «EN OBRA Día 4 de 6 · PAGADO $ 400.000 · FALTA $ 450.000 + repuestos» |  |
| U-O-04 | **Repuesto para aprobar**: El especialista pide un repuesto con precio de ferretería y foto del ticket; nada se suma sin tu OK. | Diseñado | sin dato | no | lienzo `O-Repuesto.dc.html`: «Precio de la ferretería $ 36.000 … Ver la foto del ticket» | Nombra «Ferretería Simulación» (ficticia). |
| U-O-05 | **Cambio de fecha de una jornada**: El especialista propone mover una jornada (solo esa o todas las que siguen); aceptás u ofrecés otro día. | Diseñado | sin dato | no | lienzo `O-Fecha.dc.html`: «la jornada sigue en el vie 20 hasta que se acuerde» |  |
| U-O-06 | **Obra en equipo con chat grupal**: El especialista a cargo propone sumar otro oficio; aprobás quién y el reparto; un chat con todo el equipo sin ver tu celular. | Diseñado | sin dato | no | lienzo `FL-Equipo.dc.html`: «Cada profesional ve tu dirección exacta solo para los días que trabaja. En el grupo nadie ve tu celular.» |  |
| U-O-07 | **Pagos de la obra y lo gastado**: Pagos por etapa a cada profesional y el total con repuestos, separando informado y verificado. | Diseñado | sin dato | no | lienzo `O-Pagos.dc.html`: «El reparto lo acordó el equipo. Pagás a cada uno directo … Handyx no toca la plata.» |  |

### M · Mensajes

| Id | Función | Estado | Horizonte | Publicado | Evidencia principal | Notas |
|---|---|---|---|---|---|---|
| U-M-01 | **Chats por pedido o trabajo**: Un chat por pedido u obra, con texto y fotos y la propuesta dentro del hilo; nadie te escribe por fuera de eso. | En pruebas | sin dato | sí (handyx.pro, vista de prueba) | repo `client-be@179bd86 (fase-4-backend-conciliado):src/contracts/v1/endpoints.ts`: «Chats por pedido/trabajo · Envía texto o foto» |  |
| U-M-02 | **Tarjetas que se aceptan en el chat**: Presupuestos por ítem, otro horario, repuestos y fechas llegan como tarjetas para aceptar o responder ahí mismo. | Diseñado | sin dato | no | lienzo `M-Presupuesto.dc.html`: «Total $ 99.000 · Handyx sugiere entre $ 85.000 y $ 110.000 para este trabajo. El precio lo pone Diego.» | En código la propuesta aparece como evento del chat; el presupuesto por ítem no existe en el contrato. |
| U-M-03 | **Seleccionar mensajes**: Mantenés apretado y copiás, reenviás, respondés o borrás tus mensajes; las tarjetas no se borran. | Diseñado | sin dato | no | lienzo `M-Seleccion.dc.html`: «Borrar solo quita tus mensajes. Las tarjetas no se borran.» |  |
| U-M-04 | **Sumar al chat foto, medida, 3D o algo de Mi hogar**: Adjuntás lo que hiciste con las herramientas; se manda sin ubicación ni datos del teléfono. | Diseñado | sin dato | no | lienzo `M-Adjuntar.dc.html`: «Las fotos se mandan sin ubicación ni datos del teléfono.» |  |
| U-M-05 | **Soporte de Handyx atendido por personas**: Una conversación con el equipo de Soporte por un pago, un turno, la cuenta u otra cosa. | En pruebas | sin dato | no | repo `client-fe@589487b (handia-premium):src/mapa/pantallas.ts`: «/soporte/» | Pantalla en la rama (lote 3.7) sobre mock; el contrato v1 no tiene un endpoint de soporte propio (sin dato de cómo llega a Operations). |

### H · Mi hogar

| Id | Función | Estado | Horizonte | Publicado | Evidencia principal | Notas |
|---|---|---|---|---|---|---|
| U-H-01 | **Mi hogar con cuatro puertas**: Resumen de la casa y accesos a Mi casa, Algo se rompió, Mantenimiento e Historial y garantías. | Diseñado | sin dato | no | lienzo `H-Hogar.dc.html`: «Ficha de tu casa 80 % · 6 ambientes · 11 equipos» | Lote 3A de la Fase 7. |
| U-H-02 | **Ficha de la casa: ambientes y equipos**: Ambientes con fotos, medidas y materiales; equipos con foto de la etiqueta, instalación, mantenimiento y garantía. | Diseñado | sin dato | no | lienzo `H-Ambiente.dc.html`: «MEDIDAS Y MATERIALES … EQUIPOS · 3» |  |
| U-H-03 | **Algo se rompió: el pedido sale armado**: Elegís dónde y qué falla; el pedido sale con los datos de la casa y, si hay garantía, se lo pedís al mismo especialista. | Diseñado | sin dato | no | lienzo `H-Rompio.dc.html`: «El pedido sale con las fotos y los datos de tu casa, sin sacar nada de nuevo. … Pedírselo a Julián (garantía)» |  |
| U-H-04 | **Compartir por pedido y dejar de compartir**: Elegís qué parte de la ficha ve el especialista de un pedido; se deja de compartir sola al terminar o cuando la cortás. | Diseñado | sin dato | no | lienzo `H-Compartir.dc.html`: «Lo ven solo los especialistas de este pedido. Cuando termina, se deja de compartir solo.» |  |
| U-H-05 | **Recordatorios de mantenimiento**: Te avisa cuándo conviene revisar algo; nada se pide solo. | Diseñado | sin dato | no | lienzo `H-Recordatorios.dc.html`: «Te avisamos cuándo conviene revisar algo. Nada se pide solo.» |  |
| U-H-06 | **Historial de la casa, informes y garantías**: Todo lo que se hizo, con informes, pagos y hasta cuándo cubre cada garantía; descargable o borrable desde Privacidad. | Diseñado | sin dato | no | lienzo `H-Historial.dc.html`: «El historial es tuyo: lo podés descargar o borrar desde Privacidad.» | El código tiene historial de pedidos y trabajos, no de la casa. |
| U-H-07 | **Modelo 3D y medidas compartidas**: El modelo 3D de un ambiente con medidas que se comparten por pedido. | Concepto | sin fecha | no | lienzo `RC-Herramientas.dc.html`: «El modelo 3D con las medidas compartidas (para más adelante).» | Rotulado «más adelante» en el propio lienzo, aunque tiene pantalla. |
| U-H-08 | **Ver en AR un equipo propuesto**: Ver en la pared, en tamaño real, un equipo que te proponen antes de aceptarlo. | Diseñado | sin fecha | no | lienzo `H-AR.dc.html`: «Medidas reales del equipo propuesto. Movelo con el dedo para ver cómo queda.» | Decisión 0.4 abierta. |

### T · Herramientas, 3D y AR

| Id | Función | Estado | Horizonte | Publicado | Evidencia principal | Notas |
|---|---|---|---|---|---|---|
| U-T-01 | **Caja de herramientas: medir, nivel, linterna y lupa, foto anotada**: Las mismas herramientas que usa el especialista, en tu teléfono; las medidas son aproximadas. | Diseñado | sin dato | no | lienzo `T-Herramientas.dc.html`: «Las mismas que usan los especialistas. Lo que hagas termina en el chat o en tu pedido.» | Lote 3C. |
| U-T-02 | **Escanear un ambiente en 3D**: Caminás por el ambiente y se procesa en el celular; queda en Mi hogar. | Diseñado | sin fecha | no | lienzo `T-Escanear.dc.html`: «Se procesa en tu celular. Queda en Mi hogar y lo compartís si querés.» | Decisión 0.4 abierta; el modelo resultante está rotulado «más adelante» (U-H-07). |
| U-T-03 | **¿A dónde lo mandás?**: Lo que hiciste va a un chat, a un pedido nuevo o solo a Mi hogar; nada se manda hasta que elegís. | Diseñado | sin dato | no | lienzo `T-Destino.dc.html`: «Se manda sin ubicación ni datos del teléfono.» |  |

### G · Camino del hogar

| Id | Función | Estado | Horizonte | Publicado | Evidencia principal | Notas |
|---|---|---|---|---|---|---|
| U-G-01 | **Camino del hogar**: Cinco hitos que se avanzan cuidando la casa (ficha, informe leído, mantenimiento a tiempo, conformidades), no gastando más. | Diseñado | sin dato | no | lienzo `G-Camino.dc.html`: «3 de 5 · se avanza cuidando la casa, no gastando más» |  |
| U-G-02 | **Insignias sin rankings**: Seis insignias por lo que hiciste por tu casa; no se compran, no se sortean y no se comparten. | Diseñado | sin dato | no | lienzo `G-Insignias.dc.html`: «Sin rankings ni comparaciones con otras personas.» |  |
| U-G-03 | **Beneficios del camino**: Guía de mantenimiento, recordatorios con fecha sugerida y un monto en una revisión anual. | Concepto | sin fecha | no | lienzo `G-Beneficios.dc.html`: «$ [MONTO] en una revisión anual · Monto y condiciones a definir · Borrador · Legal» | Montos, premios y condiciones en borrador hasta que los apruebe Legal. |

### X · Actividad, cuenta, ayuda y errores

| Id | Función | Estado | Horizonte | Publicado | Evidencia principal | Notas |
|---|---|---|---|---|---|---|
| U-X-01 | **Mis pedidos y agenda**: Pedidos activos e historial y una agenda con los trabajos por día. | En pruebas | sin dato | sí (handyx.pro, vista de prueba) | repo `client-fe@ca04340:src/mapa/pantallas.ts`: «pedidos · agenda (días en Buenos Aires aunque el celular esté en otra zona)» |  |
| U-X-02 | **Actividad: en curso, agenda e historial**: Una pestaña con lo que está en curso, la agenda y el historial. | Diseñado | sin dato | no | lienzo `X-Actividad.dc.html`: «En curso · Agenda · Historial» | Reemplaza «Pedidos» y «Agenda» de la navegación actual. |
| U-X-03 | **Cuenta, datos y direcciones**: Tus datos sin DNI ni CUIT, direcciones guardadas, preferencias y tarifa. | En pruebas | sin dato | sí (handyx.pro, vista de prueba) | repo `client-fe@ca04340:src/mapa/pantallas.ts`: «cuenta, cuenta-datos, cuenta-tarifa, cuenta-notificaciones» | Abrir la cuenta desde el avatar es diseño. |
| U-X-04 | **Pagos registrados sin tarjetas guardadas**: Lista de pagos informados y verificados; no se guardan tarjetas. | En pruebas | sin dato | no | repo `client-fe@589487b (handia-premium):src/mapa/pantallas.ts`: «/cuenta/pagos/» | Solo en la rama. |
| U-X-05 | **Privacidad y borrar la cuenta**: Qué se comparte, políticas y baja real de la cuenta (se informa qué queda por ley y hasta cuándo). | En pruebas | sin dato | sí (handyx.pro, vista de prueba) | repo `client-be@179bd86 (fase-4-backend-conciliado):docs/state-machines.md`: «Baja: recibida → en_proceso → completada \| completada_con_retencion (se informa qué queda y hasta cuándo)» | Textos legales provisorios (pendiente Legal). |
| U-X-06 | **Descargar mis datos**: Un archivo con todo lo tuyo. | Diseñado | sin dato | no | lienzo `X-Privacidad.dc.html`: «Descargar mis datos · Un archivo con todo lo tuyo» |  |
| U-X-07 | **Ayuda con temas y preguntas**: Buscador, temas, preguntas frecuentes y «¿Te sirvió?», con paso a Soporte. | En pruebas | sin dato | sí (handyx.pro, vista de prueba) | repo `client-fe@ca04340:src/mapa/pantallas.ts`: «ayuda» | La respuesta individual está solo en la rama. |
| U-X-08 | **Errores que no dan nada por hecho**: Algo falló, sin conexión («no se mandó nada») y página no encontrada, con reintentar. | En pruebas | sin dato | sí (handyx.pro, vista de prueba) | repo `client-fe@ca04340:src/mapa/pantallas.ts`: «sin-conexion» | Usan Foco roto y Llave rota (permitidos). |

### L · Superficies públicas hoy

| Id | Función | Estado | Horizonte | Publicado | Evidencia principal | Notas |
|---|---|---|---|---|---|---|
| U-L-01 | **Vista de prueba de la PWA en handyx.pro**: La app de la Fase 2 navegable en internet con datos ficticios, banner «Vista de prueba» y panel de prueba. | En pruebas | sin dato | sí (handyx.pro, vista de prueba) | doc `gh-run-42397628127`: «NEXT_PUBLIC_ENTORNO: preview … La app publicada responde bien: index, script, rutas, 404, cabeceras de seguridad y redirección a HTTPS.» | Publica main: navegación vieja (Inicio, Pedidos, Mensajes, Agenda, Cuenta), registro con invitación, sin HandIA, sin rediseño ni viaje en vivo. No crea cuentas reales. |
| U-L-02 | **Demo interactiva del rol usuario en la landing**: Recorrido guiado de la app con datos ficticios: pedir, HandIA, presupuestos, seguimiento, chat, agenda, pagos. | Construido | sin dato | sin verificar | repo `landing-fe@ac3b245:docs/modulos/demo-interactiva.md`: «Todo con datos mock deterministas y ficticios … No hay backend» | Pieza pública sin backend. Muestra la tarifa 10 % al cliente y «Agregar tarjeta»: no representa las reglas de la PWA. Última corrida de build de main falló en el paso de GitHub Pages (29/10). |
| U-L-03 | **App de usuario por rol en handyc.com (demo en modo app)**: La misma demo, instalable, con el rol usuario fijo y sin indexar hasta el 10/11. | Construido | lanzamiento 10/11 | no | repo `landing-fe@ac3b245:docs/modulos/apps-por-rol.md`: «Usuario · https://handyc.com · Hoy las apps son la demo (datos de muestra, sin pedidos ni cobros reales)» | Choca con handyx.pro como dominio de la PWA. |

## Prioridad del pedido: decidir por calidad y precio

Ignacio pide destacar «la capacidad de ayudar al cliente a tomar una mejor decisión, considerando calidad y precio».
Así lo resuelve cada pieza, separando código de diseño.

### 1. Qué hay en código (En pruebas, servidor simulado; API en una rama)

| Pieza | Regla | Evidencia |
|---|---|---|
| Lista de propuestas | **Por orden de llegada**, «No es una recomendación ni un ranking». | `client-fe@ca04340:src/app/(app)/pedidos/propuestas/page.tsx` |
| Tabla «Comparar» | Una columna por propuesta, **sin destacar ninguna**. En `fase-3-diseno` compara: total para vos, precio del especialista, tarifa de Handyx, horario, vigencia, verificaciones y qué incluye. En `main`: precio, comisión, horario, qué incluye y verificaciones. | `client-fe@3fc03b6` y `@ca04340`, misma ruta |
| Verificaciones del especialista | Solo lo que Operations verificó (identidad, antecedentes, matrícula como tipos) con fecha, más la cantidad de trabajos hechos en Handyx. «Sin rankings, superlativos ni "matriculado" sin dato real». | `client-be@179bd86:src/contracts/v1/pedidos.ts` |
| Aceptar | Exige la misma versión que vio la persona; si cambió, la rechaza (conflicto). Hay aceptación concurrente probada entre las dos APIs. | `client-be@179bd86:docs/state-machines.md`, `docs/handoff.md` |
| Contrapropuesta | La persona propone otro precio u horario; la anterior queda «reemplazada». | contrato v1 |
| Precio propuesto por la persona y autoaceptación | Al pedir, puede sugerir un monto; la autoaceptación está apagada por defecto y solo acepta si la propuesta entra en su monto máximo. | `client-fe@ca04340:src/mapa/pantallas.ts`; `state-machines.md` |
| Vigencia | La propuesta urgente vence a los 5 minutos; el servidor aplica los vencimientos. | `state-machines.md` |

**No existen en código ni en contrato:** reseñas (solo en la vista de prueba de la rama, sin backend), promedio de
estrellas, garantía, duración, equipo, materiales incluidos o aparte, visita para presupuestar, precio orientativo de
Handyx y cualquier nota o destacado.

### 2. Qué agrega el diseño (Diseñado, lienzo)

- **Precio orientativo de Handyx** en Revisar (P-Revisar): «$ 38.000 a $ 52.000 · Sale de trabajos parecidos en tu
  zona. Handyx sugiere, nunca impone: cada especialista pone su precio».
  - Se repite arriba de las propuestas (C-Propuestas) y en el presupuesto del chat (M-Presupuesto: «Handyx sugiere entre
    $ 85.000 y $ 110.000… El precio lo pone Diego»).
  - Cada propuesta se marca «Dentro del orientativo» (C-Detalle).
  - El rango no tiene fuente de datos.
- **Tarjeta de cada propuesta** (C-Propuestas):
  - Especialista con estrellas y cantidad de trabajos, precio y «Materiales incluidos» o «aparte (≈ $ 6.000)».
  - Duración, garantía, equipo y chips de verificación.
  - Rechazar · Ver perfil · Aceptar.
  - Se muestran «En el orden en que llegaron».
- **Comparar lado a lado** (C-Comparar):
  - Filas: promedio, precio, fecha, materiales, garantía, verificaciones y reseñas.
  - Arriba, una tarjeta amarilla **«LA MEJOR EN PERFIL Y PRECIO · Julián Ortiz 8,7 de 10»**, con la frase «Buen precio
    con materiales incluidos, las mejores reseñas y las dos verificaciones» y la nota «Sale de un promedio con las
    mismas reglas para todas. Elegís vos».
  - La visita de Martín queda fuera porque «todavía no tiene precio del trabajo».
  - En la lista, esa propuesta lleva el chip «Mejor promedio».
- **Pesos del promedio:** precio 30, reseñas 25, verificaciones 20, garantía 15 y fecha 10, «iguales para todas», «no es
  recomendación paga» (`docs/diseno-usuario-deluxe.md`, segunda ronda).
  - **La pantalla final no muestra los pesos**: la cuarta ronda la dejó en «nota y una frase».
  - El plan de desarrollo pide el cálculo «con pesos fijos y prueba» (lote 2C), todavía sin hacer.
- **Detalle de la propuesta** (C-Detalle):
  - Cómo lo hace: materiales y marca, equipo, duración, garantía y si hace falta visita previa.
  - Qué incluye y qué **no** incluye, y el mensaje del especialista.
- **Perfil antes de elegir** (C-Certificados):
  - Trabajos, promedio de reseñas y verificaciones, todo «Verificado por Operations» con fecha.
  - Un curso «Cargado · sin revisar» y la regla en pantalla: «"Cargado" no es "verificado": solo mostramos como
    verificado lo que revisó Operations».
  - Trabajos recientes y reseñas.
- **Visita para presupuestar** (C-Visita): precio de la visita, «se descuenta si después lo contratás», y lo que se
  define en ella.
- **Decidir sin presión:**
  - Pedir cambios: otro día, que incluya materiales u otro precio, «sin presión» (C-Cambios).
  - Rechazar con un motivo opcional que el especialista no ve (C-Rechazar).
  - Aceptar muestra qué pasa: dirección, otras propuestas y pago directo (C-Aceptar).

### 3. Lectura para el dossier

- El argumento de calidad y precio **existe hoy en código solo como transparencia**: precio, tarifa, verificaciones
  reales y comparación neutral.
- La ayuda activa es **diseño propuesto** y depende de datos que todavía no hay (reseñas, trabajos parecidos):
  rango orientativo, nota con pesos, «la mejor» y detalle extendido.
- Antes de imprimir hay que resolver la contradicción con la regla «sin ranking» y decidir si los pesos se muestran.
- Capturas: C-Comparar (principal), C-Propuestas (recorte), C-Detalle (recorte), C-Certificados (recorte) y P-Revisar,
  más la captura real `usuario-propuestas.webp` como «lo que hay en código».


## Recorridos de punta a punta


### U-R-01 · Crear la cuenta y entrar

- **Necesidad:** Empezar a usar Handyx sin trámites ni contraseñas.
- **Acción:** Toca «Crear cuenta», elige cómo entrar, escribe el código, deja nombre, celular y zona, elige avisos y, si quiere, arma su casa.
- **Qué hace Handyx:** Pide solo lo justo (sin DNI ni CUIT), guarda la zona aproximada, avisa la tarifa 0 % hasta el 10/12/2026.
- **Resultado:** Cuenta lista e Inicio con los seis rubros.
- **Estado:** Diseñado (en código existe otra versión: alta con invitación y contraseña, En pruebas)
- **Captura principal:** `S/capturas/usuario/A-Bienvenida.png`
- **Pasos:** 1. Bienvenida: «Crear cuenta» (`A-Bienvenida`) → 2. Email, SMS, Google o Apple (`A-Entrar`) → 3. Código de 6 números (`A-Codigo`) → 4. Nombre y celular (`A-Datos`) → 5. Tu zona (`A-Zona`) → 6. Qué avisos querés (`A-Avisos`) → 7. Armá tu casa (opcional) (`A-Casa`) → 8. ¡Listo! Tarifa 0 % (`A-Listo`) → 9. Primer ingreso (`I-Inicio`) · tablero `RC-Alta.dc.html`

### U-R-02 · Pedir un arreglo en 3 toques

- **Necesidad:** Resolver un problema concreto de la casa (una canilla que gotea).
- **Acción:** Toca el rubro, elige qué pasa, revisa la tarjeta del pedido y publica.
- **Qué hace Handyx:** Pone por defecto «lo antes posible» y la dirección guardada, muestra un precio orientativo y avisa a especialistas del rubro cerca de la zona, sin prometer tiempos.
- **Resultado:** Pedido publicado; las propuestas empiezan a llegar.
- **Estado:** Diseñado (pedido en pasos En pruebas en main)
- **Captura principal:** `S/capturas/usuario/P-Revisar.png`
- **Pasos:** 1. Tocás un rubro (`I-Inicio`) → 2. ¿Qué pasa? (`P-Que`) → 3. Revisar y publicar, con precio orientativo (`P-Revisar`) → 4. Publicado (`P-Publicado`) → 5. Llegan propuestas (`C-Buscando`) · tablero `RC-Pedir.dc.html`

### U-R-03 · Pedir con HandIA, por chat o por voz

- **Necesidad:** No sabe qué rubro es ni cómo describirlo.
- **Acción:** Le cuenta a HandIA qué pasa, responde 2 o 3 preguntas rápidas y revisa la ficha.
- **Qué hace Handyx:** En el celular, sin IA externa: deduce el rubro, avisa primero si hay riesgo, tacha datos personales y arma la ficha del pedido.
- **Resultado:** Un pedido claro, tal como lo leen los especialistas, listo para publicar.
- **Estado:** En pruebas (motor y voz local en la rama handia-premium) · Diseñado (visual del lienzo)
- **Captura principal:** `S/capturas/usuario/I-HandIAFicha.png`
- **Pasos:** 1. Chat vacío con sugerencias (`I-HandIA`) → 2. Le contás qué pasa (`I-HandIAChat`) → 3. Piensa y te avisa el riesgo (`I-HandIAPiensa`) → 4. La ficha del pedido (`I-HandIAFicha`) → 5. Revisar y publicar (`P-Revisar`) → 6. O por voz: te escucha (`I-Voz`) · tablero `RC-HandIA.dc.html`

### U-R-04 · Recibir y comparar propuestas por calidad y precio

- **Necesidad:** Elegir bien entre varios presupuestos, sin saber de precios ni conocer a nadie.
- **Acción:** Ve las propuestas, las compara lado a lado, abre el detalle y el perfil del que le interesa.
- **Qué hace Handyx:** Muestra un rango orientativo que no obliga, ordena por llegada, calcula una nota con pesos fijos iguales para todas y solo marca como verificado lo que revisó Operations.
- **Resultado:** Una decisión informada: precio, condiciones, garantía, verificaciones y reseñas en una pantalla.
- **Estado:** Diseñado (lista y tabla sin ranking En pruebas)
- **Captura principal:** `S/capturas/usuario/C-Comparar.png`
- **Pasos:** 1. Tu pedido con propuestas (`C-Buscando`) → 2. Las propuestas (`C-Propuestas`) → 3. Comparar lado a lado (`C-Comparar`) → 4. Detalle de una (`C-Detalle`) → 5. Perfil del especialista (`C-Certificados`) · tablero `RC-Propuestas.dc.html`

### U-R-05 · Contratar: aceptar, pedir cambios, rechazar o aceptar una visita

- **Necesidad:** Cerrar el acuerdo o negociar sin presión.
- **Acción:** Acepta la propuesta en una hoja de confirmación, o pide otro día o precio, o rechaza, o acepta una visita previa.
- **Qué hace Handyx:** Acepta exactamente la versión vista, comparte la dirección y el teléfono solo con el elegido, cierra las demás sin dar motivos.
- **Resultado:** Turno confirmado con qué sigue: coordinar, ver venir al especialista, pagar directo.
- **Estado:** En pruebas (aceptar, rechazar, contrapropuesta) · Diseñado (visita, motivo, pantallas)
- **Captura principal:** `S/capturas/usuario/C-Aceptar.png`
- **Pasos:** 1. Aceptar (`C-Aceptar`) → 2. Turno confirmado (`C-Aceptada`) → 3. Pedir cambios (`C-Cambios`) → 4. Rechazar (`C-Rechazar`) → 5. Si es solo una consulta (`C-Visita`) · tablero `RC-Propuestas.dc.html`

### U-R-06 · Del turno al pago

- **Necesidad:** Saber quién viene, que el trabajo quede bien y pagar sin intermediarios.
- **Acción:** Sigue el viaje, confirma con un código que es él, aprueba un adicional, lee el informe, da la conformidad, paga y deja una reseña.
- **Qué hace Handyx:** Muestra la llegada que calcula el servidor solo mientras se comparte, no suma nada sin aprobación, guarda el informe con garantía y marca el pago como informado hasta verificarlo; no recibe la plata.
- **Resultado:** Trabajo terminado, pagado directo al especialista, con garantía registrada.
- **Estado:** En pruebas (estados, viaje, conformidad, efectivo) · Diseñado (código de llegada, antes y después, informe) · Mercado Pago con compuerta cerrada
- **Captura principal:** `S/capturas/usuario/S-Pagar.png`
- **Pasos:** 1. Tu turno (`S-Agendado`) → 2. En camino (`S-EnCamino`) → 3. Llegó: el código (`S-Llego`) → 4. Trabajando (`S-Trabajando`) → 5. Un adicional (`S-Adicional`) → 6. Antes y después (`S-AntesDespues`) → 8. Informe con garantía (`S-Informe`) → 9. Conformidad (`S-Conformidad`) → 10. Pagar directo (`S-Pagar`) → 11. Pago informado (`S-PagoInformado`) → 12. Reseña (opcional) (`S-Resena`) · tablero `RC-Trabajo.dc.html`

### U-R-07 · Una obra de varios días con un equipo

- **Necesidad:** Hacer un baño completo con varios oficios sin perder el control del gasto.
- **Acción:** Aprueba la propuesta de obra por etapas, sigue cada jornada, aprueba un repuesto y un cambio de fecha en el chat del equipo y paga cada etapa.
- **Qué hace Handyx:** Ordena etapas, días y responsables; nada se suma sin OK; muestra lo pagado, lo que falta y separa informado de verificado.
- **Resultado:** Obra terminada con pagos directos a cada profesional y el resumen en Mi hogar.
- **Estado:** Diseñado (etapas con confirmación y pago por etapa En pruebas)
- **Captura principal:** `S/capturas/usuario/O-Obra.png`
- **Pasos:** 1. Llega la propuesta (`M-Chat`) → 2. Propuesta de obra (`O-Propuesta`) → 3. Tu obra (`O-Obra`) → 4. Una jornada (`O-Dia`) → 5. Un repuesto (`O-Repuesto`) → 6. Mover un día (`O-Fecha`) → 7. Chat de la obra (`O-Grupo`) → 8. Pagos por etapa (`O-Pagos`) → 9. Lo gastado (`O-Gastado`) · tablero `RC-Obra.dc.html`

### U-R-08 · Mensajes, tarjetas y Soporte

- **Necesidad:** Coordinar con el especialista y resolver una duda sin salir de la app.
- **Acción:** Abre el chat del pedido, revisa un presupuesto por ítem, suma una medida y, ante un problema, escribe a Soporte.
- **Qué hace Handyx:** Ata cada chat a un pedido u obra, muestra el rango sugerido junto al precio del especialista, manda las fotos sin ubicación y responde con una persona.
- **Resultado:** Todo acordado por escrito dentro del pedido.
- **Estado:** En pruebas (chat por pedido) · Diseñado (tarjetas, adjuntar, selección)
- **Captura principal:** `S/capturas/usuario/M-Presupuesto.png`
- **Pasos:** 1. Tus mensajes (`M-Mensajes`) → 2. Chat con tarjetas (`M-Chat`) → 4. Un presupuesto (`M-Presupuesto`) → 5. Sumar algo al chat (`M-Adjuntar`) → 6. ¿A dónde va? (`T-Destino`) → 8. Seleccionar mensajes (`M-Seleccion`) → 9. Soporte de Handyx (`M-Soporte`) · tablero `RC-Mensajes.dc.html`

### U-R-09 · Actividad y avisos

- **Necesidad:** Saber qué está pendiente sin buscar.
- **Acción:** Abre Actividad o la campana y toca lo que necesita su atención.
- **Qué hace Handyx:** Agrupa en curso, agenda e historial; los avisos llevan al detalle y nunca aceptan ni pagan por la persona.
- **Resultado:** Cada pendiente resuelto desde su pantalla.
- **Estado:** En pruebas (avisos, pedidos y agenda) · Diseñado (Actividad unificada)
- **Captura principal:** `S/capturas/usuario/I-Avisos.png`
- **Pasos:** 1. Actividad (`X-Actividad`) → 2. Un turno (`S-Agendado`) → 3. Una obra (`O-Obra`) → 4. Un presupuesto (`M-Presupuesto`) → 5. Avisos (`I-Avisos`) → 6. Historial (`H-Historial`) · tablero `RC-Actividad.dc.html`

### U-R-10 · Algo se rompió: pedido armado desde Mi hogar

- **Necesidad:** Pedir otra vez sin volver a sacar fotos ni explicar la casa.
- **Acción:** Desde Mi hogar elige el ambiente y el equipo que falla, decide qué compartir y publica; si tiene garantía, se lo pide al mismo especialista.
- **Qué hace Handyx:** Arma el pedido con la ficha de la casa, comparte solo lo elegido y solo para ese pedido, y deja de compartirlo al terminar.
- **Resultado:** Pedido completo en segundos y control de lo compartido.
- **Estado:** Diseñado
- **Captura principal:** `S/capturas/usuario/H-Rompio.png`
- **Pasos:** 1. Mi hogar (`H-Hogar`) → 2. Mi casa (`H-MiCasa`) → 3. Un ambiente (`H-Ambiente`) → 6. Algo se rompió (`H-Rompio`) → 8. Qué compartís (`H-Compartir`) → 9. Lo que compartiste (`H-Compartido`) → 12. Garantías (`H-Garantias`) · tablero `RC-Hogar.dc.html`

### U-R-11 · Medir, escanear y ver en AR antes de decidir

- **Necesidad:** Mostrar el problema con precisión o ver cómo queda un equipo antes de aceptarlo.
- **Acción:** Usa medir, nivel o escaneo 3D y manda el resultado al chat o al pedido; ve en AR el equipo propuesto.
- **Qué hace Handyx:** Procesa en el celular, no manda nada hasta que se elige el destino y aclara que las medidas son aproximadas.
- **Resultado:** Propuestas más justas y menos sorpresas.
- **Estado:** Diseñado · Concepto (modelo 3D)
- **Captura principal:** `S/capturas/usuario/H-AR.png`
- **Pasos:** 1. Tus herramientas (`T-Herramientas`) → 2. Medir (`T-Medir`) → 3. Nivel (`T-Nivel`) → 5. Escanear en 3D (`T-Escanear`) → 6. Modelo 3D (más adelante) (`H-Modelo3D`) → 7. Ver en AR (`H-AR`) → 8. ¿A dónde va? (`T-Destino`) · tablero `RC-Herramientas.dc.html`

### U-R-12 · Confianza de punta a punta

- **Necesidad:** Saber que quien entra a la casa es quien dice ser y que lo acordado se cumple.
- **Acción:** Mira las verificaciones antes de elegir, pide el código al abrir, guarda el informe con garantía y ve sus pagos informados y verificados.
- **Qué hace Handyx:** Separa «cargado» de «verificado» (solo Operations verifica), protege la dirección hasta aceptar, guarda garantías y no da por hecho ningún pago.
- **Resultado:** Un historial confiable de la casa y de cada especialista.
- **Estado:** Diseñado (verificaciones en propuesta y pagos informado ≠ verificado En pruebas)
- **Captura principal:** `S/capturas/usuario/recortes/C-Certificados-recorte.png`
- **Pasos:** 1. Perfil con verificaciones (`C-Certificados`) → 2. Código al llegar (`S-Llego`) → 3. Informe con garantía (`S-Informe`) → 4. Garantías vigentes (`H-Garantias`) → 5. Pagos registrados (`X-Pagos`) → 6. Reseña (`S-Resena`) · tablero `RC-Propuestas.dc.html`

## Índice del Dossier 02 (17 secciones)

| Sección | Funciones | Capturas | Huecos |
|---|---|---|---|
| 1. Portada | U-A-01 | `A-Bienvenida.png`, `I-Voz.png` | Ninguna pantalla es portada; A-Bienvenida dice «especialistas verificados» (reformular o recortar el titular). |
| 2. La experiencia del cliente | U-I-01, U-I-02 | `FL-Mapa.png`, `I-Inicio.png` | Falta un mapa simple de la experiencia en una página (FL-Mapa es técnico); armarlo con los 12 recorridos. |
| 3. Problemas actuales al contratar servicios | — | — | Ninguna fuente de esta superficie describe el problema con datos: lo debe aportar la auditoría de negocio (afirmaciones del pitch). No inventar. |
| 4. Cómo Handyx simplifica el proceso | U-A-01, U-P-02, U-C-04, U-S-08 | `FL-Propuestas.png`, `FL-Seguimiento.png` | La promesa de A-Bienvenida («Contás qué pasa, recibís propuestas con precio y elegís vos. Pagás directo al especialista») es la mejor síntesis; falta un diagrama propio. |
| 5. Registro y onboarding | U-A-02, U-A-03, U-A-04, U-A-05, U-A-06, U-A-07, U-A-08, U-A-09 | `RC-Alta.png`, `A-Datos.png`, `A-Listo.png`, `usuario-modal-fee.webp` | Decidir invitación sí/no y contraseña sí/no antes de imprimir: diseño y código dicen lo contrario. |
| 6. Exploración y búsqueda de profesionales | U-I-01, U-P-07, U-C-08 | `I-Inicio.png`, `C-Certificados-recorte.png` | No existe un buscador ni directorio de profesionales: el pedido se muestra a especialistas del rubro y la zona y ellos responden. Especialistas guardados/favoritos no tienen contrato. La sección tiene que explicar ese modelo, no inventar búsqueda. |
| 7. Solicitud de servicios | U-P-01, U-P-02, U-P-03, U-P-04, U-P-06, U-I-03, U-I-04 | `P-Que.png`, `P-Revisar.png`, `I-HandIAFicha.png`, `P-Publicado.png` | Aclarar qué es código (pedido en pasos) y qué es diseño (3 toques, anotar, medir). |
| 8. Recepción de presupuestos | U-C-01, U-C-02, U-M-02, U-P-06 | `C-Propuestas-recorte.png`, `M-Presupuesto.png`, `usuario-propuestas.webp` | Sin datos reales de cuántas propuestas llegan ni en cuánto tiempo (y no se deben prometer). |
| 9. Comparación de alternativas | U-C-03, U-C-04 | `C-Comparar.png`, `FL-Propuestas.png` | Lo único en código es la tabla sin ranking. «La mejor en perfil y precio» es diseño y choca con la regla «sin ranking»: rotular «Diseño propuesto» y resolver la contradicción. |
| 10. Criterios de calidad y precio | U-P-05, U-C-04, U-C-06, U-C-07, U-C-08 | `C-Comparar.png`, `C-Detalle-recorte.png`, `P-Revisar.png` | Faltan los pesos visibles en pantalla y la fuente del precio orientativo; definir si los pesos se publican. |
| 11. Selección y contratación | U-C-10, U-C-11, U-C-12, U-C-09 | `C-Aceptar.png`, `C-Aceptada.png`, `C-Visita.png` | — |
| 12. Seguimiento del trabajo | U-S-01, U-S-02, U-S-04, U-S-05, U-S-06, U-S-07, U-S-08, U-S-09, U-S-12, U-O-01, U-O-02, U-O-03, U-O-07 | `RC-Trabajo.png`, `S-EnCamino.png`, `S-Pagar.png`, `O-Obra.png` | Mercado Pago no funciona hoy (compuerta cerrada); decir «efectivo hoy, Mercado Pago cuando se valide». |
| 13. Comunicación y organización | U-M-01, U-M-02, U-M-03, U-M-04, U-M-05, U-I-07, U-X-01, U-X-02, U-H-05 | `M-Chat.png`, `M-Presupuesto.png`, `I-Avisos.png`, `M-Soporte-recorte.png` | X-Actividad usa la Canilla: preferir I-Avisos. |
| 14. Confianza y reputación | U-C-07, U-C-08, U-S-03, U-S-06, U-S-08, U-S-11, U-S-13, U-A-05, U-X-05 | `C-Certificados-recorte.png`, `S-Llego.png`, `S-PagoInformado.png`, `S-Informe.png` | No hay especialistas verificados reales todavía ni reseñas reales; las del lienzo son de muestra. Reseñas sin contrato. Definir política de moderación y quién da la garantía. |
| 15. Funcionalidades adicionales | U-H-01, U-H-02, U-H-03, U-H-04, U-H-06, U-H-07, U-H-08, U-T-01, U-T-02, U-T-03, U-G-01, U-G-02, U-G-03, U-I-04, U-I-05 | `H-Hogar.png`, `T-Medir.png`, `H-AR.png`, `G-Camino.png`, `I-Voz.png` | Todo es Diseñado o Concepto: rotular cada imagen. Camino con montos en borrador Legal. |
| 16. Roadmap de experiencia | U-I-06, U-G-03, U-H-07 | `UX-Revision.png` | El plan por olas (Fase 7: olas 0–4, después Fase 5 deploy) no tiene fechas y espera el OK de Ignacio; HandIA H0–H7 tampoco. Pedir fechas o mostrar solo el orden. |
| 17. Cierre institucional | — | `A-Listo.png` | Sin contenido propio de esta superficie; lo define la ola 2 (narrativa común). |

## Contradicciones

No se elige ninguna versión: van las dos con su fuente.

| Tema | A | B | Impacto | Pregunta |
|---|---|---|---|---|
| **Tarifa al usuario** | Tarifa de servicio 0 % hasta el 10/12/2026 «durante la demo»; después no se anuncia ninguna (código: «sin anunciar tarifas no aprobadas») — _lienzo A-Listo / P-Revisar / S-Pagar; client-fe AGENTS.md, 2026-11-07_ | 10 % al cliente (tarifas.json) y «primer mes sin tarifa» desde el 10/11; el pitch dice 15 % al usuario desde el lanzamiento (TARIFA-USUARIO, PRUEBA-COM-USUARIO) — _Handy-landing-page-fe src/content/tarifas.json y CLAUDE.md; afirmaciones.json, 2026-10-27 / 2026-11-05_ | El dossier no puede dar una cifra de tarifa al usuario posterior al 10/12 sin elegir una versión. | ¿Cuál es la tarifa al usuario después del 10/12/2026 y se puede publicar? |
| **Comisión al especialista** | Handyx no le cobra comisión al especialista nunca (decisión del 08/11/2026) — _client-be@8ce44f4 CLAUDE.md (commit del 07/11 14:06 UTC), 2026-11-07_ | 10 % al especialista y camada fundadora de 5 % por 12 meses — _Handy-landing-page-fe tarifas.json / CLAUDE.md, 2026-10-27_ | Afecta lo que el dossier diga sobre por qué el precio es justo y quién paga a Handyx. Además el commit del 07/11 cita una decisión fechada el 08/11. | ¿Confirmás 0 % al especialista y la fecha real de esa decisión? |
| **Registro: invitación y contraseña** | Registro directo, sin invitación ni contraseñas (código por email/SMS, Google o Apple) — _lienzo FL-Acceso; client-fe@589487b docs/diseno-usuario-deluxe.md (tercera ronda), 2026-11-07_ | Alta con invitación de la demo cerrada; ingreso con email y contraseña; modal «solo con invitación» — _client-be contrato v1 (fase-4-backend-conciliado); client-be CLAUDE.md; client-fe AGENTS.md; captura usuario-modal-fee.webp, 2026-11-02 / 2026-10-31_ | La sección 5 describe dos onboarding distintos. | ¿El 10/11 se entra con invitación o sin ella? ¿Con contraseña o con código? |
| **HandIA activada o no, y con qué IA** | HandIA desactivada — _client-fe@ca04340 AGENTS.md (main, lo publicado en handyx.pro), 2026-10-29_ | HandIA incluida, conversa en el celular sin IA externa (lienzo «En tu celular · sin IA externa»); el plan H6–H7 suma OpenAI y ElevenLabs con autorización — _client-fe@589487b AGENTS.md y docs/handia-premium-plan.md; lienzo I-HandIA, 2026-11-07_ | Presentar HandIA como «inteligencia artificial» o como lista para usar sería inexacto: hoy es un motor de reglas local en una rama. | ¿HandIA está en la app del 10/11? ¿Cómo se la describe: asistente en el celular o IA? |
| **HandIA y las fotos** | HandIA no ve tus fotos: van al pedido, para los especialistas; no recibe fotos ni audio — _lienzo P-Fotos y FL-Pedir; client-fe@589487b AGENTS.md, 2026-11-07_ | En la demo de la landing la persona le manda una foto a HandIA en el chat («Así está») — _brands/handyx/assets/demo-landing/usuario-handia.webp (demo de la landing), 2026-10-31_ | Usar la captura de la demo contradice la regla de privacidad de la app. | ¿Se descarta la captura usuario-handia.webp para el dossier? |
| **HandIA por voz: personaje o esfera** | Voz sin personaje: esfera de luz — _lienzo UX-Revision / I-Voz, 2026-11-07_ | Modo voz como ChatGPT Voice «con los personajes de Handyx»; en código, lamparita que reacciona — _client-fe@589487b docs/handia-premium-plan.md y docs/handoff.md, 2026-11-07_ | Menor para el dossier (usar el lienzo), pero define qué imagen representa la voz. | ¿La voz final lleva al Foco o la esfera? |
| **Ranking de propuestas** | «La mejor en perfil y precio» (nota 8,7 de 10) y chip «Mejor promedio», por promedio con pesos fijos — _lienzo C-Comparar / C-Propuestas; diseno-usuario-deluxe.md, 2026-11-07_ | «Ordenadas por llegada. No es una recomendación ni un ranking»; contrato: «sin rankings, superlativos» — _client-fe@ca04340 pedidos/propuestas/page.tsx; client-be contracts/v1/pedidos.ts, 2026-10-29 / 2026-11-02_ | Es la prioridad del pedido (decidir por calidad y precio): hay que decir que el destacado es diseño y que choca con una regla vigente. | ¿Se aprueba destacar una propuesta? ¿Con qué pesos y se muestran? |
| **Pesos del promedio a la vista** | Pesos fijos (precio 30, reseñas 25, verificaciones 20, garantía 15, fecha 10), «a la vista»; descripción del tablero: «los pesos a la vista» — _diseno-usuario-deluxe.md (segunda ronda); design/usuario/gen/textos_pantallas.py, 2026-11-07_ | La pantalla final muestra solo la nota y una frase («Sale de un promedio con las mismas reglas para todas»), sin pesos — _lienzo C-Comparar; diseno-usuario-deluxe.md (cuarta ronda: «nota y una frase»), 2026-11-07_ | El dossier no debe decir que los pesos se ven si la pantalla no los muestra. | ¿Los pesos se muestran al usuario? |
| **Quién verifica un pago** | El pago queda verificado cuando el especialista lo confirma (o llega el aviso de Mercado Pago) — _lienzo S-PagoInformado / X-Pagos, 2026-11-07_ | reportado → verificado por el proveedor u Operations — _client-be@179bd86 docs/state-machines.md y handoff 4.5, 2026-11-02_ | Regla de confianza que el dossier explica en la sección 14. | ¿La confirmación del especialista verifica un pago en efectivo? |
| **Mercado Pago** | «Se verifica solo» al pagar con Mercado Pago — _lienzo S-Pagar, 2026-11-07_ | Reportar por Mercado Pago y el checkout responden función inactiva hasta validar la integración; la app ofrece efectivo — _client-be@179bd86 docs/handoff.md (lote 4.5), 2026-11-01_ | Hoy no se puede pagar por Mercado Pago en la app. | ¿Habrá Mercado Pago el 10/11? |
| **Cómo se marca la llegada** | El especialista marca «Llegué»; el lienzo suma un código de 4 números para abrir — _client-be state-machines; lienzo S-Llego, 2026-11-02 / 2026-11-07_ | No hay confirmación manual de llegada: la marca una geocerca (simulada) — _Handy-landing-page-fe docs/modulos/demo-interactiva.md, 2026-10-29_ | Las capturas de la demo y las del lienzo cuentan mecánicas distintas. | ¿Llegada manual, por geocerca o con código? |
| **Dominio de la app del usuario** | https://handyc.com (app del usuario, demo en modo app) — _Handy-landing-page-fe docs/modulos/apps-por-rol.md y CLAUDE.md, 2026-10-29_ | https://handyx.pro (vista de prueba, publicado el 07/11); API prevista en api.handyx.pro — _client-fe@ca04340 .github/workflows/hostinger.yml; fase-3-diseno docs/deploy-hostinger.md, 2026-11-07_ | El QR y los textos del dossier necesitan una sola dirección. | ¿Cuál es el dominio de la app del usuario para imprimir? |
| **Tiempos de respuesta** | «Los especialistas responden cuando pueden: no hay un tiempo fijo» — _lienzo P-Publicado, 2026-11-07_ | Ventana de búsqueda urgente 20 min, programado 12 h; propuesta urgente vence a los 5 min — _client-be docs/state-machines.md, 2026-11-02_ | Bajo: no es una promesa al usuario, pero el dossier no debe decir «sin límite». | ¿Se comunica la ventana de 20 min al usuario? |
| **Antecedentes del especialista** | Antecedentes «Revisados en persona»; nunca como archivo — _lienzo C-Certificados; handyx-specialist-fe CLAUDE.md, 2026-11-07_ | Antecedentes por foto o PDF (fase V), cifrados, solo Operations, pendiente de implementar y de revisión legal — _client-be@8ce44f4 CLAUDE.md, 2026-11-07_ | Cambia cómo se describe la verificación en la sección 14. | ¿Cómo se verifican los antecedentes al lanzar? |
| **Tecnología de la app de producción** | La app de producción es React Native bare (TECH-01) — _Handy-landing-page-fe docs/modulos/demo-interactiva.md, 2026-10-29_ | PWA en Next.js con export estático — _handyx-client-fe AGENTS.md y ADR-0001, 2026-10-29_ | Bajo para el dossier del cliente; relevante para el de negocio. | ¿Se actualiza TECH-01? |
| **Tarjetas** | «Agregar tarjeta» con datos ficticios — _Handy-landing-page-fe demo (u-agregar-tarjeta), 2026-10-29_ | Sin «Agregar tarjeta»; no se guardan tarjetas — _client-fe AGENTS.md; lienzo X-Pagos, 2026-11-07_ | No usar capturas de la demo con tarjetas. | — |
| **Reclamos** | Reclamos con estados (abierto, en revisión, resuelto, cerrado) en código y API — _client-fe@ca04340 mapa; client-be state-machines, 2026-11-02_ | El lienzo no tiene pantallas de reclamo: «Hay un problema» en la conformidad y Soporte por chat — _lienzo S-Conformidad, M-Soporte, 2026-11-07_ | El dossier puede omitir una función que existe o mostrar un camino que el diseño reemplazó. | ¿Los reclamos siguen en la app rediseñada? |
| **Nombre de la marca en la PWA** | «Tarifa de Handy», «Comisión de Handy», «Handy no recibe» — _capturas-pwa (usuario-cuenta, usuario-propuesta, usuario-pago), 2026-10-31_ | Nombre público Handyx — _lienzo; consigna, 2026-11-07_ | Las capturas reales de la PWA muestran el nombre viejo. | — |
| **Cantidad de pantallas del lienzo** | 101 pantallas — _pedido de esta auditoría, 2026-11-07_ | 102 pantallas (UX-Revision y conteo de capturas); 103 en diseno-usuario-deluxe.md — _lienzo UX-Revision; capturas/usuario/indice.json; client-fe@589487b docs, 2026-11-07_ | Usar 102 si se cita. | — |
| **Qué es el 10/11** | Lanzamiento de la PWA el 10/11/2026 — _afirmaciones.json LANZAMIENTO; CLAUDE.md de la landing, 2026-10-26_ | «Demo cerrada del 10/11 al 10/12/2026, solo con invitación»; «Durante la demo no hay tarifa» — _captura usuario-modal-fee.webp; lienzo A-Listo, 2026-10-31 / 2026-11-07_ | El dossier tiene que decir si el 10/11 es lanzamiento abierto o demo cerrada. | ¿El 10/11 es lanzamiento público o demo cerrada? |

## Faltantes

| Dato | Para | Pregunta |
|---|---|---|
| Qué versión de la app usa la gente el 10/11 | dossier 02 · 16 y portada | handyx.pro sirve la vista de prueba de la Fase 2 y la API no está desplegada (main del BE sin código, Render sin deploy). ¿Qué se lanza el 10/11 y con qué backend? |
| OK de Ignacio al lienzo de la app del usuario | dossier 02 · 15 y 16 | El plan por olas espera el OK (Ola 0.1). ¿Está aprobado el lienzo? |
| Fuente del precio orientativo | dossier 02 · 10 | «Sale de trabajos parecidos en tu zona»: ¿de qué datos sale el rango si todavía no hay trabajos? |
| Pesos y reglas de «La mejor en perfil y precio» | dossier 02 · 9 y 10 | ¿Se aprueban los pesos 30/25/20/15/10 y se publican? ¿Revisión legal (defensa del consumidor) sobre destacar una oferta? |
| Tarifa al usuario después del 10/12 | dossier 02 · 11 y 14 | 0 %, 10 % o 15 %. ¿Cuál y desde cuándo? |
| Problemas actuales al contratar servicios (evidencia) | dossier 02 · 3 | ¿Hay encuesta, entrevistas o datos propios? Si no, la sección queda con [a definir]. |
| Reseñas: contrato y moderación | dossier 02 · 14 | ¿Las reseñas existen el 10/11? ¿Quién las modera y qué se publica? |
| Quién da la garantía y con qué texto | dossier 02 · 12 y 14 | Los informes muestran «Garantía hasta…»: ¿la da el especialista o Handyx? Texto legal pendiente. |
| Exploración de profesionales | dossier 02 · 6 | ¿Se quiere un buscador o directorio de especialistas, o se explica que el pedido llega a los especialistas de la zona? |
| Fechas del roadmap | dossier 02 · 16 | Las olas 1–4 de la Fase 7 y HandIA H1–H7 no tienen fechas. ¿Se publican fechas o solo el orden? |
| Proveedores de acceso (SMS, Google, Apple) y 3D/AR | dossier 02 · 5 y 15 | Decisiones 0.3 y 0.4 abiertas. |
| Montos y premios del Camino del hogar | dossier 02 · 15 | Borrador para Legal: ¿se muestra el Camino sin montos? |
| Métricas reales de uso de la app | dossier 02 · 2 y 14 | No hay usuarios reales en la PWA. ¿Hay algún dato de la prueba con porteros aplicable al usuario? (TRABAJOS-INFORMADOS: 5, no mostrar hasta conciliar). |
| Estado de la demo publicada en landing.handyc.com/demo | dossier 02 · 2 | La última corrida de build de la landing en main falló (29/10); no se pudo verificar qué versión está en línea. |

## Capturas recomendadas

Rutas con `S/` = scratchpad de la producción. Los recortes ya están generados en `S/capturas/usuario/recortes/` (PIL, sin retocar el diseño).

| PNG | Uso | Rótulo | px | Personajes | Riesgos | Por qué |
|---|---|---|---|---|---|---|
| `S/capturas/usuario/A-Bienvenida.png` | dossier 02 · 1 y 4 | Diseño propuesto | 1170x2532 | — | dice «especialistas verificados» sin especialistas verificados todavía | Ilustración propia de Mar del Plata, sin personajes, con la promesa en una línea. |
| `S/capturas/usuario/FL-Mapa.png` | dossier 02 · 2 | Diseño propuesto | 2692x1452 | — | — | Mapa de la app: las cinco pestañas y a dónde lleva cada una. |
| `S/capturas/usuario/I-Inicio.png` | dossier 02 · 2 y 6 | Diseño propuesto | 1170x3600 | foco | cifra/nombre de muestra que puede leerse como real (Julián Ortiz, Lucía Ferreyra) | El Inicio completo: rubros, turno, HandIA y «Quiero…». |
| `S/capturas/usuario/P-Revisar.png` | dossier 02 · 7 y 10 | Diseño propuesto | 1170x2532 | — | cifra/nombre de muestra que puede leerse como real ($ 38.000 a $ 52.000); precio orientativo sin fuente de datos; tarifa 0 % hasta el 10/12 (versión en disputa) | Un pedido entero en una tarjeta y el precio orientativo: «Handyx sugiere, nunca impone». |
| `S/capturas/usuario/P-Publicado.png` | dossier 02 · 7 | Diseño propuesto | 1170x2532 | — | «especialistas verificados» | Escena propia sin personajes; reemplaza a C-Buscando (que muestra la Canilla). |
| `S/capturas/usuario/I-HandIAFicha.png` | dossier 02 · 7 | Diseño propuesto | 1170x2532 | foco | «sin IA externa» debe convivir con el plan H6–H7 (OpenAI) | La ficha que arma HandIA y la persona revisa. |
| `S/capturas/usuario/I-Voz.png` | dossier 02 · 1 y 15 | Diseño propuesto | 1170x2532 | — | en iPhone hoy no escucha | Imagen fuerte sin personaje: la esfera de la voz. |
| `S/capturas/usuario/recortes/C-Propuestas-recorte.png` (recorte 0,0,1170,2532) | dossier 02 · 8 | Diseño propuesto | 1170x2532 | — | cifra/nombre de muestra que puede leerse como real (precios, 4,9 · 23 trabajos); chip «Mejor promedio» (ranking en disputa) | Primer pantallazo de las propuestas: orientativo, precio, duración, garantía, equipo y verificaciones. |
| `S/capturas/usuario/C-Comparar.png` | dossier 02 · 9 y 10 | Diseño propuesto | 1170x2700 | — | cifra/nombre de muestra que puede leerse como real; «La mejor en perfil y precio» contradice la regla vigente «sin ranking»; no muestra los pesos | La pantalla que mejor responde a la prioridad del pedido: calidad y precio lado a lado. |
| `S/capturas/usuario/FL-Propuestas.png` | dossier 02 · 4 y 9 | Diseño propuesto | 2692x1452 | — | — | Diagrama de propuestas sin personajes; reemplaza a RC-Propuestas (Canilla en el paso 1). |
| `S/capturas/usuario/recortes/C-Detalle-recorte.png` (recorte 0,0,1170,2532) | dossier 02 · 10 | Diseño propuesto | 1170x2532 | — | cifra/nombre de muestra que puede leerse como real; «Marca FV o similar» nombra una marca real | Qué incluye y cómo lo hace: calidad explicada. |
| `S/capturas/usuario/recortes/C-Certificados-recorte.png` (recorte 0,0,1170,2532) | dossier 02 · 14 | Diseño propuesto | 1170x2532 | — | cifra/nombre de muestra que puede leerse como real (verificación del 02/11/2026, reseñas de Carla I. y Pablo V.); reseñas de muestra pueden leerse como testimonios | «Cargado» no es «verificado»: la regla de confianza en una pantalla. |
| `S/capturas/usuario/C-Aceptar.png` | dossier 02 · 11 | Diseño propuesto | 1170x2532 | — | cifra/nombre de muestra que puede leerse como real | Qué pasa al aceptar: dirección, otras propuestas, pago directo. |
| `S/capturas/usuario/RC-Trabajo.png` | dossier 02 · 12 | Diseño propuesto | 3540x3220 | — | cifra/nombre de muestra que puede leerse como real; Mercado Pago «se verifica solo» (hoy inactivo) | Recorrido completo del turno al pago con lo que pasa entre pantallas; sin personajes. |
| `S/capturas/usuario/S-EnCamino.png` | dossier 02 · 12 | Diseño propuesto | 1170x2532 | — | hora de llegada 10:24 de muestra | Viaje en vivo con la llegada del servidor (existe en una rama). |
| `S/capturas/usuario/S-Llego.png` | dossier 02 · 14 | Diseño propuesto | 1170x2532 | — | función solo dibujada (sin contrato) | Seguridad en la puerta, fácil de entender. |
| `S/capturas/usuario/S-Pagar.png` | dossier 02 · 12 | Diseño propuesto | 1170x2700 | — | cifra/nombre de muestra que puede leerse como real ($ 54.500); tarifa 0 % hasta el 10/12; Mercado Pago hoy inactivo | Pago directo con «volver a la app no confirma nada». |
| `S/capturas/usuario/S-PagoInformado.png` | dossier 02 · 14 | Diseño propuesto | 1170x2532 | — | cifra/nombre de muestra que puede leerse como real; quién verifica difiere del BE | «Informado no es verificado» en tres pasos. |
| `S/capturas/usuario/O-Obra.png` | dossier 02 · 12 | Diseño propuesto | 1170x2532 | — | cifra/nombre de muestra que puede leerse como real ($ 400.000, $ 450.000) | Una obra de varios días con pagado y falta. |
| `S/capturas/usuario/M-Presupuesto.png` | dossier 02 · 8 y 13 | Diseño propuesto | 1170x2532 | — | cifra/nombre de muestra que puede leerse como real ($ 99.000; sugiere $ 85.000 a $ 110.000) | Presupuesto por ítem dentro del chat con el rango sugerido. |
| `S/capturas/usuario/recortes/M-Soporte-recorte.png` (recorte 0,540,1170,1992) | dossier 02 · 13 | Diseño propuesto | 1170x1992 | — | cifra/nombre de muestra que puede leerse como real | Soporte atendido por personas, sin el grupo de Handys (recortado). |
| `S/capturas/usuario/I-Avisos.png` | dossier 02 · 13 | Diseño propuesto | 1170x2532 | — | cifra/nombre de muestra que puede leerse como real | Avisos que llevan al detalle; reemplaza a X-Actividad (Canilla). |
| `S/capturas/usuario/H-Hogar.png` | dossier 02 · 15 | Diseño propuesto | 1170x2700 | foco | cifra/nombre de muestra que puede leerse como real (80 %, 6 ambientes, 11 equipos); función sin contrato | Las cuatro puertas de Mi hogar. |
| `S/capturas/usuario/H-Rompio.png` | dossier 02 · 15 | Diseño propuesto | 1170x2940 | — | cifra/nombre de muestra que puede leerse como real | El pedido que sale armado desde la ficha de la casa. |
| `S/capturas/usuario/T-Medir.png` | dossier 02 · 15 | Diseño propuesto | 1170x2532 | — | medidas aproximadas: aclararlo | Herramienta visual y concreta. |
| `S/capturas/usuario/H-AR.png` | dossier 02 · 15 | Concepto | 1170x2532 | — | AR sin decisión técnica (0.4); cifra/nombre de muestra que puede leerse como real (Pablo Vega) | Ver un equipo en tamaño real antes de aceptarlo. |
| `S/capturas/usuario/G-Camino.png` | dossier 02 · 15 | Diseño propuesto | 1170x2532 | foco | beneficios en borrador Legal | Gamificación sin azar ni rankings. |
| `S/capturas/usuario/recortes/G-Hito-recorte.png` (recorte 0,0,1170,1410) | dossier 02 · 15 | Diseño propuesto | 1170x1410 | — | — | Celebración sin el grupo de Handys (recortado arriba de la tarjeta). |
| `S/capturas/usuario/UX-Revision.png` | dossier 02 · 16 | Diseño propuesto | 2692x1600 | — | menciona proveedores y decisiones abiertas: usar como fuente, no como página | Resume reglas, contrato faltante, Legal y proveedores. |
| `brands/handyx/assets/capturas/usuario-propuestas.webp` | dossier 02 · 9 | Pantalla de la PWA · datos de prueba | 780x1688 | — | banner «Vista de prueba»; dice «Comisión de Handy» (nombre viejo); cifra/nombre de muestra que puede leerse como real | Prueba de lo que hay en código: propuestas sin ranking. |
| `brands/handyx/assets/capturas/usuario-pago-metodo.webp` | dossier 02 · 12 | Pantalla de la PWA · datos de prueba | 780x1688 | — | «Handy» en el texto; cifra/nombre de muestra que puede leerse como real | Pago directo real del código: efectivo o Mercado Pago, sin tarjeta. |
| `brands/handyx/assets/capturas/usuario-modal-fee.webp` | dossier 02 · 5 | Pantalla de la PWA · datos de prueba | 780x1688 | — | «solo con invitación» contradice el lienzo; «Handy» en el texto | El aviso de tarifa tal como está en código. |

### Personajes: capturas que no conviene usar tal cual

Diez tableros usan Canilla, Gota o el grupo (`personajes-lienzos.json`). Foco, Foco roto y Llave rota (permitidos) aparecen en HandIA, Inicio, Mi hogar, Camino y errores.

| Captura | Personaje no permitido | Alternativa o recorte |
|---|---|---|
| `C-Buscando.png` | canilla | P-Publicado.png o el mapa recortado (y 0–1380) sin la hoja |
| `X-Actividad.png` | canilla (tarjeta «Canilla del baño») | I-Avisos.png |
| `M-Soporte.png` | grupo (Canilla, Gota, Engranaje, Foco, Llave) | recortes/M-Soporte-recorte.png (0,540,1170,1992) |
| `G-Hito.png` | grupo en la tarjeta inferior | recortes/G-Hito-recorte.png (0,0,1170,1410) |
| `RC-Pedir.png` | canilla (miniatura de C-Buscando, paso 5) | FL-Pedir.png o componer con P-Que, P-Revisar y P-Publicado |
| `RC-Propuestas.png` | canilla (miniatura de C-Buscando, paso 1) | FL-Propuestas.png + pantallas sueltas |
| `RC-Actividad.png` | canilla (miniatura de X-Actividad) | componer con I-Avisos y S-Agendado |
| `RC-Mensajes.png` | grupo (miniatura de M-Soporte) | FL-Mensajes.png + recorte de M-Soporte |
| `RC-Camino.png` | grupo (miniatura de G-Hito) | FL-Camino.png + G-Camino y recorte de G-Hito |
| `RC-Cuenta.png` | grupo (miniatura de M-Soporte) | FL-Cuenta.png + pantallas X sueltas |
| `demo-landing/usuario-handia.webp` | — | muestra una foto enviada a HandIA (contradice la regla de privacidad); usar I-HandIAFicha.png |

## Riesgos de publicación

| Qué | Dónde | Recomendación |
|---|---|---|
| «Especialistas verificados» en pantallas de diseño | A-Bienvenida, P-Publicado, C-Certificados, RC-Alta | Hoy hay especialistas registrados, no verificados. Recortar el titular o rotular «Diseño propuesto · datos ficticios» y explicar que «verificado» solo aparece con revisión de Operations. |
| Precios, nombres, reseñas y fechas de muestra | Todas las pantallas del lienzo (Julián Ortiz, Lucía Ferreyra, $ 45.000, $ 38.000–$ 52.000, $ 850.000, reseñas de Carla I. y Pablo V.) | Rótulo fijo «Muestra · datos ficticios» en cada imagen; nunca citar esas cifras en el texto. |
| Tarifa en pantalla | A-Listo, P-Revisar, C-Aceptar, S-Pagar, O-Gastado, X-Cuenta, capturas de la PWA | No publicar porcentajes de tarifa hasta resolver las cuatro versiones; si se muestra «0 % hasta el 10/12/2026», aclarar que es la condición de la demo. |
| Funciones dibujadas presentadas como existentes | Mi hogar, herramientas, 3D, AR, camino, comparar con «la mejor», visita, código de llegada, informe | Rotular cada imagen con su estado (Diseño propuesto / Concepto); una tabla de estados en la sección 16. |
| handyx.pro presentado como la app | QR, textos, portada | Es una vista de prueba con datos ficticios de la Fase 2; no imprimir ese dominio como «la app» sin decisión. |
| HandIA descrita como inteligencia artificial | Sección 7 y 15 | Decir «asistente que arma el pedido en tu celular, sin IA externa»; el plan con OpenAI/ElevenLabs es Concepto sujeto a autorización y revisión legal. |
| Personajes no permitidos | C-Buscando, X-Actividad, M-Soporte, G-Hito y los RC que los incluyen | Usar los recortes y alternativas de la lista; no retocar las pantallas. |
| Ranking de propuestas | C-Comparar, C-Propuestas («Mejor promedio») | Mostrar como diseño, explicar pesos fijos iguales para todas y que no es recomendación paga; señalar que choca con la regla vigente del contrato. |
| Mercado Pago «se verifica solo» | S-Pagar | Aclarar que hoy la integración está inactiva y que la app ofrece efectivo. |
| Marcas y lugares reales | C-Detalle («Marca FV o similar»), demo de la landing («Catamarca 1650 · La Perla») | Recortar o rotular; la dirección de la demo puede ser real: no usarla. |
| Capturas reales de la PWA con el nombre «Handy» | usuario-cuenta, usuario-propuesta, usuario-pago, usuario-modal-fee | Usarlas solo como evidencia de código, con rótulo «Pantalla de la PWA · datos de prueba»; no como imagen principal. |
| Demo de la landing con tarifa 10 % y tarjetas | Handy-landing-page-fe /demo/, capturas de demo-landing y publicidades | No usarla para explicar precios ni pagos en el dossier 02. |

## Fuentes

- `lienzo-usuario` (lienzo, 2026-11-07): Artifact A4T5bqyE8WEiQkwD4ogDaZ · copia local S/artifacts/usuario/project + capturas S/capturas/usuario (128 tableros: 102 pantallas, 13 recorridos RC, 12 flujos FL, UX-Revision)
- `client-fe@ca04340` (repo, 2026-11-07): handyx-client-fe origin/main: fases 1 y 2 (mockup completo sobre servidor simulado) + workflow de publicación en handyx.pro
- `client-fe@3fc03b6 (fase-3-diseno)` (repo, 2026-11-07): handyx-client-fe rama fase-3-diseno: rediseño 3.1–3.9 y lotes 4.1–4.7 (viaje en vivo, conexión preparada); sin mergear
- `client-fe@589487b (handia-premium)` (repo, 2026-11-07): handyx-client-fe rama handia-premium (sale de fase-3-diseno): HandIA en el celular con voz local, fuente del lienzo en design/usuario, docs/diseno-usuario-deluxe.md, docs/plan-olas.md (Fase 7), docs/handia-premium-plan.md; sin mergear
- `client-be@main` (repo, 2026-11-07): handyx-client-be origin/main: e0a40da «Initial commit» (fetch de las 19:05); en GitHub, después, bd600fa y 150bbf2 agregan solo CI/CD a Render y la corrida dice «El repo todavía no tiene código: no hay nada que deployar»
- `client-be@179bd86 (fase-4-backend-conciliado)` (repo, 2026-11-02): handyx-client-be rama fase-4-backend-conciliado: contrato 1.0.0-draft.3 (54 endpoints de usuario), docs/state-machines.md, docs/handoff.md; probado solo contra PostgreSQL local aislado
- `client-be@8ce44f4 (claude/pensive-hypatia-jajjgm)` (repo, 2026-11-07): handyx-client-be rama claude/pensive-hypatia-jajjgm: esquema compartido; último commit cambia CLAUDE.md (antecedentes por foto o PDF, sin comisión al especialista)
- `landing-fe@ac3b245` (repo, 2026-10-29): Handy-landing-page-fe origin/main: demo /demo/ rol usuario (src/render/demo/usuario.ts, docs/modulos/demo-interactiva.md, docs/modulos/apps-por-rol.md, src/content/tarifas.json)
- `gh-run-42397628127` (doc, 2026-11-07): GitHub Actions handyx-client-fe «Publicar en Hostinger (handyx.pro)» sobre main ca04340: build en modo preview y job publicar OK con prueba pública
- `gh-run-40933042318` (doc, 2026-10-29): GitHub Actions Handy-landing-page-fe «Apps por rol en Hostinger»: builds OK, job publicar omitido
- `capturas-pwa` (doc, 2026-10-31): presentations-studio brands/handyx/assets/capturas/usuario-*.webp + capturas.json (11 capturas de la PWA con servidor simulado; navegación y textos de la Fase 2)
- `demo-landing` (doc, 2026-10-31): presentations-studio brands/handyx/assets/demo-landing/usuario-*.webp y publicidades/usuario-*.webp
- `afirmaciones` (pitch, 2026-11-05): decks/handyx-aticma/afirmaciones.json (TARIFA-USUARIO, FEE-ESPECIALISTA, PRUEBA-COM-USUARIO, LANZAMIENTO)
- `personajes` (doc, 2026-11-07): dossiers/inventario/personajes-lienzos.json
