import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ModalWrapper } from './ModalWrapper';
import { ApplicantProfile, PredictionResult, LoanType } from '../types';
import { predictLoanRisk, formatINR, evaluateEligibility } from '../services/mlPredictor';
import { runAllMlModels, CombinedMlAssessment } from '../services/mlService';
import { BankLogo } from './BankLogo';
import { INDIAN_BANKS } from '../data/bankData';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Layers,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Cpu,
  RefreshCw,
  Activity,
} from 'lucide-react';
import { DoodleCalculator } from './BankingDoodles';
import { useLanguage } from '../contexts/LanguageContext';
import { ShapExplanationCard } from './ShapExplanationCard';

// ─────────────────────────────────────────────────────────────────────────────
// Bank eligibility types & reactive calculator
// ─────────────────────────────────────────────────────────────────────────────

type MatchTier = 'High' | 'Moderate' | 'Low' | 'Ineligible';

interface LiveBankCard {
  bankId: string;
  bankName: string;
  shortName: string;
  matchTier: MatchTier;
  indicativeRate: number;
  rateMax: number;
  minCibil: number;
  criteriaLines: string[];
  matchScore: number; // 0-100 — used to sort
}

/**
 * Pure, synchronous bank eligibility scorer — runs on every input change.
 * Computes per-criterion pass/fail and builds a human-readable description.
 */
function computeLiveBankMatrix(
  cibil: number,
  monthlyIncome: number,
  coIncome: number,
  loanAmount: number,
  existingEmis: number,
  priorDefaults: boolean,
  loanType: string,
): LiveBankCard[] {
  const totalIncome = monthlyIncome + coIncome;
  const annualIncomeLpa = (totalIncome * 12) / 100_000;
  const loanLakhs = loanAmount / 100_000;

  // RBI FOIR norms
  let foirCap = 50;
  if (totalIncome < 35_000) foirCap = 45;
  else if (totalIncome <= 75_000) foirCap = 50;
  else if (totalIncome <= 150_000) foirCap = 55;
  else foirCap = 65;

  const normType = (loanType === 'car' ? 'auto' : loanType) as 'home' | 'personal' | 'auto' | 'business';

  return INDIAN_BANKS.map((bank) => {
    const loanData = bank.loans[normType] ?? bank.loans.home;
    const minCibil = loanData.minCibilRequired ?? 700;
    const rateMin = loanData.interestRateMin ?? 8.5;
    const rateMax = loanData.interestRateMax ?? 12.0;
    const maxLoanLakhs = loanData.maxLoanAmountLakhs ?? 500;
    // Approximate income required: loan / 60x monthly (conservative heuristic)
    const minIncomeRequired = loanAmount / (60 * 12); // annual → monthly
    const minIncomeRequiredLpa = (minIncomeRequired * 12) / 100_000;

    // Per-criterion pass/fail
    const cibilOk = cibil >= minCibil;
    const cibilClose = !cibilOk && cibil >= minCibil - 50;
    const incomeOk = annualIncomeLpa >= minIncomeRequiredLpa * 0.85; // 15% buffer
    const loanAmountOk = loanLakhs <= maxLoanLakhs;
    const defaultsOk = !priorDefaults;

    // Estimate EMI for FOIR check (rough, using midpoint rate)
    const midRate = (rateMin + rateMax) / 2;
    const tenureMonths = 240; // 20yr default for scoring
    const mr = midRate / 12 / 100;
    const factor = Math.pow(1 + mr, tenureMonths);
    const estEmi = mr > 0 ? (loanAmount * mr * factor) / (factor - 1) : loanAmount / tenureMonths;
    const totalFoir = totalIncome > 0 ? ((existingEmis + estEmi) / totalIncome) * 100 : 100;
    const foirOk = totalFoir <= foirCap;

    // Build criteria description lines
    const criteriaLines: string[] = [];

    if (cibilOk) {
      criteriaLines.push(`✓ CIBIL ${cibil} meets minimum of ${minCibil}`);
    } else if (cibilClose) {
      criteriaLines.push(`⚠ CIBIL ${cibil} is ${minCibil - cibil} pts below ${bank.shortName}'s minimum of ${minCibil}`);
    } else {
      criteriaLines.push(`✗ CIBIL ${cibil} below required ${minCibil} — gap of ${minCibil - cibil} pts`);
    }

    if (foirOk) {
      criteriaLines.push(`✓ FOIR ${totalFoir.toFixed(0)}% within ${foirCap}% cap`);
    } else {
      criteriaLines.push(`✗ FOIR ${totalFoir.toFixed(0)}% exceeds ${foirCap}% — reduce EMI obligations`);
    }

    if (!defaultsOk) {
      criteriaLines.push(`✗ Prior defaults on record — secured loan / guarantor required`);
    } else {
      criteriaLines.push(`✓ No prior defaults — clean repayment history`);
    }

    if (!loanAmountOk) {
      criteriaLines.push(`✗ ₹${loanLakhs.toFixed(0)}L exceeds ${bank.shortName}'s max of ₹${maxLoanLakhs}L`);
    } else {
      criteriaLines.push(`✓ Loan amount ₹${loanLakhs.toFixed(0)}L within product ceiling`);
    }

    // Score (0-100)
    let score = 0;
    if (cibilOk) score += 40;
    else if (cibilClose) score += 15;
    if (foirOk) score += 25;
    if (defaultsOk) score += 20;
    if (loanAmountOk) score += 15;

    // Tier
    let matchTier: MatchTier = 'Ineligible';
    if (score >= 85) matchTier = 'High';
    else if (score >= 55) matchTier = 'Moderate';
    else if (score >= 30) matchTier = 'Low';
    else matchTier = 'Ineligible';

    // Hard disqualifiers
    if (priorDefaults && !cibilOk) matchTier = 'Ineligible';
    if (!loanAmountOk) matchTier = score >= 60 ? 'Low' : 'Ineligible';

    return {
      bankId: bank.id,
      bankName: bank.name,
      shortName: bank.shortName,
      matchTier,
      indicativeRate: rateMin,
      rateMax,
      minCibil,
      criteriaLines,
      matchScore: score,
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}

interface RiskPredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenReport: (result: PredictionResult) => void;
  prefillProfile?: Partial<ApplicantProfile>;
}

export const RiskPredictionModal: React.FC<RiskPredictionModalProps> = ({
  isOpen,
  onClose,
  onOpenReport,
  prefillProfile,
}) => {
  const { t, language } = useLanguage();
  // Input features for ML classifier
  const [fullName, setFullName] = useState(prefillProfile?.fullName || 'Vikram Malhotra');
  const [monthlyIncome, setMonthlyIncome] = useState<number>(prefillProfile?.monthlyIncome || 110000);
  const [coApplicantIncome, setCoApplicantIncome] = useState<number>(
    prefillProfile?.coApplicantIncome || 40000
  );
  const [loanAmount, setLoanAmount] = useState<number>(
    prefillProfile?.loanAmountRequested || 5500000
  );
  const [tenureYears, setTenureYears] = useState<number>(prefillProfile?.tenureYears || 20);
  const [loanType, setLoanType] = useState<LoanType>(prefillProfile?.loanType || 'home');
  const [cibilScore, setCibilScore] = useState<number>(prefillProfile?.cibilScore || 780);
  const [existingEmis, setExistingEmis] = useState<number>(
    prefillProfile?.existingEmiObligations || 22000
  );
  const [priorDefaults, setPriorDefaults] = useState<boolean>(
    prefillProfile?.priorDefaults ?? false
  );
  const [workExperienceYears, setWorkExperienceYears] = useState<number>(
    prefillProfile?.workExperienceYears || 8
  );
  const [collateralValue, setCollateralValue] = useState<number>(
    prefillProfile?.collateralValue || 7500000
  );

  // Status
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [quadResults, setQuadResults] = useState<CombinedMlAssessment | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ── Live reactive bank matrix (updates on every input change, debounced 350ms) ──
  const [liveBankCards, setLiveBankCards] = useState<LiveBankCard[]>(() =>
    computeLiveBankMatrix(780, 110000, 40000, 5500000, 22000, false, 'home').slice(0, 9)
  );
  const [bankMatrixLoading, setBankMatrixLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const recomputeBankMatrix = useCallback(() => {
    setBankMatrixLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const cards = computeLiveBankMatrix(
        cibilScore, monthlyIncome, coApplicantIncome,
        loanAmount, existingEmis, priorDefaults, loanType
      ).slice(0, 9);
      setLiveBankCards(cards);
      setBankMatrixLoading(false);
    }, 350);
  }, [cibilScore, monthlyIncome, coApplicantIncome, loanAmount, existingEmis, priorDefaults, loanType]);

  // Re-run whenever any input changes
  useEffect(() => {
    recomputeBankMatrix();
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [recomputeBankMatrix]);

  // Sync state whenever modal is opened or prefillProfile changes
  React.useEffect(() => {
    if (isOpen && prefillProfile) {
      if (prefillProfile.fullName) setFullName(prefillProfile.fullName);
      if (prefillProfile.monthlyIncome) setMonthlyIncome(prefillProfile.monthlyIncome);
      if (prefillProfile.coApplicantIncome !== undefined) setCoApplicantIncome(prefillProfile.coApplicantIncome);
      if (prefillProfile.loanAmountRequested) setLoanAmount(prefillProfile.loanAmountRequested);
      if (prefillProfile.tenureYears) setTenureYears(prefillProfile.tenureYears);
      if (prefillProfile.loanType) setLoanType(prefillProfile.loanType);
      if (prefillProfile.cibilScore) setCibilScore(prefillProfile.cibilScore);
      if (prefillProfile.existingEmiObligations !== undefined) setExistingEmis(prefillProfile.existingEmiObligations);
      if (prefillProfile.priorDefaults !== undefined) setPriorDefaults(prefillProfile.priorDefaults);
      if (prefillProfile.workExperienceYears !== undefined) setWorkExperienceYears(prefillProfile.workExperienceYears);
      if (prefillProfile.collateralValue !== undefined) setCollateralValue(prefillProfile.collateralValue);
    }
  }, [isOpen, prefillProfile]);

  const loadPresetProfile = (type: 'prime' | 'moderate' | 'high_risk') => {
    setErrorMsg(null);
    if (type === 'prime') {
      setFullName('Aditi Roy');
      setMonthlyIncome(145000);
      setCoApplicantIncome(60000);
      setLoanAmount(6000000);
      setTenureYears(20);
      setLoanType('home');
      setCibilScore(810);
      setExistingEmis(15000);
      setPriorDefaults(false);
      setWorkExperienceYears(9);
      setCollateralValue(9000000);
    } else if (type === 'moderate') {
      setFullName('Kunal Verma');
      setMonthlyIncome(70000);
      setCoApplicantIncome(0);
      setLoanAmount(3500000);
      setTenureYears(15);
      setLoanType('home');
      setCibilScore(695);
      setExistingEmis(24000);
      setPriorDefaults(false);
      setWorkExperienceYears(3);
      setCollateralValue(4500000);
    } else {
      setFullName('Rohan Mehra');
      setMonthlyIncome(45000);
      setCoApplicantIncome(0);
      setLoanAmount(2800000);
      setTenureYears(10);
      setLoanType('personal');
      setCibilScore(590);
      setExistingEmis(22000);
      setPriorDefaults(true);
      setWorkExperienceYears(1);
      setCollateralValue(0);
    }
    setResult(null);
    setQuadResults(null);
  };

  const handlePredict = async () => {
    setLoading(true);
    setErrorMsg(null);

    const profile: ApplicantProfile = {
      fullName: fullName.trim() || 'Applicant',
      age: 33,
      employmentType: 'salaried',
      workExperienceYears,
      monthlyIncome: Number(monthlyIncome) || 50000,
      coApplicantIncome: Number(coApplicantIncome) || 0,
      existingEmiObligations: Number(existingEmis) || 0,
      cibilScore: Number(cibilScore) || 750,
      loanAmountRequested: Number(loanAmount) || 2000000,
      tenureYears: Number(tenureYears) || 15,
      loanType,
      priorDefaults,
      collateralValue: Number(collateralValue) || 0,
      residentialStatus: 'owned',
    };

    try {
      const [pred, quad] = await Promise.all([
        predictLoanRisk(profile),
        runAllMlModels({
          monthly_income: profile.monthlyIncome,
          income: profile.monthlyIncome * 12,
          co_applicant_income: profile.coApplicantIncome,
          loan_amount: profile.loanAmountRequested,
          term: profile.tenureYears * 12,
          tenure_years: profile.tenureYears,
          Credit_Score: profile.cibilScore,
          cibil_score: profile.cibilScore,
          property_value: profile.collateralValue,
          LTV: (profile.collateralValue && profile.collateralValue > 0) ? Number(((profile.loanAmountRequested / profile.collateralValue) * 100).toFixed(1)) : 75,
          dtir1: profile.monthlyIncome > 0 ? Number(((profile.existingEmiObligations / profile.monthlyIncome) * 100).toFixed(1)) : 25,
          existing_emis: profile.existingEmiObligations,
          prior_defaults: profile.priorDefaults,
          loan_type: profile.loanType,
          work_experience: profile.workExperienceYears,
        }),
      ]);
      setResult(pred);
      setQuadResults(quad);
    } catch (err: any) {
      console.error('Assessment execution error:', err);
      // Fallback evaluation guarantee so user ALWAYS receives appraisal
      try {
        const fallbackPred = await predictLoanRisk(profile);
        setResult(fallbackPred);
      } catch (fallbackErr) {
        setErrorMsg('Unable to complete assessment. Please verify your inputs and retry.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={t('risk.modalTitle', 'Machine Learning Risk Assessment')}
      subtitle={t('risk.modalSubtitle', 'Estimate default risk probability and key drivers using machine learning classification.')}
      maxWidth="4xl"
      variant="lavender"
      doodleIcon={<DoodleCalculator size={36} />}
    >
      <div className="space-y-6">
        {/* Sample Profile Switcher */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <p className="text-xs font-bold text-slate-800">
                {language === 'hi' ? 'त्वरित परीक्षण प्रोफ़ाइल (नमूना डेटा):' : 'Quick Test Archetypes (Sample Data):'}
              </p>
              <p className="text-[11px] text-slate-500">
                {language === 'hi' ? 'वास्तविक जोखिम श्रेणियों का तुरंत अनुकरण करें।' : 'Instantly simulate real-world risk tiers without manual data entry.'}
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => loadPresetProfile('prime')}
                className="px-2.5 py-1 text-xs font-semibold rounded-md border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                {t('common.lowRisk', 'Prime (Low Risk)')}
              </button>
              <button
                type="button"
                onClick={() => loadPresetProfile('moderate')}
                className="px-2.5 py-1 text-xs font-semibold rounded-md border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer"
              >
                {t('common.moderateRisk', 'Mid Tier (Moderate)')}
              </button>
              <button
                type="button"
                onClick={() => loadPresetProfile('high_risk')}
                className="px-2.5 py-1 text-xs font-semibold rounded-md border border-rose-300 bg-rose-50 text-rose-800 hover:bg-rose-100 transition-colors cursor-pointer"
              >
                {t('common.highRisk', 'Subprime (High Risk)')}
              </button>
            </div>
          </div>
        </div>

        {/* Feature Inputs Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{t('elig.fullName', 'Applicant Name')}</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('elig.monthlyIncome', 'Monthly Net Income')}
              </label>
              <span className="text-xs font-mono text-teal-800 font-medium">
                {formatINR(monthlyIncome)}
              </span>
            </div>
            <input
              type="number"
              step={5000}
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 outline-none font-mono"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('elig.coIncome', 'Co-Applicant Income')}
              </label>
              <span className="text-xs font-mono text-slate-500">
                {formatINR(coApplicantIncome)}
              </span>
            </div>
            <input
              type="number"
              step={5000}
              value={coApplicantIncome}
              onChange={(e) => setCoApplicantIncome(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 outline-none font-mono"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('elig.loanAmount', 'Loan Amount Requested')}
              </label>
              <span className="text-xs font-mono text-teal-900 font-bold">
                {formatINR(loanAmount)}
              </span>
            </div>
            <input
              type="number"
              step={50000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('elig.tenure', 'Loan Term (Years)')}
            </label>
            <input
              type="number"
              min={1}
              max={30}
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{t('elig.loanType', 'Loan Category')}</label>
            <select
              value={loanType === 'auto' ? 'auto' : loanType}
              onChange={(e) => setLoanType(e.target.value as LoanType)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 outline-none bg-white"
            >
              <option value="home">{t('common.homeLoan', 'Home Loan')}</option>
              <option value="personal">{t('common.personalLoan', 'Personal Loan')}</option>
              <option value="auto">{t('common.carLoan', 'Auto / Car Loan')}</option>
              <option value="business">{language === 'hi' ? 'व्यवसाय ऋण' : 'Business Loan'}</option>
              <option value="education">{t('common.educationLoan', 'Education Loan')}</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('elig.cibil', 'CIBIL Credit Score')}
              </label>
              <span className="text-xs font-mono font-bold text-teal-900">{cibilScore}</span>
            </div>
            <input
              type="number"
              min={300}
              max={900}
              value={cibilScore}
              onChange={(e) => setCibilScore(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 outline-none font-mono"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('elig.existingEmi', 'Existing EMIs (₹/mo)')}
              </label>
              <span className="text-xs font-mono text-slate-600">{formatINR(existingEmis)}</span>
            </div>
            <input
              type="number"
              step={1000}
              value={existingEmis}
              onChange={(e) => setExistingEmis(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {language === 'hi' ? 'पूर्व में कोई ऋण डिफ़ॉल्ट?' : 'Any Prior Loan Defaults?'}
            </label>
            <div className="flex items-center gap-4 mt-2">
              <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="defaults"
                  checked={!priorDefaults}
                  onChange={() => setPriorDefaults(false)}
                  className="accent-teal-600"
                />
                <span>{language === 'hi' ? 'नहीं (स्वच्छ रिकॉर्ड)' : 'No (Clean Record)'}</span>
              </label>
              <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="defaults"
                  checked={priorDefaults}
                  onChange={() => setPriorDefaults(true)}
                  className="accent-teal-600"
                />
                <span className="text-rose-700 font-semibold">{language === 'hi' ? 'हाँ (डिफ़ॉल्ट इतिहास)' : 'Yes (Default History)'}</span>
              </label>
            </div>
          </div>
        </div>

        {/* Prediction Trigger Button */}
        <div>
          <button
            type="button"
            onClick={handlePredict}
            disabled={loading}
            className="w-full py-3 text-sm font-bold text-white bg-gradient-to-r from-[#0B192C] via-[#1E3E62] to-teal-700 rounded-xl hover:opacity-95 shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            {loading ? (
              <span>{language === 'hi' ? 'मशीन लर्निंग मॉडल निष्पादित हो रहा है...' : 'Running Statistical Risk Model...'}</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-teal-300" />
                <span>{t('risk.predictBtn', 'Run Risk Predictor')}</span>
              </>
            )}
          </button>
        </div>

        {/* Prediction Results Output */}
        {result && (
          <div className="space-y-5 pt-4 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Verdict Headline Card */}
            <div
              className={`p-5 rounded-2xl border ${
                result.riskCategory === 'Low Risk'
                  ? 'bg-emerald-50/80 border-emerald-300'
                  : result.riskCategory === 'Moderate Risk'
                  ? 'bg-amber-50/80 border-amber-300'
                  : 'bg-rose-50/80 border-rose-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  {result.riskCategory === 'Low Risk' ? (
                    <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
                  ) : result.riskCategory === 'Moderate Risk' ? (
                    <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0" />
                  ) : (
                    <ShieldAlert className="w-8 h-8 text-rose-600 shrink-0" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase tracking-wider font-extrabold text-slate-500">
                        {t('risk.riskTier', 'Assessed Risk Tier')}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                          result.riskCategory === 'Low Risk'
                            ? 'bg-emerald-100 text-emerald-900'
                            : result.riskCategory === 'Moderate Risk'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-rose-100 text-rose-900'
                        }`}
                      >
                        {result.riskCategory}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mt-1">
                      {result.riskCategory === 'Low Risk'
                        ? language === 'hi' ? 'उच्च क्रेडिट स्वीकृति क्षमता' : 'High Probability of Credit Sanction'
                        : result.riskCategory === 'Moderate Risk'
                        ? language === 'hi' ? 'मध्यम जोखिम प्रोफ़ाइल' : 'Conditional Approval / Moderate Risk Profile'
                        : language === 'hi' ? 'उच्च डिफ़ॉल्ट जोखिम' : 'Elevated Default Probability / High Risk'}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {t('risk.defaultProb', 'Probability of Default')}:{' '}
                      <span className="font-mono font-bold text-slate-900">
                        {result.riskProbability}%
                      </span>{' '}
                      ({language === 'hi' ? 'मानक बैंक सीमा' : 'Standard bank approval threshold'} &le; 35%).
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <button
                    type="button"
                    onClick={() => onOpenReport(result)}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-teal-700" />
                    <span>{t('risk.viewReport', 'Generate Appraisal Dossier')}</span>
                  </button>
                </div>
              </div>

              {/* Progress Risk Gauge */}
              <div className="mt-4 pt-3 border-t border-slate-200/60">
                <div className="flex items-center justify-between text-xs mb-1 font-semibold text-slate-700">
                  <span>{language === 'hi' ? 'जोखिम स्पेक्ट्रम' : 'Risk Spectrum Scale'}</span>
                  <span className="font-mono">{result.riskProbability}% {language === 'hi' ? 'जोखिम' : 'Risk'}</span>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden flex">
                  <div className="w-[30%] bg-emerald-500" title="Low Risk 0-30%" />
                  <div className="w-[30%] bg-amber-500" title="Moderate Risk 30-60%" />
                  <div className="w-[40%] bg-rose-500" title="High Risk 60-100%" />
                </div>
                <div className="relative w-full h-2 mt-1">
                  <div
                    className="absolute -top-1 w-2.5 h-2.5 bg-slate-900 rounded-full border-2 border-white shadow-xs transform -translate-x-1/2"
                    style={{ left: `${result.riskProbability}%` }}
                    title={`Probability: ${result.riskProbability}%`}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5 font-mono">
                  <span>0% ({t('common.lowRisk', 'Prime')})</span>
                  <span>30% ({t('common.moderateRisk', 'Moderate')})</span>
                  <span>60% ({t('common.highRisk', 'High Risk')})</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            {/* 4-Model Concurrent Inference Intelligence Card */}
            {quadResults && (
              <div className="p-4 rounded-2xl bg-[#0B192C] text-white border border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-teal-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                      {language === 'hi' ? '4-मॉडल समवर्ती सांख्यिकीय मूल्यांकन' : '4-Model Concurrent Inference Outputs'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Scikit-Learn Microservice</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {/* Model 1: Default Risk */}
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/70">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">1. Default Risk</div>
                    <div className="text-sm font-bold text-white mt-1">
                      {(quadResults.defaultRisk.default_probability * 100).toFixed(1)}%
                    </div>
                    <div className="text-[10px] text-teal-400 font-semibold mt-0.5">
                      {quadResults.defaultRisk.risk_level}
                    </div>
                  </div>

                  {/* Model 2: Dynamic Rate */}
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/70">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">2. Dynamic Rate</div>
                    <div className="text-sm font-bold text-teal-300 mt-1">
                      {quadResults.dynamicRate.personalized_interest_rate.toFixed(2)}%
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                      ±{quadResults.dynamicRate.mae_accuracy_margin}% MAE
                    </div>
                  </div>

                  {/* Model 3: Safe Capacity */}
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/70">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">3. Safe Capacity</div>
                    <div className="text-sm font-bold text-indigo-300 mt-1">
                      {formatINR(quadResults.safeCapacity.max_safe_borrowing_limit)}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                      R²: {quadResults.safeCapacity.model_r2_accuracy}
                    </div>
                  </div>

                  {/* Model 4: Anomaly Detection */}
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/70">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">4. Anomaly Screening</div>
                    <div className={`text-sm font-bold mt-1 ${quadResults.anomalyDetection.is_anomaly ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {quadResults.anomalyDetection.is_anomaly ? 'Audit Required' : 'Normal'}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 truncate font-mono">
                      Score: {quadResults.anomalyDetection.decision_score}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <ShapExplanationCard explanations={result.shap_explanation} />

            {/* Feature Factor Importance Breakdown */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-600" />
                <span>{t('risk.shapTitle', 'Feature Importance Breakdown')}</span>
              </h5>
              <div className="space-y-3">
                {result.featureImportance.map((f, i) => (
                  <div key={i} className="text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        {f.impact === 'positive' ? (
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        )}
                        <span className="font-semibold text-slate-800">{f.factor}</span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-500">
                        {f.weightPercentage}% influence
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1">
                      <div
                        className={`h-full rounded-full ${
                          f.impact === 'positive' ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${f.weightPercentage * 2.5}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal">{f.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Matched Indian Banks Likelihood */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {language === 'hi' ? 'भारतीय बैंकों की संभावित स्वीकृति मैट्रिक्स' : 'Indian Bank Approval Likelihood Matrix'}
                </h5>
                <span className="text-[11px] text-slate-500 font-mono">
                  {liveBankCards.length} {language === 'hi' ? 'बैंक विश्लेषित' : 'Banks Assessed'}
                </span>
              </div>

              {liveBankCards.length > 0 ? (
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 transition-opacity ${
                    bankMatrixLoading ? 'opacity-60' : 'opacity-100'
                  }`}
                  aria-busy={bankMatrixLoading}
                >
                  {liveBankCards.map((b) => (
                    <div
                      key={b.bankId}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all shadow-2xs"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <BankLogo bankId={b.bankId} size="sm" />
                          <span className="text-xs font-bold text-slate-900">{b.bankName}</span>
                        </div>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            b.matchTier === 'High'
                              ? 'bg-emerald-100 text-emerald-800'
                              : b.matchTier === 'Moderate'
                              ? 'bg-amber-100 text-amber-800'
                              : b.matchTier === 'Low'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {b.matchTier}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {b.criteriaLines.map((line) => (
                          <p key={line} className="text-[11px] text-slate-600 leading-tight">
                            {line}
                          </p>
                        ))}
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                        <span>{t('banks.benchmarkRate', 'Base Rate')}:</span>
                        <span className="font-bold text-slate-900">
                          {b.indicativeRate}% - {b.rateMax}% {t('common.perAnnum', 'p.a.')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center text-xs text-slate-500">
                  {language === 'hi'
                    ? 'वर्तमान मानदंडों के तहत कोई बैंक उपलब्ध नहीं है। कृपया आय या सिबिल स्कोर समायोजित करें।'
                    : 'No specific commercial bank products matched your exact criteria. Consider adding a co-applicant to unlock prime lenders.'}
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200 text-xs text-teal-950">
              <h5 className="font-bold mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                <span>{language === 'hi' ? 'जोखिम कम करने के लिए प्रमुख उपाय' : 'Actionable Measures to Minimize Loan Risk'}</span>
              </h5>
              <ul className="list-disc pl-4 space-y-1 text-slate-700 text-[11px]">
                {result.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </ModalWrapper>
  );
};
