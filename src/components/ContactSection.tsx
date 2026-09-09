import React, { useState } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { Mail, Phone, MapPin, Send, Check, Copy, Linkedin, Github, MessageSquare } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Embedded Firmware / Hardware Inquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
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
            Available for embedded firmware engineering opportunities, high-density PCB layout projects, and research collaboration.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Direct Contact Details */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-base font-bold text-neutral-900 mb-2">
              Direct Contact Channels
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed mb-4">
              Feel free to reach out directly via email, phone, or LinkedIn for technical discussions, hiring inquiries, or hardware design reviews.
            </p>

            {/* Email Card */}
            <div className="p-4 rounded-xl border border-neutral-200 bg-[#fafafa] flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-neutral-900 text-white">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-neutral-400 block font-medium">Email Address</span>
                  <a
                    href={`mailto:${PERSONAL_INFO.email}`}
                    className="text-xs sm:text-sm font-bold text-neutral-900 hover:text-blue-600 transition-colors"
                  >
                    {PERSONAL_INFO.email}
                  </a>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(PERSONAL_INFO.email, 'email')}
                className="p-1.5 rounded-lg hover:bg-neutral-200 text-neutral-500 transition-colors"
                title="Copy email"
              >
                {copiedField === 'email' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Phone Card */}
            <div className="p-4 rounded-xl border border-neutral-200 bg-[#fafafa] flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-neutral-900 text-white">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-neutral-400 block font-medium">Direct Phone</span>
                  <a
                    href={`tel:${PERSONAL_INFO.phone}`}
                    className="text-xs sm:text-sm font-bold text-neutral-900 hover:text-blue-600 transition-colors"
                  >
                    {PERSONAL_INFO.phone}
                  </a>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(PERSONAL_INFO.phone, 'phone')}
                className="p-1.5 rounded-lg hover:bg-neutral-200 text-neutral-500 transition-colors"
                title="Copy phone"
              >
                {copiedField === 'phone' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Location Card */}
            <div className="p-4 rounded-xl border border-neutral-200 bg-[#fafafa] flex items-center gap-3 shadow-xs">
              <div className="p-2.5 rounded-lg bg-neutral-900 text-white">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-neutral-400 block font-medium">Location</span>
                <span className="text-xs sm:text-sm font-bold text-neutral-900">
                  {PERSONAL_INFO.location}
                </span>
              </div>
            </div>

            {/* Social Links Bar */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 p-3 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 flex items-center justify-center gap-2 text-xs font-bold text-neutral-800 transition-colors"
              >
                <Linkedin className="w-4 h-4 text-blue-600" />
                <span>LinkedIn</span>
              </a>
              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 p-3 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 flex items-center justify-center gap-2 text-xs font-bold text-neutral-800 transition-colors"
              >
                <Github className="w-4 h-4 text-neutral-900" />
                <span>GitHub</span>
              </a>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7 bg-[#fafafa] rounded-2xl border border-neutral-200 p-6 sm:p-8">
            <h3 className="text-base font-bold text-neutral-900 mb-1 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-neutral-700" />
              Send a Direct Message
            </h3>
            <p className="text-xs text-neutral-500 mb-6">
              Drop a note regarding internships, full-time firmware roles, or hardware prototyping.
            </p>

            {submitted ? (
              <div className="p-8 text-center bg-white rounded-xl border border-emerald-200 text-emerald-900 space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold">Message Dispatched!</h4>
                <p className="text-xs text-neutral-600 max-w-sm mx-auto">
                  Thank you for reaching out to Harish Bawin. You will receive a response at <strong>{formData.email}</strong> shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: 'Embedded Firmware / Hardware Inquiry', message: '' });
                  }}
                  className="mt-4 px-4 py-1.5 rounded-lg bg-neutral-900 text-white text-xs font-bold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-neutral-200 focus:outline-none focus:border-neutral-900 transition-colors text-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1.5">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. jane@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-neutral-200 focus:outline-none focus:border-neutral-900 transition-colors text-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1.5">
                    Subject / Project Nature
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-neutral-200 focus:outline-none focus:border-neutral-900 transition-colors text-neutral-900"
                  >
                    <option value="Embedded Firmware Role">Embedded Firmware Role (ARM / STM32 / ESP32)</option>
                    <option value="Multilayer PCB Design Project">Multilayer PCB Design Project (KiCad)</option>
                    <option value="IoT & Signal Processing Hardware">IoT & Signal Processing Hardware</option>
                    <option value="General Technical Inquiry">General Technical Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1.5">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell me about your project requirements or role specifications..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-neutral-200 focus:outline-none focus:border-neutral-900 transition-colors text-neutral-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message to Harish</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
