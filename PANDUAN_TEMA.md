# Panduan Membuat Tema (Template) Custom

Sistem undangan ini dirancang sangat fleksibel dan mendukung pembuatan tema melalui 2 cara utama:

1. **Upload Komponen Dinamis dari Dashboard (Fitur Unggulan!)**: Anda cukup menulis komponen React (`.tsx`) di komputer Anda, lalu mengunggahnya langsung melalui Dashboard Admin. Sistem backend akan otomatis membaca file, menyimpannya, dan mendaftarkannya ke dalam Registry secara real-time!
2. **Dynamic JSON Config (Tanpa Coding)**: Menggunakan `MasterTheme` bawaan yang dikonfigurasi melalui antarmuka admin (pengubahan warna dan gambar dasar).

Jika Anda ingin membuat tema undangan dengan desain `.tsx` sendiri yang canggih (custom animasi, struktur layout unik), ikuti panduan berikut:

## Langkah 1: Buat File Tema Baru (React Component)
Buat sebuah file baru ber-ekstensi `.tsx` di komputer Anda, misalnya `TemaBaruSaya.tsx`.
Sebuah tema pada dasarnya hanyalah komponen React standar yang menerima **Props**.

**Props Utama yang dipassing dari Parent:**
- `data`: Berisi seluruh informasi mempelai, jadwal, alamat, konfigurasi warna, dll dari database Anda.
- `guestName`: Nama tamu yang bersumber dari query URL (`?to=Nama+Tamu`).
- `lang`: Kode bahasa saat ini (`en` atau `id`).

**Template Dasar Tema (`TemaBaruSaya.tsx`):**
```tsx
import React, { useState } from 'react';

export default function TemaBaruSaya({ data, guestName, lang = 'id' }: any) {
  const [isOpen, setIsOpen] = useState(false);
  
  if (!data) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* 1. BAGIAN COVER (Di luar) */}
      <div className={`fixed inset-0 z-50 bg-white flex flex-col items-center justify-center transition-transform duration-1000 ${isOpen ? '-translate-y-full' : 'translate-y-0'}`}>
         {data.cover_image && (
            <img src={data.cover_image} className="absolute inset-0 w-full h-full object-cover opacity-50" alt="Cover" />
         )}
         
         <div className="z-10 text-center relative">
            <h1 className="text-4xl font-bold mb-4 text-black">{data.groom_name} & {data.bride_name}</h1>
            {guestName && (
               <div className="mb-6 text-black">
                 <p className="text-sm">Kepada Yth:</p>
                 <p className="font-semibold text-xl">{guestName}</p>
               </div>
            )}
            <button onClick={() => setIsOpen(true)} className="px-6 py-3 bg-black text-white rounded-full">
               Buka Undangan
            </button>
         </div>
         
         <div className="mt-8 bg-white p-6 rounded-xl text-center shadow">
            <h3 className="font-bold mb-2">Lokasi</h3>
            <p className="mb-4">{data.location_name}</p>
            {data.maps_link && <a href={data.maps_link} target="_blank" rel="noreferrer" className="text-blue-500 whitespace-nowrap">Buka Google Maps</a>}
         </div>
      </div>
    </div>
  );
}
```

## Langkah 2: Upload via Dashboard (Otomatis Terdaftar!)

Anda tidak perlu mengedit file `src/themes/registry.tsx` secara manual jika Anda mendeploy ini di lingkungan yang mendukung penulisan file sistem (seperti server lokal Anda atau VPS!).

1. Buka aplikasi Anda, login sebagai Admin, lalu ke menu **Themes**.
2. Klik tombol **Buat Tema Baru**.
3. Di modal pembuatan, pilih Tipe Tema: **Upload .tsx Component**.
4. Isi Nama Komponen dengan *tepat sama* seperti nama file tanpa ekstensi (misal: `TemaBaruSaya`).
5. Upload file `TemaBaruSaya.tsx` yang Anda buat.
6. Klik Submit.

> [!TIP]
> Backend server `server.ts` akan secara otomatis menyalin file tersebut ke folder `src/themes/` dan melakukan *code injection* secara dinamis untuk meng-import komponen tersebut ke dalam `registry.tsx`. Saat Anda me-refresh browser (atau vite auto reload), tema Anda sudah bisa digunakan!

---

## Opsi Manual (Jika Upload Gagal / Read-Only Environment)

Jika lingkungan produksi Anda *read-only* (seperti Vercel) yang tidak mendukung `fs.writeFileSync` ke direktori proyek secara dinamis, Anda harus mendaftarkannya secara manual sebelum build:

1. Letakkan file `TemaBaruSaya.tsx` ke dalam `src/themes/`.
2. Buka `src/themes/registry.tsx`.
3. Lakukan Import pada tema Anda di baris paling atas:
   ```tsx
   import TemaBaruSaya from './TemaBaruSaya';
   ```
4. Tambahkan objek baru ke dalam array `THEME_REGISTRY`:
   ```tsx
   export const THEME_REGISTRY: ThemeMeta[] = [
     // ... tema yang lain ...
     {
       id: 'tema-baru-saya', // Kebab case unik
       name: 'Tema Premium Saya',
       category: 'Minimalist',
       price: 150000,
       thumbnail: 'https://images.unsplash.com/foto-contoh.jpg',
       component: TemaBaruSaya
     }
   ];
   ```

---

## 🌟 Fitur Tambahan (Animasi & Musik Latar)

Jika Anda ingin memutar musik otomatis saat undangan dibuka, pastikan pemutaran audio di-trigger oleh klik user (seperti saat klik tombol "Buka Undangan").

```tsx
import React, { useState, useRef } from 'react';

export default function TemaAnimasiSaya({ data, guestName }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const bukaUndanganMenu = () => {
     setIsOpen(true);
     if (audioRef.current) {
        audioRef.current.play().catch(e => console.error("Audio block:", e));
     }
  };

  return (
    <div>
      {data?.music_url && <audio ref={audioRef} src={data.music_url} loop />}
      
      {!isOpen && (
         <button onClick={bukaUndanganMenu}>Buka Undangan</button>
      )}
      
      {/* Isi konten... */}
    </div>
  )
}
```

### Referensi Variabel Field (`data`)
Saat menyusun template, Anda dapat mengambil property berikut dari prop `data`:
* `groom_name` : Nama panggilan pria
* `bride_name` : Nama panggilan wanita
* `akad_date` : String UTC Datetime jadwal Akad
* `resepsi_date` : String UTC Datetime jadwal Resepsi
* `location_name` : Teks alamat tempat acara
* `maps_link` : Tautan lokasi Google Maps
* `cover_image` : URL Gambar muka/sampul (di-serve dari `/uploads/...`)
* `hero_image` : URL Gambar latar panggung/hero section
* `story` : Latar kisah cinta singkat mempelai
* `music_url` : Link audio background
