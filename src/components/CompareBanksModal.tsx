import React, { useState, useMemo, useEffect } from 'react';
import { ModalWrapper } from './ModalWrapper';
import { MULTIBANK_DATA, MultiBankRecord, INSTITUTION_POLICIES } from '../data/multiBankDataset';
import { BankLogo } from './BankLogo';
import {
  Check,
  Search,
  ArrowRightLeft,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { DoodleBankBuilding } from './BankingDoodles';
import { useLanguage } from '../contexts/LanguageContext';
import { DistinctBank } from './BankShowcaseSection';

interface CompareBanksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectForEmi?: (amount: number, rate: number, tenure: number) => void;
}

export const CompareBanksModal: React.FC<CompareBanksModalProps> = ({
  isOpen,
  onClose,
  onSelectForEmi,
}) => {
  const { t, language } = useLanguage();
  // Default to 'All' to show all distinct banks available in dataset
  const [selectedProduct, setSelectedProduct] = useState<string>('All');
  const [selectedInstitutionType, setSelectedInstitutionType] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [selectedBankNames, setSelectedBankNames] = useState<string[]>([
    'State Bank of India (SBI)',
    'HDFC Bank',
  ]);
  const [comparisonMode, setComparisonMode] = useState<boolean>(false);
  const [modalPage, setModalPage] = useState<number>(1);

  const MODAL_PAGE_SIZE = 4; // Exactly 4 cards per page

  // Dynamic product categories
  const productOptions = useMemo(() => {
    const categories = new Set<string>();
    MULTIBANK_DATA.forEach((r) => {
      if (r.productName) categories.add(r.productName);
    });
    return ['All', ...Array.from(categories)];
  }, []);

  // Dynamic institution types
  const institutionTypes = useMemo(() => {
    const types = new Set<string>();
    MULTIBANK_DATA.forEach((r) => {
      if (r.institutionType) types.add(r.institutionType);
    });
    return ['All', ...Array.from(types)];
  }, []);

  // Extract every distinct bank or financial institution from dataset
  const distinctBanks = useMemo(() => {
    const bankMap = new Map<string, DistinctBank>();

    for (const record of MULTIBANK_DATA) {
      if (selectedProduct !== 'All' && record.productName !== selectedProduct) {
        continue;
      }

      if (selectedInstitutionType !== 'All' && record.institutionType !== selectedInstitutionType) {
        continue;
      }

      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase().trim();
        const matchesName = record.bankName.toLowerCase().includes(q);
        const matchesProduct = record.productName.toLowerCase().includes(q);
        const matchesType = record.institutionType.toLowerCase().includes(q);
        const matchesFeatures = record.specialFeatures?.toLowerCase().includes(q) ?? false;
        if (!matchesName && !matchesProduct && !matchesType && !matchesFeatures) {
          continue;
        }
      }

      if (!bankMap.has(record.bankName)) {
        bankMap.set(record.bankName, {
          bankName: record.bankName,
          institutionType: record.institutionType,
          products: [],
          records: [],
          activeRecord: record,
          minRate: record.interestRatePct,
          maxRate: record.interestRatePct,
          minFee: record.processingFeePct,
          minCibil: record.cibilRequired,
          maxTenure: record.maxTenureYrs,
          minLoanLakhs: record.minLoanLakhs,
          maxLoanLakhs: record.maxLoanLakhs,
          specialFeatures: record.specialFeatures,
          regionFocus: record.regionFocus,
          dataConfidence: record.dataConfidence,
        });
      }

      const bank = bankMap.get(record.bankName)!;
      if (!bank.products.includes(record.productName)) {
        bank.products.push(record.productName);
      }
      bank.records.push(record);

      if (selectedProduct !== 'All') {
        bank.activeRecord = record;
        bank.minRate = record.interestRatePct;
        bank.minFee = record.processingFeePct;
        bank.minCibil = record.cibilRequired;
        bank.maxTenure = record.maxTenureYrs;
        bank.minLoanLakhs = record.minLoanLakhs;
        bank.maxLoanLakhs = record.maxLoanLakhs;
        bank.specialFeatures = record.specialFeatures;
      } else {
        if (record.interestRatePct < bank.minRate) {
          bank.minRate = record.interestRatePct;
          bank.activeRecord = record;
        }
        if (record.interestRatePct > bank.maxRate) bank.maxRate = record.interestRatePct;
        if (record.processingFeePct < bank.minFee) bank.minFee = record.processingFeePct;
        if (record.cibilRequired > 0 && (bank.minCibil === 0 || record.cibilRequired < bank.minCibil)) {
          bank.minCibil = record.cibilRequired;
        }
        if (record.maxTenureYrs > bank.maxTenure) bank.maxTenure = record.maxTenureYrs;
        if (record.minLoanLakhs < bank.minLoanLakhs) bank.minLoanLakhs = record.minLoanLakhs;
        if (record.maxLoanLakhs > bank.maxLoanLakhs) bank.maxLoanLakhs = record.maxLoanLakhs;
      }
    }

    return Array.from(bankMap.values());
  }, [selectedProduct, selectedInstitutionType, searchFilter]);

  // Reset pagination on filter change
  useEffect(() => {
    setModalPage(1);
  }, [selectedProduct, selectedInstitutionType, searchFilter]);

  const totalPages = Math.max(1, Math.ceil(distinctBanks.length / MODAL_PAGE_SIZE));
  const startIndex = (modalPage - 1) * MODAL_PAGE_SIZE;
  const endIndex = Math.min(startIndex + MODAL_PAGE_SIZE, distinctBanks.length);
  const paginatedModalBanks = distinctBanks.slice(startIndex, endIndex);

  const getPaginationNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (modalPage > 3) pages.push('...');
      const start = Math.max(2, modalPage - 1);
      const end = Math.min(totalPages - 1, modalPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (modalPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const toggleSelectBank = (bankName: string) => {
    if (selectedBankNames.includes(bankName)) {
      if (selectedBankNames.length > 1) {
        setSelectedBankNames(selectedBankNames.filter((n) => n !== bankName));
      }
    } else {
      if (selectedBankNames.length < 3) {
        setSelectedBankNames([...selectedBankNames, bankName]);
      } else {
        setSelectedBankNames([selectedBankNames[1], selectedBankNames[2], bankName]);
      }
    }
  };

  const getBankId = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('sbi') || lower.includes('state bank')) return 'sbi';
    if (lower.includes('hdfc')) return 'hdfc';
    if (lower.includes('icici')) return 'icici';
    if (lower.includes('axis')) return 'axis';
    if (lower.includes('kotak')) return 'kotak';
    if (lower.includes('baroda') || lower.includes('bob')) return 'bob';
    if (lower.includes('punjab') || lower.includes('pnb')) return 'pnb';
    if (lower.includes('canara')) return 'canara';
    if (lower.includes('union')) return 'union';
    if (lower.includes('au')) return 'au';
    if (lower.includes('lic')) return 'lic';
    if (lower.includes('bajaj')) return 'bajaj';
    if (lower.includes('tata')) return 'tata';
    if (lower.includes('pm awas') || lower.includes('clss')) return 'pm awas';
    if (lower.includes('national housing') || lower.includes('nhb')) return 'national housing';
    if (lower.includes('navi')) return 'navi';
    return name;
  };

  // Find distinct bank objects for side-by-side comparison
  const comparedBanks = useMemo(() => {
    const map = new Map<string, DistinctBank>();
    distinctBanks.forEach((b) => map.set(b.bankName, b));
    return selectedBankNames
      .map((name) => map.get(name))
      .filter((b): b is DistinctBank => Boolean(b));
  }, [distinctBanks, selectedBankNames]);

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={t('compareModal.title', 'MultiBank Product Comparison Matrix')}
      subtitle={t('compareModal.subtitle', 'Authentic lender offerings benchmarked across India')}
      maxWidth="5xl"
      variant="peach"
      doodleIcon={<DoodleBankBuilding size={36} />}
    >
      <div className="space-y-6">
        {/* Controls Bar: Product Tabs & View Toggle */}
        <div className="flex flex-col gap-4">
          {/* Product Pill Row (starting with All) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {productOptions.map((prod) => (
              <button
                key={prod}
                type="button"
                onClick={() => setSelectedProduct(prod)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                  selectedProduct === prod
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {prod === 'All' ? t('banks.allCategories', 'All Banks & Products') : prod}
              </button>
            ))}
          </div>

          {/* Search, Institution Filter & Table vs Cards toggle */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative min-w-[200px]">
                <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder={t('banks.searchPlaceholder', 'Filter by bank or scheme...')}
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-100 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              {/* Institution Type Dropdown */}
              <select
                value={selectedInstitutionType}
                onChange={(e) => setSelectedInstitutionType(e.target.value)}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 border border-slate-200 text-slate-700 focus:outline-none"
              >
                <option value="All">{t('banks.allBanks', 'All Lender Types')}</option>
                {institutionTypes
                  .filter((t) => t !== 'All')
                  .map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
              </select>
            </div>

            {/* Toggle Table Comparison Mode */}
            <button
              type="button"
              onClick={() => setComparisonMode(!comparisonMode)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                comparisonMode
                  ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>
                {comparisonMode
                  ? language === 'hi'
                    ? 'कार्ड दृश्य पर स्विच करें'
                    : 'Switch to Card View'
                  : `${language === 'hi' ? 'चयनित की तुलना करें' : 'Compare Selected'} (${
                      comparedBanks.length
                    })`}
              </span>
            </button>
          </div>
        </div>

        {/* Side-by-Side Comparison Matrix Table Mode */}
        {comparisonMode ? (
          <div className="space-y-4 animate-in fade-in duration-200">
            {comparedBanks.length > 0 ? (
              <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4 w-44 font-bold text-slate-800">
                        {language === 'hi' ? 'संस्थान मीट्रिक' : 'Institution Metric'}
                      </th>
                      {comparedBanks.map((item, idx) => (
                        <th key={idx} className="py-3.5 px-4 font-bold text-slate-900 min-w-[200px]">
                          <div className="flex items-center gap-2">
                            <BankLogo bankId={getBankId(item.bankName)} size="sm" />
                            <div>
                              <p className="font-extrabold">{item.bankName}</p>
                              <span className="text-[10px] text-slate-500 font-normal">
                                {item.institutionType}
                              </span>
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-700 bg-slate-50/60">
                        {selectedProduct !== 'All'
                          ? t('banks.benchmarkRate', 'Benchmark Rate')
                          : t('banks.ratesFrom', 'Lowest Rate')}
                      </td>
                      {comparedBanks.map((item, idx) => (
                        <td key={idx} className="py-3 px-4 font-mono font-black text-teal-900 text-sm">
                          {item.minRate.toFixed(2)}% {t('common.perAnnum', 'p.a.')}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-700 bg-slate-50/60">
                        {t('banks.processingFee', 'Processing Fee')}
                      </td>
                      {comparedBanks.map((item, idx) => (
                        <td key={idx} className="py-3 px-4 font-semibold text-slate-800">
                          {selectedProduct !== 'All'
                            ? `${item.minFee}%`
                            : `From ${item.minFee}%`}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-700 bg-slate-50/60">
                        {t('banks.minCibil', 'Min CIBIL Required')}
                      </td>
                      {comparedBanks.map((item, idx) => (
                        <td key={idx} className="py-3 px-4 font-mono font-bold text-slate-900">
                          {item.minCibil > 0 ? `${item.minCibil}+` : t('banks.flexible', 'Flexible')}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-700 bg-slate-50/60">
                        {t('banks.maxTenure', 'Tenure Window')}
                      </td>
                      {comparedBanks.map((item, idx) => (
                        <td key={idx} className="py-3 px-4 font-mono text-slate-800">
                          Up to {item.maxTenure} {t('common.years', 'Years')}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-700 bg-slate-50/60">
                        {language === 'hi' ? 'ऋण राशि सीमा' : 'Loan Quantum Range'}
                      </td>
                      {comparedBanks.map((item, idx) => (
                        <td key={idx} className="py-3 px-4 text-slate-800 font-mono">
                          ₹{item.minLoanLakhs}L - ₹{item.maxLoanLakhs}L
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-700 bg-slate-50/60">
                        {t('banks.schemesOffered', 'Schemes Offered')}
                      </td>
                      {comparedBanks.map((item, idx) => (
                        <td key={idx} className="py-3 px-4 text-[11px] text-slate-700">
                          <div className="flex flex-wrap gap-1">
                            {item.products.map((p) => (
                              <span
                                key={p}
                                className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-medium"
                              >
                                {p}
                              </span>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-700 bg-slate-50/60">
                        {language === 'hi' ? 'विशेष सुविधाएं' : 'Special Features'}
                      </td>
                      {comparedBanks.map((item, idx) => (
                        <td key={idx} className="py-3 px-4 text-[11px] text-teal-800 font-medium">
                          {item.specialFeatures || t('banks.termsApply', 'Standard commercial terms apply')}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 border border-dashed rounded-xl">
                <p>
                  {language === 'hi'
                    ? 'तुलना करने के लिए कृपया कार्ड दृश्य से कम से कम 1 बैंक चुनें।'
                    : 'Please select at least 1 bank from the card view to compare.'}
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Cards Grid Mode with 4-card pagination */
          <div className="space-y-4">
            {paginatedModalBanks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paginatedModalBanks.map((bank, index) => {
                  const bankId = getBankId(bank.bankName);
                  const isSelected = selectedBankNames.includes(bank.bankName);

                  return (
                    <div
                      key={bank.bankName}
                      className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50/20 shadow-md ring-1 ring-teal-600'
                          : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      <div>
                        {/* Header */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2.5">
                            <BankLogo bankId={bankId} size="md" />
                            <div>
                              <h4 className="text-sm font-bold text-slate-900 leading-tight">
                                {bank.bankName}
                              </h4>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[10px] text-slate-500 font-medium">
                                  {bank.institutionType}
                                </span>
                                {selectedProduct !== 'All' ? (
                                  <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-1 rounded">
                                    {selectedProduct}
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-400">
                                    · {bank.products.length} {t('banks.productsCount', 'products')}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleSelectBank(bank.bankName)}
                            className={`w-5 h-5 rounded flex items-center justify-center border transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-teal-700 border-teal-700 text-white'
                                : 'border-slate-300 hover:border-slate-400 bg-white'
                            }`}
                            title="Select for comparison matrix"
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </button>
                        </div>

                        {/* Interest Rate & Key Metrics */}
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-2 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-500">
                              {selectedProduct !== 'All'
                                ? t('banks.benchmarkRate', 'Benchmark Rate:')
                                : t('banks.ratesFrom', 'Rates from:')}
                            </span>
                            <span className="text-sm font-mono font-extrabold text-teal-900">
                              {bank.minRate.toFixed(2)}% {t('common.perAnnum', 'p.a.')}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-600">
                            <span>{t('banks.processingFee', 'Processing Fee')}:</span>
                            <span className="font-mono font-semibold">
                              {selectedProduct !== 'All' ? `${bank.minFee}%` : `From ${bank.minFee}%`}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-600">
                            <span>{t('banks.minCibil', 'Min CIBIL')}:</span>
                            <span className="font-mono font-semibold">
                              {bank.minCibil > 0 ? `${bank.minCibil}+` : t('banks.flexible', 'Flexible')}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-600">
                            <span>{t('banks.maxTenure', 'Tenure')}:</span>
                            <span className="font-mono font-semibold">
                              Up to {bank.maxTenure} {t('common.years', 'Yrs')}
                            </span>
                          </div>
                        </div>

                        {/* Special Feature or Products list */}
                        {selectedProduct === 'All' ? (
                          <div className="mb-2">
                            <div className="flex flex-wrap gap-1">
                              {bank.products.slice(0, 4).map((p) => (
                                <span
                                  key={p}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700"
                                >
                                  {p}
                                </span>
                              ))}
                              {bank.products.length > 4 && (
                                <span className="text-[10px] px-1.5 py-0.5 text-slate-400">
                                  +{bank.products.length - 4} more
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <p className="text-[11px] text-teal-800 font-medium mb-3 line-clamp-2">
                            <Sparkles className="w-3 h-3 text-teal-600 inline mr-1" />
                            {bank.specialFeatures || t('banks.termsApply', 'Standard commercial terms apply')}
                          </p>
                        )}
                      </div>

                      {/* Card Bottom Meta */}
                      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span>
                          ₹{bank.minLoanLakhs}L - ₹{bank.maxLoanLakhs}L
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleSelectBank(bank.bankName)}
                          className="text-teal-700 font-bold hover:underline cursor-pointer"
                        >
                          {isSelected
                            ? language === 'hi'
                              ? 'चयनित'
                              : 'Selected'
                            : language === 'hi'
                            ? 'तुलना में जोड़ें'
                            : 'Select to Compare'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 border border-dashed rounded-xl">
                <p>{t('banks.noResultsTitle', 'No Matching Banks Found')}</p>
              </div>
            )}

            {/* Pagination inside Modal */}
            {distinctBanks.length > MODAL_PAGE_SIZE && (
              <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs">
                <span className="text-slate-500">
                  {t('common.showing', 'Showing')}{' '}
                  <strong className="text-slate-900 font-mono">
                    {startIndex + 1} - {endIndex}
                  </strong>{' '}
                  {t('common.of', 'of')}{' '}
                  <strong className="text-slate-900 font-mono">{distinctBanks.length}</strong>{' '}
                  {t('banks.distinctBanks', 'Distinct Institutions')}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setModalPage((p) => Math.max(1, p - 1))}
                    disabled={modalPage === 1}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs font-semibold">{t('common.previous', 'Previous')}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {getPaginationNumbers().map((p, idx) => {
                      if (p === '...') {
                        return (
                          <span key={`modal-ellipsis-${idx}`} className="px-1 text-xs text-slate-400 select-none">
                            ...
                          </span>
                        );
                      }
                      const pageNum = Number(p);
                      const isCurrent = pageNum === modalPage;
                      return (
                        <button
                          key={`modal-page-${pageNum}`}
                          type="button"
                          onClick={() => setModalPage(pageNum)}
                          className={`min-w-7 h-7 px-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-teal-700 text-white shadow-xs font-black'
                              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                          }`}
                          aria-label={`Go to page ${pageNum}`}
                          aria-current={isCurrent ? 'page' : undefined}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setModalPage((p) => Math.min(totalPages, p + 1))}
                    disabled={modalPage === totalPages}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    aria-label="Next page"
                  >
                    <span className="hidden sm:inline text-xs font-semibold">{t('common.next', 'Next')}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Institution Policies Accordion Summary */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-2">
          <p className="font-bold text-slate-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            <span>
              {language === 'hi'
                ? 'आरबीआई ऋण ढांचा और नीतियां'
                : 'RBI Institutional Lending Framework & Policies'}
            </span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-500">
            {INSTITUTION_POLICIES.slice(0, 4).map((p, i) => (
              <div key={i} className="p-2 rounded-lg bg-white border border-slate-100">
                <span className="font-bold text-slate-700 block">{p.type}</span>
                <span className="line-clamp-2">{p.keyRules}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};
