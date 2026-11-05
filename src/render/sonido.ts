// Efectos de sonido sintetizados (WebAudio, sin archivos ni red). Discretos y silenciables: solo suenan en la
// pantalla que los tenga habilitados (la pública) y después de un gesto en ESA computadora (política de autoplay).
// La comprensión nunca depende del sonido. Los dispara la línea de tiempo solo al reproducir hacia adelante.

export type Efecto = 'whoosh' | 'pop' | 'golpe' | 'conteo' | 'festejo' | 'ding' | 'tic' | 'caida';

let ctx: AudioContext | null = null;
let maestro: GainNode | null = null;
let habilitado = false;
let volumen = 0.5;

export function habilitarSonido(si: boolean): void {
  habilitado = si;
}

/** Debe llamarse dentro de un gesto del usuario (clic o tecla). */
export function desbloquear(): void {
  if (!ctx) {
    ctx = new AudioContext();
    maestro = ctx.createGain();
    maestro.gain.value = volumen;
    maestro.connect(ctx.destination);
  }
  void ctx.resume();
}

export function ajustarVolumen(v: number): void {
  volumen = Math.max(0, Math.min(1, v));
  if (maestro) maestro.gain.value = volumen;
}

function tono(f: number, t0: number, dur: number, tipo: OscillatorType, g0: number, f1?: number) {
  if (!ctx || !maestro) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = tipo;
  o.frequency.setValueAtTime(f, t0);
  if (f1) o.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(g0, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(maestro);
  o.start(t0);
  o.stop(t0 + dur + 0.02);
}

function ruido(t0: number, dur: number, g0: number, desde: number, hasta: number) {
  if (!ctx || !maestro) return;
  const n = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, n, ctx.sampleRate);
  const d = buf.getChannelData(0);
  let s = 12345;
  for (let i = 0; i < n; i++) {
    s = (s * 1103515245 + 12345) & 0x7fffffff; // determinista
    d[i] = (s / 0x7fffffff) * 2 - 1;
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const f = ctx.createBiquadFilter();
  f.type = 'bandpass';
  f.Q.value = 0.9;
  f.frequency.setValueAtTime(desde, t0);
  f.frequency.exponentialRampToValueAtTime(hasta, t0 + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(g0, t0 + dur * 0.35);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(f).connect(g).connect(maestro);
  src.start(t0);
}

export function sonar(e: Efecto): void {
  if (!habilitado || !ctx || ctx.state !== 'running') return;
  const t = ctx.currentTime + 0.01;
  switch (e) {
    case 'whoosh':
      ruido(t, 0.45, 0.22, 400, 3200);
      break;
    case 'pop':
      tono(660, t, 0.12, 'sine', 0.25, 990);
      break;
    case 'caida':
      tono(320, t, 0.16, 'sine', 0.3, 140);
      ruido(t, 0.08, 0.08, 1800, 600);
      break;
    case 'golpe':
      tono(110, t, 0.28, 'sine', 0.5, 48);
      ruido(t, 0.12, 0.18, 2500, 500);
      break;
    case 'tic':
      tono(1600, t, 0.03, 'square', 0.05);
      break;
    case 'conteo':
      for (let i = 0; i < 14; i++) tono(900 + i * 45, t + i * 0.07, 0.035, 'square', 0.035);
      tono(1760, t + 1.0, 0.25, 'sine', 0.18);
      break;
    case 'ding':
      tono(1318.5, t, 0.5, 'sine', 0.18);
      tono(1975.5, t + 0.09, 0.6, 'sine', 0.12);
      break;
    case 'festejo':
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tono(f, t + i * 0.085, 0.32, 'triangle', 0.16));
      ruido(t, 0.5, 0.05, 6000, 9000);
      break;
  }
}
