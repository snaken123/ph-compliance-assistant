export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'CONDITIONAL' | 'NEEDS_VERIFICATION';

export type ApplicabilityStatus = 
  | 'REQUIRED' 
  | 'CONDITIONAL' 
  | 'RECOMMENDED' 
  | 'NOT_APPLICABLE' 
  | 'NEEDS_VERIFICATION';

export type CompletionState = 
  | 'NOT_STARTED' 
  | 'IN_PROGRESS' 
  | 'SUBMITTED' 
  | 'COMPLETED' 
  | 'WAIVED' 
  | 'OVERDUE';

export type TaxRegime = 'EIGHT_PERCENT' | 'GRADUATED' | 'VAT' | 'UNDECIDED';

export type AppMode = 'REGISTRATION' | 'ONGOING';

export interface BusinessProfileData {
  id?: string;
  businessName: string;
  tradeName: string;
  businessActivity: string;
  isOnline: boolean;
  isHomeBased: boolean;
  propertyType: 'owned_residence' | 'rental_residence' | 'commercial_office' | 'virtual_office';
  province: string;
  cityMunicipality: string;
  barangay: string;
  addressDetail: string;
  hasEmployees: boolean;
  employeeCount: number;
  hasContractors: boolean;
  hasForeignClients: boolean;
  hasLocalClients: boolean;
  monthlyGrossReceipts: number;
  annualGrossReceipts: number;
  taxRegime: TaxRegime;
  mode: AppMode;
}

export interface RuleDefinition {
  code: string;
  agency: 'DTI' | 'BARANGAY' | 'LGU' | 'BIR' | 'NPC' | 'SSS' | 'PHILHEALTH' | 'PAGIBIG';
  title: string;
  description: string;
  whyItApplies: string;
  whyItMightNotApply: string;
  consequencesAndPenalties: string;
  priority: PriorityLevel;
  estimatedFee: number | ((profile: BusinessProfileData) => number);
  legalBasis: string;
  officialSource: string;
  officialSourceUrl: string;
  dateVerified: string;
  frequency: 'ONE_TIME' | 'ANNUAL' | 'QUARTERLY' | 'RENEWAL_5YR';
  evaluate: (profile: BusinessProfileData) => {
    status: ApplicabilityStatus;
    reasoning: string;
    actionItem?: string;
  };
}

export interface CalculatedRequirement {
  code: string;
  agency: string;
  title: string;
  description: string;
  whyItApplies: string;
  whyItMightNotApply: string;
  consequencesAndPenalties: string;
  priority: PriorityLevel;
  applicabilityStatus: ApplicabilityStatus;
  completionState: CompletionState;
  estimatedFee: number;
  legalBasis: string;
  officialSource: string;
  officialSourceUrl: string;
  dateVerified: string;
  frequency: string;
  reasoning: string;
  actionItem?: string;
}

export interface TaxCalculationResult {
  monthlyGross: number;
  annualGross: number;
  regime: TaxRegime;
  isVatExempt: boolean;
  eightPercentTax: {
    taxableReceipts: number;
    exemptAmount: number;
    annualTaxDue: number;
    quarterlyTaxDue: number;
    notes: string;
  };
  graduatedTax: {
    estimatedOperatingExpenses: number; // 40% OSD baseline
    netTaxableIncome: number;
    annualIncomeTaxDue: number;
    percentageTaxRate: number; // 3%
    annualPercentageTaxDue: number;
    totalAnnualTaxDue: number;
    quarterlyTotalTaxDue: number;
    notes: string;
  };
  recommendedRegime: TaxRegime;
  estimatedSavings: number;
  assumptions: string[];
}
