'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFitnessStore } from '@/store/useFitnessStore';
import { Shield, Sparkles, User, Target, ChevronRight, Activity } from 'lucide-react';

export default function Onboarding() {
  const completeOnboarding = useFitnessStore((state) => state.completeOnboarding);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: 'Neo Trainee',
    gender: 'Male',
    age: 25,
    weight: 80,
    height: 180,
    targetWeight: 75,
    goal: 'Stay Fit'
  });

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      completeOnboarding(
        formData.name,
        formData.gender,
        formData.age,
        formData.weight,
        formData.height,
        formData.targetWeight
      );
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 min-h-[85vh]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.03)_0%,transparent_60%)] pointer-events-none" />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -15 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="w-full max-w-lg glass-panel glass-panel-glow-blue rounded-3xl p-8 relative overflow-hidden"
        >
          {/* Hologram top scanning light */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-neon-blue to-transparent animate-scan" />

          {/* Steps Indicator */}
          <div className="flex justify-between items-center mb-8">
            <span className="font-mono text-xs text-neon-blue/60 tracking-widest">
              SYSTEM_BOOT: STEP_0{step} / 04
            </span>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i <= step ? 'w-6 bg-neon-blue' : 'w-2 bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* STEP 1: WELCOME & NAME */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-neon-blue/10 border border-neon-blue/30 text-neon-blue">
                  <Sparkles size={24} className="animate-pulse" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-white">Initialize Bio-Link</h1>
                  <p className="text-sm text-gray-400">Sync your metrics with the AETHER operating system.</p>
                </div>
              </div>

              <div className="space-y-2 mt-6">
                <label className="font-mono text-xs text-gray-400 block">TRAINEE_CODENAME</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue/60 transition-all font-sans text-lg"
                  placeholder="Enter your name..."
                />
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <div className="flex gap-2 text-neon-emerald items-center text-sm font-semibold">
                  <Shield size={16} />
                  <span>AI Telemetry Active</span>
                </div>
                <p className="text-xs text-gray-400">
                  Your biometric telemetry is processed locally on-device. The AI coach utilizes sandboxed neural networks.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: GENDER & GOAL */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-neon-purple/10 border border-neon-purple/30 text-neon-purple">
                  <Target size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-white">Target Architecture</h1>
                  <p className="text-sm text-gray-400">Define your physiological classification & primary vector.</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="font-mono text-xs text-gray-400 block">PHYSIOLOGY_CLASSIFICATION</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Male', 'Female', 'Cybernetic'].map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender })}
                      className={`py-3.5 rounded-2xl border transition-all font-medium text-sm ${
                        formData.gender === gender
                          ? 'bg-neon-purple/10 border-neon-purple text-neon-purple shadow-[0_0_15px_rgba(189,0,255,0.2)]'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="font-mono text-xs text-gray-400 block">PRIMARY_GOAL</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Lose Weight', 'Gain Muscle', 'Stay Fit'].map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => setFormData({ ...formData, goal })}
                      className={`py-3.5 rounded-2xl border transition-all font-medium text-xs ${
                        formData.goal === goal
                          ? 'bg-neon-blue/10 border-neon-blue text-neon-blue shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: BIOMETRIC CALIBRATION */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan">
                  <Activity size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-white">Biometric Calibration</h1>
                  <p className="text-sm text-gray-400">Scale dimensions to align physical mass index.</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Age Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-mono text-xs text-gray-400">AGE (YEARS)</span>
                    <span className="text-neon-cyan font-bold">{formData.age} yrs</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="80"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-neon-cyan"
                  />
                </div>

                {/* Weight Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-mono text-xs text-gray-400">CURRENT_MASS</span>
                    <span className="text-neon-cyan font-bold">{formData.weight} kg</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="150"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-neon-cyan"
                  />
                </div>

                {/* Height Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-mono text-xs text-gray-400">HEIGHT_DIMENSION</span>
                    <span className="text-neon-cyan font-bold">{formData.height} cm</span>
                  </div>
                  <input
                    type="range"
                    min="120"
                    max="220"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-neon-cyan"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: TARGET WEIGHT */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-neon-emerald/10 border border-neon-emerald/30 text-neon-emerald">
                  <User size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-white">Target Trajectory</h1>
                  <p className="text-sm text-gray-400">Establish the ultimate physiological coordinates.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-mono text-xs text-gray-400">TARGET_MASS</span>
                    <span className="text-neon-emerald font-bold">{formData.targetWeight} kg</span>
                  </div>
                  <input
                    type="range"
                    min="45"
                    max="140"
                    value={formData.targetWeight}
                    onChange={(e) => setFormData({ ...formData, targetWeight: Number(e.target.value) })}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-neon-emerald"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center mt-6">
                  <p className="text-xs text-gray-400">
                    AETHER will compile a custom calorie threshold of
                  </p>
                  <p className="text-3xl font-extrabold text-white mt-1 holo-text text-neon-emerald tracking-wide">
                    2,200 kcal / Day
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1 font-mono">
                    MACROS: 165g PROTEIN | 220g CARBS | 73g FAT
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Action Buttons */}
          <div className="flex gap-4 mt-10">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 py-3.5 rounded-2xl transition-all border border-white/10 font-semibold text-sm"
              >
                Previous
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              className="flex-2 bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-90 text-white py-3.5 rounded-2xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] flex items-center justify-center gap-2"
            >
              <span>{step === 4 ? 'Complete Initialization' : 'Advance Link'}</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
