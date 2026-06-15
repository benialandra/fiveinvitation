import React, { useEffect, useRef } from 'react';

export const GoldenParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{ x: number; y: number; size: number; speedY: number; speedX: number; opacity: number; life: number; maxLife: number }> = [];
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
      particles.push({
        x: Math.random() * width,
        y: height + 10,
        size: Math.random() * 2 + 0.5,
        speedY: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        life: 0,
        maxLife: Math.random() * 200 + 100
      });
    };

    // Initial particles
    for (let i = 0; i < 50; i++) {
      createParticle();
      particles[i].y = Math.random() * height; // distribute initially
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Create new particles occasionally
      if (particles.length < 100 && Math.random() > 0.8) {
        createParticle();
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.speedY;
        p.x += p.speedX;
        p.life++;

        // Fade out
        const fade = Math.max(0, 1 - (p.life / p.maxLife));
        const currentOpacity = p.opacity * fade;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${currentOpacity})`; // Gold color
        ctx.fill();

        // Remove dead particles
        if (p.life >= p.maxLife || p.y < -10) {
          particles.splice(i, 1);
          i--;
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
