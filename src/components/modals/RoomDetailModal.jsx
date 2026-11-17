import React from 'react';
import { useRoomRadar } from '../../context/RoomRadarContext';
import { DecibelMeter } from '../DecibelMeter';
import {
  X,
  MapPin,
  Users,
  Zap,
  CheckCircle2,
  Clock,
  Calendar,
  Star,
  Heart,
  ShieldAlert,
  Tv,
  Wifi,
  Sparkles
} from 'lucide-react';

export const RoomDetailModal = () => {
  const {
    selectedRoom,
    setSelectedRoom,
    handleHoldRoom,
    handleToggleFavorite,
    setIsBookingModalOpen,
    setBookingRoomTarget,
    activeHold
  } = useRoomRadar();

  if (!selectedRoom) return null;

  const isHeldByMe = activeHold?.roomId === selectedRoom.id;
  const isAvailable = selectedRoom.status === 'Available' || isHeldByMe;
  const occupancyPercentage = Math.round((selectedRoom.occupiedSeats / selectedRoom.capacity) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
        {/* Room Header Image */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden">
          <img
            src={selectedRoom.image}
            alt={selectedRoom.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Close & Favorite buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => handleToggleFavorite(selectedRoom.id)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-all"
              title="Add to favorites"
            >
              <Heart
                className={`w-5 h-5 ${selectedRoom.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'}`}
              />
            </button>
            <button
              onClick={() => setSelectedRoom(null)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Title & Status Badges */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                selectedRoom.status === 'Available'
                  ? 'bg-emerald-500 text-white'
                  : selectedRoom.status === 'Reserved'
                  ? 'bg-amber-500 text-white'
                  : 'bg-rose-500 text-white'
              }`}>
                {selectedRoom.status}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md">
                {selectedRoom.type}
              </span>
              <div className="flex items-center gap-1 text-xs text-amber-300 font-bold ml-auto">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{selectedRoom.rating}</span>
                <span className="text-white/60">({selectedRoom.reviewCount} ratings)</span>
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              {selectedRoom.name}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-300 mt-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{selectedRoom.building} • {selectedRoom.floor} • {selectedRoom.mapCoordinates.zone}</span>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Live Telemetry Bar: Occupancy & Decibels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
            {/* Occupancy Card */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-500" />
                  Live Desk Occupancy
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                  {selectedRoom.occupiedSeats} / {selectedRoom.capacity} seats ({occupancyPercentage}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    occupancyPercentage >= 100
                      ? 'bg-rose-500'
                      : occupancyPercentage >= 70
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${occupancyPercentage}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                {selectedRoom.capacity - selectedRoom.occupiedSeats} seats immediately open right now.
              </p>
            </div>

            {/* Simulated Decibel Meter */}
            <div>
              <DecibelMeter db={selectedRoom.noiseDb} level={selectedRoom.noiseLevel} />
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Space Overview
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedRoom.description}
            </p>
          </div>

          {/* Amenities & Hardware */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Available Amenities & Tech
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedRoom.facilities.map((fac, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  {fac}
                </span>
              ))}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/50">
                <Zap className="w-3.5 h-3.5" />
                {selectedRoom.powerSocketsCount} AC Power Outlets
              </span>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              {isHeldByMe ? (
                <span className="text-emerald-500 font-bold">You currently hold this space!</span>
              ) : (
                <span>Hold expires automatically after 20 mins if you don't confirm.</span>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => {
                  setBookingRoomTarget(selectedRoom);
                  setSelectedRoom(null);
                  setIsBookingModalOpen(true);
                }}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-slate-400" />
                Schedule Session
              </button>

              <button
                disabled={!isAvailable && !isHeldByMe}
                onClick={() => {
                  if (handleHoldRoom(selectedRoom)) {
                    setSelectedRoom(null);
                  }
                }}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md flex items-center justify-center gap-2 ${
                  isHeldByMe
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : isAvailable
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-indigo-500/20 hover:scale-102'
                    : 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed opacity-60'
                }`}
              >
                <Clock className="w-4 h-4" />
                {isHeldByMe ? 'Hold Active (20m)' : 'Instant 20-Min Hold'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
