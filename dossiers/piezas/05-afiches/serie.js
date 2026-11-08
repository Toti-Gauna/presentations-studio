// Serie «Se rompió algo en casa» · 10 afiches A3, uno por barrio. Cada lámina dibuja un problema real del hogar
// (un rubro de Handyx) con un estilo propio; arriba el titular, abajo el talón con el QR del barrio.
// Depende de R, P, C, L, fondo, az y K (definidos en index.html). Unidades: mm del formato final.
const ALTO = 323; // el dibujo llega hasta el talón

// 01 · Centro · Plomería · art déco: un caño que revienta en abanico, como un sol de agua
function canio() {
  let s = fondo(K.navy, ALTO);
  for (let i = 0; i <= 40; i++) { const a = Math.PI + (i / 40) * Math.PI; s += L(148.5 + 70 * Math.cos(a), 206 + 70 * Math.sin(a), 148.5 + 330 * Math.cos(a), 206 + 330 * Math.sin(a), K.medio, .5, 'opacity=".45"'); }
  const r = az(3);
  for (let i = 0; i < 17; i++) {
    const a = (-162 + i * 9) * Math.PI / 180, l = 72 + (i % 3) * 14 + r() * 10, w = 2.4 * Math.PI / 180;
    const x1 = 148.5 + l * Math.cos(a - w), y1 = 194 + l * Math.sin(a - w), x2 = 148.5 + l * Math.cos(a + w), y2 = 194 + l * Math.sin(a + w);
    s += P(`M148.5 194 L${x1} ${y1} A${l} ${l} 0 0 1 ${x2} ${y2} Z`, i % 2 ? K.cielo : '#FFFFFF', 'opacity=".95"');
    s += C(148.5 + (l + 7) * Math.cos(a), 194 + (l + 7) * Math.sin(a), 1.6 + r() * 1.4, K.cielo);
  }
  // el caño, sus bridas y la fisura
  s += R(-3, 196, 303, 28, K.azul) + R(-3, 199, 303, 5, K.medio) + R(-3, 217, 303, 7, K.prof);
  for (const x of [36, 260]) s += R(x - 9, 191, 18, 38, K.prof, 'rx="2"') + C(x, 196, 1.3, K.amar) + C(x, 219, 1.3, K.amar);
  s += R(128, 186, 41, 48, K.prof, 'rx="3"') + [[134, 192], [163, 192], [134, 228], [163, 228]].map(([x, y]) => C(x, y, 1.8, K.amar)).join('');
  s += P('M148.5 186 L145 196 L152 204 L146 214', 'none', `stroke="${K.amar}" stroke-width="1.6" stroke-linejoin="round"`);
  // el charco
  for (let k = 0; k < 4; k++) s += `<ellipse cx="148.5" cy="${290 + k * 2}" rx="${118 - k * 24}" ry="${10 - k * 2}" fill="none" stroke="${K.cielo}" stroke-width=".7" opacity="${.7 - k * .12}"/>`;
  s += R(-3, 300, 303, 23, K.prof);
  return s;
}

// 02 · Güemes · Cerrajería · Bauhaus: la llave gira y la puerta no; la llave partida en la cerradura
function cerradura() {
  let s = fondo(K.hueso, ALTO);
  for (let x = 18; x < 290; x += 43.5) s += L(x, 0, x, 323, K.navy, .25, 'opacity=".22"');
  s += C(214, 176, 66, K.amar);
  s += P('M60 150 A62 62 0 0 1 184 150 Z', K.navy) + R(60, 150, 124, 158, K.azul) + R(72, 166, 100, 58, K.medio) + R(72, 234, 100, 62, K.medio);
  s += R(157, 214, 17, 34, K.navy, 'rx="2"') + C(165.5, 225, 3, K.hueso) + R(164, 225, 3, 9, K.hueso);
  // la llave partida: un trozo adentro, el otro afuera con la cabeza
  s += R(170, 222, 14, 5, K.navy) + P('M192 219 L224 222 L224 228 L192 231 Z', K.navy) + C(240, 224.5, 15, K.navy) + C(240, 224.5, 5.4, K.amar) + R(206, 228, 3, 5, K.navy) + R(213, 228, 3, 7, K.navy);
  s += P('M184 219 L188 216 L187 222 Z', K.navy) + P('M185 230 L190 234 L186 236 Z', K.navy) + P('M189 224 L192 221 L192 229 Z', K.navy);
  s += P('M240 196 A28.5 28.5 0 0 1 268 220', 'none', `stroke="${K.navy}" stroke-width="1.6" stroke-linecap="round"`) + P('M266 214 L268.4 221 L261.6 220 Z', K.navy);
  s += R(-3, 308, 303, 15, K.navy) + R(40, 300, 164, 8, K.borde);
  return s;
}

// 03 · Playa Grande · Electricidad · risografía: el tomacorriente que chispea, en dos tintas con trama
function enchufe() {
  let s = fondo('#F4F1E6', ALTO);
  s += `<pattern id="t3a" width="3.2" height="3.2" patternUnits="userSpaceOnUse"><circle cx="1.6" cy="1.6" r=".6" fill="${K.azul}"/></pattern>
    <pattern id="t3b" width="3.2" height="3.2" patternUnits="userSpaceOnUse"><circle cx="1.6" cy="1.6" r="1.15" fill="${K.azul}"/></pattern>`;
  s += R(-3, -3, 303, 326, 'url(#t3a)');
  const m = 'style="mix-blend-mode:multiply"';
  s += R(82, 106, 170, 170, K.amar, `rx="24" ${m}`) + R(76, 112, 170, 170, K.azul, `rx="24" ${m}`) + R(76, 112, 170, 170, 'url(#t3b)', 'rx="24"');
  s += C(161, 197, 58, '#F4F1E6') + C(161, 197, 58, 'url(#t3a)') + C(161, 197, 58, 'none', `stroke="${K.azul}" stroke-width="1.4"`);
  s += R(132, 168, 10, 34, K.azul, 'rx="2" transform="rotate(28 137 185)"') + R(180, 168, 10, 34, K.azul, 'rx="2" transform="rotate(-28 185 185)"') + R(156, 208, 10, 26, K.azul, 'rx="2"');
  // la chispa
  const rayo = (x, y, e, rot) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${e})" ${m}><path d="M13 0 L0 26 H11 L6 48 L28 16 H16 L22 0 Z" fill="${K.amar}" transform="translate(2 -2)"/><path d="M13 0 L0 26 H11 L6 48 L28 16 H16 L22 0 Z" fill="${K.azul}"/></g>`;
  s += rayo(218, 70, 1.5, 14) + rayo(256, 150, .8, -10) + rayo(52, 92, .7, -18);
  // el enchufe salido y su cable
  s += `<g ${m}><path d="M62 300 C70 270 40 260 30 300" fill="none" stroke="${K.azul}" stroke-width="6" stroke-linecap="round"/><rect x="48" y="262" width="34" height="26" rx="6" fill="${K.azul}" transform="rotate(-24 65 275)"/><rect x="66" y="252" width="4" height="12" fill="${K.azul}" transform="rotate(-54 68 258)"/></g>`;
  s += P('M-3 300 H300 V323 H-3 Z', K.azul, m) + R(-3, 300, 303, 23, 'url(#t3b)');
  return s;
}

// 04 · Los Troncos · Albañilería · plano de arquitecto: la fisura en el chalet de piedra, acotada
function grieta() {
  let s = fondo('#13284A', ALTO);
  s += `<pattern id="g5" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M5 0 H0 V5" fill="none" stroke="${K.cielo}" stroke-width=".12" opacity=".35"/></pattern>
    <pattern id="g25" width="25" height="25" patternUnits="userSpaceOnUse"><path d="M25 0 H0 V25" fill="none" stroke="${K.cielo}" stroke-width=".25" opacity=".4"/></pattern>`;
  s += R(-3, -3, 303, 326, 'url(#g5)') + R(-3, -3, 303, 326, 'url(#g25)');
  const W = 'stroke="#FFFFFF" stroke-width=".55" fill="none" stroke-linejoin="round"';
  let g = `<path d="M58 150 H240 V254 H58 Z" ${W}/><path d="M46 152 L149 76 L252 152" ${W} stroke-width=".9"/><path d="M190 104 V78 H208 V118" ${W}/>`;
  for (let k = 1; k < 14; k++) { const t = k / 14; g += L(149 - 103 * t, 76 + 76 * t, 149 + 103 * t, 76 + 76 * t, '#FFFFFF', .22, 'opacity=".55"'); }
  const r = az(11);
  for (let y = 204; y < 252; y += 8) { let x = 58 + (y % 16 ? 6 : 0); while (x < 238) { const w = 10 + r() * 14, x2 = Math.min(x + w, 240); g += `<path d="M${x + 1} ${y + 1} L${x2 - 1} ${y + 1.6} L${x2 - 1.4} ${y + 7} L${x + 1.6} ${y + 7.4} Z" ${W} stroke-width=".35"/>`; x = x2; } }
  g += `<path d="M58 204 H240" ${W}/>`;
  const ven = (x, y) => `<rect x="${x}" y="${y}" width="26" height="34" ${W}/>` + L(x + 13, y, x + 13, y + 34, '#FFFFFF', .35) + L(x, y + 17, x + 26, y + 17, '#FFFFFF', .35);
  g += ven(78, 160) + ven(194, 160) + `<path d="M134 254 V196 A15 15 0 0 1 164 196 V254" ${W}/>`;
  // la fisura y la mancha de humedad, marcadas como en un relevamiento
  g += P('M120 92 L114 112 L124 126 L116 146 L127 160 L119 182 L131 198 L124 226 L133 254', 'none', `stroke="${K.amar}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"`);
  g += P('M124 126 L134 132 L140 128 M127 160 L112 166', 'none', `stroke="${K.amar}" stroke-width=".9" stroke-linecap="round"`);
  g += P('M206 214 C222 208 236 218 234 232 C232 246 214 250 204 242 C194 236 194 220 206 214 Z', 'none', `stroke="${K.amar}" stroke-width=".7" stroke-dasharray="1.6 1.2"`);
  g += L(58, 266, 240, 266, K.cielo, .4) + L(58, 262, 58, 270, K.cielo, .4) + L(240, 262, 240, 270, K.cielo, .4);
  g += L(20, 254, 290, 254, '#FFFFFF', .9);
  return s + `<g transform="translate(0 30)">${g}</g>`;
}

// 05 · Stella Maris · Aire acondicionado · atardecer años 70: el equipo que gotea frente al sol
function aire() {
  const cielo = ['#143E7E', '#1F57A8', '#2C66B8', '#5A86C9', '#8EA9DA', '#C9D6EE', '#EFEFD0'];
  let s = cielo.map((c, i) => R(-3, -3 + i * 34, 303, 37, c)).join('');
  s += `<clipPath id="sol5"><circle cx="112" cy="196" r="70"/></clipPath>` + C(112, 196, 70, K.amar) + `<g clip-path="url(#sol5)">${[0, 1, 2, 3, 4].map((k) => R(30, 176 + k * 9, 170, 1.2 + k * 1.3, '#EFEFD0')).join('')}</g>`;
  s += R(-3, 236, 303, 87, K.prof);
  // la fachada y el equipo exterior
  s += R(212, 46, 88, 277, K.navy);
  for (let y = 58; y < 300; y += 24) s += R(226, y, 20, 12, y === 106 ? K.amar : K.prof) + R(262, y, 20, 12, K.prof);
  s += L(212, 150, 192, 150, K.navy, 2.4) + L(212, 214, 192, 214, K.navy, 2.4) + L(196, 150, 212, 166, K.navy, 1.6) + L(196, 214, 212, 198, K.navy, 1.6);
  s += R(66, 130, 132, 92, '#F7F6F1', 'rx="5"') + R(66, 210, 132, 12, K.borde, 'rx="3"');
  s += C(114, 174, 32, K.cielo) + [10, 18, 26].map((r) => C(114, 174, r, 'none', `stroke="${K.navy}" stroke-width=".7"`)).join('') + C(114, 174, 4, K.navy);
  for (let y = 146; y < 206; y += 7) s += R(156, y, 32, 2.2, K.borde, 'rx="1"');
  // las gotas
  const gota = (x, y, e) => P(`M${x} ${y} C${x + 3 * e} ${y + 6 * e} ${x + 4 * e} ${y + 9 * e} ${x} ${y + 12 * e} C${x - 4 * e} ${y + 9 * e} ${x - 3 * e} ${y + 6 * e} ${x} ${y} Z`, K.cielo);
  s += gota(96, 228, 1) + gota(124, 246, 1.2) + gota(108, 270, .9) + gota(132, 288, 1);
  for (let k = 0; k < 3; k++) s += `<ellipse cx="124" cy="${306 + k}" rx="${30 - k * 9}" ry="${4 - k}" fill="none" stroke="${K.cielo}" stroke-width=".6" opacity=".7"/>`;
  return s;
}

// 06 · Plaza Mitre · Gas · papel recortado: la cocina y el calefón que no prende
function gas() {
  const sm = 'filter="url(#sm6)"';
  let s = `<filter id="sm6" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="1.4" stdDeviation="1.6" flood-color="#0E1D36" flood-opacity=".32"/></filter>`;
  s += fondo('#DCE6F6', ALTO);
  for (let y = 0; y < 240; y += 16) for (let x = (y / 16) % 2 ? 8 : 0; x < 300; x += 16) s += R(x + .5, y + .5, 15, 15, '#E9EFF9', 'rx="1"');
  // el calefón
  s += `<g ${sm}>${R(170, 70, 84, 150, '#FFFFFF', 'rx="10"')}</g>` + R(170, 70, 84, 26, K.cielo, 'rx="10"') + R(170, 86, 84, 10, K.cielo);
  s += R(190, 120, 44, 34, K.navy, 'rx="6"') + C(212, 140, 6, 'none', `stroke="${K.medio}" stroke-width="1.2" stroke-dasharray="1.4 1.4"`);
  s += C(196, 182, 7, K.medio) + C(228, 182, 7, K.medio) + R(206, 220, 4, 36, K.borde) + R(202, 252, 12, 4, K.borde);
  s += `<g ${sm}>${P('M234 54 h10 v10 a6 6 0 0 1 -6 6 h-4 Z', K.amar)}</g>`;
  // la mesada y la cocina, con una hornalla prendida
  s += `<g ${sm}>${R(-3, 240, 303, 83, K.medio)}</g>` + `<g ${sm}>${R(24, 206, 130, 34, '#FFFFFF', 'rx="4"')}</g>`;
  for (const [x, on] of [[48, false], [84, true], [120, false]]) {
    s += `<ellipse cx="${x}" cy="215" rx="13" ry="4" fill="${K.navy}"/>`;
    if (on) s += `<g ${sm}>${P(`M${x - 11} 213 C${x - 10} 196 ${x - 4} 192 ${x - 3} 178 C${x + 2} 190 ${x + 10} 196 ${x + 11} 213 Z`, K.azul)}${P(`M${x - 7} 213 C${x - 6} 200 ${x - 1} 196 ${x} 186 C${x + 3} 196 ${x + 7} 202 ${x + 7} 213 Z`, K.cielo)}${P(`M${x - 3} 213 C${x - 2} 206 ${x} 202 ${x} 198 C${x + 1} 203 ${x + 3} 207 ${x + 3} 213 Z`, K.amar)}</g>`;
  }
  s += R(24, 240, 130, 70, K.prof) + R(36, 252, 106, 44, K.navy, 'rx="3"') + [60, 84, 108, 132].map((x) => C(x - 22, 246, 2.6, K.cielo)).join('');
  return s;
}

// 07 · La Perla · Plomería · vista cenital: la canilla que gotea toda la noche, en ondas
function canilla() {
  let s = fondo(K.azul, ALTO);
  for (let y = 0; y < 323; y += 22) s += L(-3, y, 300, y, K.medio, .5);
  for (let x = 0; x < 300; x += 22) s += L(x, -3, x, 323, K.medio, .5);
  s += C(258, 40, 14, K.amar) + C(264, 35, 12.5, K.azul);
  s += R(44, 108, 209, 200, '#F7F6F1', 'rx="34"') + R(58, 122, 181, 172, '#FFFFFF', 'rx="26"') + R(58, 122, 181, 22, K.cielo, 'rx="22" opacity=".7"');
  for (let k = 0; k < 7; k++) s += C(148.5, 214, 10 + k * 11, 'none', `stroke="${k % 2 ? K.cielo : K.medio}" stroke-width="${1.4 - k * .14}" opacity="${.95 - k * .11}"`);
  s += C(148.5, 214, 4, K.medio);
  s += C(148.5, 262, 9, K.prof) + [-4, 0, 4].map((d) => R(148.5 + d - .6, 256, 1.2, 12, '#FFFFFF')).join('');
  s += R(138, 92, 21, 72, '#DADFE8', 'rx="10"') + R(142, 92, 6, 66, '#FFFFFF', 'rx="3" opacity=".7"') + C(148.5, 156, 4, K.prof);
  s += C(110, 104, 11, '#DADFE8') + C(187, 104, 11, '#DADFE8') + C(110, 104, 4, K.prof) + C(187, 104, 4, K.amar);
  return s;
}

// 08 · Varese · Albañilería · carta náutica: la mancha de humedad del techo, en curvas de nivel
function humedad() {
  let s = fondo('#F3F0E8', ALTO);
  s += L(-3, 30, 300, 30, K.borde, 1.6) + L(-3, 34, 300, 34, K.borde, .6);
  const cx = 150, cy = 188;
  const curva = (k) => { let d = ''; for (let i = 0; i <= 72; i++) { const a = (i / 72) * Math.PI * 2; const rr = (16 + k * 13) * (1 + .16 * Math.sin(3 * a + k * .7) + .09 * Math.sin(5 * a + k * 1.3) + .05 * Math.cos(7 * a)); d += `${i ? 'L' : 'M'}${(cx + rr * Math.cos(a) * 1.25).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)} `; } return d + 'Z'; };
  const tonos = ['#E9EFF9', '#D6E1F3', '#C2D2EC', '#A9BFE3', '#8EA9DA', '#6E91CF', '#4A78C2', '#2C66B8', '#1F57A8'];
  for (let k = 8; k >= 0; k--) s += P(curva(k), tonos[8 - k], `stroke="${K.prof}" stroke-width=".35" opacity=".95"`);
  s += `<g transform="translate(252 70)">${P('M0 -14 L3 0 L0 14 L-3 0 Z', K.navy)}${P('M-14 0 L0 -3 L14 0 L0 3 Z', K.medio)}${C(0, 0, 18, 'none', `stroke="${K.navy}" stroke-width=".35"`)}</g>`;
  const gota = (x, y, e) => P(`M${x} ${y} C${x + 3 * e} ${y + 6 * e} ${x + 4 * e} ${y + 9 * e} ${x} ${y + 12 * e} C${x - 4 * e} ${y + 9 * e} ${x - 3 * e} ${y + 6 * e} ${x} ${y} Z`, K.azul);
  s += gota(150, 262, 1.1) + gota(150, 286, .8);
  s += R(40, 308, 40, 1.4, K.navy) + R(80, 308, 40, 1.4, K.azul) + R(120, 308, 40, 1.4, K.navy);
  return s;
}

// 09 · Chauvín · Electricidad · mosaico: el tablero con una térmica saltada
function termica() {
  const cols = 30, filas = 32, t = 9.9;
  const g = Array.from({ length: filas }, () => Array(cols).fill('.'));
  const pon = (r, c, v) => { if (r >= 0 && r < filas && c >= 0 && c < cols) g[r][c] = v; };
  for (let r = 9; r <= 26; r++) for (let c = 4; c <= 25; c++) pon(r, c, r === 9 || r === 26 || c === 4 || c === 25 ? 'N' : 'W');
  for (let c = 5; c <= 24; c++) pon(11, c, 'K');
  [6, 9, 12, 15, 18, 21].forEach((c, i) => {
    for (let r = 13; r <= 22; r++) { pon(r, c, 'G'); pon(r, c + 1, 'G'); }
    const abajo = i === 3;
    for (let r = abajo ? 18 : 14; r <= (abajo ? 21 : 17); r++) { pon(r, c, abajo ? 'Y' : 'B'); pon(r, c + 1, abajo ? 'Y' : 'B'); }
  });
  for (let c = 5; c <= 24; c++) pon(24, c, (c % 3) ? 'G' : 'W');
  [[1, 25], [2, 24], [3, 23], [4, 22], [4, 23], [4, 24], [4, 25], [5, 24], [6, 23], [7, 22], [2, 25], [3, 24], [5, 23]].forEach(([r, c]) => pon(r, c, 'Y'));
  for (let r = 28; r < filas; r++) for (let c = 0; c < cols; c++) pon(r, c, r === 29 && c % 4 < 2 ? 'y' : 'K');
  const col = { '.': '#DCE6F6', N: K.navy, W: '#FFFFFF', K: K.navy, G: '#DADFE8', B: K.azul, Y: K.amar, y: K.amar };
  let s = fondo(K.hueso, ALTO);
  g.forEach((fila, r) => fila.forEach((v, c) => { s += R(c * t + .5, r * t + .5, t - 1, t - 1, col[v], 'rx="1.6"'); }));
  return s;
}

// 10 · Punta Mogotes · Cerrajería · cartel suizo: la llave quedó adentro; el faro alumbra la puerta
function afuera() {
  let s = fondo(K.navy, ALTO);
  const r = az(10);
  for (let i = 0; i < 70; i++) s += C(r() * 297, r() * 150, .25 + r() * .6, '#FFFFFF', `opacity="${.3 + r() * .6}"`);
  s += P('M262 132 L-3 150 L-3 300 Z', K.amar, 'opacity=".92"');
  const x = 266, base = 300;
  for (let k = 0; k < 6; k++) { const y0 = base - k * 28, y1 = base - (k + 1) * 28; s += P(`M${x - 8 + k * .7} ${y0} L${x + 8 - k * .7} ${y0} L${x + 8 - (k + 1) * .7} ${y1} L${x - 8 + (k + 1) * .7} ${y1} Z`, k % 2 ? K.azul : '#FFFFFF'); }
  s += R(x - 6, base - 178, 12, 10, K.amar) + P(`M${x - 7} ${base - 178} L${x} ${base - 186} L${x + 7} ${base - 178} Z`, '#FFFFFF');
  // la casa: puerta cerrada, la llave del otro lado del vidrio
  s += R(34, 176, 176, 147, K.prof) + P('M24 178 L122 128 L220 178 Z', K.azul);
  s += R(66, 206, 60, 102, K.navy) + R(70, 210, 52, 94, K.azul) + C(114, 258, 3, K.amar) + R(56, 308, 80, 6, K.amar);
  s += R(146, 214, 44, 40, K.amar) + L(168, 214, 168, 254, K.prof, 1) + L(146, 234, 190, 234, K.prof, 1);
  s += `<g transform="translate(152 222) rotate(-20)">${C(6, 6, 5, K.navy)}${C(6, 6, 2, K.amar)}${R(10, 5, 18, 2.4, K.navy)}${R(22, 7, 2, 3, K.navy)}${R(26, 7, 2, 4, K.navy)}</g>`;
  s += P('M-3 300 C60 292 120 304 300 296 V323 H-3 Z', K.prof);
  return s;
}

const LAMINAS = [
  { slug: 'centro', barrio: 'Centro', rubro: 'Plomería', titulo: 'Ese caño no se arregla <i>solo.</i>', estilo: 'Art déco', arte: canio, oscura: true, franja: K.navy, rot: 'rgba(233,239,249,.75)', tit: 'left:18mm;right:18mm;top:20mm;text-align:center', color: '#FFFFFF', tam: 50 },
  { slug: 'guemes', barrio: 'Güemes', rubro: 'Cerrajería', titulo: 'La llave gira. La puerta, <i>no.</i>', estilo: 'Bauhaus', arte: cerradura, franja: '#FFFFFF', rot: 'rgba(233,239,249,.8)', tit: 'left:18mm;top:20mm;width:170mm', color: K.navy, tam: 46 },
  { slug: 'playa-grande', barrio: 'Playa Grande', rubro: 'Electricidad', titulo: 'Se cortó la luz. No la <i>paciencia.</i>', estilo: 'Risografía', arte: enchufe, franja: '#FFFFFF', rot: 'rgba(14,29,54,.8)', tit: 'left:18mm;top:18mm;width:160mm;background:#F4F1E6;padding:4mm 5mm 5mm', color: K.azul, tam: 40 },
  { slug: 'los-troncos', barrio: 'Los Troncos', rubro: 'Albañilería', titulo: 'Esa grieta no es <i>decorativa.</i>', estilo: 'Plano de arquitecto', arte: grieta, oscura: true, franja: K.navy, rot: 'rgba(233,239,249,.7)', tit: 'left:18mm;top:20mm;width:220mm', color: '#FFFFFF', tam: 44 },
  { slug: 'stella-maris', barrio: 'Stella Maris', rubro: 'Aire acondicionado', titulo: 'El aire tira agua. Frío, <i>poco.</i>', estilo: 'Atardecer', arte: aire, oscura: true, franja: K.prof, rot: 'rgba(233,239,249,.75)', tit: 'left:18mm;top:20mm;width:180mm', color: '#FFFFFF', tam: 44 },
  { slug: 'plaza-mitre', barrio: 'Plaza Mitre', rubro: 'Gas', titulo: 'El calefón no <i>prende.</i>', estilo: 'Papel recortado', arte: gas, franja: '#FFFFFF', rot: 'rgba(233,239,249,.8)', tit: 'left:18mm;top:20mm;width:140mm', color: K.navy, tam: 48 },
  { slug: 'la-perla', barrio: 'La Perla', rubro: 'Plomería', titulo: 'La canilla gotea toda la <i>noche.</i>', estilo: 'Vista cenital', arte: canilla, oscura: true, franja: K.navy, rot: 'rgba(233,239,249,.8)', tit: 'left:18mm;top:18mm;width:220mm', color: '#FFFFFF', tam: 40 },
  { slug: 'varese', barrio: 'Varese', rubro: 'Albañilería', titulo: 'Esa mancha ya tiene <i>mapa.</i>', estilo: 'Carta náutica', arte: humedad, franja: K.navy, oscura: true, rot: 'rgba(14,29,54,.75)', tit: 'left:18mm;top:44mm;width:200mm;--acento:#1F57A8', color: K.navy, tam: 44,
    extra: [[250, 155, '1'], [224, 215, '3'], [102, 151, '5'], [172, 191, '8']].map(([x, y, t]) => `<p class="sobre chico" style="left:${x}mm;top:${y}mm;color:${K.navy};letter-spacing:0">${t}</p>`).join('') + `<p class="sobre chico" style="left:40mm;top:296mm;color:${K.navy}">Techo del living · escala 1:20</p>` },
  { slug: 'chauvin', barrio: 'Chauvín', rubro: 'Electricidad', titulo: 'Saltó la térmica. Otra <i>vez.</i>', estilo: 'Mosaico', arte: termica, franja: '#FFFFFF', rot: 'rgba(233,239,249,.8)', tit: 'left:16mm;top:16mm;width:180mm', color: K.navy, tam: 40 },
  { slug: 'punta-mogotes', barrio: 'Punta Mogotes', rubro: 'Cerrajería', titulo: 'Llave adentro. Vos, <i>afuera.</i>', estilo: 'Cartel suizo', arte: afuera, oscura: true, franja: K.navy, rot: 'rgba(233,239,249,.75)', tit: 'left:18mm;top:20mm;width:200mm', color: '#FFFFFF', tam: 46 },
];

const franja = (l, i) => `<div class="franja"><div class="fondo-f" style="background:${l.franja}"></div><div class="corte"></div><div class="in">
    <div class="txt"><span class="ceja-f">${l.rubro} · ${l.barrio}</span>
      <h2>¿Se rompió algo en casa? <span>Pedilo en Handyx.</span></h2>
      <p class="bajo">Contás qué pasa, recibís propuestas de especialistas de ${l.barrio} y alrededores, y elegís vos, por calidad y por precio. Le pagás directo al especialista.</p>
      <div class="pasos-f"><span><i>1</i>Escaneá</span><span><i>2</i>Registrate</span><span><i>3</i>Pedí tu arreglo</span></div>
      <div class="pie-f"><img src="../../marca/${l.oscura ? 'logo-handyx-blanco' : 'logo-handyx'}.svg" alt="Handyx"><span>Electricidad · Plomería · Gas · Cerrajería · Albañilería · Aire acondicionado<br>Tarifa de servicio 0 % hasta el 10/12/2026. Demo con invitación, noviembre de 2026.</span></div>
    </div>
    <div class="qrz"><p class="arriba">Escaneá y registrate</p><img src="qr/${l.slug}.svg" alt="Código QR al registro de Handyx"><p>handyc.com/registro</p></div>
  </div></div>`;

if (document.getElementById('laminas')) document.getElementById('laminas').outerHTML = LAMINAS.map((l, i) => `<section class="pagina lam${l.oscura ? ' oscura' : ''}" data-folio="${i + 1}" style="--acento:${l.oscura ? K.amar : K.azul}"><div class="lamina">
    <svg class="arte permite-salir" viewBox="0 0 297 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${l.rubro}: ${l.titulo.replace(/<[^>]+>/g, '')} (${l.barrio})">${l.arte()}<pattern id="gr-${i}" width="60" height="60" patternUnits="userSpaceOnUse"><image href="img/grano.png" width="60" height="60"/></pattern><rect x="-3" y="-3" width="303" height="326" fill="url(#gr-${i})" style="mix-blend-mode:multiply" opacity="${l.oscura && l.slug !== 'varese' ? .22 : .16}"/></svg>
    <div class="sobre titular" style="${l.tit};color:${l.color}"><p class="serie" style="opacity:.8">Mar del Plata · ${l.barrio} · ${l.rubro}</p><h1 class="grande" style="font-size:${l.tam}pt;margin-top:3mm">${l.titulo}</h1></div>
    ${l.extra || ''}
    <p class="rotulo-lam" style="--tinta-rot:${l.rot}"><span><b>${l.rubro}</b> · ${l.barrio}</span><span>Serie «Se rompió algo en casa» · ${l.estilo} · ${String(i + 1).padStart(2, '0')}/10</span></p>
    ${franja(l, i)}
  </div></section>`).join('');
