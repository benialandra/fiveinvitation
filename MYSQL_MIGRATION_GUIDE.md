# Panduan Migrasi Supabase ke MySQL Lokal (Prisma / mysql2)

Tentu saja Anda bisa menggunakan MySQL lokal! Berbeda dengan Supabase yang menyediakan client-side SDK untuk mengakses database langsung dari React (browser), **MySQL harus diakses melalui backend server**. 

Karena aplikasi ini sudah menggunakan **Express.js** (`server.ts`), kita dapat memindahkan logika *query* database dari React (`frontend`) ke Express (`backend`).

Berikut adalah panduan langkah demi langkah menggunakan **Prisma ORM** (Sangat direkomendasikan karena tipe kemiripannya dengan pengalaman menggunakan Supabase-JS).

---

## 1. Perubahan Skema Database (PostgreSQL → MySQL)

Jika Anda ingin membuat tabelnya secara manual (tanpa Prisma initial migration), berikut adalah padanan skema Supabase PostgreSQL menjadi MySQL:

```sql
CREATE DATABASE eterna_db;
USE eterna_db;

CREATE TABLE orders (
    id VARCHAR(36) DEFAULT (UUID()) PRIMARY KEY,
    unique_code VARCHAR(20) UNIQUE NOT NULL,
    theme_id VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    midtrans_token VARCHAR(255),
    
    groom_name VARCHAR(100) NOT NULL,
    bride_name VARCHAR(100) NOT NULL,
    groom_parents VARCHAR(255),
    bride_parents VARCHAR(255),
    
    akad_date DATETIME,
    resepsi_date DATETIME,
    location_name TEXT,
    maps_link TEXT,
    
    story TEXT,
    music_url TEXT,
    slug VARCHAR(100) UNIQUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE guest_books (
    id VARCHAR(36) DEFAULT (UUID()) PRIMARY KEY,
    order_id VARCHAR(36),
    sender_name VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
```

---

## 2. Setup Prisma ORM

Prisma adalah ORM yang sangat kuat untuk Node.js dan memiliki *auto-complete* TypeScript yang sangat baik.

### Instalasi:
Jalankan perintah ini di terminal server Anda:
```bash
npm install @prisma/client
npm install prisma --save-dev
npx prisma init
```

### Konfigurasi `.env`:
Ubah URL database Anda pada file `.env`:
```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/eterna_db"
```

### Update `prisma/schema.prisma`:
Ubah file schema prisma yang dihasilkan dengan skema berikut:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model orders {
  id              String        @id @default(uuid())
  unique_code     String        @unique @db.VarChar(20)
  theme_id        String        @db.VarChar(50)
  status          String?       @default("PENDING") @db.VarChar(20)
  midtrans_token  String?       @db.VarChar(255)
  groom_name      String        @db.VarChar(100)
  bride_name      String        @db.VarChar(100)
  akad_date       DateTime?
  slug            String?       @unique @db.VarChar(100)
  created_at      DateTime?     @default(now())
  updated_at      DateTime?     @updatedAt
  
  guest_books     guest_books[]
}

model guest_books {
  id          String   @id @default(uuid())
  order_id    String
  sender_name String   @db.VarChar(100)
  message     String   @db.Text
  created_at  DateTime @default(now())
  
  order       orders   @relation(fields: [order_id], references: [id], onDelete: Cascade)
}
```

Jalankan sinkronisasi database:
```bash
npx prisma db push
```

---

## 3. Update File API Client

Hapus penggunaan Supabase Client dan ganti file tersebut untuk melakukan request ke backend HTTP (Express) kita.

**Ubah `src/lib/supabase.ts` menjadi `src/lib/api.ts`:**
```typescript
// Kini frontend tidak lagi menghubungi DB langsung, melainkan fetch ke backend

export const api = {
  createOrder: async (orderData: any) => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return res.json();
  },

  getOrderByCode: async (code: string) => {
    const res = await fetch(`/api/orders/track/${code}`);
    return res.json();
  },
  
  getOrderBySlug: async (slug: string) => {
    const res = await fetch(`/api/orders/slug/${slug}`);
    return res.json();
  }
};
```

---

## 4. Tambahkan Endpoint API di Backend (`server.ts`)

Buka `server.ts`, inisialisasi Prisma, dan buat rute untuk menangani permintaan dari frontend:

```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Rute Buat Pesanan Baru
app.post("/api/orders", async (req, res) => {
  try {
    const newOrder = await prisma.orders.create({
      data: req.body
    });
    res.json({ data: newOrder });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Rute Cari Pesanan (Track Order) 
app.get("/api/orders/track/:code", async (req, res) => {
  try {
    const order = await prisma.orders.findUnique({
      where: { unique_code: req.params.code }
    });
    res.json({ data: order });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Rute Untuk Halaman Undangan (Slug)
app.get("/api/orders/slug/:slug", async (req, res) => {
  try {
    const order = await prisma.orders.findUnique({
      where: { slug: req.params.slug }
    });
    res.json({ data: order });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- Jangan lupa update Webhook Midtrans Anda ---
// Pada function webhook midtrans:
/*
if (fraudStatus == 'accept') {
   await prisma.orders.update({
      where: { unique_code: orderId },
      data: { status: 'PAID' }
   });
}
*/
```

---

## 5. Implementasi di Sisi Komponen React

Perbarui `Order.tsx`, `Track.tsx`, dan `Invitation.tsx`. Alih-alih memanggil `supabase.from('orders')`, arahkan mereka memakai HTTP Fetch yang baru:

**Contoh (di Order.tsx):**
```typescript
import { api } from '../lib/api';

// Pada handleSubmit:
// Hapus kode: await supabase.from('orders').insert({...})
// Ganti dengan:
await api.createOrder({
  unique_code: orderCode,
  theme_id: theme.id,
  midtrans_token: token,
  status: 'PENDING',
  groom_name: formData.groom_name,
  bride_name: formData.bride_name,
  akad_date: formData.akad_date ? new Date(formData.akad_date).toISOString() : null,
  slug: slugVal
});
```

---

## Keuntungan Sistem Baru (Backend API + MySQL)
1. Keamanan lebih baik (Koneksi database 100% tersembunyi dari peramban client, tidak terekspos seperti anon key!).
2. Mudah dipindahkan ke server VPS atau Hosting yang mensupport MySQL dan Node.JS (seperti VPS Hostinger, Niagahoster, dll).
3. Terpusat di Express backend API `server.ts`.
