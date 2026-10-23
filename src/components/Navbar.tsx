import React, { useState } from 'react';
import { BankLogo } from './BankLogo';
import { Sparkles, Menu, X, Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface NavbarProps {
  activeView: 'home' | 'dashboard';
  onNavigate: (view: 'home' | 'dashboard', sectionId?: string) => void;
  onOpenEligibility: () => void;
  onOpenEmiCalculator: () => void;
  onOpenCompareBanks: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onNavigate,
  onOpenEligibility,
  onOpenEmiCalculator,
  onOpenCompareBanks,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const handleLinkClick = (action: () => void) => {
    action();
    setMobileMenuOpen(false);
  };

  // Nav item click handlers
  const handleHomeClick = () => {
    onNavigate('home');
  };

  const handleDashboardClick = () => {
    onNavigate('dashboard');
  };

  const handleEligibilityAndRiskClick = () => {
    if (activeView === 'home') {
      onNavigate('dashboard', 'underwriting');
    } else {
      const el = document.getElementById('underwriting');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleEmiClick = () => {
    if (activeView === 'home') {
      onNavigate('dashboard', 'calculator');
    } else {
      const el = document.getElementById('calculator');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHowItWorksClick = () => {
    if (activeView === 'home') {
      onNavigate('dashboard', 'how-it-works');
    } else {
      const el = document.getElementById('how-it-works');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCompareBanksClick = () => {
    if (activeView === 'home') {
      onNavigate('dashboard', 'banks');
    } else {
      const el = document.getElementById('banks');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Brand Logo & Title - Clicking returns to Home */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 shrink-0 text-left cursor-pointer group focus:outline-hidden"
          title="LoanLens - Return to Home"
        >
          <div className="p-1 rounded-xl bg-gradient-to-br from-[#EDE9FE] to-[#E0F2FE] border border-indigo-200/80 shadow-2xs group-hover:scale-105 transition-transform">
            <BankLogo bankId="loanlens" size="sm" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-[#0B192C]">
                Loan<span className="text-teal-600">Lens</span>
              </span>
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider -mt-1">
              {t('brand.tagline', 'Smart Loan Assistance')}
            </span>
          </div>
        </button>

        {/* 6-Item Main Desktop Navigation in Exact Required Order:
            1. Home
            2. Dashboard
            3. Loan Eligibility & Risk
            4. EMI Calculator
            5. How It Works
            6. Compare Banks */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-5 text-xs font-bold text-slate-600">
          {/* 1. Home */}
          <button
            type="button"
            onClick={handleHomeClick}
            className={`py-1.5 px-2.5 rounded-lg transition-colors cursor-pointer ${
              activeView === 'home'
                ? 'text-teal-800 bg-teal-50 font-black'
                : 'hover:text-teal-700'
            }`}
          >
            {t('nav.home', 'Home')}
          </button>

          {/* 2. Dashboard */}
          <button
            type="button"
            onClick={handleDashboardClick}
            className={`py-1.5 px-2.5 rounded-lg transition-colors cursor-pointer ${
              activeView === 'dashboard'
                ? 'text-teal-800 bg-teal-50 font-black'
                : 'hover:text-teal-700'
            }`}
          >
            {t('nav.dashboard', 'Dashboard')}
          </button>

          {/* 3. Loan Eligibility & Risk */}
          <button
            type="button"
            onClick={handleEligibilityAndRiskClick}
            className="py-1.5 px-2.5 rounded-lg hover:text-teal-700 transition-colors whitespace-nowrap cursor-pointer"
          >
            {t('nav.eligibilityAndRisk', 'Loan Eligibility & Risk')}
          </button>

          {/* 4. EMI Calculator */}
          <button
            type="button"
            onClick={handleEmiClick}
            className="py-1.5 px-2.5 rounded-lg hover:text-teal-700 transition-colors whitespace-nowrap cursor-pointer"
          >
            {t('nav.emiCalculator', 'EMI Calculator')}
          </button>

          {/* 5. How It Works */}
          <button
            type="button"
            onClick={handleHowItWorksClick}
            className="py-1.5 px-2.5 rounded-lg hover:text-teal-700 transition-colors whitespace-nowrap cursor-pointer"
          >
            {t('nav.howItWorks', 'How It Works')}
          </button>

          {/* 6. Compare Banks */}
          <button
            type="button"
            onClick={handleCompareBanksClick}
            className="py-1.5 px-2.5 rounded-lg hover:text-teal-700 transition-colors whitespace-nowrap cursor-pointer"
          >
            {t('nav.compareBanks', 'Compare Banks')}
          </button>
        </nav>

        {/* Right Zone: Language Switcher + Single Primary CTA (Check Eligibility) */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Fully Functional English | हिंदी Language Switcher */}
          <div
            className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-bold shadow-2xs"
            role="group"
            aria-label="Language selection"
          >
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-white text-teal-900 shadow-xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Switch to English"
            >
              English
            </button>
            <span className="text-slate-300 px-0.5 select-none font-normal">|</span>
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                language === 'hi'
                  ? 'bg-teal-600 text-white shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="हिंदी में बदलें"
            >
              हिंदी
            </button>
          </div>

          {/* Primary Top-Right Button: "Check Eligibility" */}
          <div className="hidden sm:flex items-center">
            <button
              type="button"
              onClick={onOpenEligibility}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-teal-600 via-[#1E3E62] to-[#0B192C] rounded-xl hover:opacity-95 shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>{t('common.checkEligibility', 'Check Eligibility')}</span>
            </button>
          </div>

          {/* Mobile Hamburger Menu Toggle */}
          <div className="flex lg:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-teal-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 text-sm font-bold shadow-md animate-in fade-in duration-150">
          {/* Mobile Language Switcher */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
              <Languages className="w-4 h-4 text-teal-600" />
              <span>{t('nav.language', 'Language')}</span>
            </span>
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-md transition-all ${
                  language === 'en' ? 'bg-white text-teal-900 font-extrabold shadow-2xs' : 'text-slate-600'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-3 py-1 rounded-md transition-all ${
                  language === 'hi' ? 'bg-teal-600 text-white font-extrabold shadow-2xs' : 'text-slate-600'
                }`}
              >
                हिंदी
              </button>
            </div>
          </div>

          {/* 1. Home */}
          <button
            type="button"
            onClick={() => handleLinkClick(handleHomeClick)}
            className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
              activeView === 'home' ? 'bg-teal-50 text-teal-800' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            {t('nav.home', 'Home')}
          </button>

          {/* 2. Dashboard */}
          <button
            type="button"
            onClick={() => handleLinkClick(handleDashboardClick)}
            className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
              activeView === 'dashboard' ? 'bg-teal-50 text-teal-800' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            {t('nav.dashboard', 'Dashboard')}
          </button>

          {/* 3. Loan Eligibility & Risk */}
          <button
            type="button"
            onClick={() => handleLinkClick(handleEligibilityAndRiskClick)}
            className="w-full text-left px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {t('nav.eligibilityAndRisk', 'Loan Eligibility & Risk')}
          </button>

          {/* 4. EMI Calculator */}
          <button
            type="button"
            onClick={() => handleLinkClick(handleEmiClick)}
            className="w-full text-left px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {t('nav.emiCalculator', 'EMI Calculator')}
          </button>

          {/* 5. How It Works */}
          <button
            type="button"
            onClick={() => handleLinkClick(handleHowItWorksClick)}
            className="w-full text-left px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {t('nav.howItWorks', 'How It Works')}
          </button>

          {/* 6. Compare Banks */}
          <button
            type="button"
            onClick={() => handleLinkClick(handleCompareBanksClick)}
            className="w-full text-left px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {t('nav.compareBanks', 'Compare Banks')}
          </button>

          {/* Primary Action Button in Mobile Drawer: "Check Eligibility" */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => handleLinkClick(onOpenEligibility)}
              className="w-full py-3 text-center text-xs font-bold text-white bg-gradient-to-r from-teal-600 via-[#1E3E62] to-[#0B192C] rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-teal-300" />
              <span>{t('common.checkEligibility', 'Check Eligibility')}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
