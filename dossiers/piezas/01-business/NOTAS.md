# Dossier 01 · Business & Investment · notas de producción (ola 6)

Estado al 07/11/2026. **24 páginas A4**, estilo «Nocturno» (navy, teléfonos titanio, amarillo como único acento) con tres
páginas hueso para tablas densas (11, 12, 15 y 16 del índice: modelo, competencia, roadmap y proyecciones). Exportado con
`exportar-pieza.cjs`: **0 errores**, 8 avisos (fotos entre 160 y 178 ppp, sobre el mínimo de 150). Sin `data-folio`: la
numeración sale del orden. **Sin personajes** en ninguna página (pedido de Ignacio del 08/11).

## Páginas

| p. | Ceja | Título | Qué muestra |
|---|---|---|---|
| 1 | Tapa | La forma más simple de resolver los arreglos de una casa. | Foto de la Rambla (duotono navy) + maqueta de noche con rótulos + teléfono titanio; lema nuevo |
| 2 | Contenido | El negocio, la oferta y el pedido, sin vueltas | Índice con `data-ir`, «Cómo leer» (estados, rótulos, tipos de dato), Handyx en una línea |
| 3 | 01 Resumen | Un producto en pruebas y un pedido concreto | 4 cifras rotuladas (6 rubros · 0 % · 5 trabajos · USD 100.000), dónde estamos, modelo, qué buscamos, lanzamiento |
| 4 | 02 Problema | Arreglar algo en casa todavía es una odisea | Dos carriles de 5 pasos (hipótesis) + tres preguntas del piloto; foto aérea del faro |
| 5 | 03 Solución | Un arreglo, dos apps y una sola conversación | Zigzag de 4 pantallas que cruza las apps (P-Revisar → F-Revisar → C-Propuestas → S-Pagar) + 3 principios |
| 6 | 04 Ecosistema | Tres superficies para un mismo arreglo | Maqueta de la costa de noche, tres superficies, conectado / falta conectar |
| 7 | 05 Elegir | Cuatro propuestas, una decisión | Héroe C-Propuestas (70 mm) con 4 notas y estados |
| 8–9 | 06 Obra (doble) | Un baño completo, de la propuesta al último pago · Todo queda a la vista, y Handyx no toca la plata | `.etapas` de 6 pasos + 6 pantallas de 50 mm (F-PropuestaObra, O-Propuesta, F-ObraPostulantes, F-ObraDia, O-Repuesto, O-Pagos) |
| 10 | 07 Validamos | Registrarse no es estar verificado | Etapas preregistro → contacto → alta → revisión → habilitado, héroe C-Certificados (64 mm) |
| 11 | 08 Camino | Se sube con trabajos, no con rankings | Héroe G-Inicio (58 mm), escalera de 4 estaciones con estados, reglas |
| 12 | 09 Fugas | Nada lo impide del todo: hacemos que convenga quedarse | M-Chat + S-Informe, 9 mecanismos con estado, cómo se mide, primera prueba |
| 13 | 10 Mercado | Empezamos por un mercado que podemos medir | Cuenta 259.623 × 1 × USD 40 ≈ USD 10,4 M, por qué Mar del Plata, niveles; foto aérea del centro |
| 14 | 11 Modelo | Sin comisión al especialista, una tarifa de servicio para quien pide | Confirmada / en evaluación / futuras, flujo del dinero, ejemplo $ 100.000 → $ 115.000 |
| 15 | 12 Competencia | Cada alternativa cobra de una forma distinta | Tabla por modelo de cobro, diferenciación como hipótesis |
| 16 | 13 Adquisición | Dos ejes de captación, medidos por barrio | Digital y físico (todo «Previsto»), embudo, CAC techo USD 6, ≈ USD 2, pauta USD 100; foto aérea Cabo Corrientes |
| 17 | 14 Crecimiento | Consolidar Mar del Plata antes de replicar | Escalera de 4 etapas con condición para pasar; foto del Provincial y el Casino |
| 18 | 15 Roadmap | Separamos lo construido de lo planificado | Matriz 6 frentes × 3 columnas + orden de lo que sigue |
| 19 | 16 Proyecciones | Proyectamos con variables, no con promesas | Equilibrio 400 ÷ 6 ≈ 67, tabla de variables, escenarios pendientes |
| 20 | 17 Inversión | Una inversión atada a hitos medibles | USD 100.000, barra 45/30/15/10, partidas, condiciones [a definir] |
| 21 | 18 Validación | Avances reales, cada uno con su respaldo | Publicaciones con fecha, 5 trabajos / $ 350.000, 56 registrados, próximo hito 50 + 5 |
| 22 | 19 Preguntas | Las preguntas incómodas | 6 `.duda` sobre navy |
| 23 | 20 Visión | Un problema viejo con una nueva solución que elegís | 3 objetivos rotulados (USD 1 M, USD 5 M, 40 %), equipo, ATICMA, pedido de reunión |
| 24 | Contratapa | — | Foto del Casino, lema, QR al hub, contacto, colección |

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
- **Toques:** coordenadas medidas sobre cada captura a 390 × 844 con la fórmula de la consigna y revisadas en el render.
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
