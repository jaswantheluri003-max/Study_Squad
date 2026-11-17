import React, { useState } from 'react';
import { useRoomRadar } from '../context/RoomRadarContext';
import { DecibelMeter } from './DecibelMeter';
import {
  MapPin,
  Layers,
  Users,
  Compass,
  Zap,
  Volume2,
  Info,
  Maximize2
} from 'lucide-react';

export const CampusMapVisualizer = () => {
  const { rooms, setSelectedRoom, activeHold } = useRoomRadar();
  const [selectedBuilding, setSelectedBuilding] = useState('All');
  const [hoveredRoom, setHoveredRoom] = useState(null);

  const buildings = ['All', 'Central Library', 'Engineering Block', 'Student Center', 'Science Annex'];

  const filteredRooms = selectedBuilding === 'All'
    ? rooms
    : rooms.filter(r => r.building === selectedBuilding);

  return (
    <div className="relative w-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-white overflow-hidden shadow-2xl">
      {/* Top Map Toolbar */}
      <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950/70 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-cyan-400 border border-indigo-500/20">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                Interactive Campus Study Space Map
              </h3>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live spatial floor plan with real-time PIR occupancy sensors & acoustic telemetry
            </p>
          </div>
        </div>

        {/* Building Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {buildings.map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBuilding(b)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedBuilding === b
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Main Architectural Floor Plan Visualizer */}
      <div className="relative w-full h-[520px] sm:h-[580px] bg-[#070b14] overflow-hidden select-none">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(rgba(99, 102, 241, 0.4) 1px, transparent 1px), radial-gradient(rgba(6, 182, 212, 0.2) 1px, #070b14 1px)`,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px'
          }}
        />

        {/* Radar Circular Sweep Scanner Effect */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-[500px] h-[500px] rounded-full border border-indigo-500/10">
            <div className="absolute inset-8 rounded-full border border-indigo-500/10" />
            <div className="absolute inset-20 rounded-full border border-indigo-500/10" />
            <div className="absolute inset-36 rounded-full border border-indigo-500/10" />
            {/* Rotating radar sweep arm */}
            <div className="absolute inset-0 rounded-full animate-radar origin-center bg-gradient-to-tr from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Zone Boundaries / Architectural Room Outlines */}
        <div className="absolute top-8 left-8 border border-indigo-500/20 bg-indigo-950/20 rounded-2xl p-3 pointer-events-none">
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
            WEST SILENT SANCTUARY (LIBRARY FL 2)
          </span>
        </div>

        <div className="absolute top-8 right-8 border border-blue-500/20 bg-blue-950/20 rounded-2xl p-3 pointer-events-none">
          <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">
            ENGINEERING INNOVATION CORE (ENG FL 1-3)
          </span>
        </div>

        <div className="absolute bottom-8 left-16 border border-amber-500/20 bg-amber-950/20 rounded-2xl p-3 pointer-events-none">
          <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">
            STUDENT COMMONS & DISCUSSION LOFTS
          </span>
        </div>

        <div className="absolute bottom-8 right-16 border border-emerald-500/20 bg-emerald-950/20 rounded-2xl p-3 pointer-events-none">
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
            SCIENCE & MODELING LABS
          </span>
        </div>

        {/* Interactive Room Radar Pins */}
        {filteredRooms.map((room) => {
          const isHeld = activeHold?.roomId === room.id;
          const statusColor = isHeld
            ? 'bg-amber-500 ring-amber-400'
            : room.status === 'Available'
            ? 'bg-emerald-500 ring-emerald-400'
            : room.status === 'Reserved'
            ? 'bg-amber-500 ring-amber-400'
            : 'bg-rose-500 ring-rose-400';

          const glowColor = isHeld
            ? 'shadow-[0_0_20px_rgba(245,158,11,0.6)]'
            : room.status === 'Available'
            ? 'shadow-[0_0_20px_rgba(16,185,129,0.5)]'
            : room.status === 'Reserved'
            ? 'shadow-[0_0_20px_rgba(245,158,11,0.5)]'
            : 'shadow-[0_0_15px_rgba(244,63,94,0.4)]';

          return (
            <div
              key={room.id}
              style={{
                left: `${room.mapCoordinates.x}%`,
                top: `${room.mapCoordinates.y}%`
              }}
              onMouseEnter={() => setHoveredRoom(room)}
              onMouseLeave={() => setHoveredRoom(null)}
              onClick={() => setSelectedRoom(room)}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
            >
              {/* Radar Pulsing Rings */}
              {room.status === 'Available' && (
                <div className="absolute -inset-2 rounded-full bg-emerald-500/30 animate-ping pointer-events-none" />
              )}
              {isHeld && (
                <div className="absolute -inset-3 rounded-full bg-amber-500/40 animate-ping pointer-events-none" />
              )}

              {/* Pin Marker Badge */}
              <div
                className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-white/20 bg-slate-900/90 backdrop-blur-md text-white font-medium text-xs transition-all duration-200 group-hover:scale-110 group-hover:z-30 ${glowColor}`}
              >
                <div className={`w-2.5 h-2.5 rounded-full ${statusColor}`} />
                <span className="font-semibold text-[11px] whitespace-nowrap max-w-[110px] truncate">
                  {room.name.split(' ')[0]} {room.name.split(' ')[1] || ''}
                </span>
                <span className="text-[10px] font-mono text-cyan-300 font-bold bg-cyan-950/60 px-1 rounded">
                  {room.capacity - room.occupiedSeats}/{room.capacity}
                </span>
              </div>

              {/* Hover Floating Card */}
              {hoveredRoom?.id === room.id && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3.5 rounded-2xl bg-slate-950/95 border border-slate-700/80 shadow-2xl text-left z-40 animate-fade-in pointer-events-none">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      room.status === 'Available' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {room.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {room.noiseDb} dB ({room.noiseLevel})
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white leading-tight">
                    {room.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {room.building} • {room.floor}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-300 mt-2 pt-2 border-t border-slate-800">
                    <span>Available Desks:</span>
                    <span className="font-mono font-bold text-cyan-400">
                      {room.capacity - room.occupiedSeats} of {room.capacity}
                    </span>
                  </div>
                  <div className="text-[10px] text-indigo-400 font-semibold mt-1">
                    Click to place 20-min hold or schedule →
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend & Telemetry Key Footer */}
      <div className="p-3.5 sm:p-4 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
            <span>Available Desk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_6px_#f59e0b]" />
            <span>Reserved / 20-min Hold</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Fully Occupied</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>Click any room pin to view amenities, noise decibels, or place instant 20-min hold.</span>
        </div>
      </div>
    </div>
  );
};
