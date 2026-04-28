import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, 
  Copy, 
  Download, 
  Check, 
  Star, 
  Sparkles, 
  FileText, 
  RefreshCcw,
  Zap,
  Image as ImageIcon,
  ChevronRight,
  Trash2,
  Share2,
  Type,
  Volume2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TypewriterText = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(intervalId);
    }, 10);
    return () => clearInterval(intervalId);
  }, [text]);

  return <span className="leading-relaxed whitespace-pre-wrap">{displayedText}</span>;
};

const StatusPill = ({ status }) => {
  const config = {
    idle: { label: "Ready", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
    scanning: { label: "Analyzing", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    enhancing: { label: "Refining", color: "bg-primary/20 text-primary border-primary/30" },
    done: { label: "Complete", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
    error: { label: "Error", color: "bg-rose-500/20 text-rose-400 border-rose-500/30" }
  };

  const { label, color } = config[status] || config.idle;

  return (
    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${color}`}>
       {label}
    </div>
  );
};

export default function Enhancer() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [rawTextInput, setRawTextInput] = useState("");
  const [mode, setMode] = useState("image"); // "image" or "text"
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState("idle");
  const [originalText, setOriginalText] = useState("");
  const [enhancedText, setEnhancedText] = useState("");
  const [tone, setTone] = useState("Professional");
  const [currentFont, setCurrentFont] = useState("serif"); // serif, sans, script, mono
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef(null);
  const { token } = useAuth();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
       setSelectedImage(file);
       setPreviewUrl(URL.createObjectURL(file));
       setOriginalText("");
       setEnhancedText("");
       setStatus("idle");
       setMode("image");
    }
  };

  const handleProcess = async () => {
    if (mode === "image" && !selectedImage) return;
    if (mode === "text" && !rawTextInput.trim()) return;

    setStatus(mode === "image" ? "scanning" : "enhancing");
    setErrorMsg("");
    
    try {
      let response;
      if (mode === "image") {
        const formData = new FormData();
        formData.append('image', selectedImage);
        formData.append('tone', tone);
        
        response = await fetch(`${import.meta.env.VITE_API_URL}/api/process-image`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
      } else {
        response = await fetch(`${import.meta.env.VITE_API_URL}/api/enhance-text`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ text: rawTextInput, tone })
        });
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || "Processing failed");

      if (mode === "image") {
        setOriginalText(data.extractedText);
      } else {
        setOriginalText(rawTextInput);
      }
      
      setEnhancedText(data.enhancedText);
      setStatus("done");
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message);
      setStatus("error");
    }
  };

  const handleDownload = () => {
    if (!enhancedText) return;
    const element = document.createElement("a");
    const file = new Blob([
      `STUDIO ENHANCEMENT\n`,
      `TIMESTAMP: ${new Date().toLocaleString()}\n`,
      `TONE: ${tone}\n`,
      `------------------------------------------\n\n`,
      `ENHANCED TEXT:\n${enhancedText}`
    ], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Studio_Enhancement_${new Date().getTime()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShare = () => {
    if (!enhancedText) return;
    navigator.clipboard.writeText(enhancedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!enhancedText) return;
    window.speechSynthesis.cancel(); // Stop any current speech
    const utterance = new SpeechSynthesisUtterance(enhancedText);
    utterance.rate = 0.9; // Slightly slower for better clarity
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 bg-app-bg text-textMain relative overflow-hidden">
      <div className="noise-overlay" />
      <div className="premium-blur" />
      
      <div className="max-w-7xl mx-auto h-full flex flex-col gap-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
               <div className="flex items-center gap-3 mb-2">
                  <StatusPill status={status} />
                  <span className="text-white/20">/</span>
                  <div className="flex items-center gap-1 text-primary text-[10px] font-bold uppercase tracking-widest">
                     <Zap size={10} fill="currentColor" /> Powered by Pollinations AI
                  </div>
               </div>
               <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tighter">Studio Workspace</h1>
            </div>

            {/* Inspiration Cards */}
            <div className="hidden lg:flex items-center gap-4">
               <div className="glass-panel p-4 rounded-2xl border-white/[0.05] bg-white/[0.01] flex items-center gap-4 max-w-sm group hover:bg-white/[0.03] transition-all cursor-help">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                     <img src="https://pollinations.ai/p/handwritten%20journal%20page%20aesthetic?width=100&height=100&nologo=true" alt="Example" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">OCR Power</p>
                     <p className="text-[11px] text-textMuted leading-tight italic">"Convert messy journal notes into professional transcripts."</p>
                  </div>
               </div>
               <div className="glass-panel p-4 rounded-2xl border-white/[0.05] bg-white/[0.01] flex items-center gap-4 max-w-sm group hover:bg-white/[0.03] transition-all cursor-help">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                     <img src="https://pollinations.ai/p/elegant%20old%20letter%20aesthetic?width=100&height=100&nologo=true" alt="Example" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">Poetic Flow</p>
                     <p className="text-[11px] text-textMuted leading-tight italic">"Polish your drafts into poetic masterpieces in seconds."</p>
                  </div>
               </div>
            </div>

            <div className="flex flex-col items-end gap-3">
                {/* Mode Selector */}
                <div className="flex bg-white/[0.03] border border-white/[0.08] p-1 rounded-xl">
                   <button 
                    onClick={() => setMode("image")}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${mode === "image" ? "bg-white/[0.1] text-white" : "text-textMuted hover:text-white"}`}
                   >
                     <ImageIcon size={14} /> View mode
                   </button>
                   <button 
                    onClick={() => setMode("text")}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${mode === "text" ? "bg-white/[0.1] text-white" : "text-textMuted hover:text-white"}`}
                   >
                     <Type size={14} /> Text mode
                   </button>
                </div>

                <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] p-1.5 rounded-2xl">
                   {['Professional', 'Creative', 'Academic'].map(t => (
                     <button
                       key={t}
                       onClick={() => setTone(t)}
                       className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                         tone === t 
                           ? 'bg-primary text-white shadow-lg' 
                           : 'text-textMuted hover:text-white hover:bg-white/[0.03]'
                       }`}
                     >
                       {t}
                     </button>
                   ))}
                </div>
            </div>
        </div>

        {/* Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[650px]">
          
          {/* SOURCE PANEL */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <motion.div 
               whileHover={{ scale: 1.01 }}
               className={`glass-panel rounded-3xl p-8 flex flex-col items-center justify-center text-center relative group min-h-[400px] transition-all overflow-hidden ${
                 mode === "image" ? "cursor-pointer" : ""
               } ${
                 isDragging ? 'border-primary/50 ring-4 ring-primary/10' : ''
               }`}
               onDragOver={(e) => { e.preventDefault(); if(mode === "image") setIsDragging(true); }}
               onDragLeave={() => setIsDragging(false)}
               onDrop={(e) => {
                 if(mode !== "image") return;
                 e.preventDefault();
                 setIsDragging(false);
                 const file = e.dataTransfer.files[0];
                 if (file && file.type.startsWith('image/')) {
                   setSelectedImage(file);
                   setPreviewUrl(URL.createObjectURL(file));
                 }
               }}
               onClick={() => mode === "image" && fileInputRef.current?.click()}
            >
               {mode === "image" ? (
                 <>
                   <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                   <AnimatePresence mode="wait">
                     {previewUrl ? (
                       <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                         <img src={previewUrl} alt="Source" className="w-full h-full object-cover opacity-60" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                         <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-white text-black px-6 py-2 rounded-full font-bold shadow-2xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                               <RefreshCcw size={16} /> Update Source
                            </div>
                         </div>
                       </motion.div>
                     ) : (
                       <div className="flex flex-col items-center">
                         <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                            <UploadCloud size={32} />
                         </div>
                         <h3 className="text-xl font-bold mb-2">Import Document</h3>
                         <p className="text-textMuted text-xs max-w-[200px] leading-relaxed">Drop your handwritten note here or click to browse</p>
                       </div>
                     )}
                   </AnimatePresence>
                 </>
               ) : (
                 <div className="w-full h-full flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-textMuted uppercase tracking-widest px-2">
                       <Type size={12} /> Raw manuscript input
                    </div>
                    <textarea 
                      value={rawTextInput}
                      onChange={(e) => setRawTextInput(e.target.value)}
                      placeholder="Type or paste your messy text here..."
                      className="flex-1 w-full bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 text-sm text-white outline-none focus:border-primary/50 transition-all resize-none font-medium placeholder:text-textMuted/30"
                    />
                 </div>
               )}
            </motion.div>

            <button
               onClick={handleProcess}
               disabled={(mode === "image" && !selectedImage) || (mode === "text" && !rawTextInput.trim()) || status === "scanning" || status === "enhancing"}
               className="w-full btn-premium py-5 text-lg font-bold shadow-2xl flex items-center justify-center gap-3 disabled:opacity-30 group"
            >
               {status === "scanning" || status === "enhancing" ? (
                 <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Synchronizing Pulse</span>
                 </div>
               ) : (
                 <>
                   {mode === "image" ? "Initiate Vision Decode" : "Polishing Prose"} <ChevronRight size={20} />
                 </>
               )}
            </button>

            {/* RAW DATA ACCORDION */}
            <AnimatePresence>
                {originalText && mode === "image" && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel rounded-3xl p-6">
                     <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-textMuted uppercase tracking-widest"><FileText size={12} /> Raw Extraction</div>
                        <button onClick={() => setOriginalText("")} className="text-textMuted hover:text-rose-500"><Trash2 size={12} /></button>
                     </div>
                     <div className="text-xs font-mono text-textMuted bg-black/40 p-4 rounded-xl max-h-[150px] overflow-y-auto leading-relaxed border border-white/[0.05]">{originalText}</div>
                  </motion.div>
                )}
            </AnimatePresence>
          </div>

          {/* MAIN CANVAS */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="glass-panel flex-1 rounded-[40px] border-white/50 relative overflow-hidden flex flex-col">
               <div className="px-8 py-5 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.01]">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Star size={16} fill="currentColor" /></div>
                     <span className="font-serif font-bold text-xl tracking-tight">AI Canvas</span>
                  </div>
                  <div className="flex items-center gap-2">
                      {/* Font Selector */}
                      <div className="flex bg-white/[0.03] border border-white/[0.08] p-1 rounded-xl mr-4 hidden md:flex">
                        {[
                          { id: 'serif', icon: 'S', label: 'Serif' },
                          { id: 'sans', icon: 'A', label: 'Sans' },
                          { id: 'script', icon: '🖋️', label: 'Script' },
                          { id: 'mono', icon: 'M', label: 'Mono' }
                        ].map(f => (
                          <button
                            key={f.id}
                            onClick={() => setCurrentFont(f.id)}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg text-[10px] font-bold transition-all ${
                              currentFont === f.id ? 'bg-primary text-white' : 'text-textMuted hover:text-white'
                            }`}
                            title={f.label}
                          >
                            {f.icon}
                          </button>
                        ))}
                      </div>

                     <button 
                       onClick={() => { if (enhancedText) { navigator.clipboard.writeText(enhancedText); setCopied(true); setTimeout(() => setCopied(false), 2000); } }}
                       title="Copy to Clipboard" 
                       className="p-3 rounded-xl hover:bg-white/[0.05] transition-colors text-textMuted group relative"
                     >
                        {copied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} className="group-hover:text-white" />}
                     </button>
                     <button 
                       onClick={handleDownload}
                       title="Download Text" 
                       className="p-3 rounded-xl hover:bg-white/[0.05] transition-colors text-textMuted group"
                     >
                        <Download size={20} className="group-hover:text-white" />
                     </button>
                     <button 
                       onClick={handleShare}
                       title="Share Content" 
                       className="p-3 rounded-xl hover:bg-white/[0.05] transition-colors text-textMuted group"
                     >
                        <Share2 size={20} className="group-hover:text-white" />
                     </button>
                     <button 
                       onClick={handleSpeak}
                       title="Listen to Text" 
                       className="p-3 rounded-xl hover:bg-white/[0.05] transition-colors text-textMuted group"
                     >
                        <Volume2 size={20} className="group-hover:text-white" />
                     </button>
                  </div>
               </div>

               <div className="flex-1 p-8 md:p-14 relative overflow-y-auto selection:bg-primary/40">
                  <AnimatePresence mode="wait">
                     {status === "idle" && (
                       <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center text-center text-textMuted">
                          <div className="w-16 h-16 rounded-full border border-dashed border-white/10 flex items-center justify-center mb-6"><ImageIcon size={32} className="opacity-20" /></div>
                          <p className="text-lg font-serif">Awaiting your creative vision.</p>
                       </motion.div>
                     )}
                     {(status === "scanning" || status === "enhancing") && (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center gap-6">
                           <div className="relative"><div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /><div className="absolute inset-0 flex items-center justify-center"><Sparkles size={20} className="text-primary animate-pulse" /></div></div>
                           <div className="text-center">
                              <p className="text-xl font-serif font-bold mb-2">{status === "scanning" ? "Synchronizing Pixels" : "Refining Semantic Logic"}</p>
                              <p className="text-sm text-textMuted tracking-widest uppercase">Neural Network Response</p>
                           </div>
                        </motion.div>
                     )}
                     {status === "error" && (
                       <motion.div key="error" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col items-center justify-center text-center px-6">
                          <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mb-6 border border-rose-500/20"><Zap size={32} /></div>
                          <h3 className="text-2xl font-serif font-bold mb-2 text-white">Interference Detected</h3>
                          <p className="text-rose-400 font-medium mb-1 text-sm">{errorMsg || "Vision system failed to compute."}</p>
                       </motion.div>
                     )}
                      {status === "done" && (
                        <motion.div 
                          key="content" 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          className={`text-2xl lg:text-4xl leading-[1.6] text-white/90 ${
                            currentFont === 'serif' ? 'font-serif' : 
                            currentFont === 'sans' ? 'font-sans' : 
                            currentFont === 'mono' ? 'font-mono' :
                            'font-script italic'
                          }`}
                          style={currentFont === 'script' ? { fontFamily: "'Dancing Script', cursive" } : {}}
                        >
                           <TypewriterText text={enhancedText} />
                           <span className="cursor-blink" />
                        </motion.div>
                      )}
                  </AnimatePresence>
               </div>

               <div className="px-8 py-4 bg-white/[0.02] border-t border-white/[0.05] flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-textMuted">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />Live Engine: Pollinations Vision / GPT-4o</div>
                  <div>Status: Stable</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
