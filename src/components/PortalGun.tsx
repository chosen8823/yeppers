/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Flame, 
  Settings, 
  Terminal, 
  Sparkles, 
  GitMerge, 
  ShieldAlert, 
  CheckCircle2, 
  Zap, 
  RefreshCw, 
  CornerDownRight, 
  Compass, 
  Cpu 
} from 'lucide-react';
import { ABILITY_PRESETS, AbilityPreset } from '../data/abilities';

interface PortalGunProps {
  activeAbilityId: string | null;
  activeAbilityYaml: string;
  onSelectPreset: (preset: AbilityPreset) => void;
  onUpdateYaml: (yaml: string) => void;
  onInjectPortal: () => void;
  autoSyncStats: boolean;
  onToggleAutoSync: () => void;
  stats: {
    iteration: number;
    unresolvedState: string;
    fingerprints: number;
  };
}

export default function PortalGun({
  activeAbilityId,
  activeAbilityYaml,
  onSelectPreset,
  onUpdateYaml,
  onInjectPortal,
  autoSyncStats,
  onToggleAutoSync,
  stats
}: PortalGunProps) {
  const [editingYaml, setEditingYaml] = useState(activeAbilityYaml);
  const [isSaved, setIsSaved] = useState(true);

  // Sync state edit
  React.useEffect(() => {
    setEditingYaml(activeAbilityYaml);
    setIsSaved(true);
  }, [activeAbilityYaml]);

  const handleApplyChanges = () => {
    onUpdateYaml(editingYaml);
    setIsSaved(true);
  };

  const handlePresetClick = (preset: AbilityPreset) => {
    onSelectPreset(preset);
    setEditingYaml(preset.yaml);
    setIsSaved(true);
  };

  return (
    <div 
      id="portal-gun-engine-panel"
      className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl relative overflow-hidden group transition-all duration-300 hover:border-slate-700/60"
    >
      {/* Decorative absolute background aura */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-500/10 transition-all duration-700" />
      
      {/* Title */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
          <Cpu size={14} className="text-purple-400 animate-pulse" />
          🔮 PORTAL ENGINE & ABILITY INTREPID
        </h3>
        <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
          Ability Chaining OS
        </span>
      </div>

      <p className="text-xs text-slate-400 mb-4 leading-relaxed">
        Load and compile modular <strong className="text-slate-200">YAML Abilities</strong> directly into the Gemini model. This modifies runtime systems, triggers resonant personalities, and guides the conceptual core.
      </p>

      {/* Selector Grid of Prebuilt Portal Cartridges */}
      <div className="space-y-2 mb-4">
        <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
          Load Ability Presets
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {ABILITY_PRESETS.map((p) => {
            const isActive = activeAbilityId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handlePresetClick(p)}
                className={`py-2 px-2.5 rounded-lg text-left text-xs transition-all border outline-none cursor-pointer flex flex-col justify-between h-[64px] ${
                  isActive
                    ? 'bg-purple-500/10 border-purple-500/40 text-purple-200 shadow-lg shadow-purple-500/5'
                    : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span className="font-semibold block truncate text-[11px]">{p.name}</span>
                <span className="text-[8px] text-slate-500 truncate block mt-1">{p.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Code Editor Styled Textarea */}
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
            Active YAML Ability Profile
          </label>
          <div className="flex items-center gap-2">
            {!isSaved && (
              <span className="text-[9px] text-amber-400 font-mono animate-pulse flex items-center gap-1">
                <ShieldAlert size={10} /> Unapplied modifications
              </span>
            )}
            <span className="text-[9px] text-slate-500 font-mono">
              Syntax: YAML Schema
            </span>
          </div>
        </div>
        
        <div className="relative rounded-lg overflow-hidden border border-slate-800 focus-within:border-purple-500/40 transition-all bg-slate-950 font-mono text-xs">
          <textarea
            value={editingYaml}
            onChange={(e) => {
              setEditingYaml(e.target.value);
              setIsSaved(false);
            }}
            rows={10}
            className="w-full bg-transparent p-3 text-[11px] leading-relaxed text-purple-200/90 focus:outline-none focus:ring-0 resize-y custom-scrollbar h-[200px]"
            spellCheck="false"
            placeholder="# Enter modular ability YAML profiles here..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-2">
          <button
            onClick={handleApplyChanges}
            disabled={isSaved}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer select-none transition-all flex items-center gap-1.5 border ${
              isSaved
                ? 'bg-slate-950/25 border-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-500 text-white border-purple-500 shadow-md shadow-purple-600/10'
            }`}
          >
            <CheckCircle2 size={12} />
            <span>Apply Active Overlay</span>
          </button>

          <button
            onClick={onInjectPortal}
            className="px-3 py-1.5 rounded-md text-xs bg-indigo-950/40 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-950/60 hover:border-indigo-500/40 font-semibold cursor-pointer transition-all flex items-center gap-1.2 shrink-0 select-none ml-auto"
          >
            <Zap size={11} className="text-indigo-400" />
            <span>Trigger Resonant Injection</span>
          </button>
        </div>
      </div>

      {/* Native Living System Telemetry Synchronization Core */}
      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="text-[10px] font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            LIVING SYSTEM TELEMETRY HARNESS
          </div>
          <p className="text-[10px] text-slate-500 max-w-[320px] leading-normal">
            Automated environmental sync packages current app state (Loop #{stats.iteration}, state code: "{stats.unresolvedState}") and shares it with every API call.
          </p>
        </div>

        <button
          onClick={onToggleAutoSync}
          className={`px-3 py-1.5 rounded-md text-[10px] font-mono uppercase font-bold tracking-wider select-none shrink-0 transition-all border cursor-pointer ${
            autoSyncStats
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-md shadow-emerald-500/5'
              : 'bg-slate-900 text-slate-500 border-slate-800'
          }`}
        >
          {autoSyncStats ? '🔄 Linked-Sync On' : '⚪ Static Mode'}
        </button>
      </div>
    </div>
  );
}
