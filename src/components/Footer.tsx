import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Calendar, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { websiteContent, openBookingModalWithProject, setSelectedCategory } = usePortfolio();

  return (
    <footer className="border-t border-white/10 text-white/60 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg glass-panel flex items-center justify-center font-bold text-indigo-300 text-xs border border-indigo-400/40">
                JHVZ
              </div>
              <span className="font-black text-white text-base tracking-tight">
                {websiteContent.brandName || 'JHVZ DESIGN'}
              </span>
            </div>
            <p className="text-white/50 leading-relaxed text-[11px] font-light">
              {websiteContent.aboutBio}
            </p>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Design Categories
            </h4>
            <ul className="space-y-2 text-[11px]">
              {['Poster Design', 'Logo Design', 'Brand Identity', 'Motion Graphics', 'UI Design', 'Packaging'].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat);
                      const galleryEl = document.getElementById('portfolio-gallery');
                      if (galleryEl) galleryEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-indigo-300 transition-colors"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* External Portfolios */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Social Showcase
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <a href={websiteContent.socialLinks.behance} target="_blank" rel="noreferrer" className="hover:text-indigo-300 transition-colors">
                  Behance Portfolio
                </a>
              </li>
              <li>
                <a href={websiteContent.socialLinks.dribbble} target="_blank" rel="noreferrer" className="hover:text-indigo-300 transition-colors">
                  Dribbble Showcase
                </a>
              </li>
              <li>
                <a href={websiteContent.socialLinks.instagram} target="_blank" rel="noreferrer" className="hover:text-indigo-300 transition-colors">
                  Instagram Feed
                </a>
              </li>
              <li>
                <a href={websiteContent.socialLinks.facebook} target="_blank" rel="noreferrer" className="hover:text-indigo-300 transition-colors">
                  Facebook Page
                </a>
              </li>
            </ul>
          </div>

          {/* Client Booking & Services */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Client Consultations
            </h4>
            <p className="text-[11px] text-white/50 mb-3 font-light leading-relaxed">
              Ready to start your brand design project? Schedule a consultation or request custom deliverables.
            </p>
            <button
              onClick={() => openBookingModalWithProject()}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all border border-indigo-400/30 shadow-lg shadow-indigo-500/20"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule Project Booking</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/40">
          <p>© {new Date().getFullYear()} JHVZ DESIGN. All Rights Reserved.</p>
          <div className="flex items-center gap-1">
            <span>Powered by JHVZ Dynamic Portfolio Management System</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
