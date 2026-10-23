import React, { useState } from 'react';
import { ModalWrapper } from './ModalWrapper';
import { Info, Sparkles } from 'lucide-react';
import { DoodleRupeeCoin } from './BankingDoodles';
import { useLanguage } from '../contexts/LanguageContext';

interface CreditScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialScore?: number;
}

export const CreditScoreModal: React.FC<CreditScoreModalProps> = ({
  isOpen,
  onClose,
  initialScore = 765,
}) => {
  const { t, language } = useLanguage();
  const [score, setScore] = useState<number>(initialScore);

  // Determine category
  const getScoreDetails = (val: number) => {
    if (val >= 780) {
      return {
        category: language === 'hi' ? 'उत्कृष्ट (780 - 900)' : 'Excellent',
        color: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        approvalOdds: language === 'hi'
          ? 'भारत के सभी बैंकों में न्यूनतम ब्याज दर और तत्काल स्वीकृति की सर्वाधिक संभावना।'
          : 'Prime interest rate tier across all Indian banks with rapid sanction probability.',
      };
    } else if (val >= 720) {
      return {
        category: language === 'hi' ? 'अच्छा (720 - 779)' : 'Very Good',
        color: 'text-teal-700',
        bg: 'bg-teal-50',
        border: 'border-teal-200',
        approvalOdds: language === 'hi'
          ? 'प्रतिस्पर्धी ब्याज दरों और मानक दस्तावेज़ीकरण के साथ आसान स्वीकृति।'
          : 'High probability of standard approval with competitive spreads.',
      };
    } else if (val >= 660) {
      return {
        category: language === 'hi' ? 'सामान्य (650 - 719)' : 'Good / Fair',
        color: 'text-blue-700',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        approvalOdds: language === 'hi'
          ? 'मानक खुदरा ऋणों के लिए पात्र; कुछ मामलों में अतिरिक्त आय प्रमाण मांगा जा सकता है।'
          : 'Eligible for retail loans with standard processing requirements.',
      };
    } else if (val >= 580) {
      return {
        category: language === 'hi' ? 'मध्यम (580 - 649)' : 'Moderate',
        color: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        approvalOdds: language === 'hi'
          ? 'सह-आवेदक, अधिक डाउनपेमेंट या अतिरिक्त संपार्श्विक की आवश्यकता हो सकती है।'
          : 'May require co-borrower, higher downpayment, or security collateral.',
      };
    } else {
      return {
        category: language === 'hi' ? 'सुधार आवश्यक (< 580)' : 'Poor / Subprime',
        color: 'text-rose-700',
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        approvalOdds: language === 'hi'
          ? 'अस्वीकृति का उच्च जोखिम; आवेदन से पहले क्रेडिट स्कोर सुधारने की सलाह दी जाती है।'
          : 'High risk of rejection; credit rehabilitation recommended first.',
      };
    }
  };

  const details = getScoreDetails(score);

  // Calculate needle rotation: 300 -> -90 deg, 900 -> 90 deg
  const needleAngle = -90 + ((score - 300) / 600) * 180;

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={t('cibilModal.title', 'CIBIL Bureau Simulator & Interest Sensitivity')}
      subtitle={t('cibilModal.subtitle', 'How your credit score dictates interest rate spreads across Indian banks')}
      maxWidth="3xl"
      variant="yellow"
      doodleIcon={<DoodleRupeeCoin size={36} />}
    >
      <div className="space-y-6">
        {/* Verification & Demo Notice Banner */}
        <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">
              {language === 'hi' ? 'स्व-मूल्यांकन सिमुलेटर सूचना' : 'Self-Reported Demo Score Notice'}
            </p>
            <p className="text-[11px] text-amber-800 leading-normal mt-0.5">
              {language === 'hi'
                ? 'यह स्कोर जोखिम और ब्याज दर संवेदनशीलता का अनुमान लगाने के लिए एक इंटरैक्टिव सिमुलेशन है। वास्तविक बैंक ऋण के लिए आरबीआई-लाइसेंस प्राप्त ब्यूरो से आधिकारिक पूछताछ आवश्यक है।'
                : 'The score displayed here is an interactive benchmark for risk and interest rate estimation. Official lending decisions require an authenticated credit inquiry directly with RBI licensed bureaus.'}
            </p>
          </div>
        </div>

        {/* Interactive Gauge and Score Banner */}
        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* SVG Semi-Circle Gauge */}
            <div className="relative w-56 h-32 flex flex-col items-center justify-end overflow-hidden">
              <svg viewBox="0 0 200 120" className="w-full h-full">
                {/* Background arc tracks */}
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="20"
                  strokeLinecap="round"
                />
                {/* Colored segments */}
                <path
                  d="M 20 100 A 80 80 0 0 1 55 45"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="18"
                  strokeLinecap="round"
                />
                <path
                  d="M 55 45 A 80 80 0 0 1 100 20"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="18"
                />
                <path
                  d="M 100 20 A 80 80 0 0 1 145 45"
                  fill="none"
                  stroke="#0d9488"
                  strokeWidth="18"
                />
                <path
                  d="M 145 45 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="18"
                  strokeLinecap="round"
                />

                {/* Needle */}
                <g transform={`rotate(${needleAngle}, 100, 100)`}>
                  <line x1="100" y1="100" x2="100" y2="35" stroke="#0f172a" strokeWidth="3" />
                  <circle cx="100" cy="100" r="7" fill="#0f172a" />
                </g>
              </svg>
              <div className="absolute bottom-0 text-center">
                <span className="text-2xl font-black font-mono text-slate-900">{score}</span>
                <span className="text-[10px] text-slate-400 block font-mono">Range 300 - 900</span>
              </div>
            </div>

            {/* Score Category Description */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                  {language === 'hi' ? 'क्रेडिट रेटिंग' : 'Credit Rating'}
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${details.bg} ${details.color} border ${details.border}`}
                >
                  {details.category}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{details.approvalOdds}</p>

              {/* Score Slider */}
              <div className="pt-2">
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>{language === 'hi' ? 'स्कोर समायोजित करें:' : 'Adjust Score:'}</span>
                  <span className="font-mono font-bold text-slate-900">{score} {language === 'hi' ? 'अंक' : 'pts'}</span>
                </div>
                <input
                  type="range"
                  min={300}
                  max={900}
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>300 (Subprime)</span>
                  <span>650</span>
                  <span>750 (Prime)</span>
                  <span>900</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5 Pillars of Indian Credit Score */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
            {language === 'hi' ? 'क्रेडिट स्कोर के प्रमुख स्तंभ' : 'Key Pillars of Your Credit Health'}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900">
                  {language === 'hi' ? '1. पुनर्भुगतान इतिहास' : '1. Repayment History'}
                </span>
                <span className="text-xs font-mono font-semibold text-teal-800">35% Weight</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                {language === 'hi'
                  ? 'समय पर ईएमआई और क्रेडिट कार्ड बिलों का भुगतान। पिछले 24 महीनों में शून्य चूक न्यूनतम ब्याज दर के लिए महत्वपूर्ण है।'
                  : 'Punctuality on prior EMI and card dues. Zero missed EMIs in 24 months is crucial for prime bank pricing.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900">
                  {language === 'hi' ? '2. क्रेडिट उपयोग अनुपात' : '2. Credit Utilization Ratio'}
                </span>
                <span className="text-xs font-mono font-semibold text-teal-800">30% Weight</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                {language === 'hi'
                  ? 'क्रेडिट कार्ड सीमा का उपयोग प्रतिशत। उपयोग को 30% से कम रखने से स्कोर में सुधार होता है।'
                  : 'Percentage of credit card limits utilized. Keeping utilization below 30% protects your score.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900">
                  {language === 'hi' ? '3. क्रेडिट इतिहास की आयु' : '3. Credit History Age'}
                </span>
                <span className="text-xs font-mono font-semibold text-teal-800">15% Weight</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                {language === 'hi'
                  ? 'आपके सबसे पुराने सक्रिय खाते की अवधि। पुराना वित्तीय इतिहास दीर्घकालिक वित्तीय अनुशासन को दर्शाता है।'
                  : 'Vintage of your oldest active credit card or loan account. Older accounts showcase discipline.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900">
                  {language === 'hi' ? '4. क्रेडिट मिश्रण' : '4. Credit Mix & Inquiries'}
                </span>
                <span className="text-xs font-mono font-semibold text-teal-800">20% Weight</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                {language === 'hi'
                  ? 'सुरक्षित ऋणों (गृह/वाहन) और असुरक्षित कार्डों का संतुलित मिश्रण, तथा कम क्रेडिट पूछताछ।'
                  : 'Healthy balance of secured loans and unsecured cards, with minimal hard inquiries in 90 days.'}
              </p>
            </div>
          </div>
        </div>

        {/* Practical Tips */}
        <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-200 text-xs text-slate-700">
          <p className="font-bold text-teal-950 mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-700" />
            <span>{language === 'hi' ? 'क्रेडिट स्कोर सुधारने के उपयोगी उपाय:' : 'Proven Steps to Protect & Improve CIBIL:'}</span>
          </p>
          <ul className="list-disc pl-4 space-y-1 text-[11px]">
            <li>{language === 'hi' ? 'क्रेडिट कार्ड बिलों का हमेशा समय पर पूरा भुगतान करें; ऑटो-डेबिट सेट करें।' : 'Never default on credit card dues; set up auto-debit for full payment.'}</li>
            <li>{language === 'hi' ? 'कार्ड सीमा का 30% से अधिक खर्च न करें (उदा. ₹1,00,000 की सीमा पर अधिकतम ₹30,000)।' : 'Maintain credit card spending under 30% of total limit.'}</li>
            <li>{language === 'hi' ? 'एक साथ कई बैंकों या ऐप्स में व्यक्तिगत ऋण के लिए बार-बार आवेदन न करें।' : 'Avoid applying for multiple personal loans simultaneously across different apps/banks.'}</li>
          </ul>
        </div>
      </div>
    </ModalWrapper>
  );
};
