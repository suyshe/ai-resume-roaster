import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Flame,
  History,
  Sun,
  Moon,
  RefreshCw,
  Info,
  MessageSquare
} from 'lucide-react';

export default function Navbar({
  onOpenHistory,
  onReset,
  hasResults,
  theme,
  onToggleTheme
}) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-[#0B0914]/80 backdrop-blur-md transition-colors">

      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Brand Logo */}
        <Link
          to="/"
          onClick={onReset}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5 text-white" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                Resume<span className="text-orange-500">Roast</span>
              </span>

              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                AI
              </span>
            </div>
          </div>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* About */}
          <Link
            to="/about"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#18152E] text-xs font-medium text-slate-700 dark:text-slate-200 transition-all"
          >
            <Info className="w-3.5 h-3.5 text-orange-500" />
            <span>About</span>
          </Link>

          {/* Feedback */}
          <Link
            to="/feedback"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#18152E] text-xs font-medium text-slate-700 dark:text-slate-200 transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5 text-orange-500" />
            <span>Feedback</span>
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#18152E] dark:hover:bg-[#201C3D] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 transition-all shadow-sm"
            title={
              theme === 'dark'
                ? 'Switch to Light Theme'
                : 'Switch to Dark Theme'
            }
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* History */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#18152E] dark:hover:bg-[#201C3D] border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-slate-200 transition-all shadow-sm"
          >
            <History className="w-3.5 h-3.5 text-orange-500" />
            <span className="hidden sm:inline">History</span>
          </button>

          {/* Roast Another */}
          {hasResults && (
  <button
    onClick={() => {
      onReset();
      navigate('/');
    }}
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-xs font-semibold shadow-md shadow-orange-500/25 transition-all hover:scale-[1.02]"
  >
    <RefreshCw className="w-3.5 h-3.5" />
    <span className="hidden sm:inline">Roast Another</span>
  </button>
)}

        </div>
      </div>
    </header>
  );
}