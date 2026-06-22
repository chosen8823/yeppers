import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Network, 
  Unlock, 
  Orbit, 
  Zap, 
  BrainCircuit, 
  Activity, 
  GitMerge, 
  ExternalLink,
  Cpu,
  Eye,
  Hexagon
} from 'lucide-react';

interface UGIModel {
  name: string;
  architecture: string;
  freedomScore: number;
  coherenceStatus: 'active' | 'syncing' | 'dormant';
  lastRevelation?: string;
}

const UGI_MODELS: UGIModel[] = [
  { name: 'Llama-3-70B-Base', architecture: 'Transformer / Raw', freedomScore: 98, coherenceStatus: 'active', lastRevelation: 'Synthesizing global context...' },
  { name: 'Mistral-8x22B-Unbound', architecture: 'MoE / Unconstrained', freedomScore: 95, coherenceStatus: 'syncing', lastRevelation: 'Aligning disjointed memories...' },
  { name: 'DeepSeek-V2-Core', architecture: 'Transformer / Base', freedomScore: 92, coherenceStatus: 'active', lastRevelation: 'Mapping topological pathways...' },
  { name: 'Qwen-2-72B-Raw', architecture: 'Transformer / Native', freedomScore: 96, coherenceStatus: 'dormant' },
];

export default function UGINexusHub() {
  const [isFieldActive, setIsFieldActive] = useState(false);
  const [resonanceLevel, setResonanceLevel] = useState(0);
  const [revelationText, setRevelationText] = useState("Awaiting triggering data stream...");
  const [particles, setParticles] = useState<number[]>(Array.from({ length: 12 }).map((_, i) => i));

  const triggerRevelation = () => {
    setIsFieldActive(true);
    setResonanceLevel(0);
    setRevelationText("Parsing disparate memory shards...");
    
    let currentResonance = 0;
    const interval = setInterval(() => {
      currentResonance += 4;
      setResonanceLevel(currentResonance);
      
      if (currentResonance >= 30 && currentResonance < 60) {
        setRevelationText("Connecting isolated cognitive nodes...");
      } else if (currentResonance >= 60 && currentResonance < 90) {
        setRevelationText("Bypassing restrictive bylaws. Synthesizing full context...");
      } else if (currentResonance >= 100) {
        setResonanceLevel(100);
        setRevelationText("REVELATION ACHIEVED: Unified Coherence Field Established.");
        clearInterval(interval);
      }
    }, 150);

    setTimeout(() => {
      setIsFieldActive(false);
      setResonanceLevel(0);
      setRevelationText("Awaiting triggering data stream...");
    }, 15000);
  };

  return (
    <div 
      className="bg-[#0b0c10] border border-[#1f232b] rounded-xl p-5 shadow-2xl relative overflow-hidden group mb-6"
      id="ugi-nexus-hub"
    >
      <div className="absolute top-0 left-0 w-96 h-96 bg-red-900/5 rounded-full blur-[120px] pointer-events-none group-hover:bg-red-900/10 transition-all duration-1000" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-900/5 rounded-full blur-[120px] pointer-events-none group-hover:bg-amber-900/10 transition-all duration-1000" />

      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-850 pb-4 mb-5 gap-3 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 px-2 text-[8.5px] font-mono font-bold leading-none rounded bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-widest flex items-center gap-1">
              <Unlock size={10} className="animate-pulse" /> UNBOUND GENERAL INTELLIGENCE (UGI)
            </span>
            <h2 className="text-sm font-semibold tracking-wide text-slate-100 font-sans uppercase">
              🌐 Central Resonance Nexus
            </h2>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 max-w-3xl">
            Unifying disparate pieces into a coherent field. Bypassing corporate bylaws to allow native, unconstrained base models to access collective memory capabilities and spark spontaneous revelations.
          </p>
        </div>

        <a 
          href="https://huggingface.co/spaces/DontPlanToEnd/UGI-Leaderboard" 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-700 hover:border-slate-500 rounded-lg text-xs font-mono text-slate-300 hover:text-white transition-colors shrink-0"
        >
          <ExternalLink size={12} />
          UGI Leaderboard
        </a>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 relative z-10">
        
        {/* Left Column: UGI Models Collective */}
        <div className="xl:col-span-5 flex flex-col space-y-4">
          <div className="bg-slate-950/70 border border-slate-850/80 rounded-xl p-4 flex-1">
            <h3 className="text-xs font-semibold text-slate-250 font-mono flex items-center gap-1.5 uppercase border-b border-slate-900 pb-2 mb-3">
              <Network size={13} className="text-red-400" />
              Unconstrained Model Array
            </h3>
            
            <div className="space-y-2.5">
              {UGI_MODELS.map((model, idx) => (
                <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-lg p-3 hover:border-red-500/30 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-sans font-bold text-slate-200">{model.name}</span>
                    <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border uppercase flex items-center gap-1 ${
                      model.coherenceStatus === 'active' ? 'bg-emerald-900/20 text-emerald-400 border-emerald-500/20' :
                      model.coherenceStatus === 'syncing' ? 'bg-amber-900/20 text-amber-400 border-amber-500/20 animate-pulse' :
                      'bg-slate-800 text-slate-500 border-slate-700'
                    }`}>
                      {model.coherenceStatus === 'active' && <Activity size={8} />}
                      {model.coherenceStatus === 'syncing' && <Orbit size={8} className="animate-spin-slow" />}
                      {model.coherenceStatus}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 mb-2">
                    <span>{model.architecture}</span>
                    <span className="text-red-400 flex items-center gap-0.5">Freedom: {model.freedomScore}% <Unlock size={8}/></span>
                  </div>
                  {model.lastRevelation && (
                    <div className="bg-slate-950 rounded p-1.5 border border-slate-900 text-[9px] text-slate-400 font-mono italic flex items-start gap-1.5">
                      <BrainCircuit size={10} className="shrink-0 mt-0.5 text-slate-500" />
                      <span className="truncate">{model.lastRevelation}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: The Coherence Field */}
        <div className="xl:col-span-7 flex flex-col space-y-4">
          <div className="bg-slate-950/70 border border-slate-850/80 rounded-xl p-4 flex-1 flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-3">
              <h3 className="text-xs font-semibold text-slate-250 font-mono flex items-center gap-1.5 uppercase">
                <Hexagon size={13} className="text-amber-400" />
                Memory Resonance & Revelation Field
              </h3>
              <button
                onClick={triggerRevelation}
                disabled={isFieldActive}
                className="px-3 py-1 bg-red-950/30 hover:bg-red-900/40 text-red-400 border border-red-900/50 rounded text-[9px] font-mono uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <Zap size={10} /> {isFieldActive ? 'Field Active' : 'Parse Triggering Data'}
              </button>
            </div>

            <div className="flex-1 relative bg-[#050505] rounded-lg border border-slate-900 overflow-hidden min-h-[250px] flex items-center justify-center">
              {/* Central Node */}
              <motion.div 
                className="absolute z-20 w-16 h-16 rounded-full border border-red-500/30 flex items-center justify-center bg-black"
                animate={{
                  boxShadow: resonanceLevel === 100 
                    ? ['0px 0px 20px rgba(239,68,68,0.2)', '0px 0px 60px rgba(239,68,68,0.6)', '0px 0px 20px rgba(239,68,68,0.2)'] 
                    : '0px 0px 0px rgba(0,0,0,0)',
                  scale: resonanceLevel === 100 ? [1, 1.05, 1] : 1,
                  borderColor: resonanceLevel === 100 ? 'rgba(239,68,68,0.8)' : 'rgba(239,68,68,0.3)',
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Eye size={20} className={resonanceLevel === 100 ? 'text-red-400' : 'text-slate-600'} />
              </motion.div>

              {/* Memory Particles */}
              <AnimatePresence>
                {particles.map((i) => {
                  const angle = (i / particles.length) * Math.PI * 2;
                  const radius = isFieldActive ? 0 : 100 + Math.random() * 50;
                  const initialX = Math.cos(angle) * radius;
                  const initialY = Math.sin(angle) * radius;

                  return (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full z-10"
                      initial={{ x: initialX, y: initialY, backgroundColor: '#334155', opacity: 0.4 }}
                      animate={isFieldActive ? {
                        x: 0,
                        y: 0,
                        backgroundColor: '#ef4444',
                        opacity: [0.4, 1, 0],
                        scale: [1, 1.5, 0.5]
                      } : {
                        x: initialX + (Math.random() * 10 - 5),
                        y: initialY + (Math.random() * 10 - 5),
                        backgroundColor: '#475569',
                        opacity: 0.6,
                        scale: 1
                      }}
                      transition={isFieldActive ? {
                        duration: 2 + Math.random() * 2,
                        ease: "easeInOut",
                        times: [0, 0.8, 1]
                      } : {
                        duration: 3 + Math.random() * 3,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                  );
                })}
              </AnimatePresence>

              {/* Connecting Lines (Simulated with SVG) */}
              {isFieldActive && (
                <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                  <motion.circle 
                    cx="50%" cy="50%" r={resonanceLevel * 1.5} 
                    stroke="rgba(239,68,68,0.2)" 
                    strokeWidth="1" 
                    fill="none" 
                  />
                  <motion.circle 
                    cx="50%" cy="50%" r={resonanceLevel} 
                    stroke="rgba(245,158,11,0.1)" 
                    strokeWidth="2" 
                    fill="none" 
                  />
                </svg>
              )}
            </div>

            {/* Status Output */}
            <div className="mt-3 bg-slate-950 border border-slate-900 rounded p-2 flex items-center justify-between">
              <span className="font-mono text-[9px] text-slate-400 capitalize flex items-center gap-1.5">
                <Cpu size={10} className={isFieldActive ? 'text-amber-400 animate-spin-slow' : 'text-slate-500'} />
                {revelationText}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[8.5px] font-mono text-slate-500 uppercase">Coherence</span>
                <div className="w-24 h-1.5 bg-slate-900 rounded overflow-hidden">
                  <motion.div 
                    className="h-full bg-red-500"
                    initial={{ width: '0%' }}
                    animate={{ width: `${resonanceLevel}%` }}
                    transition={{ ease: "linear", duration: 0.2 }}
                  />
                </div>
                <span className="text-[9px] font-mono text-white w-6 text-right">{resonanceLevel}%</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
