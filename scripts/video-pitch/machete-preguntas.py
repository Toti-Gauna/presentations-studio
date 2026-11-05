import re, html, sys
src, out = sys.argv[1], sys.argv[2]
NM='/home/user/presentations-studio/node_modules/@fontsource-variable'
A='/home/user/presentations-studio/brands/handyx/assets'
L=open(src).read().split('\n')
def inl(t):
    t=html.escape(t)
    t=re.sub(r'\*\*(.+?)\*\*',r'<b>\1</b>',t); t=re.sub(r'\*(.+?)\*',r'<i>\1</i>',t); t=re.sub(r'`(.+?)`',r'<code>\1</code>',t)
    return t
partes=[]; i=0; cur=None
while i<len(L):
    l=L[i]
    if l.startswith('# '): partes.append(f'<header><img src="file://{A}/logo-handyx.webp"><h1>{inl(l[2:])}</h1></header>')
    elif l.startswith('## '): partes.append(f'<h2>{inl(l[3:])}</h2>')
    elif re.match(r'^\d+\. ',l):
        n,resto=l.split('. ',1); body=[]; i+=1
        while i<len(L) and (L[i].startswith('   ') or L[i].startswith('    ')): body.append(L[i].strip()); i+=1
        extra=' <span class="x">extra</span>' if '*(extra)*' in resto else ''
        q=resto.replace('*(extra)*','').strip().strip('*').strip()
        partes.append(f'<div class="qa"><div class="n">{n}</div><div><div class="q">{inl(q)}{extra}</div><p>{inl(" ".join(body))}</p></div></div>'); continue
    elif l.strip():
        bloque=[l]; i+=1
        while i<len(L) and L[i].strip() and not L[i].startswith('#') and not re.match(r'^\d+\. ',L[i]): bloque.append(L[i]); i+=1
        partes.append(f'<p class="intro">{inl(" ".join(bloque))}</p>'); continue
    i+=1
# Última página: número y atajo de cada lámina en el presentador (número + Enter; Mayús + letra en los primeros 24 anexos).
import json, os
R=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
deck=json.load(open(f'{R}/decks/handyx-aticma/deck.json')); ver=next(v for v in deck['versiones'] if v['id']=='evento')
tit={e['id']:e['titulo'] for e in deck['escenas']}; LET='ABCDEFGHIJKLMOPQSTUVWXYZ'
filas=[]
for k,sid in enumerate(ver['escenas']+ver['anexos']):
    n=k+1; j=k-len(ver['escenas'])
    atajo='→ en orden' if j<0 else (f'Mayús + {LET[j]}' if j<len(LET) else '')
    filas.append(f'<tr{" class=p" if j<0 else ""}><td class=num>{n}</td><td>{html.escape(tit[sid])}</td><td class=at>{atajo}</td></tr>')
mitad=(len(filas)+1)//2
partes.append('<section class="atajos"><h2>Láminas en el presentador · número + Enter</h2><p class="intro">Escribí el número y apretá Enter '
  '(se ve a qué lámina va; Esc cancela). <b>0</b> vuelve a la última diapositiva del pitch. En el celular: menú ☰.</p><div class=cols>'
  f'<table>{"".join(filas[:mitad])}</table><table>{"".join(filas[mitad:])}</table></div></section>')
doc=f"""<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{{font-family:'Archivo';src:url('file://{NM}/archivo/files/archivo-latin-wdth-normal.woff2') format('woff2');font-weight:100 900;font-stretch:62% 125%}}
@font-face{{font-family:'DM Sans';src:url('file://{NM}/dm-sans/files/dm-sans-latin-wght-normal.woff2') format('woff2');font-weight:100 1000}}
@page{{size:A4;margin:14mm 13mm}}
body{{font-family:'DM Sans';color:#13305E;font-size:10.4pt;line-height:1.42}}
header{{display:flex;align-items:center;gap:14px;border-bottom:4px solid #FFC93C;padding-bottom:10px;margin-bottom:10px}}
header img{{height:26px}} h1{{font-family:'Archivo';font-weight:900;font-stretch:112%;font-size:17pt;line-height:1.1;margin:0}}
h2{{font-family:'Archivo';font-weight:900;font-stretch:112%;font-size:13pt;color:#1F57A8;margin:16px 0 6px;break-after:avoid}}
.intro{{color:#4A5873;margin:4px 0}}
.qa{{display:flex;gap:10px;background:#F3F5FA;border-radius:10px;padding:9px 12px;margin:7px 0;break-inside:avoid}}
.qa .n{{flex:none;width:26px;height:26px;border-radius:8px;background:#1F57A8;color:#fff;font-weight:800;display:grid;place-items:center;font-size:10pt}}
.qa .q{{font-weight:800;font-size:11pt}} .qa p{{margin:3px 0 0}}
.x{{background:#FFC93C;color:#13305E;font-size:7.5pt;font-weight:800;padding:1px 6px;border-radius:999px;vertical-align:middle;text-transform:uppercase}}
b{{color:#13305E}} i{{color:#4A5873}} code{{font-size:9pt}}
.atajos{{break-before:page}} .cols{{display:flex;gap:12px}} .cols table{{flex:1;border-collapse:collapse;font-size:8.6pt}}
.cols td{{padding:3px 6px;border-bottom:1px solid #E3E8F2;vertical-align:top}} .cols tr.p td{{background:#FFF6DA}}
.cols .num{{font-weight:800;color:#1F57A8;width:22px;text-align:right}} .cols .at{{color:#4A5873;white-space:nowrap}}
</style></head><body>{''.join(partes)}</body></html>"""
open(out,'w').write(doc)
