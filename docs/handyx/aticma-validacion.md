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
5. **Anexos para el jurado:** Mayús + A (unit economics), B (validación), C (roadmap), D (competidores), E (inversión), F y G (preguntas 1/2 y 2/2);
   **0** vuelve a la última diapositiva. También desde el índice del presentador o el menú ☰ del celular.
6. **Celular:** Conectar control remoto → QR privado (nunca se proyecta) → Aprobar.
7. **Sin animaciones:** `version=estatica`. **Sin internet:** `npm run paquete:local` o el build servido en la notebook (fuentes y recursos locales).
8. **Contingencia:** `salida/pdf/handyx-aticma-evento.pdf` (15 páginas: 7 diapositivas, el paso 2 de la 7 y 7 anexos), el PDF de lectura y
   `salida/pptx/handyx-aticma-evento.pptx` (imágenes + guion y notas en las notas del orador). Se regeneran con
   `npm run build && npm run exportar:pdf -- --deck=handyx-aticma --version=evento` y `npm run exportar:pptx -- --deck=handyx-aticma --version=evento`
   (el PPTX necesita python3 con python-pptx).

## Control de calidad

| Pregunta | Estado |
|---|---|
| ¿El discurso sigue siendo el de Ignacio? | Sí: el guion oficial está literal en las notas, repartido por diapositiva. Ajustes solo sugeridos, en un archivo aparte. |
| ¿Se muestra el recorrido de usuario y HandIA? | Sí (diapositiva 2): camino HandIA como **concepto rotulado** («Concepto · en desarrollo») y camino directo con capturas reales. |
| ¿Se muestran las herramientas del profesional? | Sí (3): agenda e ingresos con capturas reales; gastos y herramientas por oficio rotulados como propuesta visual; IA como visión. |
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
| Clickie | clickie.com.ar/terminos-y-condiciones (14/10/2026) y /como-funciona | Indicado por Ignacio el 04/11; dominio bloqueado aquí: **revalidar** |
| Muovi | muovi.com.ar/own-boss · App Store id6757713850 | Ídem |
| Home Solution | homesolution.net · /ar/prestadores/registrar/1 | Ídem |
| Capturas | Prototipos handyx-client-fe / handyx-specialist-fe en modo de prueba (datos ficticios) | Reales; HandIA desactivada en la app |

## Pendientes concretos

1. **Ensayo cronometrado** de Ignacio con el modo de ensayo; si pasa de 3:00, aplicar los recortes sugeridos.
2. **Conciliar** trabajos y comisiones cobradas (informados: 5) y sacar un corte del CRM de registrados (informados: 56) antes de mostrar cifras.
3. **Revalidar** Clickie, Muovi y Home Solution y la fuente municipal de hogares desde una red con acceso (en esta sesión hay que habilitar
   esos dominios en la configuración de red).
4. **Circuito de cobro del 15 %** (cómo se recauda y rinde) y su implementación en las apps: hoy las apps muestran el esquema anterior.
5. **Asignación de los USD 100.000** e hitos a financiar (anexo E queda «pendiente de aprobar»).
6. Fechas del primer trimestre comercial y ticket medio real (sin ticket no hay cantidad de trabajos).
7. Probar el control desde el celular en el lugar (datos móviles) y el proyector real.
8. Merge a `main` del PR para publicar en Hostinger (no se desplegó nada).
