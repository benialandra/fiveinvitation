import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import SmoothScrollLayout from '../../components/Interactive/SmoothScrollLayout';
import AudioController from '../../components/Interactive/AudioController';

// Elegant Gold SVG Ornaments
const TopOrnament = () => (
  <svg width="200" height="40" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto text-[#D4AF37]">
    <path d="M100 0C100 0 110 20 150 20C190 20 200 20 200 20" stroke="currentColor" strokeWidth="1" />
    <path d="M100 0C100 0 90 20 50 20C10 20 0 20 0 20" stroke="currentColor" strokeWidth="1" />
    <circle cx="100" cy="20" r="4" fill="currentColor" />
    <path d="M100 24L100 40" stroke="currentColor" strokeWidth="1" />
    <circle cx="100" cy="40" r="2" fill="currentColor" />
    <path d="M85 10C85 10 90 20 100 20" stroke="currentColor" strokeWidth="1" />
    <path d="M115 10C115 10 110 20 100 20" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const BottomOrnament = () => (
  <svg width="200" height="40" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto text-[#D4AF37] rotate-180">
    <path d="M100 0C100 0 110 20 150 20C190 20 200 20 200 20" stroke="currentColor" strokeWidth="1" />
    <path d="M100 0C100 0 90 20 50 20C10 20 0 20 0 20" stroke="currentColor" strokeWidth="1" />
    <circle cx="100" cy="20" r="4" fill="currentColor" />
    <path d="M100 24L100 40" stroke="currentColor" strokeWidth="1" />
    <circle cx="100" cy="40" r="2" fill="currentColor" />
    <path d="M85 10C85 10 90 20 100 20" stroke="currentColor" strokeWidth="1" />
    <path d="M115 10C115 10 110 20 100 20" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const DividerOrnament = () => (
  <div className="flex items-center justify-center my-12 opacity-80">
    <div className="w-24 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]" />
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mx-4 text-[#D4AF37]">
      <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" fill="currentColor" fillOpacity="0.5" stroke="currentColor" strokeWidth="1"/>
    </svg>
    <div className="w-24 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]" />
  </div>
);

// Floating Gold Particles Component
const GoldParticles = () => {
  const [particles, setParticles] = useState<{ id: number, x: number, delay: number, duration: number, size: number }[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10,
      size: Math.random() * 4 + 2
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#FFF8B0] shadow-[0_0_10px_rgba(212,175,55,0.8)]"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            bottom: '-10px'
          }}
          animate={{
            y: ['0vh', '-110vh'],
            x: [`0px`, `${Math.sin(p.id) * 50}px`, `${Math.cos(p.id) * -50}px`]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear'
          }}
        />
      ))}
    </div>
  );
};


export default function RoyalGoldLuxury({ data, guestName }: { data?: any, guestName?: string }) {
  const groom = data?.groom_name || 'William';
  const bride = data?.bride_name || 'Catherine';
  const displayGuest = guestName || 'Our Esteemed Guest';
  const akadDateStr = data?.akad_date || '2026-12-31T08:00:00';
  const resepsiDateStr = data?.resepsi_date || '2026-12-31T19:00:00';

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [comments, setComments] = useState([
    { id: 1, name: 'Duke of Hastings', message: 'Wishing you a lifetime of joy and happiness.' },
    { id: 2, name: 'Lady Danbury', message: 'A truly magnificent union. Congratulations to you both.' }
  ]);
  const [newName, setNewName] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState('');
  const [rsvpGuestCount, setRsvpGuestCount] = useState('1');

  const loveStory = data?.story || "In the grand tapestry of life, our threads have finally intertwined, creating a bond that is eternal and true.";
  const coverImg = data?.cover_image || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=60&w=2000&auto=format&fit=crop&fm=webp&q=60";
  const heroImg = data?.hero_image || "https://images.unsplash.com/photo-1544078754-0a3791001a1c?q=60&w=2000&auto=format&fit=crop&fm=webp&q=60";
  
  // Need 4 gallery images, fallback to defaults
  const gal1 = data?.gallery_1 || "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=60&w=800&auto=format&fit=crop&fm=webp&q=60";
  const gal2 = data?.gallery_2 || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=60&w=800&auto=format&fit=crop&fm=webp&q=60";
  const gal3 = data?.gallery_3 || "https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=800&auto=format&fit=crop&fm=webp&q=60";
  const gal4 = data?.gallery_4 || "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=60&w=800&auto=format&fit=crop&fm=webp&q=60";

  const bankName1 = data?.bank_name_1 || "Bank Central Asia";
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
      toast.success('Ucapan berhasil dikirim!');
    }
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rsvpStatus) {
      toast.success('Konfirmasi kehadiran berhasil dikirim!');
      setRsvpStatus('');
    }
  };

  // Shared fade-up animation variants
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } }
  };

  return (
    <SmoothScrollLayout>
      <div className="relative bg-[#FCFAF5] text-[#3A3327] font-serif overflow-x-hidden min-h-screen selection:bg-[#D4AF37] selection:text-white">
        {isOpened && <AudioController src={data?.music_url || "https://assets.mixkit.co/music/preview/mixkit-beautiful-dream-493.mp3"} />}

      {/* Background Particles globally running */}
      {isOpened && <GoldParticles />}

      {/* Overlay Cover Screen */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div 
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 text-center bg-[#FCFAF5]"
          >
            {/* Elegant Outer Border */}
            <div className="absolute inset-4 border border-[#D4AF37] opacity-40 pointer-events-none" />
            <div className="absolute inset-5 border border-[#D4AF37] opacity-20 pointer-events-none" />
            
            <div className="absolute inset-6 z-0">
              <img src={coverImg} className="w-full h-full object-cover grayscale-[30%] opacity-40" alt="Cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FCFAF5] via-[#FCFAF5]/80 to-transparent" />
            </div>
            
            <div className="relative z-10 max-w-sm w-full bg-[#FCFAF5]/95 backdrop-blur-sm p-10 md:p-12 border border-[#D4AF37]/40 shadow-2xl mt-16">
              <TopOrnament />
              <p className="text-xs tracking-[0.3em] uppercase text-[#AA7C11] mb-6 mt-6 font-sans">The Wedding Of</p>
              <h1 className="text-4xl md:text-5xl font-normal mb-8 text-[#D4AF37] leading-tight" style={{fontFamily: '"Playfair Display", serif'}}>
                {groom} <br/><span className="text-2xl font-light text-[#AA7C11] italic">&</span><br/> {bride}
              </h1>
              
              <div className="mb-10">
                <p className="text-xs text-[#AA7C11]/80 uppercase tracking-widest mb-3 font-sans">Kepada Yth:</p>
                <p className="text-xl font-medium text-[#3A3327] border-b border-[#D4AF37]/40 inline-block pb-2 px-6">{displayGuest}</p>
              </div>
              
              <button 
                onClick={handleOpen}
                className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-white font-sans font-semibold tracking-[0.2em] uppercase text-xs hover:from-[#AA7C11] hover:to-[#D4AF37] transition-all shadow-[0_5px_15px_rgba(212,175,55,0.4)]"
              >
                Buka Undangan
              </button>
              <BottomOrnament />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className={`transition-all duration-1000 ${isOpened ? 'opacity-100 visible' : 'opacity-0 invisible h-screen overflow-hidden'}`}>
        
        {/* Border container for the whole body */}
        <div className="fixed inset-3 md:inset-6 border border-[#D4AF37]/30 pointer-events-none z-[40]" />
        
        {/* HERO SECTION */}
        <section className="relative min-h-screen flex items-center justify-center p-6">
          <div className="absolute inset-0 z-0">
             <img src={heroImg} className="w-full h-full object-cover" alt="Hero" />
             <div className="absolute inset-0 bg-[#3A3327]/40 mix-blend-multiply" />
             <div className="absolute inset-0 bg-gradient-to-t from-[#FCFAF5] via-[#FCFAF5]/20 to-[#FCFAF5]/60" />
          </div>
          
          <motion.div 
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true }}
             variants={fadeUpVariant}
             className="relative z-10 text-center max-w-4xl"
          >
             <p className="text-[#D4AF37] text-sm md:text-base tracking-[0.4em] uppercase mb-6 font-sans font-medium drop-shadow-md">The Royal Wedding</p>
             <h2 className="text-6xl md:text-8xl lg:text-9xl font-light text-white mb-8 drop-shadow-2xl" style={{fontFamily: '"Playfair Display", serif'}}>
               {groom} <br/><span className="text-5xl md:text-7xl italic text-[#D4AF37]">&</span><br/> {bride}
             </h2>
             <div className="w-px h-24 bg-gradient-to-b from-[#D4AF37] to-transparent mx-auto opacity-70" />
          </motion.div>
        </section>

        {/* QUOTE / LOVE STORY */}
        <section className="py-24 px-6 relative z-10 bg-[#FCFAF5]">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariant}
            >
              <TopOrnament />
              <p className="text-2xl md:text-3xl leading-relaxed italic text-[#3A3327] my-10 font-light" style={{fontFamily: '"Playfair Display", serif'}}>
                "{loveStory}"
              </p>
              <BottomOrnament />
            </motion.div>
          </div>
        </section>

        {/* TIMELINE KISAH CINTA */}
        <section className="py-20 px-6 relative z-10">
          <div className="max-w-2xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="text-center mb-16">
              <h3 className="text-[#D4AF37] font-sans tracking-[0.3em] uppercase text-sm mb-4">Our Journey</h3>
              <h2 className="text-4xl md:text-5xl text-[#3A3327]" style={{fontFamily: '"Playfair Display", serif'}}>Kisah Cinta Kami</h2>
            </motion.div>

            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-[11px] md:left-1/2 top-0 bottom-0 w-px bg-[#D4AF37]/30 md:-translate-x-1/2" />
              
              <div className="space-y-12">
                {[
                  { year: "2020", title: "Awal Bertemu", desc: "Perjumpaan pertama yang tidak disengaja namun membawa makna yang mendalam." },
                  { year: "2023", title: "Mengikat Janji", desc: "Sebuah komitmen untuk melangkah bersama mengarungi kehidupan." },
                  { year: "2026", title: "Hari Bahagia", desc: "Puncak dari perjalanan cinta kami untuk menjadi satu keluarga." }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={fadeUpVariant}
                    className={`relative flex flex-col md:flex-row ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                  >
                    {/* Dot on the line */}
                    <div className="absolute left-[11px] md:left-1/2 top-1 w-3 h-3 rounded-full bg-[#D4AF37] transform -translate-x-1/2" />
                    
                    {/* Content Block */}
                    <div className={`ml-10 md:ml-0 md:w-1/2 ${idx % 2 === 0 ? 'md:pl-10 text-left' : 'md:pr-10 md:text-right'}`}>
                      <span className="text-[#D4AF37] font-sans font-bold tracking-widest mb-2 block">{item.year}</span>
                      <h4 className="text-2xl text-[#3A3327] mb-2">{item.title}</h4>
                      <p className="text-[#3A3327]/70 font-sans text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* GALLERY (4 MASONRY) */}
        <section className="py-24 px-6 md:px-12 relative z-10 bg-[#FAF7F0] border-y border-[#D4AF37]/20">
          <div className="max-w-6xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="text-center mb-16">
              <h3 className="text-[#D4AF37] font-sans tracking-[0.3em] uppercase text-sm mb-4">Our Memories</h3>
              <h2 className="text-4xl md:text-5xl text-[#3A3327]" style={{fontFamily: '"Playfair Display", serif'}}>Galeri Momen</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Col 1 */}
              <div className="flex flex-col gap-6 md:gap-8">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="overflow-hidden relative group aspect-[4/5] border border-[#D4AF37]/30 bg-white p-2">
                  <div className="w-full h-full overflow-hidden relative">
                    <img loading="lazy" src={gal1} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[10%]" alt="Gallery 1" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </motion.div>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="overflow-hidden relative group aspect-[4/3] border border-[#D4AF37]/30 bg-white p-2">
                  <div className="w-full h-full overflow-hidden relative">
                    <img loading="lazy" src={gal2} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[10%]" alt="Gallery 2" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </motion.div>
              </div>
              {/* Col 2 */}
              <div className="flex flex-col gap-6 md:gap-8 md:mt-16">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="overflow-hidden relative group aspect-[4/3] border border-[#D4AF37]/30 bg-white p-2">
                  <div className="w-full h-full overflow-hidden relative">
                    <img loading="lazy" src={gal3} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[10%]" alt="Gallery 3" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </motion.div>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="overflow-hidden relative group aspect-[4/5] border border-[#D4AF37]/30 bg-white p-2">
                  <div className="w-full h-full overflow-hidden relative">
                    <img loading="lazy" src={gal4} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[10%]" alt="Gallery 4" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <DividerOrnament />

        {/* COUNTDOWN */}
        <section className="py-16 px-6 relative z-10">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}
            className="max-w-4xl mx-auto bg-gradient-to-br from-[#D4AF37] to-[#AA7C11] p-[2px]"
          >
             <div className="bg-[#FCFAF5] p-10 md:p-16 text-center">
               <h3 className="text-[#AA7C11] font-sans tracking-[0.3em] uppercase text-xs mb-8">Menuju Hari Bahagia</h3>
               <div className="grid grid-cols-4 gap-4 divide-x divide-[#D4AF37]/30">
                 {[
                   { label: "Hari", value: timeLeft.days },
                   { label: "Jam", value: timeLeft.hours },
                   { label: "Menit", value: timeLeft.minutes },
                   { label: "Detik", value: timeLeft.seconds }
                 ].map((item, idx) => (
                   <div key={idx} className="flex flex-col items-center">
                     <div className="text-3xl md:text-6xl font-light text-[#3A3327] mb-2">{item.value}</div>
                     <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#AA7C11] font-sans font-bold">{item.label}</span>
                   </div>
                 ))}
               </div>
             </div>
          </motion.div>
        </section>

        {/* EVENT DETAILS */}
        <section className="py-24 px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="text-center mb-16">
              <h3 className="text-[#D4AF37] font-sans tracking-[0.3em] uppercase text-sm mb-4">Event Details</h3>
              <h2 className="text-4xl md:text-5xl text-[#3A3327]" style={{fontFamily: '"Playfair Display", serif'}}>Waktu & Tempat Pelaksanaan</h2>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-12 mb-20">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="bg-white border border-[#D4AF37]/30 p-10 text-center shadow-[0_10px_30px_rgba(0,0,0,0.03)] relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#FCFAF5] border border-[#D4AF37]/30 rounded-full flex items-center justify-center text-[#D4AF37]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                
                <h3 className="text-3xl font-normal mt-6 mb-4 text-[#3A3327]" style={{fontFamily: '"Playfair Display", serif'}}>Akad Nikah</h3>
                <p className="text-[#D4AF37] font-sans font-bold tracking-widest uppercase mb-2">{format(parseISO(akadDateStr), 'EEEE, dd MMMM yyyy', { locale: localeId })}</p>
                <p className="text-[#3A3327]/80 font-sans mb-6 pb-6 border-b border-[#D4AF37]/20">Pukul {format(parseISO(akadDateStr), 'HH:mm')} WIB</p>
                <p className="font-sans text-sm text-[#3A3327] font-medium mb-1">Masjid Agung Kerajaan</p>
                <p className="font-sans text-xs text-[#3A3327]/60 leading-relaxed">Jl. Kebayoran Baru No. 1, Jakarta Selatan</p>
              </motion.div>
              
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.2 }} variants={fadeUpVariant} className="bg-white border border-[#D4AF37]/30 p-10 text-center shadow-[0_10px_30px_rgba(0,0,0,0.03)] relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#FCFAF5] border border-[#D4AF37]/30 rounded-full flex items-center justify-center text-[#D4AF37]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2.5 12a9.5 9.5 0 0 1 12.5-9.5V12z"/><path d="M12 2.5a9.5 9.5 0 0 1 9.5 12.5H12z"/><path d="M14 12v9.5A9.5 9.5 0 0 1 12 21.5v-9.5z"/></svg>
                </div>
                
                <h3 className="text-3xl font-normal mt-6 mb-4 text-[#3A3327]" style={{fontFamily: '"Playfair Display", serif'}}>Resepsi Pernikahan</h3>
                <p className="text-[#D4AF37] font-sans font-bold tracking-widest uppercase mb-2">{format(parseISO(resepsiDateStr), 'EEEE, dd MMMM yyyy', { locale: localeId })}</p>
                <p className="text-[#3A3327]/80 font-sans mb-6 pb-6 border-b border-[#D4AF37]/20">Pukul {format(parseISO(resepsiDateStr), 'HH:mm')} WIB</p>
                <p className="font-sans text-sm text-[#3A3327] font-medium mb-1">{data?.location_name || 'The Ritz-Carlton Grand Ballroom'}</p>
                <p className="font-sans text-xs text-[#3A3327]/60 leading-relaxed">Pacific Place, SCBD, Jakarta</p>
              </motion.div>
            </div>

            {data?.maps_link && (
               <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="text-center">
                 <a href={data.maps_link} target="_blank" rel="noreferrer" className="inline-block py-4 px-12 bg-[#D4AF37] text-white font-sans font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#AA7C11] transition-colors shadow-lg">
                    Buka Google Maps
                 </a>
               </motion.div>
            )}
          </div>
        </section>

        {/* RSVP FORM */}
        <section className="py-24 px-6 relative z-10 bg-[#FAF7F0] border-y border-[#D4AF37]/20">
          <div className="max-w-2xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="text-center mb-12">
              <TopOrnament />
              <h2 className="text-4xl text-[#3A3327] mt-8 mb-4" style={{fontFamily: '"Playfair Display", serif'}}>RSVP</h2>
              <p className="text-[#3A3327]/70 font-sans text-sm">Harap konfirmasi kehadiran Anda untuk pengaturan tempat duduk.</p>
            </motion.div>

            <motion.form 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}
              onSubmit={handleRsvpSubmit} 
              className="bg-white p-8 md:p-12 border border-[#D4AF37]/30 shadow-xl"
            >
              <div className="mb-6 font-sans">
                <label className="block text-xs uppercase tracking-widest text-[#AA7C11] font-bold mb-2">Kehadiran</label>
                <select 
                  required
                  value={rsvpStatus}
                  onChange={(e) => setRsvpStatus(e.target.value)}
                  className="w-full px-4 py-3 border-b-2 border-[#D4AF37]/20 focus:outline-none focus:border-[#D4AF37] bg-transparent text-[#3A3327]"
                >
                  <option value="" disabled>Pilih Status Kehadiran</option>
                  <option value="Hadir">Ya, Saya Akan Hadir</option>
                  <option value="Tidak Hadir">Maaf, Tidak Bisa Hadir</option>
                </select>
              </div>

              {rsvpStatus === 'Hadir' && (
                <div className="mb-8 font-sans">
                  <label className="block text-xs uppercase tracking-widest text-[#AA7C11] font-bold mb-2">Jumlah Kehadiran</label>
                  <select 
                    value={rsvpGuestCount}
                    onChange={(e) => setRsvpGuestCount(e.target.value)}
                    className="w-full px-4 py-3 border-b-2 border-[#D4AF37]/20 focus:outline-none focus:border-[#D4AF37] bg-transparent text-[#3A3327]"
                  >
                    <option value="1">1 Orang</option>
                    <option value="2">2 Orang</option>
                  </select>
                </div>
              )}

              <button type="submit" className="w-full bg-[#3A3327] text-white py-4 font-sans font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#1f1b14] transition-colors">
                Kirim Konfirmasi
              </button>
            </motion.form>
          </div>
        </section>

        {/* DIGITAL GIFT */}
        <section className="py-24 px-6 relative z-10">
          <div className="max-w-xl mx-auto text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}>
              <h3 className="text-[#D4AF37] font-sans tracking-[0.3em] uppercase text-sm mb-4">Tanda Kasih</h3>
              <h2 className="text-4xl md:text-5xl font-normal mb-8 text-[#3A3327]" style={{fontFamily: '"Playfair Display", serif'}}>Wedding Gift</h2>
              <p className="text-[#3A3327]/80 mb-10 font-sans text-sm leading-relaxed">
                Doa restu Anda merupakan karunia yang sangat berarti bagi kami. 
                Namun, jika Bapak/Ibu/Saudara/i hendak memberikan tanda kasih, dapat melalui nomor rekening di bawah ini:
              </p>
              
              <div className="bg-white p-10 border border-[#D4AF37]/40 shadow-lg relative mb-8">
                <div className="absolute -top-3 -right-3 text-[#D4AF37]/20">
                   <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </div>
                <p className="text-[#AA7C11] font-sans font-bold uppercase tracking-widest mb-4 text-xl">{bankName1}</p>
                <p className="text-3xl font-light tracking-widest text-[#3A3327] mb-2 font-sans">{bankAccount1}</p>
                <p className="text-[#3A3327]/60 font-sans text-sm">a.n. {bankAccountName1}</p>
              </div>
              
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(bankAccount1);
                  toast.success('Nomor rekening disalin!');
                }}
                className="w-full py-4 border border-[#D4AF37] bg-white text-[#D4AF37] font-sans font-semibold tracking-widest uppercase text-xs hover:bg-[#D4AF37] hover:text-white transition-colors"
              >
                Salin Nomor Rekening
              </button>
            </motion.div>
          </div>
        </section>

        {/* GUESTBOOK */}
        <section className="py-24 px-6 relative z-10 bg-[#FAF7F0] border-t border-[#D4AF37]/20">
          <div className="max-w-2xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="text-center mb-16">
               <h2 className="text-4xl md:text-5xl font-normal mb-4 text-[#3A3327]" style={{fontFamily: '"Playfair Display", serif'}}>Buku Tamu</h2>
               <div className="w-16 h-px bg-[#D4AF37] mx-auto" />
            </motion.div>

            <motion.form 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}
              onSubmit={handleAddComment} 
              className="bg-white p-8 md:p-12 border border-[#D4AF37]/30 mb-16 shadow-lg"
            >
              <div className="mb-6">
                <input 
                  type="text" 
                  placeholder="Nama Anda" 
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full px-4 py-4 border border-[#D4AF37]/20 focus:outline-none focus:border-[#D4AF37] bg-transparent text-[#3A3327] font-sans text-sm"
                />
              </div>
              <div className="mb-8">
                <textarea 
                  placeholder="Ucapan & Doa Restu..." 
                  required
                  rows={4}
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  className="w-full px-4 py-4 border border-[#D4AF37]/20 focus:outline-none focus:border-[#D4AF37] bg-transparent text-[#3A3327] font-sans text-sm resize-none"
                />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-white py-4 font-sans font-bold uppercase tracking-[0.2em] text-xs hover:opacity-90 transition-opacity">
                Kirim Ucapan
              </button>
            </motion.form>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
              <AnimatePresence>
                {comments.map((comment) => (
                  <motion.div 
                    key={comment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 border border-[#D4AF37]/20 shadow-sm relative"
                  >
                    <div className="absolute top-0 left-0 w-2 h-full bg-[#D4AF37]" />
                    <h4 className="font-bold text-[#3A3327] font-sans tracking-wide mb-2 uppercase text-sm">{comment.name}</h4>
                    <p className="text-[#3A3327]/80 leading-relaxed font-sans text-sm italic">"{comment.message}"</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>
        
        <footer className="py-12 text-center bg-[#3A3327] text-white/50 font-sans text-[10px] tracking-widest uppercase">
          <p className="mb-2">Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan</p>
          <p>© 2026 {groom} & {bride}. Created with FiveInvitation.</p>
        </footer>
      </main>
    </div>
    </SmoothScrollLayout>
  );
}
