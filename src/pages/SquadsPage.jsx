import React, { useState, useMemo } from 'react';
import { useRoomRadar } from '../context/RoomRadarContext';
import { UserAvatar } from '../components/UserAvatar';
import {
  Users,
  Search,
  Plus,
  Sparkles,
  Flame,
  Calendar,
  MapPin,
  CheckCircle2,
  Play,
  ArrowRight,
  BookOpen,
  Award,
  Filter
} from 'lucide-react';

export const SquadsPage = () => {
  const {
    squads,
    setSelectedSquad,
    setIsCreateSquadOpen,
    setIsMatcherOpen,
    handleJoinSquad,
    user
  } = useRoomRadar();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTimeBlock, setSelectedTimeBlock] = useState('All');

  const categories = ['All', 'Computer Science', 'Mathematics', 'Engineering', 'Competitive Exams'];
  const timeBlocks = ['All', 'Morning', 'Afternoon', 'Evening', 'Late Night'];

  const filteredSquads = useMemo(() => {
    return squads.filter((sq) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = sq.name.toLowerCase().includes(q);
        const matchesSubject = sq.subject.toLowerCase().includes(q);
        const matchesDesc = sq.description.toLowerCase().includes(q);
        if (!matchesName && !matchesSubject && !matchesDesc) return false;
      }
      if (selectedCategory !== 'All' && sq.category !== selectedCategory) {
        return false;
      }
      if (selectedTimeBlock !== 'All' && sq.timeBlock !== selectedTimeBlock) {
        return false;
      }
      return true;
    });
  }, [squads, searchQuery, selectedCategory, selectedTimeBlock]);

  return (
    <div className="space-y-6 pb-16">
      {/* Header & Main CTAs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-indigo-600 dark:text-cyan-400" />
            Campus Study Squads
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Connect with serious peers preparing for tough finals, GATE, GRE, or engineering topics.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => setIsMatcherOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-md flex items-center gap-1.5 transition-all hover:scale-102"
          >
            <Sparkles className="w-4 h-4" />
            Squad Matcher
          </button>

          <button
            onClick={() => setIsCreateSquadOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md flex items-center gap-1.5 transition-all hover:scale-102"
          >
            <Plus className="w-4 h-4" />
            Create Squad
          </button>
        </div>
      </div>

      {/* Toolbar & Filter Tabs */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search study groups by subject (e.g. Operating Systems, GATE, Linear Algebra)..."
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Category Pills & Time Block Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-700/60">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Time Block Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs text-slate-500 whitespace-nowrap">Time Block:</span>
            <select
              value={selectedTimeBlock}
              onChange={(e) => setSelectedTimeBlock(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium"
            >
              {timeBlocks.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Squad Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSquads.length === 0 ? (
          <div className="col-span-full py-16 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8 space-y-3">
            <Users className="w-10 h-10 mx-auto text-slate-400" />
            <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">
              No matching study squads found
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Be the first to launch a study squad for this topic and reserve campus rooms together.
            </p>
            <button
              onClick={() => setIsCreateSquadOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
            >
              Create Study Squad
            </button>
          </div>
        ) : (
          filteredSquads.map((sq) => {
            const isMember = sq.members.some(m => m.id === user.id);
            const isFull = sq.members.length >= sq.maxMembers;
            const completedGoals = sq.sessionGoals.filter(g => g.completed).length;

            return (
              <div
                key={sq.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 hover:border-indigo-500/50 transition-all shadow-sm hover:shadow-xl flex flex-col justify-between space-y-5"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 border border-indigo-500/20">
                        {sq.subject}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                        {sq.category}
                      </span>
                    </div>

                    <span className="flex items-center gap-1 text-xs font-mono font-bold text-amber-500 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                      <Flame className="w-3.5 h-3.5 fill-amber-500" />
                      {sq.streakBadge}
                    </span>
                  </div>

                  <h3
                    onClick={() => setSelectedSquad(sq)}
                    className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-cyan-400 cursor-pointer"
                  >
                    {sq.name}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed line-clamp-2">
                    {sq.description}
                  </p>

                  {/* Room & Schedule meta */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0" />
                      <span className="truncate">{sq.designatedRoomName}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0" />
                      <span className="truncate">{sq.schedule}</span>
                    </div>
                  </div>

                  {/* Focus Goals Progress */}
                  <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      Session Agenda Targets:
                    </span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {completedGoals} of {sq.sessionGoals.length} Complete
                    </span>
                  </div>
                </div>

                {/* Member Roster & Footer Actions */}
                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {sq.members.map((m, idx) => (
                        <UserAvatar
                          key={idx}
                          src={m.avatar}
                          alt={m.name}
                          title={`${m.name} (${m.role})`}
                          className="w-8 h-8 ring-2 ring-white dark:ring-slate-900 shadow-sm"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-slate-500 font-semibold">
                      {sq.members.length} / {sq.maxMembers} Students
                    </span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setSelectedSquad(sq)}
                      className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm flex items-center justify-center gap-1.5 transition-all hover:scale-102"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Workspace
                    </button>

                    {!isMember && (
                      <button
                        disabled={isFull}
                        onClick={() => handleJoinSquad(sq.id)}
                        className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:bg-slate-300"
                      >
                        {isFull ? 'Squad Full' : 'Join'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
