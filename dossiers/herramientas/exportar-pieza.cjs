// Exporta una pieza HTML de la colección (dossier o tríptico) a sus tres salidas:
//   <nombre>-imprenta.pdf  formato final + 3 mm de sangrado por lado, con TrimBox y BleedBox (para la imprenta)
//   <nombre>-digital.pdf   formato final justo, imágenes a 150 ppp (para mandar y leer en pantalla), con enlaces
//   <nombre>-paginas/      una PNG por página a 150 ppp (para el zip y para revisar)
// Uso: node dossiers/herramientas/exportar-pieza.cjs <pieza.html> <carpeta-salida> <nombre> [--sin-png] [--permitir-avisos]
// Antes de exportar corre los controles de la pieza (window.__control): contenido que se sale, texto de menos de 5,5 pt,
// imágenes rotas o con menos de 150 ppp en el papel. Con errores no exporta.
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const [, , html, salida, nombre, ...flags] = process.argv;
if (!html || !salida || !nombre) {
  console.error('uso: exportar-pieza.cjs <pieza.html> <carpeta-salida> <nombre> [--sin-png]');
  process.exit(1);
}
const SANGRADO = 3; // mm
const aqui = __dirname;

function correr(cmd, args) {
  execFileSync(cmd, args, { stdio: ['ignore', 'ignore', 'pipe'] });
}

(async () => {
  fs.mkdirSync(salida, { recursive: true });
  const tmp = fs.mkdtempSync(path.join(salida, '.tmp-'));
  const nav = await chromium.launch();
  const pag = await nav.newPage();
  const errsJs = [];
  pag.on('pageerror', (e) => errsJs.push(e.message));
  const url = 'file://' + path.resolve(html);

  async function cargar(imprenta) {
    await pag.goto(url, { waitUntil: 'load', timeout: 120000 });
    return pag.evaluate(async (imp) => {
      document.documentElement.classList.toggle('imprenta', imp);
      await document.fonts.ready;
      await Promise.all([...document.images].map((im) => (im.complete ? null : new Promise((ok) => { im.onload = im.onerror = ok; }))));
      if (window.__numerar) window.__numerar();
      const apaisado = document.documentElement.classList.contains('apaisado');
      return { apaisado, formato: document.documentElement.dataset.formato || '', titulo: document.title };
    }, imprenta);
  }

  // 1) controles sobre la versión de imprenta
  const info = await cargar(true);
  const ctl = await pag.evaluate(() => (window.__control ? window.__control() : { paginas: 0, errores: ['la pieza no carga pieza.js'], avisos: [] }));
  if (errsJs.length) ctl.errores.push(...errsJs.map((e) => 'js: ' + e));
  console.log(`${nombre}: ${ctl.paginas} páginas · ${ctl.errores.length} errores · ${ctl.avisos.length} avisos`);
  ctl.errores.forEach((e) => console.log('  ERROR ' + e));
  ctl.avisos.slice(0, 40).forEach((e) => console.log('  aviso ' + e));
  if (ctl.avisos.length > 40) console.log(`  … y ${ctl.avisos.length - 40} avisos más`);
  if (ctl.errores.length) { await nav.close(); fs.rmSync(tmp, { recursive: true, force: true }); process.exit(2); }
  if (ctl.avisos.length && !flags.includes('--permitir-avisos')) console.log('  (los avisos no frenan la exportación)');

  // data-formato="297x420" en <html> para otros tamaños (afiches A3); si no, A4 vertical o apaisado
  const [W, H] = info.formato ? info.formato.split('x').map(Number) : info.apaisado ? [297, 210] : [210, 297];
  const pdfOpc = { printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 }, preferCSSPageSize: false, tagged: true, outline: true };

  // 2) imprenta: con sangrado; las cajas TrimBox/BleedBox las pone cajas-pdf.py
  const imprentaTmp = path.join(tmp, 'imprenta.pdf');
  await pag.pdf({ ...pdfOpc, path: imprentaTmp, width: `${W + 2 * SANGRADO}mm`, height: `${H + 2 * SANGRADO}mm` });
  const imprenta = path.join(salida, `${nombre}-imprenta.pdf`);
  correr('python3', ['-I', path.join(aqui, 'cajas-pdf.py'), imprentaTmp, imprenta, String(SANGRADO), info.titulo]);
  // solo las fuentes de la colección, embebidas como TrueType: un carácter que no tienen cae en otra fuente (Type 3)
  const ajenas = execFileSync('pdffonts', [imprenta], { encoding: 'utf8' }).split('\n').slice(2).filter((l) => l.trim())
    .filter((l) => !/\+(DMSans|Archivo|SimbolosHandyx)-/.test(l) || /Type 3/.test(l));
  if (ajenas.length) {
    console.log('  ERROR fuentes ajenas en el PDF (algún carácter que la colección no tiene; usá un ícono SVG):');
    ajenas.forEach((l) => console.log('    ' + l.trim()));
    await nav.close(); fs.rmSync(tmp, { recursive: true, force: true }); process.exit(2);
  }

  // 3) digital: formato justo, después liviano con ghostscript (imágenes a 150 ppp, enlaces intactos)
  await cargar(false);
  const digitalTmp = path.join(tmp, 'digital.pdf');
  await pag.pdf({ ...pdfOpc, path: digitalTmp, width: `${W}mm`, height: `${H}mm` });
  await nav.close();
  const livianoTmp = path.join(tmp, 'digital-liviano.pdf');
  correr('gs', ['-q', '-dNOPAUSE', '-dBATCH', '-dSAFER', '-sDEVICE=pdfwrite', '-dCompatibilityLevel=1.7', '-dDetectDuplicateImages=true',
    '-dDownsampleColorImages=true', '-dColorImageDownsampleType=/Bicubic', '-dColorImageResolution=150', '-dColorImageDownsampleThreshold=1.2',
    '-dDownsampleGrayImages=true', '-dGrayImageResolution=150', '-dAutoFilterColorImages=false', '-dColorImageFilter=/DCTEncode', '-dJPEGQ=88',
    `-sOutputFile=${livianoTmp}`, digitalTmp]);
  const digital = path.join(salida, `${nombre}-digital.pdf`);
  // si ghostscript no achica, queda el original
  const fuente = fs.statSync(livianoTmp).size < fs.statSync(digitalTmp).size ? livianoTmp : digitalTmp;
  correr('python3', ['-I', path.join(aqui, 'cajas-pdf.py'), fuente, digital, '0', info.titulo]);

  // 4) una PNG por página (desde el PDF digital sin comprimir, para que se lea nítido)
  if (!flags.includes('--sin-png')) {
    const carpeta = path.join(salida, `${nombre}-paginas`);
    fs.rmSync(carpeta, { recursive: true, force: true });
    fs.mkdirSync(carpeta, { recursive: true });
    correr('pdftoppm', ['-r', '150', '-png', digitalTmp, path.join(carpeta, 'pagina')]);
  }
  fs.rmSync(tmp, { recursive: true, force: true });
  const mb = (f) => (fs.statSync(f).size / 1e6).toFixed(1) + ' MB';
  console.log(`  → ${path.relative(process.cwd(), imprenta)} (${mb(imprenta)}) · ${path.relative(process.cwd(), digital)} (${mb(digital)})`);
})().catch((e) => { console.error(e); process.exit(1); });
