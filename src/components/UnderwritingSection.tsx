import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Activity, BarChart3 } from 'lucide-react';
import {
  DoodleCalculator,
  DoodleWallet,
} from './BankingDoodles';
import { useLanguage } from '../contexts/LanguageContext';

interface UnderwritingSectionProps {
  onOpenEligibility: () => void;
  onOpenRiskPrediction: () => void;
  onOpenCreditScore: () => void;
}

export const UnderwritingSection: React.FC<UnderwritingSectionProps> = ({
  onOpenEligibility,
  onOpenRiskPrediction,
  onOpenCreditScore,
}) => {
  const { t } = useLanguage();
  const [previewScore, setPreviewScore] = useState<number>(765);

  const getScoreBadge = (s: number) => {
    if (s >= 780) return { label: t('cibilModal.bandExcellent', 'Excellent (780 - 900)'), bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    if (s >= 720) return { label: t('cibilModal.bandGood', 'Good (720 - 779)'), bg: 'bg-teal-100 text-teal-800 border-teal-200' };
    if (s >= 660) return { label: t('cibilModal.bandFair', 'Fair (650 - 719)'), bg: 'bg-amber-100 text-amber-800 border-amber-200' };
    return { label: t('cibilModal.bandPoor', 'Needs Repair (< 650)'), bg: 'bg-rose-100 text-rose-800 border-rose-200' };
  };

  const badge = getScoreBadge(previewScore);
  const needleAngle = -90 + ((previewScore - 300) / 600) * 180;

  return (
    <section
      id="underwriting"
      className="py-16 lg:py-24 bg-gradient-to-b from-[#FAF5FF] via-[#F0FDF4]/70 to-[#FFF7ED]/50 border-b border-emerald-100/70"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-900 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
            <span>{t('underwriting.kicker', 'Analytical Credit Assessment')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B192C] tracking-tight">
            {t('underwriting.heading', 'Loan Eligibility & Risk Assessment')}
          </h2>
          <p className="text-sm text-slate-600">
            {t('underwriting.subheading', 'Analyze your borrowing capacity using standard RBI FOIR guidelines alongside machine learning risk estimation.')}
          </p>
        </div>

        {/* Split Section: Text & Explanations Left / Interactive Bureau Diagnosis Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Two Clear Feature Pillars (Pillar 1: FOIR Eligibility, Pillar 2: ML Risk) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Pillar 1: RBI FOIR Norms in Soft Mint */}
            <div className="p-6 rounded-3xl bg-white border border-emerald-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-3 right-4 opacity-30 pointer-events-none">
                <DoodleWallet size={52} />
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{t('underwriting.tabFoir', '1. FOIR Capacity (Regulatory Limits)')}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                {t('underwriting.foirCardTitle', 'Fixed Obligation to Income Ratio (FOIR)')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-md">
                {t('underwriting.foirDesc', 'Fixed Obligation to Income Ratio (FOIR) limits total debt EMIs to 40%–55% of net monthly income to prevent over-indebtedness.')}
              </p>
              <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-mono font-semibold text-emerald-800">
                  {t('elig.foirLimit', 'Safe FOIR Benchmark: <= 50%')}
                </span>
                <button
                  type="button"
                  onClick={onOpenEligibility}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-2xs cursor-pointer"
                >
                  <span>{t('underwriting.openEligibilityBtn', 'Test Your Loan Eligibility')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Pillar 2: Machine Learning Risk Assessment in Soft Lavender */}
            <div className="p-6 rounded-3xl bg-white border border-purple-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-3 right-4 opacity-30 pointer-events-none">
                <DoodleCalculator size={52} />
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-purple-800 mb-1">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span>{t('risk.modalTitle', 'Machine Learning Risk Assessment')}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                {t('underwriting.mlCardTitle', 'Supervised ML Risk Predictor')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-md">
                {t('underwriting.mlCardDesc', 'A supervised logistic regression and decision tree classifier estimating default probability tier and key risk drivers.')}
              </p>
              <div className="mt-4 pt-3 border-t border-purple-100 flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-mono font-semibold text-purple-800">
                  {t('home.card1Title', 'Loan Eligibility & Risk')}
                </span>
                <button
                  type="button"
                  onClick={onOpenRiskPrediction}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl transition-colors shadow-2xs cursor-pointer"
                >
                  <span>{t('underwriting.openRiskBtn', 'Simulate ML Default Risk')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Bureau Score Sensitivity Tester */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-lg space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {t('cibilModal.title', 'CIBIL Bureau Simulator & Interest Sensitivity')}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {t('underwriting.tabCibil', '2. CIBIL Bureau Tier')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onOpenCreditScore}
                  className="text-xs font-bold text-teal-700 hover:underline cursor-pointer"
                >
                  {t('underwriting.openCibilBtn', 'Explore CIBIL Score Impact')} →
                </button>
              </div>

              {/* Gauge Graphic */}
              <div className="flex flex-col items-center justify-center pt-2">
                <div className="relative w-48 h-24 overflow-hidden flex items-end justify-center">
                  <svg className="w-48 h-48 -mb-24" viewBox="0 0 200 200">
                    {/* Outer meter track */}
                    <path
                      d="M 20 100 A 80 80 0 0 1 180 100"
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="18"
                      strokeLinecap="round"
                    />
                    {/* Colored sectors */}
                    <path
                      d="M 20 100 A 80 80 0 0 1 60 40"
                      fill="none"
                      stroke="#FDA4AF"
                      strokeWidth="18"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 60 40 A 80 80 0 0 1 140 40"
                      fill="none"
                      stroke="#FEF08A"
                      strokeWidth="18"
                    />
                    <path
                      d="M 140 40 A 80 80 0 0 1 180 100"
                      fill="none"
                      stroke="#6EE7B7"
                      strokeWidth="18"
                      strokeLinecap="round"
                    />
                    {/* Center needle */}
                    <g
                      transform={`rotate(${needleAngle} 100 100)`}
                      className="transition-transform duration-300"
                    >
                      <line x1="100" y1="100" x2="100" y2="35" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />
                      <circle cx="100" cy="100" r="8" fill="#0F172A" />
                    </g>
                  </svg>
                </div>

                <div className="text-center mt-3">
                  <span className="text-3xl font-black font-mono text-[#0B192C]">{previewScore}</span>
                  <span className="text-xs text-slate-400 font-mono ml-1">/ 900</span>
                  <div className="mt-1">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${badge.bg}`}>
                      {badge.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Slider to interact */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-medium text-slate-600">
                  <span>{t('cibilModal.scoreLabel', 'Simulated CIBIL Score')}</span>
                  <span className="font-mono font-bold text-teal-800">{previewScore}</span>
                </div>
                <input
                  type="range"
                  min={300}
                  max={900}
                  step={5}
                  value={previewScore}
                  onChange={(e) => setPreviewScore(Number(e.target.value))}
                  className="w-full accent-teal-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>300 (Subprime)</span>
                  <span>750 (Benchmark)</span>
                  <span>900 (Prime)</span>
                </div>
              </div>

              {/* Spread Impact Note */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                <p className="text-[11px] leading-relaxed">
                  {t('cibilModal.spreadTip', 'Borrowers in the 780+ band typically save ₹3–₹7 Lakhs in lifetime interest on a 20-year home loan.')}
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
