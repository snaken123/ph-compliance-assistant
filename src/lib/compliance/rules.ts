import { RuleDefinition, BusinessProfileData } from './types';
import { PHILIPPINE_GOVERNMENT_SOURCES } from './sources';

export const GOVERNMENT_RULES: RuleDefinition[] = [
  // 1. DTI Business Name Registration
  {
    code: 'DTI_BNR',
    agency: 'DTI',
    title: 'DTI Business Name Registration (BNR)',
    description: 'Registers the sole proprietor’s business name with the Department of Trade and Industry, securing trade name rights across the selected scope.',
    whyItApplies: 'Mandatory for all sole proprietorships operating under a business name in the Philippines.',
    whyItMightNotApply: 'Does not apply if operating under your exact legal personal name without any trade title, but essential for SaaS branding, bank accounts, and BIR registration.',
    consequencesAndPenalties: 'Fine up to ₱500 under Act No. 3883. Inability to register with BIR, open business bank accounts, or secure local permits.',
    priority: 'CRITICAL',
    estimatedFee: (p) => (p.isOnline ? 2030 : 530), // National scope P2000 + P30 LRF or City P500 + P30 LRF
    legalBasis: PHILIPPINE_GOVERNMENT_SOURCES.DTI_ACT_3883.lawCitation,
    officialSource: PHILIPPINE_GOVERNMENT_SOURCES.DTI_ACT_3883.agency,
    officialSourceUrl: PHILIPPINE_GOVERNMENT_SOURCES.DTI_ACT_3883.officialUrl,
    dateVerified: '2026-08-01',
    frequency: 'RENEWAL_5YR',
    evaluate: (profile: BusinessProfileData) => ({
      status: 'REQUIRED',
      reasoning: 'Every Philippine sole proprietorship using a business name (like FlowForceRM) must register with DTI prior to commercial operations.',
      actionItem: 'Register online at bnrs.dti.gov.ph for National Scope (₱2,030) or City Scope (₱530).'
    })
  },

  // 2. Barangay Business Clearance
  {
    code: 'BARANGAY_CLEARANCE',
    agency: 'BARANGAY',
    title: 'Barangay Business Clearance / Home Occupation Verification',
    description: 'Clearance from the local Barangay Hall permitting business activities in the barangay jurisdiction.',
    whyItApplies: 'Required by LGUs under the Local Government Code prior to obtaining a Mayor’s Business Permit.',
    whyItMightNotApply: 'Home-based online digital businesses (SaaS) without foot traffic, public noise, storage, or employees in residential zones are often handled under Home Occupation guidelines or exempted in certain progressive LGUs.',
    consequencesAndPenalties: 'Inability to obtain Mayor’s/Business Permit if mandatory in your specific LGU. Potential local ordinance citation.',
    priority: 'CONDITIONAL',
    estimatedFee: 500,
    legalBasis: PHILIPPINE_GOVERNMENT_SOURCES.RA_7160_LGC.lawCitation,
    officialSource: PHILIPPINE_GOVERNMENT_SOURCES.RA_7160_LGC.agency,
    officialSourceUrl: PHILIPPINE_GOVERNMENT_SOURCES.RA_7160_LGC.officialUrl,
    dateVerified: '2026-08-01',
    frequency: 'ANNUAL',
    evaluate: (profile: BusinessProfileData) => {
      if (profile.isHomeBased && profile.isOnline) {
        return {
          status: 'NEEDS_VERIFICATION',
          reasoning: `Because ${profile.businessName} is a home-based online SaaS operating in ${profile.barangay}, ${profile.cityMunicipality}, local LGU rules determine whether a standard commercial clearance or home occupation undertaking applies.`,
          actionItem: `Contact ${profile.barangay} Hall and submit a query regarding home-based online SaaS clearance requirements.`
        };
      }
      return {
        status: 'REQUIRED',
        reasoning: 'Commercial premises require a standard Barangay Business Clearance.',
        actionItem: 'Visit Barangay Hall with DTI Certificate and proof of business location.'
      };
    }
  },

  // 3. LGU Mayor's / Business Permit
  {
    code: 'LGU_MAYORS_PERMIT',
    agency: 'LGU',
    title: 'Mayor’s Business Permit & Local Business Tax (LBT)',
    description: 'Annual permit issued by the City/Municipal Business Permits and Licensing Office (BPLO).',
    whyItApplies: 'Mandatory under RA 7160 for commercial establishments conducting business within municipal borders.',
    whyItMightNotApply: 'Some LGUs evaluate home-based online software developers under simplified Home Occupation rules or exempt non-commercial residential freelancers from full commercial zoning/fire/sanitary permits.',
    consequencesAndPenalties: '25% surcharge on unpaid LBT + 2% per month penalty under RA 7160 Sec. 168. Possible closure notice for commercial stores.',
    priority: 'HIGH',
    estimatedFee: 2500,
    legalBasis: PHILIPPINE_GOVERNMENT_SOURCES.RA_7160_LGC.lawCitation,
    officialSource: PHILIPPINE_GOVERNMENT_SOURCES.RA_7160_LGC.agency,
    officialSourceUrl: PHILIPPINE_GOVERNMENT_SOURCES.RA_7160_LGC.officialUrl,
    dateVerified: '2026-08-01',
    frequency: 'ANNUAL',
    evaluate: (profile: BusinessProfileData) => {
      if (profile.isHomeBased && profile.isOnline) {
        return {
          status: 'NEEDS_VERIFICATION',
          reasoning: `City rules in ${profile.cityMunicipality} vary regarding home-based digital SaaS. BPLO verification is necessary to confirm if a formal Mayor's Permit or Home Occupation registration is needed.`,
          actionItem: `Inquire at ${profile.cityMunicipality} BPLO regarding Home Occupation rules for online SaaS sole proprietors.`
        };
      }
      return {
        status: 'REQUIRED',
        reasoning: 'Operating from a commercial or leased office mandates full Mayor’s Permit registration.',
        actionItem: 'File application at City Hall BPLO with DTI, Barangay Clearance, and Lease Contract.'
      };
    }
  },

  // 4. BIR Certificate of Registration (Form 2303)
  {
    code: 'BIR_COR',
    agency: 'BIR',
    title: 'BIR Certificate of Registration (BIR Form 2303)',
    description: 'Official tax registration certificate issued by the Bureau of Internal Revenue Revenue District Office (RDO).',
    whyItApplies: 'Mandatory for every person earning income in the Philippines under the National Internal Revenue Code (NIRC).',
    whyItMightNotApply: 'No exceptions exist for income earners in the Philippines.',
    consequencesAndPenalties: '25% surcharge + 12% annual interest on unpaid tax, plus BIR compromise penalties (₱1,000 - ₱50,000) under NIRC Sec. 258.',
    priority: 'CRITICAL',
    estimatedFee: 30, // P30 DST. Note: Annual Registration Fee (P500) ABOLISHED by RA 11976 EOPT Act!
    legalBasis: PHILIPPINE_GOVERNMENT_SOURCES.BIR_EOPT_ACT.lawCitation,
    officialSource: PHILIPPINE_GOVERNMENT_SOURCES.BIR_EOPT_ACT.agency,
    officialSourceUrl: PHILIPPINE_GOVERNMENT_SOURCES.BIR_EOPT_ACT.officialUrl,
    dateVerified: '2026-08-01',
    frequency: 'ONE_TIME',
    evaluate: (profile: BusinessProfileData) => ({
      status: 'REQUIRED',
      reasoning: 'Federal tax compliance is mandatory. Under RA 11976 (EOPT Act), the annual ₱500 registration fee is ABOLISHED, but Form 2303 registration remains mandatory.',
      actionItem: 'Submit BIR Form 1901 to your designated RDO along with DTI Certificate, ID, and Barangay/LGU proof.'
    })
  },

  // 5. BIR Books of Accounts
  {
    code: 'BIR_BOOKS',
    agency: 'BIR',
    title: 'Registration of Books of Accounts',
    description: 'Registration of manual or electronic books of accounts (General Journal, General Ledger, Cash Receipts, Cash Disbursements) with the BIR.',
    whyItApplies: 'Mandatory under BIR regulations for recording all business income and expenses.',
    whyItMightNotApply: 'No exceptions; every registered business must maintain registered books.',
    consequencesAndPenalties: 'Compromise penalty from ₱1,000 to ₱50,000 depending on gross sales under BIR Revenue Memorandum Order No. 7-2015.',
    priority: 'CRITICAL',
    estimatedFee: 200,
    legalBasis: PHILIPPINE_GOVERNMENT_SOURCES.BIR_NIRC_TRAIN.lawCitation,
    officialSource: PHILIPPINE_GOVERNMENT_SOURCES.BIR_NIRC_TRAIN.agency,
    officialSourceUrl: PHILIPPINE_GOVERNMENT_SOURCES.BIR_NIRC_TRAIN.officialUrl,
    dateVerified: '2026-08-01',
    frequency: 'ONE_TIME',
    evaluate: (profile: BusinessProfileData) => ({
      status: 'REQUIRED',
      reasoning: 'All BIR-registered entities must stamp and register bound columnar books or register computerized accounting systems via BIR ORUS.',
      actionItem: 'Purchase columnar books at an office supply store and register them via BIR ORUS or RDO stamp upon receiving Form 2303.'
    })
  },

  // 6. BIR Registered Invoices (EOPT Act RA 11976)
  {
    code: 'BIR_INVOICING',
    agency: 'BIR',
    title: 'BIR Registered Invoices (Authority to Print - ATP)',
    description: 'Printing or digital issuance of official tax invoices registered with the BIR. Under RA 11976 (EOPT Act 2024), INVOICE is the sole primary evidence of sales for goods and services.',
    whyItApplies: 'Mandatory for issuing legal proof of payment/sales to customers.',
    whyItMightNotApply: 'No exceptions; SaaS businesses issuing billing must issue registered Invoices.',
    consequencesAndPenalties: 'Penalty for issuing non-registered receipts or failure to issue invoices (₱10,000 to ₱50,000 penalty under NIRC Sec. 264).',
    priority: 'CRITICAL',
    estimatedFee: 1200,
    legalBasis: PHILIPPINE_GOVERNMENT_SOURCES.BIR_EOPT_ACT.lawCitation,
    officialSource: PHILIPPINE_GOVERNMENT_SOURCES.BIR_EOPT_ACT.agency,
    officialSourceUrl: PHILIPPINE_GOVERNMENT_SOURCES.BIR_EOPT_ACT.officialUrl,
    dateVerified: '2026-08-01',
    frequency: 'ONE_TIME',
    evaluate: (profile: BusinessProfileData) => ({
      status: 'REQUIRED',
      reasoning: 'The Ease of Paying Taxes Act unified receipts into INVOICES. FlowForceRM must issue BIR-registered invoices to subscribers.',
      actionItem: 'Apply for Authority to Print (ATP - BIR Form 1906) with a BIR-accredited printer or apply for computerized invoice system.'
    })
  },

  // 7. National Privacy Commission (DPA RA 10173)
  {
    code: 'NPC_PRIVACY_NOTICE',
    agency: 'NPC',
    title: 'Data Privacy Compliance & Privacy Policy',
    description: 'Publication of a transparent Privacy Notice and adherence to data security principles under the Data Privacy Act of 2012.',
    whyItApplies: 'Applies to any business processing personal data (user accounts, emails, billing details) of Philippine individuals.',
    whyItMightNotApply: 'Formal NPC portal registration is mandatory only if processing >= 1,000 sensitive records or 250+ employees, but Privacy Law compliance IS mandatory for all SaaS operators.',
    consequencesAndPenalties: 'Imprisonment up to 6 years and fines up to ₱5,000,000 for unauthorized processing or privacy security breaches under RA 10173.',
    priority: 'HIGH',
    estimatedFee: 0,
    legalBasis: PHILIPPINE_GOVERNMENT_SOURCES.NPC_DPA_2012.lawCitation,
    officialSource: PHILIPPINE_GOVERNMENT_SOURCES.NPC_DPA_2012.agency,
    officialSourceUrl: PHILIPPINE_GOVERNMENT_SOURCES.NPC_DPA_2012.officialUrl,
    dateVerified: '2026-08-01',
    frequency: 'ONE_TIME',
    evaluate: (profile: BusinessProfileData) => {
      if (profile.businessActivity.toLowerCase().includes('saas') || profile.isOnline) {
        return {
          status: 'REQUIRED',
          reasoning: 'As an online SaaS business storing subscriber user data, data privacy policy compliance is mandatory under RA 10173.',
          actionItem: 'Draft and publish a Data Privacy Policy on FlowForceRM website and implement SSL, password hashing, and encrypted backups.'
        };
      }
      return {
        status: 'RECOMMENDED',
        reasoning: 'Recommended for all businesses retaining client contact lists.',
        actionItem: 'Maintain standard client privacy safeguards.'
      };
    }
  },

  // 8. SSS Self-Employed Registration
  {
    code: 'SSS_SELF_EMPLOYED',
    agency: 'SSS',
    title: 'SSS Self-Employed Member Coverage',
    description: 'Social security registration as a self-employed member for retirement, disability, and sickness benefits.',
    whyItApplies: 'Mandatory under RA 11199 for all self-employed individuals earning at least ₱2,000 monthly.',
    whyItMightNotApply: 'Only if already covered under another mandatory SSS employer or earning less than ₱2,000/month.',
    consequencesAndPenalties: 'Loss of social protection benefits, retirement pension build-up, and disability insurance.',
    priority: 'HIGH',
    estimatedFee: 570, // Min monthly contribution approx
    legalBasis: PHILIPPINE_GOVERNMENT_SOURCES.SSS_RA_11199.lawCitation,
    officialSource: PHILIPPINE_GOVERNMENT_SOURCES.SSS_RA_11199.agency,
    officialSourceUrl: PHILIPPINE_GOVERNMENT_SOURCES.SSS_RA_11199.officialUrl,
    dateVerified: '2026-08-01',
    frequency: 'ANNUAL',
    evaluate: (profile: BusinessProfileData) => ({
      status: 'REQUIRED',
      reasoning: 'As a sole proprietor earning over ₱2,000/month, self-employed SSS contribution is required under RA 11199.',
      actionItem: 'Register as Self-Employed Member via SSS My.SSS portal or branch.'
    })
  },

  // 9. Employer Government Contributions (SSS, PhilHealth, Pag-IBIG)
  {
    code: 'EMPLOYEE_GOVT_CONTRIBUTIONS',
    agency: 'SSS',
    title: 'Employer Registration (SSS, PhilHealth, Pag-IBIG)',
    description: 'Registering as an employer to deduct and remit mandatory employee contributions for staff.',
    whyItApplies: 'Mandatory whenever a business hires regular, probationary, or casual employees under Philippine Labor Law.',
    whyItMightNotApply: 'NOT APPLICABLE when the business has NO employees. Independent contractors, freelancers, and commission agents are NOT employees under DOLE rules.',
    consequencesAndPenalties: 'Non-applicable if no formal employees. Criminal liability and penalties apply only if actual employees exist and are unremitted.',
    priority: 'LOW',
    estimatedFee: 0,
    legalBasis: PHILIPPINE_GOVERNMENT_SOURCES.DOLE_FOUR_FOLD.lawCitation,
    officialSource: PHILIPPINE_GOVERNMENT_SOURCES.DOLE_FOUR_FOLD.agency,
    officialSourceUrl: PHILIPPINE_GOVERNMENT_SOURCES.DOLE_FOUR_FOLD.officialUrl,
    dateVerified: '2026-08-01',
    frequency: 'ANNUAL',
    evaluate: (profile: BusinessProfileData) => {
      if (!profile.hasEmployees || profile.employeeCount === 0) {
        return {
          status: 'NOT_APPLICABLE',
          reasoning: 'FlowForceRM has NO formal employees. Independent contractors/freelancers do NOT trigger employer SSS/PhilHealth/Pag-IBIG registration under DOLE Labor Code.',
          actionItem: 'No employer registration required at this stage. Re-evaluate if you hire formal employees in the future.'
        };
      }
      return {
        status: 'REQUIRED',
        reasoning: 'Hiring formal employees triggers mandatory SSS/PhilHealth/Pag-IBIG employer registration.',
        actionItem: 'Register as Employer with SSS, PhilHealth, and Pag-IBIG within 30 days of hiring.'
      };
    }
  }
];
