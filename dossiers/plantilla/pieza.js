// Comportamiento común de las piezas impresas: numeración de páginas, índice automático y controles de imprenta.
// Lo carga cada pieza al final del <body>. El exportador llama a window.__control() y corta si hay errores.
(function () {
  const dos = (n) => String(n).padStart(2, '0');

  function numerar() {
    const paginas = [...document.querySelectorAll('.pagina')];
    paginas.forEach((p, i) => {
      p.dataset.n = String(i + 1);
      p.querySelectorAll('.folio-n').forEach((e) => { e.textContent = dos(i + 1); });
    });
    // <a data-ir="ancla"> muestra la página donde está el elemento con id="ancla"
    document.querySelectorAll('[data-ir]').forEach((a) => {
      const destino = document.getElementById(a.dataset.ir);
      const pag = destino && destino.closest('.pagina');
      const n = a.querySelector('.p') || a;
      n.textContent = pag ? dos(pag.dataset.n) : '??';
      if (destino && a.tagName === 'A') a.setAttribute('href', '#' + a.dataset.ir);
    });
    document.querySelectorAll('[data-total-paginas]').forEach((e) => { e.textContent = String(paginas.length); });
  }

  // Controles: contenido que se sale de la caja o del papel, texto chico, imágenes con poca resolución para imprimir,
  // imágenes rotas y marcadores sin completar («[a definir]» se permite: es honesto; «TODO» y «lorem» no).
  function control() {
    const errores = [], avisos = [];
    const pt = (px) => (px * 72) / 96;
    document.querySelectorAll('.pagina').forEach((pag) => {
      const n = pag.dataset.n;
      const lam = pag.querySelector('.lamina');
      if (!lam) { errores.push(`p${n}: falta .lamina`); return; }
      const rl = lam.getBoundingClientRect();
      pag.querySelectorAll('.caja').forEach((c) => {
        if (c.scrollHeight > c.clientHeight + 2) errores.push(`p${n}: el contenido se sale de la caja por ${Math.round(((c.scrollHeight - c.clientHeight) * 25.4) / 96)} mm`);
        if (c.scrollWidth > c.clientWidth + 2) errores.push(`p${n}: el contenido se sale de la caja a lo ancho`);
      });
      pag.querySelectorAll('.lamina *').forEach((e) => {
        if (e.closest('.a-sangre, .a-sangre-arriba, .a-sangre-abajo, .fondo, .recorte, .permite-salir')) return;
        const r = e.getBoundingClientRect();
        if (!r.width || !r.height) return;
        const fuera = r.left < rl.left - 1 || r.right > rl.right + 1 || r.top < rl.top - 1 || r.bottom > rl.bottom + 1;
        if (fuera && getComputedStyle(e).position !== 'fixed') avisos.push(`p${n}: <${e.tagName.toLowerCase()} class="${e.className}"> pasa el borde del formato`);
      });
      const walker = document.createTreeWalker(pag, NodeFilter.SHOW_TEXT);
      const vistos = new Set();
      while (walker.nextNode()) {
        const t = walker.currentNode;
        if (!t.textContent.trim()) continue;
        const el = t.parentElement;
        if (vistos.has(el)) continue;
        vistos.add(el);
        const tam = pt(parseFloat(getComputedStyle(el).fontSize));
        if (tam < 5.5) errores.push(`p${n}: texto de ${tam.toFixed(1)} pt («${t.textContent.trim().slice(0, 30)}»)`);
        if (/\b(TODO|lorem|ipsum|XXX)\b/i.test(t.textContent)) errores.push(`p${n}: texto provisorio «${t.textContent.trim().slice(0, 40)}»`);
      }
      pag.querySelectorAll('img').forEach((im) => {
        const nombre = (im.getAttribute('src') || '').split('/').pop();
        if (!im.complete || !im.naturalWidth) { errores.push(`p${n}: imagen rota ${nombre}`); return; }
        if (/\.svg($|\?)/i.test(im.getAttribute('src') || '')) return;
        const r = im.getBoundingClientRect();
        const caja = im.closest('.recorte') ? im.closest('.recorte').getBoundingClientRect() : r;
        if (!caja.width) return;
        // resolución efectiva en el papel: píxeles de la imagen sobre pulgadas impresas
        const ajuste = getComputedStyle(im).objectFit;
        let escala = im.naturalWidth / r.width;
        if (ajuste === 'cover') escala = Math.min(im.naturalWidth / r.width, im.naturalHeight / r.height);
        const ppp = Math.round(escala * 96);
        if (ppp < 150) errores.push(`p${n}: ${nombre} sale a ${ppp} ppp (mínimo 150; ideal 220+)`);
        else if (ppp < 220) avisos.push(`p${n}: ${nombre} sale a ${ppp} ppp`);
      });
    });
    return { paginas: document.querySelectorAll('.pagina').length, errores, avisos };
  }

  window.__numerar = numerar;
  window.__control = control;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', numerar); else numerar();
})();
