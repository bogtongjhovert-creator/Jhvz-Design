import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { TestimonialItem } from '../../types';
import { Star, Trash2, Plus, Sparkles, Edit3, Save, X } from 'lucide-react';

export const TestimonialsManager: React.FC = () => {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = usePortfolio();

  const [clientName, setClientName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<TestimonialItem>>({});

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !comment) return;

    addTestimonial({
      clientName,
      company: company || 'Client',
      role: role || 'Founder',
      rating,
      comment,
      avatar,
      featured: true
    });

    setClientName('');
    setCompany('');
    setRole('');
    setComment('');
    setRating(5);
  };

  const startEdit = (t: TestimonialItem) => {
    setEditingId(t.id);
    setEditForm(t);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = (id: string) => {
    if (!editForm.clientName || !editForm.comment) return;
    updateTestimonial(id, editForm);
    setEditingId(null);
    setEditForm({});
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Feedback & Testimonials CMS</span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Client Reviews & Feedback Database
        </h2>
        <p className="text-xs text-zinc-400">
          All client reviews are persistently stored in Firebase Firestore and automatically synchronized live across all devices.
        </p>
      </div>

      {/* Add New Review Form */}
      <form onSubmit={handleAdd} className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 space-y-4 text-xs">
        <h3 className="font-bold text-white text-sm flex items-center justify-between">
          <span>Add New Client Testimonial</span>
          <span className="text-[10px] font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            Realtime Firestore Sync
          </span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="text"
            required
            placeholder="Client Name *"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 outline-none focus:border-cyan-500 transition-colors"
          />
          <input
            type="text"
            placeholder="Company (e.g. Aura Roasters)"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 outline-none focus:border-cyan-500 transition-colors"
          />
          <input
            type="text"
            placeholder="Role (e.g. Creative Director)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 outline-none focus:border-cyan-500 transition-colors"
          />
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 outline-none focus:border-cyan-500 transition-colors cursor-pointer"
          >
            <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
            <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
            <option value={3}>⭐⭐⭐ (3 Stars)</option>
            <option value={2}>⭐⭐ (2 Stars)</option>
            <option value={1}>⭐ (1 Star)</option>
          </select>
        </div>

        <div>
          <textarea
            rows={2}
            required
            placeholder="Client Review / Feedback Comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-100 outline-none focus:border-cyan-500 transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-zinc-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/10 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Publish & Store Feedback</span>
        </button>
      </form>

      {/* Testimonials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map((t) => {
          const isEditing = editingId === t.id;

          if (isEditing) {
            return (
              <div key={t.id} className="bg-zinc-900 p-4 rounded-2xl border border-cyan-500/50 space-y-3 relative text-xs shadow-xl">
                <div className="flex items-center justify-between text-cyan-400 font-bold">
                  <span>Editing Testimonial</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => saveEdit(t.id)}
                      className="text-emerald-400 hover:text-emerald-300 p-1"
                      title="Save changes"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="text-zinc-400 hover:text-white p-1"
                      title="Cancel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  value={editForm.clientName || ''}
                  onChange={(e) => setEditForm({ ...editForm, clientName: e.target.value })}
                  placeholder="Client Name"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-white outline-none"
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={editForm.company || ''}
                    onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                    placeholder="Company"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-white outline-none"
                  />
                  <select
                    value={editForm.rating || 5}
                    onChange={(e) => setEditForm({ ...editForm, rating: Number(e.target.value) })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-white outline-none"
                  >
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={2}>2 Stars</option>
                    <option value={1}>1 Star</option>
                  </select>
                </div>

                <textarea
                  rows={2}
                  value={editForm.comment || ''}
                  onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                  placeholder="Feedback comment"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white outline-none resize-none"
                />

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => saveEdit(t.id)}
                    className="px-3 py-1 bg-cyan-500 text-zinc-950 font-bold rounded-lg hover:bg-cyan-400"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div key={t.id} className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 space-y-3 relative group hover:border-zinc-700 transition-all">
              <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => startEdit(t)}
                  className="text-zinc-400 hover:text-cyan-400 transition-colors p-1"
                  title="Edit testimonial"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteTestimonial(t.id)}
                  className="text-zinc-400 hover:text-rose-400 transition-colors p-1"
                  title="Delete testimonial"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: t.rating || 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>

              <p className="text-xs text-zinc-300 italic">"{t.comment}"</p>

              <div className="text-[11px] font-bold text-white pt-1 border-t border-zinc-800/80 flex items-center justify-between">
                <span>
                  {t.clientName} <span className="text-cyan-400 font-normal">({t.company || 'Client'})</span>
                </span>
                <span className="text-[10px] font-normal text-zinc-500">{t.createdAt}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
