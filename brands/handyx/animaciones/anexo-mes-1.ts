// Anexo de respaldo · Plan, mes 1 (noviembre): HandIA premium y lanzamiento. Golpes: 0 el vecino estrena HandIA premium
// (foto, voz y referencia de costo) y la tarifa visible y cobrada en la app; HandIA en el celular de la demo · 1 el profesional
// recibe pedidos más claros y se suman profesiones nuevas con sus herramientas · 2 se mide en trabajos con tarifa cobrada,
// con su objetivo de diciembre. Plantilla y reglas: comun/plan-mes.ts.
import { COLOR } from './comun/kit.ts';
import { planMes } from './comun/plan-mes.ts';

export default planMes({
  n: 1,
  fondo: COLOR.hueso,
  titulo: ['Mes 1: <mark>HandIA premium</mark>', 'y lanzamiento'],
  lanzamiento: 'Lanzamiento · {{LANZAMIENTO}}',
  cel: { img: 'demo-landing/usuario-handia.webp', rotulo: 'HandIA en la demo · datos ficticios', tipo: 'demo' },
  deco: 'handia',
  filas: [
    {
      quien: 'vecino',
      etiqueta: 'Para el vecino',
      items: [
        { ic: 'chispas', txt: '**HandIA premium:** foto, voz y referencia de costo' },
        { ic: 'recibo', txt: '**Tarifa del {{TARIFA-USUARIO}}** visible y cobrada en la app' },
      ],
    },
    {
      quien: 'profesional',
      etiqueta: 'Para el profesional',
      items: [
        { ic: 'camara', txt: '**Pedidos más claros**, con foto y descripción' },
        { ic: 'herramienta', txt: '**+{{PROF-POR-MES}} profesiones nuevas**, cada una con sus herramientas' },
      ],
    },
  ],
  medida: { metrica: 'Trabajos con tarifa cobrada', valor: 'Para Handyx: ingresos reales desde el primer trabajo', meta: { id: 'META-TRABAJOS', unidad: 'trabajos<br>cobrados' } },
  leyendas: ['El vecino estrena **HandIA premium**', 'El profesional recibe **pedidos más claros**', 'Lo medimos en **trabajos cobrados**'],
});
