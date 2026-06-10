import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SmoothScrollLayout from '../components/Interactive/SmoothScrollLayout';
import AudioController from '../components/Interactive/AudioController';
import { Calendar, Clock, MapPin, CheckCircle, Heart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// 3D Sakura Particles Background
// ==========================================
const SakuraBackground = (props: any) => {
  const ref = useRef<any>(null);
  const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }));

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 20;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial transparent color="#FFB7C5" size={0.008} sizeAttenuation={true} depthWrite={false} />
      </Points>
    </group>
  );
};

// ==========================================
// Main Component
// ==========================================
export default function JapaneseSakuraGarden() {
  const [isOpened, setIsOpened] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  
  // Data
  const groom = "Kenji";
  const bride = "Sakura";
  const date = "12 November 2026";
  const location = "Kyoto Botanical Gardens, Japan";

  // GSAP Scroll Animations
  useEffect(() => {
    if (!isOpened) return;

    const sections = gsap.utils.toArray('.gsap-section');
    sections.forEach((sec: any) => {
      gsap.fromTo(sec, 
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sec,
            start: 'top 85%',
          }
        }
      );
    });
  }, [isOpened]);

  // Custom Cursor Logic
  useEffect(() => {
    const moveCursor = (e: MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  const handleOpen = () => {
    setIsOpened(true);
    // Audio is handled by AudioController setting autoPlay
  };

  return (
    <SmoothScrollLayout>
      {/* Custom Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-[#FFB7C5] pointer-events-none z-[999] mix-blend-difference"
        animate={{
          x: cursorPos.x - 16,
          y: cursorPos.y - 16,
          scale: isHovering ? 2 : 1,
          backgroundColor: isHovering ? 'rgba(255, 183, 197, 0.2)' : 'transparent'
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 28, mass: 0.5 }}
      />

      <div className="bg-[#FAF7F2] min-h-screen text-[#4A4A4A] overflow-hidden font-sans relative">
        
        {/* 3D Background */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-60">
          <Canvas camera={{ position: [0, 0, 1] }}>
            <SakuraBackground />
          </Canvas>
        </div>

        {/* Audio Controller */}
        {isOpened && (
          // In a real scenario, use a valid URL like: https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3
          <AudioController src="https://assets.mixkit.co/music/preview/mixkit-beautiful-dream-493.mp3" />
        )}

        {/* Opening Screen */}
        <AnimatePresence>
          {!isOpened && (
            <motion.div 
              exit={{ y: '-100%', opacity: 0 }}
              transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 bg-[#FAF7F2]"
            >
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] via-transparent to-[#FAF7F2]" />
              
              <div className="relative z-10 text-center flex flex-col items-center">
                <motion.p 
                  initial={{ opacity: 0, letterSpacing: '0em' }}
                  animate={{ opacity: 1, letterSpacing: '0.4em' }}
                  transition={{ duration: 2, delay: 0.5 }}
                  className="text-[#D88A9A] text-sm uppercase mb-6"
                >
                  The Wedding Of
                </motion.p>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.5, delay: 1 }}
                  className="text-6xl md:text-8xl font-light text-[#4A4A4A] mb-12"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  {groom} <span className="text-[#D88A9A]">&</span> {bride}
                </motion.h1>
                
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2, duration: 1 }}
                  onClick={handleOpen}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  className="px-8 py-3 rounded-full border border-[#D88A9A] text-[#D88A9A] hover:bg-[#D88A9A] hover:text-white transition-all duration-500 tracking-widest text-sm"
                >
                  OPEN INVITATION
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Container */}
        {isOpened && (
          <div className="relative z-10">
            {/* Hero Section */}
            <section className="min-h-screen flex items-center justify-center text-center p-6 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FAF7F2]" />
              <div className="relative z-10">
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="text-sm uppercase tracking-widest text-[#D88A9A] mb-4"
                >
                  We Are Getting Married
                </motion.p>
                <motion.h1 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.5, delay: 0.8 }}
                  className="text-7xl md:text-9xl font-light mb-6"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  {groom} & {bride}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1.5 }}
                  className="text-lg text-[#6A6A6A] italic"
                >
                  {date}
                </motion.p>
              </div>
            </section>

            {/* Love Story Section */}
            <section className="py-24 px-6 max-w-4xl mx-auto gsap-section">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-light text-[#D88A9A] mb-4" style={{ fontFamily: '"Playfair Display", serif' }}>Our Story</h2>
                <div className="w-16 h-px bg-[#D88A9A] mx-auto" />
              </div>
              
              <div className="space-y-12">
                {[
                  { year: '2023', title: 'First Met', desc: 'Under the blooming sakura trees in Kyoto, our eyes met and time stood still.' },
                  { year: '2024', title: 'The Proposal', desc: 'A magical evening filled with promises of forever, surrounded by falling petals.' },
                  { year: '2026', title: 'Tying The Knot', desc: 'Join us as we begin our greatest adventure together.' }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col md:flex-row gap-6 items-center text-center md:text-left bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-[#FFB7C5]/30 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-3xl font-light text-[#D88A9A] md:w-32">{item.year}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-medium mb-2">{item.title}</h3>
                      <p className="text-[#6A6A6A] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Gallery Section */}
            <section className="py-24 px-6 max-w-6xl mx-auto gsap-section">
               <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-light text-[#D88A9A] mb-4" style={{ fontFamily: '"Playfair Display", serif' }}>Gallery</h2>
                <div className="w-16 h-px bg-[#D88A9A] mx-auto" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1544078755-9eeceba196a8?auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80"
                ].map((img, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.02, rotateY: i % 2 === 0 ? 5 : -5, rotateX: 5 }}
                    className="aspect-[4/5] overflow-hidden rounded-2xl shadow-lg relative group cursor-none"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <img src={img} alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-[#D88A9A] mix-blend-color opacity-20 group-hover:opacity-0 transition-opacity duration-500" />
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Event Details */}
            <section className="py-24 bg-white/40 backdrop-blur-md gsap-section border-y border-[#FFB7C5]/30">
              <div className="max-w-4xl mx-auto px-6 text-center">
                <h2 className="text-4xl md:text-5xl font-light text-[#D88A9A] mb-16" style={{ fontFamily: '"Playfair Display", serif' }}>Wedding Events</h2>
                
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="p-8 rounded-3xl bg-white/60 shadow-sm border border-[#FFB7C5]/20">
                    <h3 className="text-2xl font-medium mb-6">Holy Matrimony</h3>
                    <div className="space-y-4 text-[#6A6A6A]">
                      <p className="flex items-center justify-center gap-2"><Calendar size={18} className="text-[#D88A9A]"/> Saturday, 12 Nov 2026</p>
                      <p className="flex items-center justify-center gap-2"><Clock size={18} className="text-[#D88A9A]"/> 08:00 - 10:00 JST</p>
                      <p className="flex items-center justify-center gap-2"><MapPin size={18} className="text-[#D88A9A]"/> Kyoto Botanical Gardens</p>
                    </div>
                  </div>
                  
                  <div className="p-8 rounded-3xl bg-white/60 shadow-sm border border-[#FFB7C5]/20">
                    <h3 className="text-2xl font-medium mb-6">Wedding Reception</h3>
                    <div className="space-y-4 text-[#6A6A6A]">
                      <p className="flex items-center justify-center gap-2"><Calendar size={18} className="text-[#D88A9A]"/> Saturday, 12 Nov 2026</p>
                      <p className="flex items-center justify-center gap-2"><Clock size={18} className="text-[#D88A9A]"/> 19:00 - 22:00 JST</p>
                      <p className="flex items-center justify-center gap-2"><MapPin size={18} className="text-[#D88A9A]"/> The Ritz-Carlton, Kyoto</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* RSVP */}
            <section className="py-24 px-6 max-w-2xl mx-auto text-center gsap-section">
              <h2 className="text-4xl md:text-5xl font-light text-[#D88A9A] mb-8" style={{ fontFamily: '"Playfair Display", serif' }}>RSVP</h2>
              <p className="text-[#6A6A6A] mb-12">We would be honored to have you celebrate with us.</p>
              
              <form className="space-y-6 text-left">
                <div>
                  <input type="text" placeholder="Full Name" className="w-full bg-white/50 border border-[#FFB7C5]/50 rounded-xl px-4 py-3 focus:outline-none focus:border-[#D88A9A] transition-colors" />
                </div>
                <div>
                  <select className="w-full bg-white/50 border border-[#FFB7C5]/50 rounded-xl px-4 py-3 focus:outline-none focus:border-[#D88A9A] transition-colors appearance-none text-[#6A6A6A]">
                    <option>Will Attend</option>
                    <option>Unable to Attend</option>
                  </select>
                </div>
                <button 
                  type="button"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  className="w-full bg-[#D88A9A] text-white rounded-xl py-4 font-medium tracking-wide hover:bg-[#c27685] transition-colors"
                >
                  CONFIRM ATTENDANCE
                </button>
              </form>
            </section>
            
            {/* Footer */}
            <footer className="py-12 text-center text-[#6A6A6A] text-sm gsap-section">
              <Heart className="mx-auto mb-4 text-[#D88A9A]" size={20} />
              <p>Made with love</p>
              <p className="mt-2 text-[#D88A9A]">Kenji & Sakura</p>
            </footer>
          </div>
        )}
      </div>
    </SmoothScrollLayout>
  );
}
