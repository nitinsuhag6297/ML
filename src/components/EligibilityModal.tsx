import React, { useState } from 'react';
import { ModalWrapper } from './ModalWrapper';
import { ApplicantProfile, LoanType, EmploymentType } from '../types';
import { evaluateEligibility, formatINR } from '../services/mlPredictor';
import { CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { DoodleWallet } from './BankingDoodles';
import { useLanguage } from '../contexts/LanguageContext';

interface EligibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToRiskPrediction: (profile: ApplicantProfile) => void;
  initialProfile?: Partial<ApplicantProfile>;
}

export const EligibilityModal: React.FC<EligibilityModalProps> = ({
  isOpen,
  onClose,
  onProceedToRiskPrediction,
  initialProfile,
}) => {
  const { t, language } = useLanguage();
  const [step, setStep] = useState<number>(1);

  // Form State
  const [fullName, setFullName] = useState(initialProfile?.fullName || 'Rahul Sharma');
  const [age, setAge] = useState<number>(initialProfile?.age || 32);
  const [employmentType, setEmploymentType] = useState<EmploymentType>(
    initialProfile?.employmentType || 'salaried'
  );
  const [workExperienceYears, setWorkExperienceYears] = useState<number>(
    initialProfile?.workExperienceYears || 6
  );
  const [residentialStatus, setResidentialStatus] = useState<ApplicantProfile['residentialStatus']>(
    initialProfile?.residentialStatus || 'owned'
  );

  const [monthlyIncome, setMonthlyIncome] = useState<number>(initialProfile?.monthlyIncome || 95000);
  const [coApplicantIncome, setCoApplicantIncome] = useState<number>(
    initialProfile?.coApplicantIncome || 35000
  );
  const [existingEmiObligations, setExistingEmiObligations] = useState<number>(
    initialProfile?.existingEmiObligations || 18000
  );
  const [cibilScore, setCibilScore] = useState<number>(initialProfile?.cibilScore || 775);

  const [loanType, setLoanType] = useState<LoanType>(initialProfile?.loanType || 'home');
  const [loanAmountRequested, setLoanAmountRequested] = useState<number>(
    initialProfile?.loanAmountRequested || 4500000
  );
  const [tenureYears, setTenureYears] = useState<number>(initialProfile?.tenureYears || 20);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = language === 'hi' ? 'पूरा नाम आवश्यक है' : 'Full name is required';
    if (age < 21 || age > 65) errs.age = language === 'hi' ? 'आयु 21 से 65 वर्ष के बीच होनी चाहिए' : 'Age must be between 21 and 65 years';
    if (workExperienceYears < 0) errs.workExperience = language === 'hi' ? 'कार्य अनुभव शून्य से कम नहीं हो सकता' : 'Experience cannot be negative';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (monthlyIncome <= 10000) errs.monthlyIncome = language === 'hi' ? 'मासिक आय कम से कम ₹10,000 होनी चाहिए' : 'Monthly income must be at least ₹10,000';
    if (existingEmiObligations < 0) errs.existingEmi = language === 'hi' ? 'ईएमआई दायित्व शून्य से कम नहीं हो सकते' : 'Obligations cannot be negative';
    if (cibilScore < 300 || cibilScore > 900) errs.cibilScore = language === 'hi' ? 'सिबिल स्कोर 300 से 900 के बीच होना चाहिए' : 'CIBIL score must be between 300 and 900';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs: Record<string, string> = {};
    if (loanAmountRequested <= 50000) errs.loanAmount = language === 'hi' ? 'ऋण राशि कम से कम ₹50,000 होनी चाहिए' : 'Requested amount must be at least ₹50,000';
    if (tenureYears < 1 || tenureYears > 30) errs.tenureYears = language === 'hi' ? 'अवधि 1 से 30 वर्ष के बीच होनी चाहिए' : 'Tenure must be between 1 and 30 years';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
    else if (step === 3 && validateStep3()) setStep(4);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const currentProfile: ApplicantProfile = {
    fullName,
    age,
    employmentType,
    workExperienceYears,
    monthlyIncome,
    coApplicantIncome,
    existingEmiObligations,
    cibilScore,
    loanAmountRequested,
    tenureYears,
    loanType,
    priorDefaults: false,
    residentialStatus,
  };

  const evalResult = evaluateEligibility(currentProfile);
  const selectedLoanType = String(loanType);

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={t('elig.modalTitle', 'Loan Eligibility Assessment')}
      subtitle={t('elig.modalSubtitle', 'Evaluate your borrowing capacity based on RBI Fixed Obligation to Income Ratio (FOIR) standards.')}
      maxWidth="3xl"
      variant="mint"
      doodleIcon={<DoodleWallet size={36} />}
    >
      {/* Wizard Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
          <span className={step >= 1 ? 'text-teal-700 font-bold' : ''}>{t('elig.step1', '1. Applicant Profile')}</span>
          <span className={step >= 2 ? 'text-teal-700 font-bold' : ''}>{t('elig.step2', '2. Income & Obligations')}</span>
          <span className={step >= 3 ? 'text-teal-700 font-bold' : ''}>{t('elig.step3', '3. Loan Requirements')}</span>
          <span className={step >= 4 ? 'text-teal-700 font-bold' : ''}>{t('elig.step4', '4. Eligibility Results')}</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-teal-600 to-[#1E3E62] h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Personal Profile */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{t('elig.fullName', 'Full Name')}</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none transition-all"
              placeholder="e.g. Rahul Sharma"
            />
            {errors.fullName && <p className="text-xs text-rose-600 mt-1">{errors.fullName}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('elig.age', 'Age (Years)')}</label>
              <input
                type="number"
                min={21}
                max={65}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
              />
              {errors.age && <p className="text-xs text-rose-600 mt-1">{errors.age}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('elig.empType', 'Employment Classification')}</label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none bg-white"
              >
                <option value="salaried">{t('elig.salariedMnc', 'Salaried (Corporate / MNC / Govt)')}</option>
                <option value="self_employed_professional">{t('elig.selfProf', 'Self-Employed Professional (Doctor/CA/Lawyer)')}</option>
                <option value="self_employed_business">{t('elig.selfBiz', 'Self-Employed Business / Trader')}</option>
                <option value="gig_worker">{t('elig.gig', 'Consultant / Freelancer')}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('elig.workExp', 'Work Experience (Years)')}
              </label>
              <input
                type="number"
                min={0}
                max={40}
                value={workExperienceYears}
                onChange={(e) => setWorkExperienceYears(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
              />
              {errors.workExperience && (
                <p className="text-xs text-rose-600 mt-1">{errors.workExperience}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('elig.residence', 'Residential Status')}</label>
              <select
                value={residentialStatus}
                onChange={(e) =>
                  setResidentialStatus(e.target.value as ApplicantProfile['residentialStatus'])
                }
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none bg-white"
              >
                <option value="owned">{t('elig.residenceOwned', 'Self Owned Residence')}</option>
                <option value="family">{t('elig.residenceFamily', 'Family / Parental Owned')}</option>
                <option value="rented">{t('elig.residenceRented', 'Rented Apartment')}</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Income & Obligations */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('elig.monthlyIncome', 'Net Monthly In-Hand Income (₹)')}
              </label>
              <span className="text-xs font-mono font-medium text-teal-800">
                {formatINR(monthlyIncome)} / {t('common.months', 'mo')}
              </span>
            </div>
            <input
              type="number"
              step={5000}
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none font-mono"
            />
            {errors.monthlyIncome && (
              <p className="text-xs text-rose-600 mt-1">{errors.monthlyIncome}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('elig.coIncome', 'Co-Applicant Income (₹/mo)')}
              </label>
              <input
                type="number"
                step={5000}
                value={coApplicantIncome}
                onChange={(e) => setCoApplicantIncome(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('elig.existingEmi', 'Existing Monthly EMIs (₹)')}
              </label>
              <input
                type="number"
                step={1000}
                value={existingEmiObligations}
                onChange={(e) => setExistingEmiObligations(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none font-mono"
              />
              {errors.existingEmi && (
                <p className="text-xs text-rose-600 mt-1">{errors.existingEmi}</p>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('elig.cibil', 'CIBIL Credit Score (300-900)')}
              </label>
              <span className="text-xs font-mono font-bold text-teal-800">{cibilScore}</span>
            </div>
            <input
              type="range"
              min={300}
              max={900}
              step={5}
              value={cibilScore}
              onChange={(e) => setCibilScore(Number(e.target.value))}
              className="w-full accent-teal-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
              <span>300</span>
              <span>650</span>
              <span>750+ (Prime)</span>
              <span>900</span>
            </div>
            {errors.cibilScore && (
              <p className="text-xs text-rose-600 mt-1">{errors.cibilScore}</p>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Loan Requirements */}
      {step === 3 && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              {t('elig.loanType', 'Loan Product Category')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'home' as LoanType, label: t('common.homeLoan', 'Home Loan'), tenureMax: 30 },
                { id: 'personal' as LoanType, label: t('common.personalLoan', 'Personal Loan'), tenureMax: 7 },
                { id: 'auto' as LoanType, label: t('common.carLoan', 'Car Loan'), tenureMax: 7 },
                { id: 'education' as LoanType, label: t('common.educationLoan', 'Education Loan'), tenureMax: 15 },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setLoanType(cat.id);
                    if (tenureYears > cat.tenureMax) setTenureYears(cat.tenureMax);
                  }}
                  className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                    loanType === cat.id
                      ? 'border-teal-600 bg-teal-50/70 text-teal-950 font-semibold shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <p className="text-sm mt-0.5">{cat.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('elig.loanAmount', 'Requested Loan Amount (₹)')}
              </label>
              <span className="text-sm font-mono font-bold text-teal-900">
                {formatINR(loanAmountRequested)}
              </span>
            </div>
            <input
              type="number"
              step={50000}
              value={loanAmountRequested}
              onChange={(e) => setLoanAmountRequested(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none font-mono"
            />
            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                { label: '₹10 Lakh', val: 1000000 },
                { label: '₹25 Lakh', val: 2500000 },
                { label: '₹50 Lakh', val: 5000000 },
                { label: '₹75 Lakh', val: 7500000 },
                { label: '₹1 Crore', val: 10000000 },
              ].map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => setLoanAmountRequested(p.val)}
                  className={`text-xs px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                    loanAmountRequested === p.val
                      ? 'bg-teal-50 border-teal-600 text-teal-900 font-medium'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            {errors.loanAmount && <p className="text-xs text-rose-600 mt-1">{errors.loanAmount}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('elig.tenure', 'Preferred Loan Tenure (Years)')}
              </label>
              <span className="text-sm font-semibold text-slate-900">
                {tenureYears} {t('common.years', 'Years')} ({tenureYears * 12} {t('common.months', 'Months')})
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={
                loanType === 'home'
                  ? 30
                  :                   selectedLoanType === 'education'
                  ? 15
                  : loanType === 'business'
                  ? 10
                  : 7
              }
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full accent-teal-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
              <span>1 {t('common.years', 'Year')}</span>
              <span>{loanType === 'home' ? '15 Years' : selectedLoanType === 'education' ? '8 Years' : '3 Years'}</span>
              <span>{loanType === 'home' ? '30 Years' : selectedLoanType === 'education' ? '15 Years' : '7 Years'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Results & Banking Assessment */}
      {step === 4 && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Main Verdict Card */}
          <div
            className={`p-5 rounded-2xl border ${
              evalResult.isEligible
                ? 'bg-emerald-50/70 border-emerald-200'
                : 'bg-amber-50/70 border-amber-200'
            }`}
          >
            <div className="flex items-start gap-3.5">
              {evalResult.isEligible ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-slate-900">
                    {evalResult.isEligible
                      ? t('elig.resultEligible', 'Congratulations! You Qualify for the Requested Loan.')
                      : t('elig.resultIneligible', 'Borrowing Adjustment Required')}
                  </h4>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      evalResult.isEligible
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {evalResult.isEligible ? t('elig.highPotential', 'High Approval Potential') : t('elig.capacityExceeded', 'Capacity Exceeded')}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {evalResult.isEligible
                    ? language === 'hi'
                      ? `आपकी शुद्ध मासिक आय (${formatINR(evalResult.totalIncome)}) और ${evalResult.actualFoir}% के सुरक्षित एफओआईआर अनुपात के आधार पर आपकी ऋण क्षमता उपयुक्त है।`
                      : `Based on combined net monthly income of ${formatINR(
                          evalResult.totalIncome
                        )} and a debt FOIR of ${
                          evalResult.actualFoir
                        }%, Indian lenders will readily consider your application.`
                    : language === 'hi'
                    ? `आपका वर्तमान ऋण अनुपात (${evalResult.actualFoir}%) सुरक्षित बैंकिंग सीमा (${evalResult.allowedFoirPercentage}%) से अधिक है। आप ${formatINR(evalResult.maxEligibleLoan)} तक के ऋण के लिए पात्र हैं।`
                    : `Your current debt ratio (${evalResult.actualFoir}%) exceeds the standard banking threshold (${evalResult.allowedFoirPercentage}%). You qualify for up to ${formatINR(
                        evalResult.maxEligibleLoan
                      )}.`}
                </p>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-200/60">
              <div className="bg-white/80 p-3 rounded-xl border border-slate-100">
                <p className="text-[11px] text-slate-500">{t('elig.maxEligibleAmount', 'Max Eligible Loan')}</p>
                <p className="text-base font-bold font-mono text-teal-900 mt-0.5">
                  {formatINR(evalResult.maxEligibleLoan)}
                </p>
              </div>
              <div className="bg-white/80 p-3 rounded-xl border border-slate-100">
                <p className="text-[11px] text-slate-500">{t('elig.recommendedEmi', 'Estimated Monthly EMI')}</p>
                <p className="text-base font-bold font-mono text-slate-900 mt-0.5">
                  {formatINR(evalResult.monthlyEmiRequested)}
                </p>
              </div>
              <div className="bg-white/80 p-3 rounded-xl border border-slate-100">
                <p className="text-[11px] text-slate-500">{t('elig.foirLabel', 'Your Debt FOIR')}</p>
                <p
                  className={`text-base font-bold font-mono mt-0.5 ${
                    evalResult.actualFoir <= evalResult.allowedFoirPercentage
                      ? 'text-emerald-700'
                      : 'text-rose-700'
                  }`}
                >
                  {evalResult.actualFoir}%
                </p>
              </div>
              <div className="bg-white/80 p-3 rounded-xl border border-slate-100">
                <p className="text-[11px] text-slate-500">{t('elig.benchmarkRate', 'Benchmark Rate')}</p>
                <p className="text-base font-bold font-mono text-slate-900 mt-0.5">
                  {evalResult.recommendedInterestRate}% {t('common.perAnnum', 'p.a.')}
                </p>
              </div>
            </div>
          </div>

          {/* Dataset-backed product recommendations */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
              {t('elig.recommendationHeading', 'Best Matching Loan Products')}
            </h5>
            {evalResult.eligibleProducts.length > 0 ? (
              <>
                <p className="text-[11px] text-slate-500 mb-2">
                  {evalResult.eligibleProducts.length} eligible products from{' '}
                  {evalResult.eligibleBankCount} banks, ranked by estimated total cost.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {evalResult.eligibleProducts.slice(0, 5).map(({ product, monthlyEmi, totalEstimatedCost, foir }, index) => (
                    <div
                      key={`${product.bankName}-${product.productName}-${index}`}
                      className={`p-3 rounded-xl border bg-white transition-colors shadow-2xs ${
                        index === 0 ? 'border-teal-500 ring-1 ring-teal-200' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="text-xs font-bold text-slate-900 leading-tight">{product.bankName}</p>
                          <p className="text-[10px] text-slate-500">{product.productName}</p>
                        </div>
                        {index === 0 && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold">
                            Best match
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-600 space-y-0.5">
                        <p>Rate: <span className="font-semibold text-slate-900">{product.interestRatePct}%</span></p>
                        <p>Monthly EMI: <span className="font-semibold text-slate-900">{formatINR(monthlyEmi)}</span></p>
                        <p>Total estimated cost: <span className="font-semibold text-slate-900">{formatINR(totalEstimatedCost)}</span></p>
                        <p>Product FOIR: <span className="font-semibold text-emerald-700">{foir}%</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="p-3 rounded-xl border border-amber-200 bg-amber-50 text-xs text-amber-800">
                No dataset product matches all of your CIBIL, income, age, loan amount, tenure, and FOIR requirements.
                Try a lower amount, longer tenure, or different loan type.
              </div>
            )}
          </div>

          {/* Regulatory note */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-500 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p>
              {t('elig.disclaimer', 'Eligibility calculated using standard Indian retail banking underwriting guidelines (RBI FOIR threshold and reducing balance repayment schedule). Final sanction depends on official documentation and bank discretion.')}
            </p>
          </div>
        </div>
      )}

      {/* Modal Footer Controls */}
      <div className="flex items-center justify-between pt-5 mt-6 border-t border-slate-100">
        <div>
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('common.back', 'Previous')}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#1E3E62] to-teal-700 rounded-lg hover:opacity-95 shadow-sm transition-all cursor-pointer"
            >
              <span>{step === 3 ? t('common.checkEligibility', 'Check Eligibility') : t('common.next', 'Continue')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                onProceedToRiskPrediction(currentProfile);
              }}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#0B192C] via-[#1E3E62] to-teal-700 rounded-lg hover:opacity-95 shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-teal-300" />
              <span>{t('elig.proceedToRisk', 'Proceed to Default Risk Analysis')}</span>
            </button>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
};
