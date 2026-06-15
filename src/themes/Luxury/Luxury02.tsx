import React, { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { id as localeId, enUS as localeEn } from 'date-fns/locale';
import { Quote, Heart, CalendarHeart, MapPin, Music, VolumeX, Copy, CheckCircle2 } from 'lucide-react';
import SmoothScrollLayout from '../../components/Interactive/SmoothScrollLayout';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import toast from 'react-hot-toast';
import { supabase } from '../../supabase/supabase';

// Helper component for fade-in elements
const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => {
  const { ref, inView } = useIntersectionObserver({ once: true, rootMargin: "-50px" });
  return (
    <div ref={ref} className={`transition-all duration-[1200ms] ease-out ${inView ? 'opacity-100 rotate-0 translate-y-0' : 'opacity-0 -rotate-2 translate-y-8'} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

export default function Luxury02({ data, guestName, lang = 'id' }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const groomName = data?.groom_name || "Jonathan";
  const brideName = data?.bride_name || "Eleanor";
  const dateStr = data?.akad_date || "2026-12-15T15:00:00";
  const weddingDate = new Date(dateStr);
  const currentLocale = lang === 'en' ? localeEn : localeId;
  
  const coverImage = data?.cover_image || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000";
  const heroImage = data?.hero_image || "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1000";
  const galleryImages = [
    data?.customizations?.gallery_1 || "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1000",
    data?.customizations?.gallery_2 || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000",
    data?.customizations?.gallery_3 || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000"
  ];

  // Intimate Royal Quarters Identity
  const colors = { bgMain: '#1C110A', bgAlt: '#2B1B12', accent: '#DFA878', text: '#F4EFE6' };
  const fonts = { heading: "'Cormorant Upright', serif", script: "'Monsieur La Doulaise', cursive", body: "'Montserrat', sans-serif" };

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Upright:wght@400;500;600&family=Monsieur+La+Doulaise&family=Montserrat:wght@300;400;500&display=swap';
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
      setMessagesList([{ sender_name: 'The Royal Court', message: 'May your private affair be filled with joy.', created_at: new Date().toISOString() }]);
    }
  }, [data?.id]);

  const handleRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data?.id) {
      toast.success("Preview: Presence Confirmed.");
      setMessagesList([{ sender_name: name, message: message, created_at: new Date().toISOString() }, ...messagesList]);
      setName(''); setMessage('');
      return;
    }
    setIsSubmitting(true);
    try {
      await supabase.from('rsvp').insert([{ order_id: data.id, guest_name: name, status, guest_count: guestCount }]);
      await supabase.from('guest_books').insert([{ order_id: data.id, sender_name: name, message }]);
      toast.success("RSVP Sent Successfully!");
      setMessagesList([{ sender_name: name, message, created_at: new Date().toISOString() }, ...messagesList]);
      setName(''); setMessage('');
    } catch {
      toast.error("Failed to send RSVP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cover Screen
  if (!isOpen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden" style={{ backgroundColor: colors.bgMain }}>
        <div className="absolute inset-0">
          <img src={coverImage} alt="Cover" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C110A] via-transparent to-[#1C110A] opacity-90"></div>
        </div>
        <div className="relative z-10 text-center px-6 max-w-lg mx-auto flex flex-col items-center">
          <div className="mb-8 w-[120px] h-[160px] rounded-t-full border border-[#DFA878]/40 overflow-hidden p-1">
             <div className="w-full h-full rounded-t-full overflow-hidden relative">
               <img src={coverImage} alt="Cover Inner" className="w-full h-full object-cover grayscale-[30%]" />
             </div>
          </div>
          <p className="text-sm tracking-[0.4em] mb-4 uppercase" style={{ color: colors.accent, fontFamily: fonts.body }}>You Are Invited</p>
          <h1 className="text-5xl md:text-6xl mb-6" style={{ fontFamily: fonts.script, color: colors.text }}>{brideName} &amp; {groomName}</h1>
          {guestName && (
            <div className="mb-10">
              <p className="text-xs tracking-widest opacity-60 mb-2 uppercase" style={{ color: colors.text, fontFamily: fonts.body }}>To Our Honored Guest</p>
              <p className="text-xl border-b border-[#DFA878]/30 pb-2 px-8 inline-block" style={{ fontFamily: fonts.heading, color: colors.accent }}>{guestName}</p>
            </div>
          )}
          <button onClick={handleOpen} className="px-10 py-4 bg-[#DFA878] text-[#1C110A] uppercase tracking-widest text-xs font-semibold hover:bg-[#F4EFE6] transition-colors rounded-none">
            Break The Seal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative selection:bg-[#DFA878]/30" style={{ backgroundColor: colors.bgMain, color: colors.text }}>
      {data?.music_url && (
        <audio ref={audioRef} loop src={data.music_url} />
      )}
      
      {/* Floating Music Button */}
      <button onClick={toggleAudio} className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#1C110A] border border-[#DFA878]/30 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
        {isPlaying ? <Music size={18} color={colors.accent} /> : <VolumeX size={18} color={colors.text} className="opacity-50" />}
      </button>

      <SmoothScrollLayout>
        {/* 1. Hero Section (The Unveiling) */}
        <section className="min-h-screen relative flex items-center justify-center overflow-hidden pt-20 pb-32">
           <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#DFA878] via-[#1C110A] to-[#1C110A]"></div>
           <div className="z-10 w-full px-6 flex flex-col items-center">
             <m.div 
               initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, ease: "easeOut" }}
               className="relative w-full max-w-sm mx-auto"
             >
               {/* Intertwined Crest */}
               <div className="absolute -top-16 left-1/2 -translate-x-1/2 text-8xl opacity-80 z-20 flex" style={{ fontFamily: fonts.script, color: colors.accent }}>
                 <span className="-mr-6">{groomName[0]}</span>
                 <span className="mt-8">{brideName[0]}</span>
               </div>
               
               {/* Arched Hero Window */}
               <div className="w-full aspect-[2/3] rounded-t-full border border-[#DFA878]/50 p-2 bg-[#2B1B12] shadow-2xl relative overflow-hidden group">
                  <div className="w-full h-full rounded-t-full overflow-hidden relative">
                    <img src={heroImage} alt="Hero" className="w-full h-full object-cover transition-transform duration-[20s] group-hover:scale-110" />
                    <div className="absolute inset-0 bg-[#1C110A]/10"></div>
                  </div>
               </div>
             </m.div>

             <m.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1.5 }}
               className="text-center mt-12"
             >
               <h2 className="text-2xl md:text-3xl tracking-[0.3em] uppercase mb-4" style={{ fontFamily: fonts.heading, color: colors.accent }}>{brideName} <span className="text-sm lowercase italic opacity-60">and</span> {groomName}</h2>
               <p className="text-sm tracking-widest opacity-80 uppercase" style={{ fontFamily: fonts.body }}>{format(weddingDate, 'dd . MM . yyyy')}</p>
             </m.div>
           </div>
        </section>

        {/* Divider */}
        <div className="w-full flex justify-center py-8">
           <div className="w-1/3 h-px bg-gradient-to-r from-transparent via-[#DFA878]/30 to-transparent relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#DFA878] text-[8px]">♦</div>
           </div>
        </div>

        {/* 2. Story / Quote */}
        <section className="py-24 px-6 text-center" style={{ backgroundColor: colors.bgAlt }}>
           <FadeIn className="max-w-2xl mx-auto">
             <Quote size={32} className="mx-auto mb-8 opacity-40" color={colors.accent} />
             <h3 className="text-3xl md:text-5xl leading-tight mb-8" style={{ fontFamily: fonts.heading, color: colors.accent }}>A Tale of Intimate Grace</h3>
             <p className="text-lg md:text-xl opacity-80 leading-relaxed italic" style={{ fontFamily: fonts.body }}>
               "In the quiet corners of the world, we found our loudest joy. Join us as we celebrate a union woven in the private quarters of our hearts."
             </p>
           </FadeIn>
        </section>

        {/* 3. The Heirloom Gallery */}
        <section className="py-32 px-4 relative">
          <div className="max-w-5xl mx-auto">
             <FadeIn>
               <h3 className="text-center text-4xl md:text-5xl mb-20 uppercase tracking-widest" style={{ fontFamily: fonts.heading, color: colors.accent }}>The Heirlooms</h3>
             </FadeIn>

             <div className="flex flex-col gap-24 items-center">
               {/* Oval Portrait */}
               <FadeIn className="w-full md:w-1/2 flex justify-center">
                 <div className="w-64 h-80 md:w-80 md:h-96 rounded-[100%] border-[1px] p-2" style={{ borderColor: `${colors.accent}50` }}>
                    <div className="w-full h-full rounded-[100%] overflow-hidden">
                      <img src={galleryImages[0]} alt="Gallery 1" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                 </div>
               </FadeIn>

               {/* Landscape Rect */}
               <FadeIn delay={200} className="w-full md:w-3/4 flex justify-center">
                 <div className="w-full aspect-[16/9] border-[1px] p-2" style={{ borderColor: `${colors.accent}50` }}>
                    <div className="w-full h-full overflow-hidden">
                      <img src={galleryImages[1]} alt="Gallery 2" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 grayscale-[20%]" />
                    </div>
                 </div>
               </FadeIn>

               {/* Arched Window */}
               <FadeIn delay={400} className="w-full md:w-1/2 flex justify-center">
                 <div className="w-64 md:w-80 aspect-[2/3] rounded-t-full border-[1px] p-2" style={{ borderColor: `${colors.accent}50` }}>
                    <div className="w-full h-full rounded-t-full overflow-hidden">
                      <img src={galleryImages[2]} alt="Gallery 3" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                 </div>
               </FadeIn>
             </div>
          </div>
        </section>

        {/* 4. Event Details */}
        <section className="py-24 px-6 relative" style={{ backgroundColor: colors.bgAlt }}>
           <FadeIn className="max-w-4xl mx-auto">
              <h3 className="text-center text-3xl md:text-4xl mb-16 uppercase tracking-widest" style={{ fontFamily: fonts.heading, color: colors.accent }}>The Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
                 <div className="text-center">
                   <CalendarHeart size={28} className="mx-auto mb-6" color={colors.accent} />
                   <h4 className="text-2xl mb-4" style={{ fontFamily: fonts.heading, color: colors.accent }}>Holy Matrimony</h4>
                   <p className="uppercase tracking-widest text-sm mb-2" style={{ fontFamily: fonts.body }}>{format(weddingDate, 'EEEE, dd MMMM yyyy', { locale: currentLocale })}</p>
                   <p className="opacity-60 text-sm mb-6">09:00 WIB - 11:00 WIB</p>
                   <p className="italic opacity-80 leading-relaxed text-sm">The Grand Conservatory<br/>Jl. Mawar Elok No. 25</p>
                 </div>
                 <div className="text-center">
                   <MapPin size={28} className="mx-auto mb-6" color={colors.accent} />
                   <h4 className="text-2xl mb-4" style={{ fontFamily: fonts.heading, color: colors.accent }}>Royal Reception</h4>
                   <p className="uppercase tracking-widest text-sm mb-2" style={{ fontFamily: fonts.body }}>{format(weddingDate, 'EEEE, dd MMMM yyyy', { locale: currentLocale })}</p>
                   <p className="opacity-60 text-sm mb-6">19:00 WIB - Selesai</p>
                   <p className="italic opacity-80 leading-relaxed text-sm">The Velvet Ballroom<br/>Jl. Mawar Elok No. 25</p>
                 </div>
              </div>
           </FadeIn>
        </section>

        {/* 5. The Guest Ledger & Token of Grace */}
        <section className="py-32 px-4 relative">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
             
             {/* The Guest Ledger (RSVP) */}
             <FadeIn>
               <h3 className="text-4xl mb-12 text-center lg:text-left" style={{ fontFamily: fonts.script, color: colors.accent }}>The Guest Ledger</h3>
               <form onSubmit={handleRSVP} className="space-y-10">
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2 opacity-60" style={{ fontFamily: fonts.body }}>Noble Name</label>
                    <input type="text" required value={name} onChange={e => setName(e.target.value)}
                      className="w-full px-0 py-2 bg-transparent border-0 border-b border-[#DFA878]/30 outline-none focus:border-[#DFA878] transition-colors" 
                      style={{ color: colors.text, fontFamily: fonts.heading, fontSize: '1.25rem' }} />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-xs uppercase tracking-widest mb-2 opacity-60" style={{ fontFamily: fonts.body }}>Presence</label>
                      <select value={status} onChange={e => setStatus(e.target.value)}
                        className="w-full px-0 py-2 bg-transparent border-0 border-b border-[#DFA878]/30 outline-none focus:border-[#DFA878] appearance-none"
                        style={{ color: colors.text, fontFamily: fonts.heading, fontSize: '1.25rem' }}>
                        <option value="ATTENDING" style={{ color: '#000' }}>Joyfully Attending</option>
                        <option value="NOT_ATTENDING" style={{ color: '#000' }}>Regretfully Declining</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest mb-2 opacity-60" style={{ fontFamily: fonts.body }}>Guests</label>
                      <select value={guestCount} onChange={e => setGuestCount(Number(e.target.value))}
                        className="w-full px-0 py-2 bg-transparent border-0 border-b border-[#DFA878]/30 outline-none focus:border-[#DFA878] appearance-none"
                        style={{ color: colors.text, fontFamily: fonts.heading, fontSize: '1.25rem' }}>
                        {[1,2,3,4,5].map(n => <option key={n} value={n} style={{ color: '#000' }}>{n} {n===1?'Person':'People'}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2 opacity-60" style={{ fontFamily: fonts.body }}>Blessings</label>
                    <textarea required value={message} onChange={e => setMessage(e.target.value)} rows={2}
                      className="w-full px-0 py-2 bg-transparent border-0 border-b border-[#DFA878]/30 outline-none focus:border-[#DFA878] resize-none" 
                      style={{ color: colors.text, fontFamily: fonts.heading, fontSize: '1.25rem' }} />
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full py-4 text-left border-0 border-b-2 border-[#DFA878]/50 hover:border-[#DFA878] transition-colors flex justify-between items-center group">
                    <span className="text-3xl group-hover:text-[#DFA878] transition-colors" style={{ fontFamily: fonts.script }}>Confirm Presence</span>
                    <CheckCircle2 size={24} className="opacity-0 group-hover:opacity-100 transition-opacity" color={colors.accent} />
                  </button>
               </form>
             </FadeIn>

             {/* Token of Grace (Gift) */}
             <FadeIn delay={300}>
                <div className="mb-16">
                   <h3 className="text-4xl mb-6 text-center lg:text-left" style={{ fontFamily: fonts.script, color: colors.accent }}>Token of Grace</h3>
                   <p className="text-sm opacity-70 mb-8 italic text-center lg:text-left leading-relaxed" style={{ fontFamily: fonts.body }}>
                     Your prayers are our most treasured gift. However, should you wish to bless us further:
                   </p>
                   <div className="p-8 border border-[#DFA878]/20 bg-[#2B1B12] text-center relative group">
                      <p className="text-xs uppercase tracking-widest mb-3 opacity-80" style={{ fontFamily: fonts.body }}>{data?.customizations?.bank_name || 'Bank Central Asia'}</p>
                      
                      <div className="flex items-center justify-center gap-4 mb-4">
                        <p className="text-2xl tracking-[0.2em]" style={{ fontFamily: fonts.heading, color: colors.accent }}>
                           {(data?.customizations?.bank_account || '1234567890').replace(/(\d{4})/g, '$1 ♦ ').replace(/♦ $/, '')}
                        </p>
                        <button onClick={() => {
                          navigator.clipboard.writeText(data?.customizations?.bank_account || '1234567890');
                          toast.success('Copied to parchment!');
                        }} className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Copy size={16} color={colors.accent} />
                        </button>
                      </div>

                      <p className="text-sm opacity-80 uppercase tracking-widest" style={{ fontFamily: fonts.body }}>{data?.customizations?.bank_owner || groomName}</p>
                   </div>
                </div>

                {/* Messages Board */}
                <div className="border-t border-[#DFA878]/20 pt-8">
                   <h4 className="text-xs uppercase tracking-widest mb-8 opacity-60 text-center lg:text-left" style={{ fontFamily: fonts.body }}>Recorded Decrees</h4>
                   <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin w-full overflow-hidden" style={{ scrollbarColor: `${colors.accent} transparent` }}>
                      {messagesList.map((msg, i) => (
                        <div key={i} className="w-full">
                          <p className="text-xl mb-1 truncate" style={{ fontFamily: fonts.heading, color: colors.accent }}>{msg.sender_name}</p>
                          <p className="text-sm opacity-80 italic leading-relaxed break-words" style={{ fontFamily: fonts.body }}>"{msg.message}"</p>
                        </div>
                      ))}
                   </div>
                </div>
             </FadeIn>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-20 text-center relative overflow-hidden">
           <div className="absolute inset-0 bg-[#2B1B12] opacity-50"></div>
           <div className="relative z-10">
             <div className="text-6xl mb-6 opacity-80 flex justify-center gap-4" style={{ fontFamily: fonts.script, color: colors.accent }}>
               <span>{groomName[0]}</span>
               <span className="mt-4">{brideName[0]}</span>
             </div>
             <p className="text-sm uppercase tracking-widest opacity-60 mb-8" style={{ fontFamily: fonts.body }}>Thank you for being part of our story</p>
             <p className="text-[10px] uppercase tracking-[0.3em] opacity-30" style={{ fontFamily: fonts.body }}>Powered by FiveInvitation</p>
           </div>
        </footer>
      </SmoothScrollLayout>
    </div>
  );
}
