// Gráficos premium para el respaldo: círculo que multiplica los ingresos y camino a la IPO (PNG transparente).
const { chromium } = require('playwright'); const fs = require('fs');
const out = process.argv[2];
const NM = '/home/user/presentations-studio/node_modules/@fontsource-variable';
const A = '/home/user/presentations-studio/brands/handyx/assets';
const ic = (n, s = 34, blanco = false) => `<img src="file://${A}/iconos/${n}.svg" style="width:${s}px;height:${s}px;${blanco ? 'filter:brightness(0) invert(1)' : ''}">`;
const pj = (n, h, extra = '') => `<img src="file://${A}/personajes/${n}.webp" style="height:${h}px;${extra}">`;
const base = `@font-face{font-family:'Archivo';src:url('file://${NM}/archivo/files/archivo-latin-wdth-normal.woff2') format('woff2');font-weight:100 900;font-stretch:62% 125%}
@font-face{font-family:'DM Sans';src:url('file://${NM}/dm-sans/files/dm-sans-latin-wght-normal.woff2') format('woff2');font-weight:100 1000}
*{margin:0;box-sizing:border-box} body{background:transparent;font-family:'DM Sans';color:#13305E;position:relative;overflow:hidden}
.t{font-family:'Archivo';font-weight:900;font-stretch:118%}`;
const circulo = `<!doctype html><html><head><meta charset="utf-8"><style>${base}
body{width:1720px;height:800px}
.anillo{position:absolute;left:200px;top:60px;width:680px;height:680px;border-radius:50%;border:26px solid #E6EEFB}
.arco{position:absolute;left:200px;top:60px;width:680px;height:680px;border-radius:50%;border:26px solid transparent;border-top-color:#1F57A8;border-right-color:#1F57A8;transform:rotate(20deg)}
.arco2{position:absolute;left:200px;top:60px;width:680px;height:680px;border-radius:50%;border:26px solid transparent;border-bottom-color:#FFC93C;border-left-color:#FFC93C;transform:rotate(20deg)}
.centro{position:absolute;left:360px;top:220px;width:360px;height:360px;border-radius:50%;background:#FFFFFF;box-shadow:0 20px 50px rgba(19,48,94,.18);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.centro img.logo{height:46px} .centro .n{font-size:22px;font-weight:800;margin-top:10px;line-height:1.25}
.nodo{position:absolute;width:300px;background:#fff;border-radius:26px;padding:20px 22px;box-shadow:0 12px 0 rgba(19,48,94,.08),0 2px 0 #E3E8F2;display:flex;gap:14px;align-items:center}
.nodo .i{width:60px;height:60px;border-radius:18px;background:#E6EEFB;display:grid;place-items:center;flex:none}
.nodo b{display:block;font-size:26px;line-height:1.1}.nodo span{font-size:19px;color:#4A5873;line-height:1.25}
.az{background:#1F57A8;color:#fff}.az .i{background:rgba(255,255,255,.16)}.az span{color:#DCE6F6}
.am{background:#FFC93C}.am .i{background:rgba(19,48,94,.1)}.am span{color:#13305E}
.flecha{position:absolute;width:40px;height:40px;border-top:10px solid #1F57A8;border-right:10px solid #1F57A8}
.rama{position:absolute;left:1130px;top:300px;width:580px}
.rama .linea{display:none}
.paso{background:#fff;border-radius:22px;padding:16px 20px;margin-bottom:14px;box-shadow:0 10px 0 rgba(19,48,94,.07);display:flex;gap:14px;align-items:center}
.paso .i{width:52px;height:52px;border-radius:16px;background:#FFF4D1;display:grid;place-items:center;flex:none}
.paso b{font-size:24px}.paso span{display:block;font-size:18px;color:#4A5873;line-height:1.25}
.cab{position:absolute;left:1130px;top:150px;width:580px}
.etq{display:inline-flex;gap:8px;align-items:center;font-weight:800;font-size:18px;letter-spacing:.08em;text-transform:uppercase;padding:7px 14px;border-radius:999px;background:#FFC93C}
.cab h3{font-size:40px;margin-top:12px;line-height:1.05}
.etq2{position:absolute;left:300px;top:0;font-weight:800;font-size:18px;letter-spacing:.08em;text-transform:uppercase;padding:7px 14px;border-radius:999px;background:#1F57A8;color:#fff}
</style></head><body>
<svg style="position:absolute;left:0;top:0" width="1720" height="800"><path d="M700 740 C 900 760, 1000 640, 1110 560" fill="none" stroke="#FFC93C" stroke-width="9" stroke-dasharray="3 16" stroke-linecap="round"/><path d="M1090 548 l28 6 l-10 26" fill="none" stroke="#FFC93C" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg><div class="anillo"></div><div class="arco"></div><div class="arco2"></div>
<div class="centro"><img class="logo" src="file://${A}/logo-handyx.webp"><div class="n">El círculo que<br>multiplica</div><div style="margin-top:10px">${pj('engranaje-c', 70)}</div></div>
<div class="nodo az" style="left:390px;top:14px"><span class="i">${ic('crecimiento',34,true)}</span><div><b>Más trabajos</b><span>marketing, porteros e IA</span></div></div>
<div class="nodo" style="left:735px;top:352px;width:290px"><span class="i">${ic('porcentaje')}</span><div><b>Más tarifas</b><span>en cada trabajo</span></div></div>
<div class="nodo am" style="left:390px;top:676px"><span class="i">${ic('alcancia')}</span><div><b>Ganancias</b><span>después de costos</span></div></div>
<div class="nodo" style="left:40px;top:352px;width:290px"><span class="i">${ic('cohete')}</span><div><b>Reinversión</b><span>en crecer: marketing e IA</span></div></div>
<div class="cab"><span class="etq">${ic('escudo-ok',20)} Con los excedentes</span><h3 class="t">Una tesorería que protege</h3></div>
<div class="rama"><div class="linea"></div>
 <div class="paso"><span class="i">${ic('banco',30)}</span><div><b>Activos diversificados</b><span>bonos, ETFs y acciones; cripto acotada</span></div></div>
 <div class="paso"><span class="i">${ic('escudo-ok',30)}</span><div><b>Colchón de largo plazo</b><span>salud financiera frente a la inflación</span></div></div>
 <div class="paso"><span class="i">${ic('balanza',30)}</span><div><b>Política y control</b><span>solo excedentes, aprobada por el directorio</span></div></div>
</div>
</body></html>`;
const ipo = `<!doctype html><html><head><meta charset="utf-8"><style>${base}
body{width:1720px;height:760px}
.esc{position:absolute;bottom:40px;width:310px;border-radius:26px 26px 10px 10px;padding:22px 22px;box-shadow:0 14px 0 rgba(19,48,94,.10)}
.esc .k{font-size:17px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;opacity:.8}
.esc h4{font-family:'Archivo';font-weight:900;font-stretch:112%;font-size:32px;line-height:1;margin-top:6px}
.esc p{font-size:19px;line-height:1.3;margin-top:10px}
.esc .i{width:54px;height:54px;border-radius:16px;display:grid;place-items:center;margin-bottom:12px}
.e1{left:0;height:300px;background:#FFFFFF}.e1 .i{background:#E6EEFB}
.e2{left:350px;height:380px;background:#E6EEFB}.e2 .i{background:#fff}
.e3{left:700px;height:460px;background:#4A72B0;color:#fff}.e3 .i{background:rgba(255,255,255,.16)}
.e4{left:1050px;height:540px;background:#1F57A8;color:#fff}.e4 .i{background:rgba(255,255,255,.16)}
.e5{left:1400px;height:640px;background:#FFC93C;color:#13305E;box-shadow:0 14px 0 rgba(201,154,30,.6),0 0 0 10px rgba(255,201,60,.25)}.e5 .i{background:rgba(19,48,94,.12)}
.hoy{position:absolute;left:24px;bottom:356px;background:#13305E;color:#fff;font-weight:800;font-size:18px;padding:6px 14px;border-radius:999px}
.pj{position:absolute}
.ruta{position:absolute;left:0;top:0}
</style></head><body>
<svg class="ruta" width="1720" height="760"><path d="M150 440 C 400 420, 450 360, 520 360 S 800 290, 860 280 S 1150 200, 1210 200 S 1480 90, 1560 70" fill="none" stroke="#FFC93C" stroke-width="8" stroke-dasharray="4 18" stroke-linecap="round"/></svg>
<div class="esc e1"><div class="i">${ic('casa',32)}</div><div class="k">Hoy</div><h4>Pre-seed</h4><p>Mar del Plata, primeras profesiones y apps en pruebas</p></div>
<div class="hoy">Estamos acá</div>
<div class="esc e2"><div class="i">${ic('bandera',32)}</div><div class="k">Próximo</div><h4>Seed</h4><p>Argentina, más profesiones y Handyx for Business</p></div>
<div class="esc e3"><div class="i">${ic('mundo',32,true)}</div><div class="k">Después</div><h4>Serie A</h4><p>Latinoamérica y herramientas con IA para cada oficio</p></div>
<div class="esc e4"><div class="i">${ic('balanza',32,true)}</div><div class="k">Escala</div><h4>Rentabilidad</h4><p>estados auditados, gobierno corporativo y directorio independiente</p></div>
<div class="esc e5"><div class="i">${ic('banco',32)}</div><div class="k">Visión</div><h4>IPO</h4><p>Handyx cotiza en bolsa</p></div>
<div class="pj" style="left:178px;top:330px">${pj('gota-d',100)}</div>
<div class="pj" style="left:520px;top:250px">${pj('bombilla-d',110)}</div>
<div class="pj" style="left:880px;top:170px">${pj('engranaje-d',100)}</div>
<div class="pj" style="left:1230px;top:92px">${pj('llave-d',104)}</div>
<div class="pj" style="left:1490px;top:4px">${pj('grifo-c',112)}</div>
</body></html>`;
(async () => { const b = await chromium.launch(); const p = await b.newPage({ deviceScaleFactor: 1.5 });
  for (const [n, html, w, h] of [['circulo-multiplica', circulo, 1720, 800], ['camino-ipo', ipo, 1720, 760]]) {
    await p.setViewportSize({ width: w, height: h }); fs.writeFileSync(`${out}/${n}.html`, html);
    await p.goto(`file://${out}/${n}.html`); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
    await p.screenshot({ path: `${out}/${n}.png`, omitBackground: true });
  }
  await b.close(); console.log('ok'); })();
