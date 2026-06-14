import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../supabase/supabase';

export interface SharedRSVPProps {
  orderId?: string | number;
  uniqueCode?: string;
  colors?: {
    primary?: string;
    text?: string;
    background?: string;
    accent?: string;
  };
  fonts?: {
    heading?: string;
    body?: string;
  };
  labels?: {
    title?: string;
    subtitle?: string;
    namePlaceholder?: string;
    wishesPlaceholder?: string;
    attending?: string;
    notAttending?: string;
    tentative?: string;
    submitText?: string;
  };
  className?: string;
}

const SharedRSVP = memo<SharedRSVPProps>(({
  orderId,
  uniqueCode,
  colors = { primary: '#c5a059', text: '#333333', background: '#fcfcfc', accent: '#f5f5f5' },
  fonts = { heading: 'serif', body: 'sans-serif' },
  labels = {
    title: 'RSVP & Ucapan',
    subtitle: 'Kehadiran dan doa restu Anda sangat berarti bagi kami.',
    namePlaceholder: 'Nama Lengkap Anda',
    wishesPlaceholder: 'Tuliskan ucapan dan doa...',
    attending: 'Hadir',
    notAttending: 'Tidak Hadir',
    tentative: 'Ragu-ragu',
    submitText: 'Kirim RSVP'
  },
  className = ''
}) => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('ATTENDING');
  const [guestCount, setGuestCount] = useState(1);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId && !uniqueCode) {
      toast.success("Pratinjau: Terima kasih atas RSVP & Ucapan Anda!");
      setName('');
      setMessage('');
      return;
    }

    setIsSubmitting(true);
    try {
      if (orderId) {
        await supabase.from('rsvp').insert([{
          order_id: orderId,
          guest_name: name,
          status: status,
          guest_count: guestCount
        }]);

        await supabase.from('guest_books').insert([{
          order_id: orderId,
          sender_name: name,
          message: message
        }]);
        toast.success("RSVP dan ucapan berhasil dikirim!");
        setName('');
        setMessage('');
      } else {
        toast.success("Pratinjau: Terima kasih atas RSVP & Ucapan Anda!");
      }
    } catch (err) {
      toast.error("Gagal mengirim RSVP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={`py-24 px-6 w-full ${className}`} style={{ backgroundColor: colors.accent }}>
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true }} 
        transition={{ duration: 0.8 }} 
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          {labels.title && (
            <h2 className="text-4xl md:text-5xl mb-4" style={{ fontFamily: fonts.heading, color: colors.primary }}>
              {labels.title}
            </h2>
          )}
          {labels.subtitle && (
            <p className="opacity-80 max-w-xl mx-auto leading-relaxed" style={{ color: colors.text, fontFamily: fonts.body }}>
              {labels.subtitle}
            </p>
          )}
        </div>

        <form 
          className="max-w-xl mx-auto p-8 md:p-10 rounded-3xl border relative overflow-hidden shadow-xl" 
          style={{ backgroundColor: colors.background, borderColor: colors.primary ? `${colors.primary}30` : '#e5e5e5' }} 
          onSubmit={handleSubmit}
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: colors.primary }}></div>

          <div className="mb-6">
            <label className="block text-xs uppercase tracking-widest mb-2 font-bold opacity-70" style={{ color: colors.text }}>
              Nama
            </label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full px-5 py-4 rounded-xl border focus:outline-none focus:ring-2 bg-black/5" 
              style={{ borderColor: colors.text ? `${colors.text}20` : '#ccc', color: colors.text }} 
              placeholder={labels.namePlaceholder} 
              required 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2 font-bold opacity-70" style={{ color: colors.text }}>
                Kehadiran
              </label>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)} 
                className="w-full px-5 py-4 rounded-xl border focus:outline-none focus:ring-2 bg-black/5 appearance-none" 
                style={{ borderColor: colors.text ? `${colors.text}20` : '#ccc', color: colors.text }}
              >
                <option value="ATTENDING">{labels.attending}</option>
                <option value="NOT_ATTENDING">{labels.notAttending}</option>
                <option value="TENTATIVE">{labels.tentative}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2 font-bold opacity-70" style={{ color: colors.text }}>
                Jumlah Tamu
              </label>
              <select 
                value={guestCount} 
                onChange={(e) => setGuestCount(Number(e.target.value))} 
                className="w-full px-5 py-4 rounded-xl border focus:outline-none focus:ring-2 bg-black/5 appearance-none" 
                style={{ borderColor: colors.text ? `${colors.text}20` : '#ccc', color: colors.text }}
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num} Orang</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-xs uppercase tracking-widest mb-2 font-bold opacity-70" style={{ color: colors.text }}>
              Ucapan
            </label>
            <textarea 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              className="w-full px-5 py-4 rounded-xl border focus:outline-none focus:ring-2 bg-black/5 min-h-[120px]" 
              style={{ borderColor: colors.text ? `${colors.text}20` : '#ccc', color: colors.text }} 
              placeholder={labels.wishesPlaceholder} 
              required
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full py-4 rounded-xl font-bold transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-xl tracking-widest uppercase text-sm disabled:opacity-70 flex justify-center items-center gap-2" 
            style={{ backgroundColor: colors.primary, color: '#ffffff' }}
          >
            {isSubmitting ? 'Mengirim...' : <><CheckCircle2 size={18} /> {labels.submitText}</>}
          </button>
        </form>
      </motion.div>
    </section>
  );
});

SharedRSVP.displayName = 'SharedRSVP';

export default SharedRSVP;
