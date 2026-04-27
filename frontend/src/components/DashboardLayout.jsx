import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Bell, Search, Settings as SettingsIcon, Crown, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar only if we are on mobile
  const closeSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex bg-app-bg min-h-screen text-textMain relative overflow-hidden">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex w-72 h-screen sticky top-0 border-r border-white/[0.05] z-30">
        <Sidebar />
      </div>

      {/* Sidebar - Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            {/* Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Sidebar content */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-y-0 left-0 w-72"
            >
              <Sidebar onClose={closeSidebar} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <div className="flex-1 flex flex-col relative z-10 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="sticky top-0 w-full px-4 md:px-12 py-4 md:py-6 flex items-center justify-between z-40 bg-[#030712]/40 backdrop-blur-3xl border-b border-white/[0.03]">
          <div className="flex items-center gap-4 md:gap-8 w-full max-w-2xl">
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-textMuted hover:text-white transition-all"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="relative group flex-1 hidden sm:block">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-textMuted group-focus-within:text-primary transition-all duration-300 pointer-events-none" size={16} />
              <input 
                type="text" 
                placeholder="Search your collection..." 
                className="w-full pl-16 pr-8 py-3.5 bg-white/[0.02] border border-white/[0.05] rounded-3xl text-sm outline-none focus:bg-white/[0.04] focus:border-primary/50 focus:ring-8 focus:ring-primary/5 transition-all font-medium placeholder:text-textMuted/30 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
              />
            </div>

            {/* Mobile Brand (Only on mobile header) */}
            <div className="flex items-center gap-2 sm:hidden">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                   <SettingsIcon size={14} className="text-white" />
                </div>
                <span className="font-serif font-bold text-lg tracking-tighter">PEN AI</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.05] p-1 rounded-2xl hidden xs:flex">
               <button 
                onClick={() => alert("Notifications are synchronized with your artistic pulse. No new signals found.")}
                title="Notifications"
                className="w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center hover:bg-white/[0.05] transition-all text-textMuted hover:text-white relative group"
               >
                  <Bell size={18} />
                  <span className="absolute top-3 right-3 w-2 h-2 bg-emerald-500 rounded-full border-2 border-app-bg"></span>
               </button>
               <Link 
                to="/dashboard/settings" 
                title="Studio Settings"
                className="w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center hover:bg-white/[0.05] transition-all text-textMuted hover:text-white"
               >
                  <SettingsIcon size={18} />
               </Link>
            </div>
            
            <div className="flex items-center gap-4 md:pl-6 md:border-l md:border-white/[0.05]">
               <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-white capitalize tracking-tight">{user?.username || 'Creative User'}</p>
                  <div className="flex items-center justify-end gap-1 text-[10px] text-primary font-bold uppercase tracking-widest">
                     <Crown size={10} fill="currentColor" /> Artisan
                  </div>
               </div>
               <Link to="/dashboard/settings" className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary p-[1px] transition-transform hover:scale-105 active:scale-95 group">
                  <div className="w-full h-full rounded-[11px] md:rounded-[15px] bg-slate-900 overflow-hidden border border-white/10">
                     <img src={`https://ui-avatars.com/api/?name=${user?.username || 'A'}&background=random&color=white`} alt="Avatar" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
               </Link>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 px-4 md:px-8 pb-12 overflow-y-auto">
           <div className="max-w-7xl mx-auto pt-6">
              <Outlet />
           </div>
        </main>
      </div>
    </div>
  );
}
