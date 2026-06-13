import React from 'react';
import { m } from 'framer-motion';
import { BaseSectionProps } from './types';

export default function Story({ data, lang = 'id', className = '', variants }: BaseSectionProps) {
  const storyText = data.story || (lang === 'id' 
    ? "Berawal dari pertemuan sederhana, tumbuh menjadi cinta yang luar biasa. Dua jiwa dengan satu pikiran, dua hati yang berdetak sebagai satu. Kami memutuskan untuk mengikat janji suci dan menempuh perjalanan hidup bersama selamanya."
    : "Two souls with but a single thought, two hearts that beat as one. From a simple encounter to an extraordinary love. We decided to tie the knot and embark on this beautiful journey of life together forever.");

  const defaultVariants = variants || {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } }
  };

  return (
    <section className={`py-20 px-4 max-w-4xl mx-auto ${className}`}>
      <m.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={defaultVariants}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-5xl font-serif mb-4">
          {lang === 'id' ? 'Kisah Cinta' : 'Love Story'}
        </h2>
        <div className="w-16 h-px bg-current mx-auto opacity-30 mt-6" />
      </m.div>

      <div className="relative border-l border-current/20 ml-4 md:ml-12 pl-8 py-4">
        {/* We can make a simple 1-item timeline or multi-item if data supports it. 
            Since standard 'data' only has one 'story' field, we'll represent it as a milestone */}
        <m.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative"
        >
          {/* Timeline Dot */}
          <div className="absolute -left-[41px] top-2 w-4 h-4 rounded-full bg-current opacity-80" />
          
          <h3 className="text-xl md:text-2xl font-serif mb-4">
             {lang === 'id' ? 'Awal Perjalanan' : 'The Beginning'}
          </h3>
          <p className="text-sm md:text-base opacity-80 leading-relaxed font-light">
            {storyText}
          </p>
        </m.div>
      </div>
    </section>
  );
}
