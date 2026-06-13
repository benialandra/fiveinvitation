import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { id as localeId, enUS as localeEn } from 'date-fns/locale';
import SmoothScrollLayout from '../components/Interactive/SmoothScrollLayout';
import AudioController from '../components/Interactive/AudioController';
import { MapPin, Calendar, Clock } from 'lucide-react';

interface ThemeProps {
  data?: any;
  guestName?: string;
  lang?: 'en' | 'id';
}

export default function RusticVintage({ data, guestName, lang = 'id' }: ThemeProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [comments, setComments] = useState([
    { id: 1, name: 'Bude Marni', message: 'Selamat berbahagia anakku, semoga rukun selalu.' },
    { id: 2, name: 'Keluarga Pak RT', message: 'Turut berbahagia atas pernikahan kalian.' }
  ]);
  const [newName, setNewName] = useState('');
  const [newMessage, setNewMessage] = useState('');

  if (!data) return <div className="min-h-screen flex items-center justify-center bg-[#f8f5f0] text-[#5c4a3d]">Loading...</div>;

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

  const groom = data.groom_name || 'William';
  const bride = data.bride_name || 'Eleanor';
  const displayGuest = guestName || 'Tamu Undangan';
  
  const akadDateStr = data.akad_date || '2026-12-31T08:00:00';
  const resepsiDateStr = data.resepsi_date || '2026-12-31T11:00:00';
  const loveStory = data.story || "Cinta tidak berupa tatapan satu sama lain, tetapi memandang ke luar bersama ke arah yang sama.";
  
  const coverImg = data.cover_image || "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=60&w=2000&auto=format&fit=crop&fm=webp&q=60";
  const heroImg = data.hero_image || "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=60&w=2000&auto=format&fit=crop&fm=webp&q=60";
  const groomImg = data.groom_image || data.gallery_1 || "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=60&w=1000&auto=format&fit=crop&fm=webp&q=60";
  const brideImg = data.bride_image || data.gallery_2 || "https://images.unsplash.com/photo-1544078754-0a3791001a1c?q=60&w=1000&auto=format&fit=crop&fm=webp&q=60";
  const gallery1 = data.gallery_1 || "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=60&w=1000&auto=format&fit=crop&fm=webp&q=60";
  const gallery2 = data.gallery_2 || "https://images.unsplash.com/photo-1544078754-0a3791001a1c?q=60&w=1000&auto=format&fit=crop&fm=webp&q=60";
  const gallery3 = data.gallery_3 || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=60&w=1000&auto=format&fit=crop&fm=webp&q=60";
  const gallery4 = data.gallery_4 || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=60&w=1000&auto=format&fit=crop&fm=webp&q=60";
  
  const bankName1 = data.bank_name_1 || "Mandiri";
  const bankAccount1 = data.bank_account_1 || "1122334455";
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
      <div className="relative bg-[#f8f5f0] text-[#5c4a3d] font-serif overflow-x-hidden min-h-screen selection:bg-[#8b7355] selection:text-white border-8 border-[#f8f5f0]">
        
        {/* Border frame untuk seluruh halaman */}
        <div className="fixed inset-4 border border-[#8b7355] opacity-20 pointer-events-none z-40 hidden md:block" />
        <div className="fixed inset-6 border border-[#8b7355] opacity-10 pointer-events-none z-40 hidden md:block" />

        {isOpened && <AudioController src={data.music_url || "https://assets.mixkit.co/music/preview/mixkit-acoustic-guitar-wedding-145.mp3"} />}

        {/* Cover Screen */}
        <AnimatePresence>
          {!isOpened && (
            <motion.div 
              exit={{ y: '-100%' }}
              transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1] }}
              className="fixed inset-0 z-50 bg-[#f8f5f0] flex flex-col items-center justify-center p-6 text-center"
            >
              {/* Vintage Frame Border */}
              <div className="absolute inset-4 border border-[#8b7355] opacity-30 pointer-events-none" />
              <div className="absolute inset-6 border border-[#8b7355] opacity-10 pointer-events-none" />
              
              <div className="absolute inset-0 z-0">
                <img src={coverImg} className="w-full h-full object-cover sepia-[0.3] opacity-60" alt="Cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#f8f5f0] via-[#f8f5f0]/80 to-transparent" />
              </div>
              
              <div className="relative z-10 max-w-sm w-full bg-[#f8f5f0]/95 backdrop-blur-sm p-12 rounded-t-[50%] border-t-2 border-x-2 border-[#8b7355]/30 shadow-xl mt-32">
                <p className="text-xs tracking-[0.3em] uppercase text-[#8b7355] mb-6">Pernikahan</p>
                <h1 className="text-5xl font-normal mb-8 text-[#5c4a3d] italic">{groom} <br/><span className="text-2xl font-sans text-[#8b7355]">&</span><br/> {bride}</h1>
                
                <div className="w-16 h-px bg-[#8b7355]/40 mx-auto mb-8" />
                
                {guestName && (
                  <div className="mb-8">
                    <p className="text-xs text-[#8b7355]/70 uppercase tracking-widest mb-3">{t.dear}</p>
                    <p className="text-2xl font-medium text-[#5c4a3d] border-b border-[#8b7355]/30 inline-block pb-1 px-4">{displayGuest}</p>
                  </div>
                )}
                
                <button 
                  onClick={() => setIsOpened(true)}
                  className="px-8 py-3 bg-transparent border border-[#8b7355] text-[#8b7355] rounded-full uppercase tracking-widest text-xs font-semibold hover:bg-[#8b7355] hover:text-[#f8f5f0] transition-colors duration-500"
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
            
            {/* Hero */}
            <section className="relative min-h-screen flex flex-col items-center justify-center p-6 pt-32">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="max-w-4xl w-full mx-auto relative"
              >
                <div className="aspect-[3/4] md:aspect-video w-full relative p-4 border border-[#8b7355]/30 bg-white shadow-xl rotate-1">
                   <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#8b7355]/10 rounded-full blur-md" />
                   <img src={heroImg} className="w-full h-full object-cover sepia-[0.2]" alt="Hero" />
                </div>
                
                <div className="absolute -bottom-16 md:-bottom-24 left-1/2 -translate-x-1/2 w-[110%] md:w-3/4 bg-[#f8f5f0] p-8 md:p-12 text-center border-t border-[#8b7355]/20 shadow-2xl z-10">
                   <p className="text-[#8b7355] text-xs uppercase tracking-[0.4em] mb-4">We are getting married</p>
                   <h1 className="text-6xl md:text-8xl text-[#5c4a3d] italic mb-6">{groom} & {bride}</h1>
                   <div className="w-px h-16 bg-[#8b7355]/30 mx-auto" />
                </div>
              </motion.div>
            </section>

            {/* Love Story */}
            <section className="py-32 px-6 mt-16 md:mt-32">
               <div className="max-w-2xl mx-auto text-center">
                  <h3 className="text-xs uppercase tracking-[0.3em] text-[#8b7355] mb-8">{t.story}</h3>
                  <p className="text-3xl md:text-4xl italic text-[#5c4a3d] leading-relaxed">"{loveStory}"</p>
               </div>
            </section>

            {/* Profiles */}
            <section className="py-24 px-6 relative bg-white/50 border-y border-[#8b7355]/10">
               <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 md:gap-32">
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="text-center"
                  >
                     <div className="w-56 h-72 md:w-64 md:h-80 mx-auto bg-white p-3 border border-[#8b7355]/20 shadow-xl mb-8 -rotate-2 hover:rotate-0 transition-transform duration-500">
                        <img src={groomImg} className="w-full h-full object-cover sepia-[0.1]" alt={groom} />
                     </div>
                     <h3 className="text-4xl italic text-[#5c4a3d] mb-4">{groom}</h3>
                     <p className="text-sm font-sans tracking-widest text-[#8b7355] uppercase mb-1">Putra Dari</p>
                     <p className="text-lg text-[#5c4a3d] font-bold">{data.groom_parents || 'Bpk. Hendra & Ibu Susi'}</p>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="text-center md:mt-24"
                  >
                     <div className="w-56 h-72 md:w-64 md:h-80 mx-auto bg-white p-3 border border-[#8b7355]/20 shadow-xl mb-8 rotate-2 hover:rotate-0 transition-transform duration-500">
                        <img src={brideImg} className="w-full h-full object-cover sepia-[0.1]" alt={bride} />
                     </div>
                     <h3 className="text-4xl italic text-[#5c4a3d] mb-4">{bride}</h3>
                     <p className="text-sm font-sans tracking-widest text-[#8b7355] uppercase mb-1">Putri Dari</p>
                     <p className="text-lg text-[#5c4a3d] font-bold">{data.bride_parents || 'Bpk. Budi & Ibu Ani'}</p>
                  </motion.div>
               </div>
            </section>

            {/* Countdown */}
            <section className="py-24 px-6 text-center">
               <h3 className="text-xs uppercase tracking-[0.3em] text-[#8b7355] mb-12">{t.countdown}</h3>
               <div className="max-w-2xl mx-auto grid grid-cols-4 gap-4 md:gap-8">
                  {[
                    { label: "Hari", value: timeLeft.days },
                    { label: "Jam", value: timeLeft.hours },
                    { label: "Menit", value: timeLeft.minutes },
                    { label: "Detik", value: timeLeft.seconds }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white p-6 border border-[#8b7355]/20 shadow-md">
                       <div className="text-4xl md:text-5xl font-light text-[#5c4a3d] mb-2">{item.value.toString().padStart(2, '0')}</div>
                       <div className="text-[10px] uppercase font-sans tracking-widest text-[#8b7355]">{item.label}</div>
                    </div>
                  ))}
               </div>
            </section>

            {/* Schedule */}
            <section className="py-32 px-6 bg-[#f0ebe1] border-y border-[#8b7355]/20">
               <div className="max-w-5xl mx-auto">
                  <div className="text-center mb-16">
                     <h2 className="text-4xl md:text-5xl italic text-[#5c4a3d] mb-4">Rangkaian Acara</h2>
                     <div className="w-16 h-px bg-[#8b7355]/40 mx-auto" />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-12 md:gap-24">
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                      className="bg-white p-10 shadow-xl border border-[#8b7355]/10 text-center relative"
                    >
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#f0ebe1] px-4 py-1 text-[#8b7355] border border-[#8b7355]/30 font-sans text-xs uppercase tracking-widest">
                         Bagian Pertama
                      </div>
                      <h3 className="text-3xl italic text-[#5c4a3d] mb-8 mt-4">{t.matrimony}</h3>
                      <div className="mb-8">
                         <p className="text-4xl font-light text-[#8b7355] mb-2">{format(parseISO(akadDateStr), 'dd')}</p>
                         <p className="text-xl uppercase tracking-widest text-[#5c4a3d] mb-1">{format(parseISO(akadDateStr), 'MMMM yyyy', { locale: currentLocale })}</p>
                         <p className="text-[#8b7355] font-sans">{format(parseISO(akadDateStr), 'EEEE', { locale: currentLocale })}</p>
                      </div>
                      <div className="space-y-4 text-[#5c4a3d] font-sans mb-8">
                         <p className="flex items-center justify-center gap-2"><Clock size={16} className="text-[#8b7355]"/> {format(parseISO(akadDateStr), 'HH:mm')} WIB - Selesai</p>
                         <p className="flex items-center justify-center gap-2"><MapPin size={16} className="text-[#8b7355]"/> {data.location_name || 'Masjid Raya'}</p>
                      </div>
                      {data.maps_link && (
                         <a href={data.maps_link} target="_blank" rel="noreferrer" className="inline-block border-b border-[#8b7355] pb-1 text-xs uppercase font-sans tracking-widest text-[#8b7355] hover:text-[#5c4a3d] transition-colors">Lihat Lokasi Maps</a>
                      )}
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="bg-white p-10 shadow-xl border border-[#8b7355]/10 text-center relative"
                    >
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#f0ebe1] px-4 py-1 text-[#8b7355] border border-[#8b7355]/30 font-sans text-xs uppercase tracking-widest">
                         Bagian Kedua
                      </div>
                      <h3 className="text-3xl italic text-[#5c4a3d] mb-8 mt-4">{t.reception}</h3>
                      <div className="mb-8">
                         <p className="text-4xl font-light text-[#8b7355] mb-2">{format(parseISO(resepsiDateStr), 'dd')}</p>
                         <p className="text-xl uppercase tracking-widest text-[#5c4a3d] mb-1">{format(parseISO(resepsiDateStr), 'MMMM yyyy', { locale: currentLocale })}</p>
                         <p className="text-[#8b7355] font-sans">{format(parseISO(resepsiDateStr), 'EEEE', { locale: currentLocale })}</p>
                      </div>
                      <div className="space-y-4 text-[#5c4a3d] font-sans mb-8">
                         <p className="flex items-center justify-center gap-2"><Clock size={16} className="text-[#8b7355]"/> {format(parseISO(resepsiDateStr), 'HH:mm')} WIB - Selesai</p>
                         <p className="flex items-center justify-center gap-2"><MapPin size={16} className="text-[#8b7355]"/> {data.location_name || 'Grand Ballroom Hotel'}</p>
                      </div>
                      {data.maps_link && (
                         <a href={data.maps_link} target="_blank" rel="noreferrer" className="inline-block border-b border-[#8b7355] pb-1 text-xs uppercase font-sans tracking-widest text-[#8b7355] hover:text-[#5c4a3d] transition-colors">Lihat Lokasi Maps</a>
                      )}
                    </motion.div>
                  </div>
               </div>
            </section>

            {/* Gallery */}
            <section className="py-24 px-6 max-w-6xl mx-auto text-center">
               <h3 className="text-xs uppercase tracking-[0.3em] text-[#8b7355] mb-12">{t.gallery}</h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[gallery1, gallery2, gallery3, gallery4].map((img, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className="bg-white p-2 md:p-4 shadow-xl border border-[#8b7355]/20 rotate-[-1deg] hover:rotate-1 transition-transform"
                    >
                       <div className="aspect-square w-full">
                          <img src={img} className="w-full h-full object-cover sepia-[0.2] hover:sepia-0 transition-all duration-700" alt="Gallery" />
                       </div>
                    </motion.div>
                  ))}
               </div>
            </section>

            {/* Gift */}
            <section className="py-32 px-6 bg-white/60 border-t border-[#8b7355]/10 text-center">
               <div className="max-w-2xl mx-auto">
                  <h3 className="text-3xl italic text-[#5c4a3d] mb-6">{t.gift}</h3>
                  <p className="text-[#8b7355] font-sans mb-12 text-sm leading-relaxed">
                     Tanpa mengurangi rasa hormat, bagi Bapak/Ibu/Saudara/i yang ingin memberikan tanda kasih untuk kami, dapat melalui:
                  </p>

                  <div className="bg-[#f0ebe1] p-10 border border-[#8b7355]/30 shadow-lg relative max-w-md mx-auto">
                     <div className="absolute top-4 left-4 w-4 h-4 rounded-full border border-[#8b7355]/40" />
                     <div className="absolute top-4 right-4 w-4 h-4 rounded-full border border-[#8b7355]/40" />
                     <div className="absolute bottom-4 left-4 w-4 h-4 rounded-full border border-[#8b7355]/40" />
                     <div className="absolute bottom-4 right-4 w-4 h-4 rounded-full border border-[#8b7355]/40" />
                     
                     <h4 className="text-2xl font-bold font-sans text-[#5c4a3d] mb-2 uppercase">{bankName1}</h4>
                     <p className="text-4xl font-light text-[#8b7355] mb-4 font-mono tracking-widest">{bankAccount1}</p>
                     <p className="text-[#5c4a3d] font-sans font-bold uppercase tracking-widest text-sm mb-8">A.N. {bankAccountName1}</p>
                     
                     <button 
                       onClick={() => {
                         navigator.clipboard.writeText(bankAccount1);
                         toast.success('Nomor rekening disalin!', { style: { background: '#5c4a3d', color: '#f8f5f0' }});
                       }}
                       className="bg-[#5c4a3d] text-[#f8f5f0] w-full py-4 uppercase font-sans tracking-widest text-xs hover:bg-[#8b7355] transition-colors"
                     >
                       Salin Rekening
                     </button>
                  </div>
               </div>
            </section>

            {/* RSVP */}
            <section className="py-32 px-6 max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
               <div>
                  <h3 className="text-3xl italic text-[#5c4a3d] mb-4">R.S.V.P</h3>
                  <p className="text-[#8b7355] font-sans text-sm mb-8">Kehadiran Anda adalah kehormatan bagi kami.</p>
                  
                  <form onSubmit={handleAddComment} className="space-y-6">
                     <div>
                        <input 
                          type="text" 
                          placeholder="Nama Lengkap"
                          value={newName}
                          onChange={e => setNewName(e.target.value)}
                          className="w-full bg-transparent border-b border-[#8b7355]/40 px-0 py-3 text-[#5c4a3d] font-sans focus:outline-none focus:border-[#5c4a3d] transition-colors placeholder:text-[#8b7355]/60"
                          required 
                        />
                     </div>
                     <div>
                        <textarea 
                          placeholder="Tulis Pesan & Doa"
                          value={newMessage}
                          onChange={e => setNewMessage(e.target.value)}
                          rows={4}
                          className="w-full bg-transparent border-b border-[#8b7355]/40 px-0 py-3 text-[#5c4a3d] font-sans focus:outline-none focus:border-[#5c4a3d] transition-colors placeholder:text-[#8b7355]/60 resize-none"
                          required 
                        />
                     </div>
                     <button type="submit" className="w-full bg-transparent border-2 border-[#5c4a3d] text-[#5c4a3d] py-4 uppercase font-sans tracking-widest text-xs font-bold hover:bg-[#5c4a3d] hover:text-[#f8f5f0] transition-colors mt-4">
                        {t.sendReply}
                     </button>
                  </form>
               </div>

               <div>
                  <h3 className="text-xs uppercase tracking-[0.3em] text-[#8b7355] mb-8">{t.guestbook}</h3>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-[#8b7355]/30 font-sans">
                     {comments.map(comment => (
                        <div key={comment.id} className="bg-white p-6 border border-[#8b7355]/20 shadow-sm relative">
                           <div className="absolute top-0 left-0 w-1 h-full bg-[#8b7355]/30" />
                           <p className="font-bold text-[#5c4a3d] text-sm uppercase tracking-widest mb-2">{comment.name}</p>
                           <p className="text-[#8b7355] text-sm leading-relaxed">{comment.message}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </section>

            {/* Footer */}
            <footer className="py-16 text-center border-t border-[#8b7355]/20">
               <div className="w-8 h-8 mx-auto border border-[#8b7355] rounded-full flex items-center justify-center mb-6">
                  <span className="text-xs text-[#8b7355] font-sans">&</span>
               </div>
               <h3 className="text-2xl italic text-[#5c4a3d] mb-2">{groom} & {bride}</h3>
               <p className="text-[10px] font-sans uppercase tracking-[0.3em] text-[#8b7355]">Five Invitation © 2026</p>
            </footer>

          </div>
        )}
      </div>
    </SmoothScrollLayout>
  );
}
