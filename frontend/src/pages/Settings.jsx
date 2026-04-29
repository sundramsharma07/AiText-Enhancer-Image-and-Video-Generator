import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  LogOut,
  Camera,
  ChevronRight,
  ExternalLink,
  Check,
  Clock,
  Smartphone,
  Cpu,
  Sparkles,
  Settings as SettingsIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SettingSection = ({ title, description, children }) => (
  <div className="flex flex-col xl:flex-row gap-12 py-12 border-b border-white/[0.05] last:border-0">
    <div className="xl:w-1/3">
      <h3 className="text-2xl font-serif font-bold text-white mb-3 tracking-tight">{title}</h3>
      <p className="text-sm text-textMuted leading-relaxed max-w-sm">{description}</p>
    </div>
    <div className="xl:w-2/3">
      <div className="glass-panel p-10 rounded-[40px] border-white/[0.08] bg-white/[0.01]">
        {children}
      </div>
    </div>
  </div>
);

const SettingInput = ({ label, value, type = "text", disabled = false, icon: Icon, placeholder, onChange, name }) => (
  <div className="flex flex-col gap-3 mb-8 last:mb-0">
    <label className="text-[10px] font-bold text-textMuted uppercase tracking-[0.2em]">{label}</label>
    <div className="relative group">
      <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${disabled ? 'text-textMuted/50' : 'text-textMuted group-focus-within:text-primary'}`}>
        <Icon size={18} />
      </div>
      <input 
        name={name}
        type={type} 
        value={value} 
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full pl-14 pr-6 py-4 rounded-2xl border border-white/[0.08] text-sm transition-all font-medium ${
          disabled ? 'bg-white/[0.01] text-textMuted/50 cursor-not-allowed' : 'bg-white/[0.03] focus:bg-white/[0.05] focus:border-primary/50 outline-none text-white'
        }`}
      />
    </div>
  </div>
);

export default function Settings() {
  const { user, setUser, logout, token } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [expunging, setExpunging] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username: formData.username })
      });

      const data = await response.json();
      if (response.ok) {
        setUser({ ...user, username: data.username });
        alert("Identity synchronized successfully.");
      } else {
        alert(data.error || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      alert("Neural link failed. Could not update identity.");
    } finally {
      setUpdating(false);
    }
  };

  const handleExpunge = async () => {
    if (!window.confirm("CRITICAL ACTION: Are you sure you want to expunge your entire artistic repository? This will permanently delete all your documents. This cannot be undone.")) return;
    
    setExpunging(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/documents-bulk`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert("Your legacy has been expunged successfully.");
        window.location.href = '/dashboard';
      } else {
        alert("Failed to expunge space.");
      }
    } catch (error) {
      console.error("Expunge error:", error);
    } finally {
      setExpunging(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Identity', icon: User },
    { id: 'security', label: 'Shield', icon: Shield },
    { id: 'engine', label: 'AI Engine', icon: Cpu },
    { id: 'privacy', label: 'Guidelines', icon: Shield },
    { id: 'appearance', label: 'Canvas', icon: Palette }
  ];

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-12 pb-20 mt-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
           <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest mb-4 border border-primary/20 px-3 py-1 rounded-full bg-primary/5 w-fit">
              <SettingsIcon size={12} className="text-primary" /> Studio Preferences
           </div>
           <h2 className="text-5xl font-serif font-bold tracking-tighter text-white">Workspace Control</h2>
           <p className="text-textMuted mt-4 text-lg italic max-w-xl leading-relaxed">
              Refine your <span className="text-white">personal studio</span> environment to complement your unique creative frequency.
           </p>
        </div>
        
        <button 
          onClick={logout}
          className="flex items-center gap-3 text-xs font-bold text-rose-500 hover:bg-rose-500/10 px-8 py-4 rounded-2xl border border-rose-500/20 transition-all uppercase tracking-widest"
        >
          <LogOut size={18} /> Resign Session
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.08] self-start overflow-x-auto max-w-full">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]' 
                : 'text-textMuted hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        <AnimatePresence mode="wait">
          {activeTab === 'profile' && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <SettingSection 
                title="Biological Identity" 
                description="Synchronize your public presence within the studio network. This defines your artistic lineage."
              >
                <div className="flex flex-col md:flex-row items-center gap-10 mb-12 border-b border-white/[0.05] pb-12">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-[40px] bg-gradient-to-tr from-primary to-secondary p-[2px] shadow-2xl group-hover:scale-105 transition-transform duration-500">
                      <div className="w-full h-full rounded-[38px] bg-slate-900 overflow-hidden border border-white/10">
                         <img src={`https://ui-avatars.com/api/?name=${user?.username || 'U'}&background=random&color=white`} alt="Avatar" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    </div>
                    <button className="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl bg-white text-black shadow-2xl flex items-center justify-center hover:bg-primary hover:text-white transition-all transform hover:rotate-6">
                      <Camera size={20} />
                    </button>
                  </div>
                  <div className="text-center md:text-left">
                     <h4 className="text-3xl font-serif font-bold mb-2 text-white tracking-tight">{user?.username}</h4>
                     <p className="text-base text-textMuted mb-4 italic">{user?.email}</p>
                     <div className="flex items-center gap-2 justify-center md:justify-start">
                        <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">Artisan Elite</span>
                        <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">Verified Identity</span>
                     </div>
                  </div>
                </div>

                <form onSubmit={handleUpdateProfile}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <SettingInput 
                        name="username"
                        label="Public Alias" 
                        value={formData.username} 
                        onChange={handleChange}
                        icon={User} 
                      />
                     <SettingInput 
                        name="email"
                        label="Neural Email" 
                        value={formData.email} 
                        icon={Mail} 
                        disabled 
                      />
                  </div>
                  
                  <div className="mt-12 flex justify-end">
                    <button 
                      type="submit"
                      disabled={updating}
                      className={`btn-premium px-10 py-4 shadow-2xl text-base group ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                       {updating ? 'Synchronizing...' : 'Update Identity'} <Check size={20} className="ml-1 group-hover:scale-125 transition-transform" />
                    </button>
                  </div>
                </form>
              </SettingSection>

              <SettingSection 
                title="Geospatial Logic" 
                description="Calibrate the AI's temporal understanding and primary semantic script."
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <SettingInput label="Semantic Script" value="Modern English (Standard)" icon={Globe} />
                   <SettingInput label="Studio Timezone" value="India Standard Time (UTC+5:30)" icon={Clock} disabled />
                </div>
              </SettingSection>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div 
               key="security"
               initial={{ opacity: 0, y: 20 }} 
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
            >
               <SettingSection 
                title="Vault Access" 
                description="Harden your studio archives using advanced encryption protocols and secure access keys."
              >
                <div className="space-y-8">
                   <SettingInput label="Current Private Key" type="password" value="••••••••••••••••" icon={Lock} />
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/[0.05]">
                      <SettingInput label="New Session Secret" type="password" placeholder="Min. 12 characters" icon={Lock} />
                      <SettingInput label="Validate Secret" type="password" placeholder="Re-enter secret" icon={Lock} />
                   </div>
                </div>
                <div className="mt-12 flex justify-end">
                  <button 
                    onClick={() => alert("Security settings are currently managed by the master cluster. Rotation is restricted.")}
                    className="btn-premium px-10 py-4 shadow-2xl"
                  >
                     Rotate Security Keys
                  </button>
                </div>
              </SettingSection>
              
              <SettingSection 
                title="Active Nodes" 
                description="Review the sensory devices currently connected to your AI Studio."
              >
                 <div className="flex items-center justify-between p-6 bg-white/[0.02] rounded-3xl border border-white/[0.08] group hover:bg-white/[0.04] transition-all">
                    <div className="flex items-center gap-6">
                       <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                          <Smartphone size={22} />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-white uppercase tracking-widest">Master Browser Node</p>
                          <p className="text-[10px] text-textMuted uppercase font-bold mt-1">Status: Operational • Location: Mumbai, IN</p>
                       </div>
                    </div>
                    <div className="flex flex-col items-end">
                       <span className="text-[10px] font-bold text-emerald-500 mb-1 px-3 py-1 rounded-full bg-emerald-500/5 uppercase tracking-[0.2em] border border-emerald-500/10">Active Link</span>
                       <span className="text-[8px] text-textMuted uppercase tracking-widest">Secure TLS 1.3</span>
                    </div>
                 </div>
              </SettingSection>
            </motion.div>
          )}

          {activeTab === 'engine' && (
             <motion.div 
               key="engine"
               initial={{ opacity: 0, scale: 0.95 }} 
               animate={{ opacity: 1, scale: 1 }}
               className="py-24 flex flex-col items-center justify-center text-center"
            >
               <div className="w-24 h-24 rounded-[40px] bg-primary/10 border border-primary/20 flex items-center justify-center mb-8 relative">
                  <Cpu size={48} className="text-primary animate-pulse" />
                  <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-full" />
               </div>
               <h3 className="text-3xl font-serif font-bold mb-4 text-white">Engine Calibrations</h3>
               <p className="max-w-md text-textMuted text-base leading-relaxed">
                  We are currently integrating the <span className="text-primary font-bold">Pollinations Pro</span> engine controls. You'll soon be able to fine-tune neural weights and model temperature.
               </p>
            </motion.div>
          )}

          {activeTab === 'privacy' && (
            <motion.div 
               key="privacy"
               initial={{ opacity: 0, y: 20 }} 
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
            >
               <SettingSection 
                title="Ethical Creative Code" 
                description="Our studio is built on the principle of responsible creativity. These guidelines ensure the longevity of the artistic network."
              >
                <div className="space-y-6">
                   <div className="p-6 bg-primary/5 border border-primary/20 rounded-3xl">
                      <h4 className="text-lg font-bold text-primary mb-2 flex items-center gap-2">
                        <Sparkles size={18} /> Resource Preservation
                      </h4>
                      <p className="text-sm text-textMuted leading-relaxed">
                        To maintain high creative fidelity, please <strong>refrain from generating unnecessary or redundant images</strong>. Every generation consumes significant neural bandwidth and artistic energy.
                      </p>
                   </div>
                   
                   <div className="p-6 bg-white/[0.02] border border-white/[0.08] rounded-3xl">
                      <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                        <Shield size={18} /> Content Integrity
                      </h4>
                      <p className="text-sm text-textMuted leading-relaxed">
                        All artistic outputs must adhere to our studio standards. Generating harmful, explicit, or copyright-infringing material is strictly prohibited and may result in session termination.
                      </p>
                   </div>

                   <div className="p-6 bg-white/[0.02] border border-white/[0.08] rounded-3xl">
                      <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                        <Globe size={18} /> Global Resonance
                      </h4>
                      <p className="text-sm text-textMuted leading-relaxed">
                        Respect the creative frequencies of other artisans. The studio is a shared space for collective neural evolution.
                      </p>
                   </div>
                </div>
              </SettingSection>
            </motion.div>
          )}

          {activeTab === 'appearance' && (
            <motion.div 
               key="empty"
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }}
               className="py-24 flex flex-col items-center justify-center text-center opacity-40 px-6"
            >
               <div className="w-20 h-20 rounded-[32px] bg-white/[0.05] flex items-center justify-center mb-8 border border-white/[0.08]">
                  <Palette size={40} className="text-white" />
               </div>
               <h3 className="text-2xl font-serif font-bold mb-3 text-white tracking-tight">Esthetic Lab</h3>
               <p className="max-w-xs text-sm leading-relaxed mx-auto text-textMuted">
                  Customizing the visual frequency of the studio requires precise alignment. Coming soon.
               </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Danger Zone */}
      <div className="mt-16 p-10 glass-panel bg-rose-500/[0.02] border-rose-500/20 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="text-center md:text-left">
            <h4 className="text-2xl font-serif font-bold text-rose-500 mb-2 tracking-tight flex items-center gap-3">
               <Shield size={20} /> Terminal Horizon
            </h4>
            <p className="text-sm text-textMuted max-w-md">Decommissioning your artistic repository is an <span className="text-rose-500 font-bold italic">irreversible process</span>. Your legacy will be expunged.</p>
         </div>
         <button 
          onClick={handleExpunge}
          disabled={expunging}
          className={`px-10 py-4 rounded-2xl bg-white/[0.03] border border-rose-500/30 text-rose-500 font-bold transition-all text-xs uppercase tracking-[0.2em] shadow-2xl ${expunging ? 'opacity-50 cursor-not-allowed' : 'hover:bg-rose-500 hover:text-white'}`}
         >
            {expunging ? 'Expunging...' : 'Expunge Space'}
         </button>
      </div>
    </div>
  );
}

