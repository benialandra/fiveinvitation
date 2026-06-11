import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-8 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#C5A059]/5 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="text-center relative z-10 max-w-lg"
      >
        {/* 404 Number */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 80, damping: 15 }}
          className="mb-8"
        >
          <span className="text-[120px] md:text-[180px] font-serif font-bold leading-none bg-gradient-to-b from-[#C5A059] via-[#F1D197] to-[#C5A059]/30 bg-clip-text text-transparent select-none">
            404
          </span>
        </motion.div>

        {/* Diamond separator */}
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 45 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
          className="w-8 h-8 border border-[#C5A059]/50 mx-auto mb-8 flex items-center justify-center"
        >
          <div className="w-2 h-2 bg-[#C5A059] rotate-0" />
        </motion.div>

        <h1 className="font-serif text-3xl md:text-4xl text-gray-900 dark:text-white mb-4">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-gray-500 dark:text-white/60 text-lg mb-10 leading-relaxed">
          Maaf, halaman yang Anda cari tidak ada atau sudah dipindahkan.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 gold-gradient text-[#0A0A0B] font-semibold text-sm uppercase tracking-widest hover:opacity-90 transition-opacity rounded-none"
          >
            Kembali ke Beranda
          </button>
          <button
            onClick={() => navigate('/themes')}
            className="px-8 py-4 border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white text-sm uppercase tracking-widest hover:border-[#C5A059] hover:text-[#C5A059] transition-all rounded-none"
          >
            Lihat Tema
          </button>
        </div>
      </motion.div>
    </div>
  );
}
