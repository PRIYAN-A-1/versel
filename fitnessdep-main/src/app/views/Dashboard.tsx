'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useFitnessStore } from '@/store/useFitnessStore';
import DashboardRings from '@/components/Three/DashboardRings';
import { 
  Flame, Zap, Droplet, Footprints, 
  Clock, Moon, Heart, Compass, Activity, ShieldCheck 
} from 'lucide-react';

export default function Dashboard() {
  const { 
    profile, stepsCount, waterIntakeMl, sleepHours, 
    heartRateBpm, stressLevel, recoveryScore, oxygenSaturation,
    meals, workouts, setActiveTab 
  } = useFitnessStore();

  const heartWaveRef = useRef<HTMLCanvasElement>(null);

  // Live heart rate canvas pulse animation
  useEffect(() => {
    if (!heartWaveRef.current) return;
    const canvas = heartWaveRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let offset = 0;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 200;
      canvas.height = 50;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#ff007f';
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(255, 0, 127, 0.6)';
      ctx.beginPath();

      const width = canvas.width;
      const height = canvas.height;
      
      for (let x = 0; x < width; x++) {
        // Base sine wave with simulated EKG spike at intervals
        let y = height / 2;
        const ekgInterval = 120; // Distance between heartbeats
        const ekgX = (x + offset) % ekgInterval;
        
        if (ekgX > 40 && ekgX < 60) {
          // Sharp EKG peak sequence
          const factor = (ekgX - 40) / 20; // 0 to 1
          if (factor < 0.25) {
            y -= factor * 4 * 12; // Slight dip
          } else if (factor < 0.5) {
            y += (factor - 0.25) * 4 * 35; // Tall peak
          } else if (factor < 0.75) {
            y -= (factor - 0.5) * 4 * 25; // Sharp trough
          } else {
            y += (factor - 0.75) * 4 * 5; // Recovery
          }
        } else {
          // Flattened resting line with minor noise
          y += Math.sin(x * 0.08 + offset * 0.05) * 1.5;
        }

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
      offset += 1.5; // Controls wave speed
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Compute daily totals
  const calConsumed = meals.reduce((sum, m) => sum + m.calories, 0);
  const proteinConsumed = meals.reduce((sum, m) => sum + m.protein, 0);
  const carbsConsumed = meals.reduce((sum, m) => sum + m.carbs, 0);
  const fatConsumed = meals.reduce((sum, m) => sum + m.fat, 0);
  const workoutMin = workouts.reduce((sum, w) => sum + w.durationMinutes, 0);
  const workoutCal = workouts.reduce((sum, w) => sum + w.caloriesBurned, 0);

  // Cards layout configuration
  const statCards = [
    {
      title: 'STEPS_COUNT',
      value: stepsCount.toLocaleString(),
      target: '10,000 steps',
      icon: <Footprints size={18} />,
      colorClass: 'text-neon-cyan',
      borderClass: 'glass-panel-glow-blue',
      onClick: () => {}
    },
    {
      title: 'HYDRATION_LEVEL',
      value: `${waterIntakeMl} ml`,
      target: '/ 3,000 ml',
      icon: <Droplet size={18} />,
      colorClass: 'text-neon-emerald',
      borderClass: 'glass-panel-glow-emerald',
      onClick: () => setActiveTab('water')
    },
    {
      title: 'EXERCISE_METRIC',
      value: `${workoutMin} min`,
      target: `${workoutCal} kcal burned`,
      icon: <Clock size={18} />,
      colorClass: 'text-neon-purple',
      borderClass: 'glass-panel-glow-purple',
      onClick: () => setActiveTab('workout')
    },
    {
      title: 'SLEEP_TELEMENTRY',
      value: `${sleepHours} hrs`,
      target: 'Rest Restored',
      icon: <Moon size={18} />,
      colorClass: 'text-neon-blue',
      borderClass: 'glass-panel-glow-blue',
      onClick: () => {}
    }
  ];

  return (
    <div className="space-y-6">
      {/* HUD Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>METRIC_INTELLIGENCE</span>
            <span className="text-[10px] bg-neon-purple/20 border border-neon-purple/40 text-neon-purple px-2 py-0.5 rounded font-mono">
              LEVEL_{profile.level}
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Systems are fully operational. Diagnostics loaded.</p>
        </div>

        {/* Profile mini telemetry */}
        <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl px-4 py-2">
          <img
            src={profile.avatar}
            alt="avatar"
            className="w-8 h-8 rounded-full border border-neon-blue/30"
          />
          <div className="text-left font-mono">
            <div className="text-xs font-bold text-white leading-none">{profile.name}</div>
            <div className="text-[10px] text-gray-500 mt-1 flex gap-2">
              <span>XP: {profile.xp}</span>
              <span>COINS: {profile.coins}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: 3D Ring Reactor vs Daily Intake HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: 3D Reactor Canvas */}
        <div className="lg:col-span-7 glass-panel glass-panel-glow-blue rounded-3xl p-6 relative flex flex-col justify-between overflow-hidden min-h-[380px]">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-neon-blue to-transparent" />
          
          <div className="flex justify-between items-start">
            <div>
              <div className="font-mono text-[10px] text-neon-blue/60 tracking-wider">3D_PROGRESS_REACTOR</div>
              <h2 className="text-2xl font-bold text-white mt-1">Telemetry Core</h2>
            </div>
            <div className="text-right font-mono text-[10px] text-gray-500">
              <div>AXIS: R_X | R_Y</div>
              <div>RATE: 60Hz</div>
            </div>
          </div>

          {/* Core canvas container */}
          <div className="flex-grow flex items-center justify-center my-2">
            <DashboardRings />
          </div>

          {/* Quick core metrics */}
          <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-4 text-center">
            <div>
              <div className="text-[10px] font-mono text-gray-500">CALORIC_FILL</div>
              <div className="text-sm font-bold text-neon-blue mt-1">
                {Math.round((calConsumed / 2200) * 100)}%
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-gray-500">STEPS_RATIO</div>
              <div className="text-sm font-bold text-neon-purple mt-1">
                {Math.round((stepsCount / 10000) * 100)}%
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-gray-500">WATER_CAP</div>
              <div className="text-sm font-bold text-neon-emerald mt-1">
                {Math.round((waterIntakeMl / 3000) * 100)}%
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Calories & Macro Explosion Panel */}
        <div className="lg:col-span-5 glass-panel glass-panel-glow-purple rounded-3xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-mono text-[10px] text-neon-purple/60 tracking-wider">MACRO_ALLOCATION</div>
                <h2 className="text-xl font-bold text-white mt-1">Consumables</h2>
              </div>
              <button 
                type="button"
                onClick={() => setActiveTab('nutrition')}
                className="font-mono text-[10px] text-neon-purple border border-neon-purple/40 bg-neon-purple/10 px-2.5 py-1 rounded-lg hover:bg-neon-purple/20 transition-all"
              >
                LOG_MEAL
              </button>
            </div>

            {/* Calorie Progress HUD */}
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center space-y-1 relative">
              <span className="font-mono text-[9px] text-gray-500 block">TOTAL_CALORIES_LOGGED</span>
              <div className="text-4xl font-extrabold text-white tracking-wide holo-text text-neon-purple">
                {calConsumed} <span className="text-xs font-normal text-gray-400">/ 2,200 kcal</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mt-3">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((calConsumed / 2200) * 100, 100)}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-neon-purple to-neon-blue"
                />
              </div>
            </div>

            {/* Macro Meters */}
            <div className="space-y-3.5 pt-2">
              {/* Protein */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neon-blue">PROTEIN</span>
                  <span className="text-white">{Math.round(proteinConsumed)}g / 165g</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-neon-blue rounded-full" 
                    style={{ width: `${Math.min((proteinConsumed / 165) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Carbs */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neon-purple">CARBOHYDRATES</span>
                  <span className="text-white">{Math.round(carbsConsumed)}g / 220g</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-neon-purple rounded-full" 
                    style={{ width: `${Math.min((carbsConsumed / 220) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Fat */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neon-pink">LIPIDS (FAT)</span>
                  <span className="text-white">{Math.round(fatConsumed)}g / 73g</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-neon-pink rounded-full" 
                    style={{ width: `${Math.min((fatConsumed / 73) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between mt-6">
            <div className="flex gap-2 text-neon-emerald items-center text-xs font-bold font-mono">
              <ShieldCheck size={14} />
              <span>DIET_STATUS</span>
            </div>
            <span className="text-xs text-gray-400">BALANCED LOGGING</span>
          </div>
        </div>

      </div>

      {/* Grid: Stat Cards (Steps, Water, Timer, Sleep) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.button
            key={i}
            whileHover={{ y: -4, scale: 1.02 }}
            onClick={card.onClick}
            className={`glass-panel ${card.borderClass} rounded-2xl p-4 text-left flex flex-col justify-between min-h-[120px] transition-all relative overflow-hidden`}
          >
            <div className="flex justify-between items-start w-full">
              <span className="font-mono text-[9px] text-gray-500 tracking-wider">{card.title}</span>
              <span className={card.colorClass}>{card.icon}</span>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-white tracking-wide">{card.value}</div>
              <div className="text-[10px] text-gray-500 font-mono mt-0.5">{card.target}</div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Grid: Biometrics Details (Heart rate wave, Stress, Oxygen, Recovery) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Heart Rate telemetry card */}
        <div className="md:col-span-8 glass-panel glass-panel-glow-pink rounded-3xl p-6 flex flex-col justify-between min-h-[180px]">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-mono text-[10px] text-neon-pink/60 tracking-wider">BIOMETRIC_PULSE</div>
              <h3 className="text-lg font-bold text-white mt-0.5">Heart Telemetry</h3>
            </div>
            <div className="text-right font-mono flex items-center gap-1.5 text-neon-pink">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-pink opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-pink" />
              </span>
              <span className="text-xl font-bold">{heartRateBpm}</span>
              <span className="text-[9px] text-gray-400 font-normal">BPM</span>
            </div>
          </div>

          {/* Animated Wave Canvas */}
          <div className="my-4 flex items-center justify-center bg-white/5 rounded-2xl p-3 border border-white/5">
            <canvas ref={heartWaveRef} className="w-full h-12" />
          </div>

          <div className="flex justify-between text-[10px] font-mono text-gray-500 border-t border-white/5 pt-3">
            <span>ZONE: FAT_BURN</span>
            <span>STABILITY: OPTIMAL</span>
          </div>
        </div>

        {/* Diagnostic parameters grid */}
        <div className="md:col-span-4 grid grid-cols-3 md:grid-cols-1 gap-4">
          {/* Recovery */}
          <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between min-h-[90px] border-white/5">
            <span className="font-mono text-[9px] text-gray-500">RECOVERY_SCORE</span>
            <div className="flex justify-between items-end">
              <span className="text-2xl font-bold text-white">{recoveryScore}%</span>
              <span className="text-[9px] text-neon-emerald font-mono bg-neon-emerald/10 border border-neon-emerald/20 px-1 rounded">EXCELLENT</span>
            </div>
          </div>

          {/* Stress */}
          <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between min-h-[90px] border-white/5">
            <span className="font-mono text-[9px] text-gray-500">STRESS_INDEX</span>
            <div className="flex justify-between items-end">
              <span className="text-2xl font-bold text-white">{stressLevel}%</span>
              <span className="text-[9px] text-neon-blue font-mono bg-neon-blue/10 border border-neon-blue/20 px-1 rounded">LOW_CALM</span>
            </div>
          </div>

          {/* Blood Oxygen */}
          <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between min-h-[90px] border-white/5">
            <span className="font-mono text-[9px] text-gray-500">BLOOD_OXYGEN</span>
            <div className="flex justify-between items-end">
              <span className="text-2xl font-bold text-white">{oxygenSaturation}%</span>
              <span className="text-[9px] text-neon-cyan font-mono bg-neon-cyan/10 border border-neon-cyan/20 px-1 rounded">NORMAL</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
