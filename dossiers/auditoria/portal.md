# Auditoría · Portal interno de operaciones (Dossier 04 · ola 1)

Corte: 07/11/2026 · Superficie: portal · Datos completos en [`portal.json`](portal.json). Rutas `S/…` = scratchpad de la sesión.

## 1. Resumen

- **97 funciones relevadas**: 41 Construido · 15 En pruebas · 26 Diseñado · 15 Concepto.
- **Hay tres capas que no hay que mezclar:** (1) el **lienzo «Portal interno v3»** (36 tableros) es un **rediseño propuesto**: ninguna pantalla v3 existe en código; (2) el **portal v2** está en `main` del portal (olas 1–4 + decisiones del 07/11 + barrios reales de OpenStreetMap, 3fc06e2) y cubre casi todos los módulos con otra cara; (3) el **plan v3** (rama `claude/handyx-portal-v1-phases-3xzfm1`, 07/11) es una propuesta de 4 olas «que espera el OK», sin fechas.
- **«Construido» acá significa** código en `main` del portal y del backend de captación y CRM, verificado contra ese backend **en local**. El frontend v2 se publicó el 07/11 (ejecución manual del workflow de publicación, con éxito), pero el backend figura **sin desplegar** y la captura de la landing está **cerrada** hasta el aviso de privacidad definitivo: **no hay uso real confirmado ni datos reales**. Ninguna cifra de las capturas es real.
- **Lo que el portal hace de verdad hoy (en código):** CRM de pre-registros (lista de espera y especialistas, ficha, contacto guiado por WhatsApp sin envíos automáticos, seguimiento, importación con reversión, exportación sin datos personales), reclamos con plazos por gravedad, campañas con presupuesto, gasto, enlaces y QR, cohortes semanales, Mar del Plata contra otras ciudades, geometría real de 130 zonas del Partido, biblioteca de docs con editor por bloques, permisos por tarea, registro de actividad y datos personales cifrados.
- **Solo con datos de muestra (En pruebas):** Tareas tipo Jira, Legal y legajos, especialistas después del alta, capas por barrio, panel «¿está funcionando?» de campañas, cohortes ampliadas y Presentaciones (que el v3 saca del menú). Dependen de un backend propio del portal que es una **propuesta** (ADR-0004) sin código accesible.
- **Lo que no existe:** todo lo que viene de las apps (pedidos, propuestas, búsqueda manual, pagos reportados, reclamos de la app, verificación, invitaciones). La sección 7 del dossier («Seguimiento de trabajos») queda vacía de producto. La sección 9 tiene que decir que **el portal no maneja dinero**.
- **Riesgo editorial principal:** todo el lienzo usa nombres, incidentes y cifras ficticias que parecen tracción y operación real, mezcla el nombre real de Ignacio con datos inventados, y cinco tableros muestran personajes fuera de la lista. Se generaron recortes limpios y dos mapas con la geometría real sin datos.

## 2. Mapa de módulos

| Id | Módulo | Tableros del lienzo | Construido | En pruebas | Diseñado | Concepto | Resumen |
|---|---|---|---|---|---|---|---|
| I | Inicio y supervisión del día | Inicio, Tour, RC-Inicio, Mini, Onb, PasoFlujo | 4 | 1 | 2 | 0 | La primera pantalla del equipo: lo urgente de hoy, los tickets propios y cómo viene la semana, con cada número explicado. |
| F | Marco y sistema visual | Main, Sistema, Sidebar, Shell | 5 | 0 | 4 | 0 | Menú agrupado, búsqueda rápida, sistema visual Handyx y reglas comunes a todas las pantallas. |
| A | Acceso, guía y tour | Login, Bienvenida, Tour, Guia, RC-Acceso, RC-Ayuda | 2 | 0 | 5 | 0 | Ingreso solo para el equipo, bienvenida por rol, recorrido guiado y ayuda en cada pantalla. |
| C | Clientes y pre-registros (CRM) | Preregistros, Ficha, RC-Preregistros | 10 | 0 | 3 | 3 | Quién se anotó en la landing, a quién contactar primero y qué pasó con cada contacto. |
| E | Especialistas y legajos | Legal, RC-Legal | 0 | 4 | 1 | 0 | Especialistas después del alta y requisitos para trabajar (legajos); la verificación todavía no tiene pantalla en el portal. |
| S | Solicitudes y trabajos | — | 0 | 0 | 0 | 4 | Pedidos, propuestas, búsqueda manual y pagos reportados de las apps: solo aparecen en el menú; no hay datos ni diseño. |
| R | Reclamos e incidencias | Reclamos, RC-Reclamos | 3 | 0 | 3 | 2 | Reclamos ordenados por gravedad y plazo, con recorrido del caso, responsable y resolución. |
| T | Tareas del equipo | Tareas, Ticket, RC-Tareas | 0 | 4 | 1 | 0 | Tickets tipo Jira con sprints, tablero, subtareas y comentarios. |
| K | Campañas (administración comercial) | Campana, RC-Campana | 4 | 1 | 1 | 2 | Registrar campañas, armar enlaces y QR, medir si traen gente y anotar aprendizajes. |
| H | Cohortes | Cohortes, RC-Cohortes | 1 | 1 | 1 | 1 | Si la gente que llega ahora se atiende mejor que la que llegó antes, explicado para quien nunca vio una tabla de cohortes. |
| M | Mapa por barrio | MapaInicio, Mapa, RC-Mapa | 2 | 1 | 2 | 1 | Barrios reales del Partido de General Pueyrredon pintados según la pregunta elegida. |
| D | Docs del equipo | Docs, DocsJson, RC-Docs | 3 | 1 | 2 | 0 | Biblioteca de guías y procesos, editor por bloques y generador de docs desde IA. |
| L | Legal y compliance | Legal, RC-Legal | 2 | 1 | 1 | 0 | Papeles de la empresa con vencimientos y reglas de privacidad y retención. |
| X | Transversal: seguridad, privacidad y configuración | — | 5 | 0 | 0 | 2 | Acceso por tarea, registro de actividad, datos cifrados, supresión de grupos chicos, importación y configuración. |
| P | Presentaciones (sale en v3) | Main | 0 | 1 | 0 | 0 | Biblioteca y proyección de presentaciones: está en el código v2 y el lienzo v3 la saca del menú. |

Del lienzo, «Especialistas», «Solicitudes», «Importar» y «Configuración» aparecen solo como ítems del menú (sin tablero).

## 3. Funciones por estado

### Construido (41)

| Id | Módulo | Función | Qué hace | Horizonte | Publicado | Evidencia principal | Notas |
|---|---|---|---|---|---|---|---|
| P-I-01 | I | Bandeja de lo urgente del día | Junta en una lista lo que no puede esperar: seguimientos vencidos, especialistas sin contactar y reclamos abiertos, cada uno con su acción. | sin dato | ver nota ¹ | `portal@3fc06e2:docs/modules/inicio.md` · «Hoy (bandeja): seguimientos vencidos y del día… especialistas sin contactar… reclamos abiertos» | Versión v2 en código. El lienzo v3 la redibuja como «12 cosas para hoy» (ver P-I-02). |
| P-I-03 | I | «¿Cómo venimos?» con cifras explicadas | Muestra registros, contacto efectivo y compromiso con su denominador, fecha de cálculo y exclusiones. | sin dato | ver nota ¹ | `portal@3fc06e2:docs/modules/inicio.md` · «Cómo venimos: … con su denominador, fecha de cálculo y exclusiones. Sin sparkline ni delta» | El backend vigente no da series ni período anterior. |
| P-I-06 | I | Ordenar y ocultar bloques del Inicio | Cada persona cambia el orden de los bloques de su Inicio. | sin dato | ver nota ¹ | `portal@3fc06e2:docs/modules/inicio.md` · «Personalizar abre una hoja para ocultar y ordenar bloques… en memoria hasta que exista preferencias» | No se guarda entre sesiones: el portal no usa almacenamiento del navegador. |
| P-I-07 | I | Un bloque que falla no rompe el resto | Si un bloque no carga, lo dice y ofrece reintentar; lo demás sigue funcionando. | sin dato | ver nota ¹ | `portal@3fc06e2:docs/modules/inicio.md` · «Cada bloque carga por separado (un error en uno no tumba el resto)» | Hay un error conocido en el bloque de reclamos (ver contradicciones); el arreglo está planificado en la ola 1 del v3. |
| P-F-01 | F | Menú agrupado por tarea (v2) | Menú lateral con los módulos agrupados, que se achica a íconos. | sin dato | ver nota ¹ | `portal@3fc06e2:src/ui/shell` · «Sidebar: riel de 72 px… grupos plegables» | Versión v2, en navy y con grupos plegables. |
| P-F-03 | F | Buscar o ir a… (atajo de teclado) | Busca personas, pantallas y acciones desde cualquier lugar. | sin dato | ver nota ¹ | `portal@3fc06e2:docs/handoff.md` · «Ctrl+K con todas las pantallas y subpantallas… y acciones» |  |
| P-F-07 | F | Sistema de diseño v2 en código (tokens, componentes, gráficos accesibles) | Componentes comunes y librería de gráficos con tabla alternativa y supresión de grupos chicos. | sin dato | ver nota ¹ | `portal@3fc06e2:docs/handoff.md` · «2.3 Gráficos: librería src/ui/charts… tooltip por teclado, tabla alternativa, faltantes y n < 5» |  |
| P-F-08 | F | Modo oscuro y uso en celular y tableta | El portal funciona en claro y oscuro y en pantallas de 390, 820 y 1280 px. | sin dato | ver nota ¹ | `portal@3fc06e2:docs/handoff.md` · «25 rutas × 390/820/1280 + oscuro = 100 casos con 0 problemas» | El lienzo v3 solo dibuja el escritorio en claro. |
| P-F-09 | F | Pantalla de carga con los Handys | Animación breve al abrir el portal si la carga tarda. | sin dato | ver nota ¹ | `portal@3fc06e2:docs/modules/acceso.md` · «Los Handys entran en secuencia… Solo aparece si el arranque pasa de 300 ms» | Usa los cinco Handys (incluye personajes fuera de la lista permitida). |
| P-A-01 | A | Ingreso solo para el equipo | Entran solo cuentas del equipo creadas por quien administra; no hay registro público. | sin dato | ver nota ¹ | `portal@3fc06e2:docs/modules/acceso.md` · «Login partido… No hay registro ni recuperación» | Se describe solo la capacidad; el mecanismo no se publica. |
| P-A-02 | A | Muestra navegable con datos ficticios (v2) | Versión del portal sin servidor, rotulada «Muestra · datos ficticios», para mostrarlo sin tocar datos. | sin dato | no: la vista previa pública falla desde el 30/10 (historial de ejecuciones) | `portal@3fc06e2:docs/architecture/system.md` · «sin ella, solo existe la muestra con fixtures ficticios» | Es la fuente de las 45 capturas MOCK del código (docs/capturas-v2). |
| P-C-01 | C | Pre-registros separados en especialistas y lista de espera | Dos listas que no se mezclan, con conteos por estado y paginación. | sin dato | ver nota ¹ | `portal@3fc06e2:docs/modules/crm.md` · «Lista de cada audiencia (especialistas y lista de espera)… paginación del servidor» | Sin gente real todavía: la captura de la landing está cerrada hasta el aviso definitivo. |
| P-C-02 | C | Filtros por rubro, ciudad y estado y búsqueda exacta | Filtra la lista y busca a una persona por su identificador o su WhatsApp completo. | sin dato | ver nota ¹ | `portal@3fc06e2:docs/modules/crm.md` · «búsqueda exacta… rubro, ciudad… chips y Limpiar todo» |  |
| P-C-04 | C | Contactar al siguiente | Abre la ficha de la persona que más tiempo lleva esperando. | sin dato | ver nota ¹ | `portal@3fc06e2:docs/modules/crm.md` · «Acción principal: «Contactar al siguiente» (lista)» |  |
| P-C-05 | C | Ficha del pre-registro con etapa, siguiente paso e historial | Una sola acción principal según el estado, pestañas y todo lo que pasó con la persona. | sin dato | ver nota ¹ | `portal@3fc06e2:docs/modules/crm.md` · «Ficha: encabezado con una única acción principal, etapas… pestañas Resumen · Seguimiento · Historial · Datos» | El lienzo v3 la redibuja con otras etapas (ver contradicciones). |
| P-C-06 | C | Contacto guiado por WhatsApp sin envíos automáticos | Abre WhatsApp sin texto escrito y después registra qué pasó; nada se manda solo. | sin dato | ver nota ¹ | `portal@3fc06e2:docs/modules/crm.md` · «WhatsApp es un enlace… sin texto; el mensaje sugerido se copia a mano» |  |
| P-C-07 | C | Seguimiento: próximo paso, notas y tareas internas del contacto | Cada ficha guarda el próximo paso, notas internas y tareas del equipo. | sin dato | ver nota ¹ | `portal@3fc06e2:docs/modules/crm.md` · «Seguimiento (SeguimientoPanel): próximo paso, notas y tareas del equipo» |  |
| P-C-08 | C | Avisar acceso a la lista de espera | Registra que a un vecino en lista de espera se le avisó. | sin dato | ver nota ¹ | `landing-be@4cb77e4:docs/contract-delta.md` · «Evento nuevo aviso (usuario en_espera → avisado)» |  |
| P-C-12 | C | Datos de contacto protegidos | Los datos personales están cifrados, se ven solo en la ficha y cada vez que alguien los abre queda registrado. | sin dato | ver nota ¹ | `landing-be@4cb77e4:CLAUDE.md` · «Sin PII en claro en la base» |  |
| P-C-13 | C | Importar planillas de contactos | Carga lotes con validación por fila; un duplicado nunca pisa datos y el lote se puede revertir. | sin dato | ver nota ¹ | `portal@3fc06e2:docs/modules/importar.md` · «Validación por fila… Nunca se pisa un dato ni un consentimiento… Revertir lote» | Lo importado no cuenta como «anotado» ni da permiso de contacto. Un lote de especialistas fuera de Mar del Plata se rechaza entero. |
| P-C-14 | C | Exportación sin datos personales | Genera una exportación sin nombre, WhatsApp ni email, que queda registrada. | sin dato | ver nota ¹ | `portal@3fc06e2:docs/modules/importar.md` · «exportación minimizada (ID, audiencia, ciudad local/otra y rubro; sin nombre, WhatsApp ni email)» |  |
| P-R-01 | R | Reclamos ordenados por gravedad y plazo | Crítica y alta se responden hoy, media en 2 días y baja en 3; lo vencido va primero. | sin dato | ver nota ¹ | `portal@3fc06e2:docs/modules/reclamos.md` · «crítica y alta, el mismo día; media, 2 días; baja, 3 días… Es una regla de la interfaz: el contrato vigente no tiene plazos» |  |
| P-R-02 | R | Ficha del reclamo con recorrido, responsable y resolución | Abierto → en análisis → resuelto → cerrado, con historial y resolución obligatoria. | sin dato | ver nota ¹ | `portal@3fc06e2:docs/modules/reclamos.md` · «Recorrido del caso… Resolver exige resolución» |  |
| P-R-03 | R | Cargar un reclamo que llega por teléfono o mail | Alta de un reclamo con gravedad; el plazo se calcula solo. | sin dato | ver nota ¹ | `portal@3fc06e2:docs/modules/reclamos.md` · ««Nuevo reclamo» en una hoja con stepper» |  |
| P-K-01 | K | Registrar campañas con presupuesto y gasto | Alta de campañas con canal, inicio, presupuesto y gasto; una corrección es otro asiento. | sin dato | ver nota ¹ | `landing-be@4cb77e4:docs/ops.md` · «Importes en centavos enteros, moneda fija ARS; el gasto de una campaña es inmutable» |  |
| P-K-02 | K | Asistente de campaña con enlaces y QR por pieza | Seis pasos: objetivo, audiencia, canal y presupuesto, piezas, enlaces con QR y revisión. | sin dato | ver nota ¹ | `portal@3fc06e2:docs/modules/campanas.md` · «Wizard (6 pasos…) … Enlaces (UTM + Qr SVG por pieza y red, copiar)» | Los enlaces se arman, pero la landing todavía no registra el origen: no se puede medir qué trajo cada uno. |
| P-K-03 | K | Pausar, reanudar, finalizar y anotar aprendizajes | Cambiar el estado de una campaña y dejar lo aprendido. | sin dato | ver nota ¹ | `portal@3fc06e2:docs/modules/campanas.md` · «Aprendizajes… texto único sin fecha · Anotar aprendizaje · …/cambios» |  |
| P-K-07 | K | Pack de marketing (12 piezas) y guía para redes | Plantillas de piezas con la marca y una guía de tono y formatos. | sin dato | no | `portal@3fc06e2:docs/handoff.md` · «Guía 10 (marketing), pack de 12 piezas (npm run marketing:build)» | Pieza que no necesita backend. No se revisó qué personajes usan las piezas. |
| P-H-01 | H | Tabla de cohortes semanal de pre-registros | Qué porcentaje de cada semana de llegada fue contactado, con celdas incompletas marcadas y grupos chicos ocultos. | sin dato | ver nota ¹ | `landing-be@4cb77e4:docs/ops.md` · «Cohortes: celda incompleta hasta que termina la ventana y chica con base < umbral (≥ 5)» |  |
| P-M-01 | M | Barrios reales del Partido de General Pueyrredon | 130 zonas sin huecos a partir de OpenStreetMap, con aviso cuando un límite es aproximado. | sin dato | ver nota ¹ | `portal@857127c` · «130 zonas sin huecos. 108 con límite de OSM… 21 aproximadas… y la zona rural» | La geografía es real y publicable con atribución. |
| P-M-02 | M | Mar del Plata contra otras ciudades | Cuántos anotados hay en la ciudad y fuera de ella, sin mostrar grupos de menos de 5. | sin dato | ver nota ¹ | `landing-be@4cb77e4:docs/ops.md` · «Mapas: solo dos celdas (Mar del Plata / otras ciudades) porque el alta no guarda zona fina» |  |
| P-D-01 | D | Biblioteca de documentos del equipo con versiones | Crear, leer, versionar, publicar y archivar guías y procesos. | sin dato | ver nota ¹ | `portal@3fc06e2:docs/modules/docs.md` · «Lista, lectura, crear, versión, estado · Backend vigente: contenido en Markdown» |  |
| P-D-02 | D | Editor por bloques con control de datos sensibles | Pasos, checklists, tablas y avisos; antes de guardar bloquea teléfonos reales y claves. | sin dato | ver nota ¹ | `portal@3fc06e2:docs/modules/docs.md` · «Editor de bloques… secretos y teléfonos reales bloquean» | Con el backend vigente se guarda como texto con formato. |
| P-D-04 | D | Guías operativas escritas (11) | Guías de acceso, CRM, importación, solicitudes y reclamos, campañas, analítica, docs, operación, límites, marketing digital y apps. | sin dato | no | `portal@3fc06e2:docs/handy-docs` · «01-acceso… 11-apps-de-handy» | Contenido en el repositorio; no hay evidencia de que estén cargadas en un portal en uso. |
| P-L-03 | L | Retención de 12 meses y purga de vencidos | Los pre-registros vencen a los 12 meses y se borran de verdad. | sin dato | no: la decisión de producción del 02/11 es no purgar | `landing-be@4cb77e4:CLAUDE.md` · «Retención: pre-registros 12 meses calendario (04-A); purga real» | En código y probado; apagado por decisión (ver contradicciones). |
| P-L-04 | L | Derechos de las personas (acceso, rectificación, supresión) | Atender pedidos de quien dejó sus datos. | sin dato | sin verificar | `landing-be@4cb77e4:handoff.md` · «Purga y derechos… buscar / acceso / suprimir / rectificar» | Se resuelve fuera del portal, con un procedimiento privado del backend. |
| P-X-01 | X | Permisos por tarea | Cada persona ve y hace solo lo que su función permite; el servidor lo exige igual. | sin dato | ver nota ¹ | `landing-be@4cb77e4:docs/ops.md` · «Permiso por endpoint en el servidor; write nunca implica read» | No publicar la lista de permisos ni roles técnicos. |
| P-X-02 | X | Registro de quién hizo qué y cuándo | Cada cambio y cada lectura de datos personales queda registrado en la misma operación. | sin dato | ver nota ¹ | `landing-be@4cb77e4:docs/ops.md` · «Toda mutación escribe su fila de auditoría en la misma transacción» |  |
| P-X-04 | X | Grupos chicos ocultos en métricas y mapa | Con menos de 5 personas no se muestra el número, y se evita que se deduzca. | sin dato | ver nota ¹ | `portal@3fc06e2:docs/modules/mapa.md` · «n < umbral no se muestra… ninguna relación puede quedar con un solo desconocido» |  |
| P-X-05 | X | Configuración de solo lectura: fuentes, políticas y diccionario de métricas | Muestra de dónde sale cada dato y su estado, las políticas vigentes y qué mide cada métrica. | sin dato | ver nota ¹ | `portal@3fc06e2:docs/modules/config.md` · «Solo lectura… Fuentes… Políticas… Diccionario» | No tiene tablero en el lienzo v3 (solo el ítem del menú). |
| P-X-06 | X | «Fuente pendiente» en lugar de cifras inventadas | Cuando el dato no existe, la pantalla lo dice y explica qué falta. | sin dato | ver nota ¹ | `Sistema.dc.html` · «Fuente pendiente · El backend todavía no publica la atribución por UTM. No mostramos ningún número inventado.» |  |

### En pruebas (15)

| Id | Módulo | Función | Qué hace | Horizonte | Publicado | Evidencia principal | Notas |
|---|---|---|---|---|---|---|---|
| P-I-05 | I | Sprint actual y vencimientos legales en Inicio | Trae al Inicio los tickets del sprint y lo que vence en Legal. | sin fecha | no | `portal@3fc06e2:docs/handoff.md` · «Inicio con los bloques reales de cada módulo (sprint actual de Tareas y vencimientos de Legal…; sin backend nuevo, «fuente pendiente»)» | Solo con datos de muestra hasta que exista el backend propio del portal. |
| P-E-01 | E | Especialistas después del alta (verificado → habilitado → activo) | Lista y ficha de especialistas con el paso que les falta y si reciben pedidos. | sin fecha | no | `portal@3fc06e2:docs/modules/crm.md` · «Especialistas… Con el backend vigente es «fuente pendiente»… en la muestra salen los fixtures» | En el lienzo v3 solo es un ítem del menú, sin tablero. |
| P-E-02 | E | Verificación de documentos y alta por Operations | Revisar documentos, pedir correcciones, habilitar o rechazar a un especialista. | sin fecha | no | `specialist-be@cf3b39d:src/services/operaciones.service.ts` · «Operations: la ÚNICA vía para verificar documentos, decidir el alta… desde un proceso privado» | Existe en una rama sin mergear del backend del especialista y corre fuera del portal; el portal no tiene pantalla. |
| P-E-03 | E | Legajos: requisitos para trabajar | Por especialista: monotributo con CUIT, constancia en PDF de hasta 10 MB y antecedentes en 7 días; sin ellos no puede tomar trabajos. | sin fecha | no | `portal@8ea1c63` · «Legal: constancia de monotributo (CUIT)… antecedentes penales dentro de los 7 días… sin antecedentes ni monotributo verificados y vigentes la persona no puede tomar trabajos» | Solo con datos de muestra rotulados «Datos ficticios»; el backend que lo sostendría no existe. Hay contradicciones sobre antecedentes como archivo. |
| P-E-04 | E | Ver un documento de un legajo con resguardos | Pide motivo y confirmación reforzada, muestra el documento con marca de agua, sin descarga, y lo registra. | sin fecha | no | `portal@3fc06e2:docs/modules/legal.md` · «Visor: motivo obligatorio… documento inline con marca de agua… sin descarga ni impresión» |  |
| P-T-01 | T | Tablero del sprint con arrastre | Columnas por estado; los tickets se mueven arrastrando o con «Mover a…». | sin fecha | no | `portal@3fc06e2:docs/modules/tareas.md` · «Tablero: columnas por estado… arrastre… y menú «Mover a…»… Contrato nuevo §7.3» |  |
| P-T-02 | T | Backlog y sprints | Planificar lo que sigue, iniciar y cerrar sprints eligiendo el destino de lo pendiente. | sin fecha | no | `portal@3fc06e2:docs/modules/tareas.md` · «Backlog… Sprints: crear/editar, iniciar con objetivo, cerrar eligiendo el destino» |  |
| P-T-03 | T | Reportes del sprint | Avance del sprint, velocidad, alcance y tiempos de ciclo. | sin fecha | no | `portal@3fc06e2:docs/modules/tareas.md` · «Reportes: burndown… velocidad de los últimos 6 sprints… cycle y lead time» |  |
| P-T-04 | T | Ticket con subtareas, comentarios, vínculos e historial | Cada ticket con tipo, prioridad, responsable, fecha, partes para tachar y vínculo a pre-registros o reclamos. | sin fecha | no | `portal@3fc06e2:docs/modules/tareas.md` · «Ficha: descripción, subtickets, comentarios, vínculos, historial» |  |
| P-K-04 | K | Panel «¿Está funcionando?»: veredicto, meta, costo por pre-registro, embudo y piezas | Responde si la campaña trae gente, dónde se pierde y qué pieza y día funcionan mejor. | sin fecha | no | `portal@3fc06e2:docs/modules/campanas.md` · «Panel (serie, ritmo, CPL, embudo, pieza/red/día, proyección) · contrato nuevo · Muestra: sí · Si falta: aviso + solo gasto vs. presupuesto» |  |
| P-H-02 | H | Cohortes ampliadas: por mes, tiempo hasta el primer contacto, curva de sin contactar, cortes y lectura guiada | Más formas de leer el avance de cada grupo, con intervalos y una lectura en palabras. | sin fecha | no | `portal@3fc06e2:docs/modules/cohortes.md` · «tiempo hasta el evento, curvas, cortes y agrupar por mes quedan como «fuente pendiente»… Muestra: personas ficticias» |  |
| P-M-03 | M | Capas por barrio (demanda, oferta, oferta por demanda, crecimiento) | Pinta cada barrio, con panel del barrio, lista accesible y supresión de grupos chicos. | sin fecha | no | `portal@3fc06e2:docs/modules/mapa.md` · «Capas por barrio · muestra.ts (ficticio) · Backend vigente: Fuente pendiente: el alta no guarda barrio» |  |
| P-D-03 | D | Bloques avanzados y comentarios por bloque | Bloques de decisión, ticket, métrica en vivo e imagen, y comentarios sobre cada bloque. | sin fecha | no | `portal@3fc06e2:docs/modules/docs.md` · «Decisión, ticket, métrica, imagen · Deshabilitados… Comentarios por bloque · Fuente pendiente» |  |
| P-L-01 | L | Documentos de la empresa con vencimientos y versiones | Biblioteca de papeles de Handyx con lo que vence en los próximos 60 días y alta reforzada. | sin fecha | no | `portal@3fc06e2:docs/modules/legal.md` · «Documentos de la empresa… Contrato nuevo (handy-internal-be)… Es un módulo nuevo: Handy-landing-page-be no lo tiene» |  |
| P-P-01 | P | Presentaciones del equipo (biblioteca, editor, proyección con control desde el celular) | Armar y proyectar presentaciones con cifras que salen de una fuente real. | sin fecha | no | `portal@3fc06e2:docs/modules/presentaciones.md` · «Biblioteca, editor, pantalla con QR local y control remoto» | El lienzo v3 la saca del menú; el código queda guardado sin rutas. No conviene presentarla en el dossier. |

### Diseñado (26)

| Id | Módulo | Función | Qué hace | Horizonte | Publicado | Evidencia principal | Notas |
|---|---|---|---|---|---|---|---|
| P-I-02 | I | «Para hoy» en tres pastillas (reclamos graves, sin contactar +48 h, papeles que vencen) | Resume el día en tres números que llevan a la lista ya filtrada. | sin fecha | no | `Inicio.dc.html` · «PARA HOY · 12 cosas para hoy · Tocá cada una para ir directo a la lista filtrada» | La pastilla de papeles depende de Legal, que solo corre con datos de muestra. |
| P-I-04 | I | «¿Cómo viene la semana?» con comparación contra la semana anterior | Cuatro preguntas con su número y la flecha contra la semana anterior; si falta el dato dice «Sin dato». | sin fecha | no | `Inicio.dc.html` · «¿Cómo viene la semana? · Comparado con la semana anterior · Sin dato · Fuente pendiente» | Comparar contra la semana anterior y «¿Resolvemos los reclamos?» no existen en el contrato vigente. |
| P-F-02 | F | Menú azul Handyx con grupos fijos (Día a día, Crecimiento, Equipo, Empresa) | Menú que se abre y cierra sin saltos, con grupos fijos y la guía siempre abajo. | sin fecha | no | `Shell.dc.html` · «Sidebar que no se rompe… Los grupos no se pliegan» |  |
| P-F-04 | F | Avisos del equipo (menciones, asignaciones y vencimientos) | Junta en una campanita lo que pasó mientras no mirabas. | sin fecha | no | `RC-Ayuda.dc.html` · «La campanita junta menciones, asignaciones y vencimientos» | No hay avisos en el código v2. |
| P-F-05 | F | Volver y migas en todas las fichas | Botón Volver arriba a la izquierda que conserva los filtros. | sin fecha | no | `Main.dc.html` · «Botón Volver en cada ficha» |  |
| P-F-06 | F | Sistema visual Handyx v3 (relieve, select propio, modal único, íconos) | Mismo lenguaje que la app del especialista adaptado a un panel de escritorio. | sin fecha | no | `Sistema.dc.html` · «Sistema visual Handyx · El mismo lenguaje que la app del especialista, adaptado a un CRM de escritorio» |  |
| P-A-03 | A | Entrar a la muestra desde el login | El login de la muestra se ve igual al real y ofrece entrar sin cuenta. | sin fecha | no | `Login.dc.html` · «Estás en la muestra… entrá sin cuenta» |  |
| P-A-04 | A | Bienvenida con elección de rol | La primera vez, cada persona elige en qué trabaja y se le marcan los módulos que más va a usar. | sin fecha | no | `Bienvenida.dc.html` · «¿En qué trabajás? Operaciones · Crecimiento · Soporte · Dirección» | El plan v3 propone ofrecerla en cada sesión hasta tener dónde guardar que ya se vio. |
| P-A-05 | A | Recorrido guiado (spotlight) | Oscurece la pantalla e ilumina cada parte con una explicación paso a paso. | sin fecha | no | `Tour.dc.html` · «PASO 1 DE 5 · El menú, siempre a mano» |  |
| P-A-06 | A | Ayuda de cada pantalla (16 onboardings) | El botón «?» de cada pantalla abre su propio recorrido con ejemplos del día a día. | sin fecha | no | `RC-Indice.dc.html` · «el onboarding de cada pantalla: qué se ilumina, qué dice el globo y un ejemplo real» |  |
| P-A-07 | A | Guía del portal (anatomía, módulo por módulo y glosario) | Explica cómo se lee cualquier pantalla y qué hacer en cada módulo. | sin fecha | no | `Guia.dc.html` · «Anatomía de una pantalla · Módulo por módulo · Palabras que vas a ver» |  |
| P-C-03 | C | Barrio de cada pre-registro y filtro por barrio | Muestra el barrio en la lista y permite filtrar por él. | sin fecha | no | `Preregistros.dc.html` · «Barrio: Centro · NOMBRE OFICIO BARRIO ESTADO» | Bloqueado: la landing no pide barrio. |
| P-C-09 | C | Asignar responsable viendo la carga de cada persona | Elige quién se ocupa de cada pre-registro mostrando cuántos abiertos tiene cada uno. | sin fecha | no | `Ficha.dc.html` · «Responsable · Tomás Méndez 4 abiertos · menos cargado · Sin asignar: vuelve a la bandeja del equipo» | El contrato vigente de pre-registros no tiene responsable. |
| P-C-11 | C | Campaña de origen en la ficha | Dice por qué campaña llegó cada persona. | sin fecha | no | `Ficha.dc.html` · «Llegó el 4 de noviembre por la campaña “Especialistas MdP · Nov”» | Bloqueado hasta que la landing mande el origen. |
| P-E-05 | E | Vista «Personas» con acciones por requisito | Cada especialista con sus tres requisitos y botones para escribirle o pedir el PDF. | sin fecha | no | `RC-Legal.dc.html` · «Personas · legajos · Cada especialista con sus 3 requisitos y si puede trabajar» |  |
| P-R-04 | R | Vista «Por plazo» en columnas con tiempo restante | Tres columnas (hoy, 2 días, 3 días) con una barra de cuánto queda. | sin fecha | no | `Reclamos.dc.html` · «Para hoy · En 2 días · En 3 días · quedan 3 h» |  |
| P-R-05 | R | Resueltos a tiempo | Cuántos reclamos se resolvieron dentro del plazo esta semana. | sin fecha | no | `Reclamos.dc.html` · «11 de 14 resueltos a tiempo esta semana» |  |
| P-R-06 | R | Pasar un reclamo a un ticket del equipo | Lo que no se resuelve en el reclamo se convierte en una tarea. | sin fecha | no | `RC-Reclamos.dc.html` · «Lo que no se resuelve en el reclamo pasa a Tareas» |  |
| P-T-05 | T | Vistas Lista y Mis tareas, filtro por persona y menciones | Ver solo lo propio, filtrar por responsable y avisar con @. | sin fecha | no | `RC-Tareas.dc.html` · «Tablero, Lista, Mis tareas, Backlog… Comentá con @ para avisar a alguien» |  |
| P-K-05 | K | Panel de campaña v3 con veredicto, tres pestañas y aprendizajes firmados | Arriba la respuesta; abajo Embudo, Piezas/redes/días y Aprendizajes (funcionó, a mejorar, hipótesis). | sin fecha | no | `Campana.dc.html` · «¿ESTÁ FUNCIONANDO? · Embudo · Piezas, redes y días · Aprendizajes» |  |
| P-H-03 | H | Cohortes explicadas en tres pasos | Antes de la tabla, explica qué es una cohorte, qué medir y cómo leer los colores. | sin fecha | no | `Cohortes.dc.html` · «¿Qué es una cohorte? En tres pasos · LECTURA GUIADA» |  |
| P-M-04 | M | «¿Qué querés ver en el mapa?»: cinco preguntas | Elegir la pregunta (cobertura, dónde se pide, huecos, sin contactar, reclamos) y si ya tiene datos. | sin fecha | no | `MapaInicio.dc.html` · «Cobertura de especialistas · Dónde se piden trabajos · Huecos · Pre-registros sin contactar · Reclamos por barrio» |  |
| P-M-05 | M | Tabla de barrios paginada, con buscador y descarga, y acciones desde el barrio | Comparar los barrios de a 10 y pasar a «ver especialistas» o «crear campaña para este barrio». | sin fecha | no | `Mapa.dc.html` · «Todos los barrios · 1–10 de 99 barrios · Crear campaña para este barrio · Descargar tabla» | El código v2 ya ofrece «Planear una campaña» desde el mapa. |
| P-D-05 | D | Lectura en modal grande con índice | Cada doc se lee a pantalla casi completa y se vuelve a donde estabas. | sin fecha | no | `Docs.dc.html` · «Lectura en un modal completo» |  |
| P-D-06 | D | Generar un doc desde lo que escribe una IA | Se copian instrucciones a la IA, se pega su respuesta, se valida bloque por bloque y se publica. | sin fecha | no | `DocsJson.dc.html` · «Generar un doc desde JSON · Pegar JSON · Revisar · Publicar» |  |
| P-L-02 | L | Legal en tres vistas: Resumen, Empresa y Personas | «Qué hay que hacer» con un botón por fila, cuatro contadores y documentos agrupados (sociedad, seguros, privacidad). | sin fecha | no | `Legal.dc.html` · «Resumen · Empresa · Personas · 3 cosas esta semana» |  |

### Concepto (15)

| Id | Módulo | Función | Qué hace | Horizonte | Publicado | Evidencia principal | Notas |
|---|---|---|---|---|---|---|---|
| P-C-10 | C | Reparto automático de pre-registros | Asigna cada pre-registro nuevo a alguien del equipo sin intervención. | sin fecha | no | `RC-Campana.dc.html` · «A mejorar… Propuesta: reparto automático y alerta en Inicio» | Aparece como ejemplo en la ficha y como propuesta en un aprendizaje: no hay regla definida. |
| P-C-15 | C | Gestión de clientes con cuenta en la app | Ver y atender a los usuarios activos de la PWA desde el portal. | sin fecha | no | `landing-be@4cb77e4:docs/ops.md` · «Pedidos, propuestas, pagos, verificación, habilitación y disponibilidad son de la PWA… no hay contrato de lectura todavía» | El pre-registro no es una cuenta y no hay migración automática entre la lista de espera y la app. |
| P-C-16 | C | Códigos de invitación para la demo cerrada | Operations emite códigos de uso único para entrar a las apps. | sin dato | no | `client-be@fase-4-backend-conciliado:docs/adr/ADR-0002-auth-de-consumidores.md` · «Demo cerrada: el alta exige un código de invitación que emite Operations» | No hay pantalla en el portal ni en el lienzo. Ver faltantes: quién emite los códigos el 10/11. |
| P-S-01 | S | Ver pedidos, propuestas y su estado | Qué se pidió, dónde y en qué paso va cada pedido de la app. | sin fecha | no | `portal@3fc06e2:src/modules/solicitudes/Rutas.tsx` · «Pedidos y su estado… (pantalla que explica lo que va a aparecer)» | Solo un ítem del menú en el lienzo v3. |
| P-S-02 | S | Búsqueda manual cuando no hay oferta | Si nadie propone a tiempo, Operations busca un especialista a mano. | sin fecha | no | `portal@3fc06e2:docs/handy-docs/04-solicitudes-y-reclamos.md` · «Si falta oferta, Operations busca a mano» |  |
| P-S-03 | S | Pagos reportados (seguimiento, sin manejar dinero) | Ver si el usuario reportó que pagó; Handyx no recibe ni distribuye ese dinero. | sin fecha | no | `portal@3fc06e2:src/modules/solicitudes/Rutas.tsx` · «Pagos reportados… Handy no recibe ni distribuye ese dinero: el pago es directo entre las personas» |  |
| P-S-04 | S | Cancelar un trabajo como Operations | Intervenir un trabajo agendado o en curso. | sin fecha | no | `specialist-fe@f7c0733:docs/state-machines.md` · «en_curso --> cancelado: operations» |  |
| P-R-07 | R | Adjuntos en reclamos | Sumar fotos o archivos a un reclamo. | sin fecha | no | `portal@3fc06e2:docs/modules/reclamos.md` · «Adjuntos · Fuente pendiente (almacenamiento privado no contratado)» |  |
| P-R-08 | R | Recibir los reclamos que los usuarios cargan en la app | Que los reclamos hechos desde la PWA lleguen al portal. | sin fecha | no | `client-be@fase-4-backend-conciliado:docs/auth-permissions.md` · «Operations… búsqueda manual, verificación, pagos, reclamos (Fase 4)» | Hoy los reclamos del portal viven en el backend de captación; la app del usuario tiene los suyos en otra base. No hay conexión. |
| P-K-06 | K | Atribución de pre-registros a campañas | Saber de qué campaña vino cada persona para calcular costo por pre-registro. | sin fecha | no | `landing-be@4cb77e4:docs/ops.md` · «Atribución de registros a campañas · registrosAtribuidos: null: la captura no lleva UTM (cambio de contrato con la landing)» | Todas las pantallas lo rotulan «Fuente pendiente» en lugar de inventar el número. |
| P-K-08 | K | Impresiones y clics de los anuncios | Traer alcance y clics de las plataformas de anuncios. | sin fecha | no | `portal@3fc06e2:docs/modules/campanas.md` · «Impresiones y clics · fuente pendiente: Meta/Google/LinkedIn Ads» |  |
| P-H-04 | H | Retención de clientes de la app | Cohortes de uso de usuarios y especialistas con cuenta. | sin fecha | no | `portal@3fc06e2:docs/modules/cohortes.md` · «qué pasa con «retención de clientes» (PWA, fuentesPendientes: ["pwa"])» | Hoy las cohortes miden el contacto de pre-registros, no la retención de clientes. |
| P-M-06 | M | Dónde se piden trabajos y reclamos por barrio | Ubicar pedidos y reclamos en el mapa. | sin fecha | no | `MapaInicio.dc.html` · «Dónde se piden trabajos · Fuente pendiente» |  |
| P-X-03 | X | Consultar el registro de actividad desde el portal | Ver la actividad del equipo en el Inicio o en una pantalla. | sin fecha | no | `landing-be@4cb77e4:docs/ops.md` · «audit:read (consultar la auditoría) · No expuesto; la auditoría se escribe» |  |
| P-X-07 | X | Backend propio del portal | Una API interna nueva para tareas, legal, legajos, archivos, atribución, mapa por barrio y preferencias. | sin fecha | no | `portal@3fc06e2:docs/adr/ADR-0004-backend-handy-internal-be.md` · «status: propuesta… handy-internal-be pasa a ser la única API del portal» | No se pudo acceder a ese repositorio desde esta sesión. |

¹ Sin verificar: el frontend v2 se publicó desde `main` el 07/11 (workflow de publicación del portal, ejecución manual con éxito sobre 3fc06e2); el backend de captación y CRM figura «nada desplegado» en su handoff (29/10, 02/11); no hay uso real confirmado. La red a los dominios está bloqueada desde este entorno.

## 4. Recorridos de punta a punta

R1 «Entrar y primer día» queda afuera a propósito: su contenido es el mecanismo de ingreso y usa tableros con personajes no permitidos.

### P-RC-02 · Empezar el día

- **Necesidad:** Saber qué no puede esperar a mañana.
- **Acción:** Abre Inicio, lee «Para hoy» y toca cada pastilla.
- **Qué hace Handyx:** Junta reclamos graves, personas sin contactar hace más de 48 h, papeles que vencen y tickets propios, y lleva a cada lista ya filtrada.
- **Resultado:** Lo urgente resuelto primero y la semana a la vista.
- **Estado:** Diseñado (v3); la bandeja del día existe en código v2 (Construido) y los bloques de Tareas y Legal corren con muestra (En pruebas)
- **Captura principal:** `S/capturas/portal/recortes/Inicio-para-hoy.png`
- **Pasos:** 1. Inicio: Inicio · Para hoy: 12 cosas, separadas en reclamos graves, gente sin contactar y papeles que vencen. → 2. Reclamos: Toca «3 reclamos graves»: llega a Reclamos con la columna Para hoy adelante. → 3. Preregistros: Vuelve y toca «7 sin contactar»: la lista viene filtrada, los más viejos primero. → 4. Legal: Toca «2 papeles vencen»: Legal abre en Resumen con un botón por cosa. → 5. Ticket: Desde «Tus tickets» entra directo al ticket.

### P-RC-03 · Contactar a un pre-registro

- **Necesidad:** Que nadie que se anotó quede esperando sin respuesta.
- **Acción:** Filtra los que esperan, abre la ficha, asigna, abre WhatsApp y registra el resultado.
- **Qué hace Handyx:** Ordena por antigüedad, propone el siguiente paso, abre WhatsApp sin mensaje automático y guarda el resultado en el historial.
- **Resultado:** Cada contacto con su próximo paso y su historia; se pasa al siguiente sin volver atrás.
- **Estado:** Construido en v2 (lista, ficha y contacto guiado); el flujo v3 con responsable y origen por campaña es Diseñado
- **Captura principal:** `S/capturas/portal/recortes/Ficha-sin-contacto.png`
- **Pasos:** 1. Preregistros: Pestaña Especialistas, tarjeta «Sin contactar +48 h» y filtro de barrio. → 2. Ficha: Ficha: siguiente paso en amarillo y responsable con la carga de cada uno. → 3. Docs: Si hay dudas, abre la guía «Cómo contactar a un pre-registro». → 4. Ficha: «Hecho, registrar»: queda en el historial y pasa a la siguiente persona.

### P-RC-04 · Responder un reclamo

- **Necesidad:** Que lo grave se atienda hoy y que todos los reclamos tengan respuesta.
- **Acción:** Entra desde Inicio, trabaja la columna de hoy, responde y cambia el estado.
- **Qué hace Handyx:** Ordena por vencidos, gravedad y plazo; calcula el plazo solo; exige escribir la resolución; lo que no se resuelve pasa a un ticket.
- **Resultado:** Reclamos cerrados dentro del plazo y con su historia.
- **Estado:** Construido en v2 (lista, plazos, ficha, alta); la vista por columnas y el paso a ticket son Diseñado
- **Captura principal:** `S/capturas/portal/Reclamos.png`
- **Pasos:** 1. Inicio: El bloque de Reclamos muestra los tres que vencen primero. → 2. Reclamos: Por plazo: Para hoy, En 2 días y En 3 días, con barra de tiempo restante. → 3. Reclamos: Vista Lista para buscar uno puntual. → 4. Ticket: Lo que no se resuelve en el reclamo pasa a Tareas.

### P-RC-05 · Trabajar un ticket del equipo

- **Necesidad:** Saber quién hace qué y para cuándo.
- **Acción:** Mira el sprint, filtra lo propio, abre el ticket, tacha subtareas y lo mueve.
- **Qué hace Handyx:** Muestra el avance del sprint, vincula el ticket con los pre-registros o reclamos que lo originan y avisa a quien revisa.
- **Resultado:** Trabajo interno ordenado y visible para todo el equipo.
- **Estado:** En pruebas (código v2 solo con datos de muestra); vistas Mis tareas y menciones: Diseñado
- **Captura principal:** `S/capturas/portal/Tareas.png`
- **Pasos:** 1. Tareas: Tablero del sprint: Por hacer, En curso, En revisión y Hecho. → 2. Tareas: Mis tareas: solo los tickets propios, lo de hoy arriba. → 3. Ticket: Ticket con descripción, vínculo, subtareas y comentarios. → 4. Tareas: Pasa a «En revisión» y la barra del sprint avanza.

### P-RC-06 · Leer el mapa por barrio

- **Necesidad:** Decidir dónde buscar especialistas o hacer campañas.
- **Acción:** Elige una pregunta, mira el mapa, toca un barrio y actúa.
- **Qué hace Handyx:** Pinta los barrios reales del Partido según la pregunta, oculta los grupos de menos de 5 y ofrece ver especialistas o crear una campaña para ese barrio.
- **Resultado:** Una decisión territorial con fuente y período.
- **Estado:** Diseñado (v3); geometría real Construida; capas por barrio En pruebas (el alta no guarda barrio)
- **Captura principal:** `S/capturas/portal/recortes/Mapa-mapa-y-barrio.png`
- **Pasos:** 1. MapaInicio: ¿Qué querés ver? Cinco preguntas, cada una dice si ya tiene datos. → 2. Mapa: Mapa de la cobertura, panel del barrio y tabla paginada. → 3. Preregistros: «Ver especialistas de Centro»: la lista llega filtrada. → 4. Campana: O «Crear campaña para este barrio».

### P-RC-07 · Medir una campaña

- **Necesidad:** Saber si la plata de marketing trae gente y dónde se pierde.
- **Acción:** Abre el panel de la campaña, lee el veredicto y revisa embudo, piezas y aprendizajes.
- **Qué hace Handyx:** Responde «¿está funcionando?», muestra el embudo de anuncio a alta y qué pieza y día rinden más, y guarda lo aprendido firmado.
- **Resultado:** Qué repetir y qué cortar en la próxima campaña.
- **Estado:** En pruebas (panel solo con muestra: falta la atribución desde la landing); versión v3: Diseñado
- **Captura principal:** `S/capturas/portal/recortes/Campana-embudo.png`
- **Pasos:** 1. Campana: Veredicto y embudo. → 2. Campana: Piezas, redes y días: qué pieza trajo más gente y qué día funciona mejor. → 3. Campana: Aprendizajes: funcionó, a mejorar e hipótesis. → 4. Docs: Para la próxima pieza, abre la Guía 10 en Docs.

### P-RC-08 · Leer las cohortes

- **Necesidad:** Saber si el equipo atiende mejor a quienes llegan ahora que a los de antes.
- **Acción:** Entra a Cohortes, elige qué medir y lee la tabla con la lectura guiada.
- **Qué hace Handyx:** Agrupa por fecha de llegada, sigue cada grupo semana a semana, marca lo que todavía no maduró y lo traduce a tres frases.
- **Resultado:** Detectar grupos que se perdieron y actuar sobre ellos.
- **Estado:** Construido (matriz semanal); por mes, curvas y lectura guiada En pruebas; explicación v3 Diseñado
- **Captura principal:** `S/capturas/portal/recortes/Cohortes-tabla.png`
- **Pasos:** 1. Inicio: El número «¿Contactamos a tiempo?» despierta la pregunta. → 2. Cohortes: Qué es una cohorte en 3 pasos, qué medir, tabla y lectura guiada. → 3. Preregistros: Para actuar: vuelve a la lista de los que esperan y crea un ticket.

### P-RC-09 · Leer y crear un doc

- **Necesidad:** Que todo el equipo haga las cosas de la misma manera.
- **Acción:** Busca en la biblioteca, lee en el modal y genera un doc nuevo con ayuda de una IA.
- **Qué hace Handyx:** Ordena guías por categoría, las muestra completas y valida lo que escribe la IA antes de publicarlo.
- **Resultado:** Procesos escritos, versionados y a mano.
- **Estado:** Construido en v2 (biblioteca, editor, versiones); modal y generador desde IA: Diseñado
- **Captura principal:** `S/capturas/portal/Docs.png`
- **Pasos:** 1. Docs: Biblioteca con buscador y categorías. → 2. Docs: Lectura en el modal con índice. → 3. DocsJson: Generar desde JSON: instrucciones para la IA, validación y vista previa. → 4. Docs: Doc publicado con versión 1 y autor.

### P-RC-10 · Poner al día Legal y Compliance

- **Necesidad:** Que la empresa y quienes trabajan en domicilios tengan los papeles al día.
- **Acción:** Resuelve lo urgente desde Resumen y revisa Empresa y Personas.
- **Qué hace Handyx:** Ordena por vencimiento, ofrece la acción concreta de cada fila y marca qué especialista no puede tomar trabajos por un requisito faltante.
- **Resultado:** Nada vence sin aviso; ningún especialista sin requisitos toma trabajos.
- **Estado:** En pruebas (documentos y legajos solo con muestra); las tres vistas v3: Diseñado
- **Captura principal:** `S/capturas/portal/Legal.png`
- **Pasos:** 1. Inicio: El bloque de Legal muestra lo que vence esta semana. → 2. Legal: Resumen: tres cosas de la semana con su botón y cuatro contadores. → 3. Legal: Personas: requisitos de cada especialista y si puede trabajar. → 4. Legal: Empresa: sociedad, seguros y privacidad con estado y vencimiento.

### P-RC-11 · Pedir ayuda en cualquier pantalla

- **Necesidad:** Que alguien nuevo aprenda el portal sin depender de otra persona.
- **Acción:** Toca «?» en la pantalla en la que está o abre la Guía del portal.
- **Qué hace Handyx:** Ilumina cada parte de la pantalla con un ejemplo del día a día y lleva de la guía al módulo.
- **Resultado:** Equipo autónomo; se suma gente sin capacitaciones largas.
- **Estado:** Diseñado
- **Captura principal:** `S/capturas/portal/Tour.png`
- **Pasos:** 1. Inicio: Todas las pantallas tienen el «?» en el mismo lugar. → 2. Tour: Recorrido de esa pantalla, con el mismo spotlight del primer día. → 3. Guia: Guía del portal: anatomía, módulo por módulo y glosario. → 4. Preregistros: «Ir a Pre-registros»: de la guía al trabajo.

## 5. Arquitectura del ecosistema (para la sección 3)

Nivel de capacidades: qué información fluye. Sin mecanismos, proveedores ni direcciones.

```text
                 VECINOS Y ESPECIALISTAS
                          │ se anotan (nombre, WhatsApp, ciudad, rubro, consentimiento)
                          ▼
   ┌──────────────────────────────┐   contador público (cota inferior, desde 20)
   │  LANDING (pública)           │◄──────────────────────────────┐
   └──────────────┬───────────────┘                               │
                  │ pre-registro                                  │
                  ▼                                               │
   ┌──────────────────────────────────────────────────────────┐   │
   │  BACKEND DE CAPTACIÓN Y CRM                               ├───┘
   │  pre-registros cifrados · seguimiento · importaciones ·  │
   │  campañas y gasto · reclamos · docs · métricas agregadas │
   │  registro de actividad · retención 12 meses              │
   └──────────────▲───────────────────────────────────────────┘
                  │ lee y escribe (solo el equipo, por permisos)
   ┌──────────────┴───────────────────────────────────────────┐
   │  PORTAL INTERNO (equipo Handyx)                           │
   │  Inicio · Pre-registros · Reclamos · Campañas · Cohortes ·│
   │  Mapa · Docs · [Tareas · Legal · Legajos: datos de muestra]│
   └──────────────┬───────────────────────────────────────────┘
                  ┆ PENDIENTE (sin contrato todavía: «fuente pendiente»)
                  ┆ pedidos · propuestas · búsqueda manual · pagos reportados ·
                  ┆ verificación de especialistas · reclamos de la app · invitaciones
                  ▼
   ┌──────────────────────────┐        ┌──────────────────────────────┐
   │  PWA DEL USUARIO + su API │◄──────►│  PWA DEL ESPECIALISTA + su API │
   │  pedidos, trabajos, chat, │ base   │  alta, documentos, agenda,     │
   │  pagos reportados,        │ común  │  propuestas, cobro directo     │
   │  reclamos                 │ de la  │                                │
   └──────────────────────────┘ app    └──────────────────────────────┘
        │  el usuario paga directo al especialista (Mercado Pago o efectivo):
        │  el dinero no pasa por Handyx ni por el portal
        ▼
   ESPECIALISTA

   PROPUESTO (sin código accesible): backend propio del portal para tareas, legal,
   legajos, archivos, atribución de campañas, mapa por barrio y preferencias.
   HOY FUERA DEL PORTAL: la verificación de especialistas (procedimiento interno del
   backend del especialista, rama sin mergear) y los derechos de las personas.
```

| De | A | Qué fluye | Estado |
|---|---|---|---|
| Landing | Backend de captación y CRM | pre-registros con consentimiento (usuario: lista de espera; especialista: contacto para el alta) | Construido; captura cerrada hasta el aviso de privacidad definitivo; backend sin desplegar al corte |
| Backend de captación y CRM | Landing | contador público como cota inferior (0 si hay menos de 20) | Construido |
| Portal | Backend de captación y CRM | seguimiento, importación, exportación sin datos personales, campañas y gasto, reclamos, docs, métricas agregadas | Construido (verificado en local) |
| Portal | Backend propio del portal (propuesto) | tareas, legal y legajos, archivos, atribución, mapa por barrio, preferencias | Concepto (el portal ya tiene las pantallas con datos de muestra) |
| Apps (PWA) | Portal | pedidos, propuestas, pagos reportados, verificación, reclamos de la app | Concepto: sin contrato de lectura |
| Operations | Backend del especialista | verificación de documentos y alta | En pruebas en una rama, fuera del portal |
| Pre-registro | Cuenta de la app | no hay migración automática: el pre-registro no es una cuenta | regla de diseño |

## 6. Índice del Dossier 04 (17 secciones)

| Sección | Funciones que la cubren | Capturas | Huecos |
|---|---|---|---|
| 1. Portada | — | `Inicio-sin-sidebar.png`<br>`Sidebar-sin-usuario.png` | Evitar Main (grupo de personajes y notas de trabajo). Rotular «Diseño propuesto · datos ficticios». |
| 2. La importancia de la infraestructura operativa | P-I-01, P-X-06, P-X-02, P-A-06 | `Bienvenida-modulos.png` | No hay datos de uso real del portal ni del tamaño del equipo: el texto tiene que hablar de capacidades, no de volumen. |
| 3. Arquitectura general del ecosistema | P-X-07, P-C-15, P-S-01, P-E-02 | — | Diagrama en «arquitectura». Falta confirmar si el portal publicado ya habla con un backend desplegado y cuándo existirá el contrato con las apps. |
| 4. Gestión de clientes | P-C-01, P-C-02, P-C-04, P-C-05, P-C-06, P-C-07, P-C-08, P-C-12, P-C-13, P-C-14, P-C-15, P-C-16 | `Preregistros.png`<br>`MOCK-preregistros_usuarios-1280.jpg` | El portal gestiona la lista de espera, no clientes con cuenta: la gestión de usuarios de la app es Concepto. No hay invitaciones en el portal. |
| 5. Gestión de profesionales | P-C-01, P-C-05, P-C-09, P-C-13, P-E-01, P-E-02, P-E-03, P-E-04, P-E-05 | `Ficha-sin-contacto.png`<br>`RC-Preregistros.png`<br>`MOCK-preregistros_especialistas-1280.jpg` | La verificación no tiene pantalla en el portal; los legajos solo corren con muestra; hay contradicciones sobre antecedentes y sobre la comisión al especialista. |
| 6. Supervisión de operaciones | P-I-01, P-I-02, P-I-05, P-I-07, P-R-01, P-F-03 | `Inicio-para-hoy.png`<br>`RC-Inicio.png` | Sin pedidos ni trabajos de las apps, la supervisión cubre contacto, reclamos y papeles, no la operación de servicios. |
| 7. Seguimiento de trabajos | P-S-01, P-S-02, P-S-03, P-S-04 | `MOCK-solicitudes-1280.jpg` | Hueco mayor: todo es Concepto. Ojo: «Tareas» son tickets internos del equipo, no trabajos de clientes; no mezclarlos. |
| 8. Administración comercial | P-K-01, P-K-02, P-K-03, P-K-04, P-K-05, P-K-06, P-K-07, P-K-08 | `Campana-embudo.png`<br>`RC-Campana.png` | Sin atribución no hay costo por pre-registro real. Moneda del presupuesto en discusión (USD en el lienzo y en la decisión del 07/11; pesos en el backend). |
| 9. Gestión de transacciones y comisiones | P-S-03, P-X-05, P-K-01 | — | El portal no procesa pagos ni cobra comisiones. Lo que muestra o planea: (1) Configuración y Handy Docs registran la política de la demo (tarifa de Handyx del 0 % para usuario y especialista del 10/11 al 10/12, sin descuento sobre el precio del especialista; después, «sin tarifa aprobada: no se cobra nada automáticamente»); (2) Solicitudes promete, cuando exista el contrato, «pagos reportados» con la aclaración «Handy no recibe ni distribuye ese dinero: el pago es directo entre las personas»; (3) Reclamos tiene la categoría «Pago» (cobro distinto al presupuesto); (4) Campañas registra gasto de marketing. No hay pantalla de comisiones, liquidaciones ni facturación en el código ni en el lienzo. Falta saber cómo cobrará Handyx su tarifa cuando exista y cuál es la tarifa al especialista (fuentes contradictorias). Recomendación: titular la sección como «Pagos entre personas y política de tarifas» y declarar que el portal no maneja dinero. |
| 10. Incidencias y soporte | P-R-01, P-R-02, P-R-03, P-R-04, P-R-05, P-R-06, P-R-07, P-R-08, P-D-04 | `Reclamos.png`<br>`RC-Reclamos.png` | Los reclamos que el usuario carga en la app no llegan al portal; sin adjuntos. Reemplazar los textos de ejemplo sensibles (pérdida de gas). |
| 11. Analítica y métricas | P-I-03, P-I-04, P-K-04, P-X-04, P-X-05, P-X-06 | `Inicio-semana.png` | Ninguna métrica real disponible (captura cerrada, backend sin desplegar). Mostrar el método (denominador, fuente, «sin dato») y no los números. |
| 12. Cohortes y retención | P-H-01, P-H-02, P-H-03, P-H-04 | `Cohortes-tabla.png`<br>`RC-Cohortes.png` | Las cohortes miden contacto de pre-registros; la retención de clientes de la app es Concepto. Las filas junio–noviembre son ficticias y parecen tracción. |
| 13. Mapas y actividad territorial | P-M-01, P-M-02, P-M-03, P-M-04, P-M-05, P-M-06 | `mapa-partido-geometria-osm.png`<br>`MapaInicio-preguntas.png`<br>`Mapa-mapa-y-barrio.png` | La geografía es real; cualquier color o número encima es ficticio. Por barrio depende de que la landing pida el barrio. |
| 14. Herramientas de supervisión | P-T-01, P-T-02, P-T-03, P-T-04, P-T-05, P-D-01, P-D-02, P-D-05, P-D-06, P-L-01, P-L-02, P-F-03, P-F-04, P-X-02, P-X-03 | `Tareas.png`<br>`Docs.png`<br>`Legal.png` | Tareas y Legal corren solo con muestra; el registro de actividad se escribe pero no se puede consultar desde el portal. |
| 15. Escalabilidad | P-X-07, P-A-04, P-A-05, P-A-06, P-A-07, P-X-01, P-F-08 | `Tour.png`<br>`Bienvenida-modulos.png` | Escalan el equipo (onboarding, guía, permisos por tarea) y el modelo de datos. No hay diseño para otras ciudades: el mapa cubre solo el Partido y la importación rechaza especialistas fuera de Mar del Plata, mientras el pitch habla de «toda Buenos Aires en 3 meses» (visión a validar). |
| 16. Roadmap operativo | P-X-07, P-K-06, P-C-03, P-S-01, P-P-01 | `RC-Indice.png` | El plan v3 (4 olas) es una propuesta sin fechas que espera el OK. Dependencias externas: aviso definitivo, despliegue del backend, barrio y origen en la landing, contrato con las apps, backend propio del portal. |
| 17. Cierre | — | `mapa-ciudad-geometria-osm.png` | Sin cifras propias del portal. Cerrar con el principio «no mostramos ningún número inventado» y la invitación a recorrer la muestra rotulada. |

**Sección 9 en detalle.** El portal no procesa pagos ni cobra comisiones. Lo que muestra o planea: (1) Configuración y Handy Docs registran la política de la demo (tarifa de Handyx del 0 % para usuario y especialista del 10/11 al 10/12, sin descuento sobre el precio del especialista; después, «sin tarifa aprobada: no se cobra nada automáticamente»); (2) Solicitudes promete, cuando exista el contrato, «pagos reportados» con la aclaración «Handy no recibe ni distribuye ese dinero: el pago es directo entre las personas»; (3) Reclamos tiene la categoría «Pago» (cobro distinto al presupuesto); (4) Campañas registra gasto de marketing. No hay pantalla de comisiones, liquidaciones ni facturación en el código ni en el lienzo. Falta saber cómo cobrará Handyx su tarifa cuando exista y cuál es la tarifa al especialista (fuentes contradictorias). Recomendación: titular la sección como «Pagos entre personas y política de tarifas» y declarar que el portal no maneja dinero.

## 7. Contradicciones

| Tema | A (fuente, fecha) | B (fuente, fecha) | Impacto | Pregunta |
|---|---|---|---|---|
| Publicación del portal | Publicación del frontend v2 sobre main 3fc06e2 con éxito (ejecución manual) (historial de GitHub Actions del portal, 2026-11-07 15:53 UTC) | «Despliegue… Sigue bloqueado por la carpeta del servidor»; backend de captación: «Nada desplegado» (portal@2ed5c5f:docs/v3/00-plan-v3.md · landing-be@4cb77e4:handoff.md, 2026-11-07 18:47 UTC / 2026-10-29) | No se puede afirmar en el dossier que el portal esté «en uso» ni «publicado». | ¿El portal publicado el 07/11 está conectado a un backend desplegado y alguien del equipo ya lo usa? |
| Etapas del pre-registro | Nuevo · Contactado · En seguimiento · Listo para alta (Ficha.dc.html, Preregistros.dc.html, 2026-11-07) | Especialista: pendiente de contacto → contactado → comprometido; usuario: en espera → avisado. El plan v3 dice que los contratos siguen iguales (landing-be@4cb77e4:docs/contract-delta.md · portal@2ed5c5f:docs/v3/00-plan-v3.md, 2026-10-27 / 2026-11-07) | El dossier podría describir etapas que el sistema no tiene. | ¿Las etapas v3 son solo rótulos nuevos de las mismas etapas o un cambio de contrato? |
| Oficios de ejemplo | Pintor, Pintor · Los Andes, «Otros» en el mapa (Preregistros.dc.html, RC-Legal.dc.html, 2026-11-07) | Seis rubros: Electricidad, Plomería, Gas, Cerrajería, Albañilería, Aire acondicionado (landing-fe@ac3b245:CLAUDE.md, 2026-10-29) | Capturas con un oficio que la landing no ofrece. | ¿Se reemplazan los ejemplos por los seis rubros vigentes? |
| Moneda del presupuesto de marketing | Presupuesto: 100 USD; costo c/u ≈ 0,6 USD; «US$ 100 por mes» en la Guía 10 y el asistente (Campana.dc.html · portal@8ea1c63, 2026-11-07) | Importes en centavos enteros, moneda fija ARS; Handy Docs: importes en pesos enteros; regla editorial: montos en pesos (landing-be@4cb77e4:docs/ops.md · portal@3fc06e2:docs/handy-docs/05-campanas.md · consigna-ola-1.md, 2026-11-02 / 2026-11-07) | Montos en dólares en capturas y un backend que solo guarda pesos. | ¿El presupuesto de marketing se fija en dólares o en pesos? |
| Antecedentes penales como archivo | «Antecedentes nunca como archivo» (specialist-fe@f7c0733:CLAUDE.md, 2026-11-07) | Legajos con antecedentes dentro de los 7 días y visor de documentos de personas; «Antecedentes penales por foto o PDF (decisión de Ignacio del 08/11/2026)» (portal@8ea1c63 · specialist-be@cf3b39d:CLAUDE.md, 2026-11-07 (el commit cita una decisión con fecha 08/11)) | Afecta cómo se presenta la verificación y el cuidado de datos sensibles. | ¿Cuál es la regla vigente y por qué el commit del 07/11 cita una decisión del 08/11? |
| Comisión al especialista | 10 % al cliente y 10 % al especialista; primer mes sin tarifa; camada fundadora 5 % (landing-fe@ac3b245:CLAUDE.md, 2026-10-29) | «Handyx no le cobra comisión al especialista, nunca (decisión del 08/11/2026)»; portal: después del 10/12 «sin tarifa aprobada» (specialist-be@cf3b39d:CLAUDE.md · portal@3fc06e2:src/ops/sources.ts, 2026-11-07) | Sección 9 del dossier y coherencia con el Dossier 01. | ¿Qué tarifa se cobra a cada parte después de la demo y cómo se cobra si el dinero no pasa por Handyx? |
| Retención de datos | Pre-registros 12 meses calendario, purga real (aviso 04-A); la ficha muestra «Se vence noviembre de 2027» (landing-be@4cb77e4:CLAUDE.md · Ficha.dc.html, 2026-10-27 / 2026-11-07) | «Sin purga: no se borra ningún dato vencido… hay que alinear el aviso o reactivar la purga» (landing-be@4cb77e4:handoff.md (decisión del 02/11), 2026-11-02) | No se puede prometer en el dossier el borrado a los 12 meses. | ¿Se reactiva la purga o se cambia el aviso antes de octubre de 2027? |
| Plazos de reclamos | Crítica y alta hoy, media 2 días, baja 3 días (Reclamos.dc.html · portal@3fc06e2:docs/modules/reclamos.md, 2026-11-07) | «No hay plazos comerciales inventados»; la captura MOCK de Reclamos dice «[A CONFIRMAR: plazos de respuesta por gravedad]» (portal@3fc06e2:docs/handy-docs/04-solicitudes-y-reclamos.md · docs/capturas-v2/MOCK-reclamos-1280.jpg, anterior al 07/11) | La guía del equipo y una captura del código quedaron viejas. | ¿Se actualizan la Guía 04 y las capturas MOCK con la decisión del 07/11? |
| Error del bloque de reclamos en Inicio | Cada bloque carga por separado; regresión total con 0 problemas (portal@3fc06e2:docs/handoff.md · docs/modules/inicio.md, 2026-11-07) | «Causa encontrada… falla con e.getTime is not a function. Pasa también con backend real» (portal@2ed5c5f:docs/v3/00-plan-v3.md, 2026-11-07) | El bloque de reclamos del Inicio publicado puede fallar. | ¿Se corrige antes de mostrar el portal a terceros? |
| Dónde se verifica a los especialistas | «handy-internal-portal · Futuro consumidor de la revisión de Operations» (specialist-fe@f7c0733:docs/plan.md, 2026-11-07) | «la ÚNICA vía para verificar documentos… desde un proceso privado»; el portal no tiene pantalla de verificación (specialist-be@cf3b39d:src/services/operaciones.service.ts, 2026-11-07) | El dossier no puede mostrar la verificación como función del portal. | ¿La verificación pasa al portal? ¿Cuándo? |
| Presentaciones | Módulo Presentations en código, registrado en el menú v2 (portal@3fc06e2:docs/modules/presentaciones.md, 2026-11-07) | «Eliminar Presentaciones · Fuera del menú por ahora» (Main.dc.html, 2026-11-07) | Una función construida que no conviene presentar. | ¿Queda sin rutas o se borra (decisión 2 del plan v3)? |
| Nombre del dominio del portal | internal.handyc.com (workflow de publicación del portal (portal@3fc06e2) · runbook de despliegue del backend (landing-be@4cb77e4), 2026-11-02) | interno.handyc.com (client-be@fase-4-backend-conciliado:docs/architecture.md, 2026-11-02) | Menor (documentación). No publicar el dominio en el dossier. | ¿Se corrige la documentación del backend del usuario? |
| Tecnología de las apps según el portal | «Las apps de usuario y especialista son React Native bare» (portal@3fc06e2:docs/architecture/system.md, 2026-10-10) | Las apps son PWA con exportación estática (handyx-specialist-fe y handyx-client-fe CLAUDE.md, 2026-11-07) | Documento de arquitectura del portal desactualizado. | ¿Se actualiza system.md? |
| Tracción aparente en las muestras | Especialistas 86 · Usuarios 44; cohortes junio–noviembre de 38 a 73 personas; 41 especialistas en 7 días (Preregistros.dc.html, Cohortes.dc.html, Campana.dc.html (ficticio), 2026-11-07) | 56 especialistas registrados «no mostrar hasta conciliar»; la captura de la landing está cerrada hasta el aviso definitivo (pitch-afirmaciones (ESP-REGISTRADOS) · landing-fe@ac3b245:src/config.ts, 2026-11-04 / 2026-10-29) | Un inversor puede leer las cifras de muestra como reales y contrastarlas con el pitch. | ¿Se reemplazan las cifras por marcadores neutros o se rotulan en cada captura? |

## 8. Faltantes

| Dato | Para | Pregunta |
|---|---|---|
| Uso real del portal | dossier 04 · 1, 2 y 16 | ¿Alguien del equipo usa hoy el portal con datos reales? ¿Desde cuándo y cuántas personas? |
| Despliegue del backend de captación y apertura de la captura | dossier 04 · 3 y 16 | ¿Cuándo se despliega el backend y se publica el aviso de privacidad definitivo para abrir la captura? |
| Aprobación y calendario del plan v3 | dossier 04 · 16 | ¿Aprobaste el plan v3 y las 4 decisiones de su §5? ¿Con qué fechas? |
| Backend propio del portal | dossier 04 · 3, 15 y 16 | ¿Existe código de handy-internal-be? (no fue accesible desde esta sesión) |
| Invitaciones de la demo cerrada | dossier 04 · 4 | ¿Quién y con qué herramienta emite los códigos de invitación desde el 10/11, si el portal no tiene esa pantalla? |
| Contrato de lectura con las apps | dossier 04 · 6, 7 y 10 | ¿Cuándo podrá el portal ver pedidos, propuestas, pagos reportados y reclamos de las apps? |
| Verificación de especialistas el 10/11 | dossier 04 · 5 | ¿Dónde y cómo verifica Operations a los especialistas en el lanzamiento? |
| Cobro de la tarifa de Handyx | dossier 04 · 9 | Si el dinero va directo al especialista, ¿cómo cobrará Handyx su tarifa y qué mostrará el portal? |
| Los 56 especialistas registrados | dossier 04 · 5 y 11 | ¿Dónde están esos registros? ¿Se importan al CRM (quedarían como «importados», sin consentimiento)? |
| Barrio y origen en la captura | dossier 04 · 8 y 13 | ¿Se suman barrio y origen de campaña al formulario de la landing? ¿Cuándo? |
| Equipo y roles reales | dossier 04 · 2 y 15 | ¿Qué funciones existen hoy (Operaciones, Crecimiento, Soporte, Dirección) y cuántas personas hay? Las de las capturas son ficticias. |
| Estado legal real de la empresa | dossier 04 · 14 (y dossier 01) | ¿Handyx está constituida? ¿Seguros y registro de bases de datos están vigentes? Las capturas de Legal muestran ejemplos que pueden leerse como faltas reales. |
| Expansión territorial en la operación | dossier 04 · 15 | ¿Hay plan para operar otras ciudades desde el portal? Hoy el mapa es solo el Partido y la importación rechaza especialistas de otras ciudades. |
| Personajes de las piezas de marketing | dossier 04 · 8 | ¿Qué personajes usan las 12 piezas del pack? (no revisado en esta ola) |

## 9. Capturas recomendadas

Recortes nuevos en `S/capturas/portal/recortes/` (generados con PIL desde las PNG del lienzo; los dos mapas se dibujaron desde `src/modules/mapa/barrios.geo.json` de `main`, sin datos). Capturas del código v2 exportadas de `main` a `S/repos/portal-capturas-v2/docs/capturas-v2/`.

| PNG | Uso | Rótulo | Recorte | px | Personajes | Riesgos | Motivo |
|---|---|---|---|---|---|---|---|
| `S/capturas/portal/recortes/Inicio-para-hoy.png` | dossier 04 · 6. Supervisión de operaciones | Diseño propuesto · Muestra · datos ficticios | Inicio.png (604,140,2212,930) | 2212×930 | llave | cifra/nombre de muestra que puede leerse como real (12, 3, 7, 2; «Buen día, Lucía»; HND-54) | Resume la idea del portal en un bloque: lo urgente primero, cada número lleva a la lista. |
| `S/capturas/portal/recortes/Inicio-semana.png` | dossier 04 · 11. Analítica y métricas | Diseño propuesto · Muestra · datos ficticios | Inicio.png (604,1948,2212,438) | 2212×438 | — | cifra/nombre de muestra que puede leerse como real (38, 64 %, 11 de 14); dejar visible «Sin dato · Fuente pendiente»: es el mensaje | Muestra el método: pregunta, número, comparación, fuente y «sin dato» en lugar de inventar. |
| `S/capturas/portal/recortes/Inicio-sin-sidebar.png` | dossier 04 · 1. Portada (alternativa: 6) | Diseño propuesto · Muestra · datos ficticios | Inicio.png (545,0,2335,2926) | 2335×2926 | llave | cifra/nombre de muestra que puede leerse como real; reclamo «Pérdida de gas sin resolver» y «Antecedentes de Marina R.» visibles | Pantalla completa sin el pie del menú con el nombre de la persona. |
| `S/capturas/portal/Preregistros.png` | dossier 04 · 4. Gestión de clientes | Diseño propuesto · Muestra · datos ficticios | — | 2880×2320 | — | cifra/nombre de muestra que puede leerse como real (86, 44, siete nombres y apellidos); oficio «Pintor» fuera de los seis rubros | La lista explica sola la pregunta «¿a quién contactamos hoy?». |
| `S/capturas/portal/recortes/Ficha-sin-contacto.png` | dossier 04 · 5. Gestión de profesionales | Diseño propuesto · Muestra · datos ficticios | Ficha.png (576,50,2304,1690) | 2304×1690 | llave | cifra/nombre de muestra que puede leerse como real (Marina Rodríguez, Lucía Ferrer, Tomás Méndez, Carla Aguirre); «Gasista matriculada» en el historial: tapar | Ficha con siguiente paso, historial y responsable; el recorte deja afuera el bloque de datos de contacto. |
| `S/capturas/portal/Reclamos.png` | dossier 04 · 10. Incidencias y soporte | Diseño propuesto · Muestra · datos ficticios | — | 2880×2320 | — | cifra/nombre de muestra que puede leerse como real; reclamos de ejemplo graves («Pérdida de gas…», «Cobro duplicado en el pago») que pueden leerse como incidentes reales | La regla de plazos por gravedad está a la vista. |
| `S/capturas/portal/Tareas.png` | dossier 04 · 14. Herramientas de supervisión | Diseño propuesto · Muestra · datos ficticios | — | 2880×2320 | — | cifra/nombre de muestra que puede leerse como real (sprint 14, 9 de 20; iniciales del equipo, incluida la de Ignacio) | Tablero tipo Jira legible de un vistazo. |
| `S/capturas/portal/recortes/MapaInicio-preguntas.png` | dossier 04 · 13. Mapas y actividad territorial | Diseño propuesto | MapaInicio.png (576,440,2284,1400): deja afuera la canilla | 2284×1400 | — | los mini mapas de cada pregunta son ilustrativos | Explica que el mapa responde preguntas y dice cuándo la fuente está pendiente. |
| `S/capturas/portal/recortes/Mapa-mapa-y-barrio.png` | dossier 04 · 13. Mapas y actividad territorial | Diseño propuesto · Muestra · datos ficticios | Mapa.png (606,434,2212,1950) | 2212×1950 | — | cifra/nombre de muestra que puede leerse como real (34 especialistas en Centro, oficios); título «Especialistas activos»: no hay especialistas activos antes del 10/11; la forma de los barrios del lienzo es esquemática; la real es la del recorte OSM | Mapa + panel del barrio con las dos acciones. |
| `S/capturas/portal/recortes/mapa-partido-geometria-osm.png` | dossier 04 · 13 (y 15) | Geografía real · OpenStreetMap (ODbL) · sin datos | — | 2400×3157 | — | mantener la atribución «© colaboradores de OpenStreetMap» | Única imagen del portal sin datos ficticios: la geometría real de 130 zonas que usa el código. |
| `S/capturas/portal/recortes/mapa-ciudad-geometria-osm.png` | dossier 04 · 17. Cierre (o 13) | Geografía real · OpenStreetMap (ODbL) · sin datos | — | 2400×3420 | — | mantener la atribución | Zona urbana de Mar del Plata, apta como fondo editorial. |
| `S/capturas/portal/recortes/Campana-embudo.png` | dossier 04 · 8. Administración comercial | Diseño propuesto · Muestra · datos ficticios | Campana.png (560,840,2300,1120): deja afuera presupuesto en USD y veredicto | 2300×1120 | — | cifra/nombre de muestra que puede leerse como real (3.200, 410, 41, 28, 9); «Matrícula verificada» como subtítulo: tapar o reescribir | Embudo con lectura accionable, sin los montos en dólares. |
| `S/capturas/portal/recortes/Cohortes-tabla.png` | dossier 04 · 12. Cohortes y retención | Diseño propuesto · Muestra · datos ficticios | Cohortes.png (560,1020,2300,1180) | 2300×1180 | — | cifra/nombre de muestra que puede leerse como real (meses junio–noviembre con 38 a 73 personas: parece tracción) | Tabla clara con celdas que no maduraron rayadas. |
| `S/capturas/portal/Docs.png` | dossier 04 · 14. Herramientas de supervisión | Diseño propuesto · Muestra · datos ficticios | — | 2880×2200 | — | cifra/nombre de muestra que puede leerse como real (autoras y fechas); requisitos del especialista en un doc de ejemplo (en contradicción) | Biblioteca y lectura en modal; transmite procesos escritos. |
| `S/capturas/portal/Legal.png` | dossier 04 · 14 (o 5) | Diseño propuesto · Muestra · datos ficticios | — | 2880×2840 | — | cifra/nombre de muestra que puede leerse como real (31 al día, 1 no puede trabajar); «Antecedentes penales de Marina Rodríguez» y «Constancia de monotributo de Julián Pereyra»: nombres + dato sensible; «Renovar el seguro de responsabilidad civil»: puede leerse como situación real de la empresa | Resumen con acción por fila; usar solo con nombres tapados. |
| `S/capturas/portal/recortes/Bienvenida-modulos.png` | dossier 04 · 2 (y 15) | Diseño propuesto | Bienvenida.png (230,1200,2420,780): deja afuera el grupo de personajes | 2420×780 | — | — | Los nueve módulos explicados en una línea cada uno. |
| `S/capturas/portal/Tour.png` | dossier 04 · 15. Escalabilidad | Diseño propuesto · Muestra · datos ficticios | — | 2880×1800 | — | cifra/nombre de muestra que puede leerse como real (Lucía Ferrer en el menú) | Recorrido guiado: el equipo aprende solo. |
| `S/capturas/portal/recortes/Sidebar-sin-usuario.png` | dossier 04 · 1 o 3 (mapa de módulos) | Diseño propuesto | Sidebar.png (0,0,816,2520) | 816×2520 | — | contadores de muestra (12, 3, 5, 2) | Menú con los módulos agrupados por tarea. |
| `S/capturas/portal/RC-Indice.png` | dossier 04 · 16. Roadmap operativo (o anexo) | Diseño propuesto | — | 3616×2000 | — | — | Los 11 recorridos en una página. |
| `S/capturas/portal/RC-Preregistros.png` | dossier 04 · 5 (recorrido) | Diseño propuesto · Muestra · datos ficticios | — | 3616×4200 | — | cifra/nombre de muestra que puede leerse como real; datos de contacto de muestra en la miniatura de la ficha | Recorrido completo con onboarding. |
| `S/repos/portal-capturas-v2/docs/capturas-v2/MOCK-preregistros_especialistas-1280.jpg` | dossier 04 · 4 o 5 («así es hoy en código») | Pantalla del portal v2 en código · Muestra · datos ficticios | — | 1280×800 | — | cifra/nombre de muestra que puede leerse como real | Prueba que la lista existe en código, distinta del diseño v3. |
| `S/repos/portal-capturas-v2/docs/capturas-v2/MOCK-inicio-1280.jpg` | dossier 04 · 6 («así es hoy en código») | Pantalla del portal v2 en código · Muestra · datos ficticios | — | 1280×800 | — | cifra/nombre de muestra que puede leerse como real; reclamos de ejemplo sobre conducta y pagos | Inicio real del código con rótulo de muestra visible. |
| `S/repos/portal-capturas-v2/docs/capturas-v2/MOCK-solicitudes-1280.jpg` | dossier 04 · 7. Seguimiento de trabajos | Pantalla del portal v2 en código · fuente pendiente | — | 1280×800 | — | — | Muestra honestamente que los trabajos todavía no llegan al portal. |

**Capturas a evitar:** Main (personajes y notas de trabajo), Login y RC-Acceso (mecanismo de ingreso, personajes), Guia sin tapar el glosario, MOCK-reclamos (texto «[A CONFIRMAR]» viejo), MOCK-legal_documentos y MOCK-tareas (detalles técnicos y de proveedores), vista Empresa de RC-Legal.

## 10. Riesgos de publicación

| Qué | Dónde | Recomendación |
|---|---|---|
| Mecanismo de acceso (código de 6 dígitos, app autenticadora, cuentas que se crean afuera, email de ejemplo del equipo, dominio del portal) | Login.png, RC-Acceso.png, Guia.png (glosario), RC-Legal.png («Ver legajo (pide tu código)»), MOCK-legal_documentos (pedido de código) | No usar Login ni RC-Acceso; tapar la fila del glosario sobre verificación reforzada y el texto entre paréntesis del legajo. Describir solo «acceso solo para el equipo». |
| Datos de contacto de muestra con forma de dato real (WhatsApp enmascarado, email de ejemplo) y «Mostrar completo (queda registrado)» | Ficha.png, RC-Preregistros.png | Usar el recorte Ficha-sin-contacto.png; en recorridos, difuminar el bloque «Datos de contacto». |
| Nombres y apellidos ficticios (Lucía Ferrer, Tomás Méndez, Carla Aguirre, Marina Rodríguez, Julián Pereyra, Sofía Vidal…) y el nombre real de Ignacio mezclado con datos ficticios (tareas, aprendizajes, «Informó: Ignacio») | casi todos los tableros; Tareas.png, Ticket.png, RC-Campana.png, RC-Legal.png | Rótulo «Muestra · datos ficticios» en cada imagen; reemplazar o tapar «Ignacio» para no mezclar una persona real con datos inventados. |
| Cifras de muestra que parecen tracción (12 cosas para hoy, 38, 64 %, 11 de 14, 41 pre-registros, 86/44, cohortes de 38 a 73 personas, embudo 3.200 → 9, 34 especialistas en Centro) | Inicio, Mini, PasoFlujo, Onb, Preregistros, Campana, Cohortes, Mapa y todos los RC | Rotular siempre, preferir recortes que muestren el método y no el número, y no ubicarlas cerca de cifras reales del pitch. |
| Incidentes de ejemplo que pueden leerse como reales y dañar la reputación (pérdida de gas sin resolver, especialista que no se presentó, cobro duplicado) | Inicio.png, Reclamos.png, RC-Reclamos.png, RC-Inicio.png, MOCK-inicio, MOCK-reclamos | Rotular o reemplazar por textos neutros en una versión editorial; evitar el primer plano de esos títulos. |
| Situación legal de ejemplo que puede leerse como faltas reales (registro de bases de datos «Falta cargar», seguro que vence, constancia fiscal, contrato de hosting) | RC-Legal.png (vista Empresa), Legal.png, MOCK-legal_documentos-1280.jpg | No usar la vista Empresa; en Resumen tapar nombres y vencimientos. |
| Montos en dólares | Campana.png (100 USD, ≈ 0,6 USD), RC-Campana.png | Usar Campana-embudo.png; si se muestra el encabezado, tapar el presupuesto. |
| Palabras fuera de las reglas («matriculada», «Matrícula verificada», «gasista matriculado», «especialistas activos») | Ficha.png, Campana.png, Ticket.png, Mapa.png, RC-Preregistros.png | Tapar o recortar; en el texto del dossier hablar de «requisitos» y «especialistas anotados». |
| Personajes fuera de la lista (grupo, canilla, gota) | Main.png, Login.png, Bienvenida.png (grupo); MapaInicio.png (canilla); Guia.png (canilla y gota según el inventario); miniaturas dentro de RC-Acceso.png, RC-Mapa.png y RC-Ayuda.png; pantalla de carga del código v2 (cinco Handys) | Usar Bienvenida-modulos.png y MapaInicio-preguntas.png (recortes sin personajes); no usar Main ni Login; en recorridos, recortar las miniaturas afectadas. Alternativas: Foco para bienvenida y guía, Engranaje para el mapa, Llave (ya usada en Inicio y Ficha). |
| Notas de trabajo del lienzo («TUS 17 PEDIDOS», «Corregí sobre cada tablero», «Eliminar Presentaciones») | Main.png | No usar Main en el dossier. |
| Detalles técnicos internos en tickets de muestra del código v2 (nombres de protocolos y componentes de tiempo real) | MOCK-tareas-*.jpg | Usar el tablero del lienzo (Tareas.png) en lugar de las capturas MOCK de Tareas. |
| Datos de infraestructura en documentos fuente (host y puerto del servidor en el plan v3, proveedores en diagramas de los repos, variables de despliegue) | docs/v3/00-plan-v3.md §5, docs/architecture/*.md, docs/runbooks del backend | No copiar nada de esas secciones al dossier; usar solo el diagrama de capacidades de este informe. |
| Presentar como existente lo que es diseño | todo el lienzo v3 | Cada captura del lienzo lleva «Diseño propuesto»; las del código v2, «Pantalla del portal v2 · datos de muestra». |

### Personajes

| Tablero | Personajes | Fuera de la lista | Propuesta |
|---|---|---|---|
| Main | grupo (canilla, gota, engranaje, foco, llave) | sí | No usar (además tiene notas de trabajo). |
| Login | grupo | sí | No usar (mecanismo de ingreso). |
| Bienvenida | grupo | sí | Usar Bienvenida-modulos.png (sin personajes) o pedir la variante con Foco solo. |
| MapaInicio | canilla | sí | Usar MapaInicio-preguntas.png; alternativa de diseño: Engranaje o Llave en lugar de la canilla. |
| Guia | canilla, gota, engranaje, foco, llave, llave rota | sí (canilla y gota) | La captura visible muestra Foco; las otras vistas usan canilla y gota: recortar a la anatomía de pantalla o pedir variante con Foco/Engranaje. |
| RC-Acceso, RC-Mapa, RC-Ayuda | miniaturas de Login, Bienvenida, MapaInicio y Guía | sí | No detectado por el inventario (son miniaturas): recortar esas miniaturas o no usar el tablero. |
| Inicio, Ficha, Sistema | llave, llave rota, engranaje, foco | no | Aptos. |
| Pantalla de carga del código v2 | los cinco Handys | sí | No capturar. |

## 11. Fuentes

- `lienzo-portal-v3` (lienzo, 2026-11-07): S/artifacts/portal/project (canvas «Handyx · Portal interno v3 (rediseño)», 36 tableros, 6 páginas) + S/capturas/portal (PNG, textos.md, hojas)
- `portal@3fc06e2` (repo, 2026-11-07): handy-internal-portal origin/main «Mapa: barrios reales de OpenStreetMap que cubren todo el Partido (#13)» · incluye las olas 1–4 del portal v2 (#10, #11) y las decisiones post-ola-4 (#12)
- `portal@2ed5c5f` (repo, 2026-11-07): handy-internal-portal rama claude/handyx-portal-v1-phases-3xzfm1 · docs/v3/00-plan-v3.md («propuesta · espera el OK de Ignacio»)
- `portal@8ea1c63` (repo, 2026-11-07): handy-internal-portal rama claude/portal-v2-post-ola-4 (ya mergeada en main por #12): decisiones de Ignacio sobre plazos de reclamos, legajos, PDF de 10 MB, presupuesto de marketing y frase del login
- `portal@857127c` (repo, 2026-11-07): handy-internal-portal rama datos-barrios (mergeada en main por #13): geometría real de 130 zonas del Partido
- `portal-publicacion` (doc, 2026-11-07): Historial de ejecuciones de GitHub Actions del portal (solo lectura): publicación manual exitosa sobre main 3fc06e2 el 07/11 15:53 UTC; las publicaciones por push del 07/11 fallaron; la vista previa en GitHub Pages falla desde el 30/10
- `landing-be@4cb77e4` (repo, 2026-11-02): Handy-landing-page-be origin/main «Portal v1 en el backend, runbook de despliegue y decisiones de producción (#8)» · handoff.md, docs/ops.md, docs/contract-delta.md, docs/implementation-plan.md
- `landing-fe@ac3b245` (repo, 2026-10-29): Handy-landing-page-fe origin/main · src/config.ts (captura cerrada hasta aviso definitivo) y CLAUDE.md (tarifas)
- `client-be@fase-4-backend-conciliado` (repo, 2026-11-02): handyx-client-be rama fase-4-backend-conciliado (sin mergear): docs/architecture.md, docs/auth-permissions.md, docs/adr/ADR-0002
- `specialist-be@cf3b39d` (repo, 2026-11-07): handyx-specialist-be rama claude/pensive-hypatia-jajjgm (sin mergear): src/services/operaciones.service.ts y CLAUDE.md
- `specialist-fe@f7c0733` (repo, 2026-11-07): handyx-specialist-fe origin/main · docs/state-machines.md, docs/plan.md, CLAUDE.md
- `pitch-afirmaciones` (pitch, 2026-11-05): decks/handyx-aticma/afirmaciones.json (ESP-REGISTRADOS, INV-O-COBROS) y pitch 183–186 «Cómo crece Handyx»
- `inventario-personajes` (doc, 2026-11-07): dossiers/inventario/personajes-lienzos.json

