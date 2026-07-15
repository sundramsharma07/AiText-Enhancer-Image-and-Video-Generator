import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  BookOpenText,
  Check,
  Image as ImageIcon,
  Mail,
  Sparkles,
  Wand2
} from 'lucide-react';
import MarketingNav from '../components/MarketingNav';

const tools = [
  { icon: Wand2, title: 'Artistic Enhancer', text: 'Polish rough writing into clear, expressive text.' },
  { icon: ImageIcon, title: 'Creator Lab', text: 'Generate images, video ideas, audio, and card artwork.' },
  { icon: BookOpenText, title: 'Poetry and Shayari', text: 'Compose poems and shayari in English or Hindi.' }
];

const pageLinks = [
  { title: 'About', text: 'What PEN AI is built for.', to: '/about' },
  { title: 'Info', text: 'Simple guide for the website.', to: '/info' },
  { title: 'Showcase', text: 'See generated posts.', to: '/showcase' }
];

function HeroIllustration() {
  return (
    <div className="relative min-h-[360px] md:min-h-[470px] w-full">
      <motion.span
        animate={{ y: [0, -10, 0], rotate: [-2, 1, -2] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute right-2 top-4 z-20 rounded-full bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-primary shadow-[0_12px_28px_rgba(68,75,125,0.16)]"
      >
        Create freely
      </motion.span>
      <motion.span
        animate={{ y: [0, 12, 0], x: [0, 4, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        className="absolute bottom-20 left-0 z-20 rounded-full bg-[#34364f] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-[0_12px_28px_rgba(68,75,125,0.2)]"
      >
        Make it yours
      </motion.span>
      <div className="absolute inset-x-4 bottom-6 top-12 rounded-[46%] bg-[#e9edff]" />
      <div className="absolute left-8 bottom-4 h-32 w-16 rounded-t-full bg-[#4965ff]/15" />
      <div className="absolute left-12 bottom-4 h-44 w-3 rounded-full bg-[#f05a24]" />
      <div className="absolute left-2 bottom-0 h-16 w-24 rounded-tl-[28px] rounded-br-[10px] bg-[#ff5a28]" />
      <div className="absolute left-14 bottom-0 h-28 w-24 rounded-tl-[30px] rounded-br-[12px] bg-[#30344f]" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="absolute left-12 top-24 w-28 rounded-xl bg-gradient-to-br from-primary to-secondary p-3 shadow-xl"
      >
        <div className="mb-3 flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-white">
            <div className="h-full w-full rounded-full border-[10px] border-[#ffe0a8] border-r-white" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="h-2 rounded-full bg-white/85" />
            <div className="h-2 rounded-full bg-white/75" />
            <div className="h-2 rounded-full bg-white/65" />
          </div>
        </div>
        <div className="grid grid-cols-5 gap-1">
          {Array.from({ length: 15 }).map((_, i) => (
            <span key={i} className="h-1.5 rounded-full bg-white/50" />
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute right-28 top-16 flex h-20 w-20 items-center justify-center rounded-b-[10px] bg-[#ffc85a] shadow-xl"
      >
        <Mail className="absolute -top-3 right-3 text-accent" size={24} />
        <span className="text-2xl font-bold text-accent">@</span>
      </motion.div>

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        className="absolute right-12 top-36 w-56 rounded-t-2xl bg-white shadow-xl"
      >
        <div className="h-4 rounded-t-2xl bg-secondary" />
        <div className="grid grid-cols-3 gap-3 p-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className="h-8 rounded-md bg-[#eef0f8]" />
          ))}
        </div>
      </motion.div>

      <div className="absolute right-4 top-24 h-5 w-36 rounded-sm bg-[#3a3d59]">
        <span className="ml-3 inline-flex gap-1 pt-2">
          <i className="h-1 w-1 rounded-full bg-white" />
          <i className="h-1 w-1 rounded-full bg-white" />
          <i className="h-1 w-1 rounded-full bg-white" />
        </span>
      </div>

      <div className="absolute right-5 bottom-28 w-20 rounded-lg bg-white p-3 shadow-xl">
        {[0, 1, 2].map((i) => (
          <div key={i} className="mb-2 flex items-center gap-2 last:mb-0">
            <Check className="text-secondary" size={13} />
            <span className="h-1.5 flex-1 rounded-full bg-[#dfe3ef]" />
          </div>
        ))}
      </div>

      <div className="absolute left-[39%] bottom-10 h-24 w-[46%] rounded-t-xl bg-[#3a3d59]" />
      <div className="absolute left-[37%] bottom-[118px] h-3 w-[52%] rounded-full bg-[#55586f]" />
      <div className="absolute left-[51%] bottom-10 h-32 w-4 rotate-12 rounded-full bg-[#3a3d59]" />
      <div className="absolute left-[74%] bottom-10 h-32 w-4 -rotate-12 rounded-full bg-[#3a3d59]" />

      <div className="absolute left-[47%] bottom-[126px] h-24 w-20 rounded-t-full bg-white shadow-lg">
        <div className="absolute left-5 top-[-28px] h-14 w-14 rounded-full bg-[#ff7a32]" />
        <div className="absolute left-8 top-[-16px] h-9 w-9 rounded-full bg-[#f5c7aa]" />
        <div className="absolute left-8 top-20 h-20 w-28 origin-top-left rotate-[-6deg] rounded-2xl bg-[#5065e9]" />
        <div className="absolute left-24 top-28 h-24 w-9 origin-top rotate-[-35deg] rounded-full bg-[#5065e9]" />
        <div className="absolute left-5 top-10 h-14 w-24 rounded-md bg-[#30344f]" />
      </div>

      <motion.div
        animate={{ y: [0, 9, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        className="absolute left-[56%] top-32 w-44 rounded-xl bg-white p-4 shadow-xl"
      >
        <BarChart3 className="mb-3 text-accent" size={58} />
        <div className="space-y-2">
          <span className="block h-2 rounded-full bg-[#ffdedc]" />
          <span className="block h-2 w-2/3 rounded-full bg-[#e4e7f4]" />
        </div>
      </motion.div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-app-bg px-3 py-4 text-textMain sm:px-6 lg:px-8">
      <div className="soft-page-bg absolute inset-0 pointer-events-none" />

      <motion.main
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mx-auto mt-4 max-w-7xl bg-white shadow-[0_22px_55px_rgba(68,75,125,0.20)] ring-1 ring-black/5 md:mt-10"
      >
        <MarketingNav />

        <section id="home" className="grid min-h-[520px] items-center gap-8 px-5 pb-10 md:grid-cols-[0.9fr_1.1fr] md:px-10 md:pb-14 lg:px-14">
          <div className="max-w-xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full bg-[#f5f6ff] px-4 py-2 text-xs font-semibold text-accent">
              <Sparkles size={14} /> AI writing dashboard
            </div>
            <h1 className="text-4xl font-bold leading-[1.05] tracking-[-0.01em] text-[#3b3d5d] sm:text-6xl lg:text-7xl">
              Manage your creative dashboard
            </h1>
            <p className="mt-6 max-w-md text-sm leading-7 text-textMuted">
              Bring handwritten notes, poetry, greeting cards, shayari, and visual ideas into one calm AI workspace built for modern creators.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/auth" className="btn-premium rounded-full px-9 py-4 text-sm">
                Get Started <ArrowRight size={16} />
              </Link>
              <Link to="/poetry-studio" className="rounded-full border border-[#e6e8f5] px-8 py-4 text-sm font-semibold text-textMain shadow-sm transition hover:border-primary hover:text-primary">
                Try Poetry
              </Link>
            </div>
          </div>

          <HeroIllustration />
        </section>
      </motion.main>

      <section className="relative mx-auto grid max-w-7xl gap-4 py-8 sm:grid-cols-3 md:py-10">
        {pageLinks.map((page) => (
          <Link
            key={page.to}
            to={page.to}
            className="group flex items-center justify-between gap-4 bg-white px-5 py-4 shadow-[0_12px_28px_rgba(68,75,125,0.10)] transition hover:-translate-y-0.5"
          >
            <span>
              <span className="block text-base font-bold text-[#3b3d5d]">{page.title}</span>
              <span className="mt-1 block text-xs leading-5 text-textMuted">{page.text}</span>
            </span>
            <ArrowRight className="shrink-0 text-secondary transition group-hover:text-primary" size={17} />
          </Link>
        ))}
      </section>

      <section id="features" className="relative mx-auto grid max-w-7xl gap-5 py-8 md:grid-cols-3 md:py-12">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ delay: index * 0.1, duration: 0.45 }}
            whileHover={{ y: -6 }}
            className="rounded-[24px] bg-white p-7 shadow-[0_16px_38px_rgba(68,75,125,0.12)]"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3f5ff] text-primary">
              <tool.icon size={22} />
            </div>
            <h3 className="text-lg font-bold text-[#3b3d5d]">{tool.title}</h3>
            <p className="mt-3 text-sm leading-6 text-textMuted">{tool.text}</p>
          </motion.div>
        ))}
      </section>

      <section className="relative mx-auto mb-14 flex max-w-7xl flex-col items-start justify-between gap-6 bg-[#34364f] px-6 py-10 text-white shadow-[0_18px_42px_rgba(68,75,125,0.18)] md:flex-row md:items-center md:px-14">
        <div>
          <h2 className="text-3xl font-bold">Have a question or idea?</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">
            Contact us for support, feedback, bug reports, collaboration, or suggestions for new writing and creator tools.
          </p>
        </div>
        <Link to="/contact" className="btn-premium rounded-full px-9 py-4 text-sm">
          Contact us <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
