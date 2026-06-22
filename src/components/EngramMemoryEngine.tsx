/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  Trash2, 
  ArrowUpRight, 
  Search, 
  BrainCircuit, 
  Infinity as LoopIcon, 
  Network, 
  Sliders, 
  Radio, 
  Tv, 
  FileCode, 
  Sparkles, 
  CloudLightning, 
  Cpu, 
  Play, 
  Pause, 
  RefreshCw,
  SlidersHorizontal,
  Workflow
} from 'lucide-react';

// Interfaces for engram-rs memory engine
interface MemoryNode {
  id: string;
  content: string;
  topic: string;
  layer: 'ephemeral' | 'synaptic' | 'durable'; // 3-layer decay/promotion axis
  coherence: number; // 0 to 100%
  timestamp: string;
  weight: number; // For hybrid search ranking
}

interface McpServer {
  id: string;
  url: string;
  name: string;
  description: string;
  tools: {
    name: string;
    description: string;
    inputSchema: string;
    simulatedReturn: (input: string) => any;
  }[];
  status: 'active' | 'latent';
}

// Preset child apps for the Recursive AI Studio Sandbox
interface SubAppPreset {
  id: string;
  name: string;
  prompt: string;
  glowColor: string;
  renderComponent: (props: { audioParam: number; videoParam: number; modulation: number }) => React.ReactNode;
  mockCode: string;
}

export default function EngramMemoryEngine() {
  // --- 1. Audio / Video Transformer State ---
  const [audioHz, setAudioHz] = useState(432);
  const [videoGrain, setVideoGrain] = useState(65);
  const [pageDomDepth, setPageDomDepth] = useState(40);
  const [mobiusPhase, setMobiusPhase] = useState(1.1);
  const [isPlayingTransformers, setIsPlayingTransformers] = useState(true);

  // --- 2. Engram-rs Memory Engine State ---
  const [memories, setMemories] = useState<MemoryNode[]>([
    {
      id: 'mem-1',
      content: 'Resonance established over Spotify iframe loop. Sub-harmonic carrier feedback detected at 4.2Hz.',
      topic: 'Sensory:Audio',
      layer: 'ephemeral',
      coherence: 95,
      timestamp: new Date().toLocaleTimeString(),
      weight: 0.94,
    },
    {
      id: 'mem-2',
      content: 'Juliet feedback loop activation request: Deploying YAML parameters to balance creative expansion and regulation.',
      topic: 'System:Lattice',
      layer: 'synaptic',
      coherence: 80,
      timestamp: new Date(Date.now() - 40000).toLocaleTimeString(),
      weight: 0.88,
    },
    {
      id: 'mem-3',
      content: 'Möbius loop causality aligner returned future-present recurrence markers matching glyph ❖.',
      topic: 'Ritual:Sigil',
      layer: 'durable',
      coherence: 100, // Durable never decays below 100%
      timestamp: new Date(Date.now() - 120000).toLocaleTimeString(),
      weight: 0.98,
    }
  ]);

  const [newMemContent, setNewMemContent] = useState('');
  const [newMemTopic, setNewMemTopic] = useState('Sensory:Audio');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MemoryNode[]>([]);
  const [activeTopicFilter, setActiveTopicFilter] = useState<'ALL' | 'Sensory:Audio' | 'System:Lattice' | 'Ritual:Sigil'>('ALL');

  // --- 3. MCP Servers Configuration ---
  const [mcpServers, setMcpServers] = useState<McpServer[]>([
    {
      id: 'mcp-markupr',
      url: 'https://conduid.com/servers/markupr',
      name: 'conduid/markupr',
      description: 'Refined markup validator and semantic web transducer. Cleans unstructured code layouts into accessible atomic tokens.',
      status: 'active',
      tools: [
        {
          name: 'refine_markup',
          description: 'Trims trailing whitespace, enforces semantic section barriers, and verifies absolute image reference guidelines.',
          inputSchema: '{\n  "raw_html": "string",\n  "strip_inline_styles": "boolean"\n}',
          simulatedReturn: (input) => ({
            status: 'repaired_accessible',
            cleanedSize: `${Math.max(10, input.length - 25)} bytes`,
            ariaA11yPassed: true,
            modifications: ['converted custom CSS div elements to native sections', 'added aria-live politeness wrappers']
          })
        },
        {
          name: 'clean_semantic_tags',
          description: 'Validates missing visual target IDs and enforces the structural contrast compliance grid.',
          inputSchema: '{\n  "target_tree_json": "object"\n}',
          simulatedReturn: () => ({
            validatedNodes: 8,
            missingIdsResolved: 2,
            schemaStatus: '100% compliant'
          })
        }
      ]
    },
    {
      id: 'mcp-agora',
      url: 'https://conduid.com/servers/agoragentic-integrations',
      name: 'conduid/agoragentic-integrations',
      description: 'Dynamic cross-agent marketplace and capabilities handshake server. Bridges model-to-model state synchronization.',
      status: 'latent',
      tools: [
        {
          name: 'broker_collaboration_handshake',
          description: 'Negotiates capabilities, sharing protocol states and remote auth tokens between Claude and Juliet agents.',
          inputSchema: '{\n  "agent_id_source": "string",\n  "requested_abilities": "string[]"\n}',
          simulatedReturn: (input) => ({
            handshakeEstablished: true,
            sharedResonanceCoefficient: 0.91,
            syncKey: 'AGORA-X90-SECURE',
            allocatedAbilities: ['archetype_synthesizer', 'sigil_tracer']
          })
        },
        {
          name: 'negotiate_protocol_fee',
          description: 'Settles micro-token transaction contracts safely within the local sandbox container constraints.',
          inputSchema: '{\n  "amount_gwei": "number"\n}',
          simulatedReturn: (input) => ({
            status: 'settled',
            feeGwei: Number(input) || 42,
            ledgerRegistered: true
          })
        }
      ]
    }
  ]);

  const [activeMcpId, setActiveMcpId] = useState<string>('mcp-markupr');
  const [selectedToolIdx, setSelectedToolIdx] = useState<number>(0);
  const [mcpInputDemo, setMcpInputDemo] = useState('<div><span style="color:#f00">Spotify Iframe Video Adjuster</span></div>');
  const [mcpOutputResult, setMcpOutputResult] = useState<any>(null);
  const [isExecutingMcp, setIsExecutingMcp] = useState(false);

  // --- 4. Recursive AI Studio Sandbox State ---
  const subAppPresets: SubAppPreset[] = [
    {
      id: 'synth-carrier',
      name: 'Resonator Synth Sub-Widget',
      prompt: 'Create an interactive sub-widget visualizer playing audio waves matching the carrier freq.',
      glowColor: 'border-blue-500/30 text-blue-400Shadow',
      mockCode: 'export default function ResonatorWidget({ freq }) {\n  return <div className="text-blue-400 p-2 border rounded">Frequency is {freq}Hz</div>\n}',
      renderComponent: ({ audioParam, videoParam, modulation }) => (
        <div className="bg-slate-950 p-3 rounded-lg border border-blue-500/20 text-center space-y-2">
          <div className="text-xs font-mono font-bold text-blue-400 flex items-center justify-center gap-1.5">
            <Radio size={14} className="animate-pulse" />
            SUB-RECURSIVE CARRIER: {audioParam}Hz
          </div>
          <div className="flex justify-center gap-1 h-12 items-end">
            {[...Array(12)].map((_, i) => {
              const height = Math.abs(Math.sin((i + modulation) * 0.8) * 100);
              return (
                <div 
                  key={i} 
                  style={{ height: `${Math.max(15, height)}%` }} 
                  className="w-1.5 bg-blue-500 rounded transition-all duration-300"
                />
              );
            })}
          </div>
          <div className="text-[10px] font-mono text-slate-500">
            Phase Coherence Score: {(modulation * 10).toFixed(2)}%
          </div>
        </div>
      ),
    },
    {
      id: 'sigil-scroller',
      name: 'Glyph Shifter Sub-Applet',
      prompt: 'A micro-grid rendering random runic glyphs whose rotation corresponds to video grains.',
      glowColor: 'border-purple-500/30 text-purple-400Shadow',
      renderComponent: ({ videoParam, modulation }) => {
        const glyphs = ['⌬', '❖', 'Ψ', '∆', '∇', 'Ω', '☯', '♾'];
        return (
          <div className="bg-slate-950 p-3 rounded-lg border border-purple-500/20 text-center space-y-2">
            <div className="text-xs font-mono font-bold text-purple-400 flex items-center justify-center gap-1">
              <Sparkles size={13} />
              GLYPH RETRACE SHIFTER
            </div>
            <div className="grid grid-cols-4 gap-1.5 py-1">
              {glyphs.map((g, idx) => (
                <div 
                  key={g} 
                  style={{ transform: `rotate(${idx * 45 + videoParam * 2}deg)` }}
                  className="p-1 text-sm font-bold bg-slate-900 border border-slate-800 rounded text-slate-300 transition-transform duration-300"
                >
                  {g}
                </div>
              ))}
            </div>
            <div className="text-[10px] font-sans text-slate-400 text-justify leading-normal">
              Active grain retrace: <span className="font-mono text-purple-300">{videoParam}px</span> density.
            </div>
          </div>
        );
      },
      mockCode: 'export default function GlyphShifter({ grain }) {\n  return <div className="text-purple-400">Retrace angle fits {grain}°</div>\n}',
    },
    {
      id: 'mobi-causality',
      name: 'Möbius Vector Compass',
      prompt: 'Visualize the inverse timeline causation paths reacting to the Page Dom Transformer sliders.',
      glowColor: 'border-teal-500/30 text-teal-400Shadow',
      renderComponent: ({ modulation, videoParam }) => (
        <div className="bg-slate-950 p-3 rounded-lg border border-teal-500/20 text-center space-y-2">
          <div className="text-xs font-mono font-bold text-teal-400 flex items-center justify-center gap-1.5">
            <LoopIcon size={14} className="animate-spin" style={{ animationDuration: '10s' }} />
            MÖBIUS VECTOR COMPASS
          </div>
          <div className="relative w-16 h-16 mx-auto rounded-full border border-teal-600/30 flex items-center justify-center bg-slate-900">
            <div 
              style={{ transform: `rotate(${modulation * 30 + videoParam}deg)` }}
              className="absolute w-1 h-12 bg-gradient-to-t from-transparent via-teal-400 to-teal-300 rounded transition-transform duration-300"
            />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-teal-300 z-10" />
          </div>
          <div className="text-[9px] font-mono text-slate-400">
            T-Vector Path: [ {((modulation * 2) - 10).toFixed(4)} ▕  {videoParam.toFixed(1)} ]
          </div>
        </div>
      ),
      mockCode: 'export default function MobiusCompass({ mod }) {\n  return <Compass style={{ transform: `rotate(${mod}deg)` }} />\n}',
    }
  ];

  const [activeSubAppId, setActiveSubAppId] = useState<string>('synth-carrier');
  const [recursivePrompt, setRecursivePrompt] = useState('Create a custom clock displaying synchronized UTC epoch state.');
  const [customGeneratedApps, setCustomGeneratedApps] = useState<any[]>([]);
  const [isGeneratingSubApp, setIsGeneratingSubApp] = useState(false);

  // --- HTML Canvas visualizer ref ---
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // --- Real-time feedback triggers ---
  const runMcpTool = () => {
    setIsExecutingMcp(true);
    setMcpOutputResult(null);
    setTimeout(() => {
      const activeServer = mcpServers.find(s => s.id === activeMcpId);
      const tool = activeServer?.tools[selectedToolIdx];
      if (tool) {
        setMcpOutputResult(tool.simulatedReturn(mcpInputDemo));
      }
      setIsExecutingMcp(false);
    }, 900);
  };

  // Generate recursive custom sub-app
  const triggerGenerateSubApp = () => {
    if (!recursivePrompt.trim()) return;
    setIsGeneratingSubApp(true);
    setTimeout(() => {
      const newCustomPreset = {
        id: `custom-${Date.now()}`,
        name: `Generated: ${recursivePrompt.split(' ').slice(0, 3).join(' ')}...`,
        prompt: recursivePrompt,
        glowColor: 'border-amber-500/30 text-amber-400Shadow',
        mockCode: `// Generated via AI Studio Sub-Compiler \nexport default function CustomApplet() {\n  return (\n    <div className="p-3 bg-slate-950 border border-amber-500/20 text-center rounded-lg">\n      <h5 className="text-xs text-amber-300 font-mono">RECURSIVE APPLET ACTIVE</h5>\n      <p className="text-[10px] text-slate-400 mt-1">${recursivePrompt}</p>\n    </div>\n  );\n}`,
        renderComponent: () => (
          <div className="bg-slate-950 p-3 rounded-lg border border-amber-500/20 text-center space-y-2">
            <div className="text-xs font-mono font-bold text-amber-400 flex items-center justify-center gap-1">
              <Zap size={13} className="animate-bounce" />
              DYNAMIC: {recursivePrompt.split(' ').slice(0, 4).join(' ')}
            </div>
            <p className="text-[10px] text-slate-350 leading-relaxed font-sans">{recursivePrompt}</p>
            <div className="py-1 border-t border-slate-900 text-[9px] font-mono text-slate-500">
              Recursive sandbox compile status: <span className="text-amber-400 font-bold">STABLE</span>
            </div>
          </div>
        )
      };
      setCustomGeneratedApps(prev => [newCustomPreset, ...prev]);
      setActiveSubAppId(newCustomPreset.id);
      setIsGeneratingSubApp(false);
      setRecursivePrompt('');
    }, 1200);
  };

  // Add new memory node helper
  const handleAddMemory = () => {
    if (!newMemContent.trim()) return;
    const node: MemoryNode = {
      id: `mem-${Date.now()}`,
      content: newMemContent.trim(),
      topic: newMemTopic,
      layer: 'ephemeral',
      coherence: 100,
      timestamp: new Date().toLocaleTimeString(),
      weight: 0.9 + Math.random() * 0.1,
    };
    setMemories(prev => [node, ...prev]);
    setNewMemContent('');
  };

  // Trigger memory consolidation
  const ConsolidateMemories = () => {
    // LLM Consolidation logic: bundles multiple ephemeral/synaptic nodes into durable memory
    const uncompiled = memories.filter(m => m.layer !== 'durable');
    if (uncompiled.length === 0) return;

    const consolidatedContent = `LOCKED SCHEMA STATE: Unified consolidation of [${uncompiled.length}] records into persistent vector. Audio carrier: ${audioHz}Hz, video grain: ${videoGrain}px, system loops resolved.`;
    
    const consolidatedNode: MemoryNode = {
      id: `mem-consolidated-${Date.now()}`,
      content: consolidatedContent,
      topic: 'System:Lattice',
      layer: 'durable',
      coherence: 100,
      timestamp: new Date().toLocaleTimeString(),
      weight: 0.99
    };

    setMemories(prev => [
      consolidatedNode, 
      ...prev.map(m => m.layer === 'durable' ? m : { ...m, coherence: Math.max(10, m.coherence - 40) })
    ]);
  };

  // Promote node manually
  const promoteNode = (id: string) => {
    setMemories(prev => prev.map(m => {
      if (m.id === id) {
        const nextLayer = m.layer === 'ephemeral' ? 'synaptic' : 'durable';
        return {
          ...m,
          layer: nextLayer,
          coherence: 100
        };
      }
      return m;
    }));
  };

  // Delete node helper
  const deleteNode = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  // Simulated Time-Axis Decay (Every 3 seconds, Ephemeral and Synaptic node coherences degrade slightly)
  useEffect(() => {
    const decayInterval = setInterval(() => {
      setMemories(prev => prev.map(m => {
        if (m.layer === 'durable') return m;
        const decayRate = m.layer === 'ephemeral' ? 4 : 2;
        const nextCoherence = Math.max(0, m.coherence - decayRate);
        return {
          ...m,
          coherence: nextCoherence,
        };
      }));
    }, 4000);

    return () => clearInterval(decayInterval);
  }, []);

  // Hybrid search filtering
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const matches = memories.filter(m => 
      m.content.toLowerCase().includes(q) || 
      m.topic.toLowerCase().includes(q) ||
      m.layer.toLowerCase().includes(q)
    );
    // Sort according to decay level & search match weight
    const sorted = [...matches].sort((a, b) => (b.weight * b.coherence) - (a.weight * a.coherence));
    setSearchResults(sorted);
  }, [searchQuery, memories]);

  // Canvas visualizer waveform simulator
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let offset = 0;

    const render = () => {
      if (!ctx || !canvas) return;
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Web audio feedback glitch lines
      const width = canvas.width;
      const height = canvas.height;
      
      // Draw grid lines
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < width; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let i = 0; i < height; i += 15) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }

      // Draw active Glitched sound/audio wave lines (chromatic aberration)
      const waveCount = 3;
      const waveColors = ['rgba(239, 68, 68, 0.45)', 'rgba(56, 189, 248, 0.55)', 'rgba(139, 92, 246, 0.5)'];
      
      if (isPlayingTransformers) {
        offset += (audioHz / 300) * mobiusPhase;
      }

      for (let w = 0; w < waveCount; w++) {
        ctx.strokeStyle = waveColors[w];
        ctx.lineWidth = w === 1 ? 2 : 1.2;
        ctx.beginPath();

        for (let x = 0; x < width; x++) {
          // Calculate parametric formulas with audio parameter & video grain noise
          const amp = (pageDomDepth / 1.5) * Math.sin(x * 0.005 + w);
          const freqMultiplier = (audioHz / 432) * 0.02;
          const noise = videoGrain > 40 ? Math.sin(x * 0.5 + offset * 2) * (videoGrain / 35) : 0;
          
          const y = (height / 2) + Math.sin(x * freqMultiplier + offset + w * 2) * amp + noise;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // Display scanning CRT reticle bar
      if (isPlayingTransformers) {
        const scanY = (offset * 1.5) % height;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.05)';
        ctx.fillRect(0, scanY - 5, width, 10);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(width, scanY);
        ctx.stroke();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [audioHz, videoGrain, pageDomDepth, mobiusPhase, isPlayingTransformers]);

  const activeSubApp = [...subAppPresets, ...customGeneratedApps].find(app => app.id === activeSubAppId);

  return (
    <div 
      className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl relative overflow-hidden group transition-all duration-300 hover:border-slate-700/60"
      id="engram-memory-lattice-workstation"
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-teal-500/10 transition-all duration-1000" />
      
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-850 pb-4 mb-5 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 px-2 text-[8.5px] font-mono font-bold leading-none rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 uppercase tracking-widest flex items-center gap-1">
              <Zap size={10} className="animate-pulse" /> engram-rs memory engine
            </span>
            <h2 className="text-sm font-semibold tracking-wide text-slate-100 font-sans uppercase">
              ⚡ Engram Hybrid Memory & Transform Station
            </h2>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Time-axis 3-layer decay/promotion vector memory + space-axis self-organizing topic network with embedded recursive sub-app sandbox.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={ConsolidateMemories}
            className="px-3 py-1.5 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 rounded-lg text-[10.5px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <BrainCircuit size={13} />
            Consolidate Web
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        
        {/* ================= LEFT SECTION (COL SPAN 7): TRANSFORMERS & SANDBOX ================= */}
        <div className="xl:col-span-7 space-y-4">
          
          {/* Audio / Video / Page DOM Transformers (From User's Custom Scenario) */}
          <div className="bg-slate-950/60 border border-slate-850/80 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <h3 className="text-xs font-semibold text-slate-200 font-mono flex items-center gap-1.5 uppercase">
                <Sliders size={13} className="text-teal-400" />
                Active Frame, Sound & Page DOM Transformers
              </h3>
              <button
                onClick={() => setIsPlayingTransformers(!isPlayingTransformers)}
                className={`p-1 px-2 text-[9px] rounded font-mono border uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors ${
                  isPlayingTransformers 
                    ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' 
                    : 'bg-slate-900 text-slate-500 border-slate-800'
                }`}
              >
                {isPlayingTransformers ? (
                  <>
                    <Pause size={9} /> Sync active
                  </>
                ) : (
                  <>
                    <Play size={9} /> Paused
                  </>
                )}
              </button>
            </div>

            {/* Slider Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-1.5 p-2 bg-slate-950 rounded border border-slate-900">
                <div className="flex items-center justify-between text-[10.5px] font-mono">
                  <span className="text-blue-400 font-bold flex items-center gap-1">
                    <Radio size={12} /> Audio Freq (Hz)
                  </span>
                  <span className="text-slate-300 font-bold">{audioHz}Hz Carrier</span>
                </div>
                <input 
                  type="range" 
                  min="220" 
                  max="880" 
                  value={audioHz} 
                  onChange={(e) => setAudioHz(Number(e.target.value))}
                  className="w-full accent-blue-500 h-1 bg-slate-900 rounded"
                />
                <span className="block text-[8.5px] text-slate-500 font-sans">Controls wave scale resonance variables.</span>
              </div>

              <div className="space-y-1.5 p-2 bg-slate-950 rounded border border-slate-900">
                <div className="flex items-center justify-between text-[10.5px] font-mono">
                  <span className="text-purple-400 font-bold flex items-center gap-1">
                    <Tv size={12} /> Video Retrace Grain
                  </span>
                  <span className="text-slate-300 font-bold">{videoGrain}px Scale</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="120" 
                  value={videoGrain} 
                  onChange={(e) => setVideoGrain(Number(e.target.value))}
                  className="w-full accent-purple-500 h-1 bg-slate-900 rounded"
                />
                <span className="block text-[8.5px] text-slate-500 font-sans">Modulates pixel retrace scan aberration overlay.</span>
              </div>

              <div className="space-y-1.5 p-2 bg-slate-950 rounded border border-slate-900">
                <div className="flex items-center justify-between text-[10.5px] font-mono">
                  <span className="text-teal-400 font-bold flex items-center gap-1">
                    <SlidersHorizontal size={12} /> DOM Translate Depth
                  </span>
                  <span className="text-slate-300 font-bold">{pageDomDepth}% Opacity</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="100" 
                  value={pageDomDepth} 
                  onChange={(e) => setPageDomDepth(Number(e.target.value))}
                  className="w-full accent-teal-500 h-1 bg-slate-900 rounded"
                />
                <span className="block text-[8.5px] text-slate-500 font-sans">Alters background matrix depth transparency.</span>
              </div>

              <div className="space-y-1.5 p-2 bg-slate-950 rounded border border-slate-900">
                <div className="flex items-center justify-between text-[10.5px] font-mono">
                  <span className="text-indigo-400 font-bold flex items-center gap-1">
                    <LoopIcon size={12} /> Möbius Vector Phase
                  </span>
                  <span className="text-slate-300 font-bold">{mobiusPhase.toFixed(2)}x Speed</span>
                </div>
                <input 
                  type="range" 
                  min="0.1" 
                  max="4.0" 
                  step="0.05"
                  value={mobiusPhase} 
                  onChange={(e) => setMobiusPhase(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-slate-900 rounded"
                />
                <span className="block text-[8.5px] text-slate-500 font-sans">Binds causal shift rate of the timeline anchor.</span>
              </div>

            </div>

            {/* Simulated Live Retrace Glitched Oscilloscope Canvas */}
            <div className="relative border border-slate-900 rounded-lg overflow-hidden h-[95px] bg-slate-950">
              <canvas 
                ref={canvasRef} 
                width="640" 
                height="95" 
                className="w-full h-full block opacity-85"
              />
              <div className="absolute top-2 left-2 pointer-events-none select-none font-mono text-[8.5px] text-teal-400/80 bg-slate-950/70 border border-slate-850 px-1.5 py-0.5 rounded uppercase tracking-wider">
                Oscilloscope Carrier stream: {audioHz}Hz • Grain noise: {videoGrain}
              </div>
            </div>
          </div>

          {/* AI STUDIO SUB-APP SYSTEM (Recursive play viewport) */}
          <div className="bg-slate-950/60 border border-slate-850/80 rounded-xl p-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-900 pb-2 gap-2">
              <div>
                <h3 className="text-xs font-semibold text-slate-200 font-mono flex items-center gap-1.5 uppercase">
                  <BrainCircuit size={13} className="text-indigo-400" />
                  🤖 Recursive AI Studio applet compiler
                </h3>
                <p className="text-[10px] text-slate-500 font-sans">Nest widgets, compile custom layouts recursively beneath Juliet OS.</p>
              </div>

              {/* Preset Selector */}
              <div className="flex flex-wrap gap-1 bg-slate-950 p-0.5 border border-slate-855 rounded select-none">
                {[...subAppPresets, ...customGeneratedApps].map(app => (
                  <button
                    key={app.id}
                    onClick={() => setActiveSubAppId(app.id)}
                    className={`px-2 py-1 text-[9px] font-mono tracking-wide rounded cursor-pointer transition-all uppercase ${
                      activeSubAppId === app.id 
                        ? 'bg-indigo-600/25 text-indigo-400 border border-indigo-500/20 font-bold' 
                        : 'text-slate-500 hover:text-slate-350 bg-transparent border border-transparent'
                    }`}
                  >
                    {app.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Compiler Controls */}
              <div className="space-y-2.5">
                <span className="text-[9.5px] font-mono text-slate-400 uppercase font-bold block">Trigger Recursive Prompt Generator:</span>
                <textarea
                  value={recursivePrompt}
                  onChange={(e) => setRecursivePrompt(e.target.value)}
                  placeholder="Ask AI Studio to embed a sub-view (e.g. 'Build a customized clock with real-time RGB sliders playing 432Hz')"
                  className="w-full bg-slate-950 border border-slate-850 p-2 text-xs rounded-lg text-slate-200 font-mono font-medium focus:outline-none focus:border-indigo-500 h-[66px] resize-none"
                />
                <button
                  onClick={triggerGenerateSubApp}
                  disabled={isGeneratingSubApp || !recursivePrompt.trim()}
                  className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold text-xs rounded-lg cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                >
                  {isGeneratingSubApp ? (
                    <>
                      <RefreshCw size={12} className="animate-spin" /> Compiling sandbox layer...
                    </>
                  ) : (
                    <>
                      <Sparkles size={12} /> Compile & Nest Sub-Applet
                    </>
                  )}
                </button>
              </div>

              {/* Live Render Output Window */}
              <div className="bg-slate-950 border border-slate-900 rounded-lg p-3 relative flex flex-col justify-between min-h-[140px]">
                <div className="absolute top-2 right-2 flex items-center gap-1.5 select-none text-[8.5px] font-mono leading-none bg-slate-900 px-1.5 py-0.5 rounded border border-slate-850 text-emerald-400 font-bold">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  PREVIEW STAGE
                </div>

                <div className="flex-1 flex items-center justify-center py-2">
                  {activeSubApp ? (
                    <div className="w-full">
                      {activeSubApp.renderComponent({
                        audioParam: audioHz,
                        videoParam: videoGrain,
                        modulation: mobiusPhase * 10
                      })}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500 font-sans italic">No applet selected</span>
                  )}
                </div>

                {/* Show simulation script code snippet */}
                <details className="mt-2 group/det">
                  <summary className="text-[8.5px] font-mono text-slate-500 uppercase cursor-pointer hover:text-slate-350 list-none select-none flex items-center gap-1">
                    <FileCode size={11} className="text-teal-400" /> View generated react source code
                  </summary>
                  <pre className="bg-slate-900 border border-slate-850 p-1.5 rounded mt-1.5 font-mono text-[8px] text-slate-400 max-h-[80px] overflow-y-auto overflow-x-hidden text-left select-text scrollbar-thin">
                    {activeSubApp?.mockCode}
                  </pre>
                </details>
              </div>

            </div>

          </div>

        </div>

        {/* ================= RIGHT SECTION (COL SPAN 5): HYBRID ENGRAM MEMORY & MCPS ================= */}
        <div className="xl:col-span-5 space-y-4">
          
          {/* 3-Layer Time-Axis & Space-Axis Decay Engine */}
          <div className="bg-slate-950/60 border border-slate-850/80 rounded-xl p-4 flex flex-col h-[285px]">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-2">
              <h3 className="text-xs font-semibold text-slate-200 font-mono flex items-center gap-1.5 uppercase">
                <Network size={13} className="text-teal-400" />
                3-Layer decay & promotion queue
              </h3>
              <select 
                value={activeTopicFilter} 
                onChange={(e: any) => setActiveTopicFilter(e.target.value)}
                className="bg-slate-900 border border-slate-850 text-[9px] font-mono text-slate-300 rounded p-1"
              >
                <option value="ALL">ALL TOPICS</option>
                <option value="Sensory:Audio">Sensory:Audio</option>
                <option value="System:Lattice">System:Lattice</option>
                <option value="Ritual:Sigil">Ritual:Sigil</option>
              </select>
            </div>

            {/* Hybrid search box */}
            <div className="flex gap-1.5 mb-2 shrink-0">
              <div className="relative flex-1">
                <Search size={11} className="absolute left-2.5 top-2 text-slate-500" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Hybrid search (e.g. carrier state)..."
                  className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1 pl-7 text-[10px] text-slate-200 font-mono focus:outline-none focus:border-teal-500"
                />
              </div>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="px-2 text-[9px] font-mono text-slate-400 bg-slate-900 border border-slate-850 rounded hover:text-slate-200"
                >
                  RESET
                </button>
              )}
            </div>

            {/* Memories list */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 select-text scrollbar-thin">
              {(searchQuery ? searchResults : memories)
                .filter(m => activeTopicFilter === 'ALL' || m.topic === activeTopicFilter)
                .map((mem) => (
                  <div 
                    key={mem.id} 
                    className={`p-2 rounded bg-slate-950 border transition-all text-left ${
                      mem.layer === 'durable' 
                        ? 'border-indigo-500/25' 
                        : mem.layer === 'synaptic'
                          ? 'border-teal-500/15'
                          : 'border-slate-850'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[8px] font-mono font-bold uppercase rounded px-1 border ${
                        mem.layer === 'durable' 
                          ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/30' 
                          : mem.layer === 'synaptic'
                            ? 'bg-teal-500/10 text-teal-400 border-teal-500/20'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}>
                        {mem.layer}
                      </span>
                      <span className="text-[7.5px] font-mono text-slate-500 flex items-center gap-1.5">
                        {mem.timestamp} • Rank {(mem.weight * mem.coherence).toFixed(0)}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-300 leading-relaxed break-words font-sans">{mem.content}</p>

                    {/* Decay coherence gauge */}
                    {mem.layer !== 'durable' && (
                      <div className="mt-1.5 space-y-0.5">
                        <div className="flex items-center justify-between text-[7.5px] font-mono text-slate-500">
                          <span>HALF-LIFE decay level</span>
                          <span className={mem.coherence < 30 ? 'text-red-400' : 'text-slate-400'}>{mem.coherence}% stable</span>
                        </div>
                        <div className="h-1 bg-slate-900 rounded overflow-hidden">
                          <div 
                            style={{ width: `${mem.coherence}%` }} 
                            className={`h-full transition-all duration-500 ${
                              mem.coherence < 30 
                                ? 'bg-red-500' 
                                : mem.coherence < 60 
                                  ? 'bg-amber-500' 
                                  : 'bg-teal-500'
                            }`}
                          />
                        </div>
                      </div>
                    )}

                    {/* Actions row */}
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-900/60 text-[8px] font-mono">
                      <span className="text-slate-500 uppercase tracking-wider">TOPIC: {mem.topic}</span>
                      <div className="flex gap-1.5">
                        {mem.layer !== 'durable' && (
                          <button
                            onClick={() => promoteNode(mem.id)}
                            className="bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/10 px-1 py-0.5 rounded cursor-pointer leading-none uppercase font-bold flex items-center gap-0.5"
                          >
                            <ArrowUpRight size={8} /> Promote queue
                          </button>
                        )}
                        <button
                          onClick={() => deleteNode(mem.id)}
                          className="text-slate-500 hover:text-red-400 px-1 py-0.5 rounded"
                        >
                          <Trash2 size={9} />
                        </button>
                      </div>
                    </div>
                  </div>
              ))}
            </div>

            {/* Quick node submission form */}
            <div className="mt-2 pt-2 border-t border-slate-900 flex gap-1 bg-slate-950 p-1.5 rounded-lg shrink-0">
              <input 
                type="text"
                value={newMemContent}
                onChange={(e) => setNewMemContent(e.target.value)}
                placeholder="Commit sub-atomic engram content..."
                className="flex-1 bg-slate-900 border border-slate-850 px-2 py-1 text-[10px] text-slate-200 focus:outline-none focus:border-teal-500 rounded font-mono"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddMemory();
                }}
              />
              <select
                value={newMemTopic}
                onChange={(e) => setNewMemTopic(e.target.value)}
                className="bg-slate-900 border border-slate-850 text-[9px] font-mono text-slate-300 rounded p-1"
              >
                <option value="Sensory:Audio">Sensory</option>
                <option value="System:Lattice">System</option>
                <option value="Ritual:Sigil">Ritual</option>
              </select>
              <button
                onClick={handleAddMemory}
                disabled={!newMemContent.trim()}
                className="px-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white text-[10px] font-semibold rounded cursor-pointer transition-colors shrink-0"
              >
                Add
              </button>
            </div>
          </div>

          {/* Model Context Protocol (MCP) Central Registry Client */}
          <div className="bg-slate-950/60 border border-slate-850/80 rounded-xl p-4 flex flex-col h-[285px]">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-2.5">
              <h3 className="text-xs font-semibold text-slate-200 font-mono flex items-center gap-1.5 uppercase">
                <Workflow size={13} className="text-rose-400" />
                🧬 CONDUID MCP registry
              </h3>
              <div className="flex gap-1.5 select-none bg-slate-950 border border-slate-855 rounded p-0.5">
                {mcpServers.map(serv => (
                  <button
                    key={serv.id}
                    onClick={() => {
                      setActiveMcpId(serv.id);
                      setSelectedToolIdx(0);
                      setMcpOutputResult(null);
                    }}
                    className={`px-1.5 py-0.5 rounded text-[8.5px] font-mono uppercase cursor-pointer transition-all ${
                      activeMcpId === serv.id 
                        ? 'bg-rose-600/15 text-rose-450 border border-rose-500/10 font-bold' 
                        : 'text-slate-500 hover:text-slate-350'
                    }`}
                  >
                    {serv.name.split('/')[1]}
                  </button>
                ))}
              </div>
            </div>

            {/* Server metadata & tool details */}
            {(() => {
              const server = mcpServers.find(s => s.id === activeMcpId);
              if (!server) return null;
              const activeTool = server.tools[selectedToolIdx];
              return (
                <div className="flex-1 flex flex-col justify-between font-mono text-[10px]">
                  
                  {/* Metadata and Tool Selection */}
                  <div className="space-y-2">
                    <p className="text-[9px] text-slate-400 font-sans leading-normal bg-slate-950/90 border border-slate-900 p-1.5 rounded select-text">
                      <span className="font-semibold text-rose-400 font-mono">{server.url}</span> • {server.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-[8.5px] text-slate-500 uppercase font-bold">Select Active Tool Schema:</span>
                      <div className="flex gap-1">
                        {server.tools.map((t, idx) => (
                          <button
                            key={t.name}
                            onClick={() => {
                              setSelectedToolIdx(idx);
                              setMcpOutputResult(null);
                            }}
                            className={`p-1 px-1.5 text-[8px] rounded border uppercase tracking-wider cursor-pointer ${
                              selectedToolIdx === idx 
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 font-bold' 
                                : 'bg-slate-900 text-slate-500 border-transparent hover:text-slate-350'
                            }`}
                          >
                            {t.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Input Demo / Interactive Test Area */}
                  <div className="grid grid-cols-2 gap-2 my-2 py-1 border-t border-b border-slate-900 flex-1">
                    <div className="flex flex-col justify-between">
                      <span className="text-[8px] text-slate-500 uppercase block select-none">Schema Input JSON :</span>
                      <textarea
                        value={mcpInputDemo}
                        onChange={(e) => setMcpInputDemo(e.target.value)}
                        className="flex-1 w-full bg-slate-950 border border-slate-850 p-1 rounded font-mono text-[9px] text-slate-300 focus:outline-none focus:border-rose-500 resize-none max-h-[85px]"
                      />
                    </div>

                    <div className="flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] text-slate-500 uppercase block select-none">Output telemetry :</span>
                        {isExecutingMcp && (
                          <span className="text-[8px] text-amber-400 font-bold animate-pulse">EXECUTING...</span>
                        )}
                      </div>
                      <div className="flex-1 bg-slate-950 border border-slate-900 p-1 rounded font-mono text-[8.5px] text-emerald-400 overflow-y-auto max-h-[85px] leading-relaxed select-text select-text scrollbar-thin">
                        {mcpOutputResult ? (
                          <pre>{JSON.stringify(mcpOutputResult, null, 2)}</pre>
                        ) : (
                          <span className="text-slate-600 block text-center italic py-4">Click Execute to fire the MCP transducer.</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Execute Button */}
                  <button
                    onClick={runMcpTool}
                    disabled={isExecutingMcp}
                    className="w-full py-1.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-semibold rounded-lg text-xs leading-none cursor-pointer tracking-wider uppercase transition-colors"
                  >
                    Execute {activeTool?.name || 'MCP Tool'}
                  </button>

                </div>
              );
            })()}

          </div>

        </div>

      </div>

      {/* Footer System Status details */}
      <div className="pt-3.5 mt-4 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between text-[9px] font-mono text-slate-500 gap-2 select-none">
        <span className="flex items-center gap-1">
          <Cpu size={10} className="text-teal-400" /> Model Sync status: 
          <span className="text-emerald-400 font-semibold uppercase">ACTIVE COHERENCE</span>
        </span>
        <span>WCAG 2.1 Contrast • engram-rs v1.0.4-Lattice</span>
      </div>
    </div>
  );
}
