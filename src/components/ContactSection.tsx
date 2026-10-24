import React, { useState } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { Mail, Phone, MapPin, Check, Copy, Linkedin, Github, ExternalLink } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <section id="contact" className="py-20 bg-transparent border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Let's Build Something Exceptional
          </h3>
        </div>

        {/* Clean Direct Contact Channels Grid */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Email Card - No inner bounding boxes */}
          <div className="p-6 rounded-2xl border border-red-950/40 bg-[#0d0e17]/85 backdrop-blur-md hover:border-red-500/40 transition-all flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
            <div className="flex items-center gap-4">
              <Mail className="w-6 h-6 text-red-400 shrink-0 stroke-[1.8]" />
              <div>
                <span className="text-[11px] text-neutral-400 block font-mono font-medium uppercase tracking-wider">
                  Email Address
                </span>
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="text-sm sm:text-base font-bold text-white hover:text-red-400 transition-colors"
                >
                  {PERSONAL_INFO.email}
                </a>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(PERSONAL_INFO.email, 'email')}
              className="p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Copy email"
            >
              {copiedField === 'email' ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Phone Card - No inner bounding boxes */}
          <div className="p-6 rounded-2xl border border-red-950/40 bg-[#0d0e17]/85 backdrop-blur-md hover:border-red-500/40 transition-all flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
            <div className="flex items-center gap-4">
              <Phone className="w-6 h-6 text-red-400 shrink-0 stroke-[1.8]" />
              <div>
                <span className="text-[11px] text-neutral-400 block font-mono font-medium uppercase tracking-wider">
                  Direct Phone
                </span>
                <a
                  href={`tel:${PERSONAL_INFO.phone}`}
                  className="text-sm sm:text-base font-bold text-white hover:text-red-400 transition-colors"
                >
                  {PERSONAL_INFO.phone}
                </a>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(PERSONAL_INFO.phone, 'phone')}
              className="p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Copy phone"
            >
              {copiedField === 'phone' ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Location Card - No inner bounding boxes */}
          <div className="p-6 rounded-2xl border border-red-950/40 bg-[#0d0e17]/85 backdrop-blur-md flex items-center gap-4 shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
            <MapPin className="w-6 h-6 text-red-400 shrink-0 stroke-[1.8]" />
            <div>
              <span className="text-[11px] text-neutral-400 block font-mono font-medium uppercase tracking-wider">
                Location
              </span>
              <span className="text-sm sm:text-base font-bold text-white">
                {PERSONAL_INFO.location}
              </span>
            </div>
          </div>

          {/* Social Profiles Direct Access - Clean without inner bounding boxes */}
          <div className="p-6 rounded-2xl border border-red-950/40 bg-[#0d0e17]/85 backdrop-blur-md flex items-center justify-between gap-6 shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
            <a
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2.5 py-1 text-sm font-bold text-neutral-300 hover:text-red-400 transition-colors cursor-pointer group"
            >
              <Linkedin className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform" />
              <span>LinkedIn</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
            </a>
            <div className="w-px h-8 bg-neutral-800/80" />
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2.5 py-1 text-sm font-bold text-neutral-300 hover:text-red-400 transition-colors cursor-pointer group"
            >
              <Github className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              <span>GitHub</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
