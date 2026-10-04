import React, { useState, useEffect } from 'react';
import {
  Database,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  FileText,
  ShieldCheck,
  Globe,
  Plus,
} from 'lucide-react';
import { fetchKnowledge } from '../services/apiService';
import { KnowledgeArticle } from '../types';

export const AdminKnowledgePage: React.FC = () => {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchKnowledge(selectedCat, search);
      setArticles(data.articles);
      setCategories(data.categories);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCat, search]);

  const categoryStats = [
    { name: 'Cooperative Governance', totalArticles: 24, langs: 8, status: 'Verified Base', date: 'Feb 2026' },
    { name: 'Government Schemes', totalArticles: 18, langs: 8, status: 'Grounded Gov Portal', date: 'Feb 2026' },
    { name: 'PMFBY / Crop Insurance', totalArticles: 16, langs: 8, status: 'Operational Guidelines', date: 'Feb 2026' },
    { name: 'PACS Services', totalArticles: 20, langs: 8, status: 'NABARD & MoC Model', date: 'Feb 2026' },
    { name: 'Financial Literacy', totalArticles: 14, langs: 8, status: 'RBI Verified Modules', date: 'Feb 2026' },
    { name: 'Grievance Redressal', totalArticles: 12, langs: 8, status: 'State Act Protocol', date: 'Feb 2026' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                RAG ज्ञान भांडार व्यवस्थापन (Knowledge Base)
              </span>
              <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                RAG-Ready Schema
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1">
              सारथी (Saarthi AI) ज्ञान भांडार व सत्यापन डॅशबोर्ड
            </h1>
          </div>
        </div>

        <button
          onClick={loadData}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 bg-gray-50 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#0B6B4F]' : ''}`} />
          <span>रिफ्रेश करा</span>
        </button>
      </div>

      {/* Category Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoryStats.map((stat, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0B6B4F] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {stat.totalArticles} लेख / विषय
              </span>
              <span className="text-[10px] font-semibold text-gray-500 flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {stat.langs} भाषा
              </span>
            </div>

            <h3 className="font-bold text-sm text-gray-900">{stat.name}</h3>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {stat.status}
              </span>
              <span className="text-gray-400">{stat.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ज्ञान भांडारात शोधा (Search laws, schemes, by-laws)..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0B6B4F]"
          />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm bg-white font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0B6B4F]"
        >
          <option value="All">सर्व वर्गवारी (All Categories)</option>
          {categories.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Articles Table List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-150 bg-gray-50/70 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            सक्रिय ज्ञान दस्तऐवज (Active Grounded Articles): {articles.length}
          </span>
          <span className="text-[11px] text-gray-500">
            फॉर्मेट: JSON Schema (Embeddings Ready)
          </span>
        </div>

        <div className="divide-y divide-gray-150">
          {articles.map((art) => (
            <div key={art.id} className="p-5 hover:bg-gray-50/70 transition-colors space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#0B6B4F] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {art.id}
                  </span>
                  <span className="text-xs font-bold text-gray-700">{art.category}</span>
                  <span className="text-[10px] text-gray-400">[{art.language.toUpperCase()}]</span>
                </div>

                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-gray-500">स्रोत: {art.source}</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Verified
                  </span>
                </div>
              </div>

              <h4 className="font-bold text-sm text-gray-900">{art.title}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{art.content}</p>

              <div className="text-[10px] text-gray-400 pt-1">
                शेवटचे अद्यतन: {art.lastUpdated} • RAG Retrieval Key: {art.category.toLowerCase().replace(/\s+/g, '_')}
              </div>
            </div>
          ))}

          {articles.length === 0 && !isLoading && (
            <div className="p-8 text-center text-xs text-gray-500">
              कोणतेही लेख सापडले नाहीत. कृपया वेगळा शोध शब्द टाका.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
