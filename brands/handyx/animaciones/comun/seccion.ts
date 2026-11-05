// Portada de sección (video y modo de ensayo): un golpe. Fondo azul de marca, kicker, título con marcador y los Handys
// que entran saltando y festejan. Sin cifras.
import { COLOR, entraTitulo, escena, pose, type Personaje } from './kit.ts';

export interface DefSeccion {
  kicker: string;
  /** Dos líneas; el marcador amarillo va con <mark>. */
  lineas: [string, string];
  bajada: string;
  handys: Personaje[];
}

export function seccion(d: DefSeccion) {
  return escena({
    marcas: [0, 3.2],
    css: `
      .fondo { position: absolute; inset: 0; background: ${COLOR.azul}; }
      .rayos { position: absolute; left: 960px; top: 1180px; width: 2600px; height: 2600px; margin: -1300px 0 0 -1300px; border-radius: 50%; background: repeating-conic-gradient(rgba(255,255,255,.07) 0 7deg, transparent 7deg 18deg); -webkit-mask-image: radial-gradient(circle, #000 18%, transparent 62%); mask-image: radial-gradient(circle, #000 18%, transparent 62%); }
      .cab { position: absolute; left: 0; right: 0; top: 250px; text-align: center; color: #fff; }
      .cab .kicker { color: ${COLOR.amarillo}; font-size: 28px; }
      .cab .titulo { margin-top: 18px; font-size: 118px; color: #fff; }
      .cab .titulo mark { color: ${COLOR.noche}; }
      .bajada { position: absolute; left: 0; right: 0; top: 590px; text-align: center; font-size: 34px; font-weight: 600; color: rgba(255,255,255,.88); }
      .fila { position: absolute; left: 0; right: 0; top: 690px; display: flex; justify-content: center; align-items: flex-end; gap: 34px; }
      .fila .mov { position: relative; flex: none; width: 200px; height: 170px; }
      .fila .pj { left: 15px; bottom: 0; top: auto; }
      .suelo { position: absolute; left: 0; right: 0; top: 868px; height: 212px; background: ${COLOR.azulOscuro}; }
      .suelo::before { content: ''; position: absolute; left: 0; right: 0; top: 0; height: 6px; background: rgba(255,255,255,.12); }
    `,
    html: (c) => `
      <div class="fondo"></div><div class="rayos"></div><div class="suelo"></div>
      <div class="cab"><div class="kicker">${d.kicker}</div><div class="titulo t"><span class="l"><span>${d.lineas[0]}</span></span><span class="l"><span>${d.lineas[1]}</span></span></div></div>
      <div class="bajada">${d.bajada}</div>
      <div class="fila">${d.handys.map((h) => `<div class="mov">${c.pj(h, '', 170)}</div>`).join('')}</div>
    `,
    armar(tl, $) {
      tl.fromTo($('.rayos'), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 1.4, ease: 'power2.out' }, 0);
      tl.fromTo($('.cab .kicker'), { autoAlpha: 0, y: -16 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.1);
      entraTitulo(tl, $.all('.cab .l > span'), 0.2);
      tl.fromTo($('.bajada'), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.45 }, 0.8);
      tl.fromTo($.all('.fila .mov'), { autoAlpha: 0, y: 150 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'back.out(1.8)', stagger: 0.09 }, 1.0);
    },
    ambiente(t, $, tl) {
      $('.rayos').style.transform = `rotate(${(t * 2.5).toFixed(2)}deg)`;
      $.all('.fila .pj').forEach((p, i) => {
        p.style.transform = `translateY(${(Math.sin(t * 2.6 + i * 0.9) * 5).toFixed(1)}px)`;
        pose(p, tl >= 1.9 + i * 0.06 ? (i % 2 ? 'c' : 'b') : 'a');
      });
    },
  });
}
