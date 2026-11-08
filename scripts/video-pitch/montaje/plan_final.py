# Clip del cierre en vivo (diapositiva 7, paso 2 del deck handyx-aticma): el mismo final del montaje, centrado y sin cámara.
# Uso: python3 plan_final.py <carpeta con montaje.html>  → <carpeta>/plan.js
# Después: node render.cjs <carpeta> <cuadros> 0 18.85, audio = efectos del final (sonidos.py final) desde 183,15 s, y ffmpeg (ver LEEME).
import ast, json, os, sys
aqui = os.path.dirname(os.path.abspath(__file__))
arbol = ast.parse(open(os.path.join(aqui, 'plan_pitch.py')).read())
grietas = next(ast.literal_eval(n.value) for n in arbol.body if isinstance(n, ast.Assign) and getattr(n.targets[0], 'id', None) == 'grietas')
finale = {'t0': 0.25, 'zoomOut': 3.2, 'romper': 3.7, 'frase': 11.1, 'gracias': 15.15, 'mdp': [-57.55, -38.0], 'rot0': [-42, 6], 'giro': 14,
          'R0': 2600, 'R1': 360, 'llegada': [4.4 + i * 0.38 for i in range(8)], 'arreglo': [5.5 + i * 0.62 for i in range(8)],
          'grietas': grietas, 'ox': 960, 'derecha': 0}
plan = {'dur': 18.85, 'stage': [0, 0, 0, 0], 'fondo': None, 'shots': [], 'stickers': [], 'finale': finale}
open(os.path.join(sys.argv[1], 'plan.js'), 'w').write('window.PLAN=' + json.dumps(plan, ensure_ascii=False) + ';')
print('plan del cierre →', os.path.join(sys.argv[1], 'plan.js'))
