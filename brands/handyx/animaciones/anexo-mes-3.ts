// Anexo de respaldo · Plan, mes 3 (enero): toda Buenos Aires y el primer piloto de Handyx for Business. Golpes:
// 0 el vecino tiene Handyx en toda Buenos Aires y las profesiones acumuladas del trimestre (mapa de la provincia) ·
// 1 el profesional tiene más trabajo y turnos en comercios; el celular muestra el diseño propuesto de Business ·
// 2 se mide en CAC por canal, turnos B2B y trabajos por mes. Plantilla y reglas: comun/plan-mes.ts.
import { COLOR } from './comun/kit.ts';
import { planMes } from './comun/plan-mes.ts';

export default planMes({
  n: 3,
  fondo: COLOR.hueso,
  titulo: ['Mes 3: <mark>toda Buenos Aires</mark>', 'y Handyx for Business'],
  cel: { img: 'conceptos/herramientas-turnos.webp', rotulo: 'Diseño propuesto · datos ficticios', tipo: 'prop' },
  deco: 'mapa',
  filas: [
    {
      quien: 'vecino',
      etiqueta: 'Para el vecino',
      items: [
        { ic: 'ubicacion', txt: '**Toda Buenos Aires** en {{META-BA-MESES}} meses' },
        { ic: 'herramienta', txt: '**{{PROF-Q1}} profesiones**, cada una con sus herramientas' },
      ],
    },
    {
      quien: 'profesional',
      etiqueta: 'Para el profesional',
      items: [
        { ic: 'usuarios', txt: '**Más trabajo** para más profesionales' },
        { ic: 'tienda', txt: '**Turnos en comercios:** primer piloto de Handyx for Business' },
      ],
    },
  ],
  medida: { metrica: 'CAC por canal, turnos B2B y trabajos por mes', valor: 'Para Handyx: primer ingreso B2B y más demanda' },
  leyendas: ['Handyx llega a **toda Buenos Aires**', 'Más trabajo y **Handyx for Business**', 'Lo medimos en **CAC, turnos y trabajos**'],
});
