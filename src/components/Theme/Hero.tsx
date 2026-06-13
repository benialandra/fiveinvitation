import React from 'react';
import { m } from 'framer-motion';
import { BaseSectionProps } from './types';

export default function Hero({ data, lang = 'id', className = '', variants }: BaseSectionProps) {
  const groomName = data.groom_name || 'Groom';
  const brideName = data.bride_name || 'Bride';
  const heroImage = data.hero_image || 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=60&w=1200&auto=format&fit=crop&fm=webp&q=60';
  
  const defaultVariants = variants || {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: 'easeOut' } }
  };

  return (
    <section className={`relative flex items-center justify-center overflow-hidden ${className}`}>
      {/* Background Image */}
      <m.div 
        className="absolute inset-0 w-full h-full"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: 'linear' }}
      >
        <img 
          src={heroImage} 
          alt="Hero" 
          fetchPriority="high"
          loading="eager"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </m.div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 flex flex-col items-center justify-center w-full max-w-4xl mx-auto h-full">
        <m.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }} 
          variants={defaultVariants}
          className="w-full"
        >
          <span className="block text-sm md:text-base tracking-[0.2em] uppercase mb-4 opacity-80">
            {lang === 'id' ? 'Pernikahan' : 'The Wedding Of'}
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif mb-6 leading-tight">
            {groomName} &amp; {brideName}
          </h1>
        </m.div>
      </div>
    </section>
  );
}
