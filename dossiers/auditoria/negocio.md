# Auditoría de negocio, ecosistema y material del pitch · ola 1

Corte: **07/11/2026**. Repos con el fetch local de las 19:05 UTC; commits y GitHub Actions posteriores leídos con la API de
GitHub (solo lectura) hasta las 19:18 UTC. Sin red a los dominios de Handyx: lo publicado sale de los workflows. Notion
leído en modo solo lectura (páginas sin verificar). Datos completos, imagen por imagen: [`negocio.json`](negocio.json).

## Resumen

- **Ecosistema.** Al 07/11 lo único público es la **landing** (landing.handyc.com, publicada el 29/10) con la **demo** y el
  formulario **cerrado**, el **portal interno** (internal.handyc.com, publicado el 07/11 sin backend desplegado) y las dos
  **PWA en vista de prueba con datos ficticios** (handyx.pro y workers.handyx.pro, publicadas el 07/11). Ningún backend
  está desplegado: el BE de la landing tiene código en `main` y su deploy salió *skipped*; las API del usuario y del
  especialista tienen `main` sin código (solo README y workflows) y todo su trabajo en ramas. **Nadie puede pedir ni cobrar
  un trabajo real hoy.**
- **Datos.** 115 afirmaciones: 5 verificadas (6 rubros, metas MET-01 y dos IPO de referencia), el resto supuestos,
  proyecciones, objetivos o datos informados sin conciliar. Las tres cifras de tracción (56 registrados, 5 trabajos,
  $ 70.000) son informadas por Ignacio y **no pueden venir del CRM**: la landing nunca captó en producción.
- **Contradicciones que bloquean.** La tarifa tiene siete versiones vivas; el monto de inversión pasó por cuatro valores en
  cinco días; hay dos familias de dominios (handyc.com y handyx.pro).
- **Material.** Las 217 imágenes del pitch son render vectorial de buena calidad (nada parece IA), pero **105 muestran
  personajes fuera de la lista** (Gota, Canilla, Medidor, Aire) y buena parte del respaldo financiero tiene tono de pitch
  (USD 1 M, USD 5 M, IPO, cripto, «arreglar el mundo»).

## A · Ecosistema construido

| Repo | Qué es · stack | `origin/main` | Ramas activas | Pruebas y CI | Despliegue (variables que lo activan) | Qué funciona para gente real |
|---|---|---|---|---|---|---|
| Handy-landing-page-fe | Landing + demo `/demo/` + apps por rol · Vite + TS, GSAP | `ac3b245` · 29/10 | `claude/handyx-pitch-deck-rv972p` (guion de pitch, 31/10), `fix/trailers-errores` (30/10) | `npm test`; job de Pages falló el 29/10, el de Hostinger pasó | `deploy.yml` → landing.handyc.com (`HOSTINGER_DEPLOY_ENABLED`, endpoint en `FORM_ENDPOINT`) · `apps.yml` → handyc.com y workers.handyc.com (`HOSTINGER_DEPLOY_APPS_ENABLED`, `APPS_INDEXAR`) | **Publicada** el 29/10 (run 40933042234, smoke OK) con el endpoint **vacío** → «Registro habilitado en breve». Apps por rol **no** publicadas (skipped). |
| Handy-landing-page-be | Captación + CRM + backend del portal v1 · Node 22, Express 5, Prisma 7, PostgreSQL | `53e3e65` · 07/11 19:17 (fetch local: `4cb77e4` del 02/11) | `claude/handyx-portal-v1-phases-3xzfm1` (ya mergeada) | format, lint, typecheck, build, test (291), test:db (86) — verde | `deploy.yml` «Deploy a Render» (`RENDER_DEPLOY_ENABLED`), migración manual | **Nada**: run 42405238130 con migrar/desplegar *skipped*; runbook «NADA se ejecutó en Neon, Render ni Hostinger». |
| handy-internal-portal | Portal interno (CRM, campañas, cohortes, mapa, docs, tareas, legal) · React 19 | `3fc06e2` · 07/11 | plan v3 por olas (propuesta); olas v2 ya mergeadas | lint, css, typecheck, test, bundle, CSP, build — verde; Pages falló el 07/11 | `hostinger.yml` → internal.handyc.com (`HOSTINGER_DEPLOY_ENABLED`, API en `API_BASE_URL`) | **Publicado** el 07/11 16:11 (run 42388551018). Sin API desplegada no hay datos reales (sin verificar). |
| handyx-client-fe | PWA del usuario · Next.js 16 export, React 19 | `ca04340` · 07/11 | `fase-3-diseno` (rediseño, integración preparada), `handia-premium` (HandIA, diseño completo, plan Fase 7) | format, lint, typecheck, test (59), mapa, contratos, build — verde | `hostinger.yml` → handyx.pro (`HOSTINGER_DEPLOY_ENABLED`; con `API_BASE_URL` compila producción) | **Publicada** el 07/11 17:43 (run 42397628127) en **preview**: datos ficticios rotulados. |
| handyx-client-be | API del usuario, dueña del contrato y del esquema | `150bbf2` · 07/11 19:13 = README + 2 workflows (fetch local: `e0a40da` Initial commit) | `fase-4-backend-conciliado`, `claude/pensive-hypatia-jajjgm` (esquema, migraciones, viaje en vivo, regla «sin comisión») | en ramas: 63 + 27/27 test:db | `deploy.yml` (`RENDER_DEPLOY_ENABLED`) | **Nada**: deploy *skipped* («el repo todavía no tiene código»). |
| handyx-specialist-fe | PWA del especialista + Taller · Next.js 16 | `f7c0733` · 07/11 | `claude/pensive-hypatia-jajjgm` (46 commits: Taller H0–H1.5, AR, 3D, rediseño, integración con la API local) | lint, typecheck, test (61), build, build:hostinger — verde | `hostinger.yml` → workers.handyx.pro (`HOSTINGER_DEPLOY_ENABLED`, `API_BASE_URL`) | **Publicada** el 07/11 18:00 (run 42398972880) con mock y banner «Datos de prueba». |
| handyx-specialist-be | API del especialista | `6afe22a` · 07/11 19:13 = README + workflows (fetch local: `fc5af22`) | `claude/pensive-hypatia-jajjgm` (lotes 5.2–5.8, IA del Taller con 503 sin proveedor) | en ramas, contra PostgreSQL local | `deploy.yml` (`RENDER_DEPLOY_ENABLED`) | **Nada** (deploy *skipped*). |
| presentations-studio | Motor de presentaciones + pitch ATICMA + dossiers | `1d128f8` · 31/10 (motor inicial) | `claude/modest-gauss-jin0gy` (72 commits: todo el pitch y la ola 0) | `verify` + `e2e` locales; sin CI en main | `deploy-hostinger.yml` (`HOSTINGER_DEPLOY_ENABLED`, `DOMINIO`, `SERVIDOR_CONTROL`, `VITE_DECK`) · `deploy-vps.yml` (`DEPLOY_HOSTINGER`, `DEPLOY_MODO`) | No publicado (runs *skipped*); entregables offline usados en la semifinal. |

Estados para el dossier: landing y demo **Construido**; captura de preregistros **En pruebas**; BE de captación **En
pruebas** (en `main`, sin desplegar); portal **Construido** (publicado) pero sin operación real; PWA y API **En pruebas**.
Atención: el pitch dice «ya contamos con ambas aplicaciones desarrolladas» y su roadmap pone «Hoy: … chat, agenda,
trabajos y cobros»; en `main` eso es una vista de prueba.

### Dominios (contradicción documentada)

| Familia | Dominio | Uso | Fuente | Estado |
|---|---|---|---|---|
| handyc.com | landing.handyc.com | landing | landing-fe `deploy.yml`, CLAUDE.md | publicado 29/10 |
| | handyc.com · workers.handyc.com | demo de la landing en modo app (usuario / especialista) | landing-fe `apps.yml` (29/10) | no publicado |
| | internal.handyc.com | portal | portal `hostinger.yml` | publicado 07/11 |
| | api.handyc.com | API de captación/CRM | landing-be runbook (02/11) | no desplegada |
| | presentaciones.handyc.com | motor de presentaciones | studio `hostinger-publish.sh` | no publicado |
| | interno.handyc.com · app.handyc.com | variantes en docs y pruebas | landing-be, portal, client-be (ramas) | sin uso |
| handyx.pro | handyx.pro · workers.handyx.pro | PWA reales en vista de prueba | client-fe y specialist-fe `origin/main` (07/11) | publicadas 07/11 |
| | specialist.handyx.pro · api.handyx.pro | variantes en docs de ramas («pedido por Ignacio», 07/11) | specialist-fe y client-fe (ramas) | no existen |
| QR impreso | landing.handyc.com/handyx/ | página con 6 botones | plan-dossiers, decisión 1 (07/11) | **la ruta no existe** |

«workers» nombra dos cosas distintas (la demo de la landing y la PWA real). La marca pública es Handyx, pero la landing,
el portal, la API y el QR viven en handyc.com.

**Cómo publicar `/handyx/`.** El script de la landing (perfil `landing`) solo escribe en la carpeta de landing.handyc.com y
copia sin borrar; no hay fallback de SPA, así que `/handyx/` tiene que ser una carpeta con su `index.html`, enlazada con
barra final. Lo más prolijo es sumarla al repo de la landing (textos en `src/content/*.json`) por PR: lo que entra a
`main` se publica solo. El QR no lleva tokens; si lleva UTM, fijos (`utm_source=impreso&utm_medium=qr&utm_content=<pieza>`).
Los botones de demo deberían apuntar a lo que Ignacio declare canónico, rotulados «Vista de prueba · datos ficticios».

## B · Datos de negocio

Registro: `decks/handyx-aticma/afirmaciones.json` (115; por tipo: proyección 39, supuesto 32, meta 14, informado 14,
ejemplo 10, observado 6; verificación: sin verificar 98, pendiente 12, verificado 5). `dossiers/inventario/material.md`
resume 66 y tiene los SHA de repos desactualizados. Hay un segundo registro anterior, `decks/handyx/afirmaciones.json`
(61, corte 31/10, en ARS y con 10 % + 10 %), que alimenta los decks `handyx`, `handyx-v2` y `handyx-pitch` y el modelo
de escenarios: **dos juegos de números conviven**.

Equivalencia de rótulos para el dossier: *verificado* solo si `verificacion = verificado`; *informado* → «dato
informado»; *supuesto*; *proyección*; *meta* → «objetivo»; *ejemplo* → «ejemplo ilustrativo».

### Cifras clave

| Id | Valor | Tipo | Fuente · corte |
|---|---|---|---|
| PROFESIONES-INICIALES | 6 rubros | **dato verificado** | rubros de la landing y apps · 04/11 |
| MDP-HOGARES | 259.623 | observado, **unidad pendiente** (¿hogares o viviendas ocupadas?) | Ignacio / La Capital (INDEC) · 04/11 |
| LANZAMIENTO | 10/11/2026 | objetivo | Ignacio 26/10 |
| ESP-REGISTRADOS | 56 especialistas registrados (no activos ni verificados) | dato informado, «no mostrar hasta conciliar» | Ignacio 31/10 |
| TRABAJOS-INFORMADOS · PRUEBA-MONTO · PRUEBA-INGRESO-HANDYX | 5 trabajos · $ 350.000 · $ 70.000 de ingreso bruto (10 % + 10 %) | dato informado, de memoria | Ignacio 02–05/11 |
| FEE-ESPECIALISTA · TARIFA-USUARIO | 0 % / 15 % | decisión informada | prompt 04/11; Notion 02/11 |
| COSTOS-MES | USD 400/mes (servidores 100, desarrollo 200, marketing 100) | dato informado (estimación) | Ignacio 04/11 |
| CAC-ESTIMADO · CAC-MAXIMO | ≈ USD 2 (supuesto 50 clientes/mes) · techo USD 6 | proyección | 04/11 |
| LTV-ESTIMADO · LTV-CAC | USD 18 · 9 | proyección con supuestos | 04/11 |
| EQUILIBRIO-TRABAJOS | ≈ 67 trabajos/mes | proyección | 04/11 |
| MERCADO-USD | ≈ USD 10,4 M/año | proyección (1 arreglo × USD 40, supuestos del mentor) | 04/11 |
| META-CUOTA-LOCAL → Q1-TARIFAS-REAL | 25 % del trimestre ≈ 16.200 trabajos ≈ USD 109.000 | objetivo + proyección | 04/11 |
| INVERSION-BUSCADA · INV-* | USD 100.000: 45.000 / 30.000 / 15.000 / 10.000 | objetivo + reparto «a aprobar» | 04–05/11 |
| META-TRABAJOS · META-REPETIDORES | 50 trabajos con tarifa y 5 repetidores (diciembre) | objetivo (MET-01) | Contexto Handy |
| META-1M · META-5M · META-CUOTA-NACIONAL · META-PROFESIONES | USD 1 M en trabajos · USD 5 M de ingresos 2027 · 40 % de Argentina · 72 profesiones | objetivos sin metodología | 04–05/11 |

Fuera del registro ATICMA (decks/handyx, modelo, portal): 100 usuarios + 150 especialistas entrevistados y 43/100
interesados (láminas 02/11) frente a 70 charlas (Notion); TAM LatAm USD 10.000 M / SAM Argentina USD 913 M / SOM MdP
USD 13,3 M (ticket USD 51); escenarios ARS a 13 meses (base: 675 trabajos, ingreso por tarifas $ 1,85 M, flujo neto
−$ 6,1 M, equilibrio 49 trabajos/mes, runway no calculable); pauta de marketing US$ 100/mes (Ignacio 07/11, Guía 10 del
portal); Render a 25 USD/mes y «sin purga» (Ignacio 02/11). Sin dato: usuarios en lista de espera, verificados,
disponibles.

### Las 16 secciones del Dossier 01

| # | Sección | Qué hay (tipo) | Qué falta | Qué se contradice | Recomendación |
|---|---|---|---|---|---|
| 1 | Portada | Logo vectorial; lema | Subtítulo | — | Sobria; un personaje permitido como máximo. |
| 2 | Executive Summary | 6 rubros (verificado); lanzamiento (objetivo); USD 100.000 (objetivo) | Tarifa, estado al 10/11, instrumento | Tarifa; monto | Escribirlo al final con tres cifras rotuladas y el estado honesto del producto. |
| 3 | El problema | Odisea del vecino y del profesional (guion); entrevistas (informado) | Toda estadística de confianza o comparación: sin fuente | 70 charlas vs 100 + 150 | Hipótesis cualitativa rotulada, no estadística. |
| 4 | Nuestra solución | Funciones de las PWA (En pruebas); HandIA (en desarrollo); herramientas por oficio (diseño + rama) | Qué usa gente real el 10/11 | «Apps desarrolladas» vs `main` | Tabla por función con estado, tomada de las auditorías de usuario y especialista. |
| 5 | Ecosistema | Tres superficies con repo, dominio y estado; núcleo común (concepto) | Diagrama de integración | Dominios | Diagrama propio con estado y fecha en cada caja. |
| 6 | Mercado | 259.623 (unidad pendiente); USD 10,4 M (proyección); TAM/SAM/SOM (proyección) | Accesible e inicial con datos; frecuencia, ticket y canal medidos | Ticket USD 40/45/51 y $ 45.000/70.000/80.000; «casi» vs «más de» 260.000; Notion: «ejemplos del mentor, no evidencia» | Abajo-arriba con cada factor rotulado y una sola moneda; proponer investigación. |
| 7 | Modelo de negocio | Confirmado (Notion 02/11): 0 % / 15 %; en evaluación: rendición vs split; futuro: Business, apps a medida, ferreterías (concepto) | Contribución por trabajo con 0/15; cobro en efectivo | Ver **Tarifas** | Tres columnas; «ingreso bruto, antes de costos». |
| 8 | Competencia | Clickie, Home Solution, Checkatrade, Muovi + IguanaFix, Servidos, Yo te lo arreglo, Zolvers, Ay Fix, GoFixii, Thumbtack, Angi, Taskrabbit; alternativa: conocidos y grupos | Revalidación con fecha | Clickie 15 % + 5 % vs + 10 %; Muovi cero vs monto fijo; anexo anonimizado vs imágenes con nombres | Tabla por modelo de cobro, sin «le gana». |
| 9 | Adquisición | Digital: ads con IA (Seedance 2.5) por barrio y urgencia, IG/FB/LinkedIn con UTM, búsqueda local. Físico: porteros y administradores (probado, informado), postes, volantes, remeras, ferreterías (sin alianzas), comercios con QR, volante A5 por barrio. Medición y 6 experimentos con umbrales (growth.md) | TikTok, remarketing, SEO: no documentados; referidos: solo propuesta; atribución UTM: pendiente; cuentas: [A CONFIRMAR]; ningún resultado medido | CAC sobre clientes nuevos vs sobre primer trabajo; captación USD 100 vs $ 200.000 vs USD 45.000 | Dos ejes con «previsto · en ejecución · medido»; **CAC techo USD 6 «a medir»** sobre primer trabajo completado. |
| 10 | Crecimiento | Plan trimestral del pitch (objetivo); condición de expansión (densidad, repetición, contribución) | Recursos, indicadores y gates por etapa | «Consolidar antes de replicar» vs «toda Buenos Aires en 3 meses» | Etapas sin fechas, con gate; el plan trimestral como visión. |
| 11 | Roadmap | Construido / en pruebas / planificado (ver ecosistema) | Fecha de backend en producción; operaciones y alianzas | Roadmap del pitch «Hoy…» | Matriz por área y estado. |
| 12 | Proyecciones | Modelo ARS con escenarios y sensibilidad; proyecciones USD del pitch | Escenarios con la tarifa vigente; caja; sueldos; variables medidas | Dos modelos (ARS 10 + 10 vs USD 0/15); el base no llega a 50 cobrados en diciembre vs 16.200 trabajos en el trimestre | Esqueleto de variables + un escenario; nunca ganancia. |
| 13 | Inversión | USD 100.000; reparto 45/30/15/10 «a aprobar» | Instrumento, valuación, plazo, hitos, caja | $ 3–6 M ARS → USD 30.000 + mentor → USD 300.000 → USD 100.000; 40/35/25 → 45/30/15/10 | Categorías del pedido §13; montos solo si Ignacio los confirma; cada partida atada a un hito. |
| 14 | Validación | Producto (estado real); 5 trabajos y 56 registrados (informado, sin conciliar); hitos 50 y 5 | Corte del CRM, comprobantes | **La landing nunca captó: ¿de dónde salen los 56?** | Cuatro bloques: construido · probado · informado sin auditar · próximo hito. |
| 15 | Visión | People + Business, 72 profesiones, ferreterías, HandIA con voz (conceptos) | Frase aprobada | — | Tres líneas sobrias + historia post-ATICMA en una línea + invitación. |
| 16 | Contacto | ignaciogauna.developer@gmail.com · 223 667-4044 · landing.handyc.com; QR /handyx/; portafolio | Página /handyx/ publicada | handyc.com vs handyx.pro | Bloque idéntico en las cinco piezas. |

**Investigación de mercado que faltaría (propuesta):** INDEC Censo 2022 (cuadro de hogares por partido) y estadísticas de
la Municipalidad de General Pueyrredon para fijar la unidad; INDEC ENGHo 2017/18 (gasto de los hogares en mantenimiento y
reparación de la vivienda) para el ticket y la frecuencia; una encuesta propia corta por barrio (frecuencia de arreglos,
rubro, gasto, canal); padrones de instaladores matriculados (gas, electricidad) para dimensionar la oferta; volumen de
búsquedas locales por rubro (Keyword Planner, Trends); precios publicados por rubro como referencia.

### Tarifas: línea de tiempo (sin elegir)

| Fecha | Versión | Fuente |
|---|---|---|
| 23/10 | 10 % al cliente + 10 % al especialista | Contexto Handy §7 vía `decks/handyx` (TARIFA-USUARIO/ESPECIALISTA) |
| 23/10 | Camada fundadora: primeros 50 al 5 % (duración pendiente; el 31/10 «5 % durante el primer año») | Contexto Handy §7 vía `decks/handyx` |
| 27/10 | Primer mes sin tarifa desde el 10/11, para los dos lados, sin fecha de fin | landing CLAUDE.md («decisión de Ignacio del 27/10»), commit `11a6e89`; trailers y anuncios |
| 29/10 | Camada: 5 % durante 12 meses, que empiezan después del primer mes | landing `tarifas.json`, `especialistas.json` (publicada) |
| 29/10 | Fee 0 % en la demo cerrada 10/11–10/12, sin inferir tarifa posterior | CLAUDE.md y handoffs de las PWA |
| 30/10 | Prueba con porteros cobrada al 10 % + 10 % | `PRUEBA-COM-*`; `TRABAJOS-SIN-APP` |
| 31/10 | Escenarios: 10 % + 10 % con bonificación del primer trabajo; variante «5 % para todos el primer año» | `docs/handyx/escenarios.md` |
| 02/11 | **0 % al especialista + 15 % al usuario sobre P; se elimina el 0 % del primer mes; 10/11–10/12 con tarifa activa; el especialista cobra P + 15 % y rinde el 15 % con cierre diario.** Pide retirar 0 % primer mes, 5 % y 10 + 10 del copy | Notion CO-MODELO-20261102 (🟢 Cerrado) |
| 04/11 | Pitch: 0 % / 15 %, ejemplo $ 100.000 → $ 115.000; plan mes 1 «tarifa del 15 % cobrada en la app» | `afirmaciones.json`, escenas a-competencia y x-mes-1 |
| 05/11 | «El plan dice 15 % desde el mes 1 y las apps prevén 0 % hasta el 10/12 (elegir)» — sin cierre | `docs/handoff.md` |
| 07/11 («08/11» en el texto) | «Al especialista Handyx no le cobra comisión nunca»; fee 0 % en la demo; ninguna tarifa sin política aprobada — sin implementar | client-be y specialist-be, rama `claude/pensive-hypatia-jajjgm` |
| 07/11 | PWA publicadas: tarifa de Handy 0 % hasta el 10/12 | client-fe y specialist-fe `origin/main` |

**Flujo del dinero.** La landing dice a la vez «Handyx retiene solo su tarifa» y «la plata del trabajo no pasa por
Handyx»; las API, «Handy no recibe ni distribuye el pago»; el pitch, «el circuito de cobro está en implementación; en
las pruebas lo coordinamos a mano». Solo la rendición del 02/11 (Notion) concilia esas frases, y ningún texto público la
explica. La landing promete además «tus tarjetas» en Pagos, mientras las PWA prohíben «Agregar tarjeta».

### Competencia, adquisición, validación y etapas

- **Competencia** (pitch, escena 6 y anexos): Clickie, Home Solution, Checkatrade, Muovi; también IguanaFix, Servidos,
  Yo te lo arreglo, Zolvers; Ay Fix (MX), GoFixii (CO); Thumbtack, Angi, Taskrabbit. Fuentes: prensa y comparadores del
  04/11 y términos de Clickie y HomeSolution consultados el 02/11 (Notion); Taskrabbit con datos en conflicto. Ninguno
  revalidado desde esta red.
- **Adquisición.** Documentada como estrategia prevista; no hay experimentos en ejecución ni resultados medidos. La pauta
  real decidida es US$ 100/mes; la atribución por UTM no existe todavía en la landing.
- **Validación respaldable hoy:** el código y lo publicado (con fechas y runs). Los 56 registrados y los 5 trabajos son
  datos informados por Ignacio sin auditar; nunca «verificados» ni «activos».
- **Etapas:** construido = landing, demo, portal, BE de captación en `main`; en pruebas = PWA (preview) y API (ramas);
  diseñado = lienzos; concepto = HandIA con voz, 72 profesiones, Business, ferreterías, expansión regional.

### Equipo, capital, visión y contacto

Equipo según el pitch: Ignacio (fundador; desarrollo, producto y coordinación), Abigail (diseño y marketing, dedicación
parcial) y agentes de IA supervisados por Ignacio. Imprimir el nombre de Abigail requiere su OK. Capital: ver sección 13.
Visión: «Soluciones, no problemas»; las versiones del pitch («arreglar el mundo», IPO) no van en el formal. Contacto
decidido: **ignaciogauna.developer@gmail.com · 223 667-4044 · landing.handyc.com**.

### Narrativa ATICMA

Hechos con fuente: semifinal de ATICMA Emprende 2026 el 05/11 y final el 13/11 en Paseo Aldrey (Notion, fuente oficial
consultada el 23/10); el premio era un viaje con agenda en Silicon Valley, no inversión (FUND-03); **Handyx no clasificó a
la final** (Notion, 06/11); Ignacio decidió ofrecer gratis a los finalistas piezas de difusión, canalizado vía ATICMA y con
aprobación de cada uno (Notion, 06/11). **Los finalistas no figuran en ninguna fuente**, y su número no coincide: el pedido
dice cuatro; Notion, «tres, dato aportado por Ignacio, pendiente contrastar». El motivo personal registrado en Notion no
debe usarse.

Línea sugerida: «Handyx se presentó en la semifinal de ATICMA Emprende 2026. No llegamos a la final; usamos lo aprendido
para ordenar el producto, los números y esta documentación.» Invitación: ayuda sin costo a los finalistas para preparar
materiales de presentación, con el OK de ATICMA y de cada uno, sin usar sus nombres sin permiso.

## C · Material del pitch

217 imágenes 1920×1080 (60 escenas), todas renderizadas por el motor: ilustración vectorial nítida, **ninguna parece
generada por IA**. Los teléfonos chicos dentro de las láminas tienen texto ilegible a tamaño de impresión pequeño; para
imprimir conviene re-renderizar en alta (`scripts/video-pitch/vista-animacion.cjs`) o usar los originales de 828×1792
(`demo-landing/`, `conceptos/`, `capturas/`).

**Personajes.** El pitch usa ocho: Foco, Llave, Engranaje y Brocha (permitidos) y **Gota, Canilla, Medidor (gas) y Aire**
(no permitidos). La lámina 131 los presenta como personajes de marca. **105 de 217** imágenes muestran alguno fuera de la
lista. Imágenes solo con personajes permitidos (o sin personajes):
011–013, 019–021, 023–026, 029–032, 038–040, 047–052, 059–064, 071–076, 083–088, 095–097, 099–111, 115, 119–121, 123–130,
134–136, 140, 142, 145–146, 148–151, 156–158, 166–175, 178–179, 181, 187–190, 195, 199, 203–207, 213–217.
Hay que re-renderizar sin ellos las escenas más útiles: la odisea (002–005), HandIA (006–010), Ya empezamos (014–017),
océano azul (027), validación (112–114), roadmap (116–118), marketing (138–139, 141), mapa (183–186) y el cierre (033–036).

| Escenas (imágenes) | Uso sugerido | Personajes fuera de lista | Bajar de tono / riesgo |
|---|---|---|---|
| a-odisea (001–005) | D01 · 3 problema; tríptico panel 4 | Canilla, Gota (+ Medidor, Aire en 001) | — |
| a-handia (006–010) | D02; D01 · 4 «en desarrollo» | Canilla, Gota; 010: Medidor, Aire | «Costo aproximado $ 40.000 a $ 60.000» y presupuestos de ejemplo |
| a-profesional (011–013) | D03; D01 · 4 | — | Herramientas = diseño propuesto; cifras $ 820.000/$ 210.000 de muestra |
| a-empezamos (014–017) | D01 · 14 solo si se concilia | todos | 5 trabajos, $ 350.000, $ 70.000, 56: sin conciliar |
| a-mercado (018–022) | D01 · 6 (019–020 como base de un diagrama) | 018, 022 | 25 %, USD 109.000, 72, 40 % de Argentina |
| a-competencia (023–027) | D01 · 7 (026), 8 (024) | 027 | «Eliminamos… creamos 24 desarrollos», océano azul |
| a-equipo (028–036) | D01 · equipo (029), 13 (030) | 028, 033–036 | **Silicon Valley (031), «arreglar el mundo» (033)**, «sueños» (028) |
| q-01 … q-20 (038–097) | solo el texto de las respuestas | Gota, Canilla, Medidor y Aire alternan por pregunta | q-03, q-11, q-14–17, q-20: 25 %, USD 1 M, USD 5 M, multiplicar, cripto, IPO, Buenos Aires en 3 meses |
| x-proyeccion, x-costos, x-cac (099–110) | D01 · 6, 9, 12 | — | «Mantener Handyx cuesta poco» (sin sueldos), «Un cliente cuesta menos de lo que deja» (supuestos) |
| x-validacion (111–114) | D01 · 14 (114) | 112–114 (íconos) | «Ya probado» sobre apps y cobros |
| x-roadmap (115–118) | D01 · 11 (referencia) | 116–118 | «Toda Argentina», 40 % |
| x-competidores, x-competidores-mundo (119–126) | D01 · 8 | 122 | «Cómo Handyx le gana a cada modelo» (121), mar rojo |
| x-ux-ia (127–130) | D01 · 4 | — | HandIA = en desarrollo |
| x-marca (131–134) | 134 para tríptico y D01 · 5 | 131–133 | «Los chicos los recuerdan» = estrategia |
| x-publicidades, x-marketing (135–141) | D01 · 9 | 137–139, 141 | «Hechas con IA» = plan; cuadros de trailers con «Primer mes sin tarifa» |
| x-herramientas-1/2 (142–147) | D03 | 143–144, 147 | Diseño propuesto |
| x-negocios, x-profesiones (148–155) | D01 · 15 visión | 152–155 | «Restaurante La Perla» y nombres de muestra; profesiones no confirmadas |
| x-plan-3m, x-mes-1…3, x-trimestres (156–174, 160–165) | visión, no el formal | 159–165 | **«Lo que logramos en 3 meses» es un plan**; mes 1 con 15 % cobrado; Buenos Aires en 3 meses |
| x-inversion (175–178) | D01 · 13 | 176–177 | Reparto «a aprobar» |
| x-un-millon, x-5m (179–190) | no (o anexo rotulado) | 180, 182 | USD 1 M, USD 150.000, USD 5 M |
| x-mapa, x-business (183–194) | D01 · 15 visión (186) | 183–186, 191–194 (Aire) | Concepto |
| x-multiplicar-1/2, x-circulo (195–206) | D01 · 7 futuro como lista; 205/206 sin «multiplica» | 196–198, 200–202 | **Tesorería con cripto**, «las ganancias trabajan dos veces» |
| x-ferreterias, x-handia-voz (207–213) | D03 / D02 visión | 208–212 | Visión sin alianzas; voz «a integrar» |
| x-ipo (214–217) | no | — | **IPO, MercadoLibre, Globant** |

**Otro material.** Capturas reales de las PWA (`capturas/`, 20): buenas para D02/D03 y el tríptico, con el rótulo
«Pantalla de la PWA · datos de prueba»; muestran «comisión $ 0» y «0 % hasta el 10/12». Demo de la landing (7): incluye
«Consorcio Alberti 2300», calle real de Mar del Plata, que puede leerse como cliente real. Conceptos de herramientas
(9) y app del local: «Diseño propuesto», con «La Perla» y nombres de muestra. Posters de anuncios y trailers: **«Primer
mes sin tarifa»** y Canilla/Gota, no usar. Fotogramas del clip del mundo: `mundo-mar-del-plata.jpg` sirve sin
personajes; el resto tiene personajes fuera de lista y «arreglar el mundo». Personajes permitidos en
`bombilla|engranaje|llave|brocha-{a,b,c,d}.webp`.

### Capturas recomendadas para el Dossier 01 y el tríptico

| Imagen | Uso | Rótulo | Motivo / riesgo |
|---|---|---|---|
| `S/capturas/pitch/134.png` | tríptico panel 6 · D01 · 5 | Muestra · datos ficticios | Tres teléfonos con Foco y Llave; re-renderizar en alta |
| `S/capturas/pitch/129.png` | D01 · 4 | Concepto | Tres experiencias del mismo arreglo, sin cifras |
| `S/capturas/pitch/026.png` | D01 · 7 | Ejemplo ilustrativo | $ 100.000 → $ 115.000; depende de la tarifa que confirme Ignacio |
| `S/capturas/pitch/120.png` | D01 · 8 | Datos públicos · a revalidar | Mapa por modelo de cobro |
| `S/capturas/pitch/100.png` | D01 · 6 (base de un diagrama) | Proyección · supuestos | Cuenta abajo-arriba |
| `S/capturas/pitch/110.png` · `106.png` | D01 · 9 y 12 | Proyección | CAC techo USD 6 y equilibrio; corregir títulos |
| `S/capturas/pitch/114.png` | D01 · 14 (si se concilia) | Dato informado por el fundador | Íconos fuera de lista |
| `S/capturas/pitch/175.png` | D01 · 13 | Propuesta a aprobar | Uso del capital sin personajes fuera de lista |
| `S/capturas/pitch/138.png` · `186.png` | D01 · 9 y 15 | Plan / concepto | Re-renderizar sin la Gota |
| `brands/handyx/assets/capturas/usuario-propuestas.webp` · `especialista-presupuesto.webp` | tríptico panel 5 · D01 · 4 | Pantalla de la PWA · datos de prueba | Muestran el 0 % |
| `brands/handyx/assets/video/mundo-mar-del-plata.jpg` | tríptico panel 3 o D01 · 6 | Ilustración | Sin personajes ni promesas |

**Tríptico.** Sin cifras financieras; a lo sumo 6 rubros, Mar del Plata y la fecha de lanzamiento confirmada. Portada con
logo y un personaje permitido (no 001 ni 035). Panel 2 con contacto y QR (la ruta todavía no existe). Panel 4 con la
odisea re-renderizada sin Canilla ni Gota. Panel 5 con capturas reales rotuladas. Panel 6 con las tres superficies y su
estado en una palabra.

## Contradicciones (resumen; detalle con fuente y fecha en el JSON)

1. **Tarifa** al 10/11: 10 + 10 con primer mes gratis y camada (landing publicada) · 0/15 sin mes gratis (Notion 02/11) ·
   0 % hasta el 10/12 (PWA publicadas) · 15 % cobrado en el mes 1 (pitch) · «sin comisión al especialista nunca» (ramas de
   las API, fechado 08/11).
2. **Cobro:** «retiene su tarifa» vs «la plata no pasa por Handyx» vs rendición diaria; «tus tarjetas» vs «sin Agregar tarjeta».
3. **Inversión:** $ 3–6 M ARS → USD 30.000 + mentor → USD 300.000 → USD 100.000; reparto 40/35/25 → 45/30/15/10.
4. **56 registrados en el preregistro** vs landing que nunca captó en producción.
5. **Ticket:** $ 45.000 / $ 70.000 / $ 80.000; USD 40 / 45 / 51.
6. **Mercado:** hogares vs viviendas; «casi» vs «más de» 260.000; TAM/SAM/SOM (USD 13,3 M local) vs USD 10,4 M.
7. **Entrevistas:** 70 charlas vs 100 + 150.
8. **Costos:** USD 400/mes vs Render 25 USD + modelo con fijos $ 300.000 sin sueldos.
9. **CAC:** sobre clientes nuevos (USD 2) vs sobre primer trabajo completado (modelo).
10. **Expansión:** consolidar antes de replicar vs toda Buenos Aires en 3 meses y 40 % de Argentina en 2027.
11. **Dominios:** handyc.com vs handyx.pro; «workers» con dos destinos.
12. **Finalistas:** cuatro (pedido) vs tres (Notion).
13. **«Especialistas verificados»** en la landing vs ningún verificado medido.
14. **Retención:** borrado a los 12 meses vs «sin purga».

## Preguntas para Ignacio (priorizadas)

1. **¿Qué tarifa rige desde el 10/11 y cómo se cobra?** ¿Se retiran 10 + 10, camada fundadora y «primer mes sin tarifa» de
   la landing? → bloquea D01 · 2, 7, 9 y 12, el tríptico y la elección de capturas.
2. **¿De dónde salen los 56 registrados y se pueden conciliar los 5 trabajos con comprobantes?** → bloquea D01 · 14 y el resumen.
3. **¿USD 100.000 sigue siendo el pedido?** ¿Instrumento, plazo, caja propia; se publica el reparto o solo categorías? → D01 · 12 y 13.
4. **Dominio canónico y página /handyx/:** ¿qué demos enlaza, se crea en el repo de la landing y cuándo se autoriza el deploy? → QR de las cinco piezas.
5. **¿Qué cifras aspiracionales del pitch entran al Business y con qué tono?** (25 %, USD 109.000, USD 1 M, USD 5 M, 40 %, Buenos Aires en 3 meses, IPO, cripto) → D01 · 6, 10, 12 y 15.
6. **¿Qué podrá usar gente real el 10/11?** → D01 · 2, 4, 11, 14 y tríptico panel 6.
7. **ATICMA:** ¿cuántos finalistas, cuáles, y la invitación va por ATICMA? → D01 · 15.
8. **Mercado:** ¿hogares o viviendas? ¿qué ticket es la base? → D01 · 6 y proyecciones.
9. **Costos mensuales reales y sueldos** → D01 · 12.
10. **Equipo y evidencia cualitativa:** ¿se imprime el nombre de Abigail?, ¿se nombra al mentor?, ¿70 charlas o 100 + 150? → D01 · 3 y equipo.
11. **¿Se nombran competidores en un impreso** (previa revalidación)? → D01 · 8.
12. **¿La decisión «sin comisión al especialista, nunca» es del 07/11 o del 08/11?** → trazabilidad de tarifas.

## Riesgos de publicación

| Riesgo | Dónde | Recomendación |
|---|---|---|
| Tarifas contradictorias impresas | capturas de las PWA, posters, pitch, landing | Sin porcentajes en el tríptico; en el D01, solo la tarifa confirmada con fecha |
| Tracción sin conciliar como logro | 56, 5 trabajos, $ 350.000, $ 70.000 | «Dato informado por el fundador, sin auditar» o fuera |
| Aspiración leída como pronóstico | 25 %, USD 100.000/109.000, USD 1 M, USD 5 M, 40 %, 72, Buenos Aires en 3 meses | Rótulo «objetivo», fuera del resumen; preferir los hitos 50 y 5 |
| Ingreso bruto como ganancia | «ingresos para Handyx», «las ganancias trabajan dos veces», «el círculo que multiplica» | Siempre «ingreso bruto, antes de costos» |
| Tono de pitch | «arreglar el mundo», Silicon Valley, IPO, cripto, «le gana», «Lo que logramos en 3 meses» | Fuera del formal o una línea de visión |
| Personajes fuera de lista | 105 de 217 imágenes | Re-renderizar con Foco, Engranaje, Llave y Brocha |
| «Verificado» sin dato | landing («Especialistas verificados»), Business («técnicos verificados») | Describir el proceso, no el estado |
| Estado del producto sobredimensionado | «apps desarrolladas», roadmap «Hoy» | «Vista de prueba con datos ficticios; backend en desarrollo» + fecha |
| Muestras que parecen reales | «Consorcio Alberti 2300», «Restaurante La Perla», nombres de muestra | Rótulo «Muestra · datos ficticios» |
| Personas reales | Abigail; listados de contactos en Notion | Consentimiento; nunca usar listados |
| Competidores sin revalidar | Clickie, Muovi, Taskrabbit | Revalidar con fecha o describir solo el modelo |
| Relato ATICMA | motivo personal en Notion | Una línea sin motivos ni repechaje |
| QR a una ruta inexistente | landing.handyc.com/handyx/ | Publicar y probar antes de imprenta |
| Plazos de privacidad | 12 meses vs sin purga | No imprimir plazos de retención |
