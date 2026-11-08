# Diagnóstico de Handyx · base de los dossiers y el tríptico

Corte: **07/11/2026**. Síntesis de la auditoría de la ola 1 (`dossiers/auditoria/`): los tres lienzos de diseño (360
tableros capturados), los siete repos de producto (`main` y ramas activas), el pitch de ATICMA (217 láminas y 115
afirmaciones) y Notion (solo lectura). Cada afirmación de este informe tiene su evidencia en los `.json` de la auditoría.

## 1. Resumen ejecutivo

**Qué es.** Handyx es un marketplace de servicios del hogar que arranca en Mar del Plata con seis rubros (electricidad,
plomería, gas, cerrajería, albañilería y aire acondicionado). Conecta a quien necesita un arreglo con especialistas
independientes. El cliente cuenta qué pasa, recibe propuestas con precio y elige; el especialista pone su precio y
cobra directo; Handyx no toca la plata del trabajo. Lema: *Soluciones, no problemas.*

**Qué lo hace distinto, según el material.** No se queda en conectar: diseña una herramienta de trabajo para el
especialista (presupuestador con lista de precios propia, modo trabajo, informe con garantía, ingresos, equipo, Taller
con herramientas del teléfono y por oficio) y un portal interno para operar con criterio (CRM de preregistros, reclamos
con plazos, campañas con QR, cohortes, mapa por barrio, docs y legal). Tres superficies sobre un mismo contrato de datos.

**Dónde está, con honestidad.** Hay mucho construido y mucho más diseñado, pero **nadie puede pedir ni cobrar un trabajo
real hoy**:

- Publicado para el público: la landing (landing.handyc.com, formulario de preregistro todavía cerrado) con su demo.
- Publicado el 07/11: el portal interno (internal.handyc.com, sin backend desplegado) y las dos PWA en **vista de prueba
  con datos ficticios** (handyx.pro y workers.handyx.pro).
- Ningún backend desplegado: el de captación y CRM está terminado en `main` (291 pruebas + 86 de base de datos) y las API
  del usuario y del especialista viven en ramas, probadas contra una base local.

**Modelo (decisión del 07/11).** Al especialista, sin comisión. Al usuario, tarifa de servicio 0 % hasta el 10/12/2026 y
después 15 % sobre el precio del especialista (**en evaluación**: falta la política aprobada y cómo se cobra).

**Qué busca.** USD 100.000 (objetivo del pitch; instrumento, plazo y valuación sin definir), con un reparto propuesto
«a aprobar».

**Tracción declarada.** 5 trabajos de prueba por $ 350.000 y 56 especialistas registrados: datos informados por el
fundador, **sin auditar** (no hay CRM con datos de producción ni comprobantes conciliados).

## 2. Mapa del ecosistema

| Superficie | Para quién | Repo | Estado | Dónde |
|---|---|---|---|---|
| Landing + demo | Público, lista de espera | Handy-landing-page-fe | **Construido** (publicado 29/10; formulario cerrado) | landing.handyc.com |
| Captación y CRM (backend) | Landing y portal | Handy-landing-page-be | **En pruebas** (completo en `main`, sin desplegar) | api.handyc.com (previsto) |
| App del usuario (Customer App) | Quien necesita un arreglo | handyx-client-fe / -be | **En pruebas** (vista de prueba publicada; API en ramas) | handyx.pro |
| App del especialista (Professional App) | Especialistas independientes | handyx-specialist-fe / -be | **En pruebas** (vista de prueba publicada; API en ramas) | workers.handyx.pro |
| Portal interno (Operations Portal) | Equipo de Handyx | handy-internal-portal | **Construido** el v2 (publicado 07/11, sin datos reales); el v3 del lienzo es **Diseñado** | internal.handyc.com |
| Lienzos de diseño | — | Artifacts (usuario, especialista, portal) | **Diseñado**: 102 + 196 + 36 tableros | — |

Cómo se relacionan: el usuario publica un pedido → especialistas del rubro y la zona mandan propuestas → el usuario
compara y acepta → el trabajo se sigue en la app (turno, llegada, obra, informe) → el pago va directo al especialista
(efectivo hoy; Mercado Pago cuando se valide) → el portal acompaña la operación (preregistros, legajos, reclamos,
campañas). Hoy el portal y las apps **no están conectados**: lo que viene de las apps al portal (pedidos, pagos reportados,
reclamos hechos en la app, verificación) es **Concepto**.

## 3. Inventario de funcionalidades y estado

284 funciones relevadas, cada una con evidencia (lienzo, código o documento):

| Superficie | Construido | En pruebas | Diseñado | Concepto | Total |
|---|---:|---:|---:|---:|---:|
| App del usuario | 2 | 39 | 41 | 3 | 85 |
| App del especialista | 2 | 40 | 49 | 11 | 102 |
| Portal interno | 41 | 15 | 26 | 15 | 97 |
| **Total** | **45** | **94** | **116** | **29** | **284** |

Lectura: en las apps casi todo lo que existe en código está **En pruebas** (corre con el servidor simulado o en ramas); lo
único **Construido** es la demo pública de la landing y su versión instalable. El portal es lo más avanzado: el v2 en
`main` funciona contra el backend real (probado en local).

**App del usuario** (detalle: `auditoria/usuario.md`)
- En pruebas: alta, pedido en pasos, propuestas y tabla comparativa sin ranking, aceptar / pedir cambios / visita,
  turno, seguimiento, pago en efectivo informado, chat con tarjetas, avisos, reseñas (vista de prueba), reclamos.
- Diseñado: pedido en 3 toques con fotos anotadas y medidas, HandIA por chat y por voz (motor local en la rama
  `handia-premium`; en `main`, desactivada), «La mejor en perfil y precio» y precio orientativo, obras en equipo, Mi
  hogar, herramientas 3D/AR, Camino del hogar, informe con garantía.
- Concepto: HandIA con proveedores externos, montos y premios del Camino (borrador para Legal).

**App del especialista** (detalle: `auditoria/especialista.md`)
- En pruebas: alta con verificación (documento cargado ≠ verificado), bandeja y detalle de pedidos, propuesta con precio,
  agenda, trabajos, viaje en vivo, caja, cuenta y avisos, y en la rama el Taller con Electricidad (H1).
- Diseñado: presupuestador con lista de precios propia, modo trabajo y cierre con informe y garantía, ingresos y gastos,
  equipamiento, obras en equipo con reparto, chat con tarjetas, ferretería (app y panel web del ferretero), Camino Handyx.
- Concepto: herramientas de Plomería, Gas, Aire, Albañilería y Cerrajería (H2–H6, «después del deploy»), catálogos reales
  de ferreterías, HandIA para profesionales, exploraciones descartadas.

**Portal interno** (detalle: `auditoria/portal.md`)
- Construido (v2 en `main`): CRM de preregistros con ficha y etapas, reclamos con plazos por gravedad, campañas con enlaces
  y QR, cohortes semanales, mapa con los barrios reales del Partido (OpenStreetMap), Docs, permisos por tarea, registro de
  actividad, datos personales cifrados.
- En pruebas (solo con muestra): tareas del equipo, Legal y compliance, legajos de especialistas, panel de campañas.
- Diseñado: el rediseño v3 completo (Inicio «para hoy», guía y tour, mapa con preguntas, ficha nueva).
- Concepto: todo lo que llegaría desde las apps (pedidos, trabajos, pagos reportados, verificación, invitaciones).

## 4. Modelo de negocio identificado

| Monetización | Qué | Estado |
|---|---|---|
| Confirmada | Al especialista: **sin comisión**. Al usuario: **0 % hasta el 10/12/2026** (lo que muestran las apps) | decisión de Ignacio 07/11 |
| En evaluación | Al usuario, **15 %** sobre el precio del especialista desde el 10/12 (ejemplo: $ 100.000 → $ 115.000); cómo se cobra (rendición diaria del especialista o cobro dividido) | sin política aprobada ni implementación |
| Futuras | Handyx Business (empresas y consorcios), ferreterías adheridas, servicios para profesionales, más rubros | concepto |

El dinero del trabajo va **directo al especialista** (efectivo o Mercado Pago). Reportado ≠ verificado. Toda cifra de
ingresos se presenta como **ingreso bruto, antes de costos**. Pendiente de corregir en público: la landing todavía dice
10 % + 10 %, primer mes sin tarifa y camada fundadora al 5 %.

## 5. Estrategia comercial identificada

- **Captación de especialistas:** preregistro en la landing, contacto 1 a 1 desde el CRM, porteros y administradores de
  edificios (probado, informado), ferreterías (sin alianzas firmadas), volantes y QR por barrio.
- **Captación de usuarios:** anuncios por barrio y urgencia en Instagram y Facebook, búsqueda local, campañas con UTM y QR
  medidas en el portal, porteros y consorcios, comercios. Pauta decidida: USD 100 por mes.
- **Medición:** CAC con techo de USD 6 por primer trabajo completado («a medir»), conversión por etapa, repetición,
  costo por registro y por trabajo completado. Hay un marco de seis experimentos con umbrales, sin resultados medidos.
- **Expansión:** consolidar Mar del Plata antes de replicar (densidad por barrio, repetición, contribución positiva).

## 6. Información disponible para inversores

- **Respaldable hoy:** el producto construido y publicado, con fechas y corridas de despliegue; las pruebas automáticas;
  los 360 tableros de diseño; la semifinal de ATICMA Emprende (05/11).
- **Dato informado, sin auditar:** 5 trabajos de prueba ($ 350.000), 56 especialistas registrados, entrevistas con
  vecinos y especialistas, costos de USD 400 por mes.
- **Proyección o supuesto:** mercado de Mar del Plata (259.623 hogares × arreglos × ticket ≈ USD 10,4 M por año), CAC
  ≈ USD 2 (techo USD 6), LTV ≈ USD 18, equilibrio ≈ 67 trabajos por mes.
- **Objetivo:** 50 trabajos con tarifa y 5 clientes que repiten en diciembre; USD 100.000 de inversión; en Visión, USD
  1 M en trabajos y USD 5 M de ingresos en 2027, 40 % de Argentina.

## 7. Datos faltantes o inconsistentes

**Resueltos por Ignacio (07/11)**: tarifa a imprimir; dominio del QR (landing.handyc.com/handyx/); tracción rotulada
«sin auditar»; tono del Business (ambición solo en Visión, sin IPO, cripto, Silicon Valley ni «arreglar el mundo»).

**Siguen abiertos (se imprimen como «[a definir]» o se evitan):**

| Tema | Qué se contradice | Cómo lo tratan las piezas |
|---|---|---|
| Qué se lanza el 10/11 | Las PWA están en vista de prueba y los backends sin desplegar | «Lanzamiento previsto: noviembre de 2026» + estado de cada función con fecha de corte |
| Cómo se cobra el 15 % | Rendición diaria vs cobro dividido; «la plata no pasa por Handyx» | Modelo en evaluación; sin mecanismo impreso |
| Antecedentes del especialista | Presencial (main, contrato) vs foto o PDF (ramas del 07/11 y lienzo) | «Verificación de identidad y antecedentes a cargo del equipo», sin el medio |
| Registro del usuario | Con invitación y contraseña (código) vs sin ellas (lienzo) | Describir el alta sin esos detalles |
| Ranking de propuestas | «La mejor en perfil y precio» (lienzo) vs «sin rankings» (contrato) | Diseño propuesto rotulado; criterios a la vista, sin superlativos |
| Mercado | Hogares o viviendas; ticket USD 40/45/51 o $ 45.000/70.000/80.000 | Cuenta abajo-arriba con cada factor rotulado + investigación propuesta |
| Inversión | $ 3–6 M ARS → USD 30.000 + mentor → USD 300.000 → USD 100.000 | USD 100.000 (objetivo); instrumento «[a definir]» |
| Entrevistas | 70 charlas vs 100 + 150 | Sin número: «entrevistas con vecinos y especialistas (dato informado)» |
| Finalistas de ATICMA | Cuatro (pedido) vs tres (Notion) | «Los proyectos finalistas», sin número ni nombres |
| Dominios | handyc.com (landing, portal, API) y handyx.pro (apps) | QR a landing.handyc.com/handyx/; las demos se nombran por su dominio actual |
| Herramientas por oficio | Diciembre (pitch) vs después del deploy (plan) | «Posterior al lanzamiento», sin fecha |

**Huecos de contenido** (no hay fuente; no se inventan): datos del problema (estadísticas de confianza, comparación de
presupuestos), problema del profesional independiente, cuántas propuestas llegan y en cuánto tiempo, reseñas reales,
métricas reales del portal, fechas del roadmap.

## 8. Recomendaciones para mejorar la presentación

1. **Contar el estado real con orgullo.** 284 funciones mapeadas, tres superficies diseñadas de punta a punta, un portal
   construido y dos apps publicadas en vista de prueba en menos de dos semanas es una prueba de capacidad de ejecución.
   Cada página dice qué está construido, qué está en pruebas, qué está diseñado y qué es concepto.
2. **Una sola tarifa en todo el material** (la del 07/11) y corregir la landing antes de repartir las piezas.
3. **Capturas reales de los lienzos, rotuladas.** «Diseño propuesto» para el lienzo, «Pantalla de la PWA · datos de
   prueba» para las capturas de las apps y «Muestra · datos ficticios» donde haya nombres o cifras.
4. **Personajes solo de la lista.** Recortar o reemplazar los tableros con Canilla o Gota (31 en los lienzos; 105 de 217
   láminas del pitch). Las escenas del pitch que hagan falta se re-renderizan solo con Foco, Engranaje, Llave y Brocha.
5. **Business sobrio.** Cada cifra con su tipo, fuente y corte, al estilo del portal («cada panel dice qué es, qué
   pregunta responde y de dónde sale»). Ingreso bruto nunca como ganancia.
6. **Ocultar lo sensible.** Nada de pantallas de acceso o configuración de seguridad (Login, RC-Acceso, D6-TOTP), ni
   nombres reales mezclados con muestras, ni incidentes de ejemplo que asusten («pérdida de gas sin resolver»).
7. **Publicar `/handyx/` y probar el QR antes de imprimir.** La ruta todavía no existe.
8. **Investigación mínima de mercado** antes de una ronda: INDEC (hogares por partido, gasto en mantenimiento),
   encuesta corta por barrio y búsquedas locales por rubro.
