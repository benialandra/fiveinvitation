import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { enUS as localeEn } from 'date-fns/locale';
import SmoothScrollLayout from '../components/Interactive/SmoothScrollLayout';
import AudioController from '../components/Interactive/AudioController';

// Floating Light Particles
const FloatingLights = () => {
  const [lights, setLights] = useState<{ id: number, x: number, delay: number, duration: number, scale: number }[]>([]);

  useEffect(() => {
    const newLights = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10,
      scale: Math.random() * 1 + 0.5
    }));
    setLights(newLights);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {lights.map((l) => (
        <motion.div
          key={l.id}
          className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,1)]"
          style={{
            left: `${l.x}%`,
            bottom: '-10px',
            scale: l.scale
          }}
          animate={{
            y: ['0vh', '-120vh'],
            x: [`0px`, `${Math.sin(l.id) * 30}px`, `${Math.cos(l.id) * -30}px`],
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: l.duration,
            repeat: Infinity,
            delay: l.delay,
            ease: 'linear'
          }}
        />
      ))}
    </div>
  );
};

export default function FairytaleCastle({ data, guestName }: { data?: any, guestName?: string }) {
  const groom = data?.groom_name || 'Arthur';
  const bride = data?.bride_name || 'Guinevere';
  const displayGuest = guestName || 'Our Honored Guest';
  const akadDateStr = data?.akad_date || '2026-12-31T10:00:00';
  const resepsiDateStr = data?.resepsi_date || '2026-12-31T18:00:00';

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isOpened, setIsOpened] = useState(false);
  
  const [comments, setComments] = useState([
    { id: 1, name: 'Fairy Godmother', message: 'May your happily ever after begin today.' }
  ]);
  const [newName, setNewName] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const loveStory = data?.story || "Once upon a time, in a kingdom not so far away, two souls found each other and created a magic of their own.";
  const coverImg = data?.cover_image || "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?q=80&w=2000&auto=format&fit=crop"; // Castle/fantasy
  const heroImg = data?.hero_image || "https://images.unsplash.com/photo-1518805790407-73d8bb2a3dce?q=80&w=2000&auto=format&fit=crop"; 
  const gallery1 = data?.gallery_1 || "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800&auto=format&fit=crop";
  const gallery2 = data?.gallery_2 || "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop";
  const gallery3 = data?.gallery_3 || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop";
  const gallery4 = data?.gallery_4 || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop";
  
  const bankName1 = data?.bank_name_1 || "Royal Bank";
  const bankAccount1 = data?.bank_account_1 || "1234567890";
  const bankAccountName1 = data?.bank_account_name_1 || groom;

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

  const handleOpen = () => {
    setIsOpened(true);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName && newMessage) {
      setComments([{ id: Date.now(), name: newName, message: newMessage }, ...comments]);
      setNewName('');
      setNewMessage('');
      toast.success('Wishes sent successfully!');
    }
  };

  return (
    <SmoothScrollLayout>
      <div className="relative bg-[#0F172A] text-[#E2E8F0] font-sans overflow-x-hidden min-h-screen selection:bg-[#38BDF8] selection:text-white">
        
        {isOpened && <AudioController src={data?.music_url || "https://assets.mixkit.co/music/preview/mixkit-beautiful-dream-493.mp3"} />}

        {/* Global Particles */}
        {isOpened && <FloatingLights />}
        
        {/* Magic Dust Top Border */}
        <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent opacity-50 z-50 pointer-events-none" />

        <AnimatePresence>
          {!isOpened && (
            <motion.div 
              exit={{ opacity: 0, filter: 'blur(20px)' }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-center bg-[#0F172A]"
            >
              <div className="absolute inset-0 z-0">
                <img src={coverImg} className="w-full h-full object-cover opacity-40 mix-blend-screen" alt="Cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/80 to-transparent" />
              </div>
              
              <div className="relative z-10 max-w-sm w-full bg-white/5 backdrop-blur-xl p-10 md:p-12 shadow-[0_0_50px_rgba(56,189,248,0.2)] rounded-[3rem] border border-white/20">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-tr from-[#38BDF8] to-white rounded-full p-px">
                  <div className="w-full h-full bg-[#0F172A] rounded-full flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#blue-gradient)" strokeWidth="1.5">
                      <defs>
                        <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#38BDF8" />
                          <stop offset="100%" stopColor="#E0F2FE" />
                        </linearGradient>
                      </defs>
                      <path d="M12 2l3 6 6 1-4.5 4.5 1 6.5-5.5-3-5.5 3 1-6.5L3 9l6-1z" />
                    </svg>
                  </div>
                </div>
                
                <p className="text-xs tracking-[0.4em] uppercase text-[#38BDF8] mb-4 font-bold">A Royal Wedding</p>
                <h1 className="text-4xl md:text-5xl font-normal mb-8 text-white leading-tight" style={{fontFamily: '"Playfair Display", serif'}}>
                  {groom} & {bride}
                </h1>
                
                <div className="mb-10">
                  <p className="text-xs text-[#94A3B8] uppercase tracking-widest mb-3">Invited Guest</p>
                  <p className="text-lg font-medium text-white">{displayGuest}</p>
                </div>
                
                <button 
                  onClick={handleOpen}
                  className="w-full py-4 bg-gradient-to-r from-[#38BDF8] to-[#0284C7] text-white font-bold tracking-[0.2em] uppercase text-xs hover:from-[#0284C7] hover:to-[#0369A1] transition-all rounded-full shadow-[0_0_20px_rgba(56,189,248,0.5)]"
                >
                  Enter the Kingdom
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className={`transition-all duration-1000 ${isOpened ? 'opacity-100 visible' : 'opacity-0 invisible h-screen overflow-hidden'}`}>
          
          {/* HERO SECTION */}
          <section className="relative min-h-screen flex items-center justify-center p-6 border-b border-white/10">
            <div className="absolute inset-0 z-0">
               <img src={heroImg} className="w-full h-full object-cover opacity-50 mix-blend-screen" alt="Hero" />
               <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/50 to-[#0F172A]" />
            </div>
            
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 1.5 }}
               viewport={{ once: true }}
               className="relative z-10 text-center max-w-4xl"
            >
               <h2 className="text-6xl md:text-8xl lg:text-9xl font-normal text-transparent bg-clip-text bg-gradient-to-b from-white to-[#bae6fd] mb-6 drop-shadow-[0_0_30px_rgba(56,189,248,0.3)]" style={{fontFamily: '"Playfair Display", serif'}}>
                 {groom} & {bride}
               </h2>
               <p className="text-[#38BDF8] text-sm md:text-base tracking-[0.5em] uppercase font-bold drop-shadow-md">Happily Ever After</p>
            </motion.div>
          </section>

          {/* QUOTE */}
          <section className="py-24 px-6 relative z-10 bg-transparent">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="relative p-12 bg-[#1E293B]/50 backdrop-blur-md rounded-[3rem] border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
              >
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-b from-[#38BDF8] to-transparent rounded-full opacity-20 blur-xl" />
                <p className="text-2xl md:text-4xl leading-relaxed italic text-white font-light" style={{fontFamily: '"Playfair Display", serif'}}>
                  "{loveStory}"
                </p>
              </motion.div>
            </div>
          </section>

          {/* EVENTS */}
          <section className="py-24 px-6 relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                 <h2 className="text-4xl md:text-5xl text-white mb-4" style={{fontFamily: '"Playfair Display", serif'}}>The Royal Celebration</h2>
                 <p className="text-[#38BDF8] tracking-widest uppercase text-sm font-bold">Join the festivities</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1 }}
                  viewport={{ once: true }}
                  className="bg-[#1E293B]/60 backdrop-blur-md p-10 rounded-[3rem] border border-white/10 text-center shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                >
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#38BDF8] to-[#0284C7] rounded-full flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(56,189,248,0.5)]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  </div>
                  <h3 className="text-3xl font-normal mb-4 text-white" style={{fontFamily: '"Playfair Display", serif'}}>Holy Matrimony</h3>
                  <p className="text-[#38BDF8] font-bold tracking-widest uppercase mb-2">{format(parseISO(akadDateStr), 'EEEE, MMMM do yyyy', { locale: localeEn })}</p>
                  <p className="text-[#94A3B8] mb-6">{format(parseISO(akadDateStr), 'hh:mm a')}</p>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="font-medium text-white mb-1">The Grand Cathedral</p>
                    <p className="text-sm text-[#94A3B8]">Royal Square</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="bg-[#1E293B]/60 backdrop-blur-md p-10 rounded-[3rem] border border-white/10 text-center shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                >
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#38BDF8] to-[#0284C7] rounded-full flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(56,189,248,0.5)]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                  </div>
                  <h3 className="text-3xl font-normal mb-4 text-white" style={{fontFamily: '"Playfair Display", serif'}}>Royal Banquet</h3>
                  <p className="text-[#38BDF8] font-bold tracking-widest uppercase mb-2">{format(parseISO(resepsiDateStr), 'EEEE, MMMM do yyyy', { locale: localeEn })}</p>
                  <p className="text-[#94A3B8] mb-6">{format(parseISO(resepsiDateStr), 'hh:mm a')}</p>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="font-medium text-white mb-1">{data?.location_name || 'The Crystal Palace'}</p>
                    <p className="text-sm text-[#94A3B8]">Kingdom's Center</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* COUNTDOWN */}
          <section className="py-16 px-6 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center relative z-10 bg-[#1E293B]/80 backdrop-blur-xl p-12 rounded-[3rem] border border-white/20 shadow-[0_0_50px_rgba(56,189,248,0.2)]"
            >
               <h3 className="text-[#38BDF8] font-sans tracking-[0.3em] uppercase text-sm mb-10 font-bold">Waiting for Magic</h3>
               <div className="grid grid-cols-4 gap-4">
                 {[
                   { label: "Days", value: timeLeft.days },
                   { label: "Hours", value: timeLeft.hours },
                   { label: "Mins", value: timeLeft.minutes },
                   { label: "Secs", value: timeLeft.seconds }
                 ].map((item, idx) => (
                   <div key={idx} className="flex flex-col items-center">
                     <div className="text-4xl md:text-7xl font-light text-white mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{fontFamily: '"Playfair Display", serif'}}>{item.value}</div>
                     <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#94A3B8]">{item.label}</span>
                   </div>
                 ))}
               </div>
            </motion.div>
          </section>

          {/* GALLERY */}
          <section className="py-24 px-6 md:px-12 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                 <h2 className="text-4xl md:text-5xl text-white mb-4" style={{fontFamily: '"Playfair Display", serif'}}>Enchanted Memories</h2>
                 <p className="text-[#38BDF8] tracking-widest uppercase text-sm font-bold">Glimpses of our tale</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[gallery1, gallery2, gallery3, gallery4].map((img, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }} 
                    whileInView={{ opacity: 1, scale: 1 }} 
                    viewport={{ once: true }} 
                    transition={{ delay: i * 0.1 }}
                    className="p-4 bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10"
                  >
                     <img src={img} className="w-full aspect-[4/3] object-cover rounded-[1.5rem]" alt={`Memory ${i + 1}`} />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* WEDDING GIFT */}
          <section className="py-24 px-6 z-10 relative">
            <div className="max-w-md mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="bg-[#1E293B]/80 backdrop-blur-xl p-10 rounded-[3rem] shadow-[0_0_50px_rgba(56,189,248,0.1)] border border-[#38BDF8]/20"
              >
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#38BDF8] to-white rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(56,189,248,0.6)]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2"><path d="M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
                </div>
                <h2 className="text-3xl mb-4 text-white" style={{fontFamily: '"Playfair Display", serif'}}>Blessings</h2>
                <p className="text-[#94A3B8] mb-8 text-sm">
                  Your presence is the greatest magic of all. If you wish to send a gift, you may do so here:
                </p>
                <div className="bg-[#0F172A] rounded-2xl p-6 mb-8 border border-white/10">
                  <p className="text-[#38BDF8] font-bold uppercase tracking-widest mb-2">{bankName1}</p>
                  <p className="text-2xl font-light tracking-widest text-white mb-2">{bankAccount1}</p>
                  <p className="text-[#94A3B8] text-sm">a.n {bankAccountName1}</p>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(bankAccount1);
                    toast.success('Account copied to clipboard!');
                  }}
                  className="w-full py-4 bg-gradient-to-r from-[#38BDF8] to-[#0284C7] text-white rounded-full font-bold tracking-widest uppercase text-xs hover:shadow-[0_0_15px_rgba(56,189,248,0.8)] transition-all"
                >
                  Copy Account
                </button>
              </motion.div>
            </div>
          </section>

          <footer className="py-12 text-center bg-[#0B1120] text-[#94A3B8] font-sans text-xs tracking-widest uppercase border-t border-white/10">
            <p>© 2026 {groom} & {bride}. Created with FiveInvitation.</p>
          </footer>
        </main>
      </div>
    </SmoothScrollLayout>
  );
}
