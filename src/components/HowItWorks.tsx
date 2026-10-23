import React from 'react';
import {
  DoodleWallet,
  DoodleCalculator,
  DoodlePiggyBank,
  DoodleApprovalBadge,
} from './BankingDoodles';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HowItWorksProps {
  onOpenEligibility: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenEligibility }) => {
  const { t } = useLanguage();

  return (
    <section
      id="how-it-works"
      className="py-16 lg:py-24 bg-gradient-to-b from-[#F0F9FF]/60 via-[#F5F3FF] to-[#FFF7ED]/50 border-b border-indigo-100/70"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Headline */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100/80 text-purple-900 border border-purple-200 text-xs font-bold uppercase tracking-wider">
            <span>{t('how.kicker', 'Simple 4-Step Process')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B192C] tracking-tight">
            {t('how.heading', 'How LoanLens Works')}
          </h2>
          <p className="text-sm text-slate-600">
            {t('how.subheading', 'A transparent, reliable guide to help you find and assess the right loan.')}
          </p>
        </div>

        {/* 4 Clear Stages Explaining the Actual User Journey */}
        <div className="space-y-12 lg:space-y-16">
          
          {/* Step 1: Input Profile */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-xs font-mono font-bold">
                STAGE 01
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {t('how.step1Title', '1. Input Financial Profile')}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed max-w-lg">
                {t('how.step1Desc', 'Enter your monthly net income, existing EMIs, desired loan amount, and tenure.')}
              </p>
              <div className="flex flex-wrap gap-3 pt-1 text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {t('common.salaried', 'Salaried')} &amp; {t('common.selfEmployed', 'Self-Employed')}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {t('common.homeLoan', 'Home Loan')} &amp; {t('common.personalLoan', 'Personal Loan')}
                </span>
              </div>
            </div>
            <div className="md:col-span-5">
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#FFF7ED] via-[#FED7AA]/40 to-[#FFEDD5] border border-orange-200 text-center shadow-md">
                <DoodleWallet size={96} className="mx-auto" />
                <h4 className="text-sm font-bold text-orange-950 mt-3">{t('elig.monthlyIncome', 'Net Monthly Income')}</h4>
                <p className="text-[11px] text-orange-800 mt-1">FOIR cash-flow headroom check</p>
              </div>
            </div>
          </div>

          {/* Step 2: Check Loan Eligibility */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 order-2 md:order-1">
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#ECFDF5] via-[#A7F3D0]/40 to-[#D1FAE5] border border-emerald-200 text-center shadow-md">
                <DoodleCalculator size={96} className="mx-auto" />
                <h4 className="text-sm font-bold text-emerald-950 mt-3">{t('elig.foirLabel', 'Your Debt FOIR')}</h4>
                <p className="text-[11px] text-emerald-800 mt-1">RBI debt ratio compliance standard</p>
              </div>
            </div>
            <div className="md:col-span-7 space-y-3 order-1 md:order-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-bold">
                STAGE 02
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {t('how.step2Title', '2. Check Loan Eligibility')}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed max-w-lg">
                {t('how.step2Desc', 'Our engine computes your maximum borrowing headroom based on standard RBI FOIR guidelines.')}
              </p>
            </div>
          </div>

          {/* Step 3: Evaluate Default Risk */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-mono font-bold">
                STAGE 03
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {t('how.step3Title', '3. Evaluate Default Risk')}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed max-w-lg">
                {t('how.step3Desc', 'A supervised machine learning model estimates risk tier and highlights key drivers.')}
              </p>
            </div>
            <div className="md:col-span-5">
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#FAF5FF] via-[#DDD6FE]/40 to-[#EDE9FE] border border-purple-200 text-center shadow-md">
                <DoodlePiggyBank size={96} className="mx-auto" />
                <h4 className="text-sm font-bold text-purple-950 mt-3">{t('risk.defaultProb', 'Probability of Default')}</h4>
                <p className="text-[11px] text-purple-800 mt-1">Supervised risk tier prediction</p>
              </div>
            </div>
          </div>

          {/* Step 4: Compare Banks & Products */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 order-2 md:order-1">
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#FEFCE8] via-[#FEF08A]/40 to-[#FFFBEB] border border-amber-200 text-center shadow-md">
                <DoodleApprovalBadge size={96} className="mx-auto" />
                <h4 className="text-sm font-bold text-amber-950 mt-3">{t('banks.heading', 'Compare Leading Commercial Banks')}</h4>
                <p className="text-[11px] text-amber-800 mt-1">Repayment schedule and lender match</p>
              </div>
            </div>

            <div className="md:col-span-7 space-y-3 order-1 md:order-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-mono font-bold">
                STAGE 04
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {t('how.step4Title', '4. Compare Banks & Products')}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed max-w-lg">
                {t('how.step4Desc', 'Benchmark authentic rates, tenures, and fees across leading Indian commercial banks.')}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenEligibility}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-sm cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>{t('how.cta', 'Check Eligibility Now')}</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
