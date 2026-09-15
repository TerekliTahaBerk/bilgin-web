# bilgin — yayın öncesi tanıtım sitesi

YKS, LGS, KPSS, ALES ve YDS/YÖKDİL için hazırlanan **bilgin** mobil uygulamasının
oyunlaştırılmış tanıtım sitesi. Bağımlılık yok; saf HTML, CSS ve lokal JavaScript.

Sayfa; ürün akışı, sınav kapsamı, oyunlaştırma mekanikleri, çalışan örnek egzersiz,
Free/Premium karşılaştırması ve yayın öncesi SSS bölümlerinden oluşur.

## Dosyalar

| Dosya | İçerik |
| --- | --- |
| `index.html` | Sayfanın tamamı |
| `styles.css` | Tüm stiller; marka renkleri en üstteki `:root` değişkenlerinde |
| `script.js` | Mini egzersiz durumu, sorular ve footer yılını yönetir |
| `scripts/build-images.py` | İllüstrasyonun sayfa türevlerini üretir |
| `assets/logo.png` | Uygulama ikonu, kaynak dosya (1254×1254) |
| `assets/bilgin-karakterler.png` | Marka illüstrasyonu, kaynak dosya (1536×1024) |
| `assets/logo-192.png`, `logo-384.png` | Sayfadaki ikon, 1x / 2x |
| `assets/apple-touch-icon.png`, `favicon-32.png` | Favicon ve iOS ana ekran ikonu |
| `assets/karakterler-1000.png`, `karakterler-1600.png` | İllüstrasyonun sayfa boyutları |
| `assets/fonts/*.woff2` | Baloo 2 (başlık) ve Nunito (gövde), repoya konulmuş |
| `assets/telefonlar-*.webp` | Hero mockup’ının responsive türevleri |
| `assets/paylasim.png` | 1200×630 sosyal paylaşım görseli |
| `robots.txt`, `sitemap.xml` | Vercel alan adına göre yayın öncesi SEO dosyaları |

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

## Mini egzersizi güncelleme

Beş örnek soru `script.js` içindeki `questions` nesnesinde tutulur. Her soru `subject`,
`text`, `answers`, `correct` ve `explanation` alanlarını içerir. Demo sonucu bellekte
tutulur; sunucuya, çereze veya `localStorage`’a yazılmaz.

Egzersiz türleri `activities` nesnesinde tanımlıdır. Boşluk doldurma, cümle kurma ve
eşleştirme türlerinde seçenekler her açılışta karıştırılır (`shuffledOrder`): kaynak
sırasıyla verildiklerinde doğru yanıt listeden okunabiliyordu. Bu yüzden `activities`
içine yeni seçenek eklerken sırayı önemsemeyin; `correct` alanı değeri tutar, indisi değil.

## Özelleştirme

- **Renkler:** `styles.css` içindeki `:root` bloğu.
- **Yayın öncesi CTA:** `#ornek-egzersiz` bölümüne gider ve mağaza bağlantısı içermez.
- **Lansman geçişi:** Uygulama mağazalarda yayınlandığında CTA metinleri gerçek App Store /
  Google Play adresleriyle değiştirilmeli; “Yakında” metinleri kaldırılmalı.
- **SEO alan adı:** `index.html`, `robots.txt` ve `sitemap.xml` içindeki
  `https://bilgin-web.vercel.app/` adresini gerçek üretim alan adıyla değiştirin.

## Vercel'e deploy

Proje statik olduğu için build adımı yok. `vercel.json` framework algılamasını kapatır,
kök dizini çıktı dizini olarak ayarlar ve cache/güvenlik başlıklarını tanımlar.

1. [vercel.com/new](https://vercel.com/new) → bu repoyu içe aktar.
2. Framework Preset: **Other**; Build ve Install Command boş, Output Directory `.`.
3. Deploy. Sonraki her `main` push'u production'a, diğer dallar önizlemeye gider.

Özel alan adı için Vercel projesinde Settings → Domains.

## Lansman öncesi kontrol listesi

- Gerçek App Store ve Google Play URL’lerini ekle.
- Gizlilik ve kullanım koşulları metinlerini onayla ve footer’a bağla.
- `canonical`, `og:url`, `robots.txt` ve `sitemap.xml` alan adını güncelle.
- Mobil Safari/Chrome ve masaüstü tarayıcılarda demo, SSS ve bölüm bağlantılarını tekrar test et.
