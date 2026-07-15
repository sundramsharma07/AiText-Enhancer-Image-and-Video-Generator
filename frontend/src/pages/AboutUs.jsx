import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpenText, Image, LayoutDashboard, PenTool, Sparkles, Wand2 } from 'lucide-react';
import MarketingNav from '../components/MarketingNav';

// Use the newly generated images
import heroImage from '../assets/ai_creativity_workflow.png';
import enhancementImage from '../assets/text_enhancement_process.png';
import studioImage from '../assets/digital_art_studio.png';

const storyBlocks = [
  {
    image: enhancementImage,
    title: 'Transform your thoughts into masterpieces',
    text: 'Experience the magic of neural enhancement. Watch as dull text is instantly polished, restructured, and elevated into vibrant, professional prose using state-of-the-art AI technology.'
  },
  {
    image: studioImage,
    title: 'Your personalized digital art studio',
    text: 'Turn your abstract ideas into breathtaking visual realities. Our Creator Lab acts as your personal canvas, seamlessly blending poetry, typography, and AI-generated imagery into premium assets.'
  }
];

const features = [
  { icon: Wand2, title: 'Neural Enhancer', text: 'Instantly polish and elevate your text with AI-driven tonal adjustments.' },
  { icon: Image, title: 'Creator Lab', text: 'Generate stunning, high-resolution visuals from simple descriptions.' },
  { icon: BookOpenText, title: 'Poetry Studio', text: 'Craft deeply emotional poetry and authentic Shayari in seconds.' },
  { icon: PenTool, title: 'Artisan Designs', text: 'Design beautiful, typography-rich greeting cards.' },
  { icon: LayoutDashboard, title: 'Command Center', text: 'Manage generations, history, and global showcase in one place.' }
];

export default function AboutUs() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-app-bg px-4 py-6 text-textMain sm:px-6 lg:px-8 font-sans">
      <div className="soft-page-bg absolute inset-0 pointer-events-none" />
      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto my-10 max-w-7xl overflow-hidden rounded-[2.5rem] bg-white/80 backdrop-blur-xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] ring-1 ring-white/50"
      >
        <MarketingNav />

        <section className="grid min-h-[600px] gap-12 px-8 pb-16 pt-12 md:grid-cols-[1fr_1fr] md:px-16 md:pb-24 items-center">
          <div className="flex flex-col justify-center z-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8 inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 px-5 py-2.5 text-sm font-bold tracking-wide text-primary border border-primary/20"
            >
              <Sparkles size={16} /> Discover PEN AI
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl font-extrabold leading-[1.1] text-textMain sm:text-[4rem] tracking-tight"
            >
              Unleash the <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary">
                Future of Creativity
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 max-w-xl text-lg leading-relaxed text-textMuted font-medium"
            >
              PEN AI is your premier creative workspace. Whether you're refining copy, designing mesmerizing visuals, or crafting soulful poetry, our neural engine transforms raw ideas into perfection.
            </motion.p>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative h-[400px] md:h-[500px] overflow-hidden rounded-3xl shadow-2xl group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
            <img src={heroImage} alt="AI Workflow" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute bottom-8 left-8 right-8 z-20">
              <p className="text-lg font-semibold text-white/90 backdrop-blur-md bg-black/20 p-4 rounded-2xl border border-white/10">
                A seamless synthesis of neural intelligence and human imagination.
              </p>
            </div>
          </motion.div>
        </section>

        <section className="grid gap-16 border-t border-black/5 px-8 py-20 md:px-16 bg-gradient-to-b from-white/50 to-transparent">
          {storyBlocks.map((block, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              key={block.title} 
              className="grid gap-12 md:grid-cols-2 md:items-center"
            >
              <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                  <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <img src={block.image} alt={block.title} className="h-[400px] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
              </div>
              <div className="px-4">
                <h2 className="text-4xl font-bold leading-tight text-textMain tracking-tight mb-6">
                  {block.title}
                </h2>
                <p className="text-lg leading-relaxed text-textMuted font-medium">
                  {block.text}
                </p>
              </div>
            </motion.div>
          ))}
        </section>

        <section className="bg-app-bg/50 px-8 py-24 md:px-16 rounded-b-[2.5rem]">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-extrabold text-textMain tracking-tight">The Ultimate Suite</h2>
            <p className="mt-4 text-textMuted font-medium text-lg">Everything you need to create, refine, and showcase your best work.</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
            {features.map((item, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={item.title} 
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-white/60"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 text-primary group-hover:scale-110 transition-transform">
                  <item.icon size={26} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold text-textMain mb-3">{item.title}</h3>
                <p className="text-sm leading-relaxed text-textMuted">{item.text}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-20 text-center">
            <Link to="/info" className="btn-premium inline-flex rounded-full px-10 py-5 text-lg shadow-2xl hover:shadow-primary/30 transition-shadow">
              Explore Documentation <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      </motion.main>
    </div>
  );
}
