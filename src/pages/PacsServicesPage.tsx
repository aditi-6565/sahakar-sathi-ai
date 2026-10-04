import React from 'react';
import {
  Building2,
  Coins,
  Wheat,
  Tractor,
  Layers,
  Sparkles,
  ArrowRight,
  Shield,
  FileText,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Disclaimer } from '../components/Disclaimer';
import { getPageContent } from '../utils/pageContent';

export const PacsServicesPage: React.FC = () => {
  const { setActiveTab, sendMessage, language } = useApp();
  const pacsData = getPageContent(language).pacs;

  const handleAskPacs = (query: string) => {
    setActiveTab('chat');
    sendMessage(query);
  };

  const coreIcons = [Coins, Wheat, Layers];
  const expandedIcons = [FileText, Tractor, Building2];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
              {pacsData.badge}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
              {pacsData.title}
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 max-w-3xl leading-relaxed">
          {pacsData.desc}
        </p>

        <Disclaimer />
      </div>

      {/* Difference Notice: Standard Core vs Expanded Services */}
      <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 text-xs sm:text-sm text-blue-950 flex items-start gap-3">
        <Shield className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block text-xs uppercase tracking-wider text-blue-900 mb-0.5">
            {pacsData.noteTitle}
          </span>
          {pacsData.noteDesc}
        </div>
      </div>

      {/* Section 1: Standard Core Services */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <Coins className="w-5 h-5 text-[#0B6B4F]" />
            {pacsData.coreTitle}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {pacsData.coreServices.map((svc, idx) => {
            const Icon = coreIcons[idx] || Coins;
            return (
              <div key={idx} className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0B6B4F] flex items-center justify-center font-bold">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-gray-900">
                  {svc.title}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {svc.desc}
                </p>
                <div className="pt-2 border-t border-gray-100 text-xs text-[#0B6B4F] font-semibold">
                  {svc.tag}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Expanded Modern Services */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#E9A23B]" />
            {pacsData.expandedTitle}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {pacsData.expandedServices.map((svc, idx) => {
            const Icon = expandedIcons[idx] || FileText;
            return (
              <div key={idx} className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-gray-900">
                  {svc.title}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {svc.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-emerald-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-white mb-1">
            {pacsData.ctaTitle}
          </h4>
          <p className="text-xs text-emerald-200">
            {pacsData.ctaDesc}
          </p>
        </div>
        <button
          onClick={() => handleAskPacs(pacsData.ctaBtn)}
          className="px-5 py-2.5 rounded-xl bg-[#E9A23B] hover:bg-[#d8912e] text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs flex items-center gap-1.5"
        >
          <span>{pacsData.ctaBtn}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
