# details.DHCIP

Halaman detail proyek **DHCIP — Damri Human Capital Intelligence Platform**, yang di-host di GitHub Pages dari repositori ini. Halaman ini ditautkan dari kartu DHCIP pada [profil GitHub saya](https://github.com/WaskithoCitoAdiwiguno).

## Isi

- `index.html` — halaman detail (markup saja; styling dan script terpisah)
- `src/css/style.css` — seluruh styling, termasuk media queries untuk tampilan mobile (breakpoint 900px / 560px / 420px)
- `src/js/main.js` — slider tangkapan layar (autoplay 10 detik), lightbox, dan toggle bahasa ID/ENG
- `src/img/` — tangkapan layar modul DHCIP yang dipakai di halaman dan slider
- `README.md` — file ini

## Cara Deploy ke GitHub Pages

1. Push seluruh isi folder ini ke root branch `main` repositori `details.DHCIP`.
2. Buka **Settings → Pages** di repositori tersebut.
3. Pada **Build and deployment → Source**, pilih **Deploy from a branch**.
4. Pilih branch `main` dan folder `/ (root)`, lalu klik **Save**.
5. Tunggu 1–2 menit, halaman akan tersedia di:

   **https://waskithocitoadiwiguno.github.io/details.DHCIP/**

## Catatan

- Nama repositori berisi titik (`details.DHCIP`), jadi URL Pages memakai `details.DHCIP` apa adanya (GitHub menerima titik pada nama repo untuk Pages).
- `index.html` memuat asset dari `src/` — pastikan folder `src/` ikut ter-push (struktur folder: `index.html` di root, CSS/JS/gambar di dalam `src/`).
- Halaman responsif: tata letak menyesuaikan ponsel (grid 1 kolom, tombol full-width, slider dengan panah kecil) berkat media queries di `style.css`.
- Jika ingin memakai custom domain (misal `dhcip.my.id` atau subdomain lain), tambahkan file `CNAME` berisi domain tersebut lalu set di Settings → Pages → Custom domain.
