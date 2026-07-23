import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PortfolioItem, ProjectStatus } from '../../types';
import {
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  Copy,
  Archive,
  Star,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Clock,
  Filter
} from 'lucide-react';

export const PortfolioManager: React.FC = () => {
  const {
    portfolio,
    categories,
    openAddProjectModal,
    openEditProjectModal,
    deleteProject,
    archiveProject,
    duplicateProject,
    toggleFeatured,
    setSelectedProjectForModal,
    updateProject
  } = usePortfolio();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Filter items
  const filteredList = portfolio.filter((item) => {
    if (filterCategory !== 'All' && item.category.toLowerCase() !== filterCategory.toLowerCase()) {
      return false;
    }
    if (filterStatus !== 'All' && item.status !== filterStatus) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      const matchClient = item.clientName ? item.clientName.toLowerCase().includes(q) : false;
      return matchTitle || matchCat || matchClient;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Admin CMS</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Portfolio Manager
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Manage, publish, edit, or archive design projects. Changes take effect on the public website immediately.
          </p>
        </div>

        <button
          onClick={openAddProjectModal}
          className="bg-gradient-to-r from-cyan-500 via-emerald-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-zinc-950 font-black text-xs px-5 py-3 rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>➕ Add New Design</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-zinc-200 placeholder-zinc-500 focus:border-cyan-500 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 font-medium">Category:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-zinc-200 focus:border-cyan-500 outline-none"
            >
              <option value="All">All Categories ({portfolio.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-zinc-500 font-medium">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-zinc-200 focus:border-cyan-500 outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Portfolio Items Table */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-400 font-bold uppercase tracking-wider border-b border-zinc-800">
              <tr>
                <th className="py-3.5 px-4">Thumbnail</th>
                <th className="py-3.5 px-4">Project Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Date Added</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Featured</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {filteredList.length > 0 ? (
                filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-800/50 transition-colors">
                    
                    {/* Thumbnail Column */}
                    <td className="py-3 px-4">
                      <div className="w-14 h-10 rounded-lg bg-zinc-950 border border-zinc-800 overflow-hidden relative">
                        <img
                          src={item.thumbnail || item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    {/* Project Title Column */}
                    <td className="py-3 px-4 font-bold text-white max-w-xs">
                      <div className="line-clamp-1">{item.title}</div>
                      <span className="text-[10px] text-zinc-500 block font-normal">
                        {item.clientName ? `Client: ${item.clientName}` : `Designer: ${item.designer}`}
                      </span>
                    </td>

                    {/* Category Column */}
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-[11px] font-semibold text-cyan-400">
                        {item.category}
                      </span>
                    </td>

                    {/* Date Added Column */}
                    <td className="py-3 px-4 font-mono text-zinc-400">
                      {item.createdDate || item.projectDate}
                    </td>

                    {/* Status Column */}
                    <td className="py-3 px-4">
                      {item.status === 'published' ? (
                        <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[10px] uppercase">
                          Published
                        </span>
                      ) : item.status === 'draft' ? (
                        <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-[10px] uppercase">
                          Draft
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-500 font-bold text-[10px] uppercase">
                          Archived
                        </span>
                      )}
                    </td>

                    {/* Featured Toggle Column */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleFeatured(item.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          item.featured ? 'text-amber-400 bg-amber-500/10' : 'text-zinc-600 hover:text-zinc-400'
                        }`}
                        title="Toggle Featured Project"
                      >
                        <Star className={`w-4 h-4 ${item.featured ? 'fill-current' : ''}`} />
                      </button>
                    </td>

                    {/* Actions Column (View, Edit, Delete, Archive, Duplicate) */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedProjectForModal(item)}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white"
                          title="View Lightbox Preview"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => openEditProjectModal(item)}
                          className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400"
                          title="Edit Design"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => duplicateProject(item.id)}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white"
                          title="Duplicate Design"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => archiveProject(item.id)}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-amber-300"
                          title="Archive Design"
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
                              deleteProject(item.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                          title="Delete Design"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500 text-xs">
                    No portfolio items match your filter. Click "Add New Design" to upload one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
