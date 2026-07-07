import React, { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage, Language } from '../LanguageContext';

const LanguageSelector: React.FC = () => {
  const { lang, setLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: { code: Language; label: string }[] = [
    { code: 'hy', label: 'Հայ' },
    { code: 'en', label: 'Eng' },
    { code: 'ru', label: 'Рус' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[60]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/40 backdrop-blur-md border border-white/50 shadow-[0_0_15px_rgba(0,0,0,0.1)] text-wedding-text hover:bg-white/60 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300"
        aria-label="Select Language"
      >
        <Globe size={20} className="text-wedding-text opacity-80" />
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 mt-2 w-24 bg-white/80 backdrop-blur-lg border border-white/50 rounded-sm shadow-xl overflow-hidden animate-fade-in">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                lang === l.code 
                  ? 'bg-wedding-accent/20 text-wedding-accent' 
                  : 'text-gray-600 hover:bg-white/50 hover:text-wedding-accent'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;