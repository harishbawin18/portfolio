import React from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { ChevronUp, Github, Linkedin, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="relative bg-[#f4f4f4] border-t border-neutral-300/80 pt-10 pb-12 text-neutral-600 text-xs">
      {/* Signature Adham Dannaway Curved Back-To-Top Pill */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <button
          onClick={scrollToTop}
          id="footer-back-to-top"
          className="w-16 h-8 rounded-t-full bg-[#f4f4f4] border-t border-x border-neutral-300 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors shadow-xs group"
          title="Back to top"
          aria-label="Back to top"
        >
          <ChevronUp className="w-5 h-5 -mt-1 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Copyright notice */}
          <div className="text-center sm:text-left">
            <p className="font-medium text-neutral-700">
              © {new Date().getFullYear()} {PERSONAL_INFO.name}. All rights reserved.
            </p>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Electronics & Embedded Systems Engineer &bull; Bare-Metal ARM Firmware &bull; Multilayer PCB Design
            </p>
          </div>

          {/* Quick Footer Links */}
          <div className="flex flex-wrap justify-center items-center gap-5 text-neutral-600 font-semibold uppercase tracking-wider text-[11px]">
            <a href="#about" className="hover:text-neutral-900 transition-colors">
              about
            </a>
            <a href="#featured" className="hover:text-neutral-900 transition-colors">
              featured
            </a>
            <a href="#workbench" className="hover:text-neutral-900 transition-colors">
              workbench
            </a>
            <a href="#experience" className="hover:text-neutral-900 transition-colors">
              experience
            </a>
            <a href="#skills" className="hover:text-neutral-900 transition-colors">
              skills
            </a>
            <a href="#contact" className="hover:text-neutral-900 transition-colors">
              contact
            </a>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-2">
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:border-neutral-400 transition-colors"
              title="GitHub"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
            <a
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:border-neutral-400 transition-colors"
              title="LinkedIn"
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>
            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              className="p-2 rounded-full bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:border-neutral-400 transition-colors"
              title="Email"
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};
