import React, { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { id as localeId, enUS as localeEn } from 'date-fns/locale';

interface ThemeProps {
  data?: any;
  guestName?: string;
  lang?: 'en' | 'id';
}

export default function MinimalistMonochrome({ data, guestName, lang = 'id' }: ThemeProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  if (!data) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const currentLocale = lang === 'en' ? localeEn : localeId;
  const t = {
    open: lang === 'en' ? 'Open Invitation' : 'Buka Undangan',
    dear: lang === 'en' ? 'Dear:' : 'Kepada Yth:',
    matrimony: lang === 'en' ? 'Holy Matrimony' : 'Akad Nikah',
    reception: lang === 'en' ? 'Wedding Reception' : 'Resepsi Pernikahan',
  };

  const coverImage = data.cover_image || "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop";

  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen overflow-x-hidden selection:bg-black selection:text-white">
      {/* Cover Screen */}
      <div 
        className={`fixed inset-0 z-50 bg-white flex flex-col items-center justify-center transition-transform duration-1000 ease-in-out ${isOpen ? '-translate-y-full' : 'translate-y-0'}`}
      >
        <div className="absolute inset-0 bg-black/10 z-0">
           <img src={coverImage} className="w-full h-full object-cover opacity-50 grayscale" alt="Cover" />
        </div>
        <div className="z-10 text-center px-6">
          <p className="uppercase tracking-[0.3em] text-xs font-semibold mb-6">The Wedding Of</p>
          <h1 className="text-5xl md:text-7xl font-light tracking-tighter mb-8">
            {data.groom_name} & {data.bride_name}
          </h1>
          {guestName && (
            <div className="mb-12 border-t border-b border-black py-4 inline-block px-8">
              <p className="text-xs uppercase tracking-widest mb-2">{t.dear}</p>
              <p className="text-xl font-medium">{guestName}</p>
            </div>
          )}
          <div>
              <button 
                onClick={() => setIsOpen(true)}
                className="px-8 py-4 bg-black text-white hover:bg-gray-800 transition-colors uppercase tracking-widest text-xs font-bold"
              >
                {t.open}
              </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-opacity duration-1000 ${isOpen ? 'opacity-100' : 'opacity-0'} min-h-screen flex flex-col`}>
        {/* Intro */}
        <section className="min-h-screen flex items-center justify-center px-6 py-24 border-b border-gray-100">
           <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-4xl md:text-6xl font-light mb-16 tracking-tighter">We Are Getting Married</h2>
              <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                 <div className="text-right">
                    <h3 className="text-2xl font-bold mb-2">{data.groom_name}</h3>
                    <p className="text-sm text-gray-500 uppercase tracking-widest">{data.groom_parents}</p>
                 </div>
                 <div className="text-3xl font-light text-gray-300">&</div>
                 <div className="text-left">
                    <h3 className="text-2xl font-bold mb-2">{data.bride_name}</h3>
                    <p className="text-sm text-gray-500 uppercase tracking-widest">{data.bride_parents}</p>
                 </div>
              </div>
           </div>
        </section>

        {/* Schedule */}
        <section className="py-24 px-6 bg-gray-50">
           <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-white p-12 border border-gray-100 text-center hover:border-black transition-colors duration-500">
                 <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-6">{t.matrimony}</h3>
                 {data.akad_date && (
                    <div className="mb-6">
                       <p className="text-4xl font-light mb-2">{format(parseISO(data.akad_date), 'dd')}</p>
                       <p className="text-sm uppercase tracking-widest">{format(parseISO(data.akad_date), 'MMMM yyyy', { locale: currentLocale })}</p>
                       <p className="text-xs text-gray-500 mt-2">{format(parseISO(data.akad_date), 'HH:mm', { locale: currentLocale })} WIB</p>
                    </div>
                 )}
              </div>
              <div className="bg-white p-12 border border-gray-100 text-center hover:border-black transition-colors duration-500">
                 <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-6">{t.reception}</h3>
                 {data.resepsi_date && (
                    <div className="mb-6">
                       <p className="text-4xl font-light mb-2">{format(parseISO(data.resepsi_date), 'dd')}</p>
                       <p className="text-sm uppercase tracking-widest">{format(parseISO(data.resepsi_date), 'MMMM yyyy', { locale: currentLocale })}</p>
                       <p className="text-xs text-gray-500 mt-2">{format(parseISO(data.resepsi_date), 'HH:mm', { locale: currentLocale })} WIB</p>
                    </div>
                 )}
              </div>
           </div>
           
           <div className="max-w-4xl mx-auto mt-12 text-center bg-white p-12 border border-gray-100">
              <p className="text-sm uppercase tracking-widest mb-4 font-bold">Venue</p>
              <p className="mb-8 max-w-lg mx-auto leading-relaxed">{data.location_name}</p>
              {data.maps_link && (
                 <a href={data.maps_link} target="_blank" rel="noreferrer" className="inline-block border-b-2 border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors uppercase text-xs font-bold tracking-widest">
                    Google Maps
                 </a>
              )}
           </div>
        </section>
      </div>
    </div>
  );
}
