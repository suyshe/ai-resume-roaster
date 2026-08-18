import React, { useState } from 'react';
import { Copy, Check, Sparkles, ArrowRight, Lightbulb, FileText } from 'lucide-react';

export default function ImprovementsSection({ bulletRewrites = [], actionableTips = [], rewrittenSummary = '' }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    if (index === 'summary') {
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    } else {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Before vs After Bullet Transformations */}
      {bulletRewrites && bulletRewrites.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-400" />
              <span>Google XYZ Bullet Transformations</span>
            </h3>
            <span className="text-xs text-slate-400">Accomplished [X] by doing [Y] measured by [Z]</span>
          </div>

          <div className="space-y-4">
            {bulletRewrites.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#131124] border border-white/10 shadow-lg space-y-3"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  
                  {/* Original / Weak version */}
                  <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/20 text-xs">
                    <div className="flex items-center gap-1.5 text-red-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      Before (Weak / Vague)
                    </div>
                    <p className="text-slate-300 italic font-mono leading-relaxed">
                      "{item.original}"
                    </p>
                  </div>

                  {/* Improved / Strong version */}
                  <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs relative group">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        After (High Impact)
                      </div>
                      <button
                        onClick={() => handleCopy(item.improved, idx)}
                        className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold transition-all"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-emerald-400" />
                            <span>Copy Bullet</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-emerald-200 font-medium leading-relaxed">
                      {item.improved}
                    </p>
                  </div>

                </div>

                {/* Rationale explanation */}
                {item.rationale && (
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1 border-t border-white/5">
                    <ArrowRight className="w-3 h-3 text-orange-400 shrink-0" />
                    <span><strong className="text-slate-300">Why this works: </strong>{item.rationale}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. AI Rewritten Executive Summary */}
      {rewrittenSummary && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#131124] to-[#1C1836] border border-orange-500/20 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-2xl pointer-events-none rounded-full" />
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-400" />
              <h3 className="text-base font-bold text-white">Polished Professional Summary</h3>
            </div>
            <button
              onClick={() => handleCopy(rewrittenSummary, 'summary')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-semibold transition-all"
            >
              {copiedSummary ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied Summary!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Summary</span>
                </>
              )}
            </button>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed font-normal bg-[#0B0914]/60 p-4 rounded-xl border border-white/5">
            {rewrittenSummary}
          </p>
        </div>
      )}

      {/* 3. Actionable Priority Tips */}
      {actionableTips && actionableTips.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Priority Action Steps</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {actionableTips.map((tip, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#131124] border border-white/5 flex items-start gap-3"
              >
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
