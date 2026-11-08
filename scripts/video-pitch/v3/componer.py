# Video v3: audio y composición. Etapas:
#   audio-voz    → voz sin silencios + música (con compresión por la voz) + efectos del mundo + cierre suave
#   audio-fondo  → la misma música y los efectos, sin la voz (para hablar en vivo encima), un poco más baja
#   audio-seccion <musica.wav> <dur> <salida.wav> → música de una sección (preguntas, extra)
#   video <cuadros> <audio.wav> <dur> <salida.mp4>
#   unir <salida.mp4> <720p.mp4|-> <entrada1.mp4> <entrada2.mp4> ...
import json, subprocess, sys
S = '/tmp/claude-0/-home-user/10ab011c-6752-54be-831e-b3c4da2461d0/scratchpad'
ORIG = f'{S}/video/original.mp4'
ed = json.load(open(f'{S}/v2/edicion.json')); edl = ed['edl']
FINAL_SRC = 183.4; FIN = ed['mapa']['183.4']; DUR = round(FIN + 18.6, 3)   # 194.13: termina el mundo
CIERRE = 7.0                                                                 # cierre con los QR

def run(c):
    print(' '.join(c[:8]), '…', flush=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', *c], check=True)

def grafo(con_voz):
    f, partes = [], []
    for i, (desde, s0, dur) in enumerate(edl if con_voz else []):
        f.append(f'[0:a]atrim=start={s0}:end={s0 + dur},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,afade=t=in:d=0.015,afade=t=out:st={max(0, dur - 0.015):.3f}:d=0.015[v{i}]')
        partes.append(f'[v{i}]')
    if con_voz: f.append(''.join(partes) + f'concat=n={len(edl)}:v=0:a=1,apad=whole_dur={DUR}[voz0]')
    fac = FINAL_SRC / FIN
    f.append(f'[1:a]atrim=0:{FINAL_SRC},asetpts=PTS-STARTPTS,atempo={fac:.5f}[m1]')
    f.append(f'[1:a]atrim=start={FINAL_SRC},asetpts=PTS-STARTPTS[m2]')
    f.append(f'[m1][m2]concat=n=2:v=0:a=1,aresample=48000,volume={0.094 if con_voz else 0.16}[mus0]')
    f.append(f'[2:a]atrim=start={FINAL_SRC - 0.3},asetpts=PTS-STARTPTS,adelay={int((FIN - 0.3) * 1000)}:all=1,volume=0.32[sfx]')
    # cierre: música suave mientras aparecen los QR
    f.append(f'[3:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:{CIERRE},afade=t=in:d=0.8,afade=t=out:st={CIERRE - 1.6}:d=1.6,volume=0.5,adelay={int(DUR * 1000)}:all=1[cie]')
    if con_voz:
        f.append('[voz0]asplit=2[voz][llave]')
        f.append('[mus0][llave]sidechaincompress=threshold=0.02:ratio=4:attack=15:release=350:knee=3[mus]')
        f.append(f'[voz][sfx][mus][cie]amix=inputs=4:duration=longest:normalize=0,atrim=0:{DUR + CIERRE},loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000[a]')
    else:
        f.append(f'[mus0][sfx][cie]amix=inputs=3:duration=longest:normalize=0,atrim=0:{DUR + CIERRE},loudnorm=I=-20:TP=-2:LRA=11,aresample=48000[a]')
    return ';'.join(f)

etapa = sys.argv[1]
if etapa in ('audio-voz', 'audio-fondo'):
    con_voz = etapa == 'audio-voz'
    run(['-i', ORIG, '-i', f'{S}/musica/musica-pitch.wav', '-i', f'{S}/montaje/sfx-final.wav', '-i', f'{S}/v3/musica-cierre.wav',
         '-filter_complex', grafo(con_voz), '-map', '[a]', '-ac', '2', f'{S}/v3/{etapa}.wav'])
elif etapa == 'audio-oficial':
    # pitch de fondo con el guion oficial: música propia, efectos del mundo cuando arranca el clip y el cierre suave
    plan = json.load(open(f'{S}/v3/plan-oficial.json')); mundo = plan['final']['desde']; dur = plan['dur']; fin = plan['final']['hasta']
    f = [f'[0:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:{mundo + 0.6},afade=t=out:st={mundo - 0.4}:d=1.0,volume=0.55[mus]',
         f'[1:a]atrim=start={FINAL_SRC - 0.3},asetpts=PTS-STARTPTS,adelay={int((mundo - 0.3) * 1000)}:all=1,volume=0.32[sfx]',
         f'[2:a]atrim=start={FINAL_SRC},asetpts=PTS-STARTPTS,aresample=48000,volume=0.12,adelay={int(mundo * 1000)}:all=1[mm]',
         f'[3:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:{dur - fin},afade=t=in:d=0.8,afade=t=out:st={dur - fin - 1.6}:d=1.6,volume=0.5,adelay={int(fin * 1000)}:all=1[cie]',
         f'[mus][sfx][mm][cie]amix=inputs=4:duration=longest:normalize=0,atrim=0:{dur},loudnorm=I=-20:TP=-2:LRA=11,aresample=48000[a]']
    run(['-i', f'{S}/v3/musica-oficial.wav', '-i', f'{S}/montaje/sfx-final.wav', '-i', f'{S}/musica/musica-pitch.wav', '-i', f'{S}/v3/musica-cierre.wav',
         '-filter_complex', ';'.join(f), '-map', '[a]', '-ac', '2', f'{S}/v3/audio-oficial.wav'])
elif etapa == 'audio-seccion':
    musica, dur, salida = sys.argv[2], float(sys.argv[3]), sys.argv[4]
    run(['-i', musica, '-filter_complex', f'[0:a]aresample=48000,aformat=channel_layouts=stereo,apad=whole_dur={dur},atrim=0:{dur},afade=t=in:d=0.6,afade=t=out:st={dur - 1.8}:d=1.8,loudnorm=I=-19:TP=-2:LRA=11,aresample=48000[a]',
         '-map', '[a]', '-ac', '2', salida])
elif etapa == 'video':
    cuadros, audio, dur, salida = sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5]
    run(['-framerate', '30', '-i', f'{cuadros}/f%05d.jpg', '-i', audio, '-map', '0:v', '-map', '1:a', '-t', dur, '-r', '30',
         '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', salida])
elif etapa == 'unir':
    salida, chica, ins = sys.argv[2], sys.argv[3], sys.argv[4:]
    n = len(ins)
    fc = ';'.join(f'[{i}:v]fps=30,scale=1920:1080,format=yuv420p,setsar=1[v{i}];[{i}:a]aresample=48000,aformat=sample_rates=48000:channel_layouts=stereo[a{i}]' for i in range(n))
    fc += ';' + ''.join(f'[v{i}][a{i}]' for i in range(n)) + f'concat=n={n}:v=1:a=1[vv][aa]'
    if chica != '-':
        fc += ';[vv]split=2[v][w];[w]scale=1280:720[v7];[aa]asplit=2[a][a7]'
        mapas = ['-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', salida,
                 '-map', '[v7]', '-map', '[a7]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '24', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', chica]
    else:
        mapas = ['-map', '[vv]', '-map', '[aa]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', salida]
    run([*sum((['-i', x] for x in ins), []), '-filter_complex', fc, *mapas])
print('listo', etapa)
