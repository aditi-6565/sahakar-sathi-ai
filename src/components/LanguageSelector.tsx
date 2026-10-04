import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../utils/translations';
import { SupportedLanguage } from '../types';

export const LanguageSelector: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { language, setLanguage } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-xl border border-gray-200 bg-white shadow-xs font-semibold text-gray-800 hover:border-[#0B6B4F] transition-all cursor-pointer ${
          compact ? 'px-2.5 py-1.5 text-xs' : 'px-3.5 py-2 text-sm min-h-[44px]'
        }`}
        aria-label="Select Language"
      >
        <Globe className="w-4 h-4 text-[#0B6B4F]" />
        <span className="font-bold text-[#0B6B4F]">{currentLang.nativeLabel}</span>
        <span className="text-gray-400 text-xs">({currentLang.label})</span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-56 rounded-xl bg-white shadow-xl ring-1 ring-black/10 border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 flex items-center justify-between">
            <span>भाषा निवडा / Select Language</span>
            <span className="text-[10px] bg-green-50 text-green-700 px-1 rounded">8 Languages</span>
          </div>

          <div className="max-h-72 overflow-y-auto py-1">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang.code === language;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-left text-sm transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#0B6B4F]/10 text-[#0B6B4F] font-bold' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{lang.nativeLabel}</span>
                    <span className="text-xs text-gray-400">({lang.label})</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#0B6B4F]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
