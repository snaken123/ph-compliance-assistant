'use client';

import React, { useState } from 'react';
import { calculatePhilippineTax } from '@/lib/compliance/tax-calculator';
import { 
  Calculator, 
  TrendingUp, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function TaxCalculatorPage() {
  const [monthlyGross, setMonthlyGross] = useState<number>(10000);
  const [customGrossInput, setCustomGrossInput] = useState<string>('');

  const taxResult = calculatePhilippineTax(monthlyGross);

  const presets = [
    { label: '₱10,000/mo', val: 10000 },
    { label: '₱25,000/mo', val: 25000 },
    { label: '₱50,000/mo', val: 50000 },
    { label: '₱100,000/mo', val: 100000 },
    { label: '₱200,000/mo', val: 200000 },
    { label: '₱500,000/mo', val: 500000 },
    { label: '₱1,000,000/mo', val: 1000000 },
  ];

  const handleCustomInput = (val: string) => {
    setCustomGrossInput(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0) {
      setMonthlyGross(num);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Philippine Sole Proprietor Tax Simulator</h1>
            <p className="text-xs text-slate-400">
              Compare the 8% Gross Income Tax Regime (with ₱250,000 exemption) vs Graduated Rates + 3% Percentage Tax under TRAIN Act (RA 10963) & EOPT Act (RA 11976).
            </p>
          </div>
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/80 flex items-center space-x-3 text-xs text-amber-200">
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
        <div>
          <strong className="font-bold">ESTIMATE ONLY — NOT AN OFFICIAL TAX RETURN OR BINDING LEGAL ADVICE.</strong> Consult a Certified Public Accountant (CPA) or BIR RDO for official tax filings.
        </div>
      </div>

      {/* Interactive Revenue Input Controls */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white">Select or Enter Monthly Revenue</h3>
        
        {/* Preset Buttons */}
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.val}
              onClick={() => {
                setMonthlyGross(p.val);
                setCustomGrossInput('');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                monthlyGross === p.val
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Range Slider & Custom Input */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 items-center">
          <div className="sm:col-span-2">
            <label className="block text-xs text-slate-400 mb-1">
              Monthly Receipts Slider: <strong className="text-white font-mono">₱{monthlyGross.toLocaleString()}</strong>
            </label>
            <input
              type="range"
              min="5000"
              max="300000"
              step="5000"
              value={monthlyGross}
              onChange={(e) => {
                setMonthlyGross(Number(e.target.value));
                setCustomGrossInput('');
              }}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Custom Amount (₱ / mo)</label>
            <input
              type="number"
              placeholder="e.g. 75000"
              value={customGrossInput}
              onChange={(e) => handleCustomInput(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
          <span className="text-slate-400">Calculated Annual Gross Receipts:</span>
          <span className="text-xl font-extrabold text-white font-mono">₱{taxResult.annualGross.toLocaleString()} / year</span>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: 8% Flat Tax Option */}
        <div className={`p-6 rounded-2xl glass-card border space-y-4 ${
          taxResult.recommendedRegime === 'EIGHT_PERCENT' ? 'border-emerald-500/60 bg-emerald-950/20' : 'border-slate-800'
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                OPTION A (RECOMMENDED FOR SaaS)
              </span>
              <h3 className="text-lg font-bold text-white mt-1">8% Gross Income Tax Rate</h3>
              <p className="text-xs text-slate-400">Replaces both Income Tax and 3% Percentage Tax</p>
            </div>
            {taxResult.recommendedRegime === 'EIGHT_PERCENT' && (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-md">
                RECOMMENDED
              </span>
            )}
          </div>

          <div className="space-y-2 py-3 border-y border-slate-800/80 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Annual Gross Receipts:</span>
              <span className="text-white font-mono font-medium">₱{taxResult.annualGross.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">TRAIN Act Sole Proprietor Exemption:</span>
              <span className="text-emerald-400 font-mono font-medium">- ₱{taxResult.eightPercentTax.exemptAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span className="text-slate-200">Taxable Receipts Base:</span>
              <span className="text-white font-mono">₱{taxResult.eightPercentTax.taxableReceipts.toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-2">
            <span className="text-xs text-slate-400">Estimated Total Annual Tax:</span>
            <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-1">
              ₱{taxResult.eightPercentTax.annualTaxDue.toLocaleString()} / yr
            </div>
            <span className="text-xs text-slate-400 block mt-1">
              (Approx. ₱{taxResult.eightPercentTax.quarterlyTaxDue.toLocaleString()} / quarter)
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
            {taxResult.eightPercentTax.notes}
          </div>
        </div>

        {/* Card 2: Graduated Tax Option */}
        <div className={`p-6 rounded-2xl glass-card border space-y-4 ${
          taxResult.recommendedRegime === 'GRADUATED' ? 'border-blue-500/60 bg-blue-950/20' : 'border-slate-800'
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800 font-mono">
                OPTION B
              </span>
              <h3 className="text-lg font-bold text-white mt-1">Graduated Rates + 3% Percentage Tax</h3>
              <p className="text-xs text-slate-400">Standard tax brackets + BIR Form 2551Q</p>
            </div>
            {taxResult.recommendedRegime === 'GRADUATED' && (
              <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-xs shadow-md">
                RECOMMENDED
              </span>
            )}
          </div>

          <div className="space-y-2 py-3 border-y border-slate-800/80 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Net Taxable Income (40% OSD):</span>
              <span className="text-white font-mono font-medium">₱{taxResult.graduatedTax.netTaxableIncome.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Graduated Income Tax Due:</span>
              <span className="text-slate-200 font-mono">₱{taxResult.graduatedTax.annualIncomeTaxDue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">3% Percentage Tax (2551Q):</span>
              <span className="text-slate-200 font-mono">₱{taxResult.graduatedTax.annualPercentageTaxDue.toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-2">
            <span className="text-xs text-slate-400">Estimated Total Annual Tax:</span>
            <div className="text-3xl font-extrabold text-blue-400 font-mono mt-1">
              ₱{taxResult.graduatedTax.totalAnnualTaxDue.toLocaleString()} / yr
            </div>
            <span className="text-xs text-slate-400 block mt-1">
              (Approx. ₱{taxResult.graduatedTax.quarterlyTotalTaxDue.toLocaleString()} / quarter)
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
            {taxResult.graduatedTax.notes}
          </div>
        </div>

      </div>

      {/* Estimated Tax Savings Callout */}
      <div className="p-6 rounded-2xl glass-panel border border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Simulated Tax Savings</span>
          <h3 className="text-xl font-bold text-white">
            Selecting 8% Tax Rate saves estimated <span className="text-emerald-400 font-mono">₱{taxResult.estimatedSavings.toLocaleString()}</span> annually
          </h3>
          <p className="text-xs text-slate-400">
            Because FlowForceRM earns ₱{taxResult.annualGross.toLocaleString()}/yr, electing the 8% regime in Q1 BIR Form 1701Q completely exempts the first ₱250,000 of income!
          </p>
        </div>
      </div>

    </div>
  );
}
