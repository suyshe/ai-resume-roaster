import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

export default function RedFlagsList({ redFlags = [] }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const getSeverityBadge = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return {
          icon: <AlertCircle className="w-4 h-4 text-red-400" />,
          label: 'Critical Dealbreaker',
          classes: 'bg-red-500/10 text-red-400 border-red-500/30'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
          label: 'Severe Flaw',
          classes: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
        };
      default:
        return {
          icon: <Info className="w-4 h-4 text-sky-400" />,
          label: 'Moderate Opportunity',
          classes: 'bg-sky-500/10 text-sky-400 border-sky-500/30'
        };
    }
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  if (!redFlags || redFlags.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="text-red-500">🚩</span> Identified Red Flags & Resume Sins
        </h3>
        <span className="text-xs text-slate-400">{redFlags.length} Flaws Diagnosed</span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {redFlags.map((flag, idx) => {
          const badge = getSeverityBadge(flag.severity);
          const isExpanded = expandedIndex === idx || expandedIndex === null; // Expanded by default or toggled

          return (
            <div
              key={idx}
              className="rounded-xl bg-[#131124] border border-white/5 hover:border-white/15 transition-all overflow-hidden"
            >
              {/* Header row */}
              <div
                onClick={() => toggleExpand(idx)}
                className="p-4 flex items-start justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{badge.icon}</div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-100">{flag.title}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.classes}`}>
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{flag.description}</p>
                  </div>
                </div>

                <button className="text-slate-400 hover:text-white p-1">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Fix recommendation */}
              {isExpanded && flag.fix && (
                <div className="px-4 pb-4 pt-1 bg-[#18152E]/60 border-t border-white/5">
                  <div className="flex items-start gap-2 text-xs text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-emerald-400 shrink-0" />
                    <div>
                      <strong className="text-emerald-400">Prescription: </strong>
                      <span>{flag.fix}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
