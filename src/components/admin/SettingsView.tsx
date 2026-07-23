import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Settings, Download, RotateCcw, Check, Sparkles, KeyRound, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { portfolio, categories, resetAllData, adminPassword, changeAdminPassword } = usePortfolio();

  const [resetSuccess, setResetSuccess] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [passSaved, setPassSaved] = useState(false);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ portfolio, categories }));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `jhvz_portfolio_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all portfolio data back to initial seed defaults? Custom projects will be cleared.")) {
      resetAllData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 2000);
    }
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.trim()) {
      changeAdminPassword(newPassword.trim());
      setPassSaved(true);
      setNewPassword('');
      setTimeout(() => setPassSaved(false), 3000);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl text-xs">
      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>System Settings</span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          System & Security Settings
        </h2>
        <p className="text-xs text-zinc-400">
          Manage admin password security, export full CMS database, or restore defaults.
        </p>
      </div>

      {/* Admin Password Management */}
      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-4">
        <div className="flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-indigo-400" />
          <h3 className="font-bold text-white text-sm">Admin Password Protection</h3>
        </div>
        <p className="text-zinc-400 leading-relaxed">
          Update the password required to access the Admin CMS when navigating to <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-indigo-300 font-mono">/admin</code>.
        </p>

        <form onSubmit={handlePasswordUpdate} className="space-y-3 max-w-md">
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-zinc-400">Current Active Password:</label>
            <div className="text-xs font-mono font-bold text-indigo-300 bg-zinc-800/80 px-3 py-2 rounded-xl border border-zinc-700/60 inline-block">
              {adminPassword}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-zinc-400">Set New Password:</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Enter new admin password..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-zinc-800 text-white placeholder-zinc-500 rounded-xl px-3.5 py-2.5 border border-zinc-700 focus:border-indigo-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!newPassword.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-indigo-500/20"
          >
            {passSaved ? <Check className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
            <span>{passSaved ? 'Password Updated Successfully!' : 'Update Admin Password'}</span>
          </button>
        </form>
      </div>

      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-4">
        <h3 className="font-bold text-white text-sm">Export Data Backup</h3>
        <p className="text-zinc-400 leading-relaxed">
          Download a complete JSON file containing all uploaded portfolio items, categories, and settings.
        </p>
        <button
          onClick={handleExport}
          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all"
        >
          <Download className="w-4 h-4 text-indigo-400" />
          <span>Export Portfolio Database (.json)</span>
        </button>
      </div>

      <div className="bg-zinc-900 p-6 rounded-2xl border border-rose-900/50 space-y-4">
        <h3 className="font-bold text-rose-400 text-sm">Reset Sample Seed Data</h3>
        <p className="text-zinc-400 leading-relaxed">
          Reset all categories, portfolio projects, bookings, and messages back to initial JHVZ DESIGN seed data.
        </p>
        <button
          onClick={handleReset}
          className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all"
        >
          {resetSuccess ? <Check className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />}
          <span>{resetSuccess ? 'Data Reset Complete!' : 'Restore Seed Defaults'}</span>
        </button>
      </div>
    </div>
  );
};
