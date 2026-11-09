"""
Recorta as poses do Marujo das folhas 2x2 geradas e remove o fundo branco.

Uso:  python3 -I scripts/recortar-marujo.py
Entrada: assets/marujo/originais/lote-*.jpg (grades 2x2) e folha-personagem.jpg
Saída:   public/marujo/<pose>.webp (fundo transparente, altura máx. 640 px)

Remoção de fundo: preenchimento a partir das bordas, só em pixels quase brancos
conectados à borda — o branco DENTRO do contorno preto (luvas, camisa, fumaça) é preservado.
"""
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

RAIZ = Path(__file__).resolve().parent.parent
ORIG = RAIZ / "assets/marujo/originais"
SAIDA = RAIZ / "public/marujo"

LOTES = {
    "lote-a-feedback.jpg": ["aprovando", "orgulhoso", "cetico", "bravo"],
    "lote-b-emocoes.jpg": ["triste", "comemorando", "assustado", "dormindo"],
    "lote-c-ensino.jpg": ["ensinando", "pensando", "continencia", "apito"],
}

LIMIAR_BRANCO = 232  # canal mínimo para considerar "fundo"
ALTURA_MAX = 640


def mascara_fundo(rgb: np.ndarray) -> np.ndarray:
    h, w, _ = rgb.shape
    claro = rgb.min(axis=2) >= LIMIAR_BRANCO
    fundo = np.zeros((h, w), dtype=bool)
    fila: deque[tuple[int, int]] = deque()
    for x in range(w):
        for y in (0, h - 1):
            if claro[y, x] and not fundo[y, x]:
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


def remover_restos_na_borda(fundo: np.ndarray, area_max: int = 4000) -> None:
    """Pedaços pequenos encostados na borda do recorte são da pose vizinha: vira fundo."""
    h, w = fundo.shape
    visto = fundo.copy()
    for y0 in range(h):
        for x0 in range(w):
            if visto[y0, x0]:
                continue
            comp, fila, borda = [], deque([(y0, x0)]), False
            visto[y0, x0] = True
            while fila:
                y, x = fila.popleft()
                comp.append((y, x))
                if y in (0, h - 1) or x in (0, w - 1):
                    borda = True
                for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
                    if 0 <= ny < h and 0 <= nx < w and not visto[ny, nx]:
                        visto[ny, nx] = True
                        fila.append((ny, nx))
            if borda and len(comp) < area_max:
                ys, xs = zip(*comp)
                fundo[list(ys), list(xs)] = True


def recortar(img: Image.Image) -> Image.Image:
    rgb = np.asarray(img.convert("RGB"))
    fundo = mascara_fundo(rgb)
    remover_restos_na_borda(fundo)
    alpha = Image.fromarray(np.where(fundo, 0, 255).astype(np.uint8))
    # come 1 px da borda (some o halo branco do anti-serrilhado) e suaviza
    alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.7))
    rgba = img.convert("RGBA")
    rgba.putalpha(alpha)
    bbox = Image.fromarray(np.where(fundo, 0, 255).astype(np.uint8)).getbbox()
    if bbox:
        m = 6
        bbox = (max(bbox[0] - m, 0), max(bbox[1] - m, 0), min(bbox[2] + m, rgba.width), min(bbox[3] + m, rgba.height))
        rgba = rgba.crop(bbox)
    if rgba.height > ALTURA_MAX:
        rgba = rgba.resize((round(rgba.width * ALTURA_MAX / rgba.height), ALTURA_MAX), Image.LANCZOS)
    return rgba


def main() -> None:
    SAIDA.mkdir(parents=True, exist_ok=True)
    for arquivo, poses in LOTES.items():
        img = Image.open(ORIG / arquivo)
        w, h = img.size
        quadrantes = [(0, 0, w // 2, h // 2), (w // 2, 0, w, h // 2), (0, h // 2, w // 2, h), (w // 2, h // 2, w, h)]
        for pose, q in zip(poses, quadrantes):
            out = recortar(img.crop(q))
            out.save(SAIDA / f"{pose}.webp", "WEBP", quality=90, method=6)
            print(f"{pose:12s} {out.size}")

    # retrato a partir da folha do personagem (frente), sem a paleta de cores
    folha = Image.open(ORIG / "folha-personagem.jpg").convert("RGB")
    fw, fh = folha.size
    # apaga a paleta de cores e os textos que o gerador desenhou nos cantos
    from PIL import ImageDraw
    d = ImageDraw.Draw(folha)
    branco = (255, 255, 255)
    d.rectangle((0, 0, int(fw * 0.16), int(fh * 0.32)), fill=branco)
    d.rectangle((int(fw * 0.80), 0, fw, int(fh * 0.30)), fill=branco)
    d.rectangle((0, 0, fw, int(fh * 0.085)), fill=branco)
    corpo = recortar(folha.crop((int(fw * 0.04), int(fh * 0.08), int(fw * 0.96), fh)))
    corpo.save(SAIDA / "neutro.webp", "WEBP", quality=90, method=6)
    print(f"{'neutro':12s} {corpo.size}")


if __name__ == "__main__":
    main()
