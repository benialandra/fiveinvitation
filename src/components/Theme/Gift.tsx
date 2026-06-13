import React, { useState } from 'react';
import { m } from 'framer-motion';
import { Gift as GiftIcon, Copy, Check } from 'lucide-react';
import { BaseSectionProps } from './types';
import toast from 'react-hot-toast';

export default function Gift({ data, lang = 'id', className = '', variants }: BaseSectionProps) {
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  // Using fallback data as default
  const bankAccounts = data.bank_accounts || [
    { bank: 'BCA', acc: '1234567890', name: 'Ahmad Rifqi' },
    { bank: 'Mandiri', acc: '0987654321', name: 'Sarah Kamila' }
  ];

  const handleCopy = (text: string, bank: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(bank);
    toast.success(lang === 'id' ? 'Nomor rekening disalin!' : 'Account number copied!');
    setTimeout(() => setCopiedBank(null), 3000);
  };

  const defaultVariants = variants || {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <section className={`py-20 px-4 max-w-4xl mx-auto text-center ${className}`}>
      <m.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={defaultVariants}
        className="mb-12"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-current/10 mb-6">
          <GiftIcon size={32} />
        </div>
        <h2 className="text-3xl md:text-5xl font-serif mb-4">
          {lang === 'id' ? 'Kado Pernikahan' : 'Wedding Gift'}
        </h2>
        <p className="opacity-80 max-w-2xl mx-auto">
          {lang === 'id' 
            ? 'Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun, jika Anda hendak memberikan tanda kasih, dapat mengirimkan melalui:'
            : 'Your blessings are the most meaningful gift to us. However, if you wish to give a token of love, you can send it through:'}
        </p>
      </m.div>

      <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {bankAccounts.map((account: any, idx: number) => (
          <m.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
            className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg flex flex-col items-center"
          >
            <h3 className="font-bold text-xl tracking-wider uppercase mb-2">{account.bank}</h3>
            <p className="font-mono text-xl mb-2 opacity-90">{account.acc}</p>
            <p className="text-sm opacity-70 mb-6 uppercase tracking-wider">{account.name}</p>
            
            <button 
              onClick={() => handleCopy(account.acc, account.bank)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-current/20 hover:bg-current/10 transition-colors duration-300 text-sm font-semibold uppercase tracking-wider"
            >
              {copiedBank === account.bank ? <Check size={16} /> : <Copy size={16} />}
              {copiedBank === account.bank ? (lang === 'id' ? 'Tersalin' : 'Copied') : (lang === 'id' ? 'Salin No. Rek' : 'Copy Account')}
            </button>
          </m.div>
        ))}
      </div>
    </section>
  );
}
