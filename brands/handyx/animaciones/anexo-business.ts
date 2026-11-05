// Anexo · Handyx for Business (visión, con la inversión): un local, su equipo y su app. Un golpe por paso:
// 0 el local y tres burbujas con lo que necesita (personal, mantenimiento, su app) ·
// 1 personal por turnos: días fijos o semanas; mozos, barra y cocina; si alguien falta, el siguiente mejor valorado ·
// 2 mantenimiento: el aire del techo falla y llega Llave, técnico verificado; el aire vuelve a andar ·
// 3 la app propia del local, integrada a Handyx (diseño propuesto, sin nombres ni datos inventados); Foco la usa.
// Sin socios, clientes ni cifras. La franja y 880–950 queda libre para la leyenda del kit.
import { COLOR, entraTitulo, escena, pose, type Pose } from './comun/kit.ts';

const MARCAS = [0, 3.2, 6.4, 9.6, 12.8];
const SUELO = 850;
const LOCAL = { x: 704, w: 452, techo: 430 }; // fachada de 704 a 1156
const CARTA = { x: 96, y: 236, w: 524, h: 404 };
const CEL = { x: 1322, y: 152, w: 334, h: 688 };
const AIRE = { x: 1022, alto: 64 }; // sobre el techo, a la derecha
const LLAVE = { desde: 1960, hasta: 1236, alto: 112 };
const BURBUJAS = [
  { ic: 'usuarios', x: 770, y: 330, a: [CARTA.x + 58, CARTA.y + 58] as const },
  { ic: 'herramienta', x: 880, y: 296, a: [AIRE.x + 66, LOCAL.techo - 70] as const },
  { ic: 'celular', x: 990, y: 318, a: [CEL.x + 60, CEL.y + 120] as const },
];
const T_ROMPE = 6.6;
const T_ARREGLA = 8.1;
const T_LLAVE = [6.6, 7.6];
const DIAS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export default escena({
  marcas: MARCAS,
  leyendas: ['**Handyx for Business**: lo que necesita un local', '**Personal por turnos**: mozos, barra y cocina', '**Mantenimiento** con técnicos verificados', '**Su propia app**, integrada a Handyx'],
  css: `
    .fondo { position: absolute; inset: 0; background-color: ${COLOR.hueso}; background-image: radial-gradient(rgba(31,87,168,.10) 1.6px, transparent 2.2px); background-size: 36px 36px; }
    .encabezado { position: absolute; left: 96px; top: 52px; z-index: 50; }
    .fila-k { display: flex; align-items: center; gap: 16px; }
    .rotulo { font-weight: 800; font-size: 20px; letter-spacing: .06em; text-transform: uppercase; color: ${COLOR.azulOscuro}; border: 3px solid ${COLOR.azulOscuro}; border-radius: 999px; padding: 3px 14px; }
    .encabezado .titulo { margin-top: 12px; font-size: 62px; color: ${COLOR.noche}; }
    .mov { position: absolute; transform-origin: 50% 100%; }
    .pj { transform-origin: 50% 100%; }

    /* El local */
    .vereda { position: absolute; left: 610px; top: ${SUELO}px; width: 650px; height: 16px; border-radius: 8px; background: #DCE2EC; }
    .sombra-l { position: absolute; left: 650px; top: ${SUELO - 14}px; width: 560px; height: 30px; border-radius: 50%; background: rgba(14,29,54,.10); }
    .local { position: absolute; left: ${LOCAL.x}px; top: ${LOCAL.techo}px; width: ${LOCAL.w}px; height: ${SUELO - LOCAL.techo}px; transform-origin: 50% 100%; }
    .fachada { position: absolute; left: 0; right: 0; top: 0; height: 64px; border-radius: 16px 16px 0 0; background: ${COLOR.azulOscuro}; }
    .cartel { position: absolute; left: 50%; top: 12px; width: 220px; height: 40px; margin-left: -150px; border-radius: 12px; background: ${COLOR.noche}; display: grid; place-items: center; box-shadow: inset 0 0 0 2px rgba(255,201,60,.35); }
    .cartel .icono { width: 28px; height: 28px; }
    .toldo { position: absolute; left: -16px; right: -16px; top: 64px; height: 58px; border-radius: 10px 10px 18px 18px; background: repeating-linear-gradient(90deg, ${COLOR.azul} 0 38px, #fff 38px 76px); box-shadow: 0 8px 0 rgba(14,29,54,.10), inset 0 0 0 3px rgba(14,29,54,.06); transform-origin: 50% 0; }
    .frente { position: absolute; left: 0; right: 0; top: 122px; bottom: 0; background: #fff; box-shadow: inset 0 0 0 3px ${COLOR.borde}, 0 18px 36px rgba(14,29,54,.12); }
    .vidriera { position: absolute; left: 26px; top: 154px; width: 250px; height: 170px; border-radius: 14px; background: ${COLOR.celeste}; box-shadow: inset 0 0 0 6px #fff, 0 0 0 3px #D6DEEC; overflow: hidden; }
    .vidriera::after { content: ''; position: absolute; left: -40px; top: -20px; width: 60px; height: 240px; background: rgba(255,255,255,.55); transform: rotate(28deg); }
    .mesa { position: absolute; bottom: 18px; width: 64px; height: 10px; border-radius: 5px; background: #B9C8E2; }
    .mesa::after { content: ''; position: absolute; left: 28px; top: 10px; width: 8px; height: 34px; background: #B9C8E2; }
    .puerta { position: absolute; left: 306px; top: 206px; width: 118px; height: 214px; border-radius: 14px 14px 0 0; background: ${COLOR.azul}; box-shadow: inset 0 0 0 6px #17468A; }
    .puerta::after { content: ''; position: absolute; left: 18px; top: 104px; width: 10px; height: 30px; border-radius: 5px; background: ${COLOR.amarillo}; }
    .aire { left: ${AIRE.x}px; top: ${LOCAL.techo - AIRE.alto + 6}px; width: ${AIRE.alto * 2.3}px; height: ${AIRE.alto}px; }
    .aire .pj { left: 50%; margin-left: -${AIRE.alto / 2}px; }
    .alerta { position: absolute; left: ${AIRE.x + 98}px; top: ${LOCAL.techo - AIRE.alto - 52}px; width: 46px; height: 46px; border-radius: 50%; background: ${COLOR.amarillo}; display: grid; place-items: center; font-family: var(--fuente-titulos, sans-serif); font-weight: 900; font-size: 30px; color: ${COLOR.noche}; box-shadow: 0 6px 14px rgba(14,29,54,.25); }
    .burbuja-n { position: absolute; width: 80px; height: 80px; margin: -40px 0 0 -40px; }
    .burbuja-n .in { position: absolute; inset: 0; border-radius: 50%; background: #fff; display: grid; place-items: center; box-shadow: 0 12px 26px rgba(14,29,54,.16), 0 0 0 3px ${COLOR.borde}; }
    .burbuja-n .in::after { content: ''; position: absolute; left: 50%; bottom: -12px; margin-left: -9px; border: 9px solid transparent; border-top: 13px solid #fff; border-bottom: 0; }
    .burbuja-n .icono { width: 40px; height: 40px; }

    /* Turnos */
    .carta { position: absolute; left: ${CARTA.x}px; top: ${CARTA.y}px; width: ${CARTA.w}px; height: ${CARTA.h}px; padding: 28px 30px; border-radius: 30px; background: #fff; box-shadow: 0 16px 34px rgba(14,29,54,.10), 0 4px 0 #DCE2EC; }
    .cab { display: flex; align-items: center; gap: 14px; font-size: 34px; color: ${COLOR.noche}; white-space: nowrap; }
    .cab .ic { display: grid; place-items: center; width: 56px; height: 56px; border-radius: 18px; background: ${COLOR.celeste}; }
    .cab .ic .icono { width: 32px; height: 32px; }
    .dias { display: flex; gap: 10px; margin-top: 22px; }
    .dia { position: relative; width: 56px; height: 56px; border-radius: 16px; background: #F1F3F7; display: grid; place-items: center; font-weight: 800; font-size: 22px; color: ${COLOR.suave}; }
    .dia .on { position: absolute; inset: 0; border-radius: 16px; background: ${COLOR.azul}; color: #fff; display: grid; place-items: center; box-shadow: 0 4px 0 #17468A; }
    .roles { display: flex; gap: 10px; margin-top: 18px; }
    .rol { display: flex; align-items: center; gap: 8px; padding: 8px 16px 8px 12px; border-radius: 999px; background: #F1F3F7; font-size: 22px; font-weight: 800; color: ${COLOR.noche}; white-space: nowrap; }
    .rol i { width: 12px; height: 12px; border-radius: 50%; background: ${COLOR.amarillo}; }
    .modo { margin-top: 14px; font-size: 23px; font-weight: 600; color: ${COLOR.suave}; }
    .merito { display: flex; align-items: center; gap: 14px; margin-top: 18px; padding-top: 18px; border-top: 2px dashed ${COLOR.borde}; font-size: 22px; font-weight: 700; line-height: 1.25; color: ${COLOR.noche}; }
    .merito .ic { flex: none; display: grid; place-items: center; width: 50px; height: 50px; border-radius: 16px; background: ${COLOR.amarillo}; }
    .merito .ic .icono { width: 30px; height: 30px; filter: brightness(.62); }
    .merito b { color: ${COLOR.azul}; }
    .eng { left: 548px; top: ${SUELO - 116}px; width: 116px; height: 116px; }

    /* Mantenimiento */
    .llave { left: 0; top: ${SUELO - LLAVE.alto}px; width: ${LLAVE.alto}px; height: ${LLAVE.alto}px; }
    .tecnico { position: absolute; left: ${LLAVE.hasta + 66}px; top: ${SUELO - LLAVE.alto - 62}px; width: 0; display: flex; justify-content: center; }
    .tecnico .chip { font-size: 21px; padding: 8px 16px 8px 10px; box-shadow: 0 10px 22px rgba(14,29,54,.18); }
    .tecnico .chip img { width: 26px; height: 26px; }

    /* App del local */
    .cel-mov { position: absolute; left: ${CEL.x}px; top: ${CEL.y}px; width: ${CEL.w}px; height: ${CEL.h}px; }
    .cel-mov .cel { left: 0; top: 0; width: ${CEL.w}px; height: ${CEL.h}px; border-radius: 46px; padding: 11px; }
    .cel-mov .cel .pantalla { border-radius: 36px; }
    .app-cab { position: absolute; left: 0; right: 0; top: 0; height: 180px; padding: 54px 20px 0; background: ${COLOR.azul}; color: #fff; }
    .app-cab .nom { display: flex; align-items: center; gap: 12px; font-size: 32px; }
    .app-cab .nom .icono { width: 34px; height: 34px; }
    .integ { display: inline-flex; align-items: center; gap: 8px; margin-top: 14px; padding: 6px 14px 6px 8px; border-radius: 999px; background: #fff; font-size: 20px; font-weight: 800; color: ${COLOR.azul}; white-space: nowrap; }
    .integ img { height: 22px; display: block; }
    .filas { position: absolute; left: 12px; right: 12px; top: 196px; display: flex; flex-direction: column; gap: 8px; }
    .fila { display: flex; align-items: center; gap: 10px; height: 64px; padding: 0 10px 0 8px; border-radius: 18px; background: #fff; box-shadow: 0 4px 0 #E3E8F2; font-size: 20px; font-weight: 800; color: ${COLOR.noche}; white-space: nowrap; }
    .fila .ic { flex: none; display: grid; place-items: center; width: 44px; height: 44px; border-radius: 14px; background: ${COLOR.celeste}; }
    .fila .ic .icono { width: 28px; height: 28px; }
    .boton { position: absolute; left: 12px; right: 12px; top: 494px; height: 60px; border-radius: 18px; background: ${COLOR.azul}; box-shadow: 0 5px 0 #17468A; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 22px; font-weight: 800; color: #fff; }
    .boton .icono { width: 26px; height: 26px; }
    .nav { position: absolute; left: 0; right: 0; bottom: 0; height: 72px; background: ${COLOR.azulOscuro}; display: flex; align-items: center; justify-content: space-around; }
    .nav .icono { width: 28px; height: 28px; }
    .rot-cel { position: absolute; left: ${CEL.x}px; top: ${CEL.y - 46}px; width: ${CEL.w}px; text-align: center; }
    .rot-cel span { display: inline-block; padding: 4px 14px; border-radius: 999px; background: rgba(255,255,255,.92); box-shadow: 0 0 0 2px #C9D3E6; font-size: 20px; font-weight: 700; color: ${COLOR.suave}; white-space: nowrap; }
    .foco { left: ${CEL.x + CEL.w + 20}px; top: ${SUELO - 116}px; width: 116px; height: 116px; }
  `,
  html: (c) => `
    <div class="fondo"></div>
    <div class="sombra-l"></div><div class="vereda"></div>
    <div class="local">
      <div class="frente"></div>
      <div class="vidriera"><i class="mesa" style="left:40px"></i><i class="mesa" style="left:146px"></i></div>
      <div class="puerta"></div>
      <div class="toldo"></div>
      <div class="fachada"><div class="cartel">${c.icono('tienda', 'oro')}</div></div>
    </div>
    <div class="mov aire">${c.pj('aire', '', AIRE.alto)}</div>
    <div class="alerta">!</div>
    ${BURBUJAS.map((b, i) => `<div class="burbuja-n bu${i}" style="left:${b.x}px;top:${b.y}px"><div class="in">${c.icono(b.ic)}</div></div>`).join('')}

    <div class="carta">
      <div class="cab t"><span class="ic">${c.icono('calendario')}</span>Personal por turnos</div>
      <div class="dias">${DIAS.map((d, i) => `<div class="dia">${d}${i === 4 || i === 5 ? `<span class="on">${d}</span>` : ''}</div>`).join('')}</div>
      <div class="roles"><span class="rol"><i></i>Mozos</span><span class="rol"><i></i>Bartenders</span><span class="rol"><i></i>Cocina</span></div>
      <div class="modo">Por días fijos o por semanas</div>
      <div class="merito"><span class="ic">${c.icono('balanza')}</span><span>Si alguien falta: el siguiente<br><b>mejor valorado</b></span></div>
    </div>
    <div class="mov eng">${c.pj('engranaje', '', 116)}</div>

    <div class="mov llave">${c.pj('llave', '', LLAVE.alto)}</div>
    <div class="tecnico"><span class="chip verde">${c.icono('verificado', 'blanco')}Técnico verificado</span></div>

    <div class="rot-cel"><span>Diseño propuesto</span></div>
    <div class="cel-mov">${c.celular(`
      <div class="app-cab"><div class="nom t">${c.icono('tienda', 'blanco')}Tu local</div><span class="integ">${c.logo()}integrada</span></div>
      <div class="filas">
        <div class="fila"><span class="ic">${c.icono('calendario')}</span>Reservas</div>
        <div class="fila"><span class="ic">${c.icono('recibo')}</span>Carta y pedidos</div>
        <div class="fila"><span class="ic">${c.icono('usuarios')}</span>Trabajá con nosotros</div>
        <div class="fila"><span class="ic">${c.icono('herramienta')}</span>Mantenimiento</div>
      </div>
      <div class="boton">${c.icono('verificado', 'blanco')}Pedir técnico</div>
      <div class="nav">${['casa', 'calendario', 'usuarios', 'herramienta'].map((i) => c.icono(i, 'blanco')).join('')}</div>
    `)}</div>
    <div class="mov foco">${c.pj('bombilla', '', 116)}</div>

    <div class="encabezado"><div class="fila-k"><span class="kicker">Respaldo · visión</span><span class="rotulo">Visión · con la inversión</span></div>
      <div class="titulo t"><span class="l"><span>Un local, <mark>su equipo y su app</mark></span></span></div></div>
  `,
  armar(tl, $, c) {
    tl.fromTo($('.encabezado .kicker'), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.05);
    tl.fromTo($('.rotulo'), { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, 0.45);
    entraTitulo(tl, $.all('.encabezado .l > span'), 0.1);

    // 0 · el local se arma y aparecen sus tres necesidades
    tl.fromTo([$('.sombra-l'), $('.vereda')], { autoAlpha: 0, scaleX: 0.5 }, { autoAlpha: 1, scaleX: 1, duration: 0.5, ease: 'power3.out' }, 0.25);
    tl.fromTo($('.local'), { autoAlpha: 0, scaleY: 0 }, { autoAlpha: 1, scaleY: 1, duration: 0.6, ease: 'back.out(1.3)' }, 0.35);
    tl.fromTo($('.toldo'), { scaleY: 0 }, { scaleY: 1, duration: 0.4, ease: 'back.out(2)' }, 0.8);
    tl.fromTo([$('.vidriera'), $('.puerta')], { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power3.out', stagger: 0.1 }, 0.9);
    tl.fromTo($('.aire'), { autoAlpha: 0, y: -40 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'bounce.out' }, 1.1);
    tl.fromTo($.all('.burbuja-n'), { autoAlpha: 0, scale: 0.3, y: 20 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.45, ease: 'back.out(2.4)', stagger: 0.16 }, 1.5);
    // Cada burbuja vuela a lo que la resuelve, al empezar su paso
    BURBUJAS.forEach((b, i) => {
      const t = (MARCAS[i + 1] ?? 0) + 0.05;
      tl.to($(`.bu${i}`), { x: b.a[0] - b.x, y: b.a[1] - b.y, scale: 0.4, autoAlpha: 0, duration: 0.55, ease: 'power2.in' }, t);
    });

    // 1 · personal por turnos
    tl.fromTo($('.carta'), { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: 'power3.out' }, 3.35);
    tl.fromTo($.all('.dia'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'back.out(2)', stagger: 0.05 }, 3.7);
    tl.fromTo($.all('.dia .on'), { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(2.6)', stagger: 0.15 }, 4.25);
    tl.fromTo($.all('.rol'), { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(2.4)', stagger: 0.12 }, 4.6);
    tl.fromTo($('.modo'), { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: 0.35, ease: 'power3.out' }, 5.0);
    tl.fromTo($('.merito'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' }, 5.35);
    tl.fromTo($('.eng'), { autoAlpha: 0, y: 50, scale: 0.6 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(2.2)' }, 3.6);

    // 2 · mantenimiento: el aire falla, llega Llave (técnico verificado) y lo arregla
    tl.fromTo($('.alerta'), { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(3)' }, T_ROMPE);
    tl.fromTo($('.aire'), { rotation: 0 }, { rotation: 4, duration: 0.08, yoyo: true, repeat: 7, ease: 'sine.inOut', immediateRender: false }, T_ROMPE + 0.1);
    tl.to($('.alerta'), { autoAlpha: 0, scale: 0.4, duration: 0.3, ease: 'power2.in' }, T_ARREGLA);
    tl.fromTo($('.llave'), { autoAlpha: 0, x: LLAVE.desde - LLAVE.alto / 2 }, { autoAlpha: 1, x: LLAVE.hasta - LLAVE.alto / 2, duration: T_LLAVE[1]! - T_LLAVE[0]!, ease: 'power2.out' }, T_LLAVE[0]!);
    tl.fromTo($('.tecnico .chip'), { autoAlpha: 0, scale: 0.4, y: 10 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(2.4)' }, 7.7);
    tl.to($('.tecnico .chip'), { autoAlpha: 0, y: -10, duration: 0.3, ease: 'power1.in' }, 9.6);

    // 3 · la app propia del local, integrada a Handyx; Foco la usa
    tl.fromTo($('.cel-mov'), { autoAlpha: 0, y: 160 }, { autoAlpha: 1, y: 0, duration: 0.65, ease: 'back.out(1.2)' }, 9.75);
    tl.fromTo($('.rot-cel'), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power3.out' }, 10.1);
    tl.fromTo($('.integ'), { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2.4)' }, 10.25);
    tl.fromTo($.all('.fila'), { autoAlpha: 0, x: 24 }, { autoAlpha: 1, x: 0, duration: 0.35, ease: 'power3.out', stagger: 0.11 }, 10.35);
    tl.fromTo($('.boton'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'back.out(2)' }, 10.85);
    tl.fromTo($('.foco'), { autoAlpha: 0, y: 50, scale: 0.6 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(2.2)' }, 10.4);

    // Poses (todas por pintor: valen en los saltos de paso)
    const [aire, eng, llave, foco] = ['.aire', '.eng', '.llave', '.foco'].map((s) => $(`${s} .pj`)) as [HTMLElement, HTMLElement, HTMLElement, HTMLElement];
    const ultima = new Map<HTMLElement, Pose>();
    const poner = (el: HTMLElement, p: Pose) => {
      if (ultima.get(el) !== p) {
        ultima.set(el, p);
        pose(el, p);
      }
    };
    const FIESTA = 11.35;
    c.pintor((t) => {
      poner(aire, t >= T_ARREGLA + 0.7 ? 'c' : t >= T_ARREGLA ? 'd' : t >= T_ROMPE ? 'a' : t >= 1.4 && t < 2.6 ? 'b' : 'a');
      poner(eng, t >= FIESTA ? 'c' : t >= 5.6 ? 'c' : t >= 3.9 ? 'd' : 'b');
      poner(llave, t >= T_ARREGLA + 0.1 ? 'c' : t >= T_LLAVE[1]! ? 'b' : 'd');
      poner(foco, t >= FIESTA ? 'c' : 'b');
    });
  },
  ambiente(t, $) {
    // Respiración de los Handys y burbujas que flotan (dueño: el ambiente; la línea de tiempo mueve los contenedores)
    $.all('.mov .pj').forEach((p, i) => (p.style.transform = `scaleY(${(1 + Math.sin(t * 2.4 + i) * 0.02).toFixed(4)})`));
    $.all('.burbuja-n .in').forEach((b, i) => (b.style.transform = `translateY(${(Math.sin(t * 2 + i * 1.3) * 5).toFixed(2)}px)`));
  },
});
