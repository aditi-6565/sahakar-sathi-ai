import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage, ChatMessage, UserProfile } from '../types';
import { SUPPORTED_LANGUAGES, UI_TRANSLATIONS } from '../utils/translations';
import { sendChatMessage } from '../services/apiService';

interface AppContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  sendMessage: (text: string, category?: string) => Promise<void>;
  isLoadingChat: boolean;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  // Text-To-Speech
  speakText: (text: string, msgId?: string) => void;
  stopSpeech: () => void;
  isSpeaking: boolean;
  currentlySpeakingId: string | null;
  testSpeakerAudio: () => void;
  // Speech-To-Text
  isListening: boolean;
  speechTranscript: string;
  startVoiceInput: (onComplete?: (text: string) => void) => void;
  stopVoiceInput: () => void;
  hasSpeechSupport: boolean;
  voiceError: string | null;
  clearVoiceError: () => void;
  requestMicPermission: () => Promise<boolean>;
  isVoiceTroubleshooterOpen: boolean;
  openVoiceTroubleshooter: () => void;
  closeVoiceTroubleshooter: () => void;
}

const getInitialGreeting = (lang: SupportedLanguage): ChatMessage => {
  const greetings: Record<SupportedLanguage, { text: string; summary: string; whatYouNeed: string; steps: string[]; docs: string[]; whereToGo: string; note: string; disclaimer: string }> = {
    mr: {
      text: 'नमस्ते! मी सहकार साथी AI आहे.\n\nमी आपणास प्राथमिक कृषी पतसंस्था (PACS), शासकीय योजना, पीक विमा (PMFBY), सहकारी कायदे आणि तक्रार निवारणाबाबत अचूक मार्गदर्शन करू शकेन.\n\nखालीलपैकी कोणताही प्रश्न विचारा किंवा मायक्रोफोनवर टॅप करून थेट बोला.',
      summary: 'नमस्ते! मी सहकार साथी AI — सहकारी संस्था, शेती आणि ग्रामीण कल्याणासाठी आपला डिजिटल मार्गदर्शक.',
      whatYouNeed: 'आपली पसंतीची भाषा निवडा आणि कोणताही प्रश्न विचारा किंवा खालीलपैकी विषय निवडा.',
      steps: [
        'आपली वर्गवारी निवडा (पॅक्स, पीक विमा, शासकीय योजना, सहकारी कारभार किंवा कर्ज)',
        'आपल्या भाषेत थेट बोलून किंवा टाईप करून प्रश्न विचारा',
        'तपशीलवार पायऱ्या, कागदपत्रांची यादी आणि सक्षम अधिकाऱ्यांची माहिती मिळवा'
      ],
      docs: ['आधार कार्ड', '७/१२ उतारा किंवा 8A', 'बँक पासबुक प्रत'],
      whereToGo: 'आपल्या ग्रामपंचायत किंवा तालुक्यातील प्राथमिक कृषी पतसंस्था (PACS) किंवा सहाय्यक निबंधक (ARCS) कार्यालय.',
      note: 'ही माहिती केवळ नागरिक मार्गदर्शनासाठी आहे. कायदेशीर किंवा आर्थिक निर्णयापूर्वी अधिकृत कार्यालयाकडून खात्री करावी.',
      disclaimer: 'माहिती केवळ मार्गदर्शनासाठी आहे. कायदेशीर, वित्तीय किंवा विमा संबंधित पाऊल उचलण्यापूर्वी कृपया अधिकृत विभागाशी खात्री करा.',
    },
    hi: {
      text: 'नमस्ते! मैं सहकार साथी AI हूँ।\n\nमैं आपको प्राथमिक कृषि ऋण समितियों (PACS), सरकारी योजनाओं, फसल बीमा (PMFBY), सहकारी नियमों एवं शिकायत निवारण की सटीक जानकारी प्रदान कर सकता हूँ।\n\nनीचे दिए गए प्रश्नों में से चुनें या माइक पर टैप करके अपनी भाषा में पूछें।',
      summary: 'नमस्ते! मैं सहकार साथी AI हूँ — सहकारी समितियों, किसानों और ग्रामीण नागरिकों का डिजिटल साथी।',
      whatYouNeed: 'अपनी भाषा चुनें और कोई भी प्रश्न पूछें अथवा नीचे दिए गए विषयों में से एक चुनें।',
      steps: [
        'अपनी श्रेणी चुनें (पैक्स, फसल बीमा, सरकारी योजनाएं, सहकारी शासन या ऋण)',
        'बोलकर या लिखकर अपनी भाषा में प्रश्न पूछें',
        'चरणबद्ध प्रक्रिया, आवश्यक दस्तावेज एवं सक्षम अधिकारी की जानकारी प्राप्त करें'
      ],
      docs: ['आधार कार्ड', 'खतौनी / जमाबंदी 7/12', 'बैंक पासबुक'],
      whereToGo: 'स्थानीय पैक्स (PACS) समिति अथवा सहायक निबंधक (ARCS) कार्यालय।',
      note: 'यह जानकारी नागरिक मार्गदर्शन हेतु है। किसी भी कानूनी अथवा वित्तीय निर्णय से पूर्व आधिकारिक कार्यालय से पुष्टि करें।',
      disclaimer: 'यह जानकारी केवल मार्गदर्शन हेतु है। किसी भी कानूनी, वित्तीय या प्रशासनिक कार्रवाई से पूर्व संबंधित आधिकारिक विभाग से पुष्टि करें।',
    },
    en: {
      text: 'Namaste! I am Saarthi AI.\n\nI can help you understand cooperative services, government schemes, crop insurance (PMFBY), financial literacy and grievance procedures.\n\nYou can ask me in your preferred language using voice or text.',
      summary: 'Namaste! I am Saarthi AI — your digital companion for cooperatives, agriculture, and rural welfare.',
      whatYouNeed: 'Select your preferred language and ask any question or choose a topic below.',
      steps: [
        'Choose your category (PACS, Crop Insurance, Schemes, Governance, or Loans)',
        'Ask your question in voice or text in any of 8 Indian languages',
        'Review clear step-by-step guidance, checklists, and authorized office contacts'
      ],
      docs: ['Aadhaar Card', 'Land 7/12 or RoR Record', 'Bank Account Passbook'],
      whereToGo: 'Your Gram Panchayat PACS or District Deputy Registrar (DDR) office.',
      note: 'All information is provided for citizen guidance. Always verify with official authorities before legal or financial action.',
      disclaimer: 'Information provided for guidance. Please verify with the relevant official department or cooperative authority before taking legal, financial, insurance, or administrative action.',
    },
    gu: {
      text: 'નમસ્તે! હું સહકાર સાથી AI છું.\n\nહું તમને પેક્સ (PACS), સરકારી યોજનાઓ, પાક વીમો (PMFBY) અને સહકારી નિયમો અંગે તમારી ભાષામાં માર્ગદર્શન આપી શકું છું.\n\nમાઇક પર ટેપ કરીને બોલો અથવા પ્રશ્ન ટાઇપ કરો.',
      summary: 'નમસ્તે! સહકાર સાથી AI — સહકારી મંડળીઓ અને ખેડૂતો માટે તમારો ડિજિટલ સાથી.',
      whatYouNeed: 'તમારી ભાષા પસંદ કરો અને નીચે આપેલા વિષયોમાંથી પ્રશ્ન પૂછો.',
      steps: [
        'તમારી શ્રેણી પસંદ કરો (PACS, પાક વીમો, સરકારી યોજનાઓ)',
        'બોલીને અથવા ટાઇપ કરીને પ્રશ્ન પૂછો',
        'જરૂરી દસ્તાવેજો અને અધિકૃત કાર્યાલયની વિગતો મેળવો'
      ],
      docs: ['આધાર કાર્ડ', '૭/૧૨ અને ૮-અ જમીન ઉતારો', 'બેંક પાસબુક'],
      whereToGo: 'સ્થાનિક પેક્સ (PACS) અથવા સહાયક રજિસ્ટ્રાર કચેરી.',
      note: 'આ માહિતી નાગરિક માર્ગદર્શન માટે છે.',
      disclaimer: 'માહિતી ફક્ત માર્ગદર્શન માટે છે. સત્તાવાર વિભાગ સાથે ચકાસણી કરો.',
    },
    ta: {
      text: 'வணக்கம்! நான் சககார் சாதி AI.\n\nதொடக்க வேளாண்மை கூட்டுறவு சங்கங்கள் (PACS), அரசு திட்டங்கள், பயிர் காப்பீடு (PMFBY) மற்றும் கூட்டுறவு விதிகள் குறித்த தெளிவான வழிகாட்டுதலை உங்கள் மொழியில் வழங்க முடியும்.\n\nமைக் பட்டனை அழுத்தி பேசலாம் அல்லது தட்டச்சு செய்யலாம்.',
      summary: 'வணக்கம்! சககார் சாதி AI — கூட்டுறவு மற்றும் விவசாயிகளுக்கான டிஜிட்டல் உதவியாளர்.',
      whatYouNeed: 'உங்கள் விருப்ப மொழியைத் தேர்ந்தெடுத்து கேள்விகளை கேளுங்கள்.',
      steps: [
        'உங்கள் பிரிவை தேர்ந்தெடுக்கவும் (PACS, பயிர் காப்பீடு, அரசு திட்டங்கள்)',
        'குரல் அல்லது உரை மூலம் கேள்வி கேளுங்கள்',
        'படிநிலைகள், ஆவணங்கள் மற்றும் அதிகாரிகளின் தகவல்களைப் பெறுங்கள்'
      ],
      docs: ['ஆதார் அட்டை', 'பட்டா / சிட்டா ஆவணம்', 'வங்கி பாஸ்புக்'],
      whereToGo: 'கிராம PACS சங்கம் அல்லது வட்டார கூட்டுறவு துணை பதிவாளர் அலுவலகம்.',
      note: 'இந்த தகவல் விழிப்புணர்வு வழிகாட்டலுக்கு மட்டுமே.',
      disclaimer: 'அரசு வழிகாட்டுதலுக்கான தகவல் மட்டுமே. அதிகாரிகளிடம் சரிபார்க்கவும்.',
    },
    te: {
      text: 'నమస్కారం! నేను సహకార సాథి AI ని.\n\nప్రాథమిక వ్యవసాయ సహకార సంఘాలు (PACS), ప్రభుత్వ పథకాలు, పంట బీమా (PMFBY) మరియు సహకార నిబంధనలపై మీ మాతృభాషలో స్పష్టమైన సమాచారం అందించగలను.\n\nమైక్ నొక్కి మాట్లాడండి లేదా టైప్ చేయండి.',
      summary: 'నమస్కారం! సహకార సాథి AI — సహకార సంఘాలు మరియు రైతుల డిజిటల్ మిత్రుడు.',
      whatYouNeed: 'మీ భాషను ఎంచుకుని ఏదైనా ప్రశ్న అడగండి.',
      steps: [
        'మీ విభాగాన్ని ఎంచుకోండి (PACS, పంట బీమా, ప్రభుత్వ పథకాలు)',
        'వాయిస్ లేదా టెక్స్ట్ ద్వారా ప్రశ్న అడగండి',
        'దరఖాస్తు విధానం, పత్రాలు మరియు కార్యాలయ వివరాలు తెలుసుకోండి'
      ],
      docs: ['ఆధార్ కార్డు', '1B / పట్టాదారు పాస్ పుస్తకం', 'బ్యాంకు పాస్ బుక్'],
      whereToGo: 'గ్రామ ప్రాథమిక వ్యవసాయ సహకార సంఘం (PACS) లేదా సహాయ రిజిస్ట్రార్ కార్యాలయం.',
      note: 'ఈ సమాచారం పౌర మార్గదర్శకత్వం కొరకు మాత్రమే.',
      disclaimer: 'సమాచారం మార్గదర్శకత్వం కొరకు మాత్రమే. అధికారిక విభాగంతో నిర్ధారించుకోండి.',
    },
    kn: {
      text: 'ನಮಸ್ಕಾರ! ನಾನು ಸಹಕಾರ ಸಾಥಿ AI.\n\nಪ್ರಾಥಮಿಕ ಕೃಷಿ ಪತ್ತಿನ ಸಹಕಾರ ಸಂಘಗಳು (PACS), ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು, ಬೆಳೆ ವಿಮೆ (PMFBY) ಮತ್ತು ಸಹಕಾರ ನಿಯಮಗಳ ಕುರಿತು ನಿಮ್ಮದೇ ಭಾಷೆಯಲ್ಲಿ ನಿಖರ ಮಾಹಿತಿ ನೀಡಬಲ್ಲೆ.\n\nಮೈಕ್ ಒತ್ತಿ ಮಾತನಾಡಿ ಅಥವಾ ಪ್ರಶ್ನೆ ಟೈಪ್ ಮಾಡಿ.',
      summary: 'ನಮಸ್ಕಾರ! ಸಹಕಾರ ಸಾಥಿ AI — ರೈತರು ಮತ್ತು ಸಹಕಾರ ಸದಸ್ಯರ ಡಿಜಿಟಲ್ ಮಾರ್ಗದರ್ಶಿ.',
      whatYouNeed: 'ನಿಮ್ಮ ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ ಮತ್ತು ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಿ.',
      steps: [
        'ವಿಭಾಗ ಆಯ್ಕೆಮಾಡಿ (PACS, ಬೆಳೆ ವಿಮೆ, ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು)',
        'ಧ್ವನಿ ಅಥವಾ ಪಠ್ಯದ ಮೂಲಕ ಪ್ರಶ್ನೆ ಕೇಳಿ',
        'ಹಂತ-ಹಂತದ ಮಾರ್ಗದರ್ಶನ, ದಾಖಲೆಗಳ ಪಟ್ಟಿ ಪಡೆಯಿರಿ'
      ],
      docs: ['ಆಧಾರ್ ಕಾರ್ಡ್', 'ಪಹಣಿ (RTC) 7/12', 'ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್'],
      whereToGo: 'ಗ್ರಾಮದ PACS ಅಥವಾ ಸಹಾಯಕ ನಿಬಂಧಕರ (ARCS) ಕಚೇರಿ.',
      note: 'ಈ ಮಾಹಿತಿ ಸಾರ್ವಜನಿಕ ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ ಮಾತ್ರ.',
      disclaimer: 'ಮಾಹಿತಿ ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ ಮಾತ್ರ. ಅಧಿಕೃತ ಕಚೇರಿಯಲ್ಲಿ ದೃಢೀಕರಿಸಿ.',
    },
    bn: {
      text: 'নমস্কার! আমি সহকার সাথী AI।\n\nআমি আপনাকে প্রাথমিক কৃষি সমবায় সমিতি (PACS), সরকারি প্রকল্প, ফসল বিমা (PMFBY) এবং সমবায় আইনের বিষয়ে আপনার ভাষায় সঠিক নির্দেশনা দিতে পারি।\n\nমাইকে ট্যাপ করে বলুন অথবা প্রশ্ন লিখুন।',
      summary: 'নমস্কার! আমি সহকার সাথী AI — সমবায় ও কৃষকদের বিশ্বস্ত ডিজিটাল সহায়ক।',
      whatYouNeed: 'আপনার পছন্দের ভাষা নির্বাচন করুন এবং প্রশ্ন করুন।',
      steps: [
        'বিভাগ বেছে নিন (PACS, ফসল বিমা, সরকারি প্রকল্প)',
        'ভয়েস বা টেক্সটের মাধ্যমে প্রশ্ন করুন',
        'প্রয়োজনীয় নথিপত্র এবং অফিসিয়াল যোগাযোগের তথ্য পান'
      ],
      docs: ['আধার কার্ড', 'জমির পরচা (RoR)', 'ব্যাঙ্ক পাসবই'],
      whereToGo: 'স্থানীয় PACS অথবা সহকারী নিবন্ধকের কার্যালয় (ARCS)।',
      note: 'এই তথ্য কেবলমাত্র নির্দেশনামূলক সহায়তার জন্য।',
      disclaimer: 'তথ্য নির্দেশনামূলক। যেকোনো পদক্ষেপ নেওয়ার আগে সংশ্লিষ্ট সরকারি দপ্তরের সাথে যাচাই করুন।',
    },
  };

  const g = greetings[lang] || greetings.mr;

  return {
    id: 'init-1',
    sender: 'ai',
    text: g.text,
    structuredAnswer: {
      summary: g.summary,
      whatYouNeed: g.whatYouNeed,
      steps: g.steps,
      documents: g.docs,
      whereToGo: g.whereToGo,
      importantNote: g.note,
    },
    sourceMeta: {
      isAiGenerated: false,
      modelUsed: 'Saarthi Grounded Knowledge Engine',
      sources: ['Ministry of Cooperation & PMFBY Guidelines'],
      isVerified: true,
      mode: 'Grounded Prototype Engine',
    },
    disclaimer: g.disclaimer,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    language: lang,
  };
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialUserProfile: UserProfile = {
  name: 'Ramesh Patil',
  role: 'Farmer / Cooperative Member',
  village: 'Dindori',
  district: 'Nashik',
  state: 'Maharashtra',
  kisanId: 'MH-NSK-2024-8841',
  pacsMembershipId: 'PACS-DIN-042',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('mr');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isLoadingChat, setIsLoadingChat] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);

  // Audio Speech state
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // STT state
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechTranscript, setSpeechTranscript] = useState<string>('');
  const [hasSpeechSupport, setHasSpeechSupport] = useState<boolean>(true);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  // Mutable refs to prevent stale closure bugs in SpeechRecognition event listeners
  const transcriptRef = React.useRef<string>('');
  const onCompleteRef = React.useRef<((text: string) => void) | null>(null);
  const recognitionRef = React.useRef<any>(null);
  const resumeTimerRef = React.useRef<any>(null);

  // Initial greeting
  const [messages, setMessages] = useState<ChatMessage[]>([getInitialGreeting('mr')]);
  const [isVoiceTroubleshooterOpen, setIsVoiceTroubleshooterOpen] = useState<boolean>(false);

  const openVoiceTroubleshooter = () => setIsVoiceTroubleshooterOpen(true);
  const closeVoiceTroubleshooter = () => setIsVoiceTroubleshooterOpen(false);

  // Translation helper
  const t = (key: string): string => {
    return UI_TRANSLATIONS[language]?.[key] || UI_TRANSLATIONS.en[key] || key;
  };

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'init-1') {
        return [getInitialGreeting(lang)];
      }
      return prev;
    });
  };

  // Add Message
  const addMessage = (msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  };

  // Send Chat Message to Server
  const sendMessage = async (text: string, category: string = 'All') => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language,
      category,
    };
    addMessage(userMsg);
    setIsLoadingChat(true);

    try {
      const langConfig = SUPPORTED_LANGUAGES.find((l) => l.code === language);
      const res = await sendChatMessage(text, langConfig?.label || 'English', category, messages);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        structuredAnswer: res.answer,
        sourceMeta: res.sourceMeta,
        disclaimer: res.disclaimer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language,
        category,
      };
      addMessage(aiMsg);
    } catch (err: any) {
      console.error('Failed to get answer:', err);
      // Fallback friendly message for rural user
      addMessage({
        id: `ai-${Date.now()}`,
        sender: 'ai',
        structuredAnswer: {
          summary: 'काहीतरी त्रुटी आली आहे. कृपया आपला प्रश्न पुन्हा विचारा.',
          steps: ['इंटरनेट कनेक्शन तपासा', 'पुन्हा प्रयत्न करा'],
          whereToGo: 'स्थानिक पॅक्स (PACS) कार्यालय किंवा टोल-फ्री १४४४७ वर संपर्क साधा.',
          importantNote: 'कृपया थोड्या वेळाने पुन्हा विचारून पहा.',
        },
        disclaimer: 'Information provided for guidance. Please verify with official authorities.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language,
      });
    } finally {
      setIsLoadingChat(false);
    }
  };

  // Text-To-Speech (Web Speech API)
  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
      setIsSpeaking(false);
      setCurrentlySpeakingId(null);
      if (resumeTimerRef.current) {
        clearInterval(resumeTimerRef.current);
        resumeTimerRef.current = null;
      }
    }
  };

  const speakText = (text: string, msgId?: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported on this browser.');
      setVoiceError(
        language === 'mr'
          ? 'या ब्राउझरमध्ये ऑडिओ प्लेबॅक समर्थित नाही.'
          : language === 'hi'
          ? 'इस ब्राउज़र में ऑडियो प्लेबैक समर्थित नहीं है।'
          : 'Audio playback is not supported in this browser.'
      );
      return;
    }

    stopSpeech();

    // Clean text: remove asterisks, markdown, brackets, URLs
    const cleanText = text
      .replace(/[\*\#\_\~\[\]\(\)]/g, ' ')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    try {
      // Resume in case speech synthesis was paused
      window.speechSynthesis.resume();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const langConfig = SUPPORTED_LANGUAGES.find((l) => l.code === language);
      const targetSpeechCode = langConfig?.speechCode || 'hi-IN';
      utterance.lang = targetSpeechCode;
      utterance.rate = 0.95; // Clear natural pace for rural listeners
      utterance.pitch = 1.0;

      // Select matching voice if available
      const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const langPrefix = targetSpeechCode.split('-')[0].toLowerCase();
        const matchedVoice =
          voices.find((v) => v.lang.toLowerCase() === targetSpeechCode.toLowerCase()) ||
          voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix)) ||
          voices.find((v) => v.lang.toLowerCase().includes('in')) ||
          voices[0];

        if (matchedVoice) {
          utterance.voice = matchedVoice;
        }
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        if (msgId) setCurrentlySpeakingId(msgId);
        setVoiceError(null);

        // Chrome bug workaround: speechSynthesis can pause after ~15s on long texts
        if (resumeTimerRef.current) clearInterval(resumeTimerRef.current);
        resumeTimerRef.current = setInterval(() => {
          if (window.speechSynthesis.speaking) {
            window.speechSynthesis.resume();
          } else {
            clearInterval(resumeTimerRef.current);
            resumeTimerRef.current = null;
          }
        }, 8000);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setCurrentlySpeakingId(null);
        if (resumeTimerRef.current) {
          clearInterval(resumeTimerRef.current);
          resumeTimerRef.current = null;
        }
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis error:', e);
        setIsSpeaking(false);
        setCurrentlySpeakingId(null);
        if (resumeTimerRef.current) {
          clearInterval(resumeTimerRef.current);
          resumeTimerRef.current = null;
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch (err: any) {
      console.warn('Could not speak text:', err);
      setIsSpeaking(false);
      setCurrentlySpeakingId(null);
    }
  };

  const testSpeakerAudio = () => {
    const greetingMap: Record<SupportedLanguage, string> = {
      mr: 'नमस्कार! सहकार साथी आवाज सहाय्यक सक्रिय आहे. आपण बोलून किंवा ऐकून मार्गदर्शन घेऊ शकता.',
      hi: 'नमस्ते! सहकार साथी वॉइस सहायक सक्रिय है। आप बोलकर या सुनकर जानकारी प्राप्त कर सकते हैं।',
      en: 'Namaste! Sahakar Sathi voice assistant is active. You can speak or listen to guidance.',
      gu: 'નમસ્તે! સહકાર સાથી વૉઇસ સહાયક સક્રિય છે.',
      ta: 'வணக்கம்! சககார் சாதி குரல் உதவி அமைப்பு செயல்படுகிறது.',
      te: 'నమస్కారం! సహకార సాథి వాయిస్ అసిస్టెంట్ సక్రియంగా ఉంది.',
      kn: 'ನಮಸ್ಕಾರ! ಸಹಕಾರ ಸಾಥಿ ಧ್ವನಿ ಸಹಾಯಕ ಸಕ್ರಿಯವಾಗಿದೆ.',
      bn: 'নমস্কার! সহকার সাথী ভয়েস সহকারী সক্রিয় আছে।',
    };
    speakText(greetingMap[language] || greetingMap.mr, 'test-speaker');
  };

  // Load voices on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          setAvailableVoices(voices);
        }
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setHasSpeechSupport(Boolean(SpeechRecognition));
  }, []);

  const requestMicPermission = async (): Promise<boolean> => {
    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
        setVoiceError(null);
        return true;
      }
      return true;
    } catch (err: any) {
      console.warn('Microphone permission request error:', err);
      const isDenied = err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError';
      if (isDenied) {
        setVoiceError(
          language === 'mr'
            ? 'मायक्रोफोन परवानगी नाकारली आहे. कृपया ब्राउझरच्या ॲड्रेस बारमधील कुलूप (Lock) किंवा साइट सेटिंग्ज आयकॉनवर क्लिक करून "Microphone: Allow" करा.'
            : language === 'hi'
            ? 'माइक्रोफ़ोन अनुमति अस्वीकृत है। कृपया ब्राउज़र के एड्रेस बार में लॉक आइकन पर क्लिक करके "Microphone: Allow" करें।'
            : 'Microphone permission blocked. Please click the Lock or Site Settings icon in your browser address bar and set Microphone to "Allow".'
        );
      }
      return false;
    }
  };

  const startVoiceInput = (onComplete?: (text: string) => void) => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setHasSpeechSupport(false);
      setVoiceError(
        language === 'mr'
          ? 'या ब्राउझरमध्ये स्पीच रेकग्निशन समर्थित नाही. कृपया Google Chrome किंवा Microsoft Edge वापरा, किंवा खाली दिलेले नमुना प्रश्न निवडा.'
          : language === 'hi'
          ? 'इस ब्राउज़र में स्पीच पहचान समर्थित नहीं है। कृपया Chrome या Edge का उपयोग करें, या नीचे दिए गए प्रश्न चुनें।'
          : 'Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge, or choose from the suggested questions below.'
      );
      return;
    }

    // Stop any existing session
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (err) {
        // ignore
      }
      recognitionRef.current = null;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      const langConfig = SUPPORTED_LANGUAGES.find((l) => l.code === language);
      recognition.lang = langConfig?.speechCode || 'mr-IN';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      // Reset state and refs
      transcriptRef.current = '';
      onCompleteRef.current = onComplete || null;
      setSpeechTranscript('');
      setVoiceError(null);
      setIsListening(true);

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError(null);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const item = event.results[i];
          const text = item[0]?.transcript || '';
          if (item.isFinal) {
            final += text;
          } else {
            interim += text;
          }
        }

        const combined = (final || interim).trim();
        if (combined) {
          transcriptRef.current = combined;
          setSpeechTranscript(combined);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error event:', event.error);
        setIsListening(false);

        if (event.error === 'not-allowed') {
          setVoiceError(
            language === 'mr'
              ? 'मायक्रोफोन परवानगी नाकारली गेली आहे. कृपया ब्राउझरच्या ॲड्रेस बारमधील कुलूप (Lock) आयकॉनवर क्लिक करून मायक्रोफोनला परवानगी द्या.'
              : language === 'hi'
              ? 'माइक्रोफ़ोन अनुमति नहीं दी गई है। कृपया एड्रेस बार में लॉक आइकन पर क्लिक करके माइक की अनुमति दें।'
              : 'Microphone permission denied. Please click the lock icon in your browser address bar to allow microphone access.'
          );
        } else if (event.error === 'no-speech') {
          setVoiceError(
            language === 'mr'
              ? 'कोणताही आवाज ऐकू आला नाही. कृपया मायक्रोफोनजवळ येऊन स्पष्ट बोला.'
              : language === 'hi'
              ? 'कोई आवाज़ सुनाई नहीं दी। कृपया माइक के पास आकर स्पष्ट बोलें।'
              : 'No speech was detected. Please tap the mic again and speak clearly.'
          );
        } else if (event.error === 'network') {
          setVoiceError(
            language === 'mr'
              ? 'स्पीच सेवेसाठी इंटरनेट कनेक्शन उपलब्ध नाही. कृपया नेटवर्क तपासा किंवा मजकूर टाईप करा.'
              : language === 'hi'
              ? 'स्पीच सेवा के लिए इंटरनेट उपलब्ध नहीं है। कृपया नेटवर्क जांचें या टाइप करें।'
              : 'Network error connecting to speech services. Please check your internet connection or type your question.'
          );
        } else if (event.error === 'service-not-allowed') {
          setVoiceError(
            language === 'mr'
              ? 'ब्राउझरची स्पीच सेवा अवरोधित आहे. कृपया Chrome किंवा Edge वापरा किंवा खाली दिलेले प्रश्न निवडा.'
              : language === 'hi'
              ? 'ब्राउज़र की स्पीच सेवा अवरुद्ध है। कृपया Chrome/Edge का उपयोग करें या प्रश्न चुनें।'
              : 'Speech service blocked by browser. Please use Chrome/Edge or select a question below.'
          );
        } else if (event.error === 'audio-capture') {
          setVoiceError(
            language === 'mr'
              ? 'मायक्रोफोन उपकरण सापडले नाही. कृपया हेडफोन किंवा माइक जोडलेला आहे का ते तपासा.'
              : language === 'hi'
              ? 'माइक्रोफ़ोन डिवाइस नहीं मिला। कृपया हेडफ़ोन या माइक की जांच करें।'
              : 'No microphone device found. Please ensure a microphone or headset is connected.'
          );
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        const captured = transcriptRef.current.trim();
        if (captured && onCompleteRef.current) {
          const cb = onCompleteRef.current;
          onCompleteRef.current = null;
          cb(captured);
        }
      };

      recognition.start();
    } catch (e: any) {
      console.warn('Could not start recognition instance:', e);
      setIsListening(false);
      setVoiceError(
        language === 'mr'
          ? 'मायक्रोफोन सुरू करता आला नाही. कृपया परवानगी तपासा किंवा पुन्हा प्रयत्न करा.'
          : language === 'hi'
          ? 'माइक्रोफ़ोन प्रारंभ नहीं हो सका। कृपया पुनः प्रयास करें।'
          : 'Could not start microphone. Please check permissions and try again.'
      );
    }
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        // ignore
      }
      setIsListening(false);

      const captured = transcriptRef.current.trim();
      if (captured && onCompleteRef.current) {
        const cb = onCompleteRef.current;
        onCompleteRef.current = null;
        cb(captured);
      }
    }
  };

  const clearVoiceError = () => {
    setVoiceError(null);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        activeTab,
        setActiveTab,
        messages,
        addMessage,
        sendMessage,
        isLoadingChat,
        userProfile,
        setUserProfile,
        speakText,
        stopSpeech,
        isSpeaking,
        currentlySpeakingId,
        testSpeakerAudio,
        isListening,
        speechTranscript,
        startVoiceInput,
        stopVoiceInput,
        hasSpeechSupport,
        voiceError,
        clearVoiceError,
        requestMicPermission,
        isVoiceTroubleshooterOpen,
        openVoiceTroubleshooter,
        closeVoiceTroubleshooter,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
