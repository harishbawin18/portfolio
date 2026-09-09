import React from 'react';
import { PERSONAL_INFO, PROJECTS, EXPERIENCES, SKILL_CATEGORIES, CERTIFICATIONS } from '../data/portfolioData';
import { X, Printer, Download, Mail, Phone, MapPin, Linkedin, Github } from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="resume-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="resume-modal-container"
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-neutral-200 my-auto max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Controls (Hidden in Print) */}
        <div className="px-6 py-3.5 bg-neutral-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Verified Curriculum Vitae
            </span>
            <span className="text-xs text-neutral-500">•</span>
            <span className="text-xs text-neutral-400 font-mono">Harish Bawin K P</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              aria-label="Close resume"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Resume Sheet */}
        <div className="p-8 sm:p-12 overflow-y-auto font-sans text-neutral-900 bg-white space-y-6">
          
          {/* Header */}
          <div className="text-center border-b border-neutral-300 pb-5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-widest uppercase font-serif text-neutral-900">
              HARISH BAWIN K P
            </h1>
            <p className="text-xs sm:text-sm font-semibold tracking-wider text-neutral-700 mt-1 uppercase">
              Embedded Systems Engineer | PCB Design | IoT & Signal Processing
            </p>
            
            {/* Contact details */}
            <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-xs text-neutral-600 mt-3 font-medium">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-neutral-400" />
                {PERSONAL_INFO.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-neutral-400" />
                {PERSONAL_INFO.phone}
              </span>
              <span>•</span>
              <a href={`mailto:${PERSONAL_INFO.email}`} className="text-blue-600 hover:underline">
                {PERSONAL_INFO.email}
              </a>
              <span>•</span>
              <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {PERSONAL_INFO.linkedinHandle}
              </a>
              <span>•</span>
              <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {PERSONAL_INFO.githubHandle}
              </a>
            </div>
          </div>

          {/* Professional Summary */}
          <div>
            <h2 className="text-xs font-bold tracking-[0.2em] uppercase border-b border-neutral-300 pb-1 text-neutral-800 mb-2">
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-xs leading-relaxed text-neutral-700 text-justify">
              {PERSONAL_INFO.summary}
            </p>
          </div>

          {/* Education */}
          <div>
            <h2 className="text-xs font-bold tracking-[0.2em] uppercase border-b border-neutral-300 pb-1 text-neutral-800 mb-2">
              EDUCATION
            </h2>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-neutral-900">B.E. Electronics & Communication Engineering</span>
                  <span className="text-neutral-700"> — CGPA: 8.34 /10</span>
                </div>
                <div className="text-right text-neutral-700 font-medium">
                  College of Engineering Guindy, Anna University (2027)
                </div>
              </div>
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-neutral-900">Higher Secondary Certificate (HSC)</span>
                  <span className="text-neutral-700"> — 97.33%</span>
                </div>
                <div className="text-right text-neutral-700 font-medium">
                  AGN Matric Higher Secondary School, Salem (2023)
                </div>
              </div>
            </div>
          </div>

          {/* Internship Experience */}
          <div>
            <h2 className="text-xs font-bold tracking-[0.2em] uppercase border-b border-neutral-300 pb-1 text-neutral-800 mb-3">
              INTERNSHIP EXPERIENCE
            </h2>
            <div className="space-y-4 text-xs">
              {/* Admini */}
              <div>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-neutral-900">Embedded Systems Engineer Intern</span>
                    <span className="text-neutral-700"> | Admini — AI Ecosystem for MSMEs</span>
                  </div>
                  <span className="text-neutral-600 font-medium italic">Aug 2025 – Oct 2025</span>
                </div>
                <ul className="list-disc pl-4 space-y-1 text-neutral-700 mt-1">
                  <li>
                    Developed firmware for an ESP32-based IoT system integrating servo motor control, SPI display interfacing, and cloud communication using Node.js and MongoDB for real-time device monitoring and control.
                  </li>
                  <li>
                    Worked on embedded and IoT development using ESP32 and Raspberry Pi, including SPI TFT display interfacing while also contributing to QR-based tracking metrics and an AI-assisted web automation tool.
                  </li>
                </ul>
              </div>

              {/* IBT Aura */}
              <div>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-neutral-900">Embedded Systems Engineer Intern</span>
                    <span className="text-neutral-700"> | IBT Aura</span>
                  </div>
                  <span className="text-neutral-600 font-medium italic">Dec 2025 – Feb 2026</span>
                </div>
                <ul className="list-disc pl-4 space-y-1 text-neutral-700 mt-1">
                  <li>
                    Designed a compact 20 × 25 mm multilayer wearable PCB using KiCad, optimizing component placement, signal routing, and power integrity for space-constrained embedded systems.
                  </li>
                  <li>
                    Integrated the MAX32652 microcontroller with the MAX86171 PPG sensor, BMI160 IMU, and MAX77818 PMIC, enabling reliable physiological and motion sensing.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Technical Projects */}
          <div>
            <h2 className="text-xs font-bold tracking-[0.2em] uppercase border-b border-neutral-300 pb-1 text-neutral-800 mb-3">
              TECHNICAL PROJECTS
            </h2>
            <div className="space-y-3.5 text-xs">
              {/* Project 1 */}
              <div>
                <div className="font-bold text-neutral-900">Bare-Metal STM32 Peripheral Driver Development</div>
                <ul className="list-disc pl-4 space-y-1 text-neutral-700 mt-1">
                  <li>
                    Developed a bare-metal peripheral driver library for STM32 ARM Cortex-M microcontrollers, implementing GPIO, SPI, I2C, USART, interrupt configuration, and peripheral clock management through direct register-level programming without HAL.
                  </li>
                  <li>
                    Designed reusable and modular driver APIs based on the STM32 Reference Manual, enabling reliable peripheral communication and code reusability.
                  </li>
                  <li>
                    Tested and validated drivers on STM32 Nucleo hardware through debugging and functional verification.
                  </li>
                </ul>
              </div>

              {/* Project 2 */}
              <div>
                <div className="font-bold text-neutral-900">ECG Monitoring System</div>
                <ul className="list-disc pl-4 space-y-1 text-neutral-700 mt-1">
                  <li>
                    Developed firmware for an ESP32-based real-time ECG monitoring system by interfacing the AD8232 Analog front-end, acquiring physiological signals at 250 Hz, and transmitting data over UART to MATLAB.
                  </li>
                  <li>
                    Implemented continuous sensor data acquisition and digital signal processing to achieve reliable real-time ECG waveform visualization and analysis.
                  </li>
                </ul>
              </div>

              {/* Project 3 */}
              <div>
                <div className="font-bold text-neutral-900">Smart Reader for the Visually Impaired — Raspberry Pi</div>
                <ul className="list-disc pl-4 space-y-1 text-neutral-700 mt-1">
                  <li>
                    Developed a Raspberry Pi–based embedded assistive system integrating a camera module, GPIO-triggered image capture, OCR, and text-to-speech for real-time text-to-audio conversion.
                  </li>
                  <li>
                    Integrated GPIO, camera, and audio peripherals while optimizing software performance for reliable operation on an embedded Linux platform.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Technical Skills */}
          <div>
            <h2 className="text-xs font-bold tracking-[0.2em] uppercase border-b border-neutral-300 pb-1 text-neutral-800 mb-2">
              TECHNICAL SKILLS
            </h2>
            <div className="space-y-1 text-xs text-neutral-700 leading-relaxed">
              <div>
                <span className="font-bold text-neutral-900">Languages:</span> C, C++, Python, Verilog
              </div>
              <div>
                <span className="font-bold text-neutral-900">Embedded Systems:</span> ARM Cortex-M, STM32, ESP32, Raspberry Pi, Bare-Metal Programming, FreeRTOS (Basics)
              </div>
              <div>
                <span className="font-bold text-neutral-900">Hardware & Digital Design:</span> Digital Electronics, PCB Design, KiCad, EasyEDA, Vivado, Cadence Virtuoso
              </div>
              <div>
                <span className="font-bold text-neutral-900">Communication Protocols:</span> SPI, UART, I2C, CAN (familiar with protocol)
              </div>
              <div>
                <span className="font-bold text-neutral-900">Development Tools:</span> STM32CubeIDE, MATLAB, Simulink, Git
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h2 className="text-xs font-bold tracking-[0.2em] uppercase border-b border-neutral-300 pb-1 text-neutral-800 mb-2">
              CERTIFICATIONS
            </h2>
            <ul className="list-disc pl-4 space-y-1 text-xs text-neutral-700">
              <li>Mastering Micro-controller and Embedded driver development - Fastbit Wireless - Udemy</li>
              <li>Introduction to Internet of Things — NPTEL</li>
            </ul>
          </div>

          {/* Leadership & Extracurricular */}
          <div>
            <h2 className="text-xs font-bold tracking-[0.2em] uppercase border-b border-neutral-300 pb-1 text-neutral-800 mb-2">
              LEADERSHIP & EXTRACURRICULAR
            </h2>
            <div className="text-xs">
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-neutral-900">Organizer, Industry Relations</span>
                  <span className="text-neutral-700"> — CEG Tech Forum</span>
                </div>
                <span className="text-neutral-600 font-medium italic">July 2025</span>
              </div>
              <p className="text-neutral-700 mt-1">
                Spearheaded industry outreach and partnership initiatives, connecting students with technology professionals and facilitating knowledge exchange at one of India's premier engineering forums.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
