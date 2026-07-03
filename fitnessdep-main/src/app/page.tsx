'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFitnessStore } from '@/store/useFitnessStore';

// Import Views
import Login from './views/Login';
import Onboarding from './views/Onboarding';
import Dashboard from './views/Dashboard';
import FoodScanner from './views/FoodScanner';
import WorkoutTracker from './views/WorkoutTracker';
import AICoach from './views/AICoach';
import WaterTracker from './views/WaterTracker';
import Analytics from './views/Analytics';
import Achievements from './views/Achievements';
import Community from './views/Community';
import Profile from './views/Profile';
import Settings from './views/Settings';

// Icons
import { 
  Activity, Dumbbell, Scan, Sparkles, 
  Droplet, BarChart2, Trophy, Users, 
  User, Settings as SettingsIcon, LogOut, Menu, X, Bell 
} from 'lucide-react';

export default function Home() {
  const { isLoggedIn, hasCompletedOnboarding, activeTab, setActiveTab, logout } = useFitnessStore();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#03030e]">
        <div className="w-12 h-12 border-2 border-neon-blue border-t-transparent animate-spin rounded-full" />
      </div>
    );
  }

  // --- UNAUTHENTICATED SCENARIO ---
  if (!isLoggedIn) {
    return <Login />;
  }

  // --- ONBOARDING SCENARIO ---
  if (!hasCompletedOnboarding) {
    return <Onboarding />;
  }

  // --- NAVIGATION CONFIG ---
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Activity size={16} /> },
    { id: 'nutrition', label: 'AI Calorie Scan', icon: <Scan size={16} /> },
    { id: 'workout', label: 'Workout Engine', icon: <Dumbbell size={16} /> },
    { id: 'coach', label: 'AI Coach', icon: <Sparkles size={16} /> },
    { id: 'water', label: 'Water Tracker', icon: <Droplet size={16} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={16} /> },
    { id: 'achievements', label: 'Trophy Room', icon: <Trophy size={16} /> },
    { id: 'community', label: 'Uplink Feed', icon: <Users size={16} /> },
    { id: 'profile', label: 'Profile', icon: <User size={16} /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon size={16} /> }
  ];

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'nutrition': return <FoodScanner />;
      case 'workout': return <WorkoutTracker />;
      case 'coach': return <AICoach />;
      case 'water': return <WaterTracker />;
      case 'analytics': return <Analytics />;
      case 'achievements': return <Achievements />;
      case 'community': return <Community />;
      case 'profile': return <Profile />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  const currentViewLabel = navItems.find(item => item.id === activeTab)?.label || 'System Core';

  const mockNotifications = [
    { id: 1, text: 'Remember to drink 250ml of hydration water', time: '10m ago' },
    { id: 2, text: 'AI Coach programmed a custom cardio sequence', time: '1h ago' }
  ];

  return (
    <div className="flex-grow flex flex-col md:flex-row min-h-screen relative p-2 sm:p-4 gap-4 overflow-hidden">
      
      {/* Background neon dots floating animation */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-25">
        <div className="absolute top-[20%] left-[10%] w-1.5 h-1.5 rounded-full bg-neon-blue animate-float" />
        <div className="absolute top-[60%] left-[80%] w-2 h-2 rounded-full bg-neon-purple animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[80%] left-[30%] w-1 h-1 rounded-full bg-neon-emerald animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* --- DESKTOP NAVIGATION SIDEBAR --- */}
      <aside className="hidden md:flex flex-col justify-between w-64 glass-panel glass-panel-glow-blue rounded-3xl p-5 relative z-20">
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-neon-blue to-transparent" />
        
        <div className="space-y-6 text-left">
          {/* Logo Header */}
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-neon-blue to-neon-purple flex items-center justify-center text-white font-extrabold text-sm shadow-md animate-pulse">
              A
            </div>
            <div>
              <div className="font-extrabold text-white tracking-wide text-sm font-sans holo-text text-neon-blue">
                AETHER OS
              </div>
              <div className="text-[9px] font-mono text-gray-500 uppercase leading-none mt-1">VER_3.0.82</div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium text-xs font-sans tracking-wide cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-neon-blue/15 to-neon-purple/15 border border-neon-blue/40 text-white shadow-[0_0_12px_rgba(0,240,255,0.08)]'
                      : 'border border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className={isActive ? 'text-neon-blue' : ''}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout */}
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all text-xs font-medium cursor-pointer"
        >
          <LogOut size={16} />
          <span>Shutdown OS</span>
        </button>
      </aside>

      {/* --- MOBILE NAVIGATION BAR --- */}
      <header className="md:hidden flex justify-between items-center glass-panel rounded-2xl p-4 relative z-20">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-neon-blue to-neon-purple flex items-center justify-center text-white font-extrabold text-xs">
            A
          </div>
          <span className="font-extrabold text-white text-xs font-sans">AETHER OS</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-white/5 border border-white/5 text-gray-400"
          >
            <Bell size={16} />
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/5 border border-white/5 text-white"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* Mobile menu modal overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-16 left-0 right-0 glass-panel rounded-2xl p-4 mt-2 space-y-2 border border-white/10 z-30"
            >
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs ${
                    activeTab === item.id
                      ? 'bg-neon-blue/10 border border-neon-blue/30 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
              <button
                type="button"
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/5 transition-all text-xs"
              >
                <LogOut size={16} />
                <span>Shutdown OS</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* --- MAIN OPERATING VIEW AREA --- */}
      <main className="flex-grow flex flex-col glass-panel border-white/5 rounded-3xl p-4 sm:p-6 relative z-10 overflow-y-auto min-h-[70vh] md:min-h-[85vh]">
        
        {/* Dynamic Navigation Header for View Info */}
        <div className="hidden md:flex justify-between items-center mb-6 text-left relative z-20">
          <div>
            <span className="font-mono text-[9px] text-gray-500 tracking-wider">AETHER_CORE_LINK // ACTIVE_STREAM</span>
            <div className="text-sm font-bold text-white mt-0.5">{currentViewLabel.toUpperCase()}</div>
          </div>

          <div className="flex items-center gap-4">
            {/* System Status online */}
            <div className="flex gap-2 items-center bg-white/5 px-3.5 py-1.5 rounded-xl border border-white/5 text-[9px] font-mono text-neon-emerald">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-emerald animate-pulse" />
              <span>LINK_SECURE: 99.8%</span>
            </div>

            {/* Notification triggers */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-all cursor-pointer relative"
              >
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-neon-pink" />
                <Bell size={16} />
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute right-0 top-11 w-64 glass-panel rounded-2xl p-4 border border-white/10 z-40 text-left space-y-3"
                  >
                    <div className="font-mono text-[8px] text-gray-500">SYSTEM_NOTIFICATIONS</div>
                    {mockNotifications.map((notif) => (
                      <div key={notif.id} className="bg-white/5 rounded-xl p-2.5 border border-white/5 space-y-1">
                        <p className="text-[10px] text-gray-300 leading-snug">{notif.text}</p>
                        <span className="block text-[8px] font-mono text-gray-500 text-right">{notif.time}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* View render container with slide transition animations */}
        <div className="flex-grow flex flex-col justify-between relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
              className="flex-grow flex flex-col justify-between"
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

    </div>
  );
}
