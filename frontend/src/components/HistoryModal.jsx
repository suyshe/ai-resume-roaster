import React, { useState, useEffect } from 'react';
import { X, History, Flame, ArrowRight, Loader2, Calendar } from 'lucide-react';
import { api } from '../services/api';

export default function HistoryModal({ isOpen, onClose, onSelectRoast }) {
  const [roasts, setRoasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getRoasts(20);
      setRoasts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load roast history');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[85vh] rounded-3xl bg-white dark:bg-[#131124] border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden transition-colors">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Roast History</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Past resumes roasted and saved</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 dark:bg-[#1C1836] hover:bg-slate-200 dark:hover:bg-[#28234D] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
              <p className="text-xs">Fetching roast records...</p>
            </div>
          ) : error ? (
            <div className="py-8 text-center text-red-500 text-xs">
              <p>{error}</p>
            </div>
          ) : roasts.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Flame className="w-8 h-8 mx-auto text-orange-500/40" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No resumes roasted yet</p>
              <p className="text-xs text-slate-500">Roast your first resume to see it archived here.</p>
            </div>
          ) : (
            roasts.map((r) => (
              <div
                key={r.id}
                onClick={() => {
                  onSelectRoast(r);
                  onClose();
                }}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0E0C1C] border border-slate-200 dark:border-white/5 hover:border-orange-500/40 hover:bg-orange-50/50 dark:hover:bg-[#18152E] cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="space-y-1 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      {r.title || 'Candidate Resume'}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                      {r.intensity}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 italic">
                    "{r.one_liner || r.savage_roast?.substring(0, 80)}..."
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {new Date(r.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Score badge & arrow */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-center px-3 py-1.5 rounded-xl bg-white dark:bg-[#131124] border border-slate-200 dark:border-white/5 shadow-sm">
                    <div className="text-xs font-black text-orange-600 dark:text-orange-400">{r.overall_score || 50}/100</div>
                    <div className="text-[9px] uppercase tracking-wider text-slate-500">Score</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0E0C1C] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-[#1C1836] hover:bg-slate-300 dark:hover:bg-[#252047] text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
