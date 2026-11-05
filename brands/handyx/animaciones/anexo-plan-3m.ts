// Anexo de respaldo · Lo que logramos en 3 meses (plan del primer trimestre, a validar). Un golpe por paso:
// 0 punto de partida: el lanzamiento con las profesiones de hoy (base de la torre) y los tres meses por delante ·
// 1 mes 1: HandIA premium (foto, voz y referencia de costo), lanzamiento y tarifa visible · 2 mes 2: HandIA para
// profesionales y herramientas de cada oficio · 3 mes 3: toda Buenos Aires, las profesiones acumuladas y el primer piloto
// de Handyx for Business. Cada mes suma su tanda de profesiones: el «+N» del mes late, se enciende una fila de la torre y
// el contador sube (intermedios = PROFESIONES-INICIALES + k × PROF-POR-MES; el final es PROF-Q1).
// Handys: Foco (vecino) en el mes 1, Llave (profesional) en el mes 2, Gota y Medidor en el mes 3 y Engranaje (la
// plataforma) sobre el contador. Los detalles de cada mes son los mismos de x-mes-1/2/3 (comun/plan-mes.ts).
// La franja y 880–950 queda libre para la leyenda del kit.
import { COLOR, entraTitulo, escena, pose, tramo, type Kit, type Personaje, type Pose } from './comun/kit.ts';
import { CSS_DECO, decoHtml } from './comun/plan-mes.ts';

const MARCAS = [0, 2.8, 6.0, 9.2, 12.6];
const marca = (k: number) => MARCAS[k] ?? 0;
const CARD = { x0: 96, w: 410, gap: 36, top: 290, h: 500 };
const cardX = (k: number) => CARD.x0 + k * (CARD.w + CARD.gap);
const CUENTA = { x: 1458, y: 290, w: 366, h: 500 };
const TILE = 46;
const GAPT = 8;
const GRID = { x: 25, y: 214 }; // dentro de la tarjeta del contador
const filaTop = (r: number) => GRID.y + (3 - r) * (TILE + GAPT); // r = 0: la fila de abajo (las de hoy)
const OFICIOS = ['electricidad', 'plomeria', 'gas', 'cerrajeria', 'albanileria', 'aire'];
// Herramientas de las profesiones que se suman (decorado: no nombra profesiones, que todavía no están confirmadas)
const HERRAMIENTAS = ['martillo', 'martillo2', 'llave-inglesa', 'herramienta', 'capas', 'calculadora', 'lista', 'sparkles', 'idea'];
/** Cada mes suma su fila: el «+N» late en t, las fichas se encienden y el número cuenta. */
const SUMA = (k: number) => marca(k + 1) + 1.0;
const FIESTA = SUMA(2) + 1.0;

interface Mes { etiqueta: string; pista: string; titulo: string; lineas: string[]; deco: 'handia' | 'herramientas' | 'mapa'; equipo: Array<{ n: Personaje; alto: number; x: number }> }
function meses(c: Kit): Mes[] {
  return [
    {
      etiqueta: 'Mes 1 · nov',
      pista: 'chispas',
      titulo: 'HandIA premium',
      lineas: ['Foto, voz y referencia de costo', 'Lanzamiento y tarifa visible'],
      deco: 'handia',
      equipo: [{ n: 'bombilla', alto: 150, x: 18 }],
    },
    {
      etiqueta: 'Mes 2 · dic',
      pista: 'herramienta',
      titulo: 'HandIA para profesionales',
      lineas: ['Presupuesto, materiales y recordatorios', 'Herramientas de cada oficio'],
      deco: 'herramientas',
      equipo: [{ n: 'llave', alto: 132, x: 8 }],
    },
    {
      etiqueta: 'Mes 3 · ene',
      pista: 'ubicacion',
      titulo: 'Toda Buenos Aires',
      lineas: [`<b>${c.cifra('PROF-Q1')}</b> profesiones con sus herramientas`, 'Primer piloto de Handyx for Business'],
      deco: 'mapa',
      equipo: [
        { n: 'gota', alto: 104, x: 150 },
        { n: 'medidor_gas', alto: 104, x: 256 },
      ],
    },
  ];
}

export default escena({
  marcas: MARCAS,
  leyendas: ['Punto de partida: **el lanzamiento**', 'Primer mes: **HandIA premium**', 'Segundo mes: **HandIA para profesionales**', 'Tercer mes: **toda Buenos Aires**'],
  lugarLeyenda: { x: (CARD.x0 + cardX(2) + CARD.w) / 2, y: 915 },
  css: `
    .fondo { position: absolute; inset: 0; background: ${COLOR.hueso}; }
    .halo { position: absolute; left: 960px; top: 560px; width: 1900px; height: 1300px; margin: -650px 0 0 -950px; border-radius: 50%; background: radial-gradient(closest-side, rgba(255,255,255,.95), rgba(255,255,255,0)); }
    .encabezado { position: absolute; left: 96px; top: 52px; }
    .krow { display: flex; align-items: center; gap: 18px; }
    .rotulo { display: inline-flex; align-items: center; padding: 5px 14px; border-radius: 999px; border: 2px dashed rgba(31,87,168,.5); background: #fff; font-weight: 700; font-size: 20px; color: ${COLOR.azulOscuro}; white-space: nowrap; }
    .encabezado .titulo { margin-top: 12px; font-size: 58px; }
    .contexto { position: absolute; left: 96px; top: 190px; display: flex; gap: 16px; }
    .contexto .chip { font-size: 21px; padding: 8px 18px 8px 12px; color: ${COLOR.noche}; box-shadow: 0 6px 16px rgba(14,29,54,.10); }

    /* Meses */
    .hueco, .mc, .aro-m { position: absolute; top: ${CARD.top}px; width: ${CARD.w}px; height: ${CARD.h}px; border-radius: 26px; }
    .hueco { border: 3px dashed #C3CCDB; padding: 22px; }
    .hueco .mes { color: ${COLOR.suave}; background: transparent; box-shadow: none; border: 2px dashed #C3CCDB; }
    .pista { position: absolute; left: 50%; top: 50%; width: 112px; height: 112px; margin: -56px 0 0 -56px; border-radius: 50%; border: 3px dashed #C9D2E0; display: grid; place-items: center; }
    .pista .icono { width: 46px; height: 46px; opacity: .45; }
    .mc { padding: 22px; background: #fff; box-shadow: 0 16px 34px rgba(14,29,54,.12), 0 4px 0 #DCE2EC; display: flex; flex-direction: column; }
    .aro-m { top: ${CARD.top - 9}px; width: ${CARD.w + 18}px; height: ${CARD.h + 18}px; border-radius: 34px; border: 5px solid ${COLOR.amarillo}; box-shadow: 0 0 0 6px rgba(255,201,60,.22); }
    .banda { display: flex; align-items: center; justify-content: space-between; height: 46px; }
    .mes { display: inline-flex; align-items: center; gap: 8px; height: 44px; padding: 0 16px; border-radius: 999px; background: ${COLOR.azul}; color: #fff; font-weight: 800; font-size: 21px; white-space: nowrap; }
    .mes .icono { width: 22px; height: 22px; }
    .mas { display: inline-grid; place-items: center; height: 44px; padding: 0 16px; border-radius: 14px; background: ${COLOR.amarillo}; color: ${COLOR.noche}; font-size: 26px; box-shadow: 0 4px 0 #C9971E; }
    .ilus { position: relative; margin-top: 16px; height: 190px; border-radius: 20px; background: #ECECEC; }
    .ilus .mov { position: absolute; bottom: 10px; }
    .ilus .globo-ia { left: 146px; top: 58px; gap: 8px; padding: 12px 14px; }
    .ilus .cajas { left: 150px; top: 63px; gap: 10px; }
    .ilus .mini-mapa { left: 22px; top: 14px; width: 112px; height: 160px; }
    ${CSS_DECO}
    .mt { margin-top: 18px; font-size: 31px; line-height: 1.04; color: ${COLOR.noche}; text-wrap: balance; }
    .ml { margin-top: 12px; display: flex; flex-direction: column; gap: 8px; }
    .ml p { position: relative; padding-left: 20px; font-size: 23px; line-height: 1.25; font-weight: 600; color: ${COLOR.texto}; text-wrap: balance; }
    .ml p::before { content: ''; position: absolute; left: 0; top: 11px; width: 8px; height: 8px; border-radius: 50%; background: ${COLOR.azul}; }
    .ml b { font-weight: 800; color: ${COLOR.azul}; }

    /* Contador: torre de profesiones */
    .cuenta { position: absolute; left: ${CUENTA.x}px; top: ${CUENTA.y}px; width: ${CUENTA.w}px; height: ${CUENTA.h}px; border-radius: 26px; background: #fff; box-shadow: 0 16px 34px rgba(14,29,54,.12), 0 4px 0 #DCE2EC; }
    .aro-cuenta { position: absolute; left: ${CUENTA.x - 9}px; top: ${CUENTA.y - 9}px; width: ${CUENTA.w + 18}px; height: ${CUENTA.h + 18}px; border-radius: 34px; border: 5px solid ${COLOR.amarillo}; box-shadow: 0 0 0 6px rgba(255,201,60,.22); }
    .c-k { position: absolute; left: 25px; top: 24px; font-weight: 800; font-size: 20px; letter-spacing: .08em; text-transform: uppercase; color: ${COLOR.azul}; }
    .c-n { position: absolute; left: 22px; top: 58px; font-size: 128px; line-height: 1; color: ${COLOR.azulOscuro}; transform-origin: 0 60%; }
    .slot, .ficha { position: absolute; width: ${TILE}px; height: ${TILE}px; border-radius: 13px; }
    .slot { border: 3px dashed #C9D2E0; }
    .ficha { background: #fff; display: grid; place-items: center; box-shadow: 0 4px 0 #D5DCE7, 0 8px 14px rgba(14,29,54,.08); }
    .ficha .icono { width: 25px; height: 25px; }
    .ficha.hoy { background: ${COLOR.azul}; box-shadow: 0 4px 0 ${COLOR.azulOscuro}, 0 8px 14px rgba(14,29,54,.12); }
    .c-pie { position: absolute; left: 25px; right: 22px; top: 440px; font-size: 21px; line-height: 1.25; font-weight: 700; color: ${COLOR.suave}; }
    .c-pie b { color: ${COLOR.noche}; }
    .eng { position: absolute; left: ${CUENTA.x + 254}px; top: ${CUENTA.y - 92}px; width: 84px; height: 84px; }
    .eng .cae { position: absolute; inset: 0; }
    .pj { transform-origin: 50% 100%; }
  `,
  html: (c) => {
    const ms = meses(c);
    const mas = `+${c.cifra('PROF-POR-MES')}`;
    // Fichas de la torre: la fila de hoy con los seis oficios; cada mes, seis herramientas (mezcla determinista)
    let torre = '';
    for (let r = 0; r < 4; r++) {
      const mezcla = [...HERRAMIENTAS];
      for (let k = mezcla.length - 1; k > 0; k--) {
        const j = Math.floor(c.azar() * (k + 1));
        [mezcla[k], mezcla[j]] = [mezcla[j] ?? '', mezcla[k] ?? ''];
      }
      for (let i = 0; i < 6; i++) {
        const pos = `left:${GRID.x + i * (TILE + GAPT)}px;top:${filaTop(r)}px`;
        if (r) torre += `<i class="slot s${r}" style="${pos}"></i>`;
        torre += `<div class="ficha f${r}${r ? '' : ' hoy'}" style="${pos}">${c.icono(r ? (mezcla[i] ?? 'herramienta') : (OFICIOS[i] ?? 'herramienta'), r ? '' : 'blanco')}</div>`;
      }
    }
    return `
    <div class="fondo"></div><div class="halo"></div>
    <div class="encabezado">
      <div class="krow"><span class="kicker">Respaldo · producto</span><span class="rotulo">Plan propuesto · a validar</span></div>
      <div class="titulo t"><span class="l"><span>Lo que logramos en <mark>${c.cifra('META-BA-MESES')} meses</mark></span></span></div>
    </div>
    <div class="contexto"><span class="chip">${c.icono('cohete')}Lanzamiento · ${c.cifra('LANZAMIENTO')}</span><span class="chip">${c.icono('ia')}Desarrollo con IA: más rápido y más barato</span></div>
    ${ms.map((m, k) => `<div class="hueco" style="left:${cardX(k)}px"><span class="mes">${c.icono('calendario')}${m.etiqueta}</span><span class="pista">${c.icono(m.pista)}</span></div>`).join('')}
    ${ms.map((_, k) => `<div class="aro-m" style="left:${cardX(k) - 9}px"></div>`).join('')}
    ${ms
      .map(
        (m, k) => `<div class="mc m${k}" style="left:${cardX(k)}px">
        <div class="banda"><span class="mes">${c.icono('calendario', 'blanco')}${m.etiqueta}</span><span class="mas t">${mas}</span></div>
        <div class="ilus">${decoHtml(m.deco, c, `plan3m-costa-${k}`)}${m.equipo.map((h) => `<div class="mov" style="left:${h.x}px;width:${h.alto}px;height:${h.alto}px">${c.pj(h.n, '', h.alto)}</div>`).join('')}</div>
        <div class="mt t">${m.titulo}</div>
        <div class="ml">${m.lineas.map((l) => `<p>${l}</p>`).join('')}</div>
      </div>`,
      )
      .join('')}
    <div class="aro-cuenta"></div>
    <div class="cuenta">
      <div class="c-k">Profesiones</div>
      <div class="c-n t">${c.cifra('PROFESIONES-INICIALES')}</div>
      ${torre}
      <div class="c-pie"><b>${mas} por mes</b>, cada una con sus herramientas</div>
    </div>
    <div class="eng"><div class="cae">${c.pj('engranaje', '', 84)}</div></div>
  `;
  },
  armar(tl, $, c) {
    // 0 · título, contexto, los tres meses por delante y la torre con las profesiones de hoy
    tl.fromTo($('.halo'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, ease: 'power1.out' }, 0);
    tl.fromTo($('.krow'), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.05);
    entraTitulo(tl, $.all('.encabezado .l > span'), 0.12);
    tl.fromTo($.all('.contexto .chip'), { autoAlpha: 0, y: 16, scale: 0.9 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(2)', stagger: 0.12 }, 0.35);
    tl.fromTo($.all('.hueco'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out', stagger: 0.08 }, 0.4);
    tl.fromTo($('.cuenta'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out' }, 0.55);
    tl.fromTo([$('.c-k'), $('.c-n')], { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.08 }, 0.8);
    tl.fromTo($.all('.ficha.f0'), { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(2.4)', stagger: 0.05 }, 0.95);
    tl.fromTo($.all('.slot'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, stagger: 0.01 }, 1.05);
    tl.fromTo($('.c-pie'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 1.25);
    tl.fromTo($('.eng .cae'), { autoAlpha: 0, y: -80 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'bounce.out' }, 1.3);

    // 1 a 3 · cada mes ocupa su lugar, late su «+N», se enciende su fila y cuenta el número
    const huecos = $.all('.hueco');
    const cartas = $.all('.mc');
    const aros = $.all('.aro-m');
    cartas.forEach((carta, k) => {
      const T = marca(k + 1);
      const hueco = huecos[k];
      const aro = aros[k];
      if (hueco) tl.to(hueco, { autoAlpha: 0, duration: 0.25, ease: 'power1.in' }, T + 0.02);
      tl.fromTo(carta, { autoAlpha: 0, y: 44, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.5)' }, T + 0.05);
      if (aro) {
        tl.fromTo(aro, { autoAlpha: 0, scale: 1.04 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'power3.out' }, T + 0.3);
        if (k < cartas.length - 1) tl.to(aro, { autoAlpha: 0, duration: 0.3, ease: 'power1.in' }, marca(k + 2));
      }
      tl.fromTo(carta.querySelectorAll('.ilus .mov'), { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'back.out(1.8)', stagger: 0.1 }, T + 0.3);
      const globo = carta.querySelectorAll('.globo-ia');
      if (globo.length) tl.fromTo(globo, { autoAlpha: 0, scale: 0.6, transformOrigin: '0% 100%' }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(2)' }, T + 0.45);
      const piezas = carta.querySelectorAll('.gc, .caja');
      if (piezas.length) tl.fromTo(piezas, { autoAlpha: 0, scale: 0.4, rotation: -10 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.4, ease: 'back.out(2.4)', stagger: 0.12 }, T + 0.55);
      const mapa = carta.querySelectorAll('.mini-mapa');
      if (mapa.length) {
        tl.fromTo(mapa, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' }, T + 0.4);
        tl.fromTo(carta.querySelectorAll('.mini-mapa .pin'), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.4, ease: 'back.out(3)', stagger: 0.14 }, T + 0.6);
      }
      tl.fromTo(carta.querySelectorAll('.mt, .ml p'), { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: 'power2.out', stagger: 0.1 }, T + 0.5);
      // El «+N» del mes late y la torre suma su fila (amarilla al llegar, blanca después)
      const s = SUMA(k);
      tl.to(carta.querySelector('.mas'), { scale: 1.2, duration: 0.18, ease: 'power2.out', yoyo: true, repeat: 1 }, s);
      const fichas = $.all(`.ficha.f${k + 1}`);
      tl.fromTo(fichas, { autoAlpha: 0, scale: 0.3, backgroundColor: COLOR.amarillo }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(2.4)', stagger: 0.05 }, s + 0.15);
      tl.to(fichas, { backgroundColor: '#ffffff', duration: 0.5, ease: 'power1.inOut' }, s + 1.3);
      tl.to($('.c-n'), { scale: 1.08, duration: 0.2, ease: 'power2.out', yoyo: true, repeat: 1 }, s + 0.2);
    });
    tl.fromTo($('.aro-cuenta'), { autoAlpha: 0, scale: 1.04 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'power3.out' }, FIESTA);

    // Contador: sube de a una tanda por mes y termina en la proyección del trimestre
    const ini = c.valor('PROFESIONES-INICIALES') ?? 0;
    const pm = c.valor('PROF-POR-MES') ?? 0;
    const valores = [ini, ini + pm, ini + 2 * pm, c.valor('PROF-Q1') ?? ini + 3 * pm];
    const num = $('.c-n');
    c.pintor((t) => {
      let v = valores[0] ?? 0;
      for (let k = 0; k < 3; k++) {
        const e = tramo(t, SUMA(k) + 0.2, SUMA(k) + 0.8);
        if (e > 0) v = (valores[k] ?? 0) + ((valores[k + 1] ?? 0) - (valores[k] ?? 0)) * (1 - (1 - e) ** 3);
      }
      num.textContent = String(Math.round(v));
    });

    // Poses: cada mes llega festejando y saluda (Llave trabaja con sus herramientas); Engranaje trabaja cada vez que la
    // torre suma una fila y festeja; al final festejan todos.
    const [foco, llave] = [$('.m0 .pj'), $('.m1 .pj')];
    const equipo3 = $.all('.m2 .pj');
    const eng = $('.eng .pj');
    c.pintor((t) => {
      const llegada = (k: number, despues: Pose): Pose => {
        const a = marca(k + 1) + 0.3;
        if (t >= FIESTA || (t >= a && t < a + 0.45)) return 'c';
        if (t >= a && t < marca(k + 2)) return despues;
        return 'a';
      };
      pose(foco, llegada(0, 'b'));
      pose(llave, llegada(1, 'd'));
      for (const pj of equipo3) pose(pj, llegada(2, 'b'));
      let pe: Pose = t >= 1.3 && t < 1.75 ? 'c' : t >= 1.75 && t < 2.6 ? 'b' : 'a';
      for (let k = 0; k < 3; k++) {
        if (t >= SUMA(k) && t < SUMA(k) + 0.8) pe = 'd';
        else if (t >= SUMA(k) + 0.8 && t < SUMA(k) + 1.5) pe = 'c';
      }
      pose(eng, t >= FIESTA ? 'c' : pe);
    });
  },
  ambiente(t, $) {
    // Respiración (dueño: el ambiente; la línea de tiempo mueve .mov y .cae), la voz de HandIA y el latido de Mar del Plata
    $.all('.pj').forEach((p, i) => (p.style.transform = `scaleY(${(1 + Math.sin(t * 2.4 + i * 1.1) * 0.02).toFixed(4)})`));
    $.all('.ondas i').forEach((b, i) => (b.style.transform = `scaleY(${(0.55 + 0.45 * Math.abs(Math.sin(t * 3.2 + i * 0.9))).toFixed(3)})`));
    for (const p of $.all('.mini-mapa .pin.casa')) p.style.strokeWidth = String(4 + 2 * Math.abs(Math.sin(t * 2.2)));
  },
});
