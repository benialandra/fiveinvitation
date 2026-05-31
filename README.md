# 💍 FiveInvitation - Digital Wedding Invitation Platform

**FiveInvitation** adalah platform modern untuk membuat dan mengelola undangan pernikahan digital dengan tema yang dapat dikustomisasi, payment gateway terintegrasi, dan fitur interaktif untuk tamu.

---

## ✨ Fitur Utama

- 🎨 **Multiple Wedding Themes** - Berbagai pilihan tema undangan yang dapat dikustomisasi
- 💳 **Payment Integration** - Integrasi Midtrans untuk proses pembayaran yang aman
- 🎧 **Custom Music** - Tambahkan lagu background untuk undangan digital Anda
- 📍 **Interactive Maps** - Embed lokasi acara dengan Google Maps
- 📖 **Guest Book** - Tamu dapat meninggalkan ucapan dan kesan
- ✅ **RSVP Management** - Kelola konfirmasi kehadiran tamu dengan mudah
- 📧 **Email Notifications** - Automatic reminder pembayaran dan notifikasi
- 🤖 **AI Powered** - Menggunakan Google Gemini API untuk fitur cerdas
- 📊 **Admin Dashboard** - Kelola tema, order, dan analytics
- 🌐 **Realtime Updates** - Guest book updates secara realtime dengan Supabase

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - JavaScript library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing

### Backend
- **Node.js + Express** - Server framework
- **TypeScript** - Type-safe server code
- **Supabase** - PostgreSQL database & realtime features
- **Midtrans** - Payment gateway integration
- **Nodemailer** - Email notifications
- **node-cron** - Scheduled tasks

### Services
- **Google Gemini API** - AI capabilities
- **Supabase** - Database & authentication
- **Midtrans** - Payment processing
- **SMTP** - Email sending

---

## 📋 Prerequisites

- **Node.js** v16+ (recommended v18+)
- **npm** v8+
- Akun di:
  - [Supabase](https://supabase.com) - Database
  - [Midtrans](https://midtrans.com) - Payment gateway
  - [Google Cloud Console](https://console.cloud.google.com) - Gemini API

---

## 🚀 Getting Started

### 1. Clone Repository
```bash
git clone https://github.com/benialandra/fiveinvitation.git
cd fiveinvitation
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Buat file `.env.local` berdasarkan `.env.example`:
```bash
cp .env.example .env.local
```

Isi dengan credentials Anda:
```env
# Supabase
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"

# Midtrans (gunakan Sandbox untuk testing)
VITE_MIDTRANS_CLIENT_KEY="your-client-key"
MIDTRANS_SERVER_KEY="your-server-key"
MIDTRANS_IS_PRODUCTION="false"

# App Configuration
VITE_APP_URL="http://localhost:3000"
APP_URL="http://localhost:3000"

# SMTP (untuk email notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### 4. Setup Database Schema
1. Buka [Supabase Dashboard](https://supabase.com)
2. Buat project baru
3. Buka SQL Editor
4. Copy & paste isi dari `supabase_schema.sql`
5. Execute SQL

### 5. Run Development Server
```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

---

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start dev server dengan Vite

# Build & Production
npm run build        # Build untuk production
npm start            # Run production server
npm run preview      # Preview production build locally

# Maintenance
npm run clean        # Clean dist folder
npm run lint         # TypeScript type checking
```

---

## 📁 Project Structure

```
fiveinvitation/
├── src/
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── themes/           # Wedding theme templates
│   │   └── registry.tsx   # Theme registry & metadata
│   ├── api/              # API client functions
│   └── App.tsx           # Main app component
│
├── server.ts             # Express server & API routes
├── supabase_schema.sql   # Database schema
├── package.json          # Dependencies
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.js    # Tailwind CSS config
│
└── public/               # Static assets
    └── uploads/          # User uploaded files
```

---

## 🔌 API Endpoints

### Orders
```
GET    /api/orders                    # Dapatkan semua orders
GET    /api/orders/:orderCode         # Dapatkan detail order tertentu
PUT    /api/orders/:orderCode         # Update order details
POST   /api/order/create              # Buat order baru & generate payment token
```

### Payments
```
POST   /api/webhook/midtrans          # Webhook untuk payment notifications
```

### Themes
```
POST   /api/admin/themes/:id/update   # Update theme (dengan upload thumbnail)
```

---

## 💳 Payment Flow

1. **Customer membuat order** → API `/api/order/create`
2. **Generate Midtrans token** → Redirect ke Midtrans Snap
3. **Customer bayar** → Midtrans processing
4. **Webhook notification** → `/api/webhook/midtrans`
5. **Update order status** → PENDING → PAID/CANCELLED
6. **Email notification** → Customer notification

### Testing Payment (Sandbox)
- **Success**: `4111 1111 1111 1111` (Visa)
- **Pending**: `4000 0000 0000 0002`
- **Declined**: `5555 5555 5555 4444`

---

## 📧 Email Notifications

### Automatic Emails
- ✅ **Payment Success** - Notifikasi pembayaran berhasil
- ⏰ **Payment Reminder** - Reminder otomatis untuk pending orders (>24 jam)

### Email Configuration
Gunakan SMTP yang mendukung:
- **Gmail** (dengan App Password)
- **SendGrid**
- **AWS SES**
- **Custom SMTP Server**

---

## 🗄️ Database Schema

### Orders Table
Menyimpan informasi pesanan undangan
- `unique_code` - ID unik order (contoh: INV-A1B2C)
- `status` - PENDING | PAID | CANCELLED
- `groom_name`, `bride_name` - Nama pengantin
- `akad_date`, `resepsi_date` - Tanggal acara
- `theme_id` - Tema yang dipilih
- `slug` - Custom URL (contoh: beni-salsa)

### Guest Books Table
Ucapan dari tamu
- `order_id` - Referensi ke orders
- `sender_name` - Nama pengirim
- `message` - Isi ucapan

### RSVP Table
Konfirmasi kehadiran
- `order_id` - Referensi ke orders
- `guest_name` - Nama tamu
- `status` - ATTENDING | NOT_ATTENDING
- `guest_count` - Jumlah yang hadir

---

## 🔒 Security

- **Row Level Security (RLS)** - Supabase RLS untuk database protection
- **Environment Variables** - Semua credentials di `.env.local` (tidak di-push ke repo)
- **Secure Payment** - Midtrans server key tidak terekspos ke frontend
- **CORS Protected** - API endpoints dilindungi

---

## 🚢 Deployment

### Deploy ke Production

#### Vercel / Netlify
```bash
npm run build
# Deployment otomatis untuk production
```

#### Self-hosted / VPS
```bash
# Build aplikasi
npm run build

# Set production environment variables
export NODE_ENV=production
export MIDTRANS_IS_PRODUCTION=true
# ... set other env vars

# Start server
npm start
```

Lihat `DEPLOYMENT.md` untuk instruksi detailed.

---

## 🐛 Troubleshooting

### Masalah Payment Gateway
```
Error: "No MIDTRANS_SERVER_KEY"
→ Pastikan MIDTRANS_SERVER_KEY ada di .env.local
→ Restart development server
```

### Database Connection Error
```
Error: "Supabase connection failed"
→ Check VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY
→ Verify Supabase project aktif dan online
```

### Email Tidak Terkirim
```
→ Verify SMTP credentials di .env.local
→ Check "Less Secure Apps" setting untuk Gmail
→ Lihat server logs untuk detailed error
```

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Midtrans Documentation](https://docs.midtrans.com)
- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)

---

## 🤝 Contributing

Kontribusi sangat diterima! Silakan:

1. Fork repository
2. Buat branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

Distributed under the MIT License. Lihat `LICENSE` file untuk details.

---

## 👨‍💻 Author

**Beni Alandra**
- GitHub: [@benialandra](https://github.com/benialandra)

---

## 📞 Support

Jika ada pertanyaan atau masalah:
- 🐛 Buka [GitHub Issues](https://github.com/benialandra/fiveinvitation/issues)
- 💬 Diskusi di [GitHub Discussions](https://github.com/benialandra/fiveinvitation/discussions)

---

**Made with 💍 for beautiful wedding celebrations** ✨
