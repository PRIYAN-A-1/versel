'use client';

import React from 'react';
import { useFitnessStore } from '@/store/useFitnessStore';
import TrophyRoom from '@/components/Three/TrophyRoom';
import { Trophy, Shield, Zap, Lock, Unlock, Sparkles } from 'lucide-react';

export default function Achievements() {
  const { profile, achievements } = useFitnessStore();
  const nextLevelXp = 500;
  const progressPercent = Math.min((profile.xp % nextLevelXp) / nextLevelXp * 100, 100);

  return (
    <div className="space-y-6">
      {/* Header HUD */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>TROPHY_CABINET</span>
            <span className="text-[10px] bg-neon-purple/20 border border-neon-purple/40 text-neon-purple px-2 py-0.5 rounded font-mono">
              GAMIFIED_LEVELS
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Procedural reward system tracking badges, coins, and levels.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: 3D Shelf Canvas */}
        <div className="lg:col-span-7 glass-panel glass-panel-glow-blue rounded-3xl p-6 min-h-[340px] flex flex-col justify-between overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-neon-blue to-transparent" />
          
          <div className="flex justify-between items-start">
            <div>
              <div className="font-mono text-[9px] text-neon-blue/60 tracking-wider">HOLOGRAPHIC_SHELF</div>
              <h2 className="text-xl font-bold text-white mt-1">Cabinet Showcase</h2>
            </div>
            <div className="text-right">
              <span className="font-mono text-[9px] text-gray-500 block">ROTATION</span>
              <span className="font-mono text-xs text-neon-blue">AUTO_ORBIT</span>
            </div>
          </div>

          {/* 3D Trophies Cabinet */}
          <div className="flex-grow flex items-center justify-center my-2">
            <TrophyRoom />
          </div>

          <div className="flex justify-between text-[10px] font-mono text-gray-500 border-t border-white/5 pt-3">
            <span>TROPHIES: 3 RESOLVED</span>
            <span>SHADOW_BLUR: DYNAMIC</span>
          </div>
        </div>

        {/* Right Side: Player Level Progress card */}
        <div className="lg:col-span-5 glass-panel glass-panel-glow-purple rounded-3xl p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[9px] text-gray-500">BIOMETRIC_REWARD_INDEX</span>
                <h3 className="text-lg font-bold text-white mt-1">Level Diagnostics</h3>
              </div>
            </div>

            {/* Level details */}
            <div className="bg-white/5 border border-white/5 rounded-2xl p-6 text-center space-y-3 relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-neon-purple to-neon-blue flex items-center justify-center text-2xl font-black text-white mx-auto shadow-[0_0_15px_rgba(189,0,255,0.25)]">
                Lvl_{profile.level}
              </div>
              <div>
                <span className="font-mono text-[9px] text-gray-500 block">TOTAL_XP_PROGRESS</span>
                <div className="text-2xl font-extrabold text-white mt-0.5">
                  {profile.xp % nextLevelXp} <span className="text-xs font-normal text-gray-400">/ {nextLevelXp} XP</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-neon-purple" style={{ width: `${progressPercent}%` }} />
                </div>
                <div className="flex justify-between font-mono text-[8px] text-gray-500 pt-0.5">
                  <span>CURRENT_XP: {profile.xp}</span>
                  <span>NEXT: {nextLevelXp - (profile.xp % nextLevelXp)} XP REQUIRED</span>
                </div>
              </div>
            </div>

            {/* Coins */}
            <div className="grid grid-cols-2 gap-3 font-mono">
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="text-[9px] text-gray-500">AETHER_COINS</div>
                <div className="text-xl font-bold text-white mt-1 text-neon-blue">{profile.coins} 🪙</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="text-[9px] text-gray-500">XP_MULTIPLIER</div>
                <div className="text-xl font-bold text-white mt-1 text-neon-emerald">1.25x</div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-2 mt-6 text-xs text-neon-purple font-bold font-mono">
            <Sparkles size={14} className="animate-spin" />
            <span>XP MULTIPLIER STREAM ACTIVATED</span>
          </div>
        </div>

      </div>

      {/* Grid List of Achievements */}
      <div className="space-y-3">
        <span className="font-mono text-[9px] text-gray-500 block">ACHIEVEMENT_MATRICES</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => {
            const isUnlocked = ach.unlockedAt !== null;
            return (
              <div
                key={ach.id}
                className={`glass-panel rounded-2xl p-4 flex gap-4 transition-all ${
                  isUnlocked
                    ? 'border-neon-emerald/30 bg-neon-emerald/5 shadow-[0_0_15px_rgba(0,255,136,0.05)]'
                    : 'border-white/5 opacity-60'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border flex-shrink-0 ${
                  isUnlocked 
                    ? 'bg-neon-emerald/15 border-neon-emerald/40 text-neon-emerald'
                    : 'bg-white/5 border-white/5 text-gray-500'
                }`}>
                  {isUnlocked ? <Unlock size={20} /> : <Lock size={20} />}
                </div>

                <div className="text-left space-y-1">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{ach.title}</span>
                    {isUnlocked && (
                      <span className="text-[8px] bg-neon-emerald/15 border border-neon-emerald/20 px-1 py-0.5 rounded font-mono text-neon-emerald">
                        +{ach.xpReward} XP
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400 leading-snug">{ach.description}</p>
                  <p className="font-mono text-[8px] text-gray-500">
                    {isUnlocked ? `SYNCED: ${new Date(ach.unlockedAt!).toLocaleDateString()}` : 'STATUS: CLOCKED_LOCKED'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
