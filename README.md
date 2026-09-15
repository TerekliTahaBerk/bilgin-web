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

## Vercel'e deploy

Proje statik olduğu için build adımı yok. `vercel.json` framework algılamasını kapatır,
kök dizini çıktı dizini olarak ayarlar ve cache/güvenlik başlıklarını tanımlar.

**GitHub üzerinden (önerilen):**

1. [vercel.com/new](https://vercel.com/new) → bu repoyu içe aktar.
2. Framework Preset: **Other**. Build Command ve Install Command boş bırakılır,
   Output Directory `.` olarak kalır — bu değerler zaten `vercel.json` içinde tanımlı.
3. Deploy. Sonraki her `main` push'u production'a, diğer dallar ve PR'lar önizleme
   dağıtımına gider.

**CLI ile:**

```bash
npm i -g vercel
vercel        # önizleme dağıtımı
vercel --prod # production
```

Özel alan adı eklemek için Vercel projesinde Settings → Domains.
