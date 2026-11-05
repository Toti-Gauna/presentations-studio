# Video v4 (05/11/2026, grabación fluida de Ignacio + cierre de 15 s)

Mismo motor que la v3 (`scripts/video-pitch/v3/`), con la grabación nueva. Los insumos privados (grabación, cuadros de la
cara, transcripción) quedan en la carpeta de trabajo `S/v4`, nunca en el repo.

1. Transcripción con palabras y tiempos: `scratchpad/edicion/transcribir.py` con el modelo local `modelo-small` (la red no deja
   bajar modelos). Cara: `ffmpeg … fps=30,crop=340:340:55:20,scale=300:300 …` → `S/v4/camara/f%05d.jpg`.
2. `editar.py`: corta las pausas largas (deja respiros más largos entre diapositivas), corrige la transcripción (Handyx,
   odisea, comisión, «casi 260.000», 25 %, 100 %…) y arma los subtítulos; el cierre de 15 s arranca con el clip del mundo.
3. `musica4.py pitch4`: la música del pitch con el quiebre del mundo en el compás 71 (3,03 s después de que arranca el clip).
4. `armar_plan4.py`: cada golpe anclado a la frase que lo dispara (fuente → salida sin pausas).
5. `lanzar4.sh` (render en paralelo con `render4.cjs`), `componer4.py audio-voz|audio-fondo|video`, `entregar.sh`.
