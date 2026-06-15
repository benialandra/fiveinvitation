import React, { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { id as localeId, enUS as localeEn } from 'date-fns/locale';
import { Quote, Heart, CalendarHeart, MapPin, Music, VolumeX, Copy, ArrowRight } from 'lucide-react';
import SmoothScrollLayout from '../../components/Interactive/SmoothScrollLayout';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import toast from 'react-hot-toast';
import { supabase } from '../../supabase/supabase';

// Helper component for sharp mask-reveal animations
const MaskReveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => {
  const { ref, inView } = useIntersectionObserver({ once: true, rootMargin: "-50px" });
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div 
        className="transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]" 
        style={{ transform: inView ? 'translateY(0)' : 'translateY(100%)', transitionDelay: `${delay}ms` }}
      >
        {children}
      </div>
    </div>
  );
};

export default function Luxury03({ data, guestName, lang = 'id' }: any) {
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

  // Haute Couture & Alabaster Identity
  const colors = { bgMain: '#FCFBF9', bgAlt: '#111111', textMain: '#111111', textAlt: '#FCFBF9', accent: '#A0A0A0' };
  const fonts = { heading: "'Playfair Display', serif", script: "'La Belle Aurore', cursive", body: "'Inter', sans-serif" };

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&family=La+Belle+Aurore&family=Inter:wght@300;400;500;600&display=swap';
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
      setMessagesList([{ sender_name: 'Editorial Team', message: 'Wishing you a timeless celebration.', created_at: new Date().toISOString() }]);
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
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden" style={{ backgroundColor: colors.bgMain, color: colors.textMain }}>
        <div className="absolute inset-0">
          <img src={coverImage} alt="Cover" className="w-full h-full object-cover grayscale opacity-20" />
        </div>
        <div className="relative z-10 w-full max-w-2xl px-6 flex flex-col items-center justify-center h-full">
          <p className="text-xs tracking-[0.4em] uppercase mb-12 font-light" style={{ fontFamily: fonts.body }}>Invitation</p>
          
          <h1 className="text-6xl md:text-8xl italic mb-4 text-center leading-none" style={{ fontFamily: fonts.heading }}>
            {brideName}
            <span className="block text-4xl md:text-6xl mt-2 not-italic text-[#A0A0A0]">&amp; {groomName}</span>
          </h1>

          <div className="my-16 w-px h-24 bg-[#111111]/20"></div>
          
          {guestName && (
            <div className="mb-16 text-center">
              <p className="text-[10px] tracking-widest uppercase opacity-50 mb-4" style={{ fontFamily: fonts.body }}>Honored Guest</p>
              <p className="text-xl md:text-2xl" style={{ fontFamily: fonts.heading }}>{guestName}</p>
            </div>
          )}
          <button onClick={handleOpen} className="px-12 py-4 bg-[#111111] text-[#FCFBF9] uppercase tracking-[0.3em] text-xs transition-transform hover:scale-105">
            Enter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative selection:bg-[#111111] selection:text-[#FCFBF9]" style={{ backgroundColor: colors.bgMain, color: colors.textMain }}>
      {data?.music_url && <audio ref={audioRef} loop src={data.music_url} />}
      
      {/* Floating Music Button */}
      <button onClick={toggleAudio} className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#111111] text-[#FCFBF9] flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
        {isPlaying ? <Music size={16} /> : <VolumeX size={16} className="opacity-50" />}
      </button>

      <SmoothScrollLayout>
        {/* 1. Vogue Cover Hero Section */}
        <section className="relative w-full h-[100svh] overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0">
             <img src={heroImage} alt="Hero" className="w-full h-full object-cover grayscale opacity-90" />
          </div>
          
          {/* Frosted Glass Pane */}
          <div className="absolute inset-x-4 md:inset-x-12 top-1/2 -translate-y-1/2 h-[70vh] bg-white/60 backdrop-blur-xl border border-white/40 flex flex-col items-center justify-center shadow-2xl p-6">
             <div className="absolute -top-12 md:-top-20 left-0 w-full overflow-hidden flex justify-between px-4 opacity-10 pointer-events-none">
                <span className="text-[12rem] md:text-[20rem] leading-none" style={{ fontFamily: fonts.heading }}>{brideName[0]}</span>
                <span className="text-[12rem] md:text-[20rem] leading-none mt-20" style={{ fontFamily: fonts.heading }}>{groomName[0]}</span>
             </div>
             
             <div className="relative z-10 text-center w-full">
                <m.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.16,1,0.3,1] }}>
                   <p className="text-[10px] md:text-xs tracking-[0.4em] uppercase mb-8" style={{ fontFamily: fonts.body }}>The Wedding Of</p>
                </m.div>
                
                <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}>
                   <h2 className="text-4xl md:text-6xl italic leading-tight" style={{ fontFamily: fonts.heading }}>
                     {brideName} <br/><span className="not-italic">&amp;</span> {groomName}
                   </h2>
                </m.div>

                <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 1 }}>
                   <div className="w-px h-16 bg-[#111111]/30 mx-auto my-8"></div>
                   <p className="text-sm md:text-base tracking-[0.2em] uppercase font-light" style={{ fontFamily: fonts.body }}>
                     {format(weddingDate, 'MM . dd . yyyy')}
                   </p>
                </m.div>
             </div>
          </div>
        </section>

        {/* 2. Story / Editorial Quote */}
        <section className="py-32 px-6 md:px-16 lg:px-32 relative">
           <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-16 items-start">
              <div className="lg:w-1/3">
                 <MaskReveal>
                   <p className="text-[10px] tracking-[0.3em] uppercase opacity-50 mb-4" style={{ fontFamily: fonts.body }}>Chapter I</p>
                 </MaskReveal>
                 <MaskReveal delay={100}>
                   <h3 className="text-4xl italic" style={{ fontFamily: fonts.heading }}>The Prologue</h3>
                 </MaskReveal>
              </div>
              <div className="lg:w-2/3">
                 <MaskReveal delay={200}>
                    <p className="text-lg md:text-2xl leading-relaxed font-light text-justify" style={{ fontFamily: fonts.body }}>
                      "In a world filled with noise, we found silence in each other. A modern romance stripped of pretense, built purely on devotion and an unbreakable bond."
                    </p>
                 </MaskReveal>
                 <MaskReveal delay={400}>
                    <p className="mt-12 text-3xl opacity-40 rotate-[-5deg] origin-left" style={{ fontFamily: fonts.script }}>
                      {brideName} &amp; {groomName}
                    </p>
                 </MaskReveal>
              </div>
           </div>
        </section>

        {/* 3. The Exhibition (Snap-Scroll Gallery) */}
        <section className="py-24 relative overflow-hidden">
           <div className="px-6 md:px-16 lg:px-32 mb-16">
              <MaskReveal>
                 <h3 className="text-4xl md:text-6xl uppercase" style={{ fontFamily: fonts.heading }}>The <br/><span className="italic text-[#A0A0A0]">Exhibition</span></h3>
              </MaskReveal>
           </div>
           
           <div className="w-full overflow-x-auto snap-x snap-mandatory flex gap-8 px-6 md:px-16 lg:px-32 pb-12 scrollbar-hide">
              {galleryImages.map((img, i) => (
                <div key={i} className="min-w-[85vw] md:min-w-[60vw] lg:min-w-[40vw] snap-center group">
                   <div className="w-full aspect-[4/5] overflow-hidden bg-[#111111]/5">
                      <img src={img} alt={`Exhibition ${i+1}`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                   </div>
                   <p className="mt-6 text-[10px] uppercase tracking-[0.2em] text-[#A0A0A0]" style={{ fontFamily: fonts.body }}>
                     FIG. 0{i+1} — Captured Moment
                   </p>
                </div>
              ))}
           </div>
        </section>

        {/* 4. Event Details (Stark Layout) */}
        <section className="py-32 px-6 md:px-16 lg:px-32">
           <div className="max-w-6xl mx-auto">
              <MaskReveal>
                 <h3 className="text-4xl md:text-6xl mb-24 uppercase italic text-center" style={{ fontFamily: fonts.heading }}>The Details</h3>
              </MaskReveal>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
                 <div className="border-t border-[#111111] pt-8">
                    <MaskReveal>
                       <p className="text-[10px] tracking-[0.3em] uppercase opacity-50 mb-6" style={{ fontFamily: fonts.body }}>01 / Matrimony</p>
                    </MaskReveal>
                    <MaskReveal delay={100}>
                       <h4 className="text-3xl mb-6" style={{ fontFamily: fonts.heading }}>Holy Matrimony</h4>
                    </MaskReveal>
                    <MaskReveal delay={200}>
                       <p className="text-sm uppercase tracking-widest font-medium mb-2" style={{ fontFamily: fonts.body }}>{format(weddingDate, 'dd MMMM yyyy', { locale: currentLocale })}</p>
                       <p className="text-xs opacity-60 mb-6" style={{ fontFamily: fonts.body }}>09:00 WIB - 11:00 WIB</p>
                       <p className="text-sm font-light leading-relaxed uppercase tracking-widest" style={{ fontFamily: fonts.body }}>The Alabaster Chapel<br/><span className="opacity-60 text-[10px]">Jl. Mawar Elok No. 25</span></p>
                    </MaskReveal>
                 </div>
                 
                 <div className="border-t border-[#111111] pt-8">
                    <MaskReveal>
                       <p className="text-[10px] tracking-[0.3em] uppercase opacity-50 mb-6" style={{ fontFamily: fonts.body }}>02 / Celebration</p>
                    </MaskReveal>
                    <MaskReveal delay={100}>
                       <h4 className="text-3xl mb-6 italic" style={{ fontFamily: fonts.heading }}>The Gala</h4>
                    </MaskReveal>
                    <MaskReveal delay={200}>
                       <p className="text-sm uppercase tracking-widest font-medium mb-2" style={{ fontFamily: fonts.body }}>{format(weddingDate, 'dd MMMM yyyy', { locale: currentLocale })}</p>
                       <p className="text-xs opacity-60 mb-6" style={{ fontFamily: fonts.body }}>19:00 WIB - Selesai</p>
                       <p className="text-sm font-light leading-relaxed uppercase tracking-widest" style={{ fontFamily: fonts.body }}>The Grand Pavilion<br/><span className="opacity-60 text-[10px]">Jl. Mawar Elok No. 25</span></p>
                    </MaskReveal>
                 </div>
              </div>
           </div>
        </section>

        {/* 5. The Concierge (RSVP) & Black Card (Gift) */}
        <section className="w-full bg-[#111111] text-[#FCFBF9] py-32 px-6 md:px-16 lg:px-32">
           <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-start">
              
              {/* Concierge RSVP */}
              <div>
                 <MaskReveal>
                    <h3 className="text-4xl md:text-5xl mb-12 italic" style={{ fontFamily: fonts.heading }}>The Concierge</h3>
                 </MaskReveal>
                 
                 <form onSubmit={handleRSVP} className="space-y-12">
                    <div className="relative group">
                       <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder=" "
                         className="peer w-full bg-transparent border-0 border-b border-white/20 px-0 py-3 text-lg outline-none focus:border-transparent" 
                         style={{ fontFamily: fonts.body }} />
                       <label className="absolute left-0 top-3 text-xs tracking-widest uppercase opacity-50 transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-valid:-top-4 peer-valid:text-[10px]">Guest Name</label>
                       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-[#FCFBF9] transition-all duration-500 peer-focus:w-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                       <div className="relative group">
                          <select value={status} onChange={e => setStatus(e.target.value)}
                            className="peer w-full bg-transparent border-0 border-b border-white/20 px-0 py-3 text-lg outline-none appearance-none focus:border-transparent"
                            style={{ fontFamily: fonts.body }}>
                            <option value="ATTENDING" style={{ color: '#000' }}>Attending</option>
                            <option value="NOT_ATTENDING" style={{ color: '#000' }}>Declining</option>
                          </select>
                          <label className="absolute left-0 -top-4 text-[10px] tracking-widest uppercase opacity-50">Status</label>
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-[#FCFBF9] transition-all duration-500 peer-focus:w-full"></div>
                       </div>
                       
                       <div className="relative group">
                          <select value={guestCount} onChange={e => setGuestCount(Number(e.target.value))}
                            className="peer w-full bg-transparent border-0 border-b border-white/20 px-0 py-3 text-lg outline-none appearance-none focus:border-transparent"
                            style={{ fontFamily: fonts.body }}>
                            {[1,2,3,4,5].map(n => <option key={n} value={n} style={{ color: '#000' }}>{n}</option>)}
                          </select>
                          <label className="absolute left-0 -top-4 text-[10px] tracking-widest uppercase opacity-50">Pax</label>
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-[#FCFBF9] transition-all duration-500 peer-focus:w-full"></div>
                       </div>
                    </div>

                    <div className="relative group">
                       <textarea required value={message} onChange={e => setMessage(e.target.value)} placeholder=" " rows={1}
                         className="peer w-full bg-transparent border-0 border-b border-white/20 px-0 py-3 text-lg outline-none resize-none focus:border-transparent" 
                         style={{ fontFamily: fonts.body }} />
                       <label className="absolute left-0 top-3 text-xs tracking-widest uppercase opacity-50 transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-valid:-top-4 peer-valid:text-[10px]">Message</label>
                       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-[#FCFBF9] transition-all duration-500 peer-focus:w-full"></div>
                    </div>

                    <button type="submit" disabled={isSubmitting} className="group relative overflow-hidden bg-transparent border border-white/20 px-12 py-4 w-full md:w-auto text-left hover:border-white transition-colors duration-500">
                       <span className="inline-block transition-transform duration-500 group-hover:-translate-y-[150%]"><ArrowRight size={20} /></span>
                       <span className="absolute left-12 top-[150%] uppercase tracking-widest text-xs transition-transform duration-500 group-hover:translate-y-[-280%]">Submit</span>
                    </button>
                 </form>

                 {/* Editorial Guest Messages */}
                 <div className="mt-24">
                    <p className="text-[10px] tracking-[0.3em] uppercase opacity-50 mb-8 border-b border-white/20 pb-4">Guest Log</p>
                    <div className="space-y-8 max-h-[300px] overflow-y-auto pr-4 scrollbar-thin">
                       {messagesList.map((msg, i) => (
                         <div key={i} className="flex gap-6 items-start">
                            <span className="text-[10px] tracking-widest opacity-40 shrink-0">0{i+1}</span>
                            <div>
                               <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ fontFamily: fonts.body }}>{msg.sender_name}</p>
                               <p className="text-sm font-light opacity-80 leading-relaxed" style={{ fontFamily: fonts.body }}>{msg.message}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              {/* The Black Card (Gift) */}
              <div>
                 <MaskReveal>
                    <h3 className="text-4xl md:text-5xl mb-6" style={{ fontFamily: fonts.heading }}>The Reserve</h3>
                 </MaskReveal>
                 <MaskReveal delay={100}>
                    <p className="text-xs uppercase tracking-widest opacity-60 mb-12 font-light leading-relaxed" style={{ fontFamily: fonts.body }}>
                      Your presence is luxury enough. Should you wish to gift, details are below.
                    </p>
                 </MaskReveal>

                 <MaskReveal delay={200}>
                    <div className="w-full aspect-[1.586/1] bg-gradient-to-br from-[#222222] to-[#0A0A0A] rounded-2xl p-8 md:p-10 relative overflow-hidden shadow-2xl border border-white/10 group">
                       {/* Sheen Effect */}
                       <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000"></div>
                       
                       <div className="flex justify-between items-start mb-16">
                          <p className="text-sm tracking-widest uppercase opacity-80">{data?.customizations?.bank_name || 'Platinum Bank'}</p>
                          <button onClick={() => {
                            navigator.clipboard.writeText(data?.customizations?.bank_account || '1234567890');
                            toast.success('Copied to clipboard.');
                          }} className="text-[10px] tracking-[0.2em] uppercase border border-white/30 px-3 py-1 rounded-full hover:bg-white hover:text-black transition-colors">
                            Copy
                          </button>
                       </div>

                       <div className="text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
                          <p className="text-2xl md:text-3xl tracking-[0.3em] drop-shadow-md" style={{ fontFamily: fonts.body, textShadow: '1px 1px 2px rgba(255,255,255,0.1), -1px -1px 2px rgba(0,0,0,0.8)' }}>
                             {(data?.customizations?.bank_account || '1234567890').replace(/(\d{4})/g, '$1 ').trim()}
                          </p>
                       </div>

                       <div className="absolute bottom-8 left-8 md:left-10">
                          <p className="text-[10px] tracking-[0.3em] uppercase opacity-50 mb-1">Cardholder</p>
                          <p className="text-sm tracking-widest uppercase">{data?.customizations?.bank_owner || groomName}</p>
                       </div>
                    </div>
                 </MaskReveal>
              </div>

           </div>
        </section>

        {/* Footer */}
        <footer className="py-24 text-center bg-[#111111] border-t border-white/10 text-white">
           <h2 className="text-5xl italic mb-12" style={{ fontFamily: fonts.heading }}>{brideName} &amp; {groomName}</h2>
           <p className="text-[10px] uppercase tracking-[0.4em] opacity-40 font-light" style={{ fontFamily: fonts.body }}>An Editorial By FiveInvitation</p>
        </footer>
      </SmoothScrollLayout>
    </div>
  );
}
