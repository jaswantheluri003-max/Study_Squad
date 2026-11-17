import React, { useState, useMemo } from 'react';
import { useRoomRadar } from '../../context/RoomRadarContext';
import {
  X,
  Sparkles,
  Search,
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  ArrowRight,
  Flame,
  Award,
  Zap,
  BookOpen
} from 'lucide-react';

export const SquadMatcherModal = () => {
  const {
    isMatcherOpen,
    setIsMatcherOpen,
    squads,
    courses,
    handleJoinSquad,
    setSelectedSquad,
    setIsCreateSquadOpen,
    user
  } = useRoomRadar();

  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || 'c-1');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedTimeBlock, setSelectedTimeBlock] = useState('Afternoon');

  const activeCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

  // Algorithmic compatibility calculation
  const matchedSquads = useMemo(() => {
    if (!activeCourse) return [];

    return squads
      .map((squad) => {
        let score = 30; // base score
        const reasons = [];

        // Exact subject match
        if (squad.subject.toLowerCase().includes(activeCourse.name.toLowerCase()) ||
            activeCourse.name.toLowerCase().includes(squad.subject.toLowerCase())) {
          score += 40;
          reasons.push('Shared Core Curriculum');
        } else if (squad.category === activeCourse.department || squad.category === 'Computer Science') {
          score += 20;
          reasons.push('Related Academic Field');
        }

        // Schedule block match
        if (squad.timeBlock === selectedTimeBlock) {
          score += 25;
          reasons.push(`${selectedTimeBlock} Schedule Aligned`);
        } else {
          score += 5;
        }

        // Open capacity bonus
        if (squad.members.length < squad.maxMembers) {
          score += 5;
        }

        // Streak momentum bonus
        if (squad.streakDays >= 7) {
          reasons.push(`High Momentum (${squad.streakDays}d Streak)`);
        }

        const normalizedScore = Math.min(99, Math.max(45, score));

        return {
          ...squad,
          matchScore: normalizedScore,
          reasons
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [squads, activeCourse, selectedTimeBlock]);

  if (!isMatcherOpen) return null;

  const timeBlocks = [
    { id: 'Morning', label: 'Morning (08:00 AM - 12:00 PM)', icon: '🌅' },
    { id: 'Afternoon', label: 'Afternoon (12:00 PM - 05:00 PM)', icon: '☀️' },
    { id: 'Evening', label: 'Evening (05:00 PM - 09:00 PM)', icon: '🌆' },
    { id: 'Late Night', label: 'Late Night (09:00 PM - 01:00 AM)', icon: '🌙' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-900 text-white relative">
          <button
            onClick={() => setIsMatcherOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-400 text-slate-950 flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              AI & Schedule Compatibility Matrix
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Study Squad Matcher Engine
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl leading-relaxed">
            Stop studying alone. Pair with verified campus peers preparing for the exact same exam topics and sharing your exact study schedule.
          </p>
        </div>

        {/* Filter / Input Matrix */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Subject Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Target Subject / Exam
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => {
                  setSelectedCourseId(e.target.value);
                  setSelectedTopic('');
                }}
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.code}: {course.name} ({course.examCategory})
                  </option>
                ))}
              </select>
            </div>

            {/* Time Block Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Preferred Study Block
              </label>
              <select
                value={selectedTimeBlock}
                onChange={(e) => setSelectedTimeBlock(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                {timeBlocks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.icon} {b.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Topic Chips */}
          {activeCourse && (
            <div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">
                Focus Topics Covered in this Course:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeCourse.topics.map((topic, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedTopic(topic === selectedTopic ? '' : topic)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                      selectedTopic === topic
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results List */}
        <div className="p-6 space-y-4 flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Top Ranked Squad Matches ({matchedSquads.length})
            </h4>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
              Sorted by Compatibility Score
            </span>
          </div>

          <div className="space-y-3">
            {matchedSquads.slice(0, 4).map((squad) => {
              const isMember = squad.members.some(m => m.id === user.id);
              const isFull = squad.members.length >= squad.maxMembers;

              return (
                <div
                  key={squad.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 hover:border-indigo-500/50 transition-all shadow-sm hover:shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    {/* Circular Score Badge */}
                    <div className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white flex-shrink-0 shadow-md shadow-indigo-500/20">
                      <span className="font-mono text-base font-black leading-none">
                        {squad.matchScore}%
                      </span>
                      <span className="text-[9px] font-bold tracking-tight opacity-90 mt-0.5">
                        MATCH
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-indigo-600 dark:text-cyan-400">
                          {squad.subject}
                        </span>
                        <span className="text-[10px] text-slate-400">•</span>
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          {squad.timeBlock}s ({squad.schedule})
                        </span>
                      </div>

                      <h5 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                        {squad.name}
                      </h5>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                        {squad.description}
                      </p>

                      {/* Reasons tags */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {squad.reasons.map((r, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          >
                            ✓ {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                    <button
                      onClick={() => {
                        setSelectedSquad(squad);
                        setIsMatcherOpen(false);
                      }}
                      className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Workspace
                    </button>

                    {isMember ? (
                      <span className="px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                        Joined ✓
                      </span>
                    ) : (
                      <button
                        disabled={isFull}
                        onClick={() => {
                          handleJoinSquad(squad.id);
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition-all hover:scale-102 disabled:bg-slate-400"
                      >
                        {isFull ? 'Full' : 'Join Squad'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom create squad CTA */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Want to lead your own study squad for {activeCourse.name}?
              </p>
              <p className="text-[11px] text-slate-500">
                Launch a group in 30 seconds and invite campus peers to reserve a room together.
              </p>
            </div>
            <button
              onClick={() => {
                setIsMatcherOpen(false);
                setIsCreateSquadOpen(true);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 transition-all flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              Create Squad
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
