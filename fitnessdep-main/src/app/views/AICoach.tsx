'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useFitnessStore } from '@/store/useFitnessStore';
import { Send, Sparkles, MessageSquare, Volume2, VolumeX, Mic } from 'lucide-react';

const SUGGESTIONS = [
  { text: 'Recommend a post-workout meal', category: 'diet' },
  { text: 'Recommend a fast HIIT routine', category: 'workout' },
  { text: 'Give me a recovery tip', category: 'recovery' }
];

export default function AICoach() {
  const { chatHistory, addChatMessage } = useFitnessStore();
  const [inputText, setInputText] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isCoachThinking, setIsCoachThinking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const orbCanvasRef = useRef<HTMLCanvasElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isCoachThinking]);

  // Holographic wave orb animation loop
  useEffect(() => {
    if (!orbCanvasRef.current) return;
    const canvas = orbCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const resize = () => {
      canvas.width = 160;
      canvas.height = 160;
    };
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const baseRadius = 50;

      // Draw multiple layers of swirling glowing rings
      for (let layer = 0; layer < 3; layer++) {
        ctx.strokeStyle = layer === 0 ? '#00f0ff' : layer === 1 ? '#bd00ff' : '#ff007f';
        ctx.lineWidth = layer === 0 ? 2 : 1.2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = ctx.strokeStyle;
        
        ctx.beginPath();
        const steps = 100;
        for (let i = 0; i <= steps; i++) {
          const angle = (i / steps) * Math.PI * 2;
          
          // Modify radius with overlapping waves
          const waveFreq = 4 + layer * 2;
          const waveAmp = isCoachThinking ? 15 : voiceEnabled ? 8 : 4;
          const offset = Math.sin(angle * waveFreq + time * (2 + layer)) * waveAmp;
          
          const radius = baseRadius + offset + Math.cos(time + layer) * 5;
          const x = cx + Math.cos(angle) * radius;
          const y = cy + Math.sin(angle) * radius;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.stroke();
      }

      time += isCoachThinking ? 0.08 : 0.03;
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(animId);
  }, [isCoachThinking, voiceEnabled]);

  const speakText = (text: string) => {
    if (!voiceEnabled || typeof window === 'undefined') return;
    // Stop any ongoing speeches
    window.speechSynthesis?.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    
    // Choose a modern English voice if available
    const voices = window.speechSynthesis?.getVoices();
    const englishVoice = voices?.find(v => v.lang.startsWith('en') && v.name.includes('Natural')) || 
                        voices?.find(v => v.lang.startsWith('en'));
    if (englishVoice) utterance.voice = englishVoice;

    window.speechSynthesis?.speak(utterance);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isCoachThinking) return;

    addChatMessage('user', text);
    setInputText('');
    setIsCoachThinking(true);

    // AI thinking state simulation
    setTimeout(() => {
      const userLower = text.toLowerCase();
      let reply = "Processing biometric feedback... ";

      if (userLower.includes('meal') || userLower.includes('food') || userLower.includes('eat')) {
        reply += "I recommend a lean recovery meal: 180g Baked Chicken Breast, 150g steamed sweet potatoes, and organic greens. This delivers 420 kcal, 40g Protein, and 35g Carbohydrates for muscle synthesis.";
      } else if (userLower.includes('workout') || userLower.includes('routine') || userLower.includes('exercise')) {
        reply += "Your current muscle recovery is at 82%. I recommend a fast HIIT workout: 4 rounds of 45 seconds Kettlebell Swings, 45 seconds Mountain Climbers, and 15 seconds rest to max output your aerobic capacity.";
      } else if (userLower.includes('recovery') || userLower.includes('sore') || userLower.includes('tired')) {
        reply += "Your stress telemetry checks are slightly elevated today. Focus on active mobility stretches, hydrate with 500ml of water infused with electrolytes, and prioritize 8 hours of sleep.";
      } else {
        reply += "Biometrics checks indicate optimal cellular performance. Continue current training routines, drink at least 250ml of hydration before active drills, and report back when finished.";
      }

      addChatMessage('coach', reply);
      setIsCoachThinking(false);
      
      // Synthesize audio narration
      speakText(reply);
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Header HUD */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>AI_SYNAPTIC_COACH</span>
            <span className="text-[10px] bg-neon-blue/20 border border-neon-blue/40 text-neon-blue px-2 py-0.5 rounded font-mono">
              HOLOGRAPHIC_ORB
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Holographic artificial coaching logic with active voice synthesis.</p>
        </div>

        {/* Audio control button */}
        <button
          type="button"
          onClick={() => {
            setVoiceEnabled(!voiceEnabled);
            if (voiceEnabled) window.speechSynthesis?.cancel();
          }}
          className={`p-2 rounded-2xl border transition-all cursor-pointer ${
            voiceEnabled 
              ? 'bg-neon-blue/15 border-neon-blue/40 text-neon-blue' 
              : 'bg-white/5 border-white/5 text-gray-500'
          }`}
        >
          {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Swirling Hologram Orb Visualizer */}
        <div className="lg:col-span-5 glass-panel glass-panel-glow-blue rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-6 min-h-[380px] relative overflow-hidden">
          {/* Diagnostic scanner overlays */}
          <div className="absolute top-4 left-4 font-mono text-[9px] text-gray-500 leading-relaxed text-left">
            <div>ORB_FREQUENCY: 620Hz</div>
            <div>VOICE_SYNTH: ACTIVE</div>
          </div>
          <div className="absolute top-4 right-4 font-mono text-[9px] text-neon-blue/60 leading-relaxed text-right">
            <div>STATUS: {isCoachThinking ? 'THINKING' : 'IDLE'}</div>
            <div>SENSORS: STANDBY</div>
          </div>

          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Swirling lines Canvas */}
            <canvas ref={orbCanvasRef} className="absolute inset-0" />
            <div className="w-20 h-20 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 z-10">
              <Sparkles size={28} className={`text-neon-blue ${isCoachThinking ? 'animate-spin' : 'animate-pulse'}`} />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white font-mono tracking-widest">COACH_AETHER_V3</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-[200px] mx-auto leading-normal">
              Speak or ask questions to trigger biometric training plans.
            </p>
          </div>
        </div>

        {/* Right: Message Terminal */}
        <div className="lg:col-span-7 glass-panel glass-panel-glow-purple rounded-3xl p-6 flex flex-col justify-between min-h-[380px]">
          
          {/* Chat feed container */}
          <div className="flex-grow space-y-4 max-h-[300px] overflow-y-auto pr-1 mb-4">
            {chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border font-mono text-[10px] ${
                    msg.sender === 'user'
                      ? 'bg-neon-purple/10 border-neon-purple/30 text-neon-purple'
                      : 'bg-neon-blue/10 border-neon-blue/30 text-neon-blue'
                  }`}
                >
                  {msg.sender === 'user' ? 'U' : 'AI'}
                </div>
                <div
                  className={`rounded-2xl p-3.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-neon-purple/10 border border-neon-purple/20 text-white rounded-tr-none'
                      : 'bg-white/5 border border-white/5 text-gray-200 rounded-tl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="block font-mono text-[8px] text-gray-500 mt-1.5 text-right">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isCoachThinking && (
              <div className="flex gap-3 mr-auto max-w-[85%] items-center">
                <div className="w-7 h-7 rounded-full bg-neon-blue/10 border border-neon-blue/30 text-neon-blue flex items-center justify-center flex-shrink-0 animate-spin">
                  <Sparkles size={10} />
                </div>
                <div className="bg-white/5 border border-white/5 rounded-2xl p-3.5 text-xs text-gray-500 rounded-tl-none flex gap-1 animate-pulse">
                  <span>Thinking...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="space-y-4 border-t border-white/5 pt-4">
            {/* Quick Suggestions prompts */}
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendMessage(s.text)}
                  disabled={isCoachThinking}
                  className="text-[10px] bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl px-3 py-1.5 text-gray-400 hover:text-white transition-all cursor-pointer disabled:opacity-50"
                >
                  {s.text}
                </button>
              ))}
            </div>

            {/* Input form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText);
              }}
              className="flex gap-3 relative"
            >
              <input
                type="text"
                required
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isCoachThinking}
                placeholder="Ask your AI coach a question..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-4 pr-12 py-3.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-neon-purple/50 transition-all"
              />
              <button
                type="submit"
                disabled={isCoachThinking}
                className="absolute right-2 top-1.5 bottom-1.5 px-3.5 bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/40 text-neon-purple rounded-xl flex items-center justify-center transition-all cursor-pointer disabled:opacity-50"
              >
                <Send size={12} />
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
