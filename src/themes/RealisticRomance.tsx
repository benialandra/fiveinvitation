import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function RealisticRomance({ data, guestName }: { data?: any, guestName?: string }) {
  const groom = data?.groom_name || 'Romeo';
  const bride = data?.bride_name || 'Juliet';
  const displayGuest = guestName ? guestName : 'Tamu Undangan yang Terhormat';
  const akadDateStr = data?.akad_date || '2026-12-31T08:00:00';

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [comments, setComments] = useState([
    { id: 1, name: 'Keluarga Besar Bpk. Ahmad', message: 'Selamat menempuh hidup baru, semoga menjadi keluarga yang sakinah mawaddah warahmah.' },
    { id: 2, name: 'Sarah & Budi', message: 'Happy wedding! Wishing you a lifetime of love and happiness.' }
  ]);
  const [newName, setNewName] = useState('');
  const [newMessage, setNewMessage] = useState('');
  
  // Data fallbacks for easily switching with DB data
  const loveStory = data?.story || "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri...";
  const coverImg = data?.cover_image || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2000&auto=format&fit=crop";
  const heroImg = data?.hero_image || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2000&auto=format&fit=crop";
  const gallery1 = data?.gallery_1 || "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000&auto=format&fit=crop";
  const gallery2 = data?.gallery_2 || "https://images.unsplash.com/photo-1544078754-0a3791001a1c?q=80&w=1000&auto=format&fit=crop";
  const bankName1 = data?.bank_name_1 || "BCA";
  const bankAccount1 = data?.bank_account_1 || "1234567890";
  const bankAccountName1 = data?.bank_account_name_1 || groom;
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const { scrollYProgress } = useScroll();
  const yHeroBg = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

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
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => console.log("Audio play blocked"));
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName && newMessage) {
      setComments([{ id: Date.now(), name: newName, message: newMessage }, ...comments]);
      setNewName('');
      setNewMessage('');
    }
  };

  return (
    <div className="relative bg-[#FCFBF8] text-[#5A5A5A] font-serif overflow-x-hidden min-h-screen">
      {/* Background Music */}
      <audio 
        ref={audioRef} 
        loop 
        src="https://assets.mixkit.co/music/preview/mixkit-romantic-ambient-142.mp3" 
      />

      {/* Floating Audio Button */}
      <AnimatePresence>
        {isOpened && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border border-[#E8E1D5] text-[#C5A059]"
            onClick={toggleAudio}
          >
            {isPlaying ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Cover Overlay */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div 
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-50 bg-[#FCFBF8] flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="absolute inset-0 opacity-70">
              <img src={coverImg} className="w-full h-full object-cover" alt="Cover background" />
              <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]" />
            </div>
            
            <div className="relative z-10 max-w-md w-full bg-white/90 backdrop-blur-md p-10 rounded-t-full border border-[#E8E1D5] shadow-2xl">
              <span className="text-sm tracking-[0.3em] uppercase text-[#C5A059] block mb-6 font-sans">The Wedding Of</span>
              <h1 className="text-4xl md:text-5xl font-light mb-6 text-[#4A4A4A]">{groom} & {bride}</h1>
              <div className="w-12 h-px bg-[#C5A059] mx-auto mb-8" />
              <p className="text-sm text-[#888] font-sans uppercase tracking-widest mb-3">Kepada Yth.</p>
              <p className="text-xl font-medium text-[#4A4A4A] mb-10">{displayGuest}</p>
              
              <button 
                onClick={handleOpen}
                className="bg-[#C5A059] text-white px-8 py-3 rounded-full text-sm font-sans tracking-widest uppercase hover:bg-[#B08D4A] transition-colors shadow-lg shadow-[#C5A059]/30"
              >
                Buka Undangan
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`transition-opacity duration-1000 ${isOpened ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'}`}>
        
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <motion.div style={{ y: yHeroBg, backgroundImage: `url('${heroImg}')` }} className="absolute inset-0 bg-cover bg-center opacity-100">
            <div className="absolute inset-0 bg-gradient-to-b from-[#FCFBF8]/40 via-transparent to-[#FCFBF8]" />
          </motion.div>
          
          <motion.div 
             initial={{ opacity: 0, y: 50 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 1.5, delay: 0.5 }}
             viewport={{ once: true }}
             className="relative z-10 text-center mt-32"
          >
             <h2 className="text-6xl md:text-8xl font-light text-white drop-shadow-md mb-4">{groom} & {bride}</h2>
             <p className="text-white text-lg tracking-[0.2em] font-sans uppercase drop-shadow-md">We Are Getting Married</p>
          </motion.div>
        </section>

        {/* Beautiful Quote Section */}
        <section className="py-24 px-6 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <svg className="w-10 h-10 mx-auto text-[#C5A059] mb-8 opacity-50" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/></svg>
            <p className="text-xl md:text-2xl leading-relaxed italic text-[#5A5A5A] mb-8">
              "{loveStory}"
            </p>
            <p className="text-sm font-sans tracking-widest uppercase text-[#C5A059]">( Ar-Rum: 21 )</p>
          </motion.div>
        </section>

        {/* Gallery / Images */}
        <section className="py-12 overflow-hidden px-4 md:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="aspect-[3/4] rounded-t-full overflow-hidden"
            >
              <img src={gallery1} className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" alt="Prewedding 1" />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
              className="aspect-[3/4] rounded-b-full overflow-hidden md:mt-24"
            >
              <img src={gallery2} className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" alt="Prewedding 2" />
            </motion.div>
          </div>
        </section>

        {/* Event Details & Countdown */}
        <section className="py-24 px-6 bg-white relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl text-[#C5A059] mb-4">Save The Date</h2>
              <p className="text-[#888] font-sans mb-16">Kami mengundang Bapak/Ibu/Saudara/i untuk hadir pada acara kami</p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-12 mb-20">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.1 }}
                viewport={{ once: true }}
                className="p-8 border border-[#E8E1D5] bg-[#FCFBF8] rounded-2xl relative"
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white border border-[#E8E1D5] rounded-full flex items-center justify-center text-[#C5A059]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <h3 className="text-2xl mt-4 mb-2">Akad Nikah</h3>
                <div className="w-8 h-px bg-[#C5A059] mx-auto mb-6" />
                <p className="font-sans text-[#5A5A5A] mb-2 font-medium">Minggu, 31 Desember 2026</p>
                <p className="font-sans text-[#888] mb-6">Pukul 08.00 WIB - Selesai</p>
                <p className="font-sans text-[#5A5A5A] text-sm">Masjid Raya Kota<br/>Jl. Sudirman No.1, Jakarta</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                viewport={{ once: true }}
                className="p-8 border border-[#E8E1D5] bg-[#FCFBF8] rounded-2xl relative"
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white border border-[#E8E1D5] rounded-full flex items-center justify-center text-[#C5A059]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2.5 12a9.5 9.5 0 0 1 12.5-9.5V12z"/><path d="M12 2.5a9.5 9.5 0 0 1 9.5 12.5H12z"/><path d="M14 12v9.5A9.5 9.5 0 0 1 12 21.5v-9.5z"/></svg>
                </div>
                <h3 className="text-2xl mt-4 mb-2">Resepsi</h3>
                <div className="w-8 h-px bg-[#C5A059] mx-auto mb-6" />
                <p className="font-sans text-[#5A5A5A] mb-2 font-medium">Minggu, 31 Desember 2026</p>
                <p className="font-sans text-[#888] mb-6">Pukul 11.00 WIB - Selesai</p>
                <p className="font-sans text-[#5A5A5A] text-sm">Grand Ballroom<br/>Jl. Thamrin No.8, Jakarta</p>
              </motion.div>
            </div>

            {/* Moving Realistic Countdown */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="bg-[#C5A059] text-white p-10 rounded-3xl shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
              <h3 className="text-xl mb-8 relative z-10 font-medium">Menuju Hari Bahagia</h3>
              <div className="grid grid-cols-4 gap-4 relative z-10">
                {[
                  { label: "Hari", value: timeLeft.days },
                  { label: "Jam", value: timeLeft.hours },
                  { label: "Menit", value: timeLeft.minutes },
                  { label: "Detik", value: timeLeft.seconds }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl md:text-4xl font-light mb-2 shadow-inner border border-white/20">
                      {item.value}
                    </div>
                    <span className="text-xs uppercase tracking-widest">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Wedding Gift Section */}
        <section className="py-24 px-6 bg-white border-t border-[#E8E1D5]">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl text-[#C5A059] mb-4">Wedding Gift</h2>
              <p className="text-[#888] font-sans mb-12">Bagi keluarga dan sahabat yang ingin memberikan tanda kasih, dapat mengirimkan kado melalui:</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-[#FCFBF8] border border-[#E8E1D5] p-8 rounded-2xl max-w-md mx-auto relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="mb-6 flex justify-center">
                <div className="px-6 py-2 bg-white border border-[#E8E1D5] rounded-full text-[#C5A059] font-bold text-xl tracking-widest shadow-sm">
                  {bankName1}
                </div>
              </div>
              <p className="text-3xl font-light text-[#5A5A5A] mb-2 tracking-wider font-sans">{bankAccount1}</p>
              <p className="text-[#888] font-sans mb-8">a.n. {bankAccountName1}</p>
              
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(bankAccount1);
                  toast.success('Nomor rekening disalin!');
                }}
                className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-[#C5A059] text-[#C5A059] rounded-xl font-sans hover:bg-[#FCFBF8] transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                Salin Rekening
              </button>
            </motion.div>
          </div>
        </section>

        {/* Guestbook / Comments */}
        <section className="py-24 px-6 bg-[#FCFBF8]">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl text-[#C5A059] mb-4">Guestbook</h2>
              <p className="text-[#888] font-sans">Kirimkan doa dan ucapan untuk kami</p>
            </motion.div>

            <motion.form 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
              onSubmit={handleAddComment} 
              className="bg-white p-8 rounded-2xl shadow-sm border border-[#E8E1D5] mb-12 font-sans"
            >
              <div className="mb-4">
                <input 
                  type="text" 
                  placeholder="Nama Lengkap" 
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#E8E1D5] focus:outline-none focus:border-[#C5A059] bg-[#FCFBF8] text-[#5A5A5A]"
                />
              </div>
              <div className="mb-6">
                <textarea 
                  placeholder="Berikan ucapan atau doa..." 
                  required
                  rows={4}
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#E8E1D5] focus:outline-none focus:border-[#C5A059] bg-[#FCFBF8] resize-none text-[#5A5A5A]"
                />
              </div>
              <button type="submit" className="w-full bg-[#C5A059] hover:bg-[#B08D4A] text-white py-3 rounded-lg font-medium transition-colors">
                Kirim Ucapan
              </button>
            </motion.form>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar font-sans">
              <AnimatePresence>
                {comments.map((comment) => (
                  <motion.div 
                    key={comment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-2xl border border-[#E8E1D5] shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-[#FCFBF8] border border-[#E8E1D5] rounded-full flex items-center justify-center text-[#C5A059] font-bold text-lg">
                        {comment.name.charAt(0).toUpperCase()}
                      </div>
                      <h4 className="font-semibold text-[#4A4A4A]">{comment.name}</h4>
                    </div>
                    <p className="text-[#666] leading-relaxed pl-13">{comment.message}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>
        
        <footer className="py-8 text-center bg-[#C5A059] text-white font-sans text-sm">
          <p>© 2026 {groom} & {bride}. Created with FiveInvitation.</p>
        </footer>
      </main>
    </div>
  );
}
