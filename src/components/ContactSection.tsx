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
    <section id="contact" className="py-20 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-xs uppercase tracking-[0.25em] text-neutral-500 font-bold mb-3">
            GET IN TOUCH
          </h2>
          <p className="text-sm text-neutral-600 max-w-lg mx-auto">
            Available for electronics hardware engineering roles, embedded firmware opportunities, and technical collaboration.
          </p>
        </div>

        {/* Clean Direct Contact Channels Grid */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Email Card */}
          <div className="p-5 rounded-2xl border border-neutral-200/90 bg-[#fafafa] hover:bg-white hover:border-neutral-300 transition-all flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-neutral-900 text-white shadow-xs">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-neutral-400 block font-semibold uppercase tracking-wider">
                  Email Address
                </span>
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="text-sm sm:text-base font-bold text-neutral-900 hover:text-blue-600 transition-colors"
                >
                  {PERSONAL_INFO.email}
                </a>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(PERSONAL_INFO.email, 'email')}
              className="p-2 rounded-lg hover:bg-neutral-200/70 text-neutral-500 transition-colors"
              title="Copy email"
            >
              {copiedField === 'email' ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Phone Card */}
          <div className="p-5 rounded-2xl border border-neutral-200/90 bg-[#fafafa] hover:bg-white hover:border-neutral-300 transition-all flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-neutral-900 text-white shadow-xs">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-neutral-400 block font-semibold uppercase tracking-wider">
                  Direct Phone
                </span>
                <a
                  href={`tel:${PERSONAL_INFO.phone}`}
                  className="text-sm sm:text-base font-bold text-neutral-900 hover:text-blue-600 transition-colors"
                >
                  {PERSONAL_INFO.phone}
                </a>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(PERSONAL_INFO.phone, 'phone')}
              className="p-2 rounded-lg hover:bg-neutral-200/70 text-neutral-500 transition-colors"
              title="Copy phone"
            >
              {copiedField === 'phone' ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Location Card */}
          <div className="p-5 rounded-2xl border border-neutral-200/90 bg-[#fafafa] flex items-center gap-3.5 shadow-xs">
            <div className="p-3 rounded-xl bg-neutral-900 text-white shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-neutral-400 block font-semibold uppercase tracking-wider">
                Location
              </span>
              <span className="text-sm sm:text-base font-bold text-neutral-900">
                {PERSONAL_INFO.location}
              </span>
            </div>
          </div>

          {/* Social Profiles Direct Access */}
          <div className="p-5 rounded-2xl border border-neutral-200/90 bg-[#fafafa] flex items-center justify-between gap-3 shadow-xs">
            <a
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-3 rounded-xl bg-white border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 flex items-center justify-center gap-2 text-xs font-bold text-neutral-900 transition-all shadow-xs"
            >
              <Linkedin className="w-4 h-4 text-blue-600" />
              <span>LinkedIn</span>
              <ExternalLink className="w-3 h-3 text-neutral-400" />
            </a>
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-3 rounded-xl bg-white border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 flex items-center justify-center gap-2 text-xs font-bold text-neutral-900 transition-all shadow-xs"
            >
              <Github className="w-4 h-4 text-neutral-900" />
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 text-neutral-400" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
