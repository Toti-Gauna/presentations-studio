// Anexo · Maneras de multiplicar ingresos (1/2): las palancas del negocio. Un golpe por paso:
// 0 «Más trabajos»: cada trabajo deja la tarifa; Llave trabaja y la primera corriente de monedas llega a la alcancía ·
// 1 «Más profesiones»: de las iniciales a la meta (el mosaico se llena); Gota y Medidor abren la segunda corriente ·
// 2 «Clientes que vuelven»: Foco vuelve a contratar sin otra captación (tercera corriente) ·
// 3 «Handyx for Business»: turnos de personal para comercios con la misma tarifa (visión); cuarta corriente y festejo.
// Cada palanca suma un anillo a la alcancía de Handyx. La tarifa y las profesiones salen de afirmaciones (nada a mano).
// La franja y 880–950 queda libre para la leyenda del kit.
import { COLOR, entraTitulo, escena, pose, tramo, type Personaje, type Pose } from './comun/kit.ts';

type P = readonly [number, number];
const MARCAS = [0, 3.2, 6.2, 9.2, 12.4];
const FILA = { x: 96, w: 840, h: 132, top: 236, paso: 148 };
const filaY = (i: number) => FILA.top + i * FILA.paso;
const filaC = (i: number) => filaY(i) + FILA.h / 2;
const NODO_X = FILA.x + FILA.w;
const ALC = { x: 1476, y: 486, r: 104 };
const ANILLOS = [138, 166, 194, 222];
const T_FILA = [0.75, 3.3, 6.3, 9.3]; // entra cada palanca
const T_VIA = [1.35, 4.05, 7.0, 10.0]; // se dibuja su corriente
const D_VIA = 0.7;
const T_LLEGA = T_VIA.map((t) => t + D_VIA + 0.35); // la corriente ya entrega monedas: festeja su Handy
const FIESTA = 11.4;
// Mosaico de profesiones (columnas × filas = meta): las iniciales en azul, las que se suman en amarillo
const MOS = { cols: 12, lado: 9, gap: 3 };
const T_CUENTA = 3.4;
const D_CUENTA = 1.5;

// ——— Corrientes: curvas cúbicas muestreadas por largo (las monedas avanzan a velocidad pareja) ———
interface Via { d: string; largo: number; en: (s: number) => P }
function via(p0: P, p1: P, p2: P, p3: P): Via {
  const pts: P[] = [];
  for (let k = 0; k <= 90; k++) {
    const u = k / 90;
    const a = (1 - u) ** 3;
    const b = 3 * (1 - u) ** 2 * u;
    const c = 3 * (1 - u) * u * u;
    const e = u ** 3;
    pts.push([a * p0[0] + b * p1[0] + c * p2[0] + e * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + e * p3[1]]);
  }
  const acum = [0];
  for (let i = 1; i < pts.length; i++) acum.push(acum[i - 1]! + Math.hypot(pts[i]![0] - pts[i - 1]![0], pts[i]![1] - pts[i - 1]![1]));
  const largo = acum[acum.length - 1]!;
  const en = (s: number): P => {
    let i = 1;
    while (i < pts.length - 1 && acum[i]! < s) i++;
    const a = pts[i - 1]!;
    const b = pts[i]!;
    const u = Math.min(1, Math.max(0, (s - acum[i - 1]!) / (acum[i]! - acum[i - 1]! || 1)));
    return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
  };
  return { d: `M${p0[0]} ${p0[1]} C${p1[0]} ${p1[1]} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)} ${p3[0].toFixed(1)} ${p3[1].toFixed(1)}`, largo, en };
}
const VIAS: Via[] = [-26, -9, 9, 26].map((g, i) => {
  const f = (g * Math.PI) / 180;
  const R = ALC.r + 14;
  const fin: P = [ALC.x - R * Math.cos(f), ALC.y + R * Math.sin(f)];
  return via([NODO_X, filaC(i)], [NODO_X + 200, filaC(i)], [fin[0] - 150 * Math.cos(f), fin[1] + 150 * Math.sin(f)], fin);
});
const MONEDAS = 3; // por corriente
const VEL = 230; // px por segundo

// Palancas: Handys del mosaico gris (x = centro dentro de la baldosa), título y bajada
const PALANCAS: Array<{ h: Array<{ n: Personaje; x: number; alto: number }>; badge?: string }> = [
  { h: [{ n: 'llave', x: 84, alto: 98 }] },
  { h: [{ n: 'gota', x: 46, alto: 80 }, { n: 'medidor_gas', x: 122, alto: 80 }] },
  { h: [{ n: 'bombilla', x: 70, alto: 98 }], badge: 'vuelta' },
  { h: [{ n: 'engranaje', x: 70, alto: 86 }], badge: 'tienda' },
];
const vuelta = `<svg class="vuelta" viewBox="0 0 24 24" fill="none" stroke="${COLOR.azul}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 1 1-2.34-5.66L20 8.5"/><path d="M20 3.5v5h-5"/></svg>`;

export default escena({
  marcas: MARCAS,
  leyendas: ['Más **trabajos**: cada uno deja su tarifa', 'Más **profesiones**: más motivos para volver', '**Clientes que vuelven**: sin pagar otra captación', '**Handyx for Business**: turnos para comercios'],
  css: `
    .fondo { position: absolute; inset: 0; background-color: ${COLOR.hueso}; background-image: radial-gradient(rgba(31,87,168,.10) 1.6px, transparent 2.2px); background-size: 36px 36px; }
    .encabezado { position: absolute; left: 96px; top: 52px; z-index: 50; }
    .fila-k { display: flex; align-items: center; gap: 16px; }
    .rotulo { font-weight: 800; font-size: 20px; letter-spacing: .06em; text-transform: uppercase; color: ${COLOR.azulOscuro}; border: 3px solid ${COLOR.azulOscuro}; border-radius: 999px; padding: 3px 14px; }
    .encabezado .titulo { margin-top: 12px; font-size: 62px; color: ${COLOR.noche}; }

    /* Palancas */
    .palanca { position: absolute; left: ${FILA.x}px; width: ${FILA.w}px; height: ${FILA.h}px; display: flex; align-items: center; gap: 22px; padding: 0 30px 0 12px; border-radius: 28px; background: #fff; box-shadow: 0 16px 34px rgba(14,29,54,.10), 0 4px 0 #DCE2EC; }
    .baldosa { position: relative; flex: none; width: 168px; height: 112px; border-radius: 20px; background: #E6EAF1; overflow: hidden; }
    .baldosa .mov { position: absolute; bottom: 2px; transform-origin: 50% 100%; }
    .pj { transform-origin: 50% 100%; }
    .badge { position: absolute; right: 8px; top: 8px; width: 46px; height: 46px; border-radius: 50%; background: #fff; display: grid; place-items: center; box-shadow: 0 4px 10px rgba(14,29,54,.12); }
    .badge .icono, .badge .vuelta { width: 28px; height: 28px; display: block; }
    .txt { flex: 1; min-width: 0; }
    .txt .tt { display: flex; align-items: center; gap: 14px; font-size: 34px; color: ${COLOR.noche}; white-space: nowrap; }
    .txt .sub { display: block; margin-top: 8px; font-size: 24px; font-weight: 600; color: ${COLOR.suave}; white-space: nowrap; }
    .txt .sub b { color: ${COLOR.azul}; font-weight: 800; }
    .tag { font-family: var(--fuente-texto, 'DM Sans Variable', sans-serif); font-weight: 800; font-size: 20px; font-stretch: 100%; letter-spacing: .06em; text-transform: uppercase; color: ${COLOR.noche}; background: ${COLOR.amarillo}; border-radius: 999px; padding: 4px 14px; box-shadow: 0 3px 0 #C9971E; }
    .mosaico { flex: none; display: grid; grid-template-columns: repeat(${MOS.cols}, ${MOS.lado}px); gap: ${MOS.gap}px; padding: 10px; border-radius: 14px; background: #F1F1EC; }
    .mosaico i { display: block; width: ${MOS.lado}px; height: ${MOS.lado}px; border-radius: 2px; background: #D9DCE3; }
    .mosaico i.base { background: ${COLOR.azul}; }
    .mosaico i.on { background: ${COLOR.amarillo}; }
    .nodo { position: absolute; left: ${NODO_X - 11}px; width: 22px; height: 22px; margin-top: -11px; border-radius: 50%; background: ${COLOR.azul}; box-shadow: 0 0 0 5px #fff, 0 4px 12px rgba(14,29,54,.25); z-index: 6; }
    .marco { position: absolute; left: ${FILA.x - 10}px; top: ${filaY(0) - 10}px; width: ${FILA.w + 20}px; height: ${FILA.h + 20}px; border-radius: 36px; border: 5px solid ${COLOR.amarillo}; box-shadow: 0 0 0 6px rgba(255,201,60,.22), 0 0 30px rgba(255,201,60,.45); z-index: 4; }

    /* Corrientes y alcancía */
    .flujo { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; overflow: visible; }
    .cauce { fill: none; stroke: rgba(31,87,168,.08); stroke-width: 16; stroke-linecap: round; stroke-dasharray: 1000 1000; stroke-dashoffset: 1000; }
    .via { fill: none; stroke: #9FB2D2; stroke-width: 4; stroke-linecap: round; stroke-dasharray: 1000 1000; stroke-dashoffset: 1000; }
    .moneda { position: absolute; left: 0; top: 0; width: 36px; height: 36px; margin: -18px 0 0 -18px; border-radius: 50%; background: ${COLOR.amarillo}; box-shadow: inset 0 -4px 0 #D9A21E, 0 5px 12px rgba(14,29,54,.25); display: grid; place-items: center; font-weight: 900; font-size: 20px; color: ${COLOR.noche}; opacity: 0; z-index: 8; }
    .hub { position: absolute; left: ${ALC.x}px; top: ${ALC.y}px; width: 0; height: 0; }
    .halo { position: absolute; left: -330px; top: -330px; width: 660px; height: 660px; border-radius: 50%; background: radial-gradient(circle, rgba(255,201,60,.42) 0, rgba(255,201,60,.16) 38%, rgba(255,201,60,0) 66%); }
    .anillo { position: absolute; border-radius: 50%; }
    .anillo i { position: absolute; inset: 0; border-radius: 50%; border: 3px solid rgba(31,87,168,.22); }
    .anillo.r1 i { border-color: rgba(31,87,168,.17); } .anillo.r2 i { border-color: rgba(31,87,168,.13); } .anillo.r3 i { border-color: rgba(31,87,168,.10); }
    .alc { position: absolute; left: -${ALC.r}px; top: -${ALC.r}px; width: ${2 * ALC.r}px; height: ${2 * ALC.r}px; z-index: 9; }
    .disco { width: 100%; height: 100%; border-radius: 50%; background: ${COLOR.amarillo}; display: grid; place-items: center; box-shadow: 0 0 0 12px #fff, 0 26px 50px rgba(14,29,54,.22); }
    .disco .icono { width: 112px; height: 112px; filter: brightness(.62); }
    .hub-l { position: absolute; left: -300px; top: ${ANILLOS[3]! + 18}px; width: 600px; text-align: center; font-size: 40px; color: ${COLOR.azulOscuro}; white-space: nowrap; }
  `,
  html: (c) => {
    const ini = c.valor('PROFESIONES-INICIALES') ?? 0;
    const meta = c.valor('META-PROFESIONES') ?? 0;
    const celdas = Array.from({ length: meta }, (_, i) => `<i class="${i < ini ? 'base' : ''}"></i>`).join('');
    const textos = [
      `<span class="tt t">Más trabajos</span><span class="sub">cada uno deja la tarifa del <b>${c.cifra('TARIFA-USUARIO')}</b></span>`,
      `<span class="tt t">Más profesiones</span><span class="sub">de <b>${c.cifra('PROFESIONES-INICIALES')}</b> a <b class="cuenta">${c.cifra('META-PROFESIONES')}</b>: más motivos para volver</span>`,
      `<span class="tt t">Clientes que vuelven</span><span class="sub">suman sin volver a pagar la captación</span>`,
      `<span class="tt t">Handyx for Business <span class="tag">Visión</span></span><span class="sub">turnos de personal, con la misma tarifa</span>`,
    ];
    const palancas = PALANCAS.map((p, i) => {
      const handys = p.h.map((h) => `<div class="mov" style="left:${h.x - h.alto / 2}px;width:${h.alto}px;height:${h.alto}px">${c.pj(h.n, '', h.alto)}</div>`).join('');
      const badge = p.badge ? `<span class="badge">${p.badge === 'vuelta' ? vuelta : c.icono(p.badge)}</span>` : '';
      return `<div class="palanca p${i}" style="top:${filaY(i)}px"><div class="baldosa">${handys}${badge}</div><div class="txt">${textos[i]}</div>${i === 1 ? `<div class="mosaico">${celdas}</div>` : ''}</div>
        <i class="nodo n${i}" style="top:${filaC(i)}px"></i>`;
    }).join('');
    const monedas = VIAS.map((_, i) => Array.from({ length: MONEDAS }, () => `<div class="moneda m${i}">$</div>`).join('')).join('');
    return `
      <div class="fondo"></div>
      <div class="hub"><div class="halo"></div>
        ${ANILLOS.map((r, i) => `<div class="anillo r${i}" style="left:${-r}px;top:${-r}px;width:${2 * r}px;height:${2 * r}px"><i></i></div>`).join('')}
        <div class="hub-l t">Ingresos de Handyx</div>
      </div>
      <svg class="flujo" viewBox="0 0 1920 1080">${VIAS.map((v, i) => `<path class="cauce c${i}" d="${v.d}" pathLength="1000"/><path class="via v${i}" d="${v.d}" pathLength="1000"/>`).join('')}</svg>
      <div class="marco"></div>
      ${palancas}
      ${monedas}
      <div class="hub" style="z-index:9"><div class="alc"><div class="disco">${c.icono('alcancia')}</div></div></div>
      <div class="encabezado"><div class="fila-k"><span class="kicker">Material extra · crecimiento</span><span class="rotulo">Plan propuesto · a validar</span></div>
        <div class="titulo t"><span class="l"><span>Maneras de <mark>multiplicar ingresos</mark></span></span></div></div>
    `;
  },
  armar(tl, $, c) {
    // Encabezado y alcancía
    tl.fromTo($('.encabezado .kicker'), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.05);
    tl.fromTo($('.rotulo'), { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, 0.45);
    entraTitulo(tl, $.all('.encabezado .l > span'), 0.1);
    tl.fromTo($('.alc'), { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'back.out(1.9)' }, 0.35);
    tl.fromTo($('.hub-l'), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' }, 0.6);
    // El halo crece con cada palanca
    tl.fromTo($('.halo'), { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 0.45, scale: 0.8, duration: 0.8, ease: 'power2.out' }, 0.4);
    [0.65, 0.82, 0.92, 1].forEach((a, i) => tl.to($('.halo'), { autoAlpha: a, scale: 0.86 + i * 0.05, duration: 0.6, ease: 'power2.out' }, T_LLEGA[i]! - 0.2));

    // Cada palanca: entra la fila, el marco la señala, se dibuja su corriente y suma un anillo
    const marco = $('.marco');
    tl.fromTo(marco, { autoAlpha: 0, scale: 1.04 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'power3.out' }, 0.95);
    T_FILA.forEach((t, i) => {
      tl.fromTo($(`.p${i}`), { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: 'power3.out' }, t);
      tl.fromTo($.all(`.p${i} .mov`), { autoAlpha: 0, y: 40, scale: 0.6 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(2.2)', stagger: 0.1 }, t + 0.2);
      const badge = $.all(`.p${i} .badge`);
      if (badge.length) tl.fromTo(badge, { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(2.6)' }, t + 0.45);
      if (i > 0) tl.to(marco, { y: i * FILA.paso, duration: 0.45, ease: 'power3.inOut' }, t - 0.08);
      tl.fromTo($(`.n${i}`), { autoAlpha: 0, scale: 0.2 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'back.out(3)' }, T_VIA[i]! - 0.12);
      tl.fromTo([$(`.c${i}`), $(`.v${i}`)], { strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: D_VIA, ease: 'power1.inOut' }, T_VIA[i]!);
      tl.fromTo($(`.r${i}`), { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, T_LLEGA[i]!);
    });
    tl.fromTo($('.tag'), { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(2.6)' }, T_FILA[3]! + 0.5);

    // Más profesiones: el número y el mosaico cuentan juntos (ease cúbico del kit)
    const ini = c.valor('PROFESIONES-INICIALES') ?? 0;
    const meta = c.valor('META-PROFESIONES') ?? 0;
    c.contador($('.cuenta'), { t0: T_CUENTA, dur: D_CUENTA, desde: ini, hasta: meta });
    const celdas = $.all('.mosaico i');
    c.pintor((t) => {
      const k = tramo(t, T_CUENTA, T_CUENTA + D_CUENTA);
      const v = ini + (meta - ini) * (1 - (1 - k) ** 3);
      celdas.forEach((el, i) => el.classList.toggle('on', i >= ini && i < Math.round(v)));
    });

    // Poses: saludan al llegar, trabajan mientras se abre su corriente, festejan cuando entrega y todos al final
    const pjs = PALANCAS.map((_, i) => $.all(`.p${i} .pj`));
    const ultima = new Map<HTMLElement, Pose>();
    const poner = (el: HTMLElement, p: Pose) => {
      if (ultima.get(el) !== p) {
        ultima.set(el, p);
        pose(el, p);
      }
    };
    c.pintor((t) => {
      pjs.forEach((lista, i) => {
        const fin = MARCAS[i + 1] ?? FIESTA;
        const p: Pose = t >= FIESTA ? 'c' : t >= fin ? 'a' : t >= T_LLEGA[i]! ? 'c' : t >= T_VIA[i]! ? 'd' : 'b';
        lista.forEach((el) => poner(el, p));
      });
    });
  },
  ambiente(t, $, tl) {
    // Monedas por cada corriente ya dibujada (dueño: el ambiente); la alcancía late con cada llegada
    let golpe = 0;
    VIAS.forEach((v, i) => {
      const f = tramo(tl, T_VIA[i]!, T_VIA[i]! + D_VIA);
      $.all(`.m${i}`).forEach((m, k) => {
        const s = (t * VEL + (k * v.largo) / MONEDAS) % v.largo;
        const visible = f > 0 && s <= f * v.largo;
        const cierre = tramo(s, v.largo - 34, v.largo);
        const [x, y] = v.en(s);
        m.style.opacity = visible ? String(1 - cierre) : '0';
        m.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${(1 - cierre * 0.55).toFixed(3)})`;
        if (visible) golpe += Math.max(0, 1 - Math.abs(s - v.largo + 10) / 26);
      });
    });
    $('.alc .disco').style.transform = `scale(${(1 + Math.min(golpe, 1.6) * 0.045).toFixed(4)})`;
    // Anillos: una onda suave que va de adentro hacia afuera (la línea de tiempo solo los hace aparecer)
    $.all('.anillo i').forEach((a, i) => (a.style.transform = `scale(${(1 + Math.sin(t * 2 - i * 0.7) * 0.012).toFixed(4)})`));
    // Respiración de los Handys y la flecha de «vuelven» girando
    $.all('.mov .pj').forEach((p, i) => (p.style.transform = `scaleY(${(1 + Math.sin(t * 2.4 + i) * 0.02).toFixed(4)})`));
    $('.vuelta').style.transform = `rotate(${(t * 70) % 360}deg)`;
  },
});
