import React, { memo } from 'react';
import { motion } from 'framer-motion';

export interface SharedGalleryProps {
  images: (string | undefined)[];
  colors?: {
    primary?: string;
    background?: string;
  };
  fonts?: {
    heading?: string;
  };
  labels?: {
    title?: string;
  };
  className?: string;
}

const SharedGallery = memo<SharedGalleryProps>(({
  images,
  colors = { primary: '#c5a059', background: '#fdfbf7' },
  fonts = { heading: 'serif' },
  labels = { title: 'Galeri Bahagia' },
  className = ''
}) => {
  const validImages = (images || []).filter(Boolean) as string[];
  
  if (validImages.length === 0) return null;

  return (
    <section className={`py-24 px-6 w-full ${className}`} style={{ backgroundColor: colors.background }}>
      <div className="max-w-5xl mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.8 }}
        >
          {labels.title && (
            <h2 className="text-4xl md:text-5xl mb-16" style={{ fontFamily: fonts.heading, color: colors.primary }}>
              {labels.title}
            </h2>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {validImages.map((img, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-lg relative group transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border bg-white/50" 
                style={{ borderColor: colors.primary ? `${colors.primary}20` : '#e5e5e5' }}
              >
                <img 
                  loading="lazy" 
                  src={img} 
                  alt={`Gallery image ${i + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
});

SharedGallery.displayName = 'SharedGallery';

export default SharedGallery;
