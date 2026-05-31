import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import toast from 'react-hot-toast';

export default function DarkPremium({ data, guestName }: { data?: any, guestName?: string }) {
  const groom = data?.groom_name || 'Kevin';
  const bride = data?.bride_name || 'Clara';
  const displayGuest = guestName || 'Our Respected Guest';

  const mapImg = data?.map_image || "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop";
  const heroImg = data?.hero_image; // Allow custom hero image or keep dark theme default
  const bankName1 = data?.bank_name_1 || "BCA";
  const bankAccount1 = data?.bank_account_1 || "1234567890";
  const bankAccountName1 = data?.bank_account_name_1 || groom;
  
  const { scrollYProgress } = useScroll();
  const opacityMain = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans tracking-tight overflow-x-hidden selection:bg-indigo-500/30">
      <motion.div style={{ opacity: opacityMain }} className="h-screen w-full flex flex-col justify-between p-8 md:p-16 relative">
        {heroImg ? (
           <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: `url('${heroImg}')` }} />
        ) : (
           <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-900/10 to-transparent pointer-events-none" />
        )}
        
        <header className="flex justify-between items-center text-sm font-medium uppercase tracking-widest text-slate-500 z-10 w-full">
          <motion.span initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>{groom} & {bride}</motion.span>
          <motion.span initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}>Chapter I</motion.span>
        </header>

        <main className="max-w-4xl z-10">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-6xl md:text-9xl font-bold tracking-tighter text-white mb-4 leading-none"
          >
            We Are <br/>
            Getting <br/>
            Married.
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-12 p-6 border-l-2 border-indigo-500 bg-white/5 backdrop-blur-md rounded-r-2xl"
          >
            <p className="text-slate-400 font-mono uppercase tracking-widest text-xs mb-2">Exclusive Invitation For</p>
            <p className="text-2xl font-light text-white">{displayGuest}</p>
          </motion.div>
        </main>
        
        <footer className="text-slate-500 font-mono flex justify-between items-end text-xs uppercase tracking-widest z-10 w-full">
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1 }}>2026 / 12 / 12</motion.div>
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.2 }}>DKI Jakarta</motion.div>
        </footer>
      </motion.div>

      {/* The Details Section */}
      <section className="min-h-screen py-24 px-8 md:px-16 flex items-center bg-slate-900 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/20 rounded-full blur-[100px]" />
        
        <div className="max-w-5xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-sm font-mono text-indigo-400 uppercase tracking-widest mb-4">01 . The Details</h2>
            <h3 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-8">Save The Date</h3>
            <p className="text-slate-400 leading-relaxed text-lg mb-8">
              Join us in witnessing the beginning of our new journey together. A celebration of love, commitment, and our shared future.
            </p>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="p-8 bg-slate-950/50 rounded-3xl border border-slate-800 hover:border-indigo-500/50 transition-colors"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-2xl font-bold text-white mb-1">Holy Matrimony</h4>
                  <p className="text-slate-400 font-mono text-sm">Ceremony</p>
                </div>
                <div className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center text-xs font-mono">08:00</div>
              </div>
              <div className="w-full h-px bg-slate-800 mb-6" />
              <p className="text-slate-300">Sunday, Dec 12 2026</p>
              <p className="text-slate-500 text-sm mt-2">Cathedral Church, Jakarta</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="p-8 bg-slate-950/50 rounded-3xl border border-slate-800 hover:border-indigo-500/50 transition-colors"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-2xl font-bold text-white mb-1">Wedding Reception</h4>
                  <p className="text-slate-400 font-mono text-sm">Celebration</p>
                </div>
                <div className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center text-xs font-mono">11:00</div>
              </div>
              <div className="w-full h-px bg-slate-800 mb-6" />
              <p className="text-slate-300">Sunday, Dec 12 2026</p>
              <p className="text-slate-500 text-sm mt-2">The Ritz-Carlton, Pacific Place</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Location Section */}
      <section className="py-32 px-8 md:px-16 bg-slate-950 flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center max-w-2xl mb-16"
        >
          <h2 className="text-sm font-mono text-indigo-400 uppercase tracking-widest mb-4">02 . Location</h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Getting There</h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="w-full max-w-5xl aspect-[21/9] bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden relative group"
        >
          <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity duration-1000 grayscale group-hover:grayscale-0" style={{ backgroundImage: `url('${mapImg}')` }} />
          
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full flex flex-col md:flex-row justify-between items-end">
            <div>
              <p className="text-indigo-400 font-mono text-sm mb-2 uppercase tracking-widest">Grand Ballroom</p>
              <h4 className="text-3xl text-white font-bold mb-2">The Ritz-Carlton</h4>
              <p className="text-slate-400">Sudirman Central Business District (SCBD)</p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 md:mt-0 px-8 py-4 bg-white text-slate-950 font-medium rounded-full uppercase tracking-widest text-xs hover:bg-indigo-500 hover:text-white transition-colors"
            >
              Open Maps
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Gift Section */}
      <section className="py-24 px-8 md:px-16 bg-slate-900 flex flex-col items-center justify-center border-t border-slate-800 relative overflow-hidden">
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[120px] -translate-y-1/2" />
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center max-w-2xl mb-16 relative z-10"
        >
          <h2 className="text-sm font-mono text-indigo-400 uppercase tracking-widest mb-4">03 . Wedding Gift</h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">Send a Gift</h3>
          <p className="text-slate-400 text-lg">Your presence is our biggest preset. But if you wish to send a gift, you can use the account below.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="w-full max-w-md bg-slate-950/50 p-8 rounded-3xl border border-slate-800 text-center relative z-10 backdrop-blur-sm"
        >
          <div className="text-indigo-400 font-bold tracking-widest text-xl mb-4">{bankName1}</div>
          <div className="text-3xl text-white font-mono tracking-widest mb-2">{bankAccount1}</div>
          <div className="text-slate-500 text-sm mb-8">{bankAccountName1}</div>
          
          <button 
             onClick={() => {
                navigator.clipboard.writeText(bankAccount1);
                toast.success('Account number copied to clipboard!');
             }}
             className="w-full py-4 bg-slate-800 text-white font-medium rounded-xl hover:bg-indigo-500 transition-colors uppercase tracking-widest text-xs"
          >
             Copy Number
          </button>
        </motion.div>
      </section>
    </div>
  )
}
