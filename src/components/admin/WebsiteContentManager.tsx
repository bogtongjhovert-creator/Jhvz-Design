import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Globe, Save, Check, Sparkles } from 'lucide-react';

export const WebsiteContentManager: React.FC = () => {
  const { websiteContent, updateWebsiteContent } = usePortfolio();

  const [form, setForm] = useState({ ...websiteContent });
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebsiteContent(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 animate-fadeIn max-w-4xl text-xs">
      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Website Content Manager</span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Website Text & Social Links
        </h2>
        <p className="text-xs text-zinc-400">
          Edit public studio details, hero headings, bio, and social profile links without code changes.
        </p>
      </div>

      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-4">
        <h3 className="font-bold text-white text-sm">Hero & Studio Branding</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-zinc-400 font-semibold mb-1">Brand Name</label>
            <input
              type="text"
              value={form.brandName}
              onChange={(e) => setForm({ ...form, brandName: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-zinc-400 font-semibold mb-1">Hero Title</label>
            <input
              type="text"
              value={form.heroTitle}
              onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-zinc-400 font-semibold mb-1">Hero Subtitle</label>
            <input
              type="text"
              value={form.heroSubtitle}
              onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-zinc-400 font-semibold mb-1">Studio Bio / About Text</label>
            <textarea
              rows={3}
              value={form.aboutBio}
              onChange={(e) => setForm({ ...form, aboutBio: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-100 outline-none resize-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-4">
        <h3 className="font-bold text-white text-sm">Contact Information & Social Links</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-zinc-400 font-semibold mb-1">Contact Email</label>
            <input
              type="email"
              value={form.contactEmail}
              onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-zinc-400 font-semibold mb-1">Contact Phone</label>
            <input
              type="text"
              value={form.contactPhone}
              onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-zinc-400 font-semibold mb-1">Behance URL</label>
            <input
              type="text"
              value={form.socialLinks.behance}
              onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, behance: e.target.value } })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 outline-none"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-zinc-950 font-bold px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 text-xs"
      >
        {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
        <span>{saved ? 'Saved Successfully!' : 'Save Website Changes'}</span>
      </button>
    </form>
  );
};
