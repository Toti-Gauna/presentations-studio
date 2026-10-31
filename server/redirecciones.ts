// Redirecciones estables de QR públicos: /r/<id> → destino activo (A o B) definido por el autor.
// El visitante nunca elige el destino: no se lee ningún parámetro de la consulta.
import { readFileSync } from 'node:fs';
import { z } from 'zod';
import { QrPublico } from '../src/core/esquema.ts';
import { destinoActivo } from '../src/core/qr.ts';

export class Redirecciones {
  private mapa = new Map<string, string>();
  private archivos: string[];
  constructor(archivos: string[]) {
    this.archivos = archivos;
    this.recargar();
  }
  recargar(): { ok: boolean; cantidad: number; error?: string } {
    const nuevo = new Map<string, string>();
    try {
      for (const archivo of this.archivos) {
        const lista = z.array(QrPublico).parse(JSON.parse(readFileSync(archivo, 'utf8')));
        for (const q of lista) if (q.modo === 'estable') nuevo.set(q.id, destinoActivo(q));
      }
    } catch (e) {
      // Si el archivo nuevo es inválido se conservan los destinos anteriores (no se rompe un QR impreso).
      return { ok: false, cantidad: this.mapa.size, error: e instanceof Error ? e.message.slice(0, 200) : 'error' };
    }
    this.mapa = nuevo;
    return { ok: true, cantidad: nuevo.size };
  }
  destino(id: string): string | null {
    return /^[a-z0-9][a-z0-9-]{0,62}$/.test(id) ? (this.mapa.get(id) ?? null) : null;
  }
}
