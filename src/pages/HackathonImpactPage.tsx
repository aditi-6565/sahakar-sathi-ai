import React from 'react';
import {
  Award,
  CheckCircle,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getPageContent } from '../utils/pageContent';

export const HackathonImpactPage: React.FC = () => {
  const { language, setActiveTab } = useApp();
  const page = getPageContent(language).impact;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0B6B4F] border border-emerald-200 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B6B4F]">
                {page.badge}
              </span>
              <span className="text-[10px] font-bold bg-[#0B6B4F] text-white px-2 py-0.5 rounded-full">
                Ministry of Cooperation & NCCT
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1">
              {page.title}
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 max-w-3xl leading-relaxed">
          {page.desc}
        </p>
      </div>

      {/* 10 Solution Impacts Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-[#0B6B4F]" />
          <span>{page.impactTitle}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {page.impacts.map((item: { num: string; title: string; desc: string }, idx: number) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:border-[#0B6B4F] transition-all flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0B6B4F] font-extrabold text-base flex items-center justify-center shrink-0">
                {item.num}
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-gray-900">{item.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture & Future Roadmap */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#0B6B4F]" />
          <span>{page.archTitle}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {page.layers.map((layer: { title: string; desc: string; color: string }, idx: number) => (
            <div key={idx} className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${layer.color || 'bg-emerald-100 text-[#0B6B4F]'}`}>
                Layer {idx + 1}
              </span>
              <h4 className="font-bold text-sm text-gray-900 mt-2">{layer.title}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {layer.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-150 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-gray-500 font-medium">
            {page.archDesc}
          </span>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="px-5 py-2.5 rounded-xl bg-[#0B6B4F] hover:bg-[#095740] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <span>Back to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
