import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Info', to: '/info' },
  { label: 'Showcase', to: '/showcase' },
  { label: 'Contact us', to: '/contact' }
];

export default function MarketingNav() {
  const location = useLocation();

  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 px-5 py-5 md:flex-nowrap md:px-10 lg:px-14">
      <Link to="/" className="flex items-center gap-2 text-lg font-bold">
        <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white">
          <Sparkles size={17} />
        </span>
        <span><span className="text-primary">PEN</span><span className="text-secondary">AI</span></span>
      </Link>
      <div className="order-3 flex w-full items-center gap-4 overflow-x-auto text-xs text-textMain/70 md:order-none md:w-auto md:gap-6 lg:gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`shrink-0 transition hover:text-primary ${location.pathname === link.to ? 'border-b border-secondary pb-1 text-secondary' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <Link to="/auth" className="btn-premium rounded-full px-5 py-2.5 text-xs font-bold shadow-lg transition-all hover:-translate-y-0.5">
        Sign in
      </Link>
    </nav>
  );
}
