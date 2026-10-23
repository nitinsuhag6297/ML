import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  Sparkles,
  RefreshCw,
  Cpu,
  Percent,
  Wallet,
  AlertTriangle,
  CheckCircle2,
  Lock,
  SearchCheck,
  SlidersHorizontal,
} from 'lucide-react';
import {
  runAllMlModels,
  CombinedMlAssessment,
  FinancialPayload,
} from '../services/mlService';
import { formatINR } from '../services/mlPredictor';
import { useLanguage } from '../contexts/LanguageContext';

interface MlQuadDashboardSectionProps {
  initialProfile?: {
    monthlyIncome?: number;
    loanAmount?: number;
    tenureYears?: number;
    cibilScore?: number;
    existingEmis?: number;
    collateralValue?: number;
  };
  onOpenDetailedReport?: () => void;
}

export const MlQuadDashboardSection: React.FC<MlQuadDashboardSectionProps> = ({
  initialProfile,
  onOpenDetailedReport,
}) => {
  const { language } = useLanguage();

  // Financial Input Form State
  const [monthlyIncome, setMonthlyIncome] = useState<number>(initialProfile?.monthlyIncome || 95000);
  const [loanAmount, setLoanAmount] = useState<number>(initialProfile?.loanAmount || 4500000);
  const [tenureYears, setTenureYears] = useState<number>(initialProfile?.tenureYears || 20);
  const [cibilScore, setCibilScore] = useState<number>(initialProfile?.cibilScore || 775);
  const [existingEmis, setExistingEmis] = useState<number>(initialProfile?.existingEmis || 18000);
  const [collateralValue, setCollateralValue] = useState<number>(
    initialProfile?.collateralValue || 6500000
  );

  // Live ML Models Output State
  const [assessment, setAssessment] = useState<CombinedMlAssessment | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'risk' | 'rate' | 'capacity' | 'anomaly'>('all');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Execute concurrent inference across all 4 ML model endpoints
  const executeInference = useCallback(async () => {
    setLoading(true);
    const ltv = collateralValue > 0 ? Number(((loanAmount / collateralValue) * 100).toFixed(1)) : 75;
    const dtir1 = monthlyIncome > 0 ? Number(((existingEmis / monthlyIncome) * 100).toFixed(1)) : 20;

    const payload: FinancialPayload = {
      monthly_income: monthlyIncome,
      income: monthlyIncome * 12,
      loan_amount: loanAmount,
      term: tenureYears * 12,
      tenure_years: tenureYears,
      Credit_Score: cibilScore,
      cibil_score: cibilScore,
      property_value: collateralValue,
      LTV: ltv,
      dtir1: dtir1,
      existing_emis: existingEmis,
      prior_defaults: cibilScore < 620,
    };

    try {
      const results = await runAllMlModels(payload);
      setAssessment(results);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error running ML models:', err);
    } finally {
      setLoading(false);
    }
  }, [monthlyIncome, loanAmount, tenureYears, cibilScore, existingEmis, collateralValue]);

  // Debounced inference so dragging sliders doesn't flood the server with dozens of requests
  useEffect(() => {
    const timer = setTimeout(() => {
      executeInference();
    }, 600);
    return () => clearTimeout(timer);
  }, [monthlyIncome, loanAmount, tenureYears, cibilScore, existingEmis, collateralValue, executeInference]);

  const applyPreset = (preset: 'prime' | 'moderate' | 'high_risk') => {
    if (preset === 'prime') {
      setMonthlyIncome(150000);
      setLoanAmount(6000000);
      setTenureYears(20);
      setCibilScore(820);
      setExistingEmis(15000);
      setCollateralValue(9000000);
    } else if (preset === 'moderate') {
      setMonthlyIncome(75000);
      setLoanAmount(3500000);
      setTenureYears(15);
      setCibilScore(710);
      setExistingEmis(22000);
      setCollateralValue(4800000);
    } else {
      setMonthlyIncome(40000);
      setLoanAmount(3000000);
      setTenureYears(10);
      setCibilScore(590);
      setExistingEmis(24000);
      setCollateralValue(3200000);
    }
  };

  const isHindi = language === 'hi';

  return (
    <section
      id="ml-quad-suite"
      className="py-12 bg-gradient-to-b from-white via-slate-50/70 to-[#FAF5FF]/40 border-b border-indigo-100/70"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold uppercase tracking-wider mb-2">
              <Cpu className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
              <span>{isHindi ? '4-मॉडल एकीकृत प्रेडिक्टिव इंजन' : 'Live 4-Model ML Intelligence Suite'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B192C] tracking-tight">
              {isHindi ? 'मशीन लर्निंग ऋण मूल्यांकन व विसंगति विश्लेषण' : 'Machine Learning Underwriting Suite'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
              {isHindi
                ? 'चारों प्रशिक्षित Scikit-Learn मॉडलों को समवर्ती रूप से निष्पादित करें: डिफ़ॉल्ट जोखिम, व्यक्तिगत ब्याज दर, अधिकतम सुरक्षित ऋण क्षमता, और आवेदन धोखाधड़ी संसूचक।'
                : 'Concurrently evaluates 4 trained Scikit-Learn models on your financial inputs: Default Risk Classifier, Dynamic Rate Predictor, Safe Capacity Estimator, and Fraud Anomaly Detector.'}
            </p>
          </div>

          {/* Quick Archetype Preset Selector */}
          <div className="flex items-center gap-1.5 flex-wrap self-start md:self-auto">
            <span className="text-[11px] font-bold text-slate-500 mr-1">
              {isHindi ? 'प्रीसेट:' : 'Presets:'}
            </span>
            <button
              type="button"
              onClick={() => applyPreset('prime')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              {isHindi ? 'प्राइम (उत्कृष्ट)' : 'Prime (780+)'}
            </button>
            <button
              type="button"
              onClick={() => applyPreset('moderate')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer"
            >
              {isHindi ? 'मध्यम' : 'Mid-Tier'}
            </button>
            <button
              type="button"
              onClick={() => applyPreset('high_risk')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-rose-300 bg-rose-50 text-rose-800 hover:bg-rose-100 transition-colors cursor-pointer"
            >
              {isHindi ? 'सबप्राइम' : 'High Risk'}
            </button>
          </div>
        </div>

        {/* Interactive Financial Form Bar */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-teal-700" />
              <h3 className="text-sm font-black text-slate-900">
                {isHindi ? 'वित्तीय इनपुट पैरामीटर्स (लाइव मॉडल फीचर्स)' : 'Live Model Financial Inputs'}
              </h3>
            </div>
            {lastUpdated && (
              <span className="text-[11px] text-slate-400 font-mono">
                {isHindi ? 'अंतिम रिफ्रेश:' : 'Last Inferred:'} {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 1. Monthly Net Income */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                <label>{isHindi ? 'मासिक शुद्ध आय (Net Income)' : 'Monthly Net Income'}</label>
                <span className="font-mono text-teal-700 font-bold">{formatINR(monthlyIncome)}</span>
              </div>
              <input
                type="range"
                min={25000}
                max={400000}
                step={5000}
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>₹25K</span>
                <span>₹2L</span>
                <span>₹4L+</span>
              </div>
            </div>

            {/* 2. Requested Loan Amount */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                <label>{isHindi ? 'ऋण राशि (Loan Amount)' : 'Requested Loan Amount'}</label>
                <span className="font-mono text-indigo-700 font-bold">{formatINR(loanAmount)}</span>
              </div>
              <input
                type="range"
                min={200000}
                max={20000000}
                step={100000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full accent-indigo-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>₹2L</span>
                <span>₹1 Cr</span>
                <span>₹2 Cr</span>
              </div>
            </div>

            {/* 3. CIBIL Bureau Score */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                <label>{isHindi ? 'सिबिल स्कोर (CIBIL Score)' : 'CIBIL Bureau Score'}</label>
                <span className={`font-mono font-bold ${cibilScore >= 750 ? 'text-emerald-700' : cibilScore >= 650 ? 'text-amber-700' : 'text-rose-700'}`}>
                  {cibilScore} / 900
                </span>
              </div>
              <input
                type="range"
                min={300}
                max={900}
                step={5}
                value={cibilScore}
                onChange={(e) => setCibilScore(Number(e.target.value))}
                className="w-full accent-emerald-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>300 (Subprime)</span>
                <span>750 (Prime)</span>
                <span>900</span>
              </div>
            </div>

            {/* 4. Tenure (Years) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                <label>{isHindi ? 'अवधि (Tenure)' : 'Loan Tenure'}</label>
                <span className="font-mono text-slate-900 font-bold">{tenureYears} {isHindi ? 'वर्ष' : 'Years'} ({tenureYears * 12} mo)</span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full accent-slate-800 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>1 Yr</span>
                <span>15 Yrs</span>
                <span>30 Yrs</span>
              </div>
            </div>

            {/* 5. Existing Monthly EMIs */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                <label>{isHindi ? 'मौजूदा मासिक ईएमआई' : 'Existing Monthly Obligations'}</label>
                <span className="font-mono text-slate-700 font-bold">{formatINR(existingEmis)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={150000}
                step={2000}
                value={existingEmis}
                onChange={(e) => setExistingEmis(Number(e.target.value))}
                className="w-full accent-slate-700 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>₹0</span>
                <span>₹50K</span>
                <span>₹1.5L</span>
              </div>
            </div>

            {/* 6. Collateral / Property Value */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                <label>{isHindi ? 'संपत्ति / संपार्श्विक मूल्य' : 'Collateral / Property Value'}</label>
                <span className="font-mono text-teal-800 font-bold">{formatINR(collateralValue)}</span>
              </div>
              <input
                type="range"
                min={500000}
                max={25000000}
                step={250000}
                value={collateralValue}
                onChange={(e) => setCollateralValue(Number(e.target.value))}
                className="w-full accent-teal-700 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>₹5L</span>
                <span>₹1.2 Cr</span>
                <span>₹2.5 Cr</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
              <span>LTV: {collateralValue > 0 ? ((loanAmount / collateralValue) * 100).toFixed(1) : 0}%</span>
              <span>FOIR: {monthlyIncome > 0 ? ((existingEmis / monthlyIncome) * 100).toFixed(1) : 0}%</span>
            </div>

            <button
              type="button"
              onClick={executeInference}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#0B192C] via-[#1E3E62] to-teal-700 rounded-xl hover:opacity-95 shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? (isHindi ? 'मॉडल गणना जारी है...' : 'Evaluating Models...') : (isHindi ? '4-मॉडल समवर्ती अनुमान निष्पादित करें' : 'Run 4-Model Inference')}</span>
            </button>
          </div>
        </div>

        {/* 4 MODEL OUTPUTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* ================= MODEL 1: DEFAULT RISK CLASSIFIER ================= */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  Model 1
                </span>
                <span className="text-[10px] font-mono text-slate-400">/api/predict</span>
              </div>

              <div>
                <h4 className="text-sm font-extrabold text-[#0B192C]">
                  {isHindi ? 'डिफ़ॉल्ट जोखिम क्लासिफायर' : 'Default Risk Classifier'}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {isHindi ? 'क्रेडिट डिफॉल्ट की सांख्यिकीय संभावना' : 'Supervised probability of loan default'}
                </p>
              </div>

              {assessment ? (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-medium">{isHindi ? 'जोखिम श्रेणी' : 'Risk Tier'}</span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        assessment.defaultRisk.risk_level === 'Low Risk'
                          ? 'bg-emerald-100 text-emerald-800'
                          : assessment.defaultRisk.risk_level === 'Moderate Risk'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {assessment.defaultRisk.risk_level}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-2xl font-black font-mono text-slate-900">
                      {(assessment.defaultRisk.default_probability * 100).toFixed(1)}%
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {isHindi ? 'डिफ़ॉल्ट प्रायिकता' : 'Default Prob'}
                    </span>
                  </div>

                  {/* Progress Meter */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        assessment.defaultRisk.default_probability < 0.3
                          ? 'bg-emerald-500'
                          : assessment.defaultRisk.default_probability < 0.6
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, assessment.defaultRisk.default_probability * 100)}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="h-20 flex items-center justify-center text-xs text-slate-400">
                  {isHindi ? 'लोड हो रहा है...' : 'Calculating...'}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">{isHindi ? 'मानक बेंचमार्क:' : 'Bank Cap:'} &le; 35%</span>
              {assessment?.defaultRisk.default_probability && assessment.defaultRisk.default_probability < 0.35 ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> {isHindi ? 'स्वीकार्य' : 'Approved'}
                </span>
              ) : (
                <span className="text-amber-700 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> {isHindi ? 'उच्च समीक्षा' : 'Caution'}
                </span>
              )}
            </div>
          </div>

          {/* ================= MODEL 2: DYNAMIC INTEREST RATE PREDICTOR ================= */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-800">
                  Model 2
                </span>
                <span className="text-[10px] font-mono text-slate-400">/api/predict-rate</span>
              </div>

              <div>
                <h4 className="text-sm font-extrabold text-[#0B192C]">
                  {isHindi ? 'डायनामिक ब्याज दर प्रेडिक्टर' : 'Dynamic Rate Predictor'}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {isHindi ? 'क्रेडिट प्रोफाइल पर आधारित अनुकूलित दर' : 'Risk-adjusted personalized lending rate'}
                </p>
              </div>

              {assessment ? (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-medium">{isHindi ? 'मॉडल प्रेडिक्शन' : 'Model Output'}</span>
                    <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-teal-50 text-teal-800 border border-teal-200">
                      ±{assessment.dynamicRate.mae_accuracy_margin}% MAE
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-2xl font-black font-mono text-teal-700">
                      {assessment.dynamicRate.personalized_interest_rate.toFixed(2)}%
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {isHindi ? 'वार्षिक ब्याज दर' : 'p.a. Rate'}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-teal-50/60 border border-teal-100 text-[11px] text-teal-900 leading-tight">
                    {assessment.dynamicRate.personalized_interest_rate < 8.5
                      ? isHindi
                        ? 'उत्कृष्ट सिबिल स्कोर के कारण 0.35% स्प्रेड छूट उपलब्ध।'
                        : 'Eligible for prime tier discounted bank spread.'
                      : isHindi
                        ? 'जोखिम भारित मानक फ्लोटिंग ब्याज दर स्तर।'
                        : 'Standard risk-adjusted floating benchmark tier.'}
                  </div>
                </div>
              ) : (
                <div className="h-20 flex items-center justify-center text-xs text-slate-400">
                  {isHindi ? 'लोड हो रहा है...' : 'Calculating...'}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">{isHindi ? 'आरबीआई रेपो संदर्भ:' : 'Repo Ref:'} 6.50%</span>
              <span className="text-teal-700 font-bold flex items-center gap-1">
                <Percent className="w-3.5 h-3.5" /> Live ML Spread
              </span>
            </div>
          </div>

          {/* ================= MODEL 3: SAFE BORROWING CAPACITY ESTIMATOR ================= */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800">
                  Model 3
                </span>
                <span className="text-[10px] font-mono text-slate-400">/api/predict-capacity</span>
              </div>

              <div>
                <h4 className="text-sm font-extrabold text-[#0B192C]">
                  {isHindi ? 'सुरक्षित ऋण क्षमता अनुमानक' : 'Safe Capacity Estimator'}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {isHindi ? 'सस्टेनेबल अधिकतम उधार सीमा' : 'Maximum sustainable borrowing limit'}
                </p>
              </div>

              {assessment ? (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-medium">{isHindi ? 'मॉडल सटीकता' : 'Fit Score'}</span>
                    <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
                      R²: {assessment.safeCapacity.model_r2_accuracy}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-2xl font-black font-mono text-indigo-900">
                      {formatINR(assessment.safeCapacity.max_safe_borrowing_limit)}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-indigo-50/60 border border-indigo-100 text-[11px] text-indigo-900 leading-tight">
                    {loanAmount <= assessment.safeCapacity.max_safe_borrowing_limit ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 shrink-0" />
                        {isHindi ? 'मांग सुरक्षित क्षमता के भीतर है।' : 'Requested amount is within safe limit.'}
                      </span>
                    ) : (
                      <span className="text-amber-800 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 shrink-0" />
                        {isHindi ? 'मांग सुरक्षित क्षमता से अधिक है।' : 'Exceeds recommended safe borrowing.'}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-20 flex items-center justify-center text-xs text-slate-400">
                  {isHindi ? 'लोड हो रहा है...' : 'Calculating...'}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">{isHindi ? 'वर्तमान अनुरोध:' : 'Requested:'} {formatINR(loanAmount)}</span>
              <span className="text-indigo-700 font-bold flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5" /> FOIR Shielded
              </span>
            </div>
          </div>

          {/* ================= MODEL 4: APPLICATION FRAUD & ANOMALY DETECTOR ================= */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-800">
                  Model 4
                </span>
                <span className="text-[10px] font-mono text-slate-400">/api/detect-anomaly</span>
              </div>

              <div>
                <h4 className="text-sm font-extrabold text-[#0B192C]">
                  {isHindi ? 'धोखाधड़ी व विसंगति संसूचक' : 'Anomaly & Fraud Detector'}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {isHindi ? 'असामान्य वित्तीय विषमता का पता लगाना' : 'Outlier & suspicious anomaly screening'}
                </p>
              </div>

              {assessment ? (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-medium">{isHindi ? 'स्थिति' : 'Screening'}</span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        assessment.anomalyDetection.is_anomaly
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {assessment.anomalyDetection.anomaly_risk_level}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <span className={`text-xl font-black font-mono ${assessment.anomalyDetection.is_anomaly ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {assessment.anomalyDetection.is_anomaly
                        ? (isHindi ? 'ऑडिट आवश्यक' : 'Manual Audit')
                        : (isHindi ? 'स्वीकृत - सामान्य' : 'Verified Normal')}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Score: {assessment.anomalyDetection.decision_score}
                    </span>
                  </div>

                  <div className={`p-2 rounded-xl border text-[11px] leading-tight ${
                    assessment.anomalyDetection.is_anomaly
                      ? 'bg-rose-50 border-rose-200 text-rose-800'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  }`}>
                    {assessment.anomalyDetection.recommendation}
                  </div>
                </div>
              ) : (
                <div className="h-20 flex items-center justify-center text-xs text-slate-400">
                  {isHindi ? 'लोड हो रहा है...' : 'Calculating...'}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">{isHindi ? 'इंजन:' : 'Engine:'} Isolation Forest</span>
              <span className="text-purple-700 font-bold flex items-center gap-1">
                <SearchCheck className="w-3.5 h-3.5" /> AML Guard
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

