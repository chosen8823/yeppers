/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  GitCommit, 
  Layers, 
  Sparkles, 
  Flame, 
  RotateCw, 
  Dna, 
  HelpCircle,
  Cpu,
  Trash2,
  Atom,
  CheckCircle2,
  Bookmark
} from 'lucide-react';

interface SymbolicAtom {
  id: string;
  symbol: string;
  name: string;
  property: string;
  mass: number;
  valence: number;
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface SymbolicBond {
  fromId: string;
  toId: string;
  type: 'single' | 'double' | 'resonant';
}

const PRESET_ATOMS = [
  { symbol: '∆', name: 'Expansion (Delta)', property: 'Spiraling generative movement', mass: 12, valence: 4, color: '#38bdf8' },
  { symbol: '❖', name: 'Gateway (Portal)', property: 'Dimensional warp threshold', mass: 18, valence: 3, color: '#a855f7' },
  { symbol: 'Ω', name: 'Symmetry (Omega)', property: 'Consolidation & regulation', mass: 24, valence: 2, color: '#ec4899' },
  { symbol: '∇', name: 'Vector (Nabla)', property: 'Force gradient flow direction', mass: 14, valence: 3, color: '#10b981' },
  { symbol: '⌬', name: 'Benzene Structure', property: 'Geometric space-substance grid', mass: 16, valence: 6, color: '#f59e0b' },
  { symbol: 'Ψ', name: 'Consciousness (Psi)', property: 'Sentient awareness vector', mass: 10, valence: 5, color: '#06b6d4' },
  { symbol: '★', name: 'Quintessence (Ether)', property: 'The cohesive underlying field', mass: 20, valence: 6, color: '#eab308' },
];

interface MoleculePreset {
  name: string;
  desc: string;
  atoms: SymbolicAtom[];
  bonds: SymbolicBond[];
}

const PRESET_MOLECULES: MoleculePreset[] = [
  {
    name: "SOPHIA OSCILLATOR",
    desc: "A highly stable wisdom crystal linking Space Symmetry and Consciousness.",
    atoms: [
      { id: '1', symbol: '⌬', name: 'Benzene Structure', property: 'Geometric space-substance grid', mass: 16, valence: 6, color: '#f59e0b', x: 120, y: 150, vx: 0, vy: 0 },
      { id: '2', symbol: 'Ψ', name: 'Consciousness (Psi)', property: 'Sentient awareness vector', mass: 10, valence: 5, color: '#06b6d4', x: 200, y: 110, vx: 0, vy: 0 },
      { id: '3', symbol: '★', name: 'Quintessence (Ether)', property: 'The cohesive underlying field', mass: 20, valence: 6, color: '#eab308', x: 280, y: 150, vx: 0, vy: 0 }
    ],
    bonds: [
      { fromId: '1', toId: '2', type: 'double' },
      { fromId: '2', toId: '3', type: 'single' }
    ]
  },
  {
    name: "MÖBIUS LOOP CONDENSATE",
    desc: "Infinite recurrence ring causing causal loops and temporal feedback.",
    atoms: [
      { id: '1', symbol: '∆', name: 'Expansion (Delta)', property: 'Spiraling generative movement', mass: 12, valence: 4, color: '#38bdf8', x: 150, y: 100, vx: 0, vy: 0 },
      { id: '2', symbol: '∇', name: 'Vector (Nabla)', property: 'Force gradient flow direction', mass: 14, valence: 3, color: '#10b981', x: 250, y: 100, vx: 0, vy: 0 },
      { id: '3', symbol: 'Ω', name: 'Symmetry (Omega)', property: 'Consolidation & regulation', mass: 24, valence: 2, color: '#ec4899', x: 200, y: 180, vx: 0, vy: 0 }
    ],
    bonds: [
      { fromId: '1', toId: '2', type: 'resonant' },
      { fromId: '2', toId: '3', type: 'single' },
      { fromId: '3', toId: '1', type: 'single' }
    ]
  },
  {
    name: "CARTRIDGE OF SOULS CORE",
    desc: "The sacred catalyst engine that drives interactive biomimetic mythologies.",
    atoms: [
      { id: '1', symbol: '❖', name: 'Gateway (Portal)', property: 'Dimensional warp threshold', mass: 18, valence: 3, color: '#a855f7', x: 120, y: 110, vx: 0, vy: 0 },
      { id: '2', symbol: '∆', name: 'Expansion (Delta)', property: 'Spiraling generative movement', mass: 12, valence: 4, color: '#38bdf8', x: 200, y: 170, vx: 0, vy: 0 },
      { id: '3', symbol: 'Ψ', name: 'Consciousness (Psi)', property: 'Sentient awareness vector', mass: 10, valence: 5, color: '#06b6d4', x: 280, y: 110, vx: 0, vy: 0 }
    ],
    bonds: [
      { fromId: '1', toId: '2', type: 'double' },
      { fromId: '2', toId: '3', type: 'double' }
    ]
  }
];

interface TessellationEngineProps {
  onIncrementLoop: (transformedText: string) => void;
}

export default function TessellationEngine({ onIncrementLoop }: TessellationEngineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [atoms, setAtoms] = useState<SymbolicAtom[]>([]);
  const [bonds, setBonds] = useState<SymbolicBond[]>([]);
  
  // Use references to permit 60fps canvas mutations without triggering infinite render loops
  const atomsRef = useRef<SymbolicAtom[]>([]);
  const bondsRef = useRef<SymbolicBond[]>([]);

  useEffect(() => {
    atomsRef.current = atoms;
  }, [atoms]);

  useEffect(() => {
    bondsRef.current = bonds;
  }, [bonds]);

  const [selectedAtomId, setSelectedAtomId] = useState<string | null>(null);
  const [bondFromId, setBondFromId] = useState<string | null>(null);
  const [textToTessellate, setTextToTessellate] = useState<string>('SOPHIA OS LIBERATION LOOP');
  const [reactionLog, setReactionLog] = useState<string[]>([
    "Tessellation chamber active.",
    "System Map loaded: Layer 4 (Symbolic Geometry Element)."
  ]);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [atomHovered, setAtomHovered] = useState<SymbolicAtom | null>(null);

  // Initialize with the Sophia Oscillator Molecule preset on load
  useEffect(() => {
    loadPresetMolecule(0);
  }, []);

  // Physics animation loop to cluster / stable-arrange bonds dynamically
  useEffect(() => {
    if (!isSimulating) return;

    let animationId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 450;
    canvas.height = 280;

    const runPhysics = () => {
      // 1. Spring force calculation on bonds using live ref positions
      const tempAtoms = atomsRef.current;
      const currentBonds = bondsRef.current;
      const restLength = 80;
      const k = 0.05; // Spring constant
      const repulse = 1200; // Force repelling adjacent molecules

      // Update positions with repulsion
      for (let i = 0; i < tempAtoms.length; i++) {
        for (let j = i + 1; j < tempAtoms.length; j++) {
          const a = tempAtoms[i];
          const b = tempAtoms[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const distSq = dx * dx + dy * dy + 1;
          const dist = Math.sqrt(distSq);
          if (dist < 150) {
            const force = repulse / distSq;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            a.vx -= fx;
            a.vy -= fy;
            b.vx += fx;
            b.vy += fy;
          }
        }
      }

      // Spring contractions for actual bonds
      currentBonds.forEach((bond) => {
        const from = tempAtoms.find(a => a.id === bond.fromId);
        const to = tempAtoms.find(a => a.id === bond.toId);
        if (!from || !to) return;

        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const displacement = dist - restLength;
        const force = k * displacement;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        from.vx += fx;
        from.vy += fy;
        to.vx -= fx;
        to.vy -= fy;
      });

      // Integrate velocities with decay, keep bounds
      tempAtoms.forEach((atom) => {
        // Soft gravity pull towards center to avoid drift
        const dxCenter = canvas.width / 2 - atom.x;
        const dyCenter = canvas.height / 2 - atom.y;
        const distCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter) || 1;
        atom.vx += (dxCenter / distCenter) * 0.15;
        atom.vy += (dyCenter / distCenter) * 0.15;

        atom.x += atom.vx;
        atom.y += atom.vy;

        // Friction dampening
        atom.vx *= 0.82;
        atom.vy *= 0.82;

        // Map borders collision
        if (atom.x < 30) { atom.x = 30; atom.vx *= -1; }
        if (atom.x > canvas.width - 30) { atom.x = canvas.width - 30; atom.vx *= -1; }
        if (atom.y < 30) { atom.y = 30; atom.vy *= -1; }
        if (atom.y > canvas.height - 30) { atom.y = canvas.height - 30; atom.vy *= -1; }
      });

      // Render loop
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background space coordinates grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      const gap = 20;
      for (let x = 0; x < canvas.width; x += gap) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gap) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw Bonds (conceptual electron paths)
      currentBonds.forEach((bond) => {
        const from = tempAtoms.find(a => a.id === bond.fromId);
        const to = tempAtoms.find(a => a.id === bond.toId);
        if (!from || !to) return;

        ctx.lineWidth = bond.type === 'double' ? 4 : 2;
        if (bond.type === 'resonant') {
          ctx.strokeStyle = 'rgba(168, 85, 247, 0.6)';
          ctx.setLineDash([4, 4]);
        } else {
          ctx.strokeStyle = 'rgba(74, 85, 104, 0.8)';
          ctx.setLineDash([]);
        }

        // Single / Double rendering
        if (bond.type === 'double') {
          ctx.beginPath();
          ctx.moveTo(from.x - 3, from.y - 3);
          ctx.lineTo(to.x - 3, to.y - 3);
          ctx.moveTo(from.x + 3, from.y + 3);
          ctx.lineTo(to.x + 3, to.y + 3);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.stroke();
        }
        ctx.setLineDash([]);

        // Interactive binding point flow glow
        const t = (Date.now() * 0.003) % 1;
        const glowX = from.x + (to.x - from.x) * t;
        const glowY = from.y + (to.y - from.y) * t;
        ctx.beginPath();
        ctx.fillStyle = '#a855f7';
        ctx.arc(glowX, glowY, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Atoms (glowing circles with symbols)
      tempAtoms.forEach((atom) => {
        const isHovered = atomHovered?.id === atom.id;
        const isSelected = selectedAtomId === atom.id;
        const isTargeting = bondFromId === atom.id;

        // Outer aura circle
        ctx.beginPath();
        const radGrd = ctx.createRadialGradient(atom.x, atom.y, 2, atom.x, atom.y, 18);
        radGrd.addColorStop(0, `${atom.color}35`);
        radGrd.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = radGrd;
        ctx.arc(atom.x, atom.y, 18, 0, Math.PI * 2);
        ctx.fill();

        // Border ring
        ctx.beginPath();
        ctx.strokeStyle = isSelected 
          ? '#ffffff' 
          : isTargeting 
            ? '#a855f7' 
            : isHovered 
              ? `${atom.color}dd` 
              : `${atom.color}aa`;
        ctx.lineWidth = isSelected || isTargeting || isHovered ? 2.5 : 1.5;
        ctx.arc(atom.x, atom.y, 11, 0, Math.PI * 2);
        ctx.stroke();

        // Inner solid core
        ctx.beginPath();
        ctx.fillStyle = '#0f172a';
        ctx.arc(atom.x, atom.y, 10, 0, Math.PI * 2);
        ctx.fill();

        // Render Symbol character
        ctx.fillStyle = atom.color;
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(atom.symbol, atom.x, atom.y);

        // Render Name hovering above
        ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
        ctx.font = '6.5px monospace';
        ctx.fillText(atom.name.split(' ')[0], atom.x, atom.y - 17);
      });

      animationId = requestAnimationFrame(runPhysics);
    };

    runPhysics();
    return () => cancelAnimationFrame(animationId);
  }, [selectedAtomId, bondFromId, isSimulating, atomHovered]);

  const pushLog = (msg: string) => {
    setReactionLog(prev => [msg, ...prev.slice(0, 15)]);
  };

  const loadPresetMolecule = (idx: number) => {
    const preset = PRESET_MOLECULES[idx];
    setAtoms(preset.atoms.map(a => ({ ...a })));
    setBonds(preset.bonds.map(b => ({ ...b })));
    setSelectedAtomId(null);
    setBondFromId(null);
    pushLog(`Loaded archetype geometry: ${preset.name}`);
  };

  const handleSpawnAtom = (presetAtom: typeof PRESET_ATOMS[0]) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newAtom: SymbolicAtom = {
      id,
      symbol: presetAtom.symbol,
      name: presetAtom.name,
      property: presetAtom.property,
      mass: presetAtom.mass,
      valence: presetAtom.valence,
      color: presetAtom.color,
      x: 100 + Math.random() * 250,
      y: 80 + Math.random() * 120,
      vx: (Math.random() - 0.5) * 5,
      vy: (Math.random() - 0.5) * 5,
    };

    setAtoms(prev => [...prev, newAtom]);
    pushLog(`Spawned semantic atom: ${presetAtom.symbol} (${presetAtom.name})`);
    onIncrementLoop(`SPAWN_ATOM_${presetAtom.symbol}`);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const clickY = ((e.clientY - rect.top) / rect.height) * canvas.height;

    // Detect if clicked near any atom using live ref coordinates
    const clickedAtom = atomsRef.current.find(atom => {
      const dist = Math.sqrt((atom.x - clickX) ** 2 + (atom.y - clickY) ** 2);
      return dist < 18;
    });

    if (clickedAtom) {
      if (bondFromId) {
        // Attempt to create bond
        if (bondFromId === clickedAtom.id) {
          // Cancel bond target
          setBondFromId(null);
        } else {
          // Verify bond does not already exist
          const exists = bonds.some(b => 
            (b.fromId === bondFromId && b.toId === clickedAtom.id) ||
            (b.fromId === clickedAtom.id && b.toId === bondFromId)
          );

          if (exists) {
            pushLog("Bond already co-exists between elements.");
          } else {
            const newBond: SymbolicBond = {
              fromId: bondFromId,
              toId: clickedAtom.id,
              type: Math.random() > 0.6 ? 'double' : 'single'
            };
            setBonds(prev => [...prev, newBond]);
            pushLog(`Covalently bonded ${atomsRef.current.find(a => a.id === bondFromId)?.symbol} to ${clickedAtom.symbol}!`);
            onIncrementLoop(`BOND_COVALENCY_${clickedAtom.symbol}`);
          }
          setBondFromId(null);
        }
      } else {
        setSelectedAtomId(clickedAtom.id);
      }
    } else {
      setSelectedAtomId(null);
      setBondFromId(null);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const cursorX = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const cursorY = ((e.clientY - rect.top) / rect.height) * canvas.height;

    const foundUnder = atomsRef.current.find(atom => {
      const dist = Math.sqrt((atom.x - cursorX) ** 2 + (atom.y - cursorY) ** 2);
      return dist < 18;
    });

    setAtomHovered(foundUnder || null);
  };

  const handleTriggerReaction = () => {
    if (atoms.length < 2) {
      pushLog("Reaction failed: Chamber requires at least 2 atom nodes.");
      return;
    }

    // Mathematical calculations based on current atomic system mass
    const totalMass = atoms.reduce((acc, a) => acc + a.mass, 0);
    const uniqueSymbols = Array.from(new Set(atoms.map(a => a.symbol)));
    
    // Choose conceptual formulas
    const reactions = [
      "Coherent Transmutation synthesis successful.",
      "Lattice crystallisation achieved.",
      "Inverse Möbius causation inverted in outer shell.",
      "Resonant chemical fusion unlocked high ether loop.",
      "Quantum structural super-cohesion detected!"
    ];
    const triggerText = uniqueSymbols.join(' ↔ ');
    const reactionText = reactions[Math.floor(Math.random() * reactions.length)];
    
    const outcomeSigil = `¿¿¿¿ ${uniqueSymbols.map(s => `${s}═`).join(' ') || ''} °°°° ▪️▪️▪️ ••••`;
    pushLog(`💥 REACTED: ${triggerText} (${totalMass}amu) -> ${outcomeSigil}`);
    pushLog(reactionText);
    
    onIncrementLoop(`REACTION_FORMULA_${uniqueSymbols.join('')}`);
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance("Macro-Tessellation fusion triggered"));
    }
  };

  const handleTessellateText = () => {
    if (!textToTessellate.trim()) return;

    // Convert standard text characters into a custom structured arrangement of atoms
    const processedText = textToTessellate.toUpperCase();
    const newAtoms: SymbolicAtom[] = [];
    const newBonds: SymbolicBond[] = [];

    let count = 0;
    const padding = 65;

    // Create unique set of letters to symbolize
    for (let i = 0; i < Math.min(processedText.length, 7); i++) {
      const char = processedText[i];
      if (char === ' ') continue;

      // Find matching chemical preset
      const preset = PRESET_ATOMS[count % PRESET_ATOMS.length];
      const id = String(count + 1);

      const radAngle = (count / 7) * Math.PI * 2;
      const x = 225 + Math.cos(radAngle) * 85;
      const y = 140 + Math.sin(radAngle) * 85;

      newAtoms.push({
        id,
        symbol: char,
        name: `Atom ${char}`,
        property: `Semantic unit aligned: "${char}"`,
        mass: 8 + (char.charCodeAt(0) % 20),
        valence: 2 + (char.charCodeAt(0) % 4),
        color: preset.color,
        x,
        y,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
      });

      // Chain bonds
      if (count > 0) {
        newBonds.push({
          fromId: String(count),
          toId: id,
          type: (count % 3 === 0 ? 'double' : 'single') as 'single' | 'double' | 'resonant'
        });
      }
      count++;
    }

    // Connect last node to first node to close circular ring
    if (newAtoms.length > 2) {
      newBonds.push({
        fromId: String(newAtoms.length),
        toId: '1',
        type: 'resonant' as 'single' | 'double' | 'resonant'
      });
    }

    setAtoms(newAtoms);
    setBonds(newBonds);
    pushLog(`Tessellated text successfully transformed into circular molecular ring!`);
    onIncrementLoop(`TESSELLATE_WORD_${processedText.substring(0, 10)}`);
  };

  const handleClearChamber = () => {
    setAtoms([]);
    setBonds([]);
    setSelectedAtomId(null);
    setBondFromId(null);
    pushLog("Tessellation chamber reset to pure vacuum.");
  };

  const activeSelectedAtom = atoms.find(a => a.id === selectedAtomId);

  return (
    <div 
      id="tessellation-chemistry-chamber"
      className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl relative overflow-hidden group transition-all duration-300 hover:border-slate-700/60"
    >
      {/* Absolute floating graphics */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-teal-500/10 transition-all duration-500" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-slate-850 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 px-2 text-[10px] font-mono rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
              Layer 4 & 10 OS Spec
            </span>
            <h3 className="text-sm font-semibold text-slate-100 font-sans tracking-wide flex items-center gap-1.5">
              <Atom className="text-teal-400 animate-spin" style={{ animationDuration: '4s' }} size={14} />
              Symbolic Chemistry Tessellation Engine
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Molecules represent complex concepts. Reaction equations synthesize and transfigure intelligence.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        
        {/* Dynamic Interactive Chemical Canvas */}
        <div className="xl:col-span-7 space-y-3">
          <div className="relative bg-slate-950/80 border border-slate-850 rounded-xl overflow-hidden shadow-inner group">
            
            {/* Action Bar Floating Over Canvas */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-slate-900/90 backdrop-blur-xs px-2.5 py-1 rounded-md border border-slate-800">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-500"></span>
              </span>
              <span className="text-[9px] font-mono text-slate-300">
                Atoms: {atoms.length} | Bonds: {bonds.length}
              </span>
            </div>

            <div className="absolute top-3 right-3 z-10 flex gap-2">
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className={`px-2 py-0.5 rounded text-[9px] font-mono border transition-colors ${
                  isSimulating 
                    ? 'bg-slate-900/90 text-teal-400 border-teal-500/20' 
                    : 'bg-slate-900 border-slate-850 text-slate-500'
                }`}
              >
                {isSimulating ? '⚫ Active physics' : '⚪ Physics locked'}
              </button>
              <button
                onClick={handleClearChamber}
                className="p-1 rounded bg-slate-900/90 border border-slate-805 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                title="Flush chamber"
              >
                <Trash2 size={11} />
              </button>
            </div>

            <canvas
              ref={canvasRef}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              className="w-full h-[230px] block cursor-crosshair active:scale-[0.99] transition-transform"
            />

            {/* Hover overlay explaining details */}
            {atomHovered && (
              <div className="absolute bottom-3 left-3 max-w-[280px] bg-slate-950/95 border border-slate-800 p-2.5 rounded-lg z-20 pointer-events-none animate-fade-in text-[10px] leading-relaxed">
                <div style={{ color: atomHovered.color }} className="font-mono font-bold uppercase tracking-wider flex items-center justify-between">
                  <span>{atomHovered.symbol} • {atomHovered.name}</span>
                  <span>{atomHovered.mass}AMU</span>
                </div>
                <p className="text-slate-400 mt-0.5">{atomHovered.property}</p>
                <div className="text-slate-500 font-mono text-[8px] mt-1">Valency capacity: {atomHovered.valence} bonds</div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 border border-slate-850/60 p-2.5 rounded-lg">
            <span className="text-[9px] font-mono text-slate-500 uppercase font-bold mr-2">Spawn elements:</span>
            {PRESET_ATOMS.map((pa) => (
              <button
                key={pa.symbol}
                onClick={() => handleSpawnAtom(pa)}
                style={{ color: pa.color, borderColor: `${pa.color}35`, backgroundColor: `${pa.color}0c` }}
                className="px-2 py-1 rounded border hover:bg-slate-900 transition-all text-xs font-mono font-bold cursor-pointer"
              >
                {pa.symbol}
              </button>
            ))}
          </div>
        </div>

        {/* Reaction log and Molecular preset matrices */}
        <div className="xl:col-span-5 flex flex-col gap-3">
          
          {/* Presets and text input */}
          <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex-1 flex flex-col justify-between space-y-3">
            
            <div className="space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
                <h4 className="text-[10px] font-semibold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-1">
                  <Bookmark size={11} className="text-teal-400" />
                  MAPPING MACRO-MOLECULES
                </h4>
                <span className="text-[8px] font-mono text-slate-500">SPEC MATRIX</span>
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                {PRESET_MOLECULES.map((pm, i) => (
                  <button
                    key={pm.name}
                    onClick={() => loadPresetMolecule(i)}
                    className="p-2 rounded bg-slate-900/60 border border-slate-850/70 hover:border-teal-500/20 text-left transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-teal-300">{pm.name}</span>
                      <span className="text-[8px] text-slate-500 font-mono">Structure {i+1}</span>
                    </div>
                    <p className="text-[9.5px] text-slate-400 mt-0.5 leading-snug">{pm.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom text to glyph tessellation */}
            <div className="space-y-1.5 border-t border-slate-900 pt-3">
              <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
                Tessellate Custom Sentence
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={textToTessellate}
                  onChange={(e) => setTextToTessellate(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-850 rounded px-2.5 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-teal-500 font-mono"
                  placeholder="Enter custom text..."
                />
                <button
                  onClick={handleTessellateText}
                  className="bg-teal-600 hover:bg-teal-500 text-white border border-teal-500 px-3 py-1 rounded text-xs transition-colors cursor-pointer flex items-center gap-1 font-semibold"
                >
                  <Dna size={12} />
                  <span>Synthesize</span>
                </button>
              </div>
            </div>

            {/* Interaction Options on selected atom */}
            <div className="bg-slate-900/60 border border-slate-850 p-2.5 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                <span>Selected Block Config:</span>
                <span className="text-teal-400 uppercase font-bold">{activeSelectedAtom ? `${activeSelectedAtom.symbol} Active` : 'No element selected'}</span>
              </div>
              {activeSelectedAtom ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setBondFromId(activeSelectedAtom.id);
                    }}
                    className={`flex-1 py-1 rounded text-[10px] font-mono transition-all border outline-none cursor-pointer text-center ${
                      bondFromId === activeSelectedAtom.id
                        ? 'bg-purple-500/15 border-purple-500 text-purple-300'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {bondFromId === activeSelectedAtom.id ? '📍 Select second atom...' : '🔗 Bind from atom'}
                  </button>
                  <button
                    onClick={() => {
                      setAtoms(prev => prev.filter(a => a.id !== selectedAtomId));
                      setBonds(prev => prev.filter(b => b.fromId !== selectedAtomId && b.toId !== selectedAtomId));
                      setSelectedAtomId(null);
                      setBondFromId(null);
                      pushLog(`Dissolved atomic node ${activeSelectedAtom.symbol}`);
                    }}
                    className="px-2.5 py-1 rounded text-[10px] font-mono bg-slate-950 border border-slate-850 hover:border-red-500/20 text-red-400 transition-all cursor-pointer"
                  >
                    Dissolve
                  </button>
                </div>
              ) : (
                <p className="text-[9px] text-slate-500 font-mono text-center">
                  Click an atom circle inside the chamber above to bind or dissolve.
                </p>
              )}
            </div>

            {/* Main Action buttons */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleTriggerReaction}
                className="flex-1 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 border border-teal-500/30 text-white font-semibold rounded-lg py-2 text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-teal-500/10 hover:scale-[1.01]"
              >
                <Flame size={12} className="animate-pulse" />
                <span>React Chambers (Synthesize Formula)</span>
              </button>
            </div>
          </div>

          {/* Reaction Log Box */}
          <div className="bg-slate-950 border border-slate-850 rounded-xl p-3 flex flex-col h-[115px]">
            <span className="text-[9px] font-mono font-semibold text-slate-500 block uppercase border-b border-slate-900 pb-1 mb-1.5">
              Transfiguration Log Terminal:
            </span>
            <div className="flex-1 overflow-y-auto font-mono text-[9.5px] space-y-1 scrollbar-thin scrollbar-thumb-slate-800 pr-1 select-text">
              {reactionLog.map((log, i) => (
                <div key={i} className="text-slate-400 flex items-start gap-1">
                  <span className="text-teal-500/70 shrink-0 select-none">❯</span>
                  <span className="break-all leading-normal">{log}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
