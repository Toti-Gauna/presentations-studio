import json, sys
from faster_whisper import WhisperModel
modelo, audio, salida = sys.argv[1:4]
import wave, numpy as np
w = wave.open(audio); datos = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768.0
m = WhisperModel(modelo, device='cpu', compute_type='int8', cpu_threads=8)
segs, info = m.transcribe(datos, language='es', word_timestamps=True, vad_filter=False, beam_size=5,
    initial_prompt='Handyx, HandIA, General Pueyrredón, Mar del Plata, porteros, Silicon Valley.')
out = []
for s in segs:
    out.append({'inicio': s.start, 'fin': s.end, 'texto': s.text, 'palabras': [{'p': w.word, 'i': w.start, 'f': w.end} for w in s.words]})
    print(f'{s.start:7.2f} {s.end:7.2f} {s.text}', flush=True)
json.dump(out, open(salida, 'w'), ensure_ascii=False, indent=1)
