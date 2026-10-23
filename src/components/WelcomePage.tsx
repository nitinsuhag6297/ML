import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Calculator,
  Building2,
  CheckCircle2,
  Landmark,
  ChevronRight,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface WelcomePageProps {
  onGetStarted: () => void;
  onOpenEligibility: () => void;
  onOpenEmiCalculator: () => void;
  onOpenCompareBanks: () => void;
  onOpenHowItWorks: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  onGetStarted,
  onOpenEligibility,
  onOpenEmiCalculator,
  onOpenCompareBanks,
  onOpenHowItWorks,
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex-1 bg-gradient-to-b from-[#F8FAFC] via-[#F1F5F9]/70 to-[#FAF5FF]/40 text-slate-800">
      {/* Hero Welcome Section */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Headline, Description & ONLY Get Started Action Button */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Three Value Highlights */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/90 text-xs font-bold text-teal-800 shadow-2xs">
                  <Building2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>{t('home.badge1', 'Multi-Bank Comparison')}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/90 text-xs font-bold text-indigo-800 shadow-2xs">
                  <Calculator className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{t('home.badge2', 'Instant EMI Calculator')}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/90 text-xs font-bold text-amber-800 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t('home.badge3', 'Smart Eligibility & Risk Check')}</span>
                </span>
              </div>

              {/* Exact Homepage Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0B192C] tracking-tight leading-[1.12]">
                {t('home.headlinePre', 'Find the Right Loan')}{' '}
                <br />
                <span className="bg-gradient-to-r from-teal-600 via-teal-700 to-[#1E3E62] bg-clip-text text-transparent">
                  {t('home.headlinePost', 'for You')}
                </span>
              </h1>

              {/* Exact Homepage Description */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                {t('home.description', 'Explore loan options, compare banks, calculate your EMI, and check your loan eligibility — all in one place.')}
              </p>

              {/* Only the "Get Started" Button (Adjacent Compare Banks removed per specification) */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onGetStarted}
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-base font-extrabold text-white bg-gradient-to-r from-teal-600 via-teal-700 to-[#0B192C] rounded-2xl shadow-md hover:shadow-lg hover:opacity-95 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>{t('common.getStarted', 'Get Started')}</span>
                  <ArrowRight className="w-5 h-5 text-teal-200" />
                </button>
              </div>

              {/* Consumer Trust Checklist */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('home.trust1', '184+ authentic lender schemes (SBI, HDFC, ICICI, BoB & more)')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('home.trust2', 'Reducing-balance EMI repayment schedule')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('home.trust3', 'RBI FOIR debt headroom and default risk prediction')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('home.trust4', '100% private in-browser evaluation with zero signup')}</span>
                </div>
              </div>
            </div>

            {/* Centre-Right: Creative Hero Visual Card */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-full max-w-md mx-auto">

                {/* Layered ambient glows */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-teal-200/50 via-sky-200/30 to-indigo-200/40 rounded-[2rem] blur-2xl pointer-events-none" />
                <div className="absolute -inset-1 bg-gradient-to-bl from-teal-100/60 via-white/20 to-indigo-100/50 rounded-[2rem] blur-lg pointer-events-none" />

                {/* Decorative sparkle dots — top-left */}
                <div className="absolute -top-3 -left-3 w-5 h-5 rounded-full bg-teal-400/70 shadow-lg shadow-teal-300/50 z-10" />
                <div className="absolute top-2 left-5 w-2.5 h-2.5 rounded-full bg-indigo-300/80 z-10" />
                <div className="absolute -top-1 left-12 w-1.5 h-1.5 rounded-full bg-teal-500/60 z-10" />

                {/* Decorative sparkle dots — bottom-right */}
                <div className="absolute -bottom-3 -right-3 w-5 h-5 rounded-full bg-indigo-400/70 shadow-lg shadow-indigo-300/50 z-10" />
                <div className="absolute bottom-2 right-5 w-2.5 h-2.5 rounded-full bg-teal-300/80 z-10" />
                <div className="absolute -bottom-1 right-12 w-1.5 h-1.5 rounded-full bg-amber-400/70 z-10" />

                {/* Main card */}
                <div className="relative rounded-3xl bg-gradient-to-br from-white via-slate-50/80 to-teal-50/60 border border-teal-200/60 shadow-xl shadow-teal-100/40 overflow-hidden">

                  {/* Top accent bar */}
                  <div className="h-1 w-full bg-gradient-to-r from-teal-500 via-sky-400 to-indigo-500" />

                  {/* Subtle background pattern inside card */}
                  <div className="absolute inset-0 opacity-[0.04]"
                    style={{backgroundImage: 'radial-gradient(circle at 1px 1px, #0d9488 1px, transparent 0)', backgroundSize: '24px 24px'}}
                  />

                  {/* Pulsing ring behind image */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full border-2 border-teal-300/30 animate-ping" style={{animationDuration: '3s'}} />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-full border border-indigo-200/40" />

                  {/* Image — tinted to blend with teal palette */}
                  <div className="relative p-6 flex items-center justify-center">
                    <div className="relative">
                      {/* Teal tint overlay on the image */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-teal-600/10 via-transparent to-indigo-600/10 mix-blend-multiply pointer-events-none z-10" />
                      <img
                        src="/bank-handshake.jpg"
                        alt="Bank Handshake"
                        className="relative w-full h-auto max-h-[300px] object-contain rounded-xl drop-shadow-md"
                        style={{filter: 'drop-shadow(0 8px 24px rgba(13,148,136,0.18)) contrast(1.05) brightness(0.97)'}}
                      />
                    </div>
                  </div>

                  {/* Bottom floating info badge */}
                  <div className="px-5 pb-4 flex items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-600/10 border border-teal-300/50 backdrop-blur-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                      <span className="text-[11px] font-bold text-teal-800">Institutional Bank Match</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/60">
                      <Landmark className="w-3.5 h-3.5 text-indigo-500" />
                      <span className="text-[11px] font-bold text-indigo-700">+100 Banks</span>
                    </div>
                  </div>
                </div>

                {/* Floating stat card — top right */}
                <div className="absolute -top-4 -right-4 bg-white border border-teal-200/80 rounded-2xl shadow-lg px-3 py-2 flex items-center gap-2 z-20">
                  <div className="w-7 h-7 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-800 leading-tight">RBI Compliant</p>
                    <p className="text-[9px] text-teal-600 font-semibold">FOIR Protected</p>
                  </div>
                </div>

                {/* Floating rate badge — bottom left */}
                <div className="absolute -bottom-4 -left-4 bg-white border border-indigo-200/80 rounded-2xl shadow-lg px-3 py-2 flex items-center gap-2 z-20">
                  <div className="w-7 h-7 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0">
                    <Calculator className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-800 leading-tight">From 6.96%</p>
                    <p className="text-[9px] text-indigo-500 font-semibold">Best Home Loan Rate</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* MultiBank Benchmark Stats Band */}
      <section className="py-8 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-2xl sm:text-3xl font-black text-[#0B192C]">{t('home.stat1Number', '184+')}</p>
              <p className="text-xs font-bold text-slate-600 mt-1">{t('home.stat1Label', 'Loan Schemes')}</p>
              <p className="text-[10px] text-slate-400">{t('home.stat1Sub', 'MultiBank Dataset')}</p>
            </div>
            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-100">
              <p className="text-2xl sm:text-3xl font-black text-teal-700">{t('home.stat2Number', '6.96%')}</p>
              <p className="text-xs font-bold text-slate-600 mt-1">{t('home.stat2Label', 'Lowest Benchmark Rate')}</p>
              <p className="text-[10px] text-teal-600">{t('home.stat2Sub', 'Home Loans Floor')}</p>
            </div>
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100">
              <p className="text-2xl sm:text-3xl font-black text-indigo-700">{t('home.stat3Number', '100%')}</p>
              <p className="text-xs font-bold text-slate-600 mt-1">{t('home.stat3Label', 'Transparent Calculations')}</p>
              <p className="text-[10px] text-indigo-600">{t('home.stat3Sub', 'RBI FOIR Headroom')}</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100">
              <p className="text-2xl sm:text-3xl font-black text-amber-700">{t('home.stat4Number', 'Zero')}</p>
              <p className="text-xs font-bold text-slate-600 mt-1">{t('home.stat4Label', 'Sign-up Required')}</p>
              <p className="text-[10px] text-amber-600">{t('home.stat4Sub', 'Instant Free Access')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Four Core Solutions Grid with Unique Single Actions */}
      <section className="py-14 sm:py-18 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0B192C] tracking-tight">
            {t('home.toolsHeading', 'Explore LoanLens Banking Tools')}
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            {t('home.toolsSubheading', 'Every feature has a distinct purpose to guide your borrowing journey.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Loan Eligibility & Risk */}
          <div
            onClick={onOpenEligibility}
            className="group p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-teal-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-[#0B192C]">
                {t('home.card1Title', 'Loan Eligibility & Risk')}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t('home.card1Desc', 'Check debt-to-income headroom against RBI FOIR thresholds and predict default probability tier.')}
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-teal-700 group-hover:text-teal-800">
              <span>{t('home.card1Action', 'Check Eligibility')}</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: EMI Calculator & Repayment Planner */}
          <div
            onClick={onOpenEmiCalculator}
            className="group p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-[#0B192C]">
                {t('home.card2Title', 'EMI Calculator & Repayment Planner')}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t('home.card2Desc', 'Compute monthly installments, total interest, and year-by-year repayment schedule for any loan amount.')}
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-indigo-700 group-hover:text-indigo-800">
              <span>{t('home.card2Action', 'Calculate Monthly EMI')}</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Compare Banks */}
          <div
            onClick={onOpenCompareBanks}
            className="group p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Landmark className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-[#0B192C]">
                {t('home.card3Title', 'Compare Indian Banks')}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t('home.card3Desc', 'Evaluate 184+ benchmark offerings across SBI, HDFC Bank, ICICI Bank, Axis Bank, and BoB.')}
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-amber-700 group-hover:text-amber-800">
              <span>{t('home.card3Action', 'View Bank Comparisons')}</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: How It Works */}
          <div
            onClick={onOpenHowItWorks}
            className="group p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-purple-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-[#0B192C]">
                {t('home.card4Title', 'How It Works')}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t('home.card4Desc', 'Learn how FOIR cash flow, CIBIL thresholds, and repayment schedules interact in retail credit underwriting.')}
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-purple-700 group-hover:text-purple-800">
              <span>{t('home.card4Action', 'Read 4-Step Process')}</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>

        {/* Call to Action Banner to Dashboard */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0B192C] via-[#1E3E62] to-teal-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">
              {t('home.bannerTitle', 'Ready for comprehensive credit analytics?')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              {t('home.bannerDesc', 'Launch the LoanLens Dashboard to view live repayment charts, loan capacity previews, and matched lender schemes.')}
            </p>
          </div>
          <button
            type="button"
            onClick={onGetStarted}
            className="flex items-center gap-2 px-7 py-3.5 bg-teal-500 hover:bg-teal-400 text-[#0B192C] font-extrabold rounded-2xl shadow-md transition-all whitespace-nowrap cursor-pointer shrink-0"
          >
            <span>{t('home.bannerAction', 'Launch Dashboard')}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
