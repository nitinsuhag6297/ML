import React, { useState, useMemo } from 'react';
import { ModalWrapper } from './ModalWrapper';
import { calculateEMI, formatINR } from '../services/mlPredictor';
import { Calculator, Table, Sparkles } from 'lucide-react';
import { DoodleCalculator } from './BankingDoodles';
import { useLanguage } from '../contexts/LanguageContext';

interface EmiCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAmount?: number;
  initialRate?: number;
  initialTenureYears?: number;
}

export const EmiCalculatorModal: React.FC<EmiCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialAmount = 4000000,
  initialRate = 8.75,
  initialTenureYears = 20,
}) => {
  const { t, language } = useLanguage();
  const [loanAmount, setLoanAmount] = useState<number>(initialAmount);
  const [interestRate, setInterestRate] = useState<number>(initialRate);
  const [tenureYears, setTenureYears] = useState<number>(initialTenureYears);
  const [activeTab, setActiveTab] = useState<'calculator' | 'schedule' | 'prepayment'>('calculator');

  // Prepayment Simulator state
  const [extraMonthlyEmi, setExtraMonthlyEmi] = useState<number>(5000);

  // Live calculation
  const emiData = useMemo(() => {
    return calculateEMI(loanAmount, interestRate, tenureYears);
  }, [loanAmount, interestRate, tenureYears]);

  // Prepayment calculations
  const prepaymentImpact = useMemo(() => {
    if (extraMonthlyEmi <= 0) return null;
    const standardEmi = emiData.monthlyEmi;
    const newTotalMonthly = standardEmi + extraMonthlyEmi;
    const monthlyRate = interestRate / 12 / 100;

    let balance = loanAmount;
    let months = 0;
    let totalInterestWithPrepay = 0;

    while (balance > 0 && months < 360) {
      months++;
      const interestForMonth = balance * monthlyRate;
      const principalForMonth = Math.min(balance, newTotalMonthly - interestForMonth);
      totalInterestWithPrepay += interestForMonth;
      balance -= principalForMonth;
    }

    const savedInterest = Math.max(0, emiData.totalInterest - totalInterestWithPrepay);
    const monthsSaved = Math.max(0, emiData.tenureMonths - months);

    return {
      newMonths: months,
      newYears: (months / 12).toFixed(1),
      savedInterest: Math.round(savedInterest),
      monthsSaved,
      yearsSaved: (monthsSaved / 12).toFixed(1),
    };
  }, [loanAmount, interestRate, tenureYears, extraMonthlyEmi, emiData]);

  // SVG Donut calculation
  const principalPct = Math.max(1, 100 - emiData.interestRatio);
  const interestPct = emiData.interestRatio;
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const principalStroke = (principalPct / 100) * circumference;
  const interestStroke = (interestPct / 100) * circumference;

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={t('emiModal.title', 'Repayment Schedule & EMI Forecaster')}
      subtitle={t('emiModal.subtitle', 'Accurate reducing-balance loan calculations with immediate principal/interest breakdown.')}
      maxWidth="4xl"
      variant="yellow"
      doodleIcon={<DoodleCalculator size={36} />}
    >
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg max-w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('calculator')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === 'calculator'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('nav.emiCalculator', 'EMI Calculator')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === 'schedule'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('common.repaymentSchedule', 'Repayment Schedule')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('prepayment')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === 'prepayment'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('emiModal.tabPrepayment', 'Prepayment Savings')}
          </button>
        </div>

        {/* Tab 1: Calculator Sliders & Composition */}
        {activeTab === 'calculator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Sliders and Inputs */}
            <div className="lg:col-span-7 space-y-5">
              {/* Loan Amount Input & Slider */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700">
                    {t('emi.loanAmount', 'Loan Amount (Principal)')}
                  </label>
                  <div className="flex items-center gap-1 font-mono font-bold text-teal-900 text-sm">
                    <span>₹</span>
                    <input
                      type="number"
                      step={50000}
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Math.max(10000, Number(e.target.value)))}
                      className="w-28 px-2 py-0.5 border border-slate-300 rounded text-right outline-none focus:border-teal-600"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min={100000}
                  max={20000000}
                  step={50000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                  <span>₹1 Lakh</span>
                  <span>₹50 Lakh</span>
                  <span>₹1 Crore</span>
                  <span>₹2 Crore</span>
                </div>
                {/* Presets */}
                <div className="flex flex-wrap gap-1.5 mt-3">
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
                      onClick={() => setLoanAmount(p.val)}
                      className={`text-[11px] px-2.5 py-0.5 rounded border transition-colors cursor-pointer ${
                        loanAmount === p.val
                          ? 'bg-teal-50 border-teal-600 text-teal-900 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interest Rate */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700">
                    {t('emi.interestRate', 'Annual Interest Rate (% p.a.)')}
                  </label>
                  <div className="flex items-center gap-1 font-mono font-bold text-slate-900 text-sm">
                    <input
                      type="number"
                      step={0.05}
                      min={5}
                      max={24}
                      value={interestRate}
                      onChange={(e) => setInterestRate(Math.max(1, Number(e.target.value)))}
                      className="w-20 px-2 py-0.5 border border-slate-300 rounded text-right outline-none focus:border-teal-600"
                    />
                    <span>%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={6.5}
                  max={18}
                  step={0.1}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                  <span>6.5%</span>
                  <span>10.5%</span>
                  <span>14%</span>
                  <span>18%</span>
                </div>
              </div>

              {/* Tenure Years */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700">
                    {t('emi.tenureYears', 'Tenure Duration (Years)')}
                  </label>
                  <span className="text-xs font-semibold text-slate-900 font-mono">
                    {tenureYears} {t('common.years', 'Years')} ({tenureYears * 12} {t('common.months', 'Months')})
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                  <span>1 {t('common.years', 'Year')}</span>
                  <span>10 {t('common.years', 'Years')}</span>
                  <span>20 {t('common.years', 'Years')}</span>
                  <span>30 {t('common.years', 'Years')}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Key Metric Displays & Donut Chart */}
            <div className="lg:col-span-5 space-y-4">
              {/* Highlight EMI Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0B192C] via-[#1E3E62] to-teal-900 text-white shadow-lg">
                <p className="text-xs font-medium text-teal-200 uppercase tracking-wider">
                  {t('emi.monthlyEmi', 'Monthly Installment (EMI)')}
                </p>
                <p className="text-3xl font-extrabold font-mono mt-1 text-white">
                  {formatINR(emiData.monthlyEmi)}
                </p>
                <div className="mt-4 pt-4 border-t border-white/15 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-200">
                    <span>{t('emi.loanAmount', 'Principal Amount')}:</span>
                    <span className="font-mono font-semibold text-white">
                      {formatINR(emiData.loanAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-200">
                    <span>{t('emi.totalInterest', 'Total Interest Payable')}:</span>
                    <span className="font-mono font-semibold text-teal-300">
                      {formatINR(emiData.totalInterest)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-200 font-bold pt-1 border-t border-white/10">
                    <span>{t('emi.totalPayable', 'Total Repayment Amount')}:</span>
                    <span className="font-mono text-white text-sm">
                      {formatINR(emiData.totalRepayment)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Visual Breakup Donut */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    {t('emiModal.tabBreakdown', 'Payment Breakdown')}
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm bg-[#1E3E62]" />
                      <span className="text-slate-600">{t('emi.principalShare', 'Principal')}:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {principalPct.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm bg-teal-500" />
                      <span className="text-slate-600">{t('emi.interestShare', 'Interest')}:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {interestPct.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Donut SVG */}
                <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      stroke="#f1f5f9"
                      strokeWidth="18"
                      fill="transparent"
                    />
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
                      stroke="#0d9488"
                      strokeWidth="18"
                      strokeDasharray={`${interestStroke} ${circumference}`}
                      strokeDashoffset={`-${principalStroke}`}
                      fill="transparent"
                      className="transition-all duration-300"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-[10px] text-slate-400 font-semibold block">EMI</span>
                    <span className="text-xs font-bold font-mono text-slate-900">
                      ₹{(emiData.monthlyEmi / 1000).toFixed(0)}k
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Repayment Schedule Table */}
        {activeTab === 'schedule' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <p>
                {t('common.repaymentSchedule', 'Repayment Schedule')} for <span className="font-bold">{formatINR(loanAmount)}</span> at{' '}
                <span className="font-bold">{interestRate}%</span> over{' '}
                <span className="font-bold">{tenureYears} {t('common.years', 'Years')}</span>.
              </p>
              <span className="text-[11px] text-slate-400 font-mono">Values in INR (₹)</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">{t('emiModal.colYear', 'Year')}</th>
                    <th className="py-2.5 px-3">{t('emiModal.colOpening', 'Opening Balance')}</th>
                    <th className="py-2.5 px-3">{t('emiModal.colTotal', 'EMI Paid')}</th>
                    <th className="py-2.5 px-3">{t('emiModal.colPrincipal', 'Principal Paid')}</th>
                    <th className="py-2.5 px-3">{t('emiModal.colInterest', 'Interest Paid')}</th>
                    <th className="py-2.5 px-3 text-right">{t('emiModal.colClosing', 'Closing Balance')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {emiData.schedule.map((row) => (
                    <tr key={row.year} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-sans font-semibold text-slate-900">
                        {language === 'hi' ? `वर्ष ${row.year}` : `Year ${row.year}`}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{formatINR(row.openingBalance)}</td>
                      <td className="py-2.5 px-3 text-slate-900">{formatINR(row.emi * 12)}</td>
                      <td className="py-2.5 px-3 text-emerald-700 font-semibold">
                        {formatINR(row.principalPaid * 12)}
                      </td>
                      <td className="py-2.5 px-3 text-rose-700">{formatINR(row.interestPaid * 12)}</td>
                      <td className="py-2.5 px-3 text-right font-semibold text-slate-900">
                        {formatINR(row.closingBalance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Prepayment Savings Simulator */}
        {activeTab === 'prepayment' && prepaymentImpact && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-teal-950">
                    {language === 'hi' ? 'पूर्व-भुगतान द्वारा ब्याज बचत का अनुमान' : 'Accelerate Loan Freedom with Prepayments'}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {language === 'hi'
                      ? 'नियमित ईएमआई के साथ थोड़ा अतिरिक्त भुगतान मूलधन को तेजी से घटाता है और भारी ब्याज बचाता है।'
                      : 'Paying even a modest surplus amount directly cuts into your principal, saving massive interest over long tenures.'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-slate-700">
                    {t('emi.extraMonthly', 'Extra Monthly:')}
                  </label>
                  <input
                    type="number"
                    step={1000}
                    value={extraMonthlyEmi}
                    onChange={(e) => setExtraMonthlyEmi(Math.max(0, Number(e.target.value)))}
                    className="w-28 px-2.5 py-1 text-xs font-mono font-bold rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-teal-200">
                <div className="p-3 bg-white rounded-lg border border-teal-100">
                  <p className="text-[11px] text-slate-500">{t('emi.interestSaved', 'Interest Saved')}</p>
                  <p className="text-lg font-bold font-mono text-emerald-700 mt-0.5">
                    {formatINR(prepaymentImpact.savedInterest)}
                  </p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-teal-100">
                  <p className="text-[11px] text-slate-500">{t('emi.tenureShaved', 'Tenure Reduced')}</p>
                  <p className="text-lg font-bold font-mono text-teal-900 mt-0.5">
                    {prepaymentImpact.yearsSaved} {t('common.years', 'Years')} ({prepaymentImpact.monthsSaved} {t('common.months', 'Months')})
                  </p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-teal-100">
                  <p className="text-[11px] text-slate-500">{t('emi.revisedTerm', 'Revised Loan Term')}</p>
                  <p className="text-lg font-bold font-mono text-slate-900 mt-0.5">
                    {prepaymentImpact.newYears} {t('common.years', 'Years')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ModalWrapper>
  );
};
