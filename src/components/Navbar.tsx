import React, { useState, useEffect } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { Github, Linkedin, Mail, FileText, Menu, X, Cpu, ChevronRight } from 'lucide-react';

interface NavbarProps {
  onOpenResume: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenResume }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'about', href: '#about' },
    { label: 'featured', href: '#featured' },
    { label: 'workbench', href: '#workbench' },
    { label: 'experience', href: '#experience' },
    { label: 'skills', href: '#skills' },
    { label: 'contact', href: '#contact' },
  ];

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#121212]/95 backdrop-blur-md border-b border-neutral-800 shadow-lg py-3'
          : 'bg-[#161616] border-b border-neutral-800/80 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo: Circle Monogram */}
          <a
            href="#"
            id="nav-logo"
            className="flex items-center gap-3 group focus:outline-none"
            title={`${PERSONAL_INFO.name} Portfolio`}
          >
            <div className="w-10 h-10 rounded-full bg-white text-[#161616] flex items-center justify-center font-bold text-base tracking-tighter shadow-md group-hover:scale-105 transition-transform duration-200">
              {PERSONAL_INFO.initials}
            </div>
            <div className="hidden sm:block text-left">
              <span className="block text-sm font-bold tracking-tight text-white group-hover:text-neutral-300 transition-colors">
                {PERSONAL_INFO.name}
              </span>
              <span className="block text-[11px] text-neutral-400 font-medium tracking-wide">
                Embedded & PCB Engineer
              </span>
            </div>
          </a>

          {/* Center Navigation Links (Adham style lowercase sans) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-semibold uppercase tracking-wider text-neutral-300 hover:text-white transition-colors duration-150 relative py-1 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-neutral-400 group-hover:w-full transition-all duration-200" />
              </a>
            ))}
          </nav>

          {/* Right Action & Social Icons */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
              title="GitHub Profile"
              id="nav-github-link"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
              title="LinkedIn Profile"
              id="nav-linkedin-link"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              className="p-2 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Email Harish"
              id="nav-email-link"
            >
              <Mail className="w-4 h-4" />
            </a>

            <button
              onClick={onOpenResume}
              id="nav-resume-btn"
              className="ml-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-100 hover:bg-white text-neutral-900 text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resume</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenResume}
              className="px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-900 text-xs font-bold"
            >
              Resume
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-300 hover:text-white"
              aria-label="Toggle Navigation Menu"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#181818] border-b border-neutral-800 px-4 pt-3 pb-5 space-y-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold uppercase tracking-wider text-neutral-200 hover:text-white py-2 border-b border-neutral-800/60"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4 pt-2">
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white flex items-center gap-1.5 text-xs"
            >
              <Github className="w-4 h-4" /> GitHub
            </a>
            <a
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white flex items-center gap-1.5 text-xs"
            >
              <Linkedin className="w-4 h-4" /> LinkedIn
            </a>
            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              className="text-neutral-400 hover:text-white flex items-center gap-1.5 text-xs"
            >
              <Mail className="w-4 h-4" /> Contact
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
