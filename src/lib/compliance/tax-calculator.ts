import { TaxCalculationResult, TaxRegime } from './types';

export function calculatePhilippineTax(monthlyGross: number, selectedRegime: TaxRegime = 'EIGHT_PERCENT'): TaxCalculationResult {
  const annualGross = monthlyGross * 12;
  const isVatExempt = annualGross <= 3000000;

  // 1. Calculate 8% Flat Tax Option (TRAIN Act RA 10963)
  // For sole proprietors, 8% tax applies to gross receipts exceeding P250,000.
  const EXEMPT_THRESHOLD = 250000;
  const eightPercentTaxableReceipts = Math.max(0, annualGross - EXEMPT_THRESHOLD);
  const eightPercentAnnualTax = eightPercentTaxableReceipts * 0.08;
  const eightPercentQuarterlyTax = eightPercentAnnualTax / 4;

  // 2. Calculate Graduated Tax Option + 3% Percentage Tax
  // Assuming Optional Standard Deduction (OSD) of 40% for simplicity and accuracy in estimations
  const osdExpense = annualGross * 0.40;
  const netTaxableIncome = annualGross - osdExpense;

  let graduatedAnnualTax = 0;
  if (netTaxableIncome <= 250000) {
    graduatedAnnualTax = 0;
  } else if (netTaxableIncome <= 400000) {
    graduatedAnnualTax = (netTaxableIncome - 250000) * 0.15;
  } else if (netTaxableIncome <= 800000) {
    graduatedAnnualTax = 22500 + (netTaxableIncome - 400000) * 0.20;
  } else if (netTaxableIncome <= 2000000) {
    graduatedAnnualTax = 102500 + (netTaxableIncome - 800000) * 0.25;
  } else if (netTaxableIncome <= 8000000) {
    graduatedAnnualTax = 402500 + (netTaxableIncome - 2000000) * 0.30;
  } else {
    graduatedAnnualTax = 2202500 + (netTaxableIncome - 8000000) * 0.35;
  }

  // 3% Percentage Tax under BIR Form 2551Q (applies if graduated rate selected)
  const percentageTaxRate = 0.03;
  const annualPercentageTax = annualGross * percentageTaxRate;
  const totalGraduatedRegimeTax = graduatedAnnualTax + annualPercentageTax;
  const quarterlyGraduatedTax = totalGraduatedRegimeTax / 4;

  // Recommendation engine
  let recommendedRegime: TaxRegime = 'EIGHT_PERCENT';
  let estimatedSavings = 0;

  if (!isVatExempt) {
    recommendedRegime = 'VAT';
    estimatedSavings = 0;
  } else {
    if (eightPercentAnnualTax <= totalGraduatedRegimeTax) {
      recommendedRegime = 'EIGHT_PERCENT';
      estimatedSavings = totalGraduatedRegimeTax - eightPercentAnnualTax;
    } else {
      recommendedRegime = 'GRADUATED';
      estimatedSavings = eightPercentAnnualTax - totalGraduatedRegimeTax;
    }
  }

  const assumptions = [
    'ESTIMATE ONLY — NOT AN OFFICIAL TAX RETURN OR BINDING LEGAL ADVICE',
    'Based on NIRC Sec. 24(A)(2)(b) as amended by RA 10963 (TRAIN Act) & RA 11976 (EOPT Act).',
    'Includes ₱250,000 annual exemption deduction allowed specifically for sole proprietors under the 8% regime.',
    'Graduated rates assume 40% Optional Standard Deduction (OSD) baseline and 3% Percentage Tax (BIR Form 2551Q).',
    'VAT registration becomes mandatory once annual gross receipts exceed ₱3,000,000.'
  ];

  return {
    monthlyGross,
    annualGross,
    regime: selectedRegime,
    isVatExempt,
    eightPercentTax: {
      taxableReceipts: eightPercentTaxableReceipts,
      exemptAmount: Math.min(annualGross, EXEMPT_THRESHOLD),
      annualTaxDue: eightPercentAnnualTax,
      quarterlyTaxDue: eightPercentQuarterlyTax,
      notes: annualGross <= EXEMPT_THRESHOLD 
        ? '₱0 Tax Due! Your annual revenue is completely covered by the ₱250,000 TRAIN Act sole proprietor exemption.'
        : `Taxed at 8% on receipts over ₱250,000. Exempts ₱${EXEMPT_THRESHOLD.toLocaleString()} automatically.`
    },
    graduatedTax: {
      estimatedOperatingExpenses: osdExpense,
      netTaxableIncome,
      annualIncomeTaxDue: graduatedAnnualTax,
      percentageTaxRate,
      annualPercentageTaxDue: annualPercentageTax,
      totalAnnualTaxDue: totalGraduatedRegimeTax,
      quarterlyTotalTaxDue: quarterlyGraduatedTax,
      notes: 'Requires filing BIR Form 1701/1701Q (Income Tax) AND BIR Form 2551Q (Quarterly Percentage Tax).'
    },
    recommendedRegime,
    estimatedSavings,
    assumptions
  };
}
