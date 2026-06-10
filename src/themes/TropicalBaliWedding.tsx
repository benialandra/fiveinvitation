import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import SmoothScrollLayout from '../components/Interactive/SmoothScrollLayout';
import AudioController from '../components/Interactive/AudioController';

// Animated Floating Leaves
const TropicalLeaves = () => {
  const [leaves, setLeaves] = useState<{ id: number, x: number, delay: number, duration: number, scale: number, rotate: number }[]>([]);

  useEffect(() => {
    const newLeaves = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 15 + 15,
      scale: Math.random() * 0.5 + 0.5,
      rotate: Math.random() * 360
    }));
    setLeaves(newLeaves);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
      {leaves.map((l) => (
        <motion.div
          key={l.id}
          className="absolute"
          style={{
            left: `${l.x}%`,
            top: '-5%',
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [`0px`, `${Math.sin(l.id) * 100}px`, `${Math.cos(l.id) * -100}px`],
            rotate: [l.rotate, l.rotate + 360]
          }}
          transition={{
            duration: l.duration,
            repeat: Infinity,
            delay: l.delay,
            ease: 'linear'
          }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="#2E4A28" className="opacity-80" transform={`scale(${l.scale})`}>
            <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" opacity="0"/>
            <path d="M17.5 2c-2.5 0-6.19 1.62-8.5 3.84V4H7v6h6V8.5H9.69c1.61-1.61 4.54-3 6.81-3 1.94 0 3.5 1.56 3.5 3.5 0 2.27-1.39 5.2-3 6.81V13h-1.5v6h6v-1.5h-4.16c2.22-2.31 3.84-6 3.84-8.5C21 5.09 19.41 2 17.5 2z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export default function TropicalBaliWedding({ data, guestName }: { data?: any, guestName?: string }) {
  const groom = data?.groom_name || 'Bagus';
  const bride = data?.bride_name || 'Ayu';
  const displayGuest = guestName || 'Our Special Guest';
  const akadDateStr = data?.akad_date || '2026-12-31T08:00:00';
  const resepsiDateStr = data?.resepsi_date || '2026-12-31T15:00:00';

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isOpened, setIsOpened] = useState(false);
  
  const [comments, setComments] = useState([
    { id: 1, name: 'Wayan Family', message: 'Selamat menempuh hidup baru, semoga langgeng.' }
  ]);
  const [newName, setNewName] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const loveStory = data?.story || "Like the lush jungles of Bali, our love grows wild, deep, and endlessly beautiful.";
  const coverImg = data?.cover_image || "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2000&auto=format&fit=crop"; 
  const heroImg = data?.hero_image || "https://images.unsplash.com/photo-1544078754-0a3791001a1c?q=80&w=2000&auto=format&fit=crop"; 
  const gallery1 = data?.gallery_1 || "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop";
  const gallery2 = data?.gallery_2 || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop";
  
  const bankName1 = data?.bank_name_1 || "BCA";
  const bankAccount1 = data?.bank_account_1 || "0987654321";
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
      <div className="relative bg-[#Fdfbf7] text-[#2E4A28] font-sans overflow-x-hidden min-h-screen selection:bg-[#4A6B3E] selection:text-white">
        
        {isOpened && <AudioController src={data?.music_url || "https://assets.mixkit.co/music/preview/mixkit-beautiful-dream-493.mp3"} />}
        {isOpened && <TropicalLeaves />}

        <AnimatePresence>
          {!isOpened && (
            <motion.div 
              exit={{ opacity: 0, y: '-100%' }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-center bg-[#2E4A28]"
            >
              <div className="absolute inset-0 z-0">
                <img src={coverImg} className="w-full h-full object-cover opacity-60 mix-blend-overlay" alt="Cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F331A] via-transparent to-[#1F331A]/80" />
              </div>
              
              <div className="relative z-10 max-w-sm w-full bg-[#Fdfbf7]/95 p-10 md:p-12 shadow-2xl rounded-tr-[4rem] rounded-bl-[4rem]">
                <p className="text-xs tracking-[0.3em] uppercase text-[#6B4423] mb-4 font-bold">Pernikahan Tropis</p>
                <h1 className="text-5xl font-normal mb-8 text-[#2E4A28] leading-tight" style={{fontFamily: '"Playfair Display", serif'}}>
                  {groom} & {bride}
                </h1>
                
                <div className="mb-10">
                  <p className="text-xs text-[#6B4423] uppercase tracking-widest mb-3">Dear Guest</p>
                  <p className="text-xl font-medium text-[#2E4A28] pb-2 px-6">{displayGuest}</p>
                </div>
                
                <button 
                  onClick={handleOpen}
                  className="w-full py-4 bg-[#4A6B3E] text-white font-semibold tracking-[0.2em] uppercase text-xs hover:bg-[#2E4A28] transition-colors rounded-tr-2xl rounded-bl-2xl shadow-xl"
                >
                  Buka Undangan
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className={`transition-all duration-1000 ${isOpened ? 'opacity-100 visible' : 'opacity-0 invisible h-screen overflow-hidden'}`}>
          
          {/* HERO SECTION */}
          <section className="relative min-h-screen flex items-center justify-center p-6">
            <div className="absolute inset-0 z-0">
               <img src={heroImg} className="w-full h-full object-cover" alt="Hero" />
               <div className="absolute inset-0 bg-[#2E4A28]/30 mix-blend-multiply" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#Fdfbf7] via-transparent to-transparent" />
            </div>
            
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 1.5 }}
               viewport={{ once: true }}
               className="relative z-10 text-center max-w-4xl"
            >
               <p className="text-[#Fdfbf7] text-sm md:text-base tracking-[0.4em] uppercase mb-6 font-bold drop-shadow-md">We Are Getting Married</p>
               <h2 className="text-6xl md:text-8xl lg:text-9xl font-normal text-white mb-8 drop-shadow-2xl" style={{fontFamily: '"Playfair Display", serif'}}>
                 {groom} & {bride}
               </h2>
            </motion.div>
          </section>

          {/* QUOTE */}
          <section className="py-24 px-6 relative z-10 bg-[#Fdfbf7]">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="relative p-12 bg-white rounded-tr-[4rem] rounded-bl-[4rem] shadow-xl border border-[#4A6B3E]/10"
              >
                <div className="absolute -top-6 -left-6 text-[#4A6B3E]/20">
                  <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                </div>
                <p className="text-2xl md:text-3xl leading-relaxed italic text-[#4A6B3E] font-light" style={{fontFamily: '"Playfair Display", serif'}}>
                  "{loveStory}"
                </p>
              </motion.div>
            </div>
          </section>

          {/* EVENTS */}
          <section className="py-24 px-6 relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                 <h2 className="text-4xl md:text-5xl text-[#2E4A28] mb-4" style={{fontFamily: '"Playfair Display", serif'}}>Our Celebration</h2>
                 <p className="text-[#6B4423] tracking-widest uppercase text-sm font-bold">Join us in paradise</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1 }}
                  viewport={{ once: true }}
                  className="bg-white p-10 rounded-tr-[3rem] rounded-bl-[3rem] shadow-lg border-l-4 border-[#4A6B3E]"
                >
                  <h3 className="text-3xl font-normal mb-4 text-[#2E4A28]" style={{fontFamily: '"Playfair Display", serif'}}>Holy Matrimony</h3>
                  <p className="text-[#6B4423] font-bold tracking-widest uppercase mb-2">{format(parseISO(akadDateStr), 'EEEE, dd MMMM yyyy', { locale: localeId })}</p>
                  <p className="text-[#2E4A28]/70 mb-6 border-b border-[#2E4A28]/10 pb-6">{format(parseISO(akadDateStr), 'HH:mm')} WIB</p>
                  <p className="font-medium text-[#2E4A28]">Uluwatu Temple</p>
                  <p className="text-sm text-[#2E4A28]/60">Bali, Indonesia</p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white p-10 rounded-tr-[3rem] rounded-bl-[3rem] shadow-lg border-l-4 border-[#6B4423]"
                >
                  <h3 className="text-3xl font-normal mb-4 text-[#2E4A28]" style={{fontFamily: '"Playfair Display", serif'}}>Reception Party</h3>
                  <p className="text-[#6B4423] font-bold tracking-widest uppercase mb-2">{format(parseISO(resepsiDateStr), 'EEEE, dd MMMM yyyy', { locale: localeId })}</p>
                  <p className="text-[#2E4A28]/70 mb-6 border-b border-[#2E4A28]/10 pb-6">{format(parseISO(resepsiDateStr), 'HH:mm')} WIB</p>
                  <p className="font-medium text-[#2E4A28]">{data?.location_name || 'Ayana Resort & Spa'}</p>
                  <p className="text-sm text-[#2E4A28]/60">Jimbaran, Bali</p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* COUNTDOWN */}
          <section className="py-16 px-6 relative z-10 bg-[#4A6B3E] text-white overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs><pattern id="leaves" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M30 50C30 30 50 10 70 30C90 50 70 70 50 70C30 70 10 50 30 50Z" fill="currentColor"/></pattern></defs>
                <rect width="100%" height="100%" fill="url(#leaves)" />
              </svg>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center relative z-10"
            >
               <h3 className="text-[#Fdfbf7] font-sans tracking-[0.3em] uppercase text-sm mb-10">Menuju Hari Bahagia</h3>
               <div className="grid grid-cols-4 gap-4">
                 {[
                   { label: "Hari", value: timeLeft.days },
                   { label: "Jam", value: timeLeft.hours },
                   { label: "Menit", value: timeLeft.minutes },
                   { label: "Detik", value: timeLeft.seconds }
                 ].map((item, idx) => (
                   <div key={idx} className="flex flex-col items-center">
                     <div className="text-4xl md:text-7xl font-light text-white mb-2" style={{fontFamily: '"Playfair Display", serif'}}>{item.value}</div>
                     <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#Fdfbf7]/80">{item.label}</span>
                   </div>
                 ))}
               </div>
            </motion.div>
          </section>

          {/* GALLERY */}
          <section className="py-24 px-6 md:px-12 relative z-10 bg-[#Fdfbf7]">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                 <h2 className="text-4xl md:text-5xl text-[#2E4A28] mb-4" style={{fontFamily: '"Playfair Display", serif'}}>Our Memories</h2>
                 <p className="text-[#6B4423] tracking-widest uppercase text-sm font-bold">Captured moments</p>
              </div>
              <div className="grid grid-cols-2 gap-4 md:gap-8">
                <motion.img 
                  initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                  src={gallery1} className="w-full aspect-square object-cover rounded-tr-[3rem] rounded-bl-[3rem] shadow-xl" alt="Memory" 
                />
                <motion.img 
                  initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                  src={gallery2} className="w-full aspect-[4/5] object-cover rounded-tl-[3rem] rounded-br-[3rem] shadow-xl" alt="Memory" 
                />
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
                className="bg-white p-10 rounded-[3rem] shadow-2xl border border-[#4A6B3E]/10"
              >
                <h2 className="text-3xl mb-4 text-[#2E4A28]" style={{fontFamily: '"Playfair Display", serif'}}>Wedding Gift</h2>
                <p className="text-[#2E4A28]/70 mb-8 text-sm">
                  Doa restu Anda merupakan hadiah terindah. Jika Anda ingin memberikan tanda kasih, dapat melalui rekening berikut:
                </p>
                <div className="bg-[#Fdfbf7] rounded-xl p-6 mb-8 border border-[#2E4A28]/10">
                  <p className="text-[#6B4423] font-bold uppercase tracking-widest mb-2">{bankName1}</p>
                  <p className="text-3xl font-light tracking-widest text-[#2E4A28] mb-2">{bankAccount1}</p>
                  <p className="text-[#2E4A28]/60 text-sm">a.n {bankAccountName1}</p>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(bankAccount1);
                    toast.success('Nomor rekening berhasil disalin!');
                  }}
                  className="w-full py-4 bg-[#4A6B3E] text-white rounded-tr-xl rounded-bl-xl font-bold tracking-widest uppercase text-xs hover:bg-[#2E4A28] transition-colors shadow-lg"
                >
                  Salin Rekening
                </button>
              </motion.div>
            </div>
          </section>

          <footer className="py-12 text-center bg-[#1F331A] text-white/50 font-sans text-xs tracking-widest uppercase">
            <p>© 2026 {groom} & {bride}. Created with FiveInvitation.</p>
          </footer>
        </main>
      </div>
    </SmoothScrollLayout>
  );
}
