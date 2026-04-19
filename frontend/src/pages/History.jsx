import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Search, Filter, Calendar, ArrowRight, Trash2, Download, MoreVertical, Sparkles } from 'lucide-react';
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
      const response = await fetch('http://localhost:5000/api/documents', {
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
      const response = await fetch(`http://localhost:5000/api/documents/${id}`, {
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

  return (
    <div className="flex flex-col gap-10 min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
           <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest mb-4 border border-primary/20 px-3 py-1 rounded-full bg-primary/5 w-fit">
              <Sparkles size={12} /> Studio Archive
           </div>
           <h2 className="text-5xl font-serif font-bold tracking-tighter text-white">Document History</h2>
           <p className="text-textMuted mt-4 text-lg italic leading-relaxed">
              Every masterpiece you've ever crafted, <span className="text-white">preserved in time.</span>
           </p>
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative group flex-1 lg:flex-none">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-textMuted group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search history..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-14 pr-6 py-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl text-sm outline-none focus:bg-white/[0.05] focus:border-primary/50 transition-all w-full lg:w-80 text-textMain"
            />
          </div>
          <button className="p-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl text-textMuted hover:text-white transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-[40px] overflow-hidden border-white/[0.05] bg-white/[0.01]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.05] bg-white/[0.02]">
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-textMuted">Document Entity</th>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-textMuted">Timestamp</th>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-textMuted">AI Profile</th>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-textMuted">State</th>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-textMuted text-right">Operations</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="border-b border-white/[0.03]">
                      <td colSpan="5" className="px-10 py-8">
                        <div className="h-6 bg-white/[0.03] rounded-xl w-full animate-pulse"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-10 py-32 text-center text-textMuted">
                       <div className="flex flex-col items-center opacity-20">
                          <FileText size={64} className="mb-6 stroke-1" />
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
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-textMuted group-hover:text-primary transition-colors">
                            <FileText size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-white group-hover:text-primary transition-colors text-lg tracking-tight line-clamp-1">{doc.title}</p>
                            <p className="text-[10px] text-textMuted font-medium uppercase tracking-widest mt-1 line-clamp-1 max-w-[250px]">ID: {doc._id.substring(0,8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-2 text-textMuted text-xs font-semibold">
                          <Calendar size={14} className="opacity-50" />
                          {format(new Date(doc.createdAt), 'MMM dd, yyyy')}
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
                          {doc.toneUsed}
                        </span>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]"></div>
                          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Encoded</span>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center justify-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleDownload(doc)}
                            title="Download" 
                            className="p-3 rounded-xl hover:bg-white/[0.08] text-textMuted hover:text-white transition-all"
                          >
                             <Download size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(doc._id)}
                            disabled={deletingId === doc._id}
                            title="Delete" 
                            className={`p-3 rounded-xl transition-all ${deletingId === doc._id ? 'opacity-50 cursor-not-allowed' : 'hover:bg-rose-500/10 text-textMuted hover:text-rose-500'}`}
                          >
                             <Trash2 size={18} className={deletingId === doc._id ? 'animate-pulse' : ''} />
                          </button>
                          <div className="w-px h-6 bg-white/[0.05] mx-2" />
                          <button title="Options" className="p-3 rounded-xl hover:bg-white/[0.08] text-textMuted transition-all">
                             <MoreVertical size={18} />
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
    </div>
  );
}
