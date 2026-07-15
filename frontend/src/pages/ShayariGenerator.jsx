import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Copy, Download, Feather, Heart, Languages, RefreshCw, Sparkles, UploadCloud } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { publishShowcasePost } from '../utils/showcase';
import { saveGenerationHistory } from '../utils/history';

const MOODS = [
  { id: 'romantic', label: 'Romantic', icon: Heart },
  { id: 'sad', label: 'Sad', icon: Feather },
  { id: 'friendship', label: 'Friendship', icon: Sparkles },
  { id: 'motivational', label: 'Motivational', icon: Languages }
];

export default function ShayariGenerator() {
  const { token } = useAuth();
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState('Hindi');
  const [mood, setMood] = useState(MOODS[0]);
  const [shayari, setShayari] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return alert('Please enter a topic for the shayari.');

    setIsGenerating(true);
    setShayari('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/generate/text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          prompt: `Shayari topic: ${topic}`,
          system: `You are an expert shayari writer. Generate 4 original shayari options, each 2 lines. Language: ${language}. Mood: ${mood.label}. If Hindi, use Devanagari script. Do not add explanations or metadata.`
        })
      });

      if (!response.ok) throw new Error('Generation failed');
      const text = await response.text();
      setShayari(text);
      saveGenerationHistory({
        token,
        title: `${mood.label} ${language} shayari`,
        originalText: topic,
        enhancedText: text,
        tone: mood.label
      }).catch((error) => console.error('Shayari history save failed:', error));
      
    } catch (error) {
      console.error('Shayari generation failed:', error);
      alert('The shayari generator could not respond. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shayari);
    alert('Shayari copied to clipboard.');
  };

  const downloadText = () => {
    if (!shayari) return;
    const blob = new Blob([shayari], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PENAI_Shayari_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePostToShowcase = async () => {
    if (!shayari) return;
    setIsPosting(true);
    try {
      await publishShowcasePost({
        token,
        title: `${mood.label} ${language} shayari`,
        description: shayari,
        prompt: topic,
        category: 'shayari-generated',
        mediaType: 'text'
      });
      alert('Shayari posted to the public showcase.');
    } catch (error) {
      alert(error.message);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest mb-4 border border-primary/20 px-3 py-1 rounded-full bg-primary/5 w-fit">
            <Feather size={12} /> Shayari Generator
          </div>
          <h2 className="text-5xl font-bold tracking-tight text-textMain">Shayari Studio</h2>
          <p className="text-textMuted mt-4 text-lg italic leading-relaxed max-w-2xl">
            Generate polished Hindi or English shayari for love, friendship, motivation, and emotional captions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 flex flex-col gap-8">
          <div className="glass-panel p-8 rounded-[40px]">
            <label className="text-[10px] font-bold text-textMuted uppercase tracking-[0.2em] mb-4 block">Topic or feeling</label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Example: first love, missing someone, success after struggle..."
              className="w-full h-36 bg-white border border-[#e3e6f3] rounded-3xl p-6 text-textMain outline-none focus:bg-white focus:border-primary/50 transition-all resize-none placeholder:text-textMuted/60 font-medium shadow-sm"
            />
          </div>

          <div className="glass-panel p-8 rounded-[40px]">
            <label className="text-[10px] font-bold text-textMuted uppercase tracking-[0.2em] mb-6 block">Mood</label>
            <div className="grid grid-cols-2 gap-4">
              {MOODS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setMood(item)}
                  className={`flex flex-col items-center gap-4 p-6 rounded-3xl border transition-all ${
                    mood.id === item.id
                      ? 'bg-primary/10 border-primary text-primary shadow-[0_14px_28px_rgba(216,58,232,0.14)]'
                      : 'bg-white border-[#e3e6f3] text-textMuted hover:bg-[#f3f5ff]'
                  }`}
                >
                  <item.icon size={22} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {['Hindi', 'English'].map((item) => (
              <button
                key={item}
                onClick={() => setLanguage(item)}
                className={`flex-1 py-4 rounded-2xl border transition-all text-[10px] font-bold uppercase tracking-widest ${
                  language === item ? 'bg-textMain text-white border-textMain' : 'bg-white border-[#e3e6f3] text-textMain'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <button onClick={handleGenerate} disabled={isGenerating || !topic.trim()} className="w-full btn-premium py-6 text-lg font-bold disabled:opacity-50">
            {isGenerating ? 'Writing Shayari...' : 'Generate Shayari'}
          </button>
        </div>

        <div className="lg:col-span-7">
          <div className="glass-panel min-h-[600px] rounded-[48px] p-8 md:p-12 flex flex-col relative overflow-hidden">
            <div className="absolute right-8 top-8 text-primary/10">
              <Feather size={190} />
            </div>
            <div className="relative flex-1 flex flex-col items-center justify-center text-center">
              <AnimatePresence mode="wait">
                {shayari ? (
                  <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-xl">
                    <div className="mb-8 text-primary">
                      <Sparkles size={38} className="mx-auto" />
                    </div>
                    <pre className="whitespace-pre-wrap font-serif text-2xl leading-[1.8] text-textMain italic px-2">
                      {shayari}
                    </pre>
                    <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
                      <button onClick={copyToClipboard} className="flex items-center gap-2 text-xs font-bold text-textMuted hover:text-textMain transition-all uppercase tracking-widest">
                        <Copy size={16} /> Copy
                      </button>
                      <button onClick={downloadText} className="flex items-center gap-2 text-xs font-bold text-primary hover:text-secondary transition-all uppercase tracking-widest">
                        <Download size={16} /> Download
                      </button>
                      <button onClick={handlePostToShowcase} disabled={isPosting} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-primary/20 transition hover:bg-secondary disabled:opacity-50">
                        <UploadCloud size={16} /> Publish to Showcase
                      </button>
                      <button onClick={handleGenerate} className="flex items-center gap-2 text-xs font-bold text-textMuted hover:text-textMain transition-all uppercase tracking-widest">
                        <RefreshCw size={16} /> Regenerate
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="opacity-80">
                    <div className="w-24 h-24 rounded-[34px] border border-[#e3e6f3] bg-white flex items-center justify-center mb-8 mx-auto">
                      <Feather size={38} className="text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-textMain mb-4">Ready for your words</h3>
                    <p className="text-sm text-textMuted max-w-xs mx-auto leading-relaxed">
                      Add a topic, choose a mood, and the current AI text API will compose fresh shayari.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
