import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Copy } from 'lucide-react';
import toast from 'react-hot-toast';

export interface SharedGiftProps {
  bankName: string;
  bankAccount: string;
  bankOwner: string;
  colors?: {
    primary?: string;
    text?: string;
    background?: string;
  };
  fonts?: {
    heading?: string;
    body?: string;
  };
  labels?: {
    title?: string;
    description?: string;
    copyButton?: string;
  };
  className?: string;
}

const SharedGift = memo<SharedGiftProps>(({
  bankName,
  bankAccount,
  bankOwner,
  colors = { primary: '#c5a059', text: '#333333', background: '#fdfbf7' },
  fonts = { heading: 'serif', body: 'sans-serif' },
  labels = {
    title: 'Amplop Digital',
    description: 'Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Dan jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi kado secara cashless.',
    copyButton: 'Salin Rekening'
  },
  className = ''
}) => {
  if (!bankAccount) return null;

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        toast.success('Nomor rekening berhasil disalin!');
      }).catch(() => {
        toast.error('Gagal menyalin nomor rekening.');
      });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        toast.success('Nomor rekening berhasil disalin!');
      } catch (err) {
        toast.error('Gagal menyalin nomor rekening.');
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <section className={`py-12 px-6 w-full ${className}`} style={{ backgroundColor: colors.background }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        whileInView={{ opacity: 1, scale: 1 }} 
        viewport={{ once: true }} 
        transition={{ duration: 0.5, delay: 0.2 }} 
        className="max-w-md mx-auto p-8 rounded-3xl shadow-2xl relative overflow-hidden text-white" 
        style={{ backgroundColor: colors.primary }}
      >
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-black opacity-10 rounded-full blur-2xl pointer-events-none"></div>

        {labels.title && (
          <h3 className="text-3xl mb-3 font-normal relative z-10 text-center" style={{ fontFamily: fonts.heading }}>
            {labels.title}
          </h3>
        )}
        
        {labels.description && (
          <p className="mb-8 opacity-90 text-sm relative z-10 leading-relaxed text-center" style={{ fontFamily: fonts.body }}>
            {labels.description}
          </p>
        )}

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 relative z-10 text-left">
          <p className="text-xs uppercase tracking-widest opacity-80 mb-1" style={{ fontFamily: fonts.body }}>{bankName}</p>
          <p className="text-2xl font-mono font-bold tracking-widest mb-1">{bankAccount}</p>
          <p className="text-sm opacity-90 mb-6 font-medium" style={{ fontFamily: fonts.body }}>a.n. {bankOwner}</p>

          <button
            type="button"
            onClick={() => copyToClipboard(bankAccount)}
            className="w-full py-3.5 rounded-xl bg-white font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors shadow-lg"
            style={{ color: colors.primary, fontFamily: fonts.body }}
          >
            <Copy size={16} />
            {labels.copyButton}
          </button>
        </div>
      </motion.div>
    </section>
  );
});

SharedGift.displayName = 'SharedGift';

export default SharedGift;
