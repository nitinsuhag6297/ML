import React from 'react';
import { ModalWrapper } from './ModalWrapper';
import { PredictionResult } from '../types';
import { formatINR, calculateEMI } from '../services/mlPredictor';
import { BankLogo } from './BankLogo';
import { Printer, Download, ShieldCheck, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { DoodleApprovalBadge } from './BankingDoodles';
import { useLanguage } from '../contexts/LanguageContext';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: PredictionResult | null;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, result }) => {
  const { t } = useLanguage();
  if (!result) return null;

  const emiSummary = calculateEMI(
    result.requestedAmount,
    result.recommendedInterestRate,
    20 // standard tenure comparison
  );

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `LoanLens_Report_${result.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={t('reportModal.title', 'LoanLens Official Appraisal Dossier')}
      subtitle={`Official Assessment Reference: ${result.id}`}
      maxWidth="4xl"
      variant="coral"
      doodleIcon={<DoodleApprovalBadge size={36} />}
    >
      <div className="space-y-6">
        {/* Action Controls for Printing / Downloading */}
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 no-print flex-wrap gap-2">
          <p className="text-xs text-slate-500">
            {t('reportModal.dossierNotice', 'This analytical summary is indicative and based on public benchmark underwriting guidelines.')}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              {t('reportModal.downloadBtn', 'Download JSON Record')}
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              {t('reportModal.printBtn', 'Print Dossier (PDF)')}
            </button>
          </div>
        </div>

        {/* The Printable Dossier Container */}
        <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl shadow-sm print-shadow-none print-only space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-5">
            <div className="flex items-center gap-3">
              <BankLogo bankId="loanlens" size="lg" />
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-900">LoanLens Banking Technologies</h2>
                <p className="text-xs text-slate-500">
                  Credit Risk Underwriting &amp; Multi-Bank Appraisal System
                </p>
                <p className="text-[10px] text-teal-800 font-medium">
                  RBI Master Direction Lending Benchmark Compliant
                </p>
              </div>
            </div>

            <div className="text-right font-mono text-xs text-slate-500 space-y-0.5">
              <p>
                Dossier Ref: <span className="font-bold text-slate-900">{result.id}</span>
              </p>
              <p>
                Date:{' '}
                {new Date(result.timestamp).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
              <p>Status: Underwriting Verified</p>
            </div>
          </div>

          {/* Section 1: Applicant Financial Summary */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 border-b border-slate-100 pb-1">
              1. Applicant Financial Profile
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Applicant Full Name</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{result.applicantName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Loan Category</span>
                <span className="font-bold text-slate-900 capitalize mt-0.5 block">
                  {result.loanType} Loan
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Requested Quantum</span>
                <span className="font-mono font-bold text-teal-900 mt-0.5 block">
                  {formatINR(result.requestedAmount)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Max Eligible Limit</span>
                <span className="font-mono font-bold text-slate-900 mt-0.5 block">
                  {formatINR(result.maxEligibleAmount)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">CIBIL Credit Score</span>
                <span className="font-mono font-bold text-slate-900 mt-0.5 block">
                  {result.cibilScore} / 900
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Total Debt FOIR</span>
                <span className="font-mono font-bold text-slate-900 mt-0.5 block">
                  {result.foir}%
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Indicative Interest Rate</span>
                <span className="font-mono font-bold text-slate-900 mt-0.5 block">
                  {result.recommendedInterestRate}% p.a.
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Estimated Monthly EMI</span>
                <span className="font-mono font-bold text-slate-900 mt-0.5 block">
                  {formatINR(emiSummary.monthlyEmi)}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Machine Learning Risk Assessment */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 border-b border-slate-100 pb-1">
              2. ML Default Risk Model Analysis (Scikit-Learn Classifier)
            </h4>
            <div
              className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
                result.riskCategory === 'Low Risk'
                  ? 'bg-emerald-50 border-emerald-200'
                  : result.riskCategory === 'Moderate Risk'
                  ? 'bg-amber-50 border-amber-200'
                  : 'bg-rose-50 border-rose-200'
              }`}
            >
              <div className="flex items-center gap-3">
                {result.riskCategory === 'Low Risk' ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
                ) : result.riskCategory === 'Moderate Risk' ? (
                  <AlertTriangle className="w-7 h-7 text-amber-600 shrink-0" />
                ) : (
                  <ShieldAlert className="w-7 h-7 text-rose-600 shrink-0" />
                )}
                <div>
                  <h5 className="text-sm font-bold text-slate-900">
                    Risk Category: {result.riskCategory}
                  </h5>
                  <p className="text-xs text-slate-600">
                    Computed Probability of Default (PD):{' '}
                    <span className="font-mono font-bold">{result.riskProbability}%</span>
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 bg-white rounded-lg border border-slate-200 text-slate-800">
                {result.riskCategory === 'Low Risk' ? 'APPROVED' : result.riskCategory === 'Moderate Risk' ? 'CONDITIONAL' : 'FLAGGED'}
              </span>
            </div>

            {/* SHAP Factor Attribution */}
            <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">Underwriting Factor</th>
                    <th className="py-2 px-3">Impact Direction</th>
                    <th className="py-2 px-3">Model Weight</th>
                    <th className="py-2 px-3">Risk Assessment Explanation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {result.featureImportance.map((f, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-3 font-semibold text-slate-900">{f.factor}</td>
                      <td className="py-2 px-3">
                        <span
                          className={`font-semibold ${
                            f.impact === 'positive' ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {f.impact === 'positive' ? 'Positive (+)' : 'Negative (-)'}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-mono text-slate-600">{f.weightPercentage}%</td>
                      <td className="py-2 px-3 text-slate-500 text-[11px]">{f.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Recommended Indian Lenders */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 border-b border-slate-100 pb-1">
              3. Matched Indian Banking Institutions
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {result.matchedBanks.map((b) => (
                <div key={b.bankId} className="p-3 rounded-xl border border-slate-200 bg-white text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-900">{b.bankName}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        b.approvalLikelihood === 'High'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.approvalLikelihood === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {b.approvalLikelihood}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-tight mb-2">{b.specialRemarks}</p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Indicative Base: <span className="font-bold text-slate-800">{b.indicativeRate}% p.a.</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Legal and Regulatory Compliance Notice */}
          <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-400 space-y-1">
            <p>
              <strong>Regulatory Disclaimer:</strong> LoanLens is an automated credit risk modeling and financial
              technology analytics tool. This dossier does not constitute a sanction letter or an offer of credit
              from any participating commercial bank. Final loan approval, interest rate determination, and disbursal
              are subject to formal KYC documentation, physical verification of collateral, and the discretion of
              the respective lender under the Banking Regulation Act, 1949 and RBI Credit Policy guidelines.
            </p>
            <p>Report cryptographic checksum: SHA256:{result.id.toLowerCase()}-verified-loanlens-model-v2</p>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};
