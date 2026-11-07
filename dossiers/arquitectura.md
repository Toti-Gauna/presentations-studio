# Arquitectura editorial · tríptico y cuatro dossiers (ola 2)

Fuentes de contenido: `diagnostico.md`, `auditoria/*.json` (funciones, recorridos, capturas, riesgos) y las decisiones de
Ignacio en `docs/handyx/plan-dossiers.md`. Forma y componentes: `direccion-de-arte.md` y `plantilla/`. `S` es la carpeta
de trabajo de la sesión (`/tmp/claude-0/-home-user/10ab011c-6752-54be-831e-b3c4da2461d0/scratchpad`).

## Reglas comunes

- **Formato:** A4 vertical, 20 páginas (16 el Portal): múltiplos de 4 para encuadernar con grapa a caballete. Página 1 =
  tapa, 2 = índice, última = contratapa. Los pares que van enfrentados (izquierda par | derecha impar) se diseñan como
  doble página.
- **Leerse solos:** cada dossier abre con su índice y una caja «Handyx en una línea»; los detalles de otra superficie se
  remiten al dossier que corresponde («ver Dossier 03»), sin repetir páginas.
- **Estado en cada función:** chips Construido · En pruebas · Diseñado · Concepto (con ícono y texto) y una línea de
  corte: «Estado al 07/11/2026».
- **Cada imagen con rótulo:** «Diseño propuesto» (lienzos), «Pantalla de la PWA · datos de prueba» (capturas de las apps),
  «Pantalla del portal · datos de muestra», «Muestra · datos ficticios» (si hay nombres o cifras), «Concepto».
- **Cada cifra con su tipo** (dato verificado, dato informado, supuesto, proyección, objetivo, ejemplo ilustrativo),
  fuente y corte, en una línea `.fuente`. Ingreso siempre «bruto, antes de costos».
- **Tarifa (decisión 07/11):** al especialista, sin comisión; al usuario, 0 % hasta el 10/12/2026 y después 15 %
  «en evaluación». Ninguna otra versión impresa.
- **Personajes:** solo Foco, Engranaje, Llave y Brocha (`dossiers/marca/personajes/*.svg`). Ninguna captura con Canilla o
  Gota: usar los recortes o las alternativas de la auditoría.
- **Lenguaje:** voseo; «especialistas»; sin «verificados» como estado logrado, sin «matriculados», «inmediato», «al
  instante», «en minutos»; montos `$ 45.000`; USD solo en el Business y rotulado.
- **Nunca:** pantallas de acceso o seguridad (Login, RC-Acceso, D6-TOTP, D6-Login2FA), nombres reales mezclados con
  muestras, «Pérdida de gas sin resolver» y otros incidentes que asusten, «Handy» como nombre de la app (las capturas de
  la PWA lo dicen: rotular y no ampliar ese texto).
- **Contacto (idéntico en las cinco piezas):** ignaciogauna.developer@gmail.com · 223 667-4044 · landing.handyc.com ·
  QR a `https://landing.handyc.com/handyx/` (`dossiers/marca/qr-hub.svg`).

## Tríptico · carta de invitación (A4 apaisado, doble faz, plegado envolvente)

Paneles de 100 / 100 / 97 mm; el de 97 mm es la solapa que se pliega hacia adentro. Sin cifras financieras.

| Cara | Panel (ancho) | Contenido | Visual |
|---|---|---|---|
| Exterior, izquierda | 3 · Solapa, cierre (97) | La visión en una frase: «Construimos la forma más simple de resolver los arreglos de una casa, con especialistas que trabajan mejor.» + «Handyx. Soluciones, no problemas.» | Fondo amarillo de marca, Foco y Llave chicos |
| Exterior, centro | 2 · Contratapa, contacto (100) | Invitación a conocer el proyecto; QR grande al hub (landing, 4 dossiers, portafolio); contacto | Fondo blanco, QR navy 34 mm |
| Exterior, derecha | 1 · Portada (100) | Logo, «Soluciones, no problemas», propuesta en una frase («Conectamos a quien necesita un arreglo con especialistas de su zona, con propuestas claras para elegir mejor»), Mar del Plata · 2026 | Azul a sangre, celular con el Inicio (I-Inicio), Foco |
| Interior, izquierda | 4 · El problema (100) | Cuatro dolores (encontrar a alguien confiable, presupuestos que no se pueden comparar, desorden, el especialista sin herramientas), como hipótesis del producto, sin estadísticas | Odisea dibujada con íconos de línea; sin Canilla ni Gota |
| Interior, centro | 5 · La solución (100) | El circuito en cuatro pasos: contás qué pasa → recibís propuestas → elegís por calidad y precio → seguís el trabajo y pagás directo | Dos pantallas reales rotuladas (P-Revisar y C-Propuestas-recorte) |
| Interior, derecha | 6 · El ecosistema (97) | Customer App · Professional App · Operations Portal, con su estado en una palabra; invitación a las demos y a la documentación (QR) | Tres miniaturas + Engranaje y Brocha |

## Dossier 01 · Business & Investment (20 p.) · navy, formal, sin personajes salvo la contratapa

| p. | Sección | Contenido y mensaje | Visual / datos |
|---|---|---|---|
| 1 | Portada | «Business & Investment» · «Un plan para construir la forma más simple de resolver los arreglos del hogar» · Mar del Plata · noviembre de 2026 | Navy a sangre, numeral 01 grande, filete amarillo |
| 2 | Índice | Índice + cómo leer (estados, rótulos, tipos de dato) + corte | — |
| 3 | Resumen ejecutivo | Qué es, oportunidad, estado honesto del producto, modelo (tarifa decidida), qué buscamos (USD 100.000) | 4 cifras rotuladas: 6 rubros (verificado) · 284 funciones relevadas (verificado, auditoría 07/11) · lanzamiento nov. 2026 (objetivo) · USD 100.000 (objetivo) |
| 4 | El problema | Cliente y profesional: seis dolores del pedido (§5.3) como **hipótesis cualitativa**; entrevistas sin número | Diagrama de la «odisea» propio; fuente: entrevistas informadas |
| 5 | Nuestra solución | Valor para cliente, especialista y Handyx (3 columnas) | 2–3 pantallas rotuladas (P-Revisar, C-Comparar, H0-Presupuesto) |
| 6 | El ecosistema | Tres superficies + landing + backend; qué información fluye; estado y dominio en cada caja | Diagrama propio desde `portal.json → arquitectura` |
| 7 | Un arreglo de punta a punta | El circuito cruzando las tres superficies, con lo que existe en código y lo que es diseño | Tira de 5 pantallas reales con chips de estado |
| 8 | Mercado y oportunidad | Total, accesible e inicial con la cuenta abajo-arriba (259.623 hogares × arreglos por año × ticket) y cada factor rotulado; qué investigación falta (§ diagnóstico 8) | Diagrama de embudo propio; MERCADO-USD (proyección) |
| 9 | Modelo de negocio | Confirmada · en evaluación · futuras; flujo del dinero (pago directo al especialista); ejemplo $ 100.000 → $ 115.000 (ilustrativo, desde el 10/12) | Tabla de tres columnas + esquema del flujo |
| 10 | Competencia | Alternativas actuales (conocidos y grupos, plataformas locales e internacionales) por modelo de cobro, consultadas el 02–04/11 «a revalidar»; diferenciación sin «le gana» | Tabla por modelo de cobro |
| 11 | Adquisición y marketing | Dos ejes, digital y físico, con estado de cada acción (previsto · en ejecución · medido) | Dos columnas con chips |
| 12 | Cómo lo medimos | CAC (techo USD 6 «a medir», sobre primer trabajo completado), conversión por etapa, repetición, frecuencia, costo por registro y por trabajo completado; definiciones y fuente de cada métrica (portal) | Tabla de métricas con «sin dato todavía» |
| 13 | Crecimiento por etapas | 4 etapas con objetivo, acciones, recursos, indicadores, hitos y condición para pasar; trimestres sin fechas | Escalera de etapas |
| 14 | Roadmap | Producto, operaciones, comercial, marketing, expansión, alianzas × construido / en pruebas / planificado | Matriz con chips |
| 15 | Proyecciones | Variables del modelo, cuáles están medidas (ninguna todavía) y cuáles son supuestos; una proyección del pitch rotulada; costos USD 400/mes (informado); equilibrio ≈ 67 trabajos/mes (proyección); escenarios pendientes de datos | Tabla de variables + nota «ingreso bruto ≠ ganancia» |
| 16 | Inversión | USD 100.000 (objetivo), reparto 45/30/15/10 «propuesta a aprobar» mapeado a las categorías del pedido, cada partida atada a un hito; instrumento y plazo «[a definir]» | Barra apilada + tabla de hitos |
| 17 | Validación | Cuatro bloques: construido (publicaciones con fecha) · probado (5 trabajos, $ 350.000 · informado, sin auditar) · registrados (56 especialistas · informado, sin auditar) · próximos hitos (50 trabajos con tarifa y 5 repetidores en diciembre · objetivo); capacidad de ejecución (repos, pruebas automáticas) | Bloques con tipo de dato |
| 18 | Visión | «Soluciones, no problemas»; objetivos rotulados (USD 1 M en trabajos, USD 5 M de ingresos 2027, 40 % de Argentina); conceptos (Business, ferreterías, más rubros); una línea post-ATICMA + invitación a los finalistas | Texto sobrio, una ilustración de Mar del Plata |
| 19 | Cierre | Por qué ahora; equipo (Ignacio, fundador; Abigail, diseño y marketing; desarrollo asistido por agentes de IA supervisados); qué pedimos: una reunión | — |
| 20 | Contratapa | Contacto + QR + la colección (5 piezas) | Engranaje pequeño |

## Dossier 02 · Customer App (20 p.) · azul, Foco

| p. | Sección (pedido §6) | Contenido | Capturas (S/capturas/usuario/…) |
|---|---|---|---|
| 1 | 1 Portada | «Customer App» · «Pedir un arreglo, comparar y elegir con tranquilidad» | I-Inicio en celular grande + Foco |
| 2 | Índice | Índice + cómo leer + Handyx en una línea | — |
| 3 | 2 La experiencia del cliente | Mapa de la experiencia con los 12 recorridos agrupados (pedir, elegir, seguir, después) | Diagrama propio (no FL-Mapa) |
| 4 | 3 Problemas actuales | Hipótesis cualitativas (ver D01 p. 4, sin repetir el texto) | Íconos de línea |
| 5 | 4 Cómo Handyx simplifica | La promesa: «Contás qué pasa, recibís propuestas con precio y elegís vos. Pagás directo al especialista» | A-Bienvenida recortada sin «verificados» |
| 6 | 5 Registro y onboarding | U-R-01: alta en pocos pasos; tarifa 0 % hasta el 10/12 | A-Datos, A-Listo, usuario-modal-fee.webp (rotulada) |
| 7 | 6 Exploración | Inicio: rubros, «Quiero…» (tareas frecuentes), HandIA para no saber el rubro; no hay directorio: el pedido llega a especialistas de la zona | I-Inicio, I-HandIA |
| 8 | 7 Solicitud de servicios | U-R-02 en 3 toques; fotos y medidas opcionales; HandIA por chat y voz como alternativa (Diseñado / En pruebas en rama) | P-Que, P-Revisar, P-Publicado, I-HandIAFicha |
| 9 | 8 Recepción de presupuestos | Propuestas con precio, fecha y perfil; sin tiempos prometidos | C-Propuestas-recorte, M-Presupuesto, usuario-propuestas.webp |
| 10 | 9 Comparación | **Doble página «Elegir mejor»**, izquierda: tabla comparativa (en código, sin ranking) vs diseño propuesto | C-Comparar, FL-Propuestas |
| 11 | 10 Criterios de calidad y precio | Derecha: qué mira la persona (perfil, certificados, reseñas, precio orientativo) y qué está construido; pesos del promedio «a definir si se publican» | C-Detalle-recorte, C-Certificados-recorte |
| 12 | 11 Selección y contratación | U-R-05: aceptar, pedir cambios, rechazar, visita | C-Aceptar, C-Aceptada, C-Visita |
| 13 | 12 Seguimiento y pago | U-R-06: turno, en camino, llegada, pago directo (efectivo hoy; Mercado Pago cuando se valide); informado ≠ verificado | RC-Trabajo (recortado), S-EnCamino, S-Pagar |
| 14 | 12 Obras de varios días | U-R-07: etapas, equipo, repuestos a aprobar | O-Obra |
| 15 | 13 Comunicación y organización | U-R-08 y U-R-09: chat con tarjetas, avisos que nunca aceptan ni pagan, Soporte | M-Chat, I-Avisos, M-Soporte-recorte |
| 16 | 14 Confianza y reputación | U-R-12: qué ve la persona antes y después (verificación como proceso, no como estado; reseñas aún sin datos reales) | S-PagoInformado, S-Informe, C-Certificados-recorte |
| 17 | 15 Funcionalidades adicionales | Mi hogar, medir y AR, Camino del hogar (todo Diseñado o Concepto, rotulado) | H-Hogar, T-Medir, H-AR, G-Hito-recorte |
| 18 | 16 Roadmap de experiencia | En pruebas → diseñado → concepto, sin fechas | Matriz con chips |
| 19 | 17 Cierre | Qué sigue y la colección | — |
| 20 | Contratapa | Contacto + QR | Foco |

## Dossier 03 · Professional App (20 p.) · amarillo y navy, Llave y Brocha

| p. | Sección (pedido §7) | Contenido | Capturas (S/capturas/especialista/…) |
|---|---|---|---|
| 1 | 1 Portada | «Professional App» · «Tu trabajo, tus precios» | D6-Bienvenida-sin-canilla o F-InicioDia + Llave y Brocha |
| 2 | Índice | Índice + cómo leer + Handyx en una línea | — |
| 3 | 2 El problema del profesional | Hipótesis cualitativas (canales informales, presupuestos a mano, cobro y agenda desordenados); sin estadísticas | Íconos |
| 4 | 3 La propuesta | Herramienta de trabajo, no solo canal; sin comisión; Handyx sugiere, nunca impone; mapa de la app (5 pestañas) | Diagrama propio desde FL-Mapa |
| 5 | 4 Registro y perfil | E-R-01: alta en pasos; documento cargado ≠ verificado; la verificación la hace el equipo (sin detallar antecedentes) | RG-3, RG-8, OB-Aprobado (rotulado), CU-Perfil |
| 6 | 5 Especialidades y servicios | Seis rubros, tarifas por tarea | RG-3, H0-ManoObra |
| 7 | 6–7 Oportunidades y solicitudes | E-R-02: pedidos de la zona, sin obligación de aceptar, «Ahora no» sin consecuencias, urgentes con opt-in | F-Inicio-sin-canilla, F-Pedido-sin-canilla, CU-Disponibilidad |
| 8 | 8 Presupuestos | E-R-03: presupuestador con lista de precios propia | H0-Presupuesto, H0-AgregarMaterial, F-Precio-sin-canilla |
| 9 | 9 Comparación y aceptación | Decidir pedido por pedido; revisar antes de enviar | F-Revisar |
| 10 | 10 Agenda y organización | **Doble página «Tu día de trabajo»**, izquierda: tu día, ruta y agenda | F-InicioDia, F-AgendaMes |
| 11 | Modo trabajo (13) | Derecha: E-R-04 tareas, repuestos, cierre con informe | H0-Modo, H0-InformeEnviado |
| 12 | 11–12 Clientes e historial | Relación en el chat, obra nueva a un cliente tuyo, agenda pasada e informes con PDF | F-ChatAdjuntar, F-AgendaPasadas |
| 13 | 13 Herramientas administrativas | Ingresos y gastos, equipamiento, caja | F-Ingresos, H0-EquipoDetalle, F-Herramientas |
| 14 | 13 Obras y equipo | E-R-05 y E-R-06: obras de varios días, reparto («Handyx no toca la plata») | F-Obra, F-Reparto |
| 15 | 13 Ferretería | E-R-08: materiales en ferreterías adheridas (sin alianzas firmadas; panel del ferretero) | R-Retiro, FE-Pedido (Muestra) |
| 16 | 14 Herramientas por oficio | Taller: H0 base; H1 Electricidad (En pruebas en rama, revisión técnica pendiente); H2–H6 Concepto «posterior al lanzamiento» | T-Taller, T-Tablero, T-Informe, OF-Gas |
| 17 | 15 Reputación y crecimiento | Camino Handyx (premios en borrador); sin sistema de calificaciones todavía | G-Camino, G-MiniCamino |
| 18 | 16 Roadmap profesional | Olas del plan sin fechas; oficios después del deploy | Matriz con chips |
| 19 | 17 Cierre | «Handyx quiere ser tu herramienta de trabajo» + la colección | — |
| 20 | Contratapa | Contacto + QR | Llave |

## Dossier 04 · Operations Portal (16 p.) · arena y azul medio, Engranaje

| p. | Sección (pedido §8) | Contenido | Capturas (S/capturas/portal/recortes/… y código v2) |
|---|---|---|---|
| 1 | 1 Portada | «Operations Portal» · «La infraestructura detrás de cada arreglo» | Inicio-sin-sidebar en escritorio + Engranaje |
| 2 | Índice | Índice + cómo leer + Handyx en una línea | — |
| 3 | 2 Por qué importa | Operar con criterio desde el día uno: cada panel dice qué es, qué pregunta responde y de dónde sale | Bienvenida-modulos |
| 4 | 3 Arquitectura | **Doble página**, izquierda: diagrama de capacidades (landing → captación y CRM → portal; apps ↔ API; qué está conectado y qué no) | Diagrama propio desde `portal.json → arquitectura` |
| 5 | 4 Gestión de clientes | Derecha: CRM de preregistros (Construido en v2): ficha, etapas, contacto | Preregistros (Muestra), MOCK-preregistros (código v2) |
| 6 | 5 Gestión de profesionales | Legajos (En pruebas), la verificación hoy fuera del portal | Ficha-sin-contacto, Legal (Muestra) |
| 7 | 6–7 Supervisión y seguimiento | Inicio «para hoy» (Diseñado v3); seguimiento de trabajos de las apps (Concepto) | Inicio-para-hoy, MOCK-inicio |
| 8 | 8–9 Comercial y transacciones | Campañas con enlaces y QR (Construido); el portal no mueve dinero: muestra la política de tarifa y los pagos reportados (Concepto) | Campana-embudo |
| 9 | 10 Incidencias y soporte | Reclamos con plazos por gravedad (Construido); ejemplos neutros | Reclamos (tapar ejemplos sensibles) |
| 10 | 11 Analítica | El método: denominador, fuente, ventana y «sin dato»; ninguna cifra real todavía | Inicio-semana (Muestra) |
| 11 | 12 Cohortes | Cohortes semanales de contacto (Construido); retención de clientes = Concepto | Cohortes-tabla (Muestra) |
| 12 | 13 Mapa | Barrios reales del Partido (OpenStreetMap); lo que se pinta encima es muestra | mapa-partido-geometria-osm, Mapa-mapa-y-barrio |
| 13 | 14 Supervisión del equipo | Tareas, Docs, Legal y compliance, registro de actividad, permisos por tarea | Tareas, Docs |
| 14 | 15–16 Escalabilidad y roadmap | Equipo que crece (guía, tour, permisos) y plan v3 por olas (propuesta sin fechas) | Tour, RC-Indice |
| 15 | 17 Cierre | «No mostramos ningún número inventado» + la colección | mapa-ciudad-geometria-osm |
| 16 | Contratapa | Contacto + QR | Engranaje |

## Recursos que hay que producir (ola 3)

- Diagramas propios (SVG en el HTML): odisea, ecosistema, circuito de punta a punta, mapa de la experiencia, mapa de la
  app del especialista, arquitectura del portal, etapas de crecimiento, matrices de roadmap.
- Re-render del pitch solo si hace falta una lámina (sin Canilla ni Gota): en principio, los diagramas se dibujan de nuevo
  en el lenguaje de la colección y no se reusan láminas 16:9.
- Recortes adicionales con PIL desde las PNG a 2x/3x (`S/capturas/…`), guardados en `dossiers/piezas/<pieza>/img/`.
