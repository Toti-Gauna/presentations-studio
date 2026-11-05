// Anexo de respaldo · Herramientas para cada oficio (2/2): Cerrajería, Albañilería y Aire acondicionado. Misma escena
// que la 1/2 (herramientasPorOficio): un golpe por oficio, con el celular del diseño propuesto, el rubro seleccionado, el
// Handy del oficio haciendo su acción (pose d) y qué resuelve cada herramienta. Sin cifras.
import { herramientasPorOficio } from './anexo-herramientas-1.ts';

export default herramientasPorOficio(2, [
  {
    id: 'cerrajeria',
    nombre: 'Cerrajería',
    resuelve: 'Hora y fotos | de cada apertura, | en el historial',
    leyenda: '**Cerrajería**: cada apertura, registrada',
    pj: 'llave',
    alto: 168,
    ancho: 170,
    toque: [0.5, 0.39],
  },
  {
    id: 'albanileria',
    nombre: 'Albañilería',
    resuelve: 'Calculá materiales | y seguí cada etapa | con fotos',
    leyenda: '**Albañilería**: la obra, en orden',
    pj: 'brocha',
    alto: 168,
    ancho: 170,
    espejo: true,
    toque: [0.45, 0.68],
  },
  {
    id: 'aire',
    nombre: 'Aire acondicionado',
    resuelve: 'Estimá frigorías | y avisá cuándo toca | el service',
    leyenda: '**Aire acondicionado**: calculá y recordá',
    pj: 'aire',
    alto: 112,
    ancho: 224,
    toque: [0.5, 0.563],
  },
]);
