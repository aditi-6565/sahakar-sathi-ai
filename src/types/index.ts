export type SupportedLanguage = 'en' | 'hi' | 'mr' | 'gu' | 'ta' | 'te' | 'kn' | 'bn';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
  speechCode: string;
}

export interface StructuredAIAnswer {
  summary: string;
  whatYouNeed?: string;
  steps?: string[];
  documents?: string[];
  whereToGo?: string;
  importantNote?: string;
}

export interface SourceMeta {
  isAiGenerated: boolean;
  modelUsed: string;
  sources: string[];
  isVerified: boolean;
  mode: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text?: string;
  structuredAnswer?: StructuredAIAnswer;
  sourceMeta?: SourceMeta;
  disclaimer?: string;
  timestamp: string;
  language: SupportedLanguage;
  category?: string;
}

export interface GrievanceItem {
  id: string;
  category: string;
  description: string;
  submittedAt: string;
  status: 'Submitted' | 'Under Review' | 'Resolved';
  authority: string;
  contactName: string;
  district: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  language: string;
  content: string;
  source: string;
  lastUpdated: string;
  isVerified: boolean;
}

export interface UserProfile {
  name: string;
  role: string;
  village: string;
  district: string;
  state: string;
  kisanId: string;
  pacsMembershipId: string;
}
