// Anexo de respaldo · Plan, mes 2 (diciembre): HandIA para profesionales. Golpes: 0 el profesional suma HandIA
// (presupuesto, materiales y recordatorios), las herramientas de su oficio y sus números con IA; el celular muestra el
// diseño propuesto de herramientas · 1 el vecino tiene más profesiones para pedir y mejor servicio · 2 se mide en
// profesionales activos y clientes que repiten, con su objetivo. Plantilla y reglas: comun/plan-mes.ts.
import { planMes } from './comun/plan-mes.ts';

export default planMes({
  n: 2,
  fondo: '#EEF0F6',
  titulo: ['Mes 2: HandIA', '<mark>para profesionales</mark>'],
  cel: { img: 'conceptos/herramientas-electricidad.webp', rotulo: 'Diseño propuesto · datos ficticios', tipo: 'prop' },
  deco: 'herramientas',
  filas: [
    {
      quien: 'profesional',
      etiqueta: 'Para el profesional',
      items: [
        { ic: 'ia', txt: '**HandIA:** presupuesto, materiales y recordatorios' },
        { ic: 'billetera', txt: '**Herramientas de su oficio**, ingresos y gastos con IA' },
      ],
    },
    {
      quien: 'vecino',
      etiqueta: 'Para el vecino',
      items: [
        { ic: 'herramienta', txt: '**+{{PROF-POR-MES}} profesiones nuevas** para pedir' },
        { ic: 'estrella', txt: '**Mejor servicio**, con profesionales más organizados' },
      ],
    },
  ],
  medida: { metrica: 'Profesionales activos por semana', valor: 'Retención: el profesional usa Handyx todos los días', meta: { id: 'META-REPETIDORES', unidad: 'clientes<br>que vuelven' } },
  leyendas: ['El profesional suma **HandIA y herramientas**', 'El vecino gana **más profesiones**', 'Lo medimos en **uso y clientes que vuelven**'],
});
