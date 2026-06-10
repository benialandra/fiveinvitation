# Deployment Guide: FiveInvitation (Fullstack)

Proyek ini dibangun berdasarkan arsitektur Full-Stack React + Express Backend. Aplikasi ini dikonfigurasi menggunakan Vite (dalam mode development) dan Esbuild (untuk memaketkan backend saat production), 100% siap disebarkan ke production.

## 1. Setup Supabase
1. Buat project baru di [Supabase](https://supabase.com/).
2. Masuk ke **SQL Editor** di dashboard Supabase.
3. Copy isi file `supabase_schema.sql` yang ada di root project ini, lalu jalankan/run.
4. Ini akan membuat tabel `orders` dan `themes`.
5. Catat `URL` dan `anon/public` key Anda dari menu Project Settings > API.

## 2. Setup Midtrans
1. Daftar/Login ke [Midtrans Dashboard](https://dashboard.midtrans.com/).
2. Ubah environment ke **Sandbox** untuk testing (atau Production untuk live).
3. Ambil `Client Key` dan `Server Key` dari pengaturan Access Keys.
4. Konfigurasi **Payment Notification URL** (Webhook) di Midtrans:
   - Ke Settings > Configuration > Payment Notification URL.
   - Isi dengan: `https://domain-anda.com/api/webhook/midtrans`.

## 3. Deployment ke Render / Railway (Direkomendasikan)
Platform seperti Render atau Railway sangat direkomendasikan karena mendukung NodeJS Fullstack (Express + SPA) secara native.

1. Push repository ke **GitHub**.
2. Buka Render / Railway.
3. Buat Web Service baru dan import repository GitHub Anda.
4. Set Build Command: `npm install && npm run build`
5. Set Start Command: `npm run start`
6. Tambahkan semua Environment Variables (lihat di bawah).

> [!WARNING]
> **Penting tentang Storage:** Karena proyek ini menggunakan sistem **Multer** untuk upload file secara lokal ke dalam folder `public/uploads`, pastikan Anda **memasang Persistent Volume (Disk)** di layanan hosting Anda (misal: Render Disks atau Railway Volumes) dan me-mountnya ke path `/app/public/uploads` atau direktori eksekusi Anda. Jika tidak, file gambar yang diunggah akan hilang setiap kali server restart!

## 4. Environment Variables yang Wajib Ada
Isikan variabel berikut pada dashboard hosting Anda:

```env
# Frontend/App Info
PORT=3000
VITE_APP_URL=https://domain-anda.com

# Supabase (Database)
VITE_SUPABASE_URL=https://[YOUR_PROJECT_ID].supabase.co
VITE_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]

# Midtrans
MIDTRANS_SERVER_KEY=[YOUR_SERVER_KEY]
VITE_MIDTRANS_CLIENT_KEY=[YOUR_CLIENT_KEY]
MIDTRANS_IS_PRODUCTION=false

# Email (SMTP) - Wajib untuk pengiriman notifikasi/pengingat pembayaran
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```
