#!/usr/bin/env python3
"""bilgin illüstrasyonunun sayfada kullanılan türevlerini üretir.

Kaynak: assets/bilgin-karakterler.png
Çıktı:  assets/karakterler-1600.png, assets/karakterler-1000.png

Arka plan rengini değiştirirken styles.css içindeki --cream ile
buradaki CREAM değerini birlikte güncelleyin.
"""
from PIL import Image
import numpy as np
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'assets', 'bilgin-karakterler.png')

CREAM = (250, 249, 246)   # styles.css → --cream #FAF9F6
FEATHER = 48              # kenarların eridiği bant (kaynak ölçeğinde)
SIZES = [(1600, 'karakterler-1600.png'), (1000, 'karakterler-1000.png')]


def main():
    src = Image.open(SRC).convert('RGB')
    a = np.asarray(src).astype(int)

    # 1) çevresindeki beyaz boşluğu at
    ys, xs = np.where((255 - a.min(axis=2)) > 10)
    cut = np.asarray(src.crop((int(xs.min()), int(ys.min()),
                               int(xs.max()) + 1, int(ys.max()) + 1))).astype(float)

    # 2) ölçülen zemini sayfa arka planına birebir eşitle.
    #    Şeffaflık kullanılamıyor: açık renkli giysiler zeminle aynı renkte
    #    (#FDFDFD) ve ona değiyor, ayrılamıyorlar.
    edge = np.concatenate([cut[:2].reshape(-1, 3), cut[-2:].reshape(-1, 3),
                           cut[:, :2].reshape(-1, 3), cut[:, -2:].reshape(-1, 3)])
    baked = (cut * np.array(CREAM, float) / np.median(edge, axis=0)).round().clip(0, 255).astype(np.uint8)
    ch, cw, _ = baked.shape

    # 3) çevreye pay ekle ve alfayı bu bantta sıfıra indir, böylece renk
    #    ileride kayarsa keskin bir dikdörtgen kenarı oluşmaz
    H, W = ch + 2 * FEATHER, cw + 2 * FEATHER
    canvas = np.tile(np.array(CREAM, np.uint8), (H, W, 1))
    canvas[FEATHER:FEATHER + ch, FEATHER:FEATHER + cw] = baked

    yy = np.minimum(np.arange(H), H - 1 - np.arange(H))[:, None]
    xx = np.minimum(np.arange(W), W - 1 - np.arange(W))[None, :]
    alpha = (np.clip(np.minimum(yy, xx) / FEATHER, 0, 1) * 255).round().astype(np.uint8)

    out = Image.fromarray(np.dstack([canvas, alpha]), 'RGBA')

    for width, name in SIZES:
        im = out.resize((width, round(H * width / W)), Image.LANCZOS)
        # FASTOCTREE, alfa kanalını koruyan tek kuantalama yöntemi
        q = im.quantize(colors=200, method=Image.FASTOCTREE)
        # kuantalama zemini bir birim kaydırabiliyor; geniş düz alanda bu bile
        # gözle görülür bir kutu bırakıyor, o yüzden paleti hedefe sabitle
        pal = q.getpalette(rawmode=q.palette.mode)
        step = len(q.palette.mode)
        for i in range(0, len(pal), step):
            if max(abs(pal[i + k] - CREAM[k]) for k in range(3)) <= 3:
                pal[i:i + 3] = list(CREAM)
        q.putpalette(pal, rawmode=q.palette.mode)

        path = os.path.join(ROOT, 'assets', name)
        q.save(path, optimize=True)
        print(f'{name}: {im.size[0]}x{im.size[1]}  {round(os.path.getsize(path) / 1024)} KB')


if __name__ == '__main__':
    main()
