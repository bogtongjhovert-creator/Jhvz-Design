import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Star, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { testimonials } = usePortfolio();

  return (
    <section className="py-20 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
            Client Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            What Clients Say About JHVZ DESIGN
          </h2>
          <p className="text-sm text-white/60 font-light">
            Real feedback from founders, event organizers, and creative directors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="glass-panel glass-panel-hover rounded-2xl p-6 relative flex flex-col justify-between space-y-6"
            >
              <Quote className="w-8 h-8 text-white/10 absolute top-4 right-4 pointer-events-none" />

              <div className="space-y-4">
                <div className="flex items-center gap-1 text-indigo-300">
                  {Array.from({ length: test.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-white/80 italic leading-relaxed font-light">
                  "{test.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <img
                  src={test.avatar}
                  alt={test.clientName}
                  className="w-10 h-10 rounded-full object-cover border border-indigo-400/50"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{test.clientName}</h4>
                  <p className="text-[11px] text-white/50">
                    {test.role}, <span className="text-indigo-300">{test.company}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
