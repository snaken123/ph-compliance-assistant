import { describe, it, expect } from 'vitest';
import { evaluateBusinessCompliance } from '../src/lib/compliance/engine';
import { calculatePhilippineTax } from '../src/lib/compliance/tax-calculator';
import { BusinessProfileData } from '../src/lib/compliance/types';

describe('Philippine Sole Proprietorship Compliance Rule Engine', () => {
  const flowForceProfile: BusinessProfileData = {
    businessName: 'FlowForceRM',
    tradeName: 'FlowForceRM',
    businessActivity: 'SaaS / Software Development',
    isOnline: true,
    isHomeBased: true,
    propertyType: 'owned_residence',
    province: 'Metro Manila',
    cityMunicipality: 'Quezon City',
    barangay: 'Barangay Holy Spirit',
    addressDetail: 'Quezon City',
    hasEmployees: false,
    employeeCount: 0,
    hasContractors: true,
    hasForeignClients: true,
    hasLocalClients: true,
    monthlyGrossReceipts: 10000,
    annualGrossReceipts: 120000,
    taxRegime: 'EIGHT_PERCENT',
    mode: 'REGISTRATION'
  };

  it('correctly marks DTI and BIR COR as REQUIRED and CRITICAL', () => {
    const result = evaluateBusinessCompliance(flowForceProfile);
    
    const dtiReq = result.requirements.find(r => r.code === 'DTI_BNR');
    const birCorReq = result.requirements.find(r => r.code === 'BIR_COR');

    expect(dtiReq).toBeDefined();
    expect(dtiReq?.applicabilityStatus).toBe('REQUIRED');
    expect(dtiReq?.priority).toBe('CRITICAL');

    expect(birCorReq).toBeDefined();
    expect(birCorReq?.applicabilityStatus).toBe('REQUIRED');
    expect(birCorReq?.priority).toBe('CRITICAL');
  });

  it('marks Employee SSS/PhilHealth/Pag-IBIG as NOT_APPLICABLE when zero employees exist', () => {
    const result = evaluateBusinessCompliance(flowForceProfile);
    const empGovtReq = result.requirements.find(r => r.code === 'EMPLOYEE_GOVT_CONTRIBUTIONS');

    expect(empGovtReq).toBeDefined();
    expect(empGovtReq?.applicabilityStatus).toBe('NOT_APPLICABLE');
  });

  it('marks Barangay Clearance and LGU Mayor Permit as NEEDS_VERIFICATION for home-based SaaS', () => {
    const result = evaluateBusinessCompliance(flowForceProfile);
    const brgyReq = result.requirements.find(r => r.code === 'BARANGAY_CLEARANCE');
    const lguReq = result.requirements.find(r => r.code === 'LGU_MAYORS_PERMIT');

    expect(brgyReq?.applicabilityStatus).toBe('NEEDS_VERIFICATION');
    expect(lguReq?.applicabilityStatus).toBe('NEEDS_VERIFICATION');
  });
});

describe('Philippine Tax Simulator (TRAIN Act RA 10963 & EOPT Act RA 11976)', () => {
  it('calculates ₱0 tax due for ₱10k monthly (₱120k annual) under 8% regime due to ₱250k exemption', () => {
    const tax = calculatePhilippineTax(10000);
    expect(tax.annualGross).toBe(120000);
    expect(tax.eightPercentTax.exemptAmount).toBe(120000);
    expect(tax.eightPercentTax.taxableReceipts).toBe(0);
    expect(tax.eightPercentTax.annualTaxDue).toBe(0);
    expect(tax.recommendedRegime).toBe('EIGHT_PERCENT');
  });

  it('correctly calculates 8% tax for ₱50k monthly (₱600k annual)', () => {
    const tax = calculatePhilippineTax(50000);
    expect(tax.annualGross).toBe(600000);
    // Taxable base = 600,000 - 250,000 = 350,000
    expect(tax.eightPercentTax.taxableReceipts).toBe(350000);
    // Tax = 350,000 * 0.08 = 28,000
    expect(tax.eightPercentTax.annualTaxDue).toBe(28000);
  });
});
