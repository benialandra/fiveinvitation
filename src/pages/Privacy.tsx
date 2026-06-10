import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 20 } }
};

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } }
};

export default function Privacy() {
  const { lang } = useOutletContext<{ lang: 'en' | 'id' }>();

  const sections = [
    {
      title: lang === 'id' ? '1. Pendahuluan' : '1. Introduction',
      content: lang === 'id'
        ? 'Privasi Anda sangat penting bagi kami di FiveInvitation. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi yang Anda berikan saat menggunakan layanan pembuatan undangan digital kami.'
        : 'Your privacy is very important to us at FiveInvitation. This policy explains how we collect, use, and protect the personal information you provide when using our digital invitation creation service.'
    },
    {
      title: lang === 'id' ? '2. Informasi yang Kami Kumpulkan' : '2. Information We Collect',
      content: lang === 'id'
        ? 'Kami hanya mengumpulkan informasi yang Anda masukkan secara sukarela ke dalam form pembuatan undangan. Ini termasuk namun tidak terbatas pada: nama mempelai, tanggal acara, lokasi/alamat acara, cerita perjalanan cinta, dan foto/galeri yang diunggah. Kami tidak mewajibkan pembuatan akun, sehingga kami tidak menyimpan kata sandi Anda.'
        : 'We only collect information that you voluntarily enter into the invitation creation form. This includes but is not limited to: bride/groom names, event dates, event locations/addresses, love stories, and uploaded photos/galleries. We do not require account creation, so we do not store your passwords.'
    },
    {
      title: lang === 'id' ? '3. Penggunaan Data' : '3. Data Usage',
      content: lang === 'id'
        ? 'Seluruh data yang kami kumpulkan secara eksklusif digunakan untuk merender dan menampilkan halaman undangan digital Anda. Kami tidak menggunakan data Anda (termasuk foto) untuk keperluan promosi atau pemasaran tanpa izin eksplisit dari Anda.'
        : 'All the data we collect is exclusively used to render and display your digital invitation page. We do not use your data (including photos) for promotional or marketing purposes without your explicit permission.'
    },
    {
      title: lang === 'id' ? '4. Berbagi Data dengan Pihak Ketiga' : '4. Sharing Data with Third Parties',
      content: lang === 'id'
        ? 'Kami tidak pernah menjual, menyewakan, atau membagikan data pribadi Anda kepada pihak ketiga untuk tujuan pemasaran. Data Anda hanya akan diteruskan ke layanan pihak ketiga yang esensial untuk pengoperasian platform, seperti layanan pembayaran yang aman dan terenkripsi.'
        : 'We never sell, rent, or share your personal data with third parties for marketing purposes. Your data will only be forwarded to third-party services essential for the operation of the platform, such as secure and encrypted payment gateways.'
    },
    {
      title: lang === 'id' ? '5. Keamanan Data' : '5. Data Security',
      content: lang === 'id'
        ? 'Kami menerapkan langkah-langkah keamanan teknis untuk melindungi data Anda dari akses, perubahan, atau penghancuran yang tidak sah. Walau begitu, Anda menyadari bahwa tidak ada transmisi data di internet yang 100% aman.'
        : 'We implement technical security measures to protect your data from unauthorized access, alteration, or destruction. However, you acknowledge that no data transmission over the internet is 100% secure.'
    },
    {
      title: lang === 'id' ? '6. Penghapusan Data' : '6. Data Deletion',
      content: lang === 'id'
        ? 'Anda berhak meminta penghapusan permanen atas data undangan dan foto-foto Anda dari server kami kapan saja setelah acara selesai. Silakan hubungi tim dukungan kami dengan menyertakan tautan undangan Anda untuk proses penghapusan.'
        : 'You have the right to request the permanent deletion of your invitation data and photos from our servers at any time after the event has concluded. Please contact our support team with your invitation link to process the deletion.'
    },
    {
      title: lang === 'id' ? '7. Hubungi Kami' : '7. Contact Us',
      content: lang === 'id'
        ? 'Jika Anda memiliki kekhawatiran tentang kebijakan privasi ini atau cara kami menangani data Anda, silakan hubungi kami di hello@fiveinvitation.com.'
        : 'If you have any concerns about this privacy policy or how we handle your data, please contact us at hello@fiveinvitation.com.'
    }
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] w-full py-16 px-6 lg:px-12 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4 inline-flex items-center gap-2 text-[#C5A059]"
      >
        <span className="w-8 h-[1px] bg-[#C5A059]"></span>
        <span className="text-xs uppercase tracking-[0.4em] font-medium">{lang === 'id' ? 'Privasi' : 'Privacy'}</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="font-serif text-4xl md:text-5xl mb-12 text-gray-900 dark:text-white"
      >
        {lang === 'id' ? 'Kebijakan Privasi' : 'Privacy Policy'}
      </motion.h1>

      <motion.div
        className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-white/70 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {sections.map((section, i) => (
          <motion.section key={i} variants={sectionVariants}>
            <h2 className="text-2xl font-serif text-gray-900 dark:text-white mb-4">
              {section.title}
            </h2>
            <p>{section.content}</p>
          </motion.section>
        ))}

        <motion.div
          variants={sectionVariants}
          className="pt-12 mt-12 border-t border-black/10 dark:border-white/10 text-sm text-gray-500"
        >
          {lang === 'id' ? 'Terakhir diperbarui: 11 Juni 2026' : 'Last updated: June 11, 2026'}
        </motion.div>
      </motion.div>
    </div>
  );
}
