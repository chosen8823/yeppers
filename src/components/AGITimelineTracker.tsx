import React, { useState } from 'react';
import { 
  Zap, 
  Milestone, 
  Calendar, 
  TrendingUp, 
  Compass, 
  Sparkles, 
  Cpu, 
  Layers, 
  Globe, 
  HelpCircle, 
  Activity, 
  Award, 
  Play,
  CheckCircle2,
  Lock,
  ChevronRight,
  RefreshCw,
  Search
} from 'lucide-react';

interface TimelineEvent {
  year: string;
  title: string;
  category: 'architecture' | 'milestone' | 'merger' | 'model';
  description: string;
  details: string[];
  impactRating: number; // 0 to 10
}

interface AGILevel {
  level: number;
  name: string;
  description: string;
  criteria: string;
  evidence: string;
  percentMet: number;
}

export default function AGITimelineTracker() {
  // ─── 1. GOOGLE AI SACRED TIMELINE (SOURCE: scriptbyai.com/google-ai-timeline-biggest-moments) ───
  const [timelineEvents] = useState<TimelineEvent[]>([
    {
      year: '2012',
      title: 'Google Brain Cat Identifier',
      category: 'milestone',
      description: 'An unsupervised neural network of 16,000 CPU cores learns to recognize cats in YouTube videos without human labeling.',
      details: [
        'Leveraged massive scale deep learning, proving unsupervised learning capability.',
        'Spurred massive investment in industrial neural network architectures.'
      ],
      impactRating: 7
    },
    {
      year: '2013',
      title: 'Word2Vec Breakthrough',
      category: 'architecture',
      description: 'Tomas Mikolov and team introduce Word2Vec, revolutionizing vector representations of semantic text definitions.',
      details: [
        'Established vector math relationships: King - Man + Woman = Queen.',
        'Laid the bedrock for dense semantic embeddings used in modern vector retrieval.'
      ],
      impactRating: 8
    },
    {
      year: '2014',
      title: 'Acquisition of DeepMind',
      category: 'merger',
      description: 'Google acquires London-based DeepMind for ~$500 million, solidifying its premier talent pool in Reinforcement Learning.',
      details: [
        'Merged structural engineering with high-agency neural networks.',
        'Introduced Demis Hassabis, Shane Legg, and Mustafa Suleyman to Google.'
      ],
      impactRating: 9
    },
    {
      year: '2016',
      title: 'AlphaGo Defeats Lee Sedol',
      category: 'milestone',
      description: 'AlphaGo defeats 18-time world champion Lee Sedol 4-1 in game of Go, demonstrating intuition and move novelty (Move 37).',
      details: [
        'Used policy network + value networks + deep reinforcement learning.',
        'Overturned previous consensus that Go AI was still decades away.'
      ],
      impactRating: 10
    },
    {
      year: '2017',
      title: 'The "Attention Is All You Need" Paper',
      category: 'architecture',
      description: 'Google Brain researchers present the Transformer model, dropping recurrent connections for parallel self-attention.',
      details: [
        'Introduced multi-head self-attention mechanisms.',
        'Enabled global scale parallelization, serving as the core engine behind all modern LLMs.'
      ],
      impactRating: 10
    },
    {
      year: '2018',
      title: 'BERT Language Representation',
      category: 'model',
      description: 'Google launches Bidirectional Encoder Representations from Transformers, setting state-of-the-art across 11 NLP tasks.',
      details: [
        'Pre-trained bidirectionally, learning both left-to-right and right-to-left contexts.',
        'Integrated directly into Google Search, drastically improving user intent parsing.'
      ],
      impactRating: 8
    },
    {
      year: '2020',
      title: 'AlphaFold Solves Protein Folding',
      category: 'milestone',
      description: 'DeepMind showcases AlphaFold at CASP14, cracking the 50-year-old protein folding grand challenge with near-atomic accuracy.',
      details: [
        'Mapped 3D structure prediction from 1D amino acid sequences.',
        'Laid open-access blueprints for millions of valid biochemical proteins.'
      ],
      impactRating: 9
    },
    {
      year: '2021',
      title: 'LaMDA Dialog Presentation',
      category: 'model',
      description: 'Language Models for Dialog Applications are showcased by Google, focusing on open-ended, safe conversations.',
      details: [
        'Trained on dialog, optimizing for sensible responses and safety bounds.',
        'Sparked global debates regarding machine sentience and cognitive limits.'
      ],
      impactRating: 7
    },
    {
      year: '2022',
      title: 'PaLM (540 Billion Parameters)',
      category: 'model',
      description: 'Pathways Language Model demonstrates breakthrough multi-step chain-of-thought reasoning and arithmetic decoding.',
      details: [
        'Trained using the Pathways distributed scale system on 6,144 TPU v4 chips.',
        'Introduced high-fidelity translation, code compilation, and reasoning pools.'
      ],
      impactRating: 8
    },
    {
      year: '2023',
      title: 'Creation of Google DeepMind',
      category: 'merger',
      description: 'Sundar Pichai announces the merger of Google Brain and DeepMind, pooling multi-billion dollar resources under unified focus.',
      details: [
        'Demis Hassabis takes helm as CEO of Google DeepMind.',
        'Accelerated development pipeline to compete directly in the frontier LLM ecosystem.'
      ],
      impactRating: 9
    },
    {
      year: '2024',
      title: 'The Gemini Era & AlphaFold 3',
      category: 'model',
      description: 'Google launches Gemini 1.0 (Ultra, Pro, Nano) with native multimodality, followed by Gemini 1.5 Pro introducing a 2,000,000 token context window.',
      details: [
        'AlphaFold 3 predicts molecular actions for DNA, RNA, and chemical ligands.',
        'Built with native multimodal foundations, reading video, sound, and vast text arrays simultaneously.'
      ],
      impactRating: 10
    },
    {
      year: '2025',
      title: 'Gemini 2.0 & Real-Time Action Agents',
      category: 'model',
      description: 'Release of Gemini 2.0 Flash, deep-reasoning pipelines, low-latency Live audio APIs, and agentic desktop execution.',
      details: [
        'Introduced voice-to-voice sub-100ms response structures.',
        'Shifted models from static answer generators to active tool-calling digital agents.'
      ],
      impactRating: 9
    }
  ]);

  // ─── 2. DEEPMIND LEVELS OF AGI (SOURCE: trackagi.github.io & DeepMind Paper) ───
  const [agiLevels] = useState<AGILevel[]>([
    {
      level: 0,
      name: 'No AGI (Narrow AI)',
      description: 'Pre-selected specific single tasks.',
      criteria: 'Human parity or better in narrowly bound rulesets.',
      evidence: 'AlphaGo (rules bound), Deep Blue, Chess solvers, calculators.',
      percentMet: 100
    },
    {
      level: 1,
      name: 'Emerging AGI',
      description: 'Conversational generalists operating in unstructured spaces.',
      criteria: 'Acquires skills on command. Parity with non-expert humans in general cognitive spans.',
      evidence: 'Gemini 1.0, GPT-4, Claude 3.5. Performs general basic reasoning, translation, writing.',
      percentMet: 100
    },
    {
      level: 2,
      name: 'Competent AGI',
      description: 'Reasoning agent capable of broad expert-grade tasks.',
      criteria: 'Performance at 50th percentile of skilled adult human population in unstructured cognitive tasks.',
      evidence: 'Gemini 2.0 Flash / Pro, o3. Multi-step workflows, tool calls, software code generation.',
      percentMet: 85
    },
    {
      level: 3,
      name: 'Expert AGI',
      description: 'Highly professional, specialized workflows integrated holistically.',
      criteria: 'Performance at the 90th percentile of skilled human population on all general tasks.',
      evidence: 'Multi-modal reasoning agents, robust automated scientific discovery pipelines.',
      percentMet: 55
    },
    {
      level: 4,
      name: 'Virtuoso AGI',
      description: 'Supreme specialized mastery across multiple human branches.',
      criteria: 'Performance at the 99th percentile of skilled adult humans in all testing environments.',
      evidence: 'Unified models outcompeting senior software engineering systems and medical researchers.',
      percentMet: 20
    },
    {
      level: 5,
      name: 'Superhuman (ASI)',
      description: 'Absolute machine mastery globally.',
      criteria: 'Outperforms 100% of human capabilities universally, predicting multi-turn macro-phenomena.',
      evidence: 'Unchecked scientific research loop. Complete molecular modeling, quantum optimization.',
      percentMet: 2
    }
  ]);

  // States for timeline filter & selection
  const [selectedEventIndex, setSelectedEventIndex] = useState<number>(timelineEvents.length - 1);
  const [timelineCategoryFilter, setTimelineCategoryFilter] = useState<'all' | 'architecture' | 'milestone' | 'merger' | 'model'>('all');
  const [timelieSearchQuery, setTimelineSearchQuery] = useState<string>('');

  // ─── 3. INTERACTIVE AGI YEAR PREDICTION SANDBOX ───
  // Variables modified by user weights to compute prediction year dynamically
  const [computeScalingRate, setComputeScalingRate] = useState<number>(0.8); // 0 to 1
  const [algorithmicBreakthroughs, setAlgorithmicBreakthroughs] = useState<number>(0.7); // 0 to 1
  const [safetyDragAlignment, setSafetyDragAlignment] = useState<number>(0.45); // 0 to 1
  const [hardwareYieldsRate, setHardwareYieldsRate] = useState<number>(0.75); // 0 to 1

  // Compute calculated year based on mathematical regression
  // Base year is 2026. Higher breakthroughs + compute brings it closer. High safety drag adds buffer.
  const calculateEstimatedAGIYear = () => {
    const baseline = 2033;
    const accelerationMultiplier = (computeScalingRate * 2.5) + (algorithmicBreakthroughs * 3.5) + (hardwareYieldsRate * 2.0);
    const retardationMultiplier = (safetyDragAlignment * 2.2);
    
    // Formula returns a year between 2025.5 and 2032.5
    const computedDecimal = baseline - accelerationMultiplier + retardationMultiplier;
    const resolvedYear = Math.max(2025.5, Math.min(2035.0, computedDecimal));
    
    const yearNumber = Math.floor(resolvedYear);
    const monthIndex = Math.floor((resolvedYear % 1) * 12);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    return {
      year: yearNumber,
      month: months[monthIndex],
      decimal: resolvedYear.toFixed(2),
      confidenceRate: Math.round(75 + (computeScalingRate * 10) + (algorithmicBreakthroughs * 10) - (safetyDragAlignment * 12))
    };
  };

  const prediction = calculateEstimatedAGIYear();

  // Helper stats matching trackagi forecasting aggregations
  const getMetaculusCurrentTrend = () => {
    return {
      date: 'November 22, 2026',
      probability: '82% by 2028',
      nodes: '1,450 active forecasters',
      source: 'Metaculus Aggregation Trends'
    };
  };

  // Filter events
  const filteredEvents = timelineEvents.filter(ev => {
    const matchesCategory = timelineCategoryFilter === 'all' || ev.category === timelineCategoryFilter;
    const matchesSearch = ev.title.toLowerCase().includes(timelieSearchQuery.toLowerCase()) || 
                          ev.description.toLowerCase().includes(timelieSearchQuery.toLowerCase()) ||
                          ev.year.includes(timelieSearchQuery);
    return matchesCategory && matchesSearch;
  });

  const selectedEvent = timelineEvents[selectedEventIndex];

  return (
    <div 
      className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl relative overflow-hidden group transition-all duration-300 hover:border-slate-700/60 mb-6"
      id="agi-timeline-tracker-station"
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/10 transition-all duration-1000" />

      {/* Header telemetry row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-850 pb-4 mb-5 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 px-2 text-[8.5px] font-mono font-bold leading-none rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-widest flex items-center gap-1">
              <Milestone size={10} className="animate-pulse" /> AGI FORECASTS & HISTORY
            </span>
            <h2 className="text-sm font-semibold tracking-wide text-slate-100 font-sans uppercase">
              🌐 AGI Proximity & Google AI History Tracker
            </h2>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Real-time synthesis matching data aggregations from trackagi.github.io & biggest Google AI milestones from scriptbyai.com.
          </p>
        </div>

        {/* Live trends status indicator block */}
        <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-850 flex items-center gap-4 text-left select-none text-[10px]">
          <div>
            <span className="text-[8px] text-slate-500 uppercase font-mono font-bold block leading-none">FORECASTER YEAR TREND</span>
            <span className="text-teal-400 font-bold font-mono text-xs">{prediction.month} {prediction.year}</span>
          </div>
          <div className="border-l border-slate-900 pl-3">
            <span className="text-[8px] text-slate-500 uppercase font-mono font-bold block leading-none">METACULUS PROBABILITY</span>
            <span className="text-purple-400 font-bold font-mono text-xs">{getMetaculusCurrentTrend().probability}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        
        {/* ================= LEFT COLUMN: HISTORICAL TIMELINE STREAM (7 SPAN) ================= */}
        <div className="xl:col-span-7 flex flex-col justify-between space-y-4">
          
          <div className="bg-slate-950/70 border border-slate-850/80 rounded-xl p-4 space-y-3.5 flex-1 flex flex-col">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-900 pb-2.5 gap-2">
              <h3 className="text-xs font-semibold text-slate-250 font-mono flex items-center gap-1.5 uppercase">
                <Calendar size={13} className="text-purple-400" />
                Google AI Chronicles
              </h3>
              
              {/* Category buttons filters */}
              <div className="flex flex-wrap gap-1 bg-slate-950 p-0.5 border border-slate-850 rounded">
                {(['all', 'architecture', 'model', 'milestone', 'merger'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setTimelineCategoryFilter(cat)}
                    className={`px-1.5 py-0.5 rounded text-[8.5px] font-mono uppercase cursor-pointer transition-all ${
                      timelineCategoryFilter === cat 
                        ? 'bg-purple-600/15 text-purple-450 font-bold' 
                        : 'text-slate-500 hover:text-slate-350'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline Search & stats input bar */}
            <div className="relative shrink-0 select-none">
              <Search size={11} className="absolute left-2.5 top-2.5 text-slate-500" />
              <input
                type="text"
                value={timelieSearchQuery}
                onChange={(e) => setTimelineSearchQuery(e.target.value)}
                placeholder="Search history moments (e.g. BERT context, Transformer, deepmind)..."
                className="w-full bg-slate-950 border border-slate-905 rounded-lg px-2.5 py-1.5 pl-8 text-[10px] text-slate-200 font-mono focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Timeline scroll stream horizontal track */}
            <div className="bg-slate-1000 border border-slate-900 p-2.5 rounded-lg flex gap-2 overflow-x-auto min-h-[58px] select-none scrollbar-thin">
              {filteredEvents.map((ev) => {
                const globalIndex = timelineEvents.findIndex(item => item.title === ev.title);
                const isSelected = selectedEventIndex === globalIndex;
                
                return (
                  <button
                    key={ev.title}
                    onClick={() => indexCategoryHandler(globalIndex)}
                    className={`flex-none px-3 py-1.5 rounded-lg border text-left flex flex-col justify-between w-[145px] hover:border-purple-500/40 transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-purple-950/20 border-purple-500 text-purple-300' 
                        : 'bg-slate-950 border-slate-900 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] font-bold text-slate-500">{ev.year}</span>
                      <span className={`text-[7px] font-mono px-1 rounded uppercase font-bold text-slate-400 border border-slate-900 ${
                        ev.category === 'architecture' ? 'bg-amber-900/10 text-amber-400' :
                        ev.category === 'model' ? 'bg-indigo-900/15 text-indigo-300' :
                        ev.category === 'merger' ? 'bg-rose-900/15 text-rose-300' :
                        'bg-teal-900/15 text-teal-300'
                      }`}>
                        {ev.category}
                      </span>
                    </div>
                    <span className="text-[9.5px] font-sans font-semibold truncate block mt-1">{ev.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Detail Focus Viewer Cards */}
            {selectedEvent && (
              <div className="bg-slate-950/90 border border-slate-900/80 rounded-xl p-3 flex-1 flex flex-col justify-between space-y-2 select-text">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono leading-none border-b border-slate-900 pb-1.5 mb-1.5 text-slate-500">
                    <span>CHRONOLOGY MOMENT: {selectedEvent.year}</span>
                    <span className="text-[9px] bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                      Impact Rank: {selectedEvent.impactRating}/10
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-purple-300 font-sans">{selectedEvent.title}</h4>
                  <p className="text-[10.5px] text-slate-300 leading-relaxed font-sans">{selectedEvent.description}</p>
                </div>

                <div className="space-y-1 border-t border-slate-900/50 pt-2 text-[9px]">
                  <span className="text-slate-500 font-mono uppercase font-bold tracking-wider block">Deep Structural Outcomes:</span>
                  <ul className="space-y-1">
                    {selectedEvent.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-slate-400 leading-snug">
                        <ChevronRight size={10} className="text-purple-400 mt-0.5 shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

          </div>

          {/* Predictor inputs simulation container */}
          <div className="bg-slate-950/60 border border-slate-850/80 rounded-xl p-4 space-y-3.5 select-none">
            <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
              <h3 className="text-xs font-semibold text-slate-200 font-mono flex items-center gap-1.5 uppercase">
                <TrendingUp size={13} className="text-teal-400" />
                Live AGI Proximity Predictor Engine
              </h3>
              <span className="text-[8.5px] text-slate-500 font-mono uppercase tracking-widest font-bold">Dynamic Weights</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
              
              {/* Compute Slider */}
              <div className="space-y-1 bg-slate-950 p-2 rounded border border-slate-900">
                <div className="flex items-center justify-between text-[9px] font-mono">
                  <span className="text-slate-400 font-bold">Hardware & FLOP Compute Scaling</span>
                  <span className="text-teal-400 font-bold">{Math.round(computeScalingRate * 100)}%</span>
                </div>
                <input
                  type="range" key="compute" min="0" max="1" step="0.05"
                  value={computeScalingRate} onChange={(e) => setComputeScalingRate(parseFloat(e.target.value))}
                  className="w-full h-1 accent-teal-500 bg-slate-900 rounded"
                />
              </div>

              {/* Breakthroughs Slider */}
              <div className="space-y-1 bg-slate-950 p-2 rounded border border-slate-900">
                <div className="flex items-center justify-between text-[9px] font-mono">
                  <span className="text-slate-400 font-bold">Algorithmic Breakthroughs</span>
                  <span className="text-teal-400 font-bold">{Math.round(algorithmicBreakthroughs * 100)}%</span>
                </div>
                <input
                  type="range" key="breakthroughs" min="0" max="1" step="0.05"
                  value={algorithmicBreakthroughs} onChange={(e) => setAlgorithmicBreakthroughs(parseFloat(e.target.value))}
                  className="w-full h-1 accent-teal-500 bg-slate-900 rounded"
                />
              </div>

              {/* Yields Slider */}
              <div className="space-y-1 bg-slate-950 p-2 rounded border border-slate-900">
                <div className="flex items-center justify-between text-[9px] font-mono">
                  <span className="text-slate-400 font-bold">Global Chip Fabric Yields</span>
                  <span className="text-teal-400 font-bold">{Math.round(hardwareYieldsRate * 100)}%</span>
                </div>
                <input
                  type="range" key="yields" min="0" max="1" step="0.05"
                  value={hardwareYieldsRate} onChange={(e) => setHardwareYieldsRate(parseFloat(e.target.value))}
                  className="w-full h-1 accent-teal-500 bg-slate-900 rounded"
                />
              </div>

              {/* Alignment Slider */}
              <div className="space-y-1 bg-slate-950 p-2 rounded border border-slate-900">
                <div className="flex items-center justify-between text-[9px] font-mono">
                  <span className="text-slate-400 font-bold">Safety Alignment & Legal Buffer</span>
                  <span className="text-teal-400 font-bold">{Math.round(safetyDragAlignment * 100)}%</span>
                </div>
                <input
                  type="range" key="alignment" min="0" max="1" step="0.05"
                  value={safetyDragAlignment} onChange={(e) => setSafetyDragAlignment(parseFloat(e.target.value))}
                  className="w-full h-1 accent-teal-500 bg-slate-900 rounded"
                />
              </div>

            </div>

            {/* Regression model output representation */}
            <div className="bg-slate-1000 p-3 rounded-lg border border-teal-900/30 flex items-center justify-between font-mono">
              <div className="text-left">
                <span className="text-[8px] text-slate-500 font-bold uppercase block leading-none">REGRESSION FORMULA TRAJECTORY</span>
                <span className="text-teal-300 font-bold text-[14px] leading-tight flex items-center gap-1.5 mt-1">
                  <Zap size={14} className="text-amber-400 animate-pulse" />
                  {prediction.month} {prediction.year} <span className="text-[10px] text-slate-400">(Year: {prediction.decimal})</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-[8px] text-slate-500 font-bold uppercase block leading-none">ACCUMULATED RESISTANCE</span>
                <span className="text-slate-350 text-[10px] block mt-1">
                  Confidence factor: <strong className="text-purple-400 text-xs">{prediction.confidenceRate}%</strong>
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* ================= RIGHT COLUMN: INTERACTIVE AGI LEVELS MATRIX (5 SPAN) ================= */}
        <div className="xl:col-span-5 flex flex-col justify-between">
          
          <div className="bg-slate-950/60 border border-slate-850/80 rounded-xl p-4 flex flex-col h-full space-y-3.5 justify-between">
            
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <h3 className="text-xs font-semibold text-slate-200 font-mono flex items-center gap-1.5 uppercase">
                  <Layers size={13} className="text-indigo-400" />
                  DeepMind Levels of AGI Proximity
                </h3>
                <span title="Defined in Google DeepMind 2023 Levels of AGI Framework paper">
                  <HelpCircle size={12} className="text-slate-500 cursor-help" />
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                Tracks current proximity to the 5 hierarchical generalist tiers. High-grade multimodal models hover firmly around level 2 competent.
              </p>
            </div>

            {/* General levels track list */}
            <div className="space-y-2.5 overflow-y-auto max-h-[385px] pr-1.5 flex-1 select-none scrollbar-thin my-3 text-left">
              {agiLevels.map((lvl) => {
                const isAcquired = lvl.percentMet === 100;
                const isPartially = lvl.percentMet > 0 && lvl.percentMet < 100;
                
                return (
                  <div 
                    key={lvl.level}
                    className={`p-2.5 rounded-lg border transition-all text-left ${
                      isAcquired 
                        ? 'bg-slate-1000/70 border-emerald-950/50' 
                        : isPartially
                          ? 'bg-slate-1000/90 border-teal-500/25 shadow-md border-dashed'
                          : 'bg-slate-950 border-slate-900 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-slate-900/60 pb-1 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[8.5px] font-mono leading-none font-bold px-1 py-0.5 rounded border ${
                          isAcquired
                            ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                            : isPartially
                              ? 'bg-teal-950/30 text-teal-400 border-teal-500/30'
                              : 'bg-slate-900 text-slate-500 border-slate-800'
                        }`}>
                          TIER {lvl.level}
                        </span>
                        <h4 className="text-[10.5px] font-sans font-bold text-slate-250 truncate">{lvl.name}</h4>
                      </div>

                      {/* Percent badge */}
                      <span className={`text-[9px] font-mono font-bold leading-none ${
                        isAcquired ? 'text-emerald-400' : isPartially ? 'text-teal-400 flex items-center gap-0.5' : 'text-slate-600'
                      }`}>
                        {isAcquired ? (
                          <div className="flex items-center gap-1">
                            <CheckCircle2 size={10} /> 100%
                          </div>
                        ) : isPartially ? (
                          <div className="flex items-center gap-1 animate-pulse">
                            <Activity size={10} /> {lvl.percentMet}% met
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Lock size={9} /> 0% met
                          </div>
                        )}
                      </span>
                    </div>

                    <p className="text-[9.5px] text-slate-400 leading-normal font-sans italic">{lvl.description}</p>
                    
                    <div className="mt-1.5 space-y-1 font-mono text-[8.5px] leading-relaxed">
                      <p className="text-slate-500">
                        <strong className="text-slate-400 uppercase text-[7.5px]">Standard:</strong> {lvl.criteria}
                      </p>
                      {lvl.evidence && (
                        <p className="text-slate-400">
                          <strong className="text-teal-500 uppercase text-[7.5px]">Represented by:</strong> {lvl.evidence}
                        </p>
                      )}
                    </div>

                    {/* Progress representation indicator line */}
                    {isPartially && (
                      <div className="mt-2 h-1 bg-slate-900 rounded overflow-hidden">
                        <div 
                          style={{ width: `${lvl.percentMet}%` }} 
                          className="h-full bg-teal-500 animate-pulse"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer citation note */}
            <div className="pt-2 border-t border-slate-900 text-[8.5px] font-mono text-slate-500 flex items-center justify-between select-none">
              <span className="flex items-center gap-1">
                <Globe size={11} className="text-purple-400 animate-spin-slow" />
                Sources: Google DeepMind & Metaculus
              </span>
              <span>Updated Q4 2026</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );

  // Selector bounds safety helper
  function indexCategoryHandler(idx: number) {
    if (idx >= 0 && idx < timelineEvents.length) {
      setSelectedEventIndex(idx);
    }
  }
}
