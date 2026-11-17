import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';
import { soundEffects } from '../utils/audio';

const RoomRadarContext = createContext(null);

export const RoomRadarProvider = ({ children }) => {
  // Initialize storage seeds
  useEffect(() => {
    storage.init();
  }, []);

  // Theme
  const [theme, setThemeState] = useState(() => storage.getTheme());
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    storage.setTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Navigation
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing' | 'dashboard' | 'rooms' | 'squads' | 'booking' | 'profile' | 'settings'
  const [globalSearch, setGlobalSearch] = useState('');

  // Core Data States
  const [rooms, setRooms] = useState(() => storage.getRooms());
  const [squads, setSquads] = useState(() => storage.getSquads());
  const [user, setUser] = useState(() => storage.getUser());
  const [bookings, setBookings] = useState(() => storage.getBookings());
  const [notifications, setNotifications] = useState(() => storage.getNotifications());
  const [courses] = useState(() => storage.getCourses());

  // Active Modals & Selections
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedSquad, setSelectedSquad] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingRoomTarget, setBookingRoomTarget] = useState(null);
  const [isCreateSquadOpen, setIsCreateSquadOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [isMatcherOpen, setIsMatcherOpen] = useState(false);

  // Toast System
  const [toasts, setToasts] = useState([]);
  const showToast = useCallback((title, message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Active 20-minute Hold state
  // Check if there is an active hold in existing bookings
  const [activeHold, setActiveHold] = useState(() => {
    const bks = storage.getBookings();
    const existingHold = bks.find(b => b.type === 'hold' && b.status === 'active' && !b.confirmed);
    if (existingHold) {
      const now = Date.now();
      const expires = existingHold.expiresAt || (now + 20 * 60 * 1000);
      const remaining = Math.max(0, Math.floor((expires - now) / 1000));
      return {
        bookingId: existingHold.id,
        roomId: existingHold.roomId,
        roomName: existingHold.roomName,
        expiresAt: expires,
        remainingSeconds: remaining > 0 ? remaining : 0,
        confirmed: false
      };
    }
    return null;
  });

  // Pomodoro Squad Timer State
  const [pomodoroState, setPomodoroState] = useState({
    isRunning: false,
    mode: 'focus', // 'focus' | 'break'
    timeLeft: 25 * 60, // 25 minutes
    squadId: 'squad-201',
    sessionsCompleted: 3
  });

  // Tick countdown timer for Active Hold (20-minute en route hold)
  useEffect(() => {
    if (!activeHold || activeHold.confirmed) return;

    const timer = setInterval(() => {
      setActiveHold(prev => {
        if (!prev) return null;
        if (prev.remainingSeconds <= 1) {
          // Hold expired!
          soundEffects.playChime();
          showToast(
            'Room Hold Expired',
            `Your 20-minute hold on ${prev.roomName} has expired and released back to campus pool.`,
            'warning'
          );
          // Release room in storage
          storage.updateRoom(prev.roomId, { status: 'Available', activeHold: null });
          setRooms(storage.getRooms());
          storage.cancelBooking(prev.bookingId);
          setBookings(storage.getBookings());
          storage.addNotification({
            title: 'Room Hold Expired',
            message: `20-minute hold on ${prev.roomName} ended. Room is now available for others.`,
            type: 'hold',
            icon: 'Clock'
          });
          setNotifications(storage.getNotifications());
          return null;
        }
        return {
          ...prev,
          remainingSeconds: prev.remainingSeconds - 1
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeHold, showToast]);

  // Pomodoro timer tick loop
  useEffect(() => {
    if (!pomodoroState.isRunning) return;

    const timer = setInterval(() => {
      setPomodoroState(prev => {
        if (prev.timeLeft <= 1) {
          soundEffects.playChime();
          const nextMode = prev.mode === 'focus' ? 'break' : 'focus';
          const nextTime = nextMode === 'focus' ? 25 * 60 : 5 * 60;
          showToast(
            nextMode === 'break' ? 'Focus Session Complete! 🎉' : 'Break Ended! 🔔',
            nextMode === 'break' ? 'Great work! Take a 5-minute breather.' : 'Time to dive back into deep focus mode.',
            'success'
          );
          return {
            ...prev,
            mode: nextMode,
            timeLeft: nextTime,
            sessionsCompleted: nextMode === 'break' ? prev.sessionsCompleted + 1 : prev.sessionsCompleted
          };
        }
        return {
          ...prev,
          timeLeft: prev.timeLeft - 1
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [pomodoroState.isRunning, showToast]);

  // Simulated IoT PIR Sensor & Noise Meter Event Loop
  // Periodically toggles room occupancy & dB fluctuations to simulate live campus telemetry
  useEffect(() => {
    const telemetryInterval = setInterval(() => {
      setRooms(prevRooms => {
        const updated = prevRooms.map(room => {
          // 40% chance of small sensor fluctuation
          if (Math.random() < 0.4) {
            // Decibel fluctuation within realistic range (+/- 3 dB)
            const baseNoise = room.noiseLevel === 'Whisper Quiet' ? 34 : room.noiseLevel === 'Moderate Study' ? 47 : 64;
            const jitter = Math.floor(Math.random() * 7) - 3;
            const newDb = Math.min(85, Math.max(28, baseNoise + jitter));

            // Small occupancy fluctuation if not strictly reserved by active user hold
            let newOccupied = room.occupiedSeats;
            if (activeHold?.roomId !== room.id && Math.random() < 0.25) {
              const delta = Math.random() > 0.5 ? 1 : -1;
              newOccupied = Math.max(0, Math.min(room.capacity, room.occupiedSeats + delta));
            }

            let newStatus = room.status;
            if (activeHold?.roomId === room.id) {
              newStatus = 'Reserved';
            } else if (newOccupied >= room.capacity) {
              newStatus = 'Occupied';
            } else if (newStatus === 'Occupied' && newOccupied < room.capacity) {
              newStatus = 'Available';
            }

            return {
              ...room,
              noiseDb: newDb,
              occupiedSeats: newOccupied,
              status: newStatus
            };
          }
          return room;
        });

        // Save telemetry state
        storage.saveRooms(updated);
        return updated;
      });
    }, 12000);

    return () => clearInterval(telemetryInterval);
  }, [activeHold]);

  // Actions
  const handleHoldRoom = useCallback((room) => {
    if (activeHold && !activeHold.confirmed) {
      showToast(
        'Active Hold Limit',
        `You already have an active hold on ${activeHold.roomName}. Please confirm arrival or cancel it first.`,
        'warning'
      );
      return false;
    }

    const expiresAt = Date.now() + 20 * 60 * 1000;
    const newBooking = {
      roomId: room.id,
      roomName: room.name,
      building: room.building,
      floor: room.floor,
      date: new Date().toISOString().split('T')[0],
      timeSlot: 'Next 20 Minutes (En Route)',
      type: 'hold',
      status: 'active',
      heldAt: Date.now(),
      expiresAt: expiresAt,
      purpose: 'En route quick study hold',
      squadId: null,
      attendeesCount: 1,
      confirmed: false
    };

    const saved = storage.createBooking(newBooking);
    const holdState = {
      bookingId: saved.id,
      roomId: room.id,
      roomName: room.name,
      expiresAt: expiresAt,
      remainingSeconds: 20 * 60,
      confirmed: false
    };

    setActiveHold(holdState);
    storage.updateRoom(room.id, { status: 'Reserved', activeHold: holdState });
    setRooms(storage.getRooms());
    setBookings(storage.getBookings());

    soundEffects.playTick();
    showToast(
      '20-Minute Hold Secured! ⏱️',
      `Room ${room.name} is temporarily held for you while en route. Confirm upon arrival!`,
      'success'
    );

    storage.addNotification({
      title: 'Hold Active: ' + room.name,
      message: '20-minute countdown active. Complete QR check-in when you reach.',
      type: 'hold',
      icon: 'Clock'
    });
    setNotifications(storage.getNotifications());

    return true;
  }, [activeHold, showToast]);

  const handleConfirmArrival = useCallback(() => {
    if (!activeHold) return;

    soundEffects.playChime();
    const updatedBookings = storage.getBookings().map(b => {
      if (b.id === activeHold.bookingId) {
        return { ...b, confirmed: true, status: 'confirmed' };
      }
      return b;
    });
    storage.saveBookings(updatedBookings);
    setBookings(updatedBookings);

    setActiveHold(prev => (prev ? { ...prev, confirmed: true } : null));

    // Award streak/badge if applicable
    const currentUser = storage.getUser();
    currentUser.stats.roomsBooked += 1;
    storage.saveUser(currentUser);
    setUser(currentUser);

    showToast('Arrival Confirmed! 🎯', 'Study desk checked in successfully. Enjoy your focus session!', 'success');

    // Trigger QR modal for demo presentation
    setQrCodeData({
      roomName: activeHold.roomName,
      code: `RR-${activeHold.roomId.toUpperCase()}-VERIFIED-${Date.now().toString().slice(-4)}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    setIsQrModalOpen(true);
  }, [activeHold, showToast]);

  const handleCancelHold = useCallback(() => {
    if (!activeHold) return;

    storage.cancelBooking(activeHold.bookingId);
    storage.updateRoom(activeHold.roomId, { status: 'Available', activeHold: null });
    setActiveHold(null);
    setRooms(storage.getRooms());
    setBookings(storage.getBookings());

    showToast('Hold Cancelled', 'Room released back to campus availability.', 'info');
  }, [activeHold, showToast]);

  const handleScheduleBooking = useCallback((bookingData) => {
    const saved = storage.createBooking(bookingData);
    setBookings(storage.getBookings());
    setRooms(storage.getRooms());

    // Update user stats
    const currentUser = storage.getUser();
    currentUser.stats.roomsBooked += 1;
    storage.saveUser(currentUser);
    setUser(currentUser);

    soundEffects.playTick();
    showToast(
      'Session Booked Successfully! 📅',
      `Reserved ${bookingData.roomName} for ${bookingData.date} (${bookingData.timeSlot}).`,
      'success'
    );

    storage.addNotification({
      title: 'Booking Confirmed',
      message: `${bookingData.roomName} reserved for ${bookingData.date} at ${bookingData.timeSlot}.`,
      type: 'squad',
      icon: 'Calendar'
    });
    setNotifications(storage.getNotifications());

    return saved;
  }, [showToast]);

  const handleToggleFavorite = useCallback((roomId) => {
    const updatedUser = storage.toggleFavoriteRoom(roomId);
    setUser({ ...updatedUser });
    setRooms(storage.getRooms());
    const isFav = updatedUser.favoriteRoomIds.includes(roomId);
    showToast(
      isFav ? 'Added to Favorites ⭐' : 'Removed from Favorites',
      isFav ? 'Room saved to your quick access list.' : 'Room removed from favorites.',
      'info'
    );
  }, [showToast]);

  const handleJoinSquad = useCallback((squadId) => {
    const currentUser = storage.getUser();
    const newMember = {
      id: currentUser.id,
      name: currentUser.name,
      avatar: currentUser.avatar,
      role: 'Member',
      department: currentUser.department,
      status: 'Active',
      streakDays: currentUser.activeStreakDays
    };

    const updatedSquads = storage.joinSquad(squadId, newMember);
    setSquads(updatedSquads);
    setUser(storage.getUser());

    soundEffects.playChime();
    showToast('Joined Squad! 🤝', 'You are now an active member of this study squad.', 'success');

    storage.addNotification({
      title: 'Squad Joined',
      message: 'You have connected with your peer study squad.',
      type: 'squad',
      icon: 'Users'
    });
    setNotifications(storage.getNotifications());
  }, [showToast]);

  const handleLeaveSquad = useCallback((squadId) => {
    const currentUser = storage.getUser();
    const updatedSquads = storage.leaveSquad(squadId, currentUser.id);
    setSquads(updatedSquads);
    setUser(storage.getUser());

    showToast('Left Squad', 'You have withdrawn from this study group.', 'info');
  }, [showToast]);

  const handleCreateSquad = useCallback((squadForm) => {
    const currentUser = storage.getUser();
    const created = storage.createSquad({
      ...squadForm,
      members: [
        {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          role: 'Squad Leader',
          department: currentUser.department,
          status: 'Active',
          streakDays: currentUser.activeStreakDays
        }
      ]
    });

    setSquads(storage.getSquads());
    setUser(storage.getUser());

    soundEffects.playChime();
    showToast('Study Squad Created! 🚀', `Squad "${created.name}" is now live and accepting peer members.`, 'success');

    storage.addNotification({
      title: 'Squad Created: ' + created.name,
      message: 'Your study squad is published on the campus radar.',
      type: 'squad',
      icon: 'Users'
    });
    setNotifications(storage.getNotifications());

    return created;
  }, [showToast]);

  const handleToggleGoal = useCallback((squadId, goalId) => {
    const updated = storage.toggleGoal(squadId, goalId);
    setSquads(updated);
    if (selectedSquad?.id === squadId) {
      setSelectedSquad(updated.find(s => s.id === squadId));
    }
  }, [selectedSquad]);

  const handleAddGoal = useCallback((squadId, text, assignee) => {
    const updated = storage.addGoal(squadId, text, assignee);
    setSquads(updated);
    if (selectedSquad?.id === squadId) {
      setSelectedSquad(updated.find(s => s.id === squadId));
    }
  }, [selectedSquad]);

  const handleAddNote = useCallback((squadId, text) => {
    const updated = storage.addNote(squadId, text);
    setSquads(updated);
    if (selectedSquad?.id === squadId) {
      setSelectedSquad(updated.find(s => s.id === squadId));
    }
  }, [selectedSquad]);

  const handleLogin = useCallback((email, password) => {
    const res = storage.login(email, password);
    if (res.success) {
      setUser(res.user);
      soundEffects.playChime();
    }
    return res;
  }, []);

  const handleRegister = useCallback((userData) => {
    const res = storage.register(userData);
    if (res.success) {
      setUser(res.user);
      soundEffects.playChime();
    }
    return res;
  }, []);

  const handleLogout = useCallback(() => {
    storage.logout();
    soundEffects.playTick();
    showToast('Signed Out', 'You have been logged out of your session.', 'info');
    setCurrentPage('login');
  }, [showToast]);

  // Unread notification count
  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  return (
    <RoomRadarContext.Provider
      value={{
        theme,
        toggleTheme,
        currentPage,
        setCurrentPage,
        globalSearch,
        setGlobalSearch,
        rooms,
        setRooms,
        squads,
        setSquads,
        user,
        setUser,
        handleLogin,
        handleRegister,
        handleLogout,
        bookings,
        setBookings,
        notifications,
        courses,
        unreadNotifsCount,
        selectedRoom,
        setSelectedRoom,
        selectedSquad,
        setSelectedSquad,
        isBookingModalOpen,
        setIsBookingModalOpen,
        bookingRoomTarget,
        setBookingRoomTarget,
        isCreateSquadOpen,
        setIsCreateSquadOpen,
        isQrModalOpen,
        setIsQrModalOpen,
        qrCodeData,
        setQrCodeData,
        isMatcherOpen,
        setIsMatcherOpen,
        activeHold,
        handleHoldRoom,
        handleConfirmArrival,
        handleCancelHold,
        handleScheduleBooking,
        handleToggleFavorite,
        handleJoinSquad,
        handleLeaveSquad,
        handleCreateSquad,
        handleToggleGoal,
        handleAddGoal,
        handleAddNote,
        toasts,
        showToast,
        removeToast,
        pomodoroState,
        setPomodoroState
      }}
    >
      {children}
    </RoomRadarContext.Provider>
  );
};

export const useRoomRadar = () => {
  const context = useContext(RoomRadarContext);
  if (!context) {
    throw new Error('useRoomRadar must be used within a RoomRadarProvider');
  }
  return context;
};

// Official project hook alias
export const useStudySquad = useRoomRadar;
export const StudySquadContext = RoomRadarContext;
export const StudySquadProvider = RoomRadarProvider;
