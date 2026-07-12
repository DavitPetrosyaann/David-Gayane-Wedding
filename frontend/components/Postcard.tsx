import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';

interface PostcardProps {
  onOpen: () => void;
}

// Pre-calculated particle configurations for the magical burst
const particleConfigs = [
  { tx: -140, ty: -200, s: 1.2, d: 0.0, c: '#D4AF37' },
  { tx: 140, ty: -180, s: 1.5, d: 0.1, c: '#F3E5AB' },
  { tx: -100, ty: -240, s: 0.8, d: 0.05, c: '#FFDF00' },
  { tx: 100, ty: -260, s: 1.3, d: 0.15, c: '#FFFDD0' },
  { tx: -180, ty: -120, s: 1.0, d: 0.2, c: '#D4AF37' },
  { tx: 180, ty: -140, s: 1.1, d: 0.05, c: '#F3E5AB' },
  { tx: -60, ty: -280, s: 1.4, d: 0.1, c: '#FFDF00' },
  { tx: 60, ty: -300, s: 0.9, d: 0.2, c: '#D4AF37' },
  { tx: -160, ty: -60, s: 1.2, d: 0.15, c: '#FFFDD0' },
  { tx: 160, ty: -80, s: 1.0, d: 0.0, c: '#FFDF00' },
  { tx: -220, ty: -160, s: 0.8, d: 0.1, c: '#D4AF37' },
  { tx: 220, ty: -180, s: 1.5, d: 0.2, c: '#F3E5AB' },
  { tx: 0, ty: -320, s: 1.6, d: 0.0, c: '#FFFDD0' },
  { tx: -20, ty: -150, s: 1.2, d: 0.1, c: '#D4AF37' },
  { tx: 20, ty: -150, s: 1.2, d: 0.1, c: '#FFDF00' },
];

const Postcard: React.FC<PostcardProps> = ({ onOpen }) => {
  const { t } = useLanguage();
  const [step, setStep] = useState(0);

  const handleClick = () => {
    if (step > 0) return;
    
    // Step 1: Flap opens
    setStep(1);
    
    // Step 2: Letter slides up out of the envelope with a spring bounce + Particles burst
    setTimeout(() => {
      setStep(2);
    }, 800);
    
    // Step 3: Envelope drops away, letter straightens and scales up to be read
    setTimeout(() => {
      setStep(3);
    }, 2400);
    
    // Step 4: Fade out the entire overlay
    setTimeout(() => {
      setStep(4);
    }, 4500); // Give the user time to read the scaled letter
    
    // Final: Unmount postcard and reveal main app
    setTimeout(() => {
      onOpen();
    }, 5500);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-opacity duration-1000 ease-in-out ${step === 4 ? 'opacity-0' : 'opacity-100'}`}>
      
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url("/picture/Background_photo_for_post_card.jpg")',
          filter: 'brightness(0.7) sepia(0.1)'
        }}
      />

      {/* Floating Bokeh Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute left-[10%] w-32 h-32 bg-white/40 rounded-full blur-2xl animate-float-up" style={{ animationDuration: '12s', animationDelay: '0s' }}></div>
         <div className="absolute left-[40%] w-48 h-48 bg-wedding-accent/20 rounded-full blur-3xl animate-float-up" style={{ animationDuration: '15s', animationDelay: '2s' }}></div>
         <div className="absolute left-[70%] w-24 h-24 bg-white/50 rounded-full blur-xl animate-float-up" style={{ animationDuration: '10s', animationDelay: '4s' }}></div>
         <div className="absolute left-[85%] w-40 h-40 bg-wedding-accent/15 rounded-full blur-3xl animate-float-up" style={{ animationDuration: '18s', animationDelay: '1s' }}></div>
      </div>

      {/* Soft Backdrop Blur Overlay */}
      <div className="absolute inset-0 backdrop-blur-[2px] bg-white/10"></div>

      {/* Responsive scale wrapper to ensure it fits perfectly on mobile screens */}
      <div className="relative z-10 transform scale-[0.85] sm:scale-100">
        <div className={`envelope-wrapper step-${step}`} onClick={handleClick}>
          <div className="envelope-part envelope-back"></div>
          
          <div className="envelope-letter">
            {/* Mini Calendar replacing ԴԳ */}
            <div className="transform -rotate-6 bg-white border border-gray-200 shadow-sm rounded-sm p-1.5 mb-2 w-20 flex flex-col items-center">
              <div className="bg-wedding-accent text-white text-[8px] uppercase tracking-widest w-full text-center py-0.5 rounded-t-sm">
                {t.month}
              </div>
              <div className="text-3xl font-serif text-wedding-text mt-1 leading-none">
                19
              </div>
              <div className="text-[8px] text-gray-500 uppercase tracking-widest mt-1">
                2026
              </div>
            </div>
            <div className="text-xs tracking-widest text-gray-500 uppercase mt-1 text-center px-2">{t.names}</div>
          </div>
          
          <div className="envelope-part envelope-front-left"></div>
          <div className="envelope-part envelope-front-right"></div>
          <div className="envelope-part envelope-front-bottom"></div>
          
          <div className="envelope-part envelope-flap flex justify-center">
             {/* Wax seal */}
             <div className={`w-12 h-12 bg-[#8B0000] rounded-full absolute -bottom-6 shadow-md flex items-center justify-center text-[#F5F5DC] font-serif text-lg italic border border-[#600000] transition-opacity duration-500 ${step >= 1 ? 'opacity-0' : 'opacity-100'}`}>
               ԴԳ
             </div>
          </div>

          {/* Magical Particle Burst */}
          {particleConfigs.map((p, i) => (
            <div 
              key={i} 
              className="sparkle-particle" 
              style={{ 
                '--tx': `${p.tx}px`, 
                '--ty': `${p.ty}px`, 
                '--s': p.s, 
                animationDelay: `${p.d}s`,
                backgroundColor: p.c,
                color: p.c
              } as React.CSSProperties} 
            />
          ))}
          
          {step === 0 && (
            <div className="absolute -bottom-16 left-0 right-0 text-center text-white tracking-widest text-sm animate-pulse font-medium drop-shadow-[0_2px_5px_rgba(0,0,0,0.7)]">
              {t.clickToOpen}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Postcard;