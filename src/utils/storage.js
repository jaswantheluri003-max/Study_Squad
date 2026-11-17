import roomsSeed from '../data/rooms.json';
import squadsSeed from '../data/squads.json';
import userSeed from '../data/users.json';
import bookingsSeed from '../data/bookings.json';
import notificationsSeed from '../data/notifications.json';
import coursesSeed from '../data/courses.json';

const STORAGE_KEYS = {
  ROOMS: 'studysquad_rooms_v1',
  SQUADS: 'studysquad_squads_v1',
  USER: 'studysquad_user_v1',
  REGISTERED_USERS: 'studysquad_users_list_v1',
  AUTH_SESSION: 'studysquad_auth_session_v1',
  BOOKINGS: 'studysquad_bookings_v1',
  NOTIFICATIONS: 'studysquad_notifications_v1',
  COURSES: 'studysquad_courses_v1',
  THEME: 'studysquad_theme_v1',
};

// Safe JSON parse helper
const load = (key, fallback) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch (err) {
    console.warn(`Error loading ${key} from localStorage:`, err);
    return fallback;
  }
};

const save = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
};

export const storage = {
  // Initialize seed data if not present
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.ROOMS)) {
      save(STORAGE_KEYS.ROOMS, roomsSeed);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SQUADS)) {
      save(STORAGE_KEYS.SQUADS, squadsSeed);
    }
    if (!localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS)) {
      save(STORAGE_KEYS.REGISTERED_USERS, userSeed.registeredUsers || [userSeed.currentUser]);
    }
    if (!localStorage.getItem(STORAGE_KEYS.USER)) {
      save(STORAGE_KEYS.USER, userSeed.currentUser);
    }
    if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
      save(STORAGE_KEYS.BOOKINGS, bookingsSeed);
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      save(STORAGE_KEYS.NOTIFICATIONS, notificationsSeed);
    }
    if (!localStorage.getItem(STORAGE_KEYS.COURSES)) {
      save(STORAGE_KEYS.COURSES, coursesSeed);
    }
  },

  // Reset to seed data
  resetAll() {
    save(STORAGE_KEYS.ROOMS, roomsSeed);
    save(STORAGE_KEYS.SQUADS, squadsSeed);
    save(STORAGE_KEYS.REGISTERED_USERS, userSeed.registeredUsers || [userSeed.currentUser]);
    save(STORAGE_KEYS.USER, userSeed.currentUser);
    save(STORAGE_KEYS.BOOKINGS, bookingsSeed);
    save(STORAGE_KEYS.NOTIFICATIONS, notificationsSeed);
    save(STORAGE_KEYS.COURSES, coursesSeed);
    localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
  },

  // Authentication & Users
  getRegisteredUsers() {
    return load(STORAGE_KEYS.REGISTERED_USERS, userSeed.registeredUsers || [userSeed.currentUser]);
  },
  saveRegisteredUsers(users) {
    save(STORAGE_KEYS.REGISTERED_USERS, users);
  },
  login(email, password) {
    const users = this.getRegisteredUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!found) {
      return { success: false, error: 'No account registered with this email address.' };
    }
    if (found.password && found.password !== password) {
      return { success: false, error: 'Incorrect password. Please verify your credentials.' };
    }
    save(STORAGE_KEYS.USER, found);
    save(STORAGE_KEYS.AUTH_SESSION, { userId: found.id, timestamp: Date.now() });
    return { success: true, user: found };
  },
  register(userData) {
    const users = this.getRegisteredUsers();
    const exists = users.some(u => u.email.toLowerCase() === userData.email.toLowerCase().trim());
    if (exists) {
      return { success: false, error: 'An account with this email address already exists. Please sign in.' };
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: userData.name.trim(),
      email: userData.email.toLowerCase().trim(),
      password: userData.password,
      avatar: userData.avatar || '/default-avatar.png',
      department: userData.department || 'Computer Science & Engineering',
      studentId: userData.studentId || `STU-${Math.floor(1000 + Math.random() * 9000)}`,
      year: userData.year || '1st Year (Freshman)',
      gpa: userData.gpa || '3.75',
      academicInterests: userData.academicInterests || ['Operating Systems', 'Algorithms'],
      activeStreakDays: 1,
      longestStreakDays: 1,
      stats: {
        totalStudyHours: 0,
        sessionsCompleted: 0,
        roomsBooked: 0,
        squadCollaborations: 0
      },
      badges: [
        {
          id: `b-${Date.now()}`,
          title: 'Squad Pioneer',
          icon: '🎓',
          description: 'Created verified Study Squad account',
          unlockedAt: 'Today'
        }
      ],
      joinedSquadIds: [],
      favoriteRoomIds: [],
      recentlyViewedRoomIds: []
    };

    const updated = [newUser, ...users];
    this.saveRegisteredUsers(updated);
    save(STORAGE_KEYS.USER, newUser);
    save(STORAGE_KEYS.AUTH_SESSION, { userId: newUser.id, timestamp: Date.now() });
    return { success: true, user: newUser };
  },
  logout() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    // Switch to guest/default or keep user but logged out state
  },

  // Rooms
  getRooms() {
    return load(STORAGE_KEYS.ROOMS, roomsSeed);
  },
  saveRooms(rooms) {
    save(STORAGE_KEYS.ROOMS, rooms);
  },
  updateRoom(roomId, updates) {
    const rooms = this.getRooms();
    const updated = rooms.map(r => (r.id === roomId ? { ...r, ...updates } : r));
    this.saveRooms(updated);
    return updated;
  },

  // Squads
  getSquads() {
    return load(STORAGE_KEYS.SQUADS, squadsSeed);
  },
  saveSquads(squads) {
    save(STORAGE_KEYS.SQUADS, squads);
  },
  createSquad(newSquad) {
    const squads = this.getSquads();
    const squad = {
      ...newSquad,
      id: `squad-${Date.now()}`,
      streakDays: 1,
      streakBadge: '🌱 1-Day Starter Squad',
      sessionGoals: newSquad.sessionGoals || [
        { id: `g-${Date.now()}-1`, text: 'Set initial session agenda and focus targets', completed: false, assignee: 'All' }
      ],
      notes: newSquad.notes || ['Welcome to the squad! Share quick study tips here.'],
      pomodoro: { focusMinutes: 25, breakMinutes: 5, sessionsCompleted: 0 }
    };
    const updated = [squad, ...squads];
    this.saveSquads(updated);

    // Also update user's joined squads
    const user = this.getUser();
    if (!user.joinedSquadIds.includes(squad.id)) {
      user.joinedSquadIds = [squad.id, ...user.joinedSquadIds];
      this.saveUser(user);
    }
    return squad;
  },
  joinSquad(squadId, member) {
    const squads = this.getSquads();
    const updated = squads.map(s => {
      if (s.id === squadId) {
        const exists = s.members.some(m => m.id === member.id);
        if (!exists && s.members.length < s.maxMembers) {
          const newMembers = [...s.members, member];
          return {
            ...s,
            members: newMembers,
            status: newMembers.length >= s.maxMembers ? 'Full' : 'Open'
          };
        }
      }
      return s;
    });
    this.saveSquads(updated);

    const user = this.getUser();
    if (!user.joinedSquadIds.includes(squadId)) {
      user.joinedSquadIds = [...user.joinedSquadIds, squadId];
      this.saveUser(user);
    }
    return updated;
  },
  leaveSquad(squadId, memberId) {
    const squads = this.getSquads();
    const updated = squads.map(s => {
      if (s.id === squadId) {
        const filtered = s.members.filter(m => m.id !== memberId);
        return {
          ...s,
          members: filtered,
          status: 'Open'
        };
      }
      return s;
    });
    this.saveSquads(updated);

    const user = this.getUser();
    user.joinedSquadIds = user.joinedSquadIds.filter(id => id !== squadId);
    this.saveUser(user);
    return updated;
  },
  toggleGoal(squadId, goalId) {
    const squads = this.getSquads();
    const updated = squads.map(s => {
      if (s.id === squadId) {
        const newGoals = s.sessionGoals.map(g => (g.id === goalId ? { ...g, completed: !g.completed } : g));
        return { ...s, sessionGoals: newGoals };
      }
      return s;
    });
    this.saveSquads(updated);
    return updated;
  },
  addGoal(squadId, goalText, assignee = 'Squad') {
    const squads = this.getSquads();
    const updated = squads.map(s => {
      if (s.id === squadId) {
        const newGoal = { id: `g-${Date.now()}`, text: goalText, completed: false, assignee };
        return { ...s, sessionGoals: [...s.sessionGoals, newGoal] };
      }
      return s;
    });
    this.saveSquads(updated);
    return updated;
  },
  addNote(squadId, noteText) {
    const squads = this.getSquads();
    const updated = squads.map(s => {
      if (s.id === squadId) {
        return { ...s, notes: [...s.notes, noteText] };
      }
      return s;
    });
    this.saveSquads(updated);
    return updated;
  },

  // Bookings & 20-min Holds
  getBookings() {
    return load(STORAGE_KEYS.BOOKINGS, bookingsSeed);
  },
  saveBookings(bookings) {
    save(STORAGE_KEYS.BOOKINGS, bookings);
  },
  createBooking(newBooking) {
    const bookings = this.getBookings();
    const booking = {
      ...newBooking,
      id: `bk-${Date.now()}`,
      qrCode: `SS-${newBooking.roomId.toUpperCase()}-${Date.now().toString().slice(-4)}`
    };
    const updated = [booking, ...bookings];
    this.saveBookings(updated);

    // If hold or immediate reservation, update room status
    this.updateRoom(newBooking.roomId, {
      status: newBooking.type === 'hold' ? 'Reserved' : 'Reserved'
    });

    return booking;
  },
  cancelBooking(bookingId) {
    const bookings = this.getBookings();
    const target = bookings.find(b => b.id === bookingId);
    const updated = bookings.filter(b => b.id !== bookingId);
    this.saveBookings(updated);

    if (target) {
      this.updateRoom(target.roomId, { status: 'Available', activeHold: null });
    }
    return updated;
  },

  // User Profile
  getUser() {
    return load(STORAGE_KEYS.USER, userSeed.currentUser);
  },
  saveUser(user) {
    save(STORAGE_KEYS.USER, user);
  },
  toggleFavoriteRoom(roomId) {
    const user = this.getUser();
    const favs = user.favoriteRoomIds || [];
    const updatedFavs = favs.includes(roomId) ? favs.filter(id => id !== roomId) : [...favs, roomId];
    user.favoriteRoomIds = updatedFavs;
    this.saveUser(user);

    // Also mirror to rooms
    this.updateRoom(roomId, { isFavorite: updatedFavs.includes(roomId) });
    return user;
  },

  // Notifications
  getNotifications() {
    return load(STORAGE_KEYS.NOTIFICATIONS, notificationsSeed);
  },
  saveNotifications(notifs) {
    save(STORAGE_KEYS.NOTIFICATIONS, notifs);
  },
  markNotificationRead(id) {
    const notifs = this.getNotifications();
    const updated = notifs.map(n => (n.id === id ? { ...n, read: true } : n));
    this.saveNotifications(updated);
    return updated;
  },
  markAllNotificationsRead() {
    const notifs = this.getNotifications();
    const updated = notifs.map(n => ({ ...n, read: true }));
    this.saveNotifications(updated);
    return updated;
  },
  addNotification(notification) {
    const notifs = this.getNotifications();
    const item = {
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false,
      ...notification
    };
    const updated = [item, ...notifs];
    this.saveNotifications(updated);
    return updated;
  },

  // Courses
  getCourses() {
    return load(STORAGE_KEYS.COURSES, coursesSeed);
  },

  // Theme
  getTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
  },
  setTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }
};
