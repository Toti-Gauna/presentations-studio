"""Recorta las láminas de los Handys (fondo verde, 2x2 poses) a WebP con alfa.

Uso: python3 -I scripts/recortar_personajes.py <carpeta_laminas> <carpeta_salida>
Cada lámina 1536x1024 tiene cuatro poses (arriba-izq, arriba-der, abajo-izq, abajo-der).
Chroma key sobre verde puro + despill; recorte al contenido con margen; altura normalizada.
"""
import sys, os, json
import numpy as np
from PIL import Image

POSES = ["a", "b", "c", "d"]  # orden de lectura; los nombres semánticos van en el manifiesto

def key(rgb: np.ndarray) -> np.ndarray:
    r, g, b = [rgb[..., i].astype(np.float32) for i in range(3)]
    verde = g - np.maximum(r, b)          # cuánto domina el verde
    alfa = 1.0 - np.clip((verde - 40.0) / (110.0 - 40.0), 0, 1)
    # despill: el verde nunca supera al mayor de los otros canales en bordes
    g2 = np.where(verde > 0, np.minimum(g, np.maximum(r, b) + 8), g)
    out = np.stack([r, g2, b, alfa * 255.0], axis=-1)
    return np.clip(out, 0, 255).astype(np.uint8)

def main(src: str, dst: str) -> None:
    os.makedirs(dst, exist_ok=True)
    manifest = {}
    for nombre in sorted(os.listdir(src)):
        if not nombre.endswith(".png"):
            continue
        base = nombre.split("_", 1)[1].rsplit(".", 1)[0]
        img = np.array(Image.open(os.path.join(src, nombre)).convert("RGB"))
        h, w = img.shape[:2]
        rgba = key(img)
        cuadros = [(0, 0), (0, w // 2), (h // 2, 0), (h // 2, w // 2)]
        manifest[base] = []
        for pose, (y, x) in zip(POSES, cuadros):
            q = rgba[y:y + h // 2, x:x + w // 2]
            a = q[..., 3]
            ys, xs = np.where(a > 24)
            m = 12
            y0, y1 = max(ys.min() - m, 0), min(ys.max() + m, q.shape[0])
            x0, x1 = max(xs.min() - m, 0), min(xs.max() + m, q.shape[1])
            recorte = Image.fromarray(q[y0:y1, x0:x1], "RGBA")
            # pie apoyado: guardamos la línea de base para alinear poses entre sí
            archivo = f"{base}-{pose}.webp"
            recorte.save(os.path.join(dst, archivo), "WEBP", quality=90, method=6)
            manifest[base].append({"pose": pose, "archivo": archivo, "w": int(x1 - x0), "h": int(y1 - y0)})
    with open(os.path.join(dst, "recortes.json"), "w") as f:
        json.dump(manifest, f, indent=1)

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
