import React, { useState, memo, useEffect } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import toast from 'react-hot-toast';
import { supabase } from '../../supabase/supabase';

export interface PremiumRSVPProps {
  orderId?: string | number;
  uniqueCode?: string;
  variant?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
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

const PremiumRSVP = memo<PremiumRSVPProps>(({
  orderId,
  uniqueCode,
  variant = 1,
  colors = { primary: '#c5a059', text: '#333333', background: '#ffffff', accent: '#f5f5f5' },
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
  const [messagesList, setMessagesList] = useState<any[]>([]);
  const { ref, inView } = useIntersectionObserver({ once: true, rootMargin: "-50px" });

  useEffect(() => {
    if (orderId) {
      supabase.from('guest_books').select('*').eq('order_id', orderId).order('created_at', { ascending: false })
        .then(({ data }) => {
          if (data) setMessagesList(data);
        });
    } else {
      setMessagesList([
        { sender_name: 'Keluarga Besar', message: 'Doa terbaik untuk kalian berdua. Semoga lancar sampai hari H.', created_at: new Date().toISOString() }
      ]);
    }
  }, [orderId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId && !uniqueCode) {
      toast.success("Pratinjau: Terima kasih atas RSVP & Ucapan Anda!");
      setMessagesList(prev => [{ sender_name: name, message: message, created_at: new Date().toISOString() }, ...prev]);
      setName('');
      setMessage('');
      return;
    }
    setIsSubmitting(true);
    try {
      if (orderId) {
        await supabase.from('rsvp').insert([{ order_id: orderId, guest_name: name, status: status, guest_count: guestCount }]);
        await supabase.from('guest_books').insert([{ order_id: orderId, sender_name: name, message: message }]);
        toast.success("RSVP dan ucapan berhasil dikirim!");
        setMessagesList(prev => [{ sender_name: name, message: message, created_at: new Date().toISOString() }, ...prev]);
        setName('');
        setMessage('');
      }
    } catch (error) {
      toast.error("Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormFields = (forcedTextColor?: string) => {
    const textColor = forcedTextColor || colors.text;
    const borderCol = forcedTextColor ? `${forcedTextColor}40` : `${colors.primary}50`;
    return (
      <>
        <div className="mb-6 relative">
          <input type="text" placeholder={labels.namePlaceholder} required value={name} onChange={e => setName(e.target.value)} 
            className="w-full px-4 py-3 bg-transparent border-b outline-none transition-colors" 
            style={{ borderColor: borderCol, color: textColor }} />
        </div>
        <div className="mb-6 relative">
          <select value={status} onChange={e => setStatus(e.target.value)} 
            className="w-full px-4 py-3 bg-transparent border-b outline-none cursor-pointer appearance-none" 
            style={{ borderColor: borderCol, color: textColor }}>
            <option value="ATTENDING" style={{color: '#000'}}>{labels.attending}</option>
            <option value="NOT_ATTENDING" style={{color: '#000'}}>{labels.notAttending}</option>
            <option value="TENTATIVE" style={{color: '#000'}}>{labels.tentative}</option>
          </select>
        </div>
        {status === 'ATTENDING' && (
          <div className="mb-6 relative">
            <select value={guestCount} onChange={e => setGuestCount(Number(e.target.value))} 
              className="w-full px-4 py-3 bg-transparent border-b outline-none cursor-pointer appearance-none" 
              style={{ borderColor: borderCol, color: textColor }}>
              <option value={1} style={{color: '#000'}}>1 Orang</option>
              <option value={2} style={{color: '#000'}}>2 Orang</option>
            </select>
          </div>
        )}
        <div className="mb-8">
          <textarea placeholder={labels.wishesPlaceholder} required value={message} onChange={e => setMessage(e.target.value)} rows={3} 
            className="w-full px-4 py-3 bg-transparent border outline-none resize-none" 
            style={{ borderColor: borderCol, color: textColor }} />
        </div>
      </>
    );
  };

  const renderMessagesDisplay = (forcedTextColor?: string) => {
    const textColor = forcedTextColor || colors.text;
    return (
      <div className="mt-10 space-y-4 max-h-[350px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: `${colors.primary} transparent` }}>
        {messagesList.map((msg, idx) => (
          <div key={idx} className="pb-4 border-b text-left" style={{ borderColor: `${colors.primary}20` }}>
            <p className="font-semibold mb-1" style={{ color: textColor, fontFamily: fonts.heading }}>{msg.sender_name}</p>
            <p className="text-sm opacity-80 leading-relaxed" style={{ color: textColor, fontFamily: fonts.body }}>{msg.message}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderVariant = () => {
    switch (variant) {
      case 1: // Classic Benchmark (Split screen)
        return (
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start text-left px-4">
            <div>
              <h2 className="text-3xl md:text-5xl mb-6 font-light tracking-wide" style={{ fontFamily: fonts.heading, color: colors.primary }}>{labels.title}</h2>
              <p className="opacity-80 leading-relaxed mb-8" style={{ color: colors.text, fontFamily: fonts.body }}>{labels.subtitle}</p>
              {renderMessagesDisplay()}
            </div>
            <form onSubmit={handleSubmit} className="p-8 rounded-[2rem] border shadow-2xl backdrop-blur-md bg-white/5" style={{ borderColor: `${colors.primary}30` }}>
              {renderFormFields()}
              <button type="submit" disabled={isSubmitting} className="w-full py-4 uppercase tracking-[0.2em] text-xs font-medium transition-all hover:opacity-80" style={{ backgroundColor: colors.primary, color: '#fff' }}>
                {isSubmitting ? 'Mengirim...' : labels.submitText}
              </button>
            </form>
          </div>
        );
      case 2: // Minimalist Box
        return (
          <div className="max-w-2xl mx-auto bg-transparent px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl mb-4 font-light" style={{ fontFamily: fonts.heading, color: colors.primary }}>{labels.title}</h2>
              <div className="w-12 h-[1px] mx-auto mb-6" style={{ backgroundColor: colors.primary }}></div>
              <p className="opacity-80 text-sm" style={{ color: colors.text }}>{labels.subtitle}</p>
            </div>
            <form onSubmit={handleSubmit} className="mb-16">
              {renderFormFields()}
              <button type="submit" disabled={isSubmitting} className="w-full py-3 border transition-colors hover:bg-opacity-10" style={{ borderColor: colors.primary, color: colors.primary }}>
                {labels.submitText}
              </button>
            </form>
            <div className="text-center">
              <h3 className="text-xl mb-6 font-light" style={{ fontFamily: fonts.heading, color: colors.primary }}>Pesan & Doa</h3>
              {renderMessagesDisplay()}
            </div>
          </div>
        );
      case 3: // Elegant Card over background
        return (
          <div className="max-w-4xl mx-auto p-8 md:p-16 rounded-xl shadow-xl bg-white text-center">
            <h2 className="text-3xl md:text-4xl mb-4" style={{ fontFamily: fonts.heading, color: colors.primary }}>{labels.title}</h2>
            <p className="mb-10 text-sm md:text-base opacity-80" style={{ color: '#333333' }}>{labels.subtitle}</p>
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto mb-16 text-left">
              {renderFormFields("#333333")}
              <button type="submit" disabled={isSubmitting} className="w-full py-4 text-white rounded-md transition-all shadow-md hover:shadow-lg" style={{ backgroundColor: colors.primary }}>
                {labels.submitText}
              </button>
            </form>
            <div className="border-t pt-10" style={{ borderColor: `${colors.primary}30` }}>
              {renderMessagesDisplay("#333333")}
            </div>
          </div>
        );
      case 4: // Glassmorphism Soft
        return (
          <div className="max-w-3xl mx-auto p-8 md:p-12 rounded-3xl backdrop-blur-xl border shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] text-center" style={{ backgroundColor: `${colors.accent}40`, borderColor: `${colors.primary}40` }}>
            <h2 className="text-3xl md:text-5xl mb-6 font-light" style={{ fontFamily: fonts.heading, color: colors.primary }}>{labels.title}</h2>
            <p className="mb-10 opacity-80 text-sm" style={{ color: colors.text }}>{labels.subtitle}</p>
            <form onSubmit={handleSubmit} className="text-left mb-12">
              {renderFormFields()}
              <button type="submit" disabled={isSubmitting} className="w-full py-4 rounded-full text-white tracking-widest uppercase text-xs transition-transform hover:scale-[1.02]" style={{ backgroundColor: colors.primary }}>
                {labels.submitText}
              </button>
            </form>
            {renderMessagesDisplay()}
          </div>
        );
      case 5: // Two Column Flush
        return (
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 bg-white shadow-2xl rounded-2xl overflow-hidden text-left">
            <div className="p-8 md:p-16 bg-gray-50 flex flex-col justify-center">
              <h2 className="text-3xl md:text-5xl mb-6 font-light" style={{ fontFamily: fonts.heading, color: colors.primary }}>{labels.title}</h2>
              <p className="opacity-80 mb-10" style={{ color: '#333333' }}>{labels.subtitle}</p>
              {renderMessagesDisplay("#333333")}
            </div>
            <div className="p-8 md:p-16">
              <form onSubmit={handleSubmit}>
                {renderFormFields("#333333")}
                <button type="submit" disabled={isSubmitting} className="w-full py-4 text-white font-medium" style={{ backgroundColor: colors.primary }}>
                  {labels.submitText}
                </button>
              </form>
            </div>
          </div>
        );
      case 6: // Floating Minimal Dark/Light context aware
        return (
          <div className="max-w-2xl mx-auto px-4">
            <div className="p-8 rounded-[2.5rem] border" style={{ borderColor: `${colors.primary}30`, backgroundColor: `${colors.background}EE` }}>
              <h2 className="text-3xl md:text-4xl mb-4 text-center font-light" style={{ fontFamily: fonts.heading, color: colors.primary }}>{labels.title}</h2>
              <p className="mb-8 opacity-80 text-center text-sm" style={{ color: colors.text }}>{labels.subtitle}</p>
              <form onSubmit={handleSubmit}>
                <FormFields />
                <button type="submit" disabled={isSubmitting} className="w-full py-4 rounded-xl text-white mt-4" style={{ backgroundColor: colors.primary }}>
                  {labels.submitText}
                </button>
              </form>
            </div>
            <div className="mt-12 px-4">
              <MessagesDisplay />
            </div>
          </div>
        );
      case 7: // Centered Typographic
        return (
          <div className="max-w-xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl mb-6" style={{ fontFamily: fonts.heading, color: colors.primary }}>{labels.title}</h2>
            <div className="w-full h-[1px] mb-8" style={{ backgroundColor: `${colors.primary}30` }}></div>
            <p className="mb-10 opacity-80" style={{ color: colors.text }}>{labels.subtitle}</p>
            <form onSubmit={handleSubmit} className="text-left mb-16">
              <FormFields />
              <div className="text-center mt-8">
                <button type="submit" disabled={isSubmitting} className="px-12 py-3 border rounded-full uppercase text-xs tracking-widest hover:bg-opacity-10 transition-colors" style={{ borderColor: colors.primary, color: colors.primary }}>
                  {labels.submitText}
                </button>
              </div>
            </form>
            <MessagesDisplay />
          </div>
        );
      case 8: // Arch Layout Elegant
        return (
          <div className="max-w-2xl mx-auto p-8 md:p-16 rounded-t-[10rem] border-x border-t bg-white shadow-xl" style={{ borderColor: `${colors.primary}30` }}>
            <h2 className="text-3xl md:text-5xl mb-6 text-center font-light mt-8" style={{ fontFamily: fonts.heading, color: colors.primary }}>{labels.title}</h2>
            <p className="mb-10 opacity-80 text-center" style={{ color: '#333333' }}>{labels.subtitle}</p>
            <form onSubmit={handleSubmit} className="text-left">
              <FormFields forcedTextColor="#333333" />
              <button type="submit" disabled={isSubmitting} className="w-full py-4 text-white uppercase tracking-widest text-sm" style={{ backgroundColor: colors.primary }}>
                {labels.submitText}
              </button>
            </form>
            <div className="mt-12">
              <MessagesDisplay forcedTextColor="#333333" />
            </div>
          </div>
        );
      case 9: // Modern Dark Box (forced dark if variant 9)
        return (
          <div className="max-w-3xl mx-auto p-8 md:p-16 bg-[#111] rounded-none border border-[#333] shadow-2xl">
            <h2 className="text-3xl md:text-5xl mb-6 text-center" style={{ fontFamily: fonts.heading, color: colors.primary }}>{labels.title}</h2>
            <p className="mb-12 opacity-80 text-center" style={{ color: '#eee' }}>{labels.subtitle}</p>
            <form onSubmit={handleSubmit} className="text-left">
              <FormFields forcedTextColor="#eeeeee" />
              <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-transparent border uppercase tracking-widest hover:bg-white hover:text-black transition-all" style={{ borderColor: colors.primary, color: colors.primary }}>
                {labels.submitText}
              </button>
            </form>
            <div className="mt-12">
              <MessagesDisplay forcedTextColor="#eeeeee" />
            </div>
          </div>
        );
      case 10: // Very Minimalist Text-heavy
        return (
          <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-5 gap-12 text-left">
            <div className="md:col-span-2">
              <h2 className="text-4xl mb-6 font-light" style={{ fontFamily: fonts.heading, color: colors.primary }}>{labels.title}</h2>
              <p className="opacity-70 mb-8 leading-relaxed" style={{ color: colors.text }}>{labels.subtitle}</p>
            </div>
            <div className="md:col-span-3">
              <form onSubmit={handleSubmit} className="mb-16">
                <FormFields />
                <button type="submit" disabled={isSubmitting} className="w-full py-4 mt-4 font-bold uppercase tracking-widest text-xs" style={{ backgroundColor: colors.primary, color: colors.background }}>
                  {labels.submitText}
                </button>
              </form>
              <MessagesDisplay />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section ref={ref} className={`py-16 md:py-24 w-full ${className}`} style={{ backgroundColor: colors.background }}>
      <div className={`reveal-up ${inView ? 'in-view' : ''}`}>
        {renderVariant()}
      </div>
    </section>
  );
});

PremiumRSVP.displayName = 'PremiumRSVP';

export default PremiumRSVP;
