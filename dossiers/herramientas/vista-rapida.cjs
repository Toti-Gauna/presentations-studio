// Vista rápida para revisar: cada .pagina a PNG (out/pN.png) + hojas de a 3 (out/gN.jpg) e imprime los errores del control.
// Uso: node dossiers/herramientas/vista-rapida.cjs ruta/index.html carpeta-de-salida
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
const { execFileSync } = require('child_process');
(async () => {
  const [html, out] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1000, height: 1200 }, deviceScaleFactor: 1.4 });
  await p.goto('file://' + path.resolve(html)); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
  const r = await p.evaluate(() => window.__control ? window.__control() : null); if (r) console.log(JSON.stringify(r.errores));
  const pags = await p.$$('.pagina'); for (let i = 0; i < pags.length; i++) await pags[i].screenshot({ path: `${out}/p${i + 1}.png` });
  await b.close();
  execFileSync('python3', ['-I', '-c', `
import sys, glob
from PIL import Image
out = sys.argv[1]; n = len(glob.glob(out + '/p*.png'))
for g in range((n + 2) // 3):
  ims = [Image.open(out + '/p%d.png' % (g * 3 + i + 1)) for i in range(3) if g * 3 + i + 1 <= n]
  h = 1100; ims = [i.resize((int(i.width * h / i.height), h)) for i in ims]
  W = Image.new('RGB', (sum(i.width for i in ims) + 10 * (len(ims) + 1), h + 20), '#555'); x = 10
  for i in ims: W.paste(i, (x, 10)); x += i.width + 10
  W.save(out + '/g%d.jpg' % (g + 1), quality=88)
`, out]);
})();
