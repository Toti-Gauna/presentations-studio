// Escenas propias del Dossier 02 (ola 7), en el mismo lenguaje que plantilla/escenas.js (que no se edita): planos de
// color de la marca, trazos finos navy, personas sin cara, un solo acento amarillo. Las piezas (persona, chalet,
// camioneta) son copia de las de escenas.js para que las figuras sean idénticas.
// Uso: <div data-esc02="pedir|llega|adentro" data-tono="claro" data-fondo="no"></div> (viewBox 400 × 240).
(function () {
  const T = {
    claro: { tinta: '#0E1D36', linea: '#0E1D36', suave: '#C9D6EE', papel: '#FFFFFF', piso: 'rgba(14,29,54,0.10)', azul: '#1F57A8', medio: '#2C66B8', prof: '#143E7E', cielo: '#E9EFF9', amar: '#F5F59A', amarFuerte: '#E8D84A', hueso: '#F7F6F1', arena: '#F3F0E8', piedra: '#E2DCCD', piel: ['#E7B48C', '#C98C62', '#8D5B3B'], pelo: '#26324A', pantalon: '#26324A' },
  };
  const NEGRO = '#0E1D36';
  function persona(p, x, y, s, o = {}) {
    const piel = p.piel[o.piel ?? 0], ropa = o.ropa || p.azul, pan = o.pantalon || p.pantalon, pose = o.pose || 'quieta';
    const brazo = (d) => `<path d="${d}" fill="none" stroke="${ropa}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;
    const mano = (cx, cy) => `<circle cx="${cx}" cy="${cy}" r="3.3" fill="${piel}"/>`;
    let g = `<ellipse cx="0" cy="0" rx="19" ry="3.2" fill="${p.piso}"/>`;
    g += `<path d="M-12 -72 L-3 -72 L-5 -4 L-11.5 -4 Z M3 -72 L12 -72 L11.5 -4 L5 -4 Z" fill="${pan}"/>`;
    g += `<rect x="-14.5" y="-5" width="11" height="5" rx="2.5" fill="${NEGRO}"/><rect x="3.5" y="-5" width="11" height="5" rx="2.5" fill="${NEGRO}"/>`;
    if (pose === 'caja') g += brazo('M13 -118 C17 -104 18 -94 17 -84') + mano(17, -82) + `<rect x="9" y="-80" width="22" height="15" rx="2" fill="${o.caja || p.amarFuerte}"/><path d="M15 -80 V-84 H25 V-80" fill="none" stroke="${p.linea}" stroke-width="1.6"/><path d="M9 -74 H31" stroke="${p.linea}" stroke-width="1" opacity=".35"/>`;
    g += `<path d="M-15 -72 L15 -72 L13.5 -117 C12.5 -123 6.5 -126 0 -126 C-6.5 -126 -12.5 -123 -13.5 -117 Z" fill="${ropa}"/>`;
    g += `<path d="M-4 -126 L0 -119 L4 -126" fill="none" stroke="${p.papel}" stroke-width="1.2" opacity=".55"/>`;
    g += `<rect x="-3" y="-132" width="6" height="8" fill="${piel}"/><ellipse cx="0" cy="-141" rx="9" ry="10.5" fill="${piel}"/>`;
    const pelo = o.pelo || 'corto';
    if (pelo === 'largo') g += `<path d="M-10 -140 C-11 -154 -2 -156 3 -154.5 C10 -153 11 -146 10.5 -139 C11 -132 12 -127 14 -123 L6 -124 C7 -132 6 -140 3 -144 C-2 -140 -7 -140 -10 -140 Z" fill="${p.pelo}"/><path d="M-10 -140 C-11 -132 -12 -127 -13 -123 L-7 -124 C-8 -130 -8 -136 -10 -140 Z" fill="${p.pelo}"/>`;
    else if (pelo === 'gorra') g += `<path d="M-9.6 -142 C-10 -154 10 -154 9.6 -142 Z" fill="${o.gorra || p.prof}"/><path d="M8 -143.5 H18 C19 -143.5 19 -141.5 18 -141.5 H8 Z" fill="${o.gorra || p.prof}"/>`;
    else if (pelo === 'rodete') g += `<path d="M-9.5 -141 C-10 -153 -2 -155 3 -153.5 C9 -152 10 -146 9.6 -141 C7 -146 -6 -147 -9.5 -141 Z" fill="${p.pelo}"/><circle cx="-3" cy="-153" r="4.4" fill="${p.pelo}"/>`;
    else g += `<path d="M-9.5 -141 C-10 -153 -2 -155 3 -153.5 C9 -152 10 -146 9.6 -141 C7 -146 -6 -147 -9.5 -141 Z" fill="${p.pelo}"/>`;
    if (pose === 'celular') g += brazo('M-13 -118 C-17 -104 -14 -98 -5 -101') + mano(-4, -102) + `<rect x="-7" y="-115" width="9" height="15" rx="2" fill="${NEGRO}"/><rect x="-6" y="-113.6" width="7" height="11.5" rx="1" fill="${o.pantalla || p.cielo}"/>`;
    else if (pose === 'saluda') g += brazo('M-13 -118 C-22 -126 -24 -138 -21 -148') + mano(-21, -150);
    else if (pose === 'senala') g += brazo('M-13 -118 C-24 -112 -32 -108 -40 -108') + mano(-41, -108);
    else g += brazo('M-13 -118 C-17 -104 -18 -94 -17 -84') + mano(-17, -82);
    if (pose !== 'caja') g += brazo('M13 -118 C17 -104 18 -94 17 -84') + mano(17, -82);
    return `<g transform="translate(${x} ${y}) scale(${s})">${g}</g>`;
  }
  function chalet(p, x, y, w = 90, luz = true) {
    const h = w * 0.62, t = w * 0.42;
    let g = `<path d="M${x - 6} ${y - h} L${x + w / 2} ${y - h - t} L${x + w + 6} ${y - h} Z" fill="${p.prof}"/>`;
    g += `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" fill="${p.hueso}"/>`;
    g += `<rect x="${x}" y="${y - h * 0.42}" width="${w}" height="${h * 0.42}" fill="${p.piedra}"/>`;
    for (let k = 0; k < 3; k++) for (let i = 0; i < 6; i++) g += `<rect x="${x + 2 + i * (w / 6) + (k % 2) * 6}" y="${y - h * 0.42 + 2 + k * (h * 0.13)}" width="${w / 6 - 7}" height="${h * 0.1}" rx="1.2" fill="${p.papel}" opacity=".45"/>`;
    g += `<rect x="${x + w * 0.14}" y="${y - h * 0.86}" width="${w * 0.22}" height="${h * 0.32}" rx="1.5" fill="${luz ? p.amar : p.cielo}"/>`;
    g += `<path d="M${x + w * 0.25} ${y - h * 0.86} V${y - h * 0.54}" stroke="${p.linea}" stroke-width=".8" opacity=".35"/>`;
    g += `<path d="M${x + w * 0.6} ${y} V${y - h * 0.6} A${w * 0.09} ${w * 0.09} 0 0 1 ${x + w * 0.78} ${y - h * 0.6} V${y} Z" fill="${p.azul}"/>`;
    g += `<rect x="${x + w * 0.66}" y="${y - h - t * 0.72}" width="${w * 0.1}" height="${t * 0.5}" fill="${p.piedra}"/>`;
    return g;
  }
  function camioneta(p, x, y, w = 110) {
    const h = w * 0.42;
    let g = `<path d="M${x} ${y - 10} V${y - h} Q${x} ${y - h - 4} ${x + 4} ${y - h - 4} H${x + w * 0.66} L${x + w * 0.86} ${y - h * 0.62} H${x + w - 4} Q${x + w} ${y - h * 0.6} ${x + w} ${y - h * 0.52} V${y - 10} Z" fill="${p.azul}"/>`;
    g += `<path d="M${x + w * 0.68} ${y - h + 2} H${x + w * 0.74} L${x + w * 0.84} ${y - h * 0.66} H${x + w * 0.68} Z" fill="${p.cielo}"/>`;
    g += `<rect x="${x + w * 0.06}" y="${y - h * 0.62}" width="${w * 0.5}" height="${h * 0.12}" rx="2" fill="${p.suave}"/>`;
    for (const cx of [x + w * 0.2, x + w * 0.78]) g += `<circle cx="${cx}" cy="${y - 9}" r="${w * 0.085}" fill="${NEGRO}"/><circle cx="${cx}" cy="${y - 9}" r="${w * 0.035}" fill="${p.suave}"/>`;
    return g;
  }
  const barra = (x, y, w, h, f, r = 2) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${f}"/>`;
  const piso = (p, y, x1 = 10, x2 = 390) => `<path d="M${x1} ${y} H${x2}" stroke="${p.linea}" stroke-width=".8" opacity=".25"/>`;
  const tilde = (cx, cy, r = 11) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#F5F59A"/><path d="M${cx - r * 0.45} ${cy} L${cx - r * 0.09} ${cy + r * 0.36} L${cx + r * 0.55} ${cy - r * 0.36}" fill="none" stroke="${NEGRO}" stroke-width="${r * 0.18}" stroke-linecap="round" stroke-linejoin="round"/>`;

  // íconos de línea (centro 0,0; caben en 24 × 24)
  const ico = {
    chat: (c) => `<path d="M-10 -8 H10 Q12 -8 12 -6 V5 Q12 7 10 7 H-2 L-7 11 V7 H-10 Q-12 7 -12 5 V-6 Q-12 -8 -10 -8 Z" fill="none" stroke="${c}" stroke-width="1.8" stroke-linejoin="round"/><path d="M-7 -2 H7 M-7 2.5 H3" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/>`,
    propuesta: (c) => `<rect x="-9" y="-11" width="18" height="22" rx="2.5" fill="none" stroke="${c}" stroke-width="1.8"/><path d="M-5 -5 H5 M-5 0 H2" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/><rect x="-5" y="4" width="10" height="3.6" rx="1.4" fill="${c}"/>`,
    escudo: (c) => `<path d="M0 -12 L10 -8 V0 C10 6.5 5.5 10.5 0 12.5 C-5.5 10.5 -10 6.5 -10 0 V-8 Z" fill="none" stroke="${c}" stroke-width="1.8" stroke-linejoin="round"/><path d="M-4.5 0 L-1 3.5 L5 -3" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`,
    recibo: (c) => `<path d="M-8 -11 H8 V11 L5 9 L2 11 L-1 9 L-4 11 L-8 9 Z" fill="none" stroke="${c}" stroke-width="1.8" stroke-linejoin="round"/><path d="M-4.5 -5 H4.5 M-4.5 -0.5 H4.5 M-4.5 4 H1" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/>`,
    casa: (c) => `<path d="M-11 -1 L0 -11 L11 -1 M-8 -3 V10 H8 V-3" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><rect x="-2.6" y="3" width="5.2" height="7" rx="1" fill="${c}"/>`,
    reloj: (c) => `<circle r="10" fill="none" stroke="${c}" stroke-width="1.8"/><path d="M0 -5.5 V0 L4 3" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/>`,
    canilla: (c) => `<path d="M-9 -4 H3 Q8 -4 8 1 V4 M-9 -8 V0 M-12 -8 H-6" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 7.5 C9.6 9.6 9.6 11 8 11.5 C6.4 11 6.4 9.6 8 7.5 Z" fill="${c}"/>`,
    rayo: (c) => `<path d="M2 -11 L-7 2 H0 L-2 11 L7 -2 H0 Z" fill="none" stroke="${c}" stroke-width="1.8" stroke-linejoin="round"/>`,
    llama: (c) => `<path d="M0 -11 C6 -4 8 0 8 4 A8 8 0 0 1 -8 4 C-8 -1 -3 -4 0 -11 Z" fill="none" stroke="${c}" stroke-width="1.8" stroke-linejoin="round"/>`,
    llave: (c) => `<circle cx="-5" cy="5" r="4.6" fill="none" stroke="${c}" stroke-width="1.8"/><path d="M-1.6 1.6 L9 -9 M5 -5 L8 -2 M7.5 -7.5 L10 -5" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/>`,
    ladrillo: (c) => `<rect x="-11" y="-8" width="22" height="16" rx="1.6" fill="none" stroke="${c}" stroke-width="1.8"/><path d="M-11 0 H11 M-2 -8 V0 M4 0 V8" stroke="${c}" stroke-width="1.8"/>`,
    copo: (c) => `<path d="M0 -11 V11 M-9.5 -5.5 L9.5 5.5 M-9.5 5.5 L9.5 -5.5" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/>`,
  };
  const baldosa = (cx, cy, n, fondo, trazo, lado = 38, k = 1) => `<g transform="translate(${cx} ${cy})"><rect x="${-lado / 2}" y="${-lado / 2}" width="${lado}" height="${lado}" rx="${lado * 0.24}" fill="${fondo}"/><g transform="scale(${k})">${ico[n](trazo)}</g></g>`;

  const E = {
    // quien necesita un arreglo cuenta qué pasa desde el celular: rubro, qué pasa, publicar
    pedir(p) {
      let s = piso(p, 206);
      // bacha con la canilla que gotea
      s += `<rect x="34" y="150" width="104" height="56" rx="4" fill="${p.hueso}"/><path d="M86 154 V202" stroke="${p.linea}" stroke-width=".8" opacity=".3"/><circle cx="78" cy="178" r="2" fill="${p.prof}"/><circle cx="94" cy="178" r="2" fill="${p.prof}"/>`;
      s += `<rect x="28" y="142" width="116" height="10" rx="3" fill="${p.piedra}"/><path d="M52 142 Q86 162 120 142 Z" fill="${p.suave}"/>`;
      s += `<path d="M86 142 V116 Q86 108 94 108 H104 Q110 108 110 114 V120" fill="none" stroke="${p.prof}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M80 116 H92" stroke="${p.prof}" stroke-width="5" stroke-linecap="round"/>`;
      s += `<path d="M110 128 C113 133 113 137 110 138.5 C107 137 107 133 110 128 Z" fill="${p.azul}"/><path d="M104 147 Q110 144 116 147" fill="none" stroke="${p.azul}" stroke-width="1.2" opacity=".6"/>`;
      // la vecina con el celular
      s += persona(p, 184, 206, 1.02, { pose: 'celular', pelo: 'largo', ropa: p.medio, piel: 0 });
      // el pedido, en grande: seis rubros y el elegido
      s += `<g transform="translate(252 22)"><rect width="104" height="176" rx="17" fill="${NEGRO}"/><rect x="5" y="5" width="94" height="166" rx="13" fill="${p.papel}"/>`;
      s += barra(16, 20, 48, 6, p.suave, 3) + barra(16, 31, 30, 5, p.cielo, 2.5);
      const rub = ['rayo', 'canilla', 'llama', 'llave', 'ladrillo', 'copo'];
      rub.forEach((n, i) => { s += baldosa(28 + (i % 3) * 24, 58 + Math.floor(i / 3) * 26, n, i === 1 ? p.azul : '#ECECEC', i === 1 ? '#FFFFFF' : NEGRO, 21, 0.56); });
      s += barra(16, 98, 72, 30, p.cielo, 6) + barra(24, 106, 40, 5, p.suave, 2.5) + barra(24, 115, 28, 4, p.papel, 2);
      s += barra(16, 146, 72, 14, p.azul, 7) + `<path d="M46 153 H58 M53 149 L58 153 L53 157" fill="none" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`;
      s += `</g>` + tilde(304, 70, 9);
      s += `<path d="M190 82 C204 52 226 44 248 50" fill="none" stroke="${p.linea}" stroke-width="1.1" stroke-dasharray="1 5" stroke-linecap="round"/>`;
      return s;
    },
    // el día del turno: llega quien elegiste, a la hora acordada
    llega(p) {
      let s = piso(p, 206);
      s += camioneta(p, 16, 206, 104);
      s += chalet(p, 168, 206, 176, false);
      s += persona(p, 218, 206, 1.0, { pose: 'caja', pelo: 'gorra', ropa: p.prof, piel: 1 });
      s += persona(p, 318, 206, 0.98, { pose: 'saluda', pelo: 'rodete', ropa: p.medio, piel: 2 });
      // el turno, como tarjeta
      s += `<g transform="translate(28 34)"><rect width="128" height="50" rx="10" fill="${p.papel}" stroke="${p.suave}"/><g transform="translate(24 25)">${ico.reloj(NEGRO)}</g>${barra(46, 15, 58, 7, p.suave, 3.5)}${barra(46, 28, 38, 6, p.cielo, 3)}</g>`;
      s += tilde(150, 38, 10);
      s += `<path d="M160 64 C186 66 204 76 212 94" fill="none" stroke="${p.linea}" stroke-width="1.1" stroke-dasharray="1 5" stroke-linecap="round"/>`;
      return s;
    },
    // adentro de Handyx: lo que se pierde si se arregla por fuera
    adentro(p) {
      let s = `<rect x="22" y="16" width="356" height="206" rx="34" fill="${p.cielo}" opacity=".75"/><rect x="22" y="16" width="356" height="206" rx="34" fill="none" stroke="${p.linea}" stroke-width="1.1" stroke-dasharray="2 4" opacity=".55"/>`;
      s += `<g transform="translate(200 16)"><rect x="-36" y="-10" width="72" height="20" rx="10" fill="${p.papel}" stroke="${p.suave}"/><text y="4.6" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="800" font-size="12" fill="${p.tinta}">Handyx</text></g>`;
      s += piso(p, 200, 40, 360);
      s += persona(p, 82, 200, 0.94, { pose: 'celular', pelo: 'largo', ropa: p.medio, piel: 0 });
      s += persona(p, 318, 200, 0.94, { pose: 'caja', pelo: 'gorra', ropa: p.prof, piel: 1 });
      s += `<path d="M112 110 C150 60 250 60 288 110" fill="none" stroke="${p.linea}" stroke-width="1.1" stroke-dasharray="1 5" stroke-linecap="round"/>`;
      const it = [['propuesta', 140, 108], ['chat', 170, 74], ['escudo', 200, 62], ['recibo', 230, 74], ['casa', 260, 108]];
      it.forEach(([n, x, y]) => { s += `<g transform="translate(${x} ${y})"><rect x="-19" y="-19" width="38" height="38" rx="9" fill="${n === 'escudo' ? p.amar : p.papel}" stroke="${n === 'escudo' ? 'none' : p.suave}"/>${ico[n](NEGRO)}</g>`; });
      s += `<g transform="translate(200 148)"><rect x="-44" y="-15" width="88" height="30" rx="8" fill="${p.papel}" stroke="${p.suave}"/>${barra(-34, -6, 50, 5, p.suave, 2.5)}${barra(-34, 3, 34, 4, p.cielo, 2)}<circle cx="28" cy="0" r="6" fill="${p.azul}"/><path d="M25.4 0 L27.4 2 L31 -2" fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></g>`;
      return s;
    },
  };

  document.querySelectorAll('[data-esc02]').forEach((el) => {
    const p = T.claro, f = E[el.dataset.esc02];
    if (!f) return;
    const fondo = el.dataset.fondo === 'no' ? '' : `<circle cx="200" cy="124" r="112" fill="${p.cielo}" opacity=".7"/>`;
    el.innerHTML = `<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ilustración: ${el.dataset.esc02}" style="display:block;width:100%;height:auto;overflow:visible">${fondo}${f(p)}</svg>`;
  });
})();
