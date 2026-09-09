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

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'hardware' | 'firmware' | 'iot'>('all');
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#222222] flex flex-col selection:bg-neutral-900 selection:text-white">
      {/* Top Navigation Bar */}
      <Navbar onOpenResume={() => setIsResumeOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Signature Adham Dannaway Split Hero: Hardware vs <Firmware> */}
        <HeroSplit onSelectCategory={(cat) => setSelectedCategory(cat)} />

        {/* Featured Projects: "SOME OF MY LATEST WORK" */}
        <ProjectsSection
          selectedCategory={selectedCategory}
          onCategoryChange={(cat) => setSelectedCategory(cat)}
        />

        {/* Real-time Interactive Workbench: ECG Simulation & STM32 Register Explorer */}
        <InteractiveWorkbench />

        {/* Experience & Education Timeline */}
        <ExperienceTimeline />

        {/* Technical Skills Matrix & Certifications */}
        <SkillsSection />

        {/* Contact Information & Direct Message Form */}
        <ContactSection />
      </main>

      {/* Adham Dannaway Style Footer with Top-Curved Return Button */}
      <Footer />

      {/* Full Digital Resume Viewer & Print Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </div>
  );
}
