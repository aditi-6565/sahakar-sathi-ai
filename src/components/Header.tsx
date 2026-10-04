import React from 'react';
import { Mic, User, Menu, Users, Home, Layers, MessageSquare, AlertOctagon, Landmark } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LanguageSelector } from './LanguageSelector';

export const Header: React.FC<{ onToggleSidebar?: () => void }> = ({ onToggleSidebar }) => {
  const { t, activeTab, setActiveTab, userProfile } = useApp();

  const navLinks = [
    { id: 'dashboard', label: t('home') },
    { id: 'pacs', label: 'Services' },
    { id: 'chat', label: t('aiChat') },
    { id: 'grievance', label: t('grievance') },
    { id: 'schemes', label: t('schemes') },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E4E7EC] shadow-2xs">
      {/* Subtle micro national tricolor bar */}
      <div className="h-0.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile menu toggle + Clean Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            {/* Simple cooperative/community icon */}
            <div className="w-9 h-9 rounded-lg bg-[#0B6B4F] text-white flex items-center justify-center font-bold text-base shadow-2xs">
              <Users className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-bold tracking-tight text-[#1F2937] font-sans">
                  SAHAKAR SATHI
                </span>
                <span className="text-[10px] font-bold bg-[#0B6B4F]/10 text-[#0B6B4F] px-1.5 py-0.2 rounded font-sans">
                  AI
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#667085] font-medium leading-none truncate max-w-[200px] sm:max-w-xs">
                {t('ministry')}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Desktop Navigation Bar */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id || (link.id === 'pacs' && (activeTab === 'pacs' || activeTab === 'cooperative' || activeTab === 'pmfby' || activeTab === 'financial'));
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#0B6B4F] bg-[#0B6B4F]/8 font-semibold'
                    : 'text-[#667085] hover:text-[#1F2937] hover:bg-gray-50'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Language Selector + Voice Assistant Button + User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Elegant Language Selector */}
          <LanguageSelector compact />

          {/* Quick Voice Assistant Trigger */}
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer min-h-[36px] ${
              activeTab === 'voice'
                ? 'bg-[#E9A23B] text-white border-[#E9A23B] shadow-2xs'
                : 'bg-white text-[#1F2937] border-[#E4E7EC] hover:bg-amber-50/50 hover:border-amber-200'
            }`}
            title={t('voiceAssistant')}
            aria-label={t('voiceAssistant')}
          >
            <Mic className="w-3.5 h-3.5 text-[#E9A23B]" />
            <span className="hidden sm:inline">{t('voiceAssistant')}</span>
          </button>

          {/* User Profile Chip */}
          <button
            onClick={() => setActiveTab('history')}
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg border border-[#E4E7EC] hover:border-gray-300 bg-white text-xs text-[#1F2937] cursor-pointer"
            title="User Profile"
          >
            <div className="w-6 h-6 rounded-full bg-[#0B6B4F]/10 text-[#0B6B4F] flex items-center justify-center font-bold text-xs">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="hidden sm:block text-left">
              <div className="font-semibold text-xs leading-tight">{userProfile.name}</div>
              <div className="text-[10px] text-[#667085] leading-tight">{userProfile.district}</div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
