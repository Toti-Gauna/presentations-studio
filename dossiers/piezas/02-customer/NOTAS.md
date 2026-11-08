# Dossier 02 · Customer App · notas de producción (ola 6, 08/11/2026)

Manual de la app del vecino en la dirección v2: «Galería» (blanco/hueso, teléfonos plata) con aperturas de capítulo en
banda azul (foto real de Mar del Plata en duotono + maqueta de día de `iso.js`). **24 páginas · 0 errores** en
`exportar-pieza.cjs` (los 43 avisos son bandas y maquetas a sangre que pasan el borde a propósito y fotos a 178–218 ppp).

- `index.html` se genera con `gen.py` + `estilo.css` (copias en `S/ola6/02-customer/`; el original está en
  `S/ola6/c02/`). Los `.toque` se calculan desde coordenadas de pantalla 390 × 844 con `left = (18+x)/426`,
  `top = (18+y)/880`. Si editás a mano el HTML, no vuelvas a correr el generador sin pasar los cambios.
- `img/`: 59 archivos, manifiesto en `imagenes.json` (origen y recorte de cada uno). Pantallas a 780 × 1688 WebP q93.
- **Sin personajes** (cambio de Ignacio del 08/11): no se usa `marca/personajes/` ni `personajes-v2/`. Más peso a las
  fotos reales y a la maqueta.
- Lema nuevo en tapa y contratapa: «Un problema viejo con una nueva solución que elegís.»

## Páginas

| p. | Página | Pantallas (con toques) | Estados |
|---|---|---|---|
| 1 | Tapa azul: foto de la Rambla, maqueta, dos teléfonos plata | I-Inicio, C-Propuestas (perspectiva) | — |
| 2 | Índice por capítulos + «Cómo leer» (estados, rótulos, puntos amarillos, tipo de cifra) | — | — |
| 3 | La app en una página: 4 momentos, qué hace / qué no, 6 rubros, 0 % usuario, 0 % especialista | I-Inicio, C-Propuestas, S-EnCamino, H-Hogar (38 mm) | P · D |
| 4 | Apertura 01 · Empezar y pedir (foto aérea del centro + barrio) | — | — |
| 5 | Alta en zigzag + «dos versiones del alta» | A-Datos, A-Zona, A-Casa, A-Listo | P · D |
| 6 | Pedir en 3 toques + qué pasa después de publicar | I-Inicio, P-Que, P-Fotos, P-Revisar | P · D |
| 7 | HandIA tal como está hoy (tabla de estado real) | I-HandIAChat, I-HandIAFicha, I-Voz (50 mm) | Desactivada · P · D · K |
| 8 | Apertura 02 · Elegir (Casino y Hotel Provincial + costa) | — | — |
| 9 | Propuestas protagonista + lo que corre en código | C-Propuestas (56 mm), PWA propuestas | P · D |
| 10 | Comparar por calidad y precio + choque «la mejor» vs «sin ranking» | C-Comparar, C-Detalle (52 mm) | P · D |
| 11 | Aceptar, turno confirmado, pedir cambio, visita | C-Aceptar, C-Aceptada, C-Cambios, C-Visita | P · D |
| 12 | Apertura 03 · El día del trabajo (Rambla) | — | — |
| 13 | Del turno a la puerta + 6 estados del servidor + cómo se marca la llegada | S-Agendado, S-EnCamino, S-Llego, S-Trabajando | P · D |
| 14 | Adicional, informe con garantía, conformidad | S-Adicional, S-Informe, S-Conformidad (52 mm) | P · D |
| 15 | Pagar directo, informado ≠ verificado, reseña + quién verifica | PWA pago-metodo, S-PagoInformado, X-Pagos, S-Resena | P |
| 16 | Mensajes y avisos | M-Mensajes, M-Chat, I-Avisos (52 mm) | P · D |
| 17 | Mi hogar, historial y garantías | H-Hogar, H-Historial, H-Garantias (52 mm) | D · K |
| 18 | Apertura 04 · Una obra completa, con las 7 etapas (foto aérea Faro/Mogotes) | — | D · P |
| 19 | Obra 1/2: propuesta, tu obra, jornada, repuesto + obra por etapas en código | O-Propuesta, O-Obra, O-Dia, O-Repuesto, PWA seguimiento | D · P |
| 20 | Obra 2/2: cambio de fecha, chat grupal, pagos, lo gastado + flujo FL-Obra | O-Fecha, O-Grupo, O-Pagos, O-Gastado, FL-Obra | D · P |
| 21 | Capítulo 05 · Confianza: cómo ves que está verificado (banda corta, foto del puerto) | C-Certificados (58 mm) | P · D |
| 22 | Anti-fuga desde el vecino: respuesta honesta + 11 mecanismos con estado + cómo se mide | H-Compartir (46 mm) | P · D · decisión |
| 23 | Preguntas difíciles (8 `.duda`) | — | P · D · K |
| 24 | Contratapa azul: foto Casino/Provincial, lema, QR, contacto, colección | — | — |

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
- El paso «pagar» usa la pantalla real de la PWA (efectivo / Mercado Pago, «reportado hasta que se verifique»).
- Los números de capítulo calados (`.cap-n`) se insertan como imagen (`img/cap-NN.webp`, renderizados con el estilo
  de `premium.css`): el texto con `-webkit-text-stroke` sale en el PDF como fuente Type 3 y el exportador lo rechaza.
  **Aviso para las otras piezas**: 04 usa `.cap-n` como texto y va a chocar con el mismo error.
- Las fotos aéreas tienen el ala de la avioneta arriba: se recortaron (`f-*.webp`, recortes en `imagenes.json`).
  `rambla-fuego` se recortó por arriba de la persona de espaldas.
- Componentes propios (en `<style>`): `.ojo` (dos fuentes dicen distinto), `.banda-codigo` (pantalla real + texto),
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
