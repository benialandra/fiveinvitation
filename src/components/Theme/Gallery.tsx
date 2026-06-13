import React from 'react';
import { m } from 'framer-motion';
import { BaseSectionProps } from './types';

export default function Gallery({ data, lang = 'id', className = '', variants }: BaseSectionProps) {
  const images = [
    data.gallery_1 || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=60&w=800&auto=format&fit=crop&fm=webp&q=60",
    data.gallery_2 || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=60&w=800&auto=format&fit=crop&fm=webp&q=60",
    data.gallery_3 || "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=60&w=800&auto=format&fit=crop&fm=webp&q=60",
    data.gallery_4 || "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=60&w=800&auto=format&fit=crop&fm=webp&q=60"
  ].filter(Boolean);

  const defaultVariants = variants || {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } }
  };

  return (
    <section className={`py-20 px-4 max-w-6xl mx-auto ${className}`}>
      <m.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-5xl font-serif mb-4">
          {lang === 'id' ? 'Galeri Momen' : 'Our Gallery'}
        </h2>
      </m.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {images.map((src, idx) => (
          <m.div 
            key={idx}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={defaultVariants}
            className={`overflow-hidden rounded-2xl relative group ${idx === 0 || idx === 3 ? 'aspect-[4/5]' : 'aspect-square'}`}
          >
            <img 
              src={src} 
              alt={`Gallery ${idx + 1}`} 
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
          </m.div>
        ))}
      </div>
    </section>
  );
}
