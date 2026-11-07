# Dossier 04 · Operations Portal · notas de producción (ola 3, 07/11/2026)

16 páginas A4, en el orden de `dossiers/arquitectura.md` (sección «Dossier 04»). Control de `exportar-pieza.cjs`:
0 errores; 2 avisos de resolución por encima de 200 ppp (p. 5 `preregistros-v2` a 217 y p. 7 `inicio-v2` a ~213).

## Páginas

| p. | Sección del pedido (§8) | Título | Evidencia |
|---|---|---|---|
| 1 | 1 Portada | Operations Portal | Inicio «para hoy» (lienzo v3) + Engranaje (sin cambios: aprobada) |
| 2 | Índice | En este dossier | Índice con `data-ir`, cómo leer, Handyx en una línea |
| 3 | 2 La importancia… | Operar con criterio desde el primer día | Bienvenida-módulos, 4 principios con estado, barra de las 97 funciones |
| 4 | 3 Arquitectura | Tres superficies, un circuito | Diagrama de capacidades (aprobada; pulido mínimo) |
| 5 | 4 Gestión de clientes | Cada persona anotada, atendida a tiempo | Preregistros v2 + tabla (aprobada) |
| 6 | 5 Gestión de profesionales | Cada especialista, con su próximo paso | Ficha v3 + tabla + recorrido P-RC-03 |
| 7 | 6–7 Supervisión · Seguimiento | Lo urgente, primero | Inicio v2 + tabla; Solicitudes v2 («fuente pendiente») + 4 Concepto |
| 8 | 8–9 Comercial · Transacciones | Medir sin tocar el dinero | Embudo v3 + tabla; flujo del pago directo; tarifa vigente |
| 9 | 10 Incidencias y soporte | Lo grave se responde hoy | Reclamos v3 (ejemplos neutros) + tabla + recorrido P-RC-04 |
| 10 | 11 Analítica | Medir con método | Sistema «05 · Estructura», «¿Cómo viene la semana?», tabla de las 4 preguntas |
| 11 | 12 Cohortes | ¿Atendemos mejor a los que llegan ahora? | Cohortes en tres pasos + esquema propio sin datos + recorrido P-RC-08 |
| 12 | 13 Mapas | El territorio, barrio por barrio | Geometría OSM del Partido + «¿Qué querés ver?» + tabla |
| 13 | 14 Herramientas de supervisión | Quién hace qué, y cuándo | Docs + Tareas (v3) + tabla + recorrido P-RC-05 |
| 14 | 15–16 Escalabilidad · Roadmap | Crecer en orden | Recorrido guiado + tabla; roadmap por condiciones, sin fechas |
| 15 | 17 Cierre | No mostramos ningún número inventado | Estado «Fuente pendiente» (Engranaje) + mapa de líneas de la colección |
| 16 | Contratapa | — | Copia de `paginas-comunes.html` en arena (`tapa-clara`), Engranaje, `.actual` en 04 |

Numeración (revisión integral): secciones 01–13 en orden de lectura, una por página, iguales en el índice y en las cejas; la tabla de arriba conserva la referencia al pedido.

## Fuentes

`dossiers/auditoria/portal.json` y `portal.md` (97 funciones con su estado, recorridos P-RC-02 a P-RC-11, arquitectura,
capturas recomendadas y riesgos, índice); `diagnostico.md`; decisiones de Ignacio en `docs/handyx/plan-dossiers.md`
(tarifa del 07/11). Capturas: lienzo «Portal interno v3» (`S/capturas/portal/`, recortes y re-renders) y portal v2 en
código (`S/repos/portal-capturas-v2/docs/capturas-v2/MOCK-*.jpg`). Mapas: `recortes/mapa-partido-geometria-osm.png` y
`marca/mapa-mdp-blanco.svg` (© colaboradores de OpenStreetMap, ODbL).

## Tratamiento de las capturas (todas rotuladas)

- Re-render de tableros del lienzo con el motor del propio lienzo (`S/ops04/tools/rerender.cjs`, 2x) para reemplazar
  ejemplos de muestra que no se pueden imprimir; el resto del diseño queda igual:
  - Reclamos: «Pérdida de gas sin resolver después del arreglo» → «El trabajo quedó sin terminar» (categoría Servicio);
    «El especialista no se presentó» → «Cambió el horario sin avisar»; «Cobro duplicado en el pago» → «Pidió el informe
    del trabajo»; se quitó «11 de 14 resueltos a tiempo esta semana».
  - Ficha: «Gasista matriculada» → «Gasista». Campaña: «Matrícula verificada» → «Requisitos al día» y la lectura sin
    «matrícula». Docs: el paso con monotributo, CUIT y antecedentes → «Contale cuáles son los próximos pasos para el alta»
    (y sin el menú lateral, que tapaba el modal). Tareas: las iniciales «IG» (el fundador) → «SV» y «Renovar seguro de
    responsabilidad civil» → «Ordenar la carpeta de documentos». Mapa: «especialistas activos» → «especialistas».
- Evitadas: Login, RC-Acceso, Guía (glosario), RC-Legal, Main, Bienvenida y MapaInicio completos (personajes), Legal
  (antecedentes con nombre), Mapa con «Especialistas activos» y cifras, Cohortes con meses y personas, MOCK de
  configuración, legajos, reclamos, tareas y la parte del Inicio v2 con «Ignacio» y un incidente de conducta.
- Analítica y cohortes muestran el método: el esquema de la p. 11 es propio y no usa datos («los tonos no son datos»).

## Pendientes «[a definir]» y límites declarados

- Cómo se cobrará la tarifa al usuario (p. 8). Fechas del roadmap operativo (p. 14).
- Sin datos reales en el portal al 07/11 (captura cerrada, backend sin desplegar): se dice en p. 3, 5, 10 y 15.
- Verificación de especialistas: «a cargo del equipo», fuera del portal y sin el medio (contradicción de antecedentes).
- No se imprime la purga a 12 meses ni las etapas del preregistro (contradicciones abiertas de la auditoría).

## Desvíos de la arquitectura

- p. 1: queda la tapa aprobada (Inicio «para hoy»), no Inicio-sin-sidebar, que muestra el incidente de gas.
- p. 6: sin captura de Legal (antecedentes con nombre); la verificación va como nota.
- p. 7: Inicio v2 recortado arriba (evita «Ignacio» y un incidente) + Solicitudes v2 como evidencia de «fuente pendiente».
- p. 8: se tituló por las dos secciones; el asistente v2 de campañas quedó solo en la tabla (su captura era ilegible chica).
- p. 10: «Sistema · 05 Estructura» suma a Inicio-semana porque muestra fuente, ventana y base (n).
- p. 12: sin recorrido P-RC-06 (no entraba con mapa, captura y tabla); el texto de la página cubre su contenido.
- p. 14: roadmap por condiciones (qué tiene que pasar → qué se habilita), sin RC-Índice (nombra el login en R1).
- p. 15: página navy con el mapa de líneas de la colección en lugar de `mapa-ciudad-geometria-osm`.
- p. 2: «Cómo leer» suma el rótulo «Geografía real» y nombra «Portal v2» en lugar de «Datos de prueba».

## Componentes nuevos (en el `<style>` de la pieza)

`.tramo` (sub-sección numerada cuando una página reúne dos secciones), `.funciones-2` (tabla de dos columnas con
descripción), `.principios`, `.barra-estados`, `.pago` + `.baja` (flujo del dinero), `.tarifa`, `.cohorte` +
`.leyenda-cohorte` (esquema sin datos), `.cifra-mapa` + `.desglose`, `.ruta` (roadmap por condiciones), `.cierre`
(página navy con el mapa de líneas) y `.contra-ops` (contratapa arena con el Engranaje). Rótulo nuevo: «Geografía real ·
OpenStreetMap» (clase `.rotulo` sin variante).

## Revisión integral (aplicada el 07/11/2026)

- R-012: secciones 01–13 en orden de lectura, sin rangos; las páginas dobles llevan subtítulos sin número.
- R-030 y R-032: leyenda común sincronizada con `paginas-comunes.html` («Construido» probado en local; «Muestra · datos
  ficticios»; «Decisión del fundador»). Las capturas del lienzo llevan dos rótulos: «Diseño propuesto» + «Muestra · datos
  ficticios»; las del portal v2, «Pantalla del portal v2 · datos de prueba». Se mantiene «Geografía real» en la leyenda.
- R-031: «sprint» y «backlog» → «ciclo de trabajo» y «pendientes» (p. 7 y p. 13).
- R-033: «Decisión del fundador · 07/11/2026» para «sin comisión» y para el 0 %; «En evaluación» para el 15 %.
- R-040: p. 4 suma «El camino de un preregistro» (se anota → llega cifrado → ficha → contacto).
- R-041: «Transacciones y tarifa de servicio» (índice, ceja y subtítulo de la p. 8).
- R-042: cierre «No mostramos números sin fuente» y bajada ajustada («ningún número de muestra se presenta como real»).
- R-043: «Guías y procesos · Con versiones y controles para no publicar datos personales».
- R-044: grafía «preregistro» en el texto propio (también en el menú de la tapa); las capturas conservan «Pre-registros».
- Decisiones de Ignacio: Mercado Pago «en efectivo; con Mercado Pago cuando se valide la integración» (p. 4 y p. 8);
  lanzamiento «Noviembre de 2026: demo cerrada con invitación; lanzamiento abierto después, fecha a confirmar» (p. 14).
- Contratapa con los enlaces de `paginas-comunes.html` (https, mailto, tel). En «Cómo leer», el rótulo largo de muestra
  ahora puede partirse en dos líneas para no pisar su descripción.
