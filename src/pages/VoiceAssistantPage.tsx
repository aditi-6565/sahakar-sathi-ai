import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Globe2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_LANGUAGES, SUGGESTED_QUESTIONS } from '../utils/translations';
import { AIResponseCard } from '../components/AIResponseCard';
import { getPageContent } from '../utils/pageContent';

export const VoiceAssistantPage: React.FC = () => {
  const {
    language,
    t,
    isListening,
    startVoiceInput,
    stopVoiceInput,
    speechTranscript,
    sendMessage,
    messages,
    isLoadingChat,
    speakText,
    stopSpeech,
    isSpeaking,
    voiceError,
    clearVoiceError,
    requestMicPermission,
    testSpeakerAudio,
    openVoiceTroubleshooter,
  } = useApp();

  const page = getPageContent(language).voiceAssistant;
  const [lastQuery, setLastQuery] = useState<string>('');
  const [manualQuery, setManualQuery] = useState<string>('');
  const [showTroubleshooter, setShowTroubleshooter] = useState<boolean>(false);
  const [permissionChecking, setPermissionChecking] = useState<boolean>(false);

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  const handleVoiceToggle = async () => {
    clearVoiceError();

    if (isListening) {
      stopVoiceInput();
      return;
    }

    startVoiceInput((transcript) => {
      if (transcript && transcript.trim()) {
        const clean = transcript.trim();
        setLastQuery(clean);
        sendMessage(clean);
      }
    });
  };

  const handleRequestPermission = async () => {
    setPermissionChecking(true);
    const granted = await requestMicPermission();
    setPermissionChecking(false);
    if (granted) {
      handleVoiceToggle();
    } else {
      openVoiceTroubleshooter();
    }
  };

  // Get latest AI message
  const lastAiMsg = [...messages].reverse().find((m) => m.sender === 'ai');

  // Trigger speech synthesis automatically when new AI answer arrives after voice query
  useEffect(() => {
    if (lastAiMsg && lastAiMsg.structuredAnswer && lastQuery) {
      const summaryText = `${lastAiMsg.structuredAnswer.summary}. ${
        lastAiMsg.structuredAnswer.steps?.[0] || ''
      }`;
      speakText(summaryText, lastAiMsg.id);
    }
  }, [lastAiMsg?.id]);

  const handleQuickQuestion = (q: string) => {
    clearVoiceError();
    setLastQuery(q);
    sendMessage(q);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualQuery.trim()) return;
    clearVoiceError();
    const q = manualQuery.trim();
    setLastQuery(q);
    sendMessage(q);
    setManualQuery('');
  };

  const suggestedList = SUGGESTED_QUESTIONS[language] || SUGGESTED_QUESTIONS.en;

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Top Diagnostics & Audio Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap">
          <Globe2 className="w-5 h-5 text-[#0B6B4F]" />
          <span className="text-xs font-bold text-gray-700">Language:</span>
          <span className="text-xs sm:text-sm font-extrabold text-[#0B6B4F] bg-[#0B6B4F]/10 px-2.5 py-1 rounded-lg">
            {currentLang.nativeLabel} ({currentLang.label})
          </span>
          <span className="text-[11px] text-gray-400 font-mono">[{currentLang.speechCode}]</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Test Speaker Button */}
          <button
            onClick={testSpeakerAudio}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#0B6B4F] border border-emerald-200 text-xs font-semibold cursor-pointer transition-colors"
            title={page.speakerTestBtn}
          >
            <Volume2 className="w-3.5 h-3.5 text-[#0B6B4F]" />
            <span>{page.speakerTestBtn}</span>
          </button>

          {isSpeaking && (
            <button
              onClick={stopSpeech}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-bold hover:bg-red-200 cursor-pointer animate-pulse"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>{t('stopAudio')}</span>
            </button>
          )}

          <button
            onClick={() => setShowTroubleshooter((prev) => !prev)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-gray-500" />
            <span className="hidden sm:inline">{page.troubleshootBtn}</span>
            {showTroubleshooter ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Voice Error Notification Banner */}
      {voiceError && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-xs sm:text-sm">{page.micErrorTitle || 'Microphone Alert'}:</div>
              <p className="text-xs text-amber-900 mt-0.5 leading-relaxed">{voiceError}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <button
              onClick={handleRequestPermission}
              disabled={permissionChecking}
              className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl bg-[#0B6B4F] text-white text-xs font-bold hover:bg-[#095740] cursor-pointer shadow-2xs"
            >
              {permissionChecking ? 'Checking...' : (page.retryBtn || 'Retry')}
            </button>
            <button
              onClick={openVoiceTroubleshooter}
              className="px-3 py-1.5 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-xs font-semibold cursor-pointer"
            >
              Guide
            </button>
            <button
              onClick={clearVoiceError}
              className="px-2 py-1 text-gray-400 hover:text-gray-700 text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Expandable Troubleshooter & Step-by-Step Guide */}
      {showTroubleshooter && (
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3 text-xs text-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
              <HelpCircle className="w-4 h-4 text-[#0B6B4F]" />
              <span>{page.troubleshootTitle}</span>
            </div>
            <button
              onClick={openVoiceTroubleshooter}
              className="text-xs text-[#0B6B4F] font-bold hover:underline cursor-pointer"
            >
              Interactive Voice Diagnostics &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
              <span className="font-bold text-[#0B6B4F] block">{page.step1Title}</span>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                {page.step1Desc}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
              <span className="font-bold text-blue-700 block">{page.step2Title}</span>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                {page.step2Desc}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
              <span className="font-bold text-emerald-800 block">{page.step3Title}</span>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                {page.step3Desc}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Voice Interaction Console */}
      <div className="bg-gradient-to-b from-white via-white to-emerald-50/30 rounded-3xl border border-emerald-200/90 p-8 sm:p-12 text-center shadow-sm space-y-6 relative overflow-hidden">
        {isListening && (
          <>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-red-400/20 animate-ping pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-red-300/10 animate-pulse pointer-events-none" />
          </>
        )}

        <div className="space-y-2 relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0B6B4F] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {page.badge}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900">
            {page.title}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
            {page.desc}
          </p>
        </div>

        {/* Central Giant Microphone Button */}
        <div className="py-4 relative z-10 flex flex-col items-center justify-center">
          <button
            onClick={handleVoiceToggle}
            className={`relative rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xl active:scale-95 ${
              isListening
                ? 'w-28 h-28 bg-red-600 text-white ring-8 ring-red-200 animate-pulse'
                : 'w-24 h-24 bg-[#E9A23B] hover:bg-[#d8912e] text-white hover:scale-105 ring-8 ring-amber-100'
            }`}
            aria-label="Tap to speak"
          >
            {isListening ? (
              <MicOff className="w-12 h-12" />
            ) : (
              <Mic className="w-10 h-10" />
            )}
          </button>

          {/* Status Label below mic */}
          <div className="mt-4">
            {isListening ? (
              <span className="text-sm font-bold text-red-600 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                {page.statusListening}
              </span>
            ) : (
              <span className="text-xs text-gray-500 font-medium">
                {page.statusTapToSpeak}
              </span>
            )}
          </div>
        </div>

        {/* Real-time speech transcript or captured query display */}
        {(speechTranscript || lastQuery) && (
          <div className="relative z-10 max-w-lg mx-auto bg-gray-50 border border-gray-200 p-4 rounded-2xl text-left">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
              {isListening ? (page.liveTranscriptionTitle || 'Live Transcription:') : (page.queryLabel || 'Query Asked:')}
            </span>
            <p className="text-sm font-semibold text-gray-900 italic">
              "{speechTranscript || lastQuery}"
            </p>
          </div>
        )}

        {/* Loading state indicator */}
        {isLoadingChat && (
          <div className="text-sm text-[#0B6B4F] font-bold flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 animate-spin text-[#E9A23B]" />
            <span>{page.thinkingLabel || 'Generating response and reading aloud...'}</span>
          </div>
        )}

        {/* Fallback Manual Text Input */}
        <form onSubmit={handleManualSubmit} className="pt-2 max-w-lg mx-auto flex gap-2">
          <input
            type="text"
            value={manualQuery}
            onChange={(e) => setManualQuery(e.target.value)}
            placeholder={page.manualPlaceholder || 'Type your question here...'}
            className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B6B4F]"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#0B6B4F] text-white font-bold text-xs cursor-pointer shadow-xs hover:bg-[#095740]"
          >
            {page.askBtn || 'Ask'}
          </button>
        </form>
      </div>

      {/* Suggested Voice Queries */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-[#0B6B4F]" />
            {page.instantVoiceTitle}
          </span>
          <span className="text-[11px] text-gray-400 font-medium">{page.instantVoiceSubtitle}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {suggestedList.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickQuestion(q)}
              className="text-left p-3 rounded-xl border border-gray-200 hover:border-[#0B6B4F] hover:bg-emerald-50/40 text-xs text-gray-800 font-medium transition-all flex items-center justify-between group cursor-pointer"
            >
              <span className="pr-2">"{q}"</span>
              <div className="flex items-center gap-1 text-[#0B6B4F] font-bold text-[11px] shrink-0">
                <Volume2 className="w-3.5 h-3.5" />
                <span>{page.listenLabel}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Latest Voice Response Card */}
      {lastAiMsg && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700">
              {page.voiceResponseTitle}:
            </span>
            <button
              onClick={() => {
                if (lastAiMsg.structuredAnswer) {
                  speakText(lastAiMsg.structuredAnswer.summary, lastAiMsg.id);
                } else if (lastAiMsg.text) {
                  speakText(lastAiMsg.text, lastAiMsg.id);
                }
              }}
              className="text-xs font-bold text-[#0B6B4F] flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{page.replayLabel}</span>
            </button>
          </div>

          <AIResponseCard
            id={lastAiMsg.id}
            structuredAnswer={lastAiMsg.structuredAnswer}
            rawText={lastAiMsg.text}
            sourceMeta={lastAiMsg.sourceMeta}
            disclaimer={lastAiMsg.disclaimer}
            timestamp={lastAiMsg.timestamp}
          />
        </div>
      )}
    </div>
  );
};
