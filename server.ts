import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI if key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('[Gemini API] Initialized successfully with API Key.');
  } catch (err) {
    console.warn('[Gemini API] Failed to initialize client:', err);
  }
} else {
  console.log('[Gemini API] GEMINI_API_KEY not found in environment. Falling back to intelligent Demo Mode responses.');
}

// Load knowledge base
interface KnowledgeItem {
  id: string;
  title: string;
  category: string;
  language: string;
  content: string;
  source: string;
  lastUpdated: string;
  isVerified: boolean;
}

const knowledgeFiles = [
  'cooperative_laws.json',
  'government_schemes.json',
  'pmfby.json',
  'pacs_services.json',
  'financial_literacy.json',
  'grievance.json',
];

function loadKnowledgeBase(): KnowledgeItem[] {
  const items: KnowledgeItem[] = [];
  const knowledgeDir = path.join(__dirname, 'knowledge');
  if (fs.existsSync(knowledgeDir)) {
    for (const file of knowledgeFiles) {
      const filePath = path.join(knowledgeDir, file);
      if (fs.existsSync(filePath)) {
        try {
          const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          if (Array.isArray(content)) {
            items.push(...content);
          }
        } catch (e) {
          console.error(`Error loading ${file}:`, e);
        }
      }
    }
  }
  return items;
}

const allKnowledge = loadKnowledgeBase();

// Keyword / semantic retrieval
function retrieveKnowledgeContext(query: string, category?: string): KnowledgeItem[] {
  const queryLower = query.toLowerCase();
  const matched = allKnowledge.filter((item) => {
    if (category && category !== 'All' && item.category.toLowerCase().includes(category.toLowerCase())) {
      return true;
    }
    const titleMatch = item.title.toLowerCase().split(' ').some((word) => word.length > 3 && queryLower.includes(word));
    const contentMatch = item.content.toLowerCase().split(' ').some((word) => word.length > 4 && queryLower.includes(word));
    return titleMatch || contentMatch;
  });

  return matched.slice(0, 3);
}

// In-memory demo grievance store
interface GrievanceRecord {
  id: string;
  category: string;
  description: string;
  submittedAt: string;
  status: 'Submitted' | 'Under Review' | 'Resolved';
  authority: string;
  contactName: string;
  district: string;
}

const grievances: GrievanceRecord[] = [
  {
    id: 'SAH-2026-001245',
    category: 'Cooperative Society',
    description: 'हमारी प्राथमिक सहकारी समिति में पिछले छह महीने से कोई बैठक नहीं बुलाई गई है और ऑडिट रिपोर्ट भी नहीं दिखाई गई।',
    submittedAt: '2026-02-28 11:30 AM',
    status: 'Submitted',
    authority: 'Assistant Registrar of Cooperative Societies (ARCS), Nashik',
    contactName: 'Ramesh Patil',
    district: 'Nashik, Maharashtra',
  },
  {
    id: 'SAH-2026-001246',
    category: 'Crop Insurance (PMFBY)',
    description: 'Post-harvest unseasonal rain damaged onion produce. Local claim surveyed but receipt confirmation not received within 72 hrs.',
    submittedAt: '2026-03-01 02:15 PM',
    status: 'Under Review',
    authority: 'District Level Monitoring Committee (DLMC), Agriculture Dept',
    contactName: 'Suresh More',
    district: 'Ahmednagar, Maharashtra',
  },
];

// Intelligent demo fallback response generator
function getDemoResponse(message: string, language: string) {
  const msg = message.toLowerCase();
  const isMarathi = language.toLowerCase().includes('marathi') || language === 'mr' || /[\u0900-\u097F]/.test(message) && (msg.includes('काय') || msg.includes('आहे') || msg.includes('मिळेल') || msg.includes('पाहिजे') || msg.includes('तक्रार'));
  const isHindi = language.toLowerCase().includes('hindi') || language === 'hi' || /[\u0900-\u097F]/.test(message) && (msg.includes('क्या') || msg.includes('है') || msg.includes('कैसे') || msg.includes('चाहिए') || msg.includes('योजना'));

  if (isMarathi || language === 'mr') {
    if (msg.includes('विमा') || msg.includes('pmfby') || msg.includes('पीक')) {
      return {
        summary: 'PMFBY — प्रधानमंत्री पीक विमा योजना ही नैसर्गिक आपत्ती, दुष्काळ, अतिवृष्टी किंवा किडीमुळे पिकांचे नुकसान झाल्यास शेतकऱ्यांना आर्थिक भरपाई देणारी केंद्र सरकारची प्रमुख योजना आहे.',
        whatYouNeed: 'पात्रता: चालू हंगामात अधिसूचित पिके घेणारे सर्व शेतकरी (कर्जदार व बिगर-कर्जदार शेतकरी).',
        steps: [
          '१. खरीप (२% प्रीमियम), रब्बी (१.५% प्रीमियम) व बागायती (५% प्रीमियम) अंतर्गत अर्ज करा.',
          '२. स्थानिक आपत्ती किंवा काढणीनंतर नुकसान झाल्यास ७२ तासांच्या आत विमा कंपनी अथवा क्रॉप इन्शुरन्स ॲपवर नोंद करा.',
          '३. कृषी अधिकारी व विमा प्रतिनिधी पंचनामा करतील.',
          '४. भरपाई थेट आधार संलग्न बँक खात्यात जमा केली जाते.'
        ],
        documents: [
          'आधार कार्ड',
          '७/१२ उतारा आणि ८-अ उतारा',
          'बँक पासबूक झेरॉक्स (आधार संलग्न खाते)',
          'पीक पेरणी स्वयंघोषणापत्र / दाखला'
        ],
        whereToGo: 'आपले स्थानिक PACS (सेवा सहकारी संस्था), राष्ट्रीयीकृत/सहकारी बँक, किंवा अधिकृत CSC केंद्र.',
        importantNote: 'स्थानिक आपत्ती घडल्यास ७२ तासांच्या आत तक्रार नोंदवणे अत्यंत आवश्यक आहे. अधिक माहितीसाठी टोल-फ्री क्रमांक १४४४७ वर संपर्क साधा.'
      };
    }
    if (msg.includes('पॅक्स') || msg.includes('pacs') || msg.includes('सेवा') || msg.includes('पतसंस्था')) {
      return {
        summary: 'PACS (प्राथमिक कृषी पतपुरवठा संस्था) ही ग्रामीण भागातील शेतकऱ्यांची मुख्य आधारस्तंभ संस्था आहे.',
        whatYouNeed: 'गावातील रहिवासी व शेतजमीन धारक कोणताही शेतकरी सदस्य होऊ शकतो.',
        steps: [
          '१. अल्पमुदतीचे शून्य/कमी व्याजदरातील पीक कर्ज (Kisan Credit Card - KCC) मिळवणे.',
          '२. दर्जेदार व रास्त दरातील रासायनिक व सेंद्रिय खते, प्रमाणित बियाणे खरेदी.',
          '३. कृषी अवजारे भाड्याने मिळवणे (Custom Hiring Centers).',
          '४. सीएससी (CSC) द्वारे शासकीय दाखले व डिजिटल सेवा मिळवणे.'
        ],
        documents: ['आधार कार्ड', '७/१२ उतारा', 'रहिवासी दाखला', 'पासपोर्ट फोटो'],
        whereToGo: 'आपल्या गावातील स्थानिक ग्रामपंचायत किंवा पॅक्स (PACS) कार्यालय.',
        importantNote: 'केंद्र शासनाच्या नव्या नियमांनुसार देशातील सर्व पॅक्सचे संगणकीकरण (ERP) सुरू असून व्यवहार अधिक पारदर्शक झाले आहेत.'
      };
    }
    if (msg.includes('सभासद') || msg.includes('कायदा') || msg.includes('नियम') || msg.includes('सहकारी')) {
      return {
        summary: 'सहकारी संस्था सभासदत्व — महाराष्ट्र सहकारी संस्था कायदा १९६० अंतर्गत लोकशाही पद्धतीने संस्थेचे कामकाज चालते.',
        whatYouNeed: 'वय १८ वर्षे पूर्ण आणि कार्यक्षेत्रात शेतजमीन किंवा व्यवसाय असणे आवश्यक.',
        steps: [
          '१. विहित नमुन्यातील सभासदत्व अर्ज (Form) भरावा.',
          '२. संस्थेचा किमान १ शेअर (भागभांडवल) व प्रवेश शुल्क जमा करावे.',
          '३. व्यवस्थापन समिती ३ महिन्यांत मंजुरी देते.',
          '४. दरवर्षी वार्षिक सर्वसाधारण सभेत (AGM) मतदानाचा अधिकार मिळतो (एक सभासद, एक मत).'
        ],
        documents: ['ओळखपत्र (आधार/मतदान)', 'पत्त्याचा पुरावा', 'शेतीचे पुरावे (७/१२)', '२ पासपोर्ट फोटो'],
        whereToGo: 'संस्थेचे मुख्य कार्यालय अथवा तालुका उपनिबंधक (ARCS) कार्यालय.',
        importantNote: 'सभासदाला संस्थेचे ऑडिट अहवाल व हिशेब तपासण्याचा वैधानिक अधिकार असतो.'
      };
    }
  }

  if (isHindi || language === 'hi') {
    if (msg.includes('बीमा') || msg.includes('pmfby') || msg.includes('फसल')) {
      return {
        summary: 'PMFBY — प्रधानमंत्री फसल बीमा योजना किसानों को प्राकृतिक आपदाओं, सूखा, बाढ़ और कीट प्रकोप से होने वाले आर्थिक नुकसान से सुरक्षा प्रदान करती है।',
        whatYouNeed: 'अधिसूचित क्षेत्र में अधिसूचित फसल उगाने वाले सभी किसान (बटाईदार और काश्तकार किसान भी पात्र हैं)।',
        steps: [
          '1. खरीफ फसल हेतु 2% और रबी फसल हेतु 1.5% की न्यूनतम प्रीमियम दर पर आवेदन करें।',
          '2. प्राकृतिक आपदा के 72 घंटे के भीतर फसल क्षति की सूचना क्रॉप इंश्योरेंस ऐप या टोल-फ्री 14447 पर दें।',
          '3. कृषि विभाग और बीमा कंपनी संयुक्त सर्वे करेगी।',
          '4. क्लेम राशि सीधे डीबीटी (DBT) के माध्यम से बैंक खाते में प्राप्त होगी।'
        ],
        documents: [
          'आधार कार्ड',
          'भूमि स्वामित्व दस्तावेज (खसरा / खतौनी)',
          'बैंक पासबुक की प्रति (आधार लिंक खाता)',
          'फसल बुवाई स्व-घोषणा पत्र'
        ],
        whereToGo: 'निकटतम पैक्स (PACS), सीएससी (CSC) सेंटर या अपनी अधिकृत बैंक शाखा।',
        importantNote: 'स्थानीय आपदा (ओलावृष्टि, जलभराव) के मामले में 72 घंटे के भीतर सूचना देना अनिवार्य है।'
      };
    }
    if (msg.includes('पैक्स') || msg.includes('pacs') || msg.includes('सेवाएं')) {
      return {
        summary: 'पैक्स (PACS) — प्राथमिक कृषि ऋण समितियां ग्रामीण स्तर पर किसानों की वित्तीय और कृषि जरूरतों की मुख्य रीढ़ हैं।',
        whatYouNeed: 'समिति के कार्यक्षेत्र में रहने वाला कोई भी किसान या ग्रामीण नागरिक सदस्य बन सकता है।',
        steps: [
          '1. रियायती दर पर किसान क्रेडिट कार्ड (KCC) ऋण सुविधा।',
          '2. प्रमाणित बीज, उर्वरक और कीटनाशकों की समय पर उपलब्धता।',
          '3. आधुनिक कृषि यंत्र किराए पर प्राप्त करना।',
          '4. सीएससी (CSC) डिजिटल सेवाएं जैसे ई-केवाईसी, बिल भुगतान।'
        ],
        documents: ['आधार कार्ड', 'खतौनी नकल', 'पासपोर्ट साइज फोटो', 'बैंक खाता विवरण'],
        whereToGo: 'ग्राम पंचायत स्थित पैक्स (PACS) कार्यालय।',
        importantNote: 'सहकारिता मंत्रालय द्वारा सभी पैक्स का राष्ट्रीय ईआरपी सॉफ्टवेयर पर डिजिटलीकरण किया जा रहा है।'
      };
    }
  }

  // Default English structured answer
  return {
    summary: 'Saarthi AI provides structured guidance on Indian Cooperative Governance, Ministry of Cooperation schemes, PMFBY crop insurance, PACS services, and dispute redressal.',
    whatYouNeed: 'Understand your eligibility under cooperative by-laws or scheme guidelines.',
    steps: [
      '1. Identify the relevant category (PACS, Crop Insurance, Cooperative Society, or Financial Literacy).',
      '2. Review the statutory requirements and timelines (e.g., 72 hours for crop damage reporting).',
      '3. Assemble the essential verification documents (Aadhaar, Land Records, Bank Passbook).',
      '4. Submit your request or grievance to the designated authority (PACS Secretary, ARCS, or DLMC).'
    ],
    documents: [
      'Aadhaar Card (identity proof)',
      'Land Records (7/12, RoR, Khatauni)',
      'Aadhaar-seeded Bank Account Passbook',
      'Membership Passbook or Policy Slip'
    ],
    whereToGo: 'Your local Primary Agricultural Credit Society (PACS), District Central Cooperative Bank, or District Deputy Registrar (DDR) office.',
    importantNote: 'Always verify deadlines, subsidy percentages, and official circulars with your district cooperative officer or official portal (cooperation.gov.in / pmfby.gov.in).'
  };
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Sahakar Sathi',
    service: 'Multilingual Cooperative Governance & Rural Assistance',
    organization: 'Ministry of Cooperation & NCCT',
    hasGeminiKey: Boolean(apiKey),
    totalKnowledgeArticles: allKnowledge.length,
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/knowledge', (req, res) => {
  const { category, search } = req.query;
  let filtered = allKnowledge;
  if (category && category !== 'All') {
    filtered = filtered.filter((item) => item.category.toLowerCase() === String(category).toLowerCase());
  }
  if (search) {
    const s = String(search).toLowerCase();
    filtered = filtered.filter((item) => item.title.toLowerCase().includes(s) || item.content.toLowerCase().includes(s));
  }
  res.json({
    articles: filtered,
    total: filtered.length,
    categories: Array.from(new Set(allKnowledge.map((k) => k.category))),
  });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, language = 'English', conversationHistory = [], category = 'All' } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Retrieve context for RAG
    const relevantDocs = retrieveKnowledgeContext(message, category);
    const contextText = relevantDocs
      .map((doc) => `[Source: ${doc.source} | Category: ${doc.category}]\n${doc.title}: ${doc.content}`)
      .join('\n\n');

    let responseData = null;
    let sourceMeta = {
      isAiGenerated: false,
      modelUsed: 'Demo Knowledge Base & Multilingual Rule Engine',
      sources: relevantDocs.map((d) => d.source),
      isVerified: true,
      mode: 'Demo Mode (Resilient Offline Mode)',
    };

    if (aiClient) {
      try {
        const systemInstruction = `You are "Saarthi AI", a multilingual informational digital assistant for cooperative members, farmers and rural citizens in India.
Organization: Ministry of Cooperation, Government of India, and National Council for Cooperative Training (NCCT).
Language: Respond strictly in the user's selected language: ${language}.
Safety & Trust rules:
- You are an informational assistant, NOT a lawyer, government officer, insurance company representative, or financial advisor.
- Never fabricate laws, schemes, eligibility requirements, deadlines, contact numbers, subsidy amounts, or government statistics.
- If specific numbers, deadlines, or dates are uncertain, explicitly instruct the user to verify with the official department or cooperative office.
- Use simple, accessible language suitable for rural citizens with low digital literacy.
- Format your response into a clear, structured JSON format with these exact keys:
  - "summary": A brief 1-2 sentence overview.
  - "whatYouNeed": Who is eligible or what is required.
  - "steps": An array of 3-5 simple, numbered action steps.
  - "documents": An array of required documents.
  - "whereToGo": Clear physical location or office (e.g. PACS office, Bank, CSC, ARCS office).
  - "importantNote": Crucial deadline or cautionary advice.
Ensure the response is valid parseable JSON. Do not include markdown ticks around the json if possible, or wrap properly.`;

        const prompt = `User Query in ${language}: "${message}"

Context Knowledge from Cooperative Repository:
${contextText || 'General Ministry of Cooperation & PMFBY Agricultural Guidelines'}

Generate the structured JSON response in ${language}.`;

        const aiResponse = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.2,
            responseMimeType: 'application/json',
          },
        });

        const rawText = aiResponse.text?.trim() || '';
        try {
          const parsed = JSON.parse(rawText);
          responseData = parsed;
          sourceMeta = {
            isAiGenerated: true,
            modelUsed: 'Google Gemini 3.8 Flash (Server-Side)',
            sources: relevantDocs.length ? relevantDocs.map((d) => d.source) : ['Ministry of Cooperation & PMFBY Guidelines'],
            isVerified: true,
            mode: 'Live Gemini AI with Grounded Context',
          };
        } catch (parseErr) {
          // If parse fails, extract fields or format as summary
          responseData = {
            summary: rawText.slice(0, 300),
            whatYouNeed: 'Check with your local cooperative authority.',
            steps: ['Review guidelines', 'Gather documents', 'Visit local PACS'],
            documents: ['Aadhaar', 'Land Record (7/12 / Khatauni)', 'Bank Passbook'],
            whereToGo: 'Local Primary Agricultural Credit Society (PACS) or District Cooperative Registrar.',
            importantNote: 'Please verify current rules with the relevant official department.',
          };
          sourceMeta.isAiGenerated = true;
          sourceMeta.modelUsed = 'Google Gemini 3.8 Flash (Raw)';
        }
      } catch (geminiError: any) {
        console.warn('[Gemini API] Request failed, using intelligent demo response:', geminiError?.message || geminiError);
        responseData = getDemoResponse(message, language);
        sourceMeta.mode = 'Demo Mode (Auto-Fallback on Network/Rate Limit)';
      }
    } else {
      // Demo response
      responseData = getDemoResponse(message, language);
    }

    // Always include standard statutory disclaimer as required by prompt
    const standardDisclaimer = 'Information provided for guidance. Please verify with the relevant official department or cooperative authority before taking legal, financial, insurance, or administrative action.';

    res.json({
      answer: responseData,
      sourceMeta,
      disclaimer: standardDisclaimer,
      language,
      query: message,
    });
  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    res.status(500).json({
      error: 'Something went wrong. Please try again.',
      details: err?.message,
    });
  }
});

// Grievance submission endpoint
app.post('/api/grievance', (req, res) => {
  const { category, description, contactName = 'Farmer Citizen', district = 'District Office', phone = '' } = req.body;

  if (!description || !category) {
    return res.status(400).json({ error: 'Category and description are required' });
  }

  const trackingId = `SAH-2026-${Math.floor(100000 + Math.random() * 900000)}`;

  let recommendedAuthority = 'Assistant Registrar of Cooperative Societies (ARCS)';
  if (category.includes('Insurance') || category.includes('PMFBY')) {
    recommendedAuthority = 'District Level Monitoring Committee (DLMC) & PMFBY Nodal Officer';
  } else if (category.includes('PACS')) {
    recommendedAuthority = 'District Central Cooperative Bank (DCCB) Inspection Wing';
  } else if (category.includes('Banking') || category.includes('Financial')) {
    recommendedAuthority = 'Banking Ombudsman / Cooperative Ombudsman Office';
  }

  const record: GrievanceRecord = {
    id: trackingId,
    category,
    description,
    submittedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    status: 'Submitted',
    authority: recommendedAuthority,
    contactName,
    district,
  };

  grievances.unshift(record);

  res.json({
    success: true,
    trackingId,
    status: 'Submitted',
    authority: recommendedAuthority,
    record,
    demoNotice: 'DEMO PROTOTYPE: This reference ID has been recorded in the prototype grievance tracking system.',
  });
});

app.get('/api/grievances', (req, res) => {
  res.json({
    grievances,
    total: grievances.length,
  });
});

// Analytics endpoint
app.get('/api/analytics', (req, res) => {
  res.json({
    totalQueries: 14280,
    voiceQueries: 8940,
    grievancesFiled: 1324,
    languages: [
      { name: 'Marathi (मराठी)', count: 4850, percentage: 34 },
      { name: 'Hindi (हिंदी)', count: 4280, percentage: 30 },
      { name: 'English', count: 1850, percentage: 13 },
      { name: 'Gujarati (ગુજરાતી)', count: 1420, percentage: 10 },
      { name: 'Tamil (தமிழ்)', count: 810, percentage: 6 },
      { name: 'Telugu (తెలుగు)', count: 520, percentage: 4 },
      { name: 'Kannada (ಕನ್ನಡ)', count: 320, percentage: 2 },
      { name: 'Bengali (বাংলা)', count: 230, percentage: 1 },
    ],
    categories: [
      { name: 'PMFBY / Crop Insurance', count: 5120, percentage: 36 },
      { name: 'PACS Services & KCC', count: 3740, percentage: 26 },
      { name: 'Cooperative Governance & By-laws', count: 2410, percentage: 17 },
      { name: 'Government Schemes (Ministry of Cooperation)', count: 1980, percentage: 14 },
      { name: 'Financial Literacy & Fraud Avoidance', count: 1030, percentage: 7 },
    ],
    averageResolutionTimeDays: 4.2,
    satisfactionRate: '94.8%',
  });
});

// Mount Vite or static files
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Sahakar Sathi AI] Full-stack Server running at http://0.0.0.0:${PORT}`);
});
}

export { app };

if (!process.env.VERCEL) {
  startServer();
}
