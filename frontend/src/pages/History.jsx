import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Search, Filter, Calendar, Trash2, Download, MoreVertical, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

export default function History() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { token } = useAuth();
  const [deletingId, setDeletingId] = useState(null);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/documents`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setDocuments(data);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchHistory();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to expunge this entry from your history? This action is irreversible.")) return;
    
    setDeletingId(id);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/documents/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setDocuments(prev => prev.filter(doc => doc._id !== id));
      } else {
        alert("Failed to delete document.");
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = (doc) => {
    const element = document.createElement("a");
    const file = new Blob([
      `DOCUMENT: ${doc.title}\n`,
      `TIMESTAMP: ${new Date(doc.createdAt).toLocaleString()}\n`,
      `TONE: ${doc.toneUsed}\n`,
      `------------------------------------------\n\n`,
      `ORIGINAL TEXT:\n${doc.originalText}\n\n`,
      `ENHANCED TEXT:\n${doc.enhancedText}`
    ], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${doc.title.replace(/\s+/g, '_')}_enhanced.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const filteredDocs = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.originalText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Skeleton loader row/card
  const SkeletonRow = ({ isMobile }) => (
    isMobile ? (
      <div className="glass-card rounded-3xl p-5 animate-pulse border-white/[0.05]">
        <div className="h-4 bg-white/[0.05] rounded-xl w-3/4 mb-3" />
        <div className="h-3 bg-white/[0.03] rounded-xl w-1/2" />
      </div>
    ) : (
      <tr className="border-b border-white/[0.03]">
        <td colSpan="5" className="px-10 py-8">
          <div className="h-6 bg-white/[0.03] rounded-xl w-full animate-pulse" />
        </td>
      </tr>
    )
  );

  return (
    <div className="flex flex-col gap-8 min-h-screen pb-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
           <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest mb-4 border border-primary/20 px-3 py-1 rounded-full bg-primary/5 w-fit">
              <Sparkles size={12} /> Studio Archive
           </div>
           <h2 className="text-4xl sm:text-5xl font-serif font-bold tracking-tighter text-textMain">Document History</h2>
           <p className="text-textMuted mt-4 text-base sm:text-lg italic leading-relaxed">
              Every masterpiece you've ever crafted, <span className="text-textMain">preserved in time.</span>
           </p>
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative group flex-1 lg:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted group-focus-within:text-primary transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search history..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3.5 bg-white border border-[#e3e6f3] rounded-2xl text-sm outline-none focus:bg-white focus:border-primary/50 transition-all w-full lg:w-72 text-textMain shadow-sm"
            />
          </div>
          <button className="p-3.5 bg-white border border-[#e3e6f3] rounded-2xl text-textMuted hover:text-textMain transition-all shrink-0">
            <Filter size={16} />
          </button>
        </div>
      </div>

      {/* ── DESKTOP TABLE (md and above) ── */}
      <div className="hidden md:block glass-panel rounded-[32px] overflow-hidden border-white/[0.05] bg-white/[0.01]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-white/[0.05] bg-white/[0.02]">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-textMuted">Document Entity</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-textMuted">Timestamp</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-textMuted">AI Profile</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-textMuted">State</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-textMuted text-right">Operations</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {loading ? (
                  Array(4).fill(0).map((_, i) => <SkeletonRow key={i} isMobile={false} />)
                ) : filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-10 py-28 text-center text-textMuted">
                       <div className="flex flex-col items-center opacity-20">
                          <FileText size={56} className="mb-6 stroke-1" />
                          <p className="font-serif text-2xl">No artifacts found in the void.</p>
                          <p className="text-xs uppercase tracking-widest mt-2">{searchTerm ? 'Try a different query' : 'Awaiting your first creation'}</p>
                       </div>
                    </td>
                  </tr>
                ) : (
                  filteredDocs.map((doc, i) => (
                    <motion.tr 
                      key={doc._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-all group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-textMuted group-hover:text-primary transition-colors shrink-0">
                            <FileText size={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-textMain group-hover:text-primary transition-colors tracking-tight truncate max-w-[240px]">{doc.title}</p>
                            <p className="text-[10px] text-textMuted font-medium uppercase tracking-widest mt-0.5">ID: {doc._id.substring(0,8)}</p>
                            <p className="mt-1 max-w-[260px] truncate text-xs leading-5 text-textMuted">{doc.enhancedText}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-textMuted text-xs font-semibold whitespace-nowrap">
                          <Calendar size={13} className="opacity-50" />
                          {format(new Date(doc.createdAt), 'MMM dd, yyyy')}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20 whitespace-nowrap">
                          {doc.toneUsed}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]" />
                          <span className="text-[10px] font-bold text-textMain uppercase tracking-widest">Encoded</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleDownload(doc)}
                            title="Download" 
                            className="p-2.5 rounded-xl hover:bg-[#f3f5ff] text-textMuted hover:text-textMain transition-all"
                          >
                             <Download size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(doc._id)}
                            disabled={deletingId === doc._id}
                            title="Delete" 
                            className={`p-2.5 rounded-xl transition-all ${deletingId === doc._id ? 'opacity-50 cursor-not-allowed' : 'hover:bg-rose-500/10 text-textMuted hover:text-rose-500'}`}
                          >
                             <Trash2 size={16} className={deletingId === doc._id ? 'animate-pulse' : ''} />
                          </button>
                          <div className="w-px h-5 bg-white/[0.05] mx-1" />
                          <button title="Options" className="p-2.5 rounded-xl hover:bg-white/[0.08] text-textMuted transition-all">
                             <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MOBILE CARD LIST (below md) ── */}
      <div className="flex flex-col gap-4 md:hidden">
        {loading ? (
          Array(4).fill(0).map((_, i) => <SkeletonRow key={i} isMobile={true} />)
        ) : filteredDocs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 opacity-20 text-center">
            <FileText size={48} className="mb-4 stroke-1 text-textMuted" />
            <p className="font-serif text-xl text-textMain">No artifacts found in the void.</p>
            <p className="text-xs uppercase tracking-widest mt-2 text-textMuted">
              {searchTerm ? 'Try a different query' : 'Awaiting your first creation'}
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredDocs.map((doc, i) => (
              <motion.div
                key={doc._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ delay: i * 0.04 }}
                className="glass-card rounded-2xl p-5 border-white/[0.05] hover:border-white/10 transition-all"
              >
                {/* Card Top Row */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-primary shrink-0 mt-0.5">
                    <FileText size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-textMain tracking-tight leading-tight truncate">{doc.title}</p>
                    <p className="text-[10px] text-textMuted font-medium uppercase tracking-widest mt-0.5">
                      ID: {doc._id.substring(0, 8)}
                    </p>
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-textMuted">{doc.enhancedText}</p>
                  </div>
                  {/* Status dot */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  </div>
                </div>

                {/* Card Meta Row */}
                <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-white/[0.05]">
                  <div className="flex items-center gap-1.5 text-textMuted text-xs font-semibold">
                    <Calendar size={12} className="opacity-60" />
                    {format(new Date(doc.createdAt), 'MMM dd, yyyy')}
                  </div>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                    {doc.toneUsed}
                  </span>
                  <span className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Encoded</span>
                </div>

                {/* Card Action Row */}
                <div className="flex items-center gap-2 mt-4">
                  <button 
                    onClick={() => handleDownload(doc)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white border border-[#e3e6f3] text-textMuted hover:text-textMain hover:bg-[#f3f5ff] transition-all text-xs font-bold uppercase tracking-wider"
                  >
                    <Download size={14} /> Download
                  </button>
                  <button 
                    onClick={() => handleDelete(doc._id)}
                    disabled={deletingId === doc._id}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${
                      deletingId === doc._id 
                        ? 'opacity-50 cursor-not-allowed bg-white/[0.03] border-white/[0.06] text-textMuted' 
                        : 'bg-rose-500/5 border-rose-500/20 text-rose-500 hover:bg-rose-500/10'
                    }`}
                  >
                    <Trash2 size={14} className={deletingId === doc._id ? 'animate-pulse' : ''} />
                    {deletingId === doc._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
