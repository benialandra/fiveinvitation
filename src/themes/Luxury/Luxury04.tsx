import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { Calendar, MapPin, Music, Pause, Play, Clock, Gift, Heart, Send } from 'lucide-react';

interface ThemeProps {
  guestName?: string;
  data?: any;
}

const Luxury04: React.FC<ThemeProps> = ({ guestName = 'Tamu Undangan', data }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInvitation, setShowInvitation] = useState(false);
  const [rsvpForm, setRsvpForm] = useState({ name: guestName, attendance: 'hadir', guests: '1' });
  
  // Art Deco Colors
  const colors = {
    sapphire: '#0A1128',
    brass: '#D4AF37',
    cream: '#FDFBF7',
    obsidian: '#050814'
  };

  const brideName = data?.bride_name || 'Salsa';
  const groomName = data?.groom_name || 'Beni';
  const brideFullName = data?.bride_fullname || 'Salsabila Putri';
  const groomFullName = data?.groom_fullname || 'Beni Alandra';
  const dateStr = data?.akad_date || '2026-12-12';
  const eventTime = data?.akad_time || '09:00 - 13:00 WIB';
  const location = data?.akad_location || 'The Ritz-Carlton';
  const address = data?.akad_address || 'Jl. Mega Kuningan, Jakarta';
  const gallery = [
    data?.customizations?.gallery_1 || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800',
    data?.customizations?.gallery_2 || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800',
    data?.customizations?.gallery_3 || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800',
    data?.customizations?.gallery_4 || 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800'
  ];

  const { ref: heroRef, inView: heroInView } = useIntersectionObserver({ threshold: 0.1 });
  const { ref: storyRef, inView: storyInView } = useIntersectionObserver({ threshold: 0.1 });
  const { ref: galleryRef, inView: galleryInView } = useIntersectionObserver({ threshold: 0.1 });
  const { ref: eventRef, inView: eventInView } = useIntersectionObserver({ threshold: 0.1 });
  const { ref: rsvpRef, inView: rsvpInView } = useIntersectionObserver({ threshold: 0.1 });
  const { ref: giftRef, inView: giftInView } = useIntersectionObserver({ threshold: 0.1 });

  // "Stepped Elevate" Animation pattern
  const steppedVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1.0] // Strict geometric ease
      }
    })
  };

  // 1. Cover Screen
  if (!showInvitation) {
    return (
      <div className="fixed inset-0 w-full h-full z-50 flex items-center justify-center overflow-hidden" style={{ backgroundColor: colors.sapphire }}>
        {/* Geometric Background Borders */}
        <div className="absolute inset-4 border border-[#D4AF37]/30 p-2 pointer-events-none">
          <div className="w-full h-full border border-[#D4AF37]/10" />
        </div>
        
        <div className="relative z-10 text-center px-8 flex flex-col items-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-32 h-32 md:w-48 md:h-48 border-2 flex items-center justify-center mb-8 rotate-45"
            style={{ borderColor: colors.brass }}
          >
            <div className="-rotate-45 font-serif text-5xl md:text-7xl text-[#FDFBF7]">
              S<span style={{ color: colors.brass }}>&</span>B
            </div>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="uppercase tracking-[0.3em] text-xs mb-2"
            style={{ color: colors.brass }}
          >
            The Wedding Of
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="font-serif text-4xl md:text-6xl mb-8 font-medium"
            style={{ color: colors.cream }}
          >
            {brideName} & {groomName}
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-6"
          >
            <p className="text-sm mb-4" style={{ color: colors.cream }}>Kepada Yth.</p>
            <p className="font-serif text-xl border-b pb-2 px-8 mb-8" style={{ color: colors.brass, borderColor: colors.brass }}>
              {guestName}
            </p>
            <button
              onClick={() => setShowInvitation(true)}
              className="px-8 py-3 uppercase tracking-widest text-xs transition-colors hover:bg-white/10"
              style={{ border: `1px solid ${colors.brass}`, color: colors.brass }}
            >
              Buka Undangan
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative font-sans" style={{ backgroundColor: colors.obsidian, color: colors.cream }}>
      
      {/* Decorative Art Deco Frame globally */}
      <div className="fixed inset-4 pointer-events-none z-50 border hidden md:block" style={{ borderColor: `${colors.brass}40` }}>
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l" style={{ borderColor: colors.brass }} />
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r" style={{ borderColor: colors.brass }} />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l" style={{ borderColor: colors.brass }} />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r" style={{ borderColor: colors.brass }} />
      </div>

      {/* Navigation / Music */}
      <button 
        onClick={() => setIsPlaying(!isPlaying)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 flex items-center justify-center rounded-none border transition-colors bg-[#0A1128]"
        style={{ borderColor: colors.brass, color: colors.brass }}
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>

      {/* 2. Hero "The Marquee" */}
      <section ref={heroRef} className="relative w-full h-screen flex flex-col items-center justify-center px-6 pt-20" style={{ backgroundColor: colors.sapphire }}>
        <motion.div 
          custom={0} initial="hidden" animate={heroInView ? "visible" : "hidden"} variants={steppedVariants}
          className="w-full max-w-sm aspect-[3/4] border-2 relative flex flex-col items-center justify-center p-8 text-center"
          style={{ borderColor: colors.brass }}
        >
          {/* Inner decoration */}
          <div className="absolute inset-2 border" style={{ borderColor: `${colors.brass}40` }} />
          
          <h2 className="uppercase tracking-[0.4em] text-[10px] mb-8" style={{ color: colors.brass }}>We Are Getting Married</h2>
          <h1 className="font-serif text-5xl md:text-7xl mb-8 leading-tight">
            {brideName} <br/> <span className="text-3xl" style={{ color: colors.brass }}>&</span> <br/> {groomName}
          </h1>
          <div className="w-16 border-t mb-8" style={{ borderColor: colors.brass }} />
          <p className="tracking-[0.2em] uppercase text-xs" style={{ color: colors.cream }}>{dateStr}</p>
        </motion.div>
      </section>

      {/* 3. Story Section */}
      <section ref={storyRef} className="py-24 px-6 relative" style={{ backgroundColor: colors.obsidian }}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <motion.div 
            custom={0} initial="hidden" animate={storyInView ? "visible" : "hidden"} variants={steppedVariants}
            className="flex-1 text-center md:text-right"
          >
            <h3 className="uppercase tracking-widest text-xs mb-2" style={{ color: colors.brass }}>The Bride</h3>
            <h2 className="font-serif text-3xl mb-4 text-white">{brideFullName}</h2>
            <p className="text-sm opacity-70 leading-relaxed max-w-xs ml-auto">Putri dari Bapak Fulan & Ibu Fulanah</p>
          </motion.div>
          
          <motion.div 
            custom={1} initial="hidden" animate={storyInView ? "visible" : "hidden"} variants={steppedVariants}
            className="w-[1px] h-32 hidden md:block" style={{ backgroundColor: colors.brass }} 
          />
          <motion.div 
            custom={1} initial="hidden" animate={storyInView ? "visible" : "hidden"} variants={steppedVariants}
            className="w-32 h-[1px] block md:hidden" style={{ backgroundColor: colors.brass }} 
          />

          <motion.div 
            custom={2} initial="hidden" animate={storyInView ? "visible" : "hidden"} variants={steppedVariants}
            className="flex-1 text-center md:text-left"
          >
            <h3 className="uppercase tracking-widest text-xs mb-2" style={{ color: colors.brass }}>The Groom</h3>
            <h2 className="font-serif text-3xl mb-4 text-white">{groomFullName}</h2>
            <p className="text-sm opacity-70 leading-relaxed max-w-xs mr-auto">Putra dari Bapak Fulan & Ibu Fulanah</p>
          </motion.div>
        </div>
      </section>

      {/* 4. Event Section */}
      <section ref={eventRef} className="py-24 px-6" style={{ backgroundColor: colors.sapphire }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            custom={0} initial="hidden" animate={eventInView ? "visible" : "hidden"} variants={steppedVariants}
            className="font-serif text-4xl mb-16 text-white"
          >
            Event Details
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Akad */}
            <motion.div 
              custom={1} initial="hidden" animate={eventInView ? "visible" : "hidden"} variants={steppedVariants}
              className="border p-8 relative group hover:bg-white/5 transition-colors"
              style={{ borderColor: `${colors.brass}60` }}
            >
              <div className="w-12 h-12 border mx-auto mb-6 flex items-center justify-center rotate-45" style={{ borderColor: colors.brass }}>
                <Calendar size={18} className="-rotate-45" style={{ color: colors.brass }} />
              </div>
              <h3 className="font-serif text-2xl mb-4 text-white">Akad Nikah</h3>
              <p className="uppercase tracking-widest text-xs mb-2" style={{ color: colors.brass }}>{dateStr}</p>
              <p className="text-sm opacity-80 mb-6">08:00 - 10:00 WIB</p>
              <p className="text-sm font-medium text-white">{location}</p>
            </motion.div>

            {/* Resepsi */}
            <motion.div 
              custom={2} initial="hidden" animate={eventInView ? "visible" : "hidden"} variants={steppedVariants}
              className="border p-8 relative group hover:bg-white/5 transition-colors"
              style={{ borderColor: `${colors.brass}60` }}
            >
              <div className="w-12 h-12 border mx-auto mb-6 flex items-center justify-center rotate-45" style={{ borderColor: colors.brass }}>
                <Music size={18} className="-rotate-45" style={{ color: colors.brass }} />
              </div>
              <h3 className="font-serif text-2xl mb-4 text-white">Resepsi</h3>
              <p className="uppercase tracking-widest text-xs mb-2" style={{ color: colors.brass }}>{dateStr}</p>
              <p className="text-sm opacity-80 mb-6">{eventTime}</p>
              <p className="text-sm font-medium text-white">{location}</p>
            </motion.div>
          </div>
          
          <motion.div custom={3} initial="hidden" animate={eventInView ? "visible" : "hidden"} variants={steppedVariants} className="mt-12">
            <button className="px-8 py-4 uppercase tracking-widest text-xs flex items-center gap-3 mx-auto transition-all hover:bg-[#D4AF37] hover:text-[#0A1128]"
              style={{ border: `1px solid ${colors.brass}`, color: colors.brass }}
            >
              <MapPin size={16} /> Buka Google Maps
            </button>
          </motion.div>
        </div>
      </section>

      {/* 5. Gallery "The Film Strip" */}
      <section ref={galleryRef} className="py-24 px-6 relative" style={{ backgroundColor: colors.obsidian }}>
        <div className="max-w-6xl mx-auto text-center mb-16">
          <motion.h2 
            custom={0} initial="hidden" animate={galleryInView ? "visible" : "hidden"} variants={steppedVariants}
            className="font-serif text-4xl text-white mb-4"
          >
            Our Moments
          </motion.h2>
          <motion.div custom={1} initial="hidden" animate={galleryInView ? "visible" : "hidden"} variants={steppedVariants} className="w-12 mx-auto border-t" style={{ borderColor: colors.brass }} />
        </div>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
          {gallery.slice(0,4).map((img: string, i: number) => (
            <motion.div 
              key={i}
              custom={i + 2} initial="hidden" animate={galleryInView ? "visible" : "hidden"} variants={steppedVariants}
              className={`border p-2 ${i === 0 || i === 3 ? 'md:aspect-square' : 'md:aspect-video'} aspect-square group overflow-hidden`}
              style={{ borderColor: `${colors.brass}40` }}
            >
              <div className="w-full h-full overflow-hidden relative">
                {/* Art Deco Overlay frame */}
                <div className="absolute inset-2 border pointer-events-none z-10 transition-all group-hover:inset-4" style={{ borderColor: `${colors.brass}60` }} />
                <img 
                  src={img} 
                  alt="Gallery" 
                  className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. RSVP "The VIP Pass" */}
      <section ref={rsvpRef} className="py-24 px-6 flex justify-center" style={{ backgroundColor: colors.sapphire }}>
        <motion.div 
          custom={0} initial="hidden" animate={rsvpInView ? "visible" : "hidden"} variants={steppedVariants}
          className="w-full max-w-xl border-2 p-8 md:p-12 relative"
          style={{ borderColor: colors.brass, backgroundColor: colors.obsidian }}
        >
          {/* Perforated edge effect */}
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full" style={{ backgroundColor: colors.sapphire }} />
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full" style={{ backgroundColor: colors.sapphire }} />
          <div className="absolute left-1/2 top-0 -translate-x-1/2 bottom-0 w-[1px] border-l border-dashed opacity-20 pointer-events-none" style={{ borderColor: colors.brass }} />
          
          <h2 className="font-serif text-3xl mb-8 text-center text-white">RSVP</h2>
          
          <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block uppercase tracking-widest text-[10px] mb-2" style={{ color: colors.brass }}>Name</label>
              <input 
                type="text" 
                value={rsvpForm.name}
                onChange={e => setRsvpForm({...rsvpForm, name: e.target.value})}
                className="w-full bg-transparent border-b outline-none py-2 text-white font-serif transition-colors focus:border-white"
                style={{ borderColor: `${colors.brass}60` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block uppercase tracking-widest text-[10px] mb-2" style={{ color: colors.brass }}>Attendance</label>
                <select 
                  value={rsvpForm.attendance}
                  onChange={e => setRsvpForm({...rsvpForm, attendance: e.target.value})}
                  className="w-full bg-transparent border-b outline-none py-2 text-white font-serif transition-colors focus:border-white appearance-none"
                  style={{ borderColor: `${colors.brass}60` }}
                >
                  <option value="hadir" style={{ background: colors.obsidian }}>Hadir</option>
                  <option value="tidak_hadir" style={{ background: colors.obsidian }}>Tidak Hadir</option>
                </select>
              </div>
              <div>
                <label className="block uppercase tracking-widest text-[10px] mb-2" style={{ color: colors.brass }}>Guests</label>
                <select 
                  value={rsvpForm.guests}
                  onChange={e => setRsvpForm({...rsvpForm, guests: e.target.value})}
                  className="w-full bg-transparent border-b outline-none py-2 text-white font-serif transition-colors focus:border-white appearance-none"
                  style={{ borderColor: `${colors.brass}60` }}
                >
                  <option value="1" style={{ background: colors.obsidian }}>1 Person</option>
                  <option value="2" style={{ background: colors.obsidian }}>2 Persons</option>
                </select>
              </div>
            </div>
            <button className="w-full py-4 mt-8 uppercase tracking-widest text-xs transition-colors hover:bg-white hover:text-black"
              style={{ backgroundColor: colors.brass, color: colors.obsidian }}
            >
              Confirm Attendance
            </button>
          </form>
        </motion.div>
      </section>

      {/* 7. Gift Section */}
      <section ref={giftRef} className="py-24 px-6 text-center" style={{ backgroundColor: colors.obsidian }}>
        <motion.div custom={0} initial="hidden" animate={giftInView ? "visible" : "hidden"} variants={steppedVariants} className="max-w-2xl mx-auto">
          <Gift size={32} className="mx-auto mb-6" style={{ color: colors.brass }} />
          <h2 className="font-serif text-3xl mb-4 text-white">Wedding Gift</h2>
          <p className="text-sm opacity-70 mb-12 max-w-md mx-auto">Doa restu Anda merupakan karunia terindah. Namun jika Anda hendak memberikan tanda kasih, dapat melalui rekening berikut:</p>
          
          <div className="border p-8 inline-block text-left relative overflow-hidden" style={{ borderColor: `${colors.brass}40`, backgroundColor: colors.sapphire }}>
            <div className="absolute top-0 right-0 w-32 h-32 border border-white/5 rounded-full -translate-y-16 translate-x-16 pointer-events-none" />
            <h3 className="uppercase tracking-widest text-xs mb-4" style={{ color: colors.brass }}>Bank Central Asia (BCA)</h3>
            <p className="font-serif text-2xl tracking-widest mb-2 text-white">1234 5678 9012</p>
            <p className="text-sm opacity-70 mb-6">a.n. Salsabila Putri</p>
            <button className="px-6 py-2 border uppercase tracking-widest text-[10px] hover:bg-white/10 transition-colors"
              style={{ borderColor: colors.brass, color: colors.brass }}
            >
              Salin Nomor
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center" style={{ backgroundColor: colors.sapphire }}>
        <p className="font-serif text-2xl mb-2 text-white">{brideName} & {groomName}</p>
        <p className="uppercase tracking-[0.3em] text-[10px] opacity-50" style={{ color: colors.cream }}>Thank You</p>
      </footer>

    </div>
  );
};

export default Luxury04;
