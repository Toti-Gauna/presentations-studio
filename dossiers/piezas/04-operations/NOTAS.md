# Dossier 04 · Operations Portal · notas de producción (ola 6, 08/11/2026)

Rehecho en la dirección premium v2: «Galería» (páginas blancas y hueso) con aperturas en banda azul, foto real de Mar del
Plata en duotono y la maqueta de día (`iso.js`). Es el **manual del portal interno del equipo**. 20 páginas A4.
Exportación: `exportar-pieza.cjs` con **0 errores** (avisos: elementos a sangre de las bandas y fotos aéreas entre
150 y 220 ppp).

## Páginas

| p. | Capítulo | Título | Imágenes y componentes |
|---|---|---|---|
| 1 | Tapa | El manual del equipo que cuida cada arreglo. | Foto `casino-plaza-navy` a sangre + maqueta + notebook plata en perspectiva con el Inicio (`dispositivo.cjs`) |
| 2 | Índice | El manual del portal | Índice con `data-ir` (7 capítulos), «Cómo leer» v2, «Lo que este manual no muestra», Handyx en una línea |
| 3 | 01 apertura | Detrás de cada arreglo hay trabajo que no se ve | Banda azul + `aerea-centro-playa-azul` + maqueta costa; lema nuevo; cifras 97 / 41 / 0 (auditoría) |
| 4 | 01 | Qué está conectado hoy, y qué no | Circuito landing → captación y CRM ↔ portal; apps en línea punteada (Concepto); «llega hoy / todavía no»; barra 41/15/26/15 |
| 5 | 02 apertura compacta | Lo urgente, primero | Notebook 170 mm con el Inicio, 5 `.toque` + 6 notas |
| 6 | 02 | Cada número dice de dónde sale | Detalle «Para hoy» y «¿Cómo viene la semana?» con toques; recorrido «empezar el día» en `.etapas` |
| 7 | 03 apertura | Cada persona anotada, atendida a tiempo y cuidada | Banda + `aerea-quintas-azul` + maqueta barrio; etapas preregistro → alta |
| 8 | 03 | ¿A quién contactamos hoy? | Notebook 172 mm Preregistros, 5 toques + 6 notas |
| 9 | 03 | Un próximo paso, y los datos bajo llave | Notebook Ficha (4 toques) + Detalle «Datos de contacto · cifrados» (toques 5–6) |
| 10 | 03 | Cargar un documento no es estar verificado | Cómo validamos: 6 etapas, qué se revisa / quién habilita / dónde pasa hoy, Detalle de Legal (legajos), aviso de los 56 registrados |
| 11 | 04 apertura | Lo grave se responde hoy | Banda + `rambla-fuego-azul` (mitad superior, sin la persona) + maqueta; plazos por gravedad |
| 12 | 04 | Tres columnas, ningún olvido | Notebook Reclamos, 5 toques + 6 notas; recorrido del caso |
| 13 | 04 | Nada lo impide del todo. Que valga quedarse | Fuga: 8 mecanismos con estado; cómo se detecta (repetición: sin dato todavía) |
| 14 | 05 apertura | Medir con método, sin inventar | Banda + `casino-plaza-azul` + maqueta; tres reglas de medición |
| 15 | 05 | ¿La campaña está trayendo gente? | Notebook Campaña (4 toques) + Detalle embudo (5–6) |
| 16 | 05 | ¿Atendemos mejor a los que llegan ahora? | Notebook Cohortes (3 toques) + Detalle lectura guiada; contacto hoy, repetición mañana |
| 17 | 05 | El territorio, barrio por barrio | Notebook Mapa (3 toques) + geometría real OSM + Detalle acciones del barrio (4) |
| 18 | 06 apertura compacta | Quién hace qué, y cuándo | Notebook Tareas (4 toques) + Detalle de una guía (Docs) + funciones de docs, legal y registro |
| 19 | 07 | Las preguntas incómodas | 8 `.duda` |
| 20 | Contratapa | Un problema viejo con una nueva solución que elegís. | Foto `rambla-fuego-navy` + maqueta, QR al hub, contacto, colección con 04 marcada |

## Fuentes

- Estado de cada función: `dossiers/auditoria/portal.md/.json` (97 funciones) y, para los mecanismos de la fuga y el alta
  del especialista, `auditoria/usuario.md` y `auditoria/especialista.md`.
- Preguntas difíciles: `docs/handyx/preguntas.md` (n.º 4 fuga, 10 reclamos, 11 cobro) y la consigna de la ola 6.
- Cifras: auditoría del portal (97 / 41 / 15 / 26 / 15, 130 zonas = 108 + 21 + 1, «dato verificado»); `ESP-REGISTRADOS`
  (56, «dato informado por el fundador · sin auditar», con la frase de la planilla propia) y `META-REPETIDORES`
  (5 clientes que vuelvan al 31/12, rotulada «Objetivo · no es un resultado») de `decks/handyx-aticma/afirmaciones.json`.
- Tarifa: decisión del 07/11 (sin comisión al especialista; 0 % al usuario hasta el 10/12/2026; 15 % en evaluación).
- Pantallas: lienzo «Portal interno v3» re-renderizado con su propio motor (`S/ops04/tools/rerender.cjs`) a 2x, con los
  trabajos de `rerender/trabajos-ola6.json`; recortes 16:10 (2880 × 1800) para las notebooks y recortes «Detalle».
  `docs-guia.webp` sale del re-render de la ola 3 (`S/ops04/rr2/docs-v3.png`, sin menú y con el paso neutro).
- Fotos: `marca/fotos/` (archivo del fundador), en duotono azul/navy. Mapa: `recortes/mapa-partido-geometria-osm.png`
  (© colaboradores de OpenStreetMap, ODbL).

## Tratamiento de las capturas (re-render, todas rotuladas «Diseño propuesto · datos ficticios»)

- Inicio: «Pérdida de gas sin resolver» → «El trabajo quedó sin terminar»; «El especialista no se presentó» → «Cambió el
  horario sin avisar»; «Seguro de responsabilidad civil» → «Ordenar la carpeta de documentos»; «Antecedentes de Marina R.»
  → «Revisar la guía de reclamos» y «día 6 de 7» → «en 6 días».
- Reclamos: los mismos reemplazos que la ola 3, «Seguridad» → «Servicio», «Cobro duplicado» → «Pidió el informe del
  trabajo» y sin «11 de 14 resueltos a tiempo».
- Preregistros: «Pintor» → «Cerrajero» (los seis rubros). Ficha: «Gasista matriculada» → «Gasista»; «Por reparto
  automático» → «La asignó el equipo» (el reparto automático es Concepto); WhatsApp de ejemplo más enmascarado; la fila
  «Se vence · noviembre de 2027» → «Retención · según el aviso» (la purga está apagada: no se promete el borrado).
- Campaña: sin «100 USD» ni «≈ 0,6 USD» (→ «Presupuesto cargado», «Sin dato · Fuente pendiente»); «Matrícula verificada» →
  «Requisitos al día». Cohortes: meses → «Mes 1 … Mes 6» y «N personas» → «muestra» (no parece tracción).
- Mapa: «Especialistas activos por barrio» → «Especialistas por barrio». Tareas: iniciales «IG» → «SV», seguro → carpeta.
- Legal: sin «Antecedentes penales de Marina Rodríguez» ni nombres (→ constancia de monotributo de un especialista,
  carpeta de documentos, guía de privacidad del equipo). Docs: sin el paso de antecedentes en 7 días.
- **Sin personajes** (pedido de Ignacio del 08/11): la Llave del Inicio y de la Ficha se ocultó en el re-render; ningún
  SVG de personajes en la pieza.
- Evitadas: Login, RC-Acceso, Guía, Main, Bienvenida, MapaInicio completo, D6-Alta (muestra «Antecedentes · PDF cargado»),
  MOCK de configuración y cualquier detalle de acceso, permisos o infraestructura.

## Decisiones y componentes propios (en el `<style>` de la pieza)

- `.toque` sobre la notebook con `data-x/data-y` en px de la pantalla 1440 × 900 (un script los convierte a % del
  `.tapa-nb`); en los recortes, `data-x/data-y` en px del recorte con `data-w/data-h` en el `.marco`. Los puntos van al
  borde izquierdo del botón para no tapar su texto.
- `.det` + `.det-rot` (recorte «Detalle»), `.notas-fila`, `.notas-grilla`, `.notas-2`, `.funcs` (lista con estado),
  `.circuito` + `.flecha-h`, `.corte`, `.barra-estados`, `.indice-v2`, `.leer`, `.no-mostramos`, `.cifras-3`, `.quien`,
  `.aviso-amarillo`, `.mecanismos`/`.mec`, `.medir`, `.reglas`, `.zonas`, `.credito-foto`, bandas con `.foto` enmascarada
  (gradiente a la izquierda) + `.velo-arriba` / `.velo-abajo`, tapa `.tapa-04` y contratapa `.contra-04`.
- **Número de capítulo**: `.cap-n` con `-webkit-text-stroke` sale como fuente Type 3 y el exportador lo rechaza. Se
  reemplazó por `svg.cap-n-svg` con los contornos reales de Archivo 125/900 (extraídos con fontTools de
  `plantilla/fuentes/archivo-125-900-latin.woff2`) y trazo amarillo vectorial. Componente reutilizable para las otras piezas.
- Las fotos aéreas (1200 px) no alcanzan para el ancho total a 150 ppp: van en la mitad derecha de la banda, con máscara.

## Preguntas abiertas para Ignacio

1. ¿Dónde y con qué herramienta verifica Operations a los especialistas desde el 10/11? (hoy, proceso privado en una rama).
2. ¿Quién emite los códigos de invitación de la demo cerrada y con qué herramienta? (impreso «a definir»).
3. ¿Cómo se cobrará la tarifa al usuario si el dinero va directo al especialista? (impreso «a definir»).
4. ¿El portal publicado el 07/11 habla con un backend desplegado? ¿Alguien del equipo lo usa con datos reales?
5. ¿Las cuatro etapas de la ficha v3 son rótulos nuevos o un cambio de contrato?
6. ¿Se reactiva la purga a 12 meses o se cambia el aviso? (no se imprimió ninguna fecha de vencimiento).
7. ¿Los 56 registrados se importan al CRM? Quedarían como «importados», sin contar como anotados.
8. ¿Presupuesto de marketing en pesos o en dólares? (se quitaron los montos de la captura).

## Contradicciones entre fuentes (señaladas, sin elegir)

- Antecedentes: «nunca como archivo» (CLAUDE.md del especialista, consigna) vs. legajos del portal y backend del
  especialista con antecedentes en 7 días por foto o PDF («decisión del 08/11» citada en un commit del 07/11); el lienzo
  D6-Alta muestra «PDF cargado». El dossier imprime «en persona, nunca como archivo» y no muestra esas pantallas.
- Etapas del preregistro: lienzo v3 (Nuevo · Contactado · En seguimiento · Listo para alta) vs. contrato (pendiente de
  contacto → contactado → comprometido; en espera → avisado).
- Retención: aviso 04-A (12 meses, purga real) vs. decisión del 02/11 de no purgar.
- Plazos de reclamos: decisión del 07/11 (hoy / 2 / 3 días) vs. Guía 04 y captura MOCK con «[A CONFIRMAR]».
- Tarifa: decisión del 07/11 (impresa) vs. landing (10 % + 10 %, camada fundadora) y portal («sin tarifa aprobada»).
- Moneda del presupuesto de marketing: USD en el lienzo y la Guía 10 vs. pesos en el backend.
- Dónde se verifica: el plan del especialista nombra al portal como futuro consumidor; hoy el portal no tiene pantalla.
- Nombre del dominio del portal en la documentación del backend del usuario (no se imprime ningún dominio interno).
