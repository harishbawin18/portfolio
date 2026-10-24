import React, { useState, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CircuitRadarGame } from './CircuitRadarGame';

interface HeroSplitProps {
  onSelectCategory: (category: 'all' | 'hardware' | 'firmware' | 'iot') => void;
}

export const HeroSplit: React.FC<HeroSplitProps> = ({ onSelectCategory }) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Parallax tracking relative to container center
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Normalized between -1 and 1
    const normX = (e.clientX - centerX) / (rect.width / 2);
    const normY = (e.clientY - centerY) / (rect.height / 2);
    setMousePos({ x: normX, y: normY });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
      className="relative min-h-[92vh] flex items-center pt-24 pb-16 lg:py-0 overflow-hidden bg-transparent"
    >
      {/* Background ambient crimson nebula glow */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[550px] lg:w-[750px] h-[550px] lg:h-[750px] rounded-full bg-gradient-to-br from-red-600/20 via-orange-600/10 to-transparent blur-[110px] pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mousePos.x * 25}px, calc(-50% + ${mousePos.y * 25}px))`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* ================= LEFT COLUMN: HERO TYPOGRAPHY & INTERACTIVE BADGE ================= */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-20">
            {/* Giant Headline: "Transforming Ideas Into Digital Reality" */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.08] mb-6">
              Transforming Ideas Into <br className="hidden sm:inline" />
              <span className="text-red-500 inline-block drop-shadow-[0_0_35px_rgba(239,68,68,0.4)]">
                Digital Reality
              </span>
            </h1>

            {/* Clean, persuasive description */}
            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed max-w-xl mb-10 font-normal">
              Electronics & Communication Engineer from CEG Anna University. Specialized in bare-metal ARM Cortex-M firmware, register-level peripheral drivers, and high-speed multilayer PCB design for mission-critical systems.
            </p>

            {/* Interactive Section: Spinning Circular Stamp Button */}
            <div className="flex flex-wrap items-center gap-8 sm:gap-10">
              {/* Rotating Circular Stamp Button: "MY PROJECTS ↗" */}
              <button
                onClick={() => {
                  onSelectCategory('all');
                  scrollToSection('featured');
                }}
                className="group relative flex items-center justify-center w-36 h-36 sm:w-40 sm:h-40 cursor-pointer focus:outline-none"
                aria-label="View My Projects"
                title="Explore My Featured Projects"
              >
                {/* Outer rotating circular text SVG */}
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
                  <svg
                    viewBox="0 0 160 160"
                    className="w-full h-full animate-[spin_18s_linear_infinite] group-hover:[animation-duration:8s]"
                  >
                    <defs>
                      <path
                        id="circlePath"
                        d="M 80, 80 m -62, 0 a 62,62 0 1,1 124,0 a 62,62 0 1,1 -124,0"
                      />
                    </defs>
                    <text className="text-[10.5px] font-mono uppercase tracking-[0.24em] fill-neutral-300 group-hover:fill-white font-medium">
                      <textPath href="#circlePath" startOffset="0%">
                        • MY PROJECTS • MY PROJECTS • MY PROJECTS •
                      </textPath>
                    </text>
                  </svg>
                </div>

                {/* Inner central circle with diagonal arrow */}
                <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#12131b] border-2 border-red-500/40 group-hover:border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] group-hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] flex items-center justify-center transition-all duration-300 transform group-hover:scale-110">
                  <ArrowUpRight className="w-7 h-7 text-red-500 group-hover:text-white transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 stroke-[2.5]" />
                </div>
              </button>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: INTERACTIVE HARDWARE RADAR MINI-GAME ================= */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative items-center py-4 lg:py-0">
            <CircuitRadarGame />
          </div>

        </div>
      </div>
    </section>
  );
};

