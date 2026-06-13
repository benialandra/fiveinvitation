import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { id as localeId, enUS as localeEn } from 'date-fns/locale';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SmoothScrollLayout from '../components/Interactive/SmoothScrollLayout';
import AudioController from '../components/Interactive/AudioController';
import { Calendar, Clock, MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ThemeProps {
  data?: any;
  guestName?: string;
  lang?: 'en' | 'id';
}

export default function ScandinavianMinimalist({ data, guestName, lang = 'id' }: ThemeProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  const [comments, setComments] = useState([
    { id: 1, name: 'Tante Rina', message: 'Selamat menempuh hidup baru.' },
    { id: 2, name: 'Anton', message: 'Semoga menjadi keluarga yang bahagia selamanya!' }
  ]);
  const [newName, setNewName] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  if (!data) return <div className="min-h-screen flex items-center justify-center bg-[#F9F9F7]">Loading...</div>;

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

  const groom = data.groom_name || 'Daniel';
  const bride = data.bride_name || 'Sophia';
  const akadDateStr = data.akad_date || '2026-10-24T10:00:00';
  const resepsiDateStr = data.resepsi_date || '2026-10-24T18:00:00';
  
  const coverImage = data.cover_image || "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=60&fm=webp&q=60";
  const heroImage = data.hero_image || "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=60&fm=webp&q=60";
  const groomImg = data.groom_image || data.gallery_1 || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=60&fm=webp&q=60";
  const brideImg = data.bride_image || data.gallery_2 || "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=60&fm=webp&q=60";
  const gallery1 = data.gallery_1 || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=60&fm=webp&q=60";
  const gallery2 = data.gallery_2 || "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=60&fm=webp&q=60";
  const gallery3 = data.gallery_3 || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=60&fm=webp&q=60";
  const gallery4 = data.gallery_4 || "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=60&fm=webp&q=60";
  const story = data.story || "In the simplicity of everyday life, we found an extraordinary love. A love built on quiet mornings, shared silence, and a deep understanding.";

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

  useEffect(() => {
    if (!isOpened) return;

    // Simple Fade & Elegant Scroll Reveal
    const elements = gsap.utils.toArray('.scandi-reveal');
    elements.forEach((el: any) => {
      gsap.fromTo(el, 
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          }
        }
      );
    });

    // Parallax on Grid Images
    const images = gsap.utils.toArray('.scandi-parallax');
    images.forEach((img: any) => {
      gsap.to(img, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: img.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });
  }, [isOpened]);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.bank_account_1 || "0987654321");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

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
      <div className="bg-[#F9F9F7] min-h-screen text-[#2D2D2D] font-sans selection:bg-[#E5E0D8] selection:text-black overflow-x-hidden">
        
        {isOpened && (
          <AudioController src={data.music_url || "https://assets.mixkit.co/music/preview/mixkit-relaxing-light-piano-music-421.mp3"} />
        )}

        {/* Minimalist Opening Screen */}
        <AnimatePresence>
          {!isOpened && (
            <motion.div 
              exit={{ opacity: 0, y: '-100%' }}
              transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-[#F9F9F7]"
            >
              <div className="relative z-10 text-center flex flex-col items-center w-full max-w-md">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="w-full aspect-[3/4] mb-12 overflow-hidden bg-[#EAE8E3] rounded-t-[10rem]"
                >
                  <img src={coverImage} alt="Cover" className="w-full h-full object-cover opacity-90" />
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="text-4xl md:text-5xl font-light tracking-tight mb-8 text-[#1A1A1A]"
                  style={{ fontFamily: '"Inter", sans-serif' }}
                >
                  {groom} & {bride}
                </motion.h1>
                
                {guestName && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="mb-12 border-t border-b border-[#D1CEC5] py-4"
                  >
                    <p className="text-xs tracking-[0.2em] uppercase text-[#7A7A7A] mb-2">{t.dear}</p>
                    <p className="text-xl font-medium text-[#1A1A1A]">{guestName}</p>
                  </motion.div>
                )}
                
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 1 }}
                  onClick={() => setIsOpened(true)}
                  className="group relative px-8 py-3 overflow-hidden text-xs uppercase tracking-widest font-medium border border-[#D1CEC5] hover:border-[#1A1A1A] transition-colors duration-500 text-[#1A1A1A] rounded-full"
                >
                  <span className="relative z-10">{t.open}</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        {isOpened && (
          <div className="relative z-10 pb-32">
            
            {/* Hero Section */}
            <section className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                className="max-w-3xl mx-auto w-full pt-20"
              >
                <p className="text-[#8B8881] text-xs uppercase tracking-[0.3em] mb-8 font-medium">The Wedding Celebration</p>
                
                <h1 className="text-6xl md:text-8xl font-light tracking-tighter text-[#1A1A1A] mb-6 leading-none">
                  {groom} <br/> <span className="text-[#A39E93] font-serif italic text-5xl md:text-7xl">&</span> <br/> {bride}
                </h1>
                
                <div className="mt-20 w-[1px] h-24 bg-[#D1CEC5] mx-auto origin-top" />
              </motion.div>
            </section>

            {/* Profiles */}
            <section className="py-24 px-6 scandi-reveal">
               <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16 justify-center">
                  <div className="flex flex-col items-center text-center">
                      <div className="w-48 h-64 md:w-64 md:h-80 rounded-t-[10rem] overflow-hidden bg-[#EAE8E3] mb-8">
                         <img src={groomImg} className="w-full h-full object-cover" alt={groom} />
                      </div>
                      <h3 className="text-3xl font-light mb-2">{groom}</h3>
                      <p className="text-[#8B8881] text-xs uppercase tracking-widest">Putra dari<br/><span className="text-[#1A1A1A] font-medium">{data.groom_parents || 'Bpk. Hendra & Ibu Susi'}</span></p>
                   </div>
                   <div className="flex flex-col items-center text-center">
                      <div className="w-48 h-64 md:w-64 md:h-80 rounded-t-[10rem] overflow-hidden bg-[#EAE8E3] mb-8">
                         <img src={brideImg} className="w-full h-full object-cover" alt={bride} />
                      </div>
                     <h3 className="text-3xl font-light mb-2">{bride}</h3>
                     <p className="text-[#8B8881] text-xs uppercase tracking-widest">Putri dari<br/><span className="text-[#1A1A1A] font-medium">{data.bride_parents || 'Bpk. Budi & Ibu Ani'}</span></p>
                  </div>
               </div>
            </section>

            {/* Quote / Introduction */}
            <section className="py-24 px-6 scandi-reveal bg-[#F0EFEB]">
              <div className="max-w-2xl mx-auto text-center">
                <p className="text-[#8B8881] text-xs uppercase tracking-[0.3em] mb-12">{t.story}</p>
                <p className="text-xl md:text-3xl font-light text-[#4A4A4A] leading-relaxed tracking-tight">
                  "{story}"
                </p>
              </div>
            </section>

            {/* Countdown */}
            <section className="py-24 px-6 scandi-reveal">
               <div className="max-w-3xl mx-auto text-center">
                  <p className="text-[#8B8881] text-xs uppercase tracking-[0.3em] mb-12">{t.countdown}</p>
                  <div className="grid grid-cols-4 gap-4 md:gap-8 bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-[#EAE8E3]">
                     {[
                       { label: "Days", value: timeLeft.days },
                       { label: "Hours", value: timeLeft.hours },
                       { label: "Mins", value: timeLeft.minutes },
                       { label: "Secs", value: timeLeft.seconds }
                     ].map((item, idx) => (
                       <div key={idx} className="flex flex-col items-center justify-center">
                          <div className="text-3xl md:text-5xl font-light text-[#1A1A1A] mb-2">{item.value}</div>
                          <div className="text-[10px] md:text-xs uppercase tracking-widest text-[#8B8881]">{item.label}</div>
                       </div>
                     ))}
                  </div>
               </div>
            </section>

            {/* Gallery Grid - Clean 4 Photos */}
            <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto scandi-reveal">
              <p className="text-[#8B8881] text-xs uppercase tracking-[0.3em] mb-12 text-center">{t.gallery}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                {[gallery1, gallery2, gallery3, gallery4].map((img, i) => (
                  <div key={i} className={`overflow-hidden bg-[#EAE8E3] rounded-[2rem] ${i === 0 || i === 3 ? 'aspect-[4/5]' : 'aspect-square'} relative group`}>
                    <div className="w-full h-[130%] -top-[15%] absolute">
                      <img src={img} alt="Gallery" className="w-full h-full object-cover scandi-parallax opacity-90 transition-opacity duration-700 group-hover:opacity-100" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Event Details */}
            <section className="py-32 px-6 bg-white scandi-reveal rounded-t-[4rem] rounded-b-[4rem]">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-light tracking-tight text-center mb-24">The Details</h2>
                
                <div className="grid md:grid-cols-2 gap-16 md:gap-24">
                  <div className="flex flex-col text-center md:text-left">
                    <p className="text-[#8B8881] text-xs uppercase tracking-[0.2em] mb-6">{t.matrimony}</p>
                    <h3 className="text-4xl font-light text-[#1A1A1A] mb-2">{format(parseISO(akadDateStr), 'dd')}</h3>
                    <h4 className="text-xl font-light text-[#1A1A1A] mb-8">{format(parseISO(akadDateStr), 'MMMM yyyy', { locale: currentLocale })}</h4>
                    <div className="space-y-4 text-[#4A4A4A] font-light">
                      <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4">
                        <Clock size={18} className="text-[#A39E93] shrink-0" />
                        <p>{format(parseISO(akadDateStr), 'HH:mm')} WIB</p>
                      </div>
                      <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4">
                        <MapPin size={18} className="text-[#A39E93] shrink-0" />
                        <p>{data.location_name || 'The Glasshouse'}</p>
                      </div>
                      {data.maps_link && (
                         <a href={data.maps_link} target="_blank" rel="noreferrer" className="inline-block mt-4 border-b border-[#D1CEC5] pb-1 text-xs uppercase tracking-widest text-[#1A1A1A] hover:text-[#8B8881] transition-colors">Open Maps</a>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col text-center md:text-left">
                    <p className="text-[#8B8881] text-xs uppercase tracking-[0.2em] mb-6">{t.reception}</p>
                    <h3 className="text-4xl font-light text-[#1A1A1A] mb-2">{format(parseISO(resepsiDateStr), 'dd')}</h3>
                    <h4 className="text-xl font-light text-[#1A1A1A] mb-8">{format(parseISO(resepsiDateStr), 'MMMM yyyy', { locale: currentLocale })}</h4>
                    <div className="space-y-4 text-[#4A4A4A] font-light">
                      <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4">
                        <Clock size={18} className="text-[#A39E93] shrink-0" />
                        <p>{format(parseISO(resepsiDateStr), 'HH:mm')} WIB</p>
                      </div>
                      <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4">
                        <MapPin size={18} className="text-[#A39E93] shrink-0" />
                        <p>{data.location_name || 'The Glasshouse'}</p>
                      </div>
                      {data.maps_link && (
                         <a href={data.maps_link} target="_blank" rel="noreferrer" className="inline-block mt-4 border-b border-[#D1CEC5] pb-1 text-xs uppercase tracking-widest text-[#1A1A1A] hover:text-[#8B8881] transition-colors">Open Maps</a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Gift */}
            <section className="py-24 px-6 scandi-reveal text-center">
               <div className="max-w-2xl mx-auto">
                  <p className="text-[#8B8881] text-xs uppercase tracking-[0.3em] mb-8">{t.gift}</p>
                  <p className="text-[#4A4A4A] font-light mb-12 leading-relaxed">Your presence is the greatest gift of all. However, should you wish to help us celebrate with a gift, a wishing well will be provided on the day.</p>
                  
                  <div className="bg-white border border-[#EAE8E3] rounded-[2rem] p-10 max-w-md mx-auto shadow-sm">
                     <p className="text-lg font-medium text-[#1A1A1A] mb-2 uppercase tracking-widest">{data.bank_name_1 || "BCA"}</p>
                     <p className="text-2xl font-light text-[#1A1A1A] tracking-widest mb-4 font-mono">{data.bank_account_1 || "0987654321"}</p>
                     <p className="text-sm text-[#8B8881] uppercase tracking-widest mb-8">A.N {data.bank_account_name_1 || groom}</p>
                     <button 
                       onClick={handleCopy}
                       className="w-full bg-[#EAE8E3] text-[#1A1A1A] py-4 rounded-full uppercase tracking-[0.2em] text-xs font-medium hover:bg-[#D1CEC5] transition-colors duration-300"
                     >
                       {isCopied ? 'Copied!' : 'Copy Account Number'}
                     </button>
                  </div>
               </div>
            </section>

            {/* RSVP & Guestbook */}
            <section className="py-32 px-6 scandi-reveal bg-[#EAE8E3]/30 rounded-t-[4rem]">
              <div className="max-w-xl mx-auto mb-20">
                <h2 className="text-3xl font-light tracking-tight text-center mb-8">R.S.V.P</h2>
                <p className="text-center text-[#7A7A7A] mb-12 text-sm">Please let us know your presence.</p>
                
                <form onSubmit={handleAddComment} className="space-y-8 bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-[#EAE8E3]">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#4A4A4A] mb-2">Guest Name</label>
                    <input 
                      type="text" 
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      className="w-full bg-transparent border-b border-[#D1CEC5] px-0 py-3 focus:outline-none focus:border-[#1A1A1A] transition-colors text-sm" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#4A4A4A] mb-2">Message</label>
                    <textarea 
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      rows={3}
                      className="w-full bg-transparent border-b border-[#D1CEC5] px-0 py-3 focus:outline-none focus:border-[#1A1A1A] transition-colors text-sm resize-none" 
                      required
                    />
                  </div>
                  <button type="submit" className="w-full bg-[#1A1A1A] text-white py-4 rounded-full uppercase tracking-[0.2em] text-xs font-medium hover:bg-[#333] transition-colors duration-300 mt-8">
                    {t.sendReply}
                  </button>
                </form>
              </div>

              {/* Comments List */}
              <div className="max-w-xl mx-auto space-y-6 max-h-[400px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-[#D1CEC5]">
                <h3 className="text-center text-xs uppercase tracking-[0.3em] text-[#8B8881] mb-8">{t.guestbook}</h3>
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-white border border-[#EAE8E3] rounded-[1.5rem] p-6 shadow-sm">
                    <p className="font-medium text-[#1A1A1A] text-sm uppercase tracking-widest mb-2">{comment.name}</p>
                    <p className="text-[#4A4A4A] font-light text-sm leading-relaxed">{comment.message}</p>
                  </div>
                ))}
              </div>
            </section>
            
            {/* Footer */}
            <footer className="pt-24 pb-12 text-center text-[#A39E93] text-xs uppercase tracking-[0.3em] scandi-reveal">
              <p>Looking forward to celebrating with you.</p>
              <p className="mt-4 text-[#1A1A1A] font-serif italic text-lg">{groom} & {bride}</p>
            </footer>
          </div>
        )}
      </div>
    </SmoothScrollLayout>
  );
}
