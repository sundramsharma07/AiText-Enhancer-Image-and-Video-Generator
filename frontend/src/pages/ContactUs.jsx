import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import MarketingNav from '../components/MarketingNav';

export default function ContactUs() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submitForm = (event) => {
    event.preventDefault();
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      '',
      form.message
    ].join('\n');

    window.location.href = `mailto:sundramsharma07@gmail.com?subject=${encodeURIComponent(form.subject || 'PEN AI contact')}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-app-bg px-3 py-4 text-textMain sm:px-6 lg:px-8">
      <div className="soft-page-bg absolute inset-0 pointer-events-none" />

      <motion.main
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mx-auto my-4 max-w-5xl bg-white shadow-[0_18px_42px_rgba(68,75,125,0.16)] ring-1 ring-black/5 md:my-8"
      >
        <MarketingNav />

        <section className="grid gap-7 px-5 pb-8 md:grid-cols-[0.75fr_1.25fr] md:px-10 md:pb-10">
          <div className="pt-2 md:pt-6">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#f5f6ff] px-4 py-2 text-xs font-semibold text-accent">
              <Sparkles size={14} /> Contact PEN AI
            </div>
            <h1 className="text-4xl font-bold leading-[1.05] text-[#3b3d5d] sm:text-5xl">
              Contact us
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-7 text-textMuted">
              Send support questions, suggestions, collaboration notes, or bug reports.
            </p>

            <div className="mt-6 flex gap-3">
              <a
                href="https://github.com/sundramsharma07"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open GitHub profile"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f5f6ff] text-[#29334a] transition hover:bg-primary hover:text-white"
              >
                <FaGithub size={22} />
              </a>
              <a
                href="https://www.linkedin.com/in/sundaram-sharma-108a1b297/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open LinkedIn profile"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f5f6ff] text-[#29334a] transition hover:bg-primary hover:text-white"
              >
                <FaLinkedin size={22} />
              </a>
            </div>
          </div>

          <form onSubmit={submitForm} className="grid gap-4 bg-[#fbfcff] p-4 shadow-[0_12px_28px_rgba(68,75,125,0.10)] sm:grid-cols-2 sm:p-5 md:mt-3">
            <label className="grid gap-2 text-sm font-semibold text-[#3b3d5d]">
              Name
              <input
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                required
                className="rounded-xl border border-[#e3e6f3] bg-white px-4 py-3 text-sm font-normal outline-none focus:border-primary"
                placeholder="Your name"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[#3b3d5d]">
              Email
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                required
                className="rounded-xl border border-[#e3e6f3] bg-white px-4 py-3 text-sm font-normal outline-none focus:border-primary"
                placeholder="you@example.com"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[#3b3d5d] sm:col-span-2">
              Subject
              <input
                value={form.subject}
                onChange={(event) => updateField('subject', event.target.value)}
                required
                className="rounded-xl border border-[#e3e6f3] bg-white px-4 py-3 text-sm font-normal outline-none focus:border-primary"
                placeholder="How can we help?"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[#3b3d5d] sm:col-span-2">
              Message
              <textarea
                value={form.message}
                onChange={(event) => updateField('message', event.target.value)}
                required
                rows={4}
                className="resize-none rounded-xl border border-[#e3e6f3] bg-white px-4 py-3 text-sm font-normal outline-none focus:border-primary"
                placeholder="Write your message"
              />
            </label>
            <button type="submit" className="btn-premium mt-1 rounded-full px-7 py-3 text-sm sm:col-span-2 sm:w-fit">
              Send message <Send size={16} />
            </button>
          </form>
        </section>
      </motion.main>
    </div>
  );
}
