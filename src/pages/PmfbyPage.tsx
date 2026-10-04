import React from 'react';
import {
  ShieldCheck,
  Clock,
  FileCheck2,
  PhoneCall,
  CheckCircle2,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Disclaimer } from '../components/Disclaimer';
import { getPageContent } from '../utils/pageContent';

export const PmfbyPage: React.FC = () => {
  const { setActiveTab, sendMessage, language } = useApp();
  const pmfbyData = getPageContent(language).pmfby;

  const handleAskPmfby = (query: string) => {
    setActiveTab('chat');
    sendMessage(query);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
              {pmfbyData.badge}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
              {pmfbyData.title}
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 max-w-3xl leading-relaxed">
          {pmfbyData.desc}
        </p>

        <Disclaimer />
      </div>

      {/* Critical 72-Hour Alert Banner */}
      <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-100 px-2 py-0.5 rounded">
              {pmfbyData.alertBadge}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-red-950 mt-1">
              {pmfbyData.alertTitle}
            </h3>
            <p className="text-xs sm:text-sm text-red-900 mt-1">
              {pmfbyData.alertDesc}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full sm:w-auto">
          <a
            href="tel:14447"
            className="px-4 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Toll-Free 14447</span>
          </a>
          <button
            onClick={() => handleAskPmfby(pmfbyData.alertBtn)}
            className="px-4 py-2.5 rounded-xl bg-white border border-red-300 text-red-800 font-bold text-xs hover:bg-red-100/50 cursor-pointer"
          >
            {pmfbyData.alertBtn}
          </button>
        </div>
      </div>

      {/* 4-Step Claim Process */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-xs">
        <div className="mb-6">
          <h3 className="text-base sm:text-lg font-bold text-gray-900">
            {pmfbyData.stepsTitle}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pmfbyData.steps.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-gray-150 bg-gray-50/60 hover:bg-white hover:border-[#0B6B4F] transition-all"
            >
              <div className="w-9 h-9 rounded-lg bg-[#0B6B4F]/10 text-[#0B6B4F] flex items-center justify-center font-bold mb-3">
                {idx + 1}
              </div>
              <h4 className="font-bold text-sm text-gray-900">{item.step}</h4>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Documents & FAQ Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Document Checklist */}
        <div className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-xs">
          <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-[#0B6B4F]" />
            {pmfbyData.docsTitle}
          </h3>
          <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700">
            {pmfbyData.docs.map((doc, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0B6B4F] shrink-0 mt-0.5" />
                <span>{doc}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-xs space-y-3">
          <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-600" />
            {pmfbyData.faqTitle}
          </h3>
          <div className="space-y-2.5 text-xs sm:text-sm">
            {pmfbyData.faqs.map((faq, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-150">
                <span className="font-bold text-gray-900 block mb-1">{faq.q}</span>
                <span className="text-gray-600">{faq.a}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
