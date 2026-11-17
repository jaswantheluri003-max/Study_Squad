import React, { useState } from 'react';
import { useRoomRadar } from '../../context/RoomRadarContext';
import {
  X,
  Users,
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  Target,
  Sparkles
} from 'lucide-react';

export const CreateSquadModal = () => {
  const {
    isCreateSquadOpen,
    setIsCreateSquadOpen,
    rooms,
    courses,
    handleCreateSquad,
    setSelectedSquad
  } = useRoomRadar();

  const [name, setName] = useState('');
  const [subject, setSubject] = useState('Operating Systems');
  const [category, setCategory] = useState('Computer Science');
  const [targetExam, setTargetExam] = useState('End-Sem Finals');
  const [schedule, setSchedule] = useState('Daily 4:00 PM - 6:00 PM');
  const [timeBlock, setTimeBlock] = useState('Afternoon');
  const [maxMembers, setMaxMembers] = useState(4);
  const [designatedRoomId, setDesignatedRoomId] = useState(rooms[0]?.id || 'room-101');
  const [initialGoal, setInitialGoal] = useState('Solve 10 practice questions and review chapter summary');
  const [description, setDescription] = useState('Focused daily collaboration sprint for exam preparation.');

  if (!isCreateSquadOpen) return null;

  const currentRoom = rooms.find(r => r.id === designatedRoomId) || rooms[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const created = handleCreateSquad({
      name: name.trim(),
      subject,
      category,
      targetExam,
      schedule,
      timeBlock,
      maxMembers: Number(maxMembers) || 4,
      status: 'Open',
      designatedRoomId: currentRoom.id,
      designatedRoomName: currentRoom.name,
      description: description.trim(),
      sessionGoals: [
        {
          id: `g-${Date.now()}-1`,
          text: initialGoal || 'Review syllabus and chapter concepts',
          completed: false,
          assignee: 'All'
        }
      ],
      notes: [
        `Designated Room: ${currentRoom.name} (${currentRoom.building})`,
        'Welcome! Keep discussion productive and supportive.'
      ]
    });

    setIsCreateSquadOpen(false);
    setSelectedSquad(created);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-500" />
              Launch New Study Squad
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Assemble serious study peers and secure designated campus room reservations.
            </p>
          </div>
          <button
            onClick={() => setIsCreateSquadOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Squad Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Study Squad Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Distributed Systems Lab Sprint or GATE Math Drillers"
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Subject & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Core Subject / Exam Topic
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Operating Systems"
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Academic Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Engineering">Engineering</option>
                <option value="Competitive Exams">Competitive Exams (GATE, GRE, CAT)</option>
                <option value="Business & Economics">Business & Economics</option>
              </select>
            </div>
          </div>

          {/* Target Exam & Max Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Exam / Milestone
              </label>
              <input
                type="text"
                required
                value={targetExam}
                onChange={(e) => setTargetExam(e.target.value)}
                placeholder="e.g. End-Sem Finals or GATE 2027"
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Max Squad Size (Students)
              </label>
              <select
                value={maxMembers}
                onChange={(e) => setMaxMembers(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="3">3 Students (Intimate focus)</option>
                <option value="4">4 Students (Recommended)</option>
                <option value="6">6 Students (Medium pod)</option>
                <option value="8">8 Students (Large collaborative group)</option>
              </select>
            </div>
          </div>

          {/* Schedule & Time Block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Meeting Schedule (Text)
              </label>
              <input
                type="text"
                required
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                placeholder="e.g. Daily 4:00 PM - 6:00 PM or Mon/Wed 2 PM"
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Discrete Time Block
              </label>
              <select
                value={timeBlock}
                onChange={(e) => setTimeBlock(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Morning">Morning (08:00 AM - 12:00 PM)</option>
                <option value="Afternoon">Afternoon (12:00 PM - 05:00 PM)</option>
                <option value="Evening">Evening (05:00 PM - 09:00 PM)</option>
                <option value="Late Night">Late Night (09:00 PM - 01:00 AM)</option>
              </select>
            </div>
          </div>

          {/* Designated Room */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Designated Campus Meeting Room
            </label>
            <select
              value={designatedRoomId}
              onChange={(e) => setDesignatedRoomId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {rooms.map(room => (
                <option key={room.id} value={room.id}>
                  {room.name} ({room.building} • Cap: {room.capacity})
                </option>
              ))}
            </select>
          </div>

          {/* Initial Focus Goal */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Initial Session Milestone / Target Goal
            </label>
            <input
              type="text"
              required
              value={initialGoal}
              onChange={(e) => setInitialGoal(e.target.value)}
              placeholder="e.g. Master Page Replacement algorithms and solve 5 quiz problems"
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Squad Mission Description
            </label>
            <textarea
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateSquadOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 transition-all hover:scale-102 flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              Publish Squad on Radar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
