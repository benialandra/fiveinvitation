# FiveInvitation - Premium Digital Invitation Platform

Platform pembuatan undangan digital mandiri dengan integrasi instan, pembayaran otomatis (Midtrans), dan kustomisasi dinamis. Dibangun menggunakan teknologi modern React, Vite, TailwindCSS, dan Node.js/Supabase.

## 📸 Preview Tema (Playwright Captures)

Berikut adalah beberapa hasil capture tema premium yang berjalan di platform ini:

<div align="center">
  <img src="public/screenshots/luxury01.png" alt="Luxury 01 - Royal Palace" width="300" />
  <img src="public/screenshots/luxury02.png" alt="Luxury 02 - Private Quarters" width="300" />
  <img src="public/screenshots/luxury03.png" alt="Luxury 03 - Haute Couture" width="300" />
</div>

> *Catatan: Gambar di atas diambil secara otomatis menggunakan browser engine Playwright MCP.*

## 🏗 Struktur Proyek (Arsitektur)

Proyek ini menggunakan arsitektur modular yang memisahkan antara Layout utama, halaman bisnis (Pages), sistem rendering Tema (Themes), dan backend API.

- **`/src/pages`**
  Berisi halaman-halaman utama aplikasi seperti `Home`, `Themes` (Katalog), `Order` (Pemesanan), `Track` (Status Order), dan `Preview` (Live Demo).
- **`/src/themes`**
  Ini adalah inti dari *engine* undangan. Folder ini menyimpan semua *template* undangan premium seperti seri `Luxury`, `Floral`, `Minimalist`, dll.
  - `registry.tsx`: Bertindak sebagai pendaftar (registry) untuk mengkatalogkan tema mana yang aktif, lengkap dengan referensi komponen, harga, dan metadata-nya.
- **`/src/layouts`**
  Berisi `Layout.tsx` yang menangani UI Navbar, transisi mode gelap/terang, dan lokalisasi bahasa untuk halaman publik.
- **`/src/components/Interactive`**
  Menampung *micro-components* yang ditanamkan ke dalam tema, seperti sistem *smooth scrolling* (Lenis) dan animasi performa tinggi (GSAP/Framer Motion).
- **`/server.ts`**
  Backend Express.js (`tsx server.ts`) yang menangani pendaftaran tema dinamis, otentikasi admin, pengiriman OTP email, dan integrasi dengan API eksternal (Supabase & Midtrans).

## 🚀 Cara Menjalankan (Local Development)

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Jalankan Server Mode Dev**
   ```bash
   npm run dev
   ```
   *Aplikasi frontend dan backend akan berjalan serentak di `http://localhost:3000` dengan dukungan Hot Module Replacement (HMR) dari Vite.*

3. **Build untuk Produksi**
   ```bash
   npm run build
   npm start
   ```

## 🌐 Rekomendasi Deployment

Karena platform ini memiliki frontend React dan backend kustom Node.js/Express (`server.ts`), model deployment yang disarankan:

- **Server Backend/Frontend (Node.js):** Layanan seperti **Render**, **Railway**, atau VPS konvensional untuk menjalankan proses `npm start` secara terus-menerus.
- **Database:** **Supabase** (PostgreSQL gratis hingga 500MB).
- **Storage:** Supabase Storage (atau diatur untuk disimpan secara lokal di `/public/uploads/` sesuai konfigurasi saat ini).
- **Payment Gateway:** **Midtrans** (Sudah terintegrasi untuk instant-payment).
