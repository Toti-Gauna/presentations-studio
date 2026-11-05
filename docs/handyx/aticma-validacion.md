# Pitch ATICMA 2026 · validación, fuentes y pendientes

Deck `decks/handyx-aticma` (corte 04/11/2026). Versiones: `evento` (transiciones suaves) y `estatica` (sin animaciones).
Guion: [`aticma-guion.md`](aticma-guion.md) · preguntas: [`aticma-preguntas.md`](aticma-preguntas.md) · ajustes: [`aticma-ajustes-sugeridos.md`](aticma-ajustes-sugeridos.md) ·
capturas de revisión: [`capturas-aticma/`](capturas-aticma/).

## Cómo ensayar y presentar

1. `npm ci && npm run dev` → `http://localhost:5173/presentador/?deck=handyx-aticma&version=evento` (o el hub `/` → «Handyx · ATICMA 2026»).
   Con celular en la red local: `npm run build && SERVIR_ESTATICOS=dist npm run servidor` → `http://<ip>:8787/`.
2. **Ensayo:** **▶ Reloj** (R) → hablar → avanzar con → / espacio / clicker → **■ Finalizar** registra el tiempo (dentro o excedido de 3:00)
   y deja el tiempo real de cada diapositiva. **Nuevo ensayo** vuelve a cero sin recargar. **Ocultar notas** (N) para ensayar sin ayuda.
   Las notas muestran el tramo (p. ej. 0:25–0:55), el guion de la diapositiva y la **próxima transición**.
3. **Presentación:** **Abrir pantalla pública** → arrastrar al proyector → **F** (pantalla completa). En la notebook queda el presentador.
   Solo presentación (sin presentador): `/presentar/?deck=handyx-aticma&version=evento`.
4. Diapositiva 7 tiene dos pasos: → al decir «Hoy empezamos en Mar del Plata». Avanzar nunca entra a los anexos.
5. **Respaldo para el jurado:** Mayús + A (proyección), B (costos y equilibrio), C (CAC y LTV), D (validación), E (roadmap), F (competidores
   en Argentina), G (región y mundo), H (uso de la inversión), I (de 6 a 72 profesiones) y J…U (preguntas del jurado 1 a 10, una por diapositiva; sin N ni R);
   **0** vuelve a la última diapositiva. También desde el índice del presentador o el menú ☰ del celular.
6. **Celular:** Conectar control remoto → QR privado (nunca se proyecta) → Aprobar.
7. **Sin animaciones:** `version=estatica`. **Sin internet:** `npm run paquete:local` o el build servido en la notebook (fuentes y recursos locales).
8. **Contingencia:** `salida/pdf/handyx-aticma-evento.pdf` (27 páginas: 7 diapositivas, el paso 2 de la 7, 9 de respaldo y 10 de preguntas), el PDF de lectura y
   `salida/pptx/handyx-aticma-evento.pptx` (imágenes + guion y notas en las notas del orador). Se regeneran con
   `npm run build && npm run exportar:pdf -- --deck=handyx-aticma --version=evento` y `npm run exportar:pptx -- --deck=handyx-aticma --version=evento`
   (el PPTX necesita python3 con python-pptx).

## Pedido del mentor (Luigi, ATICMA, WhatsApp del 04/11)

| Pedido | Dónde quedó |
|---|---|
| «Hay Clickie y 3 o 4 más en Argentina; varios en Colombia, Uruguay, Chile, México, Europa y EE. UU.» | Diapositiva 6 (mapa por modelo de cobro) y anexos E (Argentina: Clickie, Muovi, Home Solution, IguanaFix, Servidos, Yo te lo arreglo, Zolvers) y F (región y mundo) |
| «Encontrar tu diferencial» | El profesional no paga comisión por su trabajo (afuera: comisión, pago por contacto o suscripción) + herramientas, historial y clientes que vuelven; rotulado como no demostrado |
| «Tirar números aunque no los digas: que la filmina justifique "proyectamos ganar X"» | Diapositiva 5: hogares × 1 arreglo por año × USD 40 ≈ USD 10,4 M; 20 % del trimestre ≈ 13.000 trabajos ≈ USD 78.000; USD 100.000 pide ticket ≈ USD 51. Anexo A con la cuenta completa y el 5 % en 2 años |
| «Cobramos X, CAC, LTV, costos de IA + server, margen» | Anexo B: tarifa por trabajo ≈ USD 6 (ticket USD 40), LTV ≈ USD 6 por año con 1 arreglo; CAC, IA + servidor y resultado neto «sin dato confirmado» |
| Ticket USD 40, 1 arreglo por año, 5 % en 2 años; mecánica 50.000 autos × 3 × USD 200 | Afirmaciones tipo **supuesto** con fuente «Luigi, 04/11»; mecánica como escenario fuera de los 6 rubros |
| Ejemplo «20 % ~ 500 USD por usuario por mes, 80.000 usuarios, 40.000 USD por mes» | No se usa: mezcla unidades (500 × 80.000 no da 40.000) |

**Ajuste del 04/11 (Ignacio):** la aspiración pasó de 20 % a **25 %** de los trabajos del trimestre (guion actualizado). Con los supuestos
del mentor son ≈ 16.200 trabajos y ≈ USD 97.000 de tarifas con ticket de USD 40; USD 100.000 con ticket de ≈ USD 41.

**Ticket real de la prueba (04/11, Ignacio, de memoria):** cuatro trabajos de $ 50.000 y uno de $ 150.000 = $ 350.000; ticket promedio
$ 70.000 ≈ USD 45 (BNA 30/10). Con ese ticket, el 25 % del trimestre da ≈ USD 109.000 de tarifas (muestra de 5 trabajos: orientativo).
Profesiones de ejemplo para llegar a 72: respaldo «De 6 a 72 profesiones» (no confirmadas).

**Costos e inversión (04/11, Ignacio):** servidores USD 100, desarrollo USD 200 y marketing USD 100 por mes (≈ USD 400; se tomaron en
dólares). Equilibrio ≈ 67 trabajos por mes. CAC ≈ USD 2 con el supuesto de 50 clientes nuevos por mes; LTV ≈ USD 18 con 3 años de permanencia
(supuesto). Inversión: propuesta 40 % tecnología, 35 % marketing, 25 % operaciones, a aprobar.

## Pedido del 05/11 (Ignacio)

- Intro animada original con los Handys (no copia la de ninguna marca): `scripts/video-pitch/intro.html` + sonido sintetizado.
- Respaldo nuevo: UX + IA frente a la competencia (comparación de recorridos; capturas de la competencia pendientes: mandarlas desde las
  apps), marca y UX/UI, publicidades (cuadros de los trailers sin la tarifa anterior; los trailers completos hay que renderizarlos de nuevo),
  tracción en los dos lados (incluye «los chicos repiten lo que ven»: estrategia de recordación, no un dato medido), herramientas por oficio
  (diseños propuestos de las 6 profesiones + números + negocios con meritocracia), plan de 3 meses, cada dólar (45/30/15/10, a aprobar) y
  camino a USD 1 millón en trabajos (aspiración, horizonte supuesto de 12 meses).
- 14 preguntas del jurado. En el video, cada respuesta muestra sus láminas de respaldo.

## Control de calidad

| Pregunta | Estado |
|---|---|
| ¿El discurso sigue siendo el de Ignacio? | Sí: el guion oficial está literal en las notas, repartido por diapositiva. Ajustes solo sugeridos, en un archivo aparte. |
| ¿Se muestra el recorrido de usuario y HandIA? | Sí (diapositiva 2): HandIA en la demo de la landing (rotulado «Demo · HandIA en desarrollo») y camino directo por oficio. |
| ¿Se muestran las herramientas del profesional? | Sí (3): agenda y mensajes de la demo; gastos y herramientas por oficio rotulados como propuesta visual; IA como visión. |
| ¿Competencia sin mentir? | Sí (6 y anexo D): «Sin dato confirmado» donde no hay dato; no se dice que nadie más tenga IA, herramientas o comisión cero. |
| ¿Tarifa 0 % / 15 % correcta? | Sí: 0 % al profesional, 15 % al usuario visible antes de contratar, ejemplo $ 100.000 → $ 115.000 sin descontar costos. No se mencionan modelos ni promociones anteriores. |
| ¿Tracción comprobable vs. visión? | Sí: la 4 no muestra cantidades sin conciliar (rótulo «Informado por el fundador · cantidades en conciliación»). |
| ¿Cifras de mercado etiquetadas? | Sí: rótulo «Objetivo» en 20 %, USD 100.000, 72 y 40 %; hogares ≠ usuarios ≠ trabajos aclarado en notas. |
| ¿Inversión ≠ ingresos aspirados? | Sí: «inversión inicial buscada» vs. «ingresos brutos propios», en pantalla y en notas; anexo E. |
| ¿Cronómetro, notas, tiempos por diapositiva? | Sí, probados en el navegador (e2e). |
| ¿Recorrido en 180 s? | Duraciones del deck = 180 s. La voz (400 palabras) entra en 2:51 a 140 ppm; **no medida en un ensayo real**. |
| ¿Funciona sin internet? | Sí con recursos locales (el e2e comprueba que no carga nada externo). |
| ¿Pantalla completa? | Sí (F en la pública y en el presentador). Probado en 1920 × 1080 y 1366 × 768 (capturas). |

## Verificado en esta sesión

- `npm run verify` (typecheck, pruebas, validación de decks y afirmaciones, guion sincronizado, build) y `npm run e2e` (32/32, con 12
  comprobaciones del pitch: avanzar no entra a anexos, Mayús + F / 0, refresco que conserva la posición y el registro de ensayos,
  Finalizar, tiempos por diapositiva, N oculta notas, Nuevo ensayo sin recargar, pantalla pública sin notas).
- Capturas 1920 × 1080 y 1366 × 768 de las 15 páginas, sin recortes ni superposiciones; vista del presentador durante un ensayo.
- PDF de diapositivas (15 páginas), PDF de lectura (17) y PPTX (15 diapositivas con notas).
- Control remoto y reconexión: cubiertos por el e2e con el deck `handyx` (mismo motor); no probados con un celular real ni con este deck.

## Fuentes

| Dato | Fuente | Estado |
|---|---|---|
| Guion, modelo 0 % / 15 %, metas (20 %, USD 100.000, 72, 40 %), inversión USD 100.000 | Prompt maestro del 04/11/2026 (Ignacio) | Decisión/aspiración del fundador |
| 259.623 hogares (Censo 2022) | Ignacio; INDEC vía La Capital MdP lo publica como viviendas particulares ocupadas | **Confirmar la unidad** con la fuente municipal (mardelplata.gob.ar, bloqueada desde esta sesión) |
| Supuestos de mercado (1 arreglo/año, USD 40, 5 % en 2 años, mecánica) | Luigi, mentor ATICMA (WhatsApp del 04/11/2026) | Supuestos a validar con datos propios |
| IguanaFix | [Cronista (foco corporativo)](https://www.cronista.com/apertura/empresas/cambio-de-foco-iguanafix-deja-a-clientes-individuales-y-va-por-los-corporativos) · [Infonegocios](https://infonegocios.info/que-esta-pasando/iguanafix-supero-mas-de-150-mil-servicios-en-argentina-el-service-de-aire-acondicionado-lo-mas-pedido) | Búsqueda web 04/11/2026; notas de fechas variadas |
| Servidos · Yo te lo arreglo · Zolvers | [servidos.ar](https://servidos.ar/prensa) · [Infonegocios](https://infonegocios.info/amp/nota-principal/yo-te-lo-arreglo) · [Developargentina](https://developargentina.com/directorio/zolvers) | Búsqueda web 04/11/2026 |
| Ay Fix · GoFixii | [Xataka MX](https://www.xataka.com.mx/aplicaciones/ay-fix-es-la-aplicacion-mexicana-que-te-ayuda-a-encontrar-plomero-cerrajero-o-cualquier-servicio-que-necesites) · [Valora Analitik](https://www.valoraanalitik.com/app-para-contratar-plomero-electricista-y-otros-servicios-de-forma-segura-en-colombia/) | Búsqueda web 04/11/2026 |
| Thumbtack · Angi · Taskrabbit · Checkatrade | [Housecall Pro](https://www.housecallpro.com/resources/thumbtack-vs-angi/) · [Jobber](https://getjobber.com/academy/taskrabbit-alternatives/) · [comparador 2026](https://unstar.app/blog/taskrabbit-thumbtack-angi-handy-porch-home-service-apps-ranked-2026) | Sitios de comparación (Taskrabbit con datos en conflicto): **revalidar** en las páginas oficiales |
| Clickie | clickie.com.ar/terminos-y-condiciones (14/10/2026) y /como-funciona | Indicado por Ignacio el 04/11; dominio bloqueado aquí: **revalidar** |
| Muovi | muovi.com.ar/own-boss · App Store id6757713850 | Ídem |
| Home Solution | homesolution.net · /ar/prestadores/registrar/1 | Ídem |
| Pantallas de celular | Demo interactiva de la landing (landing.handyc.com/demo, `Handy-landing-page-fe` @ ac3b245), datos ficticios — pedido de Ignacio del 04/11: la app todavía se está puliendo | Rotuladas «Demo»; se descartaron las que muestran la tarifa anterior. Procedimiento: `brands/handyx/assets/demo-landing/LEEME.md` |

## Pendientes concretos

1. **Ensayo cronometrado** de Ignacio con el modo de ensayo; si pasa de 3:00, aplicar los recortes sugeridos.
2. **Conciliar** trabajos y comisiones cobradas (informados: 5) y sacar un corte del CRM de registrados (informados: 56) antes de mostrar cifras.
3. **Revalidar** Clickie, Muovi y Home Solution y la fuente municipal de hogares desde una red con acceso (en esta sesión hay que habilitar
   esos dominios en la configuración de red).
4. **Circuito de cobro del 15 %** (cómo se recauda y rinde) y su implementación en las apps y en la demo de la landing: hoy muestran el esquema anterior (por eso no se usan las pantallas de presupuestos, precio y cobros).
5. **Asignación de los USD 100.000** e hitos a financiar (anexo E queda «pendiente de aprobar»).
6. Fechas del primer trimestre comercial y ticket medio real (sin ticket no hay cantidad de trabajos).
7. Probar el control desde el celular en el lugar (datos móviles) y el proyector real.
8. Merge a `main` del PR para publicar en Hostinger (no se desplegó nada).
