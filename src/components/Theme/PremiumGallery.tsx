import React, { memo } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

export interface PremiumGalleryProps {
  images: (string | undefined)[];
  variant?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  colors?: {
    primary?: string;
    background?: string;
    text?: string;
  };
  fonts?: {
    heading?: string;
  };
  labels?: {
    title?: string;
  };
  className?: string;
}

const PremiumGallery = memo<PremiumGalleryProps>(({
  images,
  variant = 1,
  colors = { primary: '#c5a059', background: '#fdfbf7', text: '#333' },
  fonts = { heading: 'serif' },
  labels = { title: 'Galeri Bahagia' },
  className = ''
}) => {
  const { ref, inView } = useIntersectionObserver({ once: true, rootMargin: "-50px" });
  const validImages = (images || []).filter(Boolean) as string[];
  
  if (validImages.length === 0) return null;

  const renderVariant = () => {
    switch(variant) {
      case 1: // Classic Elegant (Benchmark style)
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
            {validImages.map((img, i) => (
              <div key={i} className="aspect-[3/4] overflow-hidden rounded-xl shadow-lg border bg-white/50 group" style={{ borderColor: `${colors.primary}30` }}>
                <img loading="lazy" src={img} alt="Gallery" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              </div>
            ))}
          </div>
        );
      case 2: // Masonry Balanced
        return (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-4 items-start">
            {validImages.map((img, i) => (
              <div key={i} className={`aspect-[4/5] overflow-hidden rounded-lg shadow-md group ${i % 2 === 1 ? 'mt-8 md:mt-12' : ''}`}>
                <img loading="lazy" src={img} alt="Gallery" className="w-full h-full object-cover transition-all duration-700 group-hover:brightness-110" />
              </div>
            ))}
          </div>
        );
      case 3: // Gallery Wall (Featured Image)
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 px-2 md:px-4">
            {validImages.map((img, i) => (
              <div key={i} className={`overflow-hidden rounded-sm group ${i === 0 ? 'col-span-2 row-span-2 aspect-[4/5] md:aspect-square' : 'aspect-square'}`}>
                <img loading="lazy" src={img} alt="Gallery" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
              </div>
            ))}
          </div>
        );
      case 4: // Art Exhibition (Horizontal Clean)
        return (
          <div className="flex overflow-x-auto gap-4 md:gap-8 pb-10 snap-x px-4 md:px-8 w-full max-w-full" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
            {validImages.map((img, i) => (
              <div key={i} className="snap-center shrink-0 w-[75vw] md:w-[350px] aspect-[3/4] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] bg-white p-2 md:p-3">
                <img loading="lazy" src={img} alt="Gallery" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
              </div>
            ))}
          </div>
        );
      case 5: // Minimalist Grid (Zero Gap)
        return (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 px-2 md:px-0 mx-auto max-w-6xl shadow-2xl">
            {validImages.map((img, i) => (
              <div key={i} className="aspect-square overflow-hidden relative group border-[0.5px]" style={{ borderColor: `${colors.background}` }}>
                <img loading="lazy" src={img} alt="Gallery" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-700"></div>
              </div>
            ))}
          </div>
        );
      case 6: // Pill Shapes
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
            {validImages.map((img, i) => (
              <div key={i} className="aspect-[1/2] rounded-full overflow-hidden shadow-xl border-4" style={{ borderColor: `${colors.primary}20` }}>
                <img loading="lazy" src={img} alt="Gallery" className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110" />
              </div>
            ))}
          </div>
        );
      case 7: // Soft Focus 
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 px-6 max-w-4xl mx-auto">
            {validImages.map((img, i) => (
              <div key={i} className="aspect-[4/3] rounded-3xl overflow-hidden shadow-lg relative group">
                <img loading="lazy" src={img} alt="Gallery" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 blur-[1px] group-hover:blur-none" />
              </div>
            ))}
          </div>
        );
      case 8: // Floating Alternating Cards
        return (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 px-4">
            {validImages.map((img, i) => (
              <div key={i} className={`aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.1)] group transition-all duration-700 ${i % 2 === 0 ? '-translate-y-4 hover:-translate-y-6' : 'translate-y-4 hover:translate-y-2'}`}>
                <img loading="lazy" src={img} alt="Gallery" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              </div>
            ))}
          </div>
        );
      case 9: // Mondrian Strict Asymmetry
        return (
          <div className="grid grid-cols-3 gap-2 px-2 max-w-5xl mx-auto">
            {validImages.map((img, i) => (
              <div key={i} className={`overflow-hidden group ${i === 0 ? 'col-span-3 aspect-[21/9]' : i === 1 ? 'col-span-2 aspect-[4/3]' : 'col-span-1 aspect-[2/3]'}`}>
                <img loading="lazy" src={img} alt="Gallery" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              </div>
            ))}
          </div>
        );
      case 10: // Cinematic Widescreen
        return (
          <div className="flex flex-col gap-4 px-4 max-w-5xl mx-auto">
            {validImages.slice(0, 3).map((img, i) => (
              <div key={i} className="w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-xl shadow-md group">
                <img loading="lazy" src={img} alt="Gallery" className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 group-hover:brightness-110" />
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className={`py-16 md:py-24 w-full ${className} overflow-hidden`} style={{ backgroundColor: colors.background }}>
      <div ref={ref} className="max-w-6xl mx-auto text-center">
        <div className={`reveal-up ${inView ? 'in-view' : ''} mb-12 md:mb-16`}>
          {labels.title && (
            <h2 className="text-3xl md:text-5xl px-4 tracking-wide font-light" style={{ fontFamily: fonts.heading, color: colors.primary }}>
              {labels.title}
            </h2>
          )}
          <div className="w-16 h-[1px] mx-auto mt-6" style={{ backgroundColor: colors.primary, opacity: 0.6 }}></div>
        </div>
        
        <div className={`reveal-up ${inView ? 'in-view' : ''}`} style={{ transitionDelay: '0.2s' }}>
          {renderVariant()}
        </div>
      </div>
    </section>
  );
});

PremiumGallery.displayName = 'PremiumGallery';

export default PremiumGallery;
