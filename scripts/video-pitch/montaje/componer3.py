import subprocess, sys
S='/tmp/claude-0/-home-user/10ab011c-6752-54be-831e-b3c4da2461d0/scratchpad'
E=f'{S}/edicion'; ORIG=f'{S}/video/original.mp4'
# Cámara en un círculo (D) en la columna derecha; se funde al empezar el final (FIN_CAM).
INTRO=5.3; FIN_CAM=183.4; MUS=0.094; D=300; CX,CY=1582,322; RECORTE='600:600:210:100'; HABLA=199.52; TOT=202.0
X264=['-c:v','libx264','-preset','medium','-crf','19','-pix_fmt','yuv420p','-threads','4']
def run(c): print(' '.join(c[:4]),'…',flush=True); subprocess.run(['ffmpeg','-v','error','-y',*c],check=True)
etapa=sys.argv[1]
if etapa=='pitch':
    f=[f'[0:v]format=yuv420p[base]',
       f'[1:v]crop={RECORTE},scale={D}:{D},format=yuva420p[cam0]',f'[2:v]scale={D}:{D},format=gray[m]',f'[cam0][m]alphamerge,fade=t=out:st={FIN_CAM-0.5}:d=0.5:alpha=1[cam]',
       f'[6:v]format=yuva420p,fade=t=out:st={FIN_CAM-0.5}:d=0.5:alpha=1[aro]',
       f"[base][aro]overlay={CX-48}:{CY-48}:eof_action=pass:enable='lt(t,{FIN_CAM})'[b1]",f"[b1][cam]overlay={CX}:{CY}:eof_action=pass:enable='lt(t,{FIN_CAM})'[b2]",
       f'[1:v]trim=0:{INTRO},setpts=PTS-STARTPTS,scale=1920:1080,format=yuva420p,fade=t=out:st={INTRO-0.5}:d=0.5:alpha=1[full]',
       '[b2][full]overlay=0:0:eof_action=pass[b3]',
       f"[3:v]format=yuva420p,fade=t=in:st=0.6:d=0.4:alpha=1,fade=t=out:st={INTRO-0.9}:d=0.4:alpha=1[zoc]",
       f"[b3][zoc]overlay=0:0:enable='between(t,0,{INTRO})'[b4]",
       f'[b4]subtitles={S}/montaje/subtitulos.ass,format=yuv420p[v]',
       f'[1:a]aresample=48000,aformat=channel_layouts=stereo,apad=whole_dur={TOT},asplit=2[voz][vozk]','[4:a]volume=0.32[sfx]',
       f'[5:a]aresample=48000,volume={MUS}[mus0]','[mus0][vozk]sidechaincompress=threshold=0.02:ratio=4:attack=15:release=350:knee=3[mus]',
       '[voz][sfx][mus]amix=inputs=3:duration=first:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000[a]']
    run(['-framerate','30','-i',f'{S}/frames-p/f%05d.jpg','-i',ORIG,'-loop','1','-framerate','30','-t','1','-i',f'{E}/mascara-circulo.png',
         '-loop','1','-framerate','30','-t',str(INTRO),'-i',f'{E}/zocalo.png','-i',f'{S}/montaje/sfx-final.wav','-i',f'{S}/musica/musica-pitch.wav','-loop','1','-framerate','30','-t',str(TOT),'-i',f'{E}/aro.png',
         '-filter_complex',';'.join(f),'-map','[v]','-map','[a]','-t',str(TOT),'-r','30',*X264,'-c:a','aac','-b:a','192k','-ar','48000',f'{S}/montaje/pitch.mp4'])
if etapa=='preguntas':
    run(['-framerate','30','-i',f'{S}/frames-q/f%05d.jpg','-i',f'{S}/montaje-q/audio-q.wav','-map','0:v','-map','1:a','-shortest','-r','30',*X264,'-c:a','aac','-b:a','192k','-ar','48000',f'{S}/montaje-q/preguntas.mp4'])
if etapa=='preguntas-audio':   # mismo video de las preguntas, audio nuevo (música + efectos), sin recodificar la imagen
    run(['-i',f'{S}/montaje-q/preguntas.mp4','-i',f'{S}/montaje-q/audio-q.wav','-map','0:v','-map','1:a','-c:v','copy','-af','loudnorm=I=-18:TP=-1.5:LRA=11,aresample=48000','-c:a','aac','-b:a','192k','-shortest',f'{S}/montaje-q/preguntas-m.mp4'])
if etapa=='unir':
    ins=[f'{E}/intro.mp4',f'{S}/montaje/pitch.mp4',f'{S}/montaje-q/preguntas-m.mp4']
    fc=';'.join(f'[{i}:v]fps=30,format=yuv420p,setsar=1[v{i}];[{i}:a]aformat=sample_rates=48000:channel_layouts=stereo[a{i}]' for i in range(3))+';[v0][a0][v1][a1][v2][a2]concat=n=3:v=1:a=1[v][a]'
    fc=fc.replace('[v][a]','[vv][aa]')+';[vv]split=2[v][w];[w]scale=1280:720[v7];[aa]asplit=2[a][a7]'
    run([*sum((['-i',x] for x in ins),[]),'-filter_complex',fc,
         '-map','[v]','-map','[a]','-c:v','libx264','-preset','medium','-crf','23','-pix_fmt','yuv420p','-threads','4','-c:a','aac','-b:a','192k','-movflags','+faststart',f'{S}/montaje/handyx-pitch-aticma.mp4',
         '-map','[v7]','-map','[a7]','-c:v','libx264','-preset','medium','-crf','26','-pix_fmt','yuv420p','-threads','4','-c:a','aac','-b:a','128k','-movflags','+faststart',f'{S}/montaje/handyx-pitch-aticma-720p.mp4'])
print('listo',etapa)
