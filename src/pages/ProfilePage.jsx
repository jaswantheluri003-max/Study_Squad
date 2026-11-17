import React, { useState, useRef } from 'react';
import { useRoomRadar } from '../context/RoomRadarContext';
import { UserAvatar } from '../components/UserAvatar';
import { DEFAULT_AVATAR } from '../utils/constants';
import { storage } from '../utils/storage';
import {
  User,
  Flame,
  Award,
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Users,
  Plus,
  X,
  Edit2,
  Save,
  ShieldCheck,
  Camera,
  RotateCcw
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, setUser, squads, bookings, showToast, setSelectedSquad } = useRoomRadar();

  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    department: user.department,
    studentId: user.studentId,
    gpa: user.gpa,
  });
  const [newInterest, setNewInterest] = useState('');

  const joinedSquads = squads.filter(s => user.joinedSquadIds?.includes(s.id));

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast('File Too Large', 'Please upload an image smaller than 2MB.', 'warning');
      return;
    }
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const newAvatarUrl = uploadEvent.target?.result;
      if (newAvatarUrl) {
        const updated = { ...user, avatar: newAvatarUrl };
        setUser(updated);
        storage.saveUser(updated);
        showToast('Profile Photo Updated! 📸', 'Your custom avatar has been saved.', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetAvatar = () => {
    const updated = { ...user, avatar: DEFAULT_AVATAR };
    setUser(updated);
    storage.saveUser(updated);
    showToast('Avatar Reset', 'Restored official default profile avatar.', 'info');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = {
      ...user,
      ...formData
    };
    setUser(updated);
    setIsEditing(false);
    showToast('Profile Updated', 'Your academic profile details have been saved.', 'success');
  };

  const handleAddInterest = (e) => {
    e.preventDefault();
    if (!newInterest.trim()) return;
    if (user.academicInterests.includes(newInterest.trim())) return;

    const updated = {
      ...user,
      academicInterests: [...user.academicInterests, newInterest.trim()]
    };
    setUser(updated);
    setNewInterest('');
    showToast('Interest Added', `Added "${newInterest.trim()}" to academic focus list.`, 'info');
  };

  const handleRemoveInterest = (interest) => {
    const updated = {
      ...user,
      academicInterests: user.academicInterests.filter(i => i !== interest)
    };
    setUser(updated);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Student Profile Identity Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-blue-900/30 to-slate-900/50 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative group">
              <UserAvatar
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 sm:w-24 sm:h-24 ring-4 ring-indigo-500/40 shadow-xl"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-transform hover:scale-110"
                title="Upload custom profile photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {user.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 border border-indigo-500/20">
                  {user.studentId}
                </span>
                {user.avatar !== DEFAULT_AVATAR && (
                  <button
                    onClick={handleResetAvatar}
                    className="text-[10px] font-semibold text-slate-400 hover:text-indigo-400 flex items-center gap-1 ml-2 transition-colors"
                    title="Restore default avatar"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset Avatar
                  </button>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {user.department} • {user.year}
              </p>
              <p className="text-xs text-slate-400">
                University Email: <span className="font-mono text-indigo-500">{user.email}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Edit2 className="w-3.5 h-3.5" />
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        {/* Inline Profile Edit Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="mt-6 pt-6 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Department
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Student ID Token
              </label>
              <input
                type="text"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Academic GPA
              </label>
              <input
                type="text"
                value={formData.gpa}
                onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Peer Study Streak & Badges Showcase */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-700/60">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
              Peer Study Streak Tracker
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Consistency awards earned by attending scheduled study sessions with your squads.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Active Streak</span>
              <span className="text-xl font-black font-mono text-amber-500">
                {user.activeStreakDays} Days 🔥
              </span>
            </div>
            <div className="text-right border-l border-slate-200 dark:border-slate-700 pl-4">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Longest Record</span>
              <span className="text-xl font-black font-mono text-indigo-500">
                {user.longestStreakDays} Days
              </span>
            </div>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {user.badges.map((badge) => (
            <div
              key={badge.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2 hover:border-amber-500/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{badge.icon}</span>
                <span className="text-[10px] font-mono text-slate-400">
                  {badge.unlockedAt}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {badge.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Academic Topics & Focus Interests */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-500" />
          Academic Exam Topics & Focus Interests
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          The Study Squad Matcher uses these interests to calculate group compatibility scores.
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {user.academicInterests.map((interest, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-cyan-400 border border-indigo-200 dark:border-indigo-900/50"
            >
              {interest}
              <button
                onClick={() => handleRemoveInterest(interest)}
                className="text-slate-400 hover:text-rose-500"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>

        <form onSubmit={handleAddInterest} className="flex gap-2 max-w-md pt-2">
          <input
            type="text"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            placeholder="Add subject (e.g. Compiler Design, GATE Math)..."
            className="flex-1 px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm"
          >
            Add
          </button>
        </form>
      </div>

      {/* Joined Study Squads */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-500" />
          Affiliated Study Squads ({joinedSquads.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {joinedSquads.map((sq) => (
            <div
              key={sq.id}
              onClick={() => setSelectedSquad(sq)}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-cyan-400">
                  {sq.subject}
                </span>
                <span className="text-xs font-mono font-bold text-amber-500">
                  🔥 {sq.streakDays}d
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {sq.name}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {sq.designatedRoomName} • {sq.schedule}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
