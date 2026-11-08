// Maqueta isométrica de Mar del Plata para la Colección Handyx: una losa flotante con manzanas, chalets de techo a dos
// aguas, torres de la costa, la rambla, la playa, el mar, el faro, árboles, gente sin cara y la camioneta del
// especialista. Todo en SVG dibujado en código (vectorial), con la paleta de la marca, sin texto.
// Uso: <div data-iso="maqueta|barrio|costa" data-paleta="dia|noche" data-semilla="3" data-pines="1"></div>
//   data-pines="1" agrega el pedido (pin amarillo sobre una casa), el especialista (pin azul sobre la camioneta) y el
//   arco que los une: la idea del producto en una sola imagen.
(function () {
  const C = Math.cos(Math.PI / 6), K = 26;
  const PAL = {
    dia: {
      calle: '#D5E0F2', vereda: '#FBFAF6', losaIzq: '#1F57A8', losaDer: '#143E7E', losaFranja: '#2C66B8',
      edif: ['#FFFFFF', '#E9EFF9', '#BFD0EC'], vidrio: ['#C7D5EE', '#A7BDE4'], luz: '#F5F59A',
      edifAzul: ['#2C66B8', '#1F57A8', '#143E7E'], vidrioAzul: ['#143E7E', '#0E1D36'],
      techo: ['#143E7E', '#1F57A8', '#E9EFF9'], arbol: ['#2C66B8', '#1F57A8', '#143E7E'], tronco: '#0E1D36',
      arena: '#F3EBD3', arenaLado: '#E2D6B4', mar: '#2C66B8', marLado: '#1F57A8', ola: '#E9EFF9', rambla: '#FFFFFF',
      faro: ['#FFFFFF', '#0E1D36'], piel: ['#E7B48C', '#C98C62', '#8D5B3B'], ropa: ['#1F57A8', '#F5F59A', '#0E1D36', '#FFFFFF'],
      pelo: '#26324A', sombra: 'rgba(14,29,54,0.16)', haz: 0.0,
    },
    noche: {
      calle: '#0E1D36', vereda: '#162B4F', losaIzq: '#0A1528', losaDer: '#060E1C', losaFranja: '#13284A',
      edif: ['#2C66B8', '#1F57A8', '#143E7E'], vidrio: ['#143E7E', '#0E1D36'], luz: '#F5F59A',
      edifAzul: ['#3A76CC', '#2C66B8', '#1F57A8'], vidrioAzul: ['#0E1D36', '#0A1528'],
      techo: ['#0E1D36', '#143E7E', '#2C66B8'], arbol: ['#1F57A8', '#143E7E', '#0E1D36'], tronco: '#060E1C',
      arena: '#2A3A5A', arenaLado: '#1C2A46', mar: '#0B1A33', marLado: '#08142A', ola: '#2C66B8', rambla: '#22385E',
      faro: ['#E9EFF9', '#143E7E'], piel: ['#C99A78', '#A9744F', '#7A4E33'], ropa: ['#F5F59A', '#E9EFF9', '#2C66B8', '#F5F59A'],
      pelo: '#060E1C', sombra: 'rgba(0,0,0,0.3)', haz: 0.2, prob: 0.26,
    },
  };
  const azar = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647);

  function escena(opc) {
    const p = PAL[opc.paleta] || PAL.dia, r = azar(opc.semilla || 3);
    let xmin = 1e9, xmax = -1e9, ymin = 1e9, ymax = -1e9;
    const pr = (X, Y, Z = 0) => {
      const sx = (X - Y) * C * K, sy = (X + Y) * 0.5 * K - Z * K;
      xmin = Math.min(xmin, sx); xmax = Math.max(xmax, sx); ymin = Math.min(ymin, sy); ymax = Math.max(ymax, sy);
      return sx.toFixed(1) + ' ' + sy.toFixed(1);
    };
    const poly = (pts, fill, extra = '') => `<path d="M${pts.map((q) => pr(...q)).join(' L')} Z" fill="${fill}"${extra}/>`;
    const suelo = [], cosas = [], arriba = [];
    const W = opc.ancho || 24, D = opc.fondo || 16, MAR = opc.mar ?? 17;

    // ---- losa: espesor con dos franjas, como una maqueta de arquitectura
    const losa = (z0, z1, cI, cD) => poly([[0, D, z0], [W, D, z0], [W, D, z1], [0, D, z1]], cI) + poly([[W, 0, z0], [W, D, z0], [W, D, z1], [W, 0, z1]], cD);
    suelo.push(losa(-1.6, -0.5, p.losaIzq, p.losaDer), losa(-0.5, 0, p.losaFranja, p.losaIzq));
    const conMar = MAR < W;
    suelo.push(poly([[0, 0, 0], [Math.min(MAR, W), 0, 0], [Math.min(MAR, W), D, 0], [0, D, 0]], p.calle));
    // costa: rambla, playa y mar
    if (conMar) {
    suelo.push(poly([[MAR - 1.2, 0, 0.06], [MAR, 0, 0.06], [MAR, D, 0.06], [MAR - 1.2, D, 0.06]], p.rambla));
    suelo.push(poly([[MAR, 0, 0], [MAR + 1.6, 0, 0], [MAR + 1.6, D, 0], [MAR, D, 0]], p.arena));
    suelo.push(poly([[MAR + 1.6, 0, -0.18], [W, 0, -0.18], [W, D, -0.18], [MAR + 1.6, D, -0.18]], p.mar));
    suelo.push(poly([[MAR + 1.6, D, -0.5], [W, D, -0.5], [W, D, -0.18], [MAR + 1.6, D, -0.18]], p.marLado));
    for (let i = 0; i < 26; i++) {
      const x = MAR + 2.2 + r() * (W - MAR - 3), y = 0.6 + r() * (D - 1.4), l = 0.6 + r() * 0.9;
      suelo.push(`<path d="M${pr(x, y, -0.18)} L${pr(x, y + l, -0.18)}" stroke="${p.ola}" stroke-width="1.6" stroke-linecap="round" opacity="0.55"/>`);
    }
    // espigones de piedra
    [3.5, 9.5, 14].forEach((y) => { if (y < D - 1) suelo.push(poly([[MAR + 1.2, y, 0.02], [MAR + 4.2, y, 0.02], [MAR + 4.2, y + 0.45, 0.02], [MAR + 1.2, y + 0.45, 0.02]], p.vereda)); });
    }

    // ---- manzanas
    const manzanas = [];
    for (let bx = 1; bx + 4 <= Math.min(MAR - 1.4, W); bx += 5) for (let by = 1; by + 4 <= D; by += 5) manzanas.push([bx, by]);
    manzanas.forEach(([bx, by]) => {
      suelo.push(poly([[bx, by, 0.1], [bx + 4, by, 0.1], [bx + 4, by + 4, 0.1], [bx, by + 4, 0.1]], p.vereda));
      suelo.push(poly([[bx, by + 4, 0], [bx + 4, by + 4, 0], [bx + 4, by + 4, 0.1], [bx, by + 4, 0.1]], p.calle === '#0E1D36' ? '#0A1528' : '#C3D2EC'));
      suelo.push(poly([[bx + 4, by, 0], [bx + 4, by + 4, 0], [bx + 4, by + 4, 0.1], [bx + 4, by, 0.1]], p.calle === '#0E1D36' ? '#081224' : '#B4C6E6'));
    });

    const caja = (x, y, z, w, d, h, cara, ventanas, vidrio, clave) => {
      let s = poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]], cara[1]);
      s += poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]], cara[2]);
      s += poly([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]], cara[0]);
      if (ventanas) {
        for (let f = z + 0.45; f + 0.42 < z + h - 0.15; f += 0.78) {
          const lit = () => (r() < (p.prob ?? 0.12) ? p.luz : null);
          const l1 = lit(), l2 = lit();
          s += poly([[x + 0.14, y + d, f], [x + w - 0.14, y + d, f], [x + w - 0.14, y + d, f + 0.4], [x + 0.14, y + d, f + 0.4]], l1 || vidrio[0]);
          s += poly([[x + w, y + 0.14, f], [x + w, y + d - 0.14, f], [x + w, y + d - 0.14, f + 0.4], [x + w, y + 0.14, f + 0.4]], l2 || vidrio[1]);
        }
      }
      cosas.push({ k: clave ?? x + w / 2 + y + d / 2, s });
    };
    const chalet = (x, y, w, d, h) => {
      const z = 0.1, zt = z + h, rr = 0.85;
      let s = poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, zt], [x, y + d, zt]], p.edif[1]);
      s += poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, zt], [x + w, y, zt]], p.edif[2]);
      // zócalo de piedra
      s += poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + 0.3], [x, y + d, z + 0.3]], p.techo[0], ' opacity="0.22"');
      // puerta y ventana con luz
      s += poly([[x + w * 0.62, y + d, z], [x + w * 0.62 + 0.36, y + d, z], [x + w * 0.62 + 0.36, y + d, z + 0.62], [x + w * 0.62, y + d, z + 0.62]], p.techo[1]);
      s += poly([[x + 0.3, y + d, z + 0.42], [x + 0.78, y + d, z + 0.42], [x + 0.78, y + d, z + 0.82], [x + 0.3, y + d, z + 0.82]], r() < 0.45 ? p.luz : p.vidrio[0]);
      s += poly([[x + w, y + d * 0.3, z + 0.42], [x + w, y + d * 0.7, z + 0.42], [x + w, y + d * 0.7, z + 0.82], [x + w, y + d * 0.3, z + 0.82]], p.vidrio[1]);
      // techo a dos aguas (cumbrera paralela a X), con alero
      const o = 0.14;
      s += poly([[x - o, y - o, zt - 0.05], [x + w + o, y - o, zt - 0.05], [x + w + o, y + d / 2, zt + rr], [x - o, y + d / 2, zt + rr]], p.techo[0]);
      s += poly([[x + w, y, zt], [x + w, y + d, zt], [x + w, y + d / 2, zt + rr]], p.edif[2]);
      s += poly([[x - o, y + d / 2, zt + rr], [x + w + o, y + d / 2, zt + rr], [x + w + o, y + d + o, zt - 0.05], [x - o, y + d + o, zt - 0.05]], p.techo[1]);
      // chimenea
      const cx = x + w * 0.25, cy = y + d * 0.62;
      s += poly([[cx, cy + 0.3, zt + 0.5], [cx + 0.3, cy + 0.3, zt + 0.5], [cx + 0.3, cy + 0.3, zt + 1.15], [cx, cy + 0.3, zt + 1.15]], p.edif[1]);
      s += poly([[cx + 0.3, cy, zt + 0.5], [cx + 0.3, cy + 0.3, zt + 0.5], [cx + 0.3, cy + 0.3, zt + 1.15], [cx + 0.3, cy, zt + 1.15]], p.edif[2]);
      s += poly([[cx, cy, zt + 1.15], [cx + 0.3, cy, zt + 1.15], [cx + 0.3, cy + 0.3, zt + 1.15], [cx, cy + 0.3, zt + 1.15]], p.edif[0]);
      cosas.push({ k: x + w / 2 + y + d / 2, s });
      return { x: x + w / 2, y: y + d / 2, z: zt + rr };
    };
    const arbol = (x, y, s0 = 1) => {
      const [a, b] = pr(x, y, 0.1).split(' ').map(Number);
      const [c, d] = pr(x, y, 0.1 + 0.9 * s0).split(' ').map(Number);
      const rad = 0.52 * K * s0;
      const s = `<ellipse cx="${a}" cy="${b}" rx="${rad * 0.9}" ry="${rad * 0.45}" fill="${p.sombra}"/>
        <path d="M${a} ${b} L${c} ${d}" stroke="${p.tronco}" stroke-width="${2.6 * s0}" stroke-linecap="round"/>
        <circle cx="${c}" cy="${d - rad * 0.5}" r="${rad}" fill="${p.arbol[1]}"/>
        <path d="M${c - rad} ${d - rad * 0.5} A${rad} ${rad} 0 0 1 ${c + rad * 0.2} ${d - rad * 1.48} A${rad * 0.95} ${rad * 0.95} 0 0 0 ${c - rad * 0.55} ${d + rad * 0.15} Z" fill="${p.arbol[0]}"/>
        <path d="M${c + rad * 0.15} ${d + rad * 0.48} A${rad} ${rad} 0 0 0 ${c + rad} ${d - rad * 0.5} A${rad * 0.8} ${rad * 0.8} 0 0 1 ${c - rad * 0.2} ${d + rad * 0.3} Z" fill="${p.arbol[2]}" opacity="0.65"/>`;
      cosas.push({ k: x + y + 0.01, s });
    };
    // gente sin cara: sombra, piernas, cuerpo, brazos, cabeza y pelo; vista isométrica de tres cuartos
    const persona = (x, y, i, objeto) => {
      const [a, b] = pr(x, y, 0.1).split(' ').map(Number);
      const e = K / 26, piel = p.piel[i % 3], ropa = p.ropa[i % p.ropa.length], ropa2 = p.ropa[(i + 2) % p.ropa.length];
      let s = `<ellipse cx="${a}" cy="${b}" rx="${6 * e}" ry="${2.6 * e}" fill="${p.sombra}"/>
        <path d="M${a - 1.6 * e} ${b} V${b - 8 * e} M${a + 1.8 * e} ${b + 0.6 * e} V${b - 8 * e}" stroke="${p.calle === '#0E1D36' ? '#E9EFF9' : '#0E1D36'}" stroke-width="${2.4 * e}" stroke-linecap="round"/>
        <path d="M${a - 3.6 * e} ${b - 7.4 * e} Q${a - 3.8 * e} ${b - 17 * e} ${a} ${b - 17.6 * e} Q${a + 3.8 * e} ${b - 17 * e} ${a + 3.6 * e} ${b - 7.4 * e} Z" fill="${ropa}"/>
        <path d="M${a + 3.2 * e} ${b - 15 * e} Q${a + 5.2 * e} ${b - 11 * e} ${a + 4.6 * e} ${b - 8.6 * e}" stroke="${ropa}" stroke-width="${2.2 * e}" fill="none" stroke-linecap="round"/>
        <circle cx="${a}" cy="${b - 21.4 * e}" r="${3.5 * e}" fill="${piel}"/>
        <path d="M${a - 3.6 * e} ${b - 21.2 * e} Q${a - 3.4 * e} ${b - 25.6 * e} ${a + 0.4 * e} ${b - 25.2 * e} Q${a + 3.8 * e} ${b - 24.6 * e} ${a + 3.4 * e} ${b - 22.4 * e} Q${a} ${b - 23.6 * e} ${a - 3.6 * e} ${b - 21.2 * e} Z" fill="${p.pelo}"/>`;
      if (objeto === 'celular') s += `<rect x="${a + 3.4 * e}" y="${b - 11.8 * e}" width="${2.4 * e}" height="${3.8 * e}" rx="${0.6 * e}" fill="${p.luz}"/>`;
      if (objeto === 'caja') s += `<rect x="${a + 2.6 * e}" y="${b - 10.4 * e}" width="${6 * e}" height="${4.2 * e}" rx="${0.6 * e}" fill="${ropa2}" stroke="${p.tronco}" stroke-width="${0.6 * e}"/>`;
      cosas.push({ k: x + y + 0.02, s });
      return { a, b: b - 26 * e };
    };
    const camioneta = (x, y) => {
      const z = 0.02;
      caja(x, y, z + 0.18, 1.5, 0.75, 0.62, p.edifAzul, false, null, x + y + 1.2);
      caja(x + 1.5, y, z + 0.18, 0.5, 0.75, 0.42, p.edifAzul, false, null, x + y + 1.25);
      let s = poly([[x + 1.52, y + 0.75, z + 0.4], [x + 1.86, y + 0.75, z + 0.4], [x + 1.86, y + 0.75, z + 0.56], [x + 1.52, y + 0.75, z + 0.56]], p.vidrio[0]);
      s += poly([[x + 0.1, y + 0.75, z + 0.42], [x + 1.4, y + 0.75, z + 0.42], [x + 1.4, y + 0.75, z + 0.52], [x + 0.1, y + 0.75, z + 0.52]], p.luz);
      [[x + 0.35, y + 0.75], [x + 1.65, y + 0.75]].forEach(([wx, wy]) => {
        const [a, b] = pr(wx, wy, z + 0.18).split(' ').map(Number);
        s += `<ellipse cx="${a}" cy="${b}" rx="${0.2 * K}" ry="${0.22 * K}" fill="${p.tronco}"/>`;
      });
      cosas.push({ k: x + y + 1.3, s });
      return { x: x + 0.9, y: y + 0.4, z: z + 0.9 };
    };
    const faro = (x, y) => {
      // roca y torre a rayas, linterna amarilla y haz de luz
      caja(x - 0.9, y - 0.9, -0.18, 1.8, 1.8, 0.5, [p.vereda, p.edif[1], p.edif[2]], false, null, x + y);
      const [a, b] = pr(x, y, 0.32).split(' ').map(Number);
      const h = 5.2 * K, w0 = 0.62 * K, w1 = 0.42 * K;
      let s = '';
      for (let i = 0; i < 6; i++) {
        const t0 = i / 6, t1 = (i + 1) / 6, wa = w0 + (w1 - w0) * t0, wb = w0 + (w1 - w0) * t1;
        s += `<path d="M${a - wa} ${b - h * t0} L${a + wa} ${b - h * t0} L${a + wb} ${b - h * t1} L${a - wb} ${b - h * t1} Z" fill="${p.faro[i % 2]}"/>`;
      }
      s += `<path d="M${a} ${b - h} L${a + w1} ${b - h} L${a + w1} ${b - 0.1 * h} L${a + w0} ${b} L${a} ${b} Z" fill="#0E1D36" opacity="0.12"/>`;
      s += `<rect x="${a - w1 * 1.25}" y="${b - h - 0.12 * K}" width="${w1 * 2.5}" height="${0.14 * K}" rx="2" fill="${p.faro[1]}"/>`;
      s += `<rect x="${a - w1 * 0.8}" y="${b - h - 0.85 * K}" width="${w1 * 1.6}" height="${0.75 * K}" rx="3" fill="${p.luz}"/>`;
      s += `<path d="M${a - w1} ${b - h - 0.85 * K} L${a} ${b - h - 1.5 * K} L${a + w1} ${b - h - 0.85 * K} Z" fill="${p.faro[1]}"/>`;
      if (p.haz) s += `<path d="M${a} ${b - h - 0.5 * K} L${a + 7 * K} ${b - h - 2.6 * K} L${a + 7 * K} ${b - h + 1.2 * K} Z" fill="${p.luz}" opacity="${p.haz}"/>`;
      if (p.haz) pr(x + 4, y - 4, 6); // reserva lugar para el haz
      cosas.push({ k: x + y + 0.5, s });
    };

    // ---- poblar las manzanas: torres cerca del mar, chalets y edificios bajos tierra adentro
    let casaPedido = null;
    manzanas.forEach(([bx, by], i) => {
      const costa = bx + 4 >= MAR - 3;
      if (costa) {
        caja(bx + 0.3, by + 0.3, 0.1, 1.6, 1.5, 4 + r() * 3.2, r() < 0.35 ? p.edifAzul : p.edif, true, r() < 0.35 ? p.vidrioAzul : p.vidrio);
        caja(bx + 2.2, by + 0.3, 0.1, 1.5, 1.6, 2.6 + r() * 4.4, p.edif, true, p.vidrio);
        caja(bx + 0.3, by + 2.2, 0.1, 1.5, 1.5, 2.2 + r() * 2.6, p.edif, true, p.vidrio);
        caja(bx + 2.2, by + 2.3, 0.1, 1.5, 1.4, 3 + r() * 3, r() < 0.5 ? p.edifAzul : p.edif, true, p.vidrio);
      } else {
        const a = chalet(bx + 0.3, by + 0.35, 1.5, 1.35, 1.0);
        chalet(bx + 2.2, by + 0.35, 1.5, 1.35, 1.1);
        const b = chalet(bx + 0.3, by + 2.35, 1.5, 1.35, 0.95);
        if (r() < 0.5) chalet(bx + 2.2, by + 2.35, 1.5, 1.35, 1.0);
        else { caja(bx + 2.2, by + 2.3, 0.1, 1.5, 1.4, 1.9, p.edifAzul, true, p.vidrioAzul); }
        if (i === (opc.pedido ?? 4)) casaPedido = b;
        else if (!casaPedido && i === 1) casaPedido = a;
      }
      arbol(bx + 4.25, by + 1.2, 0.8); arbol(bx + 4.25, by + 3.3, 0.7);
    });
    // árboles de la rambla
    if (conMar) {
      for (let y = 1.2; y < D - 0.5; y += 2.6) arbol(MAR - 0.6, y, 0.85);
      faro(MAR + 4.6, 1.6);
      persona(MAR - 0.9, 5.4, 0, 'celular'); persona(MAR - 0.4, 6.1, 1); persona(MAR + 0.7, 9.2, 2); persona(MAR - 0.8, 12.4, 3, 'celular');
    }
    // gente en las veredas
    [[5.5, 3.2, 4], [10.5, 8.6, 5, 'celular'], [5.4, 13.6, 1], [0.5, 8.4, 2, 'caja']].forEach(([x, y, i, o]) => { if (x < W && y < D) persona(x, y, i, o); });
    const van = camioneta(opc.vanX ?? 10.2, opc.vanY ?? 10.25);
    persona((opc.vanX ?? 10.2) + 2.3, (opc.vanY ?? 10.25) + 0.9, 0, 'caja');

    // ---- pines y arco: el pedido llega a especialistas de la zona
    if (opc.pines && casaPedido) {
      const [pa, pb] = pr(casaPedido.x, casaPedido.y, casaPedido.z + 1.4).split(' ').map(Number);
      const [va, vb] = pr(van.x, van.y, van.z + 1.6).split(' ').map(Number);
      const pin = (a, b, fondo, icono, color) => `<g><ellipse cx="${a}" cy="${b + 1.55 * K}" rx="${0.32 * K}" ry="${0.14 * K}" fill="${p.sombra}"/>
        <path d="M${a} ${b + 1.3 * K} C${a - 0.25 * K} ${b + 0.9 * K} ${a - 0.62 * K} ${b + 0.62 * K} ${a - 0.62 * K} ${b} A${0.62 * K} ${0.62 * K} 0 1 1 ${a + 0.62 * K} ${b} C${a + 0.62 * K} ${b + 0.62 * K} ${a + 0.25 * K} ${b + 0.9 * K} ${a} ${b + 1.3 * K} Z" fill="${fondo}" stroke="#0E1D36" stroke-width="1.6"/>
        <g transform="translate(${a - 0.42 * K} ${b - 0.42 * K}) scale(${(0.84 * K) / 24})" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${icono}</g></g>`;
      const gota = '<path d="M12 3s6.2 6.6 6.2 11.2a6.2 6.2 0 0 1-12.4 0C5.8 9.6 12 3 12 3z"/>';
      const llave = '<path d="M15.5 3a4.8 4.8 0 0 0-4.6 6.2l-7.4 7.4a2 2 0 0 0 2.9 2.9l7.4-7.4A4.8 4.8 0 0 0 20 6.4l-2.8 2.8-2.5-.6-.6-2.5z"/>';
      const mx = (pa + va) / 2, my = Math.min(pb, vb) - 2.6 * K;
      arriba.push(`<path d="M${pa} ${pb - 0.8 * K} Q${mx} ${my} ${va} ${vb - 0.8 * K}" fill="none" stroke="${opc.paleta === 'noche' ? '#F5F59A' : '#0E1D36'}" stroke-width="2.2" stroke-dasharray="2 7" stroke-linecap="round"/>`);
      arriba.push(pin(pa, pb, '#F5F59A', gota, '#0E1D36'), pin(va, vb, '#1F57A8', llave, '#FFFFFF'));
      pr(casaPedido.x, casaPedido.y, casaPedido.z + 3.5);
    }

    cosas.sort((a, b) => a.k - b.k);
    const m = 6, vb = [xmin - m, ymin - m, xmax - xmin + 2 * m, ymax - ymin + 2 * m].map((v) => v.toFixed(1)).join(' ');
    return `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Maqueta de Mar del Plata: manzanas con chalets, torres frente al mar, la rambla, el faro y gente sin cara">${suelo.join('')}${cosas.map((c) => c.s).join('')}${arriba.join('')}</svg>`;
  }

  function reemplazar() {
    document.querySelectorAll('[data-iso]').forEach((el) => {
      const v = el.dataset.iso;
      const opc = { paleta: el.dataset.paleta || 'dia', semilla: +(el.dataset.semilla || 3), pines: el.dataset.pines === '1' };
      if (v === 'barrio') Object.assign(opc, { ancho: 11, fondo: 11, mar: 11, vanX: 5.2, vanY: 5.25, pedido: 0 });
      if (v === 'costa') Object.assign(opc, { ancho: 18, fondo: 11, mar: 12 });
      el.innerHTML = escena(opc);
      el.querySelector('svg').style.cssText = 'display:block;width:100%;height:auto;overflow:visible';
    });
  }
  window.__iso = reemplazar;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', reemplazar); else reemplazar();
})();
