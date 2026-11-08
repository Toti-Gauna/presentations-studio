// Anexo · El círculo que multiplica (antes, una imagen fija). Foco y Llave recorren el círculo y lo pintan a su paso:
// 0 «Ingresos»: cada trabajo deja la tarifa (se enciende la primera estación) ·
// 1 «Reinversión»: marketing e IA ·
// 2 «Mejor app y más profesiones» ·
// 3 «Más trabajos» → «Más ingresos»: media vuelta más rápida, el círculo se cierra, festejan y un cometa amarillo lo sigue
//   girando; con los excedentes, la tesorería que protege (detalle en la lámina de finanzas).
// Colores del kit: pista gris, recorrido azul, ingresos en amarillo. Sin cifras. La franja y 880–950 queda libre.
import { COLOR, entraTitulo, escena, pose, tramo, type Personaje, type Pose } from './comun/kit.ts';

const MARCAS = [0, 3.0, 6.0, 9.0, 12.6];
const CX = 930;
const CY = 560;
const R = 250;
const R_EST = 60; // estaciones
const R_CENTRO = 124;
const rad = (g: number) => (g * Math.PI) / 180;
/** Punto del círculo a g grados, medidos desde arriba en sentido horario. */
const punto = (g: number): [number, number] => [CX + R * Math.sin(rad(g)), CY - R * Math.cos(rad(g))];

// Estaciones en las diagonales (ángulo sin vuelta): ingresos, reinversión, mejor app, más trabajos
const ESTACIONES = [
  { g: 315, ic: 'alcancia', t: 'Ingresos', s: 'la tarifa de cada trabajo', lado: 'izq' as const },
  { g: 45, ic: 'cohete', t: 'Reinversión', s: 'marketing e IA', lado: 'der' as const },
  { g: 135, ic: 'celular', t: 'Mejor app y más profesiones', s: 'herramientas para cada oficio', lado: 'der' as const },
  { g: 225, ic: 'herramienta', t: 'Más trabajos', s: 'más motivos para volver', lado: 'izq' as const },
];
// Recorrido del grupo (ángulo del centro del grupo, desenrollado): descansa entre estaciones, en los puntos cardinales
const CORRIDAS = [
  { t0: 1.2, t1: 2.5, a0: 270, a1: 360 },
  { t0: 3.2, t1: 4.6, a0: 360, a1: 450 },
  { t0: 6.2, t1: 7.6, a0: 450, a1: 540 },
  { t0: 9.15, t1: 11.0, a0: 540, a1: 720 },
];
const suave = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2);
function angulo(t: number): number {
  let a = CORRIDAS[0]!.a0;
  for (const c of CORRIDAS) if (t >= c.t0) a = c.a0 + (c.a1 - c.a0) * suave(tramo(t, c.t0, c.t1));
  return a;
}
const SEP = 12; // medio espacio angular entre Foco (adelante) y Llave
/** Momento en que el que va adelante pasa por un ángulo (desenrollado). */
function cuando(g: number): number {
  for (let t = 0; t <= MARCAS[4]!; t += 0.005) if (angulo(t) + SEP >= g) return t;
  return MARCAS[4]!;
}
const ENCIENDE = [cuando(315), cuando(405), cuando(495), cuando(585)];
const VUELVE = cuando(675); // Foco vuelve a pasar por los ingresos
const CIERRE = CORRIDAS[3]!.t1;
const CORREDORES: Array<{ n: Personaje; alto: number; d: number }> = [
  { n: 'bombilla', alto: 100, d: SEP },
  { n: 'llave', alto: 94, d: -SEP },
];
const corriendo = (t: number) => CORRIDAS.some((c) => t >= c.t0 && t < c.t1);
/** Grados ya pintados de azul (desde el punto izquierdo): la cola del grupo. */
const pintado = (t: number) => Math.min(360, Math.max(0, angulo(t) - SEP - 270));
const FLUJO = 18; // puntos blancos que corren por lo ya pintado
// Recorrido completo como trazo: arranca en el punto izquierdo y gira en sentido horario
const CIRCULO = `M${CX - R} ${CY} A${R} ${R} 0 1 1 ${CX + R} ${CY} A${R} ${R} 0 1 1 ${CX - R} ${CY}`;

export default escena({
  marcas: MARCAS,
  leyendas: ['Cada trabajo deja **ingresos**', 'Las ganancias se **reinvierten**', 'Mejor **app** y más **profesiones**', '**Más trabajos**: el círculo vuelve a girar'],
  css: `
    .fondo { position: absolute; inset: 0; background-color: ${COLOR.hueso}; background-image: radial-gradient(rgba(31,87,168,.10) 1.6px, transparent 2.2px); background-size: 36px 36px; }
    .encabezado { position: absolute; left: 96px; top: 52px; z-index: 50; }
    .fila-k { display: flex; align-items: center; gap: 16px; }
    .rotulo { font-weight: 800; font-size: 20px; letter-spacing: .06em; text-transform: uppercase; color: ${COLOR.azulOscuro}; border: 3px solid ${COLOR.azulOscuro}; border-radius: 999px; padding: 3px 14px; }
    .encabezado .titulo { margin-top: 12px; font-size: 62px; color: ${COLOR.noche}; }
    .anillo { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; overflow: visible; }
    .anillo path { fill: none; }
    .sombra { stroke: rgba(14,29,54,.05); stroke-width: 58; }
    .pista { stroke: #E3E8F2; stroke-width: 36; stroke-dasharray: 360 360; }
    .recorrido { stroke: ${COLOR.azul}; stroke-width: 36; stroke-linecap: round; stroke-dasharray: 360 360; stroke-dashoffset: 360; }
    .cometa { stroke: ${COLOR.amarillo}; stroke-linecap: round; opacity: 0; }
    .cometa.c0 { stroke-width: 18; stroke-dasharray: 22 338; filter: drop-shadow(0 0 10px rgba(255,201,60,.95)); }
    .cometa.c1 { stroke-width: 11; stroke-dasharray: 40 320; }
    .cometa.c2 { stroke-width: 6; stroke-dasharray: 56 304; }
    .flujo circle { fill: #fff; opacity: 0; }
    .halo { position: absolute; left: ${CX - 300}px; top: ${CY - 300}px; width: 600px; height: 600px; }
    .halo i { position: absolute; inset: 0; border-radius: 50%; background: radial-gradient(circle, rgba(255,201,60,.34) 0, rgba(255,201,60,.12) 36%, rgba(255,201,60,0) 62%); }
    .orbita { position: absolute; left: ${CX - R_CENTRO - 22}px; top: ${CY - R_CENTRO - 22}px; width: ${2 * R_CENTRO + 44}px; height: ${2 * R_CENTRO + 44}px; }
    .orbita i { position: absolute; inset: 0; border-radius: 50%; border: 3px dashed rgba(31,87,168,.22); }
    .centro { position: absolute; left: ${CX - R_CENTRO}px; top: ${CY - R_CENTRO}px; width: ${2 * R_CENTRO}px; height: ${2 * R_CENTRO}px; border-radius: 50%; background: #fff; box-shadow: 0 0 0 10px rgba(255,201,60,.45), 0 26px 50px rgba(14,29,54,.18); }
    .centro img.logo { position: absolute; left: 50%; top: 50px; width: 176px; margin-left: -88px; }
    .centro .mov { position: absolute; left: ${R_CENTRO - 50}px; top: 98px; width: 100px; height: 100px; transform-origin: 50% 100%; }
    .est { position: absolute; width: ${2 * R_EST}px; height: ${2 * R_EST}px; margin: -${R_EST}px 0 0 -${R_EST}px; }
    .est .disco { position: absolute; inset: 0; border-radius: 50%; background: #fff; display: grid; place-items: center; box-shadow: 0 0 0 6px ${COLOR.hueso}, 0 12px 26px rgba(14,29,54,.16); transition: none; }
    .est .disco .icono { width: 54px; height: 54px; opacity: .45; }
    .est.on .disco { background: ${COLOR.azul}; }
    .est.on .disco .icono { opacity: 1; filter: brightness(0) invert(1); }
    .est.e0.on .disco { background: ${COLOR.amarillo}; }
    .est.e0.on .disco .icono { filter: brightness(.62); }
    .est .onda { position: absolute; inset: -10px; border-radius: 50%; border: 6px solid ${COLOR.amarillo}; opacity: 0; }
    .rot { position: absolute; width: 620px; }
    .rot.izq { text-align: right; }
    .rot b { display: block; font-size: 34px; color: ${COLOR.noche}; white-space: nowrap; }
    .rot span { display: block; margin-top: 6px; font-size: 24px; font-weight: 600; color: ${COLOR.suave}; white-space: nowrap; }
    .moneda { position: absolute; left: 0; top: 0; width: 40px; height: 40px; margin: -20px 0 0 -20px; border-radius: 50%; background: ${COLOR.amarillo}; box-shadow: inset 0 -4px 0 #D9A21E, 0 6px 14px rgba(14,29,54,.25); display: grid; place-items: center; font-weight: 900; font-size: 22px; color: ${COLOR.noche}; opacity: 0; z-index: 12; }
    .corredor { position: absolute; left: 0; top: 0; transform-origin: 50% 100%; z-index: 10; opacity: 0; }
    .espejo { position: absolute; inset: 0; transform-origin: 50% 100%; }
    .pj { transform-origin: 50% 100%; }
    .tes { position: absolute; left: 96px; top: ${CY - 40}px; display: flex; align-items: center; gap: 14px; padding: 12px 22px 12px 12px; border-radius: 22px; background: #fff; box-shadow: 0 10px 24px rgba(14,29,54,.10), 0 0 0 2px ${COLOR.borde}; }
    .tes .ic { flex: none; display: grid; place-items: center; width: 52px; height: 52px; border-radius: 16px; background: ${COLOR.celeste}; }
    .tes .ic .icono { width: 30px; height: 30px; }
    .tes b { display: block; font-size: 22px; font-weight: 800; color: ${COLOR.noche}; }
    .tes span { display: block; font-size: 20px; font-weight: 600; color: ${COLOR.suave}; }
  `,
  html: (c) => {
    const estaciones = ESTACIONES.map((e, i) => {
      const [x, y] = punto(e.g);
      const ry = i < 2 ? y - 8 : y + 8;
      const rot =
        e.lado === 'izq'
          ? `<div class="rot izq r${i}" style="left:${x - R_EST - 26 - 620}px;top:${ry - 42}px"><b class="t">${e.t}</b><span>${e.s}</span></div>`
          : `<div class="rot der r${i}" style="left:${x + R_EST + 26}px;top:${ry - 42}px"><b class="t">${e.t}</b><span>${e.s}</span></div>`;
      return `<div class="est e${i}" style="left:${x}px;top:${y}px"><i class="onda"></i><div class="disco">${c.icono(e.ic)}</div></div>${rot}`;
    }).join('');
    return `
      <div class="fondo"></div>
      <div class="halo"><i></i></div>
      <svg class="anillo" viewBox="0 0 1920 1080"><path class="sombra" d="${CIRCULO}"/><path class="pista" d="${CIRCULO}" pathLength="360"/><path class="recorrido" d="${CIRCULO}" pathLength="360"/><g class="flujo">${'<circle r="4.5"/>'.repeat(FLUJO)}</g><path class="cometa c2" d="${CIRCULO}" pathLength="360"/><path class="cometa c1" d="${CIRCULO}" pathLength="360"/><path class="cometa c0" d="${CIRCULO}" pathLength="360"/></svg>
      <div class="orbita"><i></i></div>
      <div class="centro">${c.logo('logo')}<div class="mov">${c.pj('engranaje', '', 100)}</div></div>
      ${estaciones}
      <div class="moneda m0">$</div><div class="moneda m1">$</div>
      ${CORREDORES.map((k, i) => `<div class="corredor k${i}" style="width:${k.alto}px;height:${k.alto}px"><div class="espejo">${c.pj(k.n, '', k.alto)}</div></div>`).join('')}
      <div class="tes"><span class="ic">${c.icono('escudo')}</span><div><b>Con los excedentes,</b><span>una tesorería que protege</span></div></div>
      <div class="encabezado"><div class="fila-k"><span class="kicker">Material extra · finanzas</span><span class="rotulo">Plan propuesto · a validar</span></div>
        <div class="titulo t"><span class="l"><span>El círculo que <mark>multiplica</mark></span></span></div></div>
    `;
  },
  armar(tl, $, c) {
    tl.fromTo($('.encabezado .kicker'), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.05);
    tl.fromTo($('.rotulo'), { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, 0.45);
    entraTitulo(tl, $.all('.encabezado .l > span'), 0.1);
    // El círculo se dibuja; el centro y las estaciones aparecen
    tl.fromTo($('.pista'), { strokeDashoffset: 360 }, { strokeDashoffset: 0, duration: 1.0, ease: 'power2.inOut' }, 0.25);
    tl.fromTo($('.sombra'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 0.4);
    tl.fromTo($('.halo'), { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 1.0, ease: 'power2.out' }, 0.3);
    tl.fromTo($('.centro'), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'back.out(1.8)' }, 0.4);
    tl.fromTo($('.orbita'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, 0.7);
    tl.fromTo($('.centro .mov'), { autoAlpha: 0, y: 30, scale: 0.6 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(2.2)' }, 0.75);
    tl.fromTo($.all('.est'), { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2.4)', stagger: 0.1 }, 0.6);
    // Cada estación: se enciende cuando pasa Foco (clase por pintor), late y muestra su rótulo
    ENCIENDE.forEach((t, i) => {
      tl.fromTo($(`.e${i} .onda`), { autoAlpha: 0.9, scale: 0.8 }, { autoAlpha: 0, scale: 1.5, duration: 0.7, ease: 'power2.out', immediateRender: false }, t);
      tl.fromTo($(`.e${i} .disco`), { scale: 1 }, { scale: 1.12, duration: 0.16, yoyo: true, repeat: 1, ease: 'power2.out', immediateRender: false }, t);
      tl.fromTo($(`.r${i}`), { autoAlpha: 0, x: i === 0 || i === 3 ? 24 : -24 }, { autoAlpha: 1, x: 0, duration: 0.45, ease: 'power3.out' }, t + 0.05);
    });
    // Vuelta completa: los ingresos laten de nuevo, ahora «Más ingresos»
    tl.fromTo($('.e0 .onda'), { autoAlpha: 0.9, scale: 0.8 }, { autoAlpha: 0, scale: 1.7, duration: 0.8, ease: 'power2.out', immediateRender: false }, VUELVE);
    tl.fromTo($('.r0'), { scale: 1 }, { scale: 1.06, transformOrigin: '100% 50%', duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.out', immediateRender: false }, VUELVE + 0.05);
    tl.fromTo($('.centro'), { scale: 1 }, { scale: 1.05, duration: 0.22, yoyo: true, repeat: 1, ease: 'power2.out', immediateRender: false }, CIERRE);
    tl.fromTo($('.tes'), { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: 0.45, ease: 'power3.out' }, CIERRE + 0.5);

    // Monedas que saltan de los ingresos cada vez que pasa Foco
    const [ex, ey] = punto(315);
    [ENCIENDE[0]!, VUELVE].forEach((t, i) => {
      const m = $(`.m${i}`);
      tl.fromTo(m, { x: ex, y: ey, autoAlpha: 0, scale: 0.4 }, { x: ex - 34, y: ey - 92, autoAlpha: 1, scale: 1, duration: 0.45, ease: 'power2.out', immediateRender: false }, t);
      tl.to(m, { y: ey - 120, autoAlpha: 0, duration: 0.35, ease: 'power1.in' }, t + 0.55);
    });

    // Recorrido, estaciones encendidas, corredores y poses (todo desde el ángulo del grupo: vale también en los saltos)
    const recorrido = $('.recorrido');
    const est = $.all('.est');
    const r0 = $('.r0 b');
    const corredores = $.all('.corredor').map((el, i) => ({ el, esp: el.querySelector('.espejo') as HTMLElement, pj: el.querySelector('.pj') as HTMLElement, k: CORREDORES[i]! }));
    const eng = $('.centro .pj');
    const ultima = new Map<HTMLElement, Pose>();
    const poner = (el: HTMLElement, p: Pose) => {
      if (ultima.get(el) !== p) {
        ultima.set(el, p);
        pose(el, p);
      }
    };
    c.pintor((t) => {
      const a = angulo(t);
      const hecho = pintado(t);
      recorrido.style.strokeDashoffset = String(360 - hecho);
      recorrido.style.opacity = hecho > 0.5 ? '1' : '0';
      est.forEach((el, i) => el.classList.toggle('on', t >= ENCIENDE[i]!));
      r0.textContent = t >= VUELVE ? 'Más ingresos' : 'Ingresos';
      const corre = corriendo(t);
      const aparece = tramo(t, 0.95, 1.3);
      for (const k of corredores) {
        const g = a + k.k.d;
        const [x, y] = punto(g);
        const salto = corre ? Math.abs(Math.sin(t * 13 + k.k.d)) * 10 : 0;
        // Mira hacia donde corre: a la derecha en la mitad de arriba, a la izquierda en la de abajo
        const izquierda = corre && Math.cos(rad(g)) < 0;
        k.el.style.opacity = String(aparece);
        // Anclados por el centro del cuerpo sobre la pista: en los costados no invaden las estaciones
        k.el.style.transform = `translate(${(x - k.k.alto / 2).toFixed(1)}px, ${(y - k.k.alto * 0.58 - salto).toFixed(1)}px) scale(${(0.6 + 0.4 * aparece).toFixed(3)})`;
        k.esp.style.transform = izquierda ? 'scaleX(-1)' : 'none';
        poner(k.pj, t >= CIERRE ? 'c' : corre ? 'd' : t >= 1.0 ? 'b' : 'a');
      }
      poner(eng, t >= CIERRE ? 'c' : corre ? 'd' : t >= 0.9 ? 'b' : 'a');
    });
  },
  ambiente(t, $, tl) {
    // Puntos blancos que fluyen en sentido horario por lo ya pintado (dueño: el ambiente)
    const hecho = pintado(tl);
    $.all('.flujo circle').forEach((d, i) => {
      const g = (t * 26 + (i * 360) / FLUJO) % 360;
      const [x, y] = punto(270 + g);
      d.setAttribute('cx', x.toFixed(1));
      d.setAttribute('cy', y.toFixed(1));
      d.style.opacity = g > 4 && g < hecho - 4 ? '.75' : '0';
    });
    // Cometa amarillo con estela que sigue girando cuando el círculo se cerró
    const k = tramo(tl, CIERRE, CIERRE + 0.4);
    const cabeza = 90 + Math.max(0, t - CIERRE) * 110; // arranca arriba, donde terminan Foco y Llave
    $.all('.cometa').forEach((cm, i) => {
      const largo = [22, 40, 56][i]!;
      const atras = [0, 12, 40][i]!;
      cm.style.opacity = String(k * [1, 0.7, 0.4][i]!);
      cm.style.strokeDashoffset = String(-((cabeza - atras - largo + 720) % 360));
    });
    $('.orbita i').style.transform = `rotate(${(t * 7).toFixed(2)}deg)`;
    $('.halo i').style.transform = `scale(${(1 + Math.sin(t * 1.6) * 0.03).toFixed(4)})`;
    $.all('.pj').forEach((p, i) => (p.style.transform = `scaleY(${(1 + Math.sin(t * 2.4 + i) * 0.02).toFixed(4)})`));
  },
});
