import React, { useState } from 'react';
import { useRoomRadar } from '../../context/RoomRadarContext';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';

export const BookingModal = () => {
  const {
    isBookingModalOpen,
    setIsBookingModalOpen,
    bookingRoomTarget,
    setBookingRoomTarget,
    rooms,
    squads,
    bookings,
    handleScheduleBooking,
    showToast
  } = useRoomRadar();

  const [selectedRoomId, setSelectedRoomId] = useState(() => bookingRoomTarget?.id || rooms[0]?.id);
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('04:00 PM - 06:00 PM');
  const [purpose, setPurpose] = useState('Group finals study & practice problems');
  const [linkedSquadId, setLinkedSquadId] = useState('');
  const [attendeesCount, setAttendeesCount] = useState(4);
  const [conflictError, setConflictError] = useState('');

  if (!isBookingModalOpen) return null;

  const currentRoom = rooms.find(r => r.id === selectedRoomId) || rooms[0];

  const timeSlots = [
    '08:00 AM - 10:00 AM (Early Focus)',
    '10:30 AM - 12:30 PM (Morning Sprint)',
    '02:00 PM - 04:00 PM (Afternoon Core)',
    '04:00 PM - 06:00 PM (Peak Study)',
    '06:30 PM - 08:30 PM (Evening Review)',
    '08:30 PM - 10:30 PM (Late Night Sprint)'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setConflictError('');

    // Check for overlapping bookings for same room, date, and slot
    const hasOverlap = bookings.some(
      b => b.roomId === selectedRoomId && b.date === date && b.timeSlot === timeSlot && b.status !== 'cancelled'
    );

    if (hasOverlap) {
      setConflictError(`Time slot "${timeSlot}" on ${date} for ${currentRoom.name} is already booked! Please select another time or room.`);
      showToast('Booking Conflict', 'This room slot is already reserved by another squad.', 'warning');
      return;
    }

    const squad = squads.find(s => s.id === linkedSquadId);

    handleScheduleBooking({
      roomId: currentRoom.id,
      roomName: currentRoom.name,
      building: currentRoom.building,
      floor: currentRoom.floor,
      date,
      timeSlot,
      type: 'scheduled',
      status: 'confirmed',
      purpose: purpose || (squad ? `${squad.name} Session` : 'Campus Study Session'),
      squadId: linkedSquadId || null,
      attendeesCount: Number(attendeesCount) || 2,
      confirmed: true
    });

    setIsBookingModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500" />
              Schedule Study Space
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Lock in a quiet discussion room or pod for your study squad in advance.
            </p>
          </div>
          <button
            onClick={() => setIsBookingModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {conflictError && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{conflictError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Room Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Target Campus Space
            </label>
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {rooms.map(room => (
                <option key={room.id} value={room.id}>
                  {room.name} ({room.building} • Cap: {room.capacity} • {room.noiseLevel})
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Session Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Time Slot
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {timeSlots.map((slot, i) => (
                  <option key={i} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Link Study Squad (optional) & Attendees */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Link Study Squad (Optional)
              </label>
              <select
                value={linkedSquadId}
                onChange={(e) => {
                  setLinkedSquadId(e.target.value);
                  const squad = squads.find(s => s.id === e.target.value);
                  if (squad) {
                    setPurpose(`${squad.name} Scheduled Meeting`);
                  }
                }}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Solo Session (No Squad)</option>
                {squads.map(sq => (
                  <option key={sq.id} value={sq.id}>
                    {sq.name} ({sq.subject})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Expected Attendees
              </label>
              <input
                type="number"
                min="1"
                max={currentRoom.capacity}
                value={attendeesCount}
                onChange={(e) => setAttendeesCount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Session Purpose */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Study Purpose & Agenda
            </label>
            <input
              type="text"
              required
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. OS Midterm Mock Exam & Deadlock review"
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsBookingModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 transition-all hover:scale-102 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirm Reservation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
