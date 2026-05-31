import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Star, Quote, Search, PenTool, CheckCircle, Zap } from 'lucide-react';

const RECENT_ORDERS = [
  { id: 1, names: "Beni & Deti", theme: "Elegant Minimalist", image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=300" },
  { id: 2, names: "Andi & Rina", theme: "Floral Romance", image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=300" },
  { id: 3, names: "Dimas & Putri", theme: "Classic Gold", image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&q=80&w=300" },
  { id: 4, names: "Reza & Maya", theme: "Modern Dark", image: "https://images.unsplash.com/photo-1542042161784-26ab9e041e89?auto=format&fit=crop&q=80&w=300" },
  { id: 5, names: "Budi & Siska", theme: "Rustic Earth", image: "https://images.unsplash.com/photo-1507504031003-b417242a901f?auto=format&fit=crop&q=80&w=300" },
  { id: 6, names: "Kevin & Laura", theme: "Ocean Blue", image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=300" },
  { id: 7, names: "Rizky & Dina", theme: "Vintage Lace", image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=300" },
  { id: 8, names: "Arif & Nisa", theme: "Tropical Vibe", image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=300" },
  { id: 9, names: "Ivan & Bella", theme: "Minimalist White", image: "https://images.unsplash.com/photo-1475721028070-2051152cbcad?auto=format&fit=crop&q=80&w=300" },
  { id: 10, names: "Fajar & Tari", theme: "Luxury Gold", image: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=300" },
];

const TESTIMONIALS = [
  { id: 1, name: "Irene & Seulgi", comment: "Desainnya luar biasa elegan dan prosesnya sangat cepat! Fitur Midtrans bikin semuanya praktis. Tamu banyak yang terkesan dengan tema yang kami pilih.", rating: 5 },
  { id: 2, name: "Deti & Beni", comment: "Tema yang disediakan sangat modern. Tamu-tamu undangan banyak yang memuji undangan digital kami. Benar-benar sesuai dengan ekspektasi!", rating: 5 },
  { id: 3, name: "Nisa & Arif", comment: "Tanpa ribet harus daftar, langsung isi form dan undangan jadi seketika. Sangat direkomendasikan untuk pasangan yang mencari undangan eksklusif.", rating: 5 },
];

export default function Home() {
  const navigate = useNavigate();
  const [trackId, setTrackId] = useState('');
  const { lang, themeMode } = useOutletContext<{ lang: 'en' | 'id', themeMode: string }>();

  const handleTrackCode = () => {
    if (trackId.trim()) {
      navigate(`/track/${trackId.trim()}`);
    }
  };

  return (
    <div className="flex flex-col w-full relative overflow-hidden">
      
      {/* Hero Section */}
      <div className="min-h-[calc(100vh-80px)] grid grid-cols-1 lg:grid-cols-12 gap-0 relative">
        <div className="col-span-1 lg:col-span-7 flex flex-col justify-center px-6 lg:px-12 py-12 lg:py-0 z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0 }}
            className="mb-4 inline-flex items-center gap-2 text-[#C5A059]"
          >
            <span className="w-8 h-[1px] bg-[#C5A059]"></span>
            <span className="text-xs uppercase tracking-[0.4em] font-medium">Premium Digital Invitation</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.15 }}
            className="font-serif text-5xl md:text-7xl leading-[1.1] mb-6 font-light text-gray-900 dark:text-white"
          >
            {lang === 'id' ? 'Abadikan Momen' : 'Capture Your'} <br/>
            <span className="italic font-normal">{lang === 'id' ? 'Terindah Anda' : 'Precious Moments'}</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.3 }}
            className="text-gray-600 dark:text-white/60 text-lg font-light leading-relaxed mb-8 max-w-lg"
          >
            {lang === 'id' 
              ? 'Platform undangan digital premium berbasis Next.js. Tanpa login, proses instan, pembayaran otomatis via Midtrans. Siap dibagikan dalam hitungan menit.'
              : 'Premium digital invitation platform. No login required, instant processing, automated payment via Midtrans. Ready to share in minutes.'}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button 
              onClick={() => navigate('/themes')}
              className="gold-gradient text-[#0A0A0B] px-8 py-4 text-sm font-semibold uppercase tracking-widest shadow-2xl shadow-[#C5A059]/20 hover:opacity-90 transition-opacity cursor-pointer"
            >
              {lang === 'id' ? 'Buat Undangan Sekarang' : 'Create Invitation Ahora'}
            </button>
            <button 
              onClick={() => navigate('/themes')}
              className="border border-gray-300 dark:border-white/20 px-8 py-4 text-sm font-light uppercase tracking-widest text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              {lang === 'id' ? 'Lihat Demo Tema' : 'View Theme Demos'}
            </button>
          </motion.div>
        </div>

        {/* Background Visual Overlay */}
        <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[#C5A059]/10 to-transparent pointer-events-none hidden lg:block"></div>
        
        <div className="col-span-1 lg:col-span-5 relative items-center justify-center p-6 lg:p-12 hidden lg:flex">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 25, delay: 0.2 }}
            className="w-full max-w-[340px] h-[500px] relative group cursor-pointer"
          >
            {RECENT_ORDERS.slice(0, 3).map((order, idx) => {
              // Fan-out classes for hover
              // idx 0 (bottom): left rotation max
              // idx 1 (middle): left rotation mid
              // idx 2 (top): straight
              const idleTransforms = [
                '-rotate-6 -translate-x-4 translate-y-2',
                '-rotate-3 -translate-x-2 translate-y-1',
                'rotate-0'
              ];
              const hoverTransforms = [
                'group-hover:-rotate-[30deg] group-hover:-translate-x-28 group-hover:translate-y-10 group-hover:shadow-2xl',
                'group-hover:-rotate-[15deg] group-hover:-translate-x-14 group-hover:translate-y-4 group-hover:shadow-xl',
                'group-hover:-translate-y-4 group-hover:scale-105 group-hover:rotate-0 group-hover:shadow-[0_20px_50px_rgba(197,160,89,0.2)]'
              ];
              const zIndexes = ['z-10', 'z-20', 'z-30'];
              
              return (
                <div 
                  key={order.id} 
                  className={`absolute top-0 left-0 w-full h-full p-3 transition-all duration-700 ease-out origin-bottom-right ${themeMode === 'dark' ? 'bg-[#111] shadow-[0_10px_30px_rgba(0,0,0,0.8)]' : 'bg-white shadow-xl'} rounded-[32px] transform ${idleTransforms[idx]} ${hoverTransforms[idx]} ${zIndexes[idx]}`}
                >
                    <div className="w-full h-full border border-black/5 dark:border-white/5 rounded-[24px] overflow-hidden relative flex flex-col items-center justify-center text-center p-8">
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" style={{ backgroundImage: `url(${order.image})` }}></div>
                        <div className="absolute inset-0 bg-black/40 transition-colors duration-1000 group-hover:bg-black/50"></div>
                        <div className="relative z-10 transform transition-transform duration-500 group-hover:-translate-y-2">
                            <p className="font-serif text-white/80 text-sm italic mb-2 uppercase tracking-widest">The Wedding of</p>
                            <h2 className="font-serif text-3xl text-white mb-4">{order.names}</h2>
                            <div className="w-12 h-[1px] bg-[#C5A059] mx-auto mb-4 transition-all duration-500 group-hover:w-20"></div>
                            <p className="text-xs text-white/90 uppercase tracking-widest">{order.theme}</p>
                        </div>
                    </div>
                </div>
              );
            })}
          </motion.div>
          
        </div>
      </div>

      {/* How it Works Section */}
      <div className="py-24 bg-white dark:bg-[#0A0A0B] relative z-10 border-t border-black/5 dark:border-white/5">
         <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
               <h2 className="font-serif text-3xl md:text-5xl text-gray-900 dark:text-white mb-6">
                  {lang === 'id' ? 'Tiga Langkah Mudah' : 'Three Simple Steps'}
               </h2>
               <p className="text-gray-500 dark:text-white/60 max-w-2xl mx-auto text-lg leading-relaxed">
                  {lang === 'id' ? 'Kami mendesain sistem yang sesederhana mungkin agar Anda bisa fokus pada momen spesial, sementara kami menangani administrasinya.' : 'We designed the system to be as simple as possible so you can focus on the special moments, while we handle the administration.'}
               </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
               {/* Arrow connecting steps on desktop */}
               <div className="hidden md:block absolute top-[60px] left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent"></div>

               <div className="bg-gray-50 dark:bg-black/40 p-8 rounded-[32px] border border-black/5 dark:border-white/5 relative flex flex-col items-center text-center group hover:bg-white dark:hover:bg-white/5 hover:border-[#C5A059]/50 transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-white dark:bg-[#111] shadow-xl flex items-center justify-center mb-8 border border-black/5 dark:border-white/10 group-hover:scale-110 group-hover:bg-[#C5A059] group-hover:text-white transition-all text-[#C5A059] z-10">
                     <Search width={24} height={24} />
                  </div>
                  <h3 className="text-xl font-serif text-gray-900 dark:text-white mb-4">{lang === 'id' ? '1. Pilih Tema' : '1. Choose a Theme'}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-loose">
                     {lang === 'id' ? 'Temukan desain undangan yang paling mewakili kisah cinta Anda dari koleksi eksklusif kami.' : 'Find the invitation design that best represents your love story from our exclusive collection.'}
                  </p>
               </div>

               <div className="bg-gray-50 dark:bg-black/40 p-8 rounded-[32px] border border-black/5 dark:border-white/5 relative flex flex-col items-center text-center group hover:bg-white dark:hover:bg-white/5 hover:border-[#C5A059]/50 transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-white dark:bg-[#111] shadow-xl flex items-center justify-center mb-8 border border-black/5 dark:border-white/10 group-hover:scale-110 group-hover:bg-[#C5A059] group-hover:text-white transition-all text-[#C5A059] z-10">
                     <PenTool width={24} height={24} />
                  </div>
                  <h3 className="text-xl font-serif text-gray-900 dark:text-white mb-4">{lang === 'id' ? '2. Isi Detail Acara' : '2. Fill Event Details'}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-loose">
                     {lang === 'id' ? 'Lengkapi informasi acara pernikahan Anda. Tanpa perlu mendaftar akun, prosesnya instan.' : 'Complete your wedding event information. No account registration needed, instant process.'}
                  </p>
               </div>

               <div className="bg-gray-50 dark:bg-black/40 p-8 rounded-[32px] border border-black/5 dark:border-white/5 relative flex flex-col items-center text-center group hover:bg-white dark:hover:bg-white/5 hover:border-[#C5A059]/50 transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-white dark:bg-[#111] shadow-xl flex items-center justify-center mb-8 border border-black/5 dark:border-white/10 group-hover:scale-110 group-hover:bg-[#C5A059] group-hover:text-white transition-all text-[#C5A059] z-10">
                     <Zap width={24} height={24} />
                  </div>
                  <h3 className="text-xl font-serif text-gray-900 dark:text-white mb-4">{lang === 'id' ? '3. Aktif & Bagikan' : '3. Active & Share'}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-loose">
                     {lang === 'id' ? 'Selesaikan pembayaran otomatis dan tautan undangan Anda siap dibagikan seketika.' : 'Complete automatic payment and your invitation link is ready to share instantly.'}
                  </p>
               </div>
            </div>
         </div>
      </div>

      {/* Recent Orders Section */}
      <div className="py-20 lg:py-24 bg-gray-50 dark:bg-black/20 border-t border-black/5 dark:border-white/5 relative z-10 overflow-hidden">
        <div className="px-6 lg:px-12 mb-12 text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-gray-900 dark:text-white mb-4">
             {lang === 'id' ? 'Telah Dipercaya Ribuan Pasangan' : 'Trusted by Thousands of Couples'}
          </h2>
          <p className="text-gray-500 dark:text-white/60">
             {lang === 'id' ? 'Bergabunglah dengan mereka yang telah membagikan momen bahagia dengan cara yang elegan.' : 'Join those who have shared their happy moments in an elegant way.'}
          </p>
        </div>
        
        {/* Marquee Container */}
        <div className="w-full relative py-4 flex flex-col gap-6">
           {/* Left/Right Fade out */}
           <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gray-50 dark:from-[#0A0A0B] to-transparent z-10 pointer-events-none"></div>
           <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gray-50 dark:from-[#0A0A0B] to-transparent z-10 pointer-events-none"></div>

           <div className="animate-marquee gap-6 shrink-0 w-max pr-6 pt-10 pb-10">
              {[...RECENT_ORDERS.slice(0, 5), ...RECENT_ORDERS.slice(0, 5), ...RECENT_ORDERS.slice(0, 5)].map((order, i) => (
                <div key={`row1-${order.id}-${i}`} className="w-64 h-80 relative group shrink-0 cursor-pointer z-10 hover:z-50">
                   {/* Back Cards for Fan Effect */}
                   <div className="absolute inset-0 rounded-[24px] bg-white dark:bg-zinc-800 shadow-md transition-all duration-500 origin-bottom-left group-hover:-rotate-6 group-hover:-translate-x-6 border border-gray-100 dark:border-white/5 opacity-0 group-hover:opacity-100"></div>
                   <div className="absolute inset-0 rounded-[24px] bg-white dark:bg-zinc-800 shadow-xl transition-all duration-500 origin-bottom-right group-hover:rotate-6 group-hover:translate-x-6 border border-gray-100 dark:border-white/5 opacity-0 group-hover:opacity-100"></div>
                   
                   {/* Main Card */}
                   <div className="absolute inset-0 rounded-[24px] overflow-hidden shadow-lg transition-transform duration-500 group-hover:-translate-y-4">
                      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${order.image})` }}></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 w-full p-5 text-left text-white">
                         <p className="text-xs uppercase tracking-widest text-[#C5A059] mb-1 font-semibold">{order.theme}</p>
                         <p className="font-serif text-lg">{order.names}</p>
                      </div>
                   </div>
                </div>
              ))}
           </div>
           
           <div className="animate-marquee-reverse gap-6 shrink-0 w-max pr-6 pt-10 pb-10">
              {[...RECENT_ORDERS.slice(5, 10), ...RECENT_ORDERS.slice(5, 10), ...RECENT_ORDERS.slice(5, 10)].map((order, i) => (
                <div key={`row2-${order.id}-${i}`} className="w-64 h-80 relative group shrink-0 cursor-pointer z-10 hover:z-50">
                   {/* Back Cards for Fan Effect */}
                   <div className="absolute inset-0 rounded-[24px] bg-white dark:bg-zinc-800 shadow-md transition-all duration-500 origin-bottom-left group-hover:-rotate-6 group-hover:-translate-x-6 border border-gray-100 dark:border-white/5 opacity-0 group-hover:opacity-100"></div>
                   <div className="absolute inset-0 rounded-[24px] bg-white dark:bg-zinc-800 shadow-xl transition-all duration-500 origin-bottom-right group-hover:rotate-6 group-hover:translate-x-6 border border-gray-100 dark:border-white/5 opacity-0 group-hover:opacity-100"></div>
                   
                   {/* Main Card */}
                   <div className="absolute inset-0 rounded-[24px] overflow-hidden shadow-lg transition-transform duration-500 group-hover:-translate-y-4">
                      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${order.image})` }}></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 w-full p-5 text-left text-white">
                         <p className="text-xs uppercase tracking-widest text-[#C5A059] mb-1 font-semibold">{order.theme}</p>
                         <p className="font-serif text-lg">{order.names}</p>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-24 px-6 lg:px-12 relative z-10">
         <div className="max-w-7xl mx-auto">
             <div className="flex flex-col items-center mb-16">
                 <Quote className="text-[#C5A059] w-12 h-12 mb-6 opacity-50" />
                 <h2 className="font-serif text-3xl md:text-4xl text-gray-900 dark:text-white mb-4 text-center">
                    {lang === 'id' ? 'Apa Kata Mereka?' : 'What They Say?'}
                 </h2>
             </div>
             
             {/* Testimonial Marquee / Sliding */}
             <div className="w-full overflow-hidden relative pb-10">
                {/* Left/Right Fade out */}
                <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-white dark:from-[#0A0A0B] to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-white dark:from-[#0A0A0B] to-transparent z-10 pointer-events-none"></div>

                <div className="animate-marquee gap-8 shrink-0 w-max pr-8">
                   {[...TESTIMONIALS, ...TESTIMONIALS].map((review, i) => (
                     <div key={`${review.id}-${i}`} className="w-[350px] md:w-[450px] p-8 md:p-10 rounded-[32px] glass-card border border-black/5 dark:border-white/10 shrink-0 whitespace-normal">
                         <div className="flex gap-1 mb-6 text-[#C5A059]">
                            {[...Array(review.rating)].map((_, i) => <Star key={i} size={18} fill="currentColor" /> )}
                         </div>
                         <p className="text-gray-700 dark:text-white/80 text-lg md:text-xl font-serif italic mb-8 leading-relaxed">
                            "{review.comment}"
                         </p>
                         <div className="flex items-center gap-4 border-t border-black/10 dark:border-white/10 pt-6">
                            <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059] font-bold font-serif">
                               {review.name.charAt(0)}
                            </div>
                            <div>
                               <p className="font-semibold text-gray-900 dark:text-white text-sm">{review.name}</p>
                            </div>
                         </div>
                     </div>
                   ))}
                </div>
             </div>
         </div>
      </div>

    </div>
  );
}
