import React, { useState } from 'react';
import { ModalWrapper } from './ModalWrapper';
import { PredictionResult } from '../types';
import { formatINR } from '../services/mlPredictor';
import {
  Search,
  Trash2,
  FileText,
  AlertTriangle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { DoodleApprovalBadge } from './BankingDoodles';
import { useLanguage } from '../contexts/LanguageContext';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: PredictionResult[];
  onClearHistory: () => void;
  onDeleteItem: (id: string) => void;
  onSelectReport: (item: PredictionResult) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onDeleteItem,
  onSelectReport,
}) => {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.loanType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterRisk === 'all' || item.riskCategory.toLowerCase().includes(filterRisk.toLowerCase());

    return matchesSearch && matchesFilter;
  });

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={language === 'hi' ? 'पूर्वानुमान एवं मूल्यांकन इतिहास' : 'Prediction & Risk Assessment History'}
      subtitle={language === 'hi' ? 'आपके वर्तमान ब्राउज़र में स्थानीय रूप से सहेजे गए रिकॉर्ड।' : 'Locally saved loan evaluations and credit default predictions in your browser.'}
      maxWidth="4xl"
      variant="sky"
      doodleIcon={<DoodleApprovalBadge size={36} />}
    >
      <div className="space-y-4">
        {/* Local Storage Privacy Banner */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start justify-between gap-3">
          <p className="text-[11px] leading-relaxed">
            <span className="font-bold text-slate-800">
              {language === 'hi' ? 'ब्राउज़र सैंडबॉक्स गोपनीयता:' : 'Browser Local Storage Notice:'}
            </span>{' '}
            {language === 'hi'
              ? 'आपके मूल्यांकन रिकॉर्ड केवल आपके वर्तमान ब्राउज़र में स्थानीय रूप से सहेजे जाते हैं। कोई भी व्यक्तिगत डेटा किसी सर्वर पर नहीं भेजा जाता है।'
              : 'Your evaluation records are preserved strictly in your current browser\'s local storage. No personal data is sent to external cloud databases.'}
          </p>
          {history.length > 0 && !showConfirmClear && (
            <button
              type="button"
              onClick={() => setShowConfirmClear(true)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-md hover:bg-rose-100 transition-colors shrink-0 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t('dash.clearAll', 'Clear History')}</span>
            </button>
          )}
        </div>

        {/* Confirmation Dialog before clearing */}
        {showConfirmClear && (
          <div className="p-4 bg-rose-50 rounded-xl border border-rose-300 animate-in fade-in duration-150">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h5 className="text-xs font-bold text-rose-900">
                  {language === 'hi'
                    ? `क्या आप वास्तव में सभी ${history.length} रिकॉर्ड हटाना चाहते हैं?`
                    : `Are you sure you want to delete all ${history.length} prediction records?`}
                </h5>
                <p className="text-[11px] text-rose-700 mt-0.5">
                  {language === 'hi'
                    ? 'यह कार्रवाई स्थायी है और सभी स्थानीय ब्राउज़र रिकॉर्ड साफ़ कर देगी।'
                    : 'This action is permanent and clears all local browser evaluation history.'}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      onClearHistory();
                      setShowConfirmClear(false);
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-rose-700 rounded-md hover:bg-rose-800 transition-colors shadow-xs cursor-pointer"
                  >
                    {language === 'hi' ? 'हाँ, सभी हटाएं' : 'Yes, Clear All'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfirmClear(false)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'hi' ? 'नाम, आईडी या ऋण प्रकार से खोजें...' : 'Search by name, ID, or loan type...'}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-stretch sm:self-auto">
            {['all', 'low', 'moderate', 'high'].map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilterRisk(key)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md capitalize transition-colors cursor-pointer ${
                  filterRisk === key
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {key === 'all' ? (language === 'hi' ? 'सभी' : 'All') : `${key} Risk`}
              </button>
            ))}
          </div>
        </div>

        {/* History Table */}
        {filteredHistory.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">
              {language === 'hi' ? 'कोई मूल्यांकन इतिहास नहीं मिला' : 'No Evaluation History Found'}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {language === 'hi'
                ? 'रिकॉर्ड बनाने के लिए ऋण पात्रता या जोखिम जांच करें।'
                : 'Run a Loan Eligibility or ML Default Risk calculation to generate records.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 max-h-96">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">{language === 'hi' ? 'आवेदक / संदर्भ' : 'Reference / Applicant'}</th>
                  <th className="py-2.5 px-3">{t('emi.loanAmount', 'Loan Amount')}</th>
                  <th className="py-2.5 px-3">{t('elig.cibil', 'CIBIL')}</th>
                  <th className="py-2.5 px-3">{t('risk.riskTier', 'Risk Tier')}</th>
                  <th className="py-2.5 px-3">{t('risk.defaultProb', 'Default PD')}</th>
                  <th className="py-2.5 px-3">{language === 'hi' ? 'दिनांक' : 'Date'}</th>
                  <th className="py-2.5 px-3 text-right">{language === 'hi' ? 'कार्रवाई' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-sans">
                      <p className="font-bold text-slate-900">{item.applicantName}</p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.id} · {item.loanType}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-800 font-bold">
                      {formatINR(item.requestedAmount)}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">{item.cibilScore}</td>
                    <td className="py-2.5 px-3 font-sans">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          item.riskCategory === 'Low Risk'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.riskCategory === 'Moderate Risk'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {item.riskCategory}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">{item.riskProbability}%</td>
                    <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                      {new Date(item.timestamp).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </td>
                    <td className="py-2.5 px-3 text-right font-sans">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            onSelectReport(item);
                            onClose();
                          }}
                          className="p-1 text-teal-700 hover:text-teal-900 hover:bg-teal-50 rounded transition-colors cursor-pointer"
                          title="View appraisal report"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteItem(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="Delete entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ModalWrapper>
  );
};
