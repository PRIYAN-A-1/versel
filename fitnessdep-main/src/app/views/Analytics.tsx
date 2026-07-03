'use client';

import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { Calendar, TrendingUp, BarChart2, Activity } from 'lucide-react';

const WEIGHT_DATA = [
  { name: 'Mon', weight: 82.5 },
  { name: 'Tue', weight: 82.2 },
  { name: 'Wed', weight: 81.9 },
  { name: 'Thu', weight: 82.0 },
  { name: 'Fri', weight: 81.6 },
  { name: 'Sat', weight: 81.4 },
  { name: 'Sun', weight: 81.1 }
];

const CALORIE_DATA = [
  { name: 'Mon', consumed: 2100, burned: 450 },
  { name: 'Tue', consumed: 1950, burned: 600 },
  { name: 'Wed', consumed: 2200, burned: 350 },
  { name: 'Thu', consumed: 1800, burned: 500 },
  { name: 'Fri', consumed: 2300, burned: 400 },
  { name: 'Sat', consumed: 2050, burned: 800 },
  { name: 'Sun', consumed: 2150, burned: 300 }
];

const SLEEP_DATA = [
  { name: 'Mon', sleep: 7.2 },
  { name: 'Tue', sleep: 6.8 },
  { name: 'Wed', sleep: 7.5 },
  { name: 'Thu', sleep: 8.0 },
  { name: 'Fri', sleep: 6.5 },
  { name: 'Sat', sleep: 8.4 },
  { name: 'Sun', sleep: 7.8 }
];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly'>('weekly');
  const [mounted, setMounted] = useState(false);

  // Guard against SSR hydration mismatches for SVG charts
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="glass-panel border-white/5 rounded-3xl p-8 min-h-[380px] flex items-center justify-center text-gray-500">
        <div className="w-10 h-10 border-2 border-neon-blue border-t-transparent animate-spin rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header HUD */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>ANALYTICS_DECKS</span>
            <span className="text-[10px] bg-neon-purple/20 border border-neon-purple/40 text-neon-purple px-2 py-0.5 rounded font-mono">
              BIOMETRIC_TRENDS
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Statistical vector charts analyzing physical mass and calorie rates.</p>
        </div>

        {/* Toggle Range */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 font-mono text-[9px]">
          <button
            type="button"
            onClick={() => setTimeRange('weekly')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeRange === 'weekly' ? 'bg-neon-blue text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            WEEKLY
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('monthly')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeRange === 'monthly' ? 'bg-neon-blue text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            MONTHLY
          </button>
        </div>
      </div>

      {/* Main Grid Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weight scale trend area chart */}
        <div className="lg:col-span-7 glass-panel glass-panel-glow-emerald rounded-3xl p-6 min-h-[320px]">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2.5 items-center">
              <TrendingUp size={16} className="text-neon-emerald" />
              <h3 className="text-sm font-bold text-white font-mono uppercase">WEIGHT_TRAJECTORY (KG)</h3>
            </div>
            <span className="text-xs text-neon-emerald font-bold font-mono">-1.4 kg this week</span>
          </div>

          <div className="h-60 w-full font-mono text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WEIGHT_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff88" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke="#555" />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="#555" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(12,12,32,0.85)', borderColor: 'rgba(0,255,136,0.3)', borderRadius: '12px' }}
                  labelStyle={{ color: '#fff', fontSize: '10px' }}
                />
                <Area type="monotone" dataKey="weight" stroke="#00ff88" strokeWidth={2} fillOpacity={1} fill="url(#weightGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Calories balancing chart */}
        <div className="lg:col-span-5 glass-panel glass-panel-glow-blue rounded-3xl p-6 min-h-[320px]">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2.5 items-center">
              <BarChart2 size={16} className="text-neon-blue" />
              <h3 className="text-sm font-bold text-white font-mono uppercase">CALORIC_BALANCE (KCAL)</h3>
            </div>
          </div>

          <div className="h-60 w-full font-mono text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CALORIE_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke="#555" />
                <YAxis stroke="#555" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(12,12,32,0.85)', borderColor: 'rgba(0,240,255,0.3)', borderRadius: '12px' }}
                  labelStyle={{ color: '#fff', fontSize: '10px' }}
                />
                <Bar dataKey="consumed" fill="#00f0ff" radius={[4, 4, 0, 0]} name="Consumed" />
                <Bar dataKey="burned" fill="#bd00ff" radius={[4, 4, 0, 0]} name="Burned" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sleep cycle charts */}
        <div className="lg:col-span-12 glass-panel border-white/5 rounded-3xl p-6 min-h-[260px]">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2.5 items-center">
              <Calendar size={16} className="text-neon-cyan" />
              <h3 className="text-sm font-bold text-white font-mono uppercase">SLEEP_EFFICIENCY_TELEMETRY (HRS)</h3>
            </div>
            <span className="text-xs text-neon-cyan font-bold font-mono">AVG: 7.4 hrs</span>
          </div>

          <div className="h-44 w-full font-mono text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SLEEP_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ffff" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#00ffff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke="#555" />
                <YAxis stroke="#555" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(12,12,32,0.85)', borderColor: 'rgba(0,255,255,0.3)', borderRadius: '12px' }}
                  labelStyle={{ color: '#fff', fontSize: '10px' }}
                />
                <Area type="monotone" dataKey="sleep" stroke="#00ffff" strokeWidth={2} fillOpacity={1} fill="url(#sleepGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
