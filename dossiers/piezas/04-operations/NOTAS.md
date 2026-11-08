# Dossier 04 · Operations Portal · notas de producción (ola 7, 08/11/2026)

Pasada de dirección de arte premium sobre la versión de la ola 6 (`consigna-ola-7.md`; reglas de contenido de
`consigna-ola-6.md`). Mismos textos revisados, estados, rótulos y capítulos; cambia la forma. 20 páginas A4.
Pedido de Ignacio para esta pieza: **no mostrar el panel «así como está»**. Queda **una sola notebook**, la de la tapa;
cada módulo se explica con una ilustración (qué hace y para quién, en dos líneas) y sus partes reales, recortadas y
ampliadas, flotando sobre un panel de color con líneas guía. Exportación con **0 errores**.

## Páginas

| p. | Capítulo | Título | Imagen | Tipo |
|---|---|---|---|---|
| 1 | Tapa | El manual del equipo que cuida cada arreglo. | Foto `casino-plaza-navy` + maqueta + **la única notebook** (Inicio en perspectiva) | imagen |
| 2 | Índice | El manual del portal | Índice, estados como texto con ícono, cómo se lee cada imagen (ilustración / recorte / guía) | lectura |
| 3 | 01 apertura | Detrás de cada arreglo hay trabajo que no se ve | Banda azul + maqueta costa; cifras 97 / 41 / 0 | imagen |
| 4 | 01 | Cómo conectamos a dos personas | Escena `conectar` a página completa con 3 guías + tres pasos (landing → portal → apps) | imagen |
| 5 | 01 | Qué está conectado hoy, y qué no | Llega hoy / todavía no; escena `pago` («el dinero no pasa por el portal»); barra 41/15/26/15 | lectura |
| 6 | 02 apertura compacta | Lo urgente, primero | Banda con escena `agenda` (oscuro) + despiece del Inicio: «Para hoy», tickets, 64 % con base, «Sin dato», rótulo de muestra | imagen |
| 7 | 03 apertura | Cada persona anotada, atendida a tiempo y cuidada | Banda + maqueta barrio; etapas preregistro → alta | imagen |
| 8 | 03 | ¿A quién contactamos hoy? | Escena propia `llamar` + despiece: «7 sin contactar +48 h», botones, tres filas | imagen |
| 9 | 03 | Un próximo paso, y los datos bajo llave | Escena propia `llave` + despiece en azul: cabecera de la ficha, siguiente paso, historial, datos de contacto cifrados | imagen |
| 10 | 03 | Cargar un documento no es estar verificado | Escena `verificar`; 6 etapas; quién habilita; recorte «No pueden trabajar»; mención del Camino Handyx; aviso de los 56 | lectura |
| 11 | 04 apertura | Lo grave se responde hoy | Banda + maqueta; plazos por gravedad | imagen |
| 12 | 04 | Tres columnas, ningún olvido | Escena `reclamo` + despiece con lupa: columna «Para hoy» → tarjeta de un reclamo ampliada (gravedad, barra, responsable) | imagen |
| 13 | 04 | Nada lo impide del todo. Que valga quedarse | Escena `propuestas`; 8 mecanismos con estado; cómo se detecta | lectura |
| 14 | 05 apertura | Medir con método, sin inventar | Banda + maqueta; tres reglas | imagen |
| 15 | 05 | ¿La campaña está trayendo gente? | Escena propia `embudo` + despiece: veredicto y embudo | imagen |
| 16 | 05 | ¿Atendemos mejor a los que llegan ahora? | Despiece: tabla de cohortes, lectura guiada, tiempo hasta el primer contacto | lectura |
| 17 | 05 | El territorio, barrio por barrio | Escena `barrios` + despiece: mapa, barrio elegido, acciones; 130 zonas | imagen |
| 18 | 06 apertura compacta | Quién hace qué, y cuándo | Banda con escena `equipo` (oscuro) + despiece: ciclo, dos tickets, pasos de una guía; funciones con estado | lectura |
| 19 | 07 | Las preguntas incómodas | 8 `.duda`, estados como texto | lectura |
| 20 | Contratapa | Un problema viejo con una nueva solución que elegís. | Foto `rambla-fuego-navy` + maqueta, QR, contacto | imagen |

## Qué cambió respecto de la ola 6

- **Notebooks**: de 9 a 1 (tapa). Las 8 pantallas completas (Inicio, Preregistros, Ficha, Reclamos, Campaña, Cohortes,
  Mapa, Tareas) se reemplazaron por escenas + despieces de componentes.
- **Escenas** (`plantilla/escenas.js`): `conectar` (p. 4), `pago` (p. 5), `agenda` (p. 6, banda), `verificar` (p. 10),
  `reclamo` (p. 12), `propuestas` (p. 13), `barrios` (p. 17), `equipo` (p. 18, banda; y miniatura en el índice).
- **Escenas propias de la pieza** (en el `<script>` del `index.html`, mismo lenguaje: planos de la marca, trazo navy,
  personas sin cara, un solo acento amarillo; no se tocó `escenas.js`): `llamar` (lista ordenada + reloj de +48 h + persona
  del equipo con el teléfono), `llave` (ficha con datos enmascarados + candado + registro de actividad) y `embudo` (volante
  con QR + persona que lo escanea + embudo con el último paso en amarillo). Se usan con `data-dibujo="…"`.
- **Despieces**: recortes reales del lienzo re-renderizado a **escala 4** (`S/ola7/w04/rr4/`, mismos reemplazos de la
  ola 6) y guardados a escala 3 en WebP q94 (`img/c-*.webp`; receta en `rerender/recortes-ola7.json`). Cajas de cada
  componente medidas en el DOM del tablero (`S/ola7/w04/sondear.cjs`), así los recortes caen justo sobre la tarjeta.
- **Estados**: los chips pasaron a texto chico con ícono junto al título (`.st`); ningún bloque de chips por página.
- **Ritmo**: páginas de imagen (escena o despiece grande) alternadas con páginas de lectura; capítulo 01 ganó una página
  («Cómo conectamos a dos personas») y el 02 quedó en una (se quitó el recorrido «empezar el día»: su contenido está en las
  notas del Inicio).
- **Color**: misma paleta; `.grano` en paneles y bandas. Sin degradés fuera de la paleta.

## Componentes propios (en el `<style>` de la pieza; reutilizables)

- `.st.cons|prue|dise|conc` — estado como texto con ícono (5,9 pt). `.sts` fila de estados.
- `.cab-mod` + `.qh` — «Qué hace. / Para quién.» a la izquierda y la escena a la derecha.
- `.despiece.dp` + `.flota[data-cw,data-ch,data-ox,data-oy,data-r]` — cada recorte toma la proporción y el radio de la
  tarjeta original a escala (un script lo calcula).
- `.g.arr|aba|izq|der` (+ `.ini|.fin|.cen`, `--l`) — guía con punto, línea y etiqueta. Se ubica con `data-f` (id del
  recorte) + `data-x/data-y` en px CSS del tablero de 1440, o con `data-e` (id de una escena) + `data-sx/data-sy` en el
  viewBox 400 × 240. En el panel azul la línea lleva un filete navy para verse también sobre las tarjetas blancas.
- `svg.lupa` — marco sobre la parte original y líneas punteadas hasta su ampliación (p. 12).
- `.pasos-3`, `.notas-3`, `.notas-2c` — filas de pasos y notas cortas.
- Se mantienen de la ola 6: `svg.cap-n-svg` (números de capítulo vectoriales), bandas, `.funcs`, `.corte`,
  `.barra-estados`, `.indice-v2`, `.leer`, `.quien`, `.mecanismos`, `.medir`, `.reglas`, `.dudas`, tapa y contratapa.
- No se usa la clase `.paso` (existe en `base.css` con `display:flex`).

## Fuentes

- Estado de cada función: `dossiers/auditoria/portal.md/.json` (97 funciones) y, para la fuga y el alta,
  `auditoria/usuario.md` y `auditoria/especialista.md` (Camino Handyx: Diseñado).
- Ajustes de estado por la auditoría en esta ola: «barrio elegido» del mapa → En pruebas (P-M-03, capas por barrio con
  panel); acciones desde el barrio → Diseñado (P-M-05); tiempo hasta el primer contacto → En pruebas (P-H-02); cohortes
  explicadas → Diseñado (P-H-03); «Para hoy» v3 → Diseñado (P-I-02) con la bandeja v2 Construida (P-I-01).
- Preguntas difíciles: `docs/handyx/preguntas.md` (n.º 4 fuga, 10 reclamos, 11 cobro) y la consigna de la ola 6.
- Cifras: auditoría del portal (97 / 41 / 15 / 26 / 15, 130 zonas = 108 + 21 + 1, «dato verificado»); `ESP-REGISTRADOS`
  (56, «dato informado por el fundador · sin auditar») y `META-REPETIDORES` (5 clientes al 31/12, «Objetivo · no es un
  resultado») de `decks/handyx-aticma/afirmaciones.json`. Tarifa: decisión del 07/11.
- Fotos: `marca/fotos/` en duotono. Geometría del mapa (dentro del recorte del portal): © colaboradores de OpenStreetMap (ODbL).

## Tratamiento de las capturas (todas rotuladas «Diseño propuesto · datos ficticios»)

Se mantienen los reemplazos de la ola 6 (casos neutros en Inicio y Reclamos, «Pintor» → «Cerrajero», «Gasista matriculada»
→ «Gasista», «La asignó el equipo», WhatsApp enmascarado, «Retención · según el aviso», sin montos en USD en Campaña,
«Mes 1 … Mes 6 · muestra» en Cohortes, iniciales «SV», Legal sin antecedentes ni nombres). La Llave (personaje) sigue
oculta en Inicio y Ficha. La guía de Docs sale del re-render de la ola 3, sin el paso de antecedentes en 7 días (el
tablero actual de Docs lo tiene: no se usó). Ningún personaje en la pieza.

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
  especialista con antecedentes por foto o PDF; el tablero Docs actual dice «antecedentes penales en 7 días». El dossier
  imprime «en persona, nunca como archivo» y no muestra esas pantallas.
- Etapas del preregistro: lienzo v3 (Nuevo · Contactado · En seguimiento · Listo para alta) vs. contrato (pendiente de
  contacto → contactado → comprometido; en espera → avisado).
- Retención: aviso 04-A (12 meses, purga real) vs. decisión del 02/11 de no purgar.
- Plazos de reclamos: decisión del 07/11 (hoy / 2 / 3 días) vs. Guía 04 y captura MOCK con «[A CONFIRMAR]».
- Tarifa: decisión del 07/11 (impresa) vs. landing (10 % + 10 %, camada fundadora) y portal («sin tarifa aprobada»).
- Moneda del presupuesto de marketing: USD en el lienzo y la Guía 10 vs. pesos en el backend.
- Dónde se verifica: el plan del especialista nombra al portal como futuro consumidor; hoy el portal no tiene pantalla.
- Panel del barrio: la auditoría lo pone dentro de «capas por barrio» (En pruebas, P-M-03) y las acciones del barrio en
  Diseñado (P-M-05); la ola 6 lo había rotulado Diseñado. Se imprimió En pruebas para el panel y Diseñado para las acciones.
