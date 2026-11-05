// Calcula los escenarios Handyx y escribe docs/handyx/escenarios.md (tablas auditables).
// Uso: npm run escenarios
import { readFileSync, writeFileSync } from 'node:fs';
import { proyectar, sensibilidad, type Resumen } from '../src/econ/modelo.ts';
import { escenario, type ArchivoEscenarios } from '../src/econ/escenarios.ts';

const a = JSON.parse(readFileSync('decks/handyx/escenarios.json', 'utf8')) as ArchivoEscenarios;
const nombres = ['conservador', 'base', 'expansion', 'fundadores-todos'];
const res: Record<string, Resumen> = Object.fromEntries(nombres.map((n) => [n, proyectar(escenario(a, n))]));
const $ = (n: number) => `$ ${Math.round(n).toLocaleString('es-AR')}`;
const n1 = (n: number) => (Math.round(n * 10) / 10).toLocaleString('es-AR');
const MESES = ['10/11–10/12/26 (piloto)', 'dic–ene', 'ene–feb', 'feb–mar', 'mar–abr', 'abr–may', 'may–jun', 'jun–jul', 'jul–ago', 'ago–sep', 'sep–oct', 'oct–nov', 'nov–dic/27'];

let md = `# Escenarios Handyx (ilustrativos)

> **Generado por \`npm run escenarios\` desde \`decks/handyx/escenarios.json\`. No editar a mano.**
> Proyección, no resultado. ARS constantes del 31/10/2026. Solo "56 registrados" es un dato (informado por Ignacio,
> sin auditar contra el CRM); tarifas = decisiones informadas con condiciones pendientes; el resto son supuestos.

## Resumen por escenario (13 meses: piloto + 12)

| Escenario | Trabajos completados | Trabajos con tarifa cobrada (MET-01) | Volumen de servicios (GMV) | Ingreso por tarifas | Contribución | Flujo neto (con fijos y captación) | Costo del mes bonificado | Contribución por trabajo estable | Equilibrio (trabajos/mes) | CAC usuario |
|---|---|---|---|---|---|---|---|---|---|---|
`;
for (const n of nombres) {
  const r = res[n] as Resumen;
  md += `| ${escenario(a, n).nombre} | ${n1(r.totales.trabajos)} | ${n1(r.totales.trabajosConTarifa)} | ${$(r.totales.gmv)} | ${$(r.totales.ingresoTarifas)} | ${$(r.totales.contribucion)} | ${$(r.totales.flujoNeto)} | ${$(r.costoPiloto)} | ${$(r.contribucionPorTrabajoEstable)} | ${r.puntoEquilibrioTrabajosMes ?? 'no existe'} | ${r.cacUsuario === null ? 's/d' : $(r.cacUsuario)} |\n`;
}
md += `\nRunway: **no calculable** (caja propia disponible no informada: \`cajaInicial = null\`). LTV proyectado a 12 meses (base): ${res['base']?.ltvProyectado === null ? 's/d' : $(res['base']?.ltvProyectado as number)} por usuario — proyección, no histórico.\n`;

for (const n of ['base', 'conservador', 'expansion']) {
  const r = res[n] as Resumen;
  md += `\n## Mes a mes · ${escenario(a, n).nombre}\n\n| Mes | Especialistas disponibles | Capacidad oferta | Capacidad soporte | Pedidos | Trabajos | Límite | Con tarifa | GMV | Ingreso tarifas | Contribución | Flujo neto |\n|---|---|---|---|---|---|---|---|---|---|---|---|\n`;
  for (const m of r.meses) md += `| ${MESES[m.mes - 1]} | ${n1(m.especialistasDisponibles)} | ${n1(m.capacidadOferta)} | ${m.capacidadSoporte} | ${n1(m.pedidos)} | ${n1(m.trabajos)} | ${m.limitadoPor} | ${n1(m.trabajosConTarifa)} | ${$(m.gmv)} | ${$(m.ingresoTarifas)} | ${$(m.contribucion)} | ${$(m.flujoNeto)} |\n`;
}
const s = sensibilidad(a.base, ['ticket', 'cobertura', 'aceptacion', 'nuevosUsuariosMes', 'pedidosMesPorUsuarioRecurrente', 'costosFijosMes', 'soportePorTrabajo', 'tasaVerificacion', 'trabajosSemanaPorEspecialista']);
md += `\n## Sensibilidad (escenario base, cada parámetro ±20 %)\n\nEfecto sobre el flujo neto acumulado de 13 meses. Los cinco primeros son los datos que más conviene medir en el piloto.\n\n| Parámetro | −20 % | +20 % | Rango |\n|---|---|---|---|\n`;
for (const x of s) md += `| ${x.parametro} | ${$(x.menos)} | ${$(x.mas)} | ${$(x.rango)} |\n`;
writeFileSync('docs/handyx/escenarios.md', md);
console.log(JSON.stringify(Object.fromEntries(nombres.map((n) => [n, { trabajos: res[n]?.totales.trabajos, conTarifa: res[n]?.totales.trabajosConTarifa, flujo: res[n]?.totales.flujoNeto, piloto: res[n]?.costoPiloto, mes1: res[n]?.meses[0]?.trabajos, mes2: res[n]?.meses[1]?.trabajosConTarifa, cpt: res[n]?.contribucionPorTrabajoEstable, eq: res[n]?.puntoEquilibrioTrabajosMes, ultimo: res[n]?.meses.at(-1) }])), null, 1));
