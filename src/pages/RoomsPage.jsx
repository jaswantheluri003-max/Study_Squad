import React, { useState, useMemo } from 'react';
import { useRoomRadar } from '../context/RoomRadarContext';
import { CampusMapVisualizer } from '../components/CampusMapVisualizer';
import { DecibelMeter } from '../components/DecibelMeter';
import {
  MapPin,
  Search,
  SlidersHorizontal,
  Grid,
  Map as MapIcon,
  Clock,
  Calendar,
  Users,
  Zap,
  Star,
  Heart,
  Volume2,
  CheckCircle2,
  X,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export const RoomsPage = () => {
  const {
    rooms,
    setSelectedRoom,
    handleHoldRoom,
    handleToggleFavorite,
    setIsBookingModalOpen,
    setBookingRoomTarget,
    activeHold,
    globalSearch,
    setGlobalSearch
  } = useRoomRadar();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'
  const [selectedBuilding, setSelectedBuilding] = useState('All');
  const [selectedCapacity, setSelectedCapacity] = useState('All');
  const [selectedNoise, setSelectedNoise] = useState('All');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortBy, setSortBy] = useState('available'); // 'available' | 'rating' | 'capacity' | 'noise'

  const allAmenities = [
    'Whiteboard',
    'Power Sockets',
    'Silent Zone',
    'Group Discussion Friendly',
    'Dual Monitors',
    'WiFi 6',
    'Projector',
    'Air Conditioning',
    'Standing Desk'
  ];

  const buildings = ['All', 'Central Library', 'Engineering Block', 'Student Center', 'Science Annex'];

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  // Filter & Sort Logic
  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      // Global / text search
      if (globalSearch) {
        const query = globalSearch.toLowerCase();
        const matchesName = room.name.toLowerCase().includes(query);
        const matchesBuilding = room.building.toLowerCase().includes(query);
        const matchesFacility = room.facilities.some(f => f.toLowerCase().includes(query));
        const matchesDescription = room.description.toLowerCase().includes(query);
        if (!matchesName && !matchesBuilding && !matchesFacility && !matchesDescription) {
          return false;
        }
      }

      // Building filter
      if (selectedBuilding !== 'All' && room.building !== selectedBuilding) {
        return false;
      }

      // Capacity filter
      if (selectedCapacity === 'Solo (1-2)' && (room.capacity < 1 || room.capacity > 2)) return false;
      if (selectedCapacity === 'Small Squad (3-6)' && (room.capacity < 3 || room.capacity > 6)) return false;
      if (selectedCapacity === 'Large Group (7+)' && room.capacity < 7) return false;

      // Noise filter
      if (selectedNoise !== 'All' && room.noiseLevel !== selectedNoise) {
        return false;
      }

      // Amenities filter
      if (selectedAmenities.length > 0) {
        const hasAll = selectedAmenities.every(a => room.facilities.includes(a));
        if (!hasAll) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'available') {
        const aAvail = a.status === 'Available' ? 1 : 0;
        const bAvail = b.status === 'Available' ? 1 : 0;
        return bAvail - aAvail;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'capacity') {
        return b.capacity - a.capacity;
      }
      if (sortBy === 'noise') {
        return a.noiseDb - b.noiseDb;
      }
      return 0;
    });
  }, [rooms, globalSearch, selectedBuilding, selectedCapacity, selectedNoise, selectedAmenities, sortBy]);

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <MapPin className="w-6 h-6 text-indigo-600 dark:text-cyan-400" />
            Find Campus Study Rooms
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time library room occupancy, acoustic telemetry, and 20-minute en route holds.
          </p>
        </div>

        {/* View Mode Switcher (Grid vs Interactive Map) */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Grid className="w-4 h-4" />
            Grid View ({filteredRooms.length})
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'map'
                ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            Interactive Campus Map
          </button>
        </div>
      </div>

      {/* If Map View is chosen, display Interactive Campus Map at top */}
      {viewMode === 'map' && (
        <div className="animate-fade-in">
          <CampusMapVisualizer />
        </div>
      )}

      {/* Filters Toolbar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* Search & Sort Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Filter by room name, building, whiteboard, or quiet zone..."
              className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {globalSearch && (
              <button
                onClick={() => setGlobalSearch('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500 whitespace-nowrap hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium w-full sm:w-auto"
            >
              <option value="available">Availability First</option>
              <option value="rating">Top Rated</option>
              <option value="capacity">Largest Capacity</option>
              <option value="noise">Quiet Level (Lowest dB)</option>
            </select>
          </div>
        </div>

        {/* Building, Capacity & Noise Level Filter Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-700/60">
          {/* Building */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Building Facility
            </label>
            <select
              value={selectedBuilding}
              onChange={(e) => setSelectedBuilding(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium"
            >
              {buildings.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Space Capacity
            </label>
            <select
              value={selectedCapacity}
              onChange={(e) => setSelectedCapacity(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value="All">All Capacities</option>
              <option value="Solo (1-2)">Solo (1-2 Desks)</option>
              <option value="Small Squad (3-6)">Small Squad (3-6 Seats)</option>
              <option value="Large Group (7+)">Large Group (7+ Seats)</option>
            </select>
          </div>

          {/* Noise Level */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Noise Tolerance
            </label>
            <select
              value={selectedNoise}
              onChange={(e) => setSelectedNoise(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value="All">All Noise Levels</option>
              <option value="Whisper Quiet">Whisper Quiet (&lt; 40 dB)</option>
              <option value="Moderate Study">Moderate Study (40 - 55 dB)</option>
              <option value="Active Discussion">Active Discussion (55+ dB)</option>
            </select>
          </div>
        </div>

        {/* Learning Amenities Toggle Chips */}
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Filter by Learning Amenities:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {allAmenities.map((amenity) => {
              const active = selectedAmenities.includes(amenity);
              return (
                <button
                  key={amenity}
                  onClick={() => toggleAmenity(amenity)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    active
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {active ? '✓ ' : '+ '}
                  {amenity}
                </button>
              );
            })}
            {selectedAmenities.length > 0 && (
              <button
                onClick={() => setSelectedAmenities([])}
                className="text-xs text-rose-500 hover:underline px-2 py-1"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Rooms Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.length === 0 ? (
          <div className="col-span-full py-16 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8 space-y-3">
            <MapPin className="w-10 h-10 mx-auto text-slate-400" />
            <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">
              No matching campus spaces found
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your building, capacity, or amenity filters to discover more open desks.
            </p>
            <button
              onClick={() => {
                setGlobalSearch('');
                setSelectedBuilding('All');
                setSelectedCapacity('All');
                setSelectedNoise('All');
                setSelectedAmenities([]);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredRooms.map((room) => {
            const isHeld = activeHold?.roomId === room.id;
            const isAvailable = room.status === 'Available' || isHeld;
            const availableDesks = Math.max(0, room.capacity - room.occupiedSeats);

            return (
              <div
                key={room.id}
                className="group rounded-3xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image Card Header */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isHeld
                          ? 'bg-amber-500 text-white animate-pulse'
                          : isAvailable
                          ? 'bg-emerald-500 text-white'
                          : room.status === 'Reserved'
                          ? 'bg-amber-500 text-white'
                          : 'bg-rose-500 text-white'
                      }`}>
                        {isHeld ? 'Active Hold (20m)' : room.status}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(room.id);
                        }}
                        className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
                        title="Save to favorites"
                      >
                        <Heart className={`w-4 h-4 ${room.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                      </button>
                    </div>

                    {/* Bottom Image Overlay */}
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <div className="flex items-center gap-1.5 text-xs text-cyan-300 font-semibold mb-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{room.building} • {room.floor}</span>
                      </div>
                      <h3 className="text-base font-extrabold leading-tight truncate">
                        {room.name}
                      </h3>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 space-y-4">
                    {/* Live Occupancy Meter */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-indigo-500" />
                          Live Desks
                        </span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          {availableDesks} of {room.capacity} Available
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            availableDesks === 0 ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${(room.occupiedSeats / room.capacity) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Decibel Meter */}
                    <DecibelMeter db={room.noiseDb} level={room.noiseLevel} />

                    {/* Facilities Chips */}
                    <div className="flex flex-wrap gap-1">
                      {room.facilities.slice(0, 4).map((f, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/40"
                        >
                          {f}
                        </span>
                      ))}
                      {room.facilities.length > 4 && (
                        <span className="text-[10px] text-slate-400 py-0.5">
                          +{room.facilities.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedRoom(room)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    View Details
                  </button>

                  <button
                    disabled={!isAvailable && !isHeld}
                    onClick={() => handleHoldRoom(room)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition-all hover:scale-102 flex items-center justify-center gap-1 ${
                      isHeld
                        ? 'bg-amber-600 hover:bg-amber-500'
                        : isAvailable
                        ? 'bg-indigo-600 hover:bg-indigo-500'
                        : 'bg-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    {isHeld ? 'Active Hold' : '20-Min Hold'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
