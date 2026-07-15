import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  Clock, 
  ArrowRight, 
  Zap,
  Star,
  Activity,
  Wand2,
  Feather
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="glass-card p-8 rounded-3xl flex items-center gap-6 hover:-translate-y-1 transition-all cursor-default group">
    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-bold text-textMain tracking-tight">{value}</p>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({ totalDocs: 0, totalWords: 0, timeSaved: 0 });
  const [recentDocs, setRecentDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, docsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${import.meta.env.VITE_API_URL}/api/documents`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        if (docsRes.ok) {
          const docsData = await docsRes.json();
          setRecentDocs(docsData.slice(0, 3));
        }
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchData();
  }, [token]);

  return (
    <div className="flex flex-col gap-10 min-h-screen">
      {/* Welcome Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest mb-4 border border-primary/20 px-3 py-1 rounded-full bg-primary/5"
          >
            <Activity size={14} /> Analytics Live
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-textMain">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{user?.username || 'Writer'}</span>.
          </h2>
          <p className="text-textMuted mt-4 text-lg max-w-xl leading-relaxed">
            Your creative output has increased by <span className="text-textMain font-bold">12%</span> this week. Ready for the next masterpiece?
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <Link to="/enhancer" className="btn-premium px-10 py-5 flex items-center justify-center gap-3 text-lg font-bold shadow-2xl group flex-1">
            <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Artistic Enhancer
          </Link>
          <Link to="/creator-lab" className="bg-white border border-[#e3e6f3] hover:bg-[#f3f5ff] px-10 py-5 flex items-center justify-center gap-3 text-lg font-bold rounded-2xl transition-all flex-1 group shadow-sm">
            <Wand2 size={20} className="group-hover:text-primary transition-colors hover:rotate-12" /> Creative Lab
          </Link>
          <Link to="/shayari-generator" className="bg-white border border-[#e3e6f3] hover:bg-[#f3f5ff] px-10 py-5 flex items-center justify-center gap-3 text-lg font-bold rounded-2xl transition-all flex-1 group shadow-sm">
            <Feather size={20} className="group-hover:text-primary transition-colors" /> Shayari
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={FileText} 
          label="Documents Processed" 
          value={loading ? "..." : stats.totalDocs} 
          color="from-primary to-purple-600" 
        />
        <StatCard 
          icon={Zap} 
          label="Words Enhanced" 
          value={loading ? "..." : (stats.totalWords > 1000 ? (stats.totalWords/1000).toFixed(1) + 'k' : stats.totalWords)} 
          color="from-secondary to-rose-600" 
        />
        <StatCard 
          icon={Clock} 
          label="Estimated Time Saved" 
          value={loading ? "..." : stats.timeSaved + ' hrs'} 
          color="from-accent to-emerald-600" 
        />
      </div>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex items-center justify-between">
             <h3 className="text-2xl font-bold text-textMain tracking-tight">Recent Studio Sessions</h3>
             <Link to="/history" className="text-[10px] font-bold text-primary hover:text-primary-light flex items-center gap-1 uppercase tracking-widest transition-colors">
               Full Archive <ArrowRight size={14} />
             </Link>
          </div>
          
          <div className="space-y-4">
            {recentDocs.length > 0 ? (
              recentDocs.map((doc, i) => (
                <motion.div
                  key={doc._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-panel p-6 rounded-3xl flex items-center justify-between group cursor-pointer hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-center gap-6">
                     <div className="w-12 h-12 rounded-xl bg-[#f3f5ff] border border-[#e3e6f3] flex items-center justify-center text-textMuted group-hover:text-primary transition-colors">
                        <FileText size={20} />
                     </div>
                     <div>
                        <h4 className="font-bold text-textMain line-clamp-1 group-hover:text-primary transition-colors">{doc.title}</h4>
                        <div className="flex items-center gap-3 mt-1">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-textMuted">
                             {formatDistanceToNow(new Date(doc.createdAt))} ago
                           </span>
                           <span className="w-1 h-1 rounded-full bg-textMuted/30" />
                           <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{doc.toneUsed}</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-8">
                     <span className="hidden md:block px-4 py-1.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">
                        Polished
                      </span>
                     <div className="w-10 h-10 rounded-full bg-[#f3f5ff] flex items-center justify-center text-textMuted group-hover:text-primary transition-all transform group-hover:translate-x-1">
                        <ArrowRight size={18} />
                     </div>
                  </div>
                </motion.div>
              ))
            ) : (
                <div className="glass-panel p-12 rounded-[40px] text-center">
                    <p className="text-textMuted italic">No recent sessions found. Start your first enhancement above.</p>
                </div>
            )}
          </div>
        </div>

        {/* AI Insights */}
        <div className="flex flex-col gap-6">
           <h3 className="text-2xl font-bold text-textMain tracking-tight">Studio Insights</h3>
           <div className="glass-panel bg-gradient-to-br from-primary/10 to-white rounded-[40px] p-8 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10 text-center flex flex-col items-center">
                 <div className="w-16 h-16 rounded-2xl bg-white border border-[#e3e6f3] flex items-center justify-center shadow-2xl mb-8">
                    <Star size={28} className="text-primary animate-pulse" />
                 </div>
                 <h4 className="font-bold text-2xl mb-4 text-textMain">Writing Momentum</h4>
                 <p className="text-sm text-textMuted leading-relaxed mb-8">
                    "Consistency is the key to mastery. You've processed <span className="text-textMain font-bold">12 documents</span> this month. Keep the flow alive."
                 </p>
                 <Link to="/stats" className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] hover:text-secondary transition-colors">
                    Detailed Report
                 </Link>
              </div>
           </div>

           <div className="glass-panel p-8 rounded-[40px]">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-textMuted mb-8 border-b border-[#e3e6f3] pb-4">Studio Protocol</h4>
              <ul className="space-y-6">
                 {[
                   "Synchronize your mobile captures directly.",
                   "Deploy Creative mode for poetic license.",
                   "Review Archive for style consistency."
                 ].map((tip, i) => (
                   <li key={i} className="flex gap-4 text-xs font-medium text-textMuted leading-relaxed hover:text-textMain transition-colors cursor-default group">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0 group-hover:scale-150 transition-transform" />
                      {tip}
                   </li>
                 ))}
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
}
