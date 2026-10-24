import React from 'react';
import { EXPERIENCES } from '../data/portfolioData';
import { Briefcase, GraduationCap, Users, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

export const ExperienceTimeline: React.FC = () => {
  return (
    <section id="experience" className="py-20 bg-transparent border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Industry Internships & Academic Track
          </h3>
        </div>

        {/* Timeline Content */}
        <div className="max-w-4xl mx-auto space-y-8 relative">
          {/* Vertical connecting line */}
          <div className="absolute left-4 sm:left-8 top-3 bottom-3 w-0.5 bg-neutral-800 hidden sm:block" />

          {EXPERIENCES.map((exp, idx) => {
            const isEducation = exp.type === 'education';
            const isLeadership = exp.type === 'leadership';

            return (
              <div
                key={exp.id}
                id={`exp-card-${exp.id}`}
                className="relative flex flex-col sm:flex-row items-start sm:pl-20 group"
              >
                {/* Node Icon on Timeline */}
                <div className="hidden sm:flex absolute left-4 sm:left-8 -translate-x-1/2 w-9 h-9 rounded-full bg-neutral-900 border-2 border-neutral-700 items-center justify-center shadow-lg z-10 group-hover:scale-110 transition-transform">
                  {isEducation ? (
                    <GraduationCap className="w-4 h-4 text-purple-400" />
                  ) : isLeadership ? (
                    <Users className="w-4 h-4 text-blue-400" />
                  ) : (
                    <Briefcase className="w-4 h-4 text-emerald-400" />
                  )}
                </div>

                {/* Card Container - Cosmic dark theme without inner bounding boxes */}
                <div className="w-full bg-[#0d0e17]/85 backdrop-blur-md rounded-2xl border border-red-950/40 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:border-red-500/40 transition-all">
                  {/* Top Bar: Role & Period */}
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400">
                          {exp.type}
                        </span>
                        <span className="text-neutral-500">•</span>
                        <h3 className="text-base sm:text-lg font-bold text-white">
                          {exp.role}
                        </h3>
                      </div>
                      <div className="text-sm font-semibold text-neutral-300 mt-0.5">
                        {exp.company}
                      </div>
                    </div>

                    <div className="flex flex-col items-end text-xs text-neutral-400">
                      <span className="inline-flex items-center gap-1.5 font-mono font-medium text-red-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {exp.period}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-neutral-400 mt-1">
                        <MapPin className="w-3 h-3" />
                        {exp.location}
                      </span>
                    </div>
                  </div>

                  {/* Subtitle / Focus */}
                  <p className="text-xs text-neutral-400 italic mb-4 font-medium">
                    {exp.subtitle}
                  </p>

                  {/* Bullet points from Resume */}
                  <ul className="space-y-2 mb-4 text-xs sm:text-sm text-neutral-300">
                    {exp.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                        <span className="leading-relaxed">{pt}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Technologies tags without bounding boxes */}
                  <div className="pt-3 border-t border-neutral-800/60 flex flex-wrap gap-x-3 gap-y-1 text-xs font-mono text-neutral-400">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-neutral-400 hover:text-white transition-colors"
                      >
                        #{tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
