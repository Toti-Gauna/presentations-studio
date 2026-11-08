// Anexo de respaldo · De dónde sale el número (proyección del primer trimestre). Un golpe por paso:
// 0 «El mercado» → los tres datos de entrada (hogares, arreglos por año, ticket supuesto) caen en la boca del embudo y
//   arriba se lee el valor anual de los arreglos del hogar ·
// 1 «Del año a los trabajos del trimestre» → el embudo se angosta: el objetivo de un trimestre y por el pico salen los
//   trabajos, entre Foco (vecino) y Llave (especialista) ·
// 2 «Con el ticket real» → los trabajos pasan a la tarifa Handyx y una balanza cuelga el cartel del ticket real de la
//   prueba: tarifas del trimestre ·
// 3 «Escenario conservador» → del otro lado se cuelga el ticket supuesto; la balanza casi se nivela (el real pesa un poco más).
// Forma distinta de la diapositiva 5 (allá, cadena de bloques): acá embudo y balanza. Todo número sale de una afirmación.
// La franja y 880–950 queda libre (leyenda del kit) y la de abajo (y > 960), para subtítulos.
import { COLOR, entraTitulo, escena, pose, type Pose } from './comun/kit.ts';

type P = [number, number];
const MARCAS = [0, 3.4, 6.8, 10.2, 13.6];

// ——— Embudo (izquierda) ———
const CX = 516; // eje del embudo
const BA = { y: 300, h: 128, arriba: 840, abajo: 704 }; // boca: el mercado anual
const BC = { y: 444, h: 104, arriba: 660, abajo: 424 }; // el objetivo del trimestre
const PICO = { y: BC.y + BC.h, h: 44, w: 112 };
const SALIDA = { y: 648 }; // número de trabajos
const T_GOTAS = 4.05; // empiezan a caer trabajos por el pico

// ——— Balanza (derecha) ———
const BX = 1400; // eje de la balanza
const PIVOTE: P = [BX, 300];
const BRAZO = 245; // medio brazo
const CUERDA = 70;
const CARTEL = { w: 350, h: 262 };
const BASE = { y: 712, w: 404, h: 92 };
const T_COLGAR1 = 7.75; // se cuelga el ticket real
const T_COLGAR2 = 10.6; // se cuelga el ticket supuesto
const INCL1 = -10.5; // grados: solo el real (izquierda abajo)
const INCL2 = -3.2; // los dos: casi parejo (el real pesa un poco más)

/** Trapecio centrado con esquinas redondeadas (ancho arriba a, abajo b, alto h). */
function trapecio(a: number, b: number, h: number, r: number): { d: string; w: number } {
  const w = Math.max(a, b);
  const p: P[] = [
    [(w - a) / 2, 0],
    [(w + a) / 2, 0],
    [(w + b) / 2, h],
    [(w - b) / 2, h],
  ];
  let d = '';
  p.forEach((q, i) => {
    const prev = p[(i + 3) % 4]!;
    const next = p[(i + 1) % 4]!;
    const u = (o: P): P => {
      const l = Math.hypot(o[0] - q[0], o[1] - q[1]) || 1;
      return [q[0] + ((o[0] - q[0]) / l) * r, q[1] + ((o[1] - q[1]) / l) * r];
    };
    const a1 = u(prev);
    const a2 = u(next);
    d += `${i ? 'L' : 'M'}${a1[0].toFixed(1)} ${a1[1].toFixed(1)}Q${q[0]} ${q[1]} ${a2[0].toFixed(1)} ${a2[1].toFixed(1)}`;
  });
  return { d: `${d}Z`, w };
}

/** Inclinación del brazo (grados) en el tiempo t: se asienta con una oscilación amortiguada cada vez que se cuelga algo. */
function inclinacion(t: number): number {
  const asienta = (desde: number, hasta: number, s: number) => hasta + (desde - hasta) * Math.exp(-3.4 * s) * Math.cos(7.2 * s);
  if (t < T_COLGAR1) return 0;
  if (t < T_COLGAR2) return asienta(0, INCL1, t - T_COLGAR1);
  return asienta(asienta(0, INCL1, T_COLGAR2 - T_COLGAR1), INCL2, t - T_COLGAR2);
}

/** «≈ USD 97.000» → prefijo chico y número grande (si el formato no coincide, va entero). */
function partir(cifra: string): { pre: string; num: string } {
  const m = /^(≈\s*)?(USD)\s+(.+)$/.exec(cifra);
  return m ? { pre: `${m[1] ?? ''}${m[2]}`, num: m[3] ?? '' } : { pre: '', num: cifra };
}

export default escena({
  marcas: MARCAS,
  leyendas: ['El mercado: **arreglos del hogar por año**', 'Del año a **los trabajos del trimestre**', 'Con el **ticket real** de nuestra prueba', 'Escenario **conservador**: ticket supuesto'],
  css: `
    .fondo { position: absolute; inset: 0; background: #EEF0F6; }
    .halo { position: absolute; left: 980px; top: 520px; width: 1500px; height: 1500px; margin: -750px 0 0 -750px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,.85), rgba(255,255,255,0) 62%); }
    .encabezado { position: absolute; left: 96px; top: 50px; }
    .krow { display: flex; align-items: center; gap: 18px; }
    .rotulo { display: inline-flex; align-items: center; padding: 5px 14px; border-radius: 999px; border: 2px dashed rgba(31,87,168,.5); background: #fff; font-weight: 700; font-size: 20px; color: ${COLOR.azulOscuro}; white-space: nowrap; }
    .encabezado .titulo { margin-top: 10px; font-size: 60px; color: ${COLOR.azulOscuro}; }

    /* Datos de entrada */
    .entradas { position: absolute; left: ${CX - BA.arriba / 2}px; top: 204px; width: ${BA.arriba}px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .dato { position: relative; display: flex; align-items: center; gap: 12px; height: 74px; padding: 0 16px 0 14px; border-radius: 20px; background: #fff; box-shadow: 0 10px 22px rgba(14,29,54,.10), 0 4px 0 #DCE2EC; white-space: nowrap; }
    .dato .badge { position: absolute; right: 14px; top: -21px; padding: 1px 12px; border-radius: 999px; background: #FCE6C4; color: #8A5200; font-style: normal; font-size: 20px; font-weight: 800; line-height: 1.3; box-shadow: 0 0 0 3px #EEF0F6; }
    .dato .op { font-family: var(--fuente-titulos, sans-serif); font-weight: 900; font-size: 30px; color: ${COLOR.azul}; }
    .dato .ic { flex: none; display: grid; place-items: center; width: 48px; height: 48px; border-radius: 14px; background: ${COLOR.celeste}; }
    .dato .ic .icono { width: 28px; height: 28px; }
    .dato .v { font-size: 30px; color: ${COLOR.noche}; line-height: 1; }
    .dato .l { margin-top: 5px; font-size: 20px; font-weight: 700; color: ${COLOR.suave}; line-height: 1; }
    .dato.sup { background: #FFF6E0; box-shadow: 0 10px 22px rgba(14,29,54,.08), 0 4px 0 #EBCB86; }
    .dato.sup .ic { background: #FCE6C4; }
    .dato.sup .l { color: #8A5200; }
    .caida { position: absolute; width: 14px; height: 14px; margin: -7px 0 0 -7px; border-radius: 50%; background: ${COLOR.azul}; opacity: 0; }

    /* Embudo */
    .banda { position: absolute; }
    .banda svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
    .banda .txt { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
    .bA svg { filter: drop-shadow(0 16px 26px rgba(14,29,54,.13)); }
    .bA path { fill: #fff; }
    .bA .n { font-size: 58px; color: ${COLOR.azulOscuro}; white-space: nowrap; line-height: 1; }
    .bA .n small { font-family: var(--fuente-texto, sans-serif); font-weight: 800; font-stretch: 100%; font-size: 28px; letter-spacing: 0; color: ${COLOR.noche}; }
    .bA .s { margin-top: 10px; font-size: 22px; font-weight: 700; color: ${COLOR.suave}; white-space: nowrap; }
    .bC svg { filter: drop-shadow(0 14px 22px rgba(19,48,94,.22)); }
    .bC path { fill: ${COLOR.azul}; }
    .bC .linea { display: flex; align-items: center; gap: 12px; color: #fff; font-size: 28px; font-weight: 700; white-space: nowrap; }
    .bC .linea b { font-size: 46px; color: ${COLOR.amarillo}; }
    .tag { display: inline-block; padding: 3px 12px; border-radius: 999px; font-style: normal; font-size: 20px; font-weight: 800; white-space: nowrap; }
    .tag.obj { background: ${COLOR.amarillo}; color: ${COLOR.noche}; }
    .pico { position: absolute; left: ${CX - PICO.w / 2}px; top: ${PICO.y - 2}px; width: ${PICO.w}px; height: ${PICO.h}px; border-radius: 0 0 22px 22px; background: ${COLOR.azulOscuro}; transform-origin: 50% 0; }
    .gota { position: absolute; left: ${CX}px; width: 16px; height: 16px; margin-left: -8px; border-radius: 50%; background: ${COLOR.azul}; opacity: 0; }
    .salida { position: absolute; left: ${CX - 300}px; top: ${SALIDA.y}px; width: 600px; text-align: center; }
    .salida .n { font-size: 84px; color: ${COLOR.azulOscuro}; line-height: 1; white-space: nowrap; }
    .salida .l { margin-top: 8px; font-size: 28px; font-weight: 800; color: ${COLOR.noche}; }

    /* Handys: el contenedor .mov lo mueve la línea de tiempo; el .pj de adentro respira (ambiente) */
    .mov { position: absolute; transform-origin: 50% 100%; }
    .pj { transform-origin: 50% 100%; }

    /* Conector y balanza */
    .conector { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; overflow: visible; }
    .conector path { fill: none; stroke: #B9C6DC; stroke-width: 5; stroke-linecap: round; stroke-dasharray: 1000 1000; stroke-dashoffset: 1000; }
    .conector .punta { fill: #B9C6DC; stroke: none; stroke-dasharray: none; }
    .poste { position: absolute; left: ${BX - 12}px; top: ${PIVOTE[1]}px; width: 24px; height: ${BASE.y - PIVOTE[1]}px; border-radius: 12px; background: ${COLOR.azulOscuro}; transform-origin: 50% 100%; }
    .base { position: absolute; left: ${BX - BASE.w / 2}px; top: ${BASE.y}px; width: ${BASE.w}px; height: ${BASE.h}px; border-radius: 24px; background: #fff; box-shadow: 0 14px 28px rgba(14,29,54,.13), 0 5px 0 #DCE2EC; display: flex; align-items: center; justify-content: center; gap: 14px; white-space: nowrap; }
    .base .x { display: grid; place-items: center; width: 50px; height: 50px; border-radius: 50%; background: ${COLOR.azul}; color: #fff; font-size: 30px; font-weight: 800; line-height: 1; }
    .base .v { font-size: 46px; color: ${COLOR.noche}; line-height: 1; }
    .base .l { font-size: 24px; font-weight: 800; color: ${COLOR.suave}; line-height: 1.1; text-align: left; }
    .brazo { position: absolute; left: ${PIVOTE[0]}px; top: ${PIVOTE[1]}px; width: 0; height: 0; }
    .viga { position: absolute; left: ${-BRAZO - 14}px; top: -9px; width: ${BRAZO * 2 + 28}px; height: 18px; border-radius: 9px; background: ${COLOR.noche}; }
    .gancho { position: absolute; top: -12px; width: 24px; height: 24px; margin-left: -12px; border-radius: 50%; background: ${COLOR.amarillo}; border: 5px solid ${COLOR.noche}; }
    .eje { position: absolute; left: ${PIVOTE[0] - 30}px; top: ${PIVOTE[1] - 30}px; width: 60px; height: 60px; border-radius: 50%; background: ${COLOR.amarillo}; border: 7px solid ${COLOR.noche}; box-shadow: 0 6px 14px rgba(14,29,54,.25); }
    .eje::after { content: ''; position: absolute; left: 12px; top: 12px; width: 22px; height: 22px; border-radius: 50%; background: #fff; }
    .cuelga { position: absolute; left: 0; top: 0; width: 0; height: 0; }
    .cuerda { position: absolute; left: ${-CARTEL.w / 2}px; top: 0; width: ${CARTEL.w}px; height: ${CUERDA + 6}px; overflow: visible; }
    .cuerda path { fill: none; stroke: #8E9BB3; stroke-width: 4; stroke-linecap: round; stroke-linejoin: round; }
    .cartel { position: absolute; left: ${-CARTEL.w / 2}px; top: ${CUERDA}px; width: ${CARTEL.w}px; height: ${CARTEL.h}px; border-radius: 26px; padding: 22px 26px 0; }
    .cartel .k { display: flex; align-items: center; gap: 10px; height: 30px; font-size: 20px; font-weight: 800; letter-spacing: .07em; text-transform: uppercase; white-space: nowrap; }
    .cartel .tk { margin-top: 4px; font-size: 27px; font-weight: 800; white-space: nowrap; }
    .cartel .raya { margin: 14px 0 10px; height: 2px; border-radius: 1px; }
    .cartel .pre { font-size: 22px; font-weight: 800; line-height: 1; }
    .cartel .n { margin-top: 4px; font-size: 62px; line-height: .95; white-space: nowrap; }
    .cartel .pie { margin-top: 8px; font-size: 21px; font-weight: 700; white-space: nowrap; }
    .lado-real .cartel { background: ${COLOR.azul}; color: #fff; box-shadow: 0 18px 34px rgba(19,48,94,.28), 0 6px 0 ${COLOR.azulOscuro}; }
    .lado-real .k { color: ${COLOR.amarillo}; }
    .lado-real .raya { background: rgba(255,255,255,.22); }
    .lado-real .pre, .lado-real .pie { color: #D7E3F7; }
    .lado-sup .cartel { background: #fff; color: ${COLOR.noche}; box-shadow: 0 18px 34px rgba(14,29,54,.16), 0 6px 0 #EBCB86; }
    .lado-sup .k { color: #8A5200; }
    .lado-sup .tk { display: flex; align-items: center; gap: 12px; }
    .lado-sup .tk .tag { background: #FCE6C4; color: #8A5200; }
    .lado-sup .raya { background: ${COLOR.borde}; }
    .lado-sup .n { color: ${COLOR.azulOscuro}; }
    .lado-sup .pre, .lado-sup .pie { color: ${COLOR.suave}; }
  `,
  html: (c) => {
    const a = trapecio(BA.arriba, BA.abajo, BA.h, 22);
    const cc = trapecio(BC.arriba, BC.abajo, BC.h, 20);
    const banda = (cls: string, b: { y: number; h: number }, tz: { d: string; w: number }, txt: string) =>
      `<div class="banda ${cls}" style="left:${CX - tz.w / 2}px;top:${b.y}px;width:${tz.w}px;height:${b.h}px"><svg viewBox="0 0 ${tz.w} ${b.h}"><path d="${tz.d}"/></svg><div class="txt">${txt}</div></div>`;
    const handy = (cls: string, nombre: Parameters<typeof c.pj>[0], x: number, pies: number, alto: number) =>
      `<div class="mov ${cls}" style="left:${x - alto / 2}px;top:${pies - alto}px;width:${alto}px;height:${alto}px">${c.pj(nombre, '', alto)}</div>`;
    const sup = partir(c.cifra('Q1-TARIFAS-40'));
    const cuerda = `<svg class="cuerda" viewBox="0 0 ${CARTEL.w} ${CUERDA + 6}"><path d="M${CARTEL.w / 2 - 120} ${CUERDA + 4} L${CARTEL.w / 2} 0 L${CARTEL.w / 2 + 120} ${CUERDA + 4}"/></svg>`;
    // Conector: de la salida del embudo a la base de la balanza (pasa bajo los pies de Llave)
    const yc = BASE.y + BASE.h - 20;
    const xf = BX - BASE.w / 2 - 22;
    const conector = `M${CX + 200} ${yc} H${xf}`;
    return `
    <div class="fondo"></div><div class="halo"></div>
    <div class="encabezado">
      <div class="krow"><span class="kicker">Respaldo · proyección</span><span class="rotulo">Proyección · supuestos a validar</span></div>
      <div class="titulo t"><span class="l"><span>De dónde sale <mark>el número</mark></span></span></div>
    </div>

    <div class="entradas">
      <div class="dato"><span class="ic">${c.icono('casa')}</span><div><div class="v t">${c.cifra('MDP-HOGARES')}</div><div class="l">hogares · Censo 2022</div></div></div>
      <div class="dato sup"><span class="op">×</span><div><div class="v t">${c.cifra('SUP-ARREGLOS-HOGAR')}</div><div class="l">arreglo por año</div></div><em class="badge">supuesto</em></div>
      <div class="dato sup"><span class="op">×</span><div><div class="v t">${c.cifra('SUP-TICKET-USD')}</div><div class="l">de ticket medio</div></div><em class="badge">supuesto</em></div>
    </div>
    <i class="caida"></i><i class="caida"></i><i class="caida"></i>

    ${banda('bA', BA, a, `<div class="n t">${c.cifra('MERCADO-USD')} <small>por año</small></div><div class="s">arreglos del hogar en General Pueyrredon</div>`)}
    ${banda('bC', BC, cc, `<div class="linea"><b class="t">${c.cifra('META-CUOTA-LOCAL')}</b><span>de un trimestre</span><em class="tag obj">objetivo</em></div>`)}
    <div class="pico"></div>
    ${'<i class="gota"></i>'.repeat(5)}
    <div class="salida"><div class="n t">0</div><div class="l">trabajos en el trimestre</div></div>
    ${handy('h-foco', 'bombilla', CX - 318, SALIDA.y + 124, 116)}
    ${handy('h-llave', 'llave', CX + 362, SALIDA.y + 124, 112)}

    <svg class="conector" viewBox="0 0 1920 1080"><path d="${conector}" pathLength="1000"/><path class="punta" d="M${xf - 2} ${yc - 13} L${xf + 18} ${yc} L${xf - 2} ${yc + 13} Z"/></svg>
    <div class="poste"></div>
    <div class="base"><span class="x">×</span><span class="v t">${c.cifra('TARIFA-USUARIO')}</span><span class="l">de tarifa<br>Handyx</span></div>
    <div class="brazo"><div class="viga"></div><i class="gancho" style="left:${-BRAZO}px"></i><i class="gancho" style="left:${BRAZO}px"></i></div>
    <div class="cuelga lado-real">${cuerda}<div class="cartel">
      <div class="k">Ticket real de la prueba</div>
      <div class="tk">${c.cifra('PRUEBA-TICKET')} ${c.cifra('PRUEBA-TICKET-USD')}</div>
      <div class="raya"></div>
      <div class="pre">≈ USD</div><div class="n t">0</div>
      <div class="pie">de tarifas en el trimestre</div></div></div>
    <div class="cuelga lado-sup">${cuerda}<div class="cartel">
      <div class="k">Ticket supuesto</div>
      <div class="tk">${c.cifra('SUP-TICKET-USD')} <em class="tag">conservador</em></div>
      <div class="raya"></div>
      <div class="res"><div class="pre">${sup.pre}</div><div class="n t">${sup.num}</div></div>
      <div class="pie">de tarifas en el trimestre</div></div></div>
    <div class="eje"></div>
    ${handy('h-eng', 'engranaje', BX + 300, BASE.y + BASE.h, 108)}
  `;
  },
  armar(tl, $, c) {
    // 0 · título, datos de entrada y la boca del embudo (el mercado anual)
    tl.fromTo($('.halo'), { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 1.2, ease: 'power2.out' }, 0);
    tl.fromTo($('.krow'), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0);
    entraTitulo(tl, $.all('.encabezado .l > span'), 0.1);
    tl.fromTo($.all('.dato'), { autoAlpha: 0, y: -40, scale: 0.85 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(2)', stagger: 0.14 }, 0.45);
    // Una gota cae de cada dato a la boca del embudo
    $.all('.caida').forEach((g, i) => {
      const x = CX + (i - 1) * 270;
      tl.fromTo(g, { left: x, top: 280, autoAlpha: 0 }, { left: x, top: BA.y + 40, autoAlpha: 1, duration: 0.32, ease: 'power2.in' }, 1.15 + i * 0.12);
      tl.to(g, { autoAlpha: 0, duration: 0.12 }, 1.47 + i * 0.12);
    });
    tl.fromTo($('.bA'), { autoAlpha: 0, scaleY: 0.2, transformOrigin: '50% 0%' }, { autoAlpha: 1, scaleY: 1, duration: 0.55, ease: 'back.out(1.6)' }, 1.1);
    tl.fromTo($('.bA .n'), { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, 1.6);
    tl.fromTo($('.bA .s'), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 1.85);

    // 1 · el embudo se angosta: objetivo del trimestre, pico y trabajos
    tl.fromTo($('.bC'), { autoAlpha: 0, scaleY: 0.2, transformOrigin: '50% 0%' }, { autoAlpha: 1, scaleY: 1, duration: 0.5, ease: 'back.out(1.6)' }, 3.5);
    tl.fromTo($('.bC .linea'), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 3.8);
    tl.fromTo($('.pico'), { scaleY: 0 }, { scaleY: 1, duration: 0.3, ease: 'power2.out' }, 3.9);
    tl.fromTo($('.salida'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' }, 4.2);
    c.contador($('.salida .n'), { t0: 4.3, dur: 1.4, hasta: c.valor('Q1-TRABAJOS-N') ?? 0, antes: '≈ ' });

    // 2 · los trabajos van a la tarifa; la balanza cuelga el ticket real
    tl.fromTo($('.conector path:not(.punta)'), { strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: 0.6, ease: 'power1.inOut' }, 6.85);
    tl.fromTo($('.conector .punta'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 }, 7.4);
    tl.fromTo($('.base'), { autoAlpha: 0, y: 30, scale: 0.85 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(2)' }, 7.0);
    tl.fromTo($('.poste'), { scaleY: 0 }, { scaleY: 1, duration: 0.4, ease: 'power3.out' }, 7.1);
    tl.fromTo($('.viga'), { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: 'back.out(1.4)' }, 7.3);
    tl.fromTo($.all('.gancho'), { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'back.out(2.5)' }, 7.45);
    tl.fromTo($('.eje'), { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(2.5)' }, 7.35);
    tl.fromTo($('.lado-real'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 }, T_COLGAR1 - 0.4);
    tl.fromTo([$('.lado-real .cartel'), $('.lado-real .cuerda')], { y: -90 }, { y: 0, duration: 0.4, ease: 'power2.in' }, T_COLGAR1 - 0.4);
    tl.fromTo($('.lado-real .n'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, T_COLGAR1 + 0.05);
    c.contador($('.lado-real .n'), { t0: T_COLGAR1 + 0.15, dur: 1.3, hasta: c.valor('Q1-TARIFAS-REAL-N') ?? 0 });

    // 3 · se cuelga el ticket supuesto: escenario conservador
    tl.fromTo($('.lado-sup'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 }, T_COLGAR2 - 0.4);
    tl.fromTo([$('.lado-sup .cartel'), $('.lado-sup .cuerda')], { y: -90 }, { y: 0, duration: 0.4, ease: 'power2.in' }, T_COLGAR2 - 0.4);
    tl.fromTo($('.lado-sup .res'), { autoAlpha: 0, scale: 0.7, transformOrigin: '0% 70%' }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(2.2)' }, T_COLGAR2 + 0.25);
    tl.fromTo($('.lado-sup .tk .tag'), { autoAlpha: 0, scale: 0.4, rotation: -8 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.4, ease: 'back.out(2.6)' }, T_COLGAR2 + 0.6);

    // La balanza: el brazo y los carteles colgados siguen la inclinación (dueño: este pintor)
    const brazo = $('.brazo');
    const cuelgan = [$('.lado-real'), $('.lado-sup')];
    c.pintor((t) => {
      const g = inclinacion(t);
      brazo.style.transform = `rotate(${g.toFixed(3)}deg)`;
      const r = (g * Math.PI) / 180;
      cuelgan.forEach((el, i) => {
        const lado = i === 0 ? -1 : 1;
        const x = PIVOTE[0] + lado * BRAZO * Math.cos(r);
        const y = PIVOTE[1] + lado * BRAZO * Math.sin(r);
        el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      });
    });

    // Handys: entran saltando y reaccionan con sus poses
    const salta = (el: HTMLElement, t: number) => tl.fromTo(el, { autoAlpha: 0, y: 46, scale: 0.6 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(2.2)' }, t);
    salta($('.h-foco'), 0.75);
    salta($('.h-llave'), 4.15);
    salta($('.h-eng'), 7.25);
    const poser = (el: HTMLElement) => {
      let ultima = '';
      return (p: Pose) => {
        if (p !== ultima) {
          ultima = p;
          pose(el, p);
        }
      };
    };
    const foco = poser($('.h-foco .pj'));
    const llave = poser($('.h-llave .pj'));
    const eng = poser($('.h-eng .pj'));
    const listoTrabajos = 5.7;
    const listoReal = T_COLGAR1 + 1.45;
    c.pintor((t) => {
      foco(t >= T_COLGAR2 + 0.3 ? 'b' : t >= listoTrabajos ? 'c' : t >= 0.9 && t < 3.4 ? 'b' : 'a');
      llave(t >= T_COLGAR2 + 0.3 ? 'b' : t >= listoTrabajos ? 'c' : 'd');
      eng(t >= T_COLGAR2 + 0.3 ? 'b' : t >= listoReal ? 'c' : 'd');
    });
  },
  ambiente(t, $, tl) {
    // Respiración de los Handys (dueño: el ambiente; las entradas mueven el contenedor)
    $.all('.pj').forEach((p, i) => (p.style.transform = `scaleY(${(1 + Math.sin(t * 2.4 + i) * 0.02).toFixed(4)})`));
    // Trabajos que caen por el pico (dueño: el ambiente), solo después de que el pico apareció
    const on = tl >= T_GOTAS;
    $.all('.gota').forEach((g, i) => {
      const k = (t * 0.9 + i / 5) % 1;
      g.style.top = `${(PICO.y + PICO.h - 10 + k * 70).toFixed(1)}px`;
      g.style.opacity = on ? (k < 0.15 ? k / 0.15 : 1 - (k - 0.15) / 0.85).toFixed(2) : '0';
    });
  },
});
