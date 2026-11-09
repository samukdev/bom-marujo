"""
Gera ícones do app e o emblema transparente a partir dos logos aprovados.

Uso:  python3 -I scripts/gerar-icones.py
Entrada: assets/logo/originais/icone-app.jpg, assets/logo/originais/emblema.jpg
Saída:
  src/app/icon.png (512), src/app/apple-icon.png (180), src/app/favicon.ico (16/32/48)
  public/brand/icone-192.png, icone-512.png, icone-maskable-512.png
  public/brand/emblema.png (640, transparente), emblema.webp (512)
"""
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

RAIZ = Path(__file__).resolve().parent.parent
ORIG = RAIZ / "assets/logo/originais"
APP = RAIZ / "src/app"
BRAND = RAIZ / "public/brand"


def fundo_conectado(rgb: np.ndarray, limiar: int = 225) -> np.ndarray:
    """Pixels quase brancos conectados à borda da imagem."""
    h, w, _ = rgb.shape
    claro = rgb.min(axis=2) >= limiar
    fundo = np.zeros((h, w), dtype=bool)
    fila: deque[tuple[int, int]] = deque()
    for x in range(w):
        for y in (0, h - 1):
            if claro[y, x]:
                fundo[y, x] = True
                fila.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if claro[y, x] and not fundo[y, x]:
                fundo[y, x] = True
                fila.append((y, x))
    while fila:
        y, x = fila.popleft()
        for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            if 0 <= ny < h and 0 <= nx < w and claro[ny, nx] and not fundo[ny, nx]:
                fundo[ny, nx] = True
                fila.append((ny, nx))
    return fundo


def icone_quadrado() -> Image.Image:
    """O gerador desenhou cantos arredondados com branco fora — o SO arredonda sozinho,
    então preenchemos os cantos com o azul do fundo e cortamos uma margem fina."""
    img = Image.open(ORIG / "icone-app.jpg").convert("RGB")
    azul = img.getpixel((img.width // 2, 30))
    for canto in [(0, 0), (img.width - 1, 0), (0, img.height - 1), (img.width - 1, img.height - 1)]:
        ImageDraw.floodfill(img, canto, azul, thresh=120)
    m = 14
    return img.crop((m, m, img.width - m, img.height - m))


def main() -> None:
    BRAND.mkdir(parents=True, exist_ok=True)
    ic = icone_quadrado()
    azul = ic.getpixel((ic.width // 2, 10))

    ic.resize((512, 512), Image.LANCZOS).save(APP / "icon.png", optimize=True)
    ic.resize((180, 180), Image.LANCZOS).save(APP / "apple-icon.png", optimize=True)
    ic.resize((512, 512), Image.LANCZOS).save(BRAND / "icone-512.png", optimize=True)
    ic.resize((192, 192), Image.LANCZOS).save(BRAND / "icone-192.png", optimize=True)
    # o Next exige PNG RGBA dentro do .ico
    ic.convert("RGBA").save(APP / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])

    # maskable: conteúdo dentro da zona segura (80%) com o mesmo azul em volta
    mask = Image.new("RGB", (512, 512), azul)
    interno = ic.resize((410, 410), Image.LANCZOS)
    mask.paste(interno, (51, 51))
    mask.save(BRAND / "icone-maskable-512.png", optimize=True)

    # emblema com fundo transparente
    em = Image.open(ORIG / "emblema.jpg").convert("RGB")
    fundo = fundo_conectado(np.asarray(em))
    alpha = Image.fromarray(np.where(fundo, 0, 255).astype(np.uint8))
    alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.7))
    rgba = em.convert("RGBA")
    rgba.putalpha(alpha)
    bbox = Image.fromarray(np.where(fundo, 0, 255).astype(np.uint8)).getbbox()
    if bbox:
        rgba = rgba.crop(bbox)
    rgba.resize((640, round(640 * rgba.height / rgba.width)), Image.LANCZOS).save(BRAND / "emblema.png", optimize=True)
    rgba.resize((512, round(512 * rgba.height / rgba.width)), Image.LANCZOS).save(BRAND / "emblema.webp", "WEBP", quality=90)
    print("ok — azul do fundo:", "#%02x%02x%02x" % azul)


if __name__ == "__main__":
    main()
