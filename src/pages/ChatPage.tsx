import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  RotateCcw,
  Sparkles,
  Bot,
  User,
  Info,
  CheckCircle,
  ShieldAlert,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AIResponseCard } from '../components/AIResponseCard';
import { SUGGESTED_QUESTIONS } from '../utils/translations';
import { VoiceButton } from '../components/VoiceButton';
import { getPageContent } from '../utils/pageContent';

export const ChatPage: React.FC = () => {
  const {
    messages,
    sendMessage,
    isLoadingChat,
    language,
    t,
    setActiveTab,
    isListening,
    speechTranscript,
    voiceError,
    clearVoiceError,
  } = useApp();

  const chatContent = getPageContent(language).chat;
  const [input, setInput] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoadingChat]);

  // When speech transcript updates, populate input
  useEffect(() => {
    if (speechTranscript) {
      setInput(speechTranscript);
    }
  }, [speechTranscript]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoadingChat) return;

    const queryText = input.trim();
    setInput('');
    await sendMessage(queryText, selectedCategory);
  };

  const handleSuggestedClick = (q: string) => {
    setInput(q);
    sendMessage(q, selectedCategory);
  };

  const handleChipClick = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === 'Grievance Redressal') {
      setActiveTab('grievance');
    }
  };

  const suggestedQuestions = SUGGESTED_QUESTIONS[language] || SUGGESTED_QUESTIONS.en;

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] lg:h-[calc(100vh-6.5rem)] bg-white rounded-3xl border border-gray-200/90 shadow-xs overflow-hidden">
      {/* Top Chat Header */}
      <div className="p-4 sm:p-5 border-b border-gray-150 bg-gray-50/70 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0B6B4F] text-white flex items-center justify-center font-bold text-lg shadow-xs">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
                सारथी (Saarthi AI)
              </h2>
              <span className="text-[10px] font-bold bg-emerald-50 text-[#0B6B4F] px-2 py-0.5 rounded-full border border-emerald-200">
                Active
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {t('speakInLanguage')} • बहुभाषिक सहकारी व कृषी सहाय्यक
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('voice')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold hover:bg-amber-100 cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5 text-amber-600" />
            <span>{t('voiceAssistant')}</span>
          </button>
        </div>
      </div>

      {/* Quick Action Category Chips */}
      <div className="p-2 sm:px-4 bg-gray-50/40 border-b border-gray-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider shrink-0 mr-1">
          {chatContent.sectionLabel || 'Category'}:
        </span>
        {chatContent.chips.map((chip: { label: string; category: string }, idx: number) => (
          <button
            key={idx}
            onClick={() => handleChipClick(chip.category)}
            className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-all font-semibold cursor-pointer border ${
              selectedCategory === chip.category
                ? 'bg-[#0B6B4F] text-white border-[#0B6B4F]'
                : 'bg-white text-gray-700 border-gray-200 hover:border-[#0B6B4F]'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Chat Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#F7F8F5]/50">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          if (isUser) {
            return (
              <div key={msg.id} className="flex justify-end gap-2.5">
                <div className="max-w-[85%] sm:max-w-xl bg-[#0B6B4F] text-white p-4 rounded-2xl rounded-tr-xs shadow-xs">
                  <div className="text-xs sm:text-sm font-medium leading-relaxed">
                    {msg.text}
                  </div>
                  <div className="text-[10px] text-emerald-200 text-right mt-1.5 font-sans">
                    {msg.timestamp}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#0B6B4F] flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              </div>
            );
          }

          return (
            <div key={msg.id} className="flex gap-2.5 max-w-3xl">
              <div className="w-8 h-8 rounded-full bg-[#0B6B4F] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                S
              </div>
              <div className="flex-1">
                <AIResponseCard
                  id={msg.id}
                  structuredAnswer={msg.structuredAnswer}
                  rawText={msg.text}
                  sourceMeta={msg.sourceMeta}
                  disclaimer={msg.disclaimer}
                  timestamp={msg.timestamp}
                />
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoadingChat && (
          <div className="flex gap-2.5 max-w-md">
            <div className="w-8 h-8 rounded-full bg-[#0B6B4F] text-white flex items-center justify-center font-bold text-xs shrink-0">
              S
            </div>
            <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-xs flex items-center gap-3">
              <div className="flex space-x-1.5">
                <div className="w-2.5 h-2.5 bg-[#0B6B4F] rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2.5 h-2.5 bg-[#E9A23B] rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2.5 h-2.5 bg-[#0B6B4F] rounded-full animate-bounce" />
              </div>
              <span className="text-xs text-gray-500 font-medium">
                सारथी (Saarthi) विचार करत आहे... (Formulating structured advice)
              </span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Suggested Questions Carousel */}
      <div className="px-4 py-2 bg-gray-50/70 border-t border-gray-150 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider shrink-0">
            {chatContent.suggestedLabel || 'Suggested'}:
          </span>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestedClick(q)}
              className="px-3 py-1 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-[#0B6B4F] hover:border-[#0B6B4F] shrink-0 transition-colors cursor-pointer text-xs"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Voice error banner if any */}
      {voiceError && (
        <div className="px-4 py-2 bg-amber-50 border-t border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="truncate sm:whitespace-normal">{voiceError}</span>
          </div>
          <button
            type="button"
            onClick={clearVoiceError}
            className="text-amber-700 hover:text-amber-950 font-bold px-2 py-0.5 text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Input Bar with Voice Button */}
      <form
        onSubmit={handleSend}
        className="p-3 sm:p-4 bg-white border-t border-gray-150 flex items-center gap-2 sm:gap-3"
      >
        <VoiceButton
          onTranscriptReady={(text) => {
            setInput(text);
            sendMessage(text, selectedCategory);
          }}
        />

        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? t('listening') : (chatContent.inputPlaceholder || t('typeMessage'))}
            className={`w-full rounded-2xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B6B4F] min-h-[48px] ${
              isListening
                ? 'border-red-400 bg-red-50/30'
                : 'border-gray-300 bg-gray-50/50'
            }`}
          />
        </div>

        <button
          type="submit"
          disabled={!input.trim() || isLoadingChat}
          className="w-12 h-12 rounded-2xl bg-[#0B6B4F] hover:bg-[#095740] text-white flex items-center justify-center shadow-xs transition-transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0 min-h-[48px] min-w-[48px]"
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
