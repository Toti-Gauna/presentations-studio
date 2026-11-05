// Las cifras calculadas del pitch no pueden desviarse de sus fórmulas ni del modelo.
import { describe, expect, it } from 'vitest';
import afirmaciones from '../decks/handyx/afirmaciones.json' with { type: 'json' };
import archivo from '../decks/handyx/escenarios.json' with { type: 'json' };
import { proyectar, type Resumen } from '../src/econ/modelo.ts';
import { escenario, type ArchivoEscenarios } from '../src/econ/escenarios.ts';

type A = { id: string; valor: number | string | null; formula?: string; tipo: string };
const lista = afirmaciones as A[];
const mapa = new Map(lista.map((a) => [a.id, a]));
const num = (id: string) => mapa.get(id)?.valor as number;
const res: Record<string, Resumen> = Object.fromEntries(['base', 'conservador', 'expansion'].map((n) => [n, proyectar(escenario(archivo as unknown as ArchivoEscenarios, n))]));

function evaluar(ruta: string): number {
  const neg = ruta.startsWith('-');
  const partes = ruta.replace(/^-/, '').replace(/\[(\d+)\]/g, '.$1').split('.');
  let v: unknown = res;
  for (const p of partes) v = (v as Record<string, unknown>)[p];
  return (neg ? -1 : 1) * (v as number);
}

describe('afirmaciones calculadas', () => {
  it('TAM y SAM respetan su fórmula', () => {
    expect(num('TAM-ARS')).toBe(num('MDP-VIVIENDAS') * num('SUP-ARREGLOS-ANUALES') * num('TICKET-EJEMPLO'));
    expect(num('SAM-ARS')).toBeCloseTo(num('TAM-ARS') * num('SUP-SHARE-FOCO') * num('SUP-DIGITAL'), 0);
  });
  it('el ejemplo de $ 45.000 cierra: paga 1,10 P, recibe 0,90 P, Handyx 0,20 P', () => {
    expect(num('EJ-USUARIO-PAGA')).toBeCloseTo(num('TICKET-EJEMPLO') * (1 + num('TARIFA-USUARIO') / 100), 6);
    expect(num('EJ-ESPECIALISTA-RECIBE')).toBeCloseTo(num('TICKET-EJEMPLO') * (1 - num('TARIFA-ESPECIALISTA') / 100), 6);
    expect(num('EJ-HANDYX')).toBe(num('EJ-USUARIO-PAGA') - num('EJ-ESPECIALISTA-RECIBE'));
  });
  it('las proyecciones del pitch coinciden con el modelo (redondeadas)', () => {
    for (const a of lista.filter((x) => x.formula?.startsWith('modelo:'))) {
      const v = evaluar(a.formula!.slice(7));
      expect(Math.abs((a.valor as number) - v), `${a.id}: ${a.valor} vs ${v}`).toBeLessThanOrEqual(Math.max(1, Math.abs(v) * 0.002));
    }
  });
  it('toda proyección tiene fórmula y no se presenta como dato observado', () => {
    for (const a of lista.filter((x) => x.tipo === 'proyeccion')) expect(a.formula, a.id).toBeTruthy();
  });
  it('los 56 registrados no aparecen como verificados ni activos', () => {
    expect(mapa.get('ESP-VERIFICADOS')?.valor).toBeNull();
    expect(mapa.get('ESP-DISPONIBLES')?.valor).toBeNull();
  });
});
