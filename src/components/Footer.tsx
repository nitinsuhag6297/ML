import React, { useState } from 'react';
import { BankLogo } from './BankLogo';
import { ShieldCheck, Mail, MapPin } from 'lucide-react';
import { ModalWrapper } from './ModalWrapper';
import { useLanguage } from '../contexts/LanguageContext';

interface FooterProps {
  onNavigateHome: () => void;
  onNavigateDashboard: () => void;
  onOpenEligibility: () => void;
  onOpenEmiCalculator: () => void;
  onOpenCompareBanks: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateHome,
  onNavigateDashboard,
  onOpenEligibility,
  onOpenEmiCalculator,
  onOpenCompareBanks,
}) => {
  const { t } = useLanguage();
  const [activeInfoModal, setActiveInfoModal] = useState<'about' | 'privacy' | 'disclaimer' | 'contact' | null>(
    null
  );

  return (
    <footer className="bg-[#0B192C] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800 text-xs">
          
          {/* Brand & Overview */}
          <div className="lg:col-span-2 space-y-4">
            <button
              type="button"
              onClick={onNavigateHome}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden cursor-pointer"
              title="LoanLens - Return to Home"
            >
              <BankLogo bankId="loanlens" size="sm" />
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white">
                  Loan<span className="text-teal-400">Lens</span>
                </span>
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider -mt-1">
                  {t('brand.tagline', 'Smart Loan Assistance')}
                </span>
              </div>
            </button>
            
            <p className="text-slate-400 leading-relaxed max-w-sm">
              {t('footer.brandDesc', 'Explore loan options, compare banks, calculate your EMI, and check your loan eligibility — all in one place with LoanLens.')}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-teal-400 font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{t('footer.privacyBadge', 'Zero-storage cloud privacy: evaluations stay in your browser sandbox.')}</span>
            </div>
          </div>

          {/* Core Navigation Tools */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white">
              {t('footer.navHeading', 'Navigation')}
            </p>
            <ul className="space-y-2 text-slate-400 font-medium">
              <li>
                <button
                  type="button"
                  onClick={onNavigateHome}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('nav.home', 'Home')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onNavigateDashboard}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('nav.dashboard', 'Dashboard')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenEligibility}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('nav.eligibilityAndRisk', 'Loan Eligibility & Risk')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenEmiCalculator}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('nav.emiCalculator', 'EMI Calculator')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenCompareBanks}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('nav.compareBanks', 'Compare Banks')}
                </button>
              </li>
            </ul>
          </div>

          {/* Benchmark Lenders from MultiBank Dataset */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white">
              {t('footer.partnersHeading', 'Benchmark Lenders')}
            </p>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center gap-1.5">
                <BankLogo bankId="sbi" size="sm" />
                <span>State Bank of India (SBI)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <BankLogo bankId="hdfc" size="sm" />
                <span>HDFC Bank</span>
              </li>
              <li className="flex items-center gap-1.5">
                <BankLogo bankId="icici" size="sm" />
                <span>ICICI Bank</span>
              </li>
              <li className="flex items-center gap-1.5">
                <BankLogo bankId="axis" size="sm" />
                <span>Axis Bank</span>
              </li>
              <li className="flex items-center gap-1.5">
                <BankLogo bankId="bob" size="sm" />
                <span>Bank of Baroda (BoB)</span>
              </li>
            </ul>
          </div>

          {/* Legal Disclosures */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white">
              {t('footer.transparencyHeading', 'Transparency')}
            </p>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => setActiveInfoModal('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('footer.aboutLink', 'About LoanLens')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveInfoModal('privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('footer.privacyLink', 'Privacy Policy')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveInfoModal('disclaimer')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('footer.disclaimerLink', 'RBI Regulatory Disclaimer')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveInfoModal('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('footer.contactLink', 'Contact & Support')}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>{t('footer.copyright', '© 2026 LoanLens — Smart Loan Assistance. All rights reserved.')}</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>{t('footer.statsNote', '184+ Schemes Indexed · RBI Repo Benchmark: 6.50% · Private In-Browser Sandbox')}</span>
          </div>
        </div>
      </div>

      {/* Info Modals */}
      <ModalWrapper
        isOpen={activeInfoModal === 'about'}
        onClose={() => setActiveInfoModal(null)}
        title={t('footer.aboutLink', 'About LoanLens')}
        subtitle={t('brand.tagline', 'Smart Loan Assistance Platform')}
        maxWidth="2xl"
      >
        <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
          <p>
            <strong>LoanLens</strong> is an interactive digital lending intelligence platform designed to help
            borrowers explore loan options, compare leading Indian commercial banks, calculate precise reducing-balance EMIs,
            and evaluate approval headroom against RBI-mandated Fixed Obligation to Income Ratios (FOIR).
          </p>
          <p>
            Powered by an authentic MultiBank dataset of over 184 loan schemes across premier public and private sector
            lenders in India, LoanLens brings clarity, transparency, and consumer peace of mind to retail borrowing decisions.
          </p>
        </div>
      </ModalWrapper>

      <ModalWrapper
        isOpen={activeInfoModal === 'privacy'}
        onClose={() => setActiveInfoModal(null)}
        title={t('footer.privacyLink', 'Data Privacy Policy')}
        subtitle="Local Sandbox & Complete Browser Isolation"
        maxWidth="2xl"
      >
        <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
          <p>
            LoanLens operates with a strict <strong>Zero-Persistence Architecture</strong>:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              All financial inputs (income, obligations, CIBIL scores) are computed strictly inside your browser.
            </li>
            <li>No personal identification or financial records are stored on remote servers.</li>
            <li>Your evaluations remain 100% confidential and private.</li>
          </ul>
        </div>
      </ModalWrapper>

      <ModalWrapper
        isOpen={activeInfoModal === 'disclaimer'}
        onClose={() => setActiveInfoModal(null)}
        title={t('footer.disclaimerLink', 'Regulatory & Non-Banking Disclaimer')}
        subtitle="Mandatory Consumer Awareness Disclosure"
        maxWidth="2xl"
      >
        <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
          <p>
            <strong>Important Notice:</strong> LoanLens is an independent financial technology decision support platform.
            It is not a bank, non-banking financial company (NBFC), or licensed lending institution.
          </p>
          <p>
            All calculations, interest benchmarks, and eligibility metrics are based on published public lender rates
            and regulatory guidelines. Final loan sanctions and terms remain at the sole discretion of the respective banks.
          </p>
        </div>
      </ModalWrapper>

      <ModalWrapper
        isOpen={activeInfoModal === 'contact'}
        onClose={() => setActiveInfoModal(null)}
        title={t('footer.contactLink', 'Support & Inquiries')}
        subtitle="LoanLens Assistance"
        maxWidth="md"
      >
        <div className="text-xs text-slate-600 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <Mail className="w-4 h-4 text-teal-700" />
            <div>
              <p className="font-bold text-slate-900">Email Inquiry</p>
              <p className="text-[11px] text-slate-500 font-mono">support@loanlens.in</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <MapPin className="w-4 h-4 text-teal-700" />
            <div>
              <p className="font-bold text-slate-900">Digital Banking Intelligence</p>
              <p className="text-[11px] text-slate-500">Fintech Hub, India</p>
            </div>
          </div>
        </div>
      </ModalWrapper>
    </footer>
  );
};
