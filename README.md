# FiveInvitation - Premium Digital Invitation Platform

Platform pembuatan undangan digital mandiri dengan integrasi instan, pembayaran otomatis (Midtrans), dan kustomisasi dinamis. Dibangun menggunakan teknologi modern React, Vite, TailwindCSS, dan Supabase.

---

## 🏗 Struktur Proyek (Arsitektur)

Proyek ini menggunakan arsitektur modular yang memisahkan antara Layout utama, halaman bisnis (Pages), sistem rendering Tema (Themes), dan komponen interaktif.

- **`/src/pages`**
  Berisi halaman-halaman utama aplikasi seperti `Home`, `Themes` (Katalog), `Order` (Pemesanan), `Track` (Status Order), dan `Preview` (Live Demo).
- **`/src/themes`**
  Ini adalah inti dari *engine* undangan. Folder ini menyimpan semua *template* undangan premium.
  - `registry.tsx`: Bertindak sebagai *database lokal* untuk mengkatalogkan tema mana yang aktif, lengkap dengan harga dan metadata-nya.
  - `MasterTheme.tsx`: Merupakan komponen dinamis yang membangun undangan dari objek JSON, berguna jika Anda ingin membuat tema langsung dari Admin Panel tanpa *coding*.
  - File seperti `DarkPremium.tsx` dsb adalah tema kustom (Hardcoded Components) yang memiliki animasi GSAP/Framer khusus.
- **`/src/layouts`**
  Berisi `Layout.tsx` yang menangani UI Navbar, transisi mode gelap/terang, dan lokalisasi bahasa untuk halaman publik.
- **`/src/components/Interactive`**
  Menampung *micro-components* yang ditanamkan ke dalam tema, seperti `AudioController` (pemutar musik) dan `SmoothScrollLayout` (efek scroll Lenis).

### Alur Data (Business Process)
1. **Pemilihan Tema**: Pengunjung melihat katalog di `/themes`, yang di-generate langsung dari `registry.tsx`.
2. **Preview**: Saat pengunjung memencet "Live Demo", `/pages/Preview.tsx` akan memuat komponen tema (misal `OceanBreeze`) dan mengisi *dummy data* ke dalamnya.
3. **Pemesanan**: Data form dari `/order` akan dikirim dan disimpan ke **Supabase** (Tabel `orders`). Status awalnya adalah `pending`.
4. **Pembayaran**: Sistem (ideal-nya melalui Midtrans backend) menangani pembayaran dan mengubah status menjadi `active`.
5. **Publish**: Tamu undangan dapat mengakses `/invitation/:slug`, dan komponen `Invitation.tsx` akan mengambil data dari database lalu me-render Tema yang dipilih.

---

## 🛠 Penambahan Tema Baru (Apakah Harus Di-Compile Ulang?)

Ini adalah pertanyaan penting! Jawabannya **tergantung pada jenis tema yang Anda buat**.

**Skenario 1: Tema Kustom (.tsx) seperti `UltraPremiumInteractive.tsx`**
Jika Anda menambahkan file `.tsx` baru dengan animasi Framer Motion/GSAP yang unik, maka Anda **HARUS** melakukan *re-compile* dan *re-deploy*. Mengapa? Karena file `.tsx` adalah *source code* React yang harus dibundle oleh Vite agar bisa dirender di browser.
*Cara menambahkan:*
1. Buat file `TemaBaru.tsx` di folder `src/themes`.
2. Daftarkan di dalam `src/themes/registry.tsx`.
3. Push/Deploy ulang ke server.

**Skenario 2: Menggunakan `MasterTheme` (Dynamic JSON Configuration)**
Jika Anda tidak ingin meng-compile ulang, Anda bisa menggunakan `MasterTheme.tsx`. Tema ini tidak di-hardcode, melainkan membaca `config_json` (berupa JSON) dari Supabase. Anda dapat menambahkan tema baru hanya dengan meng-insert baris baru di database dengan *layout schema* JSON yang dikenali oleh `MasterTheme`.

---

## 🚀 Rekomendasi Deployment (Hosting Gratisan)

Karena platform ini dibangun menggunakan **Vite (React)** sebagai frontend, Anda bisa menggunakan layanan CDN & Edge Hosting gratis yang paling populer dan handal untuk *production*.

### 1. Vercel (Sangat Direkomendasikan)
Vercel adalah platform terbaik untuk aplikasi React modern.
- **Biaya**: **GRATIS** (Hobby Plan). Sangat cukup untuk trafik undangan digital.
- **Keunggulan**: Setup super instan. Anda hanya perlu login menggunakan GitHub, import repositori `fiveinvitation`, dan Vercel akan meng-compile dan meng-hosting aplikasi secara otomatis setiap kali ada update.
- **Performa**: Edge network global, otomatis optimasi gambar dan aset.

### 2. Cloudflare Pages
- **Biaya**: **GRATIS** dengan batasan yang sangat longgar (unlimited bandwidth).
- **Keunggulan**: Memiliki CDN tercepat di dunia. Sangat tahan terhadap serangan DDoS dan load tinggi jika undangan viral.

### Bagaimana dengan Backend (Database & Gambar)?
Proyek ini sudah terintegrasi dengan **Supabase**.
- Supabase memiliki versi **Gratis (Free Tier)** yang menyediakan Database PostgreSQL 500MB dan Storage Bucket 1GB.
- File foto dari pengguna saat mengedit undangan akan otomatis masuk ke Supabase Storage (`fiveinvitation-bucket`).

**Kesimpulan Deployment:**
- Frontend: **Vercel**
- Backend/Database: **Supabase** (Sudah terhubung)
- Payment Gateway: **Midtrans**

Perpaduan ketiga layanan di atas memungkinkan Anda menjalankan bisnis undangan digital ini dengan modal **Rp 0** untuk biaya server di bulan-bulan awal!
