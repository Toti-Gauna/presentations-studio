// Voz real de HandIA (ElevenLabs) para la animación «HandIA te habla» del respaldo del pitch.
// Necesita ELEVENLABS_API_KEY en el entorno (nunca en el repo) y acceso de red a api.elevenlabs.io.
// Voces: ELEVENLABS_VOZ_HANDIA (obligatoria) y ELEVENLABS_VOZ_VECINO (opcional; sin ella, las frases del vecino quedan solo como texto).
// Uso: node voz-elevenlabs.mjs guion-voz.json <audio-del-clip.wav> <clip.mp4> <salida.mp4>
// No probado contra la API desde la sesión que lo escribió (red bloqueada): revisar la primera salida.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const [guionRuta, audioClip, clip, salida] = process.argv.slice(2);
if (!salida) throw new Error('Uso: node voz-elevenlabs.mjs guion-voz.json <audio-del-clip.wav> <clip.mp4> <salida.mp4>');
const clave = process.env.ELEVENLABS_API_KEY;
if (!clave) throw new Error('Falta ELEVENLABS_API_KEY en el entorno');
const voces = { HandIA: process.env.ELEVENLABS_VOZ_HANDIA, Vos: process.env.ELEVENLABS_VOZ_VECINO };
if (!voces.HandIA) throw new Error('Falta ELEVENLABS_VOZ_HANDIA (id de la voz elegida en ElevenLabs)');

const { lineas } = JSON.parse(readFileSync(guionRuta, 'utf8'));
const dir = 'salida/voz-handia';
mkdirSync(dir, { recursive: true });
const pistas = [];
for (const [i, l] of lineas.entries()) {
  const voz = voces[l.quien];
  if (!voz) continue;
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voz}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': clave, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
    body: JSON.stringify({ text: l.texto, model_id: 'eleven_multilingual_v2', voice_settings: { stability: 0.5, similarity_boost: 0.75 } }),
  });
  if (!r.ok) throw new Error(`ElevenLabs respondió ${r.status}: ${(await r.text()).slice(0, 200)}`);
  const archivo = `${dir}/${String(i).padStart(2, '0')}-${l.quien}.mp3`;
  writeFileSync(archivo, Buffer.from(await r.arrayBuffer()));
  pistas.push({ archivo, desde: l.desde });
  console.log(`· ${l.quien}: «${l.texto}» → ${archivo}`);
}
// Mezcla: cada frase en su segundo; la música y los efectos del clip bajan cuando alguien habla.
const entradas = pistas.flatMap((p) => ['-i', p.archivo]);
const voz = pistas.map((p, k) => `[${k + 2}:a]aresample=48000,aformat=channel_layouts=stereo,adelay=${Math.round(p.desde * 1000)}:all=1[v${k}]`).join(';');
const filtro = `${voz};${pistas.map((_, k) => `[v${k}]`).join('')}amix=inputs=${pistas.length}:normalize=0,asplit=2[voces][llave];` +
  '[1:a]aresample=48000[fondo0];[fondo0][llave]sidechaincompress=threshold=0.03:ratio=6:attack=10:release=300[fondo];' +
  '[voces][fondo]amix=inputs=2:duration=longest:normalize=0,loudnorm=I=-16:TP=-1.5[a]';
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', clip, '-i', audioClip, ...entradas, '-filter_complex', filtro, '-map', '0:v', '-map', '[a]',
  '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', salida]);
console.log(`Clip con la voz de HandIA → ${salida}`);
