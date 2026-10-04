import React from 'react';
import {
  Users2,
  ShieldCheck,
  Landmark,
  Building2,
  Coins,
  AlertOctagon,
  Scale,
  Mic,
  ArrowRight,
  Sparkles,
  HelpCircle,
  FileCheck2,
  Compass,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUGGESTED_QUESTIONS } from '../utils/translations';
import { getPageContent } from '../utils/pageContent';

export const DashboardPage: React.FC = () => {
  const { t, setActiveTab, sendMessage, language, userProfile } = useApp();
  const page = getPageContent(language).dashboard;

  const serviceCards = page.serviceCards;
  const suggestedList = SUGGESTED_QUESTIONS[language] || SUGGESTED_QUESTIONS.en;

  const handleQuickAsk = (q: string) => {
    setActiveTab('chat');
    sendMessage(q);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <section className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#0B6B4F] text-xs font-bold border border-emerald-200 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#0B6B4F]" />
              <span>{userProfile.district}, {userProfile.state}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {t('welcomeGreeting')}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xl">
              {page.farmerGreeting(userProfile.name)}
            </p>
          </div>

          {/* Quick Voice Trigger Banner Button */}
          <button
            onClick={() => setActiveTab('voice')}
            className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-[#E9A23B] hover:bg-[#d8912e] text-white font-bold text-sm shadow-md transition-transform active:scale-95 cursor-pointer shrink-0 min-h-[48px]"
          >
            <Mic className="w-5 h-5" />
            <span>{t('tapToSpeak')}</span>
          </button>
        </div>

        {/* Quick Context Chips */}
        <div className="mt-6 pt-5 border-t border-gray-150">
          <span className="text-xs font-bold text-gray-500 block mb-2">
            {page.suggestedTitle}
          </span>
          <div className="flex flex-wrap gap-2">
            {suggestedList.slice(0, 4).map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickAsk(q)}
                className="text-xs font-medium bg-gray-50 hover:bg-[#0B6B4F]/10 border border-gray-200 hover:border-[#0B6B4F] text-gray-700 hover:text-[#0B6B4F] px-3 py-2 rounded-xl transition-all cursor-pointer text-left"
              >
                "{q}"
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main 8 Service Cards Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">
            {page.pillarsTitle}
          </h2>
          <span className="text-xs text-gray-500">{page.pillarsCount}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {serviceCards.map((card, idx) => (
            <div
              key={idx}
              onClick={() => setActiveTab(card.id)}
              className={`p-5 rounded-2xl bg-white border-2 border-gray-150 ${card.color} shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group min-h-[160px]`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                    {card.badge}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-[#0B6B4F] group-hover:bg-[#0B6B4F]/10 transition-colors">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
                <h3 className="font-bold text-sm sm:text-base text-gray-900 leading-snug">
                  {card.title}
                </h3>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  {card.desc}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-gray-100 text-[11px] font-bold text-[#0B6B4F] flex items-center gap-1">
                <span>{language === 'en' ? 'View Details' : language === 'hi' ? 'विवरण देखें' : 'सविस्तर पहा'}</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Emergency Advisory Notice */}
      <section className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block mb-1">
            {language === 'en' ? 'Emergency Farmer Helpline' : language === 'hi' ? 'आपातकालीन किसान सहायता' : 'तात्काळ शेतकरी मदत (Emergency Assistance)'}
          </span>
          <p className="text-xs sm:text-sm text-amber-950 font-medium">
            {language === 'en'
              ? 'Report crop loss within 72 hours via national toll-free helpline 14447 or call Kisan Call Center 1551.'
              : language === 'hi'
              ? 'फसल नुकसान होने पर ७२ घंटे के भीतर राष्ट्रीय टोल-फ्री नंबर 14447 पर दर्ज करें या किसान कॉल सेंटर 1551 डायल करें।'
              : 'पीक नुकसान झाले असल्यास ७२ तासांच्या आत राष्ट्रीय टोल-फ्री क्रमांक 14447 वर नोंद करा किंवा किसान कॉल सेंटर 1551 डायल करा.'}
          </p>
        </div>
        <button
          onClick={() => setActiveTab('contacts')}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs"
        >
          {language === 'en' ? 'View All Helplines' : language === 'hi' ? 'सभी हेल्पलाइन नंबर देखें' : 'सर्व संपर्क क्रमांक पहा'}
        </button>
      </section>
    </div>
  );
};
