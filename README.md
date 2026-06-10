# FiveInvitation - Premium Wedding Invitations

Platform pembuatan undangan pernikahan digital modern dan interaktif, dirancang secara khusus bagi para calon pengantin untuk merayakan momen spesial mereka dengan elegan, cepat, dan mudah diakses dari perangkat apapun.

FiveInvitation diciptakan menggunakan konsep Full-Stack Web Application modern, menyediakan tidak hanya antarmuka bagi pembeli tetapi juga **Dashboard Admin** yang kaya fitur, sistem **Pembayaran Otomatis** via Midtrans, serta integrasi Database menggunakan **Supabase**.

## ✨ Fitur Utama

### 🛍️ Client / Customer Facing
- **Pilihan Tema Elegan:** Beragam pilihan tema undangan dengan variasi desain elegan (Dark Premium, Floral Blossom, dll).
- **Preview Tema Interaktif:** Pengguna bisa melihat demonya secara real-time sebelum memilih.
- **Form Pemesanan Lengkap:** Dukungan pengisian langsung data mempelai, event (akad & resepsi), dan galeri foto.
- **Pembayaran Terotomatisasi:** Terintegrasi langsung dengan payment gateway **Midtrans** untuk dukungan berbagai metode pembayaran (GoPay, VA, Kartu Kredit, dll).
- **Pelacakan Pesanan:** Tracking status pesanan dengan menginputkan "Nomor Order".

### ⚙️ Admin Dashboard
- **Statistik & Laporan:** Dashboard dengan visualisasi grafik (menggunakan `recharts`) untuk melihat performa penjualan (sales analytics).
- **Manajemen Tema (CMS):** Create, update, atau sesuaikan tema secara dinamis, termasuk dukungan **Upload File Komponen (.tsx)** langsung dari Dashboard!
- **Manajemen Order:** Melihat order masuk, mengubah data order klien, dan preview hasil pesanan klien.
- **Sistem Penyimpanan (Storage):** Secara default menggunakan penyimpanan lokal server (via Multer) pada direktori `public/uploads` yang dikelola secara terpusat.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React 19, React Router, Vite, Tailwind CSS, Framer Motion, Recharts.
- **Backend:** Node.js, Express (with Vite Middleware untuk Development mode), TypeScript.
- **Database:** Supabase (PostgreSQL).
- **Payment Gateway:** Midtrans Client SDK.
- **Peralatan Tambahan:** Multer (File Upload Lokal), Node-Cron (Penjadwalan Pengingat Pembayaran), Nodemailer (Pengiriman Email Notifikasi).
- **Build System:** Esbuild (Transpile Tipe ESM ke CommonJS untuk Backend), Vite Build (Front-End Static).

---

## 🚀 Cara Menjalankan Project (Local Development)

### 1. Kebutuhan Sistem
Pastikan Anda telah menginstal lingkungan berikut:
- **Node.js** versi 18 atau ke atas
- Akun **Supabase** (Database)
- Akun **Midtrans** (Sandbox/Production Mode)

### 2. Instalasi Variabel Lingkungan (.env)
Buatlah file `.env` (atau Anda bisa merujuk ke file `.env.example` yang ada) di root direktori project:

```env
# SERVER INFO
PORT=3000
VITE_APP_URL=http://localhost:3000

# SUPABASE 
VITE_SUPABASE_URL=https://[PROJECT-ID].supabase.co
VITE_SUPABASE_ANON_KEY=[ANON-KEY]

# MIDTRANS (Payment Gateway)
MIDTRANS_SERVER_KEY=[SERVER-KEY-ANDA]
VITE_MIDTRANS_CLIENT_KEY=[CLIENT-KEY-ANDA]
MIDTRANS_IS_PRODUCTION=false

# EMAIL NOTIFICATION (Nodemailer - Opsional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### 3. Setup Database (Supabase)
Jalankan file `supabase_schema.sql` di SQL Editor pada proyek Supabase Anda. Ini akan secara otomatis membuat tabel:
- `orders` (Data relasi order/pesanan)
- `themes` (Data master untuk menampung seluruh tema digital)

### 4. Instalasi Dependency
Buka terminal Anda dan instal seluruh dependency proyek:

```bash
npm install
```

### 5. Jalankan Development Server

```bash
npm run dev
```

Secara default, aplikasi akan berjalan secara Full-Stack pada port `3000`. Akses `http://localhost:3000` melalui browser web Anda. 

## 📦 Tahapan Deployment (Production)

Proyek ini telah dikonfigurasi untuk environment cloud-native menggunakan pendekatan single output bundle:

1. Eksekusi perintah build:
   ```bash
   npm run build
   ```
   *Perintah ini akan menggunakan vite untuk membuat frontend static file di folder `/dist`, lalu esbuild akan memaketkan `server.ts` menjadi `dist/server.cjs`.*

2. Menjalankan versi production lokal atau di Cloud (Vercel/Railway/Render):
   ```bash
   npm run start
   ```
   *(Catatan: karena fitur upload menggunakan disk lokal, pastikan layanan cloud Anda mendukung Persistent Disk (Volume) agar gambar tidak hilang saat instance direstart).*

## 📄 Struktur Proyek
```text
/
├── public/                 # Static assets & direktori uploads lokal (public/uploads)
├── src/                    
│   ├── components/         # Komponen React yang dapat digunakan ulang
│   ├── lib/                # Library & Konfigurasi klien (Supabase, clsx, dll)
│   ├── pages/              # Halaman Aplikasi Utama (Home, Admin, Themes, Order)
│   ├── themes/             # Konfigurasi Template/Tema dan Tampilan Tema Actual
│   ├── App.tsx             # Main React Router Component
│   ├── main.tsx            # Titik awal masuk Frontend
│   └── index.css           # Konfigurasi Global CSS (Tailwind)
├── server.ts               # Titik awal Backend (API Routes Express & Vite Proxy)
└── package.json            # Konfigurasi npm
```

## 🤝 Lisensi
Dibuat untuk kebutuhan pribadi/komersil oleh tim kreator FiveInvitation.

