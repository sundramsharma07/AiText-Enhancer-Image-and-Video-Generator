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
    <div className="relative min-h-screen bg-app-bg text-textMain overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <FloatingElement delay={0} x={-40} y={-30}>
           <div className="w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
        </FloatingElement>
        <FloatingElement delay={2} x={30} y={20}>
           <div className="w-72 h-72 bg-secondary/10 rounded-full blur-[120px]" />
        </FloatingElement>
        
        <FloatingElement delay={1} x={-10} y={-10}>
           <p className="font-handwriting text-5xl text-primary/10 -rotate-12 select-none">Capture ideas...</p>
        </FloatingElement>
        <FloatingElement delay={3} x={20} y={-40}>
           <p className="font-handwriting text-4xl text-secondary/10 rotate-6 select-none">Refine reality.</p>
        </FloatingElement>
      </div>

      {/* Hero */}
      <section className="relative z-10 pt-52 pb-32 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-bold tracking-widest text-primary uppercase mb-10"
          >
            <CloudLightning size={12} /> Re-imagining the art of digital ink
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold leading-[0.85] tracking-tighter mb-10">
            <AnimatedText text="Elegance in" className="block text-white" />
            <AnimatedText text="every stroke." className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent" />
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-lg md:text-xl text-textMuted max-w-2xl mx-auto mb-14 leading-relaxed"
          >
            Bridge the gap between your handwritten thoughts and professional digital prose. Powered by Pollinations AI for ultimate creative freedom.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link to="/enhancer" className="btn-premium text-lg px-12 py-4">
              Enter the Studio <ArrowRight size={20} />
            </Link>
            <button className="px-10 py-4 rounded-xl border border-white/10 hover:bg-white/[0.05] transition-all font-medium">
              Explore Features
            </button>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="relative z-10 py-32 px-6 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-end mb-24">
            <div className="flex-1">
              <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter mb-4">Crafted for perfection.</h2>
              <div className="h-1 w-24 bg-gradient-to-r from-primary to-transparent rounded-full" />
            </div>
            <p className="flex-1 text-textMuted text-lg leading-relaxed">
              We've architected a workspace that respects the tactile nature of handwriting while providing the surgical precision of modern AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-10 rounded-[32px] group hover:bg-white/[0.05] transition-all cursor-default"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                <p className="text-textMuted text-sm leading-relaxed">
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
