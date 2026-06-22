import React, { useState, useEffect, useRef } from 'react';
import { 
  Tv, 
  ScreenShare, 
  Video, 
  Terminal, 
  Sliders, 
  Eye, 
  Activity, 
  Sparkles, 
  Cpu, 
  RefreshCw,
  Layers,
  StopCircle,
  Clock
} from 'lucide-react';

interface TurbopackLog {
  timestamp: string;
  type: 'info' | 'success' | 'warn' | 'action';
  message: string;
  duration?: string;
}

export default function AIOverlayEngine() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hiddenVideoRef = useRef<HTMLVideoElement>(null);
  const pipVideoRef = useRef<HTMLVideoElement>(null);

  // States
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [isPipActive, setIsPipActive] = useState<boolean>(false);

  // Shader Controls (User or AI Autopilot managed)
  const [resonance, setResonance] = useState<number>(0.65);
  const [decay, setDecay] = useState<number>(0.4);
  const [cyberCoherence, setCyberCoherence] = useState<number>(0.8);
  const [temporalFrequency, setTemporalFrequency] = useState<number>(1.2);
  const [isAiAutopilot, setIsAiAutopilot] = useState<boolean>(true);
  const [activeShaderMode, setActiveShaderMode] = useState<'hologram' | 'matrix' | 'sacred_mesh' | 'chroma_glitch'>('sacred_mesh');

  // Turbopack Hot-Module-Replacement Terminal Simulator
  const [turbopackLogs, setTurbopackLogs] = useState<TurbopackLog[]>([
    { timestamp: '22:30:10', type: 'info', message: '🔵 [Turbopack] Engine v1.1.2 booted successfully.' },
    { timestamp: '22:30:11', type: 'info', message: '🟢 Ready for live visual HMR. Listening on port 3000.' },
    { timestamp: '22:30:15', type: 'success', message: '📦 Built project successfully in 4.12ms (Vite + Turbopack CJS hybrid).' },
    { timestamp: '22:30:24', type: 'warn', message: '⚠️ Dynamic hot-wire feedback loops registered in background.' }
  ]);
  const [customEquation, setCustomEquation] = useState<string>('sin(x * y) * cos(t)');

  // Stream state references for access inside the animation loop
  const streamRef = useRef<MediaStream | null>(null);
  const logIntervalRef = useRef<any>(null);

  // HMR simulated live reload updates
  useEffect(() => {
    logIntervalRef.current = setInterval(() => {
      const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const actions = [
        { type: 'info', msg: '⚡ [Turbopack] Hot reloaded: "/src/components/TessellationEngine.tsx" - updated refs', delay: '1.2ms' },
        { type: 'success', msg: '✨ [SOPHIA OS] Coherent feedback field calibrated.', delay: '0.9ms' },
        { type: 'action', msg: '🔬 [Artificial Vision] Analyzing capture frames. Tracking 12 user workflow coordinates...', delay: '14.2ms' },
        { type: 'warn', msg: '⏳ [Möbius Loop Clock] Compensation adjustments recalculated to match local lag.', delay: '0.4ms' }
      ];
      const selected = actions[Math.floor(Math.random() * actions.length)];
      
      setTurbopackLogs(prev => [
        { timestamp: ts, type: selected.type as any, message: selected.msg, duration: selected.delay },
        ...prev.slice(0, 20)
      ]);

      // If AI Autopilot is enabled, fluctuate the shaders conceptually as if analyzing the screen
      if (isAiAutopilot) {
        setResonance(prev => Math.max(0.1, Math.min(1.0, prev + (Math.random() - 0.5) * 0.08)));
        setDecay(prev => Math.max(0.1, Math.min(1.0, prev + (Math.random() - 0.5) * 0.05)));
        setCyberCoherence(prev => Math.max(0.1, Math.min(1.0, prev + (Math.random() - 0.5) * 0.04)));
        setTemporalFrequency(prev => Math.max(0.2, Math.min(2.5, prev + (Math.random() - 0.5) * 0.1)));
      }
    }, 4500);

    return () => clearInterval(logIntervalRef.current);
  }, [isAiAutopilot]);

  // Handle Starting Capture
  const startScreenCapture = async () => {
    setStreamError(null);
    try {
      // Prompt user to select screen, window, or tab
      const captureStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'monitor',
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: false
      });

      streamRef.current = captureStream;
      setIsCapturing(true);

      const video = hiddenVideoRef.current;
      if (video) {
        video.srcObject = captureStream;
        video.onloadedmetadata = () => {
          video.play().catch(e => console.error("Video play error:", e));
        };
      }

      // Add a Turbopack log
      const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setTurbopackLogs(prev => [
        { timestamp: ts, type: 'success', message: '📡 Screen capture feedback mounted onto WebGL pipeline context!' },
        ...prev
      ]);

      // Handle stop stream from browser UI bar
      captureStream.getVideoTracks()[0].onended = () => {
        stopScreenCapture();
      };

    } catch (err: any) {
      console.error("Screen capture error:", err);
      setStreamError(err.message || 'Screen capture permission declined or unavailable in iframe.');
    }
  };

  // Stop Capture
  const stopScreenCapture = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
    if (hiddenVideoRef.current) {
      hiddenVideoRef.current.srcObject = null;
    }
    if (isPipActive) {
      document.exitPictureInPicture().catch(() => {});
      setIsPipActive(false);
    }

    const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setTurbopackLogs(prev => [
      { timestamp: ts, type: 'warn', message: '🛑 Screen capture stream closed, overlay defaulted to virtual holographic construct.' },
      ...prev
    ]);
  };

  // Canvas Live Drawing & Interactive HUD WebGL/2D Generator
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let localFrameCount = 0;

    // Track dynamic HUD elements for scanning/targeting
    const hudTargets = [
      { x: 120, y: 80, label: 'Tessellation Core', size: 40, active: true },
      { x: 350, y: 160, label: 'LUMINA Synth Matrix', size: 50, active: true },
      { x: 220, y: 220, label: 'Möbius Compensator', size: 30, active: false }
    ];

    const drawHUD = () => {
      localFrameCount++;
      const w = canvas.width;
      const h = canvas.height;

      // Clear Canvas
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, w, h);

      // If Screen Sharing is active, render the video frame
      const video = hiddenVideoRef.current;
      if (isCapturing && video && video.readyState >= 2) {
        // Draw user's captured display
        ctx.drawImage(video, 0, 0, w, h);

        // Apply a high-tech alpha transparency blend filter based on resonance
        ctx.fillStyle = `rgba(10, 16, 28, ${1.0 - resonance})`;
        ctx.fillRect(0, 0, w, h);
      } else {
        // Mock capture graphics for space visualization
        ctx.strokeStyle = 'rgba(30, 41, 59, 0.5)';
        ctx.lineWidth = 1;
        // Drawing Grid
        const step = 30;
        for (let x = 0; x < w; x += step) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = 0; y < h; y += step) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }

        // Draw animated center orbital
        const centerX = w / 2;
        const centerY = h / 2;
        const orbRad = 70 + Math.sin(localFrameCount * 0.05 * temporalFrequency) * 15;

        const grad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, orbRad * 1.5);
        grad.addColorStop(0, 'rgba(20, 184, 166, 0.08)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, orbRad * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Standard HUD elements
        ctx.strokeStyle = 'rgba(20, 184, 166, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(centerX, centerY, orbRad, 0, Math.PI * 2);
        ctx.stroke();

        // Glowing notches
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.8)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, orbRad, localFrameCount * 0.015, localFrameCount * 0.015 + 0.8);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(centerX, centerY, orbRad, localFrameCount * 0.015 + Math.PI, localFrameCount * 0.015 + Math.PI + 0.8);
        ctx.stroke();
      }

      // ──────────────────────────────────────────────
      // Apply Shader Effects on top of feed
      // ──────────────────────────────────────────────
      
      // Mode 1: Sacred Geometry Mesh Layer
      if (activeShaderMode === 'sacred_mesh') {
        ctx.strokeStyle = 'rgba(20, 184, 166, 0.22)';
        ctx.lineWidth = 1;
        const pulse = Math.abs(Math.sin(localFrameCount * 0.02 * temporalFrequency));
        const gridCells = 8;
        
        for (let i = 0; i <= gridCells; i++) {
          const xProgress = (i / gridCells) * w;
          const yProgress = (i / gridCells) * h;
          
          ctx.beginPath();
          ctx.moveTo(xProgress, 0);
          ctx.lineTo(w - xProgress, h);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(0, yProgress);
          ctx.lineTo(w, h - yProgress);
          ctx.stroke();
        }

        // Draw geometric center compass star
        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.rotate(localFrameCount * 0.003 * temporalFrequency);
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.35)';
        for (let r = 0; r < 4; r++) {
          ctx.beginPath();
          ctx.strokeRect(-40 - pulse*20, -40 - pulse*20, 80 + pulse*40, 80 + pulse*40);
          ctx.rotate(Math.PI / 4);
        }
        ctx.restore();
      }

      // Mode 2: Hologram Scanning Overlay
      if (activeShaderMode === 'hologram') {
        const scanY = (localFrameCount * 2 * temporalFrequency) % h;
        
        // Scan line glow
        const scanGrad = ctx.createLinearGradient(0, scanY - 25, 0, scanY + 5);
        scanGrad.addColorStop(0, 'rgba(14, 165, 233, 0.0)');
        scanGrad.addColorStop(0.8, 'rgba(14, 165, 233, 0.25)');
        scanGrad.addColorStop(1, 'rgba(14, 165, 233, 0.85)');
        
        ctx.fillStyle = scanGrad;
        ctx.fillRect(0, scanY - 25, w, 30);

        // Grid scan lines over screen
        ctx.fillStyle = 'rgba(14, 165, 233, 0.03)';
        for (let gl = 0; gl < h; gl += 6) {
          ctx.fillRect(0, gl, w, 1.5);
        }
      }

      // Mode 3: Matrix Binary Cascade
      if (activeShaderMode === 'matrix') {
        ctx.font = '7px monospace';
        ctx.fillStyle = `rgba(34, 197, 94, ${0.4 * resonance})`;
        for (let col = 0; col < w; col += 20) {
          // Cascade characters
          const rndY = (localFrameCount * (col % 7 + 1) * 0.8) % h;
          const char = Math.random() > 0.5 ? '1' : '0';
          ctx.fillText(char, col, rndY);
          ctx.fillText(char, col + 5, (rndY + 30) % h);
        }
      }

      // Mode 4: Chromatic Glitch / Interrupter
      if (activeShaderMode === 'chroma_glitch') {
        if (Math.random() > 0.92 - (1.0 - cyberCoherence) * 0.5) {
          // Glitch split
          const splitY = Math.random() * h;
          const splitH = 15 + Math.random() * 40;
          const shift = (Math.random() - 0.5) * 35 * resonance;
          ctx.drawImage(canvas, 0, splitY, w, splitH, shift, splitY, w, splitH);
          
          ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
          ctx.fillRect(0, splitY, w, splitH);
        }
      }

      // ──────────────────────────────────────────────
      // Live Artificial Vision Tracking (Autonomous HUD)
      // ──────────────────────────────────────────────
      hudTargets.forEach((target, idx) => {
        // Soft coordinate update representing scanning of user elements
        const pulseSize = target.size + Math.sin(localFrameCount * 0.08 + idx) * 4;
        const driftX = target.x + Math.sin(localFrameCount * 0.01 + idx) * 15 * (1.0 - cyberCoherence);
        const driftY = target.y + Math.cos(localFrameCount * 0.01 + idx) * 15 * (1.0 - cyberCoherence);

        ctx.strokeStyle = 'rgba(20, 184, 166, 0.6)';
        ctx.lineWidth = 1;
        ctx.strokeRect(driftX - pulseSize / 2, driftY - pulseSize / 2, pulseSize, pulseSize);

        // Bounding corners
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 1.5;
        const cornerLength = 8;
        
        // Top Left
        ctx.beginPath();
        ctx.moveTo(driftX - pulseSize / 2, driftY - pulseSize / 2 + cornerLength);
        ctx.lineTo(driftX - pulseSize / 2, driftY - pulseSize / 2);
        ctx.lineTo(driftX - pulseSize / 2 + cornerLength, driftY - pulseSize / 2);
        ctx.stroke();

        // Bottom Right
        ctx.beginPath();
        ctx.moveTo(driftX + pulseSize / 2, driftY + pulseSize / 2 - cornerLength);
        ctx.lineTo(driftX + pulseSize / 2, driftY + pulseSize / 2);
        ctx.lineTo(driftX + pulseSize / 2 - cornerLength, driftY + pulseSize / 2);
        ctx.stroke();

        // Telemetry readout text
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 8px monospace';
        ctx.fillText(target.label, driftX - pulseSize / 2, driftY - pulseSize / 2 - 5);

        // Tracking locked indicator
        ctx.fillStyle = 'rgba(20, 184, 166, 0.9)';
        ctx.fillText(`LOCK: [${Math.round(driftX)}, ${Math.round(driftY)}]`, driftX - pulseSize / 2, driftY + pulseSize / 2 + 10);
      });

      // Status indicator on overlay
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(5, 5, 120, 32);
      ctx.strokeStyle = 'rgba(20, 184, 166, 0.3)';
      ctx.strokeRect(5, 5, 120, 32);

      ctx.fillStyle = 'rgba(20, 184, 166, 1.0)';
      ctx.font = 'bold 8px monospace';
      ctx.fillText(isCapturing ? '● FEED SOURCE: LIVE CAPTURE' : '● FEED SOURCE: SIM MATRIX', 10, 15);
      ctx.fillStyle = 'rgba(148, 163, 184, 1.0)';
      ctx.fillText(`FPS: 60 | RECO: ${Math.round(cyberCoherence*100)}%`, 10, 24);
      ctx.fillText(`RES: ${resonance.toFixed(2)} | DEC: ${decay.toFixed(2)}`, 10, 31);

      // Recursive loop
      animationId = requestAnimationFrame(drawHUD);
    };

    drawHUD();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isCapturing, resonance, decay, cyberCoherence, temporalFrequency, activeShaderMode]);

  // Handle PiP Toggle
  const togglePictureInPicture = async () => {
    const canvas = canvasRef.current;
    const pipVideo = pipVideoRef.current;

    if (!canvas || !pipVideo) {
      setStreamError("PiP hardware nodes not fully initialized.");
      return;
    }

    if (isPipActive) {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        }
        setIsPipActive(false);
      } catch (err: any) {
        console.error("Exit PiP error:", err);
      }
    } else {
      try {
        // Stream the Canvas element directly into a `<video>` track
        // @ts-ignore
        const canvasStream = canvas.captureStream(30);
        pipVideo.srcObject = canvasStream;
        
        pipVideo.onloadedmetadata = async () => {
          await pipVideo.play();
          try {
            await pipVideo.requestPictureInPicture();
            setIsPipActive(true);
            const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            setTurbopackLogs(prev => [
              { timestamp: ts, type: 'success', message: '📺 Picture-in-Picture window activated! Floating overlay popped out.' },
              ...prev
            ]);
          } catch (e: any) {
            console.error("PiP request failed:", e);
            setStreamError("Picture-in-Picture failed. Note: PiP requires active user interaction gesture.");
          }
        };

        // Listen for standard PiP events
        pipVideo.addEventListener('leavepictureinpicture', () => {
          setIsPipActive(false);
        });

      } catch (err: any) {
        console.error("Canvas stream PiP error:", err);
        setStreamError("Your browser doesn't support canvas stream Picture-in-Picture.");
      }
    }
  };

  // Compile / Reload mock update
  const handleCompileShader = () => {
    const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setTurbopackLogs(prev => [
      { timestamp: ts, type: 'action', message: `🚀 [Turbopack] Dynamic Recompilation triggered: "${customEquation}"` },
      { timestamp: ts, type: 'success', message: `✨ Rebuilt shaders successfully in 0.8ms! Overlay equations adjusted.` },
      ...prev
    ]);
    
    // Briefly boost resonance on compile
    setResonance(1.0);
    setTimeout(() => setResonance(0.65), 800);
  };

  return (
    <div id="ai-overlay-engine-station" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6 overflow-hidden">
      
      {/* Header section with telemetry badge */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-4 mb-4 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-teal-500/10 text-teal-400 font-mono text-[9px] px-2 py-0.5 rounded border border-teal-500/20 font-bold uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
              <Activity size={10} /> Live Quantum Workspace
            </span>
            <span className="text-slate-600 font-mono text-xs">|</span>
            <h3 className="text-xs font-semibold text-slate-300 font-mono uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles size={13} className="text-purple-400 animate-spin-slow" />
              SOPHIA Screen Interrogator & WebGL HUD
            </h3>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Shares your screen feed into our overlay matrix. Renders responsive cyber HUD, tracking boxes, shader mutations and actual PiP popout.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isCapturing ? (
            <button
              onClick={stopScreenCapture}
              className="px-3 py-1.5 rounded-lg bg-red-950/80 border border-red-800 text-red-200 text-xs font-mono font-bold flex items-center gap-1.5 hover:bg-red-900/60 transition-colors cursor-pointer"
            >
              <StopCircle size={13} /> Close Feed
            </button>
          ) : (
            <button
              onClick={startScreenCapture}
              className="px-3 py-1.5 rounded-lg bg-teal-600 border border-teal-500 text-slate-950 text-xs font-mono font-bold flex items-center gap-1.5 hover:bg-teal-500 transition-colors shadow-lg shadow-teal-500/10 cursor-pointer"
            >
              <ScreenShare size={13} /> Capture Screen
            </button>
          )}

          <button
            onClick={togglePictureInPicture}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isPipActive 
                ? 'bg-purple-950/85 border-purple-700 text-purple-200' 
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900'
            }`}
          >
            <Tv size={13} /> {isPipActive ? 'Close PiP Window' : 'Picture-in-Picture'}
          </button>
        </div>
      </div>

      {streamError && (
        <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-3 mb-4 text-[10.5px] text-red-200 leading-snug">
          ⚠️ {streamError}
        </div>
      )}

      {/* Main layout with Canvas viewport and controls */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        
        {/* Left side: Canvas viewport and preset nodes */}
        <div className="xl:col-span-7 flex flex-col gap-3">
          
          <div className="relative bg-slate-950 rounded-xl overflow-hidden border border-slate-850/80 aspect-video flex flex-col justify-center items-center shadow-inner">
            {/* Native Screen Feed Frame */}
            <canvas
              ref={canvasRef}
              width={640}
              height={360}
              className="w-full h-full object-cover block"
            />

            {/* Hidden element links necessary for real-time video streaming */}
            <video
              ref={hiddenVideoRef}
              style={{ display: 'none' }}
              playsInline
              muted
              crossOrigin="anonymous"
            />

            <video
              ref={pipVideoRef}
              style={{ display: 'none' }}
              playsInline
              muted
              crossOrigin="anonymous"
            />

            {/* Floating indicator when screen sharing is inactive */}
            {!isCapturing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/85 pointer-events-none p-4 text-center">
                <Video size={36} className="text-slate-700 mb-2 animate-bounce" />
                <span className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider">Holographic construct active</span>
                <p className="text-[9.5px] text-slate-500 max-w-[280px] mt-1">
                  Click outer "Capture Screen" to feed and calibrate real vision tracking overlays.
                </p>
              </div>
            )}
          </div>

          {/* Shader selection pills */}
          <div className="bg-slate-950 border border-slate-850/60 p-2.5 rounded-lg flex flex-wrap items-center gap-1.5">
            <span className="text-[9px] font-mono text-slate-500 uppercase font-bold mr-2">Filter Shader Matrix:</span>
            {(['sacred_mesh', 'hologram', 'matrix', 'chroma_glitch'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setActiveShaderMode(mode)}
                className={`px-2 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wide cursor-pointer transition-all border ${
                  activeShaderMode === mode
                    ? 'bg-teal-500/10 border-teal-500 text-teal-300'
                    : 'bg-slate-900 border-slate-850 text-slate-500 hover:text-slate-300'
                }`}
              >
                {mode.replace('_', ' ')}
              </button>
            ))}
          </div>

        </div>

        {/* Right side: Real-time controls + Simulated Turbopack Output */}
        <div className="xl:col-span-12 xl:grid xl:grid-cols-2 gap-5 xl:mt-0 mt-5">
          
          {/* Section A: Telemetry controls */}
          <div className="bg-slate-950 border border-slate-850/60 p-4 rounded-xl flex flex-col justify-between space-y-4">
            
            <div className="space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider flex items-center gap-1">
                  <Sliders size={12} className="text-purple-400" />
                  Calibrate Overlay Constants
                </span>
                
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isAiAutopilot}
                    onChange={(e) => setIsAiAutopilot(e.target.checked)}
                    className="w-3.5 h-3.5 accent-teal-500 cursor-pointer"
                  />
                  <span className="text-[9px] font-mono text-teal-400 font-bold uppercase">AI Autopilot</span>
                </label>
              </div>

              {/* Slider 1: Resonance */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Quantum Resonance</span>
                  <span className="text-teal-400 font-bold">{Math.round(resonance * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  disabled={isAiAutopilot}
                  value={resonance}
                  onChange={(e) => setResonance(parseFloat(e.target.value))}
                  className="w-full accent-teal-500 h-1 bg-slate-900 rounded-lg cursor-pointer disabled:opacity-50"
                />
                <span className="text-[8px] text-slate-500 block leading-none">Controls alpha blend overlap and visual weight.</span>
              </div>

              {/* Slider 2: Decay */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Temporal Decay Rate</span>
                  <span className="text-teal-400 font-bold">{Math.round(decay * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  disabled={isAiAutopilot}
                  value={decay}
                  onChange={(e) => setDecay(parseFloat(e.target.value))}
                  className="w-full accent-teal-500 h-1 bg-slate-900 rounded-lg cursor-pointer disabled:opacity-50"
                />
                <span className="text-[8px] text-slate-500 block leading-none">Controls trailing persistence of coordinates.</span>
              </div>

              {/* Slider 3: Coherence */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Vision Coherence Threshold</span>
                  <span className="text-teal-400 font-bold">{Math.round(cyberCoherence * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  disabled={isAiAutopilot}
                  value={cyberCoherence}
                  onChange={(e) => setCyberCoherence(parseFloat(e.target.value))}
                  className="w-full accent-teal-500 h-1 bg-slate-900 rounded-lg cursor-pointer disabled:opacity-50"
                />
                <span className="text-[8px] text-slate-500 block leading-none">Controls stability of lock coordinates.</span>
              </div>

              {/* Slider 4: Time Frequency */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>SOPHIA Focus Frequency</span>
                  <span className="text-teal-400 font-bold">{temporalFrequency.toFixed(2)}Hz</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="3.0"
                  step="0.05"
                  disabled={isAiAutopilot}
                  value={temporalFrequency}
                  onChange={(e) => setTemporalFrequency(parseFloat(e.target.value))}
                  className="w-full accent-teal-500 h-1 bg-slate-900 rounded-lg cursor-pointer disabled:opacity-50"
                />
                <span className="text-[8px] text-slate-500 block leading-none">Frequency speed of sacred geometry waves.</span>
              </div>
            </div>

            {/* Live modifier custom code console */}
            <div className="border-t border-slate-900 pt-3 flex flex-col gap-1.5">
              <label className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider block">
                Adjust Shader Math Formula (Turbopack Real-Time Compile):
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={customEquation}
                  onChange={(e) => setCustomEquation(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-850 rounded px-2.5 py-1 text-[11px] font-mono text-purple-300 focus:outline-none focus:border-purple-500"
                  placeholder="e.g. sin(x * t) - cos(y)"
                />
                <button
                  onClick={handleCompileShader}
                  className="bg-purple-600 hover:bg-purple-500 hover:text-white text-slate-100 border border-purple-500 px-3 py-1 rounded text-xs transition-colors cursor-pointer flex items-center gap-1 font-semibold"
                >
                  <RefreshCw size={11} className="animate-spin-slow" /> HMR Inject
                </button>
              </div>
            </div>

          </div>

          {/* Section B: Simulated Turbopack compile stream terminal logs */}
          <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col justify-between space-y-3">
            <div className="space-y-2 flex-1 flex flex-col">
              
              <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
                <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal size={12} className="text-teal-400" />
                  Live Turbopack HMR Console
                </span>
                <span className="text-[8px] text-slate-500 font-mono tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-ping"></span> REAL-TIME MONITOR
                </span>
              </div>

              {/* Logs visual table */}
              <div className="bg-slate-1000 border border-slate-900 rounded p-2.5 font-mono text-[9px] overflow-y-auto max-h-[145px] space-y-1.5 flex-1 select-none">
                {turbopackLogs.map((log, index) => (
                  <div key={index} className="flex items-start justify-between border-b border-slate-900/60 pb-1 last:border-0 leading-normal">
                    <div className="flex items-start gap-1.5">
                      <span className="text-slate-600 font-bold">{log.timestamp}</span>
                      <p className={`whitespace-pre-line text-left ${
                        log.type === 'success' 
                          ? 'text-teal-400' 
                          : log.type === 'warn' 
                            ? 'text-amber-500' 
                            : log.type === 'action' 
                              ? 'text-purple-400' 
                              : 'text-slate-400'
                      }`}>
                        {log.message}
                      </p>
                    </div>
                    {log.duration && (
                      <span className="text-[8px] bg-slate-900 text-slate-500 px-1 py-0.5 rounded ml-1 uppercase">{log.duration}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Live diagnostic details at footer */}
              <div className="text-[8.5px] font-mono text-slate-500 flex items-center justify-between border-t border-slate-900 pt-2 leading-none whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <span>HMR Modules: <strong className="text-teal-500">128 active</strong></span>
                  <span>Hot-re-compile count: <strong className="text-purple-400">14 updates</strong></span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <Clock size={9} /> Loop: 1.000s
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
