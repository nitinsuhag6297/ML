import React, { useState, useMemo } from 'react';
import { calculateEMI, formatINR } from '../services/mlPredictor';
import { Table, Sparkles, TrendingDown, ArrowRight } from 'lucide-react';
import { DoodleCalculator } from './BankingDoodles';
import { useLanguage } from '../contexts/LanguageContext';

interface EmiStudioSectionProps {
  onOpenScheduleModal: (amount: number, rate: number, tenure: number) => void;
}

export const EmiStudioSection: React.FC<EmiStudioSectionProps> = ({ onOpenScheduleModal }) => {
  const { t } = useLanguage();
  const [amount, setAmount] = useState<number>(4000000);
  const [rate, setRate] = useState<number>(8.75);
  const [tenure, setTenure] = useState<number>(20);
  const [showPrepayment, setShowPrepayment] = useState<boolean>(false);
  const [extraMonthly, setExtraMonthly] = useState<number>(5000);

  // Reducing balance EMI calculation
  const emiData = useMemo(() => {
    return calculateEMI(amount, rate, tenure);
  }, [amount, rate, tenure]);

  // Prepayment savings calculation
  const prepayData = useMemo(() => {
    if (extraMonthly <= 0) return null;
    const monthlyRate = rate / 12 / 100;
    const totalMonthly = emiData.monthlyEmi + extraMonthly;

    let balance = amount;
    let months = 0;
    let totalInterestPaid = 0;

    while (balance > 0 && months < 360) {
      months++;
      const interest = balance * monthlyRate;
      const principal = Math.min(balance, totalMonthly - interest);
      totalInterestPaid += interest;
      balance -= principal;
    }

    const saved = Math.max(0, emiData.totalInterest - totalInterestPaid);
    const monthsSaved = Math.max(0, emiData.tenureMonths - months);

    return {
      savedInterest: Math.round(saved),
      monthsSaved,
      yearsSaved: (monthsSaved / 12).toFixed(1),
      newTenureYears: (months / 12).toFixed(1),
    };
  }, [amount, rate, tenure, extraMonthly, emiData]);

  // SVG Donut calculation
  const principalPct = Math.max(1, 100 - emiData.interestRatio);
  const interestPct = emiData.interestRatio;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const principalStroke = (principalPct / 100) * circumference;
  const interestStroke = (interestPct / 100) * circumference;

  return (
    <section
      id="calculator"
      className="py-16 lg:py-24 bg-gradient-to-b from-[#FFF7ED]/50 via-[#FEFCE8] to-[#F0F9FF]/60 border-b border-amber-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 border border-amber-200 text-xs font-bold uppercase tracking-wider">
            <span>{t('emi.kicker', 'Mathematical Repayment Engine')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B192C] tracking-tight">
            {t('emi.heading', 'EMI Calculator & Repayment Planner')}
          </h2>
          <p className="text-sm text-slate-600">
            {t('emi.subheading', 'Real-time reducing balance repayment schedule. Adjust loan variables below to evaluate your monthly obligations.')}
          </p>
        </div>

        {/* Main Studio Card Container */}
        <div className="rounded-3xl bg-white border border-amber-200 shadow-xl p-6 sm:p-8 lg:p-10 relative overflow-hidden">
          {/* Subtle Doodle Watermark */}
          <div className="absolute top-4 right-6 opacity-20 pointer-events-none hidden sm:block">
            <DoodleCalculator size={84} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Cols: Sliders & Controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* Loan Amount Control */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">{t('emi.loanAmount', 'Loan Amount (Principal)')}</label>
                  <span className="text-base font-mono font-black text-amber-900">
                    {formatINR(amount)}
                  </span>
                </div>
                <input
                  type="range"
                  min={100000}
                  max={20000000}
                  step={50000}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full accent-amber-600 h-2 bg-amber-200/60 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>₹1 Lakh</span>
                  <span>₹50 Lakh</span>
                  <span>₹1 Crore</span>
                  <span>₹2 Crore</span>
                </div>
                {/* Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    { label: '₹10L', val: 1000000 },
                    { label: '₹25L', val: 2500000 },
                    { label: '₹40L', val: 4000000 },
                    { label: '₹75L', val: 7500000 },
                    { label: '₹1.2Cr', val: 12000000 },
                  ].map((p) => (
                    <button
                      key={p.val}
                      type="button"
                      onClick={() => setAmount(p.val)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-bold transition-colors cursor-pointer ${
                        amount === p.val
                          ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                          : 'bg-white border-amber-200 text-slate-700 hover:bg-amber-100/50'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interest Rate & Tenure 2-Column Split */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Interest Rate */}
                <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">{t('emi.interestRate', 'Annual Interest Rate (% p.a.)')}</label>
                    <span className="text-base font-mono font-black text-sky-900">{rate}%</span>
                  </div>
                  <input
                    type="range"
                    min={6.5}
                    max={18}
                    step={0.1}
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full accent-sky-600 h-2 bg-sky-200/60 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>6.5%</span>
                    <span>11%</span>
                    <span>18%</span>
                  </div>
                </div>

                {/* Tenure */}
                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">{t('emi.tenureYears', 'Tenure Duration (Years)')}</label>
                    <span className="text-base font-mono font-black text-purple-900">
                      {tenure} {t('common.years', 'Years')} ({tenure * 12} {t('common.months', 'mo')})
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={30}
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full accent-purple-600 h-2 bg-purple-200/60 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>1 {t('common.years', 'Year')}</span>
                    <span>15 {t('common.years', 'Years')}</span>
                    <span>30 {t('common.years', 'Years')}</span>
                  </div>
                </div>
              </div>

              {/* Prepayment Simulator Toggle */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowPrepayment(!showPrepayment)}
                  className="flex items-center gap-2 text-xs font-bold text-teal-800 hover:text-teal-950 underline decoration-dotted cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>
                    {showPrepayment
                      ? t('emi.hidePrepayment', 'Hide Prepayment Simulator')
                      : t('emi.prepaymentToggle', 'Test Prepayment & Interest Savings Simulator →')}
                  </span>
                </button>

                {showPrepayment && prepayData && (
                  <div className="mt-3 p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs font-bold text-emerald-900">
                        {t('emi.extraMonthly', 'Extra Monthly Payment:')}
                      </span>
                      <div className="flex items-center gap-1 font-mono">
                        <span className="text-xs">₹</span>
                        <input
                          type="number"
                          step={1000}
                          value={extraMonthly}
                          onChange={(e) => setExtraMonthly(Math.max(0, Number(e.target.value)))}
                          className="w-24 px-2 py-0.5 text-xs font-bold rounded border border-emerald-300 bg-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-2 border-t border-emerald-200 font-mono">
                      <div className="p-2 rounded-xl bg-white border border-emerald-100">
                        <span className="text-[10px] text-slate-500 font-sans block">{t('emi.interestSaved', 'Interest Saved:')}</span>
                        <strong className="text-emerald-700 text-sm">{formatINR(prepayData.savedInterest)}</strong>
                      </div>
                      <div className="p-2 rounded-xl bg-white border border-emerald-100">
                        <span className="text-[10px] text-slate-500 font-sans block">{t('emi.tenureShaved', 'Tenure Shaved:')}</span>
                        <strong className="text-teal-900 text-sm">{prepayData.yearsSaved} {t('common.years', 'Years')}</strong>
                      </div>
                      <div className="p-2 rounded-xl bg-white border border-emerald-100 col-span-2 sm:col-span-1">
                        <span className="text-[10px] text-slate-500 font-sans block">{t('emi.revisedTerm', 'Revised Term:')}</span>
                        <strong className="text-slate-900 text-sm">{prepayData.newTenureYears} {t('common.years', 'Years')}</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right 5 Cols: Highlight Display & Interactive Donut */}
            <div className="lg:col-span-5 space-y-4">
              {/* Main EMI Headline Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0B192C] via-[#1E3E62] to-[#042f2e] text-white shadow-lg space-y-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300">
                    {t('emi.monthlyEmi', 'Monthly Installment (EMI)')}
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-black font-mono mt-1 text-white">
                    {formatINR(emiData.monthlyEmi)}
                  </h3>
                </div>

                <div className="pt-3 border-t border-white/15 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-200">
                    <span>{t('emi.loanAmount', 'Loan Amount')}:</span>
                    <span className="font-mono font-bold text-white">{formatINR(amount)}</span>
                  </div>
                  <div className="flex justify-between text-slate-200">
                    <span>{t('emi.totalInterest', 'Total Interest Charge')}:</span>
                    <span className="font-mono font-bold text-teal-300">
                      {formatINR(emiData.totalInterest)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-100 font-extrabold pt-2 border-t border-white/10">
                    <span>{t('emi.totalPayable', 'Total Repayment Amount')}:</span>
                    <span className="font-mono text-sm text-white">
                      {formatINR(emiData.totalRepayment)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Composition Donut Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    {t('emiModal.tabBreakdown', 'Payment Breakdown')}
                  </h5>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-md bg-[#1E3E62]" />
                      <span className="text-slate-600">{t('emi.principalShare', 'Principal Share')}:</span>
                      <span className="font-mono font-bold text-slate-900">{principalPct.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-md bg-teal-500" />
                      <span className="text-slate-600">{t('emi.interestShare', 'Interest Share')}:</span>
                      <span className="font-mono font-bold text-slate-900">{interestPct.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                {/* SVG Donut */}
                <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                    <circle cx="80" cy="80" r={radius} stroke="#E2E8F0" strokeWidth="18" fill="transparent" />
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      stroke="#1E3E62"
                      strokeWidth="18"
                      strokeDasharray={`${principalStroke} ${circumference}`}
                      strokeDashoffset="0"
                      fill="transparent"
                      className="transition-all duration-300"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      stroke="#0D9488"
                      strokeWidth="18"
                      strokeDasharray={`${interestStroke} ${circumference}`}
                      strokeDashoffset={`-${principalStroke}`}
                      fill="transparent"
                      className="transition-all duration-300"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-[9px] text-slate-400 font-bold block">EMI</span>
                    <span className="text-xs font-bold font-mono text-slate-900">
                      ₹{(emiData.monthlyEmi / 1000).toFixed(0)}k
                    </span>
                  </div>
                </div>
              </div>

              {/* View Full Repayment Schedule Action */}
              <button
                type="button"
                onClick={() => onOpenScheduleModal(amount, rate, tenure)}
                className="w-full py-2.5 px-4 text-xs font-bold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              >
                <Table className="w-3.5 h-3.5 text-indigo-600" />
                <span>{t('emi.viewFullSchedule', 'View Full Year-by-Year Repayment Schedule')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
