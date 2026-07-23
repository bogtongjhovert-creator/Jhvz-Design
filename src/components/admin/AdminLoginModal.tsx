import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ShieldCheck, Lock, Eye, EyeOff, ArrowLeft, KeyRound, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const { loginAdmin, setViewMode } = usePortfolio();
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setErrorMsg('Please enter your admin password.');
      return;
    }

    const success = loginAdmin(passwordInput);
    if (!success) {
      setErrorMsg('Incorrect admin password. Access denied.');
      setPasswordInput('');
    } else {
      setErrorMsg('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
      <div className="glass-modal rounded-3xl max-w-md w-full p-8 shadow-2xl relative text-white space-y-6 my-auto">
        
        {/* Header Icon */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl glass-panel border border-indigo-500/40 p-0.5 mx-auto flex items-center justify-center text-indigo-400 shadow-xl shadow-indigo-500/20">
            <ShieldCheck className="w-8 h-8 text-indigo-400" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill text-[10px] font-bold text-indigo-300 uppercase tracking-wider mb-2 border border-indigo-500/30">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>Restricted Access</span>
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">
              Admin CMS Login
            </h3>
            <p className="text-xs text-white/60 mt-1 font-light leading-relaxed">
              Enter your master password to manage designs, bookings, categories, and content.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 text-xs text-rose-300 flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1.5">
              Admin Master Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter password..."
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                className="w-full glass-input text-xs text-white placeholder-white/30 rounded-xl pl-10 pr-10 py-3 border border-white/10 focus:border-indigo-500/80 outline-none transition-all"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs py-3.5 rounded-xl shadow-xl shadow-indigo-500/30 border border-indigo-400/40 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>Sign In to Admin CMS</span>
          </button>
        </form>

        {/* Quick Password Tip Box */}
        <div className="glass-panel rounded-2xl p-3.5 text-xs text-white/60 space-y-1 text-center border border-white/10">
          <p className="font-semibold text-white/80">🔑 Master Access Password</p>
          <p className="text-[11px] font-mono text-indigo-300 bg-indigo-500/10 py-1 px-2.5 rounded-lg border border-indigo-500/20 inline-block my-1">
            admin123
          </p>
          <p className="text-[10px] text-white/40">
            (You can update this password inside Admin CMS &gt; Settings)
          </p>
        </div>

        {/* Back to Website */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => setViewMode('public')}
            className="inline-flex items-center gap-2 text-xs text-white/60 hover:text-white font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Website</span>
          </button>
        </div>

      </div>
    </div>
  );
};
