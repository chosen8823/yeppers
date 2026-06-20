/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  ariaHiddenPayload?: string; // Neural sub-text hidden from main view
  createdAt: number;
  userId?: string;
}

export interface Thread {
  id: string;
  userId: string;
  createdAt: number;
}

export interface SyncPacket {
  id: string;
  source: string;
  target: string;
  data: string;
  timestamp: string;
}

export interface PortState {
  id: string;
  name: string;
  type: 'IN' | 'OUT' | 'BIDI';
  status: 'connected' | 'idle' | 'disconnected';
  color: string;
  rate: number;
}

export interface GeneticPathway {
  name: string;
  ratio: number;
  pval: number;
  genes: string[];
  category: 'A11y Adaptation' | 'Neural Flow' | 'W3 Standards' | 'Superposition';
}

export interface A11yElementNode {
  id: string;
  tag: string;
  role: string | null;
  label: string | null;
  ariaHidden: boolean;
  live: string | null;
  description: string;
}

export interface A11ySecurityLog {
  id: string;
  nodeId: string;
  nodeTag: string;
  label: string;
  action: 'HIDDEN' | 'VISIBLE';
  timestamp: string;
  userAction: string;
}

export interface LoopStats {
  iteration: number;
  fingerprints: number;
  kernelValue: number;
  unresolvedState: string;
}

