import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { BookingItem } from '../../types';
import { Calendar, CheckCircle2, Clock, Trash2, Mail, Phone, DollarSign, Sparkles, ExternalLink, Link as LinkIcon, Edit3, Save, X } from 'lucide-react';

export const BookingsManager: React.FC = () => {
  const { bookings, updateBooking, updateBookingStatus, deleteBooking } = usePortfolio();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<BookingItem>>({});

  const startEdit = (book: BookingItem) => {
    setEditingId(book.id);
    setEditForm(book);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = (id: string) => {
    if (!editForm.clientName || !editForm.serviceType) return;
    updateBooking(id, editForm);
    setEditingId(null);
    setEditForm({});
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Client Bookings Database</span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Design Consultation & Booking Requests
        </h2>
        <p className="text-xs text-zinc-400">
          Bookings submitted by clients on any device are stored centrally in Firebase Firestore. Edit details, change status, or manage records below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bookings.length > 0 ? (
          bookings.map((book) => {
            const isEditing = editingId === book.id;

            if (isEditing) {
              return (
                <div
                  key={book.id}
                  className="bg-zinc-900 border border-cyan-500/50 rounded-2xl p-5 space-y-3 shadow-xl"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-cyan-400 border-b border-zinc-800 pb-2">
                    <span>Editing Booking ({book.id})</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => saveEdit(book.id)}
                        className="text-emerald-400 hover:text-emerald-300 p-1"
                        title="Save Changes"
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

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-zinc-400 font-bold block mb-1">Client Name</label>
                      <input
                        type="text"
                        value={editForm.clientName || ''}
                        onChange={(e) => setEditForm({ ...editForm, clientName: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-400 font-bold block mb-1">Service Type</label>
                      <input
                        type="text"
                        value={editForm.serviceType || ''}
                        onChange={(e) => setEditForm({ ...editForm, serviceType: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-400 font-bold block mb-1">Email</label>
                      <input
                        type="email"
                        value={editForm.email || ''}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-400 font-bold block mb-1">Phone</label>
                      <input
                        type="text"
                        value={editForm.phone || ''}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-400 font-bold block mb-1">Budget</label>
                      <input
                        type="text"
                        value={editForm.budget || ''}
                        onChange={(e) => setEditForm({ ...editForm, budget: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-400 font-bold block mb-1">Target Date</label>
                      <input
                        type="text"
                        value={editForm.targetDate || ''}
                        onChange={(e) => setEditForm({ ...editForm, targetDate: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-400 font-bold block mb-1">Project Details</label>
                    <textarea
                      rows={2}
                      value={editForm.projectDetails || ''}
                      onChange={(e) => setEditForm({ ...editForm, projectDetails: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white outline-none resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-lg text-xs hover:bg-zinc-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => saveEdit(book.id)}
                      className="px-3 py-1 bg-cyan-500 text-zinc-950 font-bold rounded-lg text-xs hover:bg-cyan-400"
                    >
                      Save Booking
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={book.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-lg hover:border-cyan-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <div>
                      <h3 className="font-bold text-white text-base">{book.clientName}</h3>
                      <span className="text-[11px] text-cyan-400 font-semibold">{book.serviceType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={book.status}
                        onChange={(e) => updateBookingStatus(book.id, e.target.value as any)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border outline-none cursor-pointer ${
                          book.status === 'confirmed'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : book.status === 'completed'
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {book.referencedProjectTitle && (
                    <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 text-xs text-zinc-300">
                      <span className="text-[10px] uppercase font-bold text-zinc-500 block">Style Reference:</span>
                      <span className="text-cyan-300 font-medium">{book.referencedProjectTitle}</span>
                    </div>
                  )}

                  {book.designProofUrl && (
                    <div className="bg-cyan-950/40 border border-cyan-500/30 p-2.5 rounded-xl text-xs flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-cyan-300 font-medium overflow-hidden">
                        <LinkIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="text-[11px] font-bold text-zinc-300 shrink-0">Design Proof:</span>
                        <span className="text-[11px] text-cyan-300 truncate">{book.designProofUrl}</span>
                      </div>
                      <a
                        href={book.designProofUrl.startsWith('http') ? book.designProofUrl : `https://${book.designProofUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/40 hover:text-white transition-all shrink-0 border border-cyan-500/30"
                      >
                        <span>Open Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  <p className="text-xs text-zinc-300 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80 leading-relaxed">
                    "{book.projectDetails}"
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span className="truncate">{book.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span>{book.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-emerald-400 font-bold">{book.budget}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Target: {book.targetDate}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500">
                  <span>Submitted {book.createdAt}</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => startEdit(book)}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Delete this booking?')) deleteBooking(book.id);
                      }}
                      className="text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 py-12 text-center text-zinc-500 text-xs bg-zinc-900 rounded-2xl border border-zinc-800">
            No booking requests yet.
          </div>
        )}
      </div>
    </div>
  );
};
