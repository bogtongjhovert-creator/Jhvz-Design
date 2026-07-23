import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { BarChart2, Eye, Heart, FolderKanban, Sparkles } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { portfolio } = usePortfolio();

  const totalViews = portfolio.reduce((acc, p) => acc + (p.views || 0), 0);
  const totalLikes = portfolio.reduce((acc, p) => acc + (p.likes || 0), 0);

  // Group views by category
  const categoryBreakdown = portfolio.reduce((acc: Record<string, number>, p) => {
    acc[p.category] = (acc[p.category] || 0) + p.views;
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl text-xs">
      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Analytics Overview</span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Portfolio Traffic & Engagement
        </h2>
        <p className="text-xs text-zinc-400">
          Analytics breakdown of views, likes, and category popularities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 space-y-3">
          <h3 className="font-bold text-white text-sm">Engagement Summary</h3>
          <div className="space-y-2 text-zinc-300">
            <div className="flex justify-between py-1 border-b border-zinc-800">
              <span>Total Portfolio Views:</span>
              <span className="font-bold text-cyan-400">{totalViews}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-800">
              <span>Total Likes Appreciated:</span>
              <span className="font-bold text-rose-400">{totalLikes}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Total Projects:</span>
              <span className="font-bold text-emerald-400">{portfolio.length}</span>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 space-y-3">
          <h3 className="font-bold text-white text-sm">Category Views Breakdown</h3>
          <div className="space-y-2">
            {Object.entries(categoryBreakdown).map(([cat, views]) => {
              const numViews = Number(views);
              const pct = totalViews > 0 ? Math.round((numViews / totalViews) * 100) : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-[11px] text-zinc-300">
                    <span>{cat}</span>
                    <span className="font-bold text-cyan-400">{views} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
