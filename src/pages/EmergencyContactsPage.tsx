import React from 'react';
import {
  PhoneCall,
  MapPin,
  Clock,
} from 'lucide-react';
import { Disclaimer } from '../components/Disclaimer';
import { useApp } from '../context/AppContext';
import { getPageContent } from '../utils/pageContent';

export const EmergencyContactsPage: React.FC = () => {
  const { language } = useApp();
  const page = getPageContent(language).contacts;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0B6B4F] flex items-center justify-center font-bold">
            <PhoneCall className="w-6 h-6" />
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

      {/* Grid of Verified Contacts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {page.contactsList.map((contact: { title: string; number: string; desc: string; timing: string; category: string; color: string }, idx: number) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:border-[#0B6B4F] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  {contact.category}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {contact.timing}
                </span>
              </div>

              <h3 className="font-bold text-base text-gray-900 mb-1">
                {contact.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                {contact.desc}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-gray-400 block">Toll-Free:</span>
                <span className="font-mono font-extrabold text-xl text-[#0B6B4F]">
                  {contact.number}
                </span>
              </div>

              <a
                href={`tel:${contact.number.replace(/-/g, '')}`}
                className="px-5 py-2.5 rounded-xl bg-[#0B6B4F] hover:bg-[#095740] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Now</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Physical Visit Guidance */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-xs">
        <h4 className="font-bold text-sm text-amber-950 flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-amber-700" />
          Physical Office Visit Guidance
        </h4>
        <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
          For formal applications, appeals, and in-person verification, farmers and cooperative members can visit the Assistant Registrar of Cooperative Societies (ARCS) office or District Deputy Registrar (DDR) office. Please carry 2 copies of your 7/12 RoR, Aadhaar card, and loan/application receipts.
        </p>
      </div>
    </div>
  );
};
