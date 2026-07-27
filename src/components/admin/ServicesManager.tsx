import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ServiceItem } from '../../types';
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  DollarSign,
  Palette,
  Layout,
  Video,
  Globe,
  CheckCircle2,
  X,
  Save,
  Sparkles,
  Zap,
  Tag,
  ListPlus,
  Check
} from 'lucide-react';

export const ServicesManager: React.FC = () => {
  const { services, addService, updateService, deleteService } = usePortfolio();

  // Quick price editing inline state
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [quickPriceVal, setQuickPriceVal] = useState<string>('');

  // Full Edit / Add Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  const [formData, setFormData] = useState<Omit<ServiceItem, 'id'>>({
    title: '',
    description: '',
    iconName: 'Palette',
    priceRange: '',
    deliverables: []
  });

  const [newDeliverableInput, setNewDeliverableInput] = useState<string>('');

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Palette': return <Palette className="w-5 h-5 text-indigo-400" />;
      case 'Layout': return <Layout className="w-5 h-5 text-indigo-300" />;
      case 'Video': return <Video className="w-5 h-5 text-indigo-400" />;
      case 'Globe': return <Globe className="w-5 h-5 text-indigo-300" />;
      case 'Zap': return <Zap className="w-5 h-5 text-amber-400" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-purple-400" />;
      default: return <Briefcase className="w-5 h-5 text-indigo-400" />;
    }
  };

  const handleStartQuickPriceEdit = (srv: ServiceItem) => {
    setEditingPriceId(srv.id);
    setQuickPriceVal(srv.priceRange);
  };

  const handleSaveQuickPrice = async (srvId: string) => {
    if (!quickPriceVal.trim()) return;
    await updateService(srvId, { priceRange: quickPriceVal.trim() });
    setEditingPriceId(null);
  };

  const handleOpenAddModal = () => {
    setEditingService(null);
    setFormData({
      title: '',
      description: '',
      iconName: 'Palette',
      priceRange: '$150 - $500',
      deliverables: ['High-Resolution Vector Files', '3D Product Mockup', 'Source Files']
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (srv: ServiceItem) => {
    setEditingService(srv);
    setFormData({
      title: srv.title,
      description: srv.description,
      iconName: srv.iconName || 'Palette',
      priceRange: srv.priceRange,
      deliverables: [...srv.deliverables]
    });
    setIsModalOpen(true);
  };

  const handleAddDeliverable = () => {
    if (!newDeliverableInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      deliverables: [...prev.deliverables, newDeliverableInput.trim()]
    }));
    setNewDeliverableInput('');
  };

  const handleRemoveDeliverable = (index: number) => {
    setFormData(prev => ({
      ...prev,
      deliverables: prev.deliverables.filter((_, i) => i !== index)
    }));
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.priceRange) return;

    if (editingService) {
      await updateService(editingService.id, formData);
    } else {
      await addService(formData);
    }

    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to remove the service "${title}"?`)) {
      await deleteService(id);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Service Packages & Pricing Control</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Manage Creative Services & Adjust Prices
          </h2>
          <p className="text-xs text-zinc-400">
            Adjust service rates, packages, deliverables, and descriptions. All updates sync live to the client-facing booking page and main website.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg shadow-indigo-500/20 border border-indigo-400/30 flex items-center gap-2 transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service Package</span>
        </button>
      </div>

      {/* Services List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="bg-zinc-900/90 rounded-2xl border border-zinc-800/80 p-6 flex flex-col justify-between space-y-5 hover:border-indigo-500/40 transition-all shadow-lg relative group"
          >
            <div className="space-y-4">
              {/* Header: Icon, Title, Actions */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-900/40 border border-indigo-500/30 flex items-center justify-center shrink-0">
                    {getServiceIcon(srv.iconName)}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">
                      {srv.title}
                    </h3>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      ID: {srv.id}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(srv)}
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-indigo-600/80 text-zinc-300 hover:text-white transition-all text-xs flex items-center gap-1 cursor-pointer"
                    title="Edit Service Package"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(srv.id, srv.title)}
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-rose-600/80 text-zinc-400 hover:text-white transition-all cursor-pointer"
                    title="Delete Service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-zinc-300 font-light leading-relaxed">
                {srv.description}
              </p>

              {/* Price Range Adjustment Box */}
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    Service Rate / Price Range:
                  </span>
                  {editingPriceId !== srv.id && (
                    <button
                      onClick={() => handleStartQuickPriceEdit(srv)}
                      className="text-[11px] font-semibold text-indigo-300 hover:text-white underline underline-offset-2 cursor-pointer"
                    >
                      Quick Adjust
                    </button>
                  )}
                </div>

                {editingPriceId === srv.id ? (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={quickPriceVal}
                      onChange={(e) => setQuickPriceVal(e.target.value)}
                      placeholder="e.g. $250 - $600"
                      className="flex-1 bg-zinc-900 border border-indigo-500/80 rounded-lg px-3 py-1.5 text-xs text-white outline-none font-bold"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveQuickPrice(srv.id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => setEditingPriceId(null)}
                      className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-xs px-2.5 py-1.5 rounded-lg cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="text-sm font-black text-white tracking-tight bg-indigo-950/40 border border-indigo-500/30 px-3 py-1.5 rounded-lg inline-block">
                    {srv.priceRange}
                  </div>
                )}
              </div>

              {/* Deliverables */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                  Included Deliverables:
                </span>
                <ul className="space-y-1.5">
                  {srv.deliverables.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-zinc-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom info */}
            <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
              <span>Synced with Firebase Firestore</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Active Service
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-extrabold text-white">
                  {editingService ? 'Edit Service & Pricing' : 'Add New Service Package'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300">Service Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Logo & Brand Identity Suite"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              {/* Price Range */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-indigo-400">Price Range / Rate *</label>
                <input
                  type="text"
                  required
                  value={formData.priceRange}
                  onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                  placeholder="e.g. $250 - $600 or $300 fixed"
                  className="w-full bg-zinc-950 border border-indigo-500/50 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500 font-semibold"
                />
              </div>

              {/* Icon selection */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300">Service Icon</label>
                <select
                  value={formData.iconName}
                  onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                >
                  <option value="Palette">Palette (Branding & Graphics)</option>
                  <option value="Layout">Layout (Social Media & Posters)</option>
                  <option value="Video">Video (Editing & Motion)</option>
                  <option value="Globe">Globe (Web & UI/UX)</option>
                  <option value="Zap">Zap (Fast Delivery)</option>
                  <option value="Sparkles">Sparkles (Premium Package)</option>
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief summary of what this creative package includes..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              {/* Deliverables Builder */}
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
                  <span>Deliverables List</span>
                  <span className="text-[10px] text-zinc-500 font-normal">
                    {formData.deliverables.length} items
                  </span>
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDeliverableInput}
                    onChange={(e) => setNewDeliverableInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddDeliverable();
                      }
                    }}
                    placeholder="Add a deliverable e.g. Vector Source Files"
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddDeliverable}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <ListPlus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="space-y-1.5 max-h-36 overflow-y-auto pt-1">
                  {formData.deliverables.map((deliv, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-zinc-950 border border-zinc-800/80 px-3 py-1.5 rounded-lg text-xs text-zinc-300"
                    >
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        {deliv}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDeliverable(idx)}
                        className="text-zinc-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 border border-indigo-400/30 flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Service & Rates</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
