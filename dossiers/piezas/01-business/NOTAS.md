# Dossier 01 · Business & Investment · notas de producción (ola 7)

Estado al 07/11/2026. **24 páginas A4**, estilo «Nocturno» (navy, teléfonos titanio, amarillo como único acento) con páginas
hueso para tablas densas (modelo, competencia, roadmap y proyecciones). Ola 7 (08/11): pasada de dirección de arte sobre la
ola 6 —mismos textos, estados, rótulos y cifras—, con escenas ilustradas en las páginas de concepto, UI despiezada en la
solución, en «Cuatro propuestas», en la obra y en la verificación, y más aire. Exportado con `exportar-pieza.cjs`:
**0 errores, 0 avisos**. Sin personajes.

## Páginas

| p. | Ceja | Título | Qué muestra (ola 7) |
|---|---|---|---|
| 1 | Tapa | La forma más simple de resolver los arreglos de una casa. | Foto de la Rambla (duotono) + maqueta de noche + teléfono titanio; **nuevo:** tarjeta de propuesta del chat flotando delante del teléfono |
| 2 | Contenido | El negocio, la oferta y el pedido, sin vueltas | Índice, «Cómo leer» (sin cambios) |
| 3 | 01 Resumen | Un producto en pruebas y un pedido concreto | Sin cambios (4 cifras rotuladas, un bloque de estados) |
| 4 | 02 Problema | Arreglar algo en casa todavía es una odisea | Dos carriles más compactos + **escena propia «odisea»** (cada lado con mensajes, notas y esperas; la conexión se corta) en lugar de la foto de fondo |
| 5 | 03 Solución | Un arreglo, dos apps y una sola conversación | **Despiece** sobre azul: M-Chat grande y, flotando, 01 pedido (P-Revisar), 02 propuesta (F-Revisar), 03 tarjeta del chat (M-Chat), 04 pago (S-Pagar); 3 principios; un bloque de estados |
| 6 | 04 Ecosistema | Tres superficies para un mismo arreglo | **Escena `conectar`** con dos guías (quien pide / quien trabaja) en lugar de la maqueta de la costa; tres superficies con estado en texto |
| 7 | 05 Elegir | Cuatro propuestas, una decisión | **Despiece**: C-Propuestas + precio orientativo y la tarjeta de Julián ampliados, 5 guías (orientativo, orden de llegada, precio/fecha/garantía, sellos, aceptar) |
| 8 | 06 Obra 1/2 | Un baño completo, de la propuesta al último pago | Página de imagen: **escena `obra`** a todo el ancho + 6 etapas con estado en texto |
| 9 | 06 Obra 2/2 | Todo queda a la vista, y Handyx no toca la plata | **Despiece** sobre azul profundo: O-Pagos + O-Propuesta (2), F-ObraDia (4), O-Repuesto (5), etapas pagadas (6); reparto, dirección por día, para el negocio |
| 10 | 07 Validamos | Registrarse no es estar verificado | **Escena `verificar`** junto al título; 5 etapas; **despiece** del bloque «Verificado por Operations» (C-Certificados) con 4 guías |
| 11 | 08 Camino | Se sube con trabajos, no con rankings | **Escena `camino`** a todo el ancho con dos recortes de G-Inicio flotando (anillo 8/10, mini camino); escalera de 4 estaciones |
| 12 | 09 Fugas | Nada lo impide del todo: hacemos que convenga quedarse | **Escena propia «quedarse»** (los dos lados dentro del mismo pedido; alrededor chat, propuestas, dirección, garantía, reseñas); 9 mecanismos con estado en texto; cómo se mide |
| 13 | 10 Mercado | Empezamos por un mercado que podemos medir | Sin cambios |
| 14 | 11 Modelo | Sin comisión al especialista, una tarifa de servicio para quien pide | **Escena `pago`** (tono claro) + tres frases de cómo circula el dinero, en lugar del diagrama de cajas |
| 15 | 12 Competencia | Cada alternativa cobra de una forma distinta | Sin cambios |
| 16 | 13 Adquisición | Dos ejes de captación, medidos por barrio | **Escena `barrios`** en lugar de la foto; una sola marca «Previsto» por columna |
| 17 | 14 Crecimiento | Consolidar Mar del Plata antes de replicar | Sin cambios |
| 18 | 15 Roadmap | Separamos lo construido de lo planificado | Estados dentro de la matriz como texto (las pastillas quedan en el encabezado) |
| 19 | 16 Proyecciones | Proyectamos con variables, no con promesas | Sin cambios |
| 20 | 17 Inversión | Una inversión atada a hitos medibles | Sin cambios |
| 21 | 18 Validación | Avances reales, cada uno con su respaldo | Sin cambios |
| 22 | 19 Preguntas | Las preguntas incómodas | Estados de «Hoy» como texto |
| 23 | 20 Visión | Un problema viejo con una nueva solución que elegís | **Escena `equipo`** junto al equipo; ATICMA en una fila |
| 24 | Contratapa | — | Sin cambios |

## Ola 7 · escenas, despieces y componentes

- **Escenas de `plantilla/escenas.js`:** `conectar` (p. 6), `obra` (p. 8), `verificar` (p. 10), `camino` (p. 11), `pago`
  (p. 14, tono claro), `barrios` (p. 16), `equipo` (p. 23). Todas rotuladas como ilustración en la línea de origen.
- **Escenas nuevas, propias de esta pieza** (en un `<script>` del `index.html`, mismo lenguaje: planos de la marca, personas
  sin cara, un acento amarillo; `escenas.js` no se tocó): `odisea` (p. 4) y `quedarse` (p. 12). Se usan con
  `<div data-escena-p="…" data-tono="oscuro">`. Copian la paleta y la función `persona` de `escenas.js`.
- **Recortes** (`img/r-*.webp`, calidad 94, de `S/capturas/…` a 1170 px; caja exacta en `imagenes.json`): r-pedido,
  r-propuesta-esp, r-chat-propuesta, r-pagar, r-orientativo, r-julian, r-propuesta-obra, r-jornada, r-repuesto,
  r-etapa-pagada, r-verificado, r-anillo, r-mini-camino. Se quitaron de `img/` las pantallas que ya no se usan.
- **Componentes nuevos en el `<style>`:** `.desp` (plano de color para un despiece, con `.capa.grano`, `.aro` y `.aro.linea`),
  `.etq` (número + paso + app sobre un recorte), `.guia.g` + `.guia .t` (guía centrada en el punto, con título, línea chica y
  estado), `.est` (estado como texto chico con su ícono: así queda **un solo bloque de pastillas por página**), `.esc`,
  `.via-d`. Ningún `.toque` en esta versión: las guías y las etiquetas los reemplazan.
- **Consistencia de datos ficticios:** en la obra se usa O-Propuesta (etapas de $ 180.000 / 220.000 / 260.000 / 190.000) junto
  a O-Pagos, que coincide; F-PropuestaObra tiene otro reparto ($ 120.000 / 180.000 / 330.000 / 220.000) y quedó afuera para
  no mostrar dos cifras distintas en el mismo despiece. F-ObraDia dice «jornada 3 de 6, martes 17, revestimiento», que
  cuadra con F-PropuestaObra y no del todo con O-Propuesta (detalle del lienzo; no se nota en el recorte).

## Fuentes

`consigna-ola-6.md` (y su agregado del 08/11), `arquitectura.md`, texto revisado de la versión anterior (ola 3),
`auditoria/{negocio,usuario,especialista,portal}.{md,json}` para los estados, `decks/handyx-aticma/afirmaciones.json` para
todas las cifras, `docs/handyx/preguntas.md` y `aticma-preguntas.md` para las respuestas. Fotos: `marca/fotos/*-navy.webp`
con capa navy. Pantallas: `S/capturas/{usuario,especialista}/*.png` → `img/*.webp` (calidad 94, ver `imagenes.json`);
teléfonos en perspectiva copiados de `estilos2/img/`.

## Decisiones

- **Cifras:** solo de afirmaciones.json. Se sacaron de la versión anterior las cifras que no están ahí: «284 funciones» y
  los conteos de pruebas automáticas por repo (291, 86, 59, 61); se reemplazan por texto.
- **Tracción:** 5 trabajos, $ 350.000 y 56 registrados siempre con «Dato informado por el fundador · sin auditar»; los 56
  con el texto de la consigna (planilla propia, con consentimiento). No se imprimen los $ 70.000 ni el 10 % + 10 %.
- **Tarifa:** solo la versión del 07/11 (0 % al especialista; 0 % a quien pide hasta el 10/12/2026; después 15 % en
  evaluación). Todas las pantallas usadas muestran «Tarifa de servicio 0 % hasta el 10/12/2026» o ninguna tarifa.
- **Objetivos** USD 1 M, USD 5 M y 40 % solo en p. 23, rotulados «Objetivo». Sin IPO, cripto, Silicon Valley ni «arreglar el mundo».
- **Pantallas evitadas:** D6-Alta (muestra antecedentes «PDF cargado», contra la regla «nunca como archivo»), C-Aceptar
  (dice «y tu teléfono, solo para este turno», choca con «chat sin compartir el teléfono»), G-Camino (tiene un personaje),
  G-MiniCamino (montos en borrador que se leen como compromiso).
- **Toques:** desde la ola 7 no hay `.toque`; las partes se explican con guías y etiquetas sobre recortes ampliados.
- Lema nuevo en tapa, p. 23 y contratapa. Personajes: ninguno.

## Componentes nuevos (en el `<style>` de la pieza)

`.foto` (foto a sangre o en recuadro con `--capa` navy), `.cifra-r` (cifra con raya y tipo de dato), `.app` (etiqueta de
app), `.ind` + `.leer` (índice y cómo leer sobre navy), `.col-r`, `.carril`/`.paso-o`, `.pregunta-piloto`, `.principio`,
`.obra-col` + `.no-hace`, `.meca` (mecanismo con estado), `.regla-c`, `.cuenta`, `.modelo-col`, `.flujo-din`, `.matriz`,
`.orden`, `.barra-seg`, `.pub`, `.bloque-t`, `.dudas` (variante compacta de `.duda`), `.meta`; ajustes de `.tipo-dato`,
`.estado.concepto`, `.tabla` y `.peldano` sobre `.p-oscuro`.

## Preguntas abiertas para Ignacio

1. Instrumento, plazo y valuación de la inversión (p. 3 y 20): [a definir].
2. Plazo de verificación de un especialista (p. 10): [a definir].
3. Margen, flujo de caja y escenarios (p. 19): pendientes de datos medidos.
4. Recursos e indicadores de las etapas 2 a 4 (p. 17) y origen de cada registro en la landing (p. 16): [a definir].
5. ¿Se puede imprimir «Abigail» (p. 23)? La auditoría pide su OK.
6. Unidad de los 259.623: ¿hogares o viviendas particulares ocupadas?
7. ¿El teléfono del cliente se comparte con el especialista elegido o nunca? (ver contradicciones).
8. ¿Antecedentes solo en persona, o también como archivo cifrado que se borra? (ver contradicciones).

## Contradicciones entre fuentes (señaladas, sin elegir)

- **Teléfono:** `aticma-preguntas.md` #25 dice que el teléfono no se comparte; U-A-04 y la pantalla C-Aceptar dicen que el
  especialista elegido ve el teléfono «solo para este turno». En el dossier se habla de «chat por pedido» sin afirmar ninguna.
- **Antecedentes:** la consigna y el CLAUDE.md del especialista dicen «en persona, nunca como archivo»; E-V-03 (Diseñado) y
  D6-Alta muestran «Antecedentes penales por foto o PDF»; P-E-03 del portal pide «antecedentes en 7 días» en el legajo.
- **Garantía:** la consigna incluye «garantía registrada» como mecanismo; `aticma-preguntas.md` #24 dice «no prometemos
  garantías que todavía no tenemos». Se imprime como Diseñado, con el texto pendiente de Legal.
- **56 especialistas:** la consigna dice «anotados fuera de la landing, en una planilla propia»; `aticma-preguntas.md` #4 y
  ESP-REGISTRADOS dicen «registrados en el preregistro». Se imprime la versión de la consigna.
- **Tarifa y ganancia por trabajo:** `preguntas.md` #7 y #9 todavía dicen 10 % + 10 % y ≈ $ 6.200 de contribución; se usa la
  decisión del 07/11 e INGRESO-POR-TRABAJO (USD 6, proyección).
- **Uso del capital:** `preguntas.md` #19 dice ≈ 40 % captación y ≈ 60 % operación, con un rango de $ 3–6 M; afirmaciones.json
  dice USD 100.000 con 45/30/15/10. Se usa afirmaciones.json.
- **CAC:** `aticma-preguntas.md` #1 lo presenta como «hoy, unos USD 2»; `preguntas.md` #8 dice «todavía no lo medimos». Se
  imprime «todavía no lo medimos», con USD 2 como proyección con supuesto.
- **Ritmo de expansión:** «consolidar antes de replicar» (este dossier) frente a «toda Buenos Aires en 3 meses» (pitch,
  META-BA-MESES); no se imprime el segundo.
