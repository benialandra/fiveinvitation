import React, { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { id as localeId, enUS as localeEn } from 'date-fns/locale';
import { Heart, Music, VolumeX, CalendarHeart, MapPin, Gift, Clock, Quote } from 'lucide-react';
import SmoothScrollLayout from '../../components/Interactive/SmoothScrollLayout';
import { GoldenParticles } from '../../components/Theme/Animations';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import toast from 'react-hot-toast';
import { supabase } from '../../supabase/supabase';

// Helper component for fade-in elements
const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => {
  const { ref, inView } = useIntersectionObserver({ once: true, rootMargin: "-50px" });
  return (
    <div ref={ref} className={`transition-all duration-1000 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

export default function RoyalElegance({ data, guestName, lang = 'id' }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const groomName = data?.groom_name || "Ahmad Rifqi";
  const brideName = data?.bride_name || "Sarah Kamila";
  const dateStr = data?.akad_date || "2026-11-20T09:00:00";
  const weddingDate = new Date(dateStr);
  const currentLocale = lang === 'en' ? localeEn : localeId;
  
  const coverImage = data?.cover_image || "https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=600";
  const heroImage = data?.hero_image || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000";
  const galleryImages = [
    data?.customizations?.gallery_1 || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000",
    data?.customizations?.gallery_2 || "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000",
    data?.customizations?.gallery_3 || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000",
    data?.customizations?.gallery_4 || "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1000"
  ];

  // Royal Palace Identity Configuration
  const colors = { primary: '#D4AF37', background: '#0B1B3D', text: '#FDFBF7', accent: '#061026' };
  const fonts = { heading: "'Cinzel', serif", body: "'Cormorant Garamond', serif" };

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  // RSVP State
  const [name, setName] = useState('');
  const [status, setStatus] = useState('ATTENDING');
  const [guestCount, setGuestCount] = useState(1);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messagesList, setMessagesList] = useState<any[]>([]);

  useEffect(() => {
    if (data?.id) {
      supabase.from('guest_books').select('*').eq('order_id', data.id).order('created_at', { ascending: false }).then(({ data: msgs }) => {
        if (msgs) setMessagesList(msgs);
      });
    } else {
      setMessagesList([{ sender_name: 'The Royal Court', message: 'May your union be blessed with eternal joy and prosperity.', created_at: new Date().toISOString() }]);
    }
  }, [data?.id]);

  const handleRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data?.id) {
      toast.success("Preview: Your royal decree has been sealed.");
      setMessagesList([{ sender_name: name, message: message, created_at: new Date().toISOString() }, ...messagesList]);
      setName(''); setMessage('');
      return;
    }
    setIsSubmitting(true);
    try {
      await supabase.from('rsvp').insert([{ order_id: data.id, guest_name: name, status, guest_count: guestCount }]);
      await supabase.from('guest_books').insert([{ order_id: data.id, sender_name: name, message }]);
      toast.success("RSVP Sent Successfully!");
      setMessagesList([{ sender_name: name, message: message, created_at: new Date().toISOString() }, ...messagesList]);
      setName(''); setMessage('');
    } catch (err) {
      toast.error("Error sending RSVP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden selection:bg-[#D4AF37]/30 min-h-screen" style={{ fontFamily: fonts.body, backgroundColor: colors.background, color: colors.text }}>
      <GoldenParticles />
      <audio ref={audioRef} loop>
        <source src="https://assets.mixkit.co/music/preview/mixkit-relaxing-light-piano-music-421.mp3" type="audio/mpeg" />
      </audio>

      {/* Floating Audio Button */}
      <AnimatePresence>
        {isOpen && (
          <m.button
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            onClick={toggleAudio}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-full backdrop-blur-md shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center cursor-pointer border"
            style={{ backgroundColor: `${colors.accent}AA`, color: colors.primary, borderColor: `${colors.primary}50` }}
          >
            {isPlaying ? (
              <m.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }}>
                <Music size={20} />
              </m.div>
            ) : <VolumeX size={20} />}
          </m.button>
        )}
      </AnimatePresence>

      {/* 1. The Royal Gate (Cover) */}
      <AnimatePresence>
        {!isOpen && (
          <m.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center text-center px-4 overflow-hidden"
            style={{ backgroundColor: colors.accent }}
          >
            {/* Ornate Gate Background */}
            <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30">
              <div className="w-[90%] h-[95%] border-[1px] border-[#D4AF37] rounded-t-full relative">
                <div className="absolute inset-2 border-[1px] border-[#D4AF37]/50 rounded-t-full"></div>
              </div>
            </div>

            <div className="relative z-10 max-w-md mx-auto flex flex-col items-center justify-center p-12 bg-[#0B1B3D]/80 backdrop-blur-sm border-[1px] shadow-2xl" style={{ borderColor: `${colors.primary}50` }}>
              <m.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className="mb-8" style={{ color: colors.primary }}>
                {/* Custom Wax Seal Icon representation */}
                <div className="w-16 h-16 rounded-full border border-[#D4AF37] flex items-center justify-center bg-[#0B1B3D]">
                  <span className="text-2xl" style={{ fontFamily: fonts.heading }}>{brideName[0]}&amp;{groomName[0]}</span>
                </div>
              </m.div>

              <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.5 }} className="text-[10px] tracking-[0.3em] uppercase mb-4 text-[#D4AF37]">
                The Wedding Of
              </m.div>

              <m.h1 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.7 }}
                className="text-4xl md:text-5xl font-normal mb-8 leading-tight" style={{ fontFamily: fonts.heading }}
              >
                {brideName} <br/><span className="italic font-light text-[#D4AF37] text-2xl">&amp;</span><br/> {groomName}
              </m.h1>

              {guestName && (
                <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }} className="mb-10 w-full border-t border-b py-4" style={{ borderColor: `${colors.primary}30` }}>
                  <p className="text-[9px] tracking-[0.2em] uppercase mb-1 text-[#D4AF37]/70">Exclusively Invited</p>
                  <p className="text-xl font-medium tracking-wider">{guestName}</p>
                </m.div>
              )}

              <m.button
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.2 }}
                onClick={handleOpen}
                className="group relative px-10 py-4 overflow-hidden border transition-all duration-700 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
                style={{ borderColor: colors.primary }}
              >
                <div className="absolute inset-0 bg-[#D4AF37] transition-transform duration-700 translate-y-full group-hover:translate-y-0"></div>
                <span className="relative z-10 text-xs uppercase tracking-[0.25em] font-medium group-hover:text-[#0B1B3D] transition-colors duration-700">Open Invitation</span>
              </m.button>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {isOpen && (
        <SmoothScrollLayout>
          {/* 2. The Grand Hall (Hero) */}
          <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
            <div className="absolute inset-0 z-0">
               <img src={heroImage} alt="Hero" className="w-full h-full object-cover opacity-40 mix-blend-overlay filter contrast-125" />
               <div className="absolute inset-0 bg-gradient-to-b from-[#0B1B3D]/80 via-transparent to-[#0B1B3D]"></div>
            </div>
            
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
               <FadeIn delay={200}>
                 <div className="w-px h-24 bg-gradient-to-b from-transparent to-[#D4AF37] mx-auto mb-8"></div>
               </FadeIn>
               <FadeIn delay={400} className="mb-4">
                 <span className="text-sm md:text-base tracking-[0.3em] uppercase text-[#D4AF37]">We Joyfully Announce</span>
               </FadeIn>
               <FadeIn delay={600}>
                 <h2 className="text-6xl md:text-8xl mb-6 leading-none" style={{ fontFamily: fonts.heading }}>
                   {brideName}
                 </h2>
                 <div className="flex items-center justify-center gap-6 my-4">
                    <div className="h-px w-16 md:w-24 bg-[#D4AF37]/50"></div>
                    <span className="text-4xl italic text-[#D4AF37]">&amp;</span>
                    <div className="h-px w-16 md:w-24 bg-[#D4AF37]/50"></div>
                 </div>
                 <h2 className="text-6xl md:text-8xl mb-12 leading-none" style={{ fontFamily: fonts.heading }}>
                   {groomName}
                 </h2>
               </FadeIn>
               <FadeIn delay={800}>
                 <p className="text-xl md:text-2xl tracking-widest text-[#D4AF37]">
                   {format(weddingDate, 'dd . MM . yyyy')}
                 </p>
               </FadeIn>
            </div>
          </section>

          {/* 3. The Royal Decree (Story/Timeline) */}
          <section className="py-24 px-6 relative bg-[#061026]">
            {/* Ornate Corner Elements */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#D4AF37] opacity-50"></div>
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#D4AF37] opacity-50"></div>
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[#D4AF37] opacity-50"></div>
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#D4AF37] opacity-50"></div>

            <div className="max-w-3xl mx-auto text-center relative z-10">
              <FadeIn>
                <h3 className="text-4xl md:text-5xl mb-16 text-[#D4AF37]" style={{ fontFamily: fonts.heading }}>Our Chapter</h3>
              </FadeIn>
              
              <div className="relative border-l border-[#D4AF37]/30 pl-8 ml-4 md:mx-auto md:border-l-0 md:pl-0">
                {/* Timeline Line Desktop */}
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#D4AF37]/10 via-[#D4AF37]/50 to-[#D4AF37]/10 -translate-x-1/2"></div>
                
                <FadeIn delay={200} className="mb-16 relative md:flex md:justify-between md:items-center">
                  <div className="hidden md:block w-5/12 text-right pr-12">
                    <h4 className="text-2xl mb-2 text-[#D4AF37]" style={{ fontFamily: fonts.heading }}>First Glance</h4>
                    <p className="text-sm tracking-widest uppercase opacity-60 mb-4">January 2022</p>
                  </div>
                  <div className="absolute -left-10 md:left-1/2 top-0 md:top-auto w-4 h-4 bg-[#0B1B3D] border-2 border-[#D4AF37] rotate-45 transform md:-translate-x-1/2 mt-1 md:mt-0"></div>
                  <div className="md:w-5/12 md:pl-12 text-left">
                    <h4 className="md:hidden text-2xl mb-1 text-[#D4AF37]" style={{ fontFamily: fonts.heading }}>First Glance</h4>
                    <p className="md:hidden text-xs tracking-widest uppercase opacity-60 mb-3">January 2022</p>
                    <p className="opacity-80 leading-relaxed text-lg italic">"It was a brief encounter in the grand hall, but time seemed to stand still as our eyes met."</p>
                  </div>
                </FadeIn>

                <FadeIn delay={400} className="mb-16 relative md:flex md:justify-between md:items-center">
                  <div className="md:w-5/12 text-left md:text-right md:pr-12">
                     <h4 className="md:hidden text-2xl mb-1 text-[#D4AF37]" style={{ fontFamily: fonts.heading }}>The Proposal</h4>
                     <p className="md:hidden text-xs tracking-widest uppercase opacity-60 mb-3">December 2024</p>
                     <p className="opacity-80 leading-relaxed text-lg italic">"Under a canopy of stars, a promise was made to share the throne of our hearts forever."</p>
                  </div>
                  <div className="absolute -left-10 md:left-1/2 top-0 md:top-auto w-4 h-4 bg-[#0B1B3D] border-2 border-[#D4AF37] rotate-45 transform md:-translate-x-1/2 mt-1 md:mt-0"></div>
                  <div className="hidden md:block w-5/12 pl-12 text-left">
                    <h4 className="text-2xl mb-2 text-[#D4AF37]" style={{ fontFamily: fonts.heading }}>The Proposal</h4>
                    <p className="text-sm tracking-widest uppercase opacity-60 mb-4">December 2024</p>
                  </div>
                </FadeIn>
              </div>
            </div>
          </section>

          {/* 4. The Palace Gallery (Fresco Style) */}
          <section className="py-24 px-4 bg-[#0B1B3D]">
            <FadeIn>
              <h3 className="text-center text-4xl md:text-5xl mb-16 text-[#D4AF37]" style={{ fontFamily: fonts.heading }}>The Royal Portraits</h3>
            </FadeIn>
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 md:gap-10">
               {/* Large Portrait */}
               <FadeIn delay={200} className="w-full md:w-1/2">
                 <div className="p-3 border border-[#D4AF37]/30 bg-[#061026]">
                   <div className="border border-[#D4AF37]/20 relative aspect-[3/4] overflow-hidden group">
                     <img src={galleryImages[0]} alt="Gallery 1" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                     <div className="absolute inset-0 bg-[#0B1B3D]/20 group-hover:bg-transparent transition-colors duration-700"></div>
                   </div>
                 </div>
               </FadeIn>
               {/* Smaller Portraits Grid */}
               <div className="w-full md:w-1/2 grid grid-cols-2 gap-4 md:gap-6">
                 {galleryImages.slice(1, 4).map((img, idx) => (
                   <FadeIn key={idx} delay={300 + (idx * 150)} className={idx === 2 ? 'col-span-2' : 'col-span-1'}>
                     <div className="p-2 border border-[#D4AF37]/30 bg-[#061026]">
                       <div className={`border border-[#D4AF37]/20 relative overflow-hidden group ${idx === 2 ? 'aspect-[21/9]' : 'aspect-[3/4]'}`}>
                         <img src={img} alt={`Gallery ${idx+2}`} className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-700 hover:scale-105" />
                       </div>
                     </div>
                   </FadeIn>
                 ))}
               </div>
            </div>
          </section>

          {/* Event Details */}
          <section className="py-24 px-6 bg-[#061026] text-center border-y border-[#D4AF37]/20 relative">
             <FadeIn>
                <h3 className="text-4xl md:text-5xl mb-16 text-[#D4AF37]" style={{ fontFamily: fonts.heading }}>The Grand Celebration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-4xl mx-auto">
                   <div className="p-8 border border-[#D4AF37]/20 relative">
                     <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#061026] px-4 text-[#D4AF37]">
                        <Quote size={24} />
                     </div>
                     <h4 className="text-2xl mb-4 text-[#D4AF37]" style={{ fontFamily: fonts.heading }}>Akad Nikah</h4>
                     <p className="text-xl mb-2">{format(weddingDate, 'EEEE, d MMMM yyyy', { locale: currentLocale })}</p>
                     <p className="opacity-80 mb-6">09:00 WIB - Selesai</p>
                     <p className="italic opacity-80 leading-relaxed">Masjid Raya Istana<br/>Jl. Kerajaan No. 1</p>
                   </div>
                   <div className="p-8 border border-[#D4AF37]/20 relative">
                     <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#061026] px-4 text-[#D4AF37]">
                        <Heart size={24} />
                     </div>
                     <h4 className="text-2xl mb-4 text-[#D4AF37]" style={{ fontFamily: fonts.heading }}>Resepsi</h4>
                     <p className="text-xl mb-2">{format(weddingDate, 'EEEE, d MMMM yyyy', { locale: currentLocale })}</p>
                     <p className="opacity-80 mb-6">19:00 WIB - Selesai</p>
                     <p className="italic opacity-80 leading-relaxed">Grand Ballroom The Palace<br/>Jl. Kerajaan No. 1</p>
                   </div>
                </div>
             </FadeIn>
          </section>

          {/* 5. Royal RSVP & Gift */}
          <section className="py-24 px-4 bg-[#0B1B3D] relative">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              
              {/* RSVP Form */}
              <FadeIn>
                <div className="p-10 md:p-12 border border-[#D4AF37]/40 bg-[#061026] relative shadow-2xl">
                   {/* Wax Seal detail */}
                   <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#0B1B3D] border-2 border-[#D4AF37] flex items-center justify-center">
                     <div className="w-8 h-8 rounded-full border border-[#D4AF37]/50"></div>
                   </div>
                   
                   <h3 className="text-3xl mb-8 text-center text-[#D4AF37] mt-4" style={{ fontFamily: fonts.heading }}>RSVP</h3>
                   <form onSubmit={handleRSVP} className="space-y-6">
                      <input type="text" placeholder="Your Noble Name" required value={name} onChange={e => setName(e.target.value)}
                        className="w-full px-0 py-3 bg-transparent border-b border-[#D4AF37]/30 outline-none focus:border-[#D4AF37] transition-colors placeholder:text-[#FDFBF7]/40 text-[#FDFBF7]" />
                      
                      <select value={status} onChange={e => setStatus(e.target.value)}
                        className="w-full px-0 py-3 bg-transparent border-b border-[#D4AF37]/30 outline-none focus:border-[#D4AF37] text-[#FDFBF7] [&>option]:text-black">
                        <option value="ATTENDING">Will Attend the Royal Banquet</option>
                        <option value="NOT_ATTENDING">Sending Regrets</option>
                      </select>

                      <textarea placeholder="Your blessings and wishes..." required value={message} onChange={e => setMessage(e.target.value)} rows={3}
                        className="w-full px-0 py-3 bg-transparent border-b border-[#D4AF37]/30 outline-none focus:border-[#D4AF37] resize-none placeholder:text-[#FDFBF7]/40 text-[#FDFBF7]" />
                      
                      <button type="submit" disabled={isSubmitting} className="w-full mt-8 py-4 border border-[#D4AF37] text-[#D4AF37] uppercase tracking-[0.2em] text-xs hover:bg-[#D4AF37] hover:text-[#0B1B3D] transition-all duration-500">
                        {isSubmitting ? 'Sealing Decree...' : 'Seal Your Reply'}
                      </button>
                   </form>
                </div>
              </FadeIn>

              {/* Messages & Gifts */}
              <FadeIn delay={200}>
                <div className="text-center mb-16">
                   <h3 className="text-3xl mb-4 text-[#D4AF37]" style={{ fontFamily: fonts.heading }}>Royal Treasury</h3>
                   <p className="opacity-70 mb-8 italic">Your presence is our greatest gift. Should you wish to send a token of blessing:</p>
                   <div className="p-6 border border-[#D4AF37]/20 inline-block bg-[#061026]">
                     <p className="text-lg font-bold tracking-widest mb-1">{data?.customizations?.bank_name || 'BCA'}</p>
                     <p className="text-2xl mb-2 text-[#D4AF37] font-mono">{data?.customizations?.bank_account || '1234567890'}</p>
                     <p className="opacity-80 uppercase tracking-widest text-xs">{data?.customizations?.bank_owner || groomName}</p>
                   </div>
                </div>

                <div>
                   <h3 className="text-2xl mb-8 text-[#D4AF37] text-center" style={{ fontFamily: fonts.heading }}>Decrees of Joy</h3>
                   <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4" style={{ scrollbarWidth: 'thin', scrollbarColor: '#D4AF37 transparent' }}>
                      {messagesList.map((msg, i) => (
                        <div key={i} className="pb-6 border-b border-[#D4AF37]/20 w-full overflow-hidden">
                          <p className="text-[#D4AF37] text-lg mb-2 truncate" style={{ fontFamily: fonts.heading }} title={msg.sender_name}>{msg.sender_name}</p>
                          <p className="opacity-80 italic leading-relaxed break-words">"{msg.message}"</p>
                        </div>
                      ))}
                   </div>
                </div>
              </FadeIn>

            </div>
          </section>

          <footer className="py-12 bg-[#061026] text-center border-t border-[#D4AF37]/20">
            <p className="text-[#D4AF37] mb-2 text-2xl" style={{ fontFamily: fonts.heading }}>{brideName} &amp; {groomName}</p>
            <p className="text-xs uppercase tracking-[0.3em] opacity-50 mb-8">Eternally Yours</p>
            <p className="text-[10px] opacity-30">Powered by FiveInvitation</p>
          </footer>
        </SmoothScrollLayout>
      )}
    </div>
  );
}