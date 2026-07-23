import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Calendar, CheckCircle2, Clock, Trash2, Mail, Phone, DollarSign, Sparkles } from 'lucide-react';

export const BookingsManager: React.FC = () => {
  const { bookings, updateBookingStatus, deleteBooking } = usePortfolio();

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Client Bookings CMS</span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Design Booking Requests
        </h2>
        <p className="text-xs text-zinc-400">
          Review, approve, or fulfill design project requests submitted by visitors on the public website.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bookings.length > 0 ? (
          bookings.map((book) => (
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
                  <select
                    value={book.status}
                    onChange={(e) => updateBookingStatus(book.id, e.target.value as any)}
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg border outline-none ${
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

                {book.referencedProjectTitle && (
                  <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 text-xs text-zinc-300">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 block">Style Reference:</span>
                    <span className="text-cyan-300 font-medium">{book.referencedProjectTitle}</span>
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
          ))
        ) : (
          <div className="col-span-2 py-12 text-center text-zinc-500 text-xs bg-zinc-900 rounded-2xl border border-zinc-800">
            No booking requests yet.
          </div>
        )}
      </div>
    </div>
  );
};
