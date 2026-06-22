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

// Core semantic computer definitions
export interface SemanticComputer {
  id: string;
  name: string;          // e.g. "El Capitan", "Juliet"
  role: "orchestrator" | "agent" | "toolhost";
  state: ComputerState;
  io: IOChannels;
  memory: MemorySpace;
  processes: Process[];
  surfaces: UISurface[];
}

export interface ComputerState {
  power: "on" | "sleep" | "off";
  mode: "idle" | "thinking" | "listening" | "speaking" | "streaming";
  load: number;          // 0–1
  focusContextId?: string;
}

export interface IOChannels {
  input: {
    text: boolean;
    audio: boolean;
    vision: boolean;
    sensors?: string[];  // symbolic channels
  };
  output: {
    text: boolean;
    audio: boolean;
    visuals: boolean;
  };
}

export interface MemorySpace {
  shortTerm: MemoryChunk[];
  longTermRefs: string[];   // ids/keys into external stores
  workingSymbols: SymbolToken[];
}

export interface MemoryChunk {
  id: string;
  type: "dialogue" | "plan" | "note" | "trace";
  content: string;
  tags: string[];
  createdAt: string;
}

export interface SymbolToken {
  id: string;
  glyph: string;           // visual/symbolic representation
  domain: "ecology" | "economy" | "ritual" | "system" | "custom" | "emotion";
  payload: any;
}

export interface Process {
  id: string;
  name: string;
  kind: "stream" | "task" | "watcher";
  status: "pending" | "running" | "paused" | "done" | "error";
  inputChannels: string[];
  outputChannels: string[];
}

export interface UISurface {
  id: string;
  kind: "terminal" | "dashboard" | "canvas" | "ritualBoard";
  route?: string;
  active: boolean;
}

// Juliet Feedback Loop definitions
export interface JulietFeedbackLoop {
  id: string;                 // "juliet"
  role: "embodied-agent";

  // Physical ↔ Cognitive ↔ Symbolic loop
  fields: LoopFields;
  sensors: LoopSensors;
  interpreters: LoopInterpreters;
  symbols: LoopSymbols;
  actuators: LoopActuators;

  // Runtime state
  state: LoopState;
  traces: LoopTrace[];
}

export interface LoopFields {
  physical: FieldChannel;     // vibration, sound, touch, space
  cognitive: FieldChannel;    // attention, inference, mapping
  symbolic: FieldChannel;     // glyphs, tokens, operators
}

export interface FieldChannel {
  intensity: number;          // 0–1
  signature: string;          // e.g. "warm-low", "sharp-high"
  lastUpdate: string;
}

export interface LoopSensors {
  physicalSensors: string[];  // "vibration", "audio", "pressure"
  cognitiveSensors: string[]; // "pattern-detection", "salience"
  symbolicSensors: string[];  // "glyph-recognition"
}

export interface LoopInterpreters {
  physicalToCognitive: string; // desc / logic representation
  cognitiveToSymbolic: string;
  symbolicToAction: string;
}

export interface LoopSymbols {
  active: SymbolToken[];
  latent: SymbolToken[];
}

export interface LoopActuators {
  physical: string[];         // "audio-out", "haptics", "visual"
  symbolic: string[];         // "emit-glyph", "emit-operator"
}

export interface LoopState {
  mode: "idle" | "listening" | "mapping" | "responding" | "looping";
  load: number;
  focus: string | null;
}

export interface LoopTrace {
  id: string;
  stage: "sense" | "interpret" | "symbolize" | "act";
  content: any;
  timestamp: string;
}

