import React, { useEffect, useRef } from 'react';

export const SnowEffect: React.FC = () => {
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
        y: Math.random() * height - height, // Start above screen
        size: Math.random() * 3 + 1,
        speedY: Math.random() * 1 + 0.5, // Slow fall
        speedX: (Math.random() - 0.5) * 0.5, // Slight wind
        opacity: Math.random() * 0.6 + 0.2,
      };
    };

    for (let i = 0; i < 150; i++) {
      particles.push(createParticle());
      particles[i].y = Math.random() * height; // Distribute initially across screen
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();

        // Reset particle if it falls off screen
        if (p.y > height + 10 || p.x > width + 10 || p.x < -10) {
          particles[i] = createParticle();
        }
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
