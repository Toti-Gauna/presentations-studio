# Audio y video v4 (grabación del 05/11). Etapas: audio-voz | audio-fondo | video <cuadros> <audio> <dur> <salida>
#   voz: tramos de la grabación sin las pausas largas + el cierre hablado sobre el mundo + música propia (baja sola con la voz)
#        + efectos del clip del mundo + música suave del cierre con los QR
#   fondo: la misma música y los efectos, sin voz (para hablar encima), un poco más baja
import json, subprocess, sys
S = '/tmp/claude-0/-home-user/10ab011c-6752-54be-831e-b3c4da2461d0/scratchpad'
V4 = f'{S}/v4'
ed = json.load(open(f'{V4}/edicion.json'))
W0 = ed['cierre_desde']; MUNDO = 18.6; CIERRE = W0 + MUNDO; QR = 7.0; DUR = round(CIERRE + QR, 3)
FINAL_SRC = 183.4   # en sfx-final.wav, el instante en que arranca el clip del mundo

def run(c):
    print(' '.join(c[:6]), '…', flush=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', *c], check=True)

def grafo(con_voz):
    f = []
    if con_voz:
        partes = []
        for i, (desde, s0, dur) in enumerate(ed['edl']):
            f.append(f'[0:a]atrim=start={s0}:end={s0 + dur},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,afade=t=in:d=0.012,afade=t=out:st={max(0, dur - 0.012):.3f}:d=0.012[v{i}]')
            partes.append(f'[v{i}]')
        f.append(''.join(partes) + f'concat=n={len(partes)}:v=0:a=1,apad=whole_dur={DUR}[pitch]')
        f.append(f'[1:a]atrim=0:{ed["cierre_dur"]},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,afade=t=out:st={ed["cierre_dur"] - 0.3}:d=0.3,adelay={int(W0 * 1000)}:all=1,apad=whole_dur={DUR}[fin]')
        f.append('[pitch][fin]amix=inputs=2:duration=longest:normalize=0,highpass=f=70,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120[voz0]')
    f.append(f'[2:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:{DUR},volume={0.094 if con_voz else 0.16}[mus0]')
    f.append(f'[3:a]atrim=start={FINAL_SRC - 0.3},asetpts=PTS-STARTPTS,adelay={int((W0 - 0.3) * 1000)}:all=1,volume=0.32[sfx]')
    f.append(f'[4:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:{QR},afade=t=in:d=0.8,afade=t=out:st={QR - 1.6}:d=1.6,volume=0.5,adelay={int(CIERRE * 1000)}:all=1[cie]')
    if con_voz:
        f.append('[voz0]asplit=2[voz][llave]')
        f.append('[mus0][llave]sidechaincompress=threshold=0.02:ratio=4:attack=15:release=350:knee=3[mus]')
        f.append(f'[voz][sfx][mus][cie]amix=inputs=4:duration=longest:normalize=0,atrim=0:{DUR},loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000[a]')
    else:
        f.append(f'[mus0][sfx][cie]amix=inputs=3:duration=longest:normalize=0,atrim=0:{DUR},loudnorm=I=-20:TP=-2:LRA=11,aresample=48000[a]')
    return ';'.join(f)

etapa = sys.argv[1]
if etapa in ('audio-voz', 'audio-fondo'):
    run(['-i', f'{V4}/original.mov', '-i', f'{V4}/final.mp4', '-i', f'{V4}/musica-pitch4.wav', '-i', f'{S}/montaje/sfx-final.wav', '-i', f'{S}/v3/musica-cierre.wav',
         '-filter_complex', grafo(etapa == 'audio-voz'), '-map', '[a]', '-ac', '2', f'{V4}/{etapa}.wav'])
elif etapa == 'video':
    cuadros, audio, dur, salida = sys.argv[2:6]
    run(['-framerate', '30', '-i', f'{cuadros}/f%05d.jpg', '-i', audio, '-map', '0:v', '-map', '1:a', '-t', dur, '-r', '30',
         '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', salida])
print('listo', etapa, DUR)
