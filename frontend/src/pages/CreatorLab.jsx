import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wand2, 
  Image as ImageIcon, 
  Film, 
  Download, 
  Share2, 
  Sparkles, 
  Zap,
  Search,
  ChevronRight,
  Monitor,
  Volume2,
  Music,
  AlertCircle,
  UploadCloud
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { publishShowcasePost, urlToBlob } from '../utils/showcase';
import { saveGenerationHistory } from '../utils/history';

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

const StatusBadge = ({ type }) => {
  const config = {
    idle:       { label: "Ready",      color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    generating: { label: "Synthesizing", color: "bg-primary/20 text-primary border-primary/30" },
    done:       { label: "Generated",  color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
    error:      { label: "Failed",     color: "bg-rose-500/20 text-rose-400 border-rose-500/30" }
  };
  const { label, color } = config[type] || config.idle;
  return (
    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${color}`}>
      {label}
    </div>
  );
};

function getPanelKey(status, resultUrl) {
  if (status === 'idle')                      return 'idle';
  if (status === 'generating')                return 'loading';
  if (status === 'error')                     return 'error';
  if (status === 'done' && resultUrl)         return 'result';
  return 'idle';
}

export default function CreatorLab() {
  const { token } = useAuth();
  const [prompt, setPrompt]       = useState('');
  const [type, setType]           = useState('image'); // "image" | "video" | "audio"
  const [status, setStatus]       = useState('idle');
  const [resultUrl, setResultUrl] = useState('');
  const [errorMsg, setErrorMsg]   = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const abortRef = useRef(null);

  // Clean up blob URLs on unmount / before next generation
  useEffect(() => {
    return () => {
      if (resultUrl && resultUrl.startsWith('blob:')) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

  const handleGenerate = async () => {
    if (!prompt.trim() || status === 'generating') return;

    // Cancel any in-flight request
    if (abortRef.current) abortRef.current.abort();
    if (resultUrl && resultUrl.startsWith('blob:')) URL.revokeObjectURL(resultUrl);

    setStatus('generating');
    setResultUrl('');
    setErrorMsg('');

    const controller = new AbortController();
    abortRef.current = controller;

    const endpoint = type === 'audio'
      ? '/generate/audio'
      : type === 'video'
      ? '/generate/video'
      : '/generate/image';
    const body = type === 'image'
      ? { prompt, width: 1024, height: 1024 }
      : type === 'video'
      ? { prompt, width: 1024, height: 576, model: 'ltx-2' }
      : { prompt, voice: 'nova' };

    console.log(`[Studio Synthesis] POST ${API_BASE}${endpoint}`, body);

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!response.ok) {
        let msg = `Server error: ${response.status}`;
        try { const d = await response.json(); msg = d.error || msg; } catch(_) {}
        throw new Error(msg);
      }

      // Convert streamed binary → blob → object URL
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      console.log('[Studio Synthesis] Blob ready:', blob.type, blob.size, 'bytes');

      setResultUrl(objectUrl);
      setStatus('done');
      saveGenerationHistory({
        token,
        title: `Creator Lab ${type}`,
        originalText: prompt,
        enhancedText: `${type[0].toUpperCase()}${type.slice(1)} generated successfully.`,
        tone: 'Creator Lab'
      }).catch((error) => console.error('Creator Lab history save failed:', error));

    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('[Studio Synthesis] Request aborted by user.');
        return; // user switched type or navigated away — do not update state
      }
      console.error('[Studio Synthesis] Generation failed:', err.message);
      setErrorMsg(err.message);
      setStatus('error');
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const ext  = type === 'image' ? 'jpg' : type === 'video' ? 'mp4' : 'mp3';
    const link = document.createElement('a');
    link.href     = resultUrl;
    link.download = `Studio_Masterpiece_${Date.now()}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (!resultUrl) return;
    const message = `Created with PEN AI Creator Lab: ${prompt}`;
    try {
      if (navigator.share) await navigator.share({ title: 'PEN AI creation', text: message });
      else {
        await navigator.clipboard.writeText(message);
        alert('Creation details copied to your clipboard.');
      }
    } catch (error) {
      if (error.name !== 'AbortError') console.error('Share failed:', error);
    }
  };

  const handlePostToShowcase = async () => {
    if (!resultUrl) return;
    setIsPosting(true);
    try {
      const isImage = type === 'image';
      const imageBlob = isImage ? await urlToBlob(resultUrl) : undefined;
      await publishShowcasePost({
        token,
        title: prompt.slice(0, 80) || `Creator Lab ${type}`,
        description: isImage ? prompt : `${type[0].toUpperCase()}${type.slice(1)} created from: ${prompt}`,
        prompt,
        category: 'creator-lab',
        mediaType: isImage ? 'image' : 'text',
        imageBlob: isImage ? imageBlob : undefined
      });
      alert('Posted to the public showcase.');
    } catch (error) {
      alert(error.message);
    } finally {
      setIsPosting(false);
    }
  };

  const switchType = (t) => {
    if (abortRef.current) abortRef.current.abort();
    if (resultUrl && resultUrl.startsWith('blob:')) URL.revokeObjectURL(resultUrl);
    setType(t);
    setStatus('idle');
    setResultUrl('');
    setErrorMsg('');
  };

  const panelKey = getPanelKey(status, resultUrl);

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 bg-app-bg text-textMain relative overflow-hidden">
      <div className="noise-overlay" />
      <div className="premium-blur" />

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-10">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <StatusBadge type={status} />
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <div className="flex items-center gap-1.5 text-primary text-[10px] font-bold uppercase tracking-[0.2em]">
                <Zap size={12} fill="currentColor" /> Multi-Modal Neural Suite
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter">Creator Lab</h1>
            <p className="text-textMuted text-sm mt-2 max-w-lg">
              Synthesize static vision, complex motion, and atmospheric audio from your imagination.
            </p>
          </div>

          {/* Discovery Cards */}
          <div className="hidden lg:flex flex-col gap-3">
             <div className="glass-panel px-6 py-4 rounded-2xl border-white/[0.05] bg-white/[0.01] max-w-sm group hover:bg-white/[0.03] transition-all cursor-help">
                <div>
                   <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Concept Art</p>
                   <p className="text-[11px] text-textMuted leading-tight italic">"A cyberpunk city at night with neon lights reflecting in the rain."</p>
                </div>
             </div>
             <div className="glass-panel px-6 py-4 rounded-2xl border-white/[0.05] bg-white/[0.01] max-w-sm group hover:bg-white/[0.03] transition-all cursor-help">
                <div>
                   <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">Atmosphere</p>
                   <p className="text-[11px] text-textMuted leading-tight italic">"An ancient mystical forest covered in thick fog during sunrise."</p>
                </div>
             </div>
          </div>

          {/* Type switcher */}
          <div className="flex p-1.5 bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-x-auto w-full md:w-auto scrollbar-hide">
            {[
              { id: 'image', icon: <ImageIcon size={16} />, label: 'Vision' },
              { id: 'video', icon: <Film size={16} />,      label: 'Motion' },
              { id: 'audio', icon: <Volume2 size={16} />,   label: 'Acoustic' },
            ].map(({ id, icon, label }) => (
              <button
                key={id}
                onClick={() => switchType(id)}
                className={`flex items-center gap-3 px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                  type === id ? 'bg-primary text-white shadow-lg' : 'text-textMuted hover:text-white'
                }`}
              >
                {icon} {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Workspace Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Controls Panel */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="glass-panel rounded-[32px] p-6 sm:p-8 border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Wand2 size={60} />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6 text-[10px] font-bold uppercase tracking-widest text-primary">
                  <Sparkles size={14} /> Semantic Instruction
                </div>

                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) handleGenerate(); }}
                  placeholder={
                    type === 'image' ? 'Describe a masterpiece...' :
                    type === 'video' ? 'Describe a cinematic sequence...' :
                                      'Describe an atmospheric soundscape...'
                  }
                  className="w-full bg-white border border-[#e3e6f3] rounded-2xl p-6 min-h-[180px] text-textMain outline-none focus:border-primary/50 transition-all resize-none text-base font-medium placeholder:text-textMuted/60 shadow-sm"
                />

                <div className="mt-8 flex flex-col gap-4">
                  <button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || status === 'generating'}
                    className="w-full btn-premium py-5 text-lg font-bold shadow-2xl flex items-center justify-center gap-3 disabled:opacity-30 group"
                  >
                    {status === 'generating' ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        <span>Synthesizing...</span>
                      </div>
                    ) : (
                      <>
                        Initiate {type === 'image' ? 'Vision' : type === 'video' ? 'Motion' : 'Acoustic'}
                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-4 text-[10px] font-medium text-textMuted/50 uppercase tracking-[0.2em] justify-center">
                    <Monitor size={12} /> GPU Accelerated Synthesis · Ctrl+Enter to generate
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="px-8 flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center text-primary shrink-0">
                  <Search size={14} />
                </div>
                <p className="text-xs text-textMuted leading-relaxed pt-1 flex-1">
                  Be specific about lighting, mood, and style (e.g., "Cyberpunk", "Cinematic", "4K", "Neon").
                </p>
              </div>
            </div>
          </div>

          {/* ── Result Canvas ── */}
          <div className="lg:col-span-7 h-full min-h-[400px] sm:min-h-[650px]">
            <div className="glass-panel w-full h-full rounded-[48px] border-white/5 relative overflow-hidden flex flex-col shadow-2xl">

              {/* Canvas Header */}
              <div className="px-6 sm:px-10 py-5 sm:py-6 border-b border-white/[0.05] flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-primary shadow-sm hover:scale-105 transition-transform">
                    {type === 'image' ? <ImageIcon size={20} /> : type === 'video' ? <Film size={20} /> : <Volume2 size={20} />}
                  </div>
                  <div>
                    <span className="font-serif font-bold text-xl block">Studio Canvas</span>
                    <span className="text-[10px] uppercase tracking-widest text-textMuted font-bold">{type} mode</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDownload}
                    disabled={status !== 'done' || !resultUrl}
                    className="w-12 h-12 rounded-xl border border-[#e3e6f3] bg-white hover:bg-[#f3f5ff] flex items-center justify-center text-textMuted hover:text-textMain transition-all disabled:opacity-20"
                    title="Download Media"
                  >
                    <Download size={20} />
                  </button>
                  <button
                    onClick={handleShare}
                    disabled={status !== 'done' || !resultUrl}
                    className="w-12 h-12 rounded-xl border border-[#e3e6f3] bg-white hover:bg-[#f3f5ff] flex items-center justify-center text-textMuted hover:text-textMain transition-all disabled:opacity-20"
                    title="Share Creation"
                  >
                    <Share2 size={20} />
                  </button>
                  <button
                    onClick={handlePostToShowcase}
                    disabled={status !== 'done' || !resultUrl || isPosting}
                    className="flex h-12 items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 text-[10px] font-bold uppercase tracking-widest text-primary transition-all hover:bg-primary hover:text-white disabled:opacity-30"
                    title="Publish this creation to Showcase"
                  >
                    <UploadCloud size={16} /> {isPosting ? 'Publishing' : 'Publish to Showcase'}
                  </button>
                </div>
              </div>

              {/* Main Preview Area — exactly ONE child inside AnimatePresence at all times */}
              <div className="flex-1 relative bg-black/20 flex items-center justify-center p-4 sm:p-8 min-h-[350px]">
                <AnimatePresence mode="wait">

                  {panelKey === 'idle' && (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="text-center"
                    >
                      <div className="w-20 h-20 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center mx-auto mb-6">
                        <Wand2 size={40} className="text-white/10" />
                      </div>
                      <p className="text-xl font-serif text-textMuted italic">Your imagination is the only filter.</p>
                    </motion.div>
                  )}

                  {panelKey === 'loading' && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-6"
                    >
                      <div className="relative">
                        <div className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Sparkles size={28} className="text-primary animate-pulse" />
                        </div>
                        <div className="absolute -inset-4 border border-primary/10 rounded-full animate-ping opacity-20" />
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-serif font-bold mb-1">Synthesizing Artifact</p>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-primary/60 font-bold">Neural Pulse Active</p>
                        <motion.p
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 8 }}
                          className="text-[9px] text-textMuted mt-4 italic"
                        >
                          Complex scene detected. Optimizing render path...
                        </motion.p>
                        <motion.div
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 20 }}
                          className="mt-6 flex flex-col gap-2"
                        >
                          <button
                            onClick={() => { if (abortRef.current) abortRef.current.abort(); setStatus('error'); setErrorMsg('Generation cancelled by user.'); }}
                            className="text-[9px] font-bold text-rose-400/60 hover:text-rose-400 uppercase tracking-widest transition-colors"
                          >
                            Cancel Generation
                          </button>
                          <p className="text-[8px] text-textMuted/40">Large images may take up to 90 seconds.</p>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}

                  {panelKey === 'error' && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center text-center px-6 gap-4"
                    >
                      <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20">
                        <AlertCircle size={32} />
                      </div>
                      <h3 className="text-2xl font-serif font-bold text-white">Synthesis Failed</h3>
                      {errorMsg && (
                        <p className="text-rose-400/80 text-xs font-mono bg-rose-500/5 border border-rose-500/10 rounded-xl px-4 py-2 max-w-sm break-all">
                          {errorMsg}
                        </p>
                      )}
                      <button
                        onClick={handleGenerate}
                        disabled={!prompt.trim()}
                        className="mt-2 px-6 py-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white transition-all disabled:opacity-30"
                      >
                        Retry Synthesis
                      </button>
                    </motion.div>
                  )}

                  {panelKey === 'result' && (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                      className="w-full h-full flex items-center justify-center group"
                    >
                      {type === 'image' ? (
                        <div className="relative w-full h-full max-h-[580px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group bg-black/40">
                          <img
                            src={resultUrl}
                            alt="AI Generated Vision"
                            className="w-full h-full object-contain"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                            <p className="text-sm text-white/90 italic font-medium bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl">"{prompt}"</p>
                          </div>
                        </div>
                      ) : type === 'video' ? (
                        <div className="relative w-full h-full max-h-[580px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black/40">
                          <video src={resultUrl} controls autoPlay loop className="w-full h-full object-contain" />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-8 w-full max-w-md p-10 glass-panel rounded-[32px] border-white/10 shadow-2xl">
                          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary animate-pulse">
                            <Music size={32} />
                          </div>
                          <div className="w-full">
                            <audio src={resultUrl} controls className="w-full" />
                          </div>
                          <p className="text-xs text-textMuted text-center font-medium leading-relaxed">
                            Neural audio synthesized with high-fidelity semantic parsing.
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

              {/* Status Footer */}
              <div className="px-6 sm:px-10 py-4 sm:py-5 bg-white/[0.02] border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.3em] text-textMuted/40">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500/40 animate-pulse" />
                  Neural Engine: Pollinations Flux · Secure Proxy
                </div>
                <span>Ref: LAB-779-SYN</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
