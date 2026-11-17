import React from 'react';
import { useRoomRadar } from '../context/RoomRadarContext';
import { Clock, CheckCircle2, X, AlertCircle } from 'lucide-react';

export const HoldCountdownBadge = ({ compact = false }) => {
  const { activeHold, handleConfirmArrival, handleCancelHold } = useRoomRadar();

  if (!activeHold) return null;

  const minutes = Math.floor(activeHold.remainingSeconds / 60);
  const seconds = activeHold.remainingSeconds % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const isUrgent = activeHold.remainingSeconds < 300; // less than 5 mins

  if (activeHold.confirmed) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>Desk Checked-in ({activeHold.roomName})</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
        isUrgent
          ? 'bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 animate-pulse'
          : 'bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400'
      }`}>
        <Clock className="w-3.5 h-3.5 animate-spin-slow" />
        <span>Hold: {formattedTime}</span>
        <button
          onClick={handleConfirmArrival}
          className="ml-1 px-1.5 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold"
          title="Confirm Arrival at Room"
        >
          Check In
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border backdrop-blur-md transition-all shadow-sm ${
      isUrgent
        ? 'bg-rose-50/90 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-900 dark:text-rose-200'
        : 'bg-amber-50/90 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isUrgent ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400' : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'}`}>
          <Clock className="w-5 h-5 animate-spin-slow" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">En Route Hold: {activeHold.roomName}</span>
            <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
              isUrgent ? 'bg-rose-500 text-white animate-pulse' : 'bg-amber-500 text-white'
            }`}>
              {formattedTime}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Space automatically releases to public if not confirmed within 20 minutes.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        <button
          onClick={handleCancelHold}
          className="px-3 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-1"
        >
          <X className="w-3.5 h-3.5" />
          Release Hold
        </button>
        <button
          onClick={handleConfirmArrival}
          className="px-4 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center gap-1.5 transition-all hover:scale-102"
        >
          <CheckCircle2 className="w-4 h-4" />
          Confirm Arrival & Check In
        </button>
      </div>
    </div>
  );
};
