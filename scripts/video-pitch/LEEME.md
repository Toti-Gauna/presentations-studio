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
