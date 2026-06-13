import React, { useActionState } from 'react';
import { m } from 'framer-motion';
import { Check } from 'lucide-react';
import { BaseSectionProps } from './types';

// Simulated action for RSVP submission
async function submitRsvpAction(prevState: any, formData: FormData) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  const name = formData.get('name');
  const attendance = formData.get('attendance');
  
  if (!name || !attendance) {
    return { error: 'Please fill out all required fields.', success: false };
  }
  
  // Here we would normally save to database
  return { error: null, success: true, message: `Thank you for confirming your attendance, ${name}!` };
}

export default function RSVP({ data, lang = 'id', className = '', variants }: BaseSectionProps) {
  const [state, formAction, isPending] = useActionState(submitRsvpAction, { error: null, success: false });

  const defaultVariants = variants || {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <section className={`py-20 px-4 max-w-3xl mx-auto ${className}`}>
      <m.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={defaultVariants}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-5xl font-serif mb-4">RSVP</h2>
        <p className="opacity-80">
          {lang === 'id' 
            ? 'Merupakan suatu kehormatan bagi kami jika Anda berkenan hadir.' 
            : 'It is an honor for us to have you present at our wedding.'}
        </p>
      </m.div>

      <m.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-white/5 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/10 shadow-xl"
      >
        {state?.success ? (
          <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
            <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4">
              <Check size={32} />
            </div>
            <h3 className="text-2xl font-serif">{lang === 'id' ? 'Terima Kasih!' : 'Thank You!'}</h3>
            <p className="opacity-80">{state.message}</p>
          </div>
        ) : (
          <form action={formAction} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 opacity-80 uppercase tracking-wider">
                {lang === 'id' ? 'Nama Anda' : 'Your Name'}
              </label>
              <input 
                name="name"
                type="text" 
                required
                className="w-full bg-black/10 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder={lang === 'id' ? 'Masukkan nama...' : 'Enter your name...'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 opacity-80 uppercase tracking-wider">
                {lang === 'id' ? 'Kehadiran' : 'Attendance'}
              </label>
              <select 
                name="attendance"
                required
                className="w-full bg-black/10 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
              >
                <option value="" disabled selected>{lang === 'id' ? 'Pilih kehadiran...' : 'Select attendance...'}</option>
                <option value="yes" className="text-black">{lang === 'id' ? 'Hadir' : 'Will Attend'}</option>
                <option value="no" className="text-black">{lang === 'id' ? 'Maaf, tidak bisa hadir' : 'Cannot Attend'}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 opacity-80 uppercase tracking-wider">
                {lang === 'id' ? 'Jumlah Tamu' : 'Number of Guests'}
              </label>
              <select 
                name="guests"
                className="w-full bg-black/10 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
              >
                <option value="1" className="text-black">1</option>
                <option value="2" className="text-black">2</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 opacity-80 uppercase tracking-wider">
                {lang === 'id' ? 'Ucapan & Doa' : 'Wishes'}
              </label>
              <textarea 
                name="wishes"
                rows={4}
                className="w-full bg-black/10 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                placeholder={lang === 'id' ? 'Tuliskan ucapan dan doa...' : 'Write your wishes...'}
              />
            </div>

            {state?.error && (
              <p className="text-red-500 text-sm">{state.error}</p>
            )}

            <button 
              type="submit" 
              disabled={isPending}
              className="w-full bg-current/10 text-current hover:bg-current/20 border border-current transition-colors duration-300 rounded-xl px-6 py-4 font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isPending ? (lang === 'id' ? 'Mengirim...' : 'Sending...') : (lang === 'id' ? 'Kirim Konfirmasi' : 'Submit RSVP')}
            </button>
          </form>
        )}
      </m.div>
    </section>
  );
}
