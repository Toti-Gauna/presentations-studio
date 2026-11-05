const { chromium } = require('playwright');
const out = process.argv[2];
const NM = '/home/user/presentations-studio/node_modules/@fontsource-variable';
const LOGO = '/home/user/presentations-studio/brands/handyx/assets/logo-handyx.webp';
const HANDYS = '/home/user/presentations-studio/brands/handyx/assets/handys-grupo.webp';
const css = `
@font-face{font-family:'Archivo';src:url('file://${NM}/archivo/files/archivo-latin-wdth-normal.woff2') format('woff2');font-weight:100 900;font-stretch:62% 125%}
@font-face{font-family:'DM Sans';src:url('file://${NM}/dm-sans/files/dm-sans-latin-wght-normal.woff2') format('woff2');font-weight:100 1000}
*{margin:0;box-sizing:border-box} body{font-family:'DM Sans';background:transparent}
.t{font-family:'Archivo';font-weight:900;font-stretch:125%;letter-spacing:-.01em}
mark{background:#FFC93C;color:#13305E;padding:0 .12em;border-radius:.12em}`;
const PREG = JSON.parse(process.argv[3]);
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  const shot = async (html, file, transparente = true, clip) => {
    require('fs').writeFileSync(`${out}/_tmp.html`, `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${html}</body></html>`);
    await p.goto(`file://${out}/_tmp.html`);
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
    await p.screenshot({ path: `${out}/${file}`, omitBackground: transparente, clip });
  };
  // Fondo del lienzo: marino con la marca arriba
  await shot(`<div style="width:1920px;height:1080px;background:#13305E;position:relative">
    <div style="position:absolute;left:40px;top:34px;display:flex;align-items:center;gap:22px">
      <div style="background:#fff;border-radius:14px;padding:8px 16px"><img src="file://${LOGO}" style="height:38px;display:block"></div>
      <span style="color:#DCE6F6;font-size:26px;font-weight:600">ATICMA 2026 · Pitch de 3 minutos</span></div>
    <div style="position:absolute;right:40px;top:44px;color:#FFC93C;font-size:24px;font-weight:800;letter-spacing:.06em">IGNACIO GAUNA · FUNDADOR Y CEO</div>
  </div>`, 'fondo.png', false);
  // Zócalo con el nombre (sobre la cámara a pantalla completa)
  await shot(`<div style="position:absolute;left:80px;bottom:90px;display:flex;flex-direction:column;gap:10px">
    <div class="t" style="background:#FFC93C;color:#13305E;font-size:54px;padding:10px 26px;border-radius:12px;display:inline-block;width:max-content">Ignacio Gauna</div>
    <div style="background:#13305E;color:#fff;font-size:30px;font-weight:700;padding:10px 22px;border-radius:10px;width:max-content">Fundador y CEO de Handyx</div></div>`, 'zocalo.png');
  // Máscara redondeada para la cámara (blanco = visible)
  await p.setViewportSize({ width: 340, height: 604 });
  await shot(`<div style="width:340px;height:604px;background:#000"><div style="width:340px;height:604px;background:#fff;border-radius:28px"></div></div>`, 'mascara.png', false);
  await p.setViewportSize({ width: 1920, height: 1080 });
  // Separador de la sección de preguntas
  await shot(`<div style="width:1920px;height:1080px;background:#1F57A8;display:flex;flex-direction:column;justify-content:center;padding:0 140px;position:relative">
    <div style="color:#FFC93C;font-size:34px;font-weight:800;letter-spacing:.08em">PREPARADOS PARA LAS PREGUNTAS</div>
    <div class="t" style="color:#fff;font-size:120px;line-height:1;margin-top:18px">Posibles preguntas<br>del <mark>jurado</mark></div>
    <div style="color:#DCE6F6;font-size:40px;margin-top:30px;max-width:1100px">${PREG.length} preguntas que esperamos y nuestras respuestas, con números y supuestos a la vista.</div>
    <img src="file://${HANDYS}" style="position:absolute;right:120px;bottom:90px;height:300px"></div>`, 'preguntas-intro.png', false);
  // Una tarjeta por pregunta
  for (const [k, q] of PREG.entries()) {
    await shot(`<div style="width:1920px;height:1080px;background:#FBFAF6;display:flex;flex-direction:column;justify-content:center;padding:0 160px">
      <div style="color:#1F57A8;font-size:32px;font-weight:800;letter-spacing:.08em">POSIBLE PREGUNTA DEL JURADO · ${k + 1} DE ${PREG.length}</div>
      <div style="display:flex;gap:40px;align-items:flex-start;margin-top:26px">
        <div class="t" style="font-size:150px;line-height:.9;color:#FFC93C">“</div>
        <div class="t" style="font-size:96px;line-height:1.02;color:#13305E;max-width:1400px">${q}</div></div></div>`, `pregunta-${String(k + 1).padStart(2, '0')}.png`, false);
  }
  await b.close();
})();
