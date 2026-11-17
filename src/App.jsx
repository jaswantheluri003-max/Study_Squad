import React from 'react';
import { RoomRadarProvider, useRoomRadar } from './context/RoomRadarContext';
import { Navbar } from './components/Navbar';
import { ToastContainer } from './components/ToastContainer';
import { RoomDetailModal } from './components/modals/RoomDetailModal';
import { BookingModal } from './components/modals/BookingModal';
import { SquadWorkspaceModal } from './components/modals/SquadWorkspaceModal';
import { SquadMatcherModal } from './components/modals/SquadMatcherModal';
import { CreateSquadModal } from './components/modals/CreateSquadModal';
import { QrCheckInModal } from './components/modals/QrCheckInModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { RoomsPage } from './pages/RoomsPage';
import { SquadsPage } from './pages/SquadsPage';
import { BookingPage } from './pages/BookingPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

import { GraduationCap, Heart, Shield, Sparkles, BookOpen, ExternalLink } from 'lucide-react';

function AppContent() {
  const { currentPage, setCurrentPage } = useRoomRadar();

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'rooms':
        return <RoomsPage />;
      case 'squads':
        return <SquadsPage />;
      case 'booking':
        return <BookingPage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Top Main Navigation Bar */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {renderPage()}
      </main>

      {/* Global Modals */}
      <RoomDetailModal />
      <BookingModal />
      <SquadWorkspaceModal />
      <SquadMatcherModal />
      <CreateSquadModal />
      <QrCheckInModal />

      {/* Global Toasts */}
      <ToastContainer />

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/60 backdrop-blur-md py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-sm">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200">Study Squad</span>
              <span className="text-[11px] text-slate-400 ml-1.5">• Smart Campus Study Spaces & Peer Groups</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <button onClick={() => setCurrentPage('rooms')} className="hover:text-indigo-600 dark:hover:text-cyan-400">
              Campus Rooms
            </button>
            <button onClick={() => setCurrentPage('squads')} className="hover:text-indigo-600 dark:hover:text-cyan-400">
              Study Squads
            </button>
            <button onClick={() => setCurrentPage('booking')} className="hover:text-indigo-600 dark:hover:text-cyan-400">
              Room Holds
            </button>
            <button onClick={() => setCurrentPage('login')} className="hover:text-indigo-600 dark:hover:text-cyan-400">
              Student Login
            </button>
            <button onClick={() => setCurrentPage('settings')} className="hover:text-indigo-600 dark:hover:text-cyan-400">
              Preferences
            </button>
          </div>

          <div className="text-[11px] text-slate-400">
            Powered by React, Tailwind CSS, LocalStorage & Live Telemetry
          </div>
        </div>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <RoomRadarProvider>
      <AppContent />
    </RoomRadarProvider>
  );
}

export default App;
