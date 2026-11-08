# Dossier 02 · Customer App · notas de producción (ola 6 + pasada premium de la ola 7, 08/11/2026)

Manual de la app del vecino en la dirección v2: «Galería» (blanco/hueso, teléfonos plata) con aperturas de capítulo en
banda azul (ilustración de Mar del Plata en duotono + maqueta de día de `iso.js`). **24 páginas · 0 errores** en
`exportar-pieza.cjs`. Ola 7 (`consigna-ola-7.md`): misma estructura y textos revisados; cambia la dirección de arte.

- `index.html` se genera con `generador/gen.py` (`python3 -I generador/gen.py`), que lee `generador/estilo.css` y mete
  `generador/escenas-02.js` en línea. Los recortes de los despieces (`img/dz-*.webp`) salen de
  `generador/recortes.py <S/capturas> .` (también los suma a `imagenes.json`). Si editás a mano el HTML, pasá los
  cambios al generador antes de volver a correrlo.
- `img/`: 69 archivos, manifiesto en `imagenes.json` (origen y recorte de cada uno). Pantallas a 780 × 1688 WebP q93;
  recortes a 1170 px de ancho (lienzo) o 780 px (PWA), WebP q94. Se borraron las 23 pantallas que ya no se usan.
- **Sin personajes** (cambio de Ignacio del 08/11). Lema en tapa y contratapa: «Un problema viejo con una nueva solución que elegís.»

## Ola 7 · qué cambió

- **Despieces** (`.dz` + `.flota` de `premium.css`): teléfono plano y recortes reales ampliados ~1,4× con sombra, sobre
  un plano de color con `.grano` en una capa de fondo (`.dz-fondo`). Cada recorte lleva su nombre como el rótulo de un
  marco del lienzo (`.etiq`); las partes se explican con `.guia` (sin números). Páginas: 6 (pedir · cielo), 9
  (propuestas · azul, con dos recortes de la PWA «en código»), 10 (comparar · hueso: tabla + detalle), 13 (seguimiento ·
  navy), 16 (mensajes y avisos · hueso), 19 (obra · azul), 21 (sellos de verificación · cielo) y una tira de recortes en 15 (pago).
- **Escenas**: de `plantilla/escenas.js`: `conectar` (p. 3, con los cuatro momentos como guías), `propuestas` (apertura 02),
  `pago` (p. 15), `obra` (apertura 04), `verificar` (p. 21). **Propias** (en `generador/escenas-02.js`, mismo lenguaje y
  mismas figuras, copiadas de `escenas.js`, que no se editó): `pedir` (apertura 01), `llega` (apertura 03) y `adentro`
  (p. 22, «quedarse adentro»). En las aperturas la escena va en una tarjeta blanca que flota sobre la banda (`.esc-tarjeta`).
- **Menos miniaturas**: se fueron los recorridos de 4 teléfonos de las p. 6, 13, 15 y 19 y las cuatro miniaturas de la
  p. 3; la p. 20 pasa a 3 teléfonos de 44 mm. Quedan como recorridos las p. 5 y 11, y filas de 3 en 7, 14, 17 y 20.
- **Un bloque de chips por página**: los estados pasan a texto chico (`.et`, mismo color que el chip) junto al título;
  quedan chips solo en la tabla de HandIA (p. 7), en la tabla anti-fuga (p. 22) y en la leyenda (p. 2). La leyenda suma el
  estado en texto chico, el punto de toque navy y el rótulo de recorte.
- Componentes propios nuevos (en `estilo.css`): `.et`, `.et-l`, `.dz`, `.dz-fondo`, `.etiq`, `.guia .gl` (guía de dos
  líneas), `.notas-dz`, `.esc-tarjeta`, `.pasos-v`, `.hace2`. Ojo para otras piezas: no se usa `.paso` (choca con base.css).

## Páginas

| p. | Página | Imagen | Estados |
|---|---|---|---|
| 1 | Tapa azul: Rambla ilustrada, maqueta, dos teléfonos plata | I-Inicio, C-Propuestas (perspectiva) | — |
| 2 | Índice por capítulos + «Cómo leer» (estados, estado en texto, rótulos, toques y recortes, tipo de cifra) | — | — |
| 3 | La app en una página: escena `conectar` con los 4 momentos como guías, qué hace / qué no, 3 cifras | escena | P · D |
| 4 | Apertura 01 · Empezar y pedir | escena propia `pedir` en tarjeta | — |
| 5 | Alta en zigzag + «dos versiones del alta» | A-Datos, A-Zona, A-Casa, A-Listo | P · D |
| 6 | Pedir: despiece (I-Inicio + rubros, ¿qué pasa?, fotos, revisar) + qué pasa después de publicar | despiece cielo | P · D |
| 7 | HandIA tal como está hoy (tabla de estado real) | I-HandIAChat, I-HandIAFicha, I-Voz (50 mm) | Desactivada · P · D · K |
| 8 | Apertura 02 · Elegir | escena `propuestas` en tarjeta | — |
| 9 | Propuestas: despiece (orientativo, propuesta, sellos, aceptar + 2 recortes de la PWA) | despiece azul | P · D |
| 10 | Comparar: tabla ampliada + C-Detalle con guías, notas, «La mejor» junto al choque de reglas | despiece hueso | P · D |
| 11 | Aceptar, turno confirmado, pedir cambio, visita | C-Aceptar, C-Aceptada, C-Cambios, C-Visita | P · D |
| 12 | Apertura 03 · El día del trabajo | escena propia `llega` en tarjeta | — |
| 13 | Del turno a la puerta: despiece (turno, estados, en camino, código) + 6 estados del servidor | despiece navy | P · D |
| 14 | Adicional, informe con garantía, conformidad | S-Adicional, S-Informe, S-Conformidad (52 mm) | P · D |
| 15 | Pagar directo: escena `pago` + 3 pasos, tira de recortes (PWA cómo pagás, pago informado, tus pagos), choque de fuentes | escena + recortes | P |
| 16 | Mensajes y avisos: despiece (M-Chat + mensajes, avisos, propuesta y otro horario en el chat) | despiece hueso | P · D |
| 17 | Mi hogar, historial y garantías | H-Hogar, H-Historial, H-Garantias (52 mm) | D · K |
| 18 | Apertura 04 · Una obra completa, con las 7 etapas | escena `obra` en tarjeta | D · P |
| 19 | Tu obra, en una pantalla: despiece (propuesta, jornada, repuesto, lo gastado + etapas en la PWA) | despiece azul | D · P |
| 20 | Obra 2/2: cambio de fecha, chat grupal, pagos por etapa + flujo FL-Obra | O-Fecha, O-Grupo, O-Pagos (44 mm) | D · P |
| 21 | Capítulo 05 · Confianza: escena `verificar` + 4 pasos, despiece de los sellos, notas, 56 registrados | escena + despiece cielo | P · D |
| 22 | Anti-fuga: respuesta honesta, escena propia `adentro`, recorte «¿Qué compartís?», 11 mecanismos con estado | escena + recorte | P · D · decisión |
| 23 | Preguntas difíciles (8 `.duda`, «Hoy» en texto chico) | — | P · D · K |
| 24 | Contratapa azul: lema, QR, contacto, colección | — | — |

## Fuentes

Consigna `dossiers/consigna-ola-6.md` (+ agregado del 08/11), `auditoria/usuario.md` (estados de las 85 funciones,
recorridos U-R, riesgos y contradicciones), lienzo «App del usuario» (`S/capturas/usuario/`), capturas de la PWA
(`brands/handyx/assets/capturas/usuario-*.webp`), `docs/handyx/plan-dossiers.md` (decisiones 5–8),
`docs/handyx/preguntas.md` (respuesta anti-fuga), `decks/handyx-aticma/afirmaciones.json` (TARIFA-USUARIO 15 %,
FEE-ESPECIALISTA 0 %, ESP-REGISTRADOS 56, META-REPETIDORES 5 · objetivo). Texto revisado de la versión de la ola 3.

## Decisiones

- No se usan: A-Bienvenida (titular «especialistas verificados»), P-Publicado (ídem), C-Buscando y X-Actividad
  (Canilla), M-Soporte (grupo de Handys e incidente), S-Pagar (Mercado Pago «Se verifica solo», hoy inactivo),
  X-Cuenta (seguridad), A-Entrar/A-Codigo/A-Segunda (acceso).
- Ola 7: los recortes evitan el banner de HandIA (tiene al Foco), la fila de HandIA de Mensajes, la fila de Soporte y
  las reseñas de muestra del perfil (no hay reseñas reales). El chip «Mejor promedio» queda visible en el teléfono de la
  p. 9 y se aclara abajo que está en discusión; «La mejor en perfil y precio» se muestra junto al recuadro del choque.
- Ola 7: los recortes de la PWA (p. 9, 15, 19) conservan el nombre anterior («Handy») en el texto de la pantalla; se
  avisa en el pie o en el origen.
- El paso «pagar» usa la pantalla real de la PWA (efectivo / Mercado Pago, «reportado hasta que se verifique»).
- Los números de capítulo calados (`.cap-n`) se insertan como imagen (`img/cap-NN.webp`, renderizados con el estilo
  de `premium.css`): el texto con `-webkit-text-stroke` sale en el PDF como fuente Type 3 y el exportador lo rechaza.
  **Aviso para las otras piezas**: 04 usa `.cap-n` como texto y va a chocar con el mismo error.
- Las fotos aéreas tienen el ala de la avioneta arriba: se recortaron (`f-*.webp`, recortes en `imagenes.json`).
  `rambla-fuego` se recortó por arriba de la persona de espaldas.
- Componentes propios de la ola 6 (en `<style>`): `.ojo` (dos fuentes dicen distinto), `.banda-codigo` (pantalla real + texto),
  `.tabla-est`, `.foto-banda`/`.velo-banda` (apertura con foto), `.cap-img`, `.ind` (índice por capítulos),
  `.leer`, `.hace`, `.dudas-02`, `.chips`, `.estado.apagado` («Desactivada»).

## Preguntas abiertas para Ignacio

1. Alta del lanzamiento: ¿con invitación y contraseña (código) o registro directo con código (lienzo)? (p. 5)
2. ¿Se aprueba destacar «La mejor en perfil y precio» y se muestran los pesos? (p. 10)
3. Fuente del precio orientativo si todavía no hay trabajos. (p. 6, 9)
4. ¿Cómo se marca la llegada: «Llegué», código de 4 números o geocerca? (p. 13)
5. ¿Quién verifica un pago en efectivo: el especialista, el proveedor u Operations? ¿Habrá Mercado Pago? (p. 15)
6. Garantía: ¿quién la da y con qué texto? (p. 10, 14, 23)
7. Antecedentes: ¿en persona o por documento? (p. 21)
8. ¿HandIA está en la app del lanzamiento? (p. 7)
9. Qué pasa con un especialista que no se presenta. (p. 23)
10. Cómo llega una consulta de Soporte al equipo. (p. 16)
11. Reseñas: ¿existen al lanzar y quién las modera?

## Contradicciones entre fuentes (señaladas, sin elegir)

- Tarifa al usuario: 0 % hasta el 10/12 + 15 % en evaluación (decisión del 07/11, impresa) vs. 10 % al cliente y
  «primer mes sin tarifa» (landing) vs. 10 % + 10 % y camada al 5 % (`preguntas.md` n.º 7, desactualizado).
- Comisión al especialista: 0 % (decisión) vs. 10 % (landing); el commit del 07/11 cita una decisión «del 08/11».
- Registro con invitación/contraseña (código, contrato) vs. directo sin contraseña (lienzo).
- Ranking: «La mejor» y «Mejor promedio» (lienzo) vs. «sin rankings ni superlativos» (código y contrato).
- Quién verifica un pago; Mercado Pago «se verifica solo» (lienzo) vs. función inactiva (servidor).
- Llegada: «Llegué» (servidor) vs. código (lienzo) vs. geocerca (demo de la landing).
- Antecedentes «revisados en persona» (lienzo, PWA, app del especialista) vs. foto o PDF (CLAUDE.md del BE).
- HandIA desactivada (main) vs. incluida sin IA externa (rama) vs. plan con OpenAI/ElevenLabs.
- Tiempos: «no hay un tiempo fijo» (lienzo) vs. ventanas de 20 min / 12 h (servidor).
- Reclamos con estados (código) vs. sin pantallas de reclamo en el lienzo.
- Nombre «Handy» en las capturas de la PWA vs. Handyx.
- 10/11: «lanzamiento» (afirmaciones) vs. demo cerrada con invitación (app); se imprime la fórmula de la consigna.
- Dominio de la app: handyc.com vs. handyx.pro (no se imprime ninguno; el QR va a landing.handyc.com/handyx).
