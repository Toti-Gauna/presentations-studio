// Ilustraciones de Mar del Plata hechas a partir de las fotos reales de Ignacio (marca/fotos/referencias/): cada foto se
// redibuja como una maqueta isométrica de la marca (iso.js) del mismo tamaño en píxeles, con fondo azul (versión -azul)
// o navy de noche (versión -navy). Así las piezas que usaban una foto pasan a usar su ilustración sin cambiar el HTML.
// Uso: node dossiers/herramientas/ilustrar-fotos.cjs   (recorre marca/fotos y las copias en piezas/*/img)
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path'); const { execFileSync } = require('child_process');
const D = path.resolve(__dirname, '..');

// foto de referencia → escena de iso.js (y semilla, para que cada una sea distinta)
const ESCENAS = {
  'costa-atardecer': ['costa-torres', 4], 'rambla-fuego': ['rambla', 3], 'casino-plaza': ['rambla', 8],
  'aerea-cabo-puerto': ['costa-torres', 11], 'aerea-centro-playa': ['centro', 5], 'aerea-faro-mogotes': ['faro', 6],
  'aerea-puerto-sur': ['puerto', 9], 'aerea-quintas': ['barrio', 12], 'ciudad-noche': ['centro-noche', 7],
  'centro-playa': ['centro', 5], 'faro-mogotes': ['faro', 6], 'rambla': ['rambla', 3], 'puerto-sur': ['puerto', 9],
};

function trabajos() {
  const t = [];
  const agregar = (archivo, base, tono) => { const e = ESCENAS[base]; if (e) t.push({ archivo, escena: e[0], semilla: e[1], tono }); };
  for (const f of fs.readdirSync(path.join(D, 'marca/fotos'))) {
    const m = f.match(/^(.+)-(navy|azul)\.webp$/); if (m) agregar(path.join(D, 'marca/fotos', f), m[1], m[2]);
  }
  for (const pieza of fs.readdirSync(path.join(D, 'piezas'))) {
    const dir = path.join(D, 'piezas', pieza, 'img'); if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      let m = f.match(/^(.+)-(navy|azul)\.webp$/); if (m && ESCENAS[m[1]]) { agregar(path.join(dir, f), m[1], m[2]); continue; }
      m = f.match(/^f-(centro-playa|faro-mogotes|rambla|puerto-sur)\.webp$/); if (m) agregar(path.join(dir, f), m[1], 'azul');
    }
  }
  return t;
}

(async () => {
  const lista = trabajos();
  const b = await chromium.launch();
  const iso = fs.readFileSync(path.join(D, 'plantilla/iso.js'), 'utf8');
  for (const t of lista) {
    const [w, h] = execFileSync('python3', ['-I', '-c', 'import sys;from PIL import Image;print(*Image.open(sys.argv[1]).size)', t.archivo]).toString().trim().split(' ').map(Number);
    const noche = t.tono === 'navy';
    const fondo = noche ? 'radial-gradient(70% 55% at 55% 62%, #173A70 0%, #0E1D36 72%)' : 'linear-gradient(180deg, #2C66B8 0%, #1F57A8 55%, #1B4E98 100%)';
    // nítidas para imprimir a sangre: al menos 2600 px de ancho
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: Math.max(1, 2600 / w) });
    await p.setContent(`<!doctype html><html><body style="margin:0;width:${w}px;height:${h}px;overflow:hidden;background:${fondo};position:relative">
      <div id="m" data-iso="${t.escena}" data-paleta="${noche ? 'noche' : 'dia'}" data-semilla="${t.semilla}" style="position:absolute;left:50%;transform:translateX(-50%)"></div>
      <script>${iso}</script><script>
        const m = document.getElementById('m'); const W = ${w}, H = ${h};
        m.style.width = (W * 1.32) + "px"; window.__iso();
        let alto = m.getBoundingClientRect().height;
        if (alto > H * 0.8) { m.style.width = (W * 1.32 * H * 0.8 / alto) + 'px'; window.__iso(); alto = m.getBoundingClientRect().height; }
        m.style.top = (H - alto) * 0.62 + 'px';
      </script></body></html>`);
    const png = t.archivo.replace(/\.webp$/, '.tmp.png');
    await p.screenshot({ path: png });
    execFileSync('python3', ['-I', '-c', 'import sys;from PIL import Image;Image.open(sys.argv[1]).convert("RGB").save(sys.argv[2],quality=90)', png, t.archivo]);
    fs.unlinkSync(png); await p.close();
    console.log(path.relative(D, t.archivo), '←', t.escena, `${w}×${h}`);
  }
  await b.close();
})();
