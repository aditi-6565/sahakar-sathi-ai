import React from 'react';
import { Volume2, VolumeX, MapPin, CheckCircle2, FileText, AlertTriangle, ArrowRight } from 'lucide-react';
import { StructuredAIAnswer, SourceMeta, SupportedLanguage } from '../types';
import { SourceBadge } from './SourceBadge';
import { Disclaimer } from './Disclaimer';
import { useApp } from '../context/AppContext';

interface AIResponseCardProps {
  id: string;
  structuredAnswer?: StructuredAIAnswer;
  rawText?: string;
  sourceMeta?: SourceMeta;
  disclaimer?: string;
  timestamp: string;
}

const SECTION_HEADERS: Record<SupportedLanguage, { req: string; steps: string; docs: string; where: string; note: string }> = {
  mr: { req: 'पात्रता / काय आवश्यक आहे (Requirement)', steps: 'कृती पायऱ्या (Action Steps)', docs: 'आवश्यक कागदपत्रे (Required Documents)', where: 'कुठे जावे / संपर्क कार्यालय (Where to Go):', note: 'महत्त्वाची सूचना (Important Note):' },
  hi: { req: 'पात्रता / क्या आवश्यक है (Requirement)', steps: 'कार्यवाही के चरण (Action Steps)', docs: 'आवश्यक दस्तावेज़ (Required Documents)', where: 'कहाँ जाएं / अधिकृत कार्यालय (Where to Go):', note: 'महत्वपूर्ण सूचना (Important Note):' },
  en: { req: 'Eligibility / What You Need (Requirement)', steps: 'Action Steps', docs: 'Required Documents', where: 'Where to Go / Authorized Office:', note: 'Important Note:' },
  gu: { req: 'પાત્રતા / શું જરૂરી છે (Requirement)', steps: 'કાર્યવાહીના પગલાં (Action Steps)', docs: 'જરૂરી દસ્તાવેજો (Required Documents)', where: 'ક્યાં જવું / અધિકૃત કચેરી (Where to Go):', note: 'મહત્વપૂર્ણ સૂચના (Important Note):' },
  ta: { req: 'தகுதி / தேவையானவை (Requirement)', steps: 'செயல்முறை படிநிலைகள் (Action Steps)', docs: 'தேவையான ஆவணங்கள் (Required Documents)', where: 'எங்கு செல்வது / அலுவலகம் (Where to Go):', note: 'முக்கிய குறிப்பு (Important Note):' },
  te: { req: 'అర్హత / కావలసినవి (Requirement)', steps: 'చర్యలు / దశలు (Action Steps)', docs: 'అవసరమైన పత్రాలు (Required Documents)', where: 'ఎక్కడికి వెళ్లాలి / కార్యాలయం (Where to Go):', note: 'ముఖ్య గమనిక (Important Note):' },
  kn: { req: 'ಅರ್ಹತೆ / ಬೇಕಾದ ಮಾಹಿತಿ (Requirement)', steps: 'ಕ್ರಮಗಳು / ಹಂತಗಳು (Action Steps)', docs: 'ಅಗತ್ಯ ದಾಖಲೆಗಳು (Required Documents)', where: 'ಎಲ್ಲಿಗೆ ಹೋಗಬೇಕು / ಕಚೇರಿ (Where to Go):', note: 'ಮುಖ್ಯ ಸೂಚನೆ (Important Note):' },
  bn: { req: 'যোগ্যতা / কী প্রয়োজন (Requirement)', steps: 'কার্যকরী পদক্ষেপ (Action Steps)', docs: 'প্রয়োজনীয় নথিপত্র (Required Documents)', where: 'কোথায় যাবেন / অফিস (Where to Go):', note: 'জরুরি নির্দেশ (Important Note):' },
};

export const AIResponseCard: React.FC<AIResponseCardProps> = ({
  id,
  structuredAnswer,
  rawText,
  sourceMeta,
  disclaimer,
  timestamp,
}) => {
  const { speakText, stopSpeech, isSpeaking, currentlySpeakingId, t, language } = useApp();
  const headers = SECTION_HEADERS[language] || SECTION_HEADERS.en;

  const isCurrentAudio = isSpeaking && currentlySpeakingId === id;

  const handleAudioToggle = () => {
    if (isCurrentAudio) {
      stopSpeech();
    } else {
      let speechContent = '';
      if (structuredAnswer) {
        speechContent = `${structuredAnswer.summary}. `;
        if (structuredAnswer.whatYouNeed) speechContent += `${structuredAnswer.whatYouNeed}. `;
        if (structuredAnswer.steps?.length) {
          speechContent += `Steps: ${structuredAnswer.steps.join('. ')}. `;
        }
        if (structuredAnswer.whereToGo) {
          speechContent += `Where to go: ${structuredAnswer.whereToGo}. `;
        }
        if (structuredAnswer.importantNote) {
          speechContent += `Important: ${structuredAnswer.importantNote}`;
        }
      } else if (rawText) {
        speechContent = rawText;
      }
      speakText(speechContent, id);
    }
  };

  return (
    <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow duration-200 relative overflow-hidden">
      {/* Clean top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#0B6B4F]" />

      {/* Header bar with Sahakar Sathi Badge and Audio Speak Button */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-gray-100 mb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#0B6B4F] text-white flex items-center justify-center font-bold text-sm shadow-xs">
            S
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              सारथी (Saarthi AI)
              <span className="text-[10px] font-normal bg-green-50 text-[#0B6B4F] px-1.5 py-0.5 rounded border border-green-200">
                Official Assistant
              </span>
            </div>
            <div className="text-[11px] text-gray-500">{timestamp}</div>
          </div>
        </div>

        {/* Audio Listen / Speak button */}
        <button
          onClick={handleAudioToggle}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            isCurrentAudio
              ? 'bg-red-50 text-red-700 border border-red-200 animate-pulse'
              : 'bg-[#0B6B4F]/10 hover:bg-[#0B6B4F]/20 text-[#0B6B4F] border border-[#0B6B4F]/20'
          }`}
          title={isCurrentAudio ? t('stopAudio') : t('readAloud')}
          aria-label={isCurrentAudio ? t('stopAudio') : t('readAloud')}
        >
          {isCurrentAudio ? (
            <>
              <VolumeX className="w-3.5 h-3.5" />
              <span>{t('stopAudio')}</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5" />
              <span>{t('listen')}</span>
            </>
          )}
        </button>
      </div>

      {/* Content Body */}
      {structuredAnswer ? (
        <div className="space-y-4 text-sm text-gray-800">
          {/* 1. Summary */}
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-150 font-medium text-gray-900 leading-relaxed">
            {structuredAnswer.summary}
          </div>

          {/* 2. What you need / Eligibility */}
          {structuredAnswer.whatYouNeed && (
            <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl">
              <span className="text-xs font-bold text-[#0B6B4F] uppercase tracking-wider block mb-1">
                {headers.req}
              </span>
              <p className="text-gray-800 text-xs sm:text-sm">{structuredAnswer.whatYouNeed}</p>
            </div>
          )}

          {/* 3. Steps */}
          {structuredAnswer.steps && structuredAnswer.steps.length > 0 && (
            <div>
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
                {headers.steps}
              </span>
              <div className="space-y-2">
                {structuredAnswer.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#0B6B4F]/10 text-[#0B6B4F] text-xs font-bold flex items-center justify-center mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-gray-800">{step.replace(/^\d+[\.\)]\s*/, '')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Documents Required */}
          {structuredAnswer.documents && structuredAnswer.documents.length > 0 && (
            <div className="bg-amber-50/40 border border-amber-100/80 p-3 rounded-xl">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <FileText className="w-3.5 h-3.5 text-[#E9A23B]" />
                {headers.docs}
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {structuredAnswer.documents.map((doc, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-gray-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0B6B4F] shrink-0" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 5. Where to Go */}
          {structuredAnswer.whereToGo && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs sm:text-sm text-blue-950">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-blue-900 block text-xs uppercase tracking-wider">
                  {headers.where}
                </span>
                <span className="text-blue-900">{structuredAnswer.whereToGo}</span>
              </div>
            </div>
          )}

          {/* 6. Important Note */}
          {structuredAnswer.importantNote && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-orange-50 border border-orange-200/80 text-xs sm:text-sm text-orange-950">
              <AlertTriangle className="w-4 h-4 text-[#E9A23B] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-orange-900 block text-xs uppercase tracking-wider">
                  {headers.note}
                </span>
                <span className="text-orange-900">{structuredAnswer.importantNote}</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
          {rawText}
        </div>
      )}

      {/* Source Verification Badge */}
      <SourceBadge sourceMeta={sourceMeta} />

      {/* Mandatory Statutory Disclaimer */}
      <Disclaimer customText={disclaimer} />
    </div>
  );
};
