import React, { useState } from 'react';
import { useRoomRadar } from '../context/RoomRadarContext';
import { storage } from '../utils/storage';
import {
  Settings,
  Sun,
  Moon,
  Bell,
  Volume2,
  Radio,
  RotateCcw,
  CheckCircle2,
  Shield,
  Smartphone,
  Save
} from 'lucide-react';

export const SettingsPage = () => {
  const { theme, toggleTheme, user, showToast } = useRoomRadar();

  const [holdAlerts, setHoldAlerts] = useState(true);
  const [squadAlerts, setSquadAlerts] = useState(true);
  const [soundChimes, setSoundChimes] = useState(true);
  const [liveSensors, setLiveSensors] = useState(true);

  const handleResetData = () => {
    if (window.confirm('Reset all demo data back to clean campus seed state? This restores all 12 rooms, 8 study squads, and sample bookings.')) {
      storage.resetAll();
      showToast('Demo Data Restored', 'All rooms, squads, and schedules reloaded from seed JSON.', 'success');
      setTimeout(() => {
        window.location.reload();
      }, 700);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-indigo-600 dark:text-cyan-400" />
          Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize Study Squad appearance, notification chimes, and live IoT sensor simulation.
        </p>
      </div>

      {/* Theme Appearance Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          {theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
          Interface Theme
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Choose between deep dark mode or modern clean light mode.
        </p>

        <div className="grid grid-cols-2 gap-4 max-w-sm pt-2">
          <button
            onClick={() => theme === 'light' && toggleTheme()}
            className={`p-4 rounded-2xl border text-left space-y-2 transition-all ${
              theme === 'dark'
                ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-md'
                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <Moon className="w-5 h-5 text-indigo-400" />
              {theme === 'dark' && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
            </div>
            <div className="text-sm font-bold">Dark Mode</div>
            <p className="text-[11px] text-slate-400">SaaS midnight indigo aesthetic</p>
          </button>

          <button
            onClick={() => theme === 'dark' && toggleTheme()}
            className={`p-4 rounded-2xl border text-left space-y-2 transition-all ${
              theme === 'light'
                ? 'border-indigo-500 bg-indigo-50 text-indigo-900 shadow-md'
                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <Sun className="w-5 h-5 text-amber-500" />
              {theme === 'light' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
            </div>
            <div className="text-sm font-bold">Light Mode</div>
            <p className="text-[11px] text-slate-500">Crisp high-contrast study style</p>
          </button>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-indigo-500" />
          Notification & Audio Chimes
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
          <div className="py-3.5 flex items-center justify-between">
            <div>
              <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                20-Minute Hold Expiry Warning
              </h5>
              <p className="text-[11px] text-slate-500">
                Receive warnings at 5 mins and 1 min before an en route room hold expires.
              </p>
            </div>
            <input
              type="checkbox"
              checked={holdAlerts}
              onChange={(e) => setHoldAlerts(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded"
            />
          </div>

          <div className="py-3.5 flex items-center justify-between">
            <div>
              <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Study Squad Activity Alerts
              </h5>
              <p className="text-[11px] text-slate-500">
                Notify when a peer joins your squad, completes a target goal, or reserves a room.
              </p>
            </div>
            <input
              type="checkbox"
              checked={squadAlerts}
              onChange={(e) => setSquadAlerts(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded"
            />
          </div>

          <div className="py-3.5 flex items-center justify-between">
            <div>
              <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Web Audio Pomodoro Chimes
              </h5>
              <p className="text-[11px] text-slate-500">
                Play synthesized harmonic chimes on 25-minute Pomodoro sprint transitions.
              </p>
            </div>
            <input
              type="checkbox"
              checked={soundChimes}
              onChange={(e) => setSoundChimes(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded"
            />
          </div>
        </div>
      </div>

      {/* Live Campus Sensor Simulation */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Radio className="w-5 h-5 text-cyan-400" />
          Campus IoT Telemetry Simulation
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Simulates live PIR occupancy sensors and acoustic sound decibel meters across campus wings.
        </p>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Live Mock Event Loop
            </span>
            <p className="text-[11px] text-slate-400">
              Dynamically toggles room occupancy and fluctuates dB readings every 12 seconds.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            Running Active
          </span>
        </div>
      </div>

      {/* Data Management & Seed Reset */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <RotateCcw className="w-5 h-5 text-rose-500" />
          Data Architecture & Reset
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          All data is structured in JSON format (rooms.json, squads.json, users.json, bookings.json) and synchronized with localStorage.
        </p>

        <div className="pt-2">
          <button
            onClick={handleResetData}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Demo Data to Initial Seed State
          </button>
        </div>
      </div>
    </div>
  );
};
