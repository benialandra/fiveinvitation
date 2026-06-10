import React, { useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import SmoothScrollLayout from '../components/Interactive/SmoothScrollLayout';
import AudioController from '../components/Interactive/AudioController';

// Example elegant gold theme
export default function ElegantGold({ data, guestName }: { data?: any, guestName?: string }) {
  const groom = data?.groom_name || 'Romeo';
  const bride = data?.bride_name || 'Juliet';
  const displayGuest = guestName ? `Kepada Yth. ${guestName}` : 'Kepada Yth. Tamu Undangan';
  const [isOpen, setIsOpen] = useState(false);
  
  // Data fallbacks for easily switching with DB data
  const loveStory = data?.story || "Diciptakan-Nya untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.";
  const heroImg = data?.hero_image || "https://images.unsplash.com/photo-1544078754-0a3791001a1c?q=80&w=2000&auto=format&fit=crop";
  const bankName1 = data?.bank_name_1 || "BCA";
  const bankAccount1 = data?.bank_account_1 || "1234567890";
  const bankAccountName1 = data?.bank_account_name_1 || groom;

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <SmoothScrollLayout>
      <div className="min-h-screen bg-black text-rose-50 font-serif overflow-x-hidden relative">
        {isOpen && <AudioController src={data?.music_url || "https://assets.mixkit.co/music/preview/mixkit-beautiful-dream-493.mp3"} />}

        {/* Cover Overlay */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div 
              exit={{ opacity: 0, y: '-100%' }}
              transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
            >
              <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url('${heroImg}')` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              
              <div className="relative z-10 text-center max-w-lg px-6">
                <p className="text-amber-500 font-serif text-xs uppercase tracking-[0.3em] mb-6">The Wedding Of</p>
                <h1 className="text-5xl md:text-7xl font-light tracking-tight text-amber-300 mb-8">{groom} & {bride}</h1>
                <div className="w-12 h-px bg-amber-500/50 mx-auto mb-8" />
                <p className="text-white/60 font-sans text-xs uppercase tracking-widest mb-2">Penerima Tamu</p>
                <p className="text-xl font-light text-white mb-12">{displayGuest}</p>
                
                <button 
                  onClick={() => setIsOpen(true)}
                  className="px-8 py-4 bg-transparent border border-amber-500/50 text-amber-400 font-medium rounded-full uppercase tracking-widest text-xs hover:bg-amber-900/30 transition-colors"
                >
                  Buka Undangan
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      <motion.div style={{ y, backgroundImage: `url('${heroImg}')` }} className="absolute inset-0 opacity-50 bg-cover bg-center" />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="border border-amber-600/50 p-12 lg:p-24 rounded-t-full backdrop-blur-sm bg-black/40"
        >
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-amber-500 uppercase tracking-[0.3em] text-sm mb-6"
          >
            The Wedding Of
          </motion.h3>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-6xl md:text-8xl text-amber-300 font-light mb-8"
          >
            {groom} <br/><span className="text-4xl italic text-white/50">&</span> <br/>{bride}
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 64 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="w-px bg-amber-500/50 mx-auto my-8" 
          />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <p className="text-white/60 tracking-widest uppercase text-sm mb-2">Penerima Tamu</p>
            <p className="text-xl font-sans tracking-wide text-white">{displayGuest}</p>
          </motion.div>
        </motion.div>
      </div>

      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] px-6 py-24 text-center border-t border-amber-900/30">
         <motion.div
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 1.2 }}
           className="max-w-3xl mx-auto"
         >
           <h2 className="text-4xl md:text-5xl text-amber-500 italic mb-12">"Dan di antara tanda-tanda kekuasaan-Nya..."</h2>
           <p className="text-white/70 font-sans tracking-wide leading-relaxed mb-16">
             {loveStory}
           </p>
           
           <div className="grid md:grid-cols-2 gap-16 font-sans text-sm text-white/60 tracking-wide mt-12">
             <motion.div 
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 1, delay: 0.3 }}
               className="p-8 border border-amber-900/40 rounded-3xl bg-black/30"
             >
               <h3 className="text-3xl font-serif text-white mb-6">Akad Nikah</h3>
               <p className="mb-2 text-lg text-amber-300">Minggu, 12 Desember 2026</p>
               <p className="mb-8 text-white/80">08.00 WIB - Selesai</p>
               <p className="text-xs uppercase tracking-widest text-amber-500/70 border-t border-amber-900/40 pt-6">Masjid Raya Kota</p>
             </motion.div>
             
             <motion.div 
               initial={{ opacity: 0, x: 30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 1, delay: 0.5 }}
               className="p-8 border border-amber-900/40 rounded-3xl bg-black/30"
             >
               <h3 className="text-3xl font-serif text-white mb-6">Resepsi</h3>
               <p className="mb-2 text-lg text-amber-300">Minggu, 12 Desember 2026</p>
               <p className="mb-8 text-white/80">11.00 WIB - Selesai</p>
               <p className="text-xs uppercase tracking-widest text-amber-500/70 border-t border-amber-900/40 pt-6">Grand Ballroom Hotel</p>
             </motion.div>
           </div>
         </motion.div>
      </section>
      
      <section className="relative z-10 py-32 bg-black px-6 border-t border-amber-900/30 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-5xl text-amber-500 mb-16 font-light"
          >
            Location
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="aspect-video w-full rounded-2xl overflow-hidden border border-amber-900/40 relative bg-zinc-900 flex items-center justify-center p-8 grayscale hover:grayscale-0 transition-all duration-700"
          >
            <div className="text-white/50 font-sans tracking-widest uppercase text-sm">
              <p className="mb-4 text-amber-500">Maps Integration Here</p>
              <p>Grand Ballroom Hotel</p>
            </div>
            {/* Maps iframe could go here */}
          </motion.div>
        </div>
      </section>
      
      {/* Wedding Gift Section */}
      <section className="relative z-10 py-32 bg-[#050505] px-6 border-t border-amber-900/30 text-center">
        <motion.div
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 1 }}
           className="max-w-2xl mx-auto"
        >
          <h2 className="text-4xl text-amber-500 mb-8 font-light">Wedding Gift</h2>
          <p className="text-white/60 font-sans tracking-wide mb-16">
            Doa dan restu Anda merupakan hadiah yang luar biasa. Namun apabila Anda hendak memberikan tanda kasih, dapat melalui:
          </p>

          <div className="p-8 border border-amber-900/40 rounded-3xl bg-black/40 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl" />
            <h3 className="text-2xl font-bold tracking-widest text-white mb-6 uppercase">{bankName1}</h3>
            <p className="text-3xl font-sans tracking-widest text-amber-400 mb-2">{bankAccount1}</p>
            <p className="text-white/60 font-sans mb-8">a.n. {bankAccountName1}</p>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(bankAccount1);
                toast.success('Nomor rekening disalin!');
              }}
              className="border border-amber-500/50 text-amber-400 px-8 py-3 rounded-full font-sans tracking-widest text-sm hover:bg-amber-950/30 transition-colors"
            >
              SALIN REKENING
            </button>
          </div>
        </motion.div>
      </section>
    </div>
    </SmoothScrollLayout>
  )
}
