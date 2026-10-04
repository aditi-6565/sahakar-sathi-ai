import { ChatMessage, GrievanceItem, KnowledgeArticle } from '../types';

export interface ChatResponse {
  answer: {
    summary: string;
    whatYouNeed?: string;
    steps?: string[];
    documents?: string[];
    whereToGo?: string;
    importantNote?: string;
  };
  sourceMeta: {
    isAiGenerated: boolean;
    modelUsed: string;
    sources: string[];
    isVerified: boolean;
    mode: string;
  };
  disclaimer: string;
  language: string;
  query: string;
}

export async function sendChatMessage(
  message: string,
  language: string,
  category: string = 'All',
  history: ChatMessage[] = []
): Promise<ChatResponse> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      language,
      category,
      conversationHistory: history.map((h) => ({
        role: h.sender === 'user' ? 'user' : 'model',
        text: h.text || h.structuredAnswer?.summary || '',
      })),
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to get answer from Sahakar Sathi server.');
  }

  return res.json();
}

export async function fetchKnowledge(category?: string, search?: string): Promise<{ articles: KnowledgeArticle[]; total: number; categories: string[] }> {
  const params = new URLSearchParams();
  if (category && category !== 'All') params.append('category', category);
  if (search) params.append('search', search);

  const res = await fetch(`/api/knowledge?${params.toString()}`);
  if (!res.ok) {
    throw new Error('Failed to fetch knowledge base.');
  }
  return res.json();
}

export async function submitGrievance(payload: {
  category: string;
  description: string;
  contactName: string;
  district: string;
  phone?: string;
}): Promise<{
  success: boolean;
  trackingId: string;
  status: string;
  authority: string;
  record: GrievanceItem;
  demoNotice: string;
}> {
  const res = await fetch('/api/grievance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('Failed to submit grievance.');
  }
  return res.json();
}

export async function fetchGrievances(): Promise<{ grievances: GrievanceItem[]; total: number }> {
  const res = await fetch('/api/grievances');
  if (!res.ok) {
    throw new Error('Failed to fetch grievances.');
  }
  return res.json();
}

export async function fetchAnalytics() {
  const res = await fetch('/api/analytics');
  if (!res.ok) {
    throw new Error('Failed to fetch analytics.');
  }
  return res.json();
}
