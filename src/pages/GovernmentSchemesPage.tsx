import React from 'react';
import {
  Landmark,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Disclaimer } from '../components/Disclaimer';
import { getPageContent } from '../utils/pageContent';

export const GovernmentSchemesPage: React.FC = () => {
  const { setActiveTab, sendMessage, language } = useApp();
  const schemesData = getPageContent(language).schemes;

  const handleAskScheme = (title: string) => {
    setActiveTab('chat');
    sendMessage(`Please guide me about the government scheme: ${title}`);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-[#0B6B4F]/10 text-[#0B6B4F] flex items-center justify-center font-bold">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B6B4F]">
              {schemesData.badge}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
              {schemesData.title}
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 max-w-3xl leading-relaxed">
          {schemesData.desc}
        </p>

        <Disclaimer />
      </div>

      {/* Scheme Cards */}
      <div className="space-y-6">
        {schemesData.schemesList.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-xs hover:border-[#0B6B4F] transition-all space-y-4"
          >
            {/* Title Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-150">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#0B6B4F] border border-emerald-200">
                    {scheme.badge}
                  </span>
                  <span className="text-[10px] font-semibold text-gray-500">
                    {scheme.ministry}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mt-1">
                  {scheme.title}
                </h3>
              </div>

              <button
                onClick={() => handleAskScheme(scheme.title)}
                className="self-start sm:self-center px-3.5 py-1.5 rounded-xl bg-[#0B6B4F]/10 hover:bg-[#0B6B4F]/20 text-[#0B6B4F] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E9A23B]" />
                <span>{schemesData.askAiBtn}</span>
              </button>
            </div>

            {/* Scheme Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="space-y-3">
                <div>
                  <span className="font-bold text-gray-700 block text-xs mb-1">
                    {schemesData.whoItHelpsLabel}
                  </span>
                  <p className="text-gray-800 leading-relaxed">{scheme.whoItHelps}</p>
                </div>
                <div>
                  <span className="font-bold text-gray-700 block text-xs mb-1">
                    {schemesData.applyLabel}
                  </span>
                  <p className="text-gray-800 leading-relaxed">{scheme.howToApply}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="font-bold text-[#0B6B4F] block text-xs mb-1">
                    {schemesData.benefitsLabel}
                  </span>
                  <p className="text-gray-800 leading-relaxed bg-emerald-50/40 p-3 rounded-xl border border-emerald-100">
                    {scheme.benefits}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
