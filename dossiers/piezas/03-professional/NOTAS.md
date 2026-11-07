# Dossier 03 · Professional App · notas de producción (ola 3, 07/11/2026)

20 páginas A4, en el orden de `dossiers/arquitectura.md` (Dossier 03). Control del exportador: **0 errores, 0 avisos**
(`node dossiers/herramientas/exportar-pieza.cjs dossiers/piezas/03-professional/index.html S/produccion/03-professional 03-professional`).
Sin `data-folio`: la numeración automática coincide con la posición.

## Páginas

| p. | Ceja (sección del pedido §7) | Título | Imágenes | Recorrido (`.flujo`) |
|---|---|---|---|---|
| 1 | Tapa | Professional App | F-InicioDia · Llave y Brocha | — |
| 2 | Contenido | En este dossier | — (índice + cómo leer, copia de `paginas-comunes.html`) | — |
| 3 | 02 El problema del profesional independiente | Mucho oficio, pocas herramientas | 6 íconos de línea · Llave (d) | — (6 hipótesis → función, estado y página) |
| 4 | 03 La propuesta de Handyx | Más que pedidos: un taller en el celular | D6-Bienvenida (recorte de texto) | — (3 reglas + mapa de 5 pestañas) |
| 5 | 04 Registro y perfil profesional | Cargar no es estar verificado | RG-8, OB-Aprobado | E-R-01 |
| 6 | 05 Especialidades y servicios | Sus rubros, sus zonas, sus tarifas | RG-4, H0-ManoObra · 6 rubros | E-R-12 |
| 7 | 06–07 Oportunidades y gestión de solicitudes | Vos elegís qué trabajos tomar | F-Inicio y F-Pedido (recortes sin Canilla), PWA disponibilidad | E-R-02 |
| 8 | 08 Elaboración y envío de presupuestos | Presupuestos con su lista de precios | F-Precio (recorte), H0-Presupuesto | E-R-03 |
| 9 | 09 Comparación y aceptación de trabajos | Cada pedido, una decisión | F-Fecha, F-Revisar, PWA propuesta | — (circuito de una propuesta) |
| 10 | 10 Agenda y organización (muestra aprobada) | Tu día, en orden | F-InicioDia, F-AgendaMes | E-R-04 |
| 11 | 13 Modo trabajo (muestra aprobada) | Del primer paso al informe | H0-Modo, H0-InformeEnviado | — (banda de 3 detalles) |
| 12 | 11–12 Gestión de clientes e historial | La relación vive en el chat | F-ChatAdjuntar, F-AgendaPasadas | E-R-07 |
| 13 | 13 Herramientas administrativas | Cuánto entra, cuánto sale y cuánto queda | F-Herramientas, F-Ingresos, PWA caja | E-R-09 |
| 14 | 13 Obras y equipo | Obras de varios días, en equipo | F-Obra, F-Reparto | E-R-05 y E-R-06 (banda doble) |
| 15 | 13 Ferretería | Los materiales, listos para retirar | FE-Pedido (panel web) con R-Retiro encima | E-R-08 |
| 16 | 14 Herramientas específicas por oficio | Herramientas para cada oficio | T-Taller, T-Tablero · tabla H0–H6 | E-R-10 |
| 17 | 15 Reputación y crecimiento | Crecer con cada trabajo | G-Camino, CU-Perfil | E-R-11 |
| 18 | 16 Roadmap profesional | Qué hay hoy y qué sigue | barra de 102 funciones + plan por olas | — |
| 19 | 17 Cierre (navy) | Handyx quiere ser tu herramienta de trabajo | Brocha (c) · 3 cifras · «Seguí leyendo» | — |
| 20 | Contratapa (amarillo, `tapa-clara`) | Soluciones, no problemas | QR, contacto, colección con 03 `.actual` · Llave (c) | — |

Los 12 recorridos `E-R-*` de la auditoría están en una banda `.flujo` (E-R-04 ya estaba en la p. 10).

## Fuentes

- `dossiers/auditoria/especialista.json` y `.md`: estados de las 102 funciones (ninguno subido), recorridos, capturas
  recomendadas y riesgos, tabla de herramientas por oficio, índice del dossier.
- Capturas del lienzo «App del especialista» en `S/capturas/especialista/` (recortes sin Canilla: D6-Bienvenida,
  F-Inicio, F-Pedido, F-Precio); capturas reales `brands/handyx/assets/capturas/especialista-{disponibilidad,presupuesto,cobro}.webp`,
  chicas (20–36 mm) y rotuladas «Pantalla de la PWA · datos de prueba».
- `docs/handyx/plan-dossiers.md` (decisiones 5 y 7: tarifa y 56 registrados), `dossiers/diagnostico.md`.
- Plan por olas de la PWA (`handyx-specialist-fe`, rama de trabajo, `docs/plan-olas.md`, propuesto y sin aprobar) y
  `docs/herramientas.md` (oportunidades de H2–H6 sin diseño), leídos en `S/repos/handyx-specialist-fe@pensive/`.
- `decks/handyx-aticma/afirmaciones.json`: PROFESIONES-INICIALES (6 rubros, verificado) y ESP-REGISTRADOS (56, informado,
  sin auditar, corte 04/11/2026). 102 funciones, 141 pantallas y 16 recorridos: conteos de la auditoría del 07/11/2026.

## Pendientes impresos como «[a definir]»

- p. 3: un estudio que mida las hipótesis del problema del profesional.
- p. 4: cómo se cobra la tarifa de servicio del cliente (15 %, en evaluación).
- p. 8: cómo se calcula la referencia de precio que sugiere Handyx.
- p. 12: si se suma una ficha o lista de clientes propia.
- p. 15: condiciones comerciales con las ferreterías (no hay alianzas firmadas).
- p. 18: aprobación del plan por olas y sus fechas; proveedores (Mercado Pago, mapas, telefonía, mensajes de texto e IA);
  referencia de precios; ferreterías aliadas; premios del Camino y su revisión legal.

## Decisiones y desvíos de la arquitectura

- **Rótulos.** Cada captura del lienzo lleva «Diseño propuesto»; si muestra nombres o montos que pueden leerse como reales,
  suma el rótulo «Muestra» (definido en «Cómo leer» como «nombres y cifras ficticios»). Un solo rótulo largo no entraba sobre
  celulares de 39 mm. En la tapa, el rótulo pasó a «Diseño propuesto · datos ficticios», como en la tapa del Portal.
- **Índice.** Usa el mismo número de sección del pedido que la ceja; por eso «13» aparece cuatro veces y «Modo trabajo»
  (p. 11, de la doble página aprobada) va antes de «11–12».
- **p. 4.** El mapa de la app es un diagrama propio desde FL-Mapa (no la captura); una nota aclara que en código las
  pestañas todavía son Inicio, Trabajos, Agenda, Mensajes y Cuenta. Se usa un recorte de solo texto de D6-Bienvenida.
- **p. 5.** Sin D6-Alta, RG-9 ni CU-Datos: muestran el medio de los antecedentes (contradicción abierta). Texto neutro:
  «verificación de identidad y antecedentes a cargo del equipo». CU-Perfil pasó a la p. 17 («hoy la reputación es el perfil»).
- **p. 6.** RG-3 se reemplazó por una grilla propia de los seis rubros (con «pide matrícula» en Gas y Aire) para dejar
  lugar a RG-4 (zonas) y H0-ManoObra (tarifas).
- **p. 7.** En lugar de CU-Disponibilidad, la captura real de la PWA con los mismos interruptores: prueba que existe en código.
- **p. 9.** Se agregó el circuito de una propuesta (de «El pedido» a «Acepta / pide otro precio / elige otro día / vence»),
  todo En pruebas; el especialista no compara pedidos entre sí (hueco de la auditoría dicho tal cual).
- **p. 10 y 11 (aprobadas).** Mismo contenido; rótulos con «Muestra», ritmo vertical común y, en la p. 11, una banda de
  tres detalles del modo trabajo (guantes, seguridad primero, pedir ayuda; Diseñado) para no dejar un tercio vacío.
- **p. 13–17.** Por espacio quedaron afuera H0-AgregarMaterial, H0-EquipoDetalle, R-Comparar, T-Informe, OF-Gas,
  G-MiniCamino y F-Regalo; sus funciones están en las tablas. Los avisos de seguridad de las herramientas van en un destacado.
- **p. 16.** Tabla H0–H6 exacta: H0 Diseñado; H1 En pruebas, sin fecha, en una rama y con revisión técnica pendiente;
  H2–H6 Concepto, «posterior al lanzamiento»; más una fila «Oportunidades» (Concepto, sin fecha) con lo que el plan menciona
  sin diseño. Sin «18 herramientas» ni fechas del pitch.
- **p. 18.** El roadmap es el plan por olas de la PWA (olas 0–6 y oficios después), rotulado «propuesto, sin fechas, a la
  espera de aprobación». Lo único Construido es la demo de la landing.
- **p. 19.** Cierre en navy; cifras 141 y 16 (verificado) y 56 especialistas registrados (dato informado, sin auditar,
  «no son activos ni verificados»).
- **Tarifa.** Solo la decidida: al especialista, sin comisión; al cliente, 0 % hasta el 10/12/2026 y después 15 %, en
  evaluación (p. 4). F-Precio, CU-Cobros y OB-Tour ya dicen «Handyx no te cobra comisión». No se usan las capturas reales con
  «Tarifa de Handy durante la demo» (modal y Cuenta).
- **No se imprime** el dominio de la app del especialista (hay tres versiones), pantallas de acceso o seguridad, HandIA con
  fecha ni ferreterías como aliadas.
- **Personajes, con mesura:** Llave y Brocha en la tapa, Llave preocupada en la p. 3, Brocha en el cierre y Llave en la
  contratapa.

## Componentes nuevos (en el `<style>` de la pieza)

- `.rotulos`: dos rótulos juntos («Diseño propuesto» + «Muestra»).
- `.marco`: recorte de pantalla sin dispositivo, con borde y sombra suaves.
- `figure.con-rotulo.lateral`: captura chica de la PWA con su rótulo arriba y la leyenda al costado, sobre cielo.
- `.par.chico` / `.par.mini`: pares de celulares de 36 y 33 mm.
- `.hipotesis` / `.hip` (p. 3), `.tesis` (banda navy), `.principios` / `.principio` (p. 4), `.mapa-app` (p. 4),
  `.rubros` / `.rubro` (p. 6), `.circuito` con `.lineas` y `.salida` (p. 9), `.detalles` (p. 11), `.flujos` (dos recorridos
  en una banda, p. 14), `.compuesta` (panel web con el celular encima, p. 15), `.oficios` (p. 16), `.barra-estados`,
  `.barra-leyenda` y `.olas` (p. 18), `.cifras-cierre` y `.seguir` (p. 19), `.contratapa-pro` (contratapa amarilla con el
  chip `.actual` en navy, porque el amarillo sobre amarillo no se veía).
- Sprite SVG de íconos de línea al inicio del `<body>`: Lucide (ISC, `lucide-static` 0.460.0) y los seis íconos de rubro de
  `brands/handyx/assets/iconos/`, con `stroke="currentColor"`.
- `h1 { text-wrap: balance }` y espacios duros en «0 %», «$ 47.000» y «[a definir]».
