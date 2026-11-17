import React from 'react';
import { useRoomRadar } from '../../context/RoomRadarContext';
import { X, CheckCircle2, QrCode, ShieldCheck, Download, Share2 } from 'lucide-react';

export const QrCheckInModal = () => {
  const { isQrModalOpen, setIsQrModalOpen, qrCodeData, user, showToast } = useRoomRadar();

  if (!isQrModalOpen || !qrCodeData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-center overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => setIsQrModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Header Icon */}
        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mb-3">
          <ShieldCheck className="w-8 h-8 animate-bounce" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Campus Access Pass Verified
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Present this verified pass to room door scanner or library monitor.
        </p>

        {/* QR Code Container with simulated scanline */}
        <div className="relative my-5 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 mx-auto w-48 h-48 flex items-center justify-center overflow-hidden">
          {/* Animated laser scan beam */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_#22d3ee] animate-pulse-slow top-1/2 -translate-y-1/2" />

          {/* SVG QR code simulation */}
          <svg className="w-36 h-36 text-slate-900 dark:text-white" viewBox="0 0 100 100" fill="currentColor">
            <rect x="10" y="10" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="5" />
            <rect x="17" y="17" width="11" height="11" />
            <rect x="65" y="10" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="5" />
            <rect x="72" y="17" width="11" height="11" />
            <rect x="10" y="65" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="5" />
            <rect x="17" y="72" width="11" height="11" />
            <rect x="42" y="15" width="8" height="8" />
            <rect x="42" y="30" width="8" height="16" />
            <rect x="15" y="42" width="16" height="8" />
            <rect x="58" y="42" width="8" height="18" />
            <rect x="42" y="65" width="16" height="8" />
            <rect x="65" y="65" width="10" height="10" />
            <rect x="80" y="80" width="10" height="10" />
          </svg>
        </div>

        {/* Room & Pass details */}
        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-left space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Assigned Space:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{qrCodeData.roomName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Student:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">{user.name} ({user.studentId})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Check-In Time:</span>
            <span className="font-mono text-emerald-500 font-bold">{qrCodeData.time || 'Just now'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Token:</span>
            <span className="font-mono text-[10px] text-slate-500">{qrCodeData.code}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => {
              showToast('Pass Saved', 'Digital pass downloaded to student wallet.', 'success');
              setIsQrModalOpen(false);
            }}
            className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Save to Wallet
          </button>
          <button
            onClick={() => setIsQrModalOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
