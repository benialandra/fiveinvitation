import React, { useState, useEffect } from 'react';
import { Howl, Howler } from 'howler';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';

interface AudioControllerProps {
  src: string;
  autoPlay?: boolean;
}

export default function AudioController({ src, autoPlay = true }: AudioControllerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [sound, setSound] = useState<Howl | null>(null);

  useEffect(() => {
    const newSound = new Howl({
      src: [src],
      loop: true,
      volume: 0.5,
      onload: () => {
        if (autoPlay) {
          newSound.play();
          setIsPlaying(true);
        }
      }
    });

    setSound(newSound);

    return () => {
      newSound.unload();
    };
  }, [src, autoPlay]);

  useEffect(() => {
    Howler.mute(isMuted);
  }, [isMuted]);

  const togglePlay = () => {
    if (!sound) return;
    if (isPlaying) {
      sound.pause();
    } else {
      sound.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
    >
      <button 
        onClick={togglePlay} 
        className="text-white hover:text-[#D4AF37] transition-colors"
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </button>
      
      <div className="w-px h-4 bg-white/20" />
      
      <button 
        onClick={toggleMute} 
        className="text-white hover:text-[#D4AF37] transition-colors"
        aria-label={isMuted ? "Unmute music" : "Mute music"}
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
    </motion.div>
  );
}
