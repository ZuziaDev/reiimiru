# reiimiru

Kick yayıncısı reiimiru'nun kişisel sitesi: [kick.com/reiimiru](https://kick.com/reiimiru) · [instagram.com/reiimiru](https://www.instagram.com/reiimiru/)

## Neler var

- Mor tonlarında "liquid glass" tema, açık ve koyu mod (sağ üstteki düğme, tercih tarayıcıda saklanır).
- Hero arka planında three.js sahnesi: yüzen kalpler ve şekerler. Fareyi takip eder, tıklayınca zıplarlar.
- Kaydırdıkça çalışan animasyonlar (framer-motion): kelime kelime başlıklar, solan hero, parallax.
- Sayfada gezinen kedi: yürür, oturur, uyur, miyavlar, yün yumağıyla oynar. Tıklayınca miyavlar.
- Hareket azaltma tercihi açıksa animasyonlar kapanır ve kedi gizlenir.

## Çalıştırma

```bash
npm install
npm run dev
```

Site `http://localhost:3000` adresinde açılır. Yayına hazır sürüm için `npm run build`, ardından `npm run start`.

## Yapı

| Yol | İçerik |
| --- | --- |
| `app/page.tsx` | Ana sayfa: hero, hakkımda, projeler, bağlantılar |
| `app/globals.css` | Tema renkleri ve tüm stiller |
| `app/3d/page.tsx` | 3D sahnenin tek başına demo sayfası |
| `components/ThreeScene.tsx` | three.js sahnesi |
| `components/CatPet.tsx` | Gezinen kedi ve davranışları |
| `components/fx/motion.tsx` | Scroll animasyonu bileşenleri |
| `lib/sounds.ts` | Kedi sesleri (miyav havuzu, %10 nadir ses, mırıltı) |
| `public/cat/` | Kedi kareleri ve 12 karelik yürüyüş sprite sheet'i |
| `public/sounds/` | Ses dosyaları |

## İçerik güncelleme

- **Hakkımda metni ve bağlantılar:** `app/page.tsx`.
- **Projeler:** bölüm şu an boş; `app/page.tsx` içindeki "Henüz proje yok." kutusunun yerine eklenir.
- **Renkler:** `app/globals.css` başındaki `:root` (açık) ve `:root[data-theme="dark"]` (koyu) blokları.
- **Yeni miyav sesi:** dosyayı `public/sounds/` altına koy, yolunu `lib/sounds.ts` içindeki `MEOW_SOUNDS` listesine ekle.

## Notlar

- Kedi görselleri yapay zekâ ile üretildi.
- Ses dosyaları üçüncü taraf kaynaklardan; yayına almadan önce lisanslarını kontrol et.
