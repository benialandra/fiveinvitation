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

export default function Terms() {
  const { lang } = useOutletContext<{ lang: 'en' | 'id' }>();

  const sections = [
    {
      title: lang === 'id' ? '1. Pihak yang Terlibat & Layanan Kami' : '1. Parties Involved & Our Services',
      content: lang === 'id'
        ? 'Selamat datang di FiveInvitation. Kami menyediakan platform pembuatan undangan pernikahan digital premium. Dengan menggunakan layanan kami, Anda menyetujui seluruh syarat dan ketentuan yang berlaku di halaman ini.'
        : 'Welcome to FiveInvitation. We provide a premium digital wedding invitation creation platform. By using our services, you agree to all terms and conditions stated on this page.'
    },
    {
      title: lang === 'id' ? '2. Pembuatan Undangan & Akun' : '2. Invitation Creation & Account',
      content: lang === 'id'
        ? 'Layanan kami dirancang agar instan dan tanpa proses login. Anda bertanggung jawab penuh atas keakuratan data (nama mempelai, tanggal, lokasi) yang dimasukkan ke dalam form undangan. Kami tidak bertanggung jawab atas kesalahan ketik atau informasi yang tidak akurat dari pihak pengguna.'
        : 'Our service is designed to be instant and login-free. You are fully responsible for the accuracy of the data (bride/groom names, date, location) entered into the invitation form. We are not responsible for typos or inaccurate information from the user.'
    },
    {
      title: lang === 'id' ? '3. Pembayaran & Kebijakan Pengembalian Dana' : '3. Payment & Refund Policy',
      content: lang === 'id'
        ? 'Pembayaran diproses secara otomatis melalui gateway pembayaran resmi. Karena produk yang kami berikan bersifat digital dan langsung aktif setelah pembayaran berhasil, kami tidak melayani permintaan pengembalian dana (refund) untuk alasan apapun kecuali terjadi kegagalan sistem di pihak kami.'
        : 'Payments are processed automatically through official payment gateways. Because our products are digital and instantly active upon successful payment, we do not offer refunds for any reason unless there is a system failure on our end.'
    },
    {
      title: lang === 'id' ? '4. Hak Kekayaan Intelektual' : '4. Intellectual Property Rights',
      content: lang === 'id'
        ? 'Seluruh desain, tema, dan kode sumber dari platform FiveInvitation adalah hak milik intelektual kami. Pengguna hanya diberikan lisensi terbatas untuk menggunakan tema tersebut untuk acara pribadi mereka, dan dilarang keras untuk menyalin, menjual ulang, atau merekayasa balik desain kami.'
        : 'All designs, themes, and source code of the FiveInvitation platform are our intellectual property. Users are only granted a limited license to use the themes for their personal events, and are strictly prohibited from copying, reselling, or reverse-engineering our designs.'
    },
    {
      title: lang === 'id' ? '5. Pembatasan Tanggung Jawab' : '5. Limitation of Liability',
      content: lang === 'id'
        ? 'Kami berusaha memberikan waktu aktif (uptime) server semaksimal mungkin. Namun, kami tidak dapat menjamin bahwa layanan akan 100% bebas dari gangguan. Kami tidak bertanggung jawab atas kerugian materiil atau imateriil yang timbul akibat tidak dapat diaksesnya undangan pada saat-saat tertentu.'
        : 'We strive to provide maximum server uptime. However, we cannot guarantee that the service will be 100% free from interruptions. We are not liable for any material or immaterial losses arising from the inability to access invitations at certain times.'
    },
    {
      title: lang === 'id' ? '6. Perubahan Ketentuan' : '6. Changes to Terms',
      content: lang === 'id'
        ? 'Kami berhak untuk mengubah syarat dan ketentuan ini, termasuk harga layanan dan fitur, kapan saja tanpa pemberitahuan sebelumnya. Penggunaan layanan yang berkelanjutan setelah perubahan dianggap sebagai persetujuan terhadap ketentuan baru.'
        : 'We reserve the right to change these terms and conditions, including service prices and features, at any time without prior notice. Continued use of the service following changes is deemed as acceptance of the new terms.'
    },
    {
      title: lang === 'id' ? '7. Hubungi Kami' : '7. Contact Us',
      content: lang === 'id'
        ? 'Jika Anda memiliki pertanyaan terkait syarat dan ketentuan ini, silakan hubungi tim dukungan kami melalui email di hello@fiveinvitation.com atau via WhatsApp.'
        : 'If you have any questions regarding these terms and conditions, please contact our support team via email at hello@fiveinvitation.com or via WhatsApp.'
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
        <span className="text-xs uppercase tracking-[0.4em] font-medium">{lang === 'id' ? 'Legalitas' : 'Legal'}</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="font-serif text-4xl md:text-5xl mb-12 text-gray-900 dark:text-white"
      >
        {lang === 'id' ? 'Syarat & Ketentuan' : 'Terms of Service'}
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
