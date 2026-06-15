import React, { useState, memo, useEffect } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { CheckCircle2, MessageSquareHeart } from 'lucide-react';
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
        { sender_name: 'Budi Santoso', message: 'Selamat menempuh hidup baru, semoga samawa!', created_at: new Date().toISOString() },
        { sender_name: 'Siti Aminah', message: 'Lancar sampai hari H ya bestie!!', created_at: new Date(Date.now() - 86400000).toISOString() },
        { sender_name: 'Keluarga Besar', message: 'Doa terbaik untuk kalian berdua.', created_at: new Date(Date.now() - 172800000).toISOString() }
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
        setMessagesList(prev => [{ sender_name: name, message: message, created_at: new Date().toISOString() }, ...prev]);
        setName('');
        setMessage('');
      }
    } catch (err) {
      toast.error("Gagal mengirim RSVP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = { 
    borderColor: colors.text ? `${colors.text}30` : '#ccc', 
    color: colors.text,
    backgroundColor: 'transparent'
  };

  // Safe background color handling
  const formBg = colors.background?.startsWith('#') && colors.background.length === 7 
    ? `${colors.background}EE` 
    : colors.background;

  const cardBg = colors.background?.startsWith('#') && colors.background.length === 7 
    ? `${colors.background}AA` 
    : colors.background;

  return (
    <section className={`py-16 md:py-24 px-4 md:px-8 w-full ${className}`} style={{ backgroundColor: colors.accent }}>
      <div 
        ref={ref}
        className={`reveal-up ${inView ? 'in-view' : ''} max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start`}
      >
        {/* KIRI: FORM RSVP */}
        <div>
          <div className="text-center lg:text-left mb-10">
            {labels.title && (
              <h2 className="text-3xl md:text-5xl mb-4" style={{ fontFamily: fonts.heading, color: colors.primary }}>
                {labels.title}
              </h2>
            )}
            {labels.subtitle && (
              <p className="opacity-80 max-w-md mx-auto lg:mx-0 leading-relaxed text-sm md:text-base" style={{ color: colors.text, fontFamily: fonts.body }}>
                {labels.subtitle}
              </p>
            )}
          </div>

          <form 
            className="p-6 md:p-8 rounded-[2rem] border relative overflow-hidden shadow-2xl backdrop-blur-md" 
            style={{ backgroundColor: formBg, borderColor: colors.primary ? `${colors.primary}30` : '#e5e5e5' }} 
            onSubmit={handleSubmit}
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-1.5" style={{ backgroundColor: colors.primary }}></div>

            <div className="mb-5">
              <label className="block text-[10px] md:text-xs uppercase tracking-widest mb-2 font-bold opacity-70" style={{ color: colors.text }}>Nama</label>
              <input 
                type="text" value={name} onChange={(e) => setName(e.target.value)} 
                className="w-full px-4 py-3.5 md:py-4 rounded-xl border focus:outline-none focus:ring-1 text-sm transition-all" 
                style={inputStyle} placeholder={labels.namePlaceholder} required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-[10px] md:text-xs uppercase tracking-widest mb-2 font-bold opacity-70" style={{ color: colors.text }}>Kehadiran</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-3.5 md:py-4 rounded-xl border focus:outline-none focus:ring-1 text-sm appearance-none transition-all" style={inputStyle}>
                  <option value="ATTENDING" style={{color: '#000'}}>{labels.attending}</option>
                  <option value="NOT_ATTENDING" style={{color: '#000'}}>{labels.notAttending}</option>
                  <option value="TENTATIVE" style={{color: '#000'}}>{labels.tentative}</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] md:text-xs uppercase tracking-widest mb-2 font-bold opacity-70" style={{ color: colors.text }}>Tamu</label>
                <select value={guestCount} onChange={(e) => setGuestCount(Number(e.target.value))} className="w-full px-4 py-3.5 md:py-4 rounded-xl border focus:outline-none focus:ring-1 text-sm appearance-none transition-all" style={inputStyle}>
                  {[1, 2, 3, 4, 5].map(num => <option key={num} value={num} style={{color: '#000'}}>{num} Orang</option>)}
                </select>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-[10px] md:text-xs uppercase tracking-widest mb-2 font-bold opacity-70" style={{ color: colors.text }}>Ucapan</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full px-4 py-3.5 md:py-4 rounded-xl border focus:outline-none focus:ring-1 text-sm min-h-[100px] md:min-h-[120px] transition-all resize-none" style={inputStyle} placeholder={labels.wishesPlaceholder} required></textarea>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full py-4 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg tracking-widest uppercase text-xs md:text-sm disabled:opacity-70 flex justify-center items-center gap-2" style={{ backgroundColor: colors.primary, color: '#ffffff' }}>
              {isSubmitting ? 'Mengirim...' : <><CheckCircle2 size={16} /> {labels.submitText}</>}
            </button>
          </form>
        </div>

        {/* KANAN: DAFTAR PESAN */}
        <div className="flex flex-col h-[400px] md:h-[500px] lg:h-[650px] mt-6 lg:mt-0 w-full overflow-hidden">
          <h3 className="text-2xl md:text-3xl mb-6 flex items-center justify-center lg:justify-start gap-3 text-center lg:text-left" style={{ fontFamily: fonts.heading, color: colors.primary }}>
            <MessageSquareHeart size={28} className="shrink-0" /> <span className="truncate">Papan Ucapan ({messagesList.length})</span>
          </h3>
          
          {/* Scrollable Container */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin rounded-2xl p-1" style={{ scrollbarColor: `${colors.primary} transparent` }}>
            {messagesList.length === 0 ? (
              <p className="text-sm opacity-60 italic text-center lg:text-left" style={{ color: colors.text }}>Belum ada ucapan. Jadilah yang pertama!</p>
            ) : (
              messagesList.map((msg, idx) => (
                <div key={idx} className="p-5 md:p-6 rounded-[1.5rem] border backdrop-blur-sm transition-transform hover:scale-[1.01]" style={{ backgroundColor: cardBg, borderColor: colors.primary ? `${colors.primary}30` : '#e5e5e5' }}>
                  <div className="flex items-center justify-between mb-2">
                     <p className="font-bold text-sm md:text-base tracking-wide truncate pr-2" style={{ color: colors.primary }}>{msg.sender_name}</p>
                     <p className="text-[10px] md:text-xs opacity-50 uppercase tracking-wider font-semibold shrink-0" style={{ color: colors.text }}>
                       {new Date(msg.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                     </p>
                  </div>
                  <p className="text-sm md:text-base leading-relaxed opacity-90 break-words" style={{ color: colors.text, fontFamily: fonts.body }}>"{msg.message}"</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </section>
  );
});

SharedRSVP.displayName = 'SharedRSVP';

export default SharedRSVP;
