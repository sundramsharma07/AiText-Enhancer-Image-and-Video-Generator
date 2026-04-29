import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  PenTool, 
  Zap, 
  Layers, 
  ArrowRight, 
  CheckCircle2,
  Star,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Wand2,
  ImageIcon,
  Music,
  BookOpen,
  Mic,
  MicOff,
  StopCircle
} from 'lucide-react';

const FloatingElement = ({ children, delay = 0, x = 0, y = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ 
      opacity: [0.4, 0.7, 0.4], 
      y: [y, y - 15, y],
      x: [x, x + 5, x]
    }}
    transition={{ 
      opacity: { duration: 4, repeat: Infinity, ease: "easeInOut", delay },
      y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay },
      x: { duration: 6, repeat: Infinity, ease: "easeInOut", delay }
    }}
    className="absolute pointer-events-none"
    style={{ left: `${50 + x}%`, top: `${45 + y}%` }}
  >
    {children}
  </motion.div>
);

const AnimatedText = ({ text, className }) => {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="inline-block mr-3"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

const FEATURE_HIGHLIGHTS = [
  { icon: Wand2, label: 'AI Text Enhancer', color: '#8b5cf6', desc: 'Transform handwriting into polished prose' },
  { icon: ImageIcon, label: 'Image Generator', color: '#ec4899', desc: 'Create stunning visuals from words' },
  { icon: BookOpen, label: 'Poetry Studio', color: '#2dd4bf', desc: 'Bilingual verse in English & Hindi' },
  { icon: Music, label: 'Creator Lab', color: '#f59e0b', desc: 'Video, audio & greeting cards' },
];

const DEMO_STEPS = [
  { feature: 'AI Text Enhancer', emoji: '✍️', color: '#8b5cf6', icon: Wand2,
    prompt: 'my messy notes on climate change need polishing...',
    thinking: 'Enhancing your text...',
    output: 'Climate change is one of the most urgent crises of our generation, demanding immediate global cooperation and bold innovation.',
    voice: "Wow! Let's use this AI Text Enhancer to magically fix my messy notes!!" },
  { feature: 'Poetry Studio', emoji: '🎭', color: '#2dd4bf', icon: BookOpen,
    prompt: 'rain, nostalgia, old home — in Hindi...',
    thinking: 'Composing bilingual verse...',
    output: 'बारिश की बूँदें यादें जगाती हैं, पुराने घर की खुशबू आती है... / Rain drops awaken memories, scent of the old home lingers.',
    voice: "Yay! Next, let's write a beautiful, amazing poem in the Poetry Studio!!" },
  { feature: 'Image Generator', emoji: '🖼️', color: '#ec4899', icon: ImageIcon,
    prompt: 'a child painting under a rainbow sky...',
    thinking: 'Synthesizing 8K artwork...',
    output: '✨ Stunning AI artwork created! Your image is ready to download and share.',
    voice: "So cool! Now, I'll generate an awesome picture using the Image Generator!!" },
  { feature: 'Artisan Cards', emoji: '🎴', color: '#f59e0b', icon: Music,
    prompt: 'birthday card for grandma with flowers...',
    thinking: 'Crafting premium card design...',
    output: '💌 A beautiful personalized birthday card has been crafted with love and care!',
    voice: "And finally! We can make the cutest personalized greeting cards in the Creator Lab!!" },
];

export default function Landing() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const audioRef = useRef(null);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isNarrating, setIsNarrating] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [demoPhase, setDemoPhase] = useState(0); // 0=moving/clicking 1=typing 2=thinking 3=output
  const [audioError, setAudioError] = useState(''); // NEW: Track audio errors for debugging
  const utteranceRef = useRef(null); // Prevent garbage collection of utterance in Chrome

  // Continuous Typewriter demo cycle
  useEffect(() => {
    const timers = [
      setTimeout(() => setDemoPhase(1), 1500), // after 1.5s moving to menu & click, start typing
      setTimeout(() => setDemoPhase(2), 3500), // +2s typing -> thinking
      setTimeout(() => setDemoPhase(3), 5000), // +1.5s thinking -> output
      setTimeout(() => { setDemoStep(p => (p + 1) % DEMO_STEPS.length); setDemoPhase(0); setActiveFeature((activeFeature + 1) % FEATURE_HIGHLIGHTS.length); }, 8500), // loop
    ];
    return () => timers.forEach(clearTimeout);
  }, [demoStep, activeFeature]);

  // Handle speech narration
  useEffect(() => {
    if (!isMuted && window.speechSynthesis) {
      // Intentionally avoiding cancel() here, as calling it synchronously before speak() 
      // throws an 'interrupted' error and can silently kill the next utterance on Windows Chrome.
      
      const u = new SpeechSynthesisUtterance(DEMO_STEPS[demoStep].voice);
      
      // Strict Local-Only Voice Selection to bypass Tracking Prevention
      const pickVoice = () => {
        const voices = speechSynthesis.getVoices();
        // Only use voices that are installed locally on the OS, so no network requests are blocked
        const localVoices = voices.filter(v => v.localService === true);
        
        // Try local Indian Female
        let v = localVoices.find(v => v.lang.includes('IN') && !/male|ravi/i.test(v.name));
        // Fallback to local default Female
        if (!v) v = localVoices.find(v => /female|zira|samantha/i.test(v.name));
        // Fallback to absolute first local voice available
        if (!v && localVoices.length > 0) v = localVoices[0];
        
        if (v) u.voice = v;
      };
      
      speechSynthesis.getVoices().length ? pickVoice() : (speechSynthesis.onvoiceschanged = pickVoice);
      
      u.pitch = 1.8; // Higher pitch for enthusiastic child-like voice
      u.rate = 1.15; // Faster for excitement
      u.volume = 0.9;
      u.onend = () => setIsNarrating(false);
      u.onstart = () => setIsNarrating(true);
      u.onerror = (e) => {
        // 'interrupted' is a normal browser event when cancel() is called. Ignore it!
        if (e.error === 'interrupted') return; 
        
        console.error("Speech Synthesis Error:", e);
        setAudioError(`TTS Error: ${e.error}`);
      };
      
      utteranceRef.current = u; // Keep reference to prevent Chrome garbage collection
      
      // Speak immediately without timeout to avoid async autoplay blocking
      speechSynthesis.speak(u);
    } else {
      window.speechSynthesis?.cancel();
      setIsNarrating(false);
    }
  }, [demoStep, isMuted]);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setAudioError(''); // Clear previous errors
    
    if (!nextMuted) {
      // Unmuting: Must happen synchronously in the click handler to satisfy browser autoplay rules
      if (audioRef.current) {
        audioRef.current.volume = 0.05;
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Background music blocked by browser:", error);
            setAudioError(`Music Error: ${error.message}`);
          });
        }
      }
      if (window.speechSynthesis) {
        try {
          const silentU = new SpeechSynthesisUtterance('');
          silentU.volume = 0;
          window.speechSynthesis.speak(silentU);
        } catch (e) {
          console.error("Speech unlock failed:", e);
          setAudioError(`Speech Unlock Error: ${e.message}`);
        }
      }
    } else {
      // Muting
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
    
    setIsMuted(nextMuted);
  };

  const features = [
    { 
      icon: <Zap className="w-6 h-6" />, 
      title: "Real-time OCR", 
      desc: "Powered by Pollinations AI Vision for human-like extraction of messy handwriting.",
      color: "from-violet-500/20 to-purple-500/20"
    },
    { 
      icon: <PenTool className="w-6 h-6" />, 
      title: "Artistic Enhancement", 
      desc: "Transform rough notes into polished prose while maintaining your creative essence.",
      color: "from-pink-500/20 to-rose-500/20"
    },
    { 
      icon: <Layers className="w-6 h-6" />, 
      title: "Smart Logic", 
      desc: "Automatically detects intent and applies the requested tone with precision.",
      color: "from-teal-500/20 to-emerald-500/20"
    },
    { 
      icon: <Star className="w-6 h-6" />, 
      title: "Premium Output", 
      desc: "Get publication-ready text instantly, ready for sharing or professional use.",
      color: "from-amber-500/20 to-orange-500/20"
    }
  ];

  return (
    <div className="relative min-h-screen bg-app-bg text-textMain overflow-hidden selection:bg-primary/30">
      {/* Decorative Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <FloatingElement delay={0} x={-40} y={-30}>
           <div className="w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        </FloatingElement>
        <FloatingElement delay={2} x={30} y={20}>
           <div className="w-80 h-80 bg-secondary/10 rounded-full blur-[100px]" />
        </FloatingElement>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-44 pb-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[10px] font-bold tracking-[0.3em] text-primary uppercase mb-8 backdrop-blur-md"
          >
            <Sparkles size={12} className="inline mr-2" /> The Future of Handwriting
          </motion.div>
          
          <h1 className="text-7xl md:text-[120px] font-serif font-black leading-[0.8] tracking-tighter mb-12">
            <AnimatedText text="Digitize your" className="block text-white" />
            <AnimatedText text="Creative Soul." className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent" />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-xl md:text-2xl text-textMuted max-w-3xl mx-auto mb-16 font-light leading-relaxed"
          >
            Bridge the gap between tactile inspiration and professional precision. 
            A studio where messy ink becomes <span className="text-white font-medium">masterpiece digital prose.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            <Link to="/enhancer" className="btn-premium text-xl px-16 py-5 rounded-2xl shadow-[0_20px_50px_rgba(139,92,246,0.2)]">
              Open Studio <ArrowRight size={20} />
            </Link>
            <button 
              onClick={() => document.getElementById('features-anchor').scrollIntoView({ behavior: 'smooth' })}
              className="px-12 py-5 rounded-2xl border border-white/10 glass-card hover:bg-white/[0.05] transition-all font-bold text-lg"
            >
              Explore Features
            </button>
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURE SHOWCASE INTERACTIVE DEMO SECTION ===== */}
      <section className="relative z-10 py-20 px-6">
        {/* Hidden background music */}
        <audio ref={audioRef} loop preload="none">
          {/* Using a locally hosted audio file to bypass Tracking Prevention completely */}
          <source src="/bg-music.mp3" type="audio/mpeg" />
        </audio>

        <div className="max-w-7xl mx-auto">
          {/* Debug Audio Error Banner */}
          {audioError && (
            <div className="bg-red-500 text-white font-bold p-4 rounded-xl mb-4 text-center">
              ⚠️ {audioError}
            </div>
          )}
          
          {/* Section Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-3 text-primary text-xs font-black uppercase tracking-[0.4em] mb-6">
              <div className="w-12 h-px bg-primary/30" /> See It In Action <div className="w-12 h-px bg-primary/30" />
            </div>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight">
              Everything you need,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">all in one studio.</span>
            </h2>
            <p className="text-textMuted text-lg mt-6 max-w-2xl mx-auto">
              Watch how PEN AI transforms your creative workflow — from raw handwriting to publication-ready content in seconds.
            </p>
          </motion.div>

          {/* Interactive Demo Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative rounded-[40px] overflow-hidden border border-white/[0.08] shadow-[0_40px_120px_rgba(139,92,246,0.15)]"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary/10 to-accent/20 blur-2xl -z-10 rounded-[44px]" />

            {/* Main demo area */}
            <div className="relative w-full min-h-[500px] md:h-[600px] bg-gradient-to-br from-slate-100 via-white to-purple-50 overflow-hidden flex flex-col md:flex-row">

              {/* Soft colour blobs */}
              <div className="absolute top-0 left-0 w-72 h-72 bg-purple-200/40 rounded-full blur-[80px]" />
              <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-200/40 rounded-full blur-[80px]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-teal-200/30 rounded-full blur-[60px]" />

              {/* Feature pills — left side (Hidden on very small mobile, visible on tablet/desktop) */}
              <div className="hidden md:flex w-[35%] flex-col p-8 border-r border-gray-100 bg-white/50 backdrop-blur-sm z-20 space-y-4">
                {FEATURE_HIGHLIGHTS.map((feat, i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: activeFeature === i ? 1 : 0.3, x: activeFeature === i ? 0 : -8, scale: activeFeature === i ? 1 : 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-sm border"
                    style={{ background: activeFeature === i ? `${feat.color}18` : 'rgba(255,255,255,0.6)', borderColor: activeFeature === i ? `${feat.color}50` : 'rgba(0,0,0,0.08)' }}
                  >
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${feat.color}20` }}>
                      <feat.icon size={12} style={{ color: feat.color }} />
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-[10px] font-bold leading-none" style={{ color: activeFeature === i ? feat.color : '#64748b' }}>{feat.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Centre: App window typewriter demo */}
              <div className="flex-1 flex items-center justify-center relative p-4 pb-24 md:p-8 overflow-hidden z-10">
                
                {/* Cartoon Girl Avatar / Cursor */}
                <motion.div
                  className="absolute z-50 pointer-events-none flex flex-col items-center"
                  animate={{
                    // On mobile, stay center-top. On desktop, move to menu.
                    x: typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : (demoPhase === 0 ? -240 : -80),
                    y: typeof window !== 'undefined' && window.innerWidth < 768 ? -130 : (demoPhase === 0 ? (demoStep * 50) - 80 : 20),
                    scale: demoPhase === 0 ? [1, 0.9, 1] : 1, // click bounce effect
                  }}
                  transition={{
                    x: { type: "spring", stiffness: 100, damping: 20 },
                    y: { type: "spring", stiffness: 100, damping: 20 },
                    scale: { delay: 1, duration: 0.3 } // bounce exactly when arriving at menu
                  }}
                >
                  {/* Speech Bubble */}
                  <AnimatePresence>
                    {!isMuted && isNarrating && demoPhase > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="mb-3 bg-white px-4 py-3 rounded-3xl rounded-br-none shadow-2xl border border-purple-100 w-56 text-center relative"
                      >
                        {/* Little tail for the speech bubble */}
                        <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white border-b border-r border-purple-100 transform rotate-45" />
                        <p className="text-xs font-bold text-purple-700 leading-snug">
                          {DEMO_STEPS[demoStep].voice}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Avatar Image container with pulsing effects */}
                  <div className="relative">
                    {/* Pulsing ring when speaking */}
                    {!isMuted && isNarrating && (
                      <motion.div 
                        className="absolute -inset-3 rounded-full bg-purple-400/30"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                    
                    {/* Floating sparkles when speaking */}
                    {!isMuted && isNarrating && (
                      <motion.div 
                        className="absolute -top-4 -right-4 text-yellow-400"
                        animate={{ y: [0, -10, 0], opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Sparkles size={16} />
                      </motion.div>
                    )}

                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-tr from-purple-200 to-pink-100 border-4 border-white shadow-[0_10px_30px_rgba(139,92,246,0.3)] overflow-hidden shrink-0 relative z-10">
                      <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Lily&backgroundColor=transparent&hair=long16&hairColor=ffdfbf&eyes=variant12&mouth=variant04" alt="Cartoon Girl" className="w-full h-full object-cover transform scale-110 mt-2" />
                    </div>
                  </div>
                </motion.div>

                <div className="w-[95%] sm:w-[80%] max-w-md mt-24 md:mt-0 relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={demoStep}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.4 }}
                    >
                    {/* Window chrome */}
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                      <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                        <div className="flex-1 flex justify-center">
                          <div className="px-3 py-0.5 bg-white rounded-full border border-gray-200 text-[9px] text-gray-400 font-bold tracking-wide">
                            {DEMO_STEPS[demoStep].emoji} PEN AI — {DEMO_STEPS[demoStep].feature}
                          </div>
                        </div>
                      </div>
                      <div className="p-4 space-y-3 bg-gradient-to-b from-white to-gray-50">
                        {/* Input */}
                        <div>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Your Input</p>
                          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-600 min-h-[36px]">
                            {demoPhase >= 1 ? DEMO_STEPS[demoStep].prompt : ''}
                            {demoPhase === 1 && <span className="inline-block w-0.5 h-3.5 bg-purple-500 ml-0.5 animate-pulse align-middle" />}
                          </div>
                        </div>
                        {/* Output */}
                        {demoPhase >= 2 && (
                          <div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">✨ AI Output</p>
                            {demoPhase === 2 ? (
                              <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: `${DEMO_STEPS[demoStep].color}12`, border: `1px solid ${DEMO_STEPS[demoStep].color}25` }}>
                                <div className="flex gap-1">
                                  {[0,1,2].map(i => (
                                    <motion.div key={i} className="w-1.5 h-1.5 rounded-full"
                                      style={{ backgroundColor: DEMO_STEPS[demoStep].color }}
                                      animate={{ scale: [1,1.6,1], opacity: [0.4,1,0.4] }}
                                      transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.2 }}
                                    />
                                  ))}
                                </div>
                                <span className="text-[11px] font-semibold" style={{ color: DEMO_STEPS[demoStep].color }}>{DEMO_STEPS[demoStep].thinking}</span>
                              </div>
                            ) : (
                              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                                className="p-3 rounded-xl text-xs leading-relaxed text-gray-700"
                                style={{ background: `${DEMO_STEPS[demoStep].color}10`, border: `1px solid ${DEMO_STEPS[demoStep].color}20` }}
                              >
                                {DEMO_STEPS[demoStep].output}
                              </motion.div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right: stats */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 hidden sm:flex z-10">
                {[{ val: '10x', label: 'Faster' }, { val: '4+', label: 'Studios' }, { val: '∞', label: 'Ideas' }].map((s, i) => (
                  <div key={i} className="text-center bg-white/80 backdrop-blur-sm rounded-2xl px-3 py-2 border border-gray-100 shadow-sm">
                    <p className="font-black text-lg leading-none" style={{ color: '#8b5cf6' }}>{s.val}</p>
                    <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom: audio controls (Simplified to just the mute button on the right) */}
            <div className="absolute bottom-0 left-0 right-0 px-4 md:px-6 py-4 flex items-center justify-end bg-gradient-to-t from-white/90 to-white/0 backdrop-blur-[2px] z-50">
              <div className="flex items-center gap-3">
                  {isMuted && (
                     <motion.div 
                       initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                       className="text-[10px] font-bold text-purple-600 bg-purple-100 px-3 py-1.5 rounded-full"
                     >
                       Tap to hear AI 🎙️
                     </motion.div>
                  )}
                  
                  <motion.button
                    onClick={toggleMute}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs font-bold shadow-[0_10px_20px_rgba(139,92,246,0.3)] transition-all"
                    style={{ background: isMuted ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' : '#ef4444' }}
                  >
                    {isMuted ? (
                      <>
                        <Volume2 size={16} /> Unmute Experience
                      </>
                    ) : (
                      <>
                        <VolumeX size={16} /> Mute
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature pills row below demo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
          >
            {FEATURE_HIGHLIGHTS.map((feat, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-5 flex items-center gap-4 border-white/[0.05] hover:border-white/10 transition-all group cursor-default"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all group-hover:scale-110 duration-300"
                  style={{ background: `${feat.color}22`, border: `1px solid ${feat.color}33` }}
                >
                  <feat.icon size={18} style={{ color: feat.color }} />
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-tight">{feat.label}</p>
                  <p className="text-textMuted text-[10px] mt-0.5 leading-tight hidden sm:block">{feat.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
      {/* ===== END FEATURE SHOWCASE INTERACTIVE DEMO SECTION ===== */}



      {/* Scrolling Product Showcase Section (Description Left, Image Right) */}
      <section className="relative z-10 py-40 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-3 text-accent text-xs font-black uppercase tracking-[0.4em]">
              <div className="w-12 h-px bg-accent/30" /> Tactical Precision
            </div>
            <h2 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight">
              A Studio for the <span className="italic text-primary">Modern Scribe.</span>
            </h2>
            <p className="text-lg text-textMuted leading-relaxed">
              Experience the ritual of handwriting without the limitations of paper. Our AI engine extracts every nuance of your stroke, converting messy notes into structured digital brilliance instantly.
            </p>
            <div className="flex flex-col gap-6">
              {[
                { title: "Neural OCR", desc: "Advanced vision models that read what others can't." },
                { title: "Semantic Polish", desc: "Natural language refinement that preserves your voice." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 mt-1">
                    <CheckCircle2 size={14} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">{item.title}</h4>
                    <p className="text-sm text-textMuted">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-transparent blur-3xl -z-10" />
            <div className="glass-panel p-3 rounded-[40px] overflow-hidden rotate-2 hover:rotate-0 transition-transform duration-700">
               <img src="/workspace.png" alt="Workspace" className="w-full rounded-[32px] shadow-2xl h-[500px] object-cover" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Scrolling Generator Showcase Section (Image Left, Description Right) */}
      <section className="relative z-10 py-40 px-6 bg-white/[0.01]">
        <div id="features-anchor" className="absolute -top-20" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:order-1 order-2"
          >
            <div className="glass-panel p-3 rounded-[40px] overflow-hidden -rotate-2 hover:rotate-0 transition-transform duration-700">
               <img src="/ai-generator.png" alt="AI Generator" className="w-full rounded-[32px] shadow-2xl h-[500px] object-contain bg-black/40" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8 lg:order-2 order-1"
          >
            <div className="inline-flex items-center gap-3 text-secondary text-xs font-black uppercase tracking-[0.4em]">
              <div className="w-12 h-px bg-secondary/30" /> Infinite Creation
            </div>
            <h2 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight">
              Beyond the <span className="italic text-secondary">Canvas.</span>
            </h2>
            <p className="text-lg text-textMuted leading-relaxed">
              Our Creative Lab isn't just for text. Synthesize stunning visual assets, cinematic motion, and atmospheric audio from simple natural language prompts.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div className="glass-card p-6 rounded-2xl border-white/[0.05]">
                <h4 className="text-white font-bold h-12 flex items-center">8K Synthesis</h4>
                <div className="h-0.5 w-full bg-white/5 my-4" />
                <p className="text-[10px] text-textMuted leading-relaxed uppercase tracking-tighter">Hyper-realistic output for creators.</p>
              </div>
              <div className="glass-card p-6 rounded-2xl border-white/[0.05]">
                <h4 className="text-white font-bold h-12 flex items-center">Temporal Flow</h4>
                <div className="h-0.5 w-full bg-white/5 my-4" />
                <p className="text-[10px] text-textMuted leading-relaxed uppercase tracking-tighter">Cinematic video synthesis at your fingertips.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="relative z-10 py-40 px-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-24">
          <div className="flex flex-col md:flex-row gap-12 items-end">
            <div className="flex-1">
              <h2 className="text-5xl md:text-8xl font-serif font-bold tracking-tighter mb-8 leading-none">The Studio <br/>Protocol.</h2>
              <div className="h-1.5 w-32 bg-gradient-to-r from-primary to-transparent rounded-full" />
            </div>
            <p className="flex-1 text-textMuted text-xl font-light leading-relaxed">
              We've architected a workspace that respects the tactile nature of handwriting while providing the surgical precision of modern AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-12 rounded-[48px] group hover:bg-white/[0.05] transition-all cursor-default border-white/[0.03]"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-10 border border-white/10 group-hover:scale-110 transition-transform duration-500 shadow-xl`}>
                  {f.icon}
                </div>
                <h3 className="text-2xl font-bold mb-6 tracking-tight">{f.title}</h3>
                <p className="text-textMuted text-sm leading-relaxed font-medium">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 pt-32 pb-12 px-6 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
            <div>
              <div className="flex items-center gap-2 mb-8">
                 <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                   <Sparkles size={16} />
                 </div>
                 <span className="text-xl font-bold tracking-tighter">PEN AI</span>
              </div>
              <p className="text-textMuted max-w-xs text-sm leading-relaxed">
                Empowering writers to digitize their souls through the lens of artificial intelligence.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
               <div>
                  <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-widest">Studio</h4>
                  <ul className="space-y-4 text-sm text-textMuted">
                     <li><Link to="/enhancer" className="hover:text-primary transition-colors">Start Writing</Link></li>
                     <li><a href="#" className="hover:text-primary transition-colors">Showcase</a></li>
                  </ul>
               </div>
               <div>
                  <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-widest">Connect</h4>
                  <ul className="space-y-4 text-sm text-textMuted">
                     <li><a href="https://github.com/sundramsharma07" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">GitHub</a></li>
                     <li><a href="https://www.linkedin.com/in/sundaram-sharma-108a1b297/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">LinkedIn</a></li>
                  </ul>
               </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase font-bold tracking-widest text-textMuted">
             <p>© 2026 PEN AI STUDIO. ALL RIGHTS RESERVED.</p>
             <div className="flex gap-8">
                <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
