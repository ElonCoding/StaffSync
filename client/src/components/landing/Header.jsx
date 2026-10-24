import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#EAE9DF]/90 backdrop-blur-md border-b border-[#173D32]/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Wordmark */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/image copy.svg"
            alt="StaffSync Logo"
            className="w-10 h-10 rounded-xl object-contain shadow-md group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <span className="font-serif-display text-2xl font-bold tracking-tight text-[#102820]">
              StaffSync
            </span>
            <span className="text-[10px] uppercase tracking-widest font-semibold text-[#7E8980] -mt-1">
              Workforce OS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#34443A]">
          <a href="#features" className="hover:text-[#173D32] transition-colors">
            Features
          </a>
          <a href="#solutions" className="hover:text-[#173D32] transition-colors">
            Solutions
          </a>
          <a href="#workflow" className="hover:text-[#173D32] transition-colors">
            How It Works
          </a>
          <a href="#benefits" className="hover:text-[#173D32] transition-colors">
            Benefits
          </a>
          <a href="#faq" className="hover:text-[#173D32] transition-colors">
            FAQ
          </a>
        </nav>

        {/* Actions */}
        <div className="hidden sm:flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-medium text-[#173D32] hover:text-[#102820] px-4 py-2 rounded-xl transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/login"
            className="text-sm font-medium bg-[#173D32] text-[#EAE9DF] hover:bg-[#102820] px-5 py-2.5 rounded-xl shadow-md transition-all hover:shadow-lg flex items-center gap-2 group"
          >
            <span>Explore StaffSync</span>
            <ArrowRight className="w-4 h-4 text-[#C7F36B] group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-[#173D32] hover:bg-[#173D32]/10 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#EAE9DF] border-b border-[#173D32]/15 px-6 py-6 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-3 text-base font-medium text-[#34443A]">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#173D32]"
            >
              Features
            </a>
            <a
              href="#solutions"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#173D32]"
            >
              Solutions
            </a>
            <a
              href="#workflow"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#173D32]"
            >
              How It Works
            </a>
            <a
              href="#benefits"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#173D32]"
            >
              Benefits
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#173D32]"
            >
              FAQ
            </a>
          </nav>
          <div className="pt-4 border-t border-[#173D32]/10 flex flex-col gap-3">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 font-medium text-[#173D32] bg-[#173D32]/10 rounded-xl"
            >
              Sign In
            </Link>
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 font-medium bg-[#173D32] text-[#EAE9DF] rounded-xl shadow-md"
            >
              Explore StaffSync
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
