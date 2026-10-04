import React, { useState } from 'react';
import { Calculator, AlertCircle, TrendingDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getPageContent } from '../utils/pageContent';

export const LoanCalculator: React.FC = () => {
  const { language } = useApp();
  const page = getPageContent(language).loanCalculator;

  const [amount, setAmount] = useState<number>(100000);
  const [rate, setRate] = useState<number>(7); // Default 7% KCC rate
  const [tenureMonths, setTenureMonths] = useState<number>(24);

  // EMI formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
  const monthlyRate = rate / (12 * 100);
  const emi =
    monthlyRate > 0
      ? (amount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
        (Math.pow(1 + monthlyRate, tenureMonths) - 1)
      : amount / tenureMonths;

  const totalRepayment = emi * tenureMonths;
  const totalInterest = totalRepayment - amount;

  // Prompt repayment discount simulation (e.g. 3% subvention for KCC)
  const subsidizedRate = Math.max(1, rate - 3);
  const subMonthlyRate = subsidizedRate / (12 * 100);
  const subsidizedEmi =
    subMonthlyRate > 0
      ? (amount * subMonthlyRate * Math.pow(1 + subMonthlyRate, tenureMonths)) /
        (Math.pow(1 + subMonthlyRate, tenureMonths) - 1)
      : amount / tenureMonths;
  const subsidizedRepayment = subsidizedEmi * tenureMonths;
  const savings = Math.max(0, Math.round(totalRepayment - subsidizedRepayment));

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-gray-150 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B6B4F]/10 text-[#0B6B4F] flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              {page.title}
            </h3>
            <p className="text-xs text-gray-500">
              {page.subtitle}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-1 rounded-md">
          {page.badge}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Inputs */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1.5">
              <span>{page.amountLabel}</span>
              <span className="font-bold text-[#0B6B4F] text-sm">₹{amount.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="500000"
              step="5000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full accent-[#0B6B4F] h-2 bg-gray-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-gray-400 mt-1">
              <span>₹10,000</span>
              <span>₹3,00,000 (KCC)</span>
              <span>₹5,00,000</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1.5">
              <span>{page.rateLabel}</span>
              <span className="font-bold text-[#0B6B4F] text-sm">{rate}%</span>
            </div>
            <input
              type="range"
              min="3"
              max="16"
              step="0.5"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full accent-[#0B6B4F] h-2 bg-gray-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-gray-400 mt-1">
              <span>4% (KCC)</span>
              <span>7% (Standard)</span>
              <span>12%</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1.5">
              <span>{page.tenureLabel}</span>
              <span className="font-bold text-[#0B6B4F] text-sm">
                {tenureMonths} Months ({Math.round((tenureMonths / 12) * 10) / 10} Years)
              </span>
            </div>
            <input
              type="range"
              min="6"
              max="60"
              step="6"
              value={tenureMonths}
              onChange={(e) => setTenureMonths(Number(e.target.value))}
              className="w-full accent-[#0B6B4F] h-2 bg-gray-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-gray-400 mt-1">
              <span>6 Months</span>
              <span>24 Months</span>
              <span>60 Months</span>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="pt-2">
            <span className="text-[11px] font-semibold text-gray-500 block mb-1.5">
              Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => { setAmount(50000); setRate(7); setTenureMonths(12); }}
                className="text-xs px-2.5 py-1 rounded-lg border border-gray-200 hover:border-[#0B6B4F] text-gray-700 hover:text-[#0B6B4F] cursor-pointer"
              >
                ₹50,000 (1 Year)
              </button>
              <button
                type="button"
                onClick={() => { setAmount(100000); setRate(7); setTenureMonths(24); }}
                className="text-xs px-2.5 py-1 rounded-lg border border-gray-200 hover:border-[#0B6B4F] text-gray-700 hover:text-[#0B6B4F] cursor-pointer"
              >
                ₹1,00,000 (2 Years)
              </button>
              <button
                type="button"
                onClick={() => { setAmount(300000); setRate(4); setTenureMonths(12); }}
                className="text-xs px-2.5 py-1 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 font-medium cursor-pointer"
              >
                ₹3,00,000 (4% KCC)
              </button>
            </div>
          </div>
        </div>

        {/* Right Output Results */}
        <div className="bg-[#0B6B4F]/5 border border-[#0B6B4F]/15 rounded-xl p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-gray-500 block mb-0.5">
                {page.monthlyEmi}
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0B6B4F]">
                ₹{Math.round(emi).toLocaleString('en-IN')}
                <span className="text-xs font-normal text-gray-500 ml-1">/ month</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200/60">
              <div>
                <span className="text-xs text-gray-500 block">{page.totalInterest}</span>
                <span className="text-base font-bold text-gray-900">
                  ₹{Math.round(totalInterest).toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block">{page.totalRepayment}</span>
                <span className="text-base font-bold text-gray-900">
                  ₹{Math.round(totalRepayment).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Interest Subvention Tip Card */}
            <div className="p-3 bg-emerald-100/60 border border-emerald-200 rounded-lg text-xs text-emerald-950">
              <div className="font-bold flex items-center gap-1.5 text-emerald-900 mb-1">
                <TrendingDown className="w-4 h-4 text-[#0B6B4F]" />
                {page.kccDiscountTitle}:
              </div>
              <p>
                {typeof page.kccDiscountDesc === 'function' ? page.kccDiscountDesc(savings) : page.kccDiscountTitle}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center gap-2 text-[11px] text-gray-500">
            <AlertCircle className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span>{page.disclaimer}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
