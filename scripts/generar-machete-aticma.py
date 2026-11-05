"""Machete de las preguntas del jurado en PDF (A4): docs/handyx/aticma-preguntas.md + una página de atajos armada con el
orden real del deck (número + Enter y Mayús + letra; las portadas de sección no toman letra).
Uso: python3 -I scripts/generar-machete-aticma.py  →  salida/pdf/handyx-aticma-preguntas-del-jurado.pdf
Requiere: pip install markdown, y Playwright de Node (require('playwright')) para imprimir el PDF."""
import html, json, os, pathlib, subprocess
import markdown

R = pathlib.Path(__file__).resolve().parent.parent
LETRAS = 'ABCDEFGHIJKLMOPQSTUVWXYZ'   # las mismas que el presentador: sin N (notas) ni R (reloj)
deck = json.loads((R / 'decks/handyx-aticma/deck.json').read_text())
v = next(x for x in deck['versiones'] if x['id'] == 'evento')
ESC = {e['id']: e for e in deck['escenas']}
fuentes = R / 'node_modules/@fontsource-variable'

def titulo(e):
    t = e['titulo']
    return t.replace('Posible pregunta ', 'P').replace(': ', ' · ', 1) if e['id'].startswith('q-') else t

filas, k = [], 0
for n, sid in enumerate(v['escenas'] + v['anexos'], 1):
    e = ESC[sid]
    if n <= len(v['escenas']):
        filas.append(f'<tr><td class="n">{n}</td><td>{html.escape(titulo(e))}</td><td class="a">en orden</td></tr>')
    elif e.get('seccion'):
        filas.append(f'<tr class="sec"><td class="n">{n}</td><td>{html.escape(e["titulo"])}</td><td class="a">portada</td></tr>')
    else:
        atajo = f'Mayús + {LETRAS[k]}' if k < len(LETRAS) else ''
        k += 1
        filas.append(f'<tr><td class="n">{n}</td><td>{html.escape(titulo(e))}</td><td class="a">{atajo}</td></tr>')
mitad = (len(filas) + 1) // 2
tabla = lambda fs: f'<table>{"".join(fs)}</table>'

cuerpo = markdown.markdown((R / 'docs/handyx/aticma-preguntas.md').read_text(), extensions=['sane_lists'])
doc = f"""<!doctype html><html lang="es-AR"><head><meta charset="utf-8"><title>Machete · preguntas del jurado</title><style>
@font-face {{ font-family: 'DM Sans'; src: url('{(fuentes / 'dm-sans/files/dm-sans-latin-wght-normal.woff2').as_uri()}') format('woff2'); font-weight: 100 1000; }}
@font-face {{ font-family: 'DM Sans'; font-style: italic; src: url('{(fuentes / 'dm-sans/files/dm-sans-latin-wght-italic.woff2').as_uri()}') format('woff2'); font-weight: 100 1000; }}
@font-face {{ font-family: 'Archivo'; src: url('{(fuentes / 'archivo/files/archivo-latin-wght-normal.woff2').as_uri()}') format('woff2'); font-weight: 100 900; }}
@page {{ size: A4; margin: 14mm 13mm; }}
body {{ font: 10pt/1.42 'DM Sans', sans-serif; color: #26324A; }}
h1, h2 {{ font-family: 'Archivo', sans-serif; font-weight: 900; color: #13305E; }}
h1 {{ font-size: 19pt; line-height: 1.1; margin: 0 0 8pt; }}
h2 {{ font-size: 12.5pt; margin: 14pt 0 5pt; padding-top: 6pt; border-top: 2px solid #FFC93C; break-after: avoid; }}
ol {{ padding-left: 18pt; margin: 0; }} li {{ margin: 0 0 6pt; break-inside: avoid; }}
li > strong:first-child, li > p > strong:first-child {{ display: block; color: #0E1D36; font-size: 10.5pt; }}
em {{ color: #1F57A8; }} p {{ margin: 0 0 6pt; }}
.atajos {{ break-before: page; }}
.atajos p {{ font-size: 9.5pt; }}
.cols {{ display: grid; grid-template-columns: 1fr 1fr; gap: 0 10pt; break-inside: avoid; }}
table {{ border-collapse: collapse; width: 100%; font-size: 7.9pt; line-height: 1.3; }}
td {{ padding: 1.5pt 3pt; border-bottom: 1px solid #E3E8F2; vertical-align: top; }}
td.n {{ width: 18pt; text-align: right; font-weight: 800; color: #1F57A8; }}
td.a {{ width: 50pt; white-space: nowrap; font-weight: 700; color: #13305E; }}
tr.sec td {{ background: #13305E; color: #fff; font-weight: 800; }} tr.sec td.n, tr.sec td.a {{ color: #FFC93C; }}
</style></head><body>{cuerpo}
<section class="atajos"><h2>Láminas en el presentador · número + Enter o Mayús + letra</h2>
<p>Escribí el número y apretá Enter (se ve a qué lámina va; Esc cancela). <b>Mayús + letra</b> abre las preguntas del jurado y las primeras
láminas del material extra; las portadas no toman letra. <b>0</b> vuelve a la última diapositiva del pitch. En el celular: menú ☰.</p>
<div class="cols">{tabla(filas[:mitad])}{tabla(filas[mitad:])}</div></section></body></html>"""

salida_html = R / 'salida/pdf/machete-aticma.html'
salida_pdf = R / 'salida/pdf/handyx-aticma-preguntas-del-jurado.pdf'
salida_html.parent.mkdir(parents=True, exist_ok=True)
salida_html.write_text(doc)
js = f"""const {{ chromium }} = require('playwright');
(async () => {{ const b = await chromium.launch(); const p = await b.newPage();
  await p.goto({json.dumps(salida_html.as_uri())}); await p.evaluate(() => document.fonts.ready);
  await p.pdf({{ path: {json.dumps(str(salida_pdf))}, format: 'A4', printBackground: true, preferCSSPageSize: true }}); await b.close(); }})();"""
subprocess.run(['node', '-e', js], check=True, cwd=R)
os.remove(salida_html)
print(f'machete → {salida_pdf.relative_to(R)} ({len(filas)} láminas en la página de atajos)')
