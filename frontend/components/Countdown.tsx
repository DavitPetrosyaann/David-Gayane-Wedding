import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';

const Countdown: React.FC = () => {
  const { t } = useLanguage();
  const targetDate = new Date('2026-09-19T14:30:00').getTime();
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <section className="py-16 px-4 transition-all duration-500">
      <div className="max-w-2xl mx-auto text-center">
        <h3 className="text-xl md:text-2xl mb-10 text-gray-600 italic">{t.countdownTitle}</h3>
        
        <div className="flex justify-center gap-2 sm:gap-4 md:gap-8">
          <TimeUnit value={timeLeft.days} label={t.days} />
          <span className="text-3xl md:text-4xl text-wedding-accent self-start mt-2">:</span>
          <TimeUnit value={timeLeft.hours} label={t.hours} />
          <span className="text-3xl md:text-4xl text-wedding-accent self-start mt-2">:</span>
          <TimeUnit value={timeLeft.minutes} label={t.minutes} />
          <span className="text-3xl md:text-4xl text-wedding-accent self-start mt-2">:</span>
          <TimeUnit value={timeLeft.seconds} label={t.seconds} />
        </div>
      </div>
    </section>
  );
};

const TimeUnit: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center w-16 md:w-24">
    <div className="text-3xl md:text-5xl text-wedding-text mb-2 font-medium">
      {value.toString().padStart(2, '0')}
    </div>
    <div className="text-[10px] sm:text-xs md:text-sm text-gray-500 uppercase tracking-wider">
      {label}
    </div>
  </div>
);

export default Countdown;