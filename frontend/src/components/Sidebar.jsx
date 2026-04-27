import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Sparkles, 
  History, 
  Settings, 
  LogOut,
  ChevronRight,
  Plus,
  Zap,
  Wand2,
  X,
  Image as ImageIcon,
  PenTool
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ onClose }) {
  const { logout } = useAuth();
  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Artistic Enhancer', icon: <Sparkles size={20} />, path: '/enhancer' },
    { name: 'Creative Lab', icon: <Wand2 size={20} />, path: '/creator-lab' },
    { name: 'Artisan Cards', icon: <ImageIcon size={20} />, path: '/artisan-cards' },
    { name: 'Poetry Studio', icon: <PenTool size={20} />, path: '/poetry-studio' },
    { name: 'History Archive', icon: <History size={20} />, path: '/dashboard/history' },
  ];

  return (
    <div className="w-full bg-slate-950/90 md:bg-slate-950/40 backdrop-blur-3xl h-full flex flex-col pt-10 pb-8 px-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-16 px-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl shadow-primary/20 rotate-3 group cursor-pointer hover:rotate-12 transition-transform duration-500">
            <Sparkles className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold tracking-tighter text-white">PEN AI</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold">Studio</p>
          </div>
        </div>
        {/* Mobile close button */}
        <button 
          onClick={onClose}
          className="lg:hidden w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-textMuted hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex flex-col gap-3 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={onClose}
            end={item.path === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group relative ${
                isActive 
                  ? 'bg-white/[0.05] text-primary shadow-[inset_0_0_20px_rgba(168,85,247,0.05)] border border-white/[0.05]' 
                  : 'text-textMuted hover:text-white hover:bg-white/[0.02]'
              }`
            }
          >
            <div className="flex items-center gap-4">
              <span className={`transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>{item.icon}</span>
              <span className="font-bold text-xs uppercase tracking-widest">{item.name}</span>
            </div>
            <AnimatePresence>
               <motion.div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight size={14} className="text-primary" />
               </motion.div>
            </AnimatePresence>
          </NavLink>
        ))}

        <div className="mt-12 px-2">
           <NavLink to="/enhancer" onClick={onClose} className="w-full flex items-center gap-4 p-5 bg-gradient-to-br from-primary/10 to-transparent rounded-3xl border border-primary/20 hover:border-primary/40 transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center text-primary group-hover:rotate-90 transition-transform border border-white/[0.05] shadow-lg relative z-10">
                 <Plus size={18} />
              </div>
              <div className="relative z-10">
                <span className="text-xs font-bold text-primary italic block uppercase tracking-widest">New Session</span>
                <span className="text-[10px] text-textMuted font-medium block">Create Document</span>
              </div>
           </NavLink>
        </div>
      </div>

      <div className="pt-6 border-t border-white/[0.05]">
        <button 
          onClick={() => { logout(); if(onClose) onClose(); }}
          className="flex items-center gap-4 px-5 py-4 rounded-2xl w-full text-textMuted hover:bg-rose-500/10 hover:text-rose-500 transition-all font-bold text-xs uppercase tracking-widest group"
        >
          <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center shadow-sm group-hover:bg-rose-500/20 group-hover:border-rose-500/30 transition-colors">
            <LogOut size={18} />
          </div>
          Sign Out Studio
        </button>
      </div>
    </div>
  );
}
