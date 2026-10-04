import React from 'react';
import {
  MessageSquareQuote,
  Sparkles,
  Mic,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users2,
  CheckCircle2,
  Globe2,
  FileText,
  Volume2,
  Cpu,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getPageContent } from '../utils/pageContent';

export const LandingPage: React.FC = () => {
  const { t, setActiveTab, setLanguage, language } = useApp();
  const content = getPageContent(language).landing;

  const stepIcons = [Mic, Cpu, FileText, CheckCircle2];
  const stepColors = [
    'text-amber-600 bg-amber-50 border-amber-200',
    'text-emerald-700 bg-emerald-50 border-emerald-200',
    'text-blue-700 bg-blue-50 border-blue-200',
    'text-teal-700 bg-teal-50 border-teal-200',
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0B6B4F]/10 via-[#0B6B4F]/5 to-transparent border border-[#0B6B4F]/20 p-6 sm:p-10 lg:p-12">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#0B6B4F]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#E9A23B]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Official Ministry Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#0B6B4F]/20 text-[#0B6B4F] text-xs font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#16845B]" />
            <span>सहकारिता मंत्रालय, भारत सरकार • Ministry of Cooperation • NCCT</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.15]">
            SAHAKAR SATHI <span className="text-[#0B6B4F]">AI</span>
          </h1>

          <p className="text-base sm:text-xl font-bold text-gray-700 max-w-2xl mx-auto leading-relaxed">
            "{t('tagline')}"
          </p>

          <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto">
            {content.heroDesc}
          </p>

          {/* Primary Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => setActiveTab('chat')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#0B6B4F] hover:bg-[#095740] text-white font-bold text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2.5 min-h-[52px] cursor-pointer"
            >
              <MessageSquareQuote className="w-5 h-5" />
              <span>{t('askSahakarSathi')}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-gray-50 text-gray-800 font-bold text-base border-2 border-gray-200 hover:border-[#0B6B4F] shadow-xs transition-all flex items-center justify-center gap-2 min-h-[52px] cursor-pointer"
            >
              <span>{t('exploreServices')}</span>
            </button>

            <button
              onClick={() => setActiveTab('voice')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-base border border-amber-300 shadow-xs transition-all flex items-center justify-center gap-2 min-h-[52px] cursor-pointer"
            >
              <Mic className="w-5 h-5 text-amber-600" />
              <span>{t('voiceAssistant')}</span>
            </button>
          </div>

          {/* Language Selection Chips on Landing Page */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-semibold text-gray-500 mr-1 flex items-center gap-1">
              <Globe2 className="w-3.5 h-3.5" /> भाषा निवडा / Select Language:
            </span>
            {[
              { code: 'mr', name: 'मराठी' },
              { code: 'hi', name: 'हिंदी' },
              { code: 'en', name: 'English' },
              { code: 'gu', name: 'ગુજરાતી' },
              { code: 'ta', name: 'தமிழ்' },
              { code: 'te', name: 'తెలుగు' },
              { code: 'kn', name: 'ಕನ್ನಡ' },
              { code: 'bn', name: 'বাংলা' },
            ].map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code as any)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  language === l.code
                    ? 'bg-[#0B6B4F] text-white shadow-xs'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-[#0B6B4F]'
                }`}
              >
                {l.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Story / Conceptual Flow: Speak → Understand → Guide → Act */}
      <section className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-10 shadow-xs">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0B6B4F] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {content.stepsBadge}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">
            {content.stepsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {content.stepsSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {content.fourSteps.map((item, index) => {
            const Icon = stepIcons[index] || CheckCircle2;
            const color = stepColors[index] || 'text-[#0B6B4F] bg-emerald-50 border-emerald-200';
            return (
              <div
                key={index}
                className="p-5 rounded-2xl border border-gray-150 bg-gray-50/50 hover:bg-white hover:border-[#0B6B4F] transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-gray-900">{item.step}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Core Capability Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {content.coreCaps.map((cap, idx) => {
          const tabTargets = ['cooperative', 'pmfby', 'pacs'];
          const targetTab = tabTargets[idx] || 'dashboard';
          const icons = [Users2, ShieldCheck, Building2];
          const CardIcon = icons[idx] || Users2;
          const iconColors = [
            'bg-[#0B6B4F]/10 text-[#0B6B4F]',
            'bg-amber-50 text-amber-600 border border-amber-200',
            'bg-blue-50 text-blue-700 border border-blue-200',
          ];

          return (
            <div
              key={idx}
              onClick={() => setActiveTab(targetTab)}
              className="p-6 rounded-2xl bg-white border border-gray-200/90 shadow-xs hover:border-[#0B6B4F] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform ${iconColors[idx]}`}>
                  <CardIcon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">
                  {cap.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {cap.desc}
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-bold text-[#0B6B4F]">
                <span>{cap.link}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </section>

      {/* Target Users Banner */}
      <section className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg">
        <div className="max-w-3xl">
          <span className="text-xs font-bold text-[#E9A23B] uppercase tracking-wider block mb-2">
            {content.targetBadge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-4">
            {content.targetTitle}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-emerald-100">
            {content.stakeholders.map((person, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E9A23B]" />
                <span>{person}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
