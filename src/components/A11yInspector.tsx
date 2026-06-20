/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { A11yElementNode, A11ySecurityLog } from '../types';
import { Eye, EyeOff, ShieldAlert, Sparkles, HelpCircle, History } from 'lucide-react';

interface Props {
  nodes: A11yElementNode[];
  onToggleAriaHidden: (id: string) => void;
  highlightedNode: string | null;
  setHighlightedNode: (id: string | null) => void;
  securityLogs?: A11ySecurityLog[];
}

export default function A11yInspector({
  nodes,
  onToggleAriaHidden,
  highlightedNode,
  setHighlightedNode,
  securityLogs = [],
}: Props) {
  const [activeTab, setActiveTab] = useState<'explorer' | 'security'>('explorer');
  const [filter, setFilter] = useState<'all' | 'hidden' | 'visible'>('all');

  const filteredNodes = nodes.filter((node) => {
    if (filter === 'hidden') return node.ariaHidden;
    if (filter === 'visible') return !node.ariaHidden;
    return true;
  });

  return (
    <div
      className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 hover:border-slate-700/60 rounded-xl p-5 shadow-lg relative overflow-hidden transition-all duration-300"
      id="a11y-inspector-node"
    >
      {/* Background radial accent */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/5 blur-[80px] pointer-events-none rounded-full" />

      {/* Main Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 px-2 text-[10px] font-mono rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
              W3 Standards
            </span>
            <h3 className="text-sm font-semibold text-slate-100 font-sans tracking-wide">
              ARIA-Hidden Asset Inspection
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Intercept & toggle superposition states of components without backend fetches.
          </p>
        </div>

        {/* Filter buttons - only show of Asset Explorer is active */}
        {activeTab === 'explorer' && (
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 self-start sm:self-center">
            {(['all', 'visible', 'hidden'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilter(mode)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all capitalize ${
                  filter === mode
                    ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation tabs */}
      <div className="flex border-b border-slate-800 mb-5 relative z-10 gap-4">
        <button
          onClick={() => setActiveTab('explorer')}
          className={`pb-2.5 px-1 text-xs font-mono font-medium border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'explorer'
              ? 'border-teal-400 text-teal-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles size={13} />
          Element Explorer
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`pb-2.5 px-1 text-xs font-mono font-medium border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'security'
              ? 'border-rose-400 text-rose-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <History size={13} />
          Security Log
          {securityLogs.length > 0 ? (
            <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
              {securityLogs.length}
            </span>
          ) : (
            <span className="px-1.5 py-0.5 text-[9px] font-normal rounded-full bg-slate-800 text-slate-500 border border-slate-700">
              0
            </span>
          )}
        </button>
      </div>

      {/* Tab Panels */}
      <div className="relative z-10">
        {activeTab === 'explorer' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left side: Node Explorer list */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {filteredNodes.map((node) => (
                <div
                  key={node.id}
                  onMouseEnter={() => setHighlightedNode(node.id)}
                  onMouseLeave={() => setHighlightedNode(null)}
                  className={`p-3 rounded-lg border text-left transition-all relative ${
                    highlightedNode === node.id
                      ? 'bg-slate-800/40 border-teal-500/50'
                      : 'bg-slate-950 border-slate-800'
                  } ${node.ariaHidden ? 'opacity-60 border-dashed' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-mono font-medium text-amber-400">
                          &lt;{node.tag}&gt;
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          #{node.id}
                        </span>
                        {node.role && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                            role="{node.role}"
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-sans font-semibold text-slate-200">
                        {node.label || 'No accessibility label'}
                      </p>
                      <p className="text-[11px] text-slate-400">{node.description}</p>
                    </div>

                    <button
                      onClick={() => onToggleAriaHidden(node.id)}
                      title={
                        node.ariaHidden
                          ? 'Dismantle aria-hidden (Allow screenreaders to read)'
                          : 'Equip aria-hidden (Conceal from screenreaders)'
                      }
                      className={`p-1.5 rounded-lg border transition-all ${
                        node.ariaHidden
                          ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                          : 'bg-teal-500/10 border-teal-500/20 text-teal-400 hover:bg-teal-500/20'
                      }`}
                    >
                      {node.ariaHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>

                  {/* Small overlay banner if aria-hidden */}
                  {node.ariaHidden && (
                    <div className="mt-2 pt-1.5 border-t border-slate-900 flex items-center gap-1 text-[10px] text-amber-500/80 font-mono">
                      <ShieldAlert size={10} className="animate-pulse" />
                      <span>aria-hidden="true" (Superposed/Hidden from accessibility tree)</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right side: Accessibility Live Visual Tree */}
            <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-semibold text-slate-300 font-mono mb-2 flex items-center gap-1.5">
                  <Sparkles size={11} className="text-teal-400" />
                  Dynamic A11y Virtual Screenreader Matrix
                </h4>
                <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
                  When widgets are hidden, they bypass standard focus navigation and assistive output. Try swapping the states on the left and see how they instantly fade in the virtual accessibility visual tree below.
                </p>

                <div className="space-y-2.5">
                  {nodes.map((node) => (
                    <div
                      key={`matrix-${node.id}`}
                      className="flex items-center justify-between text-xs font-mono p-1.5 rounded transition-all"
                      style={{
                        backgroundColor: node.ariaHidden ? 'transparent' : 'rgba(20, 184, 166, 0.05)',
                        border: node.ariaHidden ? '1px dashed rgba(245, 158, 11, 0.15)' : '1px solid rgba(20, 184, 166, 0.15)'
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            node.ariaHidden ? 'bg-amber-500' : 'bg-teal-400 animate-pulse'
                          }`}
                        />
                        <span className={node.ariaHidden ? 'text-slate-500 line-through' : 'text-slate-200 font-semibold'}>
                          {node.id}
                        </span>
                      </div>
                      <span className={`text-[10px] ${node.ariaHidden ? 'text-amber-500/80' : 'text-teal-400/80'}`}>
                        {node.ariaHidden ? 'SUPERPOSED (HIDDEN)' : 'FOCUSABLE (ACTIVE)'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-900 flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                <HelpCircle size={12} className="text-slate-400" />
                <span>W3C Standard compliance checked statically in real-time.</span>
              </div>
            </div>
          </div>
        ) : (
          /* Security Log Panel */
          <div className="space-y-4 min-h-[220px]">
            <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 flex items-start gap-3">
              <span className="mt-0.5 p-1 rounded-md bg-rose-500/10 text-rose-400">
                <ShieldAlert size={14} className="animate-pulse" />
              </span>
              <div className="text-xs text-rose-400 leading-relaxed font-sans">
                <span className="font-semibold block mb-0.5 font-mono text-rose-300">ARIA State Integrity Watcher:</span>
                System tracking point intercepts all state swaps of <code className="text-rose-300 font-semibold font-mono font-bold bg-rose-[rgba(0,0,0,0.2)] px-1 rounded">aria-hidden</code> properties. Auditing this flow is necessary to make sure no compartments are maliciously desynced from the focus tree.
              </div>
            </div>

            {securityLogs.length === 0 ? (
              <div className="border border-slate-800 bg-slate-950 rounded-xl p-8 text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                  <History size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-slate-300 font-mono">Log Ledger Empty</h4>
                  <p className="text-[11px] text-slate-500 font-sans max-w-xs mx-auto">
                    No accessibility toggles have been executed in this session. Go back to the 'Element Explorer' to toggle widgets!
                  </p>
                </div>
              </div>
            ) : (
              <div className="border border-slate-800 bg-slate-950 rounded-xl overflow-hidden">
                <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                  <table className="w-full text-left border-collapse font-mono text-[11px]">
                    <thead>
                      <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                        <th className="py-2.5 px-3">Timestamp</th>
                        <th className="py-2.5 px-3">Asset</th>
                        <th className="py-2.5 px-3">State Change</th>
                        <th className="py-2.5 px-3">User Action Context</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-slate-300">
                      {securityLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="py-2.5 px-3 whitespace-nowrap text-slate-500">
                            {log.timestamp}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-200">
                            <span className="text-amber-400">&lt;{log.nodeTag}&gt;</span>
                            <span className="text-slate-500 ml-1">#{log.nodeId}</span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                log.action === 'HIDDEN'
                                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                  : 'bg-teal-500/10 text-teal-500 border border-teal-500/20'
                              }`}
                            >
                              {log.action}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-400 max-w-xs truncate" title={log.userAction}>
                            {log.userAction}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
