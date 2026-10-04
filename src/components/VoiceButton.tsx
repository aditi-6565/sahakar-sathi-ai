import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface VoiceButtonProps {
  onTranscriptReady?: (transcript: string) => void;
  className?: string;
  size?: 'normal' | 'large';
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  onTranscriptReady,
  className = '',
  size = 'normal',
}) => {
  const {
    isListening,
    startVoiceInput,
    stopVoiceInput,
    hasSpeechSupport,
    openVoiceTroubleshooter,
    t,
  } = useApp();

  const handleToggle = () => {
    if (!hasSpeechSupport) {
      openVoiceTroubleshooter();
      return;
    }

    if (isListening) {
      stopVoiceInput();
    } else {
      startVoiceInput((transcript) => {
        if (onTranscriptReady && transcript) {
          onTranscriptReady(transcript);
        }
      });
    }
  };

  const isLarge = size === 'large';

  return (
    <button
      onClick={handleToggle}
      className={`relative rounded-full flex items-center justify-center transition-all cursor-pointer select-none ${
        isListening
          ? 'bg-red-600 text-white shadow-lg ring-4 ring-red-200 animate-pulse'
          : 'bg-[#E9A23B] hover:bg-[#d8912e] text-white shadow-md hover:shadow-lg'
      } ${
        isLarge
          ? 'w-20 h-20 text-3xl'
          : 'w-12 h-12 min-h-[48px] min-w-[48px] text-xl'
      } ${className}`}
      title={isListening ? t('stopListening') : t('tapToSpeak')}
      aria-label={isListening ? t('stopListening') : t('tapToSpeak')}
    >
      {isListening ? (
        <MicOff className={isLarge ? 'w-8 h-8' : 'w-5 h-5'} />
      ) : (
        <Mic className={isLarge ? 'w-8 h-8' : 'w-5 h-5'} />
      )}

      {/* Ripple ring animation when active */}
      {isListening && (
        <span className="absolute -inset-1 rounded-full border-2 border-red-500 animate-ping opacity-75" />
      )}
    </button>
  );
};
