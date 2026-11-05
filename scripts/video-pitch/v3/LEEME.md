# Video v3 (05/11/2026): escenas animadas sincronizadas

Scripts del corte entregado para la semifinal. Trabajan con una carpeta de trabajo `S` (el scratchpad de la sesión) que tiene
los insumos privados: la grabación de Ignacio (`video/original.mp4`), los cuadros de la cámara (`v2/camara/`), la transcripción
editada (`v2/edicion.json`), los cuadros del clip del mundo (`frames-p/`), la intro (`edicion/intro.mp4`) y la música sintetizada
(`musica/`). **Esos insumos no van al repo** (cara y voz de una persona real).

1. Servidor sin recargas: `npx vite --config scripts/video-pitch/vite.render.config.ts` (127.0.0.1:5191).
2. Planes: `python3 armar_plan.py pitch|preguntas`, `python3 extra.py`, `python3 oficial.py` (tomas, golpes, cara, subtítulos
   corregidos: 25 % en pantalla, «casi 260.000», Mar del Plata, Handyx…).
3. Cuadros: `./lanzar.sh <plan.json> <carpeta> 4` (reparte la línea de tiempo entre 4 procesos de `render.cjs`, que
   copiar a `scripts/video-pitch/` para que resuelva `playwright`).
4. Audio y video: `python3 -I componer.py audio-voz|audio-fondo|audio-oficial|audio-seccion …|video …|unir …`.
5. Presentación: `npm run build`, `npm run exportar:pptx|exportar:pdf -- --deck=handyx-aticma --version=evento`, `python3 zips.py`.
