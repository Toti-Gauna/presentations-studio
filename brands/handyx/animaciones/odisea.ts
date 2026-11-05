// Diapositiva 1 · La odisea. Un golpe por frase del guion:
// 0 «Soy Ignacio Gauna…» → presentación · 1 «se nos rompió algo en casa» → la cocina con la pérdida ·
// 2 «la odisea de conseguir un profesional» → chats que se amontonan y el reloj que vuela ·
// 3 «del otro lado, profesionales buscando clientes» → el especialista con la agenda vacía y herramientas dispersas ·
// 4 «por esa doble necesidad creamos Handyx» → Handyx une los dos lados: fluida, cómoda y con control.
import { COLOR, entraTitulo, escena, pose, tramo } from './comun/kit.ts';

const CHATS = [
  { txt: '¿Alguien conoce un plomero?', hora: '10:02', mia: true, x: 470, y: 290, r: -3 },
  { txt: 'Te paso el de mi cuñado', hora: '10:47', mia: false, x: 600, y: 400, r: 2 },
  { txt: 'No contesta…', hora: '13:15', mia: true, x: 520, y: 510, r: -2 },
  { txt: '¿Puede el jueves? ¿Cuánto sale?', hora: '17:30', mia: true, x: 440, y: 620, r: 3 },
  { txt: 'Recién veo tu mensaje', hora: 'Ayer 21:40', mia: false, x: 610, y: 730, r: -2 },
];
const HERR = [
  { ic: 'lista', txt: 'Cuaderno' },
  { ic: 'calculadora', txt: 'Calculadora' },
  { ic: 'chat', txt: 'Mensajes' },
  { ic: 'recibo', txt: 'Planillas' },
  { ic: 'billetera', txt: 'Cobros' },
  { ic: 'calendario', txt: 'Agenda' },
];
const SELLOS = [
  { ic: 'ruta', txt: 'Fluida' },
  { ic: 'sparkles', txt: 'Cómoda' },
  { ic: 'escudo-ok', txt: 'Con control' },
];

export default escena({
  marcas: [0, 2.6, 5.8, 9.6, 12.8, 16.6],
  cara: [
    { desde: 0, x: 1690, y: 200, d: 250 },
    { desde: 3, x: 230, y: 200, d: 250 },
  ],
  css: `
    .fondo { position: absolute; inset: 0; background: ${COLOR.hueso}; }
    .sol { position: absolute; left: 960px; top: 400px; width: 1500px; height: 1500px; margin: -750px 0 0 -750px; border-radius: 50%; background: repeating-conic-gradient(rgba(255,201,60,.22) 0 8deg, transparent 8deg 20deg); -webkit-mask-image: radial-gradient(circle, #000 20%, transparent 68%); mask-image: radial-gradient(circle, #000 20%, transparent 68%); }
    .alerta { position: absolute; left: 430px; top: 560px; display: flex; gap: 12px; align-items: center; padding: 14px 22px; border-radius: 22px; background: #fff; box-shadow: 0 14px 34px rgba(14,29,54,.2); font-weight: 800; font-size: 26px; white-space: nowrap; transform-origin: 0 100%; }
    .alerta b { width: 36px; height: 36px; border-radius: 50%; background: ${COLOR.naranja}; color: #fff; display: grid; place-items: center; font-size: 24px; }
    .intro { position: absolute; left: 0; right: 0; top: 230px; text-align: center; }
    .intro .logo { height: 150px; }
    .intro .nombre { margin-top: 26px; font-size: 54px; }
    .intro .rol { margin-top: 6px; font-size: 30px; font-weight: 700; color: ${COLOR.azul}; letter-spacing: .04em; }
    .fila { position: absolute; left: 50%; top: 690px; width: 1480px; margin-left: -740px; height: 200px; }
    .fila .mov { position: absolute; bottom: 0; }
    .encabezado { position: absolute; left: 96px; top: 56px; }
    .encabezado .titulo { margin-top: 10px; font-size: 58px; }
    .casa { position: absolute; left: 110px; top: 300px; width: 760px; height: 640px; }
    .techo { position: absolute; left: -30px; top: 0; width: 820px; height: 150px; background: ${COLOR.azulOscuro}; clip-path: polygon(50% 0, 100% 100%, 0 100%); }
    .pared { position: absolute; left: 20px; top: 150px; width: 720px; height: 490px; background-color: #ECECEC; background-image: linear-gradient(90deg, rgba(14,29,54,.06) 2px, transparent 2px), linear-gradient(rgba(14,29,54,.06) 2px, transparent 2px); background-size: 48px 48px; border-radius: 0 0 18px 18px; box-shadow: inset 0 -10px 0 rgba(14,29,54,.06); }
    .ventana { position: absolute; left: 70px; top: 60px; width: 200px; height: 150px; border-radius: 14px; background: linear-gradient(#CFE0FA, #E6EEFB); border: 8px solid #fff; box-shadow: 0 0 0 3px #D6D9E0; }
    .ventana::after { content: ''; position: absolute; left: 50%; top: 0; bottom: 0; width: 6px; margin-left: -3px; background: #fff; }
    .reloj { position: absolute; left: 520px; top: 50px; width: 120px; height: 120px; border-radius: 50%; background: #fff; border: 8px solid ${COLOR.azulOscuro}; }
    .reloj i { position: absolute; left: 50%; bottom: 50%; width: 6px; margin-left: -3px; border-radius: 4px; background: ${COLOR.noche}; transform-origin: 50% 100%; }
    .reloj .hh { height: 30px; } .reloj .mm { height: 44px; background: ${COLOR.naranja}; }
    .reloj::after { content: ''; position: absolute; left: 50%; top: 50%; width: 12px; height: 12px; margin: -6px 0 0 -6px; border-radius: 50%; background: ${COLOR.noche}; }
    .mesada { position: absolute; left: 60px; top: 320px; width: 460px; height: 30px; border-radius: 8px; background: #B9C1D0; }
    .mueble { position: absolute; left: 80px; top: 350px; width: 420px; height: 140px; background: #fff; border-radius: 0 0 12px 12px; box-shadow: inset 0 0 0 3px #E3E8F2; }
    .mueble::before, .mueble::after { content: ''; position: absolute; top: 56px; width: 40px; height: 8px; border-radius: 4px; background: #C9CFDA; }
    .mueble::before { left: 90px; } .mueble::after { right: 90px; }
    .charco { position: absolute; left: 120px; top: 600px; width: 420px; height: 46px; border-radius: 50%; background: radial-gradient(#9CC3F5, #6FA3EA); opacity: .9; transform-origin: 50% 50%; }
    .grifo { position: absolute; left: 150px; top: 130px; }
    .gotita { position: absolute; left: 170px; top: 300px; width: 22px; height: 30px; border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%; background: #6FA3EA; }
    .foco { position: absolute; left: 560px; top: 300px; }
    .tel-foco { position: absolute; left: 640px; top: 420px; width: 60px; height: 104px; border-radius: 14px; background: ${COLOR.noche}; border: 5px solid #26324A; }
    .tel-foco::after { content: ''; position: absolute; inset: 6px; border-radius: 8px; background: #CFE0FA; }
    .chat { position: absolute; transform-origin: 0 100%; }
    .chat .burbuja { white-space: nowrap; font-size: 25px; }
    .pro { position: absolute; left: 960px; top: 0; width: 960px; height: 1080px; background: ${COLOR.azul}; overflow: hidden; }
    .pro .kicker { position: absolute; left: 70px; top: 250px; color: ${COLOR.amarillo}; }
    .pro .txt { position: absolute; left: 70px; top: 290px; width: 380px; font-size: 44px; color: #fff; }
    .agenda { position: absolute; left: 1030px; top: 640px; width: 360px; padding: 22px; }
    .agenda b { font-size: 22px; } .agenda small { display: block; margin-top: 4px; font-size: 16px; color: ${COLOR.suave}; }
    .dias { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; margin-top: 14px; }
    .dias i { display: block; height: 34px; border-radius: 8px; background: ${COLOR.celeste}; }
    .vacia { margin-top: 14px; font-weight: 800; font-size: 20px; color: ${COLOR.naranja}; }
    .llave { position: absolute; left: 1480px; top: 360px; }
    .herr { position: absolute; left: 0; top: 0; width: 140px; height: 104px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; background: #fff; border-radius: 22px; box-shadow: 0 14px 30px rgba(14,29,54,.28); font-weight: 800; font-size: 18px; color: ${COLOR.azulOscuro}; }
    .herr .icono { width: 40px; height: 40px; }
    .puente { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; overflow: visible; }
    .placa { position: absolute; left: 790px; top: 560px; width: 340px; height: 150px; display: grid; place-items: center; background: #fff; border-radius: 34px; box-shadow: 0 0 0 10px rgba(255,201,60,.55), 0 30px 60px rgba(14,29,54,.35); }
    .placa img { height: 74px; }
    .cierre { position: absolute; left: 310px; top: 40px; width: 1300px; padding: 24px 36px 26px; display: flex; flex-direction: column; gap: 16px; border-radius: 34px; background: #fff; box-shadow: 0 24px 60px rgba(14,29,54,.25), 0 4px 0 ${COLOR.borde}; }
    .cierre .k { font-weight: 800; font-size: 20px; letter-spacing: .08em; text-transform: uppercase; color: ${COLOR.azul}; }
    .cierre .t { font-size: 40px; margin-top: 6px; white-space: nowrap; }
    .sellos { display: flex; gap: 16px; }
    .sellos .sello { font-size: 26px; padding: 10px 22px; box-shadow: 0 6px 0 ${COLOR.azulOscuro}; }
    .sellos .sello .icono { width: 26px; height: 26px; }
    .sello.amarillo { background: ${COLOR.amarillo}; color: ${COLOR.noche}; box-shadow: 0 6px 0 #C9971E; }
  `,
  html: (c) => `
    <div class="fondo"></div><div class="sol"></div>
    <div class="intro">${c.logo('logo')}<div class="nombre t">Ignacio Gauna</div><div class="rol">FUNDADOR Y CEO DE HANDYX</div></div>
    <div class="fila">${(['gota', 'grifo', 'bombilla', 'engranaje', 'llave', 'medidor_gas', 'aire', 'brocha'] as const).map((n, i) => `<div class="mov hf" style="left:${i * 185}px">${c.pj(n, '', 170)}</div>`).join('')}</div>
    <div class="casa">
      <div class="techo"></div><div class="pared"><div class="ventana"></div>
        <div class="reloj"><i class="hh"></i><i class="mm"></i></div>
        <div class="mesada"></div><div class="mueble"></div>
        <div class="charco"></div>
        <div class="mov grifo">${c.pj('grifo', '', 200)}</div>
        <div class="gotita"></div>
        <div class="mov foco">${c.pj('bombilla', '', 230)}</div>
        <div class="tel-foco"></div>
      </div>
    </div>
    <div class="alerta"><b>!</b>¡Se rompió el caño!</div>
    ${CHATS.map((m, i) => `<div class="chat ch${i}" style="left:${m.x}px;top:${m.y}px;rotate:${m.r}deg"><div class="burbuja ${m.mia ? 'mia' : ''}">${m.txt}<span class="hora">${m.hora}</span></div></div>`).join('')}
    <div class="pro">
      <div class="kicker">Del otro lado</div>
      <div class="txt t">Profesionales buscando clientes</div>
    </div>
    <div class="agenda tarjeta"><b>Agenda · esta semana</b><small>Especialista</small><div class="dias">${'<i></i>'.repeat(7)}</div><div class="vacia">Sin trabajos confirmados</div></div>
    <div class="mov llave">${c.pj('llave', '', 250)}</div>
    ${HERR.map((h, i) => `<div class="herr hz${i}">${c.icono(h.ic)}${h.txt}</div>`).join('')}
    <svg class="puente" viewBox="0 0 1920 1080"><path class="linea" d="M 700 600 C 800 640, 860 640, 960 640 S 1320 640, 1500 690" fill="none" stroke="${COLOR.amarillo}" stroke-width="10" stroke-linecap="round" stroke-dasharray="1 22"/></svg>
    <div class="placa">${c.logo()}</div>
    <div class="cierre"><div><div class="k">Por esa doble necesidad creamos Handyx</div><div class="t">Más que conectar: una experiencia para los dos</div></div>
      <div class="sellos">${SELLOS.map((s, i) => `<span class="sello ${i === 1 ? 'amarillo' : ''}">${c.icono(s.ic, i === 1 ? '' : 'blanco')}${s.txt}</span>`).join('')}</div></div>
    <div class="encabezado"><div class="kicker">La odisea</div><div class="titulo t"><span class="l"><span>Conseguir un profesional</span></span><span class="l"><span>no debería ser una <mark>odisea.</mark></span></span></div></div>
  `,
  armar(tl, $, c) {
    const fila = $.all('.hf');
    // 0 · presentación
    tl.fromTo($('.sol'), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 1.2, ease: 'power2.out' }, 0);
    tl.fromTo($('.intro .logo'), { autoAlpha: 0, y: 40, scale: 0.9 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.6)' }, 0.1);
    tl.fromTo([$('.intro .nombre'), $('.intro .rol')], { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.12 }, 0.45);
    tl.fromTo(fila, { autoAlpha: 0, y: 120 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'back.out(1.8)', stagger: 0.07 }, 0.7);
    // 1 · la cocina con la pérdida
    tl.to([$('.intro'), ...fila], { autoAlpha: 0, y: -60, duration: 0.45, ease: 'power2.in', stagger: 0.02 }, 2.6);
    tl.to($('.sol'), { autoAlpha: 0, duration: 0.6 }, 2.6);
    tl.fromTo($('.techo'), { autoAlpha: 0, y: -80 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'back.out(1.5)' }, 2.9);
    tl.fromTo($('.pared'), { autoAlpha: 0, scaleY: 0.2, transformOrigin: '50% 100%' }, { autoAlpha: 1, scaleY: 1, duration: 0.6, ease: 'back.out(1.4)' }, 2.95);
    tl.fromTo([$('.ventana'), $('.reloj'), $('.mesada'), $('.mueble')], { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)', stagger: 0.07 }, 3.3);
    tl.fromTo($('.grifo'), { autoAlpha: 0, y: -60 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'bounce.out' }, 3.6);
    tl.fromTo($('.foco'), { autoAlpha: 0, x: 120 }, { autoAlpha: 1, x: 0, duration: 0.6, ease: 'power3.out' }, 3.9);
    tl.fromTo($('.charco'), { autoAlpha: 0, scaleX: 0.05, scaleY: 0.3 }, { autoAlpha: 0.9, scaleX: 1, scaleY: 1, duration: 1.6, ease: 'power1.out' }, 4.1);
    tl.fromTo($('.alerta'), { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(2.4)' }, 4.3);
    tl.to($('.alerta'), { autoAlpha: 0, scale: 0.6, duration: 0.3, ease: 'power2.in' }, 5.85);
    // 2 · la odisea: chats, reloj, título
    tl.fromTo($('.tel-foco'), { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(3)' }, 5.85);
    $.all('.chat').forEach((ch, i) => tl.fromTo(ch, { autoAlpha: 0, scale: 0.4, y: 30 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.42, ease: 'back.out(2.2)' }, 6.1 + i * 0.5));
    tl.fromTo($('.reloj .mm'), { rotation: 0 }, { rotation: 360 * 6, duration: 3.2, ease: 'power1.inOut' }, 6.0);
    tl.fromTo($('.reloj .hh'), { rotation: 60 }, { rotation: 60 + 360 / 2, duration: 3.2, ease: 'power1.inOut' }, 6.0);
    tl.fromTo($('.encabezado .kicker'), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 6.0);
    entraTitulo(tl, $.all('.encabezado .l > span'), 6.15);
    // 3 · del otro lado: el especialista
    tl.fromTo($('.pro'), { xPercent: 100 }, { xPercent: 0, duration: 0.75, ease: 'power3.inOut' }, 9.65);
    tl.to($.all('.chat'), { x: -40, duration: 0.6, ease: 'power2.inOut' }, 9.65);
    tl.fromTo([$('.pro .kicker'), $('.pro .txt')], { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: 'power3.out', stagger: 0.12 }, 10.2);
    tl.fromTo($('.agenda'), { autoAlpha: 0, y: 60, rotation: -4 }, { autoAlpha: 1, y: 0, rotation: -2, duration: 0.6, ease: 'back.out(1.6)' }, 10.5);
    tl.to([$('.pro .kicker'), $('.pro .txt')], { autoAlpha: 0, x: -30, duration: 0.35, ease: 'power2.in' }, 12.85);
    tl.to($('.agenda'), { y: 130, rotation: 0, duration: 0.6, ease: 'power3.inOut' }, 13.1);
    tl.to($('.llave'), { y: 130, duration: 0.6, ease: 'power3.inOut' }, 13.1);
    tl.fromTo($('.llave'), { autoAlpha: 0, y: 80 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'back.out(1.8)' }, 10.4);
    tl.fromTo($.all('.herr'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, stagger: 0.1 }, 10.9);
    // 4 · Handyx une los dos lados
    tl.to($('.encabezado'), { autoAlpha: 0, y: -30, duration: 0.4, ease: 'power2.in' }, 12.85);
    tl.fromTo($('.placa'), { autoAlpha: 0, y: -380, scale: 0.6 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: 'bounce.out' }, 12.9);
    $.all('.chat').forEach((ch, i) => tl.to(ch, { x: 960 - CHATS[i]!.x - 120, y: 600 - CHATS[i]!.y - 30, scale: 0.1, autoAlpha: 0, rotation: 0, duration: 0.55, ease: 'power3.in' }, 13.3 + i * 0.06));
    tl.fromTo($('.linea'), { strokeDashoffset: 900, autoAlpha: 0 }, { strokeDashoffset: 0, autoAlpha: 1, duration: 0.9, ease: 'power2.out' }, 13.4);
    tl.to($('.charco'), { scaleX: 0, scaleY: 0, autoAlpha: 0, duration: 0.7, ease: 'power2.in' }, 13.6);
    tl.to($('.tel-foco'), { autoAlpha: 0, duration: 0.3 }, 13.4);
    tl.to($('.agenda .vacia'), { color: COLOR.verde, duration: 0.01 }, 14.2);
    tl.fromTo($('.cierre'), { autoAlpha: 0, y: -60, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.6)' }, 13.9);
    tl.fromTo($.all('.sellos .sello'), { autoAlpha: 0, x: 60 }, { autoAlpha: 1, x: 0, duration: 0.45, ease: 'back.out(2)', stagger: 0.16 }, 14.4);
    // Textos y poses que dependen del momento (pintores: valen también en los saltos)
    const vacia = $('.agenda .vacia');
    const dias = $.all('.agenda .dias i');
    c.pintor((t) => {
      const ok = t >= 14.2;
      vacia.textContent = ok ? '3 trabajos nuevos con Handyx' : 'Sin trabajos confirmados';
      dias.forEach((d, i) => (d.style.background = ok && [1, 3, 4].includes(i) ? COLOR.azul : COLOR.celeste));
      pose($('.grifo .pj'), t >= 13.6 ? 'c' : t >= 3.6 ? 'd' : 'a');
      pose($('.foco .pj'), t >= 13.6 ? 'c' : t >= 5.85 ? 'd' : 'a');
      pose($('.llave .pj'), t >= 13.6 ? 'c' : 'a');
      for (const f of fila) pose(f.querySelector('.pj') as HTMLElement, t < 2.6 && t > 0.9 ? 'b' : 'a');
    });
  },
  ambiente(t, $, tl) {
    // Gota que cae mientras hay pérdida (entre la aparición del grifo y el arreglo)
    const g = $('.gotita');
    const hayPerdida = tl >= 3.9 && tl < 13.6;
    const ciclo = (t % 1.4) / 1.4;
    g.style.opacity = hayPerdida ? String(ciclo < 0.85 ? 1 : 0) : '0';
    g.style.transform = `translateY(${ciclo * 290}px) scale(${1 - ciclo * 0.2})`;
    // Respiración de los personajes (dueño: el ambiente; las entradas mueven el contenedor .mov)
    $.all('.mov .pj').forEach((p, i) => (p.style.transform = `scaleY(${1 + Math.sin(t * 2.4 + i) * 0.018})`));
    // Herramientas: dispersas, girando alrededor del especialista; con Handyx se ordenan en una columna
    const k = 1 - (1 - tramo(tl, 13.5, 14.4)) ** 3;
    $.all('.herr').forEach((h, i) => {
      const a = t * 0.35 + (i * Math.PI * 2) / 6;
      const ox = 1605 + Math.cos(a) * 230 - 70;
      const oy = 500 + Math.sin(a) * 190 - 52 + Math.sin(t * 1.3 + i) * 10;
      const tx = 1040 + i * 142;
      const ty = 300;
      h.style.transform = `translate(${ox + (tx - ox) * k}px, ${oy + (ty - oy) * k}px) rotate(${(1 - k) * Math.sin(t + i) * 8}deg)`;
    });
  },
});
