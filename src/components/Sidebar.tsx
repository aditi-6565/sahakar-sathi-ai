import React from 'react';
import {
  LayoutDashboard,
  MessageSquareQuote,
  Mic,
  Users2,
  Landmark,
  ShieldCheck,
  Building2,
  Coins,
  AlertOctagon,
  History,
  PhoneCall,
  MonitorCheck,
  Database,
  BarChart3,
  Layers,
  X,
  Users,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, t } = useApp();

  const coreNavItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'chat', label: t('aiChat'), icon: MessageSquareQuote },
    { id: 'voice', label: t('voiceAssistant'), icon: Mic },
    { id: 'pmfby', label: t('pmfby'), icon: ShieldCheck },
    { id: 'pacs', label: t('pacs'), icon: Building2 },
    { id: 'cooperative', label: t('coopGovernance'), icon: Users2 },
    { id: 'schemes', label: t('schemes'), icon: Landmark },
    { id: 'financial', label: t('financialLiteracy'), icon: Coins },
    { id: 'grievance', label: t('grievance'), icon: AlertOctagon },
  ];

  const secondaryNavItems = [
    { id: 'history', label: t('history'), icon: History },
    { id: 'contacts', label: t('emergencyContacts'), icon: PhoneCall },
    { id: 'kiosk', label: t('ruralKiosk'), icon: MonitorCheck },
    { id: 'admin', label: t('adminKnowledge'), icon: Database },
    { id: 'analytics', label: t('analytics'), icon: BarChart3 },
    { id: 'impact', label: t('hackathonImpact'), icon: Layers },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/30 z-40 lg:hidden backdrop-blur-2xs transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-16.5 left-0 z-50 lg:z-10 h-full lg:h-[calc(100vh-4.25rem)] w-64 bg-white border-r border-[#E4E7EC] flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header for Mobile */}
        <div className="flex items-center justify-between p-4 border-b border-[#E4E7EC] lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0B6B4F] text-white flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <span className="font-bold text-[#1F2937] text-sm">Sahakar Sathi</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          <div>
            <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#667085]">
              सेवा आणि मार्गदर्शन (Services)
            </div>

            <div className="space-y-0.5 mt-1">
              {coreNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer min-h-[42px] ${
                      isActive
                        ? 'bg-[#0B6B4F] text-white font-semibold shadow-2xs'
                        : 'text-[#1F2937] hover:bg-gray-100/70 hover:text-black'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#0B6B4F]'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-[#E4E7EC]">
            <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#667085]">
              माहिती व संदर्भ (Resources)
            </div>

            <div className="space-y-0.5 mt-1">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer min-h-[40px] ${
                      isActive
                        ? 'bg-[#0B6B4F] text-white font-semibold shadow-2xs'
                        : 'text-[#667085] hover:bg-gray-100/70 hover:text-[#1F2937]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#667085]'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Farmer Support Footer Card */}
        <div className="p-3 border-t border-[#E4E7EC] bg-gray-50/50">
          <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-xl p-2.5 text-xs">
            <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-900 mb-1">
              <span>अधिकृत हेल्पलाइन (Toll-Free)</span>
              <span className="bg-[#0B6B4F] text-white text-[9px] px-1.5 py-0.2 rounded font-sans">२४×७</span>
            </div>
            <div className="text-[11px] text-gray-700">
              पीक विमा: <span className="font-bold text-[#0B6B4F]">14447</span>
            </div>
            <div className="text-[11px] text-gray-700">
              किसान कॉल: <span className="font-bold text-[#0B6B4F]">1551</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
