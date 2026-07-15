import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Compass, Eye, ShieldCheck, Sparkles, UploadCloud } from 'lucide-react';
import MarketingNav from '../components/MarketingNav';

const steps = [
  'Sign in to unlock the dashboard and creator tools.',
  'Pick the tool you need: enhancer, creator lab, poetry studio, shayari, or artisan cards.',
  'Write a clear prompt with tone, audience, language, size, and purpose.',
  'Review the result carefully, edit it in your own style, then download or post it.'
];

const doItems = [
  'Use specific prompts and include context.',
  'Check generated facts before sharing.',
  'Post only polished work that you are comfortable showing publicly.',
  'Use the showcase to discover ideas from other creators.'
];

const dontItems = [
  'Do not enter passwords, API keys, bank information, or private documents.',
  'Do not publish harmful, hateful, vulgar, explicit, or misleading content.',
  'Do not copy someone else’s private work without permission.',
  'Do not treat AI output as final professional advice without review.'
];

export default function Info() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-app-bg px-4 py-6 text-textMain sm:px-6 lg:px-8">
      <div className="soft-page-bg absolute inset-0 pointer-events-none" />
      <motion.main
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mx-auto my-10 max-w-7xl bg-white shadow-[0_22px_55px_rgba(68,75,125,0.18)] ring-1 ring-black/5"
      >
        <MarketingNav />

        <section className="px-6 pb-14 pt-8 md:px-14">
          <div className="max-w-3xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full bg-[#f5f6ff] px-4 py-2 text-xs font-semibold text-accent">
              <UploadCloud size={14} /> Website information
            </div>
            <h1 className="text-5xl font-bold leading-[1.05] text-[#29334a] sm:text-6xl">
              How to use PEN AI responsibly
            </h1>
            <p className="mt-6 text-base leading-8 text-textMuted">
              PEN AI is a creative assistant. It helps you draft, generate, enhance, and present ideas, but the final judgment should always be yours.
            </p>
          </div>
        </section>

        <section className="grid gap-5 px-6 pb-14 md:grid-cols-4 md:px-14">
          {steps.map((step, index) => (
            <div key={step} className="bg-[#f8f9ff] p-6">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">{index + 1}</div>
              <p className="text-sm leading-7 text-textMuted">{step}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-8 border-t border-[#eef0f8] px-6 py-14 md:grid-cols-3 md:px-14">
          <div className="bg-[#34364f] p-8 text-white">
            <Compass className="mb-6 text-secondary" size={34} />
            <h2 className="text-3xl font-bold">Best workflow</h2>
            <p className="mt-4 text-sm leading-7 text-white/70">
              Think of the website as a drafting partner: give a clear brief, compare outputs, edit the result, and publish only when it feels accurate and personal.
            </p>
          </div>
          <div className="p-8 shadow-[0_14px_30px_rgba(68,75,125,0.1)]">
            <CheckCircle2 className="mb-6 text-primary" size={34} />
            <h2 className="text-3xl font-bold text-[#29334a]">What to do</h2>
            <ul className="mt-5 space-y-4">
              {doItems.map((item) => <li key={item} className="text-sm leading-6 text-textMuted">{item}</li>)}
            </ul>
          </div>
          <div className="p-8 shadow-[0_14px_30px_rgba(68,75,125,0.1)]">
            <AlertTriangle className="mb-6 text-secondary" size={34} />
            <h2 className="text-3xl font-bold text-[#29334a]">What not to do</h2>
            <ul className="mt-5 space-y-4">
              {dontItems.map((item) => <li key={item} className="text-sm leading-6 text-textMuted">{item}</li>)}
            </ul>
          </div>
        </section>

        <section className="grid gap-5 bg-[#f8f9ff] px-6 py-12 md:grid-cols-2 md:px-14">
          <div className="flex gap-4">
            <ShieldCheck className="mt-1 shrink-0 text-primary" />
            <p className="text-sm leading-7 text-textMuted">Public showcase posts are moderated for unsafe wording before they are posted. Keep uploads clean, respectful, and original.</p>
          </div>
          <div className="flex gap-4">
            <Eye className="mt-1 shrink-0 text-accent" />
            <p className="text-sm leading-7 text-textMuted">Images posted to the showcase are visible to other users, so do not post private photos or sensitive content.</p>
          </div>
        </section>
      </motion.main>
    </div>
  );
}
