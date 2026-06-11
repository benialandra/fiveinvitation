import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface ThemeProps {
  data?: any;
  guestName?: string;
  lang?: 'en' | 'id';
}

export default function SampleMotif98({ data, guestName, lang = 'id' }: ThemeProps) {
  useEffect(() => {
    // Inject elegant fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Montserrat:wght@300;400;500&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const groom = data?.groom_name || "Groom";
  const bride = data?.bride_name || "Bride";
  const heroImg = data?.hero_image || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=2000";
  const galleryImgs = data?.gallery || [
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&q=80&w=800"
  ];
  
  const akadDate = data?.akad_date ? new Date(data.akad_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "Sabtu, 12 Desember 2026";
  const akadTime = data?.akad_time || "08:00 WIB";
  const akadLoc = data?.akad_location || "Masjid Raya";

  return (
    <div className="min-h-screen bg-[#0A0D14] text-[#E8DCC0] overflow-hidden selection:bg-[#C5A059] selection:text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      
      {/* Decorative Corner Ornaments */}
      <div className="fixed top-0 left-0 w-32 h-32 md:w-64 md:h-64 pointer-events-none z-50 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-[#C5A059] transform -scale-x-100 -scale-y-100">
          <path d="M0 0 C 50 0 100 50 100 100 L 90 100 C 90 60 60 90 0 90 Z" />
          <path d="M0 20 C 40 20 80 60 80 100 L 75 100 C 75 65 65 75 0 75 Z" />
        </svg>
      </div>
      <div className="fixed bottom-0 right-0 w-32 h-32 md:w-64 md:h-64 pointer-events-none z-50 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-[#C5A059]">
          <path d="M0 0 C 50 0 100 50 100 100 L 90 100 C 90 60 60 90 0 90 Z" />
          <path d="M0 20 C 40 20 80 60 80 100 L 75 100 C 75 65 65 75 0 75 Z" />
        </svg>
      </div>

      {/* HERO SECTION */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 2 }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-[#0A0D14]/80 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14] via-transparent to-[#0A0D14] z-20" />
          <img src={heroImg} alt="Hero" className="w-full h-full object-cover object-top opacity-50 filter grayscale-[30%] sepia-[20%]" />
        </motion.div>

        <div className="relative z-30 max-w-4xl mx-auto flex flex-col items-center">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="uppercase tracking-[0.4em] text-sm md:text-base text-[#C5A059] mb-8"
          >
            The Wedding Celebration Of
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.8, type: "spring", stiffness: 50 }}
            className="flex flex-col md:flex-row items-center gap-6 md:gap-12"
          >
            <h1 className="text-6xl md:text-8xl font-normal text-white" style={{ fontFamily: "'Cinzel', serif" }}>
              {groom}
            </h1>
            <span className="text-5xl md:text-7xl font-light text-[#C5A059] italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              &
            </span>
            <h1 className="text-6xl md:text-8xl font-normal text-white" style={{ fontFamily: "'Cinzel', serif" }}>
              {bride}
            </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="mt-12 flex items-center justify-center gap-4"
          >
            <div className="w-16 md:w-32 h-[1px] bg-gradient-to-r from-transparent to-[#C5A059]" />
            <p className="text-lg md:text-xl tracking-widest font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {akadDate}
            </p>
            <div className="w-16 md:w-32 h-[1px] bg-gradient-to-l from-transparent to-[#C5A059]" />
          </motion.div>

          {guestName && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 2 }}
              className="mt-16 p-6 md:p-8 rounded-2xl backdrop-blur-sm border border-[#C5A059]/30 bg-[#0A0D14]/50 shadow-[0_0_40px_rgba(197,160,89,0.1)]"
            >
              <p className="text-sm uppercase tracking-widest text-white/60 mb-2">Dear,</p>
              <h2 className="text-2xl md:text-3xl text-white font-medium" style={{ fontFamily: "'Cinzel', serif" }}>{guestName}</h2>
              <p className="mt-4 text-sm font-light text-white/70">You are joyfully invited to share in our celebration.</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* EVENT DETAILS */}
      <section className="py-32 px-6 relative z-10 bg-[#0A0D14]">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl text-white mb-6" style={{ fontFamily: "'Cinzel', serif" }}>Rangkaian Acara</h2>
            <div className="w-24 h-[2px] bg-[#C5A059] mx-auto" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {[
              { title: "Akad Nikah", date: akadDate, time: akadTime, loc: akadLoc },
              { title: "Resepsi", date: akadDate, time: "11:00 - Selesai", loc: akadLoc }
            ].map((event, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: idx * 0.2 }}
                className="relative p-10 rounded-3xl border border-[#C5A059]/20 bg-gradient-to-b from-[#111622] to-[#0A0D14] text-center group hover:border-[#C5A059]/60 transition-colors duration-500"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#0A0D14] rounded-full border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
                  ✧
                </div>
                <h3 className="text-2xl md:text-3xl text-[#C5A059] mb-4" style={{ fontFamily: "'Cinzel', serif" }}>{event.title}</h3>
                <p className="text-lg text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{event.date}</p>
                <p className="font-medium text-white/90 mb-6 tracking-widest">{event.time}</p>
                <div className="w-12 h-[1px] bg-white/10 mx-auto mb-6 group-hover:w-24 transition-all duration-500" />
                <p className="text-white/70 font-light leading-relaxed">{event.loc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="py-24 px-6 bg-[#111622]">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl text-white mb-6" style={{ fontFamily: "'Cinzel', serif" }}>Our Moments</h2>
            <div className="w-24 h-[2px] bg-[#C5A059] mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {galleryImgs.map((img: string, i: number) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.15 }}
                className="group relative aspect-[4/5] rounded-xl overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-[#C5A059]/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img 
                  src={img} 
                  alt="Gallery" 
                  loading="lazy"
                  className="w-full h-full object-cover filter grayscale-[20%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
