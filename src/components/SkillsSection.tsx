import React, { useState } from 'react';
import { SKILL_CATEGORIES, CERTIFICATIONS } from '../data/portfolioData';
import { Cpu, Code, Layers, Network, Terminal, Award, CheckCircle } from 'lucide-react';

export const SkillsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Languages', 'Embedded Systems & MCUs', 'Hardware & Digital Design', 'Communication Protocols', 'Development & Lab Tools'];

  const filteredCategories = activeCategory === 'All'
    ? SKILL_CATEGORIES
    : SKILL_CATEGORIES.filter((c) => c.title === activeCategory);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code':
        return <Code className="w-4 h-4 text-red-400" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4 text-red-500" />;
      case 'Layers':
        return <Layers className="w-4 h-4 text-orange-400" />;
      case 'Network':
        return <Network className="w-4 h-4 text-amber-400" />;
      case 'Terminal':
        return <Terminal className="w-4 h-4 text-red-400" />;
      default:
        return <Cpu className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <section id="skills" className="py-24 bg-transparent border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h2 className="text-xs uppercase tracking-[0.25em] text-red-500 font-mono font-bold">
              TECHNICAL EXPERTISE & CERTIFICATIONS
            </h2>
          </div>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Silicon Platforms & Hardware Architecture
          </h3>
        </div>

        {/* Category Filter Controls: Clean borderless text tabs without bounding boxes */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-10">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative py-1 text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer focus:outline-none ${
                  isActive
                    ? 'text-red-400 font-bold scale-105'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>{cat}</span>
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-500 rounded-full shadow-[0_0_10px_#ef4444]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Skills Cards Grid - Cosmic theme with NO inner bounding boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredCategories.map((cat) => (
            <div
              key={cat.title}
              className="bg-[#0d0e17]/85 backdrop-blur-md rounded-2xl border border-red-950/40 p-6 flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:border-red-500/40 transition-all duration-300"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-red-400">
                    {getCategoryIcon(cat.iconName)}
                  </div>
                  <h3 className="text-base font-bold text-white tracking-wide">
                    {cat.title}
                  </h3>
                </div>
                <p className="text-xs text-neutral-400 mb-5 leading-relaxed font-normal">
                  {cat.description}
                </p>

                {/* Skills Text: Clean typographic list without any inner bounding boxes */}
                <div className="divide-y divide-neutral-800/40 border-t border-neutral-800/40">
                  {cat.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="py-3 first:pt-3 last:pb-0"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500/80" />
                          <span className="text-xs sm:text-sm font-bold text-neutral-100 font-mono">
                            {skill.name}
                          </span>
                          {skill.highlight && (
                            <span className="text-[10px] font-mono text-red-400 font-semibold">• Core</span>
                          )}
                        </div>
                        <span className="text-xs font-mono font-medium text-red-400">
                          {skill.level}
                        </span>
                      </div>
                      {skill.detail && (
                        <p className="text-xs text-neutral-400 mt-1 pl-3.5 leading-relaxed font-normal">
                          {skill.detail}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Certifications Spotlight - Clean without inner bounding boxes */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-6 justify-center">
            <Award className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-bold text-white">
              Verified Technical Certifications
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CERTIFICATIONS.map((cert) => (
              <div
                key={cert.id}
                className="bg-[#0d0e17]/85 backdrop-blur-md rounded-2xl border border-red-950/40 p-5 flex items-start gap-4 shadow-[0_6px_25px_rgba(0,0,0,0.5)] hover:border-red-500/40 transition-all duration-300"
              >
                <div className="text-red-400 mt-0.5 shrink-0">
                  <Award className="w-6 h-6 stroke-[1.8]" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400 block mb-1">
                    {cert.badge}
                  </span>
                  <h4 className="text-sm font-bold text-white leading-snug">
                    {cert.title}
                  </h4>
                  <div className="text-xs font-medium text-neutral-400 mt-0.5">
                    {cert.issuer}
                  </div>
                  <p className="text-xs text-neutral-400 mt-2 leading-relaxed font-normal">
                    {cert.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
