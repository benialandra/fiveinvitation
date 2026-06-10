import React from 'react';
import { Instagram, Facebook, Twitter, Youtube, Mail, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';

export default function Socials() {
  const { lang } = useOutletContext<{ lang: 'en' | 'id' }>();

  const socials = [
    { name: 'Instagram', icon: <Instagram size={24} />, link: 'https://instagram.com/fiveinvitation', color: 'bg-pink-600', username: '@fiveinvitation' },
    { name: 'WhatsApp', icon: <MessageCircle size={24} />, link: 'https://wa.me/6281234567890', color: 'bg-green-500', username: '+62 812-3456-7890' },
    { name: 'Facebook', icon: <Facebook size={24} />, link: 'https://facebook.com/fiveinvitation', color: 'bg-blue-600', username: 'FiveInvitation Official' },
    { name: 'Twitter', icon: <Twitter size={24} />, link: 'https://twitter.com/fiveinvitation', color: 'bg-sky-500', username: '@fiveinvitation' },
    { name: 'YouTube', icon: <Youtube size={24} />, link: 'https://youtube.com/fiveinvitation', color: 'bg-red-600', username: 'FiveInvitation' },
    { name: 'Email', icon: <Mail size={24} />, link: 'mailto:support@fiveinvitation.com', color: 'bg-gray-600', username: 'support@fiveinvitation.com' },
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
    <div className="w-full min-h-[calc(100vh-80px)] bg-[#fafafa] dark:bg-[#0A0A0B] py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-4xl md:text-5xl mb-4 text-gray-900 dark:text-white"
          >
            {lang === 'id' ? 'Mari Terhubung' : 'Let\'s Connect'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto"
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24"
        >
          {socials.map((social) => (
            <motion.a
              key={social.name}
              variants={itemVariants}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white dark:bg-[#111] border border-black/5 dark:border-white/10 rounded-3xl p-6 flex items-center gap-6 hover:shadow-xl dark:hover:shadow-[#C5A059]/10 transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white ${social.color} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                {social.icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-[#C5A059] transition-colors">{social.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{social.username}</p>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Kenapa Memilih Kami Section */}
        <div className="mt-20 border-t border-gray-200 dark:border-white/10 pt-20">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="font-serif text-3xl md:text-4xl mb-4 text-gray-900 dark:text-white"
            >
              {lang === 'id' ? 'Kenapa Memilih Kami?' : 'Why Choose Us?'}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto"
            >
              {lang === 'id' ? 'Lima alasan utama mengapa pasangan mempercayakan undangan digital mereka kepada kami.' : 'Five main reasons why couples trust their digital invitations to us.'}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: lang === 'id' ? 'Desain Elegan & Premium' : 'Elegant & Premium Design',
                description: lang === 'id' ? 'Keindahan visual yang menyatu dengan kemewahan desain. Setiap tema dipoles layaknya undangan fisik premium yang memukau.' : 'Visual beauty blending with design luxury. Each theme is polished like a stunning premium physical invitation.',
                icon: '✨'
              },
              {
                title: lang === 'id' ? 'Sistem Manajemen Lengkap' : 'Complete Management System',
                description: lang === 'id' ? 'Dilengkapi dashboard praktis untuk memantau kehadiran, ucapan, dan status pengiriman undangan langsung dari perangkatmu.' : 'Equipped with a practical dashboard to monitor attendance, wishes, and invitation delivery status right from your device.',
                icon: '🖥️'
              },
              {
                title: lang === 'id' ? 'Terintegrasi Pembayaran Digital' : 'Digital Payment Integrated',
                description: lang === 'id' ? 'Tamu dapat memberikan hadiah dengan mudah melalui fitur dompet digital terintegrasi di dalam undangan, tanpa ribet.' : 'Guests can easily give gifts through integrated digital wallet features within the invitation, hassle-free.',
                icon: '💳'
              },
              {
                title: lang === 'id' ? 'Pengalaman Interaktif' : 'Interactive Experience',
                description: lang === 'id' ? 'Musik latar romantis, efek animasi scrolling elegan, dan pengalaman visual yang memanjakan mata tamu Anda.' : 'Romantic background music, elegant scrolling animation effects, and a visual experience that spoils your guests\' eyes.',
                icon: '🎵'
              },
              {
                title: lang === 'id' ? 'Dukungan Prioritas 24/7' : '24/7 Priority Support',
                description: lang === 'id' ? 'Kami selalu siap membantu. Tim layanan pelanggan kami mendampingi kamu sejak pembuatan awal hingga hari bahagiamu tiba.' : 'We are always ready to help. Our customer service team assists you from initial creation to your happy day.',
                icon: '🤝'
              },
              {
                title: lang === 'id' ? 'Cepat & Ramah Lingkungan' : 'Fast & Eco-Friendly',
                description: lang === 'id' ? 'Buat undangan dalam hitungan menit dan bagikan secara seketika. Kurangi limbah kertas dan selamatkan lingkungan.' : 'Create invitations in minutes and share them instantly. Reduce paper waste and save the environment.',
                icon: '🌱'
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 p-8 rounded-3xl hover:border-[#C5A059] dark:hover:border-[#C5A059]/50 transition-colors"
              >
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h3 className="font-serif text-xl mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
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
