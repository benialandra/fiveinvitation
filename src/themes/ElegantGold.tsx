import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { id as localeId, enUS as localeEn } from 'date-fns/locale';
import toast from 'react-hot-toast';
import SmoothScrollLayout from '../components/Interactive/SmoothScrollLayout';
import AudioController from '../components/Interactive/AudioController';

interface ThemeProps {
  data?: any;
  guestName?: string;
  lang?: 'en' | 'id';
}

export default function ElegantGold({ data, guestName, lang = 'id' }: ThemeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [comments, setComments] = useState([
    { id: 1, name: 'Bpk & Ibu Santoso', message: 'Selamat menempuh hidup baru, semoga sakinah mawaddah warahmah.' },
    { id: 2, name: 'Dimas', message: 'Happy wedding brother! Lancar terus ya.' }
  ]);
  const [newName, setNewName] = useState('');
  const [newMessage, setNewMessage] = useState('');

  if (!data) return <div className="min-h-screen flex items-center justify-center bg-black text-amber-500">Loading...</div>;

  const currentLocale = lang === 'en' ? localeEn : localeId;
  const t = {
    open: lang === 'en' ? 'Open Invitation' : 'Buka Undangan',
    dear: lang === 'en' ? 'Dear:' : 'Kepada Yth:',
    matrimony: lang === 'en' ? 'Holy Matrimony' : 'Akad Nikah',
    reception: lang === 'en' ? 'Wedding Reception' : 'Resepsi Pernikahan',
    countdown: lang === 'en' ? 'Countdown' : 'Menuju Hari H',
    story: lang === 'en' ? 'Our Story' : 'Kisah Kami',
    gallery: lang === 'en' ? 'Gallery' : 'Galeri',
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
  const loveStory = data.story || "Diciptakan-Nya untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.";
  
  const coverImg = data.cover_image || "https://images.unsplash.com/photo-1544078754-0a3791001a1c?q=60&w=2000&auto=format&fit=crop&fm=webp&q=60";
  const heroImg = data.hero_image || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=60&w=2000&auto=format&fit=crop&fm=webp&q=60";
  const groomImg = data.groom_image || data.gallery_1 || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=60&w=800&auto=format&fit=crop&fm=webp&q=60";
  const brideImg = data.bride_image || data.gallery_2 || "https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=800&auto=format&fit=crop&fm=webp&q=60";
  const gallery1 = data.gallery_1 || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=60&w=800&auto=format&fit=crop&fm=webp&q=60";
  const gallery2 = data.gallery_2 || "https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=800&auto=format&fit=crop&fm=webp&q=60";
  const gallery3 = data.gallery_3 || "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=60&w=800&auto=format&fit=crop&fm=webp&q=60";
  const gallery4 = data.gallery_4 || "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=60&w=800&auto=format&fit=crop&fm=webp&q=60";
  
  const bankName1 = data.bank_name_1 || "BCA";
  const bankAccount1 = data.bank_account_1 || "1234567890";
  const bankAccountName1 = data.bank_account_name_1 || groom;

  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

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
      <div className="min-h-screen bg-black text-rose-50 font-serif overflow-x-hidden relative selection:bg-amber-500/30">
        {isOpen && <AudioController src={data.music_url || "https://assets.mixkit.co/music/preview/mixkit-beautiful-dream-493.mp3"} />}

        {/* Cover Overlay */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div 
              exit={{ opacity: 0, y: '-100%' }}
              transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
            >
              <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url('${coverImg}')` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              
              <div className="relative z-10 text-center max-w-lg px-6">
                <p className="text-amber-500 font-serif text-xs uppercase tracking-[0.3em] mb-6">The Wedding Of</p>
                <h1 className="text-5xl md:text-7xl font-light tracking-tight text-amber-300 mb-8">{groom} & {bride}</h1>
                <div className="w-12 h-px bg-amber-500/50 mx-auto mb-8" />
                
                {guestName && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}>
                    <p className="text-white/60 font-sans text-xs uppercase tracking-widest mb-2">{t.dear}</p>
                    <p className="text-xl font-light text-white mb-12">{displayGuest}</p>
                  </motion.div>
                )}
                
                <button 
                  onClick={() => setIsOpen(true)}
                  className="mt-8 px-8 py-4 bg-transparent border border-amber-500/50 text-amber-400 font-medium rounded-full uppercase tracking-widest text-xs hover:bg-amber-900/30 transition-colors"
                >
                  {t.open}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        {isOpen && (
          <div className="relative z-10">
            {/* Hero Section */}
            <div className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
               <motion.div style={{ y: yBg, backgroundImage: `url('${heroImg}')` }} className="absolute inset-0 opacity-40 bg-cover bg-center z-0" />
               <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-0" />
               
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 1.5 }}
                 className="relative z-10 border border-amber-600/50 p-12 lg:p-24 rounded-t-full backdrop-blur-sm bg-black/40 mx-6 mt-32"
               >
                 <h3 className="text-amber-500 uppercase tracking-[0.3em] text-sm mb-6">The Wedding</h3>
                 <h1 className="text-6xl md:text-8xl text-amber-300 font-light mb-8 leading-tight">
                   {groom} <br/><span className="text-4xl italic text-white/50">&</span> <br/>{bride}
                 </h1>
                 <div className="w-px h-24 bg-gradient-to-b from-amber-500/50 to-transparent mx-auto mt-12" />
               </motion.div>
            </div>

            {/* Quote / Love Story */}
            <section className="py-24 px-6 text-center bg-black relative">
               <div className="max-w-3xl mx-auto">
                 <h2 className="text-3xl md:text-4xl text-amber-500 italic mb-12 font-light">"{loveStory}"</h2>
               </div>
            </section>

            {/* Profiles */}
            <section className="py-24 px-6 bg-[#050505]">
               <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16">
                  <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="flex-1 text-center"
                  >
                     <div className="w-56 h-72 mx-auto border border-amber-900/40 p-2 mb-8 rounded-t-full">
                        <img src={groomImg} className="w-full h-full object-cover rounded-t-full opacity-80 hover:opacity-100 transition-opacity" alt={groom} />
                     </div>
                     <h3 className="text-4xl font-light text-amber-300 mb-2">{groom}</h3>
                     <p className="text-xs text-white/50 uppercase tracking-widest font-sans">Putra dari<br/><span className="text-white mt-1 block">{data.groom_parents || 'Bpk. Hendra & Ibu Susi'}</span></p>
                  </motion.div>

                  <div className="text-5xl font-light text-amber-500/30 italic">&</div>

                  <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="flex-1 text-center"
                  >
                     <div className="w-56 h-72 mx-auto border border-amber-900/40 p-2 mb-8 rounded-t-full">
                        <img src={brideImg} className="w-full h-full object-cover rounded-t-full opacity-80 hover:opacity-100 transition-opacity" alt={bride} />
                     </div>
                     <h3 className="text-4xl font-light text-amber-300 mb-2">{bride}</h3>
                     <p className="text-xs text-white/50 uppercase tracking-widest font-sans">Putri dari<br/><span className="text-white mt-1 block">{data.bride_parents || 'Bpk. Budi & Ibu Ani'}</span></p>
                  </motion.div>
               </div>
            </section>

            {/* Countdown */}
            <section className="py-24 px-6 bg-black border-y border-amber-900/30">
               <div className="max-w-4xl mx-auto text-center">
                  <h3 className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-amber-500 mb-12">{t.countdown}</h3>
                  <div className="grid grid-cols-4 gap-4 md:gap-8 max-w-2xl mx-auto">
                     {[
                       { label: "Hari", value: timeLeft.days },
                       { label: "Jam", value: timeLeft.hours },
                       { label: "Menit", value: timeLeft.minutes },
                       { label: "Detik", value: timeLeft.seconds }
                     ].map((item, idx) => (
                       <div key={idx} className="border border-amber-900/40 p-4 md:p-8 bg-black/50 backdrop-blur-sm rounded-lg">
                          <div className="text-3xl md:text-5xl font-light text-amber-300 mb-2">{item.value}</div>
                          <div className="text-[10px] md:text-xs font-sans uppercase tracking-widest text-white/50">{item.label}</div>
                       </div>
                     ))}
                  </div>
               </div>
            </section>

            {/* Event Details */}
            <section className="py-32 px-6 bg-[#0a0a0a]">
               <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
                 <motion.div 
                   initial={{ opacity: 0, x: -30 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 1 }}
                   className="p-10 border border-amber-900/40 rounded-3xl bg-black/30 text-center relative overflow-hidden"
                 >
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />
                   <h3 className="text-2xl font-serif text-amber-500 mb-6 uppercase tracking-widest text-sm">{t.matrimony}</h3>
                   <p className="mb-2 text-3xl font-light text-amber-300">{format(parseISO(akadDateStr), 'dd MMMM yyyy', { locale: currentLocale })}</p>
                   <p className="mb-8 text-white/80 font-sans">{format(parseISO(akadDateStr), 'HH:mm')} WIB - Selesai</p>
                   <p className="text-sm font-sans tracking-wide text-white/70 mb-6">{data.location_name || 'Masjid Raya Kota'}</p>
                   {data.maps_link && (
                     <a href={data.maps_link} target="_blank" rel="noreferrer" className="inline-block px-6 py-2 border border-amber-600/50 rounded-full text-xs font-sans uppercase tracking-widest text-amber-400 hover:bg-amber-900/30 transition-colors">Lihat Peta</a>
                   )}
                 </motion.div>
                 
                 <motion.div 
                   initial={{ opacity: 0, x: 30 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 1, delay: 0.2 }}
                   className="p-10 border border-amber-900/40 rounded-3xl bg-black/30 text-center relative overflow-hidden"
                 >
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />
                   <h3 className="text-2xl font-serif text-amber-500 mb-6 uppercase tracking-widest text-sm">{t.reception}</h3>
                   <p className="mb-2 text-3xl font-light text-amber-300">{format(parseISO(resepsiDateStr), 'dd MMMM yyyy', { locale: currentLocale })}</p>
                   <p className="mb-8 text-white/80 font-sans">{format(parseISO(resepsiDateStr), 'HH:mm')} WIB - Selesai</p>
                   <p className="text-sm font-sans tracking-wide text-white/70 mb-6">{data.location_name || 'Grand Ballroom Hotel'}</p>
                   {data.maps_link && (
                     <a href={data.maps_link} target="_blank" rel="noreferrer" className="inline-block px-6 py-2 border border-amber-600/50 rounded-full text-xs font-sans uppercase tracking-widest text-amber-400 hover:bg-amber-900/30 transition-colors">Lihat Peta</a>
                   )}
                 </motion.div>
               </div>
            </section>

            {/* Gallery */}
            <section className="py-24 px-6 border-t border-amber-900/30 bg-black">
              <div className="max-w-6xl mx-auto">
                 <h3 className="text-center text-xs font-sans uppercase tracking-[0.3em] text-amber-500 mb-16">{t.gallery}</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[gallery1, gallery2, gallery3, gallery4].map((img, i) => (
                       <motion.div 
                         key={i} 
                         initial={{ opacity: 0, scale: 0.9 }}
                         whileInView={{ opacity: 1, scale: 1 }}
                         viewport={{ once: true }}
                         transition={{ duration: 0.8, delay: i * 0.1 }}
                         className={`rounded-2xl overflow-hidden border border-amber-900/30 aspect-square`}
                       >
                          <img src={img} className="w-full h-full object-cover opacity-70 hover:opacity-100 hover:scale-105 transition-all duration-700" alt="Gallery" />
                       </motion.div>
                    ))}
                 </div>
              </div>
            </section>

            {/* Gift */}
            <section className="py-32 px-6 bg-[#050505] border-t border-amber-900/30 text-center">
              <motion.div
                 initial={{ opacity: 0, y: 50 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 1 }}
                 className="max-w-2xl mx-auto"
              >
                <h3 className="text-xs font-sans uppercase tracking-[0.3em] text-amber-500 mb-8">{t.gift}</h3>
                <p className="text-white/60 font-sans tracking-wide mb-16 text-sm leading-relaxed">
                  Doa dan restu Anda merupakan hadiah yang luar biasa. Namun apabila Anda hendak memberikan tanda kasih, dapat melalui:
                </p>

                <div className="p-8 border border-amber-900/40 rounded-3xl bg-black/40 backdrop-blur-sm relative overflow-hidden max-w-md mx-auto">
                  <div className="absolute -right-16 -top-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl" />
                  <h3 className="text-xl font-bold font-sans tracking-widest text-white mb-4 uppercase">{bankName1}</h3>
                  <p className="text-3xl font-sans tracking-widest text-amber-400 mb-2">{bankAccount1}</p>
                  <p className="text-white/60 font-sans text-sm mb-8">a.n. {bankAccountName1}</p>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(bankAccount1);
                      toast.success('Nomor rekening disalin!', { style: { background: '#333', color: '#fff' } });
                    }}
                    className="border border-amber-500/50 text-amber-400 px-8 py-3 rounded-full font-sans tracking-widest text-xs hover:bg-amber-900/30 transition-colors w-full"
                  >
                    SALIN REKENING
                  </button>
                </div>
              </motion.div>
            </section>

            {/* Guestbook & RSVP */}
            <section className="py-32 px-6 bg-black border-t border-amber-900/30">
               <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16">
                  <div>
                     <h3 className="text-3xl font-light text-amber-500 mb-8">R.S.V.P</h3>
                     <p className="text-white/50 font-sans text-sm mb-8">Mohon konfirmasi kehadiran Anda melalui form di bawah ini.</p>
                     
                     <form onSubmit={handleAddComment} className="space-y-6 font-sans">
                        <div>
                           <input 
                             type="text" 
                             placeholder="Nama Tamu"
                             value={newName}
                             onChange={e => setNewName(e.target.value)}
                             className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors text-sm"
                             required 
                           />
                        </div>
                        <div>
                           <textarea 
                             placeholder="Berikan Ucapan"
                             value={newMessage}
                             onChange={e => setNewMessage(e.target.value)}
                             rows={4}
                             className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors text-sm resize-none"
                             required 
                           />
                        </div>
                        <button type="submit" className="w-full bg-amber-600/20 text-amber-400 border border-amber-500/50 py-4 rounded-full uppercase tracking-widest text-xs font-bold hover:bg-amber-600/40 transition-colors">
                           {t.sendReply}
                        </button>
                     </form>
                  </div>
                  
                  <div>
                     <h3 className="text-xs font-sans uppercase tracking-[0.3em] text-amber-500 mb-8">{t.guestbook}</h3>
                     <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 font-sans scrollbar-thin scrollbar-thumb-amber-900/50">
                        {comments.map(comment => (
                           <div key={comment.id} className="p-6 bg-[#050505] border border-amber-900/30 rounded-2xl">
                              <p className="text-amber-400 font-bold text-sm mb-2 uppercase tracking-widest">{comment.name}</p>
                              <p className="text-white/70 text-sm leading-relaxed">{comment.message}</p>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </section>

            {/* Footer */}
            <footer className="py-16 text-center border-t border-amber-900/30 bg-[#050505]">
               <p className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-amber-600 mb-4">Five Invitation</p>
               <p className="text-xs font-sans text-white/40">© 2026 {groom} & {bride}. All rights reserved.</p>
            </footer>

          </div>
        )}
      </div>
    </SmoothScrollLayout>
  );
}
