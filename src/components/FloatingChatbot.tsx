import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Maximize2,
  Sparkles,
  Bot,
  User,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VoiceButton } from './VoiceButton';
import { SUGGESTED_QUESTIONS } from '../utils/translations';

export const FloatingChatbot: React.FC = () => {
  const {
    messages,
    sendMessage,
    isLoadingChat,
    language,
    t,
    setActiveTab,
    activeTab,
    speakText,
    stopSpeech,
    isSpeaking,
    voiceError,
    clearVoiceError,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [showTooltip, setShowTooltip] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll inside floating chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoadingChat]);

  // Hide tooltip after a few seconds or on interaction
  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoadingChat) return;
    const text = input.trim();
    setInput('');
    await sendMessage(text);
  };

  const handleOpenFullChat = () => {
    setIsOpen(false);
    setActiveTab('chat');
  };

  const suggestedList = SUGGESTED_QUESTIONS[language] || SUGGESTED_QUESTIONS.en;

  // Don't duplicate if already on the dedicated full chat page
  const isAlreadyOnChatPage = activeTab === 'chat';

  return (
    <div className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-50 flex flex-col items-end">
      {/* Floating Chat Window Modal */}
      {isOpen && (
        <div className="w-[calc(100vw-2rem)] sm:w-96 h-[500px] max-h-[75vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden mb-3 animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#0B6B4F] text-white p-3.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white text-[#0B6B4F] flex items-center justify-center font-bold text-sm shadow-xs">
                S
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm">सारथी (Saarthi)</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                </div>
                <p className="text-[10px] text-emerald-100">
                  {t('speakInLanguage')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleOpenFullChat}
                className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Full Screen Chat"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Category Chips inside mini-chat */}
          <div className="bg-gray-50 border-b border-gray-150 p-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
            {['PMFBY', 'PACS', 'सहकारी नियम', 'कर्ज'].map((c, i) => (
              <button
                key={i}
                onClick={() => sendMessage(c)}
                className="px-2.5 py-0.5 rounded-full bg-white border border-gray-200 text-gray-700 hover:border-[#0B6B4F] hover:text-[#0B6B4F] whitespace-nowrap text-[11px] font-medium"
              >
                {c}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#F7F8F5]/60 text-xs">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              if (isUser) {
                return (
                  <div key={m.id} className="flex justify-end gap-1.5">
                    <div className="bg-[#0B6B4F] text-white p-2.5 rounded-2xl rounded-tr-xs max-w-[85%] shadow-2xs">
                      <p>{m.text}</p>
                    </div>
                  </div>
                );
              }

              const summary = m.structuredAnswer?.summary || m.text || '';
              return (
                <div key={m.id} className="flex items-start gap-1.5 max-w-[95%]">
                  <div className="w-6 h-6 rounded-full bg-[#0B6B4F] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    S
                  </div>
                  <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-xs shadow-2xs space-y-1.5 text-gray-800">
                    <p className="font-medium text-gray-900 leading-relaxed">{summary}</p>
                    {m.structuredAnswer?.steps && (
                      <ul className="space-y-1 text-[11px] text-gray-600 pl-1">
                        {m.structuredAnswer.steps.slice(0, 3).map((st, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-[#0B6B4F] font-bold">•</span>
                            <span>{st}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {m.structuredAnswer?.whereToGo && (
                      <p className="text-[10px] text-blue-900 bg-blue-50 p-1.5 rounded-lg border border-blue-100">
                        <strong>कुठे जावे:</strong> {m.structuredAnswer.whereToGo}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoadingChat && (
              <div className="flex items-center gap-2 text-gray-500 text-xs p-2">
                <Sparkles className="w-3.5 h-3.5 text-[#E9A23B] animate-spin" />
                <span>सारथी विचार करत आहे...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          <div className="p-1.5 bg-gray-50 border-t border-gray-150 flex items-center gap-1 overflow-x-auto no-scrollbar">
            {suggestedList.slice(0, 2).map((q, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(q)}
                className="px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-600 text-[10px] truncate max-w-[160px] shrink-0 hover:text-[#0B6B4F]"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Voice Error notice in mini-chat */}
          {voiceError && (
            <div className="px-2.5 py-1.5 bg-amber-50 border-t border-amber-200 text-amber-900 text-[10px] flex items-center justify-between gap-1">
              <span className="truncate">{voiceError}</span>
              <button
                type="button"
                onClick={clearVoiceError}
                className="font-bold text-amber-700 hover:text-amber-950 px-1"
              >
                ✕
              </button>
            </div>
          )}

          {/* Input Bar */}
          <form onSubmit={handleSend} className="p-2.5 bg-white border-t border-gray-150 flex items-center gap-1.5">
            <VoiceButton
              className="w-9 h-9 min-h-[36px] min-w-[36px] text-sm"
              onTranscriptReady={(txt) => {
                setInput(txt);
                sendMessage(txt);
              }}
            />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="सारथी ला विचारा..."
              className="flex-1 bg-gray-50 rounded-xl px-3 py-2 text-xs border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#0B6B4F]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoadingChat}
              className="w-9 h-9 rounded-xl bg-[#0B6B4F] text-white flex items-center justify-center shrink-0 disabled:opacity-40 cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button (FAB) on Bottom Right Corner */}
      <div className="relative flex items-center">
        {/* Friendly speech bubble tooltip */}
        {showTooltip && !isOpen && !isAlreadyOnChatPage && (
          <div
            onClick={() => {
              setIsOpen(true);
              setShowTooltip(false);
            }}
            className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-900 text-white text-xs px-3.5 py-1.5 rounded-xl shadow-lg border border-gray-700 flex items-center gap-2 cursor-pointer animate-in fade-in zoom-in-95 duration-200"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold">मदत हवी आहे? सारथी शी बोला</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="text-gray-400 hover:text-white ml-1"
            >
              ×
            </button>
          </div>
        )}

        <button
          onClick={() => {
            if (isAlreadyOnChatPage) {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              setIsOpen((prev) => !prev);
              setShowTooltip(false);
            }
          }}
          className={`group relative rounded-full flex items-center justify-center transition-all duration-200 shadow-lg cursor-pointer select-none active:scale-95 ${
            isOpen
              ? 'w-14 h-14 bg-gray-800 text-white ring-4 ring-gray-200'
              : 'w-14 h-14 sm:w-16 sm:h-16 bg-[#0B6B4F] hover:bg-[#095740] text-white ring-4 ring-emerald-100 hover:ring-[#E9A23B]/30'
          }`}
          aria-label="Open Saarthi Digital Assistant"
          title="Saarthi Digital Assistant"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <div className="flex flex-col items-center justify-center relative">
              {/* Bot Icon with Saarthi Badge */}
              <Bot className="w-7 h-7 sm:w-8 sm:h-8 text-white transition-transform" />
              {/* Online Green Indicator Dot */}
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#E9A23B] border-2 border-white" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
};
