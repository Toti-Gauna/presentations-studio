# Plan súper premium · Pitch ATICMA final (05/11/2026)

Pedido de Ignacio (05/11, noche): que cada diapositiva deje de ser «texto con imágenes» y sea una **escena animada premium**, al nivel
de «HandIA te habla» y «Ferreterías conectadas». Debe tener un golpe de animación por cada frase importante, explicarse sola y usar datos
coherentes en todo. En el video, la cara va dentro de la escena, los subtítulos integrados y sin silencios. Lo mismo para las respuestas y el
material extra.

## Reglas para todo el material

1. **Una escena animada por diapositiva**, con un golpe por frase del guion. Sin zoom ni pastillas flotantes encima de la lámina.
2. **Se explica sola**:
   - Cada paso lleva una leyenda numerada que dice qué está pasando («2 · Conseguir a alguien y coordinar: una odisea»).
   - Las notas del presentador dicen qué decir en cada golpe.
3. **Datos coherentes**: todo número sale de una sola tabla (`afirmaciones.json`), con su rótulo (dato informado, supuesto, proyección, objetivo).
4. **Competencia sin nombres ni logos** (pedido del 05/11):
   - Se muestra por **modelo y funcionalidad**: Plataforma A cobra comisión al profesional, B cobra por contacto, C cobra suscripción y D ofrece comisión cero por tiempo limitado.
   - Por cada una, cómo le gana Handyx.
   - Cierre con el **océano azul** en cuatro acciones: eliminamos la comisión al profesional, reducimos las idas y vueltas, aumentamos la transparencia del precio y creamos HandIA, herramientas por oficio, ferreterías conectadas y Handyx for Business.
   - Nunca se dice que la competencia no tiene algo: se muestra lo que suma Handyx.
   - Los nombres quedan solo en las notas privadas y en las fuentes.
5. **Rótulos honestos**: «Demo · datos ficticios», «Diseño propuesto», «En desarrollo», «Visión · con la inversión», «Plan propuesto · a validar».
   Los 56 son especialistas **registrados**, nunca «activos» ni «verificados».
6. **Un solo archivo por escena** sirve para todo:
   - En vivo: el clicker avanza los golpes.
   - En el video: los golpes se sincronizan con la voz.
   - En el PDF y el PPT: cada golpe es una página.

## Método (igual para cada diapositiva, respuesta o lámina)

1. **Guion → golpes**: de la frase que se dice salen 3 a 6 momentos, y cada uno tiene una animación y una leyenda.
2. **Escena con el kit de la marca**: Handys con poses, celulares con capturas reales de la demo, ciudad, mapa de Argentina, cuentas que se
   arman, conteos y sellos (`brands/handyx/animaciones/`).
3. **Revisión visual** de cada paso (al final y a mitad de cada golpe), hasta que nada se superponga, todo se lea a ≥ 20 px y haya un solo
   foco por paso. Va con una revisión automática de superposiciones.
4. **Validación automática**: cifras declaradas, tramos = pasos y compilación.
5. **Prueba real** en el presentador y la pantalla pública, y en la exportación (PDF/PPT).
6. **Lugar para la cara** en cada paso: una zona solo decorativa donde va tu círculo en el video.

## Fase 0 · Base (lista)

- Motor: elemento `animacion` (escenas en código con pasos), vista de trabajo, precarga y exportación por paso.
- Kit de Handyx:
  - Elementos visuales: celular, chats, tarjetas, sellos, personajes con poses, conteos y títulos.
  - Leyendas por paso.
  - Mapa de Argentina (Natural Earth).
- Tabla de cifras ampliada:
  - Ingreso bruto de la prueba: $ 70.000 (10 % + 10 % de $ 350.000).
  - 6 profesiones por mes y toda Buenos Aires en 3 meses.
  - Profesiones por trimestre: 24, 42, 60 y 72.
  - 24 desarrollos en el plan y ejemplos de HandIA.
- Guía para escribir escenas: `docs/claude/animaciones.md`.

## Fase 1 · Las 7 diapositivas del pitch (en curso)

| # | Golpes (uno por frase) |
|---|---|
| 1 La odisea (**lista**) | Presentación → la cocina con la pérdida → los chats que se amontonan y el reloj que vuela → el especialista con la agenda vacía y herramientas dispersas → Handyx une los dos lados: fluida, cómoda y con control. |
| 2 HandIA te orienta | No sabés a quién llamar (pantalla real de la demo) → foto y descripción en el chat de HandIA → «Rubro: Plomería» y costo aproximado, tres presupuestos que se comparan → el profesional pone su precio (sello) → camino 2: elegís el oficio y llegan presupuestos. |
| 3 Herramientas para el profesional | Capturas reales (agenda, mensajes, números) → las 6 herramientas en desarrollo, una por oficio (la del electricista al frente) → HandIA para profesionales: presupuesto, materiales en la ferretería, recordatorios y feedback; «cada trabajo, mejor que el anterior». |
| 4 Ya empezamos | Las dos apps desarrolladas → edificios con porteros y los primeros trabajos (5 · $ 350.000) → la comisión del plan original (10 % + 10 %) suma **$ 70.000 de ingresos para Handyx**; 56 registrados → la ciudad se expande a casas y comercios. |
| 5 Mercado y visión | 259.623 hogares que se encienden y los 6 oficios → la cuenta se arma (arreglos por trimestre → 25 % → trabajos) → × ticket real × 15 % = ≈ USD 109.000 frente al objetivo de USD 100.000 → de 6 a 72 profesiones (6 por mes) → mapa de Argentina: 4 de cada 10. |
| 6 Competencia y modelo | Océano rojo con las plataformas A–D **sin nombres**, por su modelo → el presupuesto llega completo a la casa del profesional → el recibo $ 100.000 + $ 15.000 = $ 115.000 → océano azul: cómo le gana Handyx a cada modelo y las 4 acciones, con los 24 desarrollos. |
| 7 Equipo, inversión y visión | Equipo chico, sueños grandes → constelación de agentes de IA → USD 100.000 en una barra por partida, cada una con la mejora que compra → Mar del Plata → Silicon Valley → el clip del mundo. |

## Fase 2 · Video del pitch

- Grabación de base: la nueva si regrabás (recomendado) o la actual.
- **Recorte de silencios** (≈ 7,9 s; el más largo, 2,7 s antes de «Somos un equipo»).
- **Escenas sincronizadas con tu voz**: cada golpe arranca cuando decís su frase (transcripción palabra por palabra).
- **Tu cara en un círculo dentro de la escena**:
  - Va en el lugar que cada escena deja libre y, cuando cambia, viaja con una animación suave.
  - Luz y color corregidos.
  - Se va en el final del mundo.
- **Subtítulos integrados**: la palabra que decís se resalta, en una franja propia que no tapa la animación.
- Música original por debajo de tu voz (baja sola cuando hablás) y efectos por golpe.
- Después del pitch, la sección de preguntas con las respuestas animadas (Fase 3).
- Salida en 1080p y 720p.

## Fase 3 · Respuestas súper premium (primera versión lista)

- Las 20 respuestas animadas, en tres golpes:
  1. La pregunta.
  2. La respuesta con su dato armándose (contador, cuenta, barras o flujo).
  3. Los puntos clave.
- La 6 ya está sin nombres («¿Qué los diferencia de la competencia?»), la 4 suma los $ 70.000 y la 20 el plan nuevo.
- **Segunda pasada**: respuestas a medida donde una lista no alcanza.
  - La 15, multiplicar: el círculo gira.
  - La 16, cripto: el escudo de la tesorería.
  - La 17, IPO: la escalera.
  - La 18, materiales: la mini ferretería.
  - La 19, voz: la onda de HandIA.
- Cada respuesta abre su lámina de respaldo animada.
- Machete actualizado y sección de preguntas del video rehecha.

## Fase 4 · Material extra súper premium (30 láminas + 2 nuevas)

| Familia | Lámina → animación |
|---|---|
| Números | **De dónde sale el número**: bloques que se encadenan hasta USD 109.000. **Mantener Handyx cuesta poco**: tres monedas en la alcancía = USD 400 y el contador hasta ≈ 67 trabajos. **CAC y LTV**: una balanza, USD 2 contra USD 18 (× 9). **Cada dólar**: la barra se llena y cada partida «compra» su mejora. **USD 1 millón**: embudo marketing + IA → personas → trabajos → profesionales. **USD 5 millones**: People y Business crecen como barras. |
| Finanzas | **Maneras de multiplicar ingresos**: 6 palancas, cada una con su mini animación. **Las ganancias trabajan dos veces**: el dinero se divide en «reinvertir» (crece la planta) y «tesorería» (un escudo que se llena: 12 meses, diversificada, cripto ≤ 10 %, directorio). **El círculo que multiplica**: el ciclo gira y los excedentes caen a la tesorería. **Camino a la IPO**: los Handys suben la escalera y cada escalón se enciende con su requisito. |
| Producto | **UX + IA**: tres recorridos en paralelo con su reloj (WhatsApp, apps con comisión, Handyx). **Herramientas por oficio 1/2**: cada herramienta en uso (la calculadora calcula, el detector avanza, el checklist se tilda). **Crecer con herramientas**: limpieza, mecánica, jardinería y negocios. **Marca**: los Handys y la app. **Publicidades** en movimiento. **HandIA te habla**: lista, falta la voz real. **Ferreterías**: el profesional agrega el material, lo reserva y **el vecino lo ve en su app** (en curso). |
| Mercado y competencia | **La competencia, por modelo** (sin nombres): plataformas A–D, qué hacen → cómo les gana Handyx, el mapa del mundo con dónde existe cada modelo y las 4 acciones del océano azul. **Validación**: la prueba con porteros y la próxima. **De 6 a 72 profesiones**: la grilla se llena mes a mes por familia, con cuidado de adultos mayores. **Tracción en los dos lados**: dos embudos con sus canales. |
| Planes | **Roadmap**: carriles hoy / próximo / visión. **Lo que logramos en 3 meses** y **mes 1/2/3**: HandIA premium → HandIA para profesionales → toda Buenos Aires, +6 profesiones por mes. **Cómo crece, trimestre a trimestre** (nueva, en curso): el mapa de Argentina se enciende región por región. |
| Visión | **Cómo crece Handyx**: el árbol People / Business sobre un mismo núcleo (en curso). **Un local, su equipo y su app**: el local publica turnos, llegan los mejor valorados y se arma su app. |

## Fase 5 · Integración y ensayo

- En vivo avanzás con el clicker en cada golpe; si lo preferís, hay un modo automático al ritmo del guion.
- El presentador muestra el paso actual y la frase que dispara el próximo («→ al decir…»).
- Ensayo cronometrado de 180 s.
- Pruebas automáticas de punta a punta.
- Grabación en vivo nueva y video final.
- PDF y PPT con cada golpe, zip de imágenes y machete.

## Orden y tiempos estimados

Fase 1 (resto: 3–4 h) → Fase 2 (2–3 h + render) → Fase 3, segunda pasada (2 h) → Fase 4 (8–10 h; por familias, empezando por las
que se muestran en las preguntas más probables) → Fase 5 (2 h). Si la final es en menos de 48 h: 1 → 2 → 3 → números y competencia de la 4 → el resto.

## Decisiones de Ignacio (con lo que hago si no hay respuesta)

1. **20 % o 25 %**: en la grabación decís 20 % y en pantalla dice 25 %, y con 20 % el trimestre no llega a USD 100.000. Lo mejor es regrabar
   esa frase. Si no se regraba, queda el 25 % en pantalla y en el guion.
2. **Regrabar el pitch** (3 min, guion oficial, buena luz, cámara a la altura de los ojos). Lo recomiendo: así el video incluye la
   competencia, que en la grabación actual no está. Si no, edito la actual.
3. **En vivo**: si no decís otra cosa, clicker en cada golpe.
4. **Fecha de la final**: si no la sé, trabajo como si fuera en menos de 48 h.
5. **$ 70.000 de ingreso bruto de la prueba**: queda rotulado como «Dato informado por el fundador · conciliación pendiente».
