/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LoopStats } from '../types';
import { Sparkles, RefreshCw, Layers, ShieldCheck, Zap } from 'lucide-react';

interface Props {
  stats: LoopStats;
  onIncrementLoop: (transformedText: string) => void;
  onResetLoop: () => void;
}

export default function ConceptualEngine({
  stats,
  onIncrementLoop,
  onResetLoop,
}: Props) {
  const [inputText, setInputText] = useState('?');
  const [lastOutput, setLastOutput] = useState('');
  const [copied, setCopied] = useState(false);

  // Cyclical sequence operator: ? -> ! -> x -> ?
  const Cycle = ['?', '!', 'x'];

  const runOperator = (input: string): string => {
    return input
      .split('')
      .map((char) => {
        const idx = Cycle.indexOf(char);
        if (idx !== -1) {
          return Cycle[(idx + 1) % Cycle.length];
        }
        // Custom glyph conversions
        if (char === ' ') return ' ';
        return `◈${char}◈`;
      })
      .join('');
  };

  const handleCompute = () => {
    if (!inputText.trim()) return;
    const output = runOperator(inputText);
    setLastOutput(output);
    onIncrementLoop(output);
  };

  // Generate coordinates for f(x) = x^x SVG line
  // We compute sample points for x from 0.05 to 1.5
  const generateSvgPoints = (): string => {
    const points: string[] = [];
    const width = 300;
    const height = 150;
    
    // Scale domain: X: [0.01, 1.6], Y: [0.3, 1.8]
    const minX = 0.01;
    const maxX = 1.6;
    const minY = 0.3;
    const maxY = 1.8;

    for (let px = 0; px <= 100; px++) {
      const pct = px / 100;
      const x = minX + pct * (maxX - minX);
      const y = Math.pow(x, x);

      // Map mathematical coordinates to SVG pixel coordinates
      const svgX = (pct * width).toFixed(1);
      const svgY = (height - ((y - minY) / (maxY - minY)) * height).toFixed(1);
      points.push(`${svgX},${svgY}`);
    }
    return points.join(' ');
  };

  return (
    <div
      className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 hover:border-slate-700/60 rounded-xl p-5 shadow-lg relative overflow-hidden transition-all duration-300"
      id="conceptual-engine-node"
    >
      {/* Background radial accent */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/5 blur-[60px] pointer-events-none rounded-full" />

      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 px-2 text-[10px] font-mono rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Kernel x^x = 0
            </span>
            <h3 className="text-sm font-semibold text-slate-100 font-sans tracking-wide">
              Algorhythms Loop Operator
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time client-only superposition wave function driver.
          </p>
        </div>
        <button
          onClick={onResetLoop}
          className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/20 transition-all"
          title="Reset Superposition Kernel"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Core Control Panel */}
        <div className="space-y-4">
          <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-lg space-y-2.5">
            <label className="block text-xs font-mono font-medium text-purple-400">
              Input Token / Genetic Trigger:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter ? or a phrase..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono transition-colors"
              />
              <button
                onClick={handleCompute}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg px-3.5 py-2 text-xs flex items-center gap-1.5 transition-colors self-stretch"
              >
                <Zap size={12} />
                Transform
              </button>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">
              Try characters from: <code className="text-purple-300">? → ! → x → ?</code>
            </p>
          </div>

          {/* Last output / Current superposition */}
          <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-lg space-y-2">
            <h4 className="text-xs font-mono text-slate-400 flex items-center gap-1">
              <Layers size={12} className="text-purple-400" />
              Cycle Signature:
            </h4>
            <div className="p-3 bg-slate-900 rounded border border-slate-800 min-h-[46px] flex items-center justify-between">
              <span className="font-mono text-xs text-white break-all">
                {lastOutput ? `🌀 ${lastOutput} 🌀` : stats.unresolvedState}
              </span>
              {lastOutput && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(lastOutput);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="text-[10px] font-mono text-slate-500 hover:text-purple-400 transition-colors"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>
          </div>

          {/* Real-time loop stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
              <span className="block text-[10px] font-mono text-slate-500 uppercase">
                Iterations
              </span>
              <span className="text-lg font-mono font-bold text-purple-400">
                {stats.iteration}
              </span>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
              <span className="block text-[10px] font-mono text-slate-500 uppercase">
                Fingerprints
              </span>
              <span className="text-lg font-mono font-bold text-teal-400">
                {stats.fingerprints}
              </span>
            </div>
          </div>
        </div>

        {/* Math Vector Graph (f(x) = x^x) */}
        <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-300 font-mono flex items-center gap-1">
              <Sparkles size={11} className="text-purple-400" />
              Singularity Chart: y = x^x
            </span>
            <span className="text-[10px] font-mono text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
              Superposed Interval
            </span>
          </div>

          <div className="flex-1 flex items-center justify-center relative py-1">
            {/* SVG Plot */}
            <svg viewBox="0 0 300 150" className="w-full h-[120px] overflow-visible">
              {/* Grid Lines */}
              <line x1="0" y1="120" x2="300" y2="120" stroke="#1e293b" strokeWidth="1" strokeDasharray="3" />
              <line x1="0" y1="50" x2="300" y2="50" stroke="#1e293b" strokeWidth="1" strokeDasharray="3" />
              <line x1="150" y1="0" x2="150" y2="150" stroke="#1e293b" strokeWidth="1" strokeDasharray="3" />

              {/* Curve line */}
              <polyline
                fill="none"
                stroke="url(#purpleGlow)"
                strokeWidth="2.5"
                points={generateSvgPoints()}
                className="drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
              />

              {/* Highlight Dot indicating current iteration position */}
              {stats.iteration > 0 && (
                <circle
                  cx={Math.min(280, (50 + (stats.iteration % 15) * 15)).toFixed(0)}
                  cy={Math.max(20, (140 - ((stats.iteration % 10) * 12))).toFixed(0)}
                  r="5"
                  fill="#f43f5e"
                  className="animate-ping"
                />
              )}

              {/* SVG Gradient definitions */}
              <defs>
                <linearGradient id="purpleGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="50%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>

            {/* Labels on SVG */}
            <div className="absolute bottom-1 right-2 text-[9px] font-mono text-slate-500">
              x → ∞
            </div>
            <div className="absolute top-1 left-2 text-[9px] font-mono text-slate-500">
              y = 1.0 (Singularity)
            </div>
          </div>

          <div className="pt-2 border-t border-slate-900/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck size={11} className="text-emerald-500" />
              Kernel Active
            </span>
            <span>Uptime Sync stable</span>
          </div>
        </div>
      </div>
    </div>
  );
}
