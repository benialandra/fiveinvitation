import React from 'react';
import { Instagram, Facebook, Twitter, Youtube, Mail, MessageCircle, ArrowRight, Sparkles, Monitor, CreditCard, Music2, HeartHandshake, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';

export default function Socials() {
  const { lang, themeMode } = useOutletContext<{ lang: 'en' | 'id', themeMode: string }>();

  const socials = [
    { name: 'Instagram', icon: <Instagram size={28} />, link: 'https://instagram.com/fiveinvitation', color: 'from-pink-500 to-purple-600', username: '@fiveinvitation' },
    { name: 'WhatsApp', icon: <MessageCircle size={28} />, link: 'https://wa.me/6281234567890', color: 'from-green-400 to-emerald-600', username: '+62 812-3456-7890' },
    { name: 'Facebook', icon: <Facebook size={28} />, link: 'https://facebook.com/fiveinvitation', color: 'from-blue-500 to-blue-700', username: 'FiveInvitation Official' },
    { name: 'Twitter', icon: <Twitter size={28} />, link: 'https://twitter.com/fiveinvitation', color: 'from-sky-400 to-blue-500', username: '@fiveinvitation' },
    { name: 'YouTube', icon: <Youtube size={28} />, link: 'https://youtube.com/fiveinvitation', color: 'from-red-500 to-red-700', username: 'FiveInvitation' },
    { name: 'Email', icon: <Mail size={28} />, link: 'mailto:support@fiveinvitation.com', color: 'from-gray-600 to-gray-800', username: 'support@fiveinvitation.com' },
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 300 }
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-[#fafafa] dark:bg-transparent py-16 px-6 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C5A059]/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#C5A059]/5 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.div 
             initial={{ opacity: 0, scale: 0.8, rotate: 45 }}
             animate={{ opacity: 1, scale: 1, rotate: 45 }}
             transition={{ type: 'spring', stiffness: 200, damping: 20 }}
             className="w-16 h-16 mx-auto bg-gradient-to-br from-[#C5A059] to-[#b08d4a] rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-[#C5A059]/20 relative overflow-hidden"
          >
             {/* Repeating shimmer sweep */}
             <motion.div
               className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
               animate={{ x: ['-150%', '250%'] }}
               transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
             />
             <div className="w-8 h-8 border border-white/30 -rotate-45 flex items-center justify-center text-white font-serif font-bold text-xl relative z-10">V</div>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-5xl md:text-6xl mb-6 text-gray-900 dark:text-white"
          >
            {lang === 'id' ? 'Mari Terhubung' : 'Let\'s Connect'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-lg leading-relaxed"
          >
            {lang === 'id' ? 'Ikuti kami di sosial media untuk pembaruan tema, diskon eksklusif, dan inspirasi pernikahan impian Anda.' : 'Follow us on social media for theme updates, exclusive discounts, and your dream wedding inspiration.'}
          </motion.p>
        </div>

        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32"
        >
          {socials.map((social) => (
            <motion.a
              key={social.name}
              variants={itemVariants}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-white/50 dark:bg-white/[0.02] backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[32px] p-6 flex items-center gap-6 hover:bg-white dark:hover:bg-white/5 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1"
            >
              {/* Background Glow on Hover */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${social.color} transition-opacity duration-500`}></div>
              
              <div className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br ${social.color} group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 shadow-lg`}>
                {social.icon}
              </div>
              <div className="relative z-10 flex-1">
                <h3 className="font-semibold text-xl text-gray-900 dark:text-white mb-1 group-hover:text-[#C5A059] transition-colors">{social.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{social.username}</p>
              </div>
              <ArrowRight className="relative z-10 w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-[#C5A059] group-hover:translate-x-1 transition-all duration-300" />
            </motion.a>
          ))}
        </motion.div>

        {/* Kenapa Memilih Kami Section */}
        <div className="relative">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="font-serif text-3xl md:text-5xl mb-6 text-gray-900 dark:text-white"
            >
              {lang === 'id' ? 'Kenapa Memilih Kami?' : 'Why Choose Us?'}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed"
            >
              {lang === 'id' ? 'Lima alasan utama mengapa pasangan mempercayakan undangan digital mereka kepada kami.' : 'Five main reasons why couples trust their digital invitations to us.'}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: lang === 'id' ? 'Desain Elegan & Premium' : 'Elegant & Premium Design',
                description: lang === 'id' ? 'Keindahan visual yang menyatu dengan kemewahan desain. Setiap tema dipoles layaknya undangan fisik premium yang memukau.' : 'Visual beauty blending with design luxury. Each theme is polished like a stunning premium physical invitation.',
                icon: <Sparkles size={24} className="text-[#C5A059]" />
              },
              {
                title: lang === 'id' ? 'Sistem Manajemen Lengkap' : 'Complete Management System',
                description: lang === 'id' ? 'Dilengkapi dashboard praktis untuk memantau kehadiran, ucapan, dan status pengiriman undangan langsung dari perangkatmu.' : 'Equipped with a practical dashboard to monitor attendance, wishes, and invitation delivery status right from your device.',
                icon: <Monitor size={24} className="text-[#C5A059]" />
              },
              {
                title: lang === 'id' ? 'Terintegrasi Pembayaran Digital' : 'Digital Payment Integrated',
                description: lang === 'id' ? 'Tamu dapat memberikan hadiah dengan mudah melalui fitur dompet digital terintegrasi di dalam undangan, tanpa ribet.' : 'Guests can easily give gifts through integrated digital wallet features within the invitation, hassle-free.',
                icon: <CreditCard size={24} className="text-[#C5A059]" />
              },
              {
                title: lang === 'id' ? 'Pengalaman Interaktif' : 'Interactive Experience',
                description: lang === 'id' ? 'Musik latar romantis, efek animasi scrolling elegan, dan pengalaman visual yang memanjakan mata tamu Anda.' : 'Romantic background music, elegant scrolling animation effects, and a visual experience that spoils your guests\' eyes.',
                icon: <Music2 size={24} className="text-[#C5A059]" />
              },
              {
                title: lang === 'id' ? 'Dukungan Prioritas 24/7' : '24/7 Priority Support',
                description: lang === 'id' ? 'Kami selalu siap membantu. Tim layanan pelanggan kami mendampingi kamu sejak pembuatan awal hingga hari bahagiamu tiba.' : 'We are always ready to help. Our customer service team assists you from initial creation to your happy day.',
                icon: <HeartHandshake size={24} className="text-[#C5A059]" />
              },
              {
                title: lang === 'id' ? 'Cepat & Ramah Lingkungan' : 'Fast & Eco-Friendly',
                description: lang === 'id' ? 'Buat undangan dalam hitungan menit dan bagikan secara seketika. Kurangi limbah kertas dan selamatkan lingkungan.' : 'Create invitations in minutes and share them instantly. Reduce paper waste and save the environment.',
                icon: <Leaf size={24} className="text-[#C5A059]" />
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group bg-white/60 dark:bg-[#111]/80 backdrop-blur-sm border border-gray-100 dark:border-white/5 p-8 rounded-[32px] hover:bg-white dark:hover:bg-[#111] hover:border-[#C5A059]/30 dark:hover:border-[#C5A059]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#C5A059]/5 relative overflow-hidden"
              >
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#C5A059]/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="w-14 h-14 bg-[#C5A059]/10 dark:bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#C5A059]/20 transition-all duration-500">
                  {feature.icon}
                </div>
                <h3 className="font-serif text-xl mb-4 text-gray-900 dark:text-white group-hover:text-[#C5A059] transition-colors">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
