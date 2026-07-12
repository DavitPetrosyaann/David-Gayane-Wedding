import React from 'react';
import { useLanguage } from '../LanguageContext';

const Intro: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 px-6 text-center max-w-3xl mx-auto transition-all duration-500">
      <div className="mb-16">
        <p className="text-2xl md:text-3xl italic text-wedding-accent font-light">
          {t.slogan}
        </p>
      </div>
      
      <h2 className="text-3xl md:text-4xl mb-8 text-wedding-text">
        {t.introTitle}
      </h2>
      
      <p className="text-lg md:text-xl leading-relaxed text-gray-600 font-light whitespace-pre-line">
        {t.introText}
      </p>
    </section>
  );
};

export default Intro;