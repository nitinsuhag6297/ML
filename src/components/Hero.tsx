import React from 'react';
import {
  ShieldCheck,
  Calculator,
  Landmark,
  ArrowRight,
  FileText,
  Trash2,
  Sparkles,
  Layers,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { formatINR } from '../services/mlPredictor';
import { PredictionResult } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface HeroProps {
  onOpenEligibility: () => void;
  onOpenEmiCalculator?: () => void;
  onOpenCompareBanks?: () => void;
  onOpenReport?: (item: PredictionResult) => void;
  history?: PredictionResult[];
  onClearHistory?: () => void;
  onDeleteItem?: (id: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenEligibility,
  onOpenEmiCalculator,
  onOpenCompareBanks,
  onOpenReport,
  history = [],
  onClearHistory,
  onDeleteItem,
}) => {
  const { t, language } = useLanguage();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="overview"
      className="relative bg-gradient-to-b from-[#F5F3FF]/70 via-[#F0F9FF]/50 to-white pt-8 pb-16 border-b border-indigo-100/70"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Dashboard Header Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Layers className="w-3.5 h-3.5 text-teal-600" />
              <span>{t('brand.name', 'LoanLens')} · {t('dash.title', 'Financial Dashboard')}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#0B192C] tracking-tight">
              {t('dash.title', 'Financial Dashboard')}
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              {t('dash.subtitle', 'Centralized workspace to assess eligibility, plan repayment schedules, and benchmark lender offerings.')}
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenEligibility}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-teal-600 to-[#0B192C] rounded-xl hover:opacity-95 shadow-xs transition-all cursor-pointer shrink-0 self-start md:self-auto"
          >
            <Sparkles className="w-4 h-4 text-teal-300" />
            <span>{t('common.checkEligibility', 'Check Eligibility')}</span>
          </button>
        </div>

        {/* 3 Quick-Access Tool Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 1. Check Eligibility */}
          <div
            onClick={onOpenEligibility}
            className="p-5 rounded-2xl bg-white border border-teal-200 shadow-2xs hover:shadow-md hover:border-teal-400 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-[#0B192C]">
                {t('nav.eligibilityAndRisk', 'Loan Eligibility & Risk')}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t('underwriting.foirDesc', 'Calculate debt-to-income limits against RBI FOIR standards and simulate statistical default risk.')}
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-teal-700 group-hover:text-teal-900">
              <span>{t('common.checkEligibility', 'Check Eligibility')}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. EMI Calculator */}
          <div
            onClick={() => {
              if (onOpenEmiCalculator) onOpenEmiCalculator();
              else scrollToSection('calculator');
            }}
            className="p-5 rounded-2xl bg-white border border-indigo-200 shadow-2xs hover:shadow-md hover:border-indigo-400 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Calculator className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-[#0B192C]">
                {t('emi.heading', 'EMI Calculator & Repayment Planner')}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t('emi.subheading', 'Real-time reducing balance repayment schedule. Adjust loan variables below to evaluate your monthly obligations.')}
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-indigo-700 group-hover:text-indigo-900">
              <span>{t('common.calculateEmi', 'Calculate EMI')}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3. Compare Banks */}
          <div
            onClick={() => {
              if (onOpenCompareBanks) onOpenCompareBanks();
              else scrollToSection('banks');
            }}
            className="p-5 rounded-2xl bg-white border border-amber-200 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Landmark className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-[#0B192C]">
                {t('banks.heading', 'Compare Leading Commercial Banks')}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t('banks.subheading', 'Directly queried from 184+ benchmark loan schemes across State Bank of India, HDFC Bank, ICICI Bank, Axis Bank, and BoB.')}
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-amber-700 group-hover:text-amber-900">
              <span>{t('common.compareBanks', 'Compare Banks')}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* "How LoanLens Helps You" Card
            Replaces static Rahul Sharma borrower preview with factual explanation of real features */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#0B192C]">
                {t('dash.howHelpsTitle', 'How LoanLens Helps You')}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('dash.howHelpsSubtitle', 'Independent, transparent tools built to help you navigate retail lending with clarity.')}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{t('home.stat3Label', 'Transparent Calculations')}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="space-y-2 p-4 rounded-2xl bg-teal-50/50 border border-teal-100">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                {t('dash.helpFeature1Title', 'Compare Available Loan Options')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('dash.helpFeature1Desc', 'Search and benchmark 184+ authentic loan schemes from leading Indian commercial banks, with transparent interest rates and processing fees.')}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="space-y-2 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                {t('dash.helpFeature2Title', 'Estimate EMI & Repayment Planner')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('dash.helpFeature2Desc', 'Accurately compute monthly installments and view full year-by-year reducing balance repayment schedules, with prepayment savings simulations.')}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="space-y-2 p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                {t('dash.helpFeature3Title', 'Check Real-Time Loan Eligibility')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('dash.helpFeature3Desc', 'Assess your maximum borrowing limit using RBI FOIR debt ratios and evaluate default risk probability before applying.')}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Assessments / Saved Results Section (Only genuine records from browser storage) */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-base font-black text-[#0B192C]">
                {t('dash.recentHeading', 'Recent Saved Assessments')}
              </h3>
              <p className="text-xs text-slate-500">
                {t('dash.recentSubtitle', 'Evaluations saved locally in your current browser session.')}
              </p>
            </div>

            {history.length > 0 && onClearHistory && (
              <button
                type="button"
                onClick={onClearHistory}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t('dash.clearAll', 'Clear Saved History')}</span>
              </button>
            )}
          </div>

          {history.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{item.applicantName}</h4>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                          {item.loanType} Loan · ID: {item.id.slice(-6)}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.riskCategory === 'Low Risk'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.riskCategory === 'Moderate Risk'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {item.riskCategory}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div>
                        <span className="text-slate-400 block text-[10px]">{t('emi.loanAmount', 'Loan Amount')}</span>
                        <span className="font-mono font-bold text-slate-900">{formatINR(item.requestedAmount)}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">{t('elig.cibil', 'CIBIL Score')}</span>
                        <span className="font-mono font-bold text-slate-900">{item.cibilScore}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {new Date(item.timestamp).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </span>
                    <div className="flex items-center gap-2">
                      {onDeleteItem && (
                        <button
                          type="button"
                          onClick={() => onDeleteItem(item.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onOpenReport && (
                        <button
                          type="button"
                          onClick={() => onOpenReport(item)}
                          className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{t('common.viewReport', 'View Dossier')}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">
                  {t('dash.recentEmptyTitle', 'No Recent Assessments Saved Yet')}
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  {t('dash.recentEmptyDesc', 'Run your first loan eligibility or risk check to save records locally in your browser sandbox.')}
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenEligibility}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                <span>{t('dash.startAssessmentBtn', 'Check Loan Eligibility')}</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
