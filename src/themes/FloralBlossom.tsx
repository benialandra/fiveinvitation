import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { id as localeId, enUS as localeEn } from 'date-fns/locale';
import toast from 'react-hot-toast';
import SmoothScrollLayout from '../components/Interactive/SmoothScrollLayout';
import AudioController from '../components/Interactive/AudioController';
import { Heart, MapPin, Calendar, Clock } from 'lucide-react';

interface ThemeProps {
  data?: any;
  guestName?: string;
  lang?: 'en' | 'id';
}

export default function FloralBlossom({ data, guestName, lang = 'id' }: ThemeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [petals, setPetals] = useState<{ id: number; left: number; delay: number; duration: number }[]>([]);
  const [comments, setComments] = useState([
    { id: 1, name: 'Siska', message: 'Selamat ya! Bahagia selalu untuk kalian berdua.' },
    { id: 2, name: 'Budi', message: 'Happy wedding! May your love blossom forever.' }
  ]);
  const [newName, setNewName] = useState('');
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Generate animasi jatuhnya bunga secara acak
    const newPetals = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, 
      delay: Math.random() * 10,  
      duration: Math.random() * 5 + 5, 
    }));
    setPetals(newPetals);
  }, []);

  if (!data) return <div className="min-h-screen flex items-center justify-center bg-rose-50 text-rose-900 font-serif">Memuat...</div>;

  const currentLocale = lang === 'en' ? localeEn : localeId;
  const t = {
    open: lang === 'en' ? 'Open Invitation' : 'Buka Undangan',
    dear: lang === 'en' ? 'Dear:' : 'Kepada Yth:',
    matrimony: lang === 'en' ? 'Holy Matrimony' : 'Akad Nikah',
    reception: lang === 'en' ? 'Wedding Reception' : 'Resepsi Pernikahan',
    countdown: lang === 'en' ? 'Countdown' : 'Menuju Hari H',
    story: lang === 'en' ? 'Our Story' : 'Kisah Kami',
    gallery: lang === 'en' ? 'Gallery' : 'Galeri Foto',
    gift: lang === 'en' ? 'Wedding Gift' : 'Tanda Kasih',
    guestbook: lang === 'en' ? 'Guest Book' : 'Buku Tamu',
    attendance: lang === 'en' ? 'Attendance' : 'Kehadiran',
    sendReply: lang === 'en' ? 'Send Reply' : 'Kirim Balasan',
  };

  const groom = data.groom_name || 'Romeo';
  const bride = data.bride_name || 'Juliet';
  const displayGuest = guestName || 'Tamu Undangan';
  
  const akadDateStr = data.akad_date || '2026-12-12T08:00:00';
  const resepsiDateStr = data.resepsi_date || '2026-12-12T11:00:00';
  const loveStory = data.story || "Like a flower, our love started as a seed, grew with patience, and bloomed into something beautiful.";
  
  const coverImg = data.cover_image || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop";
  const heroImg = data.hero_image || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop";
  const gallery1 = data.gallery_1 || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop";
  const gallery2 = data.gallery_2 || "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800&auto=format&fit=crop";
  const gallery3 = data.gallery_3 || "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800&auto=format&fit=crop";
  
  const bankName1 = data.bank_name_1 || "BCA";
  const bankAccount1 = data.bank_account_1 || "1234567890";
  const bankAccountName1 = data.bank_account_name_1 || groom;

  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

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
      <div className="font-serif text-rose-950 bg-rose-50 min-h-screen overflow-x-hidden relative selection:bg-rose-200 selection:text-rose-950">
        
        {isOpen && <AudioController src={data.music_url || "https://assets.mixkit.co/music/preview/mixkit-beautiful-dream-493.mp3"} />}

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
            filter: drop-shadow(0px 4px 4px rgba(0,0,0,0.1));
          }
        `}</style>

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

        {/* Cover Screen */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div 
              exit={{ opacity: 0, y: '-100%' }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-0 z-50 bg-rose-100 flex flex-col items-center justify-center"
            >
              <div className="absolute inset-0 bg-white/30 z-0">
                 <img src={coverImg} className="w-full h-full object-cover opacity-60" alt="Cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-rose-100 via-transparent to-rose-100/50" />
              
              <div className="z-10 text-center px-6 bg-white/70 p-12 rounded-full border-8 border-white shadow-xl backdrop-blur-md max-w-lg w-full mx-4">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
                  <p className="uppercase tracking-[0.2em] text-xs font-semibold mb-4 text-rose-800">The Wedding Of</p>
                  <h1 className="text-5xl md:text-6xl font-light mb-6 text-rose-950 italic">
                    {groom} & {bride}
                  </h1>
                </motion.div>
                
                {guestName && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }} className="mb-8 border-y-2 border-rose-950/10 py-4 px-8">
                    <p className="text-xs uppercase tracking-widest text-rose-800 mb-2">{t.dear}</p>
                    <p className="text-xl font-medium text-rose-950">{displayGuest}</p>
                  </motion.div>
                )}
                
                <motion.button 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 1 }}
                  onClick={() => setIsOpen(true)}
                  className="px-8 py-3 bg-rose-900 text-white rounded-full hover:bg-rose-800 transition-all uppercase tracking-widest text-xs font-bold shadow-lg hover:shadow-rose-900/30"
                >
                  {t.open}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        {isOpen && (
          <div className="relative z-10 pb-32">
            
            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-rose-50">
               <motion.div style={{ y: yBg }} className="absolute inset-0 opacity-30 bg-cover bg-center z-0" />
               <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-rose-100 to-transparent" />
               
               <motion.div 
                 initial={{ opacity: 0, y: 50 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 1.5, delay: 0.5 }}
                 className="relative z-10 max-w-4xl mx-auto px-6"
               >
                 <div className="w-48 h-48 md:w-64 md:h-64 mx-auto rounded-full p-2 border-2 border-rose-200 shadow-xl mb-12 bg-white rotate-3">
                    <img src={heroImg} className="w-full h-full object-cover rounded-full" alt="Hero" />
                 </div>
                 <p className="text-rose-800 text-sm uppercase tracking-[0.3em] font-medium mb-6">We Are Getting Married</p>
                 <h1 className="text-7xl md:text-9xl font-light text-rose-950 mb-8 italic">
                   {groom} <br/><span className="text-rose-400 font-sans text-5xl">&</span><br/> {bride}
                 </h1>
               </motion.div>
            </section>

            {/* Love Story */}
            <section className="py-24 px-6 text-center relative">
               <div className="max-w-2xl mx-auto bg-white/60 backdrop-blur-sm p-12 rounded-[3rem] border border-white shadow-xl">
                 <Heart className="w-8 h-8 text-rose-400 mx-auto mb-8" />
                 <p className="text-rose-800 text-xs uppercase tracking-widest mb-6 font-bold">{t.story}</p>
                 <h2 className="text-2xl md:text-4xl text-rose-950 leading-relaxed font-light italic">"{loveStory}"</h2>
               </div>
            </section>

            {/* Profiles */}
            <section className="py-24 px-6">
               <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16">
                  <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="flex-1 text-center"
                  >
                     <div className="w-56 h-72 md:w-64 md:h-80 mx-auto rounded-full border-[12px] border-white shadow-xl mb-8 bg-rose-100 overflow-hidden relative">
                        <img src={gallery1} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" alt={groom} />
                        <div className="absolute inset-0 bg-rose-900/10 mix-blend-overlay hover:bg-transparent transition-colors" />
                     </div>
                     <h3 className="text-4xl font-light text-rose-950 mb-2 italic">{groom}</h3>
                     <p className="text-xs text-rose-800 uppercase tracking-widest">Putra dari<br/><span className="text-rose-950 font-bold block mt-1">{data.groom_parents || 'Bpk. Hendra & Ibu Susi'}</span></p>
                  </motion.div>

                  <div className="text-6xl font-light text-rose-300 italic">&</div>

                  <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="flex-1 text-center"
                  >
                     <div className="w-56 h-72 md:w-64 md:h-80 mx-auto rounded-full border-[12px] border-white shadow-xl mb-8 bg-rose-100 overflow-hidden relative">
                        <img src={gallery2} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" alt={bride} />
                        <div className="absolute inset-0 bg-rose-900/10 mix-blend-overlay hover:bg-transparent transition-colors" />
                     </div>
                     <h3 className="text-4xl font-light text-rose-950 mb-2 italic">{bride}</h3>
                     <p className="text-xs text-rose-800 uppercase tracking-widest">Putri dari<br/><span className="text-rose-950 font-bold block mt-1">{data.bride_parents || 'Bpk. Budi & Ibu Ani'}</span></p>
                  </motion.div>
               </div>
            </section>

            {/* Countdown */}
            <section className="py-24 px-6 bg-rose-100/50">
               <div className="max-w-3xl mx-auto text-center bg-white p-12 md:p-16 rounded-[3rem] shadow-xl border-4 border-rose-50 relative">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-rose-50 px-6 py-2 rounded-full border border-rose-100">
                    <Heart className="w-6 h-6 text-rose-400" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-rose-800 mb-12">{t.countdown}</h3>
                  <div className="flex flex-wrap justify-center gap-6 md:gap-12">
                     {[
                       { label: "Hari", value: timeLeft.days },
                       { label: "Jam", value: timeLeft.hours },
                       { label: "Menit", value: timeLeft.minutes },
                       { label: "Detik", value: timeLeft.seconds }
                     ].map((item, idx) => (
                       <div key={idx} className="flex flex-col items-center">
                          <div className="text-5xl md:text-6xl font-light text-rose-950 mb-2">{item.value.toString().padStart(2, '0')}</div>
                          <div className="text-xs font-bold uppercase tracking-widest text-rose-400">{item.label}</div>
                       </div>
                     ))}
                  </div>
               </div>
            </section>

            {/* Event Details */}
            <section className="py-32 px-6">
               <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
                 <motion.div 
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 1 }}
                   className="bg-white p-10 rounded-[2rem] shadow-xl border border-rose-100 text-center relative group"
                 >
                   <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                      <Heart size={24} />
                   </div>
                   <h3 className="text-2xl font-light text-rose-950 mb-6 uppercase tracking-widest">{t.matrimony}</h3>
                   <p className="mb-2 text-3xl font-light text-rose-800 italic">{format(parseISO(akadDateStr), 'dd MMMM yyyy', { locale: currentLocale })}</p>
                   <div className="flex items-center justify-center gap-2 mb-8 text-rose-600 font-sans">
                      <Clock size={16} /> <p>{format(parseISO(akadDateStr), 'HH:mm')} WIB - Selesai</p>
                   </div>
                   <div className="flex flex-col items-center gap-2 mb-8 text-rose-800">
                      <MapPin size={20} className="text-rose-400" />
                      <p className="font-bold leading-relaxed">{data.location_name || 'Masjid Raya Kota'}</p>
                   </div>
                   {data.maps_link && (
                     <a href={data.maps_link} target="_blank" rel="noreferrer" className="inline-block px-8 py-3 bg-rose-50 text-rose-900 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-rose-100 transition-colors">Lihat Peta</a>
                   )}
                 </motion.div>
                 
                 <motion.div 
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 1, delay: 0.2 }}
                   className="bg-white p-10 rounded-[2rem] shadow-xl border border-rose-100 text-center relative group"
                 >
                   <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                      <Heart size={24} />
                   </div>
                   <h3 className="text-2xl font-light text-rose-950 mb-6 uppercase tracking-widest">{t.reception}</h3>
                   <p className="mb-2 text-3xl font-light text-rose-800 italic">{format(parseISO(resepsiDateStr), 'dd MMMM yyyy', { locale: currentLocale })}</p>
                   <div className="flex items-center justify-center gap-2 mb-8 text-rose-600 font-sans">
                      <Clock size={16} /> <p>{format(parseISO(resepsiDateStr), 'HH:mm')} WIB - Selesai</p>
                   </div>
                   <div className="flex flex-col items-center gap-2 mb-8 text-rose-800">
                      <MapPin size={20} className="text-rose-400" />
                      <p className="font-bold leading-relaxed">{data.location_name || 'Grand Ballroom Hotel'}</p>
                   </div>
                   {data.maps_link && (
                     <a href={data.maps_link} target="_blank" rel="noreferrer" className="inline-block px-8 py-3 bg-rose-50 text-rose-900 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-rose-100 transition-colors">Lihat Peta</a>
                   )}
                 </motion.div>
               </div>
            </section>

            {/* Gallery */}
            <section className="py-24 px-6 bg-rose-100/50">
              <div className="max-w-6xl mx-auto">
                 <div className="text-center mb-16">
                    <Heart className="w-6 h-6 text-rose-400 mx-auto mb-4" />
                    <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-rose-800">{t.gallery}</h3>
                 </div>
                 <div className="columns-1 md:columns-3 gap-6 space-y-6">
                    {[heroImg, gallery1, gallery2, coverImg, gallery3].map((img, i) => (
                       <motion.div 
                         key={i} 
                         initial={{ opacity: 0, y: 20 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         viewport={{ once: true }}
                         transition={{ duration: 0.8, delay: i * 0.1 }}
                         className="rounded-2xl overflow-hidden break-inside-avoid border-4 border-white shadow-lg"
                       >
                          <img src={img} className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700" alt="Gallery" />
                       </motion.div>
                    ))}
                 </div>
              </div>
            </section>

            {/* Gift */}
            <section className="py-32 px-6 text-center relative overflow-hidden">
              <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 transition={{ duration: 1 }}
                 className="max-w-2xl mx-auto relative z-10"
              >
                <Heart className="w-8 h-8 text-rose-400 mx-auto mb-6" />
                <h3 className="text-2xl font-light uppercase tracking-[0.2em] text-rose-950 mb-8">{t.gift}</h3>
                <p className="text-rose-800 tracking-wide mb-12 text-sm leading-relaxed font-sans">
                  Kehadiran serta doa restu Bapak/Ibu/Saudara/i merupakan kado yang tak ternilai maknanya. Namun apabila Anda hendak memberikan tanda kasih, dapat melalui:
                </p>

                <div className="p-10 bg-white rounded-[3rem] shadow-xl border-4 border-rose-50 max-w-md mx-auto relative overflow-hidden">
                  <div className="absolute -right-8 -top-8 w-24 h-24 bg-rose-100 rounded-full" />
                  <h3 className="text-xl font-bold font-sans tracking-widest text-rose-900 mb-4 uppercase">{bankName1}</h3>
                  <p className="text-3xl font-light text-rose-600 mb-2 font-mono tracking-wider">{bankAccount1}</p>
                  <p className="text-rose-800 font-sans text-sm mb-8 font-bold">a.n. {bankAccountName1}</p>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(bankAccount1);
                      toast.success('Nomor rekening disalin!', { icon: '🌸' });
                    }}
                    className="bg-rose-900 text-white px-8 py-4 rounded-full font-sans tracking-widest text-xs hover:bg-rose-800 transition-all shadow-lg w-full font-bold"
                  >
                    SALIN REKENING
                  </button>
                </div>
              </motion.div>
            </section>

            {/* Guestbook & RSVP */}
            <section className="py-32 px-6 bg-white">
               <div className="max-w-4xl mx-auto">
                  <div className="bg-rose-50 rounded-[3rem] p-8 md:p-16 shadow-xl border-4 border-white grid md:grid-cols-2 gap-16 relative">
                     
                     <div className="relative z-10">
                        <Heart className="w-6 h-6 text-rose-400 mb-6" />
                        <h3 className="text-3xl font-light text-rose-950 mb-4">R.S.V.P</h3>
                        <p className="text-rose-800 font-sans text-sm mb-8">Mohon konfirmasi kehadiran Anda untuk acara kami.</p>
                        
                        <form onSubmit={handleAddComment} className="space-y-6 font-sans">
                           <div>
                              <input 
                                type="text" 
                                placeholder="Nama Tamu"
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                className="w-full bg-white border border-rose-200 rounded-xl px-4 py-3 text-rose-950 focus:outline-none focus:border-rose-400 transition-colors text-sm shadow-sm"
                                required 
                              />
                           </div>
                           <div>
                              <textarea 
                                placeholder="Berikan Ucapan & Doa"
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                rows={4}
                                className="w-full bg-white border border-rose-200 rounded-xl px-4 py-3 text-rose-950 focus:outline-none focus:border-rose-400 transition-colors text-sm resize-none shadow-sm"
                                required 
                              />
                           </div>
                           <button type="submit" className="w-full bg-rose-900 text-white py-4 rounded-xl uppercase tracking-widest text-xs font-bold hover:bg-rose-800 transition-colors shadow-lg">
                              {t.sendReply}
                           </button>
                        </form>
                     </div>
                     
                     <div className="relative z-10 flex flex-col h-full">
                        <h3 className="text-xs font-bold font-sans uppercase tracking-[0.3em] text-rose-800 mb-8">{t.guestbook}</h3>
                        <div className="flex-1 space-y-4 max-h-[400px] overflow-y-auto pr-4 font-sans scrollbar-thin scrollbar-thumb-rose-200">
                           {comments.map(comment => (
                              <div key={comment.id} className="p-6 bg-white border border-rose-100 rounded-2xl shadow-sm">
                                 <p className="text-rose-900 font-bold text-sm mb-2 uppercase tracking-widest">{comment.name}</p>
                                 <p className="text-rose-700 text-sm leading-relaxed">{comment.message}</p>
                              </div>
                           ))}
                        </div>
                     </div>
                     
                  </div>
               </div>
            </section>

            {/* Footer */}
            <footer className="py-16 text-center">
               <Heart className="w-4 h-4 text-rose-400 mx-auto mb-4" />
               <p className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-rose-900 mb-4">Five Invitation</p>
               <p className="text-xs font-sans text-rose-500">© 2026 {groom} & {bride}. All rights reserved.</p>
            </footer>

          </div>
        )}
      </div>
    </SmoothScrollLayout>
  );
}
