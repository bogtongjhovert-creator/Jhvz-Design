import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Tags, Sparkles, Check } from 'lucide-react';

export const CategoryManager: React.FC = () => {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    portfolio
  } = usePortfolio();

  const [newCatName, setNewCatName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory(newCatName.trim());
    setNewCatName('');
  };

  const handleStartEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const handleSaveEdit = (id: string) => {
    if (editingName.trim()) {
      updateCategory(id, editingName.trim());
    }
    setEditingId(null);
    setEditingName('');
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const newCats = [...categories];
    const temp = newCats[index];
    newCats[index] = newCats[targetIndex];
    newCats[targetIndex] = temp;

    reorderCategories(newCats);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Category Manager</span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Admin Category Management
        </h2>
        <p className="text-xs text-zinc-400">
          Create, edit, delete, or reorder categories. Any change reflects across the public portfolio filters immediately.
        </p>
      </div>

      {/* Add New Category Input */}
      <form onSubmit={handleAdd} className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 flex items-center gap-3">
        <Tags className="w-5 h-5 text-cyan-400 shrink-0" />
        <input
          type="text"
          placeholder="Enter new category name (e.g. 3D Packaging, Billboard)..."
          value={newCatName}
          onChange={(e) => setNewCatName(e.target.value)}
          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-cyan-500 outline-none"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-zinc-950 font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md active:scale-95"
        >
          + Add Category
        </button>
      </form>

      {/* Category List Table */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-zinc-950 text-zinc-400 font-bold uppercase tracking-wider border-b border-zinc-800">
            <tr>
              <th className="py-3 px-4">Order</th>
              <th className="py-3 px-4">Category Name</th>
              <th className="py-3 px-4">Slug</th>
              <th className="py-3 px-4 text-center">Projects Count</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {categories.map((cat, index) => {
              const projectCount = portfolio.filter(p => p.category.toLowerCase() === cat.name.toLowerCase()).length;
              const isEditing = editingId === cat.id;

              return (
                <tr key={cat.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="py-3 px-4 text-zinc-500 font-mono">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMove(index, 'up')}
                        disabled={index === 0}
                        className="p-1 rounded hover:bg-zinc-800 text-zinc-400 disabled:opacity-30"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleMove(index, 'down')}
                        disabled={index === categories.length - 1}
                        className="p-1 rounded hover:bg-zinc-800 text-zinc-400 disabled:opacity-30"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                      <span className="ml-1">#{index + 1}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-bold text-white">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="bg-zinc-950 border border-cyan-500 rounded px-2 py-1 text-xs text-white"
                        autoFocus
                      />
                    ) : (
                      <span>{cat.name}</span>
                    )}
                  </td>

                  <td className="py-3 px-4 font-mono text-zinc-500">
                    {cat.slug}
                  </td>

                  <td className="py-3 px-4 text-center font-bold text-cyan-400">
                    {projectCount}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {isEditing ? (
                        <button
                          onClick={() => handleSaveEdit(cat.id)}
                          className="p-1.5 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(cat.id, cat.name)}
                          className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (confirm(`Delete category "${cat.name}"?`)) {
                            deleteCategory(cat.id);
                          }
                        }}
                        className="p-1.5 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
