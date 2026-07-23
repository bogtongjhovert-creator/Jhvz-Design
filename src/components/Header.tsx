import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { LayoutDashboard, Sparkles, Plus, Search, Calendar, MessageSquare, ExternalLink } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    setActiveAdminTab,
    openBookingModalWithProject,
    openAddProjectModal,
    searchQuery,
    setSearchQuery,
    messages,
    bookings,
    websiteContent
  } = usePortfolio();

  const unreadMessagesCount = messages.filter(m => m.status === 'unread').length;
  const pendingBookingsCount = bookings.filter(b => b.status === 'pending').length;

  return (
    <header className="sticky top-0 z-40 bg-black/30 backdrop-blur-xl border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode('public')}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 group-hover:border-indigo-400/60 transition-all flex items-center justify-center backdrop-blur-md">
              <span className="font-extrabold text-indigo-400 group-hover:text-white transition-colors text-base tracking-wider">
                JV
              </span>
            </div>
            <div>
              <span className="font-extrabold text-white text-lg tracking-tight group-hover:text-indigo-400 transition-colors">
                {websiteContent.brandName || 'JHVZ DESIGN'}
              </span>
              <span className="block text-xs font-medium text-white/50">
                Creative Studio & CMS
              </span>
            </div>
          </button>
        </div>

        {/* Search Bar - Quick Header Access */}
        <div className="hidden md:flex items-center relative max-w-xs w-full">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search designs, tags, software..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass-input text-xs text-white placeholder-white/30 rounded-full pl-10 pr-4 py-2 border border-white/10 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/40 outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          {viewMode === 'public' ? (
            <button
              onClick={() => openBookingModalWithProject()}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform active:scale-95 border border-indigo-400/30"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Design</span>
            </button>
          ) : (
            <>
              <button
                onClick={openAddProjectModal}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md shadow-indigo-500/25 transition-all active:scale-95 border border-indigo-400/30"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Design</span>
              </button>

              <button
                onClick={() => setViewMode('public')}
                className="flex items-center gap-2 glass-panel glass-panel-hover text-white/80 hover:text-white font-medium text-xs px-3.5 py-2 rounded-xl transition-all"
              >
                <ExternalLink className="w-4 h-4 text-indigo-400" />
                <span className="hidden sm:inline">View Website</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
