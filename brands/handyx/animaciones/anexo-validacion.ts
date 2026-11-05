// Anexo de respaldo · Validación: lo que ya probamos y lo que falta probar. Un golpe por clic:
// 0 las apps de usuario y del profesional, desarrolladas y en pruebas (Foco y Llave en sus íconos) ·
// 1 con porteros: los trabajos con comisión cobrada (un Handy de oficio por trabajo, al ritmo del contador) ·
// 2 preregistro: especialistas registrados (un punto por especialista; no son activos ni verificados) ·
// 3 lo que falta: la próxima prueba de diciembre, con trabajos con tarifa cobrada y clientes que vuelven (objetivo).
// Un riel arriba marca el avance: hitos con tilde verde y el último pendiente (punteado, en amarillo).
// La franja y 880–950 queda libre para la leyenda del kit.
import { COLOR, entraTitulo, escena, pose, type Personaje, type Pose } from './comun/kit.ts';

const T1 = 3.0;
const T2 = 6.4;
const T3 = 9.8;
const FIN = 13.4;

const CARTA = { y: 338, w: 420, h: 500, gap: 16, x0: 96 };
const cartaX = (i: number) => CARTA.x0 + i * (CARTA.w + CARTA.gap);
const nodoX = (i: number) => cartaX(i) + CARTA.w / 2;
const RIEL_Y = 290;
const NODO = 22;

// Contadores: los Handys (trabajos) y los puntos (registrados) aparecen cuando el número los alcanza
const C2 = { t0: T1 + 0.75, dur: 1.6 };
const C3 = { t0: T2 + 0.75, dur: 1.8 };
const llegada = (i: number, n: number, o: { t0: number; dur: number }) => o.t0 + o.dur * (1 - (1 - (i + 0.5) / n) ** (1 / 3));
const OFICIOS: Personaje[] = ['gota', 'medidor_gas', 'brocha', 'grifo', 'engranaje'];
const COLS_PUNTOS = 14;

export default escena({
  marcas: [0, T1, T2, T3, FIN],
  leyendas: ['Las apps: **desarrolladas y en pruebas**', 'Con porteros: **trabajos con comisión cobrada**', 'Preregistro: **especialistas registrados**', 'Lo que falta: **la próxima prueba**'],
  css: `
    .fondo { position: absolute; inset: 0; background: #EEF0F6; }
    .halo { position: absolute; left: 960px; top: 600px; width: 1700px; height: 1700px; margin: -850px 0 0 -850px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,.9), rgba(255,255,255,0) 62%); }
    .encabezado { position: absolute; left: 96px; top: 52px; z-index: 9; }
    .encabezado .titulo { margin-top: 10px; font-size: 58px; color: ${COLOR.azulOscuro}; }
    /* riel de avance */
    .riel { position: absolute; left: ${nodoX(0)}px; top: ${RIEL_Y - 3}px; height: 6px; border-radius: 3px; }
    .riel.base { width: ${nodoX(2) - nodoX(0)}px; background: #D5DCE7; }
    .riel.lleno { width: ${nodoX(2) - nodoX(0)}px; background: ${COLOR.verde}; transform-origin: 0 50%; }
    .riel.falta { left: ${nodoX(2)}px; width: ${nodoX(3) - nodoX(2)}px; height: 0; top: ${RIEL_Y - 3}px; border-top: 6px dashed ${COLOR.amarillo}; border-radius: 0; transform-origin: 0 50%; }
    .nodo { position: absolute; top: ${RIEL_Y - NODO}px; width: ${NODO * 2}px; height: ${NODO * 2}px; margin-left: -${NODO}px; border-radius: 50%; display: grid; place-items: center; background: ${COLOR.verde}; box-shadow: 0 0 0 6px #EEF0F6, 0 6px 14px rgba(14,29,54,.2); }
    .nodo .icono { width: 26px; height: 26px; }
    .nodo.meta { background: #fff; box-shadow: 0 0 0 6px #EEF0F6, inset 0 0 0 5px ${COLOR.amarillo}, 0 6px 14px rgba(14,29,54,.16); }
    .onda { position: absolute; top: ${RIEL_Y - NODO}px; width: ${NODO * 2}px; height: ${NODO * 2}px; margin-left: -${NODO}px; border-radius: 50%; border: 4px solid ${COLOR.amarillo}; opacity: 0; }
    /* tarjetas */
    .carta { position: absolute; top: ${CARTA.y}px; width: ${CARTA.w}px; height: ${CARTA.h}px; padding: 24px 26px; border-radius: 28px; background: #fff; box-shadow: 0 18px 38px rgba(14,29,54,.10), 0 5px 0 #DCE2EC; }
    .carta.pend { padding: 21px 23px; background: #FFF9EA; box-shadow: 0 18px 38px rgba(14,29,54,.08); border: 3px dashed #E8B53A; }
    .estado { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px 6px 8px; border-radius: 999px; background: #E2F4EA; color: #136B3A; font-size: 20px; font-weight: 800; letter-spacing: .04em; text-transform: uppercase; }
    .estado .icono { width: 24px; height: 24px; }
    .pend .estado { background: ${COLOR.amarillo}; color: ${COLOR.noche}; }
    .carta h3 { margin-top: 14px; font-size: 38px; color: ${COLOR.azulOscuro}; }
    .apps { position: absolute; left: 26px; right: 26px; top: 142px; display: flex; justify-content: center; gap: 30px; }
    .app { display: flex; flex-direction: column; align-items: center; gap: 12px; }
    .ico-app { position: relative; width: 150px; height: 150px; border-radius: 38px; background: ${COLOR.celeste}; box-shadow: 0 6px 0 #C9D7EE, 0 14px 26px rgba(14,29,54,.10); }
    .ico-app.pro { background: ${COLOR.azul}; box-shadow: 0 6px 0 ${COLOR.azulOscuro}, 0 14px 26px rgba(14,29,54,.16); }
    .ico-app .mov { left: 15px; top: 14px; width: 120px; height: 120px; }
    .app b { font-size: 22px; font-weight: 800; color: ${COLOR.noche}; }
    .pie-carta { position: absolute; left: 26px; right: 26px; bottom: 30px; display: flex; justify-content: center; }
    .pie-carta .chip { font-size: 22px; padding: 10px 18px 10px 12px; }
    .fantasma { position: absolute; top: ${CARTA.y}px; width: ${CARTA.w}px; height: ${CARTA.h}px; border-radius: 28px; border: 3px dashed #C6CFDD; }
    .nodo-f { position: absolute; top: ${RIEL_Y - NODO}px; width: ${NODO * 2}px; height: ${NODO * 2}px; margin-left: -${NODO}px; border-radius: 50%; border: 3px dashed #BCC6D6; background: #EEF0F6; }
    .riel.prox { left: ${nodoX(2)}px; width: ${nodoX(3) - nodoX(2)}px; height: 0; border-top: 6px dashed #D0D7E3; border-radius: 0; }
    .num { position: absolute; left: 26px; top: 128px; font-size: 118px; line-height: 1; color: ${COLOR.azul}; }
    .lbl { position: absolute; left: 26px; top: 256px; right: 26px; font-size: 25px; font-weight: 800; line-height: 1.2; color: ${COLOR.noche}; }
    .oficios { position: absolute; left: 26px; right: 26px; top: 326px; height: 76px; }
    .oficios .mov { top: 0; width: 66px; height: 66px; }
    .puntos { position: absolute; left: 26px; top: 322px; }
    .puntos i { position: absolute; width: 18px; height: 18px; border-radius: 50%; background: #D5DCE7; }
    .puntos i.on { background: ${COLOR.azul}; }
    .nota { position: absolute; left: 26px; right: 26px; bottom: 26px; display: flex; align-items: flex-start; gap: 10px; font-size: 20px; font-weight: 700; line-height: 1.25; color: ${COLOR.suave}; }
    .nota .icono { flex: none; width: 24px; height: 24px; opacity: .8; }
    .h-reg { left: 290px; top: 132px; width: 104px; height: 104px; }
    .edif { position: absolute; left: 292px; top: 140px; width: 100px; height: 100px; border-radius: 26px; background: ${COLOR.celeste}; display: grid; place-items: center; box-shadow: 0 5px 0 #C9D7EE; }
    .edif .icono { width: 54px; height: 54px; }
    .meta-f { position: absolute; left: 26px; right: 26px; display: flex; align-items: center; gap: 16px; }
    .meta-f .n { font-size: 74px; line-height: 1; color: ${COLOR.azul}; white-space: nowrap; }
    .meta-f span { font-size: 24px; font-weight: 800; line-height: 1.2; color: ${COLOR.noche}; }
    .mf1 { top: 128px; } .mf2 { top: 262px; }
    .pista { position: absolute; left: 26px; top: 222px; width: 368px; height: 16px; border-radius: 8px; border: 3px dashed #E0B43A; }
    .pista .icono { position: absolute; right: -6px; top: -32px; width: 30px; height: 30px; }
    .h-vuelve { left: 300px; top: 252px; width: 96px; height: 96px; }
    .vuelve { position: absolute; left: 248px; top: 300px; width: 40px; height: 40px; border-radius: 50%; background: ${COLOR.celeste}; display: grid; place-items: center; }
    .vuelve .icono { width: 24px; height: 24px; }
    .pend .pie-carta .chip { background: ${COLOR.amarillo}; color: ${COLOR.noche}; box-shadow: 0 5px 0 #C9971E; }
    /* Handys: el contenedor .mov lo mueve la línea de tiempo; el .pj de adentro respira (ambiente) */
    .mov { position: absolute; transform-origin: 50% 100%; }
    .pj { transform-origin: 50% 100%; }
  `,
  html: (c) => {
    const trabajos = Math.max(0, Math.round(c.valor('TRABAJOS-INFORMADOS') ?? 0));
    const registrados = Math.max(0, Math.round(c.valor('ESP-REGISTRADOS') ?? 0));
    const ok = (t: string) => `<span class="estado">${c.icono('tilde-circulo')}${t}</span>`;
    const handy = (cls: string, n: Personaje, alto: number, extra = '') => `<div class="mov ${cls}" style="${extra}">${c.pj(n, '', alto)}</div>`;
    const oficios = Array.from({ length: Math.min(trabajos, 10) }, (_, i) => handy(`of of${i}`, OFICIOS[i % OFICIOS.length]!, 66, `left:${i * 74}px`)).join('');
    const puntos = Array.from({ length: registrados }, (_, i) => `<i style="left:${(i % COLS_PUNTOS) * 26}px;top:${Math.floor(i / COLS_PUNTOS) * 26}px"></i>`).join('');
    return `
    <div class="fondo"></div><div class="halo"></div>
    ${[1, 2, 3].map((i) => `<div class="fantasma f${i}" style="left:${cartaX(i)}px"></div>`).join('')}
    <div class="riel base"></div><div class="riel prox"></div><div class="riel lleno"></div><div class="riel falta"></div>
    ${[1, 2, 3].map((i) => `<div class="nodo-f" style="left:${nodoX(i)}px"></div>`).join('')}
    ${[0, 1, 2].map((i) => `<div class="nodo n${i}" style="left:${nodoX(i)}px">${c.icono('tilde-circulo', 'blanco')}</div>`).join('')}
    <div class="onda" style="left:${nodoX(3)}px"></div>
    <div class="nodo meta n3" style="left:${nodoX(3)}px">${c.icono('objetivo')}</div>

    <div class="carta k0" style="left:${cartaX(0)}px">${ok('Ya probado')}<h3 class="t">Las apps</h3>
      <div class="apps"><div class="app"><div class="ico-app">${handy('h-foco1', 'bombilla', 120)}</div><b>Usuario</b></div>
        <div class="app"><div class="ico-app pro">${handy('h-llave1', 'llave', 120)}</div><b>Profesional</b></div></div>
      <div class="pie-carta"><span class="chip verde">${c.icono('tilde-circulo', 'blanco')}Desarrolladas · en pruebas</span></div></div>

    <div class="carta k1" style="left:${cartaX(1)}px">${ok('Ya probado')}<h3 class="t">Con porteros</h3>
      <div class="num t n-trab">0</div><div class="edif">${c.icono('edificio')}</div><div class="lbl">trabajos con comisión cobrada</div>
      <div class="oficios">${oficios}</div>
      <div class="nota">${c.icono('recibo')}<span>Informado por el fundador · comprobantes en conciliación</span></div></div>

    <div class="carta k2" style="left:${cartaX(2)}px">${ok('Ya probado')}<h3 class="t">Preregistro</h3>
      <div class="num t n-reg">0</div>${handy('h-reg', 'llave', 104)}<div class="lbl">especialistas registrados</div>
      <div class="puntos">${puntos}</div>
      <div class="nota">${c.icono('escudo')}<span>No son activos ni verificados</span></div></div>

    <div class="carta pend k3" style="left:${cartaX(3)}px"><span class="estado">${c.icono('objetivo')}Falta probar</span><h3 class="t">Próxima prueba</h3>
      <div class="meta-f mf1"><span class="n t">${c.cifra('META-TRABAJOS')}</span><span>trabajos con tarifa cobrada</span></div>
      <div class="pista">${c.icono('bandera')}</div>
      <div class="meta-f mf2"><span class="n t">${c.cifra('META-REPETIDORES')}</span><span>clientes que<br>vuelven</span></div>
      ${handy('h-vuelve', 'bombilla', 96)}
      <div class="pie-carta"><span class="chip">${c.icono('calendario')}Objetivo · diciembre 2026</span></div></div>

    <div class="encabezado"><div class="kicker">Respaldo · validación</div><div class="titulo t"><span class="l"><span>Lo que ya probamos</span></span><span class="l"><span><mark>y lo que falta probar</mark></span></span></div></div>
  `;
  },
  armar(tl, $, c) {
    const cartas = $.all('.carta');
    const nodos = $.all('.nodo');
    const entra = (el: HTMLElement, t: number) => tl.fromTo(el, { autoAlpha: 0, y: 50, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.5)', immediateRender: false }, t);
    const pop = (el: HTMLElement | HTMLElement[], t: number, extra = {}) =>
      tl.fromTo(el, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.42, ease: 'back.out(2.4)', immediateRender: false, ...extra }, t);
    tl.set([...cartas, ...nodos, $('.riel.lleno'), $('.riel.falta'), ...$.all('.oficios .mov'), $('.h-reg'), $('.h-vuelve'), $('.edif'), ...$.all('.pie-carta .chip')], { autoAlpha: 0 }, 0);

    // 0 · las apps
    tl.fromTo($('.halo'), { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 1.2, ease: 'power2.out' }, 0);
    tl.fromTo($('.encabezado .kicker'), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0);
    entraTitulo(tl, $.all('.encabezado .l > span'), 0.1);
    tl.fromTo($('.riel.base'), { scaleX: 0, transformOrigin: '0 50%' }, { scaleX: 1, duration: 0.7, ease: 'power3.out' }, 0.35);
    tl.fromTo($('.riel.prox'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 0.9);
    tl.fromTo($.all('.nodo-f'), { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(2)', stagger: 0.1 }, 0.7);
    tl.fromTo($.all('.fantasma'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, stagger: 0.1 }, 0.9);
    [1, 2, 3].forEach((i) => tl.to($(`.fantasma.f${i}`), { autoAlpha: 0, duration: 0.3 }, [T1, T2, T3][i - 1]! + 0.2));
    pop(nodos[0]!, 0.55);
    entra(cartas[0]!, 0.6);
    tl.fromTo($.all('.app'), { autoAlpha: 0, scale: 0.5, rotation: -8 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(2)', stagger: 0.16 }, 0.95);
    pop($('.k0 .pie-carta .chip'), 1.9);

    // 1 · con porteros: un Handy de oficio por trabajo, al ritmo del contador
    tl.fromTo($('.riel.lleno'), { autoAlpha: 1, scaleX: 0 }, { autoAlpha: 1, scaleX: 0.5, duration: 0.6, ease: 'power2.inOut', immediateRender: false }, T1 + 0.05);
    pop(nodos[1]!, T1 + 0.55);
    entra(cartas[1]!, T1 + 0.2);
    pop($('.edif'), T1 + 0.6);
    const nTrab = c.valor('TRABAJOS-INFORMADOS') ?? 0;
    c.contador($('.n-trab'), { t0: C2.t0, dur: C2.dur, hasta: nTrab });
    const oficios = $.all('.oficios .mov');
    oficios.forEach((h, i) => tl.fromTo(h, { autoAlpha: 0, y: 40, scale: 0.4 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.36, ease: 'back.out(2.6)', immediateRender: false }, llegada(i, oficios.length, C2) - 0.1));
    tl.fromTo($('.k1 .nota'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, C2.t0 + C2.dur);

    // 2 · preregistro: un punto por especialista registrado
    tl.to($('.riel.lleno'), { scaleX: 1, duration: 0.6, ease: 'power2.inOut' }, T2 + 0.05);
    pop(nodos[2]!, T2 + 0.55);
    entra(cartas[2]!, T2 + 0.2);
    pop($('.h-reg'), T2 + 0.7);
    const nReg = c.valor('ESP-REGISTRADOS') ?? 0;
    c.contador($('.n-reg'), { t0: C3.t0, dur: C3.dur, hasta: nReg });
    const puntos = $.all('.puntos i').map((el, i, todos) => ({ el, t: llegada(i, todos.length, C3), on: false }));
    c.pintor((t) => {
      for (const p of puntos) {
        const on = t >= p.t;
        if (on !== p.on) {
          p.on = on;
          p.el.classList.toggle('on', on);
        }
      }
    });
    tl.fromTo($('.k2 .nota'), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.4 }, C3.t0 + C3.dur - 0.2);

    // 3 · lo que falta: la próxima prueba (objetivo de diciembre)
    tl.fromTo($('.riel.falta'), { autoAlpha: 1, scaleX: 0 }, { autoAlpha: 1, scaleX: 1, duration: 0.6, ease: 'power2.inOut', immediateRender: false }, T3 + 0.05);
    tl.to($('.riel.prox'), { autoAlpha: 0, duration: 0.3 }, T3 + 0.6);
    pop(nodos[3]!, T3 + 0.55);
    entra(cartas[3]!, T3 + 0.25);
    tl.fromTo($('.mf1'), { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: 'power3.out' }, T3 + 0.75);
    tl.fromTo($('.pista'), { autoAlpha: 0, scaleX: 0.2, transformOrigin: '0 50%' }, { autoAlpha: 1, scaleX: 1, duration: 0.5, ease: 'power3.out' }, T3 + 1.0);
    tl.fromTo($('.mf2'), { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: 'power3.out' }, T3 + 1.3);
    pop($('.h-vuelve'), T3 + 1.5);
    pop($('.k3 .pie-carta .chip'), T3 + 2.1);

    // Poses (valen también en los saltos)
    const [foco1, llave1, reg, vuelve] = ['.h-foco1', '.h-llave1', '.h-reg', '.h-vuelve'].map((s) => $(`${s} .pj`)) as [HTMLElement, HTMLElement, HTMLElement, HTMLElement];
    const ofis = oficios.map((h, i) => ({ pj: h.querySelector('.pj') as HTMLElement, t: llegada(i, oficios.length, C2) }));
    c.pintor((t) => {
      const apps: Pose = t >= T3 + 2.2 ? 'b' : t >= T1 ? 'a' : t >= 1.9 ? 'c' : t >= 1.05 ? 'b' : 'a';
      pose(foco1, apps);
      pose(llave1, apps);
      for (const o of ofis) pose(o.pj, t >= T2 ? 'a' : t >= o.t + 0.5 ? 'b' : 'c');
      pose(reg, t >= T3 ? 'a' : t >= C3.t0 + C3.dur ? 'c' : 'b');
      pose(vuelve, t >= T3 + 2.2 ? 'c' : 'b');
    });
  },
  ambiente(t, $, tl) {
    $.all('.mov .pj').forEach((p, i) => (p.style.transform = `scaleY(${(1 + Math.sin(t * 2.4 + i) * 0.02).toFixed(4)})`));
    // El hito pendiente late (dueño: el ambiente; la línea de tiempo no toca .onda)
    const onda = $('.onda');
    const k = (t % 1.6) / 1.6;
    onda.style.opacity = tl >= T3 + 0.8 ? String((1 - k) * 0.8) : '0';
    onda.style.transform = `scale(${1 + k * 1.2})`;
  },
});
