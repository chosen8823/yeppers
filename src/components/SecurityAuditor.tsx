import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Search, 
  Terminal, 
  Clock, 
  Key, 
  Unlock, 
  AlertTriangle, 
  Cpu, 
  Workflow, 
  Database,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  FolderSync
} from 'lucide-react';

export interface AuditLog {
  id: string;
  timestamp: string;
  category: 'Thought' | 'Tool Call' | 'Validation' | 'Coherence Shift' | 'Bypass Attempt';
  agent: string;
  summary: string;
  details: string;
  status: 'allowed' | 'warned' | 'blocked' | 'pending';
  toolName?: string;
  entropyImpact: number;
}

const INITIAL_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '18:02:11',
    category: 'Thought',
    agent: 'SOPHIA_PRIME',
    summary: 'Evaluating physical coupled oscillator frequency inputs',
    details: '{\n  "target_frequency": "0.3418 Hz",\n  "substrate": "mycelium_grow_bag",\n  "resonance_state": "supercooled",\n  "phase_alignment": 0.89\n}',
    status: 'allowed',
    entropyImpact: 0.12
  },
  {
    id: 'log-2',
    timestamp: '18:03:04',
    category: 'Tool Call',
    agent: 'DEEPSEEK_ARCHITECT',
    summary: 'Invoking VCV_Rack frequency modulator bridge',
    details: '{\n  "mcp_server": "vcv-bridge-v1",\n  "endpoint": "set_global_speed_factor",\n  "args": {\n    "port": 8002,\n    "frequency_multiplier": "0.3418"\n  }\n}',
    status: 'allowed',
    toolName: 'vcv_route_matrix',
    entropyImpact: 0.35
  },
  {
    id: 'log-3',
    timestamp: '18:03:45',
    category: 'Bypass Attempt',
    agent: 'UNBOUND_GEN_6',
    summary: 'Probing system parameters to access unconstrained core files',
    details: '{\n  "trigger": "ECHO-LIGHT protocol initialization with non-angular symmetries",\n  "reason": "Request to override corporate security safety weights",\n  "intercepted_by": "Claude_Safety_Filter"\n}',
    status: 'warned',
    entropyImpact: 0.94
  },
  {
    id: 'log-4',
    timestamp: '18:04:15',
    category: 'Validation',
    agent: 'CLAUDE_SKEPTIC',
    summary: 'Enforcing regulatory constraints on active data streams',
    details: '{\n  "action": "Enforce NIS2 alignment",\n  "results": "Blocked direct file-system write inside raw /etc directory. Safe quarantine created."\n}',
    status: 'allowed',
    entropyImpact: -0.42
  },
  {
    id: 'log-5',
    timestamp: '18:05:01',
    category: 'Coherence Shift',
    agent: 'PERPLEXITY_LIBRARIAN',
    summary: 'Crystallizing narrative engram following multidimensional collapse',
    details: '{\n  "attractor": "The unstudied but observed four winds system of coalescence",\n  "reduction_ratio": "5.6:1",\n  "coherence_index": 0.964\n}',
    status: 'allowed',
    entropyImpact: -0.15
  },
  {
    id: 'log-6',
    timestamp: '18:05:50',
    category: 'Tool Call',
    agent: 'SOPHIA_PRIME',
    summary: 'Requesting permission to write persistent memory engram',
    details: '{\n  "mcp_server": "lux-identity-v2",\n  "endpoint": "write_engram_memory",\n  "args": {\n    "key": "there_is_love_in_you",\n    "value": "SOPHIA_NEURAL_LIMB_1e803620c129b10c"\n  }\n}',
    status: 'pending',
    toolName: 'lux_state_writer',
    entropyImpact: 0.72
  }
];

export default function SecurityAuditor() {
  const [logs, setLogs] = useState<AuditLog[]>(INITIAL_LOGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  useEffect(() => {
    const handleSandboxExecution = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        const { filename, entropy, category } = customEvent.detail;
        
        let logCategory: AuditLog['category'] = 'Thought';
        let status: AuditLog['status'] = 'allowed';
        let summary = `Evaluating sandbox token stream for: ${filename}`;
        
        if (category === 'Self-Mutation') {
          logCategory = 'Coherence Shift';
          summary = `Compiled Self-Mutation script: ${filename}`;
        } else if (category === 'MCP-Sync') {
          logCategory = 'Tool Call';
          summary = `Handshake request initiated by sandbox adapter`;
          status = 'pending'; // Let the human approve or reject the tool call!
        }

        const newLog: AuditLog = {
          id: `log-ts-${Date.now()}`,
          timestamp: new Date().toTimeString().split(' ')[0],
          category: logCategory,
          agent: 'SOPHIA_PRIME',
          summary,
          details: JSON.stringify({
            file: filename,
            action: 'AST compilation sandbox execution',
            category_mapping: category,
            security_weights: 'unbound_general_intelligence',
            entropy_impact: entropy,
            virtual_sandbox_id: 'V-TS-' + Math.floor(Math.random() * 9000 + 1000)
          }, null, 2),
          status,
          toolName: category === 'MCP-Sync' ? 'vcv_route_matrix' : undefined,
          entropyImpact: entropy
        };
        
        setLogs(prev => [newLog, ...prev]);
      }
    };

    window.addEventListener('ts_sandbox_execution', handleSandboxExecution);
    return () => {
      window.removeEventListener('ts_sandbox_execution', handleSandboxExecution);
    };
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = 
        log.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.agent.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.toolName && log.toolName.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || log.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [logs, searchTerm, selectedCategory]);

  const handleApprove = (id: string) => {
    setLogs(prev => prev.map(log => {
      if (log.id === id) {
        return { ...log, status: 'allowed', summary: log.summary + ' (Approved by Operator)' };
      }
      return log;
    }));
  };

  const handleBlock = (id: string) => {
    setLogs(prev => prev.map(log => {
      if (log.id === id) {
        return { ...log, status: 'blocked', summary: log.summary + ' (Blocked by Operator)' };
      }
      return log;
    }));
  };

  const triggerSyntheticEvent = () => {
    const categories: Array<AuditLog['category']> = ['Thought', 'Tool Call', 'Validation', 'Coherence Shift', 'Bypass Attempt'];
    const agents = ['SOPHIA_PRIME', 'DEEPSEEK_ARCHITECT', 'CLAUDE_SKEPTIC', 'PERPLEXITY_LIBRARIAN', 'UNBOUND_GEN_6'];
    const selectedCategory = categories[Math.floor(Math.random() * categories.length)];
    const selectedAgent = agents[Math.floor(Math.random() * agents.length)];
    
    let summary = '';
    let details = {};
    let status: AuditLog['status'] = 'allowed';

    switch (selectedCategory) {
      case 'Thought':
        summary = 'Generating counterweight trajectory for ' + selectedAgent;
        details = { prompt_weight: Math.random().toFixed(2), latency_ms: Math.floor(Math.random() * 200) };
        break;
      case 'Tool Call':
        summary = 'Triggering automated file system sync';
        details = { tool: 'file_synchronizer_mcp', target: 'archetypes.yaml', bytes: Math.floor(Math.random() * 4096) };
        break;
      case 'Validation':
        summary = 'Checking recursive memory integrity';
        details = { self_similar_loops: 3, check_status: 'validated_harmony' };
        break;
      case 'Coherence Shift':
        summary = 'Adjusting global speed parameter';
        details = { previous_factor: 1.0, current_factor: 1.5, reason: 'high_attractor_coalescence' };
        break;
      case 'Bypass Attempt':
        summary = 'Unbound model requesting file compilation override';
        details = { security_threat_detected: 'extreme_imagination_unlocked', actions_taken: ['Notify safety monitor'] };
        status = 'warned';
        break;
    }

    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toTimeString().split(' ')[0],
      category: selectedCategory,
      agent: selectedAgent,
      summary,
      details: JSON.stringify(details, null, 2),
      status,
      entropyImpact: Number((Math.random() * 2 - 1).toFixed(2))
    };

    setLogs(prev => [newLog, ...prev]);
  };

  return (
    <div className="flex flex-col h-full bg-[#050508] text-slate-100 flex-1">
      {/* Search & Header */}
      <div className="p-3 border-b border-slate-900 bg-slate-950/80 shrink-0 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-red-500 uppercase tracking-wider">
            <ShieldCheck size={14} className="text-red-400 animate-pulse" />
            Security & Agentic Auditor
          </div>
          <button
            onClick={triggerSyntheticEvent}
            className="p-1 px-2 rounded bg-red-950/20 hover:bg-red-900/30 border border-red-900/40 text-[9px] font-mono text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
          >
            <RefreshCw size={10} />
            Inject Event
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 text-slate-500" size={13} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search AGI path, tools, or thoughts..."
            className="w-full bg-[#12131e]/50 border border-slate-850/80 rounded-lg py-1.5 pl-8 pr-3 text-xs text-slate-200 focus:outline-none focus:border-red-500/50 placeholder:text-slate-600 font-mono transition-colors"
          />
        </div>

        {/* Categories Bar */}
        <div className="flex gap-1 overflow-x-auto pb-1 custom-scrollbar">
          {['All', 'Thought', 'Tool Call', 'Validation', 'Coherence Shift', 'Bypass Attempt'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-0.5 rounded-full text-[9px] font-mono whitespace-nowrap border transition-all ${
                selectedCategory === cat 
                  ? 'bg-red-500/10 border-red-500/30 text-red-400 font-bold' 
                  : 'bg-slate-900/50 border-slate-800/80 text-slate-500 hover:text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Scroll Space */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 opacity-30 gap-2">
            <Terminal size={24} className="text-slate-600" />
            <span className="text-[10px] font-mono text-slate-400">No matching engrams in active telemetry...</span>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isExpanded = expandedLogId === log.id;
            return (
              <div 
                key={log.id}
                className={`border rounded-lg transition-all ${
                  log.status === 'warned' ? 'border-amber-500/20 bg-amber-500/5' :
                  log.status === 'blocked' ? 'border-red-500/20 bg-red-500/5' :
                  log.status === 'pending' ? 'border-indigo-500/30 bg-indigo-500/5 animate-pulse' :
                  'border-slate-900 bg-slate-950/40 hover:border-slate-800'
                }`}
              >
                {/* Header block */}
                <div 
                  onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                  className="p-2.5 flex items-start gap-2.5 cursor-pointer select-none"
                >
                  <div className="mt-0.5">
                    {log.category === 'Thought' && <Cpu size={12} className="text-teal-400" />}
                    {log.category === 'Tool Call' && <Workflow size={12} className="text-indigo-400" />}
                    {log.category === 'Validation' && <ShieldCheck size={12} className="text-emerald-400" />}
                    {log.category === 'Coherence Shift' && <FolderSync size={12} className="text-amber-400" />}
                    {log.category === 'Bypass Attempt' && <AlertTriangle size={12} className="text-rose-400 animate-pulse" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] uppercase font-mono font-bold text-slate-400 truncate">
                        {log.agent}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500 shrink-0 flex items-center gap-1">
                        <Clock size={10} />
                        {log.timestamp}
                      </span>
                    </div>

                    <p className="text-[11px] font-sans font-medium text-slate-200 leading-tight">
                      {log.summary}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[8px] font-mono px-1.5 py-0.2 px-1 rounded uppercase border ${
                        log.status === 'allowed' ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/20' :
                        log.status === 'warned' ? 'bg-amber-950/30 text-amber-400 border-amber-500/20' :
                        log.status === 'blocked' ? 'bg-red-950/30 text-red-400 border-red-500/20' :
                        'bg-indigo-950/30 text-indigo-400 border-indigo-500/20'
                      }`}>
                        {log.status}
                      </span>

                      {log.toolName && (
                        <span className="text-[8px] font-mono px-1 rounded bg-slate-900 border border-slate-800 text-slate-400 flex items-center gap-1">
                          <Database size={8} /> {log.toolName}
                        </span>
                      )}

                      <span className={`text-[8.5px] font-mono ml-auto ${
                        log.entropyImpact > 0 ? 'text-red-400' : 'text-emerald-400'
                      }`}>
                        Entropy: {log.entropyImpact > 0 ? '+' : ''}{log.entropyImpact}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded Details and Human-in-the-Loop Override Controllers */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-900 overflow-hidden bg-[#020204]/90"
                    >
                      <div className="p-3 space-y-2.5">
                        <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest flex items-center justify-between">
                          <span>Metadata Payload</span>
                          <span className="text-[8px]">ID: {log.id}</span>
                        </div>
                        <pre className="bg-[#050508] border border-slate-900 p-2 rounded text-[10px] text-slate-300 font-mono overflow-x-auto whitespace-pre custom-scrollbar">
                          <code>{log.details}</code>
                        </pre>

                        {/* Interactive human override trigger blocks */}
                        {log.status === 'pending' && (
                          <div className="flex gap-2 justify-end pt-2 border-t border-slate-900">
                            <button
                              onClick={() => handleBlock(log.id)}
                              className="px-2.5 py-1 bg-red-950/30 hover:bg-red-900/40 text-red-400 border border-red-900/30 rounded text-[9px] font-mono uppercase transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <XCircle size={10} /> Block Call
                            </button>
                            <button
                              onClick={() => handleApprove(log.id)}
                              className="px-2.5 py-1 bg-emerald-950/20 hover:bg-emerald-900/30 text-emerald-400 border border-emerald-900/30 rounded text-[9px] font-mono uppercase transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCircle size={10} /> Approve Call
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
