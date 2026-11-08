// Teléfonos fotorrealistas para la colección: toma una pantalla (390 × 844) y devuelve el teléfono entero, con canto
// metálico, espesor real en perspectiva, brillo del vidrio y sombra, sobre fondo transparente (PNG → WebP con alfa).
// La pantalla no se toca: se pone tal cual adentro del teléfono.
// Uso: node dossiers/herramientas/dispositivo.cjs trabajos.json
//   trabajos.json = [{ "tipo": "telefono|laptop", "src": "ruta/pantalla.webp", "out": "ruta/salida.webp", "ry": -18, "rx": 8, "rz": 0,
//                      "acabado": "titanio|plata|noche", "sombra": "suave|piso|ninguna", "ancho": 1400 }]
// "ancho" son los píxeles del teléfono en la imagen final (1400 px ≈ 70 mm a 500 ppp).
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ACABADOS = {
  // canto: degradé metálico; capa: color del espesor visto de costado
  titanio: { canto: 'linear-gradient(135deg,#8C97AD 0%,#2A3650 18%,#5B6A88 38%,#1A2438 58%,#6F7E9C 80%,#26324A 100%)', capa: '#1C2740', boton: '#3C4A66' },
  plata: { canto: 'linear-gradient(135deg,#FFFFFF 0%,#C9CFDA 20%,#F4F6FA 42%,#AEB6C5 62%,#E9EDF3 82%,#BCC4D2 100%)', capa: '#A9B1C0', boton: '#C9CFDA' },
  noche: { canto: 'linear-gradient(135deg,#4A5878 0%,#0E1D36 22%,#2C3B5C 45%,#0A1426 65%,#3A4A6C 85%,#13284A 100%)', capa: '#0B1528', boton: '#22304C' },
};

function laptop(t, dataUrl) {
  const a = ACABADOS[t.acabado || 'titanio'];
  const u = 1;
  const sombra = t.sombra === 'ninguna' ? 'none' : `0 ${50 * u}px ${90 * u}px rgba(14,29,54,.28), 0 ${14 * u}px ${26 * u}px rgba(14,29,54,.18)`;
  return `<!doctype html><html><head><style>
  html,body{margin:0;background:transparent}
  .escena{width:${2300 * u}px;height:${1500 * u}px;display:grid;place-items:center;perspective:${4200 * u}px}
  .lap{position:relative;width:${1720 * u}px;transform-style:preserve-3d;transform:rotateX(${t.rx || 0}deg) rotateY(${t.ry || 0}deg) rotateZ(${t.rz || 0}deg)}
  .tapa{position:relative;margin:0 auto;width:${1500 * u}px;height:${966 * u}px;border-radius:${38 * u}px ${38 * u}px ${10 * u}px ${10 * u}px;background:${a.canto};box-shadow:inset 0 0 0 ${1.5 * u}px rgba(255,255,255,.35)}
  .bisel{position:absolute;inset:${6 * u}px ${6 * u}px 0;border-radius:${33 * u}px ${33 * u}px 0 0;background:#04070D}
  .pantalla{position:absolute;left:${30 * u}px;top:${34 * u}px;width:${1440 * u}px;height:${900 * u}px;overflow:hidden;background:#fff;border-radius:${6 * u}px}
  .pantalla img{width:100%;height:100%;display:block;object-fit:cover;object-position:top}
  .brillo{position:absolute;inset:0;background:linear-gradient(115deg,rgba(255,255,255,.14) 0%,rgba(255,255,255,.04) 30%,rgba(255,255,255,0) 45%)}
  .camara{position:absolute;left:50%;top:${14 * u}px;width:${9 * u}px;height:${9 * u}px;margin-left:${-4.5 * u}px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#2E3E5E,#05080F 60%)}
  .base{position:relative;height:${38 * u}px;border-radius:${4 * u}px ${4 * u}px ${46 * u}px ${46 * u}px / ${4 * u}px ${4 * u}px ${30 * u}px ${30 * u}px;background:linear-gradient(180deg,#F4F6FA 0%,${a.capa} 55%,#6B7487 100%);box-shadow:${sombra}}
  .muesca{position:absolute;left:50%;top:0;width:${240 * u}px;height:${13 * u}px;margin-left:${-120 * u}px;border-radius:0 0 ${14 * u}px ${14 * u}px;background:linear-gradient(180deg,#8B94A6,#C9CFDA)}
  </style></head><body><div class="escena"><div class="lap"><div class="tapa"><div class="bisel"></div>
  <div class="pantalla"><img src="${dataUrl}"><div class="brillo"></div></div><div class="camara"></div></div>
  <div class="base"><div class="muesca"></div></div></div></div></body></html>`;
}

function html(t, dataUrl) {
  if (t.tipo === 'laptop') return laptop(t, dataUrl);
  const a = ACABADOS[t.acabado || 'titanio'];
  const u = 2; // px por unidad de diseño (pantalla de 390 u de ancho)
  const capas = Array.from({ length: 22 }, (_, i) => `<div class="capa" style="transform:translateZ(${-(i + 1) * 1.1 * u}px)"></div>`).join('');
  const sombra = t.sombra === 'ninguna' ? 'none'
    : t.sombra === 'piso' ? `0 ${60 * u}px ${90 * u}px rgba(8,20,42,.38), 0 ${18 * u}px ${30 * u}px rgba(8,20,42,.22)`
      : `0 ${36 * u}px ${70 * u}px rgba(14,29,54,.26), 0 ${10 * u}px ${20 * u}px rgba(14,29,54,.16)`;
  return `<!doctype html><html><head><style>
  html,body{margin:0;background:transparent}
  .escena{width:${900 * u}px;height:${1500 * u}px;display:grid;place-items:center;perspective:${2600 * u}px}
  .tel{position:relative;width:${426 * u}px;height:${880 * u}px;transform-style:preserve-3d;
    transform:rotateX(${t.rx || 0}deg) rotateY(${t.ry || 0}deg) rotateZ(${t.rz || 0}deg)}
  .capa{position:absolute;inset:0;border-radius:${66 * u}px;background:${a.capa}}
  .cuerpo{position:absolute;inset:0;border-radius:${66 * u}px;background:${a.canto};box-shadow:${sombra}, inset 0 0 0 ${1 * u}px rgba(255,255,255,.35)}
  .bisel{position:absolute;inset:${4.5 * u}px;border-radius:${61.5 * u}px;background:#04070D;box-shadow:inset 0 0 0 ${0.8 * u}px rgba(255,255,255,.08)}
  .pantalla{position:absolute;left:${18 * u}px;top:${18 * u}px;width:${390 * u}px;height:${844 * u}px;border-radius:${49 * u}px;overflow:hidden;background:#fff}
  .pantalla img{width:100%;height:100%;display:block;object-fit:cover;object-position:top}
  .brillo{position:absolute;inset:0;background:linear-gradient(118deg,rgba(255,255,255,.16) 0%,rgba(255,255,255,.05) 28%,rgba(255,255,255,0) 42%)}
  .camara{position:absolute;left:50%;top:${6.2 * u}px;width:${6 * u}px;height:${6 * u}px;margin-left:${-3 * u}px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#2E3E5E,#05080F 60%)}
  .btn{position:absolute;width:${3.2 * u}px;border-radius:${2 * u}px;background:${a.boton}}
  </style></head><body><div class="escena"><div class="tel">${capas}
  <div class="btn" style="left:${-2.6 * u}px;top:${170 * u}px;height:${34 * u}px"></div>
  <div class="btn" style="left:${-2.6 * u}px;top:${230 * u}px;height:${62 * u}px"></div>
  <div class="btn" style="left:${-2.6 * u}px;top:${305 * u}px;height:${62 * u}px"></div>
  <div class="btn" style="right:${-2.6 * u}px;top:${250 * u}px;height:${96 * u}px"></div>
  <div class="cuerpo"></div><div class="bisel"></div>
  <div class="pantalla"><img src="${dataUrl}"><div class="brillo"></div></div><div class="camara"></div>
  </div></div></body></html>`;
}

(async () => {
  const trabajos = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 2400, height: 3000 }, deviceScaleFactor: 1 });
  for (const t of trabajos) {
    const ext = path.extname(t.src).slice(1).replace('jpg', 'jpeg');
    const dataUrl = `data:image/${ext};base64,${fs.readFileSync(t.src).toString('base64')}`;
    await page.setContent(html(t, dataUrl));
    await page.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth));
    const png = t.out.replace(/\.\w+$/, '.png');
    fs.mkdirSync(path.dirname(png), { recursive: true });
    await page.locator('.escena').screenshot({ path: png, omitBackground: true });
    // recorta lo transparente y escala al ancho pedido (Python + Pillow)
    execFileSync('python3', ['-I', '-c', `
import sys
from PIL import Image
im = Image.open(sys.argv[1]); a = im.getchannel('A'); bb = a.point(lambda v: 255 if v > 0 else 0).getbbox(); im = im.crop(bb)
w = int(sys.argv[3]); s = w / float(sys.argv[4])
im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
im.save(sys.argv[2], 'WEBP', quality=92, method=6)
`, png, t.out, String(t.ancho || 1400), String(t.tipo === 'laptop' ? 1720 : 852)]);
    fs.unlinkSync(png);
    console.log('listo', t.out);
  }
  await browser.close();
})();
