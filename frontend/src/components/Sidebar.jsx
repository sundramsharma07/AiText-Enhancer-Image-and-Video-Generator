import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Sparkles, 
  History, 
  Settings, 
  LogOut,
  Menu,
  Plus,
  Zap,
  Wand2,
  X,
  Image as ImageIcon,
  PenTool,
  Feather,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ onClose, isCollapsed = false, toggleCollapse = () => {} }) {
  const { logout } = useAuth();
  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Artistic Enhancer', icon: <Sparkles size={20} />, path: '/enhancer' },
    { name: 'Creative Lab', icon: <Wand2 size={20} />, path: '/creator-lab' },
    { name: 'Artisan Cards', icon: <ImageIcon size={20} />, path: '/artisan-cards' },
    { name: 'Poetry Studio', icon: <PenTool size={20} />, path: '/poetry-studio' },
    { name: 'Shayari Generator', icon: <Feather size={20} />, path: '/shayari-generator' },
    { name: 'History Archive', icon: <History size={20} />, path: '/dashboard/history' },
  ];

  return (
    <div className={`w-full min-w-0 bg-white/92 backdrop-blur-3xl h-full flex flex-col pt-10 pb-8 ${isCollapsed ? 'px-1' : 'px-6'} overflow-y-auto shadow-[18px_0_45px_rgba(68,75,125,0.12)] transition-all duration-300 ease-out`}>
      <div className="flex items-center justify-between mb-16 px-2">
        {!isCollapsed ? (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl shadow-primary/20 rotate-3 transition-transform duration-500">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-textMain">PEN AI</h1>
              <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold">Studio</p>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <button
              onClick={toggleCollapse}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-[#e3e6f3] text-textMuted hover:bg-primary hover:text-white transition-colors"
              title="Expand sidebar"
            >
              <Menu size={18} />
            </button>
          </div>
        )}

        {!isCollapsed && (
          <button
            onClick={toggleCollapse}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white border border-[#e3e6f3] text-textMuted hover:bg-primary hover:text-white transition-colors"
            title="Collapse sidebar"
          >
            <ChevronLeft size={16} />
          </button>
        )}
        {/* Mobile close button */}
        <button 
          onClick={onClose}
          className="lg:hidden w-10 h-10 rounded-xl bg-[#f3f5ff] border border-[#e3e6f3] flex items-center justify-center text-textMuted hover:text-primary"
        >
          <X size={20} />
        </button>
      </div>

      <div className={`flex flex-col gap-3 flex-1 ${isCollapsed ? 'items-center justify-start pt-6' : ''}`}>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={onClose}
            end={item.path === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} ${isCollapsed ? 'w-12 h-12' : 'w-full px-5 py-4'} rounded-2xl transition-all duration-300 ease-out group relative ${
                isActive 
                  ? 'bg-[#f3f5ff] text-primary shadow-[0_12px_28px_rgba(216,58,232,0.12)] border border-[#e3e6f3]' 
                  : 'text-textMuted hover:text-textMain hover:bg-[#f8f9ff]'
              }`
            }
          >
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'}`}>
              <span className={`transition-transform duration-300 ease-out ${isCollapsed ? '' : 'group-hover:scale-110 group-hover:rotate-6'}`}>{item.icon}</span>
              {!isCollapsed && <span className="font-bold text-xs uppercase tracking-widest">{item.name}</span>}
            </div>
          </NavLink>
        ))}

        <div className="mt-12 px-2">
           <NavLink to="/enhancer" onClick={onClose} className={`w-full flex items-center gap-4 ${isCollapsed ? 'justify-center' : ''} p-5 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl border border-primary/20 hover:border-primary/40 transition-all group overflow-hidden relative`}>
              {!isCollapsed && <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />}
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary group-hover:rotate-90 transition-transform border border-white shadow-lg relative z-10">
                 <Plus size={18} />
              </div>
              {!isCollapsed && (
                <div className="relative z-10">
                  <span className="text-xs font-bold text-primary italic block uppercase tracking-widest">New Session</span>
                  <span className="text-[10px] text-textMuted font-medium block">Create Document</span>
                </div>
              )}
           </NavLink>
        </div>
      </div>

      <div className="pt-6 border-t border-[#e3e6f3]">
        <button 
          onClick={() => { logout(); if(onClose) onClose(); }}
          className={`flex items-center gap-4 ${isCollapsed ? 'px-3 py-3 justify-center' : 'px-5 py-4'} rounded-2xl w-full text-textMuted hover:bg-rose-500/10 hover:text-rose-500 transition-all font-bold text-xs uppercase tracking-widest group`}
        >
          <div className="w-10 h-10 rounded-xl bg-[#f3f5ff] border border-[#e3e6f3] flex items-center justify-center shadow-sm group-hover:bg-rose-500/20 group-hover:border-rose-500/30 transition-colors">
            <LogOut size={18} />
          </div>
          {!isCollapsed && 'Sign Out Studio'}
        </button>
      </div>
    </div>
  );
}
