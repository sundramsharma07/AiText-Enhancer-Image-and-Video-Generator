import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  PenTool, 
  Zap, 
  Layers, 
  ArrowRight, 
  Smartphone,
  CloudLightning,
  CheckCircle2,
  ChevronRight,
  Star
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

export default function Landing() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

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

      {/* NEW: Scrolling Product Showcase Section (Description Left, Image Right) */}
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
               <img src="/src/assets/workspace.png" alt="Workspace" className="w-full rounded-[32px] shadow-2xl h-[500px] object-cover" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* NEW: Scrolling Generator Showcase Section (Image Left, Description Right) */}
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
               <img src="/src/assets/ai-generator.png" alt="AI Generator" className="w-full rounded-[32px] shadow-2xl h-[500px] object-contain bg-black/40" />
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
                     <li><a href="#" className="hover:text-primary transition-colors">Twitter</a></li>
                     <li><a href="#" className="hover:text-primary transition-colors">Discord</a></li>
                  </ul>
               </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase font-bold tracking-widest text-textMuted">
             <p>© 2026 PEN AI STUDIO. ALL RIGHTS RESERVED.</p>
             <div className="flex gap-8">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
