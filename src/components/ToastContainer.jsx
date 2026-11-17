import React from 'react';
import { useRoomRadar } from '../context/RoomRadarContext';
import { CheckCircle2, AlertTriangle, Info, X, Clock } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useRoomRadar();

  if (!toasts.length) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />;
      case 'hold':
        return <Clock className="w-5 h-5 text-indigo-500 flex-shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />;
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 backdrop-blur-md animate-fade-in transition-all"
        >
          {getIcon(toast.type)}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold tracking-tight">{toast.title}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
