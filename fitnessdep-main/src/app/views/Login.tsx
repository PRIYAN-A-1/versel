'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useFitnessStore } from '@/store/useFitnessStore';
import { Fingerprint, Mail, Lock, ShieldCheck, Sparkles } from 'lucide-react';

export default function Login() {
  const login = useFitnessStore((state) => state.login);
  const [email, setEmail] = useState('neo.trainee@aether.io');
  const [password, setPassword] = useState('password123');
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);

  // Animate Fingerprint scanner when clicked
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isScanning && scanProgress < 100) {
      interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setScanCompleted(true);
            setTimeout(() => {
              login(email);
            }, 600);
            return 100;
          }
          return prev + 4;
        });
      }, 50);
    } else if (!isScanning) {
      setScanProgress(0);
    }

    return () => clearInterval(interval);
  }, [isScanning, scanProgress, login, email]);

  const handleTraditionalLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 min-h-[85vh] relative">
      {/* Moving stars background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(189,0,255,0.03)_0%,transparent_60%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 20 }}
        className="w-full max-w-md glass-panel glass-panel-glow-purple rounded-3xl p-8 relative overflow-hidden"
      >
        {/* Glowing laser swipe */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-neon-purple to-transparent animate-scan" />

        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-purple animate-pulse" />
            <span className="font-mono text-[10px] text-neon-purple tracking-widest">AETHER_CORE_LINK</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight holo-text text-neon-purple">
            A E T H E R
          </h1>
          <p className="text-xs text-gray-400 mt-1">Biometric Operating System Interface</p>
        </div>

        {scanCompleted ? (
          /* SCAN SUCCESS STATE */
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center space-y-4"
          >
            <div className="w-20 h-20 rounded-full bg-neon-emerald/10 border-2 border-neon-emerald flex items-center justify-center text-neon-emerald shadow-[0_0_30px_rgba(0,255,136,0.3)] animate-bounce">
              <ShieldCheck size={40} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Biometrics Verified</h2>
              <p className="text-xs text-gray-400 mt-1">Initializing neurological connection streams...</p>
            </div>
            <div className="flex gap-1.5 text-neon-emerald items-center justify-center font-mono text-[10px]">
              <Sparkles size={12} className="animate-spin" />
              <span>SYNCING...</span>
            </div>
          </motion.div>
        ) : (
          /* TRADITIONAL FORM */
          <form onSubmit={handleTraditionalLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-gray-400">TRAINEE_EMAIL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-3.5 text-white focus:outline-none focus:border-neon-purple/50 transition-all font-sans"
                    placeholder="name@email.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-gray-400">ACCESS_PASSKEY</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <Lock size={16} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-3.5 text-white focus:outline-none focus:border-neon-purple/50 transition-all font-sans"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-white/10 hover:bg-white/15 text-white border border-white/15 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 active:scale-[0.98]"
            >
              Sign In with Passkey
            </button>

            {/* Futuristic Separator */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-white/5" />
              <span className="flex-shrink mx-4 font-mono text-[9px] text-gray-500 tracking-wider">
                OR BIOMETRIC SCAN
              </span>
              <div className="flex-grow border-t border-white/5" />
            </div>

            {/* Fingerprint Scanner Interactive Widget */}
            <div className="flex flex-col items-center space-y-3 py-2">
              <button
                type="button"
                onMouseDown={() => setIsScanning(true)}
                onMouseUp={() => setIsScanning(false)}
                onMouseLeave={() => setIsScanning(false)}
                onTouchStart={() => setIsScanning(true)}
                onTouchEnd={() => setIsScanning(false)}
                className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 border ${
                  isScanning
                    ? 'border-neon-purple bg-neon-purple/10 shadow-[0_0_30px_rgba(189,0,255,0.3)] scale-[1.05]'
                    : 'border-white/15 bg-white/5 hover:border-white/25 active:scale-95'
                }`}
              >
                {/* Scan ring overlay */}
                {isScanning && (
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="44"
                      className="stroke-neon-purple fill-none"
                      strokeWidth="2"
                      strokeDasharray={`${2 * Math.PI * 44}`}
                      strokeDashoffset={`${2 * Math.PI * 44 * (1 - scanProgress / 100)}`}
                    />
                  </svg>
                )}
                <Fingerprint
                  size={42}
                  className={`transition-all duration-500 ${
                    isScanning ? 'text-neon-purple animate-pulse' : 'text-gray-400'
                  }`}
                />
              </button>

              <div className="text-center">
                <p className="font-sans text-[11px] text-gray-400 font-medium">
                  {isScanning ? 'Scanning biometrics...' : 'Press and hold fingerprint node'}
                </p>
                {isScanning && (
                  <p className="font-mono text-xs text-neon-purple font-bold mt-0.5">
                    {scanProgress}% SECURE_SYNC
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-center gap-6 pt-2 text-[11px] text-gray-500">
              <button type="button" className="hover:text-neon-purple transition-all">Google Sync</button>
              <span>•</span>
              <button type="button" className="hover:text-neon-purple transition-all">Apple ID</button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
