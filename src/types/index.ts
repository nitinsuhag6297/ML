export type EmploymentType = 'salaried' | 'self_employed_professional' | 'self_employed_business' | 'gig_worker';

export type LoanType = 'home' | 'personal' | 'auto' | 'business' | 'education';

export type RiskCategory = 'Low Risk' | 'Moderate Risk' | 'High Risk';

export interface ShapItem {
  feature: string;
  label: string;
  impact: 'increases_risk' | 'reduces_risk';
  impact_percentage: number;
  shap_value: number;
  summary: string;
}

export interface ApplicantProfile {
  fullName: string;
  age: number;
  employmentType: EmploymentType;
  employerName?: string;
  workExperienceYears: number;
  monthlyIncome: number; // in INR
  coApplicantIncome: number; // in INR
  existingEmiObligations: number; // in INR
  cibilScore: number; // 300 - 900
  loanAmountRequested: number; // in INR
  tenureYears: number;
  loanType: LoanType;
  priorDefaults: boolean;
  collateralValue?: number;
  residentialStatus: 'owned' | 'rented' | 'mortgaged' | 'family';
}

export interface PredictionResult {
  id: string;
  timestamp: string;
  applicantName: string;
  requestedAmount: number;
  loanType: LoanType;
  riskProbability: number; // 0 to 100 percentage
  riskCategory: RiskCategory;
  isEligible: boolean;
  cibilScore: number;
  foir: number; // Fixed Obligation to Income Ratio %
  ltvRatio?: number; // Loan to Value %
  maxEligibleAmount: number;
  recommendedInterestRate: number;
  featureImportance: {
    factor: string;
    impact: 'positive' | 'negative' | 'neutral';
    weightPercentage: number;
    description: string;
  }[];
  matchedBanks: {
    bankId: string;
    bankName: string;
    approvalLikelihood: 'High' | 'Medium' | 'Low';
    indicativeRate: number;
    specialRemarks: string;
  }[];
  recommendations: string[];
  shap_explanation?: ShapItem[];
}

export interface BankInfo {
  id: string;
  name: string;
  shortName: string;
  brandColor: string;
  logoBg: string;
  accentColor: string;
  tagline: string;
  established: number;
  headquarters: string;
  benchmarkRate: string; // e.g. "RLLR 6.50% + spread"
  loans: Record<
    Exclude<LoanType, 'education'>,
    {
      interestRateMin: number;
      interestRateMax: number;
      processingFee: string;
      maxTenureYears: number;
      minCibilRequired: number;
      maxLoanAmountLakhs: number;
      specialOffer?: string;
      lastVerifiedDate: string;
    }
  > & {
    education?: {
      interestRateMin: number;
      interestRateMax: number;
      processingFee: string;
      maxTenureYears: number;
      minCibilRequired: number;
      maxLoanAmountLakhs: number;
      specialOffer?: string;
      lastVerifiedDate: string;
    };
  };
  customerCare: string;
  website: string;
}

export interface AmortizationRow {
  year: number;
  month: number;
  openingBalance: number;
  emi: number;
  principalPaid: number;
  interestPaid: number;
  closingBalance: number;
}

export interface EmiCalculationResult {
  loanAmount: number;
  annualInterestRate: number;
  tenureMonths: number;
  monthlyEmi: number;
  totalInterest: number;
  totalRepayment: number;
  interestRatio: number; // % of total payment that is interest
  schedule: AmortizationRow[];
}
