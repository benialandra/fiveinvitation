import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { id as localeId, enUS as localeEn } from 'date-fns/locale';
import SmoothScrollLayout from '../components/Interactive/SmoothScrollLayout';
import AudioController from '../components/Interactive/AudioController';

export default function OceanBreeze({ data, guestName, lang = 'id' }: { data?: any, guestName?: string, lang?: 'id'|'en' }) {
  const groom = data?.groom_name || 'Jason';
  const bride = data?.bride_name || 'Marina';
  const displayGuest = guestName || 'Our Special Guest';
  const akadDateStr = data?.akad_date || '2026-12-31T08:00:00';
  const resepsiDateStr = data?.resepsi_date || '2026-12-31T15:00:00';

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isOpened, setIsOpened] = useState(false);
  
  const [comments, setComments] = useState([
    { id: 1, name: 'Tia & Friends', message: 'Happy wedding guys! Can\'t wait to party at the beach!' }
  ]);
  const [newName, setNewName] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const loveStory = data?.story || "Like the ocean waves crashing onto the shore, our love is a constant, beautiful force of nature.";
  const coverImg = data?.cover_image || "https://images.unsplash.com/photo-1544078754-0a3791001a1c?q=80&w=2000&auto=format&fit=crop"; // Better to use a beach cover
  const heroImg = data?.hero_image || "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=2000&auto=format&fit=crop"; 
  const gallery1 = data?.gallery_1 || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop";
  const gallery2 = data?.gallery_2 || "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=1000&auto=format&fit=crop";
  const bankName1 = data?.bank_name_1 || "BCA";
  const bankAccount1 = data?.bank_account_1 || "0987654321";
  const bankAccountName1 = data?.bank_account_name_1 || groom;

  const currentLocale = lang === 'en' ? localeEn : localeId;

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
      <div className="relative bg-[#f0f9f9] text-[#1e4b5f] font-sans overflow-x-hidden min-h-screen selection:bg-[#208496] selection:text-white">
        {isOpened && <AudioController src={data?.music_url || "https://assets.mixkit.co/music/preview/mixkit-beautiful-dream-493.mp3"} />}

      <AnimatePresence>
        {!isOpened && (
          <motion.div 
            exit={{ opacity: 0, clipPath: 'circle(0% at 50% 50%)' }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-[#e0f2f1] flex flex-col items-center justify-center p-6 text-center overflow-hidden"
            style={{ clipPath: 'circle(150% at 50% 50%)' }}
          >
            <div className="absolute inset-0 z-0">
              <img src={coverImg} className="w-full h-full object-cover opacity-30" alt="Cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#208496]/40 via-[#e0f2f1]/80 to-[#e0f2f1]" />
            </div>
            
            <div className="relative z-10 p-12 bg-white/70 backdrop-blur-md rounded-[3rem] shadow-xl border border-white max-w-sm w-full">
              <div className="w-16 h-16 bg-[#208496]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#208496]">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 12h4l3-9 5 18 3-9h5"/></svg>
              </div>
              <p className="text-xs tracking-[0.2em] uppercase text-[#208496] font-bold mb-4">The Wedding Of</p>
              <h1 className="text-5xl font-light mb-8 text-[#1e4b5f]">{groom} & {bride}</h1>
              
              <div className="bg-white/50 p-4 rounded-xl mb-8">
                <p className="text-xs text-[#208496] uppercase tracking-widest mb-1">Dear Guest</p>
                <p className="text-xl font-semibold text-[#1e4b5f]">{displayGuest}</p>
              </div>
              
              <button 
                onClick={handleOpen}
                className="w-full py-4 bg-[#208496] text-white rounded-full font-bold tracking-widest uppercase text-xs hover:bg-[#1a6e7d] transition-colors shadow-lg shadow-[#208496]/30"
              >
                Open Invitation
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className={`transition-all duration-1000 ${isOpened ? 'opacity-100 visible' : 'opacity-0 invisible h-screen overflow-hidden'}`}>
        
        {/* Wave Top */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] z-20 pointer-events-none">
          <svg className="relative block w-[calc(100%+1.3px)] h-[150px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-[#e0f2f1]"></path>
          </svg>
        </div>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-6">
          <div className="absolute inset-0 z-0">
             <img src={heroImg} className="w-full h-full object-cover" alt="Hero" />
             <div className="absolute inset-0 bg-[#1e4b5f]/40 mix-blend-multiply" />
             <div className="absolute inset-0 bg-gradient-to-t from-[#f0f9f9] to-transparent" />
          </div>
          
          <motion.div 
             initial={{ opacity: 0, y: 50 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 1.5 }}
             viewport={{ once: true }}
             className="relative z-10 text-center max-w-3xl pt-32"
          >
             <h2 className="text-7xl md:text-9xl font-light text-white mb-6 drop-shadow-lg">{groom} & {bride}</h2>
             <p className="text-white text-lg md:text-2xl tracking-[0.2em] font-light uppercase drop-shadow-md">Destination Wedding</p>
          </motion.div>
        </section>

        {/* Story Section */}
        <section className="py-24 px-6 z-10 relative bg-[#f0f9f9]">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="bg-white p-12 md:p-16 rounded-[4rem] shadow-xl border border-[#e0f2f1]"
            >
              <div className="w-20 h-20 bg-[#e0f2f1] rounded-full mx-auto flex items-center justify-center mb-8 text-[#208496]">
                 <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              </div>
              <p className="text-2xl md:text-3xl font-light leading-relaxed text-[#1e4b5f] italic mb-8">
                "{loveStory}"
              </p>
            </motion.div>
          </div>
        </section>

        {/* Schedule & Countdown */}
        <section className="py-24 px-6 z-10 relative bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-4xl md:text-5xl font-light text-[#1e4b5f] mb-4">When & Where</h2>
               <p className="text-[#208496] font-medium tracking-widest uppercase text-sm">Join us by the sea</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-20">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="bg-[#f0f9f9] p-10 rounded-[3rem] text-center"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-[#208496] shadow-sm">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <h3 className="text-3xl font-bold mb-4 text-[#1e4b5f]">Holy Matrimony</h3>
                <p className="text-[#208496] font-bold mb-2">{format(parseISO(akadDateStr), 'EEEE, dd MMMM yyyy', { locale: currentLocale })}</p>
                <p className="text-[#1e4b5f]/70 mb-6">{format(parseISO(akadDateStr), 'HH:mm')} WIB</p>
                <div className="bg-white p-4 rounded-2xl">
                  <p className="text-[#1e4b5f] font-medium text-sm">Beachfront Resort</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-[#f0f9f9] p-10 rounded-[3rem] text-center"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-[#208496] shadow-sm">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </div>
                <h3 className="text-3xl font-bold mb-4 text-[#1e4b5f]">Wedding Reception</h3>
                <p className="text-[#208496] font-bold mb-2">{format(parseISO(resepsiDateStr), 'EEEE, dd MMMM yyyy', { locale: currentLocale })}</p>
                <p className="text-[#1e4b5f]/70 mb-6">{format(parseISO(resepsiDateStr), 'HH:mm')} WIB</p>
                <div className="bg-white p-4 rounded-2xl">
                  <p className="text-[#1e4b5f] font-medium text-sm">{data?.location_name || 'Grand Ballroom Hotel'}</p>
                </div>
              </motion.div>
            </div>

            {/* Countdown */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="bg-[#208496] text-white p-12 rounded-[3rem] text-center shadow-xl relative overflow-hidden"
            >
               <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
               <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#1e4b5f]/20 rounded-full blur-3xl" />
               
               <h3 className="text-2xl font-light mb-10 relative z-10">Countdown to the celebration</h3>
               <div className="grid grid-cols-4 gap-4 relative z-10">
                 {[
                   { label: "Days", value: timeLeft.days },
                   { label: "Hours", value: timeLeft.hours },
                   { label: "Mins", value: timeLeft.minutes },
                   { label: "Secs", value: timeLeft.seconds }
                 ].map((item, idx) => (
                   <div key={idx} className="flex flex-col items-center">
                     <div className="w-16 h-16 md:w-24 md:h-24 bg-white/10 rounded-full flex items-center justify-center text-3xl md:text-5xl font-light mb-4 border border-white/20">
                       {item.value}
                     </div>
                     <span className="text-xs uppercase tracking-[0.2em] font-medium opacity-90">{item.label}</span>
                   </div>
                 ))}
               </div>
            </motion.div>
            
            {data?.maps_link && (
               <div className="mt-16 text-center">
                 <a href={data.maps_link} target="_blank" rel="noreferrer" className="inline-block py-4 px-12 bg-white border-2 border-[#208496] text-[#208496] font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#208496] hover:text-white transition-colors rounded-full shadow-lg shadow-[#208496]/20">
                    Open Google Maps
                 </a>
               </div>
            )}
          </div>
        </section>

        {/* Wedding Gift */}
        <section className="py-24 px-6 z-10 relative bg-[#f0f9f9]">
          <div className="max-w-md mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="bg-white p-10 md:p-12 rounded-[3rem] shadow-xl border border-[#e0f2f1]"
            >
              <h2 className="text-3xl font-bold mb-4 text-[#1e4b5f]">Wedding Gift</h2>
              <p className="text-[#1e4b5f]/70 mb-10 text-sm leading-relaxed">
                Your blessing is our greatest gift. If you wish to send a present, you can use the account below.
              </p>
              
              <div className="bg-[#f0f9f9] rounded-3xl p-6 mb-8 border border-[#e0f2f1]">
                <p className="text-[#208496] font-bold uppercase tracking-widest mb-4">{bankName1}</p>
                <p className="text-3xl font-mono tracking-widest text-[#1e4b5f] mb-4">{bankAccount1}</p>
                <p className="text-[#1e4b5f]/70 text-sm">a.n {bankAccountName1}</p>
              </div>
              
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(bankAccount1);
                  toast.success('Account number copied!');
                }}
                className="w-full py-4 bg-[#208496] text-white rounded-full font-bold tracking-widest uppercase text-xs hover:bg-[#1a6e7d] transition-colors shadow-lg"
              >
                Copy Account Number
              </button>
            </motion.div>
          </div>
        </section>

        {/* Guestbook */}
        <section className="py-24 px-6 z-10 relative bg-white">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-4xl font-light mb-4 text-[#1e4b5f]">Guestbook</h2>
               <p className="text-[#208496] font-medium tracking-widest uppercase text-sm">Leave your wishes</p>
            </div>

            <motion.form 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              onSubmit={handleAddComment} 
              className="bg-[#f0f9f9] p-8 rounded-[3rem] mb-16"
            >
              <div className="mb-4">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full px-6 py-4 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-[#208496] bg-white text-[#1e4b5f]"
                />
              </div>
              <div className="mb-6">
                <textarea 
                  placeholder="Your wishes..." 
                  required
                  rows={4}
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  className="w-full px-6 py-4 rounded-3xl border-none focus:outline-none focus:ring-2 focus:ring-[#208496] bg-white text-[#1e4b5f] resize-none"
                />
              </div>
              <button type="submit" className="w-full bg-[#1e4b5f] text-white py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-slate-800 transition-colors">
                Send Wishes
              </button>
            </motion.form>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
              <AnimatePresence>
                {comments.map((comment) => (
                  <motion.div 
                    key={comment.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-6 rounded-3xl border border-[#e0f2f1] shadow-sm flex gap-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#e0f2f1] text-[#208496] flex items-center justify-center font-bold shrink-0">
                       {comment.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                       <h4 className="font-bold text-[#1e4b5f] text-lg mb-1">{comment.name}</h4>
                       <p className="text-[#1e4b5f]/70 leading-relaxed text-sm">{comment.message}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>
        
        <footer className="py-12 text-center bg-[#1e4b5f] text-white/50 font-sans text-xs tracking-widest uppercase">
          <p>© 2026 {groom} & {bride}. Created with FiveInvitation.</p>
        </footer>
      </main>
    </div>
    </SmoothScrollLayout>
  );
}
