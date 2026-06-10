import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { id as localeId, enUS as localeEn } from 'date-fns/locale';
import toast from 'react-hot-toast';
import SmoothScrollLayout from '../components/Interactive/SmoothScrollLayout';
import AudioController from '../components/Interactive/AudioController';
import { MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';

interface ThemeProps {
  data?: any;
  guestName?: string;
  lang?: 'en' | 'id';
}

export default function DarkPremium({ data, guestName, lang = 'id' }: ThemeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [comments, setComments] = useState([
    { id: 1, name: 'Jason & Family', message: 'Congratulations! Wishing you a lifetime of happiness.' },
    { id: 2, name: 'Amanda', message: 'So happy for both of you!' }
  ]);
  const [newName, setNewName] = useState('');
  const [newMessage, setNewMessage] = useState('');

  if (!data) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-indigo-400 font-mono tracking-widest text-xs uppercase">Loading...</div>;

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

  const groom = data.groom_name || 'Kevin';
  const bride = data.bride_name || 'Clara';
  const displayGuest = guestName || 'Our Respected Guest';
  
  const akadDateStr = data.akad_date || '2026-12-12T08:00:00';
  const resepsiDateStr = data.resepsi_date || '2026-12-12T11:00:00';
  const loveStory = data.story || "Two souls with but a single thought, two hearts that beat as one.";
  
  const coverImg = data.cover_image || "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop";
  const heroImg = data.hero_image || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2000&auto=format&fit=crop";
  const gallery1 = data.gallery_1 || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop";
  const gallery2 = data.gallery_2 || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop";
  const gallery3 = data.gallery_3 || "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800&auto=format&fit=crop";
  
  const bankName1 = data.bank_name_1 || "BCA";
  const bankAccount1 = data.bank_account_1 || "1234567890";
  const bankAccountName1 = data.bank_account_name_1 || groom;

  const { scrollYProgress } = useScroll();
  const opacityMain = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
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
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans tracking-tight overflow-x-hidden selection:bg-indigo-500/30">
        {isOpen && <AudioController src={data.music_url || "https://assets.mixkit.co/music/preview/mixkit-beautiful-dream-493.mp3"} />}
        
        {/* Cover Overlay */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div 
              exit={{ opacity: 0, y: '-100%' }}
              transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950"
            >
              <div className="absolute inset-0 bg-cover bg-center opacity-40 grayscale" style={{ backgroundImage: `url('${coverImg}')` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
              
              <div className="relative z-10 text-center max-w-lg px-6 w-full">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
                   <p className="text-indigo-400 font-mono text-xs uppercase tracking-widest mb-6">The Wedding Of</p>
                   <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8">{groom} & {bride}</h1>
                   <div className="w-12 h-px bg-indigo-500/50 mx-auto mb-8" />
                </motion.div>
                
                {guestName && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}>
                     <p className="text-slate-400 font-mono text-xs uppercase tracking-widest mb-2">{t.dear}</p>
                     <p className="text-xl font-light text-white mb-12">{displayGuest}</p>
                  </motion.div>
                )}
                
                <motion.button 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}
                  onClick={() => setIsOpen(true)}
                  className="px-8 py-4 bg-white text-slate-950 font-medium rounded-full uppercase tracking-widest text-xs hover:bg-indigo-500 hover:text-white transition-all duration-300 w-full md:w-auto"
                >
                  {t.open}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        {isOpen && (
          <div className="relative z-10">
             
            {/* Hero Section */}
            <motion.div style={{ opacity: opacityMain }} className="h-screen w-full flex flex-col justify-between p-8 md:p-16 relative">
              <motion.div style={{ y: yBg, backgroundImage: `url('${heroImg}')` }} className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay grayscale z-0" />
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-900/20 to-slate-950 pointer-events-none z-0" />
              
              <header className="flex justify-between items-center text-sm font-medium uppercase tracking-widest text-slate-500 z-10 w-full">
                <motion.span initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>{groom} & {bride}</motion.span>
                <motion.span initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}>Chapter I</motion.span>
              </header>

              <main className="max-w-4xl z-10">
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="text-6xl md:text-9xl font-bold tracking-tighter text-white mb-4 leading-none"
                >
                  We Are <br/>
                  Getting <br/>
                  Married.
                </motion.h1>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="mt-12 p-6 border-l-2 border-indigo-500 bg-white/5 backdrop-blur-md rounded-r-2xl max-w-sm"
                >
                  <p className="text-slate-400 font-mono uppercase tracking-widest text-xs mb-2">Exclusive Invitation For</p>
                  <p className="text-2xl font-light text-white">{displayGuest}</p>
                </motion.div>
              </main>
              
              <footer className="text-slate-500 font-mono flex justify-between items-end text-xs uppercase tracking-widest z-10 w-full">
                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1 }}>{format(parseISO(akadDateStr), 'yyyy / MM / dd')}</motion.div>
                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.2 }}>{data.location_name || 'Jakarta'}</motion.div>
              </footer>
            </motion.div>

            {/* Love Story */}
            <section className="py-32 px-8 bg-slate-900 relative overflow-hidden">
               <div className="absolute -left-32 top-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-600/10 rounded-full blur-[120px]" />
               <div className="max-w-4xl mx-auto text-center relative z-10">
                  <p className="text-indigo-400 font-mono text-xs uppercase tracking-widest mb-8">{t.story}</p>
                  <h2 className="text-3xl md:text-5xl font-light leading-snug text-white">"{loveStory}"</h2>
               </div>
            </section>

            {/* Profiles */}
            <section className="py-32 px-8 bg-slate-950 relative overflow-hidden">
               <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-indigo-900/10 to-transparent" />
               <div className="max-w-6xl mx-auto relative z-10">
                  <div className="grid md:grid-cols-2 gap-16 md:gap-32">
                     <motion.div 
                       initial={{ opacity: 0, x: -50 }}
                       whileInView={{ opacity: 1, x: 0 }}
                       viewport={{ once: true }}
                       transition={{ duration: 1 }}
                       className="group"
                     >
                        <div className="aspect-[4/5] w-full rounded-3xl overflow-hidden mb-8 relative">
                           <div className="absolute inset-0 bg-indigo-500/20 mix-blend-overlay group-hover:bg-transparent transition-colors duration-700 z-10" />
                           <img src={gallery1} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" alt={groom} />
                        </div>
                        <h3 className="text-4xl font-bold tracking-tight text-white mb-2">{groom}</h3>
                        <p className="text-slate-400 text-sm">{data.groom_parents || 'Putra dari Bpk. Hendra & Ibu Susi'}</p>
                     </motion.div>
                     
                     <motion.div 
                       initial={{ opacity: 0, x: 50 }}
                       whileInView={{ opacity: 1, x: 0 }}
                       viewport={{ once: true }}
                       transition={{ duration: 1, delay: 0.2 }}
                       className="group md:mt-32"
                     >
                        <div className="aspect-[4/5] w-full rounded-3xl overflow-hidden mb-8 relative">
                           <div className="absolute inset-0 bg-indigo-500/20 mix-blend-overlay group-hover:bg-transparent transition-colors duration-700 z-10" />
                           <img src={gallery2} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" alt={bride} />
                        </div>
                        <h3 className="text-4xl font-bold tracking-tight text-white mb-2">{bride}</h3>
                        <p className="text-slate-400 text-sm">{data.bride_parents || 'Putri dari Bpk. Budi & Ibu Ani'}</p>
                     </motion.div>
                  </div>
               </div>
            </section>

            {/* Countdown */}
            <section className="py-24 px-8 bg-slate-900 border-y border-slate-800">
               <div className="max-w-4xl mx-auto text-center">
                  <p className="text-indigo-400 font-mono text-xs uppercase tracking-widest mb-12">{t.countdown}</p>
                  <div className="grid grid-cols-4 gap-4 md:gap-8 max-w-3xl mx-auto">
                     {[
                       { label: "Days", value: timeLeft.days },
                       { label: "Hours", value: timeLeft.hours },
                       { label: "Mins", value: timeLeft.minutes },
                       { label: "Secs", value: timeLeft.seconds }
                     ].map((item, idx) => (
                       <div key={idx} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl shadow-indigo-900/5">
                          <div className="text-3xl md:text-6xl font-bold text-white mb-2 tracking-tighter">{item.value.toString().padStart(2, '0')}</div>
                          <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500">{item.label}</div>
                       </div>
                     ))}
                  </div>
               </div>
            </section>

            {/* Schedule */}
            <section className="py-32 px-8 bg-slate-950 relative">
               <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]" />
               
               <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
                 <motion.div 
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 1 }}
                   className="space-y-12"
                 >
                   <div className="p-8 md:p-12 border border-slate-800 rounded-3xl bg-slate-900/50 backdrop-blur-md relative group hover:border-indigo-500/50 transition-colors">
                     <div className="absolute -left-px top-10 w-1 h-12 bg-indigo-500 rounded-r-full" />
                     <h3 className="text-3xl font-bold text-white mb-6 tracking-tight">{t.matrimony}</h3>
                     <div className="space-y-4 text-slate-300 font-light">
                       <div className="flex items-center gap-4">
                         <Calendar className="w-5 h-5 text-indigo-400" />
                         <p>{format(parseISO(akadDateStr), 'dd MMMM yyyy', { locale: currentLocale })}</p>
                       </div>
                       <div className="flex items-center gap-4">
                         <Clock className="w-5 h-5 text-indigo-400" />
                         <p>{format(parseISO(akadDateStr), 'HH:mm')} WIB - Selesai</p>
                       </div>
                       <div className="flex items-center gap-4">
                         <MapPin className="w-5 h-5 text-indigo-400" />
                         <p>{data.location_name || 'Masjid Raya'}</p>
                       </div>
                     </div>
                   </div>
                   
                   <div className="p-8 md:p-12 border border-slate-800 rounded-3xl bg-slate-900/50 backdrop-blur-md relative group hover:border-indigo-500/50 transition-colors">
                     <div className="absolute -left-px top-10 w-1 h-12 bg-indigo-500 rounded-r-full" />
                     <h3 className="text-3xl font-bold text-white mb-6 tracking-tight">{t.reception}</h3>
                     <div className="space-y-4 text-slate-300 font-light">
                       <div className="flex items-center gap-4">
                         <Calendar className="w-5 h-5 text-indigo-400" />
                         <p>{format(parseISO(resepsiDateStr), 'dd MMMM yyyy', { locale: currentLocale })}</p>
                       </div>
                       <div className="flex items-center gap-4">
                         <Clock className="w-5 h-5 text-indigo-400" />
                         <p>{format(parseISO(resepsiDateStr), 'HH:mm')} WIB - Selesai</p>
                       </div>
                       <div className="flex items-center gap-4">
                         <MapPin className="w-5 h-5 text-indigo-400" />
                         <p>{data.location_name || 'Grand Ballroom Hotel'}</p>
                       </div>
                     </div>
                   </div>
                 </motion.div>
                 
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   viewport={{ once: true }}
                   transition={{ duration: 1.2 }}
                   className="h-full min-h-[500px] rounded-3xl overflow-hidden relative border border-slate-800"
                 >
                   <img src={mapImg} className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700" alt="Location Map" />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                   
                   <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
                      <p className="text-indigo-400 font-mono text-xs uppercase tracking-widest mb-4">Location Map</p>
                      <h4 className="text-2xl font-bold text-white mb-6">{data.location_name || 'Grand Ballroom Hotel'}</h4>
                      {data.maps_link && (
                         <a href={data.maps_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-white text-slate-950 px-6 py-3 rounded-full text-sm font-medium hover:bg-indigo-500 hover:text-white transition-colors">
                            Open in Google Maps <ArrowRight size={16} />
                         </a>
                      )}
                   </div>
                 </motion.div>
               </div>
            </section>

            {/* Gallery Grid */}
            <section className="py-24 px-8 bg-slate-900 border-t border-slate-800">
               <div className="max-w-6xl mx-auto">
                  <p className="text-indigo-400 font-mono text-xs uppercase tracking-widest mb-12 text-center">{t.gallery}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                     {[gallery1, gallery2, heroImg, gallery3].map((img, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          className={`rounded-2xl overflow-hidden border border-slate-800 relative group ${i === 2 ? 'col-span-2 row-span-2' : 'aspect-square'}`}
                        >
                           <div className="absolute inset-0 bg-indigo-500/20 mix-blend-overlay group-hover:bg-transparent transition-colors duration-700 z-10" />
                           <img src={img} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" alt="Gallery" />
                        </motion.div>
                     ))}
                  </div>
               </div>
            </section>

            {/* Gift */}
            <section className="py-32 px-8 bg-slate-950 text-center relative overflow-hidden">
               <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[150px] pointer-events-none" />
               <motion.div
                 initial={{ opacity: 0, y: 50 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 1 }}
                 className="max-w-2xl mx-auto relative z-10"
               >
                  <h2 className="text-4xl font-bold text-white mb-8 tracking-tight">{t.gift}</h2>
                  <p className="text-slate-400 mb-16 leading-relaxed">
                     Your blessing is our most precious gift. However, if you wish to honor us with a gift, a digital envelope is provided below.
                  </p>

                  <div className="p-10 border border-slate-800 rounded-[2.5rem] bg-slate-900/50 backdrop-blur-xl relative overflow-hidden text-left">
                     <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/20 rounded-bl-full blur-2xl" />
                     <p className="text-indigo-400 font-mono text-xs uppercase tracking-widest mb-6">Digital Envelope</p>
                     <h3 className="text-2xl font-bold text-white mb-2 uppercase">{bankName1}</h3>
                     <p className="text-4xl font-light text-white tracking-widest mb-4 font-mono">{bankAccount1}</p>
                     <p className="text-slate-400 mb-10">A.N. {bankAccountName1}</p>
                     <button 
                       onClick={() => {
                         navigator.clipboard.writeText(bankAccount1);
                         toast.success('Account number copied!', { style: { background: '#4F46E5', color: '#fff' } });
                       }}
                       className="w-full bg-indigo-600 text-white py-4 rounded-full font-medium hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-900/50"
                     >
                       Copy Account Number
                     </button>
                  </div>
               </motion.div>
            </section>

            {/* RSVP / Guestbook */}
            <section className="py-32 px-8 bg-slate-900 border-t border-slate-800">
               <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 md:gap-24">
                  <div>
                     <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">R.S.V.P</h2>
                     <p className="text-slate-400 text-sm mb-12">Please confirm your attendance below.</p>
                     
                     <form onSubmit={handleAddComment} className="space-y-8">
                        <div>
                           <label className="block text-indigo-400 font-mono text-[10px] uppercase tracking-widest mb-3">Guest Name</label>
                           <input 
                             type="text" 
                             value={newName}
                             onChange={e => setNewName(e.target.value)}
                             className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                             required 
                           />
                        </div>
                        <div>
                           <label className="block text-indigo-400 font-mono text-[10px] uppercase tracking-widest mb-3">Message</label>
                           <textarea 
                             value={newMessage}
                             onChange={e => setNewMessage(e.target.value)}
                             rows={4}
                             className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-indigo-500 transition-colors text-sm resize-none"
                             required 
                           />
                        </div>
                        <button type="submit" className="w-full bg-white text-slate-950 py-4 rounded-full font-bold hover:bg-slate-200 transition-colors shadow-lg shadow-white/5">
                           {t.sendReply}
                        </button>
                     </form>
                  </div>
                  
                  <div className="flex flex-col h-full">
                     <p className="text-indigo-400 font-mono text-xs uppercase tracking-widest mb-8">{t.guestbook}</p>
                     <div className="flex-1 space-y-4 max-h-[500px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                        {comments.map(comment => (
                           <div key={comment.id} className="p-6 bg-slate-950 border border-slate-800 rounded-2xl">
                              <p className="text-white font-bold text-sm mb-2">{comment.name}</p>
                              <p className="text-slate-400 text-sm leading-relaxed">{comment.message}</p>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </section>

            {/* Footer */}
            <footer className="py-20 text-center border-t border-slate-800 bg-slate-950">
               <p className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-500 mb-6">Five Invitation</p>
               <h3 className="text-2xl font-bold tracking-tight text-white mb-4">{groom} & {bride}</h3>
               <p className="text-xs font-mono text-slate-600 uppercase tracking-widest">© 2026 All rights reserved.</p>
            </footer>

          </div>
        )}
      </div>
    </SmoothScrollLayout>
  );
}
