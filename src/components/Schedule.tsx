import React from 'react';
import { MapPin } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const Schedule: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 px-4 bg-wedding-light/20 transition-all duration-500">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex items-center justify-center gap-4 mb-16">
          <div className="h-[1px] w-16 bg-wedding-accent"></div>
          <h2 className="text-3xl md:text-4xl text-wedding-text italic">{t.scheduleTitle}</h2>
          <div className="h-[1px] w-16 bg-wedding-accent"></div>
        </div>

        <div className="space-y-20">
          {/* Ceremony */}
          <div className="flex flex-col items-center">
            <div className="mb-6 text-wedding-accent w-24 h-24 relative flex items-center justify-center">
              <svg width="96" height="96" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="absolute inset-0 w-full h-full drop-shadow-md">
                {/* Left Ring */}
                <circle cx="16" cy="20" r="7" className="animate-ring-left" />
                {/* Right Ring */}
                <circle cx="24" cy="20" r="7" className="animate-ring-right" />
                {/* Sparkle Star */}
                <path d="M20 12 L21 19 L28 20 L21 21 L20 28 L19 21 L12 20 L19 19 Z" fill="currentColor" stroke="none" className="animate-sparkle" style={{ transformOrigin: '20px 20px' }} />
                {/* Sparkle Wave */}
                <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="0.5" fill="none" className="animate-sparkle-wave" style={{ transformOrigin: '20px 20px' }} />
              </svg>
            </div>
            <h3 className="text-3xl mb-2">14:30</h3>
            <h4 className="text-xl md:text-2xl mb-4 tracking-widest uppercase">{t.ceremony}</h4>
            <p className="text-lg text-gray-600">{t.church}</p>
            <p className="text-md text-gray-500 mt-1">{t.churchAddress}</p>
            
            <a 
              href="https://www.google.com/maps/place/%D0%A6%D0%B5%D1%80%D0%BA%D0%BE%D0%B2%D1%8C+%D0%A1%D0%B2%D1%8F%D1%82%D0%BE%D0%B9+%D0%93%D0%B0%D1%8F%D0%BD%D1%8D/@40.1575021,44.2918411,17z/data=!3m1!4b1!4m6!3m5!1s0x406a952aa68c6009:0x8a692ec2c8be215a!8m2!3d40.1575021!4d44.2918411!16s%2Fm%2F027140_?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 border border-wedding-accent text-wedding-accent hover:bg-wedding-accent hover:text-white transition-all duration-300 rounded-sm text-sm tracking-widest uppercase hover:shadow-[0_0_15px_rgba(139,154,133,0.6)]"
            >
              <MapPin size={18} />
              {t.map}
            </a>
          </div>

          {/* Reception */}
          <div className="flex flex-col items-center">
            <div className="mb-6 text-wedding-accent w-24 h-24 relative flex items-center justify-center">
              <svg width="96" height="96" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="absolute inset-0 w-full h-full drop-shadow-md">
                {/* Left Glass */}
                <g className="animate-glass-left" style={{ transformOrigin: '14px 32px' }}>
                  <path d="M 10 8 L 12 20 C 12 22.5 16 22.5 16 20 L 18 8 Z" fill="rgba(255,255,255,0.5)" />
                  <path d="M 14 21.5 L 14 32 M 10 32 L 18 32" />
                  <path d="M 11 12 L 17 12" className="animate-pulse" />
                </g>
                {/* Right Glass */}
                <g className="animate-glass-right" style={{ transformOrigin: '26px 32px' }}>
                  <path d="M 22 8 L 24 20 C 24 22.5 28 22.5 28 20 L 30 8 Z" fill="rgba(255,255,255,0.5)" />
                  <path d="M 26 21.5 L 26 32 M 22 32 L 30 32" />
                  <path d="M 23 12 L 29 12" className="animate-pulse" />
                </g>
                {/* Bubbles */}
                <circle cx="18" cy="14" r="0.8" fill="currentColor" stroke="none" className="animate-bubble-1" />
                <circle cx="22" cy="12" r="1" fill="currentColor" stroke="none" className="animate-bubble-2" />
                <circle cx="20" cy="10" r="0.8" fill="currentColor" stroke="none" className="animate-bubble-3" />
                {/* Splashes */}
                <circle cx="20" cy="8" r="1" fill="currentColor" stroke="none" className="animate-splash-1" />
                <circle cx="20" cy="8" r="1.5" fill="currentColor" stroke="none" className="animate-splash-2" />
              </svg>
            </div>
            <h3 className="text-3xl mb-2">17:00</h3>
            <h4 className="text-xl md:text-2xl mb-4 tracking-widest uppercase">{t.reception}</h4>
            <p className="text-lg text-gray-600">{t.restaurant}</p>
            <p className="text-md text-gray-500 mt-1">{t.restaurantAddress}</p>
            
            <a 
              href="https://www.google.com/maps/place/Alga/@40.186947,44.6037304,17z/data=!3m1!4b1!4m6!3m5!1s0x406aa4a1057a30a9:0xbc52d00eb37165bb!8m2!3d40.186947!4d44.6037304!16s%2Fg%2F11g722mzld?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 border border-wedding-accent text-wedding-accent hover:bg-wedding-accent hover:text-white transition-all duration-300 rounded-sm text-sm tracking-widest uppercase hover:shadow-[0_0_15px_rgba(139,154,133,0.6)]"
            >
              <MapPin size={18} />
              {t.map}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Schedule;