import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { id as localeId, enUS as localeEn } from 'date-fns/locale';
import { Heart, Music, VolumeX } from 'lucide-react';
import SmoothScrollLayout from '../../components/Interactive/SmoothScrollLayout';
import { SharedHero, SharedStory, SharedCountdown, SharedGallery, SharedGift, SharedRSVP } from '../../components/Theme';

export default function Luxury24({ data, guestName, lang = 'id' }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { scrollYProgress } = useScroll();

  const groomName = data?.groom_name || "Ahmad Rifqi";
  const brideName = data?.bride_name || "Sarah Kamila";
  const dateStr = data?.akad_date || "2026-11-20T09:00:00";
  
  const bankName = data?.customizations?.bank_name || "BCA";
  const bankAccount = data?.customizations?.bank_account || "1234567890";
  const bankOwner = data?.customizations?.bank_owner || groomName;
  
  const galleryImages = [
    data?.customizations?.gallery_1 || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000",
    data?.customizations?.gallery_2 || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000",
    data?.customizations?.gallery_3 || "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000",
    data?.customizations?.gallery_4 || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000"
  ];
  
  const coverImage = data?.cover_image || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=60&w=600";
  const heroImage = data?.hero_image || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=60&w=600";
  
  const weddingDate = new Date(dateStr);
  const currentLocale = lang === 'en' ? localeEn : localeId;

  // Configuration for Luxury theme
  const colors = { primary: '#D4AF37', background: '#0F0F0F', text: '#FFFFFF' };
  const fonts = { heading: "'Playfair Display', serif", body: "'Cormorant Garamond', serif" };

  // Phase 4: Placeholder Standardization (Lorem Ipsum)
  const storyText = data?.story || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

  useEffect(() => {
    const link = document.createElement('link');
    const fontStr = fonts.heading.replace(/['"]/g, '').split(',')[0].replace(/ /g, '+') + '&family=' + fonts.body.replace(/['"]/g, '').split(',')[0].replace(/ /g, '+');
    link.href = 'https://fonts.googleapis.com/css2?family=' + fontStr + ':wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="bg-[#0F0F0F] text-[#FFFFFF] py-15 px-5" style={{ fontFamily: fonts.body, backgroundColor: colors.background, color: colors.text }}>
      <audio ref={audioRef} loop>
        <source src="https://assets.mixkit.co/music/preview/mixkit-relaxing-light-piano-music-421.mp3" type="audio/mpeg" />
      </audio>

      <AnimatePresence>
        {isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            onClick={toggleAudio}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-full backdrop-blur-md transition-all duration-300 flex items-center justify-center cursor-pointer shadow-lg"
            style={{ backgroundColor: colors.primary + '30', color: colors.primary, border: '1px solid ' + colors.primary + '50' }}
          >
            {isPlaying ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }}>
                <Music size={22} />
              </motion.div>
            ) : <VolumeX size={22} />}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center text-center px-6 overflow-hidden"
            style={{ backgroundColor: colors.background }}
          >
            <div className="absolute inset-0 z-0">
              <img loading="lazy" src={coverImage} alt="Cover" className="w-full h-full object-cover opacity-20 filter blur-xs" />
              <div className="absolute inset-0 bg-gradient-to-t" style={{ backgroundImage: 'linear-gradient(to top, ' + colors.background + ', transparent)' }} />
            </div>

            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center justify-center h-full pt-10">
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="mb-4" style={{ color: colors.primary }}>
                <Heart size={32} className="stroke-1" />
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.4 }}
                className="text-4xl md:text-6xl font-normal tracking-wide mb-2" style={{ fontFamily: fonts.heading, color: colors.text }}
              >
                {brideName} <span className="font-light italic" style={{ color: colors.primary }}>&amp;</span> {groomName}
              </motion.h1>

              {guestName && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.7 }} className="mb-10 px-8 py-5 rounded-2xl backdrop-blur-md shadow-2xl border" style={{ backgroundColor: colors.background + 'dd', borderColor: colors.primary + '40' }}>
                  <p className="text-[10px] tracking-[0.25em] uppercase mb-2 font-medium" style={{ color: colors.text }}>Kepada Yth:</p>
                  <p className="text-xl font-semibold tracking-wide" style={{ fontFamily: fonts.heading, color: colors.text }}>{guestName}</p>
                </motion.div>
              )}

              <motion.button
                onClick={handleOpen}
                className="hover:scale-105 hover:shadow-[0_0_35px_rgba(212,175,55,0.5)] px-8 py-4 rounded-full font-medium tracking-widest text-xs uppercase shadow-xl transition-all duration-500 flex items-center gap-3 border"
                style={{ backgroundColor: colors.primary, color: '#fff', borderColor: colors.primary }}
              >
                <Heart size={14} className="fill-current animate-pulse" />
                Buka Undangan
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && (
        <SmoothScrollLayout>
          {/* Phase 1: Shared component injection */}
          <SharedHero brideName={brideName} groomName={groomName} dateStr={format(weddingDate, 'EEEE, d MMMM yyyy', { locale: currentLocale })} heroImage={heroImage} colors={colors} fonts={fonts} />
          
          <div className="overflow-hidden bg-transparent">
             <SharedStory storyText={storyText} colors={colors} fonts={fonts} />
          </div>

          <div className="overflow-hidden bg-transparent">
             <SharedCountdown targetDate={weddingDate} colors={colors} fonts={fonts} />
          </div>

          <div className="relative z-10 opacity-95 scale-100">
             <SharedGallery colors={colors} fonts={fonts} images={galleryImages} />
          </div>

          <div className="relative z-10 opacity-95 scale-100">
             <SharedGift colors={colors} fonts={fonts} bankName={bankName} bankAccount={bankAccount} bankOwner={bankOwner} />
          </div>

          <div className="relative z-10 opacity-95 scale-100">
             <SharedRSVP colors={colors} fonts={fonts} />
          </div>
        </SmoothScrollLayout>
      )}
    </div>
  );
}