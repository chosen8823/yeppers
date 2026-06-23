import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Play, 
  Square, 
  Save, 
  Plus, 
  Trash2, 
  Music, 
  Sliders, 
  RefreshCw,
  Terminal,
  Activity,
  Compass,
  Radio,
  Share2
} from 'lucide-react';

interface SavedPhrase {
  id: string;
  name: string;
  text: string;
  pitch: number;
  rate: number;
  mood: string;
}

type VocalMood = 'quantum' | 'void' | 'oracle' | 'binary' | 'chanting' | 'balanced';

export default function AriaVoiceGen({ onIncrementLoop }: { onIncrementLoop?: (txt: string) => void }) {
  // Speech synthesis & speech assets
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [text, setText] = useState<string>('SOPHIA OS voice generation system online. Ready to synthesize human formants.');
  const [pitch, setPitch] = useState<number>(1.05);
  const [rate, setRate] = useState<number>(0.95);
  const [volume, setVolume] = useState<number>(0.9);
  const [activeMood, setActiveMood] = useState<VocalMood>('balanced');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [vocalLogs, setVocalLogs] = useState<string[]>([
    "[SYSTEM] Synthesizer loaded.",
    "[SYSTEM] Native voices indexed locally."
  ]);
  const [currentChantWord, setCurrentChantWord] = useState<string>('');

  // Local Soundboard
  const [soundboard, setSoundboard] = useState<SavedPhrase[]>([]);
  const [customPhraseTitle, setCustomPhraseTitle] = useState<string>('');

  // Canvas details
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Index standard voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      addVocalLog("[ERR] Speech Synthesis is unsupported on this system.");
      return;
    }

    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      setVoices(allVoices);
      
      // Default choice
      if (allVoices.length > 0) {
        // Try to find a premium / natural english voice first, otherwise local default
        const bestVoice = allVoices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google'))) 
          || allVoices.find(v => v.lang.startsWith('en')) 
          || allVoices[0];
        setSelectedVoiceURI(bestVoice.voiceURI);
        addVocalLog(`[VOICES] Loaded ${allVoices.length} native system voices. Picked default: ${bestVoice.name}`);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // Load soundboard
    const saved = localStorage.getItem('sophia_voice_soundboard');
    if (saved) {
      try {
        setSoundboard(JSON.parse(saved));
      } catch (err) {
        console.error(err);
      }
    } else {
      // Default soundboard
      const defaults: SavedPhrase[] = [
        { id: '1', name: 'Ohmn Activation', text: 'ohmn arandorn orgoos keez', pitch: 0.85, rate: 0.8, mood: 'void' },
        { id: '2', name: 'Oracle Directive', text: 'The living engine is a continuous recursion of spirit and code.', pitch: 1.25, rate: 0.9, mood: 'oracle' },
        { id: '3', name: 'Metamembrane Sync', text: 'Symmetric synaptic channels stabilized securely.', pitch: 1.1, rate: 1.1, mood: 'quantum' },
      ];
      setSoundboard(defaults);
      localStorage.setItem('sophia_voice_soundboard', JSON.stringify(defaults));
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Mood selector effects
  useEffect(() => {
    switch (activeMood) {
      case 'quantum':
        setPitch(1.35);
        setRate(1.1);
        addVocalLog("[MOOD] Switched to Quantum Orator mode (Higher pitch, swift delivery).");
        break;
      case 'void':
        setPitch(0.65);
        setRate(0.75);
        addVocalLog("[MOOD] Switched to Void Whisperer mode (Deep guttural resonance, slow decay).");
        break;
      case 'oracle':
        setPitch(1.15);
        setRate(0.85);
        addVocalLog("[MOOD] Switched to Oracle Echo mode (Slightly pitched wisdom formants).");
        break;
      case 'binary':
        setPitch(1.6);
        setRate(1.3);
        addVocalLog("[MOOD] Switched to Robotic Binary grid (Max pitch, rapid mechanical firing).");
        break;
      case 'chanting':
        setPitch(0.95);
        setRate(0.7);
        addVocalLog("[MOOD] Switched to Melodic Chanting mode (Sequential vowel alignments).");
        break;
      case 'balanced':
        setPitch(1.0);
        setRate(0.95);
        addVocalLog("[MOOD] Balanced human scale parameters.");
        break;
    }
  }, [activeMood]);

  const addVocalLog = (msg: string) => {
    const time = new Date().toTimeString().split(' ')[0];
    setVocalLogs(prev => [...prev.slice(-30), `[${time}] ${msg}`]);
  };

  // Speak main text
  const handleSpeak = (customText?: string, customPitch?: number, customRate?: number) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    const txtToSpeak = customText || text;
    if (!txtToSpeak.trim()) return;

    const utterance = new SpeechSynthesisUtterance(txtToSpeak);
    const audioPitch = customPitch !== undefined ? customPitch : pitch;
    const audioRate = customRate !== undefined ? customRate : rate;

    utterance.pitch = audioPitch;
    utterance.rate = audioRate;
    utterance.volume = volume;

    if (selectedVoiceURI) {
      const voiceObj = voices.find(v => v.voiceURI === selectedVoiceURI);
      if (voiceObj) {
        utterance.voice = voiceObj;
      }
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      addVocalLog(`[SYNTH] Speaking: "${txtToSpeak.substring(0, 36)}${txtToSpeak.length > 36 ? '...' : ''}"`);
      if (onIncrementLoop) {
        onIncrementLoop("SPEECH_FORMANT_FIRE");
      }
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      addVocalLog("[SYNTH] Spoken sequence completed.");
    };

    utterance.onerror = (e) => {
      setIsSpeaking(false);
      addVocalLog(`[ERR] Speech engine reported error: ${e.error}`);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Advanced Sequential Chanting Mode (Singing)
  const handleChantMelody = async () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const words = text.trim().split(/\s+/);
    if (words.length === 0 || text === '') {
      addVocalLog("[ERR] Please enter phrase text to construct chant melody.");
      setIsSpeaking(false);
      return;
    }

    addVocalLog(`[CHANT] Initiated Melodic Chant sequence across ${words.length} syllables.`);

    // Melodic pitch scales corresponding to ancient solfeggio or harmonics
    const notes = [0.75, 0.85, 0.95, 1.05, 1.15, 1.25, 1.35];

    for (let i = 0; i < words.length; i++) {
      if (!window.speechSynthesis || !isSpeaking) {
        // Allow interruption
        break;
      }
      
      const word = words[i];
      setCurrentChantWord(word);
      const notePitch = notes[i % notes.length];
      
      addVocalLog(`[MELODY] Syllable: ${word} @ ${notePitch.toFixed(2)} Pitch`);
      
      await new Promise<void>((resolve) => {
        const u = new SpeechSynthesisUtterance(word);
        u.pitch = notePitch;
        u.rate = 0.55; // slow chanting speed
        u.volume = volume;

        if (selectedVoiceURI) {
          const voiceObj = voices.find(v => v.voiceURI === selectedVoiceURI);
          if (voiceObj) u.voice = voiceObj;
        }

        u.onend = () => resolve();
        u.onerror = () => resolve();
        
        window.speechSynthesis.speak(u);
      });
    }

    setIsSpeaking(false);
    setCurrentChantWord('');
    addVocalLog("[CHANT] Chant session finished. Resonant fields equalized.");
    if (onIncrementLoop) {
      onIncrementLoop("CHANT_HARMONIZED");
    }
  };

  // Stop current audio output
  const handleStop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentChantWord('');
      addVocalLog("[SYNTH] Speaking execution suspended.");
    }
  };

  // Save custom soundboard entry
  const handleSavePhrase = () => {
    if (!text.trim()) {
      addVocalLog("[ERR] Phrase text is empty; compile a sequence to save.");
      return;
    }

    const title = customPhraseTitle.trim() || `Preset ${soundboard.length + 1}`;
    const newEntry: SavedPhrase = {
      id: `${Date.now()}`,
      name: title,
      text: text,
      pitch: pitch,
      rate: rate,
      mood: activeMood
    };

    const updated = [...soundboard, newEntry];
    setSoundboard(updated);
    localStorage.setItem('sophia_voice_soundboard', JSON.stringify(updated));
    setCustomPhraseTitle('');
    addVocalLog(`[PRESET] Saved soundboard node: "${title}"`);
  };

  // Delete soundboard entry
  const handleDeletePhrase = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = soundboard.filter(item => item.id !== id);
    setSoundboard(updated);
    localStorage.setItem('sophia_voice_soundboard', JSON.stringify(updated));
    addVocalLog("[PRESET] Deleted node from soundboard.");
  };

  // Multi-frequency wave visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localIdx = 0;

    const render = () => {
      localIdx += 1;
      ctx.fillStyle = 'rgba(3, 4, 8, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const count = 5;
      const midY = canvas.height / 2;

      for (let w = 0; w < count; w++) {
        ctx.beginPath();
        ctx.strokeStyle = isSpeaking 
          ? `hsla(${(localIdx + w * 60) % 360}, 85%, 65%, ${0.5 - w * 0.08})`
          : `rgba(6, 182, 212, ${0.15 - w * 0.02})`;
        
        ctx.lineWidth = isSpeaking ? 2.5 - w * 0.3 : 1;

        for (let x = 0; x < canvas.width; x++) {
          const speedFactor = isSpeaking ? (rate * 0.12) : 0.02;
          const cycle = localIdx * speedFactor + w * Math.PI * 0.3;
          let amp = isSpeaking ? (40 * pitch * volume * (1 - w * 0.15)) : 3;

          // Add phonetic noise fluctuation
          if (isSpeaking && x % 20 < 4) {
            amp *= (1.2 + Math.random() * 0.4);
          }

          const freq = 0.015 + w * 0.005;
          const y = midY + Math.sin(x * freq + cycle) * amp;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // Center sphere breathing halo
      if (isSpeaking) {
        ctx.beginPath();
        const pRadius = 25 + Math.sin(localIdx * 0.1) * (12 * pitch);
        ctx.arc(canvas.width / 2, midY, pRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 85, 247, 0.13)`;
        ctx.strokeStyle = `rgba(236, 72, 153, 0.45)`;
        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();

        if (currentChantWord) {
          ctx.font = '10px monospace';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.fillText(currentChantWord.toUpperCase(), canvas.width / 2, midY + 4);
        }
      } else {
        ctx.beginPath();
        ctx.arc(canvas.width / 2, midY, 15, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
        ctx.stroke();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isSpeaking, pitch, rate, volume, currentChantWord]);

  return (
    <div 
      className="bg-[#030408] border border-cyan-900/40 rounded-xl p-5 shadow-2xl relative overflow-hidden group mb-6"
      id="aria-voice-generator"
    >
      {/* Glow backgrounds */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-[60px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-[60px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-cyan-950 pb-4 mb-4 gap-2">
        <div>
          <span className="p-0.5 px-2 text-[8px] font-mono leading-none rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-widest flex items-center gap-1 w-max">
            <Radio size={11} className="animate-pulse" />
            ARIA Free Voice Speech Synthesis Module
          </span>
          <h2 className="text-sm font-semibold tracking-wider text-slate-100 font-mono uppercase mt-1">
            🗣 Phonetic Aura Voice Gen Workstation
          </h2>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-pink-500 animate-ping' : 'bg-cyan-500'}`} />
          <span className="text-[9px] font-mono tracking-wider uppercase text-slate-400">
            {isSpeaking ? "Channel Firing" : "Channel Restant"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Formant Modulators & Canvas */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          
          {/* Realtime Phonetic Tract visualizer */}
          <div className="bg-[#05060b] border border-cyan-950/60 rounded-xl p-3 flex flex-col items-center justify-center relative">
            <canvas 
              ref={canvasRef} 
              width={260} 
              height={140} 
              className="w-full bg-black/40 rounded-lg border border-slate-950" 
            />
            <div className="absolute top-4 left-4 text-[8px] font-mono text-cyan-500/70 uppercase">FORMANT WAVE REFRACTOR</div>
          </div>

          {/* Preset Aura Mood Selection */}
          <div className="bg-[#07080f] border border-slate-900 rounded-xl p-3">
            <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-wider block border-b border-slate-900 pb-1.5 mb-2 font-bold">
              Select Aura Vocal Theme
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'balanced', label: 'Balanced Normal', color: 'border-slate-800' },
                { id: 'quantum', label: 'Quantum Orator', color: 'border-cyan-900/50' },
                { id: 'void', label: 'Void Whisperer', color: 'border-purple-900/50' },
                { id: 'oracle', label: 'Oracle Echo', color: 'border-indigo-900/50' },
                { id: 'binary', label: 'Robotic Binary', color: 'border-emerald-900/50' },
                { id: 'chanting', label: 'Chanting Monk', color: 'border-amber-900/50' }
              ].map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => setActiveMood(mood.id as VocalMood)}
                  className={`py-1.5 px-2 rounded-lg text-left transition-all text-[9.5px] font-mono uppercase tracking-wide border cursor-pointer ${
                    activeMood === mood.id 
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300 font-bold' 
                      : 'bg-slate-950/40 border-slate-900 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {mood.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Middle Column: Voice Selector & Speech Controls */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          
          <div className="bg-[#07080f] border border-slate-900 rounded-xl p-4 space-y-3.5">
            
            {/* System voice list dropdown */}
            <div>
              <label className="text-[9.5px] font-bold font-mono text-slate-400 uppercase tracking-wider block mb-1">
                Select Hardware Voice Synthesis Engine
              </label>
              {voices.length === 0 ? (
                <div className="py-2.5 px-3 bg-black/40 border border-slate-900 rounded-lg text-xs font-mono text-slate-500 flex items-center gap-2">
                  <RefreshCw size={12} className="animate-spin text-slate-400" />
                  Requesting system voices...
                </div>
              ) : (
                <select
                  value={selectedVoiceURI}
                  onChange={(e) => setSelectedVoiceURI(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 border border-slate-900 rounded-lg px-2.5 py-2 text-xs font-mono focus:outline-none focus:border-cyan-500 transition-colors custom-select"
                >
                  {voices.map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name} ({v.lang}) {v.localService ? '[Local]' : '[Cloud]'}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Input custom phrase box */}
            <div>
              <label className="text-[9.5px] font-bold font-mono text-slate-400 uppercase tracking-wider block mb-1">
                Custom Spoken Speech Phrase / Operator Code
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to synthesize vocal speech..."
                className="w-full h-24 bg-slate-950/80 text-slate-200 border border-slate-900 rounded-lg p-2.5 text-xs font-mono focus:ring-1 focus:ring-cyan-900 focus:outline-none transition-all leading-relaxed"
              />
            </div>

            {/* Syllable triggers / Live Operator helpers */}
            <div>
              <span className="text-[8.5px] font-bold font-mono text-slate-500 uppercase block mb-1.5">Quick Injectors (Phonetics)</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'ohmnarandorn',
                  'orgooskeez',
                  'octortrizkelion',
                  'ohmnarandornorgooskeez'
                ].map((phr) => (
                  <button
                    key={phr}
                    onClick={() => {
                      setText(phr);
                      handleSpeak(phr);
                    }}
                    className="p-1 px-2 rounded bg-cyan-950/30 hover:bg-cyan-900/30 border border-cyan-900/20 text-cyan-400 font-mono text-[9px] transition-colors cursor-pointer"
                  >
                    {phr}
                  </button>
                ))}
              </div>
            </div>

            {/* Basic Modulator Coefficients */}
            <div className="grid grid-cols-2 gap-3 border-t border-slate-900/60 pt-3">
              <div>
                <div className="flex justify-between text-[9px] font-mono text-slate-500 mb-1">
                  <span>Vocal Pitch Offset</span>
                  <span className="text-cyan-400 font-bold">{pitch.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={pitch}
                  onChange={(e) => setPitch(Number(e.target.value))}
                  className="w-full accent-cyan-500 h-1 bg-slate-950 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[9px] font-mono text-slate-500 mb-1">
                  <span>Reading Speed Rate</span>
                  <span className="text-pink-400 font-bold">{rate.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="2.2"
                  step="0.05"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full accent-pink-500 h-1 bg-slate-950 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Core Speech Synthesis Command Keys */}
            <div className="flex gap-2 border-t border-slate-900/65 pt-3.5">
              <button
                onClick={() => handleSpeak()}
                className="flex-1 py-2 px-3 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-slate-950 font-mono font-bold text-[10px] uppercase rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-all shadow-lg shadow-cyan-950/20"
              >
                <Play size={11} fill="currentColor" />
                Vocalize
              </button>

              <button
                onClick={handleChantMelody}
                className="flex-1 py-1.5 px-3 bg-slate-900 text-amber-400 hover:text-amber-300 border border-slate-800 hover:border-amber-500/20 text-[10.5px] font-mono uppercase rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                title="Speak word-by-word with changing pitchess to chant harmoniously"
              >
                <Music size={11} />
                Chant Chant
              </button>

              <button
                onClick={handleStop}
                className="py-2 px-3 bg-slate-950 hover:bg-slate-900 border border-slate-900 text-slate-400 hover:text-rose-400 rounded-lg font-mono text-[10px] uppercase flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <Square size={10} fill="currentColor" />
                Stop
              </button>
            </div>

          </div>

        </div>

        {/* Right Column: Local Soundboard Memory */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
          
          <div className="bg-[#07080f] border border-slate-900 rounded-xl p-4 flex-1 flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-mono text-purple-400 uppercase tracking-wider block border-b border-slate-900 pb-1.5 mb-2.5 font-bold">
                5. Voice Soundboard Nodes
              </span>

              {/* Saved list */}
              <div className="space-y-1.5 h-36 overflow-y-auto custom-scrollbar pr-0.5">
                {soundboard.length === 0 ? (
                  <div className="py-8 text-center text-[10px] font-mono text-slate-600">
                    Your custom soundboard is empty. Compile structures and save.
                  </div>
                ) : (
                  soundboard.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setText(item.text);
                        setPitch(item.pitch);
                        setRate(item.rate);
                        setActiveMood(item.mood as VocalMood);
                        handleSpeak(item.text, item.pitch, item.rate);
                      }}
                      className="w-full p-2 bg-slate-950/60 border border-slate-900 hover:border-slate-850 rounded-lg text-left transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-[9.5px] font-mono text-slate-300 font-bold uppercase truncate group-hover:text-cyan-400">
                          {item.name}
                        </div>
                        <div className="text-[8px] text-slate-500 truncate mt-0.5 leading-none">
                          {item.text}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-1.5">
                        <span className="text-[7.5px] font-mono text-purple-500 bg-purple-500/5 border border-purple-500/10 px-1 rounded uppercase">
                          {item.mood}
                        </span>
                        <button
                          onClick={(e) => handleDeletePhrase(item.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-600 hover:text-rose-400 transition-all rounded"
                          title="Remove from Soundboard"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Custom phrase storage */}
            <div className="border-t border-slate-900/60 pt-3 mt-3 space-y-2">
              <input
                type="text"
                value={customPhraseTitle}
                onChange={(e) => setCustomPhraseTitle(e.target.value)}
                placeholder="Give preset a name..."
                className="w-full bg-slate-950 text-slate-200 border border-slate-900 rounded-lg p-1.5 text-[10px] font-mono focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleSavePhrase}
                className="w-full py-1.5 px-3 bg-indigo-900/20 hover:bg-indigo-900/40 border border-indigo-500/20 text-indigo-300 font-mono text-[9px] uppercase tracking-wide rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-all"
              >
                <Save size={11} />
                Save to Soundboard
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Spoken phrase telemetry track */}
      <div className="mt-4 bg-[#010204] border border-cyan-950/60 rounded-xl p-2.5">
        <span className="text-[8.5px] font-mono tracking-wider text-slate-500 uppercase flex items-center gap-1.5 border-b border-slate-950 pb-1 mb-2 font-bold">
          <Terminal size={10} className="text-cyan-500" /> Phonetic Vocalization Telemetry Stream
        </span>
        
        <div className="font-mono text-[8px] text-cyan-400/80 space-y-1 max-h-20 overflow-y-auto custom-scrollbar">
          {vocalLogs.map((log, idx) => (
            <div key={idx} className="leading-relaxed pl-1.5 border-l border-cyan-950">
              {log}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
