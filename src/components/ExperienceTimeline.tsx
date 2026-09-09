import React from 'react';
import { EXPERIENCES } from '../data/portfolioData';
import { Briefcase, GraduationCap, Users, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

export const ExperienceTimeline: React.FC = () => {
  return (
    <section id="experience" className="py-20 bg-[#f9fafb] border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-xs uppercase tracking-[0.25em] text-neutral-500 font-bold mb-3">
            EXPERIENCE & EDUCATION
          </h2>
          <p className="text-sm text-neutral-600 max-w-lg mx-auto">
            Practical engineering internships in wearable hardware, industrial automation, and academic training at CEG Anna University.
          </p>
        </div>

        {/* Timeline Content */}
        <div className="max-w-4xl mx-auto space-y-8 relative">
          {/* Vertical connecting line */}
          <div className="absolute left-4 sm:left-8 top-3 bottom-3 w-0.5 bg-neutral-200 hidden sm:block" />

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
                <div className="hidden sm:flex absolute left-4 sm:left-8 -translate-x-1/2 w-9 h-9 rounded-full bg-white border-2 border-neutral-900 items-center justify-center shadow-md z-10 group-hover:scale-110 transition-transform">
                  {isEducation ? (
                    <GraduationCap className="w-4 h-4 text-neutral-900" />
                  ) : isLeadership ? (
                    <Users className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Briefcase className="w-4 h-4 text-emerald-600" />
                  )}
                </div>

                {/* Card Container */}
                <div className="w-full bg-white rounded-xl border border-neutral-200 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
                  {/* Top Bar: Role & Period */}
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            isEducation
                              ? 'bg-purple-100 text-purple-800'
                              : isLeadership
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {exp.type}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-neutral-900">
                          {exp.role}
                        </h3>
                      </div>
                      <div className="text-sm font-semibold text-neutral-700 mt-0.5">
                        {exp.company}
                      </div>
                    </div>

                    <div className="flex flex-col items-end text-xs text-neutral-500">
                      <span className="inline-flex items-center gap-1 font-mono font-medium text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded">
                        <Calendar className="w-3 h-3 text-neutral-500" />
                        {exp.period}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-neutral-400 mt-1">
                        <MapPin className="w-3 h-3" />
                        {exp.location}
                      </span>
                    </div>
                  </div>

                  {/* Subtitle / Focus */}
                  <p className="text-xs text-neutral-500 italic mb-4 font-medium">
                    {exp.subtitle}
                  </p>

                  {/* Bullet points from Resume */}
                  <ul className="space-y-2 mb-4 text-xs sm:text-sm text-neutral-700">
                    {exp.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-neutral-800 flex-shrink-0" />
                        <span className="leading-relaxed">{pt}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Technologies tags */}
                  <div className="pt-3 border-t border-neutral-100 flex flex-wrap gap-1.5">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 text-xs font-mono font-medium border border-neutral-200/60"
                      >
                        {tech}
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
