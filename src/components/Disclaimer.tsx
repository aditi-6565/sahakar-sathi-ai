import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Disclaimer: React.FC<{ customText?: string }> = ({ customText }) => {
  const { t } = useApp();
  const text = customText || t('statutoryDisclaimer');

  return (
    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/90 border border-amber-200/80 text-amber-900 text-xs leading-relaxed my-2">
      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
      <div>
        <span className="font-semibold text-amber-800 mr-1">Statutory Notice:</span>
        {text}
      </div>
    </div>
  );
};
