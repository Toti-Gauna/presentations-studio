// Maqueta isométrica de Mar del Plata para la Colección Handyx. Una losa flotante con lo que cualquiera reconoce de la
// ciudad: la Rambla con el Casino y el Hotel Provincial y sus dos lobos marinos, el Torreón del Monje sobre las rocas,
// las lanchitas amarillas del puerto, las carpas de los balnearios, la Catedral, el faro, los chalets de piedra
// marplatense, las torres frente al mar, gaviotas y gente sin cara. Todo en SVG dibujado en código, con la paleta de la
// marca (las formas son una interpretación libre, no planos).
// Uso: <div data-iso="maqueta|costa|barrio" data-paleta="dia|noche" data-semilla="3" data-pines="1" data-rotulos="1"></div>
//   data-pines="1": el pedido (pin amarillo sobre una casa), el especialista (pin azul sobre la camioneta) y el arco que los une.
//   data-rotulos="1": nombres de los lugares con una línea fina, como en un plano de arquitectura (data-solo="faro,casino" filtra).
(function () {
  const C = Math.cos(Math.PI / 6), K = 26;
  const PAL = {
    dia: {
      calle: '#D5E0F2', vereda: '#FBFAF6', cordonI: '#C3D2EC', cordonD: '#B4C6E6', losaIzq: '#1F57A8', losaDer: '#143E7E', losaFranja: '#2C66B8',
      edif: ['#FFFFFF', '#E9EFF9', '#BFD0EC'], vidrio: ['#C7D5EE', '#A7BDE4'], luz: '#F5F59A',
      edifAzul: ['#2C66B8', '#1F57A8', '#143E7E'], vidrioAzul: ['#143E7E', '#0E1D36'],
      casa: ['#FBFAF6', '#F3F0E8', '#E2DCCD'], piedra: '#CFC3A6', piedraOsc: '#B9AB8A',
      techo: ['#143E7E', '#1F57A8', '#E9EFF9'], teja: 'rgba(255,255,255,0.22)', mansarda: ['#26324A', '#0E1D36', '#13284A'],
      casino: ['#FBFAF6', '#EDE4CF', '#D9CBA6'], ventanaCasino: '#26324A', bronce: '#26324A',
      arbol: ['#2C66B8', '#1F57A8', '#143E7E'], tronco: '#0E1D36',
      arena: '#F3EBD3', mar: '#2C66B8', marLado: '#1F57A8', ola: '#E9EFF9', rambla: '#FFFFFF', roca: ['#8F99AD', '#5F6B84', '#26324A'],
      lancha: ['#F5F59A', '#E6E07A', '#C9C25A'], cabina: '#FFFFFF', carpa: ['#1F57A8', '#FFFFFF'],
      faro: ['#FFFFFF', '#0E1D36'], piel: ['#E7B48C', '#C98C62', '#8D5B3B'], ropa: ['#1F57A8', '#F5F59A', '#0E1D36', '#FFFFFF'],
      pelo: '#26324A', piernas: '#0E1D36', sombra: 'rgba(14,29,54,0.16)', gaviota: '#0E1D36', rotulo: '#0E1D36', rotuloFondo: '#FFFFFF', haz: 0, prob: 0.1,
    },
    noche: {
      calle: '#0E1D36', vereda: '#162B4F', cordonI: '#0A1528', cordonD: '#081224', losaIzq: '#0A1528', losaDer: '#060E1C', losaFranja: '#13284A',
      edif: ['#2C66B8', '#1F57A8', '#143E7E'], vidrio: ['#143E7E', '#0E1D36'], luz: '#F5F59A',
      edifAzul: ['#3A76CC', '#2C66B8', '#1F57A8'], vidrioAzul: ['#0E1D36', '#0A1528'],
      casa: ['#2C66B8', '#1F57A8', '#143E7E'], piedra: '#173A70', piedraOsc: '#10305F',
      techo: ['#0E1D36', '#143E7E', '#2C66B8'], teja: 'rgba(255,255,255,0.08)', mansarda: ['#0E1D36', '#0A1528', '#060E1C'],
      casino: ['#3A76CC', '#2C66B8', '#1F57A8'], ventanaCasino: '#F5F59A', bronce: '#E9EFF9',
      arbol: ['#1F57A8', '#143E7E', '#0E1D36'], tronco: '#060E1C',
      arena: '#2A3A5A', mar: '#0B1A33', marLado: '#08142A', ola: '#2C66B8', rambla: '#22385E', roca: ['#2A3A5A', '#1C2A46', '#0E1D36'],
      lancha: ['#F5F59A', '#D8D47E', '#A9A55A'], cabina: '#E9EFF9', carpa: ['#2C66B8', '#E9EFF9'],
      faro: ['#E9EFF9', '#143E7E'], piel: ['#C99A78', '#A9744F', '#7A4E33'], ropa: ['#F5F59A', '#E9EFF9', '#2C66B8', '#F5F59A'],
      pelo: '#060E1C', piernas: '#E9EFF9', sombra: 'rgba(0,0,0,0.3)', gaviota: '#E9EFF9', rotulo: '#0E1D36', rotuloFondo: '#F5F59A', haz: 0.15, prob: 0.26,
    },
  };
  const azar = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647);

  function escena(opc) {
    const p = PAL[opc.paleta] || PAL.dia, r = azar(opc.semilla || 3);
    let xmin = 1e9, xmax = -1e9, ymin = 1e9, ymax = -1e9;
    const pt = (X, Y, Z = 0) => {
      const sx = (X - Y) * C * K, sy = (X + Y) * 0.5 * K - Z * K;
      xmin = Math.min(xmin, sx); xmax = Math.max(xmax, sx); ymin = Math.min(ymin, sy); ymax = Math.max(ymax, sy);
      return [sx, sy];
    };
    const pr = (X, Y, Z) => pt(X, Y, Z).map((v) => v.toFixed(1)).join(' ');
    const poly = (pts, fill, extra = '') => `<path d="M${pts.map((q) => pr(...q)).join(' L')} Z" fill="${fill}"${extra}/>`;
    const suelo = [], cosas = [], arriba = [], marcas = {};
    const W = opc.ancho || 26, D = opc.fondo || 16, MAR = opc.mar ?? 17, PLAYA = 2.4;
    const conMar = MAR < W;
    const agrega = (k, s) => cosas.push({ k, s });

    // ---------- losa, calles, rambla, playa y mar
    const losa = (z0, z1, cI, cD) => poly([[0, D, z0], [W, D, z0], [W, D, z1], [0, D, z1]], cI) + poly([[W, 0, z0], [W, D, z0], [W, D, z1], [W, 0, z1]], cD);
    suelo.push(losa(-1.6, -0.5, p.losaIzq, p.losaDer), losa(-0.5, 0, p.losaFranja, p.losaIzq));
    suelo.push(poly([[0, 0, 0], [Math.min(MAR, W), 0, 0], [Math.min(MAR, W), D, 0], [0, D, 0]], p.calle));
    if (conMar) {
      suelo.push(poly([[MAR - 1.2, 0, 0.06], [MAR, 0, 0.06], [MAR, D, 0.06], [MAR - 1.2, D, 0.06]], p.rambla));
      suelo.push(poly([[MAR, 0, 0], [MAR + PLAYA, 0, 0], [MAR + PLAYA, D, 0], [MAR, D, 0]], p.arena));
      suelo.push(poly([[MAR + PLAYA, 0, -0.18], [W, 0, -0.18], [W, D, -0.18], [MAR + PLAYA, D, -0.18]], p.mar));
      suelo.push(poly([[MAR + PLAYA, D, -0.5], [W, D, -0.5], [W, D, -0.18], [MAR + PLAYA, D, -0.18]], p.marLado));
      for (let y = 0.4; y < D - 0.6; y += 1.3) suelo.push(`<path d="M${pr(MAR + PLAYA + 0.15, y, -0.18)} L${pr(MAR + PLAYA + 0.15, y + 0.9, -0.18)}" stroke="${p.ola}" stroke-width="2.4" stroke-linecap="round" opacity="0.8"/>`);
      for (let i = 0; i < 30; i++) {
        const x = MAR + PLAYA + 0.8 + r() * (W - MAR - PLAYA - 1.4), y = 0.6 + r() * (D - 1.4), l = 0.5 + r() * 0.9;
        suelo.push(`<path d="M${pr(x, y, -0.18)} L${pr(x, y + l, -0.18)}" stroke="${p.ola}" stroke-width="1.6" stroke-linecap="round" opacity="0.5"/>`);
      }
    }

    // ---------- piezas
    const caja = (x, y, z, w, d, h, cara, ventanas, vidrio, clave) => {
      let s = poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]], cara[1]);
      s += poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]], cara[2]);
      s += poly([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]], cara[0]);
      if (ventanas) {
        for (let f = z + 0.45; f + 0.42 < z + h - 0.15; f += 0.78) {
          const lit = () => (r() < p.prob ? p.luz : null);
          s += poly([[x + 0.14, y + d, f], [x + w - 0.14, y + d, f], [x + w - 0.14, y + d, f + 0.4], [x + 0.14, y + d, f + 0.4]], lit() || vidrio[0]);
          s += poly([[x + w, y + 0.14, f], [x + w, y + d - 0.14, f], [x + w, y + d - 0.14, f + 0.4], [x + w, y + 0.14, f + 0.4]], lit() || vidrio[1]);
        }
      }
      agrega(clave ?? x + w / 2 + y + d / 2, s);
      return s;
    };
    const suelta = (...a) => { const s = caja(...a); cosas.pop(); return s; };
    // piedra Mar del Plata: lajas irregulares sobre una cara ('y' = la que mira a +Y, 'x' = la que mira a +X)
    const piedras = (cara, fijo, a0, a1, z0, z1) => {
      let s = '';
      for (let z = z0 + 0.04; z < z1 - 0.08; z += 0.19) {
        let a = a0 + 0.03 + (Math.round(z * 10) % 2) * 0.08;
        while (a < a1 - 0.1) {
          const l = 0.16 + r() * 0.2, hz = 0.13 + r() * 0.04, b = Math.min(a + l, a1 - 0.03);
          const q = cara === 'y' ? [[a, fijo, z], [b, fijo, z], [b, fijo, z + hz], [a, fijo, z + hz]] : [[fijo, a, z], [fijo, b, z], [fijo, b, z + hz], [fijo, a, z + hz]];
          s += poly(q, r() < 0.5 ? p.piedra : p.piedraOsc);
          a = b + 0.04;
        }
      }
      return s;
    };
    const chalet = (x, y, w, d, h) => {
      const z = 0.1, zt = z + h, rr = 0.85, o = 0.14;
      let s = poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, zt], [x, y + d, zt]], p.casa[1]);
      s += poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, zt], [x + w, y, zt]], p.casa[2]);
      s += piedras('y', y + d, x, x + w, z, z + h * 0.42);
      s += piedras('x', x + w, y, y + 0.32, z, zt);
      s += piedras('x', x + w, y + d - 0.32, y + d, z, zt);
      s += poly([[x + w * 0.62, y + d, z], [x + w * 0.62 + 0.36, y + d, z], [x + w * 0.62 + 0.36, y + d, z + 0.66], [x + w * 0.62, y + d, z + 0.66]], p.techo[1]);
      s += poly([[x + 0.28, y + d, z + 0.5], [x + 0.78, y + d, z + 0.5], [x + 0.78, y + d, z + 0.9], [x + 0.28, y + d, z + 0.9]], r() < 0.45 ? p.luz : p.vidrio[0]);
      s += poly([[x + w, y + d * 0.36, z + 0.46], [x + w, y + d * 0.64, z + 0.46], [x + w, y + d * 0.64, z + 0.86], [x + w, y + d * 0.36, z + 0.86]], p.vidrio[1]);
      s += poly([[x - o, y - o, zt - 0.05], [x + w + o, y - o, zt - 0.05], [x + w + o, y + d / 2, zt + rr], [x - o, y + d / 2, zt + rr]], p.techo[0]);
      s += poly([[x + w, y, zt], [x + w, y + d, zt], [x + w, y + d / 2, zt + rr]], p.casa[2]);
      s += poly([[x - o, y + d / 2, zt + rr], [x + w + o, y + d / 2, zt + rr], [x + w + o, y + d + o, zt - 0.05], [x - o, y + d + o, zt - 0.05]], p.techo[1]);
      for (let t = 0.25; t < 1; t += 0.25) {
        const yy = y + d / 2 + (d / 2 + o) * t, zz = zt + rr - (rr + 0.05) * t;
        s += `<path d="M${pr(x - o, yy, zz)} L${pr(x + w + o, yy, zz)}" stroke="${p.teja}" stroke-width="1.4"/>`;
      }
      const cx = x + w * 0.25, cy = y + d * 0.62;
      s += poly([[cx, cy + 0.3, zt + 0.5], [cx + 0.3, cy + 0.3, zt + 0.5], [cx + 0.3, cy + 0.3, zt + 1.15], [cx, cy + 0.3, zt + 1.15]], p.piedra);
      s += poly([[cx + 0.3, cy, zt + 0.5], [cx + 0.3, cy + 0.3, zt + 0.5], [cx + 0.3, cy + 0.3, zt + 1.15], [cx + 0.3, cy, zt + 1.15]], p.piedraOsc);
      s += poly([[cx, cy, zt + 1.15], [cx + 0.3, cy, zt + 1.15], [cx + 0.3, cy + 0.3, zt + 1.15], [cx, cy + 0.3, zt + 1.15]], p.casa[0]);
      agrega(x + w / 2 + y + d / 2, s);
      return { x: x + w / 2, y: y + d / 2, z: zt + rr };
    };
    const arbol = (x, y, s0 = 1) => {
      const [a, b] = pt(x, y, 0.1), [c, d] = pt(x, y, 0.1 + 0.9 * s0), rad = 0.52 * K * s0;
      agrega(x + y + 0.01, `<ellipse cx="${a}" cy="${b}" rx="${rad * 0.9}" ry="${rad * 0.45}" fill="${p.sombra}"/>
        <path d="M${a} ${b} L${c} ${d}" stroke="${p.tronco}" stroke-width="${2.6 * s0}" stroke-linecap="round"/>
        <circle cx="${c}" cy="${d - rad * 0.5}" r="${rad}" fill="${p.arbol[1]}"/>
        <path d="M${c - rad} ${d - rad * 0.5} A${rad} ${rad} 0 0 1 ${c + rad * 0.2} ${d - rad * 1.48} A${rad * 0.95} ${rad * 0.95} 0 0 0 ${c - rad * 0.55} ${d + rad * 0.15} Z" fill="${p.arbol[0]}"/>
        <path d="M${c + rad * 0.15} ${d + rad * 0.48} A${rad} ${rad} 0 0 0 ${c + rad} ${d - rad * 0.5} A${rad * 0.8} ${rad * 0.8} 0 0 1 ${c - rad * 0.2} ${d + rad * 0.3} Z" fill="${p.arbol[2]}" opacity="0.65"/>`);
    };
    const persona = (x, y, i, objeto) => {
      const [a, b] = pt(x, y, 0.1), piel = p.piel[i % 3], ropa = p.ropa[i % p.ropa.length], ropa2 = p.ropa[(i + 2) % p.ropa.length];
      let s = `<ellipse cx="${a}" cy="${b}" rx="6" ry="2.6" fill="${p.sombra}"/>
        <path d="M${a - 1.6} ${b} V${b - 8} M${a + 1.8} ${b + 0.6} V${b - 8}" stroke="${p.piernas}" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M${a - 3.6} ${b - 7.4} Q${a - 3.8} ${b - 17} ${a} ${b - 17.6} Q${a + 3.8} ${b - 17} ${a + 3.6} ${b - 7.4} Z" fill="${ropa}"/>
        <path d="M${a + 3.2} ${b - 15} Q${a + 5.2} ${b - 11} ${a + 4.6} ${b - 8.6}" stroke="${ropa}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
        <circle cx="${a}" cy="${b - 21.4}" r="3.5" fill="${piel}"/>
        <path d="M${a - 3.6} ${b - 21.2} Q${a - 3.4} ${b - 25.6} ${a + 0.4} ${b - 25.2} Q${a + 3.8} ${b - 24.6} ${a + 3.4} ${b - 22.4} Q${a} ${b - 23.6} ${a - 3.6} ${b - 21.2} Z" fill="${p.pelo}"/>`;
      if (objeto === 'celular') s += `<rect x="${a + 3.4}" y="${b - 11.8}" width="2.4" height="3.8" rx="0.6" fill="${p.luz}"/>`;
      if (objeto === 'caja') s += `<rect x="${a + 2.6}" y="${b - 10.4}" width="6" height="4.2" rx="0.6" fill="${ropa2}" stroke="${p.tronco}" stroke-width="0.6"/>`;
      agrega(x + y + 0.02, s);
    };
    const camioneta = (x, y) => {
      const z = 0.02;
      caja(x, y, z + 0.18, 1.5, 0.75, 0.62, p.edifAzul, false, null, x + y + 1.2);
      caja(x + 1.5, y, z + 0.18, 0.5, 0.75, 0.42, p.edifAzul, false, null, x + y + 1.25);
      let s = poly([[x + 1.52, y + 0.75, z + 0.4], [x + 1.86, y + 0.75, z + 0.4], [x + 1.86, y + 0.75, z + 0.56], [x + 1.52, y + 0.75, z + 0.56]], p.vidrio[0]);
      s += poly([[x + 0.1, y + 0.75, z + 0.42], [x + 1.4, y + 0.75, z + 0.42], [x + 1.4, y + 0.75, z + 0.52], [x + 0.1, y + 0.75, z + 0.52]], p.luz);
      [[x + 0.35, y + 0.75], [x + 1.65, y + 0.75]].forEach(([wx, wy]) => { const [a, b] = pt(wx, wy, z + 0.18); s += `<ellipse cx="${a}" cy="${b}" rx="${0.2 * K}" ry="${0.22 * K}" fill="${p.tronco}"/>`; });
      agrega(x + y + 1.3, s);
      return { x: x + 0.9, y: y + 0.4, z: z + 0.9 };
    };
    // techo de mansarda (Casino y Hotel Provincial) con buhardillas
    const mansarda = (x, y, z, w, d, h, i) => {
      const t = z + h;
      let s = poly([[x, y + d, z], [x + w, y + d, z], [x + w - i, y + d - i, t], [x + i, y + d - i, t]], p.mansarda[1]);
      s += poly([[x + w, y, z], [x + w, y + d, z], [x + w - i, y + d - i, t], [x + w - i, y + i, t]], p.mansarda[2]);
      s += poly([[x + i, y + i, t], [x + w - i, y + i, t], [x + w - i, y + d - i, t], [x + i, y + d - i, t]], p.mansarda[0]);
      for (let a = x + 0.35; a < x + w - 0.5; a += 0.62) s += poly([[a, y + d - i * 0.45, z + h * 0.25], [a + 0.24, y + d - i * 0.45, z + h * 0.25], [a + 0.24, y + d - i * 0.45, z + h * 0.62], [a, y + d - i * 0.45, z + h * 0.62]], p.ventanaCasino);
      return s;
    };
    const arcos = (cara, fijo, a0, a1, z0, paso = 0.42) => {
      let s = '';
      for (let a = a0; a < a1 - 0.25; a += paso) {
        const q = [[a, z0], [a + 0.2, z0], [a + 0.2, z0 + 0.42], [a + 0.1, z0 + 0.53], [a, z0 + 0.42]];
        s += poly(q.map(([u, v]) => (cara === 'y' ? [u, fijo, v] : [fijo, u, v])), p.ventanaCasino);
      }
      return s;
    };
    const palacio = (x, y, w, d, h, clave) => {
      let s = poly([[x, y + d, 0.1], [x + w, y + d, 0.1], [x + w, y + d, 0.1 + h], [x, y + d, 0.1 + h]], p.casino[1]);
      s += poly([[x + w, y, 0.1], [x + w, y + d, 0.1], [x + w, y + d, 0.1 + h], [x + w, y, 0.1 + h]], p.casino[2]);
      for (let f = 0; f < 2; f++) { s += arcos('y', y + d, x + 0.22, x + w - 1.0, 0.45 + f * 0.8); s += arcos('x', x + w, y + 0.22, y + d, 0.45 + f * 0.8); }
      s += poly([[x, y, 0.1 + h], [x + w, y, 0.1 + h], [x + w, y + d, 0.1 + h], [x, y + d, 0.1 + h]], p.casino[0]);
      s += mansarda(x, y, 0.1 + h, w, d, 0.62, 0.3);
      agrega(clave, s);
      // pabellón más alto del lado del mar
      const px = x + w - 1.0, ph = h + 0.55;
      let q = poly([[px, y + d + 0.08, 0.1], [px + 1.08, y + d + 0.08, 0.1], [px + 1.08, y + d + 0.08, 0.1 + ph], [px, y + d + 0.08, 0.1 + ph]], p.casino[1]);
      q += poly([[px + 1.08, y - 0.08, 0.1], [px + 1.08, y + d + 0.08, 0.1], [px + 1.08, y + d + 0.08, 0.1 + ph], [px + 1.08, y - 0.08, 0.1 + ph]], p.casino[2]);
      for (let f = 0; f < 3; f++) q += arcos('x', px + 1.08, y + d / 2 - 0.1, y + d / 2 + 0.3, 0.42 + f * 0.75);
      for (let f = 0; f < 3; f++) q += arcos('y', y + d + 0.08, px + 0.44, px + 0.9, 0.42 + f * 0.75);
      q += poly([[px, y - 0.08, 0.1 + ph], [px + 1.08, y - 0.08, 0.1 + ph], [px + 1.08, y + d + 0.08, 0.1 + ph], [px, y + d + 0.08, 0.1 + ph]], p.casino[0]);
      q += mansarda(px, y - 0.08, 0.1 + ph, 1.08, d + 0.16, 0.95, 0.42);
      agrega(clave + 0.6, q);
      return { x: px + 0.5, y: y + d / 2, z: ph + 1.1 };
    };
    // lobo marino de piedra sobre su pedestal, mirando al mar
    const lobo = (x, y) => {
      caja(x - 0.32, y - 0.32, 0.06, 0.64, 0.64, 0.42, [p.vereda, p.casino[1], p.casino[2]], false, null, x + y);
      const [a, b] = pt(x, y, 0.48), e = 0.85;
      agrega(x + y + 0.5, `<path d="M${a - 7 * e} ${b + 1} C${a - 8 * e} ${b - 6 * e} ${a - 5 * e} ${b - 14 * e} ${a - 1 * e} ${b - 19 * e} C${a + 0.5 * e} ${b - 22 * e} ${a + 3.5 * e} ${b - 23.5 * e} ${a + 6 * e} ${b - 22 * e} L${a + 9.5 * e} ${b - 21 * e} C${a + 8 * e} ${b - 19.4 * e} ${a + 5.6 * e} ${b - 19 * e} ${a + 4.4 * e} ${b - 17 * e} C${a + 3 * e} ${b - 12 * e} ${a + 4.5 * e} ${b - 6 * e} ${a + 8 * e} ${b - 1.5 * e} L${a + 9 * e} ${b + 1} Z" fill="${p.bronce}"/>
        <path d="M${a + 1 * e} ${b - 9 * e} C${a + 5 * e} ${b - 7 * e} ${a + 8 * e} ${b - 4 * e} ${a + 10 * e} ${b - 0.5 * e}" stroke="${p.bronce}" stroke-width="${2.4 * e}" fill="none" stroke-linecap="round"/>`);
      return { x, y, z: 1.4 };
    };
    // Torreón del Monje: rocas, salón almenado con arcos, torre y el puente a la Rambla
    const torreon = (x, y) => {
      caja(x - 0.3, y - 0.4, -0.18, 2.1, 2.0, 0.55, p.roca, false, null, x + y - 0.2);
      caja(x + 1.0, y - 0.1, -0.18, 1.1, 0.9, 0.35, p.roca, false, null, x + y + 0.4);
      const z = 0.37;
      let s = suelta(x, y, z, 1.5, 1.3, 0.95, p.casino, false);
      s += arcos('y', y + 1.3, x + 0.15, x + 1.5, z + 0.18, 0.32);
      s += arcos('x', x + 1.5, y + 0.15, y + 1.3, z + 0.18, 0.32);
      for (let a = x; a < x + 1.45; a += 0.3) s += poly([[a, y + 1.3, z + 0.95], [a + 0.16, y + 1.3, z + 0.95], [a + 0.16, y + 1.3, z + 1.12], [a, y + 1.3, z + 1.12]], p.casino[1]);
      for (let a = y; a < y + 1.25; a += 0.3) s += poly([[x + 1.5, a, z + 0.95], [x + 1.5, a + 0.16, z + 0.95], [x + 1.5, a + 0.16, z + 1.12], [x + 1.5, a, z + 1.12]], p.casino[2]);
      agrega(x + y + 0.9, s);
      const tx = x + 0.2, ty = y + 0.15, tz = z + 0.95, th = 2.1;
      let t = suelta(tx, ty, tz, 0.75, 0.75, th, p.casino, false);
      t += arcos('x', tx + 0.75, ty + 0.27, ty + 0.6, tz + th - 0.85);
      for (let k = 0; k < 3; k++) { t += suelta(tx + k * 0.3, ty + 0.6, tz + th, 0.15, 0.15, 0.2, p.casino, false); t += suelta(tx + 0.6, ty + k * 0.3, tz + th, 0.15, 0.15, 0.2, p.casino, false); }
      agrega(x + y + 1.0, t);
      const b0 = pt(MAR - 0.1, y + 0.65, 0.55), b1 = pt(x, y + 0.65, z + 0.5), bm = pt((MAR + x) / 2, y + 0.65, 0.15);
      agrega(x + y - 0.6, `<path d="M${b0[0]} ${b0[1]} L${b1[0]} ${b1[1]}" stroke="${p.casino[1]}" stroke-width="5" stroke-linecap="round"/><path d="M${b0[0]} ${b0[1] + 6} Q${bm[0]} ${bm[1] + 2} ${b1[0]} ${b1[1] + 6}" stroke="${p.casino[2]}" stroke-width="3" fill="none"/>`);
      return { x: tx + 0.4, y: ty + 0.4, z: tz + th + 0.4 };
    };
    // lanchita amarilla del puerto
    const lancha = (x, y, w = 1.3) => {
      const z = -0.18, L = p.lancha;
      let s = poly([[x, y + 0.5, z + 0.32], [x + w, y + 0.5, z + 0.32], [x + w - 0.18, y + 0.42, z], [x + 0.25, y + 0.42, z]], L[1]);
      s += poly([[x + w, y, z + 0.32], [x + w, y + 0.5, z + 0.32], [x + w - 0.18, y + 0.42, z], [x + w - 0.18, y + 0.08, z]], L[2]);
      s += poly([[x, y, z + 0.32], [x + w, y, z + 0.32], [x + w, y + 0.5, z + 0.32], [x, y + 0.5, z + 0.32]], L[0]);
      s += poly([[x, y + 0.5, z + 0.32], [x + w, y + 0.5, z + 0.32], [x + w, y + 0.5, z + 0.38], [x, y + 0.5, z + 0.38]], p.techo[0]);
      s += suelta(x + 0.25, y + 0.1, z + 0.32, 0.45, 0.3, 0.32, [p.cabina, p.cabina, p.casino[2]], false);
      const m0 = pt(x + 0.9, y + 0.25, z + 0.32), m1 = pt(x + 0.9, y + 0.25, z + 1.3), m2 = pt(x + w - 0.1, y + 0.25, z + 0.4);
      s += `<path d="M${m0[0]} ${m0[1]} L${m1[0]} ${m1[1]}" stroke="${p.tronco}" stroke-width="1.4"/><path d="M${m1[0]} ${m1[1]} L${m2[0]} ${m2[1]}" stroke="${p.tronco}" stroke-width="0.7" opacity="0.6"/>`;
      agrega(x + y + 0.3, s);
    };
    const carpa = (x, y) => {
      const w = 0.5, h = 0.42, [c1, c2] = p.carpa;
      let s = poly([[x, y + w, 0], [x + w, y + w, 0], [x + w, y + w, h], [x, y + w, h]], c2);
      for (let k = 0; k < 3; k++) s += poly([[x + (k * w) / 3, y + w, 0], [x + ((k + 0.5) * w) / 3, y + w, 0], [x + ((k + 0.5) * w) / 3, y + w, h], [x + (k * w) / 3, y + w, h]], c1);
      s += poly([[x + w, y, 0], [x + w, y + w, 0], [x + w, y + w, h], [x + w, y, h]], c1);
      s += poly([[x - 0.04, y + w + 0.04, h], [x + w + 0.04, y + w + 0.04, h], [x + w / 2, y + w / 2, h + 0.3]], c1);
      s += poly([[x + w + 0.04, y - 0.04, h], [x + w + 0.04, y + w + 0.04, h], [x + w / 2, y + w / 2, h + 0.3]], p.techo[0]);
      agrega(x + y + 0.5, s);
    };
    const catedral = (x, y) => {
      const w = 2.6, d = 1.2, h = 1.5, rr = 0.7, z = 0.1;
      let s = poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]], p.casino[1]);
      s += poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]], p.casino[2]);
      for (let a = x + 0.25; a < x + w - 0.4; a += 0.42) s += poly([[a, y + d, z + 0.4], [a + 0.16, y + d, z + 0.4], [a + 0.16, y + d, z + 1.0], [a + 0.08, y + d, z + 1.16], [a, y + d, z + 1.0]], p.ventanaCasino);
      s += poly([[x, y, z + h], [x + w, y, z + h], [x + w, y + d / 2, z + h + rr], [x, y + d / 2, z + h + rr]], p.techo[0]);
      s += poly([[x + w, y, z + h], [x + w, y + d, z + h], [x + w, y + d / 2, z + h + rr]], p.casino[2]);
      s += poly([[x, y + d / 2, z + h + rr], [x + w, y + d / 2, z + h + rr], [x + w, y + d, z + h], [x, y + d, z + h]], p.techo[1]);
      agrega(x + w / 2 + y + d / 2, s);
      const tx = x + w, ty = y + 0.15, tw = 0.9, th = 3.0;
      let t = suelta(tx, ty, z, tw, tw, th, p.casino, false);
      t += poly([[tx + tw, ty + 0.3, z + 1.2], [tx + tw, ty + 0.6, z + 1.2], [tx + tw, ty + 0.6, z + 2.1], [tx + tw, ty + 0.45, z + 2.35], [tx + tw, ty + 0.3, z + 2.1]], p.ventanaCasino);
      t += poly([[tx, ty + tw, z + th], [tx + tw, ty + tw, z + th], [tx + tw / 2, ty + tw / 2, z + th + 1.9]], p.techo[1]);
      t += poly([[tx + tw, ty, z + th], [tx + tw, ty + tw, z + th], [tx + tw / 2, ty + tw / 2, z + th + 1.9]], p.techo[0]);
      agrega(tx + tw / 2 + ty + tw / 2, t);
      return { x: tx + tw / 2, y: ty + tw / 2, z: z + th + 2.0 };
    };
    const faro = (x, y) => {
      caja(x - 0.8, y - 0.8, -0.18, 1.6, 1.6, 0.5, p.roca, false, null, x + y);
      const [a, b] = pt(x, y, 0.32), h = 5.2 * K, w0 = 0.6 * K, w1 = 0.4 * K;
      let s = '';
      for (let i = 0; i < 6; i++) {
        const t0 = i / 6, t1 = (i + 1) / 6, wa = w0 + (w1 - w0) * t0, wb = w0 + (w1 - w0) * t1;
        s += `<path d="M${a - wa} ${b - h * t0} L${a + wa} ${b - h * t0} L${a + wb} ${b - h * t1} L${a - wb} ${b - h * t1} Z" fill="${p.faro[i % 2]}"/>`;
      }
      s += `<path d="M${a} ${b - h} L${a + w1} ${b - h} L${a + w0} ${b} L${a} ${b} Z" fill="#0E1D36" opacity="0.12"/>`;
      s += `<rect x="${a - w1 * 1.25}" y="${b - h - 0.12 * K}" width="${w1 * 2.5}" height="${0.14 * K}" rx="2" fill="${p.faro[1]}"/>`;
      s += `<rect x="${a - w1 * 0.8}" y="${b - h - 0.85 * K}" width="${w1 * 1.6}" height="${0.75 * K}" rx="3" fill="${p.luz}"/>`;
      s += `<path d="M${a - w1} ${b - h - 0.85 * K} L${a} ${b - h - 1.5 * K} L${a + w1} ${b - h - 0.85 * K} Z" fill="${p.faro[1]}"/>`;
      if (p.haz) { s += `<path d="M${a} ${b - h - 0.5 * K} L${a + 6 * K} ${b - h - 2.4 * K} L${a + 6 * K} ${b - h + 1.0 * K} Z" fill="${p.luz}" opacity="${p.haz}"/>`; pt(x + 3.5, y - 3.5, 7.5); }
      agrega(x + y + 0.5, s);
      return { x, y, z: 7.0 };
    };

    // ---------- manzanas
    const manzanas = [];
    for (let bx = 1; bx + 4 <= Math.min(MAR - 1.4, W); bx += 5) for (let by = 1; by + 4 <= D; by += 5) manzanas.push([bx, by]);
    manzanas.forEach(([bx, by]) => {
      suelo.push(poly([[bx, by, 0.1], [bx + 4, by, 0.1], [bx + 4, by + 4, 0.1], [bx, by + 4, 0.1]], p.vereda));
      suelo.push(poly([[bx, by + 4, 0], [bx + 4, by + 4, 0], [bx + 4, by + 4, 0.1], [bx, by + 4, 0.1]], p.cordonI));
      suelo.push(poly([[bx + 4, by, 0], [bx + 4, by + 4, 0], [bx + 4, by + 4, 0.1], [bx + 4, by, 0.1]], p.cordonD));
    });
    const costa = manzanas.filter(([bx]) => conMar && bx + 4 >= MAR - 3);
    const mitad = costa.slice().sort((m, n) => Math.abs(m[1] + 2 - D / 2) - Math.abs(n[1] + 2 - D / 2) || n[1] - m[1])[0];
    const catedralEn = mitad ? manzanas.find(([bx, by]) => by === mitad[1] && bx === mitad[0] - 5) : null;
    let casaPedido = null;
    manzanas.forEach(([bx, by]) => {
      if (mitad && bx === mitad[0] && by === mitad[1]) {
        marcas.casino = palacio(bx + 0.1, by - 0.2, 3.6, 1.55, 2.0, bx + by + 1.5);
        palacio(bx + 0.1, by + 2.65, 3.6, 1.55, 2.0, bx + by + 4.2);
        return;
      }
      if (catedralEn && bx === catedralEn[0] && by === catedralEn[1]) {
        marcas.catedral = catedral(bx + 0.3, by + 1.2);
        arbol(bx + 0.8, by + 3.3, 0.7); arbol(bx + 2.2, by + 3.4, 0.7);
        return;
      }
      if (costa.some(([cx, cy]) => cx === bx && cy === by)) {
        caja(bx + 0.3, by + 0.3, 0.1, 1.6, 1.5, 4 + r() * 3.2, r() < 0.35 ? p.edifAzul : p.edif, true, p.vidrio);
        caja(bx + 2.2, by + 0.3, 0.1, 1.5, 1.6, 2.6 + r() * 4.4, p.edif, true, p.vidrio);
        caja(bx + 0.3, by + 2.2, 0.1, 1.5, 1.5, 2.2 + r() * 2.6, p.edif, true, p.vidrio);
        caja(bx + 2.2, by + 2.3, 0.1, 1.5, 1.4, 3 + r() * 3, r() < 0.5 ? p.edifAzul : p.edif, true, p.vidrio);
      } else {
        const a = chalet(bx + 0.3, by + 0.35, 1.5, 1.35, 1.0);
        chalet(bx + 2.2, by + 0.35, 1.5, 1.35, 1.1);
        const b = chalet(bx + 0.3, by + 2.35, 1.5, 1.35, 0.95);
        if (r() < 0.6) chalet(bx + 2.2, by + 2.35, 1.5, 1.35, 1.0);
        else caja(bx + 2.2, by + 2.3, 0.1, 1.5, 1.4, 1.9, p.edifAzul, true, p.vidrioAzul);
        if (!casaPedido) casaPedido = by > 3 ? b : a;
      }
      arbol(bx + 4.25, by + 1.2, 0.8); arbol(bx + 4.25, by + 3.3, 0.7);
    });

    if (conMar) {
      if (mitad) {
        const yc = mitad[1] + 2.05;
        marcas.lobos = lobo(MAR - 0.55, yc - 0.55); lobo(MAR - 0.55, yc + 0.55);
        for (let y = Math.max(0.6, mitad[1] - 1); y < Math.min(D - 3.6, mitad[1] + 5.4); y += 0.72) { carpa(MAR + 0.25, y); carpa(MAR + 1.05, y + 0.2); }
        marcas.playa = { x: MAR + 0.8, y: Math.min(D - 4.5, mitad[1] + 3.5), z: 0.8 };
      }
      for (let y = 1.2; y < D - 0.5; y += 2.6) if (!mitad || Math.abs(y - (mitad[1] + 2)) > 1.4) arbol(MAR - 0.6, y, 0.85);
      persona(MAR - 0.9, 3.4, 0, 'celular'); persona(MAR - 0.4, 4.1, 1); persona(MAR - 0.8, D - 2.4, 3, 'celular');
      // puerto: escollera con lanchitas amarillas
      const py = Math.min(3.4, D / 3);
      caja(MAR + PLAYA - 0.2, py, -0.18, W - MAR - PLAYA - 0.1, 0.5, 0.3, [p.vereda, p.roca[0], p.roca[1]], false, null, MAR + PLAYA + py + 0.2);
      for (let k = 0; k < 3; k++) {
        const lx = MAR + PLAYA + 0.4 + k * 1.6;
        if (lx + 1.8 < W - 0.2) { lancha(lx, py - 0.75); lancha(lx + 0.4, py + 0.62, 1.15); }
      }
      marcas.puerto = { x: MAR + PLAYA + 2.6, y: py - 0.5, z: 1.4 };
      marcas.faro = faro(W - 1.0, 0.9);
      marcas.torreon = torreon(MAR + PLAYA - 0.2, D - 2.4);
      [[W - 2.5, D - 5, 4.6], [W - 4, D - 3.5, 5.2], [W - 3.2, D - 7.5, 5.6]].forEach(([x, y, z]) => {
        const [a, b] = pt(x, y, z);
        arriba.push(`<path d="M${a - 7} ${b} q3.5 -4.5 7 0 q3.5 -4.5 7 0" fill="none" stroke="${p.gaviota}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`);
      });
    }
    [[5.5, 3.2, 4], [10.5, 8.6, 5, 'celular'], [5.4, 13.6, 1], [0.5, 8.4, 2, 'caja']].forEach(([x, y, i, o]) => { if (x < Math.min(W, MAR - 1.5) && y < D) persona(x, y, i, o); });
    const vanX = Math.min(opc.vanX ?? 10.2, MAR - 4.2), vanY = opc.vanY ?? (D > 12 ? 10.25 : 5.25);
    const van = camioneta(vanX, vanY);
    persona(vanX + 2.3, vanY + 0.9, 0, 'caja');

    if (opc.pines && casaPedido) {
      const [pa, pb] = pt(casaPedido.x, casaPedido.y, casaPedido.z + 1.4), [va, vb] = pt(van.x, van.y, van.z + 1.6);
      const pin = (a, b, fondo, icono, color) => `<g><path d="M${a} ${b + 1.3 * K} C${a - 0.25 * K} ${b + 0.9 * K} ${a - 0.62 * K} ${b + 0.62 * K} ${a - 0.62 * K} ${b} A${0.62 * K} ${0.62 * K} 0 1 1 ${a + 0.62 * K} ${b} C${a + 0.62 * K} ${b + 0.62 * K} ${a + 0.25 * K} ${b + 0.9 * K} ${a} ${b + 1.3 * K} Z" fill="${fondo}" stroke="#0E1D36" stroke-width="1.6"/>
        <g transform="translate(${a - 0.42 * K} ${b - 0.42 * K}) scale(${(0.84 * K) / 24})" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${icono}</g></g>`;
      const gota = '<path d="M12 3s6.2 6.6 6.2 11.2a6.2 6.2 0 0 1-12.4 0C5.8 9.6 12 3 12 3z"/>';
      const llave = '<path d="M15.5 3a4.8 4.8 0 0 0-4.6 6.2l-7.4 7.4a2 2 0 0 0 2.9 2.9l7.4-7.4A4.8 4.8 0 0 0 20 6.4l-2.8 2.8-2.5-.6-.6-2.5z"/>';
      const mx = (pa + va) / 2, my = Math.min(pb, vb) - 2.6 * K;
      arriba.push(`<path d="M${pa} ${pb - 0.8 * K} Q${mx} ${my} ${va} ${vb - 0.8 * K}" fill="none" stroke="${opc.paleta === 'noche' ? '#F5F59A' : '#0E1D36'}" stroke-width="2.2" stroke-dasharray="2 7" stroke-linecap="round"/>`);
      arriba.push(pin(pa, pb, '#F5F59A', gota, '#0E1D36'), pin(va, vb, '#1F57A8', llave, '#FFFFFF'));
      pt(casaPedido.x, casaPedido.y, casaPedido.z + 3.5);
    }

    if (opc.rotulos) {
      const tam = opc.tam || 13;
      const nombres = { faro: 'Faro', puerto: 'Puerto', casino: 'Casino y Rambla', lobos: 'Lobos marinos', torreon: 'Torreón del Monje', catedral: 'Catedral', playa: 'Balnearios' };
      Object.entries(marcas).forEach(([k, m]) => {
        if (!nombres[k] || !(opc.solo || ['faro', 'puerto', 'casino', 'lobos', 'torreon', 'catedral']).includes(k)) return;
        const altos = { faro: 1.2, puerto: 1.8, casino: 3.4, lobos: 2.2, torreon: 1.4, catedral: 1.2, playa: 3.2 };
        const [a, b] = pt(m.x, m.y, m.z), alto = (altos[k] || 1.4) * K, ty = b - alto - 7;
        const ancho = (nombres[k].length * tam * 0.82) / 2 + 8, alto2 = tam * 1.25 + 8;
        arriba.push(`<g font-family="DM Sans, sans-serif" font-weight="800" font-size="${tam}" letter-spacing="${(tam * 0.12).toFixed(1)}">
          <path d="M${a} ${b} V${ty}" stroke="${p.rotulo === '#0E1D36' && opc.paleta === 'noche' ? '#F5F59A' : p.rotulo}" stroke-width="1.2"/>
          <circle cx="${a}" cy="${b}" r="3.2" fill="${opc.paleta === 'noche' ? '#F5F59A' : p.rotulo}"/>
          <rect x="${a - ancho}" y="${ty - alto2 + 4}" width="${ancho * 2}" height="${alto2}" rx="${alto2 / 2}" fill="${p.rotuloFondo}" stroke="${p.rotulo}" stroke-opacity="0.18"/>
          <text x="${a}" y="${ty - 4 - (alto2 - tam * 1.25 - 8) / 2 - 3}" text-anchor="middle" fill="${p.rotulo}">${nombres[k].toUpperCase()}</text></g>`);
        xmin = Math.min(xmin, a - ancho); xmax = Math.max(xmax, a + ancho); ymin = Math.min(ymin, ty - alto2);
      });
    }

    cosas.sort((a, b) => a.k - b.k);
    const m = 6, vb = [xmin - m, ymin - m, xmax - xmin + 2 * m, ymax - ymin + 2 * m].map((v) => v.toFixed(1)).join(' ');
    return `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Maqueta de Mar del Plata: la Rambla con el Casino y los lobos marinos, el Torreón del Monje, el puerto con lanchitas amarillas, balnearios, la Catedral, el faro y chalets de piedra">${suelo.join('')}${cosas.map((c) => c.s).join('')}${arriba.join('')}</svg>`;
  }

  function reemplazar() {
    document.querySelectorAll('[data-iso]').forEach((el) => {
      const v = el.dataset.iso;
      const opc = { paleta: el.dataset.paleta || 'dia', semilla: +(el.dataset.semilla || 3), pines: el.dataset.pines === '1', rotulos: el.dataset.rotulos === '1', tam: +(el.dataset.tam || 13) };
      if (el.dataset.solo) opc.solo = el.dataset.solo.split(',');
      if (v === 'barrio') Object.assign(opc, { ancho: 11, fondo: 11, mar: 99, vanX: 5.2, vanY: 5.25 });
      if (v === 'costa') Object.assign(opc, { ancho: 19.5, fondo: 11, mar: 12 });
      el.innerHTML = escena(opc);
      el.querySelector('svg').style.cssText = 'display:block;width:100%;height:auto;overflow:visible';
    });
  }
  window.__iso = reemplazar;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', reemplazar); else reemplazar();
})();
