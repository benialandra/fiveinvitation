import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { id as localeId, enUS as localeEn } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SmoothScrollLayout from '../../components/Interactive/SmoothScrollLayout';
import AudioController from '../../components/Interactive/AudioController';
import { MapPin, Calendar, Clock } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const SakuraBackground = (props: any) => {
  const ref = useRef<any>(null);
  const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }));

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 20;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial transparent color="#FFB7C5" size={0.008} sizeAttenuation={true} depthWrite={false} />
      </Points>
    </group>
  );
};

interface ThemeProps {
  data?: any;
  guestName?: string;
  lang?: 'en' | 'id';
}

export default function JapaneseSakuraGarden({ data, guestName, lang = 'id' }: ThemeProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  const [comments, setComments] = useState([
    { id: 1, name: 'Satoshi', message: 'Congratulations on your wedding!' },
    { id: 2, name: 'Aiko', message: 'Wishing you a lifetime of love and happiness.' }
  ]);
  const [newName, setNewName] = useState('');
  const [newMessage, setNewMessage] = useState('');

  if (!data) return <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] text-[#FFB7C5]">Loading...</div>;

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

  const groom = data.groom_name || 'Kenji';
  const bride = data.bride_name || 'Sakura';
  const displayGuest = guestName || 'Tamu Kehormatan';
  
  const akadDateStr = data.akad_date || '2026-11-12T08:00:00';
  const resepsiDateStr = data.resepsi_date || '2026-11-12T11:00:00';
  const loveStory = data.story || "Like cherry blossoms in spring, our love blossomed beautifully and naturally at the perfect time.";
  
  const coverImg = data.cover_image || "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=60&w=2000&auto=format&fit=crop&fm=webp&q=60";
  const heroImg = data.hero_image || "https://images.unsplash.com/photo-1522383225653-ed111181a951?q=60&w=2000&auto=format&fit=crop&fm=webp&q=60";
  const groomImg = data.groom_image || data.gallery_1 || "https://images.unsplash.com/photo-1542051812871-75f56cc9ee33?q=60&w=1000&auto=format&fit=crop&fm=webp&q=60";
  const brideImg = data.bride_image || data.gallery_2 || "https://images.unsplash.com/photo-1508004526072-3be43a5005f6?q=60&w=1000&auto=format&fit=crop&fm=webp&q=60";
  const gallery1 = data.gallery_1 || "https://images.unsplash.com/photo-1542051812871-75f56cc9ee33?q=60&w=1000&auto=format&fit=crop&fm=webp&q=60";
  const gallery2 = data.gallery_2 || "https://images.unsplash.com/photo-1508004526072-3be43a5005f6?q=60&w=1000&auto=format&fit=crop&fm=webp&q=60";
  const gallery3 = data.gallery_3 || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=60&w=1000&auto=format&fit=crop&fm=webp&q=60";
  const gallery4 = data.gallery_4 || "https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=1000&auto=format&fit=crop&fm=webp&q=60";
  
  const bankName1 = data.bank_name_1 || "BCA";
  const bankAccount1 = data.bank_account_1 || "1234567890";
  const bankAccountName1 = data.bank_account_name_1 || groom;

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  useEffect(() => {
    if (!isOpened) return;

    const sections = gsap.utils.toArray('.gsap-section');
    sections.forEach((sec: any) => {
      gsap.fromTo(sec, 
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sec,
            start: 'top 85%',
          }
        }
      );
    });
  }, [isOpened]);

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
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-[#FFB7C5] pointer-events-none z-[999] mix-blend-difference hidden md:block"
        animate={{
          x: cursorPos.x - 16,
          y: cursorPos.y - 16,
          scale: isHovering ? 2 : 1,
          backgroundColor: isHovering ? 'rgba(255, 183, 197, 0.2)' : 'transparent'
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 28, mass: 0.5 }}
      />

      <div className="bg-[#FAF7F2] min-h-screen text-[#4A4A4A] overflow-hidden font-sans relative selection:bg-[#FFB7C5] selection:text-white">
        
        {/* 3D Background */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-60">
          <Canvas camera={{ position: [0, 0, 1] }}>
            <SakuraBackground />
          </Canvas>
        </div>

        {isOpened && <AudioController src={data.music_url || "https://assets.mixkit.co/music/preview/mixkit-relaxing-light-piano-music-421.mp3"} />}

        {/* Cover Screen */}
        <AnimatePresence>
          {!isOpened && (
            <motion.div 
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-[#FAF7F2]"
            >
              <div className="absolute inset-0 z-0 opacity-40">
                <img src={coverImg} className="w-full h-full object-cover grayscale-[0.3]" alt="Cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] via-transparent to-[#FAF7F2]" />
              </div>
              
              <div className="relative z-10 text-center max-w-lg w-full bg-white/60 p-12 backdrop-blur-md rounded-[2rem] border border-[#FFB7C5]/30 shadow-2xl">
                <p className="text-xs tracking-[0.3em] uppercase text-[#FFB7C5] mb-4">Pernikahan</p>
                <h1 className="text-5xl md:text-6xl font-light mb-8 text-[#4A4A4A]" style={{ fontFamily: '"Noto Serif JP", serif' }}>
                  {groom} & {bride}
                </h1>
                
                {guestName && (
                  <div className="mb-8 border-y border-[#FFB7C5]/30 py-4">
                    <p className="text-[10px] uppercase tracking-widest text-[#8B8881] mb-2">{t.dear}</p>
                    <p className="text-xl font-medium text-[#4A4A4A]">{displayGuest}</p>
                  </div>
                )}
                
                <button
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  onClick={() => setIsOpened(true)}
                  className="px-8 py-3 rounded-full border border-[#FFB7C5] text-[#FFB7C5] hover:bg-[#FFB7C5] hover:text-white transition-all duration-500 uppercase tracking-widest text-xs font-bold"
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
            <section className="min-h-screen flex flex-col items-center justify-center p-6 text-center pt-24">
              <div className="w-48 h-64 md:w-64 md:h-80 mx-auto rounded-t-full overflow-hidden mb-12 shadow-2xl border-4 border-white">
                 <img src={heroImg} className="w-full h-full object-cover" alt="Hero" />
              </div>
              <p className="text-[#FFB7C5] text-xs uppercase tracking-[0.4em] mb-4">We are getting married</p>
              <h1 className="text-6xl md:text-8xl font-light text-[#4A4A4A] mb-8" style={{ fontFamily: '"Noto Serif JP", serif' }}>
                {groom} <span className="text-[#FFB7C5]">&</span> {bride}
              </h1>
            </section>

            {/* Love Story */}
            <section className="py-24 px-6 gsap-section">
               <div className="max-w-2xl mx-auto text-center bg-white/60 backdrop-blur-sm p-12 rounded-[2rem] border border-[#FFB7C5]/30 shadow-lg relative">
                 <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#FFB7C5]/20 rounded-full blur-md" />
                 <h3 className="text-xs uppercase tracking-[0.3em] text-[#FFB7C5] mb-8">{t.story}</h3>
                 <p className="text-2xl md:text-3xl font-light text-[#4A4A4A] leading-relaxed" style={{ fontFamily: '"Noto Serif JP", serif' }}>"{loveStory}"</p>
               </div>
            </section>

            {/* Profiles */}
            <section className="py-24 px-6 gsap-section">
               <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 md:gap-32">
                  <div className="text-center">
                     <div className="w-56 h-56 mx-auto rounded-full overflow-hidden border-8 border-white shadow-xl mb-6 bg-[#FFB7C5]/10">
                        <img loading="lazy" src={groomImg} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" alt={groom} />
                     </div>
                     <h3 className="text-3xl font-light text-[#4A4A4A] mb-2" style={{ fontFamily: '"Noto Serif JP", serif' }}>{groom}</h3>
                     <p className="text-[10px] font-bold tracking-widest text-[#FFB7C5] uppercase mb-1">Putra Dari</p>
                     <p className="text-sm text-[#8B8881]">{data.groom_parents || 'Bpk. Hendra & Ibu Susi'}</p>
                  </div>

                  <div className="text-center md:mt-24">
                     <div className="w-56 h-56 mx-auto rounded-full overflow-hidden border-8 border-white shadow-xl mb-6 bg-[#FFB7C5]/10">
                        <img loading="lazy" src={brideImg} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" alt={bride} />
                     </div>
                     <h3 className="text-3xl font-light text-[#4A4A4A] mb-2" style={{ fontFamily: '"Noto Serif JP", serif' }}>{bride}</h3>
                     <p className="text-[10px] font-bold tracking-widest text-[#FFB7C5] uppercase mb-1">Putri Dari</p>
                     <p className="text-sm text-[#8B8881]">{data.bride_parents || 'Bpk. Budi & Ibu Ani'}</p>
                  </div>
               </div>
            </section>

            {/* Countdown */}
            <section className="py-24 px-6 gsap-section">
               <div className="max-w-3xl mx-auto text-center">
                  <h3 className="text-xs uppercase tracking-[0.3em] text-[#FFB7C5] mb-12">{t.countdown}</h3>
                  <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                     {[
                       { label: "Hari", value: timeLeft.days },
                       { label: "Jam", value: timeLeft.hours },
                       { label: "Menit", value: timeLeft.minutes },
                       { label: "Detik", value: timeLeft.seconds }
                     ].map((item, idx) => (
                       <div key={idx} className="bg-white/80 backdrop-blur-md w-24 h-24 md:w-32 md:h-32 rounded-full border border-[#FFB7C5]/50 shadow-lg flex flex-col items-center justify-center">
                          <div className="text-3xl md:text-4xl font-light text-[#4A4A4A] mb-1">{item.value}</div>
                          <div className="text-[10px] uppercase font-bold tracking-widest text-[#FFB7C5]">{item.label}</div>
                       </div>
                     ))}
                  </div>
               </div>
            </section>

            {/* Event Details */}
            <section className="py-32 px-6 gsap-section">
               <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl p-8 md:p-16 rounded-[3rem] shadow-xl border border-[#FFB7C5]/20">
                  <h2 className="text-3xl text-center font-light text-[#4A4A4A] mb-16" style={{ fontFamily: '"Noto Serif JP", serif' }}>Event Details</h2>
                  
                  <div className="grid md:grid-cols-2 gap-16 md:gap-24 relative">
                     <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#FFB7C5] to-transparent hidden md:block" />
                     
                     <div className="text-center md:text-right">
                        <h3 className="text-xl text-[#FFB7C5] mb-6 uppercase tracking-widest">{t.matrimony}</h3>
                        <p className="text-3xl font-light text-[#4A4A4A] mb-2">{format(parseISO(akadDateStr), 'dd MMMM yyyy', { locale: currentLocale })}</p>
                        <p className="text-[#8B8881] mb-6">{format(parseISO(akadDateStr), 'HH:mm')} WIB</p>
                        <p className="font-bold text-[#4A4A4A] mb-6">{data.location_name || 'Kyoto Gardens'}</p>
                        {data.maps_link && (
                           <a href={data.maps_link} target="_blank" rel="noreferrer" className="inline-block px-6 py-2 border border-[#FFB7C5] text-[#FFB7C5] rounded-full text-xs hover:bg-[#FFB7C5] hover:text-white transition-colors uppercase tracking-widest font-bold">Open Maps</a>
                        )}
                     </div>

                     <div className="text-center md:text-left">
                        <h3 className="text-xl text-[#FFB7C5] mb-6 uppercase tracking-widest">{t.reception}</h3>
                        <p className="text-3xl font-light text-[#4A4A4A] mb-2">{format(parseISO(resepsiDateStr), 'dd MMMM yyyy', { locale: currentLocale })}</p>
                        <p className="text-[#8B8881] mb-6">{format(parseISO(resepsiDateStr), 'HH:mm')} WIB</p>
                        <p className="font-bold text-[#4A4A4A] mb-6">{data.location_name || 'Kyoto Gardens'}</p>
                        {data.maps_link && (
                           <a href={data.maps_link} target="_blank" rel="noreferrer" className="inline-block px-6 py-2 border border-[#FFB7C5] text-[#FFB7C5] rounded-full text-xs hover:bg-[#FFB7C5] hover:text-white transition-colors uppercase tracking-widest font-bold">Open Maps</a>
                        )}
                     </div>
                  </div>
               </div>
            </section>

            {/* Gallery */}
            <section className="py-24 px-6 gsap-section text-center">
               <h3 className="text-xs uppercase tracking-[0.3em] text-[#FFB7C5] mb-12">{t.gallery}</h3>
               <div className="max-w-6xl mx-auto columns-2 md:columns-3 gap-4 space-y-4">
                  {[gallery1, gallery2, gallery3, gallery4].map((img, i) => (
                    <div key={i} className="break-inside-avoid rounded-[2rem] overflow-hidden border-4 border-white shadow-lg relative group">
                       <img loading="lazy" src={img} className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700" alt="Gallery" />
                    </div>
                  ))}
               </div>
            </section>

            {/* Gift */}
            <section className="py-32 px-6 gsap-section text-center">
               <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-md p-12 rounded-[3rem] shadow-lg border border-[#FFB7C5]/30 relative overflow-hidden">
                  <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#FFB7C5]/20 rounded-full blur-2xl" />
                  <h3 className="text-2xl font-light text-[#4A4A4A] mb-6 uppercase tracking-[0.2em]">{t.gift}</h3>
                  <p className="text-[#8B8881] mb-12 text-sm leading-relaxed">
                     Doa restu Anda adalah kado terindah bagi kami. Namun, apabila Anda ingin memberikan tanda kasih, dapat disalurkan melalui:
                  </p>

                  <div className="bg-[#FAF7F2] p-8 rounded-3xl border border-[#FFB7C5]/20">
                     <h4 className="text-xl font-bold text-[#FFB7C5] mb-2 uppercase">{bankName1}</h4>
                     <p className="text-3xl font-light text-[#4A4A4A] mb-2 tracking-widest font-mono">{bankAccount1}</p>
                     <p className="text-[#8B8881] font-bold text-sm mb-8">a.n. {bankAccountName1}</p>
                     <button 
                       onClick={() => {
                         navigator.clipboard.writeText(bankAccount1);
                         toast.success('Nomor rekening disalin!', { style: { background: '#FFB7C5', color: '#fff' }});
                       }}
                       className="w-full bg-[#FFB7C5] text-white py-4 rounded-full uppercase tracking-widest text-xs font-bold hover:bg-[#ff9eb2] transition-colors shadow-md"
                     >
                       Salin Rekening
                     </button>
                  </div>
               </div>
            </section>

            {/* RSVP */}
            <section className="py-32 px-6 gsap-section max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
               <div className="bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-[2rem] shadow-lg border border-[#FFB7C5]/20">
                  <h3 className="text-2xl font-light text-[#4A4A4A] mb-4">R.S.V.P</h3>
                  <p className="text-[#8B8881] text-sm mb-8">Mohon konfirmasi kehadiran Anda.</p>
                  
                  <form onSubmit={handleAddComment} className="space-y-6">
                     <div>
                        <input 
                          type="text" 
                          placeholder="Nama Lengkap"
                          value={newName}
                          onChange={e => setNewName(e.target.value)}
                          className="w-full bg-transparent border-b border-[#FFB7C5] px-0 py-3 text-[#4A4A4A] focus:outline-none focus:border-[#ff9eb2] transition-colors text-sm"
                          required 
                        />
                     </div>
                     <div>
                        <textarea 
                          placeholder="Tulis Pesan & Doa"
                          value={newMessage}
                          onChange={e => setNewMessage(e.target.value)}
                          rows={4}
                          className="w-full bg-transparent border-b border-[#FFB7C5] px-0 py-3 text-[#4A4A4A] focus:outline-none focus:border-[#ff9eb2] transition-colors text-sm resize-none"
                          required 
                        />
                     </div>
                     <button type="submit" className="w-full bg-[#FFB7C5] text-white py-4 rounded-full uppercase tracking-widest text-xs font-bold hover:bg-[#ff9eb2] transition-colors mt-4">
                        {t.sendReply}
                     </button>
                  </form>
               </div>

               <div className="flex flex-col h-full">
                  <h3 className="text-xs uppercase tracking-[0.3em] text-[#FFB7C5] mb-8">{t.guestbook}</h3>
                  <div className="flex-1 space-y-4 max-h-[500px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-[#FFB7C5]/50">
                     {comments.map(comment => (
                        <div key={comment.id} className="bg-white/80 backdrop-blur-sm p-6 rounded-[1.5rem] shadow-sm border border-[#FFB7C5]/10">
                           <p className="font-bold text-[#FFB7C5] text-sm uppercase tracking-widest mb-2">{comment.name}</p>
                           <p className="text-[#4A4A4A] text-sm leading-relaxed">{comment.message}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </section>

            {/* Footer */}
            <footer className="py-16 text-center">
               <h3 className="text-2xl font-light text-[#4A4A4A] mb-4" style={{ fontFamily: '"Noto Serif JP", serif' }}>{groom} & {bride}</h3>
               <p className="text-[10px] uppercase tracking-[0.3em] text-[#FFB7C5]">Five Invitation © 2026</p>
            </footer>

          </div>
        )}
      </div>
    </SmoothScrollLayout>
  );
}
