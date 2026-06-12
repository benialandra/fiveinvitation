import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { id as localeId, enUS as localeEn } from 'date-fns/locale';
import SmoothScrollLayout from '../components/Interactive/SmoothScrollLayout';
import AudioController from '../components/Interactive/AudioController';
import { MapPin, Calendar, Clock, Leaf } from 'lucide-react';

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
    <div className="fixed inset-0 pointer-events-none z-[40] overflow-hidden opacity-40">
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
            <path d="M17.5 2c-2.5 0-6.19 1.62-8.5 3.84V4H7v6h6V8.5H9.69c1.61-1.61 4.54-3 6.81-3 1.94 0 3.5 1.56 3.5 3.5 0 2.27-1.39 5.2-3 6.81V13h-1.5v6h6v-1.5h-4.16c2.22-2.31 3.84-6 3.84-8.5C21 5.09 19.41 2 17.5 2z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

interface ThemeProps {
  data?: any;
  guestName?: string;
  lang?: 'en' | 'id';
}

export default function TropicalBaliWedding({ data, guestName, lang = 'id' }: ThemeProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [comments, setComments] = useState([
    { id: 1, name: 'Wayan Family', message: 'Selamat menempuh hidup baru, semoga langgeng.' },
    { id: 2, name: 'Made & Ayu', message: 'Happy wedding! Wishing you both a beautiful journey ahead.' }
  ]);
  const [newName, setNewName] = useState('');
  const [newMessage, setNewMessage] = useState('');

  if (!data) return <div className="min-h-screen flex items-center justify-center bg-[#F4F1EA] text-[#2E4A28]">Loading...</div>;

  const currentLocale = lang === 'en' ? localeEn : localeId;
  const t = {
    open: lang === 'en' ? 'Open Invitation' : 'Buka Undangan',
    dear: lang === 'en' ? 'Dear:' : 'Kepada Yth:',
    matrimony: lang === 'en' ? 'Holy Matrimony' : 'Akad Nikah',
    reception: lang === 'en' ? 'Wedding Reception' : 'Resepsi Pernikahan',
    countdown: lang === 'en' ? 'Countdown' : 'Menuju Hari H',
    story: lang === 'en' ? 'Our Story' : 'Kisah Kami',
    gallery: lang === 'en' ? 'Gallery' : 'Galeri Kenangan',
    gift: lang === 'en' ? 'Wedding Gift' : 'Tanda Kasih',
    guestbook: lang === 'en' ? 'Guest Book' : 'Buku Tamu',
    attendance: lang === 'en' ? 'Attendance' : 'Kehadiran',
    sendReply: lang === 'en' ? 'Send Reply' : 'Kirim Balasan',
  };

  const groom = data.groom_name || 'Bagus';
  const bride = data.bride_name || 'Ayu';
  const displayGuest = guestName || 'Tamu Kehormatan';
  
  const akadDateStr = data.akad_date || '2026-12-31T08:00:00';
  const resepsiDateStr = data.resepsi_date || '2026-12-31T15:00:00';
  const loveStory = data.story || "Like the lush jungles of Bali, our love grows wild, deep, and endlessly beautiful.";
  
  const coverImg = data.cover_image || "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2000&auto=format&fit=crop"; 
  const heroImg = data.hero_image || "https://images.unsplash.com/photo-1544078754-0a3791001a1c?q=80&w=2000&auto=format&fit=crop"; 
  const groomImg = data.groom_image || data.gallery_1 || "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop";
  const brideImg = data.bride_image || data.gallery_2 || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop";
  const gallery1 = data.gallery_1 || "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop";
  const gallery2 = data.gallery_2 || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop";
  const gallery3 = data.gallery_3 || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop";
  const gallery4 = data.gallery_4 || "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800&auto=format&fit=crop";
  
  const bankName1 = data.bank_name_1 || "BCA";
  const bankAccount1 = data.bank_account_1 || "0987654321";
  const bankAccountName1 = data.bank_account_name_1 || groom;

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
      <div className="font-serif text-[#2E4A28] bg-[#F4F1EA] min-h-screen overflow-x-hidden relative selection:bg-[#2E4A28] selection:text-[#F4F1EA]">
        
        {isOpened && <AudioController src={data.music_url || "https://assets.mixkit.co/music/preview/mixkit-acoustic-guitar-wedding-145.mp3"} />}
        {isOpened && <TropicalLeaves />}

        {/* Cover Screen */}
        <AnimatePresence>
          {!isOpened && (
            <motion.div 
              exit={{ opacity: 0, y: '-100%' }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-[#2E4A28]"
            >
              <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay" style={{ backgroundImage: `url('${coverImg}')` }} />
              
              <div className="relative z-10 max-w-lg w-full bg-[#F4F1EA]/95 p-12 text-center rounded-t-[10rem] border-t-8 border-[#2E4A28]/20 shadow-2xl">
                <Leaf className="w-8 h-8 text-[#2E4A28]/50 mx-auto mb-6" />
                <p className="uppercase tracking-[0.3em] text-xs font-bold mb-4 text-[#8C9C84]">The Wedding Of</p>
                <h1 className="text-5xl md:text-6xl font-light mb-8 text-[#2E4A28] italic">
                  {groom} <br/><span className="text-3xl font-sans">&</span><br/> {bride}
                </h1>
                
                {guestName && (
                  <div className="mb-8 py-4 border-y border-[#2E4A28]/20">
                    <p className="text-[10px] uppercase tracking-widest text-[#8C9C84] mb-2 font-sans">{t.dear}</p>
                    <p className="text-xl font-medium text-[#2E4A28]">{displayGuest}</p>
                  </div>
                )}
                
                <button 
                  onClick={() => setIsOpened(true)}
                  className="px-8 py-4 bg-[#2E4A28] text-[#F4F1EA] rounded-full uppercase tracking-widest text-xs font-bold hover:bg-[#1f331b] transition-colors shadow-lg"
                >
                  {t.open}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        {isOpened && (
          <div className="relative z-10 pb-32">
            
            {/* Hero Section */}
            <section className="min-h-screen flex flex-col items-center justify-center text-center p-6 pt-32 relative">
               <div className="absolute inset-0 pointer-events-none opacity-20">
                  <div className="w-64 h-64 bg-[#8C9C84] rounded-full blur-[100px] absolute top-20 left-10" />
                  <div className="w-64 h-64 bg-[#2E4A28] rounded-full blur-[100px] absolute bottom-20 right-10" />
               </div>
               
               <motion.div 
                 initial={{ opacity: 0, y: 50 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 1.5, delay: 0.5 }}
                 className="relative z-10"
               >
                 <div className="w-56 h-72 md:w-72 md:h-96 mx-auto rounded-full overflow-hidden border-8 border-[#F4F1EA] shadow-2xl mb-12 relative group">
                    <img src={heroImg} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Hero" />
                 </div>
                 <p className="text-[#8C9C84] font-sans text-xs uppercase tracking-[0.4em] font-bold mb-6">A Tropical Love Story</p>
                 <h1 className="text-6xl md:text-8xl font-light text-[#2E4A28] mb-8 italic leading-none">
                   {groom} <br/><span className="text-[#8C9C84] font-sans text-4xl">&</span><br/> {bride}
                 </h1>
               </motion.div>
            </section>

            {/* Love Story */}
            <section className="py-24 px-6 text-center">
               <motion.div 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 1 }}
                 className="max-w-2xl mx-auto bg-[#2E4A28] p-12 md:p-16 rounded-[4rem] rounded-tr-none text-[#F4F1EA] shadow-xl relative"
               >
                 <Leaf className="w-8 h-8 text-[#8C9C84] mx-auto mb-8 opacity-50" />
                 <h3 className="text-xs font-sans uppercase tracking-[0.3em] text-[#8C9C84] mb-8 font-bold">{t.story}</h3>
                 <p className="text-2xl md:text-3xl font-light italic leading-relaxed">"{loveStory}"</p>
               </motion.div>
            </section>

            {/* Profiles */}
            <section className="py-24 px-6 relative">
               <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16 md:gap-32">
                  <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="flex-1 text-center"
                  >
                     <div className="w-56 h-56 mx-auto rounded-[3rem] overflow-hidden shadow-xl mb-6 bg-[#8C9C84] rotate-3 hover:rotate-0 transition-all duration-500">
                        <img src={groomImg} className="w-full h-full object-cover mix-blend-multiply opacity-90 hover:mix-blend-normal hover:opacity-100 transition-all duration-500" alt={groom} />
                     </div>
                     <h3 className="text-4xl font-light text-[#2E4A28] mb-2 italic">{groom}</h3>
                     <p className="text-[10px] font-sans font-bold tracking-widest text-[#8C9C84] uppercase mb-1">Putra Dari</p>
                     <p className="text-sm font-sans font-bold text-[#2E4A28]">{data.groom_parents || 'Bpk. Wayan & Ibu Kadek'}</p>
                  </motion.div>

                  <div className="text-6xl font-light text-[#8C9C84] italic hidden md:block">&</div>

                  <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="flex-1 text-center"
                  >
                     <div className="w-56 h-56 mx-auto rounded-[3rem] overflow-hidden shadow-xl mb-6 bg-[#8C9C84] -rotate-3 hover:rotate-0 transition-all duration-500">
                        <img src={brideImg} className="w-full h-full object-cover mix-blend-multiply opacity-90 hover:mix-blend-normal hover:opacity-100 transition-all duration-500" alt={bride} />
                     </div>
                     <h3 className="text-4xl font-light text-[#2E4A28] mb-2 italic">{bride}</h3>
                     <p className="text-[10px] font-sans font-bold tracking-widest text-[#8C9C84] uppercase mb-1">Putri Dari</p>
                     <p className="text-sm font-sans font-bold text-[#2E4A28]">{data.bride_parents || 'Bpk. Made & Ibu Nyoman'}</p>
                  </motion.div>
               </div>
            </section>

            {/* Countdown */}
            <section className="py-24 px-6">
               <div className="max-w-3xl mx-auto text-center border-y-2 border-[#2E4A28]/10 py-16">
                  <h3 className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-[#8C9C84] mb-12">{t.countdown}</h3>
                  <div className="flex flex-wrap justify-center gap-6 md:gap-12">
                     {[
                       { label: "Hari", value: timeLeft.days },
                       { label: "Jam", value: timeLeft.hours },
                       { label: "Menit", value: timeLeft.minutes },
                       { label: "Detik", value: timeLeft.seconds }
                     ].map((item, idx) => (
                       <div key={idx} className="flex flex-col items-center">
                          <div className="text-5xl md:text-6xl font-light text-[#2E4A28] mb-2">{item.value.toString().padStart(2, '0')}</div>
                          <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#8C9C84]">{item.label}</div>
                       </div>
                     ))}
                  </div>
               </div>
            </section>

            {/* Event Details */}
            <section className="py-32 px-6">
               <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
                 <motion.div 
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 1 }}
                   className="bg-white p-10 md:p-12 rounded-[3rem] rounded-tl-none shadow-xl border border-[#F4F1EA] text-center"
                 >
                   <div className="w-16 h-16 bg-[#2E4A28] rounded-full flex items-center justify-center mx-auto mb-8 text-[#F4F1EA]">
                      <Calendar size={24} />
                   </div>
                   <h3 className="text-2xl font-light text-[#2E4A28] mb-6 uppercase tracking-widest">{t.matrimony}</h3>
                   <p className="mb-2 text-3xl font-light text-[#2E4A28] italic">{format(parseISO(akadDateStr), 'dd MMMM yyyy', { locale: currentLocale })}</p>
                   <div className="flex items-center justify-center gap-2 mb-8 text-[#8C9C84] font-sans font-bold">
                      <Clock size={16} /> <p>{format(parseISO(akadDateStr), 'HH:mm')} WIB - Selesai</p>
                   </div>
                   <div className="flex flex-col items-center gap-2 mb-8 text-[#2E4A28]">
                      <MapPin size={20} className="text-[#8C9C84]" />
                      <p className="font-bold font-sans">{data.location_name || 'Ubud Water Palace'}</p>
                   </div>
                   {data.maps_link && (
                     <a href={data.maps_link} target="_blank" rel="noreferrer" className="inline-block px-8 py-3 bg-[#F4F1EA] text-[#2E4A28] rounded-full text-[10px] font-sans font-bold uppercase tracking-widest hover:bg-[#8C9C84] hover:text-[#F4F1EA] transition-colors">Lihat Peta</a>
                   )}
                 </motion.div>
                 
                 <motion.div 
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 1, delay: 0.2 }}
                   className="bg-white p-10 md:p-12 rounded-[3rem] rounded-tr-none shadow-xl border border-[#F4F1EA] text-center"
                 >
                   <div className="w-16 h-16 bg-[#2E4A28] rounded-full flex items-center justify-center mx-auto mb-8 text-[#F4F1EA]">
                      <Calendar size={24} />
                   </div>
                   <h3 className="text-2xl font-light text-[#2E4A28] mb-6 uppercase tracking-widest">{t.reception}</h3>
                   <p className="mb-2 text-3xl font-light text-[#2E4A28] italic">{format(parseISO(resepsiDateStr), 'dd MMMM yyyy', { locale: currentLocale })}</p>
                   <div className="flex items-center justify-center gap-2 mb-8 text-[#8C9C84] font-sans font-bold">
                      <Clock size={16} /> <p>{format(parseISO(resepsiDateStr), 'HH:mm')} WIB - Selesai</p>
                   </div>
                   <div className="flex flex-col items-center gap-2 mb-8 text-[#2E4A28]">
                      <MapPin size={20} className="text-[#8C9C84]" />
                      <p className="font-bold font-sans">{data.location_name || 'Ubud Tropical Garden'}</p>
                   </div>
                   {data.maps_link && (
                     <a href={data.maps_link} target="_blank" rel="noreferrer" className="inline-block px-8 py-3 bg-[#F4F1EA] text-[#2E4A28] rounded-full text-[10px] font-sans font-bold uppercase tracking-widest hover:bg-[#8C9C84] hover:text-[#F4F1EA] transition-colors">Lihat Peta</a>
                   )}
                 </motion.div>
               </div>
            </section>

            {/* Gallery */}
            <section className="py-24 px-6 text-center">
               <h3 className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-[#8C9C84] mb-12">{t.gallery}</h3>
               <div className="max-w-6xl mx-auto columns-2 md:columns-3 gap-6 space-y-6">
                  {[gallery1, gallery2, gallery3, gallery4].map((img, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className={`overflow-hidden shadow-lg ${i % 2 === 0 ? 'rounded-[3rem] rounded-tl-none' : 'rounded-[3rem] rounded-br-none'}`}
                    >
                       <img src={img} className="w-full h-auto object-cover hover:scale-110 transition-transform duration-700" alt="Gallery" />
                    </motion.div>
                  ))}
               </div>
            </section>

            {/* Gift */}
            <section className="py-32 px-6 relative">
              <motion.div
                 initial={{ opacity: 0, y: 50 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 1 }}
                 className="max-w-2xl mx-auto text-center"
              >
                <Leaf className="w-8 h-8 text-[#8C9C84] mx-auto mb-6" />
                <h3 className="text-3xl font-light italic text-[#2E4A28] mb-8">{t.gift}</h3>
                <p className="text-[#8C9C84] font-sans tracking-wide mb-12 text-sm leading-relaxed">
                  Bagi keluarga dan sahabat yang ingin mengirimkan hadiah, kami menyediakan amplop digital di bawah ini:
                </p>

                <div className="p-10 bg-[#2E4A28] rounded-[3rem] shadow-xl text-[#F4F1EA] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#8C9C84]/20 rounded-bl-full" />
                  <h3 className="text-xl font-bold font-sans tracking-widest text-[#8C9C84] mb-4 uppercase">{bankName1}</h3>
                  <p className="text-4xl font-light text-[#F4F1EA] mb-2 font-mono tracking-widest">{bankAccount1}</p>
                  <p className="text-[#8C9C84] font-sans text-sm mb-10 font-bold uppercase tracking-widest">A.N. {bankAccountName1}</p>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(bankAccount1);
                      toast.success('Nomor rekening disalin!', { icon: '🌿' });
                    }}
                    className="bg-[#F4F1EA] text-[#2E4A28] px-8 py-4 rounded-full font-sans tracking-widest text-xs hover:bg-[#8C9C84] hover:text-[#F4F1EA] transition-colors w-full font-bold shadow-lg"
                  >
                    SALIN REKENING
                  </button>
                </div>
              </motion.div>
            </section>

            {/* Guestbook & RSVP */}
            <section className="py-32 px-6">
               <div className="max-w-5xl mx-auto">
                  <div className="bg-white rounded-[4rem] p-8 md:p-16 shadow-2xl grid md:grid-cols-2 gap-16 relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-32 h-32 bg-[#F4F1EA] rounded-br-full" />
                     
                     <div className="relative z-10">
                        <h3 className="text-4xl font-light text-[#2E4A28] mb-4 italic">R.S.V.P</h3>
                        <p className="text-[#8C9C84] font-sans text-sm mb-12">Mohon konfirmasi kehadiran Anda.</p>
                        
                        <form onSubmit={handleAddComment} className="space-y-8 font-sans">
                           <div>
                              <input 
                                type="text" 
                                placeholder="Nama Lengkap"
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                className="w-full bg-transparent border-b border-[#8C9C84]/50 px-0 py-3 text-[#2E4A28] focus:outline-none focus:border-[#2E4A28] transition-colors text-sm font-bold"
                                required 
                              />
                           </div>
                           <div>
                              <textarea 
                                placeholder="Berikan Ucapan & Doa"
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                rows={4}
                                className="w-full bg-transparent border-b border-[#8C9C84]/50 px-0 py-3 text-[#2E4A28] focus:outline-none focus:border-[#2E4A28] transition-colors text-sm font-bold resize-none"
                                required 
                              />
                           </div>
                           <button type="submit" className="w-full bg-[#2E4A28] text-[#F4F1EA] py-4 rounded-full uppercase tracking-widest text-xs font-bold hover:bg-[#1f331b] transition-colors shadow-lg mt-4">
                              {t.sendReply}
                           </button>
                        </form>
                     </div>
                     
                     <div className="relative z-10 flex flex-col h-full">
                        <h3 className="text-xs font-bold font-sans uppercase tracking-[0.3em] text-[#8C9C84] mb-8">{t.guestbook}</h3>
                        <div className="flex-1 space-y-4 max-h-[400px] overflow-y-auto pr-4 font-sans scrollbar-thin scrollbar-thumb-[#8C9C84]/50">
                           {comments.map(comment => (
                              <div key={comment.id} className="p-6 bg-[#F4F1EA] rounded-[2rem] rounded-tl-none shadow-sm">
                                 <p className="text-[#2E4A28] font-bold text-sm mb-2 uppercase tracking-widest">{comment.name}</p>
                                 <p className="text-[#2E4A28]/70 text-sm leading-relaxed">{comment.message}</p>
                              </div>
                           ))}
                        </div>
                     </div>
                     
                  </div>
               </div>
            </section>

            {/* Footer */}
            <footer className="py-16 text-center border-t-2 border-[#2E4A28]/10 max-w-4xl mx-auto">
               <Leaf className="w-6 h-6 text-[#8C9C84] mx-auto mb-6" />
               <h3 className="text-3xl font-light italic text-[#2E4A28] mb-4">{groom} & {bride}</h3>
               <p className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-[#8C9C84]">Five Invitation © 2026</p>
            </footer>

          </div>
        )}
      </div>
    </SmoothScrollLayout>
  );
}
