import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Star, Trash2, Plus, Sparkles } from 'lucide-react';

export const TestimonialsManager: React.FC = () => {
  const { testimonials, addTestimonial, deleteTestimonial } = usePortfolio();

  const [clientName, setClientName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80');

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
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Testimonials CMS</span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Client Reviews & Testimonials
        </h2>
        <p className="text-xs text-zinc-400">
          Add or remove client reviews displayed on the public website.
        </p>
      </div>

      {/* Add New Review Form */}
      <form onSubmit={handleAdd} className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 space-y-4 text-xs">
        <h3 className="font-bold text-white text-sm">Add New Client Testimonial</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            required
            placeholder="Client Name *"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 outline-none"
          />
          <input
            type="text"
            placeholder="Company (e.g. Aura Roasters)"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 outline-none"
          />
          <input
            type="text"
            placeholder="Role (e.g. Creative Director)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 outline-none"
          />
        </div>

        <div>
          <textarea
            rows={2}
            required
            placeholder="Client Review Comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-100 outline-none resize-none"
          />
        </div>

        <button
          type="submit"
          className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-zinc-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Testimonial</span>
        </button>
      </form>

      {/* Testimonials List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 space-y-3 relative">
            <button
              onClick={() => deleteTestimonial(t.id)}
              className="absolute top-3 right-3 text-rose-400 hover:text-rose-300"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1 text-amber-400">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <p className="text-xs text-zinc-300 italic">"{t.comment}"</p>
            <div className="text-[11px] font-bold text-white">
              {t.clientName} <span className="text-cyan-400 font-normal">({t.company})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
