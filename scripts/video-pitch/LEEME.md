# Edición del video del pitch (04/11/2026)

Scripts usados para editar el ensayo grabado por Ignacio (3:19, 720p) en `salida/video/handyx-pitch-aticma.mp4` (1080p, 5:09):
intro con zócalo → diapositivas sincronizadas con la voz + cámara recortada a la derecha + subtítulos → sección «Preguntas difíciles»
(tarjeta de la pregunta + diapositiva de respuesta, con un colchón musical sintetizado).

1. `transcribir.py <modelo> <audio.wav> <salida.json>`: faster-whisper (modelo `small` int8; en esta sesión se obtuvo de npm
   `@skillninja/shortmovie-telop-model-p0..p3` porque Hugging Face estaba bloqueado). Palabras con marca de tiempo.
2. `graficos.cjs <carpeta> '<json de preguntas>'`: fondo con la marca, zócalo, máscara de la cámara y tarjetas de preguntas (Playwright).
3. `componer2.py diapositivas|preguntas|pitch|unir`: ffmpeg por etapas (en un solo paso se quedaba sin memoria). Los tramos de cada
   diapositiva (`TRAMOS`) salen de la transcripción. Las rutas apuntan a la carpeta temporal de la sesión: ajustarlas para repetir.

Subtítulos del ensayo: `subtitulos-ensayo-04-11.srt` (transcripción automática con correcciones de nombres).

## Montaje animado (05/11)

`montaje/`: una página HTML con GSAP que se renderiza cuadro a cuadro (Playwright, 30 fps):
- `plan_pitch.py`: tomas del pitch con **cámara que sigue la transcripción** (cada frase lleva el encuadre a la parte de la lámina de la
  que se habla), frases clave animadas y el **final épico**: el mapa arranca en Mar del Plata, se aleja a un mundo con grietas y los Handys
  vuelan a arreglarlas; el mundo se enciende con «Un mundo con más soluciones y menos problemas» y cierra con «¡Muchas gracias!».
  Globo con d3-geo + world-atlas (land-50m), en la carpeta de trabajo de la sesión.
- `plan_q.py`: sección de preguntas con tarjetas animadas (palabras que entran, personaje, barra de tiempo) y láminas con movimiento.
- `sonidos.py`: efectos del final (por debajo de la voz) y música de las preguntas, sintetizados.
- `componer3.py pitch|preguntas|unir`: cámara, zócalo, subtítulos (hasta la frase final, que va en pantalla) y audio; une intro + pitch + preguntas.
- `transcripcion-ensayo-04-11.json`: transcripción con marca de tiempo por palabra (faster-whisper small).

## Final ATICMA (05/11): cierre en vivo, finanzas e IPO

- `montaje/plan_final.py <carpeta>`: plan del **clip del cierre** que se usa en vivo (diapositiva 7, paso 2): el mismo final del
  montaje (Mar del Plata → mundo con grietas → los Handys lo arreglan → «Un mundo con más soluciones y menos problemas» → «¡Muchas
  gracias!»), centrado (`ox: 960`, `derecha: 0`). Cuadros con `render.cjs <carpeta> <cuadros> 0 18.85`; audio: efectos de
  `sonidos.py final` desde 183,15 s (volumen 0,8, fundidos); H.264 + AAC con `+faststart` →
  `brands/handyx/assets/video/mundo-final.mp4` y su póster (último cuadro) `mundo-final-poster.jpg`.
- `graficos-finanzas.cjs <carpeta>`: gráficos del respaldo «El círculo que multiplica» y «Camino a la IPO» (PNG transparente) →
  `brands/handyx/assets/conceptos/{circulo-multiplica,camino-ipo}.png`.
- `plan_q.py`: 18 preguntas (se suman «¿Cómo van a multiplicar los ingresos?», «¿Van a invertir la plata de los inversores en cripto?»
  y «¿Piensan en una salida? ¿Una IPO?», cada una con su respaldo). `componer3.py unir` deja el video en 1080p (CRF 23) y una copia en 720p.
- `../machete-preguntas.py`: además de las respuestas, agrega una última página con el número de cada lámina en el presentador
  (número + Enter) y su atajo.

## Ferreterías conectadas (05/11)

`ferreterias/`: animación de 16 s del respaldo «Ferreterías conectadas: stock para los profesionales» (visión a explorar).
- `ferreterias.html`: escena 1920 × 1080 con GSAP; `window.ir(t)` la deja en el segundo `t` (la línea de tiempo mueve los contenedores;
  autos, nubes, sol, ventanas y personajes se calculan desde `t`, así cada cuadro es reproducible).
- `render.cjs <pagina.html> <cuadros> 0 16`: cuadros JPG; `sonido.py <salida.wav>` (numpy): efectos suaves sincronizados.
- ffmpeg (H.264 high CRF 20 + AAC, `+faststart`) → `brands/handyx/assets/video/ferreterias.mp4`; póster = último cuadro.
- En el video del pitch entra como toma `frames` del montaje (`plan_q.py`, `ANIM`), con su audio mezclado en `sonidos.py preguntas`.

