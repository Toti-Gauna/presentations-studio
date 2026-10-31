// Transporte local entre ventanas de la misma computadora (pantalla pública ↔ presentador).
// Funciona sin red. No viaja nada privado: las notas nunca pasan por este canal.
import type { Comando, Estado } from '../core/estado.ts';

export type MensajeLocal =
  | { t: 'estado'; estado: Estado; de: string }
  | { t: 'comando'; comando: Comando; de: string }
  | { t: 'latido'; de: string }
  | { t: 'pedir'; de: string };

export class CanalLocal {
  readonly yo = Math.random().toString(36).slice(2);
  private canal: BroadcastChannel | null;
  constructor(deck: string, version: string) {
    this.canal = 'BroadcastChannel' in window ? new BroadcastChannel(`ps:${deck}:${version}`) : null;
  }
  enviar(m: MensajeLocal): void {
    this.canal?.postMessage(m);
  }
  escuchar(fn: (m: MensajeLocal) => void): void {
    if (this.canal) this.canal.onmessage = (e: MessageEvent<MensajeLocal>) => e.data && e.data.de !== this.yo && fn(e.data);
  }
  cerrar(): void {
    this.canal?.close();
  }
}
