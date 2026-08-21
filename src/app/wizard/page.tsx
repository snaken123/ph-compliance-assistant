'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ExternalLink, 
  Building2, 
  MapPin, 
  FileText, 
  ShieldCheck, 
  Calculator, 
  CalendarDays, 
  Users, 
  HelpCircle,
  Clock,
  AlertTriangle,
  BookOpen,
  Info,
  CheckSquare
} from 'lucide-react';
import { PHILIPPINE_PROVINCES, POPULAR_BIR_RDOS } from '@/lib/ph-locations';

export default function ComplianceWizardPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stepCompleted, setStepCompleted] = useState<Record<number, boolean>>({});

  // Wizard Form State
  const [formData, setFormData] = useState({
    businessName: 'FlowForceRM',
    tradeName: 'FlowForceRM',
    businessActivity: 'SaaS / Software Development',
    dtiScope: 'NATIONAL', // BARANGAY, CITY, REGIONAL, NATIONAL
    province: 'Metro Manila (NCR)',
    cityMunicipality: 'Parañaque City',
    barangay: 'Barangay BF Homes',
    addressDetail: '123 Innovation Street',
    propertyType: 'owned_residence',
    isHomeBased: true,
    isOnline: true,
    monthlyGrossReceipts: 10000,
    taxRegime: 'EIGHT_PERCENT', // EIGHT_PERCENT, GRADUATED
    
    // Govt Identifiers
    tinNumber: '',
    birRdoNumber: 'RDO 052 - Parañaque City',
    sssNumber: '',
    philHealthPin: '',
    pagIbigMid: '',
    dtiCertificateNo: '',
    lguBinNumber: '',

    hasEmployees: false,
    hasContractors: true,
    mode: 'REGISTRATION'
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      const data = await res.json();
      if (data.success && data.profile) {
        setFormData({
          businessName: data.profile.businessName || 'FlowForceRM',
          tradeName: data.profile.tradeName || 'FlowForceRM',
          businessActivity: data.profile.businessActivity || 'SaaS / Software Development',
          dtiScope: 'NATIONAL',
          province: data.profile.province || 'Metro Manila (NCR)',
          cityMunicipality: data.profile.cityMunicipality || 'Parañaque City',
          barangay: data.profile.barangay || 'Barangay BF Homes',
          addressDetail: data.profile.addressDetail || '',
          propertyType: data.profile.propertyType || 'owned_residence',
          isHomeBased: data.profile.isHomeBased ?? true,
          isOnline: data.profile.isOnline ?? true,
          monthlyGrossReceipts: data.profile.monthlyGrossReceipts || 10000,
          taxRegime: data.profile.taxRegime || 'EIGHT_PERCENT',
          
          tinNumber: data.profile.tinNumber || '',
          birRdoNumber: data.profile.birRdoNumber || 'RDO 052 - Parañaque City',
          sssNumber: data.profile.sssNumber || '',
          philHealthPin: data.profile.philHealthPin || '',
          pagIbigMid: data.profile.pagIbigMid || '',
          dtiCertificateNo: data.profile.dtiCertificateNo || '',
          lguBinNumber: data.profile.lguBinNumber || '',
          
          hasEmployees: data.profile.hasEmployees ?? false,
          hasContractors: data.profile.hasContractors ?? true,
          mode: data.profile.mode || 'REGISTRATION'
        });
      }
    } catch (err) {
      console.error('Failed loading profile for wizard:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveWizardProgress = async () => {
    setSaving(true);
    try {
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setStepCompleted((prev) => ({ ...prev, [currentStep]: true }));
    } catch (err) {
      console.error('Error saving wizard progress:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleNextStep = async () => {
    await saveWizardProgress();
    if (currentStep < 7) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const availableCities = PHILIPPINE_PROVINCES[formData.province] || PHILIPPINE_PROVINCES['Metro Manila (NCR)'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-slate-400 text-sm animate-pulse">Loading Step-by-Step Compliance Wizard...</div>
      </div>
    );
  }

  const wizardSteps = [
    { number: 1, title: 'DTI Name & Scope', desc: 'Business identity & territorial scope' },
    { number: 2, title: 'Barangay Clearance', desc: 'Local neighborhood clearance' },
    { number: 3, title: 'LGU Mayor’s Permit', desc: 'BPLO & Zoning permits' },
    { number: 4, title: 'BIR Registration', desc: 'Form 2303, Books & Invoices' },
    { number: 5, title: 'SSS, PhilHealth, Pag-IBIG', desc: 'Mandatory social security' },
    { number: 6, title: 'DOLE & Contractors', desc: 'Worker classification audit' },
    { number: 7, title: 'Compliance Calendar', desc: 'Automated BIR & LGU filing setup' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      
      {/* Wizard Banner Header */}
      <div className="p-6 rounded-3xl glass-panel border border-blue-500/30 bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[11px] font-bold flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1" /> STEP-BY-STEP REGISTRATION WIZARD
              </span>
              <span className="text-xs text-slate-400 font-mono">Step {currentStep} of 7</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Philippine Sole Proprietorship Registration & Setup Guide
            </h1>
            <p className="text-xs text-slate-300">
              Complete step-by-step statutory walkthrough with official government portal URLs, exact fees, legal basis, and filing guides.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevStep}
              disabled={currentStep === 1}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs disabled:opacity-40 transition flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Previous
            </button>
            <button
              onClick={handleNextStep}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center"
            >
              <span>{currentStep === 7 ? 'Complete & Generate Reports' : 'Save & Continue'}</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 h-2 rounded-full mt-5 overflow-hidden border border-slate-800">
          <div 
            className="bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-400 h-full transition-all duration-500"
            style={{ width: `${(currentStep / 7) * 100}%` }}
          />
        </div>
      </div>

      {/* Stepper Tabs Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
        {wizardSteps.map((step) => {
          const isActive = currentStep === step.number;
          const isDone = stepCompleted[step.number] || currentStep > step.number;
          return (
            <button
              key={step.number}
              onClick={() => setCurrentStep(step.number)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                isActive 
                  ? 'bg-blue-950/80 border-blue-500 text-white shadow-lg shadow-blue-500/10' 
                  : isDone 
                  ? 'bg-slate-900/90 border-emerald-500/50 text-slate-300' 
                  : 'bg-slate-900/50 border-slate-800/80 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-blue-500 text-white' : isDone ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {isDone ? '✓' : `0${step.number}`}
                </span>
              </div>
              <p className="text-xs font-bold mt-2 truncate">{step.title}</p>
              <p className="text-[10px] text-slate-400 truncate">{step.desc}</p>
            </button>
          );
        })}
      </div>

      {/* STEP 1 CONTENT: DTI Business Name Registration */}
      {currentStep === 1 && (
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-6 bg-slate-900/90">
          <div className="flex items-start justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-bold text-white">Step 1: DTI Business Name Registration (BNR)</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Required under <strong>Act 3883 (Philippine Business Name Law)</strong> for sole proprietors before engaging in commercial transactions.
              </p>
            </div>
            <a 
              href="https://bnrs.dti.gov.ph" 
              target="_blank" 
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-bold transition flex items-center space-x-1.5"
            >
              <span>DTI BNRS Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Proposed Business Name</label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Territorial Scope</label>
              <select
                value={formData.dtiScope}
                onChange={(e) => setFormData({ ...formData, dtiScope: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="NATIONAL">National Scope — ₱2,000 + ₱30 Doc Stamp</option>
                <option value="REGIONAL">Regional Scope — ₱1,000 + ₱30 Doc Stamp</option>
                <option value="CITY">City / Municipality Scope — ₱500 + ₱30 Doc Stamp</option>
                <option value="BARANGAY">Barangay Scope — ₱200 + ₱30 Doc Stamp</option>
              </select>
            </div>
          </div>

          {/* Instruction Details */}
          <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-800/60 space-y-3 text-xs">
            <div className="flex items-center space-x-2 font-bold text-blue-300">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>Step-by-Step Instructions & Requirements</span>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-slate-300 leading-relaxed">
              <li>Visit the official DTI BNRS portal: <a href="https://bnrs.dti.gov.ph" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">https://bnrs.dti.gov.ph</a>.</li>
              <li>Accept terms, select <strong>Sole Proprietorship</strong>, and enter owner identity details (1 Valid Philippine Government ID).</li>
              <li>Input proposed business name keywords (e.g. <em>"FlowForceRM SaaS Solutions"</em>).</li>
              <li>Pay filing fee online via GCash, Maya, Credit Card, or Landbank LinkBizPortal.</li>
              <li>Download & print your official **DTI Certificate of Business Name Registration (valid for 5 years)**.</li>
            </ol>
          </div>
        </div>
      )}

      {/* STEP 2 CONTENT: Barangay Clearance */}
      {currentStep === 2 && (
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-6 bg-slate-900/90">
          <div className="flex items-start justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-bold text-white">Step 2: Barangay Business Clearance</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Required under <strong>Local Government Code RA 7160 Section 152(c)</strong> from your specific local Barangay Hall.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Province / Region</label>
              <select
                value={formData.province}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {Object.keys(PHILIPPINE_PROVINCES).map((prov) => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">City / Municipality</label>
              <select
                value={formData.cityMunicipality}
                onChange={(e) => setFormData({ ...formData, cityMunicipality: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {availableCities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Barangay Name</label>
              <input
                type="text"
                value={formData.barangay}
                onChange={(e) => setFormData({ ...formData, barangay: e.target.value })}
                placeholder="e.g. Barangay BF Homes, Barangay Bel-Air"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/60 space-y-3 text-xs">
            <div className="flex items-center space-x-2 font-bold text-amber-300">
              <Info className="w-4 h-4 text-amber-400" />
              <span>Barangay Clearance Checklist for {formData.barangay || 'Your Barangay'}</span>
            </div>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
              <li>Photocopy of DTI Certificate of Registration.</li>
              <li>2 Valid Government Issued IDs (Driver's License, Passport, UMID).</li>
              <li>Proof of Address (Lease Agreement if renting residence, or Land Title / Tax Declaration if owned).</li>
              <li>Fee: Estimated ₱200 - ₱500 (Varies by Barangay ordinance).</li>
            </ul>
          </div>
        </div>
      )}

      {/* STEP 3 CONTENT: LGU Mayor's Permit / BPLO */}
      {currentStep === 3 && (
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-6 bg-slate-900/90">
          <div className="flex items-start justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-bold text-white">Step 3: LGU Mayor’s Permit / Business Permit (BPLO)</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Issued by the Business Permits and Licensing Office (BPLO) of {formData.cityMunicipality} under <strong>Local Government Code RA 7160</strong>.
              </p>
            </div>
            <a 
              href="https://bfp.gov.ph" 
              target="_blank" 
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center space-x-1.5"
            >
              <span>BFP Fire Safety Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-800/60 space-y-3 text-xs">
            <h3 className="font-bold text-indigo-300 flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1.5 text-indigo-400" /> Sub-Clearances Included in Mayor's Permit Package:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-white block">1. Zoning Clearance</span>
                <span className="text-[11px] text-slate-400">Verifies location is permitted for home occupation or commercial use.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-white block">2. Fire Safety Inspection Certificate (FSIC)</span>
                <span className="text-[11px] text-slate-400">Issued by Bureau of Fire Protection (BFP). Fee: ~₱500 - ₱1,500.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-white block">3. Sanitary Permit</span>
                <span className="text-[11px] text-slate-400">Health office clearance. Fee: ~₱300 - ₱800.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-white block">4. Annual Mayor's Permit License</span>
                <span className="text-[11px] text-slate-400">Renewable every January 1 to 20. Fee: ~₱2,000 - ₱5,000.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4 CONTENT: BIR Registration & Form 2303 */}
      {currentStep === 4 && (
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-6 bg-slate-900/90">
          <div className="flex items-start justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <Calculator className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-white">Step 4: BIR Form 2303 Certificate of Registration (COR)</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Under the <strong>National Internal Revenue Code (NIRC)</strong> & <strong>EOPT Act RA 11976</strong>.
              </p>
            </div>
            <a 
              href="https://orus.bir.gov.ph" 
              target="_blank" 
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition flex items-center space-x-1.5"
            >
              <span>BIR ORUS Online Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">BIR Revenue District Office (RDO)</label>
              <select
                value={formData.birRdoNumber}
                onChange={(e) => setFormData({ ...formData, birRdoNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {POPULAR_BIR_RDOS.map((rdo) => (
                  <option key={rdo} value={rdo}>{rdo}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Elected Income Tax Option</label>
              <select
                value={formData.taxRegime}
                onChange={(e) => setFormData({ ...formData, taxRegime: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="EIGHT_PERCENT">8% Flat Income Tax Rate (Replaces Income Tax & Percentage Tax)</option>
                <option value="GRADUATED">Graduated Income Tax Schedule (0%-35%) + 3% Percentage Tax</option>
              </select>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/60 space-y-2 text-xs text-emerald-200">
            <div className="flex items-center space-x-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>EOPT Act RA 11976 Major Update: ₱500 Annual Registration Fee ABOLISHED!</span>
            </div>
            <p className="text-slate-300">
              Starting January 22, 2024, taxpayers are <strong>NO LONGER required to pay the ₱500 Annual Registration Fee (ARF)</strong> or file BIR Form 0605 for registration.
            </p>
          </div>
        </div>
      )}

      {/* STEP 5 CONTENT: SSS, PhilHealth, Pag-IBIG */}
      {currentStep === 5 && (
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-6 bg-slate-900/90">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center">
              <Users className="w-5 h-5 text-blue-400 mr-2" /> Step 5: SSS, PhilHealth & Pag-IBIG Mandatory Registration
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Required for all self-employed sole proprietors under RA 11199 (SSS), RA 11223 (Universal Health Care), and RA 9679 (Pag-IBIG).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            
            {/* SSS */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-blue-400 block">1. SSS Self-Employed</span>
              <p className="text-slate-400 text-[11px]">Monthly contributions based on salary credit schedule.</p>
              <a href="https://www.sss.gov.ph" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline flex items-center pt-1 font-bold">
                My.SSS Portal <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>

            {/* PhilHealth */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-emerald-400 block">2. PhilHealth Self-Directing</span>
              <p className="text-slate-400 text-[11px]">5% premium rate for self-earning individuals.</p>
              <a href="https://www.philhealth.gov.ph" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline flex items-center pt-1 font-bold">
                PhilHealth Portal <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>

            {/* Pag-IBIG */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-amber-400 block">3. Pag-IBIG Fund</span>
              <p className="text-slate-400 text-[11px]">₱200 minimum monthly contribution.</p>
              <a href="https://www.pagibigfundservices.com" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline flex items-center pt-1 font-bold">
                Pag-IBIG eServices <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>

          </div>
        </div>
      )}

      {/* STEP 6 CONTENT: DOLE & Independent Contractor Audit */}
      {currentStep === 6 && (
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-6 bg-slate-900/90">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center">
              <AlertTriangle className="w-5 h-5 text-amber-400 mr-2" /> Step 6: DOLE Contractor Compliance & 4-Fold Control Test Audit
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Evaluates labor legal risks under <strong>DOLE Department Order No. 174 (Series of 2017)</strong> and Labor Code Article 106.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/60 space-y-2 text-xs text-amber-200">
            <h3 className="font-bold text-amber-300">The 4-Fold Legal Test for Worker Classification:</h3>
            <ol className="list-decimal list-inside space-y-1 text-slate-300">
              <li><strong>Selection & Engagement</strong>: Did you recruit/select the worker?</li>
              <li><strong>Payment of Wages</strong>: Do you pay regular fixed wages vs project-based invoices?</li>
              <li><strong>Power of Dismissal</strong>: Do you have disciplinary/termination authority?</li>
              <li><strong>Power of Control (Crucial Test)</strong>: Do you control the *means and methods* of work?</li>
            </ol>
          </div>
        </div>
      )}

      {/* STEP 7 CONTENT: Ongoing Reports & Compliance Calendar */}
      {currentStep === 7 && (
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-6 bg-slate-900/90">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center">
              <CalendarDays className="w-5 h-5 text-emerald-400 mr-2" /> Step 7: Ongoing BIR Filings & LGU Annual Renewals
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Your recurring tax calendar is automatically configured based on your 8% Tax election.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-blue-400 block">BIR Form 1701Q (Quarterly Income Tax)</span>
              <p className="text-slate-300">Due: May 15 (Q1), Aug 15 (Q2), Nov 15 (Q3).</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-emerald-400 block">BIR Form 1701A (Annual Income Tax)</span>
              <p className="text-slate-300">Due: April 15 of every year.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-amber-400 block">LGU Annual Business Permit Renewal</span>
              <p className="text-slate-300">Due: January 1 to January 20 every year.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-indigo-400 block">BIR Form 2307 Withholding Certificates</span>
              <p className="text-slate-300">Issued to contractors within 20 days after end of quarter.</p>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Link
              href="/"
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 text-white font-bold text-xs shadow-xl shadow-blue-600/30 transition flex items-center space-x-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Complete Setup & Launch Dashboard Reports</span>
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
