import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Intro from './components/Intro';
import Calendar from './components/Calendar';
import PhotoCollage from './components/PhotoCollage';
import Countdown from './components/Countdown';
import Schedule from './components/Schedule';
import DressCode from './components/DressCode';
import BigPhoto from './components/BigPhoto';
import RSVP from './components/RSVP';
import Footer from './components/Footer';
import Postcard from './components/Postcard';
import FadeInSection from './components/FadeInSection';
import Divider from './components/Divider';
import LanguageSelector from './components/LanguageSelector';
import { LanguageProvider } from './LanguageContext';

const GlobalParticles = () => {
  const [particles, setParticles] = useState<{ id: number; left: string; top: string; duration: string; delay: string }[]>([]);

  useEffect(() => {
    // Generate particles only on client to avoid hydration mismatch
    const newParticles = [...Array(20)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: `${Math.random() * 10 + 10}s`,
      delay: `${Math.random() * 5}s`,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-1 h-1 bg-wedding-accent/40 rounded-full animate-float-particle shadow-[0_0_5px_rgba(139,154,133,0.5)]"
          style={{
            left: p.left,
            top: p.top,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
};

const AppContent: React.FC = () => {
  const [isOpened, setIsOpened] = useState(false);

  // Prevent scrolling when postcard is closed
  useEffect(() => {
    if (!isOpened) {
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpened]);

  return (
    <>
      <LanguageSelector />
      {!isOpened && (
        <Postcard 
          onOpen={() => setIsOpened(true)} 
        />
      )}
      
      <div className={`relative min-h-screen bg-wedding-bg font-serif text-wedding-text selection:bg-wedding-accent selection:text-white transition-all duration-1000 ease-in-out ${isOpened ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 h-screen overflow-hidden pointer-events-none'}`}>
        
        {/* Subtle elegant background particles */}
        {isOpened && <GlobalParticles />}

        <div className="relative z-10">
          {/* Hero is not wrapped in FadeInSection so it appears immediately after the envelope fades */}
          <Hero />
          
          <FadeInSection>
            <Intro />
            <Divider />
          </FadeInSection>
          
          <FadeInSection>
            <Calendar />
            <Divider />
          </FadeInSection>
          
          <FadeInSection>
            <PhotoCollage />
            <Divider />
          </FadeInSection>
          
          <FadeInSection>
            <Countdown />
            <Divider />
          </FadeInSection>
          
          <FadeInSection>
            <Schedule />
            <Divider />
          </FadeInSection>
          
          <FadeInSection>
            <DressCode />
            <Divider />
          </FadeInSection>

          <FadeInSection>
            <BigPhoto />
            <Divider />
          </FadeInSection>
          
          <FadeInSection>
            <RSVP />
          </FadeInSection>
          
          <FadeInSection>
            <Footer />
          </FadeInSection>
        </div>
      </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;