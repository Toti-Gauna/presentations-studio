// Ida y vuelta: cada QR público se decodifica a la URL definida (y nunca contiene credenciales de control).
import { describe, expect, it } from 'vitest';
import jsQR from 'jsqr';
import { z } from 'zod';
import { QrPublico } from '../src/core/esquema.ts';
import { contraste, destinoActivo, matriz, urlCodificada } from '../src/core/qr.ts';
import handyx from '../decks/handyx/qr.json' with { type: 'json' };
import tecnico from '../decks/tecnico/qr.json' with { type: 'json' };

function decodificar(texto: string): string | null {
  const { tamano, modulos } = matriz(texto);
  const k = 6;
  const lado = tamano * k;
  const px = new Uint8ClampedArray(lado * lado * 4);
  for (let y = 0; y < lado; y++)
    for (let x = 0; x < lado; x++) {
      const v = modulos[Math.floor(y / k)]?.[Math.floor(x / k)] ? 0 : 255;
      px.set([v, v, v, 255], (y * lado + x) * 4);
    }
  return jsQR(px, lado, lado)?.data ?? null;
}

describe('QR públicos', () => {
  const todos = [...z.array(QrPublico).parse(handyx), ...z.array(QrPublico).parse(tecnico)];
  it.each(todos.map((q) => [q.id, q] as const))('%s se lee y apunta a su URL', (_, q) => {
    expect(decodificar(urlCodificada(q))).toBe(urlCodificada(q));
  });
  it('los QR públicos no llevan sesión, código ni token', () => {
    for (const q of todos) expect(urlCodificada(q)).not.toMatch(/[#&?](s|c|v|srv|token|codigo)=/);
  });
  it('el destino estable B se elige por configuración, no por el visitante', () => {
    const q = todos.find((x) => x.modo === 'estable' && x.destinos.B)!;
    expect(destinoActivo({ ...q, activo: 'B' })).toContain(new URL(q.destinos.B!).pathname);
    expect(urlCodificada({ ...q, activo: 'B' })).toBe(q.urlEstable);
  });
  it('rechaza esquemas peligrosos y credenciales en la URL', () => {
    const base = { id: 'x', etiqueta: 'Equis', modo: 'directo', textoCorto: 'x.example', definitivo: false };
    expect(QrPublico.safeParse({ ...base, destinos: { A: 'javascript:alert(1)' } }).success).toBe(false);
    expect(QrPublico.safeParse({ ...base, destinos: { A: 'https://u:p@example.com' } }).success).toBe(false);
    expect(QrPublico.safeParse({ ...base, destinos: { A: 'http://example.com' } }).success).toBe(false);
    expect(QrPublico.safeParse({ ...base, destinos: { A: 'https://example.com' } }).success).toBe(true);
  });
  it('contraste del QR ≥ 7:1', () => {
    expect(contraste('#000000', '#FFFFFF')).toBeGreaterThan(7);
  });
});
