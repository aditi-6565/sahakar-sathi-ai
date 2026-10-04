import React from 'react';
import {
  Coins,
  ShieldAlert,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { LoanCalculator } from '../components/LoanCalculator';
import { Disclaimer } from '../components/Disclaimer';
import { useApp } from '../context/AppContext';
import { getPageContent } from '../utils/pageContent';

export const FinancialLiteracyPage: React.FC = () => {
  const { language } = useApp();
  const page = getPageContent(language).financial;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0B6B4F] flex items-center justify-center font-bold">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B6B4F]">
              {page.badge}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
              {page.title}
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 max-w-3xl leading-relaxed">
          {page.desc}
        </p>

        <Disclaimer />
      </div>

      {/* Interactive Loan Calculator Section */}
      <LoanCalculator />

      {/* Golden Rules for Digital Payment & UPI Safety */}
      <div className="bg-red-50/90 border-2 border-red-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
              {page.goldenRulesBadge}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-red-950">
              {page.goldenRulesTitle}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {page.goldenRules.map((rule: { title: string; desc: string }, idx: number) => (
            <div key={idx} className="bg-white p-4 rounded-xl border border-red-200 shadow-xs">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-sm mb-2">
                {idx + 1}
              </div>
              <h4 className="font-bold text-sm text-red-900 mb-1">
                {rule.title}
              </h4>
              <p className="text-xs text-gray-700 leading-relaxed">
                {rule.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Credit & Kisan Credit Card Modules */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0B6B4F] flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              {page.kccTitle}
            </h3>
            <p className="text-xs text-gray-500">
              {page.kccDesc}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
          {page.kccPoints.map((point: string, idx: number) => (
            <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-150 flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-[#0B6B4F] shrink-0 mt-0.5" />
              <span className="text-xs text-gray-800 leading-relaxed">{point}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
