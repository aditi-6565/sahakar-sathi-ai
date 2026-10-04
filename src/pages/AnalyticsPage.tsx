import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Globe2,
  Mic,
  MessageSquare,
  AlertOctagon,
  CheckCircle,
  Users,
  Clock,
} from 'lucide-react';
import { fetchAnalytics } from '../services/apiService';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics().then(setData).catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="p-12 text-center text-sm text-gray-500">
        अॅनालिटिक्स डेटा लोड होत आहे...
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-bold">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
              प्रणाली वापर व प्रभाव आकडेवारी (Platform Analytics)
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
              सारथी (Saarthi AI) राष्ट्रीय वापर व कार्यप्रदर्शन विश्लेषण
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 max-w-3xl leading-relaxed">
          शेतकरी व सहकार सभासदांकडून विचारण्यात येणारे बहुभाषिक प्रश्न, व्हॉइस क्वेरीज आणि तक्रार निवारण वेळेचे प्रत्यक्ष विश्लेषण.
        </p>
      </div>

      {/* Top 4 Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold text-gray-500">एकूण प्रश्न (Total Queries)</span>
            <MessageSquare className="w-4 h-4 text-[#0B6B4F]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0B6B4F]">
            {data.totalQueries.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
            +२४% या महिन्यात
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold text-gray-500">आवाज प्रश्न (Voice Queries)</span>
            <Mic className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">
            {data.voiceQueries.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded">
            ६२.६% प्रश्न व्हॉइसने विचारले
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold text-gray-500">दाखल तक्रारी (Grievances)</span>
            <AlertOctagon className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-red-600">
            {data.grievancesFiled.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-red-800 font-bold bg-red-50 px-2 py-0.5 rounded">
            ८८% योग्य अधिकाऱ्याकडे वर्ग
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold text-gray-500">नागरिक समाधान (Satisfaction)</span>
            <CheckCircle className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-teal-600">
            {data.satisfactionRate}
          </div>
          <span className="text-[10px] text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded">
            सरासरी निराकरण: {data.averageResolutionTimeDays} दिवस
          </span>
        </div>
      </div>

      {/* 2 Detailed Breakdown Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Language Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm sm:text-base text-gray-900 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-[#0B6B4F]" />
              भाषांनुसार प्रश्नांचे प्रमाण (Queries by Language)
            </h3>
            <span className="text-xs text-gray-400">८ प्रादेशिक भाषा</span>
          </div>

          <div className="space-y-3 pt-2">
            {data.languages.map((l: any, i: number) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-gray-700">
                  <span>{l.name}</span>
                  <span className="font-bold text-gray-900">
                    {l.percentage}% ({l.count.toLocaleString('en-IN')})
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-[#0B6B4F] h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${l.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm sm:text-base text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#E9A23B]" />
              विषयानुसार वर्गीकरण (Queries by Category)
            </h3>
            <span className="text-xs text-gray-400">५ प्रमुख विषय</span>
          </div>

          <div className="space-y-3.5 pt-2">
            {data.categories.map((c: any, i: number) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-gray-700">
                  <span className="truncate max-w-[240px]">{c.name}</span>
                  <span className="font-bold text-gray-900">
                    {c.percentage}% ({c.count.toLocaleString('en-IN')})
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-[#E9A23B] h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${c.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
