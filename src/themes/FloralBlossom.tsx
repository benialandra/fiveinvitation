import React, { useEffect, useState, useRef } from 'react';
import { format, parseISO } from 'date-fns';
import { id as localeId, enUS as localeEn } from 'date-fns/locale';
import SmoothScrollLayout from '../components/Interactive/SmoothScrollLayout';
import AudioController from '../components/Interactive/AudioController';

interface ThemeProps {
  data?: any;
  guestName?: string;
  lang?: 'en' | 'id';
}

export default function FloralBlossom({ data, guestName, lang = 'id' }: ThemeProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Efek Daun/Bunga jatuh
  const [petals, setPetals] = useState<{ id: number; left: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    // Generate animasi jatuhnya bunga secara acak
    const newPetals = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // posisi horizontal (0 - 100%)
      delay: Math.random() * 10,  // delay sebelum jatuh (0 - 10s)
      duration: Math.random() * 5 + 5, // durasi jatuh (5 - 10s)
    }));
    setPetals(newPetals);
  }, []);

  const handleOpenInvitation = () => {
    setIsOpen(true);
  };

  if (!data) return <div className="min-h-screen flex items-center justify-center bg-rose-50 text-rose-900">Memuat...</div>;

  const currentLocale = lang === 'en' ? localeEn : localeId;
  const t = {
    open: lang === 'en' ? 'Open Invitation' : 'Buka Undangan',
    dear: lang === 'en' ? 'Dear:' : 'Kepada Yth:',
    matrimony: lang === 'en' ? 'Holy Matrimony' : 'Akad Nikah',
    reception: lang === 'en' ? 'Wedding Reception' : 'Resepsi Pernikahan',
    venue: lang === 'en' ? 'Venue' : 'Lokasi',
  };

  const coverImage = data.cover_image || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop";

  return (
    <SmoothScrollLayout>
      <div className="font-serif text-rose-950 bg-rose-50 min-h-screen overflow-x-hidden relative selection:bg-rose-900 selection:text-white">
        
        {/* Background Music */}
        {isOpen && <AudioController src={data.music_url || "https://assets.mixkit.co/music/preview/mixkit-beautiful-dream-493.mp3"} />}

        {/* Efek Bunga Jatuh CSS Khusus (di-inject di dalam theme) */}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
        .petal {
          position: fixed;
          top: -10vh;
          font-size: 1.5rem;
          pointer-events: none;
          z-index: 40;
          animation-name: fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>

      {/* Render Bunga yang berjatuhan hanya jika undangan sudah dibuka */}
      {isOpen && petals.map((petal) => (
        <div 
          key={petal.id} 
          className="petal"
          style={{
            left: `${petal.left}%`,
            animationDelay: `${petal.delay}s`,
            animationDuration: `${petal.duration}s`
          }}
        >
          🌸
        </div>
      ))}

      {/* Halaman Cover */}
      <div 
        className={`fixed inset-0 z-50 bg-rose-100 flex flex-col items-center justify-center transition-transform duration-1000 ease-in-out ${isOpen ? '-translate-y-full' : 'translate-y-0'}`}
      >
        <div className="absolute inset-0 bg-black/20 z-0">
           <img src={coverImage} className="w-full h-full object-cover opacity-70" alt="Cover" />
        </div>
        <div className="z-10 text-center px-6 bg-white/60 p-12 rounded-full border-4 border-white shadow-2xl backdrop-blur-sm mx-4">
          <p className="uppercase tracking-[0.2em] text-xs font-semibold mb-4 text-rose-900">The Wedding Of</p>
          <h1 className="text-4xl md:text-6xl font-light mb-6 text-rose-950">
            {data.groom_name} & {data.bride_name}
          </h1>
          {guestName && (
            <div className="mb-8 border-y-2 border-rose-950/20 py-4 inline-block px-8">
              <p className="text-xs uppercase tracking-widest mb-1 text-rose-800">{t.dear}</p>
              <p className="text-2xl font-medium text-rose-950">{guestName}</p>
            </div>
          )}
          <div>
              <button 
                onClick={handleOpenInvitation}
                className="px-8 py-3 bg-rose-800 rounded-full text-white hover:bg-rose-900 transition-colors uppercase tracking-widest text-xs font-bold shadow-lg"
              >
                {t.open}
              </button>
          </div>
        </div>
      </div>

      {/* Konten Utama */}
      <div className={`transition-opacity duration-1000 relative z-30 ${isOpen ? 'opacity-100' : 'opacity-0'} min-h-screen flex flex-col items-center pt-24 pb-24 px-6`}>
        
        {/* Dekorasi Atas */}
        <div className="text-6xl mb-12 animate-pulse">✿</div>

        <section className="max-w-2xl mx-auto text-center mb-24 bg-white/70 backdrop-blur-md p-10 md:p-16 rounded-3xl shadow-xl border border-white">
           <h2 className="text-3xl md:text-5xl font-light mb-12 text-rose-900">Kami Akan Menikah</h2>
           <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="text-center">
                 <h3 className="text-2xl font-bold mb-2 text-rose-950">{data.groom_name}</h3>
                 <p className="text-xs text-rose-700 uppercase tracking-widest leading-relaxed">
                   {lang === 'id' ? 'Putra dari' : 'Son of'}<br/>
                   <span className="font-semibold text-rose-900">{data.groom_parents}</span>
                 </p>
              </div>
              <div className="text-5xl font-light text-rose-300">&&</div>
              <div className="text-center">
                 <h3 className="text-2xl font-bold mb-2 text-rose-950">{data.bride_name}</h3>
                 <p className="text-xs text-rose-700 uppercase tracking-widest leading-relaxed">
                   {lang === 'id' ? 'Putri dari' : 'Daughter of'}<br/>
                   <span className="font-semibold text-rose-900">{data.bride_parents}</span>
                 </p>
              </div>
           </div>
        </section>

        <section className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
           <div className="bg-white/80 p-8 rounded-3xl text-center shadow-lg border border-white">
              <h3 className="text-sm font-bold uppercase tracking-[0.1em] mb-4 text-rose-800">{t.matrimony}</h3>
              {data.akad_date && (
                 <div className="text-rose-950">
                    <p className="text-5xl font-light mb-2">{format(parseISO(data.akad_date), 'dd')}</p>
                    <p className="text-sm uppercase tracking-widest border-b border-rose-200 pb-4 mb-4">
                      {format(parseISO(data.akad_date), 'MMMM yyyy', { locale: currentLocale })}
                    </p>
                    <p className="text-sm font-medium">Jam {format(parseISO(data.akad_date), 'HH:mm', { locale: currentLocale })} WIB</p>
                 </div>
              )}
           </div>
           
           <div className="bg-white/80 p-8 rounded-3xl text-center shadow-lg border border-white">
              <h3 className="text-sm font-bold uppercase tracking-[0.1em] mb-4 text-rose-800">{t.reception}</h3>
              {data.resepsi_date && (
                 <div className="text-rose-950">
                    <p className="text-5xl font-light mb-2">{format(parseISO(data.resepsi_date), 'dd')}</p>
                    <p className="text-sm uppercase tracking-widest border-b border-rose-200 pb-4 mb-4">
                      {format(parseISO(data.resepsi_date), 'MMMM yyyy', { locale: currentLocale })}
                    </p>
                    <p className="text-sm font-medium">Jam {format(parseISO(data.resepsi_date), 'HH:mm', { locale: currentLocale })} WIB</p>
                 </div>
              )}
           </div>
        </section>
        
        <section className="max-w-4xl w-full bg-white/90 p-8 md:p-12 rounded-3xl text-center shadow-lg border border-white">
           <h3 className="text-sm font-bold uppercase tracking-[0.1em] mb-6 text-rose-800">{t.venue}</h3>
           <p className="mb-8 max-w-lg mx-auto leading-relaxed text-rose-950">{data.location_name}</p>
           {data.maps_link && (
              <a href={data.maps_link} target="_blank" rel="noreferrer" className="inline-block px-8 py-3 bg-rose-100 rounded-full text-rose-900 hover:bg-rose-200 transition-colors uppercase text-xs font-bold tracking-widest border border-rose-200">
                 Buka Google Maps
              </a>
           )}
        </section>

        </div>
      </div>
    </SmoothScrollLayout>
  );
}
