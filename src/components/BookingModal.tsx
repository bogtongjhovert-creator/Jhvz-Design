import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { X, Calendar, DollarSign, Send, Sparkles, CheckCircle2, Mail, ExternalLink } from 'lucide-react';
import { sendEmailNotification } from '../utils/emailNotifier';

export const BookingModal: React.FC = () => {
  const {
    isBookingModalOpen,
    closeBookingModal,
    selectedProjectForBooking,
    addBooking,
    services
  } = usePortfolio();

  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    phone: '',
    serviceType: services[0]?.title || 'Brand Identity & Logo Design',
    budget: '$250 - $500',
    targetDate: '',
    projectDetails: ''
  });

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [lastMailtoUrl, setLastMailtoUrl] = useState<string>('');

  if (!isBookingModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.email) return;

    addBooking({
      clientName: formData.clientName,
      email: formData.email,
      phone: formData.phone,
      serviceType: formData.serviceType,
      projectDetails: formData.projectDetails,
      budget: formData.budget,
      targetDate: formData.targetDate || new Date().toISOString().split('T')[0],
      referencedProjectId: selectedProjectForBooking?.id,
      referencedProjectTitle: selectedProjectForBooking?.title
    });

    const result = await sendEmailNotification({
      type: 'Booking',
      name: formData.clientName,
      email: formData.email,
      phone: formData.phone,
      serviceType: formData.serviceType,
      budget: formData.budget,
      targetDate: formData.targetDate,
      details: formData.projectDetails || 'Custom design booking request'
    });

    setLastMailtoUrl(result.mailtoUrl);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      closeBookingModal();
      setFormData({
        clientName: '',
        email: '',
        phone: '',
        serviceType: services[0]?.title || 'Brand Identity & Logo Design',
        budget: '$250 - $500',
        targetDate: '',
        projectDetails: ''
      });
    }, 5000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="glass-modal rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-white">
        
        {/* Close Button */}
        <button
          onClick={closeBookingModal}
          className="absolute top-5 right-5 p-2 rounded-xl glass-pill text-white/70 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-12 text-center space-y-4 animate-scaleUp">
            <div className="w-16 h-16 rounded-2xl glass-pill text-indigo-400 border border-indigo-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white">Booking Request Received!</h3>
            <p className="text-xs text-white/70 max-w-sm mx-auto leading-relaxed font-light">
              Thank you! An email notification has been dispatched to <strong className="text-indigo-300">jhovzdesign@gmail.com</strong>.
            </p>
            {lastMailtoUrl && (
              <div className="pt-2">
                <a
                  href={lastMailtoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 glass-panel glass-panel-hover text-indigo-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border border-indigo-500/30"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send via Email App</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Design Booking Form</span>
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight">
                Request a Custom Design
              </h3>
              <p className="text-xs text-white/60 mt-1 font-light">
                Fill in your details below to schedule your project with JHVZ DESIGN.
              </p>
            </div>

            {/* Referenced Project Badge */}
            {selectedProjectForBooking && (
              <div className="glass-panel border-indigo-500/30 rounded-xl p-3 text-xs text-indigo-300 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-400 block">Reference Style:</span>
                  <span className="font-semibold text-white">{selectedProjectForBooking.title}</span>
                </div>
                <span className="text-[10px] glass-pill px-2 py-0.5 rounded font-mono text-indigo-300">
                  {selectedProjectForBooking.category}
                </span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-white/60 font-semibold mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Mercer"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full glass-input rounded-xl px-3.5 py-2.5 text-white placeholder-white/30 focus:border-indigo-500/80 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/60 font-semibold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="alex@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-white placeholder-white/30 focus:border-indigo-500/80 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/60 font-semibold mb-1">Phone / Telegram</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-white placeholder-white/30 focus:border-indigo-500/80 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/60 font-semibold mb-1">Service Required</label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-white focus:border-indigo-500/80 outline-none"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.title} className="bg-slate-900 text-white">{s.title}</option>
                    ))}
                    <option value="Custom Project" className="bg-slate-900 text-white">Custom Design Project</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/60 font-semibold mb-1">Budget Range</label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-white focus:border-indigo-500/80 outline-none"
                  >
                    <option value="$50 - $250" className="bg-slate-900 text-white">$50 - $250 (Quick Tasks)</option>
                    <option value="$250 - $500" className="bg-slate-900 text-white">$250 - $500 (Standard Branding)</option>
                    <option value="$500 - $1000" className="bg-slate-900 text-white">$500 - $1,000 (Complete Suite)</option>
                    <option value="$1000+" className="bg-slate-900 text-white">$1,000+ (Enterprise / Full Campaign)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/60 font-semibold mb-1">Target Delivery Date</label>
                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  className="w-full glass-input rounded-xl px-3.5 py-2.5 text-white focus:border-indigo-500/80 outline-none"
                />
              </div>

              <div>
                <label className="block text-white/60 font-semibold mb-1">Project Requirements / Ideas</label>
                <textarea
                  rows={3}
                  placeholder="Describe your brand, color preferences, deliverables needed, or specific timeline..."
                  value={formData.projectDetails}
                  onChange={(e) => setFormData({ ...formData, projectDetails: e.target.value })}
                  className="w-full glass-input rounded-xl px-3.5 py-2.5 text-white placeholder-white/30 focus:border-indigo-500/80 outline-none resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm py-3 rounded-xl shadow-xl shadow-indigo-500/30 border border-indigo-400/40 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Submit Booking Request</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
