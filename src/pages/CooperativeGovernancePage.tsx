import React from 'react';
import {
  Users2,
  CheckCircle,
  FileText,
  Vote,
  Scale,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Disclaimer } from '../components/Disclaimer';
import { getPageContent } from '../utils/pageContent';

export const CooperativeGovernancePage: React.FC = () => {
  const { setActiveTab, sendMessage, language } = useApp();
  const coopData = getPageContent(language).cooperative;

  const handleAsk = (topic: string) => {
    setActiveTab('chat');
    sendMessage(`Please guide me about: ${topic}`);
  };

  const pillarIcons = [FileText, Vote, Scale, ShieldCheck];
  const pillarColors = [
    { badge: 'text-[#0B6B4F] bg-emerald-50 border-emerald-200', icon: 'text-gray-400' },
    { badge: 'text-amber-700 bg-amber-50 border-amber-200', icon: 'text-amber-500' },
    { badge: 'text-blue-700 bg-blue-50 border-blue-200', icon: 'text-blue-500' },
    { badge: 'text-teal-700 bg-teal-50 border-teal-200', icon: 'text-teal-600' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-[#0B6B4F]/10 text-[#0B6B4F] flex items-center justify-center font-bold">
            <Users2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B6B4F]">
              {coopData.badge}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
              {coopData.title}
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 max-w-3xl leading-relaxed">
          {coopData.desc}
        </p>

        <Disclaimer />
      </div>

      {/* Grid of Key Governance Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {coopData.pillars.map((pillar, idx) => {
          const Icon = pillarIcons[idx] || FileText;
          const styling = pillarColors[idx] || pillarColors[0];

          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${styling.badge}`}>
                    {pillar.tag}
                  </span>
                  <Icon className={`w-5 h-5 ${styling.icon}`} />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">
                  {pillar.title}
                </h3>
                <ul className="text-xs sm:text-sm text-gray-700 space-y-2">
                  {pillar.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#0B6B4F] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-500">Official Standards</span>
                <button
                  onClick={() => handleAsk(pillar.title)}
                  className="text-xs font-bold text-[#0B6B4F] flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>Ask AI</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Statutory Rights Section */}
      <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <h3 className="text-lg sm:text-xl font-bold mb-4">
          {coopData.rightsTitle}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {coopData.rights.map((r, i) => (
            <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-emerald-100 bg-white/5 p-3 rounded-xl border border-white/10">
              <CheckCircle className="w-4 h-4 text-[#E9A23B] shrink-0" />
              <span>{r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
