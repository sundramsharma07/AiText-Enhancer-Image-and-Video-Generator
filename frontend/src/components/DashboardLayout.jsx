import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Bell, Search, Settings as SettingsIcon, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function DashboardLayout() {
  const { user } = useAuth();

  return (
    <div className="flex bg-app-bg min-h-screen text-textMain relative overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col relative z-10 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="sticky top-0 w-full px-12 py-6 flex items-center justify-between z-40 bg-[#030712]/40 backdrop-blur-3xl border-b border-white/[0.03]">
          <div className="flex items-center gap-8 w-full max-w-2xl">
            <div className="relative group flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-textMuted group-focus-within:text-primary transition-all duration-300 pointer-events-none" size={16} />
              <input 
                type="text" 
                placeholder="Search your collection..." 
                className="w-full pl-16 pr-8 py-3.5 bg-white/[0.02] border border-white/[0.05] rounded-3xl text-sm outline-none focus:bg-white/[0.04] focus:border-primary/50 focus:ring-8 focus:ring-primary/5 transition-all font-medium placeholder:text-textMuted/30 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.05] p-1 rounded-2xl">
               <button 
                onClick={() => alert("Notifications are synchronized with your artistic pulse. No new signals found.")}
                title="Notifications"
                className="w-11 h-11 rounded-xl flex items-center justify-center hover:bg-white/[0.05] transition-all text-textMuted hover:text-white relative group"
               >
                  <Bell size={18} />
                  <span className="absolute top-3 right-3 w-2 h-2 bg-emerald-500 rounded-full border-2 border-app-bg"></span>
               </button>
               <Link 
                to="/dashboard/settings" 
                title="Studio Settings"
                className="w-11 h-11 rounded-xl flex items-center justify-center hover:bg-white/[0.05] transition-all text-textMuted hover:text-white"
               >
                  <SettingsIcon size={18} />
               </Link>
            </div>
            
            <div className="flex items-center gap-4 pl-6 border-l border-white/[0.05]">
               <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-white capitalize tracking-tight">{user?.username || 'Creative User'}</p>
                  <div className="flex items-center justify-end gap-1 text-[10px] text-primary font-bold uppercase tracking-widest">
                     <Crown size={10} fill="currentColor" /> Artisan
                  </div>
               </div>
               <Link to="/dashboard/settings" className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary p-[1px] transition-transform hover:scale-105 active:scale-95 group">
                  <div className="w-full h-full rounded-[15px] bg-slate-900 overflow-hidden border border-white/10">
                     <img src={`https://ui-avatars.com/api/?name=${user?.username || 'A'}&background=random&color=white`} alt="Avatar" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
               </Link>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 px-8 pb-12 overflow-y-auto">
           <div className="max-w-7xl mx-auto">
              <Outlet />
           </div>
        </main>
      </div>
    </div>
  );
}
