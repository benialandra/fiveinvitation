import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';

export interface SharedHeroProps {
  brideName: string;
  groomName: string;
  dateStr: string;
  heroImage: string;
  colors?: {
    primary?: string;
    text?: string;
    background?: string;
  };
  fonts?: {
    heading?: string;
    body?: string;
  };
  labels?: {
    announcement?: string;
    scrollDown?: string;
  };
  className?: string;
  onScrollClick?: () => void;
}

const SharedHero = memo<SharedHeroProps>(({
  brideName,
  groomName,
  dateStr,
  heroImage,
  colors = { primary: '#c5a059', text: '#ffffff' },
  fonts = { heading: 'serif', body: 'sans-serif' },
  labels = { announcement: 'We Are Getting Married', scrollDown: 'Scroll Down' },
  className = '',
  onScrollClick
}) => {
  return (
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}>
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img loading="eager" src={heroImage} alt="Hero Cover" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto flex flex-col items-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="flex flex-col items-center w-full"
        >
          {labels.announcement && (
            <span 
              className="tracking-[0.4em] uppercase text-xs md:text-sm mb-4 font-bold flex items-center gap-2"
              style={{ color: colors.primary, fontFamily: fonts.body }}
            >
              <Sparkles size={12} className="animate-pulse" />
              {labels.announcement}
              <Sparkles size={12} className="animate-pulse" />
            </span>
          )}
          
          <div className="w-24 h-[1px] mb-8" style={{ background: `linear-gradient(to right, transparent, ${colors.primary}, transparent)` }} />

          <h2 className="text-5xl md:text-7xl lg:text-8xl font-normal drop-shadow-lg leading-tight tracking-wider" style={{ fontFamily: fonts.heading, color: colors.text }}>
            {brideName} <br />
            <span className="italic font-light text-3xl md:text-5xl my-2 block" style={{ color: colors.primary }}>&amp;</span>
            {groomName}
          </h2>

          <p className="italic text-lg md:text-xl tracking-widest mt-6 drop-shadow-md" style={{ fontFamily: fonts.heading, color: colors.text, opacity: 0.8 }}>
            {dateStr}
          </p>

          {/* Scroll Down */}
          {labels.scrollDown && (
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mt-20 flex flex-col items-center gap-2 cursor-pointer"
              style={{ color: colors.primary, opacity: 0.7 }}
              onClick={onScrollClick}
            >
              <span className="text-[10px] tracking-[0.3em] uppercase font-semibold">{labels.scrollDown}</span>
              <ChevronDown size={24} className="animate-bounce mt-1" />
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
});

SharedHero.displayName = 'SharedHero';

export default SharedHero;
