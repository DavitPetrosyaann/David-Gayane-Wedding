import React from 'react';
import { useLanguage } from '../LanguageContext';

const DressCode: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 px-6 text-center max-w-2xl mx-auto transition-all duration-500">
      <div className="border border-wedding-accent/30 p-8 md:p-12 rounded-sm bg-white/50 shadow-sm">
        <p className="text-lg md:text-xl leading-relaxed italic font-medium bg-gradient-to-r from-gray-700 via-wedding-accent to-gray-700 bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent">
          {t.dressCode}
        </p>
      </div>
    </section>
  );
};

export default DressCode;