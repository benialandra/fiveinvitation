import React from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

// Default layout configuration
export const defaultJSONConfig = {
  colors: {
    primary: "#C5A059",
    background: "#FDFBF7",
    text: "#2C2C2C",
    accent: "#E2C384"
  },
  fonts: {
    heading: "'Playfair Display', serif",
    body: "'Inter', sans-serif"
  },
  layout: [
    { type: "hero", enabled: true },
    { type: "couple", enabled: true },
    { type: "event_details", enabled: true },
    { type: "gallery", enabled: true }
  ]
};

export default function MasterTheme({ 
  bride = "Bride", 
  groom = "Groom", 
  date = "Sat, 24 Aug 2024",
  ceremonyTime = "08:00 AM",
  ceremonyLocation = "Masjid Agung",
  receptionTime = "11:00 AM",
  receptionLocation = "Hotel Grand",
  message = "Terima kasih atas doa & restu Anda",
  config_json = defaultJSONConfig,
  hero_image,
  cover_image,
  groom_image,
  bride_image,
  gallery_1,
  gallery_2,
  gallery_3,
  gallery_4
}: any) {
  
  const config = typeof config_json === 'string' ? JSON.parse(config_json) : (config_json || defaultJSONConfig);
  const { colors, fonts, layout, content, music, gallery } = config;

  // Use content from config_json if provided, otherwise fallback to props
  const finalGroom = content?.groom || groom;
  const finalBride = content?.bride || bride;
  const finalDate = content?.date || date;
  const finalCeremonyTime = content?.ceremonyTime || ceremonyTime;
  const finalCeremonyLocation = content?.ceremonyLocation || ceremonyLocation;
  const finalReceptionTime = content?.receptionTime || receptionTime;
  const finalReceptionLocation = content?.receptionLocation || receptionLocation;
  const finalMessage = content?.message || message;

  // Use Google Fonts if specified
  React.useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    // Clean up font names for URL
    const headingFont = fonts?.heading?.split(',')[0].replace(/['"]/g, '').trim().replace(/ /g, '+');
    const bodyFont = fonts?.body?.split(',')[0].replace(/['"]/g, '').trim().replace(/ /g, '+');
    
    if (headingFont && bodyFont) {
        link.href = `https://fonts.googleapis.com/css2?family=${headingFont}:wght@400;600;700&family=${bodyFont}:wght@300;400;500;600&display=swap`;
        document.head.appendChild(link);
    }
    
    return () => {
        if (link.parentNode) link.parentNode.removeChild(link);
    };
  }, [fonts]);

  const mainStyle = {
    backgroundColor: colors?.background || "#fff",
    color: colors?.text || "#000",
    fontFamily: fonts?.body || "sans-serif",
    minHeight: "100vh"
  };

  const titleStyle = {
    fontFamily: fonts?.heading || "serif",
    color: colors?.primary || "#C5A059"
  };

  const renderBlock = (block: any, index: number) => {
    switch (block.type) {
      case 'hero':
        return (
          <div key={index} className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden" 
               style={{ 
                 backgroundImage: hero_image ? `url(${hero_image})` : 'none',
                 backgroundSize: 'cover',
                 backgroundPosition: 'center'
               }}>
            <div className="absolute inset-0 bg-black/40 z-0"></div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="z-10 text-center text-white"
            >
              <p className="text-sm uppercase tracking-[0.3em] mb-4" style={{ fontFamily: fonts?.body }}>The Wedding Of</p>
              <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ fontFamily: fonts?.heading, color: hero_image ? '#fff' : titleStyle.color }}>
                {finalGroom} & {finalBride}
              </h1>
              <p className="text-lg tracking-widest" style={{ fontFamily: fonts?.body }}>{finalDate}</p>
            </motion.div>
          </div>
        );
      
      case 'couple':
        const finalGroomImage = groom_image || gallery_1 || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800";
        const finalBrideImage = bride_image || gallery_2 || "https://images.unsplash.com/photo-1546822830-4663ec40a3dd?auto=format&fit=crop&q=80&w=800";
        return (
          <div key={index} className="py-24 px-6 max-w-4xl mx-auto text-center" style={{ backgroundColor: colors?.background }}>
            <h2 className="text-3xl md:text-5xl mb-12" style={titleStyle}>Mempelai</h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24">
               <div className="flex flex-col items-center">
                  {(groom_image || gallery_1) && (
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-2" style={{ borderColor: colors?.primary }}>
                      <img src={finalGroomImage} alt="Groom" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: fonts?.heading }}>{finalGroom}</h3>
                  <p style={{ opacity: 0.8 }}>Putra dari Keluarga A</p>
               </div>
               <div style={{ color: colors?.primary, fontFamily: fonts?.heading, fontSize: '3rem' }}>&</div>
               <div className="flex flex-col items-center">
                  {(bride_image || gallery_2) && (
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-2" style={{ borderColor: colors?.primary }}>
                      <img src={finalBrideImage} alt="Bride" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: fonts?.heading }}>{finalBride}</h3>
                  <p style={{ opacity: 0.8 }}>Putri dari Keluarga B</p>
               </div>
            </div>
          </div>
        );

      case 'event_details':
        return (
          <div key={index} className="py-24 px-6" style={{ backgroundColor: colors?.accent ? colors.accent + '15' : '#f9f9f9' }}>
            <div className="max-w-4xl mx-auto">
               <h2 className="text-3xl md:text-5xl mb-16 text-center" style={titleStyle}>Rangkaian Acara</h2>
               <div className="grid md:grid-cols-2 gap-12 text-center">
                  <div className="p-8 rounded-2xl shadow-sm border border-black/5" style={{ backgroundColor: colors?.background }}>
                     <h3 className="text-2xl mb-4" style={{ fontFamily: fonts?.heading }}>Akad Nikah</h3>
                     <p className="mb-2">{finalDate}</p>
                     <p className="mb-4 font-bold">{finalCeremonyTime}</p>
                     <p>{finalCeremonyLocation}</p>
                  </div>
                  <div className="p-8 rounded-2xl shadow-sm border border-black/5" style={{ backgroundColor: colors?.background }}>
                     <h3 className="text-2xl mb-4" style={{ fontFamily: fonts?.heading }}>Resepsi</h3>
                     <p className="mb-2">{finalDate}</p>
                     <p className="mb-4 font-bold">{finalReceptionTime}</p>
                     <p>{finalReceptionLocation}</p>
                  </div>
               </div>
            </div>
          </div>
        );
        
      case 'gallery':
        const galleryImages = (gallery && gallery.length > 0) ? gallery : [
           gallery_1 || cover_image || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200",
           gallery_2 || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200",
           gallery_3 || "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&q=80&w=1200",
           gallery_4 || "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=1200"
        ];
        return (
          <div key={index} className="py-24 px-6 max-w-4xl mx-auto text-center" style={{ backgroundColor: colors?.background }}>
             <h2 className="text-3xl md:text-5xl mb-12" style={titleStyle}>Galeri Bahagia</h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full perspective-1000">
                {galleryImages.map((img: string, i: number) => (
                  <div key={i} className="aspect-square w-full rounded-2xl overflow-hidden shadow-lg relative group transition-all duration-500 ease-out hover:-translate-y-4 hover:scale-105 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:z-10 bg-white">
                     <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                ))}
             </div>
             <p className="mt-16 text-xl max-w-2xl mx-auto italic" style={{ fontFamily: fonts?.heading }}>
               "{finalMessage}"
             </p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div style={mainStyle} className="dynamic-master-theme">
      {music && (
        <audio src={music} autoPlay loop style={{ display: 'none' }} />
      )}
      {layout?.map((block: any, idx: number) => {
         if (block.enabled !== false) {
            return renderBlock(block, idx);
         }
         return null;
      })}
      
      {/* Guestbook Section */}
      <div className="py-24 px-6 w-full" style={{ backgroundColor: colors?.background }}>
         <div className="max-w-4xl mx-auto">
             <h2 className="text-3xl md:text-4xl mb-8 text-center" style={titleStyle}>Buku Tamu</h2>
             <form className="max-w-xl mx-auto p-8 rounded-2xl border" style={{ backgroundColor: colors?.background, borderColor: (colors?.text || '#000000') + '20', boxShadow: `0 10px 40px ${(colors?.text || '#000000')}10` }} onSubmit={(e) => { e.preventDefault(); toast.success("Terima kasih atas ucapan Anda!"); }}>
                <div className="mb-4">
                   <label className="block text-sm mb-2 opacity-80" style={{ color: colors?.text }}>Nama Anda</label>
                   <input type="text" className="w-full px-4 py-3 rounded-xl border focus:outline-none" style={{ backgroundColor: 'transparent', borderColor: (colors?.text || '#000000') + '30', color: colors?.text }} placeholder="Masukkan nama..." required />
                </div>
                <div className="mb-6">
                   <label className="block text-sm mb-2 opacity-80" style={{ color: colors?.text }}>Ucapan & Doa</label>
                   <textarea className="w-full px-4 py-3 rounded-xl border focus:outline-none min-h-[120px]" style={{ backgroundColor: 'transparent', borderColor: (colors?.text || '#000000') + '30', color: colors?.text }} placeholder="Tuliskan ucapan dan doa untuk mempelai..." required></textarea>
                </div>
                <button type="submit" className="w-full py-4 rounded-xl font-medium transition-opacity hover:opacity-90 shadow-lg tracking-widest uppercase text-sm" style={{ backgroundColor: colors?.primary, color: '#ffffff' }}>
                   Kirim Ucapan
                </button>
             </form>
         </div>
      </div>
    </div>
  );
}
