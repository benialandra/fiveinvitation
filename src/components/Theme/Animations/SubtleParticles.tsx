import React, { useEffect, useRef } from 'react';

export const SubtleParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{ x: number; y: number; size: number; speedY: number; speedX: number; opacity: number }> = [];
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
        size: Math.random() * 2 + 0.5,
        speedY: (Math.random() - 0.5) * 0.2, // Very slow
        speedX: (Math.random() - 0.5) * 0.2, // Very slow
        opacity: Math.random() * 0.3 + 0.05, // Very subtle
      };
    };

    for (let i = 0; i < 30; i++) {
      particles.push(createParticle());
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 0, 0, ${p.opacity})`; // Dark subtle dots by default, CSS can invert in dark mode
        ctx.fill();

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
      className="fixed inset-0 pointer-events-none z-0 dark:invert"
      style={{ width: '100%', height: '100%', filter: 'blur(1px)' }}
    />
  );
};
