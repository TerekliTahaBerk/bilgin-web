# bilgin — tek sayfa tanıtım sitesi

YKS, LGS, KPSS ve YDS/YÖKDİL için hazırlanan **bilgin** mobil uygulamasının tek sayfalık
tanıtım sitesi. Bağımlılık yok; saf HTML, CSS ve birkaç satır JavaScript.

## Dosyalar

| Dosya | İçerik |
| --- | --- |
| `index.html` | Sayfanın tamamı (hero, iki mod, sınavlar, seri/XP, sayılar, SSS, CTA, footer) |
| `styles.css` | Tüm stiller; marka renkleri en üstteki CSS değişkenlerinde |
| `script.js` | Yıl güncelleme, SSS akordeonu, scroll ile beliren bölümler |
| `assets/logo.svg` | Maskot logo (favicon ve uygulama simgesi olarak da kullanılıyor) |

## Çalıştırma

```bash
python3 -m http.server 8000
# http://localhost:8000
```

Statik olduğu için GitHub Pages, Netlify veya Vercel'e olduğu gibi yüklenebilir.

## Özelleştirme

- **Renkler:** `styles.css` içindeki `:root` bloğu (`--green`, `--green-l`, `--cream`).
- **Mağaza linkleri:** `index.html` içindeki `.store` bağlantılarının `href` değerleri
  şu an `#indir`; App Store / Google Play adresleriyle değiştirin.
- **Logo:** `assets/logo.svg` dosyasını kendi dosyanızla değiştirmeniz yeterli.
- **Metinler:** Sayılar ve sınav açıklamaları örnek değerlerdir, gerçek verilerle güncelleyin.
