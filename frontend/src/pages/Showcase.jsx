import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Image, MessageCircle, Send, Sparkles } from 'lucide-react';
import MarketingNav from '../components/MarketingNav';
import { useAuth } from '../context/AuthContext';

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

const categories = [
  { id: 'all', label: 'All work' },
  { id: 'artisan-designs', label: 'Artisan designs' },
  { id: 'shayari-generated', label: 'Shayari generated' },
  { id: 'story-generated', label: 'Story generated' },
  { id: 'poetry-generated', label: 'Poetry generated' },
  { id: 'creator-lab', label: 'Creator Lab' }
];

const StarterPosts = [
  {
    _id: 'starter-1',
    title: 'Festival greeting concept',
    description: 'A warm artisan card style with glowing lights and a handwritten message.',
    category: 'artisan-designs',
    mediaType: 'image',
    imageUrl: '',
    authorName: 'PEN AI Studio',
    comments: [{ text: 'A good example of what polished public posts can look like.', name: 'PEN AI' }]
  },
  {
    _id: 'starter-2',
    title: 'Rain and memory shayari',
    description: 'बारिश की बूंदों में यादों का शहर फिर से चमकने लगा.',
    category: 'shayari-generated',
    mediaType: 'text',
    imageUrl: '',
    authorName: 'PEN AI Studio',
    comments: []
  },
  {
    _id: 'starter-3',
    title: 'Dream city visual',
    description: 'Creator Lab prompt result for a cinematic city full of lights and reflections.',
    category: 'creator-lab',
    mediaType: 'image',
    imageUrl: '',
    authorName: 'PEN AI Studio',
    comments: []
  }
];

export default function Showcase() {
  const { token, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [commentText, setCommentText] = useState({});
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/showcase`);
      if (!response.ok) throw new Error('Failed to load showcase');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error(error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'all') return posts;
    return posts.filter((post) => post.category === activeCategory);
  }, [activeCategory, posts]);

  const submitComment = async (postId) => {
    const text = commentText[postId]?.trim();
    if (!text) return;
    if (!isAuthenticated) return alert('Please sign in before commenting.');
    try {
      const response = await fetch(`${API_BASE}/showcase/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Comment failed');
      setPosts((current) => current.map((post) => (post._id === postId ? data : post)));
      setCommentText((current) => ({ ...current, [postId]: '' }));
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-app-bg px-4 py-6 text-textMain sm:px-6 lg:px-8">
      <div className="soft-page-bg absolute inset-0 pointer-events-none" />
      <motion.main
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mx-auto my-10 max-w-7xl bg-white shadow-[0_22px_55px_rgba(68,75,125,0.18)] ring-1 ring-black/5"
      >
        <MarketingNav />

        <section className="px-6 pb-10 pt-8 md:px-14">
          <div className="max-w-4xl font-sans">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full bg-[#f5f6ff] px-4 py-2 text-xs font-semibold text-accent">
              <Sparkles size={14} /> Public creative showcase
            </div>
            <h1 className="font-sans text-5xl font-black leading-[1.05] text-[#29334a] sm:text-6xl">
              Generated work, shared by creators
            </h1>
            <p className="mt-6 text-base leading-8 text-textMuted">
              Only images and writing posted from the creation tools appear here. New generated posts will show as soon as they are published.
            </p>
          </div>
        </section>

        <section className="flex gap-3 overflow-x-auto border-y border-[#eef0f8] px-6 py-5 md:px-14">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`shrink-0 rounded-full px-5 py-2 text-xs font-bold transition ${
                activeCategory === category.id ? 'bg-textMain text-white' : 'bg-[#f5f6ff] text-textMuted hover:text-primary'
              }`}
            >
              {category.label}
            </button>
          ))}
        </section>

        <section className="px-6 py-12 md:px-14">
          {loading ? (
            <div className="flex min-h-[260px] items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            </div>
          ) : filteredPosts.length ? (
            <div className="columns-1 gap-6 md:columns-2 xl:columns-3">
              {filteredPosts.map((post) => (
                <article key={post._id} className="mb-6 break-inside-avoid overflow-hidden bg-[#fbfcff] shadow-[0_14px_32px_rgba(68,75,125,0.12)]">
                  {post.imageUrl ? (
                    <img src={post.imageUrl} alt={post.title} className="w-full object-cover" />
                  ) : (
                    <div className="flex min-h-[260px] items-center justify-center bg-gradient-to-br from-[#f5f6ff] to-white p-8 text-center">
                      <p className="font-serif text-2xl italic leading-relaxed text-[#29334a]">{post.description}</p>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary">
                      <Image size={13} /> {categories.find((item) => item.id === post.category)?.label || post.category}
                    </div>
                    <h2 className="text-xl font-bold text-[#29334a]">{post.title}</h2>
                    {post.imageUrl && post.description && <p className="mt-3 text-sm leading-6 text-textMuted">{post.description}</p>}
                    <p className="mt-4 text-xs font-semibold text-textMuted">By {post.authorName || 'PEN AI Creator'}</p>

                    <div className="mt-6 border-t border-[#eef0f8] pt-5">
                      <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-textMuted">
                        <MessageCircle size={14} /> Comments
                      </div>
                      <div className="space-y-3">
                        {(post.comments || []).slice(-3).map((comment, index) => (
                          <p key={`${post._id}-${index}`} className="rounded-2xl bg-white p-3 text-sm leading-6 text-textMuted">
                            <span className="font-bold text-[#29334a]">{comment.name || 'Creator'}:</span> {comment.text}
                          </p>
                        ))}
                      </div>
                      <div className="mt-4 flex gap-2">
                        <input
                          value={commentText[post._id] || ''}
                          onChange={(event) => setCommentText((current) => ({ ...current, [post._id]: event.target.value }))}
                          placeholder="Write a clean comment..."
                          className="min-w-0 flex-1 rounded-2xl border border-[#e3e6f3] bg-white px-4 py-3 text-sm outline-none focus:border-primary"
                        />
                        <button onClick={() => submitComment(post._id)} className="flex h-12 w-12 items-center justify-center rounded-2xl bg-textMain text-white">
                          <Send size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[260px] items-center justify-center bg-[#fbfcff] p-8 text-center shadow-[0_14px_32px_rgba(68,75,125,0.08)]">
              <p className="max-w-md text-sm leading-7 text-textMuted">
                No generated posts yet. Published creations from Creator Lab, Artisan Cards, Poetry Studio, and Shayari Studio will appear here.
              </p>
            </div>
          )}
        </section>
      </motion.main>
    </div>
  );
}
