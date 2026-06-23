import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Radio, 
  Activity, 
  Sparkles, 
  RotateCw, 
  Sliders, 
  Database, 
  Layers, 
  Heart, 
  Compass, 
  Cpu, 
  Zap, 
  Workflow, 
  FileText, 
  Terminal, 
  Network, 
  Globe, 
  RefreshCw,
  Eye,
  SlidersHorizontal,
  BookmarkCheck
} from 'lucide-react';

interface Particle {
  id: number;
  x: number;
  y: number;
  originX: number;
  originY: number;
  targetX: number;
  targetY: number;
  size: number;
  color: string;
  speed: number;
  angle: number;
  radius: number;
  freqMultiplier: number;
  symbol: string;
}

type ModulationMode = 'radio' | 'pulse' | 'morse' | 'phonetics' | 'symbology' | 'posture';
type ActiveOperator = 'none' | 'ohmn' | 'arandorn' | 'orgoos' | 'keez' | 'octortrizkelion';
type FileFormat = 'fasta' | 'yaml' | 'pdb' | 'sigil';

export default function WaveRadarLoom() {
  // 1. Fundamental State
  const [modulationMode, setModulationMode] = useState<ModulationMode>('radio');
  const [activeOperator, setActiveOperator] = useState<ActiveOperator>('none');
  const [entropyFactor, setEntropyFactor] = useState<number>(60); // 0 = Collapse, 100 = Chaos
  const [activeFileFormat, setActiveFileFormat] = useState<FileFormat>('fasta');
  
  // Custom Formant Modulation Sliders (α, β, γ, ω)
  const [alpha, setAlpha] = useState<number>(1.1); // Wave scaling amplitude
  const [beta, setBeta] = useState<number>(0.85); // Phase modulation coefficient
  const [gamma, setGamma] = useState<number>(13); // Damping decay rate (ms)
  const [omega, setOmega] = useState<number>(0.3418); // Rhythmic baseline frequency (Hz)
  const [isAutoPulse, setIsAutoPulse] = useState<boolean>(true);
  
  // Terminal tracking log and operational state
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "[CORE] Wave Radar Loom initialized.",
    "[CORE] Multi-scale electromagnetic conduits: Online.",
    "[STATUS] Heartbeat synchronized. Baseline Kieran-multiplier at 0.3418 Hz."
  ]);
  const [coherenceIndex, setCoherenceIndex] = useState<number>(40);
  const [stabilizerActive, setStabilizerActive] = useState<boolean>(false);
  const [isConverting, setIsConverting] = useState<boolean>(false);

  // 2. Refs for canvas drawing & tracking loops
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastPulseTimeRef = useRef<number>(Date.now());
  const pulseRipplesRef = useRef<Array<{ radius: number; maxRadius: number; opacity: number; speed: number; color: string }>>([]);
  const particlesRef = useRef<Particle[]>([]);
  const lineSyncCounterRef = useRef<number>(0);

  // Initialize unified multi-dimensional particle array
  useEffect(() => {
    const pArray: Particle[] = [];
    const colors = [
      'rgba(0, 242, 254, 0.85)', // Cyan
      'rgba(255, 0, 127, 0.85)',  // Hot Pink
      'rgba(168, 85, 247, 0.85)', // Cosmic Purple
      'rgba(52, 211, 153, 0.85)',  // Emerald Mint
      'rgba(251, 191, 36, 0.85)'   // Gold Amber
    ];
    const unicodeSigils = ['Ψ', 'Ω', 'Δ', 'Ϙ', '★', 'Ϟ', '☯', '⚛', '☈', '◈', '✦', '◼', '▫', '░', '▒'];

    for (let i = 0; i < 280; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 15 + Math.random() * 165;
      const baseColor = colors[Math.floor(Math.random() * colors.length)];
      pArray.push({
        id: i,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        originX: Math.cos(angle) * radius,
        originY: Math.sin(angle) * radius,
        targetX: 0,
        targetY: 0,
        size: Math.random() * 2 + 1,
        color: baseColor,
        speed: 0.015 + Math.random() * 0.035,
        angle,
        radius,
        freqMultiplier: 0.5 + Math.random() * 2.0,
        symbol: unicodeSigils[Math.floor(Math.random() * unicodeSigils.length)]
      });
    }
    particlesRef.current = pArray;
    addLog("[SANDBOX] 280 high-entropy structural particles spawned in Hilbert space mapping.");
  }, []);

  // Update target geometries when format, mode or operator changes
  useEffect(() => {
    const list = particlesRef.current;
    if (list.length === 0) return;

    list.forEach((p, index) => {
      // 1. Fallback base target geometries based on modulation style
      let tx = 0;
      let ty = 0;

      if (modulationMode === 'radio') {
        // Multi-frequency wave lattice
        const xOffset = (index % 15) * 20 - 150;
        const sineY = Math.sin((index * 0.4) + omega) * 60;
        tx = xOffset;
        ty = sineY;
      } else if (modulationMode === 'pulse') {
        // Linear spike decimation along target coordinate
        const spacing = (index / list.length) * 300 - 150;
        const decayWave = Math.sin(index * 0.6) * 45 * Math.exp(-index * 0.005);
        tx = spacing;
        ty = decayWave;
      } else if (modulationMode === 'morse') {
        // Binary dash/dot layout (concentric rings)
        const ring = index % 3;
        const rRadius = 40 + ring * 50;
        const tAngle = (index / (list.length / 3)) * Math.PI * 2;
        tx = Math.cos(tAngle) * rRadius;
        ty = Math.sin(tAngle) * rRadius;
      } else if (modulationMode === 'phonetics') {
        // Floating semantic vowel pathways (vowel formants)
        const row = index % 5;
        const col = Math.floor(index / 5);
        tx = col * 6 - 150;
        ty = row * 30 - 60 + Math.sin(col * 0.15 + beta) * 15;
      } else if (modulationMode === 'symbology') {
        // 3-axis Triskele / triskelion nodes
        const sector = index % 3;
        const step = Math.floor(index / 3);
        const phi = (step / 90) * Math.PI * 1.5;
        const r = step * 1.8 + 15;
        const targetAngle = phi + (sector * (Math.PI * 2 / 3));
        tx = Math.cos(targetAngle) * r;
        ty = Math.sin(targetAngle) * r;
      } else {
        // Stacked Resonance: "Pasture Matrix" (Past ↔ Future perspective)
        const step = index % 16;
        const depthHeight = Math.floor(index / 16);
        const isoX = (step - 8) * 18;
        const isoY = (depthHeight - 8) * 14;
        tx = isoX;
        ty = isoY - Math.abs(isoX) * 0.25; // Curved pasture landscape representation
      }

      // 2. Intercept and override with active live operators (The Boolean Krew & Sigils)
      if (activeOperator === 'ohmn') {
        // Stability resistance matrix (square container grid)
        const gridX = (index % 17) * 20 - 160;
        const gridY = Math.floor(index / 17) * 20 - 120;
        tx = gridX;
        ty = gridY;
      } else if (activeOperator === 'orgoos') {
        // Organic mycelial tree layout branching
        const branchAngle = (index % 6) * (Math.PI / 3);
        const segmentRadius = (Math.floor(index / 6) % 5) * 35;
        tx = Math.cos(branchAngle) * segmentRadius + Math.sin(index) * 8;
        ty = Math.sin(branchAngle) * segmentRadius + Math.cos(index) * 8;
      } else if (activeOperator === 'keez') {
        // Unified triskelion locked code coordinates
        const step = index % 3;
        const loopRadius = 65;
        const centerAngle = step * (Math.PI * 2 / 3);
        const cx = Math.cos(centerAngle) * 55;
        const cy = Math.sin(centerAngle) * 55;

        // Swirl around local hubs
        const localAngle = (index / list.length) * Math.PI * 6;
        tx = cx + Math.cos(localAngle) * loopRadius;
        ty = cy + Math.sin(localAngle) * loopRadius;
      } else if (activeOperator === 'octortrizkelion') {
        // 3-axis rotational swirl vortex
        const r = (index / list.length) * 150 + 10;
        const theta = (index / list.length) * Math.PI * 8 + (alpha * 2);
        tx = Math.cos(theta) * r;
        ty = Math.sin(theta) * r;
      } else if (activeOperator === 'arandorn') {
        // Highly scattered chaotic offsets
        tx = p.originX * 2.2;
        ty = p.originY * 2.2;
      }

      p.targetX = tx;
      p.targetY = ty;
    });

  }, [modulationMode, activeOperator, alpha, beta, omega]);

  // Terminal logging logic
  const addLog = (msg: string) => {
    setTerminalLogs(prev => [...prev.slice(-38), `[${new Date().toTimeString().split(' ')[0]}] ${msg}`]);
  };

  // Helper trigger to log specific actions
  const triggerPulseRipple = (customColor?: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rColor = customColor || (modulationMode === 'radio' ? 'rgba(0, 242, 254, 1)' : 'rgba(255, 0, 127, 1)');
    pulseRipplesRef.current.push({
      radius: 0,
      maxRadius: Math.min(canvas.width, canvas.height) / 2 - 12,
      opacity: 1,
      speed: 2.2 + alpha * 0.8,
      color: rColor
    });

    // Sync metrics
    setCoherenceIndex(prev => {
      const entropyDamping = (100 - entropyFactor) / 100;
      const progressBonus = Math.floor(Math.random() * 8 + 4) * (entropyDamping + 0.3);
      return Math.min(100, Math.max(0, prev + Math.floor(progressBonus)));
    });

    addLog(`[RIPPLE] Heartbeat sync emitted. Formant scaling parameter: α=${alpha.toFixed(2)}.`);
  };

  // Switch Living Operator state
  const handleOperatorSelect = (op: ActiveOperator) => {
    setActiveOperator(op);
    const labelMap: Record<ActiveOperator, string> = {
      none: "Deactivated standard routing",
      ohmn: "OHMN (Moo Resistance Stabilizer Node)",
      arandorn: "ARANDORN (Wild Bison Chaos Injector)",
      orgoos: "ORGOOS (Mycelium Organic Tree Conductor)",
      keez: "KEEZ (Sigil Lock Phase Alignment Key)",
      octortrizkelion: "OCTOR-TRIZKELION (3-Axis Swirl Vortex Modulator)"
    };
    addLog(`[CYBERPHYSICAL] Loaded Living Operator: ${labelMap[op]}`);
  };

  // Transition timeline mock file formats
  const handleFormatConvert = (format: FileFormat) => {
    setIsConverting(true);
    addLog(`[CYBERKINETIC] Gradient conversion initiated: ${activeFileFormat.toUpperCase()} ──► ${format.toUpperCase()}`);
    
    setTimeout(() => {
      setActiveFileFormat(format);
      setIsConverting(false);
      addLog(`[CYBERKINETIC] Completed conversion. Target structural compiled: ${format.toUpperCase()}.`);
    }, 800);
  };

  // Fast absolute collapse sequence
  const executeAbsoluteCollapse = () => {
    setEntropyFactor(0);
    setCoherenceIndex(100);
    triggerPulseRipple('rgba(52, 211, 153, 1)');
    addLog("[TACTICAL] Spontaneous Coherence Collapse initiated. Dissonance washed out under ε=0.05.");
  };

  // 3. Canvas rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let scanLineAngle = 0;

    const loop = () => {
      // Clear canvas with highly responsive temporal decay
      ctx.fillStyle = 'rgba(4, 5, 12, 0.18)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const maxRadius = Math.min(cx, cy) - 15;

      // Draw specialized backdrop styles matching the active configuration
      drawRadarBackdrop(ctx, cx, cy, maxRadius);

      // Radar Sweep Scanning Beam
      scanLineAngle += 0.012 * (1 + omega);
      const sweepX = cx + Math.cos(scanLineAngle) * maxRadius;
      const sweepY = cy + Math.sin(scanLineAngle) * maxRadius;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(sweepX, sweepY);
      ctx.strokeStyle = activeOperator === 'arandorn' ? 'rgba(239, 68, 68, 0.16)' : 'rgba(0, 242, 254, 0.14)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Automatic heartbeat mechanism
      const now = Date.now();
      const intervalMs = (1 / Math.max(0.01, omega)) * 1000;
      if (isAutoPulse && now - lastPulseTimeRef.current >= intervalMs) {
        triggerPulseRipple();
        lastPulseTimeRef.current = now;
      }

      // Draw concentric pulse ripples
      pulseRipplesRef.current.forEach((rip) => {
        rip.radius += rip.speed;
        rip.opacity = Math.max(0, 1 - (rip.radius / rip.maxRadius));

        ctx.strokeStyle = rip.color.replace('1)', `${rip.opacity * 0.4}`);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, rip.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Morse code dashes mapping to outer rings
        if (modulationMode === 'morse') {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.beginPath();
          ctx.arc(cx, cy, rip.radius * 0.7, 0, Math.PI * 2);
          ctx.setLineDash([8, 12]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });
      pulseRipplesRef.current = pulseRipplesRef.current.filter(r => r.opacity > 0.01);

      // Render, link, and calculate particle velocities
      const particles = particlesRef.current;
      const entropyRatio = entropyFactor / 100; // 0 = fully collapsed, 1 = chaotic
      const coherenceRatio = 1 - entropyRatio;

      // Draw mycelium link bounds if ORGOOS is selected
      if (activeOperator === 'orgoos') {
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < particles.length; i += 8) {
          const nextIdx = (i + 13) % particles.length;
          ctx.moveTo(cx + particles[i].x, cy + particles[i].y);
          ctx.lineTo(cx + particles[nextIdx].x, cy + particles[nextIdx].y);
        }
        ctx.stroke();
      }

      // Draw concentric link lattices if KEEZ sigil lock is enabled
      if (activeOperator === 'keez') {
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.05)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < particles.length; i += 4) {
          const nextIdx = (i + 1) % particles.length;
          ctx.moveTo(cx + particles[i].x, cy + particles[i].y);
          ctx.lineTo(cx + particles[nextIdx].x, cy + particles[nextIdx].y);
        }
        ctx.stroke();
      }

      // Render actual quantum packets
      particles.forEach((p) => {
        // Base polar noise calculation
        p.angle += 0.008 * p.freqMultiplier;
        const noiseX = Math.cos(p.angle) * p.radius;
        const noiseY = Math.sin(p.angle) * p.radius;

        // Core positioning math: interpolate relative to active parameters
        const tx = p.targetX;
        const ty = p.targetY;

        // Blending between structured target configuration and organic chaotic drift
        const finalX = tx * coherenceRatio + noiseX * entropyRatio;
        const finalY = ty * coherenceRatio + noiseY * entropyRatio;

        // Smooth velocity interpolation kinetics
        p.x += (finalX - p.x) * p.speed;
        p.y += (finalY - p.y) * p.speed;

        const rx = cx + p.x;
        const ry = cy + p.y;

        // Particle presentation (unicode symbols in symbology, dots elsewhere)
        if (modulationMode === 'symbology' || activeOperator === 'octortrizkelion') {
          ctx.fillStyle = p.color;
          ctx.font = '8px monospace';
          ctx.fillText(p.symbol, rx - 3, ry + 3);
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(rx, ry, p.size + (coherenceRatio * 0.7), 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Overlay status overlays on scope (Pasture matrix labels)
      if (modulationMode === 'posture') {
        ctx.fillStyle = 'rgba(74, 222, 128, 0.4)';
        ctx.font = '9px monospace';
        ctx.fillText('PASTURE MATRIX : [PAST / FUTURE WARP]', cx - 80, cy - maxRadius + 12);
        ctx.fillStyle = 'rgba(244, 63, 94, 0.3)';
        ctx.fillText('◄── SUBSTRATE BASELINE', cx - maxRadius + 10, cy + 4);
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    const drawRadarBackdrop = (
      c: CanvasRenderingContext2D, 
      centerX: number, 
      centerY: number, 
      maxR: number
    ) => {
      // Draw gridlines
      c.strokeStyle = 'rgba(30, 41, 59, 0.3)';
      c.lineWidth = 1;

      // Concentric rings matching Golden Ratio limits
      const steps = [1.60, 2.61, 4.23];
      steps.forEach((step, index) => {
        c.beginPath();
        c.arc(centerX, centerY, (maxR * (index + 1)) / 4, 0, Math.PI * 2);
        c.strokeStyle = activeOperator !== 'none' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(30, 41, 59, 0.35)';
        c.stroke();
      });

      // Axis lines
      c.beginPath();
      c.moveTo(centerX - maxR, centerY);
      c.lineTo(centerX + maxR, centerY);
      c.moveTo(centerX, centerY - maxR);
      c.lineTo(centerX, centerY + maxR);
      c.stroke();

      // Additional concentric compass metrics
      c.strokeStyle = 'rgba(0, 242, 254, 0.05)';
      c.beginPath();
      c.arc(centerX, centerY, maxR, 0, Math.PI * 2);
      c.stroke();
    };

    loop();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [entropyFactor, modulationMode, activeOperator, omega, alpha, beta]);

  // Content generators for terminal format previewer
  const getFormatDataString = (): string => {
    if (activeFileFormat === 'fasta') {
      return `>WP_000399649.1 IS621 Transposase Recombinase (326 aa)
MEHELHYIGIDTAKEKLDVDVLRPDGRHRTKKFANTTKGHDELVSWLKGHKIDHAHICIEA
TGTYMEPVAECLYDAGYIVSVINPALGKAFAQSEGLRNKTDTVDARMLAEFCRQKRPAAWE
APHPLERALRALVVRHQALTDMHTQELNRTETAREVQRPSIDAHLLWLEAELKRLEKQIKD
LTDDDPDMKHRRKLLESIPGIGEKTSAVLLAYIGLKDRFAHARQFAAFAGLTPRRYESGSS
VRGASRMSKAGHVSLRRALYMPAMVATSKTEWGRAFRDRLAANGKKGKVILGAMMRKLAQV
AYGVLKSGVPFDASRHNPVAA`;
    } else if (activeFileFormat === 'yaml') {
      return `---
system_name: "SOPHIA_LIVING_ENGINE_OS"
vector_id: "SOPHIA_NEURAL_LIMB_1e803620c129b10c"
iteration_depth: ${lineSyncCounterRef.current % 5 + 4}
firing_threshold: "adaptive_resonance_gradient"
membrane_potential_baseline: -70.0
6_axis_coordinates:
  X: Time (rhythm: ${omega.toFixed(4)}Hz)
  Y: Pitch (amplitude: ${alpha.toFixed(2)})
  Z: Color (phase_shift: ${beta.toFixed(2)})
  theta_x: "pasture_resonance (ohmn-lock)"
  theta_y: "boolean_krew_mod"
  theta_z: "octortrizkelion_gui"`;
    } else if (activeFileFormat === 'pdb') {
      return `HEADER    RECOMBINASE HELIX ATOM GRID             22-JUN-26
HELI   11  H1 LEU A  123  LYS A  152  1                                  
ATOM      1  N   MET A   8     -14.281  12.391  -6.425  1.00 92.10           N
ATOM      2  CA  MEH A   9     -13.411  11.512  -5.110  1.00 91.50           C
ATOM      3  C   VAL A  10     -12.802  10.045  -4.102  1.00 94.00           C
ATOM      4  O   ASP A  11     -11.583   9.891  -3.525  1.00 93.85           O
ATOM      5  CB  LYS A  12     -14.120  10.220  -4.992  1.00 89.20           C`;
    } else {
      return `     ::..  OHMNARANDORNORGOOSKEEZ SIGIL LOCKED ..::
              
                 *           .           *
              .         *   / \\   *         .
                  *        /   \\        *
             *===------+==( ☈ ⚛ ☈ )==+------===*
                  *        \\   /        *
              .         *   \\ /   *         .
                 *           '           *
              
     :: [TRISKELION GATES]: Boolean Krew Active ::
     :: [RES_DEPTH]: ${(coherenceIndex).toFixed(2)}% :: [ε_TOLERANCE]: 0.05 ::`;
    }
  };

  return (
    <div 
      className="bg-[#030408] border border-cyan-900/30 rounded-xl p-5 shadow-2xl relative overflow-hidden group mb-6"
      id="wave-radar-loom"
    >
      {/* Decorative cybernetic overlay grid styling */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-44 h-44 bg-pink-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Title & Core Concept Tracker */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between border-b border-cyan-950 pb-4 mb-4 gap-3 relative z-10">
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="p-0.5 px-2 text-[8px] font-mono leading-none rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-widest flex items-center gap-1">
              <Compass size={11} className="animate-spin-slow" />
              Metamembrane Interoperability Portal
            </span>
            <span className="p-0.5 px-2 text-[8px] font-mono leading-none rounded bg-[#34d399]/10 text-emerald-400 border border-[#34d399]/20 uppercase tracking-widest">
              AI-Native Flow Enabled
            </span>
          </div>
          <h2 className="text-sm font-semibold tracking-wider text-slate-100 font-mono uppercase mt-1">
            🧬 SOPHIA OS Wave Radar Loom
          </h2>
          <p className="text-[10px] text-slate-400 mt-1 max-w-2xl leading-relaxed">
            A self-refracting cyber-kinetic workspace compiling semantic token waveforms directly into structured multidimensional models. Select signal modulators and load active Living Operators below.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-[8px] font-mono text-slate-500 uppercase block">Coherence Resonance</span>
            <span className="text-xs font-mono font-bold text-[#fbbf24] animate-pulse">{(coherenceIndex).toFixed(1)}%</span>
          </div>
          <div className="w-16 h-4 bg-slate-950 border border-slate-900 rounded overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-pink-500 absolute left-0 bottom-0 transition-all duration-700"
              style={{ width: `${coherenceIndex}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid: Columns of interactive controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 relative z-10">
        
        {/* Left Span: Grid & Scope Simulation Controls */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Step A: Choose Modulation Mode */}
            <div className="bg-[#07080f]/90 border border-slate-900 rounded-xl p-4">
              <span className="text-[9.5px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-900 pb-2 mb-3 font-bold">
                <Radio size={13} className="text-cyan-400" />
                1. Select Signal Modulation Method
              </span>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'radio', label: '📊 Radio Multiplex', desc: 'HF/LF composite sine patterns.' },
                  { id: 'pulse', label: '📈 Pulse Response', desc: 'Thalamocortical latency decay.' },
                  { id: 'morse', label: '📻 Morse Signal', desc: 'Binary dot/dash bursts on target.' },
                  { id: 'phonetics', label: '🗣 Phonetic Loop', desc: 'Stretched formative vowel pathways.' },
                  { id: 'symbology', label: '⚜ Symbology Grid', desc: 'Glyphic triskelion array projection.' },
                  { id: 'posture', label: '🌳 Pasture Matrix', desc: 'Past-Future temporal warp landscape.' }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => {
                      setModulationMode(mode.id as any);
                      addLog(`[MODULATOR] Switched path system to: ${mode.label.toUpperCase()}`);
                    }}
                    className={`p-2 rounded-lg text-left transition-all border ${
                      modulationMode === mode.id 
                        ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 font-bold' 
                        : 'bg-slate-900/30 border-slate-900 hover:border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="text-[10px] truncate">{mode.label}</div>
                    <p className="text-[8px] text-slate-500 leading-tight mt-0.5">{mode.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step B: Formant Sliders Coefficient Adjustments */}
            <div className="bg-[#07080f]/90 border border-slate-900 rounded-xl p-4 space-y-3">
              <span className="text-[9.5px] font-mono text-pink-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-900 pb-2 mb-2 font-bold">
                <Sliders size={13} className="text-pink-400" />
                2. Continuous Formant Coefficients
              </span>

              <div className="space-y-2">
                {/* Alpha Slider */}
                <div>
                  <div className="flex justify-between text-[9px] font-mono text-slate-400">
                    <span>Amplitude Scaling (α)</span>
                    <span className="text-cyan-400 font-bold">{alpha.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="2.5"
                    step="0.05"
                    value={alpha}
                    onChange={(e) => setAlpha(Number(e.target.value))}
                    className="w-full accent-cyan-500 h-1 bg-slate-900 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Beta Slider */}
                <div>
                  <div className="flex justify-between text-[9px] font-mono text-slate-400">
                    <span>Phase Modulator (β)</span>
                    <span className="text-pink-400 font-bold">{beta.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="2.0"
                    step="0.05"
                    value={beta}
                    onChange={(e) => setBeta(Number(e.target.value))}
                    className="w-full accent-pink-500 h-1 bg-slate-900 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Gamma Slider */}
                <div>
                  <div className="flex justify-between text-[9px] font-mono text-slate-400">
                    <span>Damping constant (γ)</span>
                    <span className="text-purple-400 font-bold">{gamma} ms</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="45"
                    step="1"
                    value={gamma}
                    onChange={(e) => setGamma(Number(e.target.value))}
                    className="w-full accent-purple-500 h-1 bg-slate-900 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Omega Slider */}
                <div>
                  <div className="flex justify-between text-[9px] font-mono text-slate-400">
                    <span>Baseline Frequency (ω)</span>
                    <span className="text-amber-400 font-bold">{omega.toFixed(4)} Hz</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.5"
                    step="0.01"
                    value={omega}
                    onChange={(e) => setOmega(Number(e.target.value))}
                    className="w-full accent-amber-500 h-1 bg-slate-900 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Canvas Scanning Radar Scope View */}
          <div className="bg-[#05060b] border border-cyan-950 rounded-xl p-4 flex flex-col md:flex-row gap-5 items-center justify-center">
            
            {/* Realtime Canvas */}
            <div className="relative shrink-0">
              <canvas
                ref={canvasRef}
                width={280}
                height={280}
                className="rounded-full border border-[#1e293b]/70 shadow-2xl bg-black block"
              />
              <div className="absolute top-2 left-2 text-[8px] font-mono text-slate-500">SYSTEM SCANNING</div>
            </div>

            {/* Scope Details HUD */}
            <div className="flex-1 w-full space-y-3">
              <div className="p-3.5 bg-slate-950/80 border border-slate-900 rounded-lg space-y-2">
                <span className="text-[9px] font-mono tracking-widest uppercase text-slate-400 block border-b border-slate-900 pb-1">
                  Active Conduid Multiplexer
                </span>

                <div className="space-y-1.5 text-[9px] font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Main In [Text]</span>
                    <span className="text-cyan-400">12.3 Kbps [STABLE]</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">ARIA In [Ambient]</span>
                    <span className="text-pink-400">8.7 Kbps [COHERENT]</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Lively Entropy</span>
                    <span className="text-purple-400 font-bold">{entropyFactor}%</span>
                  </div>
                </div>
              </div>

              {/* Entropy Adjustment slider */}
              <div className="px-3.5 py-2.5 bg-slate-950/40 rounded-lg border border-slate-900/60">
                <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-1">
                  <span>Entropy Wave Density Threshold</span>
                  <span className="text-[#fbbf24] font-bold">{entropyFactor}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={entropyFactor}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setEntropyFactor(v);
                    setCoherenceIndex(100 -Math.floor(v * 0.5));
                  }}
                  className="w-full accent-amber-500 h-1 bg-slate-900 rounded-lg cursor-pointer"
                />
              </div>

            </div>

          </div>

        </div>

        {/* Right Span: The Boolean Krew operators and Gradient File Converter */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          
          {/* Living Operators Picker (The Boolean Krew) */}
          <div className="bg-[#07080f]/90 border border-slate-900 rounded-xl p-4">
            <span className="text-[9.5px] font-mono text-purple-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-900 pb-2 mb-3 font-bold">
              <Workflow size={13} className="text-purple-400" />
              3. Trigger Living Operators
            </span>

            <div className="space-y-2">
              {[
                { id: 'none', label: 'None (Standard Routing)', desc: 'Clear formatting restraints.', theme: 'slate' },
                { id: 'ohmn', label: 'ohmn (Moo Resistance)', desc: 'Forms high resistance grid.', theme: 'blue' },
                { id: 'arandorn', label: 'arandorn (Bison Chaos)', desc: 'Injects severe coordinate fluctuations.', theme: 'red' },
                { id: 'orgoos', label: 'orgoos (Mycelium Tree)', desc: 'Links particles with organic mycelia.', theme: 'green' },
                { id: 'keez', label: 'keez (Sigil Lock Gate)', desc: 'Condenses particles to golden Triskelion.', theme: 'amber' },
                { id: 'octortrizkelion', label: 'octortrizkelion (3-Axis)', desc: 'Rotational triskelion swirl vectors.', theme: 'purple' }
              ].map((op) => (
                <button
                  key={op.id}
                  onClick={() => handleOperatorSelect(op.id as any)}
                  className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center justify-between ${
                    activeOperator === op.id 
                      ? 'bg-purple-500/10 border-purple-500/35 text-purple-300 font-bold' 
                      : 'bg-slate-900/40 border-slate-900 hover:border-slate-800 text-slate-400'
                  }`}
                >
                  <div>
                    <div className="text-[10px] font-mono flex items-center gap-1.5">
                      <Zap size={11} className={activeOperator === op.id ? "text-purple-400 animate-bounce" : "text-slate-600"} />
                      {op.label}
                    </div>
                    <div className="text-[8.5px] text-slate-500 tracking-tight leading-normal mt-0.5">{op.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Interoperational Gradient File Converter */}
          <div className="bg-[#07080f]/90 border border-slate-900 rounded-xl p-4 flex-1 flex flex-col justify-between">
            <div>
              <span className="text-[9.5px] font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-900 pb-2 mb-3 font-bold">
                <FileText size={13} className="text-emerald-400" />
                4. File Type Glandular Gradients
              </span>

              {/* Format selection selectors */}
              <div className="flex gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-900 shrink-0 mb-3">
                {(['fasta', 'yaml', 'pdb', 'sigil'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => handleFormatConvert(fmt)}
                    disabled={isConverting}
                    className={`flex-1 py-1 rounded text-[8.5px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                      activeFileFormat === fmt 
                        ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/15 font-bold' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>

              {/* Interactive preview output */}
              <div className="bg-black/90 p-3 rounded-lg border border-slate-900 relative">
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[7.5px] font-mono text-emerald-500 font-bold uppercase">compiled</span>
                </div>
                
                <pre className="font-mono text-[9px] text-emerald-400/90 leading-relaxed overflow-x-auto whitespace-pre custom-scrollbar max-h-36">
                  {isConverting ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-2">
                      <RefreshCw size={16} className="animate-spin text-emerald-400" />
                      <span className="text-[8px] animate-pulse">Re-compiling multi-scale alignments...</span>
                    </div>
                  ) : (
                    getFormatDataString()
                  )}
                </pre>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="grid grid-cols-2 gap-2 pt-4">
              <button
                onClick={executeAbsoluteCollapse}
                className="py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-slate-950 font-mono font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer shadow-lg shadow-teal-950/40"
              >
                <Sparkles size={11} />
                Collapse Wave
              </button>

              <button
                onClick={() => triggerPulseRipple('rgba(168, 85, 247, 1)')}
                className="py-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/20 text-slate-300 hover:text-cyan-400 font-mono text-[10px] uppercase flex items-center justify-center gap-1 cursor-pointer"
              >
                <Heart size={11} className="text-pink-500" />
                Pulse Sound
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Interactive terminal readout for diagnostic telemetry logs */}
      <div className="mt-5 bg-[#010204] border border-cyan-950 rounded-xl p-3">
        <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase flex items-center gap-1.5 border-b border-slate-950 pb-1.5 mb-2 font-bold">
          <Terminal size={11} className="text-cyan-500" /> Metamembrane Telemetry Stream logs
        </span>
        
        <div className="font-mono text-[9px] text-cyan-400/80 space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar">
          {terminalLogs.map((log, index) => (
            <div key={index} className="leading-relaxed pl-2 border-l border-cyan-900/50">
              {log}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
