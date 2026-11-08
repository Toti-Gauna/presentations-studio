import { describe, expect, it } from 'vitest';
import { proyectar, sensibilidad, type Parametros } from '../src/econ/modelo.ts';
import { escenario, type ArchivoEscenarios } from '../src/econ/escenarios.ts';
import archivo from '../decks/handyx/escenarios.json' with { type: 'json' };

const base = escenario(archivo as unknown as ArchivoEscenarios, 'base');
const simple: Parametros = {
  ...base, meses: 2, registrados: 10, tasaVerificacion: 1, tasaDisponibilidad: 1, altasEspecialistasMes: 0, trabajosSemanaPorEspecialista: 100,
  capacidadSoporteMes: 10_000, crecimientoSoporteMes: 0, nuevosUsuariosMes: [100, 100], pedidosPorUsuarioNuevo: 1, pedidosMesPorUsuarioRecurrente: 0,
  cobertura: 0.5, aceptacion: 0.5, finalizacion: 0.5, ticket: 1000, fundadores: null, bonificaPrimerTrabajoUsuario: false, reembolsosPct: 0,
  pasarela: { pct: 0, sobre: 'tarifa' }, soportePorTrabajo: 0, costosFijosMes: 0, adquisicionUsuariosMes: 0, adquisicionEspecialistasMes: 0,
};

describe('fórmulas', () => {
  it('(1) trabajos = pedidos × cobertura × aceptación × finalización, sin descontar dos veces', () => {
    expect(proyectar(simple).meses[0]?.trabajos).toBe(12.5);
  });
  it('(2) los trabajos nunca superan la capacidad de oferta ni de soporte', () => {
    const r = proyectar({ ...simple, capacidadSoporteMes: 5 });
    expect(r.meses[0]?.trabajos).toBe(5);
    expect(r.meses[0]?.limitadoPor).toBe('soporte');
    const o = proyectar({ ...simple, trabajosSemanaPorEspecialista: 0.05 });
    expect(o.meses[0]?.limitadoPor).toBe('oferta');
  });
  it('(3) GMV = precio base de trabajos, sin sumar la tarifa', () => {
    expect(proyectar(simple).meses[0]?.gmv).toBe(12_500);
  });
  it('(4) durante el mes bonificado el ingreso por tarifas es 0 y los costos siguen', () => {
    const r = proyectar({ ...simple, costosFijosMes: 1000, soportePorTrabajo: 10 });
    expect(r.meses[0]?.ingresoTarifas).toBe(0);
    expect(r.meses[0]?.trabajosConTarifa).toBe(0);
    expect(r.meses[0]?.flujoNeto).toBe(-1125);
    expect(r.costoPiloto).toBe(-1125);
  });
  it('(4) tarifa 10 % + 10 %: ingreso 0,20 P por trabajo; bonificación del primer trabajo resta 0,10 P', () => {
    expect(proyectar(simple).meses[1]?.ingresoTarifas).toBe(2_500);
    expect(proyectar({ ...simple, bonificaPrimerTrabajoUsuario: true }).meses[1]?.ingresoTarifas).toBe(1_250);
  });
  it('fundadores 5 % solo dentro de su cupo y vigencia', () => {
    const f = proyectar({ ...simple, fundadores: { cupo: 10, especialista: 0.05, meses: 12, desdeMes: 2 } });
    expect(f.meses[1]?.ingresoTarifas).toBe(1_875); // 12,5 × 1000 × 0,15
    const mitad = proyectar({ ...simple, fundadores: { cupo: 5, especialista: 0.05, meses: 12, desdeMes: 2 } });
    expect(mitad.meses[1]?.ingresoTarifas).toBe(2_187.5);
  });
  it('(5) contribución = ingreso − pasarela − variables', () => {
    const r = proyectar({ ...simple, pasarela: { pct: 0.1, sobre: 'tarifa' }, soportePorTrabajo: 20 });
    expect(r.meses[1]?.contribucion).toBe(2_500 - 250 - 250);
  });
  it('(9) sin contribución positiva no hay punto de equilibrio', () => {
    const r = proyectar({ ...simple, soportePorTrabajo: 1_000_000, costosFijosMes: 10 });
    expect(r.puntoEquilibrioTrabajosMes).toBeNull();
    expect(proyectar({ ...simple, costosFijosMes: 1000 }).puntoEquilibrioTrabajosMes).toBe(5);
  });
  it('(8) sin caja informada no hay runway (no se inventa)', () => {
    expect(proyectar(base).runwayMeses).toBeNull();
    expect(proyectar({ ...simple, cajaInicial: 1000, costosFijosMes: 500 }).runwayMeses).toBeGreaterThan(0);
  });
  it('(6) CAC usuario usa usuarios con primer trabajo, no registros', () => {
    const r = proyectar({ ...simple, adquisicionUsuariosMes: 1000 });
    expect(r.cacUsuario).toBe(80); // 2000 ÷ 25 primeros trabajos
  });
  it('rechaza parámetros imposibles y monedas mezcladas', () => {
    expect(() => proyectar({ ...simple, cobertura: 1.4 })).toThrow();
    expect(() => proyectar({ ...simple, moneda: 'USD' as 'ARS' })).toThrow();
    expect(() => proyectar({ ...simple, meses: 20 })).toThrow(/sin tarifa vigente/);
  });
});

describe('escenarios Handyx', () => {
  const a = archivo as unknown as ArchivoEscenarios;
  const res = Object.fromEntries(['conservador', 'base', 'expansion'].map((n) => [n, proyectar(escenario(a, n))]));
  it('ordenados: conservador ≤ base ≤ expansión en trabajos', () => {
    expect(res['conservador']!.totales.trabajos).toBeLessThan(res['base']!.totales.trabajos);
    expect(res['base']!.totales.trabajos).toBeLessThan(res['expansion']!.totales.trabajos);
  });
  it('MET-01: el mes bonificado no suma trabajos con tarifa cobrada', () => {
    for (const r of Object.values(res)) expect(r.meses[0]?.trabajosConTarifa).toBe(0);
  });
  it('56 registrados no son 56 activos: la oferta del mes 1 es menor', () => {
    expect(res['base']!.meses[0]!.especialistasDisponibles).toBeLessThan(56);
  });
  it('sensibilidad ordena los parámetros por impacto', () => {
    const s = sensibilidad(base, ['ticket', 'cobertura', 'costosFijosMes', 'nuevosUsuariosMes']);
    expect(s[0]!.rango).toBeGreaterThanOrEqual(s.at(-1)!.rango);
  });
});
