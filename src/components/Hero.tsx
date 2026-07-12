import React from 'react';
import { useLanguage } from '../LanguageContext';

const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="relative h-screen min-h-[600px] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image with Overlay and Ken Burns Effect */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat animate-ken-burns"
        style={{ 
          backgroundImage: 'url("/picture/1.jpg")',
          filter: 'brightness(0.65) sepia(0.1)'
        }}
      />
      
      <div className="relative z-10 text-center text-white px-4 fade-in flex flex-col items-center w-full">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-medium mb-6 tracking-wider leading-tight drop-shadow-lg transition-all duration-500">
          {t.names}
        </h1>
        <div className="w-24 h-[1px] bg-white/70 mb-6 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
        <p className="text-xl sm:text-2xl md:text-3xl tracking-[0.2em] font-light drop-shadow-md">
          19.09.2026
        </p>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-md">
          <path d="M12 5v14M19 12l-7 7-7-7"/>
        </svg>
      </div>
    </section>
  );
};

export default Hero;