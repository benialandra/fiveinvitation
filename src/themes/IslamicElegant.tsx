import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import SmoothScrollLayout from '../components/Interactive/SmoothScrollLayout';
import AudioController from '../components/Interactive/AudioController';

const IslamicOrnament = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`opacity-20 ${className}`}>
    <path d="M50 0L60 40L100 50L60 60L50 100L40 60L0 50L40 40L50 0Z" fill="currentColor"/>
    <path d="M50 20L55 45L80 50L55 55L50 80L45 55L20 50L45 45L50 20Z" fill="currentColor"/>
    <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const Bismillah = () => (
  <div className="w-full max-w-[200px] mx-auto mb-8 text-[#D4AF37]">
    {/* Bismillah SVG */}
    <svg viewBox="0 0 300 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M120 70C110 70 105 65 105 55C105 45 110 40 120 40C130 40 135 45 135 55C135 65 130 70 120 70ZM120 45C115 45 110 50 110 55C110 60 115 65 120 65C125 65 130 60 130 55C130 50 125 45 120 45ZM150 70C140 70 135 65 135 55C135 45 140 40 150 40C160 40 165 45 165 55C165 65 160 70 150 70ZM150 45C145 45 140 50 140 55C140 60 145 65 150 65C155 65 160 60 160 55C160 50 155 45 150 45Z" />
      <text x="150" y="60" fontFamily="sans-serif" fontSize="24" textAnchor="middle">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</text>
    </svg>
  </div>
);

export default function IslamicElegant({ data, guestName }: { data?: any, guestName?: string }) {
  const groom = data?.groom_name || 'Fahmi';
  const bride = data?.bride_name || 'Aisyah';
  const displayGuest = guestName || 'Bapak/Ibu/Saudara/i';
  const akadDateStr = data?.akad_date || '2026-12-31T08:00:00';
  const resepsiDateStr = data?.resepsi_date || '2026-12-31T11:00:00';

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isOpened, setIsOpened] = useState(false);
  
  const [comments, setComments] = useState([
    { id: 1, name: 'Keluarga Besar Bpk. Ahmad', message: 'Barakallahu laka wa baraka alaika wa jamaa bainakuma fii khair.' }
  ]);
  const [newName, setNewName] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const loveStory = data?.story || "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang. (Ar-Rum: 21)";
  const coverImg = data?.cover_image || "https://images.unsplash.com/photo-1585036156171-384164a8c675?q=60&w=2000&auto=format&fit=crop&fm=webp&q=60"; 
  const heroImg = data?.hero_image || "https://images.unsplash.com/photo-1564507592227-0b0f5c06a33b?q=60&w=2000&auto=format&fit=crop&fm=webp&q=60"; 
  const gallery1 = data?.gallery_1 || "https://images.unsplash.com/photo-1564507592227-0b0f5c06a33b?q=60&w=800&auto=format&fit=crop&fm=webp&q=60";
  const gallery2 = data?.gallery_2 || "https://images.unsplash.com/photo-1585036156171-384164a8c675?q=60&w=800&auto=format&fit=crop&fm=webp&q=60";
  
  const bankName1 = data?.bank_name_1 || "BSI";
  const bankAccount1 = data?.bank_account_1 || "0987654321";
  const bankAccountName1 = data?.bank_account_name_1 || groom;

  useEffect(() => {
    const targetDate = new Date(akadDateStr).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance < 0) {
        clearInterval(interval);
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [akadDateStr]);

  const handleOpen = () => {
    setIsOpened(true);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName && newMessage) {
      setComments([{ id: Date.now(), name: newName, message: newMessage }, ...comments]);
      setNewName('');
      setNewMessage('');
      toast.success('Doa restu berhasil dikirim!');
    }
  };

  return (
    <SmoothScrollLayout>
      <div className="relative bg-[#0F2A1D] text-[#E8F0EA] font-sans overflow-x-hidden min-h-screen selection:bg-[#D4AF37] selection:text-white">
        
        {isOpened && <AudioController src={data?.music_url || "https://assets.mixkit.co/music/preview/mixkit-beautiful-dream-493.mp3"} />}

        {/* Global Ornaments Background */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex flex-wrap opacity-5">
           {Array.from({length: 12}).map((_, i) => (
             <IslamicOrnament key={i} className="w-1/3 md:w-1/4 h-auto text-[#D4AF37]" />
           ))}
        </div>

        <AnimatePresence>
          {!isOpened && (
            <motion.div 
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-center bg-[#0F2A1D]"
            >
              <div className="absolute inset-4 border-2 border-[#D4AF37]/30 rounded-[2rem] pointer-events-none" />
              <div className="absolute inset-6 border border-[#D4AF37]/20 rounded-[1.5rem] pointer-events-none" />
              
              <div className="absolute inset-0 z-0 opacity-20">
                <img src={coverImg} className="w-full h-full object-cover grayscale mix-blend-luminosity" alt="Cover" />
              </div>
              
              <div className="relative z-10 max-w-sm w-full bg-[#0F2A1D]/90 backdrop-blur-sm p-10 md:p-12 shadow-2xl rounded-3xl border border-[#D4AF37]/40">
                <Bismillah />
                <p className="text-xs tracking-[0.3em] uppercase text-[#D4AF37] mb-4 font-medium">Walimatul Ursy</p>
                <h1 className="text-4xl md:text-5xl font-light mb-8 text-white leading-tight" style={{fontFamily: '"Playfair Display", serif'}}>
                  {groom} & {bride}
                </h1>
                
                <div className="mb-10 border-t border-b border-[#D4AF37]/20 py-6">
                  <p className="text-xs text-[#D4AF37] uppercase tracking-widest mb-3">Kepada Yth:</p>
                  <p className="text-lg font-medium text-white">{displayGuest}</p>
                </div>
                
                <button 
                  onClick={handleOpen}
                  className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#0F2A1D] font-bold tracking-[0.2em] uppercase text-xs hover:from-[#B38F24] hover:to-[#D4AF37] transition-all rounded-xl shadow-[0_5px_20px_rgba(212,175,55,0.3)]"
                >
                  Buka Undangan
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className={`transition-all duration-1000 ${isOpened ? 'opacity-100 visible' : 'opacity-0 invisible h-screen overflow-hidden'}`}>
          
          {/* HERO SECTION */}
          <section className="relative min-h-screen flex items-center justify-center p-6 border-b border-[#D4AF37]/20">
            <div className="absolute inset-0 z-0">
               <img src={heroImg} className="w-full h-full object-cover opacity-30 grayscale" alt="Hero" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0F2A1D] via-[#0F2A1D]/80 to-transparent" />
            </div>
            
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               transition={{ duration: 1.5 }}
               viewport={{ once: true }}
               className="relative z-10 text-center max-w-4xl border border-[#D4AF37]/30 p-12 md:p-24 rounded-t-full bg-[#0F2A1D]/80 backdrop-blur-sm"
            >
               <IslamicOrnament className="w-24 h-24 mx-auto mb-8 text-[#D4AF37] opacity-80" />
               <p className="text-[#D4AF37] text-sm md:text-base tracking-[0.4em] uppercase mb-6 font-bold">The Wedding Of</p>
               <h2 className="text-5xl md:text-8xl font-normal text-white mb-6" style={{fontFamily: '"Playfair Display", serif'}}>
                 {groom} & {bride}
               </h2>
               <div className="w-px h-24 bg-[#D4AF37] mx-auto mt-12" />
            </motion.div>
          </section>

          {/* QUOTE */}
          <section className="py-24 px-6 relative z-10 bg-gradient-to-b from-[#0F2A1D] to-[#0A1C13]">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
              >
                <Bismillah />
                <p className="text-lg md:text-xl leading-relaxed italic text-[#E8F0EA] font-light" style={{fontFamily: '"Playfair Display", serif'}}>
                  "{loveStory}"
                </p>
              </motion.div>
            </div>
          </section>

          {/* EVENTS */}
          <section className="py-24 px-6 relative z-10 bg-[#0A1C13] border-y border-[#D4AF37]/20">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                 <h2 className="text-4xl md:text-5xl text-[#D4AF37] mb-4" style={{fontFamily: '"Playfair Display", serif'}}>Pelaksanaan</h2>
                 <p className="text-[#E8F0EA]/60 tracking-widest uppercase text-sm font-light">Momen penuh berkah</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  viewport={{ once: true }}
                  className="bg-[#0F2A1D] p-10 rounded-3xl border border-[#D4AF37]/20 text-center relative overflow-hidden group hover:border-[#D4AF37]/50 transition-colors"
                >
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl group-hover:bg-[#D4AF37]/10 transition-colors" />
                  <IslamicOrnament className="w-16 h-16 mx-auto mb-6 text-[#D4AF37] opacity-50" />
                  <h3 className="text-3xl font-normal mb-4 text-white" style={{fontFamily: '"Playfair Display", serif'}}>Akad Nikah</h3>
                  <p className="text-[#D4AF37] font-bold tracking-widest uppercase mb-2">{format(parseISO(akadDateStr), 'EEEE, dd MMMM yyyy', { locale: localeId })}</p>
                  <p className="text-[#E8F0EA]/70 mb-6">{format(parseISO(akadDateStr), 'HH:mm')} WIB</p>
                  <div className="bg-[#0A1C13] p-4 rounded-xl border border-[#D4AF37]/10">
                    <p className="font-medium text-white mb-1">Masjid Agung Al-Barkah</p>
                    <p className="text-xs text-[#E8F0EA]/50">Jl. Pahlawan No. 1, Bekasi</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="bg-[#0F2A1D] p-10 rounded-3xl border border-[#D4AF37]/20 text-center relative overflow-hidden group hover:border-[#D4AF37]/50 transition-colors"
                >
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl group-hover:bg-[#D4AF37]/10 transition-colors" />
                  <IslamicOrnament className="w-16 h-16 mx-auto mb-6 text-[#D4AF37] opacity-50" />
                  <h3 className="text-3xl font-normal mb-4 text-white" style={{fontFamily: '"Playfair Display", serif'}}>Resepsi</h3>
                  <p className="text-[#D4AF37] font-bold tracking-widest uppercase mb-2">{format(parseISO(resepsiDateStr), 'EEEE, dd MMMM yyyy', { locale: localeId })}</p>
                  <p className="text-[#E8F0EA]/70 mb-6">{format(parseISO(resepsiDateStr), 'HH:mm')} WIB</p>
                  <div className="bg-[#0A1C13] p-4 rounded-xl border border-[#D4AF37]/10">
                    <p className="font-medium text-white mb-1">{data?.location_name || 'Gedung Serbaguna'}</p>
                    <p className="text-xs text-[#E8F0EA]/50">Bekasi, Jawa Barat</p>
                  </div>
                </motion.div>
              </div>

              {data?.maps_link && (
                 <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mt-12 text-center">
                   <a href={data.maps_link} target="_blank" rel="noreferrer" className="inline-block py-4 px-12 bg-transparent border border-[#D4AF37] text-[#D4AF37] rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#D4AF37] hover:text-[#0F2A1D] transition-colors">
                      Peta Lokasi
                   </a>
                 </motion.div>
              )}
            </div>
          </section>

          {/* COUNTDOWN */}
          <section className="py-20 px-6 relative z-10 bg-[#0A1C13]">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center relative z-10 bg-gradient-to-br from-[#0F2A1D] to-[#0A1C13] p-12 rounded-3xl border border-[#D4AF37]/20 shadow-2xl"
            >
               <h3 className="text-[#D4AF37] font-sans tracking-[0.3em] uppercase text-sm mb-10">Menuju Hari Bahagia</h3>
               <div className="grid grid-cols-4 gap-2 md:gap-4">
                 {[
                   { label: "Hari", value: timeLeft.days },
                   { label: "Jam", value: timeLeft.hours },
                   { label: "Menit", value: timeLeft.minutes },
                   { label: "Detik", value: timeLeft.seconds }
                 ].map((item, idx) => (
                   <div key={idx} className="flex flex-col items-center">
                     <div className="text-3xl md:text-6xl font-light text-white mb-3" style={{fontFamily: '"Playfair Display", serif'}}>{item.value}</div>
                     <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-[#E8F0EA]/50">{item.label}</span>
                   </div>
                 ))}
               </div>
            </motion.div>
          </section>

          {/* WEDDING GIFT */}
          <section className="py-24 px-6 z-10 relative bg-[#0F2A1D] border-y border-[#D4AF37]/20">
            <div className="max-w-md mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="bg-[#0A1C13] p-10 rounded-3xl border border-[#D4AF37]/30 shadow-2xl"
              >
                <IslamicOrnament className="w-12 h-12 mx-auto mb-6 text-[#D4AF37]" />
                <h2 className="text-3xl mb-4 text-[#D4AF37]" style={{fontFamily: '"Playfair Display", serif'}}>Tanda Kasih</h2>
                <p className="text-[#E8F0EA]/70 mb-8 text-sm leading-relaxed">
                  Doa restu Anda adalah karunia terindah bagi kami. Bagi yang ingin memberikan tanda kasih, dapat mengirimkan melalui:
                </p>
                <div className="bg-[#0F2A1D] rounded-xl p-6 mb-8 border border-[#D4AF37]/20">
                  <p className="text-[#D4AF37] font-bold uppercase tracking-widest mb-2 text-xl">{bankName1}</p>
                  <p className="text-2xl font-light tracking-widest text-white mb-2">{bankAccount1}</p>
                  <p className="text-[#E8F0EA]/50 text-sm">a.n {bankAccountName1}</p>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(bankAccount1);
                    toast.success('Nomor rekening berhasil disalin!');
                  }}
                  className="w-full py-4 bg-[#D4AF37] text-[#0F2A1D] rounded-full font-bold tracking-widest uppercase text-xs hover:bg-[#B38F24] transition-colors"
                >
                  Salin Rekening
                </button>
              </motion.div>
            </div>
          </section>

          {/* GUESTBOOK */}
          <section className="py-24 px-6 z-10 relative bg-[#0A1C13]">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-16">
                 <h2 className="text-4xl text-[#D4AF37] mb-4" style={{fontFamily: '"Playfair Display", serif'}}>Buku Tamu</h2>
                 <p className="text-[#E8F0EA]/60 tracking-widest uppercase text-sm font-light">Tinggalkan pesan dan doa</p>
              </div>

              <motion.form 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                onSubmit={handleAddComment} 
                className="bg-[#0F2A1D] p-8 rounded-3xl mb-16 border border-[#D4AF37]/20"
              >
                <div className="mb-4">
                  <input 
                    type="text" 
                    placeholder="Nama Anda" 
                    required
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="w-full px-6 py-4 rounded-full border border-[#D4AF37]/30 bg-[#0A1C13] text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div className="mb-6">
                  <textarea 
                    placeholder="Ucapan dan Doa..." 
                    required
                    rows={4}
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    className="w-full px-6 py-4 rounded-3xl border border-[#D4AF37]/30 bg-[#0A1C13] text-white focus:outline-none focus:border-[#D4AF37] resize-none"
                  />
                </div>
                <button type="submit" className="w-full bg-[#D4AF37] text-[#0F2A1D] py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#B38F24] transition-colors">
                  Kirim Doa Restu
                </button>
              </motion.form>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                <AnimatePresence>
                  {comments.map((comment) => (
                    <motion.div 
                      key={comment.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-[#0F2A1D] p-6 rounded-2xl border border-[#D4AF37]/10"
                    >
                      <h4 className="font-bold text-[#D4AF37] text-lg mb-2">{comment.name}</h4>
                      <p className="text-[#E8F0EA]/80 leading-relaxed text-sm italic">"{comment.message}"</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </section>

          <footer className="py-12 text-center bg-[#050e09] text-white/30 font-sans text-xs tracking-widest uppercase">
            <p className="mb-2">Jazakumullah Khairan Katsiran</p>
            <p>© 2026 {groom} & {bride}. Created with FiveInvitation.</p>
          </footer>
        </main>
      </div>
    </SmoothScrollLayout>
  );
}
