import React, { useState, useRef, useEffect } from 'react';
import { useRoomRadar } from '../context/RoomRadarContext';
import { HoldCountdownBadge } from './HoldCountdownBadge';
import { UserAvatar } from './UserAvatar';
import {
  Compass,
  LayoutDashboard,
  MapPin,
  Users,
  CalendarCheck,
  User,
  Settings,
  Bell,
  Sun,
  Moon,
  Search,
  CheckCheck,
  Flame,
  Menu,
  X,
  GraduationCap,
  LogIn,
  LogOut,
  UserPlus
} from 'lucide-react';

export const Navbar = () => {
  const {
    theme,
    toggleTheme,
    currentPage,
    setCurrentPage,
    globalSearch,
    setGlobalSearch,
    user,
    handleLogout,
    notifications,
    unreadNotifsCount,
    markNotificationRead,
    markAllNotificationsRead,
    activeHold,
    setIsMatcherOpen
  } = useRoomRadar();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close notifications and user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'landing', label: 'Explore', icon: Compass },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'rooms', label: 'Study Rooms', icon: MapPin },
    { id: 'squads', label: 'Study Squads', icon: Users },
    { id: 'booking', label: 'Bookings', icon: CalendarCheck },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-[#090d16]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo: Study Squad */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setCurrentPage('landing')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
              <div className="absolute inset-0 rounded-xl border border-white/20" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-indigo-900 via-blue-800 to-indigo-600 dark:from-white dark:via-blue-200 dark:to-cyan-300 bg-clip-text text-transparent">
                  Study Squad
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 border border-indigo-500/20">
                  LIVE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium hidden sm:block">
                Campus Spaces & Peer Groups
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Search Bar */}
        <div className="hidden lg:flex items-center flex-1 max-w-xs relative">
          <Search className="w-4 h-4 absolute left-3 text-slate-400" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => {
              setGlobalSearch(e.target.value);
              if (currentPage !== 'rooms' && currentPage !== 'squads') {
                setCurrentPage('rooms');
              }
            }}
            placeholder="Search rooms, subjects, squads..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-800 dark:text-slate-200 placeholder-slate-400"
          />
        </div>

        {/* Right Action Icons & User Profile */}
        <div className="flex items-center gap-2.5">
          {/* Active Hold Live Pill */}
          {activeHold && <HoldCountdownBadge compact={true} />}

          {/* Quick Matcher Button */}
          <button
            onClick={() => setIsMatcherOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-sm transition-all hover:scale-102"
            title="Algorithmically match with peer study groups"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Squad Matcher</span>
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl shadow-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-3 z-50 animate-fade-in">
                <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">Notifications</span>
                    {unreadNotifsCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                        {unreadNotifsCount} new
                      </span>
                    )}
                  </div>
                  {unreadNotifsCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${
                          !notif.read ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                            {notif.title}
                          </h5>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">
                            {notif.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Account / Auth Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:ring-2 hover:ring-indigo-500/40 transition-all"
              title="Student Account & Profile"
            >
              <UserAvatar
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 ring-1 ring-indigo-500/50"
              />
              <div className="hidden sm:flex items-center gap-1.5 text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200 max-w-[90px] truncate">
                  {user.name}
                </span>
                <div className="flex items-center gap-0.5 text-amber-500 font-bold font-mono">
                  <Flame className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{user.activeStreakDays}d</span>
                </div>
              </div>
            </button>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl shadow-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-2 z-50 animate-fade-in text-xs">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="font-bold text-slate-900 dark:text-slate-100 truncate">{user.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-mono font-semibold text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.2 rounded">
                    {user.studentId}
                  </span>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setCurrentPage('profile');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-indigo-500" />
                    Student Profile
                  </button>

                  <button
                    onClick={() => {
                      setCurrentPage('settings');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    Settings
                  </button>

                  <button
                    onClick={() => {
                      setCurrentPage('login');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <LogIn className="w-4 h-4 text-blue-500" />
                    Switch / Sign In
                  </button>

                  <button
                    onClick={() => {
                      setCurrentPage('register');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4 text-emerald-500" />
                    Register New Account
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full px-4 py-2 text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090d16] px-4 pt-3 pb-5 space-y-2 animate-fade-in">
          {/* Mobile Search */}
          <div className="relative mb-3">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                setCurrentPage('rooms');
              }}
              placeholder="Search rooms, subjects..."
              className="w-full pl-9 pr-3 py-2 rounded-lg text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setIsMatcherOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
            >
              <Users className="w-4 h-4" />
              Launch Squad Matcher
            </button>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  setCurrentPage('login');
                  setIsMobileMenuOpen(false);
                }}
                className="py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-center"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setCurrentPage('register');
                  setIsMobileMenuOpen(false);
                }}
                className="py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white text-center"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
