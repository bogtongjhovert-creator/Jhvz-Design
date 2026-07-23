import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  Trash2,
  RotateCcw,
  Sparkles,
  CalendarCheck,
  FolderKanban,
  MessageSquare,
  MessageCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

export const TrashManager: React.FC = () => {
  const { trashItems, restoreFromTrash, permanentlyDelete, emptyTrash } = usePortfolio();
  const [activeFilter, setActiveFilter] = useState<'all' | 'booking' | 'project' | 'testimonial' | 'message'>('all');

  const filteredItems = trashItems.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.type === activeFilter;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <CalendarCheck className="w-4 h-4 text-amber-400" />;
      case 'project':
        return <FolderKanban className="w-4 h-4 text-cyan-400" />;
      case 'testimonial':
        return <MessageSquare className="w-4 h-4 text-emerald-400" />;
      case 'message':
        return <MessageCircle className="w-4 h-4 text-indigo-400" />;
      default:
        return <Trash2 className="w-4 h-4 text-zinc-400" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'booking':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'project':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'testimonial':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'message':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  const handleEmptyTrash = () => {
    if (confirm('Are you sure you want to permanently delete ALL items in the Recycle Bin? This action cannot be undone!')) {
      emptyTrash();
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Banner */}
      <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 uppercase tracking-wider">
            <Trash2 className="w-3.5 h-3.5" />
            <span>Recycle Bin & Safety Storage</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Site Recycle Bin</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {trashItems.length} Deleted Items
            </span>
          </h2>
          <p className="text-xs text-zinc-400 max-w-xl">
            Items removed from Bookings, Portfolio, Reviews, or Messages are stored safely in the Recycle Bin. Restore them anytime or delete them permanently.
          </p>
        </div>

        {trashItems.length > 0 && (
          <button
            onClick={handleEmptyTrash}
            className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-rose-600/20 transition-all self-start md:self-auto cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Empty Recycle Bin ({trashItems.length})</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-800 pb-3">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeFilter === 'all'
              ? 'bg-zinc-800 text-white border border-zinc-700'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          All Trashed ({trashItems.length})
        </button>
        <button
          onClick={() => setActiveFilter('booking')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeFilter === 'booking'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Bookings ({trashItems.filter((i) => i.type === 'booking').length})
        </button>
        <button
          onClick={() => setActiveFilter('project')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeFilter === 'project'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Designs ({trashItems.filter((i) => i.type === 'project').length})
        </button>
        <button
          onClick={() => setActiveFilter('testimonial')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeFilter === 'testimonial'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Reviews ({trashItems.filter((i) => i.type === 'testimonial').length})
        </button>
        <button
          onClick={() => setActiveFilter('message')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeFilter === 'message'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Messages ({trashItems.filter((i) => i.type === 'message').length})
        </button>
      </div>

      {/* Trashed Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              key={`${item.collectionName}-${item.id}`}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-lg hover:border-zinc-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    {getIcon(item.type)}
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${getTypeBadge(
                        item.type
                      )}`}
                    >
                      {item.type}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-medium">
                    Removed {item.trashedAt}
                  </span>
                </div>

                <h3 className="font-bold text-white text-sm line-clamp-2">
                  {item.title}
                </h3>

                {item.type === 'booking' && (
                  <div className="text-xs text-zinc-400 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 space-y-1">
                    <div><strong className="text-zinc-300">Client:</strong> {(item.originalData as any).clientName}</div>
                    <div><strong className="text-zinc-300">Email:</strong> {(item.originalData as any).email}</div>
                    <div><strong className="text-zinc-300">Details:</strong> {(item.originalData as any).projectDetails}</div>
                  </div>
                )}

                {item.type === 'project' && (
                  <div className="text-xs text-zinc-400 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 space-y-1">
                    <div><strong className="text-zinc-300">Category:</strong> {(item.originalData as any).category}</div>
                    <div><strong className="text-zinc-300">Description:</strong> {(item.originalData as any).shortDescription}</div>
                  </div>
                )}

                {item.type === 'testimonial' && (
                  <div className="text-xs text-zinc-400 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800">
                    "{ (item.originalData as any).comment }"
                  </div>
                )}

                {item.type === 'message' && (
                  <div className="text-xs text-zinc-400 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800">
                    {(item.originalData as any).content}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => restoreFromTrash(item.collectionName, item.id)}
                  className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore to Site</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm('Permanently delete this record? This cannot be undone.')) {
                      permanentlyDelete(item.collectionName, item.id);
                    }
                  }}
                  className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Permanently</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 py-16 text-center text-zinc-500 text-xs bg-zinc-900 rounded-3xl border border-zinc-800 space-y-2">
            <Trash2 className="w-8 h-8 text-zinc-700 mx-auto" />
            <p className="font-bold text-zinc-400">Recycle Bin is Empty</p>
            <p className="text-[11px] text-zinc-600">Items you delete from Bookings, Designs, or Reviews will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};
