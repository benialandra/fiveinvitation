# FiveInvitation - Premium Wedding Invitations 💍✨

FiveInvitation adalah platform pembuatan undangan pernikahan digital modern, berkinerja tinggi, dan interaktif. Proyek ini tidak sekadar menghasilkan undangan statis, melainkan memberikan pengalaman *Cinematic & Awwwards-winning* melalui *smooth scrolling*, 3D Rendering (WebGL), animasi *parallax*, dan tata letak elegan untuk merayakan momen spesial pengguna.

Selain antarmuka klien (pembeli undangan), platform ini juga mencakup **Dashboard Admin** yang kuat, sistem **Pembayaran Otomatis** (via Midtrans), dan manajemen database (via Supabase).

---

## 🌟 Flow & Alur Sistem

### 1. Alur Klien (Client Flow)
*   **Eksplorasi (Katalog Tema):** Pengguna masuk ke halaman `/themes` untuk menelusuri puluhan tema *ultra-premium* yang dibagi dalam beberapa kategori (*Elegant, Premium, Floral, Rustic*, dll).
*   **Pratinjau Interaktif (Live Preview):** Pengguna mengklik *Preview* untuk melihat undangan secara langsung (`/preview/:themeId`). Halaman ini dilengkapi fitur simulator responsif (mengubah tampilan ke *Mobile, Tablet, atau Desktop*).
*   **Pemesanan (Order Flow):** Pengguna menekan tombol pesan dan diarahkan ke form pemesanan multi-tahap (`/order/:themeId`) untuk mengisi detail mempelai, lokasi (akad & resepsi), kisah cinta, serta mengunggah foto galeri.
*   **Pembayaran Otomatis:** Setelah data lengkap, sistem melakukan komunikasi ke Midtrans. Pengguna dapat memilih pembayaran via VA, E-Wallet (GoPay, OVO), atau QRIS.
*   **Pelacakan (Tracking):** Klien bisa melacak status pesanan (`/track/search`) dengan ID unik mereka untuk mengecek apakah pembayaran berhasil dan melihat pratinjau hasil jadinya.

### 2. Alur Tema (Thematic System Flow)
*   **Registry Terpusat (`src/themes/registry.tsx`):** Jantung dari sistem tema. Tempat di mana seluruh tema didaftarkan berikut harga, meta data, *thumbnail*, dan referensi langsung ke komponen bereksistensi `.tsx`.
*   **Core Interactive Engine (`src/components/Interactive/`):** Menyediakan infrastruktur dapat-digunakan-ulang (*reusable*) bagi tema premium agar tetap ringan (60 FPS):
    *   `SmoothScrollLayout`: Sinkronisasi *Lenis* dengan *GSAP ScrollTrigger* untuk *scroll* ultra-mulus.
    *   `AudioController`: Mengendalikan BGM (musik latar) undangan menggunakan *Howler.js*.
*   **3D / WebGL Processing:** Menggunakan `Three.js` & `React Three Fiber` di dalam tema tertentu (seperti *Japanese Sakura Garden* atau *Ultra Premium Interactive*) untuk efek partikel melayang (bintang, kelopak bunga) tanpa merusak performa *layout* 2D.

### 3. Alur Admin (CMS & Dashboard Flow)
*   **Dashboard (`/admin`):** Dilindungi dengan otentikasi. Admin dapat melihat analitik grafik pendapatan interaktif (menggunakan `recharts`).
*   **Manajemen Tema:** Admin dapat mengubah data tema secara dinamis, mengunggah *thumbnail*, atau menyesuaikan harga langsung. Semua terhubung ke Supabase.
*   **Cloud Storage:** Admin dan klien mengunggah foto (*cover*, *hero*, galeri) yang akan langsung disimpan dan disajikan (*served*) dari **Supabase Storage Bucket** (`fiveinvitation-bucket`).

---

## 🛠️ Tech Stack & Arsitektur

*   **Frontend Core:** React 19, React Router v6, TypeScript.
*   **Styling & UI:** Tailwind CSS, Lucide Icons, Glassmorphism design patterns.
*   **Animation & Interactions:**
    *   **Framer Motion:** Transisi halaman, *micro-interactions*, dan modal masuk.
    *   **GSAP & ScrollTrigger:** Animasi berbasis *scroll* berat (*parallax, reveal, pin, scrub*).
    *   **Lenis:** *Smooth scrolling* yang mulus di semua peramban (*browser*).
    *   **Three.js / React Three Fiber:** Efek 3D WebGL (*background particles*).
*   **Audio Processing:** Howler.js.
*   **Backend & API:** Express.js (Node) dengan integrasi *Vite Middleware* untuk lingkungan lokal, dan `esbuild` untuk pemaketan *Production*.
*   **Database & Storage:** Supabase (PostgreSQL & Supabase Bucket Storage).
*   **Payment Gateway:** Midtrans Node SDK.

---

## 📁 Struktur Direktori Detail

```text
fiveinvitation/
├── public/                 # Aset statis dan indeks root HTML
├── src/                    
│   ├── components/         # Komponen global 
│   │   ├── CustomCursor.tsx        # Pengendali kursor elegan global
│   │   └── Interactive/            # Core Engine (SmoothScrollLayout, AudioController)
│   ├── lib/                # Konfigurasi library pihak ketiga (supabase.ts, clsx)
│   ├── layouts/            # Pembungkus (wrapper) halaman utama (navbar, footer, sidebar admin)
│   ├── pages/              # Halaman tingkat rute (Route-level pages)
│   │   ├── Home.tsx        # Landing Page utama
│   │   ├── Themes.tsx      # Katalog tema digital
│   │   ├── Preview.tsx     # Simulator pratinjau tema dengan toggle device
│   │   ├── Order.tsx       # Form pembelian tema
│   │   ├── Admin.tsx       # CMS dan Grafik Pendapatan
│   │   └── ...
│   ├── themes/             # Semua aset template tema undangan klien
│   │   ├── registry.tsx                 # [PENTING] Titik sentral registrasi semua tema
│   │   ├── MasterTheme.tsx              # Fallback theme generator
│   │   ├── UltraPremiumInteractive.tsx  # Tema dengan efek 3D Bintang
│   │   ├── JapaneseSakuraGarden.tsx     # Tema dengan efek 3D Kelopak Sakura
│   │   ├── CinematicLoveStory.tsx       # Tema ala Trailer Film Romantis
│   │   └── ... (Pilihan tema eksklusif lainnya)
│   ├── App.tsx             # Pengatur Router (React Router DOM)
│   ├── main.tsx            # Titik awal masuk Frontend
│   └── index.css           # Konfigurasi global Tailwind & utilitas CSS interaktif
├── server.ts               # Titik awal backend (Express Server + Midtrans Webhook)
├── supabase_schema.sql     # Skrip migrasi struktur tabel database PostgreSQL
└── package.json            # Daftar dependensi & script build
```

---

## 🚀 Panduan Eksekusi (Local Development)

### 1. Kebutuhan Sistem
*   **Node.js** versi 18+
*   Akun **Supabase** (Database & Storage `fiveinvitation-bucket`)
*   Akun **Midtrans** (Sandbox/Production Mode)

### 2. Konfigurasi Lingkungan (`.env`)
Salin file `.env.example` ke `.env` dan isi kredensial Anda:

```env
PORT=3000
VITE_APP_URL=http://localhost:3000

# SUPABASE 
VITE_SUPABASE_URL=https://[YOUR_PROJECT].supabase.co
VITE_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]

# MIDTRANS
MIDTRANS_SERVER_KEY=[SERVER-KEY-ANDA]
VITE_MIDTRANS_CLIENT_KEY=[CLIENT-KEY-ANDA]
MIDTRANS_IS_PRODUCTION=false
```

### 3. Migrasi Database & Setup Storage
1. Jalankan baris perintah di `supabase_schema.sql` pada SQL Editor Supabase Anda.
2. Buka menu **Storage** di Supabase, buat *bucket* baru dengan nama **`fiveinvitation-bucket`**. Pastikan diatur ke **Public**.

### 4. Mulai Development
```bash
# Instal seluruh pustaka
npm install

# Jalankan backend dan frontend secara bersamaan (Vite Middleware)
npm run dev
```
Akses aplikasi di `http://localhost:3000`.

---

## 📦 Tahapan Deployment (Production)

Proyek dikonfigurasikan secara cermat menggunakan *single output bundle*:

```bash
# Melakukan build kompilasi TypeScript dan aset Statis React
npm run build

# Menjalankan server Node.js pada file hasil transpilasi (dist/server.cjs)
npm run start
```

## 🤝 Lisensi
Dikembangkan secara penuh untuk visi *Luxury Wedding Platform* oleh tim kreator FiveInvitation.
