import React, { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { id as localeId, enUS as localeEn } from 'date-fns/locale';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import SmoothScrollLayout from '../components/Interactive/SmoothScrollLayout';
import AudioController from '../components/Interactive/AudioController';

interface ThemeProps {
  data?: any;
  guestName?: string;
  lang?: 'en' | 'id';
}

export default function MinimalistMonochrome({ data, guestName, lang = 'id' }: ThemeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  const [comments, setComments] = useState([
    { id: 1, name: 'Reza', message: 'Selamat ya! Semoga lancar.' },
    { id: 2, name: 'Sarah', message: 'Happy wedding guys!' }
  ]);
  const [newName, setNewName] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  if (!data) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const currentLocale = lang === 'en' ? localeEn : localeId;
  const t = {
    open: lang === 'en' ? 'Open Invitation' : 'Buka Undangan',
    dear: lang === 'en' ? 'Dear:' : 'Kepada Yth:',
    matrimony: lang === 'en' ? 'Holy Matrimony' : 'Akad Nikah',
    reception: lang === 'en' ? 'Wedding Reception' : 'Resepsi Pernikahan',
    countdown: lang === 'en' ? 'Countdown' : 'Menuju Hari H',
    story: lang === 'en' ? 'Our Story' : 'Cerita Kami',
    gallery: lang === 'en' ? 'Gallery' : 'Galeri',
    gift: lang === 'en' ? 'Wedding Gift' : 'Kado Pernikahan',
    guestbook: lang === 'en' ? 'Guest Book' : 'Buku Tamu',
  };

  const groom = data.groom_name || 'Alvaro';
  const bride = data.bride_name || 'Biana';
  const coverImage = data.cover_image || "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop";
  const heroImage = data.hero_image || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop";
  const groomImg = data.groom_image || data.gallery_1 || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop";
  const brideImg = data.bride_image || data.gallery_2 || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop";
  const gallery1 = data.gallery_1 || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop";
  const gallery2 = data.gallery_2 || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop";
  const gallery3 = data.gallery_3 || "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800&auto=format&fit=crop";
  const gallery4 = data.gallery_4 || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop";
  const story = data.story || "We started as strangers, became friends, and realized we couldn't live without each other.";
  const akadDateStr = data.akad_date || '2026-12-31T08:00:00';

  useEffect(() => {
    const targetDate = new Date(akadDateStr).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance < 0) {
        clearInterval(interval);
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [akadDateStr]);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.bank_account_1 || "0987654321");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName && newMessage) {
      setComments([{ id: Date.now(), name: newName, message: newMessage }, ...comments]);
      setNewName('');
      setNewMessage('');
    }
  };

  return (
    <SmoothScrollLayout>
      <div className="font-sans text-gray-900 bg-white min-h-screen overflow-x-hidden selection:bg-black selection:text-white">
        {isOpen && <AudioController src={data.music_url || "https://assets.mixkit.co/music/preview/mixkit-beautiful-dream-493.mp3"} />}
        
        {/* Cover Screen */}
        <div className={`fixed inset-0 z-50 bg-white flex flex-col items-center justify-center transition-transform duration-1000 ease-in-out ${isOpen ? '-translate-y-full' : 'translate-y-0'}`}>
          <div className="absolute inset-0 bg-white/80 z-0">
             <img src={coverImage} className="w-full h-full object-cover opacity-20 grayscale" alt="Cover" />
          </div>
          <div className="z-10 text-center px-6">
            <p className="uppercase tracking-[0.3em] text-xs font-semibold mb-6">The Wedding Of</p>
            <h1 className="text-5xl md:text-7xl font-light tracking-tighter mb-8">
              {groom} & {bride}
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
          
          {/* Hero Section */}
          <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24 border-b border-gray-100 relative">
             <div className="absolute top-10 right-10 text-xs font-bold uppercase tracking-[0.5em] origin-top-right rotate-90 text-gray-300">Monochrome</div>
             <div className="absolute bottom-10 left-10 text-xs font-bold uppercase tracking-[0.5em] origin-bottom-left -rotate-90 text-gray-300">Editorial</div>
             <div className="w-full max-w-lg mb-12 border border-gray-200 p-2">
                <img src={heroImage} className="w-full h-[60vh] object-cover grayscale" alt="Hero" />
             </div>
             <div className="max-w-2xl mx-auto text-center z-10 bg-white p-8 -mt-24 border border-gray-100">
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">{t.story}</p>
                <h2 className="text-xl font-serif italic mb-6">"{story}"</h2>
                <h3 className="text-4xl md:text-6xl font-light tracking-tighter">{groom} & {bride}</h3>
             </div>
          </section>

          {/* Profiles */}
          <section className="py-32 px-6">
             <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16">
                <div className="flex-1 text-center md:text-right">
                   <div className="w-48 h-64 md:w-64 md:h-80 mx-auto md:ml-auto md:mr-0 border border-gray-200 p-2 mb-8">
                      <img src={groomImg} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt={groom} />
                   </div>
                   <h3 className="text-3xl font-light mb-2">{groom}</h3>
                   <p className="text-xs text-gray-500 uppercase tracking-widest">Putra dari<br/><span className="font-bold text-black">{data.groom_parents || 'Bpk. Hendra & Ibu Susi'}</span></p>
                </div>
                <div className="text-4xl font-light text-gray-200">&</div>
                <div className="flex-1 text-center md:text-left">
                   <div className="w-48 h-64 md:w-64 md:h-80 mx-auto md:mr-auto md:ml-0 border border-gray-200 p-2 mb-8">
                      <img src={brideImg} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt={bride} />
                   </div>
                   <h3 className="text-3xl font-light mb-2">{bride}</h3>
                   <p className="text-xs text-gray-500 uppercase tracking-widest">Putri dari<br/><span className="font-bold text-black">{data.bride_parents || 'Bpk. Budi & Ibu Ani'}</span></p>
                </div>
             </div>
          </section>

          {/* Countdown */}
          <section className="py-24 px-6 border-y border-gray-100 bg-gray-50">
             <div className="max-w-4xl mx-auto text-center">
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-12">{t.countdown}</h3>
                <div className="grid grid-cols-4 gap-4 md:gap-8 max-w-2xl mx-auto">
                   {[
                     { label: "Days", value: timeLeft.days },
                     { label: "Hours", value: timeLeft.hours },
                     { label: "Mins", value: timeLeft.minutes },
                     { label: "Secs", value: timeLeft.seconds }
                   ].map((item, idx) => (
                     <div key={idx} className="border border-black p-4 md:p-8 bg-white">
                        <div className="text-3xl md:text-5xl font-light mb-2">{item.value}</div>
                        <div className="text-[10px] uppercase tracking-widest text-gray-500">{item.label}</div>
                     </div>
                   ))}
                </div>
             </div>
          </section>

          {/* Schedule */}
          <section className="py-32 px-6">
             <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="border border-gray-200 p-12 text-center hover:border-black transition-colors duration-500 relative group">
                   <div className="absolute top-0 left-0 w-full h-full bg-black scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-700 z-0"></div>
                   <div className="relative z-10 group-hover:text-white transition-colors duration-500">
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-8">{t.matrimony}</h3>
                      {data.akad_date && (
                         <div className="mb-8">
                            <p className="text-6xl font-light mb-4">{format(parseISO(data.akad_date), 'dd')}</p>
                            <p className="text-sm uppercase tracking-widest mb-1">{format(parseISO(data.akad_date), 'MMMM yyyy', { locale: currentLocale })}</p>
                            <p className="text-xs text-gray-500 group-hover:text-gray-300">{format(parseISO(data.akad_date), 'HH:mm', { locale: currentLocale })} WIB</p>
                         </div>
                      )}
                      <p className="text-sm leading-relaxed mb-8">{data.location_name || 'Masjid Raya'}</p>
                      {data.maps_link && (
                         <a href={data.maps_link} target="_blank" rel="noreferrer" className="inline-block border-b border-current pb-1 uppercase text-xs font-bold tracking-widest">
                            Google Maps
                         </a>
                      )}
                   </div>
                </div>

                <div className="border border-gray-200 p-12 text-center hover:border-black transition-colors duration-500 relative group">
                   <div className="absolute top-0 left-0 w-full h-full bg-black scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-700 z-0"></div>
                   <div className="relative z-10 group-hover:text-white transition-colors duration-500">
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-8">{t.reception}</h3>
                      {data.resepsi_date && (
                         <div className="mb-8">
                            <p className="text-6xl font-light mb-4">{format(parseISO(data.resepsi_date), 'dd')}</p>
                            <p className="text-sm uppercase tracking-widest mb-1">{format(parseISO(data.resepsi_date), 'MMMM yyyy', { locale: currentLocale })}</p>
                            <p className="text-xs text-gray-500 group-hover:text-gray-300">{format(parseISO(data.resepsi_date), 'HH:mm', { locale: currentLocale })} WIB</p>
                         </div>
                      )}
                      <p className="text-sm leading-relaxed mb-8">{data.location_name || 'Grand Ballroom'}</p>
                      {data.maps_link && (
                         <a href={data.maps_link} target="_blank" rel="noreferrer" className="inline-block border-b border-current pb-1 uppercase text-xs font-bold tracking-widest">
                            Google Maps
                         </a>
                      )}
                   </div>
                </div>
             </div>
          </section>

          {/* Gallery */}
          <section className="py-24 px-6 border-t border-gray-100">
            <div className="max-w-6xl mx-auto text-center mb-16">
               <h3 className="text-xs font-bold uppercase tracking-[0.3em]">{t.gallery}</h3>
            </div>
            <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
               {[gallery1, gallery2, gallery3, gallery4].map((img, i) => (
                  <div key={i} className="aspect-square border border-gray-200 p-2">
                     <img src={img} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Gallery" />
                  </div>
               ))}
            </div>
          </section>

          {/* Gift */}
          <section className="py-32 px-6 bg-black text-white">
             <div className="max-w-2xl mx-auto text-center">
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-12">{t.gift}</h3>
                <p className="text-gray-400 mb-12 font-light leading-relaxed">Your presence is our greatest gift. However, if you wish to give a gift, you can transfer it below.</p>
                <div className="border border-white/20 p-8 md:p-12">
                   <p className="text-xl font-bold mb-2 uppercase tracking-widest">{data.bank_name_1 || "BCA"}</p>
                   <p className="text-3xl font-light mb-4 font-mono">{data.bank_account_1 || "0987654321"}</p>
                   <p className="text-sm text-gray-400 uppercase tracking-widest mb-8">A.N {data.bank_account_name_1 || groom}</p>
                   <button 
                     onClick={handleCopy}
                     className="px-8 py-4 bg-white text-black hover:bg-gray-200 transition-colors uppercase tracking-widest text-xs font-bold"
                   >
                     {isCopied ? 'Copied!' : 'Copy Account'}
                   </button>
                </div>
             </div>
          </section>

          {/* Guestbook */}
          <section className="py-32 px-6 bg-gray-50">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-16">
                 <h3 className="text-xs font-bold uppercase tracking-[0.3em]">{t.guestbook}</h3>
              </div>
              <div className="bg-white border border-gray-200 p-8 md:p-12 mb-12">
                <form onSubmit={handleAddComment} className="flex flex-col gap-6">
                  <input 
                    type="text" 
                    placeholder="Name" 
                    value={newName} 
                    onChange={e => setNewName(e.target.value)}
                    className="w-full border-b border-gray-300 py-3 bg-transparent focus:outline-none focus:border-black transition-colors placeholder:uppercase placeholder:text-xs placeholder:tracking-widest"
                    required
                  />
                  <textarea 
                    placeholder="Message" 
                    value={newMessage} 
                    onChange={e => setNewMessage(e.target.value)}
                    rows={4}
                    className="w-full border-b border-gray-300 py-3 bg-transparent focus:outline-none focus:border-black transition-colors resize-none placeholder:uppercase placeholder:text-xs placeholder:tracking-widest"
                    required
                  />
                  <button type="submit" className="self-end px-8 py-4 bg-black text-white hover:bg-gray-800 transition-colors uppercase tracking-widest text-xs font-bold mt-4">
                    Send Message
                  </button>
                </form>
              </div>

              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-200">
                {comments.map((comment) => (
                  <div key={comment.id} className="border border-gray-100 p-6 bg-white">
                    <p className="font-bold text-sm uppercase tracking-widest mb-3">{comment.name}</p>
                    <p className="text-gray-600 font-light leading-relaxed">{comment.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <footer className="py-12 text-center border-t border-gray-100">
             <p className="text-xs font-bold uppercase tracking-widest mb-4">Five Invitation</p>
             <p className="text-xs text-gray-400">© 2026 {groom} & {bride}. All rights reserved.</p>
          </footer>

        </div>
      </div>
    </SmoothScrollLayout>
  );
}
