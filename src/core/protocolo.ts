// Protocolo de control remoto (WebSocket). Compartido por navegador y servidor.
import type { Comando, Estado, Forma } from './estado.ts';

export type Rol = 'anfitrion' | 'control' | 'publico' | 'espera';

export interface NotaEscena {
  titulo: string;
  notas: string;
  guion: string;
  duracion: number;
  /** Medios (video/audio) de la escena que el control puede reproducir o pausar. */
  medios: string[];
}

/** Cliente → servidor */
export type MensajeCliente =
  | { t: 'hola'; sesion: string; token: string; rol: Rol }
  | { t: 'comando'; id: string; base: number; comando: Comando }
  | { t: 'sincronizar'; estado: Estado }
  | { t: 'aprobar'; solicitud: string; aceptar: boolean }
  | { t: 'revocar'; dispositivo?: string }
  | { t: 'ping'; n: number };

export type ResultadoComando = 'aplicado' | 'sin-cambio' | 'duplicado' | 'obsoleto' | 'invalido' | 'prohibido';

/** Servidor → cliente */
export type MensajeServidor =
  | { t: 'bienvenida'; rol: Rol; estado: Estado; forma: Forma; notas?: NotaEscena[]; dispositivos?: Dispositivo[]; deck: string; version: string; huella: string }
  | { t: 'estado'; estado: Estado; por: string | null }
  | { t: 'ack'; id: string; resultado: ResultadoComando; estado: Estado }
  | { t: 'solicitud'; solicitud: string; dispositivo: string; expira: number }
  | { t: 'aprobado'; tokenControl: string; dispositivo: string }
  | { t: 'rechazado' }
  | { t: 'dispositivos'; lista: Dispositivo[] }
  | { t: 'revocado' }
  | { t: 'error'; codigo: string }
  | { t: 'pong'; n: number; ahora: number };

export interface Dispositivo {
  id: string;
  nombre: string;
  conectado: boolean;
  desde: number;
}

export const LIMITE_MENSAJE = 64 * 1024;
