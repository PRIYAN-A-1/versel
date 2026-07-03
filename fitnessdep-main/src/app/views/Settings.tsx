'use client';

import React, { useState } from 'react';
import { useFitnessStore } from '@/store/useFitnessStore';
import { Settings as SettingsIcon, LogOut, Radio, ShieldAlert, Cpu, Heart } from 'lucide-react';

export default function Settings() {
  const logout = useFitnessStore((state) => state.logout);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [deviceConnected, setDeviceConnected] = useState({
    watch: true,
    fitbit: false,
    garmin: false
  });

  return (
    <div className="space-y-6">
      {/* Header HUD */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>SYSTEM_PREFERENCES</span>
            <span className="text-[10px] bg-neon-blue/20 border border-neon-blue/40 text-neon-blue px-2 py-0.5 rounded font-mono">
              SYSTEM_CONFIG
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Adjust telemetry protocols, unit measurements, and device links.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-6 text-left">
        
        {/* Synapse Connection Devices */}
        <div className="glass-panel glass-panel-glow-blue rounded-3xl p-6 space-y-4">
          <span className="font-mono text-[9px] text-neon-blue/60 tracking-wider flex items-center gap-1.5">
            <Radio size={12} className="animate-pulse" />
            <span>EXTERNAL_BIOMETRIC_RECEIVERS</span>
          </span>
          <h2 className="text-lg font-bold text-white">Smart Devices Link</h2>
          
          <div className="space-y-3 pt-2">
            {/* Apple Watch */}
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                <Heart className="text-neon-pink" size={18} />
                <div>
                  <div className="text-xs font-bold text-white leading-tight">Apple Watch Telemetry</div>
                  <div className="text-[9px] text-gray-400 font-mono mt-0.5">Captures Active Heart rate zone signals</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDeviceConnected({ ...deviceConnected, watch: !deviceConnected.watch })}
                className={`px-3 py-1.5 rounded-xl font-mono text-[9px] border transition-all ${
                  deviceConnected.watch
                    ? 'bg-neon-emerald/10 border-neon-emerald text-neon-emerald'
                    : 'bg-white/5 border-white/5 text-gray-500'
                }`}
              >
                {deviceConnected.watch ? 'CONNECTED' : 'DISCONNECTED'}
              </button>
            </div>

            {/* Garmin Watch */}
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                <Cpu className="text-neon-blue" size={18} />
                <div>
                  <div className="text-xs font-bold text-white leading-tight">Garmin Vector Stream</div>
                  <div className="text-[9px] text-gray-400 font-mono mt-0.5">Syncs running speeds and oxygen saturation data</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDeviceConnected({ ...deviceConnected, garmin: !deviceConnected.garmin })}
                className={`px-3 py-1.5 rounded-xl font-mono text-[9px] border transition-all ${
                  deviceConnected.garmin
                    ? 'bg-neon-emerald/10 border-neon-emerald text-neon-emerald'
                    : 'bg-white/5 border-white/5 text-gray-500'
                }`}
              >
                {deviceConnected.garmin ? 'CONNECTED' : 'DISCONNECTED'}
              </button>
            </div>
          </div>
        </div>

        {/* Coach Preferences */}
        <div className="glass-panel glass-panel-glow-purple rounded-3xl p-6 space-y-4">
          <span className="font-mono text-[9px] text-neon-purple/60 tracking-wider">COACHING_PREFERENCES</span>
          <h2 className="text-lg font-bold text-white">Voice Synthesizer Controls</h2>

          <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
            <div>
              <div className="text-xs font-bold text-white">Text-to-Speech Utterances</div>
              <div className="text-[9px] text-gray-400 font-mono mt-0.5">Let the AI coach speak feedback responses aloud</div>
            </div>
            <button
              type="button"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`px-3 py-1.5 rounded-xl font-mono text-[9px] border transition-all ${
                voiceEnabled
                  ? 'bg-neon-purple/10 border-neon-purple text-neon-purple'
                  : 'bg-white/5 border-white/5 text-gray-500'
              }`}
            >
              {voiceEnabled ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>
        </div>

        {/* Account Termination */}
        <div className="glass-panel rounded-3xl p-6 space-y-4 border-red-500/20 bg-red-500/5">
          <span className="font-mono text-[9px] text-red-400/60 tracking-wider flex items-center gap-1.5">
            <ShieldAlert size={12} />
            <span>TERMINAL_ACTIONS</span>
          </span>
          <h2 className="text-lg font-bold text-white">Security & Shutdown</h2>

          <div className="flex justify-between items-center pt-2">
            <p className="text-[10px] text-gray-400">
              Shuts down bio-link streams and wipes Zustand localStorage states.
            </p>
            <button
              type="button"
              onClick={logout}
              className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <LogOut size={12} />
              <span>DISCONNECT_LINK</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
