// Pantallas de diseño propuesto (herramientas por oficio, números del profesional, negocios). 414×896 a 2x.
const { chromium } = require('playwright');
const fs = require('fs');
const out = process.argv[2];
const NM = '/home/user/presentations-studio/node_modules/@fontsource-variable';
const A = '/home/user/presentations-studio/brands/handyx/assets';
const ic = (n, c = '#1F57A8', s = 22) => `<img src="file://${A}/iconos/${n}.svg" style="width:${s}px;height:${s}px;${c !== '#1F57A8' ? 'filter:brightness(0) invert(1)' : ''}">`;
const css = `
@font-face{font-family:'Archivo';src:url('file://${NM}/archivo/files/archivo-latin-wdth-normal.woff2') format('woff2');font-weight:100 900;font-stretch:62% 125%}
@font-face{font-family:'DM Sans';src:url('file://${NM}/dm-sans/files/dm-sans-latin-wght-normal.woff2') format('woff2');font-weight:100 1000}
*{margin:0;box-sizing:border-box} body{width:414px;height:896px;font-family:'DM Sans';background:#F3F5FA;color:#13305E;overflow:hidden;position:relative}
.sb{height:44px;display:flex;justify-content:space-between;align-items:center;padding:0 26px;font-weight:700;font-size:15px;background:#fff}
.top{background:#fff;padding:4px 20px 14px;display:flex;justify-content:space-between;align-items:center;box-shadow:0 1px 0 #E3E8F2}
.top img.logo{height:24px}
.camp{width:36px;height:36px;border-radius:12px;background:#1F57A8;display:grid;place-items:center}
.cab{padding:18px 20px 6px}
.chip{display:inline-flex;align-items:center;gap:6px;background:#E6EEFB;color:#1F57A8;font-weight:800;font-size:12px;padding:5px 10px;border-radius:999px;letter-spacing:.03em;text-transform:uppercase}
h1{font-family:'Archivo';font-weight:900;font-stretch:118%;font-size:27px;line-height:1.05;margin-top:10px}
h1 mark{background:#FFC93C;color:#13305E;padding:0 4px;border-radius:5px}
.sub{color:#5F6B84;font-size:14px;margin-top:6px}
.cards{padding:10px 16px;display:flex;flex-direction:column;gap:12px}
.card{background:#fff;border-radius:18px;padding:14px 16px;box-shadow:0 6px 0 rgba(19,48,94,.07),0 1px 0 #E3E8F2}
.ct{display:flex;align-items:center;gap:10px;font-weight:800;font-size:16px}
.ct .ico{width:34px;height:34px;border-radius:11px;background:#E6EEFB;display:grid;place-items:center;flex:none}
.cd{color:#5F6B84;font-size:13px;margin-top:6px;line-height:1.35}
.row{display:flex;justify-content:space-between;align-items:center;font-size:14px;padding:6px 0;border-bottom:1px dashed #E3E8F2}
.row:last-child{border-bottom:0}
.big{font-family:'Archivo';font-weight:900;font-stretch:112%;font-size:26px;color:#1F57A8}
.btn{margin-top:10px;background:#1F57A8;color:#fff;font-weight:800;font-size:14px;text-align:center;padding:11px;border-radius:12px;box-shadow:0 4px 0 #13305E}
.btn.am{background:#FFC93C;color:#13305E;box-shadow:0 4px 0 #C99A1E}
.ok{display:inline-grid;place-items:center;width:18px;height:18px;border-radius:6px;background:#1E9E57;color:#fff;font-size:12px;font-weight:900;margin-right:8px}
.no{display:inline-block;width:18px;height:18px;border-radius:6px;border:2px solid #C9D3E6;margin-right:8px;vertical-align:middle}
.tabs{position:absolute;left:0;right:0;bottom:0;height:74px;background:#1F57A8;border-radius:22px 22px 0 0;display:flex;justify-content:space-around;align-items:center;color:#DCE6F6;font-size:11px;font-weight:700}
.tabs div{display:flex;flex-direction:column;align-items:center;gap:4px}
.tabs .act{color:#fff}
.prop{position:absolute;right:66px;top:58px;background:#FFC93C;color:#13305E;font-size:10px;font-weight:900;padding:4px 8px;border-radius:999px;letter-spacing:.04em}
.bar{height:10px;border-radius:999px;background:#E6EEFB;overflow:hidden}.bar i{display:block;height:100%;background:#1F57A8;border-radius:999px}
.avatar{width:38px;height:38px;border-radius:12px;background:#1F57A8;color:#fff;font-weight:900;display:grid;place-items:center;font-size:14px;flex:none}
.estrellas{color:#F6A623;font-size:13px;letter-spacing:1px}
`;
const tabs = (act) => `<div class="tabs">${[['casa','Inicio'],['herramienta','Herramientas'],['calendario','Agenda'],['billetera','Números']].map(([i,t]) => `<div class="${t===act?'act':''}">${ic(i,'w',22)}<span>${t}</span></div>`).join('')}</div>`;
const page = (body, act = 'Herramientas') => `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>
<div class="sb"><span>9:41</span><span>●●● ▮</span></div>
<div class="top"><img class="logo" src="file://${A}/logo-handyx.webp"><div class="camp">${ic('chispas','w',18)}</div></div>
<div class="prop">DISEÑO PROPUESTO</div>${body}${tabs(act)}</body></html>`;
const card = (icono, titulo, cuerpo) => `<div class="card"><div class="ct"><span class="ico">${ic(icono)}</span>${titulo}</div>${cuerpo}</div>`;
const P = {
 electricidad: page(`<div class="cab"><span class="chip">${ic('electricidad','#1F57A8',14)} Electricidad</span><h1>Herramientas para <mark>electricistas</mark></h1></div><div class="cards">
  ${card('chispas','Lector de esquemas con IA',`<div style="margin-top:10px;border-radius:12px;background:#F3F5FA;padding:10px"><svg viewBox="0 0 340 110" width="100%"><g fill="none" stroke="#13305E" stroke-width="4" stroke-linecap="round"><path d="M30 90V30h80"/><rect x="110" y="16" width="40" height="28" rx="6" fill="#fff"/><path d="M150 30h60l30-16"/><path d="M250 30h60v60H30"/><circle cx="310" cy="60" r="14" fill="#fff"/><path d="M300 50l20 20M320 50l-20 20"/></g><path d="M110 30h40" stroke="#FFC93C" stroke-width="12" opacity=".6"/></svg><div class="cd" style="margin-top:4px"><b style="color:#1F57A8">HandIA:</b> «Este tramo es la protección del circuito de la cocina.»</div></div>`)}
  ${card('calculadora','Calculadora de cable',`<div class="row"><span>Potencia</span><b>3.500 W</b></div><div class="row"><span>Distancia</span><b>15 m</b></div><div class="row"><span>Sección sugerida</span><span class="big" style="font-size:22px">2,5 mm²</span></div><div class="cd">Ejemplo orientativo: verificá siempre con la norma vigente.</div>`)}
  ${card('escudo-ok','Checklist de seguridad',`<div class="cd" style="color:#13305E"><div><span class="ok">✓</span>Corte de energía confirmado</div><div style="margin-top:6px"><span class="ok">✓</span>Disyuntor probado</div></div>`)}</div>`),
 plomeria: page(`<div class="cab"><span class="chip">${ic('plomeria','#1F57A8',14)} Plomería</span><h1>Encontrá la pérdida <mark>paso a paso</mark></h1></div><div class="cards">
  ${card('lista','Detector de pérdidas guiado',`<div class="cd" style="color:#13305E"><div><span class="ok">✓</span>Cerrá todas las canillas</div><div style="margin-top:6px"><span class="ok">✓</span>Mirá el medidor 10 minutos</div><div style="margin-top:6px"><span class="no"></span>Probá llave por llave</div></div><div class="bar" style="margin-top:10px"><i style="width:66%"></i></div><div class="cd">Paso 2 de 3</div>`)}
  ${card('recibo','Lista de materiales',`<div class="row"><span>Caño termofusión ½" · 4 m</span><b>$ 12.000</b></div><div class="row"><span>Codos ½" × 6</span><b>$ 4.800</b></div><div class="row"><span>Llave esférica</span><b>$ 9.500</b></div><div class="btn">Sumar al presupuesto</div>`)}
  ${card('camara','Antes y después',`<div style="display:flex;gap:8px;margin-top:10px"><div style="flex:1;height:70px;border-radius:10px;background:linear-gradient(#C9D3E6,#A9B7D0)"></div><div style="flex:1;height:70px;border-radius:10px;background:linear-gradient(#DCE6F6,#BFD0EE)"></div></div><div class="cd">Las fotos quedan en el historial del trabajo.</div>`)}</div>`),
 gas: page(`<div class="cab"><span class="chip">${ic('gas','#1F57A8',14)} Gas</span><h1>Seguridad <mark>primero</mark></h1></div><div class="cards">
  ${card('escudo-ok','Checklist de seguridad',`<div class="cd" style="color:#13305E"><div><span class="ok">✓</span>Ventilación del ambiente</div><div style="margin-top:6px"><span class="ok">✓</span>Prueba de hermeticidad</div><div style="margin-top:6px"><span class="ok">✓</span>Detector de monóxido</div><div style="margin-top:6px"><span class="no"></span>Firma del cliente</div></div>`)}
  ${card('reloj2','Registro de revisiones',`<div class="row"><span>Calefón · última revisión</span><b>12/11/2026</b></div><div class="row"><span>Próxima sugerida</span><b>12/11/2027</b></div><div class="btn am">Avisarle al cliente cuando toque</div>`)}
  ${card('lista','Informe para el cliente',`<div class="cd">PDF con lo que se revisó, fotos y recomendaciones. Lo guarda en su historial.</div>`)}</div>`),
 cerrajeria: page(`<div class="cab"><span class="chip">${ic('cerrajeria','#1F57A8',14)} Cerrajería</span><h1>Cada apertura, <mark>registrada</mark></h1></div><div class="cards">
  ${card('candado','Registro de aperturas',`<div class="row"><span>Pedido por</span><b>Cliente verificado</b></div><div class="row"><span>Dirección</span><b>La Perla</b></div><div class="row"><span>Hora y fotos</span><b>22:41 · 2 fotos</b></div><div class="cd">Queda en el historial: más confianza para los dos.</div>`)}
  ${card('lista','Catálogo de cerraduras',`<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px">${['Doble paleta','Multipunto','Electrónica','Candado'].map(t=>`<div style="background:#F3F5FA;border-radius:10px;padding:10px;font-weight:700;font-size:13px">${t}</div>`).join('')}</div>`)}
  ${card('calculadora','Presupuesto por tipo de puerta',`<div class="row"><span>Puerta blindada · cambio</span><span class="big" style="font-size:20px">$ 85.000</span></div><div class="cd">Precio que define el profesional; Handyx sugiere, nunca impone.</div>`)}</div>`),
 albanileria: page(`<div class="cab"><span class="chip">${ic('albanileria','#1F57A8',14)} Albañilería</span><h1>La obra, <mark>en orden</mark></h1></div><div class="cards">
  ${card('calculadora','Calculadora de materiales',`<div class="row"><span>Pared</span><b>12 m²</b></div><div class="row"><span>Ladrillo hueco 18×18×33</span><b>≈ 190 u.</b></div><div class="row"><span>Bolsas de cemento</span><b>≈ 4</b></div><div class="cd">Cantidades orientativas: ajustalas con tu experiencia.</div>`)}
  ${card('capas','Etapas de la obra',`${[['Demolición',100],['Revoque',60],['Pintura',0]].map(([t,p])=>`<div style="margin-top:8px"><div style="display:flex;justify-content:space-between;font-size:13px;font-weight:700"><span>${t}</span><span>${p} %</span></div><div class="bar" style="margin-top:4px"><i style="width:${p}%"></i></div></div>`).join('')}`)}
  ${card('camara','Avance con fotos',`<div class="cd">Cada etapa con fotos y la aprobación del cliente.</div>`)}</div>`),
 aire: page(`<div class="cab"><span class="chip">${ic('aire','#1F57A8',14)} Aire acondicionado</span><h1>Calculá y <mark>recordá</mark></h1></div><div class="cards">
  ${card('calculadora','Calculadora de frigorías',`<div class="row"><span>Ambiente</span><b>20 m² · 2,6 m de alto</b></div><div class="row"><span>Orientación</span><b>Norte · mucho sol</b></div><div class="row"><span>Sugerido</span><span class="big" style="font-size:22px">≈ 3.000 fg</span></div><div class="cd">Estimación orientativa.</div>`)}
  ${card('reloj2','Recordatorio de service',`<div class="row"><span>Split living · último service</span><b>mar. 2026</b></div><div class="btn am">Ofrecer service de temporada</div>`)}
  ${card('lista','Registro de gas refrigerante',`<div class="row"><span>R410A · carga</span><b>0,8 kg</b></div>`)}</div>`),
 numeros: page(`<div class="cab"><span class="chip">${ic('billetera','#1F57A8',14)} Mis números</span><h1>Ingresos y gastos, <mark>claros</mark></h1></div><div class="cards">
  ${card('crecimiento','Noviembre',`<div style="display:flex;gap:16px;margin-top:8px"><div><div class="cd">Ingresos</div><div class="big">$ 820.000</div></div><div><div class="cd">Gastos</div><div class="big" style="color:#D93025">$ 210.000</div></div></div><div style="display:flex;align-items:flex-end;gap:8px;height:80px;margin-top:12px">${[40,55,48,70,62,88].map((h,i)=>`<div style="flex:1;height:${h}%;border-radius:8px 8px 3px 3px;background:${i===5?'#FFC93C':'#1F57A8'}"></div>`).join('')}</div><div class="cd">Datos de ejemplo.</div>`)}
  ${card('chispas','Feedback con IA',`<div class="cd" style="color:#13305E">«Tus clientes valoran la puntualidad. Sumar fotos del antes y después mejoraría tus reseñas.»</div><div class="cd">Sugerencias para mejorar: vos decidís qué aplicar.</div>`)}</div>`, 'Números'),
 negocios: page(`<div class="cab"><span class="chip">${ic('tienda','#1F57A8',14)} Handyx para negocios</span><h1>Restaurante La Perla <mark>busca mozos</mark></h1><div class="sub">Sábado 20 a 02 h · 2 mozos</div></div><div class="cards">
  ${[['SM','Sofía M.','4,9','132 turnos'],['JR','Julián R.','4,8','97 turnos'],['CA','Camila A.','4,7','64 turnos']].map(([a,n,v,t],i)=>`<div class="card" style="display:flex;align-items:center;gap:12px"><span class="avatar" style="${i>1?'background:#4A72B0':''}">${a}</span><div style="flex:1"><div style="font-weight:800">${n}</div><div class="estrellas">★★★★★ <span style="color:#5F6B84;letter-spacing:0">${v} · ${t}</span></div></div><div style="background:${i<2?'#1E9E57':'#E6EEFB'};color:${i<2?'#fff':'#1F57A8'};font-weight:800;font-size:12px;padding:7px 10px;border-radius:10px">${i<2?'Elegido':'Elegir'}</div></div>`).join('')}
  <div class="card"><div class="ct"><span class="ico">${ic('balanza')}</span>Meritocracia</div><div class="cd">Disponibles ordenados por valoraciones y turnos cumplidos. Integrable con el sistema del local.</div></div></div>`, 'Inicio'),
};
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 414, height: 896 }, deviceScaleFactor: 2 });
  for (const [n, html] of Object.entries(P)) {
    fs.writeFileSync(`${out}/${n}.html`, html);
    await p.goto(`file://${out}/${n}.html`); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${out}/${n}.png` });
  }
  await b.close(); console.log('ok', Object.keys(P).length);
})();
