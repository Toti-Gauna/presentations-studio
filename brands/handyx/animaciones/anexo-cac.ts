// Anexo de respaldo · CAC y LTV. Un golpe por paso:
// 0 «Conseguir un cliente» → la barra corta del CAC estimado (marketing del mes ÷ clientes nuevos, supuesto) y Foco, el
//   cliente nuevo, se sube a ella ·
// 1 «Lo que deja con los años» → la barra del LTV crece año por año (una tarifa por arreglo) y Foco la recorre ·
// 2 «Deja mucho más de lo que cuesta» → una regla de bloques del largo del CAC cubre el largo del LTV, uno por vez, mientras
//   cuenta la relación LTV / CAC; Llave (especialista) llega a la punta y festeja ·
// 3 «Se recupera con el primer trabajo» → el CAC máximo (contorno punteado) mide lo mismo que la tarifa del primer año.
// Las dos barras usan la misma escala. Todo número sale de una afirmación. La franja y 880–950 queda libre (leyenda del kit)
// y la de abajo (y > 960), para subtítulos.
import { COLOR, entraTitulo, escena, pose, tramo, type Pose } from './comun/kit.ts';

const MARCAS = [0, 3.2, 6.6, 9.8, 13.0];
const X0 = 470; // comienzo de las barras
const LARGO = 1296; // largo de la barra del LTV
const CAC = { y: 300, h: 56 };
const LTV = { y: 496, h: 80 };
const REGLA = { y: 712, h: 38 };
const ALTO_FOCO = 92;
const T_ANIO = (i: number) => 3.45 + i * 0.85; // cada año del LTV aparece
const T_SELLO = (i: number) => 6.95 + i * 0.14; // cada CAC de la regla
const T_MAX = 10.0;

export default escena({
  marcas: MARCAS,
  leyendas: ['Lo que cuesta **conseguir un cliente**', 'Lo que **deja ese cliente** con los años', 'Deja **mucho más** de lo que cuesta', 'Se recupera con **el primer trabajo**'],
  css: `
    .fondo { position: absolute; inset: 0; background: #EEF0F6; }
    .halo { position: absolute; left: 1100px; top: 520px; width: 1600px; height: 1600px; margin: -800px 0 0 -800px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,.85), rgba(255,255,255,0) 62%); }
    .encabezado { position: absolute; left: 96px; top: 50px; }
    .krow { display: flex; align-items: center; gap: 18px; }
    .rotulo { display: inline-flex; align-items: center; padding: 5px 14px; border-radius: 999px; border: 2px dashed rgba(31,87,168,.5); background: #fff; font-weight: 700; font-size: 20px; color: ${COLOR.azulOscuro}; white-space: nowrap; }
    .encabezado .titulo { margin-top: 10px; font-size: 60px; color: ${COLOR.azulOscuro}; }

    /* Rótulo de cada fila (izquierda) */
    .fila { position: absolute; left: 96px; width: 350px; display: flex; align-items: center; gap: 16px; transform: translateY(-50%); }
    .fila .mos { flex: none; display: grid; place-items: center; width: 62px; height: 62px; border-radius: 18px; background: #fff; box-shadow: 0 6px 0 #D5DCE7, 0 12px 22px rgba(14,29,54,.08); }
    .fila .mos .icono { width: 32px; height: 32px; }
    .fila .n { font-size: 56px; line-height: 1; color: ${COLOR.noche}; white-space: nowrap; }
    .fila .l { margin-top: 6px; font-size: 22px; font-weight: 800; color: ${COLOR.suave}; white-space: nowrap; }
    .fila.ltv .n { color: ${COLOR.azulOscuro}; }

    /* Barras */
    .barra { position: absolute; left: ${X0}px; border-radius: 16px; transform-origin: 0 50%; }
    .b-cac { top: ${CAC.y}px; height: ${CAC.h}px; background: ${COLOR.naranja}; box-shadow: 0 5px 0 #C47F0E, 0 14px 26px rgba(14,29,54,.12); }
    .b-max { position: absolute; left: ${X0}px; top: ${CAC.y}px; height: ${CAC.h}px; border-radius: 16px; border: 4px dashed ${COLOR.naranja}; }
    .guia { position: absolute; top: ${CAC.y + CAC.h / 2 - 2}px; height: 0; border-top: 4px dotted #B9C6DC; transform-origin: 0 50%; }
    .max-l { position: absolute; left: ${X0}px; top: ${CAC.y + CAC.h + 18}px; display: inline-flex; align-items: center; gap: 12px; padding: 8px 20px 8px 10px; border-radius: 999px; background: #FFF3DC; color: #7A4A00; font-size: 23px; font-weight: 800; white-space: nowrap; box-shadow: 0 8px 18px rgba(14,29,54,.10); }
    .max-l b { display: grid; place-items: center; height: 38px; padding: 0 12px; border-radius: 999px; background: ${COLOR.naranja}; color: ${COLOR.noche}; font-family: var(--fuente-titulos, sans-serif); font-weight: 900; font-size: 24px; }
    .formula { position: absolute; left: ${X0}px; display: flex; align-items: center; gap: 10px; font-size: 22px; font-weight: 700; color: ${COLOR.suave}; white-space: nowrap; }
    .formula b { color: ${COLOR.noche}; font-weight: 800; }
    .tag { display: inline-block; padding: 2px 12px; border-radius: 999px; font-style: normal; font-size: 20px; font-weight: 800; background: #FCE6C4; color: #8A5200; }
    .anio { position: absolute; top: ${LTV.y}px; height: ${LTV.h}px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: ${COLOR.azul}; color: #fff; box-shadow: 0 7px 0 ${COLOR.azulOscuro}; }
    .anio.a1 { border-radius: 16px 0 0 16px; }
    .anio.ult { border-radius: 0 16px 16px 0; }
    .anio + .anio { border-left: 3px solid rgba(255,255,255,.55); }
    .anio .a { font-size: 20px; font-weight: 800; color: #CFDCF2; letter-spacing: .04em; }
    .anio .v { margin-top: 2px; font-size: 30px; line-height: 1; white-space: nowrap; }
    .anio.foco1 { box-shadow: inset 0 0 0 5px ${COLOR.naranja}, 0 7px 0 ${COLOR.azulOscuro}; }
    .regla { position: absolute; top: ${REGLA.y}px; height: ${REGLA.h}px; border-radius: 10px; background: ${COLOR.naranja}; box-shadow: 0 4px 0 #C47F0E, 0 10px 18px rgba(14,29,54,.10); }
    .fila.rel .mos { background: ${COLOR.amarillo}; box-shadow: 0 6px 0 #C9971E, 0 12px 22px rgba(14,29,54,.08); }
    .fila.rel .n { display: inline-block; padding: 0 .16em; border-radius: .12em; background: ${COLOR.amarillo}; }

    /* Handys: .salto lo mueve el pintor (recorrido de Foco), .mov la línea de tiempo y el .pj respira (ambiente) */
    .salto { position: absolute; left: 0; top: 0; }
    .mov { position: absolute; transform-origin: 50% 100%; }
    .pj { transform-origin: 50% 100%; }
  `,
  html: (c) => {
    const ltv = c.valor('LTV-ESTIMADO') ?? 0;
    const u = ltv > 0 ? LARGO / ltv : 0; // px por dólar (misma escala en las dos barras)
    const anios = Math.max(1, Math.round(c.valor('SUP-ANIOS-CLIENTE') ?? 1));
    const ancho = LARGO / anios;
    const veces = Math.max(1, Math.round(c.valor('LTV-CAC') ?? 1));
    const wCac = (c.valor('CAC-ESTIMADO') ?? 0) * u;
    const wMax = (c.valor('CAC-MAXIMO') ?? 0) * u;
    const handy = (cls: string, nombre: Parameters<typeof c.pj>[0], x: number, pies: number, alto: number) =>
      `<div class="mov ${cls}" style="left:${x - alto / 2}px;top:${pies - alto}px;width:${alto}px;height:${alto}px">${c.pj(nombre, '', alto)}</div>`;
    return `
    <div class="fondo"></div><div class="halo"></div>
    <div class="encabezado">
      <div class="krow"><span class="kicker">Respaldo · unit economics</span><span class="rotulo">Proyección · supuestos a validar</span></div>
      <div class="titulo t"><span class="l"><span>Un cliente cuesta <mark>menos de lo que deja</mark></span></span></div>
    </div>

    <div class="fila cac" style="top:${CAC.y + CAC.h / 2}px"><span class="mos">${c.icono('megafono')}</span><div><div class="n t">${c.cifra('CAC-ESTIMADO')}</div><div class="l">CAC estimado</div></div></div>
    <div class="b-max" style="width:${wMax.toFixed(1)}px"></div>
    <div class="barra b-cac" style="width:${wCac.toFixed(1)}px"></div>
    <i class="guia" style="left:${(X0 + wCac + 16).toFixed(1)}px;width:${(wMax - wCac + 6).toFixed(1)}px"></i>
    <div class="formula f-cac" style="left:${(X0 + wMax + 36).toFixed(1)}px;top:${CAC.y + CAC.h / 2}px;transform:translateY(-50%)">= <b>${c.cifra('COSTO-MARKETING')}</b> de marketing por mes ÷ <b>${c.cifra('SUP-CLIENTES-MES')}</b> clientes nuevos <em class="tag">supuesto</em></div>
    <div class="max-l"><b>${c.cifra('CAC-MAXIMO')}</b>CAC máximo: se recupera con el primer trabajo</div>

    <div class="fila ltv" style="top:${LTV.y + LTV.h / 2}px"><span class="mos">${c.icono('repetir')}</span><div><div class="n t">USD 0</div><div class="l">LTV estimado</div></div></div>
    ${Array.from({ length: anios }, (_, i) => `<div class="anio${i === anios - 1 ? ' ult' : ''}${i === 0 ? ' a1' : ''}" style="left:${(X0 + i * ancho).toFixed(1)}px;width:${ancho.toFixed(1)}px"><span class="a">AÑO ${i + 1}</span><span class="v t">+ ${c.cifra('INGRESO-POR-TRABAJO')}</span></div>`).join('')}
    <div class="formula f-ltv" style="top:${LTV.y + LTV.h + 22}px"><b>${c.cifra('INGRESO-POR-TRABAJO')}</b> por arreglo × <b>${c.cifra('SUP-ARREGLOS-HOGAR')}</b> arreglo por año × <b>${c.cifra('SUP-ANIOS-CLIENTE')}</b> años <em class="tag">supuestos</em></div>

    <div class="fila rel" style="top:${REGLA.y + REGLA.h / 2}px"><span class="mos">${c.icono('balanza')}</span><div><div class="n t">≈ 0</div><div class="l">veces · LTV / CAC</div></div></div>
    ${Array.from({ length: veces }, (_, i) => `<i class="regla" style="left:${(X0 + (i * LARGO) / veces + 3).toFixed(1)}px;width:${(LARGO / veces - 6).toFixed(1)}px"></i>`).join('')}
    ${handy('h-llave', 'llave', X0 + LARGO - 80, REGLA.y, 100)}
    <div class="salto">${handy('h-foco', 'bombilla', 0, 0, ALTO_FOCO)}</div>
  `;
  },
  armar(tl, $, c) {
    const ltv = c.valor('LTV-ESTIMADO') ?? 0;
    const anios = Math.max(1, Math.round(c.valor('SUP-ANIOS-CLIENTE') ?? 1));
    const veces = Math.max(1, Math.round(c.valor('LTV-CAC') ?? 1));
    const u = ltv > 0 ? LARGO / ltv : 0;
    const wCac = (c.valor('CAC-ESTIMADO') ?? 0) * u;
    const wMax = (c.valor('CAC-MAXIMO') ?? 0) * u;
    const ancho = LARGO / anios;

    // 0 · título y el CAC
    tl.fromTo($('.halo'), { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 1.2, ease: 'power2.out' }, 0);
    tl.fromTo($('.krow'), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0);
    entraTitulo(tl, $.all('.encabezado .l > span'), 0.1);
    tl.fromTo($('.fila.cac'), { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.45, ease: 'power3.out' }, 0.6);
    tl.fromTo($('.b-cac'), { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'back.out(1.6)' }, 0.85);
    tl.fromTo($('.guia'), { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: 'power2.out' }, 1.25);
    tl.fromTo($('.f-cac'), { autoAlpha: 0, x: -16 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: 'power2.out' }, 1.45);
    tl.fromTo($('.f-cac .tag'), { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(2.4)' }, 1.85);

    // 1 · el LTV crece año por año (el número sube de a una tarifa)
    tl.fromTo($('.fila.ltv'), { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.45, ease: 'power3.out' }, 3.3);
    $.all('.anio').forEach((el, i) => {
      tl.fromTo(el, { clipPath: 'inset(0% 100% -12px 0%)' }, { clipPath: 'inset(0% 0% -12px 0%)', duration: 0.45, ease: 'power3.out' }, T_ANIO(i));
      tl.fromTo(el.children, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out', stagger: 0.05 }, T_ANIO(i) + 0.2);
    });
    tl.fromTo($('.f-ltv'), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, T_ANIO(anios - 1) + 0.45);
    const nLtv = $('.fila.ltv .n');
    c.pintor((t) => {
      let k = 0;
      for (let i = 0; i < anios; i++) if (t >= T_ANIO(i) + 0.3) k = i + 1;
      nLtv.textContent = `USD ${Math.round((ltv * k) / anios).toLocaleString('es-AR')}`;
    });

    // 2 · el CAC se estampa a lo largo del LTV y cuenta la relación
    tl.fromTo($('.fila.rel'), { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.45, ease: 'power3.out' }, 6.7);
    $.all('.regla').forEach((el, i) => tl.fromTo(el, { autoAlpha: 0, scaleX: 0.2, transformOrigin: '0% 50%' }, { autoAlpha: 1, scaleX: 1, duration: 0.24, ease: 'back.out(2)' }, T_SELLO(i)));
    const nRel = $('.fila.rel .n');
    c.pintor((t) => {
      let k = 0;
      for (let i = 0; i < veces; i++) if (t >= T_SELLO(i) + 0.1) k = i + 1;
      nRel.textContent = `≈ ${k}`;
    });

    // 3 · el CAC máximo mide lo mismo que la tarifa del primer año
    tl.to($('.guia'), { autoAlpha: 0, duration: 0.2 }, T_MAX);
    const resto = (100 * (1 - wCac / Math.max(1, wMax))).toFixed(1);
    tl.fromTo($('.b-max'), { autoAlpha: 0, clipPath: `inset(0% ${resto}% 0% 0%)` }, { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'power3.out' }, T_MAX);
    tl.fromTo($('.max-l'), { autoAlpha: 0, y: -12 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' }, T_MAX + 0.5);
    const a1 = $('.anio.a1');
    c.pintor((t) => a1.classList.toggle('foco1', t >= T_MAX + 0.45));

    // Foco: se sube a la barra del CAC y después recorre el LTV, un salto por año (dueño: este pintor)
    const salto = $('.salto');
    const puntos: Array<[number, number, number]> = [[X0 + wCac / 2, CAC.y, 0]]; // x, pies, desde
    for (let i = 0; i < anios; i++) puntos.push([X0 + (i + 0.5) * ancho, LTV.y, T_ANIO(i) + 0.05]);
    c.pintor((t) => {
      let i = 0;
      while (i + 1 < puntos.length && t >= puntos[i + 1]![2]) i++;
      const [x1, y1] = puntos[i]!;
      let x = x1;
      let y = y1;
      if (i > 0) {
        const [x0, y0] = puntos[i - 1]!;
        const k = tramo(t, puntos[i]![2], puntos[i]![2] + 0.42);
        const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
        x = x0 + (x1 - x0) * e;
        y = y0 + (y1 - y0) * e - (i === 1 ? 40 : 34) * Math.sin(Math.PI * k);
      }
      salto.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    });

    // Handys: entradas y poses
    const salta = (el: HTMLElement, t: number) => tl.fromTo(el, { autoAlpha: 0, y: 40, scale: 0.6 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(2.2)' }, t);
    salta($('.h-foco'), 1.1);
    salta($('.h-llave'), T_SELLO(veces - 1) + 0.15);
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
    const listo = T_SELLO(veces - 1) + 0.35;
    c.pintor((t) => {
      const saltando = puntos.slice(1).some((p) => t >= p[2] && t < p[2] + 0.42);
      foco(t >= T_MAX + 0.5 ? 'b' : t >= listo ? 'c' : saltando ? 'd' : t >= 1.4 && t < 3.2 ? 'b' : 'a');
      llave(t >= T_MAX + 0.5 ? 'b' : t >= listo ? 'c' : 'a');
    });
  },
  ambiente(t, $) {
    // Respiración de los Handys (dueño: el ambiente; las entradas y los saltos mueven los contenedores)
    $.all('.pj').forEach((p, i) => (p.style.transform = `scaleY(${(1 + Math.sin(t * 2.4 + i) * 0.02).toFixed(4)})`));
  },
});
