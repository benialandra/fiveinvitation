import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import toast from 'react-hot-toast';
import AudioController from '../components/Interactive/AudioController';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// ==========================================
// 3D Background Particles Component
// ==========================================
const StarsBackground = (props: any) => {
  const ref = useRef<any>(null);
  
  // Generate random points in a sphere
  const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }));

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial transparent color="#D4AF37" size={0.005} sizeAttenuation={true} depthWrite={false} />
      </Points>
    </group>
  );
};

// ==========================================
// Custom Cursor Component
// ==========================================
const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: 'power3.out'
      });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'button' || target.tagName.toLowerCase() === 'a' || target.closest('button') || target.closest('a')) {
        gsap.to(cursorRef.current, { scale: 2.5, backgroundColor: 'rgba(212, 175, 55, 0.2)', border: '1px solid rgba(212, 175, 55, 0.8)', duration: 0.3 });
      } else {
        gsap.to(cursorRef.current, { scale: 1, backgroundColor: 'rgba(212, 175, 55, 1)', border: 'none', duration: 0.3 });
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div 
      ref={cursorRef} 
      className="fixed top-0 left-0 w-4 h-4 bg-[#D4AF37] rounded-full pointer-events-none z-[9999] mix-blend-difference transform -translate-x-1/2 -translate-y-1/2 hidden md:block"
    />
  );
};

// ==========================================
// Main Theme Component
// ==========================================
export default function UltraPremiumInteractive({ data, guestName }: { data?: any, guestName?: string }) {
  const groom = data?.groom_name || 'Alexander';
  const bride = data?.bride_name || 'Isabella';
  const displayGuest = guestName || 'Esteemed Guest';

  const coverImg = data?.cover_image || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=60&w=2000&auto=format&fit=crop&fm=webp&q=60";
  const heroImg = data?.hero_image || "https://images.unsplash.com/photo-1544078754-0a3791001a1c?q=60&w=2000&auto=format&fit=crop&fm=webp&q=60";
  const gal1 = data?.gallery_1 || "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=60&w=800&auto=format&fit=crop&fm=webp&q=60";
  const gal2 = data?.gallery_2 || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=60&w=800&auto=format&fit=crop&fm=webp&q=60";
  const gal3 = data?.gallery_3 || "https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=800&auto=format&fit=crop&fm=webp&q=60";
  const gal4 = data?.gallery_4 || "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=60&w=800&auto=format&fit=crop&fm=webp&q=60";

  const [isOpened, setIsOpened] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Smooth Scroll Initialization
  useEffect(() => {
    if (!isOpened) return;
    
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Initialize GSAP animations for sections
    const sections = gsap.utils.toArray('.gsap-section');
    sections.forEach((section: any) => {
      gsap.fromTo(section, 
        { opacity: 0, y: 100 },
        {
          opacity: 1, 
          y: 0,
          duration: 1.5,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [isOpened]);

  // Framer Motion Parallax for Hero
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // 3D Tilt Effect on Photos
  const tiltRef = useRef<HTMLDivElement>(null);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    
    gsap.to(ref.current, {
      rotationY: x * 20,
      rotationX: -y * 20,
      ease: 'power2.out',
      duration: 0.5,
      transformPerspective: 1000
    });
  };

  const handleMouseLeave = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      rotationY: 0,
      rotationX: 0,
      ease: 'power3.out',
      duration: 1
    });
  };

  return (
    <div className="relative bg-[#050505] text-white font-sans overflow-x-hidden min-h-screen selection:bg-[#D4AF37] selection:text-black">
      <CustomCursor />
      {isOpened && <AudioController src={data?.music_url || "https://assets.mixkit.co/music/preview/mixkit-beautiful-dream-493.mp3"} />}

      {/* Cinematic Reveal Cover */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div 
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 bg-[#050505]"
          >
            <div className="absolute inset-0">
              <img src={coverImg} className="w-full h-full object-cover opacity-30" alt="Cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
            </div>
            
            <div className="relative z-10 text-center">
              <motion.p 
                initial={{ opacity: 0, letterSpacing: '0em' }}
                animate={{ opacity: 1, letterSpacing: '0.4em' }}
                transition={{ duration: 2, delay: 0.5 }}
                className="text-[#D4AF37] text-xs uppercase mb-6 font-sans"
              >
                The Wedding Of
              </motion.p>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 1 }}
                className="text-5xl md:text-7xl font-light text-white mb-8"
              >
                {groom} <span className="text-[#D4AF37] italic">&</span> {bride}
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 2 }}
              >
                <p className="text-sm text-gray-400 mb-2 font-sans">Dear,</p>
                <p className="text-2xl text-white mb-10">{displayGuest}</p>
                
                <button 
                  onClick={() => setIsOpened(true)}
                  className="px-10 py-4 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-all duration-500 font-sans tracking-[0.2em] text-xs uppercase group overflow-hidden relative"
                >
                  <span className="relative z-10">Enter Experience</span>
                  <div className="absolute inset-0 bg-[#D4AF37] transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out z-0" />
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`relative transition-opacity duration-1000 ${isOpened ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'}`}>
        
        {/* Persistent 3D Background Canvas */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
          <Canvas camera={{ position: [0, 0, 1] }}>
            <Suspense fallback={null}>
              <StarsBackground />
            </Suspense>
          </Canvas>
        </div>

        {/* Dynamic Animated Gradient Overlay */}
        <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0A0A0A]/80 to-[#0A0A0A] opacity-90" />

        {/* Hero Section */}
        <motion.section 
          style={{ y: yHero, opacity: opacityHero }}
          className="relative min-h-screen flex items-center justify-center p-6 z-10"
        >
          <div className="text-center">
            <h2 className="text-7xl md:text-[10rem] font-light text-white mix-blend-difference leading-none mb-6">
              {groom}
              <br/>
              <span className="text-5xl md:text-8xl italic text-[#D4AF37] block my-2">&</span>
              {bride}
            </h2>
            <div className="w-px h-32 bg-gradient-to-b from-[#D4AF37] to-transparent mx-auto mt-12 animate-pulse" />
          </div>
        </motion.section>

        {/* Story Section - GSAP ScrollTrigger */}
        <section className="gsap-section min-h-screen flex items-center justify-center py-24 px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-3xl md:text-5xl leading-snug font-light italic text-gray-300">
              "We decided on forever, and forever starts today. A journey of a thousand miles begins with a single step, taken together."
            </p>
          </div>
        </section>

        {/* 3D Tilt Gallery Section */}
        <section className="gsap-section py-24 px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-center text-[#D4AF37] font-sans tracking-[0.3em] uppercase text-sm mb-16">The Gallery</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Photo 1 */}
              <div 
                className="relative aspect-[3/4] group perspective-[1000px]"
                onMouseMove={(e) => handleMouseMove(e, tiltRef)}
                onMouseLeave={() => handleMouseLeave(tiltRef)}
              >
                <div ref={tiltRef} className="w-full h-full relative transition-transform duration-200 ease-out transform-style-3d">
                  <img src={gal1} alt="Gallery 1" className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700" />
                  <div className="absolute inset-0 border border-[#D4AF37]/50 m-4 pointer-events-none transform translate-z-[50px]" />
                </div>
              </div>
              
              {/* Photo 2 */}
              <div className="relative aspect-[4/3] md:mt-24 group perspective-[1000px]">
                <div className="w-full h-full relative transition-transform duration-200 ease-out transform-style-3d hover:rotate-y-12 hover:rotate-x-12">
                  <img src={gal2} alt="Gallery 2" className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700" />
                  <div className="absolute inset-0 border border-[#D4AF37]/50 m-4 pointer-events-none transform translate-z-[50px]" />
                </div>
              </div>

              {/* Photo 3 */}
              <div className="relative aspect-[4/3] md:-mt-12 group perspective-[1000px]">
                <div className="w-full h-full relative transition-transform duration-200 ease-out transform-style-3d hover:rotate-y-12 hover:rotate-x-12">
                  <img src={gal3} alt="Gallery 3" className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700" />
                  <div className="absolute inset-0 border border-[#D4AF37]/50 m-4 pointer-events-none transform translate-z-[50px]" />
                </div>
              </div>

              {/* Photo 4 */}
              <div className="relative aspect-[3/4] md:mt-12 group perspective-[1000px]">
                <div className="w-full h-full relative transition-transform duration-200 ease-out transform-style-3d hover:rotate-y-12 hover:rotate-x-12">
                  <img src={gal4} alt="Gallery 4" className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700" />
                  <div className="absolute inset-0 border border-[#D4AF37]/50 m-4 pointer-events-none transform translate-z-[50px]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ending Spacer */}
        <section className="min-h-[50vh] flex items-center justify-center relative z-10 pb-20">
            <h2 className="text-4xl text-[#D4AF37] italic">See you there.</h2>
        </section>

      </main>
    </div>
  );
}
