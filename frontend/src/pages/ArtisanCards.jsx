import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Download, Wand2, Type, Image as ImageIcon, Send, Share2, Layers, Check, ChevronRight } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useAuth } from '../context/AuthContext';

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

const CARD_THEMES = [
  { id: 'birthday', label: 'Celebration', prompt: 'vibrant, festive, celebratory, high-quality, abstract bokeh, joyful colors', icon: Sparkles },
  { id: 'love', label: 'Heartfelt', prompt: 'romantic, soft gradients, elegant, warm lighting, minimalist artistic, cinematic', icon: Send },
  { id: 'inspiration', label: 'Inspirational', prompt: 'majestic nature, ethereal sky, morning light, expansive, peaceful, high resolution', icon: Wand2 },
  { id: 'minimal', label: 'Modern Studio', prompt: 'minimalist, professional, clean lines, luxury texture, subtle lighting, sophisticated', icon: Layers }
];

export default function ArtisanCards() {
  const { token } = useAuth();
  const [text, setText] = useState("");
  const [activeTheme, setActiveTheme] = useState(CARD_THEMES[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [cardImage, setCardImage] = useState(null);
  const [generatingStep, setGeneratingStep] = useState(0);
  const cardRef = useRef(null);

  const handleGenerate = async () => {
    if (!text) return alert("Please enter the soul of your card (the message).");
    
    setIsGenerating(true);
    setGeneratingStep(1);
    
    try {
      // Use the backend proxy to avoid CORS and use server-side API key
      const response = await fetch(`${API_BASE}/generate/image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          prompt: `${activeTheme.prompt}, high quality greeting card background for: ${text.substring(0, 50)}`,
          width: 1080,
          height: 1350
        })
      });

      if (!response.ok) throw new Error("Generation failed");

      const blob = await response.blob();
      if (cardImage) URL.revokeObjectURL(cardImage); // Clean up old URL
      setCardImage(URL.createObjectURL(blob));
      setGeneratingStep(2);
    } catch (error) {
      console.error("Card generation failed:", error);
      alert("Neural synthesis failed. Please try again.");
    } finally {
      setIsGenerating(false);
      setGeneratingStep(0);
    }
  };

  const handleDownload = async () => {
     if (!cardRef.current || !cardImage) return;
     
     try {
       const canvas = await html2canvas(cardRef.current, {
         useCORS: true,
         backgroundColor: null,
         scale: 2, // Higher quality
       });
       
       const link = document.createElement('a');
       link.href = canvas.toDataURL('image/png');
       link.download = `PENAI_Artisan_Card_${Date.now()}.png`;
       link.click();
     } catch (err) {
       console.error("Capture failed:", err);
       // Fallback to just the image if capture fails
       const link = document.createElement('a');
       link.href = cardImage;
       link.download = `PENAI_Artisan_Card_BG_${Date.now()}.png`;
       link.click();
     }
  };

  return (
    <div className="flex flex-col gap-10 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
           <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest mb-4 border border-primary/20 px-3 py-1 rounded-full bg-primary/5 w-fit">
              <Sparkles size={12} /> Digital Synthesis
           </div>
           <h2 className="text-5xl font-serif font-bold tracking-tighter text-white">Artisan Cards</h2>
           <p className="text-textMuted mt-4 text-lg italic leading-relaxed max-w-2xl">
              Turn your words into <span className="text-white">visual legacies</span>. Generate unique greeting cards powered by neural imagination.
           </p>
        </div>

        {/* Discovery Cards */}
        <div className="hidden lg:flex items-center gap-4 self-end">
           <div className="glass-panel p-4 rounded-2xl border-white/[0.05] bg-white/[0.01] flex items-center gap-4 max-w-sm group hover:bg-white/[0.03] transition-all cursor-help">
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                 <img src="https://pollinations.ai/p/birthday%20cake%20aesthetic%20artistic?width=100&height=100&nologo=true" alt="Example" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div>
                 <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Celebrations</p>
                 <p className="text-[11px] text-textMuted leading-tight italic">"Create unique birthday cards for your loved ones."</p>
              </div>
           </div>
           <div className="glass-panel p-4 rounded-2xl border-white/[0.05] bg-white/[0.01] flex items-center gap-4 max-w-sm group hover:bg-white/[0.03] transition-all cursor-help">
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                 <img src="https://pollinations.ai/p/business%20minimalist%20background%20texture?width=100&height=100&nologo=true" alt="Example" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div>
                 <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">Professional</p>
                 <p className="text-[11px] text-textMuted leading-tight italic">"Design custom business announcements instantly."</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Configuration */}
        <div className="lg:col-span-5 flex flex-col gap-8">
           <div className="glass-panel p-8 rounded-[40px] border-white/[0.08]">
              <label className="text-[10px] font-bold text-textMuted uppercase tracking-[0.2em] mb-4 block">1. The Message</label>
              <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write your heartfelt message here... (e.g., Happy Birthday to the most amazing person!)"
                className="w-full h-40 bg-white/[0.03] border border-white/[0.08] rounded-3xl p-6 text-white outline-none focus:bg-white/[0.05] focus:border-primary/50 transition-all resize-none placeholder:text-textMuted/30 font-medium"
              />
           </div>

           <div className="glass-panel p-8 rounded-[40px] border-white/[0.08]">
              <label className="text-[10px] font-bold text-textMuted uppercase tracking-[0.2em] mb-6 block">2. Select Frequency (Theme)</label>
              <div className="grid grid-cols-2 gap-4">
                 {CARD_THEMES.map((theme) => (
                   <button
                    key={theme.id}
                    onClick={() => setActiveTheme(theme)}
                    className={`flex flex-col items-center gap-4 p-6 rounded-3xl border transition-all relative overflow-hidden group ${
                      activeTheme.id === theme.id 
                        ? 'bg-primary/10 border-primary text-primary shadow-[0_0_30px_rgba(168,85,247,0.15)]' 
                        : 'bg-white/[0.02] border-white/[0.05] text-textMuted hover:bg-white/[0.04]'
                    }`}
                   >
                     {activeTheme.id === theme.id && (
                       <motion.div layoutId="active-check" className="absolute top-2 right-2 text-primary">
                          <Check size={14} />
                       </motion.div>
                     )}
                     <theme.icon size={24} className={activeTheme.id === theme.id ? 'scale-110 transition-transform' : 'group-hover:scale-110 transition-transform'} />
                     <span className="text-[10px] font-bold uppercase tracking-widest">{theme.label}</span>
                   </button>
                 ))}
              </div>
           </div>

           <button 
             onClick={handleGenerate}
             disabled={isGenerating || !text.trim()}
             className="w-full btn-premium py-6 text-lg font-bold group disabled:opacity-50"
           >
             {isGenerating ? (
               <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Synthesizing...</span>
               </div>
             ) : (
               <>Begin Articulation <ChevronRight size={20} className="ml-1 group-hover:translate-x-1 transition-transform" /></>
             )}
           </button>
        </div>

        {/* Right: Preview */}
        <div className="lg:col-span-7 flex flex-col gap-6">
           <div className="relative aspect-[4/5] rounded-[48px] bg-white/[0.02] border border-white/[0.08] overflow-hidden group flex items-center justify-center">
              <AnimatePresence mode="wait">
                {cardImage ? (
                  <motion.div 
                    ref={cardRef}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative w-full h-full"
                  >
                    <img src={cardImage} alt="Neural Card" className="w-full h-full object-cover" crossOrigin="anonymous" />
                    
                    {/* Text Overlay - Stylistic */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-center p-12 text-center pointer-events-none">
                       <motion.div
                         initial={{ y: 20, opacity: 0 }}
                         animate={{ y: 0, opacity: 1 }}
                         transition={{ delay: 0.5 }}
                       >
                          <p className="text-white font-serif italic text-3xl leading-relaxed drop-shadow-2xl px-4">
                            "{text}"
                          </p>
                          <div className="mt-8 flex items-center justify-center gap-2 opacity-50">
                             <div className="w-8 h-px bg-white/40" />
                             <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white">PEN AI Studio</span>
                             <div className="w-8 h-px bg-white/40" />
                          </div>
                       </motion.div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center px-12 group-hover:scale-105 transition-transform duration-700">
                    <div className="w-20 h-20 rounded-[32px] bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-8 mx-auto">
                       <ImageIcon size={32} className="text-white/20" />
                    </div>
                    <h4 className="text-xl font-serif font-bold text-white mb-3">Awaiting Canvas</h4>
                    <p className="text-sm text-textMuted leading-relaxed">
                      Your visual artifact will materialize here once the neural synthesis begins.
                    </p>
                  </div>
                )}
              </AnimatePresence>

              {isGenerating && (
                 <div className="absolute inset-0 bg-[#030712]/60 backdrop-blur-md flex flex-col items-center justify-center gap-6">
                    <div className="relative w-24 h-24">
                       <div className="absolute inset-0 border-4 border-primary/20 rounded-[32px]"></div>
                       <motion.div 
                         initial={{ rotate: 0 }}
                         animate={{ rotate: 360 }}
                         transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                         className="absolute inset-0 border-4 border-t-primary rounded-[32px]"
                       />
                       <div className="absolute inset-4 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                          <Wand2 size={32} />
                       </div>
                    </div>
                    <div>
                       <p className="text-white capitalize font-bold tracking-tight text-xl">
                          {generatingStep === 1 ? 'Capturing Frequency' : 'Rendering Artifact'}
                       </p>
                       <p className="text-primary text-[10px] uppercase font-bold tracking-widest mt-2">Neural Link Active</p>
                    </div>
                 </div>
              )}
           </div>

           {cardImage && (
             <div className="flex items-center gap-4">
                <button 
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-3 bg-white text-black py-5 rounded-3xl font-bold hover:bg-primary hover:text-white transition-all shadow-2xl"
                >
                   <Download size={20} /> Collect Digital Legacy
                </button>
                <button className="p-5 rounded-3xl bg-white/[0.05] border border-white/[0.08] text-white hover:bg-white/[0.1] transition-all">
                   <Share2 size={20} />
                </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
