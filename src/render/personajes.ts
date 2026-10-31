// Personajes: cuatro poses recortadas de la lámina oficial, apiladas. La actuación se arma con
// acciones por paso (entrar, saludar, festejar...) que el motor de movimiento traduce a tweens.
// Propiedad de cada transform: .pj-mov → GSAP (acciones), .pj-cuerpo → CSS (respiración),
// .pose → GSAP (opacidad de la pose). Nunca dos dueños sobre la misma propiedad.
import type { Elemento } from '../core/esquema.ts';
import type { Contexto } from './elementos.ts';
import { h } from './dom.ts';

export const POSES = ['reposo', 'saludo', 'festejo', 'accion'] as const;
export type Pose = (typeof POSES)[number];

export function construirPersonaje(el: Extract<Elemento, { tipo: 'personaje' }>, ctx: Contexto): HTMLElement {
  const def = ctx.tema.personajes[el.personaje];
  const cuerpo = h('div', { class: 'pj-cuerpo' });
  for (const pose of POSES) {
    const src = def ? ctx.url(def.poses[pose]) : '';
    cuerpo.append(
      src
        ? h('img', { class: `pose pose-${pose}`, src, alt: pose === 'reposo' ? `${def?.nombre} (${def?.rol})` : '', 'aria-hidden': pose === 'reposo' ? undefined : 'true', decoding: 'async', draggable: 'false' })
        : h('div', { class: `pose pose-${pose} faltante` }, `Falta arte: ${el.personaje}`),
    );
  }
  const raiz = h('div', { class: 'pj', 'data-personaje': el.personaje, style: `--tam:${el.tamano}` }, h('div', { class: 'pj-sombra' }), h('div', { class: 'pj-mov' }, cuerpo));
  raiz.dataset['paso'] = String(el.paso);
  raiz.dataset['entrada'] = el.entrada === 'fundido' ? 'ninguna' : el.entrada;
  raiz.dataset['acciones'] = JSON.stringify(el.acciones);
  if (el.continuidad) raiz.dataset['continuidad'] = el.personaje;
  return raiz;
}
