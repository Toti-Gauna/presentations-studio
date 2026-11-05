const { chromium } = require('playwright'); const fs = require('fs');
const out = process.argv[2];
const NM = '/home/user/presentations-studio/node_modules/@fontsource-variable';
const A = '/home/user/presentations-studio/brands/handyx/assets';
const ic = (n, s = 30, blanco = false) => `<img src="file://${A}/iconos/${n}.svg" style="width:${s}px;height:${s}px;${blanco ? 'filter:brightness(0) invert(1)' : ''}">`;
const pj = (n, h) => `<img src="file://${A}/personajes/${n}.webp" style="height:${h}px">`;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Archivo';src:url('file://${NM}/archivo/files/archivo-latin-wdth-normal.woff2') format('woff2');font-weight:100 900;font-stretch:62% 125%}
@font-face{font-family:'DM Sans';src:url('file://${NM}/dm-sans/files/dm-sans-latin-wght-normal.woff2') format('woff2');font-weight:100 1000}
*{margin:0;box-sizing:border-box} body{width:1720px;height:780px;background:transparent;font-family:'DM Sans';color:#13305E;position:relative}
.t{font-family:'Archivo';font-weight:900;font-stretch:118%}
.rama{position:absolute;top:40px;width:600px;height:700px;border-radius:40px;padding:34px 36px}
.people{left:0;background:#FFFFFF;box-shadow:0 14px 0 rgba(19,48,94,.08)}
.business{right:0;background:#1F57A8;color:#fff;box-shadow:0 14px 0 rgba(19,48,94,.18)}
.etq{display:inline-flex;gap:8px;align-items:center;font-weight:800;font-size:18px;letter-spacing:.08em;text-transform:uppercase;padding:7px 14px;border-radius:999px}
.people .etq{background:#E6EEFB;color:#1F57A8}.business .etq{background:#FFC93C;color:#13305E}
h2{font-size:46px;line-height:1;margin-top:16px}
.item{display:flex;gap:16px;align-items:center;margin-top:22px;font-size:25px;line-height:1.2}
.item .i{width:58px;height:58px;border-radius:18px;display:grid;place-items:center;flex:none}
.people .i{background:#F3F5FA}.business .i{background:rgba(255,255,255,.14)}
.item b{display:block;font-size:27px}
.centro{position:absolute;left:640px;top:150px;width:440px;height:440px;border-radius:50%;background:#FFC93C;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;box-shadow:0 0 0 22px rgba(255,201,60,.25),0 0 0 48px rgba(255,201,60,.12)}
.centro img.logo{height:60px}
.centro .n{font-size:20px;font-weight:800;margin-top:12px;max-width:330px;line-height:1.3}
.ia{position:absolute;left:705px;top:640px;width:310px;background:#13305E;color:#fff;border-radius:22px;padding:14px 18px;font-size:19px;font-weight:700;text-align:center;line-height:1.3}
.flecha{position:absolute;top:360px;width:46px;height:46px;border-top:9px solid #FFC93C;border-right:9px solid #FFC93C}
.pie{position:absolute;left:36px;right:36px;bottom:30px;border-radius:18px;padding:14px 18px;font-size:21px;font-weight:700}
.people .pie{background:#F3F5FA}.business .pie{background:rgba(255,255,255,.14)}
.pjs{position:absolute;left:668px;top:40px;width:384px;display:flex;justify-content:space-between;align-items:flex-end}
</style></head><body>
<div class="rama people"><span class="etq">${ic('usuarios',22)} B2C</span><h2 class="t">Handyx for People</h2>
 <div class="item"><span class="i">${ic('casa')}</span><span><b>De 6 a 72 profesiones</b>hogar, equipos, movilidad, servicios</span></div>
 <div class="item"><span class="i">${ic('chispas')}</span><span><b>HandIA</b>de la foto al profesional indicado</span></div>
 <div class="item"><span class="i">${ic('herramienta')}</span><span><b>Herramientas por oficio</b>y feedback con IA</span></div>
 <div class="item"><span class="i">${ic('repetir')}</span><span><b>Clientes que vuelven</b>historial y valoraciones</span></div><div class="pie">Hoy: Mar del Plata → 2027: Argentina</div></div>
<div class="rama business"><span class="etq">${ic('tienda',22)} B2B</span><h2 class="t">Handyx for Business</h2>
 <div class="item"><span class="i">${ic('calendario',30,true)}</span><span><b>Personal por turnos</b>mozos, bartenders, cocina, por días o semanas</span></div>
 <div class="item"><span class="i">${ic('herramienta',30,true)}</span><span><b>Mantenimiento del local</b>técnicos verificados</span></div>
 <div class="item"><span class="i">${ic('celular',30,true)}</span><span><b>Apps a medida</b>cada comercio, integrado a Handyx</span></div>
 <div class="item"><span class="i">${ic('balanza',30,true)}</span><span><b>Meritocracia</b>los mejores valorados, primero</span></div><div class="pie">Visión: primer piloto con un local de Mar del Plata</div></div>
<div class="pjs">${pj('gota-c',86)}${pj('bombilla-c',104)}${pj('engranaje-c',92)}${pj('llave-c',96)}</div>
<div class="centro"><img class="logo" src="file://${A}/logo-handyx.webp"><div class="n">Un núcleo: verificación, valoraciones, pagos y HandIA</div></div>
<div class="flecha" style="left:612px;transform:rotate(-135deg)"></div><div class="flecha" style="left:1062px;transform:rotate(45deg)"></div>
<div class="ia">Con IA, crear y mantener apps para cada comercio es más barato que nunca</div>
</body></html>`;
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1720, height: 780 }, deviceScaleFactor: 1.5 });
  fs.writeFileSync(`${out}/mapa.html`, html); await p.goto(`file://${out}/mapa.html`); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
  await p.screenshot({ path: `${out}/mapa.png`, omitBackground: true }); await b.close(); })();
