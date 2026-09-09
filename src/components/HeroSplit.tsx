import React, { useState } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { Cpu, Layers, Terminal } from 'lucide-react';
import coatPhoto from '../assets/images/coatphoto.jpg';

interface HeroSplitProps {
  onSelectCategory: (category: 'all' | 'hardware' | 'firmware' | 'iot') => void;
}

export const HeroSplit: React.FC<HeroSplitProps> = ({ onSelectCategory }) => {
  const [activeHover, setActiveHover] = useState<'electronics' | 'embedded' | null>(null);

  // Derived focus level
  const electronicsOpacity = activeHover === 'embedded' ? 0.45 : 1;
  const embeddedOpacity = activeHover === 'electronics' ? 0.45 : 1;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="about" className="relative pt-24 pb-16 md:pt-28 md:pb-24 bg-white overflow-hidden border-b border-neutral-200/80">
      {/* Subtle background technical grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      {/* Decorative floating circuit / code background watermarks */}
      <div className="absolute left-4 top-32 text-[11px] font-mono text-neutral-300 pointer-events-none select-none hidden xl:block leading-relaxed">
        <div>// KiCad 4-Layer Stackup</div>
        <div>Layer 1: F.Cu (High-Speed Signals)</div>
        <div>Layer 2: In1.Cu (Solid GND Plane)</div>
        <div>Layer 3: In2.Cu (VCC 3V3 & 1V8)</div>
        <div>Layer 4: B.Cu (Sensor Analog Traces)</div>
      </div>
      <div className="absolute right-4 top-32 text-[11px] font-mono text-neutral-300 pointer-events-none select-none hidden xl:block leading-relaxed text-right">
        <div>#define STM32_FLASH_BASE 0x08000000UL</div>
        <div>#define RCC_AHB1ENR_GPIOAEN (1 &lt;&lt; 0)</div>
        <div>volatile uint32_t *pRCC_AHB1 = ...;</div>
        <div>void SysTick_Handler(void);</div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Main 3-Column Split Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
          
          {/* LEFT COLUMN: Electronics & PCB */}
          <div
            id="hero-electronics-col"
            className="lg:col-span-4 text-center lg:text-right transition-opacity duration-300 order-2 lg:order-1"
            style={{ opacity: electronicsOpacity }}
            onMouseEnter={() => setActiveHover('electronics')}
            onMouseLeave={() => setActiveHover(null)}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-semibold mb-3">
              <Layers className="w-3.5 h-3.5 text-amber-700" />
              <span>Electronics & PCB Design</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-900 font-sans leading-none mb-4">
              electronics
            </h1>

            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-md mx-auto lg:ml-auto lg:mr-0 mb-6 font-normal">
              {PERSONAL_INFO.electronicsBio || PERSONAL_INFO.hardwareBio}
            </p>

            {/* Electronics Key Specs Badges */}
            <div className="flex flex-wrap gap-1.5 justify-center lg:justify-end mb-6 max-w-md mx-auto lg:ml-auto lg:mr-0">
              <span className="px-2.5 py-1 rounded bg-neutral-100 text-neutral-800 text-xs font-medium border border-neutral-200">
                KiCad 4-Layer
              </span>
              <span className="px-2.5 py-1 rounded bg-neutral-100 text-neutral-800 text-xs font-medium border border-neutral-200">
                20×25mm Wearables
              </span>
              <span className="px-2.5 py-1 rounded bg-neutral-100 text-neutral-800 text-xs font-medium border border-neutral-200">
                MAX86171 PPG & IMU
              </span>
              <span className="px-2.5 py-1 rounded bg-neutral-100 text-neutral-800 text-xs font-medium border border-neutral-200">
                Signal & Power Integrity
              </span>
            </div>

            <div className="flex justify-center lg:justify-end">
              <button
                onClick={() => {
                  onSelectCategory('hardware');
                  scrollToSection('featured');
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-all shadow-sm active:scale-95"
              >
                <span>Explore Electronics</span>
                <span className="text-amber-400">→</span>
              </button>
            </div>
          </div>

          {/* CENTER COLUMN: Clean Portrait (No drag bar, no overlays) */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center order-1 lg:order-2">
            <div
              id="hero-portrait-container"
              className="relative w-64 sm:w-72 md:w-80 aspect-[4/5] sm:aspect-square rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-neutral-200 bg-neutral-100"
            >
              {/* Direct Unaltered Portrait */}
              <img
                src={coatPhoto || 'src/assets/images/coatphoto.jpg'}
                alt="Harish Bawin K P — Electronics & Embedded Systems Engineer"
                className="w-full h-full object-cover object-[center_18%]"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('coatphoto.jpg')) {
                    target.src = '/images/coatphoto.jpg';
                  }
                }}
              />
            </div>
            <div className="mt-3 text-center">
              <span className="text-xs font-medium text-neutral-500 font-mono">
                {PERSONAL_INFO.name}
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: Embedded Systems / Firmware */}
          <div
            id="hero-embedded-col"
            className="lg:col-span-4 text-center lg:text-left transition-opacity duration-300 order-3"
            style={{ opacity: embeddedOpacity }}
            onMouseEnter={() => setActiveHover('embedded')}
            onMouseLeave={() => setActiveHover(null)}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs font-semibold mb-3">
              <Terminal className="w-3.5 h-3.5 text-emerald-700" />
              <span>Embedded Systems & Firmware</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 font-mono leading-none mb-4">
              &lt;embedded system&gt;
            </h1>

            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-md mx-auto lg:mr-auto lg:ml-0 mb-6 font-normal">
              {PERSONAL_INFO.embeddedBio || PERSONAL_INFO.firmwareBio}
            </p>

            {/* Embedded Key Specs Badges */}
            <div className="flex flex-wrap gap-1.5 justify-center lg:justify-start mb-6 max-w-md mx-auto lg:mr-auto lg:ml-0">
              <span className="px-2.5 py-1 rounded bg-neutral-100 text-neutral-800 text-xs font-mono border border-neutral-200">
                ARM Cortex-M
              </span>
              <span className="px-2.5 py-1 rounded bg-neutral-100 text-neutral-800 text-xs font-mono border border-neutral-200">
                STM32 (No-HAL)
              </span>
              <span className="px-2.5 py-1 rounded bg-neutral-100 text-neutral-800 text-xs font-mono border border-neutral-200">
                ESP32 250Hz ISR
              </span>
              <span className="px-2.5 py-1 rounded bg-neutral-100 text-neutral-800 text-xs font-mono border border-neutral-200">
                SPI / I2C / UART
              </span>
            </div>

            <div className="flex justify-center lg:justify-start">
              <button
                onClick={() => {
                  onSelectCategory('firmware');
                  scrollToSection('featured');
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-all shadow-sm active:scale-95"
              >
                <span>Explore Embedded Systems</span>
                <span className="text-emerald-400">→</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Profile Summary Strip */}
        <div className="mt-14 pt-8 border-t border-neutral-200/70 max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-widest text-neutral-400 font-bold mb-2">
            Electronics & Communication Engineering • College of Engineering Guindy (Anna University)
          </p>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            Chennai, India • Direct bare metal programming, custom peripheral driver libraries, and space-constrained multilayer PCB design.
          </p>
        </div>
      </div>
    </section>
  );
};
