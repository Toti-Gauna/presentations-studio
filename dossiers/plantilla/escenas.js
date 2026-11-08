// Escenas de producto de la Colección Handyx (dirección v3 · editorial): ilustraciones que explican qué hace cada parte
// del producto sin mostrar una pantalla. Estilo: planos de color de la marca + trazos finos navy, personas sin cara,
// mucho aire, un solo acento amarillo por escena. Todo vectorial, dibujado en código.
// Uso: <div data-escena="conectar|propuestas|verificar|pago|obra|barrios|reclamo|camino|equipo|agenda" data-tono="claro|oscuro"></div>
// (claro = sobre papel; oscuro = sobre navy). Se reemplaza al cargar, antes de que el exportador mida la página.
(function () {
  const T = {
    claro: { tinta: '#0E1D36', linea: '#0E1D36', suave: '#C9D6EE', papel: '#FFFFFF', piso: 'rgba(14,29,54,0.10)', azul: '#1F57A8', medio: '#2C66B8', prof: '#143E7E', cielo: '#E9EFF9', amar: '#F5F59A', amarFuerte: '#E8D84A', hueso: '#F7F6F1', arena: '#F3F0E8', piedra: '#E2DCCD', piel: ['#E7B48C', '#C98C62', '#8D5B3B'], pelo: '#26324A', pantalon: '#26324A' },
    oscuro: { tinta: '#FFFFFF', linea: '#E9EFF9', suave: '#2C4A7A', papel: '#13284A', piso: 'rgba(0,0,0,0.28)', azul: '#2C66B8', medio: '#3A76CC', prof: '#1F57A8', cielo: '#1B3560', amar: '#F5F59A', amarFuerte: '#F5F59A', hueso: '#E9EFF9', arena: '#22385E', piedra: '#2C4A7A', piel: ['#D9A27C', '#B47A55', '#7A4E33'], pelo: '#060E1C', pantalon: '#060E1C' },
  };

  // ---------- piezas ----------
  // persona de pie, origen en los pies; pose: 'quieta' | 'celular' | 'caja' | 'saluda' | 'senala'; sin cara
  function persona(p, x, y, s, o = {}) {
    const piel = p.piel[o.piel ?? 0], ropa = o.ropa || p.azul, pan = o.pantalon || p.pantalon, pose = o.pose || 'quieta';
    const brazo = (d) => `<path d="${d}" fill="none" stroke="${ropa}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;
    const mano = (cx, cy) => `<circle cx="${cx}" cy="${cy}" r="3.3" fill="${piel}"/>`;
    let g = `<ellipse cx="0" cy="0" rx="19" ry="3.2" fill="${p.piso}"/>`;
    g += `<path d="M-12 -72 L-3 -72 L-5 -4 L-11.5 -4 Z M3 -72 L12 -72 L11.5 -4 L5 -4 Z" fill="${pan}"/>`;
    g += `<rect x="-14.5" y="-5" width="11" height="5" rx="2.5" fill="${p.linea === '#0E1D36' ? '#0E1D36' : '#060E1C'}"/><rect x="3.5" y="-5" width="11" height="5" rx="2.5" fill="${p.linea === '#0E1D36' ? '#0E1D36' : '#060E1C'}"/>`;
    // brazo de atrás
    if (pose === 'caja') g += brazo('M13 -118 C17 -104 18 -94 17 -84') + mano(17, -82) + `<rect x="9" y="-80" width="22" height="15" rx="2" fill="${o.caja || p.amarFuerte}"/><path d="M15 -80 V-84 H25 V-80" fill="none" stroke="${p.linea}" stroke-width="1.6"/><path d="M9 -74 H31" stroke="${p.linea}" stroke-width="1" opacity=".35"/>`;
    g += `<path d="M-15 -72 L15 -72 L13.5 -117 C12.5 -123 6.5 -126 0 -126 C-6.5 -126 -12.5 -123 -13.5 -117 Z" fill="${ropa}"/>`;
    g += `<path d="M-4 -126 L0 -119 L4 -126" fill="none" stroke="${p.papel}" stroke-width="1.2" opacity=".55"/>`;
    g += `<rect x="-3" y="-132" width="6" height="8" fill="${piel}"/><ellipse cx="0" cy="-141" rx="9" ry="10.5" fill="${piel}"/>`;
    const pelo = o.pelo || 'corto';
    if (pelo === 'largo') g += `<path d="M-10 -140 C-11 -154 -2 -156 3 -154.5 C10 -153 11 -146 10.5 -139 C11 -132 12 -127 14 -123 L6 -124 C7 -132 6 -140 3 -144 C-2 -140 -7 -140 -10 -140 Z" fill="${p.pelo}"/><path d="M-10 -140 C-11 -132 -12 -127 -13 -123 L-7 -124 C-8 -130 -8 -136 -10 -140 Z" fill="${p.pelo}"/>`;
    else if (pelo === 'gorra') g += `<path d="M-9.6 -142 C-10 -154 10 -154 9.6 -142 Z" fill="${o.gorra || p.prof}"/><path d="M8 -143.5 H18 C19 -143.5 19 -141.5 18 -141.5 H8 Z" fill="${o.gorra || p.prof}"/>`;
    else if (pelo === 'rodete') g += `<path d="M-9.5 -141 C-10 -153 -2 -155 3 -153.5 C9 -152 10 -146 9.6 -141 C7 -146 -6 -147 -9.5 -141 Z" fill="${p.pelo}"/><circle cx="-3" cy="-153" r="4.4" fill="${p.pelo}"/>`;
    else g += `<path d="M-9.5 -141 C-10 -153 -2 -155 3 -153.5 C9 -152 10 -146 9.6 -141 C7 -146 -6 -147 -9.5 -141 Z" fill="${p.pelo}"/>`;
    // brazo de adelante según la pose
    if (pose === 'celular') g += brazo('M-13 -118 C-17 -104 -14 -98 -5 -101') + mano(-4, -102) + `<rect x="-7" y="-115" width="9" height="15" rx="2" fill="${p.linea === '#0E1D36' ? '#0E1D36' : '#060E1C'}"/><rect x="-6" y="-113.6" width="7" height="11.5" rx="1" fill="${p.amar}"/>`;
    else if (pose === 'saluda') g += brazo('M-13 -118 C-22 -126 -24 -138 -21 -148') + mano(-21, -150);
    else if (pose === 'senala') g += brazo('M-13 -118 C-24 -112 -32 -108 -40 -108') + mano(-41, -108);
    else g += brazo('M-13 -118 C-17 -104 -18 -94 -17 -84') + mano(-17, -82);
    if (pose !== 'caja') g += brazo('M13 -118 C17 -104 18 -94 17 -84') + mano(17, -82);
    return `<g transform="translate(${x} ${y}) scale(${s})">${g}</g>`;
  }
  // chalet marplatense: piedra abajo, revoque arriba, techo a dos aguas, una ventana con luz
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
    g += `<rect x="${x + w * 0.06}" y="${y - h * 0.62}" width="${w * 0.5}" height="${h * 0.12}" rx="2" fill="${p.amar}"/>`;
    for (const cx of [x + w * 0.2, x + w * 0.78]) g += `<circle cx="${cx}" cy="${y - 9}" r="${w * 0.085}" fill="${p.linea === '#0E1D36' ? '#0E1D36' : '#060E1C'}"/><circle cx="${cx}" cy="${y - 9}" r="${w * 0.035}" fill="${p.suave}"/>`;
    return g;
  }
  function celu(p, x, y, w = 40, contenido = '') {
    const h = w * 2.05;
    return `<g transform="translate(${x} ${y})"><rect x="0" y="0" width="${w}" height="${h}" rx="${w * 0.18}" fill="${p.linea === '#0E1D36' ? '#0E1D36' : '#060E1C'}"/><rect x="${w * 0.06}" y="${w * 0.06}" width="${w * 0.88}" height="${h - w * 0.12}" rx="${w * 0.13}" fill="${p.papel === '#FFFFFF' ? '#FFFFFF' : '#E9EFF9'}"/>${contenido}</g>`;
  }
  const barra = (x, y, w, h, f, r = 2) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${f}"/>`;
  const piso = (p, y, x1 = 10, x2 = 390) => `<path d="M${x1} ${y} H${x2}" stroke="${p.linea}" stroke-width=".8" opacity=".25"/>`;

  // ---------- escenas (viewBox 400 × 240) ----------
  const E = {
    // quien necesita un arreglo y quien sabe hacerlo, unidos por un pedido
    conectar(p) {
      let s = piso(p, 206);
      s += chalet(p, 26, 206, 96);
      s += persona(p, 148, 206, 1.02, { pose: 'celular', pelo: 'largo', ropa: p.medio, piel: 0 });
      s += camioneta(p, 262, 206, 116);
      s += persona(p, 238, 206, 1.02, { pose: 'caja', pelo: 'gorra', ropa: p.prof, piel: 1 });
      s += `<path d="M150 92 C170 30 222 30 240 72" fill="none" stroke="${p.linea}" stroke-width="1.1" stroke-dasharray="1 5" stroke-linecap="round"/>`;
      s += `<circle cx="195" cy="41" r="11" fill="${p.amar}"/><circle cx="195" cy="41" r="17" fill="none" stroke="${p.amar}" stroke-width="1" opacity=".7"/><path d="M190 41 L194 45 L201 37" fill="none" stroke="#0E1D36" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
      return s;
    },
    // varias propuestas para comparar; se elige una
    propuestas(p) {
      let s = '';
      const carta = (x, y, r, elegida) => `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-58" y="-74" width="116" height="148" rx="10" fill="${p.papel}" stroke="${elegida ? p.azul : p.suave}" stroke-width="${elegida ? 2 : 1}"/><circle cx="-36" cy="-48" r="11" fill="${elegida ? p.azul : p.cielo}"/>${barra(-20, -54, 54, 6, p.suave, 3)}${barra(-20, -43, 34, 5, p.cielo, 2.5)}${barra(-40, -18, 80, 13, elegida ? p.tinta : p.suave, 4)}${barra(-40, 6, 36, 18, p.cielo, 4)}${barra(4, 6, 36, 18, p.cielo, 4)}${barra(-40, 44, 80, 16, elegida ? p.azul : p.cielo, 8)}${elegida ? `<path d="M-8 52 L-2 58 L10 46" fill="none" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>` : ''}</g>`;
      s += carta(130, 128, -9, false) + carta(270, 128, 9, false) + carta(200, 116, 0, true);
      s += `<circle cx="252" cy="44" r="12" fill="${p.amar}"/><path d="M247 44 L251 48 L258 40" fill="none" stroke="#0E1D36" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
      return s;
    },
    // el equipo revisa documentos y habilita; los antecedentes se muestran en persona
    verificar(p) {
      let s = piso(p, 206);
      s += `<g transform="translate(70 70) rotate(-6)"><rect width="150" height="96" rx="10" fill="${p.papel}" stroke="${p.suave}"/><rect x="14" y="16" width="40" height="50" rx="6" fill="${p.cielo}"/><circle cx="34" cy="34" r="9" fill="${p.suave}"/><path d="M20 62 C22 50 46 50 48 62 Z" fill="${p.suave}"/>${barra(66, 20, 66, 7, p.suave, 3.5)}${barra(66, 34, 48, 6, p.cielo, 3)}${barra(66, 46, 58, 6, p.cielo, 3)}${barra(14, 76, 118, 6, p.cielo, 3)}</g>`;
      s += `<g transform="translate(150 98) rotate(5)"><rect width="120" height="100" rx="8" fill="${p.papel}" stroke="${p.suave}"/>${barra(14, 16, 70, 7, p.suave, 3.5)}${[0, 1, 2, 3].map((k) => barra(14, 34 + k * 12, 92 - k * 10, 5, p.cielo, 2.5)).join('')}</g>`;
      s += `<g transform="translate(262 120)"><circle r="34" fill="${p.amar}"/><circle r="27" fill="none" stroke="#0E1D36" stroke-width="1.2" stroke-dasharray="2 3"/><path d="M-12 0 L-3 9 L14 -9" fill="none" stroke="#0E1D36" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/></g>`;
      s += persona(p, 340, 206, .96, { pose: 'senala', pelo: 'rodete', ropa: p.azul, piel: 2 });
      return s;
    },
    // la plata va directo de quien pide a quien trabaja; Handyx queda afuera del circuito
    pago(p) {
      let s = piso(p, 206);
      s += persona(p, 120, 206, 1.02, { pose: 'quieta', pelo: 'largo', ropa: p.medio, piel: 0 });
      s += persona(p, 282, 206, 1.02, { pose: 'quieta', pelo: 'gorra', ropa: p.prof, piel: 1 });
      s += `<path d="M146 112 C180 92 222 92 256 112" fill="none" stroke="${p.azul}" stroke-width="2.4" stroke-linecap="round"/><path d="M250 104 L258 113 L246 116" fill="none" stroke="${p.azul}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`;
      s += `<g transform="translate(201 92)"><rect x="-17" y="-11" width="34" height="22" rx="4" fill="${p.amar}"/><circle r="6" fill="none" stroke="#0E1D36" stroke-width="1.4"/><path d="M0 -3 V3" stroke="#0E1D36" stroke-width="1.4"/></g>`;
      s += `<g transform="translate(201 176)"><rect x="-34" y="-12" width="68" height="24" rx="12" fill="none" stroke="${p.linea}" stroke-width="1" stroke-dasharray="2 3" opacity=".6"/><text y="4.5" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="800" font-size="12" fill="${p.tinta}" opacity=".7">Handyx</text></g>`;
      return s;
    },
    // una obra por etapas: andamio, avance y quién hace cada parte
    obra(p) {
      let s = piso(p, 206);
      s += chalet(p, 120, 206, 150, false);
      s += `<g stroke="${p.linea}" stroke-width="1.6" opacity=".7">${[0, 1, 2, 3].map((k) => `<path d="M${108 + k * 58} 206 V84"/>`).join('')}${[0, 1, 2].map((k) => `<path d="M108 ${190 - k * 40} H282"/>`).join('')}</g>`;
      s += `<rect x="108" y="146" width="174" height="5" fill="${p.amarFuerte}"/>`;
      s += persona(p, 160, 146, .62, { pose: 'caja', pelo: 'gorra', ropa: p.prof, piel: 1 });
      s += persona(p, 236, 206, .7, { pose: 'senala', pelo: 'corto', ropa: p.azul, piel: 2 });
      s += `<g transform="translate(40 40)">${[0, 1, 2, 3].map((k) => `<circle cx="0" cy="${k * 34}" r="9" fill="${k < 2 ? p.azul : p.papel}" stroke="${p.azul}" stroke-width="1.6"/>${k < 2 ? `<path d="M-4 ${k * 34} L-1 ${k * 34 + 3} L4.5 ${k * 34 - 3}" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round"/>` : ''}${k < 3 ? `<path d="M0 ${k * 34 + 9} V${k * 34 + 25}" stroke="${p.azul}" stroke-width="1.6"/>` : ''}`).join('')}</g>`;
      s += `<circle cx="40" cy="108" r="13" fill="none" stroke="${p.amarFuerte}" stroke-width="2"/>`;
      return s;
    },
    // el portal mira la ciudad por barrios: dónde hay pedidos, dónde faltan especialistas
    barrios(p) {
      let s = '';
      const zonas = [[40, 40, 90, 60], [134, 30, 70, 74], [208, 44, 86, 52], [298, 30, 70, 70], [40, 104, 70, 70], [114, 108, 96, 54], [214, 100, 70, 74], [288, 104, 80, 56], [60, 178, 110, 40], [174, 166, 110, 52], [288, 164, 80, 54]];
      const d = [3, 6, 2, 1, 4, 8, 5, 2, 3, 6, 1];
      zonas.forEach(([x, y, w, h], i) => { s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${d[i] > 5 ? p.azul : d[i] > 3 ? p.medio : p.cielo}" opacity="${d[i] > 3 ? 1 : .9}"/>`; for (let k = 0; k < d[i]; k++) s += `<circle cx="${x + 10 + ((k * 23) % (w - 18))}" cy="${y + 12 + Math.floor((k * 23) / (w - 18)) * 14}" r="3" fill="${d[i] > 3 ? '#FFFFFF' : p.azul}"/>`; });
      s += `<g transform="translate(250 126)"><path d="M0 0 C-11 -14 -14 -20 -14 -27 A14 14 0 0 1 14 -27 C14 -20 11 -14 0 0 Z" fill="${p.amar}" stroke="#0E1D36" stroke-width="1.2"/><circle cy="-27" r="5" fill="#0E1D36"/></g>`;
      return s;
    },
    // un reclamo con dueño, plazo y respuesta por escrito
    reclamo(p) {
      let s = '';
      const burbuja = (x, y, w, h, f, cola) => `<path d="M${x + 10} ${y} H${x + w - 10} Q${x + w} ${y} ${x + w} ${y + 10} V${y + h - 10} Q${x + w} ${y + h} ${x + w - 10} ${y + h} H${cola === 'izq' ? x + 26 : x + w - 26} L${cola === 'izq' ? x + 14 : x + w - 14} ${y + h + 12} L${cola === 'izq' ? x + 16 : x + w - 18} ${y + h} H${x + 10} Q${x} ${y + h} ${x} ${y + h - 10} V${y + 10} Q${x} ${y} ${x + 10} ${y} Z" fill="${f}"/>`;
      s += burbuja(40, 30, 170, 54, p.cielo, 'izq') + barra(56, 46, 110, 7, p.suave, 3.5) + barra(56, 60, 80, 6, p.papel, 3);
      s += burbuja(190, 104, 170, 54, p.azul, 'der') + barra(206, 120, 120, 7, '#FFFFFF', 3.5) + barra(206, 134, 86, 6, p.medio, 3);
      s += `<g transform="translate(70 168)"><rect width="120" height="48" rx="8" fill="${p.papel}" stroke="${p.suave}"/><circle cx="22" cy="24" r="10" fill="${p.amar}"/><path d="M22 18 V24 L27 27" fill="none" stroke="#0E1D36" stroke-width="1.6" stroke-linecap="round"/>${barra(42, 16, 60, 6, p.suave, 3)}${barra(42, 28, 40, 5, p.cielo, 2.5)}</g>`;
      s += `<path d="M205 192 H330" stroke="${p.linea}" stroke-width="1" opacity=".3"/>` + [0, 1, 2].map((k) => `<circle cx="${220 + k * 50}" cy="192" r="7" fill="${k < 2 ? p.azul : p.papel}" stroke="${p.azul}" stroke-width="1.6"/>`).join('');
      return s;
    },
    // el camino del especialista: se sube con trabajos verificados, nada se resta
    camino(p) {
      let s = piso(p, 206);
      [0, 1, 2, 3, 4].forEach((k) => { s += `<rect x="${70 + k * 56}" y="${206 - 26 - k * 26}" width="56" height="${26 + k * 26}" fill="${k === 4 ? p.azul : k % 2 ? p.cielo : p.suave}"/>`; });
      s += `<path d="M350 50 V102" stroke="${p.linea}" stroke-width="1.6"/><path d="M350 50 L376 58 L350 66 Z" fill="${p.amar}"/>`;
      s += persona(p, 240, 128, .62, { pose: 'caja', pelo: 'gorra', ropa: p.prof, piel: 1 });
      s += `<path d="M84 160 C140 130 200 110 300 84" fill="none" stroke="${p.linea}" stroke-width="1" stroke-dasharray="1 5" stroke-linecap="round"/>`;
      return s;
    },
    // el equipo trabaja con la ciudad: preregistros, campañas y métricas
    equipo(p) {
      let s = piso(p, 206);
      s += `<rect x="60" y="150" width="200" height="8" rx="3" fill="${p.prof}"/><path d="M80 158 V206 M240 158 V206" stroke="${p.prof}" stroke-width="5"/>`;
      s += `<path d="M98 150 L104 92 H214 L220 150 Z" fill="${p.linea === '#0E1D36' ? '#0E1D36' : '#060E1C'}"/><rect x="108" y="98" width="102" height="46" rx="2" fill="${p.papel}"/>`;
      s += barra(114, 104, 26, 34, p.cielo, 3) + barra(146, 104, 58, 14, p.azul, 3) + barra(146, 122, 26, 16, p.amar, 3) + barra(176, 122, 28, 16, p.cielo, 3);
      s += persona(p, 300, 206, 1, { pose: 'senala', pelo: 'rodete', ropa: p.medio, piel: 0 });
      s += `<g transform="translate(160 22)"><rect x="-12" y="-6" width="84" height="58" rx="8" fill="${p.papel}" stroke="${p.suave}"/>${[0, 1, 2].map((k) => `<rect x="${k * 22}" y="${44 - [16, 28, 40][k]}" width="14" height="${[16, 28, 40][k]}" rx="3" fill="${k === 2 ? p.amarFuerte : p.medio}"/>`).join('')}</g><path d="M190 80 V92" stroke="${p.linea}" stroke-width="1" stroke-dasharray="1 3"/>`;
      return s;
    },
    // el especialista arma su agenda; el cliente propone y el especialista confirma
    agenda(p) {
      let s = `<rect x="70" y="30" width="260" height="180" rx="14" fill="${p.papel}" stroke="${p.suave}"/>` + barra(70, 30, 260, 34, p.azul, 14) + `<rect x="70" y="50" width="260" height="14" fill="${p.azul}"/>`;
      for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) { const x = 86 + c * 40, y = 78 + r * 32; const v = (r * 6 + c) % 7; s += `<rect x="${x}" y="${y}" width="32" height="24" rx="5" fill="${v === 3 ? p.amar : v === 5 ? p.cielo : p.hueso}" stroke="${p.suave}" stroke-width=".6"/>`; }
      s += `<circle cx="300" cy="47" r="7" fill="${p.amar}"/>` + barra(90, 43, 70, 7, '#FFFFFF', 3.5);
      return s;
    },
  };

  function reemplazar() {
    document.querySelectorAll('[data-escena]').forEach((el) => {
      const p = T[el.dataset.tono || 'claro'] || T.claro, f = E[el.dataset.escena];
      if (!f) return;
      const fondo = el.dataset.fondo === 'no' ? '' : `<circle cx="200" cy="124" r="112" fill="${p.cielo}" opacity="${el.dataset.tono === 'oscuro' ? .5 : .7}"/>`;
      el.innerHTML = `<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ilustración: ${el.dataset.escena}" style="display:block;width:100%;height:auto;overflow:visible">${fondo}${f(p)}</svg>`;
    });
  }
  window.__escenas = reemplazar;
  window.__escenasLista = Object.keys(E);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', reemplazar); else reemplazar();
})();
