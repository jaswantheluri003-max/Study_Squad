import React, { useState } from 'react';
import { useRoomRadar } from '../context/RoomRadarContext';
import { HoldCountdownBadge } from '../components/HoldCountdownBadge';
import {
  CalendarCheck,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  X,
  Plus,
  AlertCircle,
  CheckCircle2,
  Users
} from 'lucide-react';

export const BookingPage = () => {
  const {
    bookings,
    rooms,
    activeHold,
    setIsBookingModalOpen,
    handleConfirmArrival,
    handleCancelHold,
    setBookingRoomTarget,
    setIsQrModalOpen,
    setQrCodeData,
    showToast,
    setBookings
  } = useRoomRadar();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'holds' | 'scheduled'

  const handleCancelBooking = (bookingId) => {
    const updated = bookings.filter(b => b.id !== bookingId);
    setBookings(updated);
    showToast('Reservation Cancelled', 'Room released back to the campus pool.', 'info');
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'holds') return b.type === 'hold';
    if (activeTab === 'scheduled') return b.type === 'scheduled';
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <CalendarCheck className="w-6 h-6 text-indigo-600 dark:text-cyan-400" />
            Room Bookings & Holds
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your active 20-minute en route holds and scheduled squad sessions.
          </p>
        </div>

        <button
          onClick={() => {
            setBookingRoomTarget(rooms[0]);
            setIsBookingModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md flex items-center gap-1.5 transition-all hover:scale-102 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Reserve New Space
        </button>
      </div>

      {/* Active Hold Highlight Banner (if exists) */}
      {activeHold && (
        <div className="animate-fade-in">
          <HoldCountdownBadge compact={false} />
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'all'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          All Reservations ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('holds')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'holds'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Active Holds ({bookings.filter(b => b.type === 'hold').length})
        </button>
        <button
          onClick={() => setActiveTab('scheduled')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'scheduled'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Scheduled Sessions ({bookings.filter(b => b.type === 'scheduled').length})
        </button>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="py-16 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8 space-y-3">
            <Calendar className="w-10 h-10 mx-auto text-slate-400" />
            <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">
              No reservations found in this view
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Place a 20-minute hold on an available room or schedule a future squad meeting.
            </p>
          </div>
        ) : (
          filteredBookings.map((bk) => (
            <div
              key={bk.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className={`p-3 rounded-2xl flex-shrink-0 ${
                  bk.type === 'hold' ? 'bg-amber-500/10 text-amber-500' : 'bg-indigo-500/10 text-indigo-500'
                }`}>
                  {bk.type === 'hold' ? <Clock className="w-6 h-6 animate-spin-slow" /> : <CalendarCheck className="w-6 h-6" />}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      bk.type === 'hold' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                    }`}>
                      {bk.type === 'hold' ? '20-Min En Route Hold' : 'Confirmed Reservation'}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 font-mono">
                      Token: {bk.qrCode}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {bk.roomName}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                      {bk.building} • {bk.floor}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                      {bk.date} ({bk.timeSlot})
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {bk.attendeesCount} Students
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 italic pt-1">
                    "{bk.purpose}"
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-auto flex-shrink-0">
                <button
                  onClick={() => {
                    setQrCodeData({
                      roomName: bk.roomName,
                      code: bk.qrCode,
                      time: bk.timeSlot
                    });
                    setIsQrModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-indigo-600 dark:text-cyan-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 hover:bg-indigo-100 flex items-center gap-1.5 transition-colors"
                >
                  <QrCode className="w-4 h-4" />
                  Access Pass
                </button>

                <button
                  onClick={() => handleCancelBooking(bk.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  title="Cancel this reservation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
