import React, { useState } from 'react';
import { Project } from '../types';
import { PROJECTS } from '../data/portfolioData';
import { ProjectModal } from './ProjectModal';
import { ArrowUpRight, Cpu, Layers, Radio, Sparkles } from 'lucide-react';

interface ProjectsSectionProps {
  selectedCategory: 'all' | 'hardware' | 'firmware' | 'iot';
  onCategoryChange: (category: 'all' | 'hardware' | 'firmware' | 'iot') => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const filteredProjects = selectedCategory === 'all'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'firmware', label: 'Embedded Systems' },
    { id: 'hardware', label: 'Electronics & PCB' },
    { id: 'iot', label: 'IoT & Web Automation' },
  ] as const;

  return (
    <section id="featured" className="py-24 bg-transparent border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h2 className="text-xs uppercase tracking-[0.25em] text-red-500 font-mono font-bold">
              PORTFOLIO SHOWCASE
            </h2>
          </div>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Featured Engineering Projects
          </h3>
        </div>

        {/* Category Filter Controls: Clean borderless text tabs without bounding boxes */}
        <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8 mb-12">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`relative py-1 text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer focus:outline-none ${
                  isActive
                    ? 'text-red-400 font-bold scale-105'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>{cat.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-500 rounded-full shadow-[0_0_10px_#ef4444]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Project Cards Grid - Themed to match the cosmic dark background */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              id={`project-card-${project.id}`}
              onClick={() => setActiveProject(project)}
              className="group bg-[#0d0e17]/85 backdrop-blur-md rounded-2xl border border-red-950/40 hover:border-red-500/40 shadow-[0_8px_30px_rgba(0,0,0,0.7)] hover:shadow-[0_12px_40px_rgba(239,68,68,0.18)] transition-all duration-300 cursor-pointer overflow-hidden flex flex-col hover:-translate-y-1.5"
            >
              {/* Card Image Stage */}
              <div className="relative aspect-[16/10] bg-[#07080f] border-b border-red-950/30 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e17] via-transparent to-transparent opacity-60" />
                
                {/* Category indicator */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase backdrop-blur-md ${
                      project.category === 'firmware'
                        ? 'bg-red-950/80 text-red-300 border border-red-500/30'
                        : project.category === 'hardware'
                        ? 'bg-orange-950/80 text-orange-300 border border-orange-500/30'
                        : 'bg-neutral-900/90 text-neutral-300 border border-neutral-700/50'
                    }`}
                  >
                    {project.category}
                  </span>
                </div>

                {(project.id === 'ecg-wearable-monitor' || project.id === 'stm32-baremetal-drivers') && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-600/90 text-white text-[10px] font-bold tracking-wider uppercase backdrop-blur-md shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                    <Sparkles className="w-3 h-3" />
                    <span>Featured</span>
                  </div>
                )}
              </div>

                {/* Card Content Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-base font-bold text-white group-hover:text-red-400 transition-colors leading-snug">
                        {project.title}
                      </h3>
                      <div className="w-7 h-7 rounded-full bg-neutral-900/80 group-hover:bg-red-600 text-neutral-400 group-hover:text-white flex items-center justify-center shrink-0 transition-colors border border-white/5">
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>

                    <p className="text-xs text-neutral-400 line-clamp-3 mb-4 leading-relaxed font-normal">
                      {project.summary}
                    </p>
                  </div>

                  {/* Tech Specs */}
                  <div>
                    {(() => {
                      const techList = [
                        ...(project.specs.mcu ? [project.specs.mcu] : []),
                        ...(project.specs.protocols || []),
                        ...(project.specs.hardware || []),
                      ];
                      return (
                        <div className="flex flex-wrap gap-1.5 pt-4 border-t border-neutral-800/60">
                          {techList.slice(0, 4).map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-neutral-950/60 text-[11px] font-mono text-neutral-300 border border-neutral-800/80 group-hover:border-red-950/50 transition-colors"
                            >
                              {tech}
                            </span>
                          ))}
                          {techList.length > 4 && (
                            <span className="px-1.5 py-0.5 rounded bg-neutral-950/50 text-[11px] font-mono text-neutral-500">
                              +{techList.length - 4}
                            </span>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
            </div>
          ))}
        </div>

      </div>

      {/* Project Detail Modal */}
      {activeProject && (
        <ProjectModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      )}
    </section>
  );
};
