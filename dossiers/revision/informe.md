# Revisión integral · ola 5 · Colección Handyx

Revisor independiente, 07/11/2026. Material revisado:

- `salida/dossiers/<pieza>/`: PDF de imprenta, PDF digital y PNG a 150 ppp de las cinco piezas.
- La guía de plegado.
- Los zips de `salida/entregables/dossiers/`, que verifiqué iguales byte a byte (md5) a los PDF revisados, igual que los de `pdf-para-landing/`.

Los hallazgos, con su arreglo, están en `hallazgos.json`: 47 en total (3 bloqueantes, 12 importantes y 32 menores).

## Veredicto

La colección está muy por encima de una plantilla. Tiene una sola familia visual, jerarquía clara y capturas reales rotuladas. Y su gran activo es la honestidad: cada función lleva su estado, cada cifra su tipo, fuente y corte, y la tracción va rotulada «dato informado por el fundador · sin auditar».

Todavía no se puede imprimir. Faltan tres cosas:

1. Publicar el destino del QR: hoy da 404.
2. Corregir una afirmación falsa del 03 sobre las reseñas, que además contradice al 02.
3. Conseguir el OK de Abigail para imprimir su nombre.

Después vienen doce correcciones importantes, casi todas de coherencia entre piezas: calendario, hito de diciembre, Mercado Pago, verificación de pagos, el 15 % y la landing. Todas son cambios de texto, salvo el contraste de una ceja y la guía de plegado.

## Puntaje del inversor (1 a 5)

| Pregunta | Tríptico | 01 | 02 | 03 | 04 | Conjunto |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| ¿Entiendo qué es Handyx? | 5 | 5 | 5 | 5 | 5 | 5 |
| ¿Entiendo qué problema resuelve? | 4 | 4 | 4 | 4 | 4 | 4 |
| ¿Comprendo cómo funciona? | 4 | 5 | 5 | 5 | 5 | 5 |
| ¿Veo una oportunidad de negocio? | 2 | 3 | 2 | 3 | 2 | 3 |
| ¿Entiendo cómo pretende generar ingresos? | 1 | 4 | 2 | 2 | 3 | 4 |
| ¿Sé qué está desarrollado y qué falta? | 3 | 4 | 5 | 4 | 5 | 4 |
| ¿Comprendo para qué necesita inversión? | 1 | 3 | 2 | 2 | 2 | 3 |
| ¿Tengo razones para pedir una reunión? | 3 | 4 | 3 | 3 | 4 | 4 |

El porqué de cada número está en `hallazgos.json → puntaje_inversor`. En síntesis:

- **Muy fuerte** en qué es, cómo funciona y qué está hecho. Es lo que mejor resuelve la colección.
- **Débil en la oportunidad.** Hay una sola cuenta de supuestos (≈ USD 10,4 M), el mercado total y el accesible figuran como «[a investigar]», y la Visión contradice a la p. 8.
- **Débil en el para qué de la inversión.** Hay USD 100.000 con reparto, pero sin plazo ni instrumento, y atados a un hito de diciembre que depende de una tarifa en evaluación.
- **El tríptico no dice cómo gana dinero Handyx ni que busca inversión.** Es coherente con «sin cifras», pero una línea cualitativa sobre el modelo entra (R-020).
- **Los dossiers de producto (02, 03 y 04) no conectan lo que falta con la inversión del 01.** No hace falta que lo hagan en detalle, pero una frase por pieza («esto financia el Dossier 01, partida X») ayudaría.

## Bloqueantes

- **R-001 · QR sin destino.** El QR decodifica `https://landing.handyc.com/handyx/` en las cinco piezas, pero `/handyx/` existe solo en la rama `claude/modest-gauss-jin0gy` de Handy-landing-page-fe (sin merge a `main`, que es lo que se publica). Además, `public/handyx/` no tiene los PDF.
  - Hay que mergear con el OK de Ignacio, subir los cuatro PDF, esperar el deploy y escanear una prueba impresa.
  - Desde esta sesión no se puede abrir el dominio (el proxy da 403): la evidencia es el estado del repo.
- **R-002 · 03 p. 17, reseñas.** La pieza dice: «No existe un sistema de calificaciones ni de opiniones de clientes, ni en el código ni en el plan». Es falso según la auditoría: la reseña está En pruebas en una rama (U-S-11) y el perfil con opiniones está Diseñado (U-C-08 y E-CU-02). Además contradice 02 p. 11, 16 y 18.
- **R-003 · 01 p. 19, «Abigail».** Es una persona real sin consentimiento registrado; la auditoría pide su OK. Si el OK no llega, va el rol sin nombre.

## Importantes

| Id | Pieza · p. | Qué |
|---|---|---|
| R-004 | 01 · 3 | «Nov. 2026 · lanzamiento previsto» frente a backends sin desplegar, el 03 (despliegue al final de las olas, sin fechas) y el 02 (fechas [a definir]). |
| R-005 | 01 · 16 (13, 17) | El hito «50 trabajos con tarifa» depende de un 15 % sin aprobar ni implementar, y «cada partida se rinde contra diciembre» choca con «Plazo [a definir]». |
| R-006 | 01 · 18 | El 40 % nacional y los USD 5 M contradicen la p. 8 («no fija cuotas de mercado») y la p. 13. Los USD 5 M equivalen a ≈ USD 33 M en trabajos, 3× el mercado inicial. |
| R-007 | 01 · 9 (5, 6) | Mercado Pago figura como «Confirmada · desde el lanzamiento», pero está En pruebas con la integración cerrada. |
| R-008 | 01 · 7 | Imprime una versión de quién verifica un pago, una contradicción abierta que el 02 evitó a propósito. |
| R-009 | 01 · 17 | «56 especialistas registrados» con el registro de la landing cerrado: falta el canal (y el consentimiento). |
| R-010 | 02 · 6 (19) | Es el único dossier que no dice «después, 15 %, en evaluación» (decisión 5). |
| R-011 | conjunto | La landing y la demo a las que lleva el QR todavía dicen 10 % + 10 %, primer mes sin tarifa y camada al 5 %. |
| R-012 | 03 · 2 (02, 04) | Numeración de secciones tomada del pedido interno: en el 03 va 10 → 13 → 11–12 → 13 → 13 → 13. |
| R-013 | Tríptico · 2 | Ceja «EL ECOSISTEMA» en azul sobre navy: contraste 2,4:1. |
| R-014 | Guía de plegado | «Volteo por el lado largo»: para un apaisado que se gira de izquierda a derecha corresponde el lado corto. Hay que confirmarlo con una prueba plegada. |
| R-015 | Tríptico · 1 | «…con seis rubros y especialistas de cada barrio»: es una cobertura sin respaldo. |

## Menores (resumen por tema)

- **Tríptico:** títulos con viuda (R-016); chip «En pruebas» que incluye herramientas en diseño (R-017); rótulos sin «datos ficticios» y el chip «Mejor promedio» (R-018); crédito OSM con poco contraste (R-019); falta una línea sobre el modelo (R-020); portada casi igual a la del 02 (R-021).
- **01:** identificadores internos en los pies, y U-R en 02 p. 3 (R-022); «las categorías del pedido» (R-023); umbrales prometidos y no mostrados (R-024); tipo del CAC y techo sobre ingreso bruto (R-025); escenarios vacíos y quince [a definir] dispersos (R-026); «ya está conectado» para algo que está en ramas (R-027); «El producto existe» (R-028); montos distintos en «un mismo trabajo» (R-029).
- **Sistema común:** definición de «Construido» (R-030); jerga como pitch, growth, backlog, sprint, CI o PWA (R-031); rótulo de muestra con cuatro textos (R-032); la tarifa con cuatro tipos de dato (R-033); grafía de «preregistro» (R-044); PDF digitales sin enlaces externos (R-045); viudas en bajadas y subtítulos (R-046); `afirmaciones.json` todavía dice «no mostrar» (R-047).
- **02:** «Comisión de Handy» legible en las capturas de la PWA (R-034); AR rotulado como Concepto pero con chip Diseñado (R-035); teléfono visible frente a número puente (R-036).
- **03:** 16 frente a 12 recorridos (R-037); voz mezclada en los títulos (R-038); capturas de la PWA de 20 a 36 mm, ilegibles (R-039).
- **04:** p. 4 con 80 mm vacíos (R-040); «comisiones» (R-041); «No mostramos ningún número inventado» frente a capturas de muestra (R-042); «el editor frena teléfonos reales y claves» (R-043).

## Controles hechos y resultado

- **Texto** (`pdftotext -layout` de los cinco PDF digitales y scripts):
  - Sin «matriculados», «despachamos», «inmediato», «al instante» ni «en minutos». Como requisito, «matrícula» aparece en el 03.
  - Sin «Handy» suelto en el texto; sí en las capturas de la PWA (R-034).
  - Sin tuteo ni «usted».
  - Sin IPO, cripto, Silicon Valley ni «arreglar el mundo».
  - Sin páginas repetidas entre piezas. Fuera del sistema común (índice, «Cómo leer», contratapa), las piezas comparten solo tres o cuatro frases sueltas de 9 palabras o más, como el título «Arreglar algo en casa todavía es una odisea» del tríptico y del 01, que es aceptable en una pieza que resume.
- **Cifras.** Un script contrastó cada número impreso con `afirmaciones.json`, `auditoria/*.json` y `*.md`, `diagnostico.md`, las decisiones y `growth.md`. Todos están en las fuentes, salvo USD 11.000, que es la suma correcta de IA y herramientas.
  - Revisé a mano tipo y corte de: 6 rubros, 284 (45 · 94 · 116 · 29), 85, 102, 97, 141, 16, 130 (108 + 21 + 1), 11 guías, 259.623, USD 40, ≈ USD 10,4 M, USD 400, USD 6, ≈ 67, USD 2, USD 100.000 y su reparto, 5 trabajos, $ 350.000, 56, 50 y 5, USD 1 M, USD 5 M, 40 %, Clickie 15 %, pruebas 291, 86, 59 y 61.
  - Única discrepancia de tipo: CAC ≈ USD 2 (R-025).
  - El ingreso dice siempre «bruto, antes de costos».
- **QR.** El tríptico y las cuatro contratapas decodifican `https://landing.handyc.com/handyx/` con jsqr (versión 3, 27–29 mm, módulo de 0,94–0,99 mm). En el resto de las 78 páginas no hay otro código legible: el QR de la maqueta de ferretería (03 p. 15) no decodifica.
- **Imprenta:**
  - Páginas: 20, 20, 20 y 16, todas múltiplos de 4; el tríptico tiene 2.
  - Sangrado de 3 mm con TrimBox y BleedBox en las cinco piezas; los fondos a sangre llegan al borde.
  - Nada a menos de 5 mm del corte, salvo las imágenes a sangre de las tapas.
  - Pliegues del tríptico (97/197 mm por fuera, 100/200 mm por dentro) sin contenido a menos de 5 mm.
  - Fuentes embebidas; tamaño mínimo de 5,6 pt, en rótulos.
  - Contraste: dos fallas (R-013 y R-019); los pies de las contratapas pasan.
- **Coherencia.** Las contratapas tienen texto idéntico; «Handyx en una línea» es idéntica; «Cómo leer» es igual salvo lo propio (ingreso bruto en el 01, Portal v2 y Geografía real en el 04). Las tapas siguen la dirección de arte.
- **Seguridad:**
  - Sin pantallas de acceso ni configuración.
  - Nombres de muestra ficticios; el «IG» del fundador ya está reemplazado en el 04.
  - Reclamos con ejemplos neutros.
  - Quedan dos puntos menores (R-018 y R-043) y el nombre de Abigail (R-003), que es bloqueante.
- **Personajes:** en lo revisado solo aparecen Foco, Llave, Brocha y Engranaje.

## Orden sugerido para aplicar

1. **Bloqueantes:** publicar `/handyx/` con los PDF y probar el QR (R-001); corregir 03 p. 17 (R-002); conseguir el OK de Abigail (R-003).
2. **Textos del 01:** R-004 a R-009. Juntos dejan el calendario, el hito y los pagos en una sola versión. Después, 02 p. 6 (R-010).
3. **Landing:** corregir la tarifa y la demo (R-011) antes de repartir.
4. **Tríptico:** ceja (R-013), «de cada barrio» (R-015), guía de volteo (R-014) y menores R-016 a R-021.
5. **Sistema común:** numeración (R-012), rótulos y tipos (R-032 y R-033), `text-wrap` (R-016 y R-046), enlaces en los digitales (R-045).
6. **Cierre:** volver a exportar, volver a correr estos controles (texto, cifras, QR, sangrado, pliegues) y hacer una prueba impresa y plegada del tríptico.
