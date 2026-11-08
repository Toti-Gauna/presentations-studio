// Anexo de respaldo · UX + IA: el diferencial («El mismo arreglo, tres experiencias»). Un golpe por paso:
// 0 Hoy, por WhatsApp → Foco (el vecino) pregunta en grupos y espera; el precio llega al final (ruta punteada) ·
// 1 Apps con comisión → pedido y propuestas, algunas con IA; Llave (el profesional) paga la comisión: la moneda se va ·
// 2 Handyx → una foto y HandIA arma el pedido, precio visible antes de contratar, el profesional no paga comisión y suma
//   herramientas: la ruta azul, directa; Foco y Llave festejan ·
// 3 El diferencial → las otras rutas se van: no es una función, es el recorrido completo; el camino de vuelta (historial)
//   cierra el circuito para que el cliente vuelva a elegir al profesional.
// Los tres carriles se anuncian desde el paso 0 (rótulo apagado y paradas punteadas) y se llenan de a uno, así cada
// página del PDF se entiende sola. Las tres rutas salen de Foco y llegan a Llave (el mismo arreglo). Cifras solo por afirmaciones (COMP-CLICKIE-PRO,
// FEE-ESPECIALISTA). Sin nombres ni logos de otras plataformas. La franja y 880–950 queda libre (leyenda del kit) y la de
// y > 960 también.
import { COLOR, entraTitulo, escena, pose, tramo, type Pose } from './comun/kit.ts';

type P = readonly [number, number];
type Tramo = { l: P } | { c: readonly [P, P, P] };
interface Ruta {
  d: string;
  largo: number;
  /** Punto a s px del inicio, medido sobre la ruta. */
  en: (s: number) => P;
}

/** Ruta de rectas y curvas cúbicas, muestreada para recorrerla (puntos punteados y pulsos que fluyen). */
function ruta(ini: P, tramos: Tramo[]): Ruta {
  const m: P[] = [ini];
  let d = `M${ini[0]} ${ini[1]}`;
  let a = ini;
  for (const tr of tramos) {
    if ('l' in tr) {
      d += ` L${tr.l[0]} ${tr.l[1]}`;
      m.push(tr.l);
      a = tr.l;
      continue;
    }
    const [c1, c2, b] = tr.c;
    d += ` C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${b[0]} ${b[1]}`;
    for (let k = 1; k <= 24; k++) {
      const u = k / 24;
      const v = 1 - u;
      const w = [v * v * v, 3 * v * v * u, 3 * v * u * u, u * u * u] as const;
      m.push([w[0] * a[0] + w[1] * c1[0] + w[2] * c2[0] + w[3] * b[0], w[0] * a[1] + w[1] * c1[1] + w[2] * c2[1] + w[3] * b[1]]);
    }
    a = b;
  }
  const acum = [0];
  for (let i = 1; i < m.length; i++) acum.push((acum[i - 1] ?? 0) + Math.hypot(m[i]![0] - m[i - 1]![0], m[i]![1] - m[i - 1]![1]));
  const largo = acum[acum.length - 1] ?? 0;
  const en = (s: number): P => {
    const x = Math.min(largo, Math.max(0, s));
    let i = 1;
    while (i < m.length - 1 && (acum[i] ?? 0) < x) i++;
    const p = m[i - 1]!;
    const q = m[i]!;
    const u = (x - (acum[i - 1] ?? 0)) / ((acum[i] ?? 0) - (acum[i - 1] ?? 0) || 1);
    return [p[0] + (q[0] - p[0]) * u, p[1] + (q[1] - p[1]) * u];
  };
  return { d, largo, en };
}

// Geometría: las tres rutas salen de Foco (O) y llegan a Llave (D); cada carril corre recto entre X0 y X1.
const Y = { a: 316, b: 536, c: 756 } as const;
const O: P = [262, Y.b];
const D: P = [1636, Y.b];
const X0 = 380;
const X1 = 1540;
const KI = (X0 - O[0]) / 2;
const KD = (D[0] - X1) / 2;
const carril = (y: number) =>
  ruta(O, [{ c: [[O[0] + KI, O[1]], [X0 - KI, y], [X0, y]] }, { l: [X1, y] }, { c: [[X1 + KD, y], [D[0] - KD, D[1]], D] }]);
const RA = carril(Y.a);
const RB = carril(Y.b);
const RC = carril(Y.c);
const VUELTA = ruta([1572, Y.b], [{ l: [330, Y.b] }]); // camino de vuelta (historial), de Llave a Foco
const EST_X = [560, 960, 1360]; // centro de las paradas (360 × 100)
const EST_W = 360;
const EST_H = 100;
const PUNTO = 18; // separación de los puntos de la ruta de WhatsApp

// Tiempos (s): un tramo por paso
const M = [0, 3.4, 6.8, 10.6, 14.0];
const T_A = { ruta: 0.85, dur: 1.4, est: [1.05, 1.5, 1.95] };
const T_B = { ruta: 3.7, dur: 0.9, est: [3.9, 4.35, 4.8] };
const T_C = { ruta: 7.05, dur: 1.0, est: [7.35, 7.9, 8.45] };
const T_V = { ruta: 11.55, dur: 0.8 };
const MONEDA = 5.2; // Llave paga la comisión

interface Parada {
  ic: string;
  b: string;
  s: string;
  clase?: string;
}

export default escena({
  marcas: M,
  leyendas: [
    'Hoy, por WhatsApp: **preguntás y esperás**',
    'Apps con comisión: **el profesional paga**',
    'Handyx: **una foto**, **precio visible** y herramientas',
    'Todo el recorrido, **para que el cliente vuelva**',
  ],
  css: `
    .fondo { position: absolute; inset: 0; background: ${COLOR.hueso}; }
    .halo { position: absolute; left: 960px; top: 576px; width: 1700px; height: 1100px; margin: -550px 0 0 -850px; border-radius: 50%; background: radial-gradient(closest-side, rgba(255,255,255,.9), rgba(255,255,255,0)); }
    .encabezado { position: absolute; left: 96px; top: 52px; }
    .encabezado .titulo { margin-top: 10px; font-size: 60px; color: ${COLOR.noche}; }
    .capa { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
    .capa svg { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; overflow: visible; }
    .pa { fill: #B4BED0; }
    .linea { fill: none; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1000 1000; stroke-dashoffset: 1000; }
    .rB { stroke: #C3CEE1; stroke-width: 6; }
    .rC { stroke: ${COLOR.azul}; stroke-width: 8; }
    .rV { stroke: ${COLOR.amarillo}; stroke-width: 7; }
    .pulsos circle { opacity: 0; }
    .pC circle { fill: #fff; }
    .pV circle { fill: #C9971E; }

    /* Rótulo de cada carril */
    .cab { position: absolute; left: ${X0}px; height: 34px; display: flex; align-items: center; gap: 12px; font-size: 22px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: ${COLOR.suave}; white-space: nowrap; }
    .cab .icono { width: 28px; height: 28px; }
    .cab img.logo { height: 32px; display: block; }
    .cab .dev { display: inline-flex; align-items: center; gap: 8px; padding: 5px 14px 5px 10px; border-radius: 999px; background: ${COLOR.celeste}; color: ${COLOR.azul}; font-size: 20px; letter-spacing: 0; text-transform: none; box-shadow: inset 0 0 0 2px rgba(31,87,168,.14); }
    .cab .dev .icono { width: 22px; height: 22px; }

    /* Paradas */
    .est { position: absolute; width: ${EST_W}px; height: ${EST_H}px; margin: -${EST_H / 2}px 0 0 -${EST_W / 2}px; display: flex; align-items: center; gap: 14px; padding: 0 16px 0 14px; border-radius: 24px; background: #fff; box-shadow: 0 12px 28px rgba(14,29,54,.10), 0 3px 0 ${COLOR.borde}; }
    .est .ic { flex: none; width: 62px; height: 62px; border-radius: 17px; display: grid; place-items: center; background: #ECECEC; box-shadow: inset 0 -4px 0 rgba(14,29,54,.06); }
    .est .ic .icono { width: 32px; height: 32px; }
    .est b { display: block; font-size: 25px; font-weight: 800; line-height: 1.15; color: ${COLOR.noche}; white-space: nowrap; }
    .est span { display: block; margin-top: 2px; font-size: 21px; font-weight: 600; line-height: 1.2; color: ${COLOR.suave}; white-space: nowrap; }
    .cA .ic .icono { opacity: .62; }
    .cB .ic { background: ${COLOR.celeste}; box-shadow: none; }
    .cB .ic.cobra { background: ${COLOR.naranja}; box-shadow: 0 4px 0 #C98612; }
    .cC .est { background: ${COLOR.azul}; box-shadow: 0 7px 0 ${COLOR.azulOscuro}, 0 18px 34px rgba(14,29,54,.20); }
    .cC .ic { background: #fff; box-shadow: 0 4px 0 #C9D6EE; }
    .cC .est b { color: #fff; }
    .cC .est span { color: #DCE7FA; }
    .hueco { position: absolute; width: ${EST_W}px; height: ${EST_H}px; margin: -${EST_H / 2}px 0 0 -${EST_W / 2}px; border-radius: 24px; border: 3px dashed #C3CCDB; background: rgba(255,255,255,.4); }
    .brillo { position: absolute; inset: -9px; border-radius: 31px; border: 5px solid ${COLOR.amarillo}; box-shadow: 0 0 26px rgba(255,201,60,.55); opacity: 0; }

    /* Handys: el contenedor .mov lo mueve la línea de tiempo; el .pj de adentro respira (ambiente) */
    .mov { position: absolute; }
    .pj { transform-origin: 50% 100%; }
    .foco { left: 96px; top: 436px; width: 176px; height: 176px; }
    .llave { left: 1650px; top: 442px; width: 172px; height: 172px; }
    .sombra { position: absolute; left: 50%; bottom: -8px; height: 14px; border-radius: 50%; background: rgba(14,29,54,.14); transform: translateX(-50%); }
    .duda { position: absolute; left: 150px; top: 310px; width: 120px; height: 140px; }
    .duda .bur { position: absolute; border-radius: 50%; background: #fff; box-shadow: 0 10px 24px rgba(14,29,54,.14); }
    .duda .p2 { left: 22px; top: 122px; width: 12px; height: 12px; }
    .duda .p1 { left: 34px; top: 100px; width: 20px; height: 20px; }
    .duda .nube-w { position: absolute; left: 18px; top: 0; width: 92px; height: 92px; }
    .duda .nube { width: 100%; height: 100%; display: grid; place-items: center; }
    .duda .q { font-size: 62px; color: ${COLOR.azul}; line-height: 1; }
    .moneda { position: absolute; left: 0; top: 0; opacity: 0; width: 40px; height: 40px; margin: -20px 0 0 -20px; border-radius: 50%; background: ${COLOR.amarillo}; box-shadow: inset 0 -4px 0 #C9971E, 0 8px 16px rgba(14,29,54,.2); display: grid; place-items: center; font-weight: 900; font-size: 22px; color: #8A5A00; }

    /* Paso 3: la tesis y el camino de vuelta */
    .tesis { position: absolute; left: 96px; top: 206px; }
    .tesis .k2 { font-weight: 800; font-size: 22px; letter-spacing: .08em; text-transform: uppercase; color: ${COLOR.azul}; }
    .tesis .g { margin-top: 10px; font-size: 52px; color: ${COLOR.azulOscuro}; }
    .tesis .g .l { display: block; overflow: hidden; padding-bottom: 8px; margin-bottom: -8px; }
    .tesis .g .l > span { display: inline-block; }
    .tesis .s { margin-top: 14px; font-size: 25px; font-weight: 600; color: ${COLOR.texto}; }
    .punta { position: absolute; left: 304px; top: ${Y.b - 17}px; width: 30px; height: 34px; background: ${COLOR.amarillo}; clip-path: polygon(0 50%, 100% 0, 78% 50%, 100% 100%); }
    .ch-v { position: absolute; left: 960px; top: ${Y.b}px; display: flex; align-items: center; gap: 14px; padding: 8px 24px 8px 8px; border-radius: 999px; background: #fff; box-shadow: 0 12px 26px rgba(14,29,54,.14), 0 3px 0 ${COLOR.borde}; font-size: 25px; font-weight: 600; color: ${COLOR.noche}; white-space: nowrap; }
    .ch-v b { font-weight: 800; color: ${COLOR.azul}; }
    .ch-v .ic { width: 48px; height: 48px; border-radius: 50%; display: grid; place-items: center; background: ${COLOR.amarillo}; box-shadow: 0 4px 0 #C9971E; }
    .ch-v .ic .icono { width: 28px; height: 28px; }
  `,
  html: (c) => {
    const parada = (p: Parada, x: number, y: number) =>
      `<div class="est" style="left:${x}px;top:${y}px"><span class="ic ${p.clase ?? ''}">${c.icono(p.ic, p.clase === 'cobra' ? 'blanco' : '')}</span><div><b>${p.b}</b><span>${p.s}</span></div><i class="brillo"></i></div>`;
    const A: Parada[] = [
      { ic: 'grupo', b: 'Preguntás', s: 'en grupos' },
      { ic: 'reloj', b: 'Esperás', s: 'respuestas' },
      { ic: 'pregunta', b: 'El precio', s: 'llega al final' },
    ];
    const B: Parada[] = [
      { ic: 'lista', b: 'Pedido', s: 'y propuestas' },
      { ic: 'sparkles', b: 'Algunas', s: 'suman IA' },
      { ic: 'porcentaje', b: 'El profesional', s: `paga hasta ${c.cifra('COMP-CLICKIE-PRO')}`, clase: 'cobra' },
    ];
    const C: Parada[] = [
      { ic: 'camara', b: 'Una foto', s: 'y HandIA arma el pedido', clase: 'azul' },
      { ic: 'recibo', b: 'Precio visible', s: 'antes de contratar', clase: 'azul' },
      { ic: 'herramienta', b: `${c.cifra('FEE-ESPECIALISTA')} al profesional`, s: 'y herramientas por oficio', clase: 'azul' },
    ];
    const puntosA = Array.from({ length: Math.floor(RA.largo / PUNTO) + 1 }, (_, i) => RA.en(i * PUNTO));
    const pulsos = (n: number) => '<circle r="5"/>'.repeat(n);
    return `
    <div class="fondo"></div><div class="halo"></div>
    <div class="encabezado"><div class="kicker">Respaldo · competencia</div><div class="titulo t"><span class="l"><span>El mismo arreglo, <mark>tres experiencias</mark></span></span></div></div>

    <div class="capa cA">
      <svg viewBox="0 0 1920 1080">${puntosA.map((p) => `<circle class="pa" r="4.5" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}"/>`).join('')}</svg>
      ${EST_X.map((x) => `<i class="hueco" style="left:${x}px;top:${Y.a}px"></i>`).join('')}
      <div class="cab" style="top:${Y.a - 100}px">${c.icono('chat')}<span>Hoy, por WhatsApp</span></div>
      ${A.map((p, i) => parada(p, EST_X[i] ?? 0, Y.a)).join('')}
    </div>
    <div class="capa cB">
      <svg viewBox="0 0 1920 1080"><path class="linea rB" d="${RB.d}" pathLength="1000"/></svg>
      ${EST_X.map((x) => `<i class="hueco" style="left:${x}px;top:${Y.b}px"></i>`).join('')}
      <div class="cab" style="top:${Y.b - 100}px">${c.icono('celular')}<span>Apps con comisión</span></div>
      ${B.map((p, i) => parada(p, EST_X[i] ?? 0, Y.b)).join('')}
    </div>
    <div class="capa cC">
      <svg viewBox="0 0 1920 1080"><path class="linea rC" d="${RC.d}" pathLength="1000"/><g class="pulsos pC">${pulsos(14)}</g></svg>
      ${EST_X.map((x) => `<i class="hueco" style="left:${x}px;top:${Y.c}px"></i>`).join('')}
      <div class="cab" style="top:${Y.c - 100}px">${c.logo('logo')}<span class="dev">${c.icono('ia')}HandIA y herramientas en desarrollo</span></div>
      ${C.map((p, i) => parada(p, EST_X[i] ?? 0, Y.c)).join('')}
    </div>

    <div class="capa vuelta">
      <svg viewBox="0 0 1920 1080"><path class="linea rV" d="${VUELTA.d}" pathLength="1000"/><g class="pulsos pV">${pulsos(10)}</g></svg>
      <i class="punta"></i>
      <div class="ch-v"><span class="ic">${c.icono('repetir')}</span><span>Historial: <b>para que el cliente vuelva</b></span></div>
    </div>
    <div class="tesis">
      <div class="k2">Lo que nos diferencia</div>
      <div class="g t"><span class="l"><span>No es una función:</span></span><span class="l"><span>es <mark>el recorrido completo.</mark></span></span></div>
      <div class="s">De la foto al trabajo terminado, con el profesional cobrando su presupuesto.</div>
    </div>

    <div class="duda"><i class="bur p2"></i><i class="bur p1"></i><div class="nube-w"><div class="nube bur"><span class="q t">?</span></div></div></div>
    <div class="mov foco">${c.pj('bombilla', '', 176)}<i class="sombra" style="width:96px"></i></div>
    <div class="mov llave">${c.pj('llave', '', 172)}<i class="sombra" style="width:120px"></i></div>
    <div class="moneda">$</div>
  `;
  },
  armar(tl, $, c) {
    const pop = (el: HTMLElement | HTMLElement[], t: number) =>
      tl.fromTo(el, { autoAlpha: 0, y: 26, scale: 0.86 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.42, ease: 'back.out(2)' }, t);
    // Los tres carriles se anuncian en el paso 0 (rótulo apagado y lugares punteados); cada uno se enciende en su paso
    const cab = (sel: string, t: number) => tl.to($(`${sel} .cab`), { opacity: 1, duration: 0.35, ease: 'power1.out' }, t);
    const ests = (sel: string) => $.all(`${sel} .est`);
    const llenar = (sel: string, tiempos: number[]) =>
      ests(sel).forEach((e, i) => {
        const t = tiempos[i] ?? 0;
        pop(e, t);
        tl.to($.all(`${sel} .hueco`)[i]!, { autoAlpha: 0, duration: 0.2 }, t + 0.12);
      });
    tl.fromTo($.all('.cab'), { autoAlpha: 0, x: -24 }, { autoAlpha: (i) => (i === 0 ? 1 : 0.35), x: 0, duration: 0.4, ease: 'power3.out', stagger: 0.1 }, 0.6);
    tl.fromTo($.all('.hueco'), { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'power2.out', stagger: 0.03 }, 0.55);

    // 0 · Hoy, por WhatsApp: Foco pregunta en grupos, espera y el precio llega al final
    tl.fromTo($('.halo'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.0 }, 0);
    tl.fromTo($('.encabezado .kicker'), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0);
    entraTitulo(tl, $.all('.encabezado .l > span'), 0.1);
    tl.fromTo($('.foco'), { autoAlpha: 0, x: -200 }, { autoAlpha: 1, x: 0, duration: 0.6, ease: 'power3.out' }, 0.3);
    tl.fromTo($('.llave'), { autoAlpha: 0, x: 220 }, { autoAlpha: 1, x: 0, duration: 0.6, ease: 'power3.out' }, 0.45);
    llenar('.cA', T_A.est);
    tl.fromTo([$('.duda .p2'), $('.duda .p1'), $('.duda .nube-w')], { autoAlpha: 0, scale: 0.2 }, { autoAlpha: 1, scale: 1, duration: 0.32, ease: 'back.out(2.4)', stagger: 0.09 }, 2.3);
    // La ruta punteada se dibuja de a puntos (pintor: vale también en los saltos)
    const puntos = $.all('.pa');
    let dibujados = -1;
    c.pintor((t) => {
      const n = Math.round(tramo(t, T_A.ruta, T_A.ruta + T_A.dur) * puntos.length);
      if (n === dibujados) return;
      dibujados = n;
      puntos.forEach((p, i) => (p.style.opacity = i < n ? '1' : '0'));
    });

    // 1 · Apps con comisión: pedido y propuestas; Llave paga la comisión
    tl.to($('.cA'), { opacity: 0.4, duration: 0.4, ease: 'power1.out' }, M[1]!);
    tl.to($('.duda'), { autoAlpha: 0, scale: 0.6, duration: 0.3, ease: 'power2.in' }, M[1]!);
    cab('.cB', 3.55);
    tl.fromTo($('.rB'), { strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: T_B.dur, ease: 'power1.inOut' }, T_B.ruta);
    llenar('.cB', T_B.est);
    // La moneda sale de Llave y cae en la comisión (arco cuadrático; pintor: un solo dueño de su posición)
    const moneda = $('.moneda');
    const [m0, m1, m2] = [[1700, 490], [1390, 300], [1225, Y.b]] as const;
    c.pintor((t) => {
      const k = tramo(t, MONEDA, MONEDA + 0.8);
      const u = k * k * (3 - 2 * k);
      const x = (1 - u) ** 2 * m0[0] + 2 * (1 - u) * u * m1[0] + u * u * m2[0];
      const y = (1 - u) ** 2 * m0[1] + 2 * (1 - u) * u * m1[1] + u * u * m2[1];
      moneda.style.opacity = t >= MONEDA && t < MONEDA + 0.82 ? '1' : '0';
      moneda.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${(1 - 0.45 * u).toFixed(3)})`;
    });
    tl.fromTo($('.cB .ic.cobra'), { scale: 1 }, { scale: 1.18, duration: 0.14, yoyo: true, repeat: 1, ease: 'power2.out', immediateRender: false }, MONEDA + 0.8);

    // 2 · Handyx: una foto, precio visible, el profesional sin comisión y con herramientas
    tl.to($('.cB'), { opacity: 0.4, duration: 0.4, ease: 'power1.out' }, M[2]!);
    cab('.cC', 6.95);
    tl.fromTo($('.cC .dev'), { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(2)' }, 7.25);
    tl.fromTo($('.rC'), { strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: T_C.dur, ease: 'power1.inOut' }, T_C.ruta);
    llenar('.cC', T_C.est);
    ests('.cC').forEach((e, i) => tl.fromTo(e.querySelector('.ic'), { rotation: -40, scale: 0.4 }, { rotation: 0, scale: 1, duration: 0.4, ease: 'back.out(2.6)' }, (T_C.est[i] ?? 0) + 0.08));

    // 3 · El diferencial: se van las otras rutas; la tesis y el camino de vuelta cierran el circuito
    tl.to([$('.cA'), $('.cB')], { autoAlpha: 0, y: -18, duration: 0.38, ease: 'power2.in', stagger: 0.06 }, M[3]!);
    tl.fromTo($('.tesis .k2'), { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: 'power3.out' }, 11.05);
    entraTitulo(tl, $.all('.tesis .l > span'), 11.12, 0.12);
    tl.fromTo($('.tesis .s'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 11.45);
    tl.fromTo($('.rV'), { strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: T_V.dur, ease: 'power1.inOut' }, T_V.ruta);
    tl.fromTo($('.punta'), { autoAlpha: 0, x: 24, scale: 0.4 }, { autoAlpha: 1, x: 0, scale: 1, duration: 0.3, ease: 'back.out(2.4)' }, T_V.ruta + T_V.dur - 0.08);
    tl.fromTo($('.ch-v'), { autoAlpha: 0, scale: 0.6, xPercent: -50, yPercent: -50 }, { autoAlpha: 1, scale: 1, xPercent: -50, yPercent: -50, duration: 0.45, ease: 'back.out(2)' }, 11.95);
    tl.fromTo($('.ch-v .ic'), { rotation: -180 }, { rotation: 0, duration: 0.6, ease: 'power3.out' }, 12.05);
    ests('.cC').forEach((e, i) => {
      const b = e.querySelector('.brillo');
      tl.fromTo(b, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power1.out' }, 12.55 + i * 0.18);
      tl.to(b, { opacity: 0, duration: 0.4, ease: 'power1.in' }, 12.85 + i * 0.18);
    });

    // Poses (pintor: valen también en los saltos). Foco: entra, saluda, pregunta en grupos y espera; recibe propuestas;
    // saca la foto y festeja el precio visible; vuelve. Llave: saluda, paga la comisión, festeja el 0 % y el circuito.
    const foco = $('.foco .pj');
    const llave = $('.llave .pj');
    let pf: Pose | '' = '';
    let pl: Pose | '' = '';
    c.pintor((t) => {
      const f: Pose = t >= 12.6 ? 'c' : t >= 11.7 ? 'b' : t >= 8.05 ? 'c' : t >= 7.45 ? 'd' : t >= 5.1 ? 'a' : t >= 4.0 ? 'b' : t >= 1.8 ? 'a' : t >= 1.25 ? 'd' : t >= 0.8 ? 'b' : 'd';
      const l: Pose = t >= 12.6 ? 'c' : t >= 11.6 ? 'b' : t >= 8.6 ? 'c' : t >= 6.8 ? 'a' : t >= MONEDA ? 'd' : t >= 1.3 ? 'a' : 'b';
      if (f !== pf) pose(foco, (pf = f));
      if (l !== pl) pose(llave, (pl = l));
    });
  },
  ambiente(t, $, tl) {
    // Pulsos que fluyen por la ruta de Handyx y por el camino de vuelta, solo sobre lo ya dibujado
    const fluir = (sel: string, r: Ruta, t0: number, dur: number, vel: number) => {
      const f = tramo(tl, t0, t0 + dur);
      const ps = $.all(`${sel} circle`);
      ps.forEach((p, k) => {
        const s = (t * vel + (k * r.largo) / ps.length) % r.largo;
        const [x, y] = r.en(s);
        p.setAttribute('cx', x.toFixed(1));
        p.setAttribute('cy', y.toFixed(1));
        p.style.opacity = f > 0 && s <= f * r.largo ? '0.95' : '0';
      });
    };
    fluir('.pC', RC, T_C.ruta, T_C.dur, 150);
    fluir('.pV', VUELTA, T_V.ruta, T_V.dur, 120);
    // Respiración de los personajes y la duda que flota
    $.all('.mov .pj').forEach((p, i) => (p.style.transform = `scaleY(${1 + Math.sin(t * 2.4 + i * 1.3) * 0.02})`));
    $('.duda .nube').style.transform = `translateY(${Math.sin(t * 1.7) * 5}px) rotate(${Math.sin(t * 1.1) * 4}deg)`;
  },
});
