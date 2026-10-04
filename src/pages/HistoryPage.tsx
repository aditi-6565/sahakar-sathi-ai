import React, { useState } from 'react';
import {
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getPageContent } from '../utils/pageContent';

export const HistoryPage: React.FC = () => {
  const { messages, userProfile, setActiveTab, sendMessage, language, t } = useApp();
  const page = getPageContent(language).history;
  const [tabFilter, setTabFilter] = useState<'all' | 'queries' | 'grievances'>('all');

  const userQueries = messages.filter((m) => m.sender === 'user');

  const demoGrievances = [
    {
      id: 'SAH-2026-001245',
      category: 'Cooperative Society',
      description: 'Annual audit report not submitted in Primary Agriculture Credit Society for 6 months.',
      date: '28 Feb 2026',
      status: 'Submitted',
      authority: 'ARCS Office',
    },
    {
      id: 'SAH-2026-001246',
      category: 'Crop Insurance (PMFBY)',
      description: 'Post-harvest unseasonal rain damaged onion produce. Local claim surveyed but receipt confirmation delayed.',
      date: '01 Mar 2026',
      status: 'Under Review',
      authority: 'DLMC Monitoring Committee',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* User Profile Card */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#0B6B4F] text-white flex items-center justify-center font-bold text-2xl shadow-sm">
            RP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-gray-900">{userProfile.name}</h2>
              <span className="text-[10px] font-bold bg-emerald-50 text-[#0B6B4F] px-2 py-0.5 rounded-full border border-emerald-200">
                {page.activeMemberBadge}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{userProfile.role}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mt-2">
              <span>{page.villageLabel}: <strong>{userProfile.village}</strong></span>
              <span>{page.districtLabel}: <strong>{userProfile.district}, {userProfile.state}</strong></span>
              <span>{page.pacsLabel}: <strong>{userProfile.pacsMembershipId}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('grievance')}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs cursor-pointer shadow-xs"
          >
            {t('fileGrievance')}
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className="px-4 py-2.5 rounded-xl bg-[#0B6B4F] hover:bg-[#095740] text-white font-bold text-xs cursor-pointer shadow-xs"
          >
            {t('askSahakarSathi')}
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
        <button
          onClick={() => setTabFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            tabFilter === 'all'
              ? 'bg-[#0B6B4F] text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {page.allTab} ({userQueries.length + demoGrievances.length})
        </button>
        <button
          onClick={() => setTabFilter('queries')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            tabFilter === 'queries'
              ? 'bg-[#0B6B4F] text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {page.queriesTab} ({userQueries.length})
        </button>
        <button
          onClick={() => setTabFilter('grievances')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            tabFilter === 'grievances'
              ? 'bg-[#0B6B4F] text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {page.grievancesTab} ({demoGrievances.length})
        </button>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {/* Grievances */}
        {(tabFilter === 'all' || tabFilter === 'grievances') &&
          demoGrievances.map((g) => (
            <div
              key={g.id}
              className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:border-red-400 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-[#0B6B4F] bg-gray-100 px-2 py-0.5 rounded">
                    {g.id}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                    Status: {g.status}
                  </span>
                  <span className="text-xs text-gray-400">• {g.date}</span>
                </div>
                <h4 className="font-bold text-sm text-gray-900">{g.category}</h4>
                <p className="text-xs text-gray-600 line-clamp-2">{g.description}</p>
                <div className="text-[11px] text-[#0B6B4F] font-medium">
                  Authority: {g.authority}
                </div>
              </div>

              <button
                onClick={() => setActiveTab('grievance')}
                className="text-xs font-bold text-[#0B6B4F] flex items-center gap-1 hover:underline cursor-pointer shrink-0"
              >
                <span>Track</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

        {/* User Chat Queries */}
        {(tabFilter === 'all' || tabFilter === 'queries') &&
          userQueries.map((q, idx) => (
            <div
              key={q.id || idx}
              className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs hover:border-[#0B6B4F] transition-all flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#0B6B4F] flex items-center justify-center font-bold shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-gray-900">"{q.text}"</h4>
                  <span className="text-[10px] text-gray-400">
                    {q.timestamp} • {q.language?.toUpperCase()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveTab('chat');
                  if (q.text) sendMessage(q.text);
                }}
                className="text-xs font-bold text-[#0B6B4F] hover:underline cursor-pointer shrink-0"
              >
                Ask Again
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};
