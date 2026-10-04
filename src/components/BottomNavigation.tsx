import React from 'react';
import { Home, MessageSquare, Layers, History, Mic } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BottomNavigation: React.FC = () => {
  const { activeTab, setActiveTab, t } = useApp();

  const tabs = [
    { id: 'dashboard', label: t('home'), icon: Home },
    { id: 'chat', label: t('aiChat'), icon: MessageSquare },
    { id: 'pacs', label: 'Services', icon: Layers },
    { id: 'voice', label: t('voiceAssistant'), icon: Mic },
    { id: 'history', label: t('history'), icon: History },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E4E7EC] shadow-md lg:hidden">
      <div className="grid grid-cols-5 items-center max-w-md mx-auto h-16 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            activeTab === tab.id ||
            (tab.id === 'pacs' && (activeTab === 'pacs' || activeTab === 'cooperative' || activeTab === 'pmfby' || activeTab === 'schemes' || activeTab === 'financial' || activeTab === 'grievance'));

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-colors cursor-pointer ${
                isActive ? 'text-[#0B6B4F] font-semibold' : 'text-[#667085] hover:text-[#1F2937]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#0B6B4F]' : 'text-[#667085]'}`} />
              <span className="text-[10px] mt-1 truncate max-w-[64px] font-sans">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
