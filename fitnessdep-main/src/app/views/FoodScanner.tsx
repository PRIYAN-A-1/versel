'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFitnessStore } from '@/store/useFitnessStore';
import FoodModel from '@/components/Three/FoodModel';
import { Scan, Upload, Mic, Search, ChevronRight, Plus, Check } from 'lucide-react';

const PRESETS = [
  { name: 'Grilled Chicken & Rice', calories: 450, protein: 38, carbs: 42, fat: 9, sugar: 1, fiber: 3, vitamins: ['B3', 'B6', 'Iron'], minerals: ['Zinc', 'Selenium'], category: 'Lunch' as const },
  { name: 'Avocado Egg Toast', calories: 340, protein: 14, carbs: 24, fat: 18, sugar: 2, fiber: 6, vitamins: ['A', 'D', 'E'], minerals: ['Folate', 'Potassium'], category: 'Breakfast' as const },
  { name: 'Whey Protein Shake', calories: 180, protein: 30, carbs: 3, fat: 2, sugar: 0, fiber: 0, vitamins: ['B12', 'B2'], minerals: ['Calcium', 'Sodium'], category: 'Snacks' as const },
  { name: 'Pan Seared Salmon', calories: 510, protein: 42, carbs: 8, fat: 28, sugar: 0, fiber: 2, vitamins: ['D3', 'B12'], minerals: ['Omega3', 'Magnesium'], category: 'Dinner' as const }
];

export default function FoodScanner() {
  const logMeal = useFitnessStore((state) => state.logMeal);
  
  const [activeMode, setActiveMode] = useState<'upload' | 'camera' | 'search' | 'voice'>('search');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<typeof PRESETS[0] | null>(null);
  const [hasAdded, setHasAdded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startScan = (item: typeof PRESETS[0]) => {
    setIsScanning(true);
    setScanResult(null);
    setHasAdded(false);
    
    // Simulate AI scan logic
    setTimeout(() => {
      setIsScanning(false);
      setScanResult(item);
    }, 2800);
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    // Check if query matches preset, otherwise create a mock item
    const matched = PRESETS.find(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const item = matched || {
      name: searchQuery,
      calories: 220 + Math.floor(Math.random() * 250),
      protein: 10 + Math.floor(Math.random() * 25),
      carbs: 15 + Math.floor(Math.random() * 40),
      fat: 5 + Math.floor(Math.random() * 15),
      sugar: Math.floor(Math.random() * 12),
      fiber: Math.floor(Math.random() * 8),
      vitamins: ['B1', 'C'],
      minerals: ['Iron', 'Calcium'],
      category: 'Breakfast' as const
    };
    
    startScan(item);
  };

  const handleAddMeal = () => {
    if (!scanResult) return;
    logMeal({
      name: scanResult.name,
      category: scanResult.category,
      calories: scanResult.calories,
      protein: scanResult.protein,
      carbs: scanResult.carbs,
      fat: scanResult.fat,
      sugar: scanResult.sugar,
      fiber: scanResult.fiber
    });
    setHasAdded(true);
    setTimeout(() => {
      setScanResult(null);
      setHasAdded(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header HUD */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>AI_CALORIE_ANALYSER</span>
            <span className="text-[10px] bg-neon-pink/20 border border-neon-pink/40 text-neon-pink px-2 py-0.5 rounded font-mono">
              MOLECULAR_SCAN
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Scans atomic compounds & calculates macros in real-time.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Terminal: Upload/Inputs & Camera Hologram */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Modes selector */}
          <div className="grid grid-cols-4 gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5">
            {[
              { id: 'search', icon: <Search size={16} />, label: 'Search' },
              { id: 'camera', icon: <Scan size={16} />, label: 'Camera' },
              { id: 'upload', icon: <Upload size={16} />, label: 'Upload' },
              { id: 'voice', icon: <Mic size={16} />, label: 'Voice' }
            ].map(mode => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setActiveMode(mode.id as any)}
                className={`flex flex-col items-center py-2.5 rounded-xl font-mono text-[9px] gap-1 transition-all ${
                  activeMode === mode.id
                    ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-[0_0_10px_rgba(0,240,255,0.15)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {mode.icon}
                <span>{mode.label.toUpperCase()}</span>
              </button>
            ))}
          </div>

          {/* Interactive Input card */}
          <div className="glass-panel glass-panel-glow-blue rounded-3xl p-6 min-h-[300px] flex flex-col justify-between relative overflow-hidden">
            
            {/* 3D Food Model overlay */}
            <div className="absolute inset-0 z-0 opacity-40 flex items-center justify-center pointer-events-none">
              <FoodModel isScanning={isScanning} />
            </div>

            <div className="relative z-10 flex-grow flex flex-col justify-between space-y-6">
              
              {/* Search Interface */}
              {activeMode === 'search' && (
                <div className="space-y-4">
                  <div className="font-mono text-[10px] text-neon-blue/60 tracking-wider">PRESET_COMPILATION</div>
                  <form onSubmit={handleManualSearch} className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-4 pr-12 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue/60 transition-all font-sans text-sm"
                      placeholder="Search food item (e.g. Oatmeal)..."
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1.5 bottom-1.5 px-3 rounded-xl bg-neon-blue/20 hover:bg-neon-blue/30 border border-neon-blue/40 text-neon-blue flex items-center justify-center transition-all"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </form>

                  {/* Preset quick buttons */}
                  <div className="space-y-2 pt-2">
                    <div className="font-mono text-[9px] text-gray-500">QUICK_PRESETS</div>
                    <div className="grid grid-cols-2 gap-2">
                      {PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => startScan(preset)}
                          disabled={isScanning}
                          className="text-left bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl p-3 transition-all cursor-pointer disabled:opacity-50"
                        >
                          <div className="text-xs font-bold text-white leading-snug">{preset.name}</div>
                          <div className="text-[10px] text-gray-500 font-mono mt-0.5">{preset.calories} kcal | {preset.protein}g P</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Camera Simulator */}
              {activeMode === 'camera' && (
                <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
                  <div className="w-16 h-16 rounded-full bg-neon-blue/10 border border-neon-blue/30 text-neon-blue flex items-center justify-center animate-pulse">
                    <Scan size={28} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Live Camera Hologram</h3>
                    <p className="text-xs text-gray-400 mt-1">Point your lens at your meal to initialize analysis.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => startScan(PRESETS[0])}
                    disabled={isScanning}
                    className="bg-neon-blue/20 hover:bg-neon-blue/30 border border-neon-blue/40 text-neon-blue px-6 py-2.5 rounded-2xl text-xs font-bold transition-all disabled:opacity-50"
                  >
                    {isScanning ? 'SCANNING_MATRICES...' : 'INITIALIZE_SCAN'}
                  </button>
                </div>
              )}

              {/* Upload image interface */}
              {activeMode === 'upload' && (
                <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={() => startScan(PRESETS[1])}
                  />
                  <div className="w-16 h-16 rounded-full bg-neon-purple/10 border border-neon-purple/30 text-neon-purple flex items-center justify-center">
                    <Upload size={28} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Static Image Upload</h3>
                    <p className="text-xs text-gray-400 mt-1">Accepts PNG, JPG formats up to 10MB.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isScanning}
                    className="bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/40 text-neon-purple px-6 py-2.5 rounded-2xl text-xs font-bold transition-all"
                  >
                    Select File
                  </button>
                </div>
              )}

              {/* Voice scan interface */}
              {activeMode === 'voice' && (
                <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
                  <div className="w-16 h-16 rounded-full bg-neon-pink/10 border border-neon-pink/30 text-neon-pink flex items-center justify-center animate-ping">
                    <Mic size={28} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Voice Synthesis Receiver</h3>
                    <p className="text-xs text-gray-400 mt-1">Speak clearly (e.g. "Logged avocado toast").</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => startScan(PRESETS[2])}
                    disabled={isScanning}
                    className="bg-neon-pink/20 hover:bg-neon-pink/30 border border-neon-pink/40 text-neon-pink px-6 py-2.5 rounded-2xl text-xs font-bold transition-all"
                  >
                    Listen Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Scan Analysis Results HUD */}
        <div className="lg:col-span-6">
          <AnimatePresence mode="wait">
            {isScanning && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="glass-panel rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[360px] border-neon-blue/20"
              >
                <div className="w-14 h-14 rounded-full border-2 border-neon-blue border-t-transparent animate-spin flex items-center justify-center" />
                <h3 className="font-mono text-xs text-neon-blue font-bold tracking-widest animate-pulse">
                  COMPILING_MOLECULAR_TELMETRY...
                </h3>
                <p className="text-[10px] text-gray-500 font-mono w-2/3">
                  ANALYZING NUTRIENT MASS INDEX. ALIGNING CALORIC DEVIATIONS. ESTIMATING LIPIDS.
                </p>
              </motion.div>
            )}

            {!isScanning && !scanResult && (
              <div className="glass-panel border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center text-gray-500 min-h-[360px]">
                <Scan size={36} className="text-white/10" />
                <p className="font-mono text-xs text-gray-400 mt-3 tracking-widest">AWAITING_INPUT_STREAM</p>
                <p className="text-[10px] text-gray-600 mt-1 font-sans">
                  Select a preset or enter search criteria to compile nutrition vectors.
                </p>
              </div>
            )}

            {!isScanning && scanResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="glass-panel glass-panel-glow-purple rounded-3xl p-6 min-h-[360px] flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-[9px] text-neon-purple/60 tracking-wider">MOLECULES_RESOLVED</span>
                      <h2 className="text-xl font-bold text-white mt-1">{scanResult.name}</h2>
                      <span className="text-[9px] bg-white/5 border border-white/10 text-gray-400 px-2 py-0.5 rounded font-mono mt-2 inline-block">
                        CATEGORY: {scanResult.category.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-gray-500 font-mono block">CALORIES</span>
                      <span className="text-3xl font-extrabold text-white tracking-wide text-neon-purple holo-text">
                        {scanResult.calories}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono block">kcal</span>
                    </div>
                  </div>

                  {/* Macros explosion grid */}
                  <div className="grid grid-cols-3 gap-3 border-t border-white/5 pt-4">
                    <div className="bg-white/5 rounded-xl p-2.5 text-center">
                      <div className="text-[9px] font-mono text-gray-500">PROTEIN</div>
                      <div className="text-base font-bold text-neon-blue mt-1">{scanResult.protein}g</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-2.5 text-center">
                      <div className="text-[9px] font-mono text-gray-500">CARBS</div>
                      <div className="text-base font-bold text-neon-purple mt-1">{scanResult.carbs}g</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-2.5 text-center">
                      <div className="text-[9px] font-mono text-gray-500">LIPIDS (FAT)</div>
                      <div className="text-base font-bold text-neon-pink mt-1">{scanResult.fat}g</div>
                    </div>
                  </div>

                  {/* Micro nutrients detailed analytics lists */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <span className="font-mono text-[9px] text-gray-500">VITAMINS</span>
                      <div className="flex flex-wrap gap-1.5">
                        {scanResult.vitamins.map((vit, i) => (
                          <span key={i} className="text-[9px] font-mono bg-neon-blue/10 border border-neon-blue/20 text-neon-blue px-2 py-0.5 rounded">
                            Vit_{vit}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="font-mono text-[9px] text-gray-500">MINERALS</span>
                      <div className="flex flex-wrap gap-1.5">
                        {scanResult.minerals.map((min, i) => (
                          <span key={i} className="text-[9px] font-mono bg-neon-emerald/10 border border-neon-emerald/20 text-neon-emerald px-2 py-0.5 rounded">
                            {min}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddMeal}
                  disabled={hasAdded}
                  className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 mt-6 ${
                    hasAdded
                      ? 'bg-neon-emerald/20 border border-neon-emerald/40 text-neon-emerald'
                      : 'bg-gradient-to-r from-neon-purple to-neon-blue text-white shadow-[0_0_20px_rgba(189,0,255,0.2)]'
                  }`}
                >
                  {hasAdded ? (
                    <>
                      <Check size={16} />
                      <span>MEAL_SYNCED_SUCCESSFULLY</span>
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      <span>LOG_TO_DAILY_NUTRITION</span>
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
