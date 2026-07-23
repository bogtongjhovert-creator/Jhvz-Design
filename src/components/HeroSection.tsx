import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Sparkles, Calendar, Search, ArrowRight, Layers, Award, Users, CheckCircle2 } from 'lucide-react';

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
      {/* Subtle Indigo Glow Background Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-indigo-600/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[320px] bg-indigo-400/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-indigo-500/30 text-xs font-semibold text-indigo-300 shadow-xl backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Dynamic Portfolio & Content Management System</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
            {websiteContent.heroTitle || 'Crafting Visionary Visuals & Creative Brands'}
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-white/70 leading-relaxed max-w-2xl mx-auto font-light">
            {websiteContent.heroSubtitle ||
              'Full-service design studio specializing in Brand Identity, Motion Graphics, High-Impact Posters, UI/UX, and Custom Digital Media.'}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                const galleryEl = document.getElementById('portfolio-gallery');
                if (galleryEl) galleryEl.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-xl shadow-indigo-500/30 border border-indigo-400/40 transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              <span>Explore Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => openBookingModalWithProject()}
              className="flex items-center gap-2 glass-panel glass-panel-hover text-white font-semibold text-xs px-6 py-3.5 rounded-xl transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Book Design Service</span>
            </button>
          </div>

          {/* Quick Categories Filter Pills */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-white/50 font-medium">Popular Categories:</span>
            {quickFilterTags.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  const galleryEl = document.getElementById('portfolio-gallery');
                  if (galleryEl) galleryEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-3.5 py-1.5 rounded-xl glass-pill text-white/80 hover:text-white hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-all"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-8 border-t border-white/10">
          <div className="glass-panel glass-panel-hover rounded-2xl p-5 text-center">
            <div className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center gap-1">
              <span>{publishedCount}</span>
              <span className="text-indigo-400">+</span>
            </div>
            <p className="text-xs font-medium text-white/60 mt-1">Uploaded Projects</p>
          </div>

          <div className="glass-panel glass-panel-hover rounded-2xl p-5 text-center">
            <div className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center gap-1">
              <span>{websiteContent.aboutExperienceYears || 6}</span>
              <span className="text-indigo-400">+ Yrs</span>
            </div>
            <p className="text-xs font-medium text-white/60 mt-1">Design Experience</p>
          </div>

          <div className="glass-panel glass-panel-hover rounded-2xl p-5 text-center">
            <div className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center gap-1">
              <span>{websiteContent.completedProjectsCount || 280}</span>
              <span className="text-indigo-400">+</span>
            </div>
            <p className="text-xs font-medium text-white/60 mt-1">Client Deliverables</p>
          </div>

          <div className="glass-panel glass-panel-hover rounded-2xl p-5 text-center">
            <div className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center gap-1">
              <span>{websiteContent.satisfiedClientsCount || 140}</span>
              <span className="text-indigo-400">+</span>
            </div>
            <p className="text-xs font-medium text-white/60 mt-1">Happy Clients</p>
          </div>
        </div>
      </div>
    </section>
  );
};
