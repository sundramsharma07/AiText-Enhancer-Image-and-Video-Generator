import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, User, ArrowRight, Layers, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-6 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/40 backdrop-blur-xl border border-white/40 shadow-xl shadow-black/5 px-6 py-3 rounded-[24px]">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
            <Sparkles size={20} />
          </div>
          <span className="text-xl font-bold font-serif tracking-tight">Pen AI</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-textMuted lowercase tracking-tight">
          <Link to="/" className={`hover:text-primary transition-colors ${location.pathname === '/' ? 'text-primary' : ''}`}>Features</Link>
          <Link to="/enhancer" className="hover:text-primary transition-colors">Showcase</Link>
          {isAuthenticated ? (
            <Link to="/dashboard" className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors font-bold">
              <LayoutDashboard size={14} /> Dashboard
            </Link>
          ) : (
            <Link to="/auth" className="flex items-center gap-2 text-textMain hover:text-primary transition-colors">
              Sign In
            </Link>
          )}
          <Link to="/enhancer" className="btn-premium flex items-center gap-2 py-2 px-6 text-xs">
            {isAuthenticated ? "Studio" : "Try Free"} <ArrowRight size={14} />
          </Link>
        </div>

        {/* Mobile Toggle Mock */}
        <div className="md:hidden">
           <button className="p-2 text-textMuted">
              <Layers size={21} />
           </button>
        </div>
      </div>
    </nav>
  );
}
