"""Video del pitch en etapas livianas: pista de diapositivas → composición → sección de preguntas → unión."""
import subprocess, sys, os
S = '/tmp/claude-0/-home-user/10ab011c-6752-54be-831e-b3c4da2461d0/scratchpad'
E = f'{S}/edicion'; T = f'{E}/tmp'; os.makedirs(T, exist_ok=True)
D = '/home/user/presentations-studio/salida/pptx/handyx-aticma-evento'
ORIG = f'{S}/video/original.mp4'
TOTAL = 199.52
TRAMOS = [('01', 0.0), ('02', 43.3), ('03', 79.9), ('04', 104.6), ('05', 115.9), ('07', 136.3), ('17', 162.0), ('07', 175.8), ('08', 183.4)]
INTRO = 5.3
SX, SY, SW, SH = 40, 110, 1504, 846
CW, CH = 304, 540
CX, CY = 1576, SY + (SH - CH) // 2
FX = 343
X264 = ['-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-threads', '4']
def run(cmd): print(' '.join(cmd[:6]), '…', flush=True); subprocess.run(['ffmpeg', '-v', 'error', '-y', *cmd], check=True)
etapa = sys.argv[1]

def clip(img, dur, out, w, h, fade=0.3):
    run(['-loop', '1', '-framerate', '30', '-t', f'{dur:.3f}', '-i', img, '-vf',
         f'scale={w}:{h},format=yuv420p,fade=t=in:st=0:d={fade},fade=t=out:st={max(0, dur - fade):.3f}:d={fade}', '-r', '30', *X264, '-an', out])

if etapa == 'diapositivas':
    lista = []
    for k, (n, t0) in enumerate(TRAMOS):
        t1 = TRAMOS[k + 1][1] if k + 1 < len(TRAMOS) else TOTAL
        out = f'{T}/d{k}.mp4'; clip(f'{D}/{n}.png', t1 - t0, out, SW, SH, fade=0.25); lista.append(out)
    open(f'{T}/d.txt', 'w').write(''.join(f"file '{x}'\n" for x in lista))
    run(['-f', 'concat', '-safe', '0', '-i', f'{T}/d.txt', '-c', 'copy', f'{T}/diapositivas.mp4'])

if etapa == 'pitch':
    f = [f'[0:v]format=yuv420p[base]',
         f'[1:v]setpts=PTS-STARTPTS[sl]',
         f'[base][sl]overlay={SX}:{SY}:shortest=0[b1]',
         f'[2:v]crop=405:720:{FX}:0,scale={CW}:{CH},format=yuva420p[cam0]',
         f'[3:v]scale={CW}:{CH},format=gray[m]',
         '[cam0][m]alphamerge[cam]',
         f'[b1][cam]overlay={CX}:{CY}[b2]',
         f'[2:v]trim=0:{INTRO},setpts=PTS-STARTPTS,scale=1920:1080,format=yuva420p,fade=t=out:st={INTRO - 0.5}:d=0.5:alpha=1[full]',
         f"[b2][full]overlay=0:0:eof_action=pass[b3]",
         f"[4:v]format=yuva420p,fade=t=in:st=0.6:d=0.4:alpha=1,fade=t=out:st={INTRO - 0.9}:d=0.4:alpha=1[zoc]",
         f"[b3][zoc]overlay=0:0:enable='between(t,0,{INTRO})'[b4]",
         f'[b4]subtitles={E}/subtitulos.ass,format=yuv420p[v]']
    run(['-loop', '1', '-framerate', '30', '-t', str(TOTAL), '-i', f'{E}/fondo.png', '-i', f'{T}/diapositivas.mp4', '-i', ORIG,
         '-loop', '1', '-framerate', '30', '-t', '1', '-i', f'{E}/mascara.png', '-loop', '1', '-framerate', '30', '-t', str(INTRO), '-i', f'{E}/zocalo.png',
         '-filter_complex', ';'.join(f), '-map', '[v]', '-map', '2:a', '-r', '30', *X264, '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-t', str(TOTAL), f'{E}/pitch.mp4'])

if etapa == 'preguntas':
    seq = [(f'{E}/preguntas-intro.png', 3.5)]
    for k in range(1, 11): seq += [(f'{E}/pregunta-{k:02d}.png', 3.2), (f'{D}/{17 + k:02d}.png', 7.0)]
    seq += [(f'{D}/08.png', 4.0)]
    lista = []
    for k, (img, d) in enumerate(seq):
        out = f'{T}/q{k:02d}.mp4'; clip(img, d, out, 1920, 1080, fade=0.3); lista.append(out)
    open(f'{T}/q.txt', 'w').write(''.join(f"file '{x}'\n" for x in lista))
    total = sum(d for _, d in seq)
    notas = [(261.63, 329.63, 392.0), (220.0, 261.63, 329.63), (174.61, 220.0, 261.63), (196.0, 246.94, 293.66)]
    expr = '+'.join(f"if(lt(mod(t\\,16)\\,{(i+1)*4})*gte(mod(t\\,16)\\,{i*4})\\,{'+'.join(f'sin(2*PI*{fr}*t)' for fr in ch)}\\,0)" for i, ch in enumerate(notas))
    run(['-f', 'lavfi', '-i', f"aevalsrc=0.035*({expr})*(0.6+0.4*sin(2*PI*0.25*t)):s=48000:d={total:.2f}",
         '-af', f'lowpass=f=1200,afade=t=in:d=1.5,afade=t=out:st={total - 2:.2f}:d=2', '-ac', '2', '-c:a', 'aac', '-b:a', '160k', f'{T}/colchon.m4a'])
    run(['-f', 'concat', '-safe', '0', '-i', f'{T}/q.txt', '-i', f'{T}/colchon.m4a', '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'copy', '-shortest', f'{E}/preguntas.mp4'])

if etapa == 'unir':
    run(['-i', f'{E}/pitch.mp4', '-i', f'{E}/preguntas.mp4', '-filter_complex',
         '[0:v]fps=30,format=yuv420p,setsar=1[v0];[1:v]fps=30,format=yuv420p,setsar=1[v1];[0:a]aformat=sample_rates=48000:channel_layouts=stereo[a0];[1:a]aformat=sample_rates=48000:channel_layouts=stereo[a1];[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]',
         '-map', '[v]', '-map', '[a]', *X264, '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', f'{E}/handyx-pitch-aticma.mp4'])
print('listo', etapa)
