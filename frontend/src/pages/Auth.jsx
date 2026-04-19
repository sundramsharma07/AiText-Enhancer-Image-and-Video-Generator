import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowLeft, ArrowRight, Sparkles, Compass, ChevronRight } from 'lucide-react';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const InputField = ({ label, type, placeholder, icon: Icon, value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative group">
      <label className={`absolute left-12 transition-all duration-300 pointer-events-none ${
        isFocused || value ? '-top-3 text-[10px] text-primary font-bold uppercase tracking-widest' : 'top-3.5 text-textMuted text-sm'
      }`}>
        {label}
      </label>
      <div className="flex items-center">
        <div className={`absolute left-4 transition-colors ${isFocused ? 'text-primary' : 'text-textMuted'}`}>
          <Icon size={18} />
        </div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-12 py-3.5 text-textMain outline-none transition-all ${
            isFocused ? 'border-primary/50 bg-white/[0.08] shadow-[0_0_20px_rgba(168,85,247,0.1)]' : 'hover:border-white/20'
          }`}
          placeholder={isFocused ? placeholder : ""}
        />
      </div>
    </div>
  );
};

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    const body = isLogin 
      ? { email, password } 
      : { username: name, email, password };

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        const errorText = data.error || data.message || "Authentication failed";
        console.error(`Auth Error [${response.status}]:`, data);
        throw new Error(errorText);
      }

      login(data, data.token);
      navigate('/enhancer');
    } catch (err) {
      console.error("Auth Exception:", err);
      setErrorMsg(err.message || "Connection refused. Check if the backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-app-bg text-textMain">
      {/* Decorative Orbs */}
      <div className="absolute top-[10%] left-[15%] w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-float" />
      <div className="absolute bottom-[20%] right-[15%] w-80 h-80 bg-secondary/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Brand */}
        <div className="flex justify-center mb-12">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                <Sparkles size={20} />
              </div>
              <span className="text-2xl font-serif font-bold tracking-tighter">PEN AI</span>
            </Link>
        </div>

        <div className="glass-card rounded-3xl p-8 md:p-10 border-white/[0.05] relative overflow-hidden">
           {loading && (
             <div className="absolute top-0 left-0 w-full h-1 overflow-hidden bg-white/[0.05]">
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="h-full bg-gradient-to-r from-primary via-secondary to-accent"
                />
             </div>
           )}

           <div className="text-center mb-10">
              <h2 className="text-3xl font-serif font-bold mb-3 tracking-tight">
                {isLogin ? "Welcome back Studio" : "Join the creative Studio"}
              </h2>
              <p className="text-textMuted text-sm">
                 {isLogin 
                   ? "Every stroke tells a story. Continue yours." 
                   : "Unlock the professional level of your handwriting."}
              </p>
              
              <AnimatePresence>
                {errorMsg && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-bold uppercase tracking-widest"
                  >
                    {errorMsg}
                  </motion.div>
                )}
              </AnimatePresence>
           </div>

           <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    key="name"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <InputField 
                      label="Username" 
                      type="text" 
                      placeholder="Your unique handle" 
                      icon={User} 
                      value={name} 
                      onChange={setName} 
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <InputField 
                label="Email Address" 
                type="email" 
                placeholder="name@example.com" 
                icon={Mail} 
                value={email} 
                onChange={setEmail} 
              />

              <InputField 
                label="Password" 
                type="password" 
                placeholder="••••••••" 
                icon={Lock} 
                value={password} 
                onChange={setPassword} 
              />

              <button 
                type="submit" 
                disabled={loading}
                className="w-full btn-premium py-4 font-bold text-lg mt-4 disabled:opacity-50"
              >
                {loading ? "Authorizing..." : isLogin ? "Sign In" : "Create Account"}
                {!loading && <ChevronRight size={20} className="ml-1" />}
              </button>
           </form>

           <p className="text-center mt-10 text-xs font-medium text-textMuted">
              {isLogin ? "Ready to begin? " : "Already an artist? "}
              <button 
                onClick={() => setIsLogin(!isLogin)} 
                className="text-primary font-bold hover:text-primary-light transition-colors uppercase tracking-widest ml-1"
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
           </p>
        </div>

        {/* Back Link */}
        <div className="text-center mt-8">
           <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-textMuted hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
          >
            <ArrowLeft size={14} /> Back to Studio Entry
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
