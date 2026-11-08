// Modelo económico de un marketplace de servicios (genérico: no conoce la marca).
// Todas las cifras en ARS constantes de la fecha de precios del escenario: no se mezclan monedas.
// Fórmulas numeradas como en la documentación del modelo (docs/<deck>/modelo-economico.md). Desconocido = null, nunca 0 inventado.

export interface Vigencia {
  /** Mes del horizonte (1 = primer mes del piloto) desde/hasta, inclusive. */
  desde: number;
  hasta: number;
  usuario: number; // fracción, 0.10 = 10 %
  especialista: number;
  estado: string; // ej. "informado por el fundador", "pendiente BUS-22"
}

export interface Parametros {
  nombre: string;
  moneda: 'ARS';
  fechaPrecios: string;
  meses: number;
  // Oferta
  registrados: number;
  tasaVerificacion: number; // de registrados
  tasaDisponibilidad: number; // de verificados
  altasEspecialistasMes: number; // nuevos verificados+disponibles por mes desde el mes 2
  trabajosSemanaPorEspecialista: number; // capacidad dedicada a la plataforma
  capacidadSoporteMes: number; // trabajos que el equipo puede acompañar por mes
  crecimientoSoporteMes: number; // trabajos adicionales de capacidad por mes (automatización/contratación)
  // Demanda
  nuevosUsuariosMes: number[]; // usuarios que hacen su primer pedido, por mes
  pedidosPorUsuarioNuevo: number;
  pedidosMesPorUsuarioRecurrente: number; // tasa mensual de pedidos de usuarios con trabajo previo
  cobertura: number; // P(hay especialista disponible en rubro/zona | pedido)
  aceptacion: number; // P(acepta | cubierto)
  finalizacion: number; // P(se completa | aceptado)
  // Precio y tarifas
  ticket: number; // precio base P del servicio, sin tarifa
  vigencias: Vigencia[];
  fundadores: { cupo: number; especialista: number; meses: number; desdeMes: number } | null;
  bonificaPrimerTrabajoUsuario: boolean;
  // Costos
  pasarela: { pct: number; sobre: 'tarifa' | 'total' };
  soportePorTrabajo: number;
  reembolsosPct: number; // de la tarifa
  costosFijosMes: number;
  adquisicionUsuariosMes: number;
  adquisicionEspecialistasMes: number;
  cajaInicial: number | null;
}

export interface Mes {
  mes: number;
  especialistasDisponibles: number;
  capacidadOferta: number;
  capacidadSoporte: number;
  pedidos: number;
  demandaAtendible: number;
  trabajos: number; // completados y pagados por el usuario
  trabajosConTarifa: number; // MET-01 histórico: la plataforma cobró tarifa > 0
  limitadoPor: 'demanda' | 'oferta' | 'soporte';
  gmv: number;
  ingresoTarifas: number;
  bonificaciones: number;
  pasarela: number;
  variables: number;
  contribucion: number;
  costosFijos: number;
  adquisicion: number;
  flujoNeto: number;
  caja: number | null;
  nuevosUsuariosConTrabajo: number;
}

export interface Resumen {
  meses: Mes[];
  totales: { trabajos: number; trabajosConTarifa: number; gmv: number; ingresoTarifas: number; contribucion: number; flujoNeto: number; adquisicion: number };
  contribucionPorTrabajoEstable: number; // tarifa estándar, usuario recurrente
  puntoEquilibrioTrabajosMes: number | null; // null si la contribución por trabajo ≤ 0
  cacUsuario: number | null;
  costoPiloto: number; // flujo neto del período bonificado (negativo = consumo)
  ltvProyectado: number | null;
  runwayMeses: number | null;
}

const r2 = (n: number) => Math.round(n * 100) / 100;

export function tarifaVigente(p: Parametros, mes: number): Vigencia {
  const v = p.vigencias.find((x) => mes >= x.desde && mes <= x.hasta);
  if (!v) throw new Error(`sin tarifa vigente para el mes ${mes}`);
  return v;
}

/** Tarifa al especialista del mes, aplicando la cohorte fundadora solo dentro de su vigencia y cupo. */
function tarifaEspecialista(p: Parametros, mes: number, v: Vigencia, disponibles: number): number {
  const f = p.fundadores;
  if (!f || mes < f.desdeMes || mes >= f.desdeMes + f.meses || v.especialista === 0) return v.especialista;
  const shareFundadores = Math.min(1, f.cupo / Math.max(disponibles, 1));
  return shareFundadores * Math.min(f.especialista, v.especialista) + (1 - shareFundadores) * v.especialista;
}

export function proyectar(p: Parametros): Resumen {
  validar(p);
  const meses: Mes[] = [];
  let recurrentes = 0; // usuarios con al menos un trabajo completado
  let caja = p.cajaInicial;
  let disponibles = p.registrados * p.tasaVerificacion * p.tasaDisponibilidad;
  for (let m = 1; m <= p.meses; m++) {
    if (m > 1) disponibles += p.altasEspecialistasMes;
    const capacidadOferta = disponibles * p.trabajosSemanaPorEspecialista * (52 / 12);
    const capacidadSoporte = p.capacidadSoporteMes + p.crecimientoSoporteMes * (m - 1);
    const nuevos = p.nuevosUsuariosMes[m - 1] ?? p.nuevosUsuariosMes.at(-1) ?? 0;
    const pedidosNuevos = nuevos * p.pedidosPorUsuarioNuevo;
    const pedidosRecurrentes = recurrentes * p.pedidosMesPorUsuarioRecurrente;
    const pedidos = pedidosNuevos + pedidosRecurrentes;
    // (1) Trabajos = pedidos × cobertura × aceptación condicional × finalización condicional
    const demandaAtendible = pedidos * p.cobertura * p.aceptacion * p.finalizacion;
    // (2) Nunca por encima de la capacidad comprobada de oferta ni de soporte
    const trabajos = Math.min(demandaAtendible, capacidadOferta, capacidadSoporte);
    const limitadoPor = trabajos === demandaAtendible ? 'demanda' : trabajos === capacidadOferta ? 'oferta' : 'soporte';
    const factor = demandaAtendible > 0 ? trabajos / demandaAtendible : 0;
    const trabajosNuevos = pedidosNuevos * p.cobertura * p.aceptacion * p.finalizacion * factor; // primeros trabajos
    const trabajosRec = trabajos - trabajosNuevos;
    // (3) GMV = precio base de trabajos completados (sin tarifa de Handy, sin materiales)
    const gmv = trabajos * p.ticket;
    // (4) Ingreso por tarifas devengadas − bonificaciones − reembolsos
    const v = tarifaVigente(p, m);
    const tEsp = tarifaEspecialista(p, m, v, disponibles);
    const brutoTeorico = trabajos * p.ticket * (v.usuario + tEsp);
    const bonificaciones = p.bonificaPrimerTrabajoUsuario ? trabajosNuevos * p.ticket * v.usuario : 0;
    const ingresoTarifas = (brutoTeorico - bonificaciones) * (1 - p.reembolsosPct);
    const usuarioPaga = trabajos * p.ticket + (trabajos * p.ticket * v.usuario - bonificaciones);
    const pasarela = p.pasarela.pct * (p.pasarela.sobre === 'tarifa' ? ingresoTarifas : usuarioPaga);
    // (5) Contribución = ingreso − pasarela − variables
    const variables = trabajos * p.soportePorTrabajo;
    const contribucion = ingresoTarifas - pasarela - variables;
    const adquisicion = p.adquisicionUsuariosMes + p.adquisicionEspecialistasMes;
    const flujoNeto = contribucion - p.costosFijosMes - adquisicion;
    if (caja !== null) caja += flujoNeto;
    const trabajosConTarifa = v.usuario + tEsp > 0 ? Math.max(0, trabajos - (tEsp === 0 && p.bonificaPrimerTrabajoUsuario ? trabajosNuevos : 0)) : 0;
    meses.push({
      mes: m, especialistasDisponibles: r2(disponibles), capacidadOferta: r2(capacidadOferta), capacidadSoporte, pedidos: r2(pedidos), demandaAtendible: r2(demandaAtendible),
      trabajos: r2(trabajos), trabajosConTarifa: r2(trabajosConTarifa), limitadoPor, gmv: r2(gmv), ingresoTarifas: r2(ingresoTarifas), bonificaciones: r2(bonificaciones),
      pasarela: r2(pasarela), variables: r2(variables), contribucion: r2(contribucion), costosFijos: p.costosFijosMes, adquisicion, flujoNeto: r2(flujoNeto), caja: caja === null ? null : r2(caja),
      nuevosUsuariosConTrabajo: r2(trabajosNuevos),
    });
    recurrentes += trabajosNuevos;
    void trabajosRec;
  }
  const suma = (k: keyof Mes) => r2(meses.reduce((t, x) => t + (x[k] as number), 0));
  const estable = p.vigencias.at(-1) as Vigencia;
  const ingresoEstable = p.ticket * (estable.usuario + estable.especialista) * (1 - p.reembolsosPct);
  const pasarelaEstable = p.pasarela.pct * (p.pasarela.sobre === 'tarifa' ? ingresoEstable : p.ticket * (1 + estable.usuario));
  const contribucionPorTrabajoEstable = r2(ingresoEstable - pasarelaEstable - p.soportePorTrabajo);
  // (9) Punto de equilibrio = costos fijos ÷ contribución por trabajo (si es positiva)
  const puntoEquilibrioTrabajosMes = contribucionPorTrabajoEstable > 0 ? Math.ceil(p.costosFijosMes / contribucionPorTrabajoEstable) : null;
  // (6) CAC usuario = gasto de captación de usuarios ÷ usuarios nuevos con primer trabajo completado
  const nuevosConTrabajo = suma('nuevosUsuariosConTrabajo');
  const cacUsuario = nuevosConTrabajo > 0 ? r2((p.adquisicionUsuariosMes * p.meses) / nuevosConTrabajo) : null;
  const piloto = meses.filter((x) => tarifaVigente(p, x.mes).usuario === 0 && tarifaVigente(p, x.mes).especialista === 0);
  // (7) LTV proyectado a 12 meses = contribución por trabajo × trabajos esperados por usuario en el horizonte
  const trabajosPorUsuario12 = p.pedidosPorUsuarioNuevo * p.finalizacion * p.aceptacion * p.cobertura + 11 * p.pedidosMesPorUsuarioRecurrente * p.finalizacion * p.aceptacion * p.cobertura;
  const ltvProyectado = contribucionPorTrabajoEstable > 0 ? r2(contribucionPorTrabajoEstable * trabajosPorUsuario12) : null;
  // (8) Runway = caja propia ÷ consumo mensual promedio (solo si hay caja informada y consumo)
  const consumo = -meses.reduce((t, x) => t + Math.min(0, x.flujoNeto), 0) / p.meses;
  const runwayMeses = p.cajaInicial !== null && consumo > 0 ? r2(p.cajaInicial / consumo) : null;
  return {
    meses,
    totales: { trabajos: suma('trabajos'), trabajosConTarifa: suma('trabajosConTarifa'), gmv: suma('gmv'), ingresoTarifas: suma('ingresoTarifas'), contribucion: suma('contribucion'), flujoNeto: suma('flujoNeto'), adquisicion: suma('adquisicion') },
    contribucionPorTrabajoEstable,
    puntoEquilibrioTrabajosMes,
    cacUsuario,
    costoPiloto: r2(piloto.reduce((t, x) => t + x.flujoNeto, 0)),
    ltvProyectado,
    runwayMeses,
  };
}

export function validar(p: Parametros): void {
  const fr = ['tasaVerificacion', 'tasaDisponibilidad', 'cobertura', 'aceptacion', 'finalizacion', 'reembolsosPct'] as const;
  for (const k of fr) if (!(p[k] >= 0 && p[k] <= 1)) throw new Error(`${k} debe estar entre 0 y 1`);
  if (p.moneda !== 'ARS') throw new Error('el modelo trabaja solo en ARS constantes');
  if (!(p.meses >= 1 && p.meses <= 36)) throw new Error('horizonte inválido');
  for (let m = 1; m <= p.meses; m++) tarifaVigente(p, m);
  for (const v of p.vigencias) if (v.usuario < 0 || v.especialista < 0 || v.usuario > 0.5 || v.especialista > 0.5) throw new Error('tarifa fuera de rango');
}

/** Sensibilidad: variación del total de contribución al mover cada parámetro ±20 %. */
export function sensibilidad(p: Parametros, claves: Array<keyof Parametros>): Array<{ parametro: string; menos: number; mas: number; rango: number }> {
  const base = proyectar(p).totales.flujoNeto;
  return claves
    .map((k) => {
      const mover = (f: number) => {
        const v = p[k];
        const q = { ...p, [k]: Array.isArray(v) ? (v as number[]).map((x) => x * f) : typeof v === 'number' ? Math.min(['cobertura', 'aceptacion', 'finalizacion', 'tasaVerificacion', 'tasaDisponibilidad'].includes(k) ? 1 : Infinity, v * f) : v } as Parametros;
        return proyectar(q).totales.flujoNeto - base;
      };
      const menos = r2(mover(0.8));
      const mas = r2(mover(1.2));
      return { parametro: String(k), menos, mas, rango: r2(Math.abs(mas - menos)) };
    })
    .sort((a, b) => b.rango - a.rango);
}
