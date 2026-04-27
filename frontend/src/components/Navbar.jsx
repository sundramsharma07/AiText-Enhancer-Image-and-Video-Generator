import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Settings, ArrowRight, Menu, X, LayoutDashboard, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-[100] px-6 py-8 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-card px-8 py-4 rounded-[32px] pointer-events-auto">
        <Link to="/" className="flex items-center gap-4 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
            <Sparkles size={22} />
          </div>
          <span className="text-2xl font-black font-serif tracking-tighter text-white">PEN AI</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-10">
          <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-textMuted">
            <Link to="/" className={`hover:text-white transition-colors ${location.pathname === '/' ? 'text-primary' : ''}`}>Protocol</Link>
            <Link to="/enhancer" className={`hover:text-white transition-colors ${location.pathname === '/enhancer' ? 'text-primary' : ''}`}>Studio</Link>
            <Link to="/creator-lab" className={`hover:text-white transition-colors ${location.pathname === '/creator-lab' ? 'text-primary' : ''}`}>Lab</Link>
          </div>

          <div className="h-6 w-px bg-white/10 mx-2" />

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-textMuted hover:text-primary hover:border-primary/30 transition-all group" title="Dashboard">
                  <LayoutDashboard size={18} />
                </Link>
                <Link to="/dashboard/settings" className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-textMuted hover:text-primary hover:border-primary/30 transition-all group" title="Studio Settings">
                  <Settings size={18} />
                </Link>
                <div className="w-px h-6 bg-white/10 mx-1" />
                <button onClick={logout} className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-400 transition-colors">Exit</button>
              </div>
            ) : (
              <Link to="/auth" className="text-[10px] font-black uppercase tracking-widest text-textMain hover:text-primary transition-colors px-4">
                Infiltrate
              </Link>
            )}
            
            <Link to="/enhancer" className="btn-premium flex items-center gap-3 py-3 px-8 text-xs rounded-2xl shadow-xl hover:shadow-primary/20">
              {isAuthenticated ? "New Craft" : "Get Started"} <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
           <button onClick={() => setIsOpen(!isOpen)} className="p-3 bg-white/[0.03] rounded-xl text-textMuted hover:text-white transition-colors">
              {isOpen ? <X size={20} /> : <Menu size={20} />}
           </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-32 left-6 right-6 md:hidden glass-card rounded-[32px] p-8 pointer-events-auto border-white/[0.1] shadow-2xl"
          >
            <div className="flex flex-col gap-6">
              {[
                { label: 'Protocol', to: '/' },
                { label: 'Studio Room', to: '/enhancer' },
                { label: 'Creative Lab', to: '/creator-lab' },
                { label: 'User Settings', to: '/dashboard/settings' }
              ].map(link => (
                <Link key={link.to} to={link.to} onClick={() => setIsOpen(false)} className="text-xl font-serif font-black text-white hover:text-primary transition-colors flex items-center justify-between">
                  {link.label} <ArrowRight size={16} className="opacity-20" />
                </Link>
              ))}
              <div className="h-px w-full bg-white/10" />
              {isAuthenticated ? (
                <button onClick={logout} className="text-rose-500 font-black uppercase tracking-widest text-sm text-left">Resign Session</button>
              ) : (
                <Link to="/auth" onClick={() => setIsOpen(false)} className="text-primary font-black uppercase tracking-widest text-sm">Sign In</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
