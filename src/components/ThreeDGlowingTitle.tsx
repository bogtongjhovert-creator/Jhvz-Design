import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { Sparkles, Zap, Flame, Eye, Sparkle, RefreshCw } from 'lucide-react';

export type AnimationStyle = 'extruded3d' | 'kineticWave' | 'hologram' | 'cosmicFlare' | 'liquidNeon';

interface ThreeDGlowingTitleProps {
  text: string;
  className?: string;
  initialStyle?: AnimationStyle;
}

export const ThreeDGlowingTitle: React.FC<ThreeDGlowingTitleProps> = ({
  text,
  className = '',
  initialStyle = 'extruded3d',
}) => {
  const [animStyle, setAnimStyle] = useState<AnimationStyle>(initialStyle);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse position values for 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for high-end 3D physics feeling
  const springConfig = { stiffness: 150, damping: 20 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [18, -18]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-22, 22]), springConfig);
  const glowX = useTransform(mouseX, [-0.5, 0.5], ['20%', '80%']);
  const glowY = useTransform(mouseY, [-0.5, 0.5], ['20%', '80%']);

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Normalize mouse coords from -0.5 to 0.5 relative to component center
    const x = (e.clientX - rect.left) / width - 0.5;
    const y = (e.clientY - rect.top) / height - 0.5;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const animationOptions: { id: AnimationStyle; label: string; icon: React.ReactNode }[] = [
    { id: 'extruded3d', label: '3D Extrusion', icon: <Sparkles className="w-3 h-3" /> },
    { id: 'kineticWave', label: 'Kinetic Wave', icon: <Zap className="w-3 h-3" /> },
    { id: 'hologram', label: 'Cyber Hologram', icon: <Eye className="w-3 h-3" /> },
    { id: 'cosmicFlare', label: 'Cosmic Flare', icon: <Sparkle className="w-3 h-3" /> },
    { id: 'liquidNeon', label: 'Liquid Neon', icon: <Flame className="w-3 h-3" /> },
  ];

  const words = text.split(' ');

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Interactive Animation Style Switcher Bar */}
      <div className="flex items-center justify-center flex-wrap gap-1.5 pt-1 pb-2">
        <span className="text-[11px] font-semibold tracking-wider uppercase text-white/40 mr-1.5 flex items-center gap-1">
          <RefreshCw className="w-3 h-3 text-indigo-400 animate-spin" style={{ animationDuration: '8s' }} />
          Style FX:
        </span>
        {animationOptions.map((opt) => {
          const isActive = animStyle === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setAnimStyle(opt.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-105 border border-indigo-300/40'
                  : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10'
              }`}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Animation Stage */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative select-none py-4 px-2 cursor-pointer perspective-1000 min-h-[160px] flex items-center justify-center"
        style={{ perspective: '1200px' }}
      >
        <AnimatePresence mode="wait">
          {/* MODE 1: 3D EXTRUDED GLOW */}
          {animStyle === 'extruded3d' && (
            <motion.div
              key="extruded3d"
              initial={{ opacity: 0, scale: 0.92, rotateX: 20 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 1.05, rotateX: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full text-center"
            >
              {/* Dynamic Background Glowing Aura */}
              <motion.div
                animate={{
                  scale: isHovered ? [1.1, 1.3, 1.1] : [1, 1.18, 1],
                  opacity: isHovered ? [0.6, 0.9, 0.6] : [0.35, 0.6, 0.35],
                  rotate: [0, 180, 360],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 m-auto w-3/4 h-3/4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-full blur-[70px] pointer-events-none z-0"
              />

              <motion.div
                className="absolute w-48 h-48 bg-cyan-400/40 rounded-full blur-[50px] pointer-events-none z-0 hidden sm:block"
                style={{ left: glowX, top: glowY, transform: 'translate(-50%, -50%)' }}
              />

              <motion.div
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                animate={!isHovered ? { rotateX: [-3, 3, -3], rotateY: [-5, 5, -5], y: [-4, 4, -4] } : {}}
                transition={!isHovered ? { duration: 6, repeat: Infinity, ease: 'easeInOut' } : {}}
                className="relative z-10 transform-gpu"
              >
                {/* 3D Depth Layer 1 */}
                <motion.h1
                  aria-hidden="true"
                  className="absolute inset-0 text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-indigo-950/80 pointer-events-none select-none blur-[2px]"
                  style={{ transform: 'translateZ(-40px) translateY(12px) scale(0.98)' }}
                >
                  {text}
                </motion.h1>

                {/* 3D Extrusion Side Wall */}
                <h1
                  aria-hidden="true"
                  className="absolute inset-0 text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-indigo-900 pointer-events-none select-none"
                  style={{
                    transform: 'translateZ(-20px)',
                    textShadow: `
                      1px 1px 0 #312e81,
                      2px 2px 0 #3730a3,
                      3px 3px 0 #4338ca,
                      4px 4px 0 #4f46e5,
                      5px 5px 0 #6366f1,
                      6px 6px 15px rgba(0,0,0,0.8),
                      0 0 30px rgba(99,102,241,0.6)
                    `,
                  }}
                >
                  {text}
                </h1>

                {/* Main Glowing Front Face */}
                <motion.h1
                  animate={{
                    filter: [
                      'drop-shadow(0 0 15px rgba(129, 140, 248, 0.6)) drop-shadow(0 0 35px rgba(99, 102, 241, 0.4))',
                      'drop-shadow(0 0 30px rgba(165, 180, 252, 0.9)) drop-shadow(0 0 60px rgba(99, 102, 241, 0.8)) drop-shadow(0 0 90px rgba(192, 132, 252, 0.5))',
                      'drop-shadow(0 0 15px rgba(129, 140, 248, 0.6)) drop-shadow(0 0 35px rgba(99, 102, 241, 0.4))',
                    ],
                  }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent relative z-20"
                  style={{ transform: 'translateZ(25px)', WebkitBackgroundClip: 'text' }}
                >
                  {text}
                </motion.h1>
              </motion.div>
            </motion.div>
          )}

          {/* MODE 2: KINETIC WAVE LEVITATION */}
          {animStyle === 'kineticWave' && (
            <motion.div
              key="kineticWave"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="w-full text-center relative z-10"
            >
              {/* Pulsating Wave Aura */}
              <motion.div
                animate={{
                  scale: [1, 1.25, 1],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 m-auto w-2/3 h-2/3 bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-500 rounded-full blur-[80px] pointer-events-none z-0"
              />

              <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 relative z-10">
                {words.map((word, wIdx) => (
                  <div key={wIdx} className="inline-flex space-x-1">
                    {word.split('').map((char, cIdx) => {
                      const globalIdx = wIdx * 10 + cIdx;
                      return (
                        <motion.span
                          key={cIdx}
                          animate={{
                            y: [-6, 6, -6],
                            rotateZ: [-4, 4, -4],
                            color: [
                              '#ffffff',
                              '#a5b4fc',
                              '#c084fc',
                              '#38bdf8',
                              '#ffffff',
                            ],
                            filter: [
                              'drop-shadow(0 0 10px rgba(129,140,248,0.5))',
                              'drop-shadow(0 0 25px rgba(192,132,252,0.9))',
                              'drop-shadow(0 0 35px rgba(56,189,248,0.8))',
                              'drop-shadow(0 0 10px rgba(129,140,248,0.5))',
                            ],
                          }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            delay: globalIdx * 0.08,
                            ease: 'easeInOut',
                          }}
                          whileHover={{
                            scale: 1.4,
                            y: -15,
                            rotate: 12,
                            transition: { duration: 0.2 },
                          }}
                          className="inline-block text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] cursor-pointer"
                        >
                          {char}
                        </motion.span>
                      );
                    })}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

            {/* MODE 3: CYBER HOLOGRAM PRISM */}
          {animStyle === 'hologram' && (
            <motion.div
              key="hologram"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="w-full text-center relative z-10"
            >
              <motion.div
                animate={{
                  opacity: [0.4, 0.8, 0.4],
                  scale: [0.95, 1.1, 0.95],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 m-auto w-3/4 h-3/4 bg-cyan-500/30 rounded-full blur-[70px] pointer-events-none z-0"
              />

              {/* Hologram RGB Split Glitch Layers */}
              <div className="relative inline-block">
                {/* Cyan Shift Layer */}
                <motion.h1
                  animate={{
                    x: [-3, 3, -2, 4, -3],
                    y: [1, -2, 2, -1, 1],
                    opacity: [0.7, 0.9, 0.6, 0.8, 0.7],
                  }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-cyan-400 mix-blend-screen pointer-events-none blur-[1px]"
                >
                  {text}
                </motion.h1>

                {/* Magenta Shift Layer */}
                <motion.h1
                  animate={{
                    x: [3, -3, 2, -4, 3],
                    y: [-1, 2, -2, 1, -1],
                    opacity: [0.7, 0.9, 0.6, 0.8, 0.7],
                  }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-fuchsia-500 mix-blend-screen pointer-events-none blur-[1px]"
                >
                  {text}
                </motion.h1>

                {/* Main Bright Electric Text */}
                <motion.h1
                  animate={{
                    filter: [
                      'drop-shadow(0 0 15px rgba(6,182,212,0.8)) drop-shadow(0 0 30px rgba(217,70,239,0.6))',
                      'drop-shadow(0 0 35px rgba(6,182,212,1)) drop-shadow(0 0 60px rgba(217,70,239,0.9))',
                      'drop-shadow(0 0 15px rgba(6,182,212,0.8)) drop-shadow(0 0 30px rgba(217,70,239,0.6))',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-fuchsia-200 relative z-20"
                >
                  {text}
                </motion.h1>
              </div>
            </motion.div>
          )}

          {/* MODE 4: COSMIC FLARE */}
          {animStyle === 'cosmicFlare' && (
            <motion.div
              key="cosmicFlare"
              initial={{ opacity: 0, rotateY: -30 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: 30 }}
              transition={{ duration: 0.5 }}
              className="w-full text-center relative z-10"
            >
              {/* Golden Cosmic Nebula Core */}
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 360],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 m-auto w-3/4 h-3/4 bg-gradient-to-tr from-amber-500 via-purple-600 to-indigo-500 rounded-full blur-[80px] opacity-60 pointer-events-none z-0"
              />

              {/* Orbiting Sparkle Stars */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    rotate: [0, 360],
                    scale: [0.8, 1.4, 0.8],
                  }}
                  transition={{
                    duration: 5 + i * 2,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="absolute left-1/2 top-1/2 w-48 h-48 -ml-24 -mt-24 pointer-events-none z-0"
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full bg-amber-300 shadow-[0_0_15px_#fde047]"
                    style={{
                      transform: `rotate(${i * 60}deg) translate(110px)`,
                    }}
                  />
                </motion.div>
              ))}

              <motion.h1
                animate={{
                  filter: [
                    'drop-shadow(0 0 20px rgba(251,191,36,0.7)) drop-shadow(0 0 40px rgba(168,85,247,0.5))',
                    'drop-shadow(0 0 45px rgba(251,191,36,0.95)) drop-shadow(0 0 80px rgba(168,85,247,0.9))',
                    'drop-shadow(0 0 20px rgba(251,191,36,0.7)) drop-shadow(0 0 40px rgba(168,85,247,0.5))',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-white to-purple-200 relative z-20"
              >
                {text}
              </motion.h1>
            </motion.div>
          )}

          {/* MODE 5: LIQUID NEON PULSE */}
          {animStyle === 'liquidNeon' && (
            <motion.div
              key="liquidNeon"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="w-full text-center relative z-10"
            >
              {/* Flowing Liquid Backlight */}
              <motion.div
                animate={{
                  borderRadius: [
                    '40% 60% 70% 30% / 40% 50% 60% 50%',
                    '60% 40% 30% 70% / 50% 30% 70% 40%',
                    '40% 60% 70% 30% / 40% 50% 60% 50%',
                  ],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 m-auto w-3/4 h-3/4 bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-600 blur-[60px] opacity-60 pointer-events-none z-0"
              />

              <motion.h1
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  filter: [
                    'drop-shadow(0 0 15px rgba(244,63,94,0.7)) drop-shadow(0 0 30px rgba(129,140,248,0.5))',
                    'drop-shadow(0 0 35px rgba(244,63,94,0.95)) drop-shadow(0 0 65px rgba(129,140,248,0.9))',
                    'drop-shadow(0 0 15px rgba(244,63,94,0.7)) drop-shadow(0 0 30px rgba(129,140,248,0.5))',
                  ],
                }}
                transition={{
                  backgroundPosition: { duration: 5, repeat: Infinity, ease: 'linear' },
                  filter: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                }}
                className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-transparent bg-clip-text bg-[length:200%_auto] bg-gradient-to-r from-rose-200 via-pink-100 to-indigo-200 relative z-20"
              >
                {text}
              </motion.h1>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
