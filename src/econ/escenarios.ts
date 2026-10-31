import type { Parametros } from './modelo.ts';

export interface ArchivoEscenarios {
  base: Parametros;
  variantes: Record<string, Partial<Parametros>>;
}

export function escenario(a: ArchivoEscenarios, nombre: string): Parametros {
  if (nombre === 'base') return a.base;
  const v = a.variantes[nombre];
  if (!v) throw new Error(`escenario inexistente: ${nombre}`);
  return { ...a.base, ...v } as Parametros;
}
