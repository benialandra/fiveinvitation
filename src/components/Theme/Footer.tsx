import React from 'react';
import { motion } from 'framer-motion';

export default function Footer({ data, lang = 'id' }: any) {
  const groom = data?.groom_name || 'Groom';
  const bride = data?.bride_name || 'Bride';
  
  return (
    <footer className="py-24 text-center text-white/50 text-xs uppercase tracking-[0.4em] bg-black w-full relative z-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <p className="mb-4 text-[#D4AF37] font-serif italic text-lg capitalize">Terima Kasih</p>
        <p className="mb-8">Thank you for your warm wishes and blessings.</p>
        <p className="text-white/80">{groom} & {bride}</p>
        <p className="mt-8 opacity-40 text-[10px]">&copy; {new Date().getFullYear()} FiveInvitation. All Rights Reserved.</p>
      </motion.div>
    </footer>
  );
}
