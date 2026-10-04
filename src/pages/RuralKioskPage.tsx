import React from 'react';
import {
  Monitor,
  Mic,
  Volume2,
  QrCode,
  Printer,
  Sun,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getPageContent } from '../utils/pageContent';

export const RuralKioskPage: React.FC = () => {
  const { language } = useApp();
  const page = getPageContent(language).kiosk;

  const getHardwareIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Monitor className="w-5 h-5" />;
      case 1:
        return <Mic className="w-5 h-5" />;
      case 2:
        return <Volume2 className="w-5 h-5" />;
      case 3:
        return <QrCode className="w-5 h-5" />;
      case 4:
        return <Printer className="w-5 h-5" />;
      case 5:
        return <Sun className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  const getIconColor = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-indigo-500/20 text-indigo-400';
      case 1:
        return 'bg-amber-500/20 text-amber-400';
      case 2:
        return 'bg-emerald-500/20 text-emerald-400';
      case 3:
        return 'bg-purple-500/20 text-purple-400';
      case 4:
        return 'bg-teal-500/20 text-teal-400';
      case 5:
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-indigo-500/20 text-indigo-400';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold">
            <Monitor className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                {page.badge}
              </span>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">
                Deployment Blueprint
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

        <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
          {page.note}
        </div>
      </div>

      {/* Visual Kiosk Hardware Blueprint Mockup */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0B6B4F]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#E9A23B] uppercase tracking-wider">
              Rural Edge Hardware Node
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {page.terminalTitle}
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto">
              {page.terminalDesc}
            </p>
          </div>

          {/* Diagram of Hardware Components */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-4">
            {page.specs.map((item: { title: string; desc: string }, idx: number) => (
              <div key={idx} className="bg-gray-800/80 border border-gray-700 rounded-2xl p-5 space-y-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${getIconColor(idx)}`}>
                  {getHardwareIcon(idx)}
                </div>
                <h3 className="font-bold text-base text-white">{item.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
