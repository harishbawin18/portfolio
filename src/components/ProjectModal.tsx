import React, { useState } from 'react';
import { Project } from '../types';
import { X, Cpu, Layers, Terminal, Copy, Check, ExternalLink, Activity, ArrowRight } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!project) return null;

  const handleCopyCode = () => {
    if (project.codeSnippet) {
      navigator.clipboard.writeText(project.codeSnippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      id="project-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="project-modal-container"
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                project.category === 'firmware'
                  ? 'bg-emerald-100 text-emerald-800'
                  : project.category === 'hardware'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {project.categoryLabel}
            </span>
            <span className="text-xs text-neutral-400">•</span>
            <span className="text-xs text-neutral-600 font-medium">{project.organization}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Title & Image Header */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 leading-snug mb-2">
              {project.title}
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed">{project.summary}</p>
          </div>

          {/* Thumbnail preview */}
          <div className="rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 max-h-64 sm:max-h-80 flex items-center justify-center">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Technical Specifications Grid */}
          <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-neutral-700" />
              Technical Specifications & Stack
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {project.specs.mcu && (
                <div>
                  <span className="text-neutral-400 block font-medium">MCU / Core Target:</span>
                  <span className="font-semibold text-neutral-800">{project.specs.mcu}</span>
                </div>
              )}
              {project.specs.pcbDimensions && (
                <div>
                  <span className="text-neutral-400 block font-medium">PCB Form Factor:</span>
                  <span className="font-semibold text-neutral-800">{project.specs.pcbDimensions}</span>
                </div>
              )}
              {project.specs.samplingRate && (
                <div>
                  <span className="text-neutral-400 block font-medium">Acquisition Rate:</span>
                  <span className="font-semibold text-neutral-800">{project.specs.samplingRate}</span>
                </div>
              )}
              {project.specs.protocols && (
                <div>
                  <span className="text-neutral-400 block font-medium">Protocols & Buses:</span>
                  <span className="font-semibold text-neutral-800">{project.specs.protocols.join(', ')}</span>
                </div>
              )}
              {project.specs.hardware && (
                <div className="sm:col-span-2">
                  <span className="text-neutral-400 block font-medium">Sensors & Silicon ICs:</span>
                  <span className="font-semibold text-neutral-800">{project.specs.hardware.join(', ')}</span>
                </div>
              )}
              {project.specs.software && (
                <div className="sm:col-span-2">
                  <span className="text-neutral-400 block font-medium">Software Stack & Toolchains:</span>
                  <span className="font-semibold text-neutral-800">{project.specs.software.join(', ')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Key Engineering Highlights from Resume */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-neutral-700" />
              Implementation & Verification Details
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-700">
              {project.highlights.map((point, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-neutral-900 flex-shrink-0" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Code Snippet Viewer */}
          {project.codeSnippet && (
            <div className="rounded-xl overflow-hidden border border-neutral-800 bg-[#161616] text-neutral-200">
              <div className="flex items-center justify-between px-4 py-2 bg-[#202020] border-b border-neutral-800 text-xs font-mono">
                <span className="text-neutral-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  {project.codeSnippet.filename}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white px-2 py-0.5 rounded hover:bg-neutral-700/60 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 text-xs font-mono overflow-x-auto text-neutral-300 leading-relaxed">
                <code>{project.codeSnippet.code}</code>
              </pre>
            </div>
          )}

          {/* Key Takeaway Callout */}
          <div className="p-3.5 rounded-xl bg-neutral-100 border border-neutral-200 text-xs text-neutral-700">
            <span className="font-bold text-neutral-900 block mb-0.5">Core Engineering Takeaway:</span>
            {project.keyTakeaway}
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
