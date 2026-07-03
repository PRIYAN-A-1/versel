'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useFitnessStore } from '@/store/useFitnessStore';
import WaterBottle from '@/components/Three/WaterBottle';
import { Droplet, RotateCcw, Plus, Check } from 'lucide-react';

export default function WaterTracker() {
  const { waterIntakeMl, addWater, resetWater } = useFitnessStore();
  const targetMl = 3000;
  const progressPercent = Math.min((waterIntakeMl / targetMl) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Header HUD */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>HYDRO_MONITOR</span>
            <span className="text-[10px] bg-neon-emerald/20 border border-neon-emerald/40 text-neon-emerald px-2 py-0.5 rounded font-mono">
              FLUID_TELEMETRY
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Procedural liquid simulation tracking cellular water index levels.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: 3D Water Bottle Canvas */}
        <div className="lg:col-span-6 glass-panel glass-panel-glow-emerald rounded-3xl p-6 min-h-[380px] flex flex-col justify-between overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-neon-emerald to-transparent" />
          
          <div className="flex justify-between items-start">
            <div>
              <div className="font-mono text-[9px] text-neon-emerald/60 tracking-wider">FLUID_RENDER_ENGINE</div>
              <h2 className="text-xl font-bold text-white mt-1">Procedural Fluid Cylinder</h2>
            </div>
            <div className="text-right">
              <span className="font-mono text-[9px] text-gray-500 block">SIM_SCALE</span>
              <span className="font-mono text-xs text-white">1.0X</span>
            </div>
          </div>

          {/* 3D Bottle component */}
          <div className="flex-grow flex items-center justify-center my-4">
            <WaterBottle />
          </div>

          <div className="flex justify-between text-[10px] font-mono text-gray-500 border-t border-white/5 pt-3">
            <span>BUBBLE_DENSITY: MEDIUM</span>
            <span>RESERVOIR: OPTIMAL</span>
          </div>
        </div>

        {/* Right Side: Hydration controls & Stats */}
        <div className="lg:col-span-6 glass-panel border-white/5 rounded-3xl p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[9px] text-gray-500">CONSUMABLES_LOGGER</span>
                <h3 className="text-lg font-bold text-white mt-1">Record Hydration</h3>
              </div>
              <button
                type="button"
                onClick={resetWater}
                className="font-mono text-[9px] text-gray-400 border border-white/10 hover:border-white/20 bg-white/5 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw size={10} />
                <span>RESET_DAILY</span>
              </button>
            </div>

            {/* Visual HUD progress */}
            <div className="bg-white/5 border border-white/5 rounded-2xl p-6 text-center space-y-2">
              <span className="font-mono text-[9px] text-gray-500">HYDRATION_PROGRESS_RATIO</span>
              <div className="text-4xl font-extrabold text-white tracking-wide holo-text text-neon-emerald">
                {waterIntakeMl} <span className="text-xs font-normal text-gray-400">/ {targetMl} ml</span>
              </div>
              <p className="text-xs text-neon-emerald font-semibold font-mono tracking-wider">
                {Math.round(progressPercent)}% DAILY_COMPLETION
              </p>
              
              <div className="h-2 bg-white/10 rounded-full overflow-hidden mt-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-neon-emerald to-neon-cyan"
                />
              </div>
            </div>

            {/* Quick Logging Buttons */}
            <div className="space-y-3">
              <span className="font-mono text-[9px] text-gray-500 block">INCREMENTAL_FLUIDS</span>
              
              <div className="grid grid-cols-3 gap-3">
                {[
                  { amount: 250, label: 'Cup', icon: '🥛' },
                  { amount: 500, label: 'Flask', icon: '🍶' },
                  { amount: 750, label: 'Sports', icon: '🧪' }
                ].map(fluid => (
                  <button
                    key={fluid.amount}
                    type="button"
                    onClick={() => addWater(fluid.amount)}
                    className="flex flex-col items-center p-4 bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 rounded-2xl transition-all cursor-pointer group active:scale-95"
                  >
                    <span className="text-xl mb-1.5 group-hover:scale-110 transition-all">{fluid.icon}</span>
                    <span className="font-sans text-xs font-bold text-white">+{fluid.amount}ml</span>
                    <span className="font-mono text-[8px] text-gray-500 mt-1 uppercase">{fluid.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between mt-6 text-xs text-gray-400">
            <div className="flex gap-2 text-neon-emerald items-center font-bold font-mono">
              <Check size={14} />
              <span>FLUID_OPTIMUM</span>
            </div>
            <span>Minimizes physiological fatigue index.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
