// Anexo de respaldo · Costos y punto de equilibrio. Un golpe por paso:
// 0 «Lo que cuesta mantener Handyx» → el total del mes cuenta y se levanta su columna ·
// 1 «En qué se va» → la columna se reparte en desarrollo, servidores y marketing, con sus montos ·
// 2 «Cada trabajo deja una tarifa» → la cuenta de un trabajo (ticket supuesto × tarifa); aparece el tanque de tarifas con la
//   línea de los costos y cae la primera moneda: Llave (especialista) adentro, Foco (vecino) sobre la cuenta ·
// 3 «El punto de equilibrio» → las monedas llenan el tanque hasta la línea de los costos (Llave sube con el nivel) y se ve
//   cuántos trabajos por mes los cubren.
// Todo número sale de una afirmación. La franja y 880–950 queda libre (leyenda del kit) y la de abajo (y > 960), para subtítulos.
import { COLOR, entraTitulo, escena, pose, tramo, type Pose } from './comun/kit.ts';

const MARCAS = [0, 3.2, 6.4, 9.6, 13.0];

// Columnas: la de costos (repartida) y el tanque de tarifas, sobre el mismo piso y con la misma escala
const PISO = 800;
const ALTO = 470; // alto de los costos del mes
const TOPE = PISO - ALTO; // línea de los costos = equilibrio
const COL = { x: 440, w: 200 };
const TANQUE = { x: 730, w: 210 };
const PARTIDAS = [
  { id: 'COSTO-DESARROLLO', txt: 'Desarrollo', ic: 'codigo', color: COLOR.azul, base: COLOR.azulOscuro },
  { id: 'COSTO-SERVIDORES', txt: 'Servidores', ic: 'servidor', color: '#A9C0E6', base: '#7F9CCB' },
  { id: 'COSTO-MARKETING', txt: 'Marketing', ic: 'megafono', color: COLOR.amarillo, base: '#C9971E' },
] as const;

// Tiempos
const T_PARTE = (i: number) => 3.35 + i * 0.32; // cada partida se enciende (desde abajo)
const T_TANQUE = 6.95;
const T_PRIMERA = 8.05; // la primera moneda llega al fondo
const LLENA0 = 10.05; // el tanque empieza a llenarse
const LLENA1 = 12.3; // llega a la línea de los costos
const NIVEL_PRIMERA = 0.018; // un trabajo: apenas una franja
const CARTA = { x: 1120, w: 704 };

/** Nivel del tanque (0 a 1) en el tiempo t. */
function nivel(t: number): number {
  if (t < T_PRIMERA) return 0;
  const k = tramo(t, LLENA0, LLENA1);
  const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
  return NIVEL_PRIMERA + (1 - NIVEL_PRIMERA) * e;
}

export default escena({
  marcas: MARCAS,
  leyendas: ['Lo que cuesta **mantener Handyx** hoy', 'En qué se va: **desarrollo, servidores y marketing**', 'Cada trabajo deja **una tarifa para Handyx**', 'El **punto de equilibrio**: los costos cubiertos'],
  css: `
    .fondo { position: absolute; inset: 0; background: #EEF0F6; }
    .halo { position: absolute; left: 700px; top: 560px; width: 1500px; height: 1500px; margin: -750px 0 0 -750px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,.85), rgba(255,255,255,0) 62%); }
    .encabezado { position: absolute; left: 96px; top: 50px; }
    .krow { display: flex; align-items: center; gap: 18px; }
    .rotulo { display: inline-flex; align-items: center; padding: 5px 14px; border-radius: 999px; border: 2px dashed rgba(31,87,168,.5); background: #fff; font-weight: 700; font-size: 20px; color: ${COLOR.azulOscuro}; white-space: nowrap; }
    .encabezado .titulo { margin-top: 10px; font-size: 60px; color: ${COLOR.azulOscuro}; }

    /* Total del mes */
    .total { position: absolute; left: 96px; top: 192px; display: flex; align-items: baseline; gap: 16px; white-space: nowrap; }
    .total .n { font-size: 66px; color: ${COLOR.noche}; line-height: 1; }
    .total .l { font-size: 28px; font-weight: 800; color: ${COLOR.noche}; }
    .aviso { position: absolute; left: 96px; top: 272px; padding: 4px 14px; border-radius: 999px; background: #fff; border: 2px solid ${COLOR.borde}; font-size: 20px; font-weight: 700; color: ${COLOR.suave}; white-space: nowrap; }

    /* Columna de costos */
    .col { position: absolute; left: ${COL.x}px; top: ${TOPE}px; width: ${COL.w}px; height: ${ALTO}px; border-radius: 22px; overflow: hidden; background: #C9D3E3; box-shadow: 0 16px 30px rgba(14,29,54,.14); transform-origin: 50% 100%; }
    .parte { position: absolute; left: 0; width: 100%; transform-origin: 50% 100%; }
    .parte i { position: absolute; left: 0; right: 0; top: 0; height: 3px; background: rgba(255,255,255,.65); }
    .etq { position: absolute; right: ${1920 - COL.x + 26}px; display: flex; align-items: center; gap: 14px; white-space: nowrap; transform: translateY(-50%); }
    .etq .mos { flex: none; display: grid; place-items: center; width: 58px; height: 58px; border-radius: 16px; background: #fff; box-shadow: 0 6px 0 #D5DCE7, 0 12px 22px rgba(14,29,54,.08); }
    .etq .mos .icono { width: 30px; height: 30px; }
    .etq .tx { text-align: right; }
    .etq .nom { font-size: 24px; font-weight: 800; color: ${COLOR.noche}; line-height: 1.05; }
    .etq .v { margin-top: 4px; font-size: 34px; color: ${COLOR.azulOscuro}; line-height: 1; }
    .pie-col { position: absolute; top: ${PISO + 14}px; width: 260px; margin-left: -130px; text-align: center; font-size: 22px; font-weight: 800; color: ${COLOR.suave}; white-space: nowrap; }
    .suelo { position: absolute; left: ${COL.x - 30}px; top: ${PISO}px; width: ${TANQUE.x + TANQUE.w - COL.x + 60}px; height: 4px; border-radius: 2px; background: #C3CCDB; }

    /* Tanque de tarifas */
    .tanque { position: absolute; left: ${TANQUE.x}px; top: ${TOPE}px; width: ${TANQUE.w}px; height: ${ALTO}px; border-radius: 22px; background: rgba(255,255,255,.75); border: 4px dashed #AFC0DA; overflow: hidden; transform-origin: 50% 100%; }
    .tanque.lleno { border-style: solid; border-color: ${COLOR.verde}; }
    .agua { position: absolute; left: 0; right: 0; bottom: 0; height: 100%; background: ${COLOR.verde}; transform-origin: 50% 100%; transform: scaleY(0); }
    .agua::before { content: ''; position: absolute; left: 0; right: 0; top: 0; height: 8px; background: rgba(255,255,255,.35); }
    .moneda { position: absolute; left: 0; top: 0; width: 30px; height: 30px; margin: -15px 0 0 -15px; border-radius: 50%; background: ${COLOR.amarillo}; border: 4px solid #C9971E; box-shadow: inset 0 0 0 3px rgba(255,255,255,.45); opacity: 0; }
    .linea { position: absolute; left: ${COL.x - 30}px; top: ${TOPE - 2}px; width: ${TANQUE.x + TANQUE.w - COL.x + 160}px; height: 0; border-top: 4px dashed ${COLOR.noche}; transform-origin: 0 50%; }
    .linea.ok { border-top-style: solid; border-top-color: ${COLOR.verde}; }
    .bandera { position: absolute; left: ${TANQUE.x + TANQUE.w - 6}px; top: ${TOPE - 70}px; display: inline-flex; align-items: center; gap: 10px; padding: 8px 18px 8px 10px; border-radius: 999px; font-size: 22px; font-weight: 800; white-space: nowrap; }
    .bandera.verde { background: #E2F4EA; color: #136B3A; box-shadow: 0 8px 18px rgba(14,29,54,.12); }
    .tilde { width: 34px; height: 34px; display: block; }

    /* Handys: .sube lo mueve el pintor (nivel del tanque), .mov la línea de tiempo y el .pj respira (ambiente) */
    .sube { position: absolute; left: 0; top: 0; }
    .mov { position: absolute; transform-origin: 50% 100%; }
    .pj { transform-origin: 50% 100%; }

    /* Cuenta de un trabajo */
    .carta { position: absolute; left: ${CARTA.x}px; width: ${CARTA.w}px; border-radius: 28px; }
    .cA { top: 330px; height: 200px; padding: 26px 32px; background: #fff; box-shadow: 0 18px 36px rgba(14,29,54,.13), 0 5px 0 #DCE2EC; }
    .cA .k { font-size: 22px; font-weight: 800; letter-spacing: .07em; text-transform: uppercase; color: ${COLOR.azul}; }
    .ecu { margin-top: 18px; display: flex; align-items: center; gap: 16px; white-space: nowrap; }
    .term { display: flex; flex-direction: column; align-items: center; }
    .term .v { font-size: 46px; line-height: 1; color: ${COLOR.noche}; }
    .term .l { margin-top: 8px; font-size: 20px; font-weight: 800; color: ${COLOR.suave}; }
    .term.sup .l { color: #8A5200; }
    .term.res { padding: 12px 20px 10px; border-radius: 20px; background: ${COLOR.verde}; box-shadow: 0 6px 0 #136B3A; }
    .term.res .v { color: #fff; } .term.res .l { color: #DDF3E6; margin-top: 6px; }
    .op { font-family: var(--fuente-titulos, sans-serif); font-weight: 900; font-size: 40px; color: ${COLOR.azul}; padding-bottom: 26px; }
    .cB { top: 566px; height: 234px; padding: 0 36px; background: ${COLOR.amarillo}; box-shadow: 0 18px 36px rgba(14,29,54,.16), 0 6px 0 #C9971E; display: flex; align-items: center; gap: 30px; }
    .cB .n { font-size: 124px; line-height: .9; color: ${COLOR.noche}; white-space: nowrap; }
    .cB .k { font-size: 22px; font-weight: 800; letter-spacing: .07em; text-transform: uppercase; color: ${COLOR.azulOscuro}; white-space: nowrap; }
    .cB .l { margin-top: 8px; font-size: 34px; font-weight: 800; line-height: 1.12; color: ${COLOR.noche}; white-space: nowrap; }
  `,
  html: (c) => {
    const vals = PARTIDAS.map((p) => Math.max(0, c.valor(p.id) ?? 0));
    const suma = vals.reduce((a, b) => a + b, 0) || 1;
    // Partidas apiladas desde abajo: alto proporcional a su monto
    let abajo = 0;
    const partes = PARTIDAS.map((p, i) => {
      const h = (ALTO * (vals[i] ?? 0)) / suma;
      const top = ALTO - abajo - h;
      abajo += h;
      return { ...p, top, h };
    });
    const tilde = `<svg class="tilde" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="${COLOR.verde}"/><path d="M6.8 12.4l3.3 3.3 7-7" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const handy = (cls: string, nombre: Parameters<typeof c.pj>[0], x: number, pies: number, alto: number) =>
      `<div class="mov ${cls}" style="left:${x - alto / 2}px;top:${pies - alto}px;width:${alto}px;height:${alto}px">${c.pj(nombre, '', alto)}</div>`;
    return `
    <div class="fondo"></div><div class="halo"></div>
    <div class="encabezado">
      <div class="krow"><span class="kicker">Respaldo · costos</span><span class="rotulo">Proyección · supuestos a validar</span></div>
      <div class="titulo t"><span class="l"><span>Mantener Handyx cuesta <mark>poco</mark></span></span></div>
    </div>
    <div class="total"><span class="n t">0</span><span class="l">por mes, hoy</span></div>
    <div class="aviso">Estimado · sin sueldos ni impuestos</div>

    <div class="suelo"></div>
    <div class="col">${partes.map((p) => `<div class="parte" style="top:${p.top.toFixed(1)}px;height:${p.h.toFixed(1)}px;background:${p.color}">${p.top > 0 ? '<i></i>' : ''}</div>`).join('')}</div>
    ${partes.map((p) => `<div class="etq" style="top:${(TOPE + p.top + p.h / 2).toFixed(1)}px"><div class="tx"><div class="nom">${p.txt}</div><div class="v t">${c.cifra(p.id)}</div></div><span class="mos" style="box-shadow:0 6px 0 ${p.base}55, 0 12px 22px rgba(14,29,54,.08)">${c.icono(p.ic)}</span></div>`).join('')}
    <div class="pie-col pie-c" style="left:${COL.x + COL.w / 2}px">Costos del mes</div>

    <div class="tanque"><div class="agua"></div></div>
    <div class="pie-col pie-t" style="left:${TANQUE.x + TANQUE.w / 2}px">Tarifas de los trabajos</div>
    <div class="linea"></div><div class="linea ok"></div>
    <div class="bandera verde">${tilde}Equilibrio</div>
    ${'<i class="moneda"></i>'.repeat(9)}
    <div class="sube">${handy('h-llave', 'llave', TANQUE.x + 70, PISO, 96)}</div>

    <div class="carta cA"><div class="k">Cada trabajo deja</div>
      <div class="ecu">
        <div class="term sup"><span class="v t">${c.cifra('SUP-TICKET-USD')}</span><span class="l">ticket supuesto</span></div>
        <span class="op">×</span>
        <div class="term"><span class="v t">${c.cifra('TARIFA-USUARIO')}</span><span class="l">tarifa Handyx</span></div>
        <span class="op">=</span>
        <div class="term res"><span class="v t">${c.cifra('INGRESO-POR-TRABAJO')}</span><span class="l">por trabajo</span></div>
      </div></div>
    ${handy('h-foco', 'bombilla', CARTA.x + CARTA.w - 70, 330, 112)}
    <div class="carta cB"><div class="n t">${c.cifra('EQUILIBRIO-TRABAJOS')}</div><div><div class="k">Punto de equilibrio</div><div class="l">trabajos por mes<br>cubren los costos</div></div></div>
  `;
  },
  armar(tl, $, c) {
    // 0 · título, total del mes y su columna
    tl.fromTo($('.halo'), { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 1.2, ease: 'power2.out' }, 0);
    tl.fromTo($('.krow'), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0);
    entraTitulo(tl, $.all('.encabezado .l > span'), 0.1);
    tl.fromTo($('.total'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' }, 0.55);
    c.contador($('.total .n'), { t0: 0.7, dur: 1.5, hasta: c.valor('COSTOS-MES') ?? 0, antes: 'USD ' });
    tl.fromTo($('.aviso'), { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: 'power3.out' }, 2.1);
    tl.fromTo($('.suelo'), { scaleX: 0, transformOrigin: '0 50%' }, { scaleX: 1, duration: 0.5, ease: 'power2.out' }, 0.6);
    tl.fromTo($('.col'), { scaleY: 0 }, { scaleY: 1, duration: 1.5, ease: 'power3.out' }, 0.7);
    tl.fromTo($('.pie-c'), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.35 }, 1.4);

    // 1 · la columna se reparte en partidas (desde abajo) y entran sus etiquetas
    $.all('.parte').forEach((el, i) => tl.fromTo(el, { scaleY: 0 }, { scaleY: 1, duration: 0.42, ease: 'power3.out' }, T_PARTE(i)));
    $.all('.etq').forEach((el, i) => tl.fromTo(el, { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: 0.42, ease: 'power3.out' }, T_PARTE(i) + 0.12));

    // 2 · la cuenta de un trabajo; el tanque, la línea de los costos y la primera moneda
    tl.fromTo($('.cA'), { autoAlpha: 0, y: 40, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }, 6.5);
    tl.fromTo($.all('.cA .term, .cA .op'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out', stagger: 0.12 }, 6.75);
    tl.fromTo($('.tanque'), { autoAlpha: 0, scaleY: 0.3 }, { autoAlpha: 1, scaleY: 1, duration: 0.5, ease: 'back.out(1.4)' }, T_TANQUE);
    tl.fromTo($('.pie-t'), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.35 }, T_TANQUE + 0.2);
    tl.fromTo($('.linea:not(.ok)'), { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power2.out' }, T_TANQUE + 0.25);

    // 3 · el tanque se llena hasta la línea de los costos: equilibrio
    tl.fromTo($('.linea.ok'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, LLENA1);
    tl.fromTo($('.bandera.verde'), { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(2.4)' }, LLENA1 + 0.05);
    tl.fromTo($('.cB'), { autoAlpha: 0, y: 40, scale: 0.9 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.8)' }, LLENA1 + 0.1);

    // Nivel del tanque y Llave arriba del agua (dueño: este pintor)
    const agua = $('.agua');
    const sube = $('.sube');
    const tanque = $('.tanque');
    c.pintor((t) => {
      const k = nivel(t);
      agua.style.transform = `scaleY(${k.toFixed(4)})`;
      sube.style.transform = `translateY(${(-k * ALTO).toFixed(1)}px)`;
      tanque.classList.toggle('lleno', t >= LLENA1);
    });

    // Handys
    const salta = (el: HTMLElement, t: number) => tl.fromTo(el, { autoAlpha: 0, y: 46, scale: 0.6 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(2.2)' }, t);
    salta($('.h-foco'), 6.9);
    salta($('.h-llave'), T_TANQUE + 0.45);
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
    c.pintor((t) => {
      foco(t >= LLENA1 ? 'c' : t >= 7.1 ? 'b' : 'a');
      llave(t >= LLENA1 ? 'c' : t >= T_PRIMERA - 0.1 && t < LLENA0 ? 'b' : 'd');
    });
  },
  ambiente(t, $, tl) {
    // Respiración de los Handys (dueño: el ambiente)
    $.all('.pj').forEach((p, i) => (p.style.transform = `scaleY(${(1 + Math.sin(t * 2.4 + i) * 0.02).toFixed(4)})`));
    // Monedas: de la cuenta al tanque (dueño: el ambiente). La primera, sola, en el paso 2; un chorro mientras se llena.
    const monedas = $.all('.moneda');
    const x0 = CARTA.x + 44;
    const y0 = 372;
    const xT = TANQUE.x + TANQUE.w - 54;
    const sup = PISO - nivel(tl) * ALTO;
    monedas.forEach((m, i) => {
      let s = -1;
      if (i === 0 && tl >= T_PRIMERA - 0.9 && tl < T_PRIMERA + 0.1) s = tramo(tl, T_PRIMERA - 0.9, T_PRIMERA);
      else if (i > 0 && tl >= MARCAS[3]! + 0.12 && tl < LLENA1 - 0.15) s = (t * 0.85 + i / (monedas.length - 1)) % 1;
      if (s < 0) {
        m.style.opacity = '0';
        return;
      }
      // Arco hasta la boca del tanque y caída hasta el agua
      let x: number;
      let y: number;
      if (s < 0.6) {
        const u = s / 0.6;
        x = x0 + (xT - x0) * u;
        y = y0 + (TOPE - 30 - y0) * u - 130 * Math.sin(Math.PI * u);
      } else {
        const u = (s - 0.6) / 0.4;
        x = xT;
        y = TOPE - 30 + (sup - 14 - (TOPE - 30)) * u * u;
      }
      m.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      m.style.opacity = s > 0.93 ? '0' : s < 0.06 ? (s / 0.06).toFixed(2) : '1';
    });
  },
});
