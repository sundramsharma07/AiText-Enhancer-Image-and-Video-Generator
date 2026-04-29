import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function TermsOfService() {
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
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-8">Terms of Service</h1>
          
          <div className="space-y-8 text-textMuted leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p>By accessing and using PEN AI, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our platform.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. User Responsibilities</h2>
              <p>You are responsible for the content you generate using PEN AI. You agree not to use the platform to violate any laws, infringe on intellectual property rights, or distribute malicious code.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Service Availability</h2>
              <p>While we strive to provide uninterrupted access to our creative tools, PEN AI is provided "as is" and "as available". We reserve the right to modify, suspend, or discontinue the service at any time without notice.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Intellectual Property</h2>
              <p>The content you generate using PEN AI belongs to you, subject to the terms of the underlying AI models (such as Pollinations AI). However, the PEN AI platform, its code, design, and original assets remain the exclusive property of PEN AI STUDIO.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Limitation of Liability</h2>
              <p>PEN AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Contact Us</h2>
              <p className="flex flex-wrap items-center gap-2">
                If you have any questions about these terms, contact us through our official 
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
