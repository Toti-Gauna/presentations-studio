#!/bin/bash
S=/tmp/claude-0/-home-user/10ab011c-6752-54be-831e-b3c4da2461d0/scratchpad
E=/home/user/presentations-studio/salida/entregables
P=/home/user/presentations-studio/salida
cd $S/v4
cuantos() { ls "$1" 2>/dev/null | wc -l; }
N=$(python3 -c "import json;print(round(json.load(open('plan-voz.json'))['dur']*30))")
until [ "$(cuantos k-voz)" -ge "$N" ] && [ "$(cuantos k-fondo)" -ge "$N" ]; do sleep 5; done
python3 -I componer4.py video $S/v4/k-voz $S/v4/audio-voz.wav 174.71 $S/v4/pitch-voz.mp4
python3 -I componer4.py video $S/v4/k-fondo $S/v4/audio-fondo.wav 174.71 $S/v4/pitch-fondo.mp4
cd $S/v3
python3 -I componer.py unir $E/Handyx-ATICMA-2-pitch-de-fondo-sin-voz.mp4 - $S/edicion/intro.mp4 $S/v4/pitch-fondo.mp4
python3 -I componer.py unir $E/Handyx-ATICMA-1-video-completo.mp4 $E/Handyx-ATICMA-1-video-completo-720p.mp4 $S/edicion/intro.mp4 $S/v4/pitch-voz.mp4 $S/v3/preguntas.mp4 $S/v3/extra-a.mp4 /home/user/presentations-studio/brands/handyx/assets/video/handia-voz.mp4 $S/v3/extra-b.mp4
cp -f $P/pptx/handyx-aticma-evento.pptx $E/Handyx-ATICMA.pptx
cp -f $P/pdf/handyx-aticma-evento.pdf $E/Handyx-ATICMA.pdf
echo ENTREGABLES-LISTOS
