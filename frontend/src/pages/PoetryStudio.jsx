import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, PenTool, Globe, Send, Copy, RefreshCw, Languages, Heart, Wind, Flame, FileText, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useAuth } from '../context/AuthContext';

const POETRY_STYLES = [
  { id: 'abstract', label: 'Ethereal', icon: Wind, description: 'Abstract and dream-like flow' },
  { id: 'classic', label: 'Structured', icon: PenTool, description: 'Classic rhythmic structure' },
  { id: 'emotional', label: 'Heartfelt', icon: Heart, description: 'Deep emotional resonance' },
  { id: 'bold', label: 'Powerful', icon: Flame, description: 'Strong and impactful verses' }
];

export default function PoetryStudio() {
  const { token } = useAuth();
  const [words, setWords] = useState("");
  const [language, setLanguage] = useState("English");
  const [activeStyle, setActiveStyle] = useState(POETRY_STYLES[0]);
  const [poem, setPoem] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!words.trim()) return alert("Please provide some seed words for the muse.");
    
    setIsGenerating(true);
    setPoem("");
    
    try {
      const systemPrompt = encodeURIComponent(`You are a world-class bilingual poet. Generate a beautiful, 8-line creative poem. Language: ${language}. Style: ${activeStyle.label}. If Hindi, use Devanagari script. Do not include any titles or metadata, just the raw poetry text.`);
      const userPrompt = encodeURIComponent(`Seed words: ${words}`);
      
      const response = await fetch(`https://text.pollinations.ai/${userPrompt}?model=openai&system=${systemPrompt}`);

      if (response.ok) {
        const text = await response.text();
        setPoem(text);
      } else {
        alert("The muse is silent. Please try again.");
      }
    } catch (error) {
      console.error("Poetry generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(poem);
    alert("Poem captured to clipboard.");
  };

  const downloadPDF = () => {
    if (!poem) return;
    
    const doc = new jsPDF();
    
    // Set background and styling
    doc.setFillColor(3, 7, 18); // app-bg color
    doc.rect(0, 0, 210, 297, 'F');
    
    doc.setTextColor(168, 85, 247); // primary color
    doc.setFontSize(22);
    doc.setFont("serif", "bold");
    doc.text("PEN AI - Poetic Studio", 105, 30, { align: 'center' });
    
    doc.setDrawColor(168, 85, 247);
    doc.line(40, 35, 170, 35);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("serif", "italic");
    
    const splitText = doc.splitTextToSize(poem, 160);
    doc.text(splitText, 105, 60, { align: 'center' });
    
    doc.setTextColor(107, 114, 128); // textMuted
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 270, { align: 'center' });
    doc.text("Articulated by PEN AI Multi-Modal Engine", 105, 275, { align: 'center' });
    
    doc.save(`PENAI_Poem_${Date.now()}.pdf`);
  };

  return (
    <div className="flex flex-col gap-10 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
           <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest mb-4 border border-primary/20 px-3 py-1 rounded-full bg-primary/5 w-fit">
              <Languages size={12} /> Bilingual Synthesis
           </div>
           <h2 className="text-5xl font-serif font-bold tracking-tighter text-white">Poetic Studio</h2>
           <p className="text-textMuted mt-4 text-lg italic leading-relaxed max-w-2xl">
              Merge your thoughts with AI intelligence. Generate <span className="text-white">stunning verses</span> in English or Hindi from simple seed words.
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 flex flex-col gap-8">
           {/* Info Card */}
           <div className="p-6 rounded-[32px] bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
              <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                 <Sparkles size={16} className="text-primary" /> Inspiration Tip
              </h4>
              <p className="text-xs text-textMuted leading-relaxed italic">
                "Try entering words like 'rain, nostalgia, city lights' and select Hindi for a soulful ghazal style."
              </p>
           </div>

           <div className="glass-panel p-8 rounded-[40px] border-white/[0.08]">
              <label className="text-[10px] font-bold text-textMuted uppercase tracking-[0.2em] mb-4 block">Seed Words</label>
              <input 
                type="text"
                value={words}
                onChange={(e) => setWords(e.target.value)}
                placeholder="Memory, Sunlight, Ocean..."
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 text-white outline-none focus:bg-white/[0.05] focus:border-primary/50 transition-all font-medium"
              />
           </div>

           <div className="glass-panel p-8 rounded-[40px] border-white/[0.08]">
              <label className="text-[10px] font-bold text-textMuted uppercase tracking-[0.2em] mb-6 block">Artistic Frequency</label>
              <div className="grid grid-cols-2 gap-4">
                 {POETRY_STYLES.map((style) => (
                   <button
                    key={style.id}
                    onClick={() => setActiveStyle(style)}
                    className={`flex flex-col items-center gap-4 p-6 rounded-3xl border transition-all ${
                      activeStyle.id === style.id 
                        ? 'bg-primary/10 border-primary text-primary shadow-[0_0_30px_rgba(168,85,247,0.15)]' 
                        : 'bg-white/[0.02] border-white/[0.05] text-textMuted hover:bg-white/[0.04]'
                    }`}
                   >
                     <style.icon size={20} />
                     <span className="text-[10px] font-bold uppercase tracking-widest">{style.label}</span>
                   </button>
                 ))}
              </div>
           </div>

           <div className="flex items-center gap-4">
              <button 
                onClick={() => setLanguage("English")}
                className={`flex-1 py-4 rounded-2xl border transition-all text-[10px] font-bold uppercase tracking-widest ${language === 'English' ? 'bg-white text-black' : 'bg-white/[0.02] border-white/10 text-white'}`}
              >
                English Mode
              </button>
              <button 
                onClick={() => setLanguage("Hindi")}
                className={`flex-1 py-4 rounded-2xl border transition-all text-[10px] font-bold uppercase tracking-widest ${language === 'Hindi' ? 'bg-primary text-white border-primary' : 'bg-white/[0.02] border-white/10 text-white'}`}
              >
                Hindi Mode
              </button>
           </div>

           <button 
             onClick={handleGenerate}
             disabled={isGenerating}
             className="w-full btn-premium py-6 text-lg font-bold group"
           >
             {isGenerating ? 'Summoning Muse...' : 'Synthesize Poem'}
           </button>
        </div>

        <div className="lg:col-span-7">
           <div className="glass-panel h-full min-h-[600px] rounded-[48px] border-white/[0.08] p-12 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                 <PenTool size={200} />
              </div>

              <div className="relative flex-1 flex flex-col items-center justify-center text-center">
                 <AnimatePresence mode="wait">
                    {poem ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-lg"
                      >
                         <div className="mb-10 opacity-30 text-primary">
                            <Sparkles size={40} className="mx-auto" />
                         </div>
                         <pre className="whitespace-pre-wrap font-serif text-2xl leading-[1.8] text-white italic drop-shadow-sm px-4">
                           {poem}
                         </pre>
                         <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
                            <button onClick={copyToClipboard} className="flex items-center gap-2 text-xs font-bold text-textMuted hover:text-white transition-all uppercase tracking-widest">
                               <Copy size={16} /> Capture Verse
                            </button>
                            <button onClick={downloadPDF} className="flex items-center gap-2 text-xs font-bold text-primary hover:text-white transition-all uppercase tracking-widest">
                               <Download size={16} /> Export PDF
                            </button>
                            <button onClick={handleGenerate} className="flex items-center gap-2 text-xs font-bold text-textMuted hover:text-white transition-all uppercase tracking-widest">
                               <RefreshCw size={16} /> New Frequency
                            </button>
                         </div>
                      </motion.div>
                    ) : (
                      <div className="opacity-30">
                         <div className="w-24 h-24 rounded-[40px] border border-white/20 flex items-center justify-center mb-10 mx-auto">
                            <Wind size={40} className="text-white" />
                         </div>
                         <h3 className="text-2xl font-serif font-bold text-white mb-4 italic">Silken Silence</h3>
                         <p className="text-sm text-textMuted max-w-xs mx-auto leading-relaxed">
                           Awaiting your seed words to breathe life into the digital canvas.
                         </p>
                      </div>
                    )}
                 </AnimatePresence>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
