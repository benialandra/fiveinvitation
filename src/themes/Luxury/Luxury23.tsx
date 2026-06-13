import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import SmoothScrollLayout from '../../components/Interactive/SmoothScrollLayout';
import AudioController from '../../components/Interactive/AudioController';
import RSVP from '../../components/Theme/RSVP';
import Story from '../../components/Theme/Story';

export default function GlassmorphismElegance({ data, guestName }: { data?: any, guestName?: string }) {
  const groom = data?.groom_name || 'Alvaro';
  const bride = data?.bride_name || 'Biana';
  const displayGuest = guestName ? guestName : 'Our Beloved Guest';
  const akadDateStr = data?.akad_date || '2026-12-31T08:00:00';

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isOpened, setIsOpened] = useState(false);
  const [comments, setComments] = useState([
    { id: 1, name: 'Tante Sarah', message: 'Happy wedding! Semoga lancar sampai hari H ya.' },
    { id: 2, name: 'Reza & Partner', message: 'Selamat ya bro! Akhirnya melepas masa lajang.' }
  ]);
  const [newName, setNewName] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const loveStory = data?.story || "We found each other in the most unexpected way, and our journey has been nothing short of magical.";
  const coverImg = data?.cover_image || "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=60&w=2000&auto=format&fit=crop&fm=webp&q=60";
  const heroImg = data?.hero_image || "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=60&w=2000&auto=format&fit=crop&fm=webp&q=60";
  const groomImg = data?.groom_image || data?.gallery_1 || "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=60&w=1000&auto=format&fit=crop&fm=webp&q=60";
  const brideImg = data?.bride_image || data?.gallery_2 || "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=60&w=1000&auto=format&fit=crop&fm=webp&q=60";
  const bankName1 = data?.bank_name_1 || "BCA";
  const bankAccount1 = data?.bank_account_1 || "0987654321";
  const bankAccountName1 = data?.bank_account_name_1 || groom;

  const { scrollYProgress } = useScroll();
  const yHeroBg = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacityMain = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

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
      <div className="relative bg-slate-900 text-slate-100 font-sans overflow-x-hidden min-h-screen selection:bg-purple-500/40">
        {isOpened && <AudioController src={data?.music_url || "https://assets.mixkit.co/music/preview/mixkit-beautiful-dream-493.mp3"} />}

      {/* Floating Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
         <motion.div 
           animate={{ 
             y: [0, -50, 0],
             x: [0, 30, 0],
             rotate: [0, 10, -10, 0]
           }}
           transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
           className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px]"
         />
         <motion.div 
           animate={{ 
             y: [0, 80, 0],
             x: [0, -40, 0],
             rotate: [0, -15, 10, 0]
           }}
           transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
           className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[150px]"
         />
      </div>

      <AnimatePresence>
        {!isOpened && (
          <motion.div 
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="absolute inset-0 z-0">
              <img src={coverImg} className="w-full h-full object-cover grayscale opacity-40" alt="Cover background" />
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            </div>
            
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="relative z-10 max-w-sm w-full bg-white/5 backdrop-blur-xl p-10 rounded-3xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
            >
              <p className="text-xs tracking-[0.4em] uppercase text-purple-300 mb-6 font-medium">The Wedding Of</p>
              <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white tracking-tight">{groom} & {bride}</h1>
              
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-8 backdrop-blur-md">
                <p className="text-xs text-slate-300 uppercase tracking-widest mb-2">Dear Guest</p>
                <p className="text-xl font-medium text-white">{displayGuest}</p>
              </div>
              
              <button 
                onClick={handleOpen}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold tracking-widest uppercase text-xs hover:from-purple-400 hover:to-indigo-400 transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)]"
              >
                Open Invitation
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className={`transition-all duration-1000 ${isOpened ? 'opacity-100 visible' : 'opacity-0 invisible h-screen overflow-hidden'}`}>
        
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center pt-20 pb-10 px-6 z-10">
          <motion.div 
             initial={{ opacity: 0, y: 50 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 1.5 }}
             viewport={{ once: true }}
             className="text-center w-full max-w-4xl bg-white/5 backdrop-blur-xl border border-white/10 p-12 md:p-24 rounded-[3rem] shadow-2xl relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px]" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]" />
             
             <p className="relative z-10 text-purple-300 text-sm font-semibold tracking-[0.3em] uppercase mb-8">We Are Getting Married</p>
             <h2 className="relative z-10 text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 mb-8">{groom} & {bride}</h2>
             <p className="relative z-10 text-slate-400 text-lg md:text-xl font-light italic max-w-2xl mx-auto">"{loveStory}"</p>
          </motion.div>
        </section>

        {/* Profiles */}
        <section className="py-24 px-6 z-10 relative">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            <motion.div 
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 1 }}
               viewport={{ once: true }}
               className="flex flex-col items-center bg-white/5 backdrop-blur-lg border border-white/10 p-10 rounded-[3rem]"
             >
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white/10 mb-8 p-2">
                  <img src={groomImg} className="w-full h-full object-cover rounded-full" alt="Groom" />
                </div>
                <h3 className="text-3xl font-bold mb-2">{groom}</h3>
                <p className="text-slate-400 text-sm uppercase tracking-widest text-center">Son of<br/><span className="text-white font-medium">{data?.groom_parents || 'Bpk. Hendra & Ibu Susi'}</span></p>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, x: 50 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 1, delay: 0.2 }}
               viewport={{ once: true }}
               className="flex flex-col items-center bg-white/5 backdrop-blur-lg border border-white/10 p-10 rounded-[3rem]"
             >
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white/10 mb-8 p-2">
                  <img src={brideImg} className="w-full h-full object-cover rounded-full" alt="Bride" />
                </div>
               <h3 className="text-3xl font-bold mb-2">{bride}</h3>
               <p className="text-slate-400 text-sm uppercase tracking-widest text-center">Daughter of<br/><span className="text-white font-medium">{data?.bride_parents || 'Bpk. Budi & Ibu Ani'}</span></p>
            </motion.div>
          </div>
        </section>

        {/* Glass Countdown */}
        <section className="py-12 px-6 z-10 relative">
           <div className="max-w-4xl mx-auto">
             <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 1 }}
               viewport={{ once: true }}
               className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-white/20 p-10 rounded-[2rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] text-center"
             >
               <h3 className="text-xl font-medium mb-8 text-purple-200">Countdown to The Day</h3>
               <div className="grid grid-cols-4 gap-4 md:gap-8">
                 {[
                   { label: "Days", value: timeLeft.days },
                   { label: "Hours", value: timeLeft.hours },
                   { label: "Mins", value: timeLeft.minutes },
                   { label: "Secs", value: timeLeft.seconds }
                 ].map((item, idx) => (
                   <div key={idx} className="flex flex-col items-center">
                     <div className="w-16 h-16 md:w-24 md:h-24 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-3xl md:text-5xl font-black mb-3 text-white shadow-inner">
                       {item.value}
                     </div>
                     <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">{item.label}</span>
                   </div>
                 ))}
               </div>
             </motion.div>
           </div>
        </section>

        {/* Schedule */}
        <section className="py-24 px-6 z-10 relative">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-4xl md:text-5xl font-bold mb-4">Event Details</h2>
               <p className="text-slate-400">Join us in celebrating our special day.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-lg border border-white/10 p-10 rounded-3xl hover:bg-white/10 transition-colors"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 className="text-3xl font-bold mb-4 text-white">Holy Matrimony</h3>
                <p className="text-purple-300 font-medium mb-1">Sunday, Dec 31 2026</p>
                <p className="text-slate-400 mb-6">08.00 WIB - 10.00 WIB</p>
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                  <p className="text-sm font-medium text-white mb-1">Location Venue</p>
                  <p className="text-slate-400 text-sm">Masjid Raya, Jl. Sudirman</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-lg border border-white/10 p-10 rounded-3xl hover:bg-white/10 transition-colors"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"></path></svg>
                </div>
                <h3 className="text-3xl font-bold mb-4 text-white">Wedding Reception</h3>
                <p className="text-purple-300 font-medium mb-1">Sunday, Dec 31 2026</p>
                <p className="text-slate-400 mb-6">11.00 WIB - 14.00 WIB</p>
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                  <p className="text-sm font-medium text-white mb-1">Location Venue</p>
                  <p className="text-slate-400 text-sm">{data?.location_name || 'Grand Ballroom Hotel'}</p>
                </div>
              </motion.div>
            </div>
            
            {data?.maps_link && (
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 className="mt-12 text-center"
               >
                 <a href={data.maps_link} target="_blank" rel="noreferrer" className="inline-block py-4 px-10 bg-white text-slate-900 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                    Open Google Maps
                 </a>
               </motion.div>
            )}
          </div>
        </section>

        {/* Wedding Gift */}
        <section className="py-24 px-6 z-10 relative bg-slate-950/50">
          <div className="max-w-md mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem]"
            >
              <div className="w-16 h-16 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h2 className="text-3xl font-bold mb-4 text-white">Wedding Gift</h2>
              <p className="text-slate-400 text-sm mb-8">Your blessing is our greatest gift. If you wish to send a present, you can use the account below.</p>
              
              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 mb-6">
                <p className="text-purple-400 font-bold uppercase tracking-widest mb-2">{bankName1}</p>
                <p className="text-3xl font-mono tracking-widest text-white mb-2">{bankAccount1}</p>
                <p className="text-slate-400 text-sm">a.n {bankAccountName1}</p>
              </div>
              
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(bankAccount1);
                  toast.success('Account number copied!');
                }}
                className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors font-semibold tracking-widest uppercase text-xs text-white"
              >
                Copy Account Number
              </button>
            </motion.div>
          </div>
        </section>

        {/* Glass Guestbook */}
        <section className="py-24 px-6 z-10 relative">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
               <h2 className="text-4xl md:text-5xl font-bold mb-4">Guestbook</h2>
               <p className="text-slate-400">Leave a wish for the bride and groom.</p>
            </div>

            <motion.form 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              onSubmit={handleAddComment} 
              className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 mb-12"
            >
              <div className="mb-4">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl border border-white/10 focus:outline-none focus:border-purple-500 bg-white/5 text-white placeholder-slate-400"
                />
              </div>
              <div className="mb-6">
                <textarea 
                  placeholder="Your wishes..." 
                  required
                  rows={4}
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl border border-white/10 focus:outline-none focus:border-purple-500 bg-white/5 text-white placeholder-slate-400 resize-none"
                />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity">
                Send Wishes
              </button>
            </motion.form>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence>
                {comments.map((comment) => (
                  <motion.div 
                    key={comment.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {comment.name.charAt(0).toUpperCase()}
                      </div>
                      <h4 className="font-bold text-white text-lg">{comment.name}</h4>
                    </div>
                    <p className="text-slate-300 pl-16 leading-relaxed">{comment.message}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>
        
        
          {/* Auto-injected missing sections */}
          <div className="w-full relative z-20">
            <RSVP data={data} lang="id" />
          </div>
          <footer className="py-10 text-center border-t border-white/10 text-slate-500 text-sm bg-slate-950">
          <p>© 2026 {groom} & {bride}. Crafted with FiveInvitation.</p>
        </footer>
      
          {/* Auto-injected missing sections */}
          <div className="w-full relative z-20">
            <Story data={data} lang={typeof lang !== 'undefined' ? lang : "id"} />
          </div>
        </main>
    </div>
    </SmoothScrollLayout>
  );
}
