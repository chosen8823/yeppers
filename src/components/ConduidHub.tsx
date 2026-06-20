/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SyncPacket, PortState } from '../types';
import { Network, ArrowRightLeft, Radio, Terminal, Send, Play } from 'lucide-react';

interface Props {
  ports: PortState[];
  onTogglePort: (id: string) => void;
  packets: SyncPacket[];
  onSendPacket: (packet: Omit<SyncPacket, 'id' | 'timestamp'>) => void;
}

export default function ConduidHub({
  ports,
  onTogglePort,
  packets,
  onSendPacket,
}: Props) {
  const [customData, setCustomData] = useState('SYNC_FLOW');
  const [activePortIndex, setActivePortIndex] = useState(0);

  const handleTransmit = () => {
    if (!customData.trim()) return;

    // Pick active in/out ports
    const activeInPorts = ports.filter((p) => p.status === 'connected' && (p.type === 'IN' || p.type === 'BIDI'));
    const activeOutPorts = ports.filter((p) => p.status === 'connected' && (p.type === 'OUT' || p.type === 'BIDI'));

    const sourcePort = activeInPorts.length > 0 ? activeInPorts[activePortIndex % activeInPorts.length] : ports[0];
    const targetPort = activeOutPorts.length > 0 ? activeOutPorts[activePortIndex % activeOutPorts.length] : ports[3];

    onSendPacket({
      source: sourcePort.name,
      target: targetPort.name,
      data: customData,
    });

    setCustomData('');
    setActivePortIndex((prev) => prev + 1);
  };

  return (
    <div
      className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 hover:border-slate-700/60 rounded-xl p-5 shadow-lg relative overflow-hidden transition-all duration-300"
      id="conduid-hub-node"
    >
      {/* Background radial accent */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/5 blur-[50px] pointer-events-none rounded-full" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 px-2 text-[10px] font-mono rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Conduid Sync Hub
            </span>
            <h3 className="text-sm font-semibold text-slate-100 font-sans tracking-wide">
              Synaptic Gateway Multiplexer
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Exchange binary state packets between standard, audio, and visual nodes.
          </p>
        </div>
      </div>

      {/* Grid of I/O Channel Ports */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 mb-5">
        {ports.map((port) => (
          <button
            key={port.id}
            onClick={() => onTogglePort(port.id)}
            style={{
              borderColor: port.status === 'connected' ? port.color : 'rgba(30, 41, 59, 1)',
            }}
            className={`p-3 rounded-lg border text-left transition-all ${
              port.status === 'connected'
                ? 'bg-slate-950/75'
                : 'bg-slate-950/30 opacity-50 hover:opacity-75'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span
                style={{ backgroundColor: port.color, boxShadow: `0 0 6px ${port.color}` }}
                className="w-2 h-2 rounded-full animate-pulse"
              />
              <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                {port.type}
              </span>
            </div>
            <span className="block text-xs font-semibold text-slate-200 truncate mb-0.5">
              {port.name}
            </span>
            <span className="block text-[10px] font-mono text-slate-500 capitalize">
              {port.status}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Packet Injection Controls */}
        <div className="space-y-4">
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 font-mono flex items-center gap-1.5">
              <ArrowRightLeft size={12} className="text-blue-400" />
              Manual Injector & Multiplex Node
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Force state synchronization dynamically using the marketplace conduit routing keys. No active database is required to bind these loops.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={customData}
                onChange={(e) => setCustomData(e.target.value)}
                placeholder="Send a sync key (e.g. ARIA_FLIGHT)..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono transition-colors"
              />
              <button
                onClick={handleTransmit}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-3.5 py-2 text-xs flex items-center gap-1.5 transition-colors self-stretch"
              >
                <Send size={12} />
                Inject
              </button>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 flex items-center gap-3">
            <Radio className="text-blue-400 animate-pulse flex-shrink-0" size={18} />
            <div className="text-xs">
              <span className="font-semibold text-slate-300 block">Conduid Active Stream Rate:</span>
              <span className="font-mono text-slate-400 text-[11px]">
                {ports.filter(p => p.status === 'connected').length * 24} packets/sec sync rating
              </span>
            </div>
          </div>
        </div>

        {/* Real-time Streaming Logs terminal style */}
        <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 flex flex-col justify-between">
          <h4 className="text-xs font-semibold text-slate-300 font-mono mb-2 flex items-center gap-1.5">
            <Terminal size={12} className="text-blue-300" />
            Conduid Stream Telemetry logs
          </h4>

          <div className="flex-1 max-h-[140px] overflow-y-auto font-mono text-[10px] text-slate-300 space-y-1.5 pr-1 py-1">
            {packets.length === 0 ? (
              <div className="text-slate-500 italic p-2 text-center">
                Telemetry quiet. No packets synced yet.
              </div>
            ) : (
              packets.map((packet) => (
                <div
                  key={packet.id}
                  className="flex items-start gap-1 p-1 bg-slate-900 rounded border border-slate-800/50"
                >
                  <span className="text-blue-400 flex-shrink-0">[{packet.timestamp}]</span>
                  <div className="break-all">
                    <span className="text-teal-400 text-[10px] font-semibold">{packet.source}</span>
                    <span className="text-slate-400"> → </span>
                    <span className="text-purple-400 text-[10px] font-semibold">{packet.target}</span>
                    <span className="text-slate-500"> | payload=</span>
                    <span className="text-amber-300 font-semibold">{packet.data}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 border-t border-slate-900/60 flex items-center justify-between text-[9px] font-mono text-slate-500">
            <span>BIDI multiplex mode enabled</span>
            <span>WCAG 2.1 contrast aligned</span>
          </div>
        </div>
      </div>
    </div>
  );
}
