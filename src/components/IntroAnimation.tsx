import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';

interface IntroAnimationProps {
  onComplete: () => void;
}

export const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  // Stages:
  // 1: 'entering' - Image moving to center of screen (0s - 1.5s)
  // 2: 'name_reveal' - Name animating letter-by-letter (1.5s - 4.0s)
  // 3: 'exiting' - Face going off / fading into the main website (4.0s - 4.8s)
  // 4: 'done' - Completed
  const [stage, setStage] = useState<'entering' | 'name_reveal' | 'exiting' | 'done'>('entering');
  const [visibleCharsCount, setVisibleCharsCount] = useState(0);

  const fullName = "HARISH BAWIN K P";
  const subtitle = "Electronics & Embedded Systems Engineer";

  useEffect(() => {
    // Stage 1 -> Stage 2: Face reaches center
    const timer1 = setTimeout(() => {
      setStage('name_reveal');
    }, 1400);

    // Letter-by-letter animation during stage 2
    let charInterval: NodeJS.Timeout;
    const startCharTimer = setTimeout(() => {
      let current = 0;
      charInterval = setInterval(() => {
        current += 1;
        setVisibleCharsCount(current);
        if (current >= fullName.length) {
          clearInterval(charInterval);
        }
      }, 75); // ~75ms per character
    }, 1500);

    // Stage 2 -> Stage 3: Face and intro begin going off
    const timer2 = setTimeout(() => {
      setStage('exiting');
    }, 4200);

    // Stage 3 -> Stage 4: Intro complete, reveal remaining website
    const timer3 = setTimeout(() => {
      setStage('done');
      onComplete();
    }, 5000);

    // Escape key skips intro
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        skipIntro();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer1);
      clearTimeout(startCharTimer);
      clearTimeout(timer2);
      clearTimeout(timer3);
      if (charInterval) clearInterval(charInterval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete]);

  const skipIntro = () => {
    setStage('exiting');
    setTimeout(() => {
      setStage('done');
      onComplete();
    }, 400);
  };

  if (stage === 'done') return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#07080d] overflow-hidden transition-all duration-800 ${
        stage === 'exiting' ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Sci-fi deep cosmos background grid & ambient nebula glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(220,38,38,0.18),rgba(7,8,13,0.95))] pointer-events-none" />
      
      {/* Perspective futuristic grid floor */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(239,68,68,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(239,68,68,0.15) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 20%, transparent 80%)'
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-1.5 h-1.5 rounded-full bg-red-500 animate-ping opacity-60" />
        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 rounded-full bg-amber-400 animate-pulse opacity-40" />
        <div className="absolute top-1/2 right-1/3 w-1 h-1 rounded-full bg-white animate-ping opacity-50" />
      </div>

      {/* Skip button in top corner */}
      <button
        onClick={skipIntro}
        className="absolute top-6 right-6 z-20 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-mono text-neutral-300 hover:text-white transition-all cursor-pointer backdrop-blur-md active:scale-95 group"
      >
        <span>Skip</span>
        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-red-400" />
      </button>

      {/* Center Cinematic Container */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-2xl">
        
        {/* Holographic Target Rings & Face Portal */}
        <div className="relative mb-6 flex items-center justify-center">
          
          {/* Outer rotating cyber ring */}
          <div
            className={`absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-dashed border-red-500/40 animate-[spin_16s_linear_infinite] transition-all duration-1000 ${
              stage === 'entering' ? 'scale-75 opacity-20' : 'scale-100 opacity-80'
            }`}
          />

          {/* Counter-rotating cyan/amber accent brackets ring */}
          <div
            className={`absolute w-72 h-72 sm:w-88 sm:h-88 rounded-full border border-red-500/20 animate-[spin_24s_linear_infinite_reverse] transition-all duration-1000 ${
              stage === 'entering' ? 'scale-50 opacity-0' : 'scale-100 opacity-60'
            }`}
          >
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full shadow-[0_0_12px_#ef4444]" />
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-400 rounded-full shadow-[0_0_8px_#f59e0b]" />
          </div>

          {/* Glowing Red Radial Backlight */}
          <div className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-gradient-to-tr from-red-600/40 via-red-500/20 to-transparent blur-2xl animate-pulse" />

          {/* Central Portrait Container: brings image into center of the screen */}
          <div
            className={`relative w-48 h-48 sm:w-60 sm:h-60 rounded-full overflow-hidden border-2 border-red-500/80 shadow-[0_0_40px_rgba(239,68,68,0.5)] bg-[#0d0f17] transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${
              stage === 'entering'
                ? 'scale-50 opacity-0 translate-y-16'
                : stage === 'exiting'
                ? 'scale-110 opacity-0 -translate-y-8'
                : 'scale-100 opacity-100 translate-y-0'
            }`}
          >
            {/* The Cutout Portrait */}
            <img
              src="/images/coatphoto_cutout.png"
              alt="Harish Bawin K P"
              className="w-full h-full object-cover object-top scale-105 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
              loading="eager"
            />

            {/* High-tech scanning overlay bar */}
            <div 
              className={`absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-400 to-transparent opacity-75 shadow-[0_0_10px_#ef4444] transition-opacity duration-500 ${
                stage === 'entering' || stage === 'name_reveal' ? 'animate-[bounce_2.5s_infinite]' : 'opacity-0'
              }`}
            />
          </div>
        </div>

        {/* Phase 2: Letter-by-letter animated typography of the name */}
        <div className="mt-4 min-h-[90px] flex flex-col items-center justify-center">
          {/* Main Name typography: renders one-by-one */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-wider text-white uppercase flex items-center justify-center flex-wrap">
            {fullName.split('').map((char, index) => {
              const isVisible = index < visibleCharsCount;
              const isCurrent = index === visibleCharsCount - 1;
              return (
                <span
                  key={index}
                  className={`inline-block transition-all duration-200 transform ${
                    isVisible
                      ? 'opacity-100 translate-y-0 scale-100 text-white'
                      : 'opacity-0 translate-y-4 scale-75 text-red-500'
                  } ${isCurrent ? 'text-red-400 drop-shadow-[0_0_15px_rgba(239,68,68,0.9)] scale-110' : ''} ${
                    char === ' ' ? 'w-3 sm:w-4' : ''
                  }`}
                  style={{
                    textShadow: isVisible
                      ? '0 0 20px rgba(239,68,68,0.4), 0 2px 4px rgba(0,0,0,0.8)'
                      : 'none',
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              );
            })}
            
            {/* Blinking cursor while typing */}
            {stage === 'name_reveal' && visibleCharsCount < fullName.length && (
              <span className="inline-block w-2 sm:w-3 h-7 sm:h-10 ml-1 bg-red-500 animate-pulse shadow-[0_0_10px_#ef4444]" />
            )}
          </h1>

          {/* Subtitle fading in once letters start appearing */}
          <p
            className={`mt-3 text-xs sm:text-sm md:text-base font-mono tracking-widest text-neutral-400 uppercase transition-all duration-700 flex items-center gap-2 ${
              visibleCharsCount > 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-red-400 shrink-0 animate-pulse" />
            <span>{subtitle}</span>
            <Sparkles className="w-3.5 h-3.5 text-red-400 shrink-0 animate-pulse" />
          </p>
        </div>

      </div>
    </div>
  );
};
