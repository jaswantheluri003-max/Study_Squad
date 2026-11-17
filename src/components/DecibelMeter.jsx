import React from 'react';
import { Volume2, Volume1, VolumeX } from 'lucide-react';

export const DecibelMeter = ({ db = 40, level = 'Moderate Study', compact = false }) => {
  // Normalize dB between 30 and 85 to percentage
  const percentage = Math.min(100, Math.max(10, ((db - 28) / (85 - 28)) * 100));

  let colorClass = 'text-emerald-500 bg-emerald-500';
  let badgeBg = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
  let icon = <Volume1 className="w-3.5 h-3.5" />;

  if (db < 40) {
    colorClass = 'text-emerald-400 bg-emerald-500';
    badgeBg = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    icon = <VolumeX className="w-3.5 h-3.5" />;
  } else if (db <= 55) {
    colorClass = 'text-blue-500 bg-blue-500';
    badgeBg = 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    icon = <Volume1 className="w-3.5 h-3.5" />;
  } else {
    colorClass = 'text-amber-500 bg-amber-500';
    badgeBg = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    icon = <Volume2 className="w-3.5 h-3.5" />;
  }

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium ${badgeBg}`}>
        {icon}
        <span className="font-mono font-bold">{db} dB</span>
        <span className="text-[10px] opacity-80">({level})</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
          {icon}
          <span>Noise Telemetry</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-mono font-bold text-slate-800 dark:text-slate-100">{db} dB</span>
          <span className={`text-[11px] px-1.5 py-0.5 rounded border ${badgeBg}`}>
            {level}
          </span>
        </div>
      </div>

      {/* Visual meter bar with simulated sound wave tiers */}
      <div className="w-full bg-slate-200 dark:bg-slate-700/60 rounded-full h-2 overflow-hidden flex">
        <div
          className={`h-full transition-all duration-700 ease-out ${
            db < 40 ? 'bg-emerald-500' : db <= 55 ? 'bg-blue-500' : 'bg-amber-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
        <span>30 dB (Whisper)</span>
        <span>50 dB (Normal)</span>
        <span>70 dB (Discussion)</span>
      </div>
    </div>
  );
};
