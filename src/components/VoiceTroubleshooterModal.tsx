import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  X,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_LANGUAGES, SUGGESTED_QUESTIONS } from '../utils/translations';
import { getPageContent } from '../utils/pageContent';

interface VoiceTroubleshooterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuery?: (query: string) => void;
}

export const VoiceTroubleshooterModal: React.FC<VoiceTroubleshooterModalProps> = ({
  isOpen,
  onClose,
  onSelectQuery,
}) => {
  const {
    language,
    t,
    requestMicPermission,
    testSpeakerAudio,
    isSpeaking,
    hasSpeechSupport,
    voiceError,
    clearVoiceError,
  } = useApp();

  const [testingMic, setTestingMic] = useState<boolean>(false);
  const [micStatus, setMicStatus] = useState<'idle' | 'success' | 'denied'>('idle');

  if (!isOpen) return null;

  const page = getPageContent(language).voiceAssistant;
  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];
  const suggestedList = SUGGESTED_QUESTIONS[language] || SUGGESTED_QUESTIONS.en;

  const handleTestMic = async () => {
    setTestingMic(true);
    setMicStatus('idle');
    try {
      const allowed = await requestMicPermission();
      if (allowed) {
        setMicStatus('success');
      } else {
        setMicStatus('denied');
      }
    } catch {
      setMicStatus('denied');
    } finally {
      setTestingMic(false);
    }
  };

  const handleQueryClick = (q: string) => {
    onClose();
    if (onSelectQuery) {
      onSelectQuery(q);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 relative my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0B6B4F]/10 text-[#0B6B4F] flex items-center justify-center shrink-0">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#0B6B4F] uppercase tracking-wider block">
              {currentLang.nativeLabel} ({currentLang.label}) • Voice Diagnostics
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-0.5">
              {page.troubleshootBtn}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {page.troubleshootTitle}
            </p>
          </div>
        </div>

        {/* Voice Error banner if active */}
        {voiceError && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block text-amber-900">{page.micErrorTitle}</span>
              <p className="mt-0.5 leading-relaxed">{voiceError}</p>
            </div>
            <button
              onClick={clearVoiceError}
              className="text-amber-800 hover:text-amber-950 font-bold px-2 py-0.5 cursor-pointer text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* Interactive Quick Diagnostic Tools */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Test 1: Microphone Test */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <Mic className="w-4 h-4 text-[#0B6B4F]" />
                  <span>1. Microphone Test</span>
                </span>
                {micStatus === 'success' && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Working
                  </span>
                )}
                {micStatus === 'denied' && (
                  <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Blocked
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-600">
                Check whether your browser has granted microphone access permissions.
              </p>
            </div>

            <button
              onClick={handleTestMic}
              disabled={testingMic}
              className="w-full py-2.5 px-3 rounded-xl bg-[#0B6B4F] hover:bg-[#095740] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{testingMic ? 'Testing microphone...' : 'Test Microphone Access'}</span>
            </button>
          </div>

          {/* Test 2: Speaker Audio Test */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-amber-600" />
                  <span>2. Speaker & Audio Test</span>
                </span>
                {isSpeaking && (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full animate-pulse">
                    Playing...
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-600">
                Play an instant voice greeting in <strong>{currentLang.nativeLabel}</strong> to ensure your sound is unmuted.
              </p>
            </div>

            <button
              onClick={testSpeakerAudio}
              className="w-full py-2.5 px-3 rounded-xl bg-[#E9A23B] hover:bg-[#d8912e] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{page.speakerTestBtn} ({currentLang.nativeLabel})</span>
            </button>
          </div>
        </div>

        {/* Step-by-Step 3 Point Guide */}
        <div className="space-y-3 border-t border-gray-150 pt-4">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Quick Resolution Steps:
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-gray-200 bg-white space-y-1">
              <span className="font-bold text-[#0B6B4F] block">
                {page.step1Title}
              </span>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                {page.step1Desc}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-gray-200 bg-white space-y-1">
              <span className="font-bold text-blue-700 block">
                {page.step2Title}
              </span>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                {page.step2Desc}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-gray-200 bg-white space-y-1">
              <span className="font-bold text-amber-700 block">
                {page.step3Title}
              </span>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                {page.step3Desc}
              </p>
            </div>
          </div>
        </div>

        {/* 1-Tap Voice Simulation: Works even if mic is blocked! */}
        <div className="border-t border-gray-150 pt-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E9A23B]" />
              <span>1-Tap Voice Questions ({currentLang.nativeLabel}):</span>
            </span>
            <span className="text-[10px] text-gray-500">Works without microphone</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {suggestedList.slice(0, 4).map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleQueryClick(q)}
                className="text-left p-2.5 rounded-xl border border-gray-200 hover:border-[#0B6B4F] hover:bg-emerald-50/40 text-xs text-gray-800 font-medium transition-all flex items-center justify-between group cursor-pointer"
              >
                <span className="truncate pr-2 font-medium">"{q}"</span>
                <span className="text-[10px] font-bold text-[#0B6B4F] shrink-0 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Ask & Listen <ArrowRight className="w-3 h-3" />
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold cursor-pointer transition-colors"
          >
            {page.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
