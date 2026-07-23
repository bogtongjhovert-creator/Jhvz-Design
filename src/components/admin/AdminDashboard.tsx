import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  FolderKanban,
  Eye,
  Heart,
  CalendarCheck,
  MessageCircle,
  Plus,
  ArrowUpRight,
  Sparkles,
  Layers,
  Star
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    portfolio,
    bookings,
    messages,
    testimonials,
    openAddProjectModal,
    setActiveAdminTab,
    setSelectedProjectForModal
  } = usePortfolio();

  const totalViews = portfolio.reduce((acc, p) => acc + (p.views || 0), 0);
  const totalLikes = portfolio.reduce((acc, p) => acc + (p.likes || 0), 0);
  const publishedProjects = portfolio.filter(p => p.status === 'published').length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const unreadMessages = messages.filter(m => m.status === 'unread').length;

  const recentUploads = portfolio.slice(0, 5);

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 p-6 rounded-3xl border border-zinc-800 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dynamic CMS Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome to JHVZ DESIGN Studio CMS
          </h1>
          <p className="text-xs text-zinc-400 max-w-xl">
            Add new designs, organize categories, manage client requests, and update website content in real time—no code edits required.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <button
            onClick={openAddProjectModal}
            className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-zinc-950 font-black text-xs px-5 py-3 rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 hover:from-cyan-400 hover:to-emerald-400 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>➕ Add New Design</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Published Projects</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-white">{publishedProjects}</span>
            <span className="text-[10px] text-zinc-500 block mt-0.5">out of {portfolio.length} total</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Impressions</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-white">{totalViews.toLocaleString()}</span>
            <span className="text-[10px] text-zinc-500 block mt-0.5">Public views</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Pending Bookings</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-white">{pendingBookings}</span>
            <span className="text-[10px] text-zinc-500 block mt-0.5">
              {bookings.length} total requests
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Unread Messages</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-white">{unreadMessages}</span>
            <span className="text-[10px] text-zinc-500 block mt-0.5">{messages.length} total inquiries</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Uploads & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Portfolio Items Table (8 cols) */}
        <div className="lg:col-span-8 bg-zinc-900 rounded-2xl border border-zinc-800 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div>
              <h3 className="text-lg font-black text-white">Recent Portfolio Uploads</h3>
              <p className="text-xs text-zinc-400">Latest designs added to your portfolio database</p>
            </div>
            <button
              onClick={() => setActiveAdminTab('portfolio')}
              className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-zinc-800">
            {recentUploads.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedProjectForModal(item)}
                className="py-3 flex items-center justify-between gap-4 hover:bg-zinc-800/40 p-2 rounded-xl cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-12 h-9 rounded-lg object-cover border border-zinc-700 shrink-0"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{item.title}</h4>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-zinc-400">
                      <span className="text-cyan-400 font-semibold">{item.category}</span>
                      <span>•</span>
                      <span>{item.createdDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-xs">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    item.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-300'
                  }`}>
                    {item.status}
                  </span>
                  <div className="flex items-center gap-1 text-zinc-400">
                    <Heart className="w-3 h-3 text-rose-400 fill-current" />
                    <span className="text-[11px] font-semibold">{item.likes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 space-y-4">
            <h3 className="text-sm font-black text-white">Quick CMS Actions</h3>

            <div className="space-y-2">
              <button
                onClick={openAddProjectModal}
                className="w-full bg-zinc-800 hover:bg-cyan-500 hover:text-zinc-950 text-zinc-200 font-bold text-xs p-3 rounded-xl transition-all flex items-center justify-between"
              >
                <span>➕ Add New Design</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveAdminTab('categories')}
                className="w-full bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 text-zinc-200 font-bold text-xs p-3 rounded-xl transition-all flex items-center justify-between"
              >
                <span>🏷️ Manage Categories</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveAdminTab('bookings')}
                className="w-full bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-zinc-200 font-bold text-xs p-3 rounded-xl transition-all flex items-center justify-between"
              >
                <span>📅 Review Client Bookings ({pendingBookings})</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveAdminTab('content')}
                className="w-full bg-zinc-800 hover:bg-cyan-500 hover:text-zinc-950 text-zinc-200 font-bold text-xs p-3 rounded-xl transition-all flex items-center justify-between"
              >
                <span>🌐 Update Website Content</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
