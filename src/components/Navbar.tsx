import React, { useState, useEffect } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { Github, Linkedin, Instagram, FileText, Menu, X, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenResume: () => void;
  onReplayIntro?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenResume, onReplayIntro }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0b12]/90 backdrop-blur-md border-b border-white/10 shadow-lg py-3.5'
          : 'bg-transparent py-5 sm:py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Name on the Left: "harish bawin." */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex items-baseline focus:outline-none"
            title="Harish Bawin Portfolio"
          >
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white group-hover:text-neutral-200 transition-colors">
              harish bawin
            </span>
            <span className="text-red-500 text-3xl font-extrabold ml-0.5 leading-none animate-pulse">
              .
            </span>
          </a>

          {/* Right Action Icons: Social icons cluster matching the reference image */}
          <div className="hidden sm:flex items-center gap-3 md:gap-4">
            
            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Profile"
              className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>

            {/* LinkedIn */}
            <a
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>

            {/* GitHub: Highlighted with a solid red circular badge as in reference image */}
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile (Primary)"
              className="w-9 h-9 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-transform duration-200 hover:scale-110 active:scale-95"
            >
              <Github className="w-4 h-4" />
            </a>

            {/* Replay Entrance Animation */}
            {onReplayIntro && (
              <button
                onClick={onReplayIntro}
                title="Replay Cinematic Intro"
                className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-400 hover:text-red-400 hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Replay Cinematic Intro"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            )}

            {/* Resume Action */}
            <button
              onClick={onOpenResume}
              className="ml-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/15 transition-all active:scale-95 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-red-400" />
              <span>Resume</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md"
            >
              <Github className="w-4 h-4" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden mt-3 p-4 rounded-2xl bg-[#14151e]/95 backdrop-blur-xl border border-white/10 shadow-2xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <button
                onClick={() => scrollToSection('home')}
                className="p-2.5 rounded-lg bg-neutral-900/80 text-left text-neutral-200 hover:text-white"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="p-2.5 rounded-lg bg-neutral-900/80 text-left text-neutral-200 hover:text-white"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('featured')}
                className="p-2.5 rounded-lg bg-neutral-900/80 text-left text-neutral-200 hover:text-white"
              >
                Projects
              </button>
              <button
                onClick={() => scrollToSection('workbench')}
                className="p-2.5 rounded-lg bg-neutral-900/80 text-left text-neutral-200 hover:text-white"
              >
                Interactive Lab
              </button>
              <button
                onClick={() => scrollToSection('skills')}
                className="p-2.5 rounded-lg bg-neutral-900/80 text-left text-neutral-200 hover:text-white"
              >
                Skills & Stack
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="p-2.5 rounded-lg bg-neutral-900/80 text-left text-neutral-200 hover:text-white"
              >
                Contact
              </button>
            </div>

            <div className="pt-2 border-t border-neutral-800 flex flex-col gap-2">
              {onReplayIntro && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onReplayIntro();
                  }}
                  className="w-full py-2 rounded-lg bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-red-400" />
                  <span>Replay Entrance Animation</span>
                </button>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenResume();
                }}
                className="w-full py-2 rounded-lg bg-red-600 text-white text-xs font-bold flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>View Full Resume</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
