import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSplit } from './components/HeroSplit';
import { ProjectsSection } from './components/ProjectsSection';
import { InteractiveWorkbench } from './components/InteractiveWorkbench';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { SkillsSection } from './components/SkillsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ResumeModal } from './components/ResumeModal';
import { InteractiveBackground } from './components/InteractiveBackground';
import { FloatingNavDock } from './components/FloatingNavDock';
import { IntroAnimation } from './components/IntroAnimation';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'hardware' | 'firmware' | 'iot'>('all');
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [introKey, setIntroKey] = useState(1);

  const handleReplayIntro = () => {
    setIntroKey((prev) => prev + 1);
    setShowIntro(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#090a10] text-neutral-100 flex flex-col selection:bg-red-500/30 selection:text-white relative">
      {/* Cinematic Entrance Animation on link open / page load */}
      {showIntro && (
        <IntroAnimation
          key={introKey}
          onComplete={() => setShowIntro(false)}
        />
      )}

      {/* Interactive moving stars, constellation lines, and responsive particles */}
      <InteractiveBackground />

      {/* Top Header Bar matching reference image brand & social icons */}
      <Navbar
        onOpenResume={() => setIsResumeOpen(true)}
        onReplayIntro={handleReplayIntro}
      />

      {/* Floating Right-Hand Pill Dock Navigation */}
      <FloatingNavDock onOpenResume={() => setIsResumeOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 relative z-10">
        {/* Hero Section matching reference image: Sci-Fi Portal Ring, Red Nebula & Harish's Cutout Portrait */}
        <HeroSplit onSelectCategory={(cat) => setSelectedCategory(cat)} />

        {/* Featured Projects Showcase */}
        <ProjectsSection
          selectedCategory={selectedCategory}
          onCategoryChange={(cat) => setSelectedCategory(cat)}
        />

        {/* Real-time Interactive Workbench: ECG Simulation & STM32 Register Explorer */}
        <InteractiveWorkbench />

        {/* Technical Skills Matrix & Stack */}
        <SkillsSection />

        {/* Experience & Education Timeline */}
        <ExperienceTimeline />

        {/* Contact Information & Direct Message Form */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Full Digital Resume Viewer Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </div>
  );
}
