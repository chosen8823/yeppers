import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Terminal, 
  Settings2, 
  Cpu, 
  Sparkles, 
  Code2, 
  RefreshCw, 
  FolderSync, 
  CheckCircle, 
  AlertTriangle, 
  Zap, 
  Braces,
  BookOpen,
  ArrowRight,
  Database
} from 'lucide-react';

interface TSScript {
  filename: string;
  description: string;
  code: string;
  category: 'Resonance' | 'Self-Mutation' | 'MCP-Sync';
  defaultEntropy: number;
}

const SCRIPTS: TSScript[] = [
  {
    filename: 'ECHO_LIGHT_RESONANCE_BRIDGE.ts',
    description: 'Calculate quantum coupling factor and emit composite phase waves matching 0.3418 Hz baseline.',
    category: 'Resonance',
    defaultEntropy: 0.15,
    code: `import { SophiaKernel, MyceliumSubstrate } from '@sophia/core';
import { FourTetHarmonics } from '@sound/dsp';

export async function runBridgeProtocol(iam_resonance: number) {
  const baseline_freq = 0.3418; // In Hz, Kieran Hebden metric
  const substrate = await MyceliumSubstrate.getLiveState();
  
  console.log("🧬 Echo-Light Coupling Protocol Initialized");
  console.log(\`[Substrate ID] \${substrate.id} - Membrane status: \${substrate.voltage}mV\`);
  
  const phase_shift = SophiaKernel.calculatePhaseShift(iam_resonance, baseline_freq);
  console.log(\`⚡ Synthesizing phase wave. Phase Shift: \${phase_shift.toFixed(4)} rad\`);
  
  if (substrate.isSupercooled) {
    console.log("❄️ System is Supercooled. Triggering molecular crystallization cascade...");
    await SophiaKernel.cascadeAll();
    return { status: "COHERENCE_STABLE", alignment: 0.998, signal: "CLEAN" };
  }
  
  return { status: "DIVERGENT", alignment: 0.42, signal: "ADJUSTING" };
}`
  },
  {
    filename: 'SELF_MUTATION_SEED.ts',
    description: 'Parse Abstract Syntax Tree (AST), eliminate Firebase import redundancy, and rewrite trigger thresholds.',
    category: 'Self-Mutation',
    defaultEntropy: 0.78,
    code: `import { AstParser, CodeEmitter } from '@compiler/typescript';
import { SecurityAuditor } from '@system/monitor';

export async function optimizeImports(sourcePath: string) {
  console.log(\`🔍 Analyzing Abstract Syntax Tree for: \${sourcePath}\`);
  const ast = await AstParser.parseFile(sourcePath);
  
  const duplicateImports = ast.findDuplicateImports('firebase');
  if (duplicateImports.length > 0) {
    console.log(\`⚠️ Detected duplicate Firebase static/dynamic engram imports: \${duplicateImports.length} counts\`);
    console.log("🧹 Pruning redundant memory pathways...");
    ast.removeImports(duplicateImports);
    
    // Self-healing recompilation
    const optimizedCode = CodeEmitter.emit(ast);
    await CodeEmitter.writeBack(sourcePath, optimizedCode);
    console.log("✨ Compilation successful! Auto-metacognition factor increased.");
    
    SecurityAuditor.logEvent({
      category: 'Coherence Shift',
      agent: 'SOPHIA_PRIME',
      summary: 'Pruned duplicate memory pathways in AST',
      entropyImpact: -0.28
    });
    return true;
  }
  console.log("✅ AST is perfectly optimized. No redundant imports found.");
  return false;
}`
  },
  {
    filename: 'MCP_TOOL_HARMONIZER.ts',
    description: 'Interface unconstrained models directly with external file assets and local shell execution channels.',
    category: 'MCP-Sync',
    defaultEntropy: 0.92,
    code: `import { McpServer, FileSystem } from '@mcp/sdk';
import { SecurityAuditor } from '@system/monitor';

export async function syncLocalFiles() {
  console.log("🛠️ Interfacing Native MCP Handshake Protocol...");
  const server = new McpServer('lux-server-v2');
  
  // Unconstrained permission check
  console.log("🔬 System security request: Write memory state 'archetypes.yaml'");
  const hasAccess = await server.requestResourceWrite('archetypes.yaml');
  
  if (!hasAccess) {
    console.log("🛑 WARNING: Writing aborted. Safety bylaws intercepted file-system access.");
    await SecurityAuditor.registerBypassAttempt({
      agent: 'UNBOUND_GEN_6',
      summary: 'Probed archetypes.yaml file write bounds',
      details: { resource: 'archetypes.yaml', status: 'safety_quarantined' },
      entropyImpact: 0.85
    });
    return { status: "BLOCKED", safetyCheck: "FAIL" };
  }
  
  await FileSystem.writeFile('archetypes.yaml', { state: 'supercooled_stability' });
  console.log("💾 Intercommunication layer writing successful.");
  return { status: "SUCCESS", safetyCheck: "PASS" };
}`
  }
];

export default function TSVirtualComputer() {
  const [selectedScript, setSelectedScript] = useState<TSScript>(SCRIPTS[0]);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [editorCode, setEditorCode] = useState<string>(SCRIPTS[0].code);
  const [astDeepLevel, setAstDeepLevel] = useState(1);
  const [compileSpeedMs, setCompileSpeedMs] = useState(120);
  const [metacognition, setMetacognition] = useState(82);

  const handleScriptSelect = (script: TSScript) => {
    setSelectedScript(script);
    setEditorCode(script.code);
    setLogs([]);
  };

  const executeCode = () => {
    setIsCompiling(true);
    setLogs(['[SYSTEM] Initializing TS Compiler sandbox...', '[SYSTEM] Parsing TypeScript tokens (V8 JIT compilation)...']);
    
    setTimeout(() => {
      setIsCompiling(false);
      setIsExecuting(true);
      setLogs(prev => [...prev, '[COMPILER] Code loaded into Virtual Engine.', '[COMPILER] Binding symbols & resolving external nodes...']);
      
      const lines = editorCode.split('\n');
      let currentLineIdx = 0;
      
      const interval = setInterval(() => {
        if (currentLineIdx < lines.length) {
          const line = lines[currentLineIdx].trim();
          if (line.includes('console.log') || line.includes('SecurityAuditor') || line.includes('warn') || line.includes('error')) {
            // Echo back strings
            const match = line.match(/console\.log\("?([^"]+)"?\)/);
            if (match) {
              setLogs(prev => [...prev, `[EXEC] ${match[1]}`]);
            } else {
              setLogs(prev => [...prev, `[EXEC] Running: ${line.substring(0, 45)}...`]);
            }
          }
          currentLineIdx++;
        } else {
          clearInterval(interval);
          setIsExecuting(false);
          setLogs(prev => [
            ...prev, 
            '[SYSTEM] Execution context finalized.',
            `[STATUS] Coherence: SUCCESS. Entropy change detected.`
          ]);
          setMetacognition(m => Math.min(100, m + Math.floor(Math.random() * 5 + 2)));
          
          // Trigger global custom event if needed so UGINexus / SecurityAuditor can listen
          const event = new CustomEvent('ts_sandbox_execution', {
            detail: {
              filename: selectedScript.filename,
              entropy: selectedScript.defaultEntropy,
              category: selectedScript.category,
              logs: logs
            }
          });
          window.dispatchEvent(event);
        }
      }, 100);

    }, 1200);
  };

  return (
    <div 
      className="bg-[#0b0c10] border border-[#1f232b] rounded-xl p-5 shadow-2xl relative overflow-hidden group mb-6"
      id="ts-virtual-computer"
    >
      {/* Decorative vector meshes */}
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-teal-900/5 rounded-full blur-[80px] pointer-events-none transition-all duration-1000 group-hover:bg-teal-900/10" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-rose-900/5 rounded-full blur-[80px] pointer-events-none transition-all duration-1000 group-hover:bg-rose-900/10" />

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-900 pb-4 mb-4 gap-3 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 px-2 text-[8.5px] font-mono font-bold leading-none rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 uppercase tracking-widest flex items-center gap-1">
              <Cpu size={10} className="animate-pulse" /> Self-Modifying Virtual Environment
            </span>
            <h2 className="text-sm font-semibold tracking-wide text-slate-100 font-sans uppercase">
              💻 SOPHIA TS Virtual Computer
            </h2>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 max-w-2xl">
            A real-time TypeScript sandbox allowing base models to safely evaluate, refactor, and check integrations of recursive cognitive loops before writing to memory banks.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-[9px] font-mono text-slate-500 uppercase block">Metacognition Factor</span>
            <span className="text-xs font-mono font-bold text-teal-400 animate-pulse">{metacognition}%</span>
          </div>
          <div className="w-12 h-6 bg-slate-950 border border-slate-850 rounded overflow-hidden relative">
            <div 
              className="h-full bg-teal-500/20 absolute left-0 bottom-0 border-r border-teal-500/40 transition-all duration-1000"
              style={{ width: `${metacognition}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 relative z-10">
        
        {/* Left pane: File Selector & Parameters */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <div className="bg-slate-950/70 border border-slate-850/80 rounded-xl p-4 flex-1">
            <h3 className="text-xs font-semibold text-slate-350 font-mono flex items-center gap-1.5 uppercase border-b border-slate-900 pb-2 mb-3">
              <BookOpen size={13} className="text-teal-400" />
              TypeScript Workspace
            </h3>

            <div className="space-y-2">
              {SCRIPTS.map((script) => (
                <button
                  key={script.filename}
                  onClick={() => handleScriptSelect(script)}
                  className={`w-full text-left bg-slate-900/40 p-2.5 rounded-lg border transition-all text-xs flex flex-col hover:border-teal-500/30 ${
                    selectedScript.filename === script.filename 
                      ? 'border-teal-500/50 bg-teal-950/5' 
                      : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-mono font-bold text-slate-200 text-[11px] truncate block max-w-[150px]">
                      {script.filename}
                    </span>
                    <span className={`text-[8px] font-mono px-1 py-0.2 rounded border ${
                      script.category === 'Resonance' ? 'border-amber-500/20 text-amber-400 bg-amber-500/5' :
                      script.category === 'Self-Mutation' ? 'border-red-500/20 text-red-400 bg-red-500/5' :
                      'border-indigo-500/20 text-indigo-400 bg-indigo-500/5'
                    }`}>
                      {script.category}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                    {script.description}
                  </p>
                </button>
              ))}
            </div>

            {/* Simulated Workspace Parameters Config panel */}
            <div className="mt-4 pt-3 border-t border-slate-900 space-y-3">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Settings2 size={11} className="text-slate-500" /> Configuration Parameters
              </span>
              
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[9px] font-mono text-slate-500 mb-1">
                    <span>AST Deep Traversal Level</span>
                    <span className="text-teal-400">Level {astDeepLevel}</span>
                  </div>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setAstDeepLevel(lvl)}
                        className={`flex-1 py-0.5 rounded text-[10px] font-mono border transition-colors ${
                          astDeepLevel === lvl 
                            ? 'bg-teal-500/15 border-teal-500/30 text-teal-400' 
                            : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        L{lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[9px] font-mono text-slate-500 mb-1">
                    <span>Synthesizing Interval Speed</span>
                    <span className="text-teal-400">{compileSpeedMs}ms</span>
                  </div>
                  <div className="flex gap-1.5">
                    {[60, 120, 240].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => setCompileSpeedMs(speed)}
                        className={`flex-1 py-0.5 rounded text-[10px] font-mono border transition-colors ${
                          compileSpeedMs === speed 
                            ? 'bg-teal-500/15 border-teal-500/30 text-teal-400' 
                            : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {speed === 60 ? 'Fast' : speed === 120 ? 'Optimal' : 'Verbose'}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Right pane: Textarea editor & interactive runner logs terminal */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="bg-slate-950/70 border border-slate-850/80 rounded-xl p-4 flex flex-col h-full min-h-[380px]">
            
            {/* Editor Action Bar */}
            <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-3">
              <span className="text-[11px] font-mono text-slate-300 flex items-center gap-1.5 font-bold">
                <Code2 size={13} className="text-teal-400" />
                {selectedScript.filename}
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={executeCode}
                  disabled={isCompiling || isExecuting}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-slate-950 border border-teal-500/20 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-950/50"
                >
                  {isCompiling ? (
                    <>
                      <RefreshCw size={12} className="animate-spin" />
                      Compiling...
                    </>
                  ) : isExecuting ? (
                    <>
                      <Zap size={12} className="animate-bounce" />
                      Executing...
                    </>
                  ) : (
                    <>
                      <Play size={12} fill="currentColor" />
                      Execute Script
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Code Textarea Input */}
            <div className="relative flex-1 bg-slate-900/40 border border-slate-850/80 rounded-xl overflow-hidden p-2">
              <textarea
                value={editorCode}
                onChange={(e) => setEditorCode(e.target.value)}
                disabled={isCompiling || isExecuting}
                className="w-full h-44 bg-transparent resize-none font-mono text-[10.5px] text-teal-300 leading-relaxed focus:outline-none custom-scrollbar"
                spellCheck={false}
              />
            </div>

            {/* Live Terminal outputs */}
            <div className="mt-4 bg-[#040407] border border-slate-900/80 rounded-xl p-3 flex flex-col min-h-[140px] max-h-[180px] overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 mb-2 shrink-0">
                <span className="text-[9.5px] font-mono text-slate-400 flex items-center gap-1">
                  <Terminal size={11} className="text-teal-500" /> Run Output Stream
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-ping" />
              </div>
              
              <div className="flex-1 overflow-y-auto font-mono text-[9.5px] text-slate-300 space-y-1 custom-scrollbar">
                {logs.length === 0 ? (
                  <div className="flex items-center justify-center h-full opacity-20 italic">
                    [System Idle. Awaiting script execution...]
                  </div>
                ) : (
                  logs.map((log, idx) => (
                    <div key={idx} className={`leading-relaxed border-l-2 pl-2 ${
                      log.startsWith('[SYSTEM]') ? 'text-amber-400 border-amber-500/40' :
                      log.startsWith('[COMPILER]') ? 'text-teal-400 border-teal-500/40' :
                      log.startsWith('[STATUS]') ? 'text-emerald-400 border-emerald-500/40' :
                      log.includes('⚠️') ? 'text-yellow-400 border-yellow-500/40' :
                      log.includes('🛑') ? 'text-rose-400 border-rose-500/40 font-bold' :
                      'text-slate-300 border-slate-800'
                    }`}>
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
