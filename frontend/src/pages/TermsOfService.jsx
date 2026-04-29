import React from 'react';
import { motion } from 'framer-motion';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-app-bg pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 md:p-12 rounded-[40px] border border-white/[0.05]"
        >
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
          </div>
        </motion.div>
      </div>
    </div>
  );
}
