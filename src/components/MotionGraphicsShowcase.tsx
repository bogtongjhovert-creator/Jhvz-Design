import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  Sparkles,
  Play,
  Pause,
  Zap,
  Activity,
  Box,
  Palette,
  Compass,
  Globe2,
  Orbit,
  Star,
  Flame,
  Maximize2,
  Radio,
  Layers,
  ArrowRight
} from 'lucide-react';

interface StarParticle {
  x: number;
  y: number;
  z: number; // 3D depth simulation
  vx: number;
  vy: number;
  radius: number;
  color: string;
  angle: number;
  distance: number;
  speed: number;
  twinkleSpeed: number;
  twinkleState: number;
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

export const MotionGraphicsShowcase: React.FC = () => {
  const { openBookingModalWithProject } = usePortfolio();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Motion & Galaxy Controls
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [showConstellations, setShowConstellations] = useState<boolean>(true);
  const [galaxyTheme, setGalaxyTheme] = useState<'andromeda' | 'orion' | 'solaris' | 'aurora'>('andromeda');
  const [activePreset, setActivePreset] = useState<'spiral' | 'supernova' | 'wormhole' | 'constellation'>('spiral');
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [mousePos, setMousePos] = useState<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  // Galaxy Color Themes
  const galaxyPalettes = {
    andromeda: ['#a855f7', '#c084fc', '#818cf8', '#e879f9', '#38bdf8', '#ffffff'],
    orion: ['#38bdf8', '#06b6d4', '#22d3ee', '#818cf8', '#67e8f9', '#ffffff'],
    solaris: ['#f59e0b', '#fbbf24', '#f97316', '#ef4444', '#fef08a', '#ffffff'],
    aurora: ['#34d399', '#10b981', '#06b6d4', '#a7f3d0', '#67e8f9', '#ffffff']
  };

  // Canvas Motion & Cosmic Physics
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 420);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 420;
    };
    window.addEventListener('resize', handleResize);

    // Initialize 3D Galactic Particles
    const palette = galaxyPalettes[galaxyTheme];
    const particleCount = 180;
    const centerX = width / 2;
    const centerY = height / 2;

    const particles: StarParticle[] = Array.from({ length: particleCount }, () => {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * (Math.min(width, height) * 0.45) + 10;
      return {
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        z: Math.random() * 1000,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2.2 + 0.6,
        color: palette[Math.floor(Math.random() * palette.length)],
        angle: angle,
        distance: distance,
        speed: (Math.random() * 0.015 + 0.005) * (1 - distance / (width * 0.5)),
        twinkleSpeed: Math.random() * 0.08 + 0.02,
        twinkleState: Math.random() * Math.PI * 2
      };
    });

    // Shooting stars array
    let shootingStars: ShootingStar[] = [];

    let frame = 0;

    const render = () => {
      // Deep space black background with slight translucent clear for motion trails
      ctx.fillStyle = activePreset === 'wormhole' ? 'rgba(5, 5, 12, 0.25)' : 'rgba(5, 5, 12, 0.85)';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      if (isPlaying) {
        frame += speed;
        setCurrentFrame(Math.floor(frame % 360));
      }

      const time = frame * 0.015;

      // Draw Dynamic Cosmic Nebula Background
      const nebulaGlow1 = ctx.createRadialGradient(cx + Math.sin(time) * 60, cy + Math.cos(time * 0.8) * 40, 10, cx, cy, width * 0.5);
      nebulaGlow1.addColorStop(0, palette[0] + '22');
      nebulaGlow1.addColorStop(0.5, palette[1] + '12');
      nebulaGlow1.addColorStop(1, 'transparent');
      ctx.fillStyle = nebulaGlow1;
      ctx.fillRect(0, 0, width, height);

      const nebulaGlow2 = ctx.createRadialGradient(cx - Math.cos(time * 0.7) * 80, cy - Math.sin(time * 0.9) * 50, 20, cx, cy, width * 0.4);
      nebulaGlow2.addColorStop(0, palette[2] + '18');
      nebulaGlow2.addColorStop(1, 'transparent');
      ctx.fillStyle = nebulaGlow2;
      ctx.fillRect(0, 0, width, height);

      // Randomly spawn shooting stars
      if (isPlaying && Math.random() < 0.03) {
        shootingStars.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.5),
          len: Math.random() * 80 + 40,
          speed: Math.random() * 12 + 8,
          size: Math.random() * 1.5 + 1,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
          life: 0,
          maxLife: Math.random() * 30 + 20
        });
      }

      // Render shooting stars
      shootingStars.forEach((st, index) => {
        if (isPlaying) {
          st.x += Math.cos(st.angle) * st.speed * speed;
          st.y += Math.sin(st.angle) * st.speed * speed;
          st.life++;
        }

        const alpha = 1 - st.life / st.maxLife;
        if (alpha > 0) {
          const grad = ctx.createLinearGradient(
            st.x,
            st.y,
            st.x - Math.cos(st.angle) * st.len,
            st.y - Math.sin(st.angle) * st.len
          );
          grad.addColorStop(0, palette[4]);
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

      // PRESET 1: SPIRAL GALAXY CORE
      if (activePreset === 'spiral') {
        // Draw Central Supermassive Black Hole Event Horizon & Photon Ring
        ctx.save();
        ctx.translate(cx, cy);

        // Accretion Disk Photon Glow
        for (let r = 5; r >= 1; r--) {
          const ringGlow = ctx.createRadialGradient(0, 0, 15, 0, 0, 45 + r * 12);
          ringGlow.addColorStop(0, '#ffffff');
          ringGlow.addColorStop(0.3, palette[0]);
          ringGlow.addColorStop(0.7, palette[1] + '44');
          ringGlow.addColorStop(1, 'transparent');
          ctx.fillStyle = ringGlow;
          ctx.beginPath();
          ctx.arc(0, 0, 45 + r * 12, 0, Math.PI * 2);
          ctx.fill();
        }

        // Swirling Spiral Arms (2 major arms + stellar dust)
        ctx.rotate(time * 0.5);
        ctx.strokeStyle = palette[1] + '33';
        ctx.lineWidth = 1.5;
        for (let arm = 0; arm < 2; arm++) {
          ctx.rotate(Math.PI);
          ctx.beginPath();
          for (let a = 0; a < Math.PI * 3; a += 0.1) {
            const r = a * 22;
            const x = Math.cos(a) * r;
            const y = Math.sin(a) * r;
            if (a === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }

        // Black Hole Center Void
        ctx.fillStyle = '#030308';
        ctx.beginPath();
        ctx.arc(0, 0, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = palette[0];
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
      }
      // PRESET 2: SUPERNOVA EXPLOSION & NEBULA
      else if (activePreset === 'supernova') {
        ctx.save();
        ctx.translate(cx, cy);

        // Expanding Shockwave Rings
        const shockRadius = (frame * 1.5) % 220;
        const shockAlpha = 1 - shockRadius / 220;

        ctx.strokeStyle = palette[0] + Math.floor(shockAlpha * 255).toString(16).padStart(2, '0');
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, shockRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Pulsating Plasma Center
        const plasma = ctx.createRadialGradient(0, 0, 0, 0, 0, 60 + Math.sin(time * 4) * 15);
        plasma.addColorStop(0, '#ffffff');
        plasma.addColorStop(0.2, palette[2]);
        plasma.addColorStop(0.6, palette[0] + '88');
        plasma.addColorStop(1, 'transparent');
        ctx.fillStyle = plasma;
        ctx.beginPath();
        ctx.arc(0, 0, 75, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
      // PRESET 3: WORMHOLE WARP TUNNEL
      else if (activePreset === 'wormhole') {
        ctx.save();
        ctx.translate(cx, cy);

        // Hyperdrive Radial Lines
        const lineCount = 32;
        for (let i = 0; i < lineCount; i++) {
          const angle = (i / lineCount) * Math.PI * 2 + time * 0.2;
          const innerR = 15;
          const outerR = Math.max(width, height) * 0.6;

          const x1 = Math.cos(angle) * innerR;
          const y1 = Math.sin(angle) * innerR;
          const x2 = Math.cos(angle) * outerR;
          const y2 = Math.sin(angle) * outerR;

          const grad = ctx.createLinearGradient(x1, y1, x2, y2);
          grad.addColorStop(0, 'transparent');
          grad.addColorStop(0.5, palette[i % palette.length] + '88');
          grad.addColorStop(1, palette[0]);

          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }

        ctx.restore();
      }

      // Render & Move Particles (Stars / Dust)
      particles.forEach((p, idx) => {
        if (isPlaying) {
          p.twinkleState += p.twinkleSpeed;

          if (activePreset === 'spiral') {
            // Orbital spiral movement around galaxy center
            p.angle += (p.speed * 0.8 + 0.002) * speed;
            p.x = cx + Math.cos(p.angle) * p.distance;
            p.y = cy + Math.sin(p.angle) * (p.distance * 0.65); // Elliptical perspective
          } else if (activePreset === 'wormhole') {
            // Radial outward warp movement
            p.distance += (p.speed * 180 + 1) * speed;
            if (p.distance > Math.max(width, height) * 0.6) {
              p.distance = 10;
              p.angle = Math.random() * Math.PI * 2;
            }
            p.x = cx + Math.cos(p.angle) * p.distance;
            p.y = cy + Math.sin(p.angle) * p.distance;
          } else {
            // Free floating cosmic drift
            p.x += p.vx * speed;
            p.y += p.vy * speed;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
          }

          // Mouse Gravitational Attractor Effect
          if (mousePos.active) {
            const dx = mousePos.x - p.x;
            const dy = mousePos.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 180 && dist > 5) {
              const force = (180 - dist) / 180;
              p.x += (dx / dist) * force * 2.5;
              p.y += (dy / dist) * force * 2.5;
            }
          }
        }

        // Calculate twinkling brightness & glow
        const twinkle = Math.sin(p.twinkleState) * 0.35 + 0.65;
        const radius = p.radius * twinkle;

        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.8, radius), 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw Constellation Laser Connections
        if (showConstellations && activePreset === 'constellation') {
          for (let j = idx + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 90) {
              const alpha = (1 - dist / 90) * 0.4 * twinkle;
              ctx.strokeStyle = p.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      });

      // Draw Cursor Gravity Hole Indicator
      if (mousePos.active) {
        ctx.save();
        ctx.translate(mousePos.x, mousePos.y);
        ctx.strokeStyle = palette[0];
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.arc(0, 0, 25 + Math.sin(time * 5) * 4, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = palette[0] + '22';
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, speed, showConstellations, galaxyTheme, activePreset, mousePos]);

  // Handle canvas mouse move for interactive cosmic gravity
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true
    });
  };

  const handleMouseLeave = () => {
    setMousePos((prev) => ({ ...prev, active: false }));
  };

  return (
    <section className="py-20 relative overflow-hidden bg-black border-t border-b border-purple-900/30">
      {/* Background Deep Cosmic Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-purple-900/20 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 right-10 w-[400px] h-[300px] bg-indigo-600/15 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-purple-500/20 pb-8">
          <div className="space-y-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 text-purple-400 font-semibold text-xs uppercase tracking-widest"
            >
              <Orbit className="w-4 h-4 text-purple-400 animate-spin" style={{ animationDuration: '10s' }} />
              <span>Cosmic Motion & Galaxy Graphics Studio</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl font-black text-white tracking-tight flex flex-wrap items-center gap-3"
            >
              <span>Galaxy Motion Graphics & Space Physics</span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                60 FPS Cosmic Canvas
              </span>
            </motion.h2>
            <p className="text-sm text-white/60 font-light max-w-2xl">
              Experience real-time galactic particle simulations, supernova shockwaves, wormhole trajectories, and interactive celestial motion graphics tailored for luxury branding, gaming intros, and video production.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => openBookingModalWithProject()}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-xl shadow-purple-600/30 border border-purple-400/40 flex items-center gap-2 transition-all self-start md:self-auto cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>Order Custom Galaxy Motion</span>
          </motion.button>
        </div>

        {/* Studio Interactive Control Panel & Galaxy Canvas */}
        <div className="glass-panel rounded-3xl p-6 border border-purple-500/20 space-y-6 shadow-2xl relative bg-zinc-950/80">
          
          {/* Top Bar Studio Info & Galaxy Presets */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
            
            {/* Galaxy Motion Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-purple-300/60 uppercase tracking-wider flex items-center gap-1.5 mr-1">
                <Star className="w-3.5 h-3.5 text-purple-400" />
                Galactic Presets:
              </span>
              {[
                { id: 'spiral', label: 'Spiral Galaxy Core', icon: Orbit },
                { id: 'supernova', label: 'Supernova Burst', icon: Flame },
                { id: 'wormhole', label: 'Wormhole Hyperdrive', icon: Compass },
                { id: 'constellation', label: 'Constellation Mesh', icon: Globe2 }
              ].map((p) => {
                const IconComponent = p.icon;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActivePreset(p.id as any)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      activePreset === p.id
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/50'
                        : 'glass-pill text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Theme Color Palettes & Constellations Toggle */}
            <div className="flex items-center gap-4">
              {/* Color Theme Selector */}
              <div className="flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-white/40" />
                {(['andromeda', 'orion', 'solaris', 'aurora'] as const).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setGalaxyTheme(theme)}
                    className={`w-5 h-5 rounded-full border transition-all ${
                      theme === 'andromeda'
                        ? 'bg-purple-500'
                        : theme === 'orion'
                        ? 'bg-cyan-400'
                        : theme === 'solaris'
                        ? 'bg-amber-500'
                        : 'bg-emerald-400'
                    } ${galaxyTheme === theme ? 'scale-125 border-white shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    title={`${theme} palette`}
                  />
                ))}
              </div>

              {/* Toggle Constellations */}
              <button
                onClick={() => setShowConstellations(!showConstellations)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  showConstellations ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'glass-pill text-white/50'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Lines {showConstellations ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>

          {/* Interactive HTML5 Galaxy Canvas View */}
          <div className="relative rounded-2xl overflow-hidden bg-black border border-purple-500/20 aspect-[16/7] shadow-inner flex items-center justify-center cursor-crosshair group">
            <canvas
              ref={canvasRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="w-full h-full block"
            />

            {/* Overlay Keyframe Motion Badge */}
            <div className="absolute top-4 left-4 glass-panel px-3.5 py-1.5 rounded-xl text-[11px] font-mono text-purple-300 flex items-center gap-2 border border-purple-500/20 backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>ORBIT DEG: {(currentFrame * 1.5).toFixed(0)}°</span>
              <span className="text-white/30">|</span>
              <span>GRAVITY: ACTIVE</span>
            </div>

            {/* Helper Hint overlay for mouse interaction */}
            <div className="absolute top-4 right-4 glass-panel px-3 py-1.5 rounded-xl text-[11px] text-white/60 border border-white/10 backdrop-blur-md hidden sm:flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>Hover canvas to exert gravitational pull</span>
            </div>

            {/* Live Interactive Text Motion Overlay */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4 pointer-events-none">
              <div className="glass-panel p-4 rounded-2xl border border-purple-500/20 max-w-md backdrop-blur-md bg-black/60">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block mb-1">
                  Active Galactic Preset
                </span>
                <h4 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                  {activePreset === 'spiral' && 'Spiral Galaxy Accretion & Photons'}
                  {activePreset === 'supernova' && 'Supernova Shockwave & Stellar Plasma'}
                  {activePreset === 'wormhole' && 'Hyperdrive Wormhole Space-Time Warp'}
                  {activePreset === 'constellation' && 'Celestial Constellation Laser Matrix'}
                </h4>
                <p className="text-xs text-white/60 font-light mt-1">
                  Interactive cosmic motion graphics rendered in high-definition WebGL/Canvas physics. Engineered for title cards, broadcast idents, and brand identity reels.
                </p>
              </div>

              <div className="glass-panel px-4 py-2 rounded-xl text-xs text-purple-300 border border-purple-500/30 backdrop-blur-md flex items-center gap-2.5">
                <Radio className="w-4 h-4 text-purple-400 animate-pulse" />
                <span className="font-semibold">Starlight Motion Engine v3.0</span>
              </div>
            </div>
          </div>

          {/* Bottom Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/10 text-xs text-white/70">
            
            {/* Play/Pause & Speed Selector */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center font-bold shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>

              <div className="flex items-center gap-1.5 glass-panel px-3 py-2 rounded-xl border border-white/10">
                <span className="text-white/50 font-bold text-[11px] uppercase mr-1">Speed:</span>
                {[0.5, 1, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`px-2 py-0.5 rounded-lg font-bold text-xs transition-all ${
                      speed === s ? 'bg-purple-600 text-white' : 'text-white/50 hover:text-white'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Galaxy Features */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-white/60">
              <div className="flex items-center gap-1.5">
                <Orbit className="w-3.5 h-3.5 text-purple-400" />
                <span>Space Titles</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-purple-400" />
                <span>3D Particles & VFX</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-purple-400" />
                <span>Cinematic Intros</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
