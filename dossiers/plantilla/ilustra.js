// Kit de ilustración de la Colección Handyx: Mar del Plata en edificios, personas sin cara y herramientas, en SVG
// dibujado en código (vectorial, nítido a cualquier tamaño). Toma la paleta del estilo de la pieza.
// Uso en el HTML: <div data-ilustra="ciudad|vecina|especialista|operadora|casa" data-paleta="clara|marca|linea"></div>
// Se reemplaza al cargar, antes de que el exportador mida la página.
(function () {
  const PALETAS = {
    clara: { cielo: '#E9EFF9', fondo: '#C9D6EE', fondo2: '#B3C5E6', frente: '#FFFFFF', techo: '#1F57A8', linea: '#0E1D36', ventana: '#E9EFF9', luz: '#F5F59A', agua: '#2C66B8', ola: '#E9EFF9', suelo: '#0E1D36', ropa: ['#1F57A8', '#F5F59A', '#2C66B8'], pantalon: '#0E1D36', piel: ['#E7B48C', '#C98C62', '#8D5B3B'], pelo: '#26324A', relleno: true },
    marca: { cielo: '#1F57A8', fondo: '#2C66B8', fondo2: '#143E7E', frente: '#F3F0E8', techo: '#F5F59A', linea: '#0E1D36', ventana: '#143E7E', luz: '#F5F59A', agua: '#143E7E', ola: '#2C66B8', suelo: '#0E1D36', ropa: ['#F5F59A', '#FFFFFF', '#E9EFF9'], pantalon: '#0E1D36', piel: ['#E7B48C', '#C98C62', '#8D5B3B'], pelo: '#0E1D36', relleno: true },
    linea: { cielo: 'none', fondo: 'none', fondo2: 'none', frente: 'none', techo: 'none', linea: 'rgba(233,239,249,0.82)', ventana: 'none', luz: '#F5F59A', agua: 'none', ola: 'rgba(233,239,249,0.5)', suelo: 'rgba(233,239,249,0.82)', ropa: ['none', 'none', 'none'], pantalon: 'none', piel: ['none', 'none', 'none'], pelo: 'none', relleno: false },
  };
  // pseudoaleatorio estable: la misma ilustración en cada exportación
  const azar = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647);

  function ciudad(p, ancho = 1200, alto = 420) {
    const r = azar(7);
    const sw = p.relleno ? 2.2 : 1.6;
    let fondo = '', frente = '';
    // fila de atrás: torres de la costa
    for (let x = 0; x < ancho - 120; ) {
      const w = 46 + r() * 70, h = 130 + r() * 170;
      fondo += `<rect x="${x.toFixed(1)}" y="${(alto - 70 - h).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="${r() > 0.5 ? p.fondo : p.fondo2}" stroke="${p.relleno ? 'none' : p.linea}" stroke-width="${sw}" stroke-opacity="${p.relleno ? 1 : 0.45}"/>`;
      x += w + 4 + r() * 10;
    }
    // fila de adelante: chalets marplatenses (techo a dos aguas y zócalo de piedra) y edificios bajos
    for (let x = 6; x < ancho - 200; ) {
      const chalet = r() > 0.45;
      if (chalet) {
        const w = 92 + r() * 40, h = 74 + r() * 26, base = alto - 70, y = base - h;
        frente += `<g stroke="${p.linea}" stroke-width="${sw}" stroke-linejoin="round">
          <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${p.frente}"/>
          <path d="M${x - 8} ${y + 2} L${x + w / 2} ${y - 44} L${x + w + 8} ${y + 2} Z" fill="${p.techo}"/>
          <rect x="${x + w * 0.16}" y="${y + 18}" width="${w * 0.22}" height="${h * 0.32}" rx="3" fill="${r() > 0.6 ? p.luz : p.ventana}"/>
          <rect x="${x + w * 0.58}" y="${y + h * 0.34}" width="${w * 0.24}" height="${h * 0.66}" rx="3" fill="${p.ventana}"/>
          <path d="M${x} ${base - 16} H${x + w}" fill="none"/>
          ${[0.2, 0.45, 0.7].map((k) => `<path d="M${x + w * k} ${base - 16} v16" fill="none" stroke-opacity="0.5"/>`).join('')}
        </g>`;
        x += w + 26 + r() * 18;
      } else {
        const w = 70 + r() * 36, h = 120 + r() * 60, base = alto - 70, y = base - h;
        let v = '';
        for (let fy = y + 14; fy < base - 30; fy += 26) for (let fx = x + 10; fx < x + w - 18; fx += 22) v += `<rect x="${fx}" y="${fy}" width="12" height="14" rx="2" fill="${r() > 0.82 ? p.luz : p.ventana}"/>`;
        frente += `<g stroke="${p.linea}" stroke-width="${sw}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${p.frente}"/><g stroke-width="${sw * 0.7}">${v}</g><rect x="${x + w / 2 - 11}" y="${base - 30}" width="22" height="30" rx="2" fill="${p.techo}"/></g>`;
        x += w + 22 + r() * 18;
      }
    }
    // faro y mar a la derecha
    const fx = ancho - 120, base = alto - 70;
    const faro = `<g stroke="${p.linea}" stroke-width="${sw}" stroke-linejoin="round">
      <path d="M${fx} ${base} L${fx + 10} ${base - 190} H${fx + 34} L${fx + 44} ${base} Z" fill="${p.frente}"/>
      <path d="M${fx + 6} ${base - 70} H${fx + 38} M${fx + 8} ${base - 130} H${fx + 36}" fill="none"/>
      <rect x="${fx + 8}" y="${base - 214}" width="28" height="24" rx="3" fill="${p.luz}"/>
      <path d="M${fx + 4} ${base - 214} L${fx + 22} ${base - 236} L${fx + 40} ${base - 214} Z" fill="${p.techo}"/>
    </g><path d="M${fx + 22} ${base - 202} L${fx + 112} ${base - 236} L${fx + 112} ${base - 170} Z" fill="${p.luz}" opacity="${p.relleno ? 0.35 : 0.18}"/>`;
    let olas = '';
    for (let y = base + 14; y < alto; y += 16) olas += `<path d="M0 ${y} q 20 -8 40 0${' t 40 0'.repeat(Math.floor(ancho / 40) - 1)}" fill="none" stroke="${p.ola}" stroke-width="2" stroke-linecap="round" opacity="0.7"/>`;
    return `<svg viewBox="0 0 ${ancho} ${alto}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mar del Plata: chalets, edificios, el faro y el mar">
      ${p.cielo !== 'none' ? `<rect width="${ancho}" height="${alto}" fill="${p.cielo}"/>` : ''}
      ${fondo}${frente}${faro}
      <rect x="0" y="${base}" width="${ancho}" height="${alto - base}" fill="${p.agua}"/>${olas}
      <path d="M0 ${base} H${ancho}" stroke="${p.suelo}" stroke-width="${sw * 1.4}"/>
    </svg>`;
  }

  // personas sin cara: cabeza, pelo, cuerpo y manos; cada rol con su objeto
  function persona(rol, p) {
    const piel = p.piel[rol === 'especialista' ? 1 : rol === 'operadora' ? 2 : 0];
    const ropa = p.ropa[rol === 'especialista' ? 0 : rol === 'operadora' ? 2 : 1];
    const L = p.linea, sw = 3;
    const pelo = rol === 'vecina'
      ? `<path d="M41 44 C38 18 82 12 80 40 C82 60 86 74 92 86 L72 84 C74 66 70 54 62 50 C56 58 46 60 41 44 Z" fill="${p.pelo}" stroke="${L}" stroke-width="${sw}"/>`
      : rol === 'especialista'
        ? `<path d="M40 34 C42 14 78 12 80 34 Z" fill="${p.relleno ? '#1F57A8' : 'none'}" stroke="${L}" stroke-width="${sw}"/><path d="M76 33 H96" stroke="${L}" stroke-width="${sw + 2}" stroke-linecap="round"/>`
        : `<path d="M40 40 C38 16 82 14 80 40 C70 30 52 30 40 40 Z" fill="${p.pelo}" stroke="${L}" stroke-width="${sw}"/>`;
    const objeto = rol === 'vecina'
      ? `<rect x="88" y="104" width="20" height="34" rx="5" fill="${p.relleno ? '#0E1D36' : 'none'}" stroke="${L}" stroke-width="${sw}"/><rect x="92" y="109" width="12" height="20" rx="2" fill="${p.luz}"/>`
      : rol === 'especialista'
        ? `<path d="M98 132 l18 -26 m-5 -6 l10 6 l-4 8" fill="none" stroke="${L}" stroke-width="${sw + 2}" stroke-linecap="round"/><rect x="34" y="140" width="52" height="12" rx="3" fill="${p.luz}" stroke="${L}" stroke-width="${sw}"/>`
        : `<rect x="76" y="112" width="40" height="28" rx="4" fill="${p.relleno ? '#E9EFF9' : 'none'}" stroke="${L}" stroke-width="${sw}" transform="rotate(-8 96 126)"/>`;
    return `<svg viewBox="0 0 130 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Persona (${rol})">
      <path d="M44 250 L50 168 M76 250 L70 168" stroke="${p.relleno ? p.pantalon : L}" stroke-width="16" stroke-linecap="round"/>
      ${p.relleno ? '' : `<path d="M44 250 L50 168 M76 250 L70 168" stroke="#0E1D36" stroke-width="10" stroke-linecap="round"/>`}
      <ellipse cx="40" cy="251" rx="13" ry="6" fill="${L}"/><ellipse cx="82" cy="251" rx="13" ry="6" fill="${L}"/>
      <path d="M32 92 C32 76 46 68 60 68 C74 68 88 76 88 92 L92 168 H28 Z" fill="${ropa}" stroke="${L}" stroke-width="${sw}" stroke-linejoin="round"/>
      <path d="M34 96 C22 120 24 138 30 150" fill="none" stroke="${ropa === 'none' ? L : ropa}" stroke-width="13" stroke-linecap="round"/>
      <path d="M86 96 C96 108 98 118 96 126" fill="none" stroke="${ropa === 'none' ? L : ropa}" stroke-width="13" stroke-linecap="round"/>
      <circle cx="30" cy="152" r="7" fill="${piel}" stroke="${L}" stroke-width="2"/><circle cx="96" cy="128" r="7" fill="${piel}" stroke="${L}" stroke-width="2"/>
      <rect x="53" y="56" width="14" height="16" fill="${piel}" stroke="${L}" stroke-width="2"/>
      <circle cx="60" cy="42" r="21" fill="${piel}" stroke="${L}" stroke-width="${sw}"/>
      ${pelo}${objeto}
    </svg>`;
  }

  function reemplazar() {
    document.querySelectorAll('[data-ilustra]').forEach((el) => {
      const p = PALETAS[el.dataset.paleta || 'clara'];
      const que = el.dataset.ilustra;
      el.innerHTML = que === 'ciudad' ? ciudad(p) : persona(que, p);
      el.querySelector('svg').style.cssText = 'display:block;width:100%;height:auto';
    });
  }
  window.__ilustrar = reemplazar;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', reemplazar); else reemplazar();
})();
