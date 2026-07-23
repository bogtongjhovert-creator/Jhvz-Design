import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Mail, Phone, MapPin, Send, CheckCircle2, ExternalLink } from 'lucide-react';
import { sendEmailNotification } from '../utils/emailNotifier';

export const ContactSection: React.FC = () => {
  const { websiteContent, addMessage } = usePortfolio();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    content: ''
  });

  const [sent, setSent] = useState(false);
  const [lastMailtoUrl, setLastMailtoUrl] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.content) return;

    addMessage({
      name: formData.name,
      email: formData.email,
      subject: formData.subject || 'General Inquiry',
      content: formData.content
    });

    const result = await sendEmailNotification({
      type: 'Message',
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      details: formData.content
    });

    setLastMailtoUrl(result.mailtoUrl);
    setSent(true);

    setTimeout(() => {
      setSent(false);
      setFormData({ name: '', email: '', subject: '', content: '' });
    }, 6000);
  };

  return (
    <section id="contact-section" className="py-20 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                Get In Touch
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight mt-1">
                Let's Build Something Exceptional Together
              </h2>
              <p className="text-xs text-white/60 mt-2 leading-relaxed font-light">
                Have a new brand launch, poster design project, or custom video request? Send us a direct message.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10 text-xs text-white/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl glass-pill flex items-center justify-center text-indigo-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-white/40 block uppercase font-bold">Email Us</span>
                  <a href={`mailto:${websiteContent.contactEmail}`} className="font-semibold text-white hover:text-indigo-300 transition-colors">
                    {websiteContent.contactEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl glass-pill flex items-center justify-center text-indigo-300 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-white/40 block uppercase font-bold">Call / WhatsApp</span>
                  <span className="font-semibold text-white">{websiteContent.contactPhone}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl glass-pill flex items-center justify-center text-indigo-400 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-white/40 block uppercase font-bold">Studio Location</span>
                  <span className="font-semibold text-white">{websiteContent.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Message Form (7 cols) */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-white/12 shadow-xl">
            {sent ? (
              <div className="py-12 text-center space-y-4 animate-scaleUp">
                <CheckCircle2 className="w-12 h-12 text-indigo-400 mx-auto" />
                <h4 className="text-xl font-bold text-white">Message Sent Successfully!</h4>
                <p className="text-xs text-white/70 max-w-md mx-auto leading-relaxed font-light">
                  Thank you! An automated email notification has been dispatched to <strong className="text-indigo-300">jhovzdesign@gmail.com</strong>.
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
                      <span>Open Pre-filled Email in App</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <h3 className="text-lg font-bold text-white mb-2">Send a Message</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/60 font-semibold mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full glass-input rounded-xl px-3.5 py-2.5 text-white placeholder-white/30 focus:border-indigo-500/80 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 font-semibold mb-1">Your Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full glass-input rounded-xl px-3.5 py-2.5 text-white placeholder-white/30 focus:border-indigo-500/80 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/60 font-semibold mb-1">Subject</label>
                  <input
                    type="text"
                    placeholder="e.g. Brand Identity Inquiry"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-white placeholder-white/30 focus:border-indigo-500/80 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/60 font-semibold mb-1">Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your project or inquiry..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-white placeholder-white/30 focus:border-indigo-500/80 outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-indigo-500/30 border border-indigo-400/40 flex items-center gap-2 transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
