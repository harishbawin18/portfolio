import React, { useState, useEffect } from 'react';
import { Home, User, Layers, Briefcase, Terminal, Mail } from 'lucide-react';

interface FloatingNavDockProps {
  onOpenResume?: () => void;
}

export const FloatingNavDock: React.FC<FloatingNavDockProps> = () => {
  const [activeSection, setActiveSection] = useState<'home' | 'about' | 'skills' | 'projects' | 'workbench' | 'contact'>('home');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;

      const contactEl = document.getElementById('contact');
      const workbenchEl = document.getElementById('workbench');
      const projectsEl = document.getElementById('featured');
      const skillsEl = document.getElementById('skills');
      const experienceEl = document.getElementById('experience');

      if (contactEl && scrollPosition >= contactEl.offsetTop) {
        setActiveSection('contact');
      } else if (workbenchEl && scrollPosition >= workbenchEl.offsetTop) {
        setActiveSection('workbench');
      } else if (skillsEl && scrollPosition >= skillsEl.offsetTop) {
        setActiveSection('skills');
      } else if (experienceEl && scrollPosition >= experienceEl.offsetTop) {
        setActiveSection('skills');
      } else if (projectsEl && scrollPosition >= projectsEl.offsetTop) {
        setActiveSection('projects');
      } else {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: 'home', target: 'home', label: 'Home', icon: Home },
    { id: 'about', target: 'about', label: 'About', icon: User },
    { id: 'skills', target: 'skills', label: 'Expertise & Skills', icon: Layers },
    { id: 'projects', target: 'featured', label: 'Featured Projects', icon: Briefcase },
    { id: 'workbench', target: 'workbench', label: 'Interactive Lab', icon: Terminal },
    { id: 'contact', target: 'contact', label: 'Contact Me', icon: Mail },
  ] as const;

  return (
    <aside
      aria-label="Quick navigation dock"
      className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center"
    >
      <div className="bg-[#14151e]/85 backdrop-blur-xl border border-white/10 rounded-full py-3.5 px-1.5 sm:px-2 flex flex-col gap-3.5 items-center shadow-[0_12px_45px_rgba(0,0,0,0.7)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <div key={item.id} className="relative group flex items-center">
              {/* Tooltip on hover */}
              <div
                role="tooltip"
                className="absolute right-full mr-3.5 px-3 py-1.5 rounded-lg bg-[#181924]/95 border border-white/10 text-white text-xs font-medium whitespace-nowrap shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200"
              >
                <span>{item.label}</span>
                {/* Little triangle arrow pointing right */}
                <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-2 bg-[#181924] border-t border-r border-white/10 rotate-45" />
              </div>

              {/* Icon button */}
              <button
                onClick={() => scrollTo(item.target)}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
                  isActive
                    ? 'bg-red-500 text-white shadow-[0_0_18px_rgba(239,68,68,0.65)] scale-105'
                    : 'text-neutral-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
              </button>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
