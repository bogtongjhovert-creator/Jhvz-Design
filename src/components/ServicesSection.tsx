import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Palette, Layout, Video, Globe, CheckCircle2, ArrowRight } from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const { services, openBookingModalWithProject } = usePortfolio();

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Palette': return <Palette className="w-6 h-6 text-indigo-400" />;
      case 'Layout': return <Layout className="w-6 h-6 text-indigo-300" />;
      case 'Video': return <Video className="w-6 h-6 text-indigo-400" />;
      case 'Globe': return <Globe className="w-6 h-6 text-indigo-300" />;
      default: return <Palette className="w-6 h-6 text-indigo-400" />;
    }
  };

  return (
    <section id="services-section" className="py-20 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
            Design Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Our Core Creative Services
          </h2>
          <p className="text-sm text-white/60 font-light">
            From brand identity and printed marketing materials to motion graphics and web UI/UX.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl glass-pill flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                  {getServiceIcon(srv.iconName)}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-white/60 mt-2 leading-relaxed font-light">
                    {srv.description}
                  </p>
                </div>

                <div className="pt-2">
                  <span className="text-xs font-semibold text-indigo-300 glass-pill border border-indigo-500/30 px-2.5 py-1 rounded-lg inline-block">
                    {srv.priceRange}
                  </span>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/10">
                  <p className="text-[11px] font-bold text-white/40 uppercase tracking-wider">
                    Deliverables:
                  </p>
                  <ul className="space-y-1.5 text-xs text-white/80">
                    {srv.deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => openBookingModalWithProject()}
                  className="w-full glass-panel hover:bg-indigo-600 hover:border-indigo-500 hover:text-white text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 group/btn"
                >
                  <span>Book This Service</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
