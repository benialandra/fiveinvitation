# Deployment Guide: Eterna Wedding UI

Proyek ini dibangun berdasarkan arsitektur Full-Stack React + Express Backend untuk mensimulasikan lingkungan Next.js App Router di ekosistem platform yang digunakan (Vite). Aplikasi ini sudah disesuaikan agar berjalan selayaknya aplikasi Next.js dan 100% siap disebarkan ke production.

## 1. Setup Supabase
1. Buat project baru di [Supabase](https://supabase.com/).
2. Masuk ke **SQL Editor** di dashboard Supabase.
3. Copy isi file `supabase_schema.sql` yang ada di root project ini, lalu jalankan/run.
4. Ini akan membuat tabel `orders`, `guest_books`, `rsvp` dan mengkonfigurasi RLS (Row Level Security).
5. Aktifkan **Realtime** di Dashboard > Database > Replication. Aktifkan tabel `guest_books` untuk listen.
6. Catat `URL` dan `anon/public` key Anda dari menu Project Settings > API.

## 2. Setup Midtrans
1. Daftar/Login ke [Midtrans Dashboard](https://dashboard.midtrans.com/).
2. Ubah environment ke **Sandbox** untuk testing.
3. Ambil `Client Key` dan `Server Key` dari pengaturan Access Keys.
4. Konfigurasi **Payment Notification URL** (Webhook) di Midtrans:
   - Ke Settings > Configuration > Payment Notification URL.
   - Isi dengan: `https://domain-anda.com/api/webhook/midtrans`.

## 3. Deployment ke Vercel
Meski project ini terintegrasi Express backend via AI Studio, Vercel mendukung project struktur Vite. Jika Anda mendeploy ini ke platform yang murni Serverless (spesifik Next.js API Routes), Anda dapat memisahkan folder `server.ts` menjadi folder `/api` khusus Vercel Serverless Functions.

Atau deploy ke Render/Railway yang mensupport native Node.js Express fullstack apps secara out-of-the-box (lebih direkomendasikan):

1. Push repository ke **GitHub**.
2. Buka Render / Railway / Vercel.
3. Import repository GitHub.
4. Set Build Command: `npm run build`
5. Set Start Command: `npm start`
6. Masukkan semua variable yang ada.

## Environment Variables yang Wajib Ada
```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_MIDTRANS_CLIENT_KEY=...
MIDTRANS_SERVER_KEY=...
MIDTRANS_IS_PRODUCTION=false
```
