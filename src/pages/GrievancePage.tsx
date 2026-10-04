import React, { useState } from 'react';
import {
  AlertOctagon,
  Search,
  Clock,
  MapPin,
} from 'lucide-react';
import { GrievanceForm } from '../components/GrievanceForm';
import { Disclaimer } from '../components/Disclaimer';
import { useApp } from '../context/AppContext';
import { getPageContent } from '../utils/pageContent';

export const GrievancePage: React.FC = () => {
  const { language } = useApp();
  const page = getPageContent(language).grievance;

  const [searchId, setSearchId] = useState<string>('SAH-2026-001245');
  const [searchResult, setSearchResult] = useState<any>({
    id: 'SAH-2026-001245',
    category: 'Cooperative Society',
    description: 'Society annual audit report not presented to members in the past six months.',
    submittedAt: '28 Feb 2026 11:30 AM',
    status: 'Submitted',
    authority: 'Assistant Registrar of Cooperative Societies (ARCS)',
    timeline: 'Expected Inquiry Report: Within 15 working days',
  });

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    if (searchId.includes('1246')) {
      setSearchResult({
        id: searchId,
        category: 'Crop Insurance (PMFBY)',
        description: 'Post-harvest unseasonal rain damaged onion produce. Local claim surveyed but receipt confirmation delayed.',
        submittedAt: '01 Mar 2026 02:15 PM',
        status: 'Under Review',
        authority: 'District Level Monitoring Committee (DLMC)',
        timeline: 'Joint Survey Verification in Progress',
      });
    } else {
      setSearchResult({
        id: searchId,
        category: 'Cooperative Society',
        description: 'Society annual audit report not presented to members in the past six months.',
        submittedAt: '28 Feb 2026 11:30 AM',
        status: 'Submitted',
        authority: 'Assistant Registrar of Cooperative Societies (ARCS)',
        timeline: 'Expected Inquiry Report: Within 15 working days',
      });
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-700 border border-red-200 flex items-center justify-center font-bold">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-700">
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

      {/* Guided 5-Step Grievance Form */}
      <GrievanceForm />

      {/* Track Existing Grievance Status Checker */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-150">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              <Search className="w-5 h-5 text-[#0B6B4F]" />
              {page.trackTitle}
            </h3>
            <p className="text-xs text-gray-500">
              {page.trackSubtitle}
            </p>
          </div>
          <span className="text-[11px] font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded">
            Live Tracker
          </span>
        </div>

        <form onSubmit={handleTrack} className="flex gap-2 max-w-lg">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder={page.trackPlaceholder}
            className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B6B4F]"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#0B6B4F] hover:bg-[#095740] text-white font-bold text-xs sm:text-sm cursor-pointer shadow-xs"
          >
            {page.trackBtn}
          </button>
        </form>

        {/* Track Result Display */}
        {searchResult && (
          <div className="mt-4 p-5 rounded-xl bg-gray-50 border border-gray-200 space-y-3 text-xs sm:text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-mono font-bold text-base text-[#0B6B4F]">
                {searchResult.id}
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                {searchResult.status}
              </span>
            </div>

            <div className="text-gray-700">
              <span className="font-semibold text-gray-900">Description: </span>
              {searchResult.description}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-200">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#0B6B4F] shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-500 block text-[11px]">Authority:</span>
                  <span className="font-bold text-gray-900">{searchResult.authority}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-500 block text-[11px]">Timeline:</span>
                  <span className="font-bold text-gray-900">{searchResult.timeline}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Escalation Hierarchy Guide */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-gray-900">
          Escalation Ladder
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-150">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#0B6B4F] font-bold flex items-center justify-center mb-2">
              1
            </span>
            <h4 className="font-bold text-gray-900 mb-1">Local Level (PACS / Society)</h4>
            <p className="text-gray-600">
              Submit a formal written letter to the Society Secretary or Chairman and request an official acknowledgment receipt.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-150">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center mb-2">
              2
            </span>
            <h4 className="font-bold text-gray-900 mb-1">Block / District Level (ARCS / DDR)</h4>
            <p className="text-gray-600">
              If unresolved after 30 days, file an official grievance with the Assistant Registrar (ARCS) or District Deputy Registrar.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-150">
            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center mb-2">
              3
            </span>
            <h4 className="font-bold text-gray-900 mb-1">Judicial Level (Cooperative Court)</h4>
            <p className="text-gray-600">
              For financial irregularities or election disputes, file a dispute before the Cooperative Court or Commissionerate of Cooperation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
