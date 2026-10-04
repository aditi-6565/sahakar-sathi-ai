import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { SourceMeta } from '../types';

interface SourceBadgeProps {
  sourceMeta?: SourceMeta;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ sourceMeta }) => {
  if (!sourceMeta) return null;

  return (
    <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 bg-gray-50/70 p-2.5 rounded-lg">
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="inline-flex items-center gap-1 font-semibold text-[#0B6B4F] bg-[#0B6B4F]/10 px-2 py-0.5 rounded-md">
          <ShieldCheck className="w-3.5 h-3.5" />
          {sourceMeta.isVerified ? 'Verified Knowledge Source' : 'Official Reference'}
        </span>
        <span className="text-gray-400">•</span>
        <span className="text-gray-600 font-medium truncate max-w-[280px]">
          {sourceMeta.sources?.join(', ') || 'Ministry of Cooperation Guidelines'}
        </span>
      </div>

      <div className="flex items-center gap-1 text-[11px] text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
        <Info className="w-3 h-3 text-[#E9A23B]" />
        <span>{sourceMeta.mode || 'Official Registry'}</span>
      </div>
    </div>
  );
};
