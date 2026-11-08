// Serie «Lobo» · 4 afiches A3 con el lobo marino de Mar del Plata: el de la Rambla, de piedra, y el que hace
// equilibrio con lo que se rompió en casa. Depende de R, P, C, L, az y K (index.html). Unidades: mm.
const ALTO = 323;

// lobo marino sentado de perfil, cabeza en alto (caja 0..110 × 0..140). La punta del hocico queda en (79, 11):
// ahí se apoya lo que hace equilibrio. nariz(x, y, e) devuelve ese punto en la lámina.
function lobo(x, y, e, f, o = {}) {
  const espejo = o.espejo ? -1 : 1;
  const cuerpo = 'M8 138 C-2 110 6 84 24 70 C34 62 40 50 42 38 C43 26 50 18 60 17 C66 16 71 15 76 13 C80 12 82.5 15 80 18 C76 21 70 23 66 25 C64 34 66 44 70 54 C76 68 80 84 78 98 L104 124 C110 130 106 138 98 136 L74 120 C70 130 62 138 54 140 L14 140 Z';
  const cola = 'M16 140 C6 141 -3 137 -1 131 L18 122 Z';
  let g = `<path d="${cuerpo}" fill="${f}"/><path d="${cola}" fill="${f}"/>`;
  if (o.luz) g += `<path d="M24 70 C34 62 40 50 42 38 C43 26 50 18 60 17 L62 18 C54 21 49 28 48 38 C46 52 38 64 30 72 Z" fill="${o.luz}" opacity=".45"/>`;
  if (o.ojo) g += `<circle cx="64" cy="20" r="1.5" fill="${o.ojo}"/><path d="M53 25 L55 22" stroke="${o.ojo}" stroke-width=".8" stroke-linecap="round" opacity=".6"/>`;
  g += `<path d="M76 20 L90 21 M75 22 L88 26 M74 24 L85 30" stroke="${o.bigote || f}" stroke-width=".6" stroke-linecap="round" opacity=".8"/>`;
  return `<g transform="translate(${x} ${y}) scale(${espejo * e} ${e})">${g}</g>`;
}
const nariz = (x, y, e) => [x + 79 * e, y + 11 * e];
const pedestal = (x, y, w, h, f, f2) => R(x, y, w, h, f) + R(x - 3, y, w + 6, 4, f2) + R(x - 3, y + h - 5, w + 6, 5, f2);
const gota = (x, y, e, f) => P(`M${x} ${y} C${x + 4 * e} ${y + 8 * e} ${x + 7 * e} ${y + 12 * e} ${x + 7 * e} ${y + 16 * e} A${7 * e} ${7 * e} 0 0 1 ${x - 7 * e} ${y + 16 * e} C${x - 7 * e} ${y + 12 * e} ${x - 4 * e} ${y + 8 * e} ${x} ${y} Z`, f);

// 1 · Los dos lobos de la Rambla, de piedra, con el Casino y el sol detrás
function rambla() {
  let s = R(-3, -3, 303, ALTO + 3, K.azul);
  for (let i = 0; i <= 36; i++) { const a = Math.PI + (i / 36) * Math.PI; s += L(148.5 + 80 * Math.cos(a), 236 + 80 * Math.sin(a), 148.5 + 320 * Math.cos(a), 236 + 320 * Math.sin(a), K.medio, .6, 'opacity=".7"'); }
  s += `<clipPath id="sl1"><circle cx="148.5" cy="236" r="84"/></clipPath>` + C(148.5, 236, 84, K.amar) + `<g clip-path="url(#sl1)">${[0, 1, 2, 3, 4].map((k) => R(40, 196 + k * 8.4, 220, 1.2 + k * 1.1, K.azul)).join('')}</g>`;
  // el Casino en silueta
  const fach = (x, w, y0, t) => R(x, y0, w, 252 - y0, K.prof) + P(`M${x - 2} ${y0} L${x + 6} ${y0 - t} H${x + w - 6} L${x + w + 2} ${y0} Z`, K.navy);
  s += fach(30, 237, 214, 12) + fach(22, 36, 200, 18) + fach(239, 36, 200, 18) + fach(124, 49, 192, 22);
  for (let x = 34; x < 264; x += 8.4) s += P(`M${x} 242 V234 A2 2 0 0 1 ${x + 4} 234 V242 Z`, K.amar, 'opacity=".55"');
  s += R(-3, 252, 303, 71, K.navy);
  for (let k = 0; k < 5; k++) s += R(20 - k * 4, 252 + k * 5, 257 + k * 8, 5, k % 2 ? K.prof : '#13284A');
  // los lobos, de frente uno al otro
  s += pedestal(30, 214, 44, 52, '#DAD3BF', '#C9C1AA') + pedestal(223, 214, 44, 52, '#DAD3BF', '#C9C1AA');
  s += lobo(27, 102, .8, '#E6DFCB', { luz: '#FFFFFF', bigote: '#C9C1AA' }) + lobo(270, 102, .8, '#E6DFCB', { espejo: true, luz: '#FFFFFF', bigote: '#C9C1AA' });
  return s;
}

// 2 · Plomería: el lobo hace equilibrio con una gota de agua
function gotera() {
  let s = R(-3, -3, 303, ALTO + 3, K.cielo);
  for (let k = 0; k < 7; k++) s += C(148.5, 250, 40 + k * 26, 'none', `stroke="${K.azul}" stroke-width=".5" opacity="${.35 - k * .04}"`);
  const [nx, ny] = nariz(70, 118, 1.3);
  s += lobo(70, 118, 1.3, K.navy, { ojo: K.cielo, bigote: K.navy });
  s += gota(nx, ny - 59, 2.6, K.azul) + C(nx - 6, ny - 27, 4, '#FFFFFF', 'opacity=".6"');
  [[56, 92], [236, 120], [70, 196]].forEach(([x, y], i) => { s += gota(x, y, .7 + i * .1, K.medio); });
  // la pelota de circo convertida en piso de baldosas mojado
  s += R(-3, 296, 303, 27, K.azul) + [0, 1, 2, 3].map((k) => `<ellipse cx="160" cy="${300 + k}" rx="${90 - k * 22}" ry="${4 - k * .8}" fill="none" stroke="${K.cielo}" stroke-width=".7" opacity=".8"/>`).join('');
  s += R(56, 296, 120, 8, K.navy, 'rx="2"');
  return s;
}

// 3 · Electricidad: de noche, el lobo hace equilibrio con una lamparita encendida
function lamparita() {
  let s = R(-3, -3, 303, ALTO + 3, K.navy);
  const r = az(13);
  for (let i = 0; i < 60; i++) s += C(r() * 297, r() * 200, .25 + r() * .5, '#FFFFFF', `opacity="${.25 + r() * .5}"`);
  const [nx, ny] = nariz(70, 118, 1.3), dx = nx - 172, dy = ny - 105;
  s += `<g transform="translate(${dx} ${dy})">`;
  s += `<radialGradient id="hz3" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${K.amar}" stop-opacity=".55"/><stop offset="1" stop-color="${K.amar}" stop-opacity="0"/></radialGradient>` + C(172, 70, 70, 'url(#hz3)');
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; s += L(172 + 28 * Math.cos(a), 68 + 28 * Math.sin(a), 172 + 40 * Math.cos(a), 68 + 40 * Math.sin(a), K.amar, 1.4, 'stroke-linecap="round"'); }
  s += P('M172 46 C160 46 152 56 152 66 C152 74 157 79 161 83 C164 86 165 89 165 92 H179 C179 89 180 86 183 83 C187 79 192 74 192 66 C192 56 184 46 172 46 Z', K.amar);
  s += R(165, 92, 14, 4, K.borde) + R(166, 96, 12, 4, '#C9C1AA') + R(168, 100, 8, 3, K.borde, 'rx="1.4"');
  s += P('M166 74 L170 80 L174 72 L178 80', 'none', `stroke="${K.navy}" stroke-width=".9" stroke-linejoin="round" opacity=".5"`) + '</g>';
  s += lobo(70, 118, 1.3, K.azul, { ojo: K.amar, luz: K.amar, bigote: K.cielo });
  s += P('M-3 296 C60 290 120 302 190 294 S260 290 300 296 V326 H-3 Z', K.prof);
  return s;
}

// 4 · Todos los rubros: el lobo hace equilibrio con una llave inglesa
function herramienta() {
  let s = R(-3, -3, 303, ALTO + 3, K.amar);
  for (let y = 10; y < 300; y += 14) s += P(`M-3 ${y} ${Array.from({ length: 11 }, () => 'q 7 -4 14 0 t 14 0').join(' ')}`, 'none', `stroke="${K.navy}" stroke-width=".35" opacity=".14"`);
  const [nx, ny] = nariz(70, 118, 1.3);
  s += lobo(70, 118, 1.3, K.navy, { ojo: K.amar, bigote: K.navy });
  s += `<g transform="translate(${nx - 8} ${ny - 6}) rotate(-12)"><path d="M-46 -4 H24 V4 H-46 A4 4 0 0 1 -46 -4 Z" fill="${K.azul}"/><path d="M20 -12 A16 16 0 1 1 20 12 L28 5 H40 V-5 H28 Z" fill="${K.azul}"/><circle cx="-40" cy="0" r="2" fill="${K.amar}"/></g>`;
  // los arcos del malabar y las otras herramientas en el aire
  s += P(`M${nx - 70} ${ny + 10} C${nx - 76} ${ny - 56} ${nx + 50} ${ny - 76} ${nx + 70} ${ny - 18}`, 'none', `stroke="${K.navy}" stroke-width=".8" stroke-dasharray="1.4 2.4" stroke-linecap="round"`);
  s += `<g transform="translate(${nx - 74} ${ny - 4}) rotate(-24)">${R(-3, -18, 6, 30, K.prof, 'rx="2"')}${R(-1, 12, 2, 18, K.prof)}</g>`;
  s += `<g transform="translate(${nx - 26} ${ny - 58})"><path d="M0 -10 L8.7 -5 V5 L0 10 L-8.7 5 V-5 Z" fill="${K.prof}"/>${C(0, 0, 3.6, K.amar)}</g>`;
  s += `<g transform="translate(${nx + 66} ${ny - 34}) rotate(16)">${C(0, 0, 9, 'none', `stroke="${K.prof}" stroke-width="3"`)}${R(-2, 9, 4, 22, K.prof, 'rx="1.5"')}</g>`;
  s += R(-3, 300, 303, 26, K.navy);
  return s;
}


// 5 · Verano: el lobo de piedra de la Rambla sobre su pedestal de granito, con las torres y el Provincial
function verano() {
  const H = 236; // horizonte (nivel de la Rambla)
  let s = R(-3, -3, 303, ALTO + 3, K.medio);
  s += C(232, 96, 36, K.amar) + [0, 1, 2].map((k) => C(232, 96, 48 + k * 12, 'none', `stroke="${K.amar}" stroke-width="1" opacity="${.5 - k * .14}"`)).join('');
  // el mar y la baranda de la Rambla
  s += R(-3, H - 14, 303, 14, K.azul) + R(-3, H - 3, 303, 3, '#C9C1AA');
  // torres
  const r = az(21);
  let x = 132;
  while (x < 238) { const w = 10 + r() * 12, h = 46 + r() * 74; s += R(x, H - 14 - h, w, h, '#9DB8E6'); for (let y = H - 10 - h; y < H - 18; y += 5) s += R(x + 2, y, w - 4, .8, '#DCE6F6'); x += w + 2.5; }
  s += R(176, 70, 24, H - 84, '#B3C5E6');
  for (let y = 78; y < H - 18; y += 5) s += R(179, y, 18, 1, '#E9EFF9');
  // el Hotel Provincial: ladrillo en el azul de la marca, mansarda y recova
  s += P(`M238 ${H} V132 H300 V${H} Z`, K.prof) + P('M232 132 L242 114 H300 V132 Z', K.navy);
  for (let y = 140; y < H - 30; y += 13) for (let xx = 244; xx < 298; xx += 9) s += R(xx, y, 4.6, 7, '#9DB8E6');
  for (let xx = 240; xx < 300; xx += 10) s += P(`M${xx} ${H} V${H - 14} A4 4 0 0 1 ${xx + 8} ${H - 14} V${H} Z`, K.navy);
  // la Rambla en perspectiva
  s += R(-3, H, 303, ALTO - H + 3, '#EDE7D8');
  for (let k = -6; k < 16; k++) { const xb = k * 30; s += L(xb, ALTO + 3, 262 + (xb - 262) * 0.02, H, '#D9D0BB', .5); }
  for (let k = 1; k < 9; k++) { const t = k / 9, y = H + (ALTO - H) * t * t; s += L(-3, y, 300, y, '#D9D0BB', .5); }
  // el pedestal de granito, ancho y bajo
  const pt = 250, pb = 304;
  s += P(`M2 ${pt} L230 ${pt} L240 ${pt - 6} L12 ${pt - 6} Z`, '#E6DFCB') + R(2, pt, 228, pb - pt, '#D9D0BB') + P(`M230 ${pt} L240 ${pt - 6} V${pb - 6} L230 ${pb} Z`, '#C9C1AA');
  [pt + 18, pt + 36].forEach((y) => { s += L(2, y, 230, y, '#C9C1AA', .6); });
  [[40, pt, pt + 18], [110, pt, pt + 18], [180, pt, pt + 18], [74, pt + 18, pt + 36], [146, pt + 18, pt + 36], [214, pt + 18, pt + 36], [40, pt + 36, pb], [110, pt + 36, pb], [180, pt + 36, pb]].forEach(([a, y1, y2]) => { s += L(a, y1, a, y2, '#C9C1AA', .6); });
  // el lobo de piedra: pecho en alto, melena, aletas apoyadas en el granito
  const cuerpo = 'M34 6 L46 4 C54 2 62 8 64 16 C72 24 80 40 84 56 C90 72 104 84 124 92 C156 104 190 120 206 146 C214 156 212 168 200 168 L180 166 L96 170 L70 170 L66 162 C48 146 36 120 30 90 C24 60 26 30 30 14 L30 12 Z';
  let g = `<path d="${cuerpo}" fill="#E6DFCB"/>`;
  g += `<path d="M64 16 C72 24 80 40 84 56 C90 72 104 84 124 92 C156 104 190 120 206 146 C212 156 212 164 206 168 C200 150 184 132 156 118 C128 106 104 98 92 86 C78 70 70 44 64 16 Z" fill="#CFC6AF"/>`;
  g += `<path d="M30 14 C26 30 24 60 30 90 C34 110 42 130 54 146 C46 124 40 100 40 76 C40 50 38 30 30 14 Z" fill="#FFFFFF" opacity=".45"/>`;
  for (let k = 0; k < 34; k++) { const t = k / 34, mx = 38 + t * 46 + (k % 3) * 4, my = 22 + t * 84 + (k % 2) * 5; g += `<path d="M${mx} ${my} q 3.4 -3.4 6.8 0" fill="none" stroke="#B8AE94" stroke-width=".9" stroke-linecap="round"/>`; }
  g += `<path d="M64 156 C50 160 30 164 14 166 C7 167 7 173 14 173 L70 172 Z" fill="#D9D0BB"/><path d="M20 168 L30 172 M28 167 L38 172" stroke="#B8AE94" stroke-width=".7"/>`;
  g += `<path d="M186 164 L212 160 C220 160 222 170 214 172 L184 172 Z" fill="#D9D0BB"/>`;
  g += `<circle cx="50" cy="9" r="1.4" fill="#8E846C"/><path d="M36 9 L30 10" stroke="#8E846C" stroke-width=".7"/>`;
  s += `<g transform="translate(8 ${pt - 6 - 172})">${g}</g>`;
  return s;
}

const LAMINAS = [
  { n: 1, arte: rambla, oscura: true, franja: K.navy, titulo: 'Los lobos cuidan la Rambla. <i>Nosotros, tu casa.</i>', color: '#FFFFFF', ac: K.amar, tam: 44, rubro: 'Todos los rubros', estilo: 'Art déco', obra: 'Los lobos de la Rambla', rot: 'rgba(233,239,249,.75)' },
  { n: 2, arte: gotera, franja: '#FFFFFF', titulo: 'La gotera no es un número de <i>circo.</i>', color: K.navy, ac: K.azul, tam: 46, rubro: 'Plomería', estilo: 'Equilibrio', obra: 'Lobo con gota', rot: 'rgba(233,239,249,.8)' },
  { n: 3, arte: lamparita, oscura: true, franja: K.navy, titulo: '¿Se quemó? La cambiamos sin <i>malabares.</i>', color: '#FFFFFF', ac: K.amar, tam: 44, rubro: 'Electricidad', estilo: 'Equilibrio', obra: 'Lobo con lamparita', rot: 'rgba(233,239,249,.75)' },
  { n: 4, arte: herramienta, oscura: true, franja: K.navy, titulo: 'Arreglos de casa, sin hacer <i>equilibrio.</i>', color: K.navy, ac: K.azul, tam: 44, rubro: 'Todos los rubros', estilo: 'Equilibrio', obra: 'Lobo con llave inglesa', rot: 'rgba(233,239,249,.8)' },
  { n: 5, arte: verano, oscura: true, franja: K.navy, titulo: 'Que no se rompa el <i>verano.</i>', color: '#FFFFFF', ac: K.amar, tam: 48, rubro: 'Aire acondicionado · Electricidad · Plomería', estilo: 'La Rambla en verano', obra: 'El lobo de la Rambla', rot: 'rgba(14,29,54,.7)', bajo: 'Antes de la temporada: el aire, la luz y el agua, en orden. Contás qué pasa, recibís propuestas de especialistas de tu zona y elegís vos.' },
];

const franja = (l) => `<div class="franja"><div class="fondo-f" style="background:${l.franja}"></div><div class="corte"></div><div class="in">
    <div class="txt"><span class="ceja-f">${l.rubro} · Mar del Plata</span>
      <h2>¿Se rompió algo en casa? <span>Pedilo en Handyx.</span></h2>
      <p class="bajo">${l.bajo || 'Contás qué pasa, recibís propuestas de especialistas de tu zona y elegís vos, por calidad y por precio. Le pagás directo al especialista.'}</p>
      <div class="pasos-f"><span><i>1</i>Escaneá</span><span><i>2</i>Registrate</span><span><i>3</i>Pedí tu arreglo</span></div>
      <div class="pie-f"><img src="../../marca/${l.oscura ? 'logo-handyx-blanco' : 'logo-handyx'}.svg" alt="Handyx"><span>Electricidad · Plomería · Gas · Cerrajería · Albañilería · Aire acondicionado<br>Tarifa de servicio 0 % hasta el 10/12/2026. Demo con invitación, noviembre de 2026.</span></div>
    </div>
    <div class="qrz"><p class="arriba">Escaneá y registrate</p><img src="qr/lobo-${l.n}.svg" alt="Código QR al registro de Handyx"><p>handyc.com/registro</p></div>
  </div></div>`;

document.getElementById('laminas').outerHTML = LAMINAS.map((l, i) => `<section class="pagina lam${l.oscura ? ' oscura' : ''}" data-folio="${i + 1}" style="--acento:${l.oscura ? K.amar : K.azul}"><div class="lamina">
    <svg class="arte permite-salir" viewBox="0 0 297 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${l.obra}">${l.arte()}<pattern id="gr-${i}" width="60" height="60" patternUnits="userSpaceOnUse"><image href="img/grano.png" width="60" height="60"/></pattern><rect x="-3" y="-3" width="303" height="326" fill="url(#gr-${i})" style="mix-blend-mode:multiply" opacity="${l.oscura && l.n !== 4 ? .22 : .16}"/></svg>
    <div class="sobre titular" style="left:18mm;top:20mm;width:${l.n === 1 ? 250 : 200}mm;color:${l.color};--acento:${l.ac}"><p class="serie" style="opacity:.8">Mar del Plata · ${l.rubro}</p><h1 class="grande" style="font-size:${l.tam}pt;margin-top:3mm">${l.titulo}</h1></div>
    <p class="rotulo-lam" style="--tinta-rot:${l.rot}"><span><b>${l.obra}</b></span><span>Serie «Lobo» · ${l.estilo} · ${String(i + 1).padStart(2, '0')}/${String(LAMINAS.length).padStart(2, '0')}</span></p>
    ${franja(l)}
  </div></section>`).join('');
