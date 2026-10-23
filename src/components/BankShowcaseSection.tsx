import React, { useState, useMemo, useEffect } from 'react';
import { MULTIBANK_DATA, MultiBankRecord } from '../data/multiBankDataset';
import { BankLogo } from './BankLogo';
import {
  ArrowRight,
  Landmark,
  Search,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  Tag,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export interface DistinctBank {
  bankName: string;
  institutionType: MultiBankRecord['institutionType'];
  products: string[];
  records: MultiBankRecord[];
  activeRecord: MultiBankRecord;
  minRate: number;
  maxRate: number;
  minFee: number;
  minCibil: number;
  maxTenure: number;
  minLoanLakhs: number;
  maxLoanLakhs: number;
  specialFeatures: string;
  regionFocus: string;
  dataConfidence: string;
}

interface BankShowcaseSectionProps {
  onOpenCompareBanks: () => void;
  onSelectForEmi?: (amount: number, rate: number, tenure: number) => void;
}

export const BankShowcaseSection: React.FC<BankShowcaseSectionProps> = ({
  onOpenCompareBanks,
  onSelectForEmi,
}) => {
  const { t, language } = useLanguage();
  // Default to 'All' so that when no loan category is selected, ALL distinct banks available in dataset are shown
  const [selectedProduct, setSelectedProduct] = useState<string>('All');
  const [selectedInstitutionType, setSelectedInstitutionType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const CARDS_PER_PAGE = 4; // Exactly 4 cards per page on desktop

  // Dynamically extract all available product categories from dataset
  const productTabs = useMemo(() => {
    const categories = new Set<string>();
    MULTIBANK_DATA.forEach((r) => {
      if (r.productName) categories.add(r.productName);
    });
    return ['All', ...Array.from(categories)];
  }, []);

  // Dynamically extract all institution types from dataset
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
      // If a category filter is active, only include banks that have a matching record
      if (selectedProduct !== 'All' && record.productName !== selectedProduct) {
        continue;
      }

      // If institution type filter is active
      if (selectedInstitutionType !== 'All' && record.institutionType !== selectedInstitutionType) {
        continue;
      }

      // If search query is present
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = record.bankName.toLowerCase().includes(q);
        const matchesProduct = record.productName.toLowerCase().includes(q);
        const matchesType = record.institutionType.toLowerCase().includes(q);
        const matchesFeatures = record.specialFeatures?.toLowerCase().includes(q) ?? false;
        const matchesRegion = record.regionFocus?.toLowerCase().includes(q) ?? false;

        if (!matchesName && !matchesProduct && !matchesType && !matchesFeatures && !matchesRegion) {
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

      // In Category mode, the activeRecord is the matching category record
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
        // In All mode, track lowest rate and aggregate bounds
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
  }, [selectedProduct, selectedInstitutionType, searchQuery]);

  // Reset pagination to page 1 whenever any filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedProduct, selectedInstitutionType, searchQuery]);

  // Dynamic pagination calculation
  const totalPages = Math.max(1, Math.ceil(distinctBanks.length / CARDS_PER_PAGE));
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
  const endIndex = Math.min(startIndex + CARDS_PER_PAGE, distinctBanks.length);
  const currentBanks = distinctBanks.slice(startIndex, endIndex);

  // Derive bank ID for logo
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

  const handleResetFilters = () => {
    setSelectedProduct('All');
    setSelectedInstitutionType('All');
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Build clean page numbers window
  const getPaginationNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <section id="banks" className="py-16 lg:py-24 bg-[#FFF7ED]/60 border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-900 border border-orange-200 text-xs font-bold uppercase tracking-wider mb-2">
              <Landmark className="w-3.5 h-3.5 text-orange-700" />
              <span>{t('banks.kicker', 'Indian Commercial Lenders Benchmark')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B192C] tracking-tight">
              {t('banks.heading', 'Compare Leading Commercial Banks')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              {t('banks.subheading', 'Directly queried from benchmark loan schemes across Indian commercial banks, public lenders, SFBs, and NBFCs.')}
            </p>
          </div>

          {/* Launch Full Comparison Matrix Modal Button */}
          <button
            type="button"
            onClick={onOpenCompareBanks}
            className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer self-start md:self-auto"
          >
            <span>{t('banks.viewModalBtn', 'Open Full Side-by-Side Comparison')}</span>
            <ArrowRight className="w-4 h-4 text-orange-400" />
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="space-y-4 mb-8">
          {/* Product Category Tabs (Starting with 'All' to show all distinct banks by default) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {productTabs.map((prod) => (
              <button
                key={prod}
                type="button"
                onClick={() => setSelectedProduct(prod)}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  selectedProduct === prod
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {prod === 'All' ? t('banks.allCategories', 'All Banks & Products') : prod}
              </button>
            ))}
          </div>

          {/* Sub-filters: Institution Types + Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-orange-200/80 shadow-2xs">
            {/* Institution Filter Options */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                {t('banks.lenderType', 'Lender Type:')}
              </span>
              {institutionTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedInstitutionType(type)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    selectedInstitutionType === type
                      ? 'bg-orange-100 text-orange-900 font-bold border border-orange-300'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {type === 'All' ? t('banks.allBanks', 'All Banks') : type}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder={t('banks.searchPlaceholder', 'Search bank name or feature...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Results Count & Current Filter Context */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-4 px-1">
          <span>
            {t('common.showing', 'Showing')}{' '}
            <strong className="text-slate-900 font-mono">
              {distinctBanks.length > 0 ? startIndex + 1 : 0} - {endIndex}
            </strong>{' '}
            {t('common.of', 'of')}{' '}
            <strong className="text-slate-900 font-mono">{distinctBanks.length}</strong>{' '}
            {t('banks.distinctBanks', 'Distinct Institutions')}
            {selectedProduct !== 'All' && (
              <span className="text-teal-700 font-semibold ml-1">
                ({selectedProduct})
              </span>
            )}
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            {t('common.page', 'Page')} {currentPage} {t('common.of', 'of')} {totalPages}
          </span>
        </div>

        {/* Live MultiBank Cards Grid: Exactly 4 distinct bank cards on desktop (2x2 grid) */}
        {currentBanks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
            {currentBanks.map((bank, index) => {
              const bankId = getBankId(bank.bankName);
              const isPsu = bank.institutionType === 'PSU';
              const isGovt = bank.institutionType === 'Govt';
              const isSFB = bank.institutionType === 'SFB';

              return (
                <div
                  key={`${bank.bankName}-${startIndex + index}`}
                  className="p-5 rounded-2xl bg-white border border-orange-100 hover:border-orange-300 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Bank Header with authentic emblem & institution badge */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <BankLogo bankId={bankId} size="md" />
                        <div>
                          <h4 className="text-sm font-black text-slate-900 leading-tight">
                            {bank.bankName}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md border ${
                                isPsu
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : isGovt
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : isSFB
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-purple-50 text-purple-700 border-purple-200'
                              }`}
                            >
                              {bank.institutionType}
                            </span>
                            {selectedProduct !== 'All' ? (
                              <span className="text-[10px] text-teal-800 font-semibold bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                                {selectedProduct}
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-500 font-medium">
                                {bank.products.length} {t('banks.productsCount', 'products')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                        {bank.dataConfidence}
                      </span>
                    </div>

                    {/* Benchmark Interest Rate & Key Rates Box */}
                    <div className="p-3.5 bg-gradient-to-r from-orange-50/70 via-amber-50/40 to-white rounded-xl border border-orange-100 mb-3 space-y-2">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs font-semibold text-slate-600">
                          {selectedProduct !== 'All'
                            ? t('banks.benchmarkRate', 'Benchmark Rate:')
                            : t('banks.ratesFrom', 'Rates from:')}
                        </span>
                        <span className="text-lg font-black font-mono text-orange-900">
                          {bank.minRate.toFixed(2)}%{' '}
                          <span className="text-xs font-normal text-slate-500">{t('common.perAnnum', 'p.a.')}</span>
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-orange-100/60 text-[11px] text-slate-600">
                        <div>
                          <span className="text-slate-400 block text-[10px]">{t('banks.processingFee', 'Processing Fee')}</span>
                          <span className="font-semibold">
                            {selectedProduct !== 'All' ? `${bank.minFee}%` : `From ${bank.minFee}%`}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-400 block text-[10px]">{t('banks.monthlyEmiPerLakh', 'Monthly EMI / Lakh')}</span>
                          <span className="font-bold font-mono text-teal-800">
                            ₹{Math.round(bank.activeRecord.monthlyEmiPerLakh).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Eligibility Bounds */}
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3 p-2.5 bg-slate-50 rounded-xl">
                      <div>
                        <span className="text-[10px] text-slate-400 block">{t('banks.minCibil', 'Min CIBIL')}</span>
                        <span className="font-bold text-slate-800 font-mono">
                          {bank.minCibil > 0 ? `${bank.minCibil}+` : t('banks.flexible', 'Flexible')}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">{t('banks.maxTenure', 'Max Tenure')}</span>
                        <span className="font-bold text-slate-800 font-mono">
                          {bank.maxTenure} {t('common.years', 'Years')}
                        </span>
                      </div>
                    </div>

                    {/* Available Loan Products Tags (when in All mode) or Special Features */}
                    {selectedProduct === 'All' ? (
                      <div className="mb-3">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1.5">
                          {t('banks.schemesOffered', 'Schemes Offered')} ({bank.products.length}):
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {bank.products.map((prod) => (
                            <span
                              key={prod}
                              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                            >
                              {prod}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-600 mb-3">
                        <p className="text-[11px] font-semibold text-teal-800 flex items-center gap-1 line-clamp-1">
                          <Sparkles className="w-3 h-3 text-teal-600 shrink-0" />
                          <span>{bank.specialFeatures || t('banks.termsApply', 'Standard commercial terms apply')}</span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400 font-mono">
                      ₹{bank.minLoanLakhs}L - ₹{bank.maxLoanLakhs}L
                    </span>
                    <div className="flex items-center gap-2">
                      {onSelectForEmi && (
                        <button
                          type="button"
                          onClick={() =>
                            onSelectForEmi(
                              bank.activeRecord.minLoanLakhs * 100000 || 2500000,
                              bank.minRate,
                              Math.min(20, bank.maxTenure)
                            )
                          }
                          className="text-xs font-bold text-teal-700 hover:text-teal-900 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>{t('banks.useForEmi', 'Calculate EMI')}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State when filters yield no matches */
          <div className="p-10 rounded-3xl bg-white border border-dashed border-orange-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {t('banks.noResultsTitle', 'No Matching Banks Found')}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                {t('banks.noResultsDesc', 'No loan schemes matched your selected product category and search criteria. Try selecting another category or clearing filters.')}
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-800 bg-orange-100 hover:bg-orange-200 rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('banks.resetFilters', 'Reset Filters')}</span>
            </button>
          </div>
        )}

        {/* Functional Numbered Pagination Controls */}
        {distinctBanks.length > CARDS_PER_PAGE && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-orange-200/80">
            {/* Range info */}
            <p className="text-xs text-slate-500">
              {t('common.showing', 'Showing')}{' '}
              <strong className="text-slate-900 font-mono">
                {startIndex + 1} - {endIndex}
              </strong>{' '}
              {t('common.of', 'of')}{' '}
              <strong className="text-slate-900 font-mono">{distinctBanks.length}</strong>{' '}
              {t('banks.distinctBanks', 'Distinct Institutions')}
            </p>

            {/* Pagination Button Bar */}
            <div className="flex items-center gap-1">
              {/* Previous Button */}
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  currentPage === 1
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400 shadow-2xs'
                }`}
                aria-label="Previous page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('common.previous', 'Previous')}</span>
              </button>

              {/* Numbered Page Buttons */}
              <div className="flex items-center gap-1">
                {getPaginationNumbers().map((p, idx) => {
                  if (p === '...') {
                    return (
                      <span key={`ellipsis-${idx}`} className="px-2 text-xs text-slate-400 select-none">
                        ...
                      </span>
                    );
                  }
                  const pageNum = Number(p);
                  const isCurrent = pageNum === currentPage;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`min-w-8 h-8 px-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
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

              {/* Next Button */}
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  currentPage === totalPages
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400 shadow-2xs'
                }`}
                aria-label="Next page"
              >
                <span className="hidden sm:inline">{t('common.next', 'Next')}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
