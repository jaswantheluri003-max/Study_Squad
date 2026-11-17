import React, { useState } from 'react';
import { useRoomRadar } from '../context/RoomRadarContext';
import { HoldCountdownBadge } from '../components/HoldCountdownBadge';
import { DecibelMeter } from '../components/DecibelMeter';
import { UserAvatar } from '../components/UserAvatar';
import {
  Compass,
  MapPin,
  Users,
  Clock,
  CalendarCheck,
  Flame,
  Award,
  Zap,
  ArrowRight,
  Plus,
  Play,
  QrCode,
  CheckCircle2,
  AlertCircle,
  X,
  Filter
} from 'lucide-react';

export const DashboardPage = () => {
  const {
    user,
    rooms,
    squads,
    bookings,
    activeHold,
    setCurrentPage,
    setSelectedRoom,
    setSelectedSquad,
    setIsMatcherOpen,
    setIsBookingModalOpen,
    setIsCreateSquadOpen,
    handleHoldRoom,
    handleConfirmArrival,
    handleCancelHold,
    setBookingRoomTarget,
    setIsQrModalOpen,
    setQrCodeData
  } = useRoomRadar();

  const [buildingFilter, setBuildingFilter] = useState('All');

  // Filter user's joined squads
  const joinedSquads = squads.filter(s => user.joinedSquadIds?.includes(s.id));

  // Upcoming confirmed or active bookings
  const upcomingBookings = bookings.filter(b => b.status !== 'cancelled');

  const filteredRooms = buildingFilter === 'All'
    ? rooms.slice(0, 4)
    : rooms.filter(r => r.building === buildingFilter).slice(0, 4);

  return (
    <div className="space-y-8 pb-16">
      {/* Personalized Welcome Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-blue-900/30 to-slate-900/50 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <UserAvatar
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 sm:w-20 sm:h-20 ring-2 ring-indigo-500/50 shadow-md"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Welcome back, {user.name.split(' ')[0]}! 👋
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-amber-500" />
                {user.activeStreakDays}-Day Study Streak
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {user.department} • {user.year} • GPA: <span className="font-mono font-bold text-indigo-600 dark:text-cyan-400">{user.gpa}</span>
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setIsMatcherOpen(true)}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-sm flex items-center justify-center gap-2 transition-all hover:scale-102"
          >
            <Users className="w-4 h-4" />
            Squad Matcher
          </button>
          <button
            onClick={() => {
              setBookingRoomTarget(rooms[0]);
              setIsBookingModalOpen(true);
            }}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center gap-2 transition-all"
          >
            <CalendarCheck className="w-4 h-4 text-indigo-500" />
            Book Room
          </button>
        </div>
      </div>

      {/* Active 20-Minute Hold Alert Banner (if active) */}
      {activeHold && (
        <div className="animate-fade-in">
          <HoldCountdownBadge compact={false} />
        </div>
      )}

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Study Time</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
              {user.stats.totalStudyHours}h
            </span>
            <p className="text-[11px] text-emerald-500 font-semibold mt-1">
              +4.5 hrs this week
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Current Streak</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Flame className="w-4 h-4 fill-amber-500" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black font-mono text-amber-500">
              {user.activeStreakDays} Days
            </span>
            <p className="text-[11px] text-slate-400 mt-1">
              Best record: {user.longestStreakDays} days
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Rooms Booked</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
              {user.stats.roomsBooked}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">
              Verified campus check-ins
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Squad Sessions</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
              {user.stats.squadCollaborations}
            </span>
            <p className="text-[11px] text-purple-500 font-semibold mt-1">
              {joinedSquads.length} squads active
            </p>
          </div>
        </div>
      </div>

      {/* Main Two-Column Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Live Room Radar & Joined Squads */}
        <div className="lg:col-span-2 space-y-8">
          {/* Live Campus Study Rooms */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-500" />
                  Live Campus Study Spaces
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Instant occupancy telemetry and 20-minute en route holds.
                </p>
              </div>

              {/* Building selector filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {['All', 'Central Library', 'Engineering Block', 'Student Center'].map((b) => (
                  <button
                    key={b}
                    onClick={() => setBuildingFilter(b)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      buildingFilter === b
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Room cards preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredRooms.map((room) => {
                const isHeld = activeHold?.roomId === room.id;
                const isAvailable = room.status === 'Available' || isHeld;

                return (
                  <div
                    key={room.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 hover:border-indigo-500/50 transition-all shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isAvailable
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        }`}>
                          {room.status}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {room.building}
                        </span>
                      </div>

                      <h4
                        onClick={() => setSelectedRoom(room)}
                        className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-cyan-400 cursor-pointer line-clamp-1"
                      >
                        {room.name}
                      </h4>

                      <div className="my-2">
                        <DecibelMeter db={room.noiseDb} level={room.noiseLevel} compact={true} />
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                        <span>Desks Open:</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          {room.capacity - room.occupiedSeats} of {room.capacity}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-2">
                      <button
                        onClick={() => setSelectedRoom(room)}
                        className="flex-1 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                      >
                        Inspect
                      </button>
                      <button
                        disabled={!isAvailable && !isHeld}
                        onClick={() => handleHoldRoom(room)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold text-white transition-all ${
                          isAvailable
                            ? 'bg-indigo-600 hover:bg-indigo-500 shadow-sm'
                            : 'bg-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {isHeld ? 'Active Hold' : '20-Min Hold'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-right">
              <button
                onClick={() => setCurrentPage('rooms')}
                className="text-xs font-bold text-indigo-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-1"
              >
                Open Full Campus Room Directory & Map View <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Joined Study Squads */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-500" />
                  My Joined Study Squads ({joinedSquads.length})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Access synchronized Pomodoro timer and target focus goals.
                </p>
              </div>

              <button
                onClick={() => setIsCreateSquadOpen(true)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                New Squad
              </button>
            </div>

            <div className="space-y-3">
              {joinedSquads.length === 0 ? (
                <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-slate-400 text-xs">
                  You haven't joined any squads yet. Launch the Squad Matcher to connect with peers.
                </div>
              ) : (
                joinedSquads.map((sq) => (
                  <div
                    key={sq.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 hover:border-indigo-500/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-cyan-400">
                          {sq.subject}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500">{sq.schedule}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {sq.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Location: {sq.designatedRoomName} • {sq.sessionGoals.filter(g => g.completed).length}/{sq.sessionGoals.length} Goals Complete
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => setSelectedSquad(sq)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm flex items-center gap-1.5 transition-all hover:scale-102"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Open Workspace
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Upcoming Reservations & Activity */}
        <div className="space-y-8">
          {/* Upcoming Bookings Card */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-indigo-500" />
                Upcoming Room Bookings
              </h3>
              <span className="text-xs font-bold text-indigo-600 dark:text-cyan-400 font-mono">
                {upcomingBookings.length}
              </span>
            </div>

            <div className="space-y-3">
              {upcomingBookings.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  No upcoming reservations.
                </div>
              ) : (
                upcomingBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-700/60 space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {b.roomName}
                        </h5>
                        <p className="text-[11px] text-slate-500">
                          {b.date} • {b.timeSlot}
                        </p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        b.type === 'hold' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                      }`}>
                        {b.type === 'hold' ? '20m Hold' : 'Reserved'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                      <button
                        onClick={() => {
                          setQrCodeData({
                            roomName: b.roomName,
                            code: b.qrCode,
                            time: b.timeSlot
                          });
                          setIsQrModalOpen(true);
                        }}
                        className="text-indigo-600 dark:text-cyan-400 font-semibold hover:underline flex items-center gap-1 text-[11px]"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        Access Pass
                      </button>

                      <span className="text-[10px] text-slate-400">
                        {b.purpose}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setCurrentPage('booking')}
              className="w-full py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-center"
            >
              Manage All Bookings →
            </button>
          </div>

          {/* Academic Profile Snippet & Badges */}
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Earned Study Badges
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {user.badges.slice(0, 4).map((badge) => (
                <div
                  key={badge.id}
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2"
                >
                  <span className="text-lg">{badge.icon}</span>
                  <div className="min-w-0">
                    <h6 className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                      {badge.title}
                    </h6>
                    <span className="text-[9px] text-slate-400 block truncate">
                      {badge.unlockedAt}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage('profile')}
              className="w-full py-2 rounded-xl text-xs font-semibold text-indigo-600 dark:text-cyan-400 hover:underline text-center"
            >
              View Full Profile & Streaks →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
