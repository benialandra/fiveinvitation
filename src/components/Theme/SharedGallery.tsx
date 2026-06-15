import React, { memo } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

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
  const { ref, inView } = useIntersectionObserver({ once: true, rootMargin: "-50px" });
  const validImages = (images || []).filter(Boolean) as string[];
  
  if (validImages.length === 0) return null;

  return (
    <section className={`py-24 px-6 w-full ${className}`} style={{ backgroundColor: colors.background }}>
      <div ref={ref} className="max-w-5xl mx-auto text-center">
        <div className={`reveal-up ${inView ? 'in-view' : ''}`}>
          {labels.title && (
            <h2 className="text-4xl md:text-5xl mb-16" style={{ fontFamily: fonts.heading, color: colors.primary }}>
              {labels.title}
            </h2>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {validImages.map((img, i) => (
              <div 
                key={i} 
                className={`reveal-up ${inView ? 'in-view' : ''} aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-lg relative group transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border bg-white/50`}
                style={{ borderColor: colors.primary ? `${colors.primary}20` : '#e5e5e5', transitionDelay: `${i * 0.1}s` }}
              >
                <img 
                  loading="lazy" 
                  src={img} 
                  alt={`Gallery image ${i + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

SharedGallery.displayName = 'SharedGallery';

export default SharedGallery;
