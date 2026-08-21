export interface LegalSource {
  id: string;
  agency: string;
  shortName: string;
  fullTitle: string;
  lawCitation: string;
  officialUrl: string;
  dateVerified: string;
  summary: string;
}

export const PHILIPPINE_GOVERNMENT_SOURCES: Record<string, LegalSource> = {
  DTI_ACT_3883: {
    id: 'DTI_ACT_3883',
    agency: 'Department of Trade and Industry (DTI)',
    shortName: 'Business Name Law',
    fullTitle: 'Act No. 3883 (An Act to Regulate the Use in Business Transactions of Names Other Than True Names)',
    lawCitation: 'Act No. 3883 as amended by Act No. 4147 and RA 863; DTI DAO 18-07',
    officialUrl: 'https://bnrs.dti.gov.ph',
    dateVerified: '2026-08-01',
    summary: 'Requires any person operating a business under a name other than their true name to register the business name with DTI prior to operation. Valid for 5 years.'
  },
  RA_7160_LGC: {
    id: 'RA_7160_LGC',
    agency: 'Local Government Units (LGU) / DILG',
    shortName: 'Local Government Code of 1991',
    fullTitle: 'Republic Act No. 7160 (Local Government Code of 1991)',
    lawCitation: 'RA 7160 Title III; DILG-DTI-DICT Joint Memorandum Circular No. 2019-01',
    officialUrl: 'https://dilg.gov.ph',
    dateVerified: '2026-08-01',
    summary: 'Grants LGUs (Cities/Municipalities/Barangays) authority to levy local business taxes (LBT) and require business permits. JMC 2019-01 mandates streamlined processing.'
  },
  BIR_NIRC_TRAIN: {
    id: 'BIR_NIRC_TRAIN',
    agency: 'Bureau of Internal Revenue (BIR)',
    shortName: 'National Internal Revenue Code (TRAIN Act)',
    fullTitle: 'Republic Act No. 10963 (Tax Reform for Acceleration and Inclusion - TRAIN Act)',
    lawCitation: 'NIRC Section 24(A)(2)(b) as amended by RA 10963; Revenue Regulations No. 8-2018',
    officialUrl: 'https://www.bir.gov.ph',
    dateVerified: '2026-08-01',
    summary: 'Establishes the optional 8% Income Tax Rate on gross receipts in excess of ₱250,000 for self-employed sole proprietors in lieu of graduated rates and percentage tax.'
  },
  BIR_EOPT_ACT: {
    id: 'BIR_EOPT_ACT',
    agency: 'Bureau of Internal Revenue (BIR)',
    shortName: 'Ease of Paying Taxes Act',
    fullTitle: 'Republic Act No. 11976 (Ease of Paying Taxes Act of 2024)',
    lawCitation: 'RA 11976; Revenue Regulations No. 4-2024 & RR 7-2024',
    officialUrl: 'https://www.bir.gov.ph',
    dateVerified: '2026-08-01',
    summary: 'Abolished the annual ₱500 Registration Fee (BIR Form 0605 for ARF) starting 2024. Unified legal sales proof under single INVOICE system.'
  },
  NPC_DPA_2012: {
    id: 'NPC_DPA_2012',
    agency: 'National Privacy Commission (NPC)',
    shortName: 'Data Privacy Act of 2012',
    fullTitle: 'Republic Act No. 10173 (Data Privacy Act of 2012)',
    lawCitation: 'RA 10173; NPC Circular No. 2022-01',
    officialUrl: 'https://privacy.gov.ph',
    dateVerified: '2026-08-01',
    summary: 'Regulates processing of personal information. SaaS businesses collecting user accounts/data must publish Privacy Notices and implement security measures.'
  },
  DOLE_FOUR_FOLD: {
    id: 'DOLE_FOUR_FOLD',
    agency: 'Department of Labor and Employment (DOLE)',
    shortName: 'DOLE Contractor Classification Rules',
    fullTitle: 'DOLE Department Order No. 174-17 / Supreme Court Four-Fold Test',
    lawCitation: 'Labor Code of the Philippines Art. 106-109; SC G.R. No. 165442 (Calamba Medical Center)',
    officialUrl: 'https://www.dole.gov.ph',
    dateVerified: '2026-08-01',
    summary: 'Determines whether a service contributor is an Independent Contractor or Employee based on Selection, Wages, Dismissal, and Control over means and methods.'
  },
  SSS_RA_11199: {
    id: 'SSS_RA_11199',
    agency: 'Social Security System (SSS)',
    shortName: 'Social Security Act of 2018',
    fullTitle: 'Republic Act No. 11199 (Social Security Act of 2018)',
    lawCitation: 'RA 11199 Sec. 9-A (Self-Employed Coverage)',
    officialUrl: 'https://www.sss.gov.ph',
    dateVerified: '2026-08-01',
    summary: 'Mandates self-employed individuals earning at least ₱2,000/month to register and pay voluntary/self-employed SSS monthly contributions.'
  }
};
