# Baca & Terjemah

Baca teks **Inggris** atau **Ibrani** lalu terjemahkan ke **bahasa Indonesia** per paragraf, atau cukup blok kalimat yang ingin diterjemahkan. Satu halaman web, tanpa instalasi, tanpa server.

<!-- Taruh rekaman layar di docs/demo.gif, lalu hapus tanda komentar pada baris di bawah. -->
<!-- ![Demo](docs/demo.gif) -->

**Demo langsung:** `https://andysaktia.github.io/translate-id/` (ganti `andysaktia` dengan nama akun GitHub-mu setelah GitHub Pages aktif)

## Fitur

- **Terjemah per paragraf.** Ketuk ikon di akhir paragraf, terjemahan mengembang di bawahnya.
- **Blok teks untuk menerjemahkan.** Pilih kata atau kalimat, lalu ketuk tombol *Terjemahkan*.
- **Deteksi bahasa otomatis** (Inggris/Ibrani) dengan tata letak kanan-ke-kiri untuk Ibrani.
- **Nikud dan ta'amim dibuang** sebelum dikirim, supaya teks Ibrani bervokal terjemah lebih baik.
- **Terjemahkan semua** dengan tombol berhenti dan perkiraan kuota sebelum mulai.
- **Tempel teks sendiri**, paragraf dipisah baris kosong (atau satu baris per ayat).
- **Cache di browser.** Paragraf yang pernah diterjemahkan tidak memakai kuota lagi.
- **Indikator kuota harian** berbentuk lingkaran progres.
- **Mode gelap otomatis**, mendukung layar sentuh, keyboard, dan pembaca layar.

## Cara pakai

Buka `index.html` langsung di browser, atau jalankan server statis apa pun:

```bash
python3 -m http.server 8000
# lalu buka http://localhost:8000
```

Untuk menaikkan kuota harian dari 5.000 menjadi 50.000 karakter, klik **Pengaturan** dan isi email valid. Email hanya disimpan di browser-mu (`localStorage`) dan dikirim ke MyMemory sebagai parameter `de`.

## Struktur

```
index.html          kerangka halaman
css/style.css       seluruh gaya
js/config.js        konstanta, pengaturan email, helper DOM
js/data.js          artikel contoh (Inggris dan Ibrani)
js/text.js          deteksi bahasa, pembersihan nikud, pemecah teks
js/cache.js         cache terjemahan di localStorage
js/quota.js         pelacak dan indikator kuota
js/translate.js     panggilan API MyMemory
js/reader.js        render paragraf dan tombol terjemah
js/tools.js         terjemahkan semua, tempel teks sendiri
js/selection.js     terjemah teks yang diblok
js/settings.js      pengaturan email
js/main.js          titik masuk
```

Skrip dimuat sebagai skrip biasa (bukan modul ES) supaya `index.html` tetap bisa dibuka langsung dari berkas tanpa server. Urutan pemuatan di `index.html` penting.

## Deploy ke GitHub Pages

1. Unggah semua berkas ke repo.
2. Buka **Settings → Pages**.
3. Pada *Build and deployment*, pilih **Deploy from a branch**, branch `main`, folder `/ (root)`, lalu **Save**.

## Keterbatasan

- Terjemahan mesin dari [MyMemory](https://mymemory.translated.net/) (gratis, kuota harian terbatas). Hasilnya bisa kurang akurat, terutama untuk Ibrani klasik.
- Penghitung kuota hanyalah perkiraan dari perangkat ini.
- Font dimuat dari Google Fonts (Figtree, Literata, Frank Ruhl Libre; semuanya berlisensi SIL OFL). Tanpa internet, halaman memakai font bawaan sistem.

## Rencana

- [ ] Salin dan ekspor terjemahan (Markdown/TXT dwibahasa)
- [ ] Penyedia terjemahan yang bisa diganti
- [ ] Muat teks dari berkas `.txt` atau URL
- [ ] Ambil teks dari Sefaria berdasarkan referensi
- [ ] PWA untuk pemakaian offline
- [ ] Pengaturan ukuran font dan tema

## Lisensi

[MIT](LICENSE)

---

## English summary

A single-page, zero-dependency reader that translates English and Hebrew text into Indonesian paragraph by paragraph, or for any text you select. It auto-detects the language, handles RTL Hebrew (stripping niqqud before translating), chunks requests to fit the MyMemory API limits, caches results in `localStorage`, and tracks the free daily quota. Open `index.html` in a browser or host it on GitHub Pages.
