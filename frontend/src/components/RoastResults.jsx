import React, { useState } from 'react';
import { Flame, Copy, Check, Share2, RefreshCw, AlertCircle, CheckCircle2, ArrowLeft, FileText, Lightbulb, Award } from 'lucide-react';

const ensureArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return [val];
    }
  }
  return [];
};

export default function RoastResults({ data, onReset }) {
  const [copiedShare, setCopiedShare] = useState(false);
  const [copiedRoast, setCopiedRoast] = useState(false);

  if (!data) return null;

  const title = data.title || 'Resume Roast and Review';
  const intensity = data.intensity || 'spicy';
  const displaySummary = data.summary || data.rewritten_summary || 'Overview of candidate skills, qualifications, and background.';
  const savage_roast = data.savage_roast || 'No roast commentary generated.';
  const one_liner = data.one_liner || '';
  
  const scoreValue = data.overall_score ?? data.overallScore ?? 50;
  const overallScore = typeof scoreValue === 'number' ? scoreValue : parseInt(scoreValue, 10) || 50;

  const rawFlaws = ensureArray(data.flaws);
  const rawRedFlags = ensureArray(data.red_flags);
  const rawImprovements = ensureArray(data.improvements);
  const rawTips = ensureArray(data.actionable_tips);
  const rawRewrites = ensureArray(data.bullet_rewrites);

  const flawList = rawFlaws.length > 0 
    ? rawFlaws 
    : rawRedFlags.map(r => typeof r === 'string' ? { title: r } : { title: r?.title || 'Identified Flaw', description: r?.description || r?.fix || '' });

  const improvementList = rawImprovements.length > 0
    ? rawImprovements
    : rawTips.length > 0
    ? rawTips
    : rawRewrites.map(b => typeof b === 'string' ? b : (b?.improved ? `${b.improved} (${b.rationale || ''})` : ''));

  const handleShare = () => {
    const url = window.location.origin + (data.id ? `?roastId=${data.id}` : '');
    navigator.clipboard.writeText(url);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleCopyRoast = () => {
    const fullText = `RESUME ROAST (${intensity.toUpperCase()} MODE)
Score: ${overallScore}/100

SUMMARY:
${displaySummary}

ROAST CRITIQUE:
${savage_roast}

KEY FLAWS:
${flawList.map((f, i) => `${i + 1}. ${f?.title || f}: ${f?.description || ''}`).join('\n')}

RECOMMENDED IMPROVEMENTS:
${improvementList.map((imp, i) => `${i + 1}. ${typeof imp === 'string' ? imp : (imp?.tip || imp?.improved || '')}`).join('\n')}`;

    navigator.clipboard.writeText(fullText);
    setCopiedRoast(true);
    setTimeout(() => setCopiedRoast(false), 2000);
  };

  const getScoreColor = (score) => {
    if (score < 40) return { text: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30', label: 'Severe Issues' };
    if (score < 70) return { text: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/30', label: 'Needs Improvement' };
    return { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30', label: 'Competitive' };
  };

  const scoreMeta = getScoreColor(overallScore);

  return (
    <div className="max-w-2xl mx-auto px-4 pb-16 space-y-6">
      
      {/* Top action header */}
      <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#131124] border border-slate-200 dark:border-white/10 shadow-sm transition-colors">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#1C1836] hover:bg-slate-200 dark:hover:bg-[#252047] transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Upload Another</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyRoast}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#18152E] hover:bg-slate-200 dark:hover:bg-[#221E3F] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all"
          >
            {copiedRoast ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-orange-500" />}
            <span>{copiedRoast ? 'Copied' : 'Copy Report'}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-500/10 hover:bg-orange-100 dark:hover:bg-orange-500/20 border border-orange-200 dark:border-orange-500/30 text-xs font-semibold text-orange-600 dark:text-orange-400 transition-all"
          >
            {copiedShare ? <Check className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" /> : <Share2 className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />}
            <span>{copiedShare ? 'Link Copied' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* 1. Score & Overview Header Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#131124] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">{title}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-slate-500 dark:text-slate-400">Intensity: <strong className="text-orange-600 dark:text-orange-400 uppercase">{intensity}</strong></span>
            </div>
          </div>
        </div>

        {/* Score Pill */}
        <div className={`px-4 py-2 rounded-xl border flex items-center gap-2.5 ${scoreMeta.bg}`}>
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Resume Score</div>
            <div className={`text-base font-black ${scoreMeta.text}`}>{overallScore} / 100</div>
          </div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">{scoreMeta.label}</span>
        </div>
      </div>

      {/* 2. Candidate Resume Summary */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#131124] border border-slate-200 dark:border-white/10 shadow-sm space-y-2 transition-colors">
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 uppercase tracking-wider">
          <FileText className="w-4 h-4 text-orange-500" />
          <span>Resume Summary</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-[#0B0914] p-3.5 rounded-xl border border-slate-200 dark:border-white/5 font-normal">
          {displaySummary}
        </p>
      </div>

      {/* 3. The Brutal Savage Roast */}
      <div className="relative p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-orange-50/70 via-red-50/50 to-amber-50/30 dark:from-[#1C1126] dark:via-[#151026] dark:to-[#0E0C1C] border border-orange-200 dark:border-red-500/30 shadow-md dark:shadow-2xl overflow-hidden fire-border-glow transition-colors">
        <div className="flex items-center gap-1.5 text-orange-700 dark:text-red-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Flame className="w-4 h-4 text-orange-500" />
          <span>The Brutal Roast</span>
        </div>

        {one_liner && (
          <div className="p-3 rounded-xl bg-white/90 dark:bg-[#0B0914]/80 border border-orange-200 dark:border-red-500/20 mb-4 text-xs sm:text-sm font-bold text-orange-800 dark:text-orange-300 italic shadow-sm">
            "{one_liner}"
          </div>
        )}

        <div className="text-slate-800 dark:text-slate-100 text-xs sm:text-sm leading-relaxed whitespace-pre-line border-l-2 border-orange-500/60 pl-4 space-y-3 font-normal">
          {savage_roast}
        </div>
      </div>

      {/* 4. Identified Flaws */}
      {flawList && flawList.length > 0 && (
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#131124] border border-slate-200 dark:border-white/10 shadow-sm space-y-3 transition-colors">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 uppercase tracking-wider">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span>Key Flaws Detected ({flawList.length})</span>
          </h3>

          <div className="grid grid-cols-1 gap-2.5">
            {flawList.map((flaw, idx) => {
              const titleText = flaw?.title || (typeof flaw === 'string' ? flaw : `Flaw ${idx + 1}`);
              const descText = flaw?.description || '';
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0914] border border-red-200 dark:border-red-500/20 text-xs space-y-1"
                >
                  <div className="font-bold text-red-700 dark:text-red-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    {titleText}
                  </div>
                  {descText && (
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed pl-3">
                      {descText}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Useful Improvements */}
      {improvementList && improvementList.length > 0 && (
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#131124] border border-slate-200 dark:border-white/10 shadow-sm space-y-3 transition-colors">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 uppercase tracking-wider">
            <Lightbulb className="w-4 h-4 text-emerald-500" />
            <span>Recommended Improvements ({improvementList.length})</span>
          </h3>

          <div className="grid grid-cols-1 gap-2.5">
            {improvementList.map((imp, idx) => {
              const text = typeof imp === 'string' ? imp : (imp?.tip || imp?.improved || JSON.stringify(imp));
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0914] border border-emerald-200 dark:border-emerald-500/20 text-xs flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700 dark:text-emerald-100 leading-relaxed">{text}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Try Again Button */}
      <div className="text-center pt-2">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg shadow-orange-500/25 transition-all hover:scale-105"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Roast Another Resume</span>
        </button>
      </div>

    </div>
  );
}
