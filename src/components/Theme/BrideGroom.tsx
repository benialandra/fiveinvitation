import React from 'react';
import { m } from 'framer-motion';
import { BaseSectionProps } from './types';

export default function BrideGroom({ data, lang = 'id', className = '', variants }: BaseSectionProps) {
  const groomName = data.groom_name || "Ahmad Rifqi";
  const brideName = data.bride_name || "Sarah Kamila";
  const groomParents = data.groom_parents || "Bpk. H. Rahmat & Ibu Hj. Ratna";
  const brideParents = data.bride_parents || "Bpk. Ir. H. Bambang & Ibu Hj. Aminah";
  const groomImage = data.groom_image || data.gallery_1 || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=60&w=600&auto=format&fit=crop&fm=webp&q=60";
  const brideImage = data.bride_image || data.gallery_2 || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=60&w=600&auto=format&fit=crop&fm=webp&q=60";

  const defaultVariants = variants || {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } }
  };

  return (
    <section className={`py-20 px-4 max-w-6xl mx-auto ${className}`}>
      <m.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={defaultVariants}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-5xl font-serif mb-4">
          {lang === 'id' ? 'Mempelai' : 'Bride & Groom'}
        </h2>
      </m.div>

      <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
        {/* Groom */}
        <m.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center text-center"
        >
          <div className="w-48 h-64 md:w-64 md:h-80 rounded-t-full overflow-hidden mb-6 shadow-xl relative group">
            <img src={groomImage} alt={groomName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
          <h3 className="text-2xl md:text-4xl font-serif mb-2">{groomName}</h3>
          <p className="text-sm opacity-80 uppercase tracking-widest mb-2">
            {lang === 'id' ? 'Putra dari' : 'Son of'}
          </p>
          <p className="font-medium opacity-90">{groomParents}</p>
        </m.div>

        {/* Bride */}
        <m.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center text-center md:mt-24"
        >
          <div className="w-48 h-64 md:w-64 md:h-80 rounded-t-full overflow-hidden mb-6 shadow-xl relative group">
            <img src={brideImage} alt={brideName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
          <h3 className="text-2xl md:text-4xl font-serif mb-2">{brideName}</h3>
          <p className="text-sm opacity-80 uppercase tracking-widest mb-2">
            {lang === 'id' ? 'Putri dari' : 'Daughter of'}
          </p>
          <p className="font-medium opacity-90">{brideParents}</p>
        </m.div>
      </div>
    </section>
  );
}
