import React, { useMemo } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { PortfolioItem } from '../types';
import {
  Search,
  Filter,
  Eye,
  Heart,
  ExternalLink,
  Play,
  Sparkles,
  Calendar,
  Layers,
  ArrowUpRight,
  Plus
} from 'lucide-react';

export const PortfolioGallery: React.FC = () => {
  const {
    portfolio,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    setSelectedProjectForModal,
    openBookingModalWithProject,
    toggleLike,
    incrementViews,
    openAddProjectModal
  } = usePortfolio();

  // Filter published & public projects
  const filteredProjects = useMemo(() => {
    return portfolio.filter((item) => {
      // Must be published and public
      if (item.status !== 'published' || !item.public) return false;

      // Category filter
      if (selectedCategory !== 'All') {
        const catMatch =
          item.category.toLowerCase() === selectedCategory.toLowerCase() ||
          (selectedCategory === 'Poster' && item.category.toLowerCase().includes('poster')) ||
          (selectedCategory === 'Logo' && item.category.toLowerCase().includes('logo')) ||
          (selectedCategory === 'Branding' && (item.category.toLowerCase().includes('brand') || item.category.toLowerCase().includes('identity'))) ||
          (selectedCategory === 'Website' && (item.category.toLowerCase().includes('web') || item.category.toLowerCase().includes('landing'))) ||
          (selectedCategory === 'Video' && item.category.toLowerCase().includes('video')) ||
          (selectedCategory === 'Print' && (item.category.toLowerCase().includes('print') || item.category.toLowerCase().includes('flyer') || item.category.toLowerCase().includes('brochure')));

        if (!catMatch) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const inTitle = item.title.toLowerCase().includes(query);
        const inCat = item.category.toLowerCase().includes(query);
        const inDesc = item.shortDescription.toLowerCase().includes(query) || item.detailedDescription.toLowerCase().includes(query);
        const inClient = item.clientName ? item.clientName.toLowerCase().includes(query) : false;
        const inTags = item.tags.some(t => t.toLowerCase().includes(query));
        const inSoftware = item.softwareUsed.some(s => s.toLowerCase().includes(query));

        if (!inTitle && !inCat && !inDesc && !inClient && !inTags && !inSoftware) {
          return false;
        }
      }

      return true;
    });
  }, [portfolio, selectedCategory, searchQuery]);

  // Main Category Tab Buttons List
  const displayCategoryTabs = useMemo(() => {
    const defaultTabs = [
      'All',
      'Poster',
      'Logo',
      'Branding',
      'Website',
      'Photography',
      'Video',
      'Motion Graphics',
      'Print',
      'UI Design',
      'Others'
    ];

    // Combine default tabs with custom categories
    const customNames = categories.map(c => c.name);
    const combined = Array.from(new Set([...defaultTabs, ...customNames]));
    return combined;
  }, [categories]);

  const handleCardClick = (item: PortfolioItem) => {
    incrementViews(item.id);
    setSelectedProjectForModal(item);
  };

  return (
    <section id="portfolio-gallery" className="py-16 bg-zinc-950 text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Title & Live Search Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-widest mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Portfolio Showcase</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Featured Designs & Case Studies
            </h2>
            <p className="text-sm text-white/60 mt-1 max-w-xl font-light">
              Filter by category or search through project titles, clients, and software used. Click any item for full project details.
            </p>
          </div>

          {/* Search Bar Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, tag, software..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass-input text-xs text-white placeholder-white/30 rounded-xl pl-10 pr-10 py-2.5 border border-white/12 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/40 outline-none transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-white/40 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Filters Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="flex items-center gap-1.5 text-xs text-white/40 font-semibold uppercase pr-2 border-r border-white/10 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter</span>
          </div>

          {displayCategoryTabs.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  isSelected
                    ? 'glass-pill-active font-bold scale-105'
                    : 'glass-pill text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Active Filter Indicator */}
        {(selectedCategory !== 'All' || searchQuery) && (
          <div className="flex items-center justify-between glass-panel px-4 py-2.5 rounded-xl text-xs text-white/70">
            <div>
              Showing results for:{' '}
              {selectedCategory !== 'All' && (
                <span className="font-bold text-indigo-400 mr-2">Category: "{selectedCategory}"</span>
              )}
              {searchQuery && (
                <span className="font-bold text-indigo-300">Search: "{searchQuery}"</span>
              )}
            </div>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="text-xs text-white/60 hover:text-white underline font-medium"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Dynamic Portfolio Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((item) => (
              <div
                key={item.id}
                className="group glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col justify-between"
              >
                {/* Media Thumbnail Container */}
                <div
                  onClick={() => handleCardClick(item)}
                  className="relative aspect-[16/10] bg-black/40 overflow-hidden cursor-pointer"
                >
                  <img
                    src={item.thumbnail || item.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Category Badge & Media Type Icon */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg glass-pill text-[10px] font-bold text-indigo-300 uppercase tracking-wider shadow-md">
                      {item.category}
                    </span>
                    {item.featured && (
                      <span className="px-2 py-0.5 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-[10px] font-bold text-indigo-200">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Video / External Link Badge */}
                  <div className="absolute top-3 right-3">
                    {item.mediaType === 'video' && (
                      <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    )}
                    {item.mediaType === 'link' && (
                      <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-lg">
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Quick Overlay Action on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[4px]">
                    <span className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xl flex items-center gap-1.5 border border-indigo-400/30">
                      View Project <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3
                      onClick={() => handleCardClick(item)}
                      className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 cursor-pointer"
                    >
                      {item.title}
                    </h3>
                    <p className="text-xs text-white/60 mt-1.5 line-clamp-2 leading-relaxed">
                      {item.shortDescription}
                    </p>
                  </div>

                  {/* Software Tags */}
                  {item.softwareUsed && item.softwareUsed.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.softwareUsed.slice(0, 4).map((sw) => (
                        <span
                          key={sw}
                          className="px-2 py-0.5 rounded-md glass-pill text-[10px] font-medium text-white/70"
                        >
                          {sw}
                        </span>
                      ))}
                      {item.softwareUsed.length > 4 && (
                        <span className="px-1.5 py-0.5 rounded-md glass-pill text-[10px] text-white/40">
                          +{item.softwareUsed.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Card Footer Metrics & Actions */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(item.id);
                        }}
                        className="flex items-center gap-1.5 text-white/60 hover:text-rose-400 transition-colors group/like"
                        title="Like this design"
                      >
                        <Heart className="w-3.5 h-3.5 group-hover/like:scale-125 transition-transform" />
                        <span>{item.likes}</span>
                      </button>

                      <div className="flex items-center gap-1 text-white/40">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{item.views}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.acceptSimilar && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openBookingModalWithProject(item);
                          }}
                          className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1"
                        >
                          <span>Request Similar</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleCardClick(item)}
                        className="glass-pill hover:bg-white/15 text-white p-1.5 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="text-center py-20 glass-panel rounded-3xl max-w-xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl glass-pill flex items-center justify-center mx-auto text-white/40">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">No Designs Found</h3>
            <p className="text-xs text-white/60 max-w-sm mx-auto font-light">
              We couldn't find any published design matching "{searchQuery || selectedCategory}". Try searching for another term or reset your filter.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="glass-panel glass-panel-hover text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
