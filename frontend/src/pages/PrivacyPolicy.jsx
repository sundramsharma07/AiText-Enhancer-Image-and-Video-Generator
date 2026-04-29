import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-app-bg pt-24 pb-12 px-6 relative">

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 md:p-12 rounded-[40px] border border-white/[0.05] relative group"
        >
          <Link 
            to="/" 
            className="absolute top-6 right-6 md:top-10 md:right-10 w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-textMuted hover:text-white hover:bg-primary transition-all hover:rotate-90 z-10"
            title="Close"
          >
            <X size={20} />
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-8">Privacy Policy</h1>
          
          <div className="space-y-8 text-textMuted leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
              <p>When you use PEN AI, we collect minimal data necessary to provide our services. This includes your account information (if you create one) and the creative inputs you provide to our AI models to generate text, images, or code.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. How to Use PEN AI</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-primary">Do</strong> use our platform to enhance your creativity, write better code, and generate stunning visuals.</li>
                <li><strong className="text-primary">Do</strong> experiment with different prompts to get the best results from our AI engines.</li>
                <li><strong className="text-primary">Do</strong> share your generated creations, provided they comply with our community guidelines.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. What NOT to Do</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-red-400">Do not</strong> use PEN AI to generate harmful, illegal, or explicit content.</li>
                <li><strong className="text-red-400">Do not</strong> attempt to reverse engineer or scrape our APIs.</li>
                <li><strong className="text-red-400">Do not</strong> use the platform to harass others or generate deceptive information (deepfakes, misinformation).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
              <p>We implement industry-standard security measures to protect your creative data. Your private inputs are not used to train public AI models without your explicit consent.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Contact Us</h2>
              <p className="flex flex-wrap items-center gap-2">
                If you have any questions, contact us through our official 
                <a href="https://github.com/sundramsharma07" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-primary hover:text-white transition-colors font-bold">
                  <FaGithub size={16} /> GitHub
                </a> 
                or 
                <a href="https://www.linkedin.com/in/sundaram-sharma-108a1b297/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-primary hover:text-white transition-colors font-bold">
                  <FaLinkedin size={16} /> LinkedIn
                </a> 
                channels.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
