# Auditoría · App del especialista (ola 1)

Corte: 07/11/2026 · Superficie: **especialista** · Alimenta el **Dossier 03 · Professional App**. Datos completos en `especialista.json` (misma información, con evidencia por función).

## Resumen

- **102 funciones** relevadas en 19 módulos: **2 Construido · 40 En pruebas · 49 Diseñado · 11 Concepto**.
- **Nada de la PWA del especialista está Construido.** `handyx-specialist-fe` main (f7c0733) tiene las fases 1, 2 y 3.1 con servidor simulado; la rama `claude/pensive-hypatia-jajjgm` (585418d) suma el rediseño premium, obras, viaje, caja y las herramientas de Electricidad, probadas contra la API **solo en local**. La API (`handyx-specialist-be`) vive solo en rama; su main es el «Initial commit». Handoff: «Nada desplegado; ningún proveedor con credenciales».
- Lo único Construido es la **demo pública** del especialista en la landing (25 pantallas) y su versión «app por rol»; su publicación no se pudo verificar.
- El **lienzo** (196 tableros: 141 pantallas de celular, 8 del panel web del ferretero a 1280×800, 1 de escritorio, 16 recorridos, 17 flujos, 1 revisión UX/UI y 12 exploraciones descartadas) va mucho más allá del código: presupuestador y lista de precios, Modo trabajo, informe con garantía, ingresos y gastos, equipamiento, obras en equipo, chat con tarjetas, ferretería y Camino Handyx están **Diseñados**, asignados a un plan por olas que espera el OK de Ignacio.
- Para el mensaje del dossier («herramienta de trabajo, no solo un canal de clientes») hay material de sobra en el lienzo, pero hay que rotularlo «Diseño propuesto» y separar lo que tiene código.
- Bloqueantes de publicación: **tarifa al especialista** (cuatro versiones), **antecedentes** (archivo vs presencial), **dominio** (tres) y **qué sale el 10/11**.

## Mapa de módulos

| Id | Módulo | Tableros | Estados | Resumen |
|---|---|---|---|---|
| A | Acceso y seguridad | 11 | En pruebas 1 · Diseñado 3 | Entrar a la cuenta, recuperar la contraseña y una segunda verificación opcional; la app es solo para el celular. |
| V | Alta y verificación | 13 | En pruebas 3 · Diseñado 3 | Registro en 10 pasos con documentos que revisa el equipo de verificación; cargar no es estar verificado. |
| OB | Onboarding | 4 | Diseñado 1 · En pruebas 1 | Habilitación, permisos explicados, cómo funciona y primeros pasos. |
| P | Pedidos y propuestas | 10 | En pruebas 8 · Diseñado 1 | Recibir pedidos de la zona sin obligación, poner el precio propio con la sugerencia de Handyx y proponer fecha. |
| D | Tu día y el trabajo | 8 | En pruebas 6 · Diseñado 1 | El recorrido del día, el viaje con ubicación compartida solo en camino, terminar e informar el cobro. |
| MT | Modo trabajo y cierre (H0) | 9 | Diseñado 5 | Tareas, fotos, herramientas y ayuda durante el trabajo; antes y después e informe que se arma solo. |
| TA | Pestaña Taller, agenda e ingresos | 9 | Diseñado 3 · En pruebas 2 · Concepto 1 | Agenda, ingresos y gastos (bruto y neto) y accesos a presupuestos, equipamiento, herramientas y ferretería. |
| PR | Presupuestos y lista de precios (H0) | 12 | En pruebas 1 · Diseñado 5 · Concepto 1 | Presupuestador con mano de obra y materiales que salen de la lista de precios propia. |
| EQ | Tu equipamiento (H0) | 7 | Diseñado 3 | Herramientas, instrumentos y consumibles: dónde están, mantenimiento, préstamos y reposición. |
| O | Obras de varios días | 15 | En pruebas 2 · Diseñado 4 | Obras por etapas y jornadas, con avance que ve el cliente, repuestos que aprueba y fechas que se mueven con su acuerdo. |
| OE | Obras en equipo | 10 | Diseñado 3 · En pruebas 1 | Sumar especialistas verificados a una obra y registrar el reparto; Handyx no toca la plata. |
| M | Mensajes | 13 | En pruebas 1 · Diseñado 3 | Chats atados a un pedido, una obra o el equipo; lo importante viaja como tarjeta que responde el cliente. |
| R | Ferretería (app del especialista) | 10 | Diseñado 3 · Concepto 1 | Pedido único a una ferretería adherida y retiro con QR; primero simulado con ferreterías ficticias. |
| FE | Handyx Ferreterías (panel web y teléfono del ferretero) | 11 | Diseñado 5 | Panel de escritorio (1280×800) y app en el teléfono para que la ferretería confirme, prepare y entregue; la venta la cobra la ferretería. |
| G | Camino Handyx | 12 | Diseñado 4 · Concepto 1 | Kit de bienvenida, manual y premios sin azar por trabajos y cobros verificados. |
| T | Herramientas del teléfono y por oficio | 17 | Diseñado 1 · En pruebas 6 · Concepto 6 | Herramientas para todos los oficios (H0), las de Electricidad (H1, con código) y H2–H6 «después del deploy». |
| CU | Cuenta, avisos y ayuda | 13 | En pruebas 8 · Diseñado 1 | Perfil público, disponibilidad y zonas, medios de cobro, avisos, privacidad y baja, ayuda y errores. |
| DEMO | Demo pública del especialista (landing) | 0 | Construido 2 | Demo interactiva de la landing en modo especialista (25 pantallas) y su versión como app por rol. |
| EXP | Exploraciones descartadas | 12 | Concepto 1 | Tres direcciones de arte de D.1 (A Taller de obra, B Noche de obra, C Costa de Mar del Plata), descartadas por «la estética de hoy mejorada». |

Exploraciones descartadas: `Main`, `A-*`, `B-*`, `C-*` (fila «Exploraciones de D.1 (descartadas)»: A Taller de obra, B Noche de obra, C Costa de Mar del Plata; se eligió «la estética de hoy mejorada»). No usarlas: tienen la pestaña Agenda, «Tarifa de Handyx durante la demo 0 %» y A-Precio muestra la Canilla. `UX-Revision` es un tablero interno de control de calidad, no una función.

## Funciones · Construido (2)

| Id | Función | Qué hace | Horizonte | Publicado | Evidencia | Tableros |
|---|---|---|---|---|---|---|
| E-DEMO-01 | Demo interactiva del especialista en la landing | Recorrido de muestra del especialista: pedido, precio, en camino, chat, trabajo, adicional, fin, turnos, caja, cuenta, rubros y cupón de la camada fundadora.<br>*Pieza pública sin backend. Muestra tarifa del 10 % al especialista.* | lanzamiento 10/11 | sin verificar (publicación de la landing por workflow con variable; no se pudo comprobar desde este entorno) | landing-fe@ac3b245:src/render/demo/especialista.ts: «25 pantallas e-*; TARIFAS = tarifas.normal»<br>landing-fe@ac3b245:src/content/tarifas.json: «especialista 10, cliente 10; camada fundadora 5 % por 12 meses» |  |
| E-DEMO-02 | App del especialista como demo instalable | La misma demo en modo app con el rol fijo, instalable, con noindex hasta el 10/11.<br>*Choca con el dominio workers.handyx.pro del workflow de la PWA.* | lanzamiento 10/11 | sin verificar (apps.yml publica en workers.handyc.com solo con su variable habilitada) | landing-fe@ac3b245:docs/modulos/apps-por-rol.md: «Especialista · https://workers.handyc.com · Hoy las apps son la demo» |  |

## Funciones · En pruebas (40)

| Id | Función | Qué hace | Horizonte | Publicado | Evidencia | Tableros |
|---|---|---|---|---|---|---|
| E-A-01 | Entrar con email y contraseña, Google o Apple; recuperar la contraseña | Entrás a tu cuenta con email y contraseña o con Google o Apple, y si te olvidaste la contraseña pedís una nueva.<br>*En main corre con el servidor simulado; con la API, solo en local (rama). Proveedores sin credenciales.* | sin fecha (el deploy va al final del bloque Taller; plan por olas esperando el OK) | sin verificar (el workflow de main publica la vista previa con datos de prueba solo si se habilita su variable) | specialist-fe@f7c0733:src/pantallas/Acceso.tsx: «Acceso, Registro y Recuperar en main (mock)»<br>specialist-fe@585418d:docs/handoff.md: «5.2: registro, código de 6 dígitos, recuperación de un solo uso, Google y Apple» | D6-Bienvenida, D6-Login, D6-Recuperar |
| E-V-01 | Alta guiada con identidad, rubros, foto y antecedentes presenciales | Cargás tus datos, DNI y CUIT/CUIL, elegís rubros y zonas, te sacás una foto y reservás un turno para mostrar los antecedentes en persona; el equipo revisa y habilita.<br>*Es el alta que hoy existe en código. El lienzo la reemplaza por 10 pasos (E-V-02).* | sin fecha (el deploy va al final del bloque Taller; plan por olas esperando el OK) | sin verificar (el workflow de main publica la vista previa con datos de prueba solo si se habilita su variable) | specialist-fe@f7c0733:src/contracts/dto.ts: «antecedentes: z.enum(ESTADOS_PRESENCIAL)»<br>specialist-fe@585418d:src/pantallas/alta/: «PasoDatos, PasoIdentidad, PasoRubros, PasoSelfie, PasoZonas, PasoAntecedentes, ResumenAlta» | RG-1, RG-3, RG-4, RG-5, RG-6 … |
| E-V-04 | Rubros con matrícula | Elegís tus rubros; los que piden matrícula se habilitan recién cuando Handyx la verifica.<br>*El lienzo fija matrícula obligatoria en Gas y Aire acondicionado.* | sin fecha (el deploy va al final del bloque Taller; plan por olas esperando el OK) | no (solo en rama; handoff: «Nada desplegado») | specialist-be@cf3b39d:docs/handoff.md: «rubros con matrícula»<br>RG-3.dc.html: «Gas · Pide matrícula · Aire acondicionado · Pide matrícula» | RG-3, RG-8 |
| E-V-06 | Estado del alta y habilitación por el equipo | Ves qué está listo, qué se está evaluando y qué falta; si hay que corregir algo te dicen qué. Solo el equipo de verificación habilita.<br>*En el lienzo el texto evita nombrar áreas internas («Estamos evaluando tu perfil»); las capturas reales dicen «Operations».* | sin fecha (el deploy va al final del bloque Taller; plan por olas esperando el OK) | sin verificar (el workflow de main publica la vista previa con datos de prueba solo si se habilita su variable) | specialist-fe@585418d:src/pantallas/alta/EstadosAlta.tsx: «estados de revisión, corrección, rechazo y habilitación»<br>specialist-fe@f7c0733:CLAUDE.md: «documento cargado ≠ verificado; solo Operations verifica» | D6-Alta |
| E-OB-02 | Bienvenida y aviso de tarifa 0 % en el primer ingreso | La primera vez ves la bienvenida y un aviso de que Handyx no cobra tarifa durante la demo (hasta el 10/12/2026).<br>*Existe en código pero la rama ya decidió quitarlo por «sin comisión nunca».* | lanzamiento 10/11 (vigencia 10/11–10/12/2026 según el contrato) | sin verificar (el workflow de main publica la vista previa con datos de prueba solo si se habilita su variable) | specialist-fe@f7c0733:src/contracts/fee.ts: «Demo cerrada 10/11/2026–10/12/2026: fee de Handy 0 %»<br>capturas-pwa:especialista-modal-fee.webp: «Modal de primer ingreso: Handy no cobra tarifa durante la demo» |  |
| E-P-01 | Disponible para urgentes y pedidos programados, sin obligación | Prendés «Disponible» para recibir urgentes en el momento y elegís si querés programados; lo apagás cuando quieras y no aceptar no tiene consecuencias.<br>*Cumple la regla «sin obligación ni asignaciones; urgentes solo con opt-in revocable».* | sin fecha (el deploy va al final del bloque Taller; plan por olas esperando el OK) | sin verificar (el workflow de main publica la vista previa con datos de prueba solo si se habilita su variable) | specialist-fe@f7c0733:src/pantallas/Disponibilidad.tsx: «opt-in urgente «Ahora» revocable»<br>specialist-fe@585418d:docs/handoff.md: «opt-out de urgentes (efecto en la siguiente consulta)» | F-Inicio, CU-Disponibilidad |
| E-P-02 | Inicio sobre el mapa con el pedido entrante | En el Inicio ves el mapa con tus zonas y los pedidos que llegan en una tarjeta con rubro, zona aproximada y vigencia.<br>*El rediseño del lienzo (Disponible en la cabecera, barra de vidrio con pestaña Taller) es Diseñado (lote 1.3).* | sin fecha (el deploy va al final del bloque Taller; plan por olas esperando el OK) | no (solo en rama; handoff: «Nada desplegado») | specialist-fe@585418d:docs/handoff.md: «4.5: Inicio sobre el mapa, pedido entrante, Tu precio y avisos (mapa base pendiente)»<br>F-Inicio.dc.html: «Handyx sugiere · vos decidís · Ver pedido» | F-Inicio |
| E-P-03 | Bandeja de pedidos por orden de llegada | Ves todos los pedidos para vos por orden de llegada o por cercanía, con filtros por tipo.<br>*No tiene tablero propio en el lienzo: allí los pedidos viven solo en el Inicio.* | sin fecha (el deploy va al final del bloque Taller; plan por olas esperando el OK) | sin verificar (el workflow de main publica la vista previa con datos de prueba solo si se habilita su variable) | specialist-fe@f7c0733:src/pantallas/Pedidos.tsx: «bandeja»<br>capturas-pwa:especialista-pedidos.webp: «No tenés obligación de aceptar ninguno» |  |
| E-P-04 | Detalle del pedido sin datos del cliente | Ves qué necesita el cliente, la zona aproximada y la franja; la dirección exacta llega solo si te elige.<br>*Las fotos del pedido no están en el contrato todavía (handoff 4.5).* | sin fecha (el deploy va al final del bloque Taller; plan por olas esperando el OK) | sin verificar (el workflow de main publica la vista previa con datos de prueba solo si se habilita su variable) | specialist-be@cf3b39d:docs/pedidos.md: «antes de contratar solo barrio y círculo desplazado»<br>F-Pedido.dc.html: «La dirección exacta llega cuando el cliente acepta» | F-Pedido |
| E-P-05 | Tu precio con la sugerencia de Handyx | Ponés tu precio; Handyx sugiere uno para cada pedido, pero decidís vos.<br>*La tabla de precios sugeridos del mock es de prueba; la real la define Product.* | sin fecha (el deploy va al final del bloque Taller; plan por olas esperando el OK) | no (solo en rama; handoff: «Nada desplegado») | specialist-fe@585418d:src/pantallas/TuPrecio.tsx: ««Handyx sugiere $ X · Vos decidís»»<br>specialist-be@cf3b39d:docs/pedidos.md: «precio sugerido versionado que publica Operations» | F-Precio |
| E-P-07 | Proponer día y horario | Aceptás el horario que pidió el cliente o proponés otro; es una propuesta hasta que el cliente acepta.<br>*El horario a medida (ruedas de hora) es Diseñado.* | sin fecha (el deploy va al final del bloque Taller; plan por olas esperando el OK) | sin verificar (el workflow de main publica la vista previa con datos de prueba solo si se habilita su variable) | specialist-fe@585418d:docs/handoff.md: «Cuándo podés ir: en 30 min, 1 o 2 horas, el día que pidió u otro día y horario»<br>F-Fecha.dc.html: «Es una propuesta: el cliente la acepta o elige otra» | F-Fecha, F-FechaHora, F-Revisar |
| E-P-08 | Contraoferta, aceptación y vencimiento | Negociás con el cliente: contraoferta, aceptar o rechazar con confirmación, retirar tu propuesta; si dos aceptan a la vez, gana una sola. | sin fecha (el deploy va al final del bloque Taller; plan por olas esperando el OK) | sin verificar (el workflow de main publica la vista previa con datos de prueba solo si se habilita su variable) | specialist-be@cf3b39d:docs/pedidos.md: «aceptación transaccional, una sola gana, 409»<br>specialist-fe@f7c0733:docs/plan.md: «2.3 aceptar/rechazar/contraofertar, vencimiento 5 min» | F-Revisar, F-Enviada |
| E-P-09 | Avisos que abren el detalle, nunca aceptan | Te enteras de pedidos nuevos, respuestas y pagos; el aviso te lleva al detalle y no acepta nada solo.<br>*Push sin proveedor (no_disponible).* | sin fecha (el deploy va al final del bloque Taller; plan por olas esperando el OK) | sin verificar (el workflow de main publica la vista previa con datos de prueba solo si se habilita su variable) | specialist-fe@f7c0733:CLAUDE.md: «Avisos abren el detalle, nunca aceptan»<br>D6-Avisos.dc.html: «Los avisos te llevan al detalle. Nada se acepta desde acá» | D6-Avisos |
| E-D-01 | Trabajo agendado con dirección exacta | Cuando el cliente acepta ves la dirección, el acuerdo, el chat y «Salir para allá». | sin fecha (el deploy va al final del bloque Taller; plan por olas esperando el OK) | sin verificar (el workflow de main publica la vista previa con datos de prueba solo si se habilita su variable) | specialist-fe@f7c0733:src/pantallas/TrabajoDetalle.tsx: «detalle con acuerdo inmutable»<br>F-Trabajo.dc.html: «Te la mostramos porque el cliente aceptó» | F-Trabajo |
| E-D-02 | Viaje con ubicación compartida solo en camino y llegada | Al salir, el cliente ve que vas en camino; la llegada se marca sola al estar en la puerta o con «Ya llegué».<br>*Necesita instancias propias de trayectos y geocodificador (pendientes).* | sin fecha (el deploy va al final del bloque Taller; plan por olas esperando el OK) | no (solo en rama; handoff: «Nada desplegado») | specialist-be@cf3b39d:docs/viaje.md: «posiciones cifradas, 30 días de retención, geocerca de 80 m»<br>TR-EnCamino.dc.html: «Tu ubicación se comparte solo hasta que llegás» | TR-EnCamino |
| E-D-04 | Adicionales de repuestos o mano de obra | Durante el trabajo agregás un adicional con tu precio; el cliente lo acepta o lo rechaza y mientras tanto rige el precio vigente. | sin fecha (el deploy va al final del bloque Taller; plan por olas esperando el OK) | no (solo en rama; handoff: «Nada desplegado») | specialist-fe@585418d:src/pantallas/trabajo/AgregarAdicional.tsx: «adicionales»<br>specialist-be@cf3b39d:docs/trabajos.md: «adicionales y total vigente» | F-Trabajo |
| E-D-05 | Cambiar la fecha o cancelar con motivo | Proponés otra fecha (cambia cuando el cliente acepta) o cancelás con un motivo, sin penalización automática. | sin fecha (el deploy va al final del bloque Taller; plan por olas esperando el OK) | sin verificar (el workflow de main publica la vista previa con datos de prueba solo si se habilita su variable) | specialist-fe@585418d:src/pantallas/trabajo/CancelarTrabajo.tsx: «cancelación con motivo»<br>specialist-fe@f7c0733:docs/handoff.md: «Cancelar un trabajo no tiene penalización automática» | F-Trabajo |
| E-D-06 | Terminé e informar el cobro | Al terminar informás cómo te pagó el cliente (Mercado Pago o efectivo); queda «informado» hasta que se verifica.<br>*Mercado Pago sin credenciales (503).* | sin fecha (el deploy va al final del bloque Taller; plan por olas esperando el OK) | sin verificar (el workflow de main publica la vista previa con datos de prueba solo si se habilita su variable) | specialist-be@cf3b39d:docs/caja.md: ««me pagaron» (reportado, nunca verificado)»<br>TR-Cobro.dc.html: «Queda «informado por vos» hasta que Lucía lo confirma o se verifica el pago» | TR-Cobro |
| E-D-07 | Llamar al cliente sin mostrar teléfonos | Llamás desde la app por un número puente, sin ver ni mostrar teléfonos.<br>*Sin proveedor responde 503; no aparece en el lienzo.* | sin fecha (el deploy va al final del bloque Taller; plan por olas esperando el OK) | no (solo en rama; handoff: «Nada desplegado») | specialist-fe@585418d:docs/handoff.md: «La llamada puente necesita un proveedor de telefonía pago» |  |
| E-TA-02 | Agenda del mes y del día | Ves tus turnos del mes y del día; una obra aparece jornada por jornada y se marcan superposiciones.<br>*Las vistas Pasadas/Hoy/Futuras del lienzo son Diseñado.* | sin fecha (el deploy va al final del bloque Taller; plan por olas esperando el OK) | sin verificar (el workflow de main publica la vista previa con datos de prueba solo si se habilita su variable) | specialist-fe@f7c0733:src/pantallas/Agenda.tsx: «agenda mensual»<br>specialist-be@cf3b39d:docs/trabajos.md: «agenda con superposición» | F-Agenda, F-AgendaPasadas, F-AgendaMes |
| E-TA-03 | Caja: lo cobrado, verificado e informado | Ves lo cobrado en el mes separando lo verificado de lo informado; el pago va directo a vos y no hay saldo en Handyx.<br>*En el lienzo la Caja se reemplaza por Tus ingresos (E-TA-04).* | sin fecha (el deploy va al final del bloque Taller; plan por olas esperando el OK) | sin verificar (el workflow de main publica la vista previa con datos de prueba solo si se habilita su variable) | specialist-fe@f7c0733:src/pantallas/Caja.tsx: «caja»<br>capturas-pwa:especialista-cobro.webp: «El pago va directo a vos» |  |
| E-PR-01 | Presupuesto dentro del chat | Mandás un presupuesto estructurado en la conversación con el cliente.<br>*Versión anterior al presupuestador del lienzo.* | sin fecha (el deploy va al final del bloque Taller; plan por olas esperando el OK) | sin verificar (el workflow de main publica la vista previa con datos de prueba solo si se habilita su variable) | specialist-fe@f7c0733:docs/plan.md: «2.3 presupuesto en chat»<br>specialist-fe@f7c0733:src/pantallas/Hilo.tsx: «hilo del chat» |  |
| E-O-01 | Obra por etapas con jornadas, diario y cobro por etapa | Seguís una obra de varios días: plan por etapas, jornadas, diario con fotos que ve el cliente y el cobro de cada etapa.<br>*El plan de obra lo crea la API de usuario (handoff 5.6).* | sin fecha (el deploy va al final del bloque Taller; plan por olas esperando el OK) | no (solo en rama; handoff: «Nada desplegado») | specialist-fe@585418d:src/pantallas/obra/: «PlanObra, JornadasObra, DiarioObra, ResumenObra»<br>specialist-be@cf3b39d:docs/trabajos.md: «etapas con su cobro, pedido de otro día, diario con fotos privadas» | F-Obra, F-ObraDia |
| E-O-06 | Pedir otro día para una jornada | Pedís mover una jornada; cambia cuando el cliente acepta.<br>*Correr «esta y las que siguen» y avisar al equipo es Diseñado.* | sin fecha (el deploy va al final del bloque Taller; plan por olas esperando el OK) | no (solo en rama; handoff: «Nada desplegado») | specialist-fe@585418d:docs/handoff.md: ««Pedir otro día»: es una solicitud que no mueve las demás jornadas» | F-ObraFecha |
| E-OE-04 | Contactos | Guardás contactos desde un chat, sin teléfonos.<br>*Base de «Contactos y equipos» de F-Cuenta.* | sin fecha (el deploy va al final del bloque Taller; plan por olas esperando el OK) | no (solo en rama; handoff: «Nada desplegado») | specialist-fe@585418d:src/pantallas/Contactos.tsx: «contactos»<br>specialist-be@cf3b39d:docs/trabajos.md: «contactos» |  |
| E-M-01 | Chat con el cliente | Conversás con el cliente antes y durante el trabajo, con fotos y respuestas rápidas que nunca se mandan solas. | sin fecha (el deploy va al final del bloque Taller; plan por olas esperando el OK) | sin verificar (el workflow de main publica la vista previa con datos de prueba solo si se habilita su variable) | specialist-fe@f7c0733:src/pantallas/Hilo.tsx: «chat previo a contratar»<br>specialist-be@cf3b39d:docs/trabajos.md: «chat cifrado con fotos privadas» | F-Mensajes, F-Chat |
| E-T-02 | Nivel con el giroscopio | Usás el teléfono como nivel y pendiente. | sin fecha (el deploy va al final del bloque Taller; plan por olas esperando el OK) | no (solo en rama; handoff: «Nada desplegado») | specialist-fe@585418d:src/taller/catalogo.ts: «nivel: fase H0, lista: true»<br>specialist-fe@585418d:src/pantallas/taller/Nivel.tsx: «pantalla» | T-Nivel |
| E-T-03 | Calculadoras de Electricidad | Sección y caída de tensión, planificador de vivienda, iluminación, consumo y ahorro, Ohm y referencias; andan sin conexión.<br>*Valores «en revisión técnica» hasta que los revise un profesional y Legal.* | sin fecha (el deploy va al final del bloque Taller; plan por olas esperando el OK) | no (solo en rama; handoff: «Nada desplegado») | specialist-fe@585418d:src/taller/catalogo.ts: «H1 · Electricidad, lista: true, sinConexion»<br>T-Cables.dc.html: «Tabla en revisión técnica. Es orientativa» | T-Electricidad, T-Cables |
| E-T-04 | Tablero 3D y verlo en la pared | Armás el tablero en 3D con su cómputo de materiales y lo mostrás en la pared del cliente con realidad aumentada. | sin fecha (el deploy va al final del bloque Taller; plan por olas esperando el OK) | no (solo en rama; handoff: «Nada desplegado») | specialist-fe@585418d:src/pantallas/taller/Tablero3D.tsx: «armador 3D»<br>specialist-fe@585418d:docs/herramientas.md: «AR: falta probarlo en un Android y un iPhone reales» | T-Tablero, T-TableroPared |
| E-T-05 | Informe eléctrico con semáforo | Cargás las mediciones de tus instrumentos y sale un informe con semáforo para el cliente; no es un certificado. | sin fecha (el deploy va al final del bloque Taller; plan por olas esperando el OK) | no (solo en rama; handoff: «Nada desplegado») | specialist-fe@585418d:src/pantallas/taller/Informe.tsx: «informe»<br>T-Informe.dc.html: «No es un certificado. Sin datos del cliente» | T-Informe |
| E-T-06 | Recorrido de caños en 3D y checklists | Dibujás el recorrido de caños por ambiente con sus materiales y seguís checklists con la seguridad primero. | sin fecha (el deploy va al final del bloque Taller; plan por olas esperando el OK) | no (solo en rama; handoff: «Nada desplegado») | specialist-fe@585418d:src/pantallas/taller/Canalizacion3D.tsx: «recorrido de caños»<br>specialist-fe@585418d:src/pantallas/taller/Checklists.tsx: «checklists» | T-Electricidad |
| E-T-07 | Etiquetas del tablero con IA y presupuesto dictado | Una foto del tablero propone etiquetas; contás el trabajo y sale la lista de tareas y materiales (sin datos personales).<br>*No figura en el lienzo; sin proveedor de IA.* | sin fecha (el deploy va al final del bloque Taller; plan por olas esperando el OK) | no (solo en rama; handoff: «Nada desplegado») | specialist-be@cf3b39d:docs/handoff.md: «responden 503 mientras no haya un proveedor de IA autorizado»<br>specialist-fe@585418d:src/pantallas/taller/EtiquetadoIa.tsx: «en el mock el resultado es simulado» |  |
| E-CU-01 | Perfil público con sello de verificación | Los clientes ven tu nombre, rubros habilitados y el sello solo si el servidor verificó tu alta. | sin fecha (el deploy va al final del bloque Taller; plan por olas esperando el OK) | sin verificar (el workflow de main publica la vista previa con datos de prueba solo si se habilita su variable) | specialist-fe@585418d:src/contracts/dto.ts: «verificado: solo true si el backend verificó el alta completa» | CU-Perfil |
| E-CU-03 | Disponibilidad, zonas y horarios | Configurás rubros, zonas, días y horarios. | sin fecha (el deploy va al final del bloque Taller; plan por olas esperando el OK) | sin verificar (el workflow de main publica la vista previa con datos de prueba solo si se habilita su variable) | specialist-fe@f7c0733:src/pantallas/Disponibilidad.tsx: «cobertura, días y horarios» | CU-Disponibilidad |
| E-CU-04 | Medios de cobro | Elegís Mercado Pago, efectivo o los dos; el cliente te paga directo.<br>*Transferencia: Diseñado. Mercado Pago sin credenciales.* | sin fecha (el deploy va al final del bloque Taller; plan por olas esperando el OK) | no (solo en rama; handoff: «Nada desplegado») | specialist-be@cf3b39d:docs/caja.md: «formas de cobro con versión; Mercado Pago solo con la cuenta vinculada»<br>CU-Cobros.dc.html: «Handyx no recibe la plata» | CU-Cobros |
| E-CU-05 | Avisos configurables | Elegís qué avisos te llegan.<br>*El silencio nocturno es Diseñado.* | sin fecha (el deploy va al final del bloque Taller; plan por olas esperando el OK) | sin verificar (el workflow de main publica la vista previa con datos de prueba solo si se habilita su variable) | specialist-fe@585418d:src/contracts/dto.ts: «PreferenciasSchema»<br>CU-Notificaciones.dc.html: «Silencio de 22 a 7» | CU-Notificaciones |
| E-CU-06 | Privacidad y baja real | Pedís la baja con estado visible; se borra lo que corresponde y se informa lo que se retiene por ley.<br>*«Descargar mis datos» es Diseñado.* | sin fecha (el deploy va al final del bloque Taller; plan por olas esperando el OK) | sin verificar (el workflow de main publica la vista previa con datos de prueba solo si se habilita su variable) | specialist-fe@f7c0733:src/pantallas/Baja.tsx: «baja»<br>specialist-be@cf3b39d:docs/handoff.md: «baja: anonimiza y deja informado lo que retiene» | CU-Privacidad |
| E-CU-07 | Centro de ayuda y casos de soporte | Buscás respuestas por tema y abrís un caso con historial.<br>*La respuesta «¿Cuánto me cobra Handyx? Nada» del lienzo choca con la tarifa de la landing.* | sin fecha (el deploy va al final del bloque Taller; plan por olas esperando el OK) | sin verificar (el workflow de main publica la vista previa con datos de prueba solo si se habilita su variable) | specialist-fe@f7c0733:src/pantallas/Soporte.tsx: «soporte»<br>specialist-be@cf3b39d:docs/trabajos.md: «soporte auditable» | D6-Ayuda |
| E-CU-08 | Errores sin datos inventados | Sin conexión o con error del servidor, la app lo dice, conserva lo cargado y ofrece reintentar; nunca muestra datos falsos.<br>*Las ilustraciones nuevas son Diseñado.* | sin fecha (el deploy va al final del bloque Taller; plan por olas esperando el OK) | no (solo en rama; handoff: «Nada desplegado») | specialist-fe@f7c0733:CLAUDE.md: «Nunca caer a fixtures ante un error»<br>D6-Error.dc.html: «Nunca mostramos datos inventados» | D6-Error, D6-Fallo |
| E-CU-09 | Contador de días sin tarifa en Cuenta | La Cuenta muestra cuántos días quedan sin tarifa de Handyx (hasta el 10/12/2026).<br>*A quitar según la rama (sin comisión nunca).* | lanzamiento 10/11 (hasta el 10/12/2026) | sin verificar (el workflow de main publica la vista previa con datos de prueba solo si se habilita su variable) | capturas-pwa:especialista-cuenta.webp: «Tarifa de Handy durante la demo · 23 días restantes» |  |

## Funciones · Diseñado (49)

| Id | Función | Qué hace | Horizonte | Publicado | Evidencia | Tableros |
|---|---|---|---|---|---|---|
| E-A-02 | Entrar con teléfono o con un código por SMS, sin contraseña | Elegís recibir un código por email o por SMS y entrás sin contraseña.<br>*El código por email existe en la rama; el SMS no tiene proveedor y el plan original decía «Sin SMS».* | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | D6-Acceso.dc.html: «Código por email · Código por SMS»<br>specialist-fe@585418d:docs/herramientas.md: «V.1: SMS necesita proveedor autorizado» | D6-Acceso, D6-Codigo |
| E-A-03 | Segunda verificación opcional | Si querés más seguridad, activás una segunda verificación (app autenticadora, SMS o email) con códigos de respaldo y ves los teléfonos con la sesión abierta.<br>*Describir solo la función; no mostrar D6-TOTP (lleva una clave de ejemplo con forma de secreto).* | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | D6-Seguridad.dc.html: «Opcional. Además del código, te pedimos otra prueba al entrar desde un teléfono nuevo»<br>specialist-fe@585418d:docs/plan-olas.md: «lotes 1.1 y 1.5» | D6-Seguridad, D6-TOTP, D6-Login2FA |
| E-A-04 | Solo en el celular | Si alguien entra desde una computadora ve una vista de muestra y un QR para abrir la app en el teléfono.<br>*Muestra la Canilla.* | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | X-Escritorio.dc.html: «Handyx se usa desde el celular» | X-Escritorio |
| E-V-02 | Registro en 10 pasos que se retoma | Te registrás en 10 pasos con barra de avance (datos y contraseña, domicilio cifrado, rubros, zonas en el mapa, selfie, DNI, CUIT/CUIL y cómo facturás, certificados, antecedentes y revisión) y podés cortar y seguir después. | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | FL-Alta.dc.html: «Se puede cortar y retomar en cualquier paso»<br>RG-2.dc.html: «Cifrado. Los clientes solo ven tu zona de trabajo, nunca tu domicilio» | RG-1, RG-2, RG-3, RG-4, RG-5 … |
| E-V-03 | Antecedentes penales por foto o PDF | Subís el certificado de antecedentes en foto o PDF; según el diseño va cifrado, lo ve solo el equipo de verificación y se borra al verificarte.<br>*Contradicción abierta con la regla anterior (antecedentes nunca como archivo). Falta revisión legal. Ver contradicciones.* | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | RG-9.dc.html: «Subí el certificado de antecedentes: una foto clara o el PDF»<br>specialist-be@cf3b39d:CLAUDE.md: «Antecedentes penales por foto o PDF (decisión del 08/11; todavía no implementado)» | RG-9, D6-Alta, CU-Datos |
| E-V-05 | Certificados opcionales que suman al perfil | Subís cursos, seguro u otros certificados; uno verificado aparece en tu perfil y uno cargado todavía no. | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | RG-8.dc.html: «Un certificado verificado aparece en tu perfil; uno cargado, todavía no» | RG-8, CU-Perfil |
| E-OB-01 | Habilitado, permisos explicados, cómo funciona y primeros pasos | Al quedar habilitado ves los rubros activos, por qué se piden avisos y ubicación (solo en viaje) y una lista de primeros pasos opcionales.<br>*OB-Tour dice «no te cobramos comisión» (ver contradicción de tarifas).* | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | OB-Permisos.dc.html: «Nunca en segundo plano ni cuando estás No disponible»<br>OB-PrimerosPasos.dc.html: «Ninguna es obligatoria para recibir pedidos» | OB-Aprobado, OB-Permisos, OB-Tour, OB-PrimerosPasos |
| E-P-06 | Precio con cinta y teclado, materiales y garantía | Deslizás una cinta o escribís el monto, y marcás si incluye materiales y garantía de 30 días.<br>*Muestra «Recibís el 100 % · Handyx no te cobra comisión».* | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | F-Precio.dc.html: «Deslizá la cinta o tocá un atajo»<br>F-PrecioTeclado.dc.html: «Escribí tu precio» | F-Precio, F-PrecioTeclado |
| E-D-03 | Tu día: próxima parada y recorrido | Con varios trabajos hoy, el Inicio muestra la próxima parada, el recorrido ordenado, los kilómetros del mes y avisar una demora. | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | F-InicioDia.dc.html: «Tenés 3 paradas hoy»<br>FL-Dia.dc.html: «Los avisos los manda el especialista con un toque» | F-InicioDia, F-InicioRuta, H0-ModoAgenda |
| E-MT-01 | Modo trabajo | Al empezar, una pantalla grande con cronómetro, tareas que arrancan por la seguridad, y un toque para foto, repuestos, ayuda y agenda.<br>*En código existe solo el cronómetro del trabajo en curso.* | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | H0-Modo.dc.html: «Tarea lista · siguiente · Terminé el trabajo»<br>specialist-fe@585418d:docs/herramientas.md: «H0.4: botones de 56 px o más para usar con guantes» | H0-Modo |
| E-MT-02 | Herramientas a mano sin salir del trabajo | Nivel, linterna, lupa, medir, calculadoras, código de barras, nota de voz y checklist de seguridad. | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | H0-ModoHerramientas.dc.html: «Sin salir del trabajo» | H0-ModoHerramientas |
| E-MT-03 | Pedir ayuda a otro especialista | Llamás o escribís a un contacto, lo sumás al trabajo o buscás un especialista nuevo para terminar. | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | H0-ModoAyuda.dc.html: «Buscar un profesional nuevo · lo ven verificados de la zona» | H0-ModoAyuda |
| E-MT-04 | Antes y después | Comparás el antes y el después deslizando o lado a lado y contás (o dictás) qué cambiaste. | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | H0-AntesDespues.dc.html: «Podés dictarlo: se escribe solo» | H0-AntesDespues, H0-AntesLado |
| E-MT-05 | Informe del trabajo, conformidad y garantía | El informe se completa solo con lo que hiciste; el cliente da su conformidad con un toque, arranca la garantía, queda el PDF y un recordatorio de mantenimiento para vos.<br>*El lado del cliente depende de la app del usuario.* | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | H0-Informe.dc.html: «Lo recibe Lucía en el chat y en PDF»<br>H0-InformeEnviado.dc.html: «Recordatorio de mantenimiento · te avisamos a vos» | H0-Informe, H0-InformeEnviado |
| E-TA-01 | Pestaña Taller | Una pestaña que junta agenda, ingresos y gastos, presupuestos y precios, equipamiento, herramientas del teléfono y ferretería.<br>*En código existe /taller/ solo con las herramientas de Electricidad.* | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | F-Herramientas.dc.html: «Agenda, plata y herramientas»<br>specialist-fe@585418d:docs/herramientas.md: «La pestaña «Agenda» se reemplaza por «Taller»» | F-Herramientas |
| E-TA-04 | Ingresos y gastos: bruto, gastos y neto | Sabés cuánto te queda: bruto (en Handyx y por fuera), gastos de materiales y viáticos, neto y ganancia por trabajo. | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | F-Ingresos.dc.html: «Neto · lo que te queda»<br>specialist-fe@585418d:src/taller/catalogo.ts: «ingresos: fase H0, lista: false» | F-Ingresos |
| E-TA-05 | Cargar un gasto con la foto del ticket | Cargás un gasto con la foto del ticket (leída en el teléfono) y elegís si se lo cobrás al cliente como adicional. | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | H0-Gasto.dc.html: «Leído en tu teléfono»<br>FL-Plata.dc.html: «Los gastos son del especialista: el cliente nunca los ve» | H0-Gasto |
| E-PR-02 | Presupuestador con mano de obra y materiales | Armás el presupuesto con tus tarifas y materiales de tu lista y lo mandás por el chat; si cambia un precio antes de que acepte, sale una versión nueva. | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | H0-Presupuesto.dc.html: «Total para el cliente $ 47.000 · Mandar a Lucía por el chat»<br>FL-Presupuesto.dc.html: «Cambió un precio · De uno que se actualiza, antes de aceptar» | H0-Presupuesto |
| E-PR-03 | Agregar materiales de a uno, varios o nuevos | Buscás en tu lista y tocás; elegís cobrarlo, anotarlo como gasto o congelar el precio; si no está, lo cargás y su nombre (no tu precio) suma al catálogo. | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | H0-MaterialNuevo.dc.html: «El nombre del material se suma al catálogo de Handyx… Tu precio queda solo para vos»<br>H0-AgregarLista.dc.html: «Kit · Cambio de grifería» | H0-AgregarMaterial, H0-MaterialOpciones, H0-MaterialNuevo, H0-AgregarLista |
| E-PR-04 | Lista de precios propia | Tus materiales y tarifas por categoría, con lo que subió y los precios viejos marcados. | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | H0-Precios.dc.html: «Con esto se arman tus presupuestos en segundos»<br>specialist-fe@585418d:src/taller/catalogo.ts: «precios: fase H0, lista: false» | H0-Precios, H0-PrecioItem |
| E-PR-05 | Foto de la lista del corralón | Le sacás una foto a la lista del corralón; se lee en el teléfono (la foto no sale) y revisás cada precio. | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | H0-PreciosFoto.dc.html: «Se lee en tu teléfono: la foto no sale de acá» | H0-PreciosFoto, H0-PreciosRevisar |
| E-PR-06 | Tarifas de mano de obra | Cargás hora, visita, recargo de urgencia y precio por tarea para presupuestar más rápido. | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | H0-ManoObra.dc.html: «Son tus precios: Handyx solo sugiere» | H0-ManoObra |
| E-EQ-01 | Equipamiento por categoría y ubicación | Ves herramientas, instrumentos, seguridad y consumibles, dónde está cada cosa (camioneta, taller, prestado) y lo que queda poco. | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | H0-Equipo.dc.html: «Matafuego vence 12/12 · 3 quedan pocos» | H0-Equipo, H0-EquipoCategoria |
| E-EQ-02 | Agregar herramienta y recordar mantenimiento | Sumás una herramienta con foto o código de barras y te recuerda el mantenimiento. | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | H0-EquipoAgregar.dc.html: «Recordarme el mantenimiento» | H0-EquipoAgregar |
| E-EQ-03 | Historial, préstamo y «ya no la tengo» | Cada herramienta tiene historial (préstamos y trabajos); la prestás, la movés o la das de baja y la reponés. | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | H0-EquipoBaja.dc.html: «Sale de tu equipamiento, pero queda en el historial» | H0-EquipoDetalle, H0-EquipoBaja |
| E-O-02 | Pestaña Obras | Lista de obras en curso, próximas y terminadas con su avance. | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | F-Obras.dc.html: «2 en curso · 1 próxima» | F-Obras |
| E-O-03 | Proponer una obra y mandar la propuesta por chat | Proponés una obra a un cliente tuyo o nuevo (por enlace) con etapas, jornadas, montos y equipo. | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | F-ObraNueva.dc.html: «La propuesta le llega a Carla como tarjeta en el chat»<br>F-PropuestaObra.dc.html: «Cobro por etapa · Materiales aparte» | F-ObraNueva, F-PropuestaObra |
| E-O-04 | Jornada con tareas, quién viene y avance | Cada jornada tiene horario, tareas asignadas, quién viene, materiales y el avance que ve el cliente.<br>*El diario con fotos ya existe (E-O-01).* | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | F-ObraDia.dc.html: «Avance del día · lo ve Martín» | F-ObraDia, F-ObraDiaHorario, F-ObraDiaTarea, F-ObraDiaAvance |
| E-O-05 | Repuestos que aprueba el cliente | Cargás repuestos por jornada; el cliente los aprueba en el chat; elegís conseguirlos vos o en una ferretería adherida y te avisa el día anterior si falta comprar. | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | F-RepuestoOrigen.dc.html: «Lo consigo yo · En una ferretería adherida»<br>F-ObraRepuesto.dc.html: «Avisarme si el día anterior falta comprarlo» | F-ObraRepuestos, F-RepuestoOrigen, F-ObraRepuesto |
| E-OE-01 | Equipo de la obra e invitación | Invitás a un contacto o mandás un enlace con código que vence; tiene que estar verificado y no ve nada hasta aceptar. | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | F-Invitar.dc.html: «Vale 48 horas · solo para esta obra» | F-ObraEquipo, F-Invitar |
| E-OE-02 | Reparto del pago registrado | Acuerdan cuánto le toca a cada uno y cómo cobra; Handyx registra lo acordado y no recibe ni reparte la plata. | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | F-Reparto.dc.html: «Handyx no recibe ni reparte la plata: registra lo que acuerdan entre ustedes» | F-Reparto |
| E-OE-03 | Buscar un especialista nuevo para la obra | Publicás una búsqueda que ven solo especialistas verificados de la zona; se postulan, ves su perfil y elegís vos.<br>*F-PerfilProfesional muestra opiniones de clientes ficticias.* | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | F-ObraBuscar.dc.html: «Verificado por Handyx · Siempre: no se puede apagar»<br>FL-Equipo.dc.html: «La búsqueda la ven solo verificados y cierra sola» | F-ObraBuscar, F-InicioConvocatoria, F-ConvocatoriaDetalle, F-ObraPostulantes, F-PerfilProfesional |
| E-M-02 | Chat grupal de la obra y filtros | Un grupo por obra con el cliente y el equipo; la lista se filtra por pedidos, obras, equipo y soporte. | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | F-Mensajes.dc.html: «Todos · Pedidos · Obras · Equipo · Soporte» | F-Mensajes, F-ChatGrupo, F-ChatGrupoInfo |
| E-M-03 | Reacciones, editar y borrar para todos | Reaccionás, editás (queda «editado») o borrás para todos; el borrado se guarda oculto por si hay un reclamo.<br>*Retención de los borrados: pendiente de Legal.* | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | F-ChatBorrar.dc.html: «Lo guardamos oculto por si hay un reclamo sobre la obra» | F-ChatAcciones, F-ChatEditar, F-ChatBorrar, F-ChatSeleccion |
| E-M-04 | Tarjetas en el chat | Mandás presupuestos, propuestas de obra, repuestos, cambios de fecha, fotos e informes como tarjetas que el cliente responde ahí.<br>*Videos de hasta 1 minuto, sin ubicación.* | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | F-ChatAdjuntar.dc.html: «Llega como tarjeta: el cliente acepta, aprueba o pide cambios»<br>FL-Mensajes.dc.html: «Nada se manda solo» | F-ChatAdjuntar, F-ChatMedia |
| E-R-01 | Catálogo y pedido único a la ferretería | Buscás en un catálogo por categorías con variantes y armás un pedido agrupado por trabajo, con casillas de gasto y cobro. | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | R-Catalogo.dc.html: «Simulación: ferreterías ficticias»<br>R-Pedir.dc.html: «Registrar como gasto · Cobrar al cliente lo que corresponda» | R-Catalogo, R-Categoria, R-Pedir |
| E-R-02 | Comparar ferreterías adheridas | Comparás precio, stock, distancia y horario de cada ferretería; el precio puede cambiar hasta que confirma. | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | R-Comparar.dc.html: «Cada ferretería pone sus precios» | R-Comparar, R-Ferreterias |
| E-R-03 | Estado del pedido, retiro con QR y lista para el mostrador | Seguís el pedido (enviado, confirmado, listo), retirás mostrando un QR o una lista con letra grande, y el ticket queda como gasto. | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | R-Retiro.dc.html: «El ferretero lo escanea con su app y ve toda la lista»<br>R-Estado.dc.html: «Teflón: no hay de 12 mm · Ofrecen 19 mm» | R-Estado, R-Retiro, R-Mostrador |
| E-FE-01 | Alta de la ferretería | La ferretería se suma con datos, dirección y horarios, cómo entrega, lista de precios y su equipo.<br>*Panel web de 1280×800. Repo propio sin crear (requiere autorización).* | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | FE-Alta.dc.html: «Cobrás vos en el mostrador; Handyx no se queda con nada de la venta» | FE-Alta |
| E-FE-02 | Pedidos del día: confirmar, preparar, entregar | La ferretería ve pedidos nuevos, preparando, listos y retirados; confirma stock y precio, sugiere reemplazos, escanea el QR y marca retirado. | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | FE-Pedido.dc.html: «Lo paga en el mostrador. Handyx no cobra nada de esta venta»<br>FE-Retiro.dc.html: «A Julián le llega el ticket y queda como gasto en su app» | FE-Inicio, FE-Pedido, FE-Escanear, FE-Retiro |
| E-FE-03 | Catálogo, precios e importación de la lista | Mantiene su catálogo y precios (suba en %, precios viejos marcados) e importa la lista desde un archivo con revisión. | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | FE-Importar.dc.html: «Para corregir · No se publican hasta revisarlos» | FE-Catalogo, FE-Importar |
| E-FE-04 | Métricas para la ferretería | Pedidos del mes, lo más pedido y sugerencias de stock.<br>*Cifras de ejemplo.* | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | FE-Metricas.dc.html: «Lo que te trae Handyx · Ejemplo» | FE-Metricas |
| E-FE-05 | App del ferretero en el teléfono | Escanear el QR del especialista y preparar el pedido desde el teléfono. | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | FE-Movil.dc.html: «Listo para retirar · avisar a Julián» | FE-MovilEscanear, FE-Movil |
| E-G-01 | Kit de bienvenida y manual | Al quedar verificado elegís el talle de la remera y si querés el manual en la app, impreso o los dos (6 capítulos).<br>*«Retiro en un punto Handyx · Centro»: punto sin confirmar.* | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | G-Bienvenida.dc.html: «Te lo damos al quedar verificado»<br>G-Manual.dc.html: «Leer el manual da una insignia; no cambia los pedidos que recibís» | G-Bienvenida, G-Manual |
| E-G-02 | Camino de trabajos y mini caminos | Avanzás por estaciones con trabajos verificados y por cobros verificados u oficio; nada se resta y no hay rankings.<br>*Premios del oficio Electricidad en borrador en código (src/taller/premios.ts).* | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | G-Inicio.dc.html: «Solo cuentan trabajos verificados. Nada se resta»<br>G-MiniCamino.dc.html: «Montos y premios en borrador: los define Handyx con Legal. Sin sorteos» | G-Inicio, G-Camino, G-MiniCamino |
| E-G-03 | El regalo, canje y vitrina | Al llegar a un hito se abre el premio, elegís cómo recibirlo y queda en tu vitrina; cada premio se revisa antes de entregarlo. | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | G-Vitrina.dc.html: «Revisamos cada premio antes de entregarlo. Las cantidades de la escalera son un borrador» | F-Regalo, G-Canje, G-Vitrina |
| E-G-04 | Insignias por usar la app | Insignias de reconocimiento que no dan premios ni cambian los pedidos. | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | G-Insignias.dc.html: «No dan premios ni cambian los pedidos que recibís» | G-Insignias |
| E-T-01 | Herramientas del teléfono para todos los oficios | Medir con la cámara, escanear en 3D, modelo 3D con medidas, plomada y ángulos, linterna y lupa y conversor.<br>*Falta decidir dónde se procesa el escaneo 3D.* | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | T-Taller.dc.html: «Para todos los oficios»<br>T-Medir.dc.html: «Es una medida aproximada: para cortar, confirmala con la cinta» | T-Taller, T-Medir, T-Escanear, T-Modelo3D |
| E-CU-02 | Perfil con presentación, trabajos verificados, certificados y opiniones | Tu perfil suma foto, presentación, cantidad de trabajos verificados, certificados y lo que dicen los clientes.<br>*No hay calificaciones ni opiniones en código ni en el plan; las del diseño son ficticias.* | sin fecha (plan por olas, a la espera del OK de Ignacio) | no | CU-Perfil.dc.html: «Así te ven los clientes»<br>F-PerfilProfesional.dc.html: «Lo que dicen los clientes» | CU-Perfil, F-PerfilProfesional |

## Funciones · Concepto (11)

| Id | Función | Qué hace | Horizonte | Publicado | Evidencia | Tableros |
|---|---|---|---|---|---|---|
| E-TA-06 | Exportar el mes, metas y ayuda de monotributo | Exportar el mes, fijar metas y una ayuda orientativa de monotributo.<br>*Solo en el plan; no está dibujado.* | sin fecha | no | specialist-fe@585418d:docs/herramientas.md: «H0.3: metas; exportar el mes; ayuda de monotributo orientativa» |  |
| E-PR-07 | Catálogo con precios de ferreterías de Mar del Plata | Sumar precios desde las listas reales de las ferreterías. | sin fecha | no | H0-Precios.dc.html: «Catálogo de ferreterías · Pronto»<br>FL-Presupuesto.dc.html: «Después se suma el catálogo con los precios de las ferreterías de Mar del Plata» | H0-Precios |
| E-R-04 | Piloto con ferreterías aliadas reales | Pasar del catálogo simulado a listas reales de ferreterías de Mar del Plata. | sin fecha | no | FL-Ferreteria.dc.html: «Después, el catálogo se arma con las listas reales»<br>specialist-fe@585418d:docs/herramientas.md: «R.3 Piloto real con ferreterías aliadas» |  |
| E-G-05 | Áreas del camino | El camino dividido en áreas (taller, obra, ciudad) con premios grandes. | sin fecha | no | G-Areas.dc.html: «Concepto: no entra en esta versión» | G-Areas |
| E-T-08 | H2 · Aire acondicionado: frigorías con la brújula | Calcular frigorías según orientación y medidas, y ver el equipo en la pared. | posterior al lanzamiento («después del deploy») | no | OF-Aire.dc.html: «Después del deploy · H2 · Cálculo · orientativo» | OF-Aire |
| E-T-09 | H3 · Plomería: pendiente de desagüe y pérdida por el medidor | Medir la pendiente con el teléfono y detectar pérdidas con dos fotos del medidor. | posterior al lanzamiento («después del deploy») | no | OF-Plomeria.dc.html: «Después del deploy · H3 · Con el teléfono» | OF-Plomeria |
| E-T-10 | H4 · Gas: prueba de hermeticidad registrada y protocolo | Registrar la prueba con fotos del manómetro y seguir un protocolo ante olor a gas; el teléfono no detecta gas.<br>*Con revisión técnica y legal.* | posterior al lanzamiento («después del deploy») | no | OF-Gas.dc.html: «El teléfono no detecta gas ni monóxido. Las mediciones son tuyas» | OF-Gas |
| E-T-11 | H5 · Albañilería: cómputo de materiales | Calcular ladrillos, cemento y arena de un muro y pasarlos a la lista de repuestos. | posterior al lanzamiento («después del deploy») | no | OF-Albanileria.dc.html: «Después del deploy · H5 · Muros y revoques» | OF-Albanileria |
| E-T-12 | H6 · Cerrajería: identificación y constancia de autorización | Identificar el tipo de cerradura por foto y firmar una constancia de que la persona puede pedir la apertura, sin guardar el DNI. | posterior al lanzamiento («después del deploy») | no | OF-Cerrajeria.dc.html: «La IA identifica el tipo de cerradura por foto. Nunca decodifica llaves» | OF-Cerrajeria |
| E-T-13 | HandIA para profesionales y feedback con IA | Sugerencias con IA para presupuesto, materiales y recordatorios.<br>*No aparece en el lienzo; solo en el pitch.* | sin dato | no | pitch:011–013: «HandIA para profesionales · Visión · con la inversión»<br>pitch:169–171: «Mes 2: HandIA para profesionales · Plan propuesto · a validar» |  |
| E-EXP-01 | Direcciones de arte A, B y C (descartadas) | Tres estéticas alternativas de Inicio, Tu precio y el regalo, que no se eligieron.<br>*No usar en los dossiers. Muestran «Tarifa de Handyx durante la demo 0 %», la pestaña Agenda y A-Precio tiene la Canilla.* | sin fecha | no | notaExp (canvas.json): «A Taller de obra, B Noche de obra y C Costa de Mar del Plata. Se eligió la estética de hoy mejorada»<br>specialist-fe@585418d:docs/rediseno-deluxe.md: «§7: La fila C queda como descartada» | Main, A-Precio, A-Regalo, B-Inicio, B-Precio … |

## Recorridos de punta a punta

Doce recorridos armados con los `RC-*` del lienzo (pasos en orden, con la pantalla de cada uno en el JSON). Cubren las secciones 4 a 15 del Dossier 03.

### E-R-01 · Del registro a estar habilitado

- **Necesidad:** Empezar a trabajar con Handyx con un perfil que los clientes puedan creer.
- **Acción:** Crea la cuenta, completa el alta en 10 pasos (datos, domicilio, rubros, zonas, selfie, DNI, CUIT/CUIL, certificados, antecedentes) y la envía.
- **Qué hace Handyx:** Guarda los datos cifrados, el equipo de verificación revisa cada documento y habilita los rubros; cargar no es estar verificado.
- **Resultado:** Queda habilitado en sus rubros y zonas, con permisos explicados, primeros pasos y el kit de bienvenida.
- **Estado:** Diseñado (el alta actual en código, con antecedentes presenciales, está En pruebas) · **Secciones:** 4, 5 · **Captura principal:** `S/capturas/especialista/OB-Aprobado.png`
- **Pasos:** 1. D6-Bienvenida → 2. RG-1 → 3. RG-2 → 4. RG-3 → 5. RG-4 → 6. RG-5 → 7. RG-6 → 8. RG-7 → 9. RG-8 → 10. RG-9 → 11. RG-10 → 12. D6-Alta → 13. OB-Aprobado → 14. OB-Permisos → 15. OB-Tour → 16. OB-PrimerosPasos → 17. G-Bienvenida → 18. F-Inicio

### E-R-02 · Recibir un pedido y mandar una propuesta

- **Necesidad:** Conseguir trabajos de su zona sin perder tiempo ni quedar atado.
- **Acción:** Prende Disponible, abre el pedido, pone su precio con la sugerencia de Handyx, propone fecha y envía; o lo deja pasar.
- **Qué hace Handyx:** Le muestra solo pedidos de sus rubros y zonas con zona aproximada, sugiere un precio sin imponerlo y no aplica consecuencias si no acepta.
- **Resultado:** La propuesta llega al cliente; cuando acepta, el trabajo queda agendado con la dirección exacta.
- **Estado:** En pruebas (núcleo en código con servidor simulado y API local, rama) · rediseño del lienzo Diseñado · **Secciones:** 6, 7, 8, 9 · **Captura principal:** `S/capturas/especialista/recortes/F-Pedido-sin-canilla.png`
- **Pasos:** 1. F-Inicio → 2. F-Pedido → 3. F-Precio → 4. F-PrecioTeclado → 5. F-Fecha → 6. F-FechaHora → 7. F-Revisar → 8. F-Enviada → 9. F-Chat → 10. F-Trabajo

### E-R-03 · Presupuesto con la lista de precios propia

- **Necesidad:** Presupuestar rápido y sin perder plata cuando suben los materiales.
- **Acción:** Arma el presupuesto con sus tarifas y materiales de su lista (o carga uno nuevo) y lo manda por el chat; mantiene la lista con una foto del corralón.
- **Qué hace Handyx:** Calcula el total, avisa si un precio que se actualiza cambió antes de que el cliente acepte y lee la foto en el teléfono sin enviarla.
- **Resultado:** El cliente recibe una tarjeta con el presupuesto y lo acepta o pide cambios en el chat.
- **Estado:** Diseñado · **Secciones:** 8, 13 · **Captura principal:** `S/capturas/especialista/H0-Presupuesto.png`
- **Pasos:** 1. F-Trabajo → 2. H0-Presupuesto → 3. H0-AgregarMaterial → 4. H0-MaterialOpciones → 5. H0-MaterialNuevo → 6. H0-AgregarLista → 7. F-Chat → 8. H0-Precios → 9. H0-PreciosFoto → 10. H0-PreciosRevisar → 11. H0-PrecioItem → 12. H0-ManoObra

### E-R-04 · Un día de trabajo: de la ruta al cobro

- **Necesidad:** Ordenar el día, llegar a tiempo, trabajar cómodo y cobrar sin vueltas.
- **Acción:** Sigue su recorrido, sale para la parada, trabaja en Modo trabajo, saca el antes y después, informa el cobro y manda el informe.
- **Qué hace Handyx:** Comparte la ubicación solo durante el viaje, arma el informe solo, registra el cobro como informado hasta verificarlo y activa la garantía con la conformidad del cliente.
- **Resultado:** Trabajo cerrado con informe en PDF, garantía activa y el ingreso en Tus ingresos.
- **Estado:** Diseñado (viaje, llegada, Terminé e informar el cobro En pruebas) · **Secciones:** 10, 12, 13 · **Captura principal:** `S/capturas/especialista/H0-Modo.png`
- **Pasos:** 1. F-InicioDia → 2. F-InicioRuta → 3. TR-EnCamino → 4. H0-Modo → 5. H0-ModoHerramientas → 6. H0-ModoAyuda → 7. H0-AntesDespues → 8. H0-AntesLado → 9. TR-Cobro → 10. H0-Informe → 11. H0-InformeEnviado → 12. F-Ingresos

### E-R-05 · Una obra de varios días

- **Necesidad:** Llevar una obra larga ordenada, con el cliente al tanto y sin discusiones por materiales o fechas.
- **Acción:** Propone la obra por etapas, sigue cada jornada con tareas y avance, carga repuestos para aprobar y mueve jornadas.
- **Qué hace Handyx:** Muestra el avance al cliente, pide su aprobación para repuestos y fechas, avisa el día anterior si falta comprar y mantiene las fechas vigentes hasta que acepte.
- **Resultado:** Obra con plan, diario y plata a la vista: gastado, cobrado y lo que falta cobrar.
- **Estado:** Diseñado (plan, jornadas, diario y cobro por etapa En pruebas) · **Secciones:** 9, 10, 11, 12 · **Captura principal:** `S/capturas/especialista/F-Obra.png`
- **Pasos:** 1. F-ObraNueva → 2. F-PropuestaObra → 3. F-Obras → 4. F-Obra → 5. F-ObraDia → 6. F-ObraDiaHorario → 7. F-ObraDiaTarea → 8. F-ObraDiaAvance → 9. F-ObraRepuestos → 10. F-RepuestoOrigen → 11. F-ObraRepuesto → 12. F-ObraFecha

### E-R-06 · Armar un equipo para una obra

- **Necesidad:** Sumar a otro especialista confiable cuando la obra pide otro oficio.
- **Acción:** Invita a un contacto o publica una búsqueda; revisa postulantes y su perfil, elige y acuerda el reparto.
- **Qué hace Handyx:** Muestra la búsqueda solo a especialistas verificados de la zona, sin la dirección; registra el reparto y no recibe ni reparte la plata.
- **Resultado:** Equipo armado en el chat de la obra; cada uno cobra su parte directo del cliente o como lo acuerden.
- **Estado:** Diseñado · **Secciones:** 11, 15 · **Captura principal:** `S/capturas/especialista/F-Reparto.png`
- **Pasos:** 1. F-ObraEquipo → 2. F-Invitar → 3. F-Reparto → 4. F-ChatGrupo → 5. F-ObraBuscar → 6. F-InicioConvocatoria → 7. F-ConvocatoriaDetalle → 8. F-ObraPostulantes → 9. F-PerfilProfesional → 10. F-ChatGrupoInfo

### E-R-07 · Hablar con el cliente y el equipo

- **Necesidad:** Tener todo lo de cada trabajo en un lugar y que lo importante quede registrado.
- **Acción:** Chatea, manda tarjetas (presupuesto, propuesta de obra, repuestos, cambio de fecha, informe), fotos y videos; edita o borra.
- **Qué hace Handyx:** Ata cada chat a un pedido, obra o equipo; las tarjetas no se editan y un mensaje borrado queda guardado oculto por si hay un reclamo; nada se manda solo.
- **Resultado:** Conversaciones ordenadas por trabajo, con decisiones que el cliente responde ahí mismo.
- **Estado:** Diseñado (chat con el cliente, fotos y contactos En pruebas) · **Secciones:** 7, 11 · **Captura principal:** `S/capturas/especialista/F-ChatAdjuntar.png`
- **Pasos:** 1. F-ChatGrupo → 2. F-ChatAcciones → 3. F-ChatEditar → 4. F-ChatBorrar → 5. F-ChatSeleccion → 6. F-ChatMedia → 7. F-ChatAdjuntar → 8. F-ChatGrupoInfo → 9. F-Invitar → 10. F-Mensajes → 11. F-Chat → 12. D6-Avisos → 13. D6-Ayuda

### E-R-08 · Conseguir los materiales en una ferretería adherida

- **Necesidad:** Comprar lo que falta sin dictar listas ni perder tiempo en el mostrador.
- **Acción:** Arma un pedido único desde el presupuesto o la obra, compara ferreterías, espera la confirmación y retira con un QR.
- **Qué hace Handyx:** Envía el pedido a la ferretería elegida, que confirma precios y reemplazos; al retirar, el ticket queda como gasto. La venta la cobra la ferretería; Handyx no se queda con nada.
- **Resultado:** Materiales listos para retirar y el gasto registrado.
- **Estado:** Diseñado (simulación con ferreterías ficticias) · **Secciones:** 13 · **Captura principal:** `S/capturas/especialista/R-Retiro.png`
- **Pasos:** 1. R-Catalogo → 2. R-Categoria → 3. R-Pedir → 4. R-Ferreterias → 5. R-Estado → 6. R-Retiro → 7. R-Mostrador → 8. FE-MovilEscanear → 9. FE-Movil → 10. H0-Gasto

### E-R-09 · Agenda, ingresos y equipamiento

- **Necesidad:** Saber qué viene, cuánto gana de verdad y qué herramientas tiene.
- **Acción:** Entra a la pestaña Taller, revisa la agenda, mira bruto, gastos y neto, carga un gasto y gestiona su equipamiento.
- **Qué hace Handyx:** Separa lo verificado de lo informado, calcula la ganancia por trabajo y recuerda mantenimientos y reposiciones.
- **Resultado:** Una vista de su actividad como negocio: agenda, plata y herramientas.
- **Estado:** Diseñado (agenda y caja En pruebas) · **Secciones:** 10, 12, 13 · **Captura principal:** `S/capturas/especialista/F-Ingresos.png`
- **Pasos:** 1. F-Herramientas → 2. F-Agenda → 3. F-AgendaPasadas → 4. F-AgendaMes → 5. F-Ingresos → 6. H0-Gasto → 7. H0-Equipo → 8. H0-EquipoCategoria → 9. H0-EquipoDetalle → 10. H0-EquipoBaja

### E-R-10 · Las herramientas del teléfono y del oficio

- **Necesidad:** Medir, calcular y mostrar al cliente sin cargar más aparatos.
- **Acción:** Usa medir con la cámara, escaneo 3D y nivel; en Electricidad arma el tablero 3D, lo muestra en la pared, calcula cables y hace el informe.
- **Qué hace Handyx:** Aclara que las medidas son aproximadas, que los cálculos están en revisión técnica y que el teléfono no detecta tensión; manda lo calculado al presupuesto o al chat.
- **Resultado:** Presupuestos e informes más precisos y fáciles de explicar.
- **Estado:** Mixto: Electricidad (H1) y nivel En pruebas; herramientas para todos Diseñado; H2–H6 Concepto · **Secciones:** 14 · **Captura principal:** `S/capturas/especialista/T-Tablero.png`
- **Pasos:** 1. F-Herramientas → 2. T-Taller → 3. T-Medir → 4. T-Escanear → 5. T-Modelo3D → 6. T-Nivel → 7. T-Electricidad → 8. T-Tablero → 9. T-TableroPared → 10. T-Cables → 11. T-Informe

### E-R-11 · Camino Handyx

- **Necesidad:** Sentir que crecer en Handyx tiene recompensa, sin presión.
- **Acción:** Recibe el kit de bienvenida, lee el manual, avanza por trabajos y cobros verificados y canjea premios.
- **Qué hace Handyx:** Cuenta solo lo verificado, revisa cada premio antes de entregarlo y no usa azar, rankings ni aceptación de pedidos.
- **Resultado:** Premios por hitos visibles de antemano e insignias por usar la app.
- **Estado:** Diseñado (montos y premios en borrador; áreas Concepto) · **Secciones:** 15 · **Captura principal:** `S/capturas/especialista/G-Camino.png`
- **Pasos:** 1. G-Inicio → 2. G-Bienvenida → 3. G-Manual → 4. G-Camino → 5. G-MiniCamino → 6. F-Regalo → 7. G-Canje → 8. G-Vitrina → 9. G-Insignias → 10. G-Areas

### E-R-12 · Su cuenta: perfil, disponibilidad y cobros

- **Necesidad:** Controlar cómo lo ven los clientes, cuándo trabaja y cómo cobra.
- **Acción:** Revisa su perfil, datos verificados, disponibilidad y zonas, medios de cobro, avisos, privacidad y seguridad.
- **Qué hace Handyx:** Muestra solo los últimos números de los documentos, deja los urgentes con permiso revocable y no recibe la plata del servicio.
- **Resultado:** Cuenta bajo su control, con baja real y segunda verificación opcional.
- **Estado:** Diseñado (perfil público, disponibilidad, cobros, avisos y baja En pruebas) · **Secciones:** 4, 5, 6, 11 · **Captura principal:** `S/capturas/especialista/CU-Disponibilidad.png`
- **Pasos:** 1. F-Cuenta → 2. CU-Perfil → 3. CU-Datos → 4. CU-Disponibilidad → 5. CU-Cobros → 6. CU-Notificaciones → 7. CU-Privacidad → 8. D6-Seguridad

## Índice del Dossier 03 (17 secciones)

| Sección | Funciones | Capturas | Huecos |
|---|---|---|---|
| 1. Portada | — | FL-Mapa.png | Pieza editorial; puede usar un celular del lienzo (p. ej. F-InicioDia) sin la Canilla. |
| 2. El problema del profesional independiente | — | — | Ninguna fuente de esta superficie trae datos sobre el problema; hace falta investigación o testimonios reales (no inventados). Solo hay claims del pitch sin verificar. |
| 3. La propuesta de Handyx | E-P-01, E-P-05, E-TA-04, E-T-03, E-G-02 | D6-Bienvenida.png (recorte)<br>FL-Mapa.png | Definir el mensaje de tarifa (ver contradicción). La frase de la bienvenida: «Tu trabajo, tus precios». |
| 4. Registro y perfil profesional | E-V-01, E-V-02, E-V-03, E-V-05, E-V-06, E-OB-01, E-CU-01, E-CU-02 | RG-3.png<br>RG-8.png<br>D6-Alta.png<br>OB-Aprobado.png<br>CU-Perfil.png | Antecedentes: dos versiones contradictorias. El perfil con opiniones de clientes es solo diseño. |
| 5. Especialidades y servicios | E-V-04, E-V-05, E-CU-03, E-PR-06 | RG-3.png<br>RG-4.png<br>H0-ManoObra.png | Los seis rubros están fijos; no hay catálogo de servicios por rubro más allá de las tarifas por tarea. |
| 6. Recepción de oportunidades | E-P-01, E-P-02, E-P-03, E-P-04, E-P-09, E-OE-03 | recortes/F-Inicio-sin-canilla.png<br>CU-Disponibilidad.png<br>brands/handyx/assets/capturas/especialista-pedidos.webp | Sin cifras de pedidos reales. Mostrar «sin obligación de aceptar». |
| 7. Gestión de solicitudes | E-P-04, E-P-08, E-P-10, E-M-01, E-M-04 | recortes/F-Pedido-sin-canilla.png<br>F-Chat.png | No hay una bandeja de solicitudes en el lienzo (los pedidos viven en el Inicio); en código sí. |
| 8. Elaboración y envío de presupuestos | E-P-05, E-P-06, E-PR-01, E-PR-02, E-PR-03, E-PR-04, E-PR-05 | recortes/F-Precio-sin-canilla.png<br>H0-Presupuesto.png<br>H0-AgregarMaterial.png<br>H0-PreciosRevisar.png | El presupuestador completo es Diseñado; en código hay propuesta con precio y presupuesto en el chat. |
| 9. Comparación y aceptación de trabajos | E-P-01, E-P-07, E-P-08, E-O-03 | F-Revisar.png<br>F-Enviada.png (alternativa sin Canilla: F-Revisar) | El especialista no compara pedidos entre sí en una vista dedicada; decide uno por uno («Ahora no» sin consecuencias). |
| 10. Agenda y organización | E-TA-02, E-D-03, E-O-01, E-O-04, E-O-06 | F-InicioDia.png<br>F-AgendaMes.png<br>F-Obra.png<br>brands/handyx/assets/capturas/especialista-agenda.webp | — |
| 11. Gestión de clientes | E-M-01, E-M-02, E-OE-04, E-O-03, E-MT-05 | F-Mensajes.png<br>F-ObraNueva.png | No hay una ficha o lista de clientes propia: la relación vive en el chat, los contactos (de especialistas) y «obra nueva a un cliente tuyo». Preguntar si está prevista. |
| 12. Historial de trabajos | E-TA-02, E-TA-03, E-MT-05, E-O-01 | F-AgendaPasadas.png<br>H0-InformeEnviado.png | Historial = agenda pasadas, informes con PDF y Mis trabajos (código). No hay una pantalla de historial dedicada en el lienzo. |
| 13. Herramientas administrativas | E-TA-01, E-TA-04, E-TA-05, E-PR-04, E-EQ-01, E-EQ-03, E-R-01, E-R-03, E-MT-01 | F-Herramientas.png<br>F-Ingresos.png<br>H0-Precios.png<br>H0-EquipoDetalle.png<br>R-Retiro.png<br>FE-Pedido.png | Todo Diseñado salvo la caja. Exportar el mes y ayuda de monotributo solo en el plan (Concepto). |
| 14. Herramientas específicas por oficio | E-T-01, E-T-02, E-T-03, E-T-04, E-T-05, E-T-06, E-T-07, E-T-08, E-T-09, E-T-10, E-T-11, E-T-12 | T-Taller.png<br>T-Tablero.png<br>T-Informe.png<br>T-Cables.png<br>OF-Gas.png<br>OF-Aire.png | Solo Electricidad tiene código (rama, sin revisión técnica ni prueba de AR en dispositivos). H2–H6: un tablero cada uno, «después del deploy». |
| 15. Reputación y crecimiento | E-CU-01, E-CU-02, E-G-01, E-G-02, E-G-03, E-G-04, E-OE-03 | G-Camino.png<br>F-Regalo.png<br>G-MiniCamino.png<br>CU-Perfil.png | No hay sistema de calificaciones ni opiniones en código ni en el plan; el diseño muestra opiniones ficticias. Premios y montos en borrador. |
| 16. Roadmap profesional | E-T-08, E-T-09, E-T-10, E-T-11, E-T-12, E-T-13, E-G-05, E-R-04, E-PR-07, E-TA-06 | OF-Plomeria.png<br>OF-Albanileria.png<br>G-Areas.png | Fuente: docs/plan-olas.md (olas 0–6 y oficios después del deploy), sin fechas aprobadas. El pitch pone «HandIA para profesionales» en el mes 2 (diciembre): contradicción de horizonte. |
| 17. Cierre | — | D6-Bienvenida.png (recorte) | Contacto y QR según plan-dossiers. |

## Herramientas por oficio (solo lo dibujado)

| Fase | Oficio | Qué está dibujado | Estado | Horizonte | Tableros |
|---|---|---|---|---|---|
| H0 | Todos | Presupuestador, lista de precios, mano de obra, Modo trabajo, cierre e informe, gastos, equipamiento; herramientas del teléfono (medir con AR, escaneo y modelo 3D, plomada, linterna y lupa, conversor) | Diseñado (nivel con giroscopio: En pruebas) | sin fecha (olas 2) | H0-*, T-Taller, T-Medir, T-Escanear, T-Modelo3D, T-Nivel |
| H1 | Electricidad | Sección y caída de tensión, tablero 3D y en la pared (AR), informe eléctrico con semáforo; en código además vivienda, iluminación, consumo, Ohm, recorrido de caños, checklists, etiquetas con IA y presupuesto dictado | En pruebas (rama; sin revisión técnica, AR sin probar en dispositivos, IA sin proveedor) | sin fecha | T-Electricidad, T-Tablero, T-TableroPared, T-Cables, T-Informe |
| H2 | Aire acondicionado | Frigorías con la brújula, ver el equipo en la pared | Concepto | después del deploy | OF-Aire |
| H3 | Plomería | Pendiente del desagüe con el teléfono, pérdida por el medidor con dos fotos | Concepto | después del deploy | OF-Plomeria |
| H4 | Gas | Prueba de hermeticidad registrada con fotos del manómetro, protocolo ante olor a gas | Concepto | después del deploy (con revisión técnica y legal) | OF-Gas |
| H5 | Albañilería | Cómputo de materiales de un muro, pasar a la lista de repuestos | Concepto | después del deploy | OF-Albanileria |
| H6 | Cerrajería | Identificación de la cerradura por foto, constancia de autorización sin guardar el DNI | Concepto | después del deploy | OF-Cerrajeria |

**Oportunidades de evolución (solo mencionadas, sin diseño en el lienzo):** el resto de cada fase H2–H6 en `docs/herramientas.md` (carga de refrigerante, códigos de error, isométrico de cañerías, cañerías y ventilación de gas, cerámicos, stock de llaves vírgenes…), «HandIA para profesionales» y «feedback con IA» del pitch, y «18 herramientas por oficio (3 × 6)» de `afirmaciones.json` (meta 2027, sin verificar). No presentarlas como herramientas existentes.

## Puntos mirados con lupa

- **Alta y verificación.** Código: alta guiada con DNI, CUIT/CUIL, foto, rubros con matrícula y **antecedentes presenciales con turno** (sin archivos, lo fija una prueba del contrato). Lienzo: 10 pasos con selfie, DNI, CUIT, certificados y **antecedentes por foto o PDF**. Regla común: cargar ≠ verificar; solo el equipo de verificación habilita. Ver contradicción 1.
- **Cotización y presupuestador.** En código: precio propio con la sugerencia de Handyx («vos decidís») y presupuesto en el chat. Lienzo: presupuestador completo con lista de precios, kits, material nuevo y precios fijos o que se actualizan (Diseñado).
- **Lista de precios: «Handy sugiere, nunca impone».** Se cumple en lienzo (H0-ManoObra, F-Precio) y código (TuPrecio). La tabla de sugeridos del mock es de prueba.
- **Taller, agenda, historial, clientes, administración.** Agenda y caja En pruebas; pestaña Taller, ingresos y gastos, equipamiento e informe Diseñados. No hay ficha de clientes ni historial dedicado.
- **Obras y equipo.** Obra por etapas con diario y cobro En pruebas; equipo, búsqueda y reparto Diseñados con «Handyx no toca la plata».
- **Chat y equipamiento.** Chat básico En pruebas; grupos, reacciones, borrado lógico y tarjetas Diseñados; equipamiento Diseñado.
- **Ferretería.** App del especialista y panel web del ferretero (1280×800) y su app en el teléfono: todo Diseñado y simulado; «la venta la cobra la ferretería; Handyx no se queda con nada» (condiciones comerciales a definir). Sin repo ni backend.
- **Camino Handyx y reputación.** Camino, mini caminos, regalo y canje Diseñados con montos en borrador; áreas Concepto. Reputación en código = sello de verificación; no hay calificaciones.
- **Oferta.** Sin obligación ni asignaciones, urgentes con opt-in revocable y avisos que solo abren el detalle: se cumple en código y lienzo.
- **Tarifas.** Cuatro versiones (contradicción 2). **Dominio**: tres (contradicción 3).

## Contradicciones

### 1. Antecedentes penales: archivo o verificación presencial

- **A:** Antecedentes nunca como archivo; el certificado se muestra en persona y la app solo reserva un turno. El contrato 0.10.0 y su prueba impiden un campo de archivo. — *specialist-fe@f7c0733:CLAUDE.md y src/contracts/dto.ts; specialist-fe@585418d:src/contracts/contratos.test.ts; specialist-be (código del alta)* (2026-10-29 (main) y 2026-11-07 (contrato de la rama))
- **B:** Antecedentes por foto o PDF: cifrados, solo el equipo de verificación, nunca a IA, se borran al verificar; todavía no implementado y con revisión legal pendiente. El lienzo ya lo dibuja (RG-9, D6-Alta, CU-Datos). — *specialist-fe@585418d:CLAUDE.md, docs/herramientas.md V.4; specialist-be@cf3b39d:CLAUDE.md; client-be@8ce44f4:CLAUDE.md; lienzo RG-9* (2026-11-07 (los documentos la fechan «08/11/2026»))
- **Impacto:** El dossier no puede afirmar cómo se verifican los antecedentes; mostrar RG-9 como función existente sería falso.
- **Pregunta:** ¿Qué versión se comunica a inversores mientras falta la revisión legal? ¿Se muestra el paso o solo «verificación de antecedentes»?

### 2. Tarifa o comisión al especialista (cuatro versiones)

- **A:** Tarifa de Handyx 0 % para usuario y especialista solo durante la demo (10/11–10/12/2026), con modal de primer ingreso y contador en Cuenta; después ninguna tarifa sin política aprobada. Las capturas reales lo muestran. — *specialist-fe@f7c0733:src/contracts/fee.ts; client-be@8ce44f4:src/contracts/v1/fee.ts (aún con especialistaBp); capturas-pwa especialista-modal-fee y -cuenta* (2026-10-29 / 2026-11-07)
- **B:** 10 % al especialista y 10 % al cliente; el primer mes desde el 10/11 sin tarifa; camada fundadora: primeros 50, 5 % al especialista durante 12 meses. La demo muestra el 10 %. — *landing-fe@ac3b245:src/content/tarifas.json y src/render/demo/especialista.ts; Handy-landing-page-fe/CLAUDE.md* (2026-10-29 (decisión del 27/10))
- **C:** Handyx no le cobra comisión al especialista, nunca; se quitan el modal y el contador. El lienzo dice «Recibís el 100 % · Handyx no te cobra comisión» y la ayuda responde «Nada». — *specialist-fe@585418d:CLAUDE.md; specialist-be@cf3b39d:CLAUDE.md; client-be@8ce44f4:CLAUDE.md; lienzo F-Precio, OB-Tour, CU-Cobros, D6-Ayuda* (2026-11-07 (fechada «08/11/2026»))
- **D:** Pitch: comisión al profesional 0 % y tarifa del usuario 15 %; la prueba con porteros de octubre usó 10 % + 10 %. — *afirmaciones.json FEE-ESPECIALISTA, TARIFA-USUARIO, PRUEBA-COM-USUARIO, PRUEBA-COM-PROFESIONAL* (2026-11-04 / 2026-11-05)
- **Impacto:** Es el mensaje central del dossier (sección 3) y aparece dentro de muchas pantallas (F-Precio, OB-Tour, CU-Cobros, D6-Ayuda, TR-Cobro, exploraciones A/B/C con «0 % durante la demo»).
- **Pregunta:** ¿Cuál es la política vigente al 10/11 para el especialista y cuál para el cliente? ¿Se corrigen la landing, el contrato y las capturas antes de imprimir?

### 3. Dominio de la app del especialista

- **A:** workers.handyc.com (la demo en modo app, desde la landing). — *landing-fe@ac3b245:.github/workflows/apps.yml y docs/modulos/apps-por-rol.md* (2026-10-29)
- **B:** workers.handyx.pro (workflow de la PWA real en main) y specialist.handyx.pro (demo del mock en la rama). — *specialist-fe@f7c0733:.github/workflows/hostinger.yml; specialist-fe@585418d:docs/deploy.md* (2026-11-07)
- **Impacto:** Un QR o URL impreso puede quedar apuntando al lugar equivocado; además mezcla dos dominios raíz (handyc.com y handyx.pro).
- **Pregunta:** ¿Cuál es el dominio oficial de la app del especialista y cuál se imprime, si alguno?

### 4. Lanzamiento del 10/11 frente al plan de la PWA del especialista

- **A:** La PWA se lanza el 10/11/2026; las apps por rol de la landing salen de noindex ese día. — *consigna de la ola 1; landing-fe@ac3b245:docs/modulos/apps-por-rol.md* (2026-11-07)
- **B:** Deploy del producto al final, después del bloque Taller (olas 0–5, esperando el OK); «Nada desplegado; ningún proveedor con credenciales». La API del especialista no está en main. — *specialist-fe@585418d:docs/herramientas.md §5, docs/plan-olas.md, docs/handoff.md; specialist-be main = Initial commit* (2026-11-07)
- **Impacto:** El 10/11 solo puede salir la demo pública (landing) o la vista previa con datos de prueba; ninguna función del lienzo estará en manos de especialistas reales.
- **Pregunta:** ¿Qué ve un especialista el 10/11: la demo de la landing, la vista previa del mock o nada?

### 5. Horizonte de las herramientas por oficio

- **A:** H2–H6 (Aire, Plomería, Gas, Albañilería, Cerrajería) «después del deploy», de a dos oficios por ola. — *lienzo (título de la fila OF-*); specialist-fe@585418d:docs/plan-olas.md* (2026-11-07)
- **B:** Mes 2 (diciembre): «HandIA para profesionales» y herramientas de su oficio; 18 herramientas por oficio (3 × 6) para 2027. — *pitch 169–171 (x-mes-2); afirmaciones DESARROLLOS-PLAN* (2026-11-05)
- **Impacto:** El roadmap profesional del dossier podría prometer diciembre para algo que el plan técnico deja sin fecha.
- **Pregunta:** ¿El roadmap profesional sigue el plan por olas (sin fechas) o el plan de 3 meses del pitch?

### 6. Fechas de las decisiones

- **A:** Decisiones y revisión fechadas «08/11/2026» (dirección de arte, sin comisión, antecedentes por archivo, revisión UX/UI). — *specialist-fe@585418d:docs/handoff.md, docs/herramientas.md; lienzo UX-Revision* (documentos)
- **B:** Los commits que las registran son del 07/11/2026 y hoy es 07/11. — *git log de handyx-specialist-fe, -be y handyx-client-be* (2026-11-07)
- **Impacto:** Citar «08/11» en un dossier del 07/11 se lee como error.
- **Pregunta:** ¿Se citan esas decisiones con fecha 07/11?

### 7. Barra de navegación de la app

- **A:** Inicio · Trabajos · Agenda · Mensajes · Cuenta (código y capturas reales). — *specialist-fe@f7c0733 y capturas-pwa* (2026-10-29)
- **B:** Inicio · Obras · Taller · Mensajes · Cuenta (lienzo); el pitch muestra Inicio · Herramientas · Agenda · Números. — *lienzo FL-Mapa; pitch 144–147* (2026-11-07 / 2026-11-05)
- **Impacto:** Mezclar capturas reales y del lienzo en una misma página muestra dos apps distintas.
- **Pregunta:** ¿El dossier usa solo el lienzo (rotulado «Diseño propuesto») y deja las capturas reales para una página de «estado del código»?

## Faltantes

| Dato | Para | Pregunta |
|---|---|---|
| Política de tarifa definitiva para especialista y cliente al 10/11 | dossier 03 · 3 y 13 | ¿0 % al especialista siempre, 10 % con primer mes gratis o 0 % hasta el 10/12? ¿Y la camada fundadora sigue? |
| Versión aprobada del proceso de antecedentes | dossier 03 · 4 | ¿Archivo con borrado al verificar o turno presencial? ¿Hay revisión legal? |
| Dominio oficial de la app del especialista | dossier 03 · 17 y QR | ¿workers.handyc.com, workers.handyx.pro o specialist.handyx.pro? |
| Qué estará disponible el 10/11 para especialistas | dossier 03 · 16 | ¿Se publica la vista previa con datos de prueba, la demo de la landing o nada? |
| Datos del problema del profesional independiente | dossier 03 · 2 | ¿Hay entrevistas, encuestas o datos del preregistro (56 especialistas registrados, sin conciliar) que se puedan citar? |
| Sistema de reputación (calificaciones u opiniones) | dossier 03 · 15 | ¿Está previsto? Hoy solo hay sello de verificación y trabajos verificados; las opiniones del diseño son ficticias. |
| Gestión de clientes | dossier 03 · 11 | ¿Se planea una lista o ficha de clientes del especialista, o la gestión de clientes es el chat y la obra? |
| Ferreterías aliadas y condiciones comerciales | dossier 03 · 13 | ¿Hay alguna ferretería con acuerdo? Las condiciones figuran «a definir». |
| Escalera de premios, presupuesto y logística (punto Handyx, kit con remera) | dossier 03 · 15 | ¿Existe el punto Handyx del Centro? ¿Quién paga y entrega los premios? |
| Proveedores autorizados (SMS, IA, Mercado Pago, almacenamiento, mapas y trayectos, telefonía) | dossier 03 · 16 | ¿Cuáles están contratados o tienen fecha? |
| Revisión técnica de los cálculos de Electricidad y prueba de AR en dispositivos | dossier 03 · 14 | ¿Hay profesionales evaluadores asignados? |
| Repo y backend de Handyx Ferreterías | dossier 03 · 13 | ¿Se autoriza crear el repo del panel del ferretero? Hoy es solo diseño. |
| Origen de las capturas reales de la PWA | dossier 03 · todas | capturas.json no dice de qué commit salen; parecen de main (fase 3). ¿Se recapturan desde la rama? |

## Capturas recomendadas

Rutas relativas a `S` = scratchpad de la sesión. Los celulares están a 3x (1170 px de ancho). Los recortes sin la Canilla ya están generados en `S/capturas/especialista/recortes/`.

| PNG | Uso | Rótulo | px | Recorte | Personajes | Riesgos | Motivo |
|---|---|---|---|---|---|---|---|
| `FL-Mapa.png` | dossier 03 · 3 (mapa de la app) | Diseño propuesto | 4112×1932 | — | — | texto chico: rehacer como diagrama editorial con las cinco pestañas | Resume la app en un solo esquema: las cinco pestañas y a dónde lleva cada una. |
| `recortes/D6-Bienvenida-sin-canilla.png` | dossier 03 · 3 y 17 | Diseño propuesto | 1170×1092 | 0,1440,1170,1092 | — | el tablero completo muestra la Canilla en la ilustración: usar solo el recorte | «Tu trabajo, tus precios · Vos elegís qué trabajos tomar» condensa la propuesta. |
| `RG-3.png` | dossier 03 · 4 y 5 | Diseño propuesto | 1170×2532 | — | — | — | Rubros con la marca «Pide matrícula» en Gas y Aire: especialidades y verificación en una pantalla. |
| `RG-8.png` | dossier 03 · 4 | Diseño propuesto | 1170×2700 | — | — | — | Distingue obligatorio de opcional y «un certificado cargado todavía no» aparece en el perfil. |
| `D6-Alta.png` | dossier 03 · 4 | Diseño propuesto | 1170×2640 | — | — | menciona «Antecedentes penales · PDF cargado»: depende de la contradicción de antecedentes; cifra/nombre de muestra que puede leerse como real | Muestra que cargar no es estar verificado. |
| `OB-Aprobado.png` | dossier 03 · 4 (resultado del alta) | Diseño propuesto | 1170×2532 | — | — | sello «Verificado» y nombre de muestra (Julián): cifra/nombre de muestra que puede leerse como real | Cierre positivo del alta con rubros habilitados. |
| `CU-Disponibilidad.png` | dossier 03 · 6 | Diseño propuesto | 1170×2532 | — | — | — | Urgentes solo con Disponible encendido y programados aparte: la oferta sin obligación. |
| `recortes/F-Inicio-sin-canilla.png` | dossier 03 · 6 | Diseño propuesto | 1170×1150 | 0,0,1170,1150 | — | el tablero completo muestra la Canilla en la tarjeta del pedido; alternativa: F-InicioDia | Cabecera con Disponible sobre el mapa. |
| `recortes/F-Pedido-sin-canilla.png` | dossier 03 · 6 y 7 | Diseño propuesto | 1170×1330 | 0,1130,1170,1330 | — | el tablero completo muestra la Canilla junto a «Plomería» | Zona aproximada, dirección solo si aceptan, «Handyx sugiere» y «Ahora no · no tiene ninguna consecuencia». |
| `recortes/F-Precio-sin-canilla.png` | dossier 03 · 8 | Diseño propuesto | 1170×2112 | 0,420,1170,2112 | — | mensaje de tarifa sin definir («Handyx no te cobra comisión» / «Recibís el 100 %») | La cinta de precio con la sugerencia: «Handy sugiere, nunca impone». |
| `F-Revisar.png` | dossier 03 · 9 (alternativa a F-Enviada, que muestra la Canilla) | Diseño propuesto | 1170×2532 | — | — | mensaje de tarifa sin definir («Handyx no te cobra comisión» / «Recibís el 100 %») | «Hasta que acepte, no es un trabajo agendado»: la propuesta como acuerdo. |
| `H0-Presupuesto.png` | dossier 03 · 8 | Diseño propuesto | 1170×2532 | — | — | cifra/nombre de muestra que puede leerse como real | El presupuestador con mano de obra, materiales y precios fijos o que se actualizan. |
| `H0-AgregarMaterial.png` | dossier 03 · 8 (alternativa a H0-MaterialNuevo, que muestra la Canilla) | Diseño propuesto | 1170×2532 | — | — | — | Cobrar al cliente y anotar como gasto en un paso. |
| `H0-PreciosRevisar.png` | dossier 03 · 13 | Diseño propuesto | 1170×2532 | — | — | «Corralón Simulación»: comercio ficticio | Lista del corralón leída en el teléfono: herramienta administrativa concreta. |
| `H0-ManoObra.png` | dossier 03 · 5 | Diseño propuesto | 1170×2532 | — | — | cifra/nombre de muestra que puede leerse como real | Tarifas propias por tarea: «Handyx solo sugiere y vos decidís». |
| `F-InicioDia.png` | dossier 03 · 10 | Diseño propuesto | 1170×2532 | — | — | cifra/nombre de muestra que puede leerse como real | El día con paradas, sin la Canilla: alternativa a F-Inicio. |
| `F-AgendaMes.png` | dossier 03 · 10 | Diseño propuesto | 1170×2532 | — | — | cifra/nombre de muestra que puede leerse como real | Mes con obras y trabajos de un vistazo. |
| `H0-Modo.png` | dossier 03 · 13 (herramienta de trabajo) | Diseño propuesto | 1170×2532 | — | — | cifra/nombre de muestra que puede leerse como real | Modo trabajo: la app como herramienta durante el trabajo, no solo antes. |
| `H0-InformeEnviado.png` | dossier 03 · 12 | Diseño propuesto | 1170×2532 | — | — | cifra/nombre de muestra que puede leerse como real | Conformidad, garantía, recordatorio y PDF: historial que vale para el cliente. |
| `F-Herramientas.png` | dossier 03 · 13 | Diseño propuesto | 1170×2532 | — | — | cifra/nombre de muestra que puede leerse como real | La pestaña Taller resume agenda, plata, presupuestos, equipamiento, herramientas y ferretería. |
| `F-Ingresos.png` | dossier 03 · 13 | Diseño propuesto | 1170×2532 | — | — | cifra/nombre de muestra que puede leerse como real | Bruto, gastos y neto, con lo verificado aparte. |
| `H0-EquipoDetalle.png` | dossier 03 · 13 | Diseño propuesto | 1170×2850 | — | — | cifra/nombre de muestra que puede leerse como real | Historial, mantenimiento y préstamo de una herramienta. |
| `F-Obra.png` | dossier 03 · 10 y 11 | Diseño propuesto | 1170×3390 | — | — | cifra/nombre de muestra que puede leerse como real | Obra por días con gastado, falta cobrar y cambios pendientes del cliente. |
| `F-Reparto.png` | dossier 03 · 11 y 15 | Diseño propuesto | 1170×3000 | — | — | cifra/nombre de muestra que puede leerse como real | «Handyx no recibe ni reparte la plata». |
| `F-ObraBuscar.png` | dossier 03 · 15 (red de especialistas) | Diseño propuesto | 1170×2532 | — | — | cifra/nombre de muestra que puede leerse como real | Búsqueda visible solo para verificados de la zona; nadie entra solo. |
| `F-ChatAdjuntar.png` | dossier 03 · 7 y 11 | Diseño propuesto | 1170×2532 | — | — | cifra/nombre de muestra que puede leerse como real | Tarjetas que el cliente responde en el chat. |
| `R-Retiro.png` | dossier 03 · 13 (ferretería) | Diseño propuesto | 1170×2532 | — | — | «Ferretería Simulación Centro»: ficticia; no hay ferreterías aliadas | Retiro con QR: el punto de contacto con la ferretería. |
| `FE-Pedido.png` | dossier 03 · 13 (panel del ferretero) | Muestra · datos ficticios | 2560×1600 | — | — | cifra/nombre de muestra que puede leerse como real; «Verificado por Handyx» sobre un nombre de muestra | «Lo paga en el mostrador. Handyx no cobra nada de esta venta». |
| `T-Taller.png` | dossier 03 · 14 | Diseño propuesto | 1170×2532 | — | foco, llave | — | Herramientas para todos y del oficio; marca «Otros oficios · llegan más adelante». |
| `T-Tablero.png` | dossier 03 · 14 | Diseño propuesto (función con código en rama: En pruebas) | 1170×2532 | — | — | tabla «en revisión técnica»: rotular | Tablero 3D con cómputo al presupuesto: la herramienta más avanzada. |
| `T-Informe.png` | dossier 03 · 14 | Diseño propuesto (función con código en rama: En pruebas) | 1170×2532 | — | — | valores de medición de ejemplo | Informe con semáforo «No es un certificado». |
| `OF-Gas.png` | dossier 03 · 14 y 16 | Concepto | 1170×2532 | — | — | herramienta de seguridad: mantener el aviso «El teléfono no detecta gas ni monóxido» | Muestra el rumbo de H2–H6 con su límite de seguridad. |
| `OF-Aire.png` | dossier 03 · 16 | Concepto | 1170×2532 | — | — | — | Oportunidad de evolución por oficio, rotulada «Después del deploy». |
| `G-Camino.png` | dossier 03 · 15 | Diseño propuesto | 1170×2532 | — | llave | premios en borrador | El camino por trabajos verificados sin rankings. |
| `F-Regalo.png` | dossier 03 · 15 | Diseño propuesto | 1170×2532 | — | llave | premio en borrador («Gorra Handyx») | Hito con premio visible de antemano. |
| `G-MiniCamino.png` | dossier 03 · 15 | Diseño propuesto | 1170×2532 | — | — | montos en borrador que pueden leerse como compromiso | Mini camino por cobros verificados, «Sin sorteos». |
| `CU-Perfil.png` | dossier 03 · 4 y 15 | Diseño propuesto | 1170×2532 | — | — | cifra/nombre de muestra que puede leerse como real; «Verificado por Handyx» y «38 trabajos verificados» de muestra | Cómo lo ven los clientes; usar en lugar de F-PerfilProfesional (opiniones ficticias). |
| `brands/handyx/assets/capturas/especialista-pedidos.webp` | dossier 03 · 6 o página «estado del código» | Pantalla de la PWA · datos de prueba | 780×1688 | — | — | texto con «Handy» en lugar de «Handyx»; «Tarifa de Handy: 0 % durante la demo» (ver contradicción); banner «Datos de prueba» visible: mantenerlo | Prueba de que el flujo existe en código: «No tenés obligación de aceptar ninguno». |
| `brands/handyx/assets/capturas/especialista-cobro.webp` | dossier 03 · 13 o página «estado del código» | Pantalla de la PWA · datos de prueba | 780×1688 | — | — | nombra el área interna «Operations»; «Handy» en lugar de «Handyx» | Caja real del código: pago directo, verificado vs reportado. |

**Canilla (16 tableros).** Alternativas y recortes: D6-Bienvenida → recorte `0,1440,1170,1092`; F-Inicio → recorte `0,0,1170,1150` o F-InicioDia; F-Pedido → recorte `0,1130,1170,1330`; F-Precio → recorte `0,420,1170,2112`; F-PrecioTeclado → usar el recorte de F-Precio; F-Trabajo → recorte `0,440,1170,2092` (generado); F-Enviada → F-Revisar; H0-MaterialNuevo → H0-AgregarMaterial; G-Vitrina → recorte `0,960,1170,560` (fila de la gorra y la herramienta) o G-Camino; X-Escritorio → no usar; RC-Onboarding, RC-Login, RC-Pedido, RC-Presupuesto y RC-Camino → armar los recorridos con las pantallas sueltas; A-Precio → descartada.

## Riesgos de publicación

| Qué | Dónde | Recomendación |
|---|---|---|
| Mensajes de tarifa contradictorios dentro de las pantallas | F-Precio, F-PrecioTeclado, F-Revisar, OB-Tour, CU-Cobros, D6-Ayuda, TR-Cobro, capturas reales (modal y Cuenta), demo de la landing (10 %), exploraciones A/B/C | Decidir la política antes de imprimir; mientras tanto elegir recortes sin la frase o rotularla «sujeto a la política vigente». |
| Antecedentes por archivo presentado como hecho | RG-9, D6-Alta, CU-Datos, RC-Onboarding | No usar RG-9 hasta decidir; describir «verificación de antecedentes por el equipo» sin detallar el proceso. |
| La Canilla (personaje no permitido) | 16 tableros: A-Precio, D6-Bienvenida, F-Enviada, F-Inicio, F-Pedido, F-Precio, F-PrecioTeclado, F-Trabajo, G-Vitrina, H0-MaterialNuevo, RC-Camino, RC-Login, RC-Onboarding, RC-Pedido, RC-Presupuesto, X-Escritorio | Usar los recortes de S/capturas/especialista/recortes/ (D6-Bienvenida, F-Inicio, F-Pedido, F-Precio, F-Trabajo, G-Vitrina) o alternativas: F-Revisar por F-Enviada, H0-AgregarMaterial por H0-MaterialNuevo, F-InicioDia por F-Inicio, G-Camino por G-Vitrina; no usar los RC-* completos. |
| Opiniones de clientes ficticias con forma de testimonio | F-PerfilProfesional («Lo que dicen los clientes») | No usar, o recortar arriba de las opiniones; no hay sistema de opiniones en código ni en plan. |
| Cifras, nombres y sellos de muestra | Casi todas las pantallas (Julián Ortiz, Lucía Ferreyra, $ 239.500, 38 trabajos verificados, FE-Inicio y FE-Metricas con $ 1.284.000, 96 pedidos y 34 profesionales verificados) | Rótulo «Muestra · datos ficticios» en cada imagen; nunca citar esas cifras en el texto. |
| Presentar el diseño como producto disponible | Todo el lienzo; la PWA en código corre con servidor simulado o con la API solo en local | Separar en el dossier «Diseñado» de «En pruebas»; nada está Construido salvo la demo de la landing. |
| Clave de ejemplo con forma de secreto | D6-TOTP | No usar la captura; describir la segunda verificación sin pantallas de configuración. |
| Herramientas de seguridad (gas, electricidad, cerrajería) sin sus avisos | OF-Gas, T-Electricidad, T-Cables, OF-Cerrajeria | Mantener visibles «el teléfono no detecta tensión, gas ni monóxido», «en revisión técnica» y «nunca decodifica llaves». |
| Ferreterías presentadas como aliadas | R-*, FE-*, RC-Ferreteria | Rotular «Simulación · ferreterías ficticias»; no hay alianzas firmadas y las condiciones están a definir. |
| Urgencia con cuenta regresiva y «+1 al camino» | F-Inicio, F-Pedido («Quedan 18:42», «+1 al camino si se verifica») | Acompañar con «Ahora no · no tiene ninguna consecuencia» para no sugerir presión; recomendación de diseño, sin modificarlo. |
| Dominio impreso | QR y textos de contacto | No imprimir un dominio de la app del especialista hasta resolver workers.handyc.com / workers.handyx.pro / specialist.handyx.pro. |
| Capturas reales con marca vieja y área interna | brands/handyx/assets/capturas/especialista-*.webp | Usarlas solo como «estado del código», con su rótulo; o recapturar desde la rama. |
| Fechas «08/11» en material del 07/11 | UX-Revision (lienzo) y docs de la rama | No usar UX-Revision como pieza; citar las decisiones con fecha 07/11. |

## Fuentes

- `lienzo-especialista` (lienzo, 2026-11-07): Artifact JzUxRPjWxq2Aykk8aukDG8 «Handyx · Diseño completo del bloque Taller», copia en S/artifacts/especialista (196 tableros) y capturas en S/capturas/especialista
- `specialist-fe@f7c0733` (repo, 2026-11-07): handyx-specialist-fe origin/main: fases 1, 2 y lote 3.1 (mock) + workflow de Hostinger
- `specialist-fe@585418d` (repo, 2026-11-07): handyx-specialist-fe rama claude/pensive-hypatia-jajjgm: fases 3.2–5, Taller H0.1/H1, diseño D.1 y plan por olas
- `specialist-be@cf3b39d` (repo, 2026-11-07): handyx-specialist-be rama claude/pensive-hypatia-jajjgm (main = «Initial commit» fc5af22)
- `client-be@8ce44f4` (repo, 2026-11-07): handyx-client-be rama claude/pensive-hypatia-jajjgm (dueño del contrato y del esquema)
- `client-be@179bd86` (repo, 2026-11-02): handyx-client-be rama fase-4-backend-conciliado
- `landing-fe@ac3b245` (repo, 2026-10-29): Handy-landing-page-fe origin/main: demo interactiva (src/render/demo/especialista.ts), apps por rol, tarifas.json
- `capturas-pwa` (doc, sin dato): brands/handyx/assets/capturas/especialista-*.webp + capturas.json (servidor simulado; commit de origen sin dato)
- `afirmaciones` (pitch, 2026-11-05): decks/handyx-aticma/afirmaciones.json (FEE-ESPECIALISTA, TARIFA-USUARIO, PRUEBA-COM-*, DESARROLLOS-PLAN, ESP-REGISTRADOS)
- `pitch` (pitch, 2026-11-05): S/capturas/pitch 011–013 (a-profesional), 071–073 (q-12), 142–147 (x-herramientas), 169–171 (x-mes-2), 207–212 (x-ferreterias)
- `personajes` (doc, 2026-11-07): dossiers/inventario/personajes-lienzos.json
- `pedido` (doc, 2026-11-07): docs/handyx/pedido-dossiers.md §1–3, §7, §14
