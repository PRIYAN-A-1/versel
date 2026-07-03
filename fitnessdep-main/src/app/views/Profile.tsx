'use client';

import React from 'react';
import { useFitnessStore } from '@/store/useFitnessStore';
import HumanAvatar from '@/components/Three/HumanAvatar';
import { User, Activity, Dumbbell, Calendar, Heart } from 'lucide-react';

export default function Profile() {
  const { profile } = useFitnessStore();

  const mockTimeline = [
    { date: 'June 20, 2026', weight: 83.2, note: 'Initialized profile parameters' },
    { date: 'June 25, 2026', weight: 82.0, note: 'Cardio cycles calibration' },
    { date: 'July 02, 2026', weight: 81.1, note: 'Active macro synthesis zone' }
  ];

  return (
    <div className="space-y-6">
      {/* Header HUD */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>BIOMETRIC_PROFILE</span>
            <span className="text-[10px] bg-neon-purple/20 border border-neon-purple/40 text-neon-purple px-2 py-0.5 rounded font-mono">
              USER_INDEX
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Procedural humanoid mesh reflecting your real-world dimensions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: 3D Holographic Human Avatar */}
        <div className="lg:col-span-7 glass-panel glass-panel-glow-blue rounded-3xl p-6 min-h-[380px] flex flex-col justify-between overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-neon-blue to-transparent" />
          
          <div className="flex justify-between items-start">
            <div>
              <div className="font-mono text-[9px] text-neon-blue/60 tracking-wider">AVATAR_RENDER_ENGINE</div>
              <h2 className="text-xl font-bold text-white mt-1">Biometric Skeleton</h2>
            </div>
            <div className="text-right">
              <span className="font-mono text-[9px] text-gray-500 block">SENSORS</span>
              <span className="font-mono text-xs text-neon-emerald">SYNCED</span>
            </div>
          </div>

          {/* 3D Human Avatar Component */}
          <div className="flex-grow flex items-center justify-center my-2">
            <HumanAvatar />
          </div>
        </div>

        {/* Right Side: Physiology logs & Timeline */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Physiological Stats */}
          <div className="glass-panel glass-panel-glow-purple rounded-3xl p-6 space-y-4">
            <span className="font-mono text-[9px] text-neon-purple/60 tracking-wider">PHYSIOLOGY_DIAGNOSTICS</span>
            <h3 className="text-lg font-bold text-white">Biometric Vectors</h3>

            <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <span className="text-gray-500">AGE</span>
                <div className="text-base font-bold text-white mt-1">{profile.age} yrs</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <span className="text-gray-500">HEIGHT</span>
                <div className="text-base font-bold text-white mt-1">{profile.height} cm</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <span className="text-gray-500">CURRENT_MASS</span>
                <div className="text-base font-bold text-white mt-1">{profile.weight} kg</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <span className="text-gray-500">TARGET_MASS</span>
                <div className="text-base font-bold text-white mt-1">{profile.targetWeight} kg</div>
              </div>
            </div>
          </div>

          {/* Mass transformation timeline list */}
          <div className="glass-panel border-white/5 rounded-3xl p-6 space-y-4">
            <span className="font-mono text-[9px] text-gray-500 tracking-wider">MASS_TRANSFORMATION_TIMELINE</span>
            <h3 className="text-sm font-bold text-white">Telemetry Vectors</h3>

            <div className="space-y-3">
              {mockTimeline.map((item, idx) => (
                <div key={idx} className="flex gap-4 relative">
                  {/* Timeline bullet line vertical */}
                  {idx < mockTimeline.length - 1 && (
                    <div className="absolute left-2.5 top-6 bottom-0 w-0.5 bg-white/10" />
                  )}
                  <div className="w-5 h-5 rounded-full bg-neon-purple/20 border border-neon-purple/40 text-neon-purple flex items-center justify-center flex-shrink-0 z-10">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-purple" />
                  </div>
                  <div className="text-left space-y-1">
                    <div className="text-xs font-bold text-white flex gap-2 items-center">
                      <span>{item.date}</span>
                      <span className="text-[10px] text-neon-purple font-mono font-bold bg-neon-purple/10 px-1.5 rounded">
                        {item.weight} kg
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
