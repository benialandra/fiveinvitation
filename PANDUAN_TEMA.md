# Panduan Membuat Tema (Template) Custom

Sistem undangan ini dirancang sangat fleksibel dan mendukung 2 cara pembuatan tema:
1. **Dynamic JSON Config (Tanpa Coding)**: Tema dikonfigurasi melalui Dashboard Admin menggunakan `MasterTheme` dengan menyuplai JSON konfigurasi warna dan layout.
2. **Hardcoded React Component (Coding `.tsx`)**: Tema dibuat langsung dari nol menggunakan kode React/Tailwind. Cara ini paling cocok digunakan jika Anda memiliki desain yang sangat spesifik, custom animasi rumit, dan layout 100% custom yang tidak bisa dijangkau dari dashboard standar.

Jika Anda ingin membuat tema undangan dengan desain (.tsx) sendiri, ikuti 3 langkah mudah berikut:

## Langkah 1: Buat File Tema Baru
Buat sebuah file baru di direktori `src/themes/`. Anda bisa memberinya nama sesuai tema Anda, misalnya `src/themes/TemaBaruSaya.tsx`.

## Langkah 2: Buat Struktur Komponen React
Sebuah tema pada dasarnya hanyalah komponen React standar yang menerima **Props**. Props utama yang dipassing dari parent adalah:
- `data`: Berisi seluruh data mempelai, jadwal, alamat, dll dari database Anda.
- `guestName`: Nama tamu yang bersumber dari query URL (`?to=Nama+Tamu`).
- `lang`: Kode bahasa saat ini (`en` atau `id`).

**Template Dasar Tema:**
```tsx
import React, { useState } from 'react';

interface ThemeProps {
  data?: any;
  guestName?: string;
  lang?: 'en' | 'id';
}

export default function TemaBaruSaya({ data, guestName, lang = 'id' }: ThemeProps) {
  // State untuk melacak apakah undangan sudah dibuka (klik tombol buka)
  const [isOpen, setIsOpen] = useState(false);
  
  // Handling loading data
  if (!data) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* 1. BAGIAN COVER (Di luar) */}
      <div className={`fixed inset-0 z-50 bg-white flex flex-col items-center justify-center transition-transform duration-1000 ${isOpen ? '-translate-y-full' : 'translate-y-0'}`}>
         {/* Gambar Background */}
         <img src={data.cover_image} className="absolute inset-0 w-full h-full object-cover opacity-50" alt="Cover" />
         
         <div className="z-10 text-center relative">
            <h1 className="text-4xl font-bold mb-4">{data.groom_name} & {data.bride_name}</h1>
            {guestName && (
               <div className="mb-6">
                 <p className="text-sm">Kepada Yth:</p>
                 <p className="font-semibold text-xl">{guestName}</p>
               </div>
            )}
            <button onClick={() => setIsOpen(true)} className="px-6 py-3 bg-black text-white rounded-full">
               Buka Undangan
            </button>
         </div>
      </div>

      {/* 2. KONTEN UTAMA UNDANGAN (Setelah dibuka) */}
      <div className={`transition-opacity duration-1000 ${isOpen ? 'opacity-100' : 'opacity-0'} p-8`}>
         <h2 className="text-2xl text-center mb-8">Jadwal Acara</h2>
         
         <div className="grid gap-6">
            <div className="bg-white p-6 rounded-xl text-center shadow">
               <h3 className="font-bold border-b pb-2 mb-2">Akad Nikah</h3>
               <p>{data.akad_date}</p> 
            </div>
            <div className="bg-white p-6 rounded-xl text-center shadow">
               <h3 className="font-bold border-b pb-2 mb-2">Resepsi</h3>
               <p>{data.resepsi_date}</p> 
            </div>
         </div>
         
         <div className="mt-8 bg-white p-6 rounded-xl text-center shadow">
            <h3 className="font-bold mb-2">Lokasi</h3>
            <p className="mb-4">{data.location_name}</p>
            {data.maps_link && <a href={data.maps_link} className="text-blue-500 whitespace-nowrap">Buka Google Maps</a>}
         </div>
      </div>
    </div>
  );
}
```

## Langkah 3: Daftarkan Tema ke Registry
Agar file tema yang baru dibuat terdeteksi oleh sistem (sehingga muncul di Katalog Tema dan dapat di-render), Anda harus mendaftarkannya ke dalam file **`src/themes/registry.tsx`**.

1. Buka `src/themes/registry.tsx`.
2. Lakukan Import pada tema Anda di baris paling atas:

```tsx
import TemaBaruSaya from './TemaBaruSaya';
```

3. Scroll ke bawah, dan tambahkan objek baru ke dalam array `THEME_REGISTRY`:

```tsx
export const THEME_REGISTRY: ThemeMeta[] = [
  // ... tema yang sudah ada ...
  {
    id: 'tema-baru-saya', // Harus unik kebab-case (url friendly)
    name: 'Tema Premium Saya', // Nama tampilan di Dashboard Home / Katalog
    category: 'Minimalist', // Kategori: 'Elegant' | 'Dark' | 'Minimalist' | 'Islamic' | 'Floral'
    price: 150000,
    thumbnail: 'https://images.unsplash.com/foto-contoh.jpg', // Gambar preview katalog
    component: TemaBaruSaya // Reference dari komponen import di tahap 2
  }
];
```

## 🌟 Fitur Tambahan (Animasi & Musik Latar)

Jika Anda ingin membuat tema yang memiliki bunga berjatuhan (bunga-bunga bergerak di layar) atau musik yang otomatis berputar saat undangan dibuka, Anda bisa menggunakan konsep DOM dan State di React.

Berikut contoh sederhana untuk memutar musik dan membuat efek bunga jatuh:

### Menerapkan Animasi Bunga Jatuh dan Musik

```tsx
import React, { useState, useEffect, useRef } from 'react';

export default function TemaAnimasiSaya({ data, guestName }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [flowers, setFlowers] = useState<{id: number, left: number, delay: number}[]>([]);

  useEffect(() => {
    // Buat acak posisi bunga saat komponen dimuat
    const generatedFlowers = Array.from({length: 20}).map((_, i) => ({
       id: i,
       left: Math.random() * 100, // Posisi bunga dari kiri ke kanan (0-100%)
       delay: Math.random() * 5 // Animasi delay agar tidak jatuh bersamaan
    }));
    setFlowers(generatedFlowers);
  }, []);

  const bukaUndanganMenu = () => {
     setIsOpen(true);
     // Memutar musik saat tombol "Buka Undangan" diklik (Wajib diklik agar browser mengizinkan audio)
     if (audioRef.current) {
        audioRef.current.play().catch(e => console.error("Audio block:", e));
     }
  };

  return (
    <div className="min-h-screen bg-pink-50 relative overflow-hidden">
      
      {/* 1. Tag Audio (Tersembunyi) */}
      {data?.music_url && <audio ref={audioRef} src={data.music_url} loop />}

      {/* 2. Style CSS Khusus Animasi Falling (Jatuh) */}
      <style>{\`
        @keyframes fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
        .falling-flower {
          position: fixed;
          top: -10vh;
          font-size: 2rem;
          pointer-events: none; /* Supaya ga ganggu klik user */
          animation: fall 8s linear infinite;
          z-index: 50; /* Muncul di atas elemen lain */
        }
      \`}</style>

      {/* 3. Render elemen bunganya jika sudah dibuka */}
      {isOpen && flowers.map(flower => (
         <div 
           key={flower.id} 
           className="falling-flower"
           style={{ left: \`\${flower.left}%\`, animationDelay: \`\${flower.delay}s\` }}
         >
           🌸 {/* Emoji bunga atau pakai tag <img> */}
         </div>
      ))}

      {/* Cover / Tombol Buka Undangan */}
      <div className={\`fixed inset-0 bg-white flex flex-col items-center justify-center transition-all duration-1000 \${isOpen ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100 z-50'}\`}>
         <h1 className="text-3xl mb-8">Pernikahan Kami</h1>
         <button onClick={bukaUndanganMenu} className="px-6 py-3 bg-pink-500 text-white rounded-full">
            Buka Undangan
         </button>
      </div>

      {/* Area Konten Utama */}
      <div className={\`p-10 text-center transition-opacity duration-1000 relative z-30 \${isOpen ? 'opacity-100' : 'opacity-0'}\`}>
          <h2 className="text-2xl mt-10">Selamat Datang di Acara Kami</h2>
      </div>

    </div>
  )
}
```

### Penjelasan:
1. **Musik Latar**: Browser saat ini **memblokir musik yang diputar otomatis tanpa interaksi user**. Oleh karena itu, kita menaruh pemanggil `audioRef.current.play()` ke dalam event `onClick` tombol "Buka Undangan". 
2. **Animasi Berjalan**: Kita memanfaatkan CSS buatan `@keyframes fall` dan merender Array emoji bunga `🌸` berulang-ulang secara acak dari tepi atas layar turun ke tepi bawah layar.
3. Anda bisa mengecek contoh lengkap buatan ini di file `src/themes/FloralBlossom.tsx`.

## Selesai!
Tema baru kini akan otomatis muncul di halaman utama Katalog Tema Anda dan dapat langsung di-checkout oleh user, dicoba pada Preview, dan dirender saat pengunjung membuka URL Undangan resminya!

---

### Referensi Variabel Field (`data`)
Saat menyusun template, Anda dapat mengambil property berikut dari backend:
* `groom_name` : Nama panggilan/utama pria
* `bride_name` : Nama panggilan/utama wanita
* `groom_parents` : Nama orang tua pria
* `bride_parents` : Nama orang tua wanita
* `akad_date` : String UTC Datetime jadwal Akad
* `resepsi_date` : String UTC Datetime jadwal Resepsi
* `location_name` : Teks alamat tempat acara
* `maps_link` : Tautan lokasi Google Maps
* `cover_image` : Gambar muka/sampul (untuk halaman *open invitation*)
* `hero_image` : Gambar wallpaper latar panggung/hero section
* `story` : Latar kisah cinta singkat mempelai
* `music_url` : Relatif url atau HTTP url untuk background sound (Opsional)
