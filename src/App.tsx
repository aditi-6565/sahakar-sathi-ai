import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNavigation } from './components/BottomNavigation';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ChatPage } from './pages/ChatPage';
import { CooperativeGovernancePage } from './pages/CooperativeGovernancePage';
import { GovernmentSchemesPage } from './pages/GovernmentSchemesPage';
import { PmfbyPage } from './pages/PmfbyPage';
import { PacsServicesPage } from './pages/PacsServicesPage';
import { FinancialLiteracyPage } from './pages/FinancialLiteracyPage';
import { GrievancePage } from './pages/GrievancePage';
import { VoiceAssistantPage } from './pages/VoiceAssistantPage';
import { HistoryPage } from './pages/HistoryPage';
import { EmergencyContactsPage } from './pages/EmergencyContactsPage';
import { RuralKioskPage } from './pages/RuralKioskPage';
import { AdminKnowledgePage } from './pages/AdminKnowledgePage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { HackathonImpactPage } from './pages/HackathonImpactPage';
import { FloatingChatbot } from './components/FloatingChatbot';
import { VoiceTroubleshooterModal } from './components/VoiceTroubleshooterModal';
import { Shield, Sparkles } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isVoiceTroubleshooterOpen,
    closeVoiceTroubleshooter,
    sendMessage,
  } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'chat':
        return <ChatPage />;
      case 'cooperative':
        return <CooperativeGovernancePage />;
      case 'schemes':
        return <GovernmentSchemesPage />;
      case 'pmfby':
        return <PmfbyPage />;
      case 'pacs':
        return <PacsServicesPage />;
      case 'financial':
        return <FinancialLiteracyPage />;
      case 'grievance':
        return <GrievancePage />;
      case 'voice':
        return <VoiceAssistantPage />;
      case 'history':
        return <HistoryPage />;
      case 'contacts':
        return <EmergencyContactsPage />;
      case 'kiosk':
        return <RuralKioskPage />;
      case 'admin':
        return <AdminKnowledgePage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'impact':
        return <HackathonImpactPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8F5] text-[#1F2937] flex flex-col font-sans">
      <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 max-w-full pb-24 lg:pb-12">
          {renderContent()}
        </main>
      </div>

      <BottomNavigation />

      {/* Floating Chatbot Assistant on Bottom Right Corner */}
      <FloatingChatbot />

      {/* Voice Diagnostics & Troubleshooting Modal */}
      <VoiceTroubleshooterModal
        isOpen={isVoiceTroubleshooterOpen}
        onClose={closeVoiceTroubleshooter}
        onSelectQuery={(q) => {
          sendMessage(q);
          setActiveTab('voice');
        }}
      />

      {/* Official Government Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-xs text-gray-500 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0B6B4F]">सहकार साथी (Sahakar Sathi)</span>
            <span>•</span>
            <span>सहकारिता मंत्रालय, भारत सरकार व राष्ट्रीय सहकारी प्रशिक्षण परिषद (NCCT)</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-gray-500">Ministry of Cooperation • Digital Rural Governance</span>
            <span>•</span>
            <button
              onClick={() => setActiveTab('impact')}
              className="text-[#0B6B4F] hover:underline font-semibold cursor-pointer"
            >
              प्रणाली वास्तुरचना (Architecture & Impact)
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('kiosk')}
              className="text-[#E9A23B] hover:underline font-semibold cursor-pointer"
            >
              ग्रामीण AI किऑस्क (Hardware Kiosk)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
