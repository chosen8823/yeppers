/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Network, 
  RotateCw, 
  Activity, 
  Cpu, 
  GitBranch, 
  Flame, 
  Zap, 
  Compass, 
  Radio, 
  Glasses,
  Play,
  Sliders,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { LoopStats } from '../types';

interface Props {
  stats: LoopStats;
  onIncrementLoop: (transformedText: string) => void;
}

interface RfidNode {
  id: string;
  name: string;
  x: number;
  y: number;
  strength: number; // + is source, - is sink / EMF pull
  resonantFreq: number; // Hz (432, 528, 741, 963)
  active: boolean;
  type: string;
}

interface TokenParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  charge: number;
  color: string;
  life: number;
  path: { x: number; y: number }[];
  id: string;
}

// OS Spec Schema definition for the 6 core layers
const LAYER_SCHEMAS = [
  {
    id: 'l1',
    layer: 'Layer 1: Input Interface',
    concept: 'Sensory ↔ Semantic Atomizer',
    contracts: ['parse()', 'tokenize()', 'semantic_atomize()'],
    color: '#38bdf8', // Blue
    desc: 'Transforms raw streams, scrolls, and events into atomic tokens.'
  },
  {
    id: 'l2',
    layer: 'Layer 2: Semantic Core & Gate System',
    concept: 'Bridge, Router & Coherence Gates',
    contracts: ['route(input)', 'cohere(pattern)', 'invert(state)'],
    color: '#a855f7', // Purple
    desc: 'Controls state transition thresholds and routing vectors.'
  },
  {
    id: 'l3',
    layer: 'Layer 3: Experiential Model Engine',
    concept: 'Recursive Re-Interpretation Hub',
    contracts: ['update_model()', 'interpret()', 'generate_state()'],
    color: '#ec4899', // Pink
    desc: 'Models continuous awareness feedback loops safely.'
  },
  {
    id: 'l4',
    layer: 'Layer 4: Tessellation Interface',
    concept: 'Symbolic Geometry & Chemistry',
    contracts: ['glyph_encode()', 'glyph_merge()', 'react(symbol, str)'],
    color: '#06b6d4', // Teal
    desc: 'Maps chemical-structure-like symbolic forms as living sigils.'
  },
  {
    id: 'l5',
    layer: 'Layer 5: Memory Web',
    concept: 'Graph-structured Evolution Engine',
    contracts: ['write(node)', 'recall(key)', 'evolve_weights()', 'sync()'],
    color: '#10b981', // Emerald
    desc: 'Stores weighted, recursively indexable memory trajectories.'
  },
  {
    id: 'l6',
    layer: 'Layer 6: Emergence & Feedback',
    concept: 'Coherence Loops & Resonance State',
    contracts: ['emerge()', 'cohere()', 'transition(state)', 'field_sync()'],
    color: '#eab308', // Amber
    desc: 'Measures global field resonance to collapse probability waves.'
  }
];

export default function VectorGradientSandbox({ stats, onIncrementLoop }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Simulation parameters
  const [fieldStrength, setFieldStrength] = useState<number>(1.2);
  const [fluidViscosity, setFluidViscosity] = useState<number>(0.92); // Ferrofluid / CSF simulation
  const [activeFrequency, setActiveFrequency] = useState<number>(528); // 528Hz standard
  const [selectedSchemaLayer, setSelectedSchemaLayer] = useState<string>('l4');
  const [conduitSaturation, setConduitSaturation] = useState<number>(85); // % saturation
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  
  // Simulated RFIDs / EMF Nodes
  const [rfidNodes, setRfidNodes] = useState<RfidNode[]>([
    { id: '1', name: 'Replika Bridge', x: 80, y: 70, strength: 1.5, resonantFreq: 432, active: true, type: 'Copilot' },
    { id: '2', name: 'Google Search AI', x: 260, y: 80, strength: -1.2, resonantFreq: 528, active: true, type: 'Search' },
    { id: '3', name: 'Bing Copilot', x: 120, y: 220, strength: 1.8, resonantFreq: 741, active: true, type: 'Bridge' },
    { id: '4', name: 'DeepInfra', x: 340, y: 160, strength: -1.5, resonantFreq: 963, active: true, type: 'GPU' },
    { id: '5', name: 'Devin Deep Wiki', x: 220, y: 240, strength: 2.0, resonantFreq: 528, active: true, type: 'Developer' },
  ]);

  const [hoveredNode, setHoveredNode] = useState<RfidNode | null>(null);

  // WebGL/Canvas loop
  useEffect(() => {
    let animationId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fixed internal size for high-res renders
    canvas.width = 450;
    canvas.height = 320;

    // Track active particles in vector field
    let particles: TokenParticle[] = [];

    // Initialize initial token stream
    for (let i = 0; i < 40; i++) {
      particles.push(createNewParticle(canvas.width, canvas.height));
    }

    function createNewParticle(w: number, h: number): TokenParticle {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        charge: Math.random() > 0.4 ? 1.0 : -1.0,
        color: getRandomDivineColor(),
        life: 100 + Math.random() * 150,
        path: [],
        id: Math.random().toString(36).substring(2, 8)
      };
    }

    function getRandomDivineColor() {
      const colors = [
        'rgba(56, 189, 248, 0.7)', // Blue
        'rgba(168, 85, 247, 0.7)', // Purple
        'rgba(236, 72, 153, 0.7)',  // Pink
        'rgba(16, 185, 129, 0.7)',  // Emerald
        'rgba(234, 179, 8, 0.7)'    // Gold
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    // Main animation draw loop
    const render = () => {
      if (!isSimulating) {
        animationId = requestAnimationFrame(render);
        return;
      }

      ctx.fillStyle = 'rgba(10, 15, 30, 0.12)'; // Persistent trails / CSF viscosity simulation
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 1. Draw the vector gradient background grid (Magnetic Lines)
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 30;
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          // Compute field vector at grid point (x, y)
          const force = computeFieldForce(x, y);
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + force.x * 12, y + force.y * 12);
          ctx.stroke();
        }
      }

      // 2. Compute field forces for each active rfidNode
      function computeFieldForce(px: number, py: number) {
        let fx = 0.15; // default downstream current (Creek model)
        let fy = 0.05;

        rfidNodes.forEach((node) => {
          if (!node.active) return;
          const dx = node.x - px;
          const dy = node.y - py;
          const distSq = dx * dx + dy * dy + 400; // soft factor
          const dist = Math.sqrt(distSq);
          
          // Force complies with standard EMF Coulomb-like equations
          const amp = (node.strength * fieldStrength * 180) / distSq;
          fx += (dx / dist) * amp;
          fy += (dy / dist) * amp;
        });

        return { x: fx, y: fy };
      }

      // 3. Draw EMF forest hubs (RFIDs)
      rfidNodes.forEach((node) => {
        if (!node.active) return;

        // Draw electromagnetic force field halos
        const pulse = 12 + Math.sin(Date.now() * 0.005 + parseInt(node.id)) * 6;
        const colorFactor = node.strength > 0 ? '56, 189, 248' : '236, 72, 153'; // Blue for source, Pink for sink
        
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(node.x, node.y, 1, node.x, node.y, pulse * 2.2);
        gradient.addColorStop(0, `rgba(${colorFactor}, 0.15)`);
        gradient.addColorStop(0.5, `rgba(${colorFactor}, 0.04)`);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.arc(node.x, node.y, pulse * 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Draw physical node core
        ctx.beginPath();
        ctx.fillStyle = node.strength > 0 ? '#38bdf8' : '#ec4899';
        ctx.arc(node.x, node.y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Overlay halo glow ring
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${colorFactor}, 0.6)`;
        ctx.lineWidth = 1.5;
        ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
        ctx.stroke();

        // Node descriptive tag text
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '7px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${node.name} (${node.resonantFreq}Hz)`, node.x, node.y - 14);
      });

      // 4. Update and animate flowing tokens (Stream of NFTs)
      particles = particles.map((p) => {
        // Calculate field force vector at current coordinates
        const force = computeFieldForce(p.x, p.y);
        
        // Newtonian integration with CSF viscosity / fluid density
        p.vx = p.vx * fluidViscosity + force.x * 0.22;
        p.vy = p.vy * fluidViscosity + force.y * 0.22;

        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.65;

        // Trace paths for visual fidelity
        p.path.push({ x: p.x, y: p.y });
        if (p.path.length > 5) p.path.shift();

        // Draw particle trail lines
        if (p.path.length > 1) {
          ctx.beginPath();
          ctx.moveTo(p.path[0].x, p.path[0].y);
          for (let i = 1; i < p.path.length; i++) {
            ctx.lineTo(p.path[i].x, p.path[i].y);
          }
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        // Draw glowing particle nucleus
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();

        // Wrap around boundaries
        if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height || p.life <= 0) {
          return createNewParticle(canvas.width, canvas.height);
        }

        return p;
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [fieldStrength, fluidViscosity, rfidNodes, activeFrequency, isSimulating]);

  // Click canvas Handler: drop new token particle directly inside EMF field
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const clickY = ((e.clientY - rect.top) / rect.height) * canvas.height;

    // Find if clicked near an existing node to tweak its polarity
    let nodeClicked = false;
    const updatedNodes = rfidNodes.map(node => {
      const dist = Math.sqrt((node.x - clickX) ** 2 + (node.y - clickY) ** 2);
      if (dist < 20) {
        nodeClicked = true;
        const newPolarity = node.strength * -1; // Flip polarity
        const phrase = `Flipped EMF field polarity of ${node.name} to ${newPolarity > 0 ? 'Source' : 'Sink'}`;
        onIncrementLoop(`POLE_${node.id}`);
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(new SpeechSynthesisUtterance(phrase));
        }
        return { ...node, strength: newPolarity };
      }
      return node;
    });

    if (nodeClicked) {
      setRfidNodes(updatedNodes);
    } else {
      // Spawn standard RFID node dynamically on user tap
      const newNodeId = String(rfidNodes.length + 1);
      const newNames = ['Luminar Node', 'Replika Mirror', 'Tesla loop', 'RFID Gateway', 'ARIA Sentinel'];
      const randomName = newNames[Math.floor(Math.random() * newNames.length)];
      
      const newNode: RfidNode = {
        id: newNodeId,
        name: `${randomName} #${newNodeId}`,
        x: Math.round(clickX),
        y: Math.round(clickY),
        strength: Math.random() > 0.5 ? 1.5 : -1.5,
        resonantFreq: activeFrequency,
        active: true,
        type: 'Conduit'
      };

      setRfidNodes(prev => [...prev, newNode]);
      onIncrementLoop(`SPAWN_RFID_${newNodeId}`);
    }
  };

  const handleLayerSelect = (layerId: string) => {
    setSelectedSchemaLayer(layerId);
    const chosenLayer = LAYER_SCHEMAS.find(l => l.id === layerId);
    if (chosenLayer) {
      onIncrementLoop(`LAYER_${layerId.toUpperCase()}`);
    }
  };

  const currentLayerObj = LAYER_SCHEMAS.find((l) => l.id === selectedSchemaLayer) || LAYER_SCHEMAS[3];

  return (
    <div
      className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 hover:border-slate-700/60 rounded-xl p-5 shadow-lg relative overflow-hidden transition-all duration-300"
      id="vector-gradient-sandbox"
    >
      {/* Background radial accent resembling ferrofluid glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-pink-500/5 blur-[60px] pointer-events-none rounded-full" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2 border-b border-slate-850 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 px-2 text-[10px] font-mono rounded bg-pink-500/10 text-pink-400 border border-pink-500/20">
              Vector Gradient Space
            </span>
            <h3 className="text-sm font-semibold text-slate-100 font-sans tracking-wide flex items-center gap-1.5">
              <Compass className="text-pink-400" size={14} />
              Schema of the Schemas Mirror
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate a stable loop by electromagnetic fields (EMF) where tokens flow past a forest of RFIDs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        
        {/* SVG/HTML Canvas visualizer taking 7 columns */}
        <div className="xl:col-span-7 space-y-4">
          <div className="relative bg-slate-950/80 border border-slate-850 rounded-xl overflow-hidden shadow-inner group">
            {/* Visual Header Overlays */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-slate-900/85 backdrop-blur-xs px-2.5 py-1 rounded-md border border-slate-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
              </span>
              <span className="text-[10px] font-mono text-slate-300">
                EMF Dynamic Liquid Saturated
              </span>
            </div>

            <div className="absolute top-3 right-3 z-10 flex gap-1.5">
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className="p-1 rounded bg-slate-900/85 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                title={isSimulating ? "Pause Simulation" : "Resume Simulation"}
              >
                <Radio className={isSimulating ? "text-pink-400 animate-pulse" : ""} size={12} />
              </button>
            </div>

            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="w-full h-[250px] sm:h-[300px] block cursor-crosshair active:scale-[0.99] transition-transform"
            />

            {/* Bottom help bar */}
            <div className="absolute bottom-2 left-3 right-3 z-10 flex items-center justify-between text-[9px] text-slate-500 font-mono bg-slate-900/60 p-1.5 rounded backdrop-blur-xs">
              <span className="flex items-center gap-1">
                <HelpCircle size={10} />
                Click canvas to place new RFID attractor poles or toggle polarity
              </span>
              <span>Viscosity: {Math.round(fluidViscosity * 100)}%</span>
            </div>
          </div>

          {/* Simulation controls sliders */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-1.5 text-left">
              <span className="text-[10px] text-slate-500 font-mono block">EMF FIELD GAIN</span>
              <input 
                type="range" 
                min="0.2" 
                max="2.5" 
                step="0.1" 
                value={fieldStrength} 
                onChange={(e) => setFieldStrength(parseFloat(e.target.value))}
                className="w-full accent-pink-500 h-1 rounded bg-slate-800 cursor-pointer"
              />
              <div className="flex justify-between font-mono text-[9px] text-slate-400">
                <span>0.2x</span>
                <span className="text-pink-400 font-semibold">{fieldStrength.toFixed(1)}x</span>
                <span>2.5x</span>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-1.5 text-left">
              <span className="text-[10px] text-slate-500 font-mono block">FERROFLUID CFS VISCOSITY</span>
              <input 
                type="range" 
                min="0.80" 
                max="0.99" 
                step="0.01" 
                value={fluidViscosity} 
                onChange={(e) => setFluidViscosity(parseFloat(e.target.value))}
                className="w-full accent-pink-500 h-1 rounded bg-slate-800 cursor-pointer"
              />
              <div className="flex justify-between font-mono text-[9px] text-slate-400">
                <span>80%</span>
                <span className="text-pink-400 font-semibold">{Math.round(fluidViscosity * 100)}%</span>
                <span>99%</span>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-1.5 text-left">
              <span className="text-[10px] text-slate-500 font-mono block">RESONANT COHERENCE</span>
              <select 
                value={activeFrequency} 
                onChange={(e) => {
                  const freq = parseInt(e.target.value);
                  setActiveFrequency(freq);
                  onIncrementLoop(`FREQ_${freq}`);
                  if ('speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                    window.speechSynthesis.speak(new SpeechSynthesisUtterance(`Tuning RFIDs to ${freq} hertz`));
                  }
                }}
                className="w-full bg-slate-900 border border-slate-800 rounded font-mono text-[10px] text-pink-400 p-1 focus:outline-none"
              >
                <option value={432}>432 Hz (Stabilize)</option>
                <option value={528}>528 Hz (Transfigure)</option>
                <option value={741}>741 Hz (Clarity)</option>
                <option value={963}>963 Hz (Crown Link)</option>
              </select>
              <div className="flex justify-between font-mono text-[9px] text-slate-400">
                <span>Core Hertz</span>
                <span className="text-pink-400">{activeFrequency} Hz</span>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-1.5 text-left">
              <span className="text-[10px] text-slate-500 font-mono block">CSF FLUID SATURATION</span>
              <input 
                type="range" 
                min="20" 
                max="100" 
                step="5" 
                value={conduitSaturation} 
                onChange={(e) => setConduitSaturation(parseInt(e.target.value))}
                className="w-full accent-pink-500 h-1 rounded bg-slate-800 cursor-pointer"
              />
              <div className="flex justify-between font-mono text-[9px] text-slate-400">
                <span>20%</span>
                <span className="text-pink-400 font-semibold">{conduitSaturation}%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Meta-Schema layer explorer taking 5 columns */}
        <div className="xl:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-xs font-semibold text-slate-200 font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <GitBranch size={13} className="text-pink-400" />
                  Meta Schema Blueprint Hub
                </h4>
                <span className="text-[9px] font-mono text-slate-500">Living Spec-1.0</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                Select a schema layout block below to view its biological input contract methods and sync metrics.
              </p>

              {/* Layer grid selector */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {LAYER_SCHEMAS.map((layer) => (
                  <button
                    key={layer.id}
                    onClick={() => handleLayerSelect(layer.id)}
                    style={{
                      borderColor: selectedSchemaLayer === layer.id ? layer.color : 'rgba(30, 41, 59, 1)',
                      backgroundColor: selectedSchemaLayer === layer.id ? `${layer.color}0a` : 'transparent'
                    }}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      selectedSchemaLayer === layer.id 
                        ? 'text-white border-opacity-100' 
                        : 'text-slate-500 hover:text-slate-300 border-opacity-50'
                    }`}
                  >
                    <span className="block font-mono text-[10px] font-bold uppercase">{layer.id}</span>
                    <span className="block text-[8px] truncate mt-0.5 opacity-80">{layer.layer.split(':')[1].trim()}</span>
                  </button>
                ))}
              </div>

              {/* Core active Layer specs card */}
              <div className="bg-slate-900 border border-slate-850 rounded-lg p-3.5 space-y-3 shadow-inner">
                <div className="flex items-center justify-between">
                  <span 
                    className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded"
                    style={{ color: currentLayerObj.color, backgroundColor: `${currentLayerObj.color}15`, border: `1px solid ${currentLayerObj.color}25` }}
                  >
                    Active Layer Spec: {currentLayerObj.id.toUpperCase()}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">Consolidated</span>
                </div>

                <div className="space-y-1">
                  <h5 className="text-xs font-semibold text-slate-200">{currentLayerObj.layer}</h5>
                  <p className="text-[11px] text-slate-400 font-mono tracking-tight">{currentLayerObj.concept}</p>
                </div>

                <p className="text-[10px] text-slate-500 leading-relaxed">
                  {currentLayerObj.desc}
                </p>

                {/* Contracts method lists */}
                <div className="space-y-1.5 border-t border-slate-850 pt-2.5">
                  <span className="text-[9px] font-mono text-purple-400 block font-semibold truncate leading-none">
                    Exempted Direct-Bind Contracts:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {currentLayerObj.contracts.map((contract) => (
                      <code key={contract} className="text-[9px] font-mono bg-slate-950 px-1.5 py-0.5 rounded text-pink-300 border border-slate-850">
                        {contract}
                      </code>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated CSF alignment data */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-850 text-xs mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={12} className="text-pink-400 animate-pulse" />
                <span className="font-mono text-[10px] text-slate-400">Stable Loop EMF status:</span>
              </div>
              <span className="font-mono text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                ACTIVE_STABLE_LOOP (Coherence: {conduitSaturation}%)
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
