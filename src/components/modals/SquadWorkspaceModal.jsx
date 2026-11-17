import React, { useState } from 'react';
import { useRoomRadar } from '../../context/RoomRadarContext';
import { soundEffects } from '../../utils/audio';
import { UserAvatar } from '../UserAvatar';
import {
  X,
  Users,
  CheckSquare,
  Square,
  Plus,
  Play,
  Pause,
  RotateCcw,
  Clock,
  MapPin,
  Calendar,
  Flame,
  Award,
  BookOpen,
  MessageSquare,
  Sparkles,
  Volume2
} from 'lucide-react';

export const SquadWorkspaceModal = () => {
  const {
    selectedSquad,
    setSelectedSquad,
    handleToggleGoal,
    handleAddGoal,
    handleAddNote,
    pomodoroState,
    setPomodoroState,
    user,
    handleJoinSquad,
    handleLeaveSquad,
    showToast
  } = useRoomRadar();

  const [newGoalText, setNewGoalText] = useState('');
  const [newNoteText, setNewNoteText] = useState('');

  if (!selectedSquad) return null;

  const isMember = selectedSquad.members.some(m => m.id === user.id);
  const minutes = Math.floor(pomodoroState.timeLeft / 60);
  const seconds = pomodoroState.timeLeft % 60;
  const formattedTimer = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const togglePomodoro = () => {
    soundEffects.playTick();
    setPomodoroState(prev => ({
      ...prev,
      isRunning: !prev.isRunning,
      squadId: selectedSquad.id
    }));
  };

  const resetPomodoro = () => {
    soundEffects.playTick();
    setPomodoroState(prev => ({
      ...prev,
      isRunning: false,
      mode: 'focus',
      timeLeft: 25 * 60
    }));
  };

  const onAddGoalSubmit = (e) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    handleAddGoal(selectedSquad.id, newGoalText.trim(), user.name);
    setNewGoalText('');
    showToast('Focus Goal Added 🎯', 'New objective added to the squad agenda.', 'info');
  };

  const onAddNoteSubmit = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    handleAddNote(selectedSquad.id, newNoteText.trim());
    setNewNoteText('');
    showToast('Note Shared 📝', 'Tip published to the squad whiteboard.', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
        {/* Workspace Top Banner */}
        <div className="p-6 bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white relative">
          <button
            onClick={() => setSelectedSquad(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {selectedSquad.category}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10">
              {selectedSquad.targetExam}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              {selectedSquad.streakBadge}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            {selectedSquad.name}
          </h2>
          <p className="text-xs sm:text-sm text-blue-200 mt-1 max-w-2xl leading-relaxed">
            {selectedSquad.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-blue-200/80 mt-3">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{selectedSquad.designatedRoomName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>{selectedSquad.schedule}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>{selectedSquad.members.length} / {selectedSquad.maxMembers} Members</span>
            </div>
          </div>
        </div>

        {/* Workspace Body Grid */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          {/* Column 1 & 2: Pomodoro Timer, Focus Goals & Scratchpad */}
          <div className="lg:col-span-2 space-y-6">
            {/* Synchronized Pomodoro Squad Timer Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/50 via-blue-50/30 to-white dark:from-slate-800/60 dark:via-indigo-950/20 dark:to-slate-900 border border-indigo-100 dark:border-indigo-900/40 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                      Synchronized Pomodoro Squad Timer
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Syncs 25-min deep focus sprints with 5-min rest chimes for all squad members.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    pomodoroState.mode === 'focus'
                      ? 'bg-indigo-500 text-white'
                      : 'bg-emerald-500 text-white'
                  }`}>
                    {pomodoroState.mode === 'focus' ? '🎯 Focus Sprint' : '☕ Break Interval'}
                  </span>
                </div>
              </div>

              {/* Large Digital Timer Display */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                    {formattedTimer}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    ({pomodoroState.sessionsCompleted} cycles completed today)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePomodoro}
                    className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-1.5 transition-all hover:scale-102 ${
                      pomodoroState.isRunning
                        ? 'bg-amber-600 hover:bg-amber-500'
                        : 'bg-indigo-600 hover:bg-indigo-500'
                    }`}
                  >
                    {pomodoroState.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {pomodoroState.isRunning ? 'Pause Sync' : 'Start Focus Sprint'}
                  </button>

                  <button
                    onClick={resetPomodoro}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                    title="Reset timer to 25 mins"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Target Study Goals Checklist */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-emerald-500" />
                  Session Focus Goals ({selectedSquad.sessionGoals.filter(g => g.completed).length}/{selectedSquad.sessionGoals.length})
                </h4>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 overflow-hidden">
                {selectedSquad.sessionGoals.map((goal) => (
                  <div
                    key={goal.id}
                    onClick={() => handleToggleGoal(selectedSquad.id, goal.id)}
                    className="flex items-start gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/70 cursor-pointer transition-colors"
                  >
                    {goal.completed ? (
                      <CheckSquare className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs ${goal.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200 font-medium'}`}>
                        {goal.text}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-0.5 inline-block">
                        Assigned: {goal.assignee}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Goal Input */}
              <form onSubmit={onAddGoalSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={newGoalText}
                  onChange={(e) => setNewGoalText(e.target.value)}
                  placeholder="Add a new study milestone (e.g. Solve 5 dynamic programming problems)..."
                  className="flex-1 px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </form>
            </div>

            {/* Collaborative Whiteboard / Shared Scratchpad */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-500" />
                Collaborative Squad Scratchpad & Tips
              </h4>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedSquad.notes.map((note, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono"
                  >
                    💡 {note}
                  </div>
                ))}
              </div>

              <form onSubmit={onAddNoteSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Share a formula, theorem reminder, or whiteboard note..."
                  className="flex-1 px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-[11px]"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-semibold"
                >
                  Share
                </button>
              </form>
            </div>
          </div>

          {/* Column 3: Member Roster & Peer Study Streak Badges */}
          <div className="space-y-6">
            {/* Member Roster Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200 dark:border-slate-700/60">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-500" />
                  Active Roster ({selectedSquad.members.length})
                </h4>
                <span className="text-[10px] text-slate-400 font-medium">
                  Max: {selectedSquad.maxMembers}
                </span>
              </div>

              <div className="space-y-3">
                {selectedSquad.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors"
                  >
                    <UserAvatar
                      src={member.avatar}
                      alt={member.name}
                      className="w-9 h-9 ring-2 ring-indigo-500/30"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                          {member.name}
                        </span>
                        {member.role === 'Squad Leader' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                            LEAD
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">{member.department}</p>
                      <div className="flex items-center gap-1 text-[10px] text-amber-500 font-mono mt-0.5">
                        <Flame className="w-3 h-3 fill-amber-500" />
                        <span>{member.streakDays}d streak</span>
                        <span className="text-slate-400 dark:text-slate-500 ml-auto text-[9px] font-medium">
                          • {member.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Membership Toggle */}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60">
                {isMember ? (
                  <button
                    onClick={() => handleLeaveSquad(selectedSquad.id)}
                    className="w-full py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 transition-colors"
                  >
                    Leave Squad
                  </button>
                ) : (
                  <button
                    disabled={selectedSquad.members.length >= selectedSquad.maxMembers}
                    onClick={() => handleJoinSquad(selectedSquad.id)}
                    className="w-full py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 transition-all hover:scale-102 disabled:bg-slate-400"
                  >
                    {selectedSquad.members.length >= selectedSquad.maxMembers ? 'Squad is Full' : 'Join This Study Squad'}
                  </button>
                )}
              </div>
            </div>

            {/* Streak Tracker & Peer Badges Showcase */}
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-amber-500" />
                <h5 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                  Peer Study Streak
                </h5>
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                This squad has maintained an unbroken <strong>{selectedSquad.streakDays}-day streak</strong>! Everyone studying together today earns daily badge credit.
              </p>
              <div className="mt-3 p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-amber-300/40 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                <span>Award: {selectedSquad.streakBadge}</span>
                <span className="text-[10px] font-bold text-emerald-500">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
