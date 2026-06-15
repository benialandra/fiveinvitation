import React, { useEffect, useRef } from 'react';

export const LightParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{ x: number; y: number; size: number; speedY: number; speedX: number; opacity: number; pulse: number }> = [];
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', resize);
    resize();

    const createParticle = () => {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 4 + 1,
        speedY: (Math.random() - 0.5) * 0.5,
        speedX: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        pulse: Math.random() * 0.02
      };
    };

    for (let i = 0; i < 60; i++) {
      particles.push(createParticle());
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX;
        
        // Pulsing effect
        p.opacity += p.pulse;
        if (p.opacity > 0.8 || p.opacity < 0.1) {
          p.pulse = -p.pulse;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        // Add glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();
        ctx.shadowBlur = 0; // reset

        // Wrap around screen
        if (p.y > height + 10) p.y = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.x < -10) p.x = width + 10;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ width: '100%', height: '100%' }}
    />
  );
};
