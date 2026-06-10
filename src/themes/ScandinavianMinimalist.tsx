import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SmoothScrollLayout from '../components/Interactive/SmoothScrollLayout';
import AudioController from '../components/Interactive/AudioController';
import { Calendar, Clock, MapPin, Heart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function ScandinavianMinimalist() {
  const [isOpened, setIsOpened] = useState(false);
  
  const groom = "Daniel";
  const bride = "Sophia";
  const date = "24 October 2026";
  const location = "The Glasshouse, Stockholm";

  useEffect(() => {
    if (!isOpened) return;

    // Simple Fade & Elegant Scroll Reveal
    const elements = gsap.utils.toArray('.scandi-reveal');
    elements.forEach((el: any) => {
      gsap.fromTo(el, 
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          }
        }
      );
    });

    // Parallax on Grid Images
    const images = gsap.utils.toArray('.scandi-parallax');
    images.forEach((img: any) => {
      gsap.to(img, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: img.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });
  }, [isOpened]);

  return (
    <SmoothScrollLayout>
      <div className="bg-[#F9F9F7] min-h-screen text-[#2D2D2D] font-sans selection:bg-[#E5E0D8] selection:text-black">
        
        {/* Audio Controller */}
        {isOpened && (
          <AudioController src="https://assets.mixkit.co/music/preview/mixkit-relaxing-light-piano-music-421.mp3" />
        )}

        {/* Minimalist Opening Screen */}
        <AnimatePresence>
          {!isOpened && (
            <motion.div 
              exit={{ opacity: 0, y: '-100%' }}
              transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 bg-[#F9F9F7]"
            >
              <div className="relative z-10 text-center flex flex-col items-center w-full max-w-md">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="w-full aspect-[3/4] mb-12 overflow-hidden bg-[#EAE8E3]"
                >
                  <img src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80" alt="Cover" className="w-full h-full object-cover opacity-90" />
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="text-4xl md:text-5xl font-light tracking-tight mb-4 text-[#1A1A1A]"
                  style={{ fontFamily: '"Inter", sans-serif' }}
                >
                  {groom} & {bride}
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="text-[#7A7A7A] tracking-[0.2em] uppercase text-xs mb-12"
                >
                  We invite you to celebrate with us
                </motion.p>
                
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 1 }}
                  onClick={() => setIsOpened(true)}
                  className="group relative px-8 py-3 overflow-hidden text-xs uppercase tracking-widest font-medium border border-[#D1CEC5] hover:border-[#1A1A1A] transition-colors duration-500 text-[#1A1A1A]"
                >
                  <span className="relative z-10">Open Invitation</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        {isOpened && (
          <div className="relative z-10 pb-32">
            
            {/* Hero Section */}
            <section className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                className="max-w-3xl mx-auto w-full pt-20"
              >
                <p className="text-[#8B8881] text-xs uppercase tracking-[0.3em] mb-8 font-medium">The Wedding Celebration</p>
                
                <h1 className="text-6xl md:text-8xl font-light tracking-tighter text-[#1A1A1A] mb-6 leading-none">
                  {groom} <br/> <span className="text-[#A39E93] font-serif italic text-5xl md:text-7xl">&</span> <br/> {bride}
                </h1>
                
                <div className="mt-20 w-[1px] h-24 bg-[#D1CEC5] mx-auto origin-top" />
              </motion.div>
            </section>

            {/* Quote / Introduction */}
            <section className="py-32 px-6 scandi-reveal">
              <div className="max-w-2xl mx-auto text-center">
                <p className="text-xl md:text-3xl font-light text-[#4A4A4A] leading-relaxed tracking-tight">
                  "In the simplicity of everyday life, we found an extraordinary love. A love built on quiet mornings, shared silence, and a deep understanding."
                </p>
              </div>
            </section>

            {/* Gallery Grid - Clean 4 Photos */}
            <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto scandi-reveal">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                {[
                  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80"
                ].map((img, i) => (
                  <div key={i} className={`overflow-hidden bg-[#EAE8E3] ${i === 0 || i === 3 ? 'aspect-[4/5]' : 'aspect-square'} relative group`}>
                    <div className="w-full h-[130%] -top-[15%] absolute">
                      <img src={img} alt="Gallery" className="w-full h-full object-cover scandi-parallax opacity-90 transition-opacity duration-700 group-hover:opacity-100 grayscale hover:grayscale-0" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Event Details */}
            <section className="py-32 px-6 bg-white scandi-reveal">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-light tracking-tight text-center mb-24">The Details</h2>
                
                <div className="grid md:grid-cols-2 gap-16 md:gap-24">
                  <div className="flex flex-col text-center md:text-left">
                    <p className="text-[#8B8881] text-xs uppercase tracking-[0.2em] mb-6">The Ceremony</p>
                    <h3 className="text-2xl font-light text-[#1A1A1A] mb-8">Exchange of Vows</h3>
                    <div className="space-y-4 text-[#4A4A4A] font-light">
                      <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4">
                        <Calendar size={18} className="text-[#A39E93] shrink-0" />
                        <p>{date}</p>
                      </div>
                      <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4">
                        <Clock size={18} className="text-[#A39E93] shrink-0" />
                        <p>10:00 AM</p>
                      </div>
                      <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4">
                        <MapPin size={18} className="text-[#A39E93] shrink-0" />
                        <p>{location}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col text-center md:text-left">
                    <p className="text-[#8B8881] text-xs uppercase tracking-[0.2em] mb-6">The Reception</p>
                    <h3 className="text-2xl font-light text-[#1A1A1A] mb-8">Dinner & Celebration</h3>
                    <div className="space-y-4 text-[#4A4A4A] font-light">
                      <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4">
                        <Calendar size={18} className="text-[#A39E93] shrink-0" />
                        <p>{date}</p>
                      </div>
                      <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4">
                        <Clock size={18} className="text-[#A39E93] shrink-0" />
                        <p>06:00 PM</p>
                      </div>
                      <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4">
                        <MapPin size={18} className="text-[#A39E93] shrink-0" />
                        <p>{location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* RSVP Form */}
            <section className="py-32 px-6 scandi-reveal">
              <div className="max-w-xl mx-auto bg-[#EAE8E3]/30 p-8 md:p-16">
                <h2 className="text-3xl font-light tracking-tight text-center mb-12">R.S.V.P</h2>
                <p className="text-center text-[#7A7A7A] mb-12 text-sm">Please let us know your presence by October 1st.</p>
                
                <form className="space-y-8">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#4A4A4A] mb-2">Guest Name</label>
                    <input type="text" className="w-full bg-transparent border-b border-[#D1CEC5] px-0 py-3 focus:outline-none focus:border-[#1A1A1A] transition-colors text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#4A4A4A] mb-2">Attendance</label>
                    <select className="w-full bg-transparent border-b border-[#D1CEC5] px-0 py-3 focus:outline-none focus:border-[#1A1A1A] transition-colors text-sm appearance-none">
                      <option value="yes">Gladly Accept</option>
                      <option value="no">Regretfully Decline</option>
                    </select>
                  </div>
                  <button type="button" className="w-full bg-[#1A1A1A] text-white py-4 uppercase tracking-[0.2em] text-xs font-medium hover:bg-[#333] transition-colors duration-300 mt-8">
                    Send Reply
                  </button>
                </form>
              </div>
            </section>
            
            {/* Footer */}
            <footer className="pt-24 pb-12 text-center text-[#A39E93] text-xs uppercase tracking-[0.3em] scandi-reveal">
              <p>Looking forward to celebrating with you.</p>
              <p className="mt-4 text-[#1A1A1A] font-serif italic text-lg">{groom} & {bride}</p>
            </footer>
          </div>
        )}
      </div>
    </SmoothScrollLayout>
  );
}
