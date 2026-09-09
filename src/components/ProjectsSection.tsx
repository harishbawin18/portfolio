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
    <section id="featured" className="py-20 bg-[#fafafa] border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Adham Dannaway style section heading */}
        <div className="text-center mb-10">
          <h2 className="text-xs uppercase tracking-[0.25em] text-neutral-500 font-bold mb-3">
            SOME OF MY LATEST WORK
          </h2>
          <p className="text-sm text-neutral-600 max-w-lg mx-auto">
            Hands-on implementations in bare metal programming, multilayer KiCad PCB layout, and real-time sensor processing.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-150 ${
                selectedCategory === cat.id
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200/80 hover:border-neutral-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Project Cards Grid (Adham Dannaway card design) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              id={`project-card-${project.id}`}
              onClick={() => setActiveProject(project)}
              className="group bg-white rounded-xl border border-neutral-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.09)] transition-all duration-200 cursor-pointer overflow-hidden flex flex-col hover:-translate-y-1"
            >
              {/* Card Image Stage */}
              <div className="relative aspect-[4/3] bg-neutral-100 border-b border-neutral-100 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Category Badge overlay */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-md shadow-sm ${
                      project.category === 'firmware'
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                        : project.category === 'hardware'
                        ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                        : 'bg-blue-950/80 text-blue-300 border border-blue-500/30'
                    }`}
                  >
                    {project.categoryLabel}
                  </span>
                </div>

                {/* Inspect hover action badge */}
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/80 text-white text-[11px] font-semibold backdrop-blur-sm shadow-md">
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>

              {/* Card Meta & Typography (matching Adham Dannaway card text) */}
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-base font-bold text-neutral-900 group-hover:text-black leading-snug mb-1.5 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-neutral-500 font-medium mb-3">
                    {project.organization}
                  </p>
                  <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed mb-4">
                    {project.summary}
                  </p>
                </div>

                {/* Tech chips footer */}
                <div className="pt-3 border-t border-neutral-100 flex flex-wrap gap-1.5 items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {project.specs.protocols && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                        {project.specs.protocols[0]}
                      </span>
                    )}
                    {project.specs.mcu && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                        {project.specs.mcu.split(' ')[0]}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-neutral-900 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Details →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal viewer for projects */}
        <ProjectModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      </div>
    </section>
  );
};
