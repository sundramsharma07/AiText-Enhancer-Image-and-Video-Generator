import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Sparkles, Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Info', to: '/info' },
  { label: 'Showcase', to: '/showcase' },
  { label: 'Contact us', to: '/contact' }
];

export default function MarketingNav() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="relative flex flex-wrap items-center justify-between gap-4 px-5 py-5 md:flex-nowrap md:px-10 lg:px-14">
      <Link to="/" className="flex items-center gap-2 text-lg font-bold">
        <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white">
          <Sparkles size={17} />
        </span>
        <span><span className="text-primary">PEN</span><span className="text-secondary">AI</span></span>
      </Link>

      <div className="hidden md:flex items-center gap-6 lg:gap-8 text-xs text-textMain/70">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`transition hover:text-primary ${location.pathname === link.to ? 'border-b border-secondary pb-1 text-secondary' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="md:hidden rounded-xl border border-slate-200/30 bg-white/10 p-3 text-textMain/80 transition hover:bg-white/15"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <Link to="/auth" className="hidden md:inline-flex btn-premium rounded-full px-5 py-2.5 text-xs font-bold shadow-lg transition-all hover:-translate-y-0.5">
          Sign in
        </Link>
      </div>

      {isMenuOpen && (
        <div className="absolute inset-x-5 top-full z-50 mt-3 rounded-3xl border border-slate-200/10 bg-white/95 p-5 shadow-2xl backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={`rounded-2xl px-4 py-3 text-sm font-semibold transition hover:bg-slate-100 ${location.pathname === link.to ? 'bg-slate-100 text-secondary' : 'text-textMain'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 border-t border-slate-200/70 pt-4">
            <Link
              to="/auth"
              onClick={() => setIsMenuOpen(false)}
              className="block rounded-2xl bg-primary px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              Sign in
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
