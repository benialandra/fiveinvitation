import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { Copy, Video, CheckCircle2 } from 'lucide-react';

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

const CountdownTimer = ({ targetDate, colors, fonts }: { targetDate: string, colors: any, fonts: any }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!targetDate) return;
    const target = new Date(targetDate).getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;
      
      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!targetDate) return null;

  return (
    <div className="flex justify-center gap-3 md:gap-4 mt-8">
      {[
        { label: 'Hari', value: timeLeft.days },
        { label: 'Jam', value: timeLeft.hours },
        { label: 'Menit', value: timeLeft.minutes },
        { label: 'Detik', value: timeLeft.seconds }
      ].map((item, i) => (
        <div key={i} className="flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-xl backdrop-blur-sm" style={{ backgroundColor: colors?.primary + '20', color: colors?.primary, border: `1px solid ${colors?.primary}40` }}>
          <span className="text-xl md:text-2xl font-bold" style={{ fontFamily: fonts?.heading }}>{item.value}</span>
          <span className="text-[9px] md:text-xs uppercase tracking-wider">{item.label}</span>
        </div>
      ))}
    </div>
  );
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
  gallery_4,
  data
}: any) {
  
  const config = typeof config_json === 'string' ? JSON.parse(config_json) : (config_json || defaultJSONConfig);
  const { colors, fonts, layout, content, music, gallery } = config;

  const finalGroom = data?.groom_name || content?.groom || groom;
  const finalBride = data?.bride_name || content?.bride || bride;
  
  const finalAkadDate = data?.akad_date ? new Date(data.akad_date) : null;
  const finalResepsiDate = data?.resepsi_date ? new Date(data.resepsi_date) : null;
  
  const finalDate = finalAkadDate ? finalAkadDate.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : (content?.date || date);
  const finalCeremonyTime = finalAkadDate ? finalAkadDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : (content?.ceremonyTime || ceremonyTime);
  const finalReceptionTime = finalResepsiDate ? finalResepsiDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : (content?.receptionTime || receptionTime);
  
  const finalCeremonyLocation = data?.location_name || content?.ceremonyLocation || ceremonyLocation;
  const finalReceptionLocation = data?.location_name || content?.receptionLocation || receptionLocation;
  const finalMessage = content?.message || message;
  
  const story = data?.story || '';
  const bank_name = data?.bank_name || '';
  const bank_account = data?.bank_account || '';
  const bank_owner = data?.bank_owner || '';
  const live_stream_url = data?.live_stream_url || '';
  const maps_link = data?.maps_link || '';
  const finalMusic = data?.music_url || music;

  // Use Google Fonts if specified
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Nomor rekening berhasil disalin!');
  };

  // RSVP Form State
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState('ATTENDING');
  const [rsvpCount, setRsvpCount] = useState(1);
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data?.id && !data?.unique_code) {
      toast.success("Pratinjau: Terima kasih atas RSVP & Ucapan Anda!");
      setRsvpName('');
      setRsvpMessage('');
      return;
    }
    
    setSubmitting(true);
    try {
      const orderId = data?.id; // orders table id
      if (orderId) {
        await supabase.from('rsvp').insert([{
          order_id: orderId,
          guest_name: rsvpName,
          status: rsvpStatus,
          guest_count: rsvpCount
        }]);

        await supabase.from('guest_books').insert([{
          order_id: orderId,
          sender_name: rsvpName,
          message: rsvpMessage
        }]);
        toast.success("RSVP dan ucapan berhasil dikirim!");
        setRsvpName('');
        setRsvpMessage('');
      } else {
        toast.success("Pratinjau: Terima kasih atas RSVP & Ucapan Anda!");
      }
    } catch (err) {
      toast.error("Gagal mengirim RSVP.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderBlock = (block: any, index: number) => {
    switch (block.type) {
      case 'hero':
        return (
          <div key={index} className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden" 
               style={{ 
                 backgroundImage: hero_image || cover_image ? `url(${hero_image || cover_image})` : 'none',
                 backgroundSize: 'cover',
                 backgroundPosition: 'center'
               }}>
            <div className="absolute inset-0 bg-black/50 z-0"></div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="z-10 text-center text-white w-full max-w-4xl"
            >
              <p className="text-sm md:text-base uppercase tracking-[0.3em] mb-4" style={{ fontFamily: fonts?.body }}>The Wedding Of</p>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 drop-shadow-lg" style={{ fontFamily: fonts?.heading, color: (hero_image || cover_image) ? '#fff' : titleStyle.color }}>
                {finalGroom} & {finalBride}
              </h1>
              <p className="text-lg md:text-xl tracking-widest mb-8" style={{ fontFamily: fonts?.body }}>{finalDate}</p>
              
              {data?.akad_date && (
                <CountdownTimer targetDate={data.akad_date} colors={colors} fonts={fonts} />
              )}
            </motion.div>
          </div>
        );
      
      case 'couple':
        const finalGroomImage = data?.groom_image || groom_image || gallery_1 || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800";
        const finalBrideImage = data?.bride_image || bride_image || gallery_2 || "https://images.unsplash.com/photo-1546822830-4663ec40a3dd?auto=format&fit=crop&q=80&w=800";
        return (
          <div key={index} className="py-24 px-6 max-w-4xl mx-auto text-center" style={{ backgroundColor: colors?.background }}>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <h2 className="text-3xl md:text-5xl mb-12" style={titleStyle}>Mempelai</h2>
              <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24">
                 <div className="flex flex-col items-center">
                    <div className="w-40 h-40 rounded-full overflow-hidden mb-6 border-4 shadow-xl" style={{ borderColor: colors?.primary }}>
                      <img src={finalGroomImage} alt="Groom" className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: fonts?.heading }}>{finalGroom}</h3>
                    <p style={{ opacity: 0.8 }} className="text-sm leading-relaxed">{data?.groom_parents || 'Putra dari Bapak & Ibu'}</p>
                 </div>
                 <div style={{ color: colors?.primary, fontFamily: fonts?.heading, fontSize: '3rem' }}>&</div>
                 <div className="flex flex-col items-center">
                    <div className="w-40 h-40 rounded-full overflow-hidden mb-6 border-4 shadow-xl" style={{ borderColor: colors?.primary }}>
                      <img src={finalBrideImage} alt="Bride" className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: fonts?.heading }}>{finalBride}</h3>
                    <p style={{ opacity: 0.8 }} className="text-sm leading-relaxed">{data?.bride_parents || 'Putri dari Bapak & Ibu'}</p>
                 </div>
              </div>
              
              {story && (
                <div className="mt-20 p-8 rounded-3xl border shadow-sm max-w-2xl mx-auto" style={{ borderColor: colors?.primary + '20', backgroundColor: colors?.accent ? colors?.accent + '10' : '#ffffff' }}>
                  <h3 className="text-2xl mb-4 font-serif" style={{ fontFamily: fonts?.heading, color: colors?.primary }}>Kisah Kami</h3>
                  <p className="leading-relaxed opacity-80 italic">{story}</p>
                </div>
              )}
            </motion.div>
          </div>
        );

      case 'event_details':
        return (
          <div key={index} className="py-24 px-6" style={{ backgroundColor: colors?.accent ? colors.accent + '15' : '#f9f9f9' }}>
            <div className="max-w-4xl mx-auto">
               <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                 <h2 className="text-3xl md:text-5xl mb-16 text-center" style={titleStyle}>Rangkaian Acara</h2>
                 <div className="grid md:grid-cols-2 gap-12 text-center mb-16">
                    <div className="p-10 rounded-3xl shadow-lg border relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300" style={{ backgroundColor: colors?.background, borderColor: colors?.primary + '30' }}>
                       <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: colors?.primary }}></div>
                       <h3 className="text-2xl mb-4 font-bold" style={{ fontFamily: fonts?.heading }}>Akad Nikah</h3>
                       <p className="mb-2 text-lg">{finalDate}</p>
                       <p className="mb-6 font-bold text-xl" style={{ color: colors?.primary }}>{finalCeremonyTime}</p>
                       <p className="opacity-80 leading-relaxed max-w-xs mx-auto">{finalCeremonyLocation}</p>
                    </div>
                    <div className="p-10 rounded-3xl shadow-lg border relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300" style={{ backgroundColor: colors?.background, borderColor: colors?.primary + '30' }}>
                       <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: colors?.primary }}></div>
                       <h3 className="text-2xl mb-4 font-bold" style={{ fontFamily: fonts?.heading }}>Resepsi</h3>
                       <p className="mb-2 text-lg">{finalDate}</p>
                       <p className="mb-6 font-bold text-xl" style={{ color: colors?.primary }}>{finalReceptionTime}</p>
                       <p className="opacity-80 leading-relaxed max-w-xs mx-auto">{finalReceptionLocation}</p>
                    </div>
                 </div>
                 
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                   {maps_link && (
                     <a href={maps_link} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold tracking-widest uppercase text-sm shadow-xl transition-transform hover:scale-105 text-center" style={{ backgroundColor: colors?.primary, color: '#fff' }}>
                       Buka di Google Maps
                     </a>
                   )}
                   {live_stream_url && (
                     <a href={live_stream_url} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold tracking-widest uppercase text-sm shadow-xl transition-transform hover:scale-105 flex items-center justify-center gap-2 border-2" style={{ backgroundColor: 'transparent', borderColor: colors?.primary, color: colors?.primary }}>
                       <Video size={18} />
                       Tonton Live Streaming
                     </a>
                   )}
                 </div>
               </motion.div>
            </div>
          </div>
        );
        
      case 'gallery':
        const galleryImages = [
           data?.gallery_1 || gallery_1 || cover_image || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200",
           data?.gallery_2 || gallery_2 || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200",
           data?.gallery_3 || gallery_3 || "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&q=80&w=1200",
           data?.gallery_4 || gallery_4 || "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=1200"
        ].filter(Boolean);
        
        return (
          <div key={index} className="py-24 px-6 max-w-5xl mx-auto text-center" style={{ backgroundColor: colors?.background }}>
             <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
               <h2 className="text-3xl md:text-5xl mb-12" style={titleStyle}>Galeri Bahagia</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full perspective-1000">
                  {galleryImages.map((img: string, i: number) => (
                    <div key={i} className="aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-lg relative group transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl bg-white border" style={{ borderColor: colors?.primary + '20' }}>
                       <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                  ))}
               </div>
               
               {/* Digital Envelope Section */}
               {bank_account && (
                 <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="mt-24 max-w-md mx-auto p-8 rounded-3xl shadow-2xl relative overflow-hidden" style={{ backgroundColor: colors?.primary, color: '#fff' }}>
                   <div className="absolute -top-24 -right-24 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>
                   <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-black opacity-10 rounded-full blur-2xl"></div>
                   
                   <h3 className="text-3xl mb-3 font-serif relative z-10" style={{ fontFamily: fonts?.heading }}>Amplop Digital</h3>
                   <p className="mb-8 opacity-90 text-sm relative z-10 leading-relaxed">Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Dan jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi kado secara cashless.</p>
                   
                   <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 relative z-10 text-left">
                     <p className="text-xs uppercase tracking-widest opacity-80 mb-1">{bank_name}</p>
                     <p className="text-2xl font-mono font-bold tracking-widest mb-1">{bank_account}</p>
                     <p className="text-sm opacity-90 mb-6 font-medium">a.n. {bank_owner}</p>
                     
                     <button 
                       type="button"
                       onClick={() => copyToClipboard(bank_account)}
                       className="w-full py-3.5 rounded-xl bg-white text-black font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors shadow-lg"
                       style={{ color: colors?.primary }}
                     >
                       <Copy size={16} />
                       Salin Rekening
                     </button>
                   </div>
                 </motion.div>
               )}

               <p className="mt-24 text-xl max-w-2xl mx-auto italic" style={{ fontFamily: fonts?.heading }}>
                 "{finalMessage}"
               </p>
             </motion.div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div style={mainStyle} className="dynamic-master-theme">
      {finalMusic && (
        <audio src={finalMusic} autoPlay loop style={{ display: 'none' }} />
      )}
      {layout?.map((block: any, idx: number) => {
         if (block.enabled !== false) {
            return renderBlock(block, idx);
         }
         return null;
      })}
      
      {/* RSVP & Guestbook Section */}
      <div className="py-24 px-6 w-full" style={{ backgroundColor: colors?.accent ? colors.accent + '15' : '#fcfcfc' }}>
         <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-4xl mx-auto">
             <h2 className="text-3xl md:text-5xl mb-4 text-center" style={titleStyle}>RSVP & Ucapan</h2>
             <p className="text-center mb-12 opacity-80 max-w-xl mx-auto leading-relaxed">Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir di acara pernikahan kami.</p>
             
             <form className="max-w-xl mx-auto p-8 md:p-10 rounded-3xl border relative overflow-hidden bg-white shadow-xl" style={{ borderColor: (colors?.primary || '#000000') + '30' }} onSubmit={handleRSVP}>
                <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: colors?.primary }}></div>
                
                <div className="mb-6">
                   <label className="block text-xs uppercase tracking-widest mb-2 font-bold opacity-70">Nama Anda</label>
                   <input type="text" value={rsvpName} onChange={(e) => setRsvpName(e.target.value)} className="w-full px-5 py-4 rounded-xl border focus:outline-none focus:ring-2 bg-gray-50/50" style={{ borderColor: (colors?.text || '#000000') + '20' }} placeholder="Masukkan nama..." required />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2 font-bold opacity-70">Kehadiran</label>
                    <select value={rsvpStatus} onChange={(e) => setRsvpStatus(e.target.value)} className="w-full px-5 py-4 rounded-xl border focus:outline-none focus:ring-2 bg-gray-50/50 appearance-none" style={{ borderColor: (colors?.text || '#000000') + '20' }}>
                      <option value="ATTENDING">Hadir</option>
                      <option value="NOT_ATTENDING">Tidak Hadir</option>
                      <option value="TENTATIVE">Ragu-ragu</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2 font-bold opacity-70">Jumlah Tamu</label>
                    <select value={rsvpCount} onChange={(e) => setRsvpCount(Number(e.target.value))} className="w-full px-5 py-4 rounded-xl border focus:outline-none focus:ring-2 bg-gray-50/50 appearance-none" style={{ borderColor: (colors?.text || '#000000') + '20' }}>
                      <option value="1">1 Orang</option>
                      <option value="2">2 Orang</option>
                      <option value="3">3 Orang</option>
                      <option value="4">4 Orang</option>
                      <option value="5">5 Orang</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-8">
                   <label className="block text-xs uppercase tracking-widest mb-2 font-bold opacity-70">Ucapan & Doa</label>
                   <textarea value={rsvpMessage} onChange={(e) => setRsvpMessage(e.target.value)} className="w-full px-5 py-4 rounded-xl border focus:outline-none focus:ring-2 bg-gray-50/50 min-h-[120px]" style={{ borderColor: (colors?.text || '#000000') + '20' }} placeholder="Tuliskan ucapan dan doa untuk mempelai..." required></textarea>
                </div>
                
                <button type="submit" disabled={submitting} className="w-full py-4 rounded-xl font-bold transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-xl tracking-widest uppercase text-sm disabled:opacity-70 flex justify-center items-center gap-2" style={{ backgroundColor: colors?.primary, color: '#ffffff' }}>
                   {submitting ? 'Mengirim...' : <><CheckCircle2 size={18} /> Kirim RSVP & Ucapan</>}
                </button>
             </form>
         </motion.div>
      </div>
    </div>
  );
}
