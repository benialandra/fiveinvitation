import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import SmoothScrollLayout from '../components/Interactive/SmoothScrollLayout';
import AudioController from '../components/Interactive/AudioController';

export default function RusticVintage({ data, guestName }: { data?: any, guestName?: string }) {
  const groom = data?.groom_name || 'William';
  const bride = data?.bride_name || 'Eleanor';
  const displayGuest = guestName || 'Tamu Undangan Terhormat';
  const akadDateStr = data?.akad_date || '2026-12-31T08:00:00';
  const resepsiDateStr = data?.resepsi_date || '2026-12-31T11:00:00';

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isOpened, setIsOpened] = useState(false);
  const [comments, setComments] = useState([
    { id: 1, name: 'Bude Marni', message: 'Selamat berbahagia anakku, semoga rukun selalu.' },
    { id: 2, name: 'Keluarga Pak RT', message: 'Turut berbahagia atas pernikahan kalian.' }
  ]);
  const [newName, setNewName] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const loveStory = data?.story || "Cinta tidak berupa tatapan satu sama lain, tetapi memandang ke luar bersama ke arah yang sama.";
  const coverImg = data?.cover_image || "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=2000&auto=format&fit=crop";
  const heroImg = data?.hero_image || "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2000&auto=format&fit=crop";
  const gallery1 = data?.gallery_1 || "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000&auto=format&fit=crop";
  const gallery2 = data?.gallery_2 || "https://images.unsplash.com/photo-1544078754-0a3791001a1c?q=80&w=1000&auto=format&fit=crop";
  const bankName1 = data?.bank_name_1 || "Mandiri";
  const bankAccount1 = data?.bank_account_1 || "1122334455";
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
    }
  };

  return (
    <SmoothScrollLayout>
      <div className="relative bg-[#f8f5f0] text-[#5c4a3d] font-serif overflow-x-hidden min-h-screen selection:bg-[#8b7355] selection:text-white">
        {isOpened && <AudioController src={data?.music_url || "https://assets.mixkit.co/music/preview/mixkit-acoustic-guitar-wedding-145.mp3"} />}

      <AnimatePresence>
        {!isOpened && (
          <motion.div 
            exit={{ y: '-100%' }}
            transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1] }}
            className="fixed inset-0 z-50 bg-[#f8f5f0] flex flex-col items-center justify-center p-6 text-center"
          >
            {/* Vintage Frame Border */}
            <div className="absolute inset-4 border border-[#8b7355] opacity-30 pointer-events-none" />
            <div className="absolute inset-6 border border-[#8b7355] opacity-10 pointer-events-none" />
            
            <div className="absolute inset-0 z-0">
              <img src={coverImg} className="w-full h-full object-cover sepia-[0.3] opacity-60" alt="Cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#f8f5f0] via-[#f8f5f0]/80 to-transparent" />
            </div>
            
            <div className="relative z-10 max-w-sm w-full bg-[#f8f5f0]/95 backdrop-blur-sm p-12 rounded-t-[50%] border-t-2 border-x-2 border-[#8b7355]/30 shadow-xl mt-32">
              <p className="text-xs tracking-[0.3em] uppercase text-[#8b7355] mb-6">Pernikahan</p>
              <h1 className="text-5xl font-normal mb-8 text-[#5c4a3d] italic">{groom} <br/><span className="text-2xl font-sans text-[#8b7355]">&</span><br/> {bride}</h1>
              
              <div className="w-16 h-px bg-[#8b7355]/40 mx-auto mb-8" />
              
              <div className="mb-8">
                <p className="text-xs text-[#8b7355]/70 uppercase tracking-widest mb-3">Kepada Yth:</p>
                <p className="text-2xl font-medium text-[#5c4a3d] border-b border-[#8b7355]/30 inline-block pb-1 px-4">{displayGuest}</p>
              </div>
              
              <button 
                onClick={handleOpen}
                className="w-full py-4 bg-[#8b7355] text-[#f8f5f0] rounded-sm font-medium tracking-widest uppercase text-xs hover:bg-[#5c4a3d] transition-colors"
              >
                Buka Undangan
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className={`transition-all duration-1000 ${isOpened ? 'opacity-100 visible' : 'opacity-0 invisible h-screen overflow-hidden'}`}>
        
        {/* Frame Border on entire site */}
        <div className="fixed inset-4 border border-[#8b7355]/20 pointer-events-none z-50 pointer-events-none" />
        
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-10 px-6">
          <div className="absolute inset-0 z-0">
             <img src={heroImg} className="w-full h-full object-cover sepia-[0.2]" alt="Hero" />
             <div className="absolute inset-0 bg-[#f8f5f0]/40" />
             <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#f8f5f0] to-transparent" />
          </div>
          
          <motion.div 
             initial={{ opacity: 0, y: 50 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 1.5 }}
             viewport={{ once: true }}
             className="relative z-10 text-center bg-[#f8f5f0]/90 p-12 md:p-24 border border-[#8b7355]/30 max-w-2xl"
          >
             <p className="text-[#8b7355] text-sm tracking-[0.4em] uppercase mb-8 border-b border-[#8b7355]/20 inline-block pb-2">We Are Getting Married</p>
             <h2 className="text-6xl md:text-8xl font-normal text-[#5c4a3d] mb-8">{groom} <br/><span className="text-3xl text-[#8b7355] italic">&</span><br/> {bride}</h2>
             <p className="text-[#5c4a3d]/70 text-lg font-light italic max-w-lg mx-auto">"{loveStory}"</p>
          </motion.div>
        </section>

        {/* Profiles */}
        <section className="py-24 px-6 z-10 relative bg-[#f8f5f0]">
          <div className="max-w-4xl mx-auto flex flex-col gap-24">
            
            {/* Groom */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-center gap-10 md:gap-16"
            >
               <div className="w-64 h-80 rounded-t-full overflow-hidden border-4 border-[#e6dfd5] shadow-lg shrink-0">
                 <img src={gallery1} className="w-full h-full object-cover sepia-[0.1]" alt="Groom" />
               </div>
               <div className="text-center md:text-left">
                  <p className="text-sm tracking-[0.2em] uppercase text-[#8b7355] mb-2">The Groom</p>
                  <h3 className="text-4xl md:text-5xl font-bold mb-6 text-[#5c4a3d]">{groom}</h3>
                  <p className="text-[#5c4a3d]/70 leading-relaxed mb-6">
                    Merupakan putra kebanggaan dari keluarga:<br/>
                    <span className="font-bold text-[#5c4a3d] block mt-2 text-xl">{data?.groom_parents || 'Bpk. Hendra & Ibu Susi'}</span>
                  </p>
               </div>
            </motion.div>

            {/* Divider */}
            <div className="flex justify-center text-[#8b7355]/30">
               <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>

            {/* Bride */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16"
            >
               <div className="w-64 h-80 rounded-t-full overflow-hidden border-4 border-[#e6dfd5] shadow-lg shrink-0">
                 <img src={gallery2} className="w-full h-full object-cover sepia-[0.1]" alt="Bride" />
               </div>
               <div className="text-center md:text-right">
                  <p className="text-sm tracking-[0.2em] uppercase text-[#8b7355] mb-2">The Bride</p>
                  <h3 className="text-4xl md:text-5xl font-bold mb-6 text-[#5c4a3d]">{bride}</h3>
                  <p className="text-[#5c4a3d]/70 leading-relaxed mb-6">
                    Merupakan putri tercinta dari keluarga:<br/>
                    <span className="font-bold text-[#5c4a3d] block mt-2 text-xl">{data?.bride_parents || 'Bpk. Budi & Ibu Ani'}</span>
                  </p>
               </div>
            </motion.div>
          </div>
        </section>

        {/* Schedule & Countdown */}
        <section className="py-24 px-6 z-10 relative bg-[#e6dfd5]/30 border-y border-[#8b7355]/20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
               <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#5c4a3d] italic">Save The Date</h2>
               <div className="w-24 h-px bg-[#8b7355] mx-auto" />
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 mb-20">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="bg-[#f8f5f0] p-12 text-center border border-[#8b7355]/20 relative"
              >
                <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-[#8b7355]" />
                <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-[#8b7355]" />
                
                <h3 className="text-3xl font-bold mb-6 text-[#5c4a3d]">Akad Nikah</h3>
                <p className="text-5xl font-light mb-4 text-[#8b7355]">{format(parseISO(akadDateStr), 'dd')}</p>
                <p className="text-xl tracking-widest uppercase mb-4 text-[#5c4a3d]">{format(parseISO(akadDateStr), 'MMMM yyyy', { locale: localeId })}</p>
                <p className="text-[#5c4a3d]/80 mb-8 border-y border-[#8b7355]/20 py-2 inline-block">Pukul {format(parseISO(akadDateStr), 'HH:mm')} WIB</p>
                <div className="bg-[#e6dfd5]/50 p-4">
                  <p className="font-medium text-[#5c4a3d] uppercase tracking-widest text-xs mb-2">Lokasi</p>
                  <p className="text-[#5c4a3d]/70 text-sm">Masjid Raya<br/>Jl. Jendral Sudirman</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-[#f8f5f0] p-12 text-center border border-[#8b7355]/20 relative"
              >
                <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-[#8b7355]" />
                <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-[#8b7355]" />
                
                <h3 className="text-3xl font-bold mb-6 text-[#5c4a3d]">Resepsi</h3>
                <p className="text-5xl font-light mb-4 text-[#8b7355]">{format(parseISO(resepsiDateStr), 'dd')}</p>
                <p className="text-xl tracking-widest uppercase mb-4 text-[#5c4a3d]">{format(parseISO(resepsiDateStr), 'MMMM yyyy', { locale: localeId })}</p>
                <p className="text-[#5c4a3d]/80 mb-8 border-y border-[#8b7355]/20 py-2 inline-block">Pukul {format(parseISO(resepsiDateStr), 'HH:mm')} WIB</p>
                <div className="bg-[#e6dfd5]/50 p-4">
                  <p className="font-medium text-[#5c4a3d] uppercase tracking-widest text-xs mb-2">Lokasi</p>
                  <p className="text-[#5c4a3d]/70 text-sm">{data?.location_name || 'Gedung Pertemuan Graha'}</p>
                </div>
              </motion.div>
            </div>

            {/* Countdown */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="bg-[#8b7355] text-[#f8f5f0] p-12 text-center max-w-3xl mx-auto border-4 border-[#e6dfd5]"
            >
               <h3 className="text-2xl mb-10 italic">Menghitung Hari</h3>
               <div className="grid grid-cols-4 gap-4">
                 {[
                   { label: "Hari", value: timeLeft.days },
                   { label: "Jam", value: timeLeft.hours },
                   { label: "Menit", value: timeLeft.minutes },
                   { label: "Detik", value: timeLeft.seconds }
                 ].map((item, idx) => (
                   <div key={idx} className="flex flex-col items-center">
                     <div className="text-4xl md:text-6xl font-light mb-2">{item.value}</div>
                     <span className="text-xs uppercase tracking-[0.2em] opacity-80">{item.label}</span>
                   </div>
                 ))}
               </div>
            </motion.div>
            
            {data?.maps_link && (
               <div className="mt-16 text-center">
                 <a href={data.maps_link} target="_blank" rel="noreferrer" className="inline-block py-4 px-12 border-2 border-[#8b7355] text-[#8b7355] font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#8b7355] hover:text-white transition-colors">
                    Lihat Peta Lokasi
                 </a>
               </div>
            )}
          </div>
        </section>

        {/* Wedding Gift */}
        <section className="py-24 px-6 z-10 relative bg-[#f8f5f0]">
          <div className="max-w-xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="p-12 border border-[#8b7355]/30 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]"
            >
              <h2 className="text-4xl font-bold mb-6 text-[#5c4a3d] italic">Wedding Gift</h2>
              <p className="text-[#5c4a3d]/80 mb-10 leading-relaxed">
                Tanpa mengurangi rasa hormat, bagi Bapak/Ibu/Saudara/i yang ingin memberikan tanda kasih untuk kami, dapat melalui:
              </p>
              
              <div className="bg-white/50 p-8 border border-[#8b7355]/20 mb-8">
                <p className="text-[#8b7355] font-bold uppercase tracking-widest mb-4 text-xl">{bankName1}</p>
                <p className="text-4xl font-light tracking-widest text-[#5c4a3d] mb-4">{bankAccount1}</p>
                <p className="text-[#5c4a3d]/70 text-lg">a.n {bankAccountName1}</p>
              </div>
              
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(bankAccount1);
                  toast.success('Nomor rekening disalin!');
                }}
                className="w-full py-4 bg-[#5c4a3d] text-white font-semibold tracking-widest uppercase text-xs hover:bg-[#8b7355] transition-colors"
              >
                Salin Nomor Rekening
              </button>
            </motion.div>
          </div>
        </section>

        {/* Guestbook */}
        <section className="py-24 px-6 z-10 relative bg-[#e6dfd5]/50 border-t border-[#8b7355]/20">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-4xl font-bold mb-4 text-[#5c4a3d] italic">Buku Tamu</h2>
               <div className="w-16 h-px bg-[#8b7355] mx-auto" />
            </div>

            <motion.form 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              onSubmit={handleAddComment} 
              className="bg-[#f8f5f0] p-10 border border-[#8b7355]/30 mb-16 shadow-lg"
            >
              <div className="mb-6">
                <input 
                  type="text" 
                  placeholder="Nama Anda" 
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full px-4 py-4 border-b-2 border-[#e6dfd5] focus:outline-none focus:border-[#8b7355] bg-transparent text-[#5c4a3d] placeholder-[#5c4a3d]/40 font-sans"
                />
              </div>
              <div className="mb-10">
                <textarea 
                  placeholder="Ucapan & Doa..." 
                  required
                  rows={3}
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  className="w-full px-4 py-4 border-b-2 border-[#e6dfd5] focus:outline-none focus:border-[#8b7355] bg-transparent text-[#5c4a3d] placeholder-[#5c4a3d]/40 font-sans resize-none"
                />
              </div>
              <button type="submit" className="w-full bg-transparent border-2 border-[#8b7355] text-[#8b7355] py-4 font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#8b7355] hover:text-white transition-colors">
                Kirim Ucapan
              </button>
            </motion.form>

            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
              <AnimatePresence>
                {comments.map((comment) => (
                  <motion.div 
                    key={comment.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#f8f5f0] p-8 border-l-4 border-[#8b7355] shadow-sm"
                  >
                    <h4 className="font-bold text-[#5c4a3d] text-lg mb-2">{comment.name}</h4>
                    <p className="text-[#5c4a3d]/80 leading-relaxed font-sans">{comment.message}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>
        <footer className="py-12 text-center bg-[#5c4a3d] text-[#e6dfd5] font-sans text-xs tracking-widest uppercase">
          <p>© 2026 {groom} & {bride}. Created with FiveInvitation.</p>
        </footer>
      </main>
    </div>
    </SmoothScrollLayout>
  );
}
