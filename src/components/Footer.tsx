import React from 'react';
import { useLanguage } from '../LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="py-12 text-center bg-wedding-bg transition-all duration-500">
      <h2 className="text-3xl md:text-4xl text-wedding-text italic mb-6">
        {t.footerText}
      </h2>
      <p className="text-gray-500 tracking-widest">
        19.09.2026
      </p>
    </footer>
  );
};

export default Footer;