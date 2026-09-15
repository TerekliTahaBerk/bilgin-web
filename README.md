# bilgin — tek sayfa tanıtım sitesi

YKS, LGS, KPSS ve YDS/YÖKDİL için hazırlanan **bilgin** mobil uygulamasının tek sayfalık
tanıtım sitesi. Bağımlılık yok; saf HTML, CSS ve tek satır JavaScript.

Sayfa yalnızca şunlardan oluşur: uygulama ikonu, tanıtım cümlesi, App Store ve
Google Play butonları, marka illüstrasyonu ve footer.

## Dosyalar

| Dosya | İçerik |
| --- | --- |
| `index.html` | Sayfanın tamamı |
| `styles.css` | Tüm stiller; marka renkleri en üstteki `:root` değişkenlerinde |
| `script.js` | Footer'daki yılı günceller |
| `assets/logo.png` | Uygulama ikonu, kaynak dosya (1254×1254) |
| `assets/bilgin-karakterler.png` | Marka illüstrasyonu, kaynak dosya (1536×1024) |
| `assets/logo-192.png`, `logo-384.png` | Sayfadaki ikon, 1x / 2x |
| `assets/apple-touch-icon.png`, `favicon-32.png` | Favicon ve iOS ana ekran ikonu |
| `assets/karakterler-1000.png`, `karakterler-1600.png` | İllüstrasyonun sayfa boyutları |

## Çalıştırma

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Görsel türevlerini yeniden üretme

Kaynak dosyaları değiştirirseniz sayfadaki türevleri yeniden üretin. İllüstrasyonun
beyaz zemini, krem arka planla birebir aynı renge (`--cream`, `#FBF6EC`) dönüştürülerek
görselin içine işlenir — böylece sayfada kutu kenarı görünmez ve CSS blend moduna
ihtiyaç kalmaz:

```python
from PIL import Image
import numpy as np

CREAM = np.array([251, 246, 236], float)
im = Image.open('assets/bilgin-karakterler.png').convert('RGB')
a = np.asarray(im).astype(int)

# 1) beyaz boşlukları kırp
ys, xs = np.where((255 - a.min(axis=2)) > 10)
pad = 24
cut = np.asarray(im.crop((xs.min()-pad, ys.min()-pad, xs.max()+1+pad, ys.max()+1+pad))).astype(float)

# 2) ölçülen zemin rengini tam olarak kreme eşle
edge = np.concatenate([cut[:3].reshape(-1,3), cut[-3:].reshape(-1,3),
                       cut[:,:3].reshape(-1,3), cut[:,-3:].reshape(-1,3)])
out = Image.fromarray((cut * CREAM / np.median(edge, axis=0)).round().clip(0,255).astype('uint8'))

for w, name in [(1600,'karakterler-1600.png'), (1000,'karakterler-1000.png')]:
    h = round(out.size[1] * w / out.size[0])
    out.resize((w,h), Image.LANCZOS).quantize(colors=200).save(f'assets/{name}', optimize=True)
```

Arka plan rengini değiştirirseniz `CREAM` değerini de güncelleyin, aksi halde
illüstrasyonun zemini sayfayla uyuşmaz.

## Özelleştirme

- **Renkler:** `styles.css` içindeki `:root` bloğu.
- **Mağaza linkleri:** `index.html` içindeki `.store` bağlantılarının `href` değerleri
  şu an `#`; App Store / Google Play adresleriyle değiştirin.

## Vercel'e deploy

Proje statik olduğu için build adımı yok. `vercel.json` framework algılamasını kapatır,
kök dizini çıktı dizini olarak ayarlar ve cache/güvenlik başlıklarını tanımlar.

1. [vercel.com/new](https://vercel.com/new) → bu repoyu içe aktar.
2. Framework Preset: **Other**; Build ve Install Command boş, Output Directory `.`.
3. Deploy. Sonraki her `main` push'u production'a, diğer dallar önizlemeye gider.

Özel alan adı için Vercel projesinde Settings → Domains.
