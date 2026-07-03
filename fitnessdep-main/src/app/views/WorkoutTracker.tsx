'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFitnessStore } from '@/store/useFitnessStore';
import { 
  Dumbbell, Flame, Clock, Play, Square, Plus, 
  Trash, Check, Music, Shield, Camera, RotateCcw 
} from 'lucide-react';

const CATEGORIES = [
  { id: 'Strength', name: 'Strength', icon: '🏋️‍♂️' },
  { id: 'Cardio', name: 'Cardio', icon: '🏃‍♂️' },
  { id: 'HIIT', name: 'HIIT', icon: '⚡' },
  { id: 'Yoga', name: 'Yoga', icon: '🧘‍♂️' }
];

export default function WorkoutTracker() {
  const { 
    workouts, activeWorkout, startWorkout, updateWorkoutTimer,
    addExerciseToActiveWorkout, addSetToExercise, toggleSetCompleted,
    completeActiveWorkout, cancelActiveWorkout 
  } = useFitnessStore();

  const [selectedCategory, setSelectedCategory] = useState('Strength');
  const [exerciseInput, setExerciseInput] = useState('');
  const [useCamera, setUseCamera] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const skeletonRef = useRef<HTMLCanvasElement>(null);
  const audioVisualizerRef = useRef<HTMLCanvasElement>(null);

  // Active workout timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeWorkout?.inProgress) {
      const startTime = Date.now() - (activeWorkout.duration * 1000);
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        updateWorkoutTimer(elapsed);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeWorkout?.inProgress, updateWorkoutTimer]);

  // Audio Visualizer loop
  useEffect(() => {
    if (!activeWorkout?.inProgress || !audioVisualizerRef.current) return;
    const canvas = audioVisualizerRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#bd00ff';
      const barCount = 18;
      const barWidth = 3;
      const gap = 3;

      for (let i = 0; i < barCount; i++) {
        // Generate random rhythmic heights
        const height = 5 + Math.abs(Math.sin(phase + i * 0.4) * 20) + Math.random() * 5;
        const x = i * (barWidth + gap);
        ctx.fillRect(x, canvas.height - height, barWidth, height);
      }
      phase += 0.15;
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(animId);
  }, [activeWorkout?.inProgress]);

  // Video feed + AI Form Overlay loop
  useEffect(() => {
    let stream: MediaStream | null = null;
    let animId: number;

    const startCamera = async () => {
      if (useCamera && videoRef.current) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(e => console.log('Camera play error:', e));
          }
          drawSkeleton();
        } catch (err) {
          console.log('Error opening camera:', err);
        }
      }
    };

    const drawSkeleton = () => {
      if (!skeletonRef.current || !videoRef.current) return;
      const canvas = skeletonRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const drawLoop = () => {
        if (!useCamera || !videoRef.current) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(0, 255, 136, 0.6)';
        
        // Render mock holographic biometric skeleton points
        const points = [
          { x: 50, y: 35 },  // Head
          { x: 50, y: 55 },  // Neck
          { x: 35, y: 60 },  // Left Shoulder
          { x: 65, y: 60 },  // Right Shoulder
          { x: 30, y: 85 },  // Left Elbow
          { x: 70, y: 85 },  // Right Elbow
          { x: 25, y: 110 }, // Left Wrist
          { x: 75, y: 110 }  // Right Wrist
        ];

        // Draw connections
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y); // Head to neck
        ctx.lineTo(points[1].x, points[1].y);
        ctx.moveTo(points[2].x, points[2].y); // Shoulder shoulder
        ctx.lineTo(points[3].x, points[3].y);
        ctx.moveTo(points[1].x, points[1].y); // Neck to left shoulder
        ctx.lineTo(points[2].x, points[2].y);
        ctx.moveTo(points[1].x, points[1].y); // Neck to right shoulder
        ctx.lineTo(points[3].x, points[3].y);
        
        // Left arm
        ctx.moveTo(points[2].x, points[2].y);
        ctx.lineTo(points[4].x, points[4].y);
        ctx.lineTo(points[6].x, points[6].y);

        // Right arm
        ctx.moveTo(points[3].x, points[3].y);
        ctx.lineTo(points[5].x, points[5].y);
        ctx.lineTo(points[7].x, points[7].y);
        ctx.stroke();

        // Draw joint circles
        ctx.fillStyle = '#00f0ff';
        points.forEach(pt => {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
          ctx.fill();
        });

        // Overlay posture checker diagnostic text
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#00ff88';
        ctx.font = '7px monospace';
        ctx.fillText('FORM_ALIGNMENT: 98%', 5, 12);
        ctx.fillText('JOINT_DEVIATION: OK', 5, 22);

        animId = requestAnimationFrame(drawLoop);
      };
      drawLoop();
    };

    if (useCamera) {
      startCamera();
    }

    return () => {
      cancelAnimationFrame(animId);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [useCamera]);

  const handleStartWorkout = () => {
    startWorkout(selectedCategory);
  };

  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exerciseInput) return;
    addExerciseToActiveWorkout(exerciseInput);
    setExerciseInput('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>WORKOUT_ENGINE</span>
            <span className="text-[10px] bg-neon-purple/20 border border-neon-purple/40 text-neon-purple px-2 py-0.5 rounded font-mono">
              BIOMETRIC_TRACK
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Logs physical performance data and calculates output calorie counts.</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!activeWorkout?.inProgress ? (
          /* WORKOUT LOBBY CARD */
          <motion.div
            key="lobby"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
          >
            {/* Launch deck */}
            <div className="md:col-span-7 glass-panel glass-panel-glow-purple rounded-3xl p-6 flex flex-col justify-between min-h-[360px]">
              <div className="space-y-4">
                <span className="font-mono text-[9px] text-neon-purple/60 tracking-wider">CHOOSE_ENGINE</span>
                <h2 className="text-2xl font-bold text-white leading-none">Compile Active Session</h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex flex-col items-center py-4 rounded-2xl border transition-all cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-neon-purple/10 border-neon-purple text-white shadow-[0_0_15px_rgba(189,0,255,0.15)]'
                          : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/10 hover:text-white'
                      }`}
                    >
                      <span className="text-2xl mb-1.5">{cat.icon}</span>
                      <span className="font-sans text-xs font-semibold">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                  <div className="flex gap-2 text-neon-emerald items-center text-xs font-bold font-mono">
                    <Shield size={12} />
                    <span>POSTURE_MONITORING_READY</span>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-snug">
                    Turn on the optical scanner during active sequences. AI will cross-verify joint positioning coordinates.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleStartWorkout}
                  className="w-full bg-gradient-to-r from-neon-purple to-neon-blue text-white py-4 rounded-2xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(189,0,255,0.25)] flex items-center justify-center gap-2 hover:opacity-90 active:scale-95"
                >
                  <Play size={16} />
                  <span>INITIALIZE_TRAINING_MODULE</span>
                </button>
              </div>
            </div>

            {/* Completed Workouts Log List */}
            <div className="md:col-span-5 glass-panel border-white/5 rounded-3xl p-6 flex flex-col justify-between min-h-[360px]">
              <div>
                <span className="font-mono text-[9px] text-gray-500 tracking-wider">WORKOUT_LOG_HISTORY</span>
                <h3 className="text-lg font-bold text-white mt-1 mb-4">Telemetry Logs</h3>
                
                {workouts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-16 text-gray-500">
                    <Dumbbell size={32} className="text-white/10 mb-2 animate-bounce" />
                    <p className="font-mono text-[10px] text-gray-400">NO_COMPLETED_SECTOR_LOGS</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                    {workouts.map((w, idx) => (
                      <div key={idx} className="bg-white/5 rounded-xl p-3 border border-white/5 flex justify-between items-center">
                        <div>
                          <div className="text-xs font-bold text-white">{w.category} Session</div>
                          <div className="text-[9px] text-gray-500 font-mono mt-1">
                            {w.date} • {w.exercises.length} Exercises
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-neon-purple">{w.caloriesBurned} kcal</div>
                          <div className="text-[9px] text-gray-500 font-mono mt-1">{w.durationMinutes} min</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-[9px] text-gray-500 font-mono border-t border-white/5 pt-4 text-center">
                ACTIVE_RECOVERY: ENGAGED | RECOVERY_INDEX: 82%
              </div>
            </div>
          </motion.div>
        ) : (
          /* ACTIVE TRAINING COCKPIT BUILD */
          <motion.div
            key="cockpit"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Live Stats Counters & Exercises list */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Counters Bar */}
              <div className="grid grid-cols-3 gap-3">
                <div className="glass-panel glass-panel-glow-purple rounded-2xl p-4 text-center">
                  <span className="font-mono text-[9px] text-gray-500">SESSION_TIMER</span>
                  <div className="text-3xl font-extrabold text-white tracking-wide mt-1 text-neon-purple holo-text font-mono">
                    {formatTime(activeWorkout.duration)}
                  </div>
                </div>
                <div className="glass-panel rounded-2xl p-4 text-center border-white/5">
                  <span className="font-mono text-[9px] text-gray-500">ENERGY_DISCHARGE</span>
                  <div className="text-3xl font-extrabold text-white tracking-wide mt-1 text-neon-pink holo-text font-mono">
                    {activeWorkout.caloriesBurned} <span className="text-xs font-normal text-gray-400">kcal</span>
                  </div>
                </div>
                <div className="glass-panel rounded-2xl p-4 text-center border-white/5">
                  <span className="font-mono text-[9px] text-gray-500">EXERCISES_LOGGED</span>
                  <div className="text-3xl font-extrabold text-white tracking-wide mt-1 text-neon-blue holo-text font-mono">
                    {activeWorkout.exercises.length}
                  </div>
                </div>
              </div>

              {/* Workout planner workspace */}
              <div className="glass-panel border-white/5 rounded-3xl p-6 space-y-6 min-h-[300px]">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-white">Logged Drills</h3>
                  
                  {/* Add drill form */}
                  <form onSubmit={handleAddExercise} className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={exerciseInput}
                      onChange={(e) => setExerciseInput(e.target.value)}
                      placeholder="Add exercise name..."
                      className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-neon-purple/50"
                    />
                    <button
                      type="submit"
                      className="bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/40 text-neon-purple px-3.5 rounded-xl flex items-center justify-center transition-all cursor-pointer"
                    >
                      <Plus size={14} />
                    </button>
                  </form>
                </div>

                {activeWorkout.exercises.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-16 text-gray-500">
                    <Dumbbell size={32} className="text-white/10 mb-2" />
                    <p className="text-xs">Drills list is empty. Add Bench Press or Squats to build sets.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
                    {activeWorkout.exercises.map((ex, exIdx) => (
                      <div key={ex.id} className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-bold text-white">{ex.name}</h4>
                          <button
                            type="button"
                            onClick={() => addSetToExercise(exIdx, 10, 20)}
                            className="text-[10px] text-neon-blue border border-neon-blue/30 bg-neon-blue/10 px-2 py-0.5 rounded-lg hover:bg-neon-blue/20 transition-all flex items-center gap-1"
                          >
                            <Plus size={10} />
                            <span>Add Set</span>
                          </button>
                        </div>

                        {/* Sets row */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {ex.sets.map((set, setIdx) => (
                            <button
                              key={setIdx}
                              type="button"
                              onClick={() => toggleSetCompleted(exIdx, setIdx)}
                              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                                set.completed
                                  ? 'bg-neon-emerald/10 border-neon-emerald text-neon-emerald'
                                  : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/10'
                              }`}
                            >
                              <div className="text-[10px] font-mono">SET 0{setIdx + 1}</div>
                              <div className="text-xs font-bold text-white mt-0.5">
                                {set.reps} reps @ {set.weight}kg
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel: Holographic Camera Check & Music HUD */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Posture scanner frame */}
              <div className="glass-panel glass-panel-glow-emerald rounded-3xl p-4 flex flex-col justify-between min-h-[220px] relative overflow-hidden">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-[9px] text-neon-emerald/60 tracking-wider">OPTICAL_ALIGMENT</span>
                  <button
                    type="button"
                    onClick={() => setUseCamera(!useCamera)}
                    className={`font-mono text-[9px] border px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all ${
                      useCamera
                        ? 'border-neon-emerald bg-neon-emerald/10 text-neon-emerald'
                        : 'border-white/20 text-gray-400 hover:border-white/30'
                    }`}
                  >
                    <Camera size={10} />
                    <span>{useCamera ? 'SHUTDOWN' : 'ACTIVATE'}</span>
                  </button>
                </div>

                {/* Camera viewport simulation */}
                <div className="h-32 bg-black/40 rounded-2xl relative overflow-hidden flex items-center justify-center border border-white/5">
                  {useCamera ? (
                    <>
                      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover scale-x-[-1]" />
                      <canvas ref={skeletonRef} width="100" height="150" className="absolute inset-0 w-full h-full z-10 pointer-events-none" />
                    </>
                  ) : (
                    <div className="text-center space-y-2 text-gray-500">
                      <Camera size={24} className="mx-auto text-white/10" />
                      <p className="text-[9px] font-mono uppercase tracking-widest text-gray-400">CAMERA_FEED_INACTIVE</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Music Widget */}
              <div className="glass-panel border-white/5 rounded-3xl p-5 space-y-4 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[9px] text-gray-500">AUDIO_SYNAPSE</span>
                  <Music size={14} className="text-neon-purple animate-bounce" />
                </div>
                
                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-neon-purple to-neon-blue flex items-center justify-center font-bold text-white text-xs shadow-md">
                    OS
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white leading-tight">Cyberbeats Protocol</div>
                    <div className="text-[9px] text-gray-400 font-mono mt-0.5 leading-none">AETHER System Audio - Track 04</div>
                  </div>
                </div>

                {/* Visualizer bars */}
                <div className="flex justify-between items-end h-8 px-2">
                  <canvas ref={audioVisualizerRef} width="108" height="32" className="w-full h-full" />
                </div>
              </div>

              {/* Termination Actions */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={cancelActiveWorkout}
                  className="bg-white/5 hover:bg-white/10 text-gray-400 border border-white/10 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Square size={12} />
                  <span>ABORT</span>
                </button>
                <button
                  type="button"
                  onClick={completeActiveWorkout}
                  className="bg-gradient-to-r from-neon-emerald to-neon-cyan text-white py-3 rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,255,136,0.15)] flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Check size={12} />
                  <span>SYNC_LOGS</span>
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
