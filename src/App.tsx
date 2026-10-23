/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { WelcomePage } from './components/WelcomePage';
import { Hero } from './components/Hero';
import { UnderwritingSection } from './components/UnderwritingSection';
import { EmiStudioSection } from './components/EmiStudioSection';
import { HowItWorks } from './components/HowItWorks';
import { BankShowcaseSection } from './components/BankShowcaseSection';
import { MlQuadDashboardSection } from './components/MlQuadDashboardSection';
import { Footer } from './components/Footer';

// Modals
import { EligibilityModal } from './components/EligibilityModal';
import { RiskPredictionModal } from './components/RiskPredictionModal';
import { EmiCalculatorModal } from './components/EmiCalculatorModal';
import { CreditScoreModal } from './components/CreditScoreModal';
import { CompareBanksModal } from './components/CompareBanksModal';
import { HistoryModal } from './components/HistoryModal';
import { ReportModal } from './components/ReportModal';

// Types & Services
import { ApplicantProfile, PredictionResult } from './types';
import {
  getPredictionHistory,
  clearPredictionHistory,
  deleteHistoryItem,
} from './services/mlPredictor';
import { Check } from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';

export default function App() {
  const { language } = useLanguage();
  // Home is the default page when application opens per user brief
  const [viewMode, setViewMode] = useState<'home' | 'dashboard'>('home');

  // Modal visibility states
  const [isEligibilityOpen, setIsEligibilityOpen] = useState(false);
  const [isRiskOpen, setIsRiskOpen] = useState(false);
  const [isEmiOpen, setIsEmiOpen] = useState(false);
  const [isCreditScoreOpen, setIsCreditScoreOpen] = useState(false);
  const [isCompareBanksOpen, setIsCompareBanksOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Active state data
  const [currentProfile, setCurrentProfile] = useState<Partial<ApplicantProfile>>({
    fullName: 'Rahul Sharma',
    age: 32,
    employmentType: 'salaried',
    workExperienceYears: 6,
    monthlyIncome: 95000,
    coApplicantIncome: 35000,
    existingEmiObligations: 18000,
    cibilScore: 775,
    loanAmountRequested: 4500000,
    tenureYears: 20,
    loanType: 'home',
    priorDefaults: false,
    residentialStatus: 'owned',
  });

  const [scheduleModalParams, setScheduleModalParams] = useState<{
    amount: number;
    rate: number;
    tenure: number;
  }>({
    amount: 4000000,
    rate: 8.75,
    tenure: 20,
  });

  const [selectedReport, setSelectedReport] = useState<PredictionResult | null>(null);
  const [history, setHistory] = useState<PredictionResult[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync history on mount and updates
  const refreshHistory = () => {
    setHistory(getPredictionHistory());
  };

  useEffect(() => {
    refreshHistory();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Unified navigation router
  const handleNavigate = (view: 'home' | 'dashboard', sectionId?: string) => {
    setViewMode(view);
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Transition from eligibility to risk prediction
  const handleProceedToRisk = (profile: ApplicantProfile) => {
    setCurrentProfile(profile);
    setIsEligibilityOpen(false);
    setIsRiskOpen(true);
    showToast(
      language === 'hi'
        ? 'प्रोफ़ाइल डिफ़ॉल्ट जोखिम विश्लेषक में स्थानांतरित की गई'
        : 'Profile transferred to Default Risk Predictor'
    );
  };

  // Open report modal from risk prediction
  const handleOpenReport = (result: PredictionResult) => {
    setSelectedReport(result);
    setIsReportOpen(true);
    refreshHistory();
  };

  // Clear history handler
  const handleClearHistory = () => {
    clearPredictionHistory();
    refreshHistory();
    showToast(
      language === 'hi'
        ? 'पूर्वानुमान इतिहास साफ़ किया गया'
        : 'Prediction history cleared'
    );
  };

  // Delete item handler
  const handleDeleteHistoryItem = (id: string) => {
    deleteHistoryItem(id);
    refreshHistory();
    showToast(language === 'hi' ? 'रिकॉर्ड हटाया गया' : 'Record deleted');
  };

  // Handle open repayment schedule from EmiStudioSection
  const handleOpenSchedule = (amt: number, rt: number, tn: number) => {
    setScheduleModalParams({ amount: amt, rate: rt, tenure: tn });
    setIsEmiOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF5FF]/30 text-slate-900 selection:bg-teal-100 selection:text-teal-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Unified Persistent Top Navigation */}
      <Navbar
        activeView={viewMode}
        onNavigate={handleNavigate}
        onOpenEligibility={() => setIsEligibilityOpen(true)}
        onOpenEmiCalculator={() => setIsEmiOpen(true)}
        onOpenCompareBanks={() => setIsCompareBanksOpen(true)}
      />

      {/* Primary View Routing */}
      {viewMode === 'home' ? (
        <WelcomePage
          onGetStarted={() => handleNavigate('dashboard')}
          onOpenEligibility={() => setIsEligibilityOpen(true)}
          onOpenEmiCalculator={() => setIsEmiOpen(true)}
          onOpenCompareBanks={() => setIsCompareBanksOpen(true)}
          onOpenHowItWorks={() => handleNavigate('dashboard', 'how-it-works')}
        />
      ) : (
        <main className="flex-1">
          {/* Section 1: Dashboard Overview, How LoanLens Helps You, and Saved Assessments */}
          <Hero
            onOpenEligibility={() => setIsEligibilityOpen(true)}
            onOpenEmiCalculator={() => setIsEmiOpen(true)}
            onOpenCompareBanks={() => setIsCompareBanksOpen(true)}
            onOpenReport={handleOpenReport}
            history={history}
            onClearHistory={handleClearHistory}
            onDeleteItem={handleDeleteHistoryItem}
          />

          {/* Section 1.5: 4 Trained ML Models Live Underwriting Suite */}
          <MlQuadDashboardSection
            initialProfile={{
              monthlyIncome: currentProfile.monthlyIncome,
              loanAmount: currentProfile.loanAmountRequested,
              tenureYears: currentProfile.tenureYears,
              cibilScore: currentProfile.cibilScore,
              existingEmis: currentProfile.existingEmiObligations,
              collateralValue: currentProfile.collateralValue,
            }}
            onOpenDetailedReport={() => setIsRiskOpen(true)}
          />

          {/* Section 2: Smart Underwriting & Loan Assessment */}
          <UnderwritingSection
            onOpenEligibility={() => setIsEligibilityOpen(true)}
            onOpenRiskPrediction={() => setIsRiskOpen(true)}
            onOpenCreditScore={() => setIsCreditScoreOpen(true)}
          />

          {/* Section 3: Interactive EMI Studio */}
          <EmiStudioSection onOpenScheduleModal={handleOpenSchedule} />

          {/* Section 4: How It Works */}
          <HowItWorks onOpenEligibility={() => setIsEligibilityOpen(true)} />

          {/* Section 5: Indian Commercial Banks Showcase (Using attached MultiBank Dataset) */}
          <BankShowcaseSection
            onOpenCompareBanks={() => setIsCompareBanksOpen(true)}
            onSelectForEmi={handleOpenSchedule}
          />
        </main>
      )}

      {/* Unified Clean Footer with MultiBank Lenders & Transparency */}
      <Footer
        onNavigateHome={() => handleNavigate('home')}
        onNavigateDashboard={() => handleNavigate('dashboard')}
        onOpenEligibility={() => setIsEligibilityOpen(true)}
        onOpenEmiCalculator={() => setIsEmiOpen(true)}
        onOpenCompareBanks={() => setIsCompareBanksOpen(true)}
      />

      {/* Feature Modals */}
      <EligibilityModal
        isOpen={isEligibilityOpen}
        onClose={() => setIsEligibilityOpen(false)}
        onProceedToRiskPrediction={handleProceedToRisk}
        initialProfile={currentProfile}
      />

      <RiskPredictionModal
        isOpen={isRiskOpen}
        onClose={() => {
          setIsRiskOpen(false);
          refreshHistory();
        }}
        onOpenReport={handleOpenReport}
        prefillProfile={currentProfile}
      />

      <EmiCalculatorModal
        isOpen={isEmiOpen}
        onClose={() => setIsEmiOpen(false)}
        initialAmount={scheduleModalParams.amount}
        initialRate={scheduleModalParams.rate}
        initialTenureYears={scheduleModalParams.tenure}
      />

      <CreditScoreModal
        isOpen={isCreditScoreOpen}
        onClose={() => setIsCreditScoreOpen(false)}
        initialScore={currentProfile.cibilScore || 775}
      />

      <CompareBanksModal
        isOpen={isCompareBanksOpen}
        onClose={() => setIsCompareBanksOpen(false)}
        onSelectForEmi={handleOpenSchedule}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={handleClearHistory}
        onDeleteItem={handleDeleteHistoryItem}
        onSelectReport={(item) => {
          setSelectedReport(item);
          setIsReportOpen(true);
        }}
      />

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        result={selectedReport}
      />
    </div>
  );
}
