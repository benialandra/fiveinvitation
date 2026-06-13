import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SmoothScrollLayout from '../../components/Interactive/SmoothScrollLayout';
import AudioController from '../../components/Interactive/AudioController';
import { Calendar, Clock, MapPin, Film, Video } from 'lucide-react';
import Countdown from '../../components/Theme/Countdown';
import Gift from '../../components/Theme/Gift';

gsap.registerPlugin(ScrollTrigger);

interface ThemeProps {
  data?: any;
  guestName?: string;
  lang?: 'en' | 'id';
}

export default function CinematicLoveStory({ data, guestName, lang = 'id' }: ThemeProps) {
  const [isOpened, setIsOpened] = useState(false);

  const groom = data?.groom_name || "Daniel";
  const bride = data?.bride_name || "Emma";
  const date = data?.akad_date ? new Date(data.akad_date).toLocaleDateString() : "14 February 2027";
  const location = data?.location_name || "Grand Cinema Theater, LA";

  const coverImg = data?.cover_image || "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=60&fm=webp&q=60";
  const groomImg = data?.groom_image || data?.gallery_1 || "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=60&fm=webp&q=60";
  const brideImg = data?.bride_image || data?.gallery_2 || "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=60&fm=webp&q=60";

  const gallery1 = data?.gallery_1 || "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=60&fm=webp&q=60";
  const gallery2 = data?.gallery_2 || "https://images.unsplash.com/photo-1544078755-9eeceba196a8?auto=format&fit=crop&q=60&fm=webp&q=60";
  const gallery3 = data?.gallery_3 || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=60&fm=webp&q=60";
  const gallery4 = data?.gallery_4 || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=60&fm=webp&q=60";

  // Video background source (using a placeholder romantic cinematic video)
  const videoBg = "https://player.vimeo.com/external/494241777.sd.mp4?s=d0092f69e98418012bb298d022b72cfefab83fba&profile_id=165&oauth2_token_id=57447761";

  useEffect(() => {
    if (!isOpened) return;

    // Cinematic Fade Up for Sections
    const sections = gsap.utils.toArray('.cinematic-section');
    sections.forEach((sec: any) => {
      gsap.fromTo(sec, 
        { y: 100, opacity: 0, filter: 'blur(10px)' },
        {
          y: 0, opacity: 1, filter: 'blur(0px)',
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sec,
            start: 'top 80%',
          }
        }
      );
    });

    // Parallax for images
    const images = gsap.utils.toArray('.ken-burns-img');
    images.forEach((img: any) => {
      gsap.to(img, {
        scale: 1.15,
        ease: 'none',
        scrollTrigger: {
          trigger: img.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    });
  }, [isOpened]);

  return (
    <SmoothScrollLayout>
      <div className="bg-[#0A0503] min-h-screen text-white/90 font-sans overflow-hidden">
        
        {/* Audio Controller */}
        {isOpened && (
          <AudioController src={data?.music_url || "https://assets.mixkit.co/music/preview/mixkit-beautiful-dream-493.mp3"} />
        )}

        {/* Opening Screen - Cinematic Reveal */}
        <AnimatePresence>
          {!isOpened && (
            <motion.div 
              exit={{ opacity: 0, filter: 'blur(20px)' }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 bg-[#050201]"
            >
              <div className="absolute inset-0">
                <img loading="lazy" src={coverImg} alt="Cinematic Cover" className="w-full h-full object-cover opacity-30 mix-blend-luminosity" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0503] via-[#0A0503]/50 to-transparent" />
              </div>
              
              <div className="relative z-10 text-center flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="mb-8"
                >
                  <Film size={48} className="text-[#E58D57] opacity-80" />
                </motion.div>

                <motion.p 
                  initial={{ opacity: 0, letterSpacing: '0em' }}
                  animate={{ opacity: 1, letterSpacing: '0.5em' }}
                  transition={{ duration: 2, delay: 0.5 }}
                  className="text-[#E58D57] text-xs uppercase mb-4"
                >
                  A Real Life Romance
                </motion.p>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.5, delay: 1 }}
                  className="text-5xl md:text-7xl font-light text-white mb-12 uppercase tracking-widest"
                  style={{ fontFamily: '"Cinzel", "Playfair Display", serif' }}
                >
                  {groom} <br/> <span className="text-[#E58D57] text-3xl italic normal-case font-serif">&</span> <br/> {bride}
                </motion.h1>
                
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5, duration: 1 }}
                  onClick={() => setIsOpened(true)}
                  className="group relative px-10 py-4 overflow-hidden rounded-sm border border-[#E58D57]/50 uppercase tracking-[0.3em] text-xs font-semibold"
                >
                  <div className="absolute inset-0 bg-[#E58D57] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                  <span className="relative z-10 group-hover:text-black transition-colors duration-500 flex items-center gap-3">
                    <Video size={16} /> Play Trailer
                  </span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Container */}
        {isOpened && (
          <div className="relative z-10">
            
            {/* Hero Section with Video Background */}
            <section className="relative h-screen flex items-center justify-center text-center p-6 overflow-hidden">
              <div className="absolute inset-0 z-0">
                <video 
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                  className="w-full h-full object-cover opacity-40 mix-blend-screen"
                >
                  <source src={videoBg} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0503] via-[#0A0503]/40 to-transparent" />
                <div className="absolute inset-0 bg-[#E58D57] mix-blend-overlay opacity-20" />
              </div>
              
              <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
                <motion.div 
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  className="w-full"
                >
                  <div className="flex justify-between items-center text-[#E58D57] text-xs uppercase tracking-widest mb-12 border-y border-[#E58D57]/30 py-4">
                    <span>Directed by Destiny</span>
                    <span>Starring</span>
                    <span>Based on a True Story</span>
                  </div>

                  <h1 className="text-7xl md:text-9xl uppercase font-light tracking-tighter mb-4" style={{ fontFamily: '"Cinzel", "Playfair Display", serif' }}>
                    {groom}
                  </h1>
                  <p className="text-[#E58D57] text-4xl italic font-serif my-2">&</p>
                  <h1 className="text-7xl md:text-9xl uppercase font-light tracking-tighter mb-12" style={{ fontFamily: '"Cinzel", "Playfair Display", serif' }}>
                    {bride}
                  </h1>

                  <div className="text-sm uppercase tracking-[0.5em] text-white/70">
                    Coming to Theaters
                    <br />
                    <span className="text-[#E58D57] mt-2 block">{date}</span>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Love Story - Film Strip Layout */}
            <section className="py-32 px-6 cinematic-section">
              <div className="text-center mb-20">
                <p className="text-[#E58D57] text-sm uppercase tracking-[0.4em] mb-4">Act I</p>
                <h2 className="text-4xl md:text-5xl uppercase tracking-widest font-light" style={{ fontFamily: '"Cinzel", serif' }}>The Story</h2>
              </div>
              
              <div className="max-w-3xl mx-auto space-y-32">
                {[
                  {
                    img: groomImg,
                    title: "The Meet Cute",
                    desc: "It started like any classic romance—a chance encounter in a crowded room, a lingering glance, and a spark that ignited a fire.",
                    time: "Scene 01"
                  },
                  {
                    img: brideImg,
                    title: "The Plot Thickens",
                    desc: "Through late-night drives and endless conversations, we realized this wasn't just a fleeting moment. It was the script of our lives.",
                    time: "Scene 02"
                  }
                ].map((item, i) => (
                  <div key={i} className={`flex flex-col ${i % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 group`}>
                    <div className="w-full md:w-1/2 aspect-video overflow-hidden relative border border-white/10 p-2 bg-[#111]">
                      {/* Film holes decoration */}
                      <div className="absolute top-0 bottom-0 left-0 w-2 bg-black flex flex-col justify-between py-2 z-20">
                        {[...Array(6)].map((_, idx) => <div key={idx} className="w-1.5 h-2 bg-[#0A0503] mx-auto rounded-sm" />)}
                      </div>
                      <div className="absolute top-0 bottom-0 right-0 w-2 bg-black flex flex-col justify-between py-2 z-20">
                        {[...Array(6)].map((_, idx) => <div key={idx} className="w-1.5 h-2 bg-[#0A0503] mx-auto rounded-sm" />)}
                      </div>
                      
                      <div className="w-full h-full overflow-hidden relative">
                        <div className="absolute inset-0 bg-[#E58D57] mix-blend-color opacity-20 z-10 transition-opacity duration-700 group-hover:opacity-0" />
                        <img loading="lazy" src={item.img} alt={item.title} className="w-full h-full object-cover ken-burns-img grayscale group-hover:grayscale-0 transition-all duration-1000" />
                      </div>
                    </div>
                    <div className="w-full md:w-1/2 text-center md:text-left">
                      <p className="text-[#E58D57] text-xs uppercase tracking-widest mb-2 font-mono">{item.time}</p>
                      <h3 className="text-3xl font-light mb-4 uppercase tracking-wider" style={{ fontFamily: '"Cinzel", serif' }}>{item.title}</h3>
                      <p className="text-white/60 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Gallery - Cinematic Scenes */}
            <section className="py-24 bg-[#050201] cinematic-section">
              <div className="text-center mb-20 px-6">
                 <p className="text-[#E58D57] text-sm uppercase tracking-[0.4em] mb-4">Act II</p>
                <h2 className="text-4xl md:text-5xl uppercase tracking-widest font-light" style={{ fontFamily: '"Cinzel", serif' }}>Behind The Scenes</h2>
              </div>

              <div className="flex flex-col gap-2">
                {[gallery1, gallery2, gallery3, gallery4].map((img, i) => (
                  <div key={i} className="w-full h-[50vh] md:h-[70vh] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-700 z-10" />
                    <img loading="lazy" src={img} alt="Scene" className="w-full h-full object-cover ken-burns-img" />
                    <div className="absolute bottom-8 left-8 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      <p className="text-[#E58D57] font-mono text-xs tracking-widest">SCENE. {String(i+1).padStart(2, '0')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Event Details */}
            <section className="py-32 px-6 cinematic-section relative">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1485001564903-56e6a54d46ce?auto=format&fit=crop&q=60&fm=webp&q=60')] bg-cover bg-fixed opacity-5 grayscale" />
              
              <div className="max-w-4xl mx-auto text-center relative z-10">
                <p className="text-[#E58D57] text-sm uppercase tracking-[0.4em] mb-4">Act III</p>
                <h2 className="text-4xl md:text-5xl uppercase tracking-widest font-light mb-20" style={{ fontFamily: '"Cinzel", serif' }}>The Premiere</h2>
                
                <div className="grid md:grid-cols-2 gap-8 text-left">
                  <div className="p-10 border border-white/10 bg-black/40 backdrop-blur-md relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E58D57] to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <h3 className="text-2xl uppercase tracking-widest mb-8 text-[#E58D57]" style={{ fontFamily: '"Cinzel", serif' }}>The Vows</h3>
                    <div className="space-y-6 text-white/70">
                      <div className="flex items-start gap-4">
                        <Calendar className="text-white/40 mt-1" size={20} />
                        <div>
                          <p className="text-white uppercase tracking-wider text-sm mb-1">Date</p>
                          <p>{date}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <Clock className="text-white/40 mt-1" size={20} />
                        <div>
                          <p className="text-white uppercase tracking-wider text-sm mb-1">Time</p>
                          <p>15:00 - 17:00</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <MapPin className="text-white/40 mt-1" size={20} />
                        <div>
                          <p className="text-white uppercase tracking-wider text-sm mb-1">Location</p>
                          <p>{location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-10 border border-white/10 bg-black/40 backdrop-blur-md relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E58D57] to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 delay-100" />
                    <h3 className="text-2xl uppercase tracking-widest mb-8 text-[#E58D57]" style={{ fontFamily: '"Cinzel", serif' }}>The Celebration</h3>
                    <div className="space-y-6 text-white/70">
                      <div className="flex items-start gap-4">
                        <Calendar className="text-white/40 mt-1" size={20} />
                        <div>
                          <p className="text-white uppercase tracking-wider text-sm mb-1">Date</p>
                          <p>{date}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <Clock className="text-white/40 mt-1" size={20} />
                        <div>
                          <p className="text-white uppercase tracking-wider text-sm mb-1">Time</p>
                          <p>19:00 - End</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <MapPin className="text-white/40 mt-1" size={20} />
                        <div>
                          <p className="text-white uppercase tracking-wider text-sm mb-1">Location</p>
                          <p>The Grand Ballroom, LA</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* RSVP */}
            <section className="py-32 px-6 bg-[#050201] cinematic-section">
              <div className="max-w-xl mx-auto text-center">
                <p className="text-[#E58D57] text-sm uppercase tracking-[0.4em] mb-4">Finale</p>
                <h2 className="text-4xl md:text-5xl uppercase tracking-widest font-light mb-8" style={{ fontFamily: '"Cinzel", serif' }}>Reserve Your Seat</h2>
                <p className="text-white/50 mb-12 uppercase tracking-widest text-xs">Admit One • VIP Access Only</p>
                
                <form className="space-y-6 text-left">
                  <div>
                    <input type="text" placeholder="GUEST NAME" className="w-full bg-transparent border-b border-white/20 px-0 py-4 focus:outline-none focus:border-[#E58D57] transition-colors uppercase tracking-widest text-sm placeholder-white/30" />
                  </div>
                  <div>
                    <select className="w-full bg-transparent border-b border-white/20 px-0 py-4 focus:outline-none focus:border-[#E58D57] transition-colors uppercase tracking-widest text-sm text-white/70 appearance-none">
                      <option className="bg-[#111]">WILL ATTEND PREMIERE</option>
                      <option className="bg-[#111]">CANNOT MAKE IT</option>
                    </select>
                  </div>
                  <button type="button" className="w-full mt-8 bg-[#E58D57] text-black py-4 uppercase tracking-[0.3em] text-xs font-bold hover:bg-white transition-colors duration-500">
                    Submit RSVP
                  </button>
                </form>
              </div>
            </section>
            
            {/* Footer / End Credits */}
            
          {/* Auto-injected missing sections */}
          <div className="w-full relative z-20">
            <Countdown data={data} lang="id" />
            <Gift data={data} lang="id" />
          </div>
          <footer className="py-24 text-center text-white/40 text-xs uppercase tracking-[0.4em] cinematic-section bg-black">
              <p className="mb-4 text-[#E58D57]">The End</p>
              <p>Produced by {groom} & {bride}</p>
              <p className="mt-8 opacity-50 text-[10px]">&copy; 2027 A Love Story Production. All Rights Reserved.</p>
            </footer>
          </div>
        )}
      </div>
    </SmoothScrollLayout>
  );
}
