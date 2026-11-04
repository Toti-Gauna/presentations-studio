import { createRequire } from 'node:module';
const require = createRequire('/home/user/presentations-studio/package.json');
const { chromium } = require('playwright');
const [, , modulo, out, ...ids] = process.argv;
const { CSS, IMAGENES, PANTALLAS } = await import(modulo);
const conImg = (h) => h.replace(/@@IMG:([\w.-]+)@@/g, (_m, n) => IMAGENES[n] ?? '');
const BASE = `.dm-raiz{position:absolute;inset:0;overflow:hidden;background:#fff;isolation:isolate;font-family:var(--fuente)}.dm-raiz *,.dm-raiz *::before,.dm-raiz *::after{transition:none!important;animation-play-state:paused}`;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 414, height: 896 }, deviceScaleFactor: 2 });
for (const id of ids) {
  await p.setContent(`<!doctype html><html><body style="margin:0"><div id="h" style="position:absolute;left:0;top:0;width:414px;height:896px;font-size:${(414 / 22.5).toFixed(3)}px;line-height:1.2"></div></body></html>`);
  await p.evaluate(({ html, css }) => {
    const r = document.getElementById('h').attachShadow({ mode: 'open' });
    r.innerHTML = `<style>${css}</style><div class="dm-raiz" data-demo-pantallas>${html}</div>`;
    const capas = r.querySelectorAll('.demo-pantalla');
    capas.forEach((c) => { c.classList.add('activa', 'is-activa', 'demo-pantalla--activa'); c.style.visibility = 'visible'; c.style.opacity = '1'; c.style.transform = 'none'; c.removeAttribute('hidden'); c.removeAttribute('inert'); });
    r.querySelectorAll('[data-entra]').forEach((e) => { e.style.opacity = '1'; e.style.transform = 'none'; });
  }, { html: conImg(PANTALLAS[id]), css: CSS + BASE });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(400);
  await p.screenshot({ path: `${out}/${id}.png` });
}
await b.close();
console.log('ok', ids.length);
