import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  LayoutDashboard,
  Briefcase,
  FolderKanban,
  Tags,
  CalendarCheck,
  MessageSquare,
  MessageCircle,
  Globe,
  BarChart2,
  Settings,
  Trash2,
  Plus,
  ArrowLeft,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  LogOut
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const {
    activeAdminTab,
    setActiveAdminTab,
    setViewMode,
    logoutAdmin,
    openAddProjectModal,
    bookings,
    messages,
    trashItems
  } = usePortfolio();

  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const unreadMessages = messages.filter(m => m.status === 'unread').length;
  const trashedCount = trashItems.length;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'portfolio', label: 'Portfolio Manager', icon: FolderKanban },
    { id: 'categories', label: 'Categories', icon: Tags },
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck, badge: pendingBookings },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'messages', label: 'Messages', icon: MessageCircle, badge: unreadMessages },
    { id: 'content', label: 'Website Content', icon: Globe },
    { id: 'trash', label: 'Recycle Bin', icon: Trash2, badge: trashedCount },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-zinc-900 border-r border-zinc-800 shrink-0 flex flex-col justify-between">
        <div className="p-5 space-y-6">
          
          {/* Logo & Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 p-0.5 shadow-md shadow-indigo-500/20 border border-indigo-400/30">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center font-black text-indigo-300 text-xs">
                  CMS
                </div>
              </div>
              <div>
                <span className="font-extrabold text-white text-sm block tracking-tight">
                  JHVZ Admin
                </span>
                <span className="text-[10px] text-indigo-300 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3 h-3 text-indigo-400" /> Authenticated
                </span>
              </div>
            </div>

            <button
              onClick={() => setViewMode('public')}
              className="md:hidden p-2 rounded-xl glass-pill text-white/70 hover:text-white"
              title="Return to Website"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Add Button */}
          <button
            onClick={openAddProjectModal}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 border border-indigo-400/30 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>➕ Add New Design</span>
          </button>

          {/* Navigation Menu Links */}
          <nav className="space-y-1 pt-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/40 px-3 mb-2">
              Management Menu
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeAdminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveAdminTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'glass-panel text-indigo-300 border border-indigo-500/40'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-white/40'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge ? (
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500 text-white font-bold text-[10px]">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 bg-black/40 space-y-2 text-xs">
          <button
            onClick={() => setViewMode('public')}
            className="w-full glass-panel glass-panel-hover text-white/80 hover:text-white py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-indigo-400" />
            <span>View Public Website</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock & Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
