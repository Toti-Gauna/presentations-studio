import { describe, expect, it } from 'vitest';
import { aplicar, comandoValido, estadoInicial, estadoValido, posicionMedio, tiempoReloj, type Comando, type Estado, type Forma } from '../src/core/estado.ts';

const forma: Forma = { pasos: [2, 1, 3] };
const T = 1_000_000;
const correr = (cs: Comando[], e: Estado = estadoInicial()) => cs.reduce((s, c) => aplicar(s, c, forma, T), e);

describe('navegación', () => {
  it('avanza paso a paso y cruza escenas', () => {
    const e = correr([{ tipo: 'siguiente' }, { tipo: 'siguiente' }, { tipo: 'siguiente' }]);
    expect([e.escena, e.paso]).toEqual([2, 0]);
    expect(e.revision).toBe(3);
  });
  it('no pasa del final ni del principio y no sube la revisión sin cambio', () => {
    const fin = correr(Array(20).fill({ tipo: 'siguiente' }));
    expect([fin.escena, fin.paso]).toEqual([2, 2]);
    expect(aplicar(fin, { tipo: 'siguiente' }, forma, T)).toBe(fin);
    const ini = estadoInicial();
    expect(aplicar(ini, { tipo: 'anterior' }, forma, T)).toBe(ini);
  });
  it('retroceder desde el paso 0 va al último paso de la escena anterior', () => {
    const e = correr([{ tipo: 'ir', escena: 2 }, { tipo: 'anterior' }, { tipo: 'anterior' }]);
    expect([e.escena, e.paso]).toEqual([0, 1]);
  });
  it('ida y vuelta vuelve exactamente al mismo lugar', () => {
    const ida = correr([{ tipo: 'siguiente' }, { tipo: 'siguiente' }, { tipo: 'siguiente' }, { tipo: 'siguiente' }]);
    const vuelta = correr([{ tipo: 'anterior' }, { tipo: 'anterior' }, { tipo: 'anterior' }, { tipo: 'anterior' }], ida);
    expect([vuelta.escena, vuelta.paso]).toEqual([0, 0]);
  });
  it('saltar acota a rango y reiniciar quita la pantalla negra', () => {
    expect(correr([{ tipo: 'ir', escena: 99, paso: 99 }])).toMatchObject({ escena: 2, paso: 2 });
    const e = correr([{ tipo: 'ir', escena: 1 }, { tipo: 'negro', valor: true }, { tipo: 'reiniciar' }]);
    expect(e).toMatchObject({ escena: 0, paso: 0, negro: false });
  });
  it('saltar de escena descarta el medio en reproducción', () => {
    const e = correr([{ tipo: 'reproducir', medio: 'clip' }, { tipo: 'escenaSiguiente' }]);
    expect(e.reproduccion.medio).toBeNull();
  });
});

describe('medios y reloj se reconstruyen desde el estado', () => {
  it('pausar acumula la posición sin depender de eventos', () => {
    let e = aplicar(estadoInicial(), { tipo: 'reproducir', medio: 'clip' }, forma, 0);
    expect(posicionMedio(e.reproduccion, 2500)).toBeCloseTo(2.5);
    e = aplicar(e, { tipo: 'pausar' }, forma, 4000);
    expect(posicionMedio(e.reproduccion, 99999)).toBeCloseTo(4);
    e = aplicar(e, { tipo: 'reproducir', medio: 'clip' }, forma, 10000);
    expect(posicionMedio(e.reproduccion, 11000)).toBeCloseTo(5);
  });
  it('reloj iniciar/pausar/reiniciar', () => {
    let e = aplicar(estadoInicial(), { tipo: 'reloj', accion: 'iniciar' }, forma, 0);
    e = aplicar(e, { tipo: 'reloj', accion: 'pausar' }, forma, 3000);
    expect(tiempoReloj(e.reloj, 9000)).toBe(3000);
    e = aplicar(e, { tipo: 'reloj', accion: 'reiniciar' }, forma, 9000);
    expect(tiempoReloj(e.reloj, 9000)).toBe(0);
  });
});

describe('entradas no confiables', () => {
  it('rechaza comandos mal formados o fuera de rango', () => {
    expect(comandoValido({ tipo: 'ir', escena: 5 }, forma)).toBeNull();
    expect(comandoValido({ tipo: 'ir', escena: -1 }, forma)).toBeNull();
    expect(comandoValido({ tipo: 'borrar' }, forma)).toBeNull();
    expect(comandoValido({ tipo: 'reproducir', medio: '../x' }, forma)).toBeNull();
    expect(comandoValido({ tipo: 'siguiente', extra: 1 }, forma)).toEqual({ tipo: 'siguiente' });
  });
  it('rechaza estados imposibles para la forma', () => {
    expect(estadoValido({ ...estadoInicial(), escena: 1, paso: 2 }, forma)).toBeNull();
    expect(estadoValido({ ...estadoInicial(), escena: 2, paso: 2 }, forma)).not.toBeNull();
  });
});
