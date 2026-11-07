# Dossier 02 · Customer App · notas de producción (ola 3, 07/11/2026)

`index.html` (20 páginas A4, sin `data-folio`), `img/` (28 WebP), `imagenes.json` (manifiesto de recortes).
Control: `exportar-pieza.cjs` → **20 páginas · 0 errores · 0 avisos**. Hoja de contacto y las nueve dobles páginas
revisadas a tamaño completo.

## Páginas

| p. | Sección del pedido (§6) | Evidencia |
|---|---|---|
| 1 | 1 · Portada (aprobada; rótulo «Diseño propuesto · datos ficticios») | I-Inicio + Foco (bombilla-b) |
| 2 | Índice y cómo leer (copia de `paginas-comunes.html`) | — |
| 3 | 2 · La experiencia del cliente | Mapa propio: 4 momentos × 12 recorridos U-R con estado y página; Foco (bombilla-d) |
| 4 | 3 · Problemas actuales | Cinco preguntas (hipótesis cualitativas) con íconos y respuesta de la app con estado |
| 5 | 4 · Cómo Handyx simplifica | A-Bienvenida recortada arriba del titular, carriles «Vos / Handyx», tabla de reglas |
| 6 | 5 · Registro y onboarding | A-Datos, A-Listo, cifra 0 %, tabla, flujo U-R-01 |
| 7 | 6 · Exploración y búsqueda de especialistas | I-Inicio (desplazado), I-HandIA, cadena «cómo llega tu pedido», tabla |
| 8 | 7 · Solicitud de servicios | P-Revisar, I-HandIAFicha, tabla, flujo U-R-02/03 |
| 9 | 8 · Recepción de presupuestos | PWA propuestas, M-Presupuesto, tabla, flujo |
| 10 | 9 · Comparación (aprobada) | C-Propuestas, C-Comparar, tabla, flujo U-R-04 |
| 11 | 10 · Criterios de calidad y precio (aprobada) | C-Detalle, C-Certificados, tabla de criterios, nota, «hoy / diseño» |
| 12 | 11 · Selección y contratación | C-Aceptar, C-Cambios, horquilla de cuatro salidas, flujo U-R-05 |
| 13 | 12 · Seguimiento del trabajo y pago | S-EnCamino, PWA forma de pago, tabla, flujo U-R-06 |
| 14 | 12 · Obras de varios días | O-Obra, PWA obra por etapas, tabla, flujo U-R-07 |
| 15 | 13 · Comunicación y organización | M-Chat, I-Avisos, tabla, flujo U-R-08/09 |
| 16 | 14 · Confianza y reputación | S-Llego, S-Informe, tabla, flujo U-R-12 |
| 17 | 15 · Funcionalidades adicionales | H-Hogar, T-Medir, H-AR, G-Camino en cuadrícula, cada una con su estado |
| 18 | 16 · Roadmap de experiencia | Barra de las 85 funciones por estado (dato verificado), matriz momento × estado |
| 19 | 17 · Cierre (página navy) | Hoy / lo que sigue / a definir, la colección |
| 20 | Contratapa (azul, Foco bombilla-c, `.actual` en 02) | QR, contacto; texto del QR actualizado según la coordinación |

Dobles páginas en espejo: en 6|7 a 16|17 los celulares quedan contra el lomo (par: a la derecha; impar: a la izquierda).

## Fuentes

- `dossiers/auditoria/usuario.json` y `usuario.md`: las 85 funciones con su estado (ninguno subido), los 12 recorridos
  U-R, las capturas recomendadas con sus riesgos y el `indice_dossier`.
- Lienzo «App del usuario»: `S/capturas/usuario/*.png` y `recortes/`. PWA en vista de prueba (31/10/2026):
  `brands/handyx/assets/capturas/usuario-{propuestas,pago-metodo,seguimiento}.webp`.
- Decisiones de Ignacio (`docs/handyx/plan-dossiers.md`, 5–8): tarifa de servicio 0 % hasta el 10/12/2026; después,
  «en evaluación», sin porcentaje en este dossier. `diagnostico.md`, `arquitectura.md`, `direccion-de-arte.md`.
- Cifras impresas: 0 % (condición confirmada, 07/11/2026); 12 recorridos, 102 pantallas y 85 funciones (2 · 39 · 41 · 3),
  dato verificado de la auditoría del 07/11/2026. Ningún monto de las pantallas se cita en el texto.

## Pendientes «[a definir]»

- p. 4: medición propia del problema (hoy, hipótesis de entrevistas informadas por el fundador).
- p. 11: qué pesa cada criterio del promedio de perfil y precio y si se muestra en pantalla.
- p. 16: quién da la garantía y su texto (Legal).
- p. 18: fechas de cada etapa del roadmap. p. 19 repite los abiertos: fechas, tarifa después del 10/12, garantía, reseñas.

## Desvíos de la arquitectura y por qué

- **p. 6 sin `usuario-modal-fee.webp`:** dice «solo con invitación», y la consigna pide describir el registro sin
  invitación ni contraseña. La tarifa va como cifra rotulada y en A-Listo. Tampoco se usan A-Entrar, A-Codigo ni
  A-Segunda (mecanismos de acceso).
- **p. 7:** I-Inicio desplazado (recorte 0,1068) para no repetir la tapa; I-HandIA en lugar de C-Certificados, que pasó a p. 11.
- **p. 8 sin P-Publicado ni P-Que:** P-Publicado dice «especialistas verificados» (riesgo de la auditoría); el pedido
  en pasos se cuenta en texto y tabla.
- **p. 9:** C-Propuestas ya está en p. 10; se usa la captura real de la PWA (lista por llegada, sin ranking).
- **p. 11 (aprobada, pulida):** se sumó C-Certificados (lo pedía la arquitectura), se compuso en espejo con p. 10 y se
  agregaron las tarjetas «hoy / diseño» para no dejar un tercio vacío. En 10 y 11: rótulo de dos partes
  («Diseño propuesto» + «Datos ficticios»), voseo en el flujo y títulos sin una palabra sola en la última línea.
- **p. 12:** C-Aceptada y C-Visita no van como captura; la visita aparece en la horquilla con su estado.
- **p. 13 sin RC-Trabajo ni S-Pagar:** el tablero de recorrido no se lee a ancho A4 y S-Pagar dice que Mercado Pago
  «se verifica solo» (hoy inactivo). La captura de la PWA muestra efectivo y Mercado Pago sin decir quién verifica.
- **p. 15 sin M-Soporte-recorte:** su mensaje («el código del especialista no coincidía y no le abrí») es un incidente
  de ejemplo, y el recorte conserva arriba una franja de los pies del grupo de Handys. Soporte va en texto y tabla.
- **p. 16 sin S-PagoInformado:** imprime una versión de quién verifica un pago en efectivo (contradicción abierta).
- **p. 17:** G-Camino en lugar de G-Hito-recorte (muestra el camino entero); H-AR con rótulo «Concepto», como
  recomienda la auditoría, y la función con su estado (Diseñado, decisión técnica abierta).
- **Índice:** usa el número de sección del pedido (02–17), igual que las cejas; el 12 aparece dos veces.

## Riesgos que quedan a la vista (para revisar)

- C-Certificados y la PWA de propuestas muestran en letra chica «antecedentes … en persona» (el medio está en
  discusión); el texto propio no lo nombra.
- Las capturas de la PWA dicen «Handy» y «Comisión de Handy» (nombre anterior): rotuladas, sin ampliar y aclarado en la fuente.
- P-Revisar, C-Propuestas y M-Presupuesto muestran rangos de precio orientativo de muestra (diseño sin fuente de datos).
- A-Listo, C-Aceptar y C-Aceptada mencionan la «demo» y Mercado Pago: el texto aclara efectivo hoy y Mercado Pago
  cuando se valide la integración.

## Componentes nuevos (en el `<style>` de la pieza)

`.rotulos` (rótulo de dos partes que se apila), `.pag` (página automática con `data-ir`), `.dos-estados`, `.apertura`,
`.mapa-exp` / `.momento` / `.recorrido` / `.transversal`, `.dudas` / `.duda`, `.promesa` / `.cita`, `.carriles`,
`.tarifa`, `.cadena`, `.horquilla` / `.salidas`, `.cuadricula` / `.celda`, `.barra-seg` / `.leyenda-barra` /
`.matriz` / `.falta` (barra segmentada con los colores de los estados, textura en Concepto), `.cierre-cols` /
`.seguir-leyendo` / `.lema-cierre`, `.foco-fin`.
