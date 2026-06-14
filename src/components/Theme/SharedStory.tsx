import React, { memo } from 'react';
import { motion } from 'framer-motion';

export interface SharedStoryProps {
  storyText: string;
  colors?: {
    primary?: string;
    text?: string;
    background?: string;
  };
  fonts?: {
    heading?: string;
    body?: string;
  };
  labels?: {
    title?: string;
  };
  className?: string;
}

const SharedStory = memo<SharedStoryProps>(({
  storyText,
  colors = { primary: '#c5a059', text: '#333333', background: '#ffffff' },
  fonts = { heading: 'serif', body: 'sans-serif' },
  labels = { title: 'Kisah Kami' },
  className = ''
}) => {
  if (!storyText) return null;

  return (
    <section className={`py-24 px-6 relative w-full ${className}`} style={{ backgroundColor: colors.background }}>
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="p-8 md:p-12 rounded-3xl border shadow-sm relative overflow-hidden"
          style={{ borderColor: colors.primary ? `${colors.primary}30` : '#e5e5e5' }}
        >
          {labels.title && (
            <h3 
              className="text-3xl md:text-4xl mb-8 font-normal" 
              style={{ fontFamily: fonts.heading, color: colors.primary }}
            >
              {labels.title}
            </h3>
          )}
          
          <div className="relative z-10">
            <p 
              className="leading-relaxed text-lg italic" 
              style={{ fontFamily: fonts.body, color: colors.text, opacity: 0.8 }}
            >
              "{storyText}"
            </p>
          </div>
          
          {/* Decorative faint background quote mark */}
          <div 
            className="absolute -top-10 -left-6 text-9xl font-serif opacity-5 select-none pointer-events-none"
            style={{ color: colors.primary }}
          >
            "
          </div>
        </motion.div>
      </div>
    </section>
  );
});

SharedStory.displayName = 'SharedStory';

export default SharedStory;
