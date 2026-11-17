import React from 'react';
import { useRoomRadar } from '../context/RoomRadarContext';
import { DecibelMeter } from '../components/DecibelMeter';
import { UserAvatar } from '../components/UserAvatar';
import {
  Compass,
  MapPin,
  Users,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Flame,
  Volume2,
  CalendarCheck,
  Star,
  Zap,
  BookOpen,
  Coffee
} from 'lucide-react';

export const LandingPage = () => {
  const {
    setCurrentPage,
    rooms,
    squads,
    setSelectedRoom,
    setSelectedSquad,
    setIsMatcherOpen,
    handleHoldRoom,
    activeHold
  } = useRoomRadar();

  const availableRoomsCount = rooms.filter(r => r.status === 'Available').length;
  const activeSquadsCount = squads.length;

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden rounded-3xl bg-gradient-to-b from-indigo-900/20 via-blue-900/10 to-transparent border border-indigo-500/10 dark:border-indigo-500/15 p-6 sm:p-12">
        {/* Background glow orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/15 dark:bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          {/* Hackathon Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/30 text-indigo-600 dark:text-cyan-300 text-xs font-bold tracking-wide animate-fade-in shadow-sm">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Campus Study Rooms & StudySquad Sync</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Find Empty Campus Desks. <br />
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 dark:from-indigo-400 dark:via-blue-300 dark:to-cyan-300 bg-clip-text text-transparent">
              Sync with Study Squads.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Eliminate wasted exam hours searching for quiet study rooms. View real-time library occupancy, hold rooms for 20 minutes while en route, and pair with peers preparing for your exact exams.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => setCurrentPage('rooms')}
              className="px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              Explore Campus Rooms ({availableRoomsCount} Open)
            </button>

            <button
              onClick={() => setIsMatcherOpen(true)}
              className="px-6 py-3.5 rounded-xl font-bold text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:scale-105 flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-cyan-500" />
              Launch Squad Matcher
            </button>

            <button
              onClick={() => setCurrentPage('dashboard')}
              className="px-5 py-3.5 rounded-xl font-semibold text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              My Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Real-time Ticker */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-200/80 dark:border-slate-800/80 text-left">
            <div className="p-3 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800">
              <div className="text-2xl font-black text-indigo-600 dark:text-cyan-400 font-mono">
                {rooms.length}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Campus Facility Spaces
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800">
              <div className="text-2xl font-black text-emerald-500 font-mono">
                {availableRoomsCount}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Desks Available Now
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800">
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
                {activeSquadsCount}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Active Study Squads
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800">
              <div className="text-2xl font-black text-amber-500 font-mono">
                20 min
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                En Route Space Hold
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Study Squad Works (3 Steps) */}
      <section className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            How Study Squad Powers Campus Study
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            From discovering available desks to synchronizing Pomodoro sprints with study partners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-lg mb-4">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
              Live Space Occupancy Scan
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Check live chair occupancy and acoustic decibel (dB) levels across Central Library, Engineering Block, and Student Center.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-lg mb-4">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
              20-Min En Route Hold
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Heading over from class? Place a temporary 20-minute hold with a live countdown timer to secure your study space before someone else takes it.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-black text-lg mb-4">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
              Squad Sync & Pomodoro
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Meet in your designated room with matched peers. Track synchronized 25-min Pomodoro sprints, check off focus goals, and earn streak badges.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Campus Study Spaces Preview */}
      <section className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Featured Campus Spaces
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live capacity, whiteboard availability, and noise meters.
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('rooms')}
            className="text-xs font-bold text-indigo-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
          >
            View all 12 rooms <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rooms.slice(0, 3).map((room) => {
            const isAvailable = room.status === 'Available';
            const isHeld = activeHold?.roomId === room.id;

            return (
              <div
                key={room.id}
                className="group rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    isAvailable ? 'bg-emerald-500 text-white' : room.status === 'Reserved' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'
                  }`}>
                    {room.status}
                  </span>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[11px] text-cyan-300 font-semibold">{room.building}</span>
                    <h4 className="text-sm font-bold truncate leading-tight">{room.name}</h4>
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                      <span>Live Desks:</span>
                      <span className="font-mono font-bold">
                        {room.occupiedSeats} / {room.capacity} occupied
                      </span>
                    </div>

                    <DecibelMeter db={room.noiseDb} level={room.noiseLevel} compact={true} />

                    <div className="flex flex-wrap gap-1 pt-1">
                      {room.facilities.slice(0, 3).map((f, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedRoom(room)}
                      className="flex-1 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                    >
                      Details
                    </button>
                    <button
                      disabled={!isAvailable && !isHeld}
                      onClick={() => handleHoldRoom(room)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm transition-all ${
                        isAvailable ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {isHeld ? 'Held' : '20-Min Hold'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Active Study Squads */}
      <section className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Active Peer Study Squads
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Groups currently hitting focus sprints for upcoming midterms & finals.
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('squads')}
            className="text-xs font-bold text-indigo-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
          >
            Explore all squads <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {squads.slice(0, 4).map((sq) => (
            <div
              key={sq.id}
              onClick={() => setSelectedSquad(sq)}
              className="p-5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 hover:border-indigo-500/50 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-cyan-400">
                    {sq.subject}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-amber-500">
                    <Flame className="w-3.5 h-3.5 fill-amber-500" />
                    {sq.streakDays}d
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                  {sq.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {sq.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                <div className="flex -space-x-2">
                  {sq.members.slice(0, 3).map((m, idx) => (
                    <UserAvatar
                      key={idx}
                      src={m.avatar}
                      alt={m.name}
                      className="w-6 h-6 ring-2 ring-white dark:ring-slate-900"
                    />
                  ))}
                </div>
                <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                  {sq.members.length}/{sq.maxMembers} Members →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-700 to-cyan-600 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl font-black">
              Ready to crush your exams with Study Squad?
            </h3>
            <p className="text-xs sm:text-sm text-blue-100">
              Never get stuck searching for a room again. Place a 20-minute hold or match with fellow university students today.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentPage('register')}
              className="px-5 py-3 rounded-xl text-xs font-bold text-indigo-900 bg-white hover:bg-blue-50 shadow-lg transition-all hover:scale-105 whitespace-nowrap"
            >
              Create Account
            </button>
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="px-5 py-3 rounded-xl text-xs font-bold text-white bg-indigo-950/60 hover:bg-indigo-950 border border-white/20 transition-all hover:scale-105 whitespace-nowrap"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
