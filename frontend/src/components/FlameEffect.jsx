import React, { useEffect, useRef } from 'react';

export default function FlameEffect({ active = true, theme = 'dark' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    const particleCount = theme === 'dark' ? 25 : 12;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 80,
        radius: Math.random() * 2 + 0.6,
        color: 'rgba(249, 115, 22, ',
        opacity: Math.random() * 0.5 + 0.1,
        speedY: Math.random() * 0.9 + 0.4,
        speedX: (Math.random() - 0.5) * 0.4,
        life: 0,
        maxLife: Math.random() * 200 + 100
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += p.speedX;
        p.life++;

        const currentOpacity = (1 - p.life / p.maxLife) * p.opacity;

        if (currentOpacity > 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${Math.max(0, currentOpacity)})`;
          ctx.shadowBlur = 6;
          ctx.shadowColor = 'rgba(249, 115, 22, 0.6)';
          ctx.fill();
        }

        if (p.life >= p.maxLife || p.y < -10) {
          p.x = Math.random() * canvas.width;
          p.y = canvas.height + 10;
          p.life = 0;
          p.maxLife = Math.random() * 200 + 100;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active, theme]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-500/5 dark:bg-orange-600/10 blur-[120px] rounded-full" />
      <canvas ref={canvasRef} className={`w-full h-full ${theme === 'dark' ? 'opacity-50' : 'opacity-20'}`} />
    </div>
  );
}
