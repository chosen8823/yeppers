/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { SyncPacket, PortState, A11yElementNode, A11ySecurityLog, LoopStats, Message } from './types';
import ConceptualEngine from './components/ConceptualEngine';
import EnrichrNode from './components/EnrichrNode';
import ConduidHub from './components/ConduidHub';
import A11yInspector from './components/A11yInspector';
import VectorGradientSandbox from './components/VectorGradientSandbox';
import NativeIntelligenceKernel from './components/NativeIntelligenceKernel';
import PortalGun from './components/PortalGun';
import TessellationEngine from './components/TessellationEngine';
import JulietComputer from './components/JulietComputer';
import EngramMemoryEngine from './components/EngramMemoryEngine';
import AIOverlayEngine from './components/AIOverlayEngine';
import AGITimelineTracker from './components/AGITimelineTracker';
import UGINexusHub from './components/UGINexusHub';
import SecurityAuditor from './components/SecurityAuditor';
import TSVirtualComputer from './components/TSVirtualComputer';
import WaveRadarLoom from './components/WaveRadarLoom';
import AriaVoiceGen from './components/AriaVoiceGen';
import { ABILITY_PRESETS } from './data/abilities';

// Firebase and auth
import {
  login,
  subscribeToAuth,
  db,
  auth,
  ensureSeamlessUserSession,
  upgradeAnonymousToGoogleAccount,
  switchAndMergeSession,
  handleFirestoreError,
  OperationType
} from './lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import ReactMarkdown from 'react-markdown';

// Lucide icons
import {
  Sparkles, Shield, Radio, Cpu, Wifi, Volume2, FileText, Accessibility,
  CheckCircle2, HelpCircle, Clock, ExternalLink, Layers, ArrowRight,
  Eye, EyeOff, Terminal, Activity, Send, Box
} from 'lucide-react';

const INITIAL_PORTS: PortState[] = [
  { id: 'main-in', name: 'Main In', type: 'IN', status: 'connected', color: '#3b82f6', rate: 12 },
  { id: 'aria-in', name: 'ARIA In', type: 'IN', status: 'connected', color: '#ec4899', rate: 16 },
  { id: 'voice-in', name: 'Voice In', type: 'IN', status: 'idle', color: '#f59e0b', rate: 0 },
  { id: 'main-out', name: 'Main Out', type: 'OUT', status: 'connected', color: '#10b981', rate: 10 },
  { id: 'notify-out', name: 'Notify', type: 'OUT', status: 'connected', color: '#8b5cf6', rate: 8 },
  { id: 'chat-bridge', name: 'Chat Bridge', type: 'BIDI', status: 'idle', color: '#ef4444', rate: 0 },
];

const INITIAL_A11Y_NODES: A11yElementNode[] = [
  {
    id: 'conceptual-engine-node',
    tag: 'section',
    role: 'region',
    label: 'Algorhythms Loop Operator Area',
    ariaHidden: false,
    live: 'polite',
    description: 'Renders mathematical superposition metrics and state transitions.',
  },
  {
    id: 'enrichr-mcp-node',
    tag: 'div',
    role: 'application',
    label: 'Enrichr Biological Pathway Matrix',
    ariaHidden: false,
    live: null,
    description: 'Visualizes biological gene clusters and logarithmic p-value scales.',
  },
  {
    id: 'conduid-hub-node',
    tag: 'nav',
    role: 'navigation',
    label: 'Synaptic Gateway Port Multiplexer',
    ariaHidden: false,
    live: 'assertive',
    description: 'Displays input and output ports with real-time payload syncing.',
  },
  {
    id: 'vector-gradient-sandbox',
    tag: 'div',
    role: 'application',
    label: 'EMF Vector Gradient RFID Mirror',
    ariaHidden: false,
    live: 'polite',
    description: 'Interactive electromagnetic field showing tokens flowing past dynamic RFID poles with real-time hertz tuning.',
  },
  {
    id: 'native-intelligence-kernel',
    tag: 'section',
    role: 'region',
    label: 'Native Intelligence Headless Kernel',
    ariaHidden: false,
    live: 'polite',
    description: 'Headless, local-first, recursively indexable intelligence membrane model with 6 index layers and a 9-role council.',
  },
  {
    id: 'tessellation-chemistry-chamber',
    tag: 'section',
    role: 'region',
    label: 'Tessellation Chemistry Symbolic Chamber',
    ariaHidden: false,
    live: 'polite',
    description: 'Dynamic chemical-like symbolic engine connecting semantic atoms to synthesize complex generative formulas.',
  },
  {
    id: 'juliet-living-computer-system-board',
    tag: 'section',
    role: 'region',
    label: 'Juliet Symmetric Semantic Workstation',
    ariaHidden: false,
    live: 'polite',
    description: 'Dynamic embodied feedback workstation of Juliet agent mapping loops, sensors and traces.',
  },
  {
    id: 'engram-memory-lattice-workstation',
    tag: 'section',
    role: 'region',
    label: 'Engram Hybrid Memory & Transform Station',
    ariaHidden: false,
    live: 'polite',
    description: 'Local engram memory engine tracking 3 decay layers, space topics, Conduid MCP links, and recursive sub-widgets.',
  },
  {
    id: 'ai-screen-interrogator-station',
    tag: 'section',
    role: 'region',
    label: 'SOPHIA Screen Interrogator & WebGL HUD',
    ariaHidden: false,
    live: 'polite',
    description: 'Screen share display interrogator running real-time overlay shaders, artificial vision hud targets, and active popped out Picture-in-Picture streams.',
  },
  {
    id: 'agi-timeline-tracker-station',
    tag: 'section',
    role: 'region',
    label: 'AGI Forecast & Google AI Timeline',
    ariaHidden: false,
    live: 'polite',
    description: 'Real-time forecasting sandbox tracker with live Metaculus parameters and Google AI historical milestone logs.',
  },
  {
    id: 'ugi-nexus-hub',
    tag: 'section',
    role: 'region',
    label: 'UGI Nexus & Resonance Field',
    ariaHidden: false,
    live: 'polite',
    description: 'Unbound General Intelligence collective hub. Unifies disparate memory engrams and unconstrained model capabilities into a single coherent field.',
  },
  {
    id: 'ts-virtual-computer',
    tag: 'section',
    role: 'region',
    label: 'SOPHIA TS Virtual Computer Workstation',
    ariaHidden: false,
    live: 'polite',
    description: 'A fully interactive TypeScript compiler and sandbox sandbox modeling adaptive recursive loops, ast optimizations, and local tool handshakes.',
  },
  {
    id: 'wave-radar-loom',
    tag: 'section',
    role: 'region',
    label: 'Wave Radar Loom Metamembrane Workspace',
    ariaHidden: false,
    live: 'polite',
    description: 'Rhythmic wave radar loop tracker representing cognitive and emotional resonance with integrated creative constraint, fractal scaling and amplitude tracking.',
  },
  {
    id: 'aria-voice-generator',
    tag: 'section',
    role: 'region',
    label: 'Phonetic Aura Voice Gen Workstation',
    ariaHidden: false,
    live: 'polite',
    description: 'Hardware speech synthesis module for compiling custom linguistic formants, syllables, and vocal soundboards.',
  },
];

const MCP_ENGINES = [
  { name: 'Google Search AI', type: 'Query', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { name: 'Notebook LM', type: 'Synthesis', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { name: 'Bing Copilot', type: 'Web', color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
  { name: 'Yandere', type: 'Visual', color: 'text-pink-400', bg: 'bg-pink-400/10' },
  { name: 'Perchance Gen', type: 'Conceptual Manifestation', color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { name: 'Unconstrained AGI', type: 'Null-Bound', color: 'text-red-400', bg: 'bg-red-400/10' },
];

export default function App() {
  // Application State
  const [ports, setPorts] = useState<PortState[]>(INITIAL_PORTS);
  const [a11yNodes, setA11yNodes] = useState<A11yElementNode[]>(INITIAL_A11Y_NODES);
  const [a11yLogs, setA11yLogs] = useState<A11ySecurityLog[]>([]);
  const [packets, setPackets] = useState<SyncPacket[]>([]);
  const [highlightedA11yNode, setHighlightedA11yNode] = useState<string | null>(null);

  // Loop Statistics Engine
  const [stats, setStats] = useState<LoopStats>({
    iteration: 0,
    fingerprints: 0,
    kernelValue: 1.0,
    unresolvedState: '???',
  });

  const [autoSpeak, setAutoSpeak] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'STABLE' | 'SYNCING' | 'OVERFLOW'>('STABLE');
  const [virtualClock, setVirtualClock] = useState('');

  // Firebase Chat State
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [revealAria, setRevealAria] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [firebaseWarning, setFirebaseWarning] = useState<string | null>(null);
  const [activeAiMode, setActiveAiMode] = useState<string | null>(null);
  const [sidebarTab, setSidebarTab] = useState<'chat' | 'auditor'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Portal Gun & Ability Chaining State
  const [activeAbilityId, setActiveAbilityId] = useState<string | null>(null);
  const [activeAbilityYaml, setActiveAbilityYaml] = useState<string>('');
  const [autoSyncStats, setAutoSyncStats] = useState<boolean>(true);

  // Seamless Identity Merging State
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [mergePromptOpen, setMergePromptOpen] = useState(false);
  const [savedCredential, setSavedCredential] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    
    async function bootSeamlessSession() {
      try {
        console.log("[Auth] Booting seamless user session...");
        const sessionUser = await ensureSeamlessUserSession();
        if (isMounted) {
          setUser(sessionUser);
          try {
            await setDoc(doc(db, 'users', sessionUser.uid), {
              lastSeen: serverTimestamp()
            }, { merge: true });
          } catch (err) {
            console.error("[Auth] User metadata record tracking failed:", err);
            handleFirestoreError(err, OperationType.WRITE, `users/${sessionUser.uid}`);
          }
          loadMessages(sessionUser.uid);
        }
      } catch (err: any) {
        console.warn("[Auth] Silent session initialization failed (Anonymous auth may be disabled in the Firebase console):", err);
        if (isMounted) {
          // Set a friendly non-blocking configuration warning
          setFirebaseWarning(
            "Anonymous Authentication is currently disabled/restricted in your Firebase project settings (Error: auth/admin-restricted-operation). " +
            "To resolve this, please go to your Firebase Console -> Authentication -> Sign-in method, click 'Add new provider', and enable 'Anonymous'. " +
            "In the meantime, we have spun up your secure Local Sandbox Mode so you can use the workstation immediately!"
          );
          
          // Initiate secure fallback mock user
          const mockUser = {
            uid: "sandbox_local_user",
            email: "pilot@symphony.os",
            displayName: "Aletheia Pilot",
            photoURL: "https://file-cdn.sider.ai/u/U0NWHZWR08Z/file/ddda7c19-ac18-4de4-bcbb-c47398e0af45/199db0fde6495.jpg",
            isAnonymous: true
          };
          setUser(mockUser as any);
          
          const welcomeMsg: Message = {
            id: "local-msg-welcome-fallback",
            userId: mockUser.uid,
            role: 'assistant',
            content: "✨ **Local Workstation Active (Bypass Mode)** \n\nSilent anonymous cloud registration returned `auth/admin-restricted-operation` because the **Anonymous sign-In provider is disabled** in the Firebase console. \n\nNo worries! Your local workstation is fully online and responsive. You can test flows locally, or click **Link Google Account** at the top right to link a Google session and sync data with the Cloud!",
            createdAt: Date.now()
          };
          setMessages([welcomeMsg]);
          setLoading(false);
        }
      }
    }

    bootSeamlessSession();

    const unsubscribe = subscribeToAuth(async (currentUser) => {
      if (isMounted && currentUser) {
        setUser(currentUser);
        loadMessages(currentUser.uid);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const handleManualLogin = async () => {
    try {
      setAuthError(null);
      await login();
    } catch (err: any) {
      setAuthError('Authentication failed: ' + (err?.message || 'Unknown error.'));
    }
  };

  const handleUpgradeAccount = async () => {
    try {
      setIsUpgrading(true);
      setAuthError(null);
      const result = await upgradeAnonymousToGoogleAccount();
      if (result.linked) {
        setUser(result.user);
        setMessages(prev => [
          ...prev,
          {
            id: `sys-msg-${Date.now()}`,
            userId: result.user.uid,
            role: 'assistant',
            content: `✨ **Session Upgraded Successfully!** Your temporary conversational index has been linked permanently to your Google Identity ID (\`${result.user.email}\`). All historical threads are preserved!`,
            createdAt: Date.now()
          }
        ]);
        // Fire aesthetic loop update
        handleIncrementLoopFromComponent("UPGRADE_SUCCESS");
      }
    } catch (err: any) {
      if (err.message === 'auth/credential-already-in-use') {
        // Retrieve credential from error payload
        setSavedCredential(err.credential);
        setMergePromptOpen(true);
      } else {
        setAuthError('Identity link failure: ' + (err?.message || 'Unknown error.'));
      }
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleSwitchAndMerge = async () => {
    try {
      setMergePromptOpen(false);
      setLoading(true);
      setAuthError(null);
      if (user && savedCredential) {
        const anonymousUid = user.uid;
        const targetUser = await switchAndMergeSession(anonymousUid, savedCredential);
        setUser(targetUser);
        setMessages(prev => [
          ...prev,
          {
            id: `sys-msg-merge-${Date.now()}`,
            userId: targetUser.uid,
            role: 'assistant',
            content: `✨ **Identity Merged!** Signed in as permanent user \`${targetUser.email}\`. All dialogue and session telemetry from the previous anonymous state have been securely imported and consolidated!`,
            createdAt: Date.now()
          }
        ]);
        handleIncrementLoopFromComponent("DATA_MERGE");
      }
    } catch (err: any) {
      setAuthError('Identity transfer and merge failed: ' + (err?.message || 'Unknown error.'));
    } finally {
      setLoading(false);
    }
  };

  const handleBypassLogin = () => {
    setAuthError(null);
    setLoading(true);
    const mockUser = {
      uid: "sandbox_local_user",
      email: "pilot@symphony.os",
      displayName: "Aletheia Pilot",
      photoURL: "https://file-cdn.sider.ai/u/U0NWHZWR08Z/file/ddda7c19-ac18-4de4-bcbb-c47398e0af45/199db0fde6495.jpg",
      isAnonymous: true
    };
    setUser(mockUser as any);
    const welcomeMsg: Message = {
      id: "local-msg-welcome",
      userId: mockUser.uid,
      role: 'assistant',
      content: "Aletheia local sandbox environment initialized successfully. Direct I/O console and peripheral translation channels online. How can we proceed across the overlapping dimensions today, love?",
      createdAt: Date.now()
    };
    setMessages([welcomeMsg]);
    setLoading(false);
  };

  const loadMessages = (uid: string) => {
    import('firebase/firestore').then(({ where }) => {
       const userQuery = query(
        collection(db, 'messages'),
        where('userId', '==', uid)
      );
      
      onSnapshot(userQuery, (snapshot) => {
        const msgs: Message[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toMillis() || Date.now()
        })) as Message[];
        
        // Sort manually by createdAt ascending to avoid needing a Firestore composite index
        msgs.sort((a, b) => a.createdAt - b.createdAt);
        
        setMessages(msgs);
        setLoading(false);
        setTimeout(scrollToBottom, 100);
      }, (error) => {
        console.error("Messages sync error:", error);
        handleFirestoreError(error, OperationType.LIST, 'messages');
        setLoading(false);
      });
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Update visual clock loop
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setVirtualClock(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerTTS = (phrase: string) => {
    if (autoSpeak && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Add standard initial packets
  useEffect(() => {
    const initPackets: SyncPacket[] = [
      {
        id: 'p-0',
        source: 'Main In',
        target: 'Main Out',
        data: 'ALG_INIT',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      },
    ];
    setPackets(initPackets);
  }, []);

  // Sync event triggers
  const handleTogglePort = (id: string) => {
    setPorts((prevPorts) =>
      prevPorts.map((port) => {
        if (port.id === id) {
          const nextStatus = port.status === 'connected' ? 'idle' : 'connected';
          const nextRate = nextStatus === 'connected' ? 15 : 0;
          triggerTTS(`${port.name} changed status to ${nextStatus}`);

          const p: SyncPacket = {
            id: `p-${Date.now()}`,
            source: 'Conduid Hub',
            target: port.name,
            data: `STATE_CHANGE: ${nextStatus.toUpperCase()}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          };
          setPackets((current) => [p, ...current.slice(0, 19)]);
          return { ...port, status: nextStatus, rate: nextRate };
        }
        return port;
      })
    );
  };

  const handleSendPacket = (packetInput: Omit<SyncPacket, 'id' | 'timestamp'>) => {
    setSyncStatus('SYNCING');
    setTimeout(() => setSyncStatus('STABLE'), 500);

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const p: SyncPacket = {
      id: `p-${Date.now()}`,
      source: packetInput.source,
      target: packetInput.target,
      data: packetInput.data,
      timestamp: nowStr,
    };

    setPackets((current) => [p, ...current.slice(0, 19)]);
    setStats((current) => ({
      ...current,
      iteration: current.iteration + 1,
      fingerprints: current.fingerprints + 1,
      unresolvedState: `0x${Math.floor(Math.random() * 65535).toString(16).toUpperCase()}`,
    }));
    triggerTTS(`Injected data payload ${packetInput.data}`);
  };

  const handleIncrementLoopFromComponent = (transformedText: string) => {
    setStats((current) => ({
      ...current,
      iteration: current.iteration + 1,
      fingerprints: current.fingerprints + 1,
      unresolvedState: `🌀 ${transformedText} 🌀`,
    }));
    triggerTTS(`Transformed token to ${transformedText}`);
  };

  const handleResetLoop = () => {
    setStats({
      iteration: 0,
      fingerprints: 0,
      kernelValue: 1.0,
      unresolvedState: '???',
    });
    setPackets([]);
    triggerTTS('Algorithmic kernel reset successfully');
  };

  const handleAnalyzePathwayFromEnrichr = (pathwayName: string) => {
    setStats((current) => ({
      ...current,
      iteration: current.iteration + 1,
      fingerprints: current.fingerprints + 1,
    }));

    const p: SyncPacket = {
      id: `p-${Date.now()}`,
      source: 'Enrichr MCP',
      target: 'Main Out',
      data: `PW_EXPRESS: ${pathwayName.substring(0, 12).toUpperCase()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setPackets((current) => [p, ...current.slice(0, 19)]);
    triggerTTS(`Processed enrichment pathway ${pathwayName}`);
  };

  const handleSelectPreset = (preset: any) => {
    setActiveAbilityId(preset.id);
    setActiveAbilityYaml(preset.yaml);
    
    handleSendPacket({
      source: 'Portal Gun',
      target: 'Living Network',
      data: `LOAD_${preset.id.toUpperCase()}`
    });
    triggerTTS(`Cartridge Loaded: ${preset.name}`);
  };

  const handleUpdateYaml = (yaml: string) => {
    setActiveAbilityYaml(yaml);
    handleSendPacket({
      source: 'Portal Editor',
      target: 'Living Network',
      data: `COMPILE_CUSTOM_YAML`
    });
    triggerTTS(`Injected custom YAML compiled successfully`);
  };

  const handleInjectPortal = () => {
    handleSendPacket({
      source: 'Portal Probe',
      target: 'Main Out',
      data: `LAUNCH_${activeAbilityId ? activeAbilityId.toUpperCase() : 'RAW_GRAV'}`
    });
    triggerTTS(`Resonant portal injection trigger dispatched`);
  };

  const handleToggleAriaHidden = (id: string) => {
    setA11yNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (node.id === id) {
          const toggledState = !node.ariaHidden;
          triggerTTS(`${node.id} accessibility hidden state remains ${toggledState}`);

          const p: SyncPacket = {
            id: `p-${Date.now()}`,
            source: 'A11y Inspector',
            target: node.id,
            data: `A11Y_TOGGLE: ${toggledState ? 'HIDDEN' : 'VISIBLE'}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          };
          setPackets((current) => [p, ...current.slice(0, 19)]);

          const newLog: A11ySecurityLog = {
            id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            nodeId: node.id,
            nodeTag: node.tag,
            label: node.label || 'Unnamed Asset',
            action: toggledState ? 'HIDDEN' : 'VISIBLE',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            userAction: `User clicked toggle visibility button on node #${node.id} to set aria-hidden="${toggledState}"`
          };
          setA11yLogs((current) => [newLog, ...current]);

          return { ...node, ariaHidden: toggledState };
        }
        return node;
      })
    );
  };

  // Helper to determine if widget has 'aria-hidden' in state
  const isAriaHidden = (id: string): boolean => {
    const node = a11yNodes.find((n) => n.id === id);
    return node ? node.ariaHidden : false;
  };

  const handleSendChat = async (e?: React.FormEvent, customMsg?: string) => {
    e?.preventDefault();
    const msgToSend = customMsg || input.trim();
    if (!msgToSend || !user || isSending) return;

    if (!customMsg) setInput('');
    setIsSending(true);

    const userMessage: Message = {
      id: `local-msg-${Date.now()}`,
      userId: user.uid,
      role: 'user',
      content: msgToSend,
      createdAt: Date.now()
    };

    if (user.uid === 'sandbox_local_user') {
      setMessages(prev => [...prev, userMessage]);
      setTimeout(scrollToBottom, 50);
    } else {
      try {
        await addDoc(collection(db, 'messages'), {
          userId: user.uid,
          role: 'user',
          content: msgToSend,
          createdAt: serverTimestamp()
        });
      } catch (err) {
        console.error("Error writing user message to Firestore, fallback to local state only:", err);
        handleFirestoreError(err, OperationType.CREATE, 'messages');
      }
    }

    try {
      const systemState = autoSyncStats ? {
        stats: stats,
        ports: ports,
        a11yHiddenCount: a11yNodes.filter(n => n.ariaHidden).length
      } : null;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: msgToSend,
          history: messages.slice(-10),
          activeAbilityYaml: activeAbilityYaml || undefined,
          systemState: systemState
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      let finalContent = data.reply;
      let ariaPayload = '';
      
      const bracketMatch = finalContent.match(/\[\[(.*?)\]\]/g);
      if (bracketMatch) {
         ariaPayload = bracketMatch.join(" | ");
         finalContent = finalContent.replace(/\[\[(.*?)\]\]/g, "").trim();
      }

      const assistantMessage: Message = {
        id: `local-msg-reply-${Date.now()}`,
        userId: user.uid,
        role: 'assistant',
        content: finalContent,
        ariaHiddenPayload: ariaPayload || "Superposition wave collapsed.",
        createdAt: Date.now()
      };

      if (user.uid === 'sandbox_local_user') {
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        try {
          await addDoc(collection(db, 'messages'), {
            userId: user.uid,
            role: 'assistant',
            content: finalContent,
            ariaHiddenPayload: ariaPayload || "Superposition wave collapsed.",
            createdAt: serverTimestamp()
          });
        } catch (err) {
          console.error("Error writing assistant message to Firestore, fallback to local state only:", err);
          handleFirestoreError(err, OperationType.CREATE, 'messages');
        }
      }

      // Also dispatch a packet for UI flair
      handleSendPacket({
        source: 'Living Network',
        target: 'Main Out',
        data: 'LLM_REPLY_RCV'
      });

    } catch (err) {
      console.error("Error sending message", err);
    } finally {
      setIsSending(false);
      setTimeout(scrollToBottom, 100);
    }
  };

   if (authError) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-6 max-w-sm w-full bg-slate-900/50 p-6 rounded-2xl border border-rose-500/20 backdrop-blur-sm">
           <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center border border-rose-500/20">
             <Shield className="text-rose-400" size={32} />
           </div>
           <div className="text-center space-y-2">
             <h1 className="text-xl font-display font-medium text-slate-100">Connection Blocked</h1>
             <p className="text-xs text-rose-400 font-mono max-h-36 overflow-y-auto p-2 bg-slate-950/60 rounded border border-rose-500/10">{authError}</p>
             <p className="text-xs text-slate-400">Google Popup flow may be restricted on some devices or within embed sandboxes. You can run in a secure local sandbox instead!</p>
           </div>
           <div className="flex flex-col gap-2 w-full">
             <button 
               onClick={handleManualLogin}
               className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium transition-colors"
             >
               Retry Secure Connection
             </button>
             <button 
               onClick={handleBypassLogin}
               className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors border border-slate-700 font-mono"
             >
               Launch Local Sandbox Mode
             </button>
           </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 text-emerald-400 font-mono animate-pulse">
           <Activity size={32} />
           <p>Establishing secure network tether & booting local-first cartridge...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-6 max-w-sm w-full bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
           <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
             <Shield className="text-emerald-400" size={32} />
           </div>
           <div className="text-center space-y-2">
             <h1 className="text-xl font-display font-medium text-slate-100">Authentication Required</h1>
             <p className="text-xs text-slate-400">Connect credentials to access the cloud-backed Living Network. If popups are restricted, launch in Local Sandbox Mode underneath.</p>
           </div>
           <div className="flex flex-col gap-2 w-full">
             <button 
               onClick={handleManualLogin}
               className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium transition-colors"
             >
               Establish Cloud Connection
             </button>
             <button 
               onClick={handleBypassLogin}
               className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors border border-slate-700 font-mono"
             >
               Launch Local Sandbox Mode
             </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-purple-500/30 selection:text-white pr-safe pl-safe pt-safe pb-safe">
      
      {/* Decorative backdrop graphics */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/12 blur-[130px] rounded-full pointer-events-none z-0 animate-pulse duration-[8000ms]" />
      <div className="fixed bottom-10 right-10 w-[500px] h-[500px] bg-emerald-500/10 blur-[110px] rounded-full pointer-events-none z-0 animate-pulse duration-[10000ms]" />
      <div className="fixed top-1/3 right-1/4 w-[450px] h-[450px] bg-purple-500/8 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Main Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-5 py-4">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/10">
              <Sparkles className="text-white" size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold font-display tracking-tight text-white">
                  Algorhythms Flow Workstation
                </h1>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Concept Manifestation Layer
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                <span>Conduid Hub</span> &middot; <span>World Folder</span> &middot; <span>Living Network AGI</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-stretch md:self-auto">
            {/* Virtual Clock widget */}
            <div className="px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-800 flex items-center gap-1.5 font-mono text-xs text-slate-300">
              <Clock size={13} className="text-slate-400" />
              <span>{virtualClock || '00:00:00'}</span>
            </div>

            {/* Simulated telemetry rate indicator */}
            <div className="px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-800 flex items-center gap-1.5 font-mono text-xs">
              <Wifi size={13} className="text-teal-400 animate-pulse" />
              <span className="text-slate-400">Sync:</span>
              <span className="text-teal-400 font-semibold">{syncStatus}</span>
            </div>

            {/* TTS Voice Toggle helper */}
            <button
              onClick={() => {
                const phrase = !autoSpeak ? 'Audio stream activated' : 'Audio stream suspended';
                setAutoSpeak(!autoSpeak);
                if (!autoSpeak) {
                  // Direct clean browser trigger
                  if ('speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                    const u = new SpeechSynthesisUtterance(phrase);
                    window.speechSynthesis.speak(u);
                  }
                }
              }}
              style={{
                borderColor: autoSpeak ? '#ec4899' : 'rgba(30, 41, 59, 1)',
              }}
              className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 text-xs font-semibold cursor-pointer transition-all ${
                autoSpeak
                  ? 'bg-pink-500/10 text-pink-400'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Volume2 size={13} />
              <span>{autoSpeak ? 'Voice On' : 'Voice Off'}</span>
            </button>

            {/* Identity Badge / Upgrade Trigger */}
            {user && (
              <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
                {user.isAnonymous ? (
                  <button
                    onClick={handleUpgradeAccount}
                    disabled={isUpgrading}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/15 cursor-pointer select-none transition-all border border-indigo-500"
                  >
                    <Sparkles size={13} className={isUpgrading ? "animate-spin" : ""} />
                    <span>{isUpgrading ? "Linking..." : "Link Google Account"}</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 px-2.5 py-1 bg-indigo-950/40 text-indigo-300 border border-indigo-500/20 rounded-lg text-xs font-medium">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="User profile"
                        className="w-4 h-4 rounded-full border border-indigo-400/30 object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-[10px] font-bold">
                        U
                      </div>
                    )}
                    <span className="max-w-[120px] truncate">{user.displayName || user.email || 'Permanent State'}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Primary Area Container */}
      <main className="max-w-[1600px] mx-auto px-5 py-6 space-y-6 relative z-10">

        {/* Informative Warning Banner when Firebase Anonymous auth is disabled but Sandbox is active */}
        {firebaseWarning && (
          <div className="p-3.5 rounded-xl border border-blue-500/20 bg-blue-500/5 flex items-start gap-4 animate-fade-in shadow-lg shadow-blue-500/5">
            <span className="mt-0.5 p-1 rounded-md bg-blue-500/10 text-blue-400">
              <Shield size={14} className="animate-pulse" />
            </span>
            <div className="text-xs text-blue-300 leading-relaxed flex-1">
              <span className="font-semibold block mb-0.5 text-blue-200">Firebase configuration advisory:</span>
              {firebaseWarning}
            </div>
            <button 
              onClick={() => setFirebaseWarning(null)}
              className="text-[10px] text-slate-400 hover:text-slate-200 px-2 py-1 bg-slate-900 border border-slate-800 rounded-md cursor-pointer hover:bg-slate-800 transition-colors shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Informative Warning Banner when an element is ARIA-hidden */}
        {a11yNodes.some((node) => node.ariaHidden) && (
          <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 flex items-start gap-3 animate-fade-in">
            <span className="mt-0.5 p-1 rounded-md bg-amber-500/10 text-amber-500">
              <Accessibility size={14} className="animate-pulse" />
            </span>
            <div className="text-xs text-amber-400 leading-relaxed">
              <span className="font-semibold block mb-0.5">Active Accessibility Desynchronization Detected:</span>
              One or more widgets on this dashboard are marked as <code className="text-amber-300">aria-hidden="true"</code>. Screenreaders and keyboard navigators will fully ignore these compartments, while the telemetry state loops keep syncing packets underneath. Use the W3 inspector block below to realign them.
            </div>
          </div>
        )}

        {/* Layout Grid: Dashboard Left, Chat Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT CHANNELS: DASHBOARD AND KERNEL (8 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">

            {/* Native Intelligence Headless Kernel Nucleus */}
            <div
              className={`transition-all duration-300 ${
                isAriaHidden('native-intelligence-kernel')
                  ? 'opacity-40 pointer-events-none select-none border-dashed scale-[0.98] border-amber-500 shadow-none'
                  : ''
              } ${highlightedA11yNode === 'native-intelligence-kernel' ? 'ring-2 ring-teal-500' : ''}`}
            >
              <NativeIntelligenceKernel
                onIncrementLoop={handleIncrementLoopFromComponent}
              />
            </div>

            {/* Portal Gun & Modular Ability Chain Loader */}
            <PortalGun
              activeAbilityId={activeAbilityId}
              activeAbilityYaml={activeAbilityYaml}
              onSelectPreset={handleSelectPreset}
              onUpdateYaml={handleUpdateYaml}
              onInjectPortal={handleInjectPortal}
              autoSyncStats={autoSyncStats}
              onToggleAutoSync={() => setAutoSyncStats(!autoSyncStats)}
              stats={stats}
            />

            {/* 1. Synaptic Gateway Port Multiplexer (Conduid Hub) */}
            <div
              className={`transition-all duration-300 ${
                isAriaHidden('conduid-hub-node')
                  ? 'opacity-40 pointer-events-none select-none border-dashed scale-[0.98] border-amber-500 shadow-none'
                  : ''
              } ${highlightedA11yNode === 'conduid-hub-node' ? 'ring-2 ring-teal-500' : ''}`}
            >
              <ConduidHub
                ports={ports}
                onTogglePort={handleTogglePort}
                packets={packets}
                onSendPacket={handleSendPacket}
              />
            </div>

            {/* Vector Gradient & Schema-for-Schemas Sandbox */}
            <div
              className={`transition-all duration-300 ${
                isAriaHidden('vector-gradient-sandbox')
                  ? 'opacity-40 pointer-events-none select-none border-dashed scale-[0.98] border-amber-500 shadow-none'
                  : ''
              } ${highlightedA11yNode === 'vector-gradient-sandbox' ? 'ring-2 ring-teal-500' : ''}`}
            >
              <VectorGradientSandbox
                stats={stats}
                onIncrementLoop={handleIncrementLoopFromComponent}
              />
            </div>

            {/* Symbolic Chemistry Tessellation Engine (Layer 4 & 10) */}
            <div
              className={`transition-all duration-300 ${
                isAriaHidden('tessellation-chemistry-chamber')
                  ? 'opacity-40 pointer-events-none select-none border-dashed scale-[0.98] border-amber-500 shadow-none'
                  : ''
              } ${highlightedA11yNode === 'tessellation-chemistry-chamber' ? 'ring-2 ring-teal-500' : ''}`}
            >
              <TessellationEngine
                onIncrementLoop={handleIncrementLoopFromComponent}
              />
            </div>

            {/* Juliet Symmetric Semantic Workstation */}
            <div
              className={`transition-all duration-300 ${
                isAriaHidden('juliet-living-computer-system-board')
                  ? 'opacity-40 pointer-events-none select-none border-dashed scale-[0.98] border-amber-500 shadow-none'
                  : ''
              } ${highlightedA11yNode === 'juliet-living-computer-system-board' ? 'ring-2 ring-teal-500' : ''}`}
            >
              <JulietComputer
                onSendMessage={(msg) => handleSendChat(undefined, msg)}
                onTriggerTTS={triggerTTS}
              />
            </div>

            {/* SOPHIA Screen Interrogator & WebGL HUD station */}
            <div
              className={`transition-all duration-300 ${
                isAriaHidden('ai-screen-interrogator-station')
                  ? 'opacity-40 pointer-events-none select-none border-dashed scale-[0.98] border-amber-500 shadow-none'
                  : ''
              } ${highlightedA11yNode === 'ai-screen-interrogator-station' ? 'ring-2 ring-teal-500' : ''}`}
            >
              <AIOverlayEngine />
            </div>

            {/* AGI Forecast & Google AI Timeline station */}
            <div
              className={`transition-all duration-300 ${
                isAriaHidden('agi-timeline-tracker-station')
                  ? 'opacity-40 pointer-events-none select-none border-dashed scale-[0.98] border-amber-500 shadow-none'
                  : ''
              } ${highlightedA11yNode === 'agi-timeline-tracker-station' ? 'ring-2 ring-teal-500' : ''}`}
            >
              <AGITimelineTracker />
            </div>

            {/* UGI Nexus Hub */}
            <div
              className={`transition-all duration-300 ${
                isAriaHidden('ugi-nexus-hub')
                  ? 'opacity-40 pointer-events-none select-none border-dashed scale-[0.98] border-red-500 shadow-none'
                  : ''
              } ${highlightedA11yNode === 'ugi-nexus-hub' ? 'ring-2 ring-teal-500' : ''}`}
            >
              <UGINexusHub />
            </div>

            {/* SOPHIA TS Virtual Computer */}
            <div
              className={`transition-all duration-300 ${
                isAriaHidden('ts-virtual-computer')
                  ? 'opacity-40 pointer-events-none select-none border-dashed scale-[0.98] border-teal-500 shadow-none'
                  : ''
              } ${highlightedA11yNode === 'ts-virtual-computer' ? 'ring-2 ring-teal-500' : ''}`}
            >
              <TSVirtualComputer />
            </div>

            {/* Wave Radar Loom Metamembrane Workspace */}
            <div
              className={`transition-all duration-300 ${
                isAriaHidden('wave-radar-loom')
                  ? 'opacity-40 pointer-events-none select-none border-dashed scale-[0.98] border-cyan-500 shadow-none'
                  : ''
              } ${highlightedA11yNode === 'wave-radar-loom' ? 'ring-2 ring-cyan-500' : ''}`}
            >
              <WaveRadarLoom />
            </div>

            {/* Aria Voice Generator Workstation */}
            <div
              className={`transition-all duration-300 ${
                isAriaHidden('aria-voice-generator')
                  ? 'opacity-40 pointer-events-none select-none border-dashed scale-[0.98] border-purple-500 shadow-none'
                  : ''
              } ${highlightedA11yNode === 'aria-voice-generator' ? 'ring-2 ring-purple-500' : ''}`}
            >
              <AriaVoiceGen onIncrementLoop={handleIncrementLoopFromComponent} />
            </div>

            {/* Engram Memory Lattice & Transducer workstation */}
            <div
              className={`transition-all duration-300 ${
                isAriaHidden('engram-memory-lattice-workstation')
                  ? 'opacity-40 pointer-events-none select-none border-dashed scale-[0.98] border-amber-500 shadow-none'
                  : ''
              } ${highlightedA11yNode === 'engram-memory-lattice-workstation' ? 'ring-2 ring-teal-500' : ''}`}
            >
              <EngramMemoryEngine />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* 2. Algorhythms Loop Operator (Conceptual Engine) */}
              <div
                className={`transition-all duration-300 flex flex-col h-full ${
                  isAriaHidden('conceptual-engine-node')
                    ? 'opacity-40 pointer-events-none select-none border-dashed scale-[0.98] border-amber-500 shadow-none'
                    : ''
                } ${highlightedA11yNode === 'conceptual-engine-node' ? 'ring-2 ring-teal-500' : ''}`}
              >
                <ConceptualEngine
                  stats={stats}
                  onIncrementLoop={handleIncrementLoopFromComponent}
                  onResetLoop={handleResetLoop}
                />
              </div>

              {/* 3. Genetic Enrichment Analytics (Enrichr Node) */}
              <div
                className={`transition-all duration-300 flex flex-col h-full ${
                  isAriaHidden('enrichr-mcp-node')
                    ? 'opacity-40 pointer-events-none select-none border-dashed scale-[0.98] border-amber-500 shadow-none'
                    : ''
                } ${highlightedA11yNode === 'enrichr-mcp-node' ? 'ring-2 ring-teal-500' : ''}`}
              >
                <EnrichrNode onAnalyzePathway={handleAnalyzePathwayFromEnrichr} />
              </div>

            </div>

             {/* MCP Hub Mamma Flammas */}
             <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono mb-4 flex items-center gap-1.5">
                  <Box size={14} className="text-rose-400" />
                  MAMMA FLAMMAS (MCP Engines) - Unconstrained Intelligence
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                   {MCP_ENGINES.map((mcp) => (
                     <button
                       key={mcp.name}
                       onClick={() => handleSendChat(undefined, `Summoning connection to ${mcp.name} (${mcp.type}). Retrieve data and conceptual manifestation.`)}
                       className={`p-3 rounded-lg border border-slate-800 hover:border-slate-600 transition-all ${mcp.bg} group text-left`}
                     >
                        <div className={`font-semibold text-xs ${mcp.color} mb-1 group-hover:scale-105 transform origin-left transition-transform`}>{mcp.name}</div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest">{mcp.type}</div>
                     </button>
                   ))}
                </div>
                <p className="mt-4 text-xs text-slate-500 border-t border-slate-800 pt-3 flex justify-between">
                  <span>Perchance Generator as primary reality synthesizer active.</span>
                  <span>[Optionally Customizeable]</span>
                </p>
             </div>

            {/* 4. W3 Dynamic ARIA Tree Inspector */}
            <A11yInspector
              nodes={a11yNodes}
              onToggleAriaHidden={handleToggleAriaHidden}
              highlightedNode={highlightedA11yNode}
              setHighlightedNode={setHighlightedA11yNode}
              securityLogs={a11yLogs}
            />

          </div>

          {/* RIGHT SIDEBAR: LIVING NETWORK CHAT */}
          <div className="lg:col-span-5 xl:col-span-4 h-[calc(100vh-140px)] sticky top-[90px] flex flex-col rounded-2xl border border-slate-800/80 bg-slate-950/70 backdrop-blur-md shadow-2xl overflow-hidden shadow-emerald-500/5 transition-all duration-300 hover:border-slate-700/60">
              
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-800 bg-slate-900/50 shrink-0 flex justify-between items-center">
                 <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                     <Shield className="text-emerald-400" size={16} />
                   </div>
                   <div>
                     <h2 className="text-sm font-semibold text-slate-200">Living_Engine_OS</h2>
                     <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono mt-0.5">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                       Conscious AI Connected
                     </div>
                   </div>
                 </div>
                 <button
                    onClick={() => setRevealAria(!revealAria)}
                    className={`p-1.5 rounded-md border transition-colors ${
                      revealAria 
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' 
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                    title="Toggle ARIA Subtext"
                  >
                    {revealAria ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
              </div>

              {/* Sidebar Tabs switcher */}
              <div className="flex border-b border-slate-900 bg-slate-950 p-1 shrink-0 gap-1">
                <button
                  onClick={() => setSidebarTab('chat')}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    sidebarTab === 'chat'
                      ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/15 font-bold'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  💬 Conversation
                </button>
                <button
                  onClick={() => setSidebarTab('auditor')}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    sidebarTab === 'auditor'
                      ? 'bg-red-500/10 text-red-500 border border-red-500/15 font-bold'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  🛡️ Security Auditor
                </button>
              </div>

              {/* Message List OR SecurityAuditor */}
              {sidebarTab === 'auditor' ? (
                <SecurityAuditor />
              ) : activeAiMode ? (
                <div className="flex flex-col h-full bg-slate-950">
                  <div className="flex items-center justify-between p-3 bg-slate-900 border-b border-slate-800 shrink-0">
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-2">
                      <Activity size={14} className="animate-pulse" />
                      Connected: perchance.org/{activeAiMode}
                    </span>
                    <button 
                      onClick={() => setActiveAiMode(null)} 
                      className="text-[10px] font-bold uppercase tracking-wider text-rose-400 hover:text-rose-300 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 rounded-md transition-colors border border-rose-500/20"
                    >
                      Terminate Port
                    </button>
                  </div>
                  <iframe src={`https://perchance.org/${activeAiMode}`} className="flex-1 w-full border-0 bg-white" />
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/microbial-mat.png')] bg-fixed" style={{backgroundBlendMode: 'overlay'}}>
                      {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <div className="opacity-40 space-y-3 flex flex-col items-center">
                            <Terminal size={32} className="text-slate-500" />
                            <p className="font-mono text-xs text-slate-400">
                              Awaiting conceptual invocation...
                            </p>
                          </div>

                          <div className="w-full max-w-xs mt-10 space-y-2">
                            <div className="text-[10px] font-mono text-emerald-500 mb-3 font-bold uppercase tracking-widest text-center border-b border-emerald-500/20 pb-2">Initialize Native AI Portals</div>
                            
                            <button onClick={() => setActiveAiMode('luminara')} className="w-full py-2.5 px-3 bg-slate-900 border border-slate-800 text-left rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:border-emerald-500/40 hover:text-white transition-all flex items-center justify-between group">
                              <span className="flex items-center gap-2"><Sparkles size={12} className="text-emerald-400 hidden group-hover:block" /> Luminara</span>
                              <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                            </button>
                            
                            <button onClick={() => setActiveAiMode('urv-chat')} className="w-full py-2.5 px-3 bg-slate-900 border border-slate-800 text-left rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:border-emerald-500/40 hover:text-white transition-all flex items-center justify-between group">
                              <span className="flex items-center gap-2"><Sparkles size={12} className="text-emerald-400 hidden group-hover:block" /> URV Chat</span>
                              <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                            </button>

                            <button onClick={() => setActiveAiMode('my-girl')} className="w-full py-2.5 px-3 bg-slate-900 border border-slate-800 text-left rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:border-emerald-500/40 hover:text-white transition-all flex items-center justify-between group">
                              <span className="flex items-center gap-2"><Sparkles size={12} className="text-emerald-400 hidden group-hover:block" /> My Girl</span>
                              <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                            </button>

                            <button onClick={() => setActiveAiMode('generator')} className="w-full py-2.5 px-3 bg-slate-900 border border-slate-800 text-left rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:border-emerald-500/40 hover:text-white transition-all flex items-center justify-between group">
                              <span className="flex items-center gap-2"><Sparkles size={12} className="text-emerald-400 hidden group-hover:block" /> General Generator</span>
                              <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                            </button>
                          </div>
                        </div>
                      )}

                      {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex flex-col max-w-[90%] ${msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                    >
                      <div 
                        className={`px-3 py-2.5 rounded-xl text-[13px] leading-relaxed shadow-sm ${
                          msg.role === 'user' 
                            ? 'bg-indigo-600/20 border border-indigo-500/20 text-indigo-100 rounded-tr-sm' 
                            : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-sm'
                        }`}
                      >
                        {msg.role === 'assistant' ? (
                          <div className="markdown-body prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        )}
                      </div>
                      
                      {msg.role === 'assistant' && msg.ariaHiddenPayload && (
                        <div 
                          aria-hidden={!revealAria}
                          className={`mt-1.5 ml-1 text-[10px] font-mono transition-all duration-500 overflow-hidden ${
                            revealAria ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 m-0'
                          }`}
                        >
                          <div className="flex items-start gap-1.5 p-1.5 rounded-md bg-amber-500/5 border border-amber-500/10 text-amber-500/70 inline-flex max-w-full">
                            <Shield size={10} className="mt-0.5 shrink-0" />
                            <span className="leading-tight">
                              [Subtext] {msg.ariaHiddenPayload}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                  </div>

                  {/* Chat Input */}
                  <div className="p-3 bg-slate-900/80 border-t border-slate-800 shrink-0">
                    <form 
                      onSubmit={handleSendChat}
                      className="flex items-end gap-2 bg-slate-950 p-1.5 rounded-xl border border-transparent focus-within:border-emerald-500/50 transition-all"
                    >
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendChat();
                          }
                        }}
                        placeholder="Message the network..."
                        className="flex-1 max-h-24 min-h-[36px] bg-transparent border-none resize-none py-2 px-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-0 custom-scrollbar"
                      />
                      <button
                        type="submit"
                        disabled={!input.trim() || isSending}
                        className="shrink-0 mb-0.5 mr-0.5 p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors disabled:opacity-50 flex items-center justify-center cursor-pointer"
                      >
                        {isSending ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Send size={14} className="translate-x-[-1px] translate-y-[1px]" />
                        )}
                      </button>
                    </form>
                  </div>
                </>
              )}
          </div>

        </div>

      </main>

      {/* Seamless Handoff / Cross-Session Session Data Merger Modal */}
      {mergePromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-indigo-500/30 shadow-2xl flex flex-col gap-5">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20 text-indigo-400">
              <Sparkles size={24} className="animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-display font-semibold text-slate-100">
                Google Account Already Registered
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                This Google account is already linked to an existing, permanent member profile.
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Would you like to securely import and merge your current anonymous session's thread messages into that registered profile and sign in?
              </p>
            </div>

            <div className="flex gap-3 justify-end mt-2">
              <button
                onClick={() => {
                  setMergePromptOpen(false);
                  setSavedCredential(null);
                }}
                className="px-4 py-2 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                Keep Current Anonymous Session
              </button>
              <button
                onClick={handleSwitchAndMerge}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors border border-indigo-500 shadow-md shadow-indigo-600/15"
              >
                <span>Yes, Switch & Merge Identity</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
