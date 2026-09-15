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
| `scripts/build-images.py` | İllüstrasyonun sayfa türevlerini üretir |
| `assets/logo.png` | Uygulama ikonu, kaynak dosya (1254×1254) |
| `assets/bilgin-karakterler.png` | Marka illüstrasyonu, kaynak dosya (1536×1024) |
| `assets/logo-192.png`, `logo-384.png` | Sayfadaki ikon, 1x / 2x |
| `assets/apple-touch-icon.png`, `favicon-32.png` | Favicon ve iOS ana ekran ikonu |
| `assets/karakterler-1000.png`, `karakterler-1600.png` | İllüstrasyonun sayfa boyutları |
| `assets/fonts/*.woff2` | Baloo 2 (başlık) ve Nunito (gövde), repoya konulmuş |

## Çalıştırma

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Görsel türevlerini yeniden üretme

Kaynak dosyaları ya da arka plan rengini değiştirirseniz illüstrasyonun türevlerini
yeniden üretin. `scripts/build-images.py` bunu yapar:

```bash
pip install Pillow numpy
python3 scripts/build-images.py
```

Script üç şeyi halleder:

1. **Kırpma** — illüstrasyonun çevresindeki beyaz boşluk atılır.
2. **Zemin eşitleme** — ölçülen zemin rengi, sayfa arka planına (`--cream`) birebir
   eşitlenir. Şeffaflık kullanılamaz: illüstrasyonda çocuğun pantolonu gibi giysiler
   zeminle *tam olarak aynı* renktedir (`#FDFDFD`) ve zemine değdikleri için hiçbir
   eşik veya bağlı bileşen analizi onları ayıramaz — denendiğinde pantolon siliniyor.
3. **Kenar yumuşatma** — görselin çevresine 48 piksel pay eklenir ve alfa bu bantta
   sıfıra iner. Renk ileride kayarsa keskin bir dikdörtgen kenarı oluşmaz.

Kuantalama sonrası zemine yakın palet girdileri hedef renge sabitlenir; aksi halde
tek birimlik kayma bile geniş düz alanda gözle görülür bir kutu bırakıyor.

Arka plan rengini değiştirirken `styles.css` içindeki `--cream` ile script'teki
`CREAM` değerini birlikte güncelleyin.

## Yazı tipleri

Başlık **Baloo 2 800**, gövde **Nunito**. İkisi de Google Fonts'tan indirilip
`assets/fonts/` altına konuldu — sayfa hiçbir dış isteğe çıkmıyor. `latin` ve
`latin-ext` alt kümeleri ayrı dosyalar; `unicode-range` sayesinde tarayıcı yalnızca
gerekeni indirir. Türkçe karakterler (ğ ş ı İ ç ö ü) `latin-ext` içinde.

Yazı tipini değiştirirken `assets/fonts/` içindeki dosyayı, `styles.css` başındaki
`@font-face` bloklarını ve `index.html` içindeki `preload` satırlarını birlikte
güncelleyin.

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
