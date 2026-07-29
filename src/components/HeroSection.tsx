import React from 'react';
import { motion } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import { ThreeDGlowingTitle } from './ThreeDGlowingTitle';
import { Sparkles, Calendar, Search, ArrowRight, Layers, Award, Users, Film, Play } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const {
    websiteContent,
    portfolio,
    setSelectedCategory,
    setSearchQuery,
    openBookingModalWithProject,
    setViewMode,
    setActiveAdminTab
  } = usePortfolio();

  const publishedCount = portfolio.filter(p => p.status === 'published').length;

  const quickFilterTags = [
    'Poster Design',
    'Logo Design',
    'Brand Identity',
    'Motion Graphics',
    'UI Design',
    'Packaging'
  ];

  return (
    <section className="relative overflow-hidden py-16 lg:py-24 border-b border-white/10">
      {/* Animated Motion Glow Orbs & Vector Rings */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          rotate: [0, 90, 0],
          opacity: [0.12, 0.2, 0.12]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-indigo-600 blur-[140px] rounded-full pointer-events-none"
      />

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 40, 0],
          opacity: [0.08, 0.16, 0.08]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/3 right-10 w-[450px] h-[320px] bg-indigo-400 blur-[150px] rounded-full pointer-events-none"
      />

      {/* Floating Graphic Vector Rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        className="absolute top-12 left-10 w-48 h-48 border border-indigo-500/15 rounded-full pointer-events-none hidden md:block"
        style={{ borderDasharray: '8 8' }}
      />

      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-10 right-12 w-64 h-64 border border-indigo-400/10 rounded-full pointer-events-none hidden md:block"
        style={{ borderDasharray: '12 12' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-indigo-500/30 text-xs font-semibold text-indigo-300 shadow-xl backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Dynamic Portfolio & Motion Studio CMS</span>
          </motion.div>

          {/* 3D Glowing Animated Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <ThreeDGlowingTitle text={websiteContent.heroTitle || 'Crafting Visionary Visuals & Creative Brands'} />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-white/70 leading-relaxed max-w-2xl mx-auto font-light"
          >
            {websiteContent.heroSubtitle ||
              'Full-service design studio specializing in Brand Identity, Motion Graphics, High-Impact Posters, UI/UX, and Custom Digital Media.'}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const galleryEl = document.getElementById('portfolio-gallery');
                if (galleryEl) galleryEl.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-xl shadow-indigo-500/30 border border-indigo-400/40 transition-all cursor-pointer"
            >
              <span>Explore Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openBookingModalWithProject()}
              className="flex items-center gap-2 glass-panel glass-panel-hover text-white font-semibold text-xs px-6 py-3.5 rounded-xl transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Book Design Service</span>
            </motion.button>
          </motion.div>

          {/* Quick Categories Filter Pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="pt-6 flex flex-wrap items-center justify-center gap-2 text-xs"
          >
            <span className="text-white/50 font-medium">Popular Categories:</span>
            {quickFilterTags.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedCategory(cat);
                  const galleryEl = document.getElementById('portfolio-gallery');
                  if (galleryEl) galleryEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-3.5 py-1.5 rounded-xl glass-pill text-white/80 hover:text-white hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-all cursor-pointer"
              >
                {cat}
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Stats Grid with Motion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-8 border-t border-white/10"
        >
          <motion.div whileHover={{ y: -5 }} className="glass-panel glass-panel-hover rounded-2xl p-5 text-center transition-all">
            <div className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center gap-1">
              <span>{publishedCount}</span>
              <span className="text-indigo-400">+</span>
            </div>
            <p className="text-xs font-medium text-white/60 mt-1">Uploaded Projects</p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="glass-panel glass-panel-hover rounded-2xl p-5 text-center transition-all">
            <div className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center gap-1">
              <span>{websiteContent.aboutExperienceYears || 6}</span>
              <span className="text-indigo-400">+ Yrs</span>
            </div>
            <p className="text-xs font-medium text-white/60 mt-1">Design Experience</p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="glass-panel glass-panel-hover rounded-2xl p-5 text-center transition-all">
            <div className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center gap-1">
              <span>{websiteContent.completedProjectsCount || 280}</span>
              <span className="text-indigo-400">+</span>
            </div>
            <p className="text-xs font-medium text-white/60 mt-1">Client Deliverables</p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="glass-panel glass-panel-hover rounded-2xl p-5 text-center transition-all">
            <div className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center gap-1">
              <span>{websiteContent.satisfiedClientsCount || 140}</span>
              <span className="text-indigo-400">+</span>
            </div>
            <p className="text-xs font-medium text-white/60 mt-1">Happy Clients</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
