import React from 'react';
import { Award, AlertTriangle, Flame, CheckCircle2 } from 'lucide-react';

export default function ScoreGauge({ overallScore = 45, buzzwordScore = 75, designScore = 55, credibilityScore = 60 }) {
  
  // Calculate circular stroke
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  // Determine score colors
  const getScoreColor = (score) => {
    if (score < 40) return { stroke: '#EF4444', text: 'text-red-500', bg: 'bg-red-500/10', label: '💀 Straight to Trash' };
    if (score < 70) return { stroke: '#F97316', text: 'text-orange-500', bg: 'bg-orange-500/10', label: '🔥 Needs Heavy Life Support' };
    return { stroke: '#10B981', text: 'text-emerald-500', bg: 'bg-emerald-500/10', label: '✨ Actually Interview-Worthy' };
  };

  const overallDetails = getScoreColor(overallScore);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#131124] border border-white/10 shadow-xl">
      
      {/* Overall Radial Meter */}
      <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#0E0C1C] border border-white/5 md:col-span-1 text-center">
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
            {/* Background circle */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="#242040"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Animated progress circle */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke={overallDetails.stroke}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-black ${overallDetails.text}`}>{overallScore}</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">out of 100</span>
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xs font-bold text-slate-200">Hireability Score</div>
          <div className={`mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${overallDetails.bg} ${overallDetails.text}`}>
            {overallDetails.label}
          </div>
        </div>
      </div>

      {/* Sub-Metrics Breakdown */}
      <div className="md:col-span-3 flex flex-col justify-center space-y-4">
        
        {/* Metric 1: Buzzword Density */}
        <div className="p-3.5 rounded-xl bg-[#18152E] border border-white/5">
          <div className="flex justify-between items-center mb-1.5">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-400" />
              <span className="text-sm font-bold text-slate-200">Buzzword Bullshit Index</span>
            </div>
            <span className="text-xs font-mono font-bold text-red-400">{buzzwordScore}%</span>
          </div>
          <div className="w-full bg-[#0E0C1C] rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-orange-500 to-red-600 h-full rounded-full transition-all duration-1000"
              style={{ width: `${buzzwordScore}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
            <span>Clean & Direct</span>
            <span>{buzzwordScore > 65 ? '⚠️ Warning: Extreme Corporate Jargon' : 'Acceptable'}</span>
            <span>Unreadable Fluff</span>
          </div>
        </div>

        {/* Metric 2: ATS & Readability Score */}
        <div className="p-3.5 rounded-xl bg-[#18152E] border border-white/5">
          <div className="flex justify-between items-center mb-1.5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-bold text-slate-200">ATS & Readability Rating</span>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400">{designScore}%</span>
          </div>
          <div className="w-full bg-[#0E0C1C] rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-1000"
              style={{ width: `${designScore}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
            <span>ATS Nightmare</span>
            <span>{designScore < 50 ? '⚠️ Parsing Risks Detected' : 'Readable'}</span>
            <span>Robot-Friendly</span>
          </div>
        </div>

        {/* Metric 3: Experience Credibility */}
        <div className="p-3.5 rounded-xl bg-[#18152E] border border-white/5">
          <div className="flex justify-between items-center mb-1.5">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-bold text-slate-200">Claim Credibility & Depth</span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">{credibilityScore}%</span>
          </div>
          <div className="w-full bg-[#0E0C1C] rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-600 to-teal-400 h-full rounded-full transition-all duration-1000"
              style={{ width: `${credibilityScore}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
            <span>Tutorial Fluff</span>
            <span>{credibilityScore > 60 ? 'Solid Evidence' : 'Needs Numbers'}</span>
            <span>Verified Impact</span>
          </div>
        </div>

      </div>

    </div>
  );
}
