import React, { useEffect, useRef } from 'react';

interface GalaxyParticle {
  x: number;
  y: number;
  z: number;
  radius: number;
  color: string;
  angle: number;
  distance: number;
  speed: number;
  twinkleSpeed: number;
  twinkleState: number;
  vx: number;
  vy: number;
}

interface ShootingStar {
  x: number;
  y: number;
  len: number;
  speed: number;
  size: number;
  angle: number;
  life: number;
  maxLife: number;
}

export const GalaxyBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;
    let scrollY = window.scrollY;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Palette: Celestial Purples, Indigos, Cyans & Whites
    const colors = [
      '#a855f7', // purple
      '#c084fc', // light purple
      '#818cf8', // indigo
      '#38bdf8', // cyan
      '#e879f9', // fuchsia
      '#ffffff'  // white star
    ];

    // Generate Galaxy Particles
    const particleCount = Math.min(Math.floor((width * height) / 6000), 220);
    const particles: GalaxyParticle[] = Array.from({ length: particleCount }, () => {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * (Math.max(width, height) * 0.6) + 20;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 1000 + 100,
        radius: Math.random() * 2.2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: angle,
        distance: distance,
        speed: Math.random() * 0.008 + 0.002,
        twinkleSpeed: Math.random() * 0.05 + 0.01,
        twinkleState: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4
      };
    });

    let shootingStars: ShootingStar[] = [];
    let frame = 0;

    const render = () => {
      frame++;
      const time = frame * 0.01;

      // Smooth mouse interpolation for parallax
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Dark space canvas clear
      ctx.fillStyle = '#030308';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // 1. Swirling Deep Space Nebulae Gradients
      const nebula1 = ctx.createRadialGradient(
        cx + Math.sin(time * 0.5) * 120 + (mouseX - cx) * 0.08,
        cy + Math.cos(time * 0.4) * 80 + (mouseY - cy) * 0.08,
        50,
        cx,
        cy,
        width * 0.7
      );
      nebula1.addColorStop(0, 'rgba(126, 34, 206, 0.18)');
      nebula1.addColorStop(0.5, 'rgba(79, 70, 229, 0.1)');
      nebula1.addColorStop(1, 'rgba(3, 3, 8, 0)');
      ctx.fillStyle = nebula1;
      ctx.fillRect(0, 0, width, height);

      const nebula2 = ctx.createRadialGradient(
        cx - Math.cos(time * 0.6) * 150,
        cy - Math.sin(time * 0.5) * 100,
        30,
        cx,
        cy,
        width * 0.5
      );
      nebula2.addColorStop(0, 'rgba(14, 165, 233, 0.12)');
      nebula2.addColorStop(0.8, 'rgba(168, 85, 247, 0.05)');
      nebula2.addColorStop(1, 'rgba(3, 3, 8, 0)');
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, width, height);

      // 2. Random Shooting Stars
      if (Math.random() < 0.02) {
        shootingStars.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.6),
          len: Math.random() * 90 + 50,
          speed: Math.random() * 10 + 7,
          size: Math.random() * 1.5 + 0.8,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
          life: 0,
          maxLife: Math.random() * 25 + 15
        });
      }

      shootingStars.forEach((st) => {
        st.x += Math.cos(st.angle) * st.speed;
        st.y += Math.sin(st.angle) * st.speed;
        st.life++;

        const alpha = 1 - st.life / st.maxLife;
        if (alpha > 0) {
          const grad = ctx.createLinearGradient(
            st.x,
            st.y,
            st.x - Math.cos(st.angle) * st.len,
            st.y - Math.sin(st.angle) * st.len
          );
          grad.addColorStop(0, 'rgba(255, 255, 255, ' + alpha + ')');
          grad.addColorStop(0.4, 'rgba(192, 132, 252, ' + alpha * 0.7 + ')');
          grad.addColorStop(1, 'transparent');

          ctx.strokeStyle = grad;
          ctx.lineWidth = st.size;
          ctx.beginPath();
          ctx.moveTo(st.x, st.y);
          ctx.lineTo(st.x - Math.cos(st.angle) * st.len, st.y - Math.sin(st.angle) * st.len);
          ctx.stroke();
        }
      });
      shootingStars = shootingStars.filter((st) => st.life < st.maxLife);

      // 3. Render 3D Galactic Stars with Orbital Physics & Mouse Influence
      particles.forEach((p, idx) => {
        p.twinkleState += p.twinkleSpeed;
        p.angle += p.speed;

        // Orbital rotation around galaxy core + parallax displacement
        const parallaxX = (mouseX - cx) * (p.radius * 0.012);
        const parallaxY = (mouseY - cy) * (p.radius * 0.012) - (scrollY * 0.05);

        p.x = cx + Math.cos(p.angle) * p.distance + parallaxX;
        p.y = cy + Math.sin(p.angle) * (p.distance * 0.6) + parallaxY;

        // Wrap around bounds seamlessly
        if (p.x < -50) p.x = width + 50;
        if (p.x > width + 50) p.x = -50;
        if (p.y < -50) p.y = height + 50;
        if (p.y > height + 50) p.y = -50;

        const twinkle = Math.sin(p.twinkleState) * 0.4 + 0.6;
        const radius = Math.max(0.6, p.radius * twinkle);

        // Draw Glow
        ctx.fillStyle = p.color;
        ctx.shadowBlur = p.radius > 1.8 ? 10 : 0;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Connect nearby star nodes (Constellations)
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 80) {
            const alpha = (1 - dist / 80) * 0.2 * twinkle;
            ctx.strokeStyle = p.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 transition-opacity duration-1000"
      style={{ opacity: 0.95 }}
    />
  );
};
