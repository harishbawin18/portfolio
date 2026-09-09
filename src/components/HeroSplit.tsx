import React, { useState } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { Cpu, Layers, Terminal, Sparkles, SlidersHorizontal, ArrowDown, CheckCircle2 } from 'lucide-react';

interface HeroSplitProps {
  onSelectCategory: (category: 'all' | 'hardware' | 'firmware' | 'iot') => void;
}

export const HeroSplit: React.FC<HeroSplitProps> = ({ onSelectCategory }) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // 0 to 100%
  const [activeHover, setActiveHover] = useState<'hardware' | 'firmware' | null>(null);

  // Derived focus level
  const hardwareOpacity = activeHover === 'firmware' ? 0.4 : 1;
  const firmwareOpacity = activeHover === 'hardware' ? 0.4 : 1;

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
          
          {/* LEFT COLUMN: Hardware / PCB Designer */}
          <div
            id="hero-hardware-col"
            className="lg:col-span-4 text-center lg:text-right transition-opacity duration-300 order-2 lg:order-1"
            style={{ opacity: hardwareOpacity }}
            onMouseEnter={() => setActiveHover('hardware')}
            onMouseLeave={() => setActiveHover(null)}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-semibold mb-3">
              <Layers className="w-3.5 h-3.5 text-amber-700" />
              <span>PCB & Silicon Hardware</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-900 font-sans leading-none mb-4">
              hardware
            </h1>

            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-md mx-auto lg:ml-auto lg:mr-0 mb-6 font-normal">
              {PERSONAL_INFO.hardwareBio}
            </p>

            {/* Hardware Key Specs Badges */}
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
                <span>Explore Hardware</span>
                <span className="text-amber-400">→</span>
              </button>
            </div>
          </div>

          {/* CENTER COLUMN: Split Interactive Portrait */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center order-1 lg:order-2">
            <div
              id="hero-split-container"
              className="relative w-64 sm:w-72 md:w-80 aspect-square rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.12)] border-2 border-neutral-200/90 bg-white group select-none cursor-ew-resize"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                const pct = (x / rect.width) * 100;
                setSliderPosition(Math.round(pct));
              }}
              onTouchMove={(e) => {
                const touch = e.touches[0];
                const rect = e.currentTarget.getBoundingClientRect();
                const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
                const pct = (x / rect.width) * 100;
                setSliderPosition(Math.round(pct));
              }}
            >
              {/* Full Image */}
              <img
                src="/src/assets/images/hero_split_portrait_1788973740137.jpg"
                alt="Harish Bawin K P — Dual Hardware and Firmware Engineer Portrait"
                className="w-full h-full object-cover pointer-events-none"
                referrerPolicy="no-referrer"
              />

              {/* Dynamic Overlay Split Line */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white/90 shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                {/* Center Handle Knob */}
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-neutral-900 border-2 border-white text-white flex items-center justify-center shadow-lg text-[10px] font-bold">
                  ↔
                </div>
              </div>

              {/* Top Pill Indicators inside Portrait */}
              <div className="absolute top-3 left-3 z-10 pointer-events-none">
                <span className="px-2 py-0.5 rounded bg-black/70 text-amber-300 text-[10px] font-mono backdrop-blur-sm">
                  HARDWARE
                </span>
              </div>
              <div className="absolute top-3 right-3 z-10 pointer-events-none">
                <span className="px-2 py-0.5 rounded bg-black/70 text-emerald-300 text-[10px] font-mono backdrop-blur-sm">
                  &lt;FIRMWARE&gt;
                </span>
              </div>

              {/* Bottom Subtle Status */}
              <div className="absolute bottom-2 inset-x-0 flex justify-center z-10 pointer-events-none">
                <span className="text-[10px] bg-white/85 text-neutral-700 px-2.5 py-0.5 rounded-full backdrop-blur-sm border border-neutral-200/60 font-medium">
                  Drag or hover to inspect dual specialization
                </span>
              </div>
            </div>

            {/* Quick Balance Slider Control */}
            <div className="mt-4 flex items-center gap-3 text-xs text-neutral-500 font-medium">
              <button
                onClick={() => setSliderPosition(20)}
                className={`px-2.5 py-1 rounded-full text-[11px] transition-colors ${
                  sliderPosition < 40 ? 'bg-neutral-900 text-white font-bold' : 'hover:bg-neutral-100 text-neutral-600'
                }`}
              >
                Hardware Focus
              </button>
              <button
                onClick={() => setSliderPosition(50)}
                className={`px-2.5 py-1 rounded-full text-[11px] transition-colors ${
                  sliderPosition >= 40 && sliderPosition <= 60
                    ? 'bg-neutral-900 text-white font-bold'
                    : 'hover:bg-neutral-100 text-neutral-600'
                }`}
              >
                50 / 50 Split
              </button>
              <button
                onClick={() => setSliderPosition(80)}
                className={`px-2.5 py-1 rounded-full text-[11px] transition-colors ${
                  sliderPosition > 60 ? 'bg-neutral-900 text-white font-bold' : 'hover:bg-neutral-100 text-neutral-600'
                }`}
              >
                Firmware Focus
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Firmware / Coder */}
          <div
            id="hero-firmware-col"
            className="lg:col-span-4 text-center lg:text-left transition-opacity duration-300 order-3"
            style={{ opacity: firmwareOpacity }}
            onMouseEnter={() => setActiveHover('firmware')}
            onMouseLeave={() => setActiveHover(null)}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs font-semibold mb-3">
              <Terminal className="w-3.5 h-3.5 text-emerald-700" />
              <span>Bare-Metal & Real-Time C</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 font-mono leading-none mb-4">
              &lt;firmware&gt;
            </h1>

            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-md mx-auto lg:mr-auto lg:ml-0 mb-6 font-normal">
              {PERSONAL_INFO.firmwareBio}
            </p>

            {/* Firmware Key Specs Badges */}
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
                <span>Explore Firmware</span>
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
            Chennai, India • Direct register programming, custom peripheral driver libraries, and space-constrained multilayer PCB design.
          </p>
        </div>
      </div>
    </section>
  );
};
