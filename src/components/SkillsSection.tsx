import React, { useState } from 'react';
import { SKILL_CATEGORIES, CERTIFICATIONS } from '../data/portfolioData';
import { Cpu, Code, Layers, Network, Terminal, Award, CheckCircle, Sparkles } from 'lucide-react';

export const SkillsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Languages', 'Embedded Systems & MCUs', 'Hardware & Digital Design', 'Communication Protocols', 'Development & Lab Tools'];

  const filteredCategories = activeCategory === 'All'
    ? SKILL_CATEGORIES
    : SKILL_CATEGORIES.filter((c) => c.title === activeCategory);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code':
        return <Code className="w-4 h-4 text-emerald-600" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4 text-blue-600" />;
      case 'Layers':
        return <Layers className="w-4 h-4 text-amber-600" />;
      case 'Network':
        return <Network className="w-4 h-4 text-purple-600" />;
      case 'Terminal':
        return <Terminal className="w-4 h-4 text-slate-700" />;
      default:
        return <Cpu className="w-4 h-4 text-neutral-600" />;
    }
  };

  return (
    <section id="skills" className="py-20 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-xs uppercase tracking-[0.25em] text-neutral-500 font-bold mb-3">
            TECHNICAL EXPERTISE & CERTIFICATIONS
          </h2>
          <p className="text-sm text-neutral-600 max-w-lg mx-auto">
            A comprehensive matrix of silicon platforms, hardware design suites, and low-level communication protocols.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900 border border-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredCategories.map((cat) => (
            <div
              key={cat.title}
              className="bg-[#fafafa] rounded-xl border border-neutral-200/90 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2 rounded-lg bg-white border border-neutral-200 shadow-xs">
                    {getCategoryIcon(cat.iconName)}
                  </div>
                  <h3 className="text-base font-bold text-neutral-900">
                    {cat.title}
                  </h3>
                </div>
                <p className="text-xs text-neutral-500 mb-4">
                  {cat.description}
                </p>

                {/* Skills Badges */}
                <div className="space-y-2.5">
                  {cat.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="bg-white rounded-lg p-2.5 border border-neutral-200/80 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-neutral-900 font-mono">
                            {skill.name}
                          </span>
                          {skill.highlight && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Key Focus" />
                          )}
                        </div>
                        <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider bg-neutral-100 px-2 py-0.5 rounded">
                          {skill.level}
                        </span>
                      </div>
                      {skill.detail && (
                        <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
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

        {/* Certifications Spotlight */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-6 justify-center">
            <Award className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-neutral-900">
              Verified Technical Certifications
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CERTIFICATIONS.map((cert) => (
              <div
                key={cert.id}
                className="bg-[#fafafa] rounded-xl border border-neutral-200 p-5 flex items-start gap-4 shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 flex-shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white text-neutral-700 border border-neutral-200">
                    {cert.badge}
                  </span>
                  <h4 className="text-sm font-bold text-neutral-900 mt-1 leading-snug">
                    {cert.title}
                  </h4>
                  <div className="text-xs font-semibold text-neutral-600 mt-0.5">
                    {cert.issuer}
                  </div>
                  <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
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
