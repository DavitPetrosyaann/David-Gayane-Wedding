import React from 'react';
import { useLanguage } from '../LanguageContext';

const Calendar: React.FC = () => {
  const { t } = useLanguage();

  // September 2026 calendar grid (Starts on Tuesday)
  const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const dates = [
    null, 1, 2, 3, 4, 5, 6,
    7, 8, 9, 10, 11, 12, 13,
    14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27,
    28, 29, 30
  ];

  return (
    <section className="py-16 px-2 sm:px-4 bg-wedding-light/30 transition-all duration-500">
      <div className="max-w-md mx-auto text-center">
        <h3 className="text-2xl mb-8 text-wedding-text tracking-widest uppercase">{t.month}</h3>
        
        <div className="grid grid-cols-7 gap-y-4 gap-x-1 sm:gap-x-2 text-sm md:text-base">
          {/* Day headers */}
          {days.map(day => (
            <div key={day} className="text-gray-500 font-medium">{day}</div>
          ))}
          
          {/* Dates */}
          {dates.map((date, index) => (
            <div key={index} className="flex justify-center items-center h-8 sm:h-10">
              {date === 19 ? (
                <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center transform scale-125 transition-transform hover:scale-150 cursor-default">
                  <div className="absolute inset-0 flex items-center justify-center animate-heartbeat">
                    <svg 
                      className="absolute inset-0 w-full h-full text-wedding-accent drop-shadow-md" 
                      viewBox="0 0 24 24" 
                      fill="currentColor"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <span className="relative z-10 text-white font-medium text-xs sm:text-sm pb-0.5 sm:pb-1">{date}</span>
                  </div>
                </div>
              ) : (
                <span className="text-gray-700">{date}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Calendar;